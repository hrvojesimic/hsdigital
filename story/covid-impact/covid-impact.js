const DATE_ZERO = new Date("2020-01-01");
const SQRT2 = Math.sqrt(2);

var preparation = {
  world: "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json",
  alias:      "/dataset/countries/alias.json",
  population: "/dataset/countries/pop2020.json",
  regions:    "/dataset/countries/regions.json",
  eurobubbles:"/dataset/countries/eurobubbles.csv",
  countryName:"/dataset/countries/label.hr.json",
  label:      "/story/covid-impact/labels.json",
  ecdcAll:    "/story/covid-impact/ecdc-status-2021-12-01.csv",
  ecdcDeaths: {
    waitFor: ["ecdcAll", "alias"],
    construction() {
      return Object.fromEntries(
        data.ecdcAll.flatMap(row => {
          const cc = data.alias[row.country];
          if (!cc) return [];
          return [[
            cc,
            +row.deaths * (1000000 / data.population[cc]) / daysTo(row.date)
          ]];
        })
      );
    }
  },
  economist:  "/story/covid-impact/economist-2022-02.csv",
  econEst:    extractObjectFrom("economist", "ccode", "est"),
  econExc:    extractObjectFrom("economist", "ccode", "exc"),
  econCovid:  extractObjectFrom("economist", "ccode", "covid"),
  excess:     "/story/covid-impact/excess-deaths.json",
  ihme:       "/story/covid-impact/ihme-deaths.json",
  yllRaw:     "/story/covid-impact/oxford-yll-2020.json", // whole year, per 100k pop
  yll: {
    waitFor: ["yllRaw"],
    construction() {
      const result = {};
      // convert to average person's days lost in 2020
      Object.entries(data.yllRaw).forEach(([k, v]) => result[k] = v / 1e5 * 366);
      return result;
    }
  },
  efEnglish:  "/dataset/ef-english-prof-2021.json"
};

function extractObjectFrom(base, key, value) {
  return {
    waitFor: [base],
    construction() {
      return Object.fromEntries(
        data[base].map(row => [row[key], row[value]])
      );
    }
  };
}

function dataCompleted() {
  drawEuroBubbles(
    "EuroBub", 
    data.ecdcDeaths,
    {flags: false, label:true}
  );
  for (const div of document.querySelectorAll(".BubbleDensity")) {
    drawBubbleDensity2(div, Object.assign({}, div.dataset));
    // drawBubbleDensity(div, data[div.dataset.source], Object.assign({}, div.dataset));
  }
  //drawDiamond("Ihme", "ihme", "excess");
}

function drawDiamond(elId, keyX, keyY) {
  const dims = {
    width:  500, 
    height: 500, 
    left:   200, 
    right:   60, 
    top:    -50, 
    bottom:  20
  };
  const chartSvg = d3.select("#" + elId)
    .append("svg")
      .attr("viewBox", `0,0,${dims.left + dims.width + dims.right},${dims.top + dims.height + dims.bottom}`);
  const root = chartSvg.append("g")
    .attr("transform", "translate(" + dims.left + "," + dims.top + ")");
  const axg = root.append("g").attr("transform", `rotate(45,0,${dims.height/2})`);
  const [xData, yData] = [data[keyX], data[keyY]];
  const a = dims.height * 0.75;
  const xScale = d3.scaleLinear()
    .domain([0,10]).range([0, a]);
  const yScale = d3.scaleLinear()
    .domain([0,10]).range([a, 0]);
  const rScale = d3.scaleSqrt()
    .domain([0, 5e8]).range([0, 50]);
  const xAxisGen = d3.axisBottom().scale(xScale);
  const yAxisGen = d3.axisLeft().scale(yScale);
  axg.append("g").attr("transform", `translate(0,${a})`)
    .call(xAxisGen)
    .append("text")
      .attr("transform", `translate(-30 ${-a / 2}) rotate(-90)`)
      .text(data.label[keyX]);
  axg.append("g")
    .call(yAxisGen)
    .append("text")
      .attr("transform", `translate(${a / 2} ${a + 30})`)
      .text(data.label[keyY]);
  axg.append("line")
    .attr("stroke", "gray")
    .attr("x1", 0).attr("y1", a)
    .attr("x2", a).attr("y2", 0);
  const dots = axg.append("g");
  const countryList = Object.keys(xData).filter(o => yData[o]);
  dots.selectAll("circle")
      .data(countryList)
      .enter().append("circle")
        .attr("cx", d => xScale(xData[d]))
        .attr("cy", d => yScale(yData[d]))
        .attr("r",  d => rScale(data.population[d]))
        .attr("fill", d => regColor(d))
        .attr("opacity", "0.5")
        .append("title").text(d => d + " " + xData[d] + " " + yData[d]);
}

