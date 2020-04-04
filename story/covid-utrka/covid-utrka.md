# Mrtva trka

*Hrvoje Šimić, 16.03.2020.* - *prepravljeno 18.03.2020. (vidi bilješku na dnu)*

<p class="low-key card-panel orange lighten-4">
<b>17.03. Čitatelju, čuvaj se!</b> Autor ovih redaka nije stručnjak za epidemiologiju, niti ima dovoljno znanja ili iskustva da autoritativno govori o ovoj temi. Iako izneseni u najboljoj namjeri, neki od zaključaka koji se ovdje sugeriraju ili nameću su možda potpuno krivi! Ako želite više znati o napretku pandemije toplo savjetujem da čitate što o tome pišu stručnjaci.
</p>

<p class="low-key card-panel yellow lighten-4">
Svi se mi nadamo da nekako možemo stvarno predvidjeti što će se dogoditi s pandemijom Covid-19, no ti pokušaji su daleko od savršenih. Ovaj članak nije nikakav poseban uvid u budućnost, nego samo pokušaj vizualizacije službenih podataka o registriranim slučajevima zaraze, u mom slučaju od <a href="https://github.com/CSSEGISandData/COVID-19">Sveučilišta Johns Hopkins</a>. Ako ti podaci ne reflektiraju stvarno stanje na terenu, ni vizualizacije neće pomoći. Zato uzmite ove usporedbe zemalja sa zrnom soli.
</p>

<span class="dropcap">N</span>ajgora stvar u vezi epidemija je što vam se prikradu. Pogledajte kakva je bila situacija u Španjolskoj zadnja četiri vikenda. Počelo je poprilično blago. Prije tri tjedna bila su tek dva potvrđena slučaja Covida-19. Vikend poslije, 84. Vikend poslije toga već ih je 673. A onda, jučer, skoro *osam tisuća*!

```vly.exceptMob
width: 600
height: 60
data:
  url: "/story/covid-utrka/covid-weekly.csv"
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

```vly.onlyMob
width: 60
height: 400
data:
  url: "/story/covid-utrka/covid-weekly.csv"
  format: {type: csv}
transform:
  - {timeUnit: utcmonthdate, field: date, as: md}
  - filter: "datum.country == 'Spain'"
  - calculate: "(datum.date < 1582934400000)? '' : timeFormat(datum.date, '%d.%m.')"
    as: dateLabel
layer:
  - mark: circle
    encoding:
      y:
        field: cases
        type: quantitative
        title: broj potvrđenih slučajeva u Španjolskoj na određeni datum
      x:
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
  - mark: {type: text, dx: 10, align: left}
    encoding:
      y:
        field: cases
        type: quantitative
      x:
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

Prikazati rane brojeve epidemije na brojevnoj crti je nezahvalno jer ih je u usporedbi s onim kasnijim teško razaznati od nule. Toliko se stišću jedno uz drugo da im se oznake preklapaju. No ti mali brojevi, zgurani u dnu brojevne crte, imaju veliku važnost. Oni predstavljaju sjeme zla. Njihovo ponašanje u malom može otkriti kako će se virus ponašati kad se epidemija razbukta. Mogu predvidjeti budućnost.

No u ljudskoj prirodi je da ignorira te male promjene. Jednostavno smo tako evoluirali. Kad naš mozak pokuša predvidjeti koliko će se brzo nastaviti kretati neki trend, on samo interpolira na temelju dotadašnje brzine. Ako je dotadašnja brzina bila mala, jednostavno se ne može uživjeti kako situacija može postati bitno drugačija, doslovno *preko noći*.

Zato je preglednije, a nekad i primjerenije, epidemiju u ranoj fazi prikazati na ovakvoj skali:

```vly.exceptMob
width: 600
height: 30
data:
  url: "/story/covid-utrka/size-desc.csv"
  format: {type: csv}
mark: text
encoding:
  x:
    field: size
    type: quantitative
    title: broj ljudi
    scale: {type: log}
```

```vly.onlyMob
width: 75
height: 300
data:
  url: "/story/covid-utrka/size-desc.csv"
  format: {type: csv}
mark: text
encoding:
  y:
    field: size
    type: quantitative
    title: broj ljudi
    scale: {type: log}
```

Ova skala je logaritamska. Na njoj je broj 100 jednako udaljen od deset i od tisuću. 

