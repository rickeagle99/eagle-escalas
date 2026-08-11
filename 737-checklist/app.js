const fleet={
 '737-700 NG':'Boeing 737-700 NG','737-800 NG':'Boeing 737-800 NG','737 MAX 8':'Boeing 737 MAX 8',
 'A320':'Airbus A320','A330':'Airbus A330','A340':'Airbus A340','MD-11':'McDonnell Douglas MD-11','777':'Boeing 777'
};

// Simulation-oriented checklists. Exact switch positions, callouts, limitations
// and emergency procedures must come from the aircraft/operator documentation.
const base={
 'Cockpit Preparation':['Aircraft electrical/power configuration — establish per aircraft procedure','Displays/instruments — set and cross-check','FMC/MCDU — route and performance data reviewed','Radios/navigation — set as required','Flight controls/trim — verify','Briefing — completed'],
 'Before Start':['Doors/area — checked','Beacon/anti-collision — set when appropriate','Pushback/start clearance — obtained when applicable','Parking brake — set','Engine start procedure — ready'],
 'Before Taxi':['Engine parameters — stable','Electrical/hydraulic indications — checked','Flight controls — checked','Flight instruments — cross-checked','Flight directors/autoflight — set as required','Taxi clearance — obtained'],
 'Before Takeoff':['Takeoff configuration — checked','Trim — set','Takeoff briefing — completed','Flight instruments — cross-checked','Transponder/lights — set as required','Takeoff clearance — obtained'],
 'After Takeoff':['Positive climb — confirmed','Landing gear — UP','Flaps/slats — retract according to applicable schedule','Autoflight — set/verify as required','After-takeoff configuration — checked'],
 'Cruise':['Cruise altitude/route — monitor','Engine indications — monitor','Fuel quantity/balance — monitor','Pressurization — monitor','Weather/ATC — monitor'],
 'Descent':['Descent briefing — completed','Arrival/approach information — reviewed','Altimeters — set/cross-check','Pressurization — reviewed','Landing data — reviewed','Approach configuration — prepared'],
 'Approach':['Approach clearance — obtained','Autoflight/navigation mode — verified','Flaps/slats — configure according to aircraft procedure','Landing gear — DOWN','Landing configuration — verified','Approach checklist — completed'],
 'Landing':['Stable approach criteria — monitored','Landing configuration — confirmed','Reverse/ground deceleration — as applicable','Braking — as appropriate','Runway/aircraft control — maintained'],
 'After Landing':['High-lift devices — configure according to aircraft procedure','Transponder/lights — configure as required','APU — start/use as required','Anti-ice — configure as required','Taxi clearance — obtained'],
 'Shutdown / Secure':['Parking position — confirmed','Parking brake — SET','Engines — shut down according to aircraft procedure','Electrical/pneumatic systems — configure as required','Seat belt signs/doors — as required','Aircraft — secured']
};

