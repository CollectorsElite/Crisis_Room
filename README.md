# ESCALATION Crisis Room

**Missione 01 · Paziente Zero · Versione 1.1**

Martedì, ore 09:14. Marco Ferri segnala che i preventivi di Meridian Components sono illeggibili. Da un dispositivo per squadra, i partecipanti dirigono la risposta dell’azienda lungo otto turni. La regia sincronizza l’aula e può confrontare le conseguenze di due strategie nello stesso momento della crisi.

## 1. Pubblicazione su Railway

1. Estrai lo ZIP. Carica i file estratti in un repository GitHub con `Dockerfile`, `railway.json`, `server.js` e `package.json` nella radice del servizio. Se usi una sottocartella nel repository, selezionala come Root Directory.
2. Crea un progetto Railway, aggiungi il servizio dal repository e imposta **TEACHER_PASSWORD** nelle Variables. Scegli una password privata di almeno 12 caratteri. In produzione, la sua assenza interrompe l’avvio con un messaggio nei log.
3. Collega un **volume a /app/data**. Mantieni **una replica** del servizio. Il processo registra lì la sessione, le squadre, gli incarichi consegnati, i turni risolti e le impostazioni del confronto. Il volume consente di riprendere la stessa lezione dopo un nuovo deploy.
4. Applica le modifiche, avvia il deploy e in Networking genera un dominio pubblico HTTPS. Railway costruisce il Dockerfile e assegna la porta attraverso `PORT`. Il percorso di healthcheck configurato è `/health`.
5. Apri **il dominio del gioco**, scegli **Docente**, inserisci la password e seleziona **Apri proiettore**. Mostra il codice a sei cifre. Le squadre aprono lo stesso indirizzo, scelgono **Squadra** e inseriscono codice aula e nome. Sul dispositivo di proiezione si sceglie **Proiettore**.

Il servizio usa Node.js 24 e un file di stato con sostituzione atomica. Tutti gli elementi grafici e i font sono nel pacchetto. Il gioco funziona senza database esterni, chiavi API o servizi di intelligenza artificiale.

| Impostazione | Valore |
|---|---|
| Processo | Un servizio, una replica |
| Avvio container | Gestito da Dockerfile e start-container.sh |
| Porta | Variabile Railway PORT |
| Persistenza | Volume /app/data |
| Verifica | GET /health restituisce HTTP 200 e stato ok |
| Segreto docente | TEACHER_PASSWORD, almeno 12 caratteri |

**Verifica dopo il deploy.** Apri il proiettore su un secondo browser o dispositivo e inserisci il codice. Registra una squadra di prova, avvia un turno, invia due incarichi e chiudilo. Dopo un riavvio controlla che regia e squadra ritrovino lo stesso turno. Per predisporre l’aula reale apri *Gestione sessione → Nuova aula* e conferma con il codice della sessione di prova.

