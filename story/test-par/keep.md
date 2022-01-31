
## Je li zadnje slovo A?

```vly
width: 300
height: 50
data:
  name: set
transform:
  - calculate: "substring(datum.name, length(datum.name)-1)"
    as: last_letter
  - calculate: "datum.last_letter == 'A'? 'da' : 'ne'"
    as: is_a
mark: bar
encoding:
  x:
    type: quantitative
    field: count
    aggregate: sum
    title: null
  y:
    type: nominal
    field: is_a
  color:
    type: nominal
    field: gender
    scale:
      domain: [M, F]
      range: [darkblue, darkred]
caption: Udio kojeg roda, ovisno o tome je li imena završavaju slovom A.
```


Prvo slovo imena:


```vly
width: 500
height: 70
data:
  name: set
transform:
  - calculate: "substring(datum.name, 0, 1)"
    as: last_letter
mark: text
encoding:
  y:
    title: rod
    type: nominal
    field: gender
  x:
    title: broj imena
    type: quantitative
    field: count
    aggregate: sum
    scale: 
      type: log
      domainMin: 1
      domainMax: 500
  text:
    type: ordinal
    field: last_letter
  size:
    type: quantitative
    field: count
    aggregate: sum
    scale: {type: log}
    legend: null
  opacity:
    type: quantitative
    field: count
    aggregate: sum
    scale: {type: log}
    legend: null
  color:
    type: nominal
    field: gender
    legend: null
    scale:
      domain: [M, F]
      range: [darkblue, darkred]
```

```vly
width: 400
height: 300
data:
  name: lfreq
transform:
  - filter: datum.ends >= 10
mark: text
encoding:
  y:
    type: nominal
    field: letter
    title: null
  text:
    type: nominal
    field: letter
  x:
    title: broj imena
    type: quantitative
    field: ends
  color:
    type: nominal
    field: gender
    legend: null
    scale:
      domain: [M, F]
      range: [darkblue, darkred]
```

Zadnje slovo imena:

```vly
width: 500
height: 70
data:
  name: set
transform:
  - calculate: "substring(datum.name, length(datum.name)-1)"
    as: last_letter
mark: text
encoding:
  y:
    title: rod
    type: nominal
    field: gender
  x:
    title: broj imena
    type: quantitative
    field: count
    aggregate: sum
    scale: 
      type: log
      domainMin: 1
      domainMax: 1000
  text:
    type: ordinal
    field: last_letter
  size:
    type: quantitative
    field: count
    aggregate: sum
    scale: {type: log}
    legend: null
  opacity:
    type: quantitative
    aggregate: count
    scale: {type: log}
    legend: null
  color:
    type: nominal
    field: gender
    legend: null
    scale:
      domain: [M, F]
      range: [darkblue, darkred]
```

```vly
width: 500
height: 70
data:
  name: set
transform:
  - filter: substring(datum.name, length(datum.name)-1) == 'A'
  - calculate: "substring(datum.name, length(datum.name)-2, length(datum.name)-1)"
    as: letter
mark: text
encoding:
  y:
    title: rod
    type: nominal
    field: gender
  x:
    title: broj imena
    type: quantitative
    field: count
    aggregate: sum
    scale: 
      type: log
  text:
    type: ordinal
    field: letter
  size:
    type: quantitative
    field: count
    aggregate: sum
    scale: {type: log}
    legend: null
  opacity:
    type: quantitative
    aggregate: count
    scale: {type: log}
    legend: null
  color:
    type: nominal
    field: gender
    legend: null
    scale:
      domain: [M, F]
      range: [darkblue, darkred]
```

```vly
width: 30
height: 200
data:
  url: "/story/test-par/imena.csv"
  format: {type: csv}
transform:
  - calculate: "length(datum.name)"
    as: name_length
mark: bar
encoding:
  column:
    title: duljina imena
    type: ordinal
    field: name_length
  x:
    title: null
    axis: null
    type: nominal
    field: gender
  y:
    title: broj imena tolike duljine
    type: quantitative
    field: count
    aggregate: sum
  color:
    title: rod
    type: nominal
    field: gender
    scale:
      domain: [M, F]
      range: [steelblue, red]
config:
  facet: {spacing: 6}
```




