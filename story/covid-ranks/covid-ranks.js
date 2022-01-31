const colorScale = d3.scaleSequential(d3.interpolateSpectral);
const dim = {side: 180, mid: 40, left: 25, right: 25, top:50, h: 500, bottom: 30, padding: 3};
const interactive = {};

const preparation = {
  regions: "/dataset/countries/regions.json",
  clabels: "/dataset/countries/label.hr.json",
  nyeve:   "/story/covid-ranks/eu-nyeve.csv",
  fridays: "/story/covid-ranks/fridays.csv",
  ecdc:    "/story/covid-ranks/ecdc-weeks.csv",
  labels:  "/story/covid-ranks/labels.json"
};

function dataCompleted() {
  M.FormSelect.init(document.querySelectorAll('select'), {});
  drawWaves();
  drawRankings();
}

function rankingx(week) {
  return data.nyeve.map( row => {
    const result = {};
    const cc = row.ccode;
    const ecdcRow = data.ecdc.find(
      o => o.ccode === cc && week === o.week
    );
    return {
      ccode:      cc,
      dayNum:     +row.dayNum,
      population: +row.population,
      medAge:     +row.medAge,
      hdi:        +row.hdi,
      lifeExp:    +row.lifeExp,
      gdppc:      +row.gdppc,
      age65p:     +row.age65p,
      fullVacPct: 1,
      doses:      1,
      deaths:     +ecdcRow.deathRate
    };
  });
}

function rankings(fridayNum, weekSpan) {
  if (fridayNum < weekSpan || weekSpan < 2) {
    return [];
  }
  return data.nyeve.map( row => {
    const result = {};
    const cc = row.ccode;
    const endFriday   = data.fridays.find(
      o => o.ccode === cc && fridayNum * 7 === +o.dayNum
    );
    const startFriday = data.fridays.find(
      o => o.ccode === cc && (fridayNum - weekSpan) * 7 === +o.dayNum
    );
    return {
      ccode:      cc,
      dayNum:     +row.dayNum,
      population: +row.population,
      medAge:     +row.medAge,
      hdi:        +row.hdi,
      lifeExp:    +row.lifeExp,
      gdppc:      +row.gdppc,
      age65p:     +row.age65p,
      fullVacPct: (+endFriday.fullVacPct + +startFriday.fullVacPct)/2,
      doses:      (+endFriday.dosesPerPerson + +startFriday.dosesPerPerson)/2,
      deaths:     +endFriday.deathRate - +startFriday.deathRate
    };
  });
}

function drawWaves() {
  const ee = data.regions["ex-socialist"];
  const dim = {width: 600, left: 25, right: 25, top:20, height: 300, bottom: 20};
  const div = d3.select("#Waves");
  const svg = div.append('svg')
    .attr('width', dim.width + dim.left + dim.right)
    .attr('height', dim.top + dim.height + dim.bottom);
  const chart = svg.append("g")
    .attr("class", "chart")
    .attr("transform", `translate(${dim.left} ${dim.top})`);
  const max = Object.fromEntries(
    data.fridays.columns.map(key => [key, d3.max(data.fridays, d => +d[key])])
  );
  const startDate = new Date(d3.min(data.fridays, d => d.date));
  const endDate   = new Date(d3.max(data.fridays, d => d.date));
  const scale = {
    x: d3.scaleTime([startDate, endDate], [0, dim.width]),
    y: d3.scaleSequential([0, max.deathWeek], [dim.height, 0])
  };
  const groups = d3.groups(data.fridays.filter(d => d.dayNum > 0), d => d.ccode);
  chart.selectAll("path")
    .data(groups.map(o => o[1]))
    .join("path")
      .attr("class", "dataline")
      .attr("fill", "none")
      .attr("stroke", d => ee.includes(d[0].ccode)? "darkred" : "darkblue")
      .attr("opacity", 0.25)
      .attr("d", d3.line()
        .x(d => scale.x(new Date(d.date)))
        .y(d => scale.y(+d.deathWeek))
      );
    svg.append("g").attr("class", "axis left")
      .attr("transform", `translate(${dim.left} ${dim.top})`)
      .call(d3.axisLeft(scale.y));
    svg.append("g").attr("class", "axis bottom")
    .attr("transform", `translate(${dim.left} ${dim.top + dim.height})`)
    .call(d3.axisBottom(scale.x).ticks(d3.timeMonth, 1).tickFormat(d3.timeFormat('%b')));
}

