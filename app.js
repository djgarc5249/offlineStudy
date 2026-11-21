"use strict";
/* Cert Drill engine. Packs register themselves into window.PACKS (see packs/*.js). */
var PACKS=window.PACKS||[];
var KEY="certdrill_v1";
var S={packs:{},cur:null,streak:0,lastDay:null,a2hs:0,sub:{n:0,c:0}};
var OFFLINE=false;

function load(){try{var r=localStorage.getItem(KEY);if(r)S=Object.assign(S,JSON.parse(r))}catch(e){}}
function save(){try{localStorage.setItem(KEY,JSON.stringify(S))}catch(e){}}
function hsh(s){var x=5381;for(var i=0;i<s.length;i++)x=((x<<5)+x+s.charCodeAt(i))>>>0;return x.toString(36)}
function dayKey(d){return d.getFullYear()+"-"+(d.getMonth()+1)+"-"+d.getDate()}
function touchDay(){
  var t=dayKey(new Date());if(S.lastDay===t)return;
  var y=new Date();y.setDate(y.getDate()-1);
  S.streak=(S.lastDay===dayKey(y))?(S.streak||0)+1:1;S.lastDay=t;save();
}
function indexPacks(){
  PACKS.forEach(function(p){
    p.domains.forEach(function(d){d.c="--d"+d.n});
    p.Q.forEach(function(q){q.k=hsh(p.id+"|"+q.q)});
    (p.cards||[]).forEach(function(c){c.k=hsh(p.id+"|"+c.f)});
  });
}
load();indexPacks();

/* ---------- helpers ---------- */
function $(s){return document.querySelector(s)}
var app=$("#app"),navEl=$("#nav");
function esc(s){return String(s).replace(/[&<>]/g,function(c){return {"&":"&amp;","<":"&lt;",">":"&gt;"}[c]})}
function sh(a){a=a.slice();for(var i=a.length-1;i>0;i--){var j=Math.random()*(i+1)|0;var t=a[i];a[i]=a[j];a[j]=t}return a}
function pct(a,b){return b?Math.round(a/b*100):0}
function toast(t){var e=$("#toast");e.textContent=t;e.classList.add("show");clearTimeout(e._t);e._t=setTimeout(function(){e.classList.remove("show")},1700)}
function P(){return PACKS.filter(function(p){return p.id===S.cur})[0]||PACKS[0]}
function ps(p){p=p||P();if(!S.packs[p.id])S.packs[p.id]={q:{},fc:{},sessions:0};return S.packs[p.id]}
function rec(p,i){return ps(p).q[p.Q[i].k]||{n:0,c:0,m:0}}
function dom(p,n){return p.domains.filter(function(d){return d.n===n})[0]}
function idx(p,f){var o=[];p.Q.forEach(function(q,i){if(!f||f(q,i))o.push(i)});return o}

function stats(p){
  var n=0,c=0,seen=0,missed=0,per={};
  p.domains.forEach(function(d){per[d.n]={n:0,c:0,seen:0,tot:0}});
  p.Q.forEach(function(q,i){var r=rec(p,i);per[q.d].tot++;
    if(r.n){seen++;per[q.d].seen++;n+=r.n;c+=r.c;per[q.d].n+=r.n;per[q.d].c+=r.c}
    if(r.m)missed++});
  return {n:n,c:c,seen:seen,missed:missed,per:per,total:p.Q.length};
}
function missedIds(p){return idx(p,function(q,i){return rec(p,i).m})}

/* unseen and missed first, then the rest */
function pick(p,count,pool){
  var ids=pool||idx(p);
  var un=sh(ids.filter(function(i){return !rec(p,i).n}));
  var ms=sh(ids.filter(function(i){return rec(p,i).m}));
  var rest=sh(ids.filter(function(i){return rec(p,i).n&&!rec(p,i).m}));
  var out=[];
  function take(a){while(a.length&&out.length<count){var x=a.shift();if(out.indexOf(x)<0)out.push(x)}}
  take(ms.slice(0,Math.ceil(count*.4)));take(un);take(ms);take(rest);
  return out.slice(0,count);
}
function examAlloc(p,N){
  var byD={},want={},fr=[],sum=0,tw=0;
  p.domains.forEach(function(d){byD[d.n]=idx(p,function(q){return q.d===d.n});tw+=d.w});
  p.domains.forEach(function(d){var x=N*d.w/tw,f=Math.floor(x);want[d.n]=Math.min(f,byD[d.n].length);sum+=want[d.n];fr.push([x-f,d.n])});
  fr.sort(function(a,b){return b[0]-a[0]});
  for(var g=0;g<200&&sum<N;g++){
    var placed=false;
    for(var j=0;j<fr.length&&sum<N;j++){var n=fr[j][1];if(want[n]<byD[n].length){want[n]++;sum++;placed=true}}
    if(!placed)break;
  }
  return {want:want,byD:byD};
}
function examSet(p){
  var N=Math.min(40,p.Q.length),a=examAlloc(p,N),out=[];
  p.domains.forEach(function(d){out=out.concat(pick(p,a.want[d.n],a.byD[d.n]))});
  return sh(out);
}

