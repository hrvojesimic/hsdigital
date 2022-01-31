const TAU = 2 * Math.PI;
const CORNER_CUTOFF = 0.04;
const preparation = {
  translate: "/story/test-par/translate.json",
  set: {
    uri: "/story/test-par/imena.csv",
    augment: augmentName
  },
  lfreq: {
    construction: constructLetterFreqs,
    waitFor: ["set"]
  }
};

function augmentName(o) {
  return {
    name: o.name,
    gender: o.gender,
    count: +o.count
  };
}

function constructLetterFreqs() {
  const result = [];
  for (let gender of "MF") {
    const ds = data.set.filter(o => o.gender === gender);
    for (let ch of "ABCČĆDĐEFGHIJKLMNOPQRSŠTUVWXŽ") {
      result.push({
        letter: ch,
        gender: gender,
        starts: d3.sum(ds.filter(o => o.name.startsWith(ch)), o => o.count),
        ends: d3.sum(ds.filter(o => o.name.endsWith(ch)), o => o.count)
      });
    }
  }
  return result;
}

function dataCompleted() {
  for (let el of document.getElementsByClassName("namespace")) {
    draw(el);
  }
}

function draw(containerEl) {
  const dset = containerEl.dataset;
  const show = dset.show.split(",").reduce((a,k)=> (a[k.trim()] = true, a), {});
  const ratio = dset.sample === undefined? undefined : makeRatio(dset.sample);
  const dims = {
    width:  260, 
    height: 140, 
    left:     2, 
    right:    2, 
    top:      2, 
    bottom:  show.net? 60: 2
  };
  const svg = d3.select(containerEl).append("svg").attrs({
    viewBox: `0,0,${dims.left + dims.width + dims.right},${dims.top + dims.height + dims.bottom}`
  });
  const playground = svg.append("g").attrs({
    class: "playground",
    transform: `translate(${dims.left} ${dims.top})`
  });
  playground.append("rect").attrs({
    class: "popArea",
    x: 0, y: 0, 
    width: dims.width, height: dims.height
  });
  const btm = svg.append("g").attrs({
    class: "underground",
    transform: `translate(${dims.left} ${dims.top + dims.height})`
  });
  const expr = dset.fn.replaceAll("$#39;", "'")
  const testFn = new Function('s', 'return ' + expr);
  update(testFn, dims, containerEl, show, ratio);
}

function makeRatio(s) {
  const a = s.split(" ");
  return {M: +a[0], F: +a[1]};
}

function count(predicate, a = data.set) {
  return a.filter(predicate)
          .map(v => +v.count)
          .reduce((acc, n) => acc + n, 0);
}

function situation(testFn, ratio) {
  const a = (ratio === undefined)? data.set : sample(ratio);
  const r = {};
  r.maxCount       = d3.max(a, d => d.count);
  r.truePositives  = count(v => v.gender == 'F' &&  testFn(v.name), a);
  r.trueNegatives  = count(v => v.gender != 'F' && !testFn(v.name), a);
  r.falsePositives = count(v => v.gender != 'F' &&  testFn(v.name), a);
  r.falseNegatives = count(v => v.gender == 'F' && !testFn(v.name), a);
  r.females        = r.truePositives  + r.falseNegatives;
  r.males          = r.falsePositives + r.trueNegatives;
  r.total          = r.males + r.females;
  r.prevalence     = r.females / r.total;
  r.sensitivity    = r.truePositives / r.females;
  r.specificity    = r.trueNegatives / r.males;
  r.precision      = r.truePositives / (r.truePositives + r.falsePositives);
  return r;
}

