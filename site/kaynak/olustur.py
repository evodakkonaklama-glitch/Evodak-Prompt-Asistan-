#!/usr/bin/env python3
"""Ankara Sağlık Turizmi web sitesi üreticisi (4 dil, statik HTML + panel içeriği).

Varsayılan metinler: icerik.py + rehber.py
Panelde yapılan değişiklikler: site/medya.json (ayarlar, metin değişiklikleri, ekip, kurumlar, yorumlar, medya)
Bu betik ikisini birleştirip arama motorlarının okuyacağı sabit sayfaları üretir. Sitedeki küçük betik,
panelde yapılan değişiklikleri bir sonraki derlemeyi beklemeden de anında uygular.

Kullanım: python3 site/kaynak/olustur.py
"""
import copy, datetime, html, json, pathlib, re, sys, urllib.parse
HERE = pathlib.Path(__file__).resolve().parent
sys.path.insert(0, str(HERE))
from icerik import DATA as DEFAULT_DATA, LANGS, T as DEFAULT_T, PLACES
import rehber  # noqa: F401  (T'ye rehber, KVKK ve arayüz metinlerini ekler)
from tasarim import (CSS, NOISE, ICONS, WA_SVG, PHONE_SVG, ARROW_SVG, DOC_SVG, PLACE_ICONS, GALLERY, SKYLINE,
                     maps_search, maps_dir)

SITE = HERE.parent
REPO = SITE.parent
e = lambda s: html.escape(str(s if s is not None else ""), quote=True)
TODAY = datetime.date.today().isoformat()
NON_TEXT = {"html_lang", "dir", "locale", "lang_name"}

# ------------------------------------------------------------------ içerik birleştirme
def load_media():
    p = SITE / "medya.json"
    try:
        return json.loads(p.read_text(encoding="utf-8"))
    except Exception:
        return {}

MEDIA = load_media()
SETTINGS = MEDIA.get("settings", {}) or {}

def set_path(obj, path, value):
    parts = path.split(".")
    cur = obj
    for i, p in enumerate(parts):
        last = i == len(parts) - 1
        key = int(p) if isinstance(cur, list) else p
        try:
            if last:
                if isinstance(cur, list) and key >= len(cur): return
                if isinstance(cur, dict) and key not in cur: return
                if isinstance(cur[key], str): cur[key] = value
            else:
                cur = cur[key]
        except (KeyError, IndexError, TypeError, ValueError):
            return

T = copy.deepcopy(DEFAULT_T)
for L, over in (MEDIA.get("texts") or {}).items():
    if L in T and isinstance(over, dict):
        for path, val in over.items():
            if isinstance(val, str) and val.strip():
                set_path(T[L], path, val)

DATA = dict(DEFAULT_DATA)
def digits(s): return re.sub(r"\D", "", s or "")
if SETTINGS.get("phone_display"):
    DATA["phone_display"] = SETTINGS["phone_display"]
    DATA["phone_tel"] = "+" + digits(SETTINGS["phone_display"]).lstrip("0")
if SETTINGS.get("whatsapp"): DATA["whatsapp"] = digits(SETTINGS["whatsapp"])
for k in ("email", "address_line", "license_no", "privacy_url"):
    if SETTINGS.get(k): DATA[k] = SETTINGS[k]
if SETTINGS.get("hours"): DATA["hours"] = {**DATA.get("hours", {}), **SETTINGS["hours"]}
if SETTINGS.get("base_url"): DATA["base_url"] = SETTINGS["base_url"].rstrip("/") + "/"

# ------------------------------------------------------------------ yollar
def lang_root(L):  return "" if L == "tr" else L + "/"
def guide_dir(L):  return "rehber" if L == "tr" else "guide"
def home_rel(L):   return lang_root(L)
def guide_rel(L, i): return lang_root(L) + guide_dir(L) + "/" + T[L]["guides"][i]["slug"] + "/"
def privacy_rel(L): return lang_root(L) + T[L]["privacy"]["slug"] + "/"
def abs_url(rel):  return DATA["base_url"] + rel
def up_from(rel):  return "../" * rel.count("/")

# ------------------------------------------------------------------ yardımcılar
def K(L, path):
    """Metin yolu -> kaçışlı değer"""
    cur = T[L]
    for p in path.split("."):
        cur = cur[int(p)] if isinstance(cur, list) else cur[p]
    return e(cur)
def k(L, path, tag="span", attrs=""):
    return f'<{tag} data-k="{path}"{(" " + attrs) if attrs else ""}>{K(L, path)}</{tag}>'

def wa_link(L):
    return ("https://wa.me/" + DATA["whatsapp"] + "?text=" + urllib.parse.quote(T[L]["wa_text"])) if DATA["whatsapp"] else ""
def tel_link():
    return ("tel:" + DATA["phone_tel"]) if DATA.get("phone_tel") else ""
def privacy_href(L, up):
    return DATA["privacy_url"] or (up + privacy_rel(L))

def visible(items):
    return [x for x in (items or []) if x and x.get("consent")]

def media_src(p, up):
    return p if re.match(r"^https?:", p or "") else up + (p or "")

def tr_(o, L):
    if isinstance(o, dict): return o.get(L) or o.get("tr") or o.get("en") or ""
    return o or ""