Logaritamska skala je zgodna zato što na njoj možemo pregledno prikazati brojeve različitih redova veličine. Možemo usporediti koliko ljudi stane na bicikl s brojem ljudi koji će zatrpati košarkašku dvoranu, ili veliki stadion. Drugim riječima, umjesto ovog:

```vly.exceptMob
width: 600
height: 30
data:
  url: "/story/covid-utrka/size-desc.csv"
  format: {type: csv}
layer:
  - mark:
      type: text
      fontSize: 15
      fontWeight: bold
    encoding:
      x:
        field: size
        type: quantitative
        title: koliko ljudi stane u...
      text: 
        field: label
        type: nominal
      color: 
        field: label
        type: nominal
        legend: null
      tooltip: 
        field: desc
        type: nominal
```

```vly.onlyMob
width: 75
height: 300
data:
  url: "/story/covid-utrka/size-desc.csv"
  format: {type: csv}
layer:
  - mark:
      type: text
      fontSize: 20
      fontWeight: bold
    encoding:
      y:
        field: size
        type: quantitative
        title: koliko ljudi stane u...
      text: 
        field: label
        type: nominal
      color: 
        field: label
        type: nominal
        legend: null
      tooltip: 
        field: desc
        type: nominal
```

imamo ovo:

```vly.exceptMob
width: 600
height: 30
data:
  url: "/story/covid-utrka/size-desc.csv"
  format: {type: csv}
layer:
  - mark:
      type: text
      fontSize: 15
      fontWeight: bold
    encoding:
      x:
        field: size
        type: quantitative
        title: koliko ljudi stane u...
        scale: {type: log}
      text: 
        field: label
        type: nominal
      color: 
        field: label
        type: nominal
        legend: null
      tooltip: 
        field: desc
        type: nominal
```

```vly.onlyMob
width: 75
height: 300
data:
  url: "/story/covid-utrka/size-desc.csv"
  format: {type: csv}
layer:
  - mark:
      type: text
      fontSize: 20
      fontWeight: bold
    encoding:
      y:
        field: size
        type: quantitative
        title: koliko ljudi stane u...
        scale: {type: log}
      text: 
        field: label
        type: nominal
      color: 
        field: label
        type: nominal
        legend: null
      tooltip: 
        field: desc
        type: nominal
```

U fazi eksponencijalnog rasta, točka koja predstavlja trenutnu veličinu putuje *jednolikom brzinom* po ovoj logaritamskoj skali. Ako joj je trebalo tjedan dana da se probije od deset do sto, trebat će joj još jedan tjedan da dođe do tisuću, i onda još jedan do deset tisuća.

Ako posljednje četiri subote gledamo na logaritamskoj skali, prosječan rast detektiranih slučaja Covida-19 u Španjolskoj pokazuje skoro pa ravnomjernu brzinu promjene:

```vly.exceptMob
width: 600
height: 60
data:
  url: "/story/covid-utrka/covid-weekly.csv"
  format: {type: csv}
transform:
  - {timeUnit: utcmonthdate, field: date, as: md}
  - calculate: "timeFormat(datum.date, '%d.%m.')"
    as: dateLabel
  - filter: "datum.country == 'Spain'"
layer:
  - mark: circle
    encoding:
      x:
        field: cases
        type: quantitative
        scale: 
          type: log
          domain: [1,100000]
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
        - field: zemlja
          type: nominal
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

```vly.onlyMob
width: 80
height: 600
data:
  url: "/story/covid-utrka/covid-weekly.csv"
  format: {type: csv}
transform:
  - {timeUnit: utcmonthdate, field: date, as: md}
  - calculate: "timeFormat(datum.date, '%d.%m.')"
    as: dateLabel
  - filter: "datum.country == 'Spain'"
layer:
  - mark: circle
    encoding:
      y:
        field: cases
        type: quantitative
        scale: 
          type: log
          domain: [1,100000]
        title: broj potvrđenih slučajeva u Španjolskoj na određeni datum
      x:
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
        - field: zemlja
          type: nominal
        - field: dateLabel
          title: datum
          type: nominal
        - field: cases
          title: potvrđenih slučajeva (kumulativno)
          type: quantitative
  - mark: {type: text, dy: 16}
    encoding:
      y:
        field: cases
        type: quantitative
      x:
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

