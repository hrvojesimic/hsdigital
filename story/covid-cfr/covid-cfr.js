const START_DATE = new Date('2020-01-21');
const END_DATE = new Date('2020-11-05'); //TODO remove?

const preparation = {
  cfrs: "/story/covid-cfr/cfrs.csv",
  timeseries: {
    uri: "/story/covid-cfr/timeseries.csv",
    augment: augmentTimeseries
  },
  secondWaveCfrs: "/story/covid-cfr/swo.csv",
  septCfr: "/story/covid-cfr/swod.csv"
};

function num(v) {
  return v === ''? undefined : +v;
}

function augmentTimeseries(row) {
  return {
    date: new Date(row.date),
    territory: row.territory,
    cases: num(row.cases),
    deaths: num(row.deaths),
    weekTestRate: num(row.weekTestRate),
    weekPosRate: num(row.weekPosRate),
    cases2w: num(row.cases2w),
    alarm: num(row.alarm)
  };
}

function dataCompleted() {
  Array.from(document.getElementsByClassName("cfrHistograms")).forEach(el=>
    drawCfrHistograms(el)
  );
  drawCfrChangeChart();
  drawAllFullCharts();
}

function prepareLocal() {
}

function drawCfrHistograms(el) {
  const clist = el.textContent.split(",").map(s => s.trim());
  clist.sort();
  el.textContent = "";
  const step = 20;
  const dims = {
    width:  200, 
    height: clist.length * step, 
    left:   10, 
    right:  10, 
    top:    10, 
    bottom: 20
  };
  const g = d3.group(data.secondWaveCfrs, d => d.territory);
  // const cfrArrays = Array.from(g, d => d[1].map(o => +o.cfr));
  var xScale = d3.scaleLinear().domain([0, 0.1]).range([dims.width,0]);
  const histogram = d3.histogram()    
    .domain([0, 0.2])
    .thresholds(d3.range(20).map(i => i/200))
    .value(d => d);
  const svg = d3.select(el)
    .append("svg").attrs({
      class: "crfHist",
      viewBox: `0,0,${dims.left + dims.width + dims.right},${dims.top + dims.height + dims.bottom}`
    });
  svg.append("g").attrs({
    class: "btmAxis",
    transform: `translate(${dims.left},${dims.top + dims.height})`
  }).call(
    d3.axisBottom(xScale)
      .ticks(10).tickSize(-dims.height)
      .tickFormat(d3.format(".0%"))
  );

  const chartZone = svg.append("g")
    .attr("transform",(d,i) => `translate(${dims.left}, ${dims.top})`);
  const area = d3.area()
    .y0(d => -d.length).y1(0)
    .x(d => xScale(d.x0))
    .curve(d3.curveMonotoneX);
  const violins = chartZone.selectAll("g.violin")
    .data(clist.map(x => [x, g.get(x)]));
  const enterViolin = violins.enter().append("g")
    .attr("transform",(d,i) => `translate(0, ${(i+0.5) * step + 6})`);
  enterViolin.append("text").text(d => d[0]);
  enterViolin.append("path")
        .style("stroke","darkslategray")
        .style("stroke-opacity", 0.8)
        .style("stroke-width", 1)
        .style("fill", "url(#grad1)")
        .attr("d", d => area(histogram(d[1].map(o => +o.cfr))));
}

function drawCfrChangeChart() {
  const dims = {
    width:  200, 
    height: 400, 
    left:    12, 
    right:  100, 
    top:     15, 
    bottom:  20
  };
  const ss = [...data.cfrs].map(d => { return{
    country: d.country, zone: d.zone, 
    before: +d.before/100, after: +d.after/100
  }});
  ss.sort((a,b)=> b.before - a.before);
  const zone = d3.group(ss, d => d.zone);
  const rowHeight = dims.height / (ss.length + 2.5);
  const svg = d3.select(document.getElementById("CfrChangeChart"))
    .append("svg")
      .attr("viewBox", 
            `0,0,${dims.left + dims.width + dims.right},${dims.top + dims.height + dims.bottom}`);

  const defs = svg.append('defs');
  defs.append('marker').attrs({
      id: "arrow",
      viewBox: [0, 0, 2, 2],
      refX: 1,
      refY: 1,
      markerWidth: 2,
      markerHeight: 2,
      orient: "auto-start-reverse",
    }).append('path').attrs({
      d: d3.line()([[0, 0], [0, 2], [2, 1]]),
      stroke: "black", "stroke-width": 0
    });
  const gradient = defs.append("linearGradient").attrs({
    id: "grad1", x1: "0%", y1: "0%", x2: "100%", y2: "0%"
  });
  gradient.append("stop").attrs({
    offset: "0%", style: "stop-color:#e8303b; stop-opacity: 1"
  });
  gradient.append("stop").attrs({
    offset: "100%", style: "stop-color:#f9d56e; stop-opacity: 1"
  });
  
  svg.append("rect").attrs({
    x: 0, y: dims.top, 
    width: dims.left + dims.width, height: dims.height, 
    stroke: "none", fill: "url(#grad1)"
  });

  const xScale = d3.scaleLinear()
    .domain([0, d3.max(ss, d=>Math.max(d.before, d.after))])
    .range([dims.width, 0]);
  svg.append("g").attrs({
    class: "btmAxis",
    transform: `translate(${dims.left},${dims.top + dims.height})`
  }).call(
    d3.axisBottom(xScale)
      .ticks(5).tickSize(-dims.height)
      .tickFormat(d3.format(".0%"))
  );

  const chartG = svg.append("g")
    .attr("class", "chart")
    .attr("transform", `translate(${dims.left},${dims.top})`);

  let i = -0.3;
  for (const z of "WEO") {
    const dset = zone.get(z);
    i++;
    for (const row of dset) {
      const y = (i++) * rowHeight;
      const sw = data.septCfr.find(d => d.territory === row.country);
      if (!sw) { console.log("missing " + row.country); continue; }
      const rowG = chartG.append("g").attrs({
        class: "change"
      });
      rowG.append("title").text(row.country);
      rowG.append("text")
        .attr("transform", `translate(${dims.width + 5}, ${y + 2})`)
        .text(row.country);

      rowG.append("circle").attrs({
        class: "before",
        cx: xScale(row.before),
        cy: y,
        r:  10
      });
      rowG.append("rect").attrs({
        class: "after",
        x: xScale(sw.q3),
        y: y - 6,
        width: xScale(sw.q1) - xScale(sw.q3),
        height: 12
      });
      // rowG.selectAll("line.q").data([sw.min, sw.median, sw.max])
      //     .enter()
      //       .append("line").attrs({class: "after q",
      //         x1: d => xScale(d), y1: y - 6,
      //         x2: d => xScale(d), y2: y + 6
      //       });
      // rowG.append("line").attrs({class: "after",
      //   x1: xScale(sw.max), y1: y,
      //   x2: xScale(sw.q3), y2: y
      // });
      // rowG.append("line").attrs({class: "after",
      //   x1: xScale(sw.q1), y1: y,
      //   x2: xScale(sw.min), y2: y
      // });
      rowG.append("line").attrs({
        class: "arrow",
        x1: xScale(row.before),
        y1: y,
        x2: xScale(sw.median) - 2, //xScale(row.after),
        y2: y,
        'marker-end': 'url(#arrow)'
      });
    }
  }
  chartG.append("line").attrs({
    class: "line0",
    x1: xScale(0) + 0.5, x2: xScale(0) + 0.5, y1: 0, y2: dims.height
  });
}