# ------------------------------------------------------------------ ek CSS
CSS2 = """
/* duyuru, ekip, kurumlar, rehberler, rehber sayfası, yasal sayfa, çerez onayı */
.announce{background:var(--teal-deep);color:#fff;font-size:15px}
.announce .wrap{display:flex;gap:12px;align-items:center;justify-content:center;min-height:44px;padding-block:8px;text-align:center}
.announce a{color:#fff;font-weight:700}
.announce button{background:none;border:0;color:#fff;font-size:22px;line-height:1;cursor:pointer;padding:4px 8px;margin-inline-start:auto}
.team{display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:14px;margin-top:32px}
.tm{background:var(--slab);border:1px solid var(--line);border-radius:var(--r);overflow:hidden;display:grid}
.tm .pic{aspect-ratio:1/1;background:var(--sage);display:grid;place-items:center;font:800 40px var(--display);color:var(--teal-deep)}
.tm .pic img{width:100%;height:100%;object-fit:cover;display:block}
.tm .body{padding:16px 18px;display:grid;gap:4px}
.tm b{font-size:17px}
.tm span{color:var(--muted);font-size:14.5px}
.tm .lg{font-size:13px}
.pt-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(260px,1fr));gap:14px;margin-top:32px}
.pt{background:var(--slab);border:1px solid var(--line);border-radius:var(--r);padding:20px;display:grid;gap:8px;align-content:start}
.pt .logo{height:48px;display:flex;align-items:center}
.pt .logo img{max-height:48px;max-width:160px;object-fit:contain}
.pt p{margin:0;color:var(--muted);font-size:15px}
.pt .tags{display:flex;flex-wrap:wrap;gap:6px}
.pt .tags span{font-size:12.5px;font-weight:700;background:var(--sage);color:var(--teal-deep);border-radius:999px;padding:3px 10px}
.guides{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:14px;margin-top:32px}
@media (max-width:900px){.guides{grid-template-columns:minmax(0,1fr)}}
.gd{background:var(--slab);border:1px solid var(--line);border-radius:var(--r);padding:24px;display:grid;gap:10px;text-decoration:none;color:var(--ink);align-content:start}
.gd:hover{border-color:var(--teal)}
.gd h3{font-size:19px}
.gd p{margin:0;color:var(--muted);font-size:15.5px}
.gd .go{color:var(--teal);font-weight:700;display:flex;align-items:center;gap:6px;margin-top:4px}
.gd .go svg{width:18px;height:18px}
.article{padding-block:clamp(40px,6vw,72px)}
.article .wrap{display:grid;grid-template-columns:minmax(0,260px) minmax(0,1fr);gap:clamp(24px,5vw,64px);align-items:start}
@media (max-width:900px){.article .wrap{grid-template-columns:minmax(0,1fr)}}
.article h1{font-size:clamp(32px,4.6vw,50px);line-height:1.1}
.crumb{font-size:14px;margin:0 0 18px}
.crumb a{text-decoration:none;font-weight:700}
.toc{position:sticky;top:92px;background:var(--slab);border:1px solid var(--line);border-radius:var(--r);padding:18px}
@media (max-width:900px){.toc{position:static}}
.toc b{display:block;font-size:13px;text-transform:uppercase;letter-spacing:.06em;color:var(--muted);margin-bottom:8px}
[dir="rtl"] .toc b{letter-spacing:0}
.toc ol{margin:0;padding-inline-start:18px;display:grid;gap:6px;font-size:15px}
.toc a{color:var(--ink);text-decoration:none}
.toc a:hover{color:var(--teal)}
.prose{max-width:70ch}
.prose .intro{font-size:19px;color:var(--muted);margin:18px 0 8px}
.prose h2{font-size:clamp(23px,2.6vw,29px);margin-top:40px;scroll-margin-top:96px}
.prose p{margin:14px 0 0}
.prose .meta{font-size:14px;color:var(--muted);margin-top:22px}
.prose .links{margin-top:28px;padding:18px 20px;background:var(--slab);border:1px solid var(--line);border-radius:var(--r)}
.prose .links b{display:block;margin-bottom:6px}
.prose .links ul{margin:0;padding-inline-start:20px}
.draft{background:#f5ead6;border-radius:10px;padding:10px 14px;font-size:14.5px;margin-top:18px}
.cookie{position:fixed;inset-inline:12px;bottom:calc(12px + env(safe-area-inset-bottom,0px));z-index:40;max-width:560px;margin-inline:auto;background:var(--slab);border:1px solid var(--line);
  border-radius:14px;box-shadow:0 18px 40px rgba(20,37,31,.18);padding:16px;display:grid;gap:12px;font-size:15px}
.cookie div{display:flex;gap:8px;flex-wrap:wrap;justify-content:flex-end}
@media (max-width:760px){.cookie{bottom:calc(84px + env(safe-area-inset-bottom,0px))}}
footer nav{display:flex;flex-wrap:wrap;gap:6px 16px}
footer nav a{color:var(--muted);font-weight:600}
.err404{min-height:60vh;display:grid;place-items:center;text-align:center}
"""

# ------------------------------------------------------------------ çalışma zamanı betiği
RUNTIME = (HERE / "calisma.js").read_text(encoding="utf-8")

def runtime(L, up):
    cfg = {"L": L, "UP": up, "play": T[L]["play"], "prev": T[L]["prev"], "next": T[L]["next"],
           "cookie": [T[L]["cookie_text"], T[L]["cookie_ok"], T[L]["cookie_no"]], "close": T[L]["announce_close"],
           "speaks": T[L]["speaks"], "visit": T[L]["visit_site"], "privacyPath": privacy_rel(L)}
    return "<script>window.AST=" + json.dumps(cfg, ensure_ascii=False).replace("</", "<\\/") + ";\n" + RUNTIME + "</script>"