Na ovakvoj slici mali brojevi se više ne čine toliko nebitni. Iz ovako predstavljenog trenda možemo lakše predvidjeti opasnost rasta broja zaraženih na preko 20 tisuća u samo par dana.

Eksponencijalni rast nije ništa specifično za Španjolsku. Pogledajte zadnjih četiri-pet subota u zemljama koje su imala najveće epidemije u tom periodu:

```vly.exceptMob
width: 600
height: 200
data:
  url: "/story/covid-utrka/covid-weekly.csv"
  format: {type: csv}
transform:
  - {timeUnit: utcmonthdate, field: date, as: md}
  - calculate: "datum.country == 'South Korea' && datum.date == 1583625600000"
    as: crowded
  - calculate: "datum.crowded? '' : timeFormat(datum.date, '%d.%m.')"
    as: dateLabel
  - filter:
      field: country
      oneOf:
        - South Korea
        - Italy
        - Iran
layer:
  - mark: circle
    encoding:
      x:
        field: cases
        type: quantitative
        scale: 
          type: log
          domain: [1,100000]
        title: broj potvrđenih slučajeva na određeni datum
      y:
        type: nominal
        field: zemlja
        title: null
        axis: {labelFontSize: 13}
      size: {value: 250}
      color:
        type: nominal
        field: zemlja
        legend: null
        scale:
          domain: ["Južna Koreja", "Italija", "Iran"]
          range: ["#D68910", "#1A5276", "#1D8348"]
      tooltip:
        - field: zemlja
          type: nominal
        - field: dateLabel
          title: datum
          type: nominal
        - field: cases
          title: potvrđenih slučajeva (kumulativno)
          type: quantitative
  - mark: 
      type: text
      dy: 16
    encoding:
      x:
        field: cases
        type: quantitative
      y:
        type: nominal
        field: zemlja
        axis: null
      size: 
        value: 12
      text: 
        field: dateLabel
        type: nominal
      color:
        type: nominal
        field: zemlja
        legend: null
  - mark: bar
    encoding:
      x:
        field: cases
        type: quantitative
      y:
        type: nominal
        field: zemlja
        axis: null
      color:
        type: nominal
        field: zemlja
        legend: null
config: 
  bar: {discreteBandSize: 2}
```

```vly.onlyMob
width: 200
height: 500
data:
  url: "/story/covid-utrka/covid-weekly.csv"
  format: {type: csv}
transform:
  - {timeUnit: utcmonthdate, field: date, as: md}
  - calculate: "datum.country == 'South Korea' && datum.date == 1583625600000"
    as: crowded
  - calculate: "datum.crowded? '' : timeFormat(datum.date, '%d.%m.')"
    as: dateLabel
  - filter:
      field: country
      oneOf:
        - South Korea
        - Italy
        - Iran
layer:
  - mark: circle
    encoding:
      y:
        field: cases
        type: quantitative
        scale: 
          type: log
          domain: [1,100000]
        title: broj potvrđenih slučajeva na određeni datum
      x:
        type: nominal
        field: zemlja
        title: null
        axis: {labelFontSize: 13}
      size: {value: 250}
      color:
        type: nominal
        field: zemlja
        legend: null
        scale:
          domain: ["Južna Koreja", "Italija", "Iran"]
          range: ["#D68910", "#1A5276", "#1D8348"]
      tooltip:
        - field: zemlja
          type: nominal
        - field: dateLabel
          title: datum
          type: nominal
        - field: cases
          title: potvrđenih slučajeva (kumulativno)
          type: quantitative
  - mark: 
      type: text
      align: left
      dx: 10
    encoding:
      y:
        field: cases
        type: quantitative
      x:
        type: nominal
        field: zemlja
        axis: null
      size: 
        value: 12
      text: 
        field: dateLabel
        type: nominal
      color:
        type: nominal
        field: zemlja
        legend: null
  - mark: bar
    encoding:
      y:
        field: cases
        type: quantitative
      x:
        type: nominal
        field: zemlja
        axis: null
      color:
        type: nominal
        field: zemlja
        legend: null
config: 
  bar: {discreteBandSize: 2}
```

