# Preklapanje valova

*Hrvoje Šimić, 21.09.2020. — podaci [Our World in Data](https://ourworldindata.org/coronavirus-source-data)*

<p class="low-key card-panel yellow lighten-4">
  <i class="small material-icons" style="vertical-align: bottom;">warning</i> Autor teksta nije epidemiolog ni statističar. Ispravci i konstruktivne kritike su dobrodošle.
</p>

Razdioba potvrđenih slučajeva po datumu dijagnoze u Hrvatskoj izgleda otprilike ovako:

<div class="schart" data-territory="Croatia" data-show="c" data-dmax="10" data-radius="0"></div>

Mogu se primjetiti "valovi" zaraze, prvi od ožujka do svibnja, i zatim dva dodatna vrha, jedan u srpnju i drugi na prijelazu iz kolovaza u rujan.

Broj smrti je bitno manji i teže ih je vremenski grupirati zbog šuma koji prirodno iskače kad radimo s manjim skupom podataka:

<div class="schart" data-territory="Croatia" data-show="d" data-dmax="10" data-radius="0"></div>

Stoga pokušajmo "ispeglati" graf uzimajući vremenske prosjeke. Uzet ćemo vrlo širok pomični prozor, po 15 dana sa svake strane, jer nam ne treba razlučivost manja od mjeseca. Na taj način dobijemo puno glađu krivulju koja još uvijek prikazuje ove karakteristike vala. Posljednja dva tjedna na krivulji su prosjeci dostupnih dana u pomičnom prozoru

<div class="schart" data-territory="Croatia" data-show="c"></div>

Krivulja smrti je malo manje glatka ali ugrubo pokazuje slične trendove.

<div class="schart" data-territory="Croatia" data-show="d" data-dmax="3.5"></div>

Kad prikažemo ova dva vremenska slijeda na istom dijagramu možemo vidjeti da val smrti "kasni" za poznatim slučejevima, očito zato što većina takvih slučajeva bude dijagnosticirana danima ili čak tjednima prije fatalnog ishoda.

<div class="schart" data-territory="Croatia" data-dmax="3.5"></div>

Da bi lakše usporedili vremenske trendove, pokušajmo preklopiti plavu i crvenu krivulju u prvom valu, jer smo imali situaciju da su do zamaha drugog vala svi prvovalni slučajevi bili zaključeni ozdravljenjem ili smrću. Skalu na y-osi možemo lako promijeniti da slika prvog vala postane slična po visini.

<div class="schart" data-territory="Croatia" data-dmax="10"></div>

Drugi korak preklapanja je malo problematičniji. Pokušat ćemo crveni graf translatirati po x-osi tako da dobijemo što je moguće bolje podudaranje s plavim. Prema ovoj slici, najbolje preklapanje se dobije ako prikaz smrtnih slučajeva pomaknemo za otprilike 19 dana u prošlost.

<div class="schart" data-territory="Croatia" data-offset="19" data-dmax="10"></div>

Vidimo kako je u drugom valu takvo kašnjenje od otprilike 19 dana, samo što je ovaj put broj smrti otprilike dvostuko manji u usporedbi s brojem slučajeva. No 

## Na Zapadu nešto novo

Italija je bila prvo veliko žarište novog koronavirusa u Europi. No u ljetnim mjesecima broj smrtnih slučajeva više nije pratio porast COVID-19 dijagnoza:

<div class="schart" data-territory="Italy" data-offset="4" data-dmax="660"></div>

Španjolska je slijedila Italiju u stopu. Njen drugi val je po broju potvrđenih slučajeva još puno gori, ali u drugom valu više nema velikog porasta smrtnih ishoda:

<div class="schart" data-territory="Spain" data-offset="6" data-dmax="1230"></div>

Francuska je prijavila ukupno veći broj smrtnih slučajeva od Španjolske, ukupno gledajući, ali po smrtnosti izgleda da se drži nevjerojatno dobro:

<div class="schart" data-territory="France" data-offset="7" data-dmax="1750"></div>

Belgija, koja je bila najgore pogođena zemlja u smislu broja umrlih po glavi stanovnika, također pokazuje vrlo povoljnu statistiku unatoč velikom broju infekcija:

<div class="schart" data-territory="Belgium" data-offset="5" data-dmax="225"></div>

Njemačka malo odudara jer smrti ne kasne 4-7 dana nego puna dva tjedna. No pravilnost ostaje ista: dobro preklopljen prvi val i onda — vrlo malo loših ishoda:

<div class="schart" data-territory="Germany" data-offset="14" data-dmax="195"></div>

Ujedinjeno Kraljevstvo ima malo čudniju krivulju, jer se čini kako je u polovici prvog vala učestalost smrtnog ishoda značajno pala, i nastavila je drastično padati:

<div class="schart" data-territory="United Kingdom" data-offset="4" data-dmax="810"></div>

Vidimo kako velike zemlje Zapadne Europe pokazuju iznenađujuće dobar fit vremenskih razdioba slučajeva COVID-a i smrti od COVID-a u prvom valu. Korelacija je na razini pomičnog mjesečnog prosjeka gotovo savršena, ali onda ta veza praktički _nestaje_ tijekom ljeta. 


## Kontraprimjeri

No nemaju sve države jednaku epidemiološku sliku. Švedska je kroz cijelu ovu pandemiju bila izniman slučaj, pa tako i njen graf izgleda bitno drugačije od svih dosadašnjih primjera. Nakon sredine travnja krivulja novih smrti postaje potpuno nevezana uz nove slučajeve i opada na gotovo nulu:

<div class="schart" data-territory="Sweden" data-offset="6" data-dmax="160"></div>

Sjedinjene Američke Države su još uvijek svjetski rekorderi po broju slučajeva i po broju smrti. Njene krivulje više liče švedskim nego drugim zapadneuropskim, samo što se broj novoprijavljenih smrti drži još dosta visoko i pokazuje malu korelaciju s brojem novih slučajeva:

<div class="schart" data-territory="United States" data-offset="7" data-dmax="4500"></div>

Australija je pogotovo neobična, jer je njen drugi val puno smrtonosniji od prvog:

<div class="schart" data-territory="Australia" data-offset="14" data-dmax="16.3"></div>

Može se lako vidjeti i vremenski pomak između dva vala. Dok su u prvom valu smrti kasnile za otprilike dva tjedna, u drugom valu to se produžilo na otprilike tri tjedna:

<div class="schart" data-territory="Australia" data-offset="21" data-dmax="16.3"></div>

Ono što je posebno kod Australije je činjenica da se nalazi na južnoj polutci. Njima je prvi val bio u jesen, a drugi u zimu. Znači li to da će se statistika smrtnosti u Europi pogoršati kad nama nastupi zima?


## Susjedstvo

Iz dosadašnjih grafova možemo primjetiti kako razvoj situacije u Hrvatskoj nije povoljan kao u Zapadnoj Europi. No kako stoje naši prvi susjedi?

Sjeverozapadno od nas, Slovenija proživljava veliki rast novih slučajeva, dok su smrti još uvijek pod kontorolom:

<div class="schart" data-territory="Slovenia" data-offset="14" data-dmax="5.3"></div>

Mađarska ima drastičan rast novih slučajeva u zadnjih mjesec dana, i još je prerano predviđati hoće li i smrti početi rasti s većim kašnjenjem nego što je to bilo u prvom valu. I kod njih se situacija čini pod kontrolom:

<div class="schart" data-territory="Hungary" data-offset="6" data-dmax="90"></div>

Slična situacija je u Austriji, smrtni slučajevi pokazuju tek primjetnu tendenciju rasta s porastom broja slučajeva:

<div class="schart" data-territory="Austria" data-offset="12" data-dmax="20"></div>

No, na istoku grafovi izgledaju sasvim drugačije. Bosna i Hercegovina, slično nama, ima otprilike duplo manju smrtnost nego u prvom valu:

<div class="schart" data-territory="Bosnia and Herzegovina" data-offset="13" data-dmax="18.5"></div>

Još gore izgleda Srbija, s drugim valom koji je ubitačniji od prvog:

<div class="schart" data-territory="Serbia" data-offset="1" data-dmax="9.8"></div>

Rumunjska

<div class="schart" data-territory="Romania" data-offset="7" data-dmax="87"></div>

Grčka

<div class="schart" data-territory="Greece" data-offset="6" data-dmax="13"></div>

Turska

<div class="schart" data-territory="Turkey" data-offset="3" data-dmax="100"></div>


Japan

<div class="schart" data-territory="Japan" data-offset="15" data-dmax="56"></div>

Izrael

<div class="schart" data-territory="Israel" data-offset="9" data-dmax="55"></div>

Danska

<div class="schart" data-territory="Denmark" data-offset="6" data-dmax="16.5"></div>

Švicarska

<div class="schart" data-territory="Switzerland" data-offset="11" data-dmax="39"></div>