# ------------------------------------------------------------------ ortak parçalar
def head(L, title, desc, rel, alts, extra_ld=(), noindex=False, og_type="website"):
    t = T[L]
    up = up_from(rel)
    links = "\n".join(f'<link rel="alternate" hreflang="{l}" href="{e(abs_url(r))}">' for l, r in alts)
    if alts:
        en = dict(alts).get("en")
        if en: links += f'\n<link rel="alternate" hreflang="x-default" href="{e(abs_url(en))}">'
    fonts = "family=Literata:opsz,wght@7..72,500;7..72,600&family=Manrope:wght@400;600;700;800" + ("&family=IBM+Plex+Sans+Arabic:wght@400;600;700" if L == "ar" else "")
    ld = "".join('<script type="application/ld+json">' + json.dumps(o, ensure_ascii=False).replace("</", "<\\/") + "</script>" for o in extra_ld)
    return f"""<!doctype html>
<html lang="{t['html_lang']}" dir="{t['dir']}">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>{e(title)}</title>
<meta name="description" content="{e(desc)}">
{'<meta name="robots" content="noindex">' if noindex else ''}
<link rel="canonical" href="{e(abs_url(rel))}">
{links}
<meta property="og:type" content="{og_type}">
<meta property="og:title" content="{e(title)}">
<meta property="og:description" content="{e(desc)}">
<meta property="og:url" content="{e(abs_url(rel))}">
<meta property="og:image" content="{e(DATA['base_url'] + 'og.png')}">
<meta property="og:locale" content="{t['locale']}">
<meta name="twitter:card" content="summary_large_image">
<meta name="theme-color" content="#f3f1ec">
<link rel="icon" href="{up}favicon.svg" type="image/svg+xml">
<link rel="apple-touch-icon" href="{up}apple-touch-icon.png">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?{fonts}&display=swap">
<style>{CSS.replace("__NOISE__", NOISE)}{CSS2}</style>
{ld}
</head>"""

def announce_html(L):
    a = MEDIA.get("announcement") or {}
    txt = tr_(a.get("text"), L)
    active = a.get("active") and txt and (not a.get("until") or a["until"] >= TODAY)
    inner = ""
    if active:
        body = f'<a href="{e(a["link"])}">{e(txt)}</a>' if a.get("link") else e(txt)
        inner = f'<div class="wrap"><span>{body}</span><button type="button" aria-label="{e(T[L]["announce_close"])}" data-close>×</button></div>'
    return f'<div class="announce" data-announce{"" if active else " hidden"}>{inner}</div>'

def header(L, rel, nav_home_prefix):
    t = T[L]; up = up_from(rel)
    tel = tel_link()
    nav_items = [("hizmetler", "nav_services"), ("surec", "nav_process"), ("konum", "nav_location"), ("rehberler", "nav_guides"), ("sss", "nav_faq"), ("iletisim", "nav_contact")]
    nav = "".join(f'<a href="{nav_home_prefix}#{h}" data-k="{key}">{e(t[key])}</a>' for h, key in nav_items)
    def lang_href(l):
        # aynı sayfanın diğer dildeki karşılığı
        return up + PAGE_EQUIV.get((rel, l), home_rel(l)) or "./"
    langs = "".join(f'<a href="{e(lang_href(l) or "./")}" hreflang="{l}" lang="{l}"{" aria-current=\"page\"" if l == L else ""}>{l.upper()}</a>' for l in LANGS)
    return f"""<body>
<a class="skip" href="#icerik" data-k="skip">{e(t['skip'])}</a>
{announce_html(L)}
<header class="top">
  <div class="wrap">
    <a class="brand" href="{e(up + home_rel(L) or './')}"><span class="mark" aria-hidden="true"></span><span>Ankara Sağlık Turizmi<small data-k="hero_eyebrow">{e(t['hero_eyebrow'])}</small></span></a>
    <nav class="main" aria-label="{e(t['menu'])}">{nav}</nav>
    <div class="langs" aria-label="Language">{langs}</div>
    {f'<a class="btn primary call" href="{tel}" data-set-href="tel" data-ev="call">{PHONE_SVG}<span data-k="call">{e(t["call"])}</span></a>' if tel else ''}
    <details class="mnav"><summary data-k="menu">{e(t['menu'])}</summary><div>{nav}</div></details>
  </div>
</header>"""

def footer(L, rel):
    t = T[L]; up = up_from(rel)
    wa = wa_link(L); tel = tel_link()
    extra = []
    extra.append(f'<span data-set-wrap="license"{"" if DATA["license_no"] else " hidden"}><span data-k="license_lbl">{e(t["license_lbl"])}</span>: <span class="ltr" data-set="license">{e(DATA["license_no"])}</span></span>')
    extra.append(f'© 2026 Ankara Sağlık Turizmi. <span data-k="rights">{e(t["rights"])}</span>')
    guides = "".join(f'<a href="{e(up + guide_rel(L, i))}" data-k="guides.{i}.title">{e(g["title"])}</a>' for i, g in enumerate(t["guides"]))
    apply = DATA["apply_url"] + "#basvuru-" + L
    return f"""<footer><div class="wrap">
<div class="social" data-social hidden></div>
<nav aria-label="{e(t['nav_guides'])}"><a href="{e(privacy_href(L, up))}" data-set-href="privacy" data-k="privacy_link">{e(t['privacy_link'])}</a>{guides}</nav>
<p data-k="footer_disc">{e(t['footer_disc'])}</p>
<p>{" · ".join(extra)}</p>
</div></footer>
<nav class="mbar" aria-label="{e(t['nav_contact'])}">
  {f'<a href="{tel}" data-set-href="tel" data-ev="call">{PHONE_SVG}<span data-k="mob_call">{e(t["mob_call"])}</span></a>' if tel else ''}
  {f'<a class="wa" href="{e(wa)}" target="_blank" rel="noopener" data-set-href="wa" data-ev="whatsapp">{WA_SVG}<span data-k="mob_wa">{e(t["mob_wa"])}</span></a>' if wa else ''}
  <a href="{e(apply)}" data-ev="apply">{DOC_SVG}<span data-k="mob_apply">{e(t['mob_apply'])}</span></a>
</nav>
{runtime(L, up)}
</body>
</html>
"""