/* ---------- router ---------- */
var V={t:"certs"};
function go(v){V=v;render();window.scrollTo(0,0)}
function render(){
  var f={certs:vCerts,study:vStudy,quiz:vQuiz,res:vRes,cards:vCards,ref:vRef,stats:vStats,domains:vDomains}[V.t];
  app.innerHTML=f();
  app.classList.remove("fade");void app.offsetWidth;app.classList.add("fade");
  bindNav();
  var b=$("#bk");if(b)b.onclick=back;
}
function back(){
  if(V.t==="quiz"||V.t==="res"||V.t==="domains")go({t:"study"});
  else go({t:"certs"});
}
function bindNav(){
  var tabs=[["certs","\u{1F4DA}","Certs"],["study","\u{1F3AF}","Quiz"],["cards","\u{1F0CF}","Cards"],["ref","\u{1F4D1}","Ref"],["stats","\u{1F4C8}","Stats"]];
  var cur=({quiz:"study",res:"study",domains:"study"})[V.t]||V.t;
  navEl.innerHTML=tabs.map(function(t){return '<button data-tab="'+t[0]+'" class="'+(t[0]===cur?"on":"")+'"><span class="ni">'+t[1]+'</span>'+t[2]+'</button>'}).join("");
}
function hdr(title,bk,sub){
  return '<div class="hdr">'+(bk?'<button class="back" id="bk">‹</button>':"")+
    '<div style="flex:1;min-width:0"><h2>'+esc(title)+'</h2>'+(sub?'<div class="sub" style="margin-top:0">'+esc(sub)+'</div>':"")+'</div></div>';
}
function packBadge(p){return '<span class="pill" style="color:'+p.color+'">'+esc(p.code)+'</span>'}

/* ---------- certs (home) ---------- */
function offlineLine(){
  if(location.protocol==="file:")return '<div class="status"><i></i>Opened from a file: progress saves, but the offline cache needs the site hosted (see README).</div>';
  if(!("serviceWorker" in navigator))return '<div class="status"><i></i>This browser cannot cache the app for offline use.</div>';
  return OFFLINE?'<div class="status ok"><i></i>Offline ready. Everything is saved on this device.</div>'
                :'<div class="status"><i></i>Saving a copy for offline use… stay connected a moment.</div>';
}
function vCerts(){
  var standalone=(window.navigator&&window.navigator.standalone===true)||(window.matchMedia&&window.matchMedia("(display-mode: standalone)").matches);
  var banner=(!S.a2hs&&!standalone&&location.protocol!=="file:")?'<div class="a2hs"><button class="x" id="a2x">×</button><b>Put this on your home screen.</b><br>In Safari tap Share, then <b>Add to Home Screen</b>. Open it once while online, then it works in airplane mode.</div>':"";
  var tiles=PACKS.map(function(p){
    var st=stats(p);
    return '<button class="tile certtile" data-pack="'+p.id+'" style="--pc:'+p.color+'"><div class="ic">'+esc(p.short)+'</div>'+
      '<div class="tx"><div class="tt">'+esc(p.name)+'</div><div class="td">'+esc(p.code)+' · '+p.Q.length+' questions'+(p.cards&&p.cards.length?' · '+p.cards.length+' cards':'')+(p.subnet?' · subnet drill':'')+'</div>'+
      '<div class="bar"><i style="width:'+pct(st.seen,st.total)+'%;background:'+p.color+'"></i></div>'+
      '<div class="td">'+st.seen+'/'+st.total+' seen'+(st.n?' · '+pct(st.c,st.n)+'% correct':'')+'</div></div><div class="ch">›</div></button>';
  }).join("");
  return '<div class="hdr" style="padding-bottom:4px"><div style="flex:1"><div class="wordmark">Cert <span>Drill</span></div>'+
    '<div class="sub">Study anywhere. No signal needed.</div></div><div class="stat" style="flex:none"><b>'+(S.streak||0)+'</b><span>Day streak</span></div></div>'+
    offlineLine()+banner+tiles+
    '<div class="note">Questions are original practice items written for this app, not recalled exam content. Progress stays on this device.</div>';
}

