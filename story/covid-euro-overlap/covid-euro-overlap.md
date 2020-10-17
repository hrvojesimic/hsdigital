
<figure id="EuroMapFig">
  <div id="EuroMap">Loading map...</div>
  <figcaption>
    This is Europe
  </figcaption>
</figure>

# Euro overlaps

```vly
width: 100
height: 200
autosize: { resize: true }
data:
  name: corrCoefs
transform:
  - filter:
      field: c
      oneOf: [Italy, Germany, France]
  - filter: 
      field: w
      oneOf: [0, 3, 15]
mark: line
encoding:
  x:
    field: i
    type: quantitative
  color:
    field: c
    type: nominal
  y:
    field: r
    type: quantitative
  column:
    field: w
    type: ordinal
  row:
    field: q
    type: ordinal
```

```vly
width: 100
height: 100
autosize: { resize: true }
data:
  name: cfrs
mark: line
encoding:
  column:
    field: c
    type: nominal
  x:
    field: i
    type: quantitative
  color:
    field: c
    type: nominal
    legend: null
  y:
    field: cfr
    type: quantitative
    scale:
      rangeMax: 0.4
```

```vly
width: 100
height: 100
autosize: { resize: true }
data:
  name: corrCoefs
mark: line
encoding:
  row:
    field: c 
    type: nominal
  column:
    field: q
    type: nominal
  x:
    field: i
    type: quantitative
  color:
    field: w
    type: ordinal
  y:
    field: r
    type: quantitative
```

```vly
width: 100
height: 100
autosize: { resize: true }
data:
  name: corrCoefs
transform:
  - filter:
      field: c
      oneOf: [Germany, France, Italy, United Kingdom]
mark: line
encoding:
  column:
    field: c 
    type: nominal
  row:
    field: q
    type: nominal
  x:
    field: i
    type: quantitative
  color:
    field: w
    type: ordinal
  y:
    field: r
    type: quantitative
```

```vly
width: 100
height: 100
autosize: { resize: true }
data:
  name: corrCoefs
transform:
  - filter:
      field: c
      oneOf: [Croatia, Slovenia, Hungary, Poland]
mark: line
encoding:
  column:
    field: c 
    type: nominal
  row:
    field: q
    type: nominal
  x:
    field: i
    type: quantitative
  color:
    field: w
    type: ordinal
  y:
    field: r
    type: quantitative
```

```vly
width: 100
height: 100
autosize: { resize: true }
data:
  name: corrCoefs
transform:
  - filter:
      field: c
      oneOf: [Sweden, Denmark, Norway, Finland]
mark: line
encoding:
  column:
    field: c 
    type: nominal
  row:
    field: q
    type: nominal
  x:
    field: i
    type: quantitative
  color:
    field: w
    type: ordinal
  y:
    field: r
    type: quantitative
```
<div class="schart" data-territory="Italy" data-offset="4" data-dmax="660"></div>
<div class="schart" data-territory="Spain" data-offset="6" data-dmax="1200"></div>
<div class="schart" data-territory="France" data-offset="7" data-dmax="1750"></div>
<div class="schart" data-territory="Belgium" data-offset="5" data-dmax="225"></div>
<div class="schart" data-territory="Germany" data-offset="13" data-dmax="195"></div>
<div class="schart" data-territory="United Kingdom" data-offset="4" data-dmax="810"></div>
<div class="schart" data-territory="Czechia" data-offset="10" data-dmax="46"></div>
<div class="schart" data-territory="Lithuania" data-offset="7" data-dmax="1.25"></div>
<div class="schart" data-territory="Latvia" data-offset="22" data-dmax="0.57"></div>
<div class="schart" data-territory="Estonia" data-offset="12" data-dmax="1.6"></div>
<div class="schart" data-territory="Slovakia" data-offset="12" data-dmax="3"></div>
<div class="schart" data-territory="Finland" data-offset="12" data-dmax="7.5"></div>
<div class="schart" data-territory="Norway" data-offset="15" data-dmax="6"></div>
<div class="schart" data-territory="Denmark" data-offset="5" data-dmax="16.5"></div>
<div class="schart" data-territory="Netherlands" data-offset="4" data-dmax="150"></div>
<div class="schart" data-territory="Greece" data-offset="6" data-dmax="15"></div>
<div class="schart" data-territory="Sweden" data-offset="6" data-dmax="160"></div>
<div class="schart" data-territory="Slovenia" data-offset="14" data-dmax="5.3"></div>
<div class="schart" data-territory="Hungary" data-offset="6" data-dmax="90"></div>
<div class="schart" data-territory="Austria" data-offset="12" data-dmax="20"></div>
<div class="schart" data-territory="Romania" data-offset="7" data-dmax="87"></div>
<div class="schart" data-territory="Portugal" data-offset="6" data-dmax="29"></div>
<div class="schart" data-territory="Poland" data-offset="8" data-dmax="42"></div>
<div class="schart" data-territory="Bulgaria" data-offset="7" data-dmax="13.5"></div>
<div class="schart" data-territory="Croatia" data-offset="17" data-dmax="10"></div>
