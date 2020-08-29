const data = {};
const dataCallbacks = {};

let elid = 0;
let specs = {};
let story = null;

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
  if (!preparation) 
    console.warn("No preparation object!");
  for (let key in preparation) {
    const p = preparation[key];
    if (typeof p === 'string')
      loadFromUri(p).then(o => store(key, o));
    else {
      if (p.uri && p.augment) {
        loadFromUri(p.uri).then(o => store(key, o.map(p.augment)));
      }
    }
  }
}

function store(key, o) {
  data[key] = o;
  for (let dataCallback of (dataCallbacks[key] || [])) {
    console.log("Calling back for " + key);
    dataCallback(o);
  }
  if (Object.keys(data).length === Object.keys(preparation).length) {
    console.log("data object completed.");
    if (typeof dataCompleted === "function")
      dataCompleted();
  }
  const keysCompleted = Object.keys(data);
  for (let key in preparation) {
    if (data[key]) continue;
    const prep = preparation[key];
    if (prep.waitFor && prep.construction) {
      const stillWaitingFor = prep.waitFor.filter( x => !keysCompleted.includes(x) );
      if (stillWaitingFor.length === 0)
        store(key, prep.construction());
      else
        console.log(key + " still waiting for " + stillWaitingFor);
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
    const container = document.createElement("p");
    const chartEl = document.createElement("span");
    container.appendChild(chartEl);
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
//    state: {pageSize: 10},
//    mode: "client"
  });
  spec.collection = new Dataset();
  const grid = new Backgrid.Grid(spec);
//  const paginator = new Backgrid.Extension.Paginator({
//    collection: spec.collection
//  });
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
//  el.appendChild(paginator.render().el);
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
      onFeature('vega', embedVegaLites);
      onFeature('tabulators', embedTabulators);
      onFeature('vizjs', embedVizjs);
      onFeature('vega', activateVly);
      onFeature('backgrid', activateBackgrids);
      prepare();
    } );
}

function loadFromUri(uri) {
  if (uri.endsWith("json") || uri.includes("/json/"))
    return fetch(uri).then(r => r.json());
  if (d3) {
    if (uri.endsWith("csv") || uri.includes("/csv/"))
      return d3.csv(uri);
  }
  else {
    console.warn("d3 NOT INCLUDED!");
    return [];
  }
}

loadContent(mainEl.getAttribute('data-story-id'));