let svg, dx = 0, sy = 1, lastX = 0, lastY = 0, chartEl, deathsAreaEl, xScale, yAxisRedrawTimer;

const START_DATE = new Date('2020-02-01');
const WAVE1_CUTOFF = new Date('2020-06-01');
const END_DATE = addDays(new Date(), -1);
const SECOND_X = false;

const preparation = {
  regions:    "/story/covid-euro-overlap/regions.json",
  world:      "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json",
  owidDeaths: //"https://covid.ourworldindata.org/data/ecdc/total_deaths.csv",
              "/story/covid-preklop/total_deaths.csv",
  owidCases:  //"https://covid.ourworldindata.org/data/ecdc/total_cases.csv",
              "/story/covid-preklop/total_cases.csv",
  testing:    "/story/covid-euro-overlap/weekly_testing_data_EUEEAUK_2020-09-23.csv",
  combined: {
    waitFor: ["regions", "owidDeaths", "owidCases", "testing"],
    construction: combineAllData
  },
  testCountries: {
    waitFor: ["testing"],
    construction() {
      return new Set(data.testing.map(d => d.country));
    }
  },
  allCountries: {
    waitFor: ["regions"],
    construction() {
      return Object.values(data.regions).flat();
    }
  },
  corrCoefs: {
    waitFor: ["combined", "allCountries"],
    construction: buildCorrelations
  },
  cfrs: {
    waitFor: ["combined", "allCountries"],
    construction: buildCfrs
  }
};

function combineAllData() {
  const result = [];
  let day = new Date(START_DATE);
  while (day < END_DATE) {
    const dateStr = day.toISOString().substring(0,10);
    const m = moment(day);
    const weekStr = "2020-W" + (m.week() <= 9? "0" : "") + m.week();
    let casesForDate = data.owidCases.find(d => d.date === dateStr);
    let deathsForDate = data.owidDeaths.find(d => d.date === dateStr);
    for (let region in data.regions) {
      for (let territory of data.regions[region]) {
        let testingRow = data.testing.find(d => d.country === territory && d.year_week === weekStr);
        if (!testingRow)
          testingRow = {testing_rate: 0, positivity_rate: 0};
        if (!casesForDate)
          continue;
        result.push({
          date: day,
          dateStr: dateStr,
          region: region,
          territory: territory,
          cases: +casesForDate[territory],
          deaths: +deathsForDate[territory],
          weekTestRate: (+testingRow.testing_rate),
          weekPositivePct: (+testingRow.positivity_rate)
        });
      }
    }
    day = addDays(day, 1);
  }
  return result;
}

function calculateData(territory, avgw) {
  const result = [];
  const suba = data.combined.filter(d => d.territory === territory);
  const n = suba.length;
  for (let i = avgw + 1; i < n; i++) {
    const back = i - 1 - avgw;
    let fore = (i + avgw < n)? i + avgw : n-1;
    while (!suba[fore] && fore > 0) fore--;
    const dt = fore - back;
    const dCases  = suba[fore].cases - suba[back].cases;
    const dDeaths = suba[fore].deaths - suba[back].deaths;
    if (dCases > 0 || dDeaths > 0)
      result.push({
        dateStr: suba[i].dateStr,
        date: suba[i].date,
        cases: dCases / dt,
        deaths: dDeaths / dt,
        weekTestRate: suba[i].weekTestRate,
        weekPositivePct: suba[i].weekPositivePct
      });
  }
  return result;
}

function dataCompleted() {
  addSimpleCharts();
  createMap();
}

function drawYAxis() {
  const yDeaths = d3.scaleLinear()
    .domain([0, d3.max(data.dataset, d => d.deaths)*2/sy])
    .range([ height, 0 ]);
  svg.select("g.rightAxis").remove();
  svg.append("g").attr("class", "rightAxis")
    .attr("transform", "translate(" + (width+2) + ", 0)")
    .call(d3.axisRight(yDeaths));
  return yDeaths;
}

function addSimpleCharts() {
  for (let el of document.querySelectorAll('.schart')) {
    simpleChart(
      el, 
      el.dataset.territory, 
      el.dataset
    );
  }
}

