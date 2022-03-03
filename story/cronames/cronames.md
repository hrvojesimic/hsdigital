
```vly.exceptMob
width: 600
height: 100
data:
  url: "/story/cronames/croatian-given-names-by-gender.csv"
  format: {type: csv}
transform:
  - calculate: "substring(datum.gn,2,3)"
    as: last_letter
mark: text
encoding:
  y:
    title: rod
    type: nominal
    field: gender
  x:
    title: broj imena
    type: quantitative
    aggregate: count
    scale: {type: log}
  text:
    type: ordinal
    field: last_letter
  size:
    type: quantitative
    aggregate: count
    scale: {type: log}
    legend: null
  opacity:
    type: quantitative
    aggregate: count
    scale: {type: log}
    legend: null
  color:
    type: nominal
    field: gender
    legend: null
    scale:
      domain: [M, F]
      range: [darkblue, darkred]
```

```vly.exceptMob
width: 600
height: 100
data:
  url: "/story/cronames/croatian-given-names-by-gender.csv"
  format: {type: csv}
transform:
  - calculate: "substring(datum.gn,2,3)"
    as: last_letter
mark: text
encoding:
  y:
    title: rod
    type: nominal
    field: gender
  x:
    title: broj imena
    type: quantitative
    aggregate: count
    scale: {type: log}
  text:
    type: ordinal
    field: last_letter
  size:
    type: quantitative
    aggregate: count
    scale: {type: log}
    legend: null
  opacity:
    type: quantitative
    aggregate: count
    scale: {type: log}
    legend: null
  color:
    type: nominal
    field: gender
    legend: null
    scale:
      domain: [M, F]
      range: [darkblue, darkred]
```

```vly.exceptMob
width: 600
height: 100
data:
  url: "/story/cronames/croatian-given-names-by-gender.csv"
  format: {type: csv}
transform:
  - calculate: "substring(datum.gn, 1,2)"
    as: last_letter
mark: text
encoding:
  y:
    title: rod
    type: nominal
    field: gender
  x:
    title: broj imena
    type: quantitative
    aggregate: count
    scale: {type: log}
  text:
    type: ordinal
    field: last_letter
  size:
    type: quantitative
    aggregate: count
    scale: {type: log}
    legend: null
  opacity:
    type: quantitative
    aggregate: count
    scale: {type: log}
    legend: null
  color:
    type: nominal
    field: gender
    legend: null
    scale:
      domain: [M, F]
      range: [darkblue, darkred]
```

# Rod iz imena

Rod je korisna informacija o čovjeku.

Postoje samo tri opcije: ili je ime muško, ili je žensko, ili nije na popisu.

Ako je 

- ako sam procijenio da je u barem 90% slučajeva osoba s tim imenom određenog roda, onda je ime navedeno uz taj rod
- ako se ime često koristi za oba roda, nije na popisu
- ako nejasno za koji rod se koristi u Hrvatskoj, što je ponekad slučaj sa stranim imenima, nije na popisu
- ako dataset koristi ime koje izgleda kao često ime, samo što sadrži tipfeler, navedeno je kao ime tog roda


<style>
#AllNames.bgwrapper {
  width: 20em;
  margin: auto;
}
#AllNames .tablewrapper {
  height: 20em;
  overflow: auto;
  ,
}
</style>

```backgrid#AllNames
url: "/data/cronames"
filterBy: gn
columns:
  - name: gn
    label: Ime
    cell: string
  - name: gender
    label: Rod
    cell: string
```

```vly.exceptMob
width: 600
height: 100
data:
  url: "/story/cronames/croatian-given-names-by-gender.csv"
  format: {type: csv}
mark:
  type: bar
  height: 5
encoding:
  x:
    title: broj imena
    type: quantitative
    aggregate: count
  y:
    title: rod
    type: nominal
    field: gender
  color:
    type: nominal
    field: gender
    legend: null
    scale:
      domain: [M, F]
      range: [darkblue, darkred]
```
```vly.onlyMob
width: 100
height: 300
data:
  url: "/story/cronames/croatian-given-names-by-gender.csv"
  format: {type: csv}
mark:
  type: bar
  width: 10
encoding:
  y:
    title: broj imena
    type: quantitative
    aggregate: count
  x:
    title: rod
    type: nominal
    field: gender
  color:
    type: nominal
    field: gender
    legend: null
    scale:
      domain: [M, F]
      range: [darkblue, darkred]
```

Zadnje slovo imena se jako razlikuje po rodu:

```vly.exceptMob
width: 600
height: 100
data:
  url: "/story/cronames/croatian-given-names-by-gender.csv"
  format: {type: csv}
transform:
  - calculate: "substring(datum.gn, length(datum.gn)-1)"
    as: last_letter
mark: text
encoding:
  y:
    title: rod
    type: nominal
    field: gender
  x:
    title: broj imena
    type: quantitative
    aggregate: count
    scale: {type: log}
  text:
    type: ordinal
    field: last_letter
  size:
    type: quantitative
    aggregate: count
    scale: {type: log}
    legend: null
  opacity:
    type: quantitative
    aggregate: count
    scale: {type: log}
    legend: null
  color:
    type: nominal
    field: gender
    legend: null
    scale:
      domain: [M, F]
      range: [darkblue, darkred]
```
```vly.onlyMob
width: 150
height: 500
data:
  url: "/story/cronames/croatian-given-names-by-gender.csv"
  format: {type: csv}
transform:
  - calculate: "substring(datum.gn, length(datum.gn)-1)"
    as: last_letter
mark: text
encoding:
  x:
    title: rod
    type: nominal
    field: gender
  y:
    title: broj imena
    type: quantitative
    aggregate: count
    scale: {type: log}
  text:
    type: ordinal
    field: last_letter
  size:
    type: quantitative
    aggregate: count
    scale: {type: log}
    legend: null
  opacity:
    type: quantitative
    aggregate: count
    scale: {type: log}
    legend: null
  color:
    type: nominal
    field: gender
    legend: null
    scale:
      domain: [M, F]
      range: [darkblue, darkred]
```

Duljina imena kao brojke:

```vly.exceptMob
width: 30
height: 200
data:
  url: "/story/cronames/croatian-given-names-by-gender.csv"
  format: {type: csv}
transform:
  - calculate: "length(datum.gn)"
    as: name_length
mark: bar
encoding:
  column:
    title: duljina imena
    type: ordinal
    field: name_length
  x:
    title: null
    axis: null
    type: nominal
    field: gender
  y:
    title: broj imena tolike duljine
    type: quantitative
    aggregate: count
  color:
    title: rod
    type: nominal
    field: gender
    scale:
      domain: [M, F]
      range: [steelblue, red]
config:
  facet: {spacing: 6}
```
```vly.onlyMob
width: 15
height: 150
data:
  url: "/story/cronames/croatian-given-names-by-gender.csv"
  format: {type: csv}
transform:
  - calculate: "length(datum.gn)"
    as: name_length
mark: bar
encoding:
  column:
    title: duljina imena
    type: ordinal
    field: name_length
  x:
    title: null
    axis: null
    type: nominal
    field: gender
  y:
    title: broj imena tolike duljine
    type: quantitative
    aggregate: count
  color:
    title: rod
    type: nominal
    field: gender
    scale:
      domain: [M, F]
      range: [steelblue, red]
config:
  facet: {spacing: 2}
  legend:
    offset: -40
    fillColor: white
    padding: 8
```
