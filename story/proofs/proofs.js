const BASE_URI = "/api/proofs";
let proofID = 0;

function createProof() {
  document.querySelectorAll("#Rules [data-rule]").forEach( e => e.onclick = applyRule );
  M.Dropdown.init(document.querySelectorAll('.dropdown-trigger'), {});
  const usp = new URLSearchParams(window.location.search);
  const request = {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: `["${usp.get('q')}"]` //TODO extract
  };
  fetch(BASE_URI, request).then(handleNewProof);
}

function handleNewProof(response) {
  if (response.ok) {
    const theoremsUri = response.headers.get('Location');
    proofID = response.headers.get('proofID');
    fetch(theoremsUri)
      .then( r => r.json() )
      .then( proofs => insertProofs(proofs) );
  }
  else {
    response.json().then( body => alert(body.message) );
  }
}

function insertProofs(proofs, intro = null) {
  if (Object.entries(proofs).length === 0)
    return;
  const ROOT_DIV = document.getElementById("ProofContainer");
  if (intro != null) {
    const el = document.createElement("p");
    el.innerHTML = intro;
    ROOT_DIV.appendChild(el);
  }
  for (let key in proofs) {
    ROOT_DIV.appendChild(renderTheorem(key, proofs[key]));
  }
  document.getElementById("Rules").scrollIntoView();
}

function renderTheorem(id, theorem) {
  const el = document.createElement("p");
  el.setAttribute("class", "theorem");
  el.setAttribute("id", id);
  el.innerHTML = `<span class="id">${id}</span> <span class="symbols">${theorem.html}</span>`;
  if (theorem.proven === true) {
    el.classList.add("proven", "true");
  }
  if (theorem.proven === false) {
    el.classList.add("proven", "false");
  }
  el.onclick = theoremClicked;
  return el;
}

function theoremClicked(event) {
  event.target.classList.toggle("selected");
}

function unselectAllTheorems() {
  const selectedTheorems = document.getElementsByClassName("theorem selected");
  for (let theoremElement of selectedTheorems) {
    theoremElement.classList.remove("selected");
  }
}

function idsOfCurrentlySelectedTheorems() {
  const selectedTheorems = document.getElementsByClassName("theorem selected");
  let result = [];
  for (let theoremElement of selectedTheorems) {
    result.push(theoremElement.id);
  }
  return result;
}

function applyRule(event) {
  const payload = {
    ruleName: event.target.dataset.rule,
    ids: idsOfCurrentlySelectedTheorems()
  };
  const idsText = payload.ids.map(x => `(${x})`).join(" and ");
  const intro = `From ${idsText}, applying the rule ${payload.ruleName}, we get:`;
  unselectAllTheorems();
  const request = {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify(payload)
  };
  fetch(BASE_URI + `/${proofID}/rules`, request)
    .then(response => handleApplyRuleResponse(response, intro));
}

function handleApplyRuleResponse(response, intro) {
  response.json().then( additionalTheorems => {
    insertProofs(additionalTheorems, intro);
  });
}

function executeLocalScript() {
  createProof();
}