function simpleChart(node, territory, {showc = true, show = 'cdtp', dmax, offset=0, radius=15}) {
  const dims = {
    width: 350, 
    height: 200, 
    height2: show.includes('t')? 100 : 0,
    gap: show.includes('t')? 6 : 0,
    left: 40, 
    right: 40, 
    top: 10, 
    bottom: (offset > 0)? 43 : 20
  };
  const tdata = calculateData(territory, +radius);
  const maxCases = d3.max(tdata, d => d.cases);
  const uniqueId = nextUniqueId();

  const topSvg = d3.select(node)
    .append("svg")
      .attr("viewBox", `0,0,${dims.width + dims.left + dims.right},${dims.height + dims.gap + dims.height2 + dims.top + dims.bottom}`);
  
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
    .attr("transform", "translate(0," + (dims.height + dims.gap + dims.height2) + ")")
    .call(d3.axisBottom(xScale).ticks(d3.timeMonth, 1).tickFormat(d3.timeFormat('%b')));

  const offsetPixels = xScale(-offset*24*3600*1000) - xScale(0);

  if (SECOND_X && offset > 0) {
    root.append("g").attr("class", "rightAxis")
      .attr("transform", "translate(0," + (dims.height+23) + ")")
      .call(d3.axisBottom(
        d3.scaleTime()
        .domain([ addDays(START_DATE, offset), END_DATE ])
        .range([ 0, dims.width + offsetPixels ]))
        .ticks(d3.timeMonth, 1).tickFormat(d3.timeFormat('%b'))
      );
  }
  
  const chartArea = root.append("svg").attr("class", "chartArea");
  const chartArea2 = root.append("g")
    .attr("transform", "translate(0," + (dims.height + dims.gap) + ")");

  if (show.includes('d')) {
    chartArea.append("rect")
      .attr("x", 0).attr("y", 0)
      .attr("width", dims.width)
      .attr("height", dims.height)
      .attr("fill", `url(#${uniqueId})`);
  }
  chartArea.append("g")
    .attr("class", "territoryLabel")
    .attr("transform", `translate(6 25)`)
    .append("text").text(territory);
  if ((+offset) > 0)
    chartArea.append("g")
      .attr("class", "offsetLabel")
      .attr("transform", `translate(6 55)`)
      .append("text").text(" ← " + offset);
    chartArea.append("g")
      .attr("class", "offsetLabel")
      .attr("transform", `translate(6 85)`)
      .append("text").text(d3.format(".0%")(dmax/maxCases));
  
  if (show.includes('c')) {
    const yCases = d3.scaleLinear()
      .domain([0, maxCases])
      .range([ dims.height, 0 ]);
    root.append("g")
      .attr("class", "leftAxis")
      .call(d3.axisLeft(yCases).ticks(6));
    chartArea.append("path").attr("class", "casesArea")
      .datum(tdata)
      .attr("d", d3.area()
        .x(d => xScale(d.date))
        .y0(yCases(0))
        .y1(d => yCases(+d.cases))
      );
  }

  if (show.includes('d')) {
    const yDeaths = d3.scaleLinear()
      .domain([0, dmax])
      .range([ dims.height, 0 ]);
    root.append("g")
      .attr("class", "rightAxis")
      .attr("transform", "translate(" + (dims.width) + ", 0)")
      .call(d3.axisRight(yDeaths).ticks(6));
    chartArea.append("path").attr("class", "deathsArea")
      .datum(tdata)
      .attr("transform", `translate(${offsetPixels}, 0)`)
      .attr("d", d3.area()
        .x(d => xScale(d.date))
        .y0(yDeaths(0))
        .y1(d => yDeaths(+d.deaths))
      );
  }

  if (show.includes('t')) {
    const yTesting = d3.scaleLinear()
      .domain([0, d3.max(tdata, d => d.weekTestRate)])
      .range([ dims.height2, 0 ]);
    chartArea2.append("g")
      .attr("class", "testingAxis")
      .call(d3.axisLeft(yTesting).ticks(4));
    chartArea2.append("path")
      .datum(tdata)
      .attr("class", "testingLine")
      .attr("d", d3.area()
        .x(d => xScale(d.date))
        .y0(yTesting(0))
        .y1(d => yTesting(+d.weekTestRate))
      );
  }

  if (show.includes('p')) {
    const yTesting = d3.scaleLinear()
      .domain([0, d3.max(tdata, d => d.weekPositivePct)])
      .range([ dims.height2, 0 ]);
    chartArea2.append("g")
      .attr("class", "positiveAxis")
      .attr("transform", "translate(" + (dims.width) + ", 0)")
      .call(d3.axisRight(yTesting).ticks(4));
    chartArea2.append("path")
      .datum(tdata)
      .attr("class", "positiveLine")
      .attr("d", d3.line()
        .x(d => xScale(d.date))
        .y(d => yTesting(+d.weekPositivePct))
      );
  }
}


