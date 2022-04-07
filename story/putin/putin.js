const dim = {left: 25, width: 425, top:20, h: 600, bottom: 40};

const preparation = {
  approval:{
    uri: "/story/putin/levada-putin-approval.csv",
    augment: o => ({date: new Date(o.date), approved: +o.approved})
  },
  events:{
    uri:  "/story/putin/events.csv",
    augment: o => ({date: new Date(o.date), label: o.label})
  },
  vdem: "/story/putin/vdem-russia-1990-2021.csv",
  vdemPoints: {
    waitFor: ["vdem"],
    construction() {
      return datapoints(data.vdem, "year", 
        ["v2x_jucon", "v2x_freexp_altinf", "v2x_polyarchy", "v2xlg_legcon"]
      );
    }
  }
};

function dataCompleted() {
  browserDefaults();
  drawRankingChart(document.getElementById("PopularityChart"));
}

function drawRankingChart(el) {
  const div = d3.select(el);
  const svg = div.append('svg')
    .attr("width", "100%").attr("height", "45rem")
    .attr("viewBox", `0 0 ${dim.width} ${dim.top + dim.h + dim.bottom}`);
  const chart = svg.append("g")
    .attr("class", "chart")
    .attr("transform", `translate(${dim.left} ${dim.top})`);
  const dateRange = [d3.min(data.approval, d => d.date), d3.max(data.approval, d => d.date)];
  const yScale = d3.scaleTime(dateRange, [0, dim.h]);
  const dh = dim.h / data.approval.length;
  const max = d3.max(data.approval.map(d => d.approved));
  const xScale = d3.scaleSequential([0, max], [0, dim.width]);
  const xAxis = d3.axisBottom(xScale);
  svg.append("g")
    .attr("transform", `translate(${dim.left} ${dim.top + dim.h + 10})`)
    .call(xAxis);
  const yAxis = d3.axisLeft(yScale);
  svg.append("g")
    .attr("transform", `translate(${dim.left} ${dim.top})`)
    .call(yAxis);
  const area = d3.area().x0(0).x1(d => xScale(d.approved)).y(d => yScale(d.date));
  const topLine = d3.line().x(d => xScale(d.approved)).y(d => yScale(d.date));
  const repeatLast = data.approval.at(-1);
  repeatLast.date = new Date(repeatLast.date.setMonth(repeatLast.date.getMonth()+1));
  const datapoints = data.approval.concat(repeatLast);
  chart.append("path").attr("class", "dataarea").attr("d", area(datapoints));
  chart.append("path").attr("class", "dataline").attr("d", topLine(datapoints));
  chart.append("line").attr("class", "ruler")
       .attr("x1", xScale(50)).attr("y1", yScale(dateRange[0]))
       .attr("x2", xScale(50)).attr("y2", yScale(dateRange[1]));
  const eventG = chart.selectAll("g.event").data(data.events).join("g")
    .attr("class", "event")
    .attr("transform", d => `translate(0 ${yScale(d.date)})`);
  eventG.append("text").attr("x", 10).text(d => d.label);
  eventG.append("line").text(d => d.label)
    .attr("x1", 0).attr("y1", 0).attr("x2", 7).attr("y2", 0);
  return svg.node();
}

function datapoints(arr, idKey, valueKeys) {
  return arr.flatMap(row => valueKeys.map(valueKey =>
    ({id: row[idKey], valueKey, value: row[valueKey]})
  ));
}