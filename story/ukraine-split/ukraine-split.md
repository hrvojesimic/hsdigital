# Svijet podijeljen oko Ukrajine

*Hrvoje Šimić, 2022-03-03*

_Freedom in the World_ je godišnje istraživanje i izvještaj nevladine organizacije _Freedom House_, bazirane u SAD-u. Mjeri razinu ljudskih sloboda i političkih prava svake zemlje. Svaku državu na svijetu možemo predstaviti kružićem na tom spektru:

<figure>
  <div id="Const_FitW" class="BubbleDensity" data-r="13" data-height="300" data-keyX="fitw">
  </div>
  <figcaption>
    <strong>Slika 1.</strong> Raspodjela bodova po izvještaju Freedom in the World 2021. Svaka država u izvještaju je jedna oznaka na skali.
  </figcaption>
</figure>

Na slici sam označio Rusiju, Ukrajinu i Hrvatsku bojama za orijentaciju. Ukrajina se već neko vrijeme pokušava politički odmaknuti od Rusije i približiti zemljama Europske Unije na desnoj strani ovog grafa.

No nisu sve zemlje jednako značajne, pa ni oznake ne bi trebale biti jednake veličine. No koju metriku važnosti zemlje odabrati?

U međunarodnim odnosima, moć pojedine zemlje se najlakše može procijeniti pomoću nekih generalnih ekonomskih indikatora, poput nominalnog bruto društvenog proizvoda (BDP-a). Ako pokušamo rasporediti države po toj dimenziji tako da formiraju graf gustoće, dobit ćemo sliku 1. Pazite: BDP je razmjeran površini kruga, a ne promjeru.

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
    <strong>Slika 3.</strong> Podjela na one koji su inicijalno za rat u Ukrajni krivili Rusiju (plavo),
    one koji krive Zapad (crveno), te neutralne ili neizjašnjene u sukobu (sivo).
    Prema <a href="https://www.statista.com/chart/26946/stance-on-ukraine-invasion/">analizi Statiste</a> od 28. veljače 2022., uz neke manje preinake.
    X-os je broj bodova na izvještaju <i>Freedom in the World</i> 2021.
    Površina kruga je razmjerna nominalnom BDP-u zemlje.
  </figcaption>
</figure>

Kako se koja zemlja opredjelila ponekad je teško isčitati iz nastupa političara, ali srećom dobili smo puno konkretnije mjerilo. Drugog ožujka 2022. Opća skupština Ujedinjenih naroda je glasala za rezoluciju kojom se oštro osuđuje Rusija. To je bila odlična prilika da se zemlje odrede javno i jasno gdje stoje. Na žalost Rusije, od 192 zemlje samo ih su još četiri glasale protiv rezolucije, dok je "za" bilo 141 zemalja (uz 35 suzdržanih i 12 odsutnih). Na karti vidite pregledno kako su države glasale:

<figure>
  <img class="responsive-img" src="/story/ukraine-split/UN_vote_map.svg" title="karta s glasovima" />
  <figcaption>
    <strong>Slika 4.</strong> Glasovi za UN rezoluciju kojom se osuđuje invazija Rusije na Ukrajinu na karti svijeta.
    Zemlje koje su glasale "za" su obojane zeleno, "protiv" crveno, suzdržani sivo, nisu glasali bijelo.
  </figcaption>
</figure>

Četiri zemlje koje drže stranu Rusije (Bjelorusija, Sirija, Sjeverna Koreja i Eritrea) su ekonomski marginalne, a graf pokazuje i kako su zemlje na "slobodnijem" kraju spektra deklarirano protiv Rusije, uz upadljivu iznimku Indije i Južnoafričke Republike:

<figure>
  <div id="GDP_FitW_votes" class="BubbleDensity votes" data-rmax="85" data-keyX="fitw">
  </div>
  <figcaption>
    <strong>Slika 5.</strong> Glasovi za UN rezoluciju kojom se osuđuje invazija Rusije na Ukrajnu.
    Zemlje koje su glasale "za" su obojane zeleno, "protiv" crveno, suzdržani sivo, nisu glasali bijelo.
    X-os je broj bodova na izvještaju <i>Freedom in the World</i> 2021.
    Površina kruga je razmjerna nominalnom BDP-u zemlje.
  </figcaption>
