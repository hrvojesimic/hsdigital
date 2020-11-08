# Case fatality rate in Europe has fallen

*Hrvoje Šimić, 2020-11-07*

<p class="low-key card-panel yellow lighten-4">
  <b>Reader beware</b>: Author is not an expert in epidemiology or any related field. I advise taking this article with a grain of salt.
</p>

[Continuing](https://hrvoje.simic.digital/a/covid-wave-1) the phenomenological approach to analysing COVID-19 cases in Europe, we'll try to calculate the proportion of fatal outcomes of the disease. Let's start with an up-to-date chart of the pandemic in the EU (data from [ECDC](https://github.com/owid/covid-19-data/blob/master/public/data/ecdc)):

<figure>
  <div class="fullChart" 
     data-territory="EU" 
     data-show="cd"
     data-offset="0" 
     data-dmax="48"></div>
  <figcaption>Plot of daily reported cases and deaths in EU, averaged across 31 days. Last 14 days are progressively faded as they are likely to change with future data.</figcaption>
</figure>

For the first wave, the cases curve and the deaths curve are almost identical, the only difference being timing. If we shift the red curve just one week to the left, we get nearly perfect overlap of cases and deaths for the first half of 2020.

<figure>
  <div class="fullChart" 
     data-territory="EU" 
     data-show="cd"
     data-offset="7" 
     data-dmax="48"></div>
  <figcaption>Plot of daily reported cases in EU, and deaths shifted by 7 days, both averaged across 31 days. The bottom axis shows date of new cases only.</figcaption>
</figure>

Where two curves overlap, the ratio of their values stays the same. This ratio is called *case fatality rate* or **CFR**, proportion of fatal outcomes from all people diagnosed with the disease. In the chart below it is drawn in black ink, thicker for dates when there were more cases. Note also that the y-scale is logarithmic, allowing us to show relative differences between values of different order of magnitude.

<figure>
  <div class="fullChart" 
     data-territory="EU" 
     data-show="f"
     data-offset="7"></div>
  <figcaption>Case fatality rate for EU for a 7-day offset in deaths. Line thickness corresponds to the relative number of cases. Last 14 days of data are progressively faded as they are likely to change with future data.</figcaption>
</figure>

First wave CFR was rather high, around 12 percent. It has fallen since then, mostly during late spring and throughout summer, settling at about 1 percent in September.

Why did CFR change? And what, if anything, can this phenomenon tell us about the *infection fatality rate* (IFR), ratio of deaths among all infected people, both those who were diagnosed and officially recorded, and those who were not?

One reasonable assumption is that IFR remained approximately constant during the year, and that these changes in CFR must be because of poor detection capabilities in the early days of pandemic, relative to the later ones.

So how was testing during this time period? We can use [a different dataset](https://www.ecdc.europa.eu/en/publications-data/covid-19-testing) from ECDC, which collects weekly statistics from European countries. Collectively, EU testing history looks like this:

<figure>
  <div class="fullChart" 
     data-territory="EU" 
     data-show="tp"
     data-offset="7"></div>
  <figcaption>Chart showing how many tests were administered daily per 100 000 population in EU (in green), and also how many of those tests were positive (in purple).</figcaption>
</figure>

Comparing these two charts, we can notice that more testing is correlated with lower CFR. This seems to confirm our hypothesis above, but the evidence is flimsy: just because one variable decreases with time and another one increases, we shouldn't assume causation.

## Differences between East and West

Let's focus on all member states from the western side of the continent, up to Finland, Germany, Austria, and Italy. Here are all three charts put together:

<figure>
<div class="fullChart" 
     data-territory="West EU" 
     data-offset="7" 
     data-dmax="50"></div>
  <figcaption>Daily cases and offset daily deaths shown on top; CFR and calculated combined indicator shown in the middle; tests data below.</figcaption>
</figure>

Notice that we added some color to the gloomy CFR chart, marking periods of time with gray, green, orange and red according to criteria of ECDC [**combined indicator**](https://www.ecdc.europa.eu/en/covid-19/situation-updates/weekly-maps-coordinated-restriction-free-movement) of pandemic severity for that region. Green means good epidemiological situation, red means bad, orange is less bad, and gray is undetermined.

The charts are very similar to EU as a whole, because the west has larger population and the first wave was more severe there. We can see that since August 1<sup>st</sup> CFR is relatively low and now varies between 0.5 and 1 percent. This dramatic shift occurred in late spring and summer, with a slight rebound at the end of summer.

Let's look closer to the differences between cases and deaths in the second wave. If we zoom in the lower part of the deaths scale (keeping the daily cases scale intact) we see that the deaths curve falls under the cases curve in August and then rebounds. 

<figure>
  <div class="fullChart" 
      data-show="cd"
      data-territory="West EU" 
      data-offset="7" 
      data-dmax="3.6"></div>
</figure>

But suppose that the deaths-to-cases offset changed between the waves. Can we match growth from late summer with the rise of deaths in the early fall, like we did with the first wave? 

The answer is no. Both curves are rising and there is no signal in the cases to indicate a shift in trend. Without this wave pattern there are no significant features of the curves on which to synchronize. So, for now, let's calculate the CFR with the offset values from spring.

## Meanwhile, on the Eastern front

Eastern EU countries need a larger offset to overlap on the first wave, around 10 days.

<div class="fullChart" 
     data-territory="East EU" 
     data-offset="10" 
     data-dmax="25"></div>


CFR is fairly continuous throughout this period. In April it was around 6%, decreasing all through the summer. During the months of May, June, and July the CFR halved, from 6 to 3%, even though testing hasn't improved during this period. Finally, it settled in September to just above 2%, markedly above the numbers in Western Europe. Even as the test positivity rises well over 5%, it remains lower than in early spring.

This is not as a dramatic change as we can observe in the western countries, but the trend seems quite stable.

## France

Let's zoom in to some of the largest countries in the EU, the ones that were hit hard in the first half of the year. First up, France:

<div class="fullChart" 
     data-territory="France" 
     data-offset="7" 
     data-dmax="130"></div>

France had the worst CFR in EU, around 21% in April. This changed exponentially from mid-May to mid-August, coming to under 0.5% while daily tests grew linearly from about 50 to about 150 per 100 000. Since mid-August it grew slightly, but it still shows values that are under 1%, if we calculate CFR with a 7-day offset.

Even if we vary the offset to 14, 21, or 28 days, CFR is still relatively stable — just under, around, or just over 1%, respectively.

## Germany

<div class="fullChart" 
     data-territory="Germany" 
     data-offset="14" 
     data-dmax="7.8"></div>

CFR is quite constant (~5%) throughout the first wave in Germany, both in late March, when positivity was 8%, as well as in May, when the positivity was under 2%. During summer CFR reached values well under 1%, however at the end of August there is a wierd change of trend.

If we overlap the growth in deaths from the second wave with the strong rise of reported cases in early fall we get a different picture. These two growths seem to be almost simultaneous (offset of just 2 days), but it produces a more stable CFR curve in the later period. The September-October CFR in this case would come up to around 0.5%.

<div class="fullChart" 
     data-show="cdfa"
     data-territory="Germany" 
     data-offset="2" 
     data-dmax="0.8"></div>

## Italy

<div class="fullChart" data-territory="Italy" data-offset="4" data-dmax="55"></div>

Chaotic March 2020 in Italy left a mark on the positivity curve, reaching almost 25%. No wonder that March had CFR at 14%. But this very same CFR value was stable to the end of spring, at which time the positivity rate was already under 5%. Then the CFR fell exponentially, settling at about 1%.

If we zoom in on the autumn deaths, we can see that with the 4-day offset from the first wave we still get the uptick at the same time (early October):

<div class="fullChart" data-show="cd" data-territory="Italy" data-offset="4" data-dmax="3.6"></div>

## Spain

There were some discontinuities in Spain's reported numbers in May and June which make the calculation of CFR very unreliable. Data on testing from the first part of the year is completely missing:

<div class="fullChart" data-territory="Spain" data-offset="6" data-dmax="56"></div>

Even if we restrict ourselves to August and September, the data does not look stable. Positivity rate has been quite high, 8% to 12%, and the calculated CFR rises markedly even though daily tests keep rising since July.

## United Kingdom

This recent member of the EU is a curious case, as there is a distinct first wave but no discernable shift in deaths curve. Also, there is a marked difference in the width of the curves, with cases distribution being quite wider.

<div class="fullChart" data-territory="United Kingdom" data-offset="0" data-dmax="60"></div>

We don't have data on testing in February and March, but early April positivity is very high, 20% and more. However, even though testing improved in May and positivity fell to well under 5%, CFR remained over 10% until end of spring, and then rapidly descended to under 0.7%.

Overlapping on the deaths curve with a more realistic offset of 7 days and a constant late summer/early fall CFR of 0.8%:

<div class="fullChart" data-show="cdfa" data-territory="United Kingdom" data-offset="7" data-dmax="3.2"></div>


## Sweden

Sweden is an attractive case to study because it pursued distinctive policies from its neighbours, and most of Europe for that matter. A lack of lockdown resulted lead to a quite different shape of the daily cases curve, so we don't have a "sweet spot" offset for deaths. However, if we align curves on the first attack edge in March and April, we can draw a four-day offset:

<div class="fullChart" data-territory="Sweden" data-offset="4" data-dmax="33"></div>

The CFR is declining, from 16% in April to 1% in August. This is in alignment with the rising daily tests. In September the CFR keeps falling further to under 0.5%, even though testing was relatively constant, and the proportion of positive tests grew.

## Calculating CFR values for different offsets

We've seen a lot of charts in this article, with CFR flailing widely across the spectrum of possible values. But which ones are right?

Since we suspect that CFRs and offsets have changed between the waves, and since we cannot reliably calculate the offset by overlapping curves, let's try to calculate CFR for every offset between zero and 35 days (no averaging necessary). Here's the result for the 30 days of September in Germany:

```vly
width: 160
height: 130
autosize: { resize: true }
data:
  name: secondWaveCfrs
transform:
  - filter: datum.territory == 'Germany'
mark: line
encoding:
  x:
    field: offset
    type: quantitative
    title: offset in days
  y:
    field: cfr
    type:  quantitative
    title: calculated CFR
    axis:  {format: .0%}
caption: Calculated average CFRs for Germany, September 2020, for different offsets.
```

We can see that for offsets between 0 and 20 days calculated CFR is under 1%. When we increase offset to over 20 days, getting to almost 3% when extended to full five weeks.

Another way to look at the same data is to draw it as a histogram with a smooth curve, to see frequency of different CFR values:

<figure>
  <div class="cfrHistograms" style="max-width: 360px; margin: auto;">Germany</div>
  <figcaption>Histogram of different calculated CFR values for offsets 0 to 35 days, for cases reported in Germany in September 2020.</figcaption>
</figure>

Again, the chart shows that most values are under 1%, and all values are under 3%.

So let us now compare the countries from the western part of EU:

<figure>
  <div class="cfrHistograms" style="max-width: 360px; margin: auto;">
    Belgium, Denmark, Finland, France, Germany, Italy, Ireland, Sweden, Spain, Luxembourg, Portugal, Netherlands
  </div>
  <figcaption>Histograms of different calculated CFR values for offsets 0 to 35 days, for cases reported in September 2020.</figcaption>
</figure>

We can see that all histograms have humps under 2% CFR. Calculated CFRs for Denmark and Finland are completely located under 1%. On the other extreme, Belgium and Italy show a wide range of CFR values for offsets between 0 and 35 days.

Eastern part of the union is much messier:

<figure>
  <div class="cfrHistograms" style="max-width: 360px; margin: auto;">
    Greece, Romania, Poland, Czech Republic, Slovakia, Slovenia, Croatia, Hungary, Bulgaria, Estonia, Lithuania, Latvia
  </div>
  <figcaption>Histograms of different calculated CFR values for offsets 0 to 35 days, for cases reported in September 2020.</figcaption>
</figure>

Estonia, Slovakia, Slovenia have western profiles, but countries like Poland have very wide range of calculated values, even ones over 10%.

European countries outside the EU follow the same east-west trend.

<figure>
  <div class="cfrHistograms" style="max-width: 360px; margin: auto;">
    Belarus, United Kingdom, Norway, Switzerland, Ukraine, Serbia, Albania, Bosnia and Herzegovina, Iceland, Montenegro, Macedonia
  </div>
  <figcaption>Histograms of different calculated CFR values for offsets 0 to 35 days, for cases reported in September 2020.</figcaption>
</figure>

The only ones with the hump under 1% are the western countries. Of those, United Kingdom has the most dispersed values.

## Drop in CFR across Europe

However we slice the data, one insight remains salient: CFRs in Europe have dropped over the summer. We can see that in this chart, each arrow depicting the change in a single European country from the April CFR (estimation based on the deaths offset with the highest correlation with the cases curve) to the median CFR values calculated for this September:

<figure>
  <div id="CfrChangeChart"></div>
  <figcaption>Estimated CFR in select European countries in April (orange circle) and calculated CFR in September (green rectangle). Width of the rectangle represents the interquartile range and the arrow finishes on median value.</figcaption>
</figure>

Top part shows countries of West EU, with widely different estimated case fatality rates in April represented with circles. Rectangles, which represent the interquartile range of calculated CFRs in September, are close to the 0% line. Non-EU countries in the West, such as UK, Switzerland and Norway, are following the western trends. However, CFRs in eastern EU countries are not falling as much.

Reasons for this change in CFRs are not clear. It appears that higher levels of testing play an important role, but they don't seem to explain the effect entirely. Whatever the cause may be, it's a comforting idea that record-high numbers of cases this fall do not lead to proportionally as much death as they did in the first half of 2020. In Western Europe, at least.
