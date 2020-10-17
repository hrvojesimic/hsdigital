# COVID profile

<div class="schart" data-show="cd" data-territory="EU" data-offset="0" data-dmax="30" data-radius="0"></div>

EU correlations between cases and deaths for different offsets for the duration of the first wave (March through May)

```vly
width: 120
height: 120
autosize: { resize: true }
data:
  name: corrCoefs
transform:
  - filter: datum.c == 'EU'
  - filter: datum.q == 0
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
    field: i
    type: quantitative
    title: offset/days
  y:
    field: r
    type: quantitative
    title: Pearson's r
```

When there is no averaging you can notice small waves that represent weekly jumps in correlation of data.

31-day window moving agerage is quite similar to 7-day. The correlation coefficient is somewhat higher because some of the noise gets averaged out. The peak correlation is still at around seven days offset of the daily deaths curve 

```vly
width: 100
height: 100
autosize: { resize: true }
data:
  name: corrCoefs
transform:
  - filter: datum.q == 0
  - filter:
      field: c
      oneOf: [Germany, France, Italy, United Kingdom]
  - calculate: datum.w * 2 + 1
    as: days averaged
mark: line
encoding:
  column:
    field: c
    title: country
    type: nominal
  x:
    field: i
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

## Country charts

<div class="schart" data-territory="EU" data-offset="6" data-dmax="16"></div>
<div class="schart" data-territory="West EU" data-offset="6" data-dmax="17"></div>
<div class="schart" data-territory="East EU" data-offset="10" data-dmax="7.4"></div>

<div class="schart" data-territory="Italy" data-offset="4" data-dmax="10.8"></div>
<div class="schart" data-territory="Spain" data-offset="6" data-dmax="29"></div>
<div class="schart" data-territory="France" data-offset="7" data-dmax="47"></div>
<div class="schart" data-territory="Belgium" data-offset="5" data-dmax="76"></div>
<div class="schart" data-territory="Germany" data-offset="13" data-dmax="2.4"></div>
<div class="schart" data-territory="Czech Republic" data-offset="10" data-dmax="12"></div>
<div class="schart" data-territory="Slovakia" data-offset="12" data-dmax="3"></div>
<div class="schart" data-territory="Finland" data-offset="12" data-dmax="2"></div>
<div class="schart" data-territory="Denmark" data-offset="5" data-dmax="5"></div>
<div class="schart" data-territory="Netherlands" data-offset="4" data-dmax="37"></div>
<div class="schart" data-territory="Greece" data-offset="6" data-dmax="1.8"></div>
<div class="schart" data-territory="Sweden" data-offset="6" data-dmax="16"></div>
<div class="schart" data-territory="Slovenia" data-offset="16" data-dmax="8.5"></div>
<div class="schart" data-territory="Hungary" data-offset="6" data-dmax="14"></div>
<div class="schart" data-territory="Austria" data-offset="13" data-dmax="4"></div>
<div class="schart" data-territory="Romania" data-offset="7" data-dmax="8.6"></div>
<div class="schart" data-territory="Portugal" data-offset="6" data-dmax="4.6"></div>
<div class="schart" data-territory="Poland" data-offset="6" data-dmax="4.9"></div>
<div class="schart" data-territory="Bulgaria" data-offset="7" data-dmax="3"></div>
<div class="schart" data-territory="Croatia" data-offset="18" data-dmax="3.3"></div>

<div class="schart" data-territory="United Kingdom" data-offset="3" data-dmax="33"></div>
<div class="schart" data-territory="Norway" data-offset="15" data-dmax="1.1"></div>
<div class="schart" data-territory="Iceland" data-offset="10" data-dmax="1.2"></div>
<div class="schart" data-territory="Switzerland" data-offset="11" data-dmax="4.9"></div>

<div class="schart" data-territory="Baltic states" data-offset="12" data-dmax="1.3"></div>
<div class="schart" data-territory="Mediterranean EU" data-offset="6" data-dmax="21"></div>
<div class="schart" data-territory="Non-Med EU" data-offset="10" data-dmax="9.4"></div>
<div class="schart" data-territory="Scandinavia" data-offset="10" data-dmax="5.6"></div>

<div class="schart" data-territory="Balkans" data-offset="7" data-dmax="3.4"></div>
<div class="schart" data-territory="Bosnia and Herzegovina" data-offset="3" data-dmax="3.4"></div>
<div class="schart" data-territory="Serbia" data-offset="1" data-dmax="1.12"></div>
<div class="schart" data-territory="Montenegro" data-offset="15" data-dmax="6.6"></div>
<div class="schart" data-territory="Macedonia" data-offset="5" data-dmax="6"></div>
<div class="schart" data-territory="Albania" data-offset="0" data-dmax="2.9"></div>
<div class="schart" data-territory="Moldova" data-offset="8" data-dmax="7"></div>
<div class="schart" data-territory="Belarus" data-offset="0" data-dmax="1"></div>
<div class="schart" data-territory="Ukraine" data-offset="0" data-dmax="1.9"></div>

<div class="schart" data-territory="Ireland" data-offset="8" data-dmax="8.3"></div>
<div class="schart" data-territory="Luxembourg" data-offset="7" data-dmax="4.2"></div>

```vly
width: 100
height: 100
autosize: { resize: true }
data:
  name: corrCoefs
transform:
  - filter:
      field: c
      oneOf: [EU, West EU, East EU, Baltic states]
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