const qIcon = {
  Q1: "t-rex", Q2: "world", Q3: "virus",
  Q4: "tree",  Q5: "flashlight",   Q6: "family",
  Q7: "fem-sci", Q8: "ape", Q9: "thermometer",
  Q10: "pillbox", Q11: "undercover"
};

var preparation = {
  population: "/dataset/countries/pop2020.json",
  regions:    "/dataset/countries/regions.json",
  countryName:"/dataset/countries/label.hr.json",
  labels:     "/story/eurobar-sciq-covid/labels.json",
  iconSrc()   {
    return loadIcons(Object.values(qIcon)).then(a => Object.fromEntries(a));
  },
  questions:  "/story/eurobar-sciq-covid/questions.csv",
  answers:    {
    uri: "/story/eurobar-sciq-covid/answers.csv",
    augment: (row) => {
      row.trues  = +row.trues;
      row.falses = +row.falses;
      row.totals = +row.totals;
      row.score  = +row.score;
      row.truePct= row.trues / row.totals * 100;
      row.hit    = row.trues / (row.trues + row.falses) * 100;
      row.split  = (row.totals + row.trues - row.falses) / row.totals * 50;
      return row;
    }
  },
  description:"/story/eurobar-sciq-covid/sciQ.json",
  excess:     "/story/covid-impact/excess-deaths.json",
  ihme:       "/story/covid-impact/ihme-deaths.json",
  collated:   collater("answers", "ccode", ["excess", "ihme", "population"])
};

function dataCompleted() {
  drawDensityCharts("score");
  drawCorrelation("Place", calcCorrelations("score", "excess"), "sd", "r");
  drawCorrelation("ph2", calcCorrelations("score", "excess"), "sd", "wr");
  drawCorrelation("ph3", calcCorrelations("score", "ihme"), "sd", "wr");
}

function dummyData(formula) {
  const result = [];
  const totals = 10;
  for (let trues = 0; trues <= totals; trues++) {
    for (let falses = 0; falses <= totals - trues; falses++) {
      result.push({
        trues,
        falses,
        totals,
        score: formula(trues, falses, totals - trues - falses),
        ccode: "AUT"
      });
    }
  }
  return result;
}

function drawAnswerTriangle(elId, qCode) {
  const dataset = data.answers.filter(d => d.qcode === qCode);// d.ccode.startsWith("F"));
  drawTriangle("Triangle", dataset);
}

function drawTriangle(elId, dataset) {
  const dims = {
    width:  150, 
    height: 150, 
    left:    40, 
    right:   40, 
    top:     20, 
    bottom:  20,
    radius:  3
  };
  const chartSvg = d3.select("#" + elId)
    .append("svg")
      .attr("viewBox", `0 0 ${dims.left + dims.width + dims.right} ${dims.top + dims.height + dims.bottom}`)
      .attr("xmlns", "http://www.w3.org/2000/svg")
      .attr("xmlns:xlink", "http://www.w3.org/1999/xlink");
  const side = dims.width - dims.left - dims.right;
  const xScale = d3.scaleLinear([0,1], [0, side]);
  const yScale = d3.scaleLinear([0,1], [side, 0]);
  const rScale = d3.scaleSqrt().domain([0, d3.max(Object.values(data.population))]).range([0, 75]);
  //const colorScale = d3.scaleOrdinal(d3.interpolatePiYG);//schemeCategory10);
  const colorScale = d3.scaleSequential(d3.interpolateRdYlGn);
  const plotG = chartSvg.append("g")
    .attr("class", "triangle")
    .attr("transform", `translate(${dims.left} ${dims.top})`);
  plotG.append("g").attr("transform", `translate(0 ${side})`)
    .call(d3.axisBottom().scale(xScale));
  plotG.append("g").call(d3.axisLeft().scale(yScale));
  plotG.append("line").attr("x1", 0).attr("x2", side).attr("y1", 0).attr("y2", side)
    .attr("stroke","gray");

  plotG.selectAll("circle")
    .data(dataset)
    .join("circle")
      .attr("cx", d => xScale(d.trues/d.totals))
      .attr("cy", d => yScale(d.falses/d.totals))
      .attr("r", dims.radius) //d => rScale(data.population[d.ccode]))
      .attr("fill", d => colorScale(d.score))
      .attr("stroke", "none").attr("fill-opacity", 1)
      .append("title").text(d => d.ccode + " " + d.qcode);
}