function joinNames(pg, state, dims) {
  const sizeScale = d3.scaleSqrt()
    .domain([1,d3.max(data.set, d=>d.count)])
    .range([5,15]);
  pg.selectAll("text.eg.falseneg")
    .data(topNames(testFn, true, false, 5))
    .join("text").attrs({
      class: "eg falseneg",
      x: 2,
      y: (d, i) => dims.height / 2 + (i - 2) * 12,
      "font-size": d => sizeScale(d.count)+"px"
    }).text(d => d.name);
  pg.selectAll("text.eg.truepos")
    .data(topNames(testFn, true, true, 9))
    .join("text").attrs({
      class: "eg truepos",
      x: dims.width * state.prevalence - 2,
      y: (d, i) => dims.height / 2 + (i - 4) * 12,
      "font-size": d => sizeScale(d.count)+"px"
    }).text(d => d.name);
  pg.selectAll("text.eg.falsepos")
    .data(topNames(testFn, false, true, 5))
    .join("text").attrs({
      class: "eg falsepos",
      x: dims.width * state.prevalence + 2,
      y: (d, i) => dims.height / 2 + (i - 1) * 12,
      "font-size": d => sizeScale(d.count)+"px"
    }).text(d => d.name);
  pg.selectAll("text.eg.trueneg")
    .data(topNames(testFn, false, false, 9))
    .join("text").attrs({
      class: "eg trueneg",
      x: dims.width - 2,
      y: (d, i) => dims.height / 2 + (i - 4) * 12,
      "font-size": d => sizeScale(d.count)+"px"
    }).text(d => d.name);
}

function netPath({w, h, overlap}) {
  const p = d3.path();
  if (overlap > 1/9) {
    const f = Math.sqrt(overlap);
    const nw = f*w, nh = f*h;
    const y0 = (h - nh)/2;
    p.moveTo(0, h/3);
    p.quadraticCurveTo(  0, y0  ,    nw/2, y0    );
    p.quadraticCurveTo( nw, y0  ,    nw  ,    h/2);
    p.quadraticCurveTo( nw, y0 + nh, nw/2, y0+nh  );
    p.quadraticCurveTo(  0, y0 + nh,  0  ,  2*h/3);
    p.closePath();
    return p;
  }
  else {
    const p = d3.path(), dx=1;
    p.moveTo(0, h/3);
    p.quadraticCurveTo(w * overlap * 9, h/2, 0, 2*h/3);
    p.closePath();
    return p;
  }
}

function topNames(testFn, female, positive, n, ratio) {
  let a = (ratio === undefined)? data.set : sample(ratio);
  if (female)
    a = a.filter(o => o.gender === 'F');
  else
    a = a.filter(o => o.gender != 'F');
  if (positive != undefined)
    a = a.filter(o => positive? testFn(o.name) : !testFn(o.name));
  a.sort((a,b) => b.count - a.count);
  return a.slice(0, n);
}

function layoutNames(id, pg, nameList, origin, w, h) { 
  const n = nameList.length;
  const r = Math.min(w, h)/2;
  const nodes = nameList.sort(() => Math.random() - 0.5).map((o, i) => ({
    name:   o.name, 
    count:  o.count,
    x:      origin.x + r * Math.random() * Math.cos(TAU*i/n),
    y:      origin.y + r * Math.random() * Math.sin(TAU*i/n),
    fx:     o.fx,
    fy:     o.fy,
    hidden: o.hidden === true,
    width:  o.width?  o.width  : o.name.length*3.5 + o.count/4.5, 
    height: o.height? o.height : sizeScale(o.count)
  }));
  forceLayout(id, pg, nodes, origin, w, h);
}

function boxed(a, min, max) {
  return Math.min(Math.max(min, a), max);
}

function drawNet(pg, dims, p, s1, s2, i) {
  pg.selectAll("path.net.c" + i)
      .data([
        {w: -dims.width *    p,  h: dims.height, overlap: s1, label: "truepos" },
        {w:  dims.width * (1-p), h: dims.height, overlap: s2, label: "falsepos"}
      ])
      .join("path").attrs({
        class: d => "net " + d.label + " c" + i,
        transform: `translate(${dims.width*p} 0)`,
        d: o => netPath(o).toString()
      });
}

