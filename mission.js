// The instructor controls classroom time. These times belong to the fictional incident.
export const assets = [
  ['ferri','PC Ferri','Acquisti'], ['conti','PC Conti','Acquisti'], ['share','File server','Servizi centrali'],
  ['nas','NAS backup','Servizi centrali'], ['admin','PC IT','Servizi centrali'], ['erp','ERP SAP','Produzione'],
  ['prod','Linea 05','Produzione'], ['cad','Server CAD','Produzione'], ['hr','PC HR','Uffici'],
  ['cfo','PC finanza','Uffici'], ['sales','PC vendite','Uffici'], ['dg','PC direzione','Uffici']
];
const a = (id, title, detail) => ({id,title,detail});
export const rounds = [
  {
    time:'09:14', title:'Il primo messaggio', speaker:'Marco Ferri', role:'Acquisti',
    quote:'Ho i preventivi bloccati. Ieri ho aperto un allegato del nostro fornitore di vetri. Adesso sul desktop mi chiedono 2,5 bitcoin.',
    prompt:'Marco è al telefono. Che cosa fate partire nei primi minuti?',
    news:'Il fornitore abituale conferma per telefono che ieri non ha inviato preventivi.',
    question:'Che cosa avrebbe potuto confermare l’origine della segnalazione?',
    actions:[a('isolate','Isolare la postazione','IT separa il PC di Marco dalla rete aziendale.'),a('mail','Conservare il messaggio','Acquisti recupera l’originale e la catena di consegna.'),a('call','Aprire il canale di crisi','I referenti si coordinano su un canale alternativo verificato.'),a('forms','Preparare i moduli cartacei','Il magazzino recupera i prospetti per le spedizioni urgenti.')]
  },{
    time:'09:28',title:'La cartella condivisa',speaker:'Sara Conti',role:'Acquisti',
    quote:'Devo consegnare un ordine. Posso usare la cartella condivisa o rischio di peggiorare la situazione?',
    prompt:'Come presidiate il file server e le attività che ne dipendono?',
    news:'Il responsabile acquisti segnala che anche gli agenti esterni usano la cartella degli ordini.',
    question:'Quale dato vi ha fatto decidere il perimetro del contenimento?',
    actions:[a('segment','Separare il file server','Interrompete l’accesso alla condivisione dai reparti.'),a('logs','Acquisire il registro accessi','IT conserva una copia del registro con riferimento orario.'),a('fallback','Attivare il registro ordini','Gli addetti cominciano a trascrivere gli ordini urgenti.'),a('nasguard','Separare il NAS','Mettete il deposito dei backup fuori dal segmento esposto.')]
  },{
    time:'09:50',title:'Voci dai reparti',speaker:'Giulia Neri',role:'Risorse umane',
    quote:'Nella cartella del personale ci sono buste paga e IBAN. I colleghi si stanno chiamando tra loro. Quali istruzioni diamo?',
    prompt:'Chi informate e quali informazioni raccogliete adesso?',
    news:'Un capoturno segnala che gli operai in linea non consultano la posta durante il turno.',
    question:'Come sapete che le istruzioni sono arrivate anche al personale in turno?',
    actions:[a('staff','Diramare le istruzioni','Coinvolgete i capi turno e chiedete conferma di ricezione.'),a('hrmap','Ricostruire i dati coinvolti','HR identifica le categorie di dati e il perimetro dei dipendenti.'),a('service','Avvisare i clienti in attesa','Il commerciale concorda una finestra alternativa per le consegne.'),a('trace','Ricostruire gli orari','Confrontate la segnalazione iniziale con il giornale del turno.')]
  },{
    time:'10:15',title:'Il bivio del gestionale',speaker:'Antonio Merli',role:'Direzione finanziaria',
    quote:'Il fermo pieno vale 8.000 euro l’ora. Domattina dobbiamo spedire. Se fermiamo SAP, come prepariamo gli ordini?',
    prompt:'L’ERP è ancora operativo. Come gestite la prossima finestra di esposizione?',
    news:'Il magazzino può tenere aperta una postazione manuale. Serve qualcuno che verifichi i documenti.',
    question:'Quale costo avete accettato per proteggere il gestionale?',
    actions:[a('erpcut','Isolare l’ERP','SAP diventa temporaneamente indisponibile agli utenti.'),a('manual','Attivare le spedizioni manuali','Una squadra di magazzino copre parte del carico anche a ERP fermo.'),a('verify','Verificare la copia ERP','Controllate il ripristino di un campione dalla copia offline.'),a('watch','Presidiare il collegamento ERP','Il presidio blocca il primo tentativo. La protezione dura questo turno.')]
  },{
    time:'11:05',title:'Una scadenza sul desktop',speaker:'Ing. Bianchi',role:'Direzione generale',
    quote:'Chiedono 2,5 bitcoin entro sei ore. Ho bisogno di sapere quali alternative abbiamo e che cosa dobbiamo comunicare.',
    prompt:'Avete due incarichi da assegnare tra direzione, privacy e continuità.',
    news:'HR conferma che il fascicolo paghe riguarda 89 persone. Bisogna ancora accertare quali dati siano stati coinvolti.',
    question:'Di quali elementi avevate bisogno per motivare le decisioni su riscatto e privacy?',
    actions:[a('risk','Istruire la decisione privacy','Titolare e DPO documentano fatti, rischi, tempi e seguito necessario.'),a('ransom','Formalizzare la linea sul riscatto','La direzione esclude il pagamento e assegna risorse al recupero.'),a('liaison','Attivare i contatti esterni','Un referente apre i contatti con assicurazione e autorità investigative.'),a('offline','Recuperare la copia offline','Un tecnico porta in ambiente separato il supporto di dodici giorni fa.'),a('pay','Autorizzare il pagamento','La direzione impegna 135.000 € simulati. Il recupero dei servizi rimane da verificare.')]
  },{
    time:'12:10',title:'Tracce al confine',speaker:'Luca Rossi',role:'Amministratore di sistema',
    quote:'Il monitoraggio segnala traffico in uscita. Dal solo volume non posso dire se siano usciti dati personali.',
    prompt:'Come verificate l’ipotesi e contenete il rischio residuo?',
    news:'Il fornitore di connettività può consegnare il riepilogo dei flussi della mattinata.',
    question:'Quali elementi distinguono un sospetto da un fatto accertato?',
    actions:[a('flows','Conservare i flussi di rete','Archiviate sorgenti, destinazioni e intervalli temporali.'),a('perimeter','Chiudere i percorsi residui','IT separa i segmenti esposti e limita le uscite anomale.'),a('image','Acquisire la postazione','Il team forense conserva una copia e documenta la presa in carico.'),a('identity','Revocare le sessioni esposte','Rinnovate le credenziali coinvolte da una postazione affidabile.')]
  },{
    time:'14:30',title:'Rientro in produzione',speaker:'Luca Rossi',role:'Amministratore di sistema',
    quote:'Ho una finestra per riportare i servizi in esercizio. Mi servono un ordine di priorità e un criterio per autorizzare il rientro.',
    prompt:'Quali due attività affidate alla squadra di ripristino?',
    news:'La produzione può convalidare gli ordini campione prima della riapertura agli utenti.',
    question:'Quale prova avreste chiesto prima di autorizzare la riapertura?',
    actions:[a('test','Collaudare il recupero','Provate la copia disponibile in un ambiente separato.'),a('restore','Riattivare SAP per fasi','Con una copia già verificata SAP rientra prima. Altrimenti serve anche il collaudo.'),a('rebuild','Bonificare le postazioni','Ricostruite i terminali compromessi da immagini aziendali affidabili.'),a('orders','Riconciliare gli ordini','Magazzino e amministrazione ricostruiscono le operazioni arretrate.')]
  },{
    time:'Giorno 2',title:'Davanti alla direzione',speaker:'Ing. Bianchi',role:'Direzione generale',
    quote:'Tra dieci minuti entra il consiglio. Voglio sapere che cosa abbiamo salvato, che cosa resta aperto e chi se ne occupa.',
    prompt:'Quali due consegne portate alla riunione?',
    news:'Il consiglio chiede un responsabile e una data di verifica per ogni intervento concordato.',
    question:'Quale decisione cambiereste sapendo quello che sapete adesso?',
    actions:[a('timeline','Firmare la cronologia','Consolidate fonti, orari e punti ancora incerti.'),a('plan','Finanziare il piano di rientro','Date priorità ai servizi ancora fermi e assegnate responsabili.'),a('follow','Aggiornare il fascicolo privacy','Riesaminate rischi e decisioni alla luce degli elementi raccolti.'),a('exercise','Provare la continuità','I reparti verificano insieme la procedura alternativa e gli arretrati.')]
  }
];

