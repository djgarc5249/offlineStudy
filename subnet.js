"use strict";
/* Generated IPv4 subnetting problems. Each question carries meta so tests can recheck the math. */
var SUBNET=(function(){
  function rnd(a,b){return a+Math.floor(Math.random()*(b-a+1))}
  function pickOne(a){return a[rnd(0,a.length-1)]}
  function ip2i(o){return(((o[0]<<24)|(o[1]<<16)|(o[2]<<8)|o[3])>>>0)}
  function i2ip(n){return [(n>>>24)&255,(n>>>16)&255,(n>>>8)&255,n&255].join(".")}
  function mask(p){return p===0?0:((0xFFFFFFFF<<(32-p))>>>0)}
  function rndIp(){
    var c=pickOne([0,1,2]);
    if(c===0)return [10,rnd(0,255),rnd(0,255),rnd(1,254)];
    if(c===1)return [172,rnd(16,31),rnd(0,255),rnd(1,254)];
    return [192,168,rnd(0,255),rnd(1,254)];
  }
  function uniq(right,cands,fmt){
    var out=[fmt(right)],seen={};seen[fmt(right)]=1;
    cands.forEach(function(c){var s=fmt(c);if(!seen[s]&&out.length<4){seen[s]=1;out.push(s)}});
    return out;
  }
  function block(p){ // interesting octet info
    var i=Math.floor(p/8),m=mask(p),mo=(m>>>(24-8*i))&255;
    return {i:i,mo:mo,size:256-mo};
  }
  var ORD=["first","second","third","fourth"];
  function mk(kind,q,right,cands,fmt,expl,meta){
    var o=uniq(right,cands,fmt);
    var n=1;while(o.length<4){o.push(fmt(typeof right==="number"?right+n*7:right)+" ");n++} // safety net, rarely used
    meta.kind=kind;
    return {q:q,o:o,a:0,e:expl,r:"Subnetting",sub:true,meta:meta};
  }
  function qNetwork(){
    var ip=rndIp(),p=rnd(17,29),m=mask(p),n=(ip2i(ip)&m)>>>0,b=block(p),sz=Math.pow(2,32-p);
    var cands=[(n+sz)>>>0,(n-sz)>>>0,(n+sz*2)>>>0,((n+sz-1)>>>0),(ip2i(ip)>>>0)];
    var oct=(ip2i(ip)>>>(24-8*b.i))&255;
    return mk("network","What is the network address of "+ip.join(".")+"/"+p+"?",n,cands,i2ip,
      "/"+p+" is mask "+i2ip(m)+". The "+ORD[b.i]+" octet is where the mask changes, with a block size of "+b.size+". "+oct+" falls in the block starting at "+(Math.floor(oct/b.size)*b.size)+", so the network is "+i2ip(n)+".",
      {ip:ip.join("."),p:p,ans:i2ip(n)});
  }
  function qBroadcast(){
    var ip=rndIp(),p=rnd(17,29),m=mask(p),n=(ip2i(ip)&m)>>>0,sz=Math.pow(2,32-p),bc=(n+sz-1)>>>0;
    return mk("broadcast","What is the broadcast address of "+ip.join(".")+"/"+p+"?",bc,[(bc+sz)>>>0,(bc-sz)>>>0,n,(bc-1)>>>0],i2ip,
      "The network is "+i2ip(n)+" and the block size is "+sz+" addresses, so the broadcast is the last address of the block: "+i2ip(bc)+".",
      {ip:ip.join("."),p:p,ans:i2ip(bc)});
  }
  function qLastHost(){
    var ip=rndIp(),p=rnd(17,29),m=mask(p),n=(ip2i(ip)&m)>>>0,sz=Math.pow(2,32-p),bc=(n+sz-1)>>>0,last=(bc-1)>>>0;
    return mk("lasthost","What is the last usable host address in the subnet containing "+ip.join(".")+"/"+p+"?",last,[bc,(last-1)>>>0,(n+1)>>>0,(last+sz)>>>0],i2ip,
      "Broadcast is "+i2ip(bc)+", and the last usable host is one below it: "+i2ip(last)+".",
      {ip:ip.join("."),p:p,ans:i2ip(last)});
  }
  function qFirstHost(){
    var ip=rndIp(),p=rnd(17,29),m=mask(p),n=(ip2i(ip)&m)>>>0,sz=Math.pow(2,32-p),first=(n+1)>>>0;
    return mk("firsthost","What is the first usable host address in the subnet containing "+ip.join(".")+"/"+p+"?",first,[n,(first+1)>>>0,(n-1)>>>0,(first+sz)>>>0],i2ip,
      "The network address is "+i2ip(n)+" and it cannot be assigned to a host, so the first usable host is "+i2ip(first)+".",
      {ip:ip.join("."),p:p,ans:i2ip(first)});
  }
  function qHosts(){
    var p=rnd(20,30),h=Math.pow(2,32-p)-2;
    return mk("hosts","How many usable host addresses are in a /"+p+" subnet?",h,[h+2,h+1,h*2+2,Math.pow(2,33-p)-2+1],function(x){return String(x)},
      "A /"+p+" leaves "+(32-p)+" host bits: 2^"+(32-p)+" = "+(h+2)+" addresses. Subtract the network and broadcast addresses to get "+h+" usable hosts.",
      {p:p,ans:String(h)});
  }
  function qMask(){
    var p=rnd(17,30),m=mask(p);
    return mk("mask","What is the dotted-decimal subnet mask for /"+p+"?",m,[mask(p-1),mask(p+1),mask(p-2),mask(p+2)],i2ip,
      "/"+p+" means "+p+" one bits. That is "+Math.floor(p/8)+" full octet(s) of 255 plus "+(p%8)+" extra bit(s), giving "+i2ip(m)+".",
      {p:p,ans:i2ip(m)});
  }
  function qWildcard(){
    var p=rnd(17,30),w=(~mask(p))>>>0;
    return mk("wildcard","What is the ACL wildcard mask for a /"+p+" network?",w,[(~mask(p-1))>>>0,(~mask(p+1))>>>0,mask(p),(~mask(p+2))>>>0],i2ip,
      "A wildcard mask is the inverse of the subnet mask. The /"+p+" mask is "+i2ip(mask(p))+", so the wildcard is "+i2ip(w)+".",
      {p:p,ans:i2ip(w)});
  }
  function qPrefixFor(){
    var hosts=pickOne([6,12,25,29,50,60,100,120,200,500,1000]),bits=1;
    while(Math.pow(2,bits)-2<hosts)bits++;
    var p=32-bits;
    return mk("prefixfor","Which is the smallest subnet (longest prefix) that fits "+hosts+" hosts?",p,[p-1,p+1,p-2,p+2],function(x){return "/"+x},
      "You need "+hosts+" + 2 = "+(hosts+2)+" addresses. 2^"+bits+" = "+Math.pow(2,bits)+" is the first power of two that fits, so use "+bits+" host bits: /"+p+".",
      {hosts:hosts,ans:"/"+p});
  }
  function qValidHost(){
    var ip=rndIp(),p=rnd(24,29),m=mask(p),n=(ip2i(ip)&m)>>>0,sz=Math.pow(2,32-p),bc=(n+sz-1)>>>0;
    var valid=(n+rnd(1,sz-2))>>>0;
    return mk("validhost","Which address can be assigned to a host on the "+i2ip(n)+"/"+p+" network?",valid,[n,bc,(bc+1)>>>0,(n-1)>>>0],i2ip,
      "The network is "+i2ip(n)+" and the broadcast is "+i2ip(bc)+". Neither can be assigned, and the next address belongs to the following subnet. Usable hosts are "+i2ip((n+1)>>>0)+" through "+i2ip((bc-1)>>>0)+".",
      {net:i2ip(n),p:p,ans:i2ip(valid),lo:i2ip((n+1)>>>0),hi:i2ip((bc-1)>>>0)});
  }
  function qSameSubnet(){
    var ip=rndIp(),p=rnd(24,28),m=mask(p),n=(ip2i(ip)&m)>>>0,sz=Math.pow(2,32-p);
    var other=(n+rnd(1,sz-2))>>>0;
    var near=[(n+sz+rnd(1,sz-2))>>>0,(n-sz+rnd(1,sz-2))>>>0,(n+sz*2+rnd(1,sz-2))>>>0];
    return mk("same","Which host is in the same subnet as "+ip.join(".")+"/"+p+"?",other,near,i2ip,
      "/"+p+" has a block size of "+sz+". This host sits in "+i2ip(n)+"–"+i2ip((n+sz-1)>>>0)+". The other choices fall in neighboring blocks.",
      {ip:ip.join("."),p:p,ans:i2ip(other)});
  }
  var KINDS=[qNetwork,qNetwork,qBroadcast,qLastHost,qFirstHost,qHosts,qMask,qWildcard,qPrefixFor,qValidHost,qSameSubnet];
  function one(){var q=pickOne(KINDS)();return q}
  function session(n){var out=[];while(out.length<n)out.push(one());return out}
  return {session:session,one:one,ip2i:ip2i,i2ip:i2ip,mask:mask};
})();
