const START_DATE = "2020-07-01";
//const Yesterday = moment().subtract(1, 'day').startOf('day');
const END_DATE = "2020-09-18";//Yesterday.format("YYYY-MM-DD");

const LongDimension = 600;
const AxisDim = 60;
const HeadRadius = 10;
const TailThickness = 4;
const MaxCount = 10000000;

let advanceStep = 250;
let playing = false;
let helpTextsShown = true;
let lastX = 0;
let absNumber = true;
let showDeaths = false;
let dateOffsetInputEl;

const TransStep = d3.transition().duration(advanceStep/2).ease(d3.easeLinear);

const CaseScale = {
  false: d3.scaleLog().domain([1, MaxCount]).range([0, LongDimension]),
  true: d3.scaleLog().domain([MaxCount, 1]).range([0, LongDimension])
};

const CountrySets = ({
  "Hotspots":
    ["China", "South Korea", "Italy", "Iran", "Germany", "France", "Spain", "United States", "United Kingdom", "Switzerland", "Belgium", "Netherlands", "Canada", "Austria"],
  "Populous": 
    ["China", "India", "United States", "Indonesia", "Pakistan", "Brazil", "Nigeria", "Bangladesh", "Russia", "Mexico", "Japan", "Ethiopia", "Philippines", "Egypt", "Vietnam", "Turkey"],
  "WestEurope": 
    ["Italy", "Spain", "Portugal", "France", "United Kingdom", "Netherlands", "Belgium", "Ireland",
    "Norway", "Sweden", "Denmark", "Finland", "Estonia", "Lithuania", "Latvia"],
  "CentralEurope": 
    ["Germany", "Switzerland", "Austria", "Czech Republic", "Poland", "Slovenia", "Slovakia", "Hungary", "Croatia"],
  "SoutheastEurope": 
    ["Croatia", "Bosnia and Herzegovina", "Serbia", "Romania", "Bulgaria", "Macedonia", "Albania", "Greece", "Turkey", "Russia", "Belarus", "Ukraine"],
  "EastAsia": 
    ["China", "South Korea", "Japan", "Philippines", "Thailand", "Vietnam", "Taiwan", "Malaysia",
    "Singapore", "Indonesia"]
});
const CountryLabels = {"United States": "USA", "United Kingdom": "UK"};

const preparation = {
  owidCases: "/story/covid-anim-race/total_cases.csv",
  owidDeaths: "/story/covid-anim-race/total_deaths.csv",
  populationSource: "/story/covid-anim-race/country-population.csv",
  countryCodes: "/story/euro-neighbours/country-codes-alpha3.json",
  oxcgrt: `https://covidtrackerapi.bsg.ox.ac.uk/api/stringency/date-range/${START_DATE}/${END_DATE}#json`
};
const svg = {}, chartArea = {};

function prepareRangeInput() {
  dateOffsetInputEl = document.getElementById('DateOffsetInput');
  const daysPassed = Math.floor(moment(END_DATE).diff(moment(START_DATE), 'days'));
  dateOffsetInputEl.setAttribute("max", daysPassed - 1);
  dateOffsetInputEl.value = daysPassed - 1;
}

function dataCompleted() {
  prepareRangeInput();
  interpolate(data.owidCases);
  interpolate(data.owidDeaths);
  data.population = {};
  for (let row of data.populationSource) {
    data.population[row.country] = row.population;
  }
  for (let race of document.getElementsByClassName("race")) {
    createChart(race);
  }
}

function shortDimension(cs) {
  return 2 * HeadRadius * CountrySets[cs].length + 20;
}

