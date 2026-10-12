#!/usr/bin/env python3
"""Ankara Sağlık Turizmi web sitesini 4 dilde statik HTML olarak üretir.
Çıktı: site/index.html (TR), site/en/index.html, site/ar/index.html, site/ru/index.html
Kullanım: python3 site/kaynak/olustur.py
"""
import html, json, pathlib, sys, urllib.parse
sys.path.insert(0, str(pathlib.Path(__file__).resolve().parent))
from icerik import DATA, LANGS, T, PLACES

ROOT = pathlib.Path(__file__).resolve().parent.parent
e = lambda s: html.escape(str(s), quote=True)

ICONS = [
 '<path d="M7 3h7l5 5v13H7z"/><path d="M14 3v5h5"/><path d="M10 13h6M10 17h6"/>',
 '<rect x="4" y="5" width="16" height="15" rx="2"/><path d="M4 10h16M9 3v4M15 3v4"/><path d="M9 14l2 2 4-4"/>',
 '<path d="M3 16l18-6-4 9-5-3-3 3v-5z"/>',
 '<path d="M3 18V8M21 18v-5a3 3 0 0 0-3-3H10v8"/><path d="M3 14h18"/><circle cx="6.5" cy="11" r="1.6"/>',
 '<path d="M4 5h11v8H9l-4 3v-3H4z"/><path d="M15 9h5v8h-1v3l-3-3h-4v-2"/>',
 '<path d="M20 12a8 8 0 1 1-2.3-5.7"/><path d="M20 4v5h-5"/><path d="M12 8v4l3 2"/>',
]

NOISE = ("url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='220' height='220'%3E"
         "%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.85' numOctaves='3' stitchTiles='stitch'/%3E"
         "%3CfeColorMatrix values='0 0 0 0 .45 0 0 0 0 .43 0 0 0 0 .38 0 0 0 .10 0'/%3E%3C/filter%3E"
         "%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")")