U zadnjem tjednu već vidimo popuštanje eksponencijalnog rasta. Prvih tjedana su oznake podjednako razmaknute, no kako ulaze u desetke tisuća, počinju se ponegdje skupljati. Eksplozivna priroda epidemije se mijenja, ~~ona dolazi do svojih prirodnih granica kad populacija stječe kakav-takav imunitet i~~ kad javnozdravstvene mjere počinju davati učinka.

Na primjeru zemalja Dalekog istoka možemo vidjeti kako je ~~progresija bolesti~~ *stopa eksponencijalnog rasta* uspješno smanjena. Kina se na logaritamskoj skali praktički nije pomakla u zadnjih tjedan dana, jer je broj novih slučajeva zanemariv u usporedbi s onim što su bili nagomilali u prethodna dva mjeseca. No i okolne zemlje, pogotovo Japan, Južna Koreja, Singapur i Tajvan, *iako su apsolutne vrijednosti novozaraženih visoke, na logaritamskoj skali* imaju relativno male pomake u odnosu na prethodni vikend. Taj pomak u zadnjih tjedan dana sam označio crtom:

```vly.exceptMob
width: 600
height: 150
data:
  url: "/story/covid-race/covid-race-03-15.csv"
  format: {type: csv}
transform:
  - filter:
      field: country
      oneOf:
        - South Korea
        - Singapore
        - Japan
        - China
        - Taiwan
layer:
  - mark: circle
    encoding:
      x:
        field: now
        title: broj potvrđenih slučajeva 15.3. i tjedan ranije
        type: quantitative
        scale: 
          type: log
          domain: [1,100000]
      y:
        type: nominal
        field: zemlja
        axis: null
      size: {value: 250}
      color:
        type: nominal
        field: zemlja
        legend: null
      tooltip:
        - field: zemlja
          type: nominal
        - field: before
          title: broj slučajeva 8.3.
          type: quantitative
        - field: now
          title: broj slučajeva 15.3.
          type: quantitative
  - mark: 
      type: text
      align: left
      dx: 10
      baseline: middle
    encoding:
      x:
        field: now
        type: quantitative
      y:
        type: nominal
        field: zemlja
        axis: null
      size: 
        value: 18
      text: 
        field: zemlja
        type: nominal
      color:
        type: nominal
        field: zemlja
        legend: null
  - mark: bar
    encoding:
      x:
        field: before
        type: quantitative
      x2:
        field: now
      y:
        type: nominal
        field: zemlja
        axis: null
      color:
        type: nominal
        field: zemlja
        legend: null
config: 
  bar: {discreteBandSize: 4}
```

```vly.onlyMob
width: 200
height: 600
data:
  url: "/story/covid-race/covid-race-03-15.csv"
  format: {type: csv}
transform:
  - filter:
      field: country
      oneOf:
        - South Korea
        - Singapore
        - Japan
        - China
        - Taiwan
layer:
  - mark: circle
    encoding:
      y:
        field: now
        title: broj potvrđenih slučajeva 15.3. i tjedan ranije
        type: quantitative
        scale: 
          type: log
          domain: [1,100000]
      x:
        type: nominal
        field: zemlja
        axis: null
      size: {value: 250}
      color:
        type: nominal
        field: zemlja
        legend: null
      tooltip:
        - field: zemlja
          type: nominal
        - field: before
          title: broj slučajeva 8.3.
          type: quantitative
        - field: now
          title: broj slučajeva 15.3.
          type: quantitative
  - mark: 
      type: text
      angle: -90
      align: left
      dx: 10
      baseline: middle
    encoding:
      y:
        field: now
        type: quantitative
      x:
        type: nominal
        field: zemlja
        axis: null
      size: 
        value: 18
      text: 
        field: zemlja
        type: nominal
      color:
        type: nominal
        field: zemlja
        legend: null
  - mark: bar
    encoding:
      y:
        field: before
        type: quantitative
      y2:
        field: now
      x:
        type: nominal
        field: zemlja
        axis: null
      color:
        type: nominal
        field: zemlja
        legend: null
config: 
  bar: {discreteBandSize: 4}
```

S druge strane, Zapadnoeuropske zemlje ne pokazuju tu tendenciju usporavanja. Njihove crte su puno duže, odajući peterostruko ili deseterostruko povećanje broja zaraženih:

```vly.exceptMob
width: 600
height: 340
data:
  url: "/story/covid-race/covid-race-03-15.csv"
  format: {type: csv}
transform:
  - calculate: "ceil(datum.now / datum.before) + '×'"
    as: multiplicity
  - filter:
      field: country
      oneOf:
        - Austria
        - Germany
        - France
        - Spain
        - Sweden
        - Finland
        - Switzerland
        - Italy
        - Norway
        - Belgium
        - Netherlands
        - Denmark
        - United Kingdom
layer:
  - mark: circle
    encoding:
      x:
        field: now
        title: broj potvrđenih slučajeva 15.3. i tjedan ranije
        type: quantitative
        scale: 
          type: log
          domain: [1,100000]
      y:
        type: nominal
        field: zemlja
        axis: null
      size: {value: 250}
      color:
        type: nominal
        field: zemlja
        legend: null
      tooltip:
        - field: zemlja
          type: nominal
        - field: before
          title: broj slučajeva 8.3.
          type: quantitative
        - field: now
          title: broj slučajeva 15.3.
          type: quantitative
        - field: multiplicity
          title: uvećanje
          type: nominal
  - mark: 
      type: text
      align: left
      dx: 10
      baseline: middle
    encoding:
      x:
        field: now
        type: quantitative
      y:
        type: nominal
        field: zemlja
        axis: null
      size: 
        value: 18
      text: 
        field: zemlja
        type: nominal
      color:
        type: nominal
        field: zemlja
        legend: null
  - mark: bar
    encoding:
      x:
        field: before
        type: quantitative
      x2:
        field: now
      y:
        type: nominal
        field: zemlja
        axis: null
      color:
        type: nominal
        field: zemlja
        legend: null
config: 
  bar: {discreteBandSize: 4}
```

```vly.onlyMob
width: 270
height: 600
data:
  url: "/story/covid-race/covid-race-03-15.csv"
  format: {type: csv}
transform:
  - calculate: "ceil(datum.now / datum.before) + '×'"
    as: multiplicity
  - filter:
      field: country
      oneOf:
        - Austria
        - Germany
        - France
        - Spain
        - Sweden
        - Finland
        - Switzerland
        - Italy
        - Norway
        - Belgium
        - Netherlands
        - Denmark
        - United Kingdom
layer:
  - mark: circle
    encoding:
      y:
        field: now
        title: broj potvrđenih slučajeva 15.3. i tjedan ranije
        type: quantitative
        scale: 
          type: log
          domain: [1,100000]
      x:
        type: nominal
        field: zemlja
        axis: null
      size: {value: 250}
      color:
        type: nominal
        field: zemlja
        legend: null
      tooltip:
        - field: zemlja
          type: nominal
        - field: before
          title: broj slučajeva 8.3.
          type: quantitative
        - field: now
          title: broj slučajeva 15.3.
          type: quantitative
        - field: multiplicity
          title: uvećanje
          type: nominal
  - mark: 
      type: text
      angle: -90
      align: left
      dx: 10
      baseline: middle
    encoding:
      y:
        field: now
        type: quantitative
      x:
        type: nominal
        field: zemlja
        axis: null
      size: 
        value: 18
      text: 
        field: zemlja
        type: nominal
      color:
        type: nominal
        field: zemlja
        legend: null
  - mark: bar
    encoding:
      y:
        field: before
        type: quantitative
      y2:
        field: now
      x:
        type: nominal
        field: zemlja
        axis: null
      color:
        type: nominal
        field: zemlja
        legend: null
config: 
  bar: {discreteBandSize: 4}
```

U zemljama u našem okruženju i na istoku Europe nije se toliko razmahala zaraza, ali su faktori uvećanja u zadnjih tjedan dana svejedno ogromni.