function createChart(chartEl) {
  const chartId = chartEl.id;
  const countrySetId = chartId.slice(0, -1);
  const isVertical = chartId.endsWith("V");
  const short  = shortDimension(countrySetId);
  const svgWidth = isVertical? short + AxisDim : LongDimension;
  const svgHeight = isVertical? LongDimension : short + AxisDim;

  const svgRoot = d3.create("svg")
    .attr("viewBox", `0 0 ${svgWidth} ${svgHeight}`)
    .attr("width", "100%");
  svg[chartId] = svgRoot.append("g");
  if (isVertical)
    svg[chartId].attr("transform", `rotate(-90,0,0) translate(${-LongDimension},0)`);
  
  svg[chartId].append("g")
    .attr("class", "dateLabel")
    .attr("transform", `translate(${LongDimension}, ${short})`)
    .append("text")
      .text("")
      .attr("opacity", 0.25)
      .attr("font-size", "99")
      .attr("dominant-baseline", "middle")
      .attr("text-anchor", "end");

  const logScale = CaseScale[false]; //TODO remove obj
  const axisBase = /*isVertical? d3.axisLeft(logScale) :*/ d3.axisBottom(logScale);
  const axisWithLines = axisBase
    .tickFormat((x) => (Math.abs(Math.log10(x) % 1) < 0.01 ? d3.formatPrefix("~s", x)(x) : "") )
    .tickSize(-LongDimension);
  chartArea[chartId] = svg[chartId]
    .append("g")
      .attr("transform", "translate(20,20)");
  chartArea[chartId]
    .append("g")
      .attr("transform", `translate(0,${short})`)
      .attr("color", "lightgray")
      .call(axisWithLines);
  chartArea[chartId]
    .append("g")
      .attr("transform", `translate(${LongDimension/2},${short + AxisDim/2})`)
      .attr("class", "logAxisTitle")
      .append("text")
        .text("")
        .attr("dominant-baseline", "middle")
        .attr("text-anchor", "middle");
  
  svg[chartId].append("g")
    .attr("class", "incoming")
    .attr("transform", `translate(${LongDimension/2}, ${short/2})`)
    .append("text")
      .text("")
      .attr("opacity", 0.75)
      .attr("font-size", "29")
      .attr("dominant-baseline", "middle")
      .attr("text-anchor", "middle");
    
  chartEl.innerHTML = '';
  chartEl.appendChild(svgRoot.node());
  overlay(chartEl);
  updateChart(chartEl);
}

function overlay(chartEl) {
  const overlayGlassEl = document.createElement("div");
  overlayGlassEl.setAttribute("class", "glass");
  const helpText = chartEl.classList.contains("onlyMob")?
    "Tap to play.<br>Slide finger to seek." : "Click to play.<br>Use bottom slider to seek.";
  overlayGlassEl.innerHTML = `<span class="helptext">${helpText}</span>`;
  chartEl.appendChild(overlayGlassEl);
  registerEventHandlers(chartEl, overlayGlassEl);
}

function registerEventHandlers(chartEl, overlayGlassEl) {
  dateOffsetInputEl.addEventListener('input', (event) => {
    updateChart(chartEl);
    if (helpTextsShown) removeAllHelpTexts();
  });

  dateOffsetInputEl.addEventListener('change', (event) => {
    playing = false;
  });

  overlayGlassEl.addEventListener('click', (event) => {
    if (helpTextsShown) removeAllHelpTexts();
    playing = !playing;
    if (playing) autoAdvance();
  });

  overlayGlassEl.addEventListener('touchstart', (event) => {
    playing = false;
    lastX = event.touches[0].clientX;
    if (helpTextsShown) removeAllHelpTexts();
  });

  overlayGlassEl.addEventListener('touchmove', (event) => {
    const deltaX = event.touches[0].clientX > lastX? 1 : -1;
    lastX = event.touches[0].clientX;
    dateOffsetInputEl.value = (+dateOffsetInputEl.value) + deltaX;
    dateOffsetInputEl.dispatchEvent(new InputEvent('input'));
  });
}

function autoAdvance() {
  if (!playing) return;
  let lastStep = false;
  let currentVal = +dateOffsetInputEl.value;
  const max = +dateOffsetInputEl.max;
  if (currentVal == max) currentVal = -1;
  else if (currentVal + 1 == max) lastStep = true;
  dateOffsetInputEl.value = currentVal + 1;
  dateOffsetInputEl.dispatchEvent(new InputEvent('input'));
  if (lastStep) playing = false;
  else setTimeout(autoAdvance, advanceStep);
}

function removeAllHelpTexts() {
  document.querySelectorAll(".helptext")
          .forEach(e => e.parentNode.removeChild(e));
  helpTextsShown = false;
}

