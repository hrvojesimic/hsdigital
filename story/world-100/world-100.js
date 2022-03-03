const PROJECTION = "Mollweide";

const preparation = {
  world: "https://cdn.jsdelivr.net/npm/world-atlas@2/land-110m.json",
  land: {
    waitFor: ["world"], construction: () => topojson.feature(data.world, data.world.objects.land)
  },
  pins: "/story/world-100/pins.csv"
};

function dataCompleted() {
  for (let i in data.pins)
    data.pins[i].index = (+i)+1;
  data.pins.sort((a,b) => (+b[1])-(+a[1]));
  drawMap();
}

function drawMap() {
  data.projection = d3.geoMollweide()
    .translate([370, 250])
    .scale(200);
  const path = d3.geoPath(data.projection);
  const bg = d3.select("#Atlas g.background");
  bg.append("path")
     .attr("d", path(data.land))
     .attr("fill", "#bbb")
     .attr("stroke", "#333");
  bg.on("click", (event) => {
    const p = d3.pointer(event);
    const coord = data.projection.invert(p);
    data.pins.push(coord);
    console.log(coord);
    updatePins();
  });
  updatePins();
}

function updatePins() {
  const pin = d3.select("#Atlas g.peeps").selectAll(".pin")
    .data(data.pins)
    .join("g")
      .attr("class", "pin");
  pin.append("use")
      .attr("href", p => "#" + mark(p.a20))
      .attr("x", p => data.projection(p)[0].toFixed(2))
      .attr("y", p => data.projection(p)[1].toFixed(2))
      .attr("lat", p => (+p[0]).toFixed(1))
      .attr("lon", p => (+p[1]).toFixed(1))
      .attr("index", p => p.index);
  pin.append("title").text(p => p.loc? p.loc : p.index);
}

function mark(code) {
  if (code === 'J') return "junior";
  if (code === 'S') return "senior";
  return "peep";
}