const Regions = {
  "WestEurope": ["Ireland", "United Kingdom", "France", "Spain", "Portugal", "Germany", "Denmark", "Netherlands", "Belgium", "Italy", "Austria", "Switzerland", "Sweden", "Norway", "Finland", "Iceland", "Luxembourg"],
  "EastEurope": ["Poland", "Ukraine", "Belarus", "Slovenia", "Bosnia and Herzegovina", "Serbia", "Hungary", "Albania", "Romania", "Bulgaria", "Greece", "Slovakia", "Czechia", "Macedonia", "Kosovo", "Montenegro", "Latvia", "Lithuania", "Estonia", "Cyprus", "Moldova"]
};

let svg, dx = 0, sy = 1, lastX = 0, lastY = 0, chartEl, deathsAreaEl, xScale, yAxisRedrawTimer;
let uniqueIdCounter = 1;

const START_DATE = new Date('2020-02-14');
const END_DATE = new Date('2020-09-19');

const preparation = {
  world: "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json",
  owidDeaths: {
    //uri: "https://covid.ourworldindata.org/data/ecdc/total_deaths.csv",
    uri: "/story/covid-preklop/total_deaths.csv",
    augment: augmentRegions
  },
  owidCases: {
    //uri: "https://covid.ourworldindata.org/data/ecdc/total_cases.csv",
    uri: "/story/covid-preklop/total_cases.csv",
    augment: augmentRegions
  }
};

function constructDataset() {
  return calculateData(country, w);
}

function calculateData(territory, avgw) {
  const result = [];
  const n = data.owidCases.length;
  for (let i = avgw + 1; i < n; i++) {
    const back = i - 1 - avgw;
    let fore = (i + avgw < n)? i + avgw : n-1;
    while (data.owidCases[fore][territory] === "" && fore > 0) fore--;
    const dt = fore - back;
    const dCases  = +data.owidCases[fore][territory] - data.owidCases[back][territory];
    const dDeaths = +data.owidDeaths[fore][territory] - data.owidDeaths[back][territory];
    if (dCases > 0 || dDeaths > 0)
      result.push({
        dateStr: data.owidCases[i].date,
        doy: moment(data.owidCases[i].date).dayOfYear(),
        date: d3.timeParse("%Y-%m-%d")(data.owidCases[i].date),
        cases: dCases / dt,
        deaths: dDeaths / dt
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

function simpleChart(node, territory, {showc = true, show = 'cd', dmax, offset=0, radius=15}) {
  const dims = {
    width: 350, height: 200, left: 40, right: 40, top: 10, bottom: (offset > 0)? 43 : 20
  };
  const tdata = calculateData(territory, +radius);
  const uniqueId = nextUniqueId();

  const topSvg = d3.select(node)
    .append("svg")
      .attr("viewBox", `0,0,${dims.width + dims.left + dims.right},${dims.height + dims.top + dims.bottom}`);
  
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
    .attr("transform", "translate(0," + dims.height + ")")
    .call(d3.axisBottom(xScale));

  const offsetPixels = xScale(-offset*24*3600*1000) - xScale(0);

  if (offset > 0) {
    root.append("g").attr("class", "rightAxis")
      .attr("transform", "translate(0," + (dims.height+23) + ")")
      .call(d3.axisBottom(
        d3.scaleTime()
        .domain([ addDays(START_DATE, offset), END_DATE ])
        .range([ 0, dims.width + offsetPixels ]))
      );
  }
  
  const chartArea = root.append("svg").attr("class", "chartArea");
  
  if (show.includes('d')) {
    chartArea.append("rect")
      .attr("x", 0).attr("y", 0)
      .attr("width", dims.width)
      .attr("height", dims.height)
      .attr("fill", `url(#${uniqueId})`);
  }
  
  if (show.includes('c')) {
    const yCases = d3.scaleLinear()
      .domain([0, d3.max(tdata, d => d.cases)])
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
      .attr("transform", "translate(" + (dims.width + 2) + ", 0)")
      .call(d3.axisRight(yDeaths).ticks(6));
    chartArea.append("path").attr("class", "deathsArea")
      .datum(tdata)
      .attr("transform", `translate(${offsetPixels}, 0)`)
      .attr("d", d3.area()
        .x(d => xScale(d.date))
        .y0(yDeaths(0))
        .y1(d => yDeaths(+d.deaths))
      );

    if ((+offset) > 0)
      root.append("g")
        .attr("class", "offsetLabel")
        .attr("transform", `translate(${dims.width/2} 10)`)
        .append("text").text(" ← " + offset);
  }
}

function nextUniqueId() {
  return 'uid' + (uniqueIdCounter++);
}

function addDays(date, days) {
  var result = new Date(date);
  result.setTime(result.getTime() + 86400000*days);
  return result;
}

function augmentRegions(row) {
  for (let region in Regions) {
    let sum = 0;
    for (let country of Regions[region]) {
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
  for (let region in Regions) {
    for (let c of Regions[region]) {
      if (c === 'Bosnia and Herzegovina') c = 'Bosnia and Herz.';
      let geoc = countries.features.find(f => f.properties.name === c);
      if (geoc) {
        let color = (region === 'WestEurope')? 'blue' : 'yellow';
        result.push(`
          <g>
            <title>${geoc.properties.name}</title>
            <path d="${path(geoc)}" fill="${color}" stroke="black"></path>
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
