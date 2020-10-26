# First wave of COVID cases in Europe

*Hrvoje Šimić, 2020-10-26*

If we plot COVID-19 daily reported cases and deaths from [Our World in Data](https://ourworldindata.org/coronavirus-source-data) across all EU countries, we get this:

<figure style="max-width: 500px; margin: auto">
  <div class="covidChart" data-show="cd" data-territory="EU" data-offset="0" data-dmax="40" data-window="1"></div>
  <figcaption>Plot of daily reported cases and deaths in all EU countries combined.</figcaption>
</figure>

Let's take a simple symmetric 31-day average to get rid of the noise:

<figure style="max-width: 500px; margin: auto">
  <div class="covidChart" data-show="cd" data-territory="EU" data-offset="0" data-dmax="21.5" data-window="31"></div>
  <figcaption>Plot of daily reported cases and deaths in EU, averaged across 31 days. Last 31 days are progressively faded as they could change with future data.</figcaption>
</figure>

It's easy to see that both registered cases and deaths from COVID came in "waves", the first appearing in March and dying down by the end of June, and the second still rising.

## Identifying the first wave of the epidemic

Does this wave of reported cases emerge in every European country? A systematic approach would be to formally define parameters of the first wave, the one that occurred in the first six months of 2020. On the 31-day average time series we are using these criteria:

- wave *started* on the day that average exceeded one case per million population;
- wave *peaked* on the day of highest value in those six months;
- wave *ended* on the first day after peak day which either had under one case per million population, or minimum value between peak day and July 1<sup>st</sup>;
- difference between end value and peak value divided by the peak value is *relative height* of the wave.

These parameters are shown in the following chart. For each country, the span of the wave is depicted with a blue bar. The bar is darker as the relative height of the wave is larger, with the date of highest value marked with a red tick on the bar.

```vly.exceptMob
width: 280
height: 520
autosize: { resize: true }
data:
  name: firstWaves
layer:
  - mark: bar
    encoding:
      x:
        field: startDate
        type: temporal
        title: null
      x2:
        field: lowDate
        type: temporal
      color:
        field: relHeight
        type: quantitative
        title: wave height
      y:
        field: country
        type: nominal
        title: null
        sort: x
      tooltip:
        - field: country
          type:  nominal
        - field: startDate
          type:  temporal
        - field: peakDate
          type:  temporal
        - field: lowDate
          type:  temporal
        - field: relHeight
          type:  quantitative
          title: relative wave height
  - mark: 
      type: tick
      stroke: white
      fill: red
    encoding:
      x:
        field: peakDate
        type: temporal
      y:
        field: country
        type: nominal
        sort: x
config:
  tick:
    thickness: 4
caption:
  Extent of first waves in select European countries.
```
```vly.onlyMob
width: 160
height: 520
autosize: { resize: true }
data:
  name: firstWaves
transform:
  - calculate: slice(datum.country, 0, 10)
    as: shortCountryName
layer:
  - mark: bar
    encoding:
      x:
        field: startDate
        type: temporal
        title: null
      x2:
        field: lowDate
        type: temporal
      color:
        field: relHeight
        type: quantitative
        title: wave height
      y:
        field: shortCountryName
        type: nominal
        title: null
        sort: x
      tooltip:
        - field: country
          type:  nominal
        - field: startDate
          type:  temporal
        - field: peakDate
          type:  temporal
        - field: lowDate
          type:  temporal
        - field: relHeight
          type:  quantitative
          title: relative wave height
  - mark: 
      type: tick
      stroke: white
      fill: red
    encoding:
      x:
        field: peakDate
        type:  temporal
      y:
        field: shortCountryName
        type:  nominal
        sort:  x
config:
  tick:
    thickness: 4
  axisY:
    maxExtent: 20
caption:
  Extent of first waves in select European countries.
```

We can see that most countries satisfy these two conditions:

 - wave is pronounced (relative height greater than 80%) and
 - the peak has occurred before May 1<sup>st</sup>.

However, there are some countries which do not have an observable distinct wave in the first half of the year. They are mostly located in the eastern part of the continent (notably including also Sweden), with Belarus and Poland as border cases.


## Correlation between cases and deaths

Now that we have an interval of COVID cases, let's see how the cases curve and the deaths curve correlate with one another. A rise and fall in cases should be followed by the corresponding change in the deaths curve, following the former by a undetermined offset, counted in days or perhaps weeks. This should correspond to real-world time shift between disease detection and recorded fatality. Clean-cut waves in epidemic are useful here, because we expect most cases to resolve either in recovery or death.

We can calculate Pearson's correlation coefficient for offsets from zero to 28 days to estimate best fit between the curves. The correlation varies for different offsets:

```vly.exceptMob
width: 120
height: 120
autosize: { resize: true }
data:
  name: waveCorrelations
transform:
  - filter: datum.country == 'EU'
  - filter:
      field: w
      oneOf: [0, 3, 15]
  - calculate: if(datum.w == 0, 'no averaging', if(datum.w == 3, '7-day', '31-day'))
    as: wtitle
mark: line
encoding:
  column:
    field: wtitle
    type: ordinal
    title: averaging window
    sort: {field: w}
  x:
    field: offset
    type: quantitative
  y:
    field: r
    type: quantitative
    title: Pearson's r
```
```vly.onlyMob
width: 150
height: 150
autosize: { resize: true }
data:
  name: waveCorrelations
transform:
  - filter: datum.country == 'EU'
  - filter:
      field: w
      oneOf: [0, 3, 15]
  - calculate: if(datum.w == 0, 'no averaging', if(datum.w == 3, '7-day', '31-day'))
    as: wtitle
mark: line
encoding:
  row:
    field: wtitle
    type: ordinal
    title: averaging window
    sort: {field: w}
  x:
    field: offset
    type: quantitative
  y:
    field: r
    type: quantitative
    title: Pearson's r
```

When there is no averaging you can notice small waves that are there because of the weekly variation of data. These disappear when we calculate simple 7-day rolling average.

31-day window rolling average is quite similar to 7-day. The correlation coefficient is somewhat higher because some of the noise gets averaged out.

Peak correlation appears to be for offset around 7 days, and this is true regardless of averaging.

From this we can conclude there is a "sweet spot" where the curves for EU's cases and deaths in the first wave overlap very well, as _r_ ≈ 1. But how does this look on the country level?

## Case/death curve correlations in different countries

Here we have charts that show correlation as function of offset for different averaging windows, from 1 (no averaging) to full 31 days.

The most populous countries in EU do show a similar pattern:

```vly.exceptMob
width: 120
height: 120
autosize: { resize: true }
data:
  name: waveCorrelations
transform:
  - filter:
      field: country
      oneOf: [Germany, France, Italy, Spain]
  - calculate: datum.w * 2 + 1
    as: days averaged
mark: line
encoding:
  column:
    field: country
    type: nominal
    title: null
  x:
    field: offset
    type: quantitative
  color:
    field: days averaged
    type: ordinal
  y:
    field: r
    type: quantitative
    title: Pearson's r
```
```vly.onlyMob
width: 150
height: 150
autosize: { resize: true }
data:
  name: waveCorrelations
transform:
  - filter:
      field: country
      oneOf: [Germany, France, Italy, Spain]
  - calculate: datum.w * 2 + 1
    as: days averaged
mark: line
encoding:
  row:
    field: country
    type: nominal
    title: null
  x:
    field: offset
    type: quantitative
  color:
    field: days averaged
    type: ordinal
  y:
    field: r
    type: quantitative
    title: Pearson's r
```

However, they widely vary in peak-correlation offset: Italy peaks at just 4 days, while Germany peaks at full 14 days deaths curve offset.

Most smaller countries are showing this pattern too:

```vly.exceptMob
width: 120
height: 120
autosize: { resize: true }
data:
  name: waveCorrelations
transform:
  - filter:
      field: country
      oneOf: [Austria, Belgium, Norway, Switzerland]
  - calculate: datum.w * 2 + 1
    as: days averaged
mark: line
encoding:
  column:
    field: country
    type: nominal
    title: null
  x:
    field: offset
    type: quantitative
  color:
    field: days averaged
    type: ordinal
  y:
    field: r
    type: quantitative
    title: Pearson's r
```
```vly.onlyMob
width: 150
height: 150
autosize: { resize: true }
data:
  name: waveCorrelations
transform:
  - filter:
      field: country
      oneOf: [Austria, Belgium, Norway, Switzerland]
  - calculate: datum.w * 2 + 1
    as: days averaged
mark: line
encoding:
  row:
    field: country
    type: nominal
    title: null
  x:
    field: offset
    type: quantitative
  color:
    field: days averaged
    type: ordinal
  y:
    field: r
    type: quantitative
    title: Pearson's r
```

Belgium is similar to Italy, while Austria, Norway and Switzerland are like Germany, hovering around 14 days.

A few countries do have a recognizable first wave, but without a sizable offset between the curves.

```vly.exceptMob
width: 120
height: 120
autosize: { resize: true }
data:
  name: waveCorrelations
transform:
  - filter:
      field: country
      oneOf: [Serbia, United Kingdom, Denmark]
  - calculate: datum.w * 2 + 1
    as: days averaged
mark: 
  type: line
  clip: true
encoding:
  column:
    field: country
    type: nominal
    title: null
  x:
    field: offset
    type: quantitative
  color:
    field: days averaged
    type: ordinal
  y:
    field: r
    type: quantitative
    title: Pearson's r
    scale: 
      domain: [0,1]
```
```vly.onlyMob
width: 150
height: 150
autosize: { resize: true }
data:
  name: waveCorrelations
transform:
  - filter:
      field: country
      oneOf: [Serbia, United Kingdom, Denmark]
  - calculate: datum.w * 2 + 1
    as: days averaged
mark: 
  type: line
  clip: true
encoding:
  row:
    field: country
    type: nominal
    title: null
  x:
    field: offset
    type: quantitative
  color:
    field: days averaged
    type: ordinal
  y:
    field: r
    type: quantitative
    title: Pearson's r
    scale: 
      domain: [0,1]
```

Serbia here is instructive, as it shows some correlation around 12 days in the no averaging condition, but this fades out with wider averaging windows. United Kingdom's peak correlation is stuck at zero, suggesting very late testing or post-mortem testing in the course of disease in the initial phase of the epidemic.

Off the deep end are countries that had no defined wave in the first half of 2020:

```vly.exceptMob
width: 120
height: 120
autosize: { resize: true }
data:
  name: waveCorrelations
transform:
  - filter:
      field: country
      oneOf: [Belarus, Sweden, Poland]
  - calculate: datum.w * 2 + 1
    as: days averaged
mark: 
  type: line
  clip: true
encoding:
  column:
    field: country
    type: nominal
    title: null
  x:
    field: offset
    type: quantitative
  color:
    field: days averaged
    type: ordinal
  y:
    field: r
    type: quantitative
    title: Pearson's r
    scale: 
      domain: [0,1]
```
```vly.onlyMob
width: 150
height: 150
autosize: { resize: true }
data:
  name: waveCorrelations
transform:
  - filter:
      field: country
      oneOf: [Belarus, Sweden, Poland]
  - calculate: datum.w * 2 + 1
    as: days averaged
mark: 
  type: line
  clip: true
encoding:
  row:
    field: country
    type: nominal
    title: null
  x:
    field: offset
    type: quantitative
  color:
    field: days averaged
    type: ordinal
  y:
    field: r
    type: quantitative
    title: Pearson's r
    scale: 
      domain: [0,1]
```

What these cases suggest is that when there is no distinct "wave" of cases, there is no significant correlation between cases and deaths in the conditions we have explored. Averaging raises correlation coefficients, but they don't converge to specific value.

## The offset map

We can show differences in best-fit offsets between countries on the map of Europe. Here, countries are colored according to the size of offset between deaths and cases. The larger the offset, the darker the color: white means zero offset or no distinct wave in first half of 2020. Offset with peak correlation coefficient are shown in circles, and the circle is darker as the peak correlation is higher.

<figure style="max-width: 500px; margin: auto">
  <div id="OffsetMap">Loading map...</div>
  <figcaption>
    Map of Europe showing first-wave offsets.
  </figcaption>
</figure>

Differences are striking, but the map is not in chaos. There are noticeable geographical patterns:

- Eastern Europe mostly lacks distinct first wave. They were late to the "Corona party", had low incidence all through Spring and Summer, but the number of cases was still relatively high.
- Central Europe countries mostly have well-defined first wave curves, with offset at around two weeks. Norway and Iceland follow suit, while Denmark doesn't, and Sweden is an obvious black sheep in the European flock thanks to its epidemiology policies.
- Western Europe is quite consistent with one week offset. UK is outlier here, again choosing a different approach in the early days of the epidemic.
- Italy has quite short offset, perhaps not surprising given the dramatic start of the first wave there.
