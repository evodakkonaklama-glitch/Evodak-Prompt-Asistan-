#!/usr/bin/env python3
"""Ankara Sağlık Turizmi tek panelini üretir.

Kaynaklar (bu klasörde):
  prompt-paneli.html  -> Prompt paneli (ekip için)
  hasta-basvuru.html  -> Tedavi ön başvuru formu (hastalar için)
Çıktı:
  ../ankara-saglik-turizmi.html  (tek dosya; iki görünüm sekmelerle)

Kullanım: python3 paneller/kaynak/birlestir.py
"""
import json, pathlib

HERE = pathlib.Path(__file__).resolve().parent
OUT = HERE.parent / "ankara-saglik-turizmi.html"

prompt_src = (HERE / "prompt-paneli.html").read_text(encoding="utf-8")
hasta_src = (HERE / "hasta-basvuru.html").read_text(encoding="utf-8")
site_src = (HERE / "site-yonetimi.html").read_text(encoding="utf-8")

# Prompt paneli kaynağı doctype'sız yazılmıştır; bağımsız belgeye çevir.
if "<!doctype" not in prompt_src.lower()[:200]:
    i = prompt_src.index('<div class="wrap">')
    prompt_src = ('<!doctype html>\n<html lang="tr">\n<head>\n<meta charset="utf-8">\n'
                  '<meta name="viewport" content="width=device-width, initial-scale=1">\n'
                  '<style>body{margin:0;font-size:14px}img{max-width:100%}[hidden]{display:none!important}</style>\n'
                  + prompt_src[:i] + '</head>\n<body>\n' + prompt_src[i:] + '\n</body>\n</html>\n')

def js_str(s):
    return json.dumps(s, ensure_ascii=False).replace("</", "<\\/")