```vly.exceptMob
width: 600
height: 280
data:
  url: "/story/covid-race/covid-race-03-15.csv"
  format: {type: csv}
transform:
  - calculate: "ceil(datum.now / datum.before) + '×'"
    as: multiplicity
  - filter:
      field: country
      oneOf:
        - Croatia
        - Slovenia
        - Hungary
        - Bosnia and Herzegovina
        - Serbia
        - Albania
        - Slovakia
        - Czechia
        - Poland
        - Greece
layer:
  - mark: circle
    encoding:
      x:
        field: now
        title: broj potvrđenih slučajeva 15.3. i tjedan ranije
        type: quantitative
        scale: 
          type: log
          domain: [1,100000]
      y:
        type: nominal
        field: zemlja
        axis: null
      size: {value: 250}
      color:
        type: nominal
        field: zemlja
        legend: null
      tooltip:
        - field: zemlja
          type: nominal
        - field: before
          title: broj slučajeva 8.3.
          type: quantitative
        - field: now
          title: broj slučajeva 15.3.
          type: quantitative
        - field: multiplicity
          title: uvećanje
          type: nominal
  - mark: 
      type: text
      align: left
      dx: 10
      baseline: middle
    encoding:
      x:
        field: now
        type: quantitative
      y:
        type: nominal
        field: zemlja
        axis: null
      size: 
        value: 18
      text: 
        field: zemlja
        type: nominal
      color:
        type: nominal
        field: zemlja
        legend: null
  - mark: bar
    encoding:
      x:
        field: before
        type: quantitative
      x2:
        field: now
      y:
        type: nominal
        field: zemlja
        axis: null
      color:
        type: nominal
        field: zemlja
        legend: null
config: 
  bar: {discreteBandSize: 4}
```

```vly.onlyMob
width: 250
height: 600
data:
  url: "/story/covid-race/covid-race-03-15.csv"
  format: {type: csv}
transform:
  - calculate: "ceil(datum.now / datum.before) + '×'"
    as: multiplicity
  - filter:
      field: country
      oneOf:
        - Croatia
        - Slovenia
        - Hungary
        - Bosnia and Herzegovina
        - Serbia
        - Albania
        - Slovakia
        - Czechia
        - Poland
        - Greece
layer:
  - mark: circle
    encoding:
      y:
        field: now
        title: broj potvrđenih slučajeva 15.3. i tjedan ranije
        type: quantitative
        scale: 
          type: log
          domain: [1,100000]
      x:
        type: nominal
        field: zemlja
        axis: null
      size: {value: 250}
      color:
        type: nominal
        field: zemlja
        legend: null
      tooltip:
        - field: zemlja
          type: nominal
        - field: before
          title: broj slučajeva 8.3.
          type: quantitative
        - field: now
          title: broj slučajeva 15.3.
          type: quantitative
        - field: multiplicity
          title: uvećanje
          type: nominal
  - mark: 
      type: text
      angle: -90
      align: left
      dx: 10
      baseline: middle
    encoding:
      y:
        field: now
        type: quantitative
      x:
        type: nominal
        field: zemlja
        axis: null
      size: 
        value: 18
      text: 
        field: zemlja
        type: nominal
      color:
        type: nominal
        field: zemlja
        legend: null
  - mark: bar
    encoding:
      y:
        field: before
        type: quantitative
      y2:
        field: now
      x:
        type: nominal
        field: zemlja
        axis: null
      color:
        type: nominal
        field: zemlja
        legend: null
config: 
  bar: {discreteBandSize: 4}
```

~~A vidjeli smo kako su ti "repovi" u stvari važniji nego koliko smo daleko došli u ovoj "utrci". Iako nas mediji hrane apsolutnim brojevima, ti mali brojevi kriju informaciju o zamahu epidemije.~~

Hrvatska je od usporedivih zemalja napravila najmanji skok *na logaritamskoj skali*, pa nas to može malo utješiti. Ako se isti eksponencijalni rast nastavi (što valjda neće!), sljedeći tjedan bi nam donio pet puta veće brojeve zaraženih. Ako vam to zvuči strašno, isti faktor rasta u Sloveniji je trenutno 14, a u Srbiji čak 48!

~~Baš ove rane faze mogu biti dobar pokazatelj koliko je zemlja u opasnosti, koliko lako propušta virus unutar svojih granica, kako se njeni građani ponašaju, koliko su njene mjere borbe protiv Covida učinkovite. Jednom razmahanu epidemiju nije tako lako zauzdati. Baš se ta rana, eksplozivna faza epidemije zna kasnije pokazati kritičnom, pogotovo zato što nam po apsolutnim brojevima baš i ne izgleda kao eksplozija.~~

<p class="low-key card-panel orange lighten-4">
<b>18.03.</b> Prepravio sam tekst <s>križanjem</s> i <em>dodacima</em> da pojasnim razliku između apsolutnog i relativnog rasta, kao i linearnog i eksponencijalnog rasta. Tvrdnje kako su rane stope eksponencijalnog rasta značajne sam prekrižio jer za to nemam dokaza.
</p>
