var workspace;
var currentLevel = 0;

const Progress = document.getElementById('Progress');
var targetItems = [];
var counterItems = [];
var stats = {"hits": {true: 0, false: 0}, "misses": {true: 0, false: 0}};

const preparation = {
  levels: "/story/codiq/levels/bulk.json"
};

function dataCompleted() {
  import('/story/codiq/fnblocks.js').then( // jshint ignore:line
    module => {
      module.prepare();
      setupBlockly();
      enterLevel(currentLevel);
    }
  );
}

function setupBlockly(){
  const blocklyArea = document.getElementById('blocklyArea');
  const blocklyDiv = document.getElementById('blocklyDiv');
  workspace = Blockly.inject(
    blocklyDiv, {toolbox: makeToolbox([])}
  );
  const onresize = function(e) {
    var element = blocklyArea;
    var x = 0;
    var y = 0;
    do {
      x += element.offsetLeft;
      y += element.offsetTop;
      element = element.offsetParent;
    } while (element);
    // Position blocklyDiv over blocklyArea.
    blocklyDiv.style.left = x + 'px';
    blocklyDiv.style.top = y + 'px';
    blocklyDiv.style.width = blocklyArea.offsetWidth + 'px';
    blocklyDiv.style.height = blocklyArea.offsetHeight + 'px';
    Blockly.svgResize(workspace);
  };
  window.addEventListener('resize', onresize, false);
  onresize();
  Blockly.svgResize(workspace);
  workspace.addChangeListener(codeUpdated);
}

function makeToolbox(a) {
  return {
    kind: 'flyoutToolbox', 
    contents: a.map(name => ({kind: 'block', type: name}))
  };
}

var err = "NOT SET";
function execAll(code, items, side) {
  for (let fig of items) {
    try {
      let totalCode = `
        var out = null;
        var selection = fig.items;
        var sorting = false;
        ${code}`;
      eval(totalCode);
      err = "";
    }
    catch(error) {
      err = error;
    }
    let result = (out === true);
    let el = document.getElementById(fig.id);
    stats[side][result] = stats[side][result] + 1;
    el.setAttribute("class", result? "hit": "miss");
    el.querySelectorAll("g").forEach(el => el.classList.add("filtered-out"));
    el.querySelectorAll("text.ordinal").forEach(el => el.remove());
    var ordinal = 0;
    for (let o of selection) {
      const g = document.getElementById(o.id);
      g.classList.remove("filtered-out");
      if (sorting) {
        const label = document.createElementNS("http://www.w3.org/2000/svg", "text");
        label.setAttributeNS(null, "x", 0);
        label.setAttributeNS(null, "y", 0);
        label.setAttributeNS(null, "class", "ordinal");
        label.appendChild(document.createTextNode(++ordinal));
        g.appendChild(label);
      }
    }
  }
}

function enterLevel(levId) {
  const Targets  = document.getElementById('Targets');
  const Counters = document.getElementById('Counters');
  const def = data.levels[levId];
  display(def.targets,  Targets);
  display(def.counters, Counters);
  targetItems  = def.targets;
  counterItems = def.counters;
  workspace.updateToolbox(makeToolbox(def.tools));
  window.dispatchEvent(new Event('resize'));
  Blockly.svgResize(workspace);
  codeUpdated(null);
  currentLevel = levId;
}

function nextLevel() {
  enterLevel(currentLevel + 1);
}

function display(figures, parentEl) {
  parentEl.innerHTML = '';
  for (let fig of figures) {
    const el = document.createElement("span");
    el.innerHTML = figHtml(fig);
    parentEl.appendChild(el);
  }
}

function figHtml(fig) {
  return `<span id="${fig.id}" class="${fig.hit? 'hit' : 'miss'}">
    <svg class="figure" height="70" width="70" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
      ${fig.items.map(shapeHtml).join("")}
    </svg>&nbsp;
  </span>`;
}

function shapeHtml(item) {
  return `
    <g id="${item.id}"
       class="${item.filled? 'filled' : 'empty'} ${!item.selected? 'filtered-out' : ''}"
       transform="translate(${item.center[0]} ${item.center[1]})">
      <${shape(item)} ${
        Object.entries(attrs(item)).map(e => `${e[0]}="${e[1]}"`).join(" ")
      } />
      ${item.ordinal? `<text x="0" y="0" class="ordinal">${item.ordinal}</text>` : ''}
    </g>`;
}

function codeUpdated(event) {
  const code = Blockly.JavaScript.workspaceToCode(workspace);
  stats = {"hits": {true: 0, false: 0}, "misses": {true: 0, false: 0}};
  execAll(code, [...targetItems], "hits");
  execAll(code, [...counterItems], "misses");
  // Progress.setAttribute("width", Math.abs(mcc(stats)))
}

function shape(item) {
  switch (item.shape) {
    case 'Circle':              return 'circle';
    case 'Square':              return 'rect';
    case 'EquilateralTriangle': return 'polygon';
    default:                    return 'rect';
  }
}

function attrs(item) {
  switch (item.shape) {
    case 'Circle': return {
      cx: 0, cy: 0, r: item.size[0]/2
    };
    case 'Square': return {
      x: -item.size[0]/2, y: -item.size[0]/2, width: item.size[0], height: item.size[0]
    };
    case 'EquilateralTriangle':
      const r = item.size[0]/2;
      const h = r*0.8;
      return {
        x: item.center[0], 
        y: item.center[1], 
        points: `${-r},${h} ${r},${h} 0,${-h}`, 
        width:  r*2, 
        height: r*2
      };
  }
}
