# Rusi podržavaju Putina

*Hrvoje Šimić, 07.04.2022.*

<span class="dropcap">O</span>tkad je počela invazija na Ukrajinu, slušam mnoga upozorenja da krivnju s ruske strane treba tražiti isključivo u Putinu i malom krugu ljudi oko njega. Rusko vodstvo je loše, no ruski narod nije zbog toga kriv. Nitko nije pitao narod želi li rat. Da ih je pitao, do rata ne bi nikad došlo. Da ih netko sad pita, ruska armija bi se povukla i sve bi opet bilo dobro.

No, znamo li stvarno što većina građana Ruske Federacije misli o svom vodstvu? [Istraživački centar Levada](https://en.wikipedia.org/wiki/Levada_Center) Rusima svaki mjesec postavlja [jedno te isto pitanje](https://www.levada.ru/en/ratings/):

> Odobravate li aktivnosti Vladimira Putina kao predsjednika (premijera) Rusije?

Udio onih koji su se eksplicitno izrazili da odobravaju Putinov politički rad kretao se kroz godine ovako:

<figure>
  <div id="PopularityChart"></div>
  <figcaption>
    <strong>Slika 1.</strong> Postotak ispitanika koji podržava Vladimira Putina kroz godine njegove vladavine, i neki važni događaji u tom razdoblju.
  </figcaption>
</figure>

Iz grafa mogu iščitati sljedeće:

- Putin je na vlasti već više od 22 godine, što je svojstveno samo diktaturama. Nedavne promjene ustava omogućile su mu da vladavinu produži čak do 2036., kad će imati 83.
- Po ovom istraživanju, kroz sve razdoblje njegove vladavine udio građana koji ga eksplicitno podržavaju _nikad_ nije pao ni blizu 50%, što je nečuveno visoko za liberalne demokracije.
- Podrška mu naglo raste svaki put kad izvrši invaziju ili pokrene rat, naročito kad je Rusija preuzela Krim i sad kad su pokrenuli invaziju na cijelu Ukrajinu. Iako je efekt "okupljanja oko zastave" (naglog skoka podrške vlasti u trenutcima međunarodnog sukoba) čest svugdje u svijetu, on obično nije toliko velik niti približno toliko trajan kao što je bio u Rusiji nakon aneksije Krima.
- Podrška mu pada kad je ugrožen standard i komfor građana, npr. produljenja starosne dobi za mirovinu, ili za vrijeme COVID lockdowna.
- Proganjanja, trovanja i ubijanja kritičara njegove vlasti, novinara i oporbenih političara, kao ni donošenje zakona kako bi ga se učvrstilo na vlasti i oslabile institucije liberalne demokracije, čini se, nemaju nekog utjecaja na Putinovu popularnost među narodom.

Ovo sve formira poprilično ružnu sliku o stavovima ruske javnosti. Predsjednik im je bio najprivlačniji kad bi pokrenuo agresiju na drugu zemlju, a najmanje su ga podržavali kad su se sami morali nečega odreći. Gledali su kako uništava višestranačje i objektivno novinarstvo, gledali su kako kritičari vlasti završavaju otrovani ili s rupom u glavi, i to nije utjecalo na ispitivanja podrške Putinu.

Toleriranje propadanja liberalne demokracije je važno, jer nas dovodi do još jednog argumenta zašto ruski narod nije kriv. Rusi, kažu, ne mogu ništa poduzeti po državničkim pitanjima jer nemaju potpune informacije, nemaju politički izbor, nemaju institucije koje koče i uravnotežuju izvršnu vlast ([_checks and balances_](https://www.britannica.com/topic/checks-and-balances)). Bespomoćni su, žrtve su jednako kao i Ukrajinci.

No, nije u Rusiji uvijek bilo jednako loše. 


### Kako napreduje demokracija pod Putinom?

Najdetaljniju analizu demokratske situacije u Rusiji (a i u svim drugim državama svijeta) daje projekt [_Varijacije demokracije_](https://www.v-dem.net/) (V-Dem) Sveučilišta u Göteborgu u Švedskoj. Među njihovim mjerama odabrao sam četiri koja su se činila važna za obuzdavanje Putinove moći:

1. kolika je sloboda izražavanja i pristup alternativnim izvorima informacija (indeks _v2x\_freexp\_altinf_)
2. koliko su pošteni izbori (_v2x\_polyarchy_)
3. koliko zakonodavna vlast ograničava izvršnu vlast (_v2xlg\_legcon_)
4. koliko sudska vlast ograničava izvršnu vlast (_v2x\_jucon_)

Evo kako su se mijenjali ti indeksi kroz godine moderne Ruske Federacije:

```vly
width: 400
height: 300
autosize: { type: fit, resize: true }
data: { name: vdemPoints }
mark: line
encoding:
  x:
    field: id
    type:  ordinal
    title: godina
  y:
    field: value
    type:  quantitative
    title: vrijednost indeksa
  color:
    field: valueKey
    type: nominal
    title: V-Dem indeks
    sort:
      field: value
      op: mean
      order: descending
    legend:
      orient: none
      legendX: 200
      legendY: 23
      values:
        - v2x_freexp_altinf
        - v2xlg_legcon
        - v2x_polyarchy
        - v2x_jucon
      labelExpr: "datum.label == 'v2x_polyarchy'? 'pošteni izbori' : datum.label == 'v2x_jucon'? 'sudovi ograničavaju izvršnu vlast' : datum.label == 'v2x_freexp_altinf'? 'sloboda izražavanja i informiranja' : datum.label == 'v2xlg_legcon'? 'zakonodavac ograničava izvršnu vlast' : datum.label"
caption: "Slika 2: Promjena vrijednosti određenih političkih indeksa u Rusiji u razdoblju 1990—2021, prema istraživanju Varijacije u demokraciji (V-Dem). Viša vrijednost indeksa znači bolju situaciju."
```

Bez gledanja u x-os, bi li mogli reći kad je Rusija postala demokracija, a kad Putin počinje preuzimati vlast? Mislim kako bi mogli. Jasno se vidi: što je dulje Putin na vlasti, to je demokracija u Rusiji u gorem stanju. Ne samo za ove odabrane indekse — svi glavni V-Dem parametri se tijekom Putinove vladavine pogoršavaju. 

I to pogoršavanje nije bilo nevidljivo za građane Rusije. Za razliku od sovjetskog doba, u 21. stoljeću su neovisni mediji puno dostupniji, naročito putem Interneta. Rusima su znali da Putinove kritičare guta mrak, da se donose zakoni koji učvršćuju i produžuju njegovu vlast, da televizija servira samo ono što Kremlj želi da građani čuju. Lako su mogli saznati kako se njihova zemlja nalazi pri dnu ljestvica država svijeta po političkim slobodama. U 2021., Rusija je među svim zemljama svijeta bila:
  
  - [101\.](https://worldjusticeproject.org/rule-of-law-index/global) po indeksu vladavine prava World Justice Projecta,
  - [126\.](https://freedomhouse.org/countries/freedom-world/scores?sort=desc&order=Total%20Score%20and%20Status) po indeksu ljudskih sloboda Freedom Housea,
  - [136\.](https://www.transparency.org/en/cpi/2021) po indeksu percepcije korupcije Transparency Internationala,
  - [150\.](https://rsf.org/en/ranking/2021) po indeksu medijskih sloboda organizacije Reporteri bez granica.

Znali su, i svejedno su podržavali vlast.

Ne kažem kako su trebali dignuti još jednu revoluciju. Ne kažem niti da trebaju protestirati na ulicama, riskirati da ih policija prebije i baci u zatvor. Možda masovni štrajkovi i bojkoti nisu bili praktični. Možda će netko reći i da nije bilo puno boljih kandidata za predsjednika. No čak i da stavimo sve to sad sa strane, još ostaje jedna vrlo, vrlo niska ljestvica koji su Rusi trebali preskočiti — kad ih neovisni anketar pita: "Odobravate li aktivnosti Vladimira Putina kao predsjednika Rusije?" da samo odšute. Da ne kažu: "Odobravam!"

Jer ako masovno odobravate takvu politiku dvadeset godina, onda se nemate pravo čuditi kad vidite da vam fali objektivnih informacija u medijima, da nemate institucije koje bi zauzdale samovlast predsjednika, da nemate alternativu za koje možete glasati na izborima.

<figure class="center-align">
  <img style="width: 400px" class="responsive-img" src="/story/putin/pikachu.png" title="iznenađeni Pikaču" />
  <figcaption><strong>Slika 3.</strong> Kratka povijest Ruske Federacije u 21. stoljeću.</figcaption>
</figure>

### Ruska ekonomija

Rusi su vidjeli kako institucije liberalne demokracije propadaju, a u isto to vrijeme su vidjeli kako ruska ekonomija napreduje. Kao što možemo vidjeti na ovom grafu iz _Our World in Data_, ruski BDP po glavi stanovnika je znatno narastao pod Putinovim vodstvom, obrćući loš trend iz devedesetih godina 20. stoljeća. Unatoč nametnutim sankcijama, Rusija raste brže od prosjeka Istočne Europe, i smanjuje razliku u odnosu na Zapadnu Europu.

<figure>
<iframe src="https://ourworldindata.org/grapher/gdp-per-capita-maddison-2020?time=1990..2018&country=Western+Europe~Eastern+Europe~RUS" loading="lazy" style="width: 100%; height: 600px; border: 0px none;"></iframe>
<figcaption><strong>Slika 4.</strong> Prikaz promjene BDP-a po glavi stanovnika kroz godine u Zapadnoj Europi, Istočnoj Europi i Ruskoj Federaciji.</figcaption>
</figure>

Kao što piše politolog iz UCLA Daniel Treisman u svojoj [analizi popularnosti Jeljcina i Putina](https://www.jstor.org/stable/23024939) iz 2010., upravo taj ekonomski rast i djelomični povratak Rusije na položaj koji je uživala kao jezgra Sovjetskog Saveza najbolje objašnjava podršku Putinu:

> Jeljcinova i Putinova popularnost su blisko vezani uz to kako javnost percipira gospodarsku situaciju, a ta percepcija odražava objektivne ekonomske pokazatelje. Iako su medijske manipulacije, ratovi, teroristički napadi i drugi događaji također važni, Putinova popularnost bez presedana i Jeljcinov pad popularnosti dobro su objašnjeni njihovim različitim ekonomskim okolnostima.

Ekonomske prilike u zemlji sigurno objašnjavaju dobar dio povjerenja koji njegovi građani poklanjaju Putinu. No, u razdoblju za koje Treisman analizira podatke nije bilo velikih vojnih akcija i teritorijalnog širenja — kasnije se upravo oni smatraju velikim utjecajem na javno mnijenje u Rusiji. Stoga se čini razumno za pretpostaviti da široka podrška Putinu ne dolazi _usprkos_ njegovoj agresivnoj domaćoj i vanjskoj politici, nego baš _zbog_ nje.


## Možemo li vjerovati anketama?

No, stanimo malo na loptu. Možda niste uvjereni da ovi podaci prenose stvarno stanje uma ruskih građana. Možda istraživači lažiraju rezultate, kako bi Putina prikazali popularnijim nego što stvarno jest? Što je ta Levada? Zašto bi vjerovali njima?

Levada je nevladina organizacija za sociološka istraživanja u Rusiji. Vrlo je cijenjena u svijetu, mediji je zovu "posljednjom neovisnom" i "najpouzdanijom", a zbog svog rada je bila na udaru ruskog režima. Tražio sam i drugačija mišljenja, ali sva ispitivanja javnog mnijenja koja sam uspio otkriti daju gotovo identične rezultate Levadinima:

1. VCIOM (ВЦИОМ) je ruski centar za istraživanje javnog mnijenja u državnom vlasništvu. Redovito pitaju ruske državljane vjeruju li određenim političarima. Njihovi [rezultati](https://wciom.ru/ratings/doverie-politikam/) (udio onih koji su rekli "bezuvjetno vjerujem" + "vjerujem" za Putina) su vrlo slični Levadinim brojkama.

2. [Istraživanje](https://scottgehlbach.net/wp-content/uploads/2018/01/FGMR-Putin.pdf) skupine politologa iz SAD-a i Švedske s početka 2015. zaključuje da je podrška Putinu među Rusima otprilike 80%. Tako i Levada procjenjuje za to doba.

3. [Gallupova istraživanja](https://news.gallup.com/poll/223382/russians-happier-putin-country-direction.aspx) u razdoblju 2012.— 2017. bilježi podršku Putinu od 54% prije, do 85% posto nakon aneksije Krima. To su nešto niži brojevi od Levade u 2012. i 2013., ali za ostale godine se dobro poklapaju.

Prema onom što sam ja uspio pronaći, stručnjaci ne sumnjaju da se izražene preferencije ruskih građana poprilično vjerno prenose. Čini se da većina Rusa podržava Vladimira Putina, naročito kad napada teritorij druge države.


### Samocenzura ispitanika

Možda nije problem u agencijama iz istraživanje javnog mnijenja. Možda je problem samocenzura građana Rusije. Ispitanici su ti koji ne govore istinu — u tajnosti su protiv vlasti, ali se to ne usude priznati ispitivačima. U stručnoj literaturi se ovaj fenomen naziva krivotvorenjem preferencija ([_preference falsification_](https://en.wikipedia.org/wiki/Preference_falsification)). 

Jedan od načina na koji znanstvenici pokušavaju zaobići ovaj problem su popisni pokusi (_list experiments_), u kojem osjetljivu izjavu uklopite u dulji popis drugih i onda ispitanicima samo kažete da upišu samo _broj_ izjava s kojima se slažu. Tako se ispitanici osjećaju sigurno da nisu otkrili svoje osobne preferencije, no na velikom broju ispitanika se mogu primijetiti odstupanja u odnosu na ispitanike koji su dobili popis bez osjetljive izjave.

Istraživači Chapkovski i Schaub su nedavno ovu tehniku koristili da saznaju koliko Rusa podržava djelovanje ruske vojske u Ukrajini. Otkrili su kako će dvije trećine Rusa osobno podržati rat, ako ih izravno pitate. No, preko popisa ovaj udio pada na 53% — još uvijek većina, ali ne tako premoćna. Međutim, upozoravaju kako se isti zaključak ne može primijeniti na Putina:

> biti protiv rata nije isto što i biti protiv Putina, čija bi visoka razina potpore mogla biti stvarna, kao što je pokazao drugi eksperiment s popisom.

Taj drugi eksperiment opisan je u članku [_Je li Putinova popularnost stvarna?_](https://www.tandfonline.com/doi/abs/10.1080/1060586X.2016.1144334) objavljenom 2016. u časopisu _Post-Soviet Affairs_. Frye i suradnici nalaze na dokaze da dio ljudi stvarno skriva svoje protivljenje Putinu, no efekt je relativno mali. Na kraju zaključuju:

> glavna prepreka nastanku širokog oporbenog pokreta nije u tome što se Rusi boje izraziti svoje neodobravanje, već to što je Putin zapravo prilično popularan.

Eemil Mitikka sa Sveučilišta u Helsinkiju u članku [_Trebamo li vjerovati ruskim ispitivanjima javnog mnijenja?_](https://sites.utu.fi/bre/should-we-trust-russian-surveys/) pobrojava razloge zašto sumnjati u iskrene odgovore o Putinu, no na kraju zaključuje da je "malo vjerojatno" da je njegova popularnost znatno niža od prijavljene, najviše zbog toga što "podaci dosta dosljedno prate političke trendove i događaje u Rusiji".

Kizlova i Norris u analizi [_Što obični Rusi stvarno misle o ratu u Ukrajini?_](https://blogs.lse.ac.uk/europpblog/2022/03/17/what-do-ordinary-russians-really-think-about-the-war-in-ukraine/) govore o procjenama podrške ratu u Ukrajini, koja je usko vezana uz podršku Putinu:

> sumnjamo kako bi i najizdašnije procjene pristranosti odgovora uspjele preokrenuti ravnotežu javnog mnijenja izjavljenog u mnogim ranim anketama koje podržavaju upotrebu vojne sile u Ukrajini.


## Jesu li Rusi krivi za rat?

Putin vodi Rusiju putem diktature i rata. Većina Rusa tim putem kroči voljno i veselo. Oni koji se hrabro (neki od njih herojski hrabro!) bore protiv tog puta, u debeloj su manjini. Jesu li onda Rusi kolektivno krivi za ovu invaziju?

Nije mi namjera dijeliti krivnju narodima. Nisu Rusi ni prvi ni zadnji koji su svojim ponašanjem učvrstili autokratski režim, a ne bih ni stavio ruku u vatru da bi se moja nacija u istoj situaciji ponašala drugačije. Ne mislim niti kako prosječan Rus želi rat u Ukrajini, da Ruski mladići ginu, niti da ubijaju tuđu djecu i uništavaju tuđe gradove.

No, u isto vrijeme, taj isti građanin vjerojatno misli kako je Putinu više stalo do Rusije nego što je ukrajinskoj vlasti, ili vođama NATO-a, ili bilo kojoj stranoj sili stalo do Rusije. Siguran je i kako je Putin upućeniji od njega da može procijeniti koji konkretan politički (ili vojni) potez je dugoročno bolji za Rusiju. Možda mu se i sviđa što pod Putinovim vodstvom Rusija djelomično vraća važnost na geopolitičkoj sceni kakvu je imala prošlo stoljeće, da se njegove države ponovno boje, da postaje moćnija. Ponosan je na svoj narod, ne želi da dođu pod strani utjecaj, ili da se ikome ispričavaju i od ikog sklanjaju.

Pa što ako ljudi u nekim drugim državama umiru, pate i strepe od ruske sile? Uvijek je negdje neka kriza, i vjerojatno su ti ljudi sami krivi za to što im se dogodilo. Možemo li od običnog ruskog građanina očekivati da se brine o problemima cijelog svijeta, da preuzme na sebe odgovornost za akcije jedne svjetske sile? Dok nije gladan, dok ne provodi noći u skloništima, vjerojatno ima drugih stvari od državne politike o kojima se treba brinuti.

A trenutna politička situacija u zemlji mu pomaže da se ne brine. Ne mora istraživati kontradiktorne izvore informacija — njegova televizija servira umirujući narativ da je s Rusijom sve u redu i da se ništa ne mora mijenjati. Ne mora riskirati s dovođenjem neke druge političke opcije na vlast, ako mu je dobro pod sadašnjim režimom. Kao što je Hannah Arendt primijetila, zlo stvarno može biti tako banalno, lijeno, pasivno. Ako plaća redovito stiže i mirovina se bliži, lakše je sebi ponavljati umirujuće fraze nego propitivati temelje društva.
