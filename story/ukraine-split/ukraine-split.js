var preparation = {
  label:      "/story/ukraine-split/labels.json",
  population: "/dataset/countries/pop2020.json",
  regions:    "/dataset/countries/regions.json",
  countryName:"/dataset/countries/hr/short.json",
  gdp:        "/dataset/countries/gdp-nom-2021-un.json",
  eiu:        "/dataset/politics/eiu-democracy-index-2021.json",
  matrix:     "/dataset/politics/democracy-matrix-2020.json",
  ioef:       "/dataset/politics/economic-freedom-2021.json",
  fitw:       "/dataset/politics/freedom-in-the-world-2021.json",
  split:      "/story/ukraine-split/reactions.json",  
  vote:       "/story/ukraine-split/votes.json",
  fitwRows:   {
    waitFor: ["fitw"],
    construction: () => Object.entries(data.fitw)
  },
  popVote:    {
    waitFor: ["population", "vote"],
    construction: () => [..."YNAD"].map(vote => ({vote, pop: sumPop(vote), label: data.label[vote]}))
  }
};

function prepareLocal() {
  browserDefaults();
}

function dataCompleted() {
  for (const div of document.querySelectorAll(".BubbleDensity")) {
    drawBubbleDensityChart(
      div, 
      Object.assign({unit: "", height: 400, width: 800, forceX: 2, forceY: 0.1}, div.dataset)
    );
  }
}

function drawBubbleDensityChart(el, optin) {
  const x = data[optin.keyx];
  const nodes = Object.keys(data.vote).map(ccode => ({
    ccode,
    pop:   optin.r? 1 : optin.keyr === 'pop'? +data.population[ccode] : +data.gdp[ccode],
    label: data.countryName[ccode],
    tags:  ["voted" + data.vote[ccode], "split" + data.split[ccode]],
    valx:  +x[ccode],
    valy:  0
  })).filter(o => o.pop && o.valx && data.vote[o.ccode]);
  if (optin.r) optin.rmax = optin.r;
  nodes.sort((a, b) => b.pop - a.pop);
  drawCountryBubbles(el, nodes, optin);
}

function sumPop(ch) {
  return d3.sum(
    Object.entries(data.population).map(([ccode, pop]) => data.vote[ccode] === ch? pop : 0)
  );
}