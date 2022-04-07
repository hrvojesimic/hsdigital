"use strict";
const data = {};
const dataCallbacks = {};

let elid = 0;
let specs = {};
let story = null;
let uniqueIdCounter = 1;

const vegaEmbeds = [];

const hrOptions = {
  formatLocale: {
    decimal: ',',
    thousands: '.',
    grouping: [3],
    currency: ['', '\u00a0kn']
  },
  timeFormatLocale: {
    dateTime: '%A, der %e. %B %Y, %X',
    date: '%d.%m.%Y',
    time: '%H:%M:%S',
    periods: ['AM', 'PM'],
    days: ['nedjelja', 'ponedjeljak', 'utorak', 'srijeda', 'četvrtak', 'petak', 'subota'],
    shortDays: ['pon', 'pon', 'uto', 'sri', 'čet', 'pet', 'sub'],
    months: [
      'siječanj', 'veljača', 'ožujak', 'travanj', 'svibanj', 'lipanj', 'srpanj', 'kolovoz', 'rujan', 'listopad', 'studeni', 'prosinac'
    ],
    shortMonths: ['Sij', 'Velj', 'Ožu', 'Tra', 'Svi', 'Lip', 'Srp', 'Kol', 'Ruj', 'Lis', 'Stu', 'Pro']
  }
};

function onAvailable(dataset, callback) {
  const a = dataCallbacks[dataset]? dataCallbacks[dataset] : [];
  a.push(callback);
  dataCallbacks[dataset] = a;
}

function prepare() {
  if (typeof preparation === "undefined") {
    console.warn("No preparation object!");
  }
  else {
    for (let key in preparation) {
      const p = preparation[key];
      if (typeof p === 'string')
        loadFromUri(p).then(o => store(key, o));
      else if (typeof p === 'function')
        p().then(o => store(key, o));
      else if (p.uri && p.augment) {
        loadFromUri(p.uri).then(o => store(key, o.map(p.augment)));
      }
    }
  }
  if (typeof prepareLocal === "function")
    prepareLocal();
}

function store(key, o) {
  data[key] = o;
  console.log("✔ " + key);
  for (let dataCallback of (dataCallbacks[key] || [])) {
    console.log("Calling back for " + key);
    dataCallback(o);
  }
  if (Object.keys(data).length === Object.keys(preparation).length) {
    console.log("data object completed.");
    replaceAllCalculations();
    if (typeof dataCompleted === "function")
      dataCompleted();
  }
  const keysCompleted = Object.keys(data);
  for (let key in preparation) {
    if (data[key]) continue;
    const prep = preparation[key];
    if (prep.waitFor && prep.construction) {
      const stillWaitingFor = prep.waitFor.filter( x => !keysCompleted.includes(x) );
      if (stillWaitingFor.length === 0) {
        store(key, prep.construction());
      }
    }
  }
}

const mainEl = document.getElementsByTagName('main').item(0);

const Generators = {
  html: (s) => s.content,
  choice: (s) => `<div>${s.options.map(generateOption).join('')}</div>`,
  vegalite: (s) => vegalite(s.content),
  tabulator: (s) => tabulator(s.content),
  backgrid: (s) => backgrid(s.content)
};

function generateOption(option) {
  return `<button>${option.text}</button>`;
}

function vegalite(spec) {
  const id = 'vl-' + ( elid++ );
  specs[id] = spec;
  return `<div class="vega-lite" id="${id}"></div>`;
}

function embedVegaLites() {
  for (let el of document.getElementsByClassName('vega-lite'))
    vegaEmbed(el, specs[el.id])
      .catch(console.warn);
}