# ------------------------------------------------------------------ ana sayfa
def team_html(L, up):
    items = visible(MEDIA.get("team"))
    cards = ""
    for m in items:
        ini = "".join(w[:1] for w in (m.get("name") or "").split())[:2].upper()
        pic = f'<img src="{e(media_src(m["photo"], up))}" alt="{e(m.get("name",""))}" loading="lazy">' if m.get("photo") else e(ini)
        langs = m.get("languages") or ""
        cards += f'<article class="tm"><div class="pic">{pic}</div><div class="body"><b>{e(m.get("name",""))}</b><span>{e(tr_(m.get("role"), L))}</span>{f"<span class=lg>{e(T[L]["speaks"])}: {e(langs)}</span>" if langs else ""}</div></article>'
    return cards

def partners_html(L, up):
    items = visible(MEDIA.get("partners"))
    cards = ""
    for p in items:
        tags = "".join(f"<span>{e(x.strip())}</span>" for x in (p.get("accreditation") or "").split(",") if x.strip())
        logo = f'<div class="logo"><img src="{e(media_src(p["logo"], up))}" alt="{e(p.get("name",""))}" loading="lazy"></div>' if p.get("logo") else ""
        meta = " · ".join(x for x in [p.get("type", ""), p.get("district", "")] if x)
        link = f'<a href="{e(p["url"])}" target="_blank" rel="noopener">{e(T[L]["visit_site"])}</a>' if p.get("url") else ""
        cards += f'<article class="pt">{logo}<h3>{e(p.get("name",""))}</h3>{f"<p>{e(meta)}</p>" if meta else ""}{f"<p>{e(tr_(p.get("branches"), L))}</p>" if tr_(p.get("branches"), L) else ""}{f"<div class=tags>{tags}</div>" if tags else ""}{link}</article>'
    return cards

