(function(){
  var f=document.getElementById('pp-form'),out=document.getElementById('pp-msg');
  function val(n){var e=f.elements[n];return e?(e.value||'').trim():''}
  function build(){
    var L=[];var t=val('titel')||'Ohne Titel';L.push('EIN-SEITEN-PAPIER: '+t);if(val('datum'))L.push('Datum: '+val('datum'));L.push('');
    L.push('1. Entscheidung / Idee');L.push(val('entscheidung')||'-');L.push('');
    var r=f.querySelector('input[name=einordnung]:checked');L.push('2. Einordnung: '+(r?r.value:'-'));if(val('einordnung_warum'))L.push(val('einordnung_warum'));L.push('');
    L.push('3. Annahmen');L.push(val('annahmen')||'-');L.push('');
    L.push('4. Risiken aus den vier Perspektiven');[['sophie','Sophie (Personalberatung, Markt)'],['markus','Markus (Personalberatung, Umsetzung)'],['lea','Lea (Mitarbeitende, Fairness)'],['tim','Tim (Mitarbeitende, Alltag)']].forEach(function(p){L.push('- '+p[1]+': '+(val('risiko_'+p[0])||'-'))});L.push('');
    L.push('5. Drei kleine Proben');for(var i=1;i<=3;i++){L.push('Probe '+i+': '+(val('probe'+i)||'-'));L.push('  Verstärken, wenn: '+(val('plus'+i)||'-'));L.push('  Stoppen, wenn: '+(val('minus'+i)||'-'))}L.push('');
    L.push('6. Prüftermin: '+(val('pruef')||'-'));L.push('');L.push('Hinweis: KI-Figuren sind fiktive Perspektiven. Annahmen mit echten Menschen prüfen.');
    return L.join('\n')}
  function say(t){out.textContent=t}
  document.getElementById('pp-copy').addEventListener('click',function(){var t=build();if(navigator.clipboard&&window.isSecureContext){navigator.clipboard.writeText(t).then(function(){say('Als Text kopiert.')},function(){say('Kopieren nicht möglich. Markiere den Text im Fenster „Vorschau“.')})}else{var a=document.createElement('textarea');a.value=t;document.body.appendChild(a);a.select();try{document.execCommand('copy');say('Als Text kopiert.')}catch(e){say('Kopieren nicht möglich.')}document.body.removeChild(a)}});
  document.getElementById('pp-print').addEventListener('click',function(){window.print()});
  document.getElementById('pp-clear').addEventListener('click',function(){if(confirm('Alle Eingaben löschen?')){f.reset();say('Eingaben gelöscht.')}});
})();
