const CASES = "inf";
const DEATHS = "ded";

const GeoRegions = ({
  "EastAsia": ["Malaysia", "Indonesia", "Thailand", "Taiwan", "Japan", "China", "Singapore", "South Korea"],
  "CentralEurope": ["Germany", "Austria", "Slovenia", "Switzerland", "Czech Republic", "Slovakia", "Poland", "Hungary"],
  "SoutheastEurope": ["Serbia", "Croatia", "Albania", "Bosnia and Herzegovina", "Greece", "Romania", "Bulgaria", "Macedonia", "Turkey"],
  "WestEurope": ["Belgium", "Netherlands", "France", "United Kingdom", "Ireland"],
  "SouthwestEurope": ["Italy", "Spain", "Portugal"],
  "NorthEurope": ["Finland", "Norway", "Sweden", "Denmark", "Lithuania", "Latvia", "Estonia"],
  "EastEurope": ["Russia", "Ukraine", "Belarus"],
  "MidAsia": ["Iran", "Israel", "India", "Bangladesh", "Pakistan", "Iraq"],
  "Africa": ["South Africa", "Nigeria"],
  "Oceania": ["Australia", "New Zealand"],
  "NorthAmerica": ["United States", "Canada", "Mexico"],
  "SouthAmerica": ["Brazil"]
});

const DisplayName = {
  "Malaysia": "Malaysia",
  "Indonesia": "Indonesia",
  "Thailand": "Thailand",
  "Taiwan": "Taiwan",
  "Japan": "Japan",
  "China": "China",
  "Singapore": "Singapore",
  "Germany": "Germany",
  "Austria": "Austria",
  "Slovenia": "Slovenia",
  "Switzerland": "Switzerla.",
  "Czech Republic": "Czechia",
  "Slovakia": "Slovakia",
  "Poland": "Poland",
  "Hungary": "Hungary",
  "Serbia": "Serbia",
  "Croatia": "Croatia",
  "Albania": "Albania",
  "Bosnia and Herzegovina": "Bosnia-H.",
  "Greece": "Greece",
  "Romania": "Romania",
  "Bulgaria": "Bulgaria",
  "Macedonia": "N. Maced.",
  "Turkey": "Turkey",
  "Belgium": "Belgium",
  "Netherlands": "Netherlan.",
  "France": "France",
  "United Kingdom": "UK",
  "Ireland": "Ireland",
  "Italy": "Italy",
  "Spain": "Spain",
  "Portugal": "Portugal",
  "Finland": "Finland",
  "Norway": "Norway",
  "Sweden": "Sweden",
  "Denmark": "Denmark",
  "Lithuania": "Lithuania",
  "Latvia": "Latvia",
  "Estonia": "Estonia",
  "Russia": "Russia",
  "Ukraine": "Ukraine",
  "Belarus": "Belarus",
  "Iran": "Iran",
  "Israel": "Israel",
  "India": "India",
  "Bangladesh": "Banglad.",
  "Pakistan": "Pakistan",
  "Iraq": "Iraq",
  "South Africa": "S. Africa",
  "Nigeria": "Nigeria",
  "Australia": "Australia",
  "New Zealand": "N.Zealand",
  "United States": "USA",
  "Canada": "Canada",
  "Mexico": "Mexico",
  "Brazil": "Brazil"
};
const MetricTitle = {
  "inf": "new cases",
  "ded": "new deaths"
};
const ChartDivId = {
  "inf": "CasesGoHere",
  "ded": "DeathsGoHere"
};

const AllCountries = Object.keys(DisplayName);

const latestCases = {}, latestDeaths = {};

const dataUris = {
  owidNC: "https://covid.ourworldindata.org/data/ecdc/new_cases.csv",
  owidND: "https://covid.ourworldindata.org/data/ecdc/new_deaths.csv"
};
const data = {};

function executeLocalScript() {
  for (let key in dataUris)
    loadFromUri(dataUris[key]).then(o => store(key, o));
}

function store(key, o) {
  data[key] = o;
  if (Object.keys(data).length === Object.keys(dataUris).length) {
    prepareData();
    createCharts(CASES);
    createCharts(DEATHS);
  }
}

