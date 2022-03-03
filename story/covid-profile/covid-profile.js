const START_DATE = new Date('2020-01-21');
const END_DATE = new Date('2020-12-14');
const EURO_COUNTRIES = ["Ireland", "United Kingdom", "France", "Spain", "Portugal", "Germany", "Denmark", "Netherlands", "Belgium", "Italy", "Austria", "Switzerland", "Sweden", "Norway", "Finland", "Iceland", "Luxembourg", "Poland", "Ukraine", "Belarus", "Slovenia", "Bosnia and Herzegovina", "Serbia", "Hungary", "Albania", "Romania", "Bulgaria", "Greece", "Slovakia", "Czech Republic", "Macedonia", "Montenegro", "Latvia", "Lithuania", "Estonia", "Cyprus", "Moldova", "Croatia"];

const preparation = {
  world: "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json",
  countryCentroids: "/story/euro-neighbours/country-centroids.json",
  owidDeaths: "https://raw.githubusercontent.com/owid/covid-19-data/master/public/data/jhu/total_deaths.csv",//"https://covid.ourworldindata.org/data/ecdc/total_deaths.csv",
  owidCases:  "https://raw.githubusercontent.com/owid/covid-19-data/master/public/data/jhu/total_cases.csv",//"https://covid.ourworldindata.org/data/ecdc/total_cases.csv",
  testing:    "/story/covid-profile/weekly_testing_data_EUEEAUK_w44.csv",
  //combineRaw: "/story/covid-profile/combined.csv",
  //combineRaw: "/story/covid-profile/italy_region.csv",
  alias:      "/dataset/countries/alias.json",
  region:     "/dataset/countries/regions.json",
  population: "/dataset/countries/population.json",
  combined: {
    waitFor: ["alias", "population", "region", "owidDeaths", "owidCases", "testing"],
    construction: combineAllData
  },
  // combined: {
  //   waitFor: ["alias", "population", "region", "combineRaw"],
  //   construction: constructCombined
  // },
  corrCoefs: {
    waitFor: ["combined"],
    construction: buildCorrelations
  },
  // peakCorrelations: {
  //   waitFor: ["corrCoefs", "combined"],
  //   construction: calculatePeakCorrelations
  // },
  firstWaves: {
    waitFor: ["combined"],
    construction: constructFirstWaves
  },
  waveCorrelations: {
    waitFor: ["combined", "firstWaves"],
    construction: constructWaveCorrelations
  },
  peakCorrelations: {
    waitFor: ["waveCorrelations"],
    construction: constructPeakCorrelations
  }
};