/* ---------- study (pack home) ---------- */
function vStudy(){
  var p=P(),st=stats(p);
  var warn=p.note?'<div class="warnbox">'+esc(p.note)+'</div>':"";
  var sub=p.subnet?'<button class="tile" id="subnet"><div class="ic">\u{1F9EE}</div><div class="tx"><div class="tt">Subnetting drill</div><div class="td">Generated problems, unlimited, with the working shown</div></div><div class="ch">›</div></button>':"";
  return hdr(p.name,1,p.code)+warn+
  '<div class="card"><div class="row" style="margin-bottom:2px"><div style="font-weight:620;font-size:14px">Question bank covered</div>'+
  '<div style="font-variant-numeric:tabular-nums;font-weight:700">'+st.seen+'/'+st.total+'</div></div>'+
  '<div class="bar"><i style="width:'+pct(st.seen,st.total)+'%;background:'+p.color+'"></i></div>'+
  '<div class="row" style="margin-top:16px"><div class="stat"><b>'+(st.n?pct(st.c,st.n)+"%":"—")+'</b><span>Accuracy</span></div>'+
  '<div class="stat"><b>'+st.missed+'</b><span>To review</span></div><div class="stat"><b>'+(S.streak||0)+'</b><span>Day streak</span></div></div></div>'+
  '<button class="btn" id="q10">Quick 10</button>'+
  '<button class="btn ghost" id="rev" '+(st.missed?"":"disabled")+'>Review missed ('+st.missed+')</button><div style="height:6px"></div>'+
  '<button class="tile" id="byd"><div class="ic">\u{1F4C2}</div><div class="tx"><div class="tt">Study by domain</div><div class="td">Target one objective area</div></div><div class="ch">›</div></button>'+
  '<button class="tile" id="exam"><div class="ic">\u{1F4DD}</div><div class="tx"><div class="tt">Exam simulation</div><div class="td">'+Math.min(40,p.Q.length)+' questions, weighted by domain</div></div><div class="ch">›</div></button>'+sub;
}
function vDomains(){
  var p=P(),st=stats(p);
  return hdr("Study by domain",1,p.code)+p.domains.map(function(d){
    var x=st.per[d.n];
    return '<button class="tile" data-d="'+d.n+'"><div class="tx"><div class="dlab" style="color:var(--'+d.c.slice(2)+')">Domain '+d.n+' · '+d.w+'%</div>'+
    '<div class="tt" style="margin-top:2px">'+esc(d.t)+'</div><div class="bar"><i style="width:'+pct(x.seen,x.tot)+'%;background:var(--'+d.c.slice(2)+')"></i></div>'+
    '<div class="td">'+x.seen+'/'+x.tot+' seen'+(x.n?' · '+pct(x.c,x.n)+'% correct':'')+'</div></div><div class="ch">›</div></button>';
  }).join("");
}

