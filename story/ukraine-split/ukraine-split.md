# Svijet podijeljen oko Ukrajine

*Hrvoje Šimić, 2022-03-04*

<span class="dropcap">F</span>[_reedom in the World_](https://freedomhouse.org/report/freedom-world) je godišnje istraživanje i izvještaj nevladine organizacije [_Freedom House_](https://freedomhouse.org/), bazirane u SAD-u. Mjeri razinu ljudskih sloboda i političkih prava svake zemlje. Ako svaku državu predstavimo kružićem, dobijemo poprilično ravnomjeran raspored po cijeloj duljini tog spektra, od Sirije na lijevom rubu pa sve do nordijskih zemalja desno:

<figure>
  <div id="Const_FitW" class="BubbleDensity" data-r="13" data-height="300" data-keyX="fitw">
  </div>
  <figcaption>
    <strong>Slika 1.</strong> Raspodjela bodova po izvještaju Freedom in the World 2021. Svaka država u izvještaju je jedan kružić. Točan broj bodova i naziv države možete vidjeti na hover/tap.
  </figcaption>
</figure>

Na slici sam označio Rusiju, Ukrajinu i Hrvatsku bojama za orijentaciju. Ukrajina se već neko vrijeme pokušava politički odmaknuti od Rusije i približiti zemljama Europske Unije na desnoj strani ovog grafa.

No nisu sve zemlje jednako značajne, pa ni oznake ne bi trebale biti jednake veličine. No koju metriku važnosti zemlje odabrati?

U međunarodnim odnosima, moć pojedine zemlje se najlakše može procijeniti pomoću nekih generalnih ekonomskih indikatora, poput nominalnog bruto društvenog proizvoda (BDP-a). Ako pokušamo rasporediti države po toj dimenziji tako da formiraju graf gustoće, dobit ćemo sliku 2. Pazite: BDP je razmjeran površini kruga, a ne promjeru.

<figure>
  <div id="GDP_FitW" class="BubbleDensity" data-rmax="85" data-keyX="fitw">
  </div>
  <figcaption>
    <strong>Slika 2.</strong> Zemlje svijeta raspoređene prema broju bodova na izvještaju <em>Freedom in the World</em> 2021.
    Površina kruga je razmjerna nominalnom BDP-u zemlje (procjena UN-a za 2021. godinu).
  </figcaption>
</figure>

Ispada da je najveća moć koncentrirana na polovima ovog spektra: države s autoritarnim režimima zbile su se uz lijevi kut, dok su liberalne demokracije zauzele desni dio grafa.

Što se dogodi kad ove krugove obojimo ovisno o tome kako su se diplomatski svrstali u sukobu, krive li Rusiju ili Zapad? Reakcije u prvih par dana pokazuju zanimljivu podjelu:

<figure>
  <div id="GDP_FitW_split" class="BubbleDensity split" data-rmax="85" data-keyX="fitw">
  </div>
  <figcaption>
    <strong>Slika 3.</strong> Podjela na one koji su inicijalno za rat u Ukrajini krivili Rusiju (plavo),
    one koji krive Zapad (crveno), te neutralne ili neizjašnjene u sukobu (sivo).
    Prema <a href="https://www.statista.com/chart/26946/stance-on-ukraine-invasion/">analizi Statiste</a> od 28. veljače 2022., uz neke manje preinake.
    X-os je broj bodova na izvještaju <i>Freedom in the World</i> 2021.
    Površina kruga je razmjerna nominalnom BDP-u zemlje.
  </figcaption>
</figure>

Kako se koja zemlja opredijelila ponekad je teško iščitati iz nastupa političara, ali srećom dobili smo puno konkretnije mjerilo. Drugog ožujka 2022. Opća skupština Ujedinjenih naroda je glasala za [rezoluciju](https://en.wikipedia.org/wiki/United_Nations_General_Assembly_Resolution_ES-11/1) kojom se oštro osuđuje Rusija. To je bila odlična prilika da se zemlje odrede javno i jasno gdje stoje. Na žalost Rusije, od 192 zemlje samo ih su još četiri glasale protiv rezolucije, dok je "za" bilo 141 zemalja (uz 35 suzdržanih i 12 odsutnih). Na karti vidite kako je koja država glasala:

<figure>
  <img class="responsive-img" src="/story/ukraine-split/UN_vote_map.svg" title="karta s glasovima" />
  <figcaption>
    <strong>Slika 4.</strong> Glasovi za UN rezoluciju kojom se osuđuje invazija Rusije na Ukrajinu na karti svijeta.
    Zemlje koje su glasale "za" su obojene zeleno, "protiv" crveno, suzdržani sivo, nisu glasali bijelo.
  </figcaption>
</figure>

Četiri zemlje koje drže stranu Rusije (Bjelorusija, Sirija, Sjeverna Koreja i Eritrea) su ekonomski marginalne, a graf pokazuje i kako su zemlje na "slobodnijem" kraju spektra deklarirano protiv Rusije, uz upadljivu iznimku Indije i Južnoafričke Republike:

<figure>
  <div id="GDP_FitW_votes" class="BubbleDensity votes" data-rmax="85" data-keyX="fitw">
  </div>
  <figcaption>
    <strong>Slika 5.</strong> Glasovi za UN rezoluciju kojom se osuđuje invazija Rusije na Ukrajinu.
    Zemlje koje su glasale "za" su obojene zeleno, "protiv" crveno, suzdržani sivo, nisu glasali bijelo.
    X-os je broj bodova na izvještaju <i>Freedom in the World</i> 2021.
    Površina kruga je razmjerna nominalnom BDP-u zemlje.
  </figcaption>
</figure>

Na desnoj strani nije samo NATO, nije samo Zapadna Europa i Sjeverna Amerika. U Ukrajini se nisu sukobili Istok i Zapad, nego političke filozofije.

## Drugi pokazatelji demokratičnosti zemlje

Kako ne biste pomislili da je Freedom House naročito pristran prema Amerikancima, evo prikaza alternativne analize Sveučilišta u Würzburgu, koja se zove [**Democracy Matrix**](https://www.democracymatrix.com/):

<figure>
  <div id="GDP_Matrix" class="BubbleDensity votes" data-rmax="85" data-keyX="matrix" data-decimals="2">
  </div>
  <figcaption>
    <strong>Slika 6.</strong> Glasovi za UN rezoluciju kojom se osuđuje invazija Rusije na Ukrajinu.
    Zemlje koje su glasale "za" su obojene zeleno, "protiv" crveno, suzdržani sivo, nisu glasali bijelo.
    X-os je broj bodova na izvještaju <i>Democracy matrix</i> 2020. godine.
    Površina kruga je razmjerna nominalnom BDP-u pojedine zemlje.
  </figcaption>
</figure>

Također, [**Democracy Index**](https://www.eiu.com/n/campaigns/democracy-index-2021/) koji slaže istraživački odjel časopisa [_The Economist_](https://www.economist.com/):

<figure>
  <div id="GDP_Economist" class="BubbleDensity votes" data-rmax="85" data-keyX="eiu" data-decimals="1">
  </div>
  <figcaption>
    <strong>Slika 7.</strong> Glasovi za UN rezoluciju kojom se osuđuje invazija Rusije na Ukrajinu.
    Zemlje koje su glasale "za" su obojene zeleno, "protiv" crveno, suzdržani sivo, nisu glasali bijelo.
    X-os je <i>Democracy Index</i> The Economist Intelligence Unita 2021.
    Površina kruga je razmjerna nominalnom BDP-u pojedine zemlje.
  </figcaption>
</figure>

Boljih globalnih indikatora demokratskih institucija nisam našao. Vrijednosti među tim pokazateljima se donekle razlikuju, ali slika je uvijek ista: desna strana se zeleni, lijeva strana je siva, s miksom zelene i crvene boje.

## Podjela prema stanovništvu

Gledajući u semafor glasanja Opće skupštine UN-a, na kojem je svaka zemlja-članica ravnopravna, zelena boja prevaže. Prevaže i na našoj slici ravnopravnih kružića:

<figure>
  <div id="Const_FitW_votes" class="BubbleDensity votes" data-r="13" data-height="300" data-keyX="fitw">
  </div>
  <figcaption>
    <strong>Slika 8.</strong> Države po bodovima Freedom in the World 2021.
    Zemlje koje su glasale "za" UN rezoluciju iz teksta su obojene zeleno, "protiv" crveno, suzdržani sivo, nisu glasali bijelo.
  </figcaption>
</figure>

No što ako, umjesto BDP-a, krugove nacrtamo da budu površinom razmjerni broju stanovnika? Sad se slobodne i neslobodne zemlje ne odvajaju tako jasno, i fronta protiv Rusije izgleda manje impresivno:

<figure>
  <div id="pop_FitW_votes" class="BubbleDensity votes" data-rmax="85" data-keyX="fitw" data-keyr="pop">
  </div>
  <figcaption>
    <strong>Slika 9.</strong> Glasovi za UN rezoluciju kojom se osuđuje invazija Rusije na Ukrajinu.
    Zemlje koje su glasale "za" su obojene zeleno, "protiv" crveno, suzdržani sivo, nisu glasali bijelo.
    X-os je broj bodova na izvještaju <i>Freedom in the World</i> 2021.
    Površina kruga je razmjerna <b>broju stanovnika</b> pojedine zemlje.
  </figcaption>
</figure>

Siromašnije afričke i azijske zemlje koje su bile suzdržane ili odsutne sad više dolaze do izražaja. Štoviše, siva boja prevladava. Kad zbrojimo sve stanovništvo tih zemalja, dolazimo do ove razdiobe:

```vly
width: 320
height: 200
autosize: { resize: true }
data: 
  name: popVote
mark:
  type: arc
  innerRadius: 67
encoding:
  theta:
    field: pop
    type:  quantitative
  color:
    field: label
    type:  nominal
    title: glas
    scale:
      range: ["limegreen","salmon","white","lightgray"]
  text:
    field: label
    type: nominal
config:
  view:
    stroke: transparent
caption: Slika 10. Udio stanovništva u članicama UN-a, po glasovima za rezoluciju koja osuđuje invaziju Rusije na Ukrajinu.
```

I po broju i po ekonomskoj moći članica koje su glasale "za", rezolucija Ujedinjenih naroda je velika pobjeda liberalne politike. Pa opet, većina stanovništva Zemlje se nalazi u državama koje nisu htjele osuditi Rusiju zbog invazije na Ukrajinu. To možda i nije toliko važno danas, koliko će biti u budućim godinama. "Sive" i "bijele" zemlje će sigurno postati bogatije, brojnije, vjerojatno i utjecajnije, no nije sigurno hoće li postati i liberalnije. Hoće li im za unutrašnju i vanjsku politiku uzor biti EU ili današnja Rusija?