function prepareData() {
  data[CASES]  = prepareCases(data.owidNC, CASES);
  data[DEATHS] = prepareCases(data.owidND, DEATHS);
  calculateAllLatestCases();
}

function prepareCases(inputs, metric) {
  const result = [];
  for (let row of inputs) {
    const date = row.date;
    for (let c of AllCountries) {
      result.push({date: date, country: c, metric: metric, value: +row[c]});
    }
  }
  return result;
}

function specsFor(country, metric) {
  const ctxt = DisplayName[country];
  return {
    "width": 250,
    "height": 75,
    "data": { 
      values: data[metric].filter( o => o.country === country ) 
    },
    "transform": [
      {"filter": "year(datum.date) > 2019"},
      {"filter": "month(datum.date) > 1"},
      {"calculate": "(datum.value > 0)? floor(log(datum.value)/log(10)*2) : 0", "as": "magnitude"}
    ],
    layer: [
      {
        "mark": {
          "type": "text",
          "text": MetricTitle[metric],
          "x": 4,
          "y": 40,
          "fontSize": 20,
          "align": "left",
          "baseline": "top",
          "color": "#bbb"
        }
      },
      {
        mark: {
          type: "text",
          text: ctxt,
          x: 2, y: 1, fontSize: 50, align: "left", baseline: "top", color: "#aaa"
        }
      },
      {
        mark: {
          type: "text",
          text: ctxt,
          x: 0, y: 0, fontSize: 50, align: "left", baseline: "top", color: "#ddd"
        }
      },
      {
        "mark": {type: "bar", opacity: 1},
        "encoding": {
          "x": {
            "field": "date",
            title: null,
            "type": "temporal"
          },
          "y": {
            "field": "value",
            title: null,
            "type": "quantitative"
          },
          "color": {
            "field": "magnitude",
            "type": "quantitative",
            scale: {
              domain: [0, 1, 2, 3, 4, 5, 6, 7, 8].map(i => metric === DEATHS? i-4 : i),
              range: ["#ffe700", "#ffd300", "#ffc100", "#ff9a00", "#ff7400", "#ff4d00", "#ff0000", "#cc0000", "#990000", "#660000", "#440000"]
            },
            legend: null
          },
          "tooltip": [
            {"field": "country", "type": "nominal"},
            {"field": "date", "type": "temporal"},
            {
              "field": "value", 
              title: MetricTitle[metric], 
              "type": "quantitative"
            }
          ]
        }
      }
    ],
    "resolve": {"scale": {"y": "independent"}},
    config: {
      //bar: {continuousBandSize: 6},
      axisY: {minExtent: 80, maxExtent: 80}
    }
  };
}

function compareByCases(a, b) { return latestCases[b] - latestCases[a]; }
function compareByDeaths(a, b) { return latestDeaths[b] - latestDeaths[a]; }

function createCharts(metric) {
  AllCountries.sort(metric === DEATHS? compareByDeaths : compareByCases);
  const chartsDiv = document.getElementById(ChartDivId[metric]);
  chartsDiv.innerHTML = "";
  for (let country of AllCountries) {
    const singleDiv = document.createElement("div");
    const vegaSpec = specsFor(country, metric);
    vegaEmbed(singleDiv, vegaSpec)
      .catch(console.warn);
    chartsDiv.appendChild(singleDiv);
  }
  chartsDiv.scrollIntoView();
}

function calculateAllLatestCases() {
  for (let country of AllCountries) {
    latestCases[country]  = sumLast(data[CASES], country);
    latestDeaths[country] = sumLast(data[DEATHS], country);
  }
}

function sumLast(dataset, c) {
  const cutoff = moment().add(-8, 'days').format("YYYY-MM-DD");
  const cdata = dataset.filter(o => c === o.country && o.date >= cutoff);
  if (cdata.length === 0) {
    console.log("Missing " + c);
    return 0;
  }
  return cdata.map(o => o.value).reduce((a,b) => a + b, 0);
}

function loadFromUri(uri) {
  if (uri.endsWith(".json"))
    return d3.json(uri);
  else if (uri.endsWith(".csv"))
    return d3.csv(uri);
  else if (uri.endsWith("/csv"))
    return d3.csv(uri, {mode: "no-cors"});
}