CSS = """
/* Layout: yapışkan üst menü · iki sütunlu açılış (metin + beyaz taş levha üzerinde tedavi yolculuğu) ·
   hizmet ızgarası · numaralı süreç · koyu yeşil onkoloji bandı · bilgi kartları · SSS · iletişim · mobilde sabit alt çubuk */
:root{
  --stone:#f3f1ec; --slab:#fbfaf7; --vein:#e3ddd2; --line:#d8d1c4; --ink:#14251f; --muted:#56615c;
  --teal:#1f6b5c; --teal-deep:#163f37; --sage:#dde9e4; --on-deep:#eef4f1; --on-deep-muted:#b9cfc7;
  --display:"Literata",Georgia,"Times New Roman",serif; --body:"Manrope",system-ui,-apple-system,"Segoe UI",sans-serif;
  --arabic:"IBM Plex Sans Arabic","Noto Sans Arabic",Tahoma,sans-serif;
  --r:16px; color-scheme:light;
}
*{box-sizing:border-box}
html{scroll-behavior:smooth;scroll-padding-top:84px}
@media (prefers-reduced-motion:reduce){html{scroll-behavior:auto}*{transition:none!important;animation:none!important}}
body{margin:0;background:var(--stone);color:var(--ink);font-family:var(--body);font-size:17px;line-height:1.6;
  background-image:__NOISE__;padding-bottom:env(safe-area-inset-bottom,0px)}
[dir="rtl"] body{font-family:var(--arabic)}
[dir="rtl"] h1,[dir="rtl"] h2,[dir="rtl"] h3{font-family:var(--arabic);font-weight:700;line-height:1.35}
[dir="rtl"] .hero h1{line-height:1.3}
img,svg{max-width:100%}
a{color:var(--teal)}
:focus-visible{outline:2px solid var(--teal);outline-offset:3px;border-radius:6px}
.skip{position:absolute;inset-inline-start:-999px;top:8px;background:var(--ink);color:#fff;padding:8px 12px;border-radius:8px;z-index:50}
.skip:focus{inset-inline-start:12px}
.wrap{max-width:1160px;margin:0 auto;padding-inline:20px}
h1,h2,h3{font-family:var(--display);font-weight:600;line-height:1.15;margin:0;text-wrap:balance;letter-spacing:-.01em}
h2{font-size:clamp(28px,3.6vw,40px)}
h3{font-size:19px}
.lead{color:var(--muted);max-width:62ch;margin:12px 0 0;font-size:18px}
.eyebrow{font-size:13px;font-weight:700;letter-spacing:.1em;text-transform:uppercase;color:var(--teal);margin:0 0 14px}
[dir="rtl"] .eyebrow{letter-spacing:0}
section{padding-block:clamp(56px,8vw,96px)}
.btn{display:inline-flex;align-items:center;gap:10px;font-weight:700;font-size:16px;text-decoration:none;border-radius:12px;
  padding:14px 22px;border:1px solid transparent;transition:transform .15s,background .15s;min-height:48px}
.btn:hover{transform:translateY(-1px)}
.btn.primary{background:var(--teal);color:#fff}
.btn.primary:hover{background:var(--teal-deep)}
.btn.ghost{background:var(--slab);color:var(--ink);border-color:var(--line)}
.btn svg{width:20px;height:20px;flex:none}
[dir="rtl"] .flip{transform:scaleX(-1)}

/* üst menü */
.top{position:sticky;top:0;z-index:20;background:color-mix(in srgb,var(--stone) 88%,transparent);backdrop-filter:blur(10px);
  border-bottom:1px solid var(--line);padding-top:env(safe-area-inset-top,0px)}
.top .wrap{display:flex;align-items:center;gap:18px;min-height:68px}
.brand{display:flex;align-items:center;gap:10px;text-decoration:none;color:var(--ink);font-weight:800;font-size:16px;line-height:1.1;margin-inline-end:auto}
.mark{width:34px;height:34px;border-radius:9px;flex:none;background:var(--slab);border:1px solid var(--line);position:relative;
  background-image:radial-gradient(120% 60% at 20% 30%,transparent 55%,var(--vein) 57%,transparent 60%),radial-gradient(90% 50% at 90% 80%,transparent 60%,var(--vein) 62%,transparent 65%)}
.mark::after{content:"";position:absolute;inset:9px;border-radius:4px;border:2.5px solid var(--teal)}
.brand small{display:block;font-weight:600;color:var(--muted);font-size:12px;letter-spacing:.04em}
nav.main{display:flex;gap:22px}
nav.main a{color:var(--ink);text-decoration:none;font-weight:600;font-size:15px}
nav.main a:hover{color:var(--teal)}
.langs{display:flex;gap:2px;border:1px solid var(--line);border-radius:10px;padding:3px;background:var(--slab)}
.langs a{font-size:13px;font-weight:700;text-decoration:none;color:var(--muted);padding:5px 8px;border-radius:7px}
.langs a[aria-current="page"]{background:var(--ink);color:#fff}
.top .btn{padding:10px 16px;min-height:42px;font-size:15px}
.mnav{display:none}
@media (max-width:980px){nav.main,.top .btn.call{display:none}.mnav{display:block;position:relative}}
.mnav summary{list-style:none;cursor:pointer;border:1px solid var(--line);border-radius:10px;padding:8px 12px;font-weight:700;font-size:14px;background:var(--slab)}
.mnav summary::-webkit-details-marker{display:none}
.mnav div{position:absolute;inset-inline-end:0;top:calc(100% + 8px);background:var(--slab);border:1px solid var(--line);border-radius:12px;
  padding:8px;display:grid;min-width:200px;box-shadow:0 12px 30px rgba(20,37,31,.12)}
.mnav div a{padding:10px 12px;color:var(--ink);text-decoration:none;font-weight:600;border-radius:8px}
.mnav div a:hover{background:var(--sage)}
@media (max-width:520px){.brand small{display:none}.langs a{padding:5px 6px}}

/* açılış */
.hero{padding-block:clamp(40px,7vw,88px) clamp(48px,7vw,80px)}
.hero .wrap{display:grid;grid-template-columns:minmax(0,1.15fr) minmax(0,.85fr);gap:clamp(28px,5vw,64px);align-items:center}
@media (max-width:900px){.hero .wrap{grid-template-columns:minmax(0,1fr)}}
.hero h1{font-size:clamp(36px,5.6vw,62px);line-height:1.05}
.hero .sub{font-size:clamp(17px,1.6vw,20px);color:var(--muted);margin:22px 0 30px;max-width:56ch}
.ctas{display:flex;flex-wrap:wrap;gap:12px}
.chips{list-style:none;padding:0;margin:30px 0 0;display:flex;flex-wrap:wrap;gap:8px}
.chips li{display:flex;align-items:center;gap:8px;font-size:14px;font-weight:600;background:var(--slab);border:1px solid var(--line);border-radius:999px;padding:7px 14px}
.chips li::before{content:"";width:8px;height:8px;border-radius:50%;background:var(--teal);flex:none}
.slab{position:relative;background:var(--slab);border:1px solid var(--line);border-radius:28px;padding:30px 28px;overflow:hidden;
  box-shadow:0 1px 0 #fff inset,0 30px 60px -30px rgba(20,37,31,.25);
  background-image:__NOISE__,
   radial-gradient(160% 40% at 0% 20%,transparent 58%,rgba(160,150,132,.22) 59%,transparent 61.5%),
   radial-gradient(120% 35% at 100% 75%,transparent 60%,rgba(160,150,132,.18) 61%,transparent 63%),
   radial-gradient(80% 30% at 30% 105%,transparent 55%,rgba(160,150,132,.14) 56%,transparent 58%),
   linear-gradient(160deg,#fdfcf9,#f1eee7)}
.slab h2{font-size:22px}
.slab .s{color:var(--muted);font-size:14.5px;margin:6px 0 22px}
.journey{list-style:none;margin:0;padding:0;display:grid;gap:0;counter-reset:j}
.journey li{position:relative;display:grid;grid-template-columns:34px minmax(0,1fr);gap:14px;align-items:center;padding-block:9px;font-weight:600}
.journey li::before{counter-increment:j;content:counter(j);width:34px;height:34px;border-radius:50%;display:grid;place-items:center;
  font-size:14px;font-weight:800;background:var(--stone);border:1.5px solid var(--line);color:var(--muted);position:relative;z-index:1;font-variant-numeric:tabular-nums}
.journey li:not(:last-child)::after{content:"";position:absolute;inset-inline-start:16.5px;top:43px;bottom:-9px;width:1.5px;background:var(--line)}
.journey li:first-child::before{background:var(--teal);border-color:var(--teal);color:#fff}
.journey li:first-child{color:var(--teal)}

/* hizmetler */
.grid3{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:16px;margin-top:40px}
@media (max-width:900px){.grid3{grid-template-columns:repeat(2,minmax(0,1fr))}}
@media (max-width:600px){.grid3{grid-template-columns:minmax(0,1fr)}}
.svc{background:var(--slab);border:1px solid var(--line);border-radius:var(--r);padding:24px;display:grid;gap:10px;align-content:start}
.svc .ic{width:46px;height:46px;border-radius:12px;background:var(--sage);display:grid;place-items:center;color:var(--teal-deep)}
.svc .ic svg{width:24px;height:24px;fill:none;stroke:currentColor;stroke-width:1.7;stroke-linecap:round;stroke-linejoin:round}
.svc p{margin:0;color:var(--muted);font-size:15.5px}

/* süreç */
.steps{list-style:none;margin:40px 0 0;padding:0;display:grid;grid-template-columns:repeat(6,minmax(0,1fr));gap:12px;counter-reset:st}
@media (max-width:1050px){.steps{grid-template-columns:repeat(3,minmax(0,1fr))}}
@media (max-width:640px){.steps{grid-template-columns:minmax(0,1fr)}}
.steps li{border-top:3px solid var(--teal);padding-top:16px;display:grid;gap:6px;align-content:start}
.steps li::before{counter-increment:st;content:counter(st,decimal-leading-zero);font-family:var(--display);font-size:28px;color:var(--teal);font-variant-numeric:tabular-nums;line-height:1}
.steps h3{font-size:17px}
.steps p{margin:0;color:var(--muted);font-size:15px}

/* onkoloji bandı */
.deep{background:var(--teal-deep);color:var(--on-deep);border-radius:clamp(0px,3vw,32px);margin-inline:clamp(0px,2vw,20px)}
.deep .wrap{display:grid;grid-template-columns:minmax(0,1.1fr) minmax(0,.9fr);gap:clamp(28px,5vw,64px);align-items:start}
@media (max-width:900px){.deep .wrap{grid-template-columns:minmax(0,1fr)}}
.deep .eyebrow{color:#9fd4c6}
.deep p{color:var(--on-deep-muted);font-size:17.5px;margin:16px 0 0;max-width:60ch}
.ticks{list-style:none;margin:0;padding:0;display:grid;gap:12px}
.ticks li{display:grid;grid-template-columns:28px minmax(0,1fr);gap:12px;align-items:start;background:rgba(255,255,255,.06);border:1px solid rgba(255,255,255,.12);border-radius:14px;padding:16px;font-weight:600}
.ticks li::before{content:"";width:28px;height:28px;border-radius:50%;background:#9fd4c6 url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%23163f37' stroke-width='3' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M6 12l4 4 8-8'/%3E%3C/svg%3E") center/16px no-repeat}

/* bilgi kartları */
.duo{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:16px}
@media (max-width:820px){.duo{grid-template-columns:minmax(0,1fr)}}
.panel{background:var(--slab);border:1px solid var(--line);border-radius:var(--r);padding:clamp(22px,3vw,32px);display:grid;gap:14px;align-content:start}
.panel h2{font-size:clamp(24px,2.6vw,30px)}
.panel p{margin:0;color:var(--muted)}
.list{margin:0;padding-inline-start:20px;display:grid;gap:8px}
.list li::marker{color:var(--teal)}
.note{font-size:14.5px;background:var(--sage);border-radius:10px;padding:10px 14px;color:var(--ink)}
.partners{display:grid;grid-template-columns:repeat(auto-fit,minmax(240px,1fr));gap:12px;margin-top:28px}

/* SSS */
.faq{display:grid;gap:10px;margin-top:32px;max-width:860px}
.faq details{background:var(--slab);border:1px solid var(--line);border-radius:14px}
.faq summary{list-style:none;cursor:pointer;padding:18px 20px;font-weight:700;display:flex;gap:16px;justify-content:space-between;align-items:center}
.faq summary::-webkit-details-marker{display:none}
.faq summary::after{content:"+";font-size:24px;line-height:1;color:var(--teal);flex:none;transition:transform .2s}
.faq details[open] summary::after{transform:rotate(45deg)}
.faq p{margin:0;padding:0 20px 18px;color:var(--muted);max-width:70ch}

/* çağrı bandı */
.band{display:grid;grid-template-columns:minmax(0,1fr) auto;gap:24px;align-items:center}
@media (max-width:760px){.band{grid-template-columns:minmax(0,1fr)}}
.band h2{font-size:clamp(26px,3.2vw,36px)}
.band p{margin:10px 0 0;color:var(--muted)}

/* iletişim */
.contacts{display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:12px;margin-top:32px}
.ct{background:var(--slab);border:1px solid var(--line);border-radius:var(--r);padding:20px;display:grid;gap:4px;text-decoration:none;color:var(--ink)}
a.ct:hover{border-color:var(--teal)}
.ct span{font-size:13px;font-weight:700;color:var(--muted);letter-spacing:.04em;text-transform:uppercase}
[dir="rtl"] .ct span{letter-spacing:0}
.ct b{font-size:18px}
.ltr{direction:ltr;unicode-bidi:isolate;font-variant-numeric:tabular-nums}

footer{border-top:1px solid var(--line);padding-block:32px 110px;color:var(--muted);font-size:14px}
footer .wrap{display:grid;gap:10px}
footer p{margin:0;max-width:80ch}
@media (min-width:761px){footer{padding-bottom:40px}}

/* görseller, video, harita, yerler */
.skyline{display:block;width:100%;height:auto;margin-top:clamp(28px,4vw,48px);color:var(--vein)}
.gallery{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:14px;margin-top:36px}
@media (max-width:980px){.gallery{grid-template-columns:repeat(2,minmax(0,1fr))}}
@media (max-width:520px){.gallery{grid-template-columns:minmax(0,1fr)}}
.ph{margin:0;display:grid;gap:10px}
.ph .frame{position:relative;aspect-ratio:4/3;max-width:100%;border-radius:var(--r);overflow:hidden;border:1px solid var(--line);
  background:var(--slab);background-image:__NOISE__,radial-gradient(140% 50% at 0% 30%,transparent 58%,rgba(160,150,132,.2) 59%,transparent 62%),linear-gradient(160deg,#fdfcf9,#ece8df);display:grid;place-items:center;color:var(--teal-deep)}
.ph .frame svg{width:46%;height:auto;fill:none;stroke:currentColor;stroke-width:1.4;stroke-linecap:round;stroke-linejoin:round;opacity:.85}
.ph .frame img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover}
.ph figcaption{font-weight:700;font-size:15.5px}
.hero-photo{position:relative;border-radius:28px;overflow:hidden}
.hero-photo img{display:block;width:100%;height:auto}
.vid{margin-top:36px;background:var(--slab);border:1px solid var(--line);border-radius:24px;padding:clamp(16px,3vw,28px);overflow:hidden}
.vid .ratio{position:relative;aspect-ratio:16/9;max-width:100%;border-radius:16px;overflow:hidden;background:var(--ink)}
.vid iframe,.vid video,.vid .yt{position:absolute;inset:0;width:100%;height:100%;border:0}
.vid .yt{display:grid;place-items:center;cursor:pointer;background:#000 center/cover no-repeat;color:#fff;font:700 16px var(--body)}
.vid .yt span{background:rgba(0,0,0,.6);padding:12px 18px;border-radius:999px}
.anim svg{display:block;width:100%;height:auto}
[dir="rtl"] .anim svg{transform:scaleX(-1)}
.anim .route{fill:none;stroke:var(--line);stroke-width:3;stroke-dasharray:2 10;stroke-linecap:round}
.anim .route-on{fill:none;stroke:var(--teal);stroke-width:3;stroke-linecap:round;stroke-dasharray:1200;stroke-dashoffset:1200;animation:draw 10s linear infinite}
@keyframes draw{0%{stroke-dashoffset:1200}80%,100%{stroke-dashoffset:0}}
.anim .node{fill:var(--slab);stroke:var(--teal);stroke-width:3}
.anim .mover{fill:var(--teal)}
@media (prefers-reduced-motion:reduce){.anim .mover{display:none}.anim .route-on{animation:none;stroke-dashoffset:0}}
.anim ol{list-style:none;margin:14px 0 0;padding:0;display:grid;grid-template-columns:repeat(5,minmax(0,1fr));gap:6px;text-align:center;font-weight:700;font-size:14px}
.anim p.cap{margin:12px 0 0;color:var(--muted);font-size:13.5px;text-align:center}
.loc{display:grid;grid-template-columns:minmax(0,.8fr) minmax(0,1.2fr);gap:16px;margin-top:32px;align-items:stretch}
@media (max-width:860px){.loc{grid-template-columns:minmax(0,1fr)}}
.loc .map{position:relative;min-height:340px;border-radius:var(--r);overflow:hidden;border:1px solid var(--line);background:var(--vein)}
.loc .map iframe{position:absolute;inset:0;width:100%;height:100%;border:0}
.loc .panel .row2{display:flex;flex-wrap:wrap;gap:10px;margin-top:6px}
.loc dl{margin:0;display:grid;gap:12px}
.loc dt{font-size:13px;font-weight:700;color:var(--muted);text-transform:uppercase;letter-spacing:.04em}
[dir="rtl"] .loc dt{letter-spacing:0}
.loc dd{margin:2px 0 0;font-weight:700;font-size:17px}
.places{display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:12px;margin-top:32px}
.place{background:var(--slab);border:1px solid var(--line);border-radius:var(--r);padding:20px;display:grid;gap:8px;align-content:start}
.place .ic{width:44px;height:44px;border-radius:12px;background:var(--sage);display:grid;place-items:center;color:var(--teal-deep)}
.place .ic svg{width:24px;height:24px;fill:none;stroke:currentColor;stroke-width:1.7;stroke-linecap:round;stroke-linejoin:round}
.place p{margin:0;color:var(--muted);font-size:15px}
.place .links{display:flex;flex-wrap:wrap;gap:12px;margin-top:4px;font-size:14.5px;font-weight:700}
.place .links a{text-decoration:none}
.place .links a:hover{text-decoration:underline}
.btn.sm{padding:10px 16px;min-height:42px;font-size:15px}

/* mobil alt çubuk */
.mbar{position:fixed;inset-inline:0;bottom:0;z-index:30;display:none;grid-template-columns:repeat(3,minmax(0,1fr));gap:8px;
  padding:10px 12px calc(10px + env(safe-area-inset-bottom,0px));background:color-mix(in srgb,var(--slab) 94%,transparent);
  backdrop-filter:blur(10px);border-top:1px solid var(--line)}
.mbar a{display:flex;align-items:center;justify-content:center;gap:6px;min-height:46px;border-radius:12px;font-weight:700;font-size:15px;text-decoration:none;border:1px solid var(--line);color:var(--ink);background:var(--slab)}
.mbar a.wa{background:var(--teal);border-color:var(--teal);color:#fff}
.mbar svg{width:18px;height:18px}
@media (max-width:760px){.mbar{display:grid}}
"""

