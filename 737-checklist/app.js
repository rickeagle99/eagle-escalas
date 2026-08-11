const fleet={
'737-700 NG':'Boeing 737-700 NG','737-800 NG':'Boeing 737-800 NG','737 MAX 8':'Boeing 737 MAX 8',
'A320':'Airbus A320','A330':'Airbus A330','A340':'Airbus A340','MD-11':'McDonnell Douglas MD-11','777':'Boeing 777'
};
const common=[
{name:'Cockpit Preparation',items:['Aircraft power and cockpit configuration — per simulator/aircraft procedure','Flight instruments and navigation displays — set and cross-check','FMC/MCDU — route and performance data reviewed','Radios and navigation aids — set as required','Flight controls and trim — verify','Before-start briefing — completed']},
{name:'Before Start',items:['Doors and area — checked','Beacon — ON when appropriate','Pushback/start clearance — obtained when applicable','Parking brake — set','Engine start procedure — completed']},
{name:'Engine Start',items:['Engine start controls — monitor','N1/N2 and engine parameters — monitor','Oil pressure — verify','Start valve/indications — verify','Engine stabilization — verify']},
{name:'Before Taxi',items:['Electrical and hydraulic indications — checked','Anti-ice — as required','Flight controls — checked','Flight instruments — cross-checked','Taxi clearance — obtained','Parking brake — released when ready']},
{name:'Before Takeoff',items:['Flight controls — checked','Trim — set','Takeoff configuration — set','Takeoff briefing — completed','Transponder and lights — set as required','Takeoff clearance — obtained']},
{name:'After Takeoff',items:['Positive rate — verify','Landing gear — UP','Flaps/slats — retract according to aircraft schedule','Autopilot/flight director — use as required','After-takeoff configuration — checked']},
{name:'Cruise',items:['Cruise altitude and route — monitor','Engine indications — monitor','Fuel quantity/balance — monitor','Pressurization — monitor','Weather and ATC — monitor']},
{name:'Descent',items:['Descent briefing — completed','Approach information — reviewed','Altimeters — set/cross-check','Pressurization — reviewed','Autobrake — set as required','Landing data — reviewed']},
{name:'Approach',items:['Approach clearance — obtained','Landing configuration — set progressively','Flaps/slats — set according to schedule','Landing gear — DOWN','Landing checklist — completed','Required visual/navigation references — verified']},
{name:'Landing',items:['Stable approach criteria — monitored','Landing configuration — confirmed','Reverse thrust — as appropriate','Braking — as appropriate','Runway and aircraft control — maintained']},
{name:'After Landing',items:['Flaps/slats — configure according to procedure','Transponder — set as required','APU — start/use as required','Anti-ice/lights — configure as required','Taxi clearance — obtained']},
{name:'Shutdown / Secure',items:['Parking position — confirmed','Parking brake — SET','Engines — shut down according to procedure','Seat belt signs — as required','Electrical/pneumatic systems — configure as required','Aircraft — secured']}
];
const modelNotes={
'737-700 NG':['Boeing 737 NG — use the applicable aircraft checklist for exact switch positions.'],
'737-800 NG':['Boeing 737 NG — use the applicable aircraft checklist for exact switch positions.'],
'737 MAX 8':['Boeing 737 MAX — use the applicable aircraft checklist for exact switch positions.'],
'A320':['Airbus A320 family — use the applicable ECAM/FCOM checklist for exact procedures.'],
'A330':['Airbus A330 — use the applicable ECAM/FCOM checklist for exact procedures.'],
'A340':['Airbus A340 — use the applicable ECAM/FCOM checklist for exact procedures.'],
'MD-11':['McDonnell Douglas MD-11 — use the applicable aircraft checklist for exact procedures.'],
'777':['Boeing 777 — use the applicable aircraft checklist for exact switch positions.']};
const models=Object.keys(fleet);let model=localStorage.getItem('eagle_aircraft_model')||'737-800 NG';let phase=0;let checks=JSON.parse(localStorage.getItem('eagle_aircraft_checks')||'{}');
const $=s=>document.querySelector(s);const $$=s=>document.querySelectorAll(s);function key(i){return `${model}|${phase}|${i}`}
function renderModels(){$('#models').innerHTML=models.map(m=>`<button data-model="${m}" class="${m===model?'selected':''}">${m}</button>`).join('');$$('#models button').forEach(b=>b.onclick=()=>{model=b.dataset.model;phase=0;localStorage.setItem('eagle_aircraft_model',model);render()})}
function renderPhases(){$('#phases').innerHTML=common.map((p,i)=>`<button class="phase ${i===phase?'active':''}" data-phase="${i}"><b>${i+1}. ${p.name}</b><small>${p.items.length} itens</small></button>`).join('');$$('.phase').forEach(b=>b.onclick=()=>{phase=+b.dataset.phase;render()})}
function renderItems(){const p=common[phase];$('#items').innerHTML=p.items.map((text,i)=>{const done=!!checks[key(i)];return `<div class="item ${done?'done':''}"><input type="checkbox" id="i${i}" data-i="${i}" ${done?'checked':''}><label for="i${i}">${text}</label><small>${done?'CONCLUÍDO':'PENDENTE'}</small></div>`}).join('');$$('#items input').forEach(x=>x.onchange=()=>{checks[key(+x.dataset.i)]=x.checked;localStorage.setItem('eagle_aircraft_checks',JSON.stringify(checks));renderItems();updateProgress()})}
function updateProgress(){const p=common[phase];const n=p.items.filter((_,i)=>checks[key(i)]).length;const pct=Math.round(n/p.items.length*100);$('#progressText').textContent=pct+'%';$('#progressBar').style.width=pct+'%'}
function render(){if(!models.includes(model))model='737-800 NG';$('#modelLabel').textContent=fleet[model];$('#phaseTitle').textContent=common[phase].name;renderModels();renderPhases();renderItems();updateProgress()}
$('#resetBtn').onclick=()=>{if(confirm('Reiniciar o checklist deste modelo?')){Object.keys(checks).filter(k=>k.startsWith(model+'|')).forEach(k=>delete checks[k]);localStorage.setItem('eagle_aircraft_checks',JSON.stringify(checks));render()}};$('#themeBtn').onclick=()=>{document.body.classList.toggle('dark');localStorage.setItem('eagle_aircraft_dark',document.body.classList.contains('dark'))};if(localStorage.getItem('eagle_aircraft_dark')==='true')document.body.classList.add('dark');render();