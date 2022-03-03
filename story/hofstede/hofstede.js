const preparation = {
  world: "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json",
  countryCentroids: "/story/euro-neighbours/country-centroids.json",
  alias: "/dataset/countries/alias.json",
  hof: "/story/hofstede/hofstede.csv",
  loose: "/story/hofstede/loose.csv",
  combined: {
    waitFor: ["hof", "loose"],
    construction: combineAllData
  },
};

const regions = ["Croatia", "Italy", "Slovenia"];
const circle = d3.geoCircle();
const graticule = d3.geoGraticule10();

const lambertAzimuthalEqualArea = 
  d3.geoAzimuthalEqualArea()
    .rotate([-16, -54])
    .translate([420, 338])
    .scale(1200)
    .precision(0.1);
const geoPath = d3.geoPath(lambertAzimuthalEqualArea);
const redScale = d3.scaleSequential().domain([0, 100]).interpolator(d3.interpolateReds);

function combineAllData() {
  const result = [];
  for (let country of regions) {
    let h = data.hof.find(row => row.country === country);
    let l = data.loose.find(row => row.country === country);
    result.push({
      country: country,
      pdi: h? +h.pdi : 0,
      idv: h? +h.idv : 0,
      loose: l? +l.CTL_C : 0
    });
  }
  return result;
}

function dataCompleted() {
  drawMap();
}

function drawMap() {
  const land = topojson.feature(data.world, data.world.objects.land);
  const countries = topojson.feature(data.world, data.world.objects.countries);
  const map = `<svg viewBox="0 0 700 700" style="display: block; background: lightskyblue">
    <path d="${geoPath(graticule)}" stroke="white" fill="none"></path>
    <path d="${geoPath(land)}" fill="#bbb" stroke="#333"></path>
    <g id="Countries">${countryPaths(countries, "pdi")}</g>
  </svg>`;
  document.getElementById("MapPlaceholder").innerHTML = map;
}

function countryPaths(countries, prop) {
  const result = [];
  for (let row of data.combined) {
    const c = row.country;
    const cc = data.alias[c];
    const center = data.countryCentroids[cc];
    if (!center) {
      continue;
    }
    const [cx, cy] = lambertAzimuthalEqualArea(center);
    const geoc = countries.features.find(f => f.properties.name === c);
    const value = row[prop];
    if (geoc && value) {
      result.push(`
        <g class="countryOnMap">
          <title>${c} ${value}</title>
          <path d="${geoPath(geoc)}"
                fill="${redScale(value)}"
                stroke="black" />`
      );
      result.push(`
        <g class="marker">
          <text class="offsetLabel" x="${cx}" y="${cy}"
                style="fill: ${value < 40? 'black':'white'}">
            ${value}
          </text>
        </g>`
      );
      result.push(`</g>`);
    }
    else {
      console.log(c);
    }
  }
  return result.join(" ");
}
