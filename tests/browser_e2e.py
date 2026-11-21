from playwright.sync_api import sync_playwright,expect
from pathlib import Path
import tempfile,subprocess,os
root=Path(__file__).resolve().parents[1]
errors=[]
with tempfile.TemporaryDirectory() as state:
 proc=subprocess.Popen(['node','server.js'],cwd=root,env={**os.environ,'TEACHER_PASSWORD':'crisis-browser-test','PORT':'0','DATA_DIR':state},stdout=subprocess.PIPE,text=True)
 url='http://127.0.0.1:'+proc.stdout.readline().strip().split()[-1]
 try:
  with sync_playwright() as pw:
   browser=pw.chromium.launch(executable_path=os.environ.get('CHROMIUM_PATH') or None,args=['--no-sandbox'])
   def tab(path,width):
    ctx=browser.new_context(viewport={'width':width,'height':900})
    p=ctx.new_page()
    p.on('pageerror',lambda e: errors.append(str(e)))
    p.goto(url+path);p.wait_for_load_state('networkidle');return p
   teacher=tab('/',1366)
   teacher.get_by_text('Docente',exact=True).click()
   teacher.locator('[name=password]').fill('crisis-browser-test');teacher.locator('#access button').click()
   code=teacher.locator('.roomcode strong').inner_text()
   screen=tab('/',1366);screen.get_by_text('Proiettore',exact=True).click();screen.locator('[name=code]').fill(code);screen.locator('#access button').click()
   teams=[]
   for name,width in [('Orione',390),('Fenice',1200)]:
    p=tab('/' if name=='Orione' else '/squadra',width)
    expect(p.get_by_role('heading',name='Entra in Crisis Room')).to_be_visible()
    p.locator('[name=code]').fill(code);p.locator('[name=name]').fill(name);p.locator('#access button').click()
    expect(p.get_by_text('Squadra registrata')).to_be_visible()
    teams.append(p)
   teacher.get_by_text('Cambia postazione').click()
   teacher.get_by_text('Docente',exact=True).click()
   teacher.get_by_role('link',name='Riprendi la regia').click()
   teacher.locator('[data-op=start]').click()
   for i in range(8):
    for j,p in enumerate(teams):
     group=p.locator('#decide [type=checkbox]')
     expect(group.first).to_be_enabled()
     group.nth(2*j).check();group.nth(2*j+1).check()
     p.locator('textarea').fill('Verifichiamo gli effetti sul reparto '+str(i+1))
     if i==0 and j==0:
      teacher.locator('[data-op=pause]').click()
      expect(group.first).to_be_disabled()
      teacher.locator('[data-op=news]').click()
      expect(p.locator('.dispatch')).to_be_visible()
      teacher.locator('[data-op=resume]').click()
      expect(group.first).to_be_enabled();expect(group.first).to_be_checked()
      p.reload();expect(group.first).to_be_checked()
      expect(p.locator('textarea')).to_have_value('Verifichiamo gli effetti sul reparto 1')
     if i==3:
      assert p.evaluate('document.documentElement.scrollWidth <= innerWidth'), 'mobile overflow'
     p.locator('#decide button').click();expect(p.get_by_text('Ordine consegnato')).to_be_visible()
    expect(teacher.get_by_text('2 / 2 consegne')).to_be_visible()
    teacher.locator('[data-op=close]').click()
    expect(screen.locator('.comparison')).to_be_visible()
    if i==4:
     teacher.locator('[name=focus]').select_option('1')
     teacher.locator('#pair button').click()
     expect(screen.get_by_text('Turno 2 di 5')).to_be_visible()
    teacher.locator('[data-op=next]').click()
    if i<7:expect(screen.locator('.comparison')).to_have_count(0)
   expect(screen.get_by_role('heading',name='Debriefing')).to_be_visible()
   expect(teams[0].get_by_text('Qualità della ricostruzione')).to_be_visible()
   with teacher.expect_download() as dl: teacher.locator('[data-op=export]').first.click()
   txt=Path(dl.value.path()).read_text()
   assert 'Turno 8' in txt and 'Orione'.upper() in txt and 'FENICE' in txt and 'Origine e tempi' in txt
   print('Ingresso unico, compatibilità, ripresa; UI 8/8 turni, 4 contesti, mobile 390px, pausa, notizia, bozza dopo ricarica, confronto storico, export TXT. Errori:',errors,flush=True)
   assert not errors
   browser.close()
 finally:proc.terminate();proc.wait()