function activateVly() {
  for (let el of document.getElementsByClassName('vly')) {
    const vegaSpec = JSON.parse(el.textContent);
    const container = document.createElement("figure");
    const chartEl = document.createElement("span");
    container.appendChild(chartEl);
    if ("caption" in vegaSpec) {
      const captionEl = document.createElement("figcaption");
      captionEl.textContent = vegaSpec.caption;
      container.appendChild(captionEl);
      delete vegaSpec.caption;
    }
    for (let attr of el.attributes) {
      container.setAttribute(attr.name, attr.value);
    }
    vegaEmbed(chartEl, vegaSpec, vegaOptions())
      .then(ve => {
        vegaEmbeds.push(ve);
        const dataSource = vegaSpec.data.name;
        if (dataSource)
          onAvailable(dataSource, d => ve.view.insert(dataSource, d).runAsync() );
      })
      .catch(console.warn);
    el.replaceWith(container);
  }
}

function vegaOptions() {
  if (story.lang === 'hr') return hrOptions;
  else return {};
}

function activateBackgrids() {
  for (let el of document.getElementsByClassName('backgrid')) {
    const spec = JSON.parse(el.textContent);
    const replacement = backgrid(spec);
    replacement.setAttribute("id", el.getAttribute("id"));
    el.replaceWith(replacement);
  }
}

function tabulator(spec) {
  const id = 'tab-' + ( elid++ );
  specs[id] = spec;
  return `<div class="tabulator" id="${id}"></div>`;
}

function embedTabulators() {
  for (let el of document.getElementsByClassName('tabulator')) {
    const t = new Tabulator('#' + el.id, specs[el.id]);
    t.redraw();
  }
}

function embedVizjs() {
  for (let el of document.getElementsByClassName('dot')) {
    var viz = new Viz();
    const wrap = document.createElement("p");
    wrap.setAttribute("class", "graphviz " + el.getAttribute("class"));
    const dot = el.innerHTML
      .replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&amp;/g, "&")
      .replace(/<.?tbody>/g, "");
    viz.renderSVGElement(dot)
       .then(svg => {
         wrap.appendChild(svg);
         el.replaceWith(wrap);
       })
       .catch(error => {
         viz = new Viz();
         console.error(error);
       });
  }
}

function backgrid(spec) {
  const Model = Backbone.Model.extend({});
  const Dataset = Backbone.Collection.extend({
    model: Model,
    url: spec.url
  });
  spec.collection = new Dataset();
  const grid = new Backgrid.Grid(spec);
  const filter = new Backgrid.Extension.ClientSideFilter({
    collection: spec.collection,
    fields: [spec.filterBy]
  });
  const el = document.createElement("div");
  el.setAttribute("class", "bgwrapper");
  el.appendChild(filter.render().el);
  const supertable = document.createElement("div");
  supertable.setAttribute("class", "tablewrapper");
  supertable.appendChild(grid.render().el);
  el.appendChild(supertable);
  spec.collection.fetch({reset: true});
  return el;
}

function renderStep(step) {
  const out = Generators[step.form](step);
  if (typeof out === 'string') {
    const t = document.createElement('template');
    t.innerHTML = out;
    return t.content;
  }
  else {
    return out;
  }
}

function replaceWithSteps(steps) {
  mainEl.innerHTML = '';
  for (let step of steps) {
    mainEl.append(renderStep(step));
  }
}

function configureD3() {
  const opts = vegaOptions();
  if (opts.timeFormatLocale)
    d3.timeFormatDefaultLocale(opts.timeFormatLocale);
}

function configureDayJs() {
  dayjs.extend(window.dayjs_plugin_weekOfYear);
}

function replaceAllCalculations() {
  for (let el of document.getElementsByClassName('calculation')) {
    const expr = el.dataset.expression.replaceAll("$#39;", "'");
    console.log("Evaluating expression " + expr);
    el.innerHTML = eval(expr);// Function('"use strict";return (' + expr + ')')();
  }
}

function onFeature(feature, fn) {
  if (story.features.includes(feature))
   fn();
}

