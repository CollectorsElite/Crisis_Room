const $=s=>document.querySelector(s);
const app=$('#app');
const stations = [
  {id:'team', slug:'squadra', title:'Squadra', path:'/squadra', api:'join'},
  {id:'teacher', slug:'docente', title:'Docente', path:'/regia', api:'login'},
  {id:'screen', slug:'proiettore', title:'Proiettore', path:'/schermo', api:'screen'}
];
const entrance = location.pathname === '/';
const preferred = new URLSearchParams(location.search).get('postazione');
let station = stations.find(x=>entrance ? x.slug===preferred : x.path===location.pathname) || stations[0];
let role=station.id;
let sessions={};
const esc=x=>String(x??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'})[c]);
const labels={lobby:'In attesa',open:'Turno aperto',paused:'In pausa',review:'Esito del turno',end:'Missione conclusa'};
const it=new Intl.NumberFormat('it-IT');
const metricNames=['Sistemi coinvolti','Fermo ERP','Costo del fermo','Elementi documentati'];
let offset=0,data=null,busy=false,polling=false,dirty=false,newsNotice='',lastRender='';
const session=(k,v)=>{try{if(v===undefined)return sessionStorage.getItem(k);sessionStorage.setItem(k,v);}catch{}};
async function api(url,body){
  const res=await fetch(url,body===undefined?{cache:'no-store'}:{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(body)});
  if(res.status===204)return null;
  const val=await res.json();if(!res.ok){const e=Error(val.error||'Errore di collegamento');e.status=res.status;throw e;}return val;
}
function notice(msg){$('#notice').textContent=msg;$('#notice').classList.toggle('show',!!msg);}
function phase(){return '<span class="phase p-'+data.phase+'"><i></i>'+labels[data.phase]+'</span>';}
const tag=t=>'<div class="eyebrow">'+esc(t)+'</div>';
const button=(id,label,style='')=>'<button type="button" class="'+style+'" data-op="'+id+'">'+label+'</button>';
const value=(n)=>it.format(n);
const fmtMin=n=>n>=60?Math.floor(n/60)+' h '+(n%60? n%60+' min':''):n+' min';
function kpis(m){
  const vals=[m.affected+' / 12',fmtMin(m.minutes),'€ '+value(m.cost),m.proof];
  return '<dl class="kpis">'+vals.map((x,i)=>'<div><dt>'+metricNames[i]+'</dt><dd>'+x+'</dd></div>').join('')+'</dl>';
}
const seedAssets=[['ferri','PC Ferri','Acquisti'],['conti','PC Conti','Acquisti'],['share','File server','Servizi centrali'],['nas','NAS backup','Servizi centrali'],['admin','PC IT','Servizi centrali'],['erp','ERP SAP','Produzione'],['prod','Linea 05','Produzione'],['cad','Server CAD','Produzione'],['hr','PC HR','Uffici'],['cfo','PC finanza','Uffici'],['sales','PC vendite','Uffici'],['dg','PC direzione','Uffici']].map(([id,n,d])=>({id,n,d,status:id==='ferri'?'affected':'online'}));
const states={online:'Operativo',affected:'Compromesso',isolated:'Isolato','isolated-hit':'Compromesso isolato',restored:'Ripristinato'};
function siteMap(list,title='Infrastruttura'){
  return '<section class="blueprint"><div class="maphead">'+tag('Meridian Components')+'<h2>'+title+'</h2></div><div class="diagram">'+['Acquisti','Servizi centrali','Produzione','Uffici'].map((d,i)=>'<div class="sector"><h3><span>'+['ACQ','SRV','PRD','UFF'][i]+'</span>'+d+'</h3>'+list.filter(a=>a.d===d).map(a=>'<div class="machine s-'+a.status+'" title="'+states[a.status]+'"><i></i><span>'+esc(a.n)+'</span><small>'+({'online':'ON','affected':'INC','isolated':'ISO','isolated-hit':'I+','restored':'RIP'})[a.status]+'</small></div>').join('')+'</div>').join('')+'</div><div class="legend">ON operativo · INC compromesso · ISO isolato · I+ compromesso isolato · RIP ripristinato</div></section>';
}
function accessFields(){
  if(sessions[role])return '<a class="primary continue" href="'+station.path+'">Riprendi '+({team:'la partita',teacher:'la regia',screen:'la proiezione'})[role]+' →</a>';
  const labels={team:'Entra in aula',teacher:'Accedi alla regia',screen:'Apri proiezione'};
  return (role==='teacher'?'<label>Password docente<input type="password" name="password" required autocomplete="current-password"></label>':'<label>Codice aula<input name="code" inputmode="numeric" pattern="[0-9]{6}" maxlength="6" required placeholder="6 cifre" autocomplete="off"></label>')+
    (role==='team'?'<label>Nome squadra<input name="name" required minlength="2" maxlength="32" placeholder="Come vi chiamate?"></label><details><summary>Rientri da un altro dispositivo?</summary><label>Codice recupero fornito dal docente<input name="resume" maxlength="10" autocomplete="off"></label></details>':'')+
    '<button class="primary" type="submit">'+labels[role]+' <span>→</span></button>';
}
function landing(){
  const choices=stations.map(st=>'<label class="station"><input type="radio" name="station" value="'+st.id+'" '+(role===st.id?'checked':'')+'><span>'+st.title+'</span></label>').join('');
  const form='<form id="access" class="paper access"><h2>Entra in Crisis Room</h2><fieldset class="stations"><legend>Scegli la postazione</legend><div>'+choices+'</div></fieldset><div id="access-fields">'+accessFields()+'</div></form>';
  app.innerHTML='<div class="landing"><div class="cover">'+tag('Missione 01 / Incident response')+'<h1>Crisis Room<span>Paziente Zero</span></h1><p class="lead">Martedì, ore 09:14. Un allegato, un computer bloccato e una consegna da salvare.</p><div class="spec"><span>8 turni</span><span>12 sistemi</span><span>30–40 minuti</span></div>'+siteMap(seedAssets,'Mappa della crisi')+'</div><aside>'+form+'<div class="case"><b>Il caso Meridian</b><p>Componentistica auto, 120 dipendenti, tre sedi. Ogni squadra dirige la risposta della propria azienda e decide come rispondere ai colleghi.</p></div></aside></div>';
}
const intro=()=>'<div class="scenehead"><div>'+tag('Missione 01 / Paziente Zero')+'<h1>'+esc(data.phase==='lobby'?'Sala di attesa':data.phase==='end'?'Debriefing':data.scene.title)+'</h1></div>'+phase()+'</div>'+(data.endedByTeacher?'<p class="brief">Simulazione terminata dal docente al turno '+(data.round+1)+' di '+data.total+'. Il verbale raccoglie le decisioni registrate fino alla chiusura.</p>':'');
function bubble(who,title,text,kind=''){
 return '<div class="bubble '+kind+'"><div class="author">'+esc(who)+' <small>'+esc(title)+'</small></div><div>'+esc(text)+'</div></div>';
}
function conversation(chapter,live){
 const lines=chapter.messages.map((m,i)=>'<div '+(live?'data-beat="'+i+'" hidden':'')+'>'+bubble(m.who,m.role,m.text)+'</div>').join('');
 const decision=chapter.decision?bubble('Unità di crisi','Decisione',chapter.decision,'outgoing'):'';
 return lines+decision+(chapter.reply?bubble('Referente incaricato','Ricevuto',chapter.reply):'')+
 chapter.notes.map(n=>bubble('Sala operativa','Aggiornamento',n,'monitor')).join('');
}
function transcript(){
 const chapters=data.thread,current=chapters.at(-1),past=chapters.slice(0,-1);
 const live=['open','paused'].includes(data.phase)&&!current.decision;
 return '<section class="chatbox"><header class="chathead"><div>'+tag('Meridian Components')+'<h2># crisi-aziendale</h2></div><span>'+esc(role==='team'?data.team.name:data.followName)+'</span></header>'+
 (past.length?'<details class="backlog"><summary>Messaggi precedenti · '+past.length+' fasi</summary>'+past.map(c=>'<h3>'+esc(c.time+' · '+c.title)+'</h3>'+conversation(c,false)).join('')+'</details>':'')+
 '<div class="thread"><div class="chatstamp">'+esc(current.time+' · '+current.title)+'</div>'+conversation(current,live)+'<p class="typing" id="typing" aria-live="polite"></p></div></section>'+
 (data.scene.news?'<div class="dispatch">'+tag('Comunicazione della regia')+esc(data.scene.news)+'</div>':'');
}
function animateChat(){
 if(!data?.thread)return;
 const ch=data.thread.at(-1);
 const running=data.phase==='open', remaining=running?data.clockEnd-Date.now()-offset:data.remaining;
 const count=ch.decision||!['open','paused'].includes(data.phase)?5:Math.min(5,1+Math.floor(Math.max(0,150000-remaining)/2700));
 document.querySelectorAll('[data-beat]').forEach(n=>{n.hidden=Number(n.dataset.beat)>=count;});
 const typing=$('#typing');if(typing)typing.textContent=count<5?(running?ch.messages[count].who+' sta scrivendo…':'Conversazione in pausa'):'';
 const form=$('#decide');if(form)form.hidden=count<5;
}
setInterval(animateChat,300);
function paths(){
 if(!data.routes)return '';
 return '<section class="darkcard paths"><h2>Percorsi delle squadre</h2>'+data.routes.map(t=>'<div><b>'+esc(t.name)+'</b><span>'+esc(t.title)+'</span>'+(role==='teacher'&&t.id!==data.follow?'<button data-follow="'+t.id+'">Mostra chat</button>':t.id===data.follow?'<small>In proiezione</small>':'')+'</div>').join('')+'</section>';
}
function track(){
  return '<div class="track" aria-label="Turno '+(data.round+1)+' di 8"><b>Turno '+String(data.round+1).padStart(2,'0')+' / 08</b><div>'+Array.from({length:8},(_,i)=>'<i class="'+(i<=data.round?'lit':'')+'"></i>').join('')+'</div><span>'+esc(data.scene.time)+'</span>'+(['open','paused'].includes(data.phase)?'<span id="clock" title="Tempo consigliato; il turno si chiude dalla regia."></span>':'')+'</div>';
}
function logEntry(h){
  return '<article class="entry">'+tag('Turno '+(h.round+1)+' / '+h.title)+'<h3>'+esc(h.titles.join(' + ')||(h.interrupted?'Turno interrotto':'Nessuna azione'))+'</h3><p class="reason">«'+esc(h.reason||'Nessuna nota')+'»</p>'+h.notes.map(n=>'<p>'+esc(n)+'</p>').join('')+'<small>'+h.metrics.affected+' sistemi coinvolti · '+fmtMin(h.metrics.minutes)+' di fermo cumulato · '+h.metrics.proof+' elementi</small></article>';
}
function clock(){
 const el=$('#clock');if(!el||!data)return;
 const ms=data.phase==='paused'?data.remaining:data.clockEnd-Date.now()-offset;
 const sec=Math.max(0,Math.ceil(ms/1000));
 el.textContent=sec?'Discussione '+Math.floor(sec/60)+':'+String(sec%60).padStart(2,'0'):'Tempo consigliato concluso';
}
setInterval(clock,500);
function quality(t){
 return '<section class="quality">'+tag('Qualità della ricostruzione')+t.assessment.map(x=>'<div><b>'+esc(x.label)+'</b><strong>'+esc(x.level)+'</strong><p>'+esc(x.hint)+'</p></div>').join('')+'</section>';
}
function journal(team){
  return '<details class="journal"><summary>Diario della squadra ('+team.history.length+')</summary>'+team.history.slice().reverse().map(logEntry).join('')+'<p><b>Fascicolo.</b> '+esc(team.proof.join(' · ')||'Nessun elemento acquisito.')+'</p></details>';
}
function guide(){
  return '<div class="case"><b>Briefing operativo</b><p>Condividete la postazione. Assegnate i ruoli di coordinamento, IT e continuità/privacy. Leggete la chat, seguite i messaggi e decidete quale risposta inviare. La regia chiude ogni turno e apre il confronto.</p></div>';
}
const draftKey=()=> 'cr:'+data.room+':'+data.team.id+':'+data.round;
function draft(){try{return JSON.parse(session(draftKey())||'{}');}catch{return {};}}
function actionForm(){
  const d=draft(),ids=(d.ids||[]).slice(0,1),paused=data.phase==='paused';
  return '<form id="decide" class="paper" hidden>'+tag('Rispondi alla chat')+'<h2>'+esc(data.scene.prompt)+'</h2><fieldset '+(paused?'disabled':'')+'><legend>Scegli una risposta</legend><div class="actions">'+data.actions.map((a,i)=>'<label class="action"><input type="radio" name="ids" required value="'+a.id+'" '+(ids.includes(a.id)?'checked':'')+'><span><b>'+esc(a.title)+'</b><small>'+esc(a.detail)+'</small></span></label>').join('')+'</div><label>Nota facoltativa<textarea name="reason" maxlength="300" placeholder="Quale priorità avete scelto e perché?">'+esc(d.reason||'')+'</textarea></label><div class="submitline"><button class="primary">'+(paused?'Turno in pausa':'Invia decisione')+'</button></div></fieldset></form>';
}
function teamPage(){
 const t=data.team;
 if(data.phase==='lobby')return intro()+'<div class="columns"><div class="paper">'+tag('Squadra registrata')+'<h2>'+esc(t.name)+'</h2><p>La regia avvierà la missione. Potete già distribuire i ruoli.</p>'+guide()+'</div>'+siteMap(t.map)+'</div>';
 const review=['review','end'].includes(data.phase),h=t.history.at(-1);
 return intro()+track()+'<div class="teamname">'+tag('Postazione / '+t.name)+'</div>'+kpis(t.metrics)+'<div class="columns"><div>'+transcript()+
  (review?'<section class="paper">'+tag(data.phase==='end'?'Esito finale':'Conseguenze')+logEntry(h)+'<h3>Discussione</h3><p>'+esc(data.scene.question)+'</p></section>':data.pending?'<div class="paper">'+tag('Decisione inviata')+'<h2>'+esc(data.pending.titles.join(' + '))+'</h2><p>'+esc(data.pending.reason)+'</p><p>La risposta del reparto è nella chat. Il docente coordina il prossimo aggiornamento.</p></div>':actionForm())+
  '</div><aside>'+siteMap(t.map)+(data.phase==='end'?quality(t):'')+journal(t)+'</aside></div>';
}
function compare(){
 const list=data.pair.map(id=>data.teams.find(x=>x.id===id)).filter(Boolean);
 if(!list.length)return '';
 const hist=list[0].history;
 const index=data.focus??hist.length-1;
 return '<section class="comparison"><div class="sectionbar"><h2>Confronto in aula</h2><span>Turno '+(index+1)+' di '+hist.length+'</span></div><div class="versus">'+list.map(t=>'<div class="paper">'+tag(t.name)+kpis(t.history[index].metrics)+logEntry(t.history[index])+(data.phase==='end'&&index===hist.length-1?quality(t):'')+'</div>').join('')+'</div></section>';
}
function roster(){
 return '<div class="roster">'+data.teams.map(t=>'<div><b>'+esc(t.name)+'</b><span>'+(['open','paused'].includes(data.phase)?(t.ready?'Consegnato':'Al lavoro'):labels[data.phase])+'</span><details><summary>Codice recupero</summary><code>'+t.resume+'</code></details></div>').join('')+'</div>';
}
const teacherHelp={
 lobby:'Mostra il codice aula sul proiettore. Quando le squadre sono entrate, seleziona Avvia la missione.',
 open:'Le chat si aggiornano da sole. Ogni squadra invia una decisione. Usa Mostra chat per proiettare il suo percorso. Quando vuoi discutere gli esiti, seleziona Chiudi il turno. Il timer è indicativo.',
 paused:'Le consegne sono sospese. Seleziona Riprendi per riaprirle, oppure Termina simulazione per passare al debriefing.',
 review:'Confronta le decisioni delle squadre. Poi apri il turno successivo oppure concludi la simulazione qui.',
 end:'Puoi confrontare i turni svolti e scaricare il verbale. Per ricominciare con un nuovo codice, apri Gestione sessione.'
};
function teacherPage(){
 const p=data.phase,review=['review','end'].includes(p);
 const options=(chosen,empty)=> (empty?'<option value="">Solo una squadra</option>':'')+data.teams.map(t=>'<option value="'+t.id+'" '+(t.id===chosen?'selected':'')+'>'+esc(t.name)+'</option>').join('');
 const panel='<section class="paper controls">'+tag('Regia docente')+'<div class="roomcode"><div>Codice aula <strong>'+data.code+'</strong></div><a href="/schermo" target="_blank" rel="noopener">Apri proiettore ↗</a></div><p class="teacher-help">'+esc(p==='review'&&data.round===data.total-1?'Confronta gli esiti dell’ultimo turno, poi apri il debriefing.':teacherHelp[p])+'</p><div class="controlrow">'+
  (p==='lobby'? (data.count?button('start','Avvia la missione','primary'):'<p>In attesa della prima squadra.</p>'):
    review?(p==='review'?button('next',data.round===7?'Apri il debriefing':'Apri il turno successivo','primary'):'')+button('export','Scarica il verbale'):
    button('close','Chiudi il turno','primary')+button(p==='paused'?'resume':'pause',p==='paused'?'Riprendi':'Pausa')+(!data.scene.news?button('news','Invia aggiornamento'):''))+(['open','paused','review'].includes(p)&&!(p==='review'&&data.round===data.total-1)?button('finish','Termina simulazione','finish'): '')+'</div>'+
  (review?'<form id="pair"><label>Prima squadra<select name="left">'+options(data.pair[0],false)+'</select></label><label>Seconda squadra<select name="right">'+options(data.pair[1],true)+'</select></label><label>Turno<select name="focus"><option value="">Ultimo concluso</option>'+data.teams[0].history.map(h=>'<option value="'+h.round+'" '+(data.focus===h.round?'selected':'')+'>'+(h.round+1)+' · '+esc(h.title)+'</option>').join('')+'</select></label><button>Proietta confronto</button></form>':'')+'</section>';
 return intro()+(p==='lobby'?'':track())+'<div class="columns"><div>'+panel+(p==='lobby'?guide():transcript())+'</div><aside><section class="darkcard">'+tag('Stato dell’aula')+'<h2>'+data.count+' squadre</h2>'+(['open','paused'].includes(p)?'<p>'+data.ready+' / '+data.count+' consegne</p>':'')+roster()+'</section>'+paths()+'</aside></div>'+(review?compare():'')+
 '<details class="journal"><summary>Gestione sessione</summary><p>Aprire una nuova aula sostituisce la sessione corrente. Puoi scaricare prima il verbale dei turni conclusi.</p>'+button('export','Scarica verbale')+' '+button('reset','Nuova aula')+'</details>';
}
function screenPage(){
 const p=data.phase;
 if(p==='lobby')return intro()+'<div class="columns"><section class="paper lobbycode">'+tag('Ingresso squadre')+'<h2>'+data.code+'</h2><p>Aprite <b>'+esc(location.host)+'</b> e inserite il codice.</p><p>'+data.count+' squadre collegate</p><div class="tags">'+data.names.map(n=>'<span>'+esc(n)+'</span>').join('')+'</div></section>'+siteMap(seedAssets,'Mappa della crisi')+'</div>';
 return intro()+track()+(p==='open'||p==='paused'?'<div class="columns"><div>'+transcript()+'</div><section class="paper"><h2>'+esc(data.scene.prompt)+'</h2><p class="big">'+data.ready+' / '+data.count+'</p>Squadre che hanno consegnato</section>'+paths()+'</div>':'<p class="question">'+esc(data.scene.question)+'</p>'+compare());
}
function draw(){
 const focus=document.activeElement,wasText=focus?.name==='reason',pos=focus?.selectionStart,open=[...document.querySelectorAll('details')].map(el=>el.open);
 app.innerHTML=role==='team'?teamPage():role==='teacher'?teacherPage():screenPage();
 const details=document.querySelectorAll('details');if(details.length===open.length)details.forEach((v,i)=>{v.open=open[i];});
 if(wasText&&$('textarea')){$('textarea').focus({preventScroll:true});$('textarea').setSelectionRange(pos,pos);}
}
async function refresh(force=false){
 if(polling){dirty=dirty||force;return;}polling=true;
 try{
  const v=await api('/api/view?role='+role+(data&&!force?'&at='+encodeURIComponent(data.room+'-'+data.version):''));
  if(v){
    const same=data?.room===v.room&&data?.round===v.round;

    if(data&&!data.scene.news&&v.scene.news&&same)newsNotice='Aggiornamento ricevuto dalla regia.';
    data=v;offset=v.now-Date.now();
    // Other teams' submissions must not move keyboard focus or replace a draft.
    const signature=role==='team'?JSON.stringify([v.room,v.round,v.phase,v.scene.news,v.team,v.brief]):v.room+'-'+v.version;
    if(signature!==lastRender||force){lastRender=signature;draw();clock();animateChat();}
  }
  if($('#notice').dataset.offline){delete $('#notice').dataset.offline;notice('Collegamento ripristinato.');}
  if(newsNotice){notice(newsNotice);newsNotice='';}
 }catch(e){if(e.status===401){location.replace('/?postazione='+station.slug);}else{$('#notice').dataset.offline='1';notice('Collegamento interrotto. Riconnessione automatica in corso.');}}
 finally{polling=false;if(dirty){dirty=false;void refresh(true);}}
}
function saveDraft(){const f=$('#decide');if(!f)return;const ids=[...f.querySelectorAll(':checked')].map(x=>x.value);session(draftKey(),JSON.stringify({ids,reason:f.reason.value}));}
app.addEventListener('input',e=>{if(e.target.closest('#decide'))saveDraft();});
app.addEventListener('click',e=>{const target=e.target.closest('[data-follow]');if(target)perform(()=>command('follow',{id:target.dataset.follow}));});
async function perform(fn){if(busy)return;busy=true;notice('');try{await fn();await refresh(true);}catch(e){notice(e.message);await refresh();}finally{busy=false;}}
app.addEventListener('submit',e=>{e.preventDefault();const f=e.target,d=Object.fromEntries(new FormData(f));
 if(f.id==='access'){
   if(busy)return;
   const dest=station;
   if(sessions[dest.id]){location.assign(dest.path);return;}
   busy=true;notice('');
   f.querySelector('.stations').disabled=true;
   const submit=f.querySelector('button[type=submit]');submit.disabled=true;
   api('/api/'+dest.api,d).then(()=>location.replace(dest.path)).catch(err=>{
     busy=false;submit.disabled=false;f.querySelector('.stations').disabled=false;notice(err.message);
   });
   return;
 }
 if(f.id==='decide'){const ids=new FormData(f).getAll('ids');if(ids.length!==1)return notice('Scegli una risposta.');return perform(()=>api('/api/submit',{room:data.room,round:data.round,ids,reason:d.reason}));}
 if(f.id==='pair')return perform(()=>command('compare',{ids:[d.left,d.right].filter(Boolean),focus:d.focus===''?null:Number(d.focus)}));
});
const command=(op,extra={})=>api('/api/control',{room:data.room,step:data.step,op,...extra});
function download(){
 const txt=['ESCALATION CRISIS ROOM — PAZIENTE ZERO','Meridian Components S.r.l. · Verbale della sessione '+data.code,'Stato: '+(data.endedByTeacher?'Terminata dal docente al turno '+(data.round+1)+' di '+data.total:labels[data.phase]),'',...data.teams.flatMap(t=>[t.name.toUpperCase(),
  ...t.history.flatMap(h=>['Turno '+(h.round+1)+' · '+h.title,'Aggiornamento regia: '+(h.news?'inviato':'non inviato'),h.titles.join(' + ')||(h.interrupted?'Turno interrotto':'Nessuna azione'),h.reason,...h.notes,'Bilancio cumulato: '+h.metrics.affected+'/12 sistemi, '+h.metrics.minutes+' minuti di fermo, € '+value(h.metrics.cost)+', '+h.metrics.proof+' elementi.','']),
  'Fascicolo: '+(t.proof.join(', ')||'vuoto'),...t.assessment.map(x=>x.label+': '+x.level),''])].join('\n');
 const u=URL.createObjectURL(new Blob([txt],{type:'text/plain;charset=utf-8'}));const a=document.createElement('a');a.href=u;a.download='Verbale-Crisis-Room-'+data.code+'.txt';a.click();setTimeout(()=>URL.revokeObjectURL(u),1000);
}
app.addEventListener('click',e=>{const op=e.target.closest('[data-op]')?.dataset.op;if(!op)return;
 if(op==='export')return download();
 if(op==='finish'){
   const details=data.phase==='review'?'Gli esiti di questo turno sono già registrati.':'Le decisioni già consegnate vengono registrate. Per le squadre che non hanno consegnato, il bilancio resta quello attuale.';
   if(window.confirm('Terminare la simulazione al turno '+(data.round+1)+' di '+data.total+'? '+details+' Si aprirà il debriefing per tutta l’aula.'))return perform(()=>command('finish',{confirm:true}));
   return;
 }
 if(op==='reset'){const confirm=window.prompt('Per sostituire questa sessione inserisci il suo codice aula.');if(!confirm)return;return perform(()=>command(op,{confirm}));}
 if(op==='close'&&data.ready<data.count&&!window.confirm('Mancano '+(data.count-data.ready)+' consegne. Chiudere registrando nessuna azione per queste squadre?'))return;
 perform(()=>command(op,op==='close'?{confirm:data.ready<data.count}:{}));
});
if(entrance){
  landing();
  app.addEventListener('change',e=>{
    if(e.target.name!=='station'||busy)return;
    station=stations.find(st=>st.id===e.target.value);
    role=station.id;
    notice('');$('#access-fields').innerHTML=accessFields();
  });
  async function checkSessions(){
    try{
      const latest=await api('/api/access');
      const changed=Boolean(latest[role])!==Boolean(sessions[role]);
      sessions=latest;
      if(changed&&!busy)$('#access-fields').innerHTML=accessFields();
    }catch{ /* The login form can still submit after a network interruption. */ }
  }
  checkSessions();
  window.addEventListener('pageshow',e=>{if(e.persisted){location.reload();}});
}else{
  const back=document.querySelector('#change-station');back.hidden=false;
  refresh();
  setInterval(()=>{if(!busy)refresh();},1300);
}