SHELL = r"""<!doctype html>
<html lang="tr">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<meta name="robots" content="noindex">
<title>Ankara Sağlık Turizmi Paneli</title>
<style>
/* Layout: üstte ince marka + sekme çubuğu, altında seçili görünüm tam yükseklikte */
:root{--bg:#f2efe9;--surface:#fdfcfa;--line:#d9d2c4;--fg:#1c2321;--muted:#5d6661;--accent:#1f6b5c;--accent-ink:#fff;--accent-soft:#e0ece8;
  --body:"Manrope",system-ui,-apple-system,"Segoe UI",sans-serif;color-scheme:light}
@media (prefers-color-scheme:dark){:root:not([data-theme="light"]){--bg:#131816;--surface:#1a201e;--line:#2e3835;--fg:#e6ebe8;--muted:#9ca6a1;--accent:#6cc2ad;--accent-ink:#0f1a17;--accent-soft:#1c3530;color-scheme:dark}}
:root[data-theme="dark"]{--bg:#131816;--surface:#1a201e;--line:#2e3835;--fg:#e6ebe8;--muted:#9ca6a1;--accent:#6cc2ad;--accent-ink:#0f1a17;--accent-soft:#1c3530;color-scheme:dark}
*{box-sizing:border-box}
html,body{height:100%;margin:0}
body{background:var(--bg);color:var(--fg);font-family:var(--body);display:flex;flex-direction:column;
  padding-top:env(safe-area-inset-top,0px)}
[hidden]{display:none!important}
.bar{display:flex;flex-wrap:wrap;gap:8px 12px;align-items:center;justify-content:space-between;
  padding:8px 16px;background:var(--surface);border-bottom:1px solid var(--line);flex:0 0 auto}
.brand{font-weight:700;font-size:15px}
.tabs{display:flex;gap:4px;flex-wrap:wrap}
.tabs button,.share{font:600 14px var(--body);border:1px solid var(--line);background:transparent;color:var(--fg);border-radius:8px;padding:7px 12px;cursor:pointer}
.tabs button[aria-selected="true"]{background:var(--accent);border-color:var(--accent);color:var(--accent-ink)}
.share{color:var(--accent)}
button:focus-visible{outline:2px solid var(--accent);outline-offset:2px}
.views{flex:1 1 auto;position:relative;min-height:0}
.views iframe{position:absolute;inset:0;width:100%;height:100%;border:0;background:var(--bg)}
@media (max-width:560px){.brand{display:none}.bar{padding:8px 12px}.tabs button,.share{padding:6px 10px;font-size:13.5px}}
.toast{position:fixed;left:50%;bottom:calc(18px + env(safe-area-inset-bottom,0px));transform:translateX(-50%);
  background:var(--fg);color:var(--bg);padding:9px 16px;border-radius:8px;font-weight:600;font-size:14px;z-index:9}
</style>
</head>
<body>
<header class="bar" id="bar">
  <div class="brand">Ankara Sağlık Turizmi</div>
  <div class="tabs" role="tablist" aria-label="Paneller">
    <button type="button" role="tab" id="tab-panel" aria-controls="v-panel" aria-selected="true">Prompt paneli</button>
    <button type="button" role="tab" id="tab-basvuru" aria-controls="v-basvuru" aria-selected="false">Tedavi ön başvurusu</button>
    <button type="button" role="tab" id="tab-site" aria-controls="v-site" aria-selected="false">Web sitesi yönetimi</button>
  </div>
  <button type="button" class="share" id="share" title="Hastalara gönderilecek başvuru linkini kopyalar">Hasta linki</button>
</header>
<main class="views">
  <iframe id="v-panel" role="tabpanel" aria-labelledby="tab-panel" title="Prompt paneli" allow="clipboard-write"></iframe>
  <iframe id="v-basvuru" role="tabpanel" aria-labelledby="tab-basvuru" title="Tedavi ön başvurusu" allow="clipboard-write" hidden></iframe>
  <iframe id="v-site" role="tabpanel" aria-labelledby="tab-site" title="Web sitesi yönetimi" hidden></iframe>
</main>
<div class="toast" id="toast" hidden></div>
<script>
const SRC_PANEL = __PANEL__;
const SRC_HASTA = __HASTA__;
const SRC_SITE = __SITE__;
const LANGS = ["tr","en","ar","ru"];

/* Bağlantı biçimleri:
   #basvuru, #basvuru-ar, #basvuru-ru, #basvuru-en  -> yalnızca hasta formu (iç panel gizli)
   #ar, #ru, #en, #tr (eski linkler)                 -> aynısı
   #panel veya boş                                   -> tam panel, sekmeli                     */
function route(){
  const h = decodeURIComponent(location.hash.slice(1)).toLowerCase();
  let m = h.match(/^basvuru(?:-(tr|en|ar|ru))?$/);
  if (!m && LANGS.includes(h)) m = [h, h];
  if (m) return { patient:true, lang: m[1] || "" };
  return { patient:false, view: h === "basvuru-tab" ? "basvuru" : (h === "site-yonetimi" ? "site" : "panel") };
}
let loadedLang = null;
function load(id){
  const f = document.getElementById("v-" + id);
  if (id === "panel" && !f.dataset.ok){ f.srcdoc = SRC_PANEL; f.dataset.ok = "1"; }
  if (id === "site" && !f.dataset.ok){ f.srcdoc = SRC_SITE; f.dataset.ok = "1"; }
  if (id === "basvuru"){
    const r = route(), lang = r.lang || "";
    if (!f.dataset.ok || (r.patient && lang && lang !== loadedLang)){
      f.srcdoc = (lang ? "<script>window.__LANG=" + JSON.stringify(lang) + "<\/script>" : "") + SRC_HASTA;
      f.dataset.ok = "1"; loadedLang = lang;
    }
  }
}
function show(id){
  load(id);
  ["panel","basvuru","site"].forEach(v => {
    document.getElementById("v-" + v).hidden = v !== id;
    document.getElementById("tab-" + v).setAttribute("aria-selected", v === id);
  });
  document.title = {panel:"Ankara Sağlık Turizmi Paneli", basvuru:"Tedavi Ön Başvurusu · Ankara Sağlık Turizmi", site:"Web Sitesi Yönetimi · Ankara Sağlık Turizmi"}[id];
}
function apply(){
  const r = route();
  document.getElementById("bar").hidden = r.patient;
  show(r.patient ? "basvuru" : r.view);
}
document.getElementById("tab-panel").addEventListener("click", () => { history.replaceState(null, "", location.pathname + location.search); show("panel"); });
document.getElementById("tab-basvuru").addEventListener("click", () => { history.replaceState(null, "", "#basvuru-tab"); show("basvuru"); });
document.getElementById("tab-site").addEventListener("click", () => { history.replaceState(null, "", "#site-yonetimi"); show("site"); });
document.querySelector(".tabs").addEventListener("keydown", e => {
  if (e.key !== "ArrowRight" && e.key !== "ArrowLeft") return;
  const order = ["panel","basvuru","site"], cur = order.findIndex(v => document.getElementById("tab-" + v).getAttribute("aria-selected") === "true");
  const next = order[(cur + (e.key === "ArrowRight" ? 1 : order.length - 1)) % order.length];
  document.getElementById("tab-" + next).click(); document.getElementById("tab-" + next).focus();
});
function toast(m){ const t = document.getElementById("toast"); t.textContent = m; t.hidden = false; clearTimeout(toast.h); toast.h = setTimeout(() => t.hidden = true, 2200); }
document.getElementById("share").addEventListener("click", () => {
  const url = location.origin + location.pathname + "#basvuru";
  const ok = () => toast("Hasta linki kopyalandı");
  try { navigator.clipboard.writeText(url).then(ok, () => toast(url)); } catch(e){ toast(url); }
});
window.addEventListener("hashchange", apply);
apply();
</script>
</body>
</html>
"""

out = SHELL.replace("__PANEL__", js_str(prompt_src)).replace("__HASTA__", js_str(hasta_src)).replace("__SITE__", js_str(site_src))
OUT.write_text(out, encoding="utf-8")
print(f"{OUT.name}: {len(out):,} karakter")