WA_SVG = '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2zm0 18.2a8.2 8.2 0 0 1-4.2-1.2l-.3-.2-3 .8.8-2.9-.2-.3A8.2 8.2 0 1 1 12 20.2zm4.5-6.1c-.2-.1-1.5-.7-1.7-.8s-.4-.1-.6.1-.7.8-.8 1-.3.2-.5.1a6.7 6.7 0 0 1-3.4-2.9c-.3-.4.3-.4.8-1.4.1-.2 0-.3 0-.4l-.8-1.8c-.2-.5-.4-.4-.6-.4h-.5a1 1 0 0 0-.7.3 3 3 0 0 0-.9 2.2 5.2 5.2 0 0 0 1.1 2.8 11.9 11.9 0 0 0 4.6 4c1.7.7 2.4.8 3.2.7a2.8 2.8 0 0 0 1.8-1.3 2.3 2.3 0 0 0 .2-1.3c-.1-.1-.3-.2-.5-.3z"/></svg>'
PHONE_SVG = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2"/></svg>'
ARROW_SVG = '<svg class="flip" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg>'
DOC_SVG = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M7 3h7l5 5v13H7z"/><path d="M14 3v5h5"/></svg>'


PLACE_ICONS = {
 "plane":'<path d="M2 16l20-7-3 9-6-3-4 4v-6z"/>',
 "train":'<rect x="6" y="3" width="12" height="14" rx="3"/><path d="M6 11h12M9 21l1.5-4M15 21l-1.5-4"/><circle cx="9.5" cy="14" r=".8"/><circle cx="14.5" cy="14" r=".8"/>',
 "bus":'<rect x="4" y="4" width="16" height="13" rx="2"/><path d="M4 11h16M7 20v-3M17 20v-3"/><circle cx="8" cy="14" r=".8"/><circle cx="16" cy="14" r=".8"/>',
 "square":'<path d="M12 21s-6-5.3-6-10a6 6 0 0 1 12 0c0 4.7-6 10-6 10z"/><circle cx="12" cy="11" r="2.2"/>',
 "monument":'<path d="M3 20h18M5 20V10M9 20V10M15 20V10M19 20V10M3 10h18M4 10l1-3h14l1 3"/>',
}
GALLERY = [
 ("karsilama",'<path d="M10 70l60-22-10 28-16-8-12 12v-18z"/><rect x="66" y="56" width="24" height="16" rx="2"/><circle cx="78" cy="40" r="5"/><path d="M78 45v11M72 50h12"/>'),
 ("konaklama",'<path d="M10 74V40M90 74V56a10 10 0 0 0-10-10H40v20"/><path d="M10 64h80"/><circle cx="25" cy="52" r="6"/><rect x="58" y="14" width="24" height="20" rx="2"/><path d="M70 14v20M58 24h24"/>'),
 ("tercuman",'<path d="M12 20h40v26H28l-12 10V46h-4z"/><path d="M52 34h36v26h-4v10L72 60H48V46"/><path d="M22 30h20M22 37h14M60 44h20M60 51h14"/>'),
 ("ofis",'<path d="M20 78V22l30-10 30 10v56"/><path d="M10 78h80"/><rect x="42" y="56" width="16" height="22"/><path d="M32 32h8M60 32h8M32 44h8M60 44h8"/>'),
]
SKYLINE = """<svg class="skyline" viewBox="0 0 1200 140" preserveAspectRatio="none" aria-hidden="true">
<path d="M0 140V96c80-18 160-22 260-10s170 12 250-6 180-26 290-12 230 22 400 4v68z" fill="currentColor" opacity=".55"/>
<g fill="currentColor">
<rect x="110" y="78" width="38" height="62"/><rect x="152" y="66" width="26" height="74"/><rect x="182" y="84" width="44" height="56"/>
<rect x="330" y="72" width="30" height="68"/><rect x="364" y="58" width="22" height="82"/><rect x="390" y="80" width="40" height="60"/>
<rect x="560" y="70" width="34" height="70"/><rect x="598" y="86" width="50" height="54"/>
<rect x="836" y="42" width="12" height="98"/><path d="M812 44c0-14 14-22 30-22s30 8 30 22c-8 6-18 8-30 8s-22-2-30-8z"/><rect x="840" y="8" width="4" height="16"/>
<rect x="900" y="74" width="36" height="66"/><rect x="940" y="62" width="24" height="78"/><rect x="968" y="82" width="46" height="58"/>
<rect x="1060" y="76" width="30" height="64"/><rect x="1094" y="90" width="42" height="50"/>
</g></svg>"""
def maps_search(q): return "https://www.google.com/maps/search/?api=1&query=" + urllib.parse.quote(q)
def maps_dir(dest, origin=""): return "https://www.google.com/maps/dir/?api=1" + ("&origin=" + urllib.parse.quote(origin) if origin else "") + "&destination=" + urllib.parse.quote(dest)

