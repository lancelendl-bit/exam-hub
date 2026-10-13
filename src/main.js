import "./styles.css";
import {rng,permute,inverse,shuffleQ,remap,maxPts,pts,answered,missedFrom,scoreOf} from "./engine/core.js";
import {CERTS,certOf} from "./certs.js";
import {EXAMS,examsOf} from "./exams.js";
import {loadHistory,saveHistory,addAttempt,removeAttempt,makeAttempt,seedFromStates} from "./history.js";
import {historyHTML,bindHistory} from "./historyView.js";
import {initBackup} from "./backup.js";
import {registerSW} from "virtual:pwa-register";
registerSW({immediate:true});

/* ---------- Exam registry: see src/exams.js and src/certs.js ---------- */
const built={};
/* seeded shuffle so answer positions carry no signal; stable across reloads */
function examDef(id){const d=EXAMS.find(e=>e.id===id);if(!built[id]){const c=d.build();c.SECTIONS=c.SECTIONS.map(s=>({...s,desc:s.desc.replace(/ You can review answers before leaving the case, but you can't return afterward\./,"").replace(/ You can review and change answers until you leave the section\./,"").replace(/ After you answer an item and select Next, you can't return to it\./,"")}));c.Q=c.Q.map((q,i)=>shuffleQ({...q,opts:q.opts&&q.opts.slice(),sel:q.sel&&q.sel.map(x=>x.slice()),pool:q.pool&&q.pool.slice(),a:Array.isArray(q.a)?q.a.slice():q.a},id+"#"+i));built[id]=c}return {...d,...built[id]}}
function migrate(st,Qarr){if(!st||st.v===2)return st;const ans={};Object.keys(st.ans||{}).forEach(k=>{const q=Qarr[k];ans[k]=q?remap(q,st.ans[k]):st.ans[k]});st.ans=ans;st.v=2;return st}

/* ---------- State ---------- */
let E=null,Q=[],CASES=[],SECTIONS=[],KEY="",S=null;
const PFX="dp700-hub-";
/* Which certification the hub is showing. The drill for DP-700 keeps its original key so saved progress survives. */
const PREF_KEY=PFX+"pref";
function loadPref(){try{const r=JSON.parse(localStorage.getItem(PREF_KEY));if(r&&r.cert)return r}catch(e){}return{}}
let CERT=certOf(loadPref().cert).id;
const cert=()=>certOf(CERT);
const DOMS=()=>cert().domains;
const drillKey=()=>CERT==="dp700"?"drill":"drill-"+CERT;
function setCert(id){CERT=certOf(id).id;try{localStorage.setItem(PREF_KEY,JSON.stringify({cert:CERT,at:Date.now()}))}catch(e){}render();window.scrollTo(0,0)}
function fresh(){return{v:2,phase:"q",sec:0,idx:0,ans:{},mark:{},checked:{},caseTab:0,filter:"all",confirm:false,plan:null,prevMissed:null,lastScore:null}}
function loadState(id){try{const r=localStorage.getItem(PFX+id);if(r)return JSON.parse(r)}catch(e){}return null}
function save(){if(!E)return;try{localStorage.setItem(KEY,JSON.stringify(S))}catch(e){}}
function clearState(id){try{localStorage.removeItem(PFX+id)}catch(e){}}

