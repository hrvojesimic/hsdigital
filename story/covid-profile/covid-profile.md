<!--
<div class="schart" data-territory="Iberia" data-offset="6" data-dmax="31.3"></div>
<div class="schart" data-territory="EU" data-offset="7" data-dmax="21.5"></div>
<div class="schart" data-territory="West EU" data-offset="7" data-dmax="22.6"></div>
<div class="schart" data-territory="East EU" data-offset="10" data-dmax="11"></div>
-->
<div class="schart" data-territory="Italy" data-offset="13" data-dmax="11.4"></div>

<div class="schart" data-territory="Spain" data-offset="12" data-dmax="7"></div>

<div class="schart" data-territory="France" data-offset="15" data-dmax="8.5"></div>

<div class="schart" data-territory="Belgium" data-offset="15" data-dmax="15"></div>

<div class="schart" data-territory="Germany" data-offset="15" data-dmax="4.6"></div>

<div class="schart" data-territory="Croatia" data-offset="12" data-dmax="15.9"></div>
<div class="schart" data-territory="Slovenia" data-offset="16" data-dmax="19"></div>
<div class="schart" data-territory="Hungary" data-offset="12" data-dmax="16"></div>
<div class="schart" data-territory="Austria" data-offset="16" data-dmax="11.8"></div>

<!--
<div class="schart" data-territory="Czech Republic" data-offset="10" data-dmax="20"></div>
<div class="schart" data-territory="Slovakia" data-offset="12" data-dmax="4"></div>
<div class="schart" data-territory="Finland" data-offset="12" data-dmax="2.3"></div>
<div class="schart" data-territory="Denmark" data-offset="4" data-dmax="4.9"></div>
<div class="schart" data-territory="Netherlands" data-offset="4" data-dmax="51"></div>
<div class="schart" data-territory="Greece" data-offset="6" data-dmax="2"></div>
<div class="schart" data-territory="Sweden" data-offset="4" data-dmax="15"></div>
<div class="schart" data-territory="Romania" data-offset="7" data-dmax="11"></div>
<div class="schart" data-territory="Portugal" data-offset="6" data-dmax="6.3"></div>
<div class="schart" data-territory="Poland" data-offset="6" data-dmax="8"></div>
<div class="schart" data-territory="Bulgaria" data-offset="28" data-dmax="9"></div>
<div class="schart" data-territory="United Kingdom" data-offset="3" data-dmax="44"></div>
<div class="schart" data-territory="Norway" data-offset="15" data-dmax="1.14"></div>
<div class="schart" data-territory="Iceland" data-offset="10" data-dmax="1.3"></div>
<div class="schart" data-show="cdf" data-territory="Switzerland" data-offset="10" data-dmax="10.6"></div>
<div class="schart" data-territory="Baltic states" data-offset="12" data-dmax="1.6"></div>
<div class="schart" data-territory="Mediterranean EU" data-offset="6" data-dmax="29"></div>
<div class="schart" data-territory="Non-Med EU" data-offset="10" data-dmax="13.3"></div>
<div class="schart" data-territory="Scandinavia" data-offset="10" data-dmax="5,9"></div>
<div class="schart" data-show="cdf" data-territory="Balkans" data-offset="7" data-dmax="4"></div>
<div class="schart" data-show="cdf" data-territory="Bosnia and Herzegovina" data-offset="3" data-dmax="4.2"></div>
<div class="schart" data-show="cdf" data-territory="Serbia" data-offset="1" data-dmax="1.12"></div>
<div class="schart" data-show="cdf" data-territory="Montenegro" data-offset="15" data-dmax="9"></div>
<div class="schart" data-show="cdf" data-territory="Macedonia" data-offset="5" data-dmax="11"></div>
<div class="schart" data-show="cdf" data-territory="Albania" data-offset="0" data-dmax="3.3"></div>
<div class="schart" data-show="cdf" data-territory="Moldova" data-offset="8" data-dmax="9"></div>
<div class="schart" data-show="cdf" data-territory="Belarus" data-offset="0" data-dmax="1"></div>
<div class="schart" data-show="cdf" data-territory="Ukraine" data-offset="0" data-dmax="4"></div>
<div class="schart" data-territory="Ireland" data-offset="8" data-dmax="13"></div>
<div class="schart" data-territory="Luxembourg" data-offset="7" data-dmax="5.2"></div>
-->

```vly
width: 100
height: 100
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
  x:
    field: offset
    type: quantitative
    title: offset/days
  color:
    field: days averaged
    type: ordinal
  y:
    field: r
    type: quantitative
    title: Pearson's r
```
<!--
```vly
width: 100
height: 100
autosize: { resize: true }
data:
  name: waveCorrelations
transform:
  - filter:
      field: country
      oneOf: [Sweden, Belarus, Serbia, United Kingdom]
  - calculate: datum.w * 2 + 1
    as: days averaged
mark: 
  type: line
  clip: true
encoding:
  column:
    field: country
    type: nominal
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

```vly
width: 100
height: 100
autosize: { resize: true }
data:
  name: waveCorrelations
transform:
  - filter:
      field: country
      oneOf: [Albania, Ukraine, Poland, Denmark]
  - calculate: datum.w * 2 + 1
    as: days averaged
mark: 
  type: line
  clip: true
encoding:
  column:
    field: country
    type: nominal
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

```vly
width: 100
height: 100
autosize: { resize: true }
data:
  name: waveCorrelations
transform:
  - filter:
      field: country
      oneOf: [Latvia, Luxembourg, Lithuania, Iceland]
  - calculate: datum.w * 2 + 1
    as: days averaged
mark: 
  type: line
  clip: true
encoding:
  column:
    field: country
    type: nominal
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
      domainMin: 0
      domainMax: 1
```

```vly
width: 100
height: 100
autosize: { resize: true }
data:
  name: waveCorrelations
transform:
  - filter:
      field: country
      oneOf: [Norway, Switzerland, Austria, Belgium]
  - calculate: datum.w * 2 + 1
    as: days averaged
mark: line
encoding:
  column:
    field: country
    type: nominal
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

<figure id="OffsetMapFig" style="max-width: 500px; margin: auto">
  <div id="OffsetMap">Loading map...</div>
  <figcaption>
    The larger the offset, the darker the color: zero offset is white.
    Countries with greater correlation coefficient are more saturated with the red color.
  </figcaption>
</figure>

```vly
width: 290
height: 480
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
```

<div id="Ridge"></div>
-->