/* ---------- quiz ---------- */
function startQuiz(items,label,mode){
  if(!items.length){toast("Nothing to study here yet");return}
  touchDay();
  go({t:"quiz",items:items,i:0,label:label,mode:mode||"drill",score:0,log:[],picked:null,perm:sh([0,1,2,3].slice(0,items[0].o.length))});
}
function vQuiz(){
  var p=P(),q=V.items[V.i],d=q.sub?{t:"Subnetting",c:"--d4"}:dom(p,q.d),done=V.picked!==null;
  var cd=V.perm.indexOf(q.a);
  var opts=V.perm.map(function(real,k){
    var cls="opt";
    if(done){
      if(k===cd)cls+=V.picked===cd?" pick-ok":" reveal";
      else if(k===V.picked)cls+=" pick-bad";
      else cls+=" dim";
    }
    return '<button class="'+cls+'" data-k="'+k+'" '+(done?"disabled":"")+'><span class="ltr">'+"ABCD"[k]+'</span><span class="ot">'+esc(q.o[real])+'</span></button>';
  }).join("");
  var fb=done?'<div class="expl"><div class="vd '+(V.picked===cd?"ok":"bad")+'">'+(V.picked===cd?"Correct":"Not quite — answer is "+"ABCD"[cd])+'</div>'+esc(q.e)+(q.r?'<div class="ref">'+esc(q.r)+'</div>':"")+'</div>':"";
  return hdr(V.label+" · "+(V.i+1)+"/"+V.items.length,1)+
  '<div class="bar" style="margin-bottom:16px"><i style="width:'+(V.i/V.items.length*100)+'%;background:'+p.color+'"></i></div>'+
  '<div class="qmeta"><span class="pill" style="color:var(--'+d.c.slice(2)+')">'+(q.sub?"":"D"+q.d+" · ")+esc(d.t)+'</span></div>'+
  '<div class="qtext">'+esc(q.q)+'</div>'+opts+fb+
  (done?'<button class="btn" id="nx">'+(V.i+1<V.items.length?"Next question":"See results")+'</button>':"");
}
function answer(k){
  if(V.picked!==null)return;
  var p=P(),q=V.items[V.i],real=V.perm[k],ok=real===q.a;
  if(q.k){var st=ps(p),r=st.q[q.k]||{n:0,c:0,m:0};st.q[q.k]={n:r.n+1,c:r.c+(ok?1:0),m:ok?0:1,t:Date.now()}}
  else{S.sub.n++;if(ok)S.sub.c++}
  if(ok)V.score++;
  V.log.push({q:q,ok:ok});V.picked=k;save();render();
}
function nextQ(){
  if(V.i+1<V.items.length){V.i++;V.picked=null;V.perm=sh([0,1,2,3].slice(0,V.items[V.i].o.length));render()}
  else{var st=ps();st.sessions=(st.sessions||0)+1;save();go({t:"res",score:V.score,tot:V.items.length,log:V.log,label:V.label,mode:V.mode})}
}

/* ---------- results ---------- */
function vRes(){
  var p=P(),pc=pct(V.score,V.tot),C=2*Math.PI*58,col=pc>=83?"--ok":pc>=70?"--warn":"--bad";
  var wrong=V.log.filter(function(l){return !l.ok});
  var verdict=V.mode==="exam"
    ?(pc>=83?"That is in passing range on a straight percentage. Scaled scoring is not linear, so treat it as a good sign, not a promise.":"Below a comfortable passing range. Work the missed questions, then run the simulation again.")
    :(pc>=80?"Solid. Anything you missed will come back first next time.":"Keep going. Missed questions are queued to return first.");
  var byD={};wrong.forEach(function(l){if(l.q.d){byD[l.q.d]=(byD[l.q.d]||0)+1}});
  var weak=Object.keys(byD).map(function(k){return [k,byD[k]]}).sort(function(a,b){return b[1]-a[1]}).slice(0,3);
  return hdr("Results",1)+
  '<div class="card"><div class="scorering"><svg width="132" height="132"><circle cx="66" cy="66" r="58" fill="none" stroke="var(--surface2)" stroke-width="11"/>'+
  '<circle cx="66" cy="66" r="58" fill="none" stroke="var('+col+')" stroke-width="11" stroke-linecap="round" stroke-dasharray="'+C+'" stroke-dashoffset="'+(C*(1-pc/100))+'"/></svg>'+
  '<div class="ct"><div><b>'+pc+'%</b><span>'+V.score+' of '+V.tot+'</span></div></div></div>'+
  '<div style="text-align:center;font-size:14.5px;line-height:1.5;color:var(--muted)">'+esc(verdict)+'</div></div>'+
  (weak.length?'<div class="card"><div style="font-weight:620;font-size:14px;margin-bottom:4px">Where you lost points</div>'+weak.map(function(w){
    var d=dom(p,+w[0]);return '<div class="mini"><div class="mb"><div class="mn">Domain '+w[0]+' · '+esc(d.t)+'</div><div class="ms">'+w[1]+' missed</div></div><button class="pill" data-dd="'+w[0]+'">Drill</button></div>'}).join("")+'</div>':"")+
  (wrong.length?'<button class="btn" id="again">Redo the '+wrong.length+' missed</button>':"")+
  '<button class="btn ghost" id="home2">Back to '+esc(p.short)+'</button>';
}

