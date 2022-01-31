# COVID ranks

Prije mjesec-dva Europska komisija je objavila ovaj grafikon:

<p class="center-align">
  <img class="responsive-img" src="/story/covid-ranks/eu-chart.png" title="EK grafika" />
</p>



<div class="rank" data-to="35" data-span="24" data-left="doses" data-right="deaths"></div>
<div class="rank" data-to="28" data-span="2" data-left="fullVacPct" data-right="deaths"></div>

<div class="rank" data-to="35" data-span="24" data-left="doses" data-right="deaths"></div>

<div class="rank" data-to="35" data-span="24" data-left="doses" data-right="fullVacPct"></div>
<div class="rank" data-to="30" data-span="2" data-left="gdppc" data-right="deaths"></div>
<div class="rank" data-to="30" data-span="2" data-left="hdi" data-right="deaths"></div>

```dot
digraph bla {
  "Puno staraca" -> "Visoka procijepljenost", "Mala smrtnost";
}
```

<div class="rank" data-to="30" data-span="2" data-left="age65p" data-right="deaths"></div>
<div class="rank" data-to="30" data-span="2" data-left="lifeExp" data-right="deaths"></div>

<div id="Waves"></div>

<div class="container">
  <div class="row">
    <div class="col s12 m6">
      <select name="leftKey" id="dd-left" onchange="updateInteractive()">
        <option value="fullVacPct">postotak stanovnika koji su potpuno cijepljeni</option>
        <option value="medAge">medijan dobi</option>
        <option value="hdi">HDI</option>
        <option value="lifeExp">očekivani životni vijek</option>
        <option value="gdppc">društveni bruto proizvod po stanovniku</option>
        <option value="age65p">postotak stanovnika starih 65 godina i više</option>
        <option value="doses">podijeljenih doza po stanovniku</option>
        <option value="deaths">preminulo od COVID-a na 100k stanovnika</option>
      </select>
    </div>
    <div class="col s12 m6">
      <select name="rightKey" id="dd-right" onchange="updateInteractive()">
        <option value="deaths">preminulo od COVID-a na 100k stanovnika</option>
      </select>
    </div>
  </div>
</div>
<div id="Interactive" class="rank" data-to="30" data-span="2" data-left="fullVacPct" data-right="deaths"></div>