function addDays(date, days) {
  var result = new Date(date);
  result.setTime(result.getTime() + 86400000*days);
  return result;
}

function augmentRegions(row) {
  for (let region in data.regions) {
    let sum = 0;
    for (let country of data.regions[region]) {
      sum += row[country]? +row[country] : 0;
    }
    row[region] = sum;
  }
  return row;
}

const circle = d3.geoCircle();
let graticule = d3.geoGraticule10();

const lambertAzimuthalEqualArea = 
  d3.geoAzimuthalEqualArea()
    .rotate([-17, -52.8])
    .translate([400, 338])
    .scale(1100)
    .precision(0.1);
const path = d3.geoPath(lambertAzimuthalEqualArea);

function createMap() {
  const land = topojson.feature(data.world, data.world.objects.land);
  const countries = topojson.feature(data.world, data.world.objects.countries);
  const map = `<svg viewBox="0 0 800 660" style="display: block; background: lightskyblue">
    <path d="${path(graticule)}" stroke="white" fill="none"></path>
    <path d="${path(land)}" fill="#bbb" stroke="#333"></path>
    <g id="Countries">${countryPaths(countries)}</g>
  </svg>`;
  document.getElementById("EuroMap").innerHTML = map;
}

function countryPaths(countries) {
  const result = [];
  const corrScale = d3.scaleSequential()
    .domain([0.5, 1])
    .interpolator(d3.interpolateReds);
  const offsetScale = d3.scaleSequential()
    .domain([0, 21])
    .interpolator(d3.interpolateReds);
  for (let region in data.regions) {
    for (let c of data.regions[region]) {
      if (c === 'Bosnia and Herzegovina') c = 'Bosnia and Herz.';
      let geoc = countries.features.find(f => f.properties.name === c);
      if (geoc) {
        const ca = correlations(c, 15);
        const r = d3.max(ca);
        const imax = d3.maxIndex(ca);
        result.push(`
          <g>
            <title>${geoc.properties.name} ${imax}</title>
            <path d="${path(geoc)}" stroke="black"
                  fill="${offsetScale(imax)}" 
                  opacity="${1}">
            </path>
          </g>`
        );
      }
      else {
        console.log(c);
      }
    }
  }
  return result.join(" ");
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
    result.push(rcoef(c.slice(q*max, (q+1)*max), d.slice(q*max+n, (q+1)*max + n)));
  }
  return result;
}

function buildCorrelations() {
  const result = [];
  const widths = [0, 1, 3, 7, 15];
  for (let c of data.allCountries) {
    for (let w of widths) {
      for (let q of [0,1]) {
        correlations(c, w, q).map( (r, i) => {
          result.push({
            c: c,
            q: q,
            w: w,
            i: i,
            r: r,
            r2: r*r
          });
        });
      }
    }
  }
  return result;
}

function crfs(country, w, offset) {
  const cd = calculateData(country, w).filter(
    d => d.dateStr >= '2020-03-01' && d.dateStr < '2020-09-25'
  );
  const c = cd.map(d => d.cases);
  const d = cd.map(d => d.deaths);
  const result = [];
  for (let n = 15; n <= 165; n++) {
    result.push(d[n + offset] / c[n]);
  }
  return result;
}

function buildCfrs() {
  const result = [];
  const offsets = {
    Sweden: 6, France: 7, Germany: 13, Italy: 4, Belgium: 5
  }
  for (let c of Object.keys(offsets)) {
    crfs(c, 15, offsets[c]).map( (cfr, i) => {
      result.push({
        c: c,
        offset: offsets[c],
        i: i,
        cfr: (cfr > 0 && cfr < 1)? cfr : 0
      });
    });
  }
  return result;
}
