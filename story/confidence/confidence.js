const Question = {
  Cities: "Which city is closer to the North Pole?",
  Countries: "Which country had larger population in 2020?",
  People: "Who was born first?",
  Movies: "Which film is older?",
  Olympics: "Which Olympic games were more recent?"
};
const Answer = {
  Cities: "<em>is</em> closer to the North Pole than",
  Countries: "<em>had</em> larger population in 2020 than",
  People: "<em>was</em> born before",
  Movies: "<em>is</em> older than",
  Olympics: "games <em>were</em> more recent than"
};
const Cutoff = [50, 70, 90, 100];

const preparation = {
  rawText: "/story/confidence/order-data.txt",
  challenges: {
    construction: constructChallenges,
    waitFor: ["rawText"]
  }
};

var calibrated = false;

function dataCompleted() {
  data.score = [
    {hits: 0, misses: 0, remaining: 5},
    {hits: 0, misses: 0, remaining: 5},
    {hits: 0, misses: 0, remaining: 10}
  ];
  data.fails = [];
  displayNext();
}

function failText(fail) {
  return fail.correct + " " + Answer[fail.q] + " " + fail.incorrect + ".";
}

function displayNext() {
  const nxt = nextChallenge();
  if (!nxt || isEnough())
    allowFinish();
  const el = document.getElementById("Challenge");
  el.innerHTML = getHtml(nxt.id);
  updateProgressBar();
}

function allowFinish() {
  if (calibrated) return;
  calibrated = true;
  const btn = document.getElementById("FinishBtn");
  btn.classList.remove("disabled");
  btn.textContent = "Finish calibration";
  btn.addEventListener("click", finish);
}

function finish() {
  let part1 = '<h2>Your results:</h2><ul class="collapsible">', 
      part2 = "<h3>Visual representations</h3>";
  for (let i = 2; i >= 0; i--) {
    const low = Cutoff[i];
    const high = Cutoff[i+1];
    const sc = data.score[i];
    const total = sc.hits + sc.misses;
    const accuracy = Math.round( sc.hits / total * 100 );
    part1 += `<li>
        <div class="collapsible-header"><span>
          In confidence range ${low}-${high}% you had
          ${sc.hits}/${total} =&nbsp;<strong>${accuracy}%</strong>&nbsp;correct answers.`;
    if (accuracy < low) part1 += (" Too confident!");
    else if (accuracy > high) part1 += (" Not confident enough!");
    else part1 += (" Well calibrated!");
    part1 += `</span></div>
        <div class="collapsible-body">
          You were wrong ${sc.misses} times:
          <ul>`;
    for (let fail of data.fails.filter(f => f.confidence == i)) {
      part1 += "<li>👉 " + failText(fail) + "</li>";
    }
    part1 += "</ul></div></li>";
    part2 += getAccuracyChart(accuracy, low, high);
  }
  const challengesSection = document.getElementById("Outcome");
  const el = document.createElement("div");
  el.innerHTML = part1 + '</ul>' + part2;
  challengesSection.append(el);
  M.Collapsible.init(document.querySelectorAll('.collapsible'));
}

function isEnough() {
  const remains = data.score.map(o => o.remaining);
  return remains.every(n => n <= 0) || remains.every(n => n <= 3) && d3.sum(remains) <= -5;
}

function updateProgressBar() {
  const sum = (25 - d3.sum(data.score.map(o => o.remaining)))*4;
  const sumPos = (20 - d3.sum(data.score.map(o => Math.max(0, o.remaining))))*5;
  const pct = calibrated? 100 : Math.round((sum + sumPos)/2);
  const pbar = document.getElementById("ProgressBar");
  pbar.setAttribute("style", `width: ${pct}%`);
}

function generateHtml() {
  const challengesSection = document.getElementById("Challenges");
  for (let id in data.challenges) {
    const el = document.createElement("div");
    el.innerHTML = getHtml(id);
    challengesSection.append(el);
  }
}

function getHtml(id) {
  const c = data.challenges[id];
  const leftLabel =  c.flip? c.incorrect : c.correct;
  const rightLabel = c.flip? c.correct   : c.incorrect;
  return `<div class="gg" id="${id}">
    <span class="q">${Question[c.q]}</span>
    <span class="left  label">${leftLabel}</span>
    <span class="right label">${rightLabel}</span>
    <span class="left  d2" onclick="choice(this)">90+</span>
    <span class="left  d1" onclick="choice(this)">70-90%</span>
    <span class="left  d0" onclick="choice(this)">50-70%</span>
    <span class="right d0" onclick="choice(this)">50-70%</span>
    <span class="right d1" onclick="choice(this)">70-90%</span>
    <span class="right d2" onclick="choice(this)">90+</span>
  </div>`;
}

function nextChallenge() {
  const hrd = d3.maxIndex(data.score, o => o.remaining);
  const a = Object.values(data.challenges).filter(o => o.level == hrd);
  const i = Math.floor(Math.random()*a.length);
  return a[i];
}

function choice(el) {
  const chDiv = el.parentElement;
  const id = chDiv.id;
  const challenge = data.challenges[id];
  const isLeft = el.className.startsWith("left");
  const isCorrect = challenge.flip != isLeft;
  const level = +el.className.charAt(el.className.length - 1);
  const levelScore = data.score[level];
  chDiv.classList.add("spent");
  chDiv.getElementsByClassName(isLeft? "left label" : "right label")[0].classList.add("selected");
  el.classList.add("selected");
  el.classList.add("selected");
  if (isCorrect) {
    levelScore.hits++;
  }
  else {
    levelScore.misses++;
    challenge.confidence = level;
    data.fails.push(challenge);
  }
  levelScore.remaining--;
  delete data.challenges[id];
  //console.log(isCorrect + " " + level + "\n" + JSON.stringify(data.score));
  setTimeout(displayNext, 1000);
}

function constructChallenges() {
  const lines = data.rawText.split(/\r?\n/);
  var qKey = "";
  var result = {};
  var sequence = 1;
  for (let line of lines) {
    if (line.startsWith("# ")) {
      qKey = line.substr(2);
    }
    else {
      const a = line.split(/ >+ /);
      const id = "Q" + sequence;
      result[id] = {
        id:        id,
        q:         qKey,
        level:     (line.match(/>/g) || []).length - 1,
        correct:   a[0],
        incorrect: a[1],
        flip:      Math.random() < 0.5
      };
      sequence++;
    }
  }
  return result;
}

function getAccuracyChart(accuracy, min, max) {
  return `<svg width="100%" height="60px" viewBox="-5 0 105 16" >
    ${[0,10,20,30,40,50,60,70,80,90,100].map(vlineSvg).join("")}
    <rect x="${min}" y="2" width="${max - min}" height="6" fill="lightgreen"></rect>
    <circle cx="${accuracy}" cy="5" r="2" stroke="black" stroke-width="0.5"
            fill="${accuracy >= min && accuracy <= max? 'green' : 'red'}" />
    <text x="0" y="13" text-anchor="middle" font-size="4">0%</text>
    <text x="100" y="13" text-anchor="middle" font-size="4">100%</text>
    <text x="${min}" y="13" text-anchor="middle" font-size="4">${min}%</text>
    <text x="${max}" y="13" text-anchor="middle" font-size="4">${max}%</text>
    <!--text x="${accuracy}" y="13" text-anchor="middle" font-size="4">${accuracy}%</text-->
  </svg>`;
}

function vlineSvg(n) {
  return `<line x1="${n}" y1="0" x2="${n}" y2="10" stroke="gray" stroke-width="0.5" />`;
}
