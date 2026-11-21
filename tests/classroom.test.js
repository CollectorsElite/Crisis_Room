import test from 'node:test';
import assert from 'node:assert/strict';
import {spawn} from 'node:child_process';
import {once} from 'node:events';
import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';

test('80 squadre: ingresso, consegne simultanee e lettura degli esiti',async()=>{
  const directory=await fs.mkdtemp(path.join(os.tmpdir(),'crisis-class-'));
  const password='test-locale-capienza';
  const child=spawn(process.execPath,['server.js'],{cwd:new URL('../',import.meta.url),env:{...process.env,PORT:'0',DATA_DIR:directory,TEACHER_PASSWORD:password},stdio:['ignore','pipe','inherit']});
  try{
    const [msg]=await once(child.stdout,'data');
    const base='http://127.0.0.1:'+String(msg).trim().split(' ').at(-1);
    async function send(route,body,cookie=''){
      const res=await fetch(base+route,{method:'POST',headers:{cookie,'content-type':'application/json'},body:JSON.stringify(body)});
      return {code:res.status,cookie:res.headers.get('set-cookie')?.split(';')[0]};
    }
    const read=async(role,cookie)=>(await fetch(base+'/api/view?role='+role,{headers:{cookie}})).json();
    const host=(await send('/api/login',{password})).cookie;
    const init=await read('teacher',host);
    const group=await Promise.all(Array.from({length:80},(_,i)=>send('/api/join',{code:init.code,name:'Tavolo '+(i+1)})));
    assert.ok(group.every(r=>r.code===200&&r.cookie));
    assert.equal((await send('/api/join',{code:init.code,name:'Tavolo extra'})).code,409);
    assert.equal((await send('/api/control',{op:'start',room:init.room,step:init.step},host)).code,200);
    const submissions=await Promise.all(group.map(g=>send('/api/submit',{room:init.room,round:0,ids:['isolate'],reason:'Conservare il messaggio e isolare il PC.'},g.cookie)));
    assert.ok(submissions.every(r=>r.code===200));
    const turn=await read('teacher',host);assert.equal(turn.ready,80);
    assert.equal((await send('/api/control',{op:'close',room:init.room,step:turn.step},host)).code,200);
    const views=await Promise.all(group.map(g=>read('team',g.cookie)));
    assert.equal(new Set(views.map(v=>v.team.id)).size,80);
    assert.ok(views.every(v=>v.phase==='review'&&v.team.history.length===1&&v.team.metrics.affected===1));
  }finally{const stopped=once(child,'exit');child.kill();await stopped;await fs.rm(directory,{recursive:true,force:true});}
});
