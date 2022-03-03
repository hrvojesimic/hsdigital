const width = 954;
const height = 477;

const circle = d3.geoCircle();
graticule = d3.geoGraticule10();
const lambertAzimuthalEqualArea = 
  d3.geoAzimuthalEqualArea()
    .rotate([-20.0, -52.5])
    .translate([width / 2, height / 2])
    .scale(1100)
    .precision(0.1);
const path = d3.geoPath(lambertAzimuthalEqualArea);

var preparation = {
  world: "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json",
  populations: "/story/euro-neighbours/euro-populations.json",
  countryCentroids: "/story/euro-neighbours/country-centroids.json",
  neighbours: "/story/euro-neighbours/neighbours.json",
  aliases: "/story/euro-neighbours/country-codes-alpha3.json",
  hues: "/story/euro-neighbours/country-hues.json",
};

function dataCompleted() {
  createMap();
}

function createMap() {
  const land = topojson.feature(data.world, data.world.objects.land);
  const countries = topojson.feature(data.world, data.world.objects.countries);
  const map = `<svg viewBox="0 0 800 550" style="display: block; background: lightblue">
    <path d="${path(graticule)}" stroke="white" fill="none"></path>
    <path d="${path(land)}" fill="gray" stroke="gray"></path>
    <g id="Countries">${countryPaths(countries)}</g>
    <path id="Edges" d="${path({type: "FeatureCollection", features: neighbourLines()})}"></path>
    <g id="Nodes">
      ${countryNodes()}
    </g>
  </svg>`;
  document.getElementById("MapPlaceholder").innerHTML = map;
}

function countryNodes() {
  let result = [];
  for (let cc in data.populations) {
    const r = Math.sqrt(data.populations[cc])/5 || 0.2;
    const coord = data.countryCentroids[cc];
    if (coord) {
      light = (coord[1] - coord[0])*1.75;
      result.push(
        `<path class="countryNode" id="${cc}-node" d="${path(circle.center(coord).radius(r)())}" stroke="black" fill="hsl(0, 0%, ${light}%)"></path>`
      );
    }
  }
  return result.join("\n");
}

function countryPaths(countries) {
  const result = [];
  for (let c of Object.keys(data.countryCentroids)) {
    let geoc = countries.features.find(f => data.aliases[f.properties.name] === c);
    if (geoc) {
      let shade = `hsl(${data.hues[c]}, 70%, 80%)`;
      result.push(`
        <g>
          <title>${geoc.properties.name}</title>
          <path d="${path(geoc)}" fill="${shade}" stroke="black"></path>
        </g>`
      );
    }
    else {
      console.log(c);
    }
  }
  return result.join(" ");
}

function neighbourLines() {
  let result = [];
  for (let c in data.countryCentroids) {
    let nears = data.neighbours[c] || [];
    if (typeof nears === 'object')
      for (let nc of nears) {
        result.push({
          "type": "Feature",
          "geometry": {
            "type": "LineString",
            "coordinates": [
              data.countryCentroids[c],
              data.countryCentroids[nc] || [0,0]
            ]
          }
        });
      }
  }
  return result;
}