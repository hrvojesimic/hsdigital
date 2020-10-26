const preparation = {
  world: "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json",
  countryCentroids: "/story/euro-neighbours/country-centroids.json",
  alias: "/dataset/countries/alias.json",
  eucd: {
    uri: "/story/covid-wave-1/eu-cd.csv",
    augment: augmentCDRow
  },
  firstWaves: "/story/covid-wave-1/first-waves.json",
  waveCorrelations: {
    uri: "/story/covid-wave-1/wave-correlations.csv",
    augment: augmentCorr
  },
  peakCorrelations: {
    waitFor: ["waveCorrelations"],
    construction: constructPeakCorrelations
  }
};
const ONE_DAY = 24*60*60*1000;
const circle = d3.geoCircle();
const graticule = d3.geoGraticule10();

const lambertAzimuthalEqualArea = 
  d3.geoAzimuthalEqualArea()
    .rotate([-16, -54])
    .translate([420, 338])
    .scale(1200)
    .precision(0.1);
const geoPath = d3.geoPath(lambertAzimuthalEqualArea);
const rScale = d3.scalePow().exponent(3).domain([0.8, 1]).range([95, 5]);
const offsetScale = d3.scaleLinear().domain([0, 25]).range([100, 20]);

function augmentCDRow(row) {
  return {
    date: new Date(row.date),
    w: +row.w,
    cases: +row.cases,
    deaths: +row.deaths
  };
}
function augmentCorr(row) {
  return {
    country: row.country,
    w: +row.w,
    offset: +row.offset,
    r: +row.r
  };
}

function dataCompleted() {
  constructCovidCharts();
  drawOffsetsMap();
}

function prepareLocal() {
  browserDefaults();
}

function constructPeakCorrelations() {
  const countries = data.firstWaves.map(d => d.country);
  return countries.map(c => {
    const a = data.waveCorrelations
      .filter(d => d.country === c && +d.w == 15);
    const i = d3.maxIndex(a, d => +d.r);
    return {
      country: c, radius: 15, peakR: +a[i].r, offset: +a[i].offset
    };
  });
}

function drawOffsetsMap() {
  const land = topojson.feature(data.world, data.world.objects.land);
  const countries = topojson.feature(data.world, data.world.objects.countries);
  const map = `<svg viewBox="0 0 600 700" style="display: block; background: lightskyblue">
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

function constructCovidCharts() {
  for (let el of document.querySelectorAll('.covidChart'))
    drawCovidChart(el, el.dataset.territory, el.dataset);
}

function drawCovidChart(node, territory, {show = 'cd', dmax, offset=0, window=31}) {
  offset = +offset;
  window = +window;
  dmax = (+dmax) / 10;
  const dims = {
    width:   350, 
    heightC: 200,
    left:    40, 
    right:   60, 
    top:     5, 
    bottom:  25
  };
  const tdata = data.eucd.filter(d => d.w === window);
  const maxCases = d3.max(tdata, d => d.cases);
  const START_DATE = d3.min(tdata, d => d.date);
  const END_DATE   = d3.max(tdata, d => d.date);
  const patternId = nextUniqueId();

  const topSvg = d3.select(node)
    .append("svg")
      .attr("viewBox", `0,0,${dims.left + dims.width + dims.right},${dims.top + dims.heightC + dims.bottom}`);
  
  topSvg.append("defs").html(`
    <pattern id="${patternId}" viewBox="0,0,${offset},100" width="10%" height="100%" stroke="black" stroke-opacity="30%" stroke-width="0.5">
      <line x1="${offset}" y1="0" x2="1" y2="50"/>
      <line x1="1" y1="50" x2="${offset}" y2="100"/>
    </pattern>
    <linearGradient id="fogout">
      <stop class="noFog" offset="0%"/>
      <stop class="fullFog" offset="100%"/>
    </linearGradient>
  `);

  const root = topSvg.append("g")
      .attr("transform", "translate(" + dims.left + "," + dims.top + ")");

  xScale = d3.scaleTime()
    .domain([ START_DATE, END_DATE ])
    .range([ 0, dims.width ]);
  root.append("g").attr("class", "leftAxis")
    .attr("transform", `translate(0,${dims.top + dims.heightC})`)
    .call(d3.axisBottom(xScale).ticks(d3.timeMonth, 1).tickFormat(d3.timeFormat('%b')));

  const offsetPixels = xScale(-offset*24*3600*1000) - xScale(0);
  const chartAreaC = root.append("g").attr("class", "chartArea");

  if (show.includes('d') && offset > 0) {
    chartAreaC.append("rect")
      .attr("x", 0).attr("y", 0)
      .attr("width", dims.width)
      .attr("height", dims.heightC)
      .attr("fill", `url(#${patternId})`);
  }
  
  // chartAreaC.append("g")
  //   .attr("class", "territoryLabel")
  //   .attr("transform", `translate(6 25)`)
  //   .append("text").text(territory);

  // if (offset > 0) {
  //   chartAreaC.append("g")
  //     .attr("class", "offsetLabel")
  //     .attr("transform", `translate(6 55)`)
  //     .append("text").text(" ← " + offset);
  //   chartAreaC.append("g")
  //     .attr("class", "offsetLabel")
  //     .attr("transform", `translate(6 85)`)
  //     .append("text").text(d3.format(".0%")(dmax/maxCases));
  // }
  
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
        .y1(d => yCases(d.cases? d.cases : 0))
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
        .y1(d => yDeaths(d.deaths? d.deaths : 0))
      );
  }

  root.append("rect").attrs({
    class: "fogout",
    x: xScale(new Date(END_DATE.getTime() - window * ONE_DAY)),
    y: 0,
    width: xScale(new Date(window*ONE_DAY)) - xScale(new Date(0)),
    height: dims.heightC
  });
}
