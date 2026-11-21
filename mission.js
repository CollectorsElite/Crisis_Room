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
    actions:[a('test','Collaudare il recupero','Provate la copia disponibile in un ambiente separato.'),a('restore','Avviare il rientro assistito','IT collauda la copia e riapre SAP per fasi. Una prova precedente riduce il fermo.'),a('rebuild','Bonificare le postazioni','Ricostruite i terminali compromessi da immagini aziendali affidabili.'),a('orders','Riconciliare gli ordini','Magazzino e amministrazione ricostruiscono le operazioni arretrate.')]
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
      if(!has(s,'verify')&&!has(s,'test')){add(s.flags,'test');add(s.proof,evidence.test);}
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

// A scene belongs to the individual company. The classroom shares only its time window.
const cast={
 M:['Marco Ferri','Acquisti'], S:['Sara Conti','Acquisti'], L:['Luca Rossi','IT'],
 G:['Giulia Neri','Risorse umane'], A:['Antonio Merli','Finanza'], D:['Ing. Bianchi','Direzione'],
 P:['Elena Sala','Magazzino'], F:['Paolo Riva','Fornitore']
};
const scenes={
 alarm:['Il preventivo illeggibile','Cosa rispondete a Marco?','isolate mail call forms',[
 'M|Sara, riesci ad aprire il preventivo Vetrilux? A me da stamattina dà errore.',
 'S|Il mio ordine di ieri si apre. Che nome ha il tuo file?',
 'M|È cambiata la fine del nome. E sul desktop è comparso un foglio in inglese.',
 'L|Marco, sono al telefono con te. Leggimi solo la prima riga.',
 'M|“Your files have been encrypted.” Più sotto chiedono 2,5 bitcoin. Il PC è ancora collegato.']],
 clean:['La copia di Sara','Il file server risponde. Come usate il tempo guadagnato?','logs fallback nasguard',[
 'M|Ho staccato il cavo come mi avete detto. Adesso vi scrivo dal telefono.',
 'S|Luca, il mio preventivo nella cartella comune si apre ancora.',
 'L|Confermo dal monitoraggio. Quella condivisione risponde normalmente.',
 'P|Se devo preparare gli ordini fuori sistema, mi serve la lista mentre è ancora leggibile.',
 'S|Ho anche l’orario dell’ultimo accesso di Marco. Chi lo prende in carico?']],
 spread:['La seconda postazione','Due postazioni e il file server sono coinvolti. Cosa mettete al riparo?','segment nasguard logs',[
 'S|Marco, anche la mia cartella adesso è piena di file .locked.',
 'M|Pure la tua? Pensavo riguardasse solo il mio portatile.',
 'L|Vedo le modifiche sul file server e sul PC di Sara. È la stessa condivisione.',
 'P|Le liste di carico passano da lì. Ho due autisti che aspettano.',
 'L|Il NAS è ancora collegato. Mi serve una priorità prima di separare i sistemi.']],
 payroll:['Il fascicolo paghe','Come rispondete a HR con la condivisione ancora esposta?','staff hrmap trace',[
 'G|Sara mi ha appena girato la schermata. Sullo stesso server abbiamo le paghe.',
 'L|La condivisione coinvolta è ancora raggiungibile dagli uffici.',
 'G|Devo dire qualcosa ai dipendenti? Ho già tre chiamate.',
 'A|Prima di rispondere vorrei sapere quali cartelle potrebbero riguardarli.',
 'G|Posso ricostruire il perimetro oppure chiamare subito i capi turno. Da dove partiamo?']],
 dock:['Il camion al cancello','Come gestite la consegna mentre IT verifica gli accessi?','service fallback trace',[
 'P|L’autista è qui per il bancale 18. Vuole la distinta firmata.',
 'S|Ho il numero d’ordine sulla conferma del cliente.',
 'A|Se parte due volte lo stesso bancale, il reclamo sarà nostro.',
 'P|Mi basta un referente che autorizzi la procedura alternativa.',
 'S|Posso chiamare il cliente o aiutare a ricostruire il registro. Cosa gli dico?']],
 danger:['Un collegamento verso SAP','La condivisione esposta ora comunica con il segmento ERP. Come intervenite?','erpcut watch manual',[
 'L|Ho appena visto un collegamento dal segmento compromesso verso SAP.',
 'A|Il gestionale per ora risponde. Ho aperto io stesso un ordine.',
 'P|Senza SAP si ferma la stampa delle etichette.',
 'A|Un’ora di fermo pieno vale ottomila euro.',
 'L|Posso separare SAP subito. Chi autorizza la priorità?']],
 reserve:['La prova del backup','SAP è raggiungibile. Quale preparazione autorizzate?','verify manual erpcut',[
 'L|Abbiamo una finestra di lavoro sul gestionale. SAP risponde.',
 'P|Prima di sospenderlo posso organizzare un banco manuale per i camion.',
 'L|In cassaforte c’è una copia offline. Sull’etichetta leggo una data di dodici giorni fa.',
 'A|Dodici giorni di ordini da ricostruire? Voglio sapere se quella copia si apre.',
 'P|Se mandate qui il tecnico per la continuità, il collaudo dovrà aspettare.']],
 ransom:['Il costo del silenzio','SAP è indisponibile. Qual è la vostra risposta alla richiesta di riscatto?','ransom offline pay risk',[
 'A|Mi chiedono quanto ci costa tenere il gestionale fermo fino a domani.',
 'D|La richiesta di pagamento ha una scadenza. Qualcuno ha verificato la copia?',
 'L|Una promessa di chiave non ci dà un tempo di rientro verificabile.',
 'G|Nel frattempo devo far valutare anche l’impatto sulle persone.',
 'D|Voglio una decisione da verbalizzare adesso.']],
 client:['La telefonata del cliente','SAP è disponibile. Cosa fate mentre la direzione riceve la richiesta dei criminali?','risk liaison ransom offline',[
 'S|Il cliente principale ha sentito parlare del blocco. Chiede se può ancora ordinare.',
 'P|Abbiamo verificato il gestionale: in questo momento accetta ordini.',
 'D|Ho davanti anche la richiesta dei criminali. Non promettiamo tempi al telefono.',
 'G|Vorrei capire chi raccoglie i fatti su dipendenti e fornitori.',
 'A|Possiamo incaricare un referente esterno oppure fissare prima la posizione aziendale.']],
 vault:['La ricevuta senza chiave','Il pagamento simulato è partito. Come recuperate margine operativo?','offline perimeter flows',[
 'A|Contabilità ha registrato il pagamento. Nessuna chiave verificabile.',
 'D|Quanto tempo è passato dall’ultima risposta?',
 'L|Il contatto tace. Posso lavorare sulla copia offline in parallelo alle verifiche.',
 'P|Ho bisogno di una previsione per il turno pomeridiano.',
 'D|Scegliamo una via di recupero che dipenda da noi.']],
 leak:['Una traccia in uscita','Il perimetro HR è esposto. Quale verifica avviate?','flows image perimeter',[
 'G|Mi chiedono se qualcuno ha copiato gli IBAN.',
 'L|Abbiamo una connessione in uscita. Il volume da solo non identifica il contenuto.',
 'G|Allora teniamo distinti i file inaccessibili da quelli eventualmente trasferiti.',
 'D|È questa distinzione che voglio nel prossimo aggiornamento.',
 'L|Posso acquisire i flussi prima che i registri ruotino.']],
 access:['Una sessione da verificare','Che cosa verificate sul profilo di Marco?','identity image flows',[
 'L|C’è una sessione associata al profilo di Marco. Mi serve un riscontro.',
 'M|Da stamattina per parlare con voi uso il telefono.',
 'S|Ho tenuto da parte gli orari delle chiamate.',
 'L|Possiamo ricostruire la sequenza o revocare subito le sessioni esposte.',
 'D|Segnate anche quello che resta da accertare.']],
 restore:['La finestra di rientro','SAP è fermo. Quale percorso di recupero autorizzate?','restore test rebuild',[
 'P|La linea aspetta la riapertura di SAP per chiudere il lotto.',
 'A|Mi servono tempi realistici prima di avvertire il cliente.',
 'L|Devo controllare le condizioni di rientro. Posso riaprire solo dopo un collaudo.',
 'P|Posso mettere a disposizione un ordine campione.',
 'D|Cosa facciamo durante questa finestra?']],
 backlog:['Il bancale duplicato','SAP è disponibile, ma due distinte riportano lo stesso numero. Cosa verificate?','orders test rebuild',[
 'P|Ho due distinte con lo stesso ordine. Il bancale fisico è uno solo.',
 'S|Una distinta arriva dagli appunti del turno mattutino.',
 'A|SAP risponde, ma prima di fatturare dobbiamo capire quale registrazione vale.',
 'L|Il magazzino può verificare il movimento mentre noi lavoriamo sulle postazioni.',
 'P|Quale intervento ha la precedenza?']],
 restart:['La riunione sul fermo','Il gestionale è ancora indisponibile. Quale impegno prendete davanti al consiglio?','plan exercise follow',[
 'D|Il consiglio è arrivato. La prima domanda è quando ripartiamo.',
 'A|Ho portato il conto del fermo maturato finora.',
 'P|Serve un responsabile per la prossima finestra di rientro.',
 'G|Anche le attività sui dati dei dipendenti devono avere un seguito.',
 'D|Cosa mi impegnate a consegnare oggi?']],
 review:['La ricostruzione finale','SAP è disponibile. Quale evidenza portate al consiglio?','timeline follow exercise',[
 'D|SAP risponde. Domani il cliente ci chiederà come abbiamo gestito la crisi.',
 'S|Ho conservato ordini e telefonate. Possiamo mettere gli eventi in sequenza.',
 'G|Io porto il fascicolo del personale con le questioni ancora aperte.',
 'P|Vorrei verificare che la prossima squadra sappia usare la procedura manuale.',
 'D|Decidiamo cosa presentare al consiglio prima che entri.']]
};
const choices=Object.fromEntries(rounds.flatMap(r=>r.actions.map(a=>[a.id,a])));
export function episode(i,s){
 const erpDown=s.active.includes('erp')||s.cut.includes('erp');
 const spread=s.active.includes('share')&&!s.cut.includes('share');
 const key=['alarm',s.hit.includes('share')?'spread':'clean',spread?'payroll':'dock',spread?'danger':'reserve',erpDown?'ransom':'client',has(s,'pay')?'vault':s.hit.includes('hr')||has(s,'hrmap')?'leak':'access',erpDown?'restore':'backlog',erpDown?'restart':'review'][i];
 const [title,prompt,ids,lines]=scenes[key];
 const messages=lines.map(line=>{const [who,text]=line.split('|');return {who:cast[who][0],role:cast[who][1],text};});
 if(i===6&&erpDown)messages[2].text=has(s,'verify')?'La copia ha già superato il collaudo. Se date il via, possiamo riaprire per fasi.':'La copia deve ancora superare il collaudo. Per riaprire in questa finestra serve un rientro assistito.';
 return {key,title,prompt,messages,actions:ids.split(' ').map(id=>choices[id])};
}
const confirmations={
 isolate:'Marco qui. Il cavo è staccato. Resto al telefono con Luca.',mail:'Ho salvato l’email originale con i dati di consegna. La passo a IT.',call:'I responsabili sono sul canale alternativo. Ho annotato chi manca.',forms:'Ho trovato i moduli cartacei. Li porto al banco spedizioni.',
 logs:'Ho messo da parte il registro accessi con gli orari originali.',fallback:'Il registro ordini è aperto in magazzino. Cominciamo dalle urgenze.',nasguard:'Il NAS è separato. Per verificare le copie dovremo raggiungerlo da una postazione dedicata.',segment:'Ho separato il file server. Avvisate gli acquisti: la cartella ora è fuori rete.',
 staff:'I capi turno stanno raccogliendo le conferme. In linea avvisiamo a voce.',hrmap:'HR ha circoscritto i fascicoli da verificare. Porto il prospetto al DPO.',trace:'Ho confrontato le chiamate con il giornale del turno e segnato le discrepanze.',service:'Il cliente accetta una seconda finestra. Sara ha preso nota dell’orario.',
 erpcut:'SAP è isolato. Ho avvisato il magazzino che le etichette dovranno aspettare.',manual:'Il banco manuale è aperto. Possiamo far partire almeno gli ordini urgenti.',verify:'La prova sulla copia offline è riuscita. Conservo il verbale.',watch:'Presidio attivo per questa finestra. Al cambio turno dovremo rivalutare il collegamento.',
 risk:'Il DPO e il titolare stanno registrando circostanze, rischi e decisioni.',ransom:'La direzione ha verbalizzato il rifiuto. Luca lavora alle alternative.',pay:'Contabilità ha registrato il pagamento simulato. Ancora nessuna chiave verificabile.',offline:'Il supporto offline è sul banco di prova.',liaison:'Ho aperto i contatti esterni e assegnato un referente per gli aggiornamenti.',
 flows:'Ho acquisito gli intervalli e le destinazioni dei flussi. Il contenuto resta da verificare.',image:'La copia forense della postazione è presa in carico.',identity:'Sessioni esposte revocate. Marco dovrà autenticarsi di nuovo.',perimeter:'I collegamenti residui sono stati limitati. Verifichiamo la produzione.',
 test:'Collaudo concluso. Il verbale è nel fascicolo di rientro.',restore:'Sto eseguendo il rientro per fasi. Vi aggiorno con l’esito del controllo.',rebuild:'Abbiamo ricostruito le postazioni coinvolte usando immagini aziendali.',orders:'Magazzino e amministrazione hanno riconciliato gli ordini arretrati.',
 timeline:'Cronologia firmata. Le ipotesi ancora aperte sono indicate a parte.',plan:'Il consiglio ha approvato responsabili e priorità di rientro.',follow:'Il fascicolo privacy è aggiornato con gli elementi raccolti.',exercise:'Abbiamo svolto la prova di continuità con i capi turno.'
};
export function acknowledgment(ids){return ids.map(id=>confirmations[id]).filter(Boolean).join(' ');}
