# Drugi val

*Hrvoje Šimić, 28.08.2020.*

Zaraze u Hrvatskoj su dosad dolazile u dva vala. Ako prikažemo podatke s koronavirus.hr
možemo jasno uočiti ta dva vala, ovdje označena različitim bojama:

```vly
width: 500
height: 200
autosize: { type: fit, resize: true }
data:
  name: cases
mark: bar
encoding:
  x:
    field: Datum
    type:  temporal
  y:
    field: "*"
    aggregate: count
    title: broj slučajeva
  color:
    field: wave
    type: nominal
    legend: null
```

Ono što je posebno zanimljivo je analizirati koje dobi su bili zaraženi.
Ako njihovu godinu rođenja oduzmemo od 2020, razdioba po dobi izgleda ovako:

```vly
width: 260
height: 130
autosize: { resize: true }
data:
  name: cases
mark: 
  type: bar
  clip: true
encoding:
  row:
    field: wave
    type:  nominal
    title: null
  color:
    field: wave
    type:  nominal
    legend: null
  x:
    field: age
    type:  quantitative
    title: starost
    scale: {domainMin: 0, domainMax: 100}
  y:
    field: "*"
    aggregate: count
    title: broj slučajeva
```

Očito je prvi val bio puno ravnomjernije raspoređen po dobi. Drugi val ima izražen vrh među mladima.


## Razdioba po starosti stanovništva

Starosna razdioba stanovništva prema procjeni Državnog zavoda za statistiku za 2018. godinu ([PDF](https://www.dzs.hr/Hrv_Eng/publication/2019/07-01-03_01_2019.htm))

```vly
width: 420
height: 150
autosize: { type: fit, resize: true }
data:
  name: agePop
transform:
  - calculate: datum.age > 85
    as: interpolated
mark: {type: "bar", clip: true}
encoding:
  x:
    field: age
    type:  quantitative
    title: starost
    scale: {domainMin: 0, domainMax: 100}
  y:
    field: pop
    type:  quantitative
    title: stanovnika te dobi
  color:
    field: interpolated
    type:  nominal
    scale: {range: ["gray", "lightgray"]}
    legend: null
```

```vly
width: 400
height: 200
autosize: { resize: true }
data: 
  name: ageDistribution
mark: bar
encoding:
  row:
    field: wave
    type:  ordinal
    title: null
  color:
    field:  wave
    type:   nominal
    legend: null
  x:
    field: age
    type:  quantitative
    title: starost
    scale: {domainMin: 0, domainMax: 100}
  y:
    field: relCases
    type:  quantitative
    title: broj slučajeva na 1000 stanovnika
```

## Regionalna podjela

Ako podijelimo Hrvatsku na pet dijelova (Slavonija, Dalmacija, zapadne tri županije, Središnja/sjeverna Hrvatska i posebno Grad Zagreb) prema ovoj karti:

<p class="center-align">
  <img src="/story/covid-drugi-val/podrucja-hrvatske.png" title="Karta Hrvatske podijeljene na pet dijelova (Zapad, Jug, Istok, Središnja i Grad Zagreb)" />
</p>

broj slučajeva relativno u odnosu na broj stanovnika u tom slučaju izgleda ovako:

```vly
width: 500
height: 150
autosize: { type: fit, resize: true }
data: {name: zoneWave}
transform:
  - calculate: datum.relCases * 1000
    as: rel1000
mark: bar
encoding:
  x:
    field: rel1000
    type:  quantitative
    title: Slučajeva na 1000 stanovnika
  y:
    field: zoneName
    type:  nominal
    sort:  "-x"
    title: null
  color: 
    field: wave
    type:  nominal
    legend: null
```

Apsolutni brojevi po dijelovima države u prvom i drugom valu:

```vly
width:  130
height: 90
autosize: { resize: true }
data:
  name: cases
mark: 
  type: bar
  clip: true
encoding:
  row:
    field: wave
    type:  nominal
    title: null
  color:
    field: wave
    type:  nominal
    legend: null
  x:
    field: age
    type:  quantitative
    title: starost
    scale: {domainMin: 0, domainMax: 100}
  y:
    field: "*"
    aggregate: count
    title: broj slučajeva
  column:
    field: zoneName
    type:  nominal
    title: null
```

Starosna razdioba stanovništva po županijama, prema popisu stanovništva iz 2011. godine

```vly
width: 150
height: 100
autosize: { resize: true }
data:
  name: countyAgePop
mark: {type: "bar", clip: true}
encoding:
  row:
    field: county
    type:  nominal
  x:
    field: age
    type:  quantitative
    title: starost
  y:
    field: pop
    type:  quantitative
    title: udio
```

