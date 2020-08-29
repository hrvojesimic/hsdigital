# Drugi val

*Hrvoje Šimić, 29.08.2020.*

<p class="low-key card-panel yellow lighten-4">
Autor nije epidemiolog i ne govori iz pozicije autoriteta. Eventualne zaključke u tekstu uzmite sa zrnom soli.
</p>

<span class="dropcap">E</span>pidemija novog koronavirusu u Hrvatskoj je došla u dva vala. Ako prikažemo podatke o osobama s [koronavirus.hr](https://www.koronavirus.hr/podaci/otvoreni-strojno-citljivi-podaci/526)-a (podaci preuzeti 29.08., unos vjerojatno kasni) možemo ih jasno uočiti, pogotovo ako ih drugačije obojimo: plavo sve slučajeve prije 1.6.2020., a oker one koji su bili dijagnosticirani poslije.

```vly
width: 300
height: 130
autosize: { resize: true }
data:
  name: cases
mark: bar
encoding:
  x:
    field: Datum
    type:  temporal
    title: datum pozitivnog nalaza
  y:
    field: "*"
    aggregate: count
    title: broj slučajeva
  color:
    field: wave
    type: nominal
    legend: null
  tooltip:
    - field: Datum
      type:  temporal
      title: datum
    - field: "*"
      aggregate: count
      title: broj slučajeva
```

Ono što je posebno zanimljivo je koliko su zaraženi bili stari.
U podacima imamo godinu rođenja, pa možemo procijeniti da
starosna razdioba apsolutnog broja slučajeva za svaki val izgleda ovako:

```vly
width: 300
height: 130
autosize: { resize: true }
data:
  name: cases
transform:
  - calculate: datum.wave + '. val'
    as: waveLabel
mark: 
  type: bar
  clip: true
encoding:
  row:
    field: waveLabel
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

Čini se kako je prvi val bio ravnomjernije raspoređen po dobi, najviše zaraženih su bili ljudi u pedesetima.
No, drugi val ima vrlo izražen vrh kod mlađih punoljetnih pacijenata, daleko najviše je ljudi u dvadesetima.

Nije to karakteristično za cijeli drugi val, nego baš za mjesec kolovoz. Razdioba koja uzima podatke iz oba vala, ali samo slučajeve koji su se registrirali prije 1.8.2020. ne pokazuje neko gomilanje slučajeva ljudi u dvadesetima.

```vly
width: 300
height: 130
autosize: { resize: true }
data:
  name: cases
transform:
  - calculate: if (datum.Datum >= '2020-08-01', 'u kolovozu', 'prije kolovoza')
    as: august
mark: 
  type: bar
  clip: true
encoding:
  row:
    field: august
    type:  nominal
    title: null
  color:
    field: wave
    type:  nominal
    legend: null
  order:
    field: wave
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

Sredina ljeta je očito bilo razdoblje kad je puno mladih ljudi došlo u kontakt s virusom, vjerojatno u klubovima i putem drugih ljetnih aktivnosti.

## Relativna zaraženost po dobi

No apsolutni brojevi ne prenose cijelu sliku, zato što nisu sve dobne skupine jednako brojne. Pogledajmo kako izgleda starosna razdioba stanovništva prema [procjeni](https://www.dzs.hr/Hrv_Eng/publication/2019/07-01-03_01_2019.htm) Državnog zavoda za statistiku za 2018. godinu. Budući da su sve godine iznad 85. procjenjene skupa morao sam imputirati distribuciju, što je na grafu označeno svijetlosivo.

```vly
width: 300
height: 130
autosize: { resize: true }
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

Ako uzmemo u obzir razdiobu stanovništva, onda naše dvije krivulje starosnih profila valova izgledaju još različitije:

```vly
width: 300
height: 130
autosize: { resize: true }
data: 
  name: ageDistribution
transform:
  - calculate: datum.wave + '. val'
    as: waveLabel
mark: bar
encoding:
  row:
    field: waveLabel
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
    title: slučajeva na 1000 st.
  tooltip:
    - field: age
      type:  nominal
      title: dob
    - field: wave
      type:  quantitative
      title: val
    - field: caseCount
      type:  quantitative
      title: slučajeva
    - field: relCases
      type:  quantitative
      title: od 1000
```

Sad vidimo kako su u prvom valu osobe starije od 80 bile disproporcionalno zastupljene. Uzrok tome je vjerojatno proboj virusa u neke staračke domove. U drugom valu stariji građani su izgleda bili bolje zaštićeni, pa se na grafu ne ističu.

## Regionalna analiza

No nije situacija ista svugdje u Hrvatskoj. Podijelimo Hrvatsku na pet dijelova: Slavonija, Dalmacija, Zapad, Grad Zagreb i županije oko Zagreba, prema ovoj karti:

<p class="center-align">
  <img class="responsive-img" src="/story/covid-drugi-val/podrucja-hrvatske.png" title="Karta Hrvatske podijeljene na pet dijelova (Zapad, Jug, Istok, Središnja i Grad Zagreb)" />
</p>

Broj slučajeva relativno u odnosu na broj stanovnika tog dijela države u tom slučaju izgleda ovako:

```vly.exceptMob
width: 460
height: 150
autosize: { resize: true }
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
  tooltip:
    - field: wave
      type:  quantitative
      title: val
    - field: zoneName
      type:  nominal
      title: područje
    - field: cases
      type:  quantitative
      title: slučajeva
    - field: rel1000
      type:  quantitative
      title: od 1000
```
```vly.onlyMob
width: 320
height: 130
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
    title: slučajeva na 1000 stanovnika
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

Razlike su drastične: u Dalmaciji je COVID-19 tri puta češći nego u Zapadnoj Hrvatskoj, a županije oko Zagreba su duplo manje pogođene u odnosu na grad Zagreb.

Pogledajmo apsolutne brojeve slučajeva po dijelovima države u prvom i drugom valu:

```vly.exceptMob
width:  130
height: 90
autosize: { resize: true }
data:
  name: cases
transform:
  - calculate: datum.wave + '. val'
    as: waveLabel
mark: 
  type: bar
  clip: true
encoding:
  row:
    field: waveLabel
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
```vly.onlyMob
width:  130
height: 90
autosize: { resize: true }
data:
  name: cases
transform:
  - calculate: datum.wave + '. val'
    as: waveLabel
mark: 
  type: bar
  clip: true
encoding:
  column:
    field: waveLabel
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
  row:
    field: zoneName
    type:  nominal
    title: null
```

Prvi val svugdje izgleda slično, no drugi val se znatno razlikuje po tom mladenačkom vrhu. U Dalmaciji je najizraženiji, a ni Zagreb ne zaostaje. Manje je izražen u ostatku središnje Hrvatske, u Slavoniji se jedva nazire. Na sjevernom Jadranu, u tri najzapadnije županije, praktički ga nema.

Starosna razdioba stanovništva po županijama, daje procjene u dobnim skupinama po pet godišta (0-4, 5-9, itd.), s tim da je posljednja kategorija "85+". Ovaj put nisam radio imputiranje, nego sam dobnu skupinu 85-99 stavio u zadnji stupac grafa. Dobne kategorije koje su u prosjeku ispod 10 slučajeva po godištu sam linearno izblijedio da naglasim relativnu važnost.

```vly.exceptMob
width: 130
height: 100
autosize: { resize: true }
data:
  name: zoneAgeDistribution
transform:
  - calculate: datum.wave + '. val'
    as: waveLabel
  - calculate: if(datum.age > 80, 15, 5)
    as: span
  - calculate: datum.age + '-' + (datum.age + datum.span - 1)
    as: ageRange
  - calculate: min(datum.cases / datum.span, 10)
    as: casesTopped
mark: bar
encoding:
  column:
    field: zoneName
    type:  nominal
    title: null
  row:
    field: waveLabel
    type:  nominal
    title: null
  color:
    field:  wave
    type:   nominal
    legend: null
  opacity:
    field:  casesTopped
    type:   quantitative
    legend: null
  x:
    field: age
    type:  quantitative
    title: starost
  y:
    field: rel1000
    type:  quantitative
    title: slučajeva na 1000 st.
  tooltip:
    - field: ageRange
      type:  nominal
      title: dob
    - field: cases
      type:  quantitative
      title: broj slučajeva
    - field: pop
      type:  quantitative
      title: populacija
config:
  scale: {minOpacity: 0.1, maxOpacity: 1}
```
```vly.onlyMob
width: 130
height: 100
autosize: { resize: true }
data:
  name: zoneAgeDistribution
transform:
  - calculate: datum.wave + '. val'
    as: waveLabel
  - calculate: if(datum.age > 80, 15, 5)
    as: span
  - calculate: datum.age + '-' + (datum.age + datum.span - 1)
    as: ageRange
  - calculate: min(datum.cases / datum.span, 10)
    as: casesTopped
mark: bar
encoding:
  row:
    field: zoneName
    type:  nominal
    title: null
  column:
    field: waveLabel
    type:  nominal
    title: null
  color:
    field:  wave
    type:   nominal
    legend: null
  opacity:
    field:  casesTopped
    type:   quantitative
    legend: null
  x:
    field: age
    type:  quantitative
    title: starost
  y:
    field: rel1000
    type:  quantitative
    title: slučajeva na 1000 st.
  tooltip:
    - field: ageRange
      type:  nominal
      title: dob
    - field: cases
      type:  quantitative
      title: broj slučajeva
    - field: pop
      type:  quantitative
      title: populacija
config:
  scale: {minOpacity: 0.1, maxOpacity: 1}
```

Ovo je, čini mi se, najdetaljnija slika dobno-prostornih karakteristika dva vala COVID-19 zaraze u Hrvatskoj do danas. Karakteristika drugog vala je ta veća zastupljenost mladih ljudi koji se ovih dana vraćaju u svoje sredine, u srednju školu, na fakultet i radna mjesta.

No iz ovih podataka još ne mogu iščitati neke važne informacije. Koliko razdioba slučajeva po županijama odgovara mjestu zaraze? Jesu li uključeni podaci o zaraženim strancima? Koliko o dobi ovisi vjerojatnost da će zaražena osoba biti prepoznata? Mladi ljudi se čine manje skloni testiranju i uopće pokazivanju simptoma, stoga bi razlika mogla biti i znatnija.

Ovakve slike stvaraju društveni procesi. Neke od razlika su slučajne, a neke sustavne. Dolazak turista je sigurno utjecao na sliku Dalmacije, ali u isto vrijeme dobni profil je drastično različit od sjevernog Jadrana, koji je isto tako bio pun turista, a bliži Slavoniji, gdje nije bilo turista. Zagrepčani u dobi 20-24 godine su se zarazili na moru, ali sigurno i u Zagrebu preko ljeta, opet puno više nego njihovi vršnjaci u susjednim županijama. Ako bolje razumijemo zašto se podaci razlikuju, imamo priliku bolje razumjeti koje mjere dovode do povoljnih rezultata.

<p style="display:none">
```
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
</p>
