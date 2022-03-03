const preparation = {
  alias:   "/dataset/countries/alias.json",
  regions: "/dataset/countries/regions.json",
  popreg:  "/story/world-pop/pop-regions.json",
  world:   "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json",
  pop:     "/story/world-pop/un-pop-proj.csv"
};

function dataCompleted() {
  data.pop.map(row => {
    for (let i = 0; i < 101; i += 5) row[i] = +row[i];
    return row;
  });
  data.projection = d3.geoMollweide().translate([370, 250]).scale(200);
  data.land = topojson.feature(data.world, data.world.objects.land);
  data.countries = topojson.feature(data.world, data.world.objects.countries);
  drawMap();
}

function drawMap() {
  const path = d3.geoPath(data.projection);
  drawLand(d3.select("#Atlas g.background"), path);
  drawCountries(d3.select("#Atlas g.countries"), path);
  drawCircles(d3.select("#Atlas g.circles"));
}

function drawLand(bg, path) {
  bg.append("path")
    .attr("d", path(data.land))
    .attr("fill", "#bbb")
    .attr("stroke", "#333");
}

function drawCountries(countryG, path) {
  for (let geoc of data.countries.features) {
    const cname = geoc.properties.name;
    const ccode = data.alias[cname];
    if (ccode === undefined) continue;
    const pr = findPopRegion(ccode);
    if (pr === undefined) continue;
    const g = countryG.append("g");
    g.append("title").text(cname);
    g.append("path")
     .attr("d", path(geoc))
     .attr("fill", pr.color);
  }
}

function drawCircles(g) {
  for (let prc in data.popreg) {
    const popRegion = data.popreg[prc];
    g.append("g").attr("id", "swarm_" + prc);
    updateSwarm(prc, 7.5);
  }
}

function updateSwarm(prc, r) {
  const popRegion = data.popreg[prc];
  const nodes = createDifNodes("2100", prc
    //arena: prc, year: "2100", minAge: 0, maxAge: 100
  );
  const center = data.projection(popRegion.centroid).map(n => +n.toFixed(0));
  const gjoin = d3.select("#swarm_" + prc)
    .selectAll("circle")
    .data(nodes)
    .join("circle").attrs({
      class: d => "ag" + d.ag,
      r:     d => radiusFn(d.ag, r)
    });
  const sim = d3.forceSimulation(nodes)
    .force("x", d3.forceX(center[0]).strength(0.1))
    .force("y", d3.forceY(center[1]).strength(0.1))
    .force('charge', d3.forceManyBody().strength(0.1))
    .force('collision', d3.forceCollide().radius(d => radiusFn(d.ag, r)))
    .on("tick." + prc, tick);
  
  function tick() {
    gjoin.attrs({ cx: d => d.x, cy: d => d.y });
  }
}

function radiusFn(ag, r) {
  switch (+ag) {
    case 0: return 0.75 * r;
    case 1: return r;
    case 2: return r;
    case 3: return 0.85 * r;
    default: console.log(ag);
  }
  return 10;
}

function createDifNodes(year, arena, filter = (e) => true) {
  const result = [];
  const dp = data.pop.find(e => e.year === year && e.arena === arena);
  if (dp === undefined) return result;
  const r = represent([
    sum(dp, 0, 20), sum(dp, 25, 45), sum(dp, 50, 70), sum(dp, 75, 100)
    // sum(dp, 0, 15), sum(dp, 20, 55), sum(dp, 60, 100)
  ], 50000);
  for (let n in r)
    for (let i = 1; i <= r[n]; i++)
      result.push({ag: n});
  return result;
}

function findPopRegion(ccode) {
  for (let prc in data.popreg) {
    const preg = data.popreg[prc];
    const regions = data.regions[preg.r];
    if (!regions) {
      console.log(prc, preg);
      return undefined;
    }
    if (regions.includes(ccode))
      return preg;
  }
  return undefined;
}

function represent(a, quant) {
  const result = new Array(a.length);
  result.fill(0);
  const sum = a.reduce((a, b) => a + b);
  const n = Math.round(sum / quant);
  for (let i = 0; i < n; i++) {
    const index = d3.maxIndex(a);
    a[index] -= quant;
    result[index]++;
  }
  return result;
}

function diff(a1, a2) {
  const result = [];
  for (let i = 0; i < a1.length; i++) {
    result.push(a2[i] - a1[i]);
  }
  return result;
}

function sum(a, low, high) {
  let sum = 0;
  for (let i = low; i <= high; i += 5)
    sum += a[i];
  return sum;
}