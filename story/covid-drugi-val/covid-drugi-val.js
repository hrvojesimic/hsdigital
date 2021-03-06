const zNames = {S: "Središnja Hrvatska", I: "Slavonija", Z: "Zapadna Hrvatska", J: "Dalmacija", ZG: "Zagreb"};

const Zone = {"Zagrebačka":"S","Krapinsko-zagorska":"S","Sisačko-moslavačka":"S","Karlovačka":"S","Varaždinska":"S","Koprivničko-križevačka":"S","Bjelovarsko-bilogorska":"S","Primorsko-goranska":"Z","Ličko-senjska":"Z","Virovitičko-podravska":"I","Požeško-slavonska":"I","Brodsko-posavska":"I","Zadarska":"J","Osječko-baranjska":"I","Šibensko-kninska":"J","Vukovarsko-srijemska":"I","Splitsko-dalmatinska":"J","Istarska":"Z","Dubrovačko-neretvanska":"J","Međimurska":"S","Grad Zagreb":"ZG"};

const preparation = {
  cases: {
    //uri: "https://cors-anywhere.herokuapp.com/https://www.koronavirus.hr/json/?action=po_osobama",
    uri: "/story/covid-drugi-val/covid-osobe-2020-08-29.json",
    augment: augmentCase
  },
  agePop: "/story/covid-drugi-val/croatia-age-pop-2018.csv",
  countyPop: "/story/covid-drugi-val/croatia-county-pop-2018.json",
  countyAgeRaw: "/story/covid-drugi-val/croatia-county-age-2018.csv",
  ageMap: {
    waitFor: ["agePop"],
    construction: constructAgeMap
  },
  /*countyAgePop: {
    waitFor: ["countyAgeRaw"],
    construction: constructCountyAgePop
  },*/
  ageDistribution: {
    waitFor: ["cases", "agePop", "ageMap"],
    construction: constructAgeDistribution
  },
  zonePop: {
    waitFor: ["countyPop"],
    construction: constructZonePop
  },
  zoneWave: {
    waitFor: ["cases", "zonePop"],
    construction: constructZoneWave
  },
  zoneAgeDistribution: {
    waitFor: ["cases", "countyAgeRaw"],
    construction: constructZoneAgeDistribution
  },
};

function dataCompleted() {
}

function augmentCase(d) {
  d.Zupanija = d.Zupanija? d.Zupanija.trim() : null;
  if (d.Zupanija === 'Krapinsko-zagorska županija')
    d.Zupanija = 'Krapinsko-zagorska';
  if (d.dob < 1000)
    d.dob = null;
  d.wave = (d.Datum < '2020-06-01')? 1 : 2;
  d.age = (d.dob < 1000)? d.age = null : 2020 - d.dob;
  d.zone = Zone[d.Zupanija];
  d.zoneName = zNames[d.zone];
  return d;
}

function constructZoneWave() {
  const result = [];
  for (let wave = 1; wave <= 2; wave++)
    d3.group(data.cases.filter(d => d.wave === wave), d => d.zone).forEach(
      function (value, key) {
        if (key)
          result.push({
            wave: wave,
            zone: key, 
            zoneName: zNames[key],
            cases: value.length, 
            relCases: value.length / data.zonePop[key]
          });
      }
    );
  return result;
}

function constructZonePop() {
  const result = {};
  Array.from(Object.values(Zone)).map(z => {
    const counties = Object.entries(Zone).flatMap(p => (p[1] === z)? [p[0]] : []);
    const p = counties.map(c => data.countyPop[c]).reduce((a,b) => a+b, 0);
    result[z] = p;
  });
  return result;
}

function constructAgeDistribution() {
  const result = [];
  for (let wave = 1; wave <= 2; wave++) {
    for (let age = 0; age <= 100; age++) {
      const cases = data.cases.filter(c => c.age === age && c.wave === wave);
      result.push({
        age: age,
        wave: wave,
        caseCount: cases.length,
        relCases: 1000 * cases.length / data.ageMap[age]
      });
    }
  }
  return result;
}

/*
function constructCountyAgePop() {
  const result = [];
  for (let row of data.countyAgeRaw) {
    for (let age = 0; age < 100; age = age + 5) {
      result.push({
        county: row.county,
        age: age,
        pop: row[age] / row.total
      });
    }
  }
  return result;
}
*/

function constructAgeMap() {
  const result = {};
  for (let el of data.agePop) result[el.age] = +el.pop;
  return result;
}

function constructZoneAgeDistribution() {
  const entries = {};
  const result = [];
  for (let county of Object.keys(Zone)) {
    const zone = Zone[county];
    const countyAgeDist = data.countyAgeRaw.find(r => r.county === county);
    if (!countyAgeDist) {
      console.warn("Didn't find " + county + "???");
      continue;
    }
    for (let wave = 1; wave <= 2; wave++) {
      for (let age = 0; age <= 85; age = age + 5) {
        let caseCount = 0;
        const range = (age <= 80)? 5 : 15;
        for (let c of data.cases)
          if (c.Zupanija === county && c.age >= age && c.age < age + range && c.wave === wave)
            caseCount++;
        let entry = entries[zone + age + wave];
        if (!entry) entry = {
          zone: zone,
          wave: wave,
          age: age,
          cases: 0,
          pop: 0
        };
        entry.cases = entry.cases + caseCount;
        entry.pop = entry.pop + (+countyAgeDist[age]);
        entries[zone + age + wave] = entry;
      }
    }
  }
  for (let key of Object.keys(entries)) {
    const entry = entries[key];
    entry.rel1000 = 1000 * entry.cases / entry.pop;
    entry.zoneName = zNames[entry.zone];
    result.push(entry);
  }
  return result;
}