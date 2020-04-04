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

var dataUris = {
  world: "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json",
  populations: "/story/euro-neighbours/euro-populations.json",
  countryCentroids: "/story/euro-neighbours/country-centroids.json",
  neighbours: "/story/euro-neighbours/neighbours.json",
  aliases: "/story/euro-neighbours/country-codes-alpha3.json",
  hues: "/story/euro-neighbours/country-hues.json",
  race: "/story/covid-race/covid-race-03-15.csv",
};
var data = {};

function loadFromUri(uri) {
  if (uri.endsWith(".json"))
    return d3.json(uri);
  else if (uri.endsWith(".csv"))
    return d3.csv(uri);
}

function executeLocalScript() {
  for (let key in dataUris)
    loadFromUri(dataUris[key]).then(o => store(key, o));
}

function store(key, o) {
  data[key] = o;
  if (Object.keys(data).length === Object.keys(dataUris).length)
    createMap();
}

function createMap() {
  const land = topojson.feature(data.world, data.world.objects.land);
  const countries = topojson.feature(data.world, data.world.objects.countries);
  const map = `<svg viewBox="0 0 800 550" style="display: block; background: lightblue">
    <path d="${path(graticule)}" stroke="white" fill="none"></path>
    <path d="${path(land)}" fill="gray" stroke="gray"></path>
    <g id="Countries">${countryPaths(countries)}</g>
  </svg>`;
  document.getElementById("MapPlaceholder").innerHTML = map;
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