function loadContent(id) {
  fetch("/story/" + id + ".json")
    .then( response => response.json() )
    .then( o => {
      story = o;
      replaceWithSteps(o.steps);
      document.title = o.title;
      onFeature('d3', configureD3);
      onFeature('day', configureDayJs);
      onFeature('vega', embedVegaLites);
      onFeature('tabulators', embedTabulators);
      onFeature('vizjs', embedVizjs);
      onFeature('vega', activateVly);
      onFeature('backgrid', activateBackgrids);
      prepare();
    } );
}

function loadFromUri(uri) {
  if (uri.endsWith(".txt"))
    return fetch(uri).then(r => r.text());
  if (uri.endsWith("json") || uri.includes("/json/"))
    return fetch(uri).then(r => r.json());
  if (uri.endsWith("bin"))
    return fetch(uri).then(r => r.arrayBuffer());
  if (d3) {
    if (uri.endsWith("csv") || uri.includes("/csv/"))
      return d3.csv(uri);
  }
  else {
    console.warn("d3 NOT INCLUDED!");
    return [];
  }
}

// Pearson's correlation coeficient r
function rcoef(a, b) {
  const n = a.length;
  if (b.length != n) return 0; //TODO throw stuff
  let suma = 0, sumb = 0, numerator = 0, den1 = 0, den2 = 0;
  for (let i = 0; i < n; i++) {
    suma += a[i];
    sumb += b[i];
  }
  const ma = suma / n;
  const mb = sumb / n;
  for (let i = 0; i < n; i++) {
    numerator += (a[i] - ma)*(b[i] - mb);
    den1 += (a[i] - ma)*(a[i] - ma);
    den2 += (b[i] - mb)*(b[i] - mb);
  }
  return numerator / Math.sqrt(den1 * den2);
}

function weightedMean(a, w) {
  let wsum = 0, sumw = 0;
  for (let i = 0; i < a.length; i++) {
    wsum += a[i]*w[i];
    sumw += w[i];
  }
  if (isNaN(wsum) || isNaN(sumw))
    throw ">>" + a + "|||" + w + "<<";
  return wsum / sumw;
}

function weightedCov(x, y, w) {
  let n = x.length;
  if (n != y.length || n != w.length)
    throw "arrays must be of same length";
  const mx = weightedMean(x, w);
  const my = weightedMean(y, w);
  let wsum = 0, sumw = 0;
  for (let i = 0; i < n; i++) {
    wsum += w[i]*(x[i] - mx)*(y[i] - my);
    sumw += w[i];
  }
  return wsum / sumw;
}

// weighted Pearson's correlation coeficient r
function wrcoef(x, y, w) {
  return weightedCov(x, y, w) / Math.sqrt(weightedCov(x, x, w) * weightedCov(y, y, w));
}

function nextUniqueId() {
  return 'uid' + (uniqueIdCounter++);
}

function range(a, b) {
  return [...Array(b - a + 1)].map((_,i) => i + a);
}

/** 
 * Collates data from multiple sources, linked by key property.
 * For every element of base array adds corresponding values from addons objects (key-value maps).
 * @return {object} object for data preparation that waits for addons and base,
 * and contains a construction function
 */
function collater(base, key, addons) {
  return {
    waitFor: [...addons, base],
    construction: () => collate(base, key, addons)
  };
}

function collate(base, keyProp, addons) {
  const result = [];
  for (const row of data[base]) {
    const neo = {};
    Object.assign(neo, row);
    const rowKey = row[keyProp];
    for (const addon of addons) {
      neo[addon] = data[addon][rowKey];
    }
    result.push(neo);
  }
  return result;
}

/**
 * Construction of dataset from single property of another dataset.
 * @param {string} base  property for base data object
 * @param {string} key   property for the key of result object
 * @param {string} value property for the value of result object
 * @return {object} object for data preparation that waits for given base,
 * and contains a construction function
 */
function extractObjectFrom(base, key, value) {
  return {
    waitFor: [base],
    construction() {
      return Object.fromEntries(
        data[base].map(row => [row[key], row[value]])
      );
    }
  };
}

function browserDefaults() {
  document.querySelectorAll("main ul, main ol").forEach(o => o.classList.add("browser-default"));
}