def build_home(L):
    t = T[L]; rel = home_rel(L); up = up_from(rel)
    wa = wa_link(L); tel = tel_link()
    apply = DATA["apply_url"] + "#basvuru-" + L
    img = up + "img/"
    addr = DATA["address_line"] or t["office_val"]
    mq = DATA["address_line"] or DATA["map_query"]
    hours = (DATA.get("hours") or {}).get(L, "")

    org = {"@context":"https://schema.org","@type":"MedicalBusiness","name":"Ankara Sağlık Turizmi","url":abs_url(rel),
           "description":t["meta_desc"],"areaServed":["TR","EU"],"availableLanguage":["en","ar","ru","tr"],
           "address":{"@type":"PostalAddress","addressLocality":"Ankara","addressRegion":"Çankaya","streetAddress":DATA["address_line"] or "Balgat","addressCountry":"TR"},
           "hasMap":maps_search(mq),"logo":DATA["base_url"]+"apple-touch-icon.png","image":DATA["base_url"]+"og.png"}
    if DATA.get("phone_tel"): org["telephone"] = DATA["phone_tel"]
    if DATA.get("email"): org["email"] = DATA["email"]
    same = [s["url"] for s in (MEDIA.get("social") or []) if s.get("url", "").startswith("http")]
    if same: org["sameAs"] = same
    faq = {"@context":"https://schema.org","@type":"FAQPage","inLanguage":L,
           "mainEntity":[{"@type":"Question","name":q,"acceptedAnswer":{"@type":"Answer","text":a}} for q,a in t["faqs"]]}

    alts = [(l, home_rel(l)) for l in LANGS]
    out = head(L, t["meta_title"], t["meta_desc"], rel, alts, [org, faq])
    out += header(L, rel, "")

    services = "".join(f'<article class="svc"><div class="ic"><svg viewBox="0 0 24 24" aria-hidden="true">{ICONS[i]}</svg></div>{k(L,f"services.{i}.0","h3")}{k(L,f"services.{i}.1","p")}</article>' for i in range(len(t["services"])))
    steps = "".join(f'<li>{k(L,f"process.{i}.0","h3")}{k(L,f"process.{i}.1","p")}</li>' for i in range(len(t["process"])))
    faqs = "".join(f'<details><summary data-k="faqs.{i}.0">{K(L,f"faqs.{i}.0")}</summary>{k(L,f"faqs.{i}.1","p")}</details>' for i in range(len(t["faqs"])))
    gallery = "".join(f'<figure class="ph"><div class="frame"><svg viewBox="0 0 100 90" aria-hidden="true">{g}</svg><img src="{img}{n}.jpg" alt="{K(L,f"gallery.{i}")}" loading="lazy" onerror="this.remove()"></div>{k(L,f"gallery.{i}","figcaption")}</figure>' for i,(n,g) in enumerate(GALLERY))
    pts = [(70,150),(270,70),(460,160),(650,80),(830,150)]
    route = f"M{pts[0][0]} {pts[0][1]}" + "".join(f" C {(pts[i][0]+pts[i+1][0])/2} {pts[i][1]}, {(pts[i][0]+pts[i+1][0])/2} {pts[i+1][1]}, {pts[i+1][0]} {pts[i+1][1]}" for i in range(len(pts)-1))
    nodes = "".join(f'<circle class="node" cx="{x}" cy="{y}" r="11"/>' for x,y in pts)
    anim = f"""<div class="anim"><svg viewBox="0 0 900 220" role="img" aria-label="{K(L,'anim_cap')}">
<path class="route" d="{route}"/><path class="route-on" d="{route}"/>{nodes}
<circle class="mover" r="8"><animateMotion dur="10s" repeatCount="indefinite" keyPoints="0;1;1" keyTimes="0;.8;1" calcMode="linear" path="{route}"/></circle>
</svg><ol>{''.join(f'<li data-k="anim.{i}">{K(L,f"anim.{i}")}</li>' for i in range(len(t['anim'])))}</ol>{k(L,'anim_cap','p','class="cap"')}</div>"""
    places = "".join(f'<div class="place"><div class="ic"><svg viewBox="0 0 24 24" aria-hidden="true">{PLACE_ICONS[ic]}</svg></div>{k(L,f"places.{i}.0","h3")}{k(L,f"places.{i}.1","p")}<div class="links"><a href="{e(maps_search(q))}" target="_blank" rel="noopener" data-k="map_btn">{K(L,"map_btn")}</a><a href="{e(maps_dir(q, mq))}" target="_blank" rel="noopener" data-k="from_balgat">{K(L,"from_balgat")}</a></div></div>' for i,(ic,q) in enumerate(PLACES))
    map_src = "https://www.google.com/maps?q=" + urllib.parse.quote(mq) + "&hl=" + L + "&z=15&output=embed"
    guides = "".join(f'<a class="gd" href="{e(up + guide_rel(L,i))}">{k(L,f"guides.{i}.title","h3")}{k(L,f"guides.{i}.desc","p")}<span class="go"><span data-k="read_more">{K(L,"read_more")}</span>{ARROW_SVG}</span></a>' for i in range(len(t["guides"])))
    contacts = []
    if tel: contacts.append(f'<a class="ct" href="{tel}" data-set-href="tel" data-ev="call"><span data-k="c_phone">{K(L,"c_phone")}</span><b class="ltr" data-set="phone">{e(DATA["phone_display"])}</b></a>')
    if wa: contacts.append(f'<a class="ct" href="{e(wa)}" target="_blank" rel="noopener" data-set-href="wa" data-ev="whatsapp"><span data-k="c_wa">{K(L,"c_wa")}</span><b class="ltr" data-set="phone">{e(DATA["phone_display"])}</b></a>')
    contacts.append(f'<a class="ct" href="mailto:{e(DATA["email"])}" data-set-href="mail" data-set-wrap="email"{"" if DATA["email"] else " hidden"}><span data-k="c_email">{K(L,"c_email")}</span><b class="ltr" data-set="email">{e(DATA["email"])}</b></a>')
    contacts.append(f'<div class="ct"><span data-k="c_office">{K(L,"c_office")}</span><b data-set="address">{e(addr)}</b></div>')
    team = team_html(L, up); partners = partners_html(L, up)

    out += f"""
<main id="icerik">
<section class="hero">
  <div class="wrap">
    <div>
      {k(L,'hero_eyebrow','p','class="eyebrow"')}
      {k(L,'hero_h1','h1')}
      {k(L,'hero_sub','p','class="sub"')}
      <div class="ctas">
        <a class="btn primary" href="{e(apply)}" data-ev="apply">{DOC_SVG}<span data-k="cta_apply">{K(L,'cta_apply')}</span></a>
        {f'<a class="btn ghost" href="{e(wa)}" target="_blank" rel="noopener" data-set-href="wa" data-ev="whatsapp">{WA_SVG}<span data-k="cta_wa">{K(L,"cta_wa")}</span></a>' if wa else ''}
      </div>
      <ul class="chips">{''.join(f'<li data-k="chips.{i}">{K(L,f"chips.{i}")}</li>' for i in range(len(t['chips'])))}</ul>
    </div>
    <aside class="slab" aria-label="{K(L,'journey_title')}">
      {k(L,'journey_title','h2')}
      {k(L,'journey_sub','p','class="s"')}
      <ol class="journey">{''.join(f'<li data-k="journey.{i}">{K(L,f"journey.{i}")}</li>' for i in range(len(t['journey'])))}</ol>
    </aside>
  </div>
  <div class="wrap"><div class="slider" data-slider hidden></div>{SKYLINE}</div>
</section>

<section id="hizmetler" style="padding-top:0"><div class="wrap">
  {k(L,'services_h','h2')}{k(L,'services_lead','p','class="lead"')}
  <div class="grid3">{services}</div>
  <div class="media" data-slot="hizmetler" hidden></div>
</div></section>

<section style="padding-top:0"><div class="wrap">
  {k(L,'gallery_h','h2')}{k(L,'gallery_lead','p','class="lead"')}
  <div class="gallery">{gallery}</div>
  <div class="media" data-slot="galeri" hidden></div>
</div></section>

<section id="surec" style="padding-top:0"><div class="wrap">
  {k(L,'process_h','h2')}{k(L,'process_lead','p','class="lead"')}
  <ol class="steps">{steps}</ol>
  <div class="media" data-slot="surec" hidden></div>
  <div class="vid">{k(L,'video_h','h3')}{k(L,'video_lead','p','class="lead" style="font-size:16px;margin-bottom:18px"')}{anim}</div>
</div></section>

<section class="deep">
  <div class="wrap">
    <div>{k(L,'onc_h','h2')}{''.join(k(L,f"onc_p.{i}","p") for i in range(len(t['onc_p'])))}</div>
    <ul class="ticks">{''.join(f'<li data-k="onc_items.{i}">{K(L,f"onc_items.{i}")}</li>' for i in range(len(t['onc_items'])))}</ul>
  </div>
  <div class="wrap"><div class="media" data-slot="onkoloji" hidden></div></div>
</section>

<section id="ekip" data-team-sec{"" if team else " hidden"}><div class="wrap">
  {k(L,'team_h','h2')}{k(L,'team_lead','p','class="lead"')}
  <div class="team" data-team>{team}</div>
</div></section>

<section id="konum"><div class="wrap">
  {k(L,'loc_h','h2')}{k(L,'loc_lead','p','class="lead"')}
  <div class="loc">
    <div class="panel">
      <dl>
        <div><dt data-k="addr_lbl">{K(L,'addr_lbl')}</dt><dd data-set="address">{e(addr)}</dd></div>
        {f'<div><dt data-k="c_phone">{K(L,"c_phone")}</dt><dd class="ltr" data-set="phone">{e(DATA["phone_display"])}</dd></div>' if DATA["phone_display"] else ''}
        <div data-set-wrap="hours"{"" if hours else " hidden"}><dt data-k="hours_lbl">{K(L,'hours_lbl')}</dt><dd data-set="hours">{e(hours)}</dd></div>
      </dl>
      <div class="row2">
        <a class="btn primary sm" href="{e(maps_dir(mq))}" target="_blank" rel="noopener" data-set-href="dir" data-k="dir_btn">{K(L,'dir_btn')}</a>
        <a class="btn ghost sm" href="{e(maps_search(mq))}" target="_blank" rel="noopener" data-set-href="map" data-k="map_btn">{K(L,'map_btn')}</a>
      </div>
    </div>
    <div class="map"><iframe src="{e(map_src)}" title="{K(L,'map_title')}" loading="lazy" referrerpolicy="no-referrer-when-downgrade" data-set-src="map"></iframe></div>
  </div>
  <h2 style="margin-top:clamp(48px,6vw,72px)" data-k="places_h">{K(L,'places_h')}</h2>{k(L,'places_lead','p','class="lead"')}
  <div class="places">{places}</div>
  <div class="media" data-slot="konum" hidden></div>
</div></section>

<section id="kurumlar" data-partners-sec{"" if partners else " hidden"} style="padding-top:0"><div class="wrap">
  {k(L,'partners_h2','h2')}{k(L,'partners_lead','p','class="lead"')}
  <div class="pt-grid" data-partners>{partners}</div>
</div></section>

<section style="padding-top:0"><div class="wrap duo">
  <div class="panel">{k(L,'city_h','h2')}{k(L,'city_p','p')}<ul class="list">{''.join(f'<li data-k="city_items.{i}">{K(L,f"city_items.{i}")}</li>' for i in range(len(t['city_items'])))}</ul></div>
  <div class="panel">{k(L,'family_h','h2')}{k(L,'family_lead','p')}<ul class="list">{''.join(f'<li data-k="family.{i}">{K(L,f"family.{i}")}</li>' for i in range(len(t['family'])))}</ul>{k(L,'visa_note','p','class="note"')}</div>
</div></section>

<section id="rehberler" style="padding-top:0"><div class="wrap">
  {k(L,'guides_h','h2')}{k(L,'guides_lead','p','class="lead"')}
  <div class="guides">{guides}</div>
</div></section>

<section id="yorumlar" data-reviews-sec hidden style="padding-top:0"><div class="wrap">
  {k(L,'reviews_h','h2')}<div class="reviews" data-reviews></div>{k(L,'reviews_note','p','class="rnote"')}
</div></section>

<section id="sss" style="padding-top:0"><div class="wrap">
  {k(L,'faq_h','h2')}<div class="faq">{faqs}</div>
  <div class="media" data-slot="sss" hidden></div>
</div></section>

<section style="padding-top:0"><div class="wrap">
  <div class="slab band"><div>{k(L,'band_h','h2')}{k(L,'band_p','p')}</div>
  <a class="btn primary" href="{e(apply)}" data-ev="apply"><span data-k="cta_apply">{K(L,'cta_apply')}</span>{ARROW_SVG}</a></div>
</div></section>

<section id="iletisim" style="padding-top:0"><div class="wrap">
  {k(L,'contact_h','h2')}{k(L,'contact_lead','p','class="lead"')}
  <div class="contacts">{''.join(contacts)}</div>
  <div class="social" data-social hidden></div>
  <div class="media" data-slot="iletisim" hidden></div>
</div></section>
</main>
"""
    out += footer(L, rel)
    return rel, out