def page_url(lang):
    return DATA["base_url"] + ("" if lang == "tr" else lang + "/")

def build(lang):
    t = T[lang]
    up = "" if lang == "tr" else "../"
    def href_lang(l): return up + ("" if l == "tr" else l + "/") or "./"
    wa = "https://wa.me/" + DATA["whatsapp"] + "?text=" + urllib.parse.quote(t["wa_text"]) if DATA["whatsapp"] else ""
    tel = "tel:" + DATA["phone_tel"] if DATA["phone_tel"] else ""
    apply = DATA["apply_url"] + "#basvuru-" + lang

    alt = "\n".join(f'<link rel="alternate" hreflang="{l}" href="{e(page_url(l))}">' for l in LANGS)
    alt += f'\n<link rel="alternate" hreflang="x-default" href="{e(page_url("en"))}">'

    org = {"@context":"https://schema.org","@type":"MedicalBusiness","name":"Ankara Sağlık Turizmi","url":page_url(lang),
           "description":t["meta_desc"],"areaServed":["TR","EU"],"availableLanguage":["en","ar","ru","tr"],
           "address":{"@type":"PostalAddress","addressLocality":"Ankara","addressRegion":"Çankaya","streetAddress":"Balgat","addressCountry":"TR"}}
    org["hasMap"] = "https://www.google.com/maps/search/?api=1&query=" + urllib.parse.quote(DATA["address_line"] or DATA["map_query"])
    if DATA["address_line"]: org["address"]["streetAddress"] = DATA["address_line"]
    if DATA["phone_tel"]: org["telephone"] = DATA["phone_tel"]
    if DATA["email"]: org["email"] = DATA["email"]
    same = [u for u in [f'https://www.instagram.com/{DATA["instagram"]}' if DATA["instagram"] else "",
                        f'https://www.facebook.com/{DATA["facebook"]}' if DATA["facebook"] else ""] if u]
    if same: org["sameAs"] = same
    faq = {"@context":"https://schema.org","@type":"FAQPage","inLanguage":lang,
           "mainEntity":[{"@type":"Question","name":q,"acceptedAnswer":{"@type":"Answer","text":a}} for q,a in t["faqs"]]}
    ld = lambda o: '<script type="application/ld+json">' + json.dumps(o, ensure_ascii=False).replace("</","<\\/") + "</script>"

    langs_nav = "".join(f'<a href="{href_lang(l)}" hreflang="{l}" lang="{l}"{" aria-current=\"page\"" if l==lang else ""}>{l.upper()}</a>' for l in LANGS)
    nav_items = [("#hizmetler",t["nav_services"]),("#surec",t["nav_process"]),("#konum",t["nav_location"]),("#sss",t["nav_faq"]),("#iletisim",t["nav_contact"])]
    nav = "".join(f'<a href="{h}">{e(x)}</a>' for h,x in nav_items)

    services = "".join(f'<article class="svc"><div class="ic"><svg viewBox="0 0 24 24" aria-hidden="true">{ICONS[i]}</svg></div><h3>{e(a)}</h3><p>{e(b)}</p></article>' for i,(a,b) in enumerate(t["services"]))
    steps = "".join(f'<li><h3>{e(a)}</h3><p>{e(b)}</p></li>' for a,b in t["process"])
    faqs = "".join(f'<details><summary>{e(q)}</summary><p>{e(a)}</p></details>' for q,a in t["faqs"])

    partners = ""
    if DATA["partners"]:
        cards = "".join(f'<div class="panel"><h3>{e(p["name"])}</h3><p>{e(p.get("note",{}).get(lang,""))}</p></div>' for p in DATA["partners"])
        partners = f'<section id="kurumlar"><div class="wrap"><h2>{e(t["partners_h"])}</h2><div class="partners">{cards}</div><p class="lead" style="font-size:14px">{e(t["partners_note"])}</p></div></section>'

    contacts = []
    if tel: contacts.append(f'<a class="ct" href="{tel}"><span>{e(t["c_phone"])}</span><b class="ltr">{e(DATA["phone_display"])}</b></a>')
    if wa: contacts.append(f'<a class="ct" href="{wa}" target="_blank" rel="noopener"><span>{e(t["c_wa"])}</span><b class="ltr">{e(DATA["phone_display"])}</b></a>')
    if DATA["email"]: contacts.append(f'<a class="ct" href="mailto:{e(DATA["email"])}"><span>{e(t["c_email"])}</span><b class="ltr">{e(DATA["email"])}</b></a>')
    if DATA["telegram"]: contacts.append(f'<a class="ct" href="https://t.me/{e(DATA["telegram"])}" target="_blank" rel="noopener"><span>Telegram</span><b class="ltr">@{e(DATA["telegram"])}</b></a>')
    if DATA["instagram"]: contacts.append(f'<a class="ct" href="https://www.instagram.com/{e(DATA["instagram"])}" target="_blank" rel="noopener"><span>Instagram</span><b class="ltr">@{e(DATA["instagram"])}</b></a>')
    contacts.append(f'<div class="ct"><span>{e(t["c_office"])}</span><b>{e(t["office_val"])}</b></div>')

    foot = [f'<p>{e(t["footer_disc"])}</p>']
    extra = []
    if DATA["license_no"]: extra.append(f'{e(t["license_lbl"])}: <span class="ltr">{e(DATA["license_no"])}</span>')
    if DATA["privacy_url"]: extra.append(f'<a href="{e(DATA["privacy_url"])}">{e(t["privacy_lbl"])}</a>')
    extra.append(f'© 2026 Ankara Sağlık Turizmi. {e(t["rights"])}')
    foot.append('<p>' + " · ".join(extra) + '</p>')


    img = up + "img/"
    addr = DATA["address_line"] or t["office_val"]
    mq = DATA["address_line"] or DATA["map_query"]
    hours = DATA["hours"].get(lang, "")
    gallery = "".join(f'<figure class="ph"><div class="frame"><svg viewBox="0 0 100 90" aria-hidden="true">{g}</svg><img src="{img}{n}.jpg" alt="{e(cap)}" loading="lazy" onerror="this.remove()"></div><figcaption>{e(cap)}</figcaption></figure>' for (n,g),cap in zip(GALLERY,t["gallery"]))
    pts = [(70,150),(270,70),(460,160),(650,80),(830,150)]
    route = "M" + " ".join(f"{x} {y}" for x,y in pts[:1]) + "".join(f" C {(pts[i][0]+pts[i+1][0])/2} {pts[i][1]}, {(pts[i][0]+pts[i+1][0])/2} {pts[i+1][1]}, {pts[i+1][0]} {pts[i+1][1]}" for i in range(len(pts)-1))
    nodes = "".join(f'<circle class="node" cx="{x}" cy="{y}" r="11"/>' for x,y in pts)
    anim = f"""<div class="anim"><svg viewBox="0 0 900 220" role="img" aria-label="{e(t['anim_cap'])}">
<path class="route" d="{route}"/><path class="route-on" d="{route}"/>{nodes}
<circle class="mover" r="8"><animateMotion dur="10s" repeatCount="indefinite" keyPoints="0;1;1" keyTimes="0;.8;1" calcMode="linear" path="{route}"/></circle>
</svg><ol>{''.join(f'<li>{e(a)}</li>' for a in t['anim'])}</ol><p class="cap">{e(t['anim_cap'])}</p></div>"""
    if DATA["youtube_id"]:
        yid = e(DATA["youtube_id"])
        video = f'<div class="ratio"><button type="button" class="yt" style="background-image:url(https://i.ytimg.com/vi/{yid}/hqdefault.jpg)" onclick="this.outerHTML=\'<iframe src=&quot;https://www.youtube-nocookie.com/embed/{yid}?autoplay=1&quot; title=&quot;Video&quot; allow=&quot;autoplay; encrypted-media; picture-in-picture&quot; allowfullscreen></iframe>\'"><span>▶ {e(t["play"])}</span></button></div>'
    elif DATA["video_mp4"]:
        video = f'<div class="ratio"><video controls preload="metadata" playsinline src="{e(up + DATA["video_mp4"])}"></video></div>'
    else:
        video = anim
    places = "".join(f'<div class="place"><div class="ic"><svg viewBox="0 0 24 24" aria-hidden="true">{PLACE_ICONS[ic]}</svg></div><h3>{e(nm)}</h3><p>{e(ds)}</p><div class="links"><a href="{e(maps_search(q))}" target="_blank" rel="noopener">{e(t["map_btn"])}</a><a href="{e(maps_dir(q, mq))}" target="_blank" rel="noopener">{e(t["from_balgat"])}</a></div></div>' for (ic,q),(nm,ds) in zip(PLACES,t["places"]))
    map_src = "https://www.google.com/maps?q=" + urllib.parse.quote(mq) + "&hl=" + lang + "&z=15&output=embed"

    css = CSS.replace("__NOISE__", NOISE)
    fonts = "family=Literata:opsz,wght@7..72,500;7..72,600&family=Manrope:wght@400;600;700;800" + ("&family=IBM+Plex+Sans+Arabic:wght@400;600;700" if lang=="ar" else "")

    return f"""<!doctype html>
<html lang="{t['html_lang']}" dir="{t['dir']}">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>{e(t['meta_title'])}</title>
<meta name="description" content="{e(t['meta_desc'])}">
<link rel="canonical" href="{e(page_url(lang))}">
{alt}
<meta property="og:type" content="website">
<meta property="og:title" content="{e(t['meta_title'])}">
<meta property="og:description" content="{e(t['meta_desc'])}">
<meta property="og:url" content="{e(page_url(lang))}">
<meta property="og:locale" content="{t['locale']}">
<meta name="theme-color" content="#f3f1ec">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?{fonts}&display=swap">
<style>{css}</style>
{ld(org)}
{ld(faq)}
</head>
<body>
<a class="skip" href="#icerik">{e(t['skip'])}</a>
<header class="top">
  <div class="wrap">
    <a class="brand" href="{href_lang(lang)}"><span class="mark" aria-hidden="true"></span><span>Ankara Sağlık Turizmi<small>{e(t['hero_eyebrow'])}</small></span></a>
    <nav class="main" aria-label="{e(t['menu'])}">{nav}</nav>
    <div class="langs" aria-label="Language">{langs_nav}</div>
    {f'<a class="btn primary call" href="{tel}">{PHONE_SVG}{e(t["call"])}</a>' if tel else ''}
    <details class="mnav"><summary>{e(t['menu'])}</summary><div>{nav}</div></details>
  </div>
</header>

<main id="icerik">
<section class="hero">
  <div class="wrap">
    <div>
      <p class="eyebrow">{e(t['hero_eyebrow'])}</p>
      <h1>{e(t['hero_h1'])}</h1>
      <p class="sub">{e(t['hero_sub'])}</p>
      <div class="ctas">
        <a class="btn primary" href="{e(apply)}">{DOC_SVG}{e(t['cta_apply'])}</a>
        {f'<a class="btn ghost" href="{e(wa)}" target="_blank" rel="noopener">{WA_SVG}{e(t["cta_wa"])}</a>' if wa else ''}
      </div>
      <ul class="chips">{''.join(f'<li>{e(c)}</li>' for c in t['chips'])}</ul>
    </div>
    <aside class="slab" aria-label="{e(t['journey_title'])}">
      <h2>{e(t['journey_title'])}</h2>
      <p class="s">{e(t['journey_sub'])}</p>
      <ol class="journey">{''.join(f'<li>{e(j)}</li>' for j in t['journey'])}</ol>
    </aside>
  </div>
  <div class="wrap"><div class="hero-photo"><img src="{img}hero.jpg" alt="" onerror="this.closest('.hero-photo').remove()"></div>{SKYLINE}</div>
</section>

<section id="hizmetler" style="padding-top:0">
  <div class="wrap">
    <h2>{e(t['services_h'])}</h2>
    <p class="lead">{e(t['services_lead'])}</p>
    <div class="grid3">{services}</div>
  </div>
</section>

<section style="padding-top:0">
  <div class="wrap">
    <h2>{e(t['gallery_h'])}</h2>
    <p class="lead">{e(t['gallery_lead'])}</p>
    <div class="gallery">{gallery}</div>
  </div>
</section>

<section id="surec" style="padding-top:0">
  <div class="wrap">
    <h2>{e(t['process_h'])}</h2>
    <p class="lead">{e(t['process_lead'])}</p>
    <ol class="steps">{steps}</ol>
    <div class="vid">
      <h3>{e(t['video_h'])}</h3>
      <p class="lead" style="font-size:16px;margin-bottom:18px">{e(t['video_lead'])}</p>
      {video}
    </div>
  </div>
</section>

<section class="deep">
  <div class="wrap">
    <div>
      <h2>{e(t['onc_h'])}</h2>
      {''.join(f'<p>{e(p)}</p>' for p in t['onc_p'])}
    </div>
    <ul class="ticks">{''.join(f'<li>{e(i)}</li>' for i in t['onc_items'])}</ul>
  </div>
</section>

<section id="konum">
  <div class="wrap">
    <h2>{e(t['loc_h'])}</h2>
    <p class="lead">{e(t['loc_lead'])}</p>
    <div class="loc">
      <div class="panel">
        <dl>
          <div><dt>{e(t['addr_lbl'])}</dt><dd>{e(addr)}</dd></div>
          {f'<div><dt>{e(t["c_phone"])}</dt><dd class="ltr">{e(DATA["phone_display"])}</dd></div>' if DATA["phone_display"] else ''}
          {f'<div><dt>{e(t["hours_lbl"])}</dt><dd>{e(hours)}</dd></div>' if hours else ''}
        </dl>
        <div class="row2">
          <a class="btn primary sm" href="{e(maps_dir(mq, ''))}" target="_blank" rel="noopener">{e(t['dir_btn'])}</a>
          <a class="btn ghost sm" href="{e(maps_search(mq))}" target="_blank" rel="noopener">{e(t['map_btn'])}</a>
        </div>
      </div>
      <div class="map"><iframe src="{e(map_src)}" title="{e(t['map_title'])}" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe></div>
    </div>
    <h2 style="margin-top:clamp(48px,6vw,72px)">{e(t['places_h'])}</h2>
    <p class="lead">{e(t['places_lead'])}</p>
    <div class="places">{places}</div>
  </div>
</section>

<section style="padding-top:0">
  <div class="wrap duo">
    <div class="panel">
      <h2>{e(t['city_h'])}</h2>
      <p>{e(t['city_p'])}</p>
      <ul class="list">{''.join(f'<li>{e(i)}</li>' for i in t['city_items'])}</ul>
    </div>
    <div class="panel">
      <h2>{e(t['family_h'])}</h2>
      <p>{e(t['family_lead'])}</p>
      <ul class="list">{''.join(f'<li>{e(i)}</li>' for i in t['family'])}</ul>
      <p class="note">{e(t['visa_note'])}</p>
    </div>
  </div>
</section>

{partners}

<section id="sss" style="padding-top:0">
  <div class="wrap">
    <h2>{e(t['faq_h'])}</h2>
    <div class="faq">{faqs}</div>
  </div>
</section>

<section style="padding-top:0">
  <div class="wrap">
    <div class="slab band">
      <div><h2>{e(t['band_h'])}</h2><p>{e(t['band_p'])}</p></div>
      <a class="btn primary" href="{e(apply)}">{e(t['cta_apply'])}{ARROW_SVG}</a>
    </div>
  </div>
</section>

<section id="iletisim" style="padding-top:0">
  <div class="wrap">
    <h2>{e(t['contact_h'])}</h2>
    <p class="lead">{e(t['contact_lead'])}</p>
    <div class="contacts">{''.join(contacts)}</div>
  </div>
</section>
</main>

<footer><div class="wrap">{''.join(foot)}</div></footer>

<nav class="mbar" aria-label="{e(t['nav_contact'])}">
  {f'<a href="{tel}">{PHONE_SVG}{e(t["mob_call"])}</a>' if tel else ''}
  {f'<a class="wa" href="{e(wa)}" target="_blank" rel="noopener">{WA_SVG}{e(t["mob_wa"])}</a>' if wa else ''}
  <a href="{e(apply)}">{DOC_SVG}{e(t['mob_apply'])}</a>
</nav>
<script>
document.querySelectorAll(".mnav a").forEach(a=>a.addEventListener("click",()=>a.closest("details").removeAttribute("open")));
</script>
</body>
</html>
"""

for lang in LANGS:
    out = ROOT / ("index.html" if lang == "tr" else f"{lang}/index.html")
    out.parent.mkdir(parents=True, exist_ok=True)
    out.write_text(build(lang), encoding="utf-8")
    print(out.relative_to(ROOT.parent), f"{out.stat().st_size:,} bayt")
