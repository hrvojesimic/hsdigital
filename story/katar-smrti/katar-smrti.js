const preparation = {
    deaths: "/story/katar-smrti/stat.csv",
    wrdpt:  "/story/katar-smrti/wrdeath.csv",
    nqat:   "/story/katar-smrti/nqat.csv"
};

function dataCompleted() {
    browserDefaults();
    fillTable();
}

function fillTable() {
    const format = d3.format(",.0f");
    const pct = d3.format(".2%");
    const tbody = document.querySelector("#TabOcekivanihSmrti > tbody");
    for (row of data.nqat) {
        tbody.appendChild(
            createRow([
                row.age, 
                row.sex === 'M'? 'M' : 'Ž', 
                format(+row.pop), 
                (+row.age[0] + 1) + '0',
                pct(row.drate), 
                format(row.pop*row.drate)
            ])
        );
    }
    tbody.appendChild(
        createRow([
            "ukupno", 
            "", 
            format(d3.sum(data.nqat, o => o.pop)), 
            "",
            "",
            format(d3.sum(data.nqat, o => o.pop*o.drate))
        ])
    );
}

function createRow(cellData) {
    const el = document.createElement("tr");
    for (str of cellData) {
        const cell = document.createElement("td");
        cell.textContent = str;
        el.appendChild(cell);
    }
    return el;
}