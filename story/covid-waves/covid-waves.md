# Valovi zaraze

*Hrvoje Šimić, 25.08.2020.*


```vly.exceptMob
width: 600
height: 60
data:
  url: "/story/covid-waves/covid-weekly.csv"
  format: {type: csv}
transform:
  - {timeUnit: utcmonthdate, field: date, as: md}
  - filter: "datum.country == 'Spain'"
  - calculate: "(datum.date < 1582934400000)? '' : timeFormat(datum.date, '%d.%m.')"
    as: dateLabel
layer:
  - mark: circle
    encoding:
      x:
        field: cases
        type: quantitative
        title: broj potvrđenih slučajeva u Španjolskoj na određeni datum
      y:
        type: nominal
        field: zemlja
        title: null
        axis: null
      size: {value: 250}
      color:
        type: nominal
        field: zemlja
        legend: null
      tooltip:
        - field: dateLabel
          title: datum
          type: nominal
        - field: cases
          title: potvrđenih slučajeva (kumulativno)
          type: quantitative
  - mark: {type: text, dy: 16}
    encoding:
      x:
        field: cases
        type: quantitative
      y:
        type: nominal
        field: zemlja
        axis: null
      size: {value: 12}
      text: 
        field: dateLabel
        type: nominal
      color:
        type: nominal
        field: zemlja
        legend: null
```

