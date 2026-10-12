(function(){
"use strict";
var C = window.AST || {}, L = C.L || "tr", UP = C.UP || "";
var ICON = {
 instagram:'<rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="1" fill="currentColor"/>',
 facebook:'<path d="M14 8h3V4h-3a4 4 0 0 0-4 4v3H7v4h3v6h4v-6h3l1-4h-4V8z"/>',
 youtube:'<rect x="2.5" y="5" width="19" height="14" rx="4"/><path d="M10 9l5 3-5 3z" fill="currentColor"/>',
 tiktok:'<path d="M14 3v11a4 4 0 1 1-4-4"/><path d="M14 3c.5 3 2.5 5 6 5"/>',
 x:'<path d="M4 4l16 16M20 4L4 20"/>',
 linkedin:'<rect x="3" y="3" width="18" height="18" rx="3"/><path d="M8 10v7M8 7v.01M12 17v-4a2 2 0 0 1 4 0v4M12 10v7"/>',
 telegram:'<path d="M21 4L3 11l6 2 2 6 3-4 5 4z"/><path d="M9 13l8-6"/>',
 whatsapp:'<path d="M4 20l1.5-4A8 8 0 1 1 9 19z"/><path d="M9 9c0 3 3 6 6 6l1-2-2-1-1 1c-1 0-3-2-3-3l1-1-1-2z"/>',
 vk:'<path d="M3 7h3c1 4 3 6 4 6V7h3v4c1 0 3-2 4-4h3c-1 3-3 5-4 6 1 1 3 3 4 5h-3c-1-2-3-3-4-3v3h-2c-5 0-8-4-9-11z"/>',
 email:'<rect x="3" y="5" width="18" height="14" rx="2"/><path d="M3 7l9 6 9-6"/>',
 web:'<circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18"/>'
};
var NAME = {instagram:"Instagram",facebook:"Facebook",youtube:"YouTube",tiktok:"TikTok",x:"X",linkedin:"LinkedIn",telegram:"Telegram",whatsapp:"WhatsApp",vk:"VK",email:"E-mail",web:"Web"};
function $(s){return document.querySelector(s)}
function $$(s){return Array.prototype.slice.call(document.querySelectorAll(s))}
function esc(s){return String(s==null?"":s).replace(/[&<>"]/g,function(c){return {"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]})}
function tx(o){return o&&typeof o==="object"?(o[L]||o.tr||o.en||""):(o||"")}
function src(p){return /^https?:/.test(p||"")?p:UP+(p||"")}
function svg(k){return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">'+(ICON[k]||ICON.web)+'</svg>'}
function ytid(s){var m=String(s||"").match(/(?:youtu\.be\/|v=|embed\/|shorts\/)([\w-]{11})/);return m?m[1]:(/^[\w-]{11}$/.test(s)?s:"")}
function digits(s){return String(s||"").replace(/\D/g,"")}
function store(k,v){try{if(v===undefined)return localStorage.getItem(k);localStorage.setItem(k,v)}catch(e){return null}}

/* ---- ölçüm ---- */
var A={provider:"none"};
function track(ev){
  try{
    if(A.provider==="goatcounter"&&window.goatcounter&&window.goatcounter.count) window.goatcounter.count({path:"olay-"+ev,title:ev,event:true});
    if(A.provider==="ga4"&&window.gtag) window.gtag("event",ev,{page_language:L});
  }catch(e){}
}
document.addEventListener("click",function(e){var a=e.target.closest&&e.target.closest("[data-ev]");if(a)track(a.getAttribute("data-ev")+"_click")},true);
function loadScript(u,attrs){var s=document.createElement("script");s.async=true;s.src=u;for(var k in attrs||{})s.setAttribute(k,attrs[k]);document.head.appendChild(s)}
function analytics(a){
  A=a||{provider:"none"};var id=(A.id||"").trim();if(!id)return;
  if(A.provider==="goatcounter"){loadScript("https://gc.zgo.at/count.js",{"data-goatcounter":"https://"+id.replace(/^https?:\/\//,"").replace(/\.goatcounter\.com.*$/,"")+".goatcounter.com/count"})}
  else if(A.provider==="cloudflare"){loadScript("https://static.cloudflareinsights.com/beacon.min.js",{"data-cf-beacon":JSON.stringify({token:id})})}
  else if(A.provider==="ga4"){
    var choice=store("ast-cookie");
    var start=function(){window.dataLayer=window.dataLayer||[];window.gtag=function(){dataLayer.push(arguments)};gtag("js",new Date());gtag("config",id,{anonymize_ip:true});loadScript("https://www.googletagmanager.com/gtag/js?id="+encodeURIComponent(id))};
    if(choice==="yes"){start();return}
    if(choice==="no")return;
    var c=C.cookie||["","OK","No"],box=document.createElement("div");
    box.className="cookie";box.setAttribute("role","dialog");box.setAttribute("aria-label",c[0]);
    box.innerHTML='<p style="margin:0">'+esc(c[0])+' <a href="'+esc(UP+(C.privacyPath||""))+'">↗</a></p><div><button type="button" class="btn ghost sm" data-no>'+esc(c[2])+'</button><button type="button" class="btn primary sm" data-yes>'+esc(c[1])+'</button></div>';
    document.body.appendChild(box);
    box.querySelector("[data-yes]").onclick=function(){store("ast-cookie","yes");box.remove();start()};
    box.querySelector("[data-no]").onclick=function(){store("ast-cookie","no");box.remove()};
  }
}

/* ---- metin değişiklikleri ---- */
var TOK={};
function fmt(s){return String(s).replace(/\{(\w+)\}/g,function(m,k){return TOK[k]!=null&&TOK[k]!==""?TOK[k]:m})}
function texts(over){
  var o=(over||{})[L];if(!o)return;
  $$("[data-k]").forEach(function(el){
    var v=o[el.getAttribute("data-k")];if(typeof v!=="string"||!v.trim())return;
    el.textContent=el.hasAttribute("data-fmt")?fmt(v):v;
  });
  var t=o.meta_title,d=o.meta_desc;
  if(t&&document.querySelector("[data-k='hero_h1']"))document.title=t;
  if(d&&document.querySelector("[data-k='hero_h1']")){var m=$('meta[name="description"]');if(m)m.setAttribute("content",d)}
}

/* ---- ayarlar ---- */
function settings(s){
  if(!s)return;
  var phone=s.phone_display, wa=digits(s.whatsapp)||digits(phone), addr=s.address_line, hours=s.hours&&s.hours[L];
  TOK={legal_name:s.legal_name,address:addr,email:s.email,phone:phone,mersis:s.mersis,kep:s.kep};
  if(phone){$$('[data-set="phone"]').forEach(function(el){el.textContent=phone});
    $$('[data-set-href="tel"]').forEach(function(a){a.href="tel:+"+digits(phone).replace(/^0+/,"")})}
  if(wa)$$('[data-set-href="wa"]').forEach(function(a){a.href=a.href.replace(/wa\.me\/\d+/,"wa.me/"+wa)});
  if(addr){
    $$('[data-set="address"]').forEach(function(el){el.textContent=addr});
    var q=encodeURIComponent(addr);
    $$('[data-set-href="map"]').forEach(function(a){a.href="https://www.google.com/maps/search/?api=1&query="+q});
    $$('[data-set-href="dir"]').forEach(function(a){a.href="https://www.google.com/maps/dir/?api=1&destination="+q});
    $$('[data-set-src="map"]').forEach(function(f){var u="https://www.google.com/maps?q="+q+"&hl="+L+"&z=16&output=embed";if(f.src!==u)f.src=u});
  }
  $$('[data-set-wrap="hours"]').forEach(function(el){el.hidden=!hours});
  if(hours)$$('[data-set="hours"]').forEach(function(el){el.textContent=hours});
  $$('[data-set-wrap="email"]').forEach(function(el){el.hidden=!s.email});
  if(s.email){$$('[data-set="email"]').forEach(function(el){el.textContent=s.email});$$('[data-set-href="mail"]').forEach(function(a){a.href="mailto:"+s.email})}
  $$('[data-set-wrap="license"]').forEach(function(el){el.hidden=!s.license_no});
  if(s.license_no)$$('[data-set="license"]').forEach(function(el){el.textContent=s.license_no});
  if(s.privacy_url)$$('[data-set-href="privacy"]').forEach(function(a){a.href=s.privacy_url});
  $$("[data-draft]").forEach(function(el){el.hidden=!!s.privacy_approved});
}
function refillTokens(){
  // KVKK sayfasındaki köşeli parantezli yer tutucuları ayarlardan doldur
  var map={"[ŞİRKET UNVANI]":"legal_name","[AÇIK ADRES]":"address","[E-POSTA]":"email","[TELEFON]":"phone","[MERSİS NO]":"mersis","[KEP ADRESİ]":"kep"};
  $$("[data-fmt]").forEach(function(el){var s=el.textContent;for(var k in map){if(TOK[map[k]])s=s.split(k).join(TOK[map[k]])}el.textContent=s});
}

/* ---- duyuru ---- */
function announce(a){
  var bar=$("[data-announce]");if(!bar)return;
  var txt=a&&tx(a.text),today=new Date().toISOString().slice(0,10);
  var on=a&&a.active&&txt&&(!a.until||a.until>=today);
  var key="ast-ann-"+(txt||"").length+"-"+(a&&a.until||"");
  if(!on||store(key)==="closed"){bar.hidden=true;return}
  bar.innerHTML='<div class="wrap"><span>'+(a.link?'<a href="'+esc(a.link)+'">'+esc(txt)+'</a>':esc(txt))+'</span><button type="button" aria-label="'+esc(C.close||"×")+'" data-close>×</button></div>';
  bar.hidden=false;
  bar.querySelector("[data-close]").onclick=function(){bar.hidden=true;store(key,"closed")};
}
document.addEventListener("click",function(e){var b=e.target.closest&&e.target.closest("[data-announce] [data-close]");if(b){b.closest("[data-announce]").hidden=true}});

/* ---- medya ---- */
function media(it){
  var cap=tx(it.caption),alt=tx(it.alt)||cap,box;
  if(it.type==="youtube"){var id=ytid(it.src);if(!id)return "";
    box='<button type="button" class="yt" data-yt="'+id+'" style="background-image:url(https://i.ytimg.com/vi/'+id+'/hqdefault.jpg)"><span>&#9654; '+esc(C.play||"Play")+'</span></button>';}
  else if(it.type==="video"){box='<video controls preload="metadata" playsinline src="'+esc(src(it.src))+'"></video>';}
  else{box='<img src="'+esc(src(it.src))+'" alt="'+esc(alt)+'" loading="lazy">';}
  return '<figure class="m"><div class="box">'+box+'</div>'+(cap?'<figcaption>'+esc(cap)+'</figcaption>':'')+'</figure>';
}
document.addEventListener("click",function(e){var b=e.target.closest&&e.target.closest("[data-yt]");if(!b)return;
  var f=document.createElement("iframe");f.src="https://www.youtube-nocookie.com/embed/"+b.getAttribute("data-yt")+"?autoplay=1";f.title="YouTube";
  f.allow="autoplay; encrypted-media; picture-in-picture";f.allowFullscreen=true;b.replaceWith(f);track("video_play");});

function slider(el,items){
  items=(items||[]).filter(function(i){return i&&i.src});if(!items.length){el.hidden=true;return}
  el.innerHTML=items.map(function(it,i){var c=tx(it.caption);return '<figure class="sl'+(i?'':' on')+'"'+(i?' aria-hidden="true"':'')+'><img src="'+esc(src(it.src))+'" alt="'+esc(tx(it.alt)||c)+'"'+(i?' loading="lazy"':'')+'>'+(c?'<figcaption>'+esc(c)+'</figcaption>':'')+'</figure>'}).join("")
   +(items.length>1?'<button type="button" class="nav prev" aria-label="'+esc(C.prev)+'"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><path d="M15 5l-7 7 7 7"/></svg></button><button type="button" class="nav next" aria-label="'+esc(C.next)+'"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><path d="M9 5l7 7-7 7"/></svg></button><div class="dots">'+items.map(function(_,i){return '<button type="button" aria-label="'+(i+1)+'"'+(i?'':' aria-current="true"')+'></button>'}).join("")+'</div>':'');
  el.hidden=false;if(items.length<2)return;
  var n=0,sl=el.querySelectorAll(".sl"),dots=el.querySelectorAll(".dots button"),timer=null,
      still=window.matchMedia&&matchMedia("(prefers-reduced-motion: reduce)").matches,rtl=document.documentElement.dir==="rtl";
  function go(i){n=(i+sl.length)%sl.length;Array.prototype.forEach.call(sl,function(s,k){s.classList.toggle("on",k===n);s.setAttribute("aria-hidden",k!==n)});
    Array.prototype.forEach.call(dots,function(d,k){d.setAttribute("aria-current",k===n)})}
  function play(){if(still)return;stop();timer=setInterval(function(){go(n+1)},5500)}
  function stop(){if(timer)clearInterval(timer);timer=null}
  el.querySelector(".prev").onclick=function(){go(n-1);play()};el.querySelector(".next").onclick=function(){go(n+1);play()};
  Array.prototype.forEach.call(dots,function(d,k){d.onclick=function(){go(k);play()}});
  el.addEventListener("mouseenter",stop);el.addEventListener("mouseleave",play);el.addEventListener("focusin",stop);el.addEventListener("focusout",play);
  var x0=null;el.addEventListener("pointerdown",function(e){x0=e.clientX});el.addEventListener("pointerup",function(e){if(x0==null)return;var dx=e.clientX-x0;x0=null;
    if(Math.abs(dx)>40){go(n+((dx<0)!==rtl?1:-1));play()}});
  play();
}
function initials(n){return String(n||"").trim().split(/\s+/).map(function(w){return w.charAt(0)}).join("").slice(0,2).toUpperCase()}
function team(list){
  var box=$("[data-team]");if(!box)return;
  var a=(list||[]).filter(function(m){return m&&m.consent&&m.name});
  box.innerHTML=a.map(function(m){
    return '<article class="tm"><div class="pic">'+(m.photo?'<img src="'+esc(src(m.photo))+'" alt="'+esc(m.name)+'" loading="lazy">':esc(initials(m.name)))+'</div><div class="body"><b>'+esc(m.name)+'</b><span>'+esc(tx(m.role))+'</span>'+(m.languages?'<span class="lg">'+esc(C.speaks)+': '+esc(m.languages)+'</span>':'')+'</div></article>'}).join("");
  $("[data-team-sec]").hidden=!a.length;
}
function partners(list){
  var box=$("[data-partners]");if(!box)return;
  var a=(list||[]).filter(function(p){return p&&p.consent&&p.name});
  box.innerHTML=a.map(function(p){
    var tags=String(p.accreditation||"").split(",").map(function(x){return x.trim()}).filter(Boolean).map(function(x){return "<span>"+esc(x)+"</span>"}).join("");
    var meta=[p.type,p.district].filter(Boolean).join(" · ");
    return '<article class="pt">'+(p.logo?'<div class="logo"><img src="'+esc(src(p.logo))+'" alt="'+esc(p.name)+'" loading="lazy"></div>':'')+'<h3>'+esc(p.name)+'</h3>'+(meta?'<p>'+esc(meta)+'</p>':'')+(tx(p.branches)?'<p>'+esc(tx(p.branches))+'</p>':'')+(tags?'<div class="tags">'+tags+'</div>':'')+(p.url?'<a href="'+esc(p.url)+'" target="_blank" rel="noopener">'+esc(C.visit)+'</a>':'')+'</article>'}).join("");
  $("[data-partners-sec]").hidden=!a.length;
}
function reviews(list){
  var rb=$("[data-reviews]");if(!rb)return;
  var rv=(list||[]).filter(function(r){return r&&r.text&&r.consent});
  rb.innerHTML=rv.map(function(r){
    var tr=r.tr&&r.tr[L],txt=tr||r.text,lg=tr?L:(r.lang||"");
    var meta=[r.country,r.date].filter(Boolean).join(" · ");
    return '<article class="rv">'+(r.photo?'<div class="pic"><img src="'+esc(src(r.photo))+'" alt="" loading="lazy"></div>':'')
      +'<div class="body"><blockquote'+(lg?' lang="'+esc(lg)+'" dir="'+(lg==="ar"?"rtl":"ltr")+'"':'')+'>'+esc(txt)+'</blockquote>'
      +'<div class="who"><span class="av" aria-hidden="true">'+esc(initials(r.name)||"•")+'</span><div><b>'+esc(r.name||"")+'</b>'+(meta?'<span>'+esc(meta)+'</span>':'')+'</div></div></div></article>';
  }).join("");
  var sec=$("[data-reviews-sec]");if(sec)sec.hidden=!rv.length;
}
var PIN='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 21s-7-6.2-7-11.5A7 7 0 0 1 19 9.5C19 14.8 12 21 12 21z"/><circle cx="12" cy="9.5" r="2.5"/></svg>';
var WAI='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">'+ICON.whatsapp+'</svg>';
function branches(list){
  var grid=$("[data-branches]"),wrap=$("[data-branches-wrap]");if(!grid||!wrap)return;
  var B=C.br||{},K=B.kind||{},hw=$("[data-branches] .hq .btn.primary svg"),WA=hw?hw.outerHTML:WAI;
  function nm(o,l){return o&&typeof o==="object"?(o[l]||o.tr||o.en||""):(o||"")}
  var a=(list||[]).filter(function(b){return b&&b.active!==false&&b.code&&nm(b.city,"en")});
  $$("[data-branches] .br:not(.hq)").forEach(function(el){el.remove()});
  grid.insertAdjacentHTML("beforeend",a.map(function(b){
    var kind=K[b.kind]&&b.kind!=="hq"?b.kind:"branch",wa=digits(b.whatsapp),ph=b.phone||"",rows="";
    if(ph)rows+='<div><dt>'+esc(B.phone)+'</dt><dd><a class="ltr" href="tel:+'+digits(ph).replace(/^0+/,"")+'" data-ev="call_branch">'+esc(ph)+'</a></dd></div>';
    if(b.email)rows+='<div><dt>'+esc(B.email)+'</dt><dd><a href="mailto:'+esc(b.email)+'">'+esc(b.email)+'</a></dd></div>';
    if(b.hours)rows+='<div><dt>'+esc(B.hours)+'</dt><dd>'+esc(b.hours)+'</dd></div>';
    if(b.languages)rows+='<div><dt>'+esc(B.langs)+'</dt><dd>'+esc(b.languages)+'</dd></div>';
    var map=/^https?:\/\//.test(b.map||"")?b.map:"https://www.google.com/maps/search/?api=1&query="+encodeURIComponent([b.address,nm(b.city,"en"),nm(b.country,"en")].filter(Boolean).join(", "));
    var acts=(wa?'<a class="btn primary sm" href="https://wa.me/'+wa+'?text='+encodeURIComponent(B.waText||"")+'" target="_blank" rel="noopener" data-ev="whatsapp_branch">'+WA+'<span>'+esc(B.wa)+'</span></a>':'')
      +'<a class="btn ghost sm" href="'+esc(map)+'" target="_blank" rel="noopener">'+PIN+'<span>'+esc(B.map)+'</span></a>';
    return '<article class="br"><div class="br-top"><span class="br-c">'+esc(nm(b.country,L))+'</span><span class="br-k">'+esc(K[kind])+'</span></div><h4>'+esc(nm(b.city,L))+'</h4>'
      +(b.address?'<p class="br-a">'+esc(b.address)+'</p>':'')+(rows?'<dl class="br-d">'+rows+'</dl>':'')+'<div class="br-act">'+acts+'</div></article>';
  }).join(""));
  wrap.hidden=!a.length;
}
function social(list){
  var so=(list||[]).filter(function(s){return s&&s.url});
  $$("[data-social]").forEach(function(el){
    el.innerHTML=so.map(function(s){var k=NAME[s.platform]?s.platform:"web",u=s.platform==="email"&&!/^mailto:/.test(s.url)?"mailto:"+s.url:s.url;
      return '<a href="'+esc(u)+'" target="_blank" rel="noopener" data-ev="social_'+esc(k)+'">'+svg(k)+esc(s.label||NAME[k])+'</a>'}).join("");
    el.hidden=!so.length});
}

/* ---- yükle ---- */
var bar=$("[data-announce] [data-close]");if(bar)bar.onclick=function(){bar.closest("[data-announce]").hidden=true};
fetch(UP+"medya.json?v="+Date.now(),{cache:"no-store"}).then(function(r){return r.ok?r.json():null}).then(function(d){
  if(!d)return;
  settings(d.settings);
  texts(d.texts);
  refillTokens();
  announce(d.announcement);
  var sl=$("[data-slider]");if(sl)slider(sl,d.slider);
  $$("[data-slot]").forEach(function(el){var a=(d.sections||{})[el.getAttribute("data-slot")]||[];var h=a.map(media).join("");el.innerHTML=h;el.hidden=!h});
  team(d.team);partners(d.partners);reviews(d.reviews);social(d.social);branches(d.branches);
  analytics(d.settings&&d.settings.analytics);
}).catch(function(){});
document.querySelectorAll(".mnav a").forEach(function(a){a.addEventListener("click",function(){a.closest("details").removeAttribute("open")})});
})();