function drawRankings() {
  for (const el of document.getElementsByClassName("rank")) {
    const m1 = el.dataset.left;
    const m2 = el.dataset.right;
    const fridayNum = +el.dataset.to;
    const weekSpan  = +el.dataset.span;
    drawRankingChart(el, m1, m2, rankings(fridayNum, weekSpan));
  }
}

function drawRankingChart(el, m1, m2, rows) {
  const div = d3.select(el);
  const svg = div.append('svg')
    .attr("width", "100%").attr("height", "45rem")
    .attr("viewBox", `0 0 ${dim.side * 2 + dim.mid + dim.left + dim.right} ${dim.top + dim.h + dim.bottom}`);

  const chart = svg.append("g")
    .attr("class", "chart")
    .attr("transform", `translate(${dim.left} ${dim.top})`);
  const g = {
    topLeft: svg.append("g")
      .attr("class", "top left")
      .attr("transform", `translate(${dim.left + dim.side/2} ${dim.top/2})`),
    topRight: svg.append("g")
      .attr("class", "top right")
      .attr("transform", `translate(${dim.left + dim.side + dim.mid + dim.side/2} ${dim.top/2})`),
    left: chart.append("g")
      .attr("class", "side left")
      .attr("transform", `translate(${dim.side} 0) scale(-1 1)`),
    mid: chart.append("g")
      .attr("class", "mid")
      .attr("transform", `translate(${dim.side + dim.mid/2} 0)`),
    right: chart.append("g")
      .attr("class", "side right")
      .attr("transform", `translate(${dim.side + dim.mid} 0)`)
  };
  const sides = [
    {el: g.left,  top: g.topLeft, metric: m1, colFn: (x) => x    }, 
    {el: g.right, top: g.topRight,metric: m2, colFn: (x) => 1 - x}
  ];
  const key = sides[0].metric;
  rows.sort((a,b) => b[key] - a[key]);
  for (const side of sides) {
    side.top.append("text");
  }
  updateRankingChart(sides, rows, g);
  if (el.id === "Interactive") {
    interactive.sides = sides;
    interactive.g = g;
  }
  return svg.node();
}

function updateRankingChart(sides, rows, g) {
  const dh = dim.h / rows.length;
  for (const side of sides) {
    side.top.select("text").text(data.labels[side.metric]);
    const max = d3.max(rows.map(d => d[side.metric]));
    const scale = d3.scaleSequential([0, max], [0, dim.side]);
    side.el.selectAll("rect").data(rows).join("rect")
      .attr("class", "databar")
      .attr("x", 0)
      .attr("y", (d, i) => dh * i + dim.padding)
      .attr("width", d => scale( +d[side.metric] ))
      .attr("height", dh - 2*dim.padding)
      .attr("fill", d => colorScale(side.colFn(+d[side.metric] / max)))
      .append("title").text(d => d[side.metric]?.toFixed(1));
  }
  g.mid.selectAll("text").data(rows)
    .join("text")
      .attr("class", d => data.regions["ex-socialist"].includes(d.ccode)? "ee" : "")
      .attr("y", (d, i) => (i + 0.5)*dh )
      .text(d => d.ccode)
      .append("title").text(d => data.clabels[d.ccode]);
}

function readDropdown(side) {
  const selectInstance = M.FormSelect.getInstance(document.getElementById("dd-" + side));
  // workaround, see https://github.com/Dogfalo/materialize/issues/6536
  selectInstance._setSelectedStates();
  return selectInstance.getSelectedValues()[0];
}

function updateInteractive() {
  const key = readDropdown('left');
  interactive.sides[0].metric = key;
  interactive.sides[1].metric = readDropdown('right');
  const rows = rankingx("2021-W45");
  rows.sort((a,b) => b[key] - a[key]);
  updateRankingChart(interactive.sides, rows, interactive.g);
}