function dataCompleted() {
  // createRidgeChart();
  addSimpleCharts();
  // createMap();
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

function constructCombined() {
  return data.combineRaw.map( row => {
    row.date = new Date(row.dateStr);
    row.ccode = data.alias[row.territory];
    return row;
  });
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
        cases: 0, deaths: 0, 
        weekTests: 0, weekPositives: 0, testPop: 0
      };
    }
    for (let territory of EURO_COUNTRIES) {
      const ccode = data.alias[territory];
      let population = getPopulation(ccode);
      if (!(population > 0))
        console.log("NO population for " + ccode);
      let testingRow = data.testing.find(d =>
        data.alias[d.country] === ccode && d.year_week === weekStr
      );
      if (!testingRow) {
        testingRow = {tests_done: 0, testing_rate: 0, positivity_rate: 0};
        population = 0;
      }
      if (!casesForDate)
        continue;
      const entry = {
        date:      day,
        dateStr:   dateStr,
        ccode:     ccode,
        territory: territory,
        cases:     +casesForDate[territory],
        deaths:    +deathsForDate[territory],
        testPop:   population,
        weekTests:     (+testingRow.tests_done),
        weekPositives: Math.round((+testingRow.positivity_rate)*(+testingRow.tests_done)/100),
      };
      result.push(entry);
      for (let r in data.region) {
        if (!data.region[r].includes(ccode)) continue;
        regionSum[r].cases         += entry.cases;
        regionSum[r].deaths        += entry.deaths;
        regionSum[r].weekTests     += entry.weekTests;
        regionSum[r].weekPositives += entry.weekPositives;
        regionSum[r].testPop       += population;
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
    const testRate = suba[i].weekTests / suba[i].testPop / 10;
    if (dCases > 0 || dDeaths > 0)
      result.push({
        dateStr: suba[i].dateStr,
        date:    suba[i].date,
        cases:   dCases / dt / population / 10,
        cases2w: cases2w,
        deaths:  dDeaths / dt / population / 10,
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
    if (timeseries[i] && timeseries[i+offset] && timeseries[i].cases > 0.1 && timeseries[i + offset].deaths > 0)
      result.push({
        date: timeseries[i].date,
        cfr: timeseries[i + offset].deaths / timeseries[i].cases,
        cases: timeseries[i].cases
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
    <linearGradient id="fogout">
      <stop class="noFog" offset="0%"/>
      <stop class="fullFog" offset="100%"/>
    </linearGradient>
    <linearGradient id="fadeRed">
      <stop class="fullRed" offset="0%"/>
      <stop class="fadedRed" offset="100%"/>
    </linearGradient>
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
      .datum(tdata.slice(0, -radius+1))
      .attr("d", d3.area()
        .defined(d => !isNaN(d.cases))
        .x(d => xScale(d.date))
        .y0(yCases(0))
        .y1(d => yCases(d.cases? +d.cases : 0))
      );
    chartAreaC.append("path").attr("class", "casesArea foggy")
      .datum(tdata.slice(-radius))
      .attr("d", d3.area()
        .defined(d => !isNaN(d.cases))
        .x(d => xScale(d.date))
        .y0(yCases(0))
        .y1(d => yCases(d.cases? +d.cases : 0))
      );
    chartAreaC.append("path").attr("class", "casesLine")
      .datum(tdata.slice(0, -radius+1))
      .attr("d", d3.line()
        .defined(d => !isNaN(d.cases))
        .x(d => xScale(d.date))
        .y(d => yCases(d.cases? +d.cases : 0))
      );
    chartAreaC.append("path").attr("class", "casesLine dotted")
      .datum(tdata.slice(-radius))
      .attr("d", d3.line()
        .defined(d => !isNaN(d.cases))
        .x(d => xScale(d.date))
        .y(d => yCases(d.cases? +d.cases : 0))
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

    const deathsG = chartAreaC.append("g")
      .attr("transform", `translate(${offsetPixels}, 0)`);
    const areaDef = d3.area()
      .defined(d => !isNaN(d.deaths))
      .x(d => xScale(d.date))
      .y0(yDeaths(0))
      .y1(d => yDeaths(d.deaths? +d.deaths : 0));
    const lineDef = d3.line()
      .defined(d => !isNaN(d.deaths))
      .x(d => xScale(d.date))
      .y(d => yDeaths(d.deaths? +d.deaths : 0));
    deathsG.append("path").attr("class", "deathsArea")
      .datum(tdata.slice(0, -radius+1))
      .attr("d", areaDef);
    deathsG.append("path").attr("class", "deathsArea fadeRed")
      .datum(tdata.slice(-radius))
      .attr("d", areaDef);
    deathsG.append("path").attr("class", "deathsLine")
      .datum(tdata.slice(0, -radius+1))
      .attr("d", lineDef);
    deathsG.append("path").attr("class", "deathsLine dotted")
      .datum(tdata.slice(-radius))
      .attr("d", lineDef);
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
    const yCfr = d3.scaleLog()
      .domain([0.001, 0.200])//d3.max(cfrData, d => d.cfr)])
      .range([ dims.heightF, 0 ]);
    const radiusScale = d3.scaleLog().domain([0.2, 10]).range([1, 10]).clamp(true);
    const opacityScale = d3.scaleLinear()
      .domain([cfrData.length - radius - offset, cfrData.length])
      .range([1, 0]).clamp(true);
    chartAreaF.append("g")
      .attr("class", "cfrAxis")
      .call(d3.axisLeft(yCfr).tickValues(
        [0.001, 0.002, 0.005, 0.01, 0.02, 0.05, 0.1, 0.2]
      ).tickFormat(d3.format(".0p")));
    chartAreaF.append("g")
      .attr("class", "cfrAxis vaxis")
      .append("text")
        .attr("transform", `translate(-30 ${dims.heightF/2}) rotate(-90)`)
        .text("CFR");
    chartAreaF.append("g")
      .attr("class", "cfrAxis")
      .attr("transform", `translate(${dims.width}, 0)`)
      .call(d3.axisRight(yCfr).tickSize(-dims.width).tickFormat(""));
    
    const dx = 1;
    const cfrG = chartAreaF.append("g");
    for (const [i, d] of cfrData.entries()) {
      const dy = radiusScale(d.cases);
      cfrG.append("rect")
          .attr("x", xScale(d.date) - dx/2)
          .attr("y", yCfr(d.cfr) - dy/2)
          .attr("width", dx)
          .attr("height", dy)
          .attr("fill-opacity", opacityScale(i));
    }
    // chartAreaF.append("path")
    //   .datum(cfrData)
    //   .attr("class", "cfrArea")
    //   .attr("d", d3.area()
    //     .x(d => xScale(d.date))
    //     .y0(yCfr(0))
    //     .y1(d => yCfr(+d.cfr))
    //   );
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

function calculatePeakCorrelations() {
  const result = [];
  for (let c of EURO_COUNTRIES) {
    for (let r of [3, 15]) {
      const a = correlations(c, r, 0);
      const i = d3.maxIndex(a);
      result.push({country: c, radius: r, peakR: a[i], offset: i});
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

const circle = d3.geoCircle();
const graticule = d3.geoGraticule10();

const lambertAzimuthalEqualArea = 
  d3.geoAzimuthalEqualArea()
    .rotate([-17, -52.8])
    .translate([400, 338])
    .scale(1100)
    .precision(0.1);
const geoPath = d3.geoPath(lambertAzimuthalEqualArea);
const rScale = d3.scalePow().exponent(3).domain([0.8, 1]).range([95, 5]);
const offsetScale = d3.scaleLinear().domain([0, 25]).range([100, 20]);

function createMap() {
  const land = topojson.feature(data.world, data.world.objects.land);
  const countries = topojson.feature(data.world, data.world.objects.countries);
  const map = `<svg viewBox="0 0 600 650" style="display: block; background: lightskyblue">
    <path d="${geoPath(graticule)}" stroke="white" fill="none"></path>
    <path d="${geoPath(land)}" fill="#bbb" stroke="#333"></path>
    <g id="Countries">${countryPaths(countries)}</g>
  </svg>`;
  document.getElementById("OffsetMap").innerHTML = map;
}

function countryPaths(countries) {
  const result = [];
  for (let wave of data.firstWaves) {
    let c = wave.country;
    const peakC = data.peakCorrelations.find(d=>d.country===c);
    if (c === 'Bosnia and Herzegovina') c = 'Bosnia and Herz.';
    if (c === 'Czech Republic') c = 'Czechia';
    const center = data.countryCentroids[data.alias[c]];
    const [cx, cy] = lambertAzimuthalEqualArea(center);
    let geoc = countries.features.find(f => f.properties.name === c);
    if (geoc) {
      const light = wave.detected? offsetScale(peakC.offset) : '100';
      result.push(`
        <g class="countryOnMap">
          <title>${geoc.properties.name}</title>
          <path d="${geoPath(geoc)}"
                fill="hsl(0, 100%, ${light}%)"
                stroke="black" />`
      );
      if (wave.detected) {
        result.push(`
          <g class="marker" opacity="${1}">
            <circle cx="${cx}" cy="${cy}" r="16"
                    fill="hsl(0,0%,${rScale(peakC.peakR)}%)" stroke="black"/>
            <text class="offsetLabel" fill="white"
                  x="${cx}" y="${cy+2}">${peakC.offset}</text>
          </g>`);
      }
      result.push(`</g>`);
    }
    else {
      console.log(c);
    }
  }
  return result.join(" ");
}

function constructFirstWaves() {
  return EURO_COUNTRIES
    //.filter(d => getPopulation(d) > 1)
    .map(c => findFirstWave(c, 15));
}

function findFirstWave(country, avgr) {
  const cdata = calculateData(country, avgr).filter(d => d.dateStr < "2020-07-01");
  const peakIndex = d3.maxIndex(cdata, d => d.cases);
  const downward = cdata.slice(peakIndex);
  let lowIndex = downward.findIndex(d => d.cases <= 0.1);
  if (lowIndex < 0) lowIndex = d3.minIndex(downward, d => d.cases);
  lowIndex += peakIndex;
  const startIndex = cdata.findIndex(d => d.cases > 0.1);
  if (cdata[peakIndex] === undefined) return {};
  return {
    country:    country,
    detected:   // 2*cdata[lowIndex].cases < cdata[peakIndex].cases,
                cdata[peakIndex].dateStr < "2020-05-01",
    startIndex: startIndex,
    startDate:  cdata[startIndex].date,
    peakIndex:  peakIndex,
    peakDate:   cdata[peakIndex].date,
    peakValue:  cdata[peakIndex].cases,
    lowIndex:   lowIndex,
    lowValue:   cdata[lowIndex].cases,
    lowDate:    cdata[lowIndex].date,
    relHeight:  1 - cdata[lowIndex].cases / cdata[peakIndex].cases,
    span:       lowIndex - startIndex
  };
}

function constructWaveCorrelations() {
  return EURO_COUNTRIES.flatMap(c => 
    [0,1,3,7,15].flatMap( w =>
      calcWaveCorr(c, w)
    ));
}

function calcWaveCorr(country, avgr) {
  const MAX_OFFSET = 28;
  const cdata = calculateData(country, avgr);
  const wave = data.firstWaves.find(d => d.country === country);
  if (wave === undefined) return [];
  const cd = cdata.slice(wave.startIndex, wave.lowIndex + MAX_OFFSET);
  const c = cd.map(d => d.cases);
  const d = cd.map(d => d.deaths);
  const result = [];
  for (let n = 0; n < MAX_OFFSET; n++) {
    const cslice = c.slice(0, wave.span);
    const dslice = d.slice(n, wave.span + n);
    result.push({
      r: rcoef(cslice, dslice),
      w: avgr,
      country: country,
      offset: n
    });
  }
  return result;
}

function constructPeakCorrelations() {
  return EURO_COUNTRIES.map(c => {
    const a = data.waveCorrelations
      .filter(d => d.country === c && d.w === 15);
    const i = d3.maxIndex(a, d => d.r);
    return {
      country: c, radius: 15, peakR: a[i]? a[i].r : 0, offset: i
    };
  });
}

function calculateFirstWave(country) {
  const MAX_OFFSET = 28;
  const cdata = calculateData(country, 15).filter(d => d.dateStr < "2020-07-01");
  const peakIndex = d3.maxIndex(cdata, d => d.cases);
  const peak = cdata[peakIndex];
  const downward = cdata.slice(peakIndex);
  let lowIndex = downward.findIndex(d => d.cases <= 0.1);
  if (lowIndex < 0) lowIndex = d3.minIndex(downward, d => d.cases);
  lowIndex += peakIndex;
  const low = cdata[lowIndex];
  const startIndex = cdata.findIndex(d => d.cases > 0.1);
  const cd = cdata.slice(startIndex, lowIndex + MAX_OFFSET);
  const c = cd.map(d => d.cases);
  const d = cd.map(d => d.deaths);
  const span = lowIndex - startIndex - MAX_OFFSET;
  const corrs = [];
  for (let n = 0; n < MAX_OFFSET; n++) {
    const cslice = c.slice(0, span);
    const dslice = d.slice(n, span + n)
    corrs.push(rcoef(cslice, dslice));
  }
  if (country === "Slovakia") {
    console.log(corrs);
  }
  return {
    country: country,
    startDate: cdata[startIndex].date,
    peakDate: peak.date,
    peakValue: peak.cases,
    lowDate: low.date,
    lowValue: low.cases,
    relHeight: 1 - low.cases/peak.cases,
    maxCorrelation: d3.max(corrs),
    offset: d3.maxIndex(corrs)
  };
}

function createRidgeChart() {
  const dims = {
    width:  240, 
    height: 800, 
    left:   160, 
    right:   60, 
    top:      5, 
    bottom:  20
  };
  const CUTOFF_DATE = new Date("2020-05-01")
  const waves = [...data.firstWaves.filter(d => d.peakDate < CUTOFF_DATE)]
              .sort((a,b) => b.peakValue - a.peakValue);

  const containerNode = document.getElementById("Ridge");
  const svg = d3.select(containerNode)
    .append("svg")
      .attr("viewBox", 
            `0,0,${dims.left + dims.width + dims.right},${dims.top + dims.height + dims.bottom}`);
  const chartG = svg.append("g")
    .attr("class", "chart")
    .attr("transform", `translate(${dims.left},${dims.top})`);

  const earliestDate = d3.min(waves, d => d.startDate);
  const latestDate = d3.max(waves, d => d.lowDate);
  const maxCases = d3.max(waves, d => d.peakValue);
  const lineHeight = dims.height / (waves.length + 3);

  const xScale = d3.scaleTime()
    .domain([ earliestDate, latestDate ])
    .range([ 0, dims.width ]);
  chartG.append("g")
    .attr("transform", `translate(0,${dims.height})`)
    .call(d3.axisBottom(xScale).ticks(5));
  const yScale = d3.scaleLinear()
    .domain([0, maxCases])
    .range([ lineHeight*3, 0 ]);

  let dy = 0;
  for (let wave of waves) {
    const country = wave.country;
    const peakC = data.peakCorrelations.find(d=>d.country===country);
    const tdata = calculateData(wave.country, 15)
      .filter(d => d.date > wave.startDate && d.date < wave.lowDate);
    dy += lineHeight;
    const lineG = chartG.append("g")
      .attr("class", "rideLine")
      .attr("transform", `translate(0,${dy})`);
    lineG.append("text")
      .attr("transform", `translate(${-dims.left}, ${lineHeight*3})`)
      .text(`${country} ${peakC.offset} ${peakC.peakR.toFixed(2)}`);
    lineG.append("path")
      .datum(tdata)
      .attr("class", "casesArea")
      .attr("d", d3.area()
        .defined(d => !isNaN(d.cases))
        .x(d => xScale(d.date))
        .y0(yScale(0))
        .y1(d => yScale(d.cases? +d.cases : 0))
      );
    const yDeaths = d3.scaleLinear()
      .domain([0, d3.max(tdata, d => d.deaths) / wave.peakValue * maxCases])
      .range([ lineHeight*3, 0 ]);
    const offsetPixels = xScale(-peakC.offset*24*3600*1000) - xScale(0);
    lineG.append("path")
      .datum(tdata)
      .attr("class", "deathsArea")
        .attr("transform", `translate(${offsetPixels}, 0)`)
        .attr("d", d3.area()
          .defined(d => !isNaN(d.deaths))
          .x(d => xScale(d.date))
          .y0(yDeaths(0))
          .y1(d => yDeaths(d.deaths? +d.deaths : 0))
        );
  }
}

function cfrOffsets() {
  const result = [];
  for (let territory of EURO_COUNTRIES) {
    const a = data.combined.filter(
      d => d.territory === territory && d.dateStr >= "2020-09-01"
    );
    const dc = a[28].cases - a[0].cases;
    for (let offset = 0; offset <= 35; offset++) {
      result.push({
        territory: territory,
        offset: offset,
        cfr: (a[offset+28].deaths - a[offset].deaths) / dc
      });
    }
  }
  return result;
}

function cfrOffsetDigests() {
  const result = [];
  for (let territory of EURO_COUNTRIES) {
    const a = data.combined.filter(
      d => d.territory === territory && d.dateStr >= "2020-09-01"
    );
    const dc = a[30].cases - a[0].cases;
    const cfr = [];
    for (let offset = 0; offset <= 30; offset++) {
      cfr.push((a[offset+30].deaths - a[offset].deaths) / dc);
    }
    result.push({
      territory: territory,
      max: d3.max(cfr),
      min: d3.min(cfr),
      median: d3.median(cfr),
      q1: d3.quantile(cfr, 0.25),
      q3: d3.quantile(cfr, 0.75)
    });
  }
  return result;
}