function drawEuropeContour(containerId, width, height) {
  const lambertAzimuthalEqualArea = 
    d3.geoAzimuthalEqualArea()
      .rotate([-13, -50])
      .translate([width / 2, height / 2])
      .scale(1100)
      .precision(0.1);
  const path = d3.geoPath(lambertAzimuthalEqualArea);
  const land = topojson.feature(data.world, data.world.objects.land);
  const map = `<path d="${path(land)}" fill="white" stroke="gray"></path>`;
  document.getElementById(containerId).innerHTML = map;
}

function drawEuroBubbles(elId, dataObject, opts) {
  const width = 900;
  const europe = data.eurobubbles.map(o => o.code);
  const dd = Object.fromEntries(
    Object.entries(dataObject).filter(entry => europe.includes(entry[0]))
  );
  const vals = Object.values(dd);
  const midpoint = (d3.max(vals) + d3.min(vals))/2;
  const colorScale = d3.scaleSequential()
    .domain([d3.min(vals), d3.max(vals)])
    .interpolator(d3.interpolateReds);
  const mapSvg = d3.select("#" + elId)
    .append("svg").attr("style", "background-color:skyblue")
      .attr("width", width)
      .attr("height", width*0.7);
  mapSvg.append("g").attr("id", "EuropeContour");
  drawEuropeContour("EuropeContour", width, width*0.7);
  const circleG = mapSvg.append("g");
  circleG.attr("id", "Countries");
  const countryG = circleG
    .selectAll("g.country")
    .data(data.eurobubbles)
    .join("g")
      .attr("class", o => "country " + (dd[o.code] > midpoint? "highval" : "lowval"))
      .attr("id", o => o.code);
  countryG.append("circle")
    .attr("cx", o => o.cx)
    .attr("cy", o => o.cy)
    .attr("r",  o => o.r)
    .attr("fill", o => colorScale(dd[o.code]))
    .attr("stroke", "gray");
    //.append("title").text( c => c.code );
  if (opts.flags) {
    countryG.append("image")
      .attr("href", d => `/flags/${d.code}.png`)
      .attr("x", d => d.cx - d.r)
      .attr("y", d => d.cy - d.r)
      .attr("width", d => 2*d.r)
      .attr("height", d => 2*d.r)
      .append("title").text(d => data.countryName[d.code]);
  }
  if (opts.label) {
    countryG.append("text")
      .attr("class", "label")
      .attr("x", o => o.cx)
      .attr("y", o => o.cy)
      .attr("fill", "white")
      .text(o => o.r > 20? data.countryName[o.code] : o.code);
  }
}