export const replies=[
  ['Luca Rossi','Amministratore di sistema','Marco risponde al telefono. Posso seguire lui oppure recuperare il messaggio dal gateway. Chi prende il secondo incarico?'],
  ['Luca Rossi','Amministratore di sistema','Sul NAS ci sono anche copie settimanali. Se lo separiamo adesso, il controllo dei supporti richiederà un passaggio in più.'],
  ['Sara Conti','Acquisti','Ho due colleghi in turno e un agente fuori sede. Se avete istruzioni, le faccio arrivare anche a loro.'],
  ['Luca Rossi','Amministratore di sistema','Ho una copia offline di dodici giorni fa. Verificarla adesso impegna una persona per tutta la finestra.'],
  ['Giulia Neri','Risorse umane','Posso convocare il DPO e ricostruire quando abbiamo avuto ragionevole certezza della violazione. Chi tiene il verbale?'],
  ['Ing. Bianchi','Direzione generale','Distinguiamo ciò che abbiamo osservato da ciò che sospettiamo. Mi serve un aggiornamento che possa riferire ai clienti.'],
  ['Antonio Merli','Direzione finanziaria','Mi servono due numeri distinti: da quando SAP è fermo e quanta attività avete salvato lavorando fuori sistema.'],
  ['Sara Conti','Acquisti','Abbiamo conservato gli ordini e gli orari delle telefonate. Possiamo usarli per verificare la ricostruzione finale.']
];

