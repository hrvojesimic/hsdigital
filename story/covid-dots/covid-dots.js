const CountyCode = "Z KZ SM K V KK BB PG LS VS PS BP ZD OB ŠK VP SD I DN M GZ".split(" ");
const EpochStart = new Date(2020, 1, 1);
const mask = {
  BIRTH_YEAR: (1 << 22) - 1,
  DIAGNOSED:  (1 << 15) - 1,
  COUNTY:     (1 <<  5) - 1
};
const DaysInMonth = [31,29,31,30,31,30,31,31,30,31,30,31,31,28,31,30,31,30,31,31,30,31,30,31,31,28,31,30,31,30,31,31,30,31,30,31];
const DaysInMonthCumulative = DaysInMonth.map((sum => value => sum += value)(0));
const dim = {side: 30, mid: 0.2, left: 1, right: 5, top:1, h: 30, bottom: 3, padding: 1};
const genderColors = ["red", "blue"];

const preparation = {
  bindots: "/story/covid-dots/dots.bin",
  countyCircles: "/story/covid-dots/hr-counties-pop.csv",
  countyPop: "/story/covid-dots/croatia-county-pop-2018.json",
  dot: {
    waitFor: ["bindots"],
    construction: readDots
  },
  centers: {
    waitFor: ["countyCircles"],
    construction: extractCenters
  },
  dayIndex: {
    waitFor: ["dot"],
    construction() {
      const result = [];
      for (let i = 0; i < data.dot.length; i++) {
        const daysInEpoch = diagnosed(data.dot[i]);// - 60;
        result[daysInEpoch] = i;
      }
      let last = result[result.length-1];
      for (let j = result.length-2; j >= 0; j--) {
        if (result[j] === undefined) result[j] = last;
        last = result[j];
      }
      return result;
    }
  }
};

function extractCenters() {
  const result = {};
  for (const row of data.countyCircles) {
    result[row.county] = {x: +row.x, y: +row.y};
  }
  return result;
}

function readDots() {
  const a = [];
  const dv = new DataView(data.bindots);
  for (let i = 0; i < data.bindots.byteLength; i += 4) {
    const n = dv.getInt32(i, true);
    a.push(n);
  }
  return a;
}

function dataCompleted() {
  createMap();
  //tsUpdate(timeSeries());
}

function createMap() {
  const map = `<svg viewBox="0 0 200 150" style="display: block; background: lightblue">
    <!--g id="AgePyramid"></g-->
    <g id="Counties" transform="scale(0.7) translate(0 0)">
    </g>
    <!--g id="TimePart" transform="translate(0 100)"></g-->
    <text id="RunningDate" x="10" y="200"></text>
  </svg>`;
  document.getElementById("MapPlaceholder").innerHTML = map;
  const dFirst = data.dot[0];
  const dLast  = data.dot[data.dot.length-1];
  const stats = sliceStats(diagnosed(dLast), diagnosed(dFirst), (n) => true);
  console.log(stats);
  drawAgePyramid("AgePyramid", stats);
  drawCasesInTime("TimePart", stats);
  updateCircles(data.countyCircles, stats, "county");
}

function updateCircles(a, stats, cls) {
  
  const colorScale = d3.scaleSequential(d3.interpolateReds);
  const maxCC = d3.max(
    a.map(d => +stats.countyCount[CountyCode.indexOf(d.county) + 1]/data.countyPop[d.county])
  );
  const g = d3.select("#Counties")
    .selectAll("g." + cls)
    .data(a, o => o.county)
    .join(
      enter => {
        const g = enter.append("g")
               .attr("class", cls)
               .attr("transform", d => `translate(${d.x} ${d.y})`);
        g.append("circle")
          .attr("r", o => o.r)
          .attr("fill", d => colorScale(
            +stats.countyCount[CountyCode.indexOf(d.county) + 1]/data.countyPop[d.county]/maxCC
          ));
        if (cls === 'county')
          g.append("text")
            .attr("class", "ccode")
            .attr("fill", d => {
              const f = stats.countyCount[CountyCode.indexOf(d.county) + 1]/data.countyPop[d.county]/maxCC;
              return f > 0.5? "white" : "black";
            })
            .text(o => o.county);
      },
      update =>
        update.select("circle").attr("r", o => o.r)
    );
}

function drawAgePyramid(elid, stats) {
  const parent = d3.select("#" + elid);
  const svg = parent.append('svg')
    .attr("viewBox", `0 0 ${dim.side * 2 + dim.mid + dim.left + dim.right} ${dim.top + dim.h + dim.bottom}`);
  const chart = svg.append("g")
    .attr("class", "chart")
    .attr("transform", `translate(${dim.left} ${dim.top})`);
  const g = {
    topLeft: svg.append("g")
      .attr("class", "top left")
      .attr("transform", `translate(${dim.left + dim.side/2} ${dim.top/2})`),
    topRight: svg.append("g")
      .attr("class", "top right")
      .attr("transform", `translate(${dim.left + dim.side + dim.mid + dim.side/2} ${dim.top/2})`),
    left: chart.append("g")
      .attr("class", "side left")
      .attr("transform", `translate(${dim.side/2} 0) scale(-1 1)`),
    right: chart.append("g")
      .attr("class", "side right")
      .attr("transform", `translate(${dim.side/2 + dim.mid} 0)`),
    mid: chart.append("g")
      .attr("class", "mid")
      .attr("transform", `translate(${dim.side/2 + dim.mid/2} 0)`)
  };
  const sides = [
    {el: g.left,  top: g.topLeft,  gender: 0, rows: stats.mAgeCount}, 
    {el: g.right, top: g.topRight, gender: 1, rows: stats.fAgeCount}
  ];
  updateAgePyramid(sides, g);
}