# ------------------------------------------------------------------ rehber sayfası
def build_guide(L, i):
    t = T[L]; g = t["guides"][i]; rel = guide_rel(L, i); up = up_from(rel)
    alts = [(l, guide_rel(l, i)) for l in LANGS]
    art = {"@context":"https://schema.org","@type":"Article","headline":g["title"],"description":g["desc"],"inLanguage":L,
           "mainEntityOfPage":abs_url(rel),"dateModified":TODAY,"image":DATA["base_url"]+"og.png",
           "author":{"@type":"Organization","name":"Ankara Sağlık Turizmi","url":abs_url(home_rel(L))},
           "publisher":{"@type":"Organization","name":"Ankara Sağlık Turizmi","logo":{"@type":"ImageObject","url":DATA["base_url"]+"apple-touch-icon.png"}}}
    crumbs = {"@context":"https://schema.org","@type":"BreadcrumbList","itemListElement":[
        {"@type":"ListItem","position":1,"name":"Ankara Sağlık Turizmi","item":abs_url(home_rel(L))},
        {"@type":"ListItem","position":2,"name":t["guides_h"],"item":abs_url(home_rel(L))+"#rehberler"},
        {"@type":"ListItem","position":3,"name":g["title"],"item":abs_url(rel)}]}
    out = head(L, g["title"] + " · Ankara Sağlık Turizmi", g["desc"], rel, alts, [art, crumbs], og_type="article")
    home = up + home_rel(L)
    out += header(L, rel, home)
    p = f"guides.{i}"
    toc = "".join(f'<li><a href="#b{j+1}" data-k="{p}.sections.{j}.0">{K(L,f"{p}.sections.{j}.0")}</a></li>' for j in range(len(g["sections"])))
    body = ""
    for j, (h, paras) in enumerate(g["sections"]):
        body += f'<h2 id="b{j+1}" data-k="{p}.sections.{j}.0">{e(h)}</h2>' + "".join(k(L, f"{p}.sections.{j}.1.{n}", "p") for n in range(len(paras)))
    links = ""
    if g.get("links"):
        links = '<div class="links"><b data-k="official_links">' + K(L, "official_links") + '</b><ul>' + "".join(f'<li><a href="{e(u)}" target="_blank" rel="noopener">{e(n)}</a></li>' for n, u in g["links"]) + "</ul></div>"
    apply = DATA["apply_url"] + "#basvuru-" + L
    out += f"""
<main id="icerik" class="article">
  <div class="wrap">
    <aside class="toc"><b data-k="on_this_page">{K(L,'on_this_page')}</b><ol>{toc}</ol></aside>
    <article class="prose">
      <p class="crumb"><a href="{e(home or './')}#rehberler" data-k="guides_h">{K(L,'guides_h')}</a></p>
      {k(L,f'{p}.title','h1')}
      {k(L,f'{p}.intro','p','class="intro"')}
      {body}
      {links}
      <p class="meta"><span data-k="updated_lbl">{K(L,'updated_lbl')}</span>: {TODAY} · <span data-k="footer_disc">{K(L,'footer_disc')}</span></p>
      <div class="slab band" style="margin-top:36px"><div>{k(L,'guide_cta_h','h2')}{k(L,'guide_cta_p','p')}</div>
        <a class="btn primary" href="{e(apply)}" data-ev="apply"><span data-k="cta_apply">{K(L,'cta_apply')}</span>{ARROW_SVG}</a></div>
    </article>
  </div>
</main>
"""
    out += footer(L, rel)
    return rel, out

