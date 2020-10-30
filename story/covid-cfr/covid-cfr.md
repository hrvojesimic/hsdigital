# COVID-19 case fatality rate in Europe

*Hrvoje Šimić, 2020-10-30*

Continuing our phenomenological approach to analysing COVID-19 cases in Europe, 

<figure>
<div class="fullChart" 
     data-territory="EU" 
     data-show="cd"
     data-offset="0" 
     data-dmax="33"></div>
  <figcaption>Plot of daily reported cases and deaths in EU, averaged across 31 days. Last 14 days are progressively faded as they are likely to change with future data.</figcaption>
</figure>

For the first wave, the cases curve and the deaths curve are almost identical, the only difference being in time. If we shift the red curve just one week to the left, we get almost perfect overlap for the early months of 2020.

<figure>
  <div class="fullChart" 
     data-territory="EU" 
     data-show="cd"
     data-offset="7" 
     data-dmax="33"></div>
  <figcaption>Plot of daily reported cases in EU, and deaths shifted by 7 days, both averaged across 31 days. The bottom axis shows date of new cases, not new deaths.</figcaption>
</figure>

Where two curves overlap, the ratio of their values is the same. This ratio is called *case fatality rate* or **CFR**, proportion of fatal outcomes from all people diagnosed with the disease. In the chart below it is drawn in black ink, thicker for dates where there are more cases. Note also that the y-scale is logarithmic, allowing us to show relative differences between values of different order of magnitude.

<figure>
  <div class="fullChart" 
     data-territory="EU" 
     data-show="f"
     data-offset="7" 
     data-dmax="33"></div>
  <figcaption>Case fatality rate for EU for a 7-day offset in deaths. Line thickness corresponds to the relative number of cases. Last 14 days of data are progressively faded as they are likely to change with future data.</figcaption>
</figure>

First wave CFR was rather high, around 12 percent. Then it has fallen sharply during late spring and throughout summer, settling at about 1 percent in September.

Why is this so?

<figure>
  <div class="fullChart" 
     data-territory="EU" 
     data-show="tp"
     data-offset="7" 
     data-dmax="33"></div>
  <figcaption>Chart showing how many tests were administered daily per 100 000 population in EU (in green), and also how many of those tests were positive (in purple).</figcaption>
</figure>



## Differences between East and West

Let's focus on member states from the western side of the continent. Here are all three charts

<figure>
<div class="fullChart" 
     data-territory="West EU" 
     data-offset="7" 
     data-dmax="35"></div>
  <figcaption>Daily cases and offset daily deaths shown on top; CFR and calculated combined indicator shown in the middle; tests data below.</figcaption>
</figure>

and now varies between 0.5 and 1 percent. This dramatic shift occurred in late spring and  summer, with a slight rebound in September.

Eastern EU countries need a larger offset, around 10 days.

<div class="fullChart" 
     data-territory="East EU" 
     data-offset="10" 
     data-dmax="17"></div>

CFR is fairly continous throughout this period. In April it was around 6%, and in September it fell to just above 2%.

## France


<div class="fullChart" 
     data-territory="France" 
     data-offset="7" 
     data-dmax="96"></div>

France had the worst CFR in April, around 21%. This changed exponentially from mid-May to mid-August, coming to under 0.5% while daily tests grew linearly from about 50 to about 150 per 100 000. Since mid-August it grew slightly, but it still shows values that are under 1%.

## Germany

<div class="fullChart" 
     data-territory="Germany" 
     data-offset="14" 
     data-dmax="4.7"></div>

CFR is quite constant throughout the first wave, during the 8% positivity period as well as May, when it was under 2%. During summer CFR reached values under 1%, and is still around that limit. End of August and whole of September there was a growth in number of cases, but testing numbers staid constant.

<!--div class="fullChart" 
     data-show="cdfa"
     data-territory="Germany" 
     data-offset="0" 
     data-dmax="4.7"></div-->


## Italy

<div class="fullChart" data-territory="Italy" data-offset="4" data-dmax="30"></div>

## Spain

<div class="fullChart" data-territory="Spain" data-offset="6" data-dmax="41"></div>

There were some discontinuities in reported numbers in May and June which make the calculation of CFR very unreliable. 

Looking at testing data, we can see that positivity rate has been quite high, 8% to 12%.

Also, even though daily tests keep rising from July, the CFR calculation is also rising from around 0.3% to over 1% at the end of September.

## United Kingdom

A recent member state

<div class="fullChart" data-territory="United Kingdom" data-offset="0" data-dmax="54"></div>

## Sweden

Sweden is an attractive case to study because it pursued distinctive policies from its neighbours, and most of Europe for that matter. A lack of lockdown resulted lead to a quite different shape of the daily cases curve, so we don't have a . However, if we align curves on , we can presume a four-day offset

<div class="fullChart" data-territory="Sweden" data-offset="4" data-dmax="16"></div>

, reaching 1% in August. Even in September the CRF keeps falling furhter to under 0.5%, even though testing was not increased, and the proportion of positive tests grew from 1 to 5 in 100.

<figure>
  <div id="CfrChangeChart"></div>
  <figcaption>Change of estimated CFR in select European countries from April (orange circle) to September (green circle).</figcaption>
</figure>

Here the CFR scale is linear, and a lot of countries are squeezing very tightly to the 0% line on the right.

Top part shows countries of West EU, with widely different case fatality rates in April, but very low ones in September. CFRs in eastern EU countries are not falling nearly as well. Non-EU countries in the West, such as UK, Switzerland and Norway, are also 