function update(testFn, dims, containerEl, show = {}) {
  const state = situation(testFn);
  const pg = d3.select(containerEl).select(".playground");
  pg.selectAll("line.divider")
    .data([state])
    .join("line").attrs({
      class: "divider",
      x1: s => s.prevalence * dims.width,
      y1: 0,
      x2: s => s.prevalence * dims.width,
      y2: dims.height
    });
  
  if (show.net)
    pg.selectAll("path.net")
      .data([
        {w: dims.width * state.prevalence, h: dims.height, overlap: state.sensitivity, label: "truepos"},
        {w: dims.width * (1-state.prevalence), h: dims.height, overlap: 1-state.specificity, label: "falsepos"}
      ])
      .join("path").attrs({
        class: d => "net " + d.label,
        transform: (d, i) => i == 0? "" :
                  `translate(${dims.width} 0) scale(-1 1)`,
        d: o => calcNet(o).toString()
      });

  const divX = dims.width * state.prevalence;
  const w2 = dims.width * (1 - state.prevalence);
  if (show.net && show.names) {
    layoutNames(
      "truePos", pg,
      topNames(testFn, true, true, 35), 
      {x: 2, y: 10}, 
      divX - 2, dims.height - 20
    );
    layoutNames(
      "trueNeg", pg, 
      [{fx: divX, fy: dims.height/2, width: w2/3, height: dims.height/3, hidden: true}].concat(
        topNames(testFn, false, false, 45)
      ), 
      {x: divX, y: 0},
      w2, dims.height
    );
    layoutNames(
      "falsePos", pg,
      topNames(testFn, false, true, 5),
      {x: divX, y: dims.height/3},
      w2/3, dims.height/3
    );
    cornerNames(
      "falseNeg", pg,
      topNames(testFn, true, false, 4),
      {x: 0, y: 0},
      divX, dims.height
    );
  }
  if (!show.net && show.names) {
    layoutNames(
      "female", pg, 
      topNames(testFn, true, undefined, 41),
      {x: 0, y: 0}, 
      dims.width * state.prevalence, dims.height
    );
    layoutNames("male", pg, 
      topNames(testFn, false, undefined, 59), 
      {x: dims.width * state.prevalence, y: 0},
      dims.width * (1 - state.prevalence), dims.height
    );
  }

  if (show.net) {
    const gouges = d3.select(containerEl).select(".underground")
      .selectAll(".measure.proportion")
      .data(["prevalence", "specificity", "sensitivity", "precision"]);
    const R = dims.bottom / 2.5;
    gouges.join("circle").attrs({
      class: d => "measure proportion " + d,
      cx: (d, i) => (i + 0.5) * R * 2.7,
      cy: R * 1.3,
      r:  R,
      "stroke-dasharray": d => `${R*TAU*state[d]} ${R*TAU*(1 - state[d])}`,
      "stroke-dashoffset": d => `${R*TAU*(state[d]/2 - 0.25)}`
    });
    gouges.join("text").attrs({
      class: "percentage",
      x: (d, i) => (i + 0.5) * R * 2.7, 
      y: R * 1.3
    }).text(d => (state[d] * 100).toFixed(0) + "%");
    gouges.join("rect").attrs({
      class: "gouge label underlay",
      x:      (d, i) => (i + 0.07) * R * 2.7, 
      y:      R * 1.8,
      width:  R * 2.2,
      height: R * 0.6
    }).text(d => d);
    gouges.join("text").attrs({
      class: "gouge label",
      x: (d, i) => (i + 0.5) * R * 2.7, 
      y: R * 2.1
    }).text(d => data.translate[d]);
  }
}