const evidence = {
  mail:'Email originale',logs:'Registro accessi',hrmap:'Perimetro HR',trace:'Orari verificati',verify:'Verbale prova ERP',
  risk:'Valutazione del rischio',ransom:'Mandato della direzione',pay:'Delibera di pagamento',liaison:'Contatti attivati',flows:'Flussi di rete',image:'Copia forense',
  test:'Collaudo del recupero',orders:'Riconciliazione ordini',timeline:'Cronologia firmata',plan:'Piano con responsabili',
  follow:'Riesame privacy',exercise:'Prova di continuità'
};
export function initial() {
  return {hit:['ferri'],active:['ferri'],cut:[],flags:[],proof:[],minutes:0,loss:0};
}
const has = (s,id) => s.flags.includes(id);
function add(list,id) { if (!list.includes(id)) list.push(id); }
export function indicator(s) {
  return {affected:s.hit.length,active:s.active.length,minutes:s.minutes,cost:Math.round(s.loss*8000/60),proof:s.proof.length};
}
export function status(s,id) {
  if(s.cut.includes(id)) return s.active.includes(id)?'isolated-hit':'isolated';
  if(s.active.includes(id)) return 'affected';
  return s.hit.includes(id)?'restored':'online';
}
export function briefing(i,s) {
  if(i===1) return has(s,'isolate')?'La postazione di Marco è isolata. Luca verifica se la condivisione era già stata raggiunta.':'Sul file server risultano file illeggibili. Sara vede le prime estensioni anomale.';
  if(i===2) return has(s,'call')?'Il canale di crisi è pronto. I capi reparto attendono istruzioni.':'Le richieste arrivano a recapiti diversi. Manca un punto di coordinamento.';
  if(i===3) return has(s,'nasguard')?'Il NAS è separato. L’ultima copia offline sicuramente disponibile risale a dodici giorni fa.':'Il NAS è nel perimetro da verificare. La copia offline disponibile risale a dodici giorni fa.';
  if(i===4) return 'Stato SAP: '+erpLabel(s)+'. '+(has(s,'manual')?'Il magazzino lavora in modalità manuale.':'La squadra non ha attivato le spedizioni manuali.');
  if(i===5) return has(s,'hrmap')?'HR ha già identificato le categorie di dati. Manca la verifica dei flussi in uscita.':'La squadra deve ancora identificare il perimetro dei dati HR.';
  if(i===6) return (has(s,'verify')?'La copia ERP è già stata verificata. ':has(s,'offline')?'La copia offline è già sul banco di prova. ':'Il supporto offline deve ancora essere predisposto. ')+'SAP: '+erpLabel(s)+'.';
  if(i===7) return 'Bilancio provvisorio: '+s.hit.length+' sistemi coinvolti, '+s.minutes+' minuti di fermo ERP e '+s.proof.length+' elementi documentati.';
  return 'Meridian Components S.r.l. · 120 persone, tre sedi, una consegna urgente.';
}
export function erpLabel(s) {
  return ({'isolated-hit':'compromesso e isolato',isolated:'isolato',affected:'compromesso',restored:'ripristinato',online:'operativo'})[status(s,'erp')];
}
// Every outcome is resolved from the team's own state. Identical decisions produce identical outcomes.
export function resolve(previous,i,ids) {
  const s=structuredClone(previous), notes=[];
  const infect=id=>{if(!s.cut.includes(id)){add(s.active,id);add(s.hit,id);}};
  const isolate=id=>add(s.cut,id);
  const release=id=>{s.active=s.active.filter(x=>x!==id);s.cut=s.cut.filter(x=>x!==id);};
  for(const id of ids){ add(s.flags,id); if(evidence[id]) add(s.proof,evidence[id]); }
  if(i===0){
    if(has(s,'isolate')) isolate('ferri'); else {infect('share');infect('conti');}
    notes.push(has(s,'isolate')?'Il PC di Marco è isolato. La condivisione supera il primo controllo.':'La condivisione e la seconda postazione acquisti risultano compromesse.');
  }
  if(i===1){
    if(has(s,'segment')) isolate('share');
    if(has(s,'nasguard')) isolate('nas');
    if(!has(s,'isolate')&&!has(s,'segment')) {infect('nas');infect('admin');}
    notes.push(has(s,'segment')?'La condivisione è fuori rete. Acquisti gestisce le richieste fuori dal file server.':'Il file server resta raggiungibile dai reparti.');
  }
  if(i===2){
    if(s.active.includes('share')&&!has(s,'segment')&&!has(s,'staff')) {infect('hr');infect('cfo');}
    notes.push(has(s,'staff')?(has(s,'call')?'Tutti i referenti confermano sul canale già attivo.':'I capi turno raccolgono le conferme telefoniche.'):'Una parte del personale continua a lavorare in attesa di istruzioni.');
  }
  if(i===3){
    if(has(s,'erpcut')) isolate('erp'); else if(s.active.includes('share')&&!has(s,'watch')&&!has(s,'segment')) infect('erp');
    notes.push('Alla chiusura della finestra il gestionale risulta '+erpLabel(s)+'.');
  }
  if(i===4){
    if(s.active.includes('share')&&!has(s,'segment')&&!has(s,'erpcut')) infect('erp');
    notes.push(has(s,'risk')?'La direzione dispone di una valutazione documentata su rischio e seguito privacy.':'La valutazione privacy resta tra le attività aperte.');
    if(has(s,'pay')) notes.push('La direzione ha versato 135.000 € simulati. A fine turno manca una chiave verificabile. Il ripristino resta aperto.');
    if(has(s,'ransom')) notes.push('Il rifiuto del pagamento è verbalizzato. Il recupero segue le copie aziendali.');
    if(has(s,'offline')) notes.push('La copia offline è disponibile per il collaudo.');
  }
  if(i===5){
    if(s.active.includes('erp')&&!has(s,'perimeter')) infect('prod');
    if(s.active.includes('admin')&&!has(s,'identity')&&!has(s,'perimeter')) {infect('sales');infect('dg');}
    notes.push(has(s,'flows')?'I flussi sono acquisiti. La destinazione è documentata, il contenuto trasferito resta da accertare.':'Il contenuto delle connessioni esterne resta da accertare.');
  }
  const offline=erpLabel(s)!=='operativo'&&erpLabel(s)!=='ripristinato';
  let minutes=offline?([0,0,0,50,65,140,120,60][i]):0;
  if(i===6){
    if(has(s,'restore')){
      if(has(s,'verify')||has(s,'test')){
        if(offline) minutes=has(s,'verify')?20:has(s,'offline')?35:50;
        release('erp');notes.push('SAP è disponibile dopo il controllo della copia e la riapertura per fasi.');
      }else notes.push('Rientro rinviato: manca il collaudo della copia. Lo stato di SAP resta invariato.');
    }
    if(has(s,'rebuild')) {for(const id of ['ferri','conti','admin','hr','cfo','sales','dg','prod']) release(id);notes.push('Le postazioni ricostruite tornano disponibili.');}
    if(!ids.length) notes.push('La finestra di ripristino si chiude senza attività assegnate.');
  }
  if(i===7){
    if(offline&&has(s,'plan')&&(has(s,'verify')||has(s,'test'))){minutes=35;release('erp');notes.push('Il piano finanziato consente la riattivazione con la copia già collaudata.');}
    notes.push(has(s,'follow')?(has(s,'risk')?'Il fascicolo contiene valutazione iniziale e riesame finale.':'Il riesame parte oggi: manca una valutazione registrata nella prima giornata.'):'La direzione riceve il fascicolo privacy nello stato raggiunto ieri.');
  }
  if(i===7&&has(s,'exercise')) notes.push('Reparti e magazzino registrano gli scostamenti della prova di continuità.');
  s.minutes+=minutes;
  const coverage=(has(s,'manual')?0.35:0)+(has(s,'forms')?0.05:0)+(has(s,'fallback')?0.1:0)+(has(s,'service')?0.05:0)+(has(s,'orders')?0.1:0)+(has(s,'exercise')?0.05:0);
  s.loss+=minutes*(1-coverage);
  if(minutes) notes.push('Fermo ERP nella finestra simulata: '+minutes+' minuti. Copertura alternativa: '+Math.round(coverage*100)+'%.');
  return {s,notes};
}

export function evidenceReview(s){
  const checks=[
    ['Origine e tempi',['mail','trace'],'Servono il messaggio originale e il riscontro degli orari.'],
    ['Perimetro tecnico',['logs','flows'],'Confrontare chi ha avuto accesso con i flussi osservati.'],
    ['Decisione privacy',['hrmap','risk','follow'],'Collegare perimetro HR, valutazione iniziale e riesame.'],
    ['Rientro dei servizi',[],'Collegare il verbale di collaudo con la riconciliazione degli ordini.']
  ];
  return checks.map(([label,ids,hint],i)=>{
    const parts=i===3?[has(s,'verify')||has(s,'test'),has(s,'orders')]:ids.map(id=>has(s,id));
    return {label,hint,level:parts.every(Boolean)?'Documentato':parts.some(Boolean)?'Parziale':'Da ricostruire'};
  });
}
