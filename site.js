(function(){
  // Prompts: Filter + Kopieren
  var chips=document.querySelectorAll('.chip');
  chips.forEach(function(c){c.addEventListener('click',function(){
    chips.forEach(function(x){x.setAttribute('aria-pressed','false')});c.setAttribute('aria-pressed','true');
    var k=c.getAttribute('data-k');
    document.querySelectorAll('.pc').forEach(function(p){p.hidden=!(k==='alle'||p.getAttribute('data-k')===k)});
  })});
  document.querySelectorAll('.copy').forEach(function(b){b.addEventListener('click',function(){
    var box=b.closest('.pc,.qrow,.ai');var e=box.querySelector('.pr,.qt');var t=e.textContent;
    var done=function(){var o=b.textContent;b.textContent='Kopiert ✓';setTimeout(function(){b.textContent=o},1600)};
    if(navigator.clipboard&&navigator.clipboard.writeText){navigator.clipboard.writeText(t).then(done,function(){})}
    else{var a=document.createElement('textarea');a.value=t;document.body.appendChild(a);a.select();try{document.execCommand('copy');done()}catch(e){}document.body.removeChild(a)}
  })});
  // Übungen: Timer
  document.querySelectorAll('.timer').forEach(function(t){
    var out=t.querySelector('output'),go=t.querySelector('.go'),rs=t.querySelector('.s');
    var total=parseInt(t.getAttribute('data-min'),10)*60,left=total,h=null;
    function show(){var m=Math.floor(left/60),s=left%60;out.textContent=(m<10?'0':'')+m+':'+(s<10?'0':'')+s}
    show();
    go.addEventListener('click',function(){
      if(h){clearInterval(h);h=null;go.textContent='Weiter';return}
      go.textContent='Pause';
      h=setInterval(function(){left--;show();if(left<=0){clearInterval(h);h=null;go.textContent='Neu starten';left=total;out.textContent='00:00'}},1000)});
    rs.addEventListener('click',function(){if(h){clearInterval(h);h=null}left=total;show();go.textContent='Start'});
  });
})();
(function(){
  var tabs=document.querySelectorAll('.avt'),ps=document.querySelectorAll('.avp');
  if(!tabs.length)return;
  function show(i){tabs.forEach(function(t){t.setAttribute('aria-pressed',t.getAttribute('data-i')==i?'true':'false')});ps.forEach(function(p){p.hidden=p.getAttribute('data-i')!=i})}
  tabs.forEach(function(t){t.addEventListener('click',function(){show(t.getAttribute('data-i'))})});show(0);
})();
(function(){
  var ph=document.querySelectorAll('.kph'),pn=document.querySelectorAll('.kp'),rl=document.querySelectorAll('.krl');
  if(!ph.length)return;var role='Keine Rolle';
  function pshow(i){ph.forEach(function(b){b.setAttribute('aria-pressed',b.getAttribute('data-i')==i?'true':'false')});pn.forEach(function(p){p.hidden=p.getAttribute('data-i')!=i})}
  function rset(r){role=r;rl.forEach(function(b){b.setAttribute('aria-pressed',b.getAttribute('data-r')==r?'true':'false')});
    document.querySelectorAll('.rl').forEach(function(s){s.textContent=r==='Keine Rolle'?'':'Meine Rolle in dieser Runde: '+r+'\n\n'})}
  ph.forEach(function(b){b.addEventListener('click',function(){pshow(b.getAttribute('data-i'))})});
  rl.forEach(function(b){b.addEventListener('click',function(){rset(b.getAttribute('data-r'))})});
})();