function forceLayout(id, pg, nodes, origin, w, h) {
  const sim = d3.forceSimulation(nodes);
  sim.force('middle', d3.forceCenter(origin.x + w/2, origin.y + h/2));
  sim.force('charge', d3.forceManyBody().strength(-0.5));
  sim.force('collision', rectCollide());
  sim.on("tick." + id, tick);
  const wg = pg.append("g");

  function tick() {
    nodes.forEach(n => {
      n.x = boxed(n.x, origin.x + n.width/2  + 2, origin.x + w - n.width/2 - 2);
      n.y = boxed(n.y, origin.y + n.height/2 + 2, origin.y + h - n.height/2 - 2);
      if (Number.isNaN(n.x)) n.x = origin.x + w/2;
      if (Number.isNaN(n.y)) n.y = origin.y + h/2;
    });
    wg.selectAll("rect").data(nodes).join("rect").attrs({
      x: d => d.x - d.width/2, y: d => d.y - d.height/2,
      width: d => d.width, height: d => d.height,
      fill: "none", stroke: "gray", "stroke-width": 0.5
    });
    const gn = wg.selectAll("text.eg." + id).data(nodes);
    gn.join("text").attrs({
      class: "eg ff " + id,
      x: d => d.x, 
      y: d => d.y,
      "font-size": d => data.sizeScale(d.count) + "px"
    }).text(d => d.hidden === true? "" : d.name);
  }
}

function cornerNames(id, pg, nameList, origin, w, h) { 
  const sizeScale = d3.scaleSqrt().domain([1, data.maxCount]).range([3, 16]);
  const wg = pg.append("g");
  if (nameList[0]) 
    wg.selectAll("text.eg.topleft." + id)
      .data([nameList[0]])
      .join("text").attrs({
        class: "eg topleft " + id,
        x: origin.x + 1, 
        y: origin.y + 1,
        "font-size": d => sizeScale(d.count) + "px",
        "dominant-baseline": "hanging",
        "text-anchor": "start"
      }).text(d => d.name);

  if (nameList[1]) 
    wg.selectAll("text.eg.btmleft." + id)
      .data([nameList[2]])
      .join("text").attrs({
        class: "eg btmleft " + id,
        x: origin.x + 1, 
        y: origin.y + h - 1,
        "font-size": d => sizeScale(d.count) + "px",
        "dominant-baseline": "text-bottom",
        "text-anchor": "start"
      }).text(d => d.name);
  
  if (nameList[2]) 
    wg.selectAll("text.eg.topright." + id)
      .data([nameList[1]])
      .join("text").attrs({
        class: "eg topright " + id,
        x: origin.x + w - 2, 
        y: origin.y + 1,
        "font-size": d => sizeScale(d.count) + "px",
        "dominant-baseline": "hanging",
        "text-anchor": "end"
      }).text(d => d.name);

  if (nameList[3])
      wg.selectAll("text.eg.btmright." + id)
        .data([nameList[3]])
        .join("text").attrs({
          class: "eg btmright " + id,
          x: origin.x + w - 2, 
          y: origin.y + h - 1,
          "font-size": d => sizeScale(d.count) + "px",
          "dominant-baseline": "text-bottom",
          "text-anchor": "end"
        }).text(d => d.name);
}

function rectCollide() {
  const padding = 1;
  let nodes;

  function force(alpha) {
    const quad = d3.quadtree(nodes, d => d.x, d => d.y);
    for (const d of nodes) {
      quad.visit((q, x1, y1, x2, y2) => {
        let updated = false;
        if (q.data && q.data !== d){
			    let x = d.x - q.data.x,
				  y = d.y - q.data.y,
				  xSpacing = padding + (q.data.width + d.width) / 2,
				  ySpacing = padding + (q.data.height + d.height) / 2,
				  absX = Math.abs(x),
				  absY = Math.abs(y),
				  l,
				  lx,
				  ly;

			    if (absX < xSpacing && absY < ySpacing) {
				    l = Math.sqrt(x * x + y * y);
				    lx = (absX - xSpacing) / l;
				    ly = (absY - ySpacing) / l;

				    // the one that's barely within the bounds probably triggered the collision
				    if (Math.abs(lx) > Math.abs(ly)) {
					    lx = 0;
				    } else {
					    ly = 0;
				    }
				    d.x -= x *= lx;
				    d.y -= y *= ly;
				    q.data.x += x;
				    q.data.y += y;

				    updated = true;
			    }
		    }
		    return updated;
      });
    }
  }

  force.initialize = _ => nodes = _;

  return force;
}