# Katar i smrt

*Hrvoje Šimić, 08.12.2022.*

<figure>
  <img class="responsive-img" src="/story/katar-smrti/herne.jpg" />
</figure>

<span class="dropcap">S</span>TADION u gradu Herne u Njemačkoj, na dan otvaranja Svjetskog prvenstva. Izloženo je [6500 lopti okruženih s 20 000 svijeća na tribinama](https://germany.detailzero.com/sports/212963/Football-World-Cup-in-Qatar-protest-in-Herne-at-the-opening-%E2%80%93-news.html
), kako bi podsjetio na smrti radnika u Katru. Njih šest tisuća i petsto.

Taj broj vidim svugdje: na televiziji, podcastima, u novinama, društvenim mrežama... gotovo svatko tko priča o problemima Svjetskog prvenstva spominje kako je šest i pol tisuća ljudi poginulo tijekom pripreme. Ili, ako ćete malo dramatičnije, oko jedan ljudski život za svaku minutu igre na natjecanju. 

<figure>
  <img class="responsive-img" src="/story/katar-smrti/naslovi.png" />
  <figcaption>Neki od naslova o katarskim smrtima u najčitanijim hrvatskim dnevnim novinama i portalima.</figcaption>
</figure>

U mojoj glavi se stvorila slika siromašnog mladog radnika iz Azije ili Afrike, kojeg je ljuta nevolja natjerala "trbuhom za kruhom" u bogati Katar. Tamo ga zarobljavaju i nemilice iskorištavaju okrutni Arapi, tjeraju da na nesnosnoj žegi golim rukama stvara velebne stadione i hotela, dok na kraju jadnik doslovno ne skonča od napora.

Nameće se pitanje: je li bilo vrijedno toga? Zašto su svi ti ljudi umrli? Da bi mi par tjedana mogli gledati nogomet?

Kopkalo me koliko je taj broj stvaran, koliko je ta priča stvarna. Od tog kopkanja upao sam u rupu brojeva, priča, emocija i manipulacija. Dok sam se pokušavao od tamo ispetljati, zapisivao sam ono što mi se čini najkorisnije i izvukao neke zaključke. Ispostavilo se kako toga ima dosta.

