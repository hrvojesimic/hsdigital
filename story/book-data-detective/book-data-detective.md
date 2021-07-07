# Detektiv za podatke

*Hrvoje Šimić, 2021-07-07*

<figure>
  <img src="https://upload.wikimedia.org/wikipedia/commons/c/c7/Tim_Harford_in_2012.jpg"/>
  <figcaption>
    Tim Harford. CC BY-SA Emily Qualey za PopTech
  </figcaption>
</figure>

<span class="dropcap">T</span>__im Harford__ jedan je od mojih najdražih autora. U svijetu u kojem dominiraju šuplji zabavljači s jedne i suhoparni predavači s druge strane, on je rijetka zvjerka — izvanserijski pripovjedač koji teške i ozbiljne teme pretvara u živopisne, komične, dramatične crtice. Dobar primjer je njegov podcast [_Cautionary Tales_](https://www.pushkin.fm/show/cautionary-tales/), serija napetih i istinitih priča u kojima možemo nešto stvarno korisno naučiti na tuđim pogreškama. No Harford je vjerojatno najpoznatiji kao [_Undercover Economist_](https://timharford.com/books/undercovereconomist/), "ekonomist na tajnom zadatku": pod tim brandom je izdao tri odlične knjige i stotine tjednih [kolumni u Financial Timesu](https://www.ft.com/undercover-economist).

Iako je popularnost stvorio na ekonomskim temama, BBC ga je još 2007. pozvao da vodi [_More or Less_](https://www.bbc.co.uk/programmes/p00msxfl), radio program koji istražuje koliko je istine u statistikama koje se iznose u javnosti. Radeći na toj emisiji, shvatio je kako ne moraš biti profesionalni statističar da bi postao "detektiv za podatke". Taj naziv, [__Data Detective__](https://timharford.com/books/datadetective/), Harford koristi za američko izdanje svoje nove knjige, koja je u Ujedinjenom Kraljevstvu objavljena pod nešto nezgrapnijim naslovom: [__How to Make the World Add Up__](https://timharford.com/books/worldaddup/). Hrvatskog prijevoda, nažalost, još nema.

<figure style="text-align: center">
  <img style="max-width:500px" class="responsive-img" src="/story/book-data-detective/th-dd.jpg" />
  <figcaption>
    Tim Harford: How to Make the World Add Up
  </figcaption>
</figure>

## Protiv cinizma

Harford svoju knjigu zamišlja kao određenu protutežu najpopularnijoj klasičnoj knjizi o statistici: "[Kako lagati statistikom](https://en.wikipedia.org/wiki/How_to_Lie_with_Statistics)" Darrela Huffa, koju doživljava kao primjer ciničnog odnosa prema kvantitativnoj analizi. Taj stav "statistikom se može dokazati bilo što" na kraju je Huffa doveo do pozicije da na sudu brani duhansku industriju tvrdnjama da su statistički dokazi koji pušenje dovode u vezu s rakom pluća jednako uvjerljivi kao i tvrdnje da djecu donose rode.

Umjesto Huffovog cinizma, Harford nam za uzore nudi dva istraživača koji su u pedesetim godinama prošlog stoljeća prikupljali podatke o pušačkim navikama liječnika kako bi ustvrdili štete li time svom zdravlju. Harford priča kako je jednog od njih, [Austina Bradforda Hilla](https://en.wikipedia.org/wiki/Austin_Bradford_Hill), jedan liječnik prepoznao na zabavi:

> "Ti si onaj tip koji želi da prestanemo pušiti!"
>   
> "Uopće ne!" odgovorio mu je Hill, koji je tad još uvijek pušio lulu. "Zanima me hoćete li nastaviti pušiti samo da vidim kako ćete umrijeti, isto kao što me zanima jeste li prestali pušiti samo da vidim kako ćete umrijeti. Vi sami odaberite hoćete li pušiti ili ne, meni je svejedno. U oba slučaja ja ću vašu smrt pribrojiti."
>   
> Jesam li spomenuo kako je Hill završio ekonomiju? Tamo je naučio biti tako šarmantan.

Hill je jednostavno tražio istinu. Koliko god to zvučalo obično i svakodnevno, nije bilo. Suprotstavio se moćnim interesima i duboko ukorijenjenim ljudskim manama — od ekonomskih interesa duhanske industrije da sačuvaju tržište i ugled, preko kognitivne disonance ovisnika o nikotinu koji traže izliku da bezbrižno nastave pušiti, sve do vlastite nesvjesne sebičnosti istraživača koji žudi za pozitivnim ishodom svojeg istraživanja.

Staviti istinu ispred svega toga nije bilo lako u to doba, a nije lako ni danas. Bombardirani smo proturječnim informacijama i trikovima manipulatora koji jako dobro znaju naše slabe točke. Tipična reakcija je da "slegnemo ramenima, dignemo ruke od logike i dokaza, i vratimo se vjerovanju u ono što nam je najugodnije." No gušt rada u emisiji _More or Less_ nije rušenje popularnih neistina, piše Harford, nego otkrivanje što __jest__ istina. Svijet je kompleksan a naše su znanstvene metode ograničene, no ako si uporan u traženju istine i ako znaš kako je tražiti, ona će se s vremenom pokazati. U današnjem svijetu ona se najčešće otkriva u obliku statističkih podataka, i stoga moramo naučiti kako njima baratati i kako ih ispravno razumjeti.

## Deset zapovijedi?

U tu svrhu knjigu je organizirana u deset "pravila" za snalaženje među statističkim podacima. No nemojte ih zamisliti kao zapovijedi uklesane u kamenu, kao potpun i praktičan popis uputa koje treba slijediti. To su više korisni savjeti i podsjetnici na što sve obratiti pažnju. Neka pravila i nisu baš duboke mudrosti (primjerice, deseto pravilo kaže da držiš otvoren um: "pitaj se kako bi mogao biti u krivu i jesu li se činjenice promijenile"). No, koliko god neki od tih savjeta u naslovu poglavlja zvučao banalno, Harford im podiže vrijednost svojim majstorskim pripovijedanjem. Apstraktne ideje dobivaju konkretne primjere, veliki brojevi postaju opipljivi, uviđamo koliko su na prvi pogled nevažni aspekti čitanja statističkih rezultata u stvari ključni.

Nećete u ovoj knjizi naći formule kako riješiti sve probleme iz stvarnog svijeta, ali mislim da će i iskusniji i zahtjevniji analitičari pronaći pokoji nov i zanimljiv pojam. Evo nekih koji su meni ostali u sjećanju:

**Preuranjena enumeracija** (engleski: _premature enumeration_) je situacija kad juriš raditi s brojevima, računati prosjeke i razmjere, prije nego što si shvatio što ti brojevi stvarno znače. Brojevi mogu predstavljati vrlo različite stvari, i lako je bezličnim količinama dodijeliti značenje koje smo unaprijed umislili ili nam u tom trenu najviše odgovara. No trebamo se uzdržati od obrade prije nego što ih osobno ne upoznamo, shvatimo što predstavljaju, uvjerimo se da mogu odgovarati na pitanja koja nas zanimaju.

**Perspektiva crva** (_worms eye perspective_). U analizi obično pokušavamo zauzeti __ptičju perspektivu__, kako bi obuhvatili što veći prostor, zanemarili manje važne detalje i fokusirali se na najznačajnije strukture i trendove. No često je korisno nadopuniti je drugom perspektivom: spustiti se na zemlju, čak ući ispod zemlje i rovariti kao crv. Tamo nemamo pregled cijelog stanja ali vidimo predmet proučavanja iz neposredne blizine, iz osobnog iskustva. Njime možemo provjeriti imaju li naši nebeski zaključci smisla, ili se nešto važno zagubilo ili iskrivilo po putu.
    
**Statistički temelji** (_statistical bedrock_) su osnovni podaci koji ulaze u računicu mnogih analiza, kao što je broj stanovnika, GDP ili stupanj pismenosti neke zemlje. Često ih uzimamo zdravo za gotovo, ali budući da o njima ovisi toliko zaključaka, vrijedno je da kritički promotrimo jesu li ti podaci točni, i koristimo li ih na ispravan način. Ispostavilo se da je puno tih bazičnih podataka nekonzistentno, nekvalitetno ili iskrivljeno pod političkim pritiscima.

## Fijasko činjenica

Harford je svoju knjigu završavao u proljeće 2020., na početku covid-pandemije, ne znajući kako će ona završiti. No već tad je naslućivao da će to biti "fijasko činjenica", u kojem će prikupljanje, analiza i prezentacija činjenica javnosti biti bolno neadekvatna.

Mislim kako se ta strepnja obistinila, i to na svim razinama. Od međunarodnih organizacija do lokalne vlasti, od uvaženih stručnjaka do ljudi s ceste, vidjeli smo nesnalaženje, neslaganje, nekonzistentnost i nesposobnost. Kao društvo smo danas dramatično podijeljeni u shvaćanju onog što se događalo zadnjih godinu i pol, kao i u prepoznavanju uzročnih veza. Kao i kod pušenja, razmjeri i raštrkanost ove opasnosti nadilaze našu intuiciju, našu urođenu sposobnost procjene što je normalno, a što neobično; što je vjerojatno, a što iznimno rijetko; što je važno, a što se može zanemariti.

Za to trebamo naučiti plivati u oceanu brojeva tako da nas podaci ne preplave, a struja ne odnese u krivom smjeru. Ova knjiga u tome pomaže. Ona nije priručnik ni udžbenik, više bih rekao da je čitanka s konkretnim životnim situacijama. Ne morate znati ništa o statističkim metodama da progutate u jedan vikend. Ne morate biti dobri u matematici, niti će knjiga od vas tražiti da išta računate.

Moja preporuka se može svesti na ovo: Ako čitate vijesti, pročitajte ovu knjigu. Ako donosite odluke na temelju statističkih podataka, pročitajte ovu knjigu. Ako želite razumjeti moderni svijet, pročitajte ovu knjigu dvaput. Ako dosad niste čitali ništa na tu temu, mislim da će vam ova knjiga biti otkriće. Čak i ako ste iskusni u analiziranju tvrdnji baziranih na statistikama, u ovoj knjizi ćete naći hrpe primjera i najboljih praksi jednog iskusnog lovca na zavaravajuće brojke.