# ------------------------------------------------------------------ KVKK / gizlilik
def fill_tokens(s):
    vals = {"legal_name": SETTINGS.get("legal_name") or "[ŞİRKET UNVANI]", "address": DATA["address_line"] or "[AÇIK ADRES]",
            "email": DATA["email"] or "[E-POSTA]", "phone": DATA["phone_display"] or "[TELEFON]",
            "mersis": SETTINGS.get("mersis") or "[MERSİS NO]", "kep": SETTINGS.get("kep") or "[KEP ADRESİ]"}
    return re.sub(r"\{(\w+)\}", lambda m: vals.get(m.group(1), m.group(0)), s)

def build_privacy(L):
    t = T[L]; pv = t["privacy"]; rel = privacy_rel(L); up = up_from(rel)
    approved = bool(SETTINGS.get("privacy_approved"))
    alts = [(l, privacy_rel(l)) for l in LANGS]
    out = head(L, pv["title"] + " · Ankara Sağlık Turizmi", pv["title"], rel, alts, noindex=not approved)
    home = up + home_rel(L)
    out += header(L, rel, home)
    body = ""
    for j, (h, paras) in enumerate(pv["sections"]):
        body += f'<h2 data-k="privacy.sections.{j}.0">{e(h)}</h2>' + "".join(
            f'<p data-k="privacy.sections.{j}.1.{n}" data-fmt>{e(fill_tokens(x))}</p>' for n, x in enumerate(paras))
    out += f"""
<main id="icerik" class="article">
  <div class="wrap" style="grid-template-columns:minmax(0,1fr)">
    <article class="prose">
      <p class="crumb"><a href="{e(home or './')}" data-k="back_home">{K(L,'back_home')}</a></p>
      {k(L,'privacy.title','h1')}
      <p class="draft" data-draft{" hidden" if approved else ""} data-k="privacy_draft">{K(L,'privacy_draft')}</p>
      <p class="intro" data-k="privacy.intro" data-fmt>{e(fill_tokens(pv['intro']))}</p>
      {body}
      <p class="meta"><span data-k="updated_lbl">{K(L,'updated_lbl')}</span>: {e(SETTINGS.get('privacy_updated') or TODAY)}</p>
    </article>
  </div>
</main>
"""
    out += footer(L, rel)
    return rel, out

# ------------------------------------------------------------------ eşdeğer sayfa haritası (dil değiştirici için)
PAGE_EQUIV = {}
def register(rels_by_lang):
    for L, r in rels_by_lang.items():
        for l2, r2 in rels_by_lang.items():
            PAGE_EQUIV[(r, l2)] = r2
register({L: home_rel(L) for L in LANGS})
for i in range(len(T["tr"]["guides"])):
    register({L: guide_rel(L, i) for L in LANGS})
register({L: privacy_rel(L) for L in LANGS})

# ------------------------------------------------------------------ yardımcı dosyalar
def write(rel_file, text, binary=False):
    p = SITE / rel_file
    p.parent.mkdir(parents=True, exist_ok=True)
    (p.write_bytes if binary else (lambda x: p.write_text(x, encoding="utf-8")))(text)
    return p

def assets():
    # site simgesi (beyaz taş + yeşil çerçeve)
    write("favicon.svg", '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><rect width="64" height="64" rx="16" fill="#fbfaf7"/>'
          '<path d="M6 22c14-6 30-6 52 4M10 50c16-8 28-6 46 0" stroke="#e3ddd2" stroke-width="2" fill="none"/>'
          '<rect x="18" y="18" width="28" height="28" rx="6" fill="none" stroke="#1f6b5c" stroke-width="6"/></svg>')
    try:
        from PIL import Image, ImageDraw, ImageFont
        def mark(size):
            im = Image.new("RGB", (size, size), "#fbfaf7"); d = ImageDraw.Draw(im)
            s = size / 64
            d.rounded_rectangle([18*s, 18*s, 46*s, 46*s], radius=6*s, outline="#1f6b5c", width=max(2, int(6*s)))
            return im
        write("apple-touch-icon.png", b"", binary=True)
        mark(180).save(SITE / "apple-touch-icon.png")
        og = Image.new("RGB", (1200, 630), "#f3f1ec"); d = ImageDraw.Draw(og)
        for y0, a in ((150, 0.18), (420, 0.14)):
            d.arc([-200, y0, 1400, y0 + 520], 190, 340, fill="#d9d2c4", width=3)
        d.rounded_rectangle([80, 80, 160, 160], radius=18, outline="#1f6b5c", width=12)
        f1 = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSerif-Bold.ttf", 72)
        f2 = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf", 34)
        d.text((80, 230), "Ankara Sağlık Turizmi", font=f1, fill="#14251f")
        d.text((80, 340), "Ankara'da tedavi koordinasyonu", font=f2, fill="#1f6b5c")
        d.text((80, 392), "Treatment coordination in Ankara · EN · AR · RU · TR", font=f2, fill="#56615c")
        d.text((80, 520), "Balgat, Çankaya · Ankara", font=f2, fill="#56615c")
        og.save(SITE / "og.png", optimize=True)
    except Exception as ex:
        print("görsel üretilemedi:", ex)

