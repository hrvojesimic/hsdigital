const Countries = "Croatia,Slovenia,Germany,Italy,Sweden,Spain,France,Israel,Romania,Australia,Greece,Hungary,Belgium,Denmark,Turkey,Serbia,Austria,Poland,Switzerland,United Kingdom,Japan,New Zealand,India,South Africa,United States,Brazil,Mexico,South Korea,Taiwan,Russia,Ireland,Iceland,Bosnia and Herzegovina,Bulgaria,Montenegro,Macedonia,Kosovo,Albania,Ukraine,Belarus,".split(",").sort();

const margin = {top: 10, right: 50, bottom: 20, left: 50},
      width  = 600 - margin.left - margin.right,
      height = 350 - margin.top - margin.bottom;

let svg, dx = 0, sy = 1, lastX = 0, lastY = 0, chartEl, deathsAreaEl, xScale, yAxisRedrawTimer;
let btnPressed = false;
let country = 'Croatia', w = 7;
let uniqueIdCounter = 1;

const preparation = {
  owidDeaths: {
    uri: "https://covid.ourworldindata.org/data/ecdc/total_deaths.csv",
    augment: augmentRegions
  },
  owidCases: {
    uri: "https://covid.ourworldindata.org/data/ecdc/total_cases.csv",
    augment: augmentRegions
  },
  dataset: {
    waitFor: ["owidDeaths", "owidCases"],
    construction: constructDataset
  }
};

function constructDataset() {
  return calculateData(country, w);
}

