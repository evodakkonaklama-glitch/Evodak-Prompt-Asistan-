# -*- coding: utf-8 -*-
"""Kurumsal mavi tema (Sürüm 6).

Sağlık sigortası / klinik şablonlarının tarzı: beyaz zemin, canlı mavi ana renk, lacivert vurgular,
kalın sans-serif başlıklar, hap biçimli düğmeler, gölgeli beyaz kartlar, bölüm üstü küçük etiketler.
Bu dosya önceki CSS'in üstüne yazılır; işaretleme ve panel değişmez.
"""

FONTS = "family=Plus+Jakarta+Sans:wght@500;600;700;800&family=Manrope:wght@400;500;600;700;800"
THEME_COLOR = "#0b1e43"

CSS = r"""
/* ===================== Tema: kurumsal mavi ===================== */
:root{
  --stone:#ffffff; --slab:#ffffff; --vein:#e8effc; --line:#e2e9f5; --ink:#0b1e43; --muted:#5a6683;
  --teal:#1557ff; --teal-deep:#0b1e43; --sage:#eaf1ff; --on-deep:#ffffff; --on-deep-muted:#b9c7e6;
  --brand:#1557ff; --brand-2:#3b7bff; --brand-soft:#eaf1ff; --navy:#0b1e43; --navy-2:#132b5c; --alt:#f4f7fd;
  --wa:#0e7c43; --shadow:0 18px 40px -22px rgba(11,30,67,.28); --shadow-sm:0 8px 24px -16px rgba(11,30,67,.25);
  --display:"Plus Jakarta Sans","Manrope",system-ui,-apple-system,"Segoe UI",sans-serif;
  --body:"Plus Jakarta Sans","Manrope",system-ui,-apple-system,"Segoe UI",sans-serif;
  --r:20px;
}
body{background:#fff;background-image:none;font-size:16.5px}
h1,h2,h3,h4{font-family:var(--display);font-weight:800;letter-spacing:-.02em;color:var(--ink)}
h2{font-size:clamp(28px,3.4vw,42px);line-height:1.15}
h3{font-weight:700;letter-spacing:-.01em}
[dir="rtl"] h1,[dir="rtl"] h2,[dir="rtl"] h3,[dir="rtl"] h4{letter-spacing:0}
.lead{font-size:17.5px;line-height:1.65}
section.alt{background:var(--alt);border-block:0}
::selection{background:var(--brand);color:#fff}

/* düğmeler */
.btn{border-radius:999px;font-weight:700;padding:14px 26px;letter-spacing:-.005em;box-shadow:none}
.btn.primary{background:var(--brand);color:#fff;box-shadow:0 12px 24px -12px rgba(21,87,255,.7)}
.btn.primary:hover{background:#0c45d9}
.btn.ghost{background:#fff;color:var(--ink);border:1.5px solid var(--line)}
.btn.ghost:hover{border-color:var(--brand);color:var(--brand)}
.btn.sm{padding:10px 18px;min-height:42px;font-size:14.5px}

/* bölüm üstü etiket */
.kicker{display:inline-flex;align-items:center;gap:8px;width:max-content;max-width:100%;font-size:12.5px;font-weight:800;letter-spacing:.08em;
  text-transform:uppercase;color:var(--brand);background:var(--brand-soft);padding:7px 14px;border-radius:999px;margin:0}
.kicker::before{content:"";width:7px;height:7px;border-radius:50%;background:var(--brand);flex:none}
[dir="rtl"] .kicker{letter-spacing:0}
.sh{row-gap:14px}
@media (min-width:980px){.sh{grid-template-columns:minmax(0,1.05fr) minmax(0,.95fr)}
  .sh .kicker{grid-column:1}.sh > h2,.sh > h3{grid-column:1}.sh .lead{grid-column:2;grid-row:1 / span 2}}
.deep .kicker{background:rgba(255,255,255,.1);color:#cfe0ff}.deep .kicker::before{background:#7fb0ff}

/* duyuru ve üst menü */
.announce{background:var(--navy);font-size:14px}
.top{background:rgba(255,255,255,.92);border-bottom:1px solid var(--line);box-shadow:0 6px 24px -20px rgba(11,30,67,.4)}
.top .wrap{min-height:76px}
.brand{font-family:var(--display);font-weight:800;color:var(--ink)}
.brand .mark svg rect{fill:var(--brand)}
.brand small{color:var(--muted)}
nav.main a{font-weight:600;font-size:15px;color:var(--ink);position:relative;padding-block:6px}
nav.main a::after{content:"";position:absolute;inset-inline:0;bottom:0;height:2px;border-radius:2px;background:var(--brand);transform:scaleX(0);transition:transform .2s}
nav.main a:hover{color:var(--brand)}nav.main a:hover::after{transform:scaleX(1)}
.langs{border-radius:999px;padding:4px;border-color:var(--line)}
.langs a{border-radius:999px;padding:5px 9px}
.langs a[aria-current="page"]{background:var(--brand);color:#fff}
.mnav summary{border-radius:999px;background:#fff}
.mnav div{border-radius:16px;box-shadow:var(--shadow)}
.mlangs a[aria-current="page"]{background:var(--brand)!important}

/* açılış */
.hero{position:relative;overflow:hidden;background:
  radial-gradient(900px 480px at 85% 10%,rgba(21,87,255,.14),transparent 60%),
  radial-gradient(700px 420px at 0% 100%,rgba(22,194,163,.10),transparent 60%),
  linear-gradient(180deg,#f2f6ff 0%,#ffffff 100%);padding-block:clamp(40px,6vw,88px) 0}
.hero::before{content:"";position:absolute;width:520px;height:520px;border-radius:50%;border:64px solid rgba(21,87,255,.06);
  inset-inline-end:-160px;top:-180px;pointer-events:none}
.hero .wrap{position:relative}
.hero .eyebrow{display:inline-flex;align-items:center;gap:8px;background:#fff;color:var(--brand);border:1px solid var(--line);
  padding:8px 16px;border-radius:999px;font-size:12.5px;letter-spacing:.08em;box-shadow:var(--shadow-sm)}
.hero .eyebrow::before{content:"";width:8px;height:8px;border-radius:50%;background:#16c2a3;box-shadow:0 0 0 4px rgba(22,194,163,.18)}
.hero h1{font-size:clamp(34px,5.2vw,62px);line-height:1.08;letter-spacing:-.03em;font-weight:800}
[dir="rtl"] .hero h1{line-height:1.3;letter-spacing:0}
.hero .sub{color:var(--muted);font-size:clamp(16.5px,1.5vw,19px)}
.chips li{color:var(--ink);font-weight:600}
.chips li::before{background-color:var(--brand-soft)!important;background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%231557ff' stroke-width='3.2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M5 12.5l4.5 4.5L19 7.5'/%3E%3C/svg%3E")!important}
.hero-art{position:relative;padding:22px 0 30px;min-width:0}
.hero-art .shape{position:absolute;inset:0 0 0 12%;border-radius:36px;overflow:hidden;
  background:linear-gradient(150deg,#2a6bff 0%,#1557ff 45%,#0b1e43 100%);box-shadow:0 40px 80px -40px rgba(21,87,255,.65)}
[dir="rtl"] .hero-art .shape{inset:0 12% 0 0}
.hero-art .shape::before{content:"";position:absolute;inset:0;background:
  radial-gradient(circle at 80% 20%,rgba(255,255,255,.22),transparent 40%),
  repeating-linear-gradient(135deg,rgba(255,255,255,.05) 0 2px,transparent 2px 16px)}
.hero-art .shape .skyline{position:absolute;inset-inline:0;bottom:-2px;margin:0;color:rgba(255,255,255,.2);width:100%}
.hero-art .slab{position:relative;z-index:1;width:min(100%,400px);margin-inline-end:auto;border:0;border-radius:24px;
  box-shadow:0 30px 60px -30px rgba(11,30,67,.55);background:#fff;padding:26px 26px 22px}
.hero-art .slab::before,.hero-art .slab::after{display:none}
.hero-art .badge{position:absolute;z-index:2;inset-inline-end:6%;bottom:6px;display:flex;align-items:center;gap:12px;background:#fff;border-radius:18px;
  padding:12px 16px;box-shadow:var(--shadow);font-weight:700;font-size:14px;color:var(--ink);max-width:min(78%,300px)}
.hero-art .badge i{width:40px;height:40px;border-radius:12px;background:var(--wa);display:grid;place-items:center;color:#fff;flex:none}
.hero-art .badge i svg{width:22px;height:22px}
.hero-art .badge small{display:block;color:var(--muted);font-weight:600;font-size:12.5px}
.slab h2{font-size:21px;font-weight:800}
.journey li::before{border-color:var(--line)!important}
.journey li:first-child::before{background:var(--brand)!important;border-color:var(--brand)!important}
.journey li:first-child{color:var(--brand)}
@media (max-width:900px){.hero-art{max-width:520px}}
@media (max-width:760px){.hero-art{display:none}}
.hero .hero-extra .slider{box-shadow:var(--shadow)}

/* kartlar */
.svc,.place,.gd,.pt,.tm,.panel,.ct,.br,.rv,.faq details,.faqmore{border:1px solid var(--line);border-radius:var(--r);box-shadow:var(--shadow-sm);background:#fff}
.svc{padding:28px;gap:12px;position:relative;overflow:hidden;transition:transform .25s ease,box-shadow .25s ease}
.svc::after{content:"";position:absolute;inset-inline:0;top:0;height:4px;background:linear-gradient(90deg,var(--brand),#16c2a3);transform:scaleX(0);transform-origin:left;transition:transform .3s}
[dir="rtl"] .svc::after{transform-origin:right}
.svc:hover{transform:translateY(-4px);box-shadow:var(--shadow)}.svc:hover::after{transform:scaleX(1)}
.svc .ic,.place .ic{width:56px;height:56px;border-radius:16px;background:var(--brand-soft);color:var(--brand);transition:background .25s,color .25s}
.svc:hover .ic{background:var(--brand);color:#fff}
.svc .ic svg{width:26px;height:26px}
.svc h3{font-size:19px}
.place{padding:24px}
.place .links a{color:var(--brand)}
.gd:hover{border-color:var(--brand);transform:translateY(-3px);box-shadow:var(--shadow)}
.gd .go{color:var(--brand)}

/* galeri */
.ph .frame{border:0;border-radius:var(--r);background:linear-gradient(160deg,#eef3ff,#dfe9ff);color:var(--brand);box-shadow:var(--shadow-sm)}
.ph .frame::before,.ph .frame::after{display:none}
.ph figcaption{font-weight:700;color:var(--ink)}

/* süreç */
.vid{border:0;box-shadow:var(--shadow-sm);border-radius:24px;background:#fff}
.anim .route-on,.anim .node{stroke:var(--brand)}.anim .mover{fill:var(--brand)}
.steps li::before{background:#fff!important;color:var(--brand)!important;border:2px solid var(--brand)!important;font-family:var(--display)!important;font-weight:800!important}
.steps li:first-child::before{background:var(--brand)!important;color:#fff!important}
.steps li::after{background:var(--line)!important}

/* onkoloji bandı */
.deep{background:radial-gradient(700px 400px at 90% 0%,rgba(59,123,255,.35),transparent 60%),linear-gradient(135deg,var(--navy-2),var(--navy));border-radius:clamp(0px,3vw,36px)}
.deep h2{color:#fff}
.ticks li{background:rgba(255,255,255,.07);border-color:rgba(255,255,255,.12);border-radius:16px;color:#fff}
.ticks li::before{background-color:#7fb0ff!important}

/* ekip, kurumlar, yorumlar */
.tm .pic{background:var(--brand-soft);color:var(--brand)}
.pt .tags span{background:var(--brand-soft);color:var(--brand)}
.rv blockquote::before{color:var(--brand)}
.rv .av{background:var(--brand-soft);color:var(--brand)}

/* konum */
.loc .map{border:0;box-shadow:var(--shadow-sm)}
.loc dt{color:var(--muted)}

/* SSS */
.faq details{box-shadow:none}
.faq details[open]{border-color:var(--brand);box-shadow:var(--shadow-sm)}
.faq summary{padding:20px 22px}
.faq summary::after{width:32px;height:32px;border-radius:50%;background:var(--brand-soft);color:var(--brand);display:grid;place-items:center;font-size:20px;font-weight:600}
.faq details[open] summary::after{background:var(--brand);color:#fff}
.faqmore{background:linear-gradient(150deg,#1557ff,#0b1e43);border:0;color:#fff}
.faqmore h3{color:#fff}.faqmore p{color:#d6e2ff}
.faqmore .btn.primary{background:#fff;color:var(--brand);box-shadow:none}

/* başvuru çağrısı */
.slab.band{border:0;border-radius:32px;background:linear-gradient(120deg,#1557ff 0%,#2a6bff 50%,#0b1e43 100%);color:#fff;padding:clamp(28px,4vw,48px);box-shadow:0 30px 60px -34px rgba(21,87,255,.8);overflow:hidden}
.slab.band::before,.slab.band::after{display:none}
.slab.band h2{color:#fff}.slab.band p{color:#d9e4ff}
.slab.band .btn.primary{background:#fff;color:var(--brand);box-shadow:none}
.slab.band .btn.primary:hover{background:#eaf1ff}

/* iletişim */
.ct{padding:22px}
.ct span{color:var(--brand)}
a.ct:hover{border-color:var(--brand);box-shadow:var(--shadow)}
.social a{border-radius:999px}
.br.hq{background:linear-gradient(160deg,#1557ff,#0b1e43);border:0}
.br.hq .br-c{color:#cfe0ff}.br.hq .br-k{background:rgba(255,255,255,.16)}
.br .br-c{color:var(--brand)}.br .br-k{background:var(--brand-soft);color:var(--brand)}
.br.hq .btn.primary{color:var(--brand)}

/* WhatsApp düğmeleri yeşil */
.mbar a.wa{background:var(--wa);border-color:var(--wa)}
.br:not(.hq) .br-act .btn.primary{background:var(--wa);box-shadow:0 10px 20px -12px rgba(14,124,67,.7)}

/* alt bilgi */
.foot{background:var(--navy)!important;color:#c7d3ee}
.foot h2,.foot .brand{color:#fff}
.foot a{color:#fff}
.foot .brand .mark svg rect{fill:#fff}.foot .brand .mark svg path{stroke:var(--brand)}
.mbar{background:rgba(255,255,255,.96)}
.mbar a{border-radius:14px}

/* rehber ve KVKK sayfaları */
.article{background:linear-gradient(180deg,#f2f6ff 0,#fff 380px)}
.prose a{color:var(--brand)}
.toc a:hover{color:var(--brand)}
"""
CSS += r"""
.br.hq h4,.br.hq .br-d dd,.br.hq .br-d a{color:#fff}
.hero-art .badge{text-decoration:none}
@media (min-width:980px){.sh:not(:has(.lead)) > h2{grid-column:1 / -1}}
"""
CSS += r"""
.deep p.kicker{font-size:12.5px;margin:0 0 14px;color:#cfe0ff}
.kicker + h2,.kicker + h3{margin-top:0}
"""
CSS += r"""
[hidden]{display:none!important}
"""
