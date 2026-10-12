"""Site tasarım parçaları: CSS, simgeler, çizimler, harita yardımcıları."""
import html, urllib.parse
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

/* panelden yönetilen alanlar: kayan resimler, bölüm medyası, sosyal medya */
.slider{position:relative;margin-top:clamp(28px,4vw,44px);border-radius:28px;overflow:hidden;background:var(--vein);aspect-ratio:21/9;max-width:100%}
@media (max-width:700px){.slider{aspect-ratio:4/3;border-radius:20px}}
.slider .sl{position:absolute;inset:0;margin:0;opacity:0;transition:opacity .8s ease}
.slider .sl.on{opacity:1}
.slider img{width:100%;height:100%;object-fit:cover;display:block}
.slider figcaption{position:absolute;inset-inline:0;bottom:0;padding:48px 24px 52px;color:#fff;font-weight:700;font-size:clamp(16px,2vw,22px);
  background:linear-gradient(transparent,rgba(10,22,18,.72))}
.slider .dots{position:absolute;bottom:16px;inset-inline:0;display:flex;justify-content:center;gap:8px;z-index:2}
.slider .dots button{width:10px;height:10px;border-radius:50%;border:0;padding:0;background:rgba(255,255,255,.55);cursor:pointer}
.slider .dots button[aria-current="true"]{background:#fff;width:26px;border-radius:5px}
.slider .nav{position:absolute;top:50%;transform:translateY(-50%);z-index:2;width:44px;height:44px;border-radius:50%;border:0;background:rgba(255,255,255,.85);color:var(--ink);cursor:pointer;display:grid;place-items:center}
.slider .nav svg{width:20px;height:20px}
.slider .prev{inset-inline-start:14px}.slider .next{inset-inline-end:14px}
[dir="rtl"] .slider .nav svg{transform:scaleX(-1)}
@media (prefers-reduced-motion:reduce){.slider .sl{transition:none}}
.media{display:grid;grid-template-columns:repeat(auto-fit,minmax(260px,1fr));gap:14px;margin-top:28px}
.media .m{margin:0;display:grid;gap:8px;min-width:0}
.media .box{position:relative;aspect-ratio:16/10;max-width:100%;border-radius:var(--r);overflow:hidden;background:var(--vein);border:1px solid var(--line)}
.media img,.media video,.media iframe,.media .yt{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;border:0}
.media .yt{display:grid;place-items:center;cursor:pointer;background:#000 center/cover no-repeat;color:#fff;font:700 15px var(--body)}
.media .yt span{background:rgba(0,0,0,.6);padding:10px 16px;border-radius:999px}
.media figcaption{font-weight:600;font-size:15px;color:var(--muted)}
.deep .media figcaption{color:var(--on-deep-muted)}
.social{display:flex;flex-wrap:wrap;gap:10px;margin-top:18px}
.social a{display:inline-flex;align-items:center;gap:8px;text-decoration:none;color:var(--ink);background:var(--slab);border:1px solid var(--line);border-radius:999px;padding:9px 14px;font-weight:700;font-size:14.5px}
.social a:hover{border-color:var(--teal);color:var(--teal)}
.social svg{width:18px;height:18px;flex:none}
footer .social a{padding:7px 12px;font-size:13.5px}

/* yorumlar */
.reviews{display:grid;grid-auto-flow:column;grid-auto-columns:minmax(280px,1fr);gap:14px;margin-top:32px;overflow-x:auto;scroll-snap-type:x mandatory;padding-bottom:8px;overscroll-behavior-x:contain}
@media (min-width:980px){.reviews{grid-auto-flow:row;grid-template-columns:repeat(3,minmax(0,1fr));overflow:visible}}
.rv{scroll-snap-align:start;background:var(--slab);border:1px solid var(--line);border-radius:var(--r);overflow:hidden;display:grid;grid-template-rows:auto 1fr;min-width:0}
.rv .pic{aspect-ratio:16/10;background:var(--vein)}
.rv .pic img{width:100%;height:100%;object-fit:cover;display:block}
.rv .body{padding:20px;display:grid;gap:14px;align-content:space-between}
.rv blockquote{margin:0;font-size:16px;line-height:1.6;position:relative;padding-top:22px}
.rv blockquote::before{content:"“";position:absolute;top:-14px;inset-inline-start:-2px;font-family:var(--display);font-size:56px;color:var(--teal);line-height:1}
.rv .who{display:flex;align-items:center;gap:12px}
.rv .av{width:44px;height:44px;border-radius:50%;flex:none;display:grid;place-items:center;background:var(--sage);color:var(--teal-deep);font-weight:800;overflow:hidden}
.rv .av img{width:100%;height:100%;object-fit:cover}
.rv .who b{display:block;font-size:15px}
.rv .who span{color:var(--muted);font-size:13.5px}
.rv .lg{font-size:12px;color:var(--muted)}
.rnote{margin:14px 0 0;color:var(--muted);font-size:14px;max-width:80ch}

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