</figure>

Na desnoj strani nije samo NATO, nije samo Zapadna Europa i Sjeverna Amerika. U Ukrajini se nisu sukobili Istok i Zapad, nego političke filozofije.

## Drugi pokazatelji demokratičnosti zemlje

Kako ne biste pomislili da je Freedom House naročito pristran prema Amerikancima, evo prikaza alternativne analize Sveučilišta u Würzburgu, koja se zove **Democracy Matrix**:

<figure>
  <div id="GDP_Matrix" class="BubbleDensity votes" data-rmax="85" data-keyX="matrix">
  </div>
  <figcaption>
    <strong>Slika 6.</strong> Glasovi za UN rezoluciju kojom se osuđuje invazija Rusije na Ukrajnu.
    Zemlje koje su glasale "za" su obojane zeleno, "protiv" crveno, suzdržani sivo, nisu glasali bijelo.
    X-os je broj bodova na izvještaju <i>Democracy matrix</i> 2020. godine.
    Površina kruga je razmjerna nominalnom BDP-u pojedine zemlje.
  </figcaption>
</figure>

Također, **Democracy Index** koji slaže istraživački odjel časopisa The Economist:

<figure>
  <div id="GDP_Economist" class="BubbleDensity votes" data-rmax="85" data-keyX="eiu">
  </div>
  <figcaption>
    <strong>Slika 7.</strong> Glasovi za UN rezoluciju kojom se osuđuje invazija Rusije na Ukrajnu.
    Zemlje koje su glasale "za" su obojane zeleno, "protiv" crveno, suzdržani sivo, nisu glasali bijelo.
    X-os je <i>Democracy Index</i> The Economist Intelligence Unita 2021.
    Površina kruga je razmjerna nominalnom BDP-u pojedine zemlje.
  </figcaption>
</figure>

Boljih globalnih indikatora demokratskih instituacija nisam našao. Vrijednosti među tim pokazateljima se donekle razlikuju, ali slika je uvijek ista: desna strana se zeleni, lijeva strana je siva, s miksom zelene i crvene boje.

## Podjela prema stanovništvu

Gledajući u semafor glasanja Opće skupštine UN-a, na kojem je svaka zemlja-članica ravnopravna, zelena boja prevaže. Prevaže i na našoj slici ravnopravnih kružića:

<figure>
  <div id="Const_FitW_votes" class="BubbleDensity votes" data-r="13" data-height="300" data-keyX="fitw">
  </div>
  <figcaption>
    <strong>Slika 8.</strong> Države po bodovima Freedom in the World 2021.
    Zemlje koje su glasale "za" UN rezoluciju iz teksta su obojane zeleno, "protiv" crveno, suzdržani sivo, nisu glasali bijelo.
  </figcaption>
</figure>

No što ako, umjesto BDP-a, krugove nacrtamo da budu površinom razmjerni broju stanovnika? Sad se slobodne i neslobodne zemlje ne odvajaju tako jasno, i fronta protiv Rusije izgleda manje impresivno:

<figure>
  <div id="pop_FitW_votes" class="BubbleDensity votes" data-rmax="85" data-keyX="fitw" data-keyr="pop">
  </div>
  <figcaption>
    <strong>Slika 9.</strong> Glasovi za UN rezoluciju kojom se osuđuje invazija Rusije na Ukrajnu.
    Zemlje koje su glasale "za" su obojane zeleno, "protiv" crveno, suzdržani sivo, nisu glasali bijelo.
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
caption: **Slika 10** Udio stanovništva u članicama UN-a, po glasovima za rezoluciju koja osuđuje invaziju Rusije na Ukrajinu.
```

I po broju i po ekonomskoj moći članica koje su glasale "za", rezolucija Ujedinjenih naroda je velika pobjeda liberalne politike. Pa opet, većina stanovništva Zemlje se nalazi u državama koje nisu htjele osuditi Rusiju zbog invazije na Ukrajinu.

<!--["#74c365","#ab4e52","#89cff0","#fada5e"]-->