function drawAllFullCharts() {
  for (let el of document.querySelectorAll('.fullChart')) {
    drawFullChart(
      el, 
      el.dataset.territory, 
      el.dataset
    );
  }
}

function drawFullChart(node, territory, {show = 'cdftpa', dmax, offset=0, radius=15}) {
  offset = +offset;
  radius = +radius;
  dmax = (+dmax) / 10;
  const dims = {
    width:   350, 
    heightC: show.includes('c')? 200 : 0, 
    heightF: show.includes('f')? 160 : 0,
    heightT: show.includes('t')? 100 : 0,
    gap:     show.includes('t') || show.includes('f')? 15 : 0,
    left:    40, 
    right:   60, 
    top:     5, 
    bottom:  20
  };
  const tdata = data.timeseries.filter(d=> d.territory === territory);
  const maxCases = d3.max(tdata, d => d.cases);
  const uniqueId = nextUniqueId();
  const totalHeight = 
    dims.top + dims.heightC + dims.gap + dims.heightF + dims.gap + dims.heightT + dims.bottom;
  const totalWidth = dims.left + dims.width + dims.right;

  const topSvg = d3.select(node)
    .append("svg")
      .attr("viewBox", `0,0,${totalWidth},${totalHeight}`);
  
  topSvg.append("defs").html(`
    <pattern id="${uniqueId}" viewBox="0,0,${offset},100" width="10%" height="100%" stroke="black" stroke-opacity="30%" stroke-width="0.5">
      <line x1="${offset}" y1="0" x2="1" y2="50"/>
      <line x1="1" y1="50" x2="${offset}" y2="100"/>
    </pattern>
    <linearGradient id="fadeBlue">
      <stop class="fullBlue" offset="0%"/>
      <stop class="fadedBlue" offset="100%"/>
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
  
  if (show.includes('c') || show.includes('d')) {
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
    chartAreaC.append("path").attr("class", "casesArea fadeBlue")
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
        [0.001, 0.01, 0.1, 0.2]
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
    chartAreaF.append("g")
      .attr("class", "cfrAxis")
      .attr("transform", `translate(${dims.width}, 0)`)
      .call(d3.axisRight(yCfr).tickValues(
        [0.001, 0.002, 0.003, 0.005, 0.007, 0.01, 0.02, 0.03, 0.05, 0.07, 0.1, 0.2]
      ).tickFormat(d3.format(".0p")));
    
    const dx = 1;
    const cfrG = chartAreaF.append("g").attr("class", "cfrTicks");
    for (const [i, d] of cfrData.entries()) {
      const dy = radiusScale(d.cases);
      cfrG.append("line")
          .attr("x1", xScale(d.date))
          .attr("y1", yCfr(d.cfr) - dy/2)
          .attr("x2", xScale(d.date))
          .attr("y2", yCfr(d.cfr) + dy/2)
          .attr("stroke-opacity", opacityScale(i));
    }
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

function cfrOffsets(territory) {
  const CUTOFF = new Date("2020-09-01");
  const a = data.timeseries.filter(d=> d.territory === territory && d.date >= CUTOFF);
  const dc = a[14].cases - a[0].cases;
  const result = [];
  for (let offset = 0; offset <= 28; offset++) {
    result.push({
      territory: territory,
      offset: offset,
      cfr: (a[offset+14].deaths - a[offset].deaths) / dc
    });
  }
  return result;
}