/* ---------- flashcards ---------- */
function fcOrder(p){
  var b=function(i){var r=ps(p).fc[p.cards[i].k];return (r&&r.b)||0};
  return p.cards.map(function(c,i){return i}).sort(function(a,c){return b(a)-b(c)||(Math.random()-.5)});
}
function vCards(){
  var p=P();
  if(!p.cards||!p.cards.length)return hdr("Cards")+'<div class="empty"><div class="ei">\u{1F0CF}</div>No cards for this cert yet.</div>';
  if(!V.order){V.order=fcOrder(p);V.i=0;V.flip=0}
  var learned=p.cards.filter(function(c){var r=ps(p).fc[c.k];return r&&r.b>=2}).length;
  var c=p.cards[V.order[V.i%V.order.length]];
  var front=c.m?'<div class="fr cmd">'+esc(c.f)+'</div>':'<div class="fr">'+esc(c.f)+'</div>';
  return hdr(p.cardsName||"Cards",0,p.code)+
  '<div class="row" style="margin-bottom:10px;color:var(--muted);font-size:12.5px"><span>'+(V.i+1)+' of '+V.order.length+'</span><span>'+learned+' marked known</span></div>'+
  '<div class="fc" id="card">'+(V.flip?'<div><div class="bk">'+esc(c.b)+'</div>'+(c.d?'<div class="bd">'+esc(c.d)+'</div>':"")+'</div>':'<div>'+front+'<div class="hint">tap to reveal</div></div>')+'</div>'+
  (V.flip?'<div class="two"><button class="btn ghost" id="ag">Again</button><button class="btn" id="gi">Got it</button></div>':'<button class="btn ghost" id="flip">Reveal</button>')+
  '<div class="note">Cards you mark "Again" come back sooner.</div>';
}
function advCard(good){
  var p=P(),c=p.cards[V.order[V.i%V.order.length]],r=ps(p).fc[c.k],b=(r&&r.b)||0;
  ps(p).fc[c.k]={b:good?Math.min(b+1,3):0};save();touchDay();
  V.i++;V.flip=0;
  if(V.i>=V.order.length){V.order=fcOrder(p);V.i=0;toast("Deck reshuffled")}
  render();
}

/* ---------- reference ---------- */
function vRef(){
  var p=P(),tabs=p.ref||[];
  if(!tabs.length)return hdr("Reference")+'<div class="empty"><div class="ei">\u{1F4D1}</div>No reference tables for this cert yet.</div>';
  var cur=(V.sub!=null&&tabs[V.sub])?V.sub:0,t=tabs[cur];
  var body='<div class="scroll-x"><table><thead><tr>'+t.cols.map(function(c){return '<th>'+esc(c)+'</th>'}).join("")+'</tr></thead><tbody>'+
    t.rows.map(function(r){return '<tr><td class="'+(t.wide?"m":"p")+'">'+esc(r[0])+'</td><td><b>'+esc(r[1])+'</b>'+(r[2]?'<div class="s">'+esc(r[2])+'</div>':"")+'</td></tr>'}).join("")+'</tbody></table></div>';
  return hdr("Reference",0,p.code)+'<div class="pills">'+tabs.map(function(x,i){return '<button data-s="'+i+'" class="'+(i===cur?"on":"")+'">'+esc(x.t)+'</button>'}).join("")+'</div><div class="card" style="padding:8px 10px">'+body+'</div>';
}

