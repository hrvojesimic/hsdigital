const Today = moment().startOf('day');
const StartDate = moment(Today).subtract(90, 'days');
let lastDate = StartDate.format("YYYY-MM-DD");

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
//  "Indonesia": "Indonesia",
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
//  "Netherlands": "Netherlan.",
  "France": "France",
//  "United Kingdom": "UK",
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
//  "Ukraine": "Ukraine",
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
//  "Brazil": "Brazil"
};

const AllCountries = Object.keys(DisplayName);

const latestCases = {}, latestDeaths = {};

const dataUris = {
  recovered: "https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_time_series/time_series_covid19_recovered_global.csv",
  dead: "https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_time_series/time_series_covid19_deaths_global.csv",
  confirmed: "https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_time_series/time_series_covid19_confirmed_global.csv"
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
    createCharts();
  }
}

function prepareData() {
  data.all = {};
  const allDeaths = data.dead.flatMap( a => expand(a, "fc", "fa") );
  const allCases = data.confirmed.flatMap( a => expand(a, "cc", "ca") );
  const allRecoveries = data.recovered.flatMap( a => expand(a, "rc", "ra") );
  for (let country of AllCountries) {
    data.all[country] = [];
    for (let date = moment(StartDate); date.isBefore(Today); date.add(1, 'day')) {
      const dateString = date.format("YYYY-MM-DD");
      if (dateString > lastDate) lastDate = dateString;
      const deaths = allDeaths.find( o => o.country === country && o.sub === "" && o.date == dateString );
      const cases = allCases.find( o => o.country === country && o.sub === "" && o.date == dateString );
      const recoveries = allRecoveries.find( o => o.country === country && o.sub === "" && o.date == dateString );
      if (deaths && cases && recoveries) {
        const low = deaths.fc / cases.cc;
        const hi = deaths.fc / (deaths.fc + recoveries.rc);
        data.all[country].push({
          country: country,
          date: dateString,
          metric: "low",
          value: low,
          deaths: deaths.fc,
          recoveries: recoveries.rc
        });
        data.all[country].push({
          country: country,
          date: dateString,
          metric: "hi",
          value: hi,
          deaths: deaths.fc,
          recoveries: recoveries.rc
        });
      }      
    }
  }
}

function expand(e, cumulativeKey, additiveKey) {
  var s = e["Province/State"];
  var c = e["Country/Region"];
  var result = [];
  var lastValue = 0;
  var faMap = {};
  for (var property in e) {
    if (property.match(/\d+\/\d+\/20/)) {
      var value = +e[property];
      var date = moment(property, "M/D/YY");
      var dateStr = date.format("YYYY-MM-DD");
      var doy = date.dayOfYear();
      var delta = value - lastValue;
      var row = {sub: s, country: c, date: dateStr, doy: doy, doe: doy-0};
      row[cumulativeKey] = value;
      row[additiveKey] = delta;
      faMap[doy] = delta;
      lastValue = value;
      if (value > 0) result.push(row);
    }
  }
  for (var entry of result) {
    const doy = entry.doy;
    const low = (faMap[doy-1]||0) + (faMap[doy-2]||0);
    const dp1 = (faMap[doy+1] === undefined)? faMap[doy] : faMap[doy+1];
    const dp2 = (faMap[doy+2] === undefined)? dp1 : faMap[doy+2];
    const sum = faMap[doy] + low + dp1 + dp2;
    entry[additiveKey + "5da"] = sum/5;
  }
  return result;
}

function specsFor(country, dataset) {
  const ctxt = DisplayName[country];
  return {
    "width": 350,
    "height": 150,
    "data": { 
      values: dataset 
    },
    layer: [
      {
        data: {values: 
          dataset.filter(o => o.date === lastDate).map( o => {
              o.pct = (Math.round(o.value * 1000) / 10) + "%";
              return o;
            }
          )
        },
        mark: "text",
        encoding: {
          x: {value: 367},
          y: {
            field: "value",
            type: "quantitative"
          },
          text: {
            field: "pct",
            type: "nominal"
          }
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
        mark: "line",
        encoding: {
          x: {
            field: "date",
            type: "temporal"
          },
          y: {
            field: "value",
            type: "quantitative"
          },
          color: {
            field: "metric",
            type: "nominal",
            legend: null,
            scale: {
              domain: ["hi", "low"],
              range: ["red", "green"]
            }
          }
        }
      }
    ]
  };
}

function createCharts() {
  const chartsDiv = document.getElementById("Charts");
  chartsDiv.innerHTML = "";
  for (let country of AllCountries) {
    const singleDiv = document.createElement("div");
    const dataset = data.all[country].filter(o => o.recoveries > 49);
    if (dataset.length > 9) {
      const vegaSpec = specsFor(country, dataset);
      vegaEmbed(singleDiv, vegaSpec)
        .catch(console.warn);
      chartsDiv.appendChild(singleDiv);
    }
  }
}

function loadFromUri(uri) {
  if (uri.endsWith(".json"))
    return d3.json(uri);
  else if (uri.endsWith(".csv"))
    return d3.csv(uri);
  else if (uri.endsWith("/csv"))
    return d3.csv(uri, {mode: "no-cors"});
}