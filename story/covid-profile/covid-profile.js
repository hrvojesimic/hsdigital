const START_DATE = new Date('2020-01-21');
const END_DATE = dayjs().subtract(1, 'day').toDate();
const EURO_COUNTRIES = ["Ireland", "United Kingdom", "France", "Spain", "Portugal", "Germany", "Denmark", "Netherlands", "Belgium", "Italy", "Austria", "Switzerland", "Sweden", "Norway", "Finland", "Iceland", "Luxembourg", "Poland", "Ukraine", "Belarus", "Slovenia", "Bosnia and Herzegovina", "Serbia", "Hungary", "Albania", "Romania", "Bulgaria", "Greece", "Slovakia", "Czech Republic", "Macedonia", "Kosovo", "Montenegro", "Latvia", "Lithuania", "Estonia", "Cyprus", "Moldova", "Croatia", "Malta"];

const preparation = {
  owidDeaths: "https://covid.ourworldindata.org/data/ecdc/total_deaths.csv",
  owidCases:  "https://covid.ourworldindata.org/data/ecdc/total_cases.csv",
  testing:    "/story/covid-profile/weekly_testing_data_EUEEAUK_2020-10-15.csv",
  alias:      "/dataset/countries/alias.json",
  region:     "/dataset/countries/regions.json",
  population: "/dataset/countries/population.json",
  combined: {
    waitFor: ["alias", "population", "region", "owidDeaths", "owidCases", "testing"],
    construction: combineAllData
  },
  corrCoefs: {
    waitFor: ["combined"],
    construction: buildCorrelations
  }
};

function dataCompleted() {
  addSimpleCharts();
}

function addSimpleCharts() {
  for (let el of document.querySelectorAll('.schart')) {
    covidChart(
      el, 
      el.dataset.territory, 
      el.dataset
    );
  }
}

function combineAllData() {
  const result = [];
  let day = dayjs(START_DATE);
  while (day < END_DATE) {
    const dateStr = day.toISOString().substring(0,10);
    const weekStr = "2020-W" + (day.week() <= 9? "0" : "") + day.week();
    const casesForDate  = data.owidCases.find(d => d.date === dateStr);
    const deathsForDate = data.owidDeaths.find(d => d.date === dateStr);
    const regionSum = {};
    for (let r in data.region) {
      regionSum[r] = {
        date:      day,
        dateStr:   dateStr,
        territory: r,
        cases: 0, deaths: 0, weekTests: 0, weekPositives: 0
      };
    }
    for (let territory of EURO_COUNTRIES) {
      const ccode = data.alias[territory];
      let testingRow = data.testing.find(d =>
         data.alias[d.country] === ccode && d.year_week === weekStr
      );
      if (!testingRow)
        testingRow = {tests_done: 0, testing_rate: 0, positivity_rate: 0};
      if (!casesForDate)
        continue;
      const entry = {
        date:      day,
        dateStr:   dateStr,
        ccode:     ccode,
        territory: territory,
        cases:     +casesForDate[territory],
        deaths:    +deathsForDate[territory],
        weekTests:     (+testingRow.tests_done),
        weekPositives: Math.round((+testingRow.positivity_rate)*(+testingRow.tests_done)/100)
      };
      result.push(entry);
      for (let r in data.region) {
        if (!data.region[r].includes(ccode)) continue;
        regionSum[r].cases         += entry.cases;
        regionSum[r].deaths        += entry.deaths;
        regionSum[r].weekTests     += entry.weekTests;
        regionSum[r].weekPositives += entry.weekPositives;
      }
    }
    for (let r in data.region) {
      result.push(regionSum[r]);
    }
    day = day.add(1, 'day');
  }
  return result;
}

function getPopulation(cname) {
  if (data.population[cname])
    return data.population[cname];
  const ccode = data.alias[cname];
  if (ccode) 
    return +data.population[ccode];
  if (data.region[cname])
    return data.region[cname].reduce(
      (sum, key) => sum + getPopulation(key),
      0
    );
  console.warn("No data on " + cname);
  return 0;
}

