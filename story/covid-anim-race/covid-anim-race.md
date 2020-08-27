# Pandemic on a log scale

*Hrvoje Šimić, 2020-04-10 - live data from [ECDC](https://ourworldindata.org/coronavirus-source-data) and from [OxCRGT](https://covidtracker.bsg.ox.ac.uk/about-api)*

<span class="dropcap">T</span>hese charts show the development of COVID-19 pandemic on a logarithmic scale. Position of the circle shows the cumulative number of cases on the specific date, as reported by [ECDC](https://www.ecdc.europa.eu/en/coronavirus), and the "tail" shows the change in that number in the preceding week. For a more detailed explanation, please read [*A race to Wuhan*](/a/covid-race).

Numbers in the "heads" is the *Government Response Stringency Index* calculated by [The Oxford COVID-19 Government Response Tracker (OxCGRT)](https://www.bsg.ox.ac.uk/research/research-projects/oxford-covid-19-government-response-tracker), divided by ten and rounded to fit. The higher the number, the harder the lockdown.

Controls are on the bottom of the page. Slider changes display date. You can also switch between absolute and numbers relative to the population of the country (one per 100 million), and also between the number of confirmed cases and the number of reported deaths.

## Recent COVID hotspots

<p id="HotspotsH" class="exceptMob race">Loading chart...</p>
<p id="HotspotsV" class="onlyMob race"  >Loading chart...</p>

<p class="onlyMob">Tip: you can slide your finger across the chart to move through dates.</p>

## The most populous countries in the world

<p id="PopulousH" class="exceptMob race">Loading chart...</p>
<p id="PopulousV" class="onlyMob race"  >Loading chart...</p>

## Southwest, West and Northern Europe

<p id="WestEuropeH" class="exceptMob race">Loading chart...</p>
<p id="WestEuropeV" class="onlyMob race"  >Loading chart...</p>

## Central Europe

<p id="CentralEuropeH" class="exceptMob race">Loading chart...</p>
<p id="CentralEuropeV" class="onlyMob race"  >Loading chart...</p>

## Southeast and East Europe

<p id="SoutheastEuropeH" class="exceptMob race">Loading chart...</p>
<p id="SoutheastEuropeV" class="onlyMob race"  >Loading chart...</p>

## East Asia

<p id="EastAsiaH" class="exceptMob race">Loading chart...</p>
<p id="EastAsiaV" class="onlyMob race"  >Loading chart...</p>

<div id="DateOffsetDiv">
  <form>
    <span class="exceptMob">Jan 16</span>
    <span class="slider">
      <input type="range" id="DateOffsetInput" name="dateOffset" value="0" min="0" max="85">
      <span class="onlyMob sublabel">slider for dates</span>
    </span>
    <span class="exceptMob">yesterday</span>
    <span id="arSwitch" class="switch">
      <label>
        <span id="AbsoluteSwitch" onclick="switchAbsRel()" class="exceptMob red-text">Absolute</span>
        <input type="checkbox">
        <span class="lever" onclick="switchAbsRel()"></span>
        <span id="RelativeSwitch" onclick="switchAbsRel()" class="exceptMob">Relative</span>
      </label>
      <span id="arSwitchSublabel" class="onlyMob sublabel">Absolute</span>
    </span>
    <span id="cdSwitch" class="switch">
      <label>
        <span id="CasesSwitch" onclick="switchCaseDed()" class="exceptMob red-text">Cases</span>
        <input type="checkbox">
        <span class="lever" onclick="switchCaseDed()"></span>
        <span id="DeathsSwitch" onclick="switchCaseDed()" class="exceptMob">Deaths</span>
      </label>
      <span id="cdSwitchSublabel" class="onlyMob sublabel">Cases</span>
    </span>
  </form>
</div>