const variants={
 '737-700 NG':{
  'Engine Start':['Engine start switches/controls — monitor','N2/N3 rotation and fuel flow — verify as applicable','Oil pressure — verify','EGT/start limits — monitor','Starter cutout/stabilization — verify'],
  'Before Taxi':['Flaps — set for departure','Stabilizer trim — set','Pressurization — set/verify','Packs/bleeds — configure as required','Flight controls — full/free check'],
  'Before Takeoff':['Flaps — takeoff setting verified','Stabilizer trim — takeoff setting verified','Speed bugs/targets — set','Takeoff warning/configuration — checked'],
  'Approach':['Flaps — configure progressively','Landing gear — DOWN, three green/normal indication','Speedbrake — armed as applicable','Autobrake — set as required'],
  'After Landing':['Flaps — UP as appropriate','Speedbrake — DOWN','APU — as required']
 },
 '737-800 NG':{
  'Engine Start':['Engine start switches/controls — monitor','N2/N3 rotation and fuel flow — verify as applicable','Oil pressure — verify','EGT/start limits — monitor','Starter cutout/stabilization — verify'],
  'Before Taxi':['Flaps — set for departure','Stabilizer trim — set','Pressurization — set/verify','Packs/bleeds — configure as required','Flight controls — full/free check'],
  'Before Takeoff':['Flaps — takeoff setting verified','Stabilizer trim — takeoff setting verified','Speed bugs/targets — set','Takeoff warning/configuration — checked'],
  'Approach':['Flaps — configure progressively','Landing gear — DOWN, three green/normal indication','Speedbrake — armed as applicable','Autobrake — set as required'],
  'After Landing':['Flaps — UP as appropriate','Speedbrake — DOWN','APU — as required']
 },
 '737 MAX 8':{
  'Engine Start':['Engine start controls — monitor','N2 rotation/fuel flow — verify','Oil pressure — verify','EGT/start limits — monitor','Engine stabilization — verify'],
  'Before Taxi':['Flaps — takeoff setting','Stabilizer trim — set','Pressurization — verify','Packs/bleeds — configure as required','Flight controls — check'],
  'Before Takeoff':['Takeoff configuration — verify','Stabilizer trim — verify','Speed bugs/targets — set','Flight deck takeoff warning/configuration — checked'],
  'Approach':['Flaps — configure per MAX schedule','Landing gear — DOWN/normal indication','Speedbrake — armed as applicable','Autobrake — set as required'],
  'After Landing':['Flaps — configure','Speedbrake — DOWN','APU — as required']
 },
 'A320':{
  'Engine Start':['ENG MODE selector — START as applicable','Engine parameters — monitor','Oil pressure — verify','ECAM engine page — monitor','Engine start sequence — complete'],
  'Before Taxi':['Flight controls — check','Flaps/slats — takeoff configuration','Trim — set/verify','ECAM status — reviewed','Brake/anti-skid — check'],
  'Before Takeoff':['Takeoff config — NORMAL','Flight controls — checked','FMA/FCU — cross-check','ECAM — no abnormal indications','Cabin/doors — takeoff status'],
  'Approach':['AP/FD and managed/selected modes — verify','Flaps/slats — configure per procedure','Landing gear — DOWN/three green','ECAM — reviewed','Landing checklist — completed'],
  'After Landing':['Flaps/slats — retract as applicable','APU — as required','ECAM — reviewed','Anti-ice/lights — configure']
 },
 'A330':{
  'Engine Start':['Engine start sequence — monitor','N1/N2 and EGT — verify','Oil pressure — verify','ECAM engine indications — monitor','Engine stabilization — verify'],
  'Before Taxi':['Flight controls — check','Flaps/slats — takeoff configuration','Trim — set/verify','ECAM status — reviewed','Brake/anti-skid — check'],
  'Before Takeoff':['Takeoff configuration — NORMAL','FMA/FCU — cross-check','ECAM — reviewed','Flight controls — checked','Cabin/doors — takeoff status'],
  'Approach':['Autoflight/approach modes — verify','Flaps/slats — configure','Landing gear — DOWN/normal indication','ECAM — reviewed','Landing checklist — completed'],
  'After Landing':['High-lift devices — retract as applicable','APU — as required','ECAM — reviewed','Anti-ice/lights — configure']
 },
 'A340':{
  'Engine Start':['Engine start sequence — monitor each engine','N1/N2 and EGT — verify','Oil pressure — verify','ECAM engine indications — monitor','All engines stabilized — verify'],
  'Before Taxi':['Flight controls — check','Flaps/slats — takeoff configuration','Trim — set/verify','ECAM status — reviewed','Brake/anti-skid — check'],
  'Before Takeoff':['Takeoff configuration — NORMAL','FMA/FCU — cross-check','ECAM — reviewed','Flight controls — checked','Cabin/doors — takeoff status'],
  'Approach':['Approach/autoflight modes — verify','Flaps/slats — configure','Landing gear — DOWN/normal indication','ECAM — reviewed','Landing checklist — completed'],
  'After Landing':['High-lift devices — retract as applicable','APU — as required','ECAM — reviewed','Anti-ice/lights — configure']
 },
 'MD-11':{
  'Engine Start':['Engine start sequence — monitor all three engines','N2/fuel flow/EGT — verify','Oil pressure — verify','Hydraulic/electrical indications — monitor','All engines stabilized — verify'],
  'Before Taxi':['Flaps/slats — takeoff configuration','Trim — set/verify','Flight controls — check','Hydraulic/electrical synoptic — review','Brake/steering — check'],
  'Before Takeoff':['Takeoff configuration — checked','FMS/autoflight guidance — cross-check','Engine indications — checked','Flight controls — checked','Takeoff warning/configuration — checked'],
  'Approach':['FMS/autoflight approach setup — verify','Flaps/slats — configure','Landing gear — DOWN/normal indication','Hydraulic/electrical status — reviewed','Landing checklist — completed'],
  'After Landing':['High-lift devices — retract as applicable','APU — as required','Hydraulic/electrical status — reviewed','Lights/anti-ice — configure']
 },
 '777':{
  'Engine Start':['Engine start selectors/controls — monitor','N2 rotation/fuel flow — verify','Oil pressure — verify','EGT/start limits — monitor','Engine stabilization — verify'],
  'Before Taxi':['Flaps — takeoff configuration','Trim — set/verify','Flight controls — check','Hydraulic/electrical indications — review','Brake/steering — check'],
  'Before Takeoff':['Takeoff configuration — checked','FMA/autoflight — cross-check','Speed targets — set','Flight controls — checked','Takeoff warning/configuration — checked'],
  'Approach':['Autoflight/approach mode — verify','Flaps — configure','Landing gear — DOWN/normal indication','Speedbrake — armed as applicable','Autobrake — set as required'],
  'After Landing':['Flaps — configure','Speedbrake — DOWN','APU — as required','Hydraulic/electrical indications — review']
 }
};