function calculateData(territory, avgw) {
  const result = [];
  const suba = data.combined.filter(d => d.territory === territory);
  const n = suba.length;
  const population = getPopulation(territory);
  for (let i = Math.max(14, avgw + 1); i < n; i++) {
    const back = i - 1 - avgw;
    let fore = (i + avgw < n)? i + avgw : n-1;
    while (!suba[fore] && fore > 0) fore--;
    const dt = fore - back;
    const dCases  = suba[fore].cases  - suba[back].cases;
    const dDeaths = suba[fore].deaths - suba[back].deaths;
    const cases2w = (suba[fore].cases - suba[fore - 14].cases) / population / 10;
    const positivityRate = suba[i].weekPositives / suba[i].weekTests;
    const testRate = suba[i].weekTests / population / 10;
    if (dCases > 0 || dDeaths > 0)
      result.push({
        dateStr: suba[i].dateStr,
        date: suba[i].date,
        cases:  dCases / dt / population / 10,
        cases2w: cases2w,
        deaths: dDeaths / dt / population / 10,
        weekTestRate: testRate,
        weekPosRate:  positivityRate,
        alarm: calculateAlarm(testRate, positivityRate, cases2w)
      });
  }
  return result;
}

function calculateAlarm(test, pos, c2w) {
  if (test < 300) return -1;
  if (pos >= 0.04) return (c2w < 50)? 1 : 2;
  return (c2w < 25)? 0 : (c2w < 150)? 1 : 2;
}

function calculateCfr(timeseries, offset) {
  const result = [];
  for (let i = 0; i < timeseries.length - offset - 1; i++)
    if (timeseries[i] && timeseries[i+offset] && timeseries[i].cases > 0.1)
      result.push({
        date: timeseries[i].date,
        cfr: timeseries[i + offset].deaths / timeseries[i].cases
      });
  return result;
}

