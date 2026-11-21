import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import {fileURLToPath} from 'node:url';
import {rounds,replies,assets,initial,briefing,resolve,indicator,status,evidenceReview} from './mission.js';

const root=path.dirname(fileURLToPath(import.meta.url));
const dir=process.env.DATA_DIR||process.env.RAILWAY_VOLUME_MOUNT_PATH||path.join(root,'data');
fs.mkdirSync(dir,{recursive:true});
const file=path.join(dir,'session.json');
const password=process.env.TEACHER_PASSWORD||(!process.env.RAILWAY_ENVIRONMENT && !process.env.RAILWAY_PROJECT_ID && process.env.NODE_ENV!=='production' ? crypto.randomBytes(12).toString('base64url') : '');
if(password.length<12) throw Error('Configurare TEACHER_PASSWORD con almeno 12 caratteri.');
if(!process.env.TEACHER_PASSWORD) console.log('Password docente locale per questo avvio:',password);
const digest=x=>crypto.createHash('sha256').update(x).digest('hex');
const teacherToken=crypto.createHmac('sha256',password).update('ESCALATION Crisis Room | docente v1').digest('hex');
const equal=(a,b)=>crypto.timingSafeEqual(Buffer.from(digest(a)),Buffer.from(digest(b)));
const token=()=>crypto.randomBytes(24).toString('hex');
const room=()=>({id:token(),code:String(crypto.randomInt(100000,1000000)),phase:'lobby',clockEnd:null,remaining:150000,round:0,version:0,step:0,news:false,teams:[],pair:[],focus:null});
let game=fs.existsSync(file)?JSON.parse(fs.readFileSync(file,'utf8')):room();
function save(next){
  fs.writeFileSync(file+'.tmp',JSON.stringify(next),{mode:0o600,flush:true});
  fs.renameSync(file+'.tmp',file);
  game=next;
}
if(!fs.existsSync(file)) save(game);
const reject=(n,m)=>{const e=new Error(m);e.status=n;throw e;};
function json(res,n,data,headers={}){res.writeHead(n,{'Content-Type':'application/json; charset=utf-8','Cache-Control':'no-store',...headers});res.end(JSON.stringify(data));}
function cookie(req,name){return (req.headers.cookie||'').split(';').map(x=>x.trim()).find(x=>x.startsWith(name+'='))?.slice(name.length+1)||'';}
function ticket(req,name,value){
  const secure=process.env.RAILWAY_PUBLIC_DOMAIN||req.headers['x-forwarded-proto']==='https';
  return {'Set-Cookie':name+'='+value+'; Path=/; HttpOnly; SameSite=Strict; Max-Age=43200'+(secure?'; Secure':'')};
}
function authorize(req){if(!equal(cookie(req,'cr_teacher'),teacherToken)) reject(401,'Accedi alla regia docente.');}
function teamOf(req,g){const key=digest(cookie(req,'cr_team'));return g.teams.find(t=>t.key===key);}
function needTeam(req,g){return teamOf(req,g)||reject(401,'Rientra nella squadra da questo browser.');}
const attempts=new Map();
function limit(req,route){
  const ip=(req.headers['x-forwarded-for']||req.socket.remoteAddress||'').split(',').at(-1).trim();
  const key=route+ip,now=Date.now(),old=attempts.get(key);
  if(old&&old.end>now&&old.n>=15) reject(429,'Troppi tentativi. Riprova tra un minuto.');
  return ()=>attempts.set(key,{end:old&&old.end>now?old.end:now+60000,n:old&&old.end>now?old.n+1:1});
}
setInterval(()=>{for(const [k,v] of attempts)if(v.end<=Date.now()) attempts.delete(k);},60000).unref();
async function body(req){
  if(!(req.headers['content-type']||'').startsWith('application/json'))reject(415,'Richiesta JSON richiesta.');
  const parts=[];let size=0;
  for await(const part of req){size+=part.length;if(size>4096)reject(413,'Testo troppo lungo.');parts.push(part);}
  try{const b=JSON.parse(Buffer.concat(parts));if(b&&typeof b==='object'&&!Array.isArray(b))return b;}catch{}
  reject(400,'Richiesta non valida.');
}
const actionsFor=(i,ids)=>rounds[i].actions.filter(a=>ids.includes(a.id)).map(a=>a.title);
function snapshotTeam(t){return {id:t.id,name:t.name,ready:!!t.pending,metrics:indicator(t.state),proof:t.state.proof,assessment:evidenceReview(t.state),map:assets.map(([id,n,d])=>({id,n,d,status:status(t.state,id)})),history:t.history};}
function view(g,role,t){
  const i=g.round,r=rounds[i],review=['review','end'].includes(g.phase);
  const out={room:g.id.slice(0,12),version:g.version,step:g.step,phase:g.phase,round:i,total:rounds.length,
    clockEnd:g.clockEnd,remaining:g.remaining,now:Date.now(),count:g.teams.length,ready:g.teams.filter(x=>x.pending).length,
    scene:{time:r.time,title:r.title,speaker:r.speaker,role:r.role,quote:r.quote,prompt:r.prompt,
      reply:replies[i],news:g.news?r.news:null,question:review?r.question:null},pair:g.pair,focus:g.focus??null};
  if(role==='teacher'||role==='screen')out.code=g.code;
  if(role==='teacher') out.teams=g.teams.map(x=>({...snapshotTeam(x),resume:x.resume}));
  if(role==='screen'){
    out.names=g.teams.map(x=>x.name);
    out.teams=review?g.pair.map(id=>g.teams.find(t=>t.id===id)).filter(Boolean).map(snapshotTeam):[];
  }
  if(role==='team'){
    out.team=snapshotTeam(t);
    out.brief=briefing(i,review&&t.history.length?t.history.at(-1).before:t.state);
    out.actions=r.actions;
    out.pending=t.pending?{titles:actionsFor(i,t.pending.ids),reason:t.pending.reason}:null;
  }
  return out;
}
function control(g,b){
  if(b.room!==g.id.slice(0,12)||b.step!==g.step)reject(409,'La regia è già cambiata. Aggiorna la vista.');
  const op=b.op;
  if(op==='reset'){
    if(b.confirm!==g.code)reject(400,'Inserisci il codice della sessione da sostituire.');
    return room();
  }
  if(op==='start'&&g.phase==='lobby'&&g.teams.length){g.phase='open';g.clockEnd=Date.now()+g.remaining;}
  else if(op==='pause'&&g.phase==='open'){g.remaining=Math.max(0,g.clockEnd-Date.now());g.clockEnd=null;g.phase='paused';}
  else if(op==='resume'&&g.phase==='paused'){g.phase='open';g.clockEnd=Date.now()+g.remaining;}
  else if(op==='news'&&['open','paused'].includes(g.phase)&&!g.news){g.news=true;}
  else if(op==='close'&&['open','paused'].includes(g.phase)){
    if(g.teams.some(t=>!t.pending)&&b.confirm!==true)reject(409,'Alcune squadre devono ancora consegnare.');
    for(const t of g.teams){
      const p=t.pending||{ids:[],reason:'Nessuna consegna entro la chiusura.'};
      const {s,notes}=resolve(t.state,g.round,p.ids);
      t.history.push({round:g.round,title:rounds[g.round].title,titles:actionsFor(g.round,p.ids),reason:p.reason,
        notes,before:t.state,metrics:indicator(s),news:g.news});
      t.state=s;t.pending=null;
    }
    g.phase='review';g.clockEnd=null;g.focus=null;if(!g.pair.length)g.pair=g.teams.slice(0,2).map(t=>t.id);
  }else if(op==='next'&&g.phase==='review'){
    if(g.round===rounds.length-1)g.phase='end';else{g.round++;g.phase='open';g.news=false;g.remaining=150000;g.clockEnd=Date.now()+g.remaining;}
  }else if(op==='compare'&&['review','end'].includes(g.phase)){
    if(!Array.isArray(b.ids)||b.ids.length<1||b.ids.length>2||new Set(b.ids).size!==b.ids.length||!b.ids.every(id=>g.teams.some(t=>t.id===id)))reject(400,'Seleziona squadre diverse.');
    if(b.focus!=null&&(!Number.isInteger(b.focus)||b.focus<0||b.focus>g.round))reject(400,'Turno non disponibile.');
    g.pair=b.ids;g.focus=b.focus??null;
  }else reject(409,'Comando non disponibile in questa fase.');
  g.step++;return g;
}
const mime={'.html':'text/html; charset=utf-8','.css':'text/css','.js':'text/javascript','.svg':'image/svg+xml','.woff2':'font/woff2'};
const publicFiles=new Map(['/','/squadra','/regia','/schermo'].map(x=>[x,'index.html']));
for(const f of ['ui.js','style.css','assets/escalation-nome.svg','assets/escalation-segno.svg','assets/archivo-escalation.woff2'])publicFiles.set('/'+f,f);
const server=http.createServer(async(req,res)=>{
  res.setHeader('X-Content-Type-Options','nosniff');res.setHeader('Referrer-Policy','same-origin');
  res.setHeader('Content-Security-Policy',"default-src 'self'; style-src 'self'; script-src 'self'; img-src 'self'; object-src 'none'; frame-ancestors 'none'; base-uri 'none'; form-action 'self'");
  try{
    const url=new URL(req.url,'http://local'),p=url.pathname;
    if(req.method==='GET'){
      if(p==='/api/access'){
        const teacher=equal(cookie(req,'cr_teacher'),teacherToken);
        return json(res,200,{teacher,team:!!teamOf(req,game),screen:teacher||equal(cookie(req,'cr_screen'),game.id)});
      }
      if(p==='/health')return json(res,200,{status:'ok'});
      if(p==='/api/view'){
        const role=url.searchParams.get('role');let t;
        if(role==='teacher')authorize(req);
        else if(role==='team')t=needTeam(req,game);
        else if(role==='screen'){if(!equal(cookie(req,'cr_screen'),game.id)&&!equal(cookie(req,'cr_teacher'),teacherToken))reject(401,'Inserisci il codice aula.');}
        else reject(400,'Vista sconosciuta.');
        if(url.searchParams.get('at')===game.id.slice(0,12)+'-'+game.version){res.writeHead(204,{'Cache-Control':'no-store'});return res.end();}
        return json(res,200,view(game,role,t));
      }
      const f=publicFiles.get(p);
      if(!f)reject(404,'Pagina non trovata.');
      res.writeHead(200,{'Content-Type':mime[path.extname(f)],'Cache-Control':'no-cache'});return res.end(fs.readFileSync(path.join(root,'public',f)));
    }
    if(req.method!=='POST')reject(405,'Metodo non consentito.');
    const b=await body(req);
    if(p==='/api/login'){
      const bad=limit(req,p);
      if(typeof b.password!=='string'||!equal(b.password,password)){bad();reject(401,'Password docente errata.');}
      return json(res,200,{ok:true},ticket(req,'cr_teacher',teacherToken));
    }
    if(p==='/api/screen'||p==='/api/join'){
      const bad=limit(req,p);
      if(b.code!==game.code){bad();reject(403,'Codice aula non valido.');}
      if(p==='/api/screen')return json(res,200,{ok:true},ticket(req,'cr_screen',game.id));
      const g=structuredClone(game);
      const name=typeof b.name==='string'?b.name.trim().replace(/\s+/g,' '):'';
      if(name.length<2||name.length>32)reject(400,'Usa un nome squadra da 2 a 32 caratteri.');
      const existing=g.teams.find(t=>t.name.toLowerCase()===name.toLowerCase());
      if(existing){
        if(!b.resume||!equal(String(b.resume).toUpperCase(),existing.resume)){bad();reject(409,'Nome già presente. Per rientrare usa il codice recupero della regia.');}
      }else if(g.phase!=='lobby')reject(409,'Sessione già avviata. Puoi rientrare in una squadra registrata.');
      if(!existing&&g.teams.length>=80)reject(409,'Aula completa.');
      const secret=token(),t=existing||{id:token().slice(0,10),name,resume:crypto.randomBytes(5).toString('hex').toUpperCase(),state:initial(),history:[],pending:null};
      t.key=digest(secret);if(!existing)g.teams.push(t);g.version++;save(g);
      return json(res,200,{ok:true},ticket(req,'cr_team',secret));
    }
    if(p==='/api/control'){
      authorize(req);const g=control(structuredClone(game),b);g.version++;save(g);return json(res,200,{ok:true});
    }
    if(p==='/api/submit'){
      const g=structuredClone(game),t=needTeam(req,g);
      if(b.room!==g.id.slice(0,12)||b.round!==g.round)reject(409,'Turno cambiato. Controlla la sala.');
      const valid=rounds[g.round].actions.map(a=>a.id);
      if(!Array.isArray(b.ids)||b.ids.length!==2||new Set(b.ids).size!==2||!b.ids.every(x=>valid.includes(x)))reject(400,'Seleziona due azioni distinte.');
      if(b.ids.includes('ransom')&&b.ids.includes('pay'))reject(400,'Scegli una sola linea sul riscatto.');
      const reason=typeof b.reason==='string'?b.reason.trim():'';
      if(reason.length<5||reason.length>300)reject(400,'Motiva la scelta in 5–300 caratteri.');
      const ids=valid.filter(id=>b.ids.includes(id));
      if(t.pending&&t.pending.reason===reason&&String(t.pending.ids)===String(ids))return json(res,200,{ok:true});
      if(g.phase!=='open'||t.pending)reject(409,'Consegna chiusa o già registrata.');
      t.pending={ids,reason};g.version++;save(g);return json(res,200,{ok:true});
    }
    reject(404,'Risorsa non trovata.');
  }catch(e){if(!e.status)console.error('Errore applicazione',e.message);if(!res.headersSent)json(res,e.status||500,{error:e.status?e.message:'Operazione non salvata. Riprova.'});}
});
server.headersTimeout=15000;server.requestTimeout=20000;
server.listen(Number(process.env.PORT||3000),'0.0.0.0',()=>console.log('ESCALATION Crisis Room in ascolto su',server.address().port));