function updateChart(chartEl) {
  //const isVertical = chartEl.classList.contains("mobOnly");
  const offset = +dateOffsetInputEl.value;
  const focalDate = moment(START_DATE).add(offset, 'days');
  const countrySetId = chartEl.id.slice(0, -1);
  const countries = CountrySets[countrySetId];
  const datas = data4date(focalDate, countries);
  const short = shortDimension(countrySetId);
  const countriesPositionScale = d3.scaleBand()
    .domain(countries)
    .range([0, short])
    .padding(0.2);
  const countriesColorScale = d3.scaleOrdinal(d3.schemeCategory10)
    .domain(countries);

  svg[chartEl.id].select("g.incoming > text")
    .text(datas.length === 0? `(${showDeaths? "deaths" : "cases"} incoming)` : "");
  svg[chartEl.id].select("g.logAxisTitle > text")
    .text(`${absNumber? "total " : ""}number of ${showDeaths? "deaths" : "cases"} ${absNumber? "in the country" : "per 100M residents"}`);

  svg[chartEl.id].select("g.dateLabel > text")
    .text(focalDate.format("M/D"));

  const tadpoles = chartArea[chartEl.id].selectAll(".tadpole")
    .data(datas, d => d.country);
  
  const freshTadpoles = tadpoles.enter().append("g");

  freshTadpoles.attr("class", "tadpole")
    .attr("fill", d => countriesColorScale(d.country))
    .attr("opacity", 0.85);

  freshTadpoles.append("circle")
    .attr("r", d => HeadRadius)
    .attr("cy", d => countriesPositionScale(d.country))
    .attr("fill-opacity", "100%")
    .attr("stroke", d => countriesColorScale(d.country))
    .attr("stroke-width", TailThickness/2);
  freshTadpoles.append("rect")
    .attr("class", "casetail")
    .attr("y",  d => countriesPositionScale(d.country) - TailThickness/2)
    .attr("height", TailThickness);
  freshTadpoles.append("text")
    .attr("class", "level")
    .attr("dominant-baseline", "middle")
    .attr("text-anchor", "middle")
    .attr("y",  d => countriesPositionScale(d.country) + 1);
  freshTadpoles.append("text")
    .attr("class", "title")
    .text(d => countryLabel(d.country) )
    .attr("dominant-baseline", "middle")
    .attr("y",  d => countriesPositionScale(d.country) + 1)
    .attr("dx", "0.25em");

  const logScale = CaseScale[false]; //[isVertical];
  const updatedTadpoles = tadpoles.merge(freshTadpoles);
  updatedTadpoles.selectAll("circle").data(datas, d => d.country)
    // .transition(TransStep)
    // .attr("fill-opacity", d => d.stringency + "%")
    .attr("cx", d => logScale(d.now));
  updatedTadpoles.selectAll("rect.casetail").data(datas, d => d.country)
    // .transition(TransStep)
    .attr("x",  d => logScale(d.before))
    .attr("width", d => logScale(d.now) - logScale(d.before));
  updatedTadpoles.selectAll("text.level").data(datas, d => d.country)
    // .transition(TransStep)
    .attr("x", d => logScale(d.now))
    .text(d => d.stringency? Math.round(d.stringency / 10) : "");
  updatedTadpoles.selectAll("text.title").data(datas, d => d.country)
    // .transition(TransStep)
    .attr("x",  d => logScale(d.now) + HeadRadius);

  tadpoles.exit().remove();
}

function data4date(date, countries) {
  const weekBeforeDate = moment(date).subtract(7, 'days');
  const d1 = date.format("YYYY-MM-DD");
  const d0 = weekBeforeDate.format("YYYY-MM-DD");
  const source = showDeaths? data.owidDeaths : data.owidCases;
  const dataStart = source.find(o => o.date == START_DATE);
  const dataNow = source.find(o => o.date == d1);
  const dataBefore = source.find(o => o.date == d0);
  const result = [];
  for (let country of countries) {
    const divisor = absNumber? 1 : data.population[country]/100000000;
    if (!dataNow || !dataBefore)
      console.log("No " + country + " for " + d1 + " " + dataNow + " " + dataBefore);
    else if (+dataNow[country] >= divisor) {
      const point1 = +dataNow[country] / divisor;
      const point0 = +dataBefore[country] / divisor;
      const ref = +dataStart[country] / divisor;
      result.push({
        country: country,
        now: point1 - ref,
        before: point0 - ref >= 1? point0 - ref : 1,
        stringency: findStringency(country, d1)
      });
    }
  }
  return result;
}

function findStringency(country, dateString) {
  const dataForDate = data.oxcgrt.data[dateString];
  if (!dataForDate) return undefined;
  const datapoint = dataForDate[data.countryCodes[country]];
  if (datapoint) return datapoint.stringency;
  else return undefined;
}

function interpolate(a) {
  let last = a[0];
  for (let entry of a) {
    for (let [key, value] of Object.entries(entry)) {
      if (key != "date" && value === "") {
        entry[key] = last[key];
      }
    }
    last = entry;
  }
}

function countryLabel(c) {
  return CountryLabels[c] || c;
}

function switchAbsRel() {
  absNumber = !absNumber;
  dateOffsetInputEl.dispatchEvent(new InputEvent('input'));
  document.getElementById("AbsoluteSwitch").classList.toggle("red-text");
  document.getElementById("RelativeSwitch").classList.toggle("red-text");
  document.getElementById("arSwitchSublabel").textContent = absNumber? "Absolute" : "Relative";
}

function switchCaseDed() {
  showDeaths = !showDeaths;
  dateOffsetInputEl.dispatchEvent(new InputEvent('input'));
  document.getElementById("CasesSwitch").classList.toggle("red-text");
  document.getElementById("DeathsSwitch").classList.toggle("red-text");
  document.getElementById("cdSwitchSublabel").textContent = showDeaths? "Deaths" : "Cases";
}