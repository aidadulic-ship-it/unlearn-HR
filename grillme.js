(function(){
  var cfg=window.GRILLME||{};var ENDPOINT=(cfg.endpoint||'').trim();var DEMO=!ENDPOINT;
  var ROUND_URL=ENDPOINT.replace(/\/api\/grillme\/?$/,'/api/round');
  var PII=[/[\w.+-]+@[\w-]+\.[\w.-]+/,/(?:\+|\b00)\d[\d\s/().-]{7,}\d/,/\b[A-Z]{2}\d{2}(?:\s?[A-Z0-9]{4}){3,}\b/,/\b\d{4}\s?\d{6}\b/];
  var MAX=1200;
  var ERR={pii_detected:'Der Text enthält etwas, das nach personenbezogenen Daten aussieht (E-Mail, Telefon, IBAN, Versicherungsnummer). Bitte entfernen.',rate_limited:'Zu viele Anfragen. Bitte kurz warten.',upstream_busy:'Der KI-Dienst ist gerade ausgelastet.',timeout:'Zeitüberschreitung. Die anderen Antworten bleiben erhalten.',not_configured:'Der Server ist noch nicht eingerichtet.',origin_not_allowed:'Diese Seite ist für den Server nicht freigegeben.',network:'Keine Verbindung zum Server.',invalid_answer:'Die Antwort hatte kein gültiges Format.',empty_answer:'Es kam keine Antwort an.'};
  var LABELS=[['strength','Stärke'],['core_critique','Wichtigster Einwand'],['blind_spot','Blinder Fleck'],['challenge_question','Challenge-Frage'],['next_step','Nächster Schritt']];
  var form=document.getElementById('gm-form'),input=document.getElementById('gm-input'),btn=document.getElementById('gm-send'),msg=document.getElementById('gm-msg'),all=document.getElementById('gm-all');
  var stmt=document.getElementById('gm-stmt'),demoNote=document.getElementById('gm-demo'),roundEl=document.getElementById('gm-round');if(demoNote)demoNote.hidden=!DEMO;
  var cards={};var last='';var starting=false;
  document.querySelectorAll('.gcard').forEach(function(el){var id=el.dataset.id;var c={el:el,body:el.querySelector('.gbody'),stat:el.querySelector('.gstat'),retry:el.querySelector('.gretry'),fu:el.querySelector('.gfu'),fuin:el.querySelector('.gfu input'),fubtn:el.querySelector('.gfu button[type=submit]'),idle:el.querySelector('.gidle'),statement:'',feedback:null,chat:[],busy:false,failed:null,retried:0};cards[id]=c;
    c.retry.addEventListener('click',function(){if(c.failed&&!c.busy)run(id,c.failed)});
    c.fu.addEventListener('submit',function(e){e.preventDefault();var t=c.fuin.value.trim();if(!t||c.busy||!c.feedback)return;var chk=check(t);if(chk){setState(id,'error',chk);return}c.fuin.value='';run(id,{kind:'chat',text:t})})});
  function say(t,bad){msg.textContent=t;msg.className='gmsg'+(bad?' bad':'')}
  function check(t){if(t.length>MAX)return'Der Text ist zu lang (höchstens '+MAX+' Zeichen).';for(var i=0;i<PII.length;i++)if(PII[i].test(t))return ERR.pii_detected;return''}
  function anyBusy(){return starting||Object.keys(cards).some(function(k){return cards[k].busy})}
  function sync(){var b=anyBusy();var mb=document.getElementById('gm-mic');if(mb)mb.disabled=b;all.disabled=b||!last;btn.disabled=b;Object.keys(cards).forEach(function(k){var c=cards[k];c.fubtn.disabled=c.busy||!c.feedback;c.retry.disabled=c.busy})}
  function setState(id,state,text){var c=cards[id];c.el.dataset.state=state;c.stat.textContent=text||'';c.retry.hidden=state!=='error'}
  function el(tag,cls,text){var e=document.createElement(tag);if(cls)e.className=cls;if(text!==undefined)e.textContent=text;return e}
  function renderFeedback(id,fb){var c=cards[id];c.body.textContent='';var dl=el('dl','gfb');LABELS.forEach(function(l){if(!fb[l[0]])return;var row=el('div',l[0]==='challenge_question'?'gq':'');row.appendChild(el('dt','',l[1]));row.appendChild(el('dd','',fb[l[0]]));dl.appendChild(row)});
    if(fb.missing_context&&fb.missing_context.length){var r=el('div','');r.appendChild(el('dt','','Fehlender Kontext'));r.appendChild(el('dd','',fb.missing_context.join(' · ')));dl.appendChild(r)}
    c.body.appendChild(dl)}
  function appendChat(id,role,text){var c=cards[id];var p=el('p','gb '+(role==='user'?'gme':'gai'),text);c.body.appendChild(p);c.body.scrollTop=c.body.scrollHeight}
  function demoCall(id,job){return new Promise(function(res,rej){var t=700+Math.random()*1800;var D=cfg.demo||{};
    if(location.search.indexOf('demoerror='+id)>-1&&!cards[id].retried){cards[id].retried=1;setTimeout(function(){rej({code:'upstream_error'})},t);return}
    setTimeout(function(){if(job.kind==='grill'){var f=Object.assign({avatar_id:id},D[id]||{});res({feedback:f})}else res({text:'Beispielantwort auf deine Nachfrage („'+job.text.slice(0,70)+'“): '+((D[id]||{}).challenge_question||'')})},t)})}
  function post(path,body){return fetch(path,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(body)}).then(function(r){return r.json().catch(function(){return{}}).then(function(j){if(!r.ok)throw{code:j.error||'upstream_error',status:j.status};return j})},function(){throw{code:'network'}})}
  function call(id,job){if(DEMO)return demoCall(id,job);var c=cards[id];
    if(job.kind==='grill')return post(ENDPOINT,{avatar:id,mode:'grill',round_id:job.round,messages:[{role:'user',content:job.text}]}).then(function(j){if(!j.feedback)throw{code:'invalid_answer'};return{feedback:j.feedback}});
    var m=[{role:'user',content:c.statement},{role:'assistant',content:JSON.stringify(c.feedback)}].concat(c.chat,[{role:'user',content:job.text}]);
    return post(ENDPOINT,{avatar:id,mode:'chat',messages:m}).then(function(j){if(!j.text)throw{code:'invalid_answer'};return{text:j.text}})}
  function run(id,job){var c=cards[id];if(c.busy)return;c.busy=true;c.failed=null;setState(id,'loading',job.kind==='grill'?'Denkt nach …':'Antwortet …');
    if(job.kind==='chat')appendChat(id,'user',job.text);sync();
    call(id,job).then(function(r){if(job.kind==='grill'){c.feedback=r.feedback;c.chat=[];renderFeedback(id,r.feedback);setState(id,'done','')}else{c.chat=c.chat.concat([{role:'user',content:job.text},{role:'assistant',content:r.text}]);appendChat(id,'assistant',r.text);setState(id,'done','')}},
      function(e){c.failed=job;if(job.kind==='chat'){var u=c.body.querySelector('.gme:last-child');if(u)u.remove()}setState(id,'error',ERR[e&&e.code]||'Die Antwort ist fehlgeschlagen.')}).then(function(){c.busy=false;sync()})}
  function newRound(){if(DEMO)return Promise.resolve((window.crypto&&crypto.randomUUID)?crypto.randomUUID():'00000000-0000-4000-8000-'+String(Date.now()).padStart(12,'0'));return post(ROUND_URL,{}).then(function(j){return j.round_id})}
  function challenge(text){starting=true;sync();say('Runde wird gestartet …');
    newRound().then(function(round){last=text;starting=false;stmt.textContent='Deine Aussage: '+text;stmt.hidden=false;roundEl.textContent='Runde '+round.slice(0,8)+' · '+(DEMO?'Demo, keine KI':'vier getrennte Server-Anfragen, parallel');roundEl.hidden=false;
      Object.keys(cards).forEach(function(id){var c=cards[id];c.statement=text;c.feedback=null;c.chat=[];c.retried=0;c.failed=null;c.body.textContent='';setState(id,'idle','')});
      Object.keys(cards).forEach(function(id){run(id,{kind:'grill',text:text,round:round})});say('Challenge läuft: vier unabhängige Anfragen mit derselben Runden-ID.')},
      function(e){starting=false;sync();say(ERR[e&&e.code]||'Die Runde konnte nicht gestartet werden.',true)})}
  function parse(v){v=v.trim();var m=/^\/grillme(?:\s+([\s\S]+))?$/i.exec(v);if(!m)return{err:'Beginne mit /grillme, zum Beispiel: /grillme Wir ersetzen das Jahresgespräch durch monatliche Check-ins.'};if(m[1]&&m[1].trim())return{text:m[1].trim()};if(last)return{text:last};return{err:'Noch keine Aussage eingereicht. Schreibe /grillme gefolgt von deiner Idee.'}}
  form.addEventListener('submit',function(e){e.preventDefault();if(anyBusy())return;if(typeof stopMic==='function')stopMic();var p=parse(input.value);if(p.err){say(p.err,true);return}var chk=check(p.text);if(chk){say(chk,true);return}input.value='';challenge(p.text)});
  all.addEventListener('click',function(){if(anyBusy()||!last)return;challenge(last)});
  document.querySelectorAll('.gex').forEach(function(b){b.addEventListener('click',function(){input.value='/grillme '+b.dataset.t;input.focus()})});

  // ---- Spracheingabe (Browser-Spracherkennung, kein eigener Server)
  var SR=window.SpeechRecognition||window.webkitSpeechRecognition;var activeMic=null;
  var MICERR={'not-allowed':'Das Mikrofon ist nicht freigegeben. Erlaube es in der Adressleiste deines Browsers.','service-not-allowed':'Die Spracherkennung ist in diesem Browser nicht erlaubt.','no-speech':'Ich habe nichts gehört. Versuche es noch einmal.','audio-capture':'Kein Mikrofon gefunden.','network':'Die Spracherkennung braucht eine Internetverbindung.','language-not-supported':'Die Sprache wird nicht unterstützt.'};
  function stopMic(){if(activeMic)activeMic.stop()}
  function attachMic(btn,inputEl,opts){
    if(!SR){btn.hidden=true;return}
    var rec=null,base='',finals='';
    function say_(t,bad){opts.say(t,bad)}
    function setUi(on){btn.setAttribute('aria-pressed',on?'true':'false');btn.classList.toggle('on',on);btn.title=on?'Aufnahme beenden':'Sprechen';inputEl.classList.toggle('listening',on)}
    function compose(interim){var t=(finals+' '+interim).trim();if(opts.prefix&&t&&!/^\/grillme\b/i.test(t))t='/grillme '+t;inputEl.value=(base?base+' ':'')+t}
    btn.addEventListener('click',function(){
      if(rec){rec.stop();return}
      if(activeMic)activeMic.stop();
      rec=new SR();rec.lang='de-AT';rec.interimResults=true;rec.continuous=true;rec.maxAlternatives=1;
      base=opts.prefix?'':inputEl.value.trim();finals='';var failed=false;
      rec.onstart=function(){activeMic=rec;setUi(true);say_('Ich höre zu. Sprich deinen Text und tippe zum Beenden noch einmal auf das Mikrofon.')};
      rec.onresult=function(e){var interim='';for(var i=e.resultIndex;i<e.results.length;i++){var r=e.results[i];if(r.isFinal)finals+=(finals?' ':'')+r[0].transcript.trim();else interim+=r[0].transcript}compose(interim.trim())};
      rec.onerror=function(e){failed=true;say_(MICERR[e.error]||'Die Spracheingabe ist fehlgeschlagen.',true)};
      rec.onend=function(){setUi(false);if(activeMic===rec)activeMic=null;rec=null;inputEl.value=inputEl.value.trim();if(!failed&&inputEl.value)say_('Prüfe den erkannten Text, korrigiere ihn bei Bedarf und sende ihn dann ab. Er wird nicht automatisch gesendet.');inputEl.focus()};
      try{rec.start()}catch(err){rec=null;setUi(false);say_('Die Spracheingabe konnte nicht gestartet werden.',true)}
    });
  }
  attachMic(document.getElementById('gm-mic'),input,{prefix:true,say:say});
  Object.keys(cards).forEach(function(id){var c=cards[id];attachMic(c.fu.querySelector('.gmic'),c.fuin,{prefix:false,say:function(t,bad){c.stat.textContent=t;c.stat.className='gstat'+(bad?' bad':'')}})});
  if(!SR){var hint=document.getElementById('gm-nomic');if(hint)hint.hidden=false}
  sync();
})();
