const preparation = {
  world:      "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json",
  alias:      "/dataset/countries/alias.json",
  population: "/dataset/countries/pop2020.json",
  regions:    "/dataset/countries/regions.json",
  countryName:"/dataset/countries/hr/short.json",
  longCName:  "/dataset/countries/hr/long.json",
  gdp:        "/dataset/countries/gdp-nom-2021-un.json",
  lifeExp:    "/dataset/life-exp-birth-2020.json",
  infantMort: "/dataset/infant-mort-2020.json",
  eiu:        "/dataset/politics/eiu-democracy-index-2021.json",
  matrix:     "/dataset/politics/democracy-matrix-2020.json",
  ioef:       "/dataset/politics/economic-freedom-2021.json",
  fitw:       "/dataset/politics/freedom-in-the-world-2021.json",
  press:      "/dataset/politics/press-freedom-2022.json",
  hfi:        "/dataset/politics/human-freedom-2021.json",
  hdi:        "/dataset/sociology/human-dev-index.2019.json",
  happy:      "/dataset/sociology/happiness.2022.json",
  ca:         "/dataset/sociology/cognitive-ability-2009.json",
  regimes:    "/dataset/politics/dd-regimes-2008.json",
  wjp:        "/dataset/politics/wjp-rule-of-law.2021.json",
  hrp:        "/dataset/politics/human-rights-protection-2019.json",
  corruption: "/dataset/politics/corruption-perception.2021.json",
  fundRights: "/dataset/politics/gsd-fundamental-rights-2021.json",
  popregime:  "/story/liberal-regimes/population-by-regime.csv",
  rotw:       "/story/liberal-regimes/regimes-of-the-world.2021.json",
  labels:     "/story/liberal-regimes/labels.json",
  popregdp: {
    waitFor: ["popregime"],
    construction() {
      return datapoints(data.popregime, "year");
    }
  },
  gdppc:    {
    waitFor: ["gdp", "population"],
    construction() {
      return Object.fromEntries(
        Object.entries(data.gdp).map(([ccode, gdp]) =>
          [ccode, gdp/(data.population[ccode]/1e6)]
        )
      );
    }
  },
  regimeDim:  {
    waitFor: ["regimes"],
    construction() {
      return Object.fromEntries([
        ...data.regimes.dictatorship.map(cc => [cc, -1]),
        ...data.regimes.democracy   .map(cc => [cc, +1])
      ]);
    }
  }
};

function datapoints(table, keyProp) {
  return table.flatMap(row => {
    const keyValue = row[keyProp];
    const valKeys = Object.getOwnPropertyNames(row).filter(p => p !== keyProp);
    return valKeys.map(k => ({
      key: keyValue,
      prop: k,
      value: row[k]
    }));
  });
}

const xLibs = ["BRB", "BTN", "BWA", "CHL", "ISR", "CRI", "SYC", "URY"];
const projection = d3.geoEqualEarth().translate([300, 195]).scale(150);
const geoPath = d3.geoPath(projection);

function dataCompleted() {
  browserDefaults();
  drawMap();
  for (const div of document.querySelectorAll(".BubbleDensity")) {
    drawBubbleDensityChart(
      div, 
      Object.assign({height: 400, width: 800}, div.dataset)
    );
  }
  for (const div of document.querySelectorAll(".Barchart")) {
    drawRegimesBarChart(div, div.dataset.valuekey);
  }
}

function drawBubbleDensityChart(el, optIn) {
  const opt = Object.assign({
    forceX: 0.4, forceY: 0.1, keyr: "population"
  }, optIn);
  const x = data[opt.keyx];
  const nodes = Object.keys(x)
    .filter(ccode => x[ccode])
    .map(ccode => ({
      ccode,
      pop:   opt.r? 1 : +data[opt.keyr][ccode],
      label: data.countryName[ccode],
      tags:  tags(ccode),
      valx:  +x[ccode],
      valy:  0
    }))
    .filter(o => o.pop);
  nodes.sort((a, b) => b.pop - a.pop);
  drawCountryBubbles(el, nodes, opt);
}

function geoPoliticalZone(ccode) {
  if (data.regions.Anglosphere.includes(ccode)) return "AS";
  if ("JPN KOR TWN HKG".includes(ccode)) return "DEA";
  if (data.regions.EU.includes(ccode)) {
    if (data.regions["ex-socialist"].includes(ccode)) return "EEU";
    else return "WE";
  }
  if (data.regions["West Europe"].includes(ccode)) return "WE";
  if (xLibs.includes(ccode)) return "XLIB";
  return "";
}

