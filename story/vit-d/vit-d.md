# Trebali bi uzimati vitamin D

*Hrvoje Šimić, 2020-12-12*

<p class="low-key card-panel yellow lighten-3">
<b>Oprez</b>: Autor nije liječnik, samo prenosi javne i službene preporuke liječnika i javnozdravstvenih ustanova. Ako imate pitanja ili tražite savjet, konzultirajte svog liječnika.
</p>

<span class="dropcap">V</span>itamin D je poseban među vitaminima po tome što ga možemo stvarati sami, kad našu kožu izložimo UV-zrakama. I važan je za puno stvari. Hrvatski zavod za javno zdravstvo [kaže](https://www.hzjz.hr/sluzba-zdravstvena-ekologija/vitamin-d-i-preporuke-za-nadomjesnu-primjenu-vitamina-d-od-jeseni/):

> Istraživanja pokazuju kako visoki status vitamin D može pomoći u smanjenju rizika virusnih epidemija te održati imunitet, snagu mišića i gustoću kostiju, dok niske koncentracije vitamina D se vežu uz maligne, kardiovaskularne, autoimune i neurološke bolesti te kronične respiratorne bolesti, dijabetes i hipertenziju. Upravo se ove bolesti povezuju s najvećim brojem smrtnih ishoda među oboljelima od COVID-19.

## Koliko nam treba vitamina D?

Iako znamo da kako je premalo vitamina D loša stvar, stručnjaci nisu složni oko toga gdje je točno granica između "premalo" i "dovoljno". Američki Institute of Medicine (IOM) sugerira da je razina vitamina D u obliku 25(OH)D u serumu iznad 50 nmol/l dovoljna. Smjernice dane od Međunarodne zaklade za osteoporozu (IOF) i Endokrinog društva (ES) sugeriraju da je poželjan prag od 75 nmol/l. Po [hrvatskim smjernicama](https://lijecnicki-vjesnik.hlz.hr/lijecnicki-vjesnik/smjernice-za-prevenciju-prepoznavanje-i-lijecenje-nedostatka-vitamina-d-u-odraslih/), **preporučena populacijska koncentracija vitamina D u krvi iznosi od 75 do 125 nmol/l**.

## Imamo li dovoljno vitamina D?

Prema studiji iz 2016. _[Vitamin D status and prevalence of inadequacy in Croatian population](https://www.bib.irb.hr/908094)_, prosječna koncentracija 25(OH)D u krvi je bila 54,4 nmol/l. Usprkos suncu, prehrani i dodataka prehrani, _gotovo pola_ (46,1%) stanovnika Hrvatske je ispod nižeg praga od 50 nmol/l, što znači da im **nedostaje vitamina D**. Čak 83,8% stanovništva ima razinu seruma 25(OH)D manju od 75 nmol/l, što je klasificirano kao **manjak** (insuficijencija) vitamina D. Studija zaključuje kako je među Hrvatima visoka prevalencija hipovitaminoze D.

```vly.exceptMob
width: 300
height: 30
data:
  values:
    - caption: dovoljna razina vitamina D
      proportion: 16.2
    - caption: manjak vitamina D
      proportion: 37.7
    - caption: nedostatak vitamina D
      proportion: 46.1
mark: bar
encoding:
  x:
    type: quantitative
    field: proportion
    title: null
  color:
    title: null
    type: nominal
    field: caption
    scale:
      domain: [nedostatak vitamina D, manjak vitamina D, dovoljna razina vitamina D]
      range: [red, orange, green]
caption: Prevalencija različitih kategorija nedostatka vitamina D među stanovnicima Hrvatske.
```
```vly.onlyMob
width: 50
height: 200
data:
  values:
    - caption: nedostatak vitamina D
      proportion: 46.1
    - caption: manjak vitamina D
      proportion: 37.7
    - caption: dovoljna razina vitamina D
      proportion: 16.2
mark: bar
encoding:
  y:
    type: quantitative
    field: proportion
    title: null
    scale:
      domainMax: 100
  color:
    title: null
    type: nominal
    field: caption
    scale:
      domain: [dovoljna razina vitamina D, manjak vitamina D, nedostatak vitamina D]
      range: [green, orange, red]
caption: Prevalencija različitih kategorija nedostatka vitamina D među stanovnicima Hrvatske.
```

## Može li nam vitamin D pomoći u korona-zimi?

Postoji dodatan razlog zašto se ove godine puno pričalo o vitaminu D: neki ljudi se nadaju da bi mogao pomoći u borbi s novim koronavirusom. Kako je nama na sjevernoj polutci sad već zima i žarkog sunca na goloj koži je sve manje, bi li mogli dodatnim uzimanjem vitamina D pomoći našem tijelu da se lakše odupre bolesti?

Pravo mjesto da tražimo odgovor na to pitanje je znanstvena literatura. Jedan popis literature nalazi se na stranici _[Vitamin D and Covid-19](https://vitamin-d-covid.shotwell.ca/)_. Tamo se možete uvjeriti da postoji već dosta istraživanja, no ona mahom samo potvrđuju da postoji korelacija između bolesti i razine vitamina D.

Kako bi mogli bolje procijeniti je li ta veza stvarno uzročna i u pravom smjeru, a posebno utječe li uzimanje vitamina D povoljno na ishode bolesti, trebat će nam puno jače studije — idealno, randomizirani kontrolirani klinički pokusi.

## Španjolska studija

Trenutno, pretraživanje PubMeda izbacuje samo [jednu takvu studiju](https://www.sciencedirect.com/science/article/pii/S0960076020302764), koja je u listopadu objavljena u časopisu _The Journal of Steroid Biochemistry and Molecular Biology_. 

COVID-19 pacijenti su pri prijemu bili računalom slučajno raspoređeni da ili prime terapiju 25(OH)D<sub>3</sub> ili da je ne prime, u omjeru 2:1. Rezultati su bili drastični: pacijenti čija je terapija uključivala vitamin D su na kraju puno rjeđe trebali intenzivnu skrb, i manje su umirali. Pogledajte dijagram:

<figure style="max-width: 500px; margin: auto">
  <div id="Sankey"></div>
  <figcaption>
    Grafički prikaz rezultata studije. Dio pacijenata koji je primao vitamin D (narančasto) je rjeđe završio u jedinici intenzivnog liječenja (JIL) i na kraju je imao bolje ishode od onih koji nisu primali vitamin D (plavo).
  </figcaption>
</figure>

Od 50 pacijenata koji su dobili terapiju vitaminom D, samo jednoj osobi je bilo potrebno intenzivno liječenje, i svi su na kraju ozdravili. Od 26 pacijenata koji nisu dobili terapiju vitaminom D, pola ih je završilo u jedinici intenzivnog liječenja, od toga ih je dvoje na kraju umrlo.

Ova studija ima svoje nedostatke. Najveći minus joj je što nije dvostruko slijepa, samo je obrada podataka bila slijepa. Nije niti bila kontrolirana placebom, iako, s obzirom na svu terapiju koju su pacijenti primali (svi su po tadašnjem protokolu primali hidroksiklorokin i azitromicin), teško je zamisliti da bi sam učinak placeba polučio ovako velike razlike.


## Drugi randomizirani kontrolirani klinički pokusi

Randomiziran, placebom kontroliran [pokus iz Indije](https://pmj.bmj.com/content/early/2020/11/12/postgradmedj-2020-139065.full) nad 40 pacijenata koji su imali asimptomatski ili blago simptomatski COVID-19. Terapija vitaminom D<sub>3</sub> je pomogla u oporavku.

Jedna druga [studija iz Brazila](https://www.medrxiv.org/content/10.1101/2020.11.16.20232397v1), čiji su rezultati objavljeni kao _preprint_ (tj. nisu još prošli _peer-review_) nije našla nikakve prednosti terapije vitaminom D. Njena prednost je što je dvostruko slijepa i placebom kontrolirana, no prigovaraju joj neprimjerenu terapiju. Liječnici su tamo pacijentima s uznapredovalom bolesti (90% ih je već bilo na kisiku) dali jednu veliku dozu vitamina D<sub>3</sub> (umjesto 25(OH)D<sub>3</sub>), kojemu treba neko vrijeme da postane metabolički aktivan. Moguće je kako je ova intervencija nastupila prekasno da postigne željeni učinak.


## Je li uzimanje vitamina D sigurno?

Unošenje vitamina D u preporučenim dozama nije riskantno. U Smjernicama piše:

> današnja saznanja upućuju na to da je primjena vitamina D sigurna ⋯ tek doza od 50 000 IJ vitamina D na dan tijekom nekoliko mjeseci može uzrokovati intoksikaciju


## Službene preporuke

HZJZ je izdao [preporuke](https://www.hzjz.hr/sluzba-zdravstvena-ekologija/vitamin-d-i-preporuke-za-nadomjesnu-primjenu-vitamina-d-od-jeseni/) po kojima bi svi mi trebali konzumirati dodatke prehrani s vitaminom D u dozi od __800 IJ dnevno na više__.

U Smjernicama postoje i dodatne preporuke:

> Preventivna primjena vitamina D za pacijente u riziku od nedostatka vitamina D provodi se u dozi od 1500 do 2000 IJ. Gornja granica dopuštenog unosa iznosi 4000 IJ.

> Terapijska primjena kod dokazanog nedostatka vitamina D podrazumijeva primjenu vitamina D u dozi od 6000 IJ tijekom 8 tjedana i potom prelazak na dozu održavanja od 1500 do 2000 IJ.


## I, što sad?

Iz svega iznesenog slijedi da postoji dobra vjerojatnost da vam nedostaje vitamina D i da bi ga trebali pojačano unositi tijekom ove zime. Prema službenim smjernicama i preporukama, ne trebate čekati da vam se dijagnosticira nedostatak vitamina D da bi ga počeli uzimati. Dodaci prehrani koji nam u tome mogu pomoći su jeftini, dostupni, jednostavni za korištenje i sigurni.

Postoji nezanemariva šansa da vitamin D pomaže i u borbi s COVID-19. Možda može pomoći da nikad ne razvijete bolest. Možda će vam pomoći da ju lakše prebolite. Prve studije obećavaju, ali nitko još uvijek ne može reći da je išta konkretno dokazano. Znanstveni konsenzus se sporo formira, i vjerojatno ćemo na taj odgovor čekati još mjesecima, možda čak i godinama.

No to ne znači da moramo čekati konačan odgovor na to jedno pitanje prije nego poduzmemo konkretan korak za svoje zdravlje. Preporuke liječnika imamo već sad. Ako se pokaže da dodatno štiti od koronavirusa, to će biti samo šlag na tortu. A takvog šlaga nam u ovim trenucima jako, jako nedostaje.

Najbolje vrijeme da počnete uzimati vitamin D, da ga podijelite roditeljima i ukućanima, bilo je prije dva mjeseca. Drugo najbolje vrijeme je _sad_! Ovo nisu vremena u kojem imamo luksuz da ignoriramo savjete liječnika.
