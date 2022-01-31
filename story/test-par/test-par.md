# Testirajmo ime na rod

Uzeo sam jedan popis od <span class="calculation" data-expression="d3.sum(data.set, o => o.count)">____</span> osoba iz Hrvatske, koje su imale ukupno <span class="calculation" data-expression="data.set.length">__</span> različitih imena. Izbacio sam složena imena s crticom, poput "Ana-Marija", ali sam zadržao "Anamarija". Izbacio sam rodno dvosmislena, poput "Saša", ali zadržao ona koja su danas većinom jednog roda, poput "Matija". Izbacio sam i ona koja su Hrvatima toliko strana da ne bi znali pogoditi rod.

Na tom popisu bilo je više muških nego ženskih imena, 
<span class="calculation" data-expression="(100*d3.sum(data.set.filter(o => o.gender==='M'), o => o.count)/d3.sum(data.set, o => o.count)).toFixed(0)">__</span>% osoba je muškog roda.

Prikažimo najčešća imena u dva pravokutnika, širine razmjerne udjelu u našoj populaciji:

<div id="V1" class="namespace" data-show="names" data-fn="s.endsWith('A')"></div>

<div id="V1" class="namespace" data-sample="0.1 1" data-show="names" data-fn="s.endsWith('A')"></div>

<div id="V2" class="namespace" data-show="names, net" data-fn="s.endsWith('A')"></div>

<div id="V2" class="namespace" data-sample="0.5 0.1" data-show="names, net" data-fn="s.endsWith('A')"></div>

## Uhvaćeni u mrežu

istinski pozitivni - krivo pozitivni


<div id="V2" class="namespace" data-show="names, net" data-fn="s.endsWith('A')|| s.endsWith('S')"></div>

<div id="V3" class="namespace" data-show="names, net" data-fn="s.length % 2 == 0"></div>