function makeChecklist(model){
 const extra=variants[model]||{};
 const names=['Cockpit Preparation','Before Start','Engine Start','Before Taxi','Before Takeoff','After Takeoff','Cruise','Descent','Approach','Landing','After Landing','Shutdown / Secure'];
 return names.map(name=>({name,items:extra[name]||base[name]}));
}

const models=Object.keys(fleet);let model=localStorage.getItem('eagle_aircraft_model')||'737-800 NG';let phase=0;let checks=JSON.parse(localStorage.getItem('eagle_aircraft_checks')||'{}');
const $=s=>document.querySelector(s),$$=s=>document.querySelectorAll(s);function key(i){return `${model}|${phase}|${i}`}
function renderModels(){$('#models').innerHTML=models.map(m=>`<button data-model="${m}" class="${m===model?'selected':''}">${m}</button>`).join('');$$('#models button').forEach(b=>b.onclick=()=>{model=b.dataset.model;phase=0;localStorage.setItem('eagle_aircraft_model',model);render()})}
function renderPhases(){const list=makeChecklist(model);$('#phases').innerHTML=list.map((p,i)=>`<button class="phase ${i===phase?'active':''}" data-phase="${i}"><b>${i+1}. ${p.name}</b><small>${p.items.length} itens</small></button>`).join('');$$('.phase').forEach(b=>b.onclick=()=>{phase=+b.dataset.phase;render()})}
function renderItems(){const p=makeChecklist(model)[phase];$('#items').innerHTML=p.items.map((text,i)=>{const done=!!checks[key(i)];return `<div class="item ${done?'done':''}"><input type="checkbox" id="i${i}" data-i="${i}" ${done?'checked':''}><label for="i${i}">${text}</label><small>${done?'CONCLUÍDO':'PENDENTE'}</small></div>`}).join('');$$('#items input').forEach(x=>x.onchange=()=>{checks[key(+x.dataset.i)]=x.checked;localStorage.setItem('eagle_aircraft_checks',JSON.stringify(checks));renderItems();updateProgress()})}
function updateProgress(){const p=makeChecklist(model)[phase];const n=p.items.filter((_,i)=>checks[key(i)]).length;const pct=Math.round(n/p.items.length*100);$('#progressText').textContent=pct+'%';$('#progressBar').style.width=pct+'%'}
function render(){if(!models.includes(model))model='737-800 NG';$('#modelLabel').textContent=fleet[model];$('#phaseTitle').textContent=makeChecklist(model)[phase].name;renderModels();renderPhases();renderItems();updateProgress()}
$('#resetBtn').onclick=()=>{if(confirm('Reiniciar o checklist deste modelo?')){Object.keys(checks).filter(k=>k.startsWith(model+'|')).forEach(k=>delete checks[k]);localStorage.setItem('eagle_aircraft_checks',JSON.stringify(checks));render()}};
$('#themeBtn').onclick=()=>{document.body.classList.toggle('dark');localStorage.setItem('eagle_aircraft_dark',document.body.classList.contains('dark'))};if(localStorage.getItem('eagle_aircraft_dark')==='true')document.body.classList.add('dark');render();