function update(testFn, dims, containerEl, show = {}, ratio = undefined) {
  const state = situation(testFn, ratio);
  const sizeScale = d3.scaleSqrt().domain([1, state.maxCount]).range([3, 16]);
  const pg = d3.select(containerEl).select(".playground");
  pg.selectAll("line.divider")
    .data([state.prevalence])
    .join("line").attrs({
      class: "divider",
      x1: p => p * dims.width,
      y1: 0,
      x2: p => p * dims.width,
      y2: dims.height
    });
  
  if (show.net) {
    drawNet(pg, dims, state.prevalence, state.sensitivity, 1-state.specificity, 0);
  }

  const divX = dims.width * state.prevalence;
  const w2 = dims.width * (1 - state.prevalence);
  if (show.net) {
    if (show.names || show.tp) drawLabels(
      "truePos", pg, arrange(
        topNames(testFn, true, true, 35, ratio), 
        state.truePositives / state.total,
        {x: 2, y: 10, w: divX - 2, h: dims.height - 20},
        false,
        sizeScale
      ),
      {x: 2, y: 2, w: divX - 2, h: dims.height - 2}
    );
    if (show.names || show.tn) drawLabels(
      "trueNeg", pg, arrange(
        topNames(testFn, false, false, 45, ratio),
        state.trueNegatives / state.total, 
        {x: divX, y: 0, w: w2, h: dims.height},
        {x: divX, y: dims.height/2, w: w2/3, h: dims.height/3},
        sizeScale
      ),
      {x: divX, y: 0, w: w2, h: dims.height}
    );
    if (show.names || show.fp) drawLabels(
      "falsePos", pg, arrange(
        topNames(testFn, false, true, 33, ratio),
        state.falsePositives / state.total,
        {x: divX, y: dims.height/3, w: w2/3, h: dims.height/3},
        false,
        sizeScale
      ),
      {x: divX, y: dims.height/3, w: w2/3, h: dims.height/3}
    );
    if (show.names || show.fn) drawLabels(
      "falseNeg", pg, 
        arrange(
          topNames(testFn, true, false, 33, ratio),
          state.falseNegatives / state.total,
          {x: 0, y: 0, w: divX, h: dims.height},
          false,
          sizeScale
        ),
      {x: 0, y: 0, w: divX, h: dims.height}
    );
  }
  if (!show.net && show.names) {
    drawLabels("female", pg, 
      arrange(
        topNames(testFn, true, undefined, 41, ratio),
        state.prevalence,
        {x: 0, y: 0, w: divX, h: dims.height},
        false,
        sizeScale
      ),
      {x: 0, y: 0, w: divX, h: dims.height}
    );
    drawLabels("male", pg, 
      arrange(
        topNames(testFn, false, undefined, 59, ratio), 
        1 - state.prevalence,
        {x: divX, y: 0, w: w2, h: dims.height},
        false,
        sizeScale
      ),
      {x: divX, y: 0, w: w2, h: dims.height}
    );
  }

  if (show.net) {
    const gouges = d3.select(containerEl).select(".underground")
      .selectAll(".measure.proportion")
      .data(["prevalence", "specificity", "sensitivity", "precision"]);
    const R = dims.bottom / 2.5;
    gouges.join("circle").attrs({
      class: d => "measure background " + d,
      cx: (d, i) => (i + 0.5) * R * 2.7,
      cy: R * 1.3,
      r:  R,
      "stroke-dasharray": d => `${R*TAU*1} ${R*TAU*(1 - 1)}`,
      "stroke-dashoffset": d => `${R*TAU*(1/2 - 0.25)}`
    });
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

function drawLabels(id, parentEl, nodes, box) {
  // console.log("Drawing in " + id + ", " + JSON.stringify(box) + " <- " + JSON.stringify(nodes));
  const element = parentEl.append("g").attr("class", id);
  const sim = d3.forceSimulation(nodes).velocityDecay(0.1);
  sim.force('middle', d3.forceCenter(box.x + box.w/2, box.y + box.h/2));
  sim.force('charge', d3.forceManyBody().strength(0.5));
  sim.force('collision', bboxCollide(function (d,i) {
    return [[-d.width/2, -d.height/2],[d.width/2, d.height/2]]
  }).strength(0.5));
  sim.on("tick." + id, tick);

  function tick() {
    nodes.forEach(n => {
      const h = n.width === 0? 0 : n.height;
      n.x = boxed(n.x, box.x + n.width/2  + 2, box.x + box.w - n.width/2  - 2);
      n.y = boxed(n.y, box.y + h/2 + 2, box.y + box.h - h/2 - 2);
      if (Number.isNaN(n.x)) n.x = box.x + box.w/2;
      if (Number.isNaN(n.y)) n.y = box.y + box.h/2;
    });
    // element.selectAll("rect").data(nodes).join("rect").attrs({
    //   x: d => d.x - d.width/2, y: d => d.y - d.height/2,
    //   width: d => d.width, height: d => d.height,
    //   fill: "none", stroke: "none", "stroke-width": 0.5
    // });
    const gn = element.selectAll("text.eg." + id).data(nodes);
    gn.join("text").attrs({
      class: d => d.class + " eg ff " + id,
      x: d => d.x, 
      y: d => d.y,
      "font-size": d => d.height + "px"
    }).text(d => d.label? d.label : "");
  }
}

function nameCount(p) {
  const scale = d3.scaleLinear().domain([0, 1]).range([0, 75]);
  return Math.floor(scale(p));
}

function arrange(names, portion, box, cutout, sizeScale) {
  if (portion < CORNER_CUTOFF) {
    return arrangeInCorners(box, names.slice(0, 4), sizeScale);
  }
  else {
    const n = nameCount(portion);
    if (cutout) return arrangeInArc(box, cutout, names.slice(0, n), sizeScale);
           else return arrangeInRectangle(box, names.slice(0, n), sizeScale);
  }
}

function arrangeInRectangle(box, names, sizeScale) {
  const n = names.length;
  const a = Math.sqrt(n);
  return names.sort(randomly).map((o, i) => ({
    label:  o.name,
    x:      (Math.floor(i / a) + 0.5) * box.w/a + box.x,
    y:      (Math.floor(i % a) + 0.5) * box.h/a + box.y,
    width:  o.name.length*5 + o.count/4, 
    height: sizeScale(o.count)
  }));
}

function arrangeInArc(box, cutout, names, sizeScale) {
  const n = names.length;
  const a = Math.sqrt(n);
  const result = [{
    x:      cutout.x + cutout.w/2, 
    y:      cutout.y, 
    fx:     cutout.x + cutout.w/2, 
    fy:     cutout.y, 
    width:  cutout.w, 
    height: cutout.h
  }].concat(names.sort(randomly).map((o, i) => ({
    label:  o.name,
    x:      (Math.floor(i / a) + 0.5) * box.w/a + box.x,
    y:      (Math.floor(i % a) + 0.5) * box.h/a + box.y,
    width:  o.name.length*5 + o.count/4.5, 
    height: sizeScale(o.count)
  })));
  return result;
}

function arrangeInCorners(box, names, sizeScale) { 
  const result = [];
  if (names[0]) 
    result.push({
      label: names[0].name,
      class: "top left",
      fx: box.x, 
      fy: box.y,
      width:  0, 
      height: sizeScale(names[0].count)
    });
  if (names[1]) 
    result.push({
      label: names[1].name,
      class: "btm left",
      fx: box.x, 
      fy: box.y + box.h - 1,
      width:  0, 
      height: sizeScale(names[1].count)
    });
  if (names[2]) 
    result.push({
      label: names[2].name,
      class: "top right",
      fx: box.x + box.w, 
      fy: box.y,
      width:  0, 
      height: sizeScale(names[2].count)
    });
  if (names[3]) 
    result.push({
      label: names[3].name,
      class: "btm right",
      fx: box.x + box.w, 
      fy: box.y + box.h,
      width:  0, 
      height: sizeScale(names[3].count)
    });
  // console.log("CORNERS: " + JSON.stringify(result));
  return result;
}

function sample(ratio) {
  const result = [];
  for (let o of data.set) {
    const relN = o.count * ratio[o.gender];
    const baseN = Math.floor(relN);
    const margN = (relN - baseN) > Math.random()? 1 : 0;
    const n = baseN + margN;
    if (n > 0) result.push({name: o.name, gender: o.gender, count: n});
  }
  return result;
}

function randomly() {
  return Math.random() - 0.5;
}