/* ---------- stats ---------- */
function vStats(){
  var p=P(),st=stats(p),known=(p.cards||[]).filter(function(c){var r=ps(p).fc[c.k];return r&&r.b>=2}).length;
  var tiles=PACKS.map(function(q){var s=stats(q);return '<div class="mini"><div class="mb"><div class="mn">'+esc(q.name)+'</div><div class="ms">'+s.seen+'/'+s.total+' seen</div></div><div class="mv" style="color:'+q.color+'">'+(s.n?pct(s.c,s.n)+"%":"—")+'</div></div>'}).join("");
  return hdr("Progress",0,p.name)+
  '<div class="card"><div class="row"><div class="stat"><b>'+st.n+'</b><span>Answered</span></div><div class="stat"><b>'+(st.n?pct(st.c,st.n):0)+'%</b><span>Correct</span></div><div class="stat"><b>'+(ps(p).sessions||0)+'</b><span>Sessions</span></div></div></div>'+
  '<div class="card"><div style="font-weight:620;font-size:14px;margin-bottom:6px">By domain</div>'+p.domains.map(function(d){var x=st.per[d.n];
    return '<div class="mini"><div class="mb"><div class="mn">D'+d.n+' · '+esc(d.t)+'</div><div class="bar" style="margin-top:6px"><i style="width:'+(x.n?pct(x.c,x.n):0)+'%;background:var(--'+d.c.slice(2)+')"></i></div>'+
    '<div class="ms">'+x.seen+'/'+x.tot+' seen · exam weight '+d.w+'%</div></div><div class="mv" style="color:var(--'+d.c.slice(2)+')">'+(x.n?pct(x.c,x.n)+"%":"—")+'</div></div>'}).join("")+'</div>'+
  ((p.cards&&p.cards.length)?'<div class="card"><div class="mini"><div class="mb"><div class="mn">Cards marked known</div><div class="ms">'+p.cards.length+' in the deck</div></div><div class="mv">'+known+'</div></div></div>':"")+
  (p.subnet?'<div class="card"><div class="mini"><div class="mb"><div class="mn">Subnetting drill</div><div class="ms">'+S.sub.n+' answered</div></div><div class="mv">'+(S.sub.n?pct(S.sub.c,S.sub.n)+"%":"—")+'</div></div></div>':"")+
  '<div class="card"><div style="font-weight:620;font-size:14px;margin-bottom:2px">All certs</div>'+tiles+'</div>'+
  '<button class="btn ghost" id="reset">Reset all progress</button><div class="note">Clears answers, cards and streak for every cert on this device.</div>';
}

/* ---------- clicks ---------- */
document.addEventListener("click",function(e){
  var t=e.target.closest("button");if(!t)return;
  var ds=t.dataset||{},p=PACKS.length?P():null;
  if(ds.tab){
    if(ds.tab!=="certs"&&!S.cur){S.cur=PACKS[0].id;save()}
    go({t:ds.tab});return;
  }
  if(ds.pack){S.cur=ds.pack;save();go({t:"study"});return}
  if(ds.k!==undefined&&t.classList.contains("opt")){answer(+ds.k);return}
  if(ds.d)return startQuiz(pick(p,12,idx(p,function(q){return q.d==ds.d})).map(function(i){return p.Q[i]}),"Domain "+ds.d);
  if(ds.dd)return startQuiz(pick(p,12,idx(p,function(q){return q.d==ds.dd})).map(function(i){return p.Q[i]}),"Domain "+ds.dd);
  if(ds.s!==undefined){V.sub=+ds.s;render();return}
  switch(t.id){
    case "q10":return startQuiz(pick(p,10).map(function(i){return p.Q[i]}),"Quick 10");
    case "rev":return startQuiz(sh(missedIds(p)).slice(0,15).map(function(i){return p.Q[i]}),"Review");
    case "exam":return startQuiz(examSet(p).map(function(i){return p.Q[i]}),"Exam sim","exam");
    case "byd":return go({t:"domains"});
    case "subnet":return startQuiz(SUBNET.session(10),"Subnetting");
    case "nx":return nextQ();
    case "again":return startQuiz(V.log.filter(function(l){return !l.ok}).map(function(l){return l.q}),"Redo");
    case "home2":return go({t:"study"});
    case "a2x":S.a2hs=1;save();return render();
    case "flip":V.flip=1;return render();
    case "gi":return advCard(1);
    case "ag":return advCard(0);
    case "reset":S={packs:{},cur:S.cur,streak:0,lastDay:null,a2hs:1,sub:{n:0,c:0}};save();toast("Progress cleared");return render();
  }
});
document.addEventListener("click",function(e){
  var c=e.target.closest("#card");if(c&&V.t==="cards"&&!V.flip){V.flip=1;render()}
});

/* ---------- offline ---------- */
if("serviceWorker" in navigator&&location.protocol.indexOf("http")===0){
  navigator.serviceWorker.register("sw.js").catch(function(){});
  navigator.serviceWorker.ready.then(function(){OFFLINE=true;if(V.t==="certs")render()});
}
render();
