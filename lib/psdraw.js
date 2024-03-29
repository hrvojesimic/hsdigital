
function drawCountryBubbles(containerEl, inNodes, optIn) {
  const opt = Object.assign({
    width: 900, height: 400, 
    marginTop: 10, marginBottom: 30, marginLeft: 20, marginRight: 10,
    unit: "", decimals: 0,
    forcex: 10, forcey: 1, rmax: 50, rmin: 0, rdepth: 1
  }, optIn);
  const chartWidth  = opt.width - opt.marginLeft - opt.marginRight;
  const chartHeight = opt.height - opt.marginTop - opt.marginBottom;
  const MAXPOP = d3.max(Object.values(inNodes).map(d => d.pop));
  const rScale = d3.scaleSqrt().domain([0, MAXPOP]).range([0, opt.rmax]);
  const nodes = inNodes.filter(d => rScale(d.pop) >= opt.rmin);
  const xScaleType = opt.scalex === "log"? d3.scaleLog : d3.scaleLinear;
  
  const xScale = xScaleType(
    [
      opt.minx? opt.minx : d3.min(nodes.map(d => d.valx)),
      opt.maxx? opt.maxx : d3.max(nodes.map(d => d.valx))
    ], 
    [opt.rmax/2, chartWidth - opt.rmax/2]
  );
  const yScale = d3.scaleLinear(
    [d3.min(nodes.map(d => d.valy)), d3.max(nodes.map(d => d.valy))], 
    [chartHeight - opt.rmax, opt.rmax]
  );

  const svg = d3.select(containerEl).append("svg")
    .attr("width", "100%").attr("height", opt.height)
    .attr("viewBox", `0 0 ${opt.width} ${opt.height}`);
  const topG = svg.append("g")
    .attr("class", "bubbleChart")
    .attr("transform", `translate(${opt.marginLeft} ${opt.marginTop})`);
  const xAxisG = topG.append("g")
    .attr("class", "axis dimx")
    .attr("transform", `translate(0 ${opt.height - opt.marginBottom})`)
    .call(
      d3.axisBottom().scale(xScale)
        .tickFormat(x => d3.formatPrefix("~s", x)(x))
    );
  xAxisG.append("text").attr("class", "label")
    .attr("x", chartWidth/2).attr("y", 25).text(opt.xaxis);
  const gJoin = topG.selectAll("g.country")
    .data(nodes)
    .join("g")
      .attr("class", d => ["country", d.ccode, ...d.tags].filter(s => s.length > 0).join(" "))
      .attr("transform", d => `translate(${xScale(d.value)} ${opt.height / 2})`);
  gJoin.append("title").text(d =>
    `${d.title? d.title : d.label}: ${d.valx.toFixed(opt.decimals)} ${opt.unit}`
  );
  gJoin.append("circle").attr("class", "rounder")
      .attr("cx", 0).attr("cy", 0).attr("r", d => rScale(d.pop));
  gJoin.append("image").attr("class", "flag")
      .attr("href", d => `/flags/${d.ccode}.png`)
      .attr("x", d => -rScale(d.pop))
      .attr("y", d => -rScale(d.pop))
      .attr("width", d => 2*rScale(d.pop))
      .attr("height", d => 2*rScale(d.pop));
  gJoin.append("text").attr("class", "label")
      .text(d => rScale(d.pop) < 20? 
                   rScale(d.pop) < 7? "" : d.ccode 
                 : data.countryName[d.ccode]); 

  d3.forceSimulation(nodes)
    .force("x", d3.forceX(d => xScale(d.valx)).strength(+opt.forcex))
    .force("y", d3.forceY(d => yScale(d.valy)).strength(+opt.forcey))
    .force("collision", d3.forceCollide().radius(d => +opt.rdepth * rScale(d.pop)))
    .alpha(0.15)
    .on("tick", tick);
  
  function tick() {
    gJoin.attr("transform", d => `translate(${d.x} ${d.y})`);
  }
}