function calculateData(territory, avgw) {
  const result = [];
  for (let i = avgw + 1; i < data.owidCases.length - avgw; i++) {
    const dt = 2*avgw + 1;
    const dCases  = +data.owidCases[i + avgw][territory] - data.owidCases[i - 1 - avgw][territory];
    const dDeaths = +data.owidDeaths[i + avgw][territory] - data.owidDeaths[i - 1 - avgw][territory];
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

function reconstruct() {
  const e = document.getElementById("CountryList");
  country = e.options[e.selectedIndex].value;
  w = +document.getElementById("AvgWindow").value;
  data.dataset = constructDataset();
  d3.select("#Chart").selectAll("*").remove();
  lastX = 0; lastY = 0;
  drawChart();
}

function dataCompleted() {
  drawChart();
  prepareCountryList();
  addSimpleCharts();
}

function drawChart() {
  chartUpdate();
  chartEl = document.getElementById('Chart');
  deathsAreaEl = document.getElementById('DeathsArea');
  registerEventHandlers();
}

function prepareCountryList() {
  const clistEl = document.getElementById("CountryList");
  for (let cname of Countries) {
    const el = document.createElement('template');
    el.innerHTML = `<option value="${cname}">${cname}</option>`;
    clistEl.appendChild(el.content.firstChild);
  }
  M.FormSelect.init(document.querySelectorAll('select'), {});
}

function chartUpdate() {
  svg = d3.select("#Chart")
    .append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  xScale = d3.scaleTime()
    .domain([ new Date('2020-02-01'), new Date('2020-09-18') ])//d3.extent(data.dataset, d => d.date))
    .range([ 0, width ]);

  svg.append("g")
    .attr("transform", "translate(0," + height + ")")
    .call(d3.axisBottom(xScale));
  
  const yCases = d3.scaleLinear()
    .domain([0, d3.max(data.dataset, d => d.cases)])
    .range([ height, 0 ]);
  svg.append("g")
    .attr("class", "leftAxis")
    .call(d3.axisLeft(yCases));

  const yDeaths = drawYAxis();

  const chartArea = svg.append("svg").attr("class", "chartArea");

  chartArea.append("path")
    .datum(data.dataset)
    .attr("id", "CasesArea")
    .attr("class", "casesArea")
    .attr("d", d3.area()
      .x(d => xScale(d.date))
      .y0(yCases(0))
      .y1(d => yCases(+d.cases))
    );
  chartArea.append("path")
    .datum(data.dataset)
    .attr("id", "DeathsArea")
    .attr("class", "deathsArea")
    .attr("transform", "translate(" + dx + ", 0)")
    .attr("d", d3.area()
      .x(d => xScale(d.date))
      .y0(yDeaths(0))
      .y1(d => yDeaths(+d.deaths))
    );

  svg.append("g")
    .attr("class", "offsetLabel")
    .attr("transform", `translate(10 10)`)
    .append("text").text("");
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

function registerEventHandlers() {
  chartEl.addEventListener('touchstart', event => storeLast(event.touches[0]));
  chartEl.addEventListener('touchmove',  event => {
    event.preventDefault();
    dragging(event.touches[0]);
  }); 
  chartEl.addEventListener('mousedown',  event => storeLast(event));
  chartEl.addEventListener('mousemove',  event => {if (btnPressed) dragging(event);});
  window .addEventListener('mouseup',    event => btnPressed = false);
}


function storeLast(details) {
  btnPressed = true;
  lastX = details.clientX;
  lastY = details.clientY;
}

function refreshText() {
  const min = data.dataset[0].doy;
  const max = data.dataset[data.dataset.length - 1].doy;
  svg.select("g.offsetLabel > text").text(
    Math.round(-(max - min)*(dx/width)) + " days offset"
  );
}

function dragging(details) {
  window.clearTimeout(yAxisRedrawTimer);
  const deltaX = details.clientX - lastX;
  const yDiff = details.clientY - lastY;
  const deltaY = (yDiff < -1)? 1.05 : ((yDiff > 1)? 0.95 : 1);
  lastX = details.clientX;
  lastY = details.clientY;
  dx = dx + deltaX;
  if (dx > 0) dx = 0;
  sy = sy * deltaY;
  if (sy > 4) sy = 4;
  if (sy < 0.2) sy = 0.2;
  deathsAreaEl.setAttribute("transform", `translate(${dx}, ${height*(1-sy)}) scale(1 ${sy})`);
  yAxisRedrawTimer = window.setTimeout(drawYAxis, 100);
  refreshText();
}

function addSimpleCharts() {
  const smallChartDims = {width: 350, height: 200, left: 40, right: 40, top: 10, bottom: 40};
  for (let el of document.querySelectorAll('.schart')) {
    simpleChart(
      el, 
      el.dataset.territory, 
      smallChartDims,
      el.dataset
    );
  }
}

function simpleChart(node, territory, dims, 
  {showc = true, show = 'cd', dmax, offset=0, radius=15} = {}
) {
  const tdata = calculateData(territory, +radius);
  const uniqueId = nextUniqueId();

  const topSvg = d3.select(node)
    .append("svg")
      .attr("width", dims.width + dims.left + dims.right)
      .attr("height", dims.height + dims.top + dims.bottom);
  
  topSvg.append("defs").html(`
    <pattern id="${uniqueId}" viewBox="0,0,${offset},100" width="10%" height="100%" stroke="black" stroke-opacity="30%" stroke-width="0.5">
      <line x1="${offset}" y1="0" x2="1" y2="50"/>
      <line x1="1" y1="50" x2="${offset}" y2="100"/>
    </pattern>
  `);
  const root = topSvg.append("g")
      .attr("transform", "translate(" + dims.left + "," + dims.top + ")");

  xScale = d3.scaleTime()
    .domain([ new Date('2020-02-01'), new Date('2020-09-18') ])
            //d3.extent(data.dataset, d => d.date))
    .range([ 0, dims.width ]);

  root.append("g")
    .attr("transform", "translate(0," + dims.height + ")")
    .call(d3.axisBottom(xScale));
  
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
      .call(d3.axisLeft(yCases));
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
      .call(d3.axisRight(yDeaths));
    chartArea.append("path").attr("class", "deathsArea")
      .datum(tdata)
      .attr("transform", "translate(" + (xScale(-offset*24*3600*1000) - xScale(0)) + ", 0)")
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

function augmentRegions(row) {
  return row;
}