const $=s=>document.querySelector(s);
const esc=t=>String(t).replace(/[&<>"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]));
const L="ABCDEFGH";

/* ---------- Scoring ---------- */
/* ---------- Sections / plans ---------- */
const defaultSecs=()=>SECTIONS.map((s,k)=>({...s,items:Q.map((q,i)=>i).filter(i=>Q[i].s===k)}));
const secs=()=>S.plan||defaultSecs();
const secQ=s=>secs()[s].items.map(i=>({q:Q[i],i}));
const allItems=()=>secs().flatMap((s,k)=>s.items.map((i,n)=>({sec:k,idx:n,i})));
function planFor(missed){
 const rest=k=>Q.map((q,i)=>i).filter(i=>Q[i].s===k&&!missed.includes(i));
 return [{name:"Missed last time",desc:`The ${missed.length} items you got wrong or partly wrong on your last attempt. Case items show their case alongside them. The rest of the exam follows.`,review:true,items:missed},
  ...SECTIONS.map((s,k)=>({...s,items:rest(k)})).filter(x=>x.items.length)]}

/* ---------- Open / start ---------- */
function openExam(id,mode){
 E=examDef(id);Q=E.Q;CASES=E.CASES;SECTIONS=E.SECTIONS;KEY=PFX+id;
 const st=migrate(loadState(id),Q);
 if(mode==="resume"&&st){S=st}
 else if(mode==="results"&&st){S=st;S.phase="results"}
 else{const missed=mode==="missed"&&st?missedFrom(st,Q):[];S=fresh();if(missed.length){S.plan=planFor(missed);S.prevMissed=missed}}
 save();render();window.scrollTo(0,0)}
function openDrill(mode){
 const st=loadState(drillKey());
 let items;
 if(mode==="resume"&&st&&st.items){items=st.items}
 else{items=[];examsOf(CERT).forEach(d=>{const ex=examDef(d.id);const es=migrate(loadState(d.id),ex.Q);missedFrom(es,ex.Q).forEach(i=>items.push({ex:d.id,i}))})}
 if(!items.length)return;
 const cases=[],qs=[];const coff={};
 items.forEach(it=>{const ex=examDef(it.ex);const q={...ex.Q[it.i]};if(q.c!=null){const key=it.ex+":"+q.c;if(coff[key]==null){coff[key]=cases.length;cases.push(ex.CASES[q.c])}q.c=coff[key]}q.s=0;q.src=`${ex.title} · item ${it.i+1}`;qs.push(q)});
 E={id:"drill",num:"DRILL",title:"Missed-item drill",sub:"",Q:qs,CASES:cases,SECTIONS:[{name:"Missed items",desc:`${qs.length} items you missed across your exams.`,review:true}]};
 Q=E.Q;CASES=E.CASES;SECTIONS=E.SECTIONS;KEY=PFX+drillKey();
 if(mode==="resume"&&st){if(st.v!==2){const ans={};Object.keys(st.ans||{}).forEach(j=>{const it=items[j];const q=it?examDef(it.ex).Q[it.i]:null;ans[j]=q?remap(q,st.ans[j]):st.ans[j]});st.ans=ans;st.v=2}S=st}else{S=fresh();S.items=items}
 save();render();window.scrollTo(0,0)}
function toHub(){if(E)save();E=null;render();window.scrollTo(0,0)}
/* Every finished exam or drill is logged to the history store (see src/history.js). */
function recordAttempt(at){try{const h=loadHistory();const drill=E.id==="drill";
 addAttempt(h,makeAttempt({cert:drill?CERT:E.cert,exam:E.id,at,Q,ans:S.ans,ids:drill?(j=>{const it=S.items&&S.items[j];return it?[it.ex,it.i]:[E.id,j]}):null}));saveHistory(h)}catch(e){}}
function finish(){const at=Date.now();S.phase="results";S.finishedAt=at;S.lastScore={...scoreOf(S,Q),at,missed:missedFrom(S,Q).length};S.confirm=false;recordAttempt(at);save();render();window.scrollTo(0,0)}

/* ---------- Render ---------- */
function render(){
 const app=$("#app");app.className="fade";
 if(VIEW==="hist")return historyPage(app);
 $("#menu").hidden=!E;$("#pills").innerHTML="";$("#prog").textContent="";
 if(!E){$("#secname").textContent=cert().title;return hub(app)}
 $("#secname").textContent=E.title+(S.phase==="results"?" · Results":"");
 if(S.phase!=="results"){
  $("#pills").innerHTML=secs().map((s,k)=>`<button class="pill" aria-pressed="${S.phase==="q"&&k===S.sec}" data-sec="${k}"><span class="n">${k+1}</span>${esc(s.name)}</button>`).join("")+`<button class="pill" aria-pressed="${S.phase==="review"}" data-rev="1">Review</button>`;
  document.querySelectorAll("[data-sec]").forEach(b=>b.onclick=()=>{S.sec=+b.dataset.sec;S.idx=0;S.phase="q";save();render();window.scrollTo(0,0)});
  const rv=$("[data-rev]");if(rv)rv.onclick=()=>{S.phase="review";S.confirm=false;save();render();window.scrollTo(0,0)};
 }
 if(S.phase==="q")return question(app);
 if(S.phase==="review")return review(app);
 if(S.phase==="results")return results(app);
}

function hub(app){
 const cards=examsOf(CERT).map(d=>{
  const ex=examDef(d.id);const st=migrate(loadState(d.id),ex.Q);
  const n=ex.Q.length;const answeredN=st?Object.keys(st.ans).filter(i=>answered(ex.Q[i],st.ans[i])).length:0;
  const missed=st?missedFrom(st,ex.Q).length:0;
  let status,btns;
  if(!st){status=`<span class="tag muted">Not started</span>`;btns=`<button class="btn primary" data-open="${d.id}" data-mode="new">Start exam</button>`}
  else if(st.phase==="results"&&st.lastScore){const ls=st.lastScore;status=`<span class="tag ${ls.scaled>=700?"good":"bad"}">${ls.scaled} / 1000</span><span class="prog">${ls.got} of ${ls.tot} points · ${new Date(ls.at).toLocaleDateString()}</span>`;
   btns=`${missed?`<button class="btn primary" data-open="${d.id}" data-mode="missed">Retake with ${missed} missed first</button>`:""}<button class="btn ${missed?"":"primary"}" data-open="${d.id}" data-mode="new">Retake exam</button><button class="btn ghost" data-open="${d.id}" data-mode="results">Results</button>`}
  else{status=`<span class="tag warn">In progress</span><span class="prog">${answeredN} of ${n} answered</span>`;
   btns=`<button class="btn primary" data-open="${d.id}" data-mode="resume">Resume</button><button class="btn ghost" data-open="${d.id}" data-mode="new">Start over</button>`}
  return `<article class="card examcard"><span class="num">${d.num}</span><h2>${esc(d.title)}</h2><p class="meta">${esc(d.desc)}</p>
  <p class="meta">${n} items · ${ex.SECTIONS.length} sections: ${ex.SECTIONS.map(s=>esc(s.name)).join(", ")}</p>
  <div class="status">${status}</div><div class="btns">${btns}${st?`<button class="btn small ghost" data-reset="${d.id}">Reset</button>`:""}</div></article>`}).join("");
 const drillSt=loadState(drillKey());
 let drillCount=0;examsOf(CERT).forEach(d=>{const es=loadState(d.id);if(es)drillCount+=missedFrom(es,examDef(d.id).Q).length});
 const drill=`<article class="card examcard drill"><span class="num">DRILL</span><h2>Missed-item drill</h2><p class="meta">Every item you got wrong or partly wrong on your most recent attempt of each exam, in one short run. Rebuilt each time you start it.</p>
  <div class="status">${drillCount?`<span class="tag warn">${drillCount} items waiting</span>`:`<span class="tag muted">Nothing missed yet</span>`}${drillSt&&drillSt.phase!=="results"&&drillSt.items?`<span class="prog">A drill is in progress</span>`:""}</div>
  <div class="btns">${drillSt&&drillSt.phase!=="results"&&drillSt.items?`<button class="btn primary" data-drill="resume">Resume drill</button>`:""}<button class="btn ${drillSt&&drillSt.phase!=="results"&&drillSt.items?"":"primary"}" data-drill="new" ${drillCount?"":"disabled"}>Start drill</button></div></article>`;
 const switcher=CERTS.length>1?`<div class="certs" role="group" aria-label="Certification">${CERTS.map(c=>`<button class="pill" aria-pressed="${c.id===CERT}" data-cert="${c.id}" title="${esc(c.title)}">${esc(c.code)}<small style="margin-left:6px;font-weight:500">${esc(c.short)}</small></button>`).join("")}</div>`:"";
 app.innerHTML=`<div class="stack">${switcher}
 <div class="stack" style="gap:8px"><span class="tag">Exam ${cert().code} · practice</span><h1>Choose an exam</h1>
 <p class="lede">Full simulations plus a drill of everything you've missed. Each keeps its own progress in this browser. You can move between sections freely while you work; Check answer is available on every item.</p></div>
 <div class="examgrid">${cards||`<article class="card"><h2>No exams yet</h2><p class="meta">Question banks for ${esc(cert().code)} haven't been added.</p></article>`}${drill}</div>
 <div class="card stack"><h3>On exam day</h3><ul style="margin:0;padding-left:20px;max-width:75ch">
  <li>Passing score is 700 of 1000. Multi-part items award partial credit, so never leave a part blank.</li>
  <li>Budget about 15 minutes per case study and 90 seconds for other items. The real exam does not let you return to a case or a series item once you leave it.</li>
  <li>Read the last sentence of the stem first: it names the constraint that decides the answer (least effort, least privilege, lowest cost).</li>
 </ul></div></div>`;
 document.querySelectorAll("[data-cert]").forEach(b=>b.onclick=()=>setCert(b.dataset.cert));
 document.querySelectorAll("[data-open]").forEach(b=>b.onclick=()=>openExam(b.dataset.open,b.dataset.mode));
 document.querySelectorAll("[data-drill]").forEach(b=>b.onclick=()=>openDrill(b.dataset.drill));
 document.querySelectorAll("[data-reset]").forEach(b=>b.onclick=()=>{if(b.dataset.armed){clearState(b.dataset.reset);render()}else{b.dataset.armed="1";b.textContent="Confirm reset";b.classList.remove("ghost")}});
}

function typeLabel(q){return{single:"Choose one",multi:`Choose ${q.n}`,hot:"Hot area",build:"Build list",match:"Drag and drop",yesno:"Yes / No statements",series:`Series ${q.grp}`}[q.t]}

function question(app){
 const list=secQ(S.sec);if(!list.length){S.sec=0;S.idx=0}
 const cur=secQ(S.sec)[Math.min(S.idx,secQ(S.sec).length-1)];S.idx=Math.min(S.idx,secQ(S.sec).length-1);
 const {q,i}=cur;const a=S.ans[i];
 const all=allItems();const pos=all.findIndex(x=>x.i===i);
 $("#prog").textContent=`Item ${S.idx+1} of ${secQ(S.sec).length} in section · ${Object.keys(S.ans).filter(k=>answered(Q[k],S.ans[k])).length} of ${Q.length} answered`;
 const isCase=q.c!=null;const C=isCase?CASES[q.c]:null;const ct=isCase?Math.min(S.caseTab||0,C.tabs.length-1):0;
 let html=`<div class="qwrap ${isCase?"case":""}">`;
 if(isCase){
  html+=`<section class="card casepane"><h3 style="margin-bottom:8px">${C.title}</h3>
  <div class="tabs" role="tablist">${C.tabs.map((t,k)=>`<button class="tab" role="tab" aria-selected="${k===ct}" data-tab="${k}">${t.name}</button>`).join("")}</div>
  <div class="casebody">${C.tabs[ct].html}</div></section>`;
 }
 html+=`<section class="card stack" style="min-width:0"><div class="row"><span class="tag">Item ${S.idx+1}</span>${(S.prevMissed||[]).includes(i)?`<span class="tag bad">Missed last time</span>`:""}${q.src?`<span class="tag muted">${esc(q.src)}</span>`:""}<span class="prog">${typeLabel(q)} · Area ${q.d}</span></div>`;
 const chk=!!S.checked[i];
 html+=body(q,i,a,chk);
 if(chk){const p=pts(q,a),m=maxPts(q);
  html+=`<div class="explain"><div class="row"><span class="tag ${p===m?"good":p>0?"warn":"bad"}">${p===m?"Correct":p>0?"Partly correct":"Incorrect"} · ${p}/${m}</span></div><p>${q.ex}</p><a href="https://learn.microsoft.com/en-us/search/?terms=${encodeURIComponent(q.ref)}" target="_blank" rel="noopener">Look this up on Microsoft Learn ↗</a></div>`}
 html+=`<div class="nav">
  ${chk?`<button class="btn" id="retry">Try again</button>`:`<button class="btn" id="check" ${answered(q,a)?"":"disabled"}>Check answer</button>`}
  <label class="mark"><input type="checkbox" id="mk" ${S.mark[i]?"checked":""}> Mark for review</label>
  <div class="spacer"></div>
  <button class="btn" id="prev" ${pos>0?"":"disabled"}>Previous</button>
  ${pos<all.length-1?`<button class="btn primary" id="next">Next</button>`:`<button class="btn primary" id="torev">Go to review</button>`}
 </div></section></div>`;
 app.innerHTML=html;
 if(!chk)bind(q,i);
 const ck=$("#check");if(ck)ck.onclick=()=>{S.checked[i]=true;save();render()};
 const rt=$("#retry");if(rt)rt.onclick=()=>{delete S.checked[i];delete S.ans[i];save();render()};
 document.querySelectorAll(".tab").forEach(b=>b.onclick=()=>{S.caseTab=+b.dataset.tab;save();render()});
 $("#mk").onchange=e=>{S.mark[i]=e.target.checked;save()};
 const go=p=>{const t=all[p];S.sec=t.sec;S.idx=t.idx;save();render();window.scrollTo(0,0)};
 $("#prev").onclick=()=>go(pos-1);
 const nx=$("#next");if(nx)nx.onclick=()=>go(pos+1);
 const tr=$("#torev");if(tr)tr.onclick=()=>{S.phase="review";S.confirm=false;save();render();window.scrollTo(0,0)};
}

function body(q,i,a,rv){
 let h=`<div class="stem">`;
 if(q.t==="series")h+=`<div class="series"><b>Note:</b> This item is part of a series that presents the same scenario. Each item has a unique solution that might meet the stated goal. Some series have more than one correct solution; others might not have one. On the real exam you can't return to a series item after answering it.</div><p>${esc(q.scen)}</p><p><b>${esc(q.sol)}</b></p>${q.code?`<div class="code">${esc(q.code)}</div>`:""}<p>Does this meet the goal?</p>`;
 else h+=`<p>${q.stem}</p>`;
 if(q.t==="hot")h+=`<p class="instr">To answer, select the appropriate options in the answer area.</p>`;
 if(q.t==="build")h+=`<p class="instr">Select an action to move it to the answer area. Use the arrows to reorder.</p>`;
 h+=`</div>`;
 const dis=rv?"disabled":"";
 if(q.t==="single"||q.t==="multi"||q.t==="series"){
  const opts=q.t==="series"?["Yes","No"]:q.opts;const multi=q.t==="multi";
  h+=`<div class="opts" role="${multi?"group":"radiogroup"}">`+opts.map((o,k)=>{
   const on=multi?(Array.isArray(a)&&a.includes(k)):a===k;
   let cls=on?"sel":"";
   if(rv){const corr=multi?q.a.includes(k):q.a===k;cls=corr?"right":on?"wrong":""}
   const txt=q.t==="single"&&/^[a-zA-Z_@.]+[a-zA-Z_.]*\(|^@/.test(o)?`<code>${esc(o)}</code>`:esc(o);
   return `<label class="opt ${cls}"><input type="${multi?"checkbox":"radio"}" name="q${i}" value="${k}" ${on?"checked":""} ${dis}><span class="letter">${q.t==="series"?"":L[k]+"."}</span><span>${txt}</span></label>`}).join("")+`</div>`;
 }
 if(q.t==="hot"){
  const parts=q.tpl.split(/\[\[(\d+)\]\]/);let out="";
  parts.forEach((p,k)=>{if(k%2===0)out+=esc(p);else{const n=+p,v=Array.isArray(a)?a[n]:-1;
   let cls="";if(rv)cls=v===q.a[n]?"ok":"no";
   out+=`<select data-h="${n}" class="${cls}" ${dis} aria-label="Option ${n+1}"><option value="-1">${rv&&v!==q.a[n]?"▼ answer: "+esc(q.sel[n][q.a[n]]):"▼"}</option>${q.sel[n].map((o,j)=>`<option value="${j}" ${v===j?"selected":""}>${esc(o)}</option>`).join("")}</select>`}});
  h+=`<div class="code">${out}</div>`;
  if(rv)h+=`<p class="prog">Correct: ${q.sel.map((s,n)=>`<code>${esc(s[q.a[n]])}</code>`).join(" · ")}</p>`;
 }
 if(q.t==="build"){
  const used=Array.isArray(a)?a:[];
  if(rv){
   h+=`<div class="bl"><div><h3 style="margin-bottom:6px">Your order</h3><div class="blcol">${used.length?used.map((k,n)=>`<div class="blitem" style="border-color:${k===q.a[n]?"var(--good)":"var(--bad)"}"><span class="n">${n+1}</span><span class="t">${esc(q.pool[k])}</span></div>`).join(""):`<p class="prog">No answer</p>`}</div></div>
   <div><h3 style="margin-bottom:6px">Correct order</h3><div class="blcol">${q.a.map((k,n)=>`<div class="blitem"><span class="n">${n+1}</span><span class="t">${esc(q.pool[k])}</span></div>`).join("")}</div></div></div>`;
  }else{
   h+=`<div class="bl"><div><h3 style="margin-bottom:6px">Actions</h3><div class="blcol">${q.pool.map((t,k)=>used.includes(k)?"":`<button class="blitem mv" data-add="${k}" style="text-align:left"><span class="t">${esc(t)}</span><span aria-hidden="true">→</span></button>`).join("")}</div></div>
   <div><h3 style="margin-bottom:6px">Answer area</h3><div class="blcol">${used.length?used.map((k,n)=>`<div class="blitem"><span class="n">${n+1}</span><span class="t">${esc(q.pool[k])}</span><button class="mini" data-up="${n}" aria-label="Move up" ${n===0?"disabled":""}>↑</button><button class="mini" data-dn="${n}" aria-label="Move down" ${n===used.length-1?"disabled":""}>↓</button><button class="mini" data-rm="${n}" aria-label="Remove">✕</button></div>`).join(""):`<p class="prog">Select actions on the left to add them here.</p>`}</div></div></div>`;
  }
 }
 if(q.t==="match"){
  h+=`<div class="tblwrap"><table class="tbl match"><thead><tr><th>Requirement</th><th>Answer</th></tr></thead><tbody>`+q.targets.map((t,n)=>{const v=Array.isArray(a)?a[n]:-1;
   const cls=rv?(v===q.a[n]?"ok":"no"):"";
   return `<tr class="${cls}"><td>${esc(t)}</td><td>${rv?`${v>=0?esc(q.pool[v]):"<i>blank</i>"}${v!==q.a[n]?`<br><b style="color:var(--good)">${esc(q.pool[q.a[n]])}</b>`:""}`:`<select data-m="${n}" aria-label="Answer for: ${esc(t)}"><option value="-1">Drop a value here…</option>${q.pool.map((o,j)=>`<option value="${j}" ${v===j?"selected":""}>${esc(o)}</option>`).join("")}</select>`}</td></tr>`}).join("")+`</tbody></table></div>`;
 }
 if(q.t==="yesno"){
  h+=`<div class="tblwrap"><table class="tbl"><thead><tr><th>Statement</th><th style="text-align:center">Yes</th><th style="text-align:center">No</th></tr></thead><tbody>`+q.rows.map((r,n)=>{const v=Array.isArray(a)?a[n]:null;
   const cls=rv?(v===q.a[n]?"ok":"no"):"";
   return `<tr class="${cls}"><td>${esc(r)}${rv?` <span class="tag ${q.a[n]===1?"good":"bad"}">${q.a[n]===1?"Yes":"No"}</span>`:""}</td>${[1,0].map(val=>`<td class="c"><input type="radio" name="y${i}_${n}" data-y="${n}" value="${val}" ${v===val?"checked":""} ${dis} aria-label="${val?"Yes":"No"}"></td>`).join("")}</tr>`}).join("")+`</tbody></table></div>`;
 }
 return h;
}

function setA(i,v){S.ans[i]=v;save()}
function bind(q,i){
 const app=$("#app");
 const syncCheck=()=>{const c=$("#check");if(c)c.disabled=!answered(q,S.ans[i])};
 if(q.t==="single"||q.t==="series")app.querySelectorAll(`input[name="q${i}"]`).forEach(el=>el.onchange=()=>{setA(i,+el.value);render()});
 if(q.t==="multi")app.querySelectorAll(`input[name="q${i}"]`).forEach(el=>el.onchange=()=>{let cur=(Array.isArray(S.ans[i])?S.ans[i]:[]).slice();const k=+el.value;
  if(el.checked){if(cur.length>=q.n)cur.shift();cur.push(k)}else cur=cur.filter(x=>x!==k);setA(i,cur);render()});
 if(q.t==="hot")app.querySelectorAll("select[data-h]").forEach(el=>el.onchange=()=>{const cur=(Array.isArray(S.ans[i])?S.ans[i]:q.sel.map(()=>-1)).slice();cur[+el.dataset.h]=+el.value;setA(i,cur);syncCheck()});
 if(q.t==="match")app.querySelectorAll("select[data-m]").forEach(el=>el.onchange=()=>{const cur=(Array.isArray(S.ans[i])?S.ans[i]:q.targets.map(()=>-1)).slice();cur[+el.dataset.m]=+el.value;setA(i,cur);syncCheck()});
 if(q.t==="yesno")app.querySelectorAll("input[data-y]").forEach(el=>el.onchange=()=>{const cur=(Array.isArray(S.ans[i])?S.ans[i]:q.rows.map(()=>null)).slice();cur[+el.dataset.y]=+el.value;setA(i,cur);syncCheck()});
 if(q.t==="build"){
  app.querySelectorAll("[data-add]").forEach(b=>b.onclick=()=>{const cur=(Array.isArray(S.ans[i])?S.ans[i]:[]).slice();cur.push(+b.dataset.add);setA(i,cur);render()});
  app.querySelectorAll("[data-rm]").forEach(b=>b.onclick=()=>{const cur=S.ans[i].slice();cur.splice(+b.dataset.rm,1);setA(i,cur);render()});
  app.querySelectorAll("[data-up]").forEach(b=>b.onclick=()=>{const cur=S.ans[i].slice(),n=+b.dataset.up;[cur[n-1],cur[n]]=[cur[n],cur[n-1]];setA(i,cur);render()});
  app.querySelectorAll("[data-dn]").forEach(b=>b.onclick=()=>{const cur=S.ans[i].slice(),n=+b.dataset.dn;[cur[n+1],cur[n]]=[cur[n],cur[n+1]];setA(i,cur);render()});
 }
}

function review(app){
 const un=Q.filter((q,i)=>!answered(q,S.ans[i])).length;
 const mk=Object.keys(S.mark).filter(k=>S.mark[k]).length;
 $("#prog").textContent=`${Q.length-un} of ${Q.length} answered`;
 app.innerHTML=`<div class="stack"><div class="stack" style="gap:6px"><span class="tag">Review</span><h2>Review your answers</h2>
 <p class="lede">Select an item to return to it. ${un?`<b>${un} incomplete</b>. `:""}${mk?`${mk} marked for review.`:""}</p></div>
 <div class="legend"><span><span class="cell done" style="display:inline-block;width:18px;padding:0">&nbsp;</span> Answered</span><span><span class="cell" style="display:inline-block;width:18px;padding:0">&nbsp;</span> Incomplete</span><span><span class="cell flag" style="display:inline-block;width:18px;padding:0">&nbsp;</span> Marked</span></div>
 ${secs().map((s,k)=>`<div class="card stack" style="gap:10px"><div class="row"><h3>${k+1}. ${esc(s.name)}</h3><span class="prog">${s.items.filter(i=>answered(Q[i],S.ans[i])).length} of ${s.items.length} answered</span></div><div class="revgrid">${s.items.map((i,n)=>`<button class="cell ${answered(Q[i],S.ans[i])?"done":""} ${S.mark[i]?"flag":""}" data-go="${k}:${n}">${n+1}<small>${typeLabel(Q[i]).split(" ")[0]}</small></button>`).join("")}</div></div>`).join("")}
 ${S.confirm?`<div class="confirm"><b>Finish and score this exam?</b><p>${un?`${un} item${un>1?"s are":" is"} incomplete and will score zero. `:""}You can retake it afterward.</p><div class="row"><button class="btn primary" id="yes">Yes, finish</button><button class="btn" id="no">Keep working</button></div></div>`
 :`<div class="row"><button class="btn primary" id="fin">Finish exam</button><button class="btn" id="back">Back to last item</button></div>`}
 </div>`;
 app.querySelectorAll("[data-go]").forEach(b=>b.onclick=()=>{const [k,n]=b.dataset.go.split(":").map(Number);S.sec=k;S.idx=n;S.phase="q";save();render();window.scrollTo(0,0)});
 const fn=$("#fin");if(fn)fn.onclick=()=>{S.confirm=true;render()};
 const bk=$("#back");if(bk)bk.onclick=()=>{S.phase="q";save();render()};
 const no=$("#no");if(no)no.onclick=()=>{S.confirm=false;render()};
 const ye=$("#yes");if(ye)ye.onclick=finish;
}

function results(app){
 let tot=0,got=0;const dom=Object.fromEntries(Object.keys(DOMS()).map(k=>[k,[0,0]]));
 Q.forEach((q,i)=>{const m=maxPts(q),p=pts(q,S.ans[i]);tot+=m;got+=p;dom[q.d][0]+=p;dom[q.d][1]+=m});
 const scaled=Math.round(1000*got/tot);const pass=scaled>=700;
 const doms=Object.keys(DOMS()).map(Number).filter(d=>dom[d][1]>0);
 const weakest=doms.slice().sort((x,y)=>dom[x][0]/dom[x][1]-dom[y][0]/dom[y][1])[0];
 const items=Q.map((q,i)=>({q,i,p:pts(q,S.ans[i]),m:maxPts(q)}));
 const f=S.filter;
 const shown=items.filter(o=>f==="all"||(f==="miss"&&o.p<o.m)||(f==="mark"&&S.mark[o.i])||(f==="d"+o.q.d));
 const missed=missedFrom(S,Q).length;
 app.innerHTML=`<div class="stack">
 <div class="card score"><div class="dial">${scaled}<small> / 1000</small></div>
  <div class="stack" style="gap:6px"><span class="tag ${pass?"good":"bad"}">${pass?"Pass":"Below passing"}</span>
  <p>${got} of ${tot} points</p>
  <p class="prog">Microsoft scales scores non-linearly; this is a linear estimate against the 700 cut line.</p></div></div>
 <div class="card stack"><h3>By skill area</h3>
 ${doms.map(d=>{const [p,m]=dom[d],pc=Math.round(100*p/m);return `<div class="dbar"><span>${DOMS()[d]}</span><div class="track" title="Line marks 70%"><i style="width:${pc}%;background:${pc>=70?"var(--accent)":"var(--warn)"}"></i></div><span class="pct">${pc}%</span></div>`}).join("")}
 ${weakest?`<p class="prog">Weakest area: <b>${DOMS()[weakest]}</b>. Start your review there.</p>`:""}</div>
 <div class="card stack"><div class="row" style="justify-content:space-between"><h3>Answer review</h3>
 <div class="filters">${[["all","All"],["miss","Missed"],["mark","Marked"],...Object.keys(DOMS()).map(d=>["d"+d,"Area "+d])].map(([k,l])=>`<button class="chip" aria-pressed="${f===k}" data-f="${k}">${l}</button>`).join("")}</div></div>
 ${shown.length?"":`<p class="prog">Nothing in this filter.</p>`}
 </div>
 ${shown.map(({q,i,p,m})=>`<article class="card stack"><div class="row"><span class="tag ${p===m?"good":p>0?"warn":"bad"}">${p}/${m}</span><span class="prog">Item ${i+1}${q.src?" · "+esc(q.src):""} · ${typeLabel(q)} · Area ${q.d}</span></div>
  ${body(q,i,S.ans[i],true)}
  <div class="explain"><p>${q.ex}</p><a href="https://learn.microsoft.com/en-us/search/?terms=${encodeURIComponent(q.ref)}" target="_blank" rel="noopener">Look this up on Microsoft Learn ↗</a></div></article>`).join("")}
 <div class="row">${E.id!=="drill"&&missed?`<button class="btn primary" id="againMissed">Retake with ${missed} missed first</button>`:""}${E.id!=="drill"?`<button class="btn ${missed?"":"primary"}" id="again">Retake exam</button>`:""}<button class="btn ghost" id="home">Back to menu</button></div></div>`;
 app.querySelectorAll("[data-f]").forEach(b=>b.onclick=()=>{S.filter=b.dataset.f;save();render()});
 const am=$("#againMissed");if(am)am.onclick=()=>openExam(E.id,"missed");
 const ag=$("#again");if(ag)ag.onclick=()=>openExam(E.id,"new");
 $("#home").onclick=toHub;
}

/* ---------- History ---------- */
const titleOf=id=>id==="drill"?"Missed-item drill":((EXAMS.find(e=>e.id===id)||{}).title||id);
function itemInfo(e,i){try{const q=examDef(e).Q[i];return q?{stem:q.stem||q.scen||"",ref:q.ref}:null}catch(x){return null}}
/* Results saved before history existed become one attempt each. Safe to repeat. */
function seedHistory(){try{const h=loadHistory();
 const n=seedFromStates(h,EXAMS.map(d=>{const ex=examDef(d.id);return{cert:d.cert,exam:d.id,st:migrate(loadState(d.id),ex.Q),Q:ex.Q}}));
 if(n)saveHistory(h)}catch(e){}}
let HARM=null;
function historyPage(app){
 $("#menu").hidden=true;$("#pills").innerHTML="";$("#prog").textContent="";$("#secname").textContent="History · "+cert().code;
 const h=loadHistory();
 const ctx={h,certId:CERT,certs:CERTS,titleOf,itemInfo,armed:HARM};
 app.innerHTML=historyHTML(ctx);
 bindHistory(app,{...ctx,onCert:id=>{HARM=null;setCert(id)},onArm:id=>{HARM=id;render()},onRemove:id=>{removeAttempt(h,id);saveHistory(h);HARM=null;render()}})}

/* ---------- Reference views ---------- */
const PAGES={svc:"maps/service.html",mon:"maps/monitoring.html",stem:"maps/stem.html"};
let VIEW="exams";
function setView(v){VIEW=v;
 document.querySelectorAll("#views button").forEach(b=>b.setAttribute("aria-pressed",String(b.dataset.view===v)));
 const ex=v==="exams",inApp=ex||v==="hist";$("#app").hidden=!inApp;$("#pills").hidden=!ex;$("#prog").hidden=!ex;$("#menu").hidden=!ex||!E;
 ["svc","mon","stem"].forEach(k=>{let f=document.getElementById("f-"+k);
  if(k===v&&!f){f=document.createElement("iframe");f.id="f-"+k;f.className="frame";f.title={svc:"Fabric service map",mon:"Fabric monitoring map",stem:"DP-700 stem decoder"}[k];
   f.src=PAGES[k];
   document.getElementById("frames").appendChild(f)}
  if(f)f.hidden=k!==v});
 $("#secname").textContent=ex?(E?E.title:cert().title):({hist:"History",svc:"Service map",mon:"Monitoring map",stem:"Stem decoder"}[v]);
 if(inApp)render();window.scrollTo(0,0)}
document.querySelectorAll("#views button").forEach(b=>b.onclick=()=>setView(b.dataset.view));
$("#brand").onclick=()=>{setView("exams");toHub()};$("#menu").onclick=toHub;
seedHistory();
render();
initBackup();
