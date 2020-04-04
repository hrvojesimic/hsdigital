
const dataUris = {
  pisa2018: "/story/covid-pisa/pisa2018.json",
  owidCases: "https://covid.ourworldindata.org/data/ecdc/total_cases.csv",
  owidDeaths: "https://covid.ourworldindata.org/data/ecdc/total_deaths.csv"
};
const data = {};

function executeLocalScript() {
  for (let key in dataUris)
    loadFromUri(dataUris[key]).then(o => store(key, o));
}

function store(key, o) {
  data[key] = o;
  if (Object.keys(data).length === Object.keys(dataUris).length) {
    initializeArticle();
  }
}

function initializeArticle() {
  
}