Documentazione della piattaforma: [deploy](https://docs.railway.com/deployments), [volumi](https://docs.railway.com/volumes), [healthcheck](https://docs.railway.com/deployments/healthchecks).

## 2. Prova locale

Con Node.js 24 installato, apri un terminale nella cartella estratta ed esegui:

```sh
node server.js
```

Apri **http://localhost:3000** e seleziona **Docente**. Per questa modalità il terminale mostra una password casuale valida per l’avvio corrente. Per impostarne una stabile copia `.env.example` in `.env`, completa TEACHER_PASSWORD e usa `node --env-file=.env server.js`. I salvataggi locali si trovano in `data/session.json`. Per giocare da più dispositivi sulla stessa rete usa l’indirizzo LAN del computer che ospita la regia con la porta scelta. Se provi più squadre su un solo PC usa profili browser separati; le schede dello stesso profilo condividono l’identità della squadra.

## 3. Conduzione della lezione

Tutte le postazioni entrano dalla stessa pagina. In caso di sessione già attiva compare **Riprendi** per il ruolo selezionato. Il comando **Cambia postazione** riapre l’ingresso. Gli indirizzi diretti della versione 1.0 continuano a funzionare e, quando occorre autenticarsi, riportano all’ingresso con il ruolo preselezionato.

Prevedi 3–4 minuti di briefing, circa 20 minuti di decisioni e 7–15 minuti per gli esiti e la discussione. Il timer indica 2 minuti e 30 secondi consigliati per turno. Allo zero la regia conserva il controllo della chiusura. La simulazione fa avanzare il tempo aziendale solo alla risoluzione dei turni.

| Vista | Operazioni |
|---|---|
| Regia · /regia | Avvia, mette in pausa, invia una notizia, controlla le consegne, chiude il turno e decide quali squadre e quale turno proiettare. Scarica il verbale in formato TXT. |
| Squadra · /squadra | Legge il dialogo, consulta la propria mappa, sceglie due incarichi diversi e ne motiva la priorità. Rivede effetti, fascicolo e diario. |
| Proiettore · /schermo | In ingresso espone indirizzo e codice aula. Durante la crisi mostra dialoghi e conteggio delle consegne. A turno chiuso confronta decisioni, motivazioni ed effetti. |

Consiglia gruppi di 3–5 persone. Una persona coordina, una rappresenta l’IT e una difende le esigenze operative. Con gruppi più grandi assegna anche privacy e direzione finanziaria. Occorre un solo dispositivo per gruppo. Il limite configurato è di 80 squadre nella stessa aula.

Ogni consegna è definitiva per quel turno. Il docente può congelare le consegne con **Pausa**, inserire una notizia anche a discussione sospesa e riprendere. Se chiude con consegne mancanti, il gioco chiede conferma e registra *nessuna azione* per quelle squadre. Un aggiornamento della pagina conserva una bozza sulla stessa scheda. Sul medesimo browser la squadra ritrova la sessione tramite cookie. Su un dispositivo diverso deve usare codice aula, nome squadra e codice recupero visibile soltanto in regia. Il rientro invalida il precedente accesso della squadra.

Al debriefing scegli due squadre e un turno nella regia, quindi **Proietta confronto**. Il verbale raccoglie le motivazioni testuali, gli incarichi, le conseguenze, le notizie inviate dal docente e i bilanci cumulati. Prima di aprire una nuova aula esporta il verbale da conservare. La nuova aula sostituisce la precedente.

## 4. Traccia del facilitatore

| Turno | Snodo | Domanda per la discussione |
|---|---|---|
| 1 · Il primo messaggio | Isolare il PC, conservare l’email, coordinare i reparti o predisporre la continuità | Quale evidenza avreste perso rimandando l’acquisizione? |
| 2 · La cartella condivisa | Separare file server o NAS, acquisire registri, salvare gli ordini | Come cambia la scelta se il PC di Marco è già isolato? |
| 3 · Voci dai reparti | Informare i turnisti, ricostruire il perimetro HR, gestire clienti e tempi | Come verificare che una comunicazione abbia raggiunto chi lavora in linea? |
| 4 · Il bivio del gestionale | Isolare SAP, presidiare la finestra, verificare la copia o attivare spedizioni manuali | Quale costo potete accettare con una consegna urgente? |
| 5 · Una scadenza sul desktop | Valutazione privacy, decisione sul riscatto, contatti esterni o copia offline | Quali attività possono procedere in parallelo e chi ha titolo per decidere? |
| 6 · Tracce al confine | Conservare flussi ed evidenze, limitare l’esposizione, revocare sessioni | Quale fatto sostiene l’ipotesi di una perdita di riservatezza? |
| 7 · Rientro in produzione | Collaudare e riattivare SAP, bonificare terminali, riconciliare ordini | Quali dati vanno ricostruiti dopo il rientro? |
| 8 · Davanti alla direzione | Consegnare cronologia, piano, riesame privacy o prova di continuità | Da quale turno ha origine la differenza tra le due strategie? |

**Come leggere il bilancio.** *Sistemi coinvolti* conta ogni sistema compromesso almeno una volta. Rimane nel totale storico anche dopo il recupero. La mappa distingue lo stato corrente da quello storico. Il fermo ERP misura i minuti simulati di indisponibilità nelle finestre del caso. Il costo è la somma, per ogni finestra, di minuti di fermo × 8.000 €/60 × quota di attività scoperta. Le misure manuali e organizzative riducono quest’ultima; il dettaglio percentuale compare nel diario. Il pagamento simulato di 135.000 €, quando deliberato, è una voce distinta nel verbale del turno 5. Il costo del fermo esclude il riscatto. Importi, tempi, carichi recuperabili e conseguenze sono parametri della missione.

**Qualità della ricostruzione.** Al termine, quattro voci distinguono ciò che è documentato, parziale o da ricostruire: origine e tempi, perimetro tecnico, decisione privacy e rientro dei servizi. Il docente valuta anche le motivazioni libere e le informazioni disponibili al momento della scelta. Il gioco non attribuisce un giudizio automatico al testo scritto dai partecipanti.

**Discussione privacy.** Chiedi alla squadra quando il titolare ha acquisito consapevolezza della violazione dei dati personali, quali conseguenze sono plausibili per i dipendenti e chi deve documentare il seguito. L’art. 33 GDPR disciplina la notifica all’autorità senza ingiustificato ritardo e, ove possibile, entro 72 ore dalla conoscenza, salvo che sia improbabile un rischio per i diritti e le libertà delle persone. L’art. 34 tratta la comunicazione agli interessati in presenza di rischio elevato e prevede specifiche eccezioni. Distingui la perdita di disponibilità dall’accertamento di un’esfiltrazione. Nella missione il DPO supporta la valutazione e il titolare assume la decisione. [Garante per la protezione dei dati personali](https://www.garanteprivacy.it/misure-di-sicurezza) · [Regolamento (UE) 2016/679, artt. 33–34](https://eur-lex.europa.eu/eli/reg/2016/679/oj).

## 5. Manutenzione e prove

`mission.js` contiene dialoghi, incarichi, regole di propagazione e criteri del fascicolo. `server.js` gestisce autorizzazioni, ciclo di gioco, salvataggi e distribuzione dei contenuti. `public/` contiene le tre interfacce e gli asset originali della suite. La licenza del font Archivo accompagna l’asset.

Per ripetere i test del motore e del server esegui `npm test` con Node.js 24. La suite crea una sessione su una porta libera e in una cartella temporanea. Le prove coprono otto turni con due strategie, invii concorrenti e duplicati, chiusura senza una consegna, pausa, recupero da un nuovo dispositivo, riavvio con una consegna pendente, confronto storico, cambio aula e separazione delle viste.

La password della regia è una variabile del servizio. Il codice aula viene mostrato agli studenti. Per partecipare i gruppi possono usare uno pseudonimo. La cartella dei dati resta esterna ai file pubblici; solo la regia esporta l’intero verbale.


La prova grafica opzionale è in `tests/browser_e2e.py`. Richiede Python, Playwright e Chromium. Installa Playwright in un ambiente di test, esegui `python -m playwright install chromium` e poi `python tests/browser_e2e.py`. Se usi Chromium di sistema, imposta `CHROMIUM_PATH` al suo eseguibile. Sono verificati quattro contesti browser, inclusa una postazione da 390 px, il recupero della bozza, la proiezione di un turno passato e il download del verbale.
