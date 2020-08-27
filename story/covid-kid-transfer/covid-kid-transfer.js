const START_DATE = moment("2020-04-05");
const ColorScale = d3.scaleLinear()
  .domain([1, 60])
  .range(["lightgreen", "darkgreen"]);

const width = 800;
const height = 677;
const circle = d3.geoCircle();
graticule = d3.geoGraticule10();
const lambertAzimuthalEqualArea = 
  d3.geoAzimuthalEqualArea()
    .rotate([-17, -52.8])
    .translate([width / 2, height / 2])
    .scale(1100)
    .precision(0.1);
const path = d3.geoPath(lambertAzimuthalEqualArea);

var preparation = {
  world: "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json",
  countryCentroids: "/story/euro-neighbours/country-centroids.json",
  reopens: "/story/covid-kid-transfer/covid-reopen-schools.json",
  populations: "/story/euro-neighbours/euro-populations.json",
  aliases: "/story/euro-neighbours/country-codes-alpha3.json",
  hues: "/story/euro-neighbours/country-hues.json",
};

function dataCompleted() {
  document.querySelectorAll("ul").forEach(o => o.classList.add("browser-default"));
  createMap();
  addMapSources();
}

function addMapSources() {
  const sourcesEl = document.getElementById("SourcesForMap");
  const sourceDescs = [];
  for (let cc in data.reopens) {
    const url = data.reopens[cc].src;
    if (url) sourceDescs.push(`<a href="${url}">${cc}</a>`);
  }
  sourcesEl.innerHTML = sourceDescs.join(" ");
}

function createMap() {
  const land = topojson.feature(data.world, data.world.objects.land);
  const countries = topojson.feature(data.world, data.world.objects.countries);
  const map = `<svg viewBox="0 0 ${width} ${height}" style="display: block; background: lightblue">
    <path d="${path(graticule)}" stroke="white" fill="none"></path>
    <path d="${path(land)}" fill="gray" stroke="gray"></path>
    <g id="Countries">${countryPaths(countries)}</g>
    <g id="Nodes">
      ${countryNodes()}
    </g>
  </svg>`;
  document.getElementById("ReopeningMap").innerHTML = map;
}

function countryPaths(countries) {
  const result = [];
  for (let c of Object.keys(data.countryCentroids)) {
    let geoc = countries.features.find(f => data.aliases[f.properties.name] === c);
    if (geoc) {
      const reopen = data.reopens[c];
      let color = "gray";
      if (reopen) {
        color = "lightgray";
        if (!reopen.closed) color = "lightgreen";
        if (reopen.reopening) {
          const daysDiff = moment(reopen.reopening).diff(START_DATE, 'days');
          color = ColorScale(daysDiff);
          //console.log(daysDiff, color);
        }
        // if (reopen.reopening > '2020-04') color = "green";
        // if (reopen.reopening > '2020-05') color = "darkgreen";
        // if (reopen.reopening > '2020-06') color = "purple";
        if (reopen.reopening > '2020-09') color = "red";
      }
      
      result.push(`
        <g>
          <title>${geoc.properties.name}</title>
          <path d="${path(geoc)}" fill="${color}" stroke="black"></path>
        </g>`
      );
    }
    else {
      console.log(c);
    }
  }
  return result.join(" ");
}

function countryNodes() {
  let result = [];
  for (let cc in data.reopens) {
    const r = Math.sqrt(data.populations[cc])/5 || 0.2;
    const coord = data.countryCentroids[cc];
    if (coord) {
      // result.push(
      //   `<path class="countryNode" id="${cc}-node" d="${path(circle.center(coord).radius(r)())}" stroke="black" fill="${color}"></path>`
      // );
      const [cx, cy] = lambertAzimuthalEqualArea(coord);
      const reopen = data.reopens[cc];
      if (reopen && cc != "HRV") {
        let str = "?";
        if (reopen.reopening) str = moment(reopen.reopening).format("D.M.");
        if (!reopen.closed) str = "✓";
        if (str.length > 1)
          result.push(
            `<rect id="${cc}-shadebox" x="${cx-23}" y="${cy-11}" 
                   width="45" height="20" fill="white" opacity="0.5" />`
          );
        result.push(
          `<text class="countryDate" id="${cc}-datetxt" x="${cx}" y="${cy}">${str}</text>`
        );
      }
    }
  }
  return result.join("\n");
}
