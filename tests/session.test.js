import test from 'node:test';
import assert from 'node:assert/strict';
import {spawn} from 'node:child_process';
import {once} from 'node:events';
import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import {initial,resolve,rounds,status,indicator} from '../mission.js';

test('Effetti riproducibili, isolamento iniziale e ripristino con collaudo',()=>{
  let s=initial();
  for(const [i,ids] of [['isolate','mail'],['logs','fallback'],['staff','hrmap'],['manual','verify']].entries())s=resolve(s,i,ids).s;
  assert.equal(s.hit.length,1);assert.equal(status(s,'erp'),'online');
  const before=initial();
  const first=resolve(before,0,['call','forms']);
  assert.deepEqual(first,resolve(before,0,['call','forms']));
  assert.deepEqual(before,initial());
  s=before;
  for(let i=0;i<7;i++)s=resolve(s,i,i===6?['restore','test']:[]).s;
  assert.equal(status(s,'erp'),'restored');assert.ok(s.hit.includes('erp'));assert.ok(indicator(s).cost>0);
});
test('Sessione completa, concorrenza, ripresa e separazione delle viste',async()=>{
  const dir=await fs.mkdtemp(path.join(os.tmpdir(),'crisis-test-'));
  const password='test-locale-sessione';
  let child,url;
  async function boot(){
    child=spawn(process.execPath,['server.js'],{cwd:new URL('../',import.meta.url),env:{...process.env,PORT:'0',DATA_DIR:dir,TEACHER_PASSWORD:password},stdio:['ignore','pipe','inherit']});
    const [msg]=await once(child.stdout,'data');
    url='http://127.0.0.1:'+String(msg).trim().split(' ').at(-1);
  }
  async function stop(){const closed=once(child,'exit');child.kill();await closed;}
  async function req(p,body,cookie=''){
    const res=await fetch(url+p,{method:body?'POST':'GET',headers:{cookie,'content-type':'application/json'},body:body?JSON.stringify(body):undefined});
    const result=res.status===204?null:await res.json();
    return {code:res.status,result,cookie:res.headers.get('set-cookie')?.split(';')[0]};
  }
  const check=(r,n=200)=>{assert.equal(r.code,n,JSON.stringify(r.result));return r.result;};
  await boot();
  try{
    check(await req('/health'));
    check(await req('/api/view?role=teacher'),401);
    const auth=(await req('/api/login',{password})).cookie;
    const view=async()=>check(await req('/api/view?role=teacher',null,auth));
    const first=await view(),code=first.code;
    const op=async(action,more={})=>{const v=await view();return req('/api/control',{room:v.room,step:v.step,op:action,...more},auth);};
    const screen=(await req('/api/screen',{code})).cookie;
    check(await req('/api/view?role=screen'),401);
    const join=async name=>(await req('/api/join',{code,name})).cookie;
    let [a,b]=await Promise.all([join('Alfa'),join('Beta')]);
    assert.ok(a&&b);check(await req('/api/join',{code,name:'alfa'}),409);
    const tview=async c=>check(await req('/api/view?role=team',null,c));
    const sv=async()=>check(await req('/api/view?role=screen',null,screen));
    assert.equal((await sv()).teams.length,0);
    check(await op('start'));check(await req('/api/join',{code,name:'Gamma'}),409);
    for(let i=0;i<rounds.length;i++){
      const v=await view(),ids=(await tview(a)).actions.map(x=>x.id),otherIds=(await tview(b)).actions.map(x=>x.id);
      const send=(cookie,ids)=>req('/api/submit',{room:v.room,round:i,ids,reason:'Manteniamo la continuità del reparto.'},cookie);
      if(i===0){
        check(await op('pause'));check(await send(a,ids.slice(0,1)),409);
        check(await op('news'));assert.ok((await sv()).scene.news);
        check(await op('resume'));check(await send(a,[ids[0],ids[0]]),400);
        check(await op('close'),409);
      }
      if(i===1){
        const left=await tview(a),right=await tview(b);
        assert.equal(left.scene.title,'La copia di Sara');assert.equal(right.scene.title,'La seconda postazione');
        assert.notEqual(left.scene.prompt,right.scene.prompt);
        check(await send(a,['segment']),400);
        check(await op('follow',{id:right.team.id}));
        assert.equal((await sv()).scene.title,right.scene.title);
        assert.equal(left.thread.length,2);assert.equal(left.thread[1].messages.length,5);
      }
      const submissions=await Promise.all([send(a,ids.slice(0,1)),send(a,ids.slice(0,1)),...(i===2?[]:[send(b,otherIds.slice(1,2))])]);
      submissions.forEach(r=>check(r));
      if(i===3){
        await stop();await boot();assert.equal((await tview(a)).pending.titles.length,1);
        const resume=(await view()).teams.find(t=>t.name==='Alfa').resume;
        const rejoin=await req('/api/join',{code,name:'Alfa',resume});check(rejoin);
        check(await req('/api/view?role=team',null,a),401);a=rejoin.cookie;
      }
      const now=await view();
      const close=()=>req('/api/control',{room:v.room,step:now.step,op:'close',confirm:true},auth);
      const closes=await Promise.all([close(),close()]);assert.deepEqual(closes.map(x=>x.code).sort(),[200,409]);
      assert.equal((await tview(a)).team.history.length,i+1);
      const scr=await sv();assert.equal(scr.teams.length,2);assert.ok(!JSON.stringify(scr).includes('"resume"'));
      assert.ok(!('teams' in await tview(a)));
      if(i===2)assert.equal((await tview(b)).team.history.at(-1).titles.length,0);
      check(await op('next'));
    }
    const end=await view();assert.equal(end.phase,'end');assert.notDeepEqual(end.teams[0].metrics,end.teams[1].metrics);
    check(await op('compare',{ids:end.teams.map(t=>t.id).reverse(),focus:2}));
    assert.equal((await sv()).focus,2);
    check(await op('reset',{confirm:'errato'}),400);check(await op('reset',{confirm:code}));
    assert.equal((await view()).phase,'lobby');check(await req('/api/view?role=team',null,a),401);
    check(await req('/api/view?role=screen',null,screen),401);

    for(const phase of ['open','paused','review']){
      const lobby=await view();
      const registrations=await Promise.all(['Alfa','Beta'].map(name=>req('/api/join',{code:lobby.code,name})));
      const [alpha,beta]=registrations.map(r=>r.cookie);
      check(await op('start'));
      const before=(await tview(beta)).team.metrics;
      const decision={room:lobby.room,round:0,ids:['isolate'],reason:'Conserviamo il messaggio.'};
      check(await req('/api/submit',decision,alpha));
      if(phase==='paused')check(await op('pause'));
      if(phase==='review')check(await op('close',{confirm:true}));
      check(await op('finish'),400);
      assert.equal((await view()).phase,phase);
      check(await op('finish',{confirm:true}));
      check(await op('finish',{confirm:true}),409);
      check(await req('/api/submit',decision,beta),409);
      if(phase==='paused'){await stop();await boot();}
      const current=await view();
      assert.equal(current.phase,'end');assert.equal(current.endedByTeacher,true);assert.equal(current.clockEnd,null);
      const submitted=(await tview(alpha)).team,other=(await tview(beta)).team;
      assert.equal(submitted.history.length,1);assert.equal(submitted.history[0].reason,decision.reason);
      assert.equal(other.history.length,1);assert.equal(other.history[0].interrupted,phase!=='review');
      if(phase!=='review')assert.deepEqual(other.metrics,before);
      check(await op('reset',{confirm:lobby.code}));
    }
  }finally{await stop();await fs.rm(dir,{recursive:true,force:true});}
});
