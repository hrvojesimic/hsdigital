const preparation = {};
let N = 5;
let d = 10;

function prepareLocal() {
  const Nslide = document.getElementById("Nslider");
  Nslide.value = N;
  Nslide.oninput = refresh;
  const dslide = document.getElementById("dslider");
  dslide.value = d;
  dslide.oninput = refresh;
  refresh();
}

function refresh() {
  if (this.value) N = +this.value;
  const r = [...Array(2*N + 1).keys()].map(n => n - N);
  const board = r.flatMap( n => r.map( m => cell(n, m) ));
  const el = document.getElementById("cboard");
  el.innerHTML = "";
  el.append(render(board));
}

function render(board) {
  const svg = d3.create("svg").attr("width", "100%").attr("height", "350")
    .attr("viewBox", `${-N} ${-N} ${2*N+1} ${2*N+1}`);
  board.forEach( cell => {
    if (cell.colored)
      svg.append("rect").attr("x", cell.x).attr("y", cell.y).attr("width", 1).attr("height", 1);
    cell.dots.forEach( ball =>
      svg.append("circle")
         .attr("r", 1/8)
         .attr("cx", cell.x + 0.5 + ball[0]/3)
         .attr("cy", cell.y + 0.5 + ball[1]/3)
         .attr("fill", cell.colored? "white" : "black")
    );
  });
  return svg.node();
}

function cell(x, y) {
  return {
    x,
    y,
    colored: (x + y) % 2 == 0,
    dots: dots(x, y)
  };
}

function dots(x, y) {
  if (x > N*d) return [];
  const p = x * y;
  if (x*x + y*y > N*N) return [];
  if (p > 0) return [[-1, 1], [1, -1]];
  if (p < 0) return [[1, 1], [-1, -1]];
  if (x + y == 0) return [];
  if (x == 0) return [[-1, -Math.sign(y)], [1, -Math.sign(y)]];
  if (y == 0) return [[-Math.sign(x), -1], [-Math.sign(x), 1]];
  return [];
}