function covidChart(node, territory, {show = 'cdftpa', dmax, offset=0, radius=15}) {
  offset = +offset;
  radius = +radius;
  dmax = (+dmax) / 10;
  const dims = {
    width:   350, 
    heightC: 200, 
    heightF: show.includes('f')? 160 : 0,
    heightT: show.includes('t')? 100 : 0,
    gap:     show.includes('t')?  15 : 0,
    left:    40, 
    right:   60, 
    top:     5, 
    bottom:  20
  };
  const tdata = calculateData(territory, +radius);
  const maxCases = d3.max(tdata, d => d.cases);
  const uniqueId = nextUniqueId();
  const totalHeight = 
    dims.top + dims.heightC + dims.gap + dims.heightF + dims.gap + dims.heightT + dims.bottom;

  const topSvg = d3.select(node)
    .append("svg")
      .attr("viewBox", `0,0,${dims.left + dims.width + dims.right},${totalHeight}`);
  
  topSvg.append("defs").html(`
    <pattern id="${uniqueId}" viewBox="0,0,${offset},100" width="10%" height="100%" stroke="black" stroke-opacity="30%" stroke-width="0.5">
      <line x1="${offset}" y1="0" x2="1" y2="50"/>
      <line x1="1" y1="50" x2="${offset}" y2="100"/>
    </pattern>
  `);
  const root = topSvg.append("g")
      .attr("transform", "translate(" + dims.left + "," + dims.top + ")");

  xScale = d3.scaleTime()
    .domain([ START_DATE, END_DATE ])
    .range([ 0, dims.width ]);
  root.append("g").attr("class", "leftAxis")
    .attr("transform", `translate(0,${totalHeight - dims.top - dims.bottom})`)
    .call(d3.axisBottom(xScale).ticks(d3.timeMonth, 1).tickFormat(d3.timeFormat('%b')));

  const offsetPixels = xScale(-offset*24*3600*1000) - xScale(0);
  const chartAreaC = root.append("g").attr("class", "chartArea");
  const chartAreaF = root.append("g")
    .attr("transform", "translate(0," + (dims.heightC + dims.gap) + ")");
  const chartAreaT = root.append("g")
    .attr("transform", "translate(0," + (dims.heightC + 2*dims.gap + dims.heightF) + ")");

  if (show.includes('d')) {
    chartAreaC.append("rect")
      .attr("x", 0).attr("y", 0)
      .attr("width", dims.width)
      .attr("height", dims.heightC)
      .attr("fill", `url(#${uniqueId})`);
  }
  
  chartAreaC.append("g")
    .attr("class", "territoryLabel")
    .attr("transform", `translate(6 25)`)
    .append("text").text(territory);

  if (offset > 0) {
    chartAreaC.append("g")
      .attr("class", "offsetLabel")
      .attr("transform", `translate(6 55)`)
      .append("text").text(" ← " + offset);
    chartAreaC.append("g")
      .attr("class", "offsetLabel")
      .attr("transform", `translate(6 85)`)
      .append("text").text(d3.format(".0%")(dmax/maxCases));
  }
  
  if (show.includes('c')) {
    const yCases = d3.scaleLinear()
      .domain([0, maxCases])
      .range([ dims.heightC, 0 ]);
    root.append("g")
      .attr("class", "leftAxis")
      .call(d3.axisLeft(yCases).ticks(6));
    root.append("g")
      .attr("class", "leftAxis vaxis")
      .append("text")
        .attr("transform", `translate(-30 ${dims.heightC/2}) rotate(-90)`)
        .text("daily cases per 100k");

    chartAreaC.append("path").attr("class", "casesArea")
      .datum(tdata)
      .attr("d", d3.area()
        .defined(d => !isNaN(d.cases))
        .x(d => xScale(d.date))
        .y0(yCases(0))
        .y1(d => yCases(d.cases? +d.cases : 0))
      );
  }

  if (show.includes('d')) {
    const yDeaths = d3.scaleLinear()
      .domain([0, dmax])
      .range([ dims.heightC, 0 ]);
    root.append("g")
      .attr("class", "rightAxis")
      .attr("transform", "translate(" + (dims.width) + ", 0)")
      .call(d3.axisRight(yDeaths).ticks(6));
    root.append("g")
      .attr("class", "rightAxis vaxis")
      .append("text")
        .attr("transform", `translate(${dims.width+45} ${dims.heightC/2}) rotate(-90)`)
        .text("daily deaths per 100k");
    chartAreaC.append("path").attr("class", "deathsArea")
      .datum(tdata)
      .attr("transform", `translate(${offsetPixels}, 0)`)
      .attr("d", d3.area()
        .defined(d => !isNaN(d.deaths))
        .x(d => xScale(d.date))
        .y0(yDeaths(0))
        .y1(d => yDeaths(d.deaths? +d.deaths : 0))
      );
  }

  if (show.includes('a')) {
    const alarmColorScale = d3.scaleOrdinal(
      [-1, 0, 1, 2], 
      ['lightgray', 'green', 'orange', 'red']
    );
    let alarmBlocks = [];
    let blockStart = 0;
    for (let i = 1; i < tdata.length; i++) {
      let a = tdata[i].alarm;
      if (a === undefined) continue;
      if (a != tdata[blockStart].alarm || i === tdata.length - 1) {
        alarmBlocks.push({
          startDate: tdata[blockStart].date,
          endDate: tdata[i - 1].date,
          alarm: tdata[blockStart].alarm
        });
        blockStart = i;
      }
    }
    chartAreaF.selectAll("line.alarm")
      .data(alarmBlocks)
      .enter()
        .append("rect")
        .attr("class", d => "alarm a" + d.alarm)
        .attr("x", d => xScale(d.startDate))
        .attr("y", 0)
        .attr("height", dims.heightF)
        .attr("width", d => xScale(d.endDate) - xScale(d.startDate));
  }

  if (show.includes('f')) {
    const cfrData = calculateCfr(tdata, offset);
    const yCfr = d3.scaleLinear()
      .domain([0, 0.20])//d3.max(cfrData, d => d.cfr)])
      .range([ dims.heightF, 0 ]);
    chartAreaF.append("g")
      .attr("class", "cfrAxis")
      .call(d3.axisLeft(yCfr).ticks(4).tickSize(-dims.width).tickFormat(d3.format(".0%")));
    chartAreaF.append("g")
      .attr("class", "cfrAxis vaxis")
      .append("text")
        .attr("transform", `translate(-30 ${dims.heightF/2}) rotate(-90)`)
        .text("CFR");
    chartAreaF.append("g")
      .attr("class", "cfrAxis")
      .attr("transform", `translate(${dims.width}, 0)`)
      .call(d3.axisRight(yCfr).ticks(10).tickSize(4).tickFormat(d3.format(".0%")));
    chartAreaF.append("path")
      .datum(cfrData)
      .attr("class", "cfrArea")
      .attr("d", d3.area()
        .x(d => xScale(d.date))
        .y0(yCfr(0))
        .y1(d => yCfr(+d.cfr))
      );
  }

  if (show.includes('t')) {
    const yTesting = d3.scaleLinear()
      .domain([0, d3.max(tdata, d => d.weekTestRate / 7)])
      .range([ dims.heightT, 0 ]);
    chartAreaT.append("g")
      .attr("class", "testingAxis")
      .attr("transform", "translate(" + (dims.width) + ", 0)")
      .call(d3.axisRight(yTesting).ticks(4));
    chartAreaT.append("g")
      .attr("class", "testingAxis vaxis")
      .append("text")
        .attr("transform", `translate(${dims.width+45} ${dims.heightT/2}) rotate(-90)`)
        .text("daily tests per 100k");

    chartAreaT.selectAll("line.gridLine")
      .data(range(2, 10).map(n => new Date(2020, n-1, 1)))
      .enter()
        .append("line")
          .attr("class", "gridLine")
          .attr("x1", d => xScale(d))
          .attr("x2", d => xScale(d))
          .attr("y1", 0)
          .attr("y2", dims.heightT);

    chartAreaT.append("path")
      .datum(tdata)
      .attr("class", "testingLine")
      .attr("d", d3.area()
        .defined(d => !isNaN(d.weekTestRate))
        .x(d => xScale(d.date))
        .y0(yTesting(0))
        .y1(d => yTesting(+d.weekTestRate / 7))
      );
  }

  if (show.includes('p')) {
    const yTesting = d3.scaleLinear()
      .domain([0, d3.max(tdata, d => d.weekPosRate)])
      .range([ dims.heightT, 0 ]);
    chartAreaT.append("g")
      .attr("class", "positiveAxis")
      .call(d3.axisLeft(yTesting).ticks(4).tickFormat(d3.format(".0%")));
    chartAreaT.append("g")
      .attr("class", "positiveAxis vaxis")
      .append("text")
        .attr("transform", `translate(${-30} ${dims.heightT/2}) rotate(-90)`)
        .text("tests positive");
    chartAreaT.append("path")
      .datum(tdata)
      .attr("class", "positiveLine")
      .attr("d", d3.line()
        .defined(d => !isNaN(d.weekPosRate))
        .x(d => xScale(d.date))
        .y(d => yTesting(d.weekPosRate? d.weekPosRate : 0))
      );
  }
}

function buildCorrelations() {
  const result = [];
  const widths = [0, 1, 3, 7, 15];
  for (let c of EURO_COUNTRIES.concat(Object.keys(data.region))) {
    for (let w of widths) {
      for (let q of [0,1]) {
        correlations(c, w, q).map( (r, i) => {
          result.push({c: c, q: q, w: w, i: i, r: r, r2: r*r});
        });
      }
    }
  }
  return result;
}

function correlations(country, w, q = 0) {
  const cd = calculateData(country, w).filter(
    d => d.dateStr >= '2020-03-01' && d.dateStr < '2020-09-21'
  );
  const c = cd.map(d => d.cases);
  const d = cd.map(d => d.deaths);
  const max = 90;
  const result = [];
  for (let n = 0; n <= 27; n++) {
    result.push(rcoef(
      c.slice(q * max,     (q + 1) * max),
      d.slice(q * max + n, (q + 1) * max + n)
    ));
  }
  return result;
}