Ako vam se ne da čitati dosta dugu analizu punu brojeva i grafova, uvijek možete preskočiti na [kraj članka](#koliko-je-stvarno-radnika-poginulo-zbog-sp-a).

## Odakle dolazi taj broj?

Nije tajna otkud taj famozni podatak. Objavljen je u britanskim dnevnim novinama *The Guardian* [početkom 2021.](https://www.theguardian.com/global-development/2021/feb/23/revealed-migrant-worker-deaths-qatar-fifa-world-cup-2022) Autori članka su prikupili podatke o ukupnom broju građana pet zemalja Južne Azije koji su preminuli na području Katra u razdoblju između cca 2010. i 2020. Zbroj tih pet brojeva je bio 6750. Malo su ga "zaokružili" i ustvrdili kako je na pripremama za domaćinstvo Svjetskog prvenstva 2022. umrlo barem 6500 radnika-migranta.

Neki naši medijski članci kao izvor tog podatka nisu naveli The Guardian, nego su ga pripisali "*neovisnim agencijama*" ([Index](https://www.index.hr/sport/clanak/ovo-su-svi-stadioni-na-svjetskom-prvenstvu-evo-na-kojima-igra-hrvatska/2413071.aspx)), "*raznim medijima*" ([24 sata](https://www.24sata.hr/sport/ovo-je-deset-razloga-zbog-kojih-je-svjetsko-prvenstvo-u-kataru-najkontroverznije-u-povijesti-874636)), "*brojnim izvorima*" ([Jutarnji](https://sportske.jutarnji.hr/sn/nogomet/sp2022/predsjednik-fifa-e-otvoreno-prozvao-licemjere-danas-se-osjecam-kao-kataranin-kao-gay-kao-hendikepirana-osoba-15277472)). Valjda sam im te fraze zvučale važnije nego reći da je izvor jedan jedini novinski članak od prije skoro dvije godine. 

Tražio sam neovisan izvor ili ijedno drugo istraživanje koje bi potvrdilo Guardianovu procjenu, nisam mogao naći ništa posebno korisno. No zato sam našao mnogih provjere koje je kritiziraju. Njemački informacijski servis [Deutsche Welle](https://www.dw.com/en/fact-check-how-many-people-have-died-for-the-qatar-world-cup/a-63763713), BBC-jev podcast [More or Less](https://www.bbc.co.uk/programmes/p0dlg3hq) i UN-ova [Međunarodna organizacija rada (ILO)](https://www.ilo.org/wcmsp5/groups/public/---arabstates/---ro-beirut/---ilo-qatar/documents/publication/wcms_828395.pdf) osvrću se izravno na podatak o "6500 smrti" i upozoravaju da ta brojka ne znači ono što se u našim novinama tvrdi da znači.

## Koliko je stranaca stvarno umrlo u Katru?

Niti jedan od naših članaka nije jasno specificirao je 6500 slučajeva samo podskup svih umrlih koji su bili građani Indije, Pakistana, Nepala, Bangladeša i Šri Lanke. Novinari su nekako poopćili to na cjelokupnu populaciju stranaca u Katru. No prema [neslužbenim podacima](https://priyadsouza.com/population-of-qatar-by-nationality-in-2017/) građani navedenih zemalja čine tek oko 62% stranaca tamo.

Guardian nije objasnio zašto je objavio samo podatke tih pet zemalja. Nema praktičnog razloga zašto bi se ograničavali: u samo par klikova možete pronaći [službenu statistiku](https://www.psa.gov.qa/en/statistics1/pages/topicslisting.aspx?parent=Population&child=BirthsDeaths) o svim umrlim strancima. Evo, pripremio sam graf koji pokazuje broj smrti stranaca u Katru u razdoblju 2003.-2020.:

```vly.exceptMob
width: 350
height: 200
autosize: { resize: true }
data:
  name: deaths
transform:
  - calculate: datum.year > 2010
    as: preparations
mark: bar
encoding:
  x:
    field: year
    type:  ordinal
    title: godina
  y:
    field: fdeaths
    type:  quantitative
    title: ukupno smrti stranaca
  color:
    field: preparations
    type: nominal
    legend: null
caption: "Ukupan broj smrti stranaca u Katru kroz godine. Narančastom bojom je označeno razdoblje priprema za SP."
```
```vly.onlyMob
width: 250
height: 300
autosize: { resize: true }
data:
  name: deaths
transform:
  - calculate: datum.year > 2010
    as: preparations
mark: bar
encoding:
  y:
    field: year
    type:  ordinal
    title: godina
  x:
    field: fdeaths
    type:  quantitative
    title: ukupno smrti stranaca
  color:
    field: preparations
    type: nominal
    legend: null
caption: "Ukupan broj smrti stranaca u Katru kroz godine. Narančastom bojom je označeno razdoblje priprema za SP."
```

Znači, po službenim podacima samog Katra, od dobitka domaćinstva SP-a pa do kraja 2020. tamo je umrlo ukupno 15 804 stranca. Znatno veći broj od Guardianova.

## Je li to velik broj?

Bez obzira pričamo li o 6,5 ili o 15 tisuća smrti, trebamo se prvo zapitati: je li to velik broj? Pa, jest velik u smislu u kojem je i samo jedna smrt velik broj. No smrti se ipak događaju, svaki dan, u svakoj zemlji svijeta.

Ako to prihvatimo, sljedeći korak je da provjerimo jesu li ove smrti po nečemu alarmantne. Ima li ih više nego što možemo očekivati i inače? Niti jedan članak u našim novinama nije to napravio.

6500 nam je uveden bez konteksta, namijenjen da impresionira čitatelja samom svojom pojavom. To je vrlo sumnjivo. Zamislite da vas probudi vijest s radija: "Jučer umrlo sto Hrvata!" Zar ne bi pomislili kako se dogodila neka velika tragedija? Ako je taj podatak vrijedan udarne vijesti, onda je valjda umrlo 100 *dodatnih* ljudi, na broj koji u prosjeku umre u Hrvatskoj (oko 130-140). Ne očekujete da je vijest kako je taj dan bilo neobično malo smrti.

## Koliko je stranaca u Katru?

Da bi stavili broj smrti u kontekst, moramo prvo znati o kolikoj populaciji pričamo — što je veća populacija to možemo očekivati i više smrti. Iz [službene državne statistike o radnoj snazi](https://www.psa.gov.qa/en/statistics1/pages/topicslisting.aspx?parent=Social&child=LaborForce), pregledom pojedinačnih godišnjih izvještaja uspio sam izvući ove podatke o ukupnom broju stranaca (zbroj ekonomski aktivnog i neaktivnog stanovništva nekatarske nacionalnosti koji su stariji od 14 godina):

```vly
width: 250
height: 200
autosize: { resize: true }
data:
  name: deaths
transform:
  - filter: datum.year >= 2007
  - calculate: datum.year > 2010
    as: preparations
  - calculate: "toNumber(datum.fea15) + toNumber(datum.fin15)"
    as: f15
mark: bar
encoding:
  x:
    field: year
    type:  ordinal
    title: godina
  y:
    field: f15
    type:  quantitative
    title: ukupno stranaca
  color:
    field: preparations
    type: nominal
    legend: null
caption: "Ukupan broj stranaca (15+) u Katru kroz godine. Nema statistike prije 2007., a 2010. iz nekog razloga nedostaje."
```

Godine 2020. u Kataru je po tome bilo 2 274 745 stranaca starijih od 14 godina. To je velika populacija. Te godine je umrlo 2080 stranaca, što je nešto ispod jedne smrti na tisuću stanovnika. Taj broj je bio u padu kroz zadnjih desetak godina, da bi 2020. iz nekog razloga opet skočio.

```vly
width: 250
height: 200
autosize: { resize: true }
data:
  name: deaths
transform:
  - filter: datum.year > 2007
  - calculate: datum.year > 2010
    as: preparations
  - calculate: if(datum.fea15, datum.fdeaths / (toNumber(datum.fea15) + toNumber(datum.fin15)) * 1000, null)
    as: fdrate
layer:
  - mark: circle
    encoding:
      x:
        field: year
        type:  temporal
        title: godina
        scale:
          domain: ["2007", "2020"]        
      y:
        field: fdrate
        type:  quantitative
        title: smrti na 1000 stranaca 15+
      fill:
        field: preparations
        type: nominal
        legend: null
  - mark: line
    encoding:
      x:
        field: year
        type:  temporal
        title: godina
      y:
        field: fdrate
        type:  quantitative
        title: smrti na 1000 stranaca 15+
caption: "Stopa smrtnosti stranaca u Katru po godinama."
```

Pa, je li jedna smrt godišnje na tisuću stanovnika puno?

Zanimljivo je kako je po smrtnosti Katar trenutno zemlja s [najmanjom stopom smrtnosti u cijelom svijetu](https://www.cia.gov/the-world-factbook/field/death-rate/). Od tisuću stanovnika, i domaćih i stranaca, svake godine tamo umre tek njih 1,42. To je **devet puta** manje od Hrvatske!

Dakle, nije neobično puno nego neobično *malo* smrti. Toliko malo da mora biti nešto posebno oko tih Katrana. Izgleda da je uzrok velik broj relativno mladih ljudi u populaciji: migrantskih radnika. A mladi ljudi ne umiru tako često kao stari.

## Koliko su ti stranci stari?

Ti stranci u Katru su svi mladi ljudi, zar ne? Pa, ne baš. [Popis stanovništva 2020.](https://www.psa.gov.qa/en/statistics1/StatisticsSite/Census/Census2020/results/pages/result.aspx?rpttitle=p2_c15) otkriva nam koliko stranaca koje dobi i spola je živjelo u Katru:

```vly.exceptMob
width: 350
height: 120
autosize: { resize: true }
data:
  name: nqat
transform:
  - calculate: if(datum.sex == 'F', 'ženski', 'muški')
    as: sexlabel
mark: bar
encoding:
  y:
    field: age
    type:  ordinal
    title: dob
  x:
    field: pop
    type:  quantitative
    title: broj stranaca
  color:
    field: sexlabel
    type:  nominal
    title: spol
    scale: 
      range:
        - "#6EC5E9"
        - "#FFC56C"
caption: "Razdioba stranaca u Katru po dobi i spolu. Izvor: Popis stanovništva, prosinac 2020. Nisu objavljeni podaci o djeci."
```
```vly.onlyMob
width: 200
height: 100
autosize: { resize: true }
data:
  name: nqat
transform:
  - calculate: if(datum.sex == 'F', 'ženski', 'muški')
    as: sexlabel
mark: bar
encoding:
  y:
    field: age
    type:  ordinal
    title: dob
  x:
    field: pop
    type:  quantitative
    title: broj stranaca
  color:
    field: sexlabel
    type:  nominal
    title: spol
    scale: 
      range:
        - "#6EC5E9"
        - "#FFC56C"
caption: "Razdioba stranaca u Katru po dobi i spolu. Izvor: Popis stanovništva, prosinac 2020. Nisu objavljeni podaci o djeci."
```

Prema očekivanjima, najveća kategorija su muškarci u dobi najveće fizičke snage. No tu je i skoro 22 tisuće stranaca starih 65 i više godina, što povećava rizik smrti. Ako primijenimo [američke aktuarske tablice](https://www.ssa.gov/oact/STATS/table4c6.html) na razdiobu stranaca u Katru, možemo izračunati i očekivani broj smrti godišnje, *kad* bi umirali po stopama građana SAD-a.

<figure>
  <table id="TabOcekivanihSmrti" class="responsive-table centered striped">
    <thead>
      <tr>
        <th>dob</th>
        <th>spol</th>
        <th>populacija</th>
        <th>prosječna dob</th>
        <th>vjerojatnost smrti</th>
        <th>smrti/god</th>
      </tr>
    </thead>
    <tbody>
    </tbody>
  </table>
  <figcaption>
    Izračun očekivane godišnje smrti prema američkim aktuarskim tablicama i populaciji stranaca u Katru 2020. godine. Za svaki raspon dobi je pretpostavljena prosječna dob i uzeta vjerojatnost umiranja u toj dobi za taj spol iz aktuarske tablice.
  </figcaption>
</figure>

Očekivano je skoro *tri puta* više od stvarno prijavljenih 2080 mrtvih stranaca te godine! Znači li to da svu smrtnost (i puno više od toga!) možemo objasniti uobičajenom stopom smrtnosti na Zapadu? 

Ne, ne možemo. Stranci u Katru nemaju jednak zdravstveni profil kao njihovi američki vršnjaci. Ljudi koji idu raditi u Katar bi mogli biti zdraviji od prosječnog Amerikanca, jer trebaju proći liječnički pregled. S druge strane, očekujem i da su siromašniji i manje obrazovani, a možda im je i slabiji pristup zdravstvenim uslugama. Sve to bi moglo utjecati na njihovu stopu mortaliteta.

Drugi veliki faktor je ponašanje ljudi kad im se zdravlje pogorša. Očekujem da većina teško bolesnih stranaca napusti Katar, dok velika većina stanovnika SAD-a ostane u zemlji i tamo na kraju umre.

## Što ti ljudi tamo rade?

Gotovo svi mediji kopiraju Guardian u tvrdnji da su umrli ljudi bili "radnici". No izvještaji koje je Guardian koristio kao izvor to uopće ne spominje. Ranije navedeni popis stanovništva kaže kako 253 796 stranaca (15+) u Katru ne radi, konkretno:

- 141 081 domaćica
- 91 138 studenta/učenika
- 2 288 nesposobnih za rad
- 16 652 drugih stranaca koji ne traže posao
- 2 637 nezaposlenih koji aktivno traže posao

Da je bilo tko od njih preminuo, ili bilo koji stranac mlađi od 15 godina, završili bi na istom popisu umrlih, iako nisu radnici.

Naši mediji idu i korak dalje, ne samo da sve umrle proglašavaju stranim radnicima, nego im daju i konkretno zanimanje: građevinski radnici. No tek 34% radnika-migranata u Katru radi u građevinskoj industriji, nekih [660 tisuća](https://www.psa.gov.qa/en/statistics1/StatisticsSite/Census/Census2020/res/Pages/economic.aspx). Na popisu stanovništva 2010, prije dobivanja domaćinstva SP-a, ti radnici su činili 42% strane radne snage, što znači da se za pripremu Prvenstva zapošljavalo više drugih zanimanja nego građevinaca.

To ostavlja preko milijun i pol ljudi koji sigurno ne rade na teškim poslovima u građevini. Oni čine dio od ukupnog broja umrlih.

## Kako su umrli?

Umjesto da koriste izvornu riječ "umrli", neke naše novine pišu kako je svih 6500 ljudi "*poginulo*" ([24 sata](https://www.24sata.hr/sport/tisuce-radnika-umrlo-u-kataru-od-dobivanja-domacinstva-sp-a-747216)), "*stradalo*" ([Indeks](https://www.index.hr/sport/clanak/guardian-u-kataru-je-na-gradilistima-spa-dosad-poginulo-vise-od-6500-ljudi/2256395.aspx)), "*izgubilo život*" ([Jutarnji](https://www.jutarnji.hr/scena/strane-zvijezde/morganu-freemanu-izvlace-prljavo-rublje-zbog-sp-a-u-zivotu-legendarnog-glumca-nekoliko-je-mracnih-prica-15278116)). Time se implicira da kako je njihova smrt bila nasilna, uzrokovana lošim uvjetima rada ili života u Katru. Kako pišu [Novosti](https://www.portalnovosti.com/radnici-ostavljaju-srce-na-terenu): "*najmanje 6500 radnika*" je umrlo "*zbog loših radnih uvjeta i toplotnog stresa*". No postoji problem s tim izvještavanjem: Guardianovi podaci ne govore apsolutno ništa o tome *kako* su ljudi iz izvještaja umrli.

To "kako" piše u službenim smrtovnicama, ali novinari i nevladine udruge im ne vjeruju potpuno. U previše slučajeva su pod uzrok smrti piše samo "prirodna smrt" i "koronarni zastoj". Čini se kako nad siromašnim strancima obično ne rade autopsije, niti troše puno novaca da bi utvrdili zašto je mladom radniku u snu otkazalo srce.

Jedne procjene broj smrti na poslu u Katru dolaze od ranije spomenutog [izvještaja](https://www.ilo.org/wcmsp5/groups/public/---arabstates/---ro-beirut/---ilo-qatar/documents/publication/wcms_828395.pdf) [Međunarodne organizacije rada](https://hr.wikipedia.org/wiki/Me%C4%91unarodna_organizacija_rada). Prema njemu, u 2020. se dogodilo 50 smrtonosnih ozljeda na radu, što je oko 2,5% ukupnog broja smrti stranaca u Katru te godine. To su sve ozljede, u svim sektorima, ne samo one pri gradnji stadiona ili drugih projekata pripreme za SP.

29.11.2022. katarski Vrhovni odbor za pripremu SP-a je iznio drugačiji podatak: "<em>Nacionalna statistika za razdoblje 2014.—2020. evidentira 414 smrtnih slučajeva povezanih s radom u cijelom Kataru, što pokriva sve sektore i nacionalnosti.</em>" Opet, ova statistika ne pokriva samo smrti u građevinskom sektoru, štoviše ne ograničava se ni samo na strance.

No ima smisla pitati se: jesu li smrti od ozljeda na radnom mjestu, ili na putu prema radnom mjestu, jedine smrti koje treba brojati? Ako je mladića poslije radnog vremena pregazio autobus, je li na nesreću utjecalo to što su i on i vozač autobusa bili iscrpljeni na kraju dugog radnog dana? Ako jedan migrant ubije drugog, jesu li tome kumovali loši uvjeti smještaja? Možda je trećeg na suicid naveo nepravedan potez poslodavca? Čistač ulica je preminuo od upale pluća: je li tome pridonijela prašina s gradilišta? Koliko je slučajeva u kojima su zdravi građevinski radnici radeći u Katru teško narušili svoje zdravlje i otišli doma da umru? Da ne govorimo uopće o ljudima koji su još živi, ali im je sudbina zapečaćena.

To je izvor najvećih odstupanja kod različitih mjerenja mortaliteta: što sve pribrojati radu kao uzroku? I kako usporediti različite sredine? Kriterij mora biti konzistentan za sve zemlje i događaje, jer inače uspoređujemo kruške i jabuke. Ne možemo na pripremama za Olimpijadu u Londonu brojati samo fatalne nesreće na gradilištima projekta, u Katru brojati smrti svih uzroka svih stranaca kroz deset godina u cijeloj zemlji, i onda oboje zvati jednostavno "smrtima" i uspoređivati te brojeve. Stoga bi netko morao smisliti dobre medicinske kriterije za smrt povezanu uz posao, i izmjeriti tim univerzalnim standardom različite zemlje svijeta.


## Kako izgledaju usporedbe između zemalja?

Srećom, imamo tako nešto. Svjetska zdravstvena organizacija i Međunarodna organizacija rada su 2021. objavili [zajednički izvještaj](https://www.who.int/publications/i/item/9789240034945) s procjenama opterećenja bolesti i ozljeda koji su povezani s radom. Napravili su procjene smrti za svaku zemlju pojedinačno.

Tamo računaju stope mortaliteta ne po radniku, nego po stanovniku (15+). Gledaju smrti od ozljeda na radu, ali i od svih drugih radom uzrokovanih bolesti: bolesti pluća, srca, moždani udar, karcinomi dišnih puteva i slično. Kao faktore rizika ističu i dugo radno vrijeme, udisanje prašine i plinova, azbesta, itd.

Iz izvještaja sam izvadio neke brojeve za najkasniju godinu koju imaju (2016.), i za zemlje koje sam mislio da su zanimljive:

```vly
width: 300
height: 230
autosize: { resize: true }
data:
  name: wrdpt
transform:
  - filter: datum.cat == 'c'
mark: bar
encoding:
  x:
    field: dpt16
    type:  quantitative
    title: smrti na 100 000 stanovnika
  y:
    field: hrlabel
    type:  nominal
    title: null
    sort:  "-x"
  color:
    field:  area
    type:   nominal
    legend: null
caption: "Stopa smrti povezanih s radom na sto tisuća stanovnika (samo 15-godišnjaci ili stariji) u 2016."
```

Iznenađujuća činjenica je da dvije svjetske organizacije koje su najrelevantnije za takvu analizu, Katru daju visoke ocjene. Ispada da kod njih ljudi *najmanje* umiru od rada. Statistike za druge godine i zemlje pokazuju iste trendove: na Arapskom poluotoku od rada se puno *manje* umire nego u zemljama iz kojih dolaze migranti. Štoviše, umire se manje nego na Zapadu.

## Ubija li katarsko sunce?

Kao glavni razlog protiv ove gradnje u Katru se obično navode vrućine koje tamo vladaju. Članci koje sam ja čitao često spočitavaju bahatost Arapa koji u paklenoj pustinji žele imati ono što nije prirodno.

Da bi dobili vizualni osjećaj kakva je klima u Katru, pronašao sam ovakav prikaz na servisu [Weather Spark](https://weatherspark.com/):

<figure>
  <img class="responsive-img" src="/story/katar-smrti/klima/Average%20Hourly%20Temperature%20in%20Doha.svg" />
  <figcaption>Prosječne temperature u Dohi (Katar), kroz mjesece (os x) i sate u danu (os y).</figcaption>
</figure>

To su stvarno pakleni vremenski uvjeti svako ljeto, od svibnja do rujna. Prvi kolovoza u Dalmaciji je za njihove standarde ugodan proljetni dan. Usporedite sa slikom Splita:

<figure>
  <img class="responsive-img" src="/story/katar-smrti/klima/Average%20Hourly%20Temperature%20in%20Split.svg" />
  <figcaption>Prosječne temperature u Splitu (Hrvatska).</figcaption>
</figure>

No, vruće je na cijelom Arapskom poluotoku, ne samo u Katru. Druga dva velika gradilišta u blizini, Dubai i Rijad, imaju vrlo sličnu situaciju:

<figure>
  <img class="responsive-img" src="/story/katar-smrti/klima/Average%20Hourly%20Temperature%20in%20Dubai.svg" />
  <figcaption>Prosječne temperature u Dubaiju (Ujedinjeni Arapski Emirati).</figcaption>
</figure>

<figure>
  <img class="responsive-img" src="/story/katar-smrti/klima/Average%20Hourly%20Temperature%20in%20Riyadh.svg" />
  <figcaption>Prosječne temperature u Rijadu (Saudijska Arabija).</figcaption>
</figure>

A Arapski poluotok nije jedina regija u kojoj se gradi po vrućinama. Prosječna temperatura u Dohi je slična kao i na velikim gradilištima Južne Azije, samo što su razdoblja iznad 35 °C obično kraća. Kako najveći broj stranaca u Katar dolazi iz Indije, evo temperaturna situacija njihovog glavnog grada:

<figure>
  <img class="responsive-img" src="/story/katar-smrti/klima/Average%20Hourly%20Temperature%20in%20New%20Delhi.svg" />
  <figcaption>Prosječne temperature u New Delhiju (Indija).</figcaption>
</figure>

Bolje, ali još uvijek dva i pol mjeseca prženja. Nigdje u Europi nećete naći sličnu situaciju, no u Americi bi mogli. Recimo, Las Vegas:

<figure>
  <img class="responsive-img" src="/story/katar-smrti/klima/Average%20Hourly%20Temperature%20in%20Las%20Vegas.svg" />
  <figcaption>Prosječne temperature u Las Vegasu (SAD).</figcaption>
</figure>
 
Veliki gradovi na jugu Azije i tropske Afrike, odakle dolazi velika većina katarskih građevinskih radnika, u pravilu su vrući kroz cijelu godinu, iako temperature nisu toliko ekstremne kao u Katru. Evo primjer Šri Lanke:

<figure>
  <img class="responsive-img" src="/story/katar-smrti/klima/Average%20Hourly%20Temperature%20in%20Colombo.svg" />
  <figcaption>Prosječne temperature u Colombu (Šri Lanka).</figcaption>
</figure>

Sve u svemu, Katar ima ekstremno vrela ljeta, ali po tome nije izoliran slučaj. Usput, nisam našao da druge zemlje imaju toliko stroge zakone protiv rada na velikim vrućinama. Još od 2007. u Katru je na snazi zabrana rada vani po ljeti, i to dvostruka: prema datumu (trenutno 1.6.—15.9.) u najgore doba dana (trenutno 10:00—15:30), te dodatne zabrane bazirane na trenutnoj temperaturi i vlažnosti zraka, bez obzira koji je datum i doba dana.


## Je li to sve zbog SP-a?

Daljnja tipična pretpostavka koji mnogi mediji rade je da ti nesretni radnici nisu gradili bilo što, nego su svi bili angažirani na pripremama za Svjetsko prvenstvo 2022. [Slobodna Dalmacija](https://slobodnadalmacija.hr/vijesti/svijet/katarski-san-je-izgraden-na-nocnoj-mori-gastarbajtera-crncili-su-12-sati-dnevno-za-bijednu-nadnicu-tisuce-ih-je-na-gradilistima-ostavilo-kosti-the-guardian-je-sve-raskrinkao-1242183) kaže kako ih je "*6500 doslovce ostavilo kosti gradeći stadione*". Novinarima su stadioni naročito važni, iako ispada kako čine tek 3-5% troška pripreme za SP (između [6.5 i 10 milijardi dolara](https://www.forbes.com/sites/mattcraig/2022/11/19/the-money-behind-the-most-expensive-world-cup-in-history-qatar-2022-by-the-numbers/)). Kad spomenete stadione, onda čitatelji to lakše povežu s Prvenstvom.

Da FIFA nije dodijelila SP njima, nego recimo SAD-u, neki od onih koji su život okončali u Katru bi danas bili živi. Međutim, da Katar nije dobio SP, bi li potrošio novac na neke druge građevinske projekte? Siguran sam da se država ne bi odjednom prestala razvijati. Dobar dio investicija koji se broje pod trošak SP-a, poput metroa, bio je dogovoren i prije. Tih dvjestotinjak milijardi dolara Katarce je toliko žuljalo da bi vjerojatno pronašli druge projekte na koje bi ih mogli potrošiti.

A da i Katar uopće nema novaca, ti isti radnici bi radili na nekim drugim projektima, sa sličnim rizicima. Ako nečeg na Arapskom poluotoku ne nedostaje, to su gradilišta. Samo šaka najskupljih projekata koji se trenutno grade u Dubaiju vrijedi preko 200 milijardi dolara. Saudijska Arabija upravo radi [*The Line*](https://en.wikipedia.org/wiki/The_Line,_Saudi_Arabia), megaprojekt linearnog grada u pustinji čija je vrijednost pet puta veća.

A koliki je tamo mortalitet? Zadnjih godina Dubai među strancima ima oko [1500-2000 smrti godišnje](https://uaestat.fcsc.gov.ae/vis?lc=en&fs[0]=FCSC%20-%20Statistical%20Hierarchy%2C0%7CDeaths%23VTS_DEA%23&pg=0&fc=FCSC%20-%20Statistical%20Hierarchy&df[ds]=FCSC-RDS&df[id]=DF_DEATHS&df[ag]=FCSA&df[vs]=2.8.0&pd=2007%2C2019&dq=..AE-DU.A._T.NON-EMIRATI....&ly[rw]=TIME_PERIOD). Kad to podijelimo s [brojem stranaca](https://www.dsc.gov.ae/Report/DSC_SYB_2021_01_03.pdf), dobijemo stopu od 0,73 smrti na tisuću stranaca 2019. godine, kad je taj omjer u Katru bio 0,69.

Sve u svemu, da SP nije dodijeljen Katru, ne vidim da bi se išta bitno dogodilo. Posla bi svejedno bilo, u Katru i drugdje, potražnja za poslovima bi i dalje postojala. Siromašni Nepalci, Pakistanci, Kenijci bi i dalje migrirali, radili, ponekad i umirali. To su radili i prije priprema za SP u Katru, to će raditi i nakon što nogometaši i navijači odu doma.


## Koliko je stvarno radnika poginulo zbog SP-a?

Čak i nakon sveg ovog istraživanja, moram reći da ne znam. Najvažnije informacije nedostaju. Čak i kad bi imali potpuna medicinska izvješća o svakom smrtnom slučaju, točan broj jako ovisi o tome što ćete smatrati da treba pripisati poslu. Na kraju ostaje i pitanje kako taj broj usporediti s hipotetskom situacijom u kojoj FIFA nije dodijelila SP Katru nego nekoj drugoj državi.

No mislim kako sad imam puno bolju sliku što se događalo u Katru zadnjih godina. Moja amaterska analiza otkrila je puno detalja, od kojih nijedan ne podržava tezu da se u Katru događa nešto iznimno sa stranim radnicima. Da rekapituliram:

- Broj 6500 je samo tvrdnja iz jednog članka, koja ne uzima podatke o svim zemljama podrijetla, niti govori samo o radnicima na SP-u, niti uopće uzima u obzir od čega su ti ljudi umrli.
- Općenita stopa mortaliteta u Katru je najniža na svijetu, a mortalitet među strancima je još niži.
- Kad bi primijenili SAD-ov mortalitet na demografski profil stranaca u Katru, umiralo bi puno više ljudi.
- Tek manji dio stranaca radio je u građevini, a još manji na gradilištima SP-a.
- Analiza Svjetske zdravstvene organizacije i Međunarodne organizacije rada kaže da je Katar među državama s najmanje smrti od rada u svijetu.
- Klima u Katru jest ekstremna, ali je i tipična za Arapski poluotok i nije tako različita od uvjeta rada u nekim drugim tropskim i suptropskim velikim gradilištima.
- Da SP nije održan u Katru, vjerojatno bi se i dalje gradilo u sličnim uvjetima.

To ne znači kako je situacija u Katru super. Još uvijek je moguće da je lošija nego što se iz ovog članka čini, samo to iz nekog razloga nije vidljivo na spomenutim metrikama. Moja ambicija nije ni bila da otkrijem pravu istinu i utvrdim točan broj žrtava. Cilj mi je bio samo da ispitam koliko brojevi u našim (a i nekim uglednim svjetskim) novinama drže vodu.

A ne drže. Argumentacija im je šuplja i sav kredibilitet je davno iscurio. Najosnovnije stvari su radili krivo: poopćivali su tamo gdje nije trebalo, neispravno su pretpostavljali, oslanjali su se na neadekvatne heuristike, plasirali zavaravajuće podatke, a ni logika im nije uvijek štimala. Na ovaj način ne bi uspjeli izbrojati ni kokoši u kokošinjcu. I zato tim brojevima nije za vjerovati.

Ne kažem da je zadatak bio lagan, niti me iznenađuje što postoje površni novinari. Brine me samo što su se te klimave tvrdnje o žrtvama potpuno nekritički raširile po cijelom Zapadu.

Njihova namjera je, vjerujem, bila dobra. Htjeli su skrenuti pažnju na percipirani problem, utjecati na to da se loše stvari poprave i da se nepravde isprave. U usporedbi s tim, moj pristup izgleda pomalo hladan, iz distance. Govorio sam o tisućama smrti kao da su samo brojevi. Umjesto da sam čitao novinske članke o mladićima koji su se svojim obiteljima vratili u lijesu, ja sam svoje vrijeme trošio kopajući po statističkim izvještajima. Umjesto da sam srcu uzeo dojmove aktivista za ljudska prava, ja sam tražio opće metrike i globalne rang liste.

To ne znači da me nije briga za ljude, samo da ne želim da mi pojedinačni slučajevi ili partikularni interesi zaklone pogled na cijelu sliku. Pogled s visine je važan jer pokriva više ljudi i zato što je veće trendove teže sakriti ili nehotice previdjeti.

Ne želim ni da ispadne kako branim Katar i organizaciju SP-a, jer je istina upravo suprotna. Pišem ovo baš zato što ne volim autoritarne režime i korumpirane organizacije. Točne činjenice, transparentnost, jasna argumentacija: to su najbolja oružja koje imamo protiv njih. Dobre namjere nisu dovoljne ako prije toga nemamo realnu sliku što se u Katru događa. Zabrinjava me što oni o kojima ovisimo da nam prezentiraju realnu sliku, barum u ovom slučaju, ne mare previše.

<!--
## Zašto smo 

Mislim kako je prvo nastala priča o katastrofalnim uvjetima rada u Katru, i onda su se sve informacije prilagođavale toj priči. Ako je trebalo nategnuti, proširiti, pojednostavniti, ili ignorirati pojedine činjenice, to je bilo prihvatljivo — dokle god se uklapalo u priču. Umjesto da nam činjenice formiraju stavove, dogodilo se suprotno.

Pomogla je i želja da 

Mislim kako nismo navikli da veliki broj sirotinje radi za malu bogatu populaciju, barem kad je to eksplicitno za zabavu zapadnjaka. Loše uvjete rada je lakše ignorirati dok je to nešto daleko, negdje drugdje. Svjetsko prvenstvo nas je uplelo u kolo, i onda se više nismo osjećali da možemo 

Ne želimo da ljudi u našoj sredini budu presiromašni. Ne smeta nas da budu siromašni u svojoj vlastitoj zemlji, to je problem njihove države. Ali bogata zemlja poput Katra nije 

Ako su već prisiljeni tražiti sreću u inozemstvu, zašto ne dođu raditi u Europu? Padaju mi na pamet tri moguća razloga: 

- Europljani ih ne žele toliko koliko ih žele Arapi.
- Europljani im ne nude tako dobre uvjete kao Arapi.
- Imigranti nemaju mentalne kapacitete da shvate kako srljaju u ropstvo, mučenje i smrt u Katru. Čak i nakon deset godina iskustva još plaćaju ogromne svote agencijama da im osiguraju taj posao.

Također mislim da smatramo neprirodnim izgradnju takvih . Navikli smo na ugodnije klime

Na kraju mog istraživanja našao sam se u manjini. Svi koje čitam i gledam su uvjereni kako je ponašanje Katra prema uvoznoj radnoj snazi kriminalno, puno gore nego što je u većini azijskih zemalja. Kako su žrtve pripreme SP-a i veće od onih 6500 s kojim smo krenuli.

Na drugoj strani su ostali samo simpatizeri Katra (obično po političkoj ili religijskoj liniji) i navijači koji ne žele da im doživljaj gledanja nogometa pokvare takvi detalji.


Vjerojatno je kombinacija prva dva razloga.

Ropstvo? Prema Globalnom indeksu ropstva, udio "modernih robova" u Katru je četiri puta manji od Hrvatske! https://www.globalslaveryindex.org/2018/data/maps/#prevalence
-->