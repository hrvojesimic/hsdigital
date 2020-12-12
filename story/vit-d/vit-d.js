const preparation = {};

function prepareLocal() {
  data.graph = {
    nodes: [
      {node: 0, color: "gray", name: "bolesni"},
      {node: 1, color: "orange", name: "+ Vitamin D"},
      {node: 2, color: "blue", name: ""},
      {node: 3, color: "red", name: "JIL"},
      {node: 4, color: "red", name: "JIL"},
      {node: 5, color: "green", name: "ozdravili"},
      {node: 6, color: "black", name: "umrli"}
    ],
    links: [
      {source: 0, target: 1, value: 50, color: "orange"},
      {source: 0, target: 2, value: 26, color: "blue"},
      {source: 1, target: 3, value:  1, color: "orange"},
      {source: 2, target: 4, value: 13, color: "blue"},
      {source: 1, target: 5, value: 49, color: "orange"},
      {source: 2, target: 5, value: 13, color: "blue"},
      {source: 3, target: 5, value:  1, color: "orange"},
      {source: 4, target: 5, value: 11, color: "blue"},
      {source: 4, target: 6, value:  2, color: "blue"}
    ]
  };
  drawSankey();
}

function drawSankey() {
  const margin = {top: 10, right: 10, bottom: 10, left: 10},
        width  = 400 - margin.left - margin.right,
        height = 350 - margin.top  - margin.bottom;
  
  const svg = d3.select("#Sankey").append("svg")
  .attr("viewBox", `0,0,${width + margin.left + margin.right},${height + margin.top + margin.bottom}`);
  const drawArea = svg.append("g")
    .attr("transform",
          "translate(" + margin.left + "," + margin.top + ")");
  const sankey = d3.sankey().nodeWidth(36).nodePadding(60).size([width, height]);
  const graph = sankey(data.graph);

  const link = drawArea.append("g").selectAll(".link")
    .data(graph.links)
    .enter().append("path")
      .attr("class", "link")
      .attr("d", d3.sankeyLinkHorizontal())
      .attr("stroke", d => d.color)
      .attr("stroke-width", d => d.width);

  link.append("title")
      .text(d => d.source.name + " → " + d.target.name + "\n" + d.value);

  const node = drawArea.append("g").selectAll(".node").data(graph.nodes)
    .join("g").attr("class", "node");

  node.append("rect")
      .attr("x", d => d.x0)
      .attr("y", d => d.y0)
      .attr("height", d => d.y1 - d.y0)
      .attr("width", sankey.nodeWidth())
      .style("fill", d => d.color)
    .append("title")
      .text(d => d.name + "\n" + d.value);

  node.append("text")
      .attr("x", function(d) { return d.x0 - 6; })
      .attr("y", function(d) { return (d.y1 + d.y0) / 2; })
      .attr("dy", "0.35em")
      .attr("text-anchor", "end")
      .text(d => d.name)
    .filter(function(d) { return d.x0 < width / 2; })
      .attr("x", function(d) { return d.x1 + 6; })
      .attr("text-anchor", "start");
}