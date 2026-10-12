/* =========================================================
   Bölümler: Ana Panel · 2 İyileştirme · 3 Kayıtlı Promptlar · 4 Kod & Command
   5 Uzun Prompt · 6 AI Platform · Yükle & Aktar · Günlük · Arama · Ayarlar
   ========================================================= */
const pchips=v=>{const ps=platTokens(v);return ps.length?`<span class="pchips">${ps.map(p=>`<span class="pchip">${esc(p)}</span>`).join('')}</span>`:''};
const purposeName=id=>PURPOSE_LABEL()[id]||'';
const tabsHtml=(attr,cur,list)=>`<div class="subtabs" role="tablist">${list.map(([k,l,n])=>`<button type="button" ${attr}="${k}" aria-pressed="${cur===k}">${esc(l)}${n!==undefined?` <small>${num(n)}</small>`:''}</button>`).join('')}</div>`;
const moreBtn=(key,total,shown)=>total>shown?`<div class="more"><button class="btn" type="button" data-more="${key}">${esc(t('Daha fazla göster','Show more'))} (${num(total-shown)})</button></div>`:'';
const emptyBox=(b,s)=>`<div class="empty"><b>${esc(b)}</b>${esc(s||'')}</div>`;
function textCard(title,text,col,id,field){if(!String(text||'').trim())return '';return `<div class="card"><header><h3>${esc(title)}</h3><button class="btn sm" type="button" data-cpf="${col}|${esc(id)}|${field}">${esc(varsOf(text).length?t('Değişkenleri doldur ve kopyala','Fill variables and copy'):t('Kopyala','Copy'))}</button></header><pre class="pre">${highlightVars(text)}</pre></div>`}
function kvOf(col,d,skip){skip=new Set(skip||[]);return `<dl class="kv">${COLDEF[col].fields.filter(f=>!skip.has(f.k)).map(f=>{let v=f.virt?f.virt(d):d[f.k];if(Array.isArray(v))v=v.map(x=>f.lab?f.lab(x):x).join(', ');else if(f.lab)v=f.lab(v);if(v===undefined||v===null||v==='')return '';const s=String(v);return `<dt>${esc(FL(f))}</dt><dd>${/^https?:\/\//.test(s)?`<a href="${esc(s)}" target="_blank" rel="noopener">${esc(s)}</a>`:esc(s)}</dd>`}).join('')}<dt>${esc(t('Ekleyen','Added by'))}</dt><dd>${esc(who(d.ekleyen))}${d.eklenme?' · '+fmtDate(d.eklenme):''}</dd></dl>`}
$('#drawerHost').addEventListener('click',e=>{const c=e.target.closest('[data-cpf]');if(c){const [col,id,f]=c.dataset.cpf.split('|');const d=DATA[col].get(id);if(d)copyWithVars(String(d[f]||''))}});
function gridTable(rows,head){if(!rows||!rows.length)return emptyBox(t('Boş','Empty'));const w=Math.max(...rows.map(r=>r.length),head?head.length:0);
  return `<div class="dtw"><table class="dt">${head?`<thead><tr>${head.map(h=>`<th>${esc(h)}</th>`).join('')}</tr></thead>`:''}<tbody>${rows.map(r=>r.length===1&&w>1?`<tr><td colspan="${w}" style="background:var(--soft);font-weight:600"><div class="cl" style="max-height:none">${esc(r[0])}</div></td></tr>`:`<tr>${Array.from({length:w},(_,i)=>`<td><div class="cl" style="max-height:none">${esc(r[i]??'')}</div></td>`).join('')}</tr>`).join('')}</tbody></table></div>`}
function exportWord(name,blocks){const html=`<html><head><meta charset="utf-8"><title>${esc(name)}</title></head><body style="font-family:Calibri,Arial">${blocks.map(b=>`<h2>${esc(b.h)}</h2>${b.meta?`<p style="color:#666">${esc(b.meta)}</p>`:''}<pre style="white-space:pre-wrap;font-family:Calibri,Arial">${esc(b.text)}</pre>`).join('<hr>')}</body></html>`;saveBlob(`${name} - ${stamp()}.doc`,new Blob(['﻿'+html],{type:'application/msword'}))}

/* ===== Ana Panel ===== */
RENDER.ana=()=>{
  const v=$('#v-ana');
  const favs=[];['gecmis','uzun','plat'].forEach(c=>DATA[c].forEach((d,i)=>{if(d.favori)favs.push([c,i,d])}));DATA.kod.forEach((d,i)=>{if(/Favori/.test(d.durum||''))favs.push(['kod',i,d])});
  const recent=[];['kod','uzun','gecmis','plat','kodref'].forEach(c=>DATA[c].forEach((d,i)=>{if(d.eklenme&&d.ekleyen&&!/kurulum/i.test(d.ekleyen))recent.push([c,i,d])}));recent.sort((a,b)=>String(b[2].eklenme).localeCompare(String(a[2].eklenme)));
  const tiles=[['form',1,t('Ön Prompt Hazırlama Formu','Pre-Prompt Form'),S.recordId?t('Kayıtlı form açık','Saved form open'):(S.purpose?t('Taslak: ','Draft: ')+(isEN()?P(S.purpose).en:P(S.purpose).tr):t('Yeni prompt hazırla','Build a new prompt')),'→'],
    ['iyilestir',2,t('Prompt İyileştirme','Prompt Improvement'),t('analiz · puan · yeniden yazım','analyse · score · rewrite'),'→'],
    ['gecmis',3,t('Kayıtlı Promptlar','Saved Prompts'),t('kendi promptlarınız','your own prompts'),DATA.gecmis.size],
    ['kod',4,t('Kod & Command Prompt','Code & Command Prompt'),t('komut · şablon · referans','commands · templates · reference'),DATA.kod.size],
    ['uzun',5,t('Uzun Prompt','Long Prompt'),t('hazır uzun promptlar','ready-made long prompts'),DATA.uzun.size],
    ['platform',6,t('AI Platform','AI Platform'),t('platform · model karşılaştırma','platforms · model comparison'),DATA.plat.size],
    ['yukle','',t('Yükle & Aktar','Upload & Import'),'Word · Excel · PDF · '+t('görsel','image'),'→'],['gunluk','',t('Değişiklik Günlüğü','Change Log'),t('tüm düzeltmeler kayıtlı','every change is logged'),LOG.length]];
  const conn=!CFG.token?`<div class="note" style="margin-bottom:14px"><span>${esc(t('Panel şu an salt okunur. Kayıt eklemek ve düzeltmek için GitHub hesabınızla bağlanın (bir kez, her cihazda).','The panel is read-only. Connect your GitHub account to add and edit records (once per device).'))}</span><button class="btn sm primary" type="button" data-view="ayar">${esc(t('Bağlan','Connect'))}</button></div>`:'';
  v.innerHTML=`<div class="vhead"><div><h2>Evodak Prompt Asistanı</h2><p>${esc(t('Prompt, komut ve platformlarınızı topladığınız, ürettiğiniz ve ekiple paylaştığınız kontrol paneli. Veriler GitHub deposunda tek yerde durur: bilgisayarda, telefonda ve Claude’da aynı veri görünür; her düzeltme Değişiklik Günlüğü’ne kaydedilir.','The control panel where you collect, create and share prompts, commands and platforms with your team. Data lives in one place, a GitHub repository: the same data appears on desktop, phone and in Claude, and every change is logged.'))}</p></div><div class="acts"><button class="btn primary" type="button" data-view="form">${esc(t('Yeni prompt hazırla','Build a new prompt'))}</button><button class="btn" type="button" data-view="yukle">${esc(t('Dosya yükle','Upload file'))}</button></div></div>
  ${conn}
  <div class="dash">${tiles.map(([id,n,l,s,c])=>`<button class="tile" type="button" data-view="${id}"><span class="n">${typeof c==='number'?num(c):c}</span><span class="l">${n?`<small>${n}</small> `:''}${esc(l)}</span><span class="s">${esc(s)}</span></button>`).join('')}</div>
  <div class="cols2">
    <div class="card"><header><h3>${esc(t('Favoriler','Favourites'))}</h3><span class="hint">★</span></header><div class="cbody"><div class="mini">${loadingOr('kod',favs.length?favs.slice(0,12).map(([c,i,d])=>`<div class="r" data-open="${c}|${esc(i)}"><span class="w">${esc(COLDEF[c].title(d))}</span><small>${esc(COLDEF[c].name())}</small></div>`).join(''):`<p class="hint">${esc(t('Henüz favori yok. Bir kaydı açıp ★ simgesine basın (Kod & Command’da Durum = Favori ★).','No favourites yet. Open a record and press ★ (in Code & Command set Status = Favourite ★).'))}</p>`)}</div></div></div>
    <div class="card"><header><h3>${esc(t('Panelden son eklenenler','Recently added in the panel'))}</h3></header><div class="cbody"><div class="mini">${recent.length?recent.slice(0,8).map(([c,i,d])=>`<div class="r" data-open="${c}|${esc(i)}"><span class="w">${esc(COLDEF[c].title(d))}</span><small>${esc(COLDEF[c].name())} · ${esc(d.ekleyen)} · ${fmtDay(d.eklenme)}</small></div>`).join(''):`<p class="hint">${esc(t('Henüz panelden kayıt eklenmedi.','Nothing added from the panel yet.'))}</p>`}</div></div></div>
  </div>
  <div class="card"><header><h3>${esc(t('Son değişiklikler','Latest changes'))}</h3><button class="btn sm" type="button" data-view="gunluk">${esc(t('Tümü','All'))}</button></header><div class="cbody"><div class="hist">${LOG.slice(0,6).map(l=>logItem(l)).join('')||`<p class="hint">${esc(t('Henüz değişiklik yok.','No changes yet.'))}</p>`}</div></div></div>`;
};

/* ===== 4 · Kod & Command Prompt ===== */
const KTABS=()=>[['lib',t('Prompt Kütüphanesi','Prompt Library'),DATA.kod.size],['kat',t('Kategori Haritası','Category Map')],['ref',t('Referans Bilgi','Reference Info'),DATA.kodref.size],['kil',t('Kılavuz','Guide')],['bas',t('Başlık Eşleme','Header Mapping')],['eski',t('Eski Kategori Eşleme','Old Category Mapping')],['rap',t('Aktarım Raporu','Import Report')],['lis',t('Listeler','Lists')]];
const anaList=()=>{const m=new Map();(KMETA().kategoriler||[]).forEach(k=>{if(!m.has(k.anaTr))m.set(k.anaTr,k)});return [...m.values()]};
function kodRows(){const s=vstate('kod');const f=s.f;
  return [...DATA.kod.entries()].filter(([,d])=>(!f.ana||d.anaKat===f.ana)&&(!f.alt||d.altKat===f.alt)&&(!f.tur||d.tur===f.tur)&&(!f.plat||platTokens(d.platform).includes(f.plat))&&(!f.durum||d.durum===f.durum)&&(!f.sektor||d.sektor===f.sektor)&&(!f.seviye||d.seviye===f.seviye)&&(!f.cmd||d.kod)&&(f.durum==='Arşiv'||f.arsiv||d.durum!=='Arşiv')&&matches(d,s.q,['id','kod','alias','baslikTr','baslikEn','aciklamaTr','aciklamaEn','metinTr','metinEn','etiket','altKat','not']))}
function refRows(){const s=vstate('kodref');const f=s.f;return [...DATA.kodref.entries()].filter(([,d])=>(!f.tur||d.refTur===f.tur)&&(!f.ana||d.anaKat===f.ana)&&(!f.konu||d.konu===f.konu)&&matches(d,s.q,['id','konu','grup','kalemTr','kalemEn','aciklamaTr','aciklamaEn','arac','ipucu']))}
function kodCard([id,d]){const x=xlinks();const u=x.k2u[id];
  return `<div class="item" data-open="kod|${esc(id)}"><div class="main"><div class="t1"><span class="hint mono">${esc(id)}</span>${d.kod?`<code>${esc(d.kod)}</code>`:''}<b>${esc(pick(d,'baslikTr','baslikEn'))}</b>${turBadge(d.tur)}${durumBadge(d.durum)}${u?`<a class="badge g lnk" href="#" data-open="uzun|${esc(u)}" data-stop>↔ ${esc(t('Uzun Prompt','Long Prompt'))}</a>`:''}</div><div class="desc">${esc(pick(d,'aciklamaTr','aciklamaEn')||pick(d,'metinTr','metinEn'))}</div><div class="t1"><span class="badge solid">${esc(d.altKat||'')}</span>${pchips(d.platform)}${d.sektor?`<span class="hint">${esc(d.sektor)}</span>`:''}${d.puan?`<span class="hint">${'★'.repeat(Number(d.puan)||0)}</span>`:''}</div></div>
  <div class="side" data-stop><button class="btn sm" type="button" data-kcopy="${esc(id)}">${esc(t('Kopyala','Copy'))}</button>${isCmd(d)?`<button class="btn sm" type="button" data-kform="${esc(id)}">${esc(t('Forma ekle','Add to form'))}</button>`:''}</div></div>`}
function kodCopyText(d){return d.kod&&isCmd(d)?d.kod:(isEN()?(d.metinEn||d.metinTr):(d.metinTr||d.metinEn))||d.kod||''}
RENDER.kod=()=>{
  const v=$('#v-kod');const s=vstate('kod',{tab:'lib'});
  keepFocus(v,()=>{
    const head=`<div class="vhead"><div><h2>${esc(t('Evodak Kod & Command Prompt','Evodak Code & Command Prompt'))}</h2><p>${esc(t('Kaynak: 03- Evodak Kod & Command Promptlar – Rev 3. Dosyadaki sayfalar burada sekme; sütunlar aynı. Kırmızı başlık zorunlu, yeşil başlık otomatik hesaplanır. Kayıt silmek yerine Durum = Arşiv yapın.','Source: 03- Evodak Kod & Command Promptlar – Rev 3. Each sheet is a tab here with the same columns. Red headers are required, green ones are calculated. Set Status = Archive instead of deleting.'))}</p></div>
    <div class="acts">${canWrite()&&(s.tab==='lib'||s.tab==='ref')?`<button class="btn primary" type="button" data-k-new>+ ${esc(s.tab==='ref'?t('Yeni referans','New reference'):t('Yeni prompt / komut','New prompt / command'))}</button>`:''}<button class="btn" type="button" data-k-imp>${esc(t('Dosyadan ekle','Import from file'))}</button><button class="btn" type="button" data-k-exp>${esc(t('Excel’e aktar','Export to Excel'))}</button></div></div>
    ${tabsHtml('data-ktab',s.tab,KTABS())}`;
    let body='';
    if(s.tab==='lib'){
      const rows=kodRows().sort((a,b)=>a[0].localeCompare(b[0]));const f=s.f;
      const alts=(KMETA().kategoriler||[]).filter(k=>!f.ana||k.anaTr===f.ana);
      const plats=[...new Set([...DATA.kod.values()].flatMap(d=>platTokens(d.platform)))].sort((a,b)=>a.localeCompare(b,'tr'));
      const all=!!f.all;const cols=COLDEF.kod.fields.filter(x=>all||x.tbl);
      body=`<div class="fbar"><input type="search" data-q placeholder="${esc(t('ID, kod, başlık, açıklama veya metinde ara','Search ID, code, title, description or text'))}" value="${esc(s.q)}">
        ${selectHtml('ana',t('Ana Kategori','Main category'),anaList().map(k=>[k.anaTr,k.anaKod+' · '+(isEN()?k.anaEn:k.anaTr)]),f.ana)}${selectHtml('alt',t('Alt Kategori','Sub-category'),alts.map(k=>[k.etiket,k.altKod+' · '+(isEN()?k.altEn:k.altTr)]),f.alt)}
        ${selectHtml('tur',t('Tür','Type'),listOf('Tür (TR)').map(x=>[x,isEN()?turEnOf(x)||x:x]),f.tur)}${selectHtml('plat','AI / Platform',plats,f.plat)}${selectHtml('durum',t('Durum','Status'),listOf('Durum').map(x=>[x,isEN()?DURUM_EN[x]||x:x]),f.durum)}${selectHtml('sektor',t('Sektör','Sector'),listOf('Sektör / Alan'),f.sektor)}${selectHtml('seviye',t('Seviye','Level'),listOf('Seviye'),f.seviye)}
        <label class="tg"><input type="checkbox" data-tgl="cmd" ${f.cmd?'checked':''}> ${esc(t('Yalnız kodlu','With code only'))}</label><label class="tg"><input type="checkbox" data-tgl="arsiv" ${f.arsiv?'checked':''}> ${esc(t('Arşivi göster','Show archive'))}</label>
        ${viewToggle('kod')}${vstate('kod').view==='table'?`<label class="tg"><input type="checkbox" data-tgl="all" ${all?'checked':''}> ${esc(t('Tüm sütunlar','All columns'))}</label>`:''}<span class="cnt">${num(rows.length)} / ${num(DATA.kod.size)}</span></div>`+
        loadingOr('kod',!rows.length?emptyBox(t('Sonuç yok','No results'),t('Filtreleri temizleyin veya yeni kayıt ekleyin.','Clear the filters or add a record.')):vstate('kod').view==='table'?dataTable('kod','kod',rows,cols):`<div class="list">${rows.slice(0,s.limit).map(kodCard).join('')}</div>${moreBtn('kod',rows.length,Math.min(rows.length,s.limit))}`);
    }else if(s.tab==='kat'){
      const ks=KMETA().kategoriler||[];const ck={},cr={};DATA.kod.forEach(d=>{ck[d.altKat]=(ck[d.altKat]||0)+1});DATA.kodref.forEach(d=>{cr[d.altKat]=(cr[d.altKat]||0)+1});
      let last='';body=`<p class="hint">${esc(t('20 ana kategori ve alt kategoriler. Sayılar canlı hesaplanır; satıra tıklayınca o alt kategorinin kayıtları açılır.','20 main categories and their sub-categories. Counts are live; click a row to see its records.'))}</p><div class="dtw"><table class="dt"><thead><tr><th>${esc(t('Ana Kod','Main code'))}</th><th>${esc(t('Ana Kategori','Main category'))}</th><th>${esc(t('Alt Kod','Sub code'))}</th><th>${esc(t('Alt Kategori','Sub-category'))}</th><th class="calc">${esc(t('Prompt sayısı','Prompts'))}</th><th class="calc">${esc(t('Referans sayısı','References'))}</th></tr></thead><tbody>${ks.map(k=>{const first=k.anaKod!==last;last=k.anaKod;return `<tr data-katgo="${esc(k.etiket)}" style="cursor:pointer"><td class="id">${first?esc(k.anaKod):''}</td><td>${first?`<b>${esc(isEN()?k.anaEn:k.anaTr)}</b>`:''}</td><td class="mono">${esc(k.altKod)}</td><td>${esc(isEN()?k.altEn:k.altTr)}</td><td class="num">${ck[k.etiket]||''}</td><td class="num">${cr[k.etiket]||''}</td></tr>`}).join('')}</tbody></table></div>`;
    }else if(s.tab==='ref'){
      const r=vstate('kodref');const rows=refRows().sort((a,b)=>a[0].localeCompare(b[0]));
      body=`<div class="fbar"><input type="search" data-q placeholder="${esc(t('Konu, kalem, açıklama veya araçta ara','Search topic, item, description or tool'))}" value="${esc(r.q)}">${selectHtml('rtur',t('Referans Türü','Reference type'),listOf('Referans Türü'),r.f.tur)}${selectHtml('rana',t('Ana Kategori','Main category'),anaList().map(k=>[k.anaTr,k.anaKod+' · '+(isEN()?k.anaEn:k.anaTr)]),r.f.ana)}${selectHtml('rkonu',t('Konu','Topic'),distinct('kodref','konu'),r.f.konu)}${viewToggle('kodref')}<span class="cnt">${num(rows.length)} / ${num(DATA.kodref.size)}</span></div>`+
        loadingOr('kodref',!rows.length?emptyBox(t('Sonuç yok','No results')):vstate('kodref').view==='table'?dataTable('kodref','kodref',rows,COLDEF.kodref.fields.filter(x=>x.tbl)):`<div class="list">${rows.slice(0,r.limit).map(([id,d])=>`<div class="item" data-open="kodref|${esc(id)}"><div class="main"><div class="t1"><span class="hint mono">${esc(id)}</span><b>${esc(pick(d,'kalemTr','kalemEn'))}</b><span class="badge">${esc(d.refTur)}</span></div><div class="desc">${esc(pick(d,'aciklamaTr','aciklamaEn'))}</div><div class="t1"><span class="badge solid">${esc(d.konu||'')}</span>${d.arac?`<span class="hint">${esc(d.arac)}</span>`:''}</div></div></div>`).join('')}</div>${moreBtn('kodref',rows.length,Math.min(rows.length,r.limit))}`);
    }else if(s.tab==='kil'){body=`<p class="hint">${esc(t('Dosyadaki “0-Kılavuz” sayfası (salt okunur).','The “0-Kılavuz” sheet from the file (read-only).'))}</p>`+gridTable(KMETA().kilavuz)}
    else if(s.tab==='bas'){body=`<p class="hint">${esc(t('Eski dosyalardaki sütun başlıklarının yeni standart formattaki karşılıkları (salt okunur).','How old column headers map to the new standard format (read-only).'))}</p>`+gridTable(KMETA().baslikEsleme,[t('Eski başlık(lar)','Old header(s)'),t('Kaynak','Source'),t('Yeni sütun','New column'),t('Not','Note')])}
    else if(s.tab==='eski'){body=`<p class="hint">${esc(t('Eski kategori adlarının yeni alt kategorilere eşlemesi (salt okunur).','Old category names mapped to new sub-categories (read-only).'))}</p>`+gridTable(KMETA().eskiKategori,[t('Eski kategori','Old category'),t('Alt kod','Sub code'),t('Yeni alt kategori','New sub-category'),t('Yeni ana kategori','New main category'),t('Not','Note')])}
    else if(s.tab==='rap'){body=`<p class="hint">${esc(KMETA().not||'')}</p>`+gridTable(KMETA().aktarimRaporu)}
    else if(s.tab==='lis'){const L_=KMETA().listeler||{};body=`<p class="hint">${esc(t('Açılır listelerin kaynağı (dosyadaki “6-Listeler”). Her satır bir seçenek. Değiştirip “Kaydet”e basın; değişiklik günlüğe yazılır.','Source of the drop-down lists (“6-Listeler” in the file). One option per line. Edit and press “Save”; the change is logged.'))}</p><div class="gridc">${Object.entries(L_).map(([k,a])=>`<div class="card"><header><h3>${esc(k)}</h3><span class="hint">${a.length}</span></header><div class="cbody"><textarea data-listed="${esc(k)}" style="min-height:180px;width:100%;font-family:var(--f-mono);font-size:12.5px" ${canWrite()?'':'disabled'}>${esc(a.join('\n'))}</textarea>${canWrite()?`<button class="btn sm" type="button" data-listsave="${esc(k)}">${esc(t('Kaydet','Save'))}</button>`:''}</div></div>`).join('')}</div>`}
    v.innerHTML=head+body;
  });
  v.oninput=e=>{const x=e.target;if(x.dataset.q!==undefined){const k=vstate('kod').tab==='ref'?'kodref':'kod';vstate(k).q=x.value;vstate(k).limit=80;deb(RENDER.kod)}};
  v.onchange=e=>{const x=e.target;const s2=vstate('kod'),r=vstate('kodref');
    if(x.dataset.flt){const k=x.dataset.flt;if(k[0]==='r'&&['rtur','rana','rkonu'].includes(k)){r.f[k.slice(1)]=x.value;persistVS('kodref')}else{s2.f[k]=x.value;if(k==='ana')s2.f.alt='';s2.limit=80;persistVS('kod')}RENDER.kod()}
    if(x.dataset.tgl){s2.f[x.dataset.tgl]=x.checked;persistVS('kod');RENDER.kod()}};
};
$('#v-kod').addEventListener('click',async e=>{
  const s=vstate('kod');
  const tb=e.target.closest('[data-ktab]');if(tb){s.tab=tb.dataset.ktab;persistVS('kod');RENDER.kod();return}
  if(e.target.closest('[data-k-new]')){if(s.tab==='ref')newRecord('kodref',{durum:'Yeni / İşlenmedi',refTur:'Rehber / Bilgi Notu'});else newRecord('kod',{tur:'Slash Komut',platform:'Claude',sektor:'Genel',dil:'TR',seviye:'Başlangıç'});return}
  if(e.target.closest('[data-k-imp]')){YK.target='kod';go('yukle');return}
  if(e.target.closest('[data-k-exp]')){exportSheets('03- Evodak Kod & Command Promptlar',[{name:'1-Prompt Kütüphanesi',rows:toRows('kod',s.tab==='lib'?kodRows().map(r=>r[1]):[...DATA.kod.values()])},{name:'2-Referans Bilgi',rows:toRows('kodref',[...DATA.kodref.values()])},{name:'Kategori Haritası',rows:(KMETA().kategoriler||[]).map(k=>({'Ana Kod':k.anaKod,'Ana Kategori (TR)':k.anaTr,'Main Category (EN)':k.anaEn,'Alt Kod':k.altKod,'Alt Kategori (TR)':k.altTr,'Sub-category (EN)':k.altEn}))}]);return}
  const kg=e.target.closest('[data-katgo]');if(kg){const k=altInfo(kg.dataset.katgo);s.f.ana=k?k.anaTr:'';s.f.alt=kg.dataset.katgo;s.tab='lib';persistVS('kod');RENDER.kod();return}
  const c=e.target.closest('[data-kcopy]');if(c){copyWithVars(kodCopyText(DATA.kod.get(c.dataset.kcopy)));return}
  const f=e.target.closest('[data-kform]');if(f){FORM.addCmd(DATA.kod.get(f.dataset.kform).kod);return}
  const ls=e.target.closest('[data-listsave]');if(ls){const k=ls.dataset.listsave;const ta=$(`[data-listed="${CSS.escape(k)}"]`,$('#v-kod'));const vals=ta.value.split('\n').map(x=>x.trim()).filter(Boolean);
    try{await saveMeta('kodmeta',o=>{o.listeler=o.listeler||{};o.listeler[k]=vals},t('Liste güncellendi: ','List updated: ')+k);toast(t('Liste kaydedildi','List saved'))}catch(err){if(err.message!=='no-write')toast(err.message,4500)}}
});
DETAIL.kod=(id,d)=>{const x=xlinks();const u=x.k2u[id]&&DATA.uzun.get(x.k2u[id]);const a=altInfo(d.altKat);
  return `<div style="display:flex;gap:8px;flex-wrap:wrap;align-items:center">${d.kod?`<code style="font-size:18px;color:var(--accent)">${esc(d.kod)}</code>`:''}${turBadge(d.tur)}${durumBadge(d.durum)}<span class="badge solid">${esc(a?(isEN()?a.altKod+' · '+a.altEn:d.altKat):d.altKat||'')}</span><span class="${/⚠/.test(kodKontrol(d))?'tagwarn':'hint'}">${esc(kodKontrol(d))}</span></div>
  ${u?`<div class="note"><span>${esc(t('Bu kayıt Uzun Prompt bölümünde de var:','This record also exists in Long Prompt:'))} <b>${esc(pick(u,'baslikTr','baslikEn'))}</b></span><button class="btn sm" type="button" data-open="uzun|${esc(x.k2u[id])}">${esc(t('Aç','Open'))}</button></div>`:''}
  ${isEN()?textCard('Full Prompt Text (EN)',d.metinEn,'kod',id,'metinEn')+textCard(t('Tam Prompt Metni (TR)','Full Prompt Text (TR)'),d.metinTr,'kod',id,'metinTr'):textCard('Tam Prompt Metni (TR)',d.metinTr,'kod',id,'metinTr')+textCard('Full Prompt Text (EN)',d.metinEn,'kod',id,'metinEn')}
  ${kvOf('kod',d,['metinTr','metinEn','_kontrol'])}`};
DACTS.kod=(id,d)=>`<button class="btn" type="button" data-kcopy2="${esc(id)}">${esc(t('Kopyala','Copy'))}</button>${isCmd(d)?`<button class="btn" type="button" data-kform2="${esc(id)}">${esc(t('Forma ekle','Add to form'))}</button>`:''}${canWrite()?`${d.durum!=='Arşiv'?`<button class="btn" type="button" data-karch="${esc(id)}">${esc(t('Arşive al','Archive'))}</button>`:''}<button class="btn" type="button" data-kver="${esc(id)}">${esc(t('Yeni sürüm','New version'))}</button>`:''}`;
DACTS.kodref=()=>'';
$('#drawerHost').addEventListener('click',async e=>{
  const c=e.target.closest('[data-kcopy2]');if(c){copyWithVars(kodCopyText(DATA.kod.get(c.dataset.kcopy2)));return}
  const f=e.target.closest('[data-kform2]');if(f){closeDrawer();FORM.addCmd(DATA.kod.get(f.dataset.kform2).kod);return}
  const a=e.target.closest('[data-karch]');if(a){try{await saveRecord('kod',a.dataset.karch,{durum:'Arşiv'},{note:t('Arşive alındı','Archived')});toast(t('Arşive alındı','Archived'))}catch(err){}return}
  const v=e.target.closest('[data-kver]');if(v){const id=v.dataset.kver;const d=DATA.kod.get(id);
    confirmBox(t('Yeni sürüm oluştur','Create a new version'),t(`${id} Arşiv durumuna alınır ve kopyası yeni ID ile düzenlemeye açılır.`,`${id} is archived and a copy opens for editing under a new ID.`),t('Devam','Continue'),async()=>{
      await saveRecord('kod',id,{durum:'Arşiv'},{note:t('Yeni sürüm için arşivlendi','Archived for a new version')});
      const preset=clone(d);['id','eklenme','ekleyen','guncelleme','guncelleyen','tarih'].forEach(k=>delete preset[k]);preset.durum='Düzenlendi';preset.not=`${id}'in yeni sürümü`+(d.not?' · '+d.not:'');
      setTimeout(()=>newRecord('kod',preset),50)});return}
});

/* ===== 5 · Uzun Prompt ===== */
function uzunRows(){const s=vstate('uzun');const f=s.f;const hide=f.muk!==false;
  return [...DATA.uzun.entries()].filter(([,d])=>(!hide||!d.mukerrer)&&(!f.kat||d.katTr===f.kat)&&(!f.plat||platTokens(d.platform).includes(f.plat))&&(!f.sektor||d.sektor===f.sektor)&&(!f.fav||d.favori)&&matches(d,s.q,['baslikTr','baslikEn','metinTr','metinEn','katTr','katEn','sektor','not']))}
function linkGuide(s){return esc(s).replace(/\b([SGVC][1-5])\b/g,(m,c)=>{const r=[...DATA.uzun.entries()].find(([,d])=>String(d.baslikTr||'').startsWith(c+'.'));return r?`<a href="#" data-open="uzun|${r[0]}">${c}</a>`:m})}
RENDER.uzun=()=>{
  const v=$('#v-uzun');const s=vstate('uzun',{tab:'list'});
  keepFocus(v,()=>{
    const muk=[...DATA.uzun.values()].filter(d=>d.mukerrer).length;
    const head=`<div class="vhead"><div><h2>${esc(t('Evodak Uzun Prompt','Evodak Long Prompt'))}</h2><p>${esc(t('Kaynak: 02- Evodak Uzun Promptlar Rev 2. Dosyadaki sayfalar burada sekme; sütunlar aynı. Köşeli parantezli alanlar [Sorunu Girin] kopyalamadan önce doldurulabilir.','Source: 02- Evodak Uzun Promptlar Rev 2. Each sheet is a tab with the same columns. Bracketed fields [Enter Problem] can be filled before copying.'))}</p></div>
    <div class="acts">${canWrite()&&s.tab!=='gun'?`<button class="btn primary" type="button" data-u-new>+ ${esc(s.tab==='reh'?t('Rehber bölümü','Guide section'):t('Yeni prompt','New prompt'))}</button>`:''}<button class="btn" type="button" data-u-imp>${esc(t('Dosyadan ekle','Import from file'))}</button><button class="btn" type="button" data-u-exp>${esc(t('Excel’e aktar','Export to Excel'))}</button></div></div>
    ${tabsHtml('data-utab',s.tab,[['list',t('Uzun Promptlar','Long Prompts'),DATA.uzun.size],['reh',t('Uygulama Rehberi','Application Guide'),DATA.rehber.size],['gun',t('Değişiklik Günlüğü (dosya)','Change Log (file)'),(META.uzunmeta.gunluk||[]).length]])}`;
    let body='';
    if(s.tab==='reh'){const rs=[...DATA.rehber.entries()].sort((a,b)=>(a[1].sira||0)-(b[1].sira||0));
      body=loadingOr('rehber',rs.length?`<div class="list">${rs.map(([id,d])=>`<div class="item" data-open="rehber|${id}"><div class="main"><div class="t1"><b>${esc(d.bolum)}</b></div><div style="white-space:pre-wrap;font-size:13.5px">${linkGuide(d.icerik)}</div></div></div>`).join('')}</div>`:emptyBox(t('Rehber boş','Guide is empty')))}
    else if(s.tab==='gun'){body=`<p class="hint">${esc(t('Dosyadaki “Değişiklik Günlüğü” sayfası. Paneldeki değişiklikler ayrıca ana Değişiklik Günlüğü’ne kaydedilir.','The “Değişiklik Günlüğü” sheet from the file. Panel changes are also logged in the main Change Log.'))}</p>`+gridTable((META.uzunmeta.gunluk||[]).map(g=>[g.konu,g.aciklama]),[t('Konu','Topic'),t('Açıklama','Description')])}
    else{
      const rows=uzunRows().sort((a,b)=>(a[1].no||0)-(b[1].no||0));const f=s.f;const x=xlinks();
      const plats=[...new Set([...DATA.uzun.values()].flatMap(d=>platTokens(d.platform)))].sort((a,b)=>a.localeCompare(b,'tr'));
      body=`<div class="fbar"><input type="search" data-q placeholder="${esc(t('Başlık veya prompt metninde ara (TR ve EN)','Search title or prompt text (TR and EN)'))}" value="${esc(s.q)}">
        ${selectHtml('plat','AI Platform',plats,f.plat)}${selectHtml('sektor',t('Sektör','Sector'),distinct('uzun','sektor'),f.sektor)}${selectHtml('kat',t('Kategori','Category'),distinct('uzun','katTr'),f.kat)}
        <label class="tg"><input type="checkbox" data-tgl="muk" ${f.muk!==false?'checked':''}> ${esc(t('Mükerrerleri gizle','Hide duplicates'))} (${muk})</label><label class="tg"><input type="checkbox" data-tgl="fav" ${f.fav?'checked':''}> ${esc(t('Favoriler','Favourites'))}</label>
        ${viewToggle('uzun')}<span class="cnt">${num(rows.length)} / ${num(DATA.uzun.size)}</span></div>`+
        loadingOr('uzun',!rows.length?emptyBox(t('Sonuç yok','No results')):vstate('uzun').view==='table'?dataTable('uzun','uzun',rows,COLDEF.uzun.fields.filter(z=>z.tbl)):`<div class="list">${rows.slice(0,s.limit).map(([id,d])=>`<div class="item" data-open="uzun|${id}"><div class="main"><div class="t1"><span class="hint mono">#${esc(d.no)}</span><b>${esc(pick(d,'baslikTr','baslikEn'))}</b>${d.mukerrer?`<span class="badge ai">${esc(t('mükerrer → #','duplicate → #'))}${esc(d.asilNo)}</span>`:''}${x.u2k[id]?`<a class="badge b lnk" href="#" data-open="kod|${esc(x.u2k[id][0])}" data-stop>↔ ${esc(x.u2k[id][0])}</a>`:''}</div><div class="desc">${esc(pick(d,'metinTr','metinEn'))}</div><div class="t1"><span class="badge solid">${esc(isEN()?d.katEn||d.katTr:d.katTr||d.katEn)}</span><span class="hint">${esc(d.sektor||'')}</span>${pchips(d.platform)}</div></div>
          <div class="side" data-stop><button class="btn sm" type="button" data-ucopy="${id}">${esc(t('Kopyala','Copy'))}</button><button class="iconbtn star ${d.favori?'on':''}" type="button" data-fav="uzun|${id}">★</button></div></div>`).join('')}</div>${moreBtn('uzun',rows.length,Math.min(rows.length,s.limit))}`);
    }
    v.innerHTML=head+body;
  });
  bindList(v,'uzun',RENDER.uzun);
};
$('#v-uzun').addEventListener('click',e=>{
  const s=vstate('uzun');
  const tb=e.target.closest('[data-utab]');if(tb){s.tab=tb.dataset.utab;persistVS('uzun');RENDER.uzun();return}
  if(e.target.closest('[data-u-new]')){if(s.tab==='reh')newRecord('rehber',{sira:DATA.rehber.size+1});else newRecord('uzun',{platform:ALL,sektor:'Genel'});return}
  if(e.target.closest('[data-u-imp]')){YK.target='uzun';go('yukle');return}
  if(e.target.closest('[data-u-exp]')){exportSheets('02- Evodak Uzun Promptlar',[{name:'Uzun Promptlar',rows:toRows('uzun',[...DATA.uzun.values()].sort((a,b)=>(a.no||0)-(b.no||0)))},{name:'Uygulama Rehberi',rows:[...DATA.rehber.values()].sort((a,b)=>(a.sira||0)-(b.sira||0)).map(d=>({'BÖLÜM':d.bolum,'İÇERİK':d.icerik}))},{name:'Değişiklik Günlüğü',rows:(META.uzunmeta.gunluk||[]).map(g=>({Konu:g.konu,'Açıklama':g.aciklama}))}]);return}
  const c=e.target.closest('[data-ucopy]');if(c){const d=DATA.uzun.get(c.dataset.ucopy);copyWithVars(pick(d,'metinTr','metinEn'))}
});
DETAIL.uzun=(id,d)=>{const x=xlinks();const asil=d.mukerrer?[...DATA.uzun.entries()].find(([,z])=>z.no===d.asilNo):null;
  return `<div style="display:flex;gap:6px;flex-wrap:wrap"><span class="badge">#${esc(d.no)}</span>${d.katTr?`<span class="badge solid">${esc(d.katTr)}</span>`:''}${d.katEn?`<span class="badge">${esc(d.katEn)}</span>`:''}${pchips(d.platform)}</div>
  ${asil?`<div class="note"><span>${esc(t(`Bu satır #${d.asilNo} ile aynı (mükerrer).`,`This row duplicates #${d.asilNo}.`))}</span><button class="btn sm" type="button" data-open="uzun|${asil[0]}">#${esc(d.asilNo)}</button></div>`:''}
  ${x.u2k[id]?`<div class="note"><span>${esc(t('Kod & Command Prompt bölümünde eşleşen kayıt:','Matching record in Code & Command Prompt:'))} ${x.u2k[id].map(k=>`<a href="#" data-open="kod|${esc(k)}">${esc(k)}</a>`).join(', ')}</span></div>`:''}
  ${isEN()?textCard('Prompt (ENG)',d.metinEn,'uzun',id,'metinEn')+textCard('Prompt (TR)',d.metinTr,'uzun',id,'metinTr'):textCard('Prompt (TR)',d.metinTr,'uzun',id,'metinTr')+textCard('Prompt (ENG)',d.metinEn,'uzun',id,'metinEn')}
  ${kvOf('uzun',d,['metinTr','metinEn'])}`};
DACTS.uzun=id=>`<button class="btn ai" type="button" data-toimp="uzun|${id}">${esc(t('İyileştir','Improve'))}</button>`;
DACTS.rehber=()=>'';
$('#drawerHost').addEventListener('click',e=>{const x=e.target.closest('[data-toimp]');if(x){const [col,id]=x.dataset.toimp.split('|');closeDrawer();IY.loadFrom(col,id)}});

/* ===== 3 · Kayıtlı Promptlar ===== */
function gecRows(){const s=vstate('gecmis');const f=s.f;
  return [...DATA.gecmis.entries()].filter(([,d])=>(!f.tur||d.tur===f.tur)&&(!f.kat||d.kategori===f.kat)&&(!f.plat||platTokens(d.platform).includes(f.plat))&&(!f.konu||d.konu===f.konu)&&(!f.sonuc||d.sonuc===f.sonuc)&&(!f.durum||d.durum===f.durum)&&(!f.fav||d.favori)&&matches(d,s.q,['baslik','konu','metin','kullanimNotu','not']))
    .sort((a,b)=>String(b[1].guncelleme||b[1].eklenme||'').localeCompare(String(a[1].guncelleme||a[1].eklenme||''))||a[0].localeCompare(b[0]))}
const turLab=x=>isEN()?TUR_G_EN[x]||x:x;
const turBadgeG=x=>`<span class="badge ${x==='Nihai prompt'?'g':x==='Meta-prompt'?'b':'y'}">${esc(turLab(x)||'—')}</span>`;
const SONUC_EN={'İyi':'Good','Orta':'Fair','Kötü':'Poor'};
RENDER.gecmis=()=>{
  const v=$('#v-gecmis');const s=vstate('gecmis');
  keepFocus(v,()=>{
    const rows=gecRows();const shown=rows.slice(0,s.limit);
    v.innerHTML=`<div class="vhead"><div><h2>${esc(t('Evodak Kayıtlı Promptlar','Evodak Saved Prompts'))}</h2><p>${esc(t('Daha önce oluşturduğunuz ve kullandığınız promptlar. Formda hazırladığınız ön promptlar ve AI’ın ürettiği nihai promptlar buraya kaydedilir; ikisi birbirine bağlıdır ve her revizyon ayrı saklanır. Bir kaydı açıp “İyileştir” ile düzenletebilir, “Formda aç” ile tekrar alabilirsiniz.','Prompts you created and used before. Pre-prompts from the form and AI-generated final prompts are saved here, linked to each other, with every revision kept. Open a record to “Improve” it or “Open in form” again.'))}</p></div>
    <div class="acts">${canWrite()?`<button class="btn primary" type="button" data-g-new>+ ${esc(t('Yeni kayıt','New record'))}</button>`:''}<button class="btn" type="button" data-g-imp>${esc(t('Prompt dosyası yükle','Upload prompt file'))}</button><button class="btn" type="button" data-g-xls>Excel</button><button class="btn" type="button" data-g-doc>Word</button></div></div>
    <div class="fbar"><input type="search" data-q placeholder="${esc(t('Başlık, konu, metin veya notta ara','Search title, topic, text or note'))}" value="${esc(s.q)}">
      ${selectHtml('tur',t('Tür','Type'),TUR_G.map(x=>[x,turLab(x)]),s.f.tur)}${selectHtml('konu',t('Konu / proje','Topic / project'),distinct('gecmis','konu'),s.f.konu)}${selectHtml('kat',t('Kategori','Category'),Object.entries(PURPOSE_LABEL()),s.f.kat)}${selectHtml('plat',t('Yapay zeka','AI'),[...new Set([...DATA.gecmis.values()].flatMap(d=>platTokens(d.platform)))].sort(),s.f.plat)}${selectHtml('sonuc',t('Sonuç','Result'),['İyi','Orta','Kötü'].map(x=>[x,isEN()?SONUC_EN[x]:x]),s.f.sonuc)}${selectHtml('durum',t('Durum','Status'),[['Tamam',t('Tamam','Done')],['Taslak',t('Taslak','Draft')]],s.f.durum)}
      <label class="tg"><input type="checkbox" data-tgl="fav" ${s.f.fav?'checked':''}> ${esc(t('Favoriler','Favourites'))}</label><span class="cnt">${num(rows.length)} / ${num(DATA.gecmis.size)}</span></div>
    ${loadingOr('gecmis',rows.length?`<div class="list">${shown.map(([id,d])=>`<div class="item" data-open="gecmis|${id}"><div class="main"><div class="t1"><b>${esc(d.baslik)}</b>${turBadgeG(d.tur)}${d.durum==='Taslak'?`<span class="badge ai">${esc(t('taslak','draft'))}</span>`:''}<span class="badge">Rev.${String(d.revNo||1).padStart(2,'0')}</span>${d.sonuc?`<span class="badge ${d.sonuc==='İyi'?'okb':d.sonuc==='Kötü'?'badb':''}">${esc(isEN()?SONUC_EN[d.sonuc]:d.sonuc)}</span>`:''}${d.motor?`<span class="badge b">${esc(t('formun üretim motoru','form generation engine'))}</span>`:''}${arr(d.bagli).length?`<span class="badge">↔ ${arr(d.bagli).length}</span>`:''}</div><div class="desc">${esc(d.konu||d.metin)}</div><div class="t1">${d.kategori?`<span class="badge solid">${esc(purposeName(d.kategori))}</span>`:''}${pchips(d.platform)}<span class="hint">${esc(arr(d.dil).map(x=>isEN()?DIL_EN[x]||x:x).join(', '))}${d.eklenme?' · '+fmtDay(d.eklenme):''}</span></div></div>
      <div class="side" data-stop><button class="btn sm" type="button" data-gcopy="${id}">${esc(t('Kopyala','Copy'))}</button><button class="iconbtn star ${d.favori?'on':''}" type="button" data-fav="gecmis|${id}">★</button></div></div>`).join('')}</div>${moreBtn('gecmis',rows.length,shown.length)}`:emptyBox(t('Kayıt yok','No records'),t('Formda bir prompt hazırlayıp “Kaydet”e basın veya prompt dosyası yükleyin.','Build a prompt in the form and press “Save”, or upload a prompt file.')))}`;
  });
  bindList(v,'gecmis',RENDER.gecmis);
};
$('#v-gecmis').addEventListener('click',e=>{
  if(e.target.closest('[data-g-new]'))newRecord('gecmis',{tur:'Nihai prompt',durum:'Tamam',revNo:1,platform:[],dil:['Türkçe'],bagli:[]});
  else if(e.target.closest('[data-g-imp]')){YK.target='gecmis';go('yukle')}
  else if(e.target.closest('[data-g-xls]'))exportSheets('Evodak Kayıtlı Promptlar',[{name:'Kayıtlı Promptlar',rows:toRows('gecmis',gecRows().map(r=>r[1]))}]);
  else if(e.target.closest('[data-g-doc]'))exportWord('Evodak Kayıtlı Promptlar',gecRows().map(([id,d])=>({h:d.baslik,meta:`${id} · ${turLab(d.tur)} · Rev.${String(d.revNo||1).padStart(2,'0')}${d.konu?' · '+d.konu:''}`,text:d.metin||''})));
  const c=e.target.closest('[data-gcopy]');if(c)copyWithVars(DATA.gecmis.get(c.dataset.gcopy).metin||'');
});
function revChain(id){const chain=[];let cur=DATA.gecmis.get(id);const seen=new Set();
  while(cur&&cur.oncekiRev&&!seen.has(cur.oncekiRev)){seen.add(cur.oncekiRev);const i=cur.oncekiRev;cur=DATA.gecmis.get(i);if(cur)chain.push([i,cur])}
  return {prev:chain,next:[...DATA.gecmis.entries()].filter(([,d])=>d.oncekiRev===id)}}
DETAIL.gecmis=(id,d)=>{
  const rc=revChain(id);const bag=arr(d.bagli).map(b=>[b,DATA.gecmis.get(b)]).filter(x=>x[1]);
  const back=[...DATA.gecmis.entries()].filter(([i,x])=>arr(x.bagli).includes(id)&&!arr(d.bagli).includes(i));
  return `<div style="display:flex;gap:6px;flex-wrap:wrap">${turBadgeG(d.tur)}${d.durum==='Taslak'?`<span class="badge ai">${esc(t('taslak','draft'))}</span>`:''}<span class="badge">Rev.${String(d.revNo||1).padStart(2,'0')}</span>${d.kategori?`<span class="badge solid">${esc(purposeName(d.kategori))}</span>`:''}${d.motor?`<span class="badge b">${esc(t('formun üretim motoru','form generation engine'))}</span>`:''}</div>
  ${d.kullanimNotu?`<div class="note"><span><b>${esc(t('Kullanım notu:','Usage note:'))}</b> ${esc(d.kullanimNotu)}</span></div>`:''}
  ${textCard(t('Prompt metni','Prompt text'),d.metin,'gecmis',id,'metin')}
  <div class="card"><header><h3>${esc(t('Sonuç: işe yaradı mı?','Result: did it work?'))}</h3>${d.sonKullanim?`<span class="hint">${esc(t('Son kullanım','Last used'))}: ${fmtDate(d.sonKullanim)}</span>`:''}</header><div class="cbody"><div class="optchips">${['İyi','Orta','Kötü'].map(x=>`<button type="button" data-gson="${id}|${x}" aria-pressed="${d.sonuc===x}">${esc(isEN()?SONUC_EN[x]:x)}</button>`).join('')}<button type="button" data-gused="${id}">${esc(t('Bugün kullandım','Used today'))}</button></div>${d.sonucNot?`<p style="margin:0;font-size:13.5px">${esc(d.sonucNot)}</p>`:''}</div></div>
  <dl class="kv"><dt>${esc(t('Konu / proje','Topic / project'))}</dt><dd>${esc(d.konu||'—')}</dd><dt>${esc(t('Yapay zeka / araç','AI / tool'))}</dt><dd>${pchips(d.platform)||'—'}</dd><dt>${esc(t('Dil','Language'))}</dt><dd>${esc(arr(d.dil).map(x=>isEN()?DIL_EN[x]||x:x).join(', ')||'—')}</dd>
  ${bag.length||back.length?`<dt>${esc(t('Bağlı kayıtlar','Linked records'))}</dt><dd>${[...bag,...back].map(([b,x])=>`<a href="#" data-open="gecmis|${b}">${esc(x.baslik)}</a> ${turBadgeG(x.tur)}`).join('<br>')}</dd>`:''}
  ${rc.prev.length?`<dt>${esc(t('Önceki revizyonlar','Previous revisions'))}</dt><dd>${rc.prev.map(([b,x])=>`<a href="#" data-open="gecmis|${b}">Rev.${String(x.revNo||1).padStart(2,'0')} · ${esc(x.baslik)}</a>`).join('<br>')}</dd>`:''}
  ${rc.next.length?`<dt>${esc(t('Sonraki revizyonlar','Later revisions'))}</dt><dd>${rc.next.map(([b,x])=>`<a href="#" data-open="gecmis|${b}">Rev.${String(x.revNo||1).padStart(2,'0')} · ${esc(x.baslik)}</a>`).join('<br>')}</dd>`:''}
  ${d.iyilestirme?`<dt>${esc(t('İyileştirme','Improvement'))}</dt><dd>${esc(t('Puan','Score'))} ${d.iyilestirme.once} → ${d.iyilestirme.sonra} (${fmtDay(d.iyilestirme.at)})</dd>`:''}
  ${d.kaynakDosya?`<dt>${esc(t('Kaynak dosya','Source file'))}</dt><dd>${esc(d.kaynakDosya)}</dd>`:''}${d.not?`<dt>${esc(t('Not','Note'))}</dt><dd>${esc(d.not)}</dd>`:''}<dt>${esc(t('Oluşturan','Created by'))}</dt><dd>${esc(who(d.ekleyen))}${d.eklenme?' · '+fmtDate(d.eklenme):''}</dd></dl>`;
};
DACTS.gecmis=(id,d)=>`${d.formState?`<button class="btn primary" type="button" data-gform="${id}">${esc(t('Formda aç / revize et','Open in form / revise'))}</button>`:`<button class="btn" type="button" data-gparse="${id}">${esc(t('Formda aç','Open in form'))}</button>`}<button class="btn ai" type="button" data-toimp="gecmis|${id}">${esc(t('İyileştir','Improve'))}</button>${canWrite()?`<button class="btn" type="button" data-glink="${id}">${esc(t('Kayıt bağla','Link record'))}</button>`:''}`;
$('#drawerHost').addEventListener('click',async e=>{
  const f=e.target.closest('[data-gform]');if(f){closeDrawer();FORM.load(f.dataset.gform);return}
  const p=e.target.closest('[data-gparse]');if(p){closeDrawer();IY.parseToForm(DATA.gecmis.get(p.dataset.gparse).metin,p.dataset.gparse);return}
  const so=e.target.closest('[data-gson]');if(so){if(!guard())return;const [id,x]=so.dataset.gson.split('|');const d=DATA.gecmis.get(id);
    modal({title:t('Sonuç notu: ','Result note: ')+(isEN()?SONUC_EN[x]:x),ok:t('Kaydet','Save'),body:`<div class="fld"><label for="sonN">${esc(t('Açıklama (isteğe bağlı)','Note (optional)'))}</label><textarea id="sonN">${esc(d.sonuc===x?d.sonucNot||'':'')}</textarea></div>`,onOk:async h=>{await saveRecord('gecmis',id,{sonuc:x,sonucNot:$('#sonN',h).value.trim(),sonKullanim:d.sonKullanim||iso()},{note:t('Sonuç notu','Result note')})}});return}
  const u=e.target.closest('[data-gused]');if(u){try{await saveRecord('gecmis',u.dataset.gused,{sonKullanim:iso()},{note:t('Kullanıldı olarak işaretlendi','Marked as used')});toast(t('Son kullanım tarihi güncellendi','Last-used date updated'))}catch(err){}return}
  const l=e.target.closest('[data-glink]');if(l){const id=l.dataset.glink;const d=DATA.gecmis.get(id);
    const opts=[...DATA.gecmis.entries()].filter(([i])=>i!==id).sort((a,b)=>String(a[1].baslik).localeCompare(String(b[1].baslik),'tr'));
    modal({title:t('Kayıt bağla','Link record'),ok:t('Bağla','Link'),body:`<p class="hint" style="margin:0">${esc(t('Örneğin bir ön prompt ile ondan üretilen nihai promptu bağlayın. Bağlantı iki kayıtta da görünür.','For example, link a pre-prompt with the final prompt generated from it. The link shows on both records.'))}</p><div class="fld"><label for="lnk">${esc(t('Bağlanacak kayıt','Record to link'))}</label><select id="lnk">${opts.map(([i,x])=>`<option value="${i}">${esc(x.baslik)} · ${esc(turLab(x.tur))}</option>`).join('')}</select></div>`,
      onOk:async h=>{const tg=$('#lnk',h).value;const o=DATA.gecmis.get(tg);
        await saveMany('gecmis',[{id,data:{bagli:[...new Set([...arr(d.bagli),tg])]}},{id:tg,data:{bagli:[...new Set([...arr(o.bagli),id])]}}],{note:t('Kayıt bağlandı','Records linked')});toast(t('Bağlandı','Linked'))}});return}
});

/* ===== 2 · Prompt İyileştirme ===== */
const IY={src:{type:'paste',text:'',col:null,id:null,name:''},set:{seviye:'Güçlendir',hedef:'Aynı türde kalsın',ai:'',dil:'Aynı kalsın',not:''},res:null,busy:false,queue:[],picks:new Set(),tab:'paste',showDiff:true};
const CRIT=[['rol','Rol','Role'],['gorev','Görev netliği','Task clarity'],['baglam','Bağlam / gerçek bilgiler','Context / facts'],['kitle','Hedef kitle','Audience'],['format','Çıktı formatı','Output format'],['uzunluk','Uzunluk','Length'],['kisitlar','Kısıtlar','Constraints'],['ornek','Örnek','Example'],['kalite','Kalite kontrolü','Quality check'],['dil','Dil ve yazım','Language']];
const IYOPT={seviye:[['Hafif düzelt','Light fix'],['Güçlendir','Strengthen'],['Baştan yeniden yaz','Rewrite from scratch']],hedef:[['Aynı türde kalsın','Keep the same type'],['Ön prompt olarak kalsın','Keep as pre-prompt'],['Nihai prompta dönüştür','Convert to final prompt']],dil:[['Aynı kalsın','Keep the same'],['Türkçe','Turkish'],['İngilizce','English'],['Arapça','Arabic'],['Rusça','Russian']]};
const avg=o=>{const v=CRIT.map(([k])=>Number(o&&o[k])||0);return Math.round(v.reduce((a,b)=>a+b,0)/v.length*10)/10};
IY.loadFrom=(col,id)=>{const d=DATA[col].get(id);if(!d)return;IY.src={type:'record',col,id,text:col==='uzun'?pick(d,'metinTr','metinEn'):(col==='kod'?kodCopyText(d):d.metin),name:COLDEF[col].title(d)};IY.res=null;IY.tab='record';IY.picks.clear();go('iyilestir')};
IY.parseToForm=async(text,recordId)=>{
  if(!LLM.need())return;
  toast(t('Prompt form alanlarına ayrıştırılıyor…','Parsing the prompt into form fields…'),8000);
  const ol=(m,g)=>optList(m,g);
  try{
    const r=await LLM.json(`Aşağıdaki promptu bir "ön prompt hazırlama formu"nun alanlarına ayrıştır. Yalnızca şu JSON nesnesini döndür (bilinmeyen alanı boş bırak; listeli alanlarda yalnızca verilen değerleri kullan):
"purpose": şunlardan biri ${JSON.stringify(PURPOSES.map(p=>p.id))} (${PURPOSES.map(p=>p.id+'='+p.tr).join(', ')})
"subs": seçilen amacın alt görevlerinden dizi
"konu": metin
"kategori": dizi, şunlardan: ${JSON.stringify(ol('konu','kat'))}
"amac": dizi, şunlardan: ${JSON.stringify(ol('amac','g'))}
"kitle": dizi, şunlardan: ${JSON.stringify(ol('kitle','g'))}
"dil": dizi, şunlardan: ${JSON.stringify(ol('dil','g'))}
"ton": dizi, şunlardan: ${JSON.stringify(ol('ton','g'))}
"uzunluk": tek değer, şunlardan: ${JSON.stringify(ol('uzunluk','g'))}
"detay": promptta geçen somut gerçek bilgiler, her satır bir madde
"sabit": değiştirilmemesi gereken bilgiler
"mutlaka": olması gerekenler (dizi), "olmasin": olmaması gerekenler (dizi)
"komutlar": promptta geçen /komut kodları (dizi)
"ek": diğer özel talimatlar (metin)
Alt görev seçenekleri: ${PURPOSES.map(p=>p.id+': '+JSON.stringify(p.subs.map(s=>sp(s).tr))).join(' | ')}

PROMPT:
${String(text).slice(0,40000)}`);
    FORM.applyParsed(r,recordId&&DATA.gecmis.get(recordId)?recordId:null);
  }catch(e){toast(t('Ayrıştırılamadı: ','Could not parse: ')+(e.message||e),5000)}
};
function iySettingsHtml(){
  const s=IY.set;const seg=k=>`<div class="optchips">${IYOPT[k].map(([o,en])=>`<button type="button" data-iyset="${k}|${esc(o)}" aria-pressed="${s[k]===o}">${esc(isEN()?en:o)}</button>`).join('')}</div>`;
  return `<div class="fld"><label>${esc(t('Seviye','Level'))}</label>${seg('seviye')}<span class="hint">${esc(t('Hafif: yazım ve düzen · Güçlendir: eksikleri tamamla · Baştan: yeniden kurgula','Light: spelling and layout · Strengthen: fill gaps · Rewrite: rebuild'))}</span></div>
  <div class="fld"><label>${esc(t('Hedef','Goal'))}</label>${seg('hedef')}</div>
  <div class="fld"><label for="iyAi">${esc(t('Hedef yapay zeka değişsin mi?','Change the target AI?'))}</label><select id="iyAi" data-iyf="ai"><option value="">${esc(t('Değişmesin','No change'))}</option>${platNames().map(p=>`<option ${s.ai===p?'selected':''}>${esc(p)}</option>`).join('')}</select></div>
  <div class="fld"><label>${esc(t('Dil','Language'))}</label>${seg('dil')}</div>
  <div class="fld"><label for="iyNot">${esc(t('Notunuz (şunu ekle / şunu çıkar)','Your note (add this / remove that)'))}</label><textarea id="iyNot" data-iyf="not">${esc(s.not)}</textarea></div>`;
}
RENDER.iyilestir=()=>{
  const v=$('#v-iyilestir');const tb=IY.tab;
  const recs=gecRows();
  const srcHtml=tb==='paste'?`<div class="fld"><label for="iyTxt">${esc(t('Prompt metni','Prompt text'))}</label><textarea id="iyTxt" data-iyf="text" style="min-height:220px;font-family:var(--f-mono);font-size:12.5px;width:100%">${esc(IY.src.type==='paste'?IY.src.text:'')}</textarea></div>`
    :tb==='file'?`<div class="drop" data-iydrop tabindex="0" role="button"><b>${esc(t('Prompt dosyasını bırakın veya seçin','Drop or choose a prompt file'))}</b><span>${esc(t('Word, PDF, metin, Excel veya ekran görüntüsü','Word, PDF, text, Excel or screenshot'))}</span></div>${IY.src.type==='file'?`<p class="hint">${esc(t('Yüklenen','Loaded'))}: <b>${esc(IY.src.name)}</b> · ${num(IY.src.text.length)} ${esc(t('karakter','chars'))}</p>`:''}`
    :`<p class="hint">${esc(t('Kayıtlı Promptlar’dan seçin. Birden fazla seçerseniz sırayla toplu iyileştirilir.','Pick from Saved Prompts. Selecting several improves them one after another.'))}</p><div class="mini" style="max-height:320px;overflow:auto">${recs.map(([i,d])=>`<label class="r" style="cursor:pointer"><input type="checkbox" data-iypick="${i}" ${IY.picks.has(i)||(IY.src.type==='record'&&IY.src.col==='gecmis'&&IY.src.id===i&&!IY.picks.size)?'checked':''}><span class="w">${esc(d.baslik)}</span><small>${esc(turLab(d.tur))}</small></label>`).join('')||`<p class="hint">${esc(t('Kayıt yok.','No records.'))}</p>`}</div>${IY.src.type==='record'&&IY.src.col!=='gecmis'?`<p class="hint">${esc(t('Seçili','Selected'))}: <b>${esc(IY.src.name)}</b> (${esc(COLDEF[IY.src.col].name())})</p>`:''}`;
  const r=IY.res;
  v.innerHTML=`<div class="vhead"><div><h2>${esc(t('Evodak Prompt İyileştirme','Evodak Prompt Improvement'))}</h2><p>${esc(t('Daha önce oluşturulmuş bir promptu yükleyin; AI 10 ölçütle puanlar, eksikleri listeler, boşlukları tamamlar, adım adım düşünüp kendi taslağını eleştirir ve iyileştirilmiş halini verir. Kabul ettiğinizde Kayıtlı Promptlar’a yeni revizyon olarak kaydedilir; eski hali silinmez.','Load an existing prompt; AI scores it on 10 criteria, lists gaps, fills them, thinks step by step, critiques its own draft and returns an improved version. Accepting saves it as a new revision in Saved Prompts; the old one is kept.'))}</p></div></div>
  ${!LLM.ready()?`<div class="note err"><span>${esc(t('İyileştirme için Ayarlar’dan Anthropic API anahtarı girin. Alternatif: promptu Claude sohbetine yapıştırıp “Panel Promptu 10 – Prompt İyileştirme” talimatını kullanın.','Enter an Anthropic API key in Settings to improve prompts. Alternative: paste the prompt into a Claude chat with the “Panel Promptu 10 – Prompt İyileştirme” instruction.'))}</span><button class="btn sm" type="button" data-view="ayar">${esc(t('Ayarlar','Settings'))}</button></div>`:''}
  <div class="imain">
    <div class="card"><header><h3>Prompt</h3></header><div class="cbody">
      ${tabsHtml('data-iytab',tb,[['paste',t('Metni yapıştır','Paste text')],['file',t('Dosya yükle','Upload file')],['record',t('Kayıttan seç','Pick a record')]])}
      ${srcHtml}<hr style="border:0;border-top:1px solid var(--rule);margin:4px 0">${iySettingsHtml()}
      <div style="display:flex;gap:8px;flex-wrap:wrap"><button class="btn ai solid" type="button" data-iyrun ${IY.busy?'disabled':''}>${IY.busy?'<span class="spin"></span> '+esc(t('AI çalışıyor…','AI is working…')):esc(IY.picks.size>1?t(`Seçilen ${IY.picks.size} kaydı sırayla iyileştir`,`Improve the ${IY.picks.size} selected records`):t('Analiz et ve iyileştir','Analyse and improve'))}</button></div>
      ${IY.queue.length?`<div class="queue">${IY.queue.map((q,i)=>`<div class="q"><span>${esc(q.name)}</span><span>${q.state==='bekliyor'?`<span class="badge">${esc(t('bekliyor','waiting'))}</span>`:q.state==='çalışıyor'?'<span class="spin"></span>':q.state==='hata'?`<span class="badge badb" title="${esc(q.err||'')}">${esc(t('hata','error'))}</span>`:q.state==='kaydedildi'?`<span class="badge okb">${esc(t('kaydedildi','saved'))}</span>`:q.state==='atlandı'?`<span class="badge">${esc(t('atlandı','skipped'))}</span>`:`<span class="badge okb">${q.res?avg(q.res.puan_once)+' → '+avg(q.res.puan_sonra):''}</span> <button class="btn sm" type="button" data-iyq="${i}">${esc(t('Göster','Show'))}</button>`}</span></div>`).join('')}</div>`:''}
    </div></div>
    <div style="display:flex;flex-direction:column;gap:14px;min-width:0">${r?iyResultHtml(r):emptyBox(t('Sonuç burada görünecek','The result will appear here'),t('Puan karşılaştırması, eksik ve sorun listesi, varsayımlar, öz-eleştiri ve iyileştirilmiş prompt.','Score comparison, gaps and issues, assumptions, self-critique and the improved prompt.'))}</div>
  </div>`;
};
function iyResultHtml(r){
  const o=avg(r.puan_once),n=avg(r.puan_sonra);const orig=r._orig||'';
  const cmds=[...new Set((String(orig+'\n'+r.iyilestirilmis).match(/(^|\s)\/[a-z0-9][a-z0-9-]*/gi)||[]).map(x=>x.trim()))];
  const tg=IY.set.ai?[IY.set.ai]:[];
  return `<div class="card"><header><h3>${esc(t('Puan','Score'))}: ${o} → ${n}</h3><span class="hint">${esc(r.ozet||'')}</span></header><div class="cbody"><div class="scores">${CRIT.map(([k,l,le])=>{const a=Number(r.puan_once&&r.puan_once[k])||0,b=Number(r.puan_sonra&&r.puan_sonra[k])||0;return `<div class="sr"><span>${esc(isEN()?le:l)}</span><span class="bar2"><i style="width:${a*10}%"></i><b style="width:${b*10}%"></b></span><span class="v">${a} → ${b}</span></div>`}).join('')}</div><p class="hint" style="margin:0">${esc(t('Gri: önceki puan · renkli: iyileştirilmiş puan (0–10)','Grey: before · coloured: after (0–10)'))}</p></div></div>
  ${arr(r.adimlar).length?`<div class="card"><header><h3>${esc(t('Adım adım düşünme','Step-by-step reasoning'))}</h3></header><div class="cbody"><ol class="issues">${r.adimlar.map(x=>`<li>${esc(x)}</li>`).join('')}</ol></div></div>`:''}
  ${arr(r.sorunlar).length?`<div class="card"><header><h3>${esc(t('Eksikler ve sorunlar','Gaps and issues'))} (${r.sorunlar.length})</h3></header><div class="cbody"><ol class="issues">${r.sorunlar.map(x=>`<li><b>${esc(x.madde||x)}</b>${x.neden?` <span>— ${esc(x.neden)}</span>`:''}</li>`).join('')}</ol></div></div>`:''}
  ${arr(r.varsayimlar).length?`<div class="card"><header><h3>${esc(t('AI’ın tamamladığı eksikler (varsayımlar)','Gaps AI filled (assumptions)'))}</h3></header><div class="cbody"><ul class="issues">${r.varsayimlar.map(x=>`<li>${esc(x)}</li>`).join('')}</ul></div></div>`:''}
  ${arr(r.elestiri).length?`<div class="card"><header><h3>${esc(t('Öz-eleştiri: taslakta düzeltilenler','Self-critique: fixed in the draft'))}</h3></header><div class="cbody"><ul class="issues">${r.elestiri.map(x=>`<li>${esc(x)}</li>`).join('')}</ul></div></div>`:''}
  ${cmds.length?`<div class="card"><header><h3>${esc(t('Promptta geçen komutlar','Commands in the prompt'))}</h3></header><div class="cbody"><div class="mini">${cmds.map(c=>{const f=findCmd(c);const w=f&&cmdCompat(f[1],tg);return `<div class="r" ${f?`data-open="kod|${f[0]}"`:''}><code style="min-width:120px">${esc(c)}</code><span class="w">${f?esc(pick(f[1],'aciklamaTr','aciklamaEn')||pick(f[1],'baslikTr','baslikEn')):`<i>${esc(t('Kod & Command listesinde yok','Not in the Code & Command list'))}</i>`}</span>${f?turBadge(f[1].tur):''}${w?`<small style="color:var(--bad)">⚠ ${esc(w)}</small>`:''}</div>`}).join('')}</div></div></div>`:''}
  <div class="card"><header><h3>${esc(t('İyileştirilmiş prompt','Improved prompt'))}</h3><div class="seg"><button type="button" data-iydiff="0" aria-pressed="${!IY.showDiff}">${esc(t('Temiz','Clean'))}</button><button type="button" data-iydiff="1" aria-pressed="${IY.showDiff}">${esc(t('Önce / sonra','Before / after'))}</button></div></header>
    <pre class="pre diff">${IY.showDiff?diffHtml(orig,r.iyilestirilmis):esc(r.iyilestirilmis)}</pre>
    <div class="cbody" style="flex-direction:row;flex-wrap:wrap"><button class="btn primary" type="button" data-iyok>${esc(t('Kabul et ve kaydet','Accept and save'))}</button><button class="btn" type="button" data-iycopy>${esc(t('Kopyala','Copy'))}</button><button class="btn ai" type="button" data-iyagain>${esc(t('Tekrar iyileştir','Improve again'))}</button><button class="btn" type="button" data-iyform>${esc(t('Formda aç','Open in form'))}</button>${IY.queue.length?`<button class="btn" type="button" data-iyskip>${esc(t('Atla','Skip'))}</button>`:''}</div></div>`;
}
function tokenize(s){return String(s).match(/\s+|[^\s]+/g)||[]}
function lcsDiff(a,b){const n=a.length,m=b.length;if(n*m>4e6)return null;
  const dp=Array.from({length:n+1},()=>new Uint32Array(m+1));
  for(let i=n-1;i>=0;i--)for(let j=m-1;j>=0;j--)dp[i][j]=a[i]===b[j]?dp[i+1][j+1]+1:Math.max(dp[i+1][j],dp[i][j+1]);
  const out=[];let i=0,j=0;while(i<n&&j<m){if(a[i]===b[j]){out.push(['=',a[i]]);i++;j++}else if(dp[i+1][j]>=dp[i][j+1]){out.push(['-',a[i++]])}else out.push(['+',b[j++]])}
  while(i<n)out.push(['-',a[i++]]);while(j<m)out.push(['+',b[j++]]);return out}
function diffHtml(a,b){const la=String(a).split('\n'),lb=String(b).split('\n');const d=lcsDiff(la,lb);if(!d)return esc(b);let html='';let k=0;
  while(k<d.length){if(d[k][0]==='='){html+=esc(d[k][1])+'\n';k++;continue}
    const rem=[],add=[];while(k<d.length&&d[k][0]!=='='){(d[k][0]==='-'?rem:add).push(d[k][1]);k++}
    const wd=lcsDiff(tokenize(rem.join('\n')),tokenize(add.join('\n')));
    if(wd)html+=wd.map(([ty,x])=>ty==='='?esc(x):ty==='+'?`<span class="a">${esc(x)}</span>`:`<span class="r">${esc(x)}</span>`).join('')+'\n';
    else html+=(rem.length?`<span class="r">${esc(rem.join('\n'))}</span>\n`:'')+(add.length?`<span class="a">${esc(add.join('\n'))}</span>\n`:'')}
  return html}
async function iyRunOne(text){
  const s=IY.set;const crit=CRIT.map(([k,l])=>`"${k}" (${l})`).join(', ');
  const prompt=`Sen kıdemli bir prompt mühendisisin. Aşağıdaki promptu analiz et ve iyileştir.
Ayarlar:
- Seviye: ${s.seviye} (Hafif düzelt = yalnızca yazım, dil ve düzen; Güçlendir = eksikleri tamamla, belirsizlikleri gider; Baştan yeniden yaz = aynı amaca hizmet eden yeni ve daha iyi bir kurgu)
- Hedef: ${s.hedef}${s.hedef==='Nihai prompta dönüştür'?' (meta bilgi/ön prompt ise doğrudan hedef yapay zekaya yapıştırılacak nihai prompta çevir)':''}
- Hedef yapay zeka: ${s.ai||'değişmesin'}${s.ai&&hintFor(s.ai)?' — sözdizimi notu: '+hintFor(s.ai)[0]:''}
- Dil: ${s.dil}
- Kullanıcı notu: ${s.not||'yok'}
- Açıklamaları (sorunlar, varsayımlar, eleştiri, adımlar) ${isEN()?'İngilizce':'Türkçe'} yaz.
Çalışma biçimi: Adım adım düşün ve adımlarını kısaca özetle. Önce mevcut promptu 10 ölçütle 0-10 arasında puanla: ${crit}. Eksik ve sorunları, her biri için neden önemli olduğuyla listele. Eksik bilgileri en uygun profesyonel varsayımla tamamla ve varsayımları listele; verilmemiş fiyat, tarih, istatistik gibi gerçekleri uydurma, gerekiyorsa [köşeli parantezli] doldurma alanı bırak. Sonra bir taslak yaz, taslağını eleştir, eleştiriye göre düzeltilmiş son hali ver. Promptta geçen özel isim, rakam, adres ve marka bilgilerini aynen koru. Son hali de aynı 10 ölçütle puanla.
Yanıtı YALNIZCA şu JSON nesnesi olarak ver:
{"baslik":"kayıt için kısa başlık","tur":"Ön prompt formu | Meta-prompt | Nihai prompt","ozet":"tek cümlelik değişiklik özeti","adimlar":["kısa düşünme adımları"],"puan_once":{${CRIT.map(([k])=>`"${k}":0`).join(',')}},"sorunlar":[{"madde":"","neden":""}],"varsayimlar":[""],"elestiri":["taslakta bulup düzelttiğin sorunlar"],"iyilestirilmis":"iyileştirilmiş promptun tam metni","puan_sonra":{${CRIT.map(([k])=>`"${k}":0`).join(',')}}}

İYİLEŞTİRİLECEK PROMPT:
"""
${String(text).slice(0,60000)}
"""`;
  const r=await LLM.json(prompt,{big:true,maxTokens:16000});
  if(!r||!String(r.iyilestirilmis||'').trim())throw new Error(t('Boş yanıt geldi','Empty reply'));
  r._orig=text;return r;
}
$('#v-iyilestir').addEventListener('click',async e=>{
  const tb=e.target.closest('[data-iytab]');if(tb){IY.tab=tb.dataset.iytab;RENDER.iyilestir();return}
  const st=e.target.closest('[data-iyset]');if(st){const [k,v]=st.dataset.iyset.split('|');IY.set[k]=v;RENDER.iyilestir();return}
  if(e.target.closest('[data-iydrop]')){pickFiles(async fs=>{const f=fs[0];try{let x;if(kindOf(f)==='image'){if(!LLM.need())return;toast(t('Görseldeki metin okunuyor…','Reading text in the image…'),6000);const r=await LLM.json('Bu ekran görüntüsündeki prompt metnini olduğu gibi çıkar. JSON: {"metin":"..."}',{images:[f]});x=r.metin||''}else x=await readDocText(f);IY.src={type:'file',text:x,name:f.name};IY.picks.clear();RENDER.iyilestir()}catch(err){toast(t('Okunamadı: ','Could not read: ')+err.message,4500)}});return}
  const d=e.target.closest('[data-iydiff]');if(d){IY.showDiff=d.dataset.iydiff==='1';RENDER.iyilestir();return}
  const q=e.target.closest('[data-iyq]');if(q){const it=IY.queue[+q.dataset.iyq];IY.res=it.res;IY.cur=+q.dataset.iyq;IY.src={type:'record',col:it.col,id:it.id,text:it.res._orig,name:it.name};RENDER.iyilestir();return}
  if(e.target.closest('[data-iyrun]')){
    if(!LLM.need())return;
    if(IY.tab==='record'&&IY.picks.size>1){
      IY.queue=[...IY.picks].map(id=>({id,col:'gecmis',name:DATA.gecmis.get(id).baslik,state:'bekliyor'}));IY.busy=true;IY.res=null;RENDER.iyilestir();
      for(const it of IY.queue){it.state='çalışıyor';RENDER.iyilestir();try{it.res=await iyRunOne(DATA.gecmis.get(it.id).metin);it.state='hazır'}catch(err){it.state='hata';it.err=err.message}RENDER.iyilestir()}
      IY.busy=false;iyNext();return}
    if(IY.tab==='record'&&IY.picks.size===1){const id=[...IY.picks][0];IY.src={type:'record',col:'gecmis',id,text:DATA.gecmis.get(id).metin,name:DATA.gecmis.get(id).baslik}}
    if(IY.tab==='paste'){IY.src={type:'paste',text:($('#iyTxt')||{}).value||IY.src.text||'',name:''}}
    const text=String(IY.src.text||'').trim();if(!text){toast(t('Önce bir prompt girin, yükleyin veya seçin.','Enter, upload or pick a prompt first.'));return}
    IY.busy=true;IY.queue=[];RENDER.iyilestir();
    try{IY.res=await iyRunOne(text)}catch(err){toast(t('İyileştirilemedi: ','Could not improve: ')+err.message,5000)}
    IY.busy=false;RENDER.iyilestir();return}
  if(e.target.closest('[data-iycopy]')){copyText(IY.res.iyilestirilmis);return}
  if(e.target.closest('[data-iyagain]')){IY.src=Object.assign({},IY.src,{text:IY.res.iyilestirilmis});IY.busy=true;RENDER.iyilestir();try{IY.res=await iyRunOne(IY.src.text)}catch(err){toast(t('İyileştirilemedi: ','Could not improve: ')+err.message,5000)}IY.busy=false;RENDER.iyilestir();return}
  if(e.target.closest('[data-iyform]')){IY.parseToForm(IY.res.iyilestirilmis,IY.src.type==='record'&&IY.src.col==='gecmis'?IY.src.id:null);return}
  if(e.target.closest('[data-iyskip]')){const it=IY.queue[IY.cur];if(it)it.state='atlandı';iyNext();return}
  if(e.target.closest('[data-iyok]')){await iyAccept();return}
});
function iyNext(){const n=IY.queue.findIndex(x=>x.state==='hazır');if(n>=0){IY.cur=n;IY.res=IY.queue[n].res;IY.src={type:'record',col:'gecmis',id:IY.queue[n].id,text:IY.res._orig,name:IY.queue[n].name}}else IY.res=null;RENDER.iyilestir()}
async function iyAccept(){
  if(!guard())return;const r=IY.res;const src=IY.src;
  const prev=src.type==='record'&&src.col==='gecmis'?DATA.gecmis.get(src.id):null;
  const other=src.type==='record'&&src.col!=='gecmis'?DATA[src.col].get(src.id):null;
  const tur=IY.set.hedef==='Nihai prompta dönüştür'?'Nihai prompt':IY.set.hedef==='Ön prompt olarak kalsın'?'Ön prompt formu':(prev?prev.tur:(TUR_G.includes(r.tur)?r.tur:'Nihai prompt'));
  const id=uid('g');
  const base=prev?Object.assign({},prev):{konu:'',kategori:'',platform:other?platTokens(other.platform):[],dil:[],kullanimNotu:'',bagli:[],kaynakDosya:src.type==='file'?src.name:''};
  ['formState','motor','id','eklenme','ekleyen','guncelleme','guncelleyen'].forEach(k=>delete base[k]);
  const doc=Object.assign(base,{baslik:prev?prev.baslik:(other?COLDEF[src.col].title(other)+' (iyileştirilmiş)':(r.baslik||'İyileştirilmiş prompt')),tur,durum:'Tamam',metin:r.iyilestirilmis,revNo:prev?(prev.revNo||1)+1:1,oncekiRev:prev?src.id:'',favori:false,sonuc:'',sonucNot:'',sonKullanim:'',
    platform:IY.set.ai?[IY.set.ai]:arr(base.platform),dil:IY.set.dil!=='Aynı kalsın'?[IY.set.dil]:arr(base.dil),
    iyilestirme:{once:avg(r.puan_once),sonra:avg(r.puan_sonra),seviye:IY.set.seviye,at:iso(),sorunlar:arr(r.sorunlar).slice(0,20).map(x=>x.madde||String(x))},
    not:`Prompt İyileştirme ile üretildi (${IY.set.seviye}; puan ${avg(r.puan_once)} → ${avg(r.puan_sonra)}).${other?' Kaynak: '+COLDEF[src.col].name()+' – '+src.id+'.':''}${r.ozet?' '+r.ozet:''}`});
  try{await saveRecord('gecmis',id,doc,{note:t('İyileştirme kabul edildi','Improvement accepted')});toast(prev?t(`Rev.${String(doc.revNo).padStart(2,'0')} olarak kaydedildi`,`Saved as Rev.${String(doc.revNo).padStart(2,'0')}`):t('Kaydedildi','Saved'));
    if(IY.queue.length){const it=IY.queue[IY.cur];if(it)it.state='kaydedildi';iyNext()}else{IY.res=null;RENDER.iyilestir();openRecord('gecmis',id)}
  }catch(e){if(e.message!=='no-write')toast(t('Kaydedilemedi: ','Could not save: ')+e.message,5000)}
}
$('#v-iyilestir').addEventListener('input',e=>{const f=e.target.dataset.iyf;if(f==='text'){IY.src={type:'paste',text:e.target.value,name:''}}else if(f)IY.set[f]=e.target.value});
$('#v-iyilestir').addEventListener('change',e=>{const p=e.target.dataset.iypick;if(p){e.target.checked?IY.picks.add(p):IY.picks.delete(p);RENDER.iyilestir()}const f=e.target.dataset.iyf;if(f&&f!=='text')IY.set[f]=e.target.value});

/* ===== 6 · AI Platform ===== */
function platRows(){const s=vstate('platform');const f=s.f;
  return [...DATA.plat.entries()].filter(([,d])=>(!f.kat||d.kat===f.kat)&&(!f.durum||d.durum===f.durum)&&(!f.ucret||d.ucret===f.ucret)&&(!f.kul||d.kullanim===f.kul)&&(!f.fav||d.favori)&&(f.ek!=='file'||!d.panelEk)&&(f.ek!=='panel'||d.panelEk)&&matches(d,s.q,['ad','kat','altKat','neIse','not']))
    .sort((a,b)=>(a[1].ad===ALL?-1:b[1].ad===ALL?1:0)||(a[1].no||0)-(b[1].no||0))}
RENDER.platform=()=>{
  const v=$('#v-platform');const s=vstate('platform',{tab:'list'});
  keepFocus(v,()=>{
    const head=`<div class="vhead"><div><h2>${esc(t('Evodak AI Platform','Evodak AI Platform'))}</h2><p>${esc(t('Kaynak: 03- Evodak AI Platformlar Liste Çalışma Rev 3. Paneldeki tek platform listesi: tüm bölümlerdeki “AI / Platform” alanı, formdaki hedef yapay zeka listesi ve sözdizimi ipuçları buradan gelir. “Panel eki” etiketli satırlar dosyada yoktu; diğer bölümlerde kullanıldığı için eklendi.','Source: 03- Evodak AI Platformlar Liste Çalışma Rev 3. The single platform list of the panel: every “AI / Platform” field, the form’s target AI list and syntax tips come from here. Rows tagged “Panel addition” were not in the file; they were added because other sections use them.'))}</p></div>
    <div class="acts">${canWrite()&&s.tab!=='ozet'?`<button class="btn primary" type="button" data-p-new>+ ${esc(s.tab==='model'?t('Yeni model','New model'):t('Yeni platform','New platform'))}</button>`:''}<button class="btn" type="button" data-p-imp>${esc(t('Dosyadan ekle','Import from file'))}</button><button class="btn" type="button" data-p-exp>${esc(t('Excel’e aktar','Export to Excel'))}</button></div></div>
    ${tabsHtml('data-ptab',s.tab,[['list',t('AI Platform Listesi','AI Platform List'),DATA.plat.size],['model',t('Modeller Karşılaştırma','Model Comparison'),DATA.model.size],['ozet',t('Kategori Özeti','Category Summary')]])}`;
    let body='';
    if(s.tab==='model'){
      const ms=[...DATA.model.entries()].sort((a,b)=>(a[1].sira||0)-(b[1].sira||0));
      const R=['aciklama','neZaman','alanlar','guclu','zayif','ipucu'].map(k=>COLDEF.model.fields.find(f=>f.k===k));
      body=loadingOr('model',ms.length?`<div class="dtw"><table class="dt" style="min-width:${220+ms.length*230}px"><thead><tr><th style="width:150px"></th>${ms.map(([i,d])=>`<th data-open="model|${i}" style="cursor:pointer">${esc(d.model)}</th>`).join('')}</tr></thead><tbody>${R.map(f=>`<tr><td><b>${esc(FL(f))}</b></td>${ms.map(([,d])=>`<td style="white-space:pre-wrap">${esc(d[f.k]||'')}</td>`).join('')}</tr>`).join('')}</tbody></table></div><p class="hint">${esc(t('Bilgiler sık değişir; model sürümleri için üreticinin güncel sayfasını kontrol edin.','This changes often; check the vendor’s current page for model versions.'))}</p>`:emptyBox(t('Model yok','No models')));
    }else if(s.tab==='ozet'){
      const g=new Map();DATA.plat.forEach(d=>{const k=d.kat||t('(boş)','(empty)');const o=g.get(k)||{n:0,durum:{},kul:0,ek:0};o.n++;o.durum[d.durum||'—']=(o.durum[d.durum||'—']||0)+1;if(d.kullanim==='Evet')o.kul++;if(d.panelEk)o.ek++;g.set(k,o)});
      const durs=[...new Set([...DATA.plat.values()].map(d=>d.durum||'—'))];
      const rows=[...g.entries()].sort((a,b)=>b[1].n-a[1].n);
      body=`<p class="hint">${esc(t('Ana kategoriye göre platform sayıları (canlı hesaplanır). Satıra tıklayınca liste o kategoriyle filtrelenir.','Platform counts per main category (live). Click a row to filter the list.'))}</p><div class="dtw"><table class="dt"><thead><tr><th>${esc(t('ANA KATEGORİ','MAIN CATEGORY'))}</th><th class="calc">${esc(t('Platform','Platforms'))}</th>${durs.map(x=>`<th class="calc">${esc(x)}</th>`).join('')}<th class="calc">${esc(t('Kullanıyoruz','In use'))}</th><th class="calc">${esc(t('Panel eki','Panel addition'))}</th></tr></thead><tbody>${rows.map(([k,o])=>`<tr data-pkat="${esc(k)}" style="cursor:pointer"><td><b>${esc(k)}</b></td><td class="num">${o.n}</td>${durs.map(x=>`<td class="num">${o.durum[x]||''}</td>`).join('')}<td class="num">${o.kul||''}</td><td class="num">${o.ek||''}</td></tr>`).join('')}<tr><td><b>${esc(t('TOPLAM','TOTAL'))}</b></td><td class="num"><b>${DATA.plat.size}</b></td>${durs.map(x=>`<td class="num">${[...DATA.plat.values()].filter(d=>(d.durum||'—')===x).length}</td>`).join('')}<td class="num">${[...DATA.plat.values()].filter(d=>d.kullanim==='Evet').length}</td><td class="num">${[...DATA.plat.values()].filter(d=>d.panelEk).length}</td></tr></tbody></table></div>`;
    }else{
      const rows=platRows();const f=s.f;
      body=`<div class="fbar"><input type="search" data-q placeholder="${esc(t('Platform adı, kategori veya ne işe yaradığında ara','Search name, category or what it does'))}" value="${esc(s.q)}">
        ${selectHtml('kat',t('Kategori','Category'),distinct('plat','kat'),f.kat)}${selectHtml('durum',t('AI durumu','AI status'),distinct('plat','durum'),f.durum)}${selectHtml('ucret',t('Ücret','Pricing'),['Ücretsiz','Freemium','Ücretli'],f.ucret)}${selectHtml('kul',t('Kullanıyor muyuz','In use'),['Evet','Denendi','Hayır'],f.kul)}${selectHtml('ek',t('Kaynak','Source'),[['file',t('Dosyadan','From file')],['panel',t('Panel eki','Panel addition')]],f.ek)}
        <label class="tg"><input type="checkbox" data-tgl="fav" ${f.fav?'checked':''}> ${esc(t('Favoriler','Favourites'))}</label>${viewToggle('platform')}<span class="cnt">${num(rows.length)} / ${num(DATA.plat.size)}</span></div>`+
        loadingOr('plat',!rows.length?emptyBox(t('Sonuç yok','No results')):vstate('platform').view==='table'?dataTable('platform','plat',rows,COLDEF.plat.fields.filter(z=>z.tbl)):`<div class="gridc">${rows.slice(0,s.limit).map(([id,d])=>{const u=usageOf(d.ad);return `<div class="pcardx" data-open="plat|${id}"><div style="display:flex;justify-content:space-between;gap:6px;align-items:flex-start"><h4>${esc(d.ad)}</h4><button class="iconbtn star ${d.favori?'on':''}" type="button" data-fav="plat|${id}" data-stop>★</button></div><span class="hint">${esc(d.kat)}${d.altKat?' · '+esc(d.altKat):''}</span><p>${esc(d.neIse)}</p><div class="foot">${d.panelEk?`<span class="badge ai">${esc(t('Panel eki','Panel addition'))}</span>`:''}${d.durum?`<span class="badge">${esc(d.durum)}</span>`:''}${d.kullanim?`<span class="badge ${d.kullanim==='Evet'?'okb':''}">${esc(t('Kullanım','In use'))}: ${esc(d.kullanim)}</span>`:''}${d.ucret?`<span class="badge">${esc(d.ucret)}</span>`:''}${u.k.length?`<span class="badge b">${u.k.length} ${esc(t('komut','commands'))}</span>`:''}${u.u.length+u.g.length?`<span class="badge g">${u.u.length+u.g.length} prompt</span>`:''}</div></div>`}).join('')}</div>${moreBtn('platform',rows.length,Math.min(rows.length,s.limit))}`);
    }
    v.innerHTML=head+body;
  });
  bindList(v,'platform',RENDER.platform);
};
$('#v-platform').addEventListener('click',e=>{
  const s=vstate('platform');
  const tb=e.target.closest('[data-ptab]');if(tb){s.tab=tb.dataset.ptab;persistVS('platform');RENDER.platform();return}
  if(e.target.closest('[data-p-new]')){s.tab==='model'?newRecord('model',{sira:DATA.model.size+1}):newRecord('plat',{durum:'AI-yerel',formGrup:[]});return}
  if(e.target.closest('[data-p-exp]')){exportSheets('03- Evodak AI Platformlar Liste Çalışma',[{name:'AI Platform Listesi',rows:toRows('plat',platRows().map(r=>r[1]))},{name:'Modeller Karşılaştırma',rows:toRows('model',[...DATA.model.values()])}]);return}
  if(e.target.closest('[data-p-imp]')){YK.target='plat';go('yukle');return}
  const k=e.target.closest('[data-pkat]');if(k){s.f={kat:k.dataset.pkat};s.tab='list';persistVS('platform');RENDER.platform()}
});
DETAIL.plat=(id,d)=>{
  const u=usageOf(d.ad);const mdl=[...DATA.model.entries()].find(([,m])=>m.platform===d.ad);
  const lst=(rows,col,f)=>rows.slice(0,15).map(([i,x])=>`<a href="#" data-open="${col}|${esc(i)}">${esc(f(x))}</a>`).join(' · ')+(rows.length>15?` · +${rows.length-15}`:'');
  return `${d.panelEk?`<div class="note"><span>${esc(t('Panel eki: bu satır kaynak dosyada yoktu; diğer bölümlerde kullanıldığı için eklendi.','Panel addition: not in the source file; added because other sections use it.'))}</span></div>`:''}`+genericDetail('plat',Object.assign({},d,{formGrup:arr(d.formGrup)}))+
  `${mdl?`<div class="note"><span><b>${esc(t('Uzman ipucu','Expert tip'))} (${esc(mdl[1].model)}):</b> ${esc(mdl[1].ipucu)}</span><button class="btn sm" type="button" data-open="model|${mdl[0]}">${esc(t('Karşılaştırma','Comparison'))}</button></div>`:''}
  <div class="card"><header><h3>${esc(t('Bu platformun komut ve promptları','Commands and prompts for this platform'))} (${u.k.length})</h3></header><div class="cbody" style="font-size:13px">${u.k.length?lst(u.k,'kod',x=>x.kod||x.baslikTr):`<span class="hint">${esc(t('Yok','None'))}</span>`}</div></div>
  <div class="card"><header><h3>${esc(t('Uzun ve kayıtlı promptlar','Long and saved prompts'))} (${u.u.length+u.g.length})</h3></header><div class="cbody" style="font-size:13px">${u.u.length?`<div><b>${esc(t('Uzun Prompt','Long Prompt'))}:</b> ${lst(u.u,'uzun',x=>x.baslikTr||x.baslikEn)}</div>`:''}${u.g.length?`<div><b>${esc(t('Kayıtlı Promptlar','Saved Prompts'))}:</b> ${lst(u.g,'gecmis',x=>x.baslik)}</div>`:''}${!u.u.length&&!u.g.length?`<span class="hint">${esc(t('Yok','None'))}</span>`:''}</div></div>`;
};
DACTS.plat=(id,d)=>d.web?`<a class="btn" href="${esc(/^https?:/.test(d.web)?d.web:'https://'+d.web)}" target="_blank" rel="noopener">${esc(t('Siteyi aç','Open site'))}</a>`:'';
DACTS.model=()=>'';

/* ===== Yükle & Aktar ===== */
const YK={target:'auto',items:[],busy:false,log:[],paste:'',pasteTarget:'uzun'};
const TNAME=c=>({kod:t('Kod & Command','Code & Command'),kodref:t('Referans Bilgi','Reference Info'),uzun:t('Uzun Prompt','Long Prompt'),gecmis:t('Kayıtlı Promptlar','Saved Prompts'),plat:'AI Platform'})[c]||c;
const HKEY=s=>norm(s).replace(/katagori/g,'kategori').replace(/\s+/g,' ').trim();
const SIGS=[['kod',['kod / command','tur (tr)']],['kodref',['referans turu','kalem (tr)']],['uzun',['prompt basligi (tr)']],['plat',['ai platform','ne ise yarar']],['gecmis',['baslik','prompt metni']]];
function detectSheet(aoa){
  for(let r=0;r<Math.min(8,aoa.length);r++){const hs=(aoa[r]||[]).map(HKEY);for(const [col,keys] of SIGS){if(keys.every(k=>hs.includes(k)))return {col,hr:r,hs}}}
  return null}
function mapStructured(col,hs,rows,src){
  const fmap={};COLDEF[col].fields.forEach(f=>{if(f.calc||f.virt)return;[f.tr,f.en].forEach(h=>{fmap[HKEY(h)]=f})});
  if(col==='uzun'){fmap[HKEY('Aİ Platform')]=fmap[HKEY('AI Platform')]}
  const out=[];
  rows.forEach(r=>{if(!r||!r.some(c=>String(c??'').trim()))return;const data={};
    hs.forEach((h,i)=>{const f=fmap[h];if(!f)return;let v=r[i];if(v===undefined||v===null)return;v=typeof v==='string'?v.trim():v;if(v==='')return;
      if(f.type==='num'||f.k==='puan'){const n=Number(v);v=isNaN(n)?v:n}else if(f.type==='plat'||f.type==='multi'){v=String(v).split(/\s*[,;]\s*/).filter(Boolean)}else v=String(v);data[f.k]=v});
    if(!Object.keys(data).length)return;
    let id=null;
    if(col==='kod'||col==='kodref'){if(data.id&&DATA[col].has(data.id))id=data.id}
    else if(col==='uzun'){const ex=[...DATA.uzun.entries()].find(([,d])=>d.no===data.no);if(ex)id=ex[0]}
    else if(col==='plat'){const p=platList().find(p=>trLower(p.ad)===trLower(data.ad||''));if(p)id=p.id}
    else if(col==='gecmis'){const ex=[...DATA.gecmis.entries()].find(([,d])=>trLower(d.baslik)===trLower(data.baslik||''));if(ex)id=ex[0]}
    if(col!=='kod'&&col!=='kodref')delete data.id;
    const old=id?DATA[col].get(id):null;
    const ch=old?Object.keys(data).filter(k=>k!=='id'&&JSON.stringify(old[k]??'')!==JSON.stringify(data[k])):Object.keys(data);
    out.push({kind:'s',col,id,data,title:COLDEF[col].title(Object.assign({},old||{},data))||'—',state:old?(ch.length?'upd':'same'):'new',ch,sec:!old||ch.length>0,src})});
  return out}
async function aiExtract(text,name,images){
  const prompt=`Aşağıdaki içerikten (${name}) yapay zeka komutlarını, promptlarını ve platformlarını çıkar; bir prompt kütüphanesine aktarılacak kayıtlara dönüştür.
Hedef${YK.target!=='auto'?` (kullanıcı belirledi: "${YK.target}", tüm kayıtlar bu hedefe gitsin)`:''}:
- "kod": slash komutları (/swot gibi), kısa kodlar, değişkenli prompt şablonları
- "uzun": başkasının hazırladığı, birkaç cümle veya daha uzun hazır promptlar
- "gecmis": kullanıcının kendi hazırladığı veya kullandığı promptlar (ön prompt formu, meta-prompt, nihai prompt). Birden çok prompt varsa her biri ayrı kayıt.
- "plat": yapay zeka araçları / platformlar
Alanlar: "hedef", "kod" (yalnız kod için, / ile başlar), "baslik" (kısa Türkçe ad), "baslikEn", "metin" (TAM metin; kısaltma), "metinEn", "aciklama" (ne işe yaradığı, Türkçe), "aciklamaEn", "altKat" (kod için şunlardan biri: ${JSON.stringify((KMETA().kategoriler||[]).map(k=>k.etiket))}), "tur" (kod için: ${JSON.stringify(listOf('Tür (TR)'))}; gecmis için: "Ön prompt formu" | "Meta-prompt" | "Nihai prompt"), "kategori" (uzun ve plat için), "platform" (metin; bilinen adlar: ${JSON.stringify(platNames().slice(0,60))}; genel sohbet modelleri için "${ALL}").
Prompt metinlerini olduğu gibi koru. Bulamadığın alanı boş bırak. Yanıt: {"items":[...]}

İÇERİK:
${text}`;
  const r=await LLM.json(prompt,{images});
  return arr(r&&r.items).map(x=>{const h=YK.target!=='auto'?YK.target:(['kod','uzun','gecmis','plat'].includes(x.hedef)?x.hedef:'uzun');return {kind:'ai',col:h,raw:{kod:String(x.kod||'').trim(),baslik:String(x.baslik||'').trim(),baslikEn:String(x.baslikEn||''),metin:String(x.metin||'').trim(),metinEn:String(x.metinEn||''),aciklama:String(x.aciklama||'').trim(),aciklamaEn:String(x.aciklamaEn||''),altKat:String(x.altKat||''),tur:String(x.tur||''),kategori:String(x.kategori||''),platform:String(x.platform||'')},state:'new',sec:true}})}
function aiToData(it){const x=it.raw;
  if(it.col==='kod'){const ok=(KMETA().kategoriler||[]).some(k=>k.etiket===x.altKat);return {altKat:ok?x.altKat:'',tur:listOf('Tür (TR)').includes(x.tur)?x.tur:(x.kod?'Slash Komut':'Prompt Şablonu (değişkenli)'),kod:x.kod,platform:x.platform||ALL,baslikTr:x.baslik,baslikEn:x.baslikEn,aciklamaTr:x.aciklama,aciklamaEn:x.aciklamaEn,metinTr:x.metin,metinEn:x.metinEn,durum:'Yeni / İşlenmedi',kaynak:it.src||'',kaynakDosya:it.src||''}}
  if(it.col==='uzun')return {platform:x.platform||ALL,katTr:x.kategori,baslikTr:x.baslik,baslikEn:x.baslikEn,metinTr:x.metin,metinEn:x.metinEn,not:x.aciklama};
  if(it.col==='plat')return {ad:x.baslik,kat:x.kategori,neIse:x.aciklama,durum:'',formGrup:[]};
  return {baslik:x.baslik||t('İçe aktarılan prompt','Imported prompt'),tur:TUR_G.includes(x.tur)?x.tur:'Nihai prompt',durum:'Tamam',metin:x.metin||x.aciklama,platform:platTokens(x.platform).filter(p=>platByName(p)),dil:[],bagli:[],revNo:1,kaynakDosya:it.src||'',kullanimNotu:x.aciklama&&x.aciklama!==x.metin?x.aciklama:''}}
function dupOfAi(it){const x=it.raw;
  if(it.col==='kod'&&x.kod){const f=findCmd(x.kod);return f?f[0]:null}
  if(it.col==='plat'){const p=platByName(x.baslik);return p?p.id:null}
  const nt=norm(x.baslik),nm=norm(x.metin).slice(0,90);
  for(const [i,d] of DATA[it.col]){const tt=norm(d.baslikTr||d.baslik||'');const m=norm(d.metinTr||d.metin||'').slice(0,90);if((nt&&tt===nt)||(nm.length>40&&m===nm))return i}
  return null}
async function ykFiles(files){
  YK.busy=true;RENDER.yukle();
  for(const f of files){
    const entry={name:f.name,state:t('okunuyor','reading'),n:0};YK.log.unshift(entry);RENDER.yukle();
    try{
      const k=kindOf(f);let items=[];
      if(k==='sheet'){const wb=await readWorkbook(f);
        for(const sn of wb.SheetNames){const aoa=window.XLSX.utils.sheet_to_json(wb.Sheets[sn],{header:1,defval:'',raw:true});const det=detectSheet(aoa);
          if(det){const col=YK.target!=='auto'&&YK.target!==det.col&&!(YK.target==='kod'&&det.col==='kodref')?null:det.col;if(!col)continue;items.push(...mapStructured(col,det.hs,aoa.slice(det.hr+1),f.name+' / '+sn))}
          else if(LLM.ready()&&!/kılavuz|kilavuz|liste|rapor|eşleme|esleme|harita|günlük|gunluk|özet|ozet/i.test(sn)){entry.state=t('AI çıkarıyor','AI extracting');RENDER.yukle();const csv=window.XLSX.utils.sheet_to_csv(wb.Sheets[sn]);for(let i=0;i<csv.length&&i<240000;i+=45000)items.push(...(await aiExtract(csv.slice(i,i+45000),f.name+' / '+sn)).map(m=>Object.assign(m,{src:f.name+' / '+sn})))}
        }
      }else if(k==='image'){
        if(!LLM.ready())throw new Error(t('Görsel okumak için Anthropic API anahtarı gerekir','Reading images needs an Anthropic API key'));
        entry.state=t('AI okuyor','AI reading');RENDER.yukle();items=(await aiExtract('(içerik ekteki görselde)',f.name,[f])).map(m=>Object.assign(m,{src:f.name}));
      }else if(['pdf','docx','text'].includes(k)){
        const x=await readDocText(f);if(!x.trim())throw new Error(t('Okunabilir metin yok','No readable text'));
        if(!LLM.ready()){items=[{kind:'ai',col:YK.target==='auto'?'gecmis':YK.target,raw:{kod:'',baslik:f.name.replace(/\.[^.]+$/,''),baslikEn:'',metin:x,metinEn:'',aciklama:'',aciklamaEn:'',altKat:'',tur:'Nihai prompt',kategori:'',platform:''},state:'new',sec:true,src:f.name}]}
        else{entry.state=t('AI çıkarıyor','AI extracting');RENDER.yukle();for(let i=0;i<x.length&&i<240000;i+=45000)items.push(...(await aiExtract(x.slice(i,i+45000),f.name)).map(m=>Object.assign(m,{src:f.name})))}
      }else throw new Error(t('Bu dosya türü okunamıyor','This file type cannot be read')+' ('+(f.type||extOf(f.name))+')');
      items.forEach(it=>{it.key=uid('y');if(it.kind==='ai'){it.dup=dupOfAi(it);if(it.dup){it.sec=false;it.state='dup'}}});YK.items.push(...items);
      entry.state='ok';entry.n=items.length;
    }catch(e){entry.state='err';entry.err=e.message||String(e)}
    RENDER.yukle();
  }
  YK.busy=false;RENDER.yukle();
}
const YST=()=>({new:['okb',t('yeni','new')],upd:['ai',t('güncellenecek','update')],same:['',t('aynı','unchanged')],dup:['ai',t('tekrar','duplicate')]});
RENDER.yukle=()=>{
  const v=$('#v-yukle');const sel=YK.items.filter(x=>x.sec).length;
  const cnt={};YK.items.forEach(x=>{cnt[x.state]=(cnt[x.state]||0)+1});
  v.innerHTML=`<div class="vhead"><div><h2>${esc(t('Yükle & Aktar','Upload & Import'))}</h2><p>${esc(t('Excel, Word, PDF, metin veya ekran görüntüsü yükleyin. Panelin kaynak dosyaları (Kod & Command Rev 3, Uzun Prompt Rev 2, AI Platform Rev 3) ve panelin Excel çıktıları sütun başlıklarından doğrudan tanınır: ID / No / ad aynı olan satırlar “güncellenecek”, yeniler “yeni” olarak gösterilir. Diğer dosyalardaki promptları AI ayıklar. Onayladığınız satırlar tek seferde kaydedilir ve günlüğe yazılır.','Upload Excel, Word, PDF, text or screenshots. The panel’s source files (Code & Command Rev 3, Long Prompt Rev 2, AI Platform Rev 3) and its own Excel exports are recognised from their headers: rows with the same ID / No / name are shown as “update”, others as “new”. AI extracts prompts from other files. Approved rows are saved in one go and logged.'))}</p></div></div>
  ${!LLM.ready()?`<div class="note"><span>${esc(t('Anthropic API anahtarı yok: yalnızca tanınan Excel dosyaları satır satır aktarılır; diğer dosyalar tek kayıt olarak eklenir.','No Anthropic API key: only recognised Excel files are imported row by row; other files are added as a single record.'))}</span></div>`:''}
  <div class="cols2">
    <div class="card"><header><h3>${esc(t('Dosya yükle','Upload files'))}</h3></header><div class="cbody">
      <div class="fld"><label for="ykT">${esc(t('Hedef bölüm','Target section'))}</label><select id="ykT" data-ykt>${[['auto',t('Otomatik (dosyaya göre)','Automatic (by file)')],['kod',TNAME('kod')],['uzun',TNAME('uzun')],['gecmis',TNAME('gecmis')],['plat',TNAME('plat')]].map(([k,l])=>`<option value="${k}" ${YK.target===k?'selected':''}>${esc(l)}</option>`).join('')}</select></div>
      <div class="drop" data-ykdrop tabindex="0" role="button"><b>${esc(t('Dosyaları buraya bırakın veya tıklayıp seçin','Drop files here or click to choose'))}</b><span>Excel (.xlsx, .csv) · Word (.docx) · PDF · ${esc(t('metin','text'))} · ${esc(t('görsel / ekran görüntüsü','image / screenshot'))}</span></div>
      ${YK.log.length?`<div class="queue">${YK.log.slice(0,8).map(l=>`<div class="q"><span>${esc(l.name)}</span><span>${l.state==='ok'?`<span class="badge okb">${l.n} ${esc(t('satır','rows'))}</span>`:l.state==='err'?`<span class="badge badb" title="${esc(l.err)}">${esc(t('hata','error'))}: ${esc(l.err)}</span>`:`<span class="spin"></span> ${esc(l.state)}`}</span></div>`).join('')}</div>`:''}
    </div></div>
    <div class="card"><header><h3>${esc(t('Kopyala-yapıştır ile prompt ekle','Add a prompt by pasting'))}</h3></header><div class="cbody">
      <div class="fld"><label for="ykP">${esc(t('Prompt metni','Prompt text'))}</label><textarea id="ykP" data-ykp style="min-height:150px;font-family:var(--f-mono);font-size:12.5px">${esc(YK.paste)}</textarea></div>
      <div style="display:flex;gap:8px;flex-wrap:wrap;align-items:center"><select data-ykpt>${['uzun','gecmis','kod'].map(k=>`<option value="${k}" ${YK.pasteTarget===k?'selected':''}>${esc(TNAME(k))}</option>`).join('')}</select>
      <button class="btn primary" type="button" data-ykpaste ${YK.busy?'disabled':''}>${esc(LLM.ready()?t('Ayrıştır ve önizle','Parse and preview'):t('Önizlemeye ekle','Add to preview'))}</button></div>
    </div></div>
  </div>
  ${YK.items.length?`<div class="card"><header><h3>${esc(t('Önizleme','Preview'))} (${YK.items.length} · ${Object.entries(cnt).map(([k,n])=>n+' '+(YST()[k]||['',k])[1]).join(' · ')})</h3><div style="display:flex;gap:6px;flex-wrap:wrap"><button class="btn sm" type="button" data-ykall>${esc(t('Tümünü seç','Select all'))}</button><button class="btn sm" type="button" data-yknone>${esc(t('Seçimi kaldır','Select none'))}</button><button class="btn sm" type="button" data-ykclear>${esc(t('Listeyi temizle','Clear list'))}</button><button class="btn primary" type="button" data-ykgo ${!sel||YK.busy?'disabled':''}>${esc(t('Seçilenleri kaydet','Save selected'))} (${sel})</button></div></header>
  <div class="ptable"><table><thead><tr><th style="width:30px"></th><th style="width:150px">${esc(t('Hedef','Target'))}</th><th style="width:240px">${esc(t('Başlık / kod','Title / code'))}</th><th>${esc(t('Ayrıntı','Details'))}</th><th style="width:140px">${esc(t('Durum','State'))}</th></tr></thead><tbody>
  ${YK.items.slice(0,400).map((it,i)=>{const st=YST()[it.state]||['',it.state];return `<tr class="${it.state==='dup'||it.state==='same'?'dup':''}"><td><input type="checkbox" data-yks="${i}" ${it.sec?'checked':''}></td>
  <td>${it.kind==='ai'?`<select data-ykf="${i}|col">${['kod','uzun','gecmis','plat'].map(k=>`<option value="${k}" ${it.col===k?'selected':''}>${esc(TNAME(k))}</option>`).join('')}</select>`:esc(TNAME(it.col))}</td>
  <td>${it.kind==='ai'?`${it.col==='kod'?`<input data-ykf="${i}|kod" value="${esc(it.raw.kod)}" class="mono" placeholder="/kod">`:''}<input data-ykf="${i}|baslik" value="${esc(it.raw.baslik)}">`:`${it.id?`<span class="hint mono">${esc(it.id)}</span> `:''}${esc(it.title)}`}</td>
  <td>${it.kind==='ai'?`<textarea data-ykf="${i}|aciklama" placeholder="${esc(t('Açıklama','Description'))}">${esc(it.raw.aciklama)}</textarea>${it.raw.metin?`<details><summary class="hint">${esc(t('Metin','Text'))} (${num(it.raw.metin.length)})</summary><textarea data-ykf="${i}|metin" style="min-height:120px">${esc(it.raw.metin)}</textarea></details>`:''}`:it.state==='upd'?`<span class="hint">${esc(t('Değişen alanlar','Changed fields'))}: ${esc(it.ch.map(k=>flab(it.col,k)).join(', '))}</span>`:it.state==='new'?`<span class="hint">${esc(Object.keys(it.data).length)} ${esc(t('alan','fields'))}</span>`:''}</td>
  <td><span class="badge ${st[0]}">${esc(st[1])}</span>${it.dup?` <a href="#" data-open="${it.col}|${esc(it.dup)}">${esc(it.dup)}</a>`:''}<div class="hint">${esc(it.src||'')}</div></td></tr>`}).join('')}
  </tbody></table></div>${YK.items.length>400?`<p class="hint">${esc(t(`İlk 400 satır gösteriliyor; seçim tüm satırlara uygulanır.`,`Showing the first 400 rows; selection applies to all rows.`))}</p>`:''}<p class="hint">${esc(t('Dosyadaki boş hücreler paneldeki mevcut değeri silmez.','Empty cells in the file do not erase existing values.'))}</p></div>`:''}`;
};
$('#v-yukle').addEventListener('click',async e=>{
  if(e.target.closest('[data-ykdrop]')){pickFiles(ykFiles);return}
  if(e.target.closest('[data-ykall]')){YK.items.forEach(x=>x.sec=x.state!=='same');RENDER.yukle();return}
  if(e.target.closest('[data-yknone]')){YK.items.forEach(x=>x.sec=false);RENDER.yukle();return}
  if(e.target.closest('[data-ykclear]')){YK.items=[];YK.log=[];RENDER.yukle();return}
  if(e.target.closest('[data-ykpaste]')){
    const x=YK.paste.trim();if(!x){toast(t('Önce metni yapıştırın.','Paste the text first.'));return}
    const tgt=YK.pasteTarget;
    if(LLM.ready()){YK.busy=true;RENDER.yukle();const keep=YK.target;YK.target=tgt;try{const its=await aiExtract(x.slice(0,60000),'yapıştırılan metin');its.forEach(it=>{it.src=t('Kopyala-yapıştır','Paste');it.key=uid('y');if(its.length===1&&tgt!=='kod')it.raw.metin=x;it.dup=dupOfAi(it);if(it.dup){it.sec=false;it.state='dup'}});YK.items.push(...its);YK.paste=''}catch(err){toast(t('Ayrıştırılamadı: ','Could not parse: ')+err.message,5000)}YK.target=keep;YK.busy=false}
    else{const it={kind:'ai',col:tgt,raw:{kod:'',baslik:x.split('\n')[0].slice(0,80),baslikEn:'',metin:x,metinEn:'',aciklama:'',aciklamaEn:'',altKat:'',tur:'',kategori:'',platform:''},state:'new',sec:true,src:t('Kopyala-yapıştır','Paste'),key:uid('y')};it.dup=dupOfAi(it);if(it.dup){it.sec=false;it.state='dup'}YK.items.push(it);YK.paste=''}
    RENDER.yukle();return}
  if(e.target.closest('[data-ykgo]')){await ykCommit();return}
});
$('#v-yukle').addEventListener('change',e=>{
  const x=e.target;
  if(x.dataset.ykt!==undefined){YK.target=x.value;return}
  if(x.dataset.ykpt!==undefined){YK.pasteTarget=x.value;return}
  if(x.dataset.yks){YK.items[+x.dataset.yks].sec=x.checked;RENDER.yukle();return}
  if(x.dataset.ykf){const [i,k]=x.dataset.ykf.split('|');const it=YK.items[+i];if(k==='col'){it.col=x.value}else it.raw[k]=x.value;if(['col','kod','baslik'].includes(k)){it.dup=dupOfAi(it);it.state=it.dup?'dup':'new';RENDER.yukle()}}
});
$('#v-yukle').addEventListener('input',e=>{if(e.target.dataset.ykp!==undefined)YK.paste=e.target.value});
$('#v-yukle').addEventListener('dragover',e=>{const d=e.target.closest('[data-ykdrop]');if(d){e.preventDefault();d.classList.add('over')}});
$('#v-yukle').addEventListener('dragleave',e=>{const d=e.target.closest('[data-ykdrop]');if(d)d.classList.remove('over')});
$('#v-yukle').addEventListener('drop',e=>{const d=e.target.closest('[data-ykdrop]');if(d){e.preventDefault();d.classList.remove('over');ykFiles([...e.dataTransfer.files])}});
async function ykCommit(){
  if(!guard())return;const items=YK.items.filter(x=>x.sec);if(!items.length)return;YK.busy=true;RENDER.yukle();
  const by={};const next={};
  const newId=col=>{const p=COLDEF[col].prefix;if(!(col in next)){const nums=[...DATA[col].keys()].map(k=>k.startsWith(p)?parseInt(k.slice(p.length).replace(/\D/g,''),10):NaN).filter(n=>!isNaN(n));next[col]=nums.length?Math.max(...nums):0}next[col]++;
    if(p==='PR-'||p==='RF-')return p+String(next[col]).padStart(4,'0');if(p==='u')return 'u'+String(next[col]).padStart(4,'0');if(p==='p')return 'p'+String(next[col]).padStart(3,'0');return uid(p)};
  const maxNo=col=>Math.max(0,...[...DATA[col].values()].map(d=>Number(d.no)||0));const noNext={uzun:maxNo('uzun'),plat:maxNo('plat')};
  const today_=()=>{const d=new Date();return String(d.getDate()).padStart(2,'0')+'.'+String(d.getMonth()+1).padStart(2,'0')+'.'+d.getFullYear()};
  for(const it of items){const col=it.col;let id=it.id,data=it.kind==='ai'?aiToData(it):Object.assign({},it.data);
    if(!id){if((col==='kod'||col==='kodref')&&data.id&&!DATA[col].has(data.id))id=data.id;else id=newId(col)}
    delete data.id;
    if(!DATA[col].has(id)){if(col==='uzun'&&!data.no)data.no=++noNext.uzun;if(col==='plat'&&!data.no)data.no=++noNext.plat;if(col==='kod'){if(!data.tarih)data.tarih=today_();if(!data.durum)data.durum='Yeni / İşlenmedi'}}
    (by[col]=by[col]||[]).push({id,data,it})}
  let ok=0,fail=0;
  for(const [col,list] of Object.entries(by)){
    try{for(let i=0;i<list.length;i+=400){const part=list.slice(i,i+400);await saveMany(col,part.map(({id,data})=>({id,data})),{note:t('Yükle & Aktar','Upload & Import')});part.forEach(x=>x.it.done=true);ok+=part.length}}
    catch(e){fail+=list.filter(x=>!x.it.done).length;if(e.message!=='no-write')toast(TNAME(col)+': '+e.message,5000)}}
  YK.items=YK.items.filter(x=>!x.done);YK.busy=false;RENDER.yukle();
  toast(t(`${ok} kayıt kaydedildi${fail?`, ${fail} kaydedilemedi`:''}`,`${ok} records saved${fail?`, ${fail} failed`:''}`),4500);
}

/* ===== Değişiklik Günlüğü ===== */
RENDER.gunluk=()=>{
  const v=$('#v-gunluk');const s=vstate('gunluk');
  const rows=LOG.filter(l=>(!s.f.col||l.col===s.f.col)&&(!s.f.act||l.action===s.f.act)&&(!s.f.by||l.by===s.f.by)&&(!s.q||norm((l.title||'')+' '+(l.docId||'')+' '+(l.note||'')).includes(norm(s.q))));
  const users=[...new Set(LOG.map(l=>l.by).filter(Boolean))];
  keepFocus(v,()=>{
    v.innerHTML=`<div class="vhead"><div><h2>${esc(t('Değişiklik Günlüğü','Change Log'))}</h2><p>${esc(t('Panelde yapılan her ekleme, düzeltme ve silme; kimin yaptığı, ne zaman yapıldığı ve eski / yeni değerleriyle birlikte saklanır. Her kayıt aynı zamanda GitHub’da bir sürümdür (commit). “Geri al” ile herhangi bir işlemi geri alabilirsiniz; geri alma da günlüğe yazılır.','Every addition, edit and deletion is kept with who did it, when, and the old / new values. Each save is also a version (commit) on GitHub. “Undo” reverts any change and is logged too.'))}</p></div><div class="acts"><a class="btn" href="${GH.web()}/commits/${GH.branch}" target="_blank" rel="noopener">${esc(t('GitHub sürüm geçmişi','GitHub version history'))} ↗</a></div></div>
    <div class="fbar"><input type="search" data-q placeholder="${esc(t('Kayıt adı, ID veya notta ara','Search name, ID or note'))}" value="${esc(s.q)}">${selectHtml('col',t('Bölüm','Section'),Object.keys(COLDEF).map(c=>[c,COLDEF[c].name()]).concat([['kodmeta',t('Kod & Command listeleri','Code & Command lists')]]),s.f.col)}${selectHtml('act',t('İşlem','Action'),['ekle','düzenle','sil','geri al','kurulum'].map(a=>[a,isEN()?ACT_EN[a]:a]),s.f.act)}${selectHtml('by',t('Kişi','Person'),users,s.f.by)}<span class="cnt">${num(rows.length)} ${esc(t('işlem','changes'))}</span></div>
    ${rows.length?`<div class="card"><div class="cbody"><div class="hist">${rows.slice(0,s.limit).map(l=>logItem(l)).join('')}</div>${moreBtn('gunluk',rows.length,Math.min(rows.length,s.limit))}</div></div>`:emptyBox(t('İşlem yok','No changes'))}`;
  });
  bindList(v,'gunluk',RENDER.gunluk);
};

/* ===== Genel arama ===== */
RENDER.ara=()=>{
  const q=$('#gq').value.trim();const v=$('#v-ara');
  if(!q){go('ana');return}
  const grp=[['kod','kod',['id','kod','alias','baslikTr','baslikEn','aciklamaTr','aciklamaEn','metinTr','metinEn'],d=>(d.kod?d.kod+' · ':'')+pick(d,'baslikTr','baslikEn'),d=>pick(d,'aciklamaTr','aciklamaEn')],['kodref','kod',['kalemTr','kalemEn','aciklamaTr','konu','arac'],d=>pick(d,'kalemTr','kalemEn'),d=>pick(d,'aciklamaTr','aciklamaEn')],['uzun','uzun',['baslikTr','baslikEn','metinTr','metinEn'],d=>pick(d,'baslikTr','baslikEn'),d=>pick(d,'metinTr','metinEn')],['gecmis','gecmis',['baslik','konu','metin'],d=>d.baslik,d=>d.konu||d.metin],['plat','platform',['ad','kat','neIse'],d=>d.ad,d=>d.neIse],['model','platform',['model','aciklama'],d=>d.model,d=>d.aciklama]];
  let total=0;
  const html=grp.map(([c,view,keys,ti,ds])=>{const r=[...DATA[c].entries()].filter(([,d])=>matches(d,q,keys));total+=r.length;if(!r.length)return '';return `<div class="card"><header><h3>${esc(COLDEF[c].name())} (${r.length})</h3>${r.length>8&&c!=='model'?`<button class="btn sm" type="button" data-gall="${c}|${view}">${esc(t('Bölümde göster','Show in section'))}</button>`:''}</header><div class="list" style="border:0">${r.slice(0,8).map(([i,d])=>`<div class="item" data-open="${c}|${esc(i)}"><div class="main"><div class="t1"><b>${esc(ti(d))}</b>${c==='kod'?turBadge(d.tur):''}</div><div class="desc">${esc(ds(d)||'')}</div></div></div>`).join('')}</div></div>`}).join('');
  v.innerHTML=`<div class="vhead"><div><h2>"${esc(q)}" ${esc(t('için sonuçlar','results'))}</h2><p>${num(total)} ${esc(t('kayıt bulundu.','records found.'))}</p></div><div class="acts"><button class="btn" type="button" data-gclear>${esc(t('Aramayı temizle','Clear search'))}</button></div></div>${html||emptyBox(t('Sonuç yok','No results'),t('Farklı bir kelime deneyin.','Try another word.'))}`;
};
$('#v-ara').addEventListener('click',e=>{
  if(e.target.closest('[data-gclear]')){$('#gq').value='';go('ana');return}
  const g=e.target.closest('[data-gall]');if(g){const [c,view]=g.dataset.gall.split('|');const q=$('#gq').value.trim();if(c==='kodref'){vstate('kod').tab='ref';vstate('kodref').q=q}else{vstate(view).q=q;if(view==='kod')vstate('kod').tab='lib';if(view==='uzun')vstate('uzun').tab='list';if(view==='platform')vstate('platform').tab='list'}go(view)}
});
$('#gq').addEventListener('input',debounce(()=>{if($('#gq').value.trim())go('ara');else if(CUR==='ara')go('ana')},220));
document.addEventListener('keydown',e=>{if(e.key==='/'&&!/INPUT|TEXTAREA|SELECT/.test(document.activeElement.tagName)){e.preventDefault();$('#gq').focus()}});

/* ===== Ayarlar ===== */
const PANEL_WEB=`https://${GH.owner}.github.io/${GH.repo}/`;
RENDER.ayar=()=>{
  const v=$('#v-ayar');const mask=s=>s?s.slice(0,7)+'…'+s.slice(-4):'';
  v.innerHTML=`<div class="vhead"><div><h2>${esc(t('Ayarlar','Settings'))}</h2><p>${esc(t('Bu ayarlar yalnızca bu cihazda (bu tarayıcıda) saklanır. Anahtarlar hiçbir zaman veri deposuna yazılmaz.','These settings are stored only on this device (this browser). Keys are never written to the data repository.'))}</p></div></div>
  <div class="cols2">
  <div class="card"><header><h3>1 · ${esc(t('GitHub bağlantısı (kaydetmek için)','GitHub connection (to save)'))}</h3><span class="conn ${canWrite()?'ok':CFG.token?'ro':'off'}" style="position:static"><i></i><span>${esc(canWrite()?GH.user+' · '+t('yazabilir','can write'):CFG.token?(GH.user?GH.user+' · ':'')+t('yazma izni yok','no write access'):t('bağlı değil','not connected'))}</span></span></header><div class="cbody">
    <p class="hint" style="margin:0">${esc(t('Veri deposu','Data repository'))}: <a href="${GH.web()}" target="_blank" rel="noopener">${esc(GH.owner+'/'+GH.repo)}</a>${GH.priv?' · '+esc(t('gizli','private')):STATE.online?' · <b style="color:var(--bad)">'+esc(t('herkese açık','public'))+'</b>':''}</p>
    <div class="fld"><label for="cfgTok">${esc(t('GitHub erişim anahtarı (fine-grained token)','GitHub access token (fine-grained)'))}</label><input id="cfgTok" type="password" autocomplete="off" placeholder="${esc(CFG.token?mask(CFG.token):'github_pat_…')}"></div>
    <div style="display:flex;gap:8px;flex-wrap:wrap"><button class="btn primary" type="button" data-cfg="tok">${esc(t('Kaydet ve bağlan','Save and connect'))}</button>${CFG.token?`<button class="btn danger" type="button" data-cfg="untok">${esc(t('Bağlantıyı kes','Disconnect'))}</button>`:''}</div>
    <details><summary><b>${esc(t('Anahtar nasıl alınır? (ekipteki her kişi bir kez)','How to get a token (once per team member)'))}</b></summary><ol style="margin:8px 0;padding-left:20px;font-size:13.5px;line-height:1.55">
      <li>${t('Depo sahibi, ekip arkadaşını GitHub’da <b>Settings → Collaborators → Add people</b> ile depoya ekler.','The repository owner adds the teammate under <b>Settings → Collaborators → Add people</b>.')}</li>
      <li>${t('Kişi kendi hesabıyla <a href="https://github.com/settings/personal-access-tokens/new" target="_blank" rel="noopener">github.com/settings/personal-access-tokens/new</a> sayfasını açar.','The person opens <a href="https://github.com/settings/personal-access-tokens/new" target="_blank" rel="noopener">github.com/settings/personal-access-tokens/new</a> with their own account.')}</li>
      <li>${t(`<b>Resource owner</b>: ${esc(GH.owner)} · <b>Repository access</b>: Only select repositories → <b>${esc(GH.repo)}</b>`,`<b>Resource owner</b>: ${esc(GH.owner)} · <b>Repository access</b>: Only select repositories → <b>${esc(GH.repo)}</b>`)}</li>
      <li>${t('<b>Permissions → Repository permissions → Contents: Read and write</b>. Süre: 1 yıl önerilir.','<b>Permissions → Repository permissions → Contents: Read and write</b>. Expiry: 1 year recommended.')}</li>
      <li>${t('“Generate token” → çıkan <code>github_pat_…</code> metnini kopyalayıp yukarıya yapıştırın. Telefonda ve bilgisayarda ayrı ayrı bir kez girilir.','“Generate token” → copy the <code>github_pat_…</code> text and paste it above. Enter it once on each device.')}</li></ol></details>
  </div></div>
  <div class="card"><header><h3>2 · ${esc(t('Yapay zeka (AI özellikleri için)','AI (for AI features)'))}</h3><span class="conn ${LLM.ready()?'ok':'off'}" style="position:static"><i></i><span>${esc(LLM.ready()?t('hazır','ready'):t('anahtar yok','no key'))}</span></span></header><div class="cbody">
    <p class="hint" style="margin:0">${esc(t('Formda “AI ile nihai promptu üret”, dosya analizi, boş alanları AI ile doldurma, Prompt İyileştirme ve dosyadan AI ile ayıklama bu anahtarla çalışır. Anthropic API ücretli bir hizmettir; kullanım kadar ödenir.','“Generate final prompt with AI”, file analysis, AI auto-fill, Prompt Improvement and AI extraction use this key. The Anthropic API is a paid, pay-as-you-go service.'))}</p>
    <div class="fld"><label for="cfgAi">${esc(t('Anthropic API anahtarı','Anthropic API key'))}</label><input id="cfgAi" type="password" autocomplete="off" placeholder="${esc(CFG.aiKey?mask(CFG.aiKey):'sk-ant-…')}"><span class="hint"><a href="https://console.anthropic.com/settings/keys" target="_blank" rel="noopener">console.anthropic.com → API Keys</a></span></div>
    <div class="fld"><label for="cfgM1">${esc(t('Model (günlük işler)','Model (everyday tasks)'))}</label><input id="cfgM1" value="${esc(CFG.aiModel)}" class="mono"></div>
    <div class="fld"><label for="cfgM2">${esc(t('Model (nihai prompt ve iyileştirme)','Model (final prompt and improvement)'))}</label><input id="cfgM2" value="${esc(CFG.aiModelBig)}" class="mono"></div>
    <div style="display:flex;gap:8px;flex-wrap:wrap"><button class="btn primary" type="button" data-cfg="ai">${esc(t('Kaydet','Save'))}</button>${CFG.aiKey?`<button class="btn" type="button" data-cfg="aitest">${esc(t('Dene','Test'))}</button><button class="btn danger" type="button" data-cfg="unai">${esc(t('Anahtarı sil','Remove key'))}</button>`:''}</div>
    <p class="hint" style="margin:0">${esc(t('Anahtar olmadan da panel tam çalışır: form ön promptu üretir, siz Claude sohbetine yapıştırırsınız.','The panel works without a key too: the form builds the pre-prompt and you paste it into a Claude chat.'))}</p>
  </div></div>
  <div class="card"><header><h3>3 · ${esc(t('Dil ve veriler','Language and data'))}</h3></header><div class="cbody">
    <div class="fld"><label>${esc(t('Panel dili','Panel language'))}</label><div class="seg"><button type="button" data-lang="tr" aria-pressed="${!isEN()}">Türkçe</button><button type="button" data-lang="en" aria-pressed="${isEN()}">English</button></div></div>
    <p class="hint" style="margin:0">${esc(t('Son eşitleme','Last sync'))}: ${STATE.cachedAt?fmtDate(STATE.cachedAt):'—'} · ${esc(STATE.source==='api'?'GitHub API':STATE.source==='raw'?t('GitHub (salt okunur)','GitHub (read-only)'):t('cihaz önbelleği','device cache'))}</p>
    <div style="display:flex;gap:8px;flex-wrap:wrap"><button class="btn" type="button" data-cfg="reload">${esc(t('Verileri yeniden yükle','Reload data'))}</button><button class="btn" type="button" data-cfg="backup">${esc(t('Tüm verileri Excel’e yedekle','Back up all data to Excel'))}</button></div>
  </div></div>
  <div class="card"><header><h3>4 · ${esc(t('Uygulama olarak kur','Install as an app'))}</h3></header><div class="cbody" style="font-size:13.5px;line-height:1.55">
    <p style="margin:0">${esc(t('Panel adresi','Panel address'))}: <a href="${PANEL_WEB}" target="_blank" rel="noopener">${esc(PANEL_WEB)}</a></p>
    <p style="margin:0"><b>iPhone / iPad:</b> ${esc(t('Safari’de adresi açın → Paylaş (kare ve ok) → “Ana Ekrana Ekle” → Ekle. Panel ana ekranda uygulama gibi açılır.','Open the address in Safari → Share (square with arrow) → “Add to Home Screen” → Add. It opens like an app.'))}</p>
    <p style="margin:0"><b>${esc(t('Bilgisayar','Desktop'))}:</b> ${esc(t('Chrome veya Edge’de adres çubuğundaki “Yükle” simgesine basın (veya menü → “Uygulamayı yükle”). Mac Safari: Dosya → “Dock’a Ekle”.','In Chrome or Edge press the “Install” icon in the address bar (or menu → “Install app”). Mac Safari: File → “Add to Dock”.'))}</p>
    <p style="margin:0"><b>Claude:</b> ${esc(t('Claude’daki “Evodak Prompt Asistanı” projesinde Claude bu depoyu doğrudan okuyup yazabilir: “Kod & Command’a şu komutu ekle” gibi isteklerde değişiklik aynı veriye işlenir ve panelde görünür.','In the “Evodak Prompt Asistanı” Claude project, Claude can read and write this repository directly: requests like “add this command to Code & Command” go into the same data and show up in the panel.'))}</p>
  </div></div>
  </div>`;
};
$('#v-ayar').addEventListener('click',async e=>{
  const b=e.target.closest('[data-cfg]');if(!b)return;const a=b.dataset.cfg;
  if(a==='tok'){const v=$('#cfgTok').value.trim();if(!v){toast(t('Anahtarı yapıştırın','Paste the token'));return}CFG.token=v;saveCfg();GH.user='';GH.canPush=false;b.disabled=true;
    try{await GH.whoami();toast(GH.canPush?t(`Bağlandı: ${GH.user} (yazabilir)`,`Connected: ${GH.user} (can write)`):t(`Bağlandı: ${GH.user} — ama bu depoya yazma izni yok`,`Connected: ${GH.user} — but no write access to this repository`),5000);banner('');await loadAll(true)}
    catch(err){toast(t('Anahtar çalışmadı: ','Token did not work: ')+err.message,6000);CFG.token='';saveCfg()}
    RENDER.ayar();connState();return}
  if(a==='untok'){CFG.token='';saveCfg();GH.user='';GH.canPush=false;connState();RENDER.ayar();toast(t('Bağlantı kesildi','Disconnected'));return}
  if(a==='ai'){const k=$('#cfgAi').value.trim();if(k)CFG.aiKey=k;CFG.aiModel=$('#cfgM1').value.trim()||'claude-sonnet-5-5';CFG.aiModelBig=$('#cfgM2').value.trim()||'claude-opus-5-5';saveCfg();toast(t('Kaydedildi','Saved'));RENDER.ayar();return}
  if(a==='unai'){CFG.aiKey='';saveCfg();RENDER.ayar();return}
  if(a==='aitest'){b.disabled=true;try{const r=await LLM.json('Bağlantı testi. {"ok":true} döndür.',{maxTokens:50});toast(r&&r.ok?t('AI bağlantısı çalışıyor','AI connection works'):t('Yanıt alındı','Got a reply'))}catch(err){toast(err.message,6000)}b.disabled=false;return}
  if(a==='reload'){await loadAll(true);RENDER.ayar();toast(t('Veriler yenilendi','Data reloaded'));return}
  if(a==='backup'){exportSheets('Evodak Prompt Asistanı - Yedek',[['kod','Kod & Command'],['kodref','Referans Bilgi'],['uzun','Uzun Prompt'],['rehber','Uygulama Rehberi'],['gecmis','Kayıtlı Promptlar'],['plat','AI Platform'],['model','Modeller']].map(([c,n])=>({name:n,rows:toRows(c,[...DATA[c].values()])})).concat([{name:'Değişiklik Günlüğü',rows:LOGARR.map(l=>({Tarih:l.at,Kişi:l.by,Bölüm:l.col,Kayıt:l.docId,İşlem:l.action,Başlık:l.title,Not:l.note||''}))}]));return}
});

/* ===== Hızlı ekle ===== */
$('#qadd').addEventListener('click',()=>{
  if(!guard())return;
  const opts=[['kod',t('Komut / prompt (Kod & Command)','Command / prompt (Code & Command)')],['kodref',t('Referans bilgi','Reference info')],['uzun',t('Uzun hazır prompt','Long ready-made prompt')],['gecmis',t('Kendi promptum','My own prompt')],['plat','AI platform']];
  modal({title:t('Hızlı ekle','Quick add'),ok:t('Devam','Continue'),body:`<div class="optchips" id="qaT">${opts.map(([k,l],i)=>`<button type="button" data-o="${k}" aria-pressed="${i===0}">${esc(l)}</button>`).join('')}</div><p class="hint" style="margin:0">${esc(t('Dosyadan toplu eklemek için Yükle & Aktar bölümünü kullanın.','Use Upload & Import to add many at once.'))}</p>`,
    onOk:h=>{const k=($('#qaT [aria-pressed="true"]',h)||{}).dataset.o||'kod';setTimeout(()=>{
      if(k==='kod')newRecord('kod',{tur:'Slash Komut',platform:'Claude',sektor:'Genel',dil:'TR',seviye:'Başlangıç'});else if(k==='kodref')newRecord('kodref',{refTur:'Rehber / Bilgi Notu',durum:'Yeni / İşlenmedi'});else if(k==='uzun')newRecord('uzun',{platform:ALL,sektor:'Genel'});else if(k==='gecmis')newRecord('gecmis',{tur:'Nihai prompt',durum:'Tamam',revNo:1,platform:[],dil:['Türkçe'],bagli:[]});else newRecord('plat',{durum:'AI-yerel',formGrup:[]})},0)}});
  $('#qaT').addEventListener('click',e=>{const b=e.target.closest('button');if(!b)return;$$('#qaT button').forEach(x=>x.setAttribute('aria-pressed',x===b))});
});
$('#qset').addEventListener('click',()=>go('ayar'));

/* ===== Dil ve başlatma ===== */
function applyLang(){
  document.documentElement.lang=UI.lang;
  $$('.top [data-lang]').forEach(b=>b.setAttribute('aria-pressed',b.dataset.lang===UI.lang));
  $('#gq').placeholder=t('Tüm panelde ara (komut, prompt, platform)','Search everything (commands, prompts, platforms)');
  $('#qset').textContent='⚙ '+t('Ayarlar','Settings');$('#qadd').textContent='+ '+t('Hızlı ekle','Quick add');
  connState();
}
document.addEventListener('click',e=>{const b=e.target.closest('[data-lang]');if(!b)return;const l=b.dataset.lang;if(l===UI.lang)return;UI.lang=l;LS.set('evd-lang',l);applyLang();formBuilt=false;if(DRAWER.open)renderDrawer();go(CUR,{relang:true})});
window.addEventListener('hashchange',()=>{const h=location.hash.slice(1);if(h&&h!==CUR)go(h)});
async function boot(){
  applyLang();
  await cacheLoad();
  go(location.hash.slice(1)||'ana');
  await loadAll(false);
  if(CUR==='ayar')RENDER.ayar();
}
if('serviceWorker' in navigator&&location.protocol==='https:'){window.addEventListener('load',()=>navigator.serviceWorker.register('sw.js').catch(()=>{}))}
boot();