function tags(ccode) {
  return [
    geoPoliticalZone(ccode),
    data.regimes.dictatorship.includes(ccode)? "Dictatorship" : "",
    data.regimes.democracy.includes(ccode)?    "Democracy" : "",
    data.regimes.civilian.includes(ccode)?     "Civilian" : "",
    data.regimes.military.includes(ccode)?     "Military" : "",
    data.regimes.royal.includes(ccode)?        "Royal" : "",
  ]
  .filter(s => s && s.length > 0);
}

function drawMap() {
  const land = topojson.feature(data.world, data.world.objects.land);
  const countries = topojson.feature(data.world, data.world.objects.countries);
  const map = `<svg viewBox="0 0 670 350" style="display: block; background: SkyBlue">
    <path class="geo Land" d="${geoPath(land)}"></path>
    <g id="Countries">${countryPaths(countries, "pdi")}</g>
  </svg>`;
  document.getElementById("WorldMap").innerHTML = map;
}

function countryPaths(countries, prop) {
  const result = [];
  for (let cc of Object.keys(data.population)) {
    const geoc = countries.features.find(f => data.alias[f.properties.name] === cc);
    const zone = geoPoliticalZone(cc);
    if (zone === "") continue;
    if (geoc) {
      result.push(`
        <g class="countryOnMap">
          <title>${data.longCName[cc]}</title>
          <path d="${geoPath(geoc)}" class="${zone} ${cc}" />`
      );
      result.push(`</g>`);
    }
    else {
    }
  }
  return result.join(" ");
}

// draw D3 bar chart with countries by regime type weighted by population
function drawRegimesBarChart(el, valueKey) {
  const dim = {h: 500, w: 400, left: 40, bottom: 10, right: 0, top: 10};
  dim.bline = dim.h - dim.bottom;
  const rows = Object.keys(data.rotw)
    .map(ccode => ({
      ccode,
      size:   +data[valueKey][ccode] / (valueKey === "population"? 1e9 : 1e6),
      regime: data.rotw[ccode],
    }));
  rows.sort((a, b) => b.size - a.size);
  console.log(rows);
  let maxCumulativeSize = 0;
  for (let rc = 0; rc <= 3; rc++) {
    let cumulativeSize = 0;
    const regimeRows = rows.filter(r => r.regime === rc);
    regimeRows.map( o => {
      o.sizeStart = cumulativeSize;
      cumulativeSize += o.size;
      o.sizeEnd = cumulativeSize;
    });
    if (cumulativeSize > maxCumulativeSize)
      maxCumulativeSize = cumulativeSize;
  }
  const xScale = d3.scaleBand([0, 1, 2, 3], [dim.w - dim.left, dim.left, dim.left, dim.left]);
  const hScale = d3.scaleLinear([0, maxCumulativeSize], [0, dim.h - dim.top - dim.bottom]);
  const yScale = d3.scaleLinear([0, maxCumulativeSize], [dim.h - dim.top - dim.bottom, 0]);
  const xAxis = d3.axisBottom(xScale).tickFormat(d => data.labels["R"+d]);
  const yAxis = d3.axisLeft(yScale);
  const svg = d3.select(el).append("svg")
    .attr("viewBox", `0 0 ${dim.w + dim.left + dim.right} ${dim.h + dim.top + dim.bottom}`)
    .attr("preserveAspectRatio", "xMidYMid meet");
  const g = svg.append("g")
    .attr("transform", `translate(${dim.left}, ${dim.top})`);
  g.selectAll("rect").data(rows).enter()
    .append("rect")
      .attr("class", d => `R${d.regime} ${d.ccode}`)
      .attr("x", d => xScale(d.regime) + 3)
      .attr("y", d => yScale(d.sizeEnd) + 1)
      .attr("width", xScale.bandwidth() - 6)
      .attr("height", d => Math.max(1, hScale(d.size) - 2))
      .append("title").text(d => `${data.longCName[d.ccode]}: ${d.size.toFixed(2)}`);
  g.selectAll("text.clabel")
    .data(rows.filter(d => hScale(d.size) > 14))
    .enter().append("text").attr("class", "clabel")
      .attr("x", d => xScale(d.regime) + xScale.bandwidth()/2)
      .attr("y", d => yScale(d.sizeEnd) + hScale(d.size)/2)
      .text(d => data.countryName[d.ccode]);
  g.append("g")
    .attr("class", "x axis")
    .attr("transform", `translate(0, ${dim.bline})`)
    .call(xAxis);
  g.append("g")
    .attr("class", "y axis")
    .attr("transform", `translate(${dim.left}, 0)`)
    .call(yAxis);
  g.append("text")
    .attr("class", "y axis label")
    .attr("transform", `translate(${dim.left/4} ${dim.h/2}) rotate(-90)`)
    .text(data.labels[valueKey]);
}