function drawDensityCharts(scoreKey) {
  const div = document.getElementById("Density");
  for (let n = 1; n <= 11; n++) {
    const qc = "Q" + n;
    drawBubbleDensity(div, qc, Object.assign({scoreKey}, div.dataset));
  }
}

function drawBubbleDensity(el, qCode, optin = {}) {
  const opt = Object.assign({width: 600, height: 250, rmax: 140}, optin);
  const vmap = Object.fromEntries(
    data.answers
      .filter(d => d.qcode === qCode)
      .map(d => [d.ccode, d[opt.scoreKey]])
  );
  const section = d3.select("#" + el.id).append("section");
  section.append("h2").text(data.questions.find(d => d.code == qCode).text);
  const svg = section.append("svg")
      .attr("width", opt.width)
      .attr("height", opt.height);
  svg.append("defs")
    .html(fileToSymbol(qIcon[qCode]).outerHTML);
  
  const MAXPOP = d3.max(Object.values(data.population));
  const rScale = d3.scaleSqrt().domain([0, MAXPOP]).range([0, opt.rmax]);

  const values = Object.entries(vmap);
  const mini   = d3.minIndex(values, e => e[1]);
  const maxi   = d3.maxIndex(values, e => e[1]);
  const margin = {
    top: 15,
    bottom: 55,
    left:  rScale(data.population[values[mini][0]]),
    right: rScale(data.population[values[maxi][0]])
  };
  const xScale = d3.scaleLinear(
    [-50,100],
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
  g.append("use")
    .attr("class", qIcon[qCode] + " stencil")
    .attr("href", "#" + qIcon[qCode])
    .attr("x", opt.rmax/2).attr("y", opt.rmax/2)
    .attr("width", opt.rmax).attr("height", opt.rmax);

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
      .attr("class", "country")
      .attr("transform", d=> `translate(${xScale(d.value)} ${opt.height / 2})`);
  gJoin.append("circle")
      .attr("cx", 0)
      .attr("cy", 0)
      .attr("r", d => rScale(d.pop))
      .attr("fill", d => "white")// regColor(d.zone))
      .attr("stroke", d => "gray")
      .attr("opacity", 0.75)
      .append("title").text(d => d.zone);

  gJoin.append("image")
      .attr("href", d => `/flags/${d.zone}.png`)
      .attr("x", d => -rScale(d.pop))
      .attr("y", d => -rScale(d.pop))
      .attr("width", d => 2*rScale(d.pop))
      .attr("height", d => 2*rScale(d.pop))
      .append("title").text(d => 
        data.countryName[d.zone] + ": " + Math.round(d.value) + " " + opt.unit
      );

  const sim = d3.forceSimulation(nodes)
    .force("x", d3.forceX(d => xScale(d.value)).strength(1))
    .force("y", d3.forceY(opt.height * 0.4).strength(0.1))
    .force("collision", d3.forceCollide().radius(d => rScale(d.pop)))
    .on("tick", tick);
  
  function tick() {
    gJoin.attr("transform", d => `translate(${d.x} ${d.y})`);
  }
}

function drawCorrelation(elId, dataset, keyX, keyY) {
  const R = 20;
  const dims = {
    width:  500, 
    height: 500, 
    left:   200, 
    right:   60, 
    top:      0, 
    bottom:  20
  };
  const chartSvg = d3.select("#" + elId)
    .append("svg")
      .attr("viewBox", `0 0 ${dims.left + dims.width + dims.right} ${dims.top + dims.height + dims.bottom}`)
      .attr("xmlns", "http://www.w3.org/2000/svg")
      .attr("xmlns:xlink", "http://www.w3.org/1999/xlink");
  const defsEl = chartSvg.append("defs");
  defsEl.html(Object.values(qIcon).map(name => fileToSymbol(name).outerHTML).join());
  const root = chartSvg.append("g")
    .attr("transform", "translate(" + dims.left + "," + dims.top + ")");
  const axg = root.append("g");
  const a = dims.height * 0.75;
  const xScale = d3.scaleLinear().domain([0,  45]).range([0, a]);
  const yScale = d3.scaleLinear().domain([0, 0.8]).range([a, 0]);
  const xAxisGen = d3.axisBottom().scale(xScale);
  const yAxisGen = d3.axisLeft().scale(yScale);
  axg.append("g").attr("transform", `translate(0,${a})`)
    .call(xAxisGen)
    .append("text")
      .attr("transform", `translate(${a/2} 30)`)
      .text(data.labels[keyX]);
  axg.append("g")
    .call(yAxisGen)
    .append("text")
      .attr("transform", `translate(-30 ${a/2}) rotate(90)`)
      .text(data.labels[keyY]);
  const crosshairs = axg.append("g").attr("class", "crosshairs");
  const chX = crosshairs.append("line").attr("x1", 0).attr("y1", a).attr("x2", a).attr("y2", a);
  const chY = crosshairs.append("line").attr("x1", 0).attr("y1", 0).attr("x2", 0).attr("y2", a);
  const useG = axg.selectAll("g.icon")
      .data(dataset)
      .enter().append("g")
        .attr("class", "icon")
        .attr("transform", d => `translate(${xScale(d[keyX])} ${xScale(d[keyY])})`);
  useG.append("use")
    .attr("class", d => qIcon[d.qcode])
    .attr("href", d => "#" + qIcon[d.qcode])
    .attr("x", 0).attr("y", 0)
    .attr("width", 2.4*R).attr("height", 2.4*R);
  useG.append("circle")
    .attr("class", "dataspot")
    .attr("cx", 0).attr("cy", 0).attr("r", R)
    .attr("opacity", 0)
    .append("title").text(d => data.description[d.qcode]);
  
  const sim = d3.forceSimulation(dataset)
    .force("x", d3.forceX(d => xScale(d[keyX])).strength(1))
    .force("y", d3.forceY(d => yScale(d[keyY])).strength(1))
    .force("collision", d3.forceCollide().radius(R))
    .on("tick", tick);
  
  function tick() {
    useG.attr("transform", d => `translate(${d.x} ${d.y})`);
  }

  useG.on("mouseenter", (e, d) => {
    chX.attr("y1", yScale(d[keyY])).attr("y2", yScale(d[keyY]));
    chY.attr("x1", xScale(d[keyX])).attr("x2", xScale(d[keyX]));
  });
  useG.on("mouseleave", (e, d) => {
    chX.attr("y1", yScale(0)).attr("y2", yScale(0));
    chY.attr("x1", xScale(0)).attr("x2", xScale(0));
  });
}

function loadIcons(names) {
  const promises = names.map( name => 
    fetch("/icons/" + name + ".svg")
      .then(resp => resp.text())
      .then(text => [name, text])
  );
  return Promise.all(promises);
}

function fileToSymbol(name) {
  const src = data.iconSrc[name];
  if (!src) throw "Missing icon " + name;
  const template = document.createElement("template");
  template.innerHTML = src.trim();
  const symbolEl = document.createElement("symbol");
  symbolEl.setAttribute("id", name);
  symbolEl.setAttribute("viewBox", "0 0 96 96");
  symbolEl.setAttribute("overflow", "visible");
  const gEl = document.createElement("g");
  gEl.setAttribute("transform", "translate(-48 -48)");
  for (const node of template.content.firstElementChild.childNodes) {
    if (['path', 'g'].includes(node.nodeName))
      gEl.append(node);
  }
  symbolEl.append(gEl);
  return symbolEl;
}

function calcCorrelations(key1, key2) {
  const indata = data.collated.filter(o => !["XXK", "TUR"].includes(o.ccode));
  const groupByQuestion = d3.groups(indata, o => o.qcode);

  return groupByQuestion.map(([qcode, a]) => {
    const a1 = a.map(o => +o[key1]);
    const a2 = a.map(o => +o[key2]);
    const w  = a.map(o => +o.population);
    return {
      qcode, 
      r:   Math.abs( rcoef(a1, a2) ),
      wr:  Math.abs( wrcoef(a1, a2, w) ),
      iqr: d3.quantile(a1, 0.75) - d3.quantile(a1, 0.25),
      sd:  d3.deviation(a1)
    };
  });
}

function collater(base, key, addons) {
  return {
    waitFor: [...addons, base],
    construction: () => collate(base, key, addons)
  };
}

function collate(base, keyProp, addons) {
  const result = [];
  for (const row of data[base]) {
    const neo = {};
    Object.assign(neo, row);
    const rowKey = row[keyProp];
    for (const addon of addons) {
      neo[addon] = data[addon][rowKey];
    }
    result.push(neo);
  }
  return result;
}