def sitemap(pages):
    groups = {}
    for L, rel, gid in pages:
        groups.setdefault(gid, {})[L] = rel
    out = ['<?xml version="1.0" encoding="UTF-8"?>', '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">']
    for gid, rels in groups.items():
        if gid == "privacy" and not SETTINGS.get("privacy_approved"): continue
        for L, rel in rels.items():
            out.append(f"<url><loc>{e(abs_url(rel))}</loc><lastmod>{TODAY}</lastmod>" +
                       "".join(f'<xhtml:link rel="alternate" hreflang="{l}" href="{e(abs_url(r))}"/>' for l, r in rels.items()) + "</url>")
    out.append("</urlset>")
    write("sitemap.xml", "\n".join(out) + "\n")

def robots():
    bots = ["Googlebot", "Bingbot", "OAI-SearchBot", "ChatGPT-User", "PerplexityBot", "Perplexity-User", "ClaudeBot", "Claude-SearchBot", "Claude-User", "Applebot"]
    lines = ["# Ankara Sağlık Turizmi · robots.txt", "# Arama motorları ve yapay zekâ arama asistanları siteyi okuyabilir.", ""]
    for b in bots: lines += [f"User-agent: {b}", "Allow: /", ""]
    lines += ["# Yapay zekâ modellerinin eğitimi için tarama: karar size ait. Engellemek için Allow yerine Disallow yazın.",
              "User-agent: GPTBot", "Allow: /", "", "User-agent: Google-Extended", "Allow: /", "",
              "User-agent: *", "Allow: /", "", f"Sitemap: {DATA['base_url']}sitemap.xml", ""]
    write("robots.txt", "\n".join(lines))

def llms():
    t = T["en"]
    lines = ["# Ankara Sağlık Turizmi", "",
             "> Treatment coordination for international patients and families coming to Ankara, Türkiye, mainly for cancer treatment. "
             "Office in Balgat, Çankaya, Ankara. Languages: English, Arabic, Russian, Turkish. "
             "We coordinate; medical decisions are made by the treating doctor. We do not give diagnoses, prices or outcome guarantees.", "",
             "## Services"] + [f"- {a}: {b}" for a, b in t["services"]] + ["", "## Contact",
             f"- Phone / WhatsApp: {DATA['phone_display']}" if DATA["phone_display"] else "",
             f"- Address: {DATA['address_line'] or 'Balgat, Çankaya, Ankara, Türkiye'}",
             f"- Pre-application form: {DATA['apply_url']}#basvuru-en", "", "## Pages"]
    for L in LANGS:
        lines.append(f"- [{T[L]['lang_name']} home]({abs_url(home_rel(L))})")
    for i, g in enumerate(t["guides"]):
        lines.append(f"- [{g['title']}]({abs_url(guide_rel('en', i))}): {g['desc']}")
    lines += ["", "Note: llms.txt is a proposed convention, not an official standard.", ""]
    write("llms.txt", "\n".join(x for x in lines if x is not None))

def defaults_json():
    out = {L: {key: v for key, v in DEFAULT_T[L].items() if key not in NON_TEXT} for L in LANGS}
    write("icerik-varsayilan.json", json.dumps(out, ensure_ascii=False, indent=0))

def page404():
    t = T["tr"]
    html404 = f"""<!doctype html><html lang="tr"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="robots" content="noindex"><title>Sayfa bulunamadı · Ankara Sağlık Turizmi</title>
<style>body{{margin:0;font-family:system-ui,-apple-system,"Segoe UI",sans-serif;background:#f3f1ec;color:#14251f;display:grid;place-items:center;min-height:100vh;padding:24px;box-sizing:border-box;text-align:center}}
h1{{font-family:Georgia,serif;font-size:34px;margin:0 0 10px}}p{{color:#56615c;margin:0 0 22px}}a{{display:inline-block;margin:4px;background:#1f6b5c;color:#fff;text-decoration:none;font-weight:700;padding:12px 18px;border-radius:12px}}a.s{{background:#fbfaf7;color:#14251f;border:1px solid #d8d1c4}}</style></head>
<body><main><h1>Sayfa bulunamadı · Page not found</h1><p>Aradığınız sayfa taşınmış veya kaldırılmış olabilir. · The page may have moved.</p>
<a href="{e(DATA['base_url'])}">Ankara Sağlık Turizmi</a><a class="s" href="{e(DATA['base_url'])}en/">English</a><a class="s" href="{e(DATA['base_url'])}ar/">العربية</a><a class="s" href="{e(DATA['base_url'])}ru/">Русский</a></main></body></html>
"""
    (REPO / "404.html").write_text(html404, encoding="utf-8")

# ------------------------------------------------------------------ çalıştır
if __name__ == "__main__":
    pages = []
    for L in LANGS:
        rel, out = build_home(L); write(rel + "index.html", out); pages.append((L, rel, "home"))
        for i in range(len(T[L]["guides"])):
            rel, out = build_guide(L, i); write(rel + "index.html", out); pages.append((L, rel, f"g{i}"))
        rel, out = build_privacy(L); write(rel + "index.html", out); pages.append((L, rel, "privacy"))
    assets(); sitemap(pages); robots(); llms(); defaults_json(); page404()
    for L, rel, gid in pages:
        print(f"{L}  {rel or './'}")
    print("+ sitemap.xml robots.txt llms.txt favicon.svg apple-touch-icon.png og.png icerik-varsayilan.json ../404.html")
