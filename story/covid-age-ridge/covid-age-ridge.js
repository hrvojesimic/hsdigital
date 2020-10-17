const preparation = {
  cases: {
    //uri: "https://cors-anywhere.herokuapp.com/https://www.koronavirus.hr/json/?action=po_osobama",
    uri: "/story/covid-age-ridge/download.json",
    augment: augmentCase
  }
};

function augmentCase(d) {
  d.Zupanija = d.Zupanija? d.Zupanija.trim() : null;
  if (d.Zupanija === 'Krapinsko-zagorska županija')
    d.Zupanija = 'Krapinsko-zagorska';
  if (d.dob < 1000)
    d.dob = null;
  d.month = +d.Datum.substring(5,7);
  d.week = dayjs(d.Datum).week();
  d.age = (d.dob < 1000)? d.age = null : 2020 - d.dob;
  return d;
}

function dataCompleted() {
  completeCharts();
}

function completeCharts() {
  const dims = {
    width:  300, 
    height: 400, 
    left:    40, 
    right:   60, 
    top:      5, 
    bottom:  20
  };
  const containerNode = document.getElementById("Ridge");
  const svg = d3.select(containerNode)
    .append("svg")
      .attr("viewBox", `0,0,${dims.left + dims.width + dims.right},${dims.top + dims.height + dims.bottom}`);
  const chartG = svg.append("g")
    .attr("class", "chart")
    .attr("transform", `translate(${dims.left},${dims.top})`);

  const dataMap = data.cases.reduce((acc, value) => {
    const key = value.week * 100 + value.age;
    if (!acc[key]) acc[key] = 1;
    else acc[key]++;
    return acc;
  }, {});

  const xScale = d3.scaleLinear()
    .domain([0, 100])
    .range([ 0, dims.width ]);
  chartG.append("g")
    .attr("transform", `translate(0,${dims.height})`)
    .call(d3.axisBottom(xScale));
  const yScale = d3.scaleLinear()
    .domain([0, d3.max(Object.values(dataMap))])
    .range([ 40, 0 ]);

  const START_WEEK = 9;
  const END_WEEK = Math.floor(d3.max(Object.keys(dataMap).map(d=>+d))/100) - 1;
  for (let week = START_WEEK; week <= END_WEEK; week++) {
    const series = [];
    for (let age = 0; age < 100; age++) {
      series.push({
        week: week,
        age: age,
        value: dataMap[week * 100 + age] || 0
      });
    }
    chartG.append("path")
      .datum(series)
      .attr("transform", `translate(0,${(week-START_WEEK)*11})`)
      .attr("d", d3.area()
        .defined(d => !isNaN(d.value))
        .x(d => xScale(d.age))
        .y0(yScale(0))
        .y1(d => yScale(d.value))
        .curve(d3.curveBasis)
      );
  }
}