function updateAgePyramid(sides, g) {
  const dh = dim.h / sides[0].rows.length;
  for (const side of sides) {
    const max = d3.max(side.rows);
    const scale = d3.scaleSequential([0, max], [0, dim.side/2]);
    side.el.selectAll("rect").data(side.rows).join("rect")
      .attr("class", "databar")
      .attr("x", 0)
      .attr("y", (d, i) => dim.h*2/3 - dh * i)
      .attr("width", d => scale( +d ))
      .attr("height", dh)// - 2*dim.padding)
      .attr("fill", genderColors[side.gender])
      .attr("opacity", (d, i) => i%10 == 0? 0.5 : 1);
  }
  g.mid.selectAll("text").data(sides[0].rows)
    .join("text")
      .attr("y", (d, i) => dim.h*2/3 - dh * i )
      .attr("style", "font-size: 1.5px")
      .text((d, i) => i%10 == 0? i : "");
}

function drawCasesInTime(elid, stats) {
  const parent = d3.select("#" + elid);
  const svg = parent.append('svg').attr("viewBox", `0 0 200 50`);
  const dw = 200 / stats.dayCount.length;
  const xScale = d3.scaleSequential([stats.range[0], stats.range[1]], [0, 250]);
  const yScale = d3.scaleSequential([0, d3.max(stats.dayCount)], [0, 75]);
  parent.selectAll("rect").data(stats.dayCount).join("rect")
    .attr("x", (d, i) => xScale(i))
    .attr("y", (d, i) => 50 - yScale(d))
    .attr("width", dw)
    .attr("height", d => yScale(d));
}

function timeSeries() {
  const result = [];
  for (let d of data.dot) {
    const w = week(d);
    if (result[w] === undefined) {
      result[w] = {};
    }
    const agg = result[w];
    const c = county(d);
    agg[c] = (agg[c] || 0) + 1;
  }
  return result;
}

function tsUpdate(ts) {
  for (let i = 1; i < week(data.dot[0])-4; i++) {
    const counts = ts[i];
    if (!counts) continue;
    const a = [];
    for (let j = 0; j < 21; j++) {
      const cc = CountyCode[j];
      const center = data.centers[cc];
      if (!center) console.log(cc);
      a.push({
        county: cc,
        r: Math.sqrt((counts[j + 1] || 0)/5),
        x: center.x,
        y: center.y
      });
    }
    const day = new Date(EpochStart);
    day.setDate(day.getDate() + i * 7 + 60);
    setTimeout(() => {
      updateCircles(a, "indicator");
      d3.select("#RunningDate").text(
        day.getFullYear() + "-" + (day.getMonth() + 1) + "-" + day.getDate()
      );
    }, i*50);
  }
}

function count(predicate, keyFn) {
  const result = {};
  for (let d of data.dot) {
    if (predicate(d)) {
      const key = keyFn(d);
      result[key] = (result[key] || 0) + 1;
    }
  }
  return result;
}

function sliceStats(d1, d2, filterFn) {
  let filterCount = 0;
  const genderCount = [0, 0];
  const ageCount =    new Array(111).fill(0);
  const mAgeCount =   new Array(111).fill(0);
  const fAgeCount =   new Array(111).fill(0);
  const countyCount = new Array( 22).fill(0);
  const dayCount =    new Array(d2 - d1 + 1).fill(0);
  for (let i = data.dayIndex[d2]; i < data.dayIndex[d1]; i++) {
    const n = data.dot[i];
    if (filterFn(n) === false) continue;
    filterCount++;
    dayCount[diagnosed(n) - d1 - 60]++;
    genderCount[gender(n)]++;
    ageCount[age(n)]++;
    if (gender(n) == 0) mAgeCount[age(n)]++;
    else fAgeCount[age(n)]++;
    countyCount[county(n)]++;
  }
  return {
    range: [d1, d2],
    spanCount: data.dayIndex[d1] - data.dayIndex[d2],
    filterCount,
    dayCount,
    genderCount,
    ageCount,
    mAgeCount,
    fAgeCount,
    countyCount
  };
}

function gender(n)    { return n >>> 22; }
function birthYear(n) { return 1900 + ((n & mask.BIRTH_YEAR) >>> 15); }
function age(n)       { return year(n) - birthYear(n); }
function diagnosed(n) { return (n & mask.DIAGNOSED) >>> 5; }
function county(n)    { return n & mask.COUNTY; }

function yearMonth(n) { 
  const i = DaysInMonthCumulative.findIndex(x => x > n);
  return [Math.floor(i / 12 + 2020), i % 12 + 1];
}

function week(n) {
  return Math.ceil((diagnosed(n) - 60) / 7);
}

function year(n) {
  return 2020 + Math.floor(diagnosed(n) / 365);
}