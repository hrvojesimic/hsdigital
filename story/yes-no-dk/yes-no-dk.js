const formula = {
  pst:  (c,i,d) => [i,c,d],
  dot:  (c,i,d) => (c == 5 && i == 3)? 1 : undefined,
  knew: (c,i,d) => (c + i)/(c + d + i),
  sc:   (c,i,d) => c/(c + i + d),
  sr:   (c,i,d) => (c + i == 0)? 0.5 : c/(c + i),
  sm:   (c,i,d) => (c + d/2)/(c + d + i)
};

function generator(key) {
  if (key.startsWith("Q")) 
    return data.answers.filter(o => o.qcode === key)
               .map(o => {o.score = [o.trues,o.falses,o.totals-o.trues-o.falses]; return o;});
  if (formula[key]) return dummyData(formula[key]);
}

const colScales = {
  rgb(x) {
    const t = d3.sum(x);
    return `rgb(${x[0]/t*255}, ${x[1]/t*255}, ${x[2]/t*255})`;
  },
  blues: d3.scaleSequential(d3.interpolateBlues),
  redgreen: d3.scaleSequential(d3.interpolateRdYlGn)
};
var preparation = {
  population: "/dataset/countries/pop2020.json",
  regions:    "/dataset/countries/regions.json",
  countryName:"/dataset/countries/label.hr.json",
  questions:  "/dataset/eurobarometer/516/questions.csv",
  labels:     "/story/yes-no-dk/labels.json",
  answerRaw:  "/dataset/eurobarometer/516/answers.csv",
  answers: {
    waitFor: ["questions", "answerRaw"],
    construction() {
      return data.answerRaw.map((row) => {
        const q = data.questions.find(o => o.code === row.qcode);
        const tc = q.correct === 'Y';
        row.trues  = +row.trues;
        row.falses = +row.falses;
        row.totals = +row.totals;
        row.c = tc? row.trues : row.falses;
        row.i = tc? row.falses : row.trues;
        row.d = row.totals - row.falses - row.trues;
        row.score  = +row.score;
        row.truePct= row.trues / row.totals * 100;
        row.hitPct = row.trues / (row.trues + row.falses) * 100;
        row.splitPct= (row.totals + row.trues - row.falses) / row.totals * 50;
        return row;
      });
    }
  }
};

function dataCompleted() {
  for (const el of document.getElementsByClassName("tchart")) {
    const pKey = el.dataset.palette;
    const fKey = el.dataset.formula;
    const genKey = el.dataset.gen || "dummy";
    drawTriangle(el, colScales[pKey], generator(fKey));
  }
}

function prepareLocal() {
  browserDefaults();
}

function dummyData(formula) {
  const result = [];
  const totals = 10;
  for (let c = 0; c <= totals; c++) {
    for (let i = 0; i <= totals - c; i++) {
      result.push({
        c,
        i,
        totals,
        score: formula(c, i, totals - c - i),
        ccode: "AUT"
      });
    }
  }
  return result;
}

function drawAnswerTriangle(el, qCode) {
  const dataset = data.answers.filter(d => d.qcode === qCode);// d.ccode.startsWith("F"));
  drawTriangle("Triangle", dataset);
}

function drawTriangle(el, colorScale, dataset) {
  const dims = {
    width:  150, 
    height: 150, 
    left:    30, 
    right:   20, 
    top:     20, 
    bottom:  30,
    radius:  5
  };
  const chartSvg = d3.select(el)
    .append("svg")
      .attr("width", "100%").attr("height", "300px")
      .attr("viewBox", `0 0 ${dims.left + dims.width + dims.right} ${dims.top + dims.height + dims.bottom}`)
      .attr("xmlns", "http://www.w3.org/2000/svg")
      .attr("xmlns:xlink", "http://www.w3.org/1999/xlink");
  const side = dims.width;
  const xScale = d3.scaleLinear([0,1], [0, side]);
  const yScale = d3.scaleLinear([0,1], [side, 0]);
  //const rScale = d3.scaleSqrt().domain([0, d3.max(Object.values(data.population))]).range([0, 75]);

  const plotG = chartSvg.append("g")
    .attr("class", "triangle")
    .attr("transform", `translate(${dims.left} ${dims.top})`);

  const axisG = plotG.append("g").attr("class", "axis");
  axisG.append("g").attr("transform", `translate(0 ${side})`)
    .call(d3.axisBottom().ticks(3).scale(xScale));
  axisG.append("text").attr("transform", `translate(${side/2} ${side + dims.bottom})`)
    .attr("class", "label")
    .text("share of correct answers");

  axisG.append("g").call(d3.axisLeft().ticks(3).scale(yScale));
  axisG.append("line").attr("x1", 0).attr("x2", side).attr("y1", 0).attr("y2", side)
    .attr("stroke","gray");
  axisG.append("text").attr("transform", `translate(${-dims.left} ${side/2}) rotate(-90)`)
    .attr("class", "label")
    .text("share of incorrect answers");

  plotG.selectAll("circle")
    .data(dataset)
    .join("circle")
      .attr("cx", d => xScale(d.c/d.totals))
      .attr("cy", d => yScale(d.i/d.totals))
      .attr("r", dims.radius) //d => rScale(data.population[d.ccode]))
      .attr("fill", d => d.score === undefined? "none" : colorScale(d.score))
      //.attr("stroke", "none").attr("fill-opacity", .5)
      .append("title").text(d => d.ccode + " " + d.score);
}