function drawBubbleDensity(el, dataObject, optin = {}) {
  const opt = Object.assign({width: 900, height: 400, rmax: 200}, optin);
  const vmap = {...dataObject};
  if (opt.region) {
    const onlyCountries = data.regions[opt.region];
    for (const cc in vmap)
      if (!onlyCountries.includes(cc))
        delete vmap[cc];
  } 

  const svg = d3.select("#" + el.id)
    .append("svg")
      .attr("width", opt.width)
      .attr("height", opt.height);

  const MAXPOP = d3.max(Object.values(data.population));
  const rScale = d3.scaleSqrt().domain([0, MAXPOP]).range([0, opt.rmax]);
  const values = Object.entries(vmap);

  const mini   = d3.minIndex(values, e => e[1]);
  const maxi   = d3.maxIndex(values, e => e[1]);
  const maxr   = d3.max(values.map(o => o[0]), o => +rScale(+data.population[o]));
  const margin = {
    top: 15,
    bottom: 55,
    left:  maxr,
    right: maxr
  };
  const xScale = d3.scaleLinear(
    [values[mini][1], values[maxi][1]], 
    [0, opt.width - margin.left - margin.right]
  );
  const colorScale = d3.scaleOrdinal().domain([false, true]).range(["blue", "red"]);

  const nodes = Object.entries(vmap).map(([cc, value]) => ({
    zone: cc, 
    value,
    pop: data.population[cc]
  }));
  nodes.sort((a, b) => b.pop - a.pop);
  
  const g = svg.append("g").attr("transform", `translate(${margin.left} ${margin.top})`);

  const axisG = g.append("g").attr("transform", `translate(0 ${opt.height - margin.bottom})`)
    .call(d3.axisBottom().scale(xScale));
  axisG.append("text")
       .attr("x", opt.width/2)
       .attr("y", 25)
       .text(opt.xaxis);
  g.append("line").attr("stroke", "gray")
   .attr("x1", xScale(0)).attr("y1", 0)
   .attr("x2", xScale(0)).attr("y2", opt.height - margin.bottom);

  const gJoin = g
    .selectAll("g.country")
    .data(nodes)
    .join("g")
      .attr("class", d => "country" + (data.regions["ex-socialist"].includes(d.zone)? " exsoc" : ""))
      .attr("transform", d => `translate(${xScale(d.value)} ${opt.height / 2})`);
  gJoin.append("title").text(d => 
    data.countryName[d.zone] + ": " + Math.round(d.value) + " " + opt.unit
  );
  gJoin.append("circle")
      .attr("cx", 0)
      .attr("cy", 0)
      .attr("r", d => rScale(d.pop))
      .attr("fill", d => "white")// regColor(d.zone))
      .attr("stroke", d => "gray")
      .attr("opacity", 0.75);
      //.append("title").text(d => d.zone);

  gJoin.append("image")
      .attr("href", d => `/flags/${d.zone}.png`)
      .attr("x", d => -rScale(d.pop))
      .attr("y", d => -rScale(d.pop))
      .attr("width", d => 2*rScale(d.pop))
      .attr("height", d => 2*rScale(d.pop));
  gJoin.append("text")
      .attr("class", "label")
      .text(d => rScale(d.pop) > 20? data.countryName[d.zone] : rScale(d.pop) > 7? d.zone : ""); 

  const sim = d3.forceSimulation(nodes)
    .force("x", d3.forceX(d => xScale(d.value)).strength(1))
    .force("y", d3.forceY(opt.height * 0.5).strength(0.1))
    .force("collision", d3.forceCollide().radius(d => rScale(d.pop)))
    .on("tick", tick);
  
  function tick() {
    gJoin.attr("transform", d => `translate(${d.x} ${d.y})`);
  }
}

function regColor(cc) {
  if (data.regions.Asia.includes(cc)) return "red";
  if (data.regions["ex-socialist"].includes(cc)) return "pink";
  if (data.regions["Europe + Russia"].includes(cc)) return "blue";
  if (data.regions.Americas.includes(cc)) return "green";
  if (data.regions.Africa.includes(cc)) return "brown";
  if (data.regions.Oceania.includes(cc)) return "violet";
  return "gray";
}

function daysTo(dateStr) {
  return (new Date(dateStr) - DATE_ZERO)/(24*60*60*1000);
}

function drawBubbleDensity2(el, optin) {
  drawCountryBubbles(
    el, 
    prepareNodes(optin.source, {keyY: false, region: optin.region}), 
    optin
  );
}

function prepareNodes(keyX, {keyY, region}) {
  let xs = Object.entries(data[keyX]);
  if (region) {
    xs = xs.filter(o => data.regions[region].includes(o[0]));
  }
  const nodes = xs.map(([ccode, valx]) => ({
    ccode,
    pop:   +data.population[ccode],
    label: data.countryName[ccode],
    tags:  [],
    valx:  +valx,
    valy:  keyY? +data[keyY][ccode] : 0
  }));
  nodes.sort((a, b) => b.pop - a.pop);
  return nodes;
}
