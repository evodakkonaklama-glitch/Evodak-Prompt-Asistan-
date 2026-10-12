/* =========================================================
   1 · EVODAK ÖN PROMPT HAZIRLAMA FORMU
   ========================================================= */
/* ---------- Yapay zeka bağlantısı (Anthropic API, tarayıcıdan) ---------- */
const LLM={
  ready:()=>!!CFG.aiKey,
  need(){if(this.ready())return true;toast(t('AI özellikleri için Ayarlar’dan Anthropic API anahtarı girin.','Enter an Anthropic API key in Settings to use AI features.'),4500);return false},
  maxImages:8,
  async json(prompt,opt={}){
    if(!CFG.aiKey)throw new Error(t('Anthropic API anahtarı yok (Ayarlar).','No Anthropic API key (Settings).'));
    const content=[];
    for(const b of (opt.images||[]).slice(0,this.maxImages)){const bl=await shrinkImage(b);const mt=/image\/(png|jpeg|webp|gif)/.test(bl.type)?bl.type:'image/jpeg';content.push({type:'image',source:{type:'base64',media_type:mt,data:await blobB64(bl)}})}
    content.push({type:'text',text:prompt+'\n\n'+t('Yanıtı YALNIZCA geçerli bir JSON nesnesi olarak ver; açıklama veya kod bloğu ekleme.','Reply ONLY with a valid JSON object; no explanation or code fence.')});
    const r=await fetch('https://api.anthropic.com/v1/messages',{method:'POST',headers:{'content-type':'application/json','x-api-key':CFG.aiKey,'anthropic-version':'2023-06-01','anthropic-dangerous-direct-browser-access':'true'},
      body:JSON.stringify({model:opt.big?(CFG.aiModelBig||CFG.aiModel):CFG.aiModel,max_tokens:opt.maxTokens||8000,messages:[{role:'user',content}]})});
    if(!r.ok){let m='';try{const j=await r.json();m=j.error&&j.error.message||''}catch(_){}throw new Error('Anthropic '+r.status+(m?': '+m:''))}
    const j=await r.json();const txt=(j.content||[]).filter(c=>c.type==='text').map(c=>c.text).join('\n');
    const a=txt.indexOf('{'),b=txt.lastIndexOf('}');if(a<0||b<a)throw new Error(t('AI yanıtı JSON değil.','AI reply was not JSON.'));
    try{return JSON.parse(txt.slice(a,b+1))}catch(e){throw new Error(t('AI yanıtı okunamadı.','Could not parse the AI reply.'))}
  }
};

function platformsFor(pf){
  const db=platList().filter(p=>arr(p.formGrup).includes(pf));
  if(!db.length)return PLATFORMS[pf]||PLATFORMS.llm;
  return db.sort((a,b)=>(b.kullanim==='Evet')-(a.kullanim==='Evet')||a.ad.localeCompare(b.ad,'tr')).map(p=>p.ad);
}
function hintFor(name){const p=platByName(name);if(p&&(p.ipucuTr||p.ipucuEn))return [p.ipucuTr||p.ipucuEn,p.ipucuEn||p.ipucuTr];return null}
/* Amaca göre Kod & Command kategorileri (Rev 3 kategori adları üzerinde) */
const PCAT={
  gorsel:/Görsel Üretim|Fotoğraf|Rötuş|Reklam Görseli|İnfografik|Logo/,
  video:/Video|TikTok|Görsel Üretim/,
  metin:/Metin Yazımı|Özetleme|Ton, Üslup|Blog|E-posta & Mesaj|Çeviri/,
  pazarlama:/Pazarlama|Sosyal Medya|Marka|Satış/,
  arastirma:/Araştırma|Eleştirel|Veri Analizi|Özetleme/,
  finans:/İş Stratejisi|Finans|Veri Analizi|Eleştirel|Hukuk/,
  kod:/Yazılım|Sistem, Oturum/,
  teknik:/Proje Yönetimi|Diyagram|Hukuk|İş Akışı/,
  egitim:/Araştırma|Eğitim|Ofis|Özetleme|Diyagram/,
  ses:/Metin Yazımı|Sosyal Medya|Konuşma/,
  prompt:/Prompt Mühendisliği|Eleştirel|Roller/
};
const GENERAL_CMDS=['/assumptions','/clarify','/check','/critic','/alt3','/expert','/human','/delete-ai-words','/tldr','/eli5','/steps','/table'];
const FROLES=['Referans örnek','Kaynak veri','Taklit edilecek stil','Düzeltilecek çıktı'];
const FROLES_EN={'Referans örnek':'reference example','Kaynak veri':'source data','Taklit edilecek stil':'style to imitate','Düzeltilecek çıktı':'output to fix'};
const froleLab=r=>isEN()?FROLES_EN[r]||r:r;
const isCmd=d=>d.kod&&/Slash|Kısa Kod/.test(d.tur||'');

const FKEY='evd-form-r10';
const today=()=>{const d=new Date();return String(d.getDate()).padStart(2,'0')+'.'+String(d.getMonth()+1).padStart(2,'0')+'.'+d.getFullYear()};
const blank=()=>({v:10,purpose:null,subs:[],sel:{'son.g':[sp(AIFILL).tr]},txt:{},chk:{'calisma.dusun':true,'calisma.elestir':true},lang:UI.lang,mode:'meta',quick:false,collapsed:{},meta:{proj:'',date:today(),by:''},example:false,files:[],ai:null,out:'pre',recordId:null,cmdOnly:false});
let S=blank();
const FILES={};/* id -> {file,url} yalnız bu cihazda, bu oturumda */
let CMDQ='';let CMDALL=false;
function exampleState(){
  const s=blank();
  Object.assign(s,{purpose:'gorsel',subs:['Fotoğraf gerçekliğinde görsel'],example:true});
  s.meta.proj=t('ÖRNEK — Butik otel teras görseli','EXAMPLE — Boutique hotel terrace image');
  s.txt['konu.konu']='Ege kıyısında butik bir otelin gün batımındaki terası; Instagram için tanıtım görseli (örnek veri)';
  s.txt['detay.det']='Beyaz taş teras, 6 masa, deniz manzarası, zeytin ağaçları, ahşap pergole. Terasta 2 misafir kadeh tutuyor.';
  s.txt['detay.sabit']='Deniz manzarası ve beyaz taş doku korunmalı.';
  const set=(k,v)=>{s.sel[k]=v};
  set('konu.kat',['Turizm / konaklama','Mekân / bina']);set('amac.g',['Dikkat çekmek','Tanıtmak']);set('platform.g',['Midjourney']);
  set('kitle.g',['Turistler','Üst gelir grubu']);set('kitle.yas',['26–40','41–60']);s.txt['kitle.ulke']='Türkiye ve Avrupa';
  set('dil.g',['İngilizce']);set('cikti.g',['Görsel promptu + negatif prompt']);
  set('gerceklik.lvl',['Profesyonel fotoğraf kalitesinde']);set('gerceklik.uyum',['Önemli']);
  set('gorselTarz.g',['Fotogerçekçi','Lüks','Doğal']);set('kamera.aci',['Göz hizası','Geniş açı']);set('kamera.lens',['35 mm']);set('kamera.oran',['4:5']);
  set('isik.isik',['Altın saat']);set('isik.atm',['Huzurlu','Lüks']);set('komut.g',['/cinematic','/depth']);
  set('olmasin.hazir',['Bozuk anatomi / ekstra parmak','Anlamsız yazı / harf hatası','Filigran / imza']);
  set('oncelik.p1',['Gerçekçilik']);set('oncelik.p2',['Görsel kalite']);set('ozgurluk.g',['Profesyonel kararları kendisi verebilir.']);
  set('hata.g',['Çok önemli: mümkün olduğunca hatasız olmalı.']);set('teslim.g',['Prompt + negatif prompt','Platforma özel format']);
  return s;
}
function loadForm(){const o=LS.get(FKEY,null);if(o&&o.v===10)return Object.assign(blank(),o);return exampleState()}
function saveForm(){const c=Object.assign({},S,{files:(S.files||[]).map(f=>Object.assign({},f,{text:f.text?String(f.text).slice(0,4000):''}))});LS.set(FKEY,c)}
S=loadForm();

const optsOf=g=>typeof g.opts==='function'?g.opts(S.purpose):(g.opts||[]);
const visibleMods=()=>{
  const spec=S.purpose?SPEC_ORDER.filter(m=>P(S.purpose).mods.includes(m)):[];
  let list=[...ORDER_HEAD,...spec,...ORDER_TAIL];
  if(S.quick)list=list.filter(m=>M[m].core||spec.slice(0,2).includes(m));
  return list;
};
const recSet=()=>new Set((REC[S.purpose]||[]).map(r=>r.join('§')));
const L=()=>S.lang==='en'?1:0;            /* çıktı dili */
const U=()=>isEN()?1:0;                    /* arayüz dili */
const optLab=o=>U()?o.en:o.tr;
const aiFill=()=>!(S.sel['son.g']||[]).includes(ASKFIRST);
const NOFILL=new Set(['calisma','son','dosya','referans','duzenleme','marka','ek','komut']);
function valText(g,v,mod){
  if(v===AI)return L()?'AI decides':'AI karar versin';
  const o=optsOf(g).map(sp).find(o=>o.tr===v);
  if(!o)return v;
  if(L())return o.en;
  return (M[mod].kw&&o.en!==o.tr&&!/^[\d:]+$/.test(o.tr))?`${o.tr} (${o.en})`:o.tr;
}
function cmdDesc(code){const r=findCmd(code);if(!r)return '';const d=r[1];return L()?(d.aciklamaEn||d.baslikEn||d.aciklamaTr||d.baslikTr):(d.aciklamaTr||d.baslikTr||d.aciklamaEn)}
function groupLines(mod){
  const m=M[mod],out=[];
  m.groups.forEach(g=>{
    const k=mod+'.'+g.id,lab=(g.l||m.t)[L()];
    if(g.type==='cmdx'){(S.sel[k]||[]).forEach(v=>{const ds=cmdDesc(v);out.push('  '+v+(ds?' → '+String(ds).replace(/\s+/g,' ').replace(/\.$/,''):''))});return}
    if(g.type==='files'){(S.files||[]).forEach(f=>{const role=L()?(FROLES_EN[f.role]||f.role):f.role;out.push(`- ${f.name} (${L()?f.kind:KIND_LABEL()[f.kind]||f.kind}) · ${L()?'use as':'kullanım'}: ${role}${f.summary?(L()?' — summary: ':' — özet: ')+f.summary.replace(/\s+/g,' ').slice(0,400):''}`)});return}
    if(g.type==='multi'||g.type==='single'){
      const vs=S.sel[k]||[];if(!vs.length)return;
      if(g.sentence){out.push(vs.map(v=>valText(g,v,mod)).join(' '));return}
      out.push(`${lab}: ${vs.map(v=>valText(g,v,mod)).join(', ')}`);
    }else if(g.type==='text'||g.type==='area'){
      const x=(S.txt[k]||'').trim();if(!x)return;
      if(g.type==='area'&&x.includes('\n'))out.push(`${lab}:\n`+x.split('\n').filter(y=>y.trim()).map(y=>'  - '+y.trim()).join('\n'));
      else out.push(`${lab}: ${x}`);
    }else if(g.type==='limits'){
      const parts=g.fields.map(sp).map(f=>{const x=(S.txt[k+'.'+f.tr]||'').trim();return x?`${x} ${L()?f.en:f.tr.toLowerCase()}`:null}).filter(Boolean);
      if(parts.length)out.push(`${lab}: ${parts.join(', ')}`);
    }else if(g.type==='check'){if(S.chk[k])out.push(g.line?g.line[L()]:lab+'.')}
  });
  if(mod==='komut'&&out.length)out.unshift(L()?'Apply these commands (each code with its meaning):':'Şu komutları uygula (kod + anlamı):');
  if(mod==='dosya'&&out.length)out.unshift(L()?'Attached files (provide them together with the prompt):':'Ekli dosyalar (prompt ile birlikte verilecek):');
  if(mod==='calisma'&&out.length&&S.mode==='meta')out.unshift(L()?'Add these working instructions to the final prompt:':'Nihai prompta şu çalışma talimatlarını ekle:');
  return out;
}
function purposeLine(lang){
  if(!S.purpose)return '';const en=lang===undefined?L():lang;
  const p=P(S.purpose);const subs=S.subs.map(v=>{const o=p.subs.map(sp).find(o=>o.tr===v);return o?o[en?'en':'tr']:v});
  return (en?p.en:p.tr)+(subs.length?' → '+subs.join(', '):'');
}
const isFilled=mod=>groupLines(mod).length>0;
const willAiFill=mod=>aiFill()&&!NOFILL.has(mod)&&!isFilled(mod)&&M[mod].tag!=='opt';
function emptyTitles(){return visibleMods().filter(willAiFill).map(m=>M[m].t[L()])}

/* ----- Komut listeleri (Kod & Command Prompt bölümüyle entegre) ----- */
function targets(){return (S.sel['platform.g']||[]).filter(x=>x!==AI&&!/^Birden fazla|^Platform bağımsız/.test(x))}
function cmdChip(id,d,sel,rec){
  const w=cmdCompat(d,targets());const desc=pick(d,'aciklamaTr','aciklamaEn')||pick(d,'baslikTr','baslikEn');
  return `<button type="button" class="chip cmd ${rec?'rec':''}" data-k="komut.g" data-v="${esc(d.kod)}" aria-pressed="${sel.includes(d.kod)}" title="${esc(id+' · '+pick(d,'baslikTr','baslikEn')+(w?' · ⚠ '+w:''))}"><code>${esc(d.kod)}</code><small>${esc(String(desc).slice(0,140))}</small>${w?`<span class="warn">⚠ ${esc(t('Hedefte çalışmayabilir','May not work on the target'))} · ${esc(w)}</span>`:''}</button>`;
}
function cmdLists(){
  const sel=S.sel['komut.g']||[];const rec=recSet();const tg=targets();
  if(!LOADED.kod)return `<p class="hint"><span class="spin"></span> ${esc(t('Komutlar yükleniyor…','Loading commands…'))}</p>`;
  const all=[...DATA.kod.entries()].filter(([,d])=>isCmd(d)&&d.durum!=='Arşiv');
  if(!all.length)return `<p class="hint">${esc(t('Komut listesi boş. Kod & Command Prompt bölümüne komut ekleyin.','The command list is empty. Add commands in the Code & Command Prompt section.'))}</p>`;
  const okc=([,d])=>!S.cmdOnly||!cmdCompat(d,tg);
  const fav=d=>/Favori/.test(d.durum||'')?1:0;
  const byNo=(a,b)=>fav(b[1])-fav(a[1])||(Number(b[1].puan)||0)-(Number(a[1].puan)||0)||a[0].localeCompare(b[0]);
  let h='';
  if(sel.length){h+=`<div class="grp"><span class="gl">${esc(t('Seçilenler','Selected'))} (${sel.length})</span><div class="chips">${sel.map(c=>{const r=findCmd(c);return r?cmdChip(r[0],r[1],sel,false):`<button type="button" class="chip cmd" data-k="komut.g" data-v="${esc(c)}" aria-pressed="true"><code>${esc(c)}</code><small>${esc(t('Listede bulunamadı','Not found in the list'))}</small></button>`}).join('')}</div></div>`}
  if(CMDQ.trim()){
    const res=all.filter(([,d])=>matches(d,CMDQ,['kod','alias','baslikTr','baslikEn','aciklamaTr','aciklamaEn','anaKat','altKat','etiket'])).filter(okc).sort(byNo);
    h+=`<div class="grp"><span class="gl">${esc(t('Arama sonuçları','Search results'))} (${res.length})</span>${res.length?`<div class="chips">${res.slice(0,40).map(([i,d])=>cmdChip(i,d,sel,false)).join('')}</div>`:`<p class="hint">"${esc(CMDQ)}" ${esc(t('bulunamadı.','not found.'))} ${canWrite()?`<button class="btn sm" type="button" data-newcmd="${esc(CMDQ.trim())}">+ ${esc(t('Yeni komut olarak ekle','Add as a new command'))}</button>`:''}</p>`}</div>`;
  }
  if(S.purpose){
    const re=PCAT[S.purpose];
    const res=re?all.filter(([,d])=>re.test((d.anaKat||'')+' '+(d.altKat||''))).filter(okc).sort(byNo):[];
    const lim=CMDALL?res.length:24;
    h+=`<div class="grp"><span class="gl">${esc(t('Bu amaca özel','For this purpose'))} (${res.length})</span><div class="chips">${res.slice(0,lim).map(([i,d])=>cmdChip(i,d,sel,rec.has('komut§g§'+d.kod))).join('')}</div>${res.length>lim?`<button class="btn sm" type="button" data-cmdall>${esc(t('Tümünü göster','Show all'))} (${res.length})</button>`:''}</div>`;
  }
  const gen=GENERAL_CMDS.map(c=>findCmd(c)).filter(Boolean).filter(okc);
  if(gen.length)h+=`<div class="grp"><span class="gl">${esc(t('Genel','General'))}</span><div class="chips">${gen.map(([i,d])=>cmdChip(i,d,sel,rec.has('komut§g§'+d.kod))).join('')}</div></div>`;
  h+=`<p class="hint">${esc(t('Liste Kod & Command Prompt bölümünden gelir (Slash Komut ve Kısa Kod türleri). Oraya eklenen her komut burada da görünür.','This list comes from the Code & Command Prompt section (Slash Command and Shortcode types). Anything added there shows up here.'))} <a href="#" data-view="kod">${esc(t('Bölüme git','Open section'))} →</a></p>`;
  return h;
}

/* ----- Dosyalar ----- */
function fileThumb(f){const m=FILES[f.id];if(f.kind==='image'&&m&&m.url)return `<img alt="" src="${esc(m.url)}">`;return esc((KIND_LABEL()[f.kind]||'Dosya').slice(0,8))}
function filesHtml(){
  const fl=S.files||[];const ai=LLM.ready();
  return `<div class="drop" data-drop tabindex="0" role="button" aria-label="${esc(t('Dosya yükle','Upload files'))}"><b>${esc(t('Dosyaları buraya bırakın veya tıklayıp seçin','Drop files here or click to choose'))}</b><span>${esc(t('Tüm dosya türleri · Görsel (JPG, PNG, WEBP, HEIC) · Video (MP4, MOV) · Word, PDF, Excel, metin, altyazı','All file types · Images (JPG, PNG, WEBP, HEIC) · Video (MP4, MOV) · Word, PDF, Excel, text, subtitles'))}</span></div>
  ${fl.length?`<div class="files">${fl.map(f=>{const inMem=!!FILES[f.id];const canAn=ai&&(((f.kind==='image'||f.kind==='video')&&inMem)||(['pdf','docx','sheet','text'].includes(f.kind)&&(f.text||inMem)));
    return `<div class="file"><div class="th">${fileThumb(f)}</div><div class="fi"><div class="fn"><b>${esc(f.name)}</b><span class="badge">${esc(KIND_LABEL()[f.kind]||f.kind)}</span>${f.analyzed?`<span class="badge okb">${esc(t('analiz edildi','analysed'))}</span>`:''}</div>
    <div class="fn"><label class="hint" for="fr_${f.id}">${esc(t('Bu dosya ne için?','What is this file for?'))}</label><select id="fr_${f.id}" data-frole="${f.id}">${FROLES.map(r=>`<option value="${esc(r)}" ${r===f.role?'selected':''}>${esc(froleLab(r))}</option>`).join('')}</select></div>
    ${f.summary?`<div class="sum">${esc(f.summary)}</div>`:''}
    ${f.kind==='video'?`<div class="hint">${esc(t('Video doğrudan okunmaz: birkaç kare çıkarılıp incelenir. Konuşma dökümü için altyazı/transkript dosyası (.srt, .vtt, .txt) da ekleyin.','Video is not read directly: a few frames are extracted and analysed. Add a subtitle/transcript file (.srt, .vtt, .txt) for speech.'))}</div>`:''}
    ${!inMem&&f.kind!=='text'&&!f.text?`<div class="hint">${esc(t('Dosya bu cihazda/oturumda yok; yalnızca adı ve özeti kayıtlı. Yeniden analiz için tekrar yükleyin.','The file is not on this device/session; only its name and summary are kept. Re-upload to analyse again.'))}</div>`:''}
    <div class="fn">${canAn?`<button class="btn sm ai" type="button" data-fan="${f.id}">${esc(f.analyzed?t('Yeniden analiz et','Analyse again'):t('Analiz et ve formu doldur','Analyse and fill the form'))}</button>`:''}${ai&&f.kind==='image'&&inMem?`<button class="btn sm ai solid" type="button" data-fgen="${f.id}">${esc(t('Bu görsele göre prompt hazırla','Build a prompt from this image'))}</button>`:''}<button class="btn sm" type="button" data-fdel="${f.id}">${esc(t('Kaldır','Remove'))}</button></div></div></div>`}).join('')}</div>`:''}
  ${!ai?`<p class="hint">${esc(t('Dosya analizi için Ayarlar’dan Anthropic API anahtarı girin. Anahtar olmadan dosyalar forma ad ve kullanım amacıyla eklenir.','Enter an Anthropic API key in Settings to analyse files. Without it, files are added to the form by name and purpose.'))}</p>`:''}`;
}
async function addFormFiles(list){
  for(const file of list){
    const kind=kindOf(file);const id=uid('f');
    const f={id,name:file.name,kind,role:kind==='sheet'||kind==='pdf'?'Kaynak veri':'Referans örnek',summary:'',analyzed:false};
    FILES[id]={file,url:(kind==='image'||kind==='video')?URL.createObjectURL(file):null};
    if(['pdf','docx','sheet','text'].includes(kind)){try{const x=await readDocText(file);f.text=x.slice(0,12000);f.chars=x.length}catch(e){toast(t('Okunamadı: ','Could not read: ')+file.name+' — '+e.message,4000)}}
    S.files=[...(S.files||[]),f];
  }
  S.example=false;refreshSection('dosya');updateOut();
}
async function imageBlobOf(f){const m=FILES[f.id];if(m&&m.file)return shrinkImage(m.file);return null}
function optList(mod,gid){const g=M[mod].groups.find(x=>x.id===gid);return optsOf(g).map(o=>sp(o).tr)}
function applyPicked(obj,map){
  let n=0;
  Object.entries(map).forEach(([key,k])=>{
    const v=obj[key];if(v==null||v==='')return;const [mod,gid]=k.split('.');const g=M[mod].groups.find(x=>x.id===gid);if(!g)return;
    if(g.type==='text'||g.type==='area'){if(!(S.txt[k]||'').trim()){S.txt[k]=String(v);n++}return}
    const ok=new Set(optList(mod,gid));const vals=arr(v).filter(x=>ok.has(x));if(!vals.length)return;
    if((S.sel[k]||[]).filter(x=>x!==AI).length)return;
    S.sel[k]=g.type==='single'?[vals[0]]:vals;n++;
  });
  return n;
}
const VIS_MAP={konu:'konu.konu',kategori:'konu.kat',gercek:'gerceklik.lvl',tarz:'gorselTarz.g',renk:'gorselTarz.renk',aci:'kamera.aci',lens:'kamera.lens',oran:'kamera.oran',isik:'isik.isik',atmosfer:'isik.atm'};
const VID_MAP=Object.assign({},VIS_MAP,{kamera_hareketi:'hareket.kam',hareket_yogunlugu:'hareket.yog',ses:'hareket.ses'});
function optsPrompt(map){return Object.entries(map).map(([key,k])=>{const [mod,gid]=k.split('.');const g=M[mod].groups.find(x=>x.id===gid);if(!g)return '';return g.type==='text'||g.type==='area'?`"${key}": metin`:`"${key}": ${g.type==='single'?'tek değer':'dizi'}, yalnızca şunlardan: ${JSON.stringify(optList(mod,gid))}`}).filter(Boolean).join('\n')}
async function analyzeFile(id,thenGenerate){
  const f=(S.files||[]).find(x=>x.id===id);if(!f||!LLM.need())return;
  const btns=$$(`[data-fan="${id}"],[data-fgen="${id}"]`);btns.forEach(b=>{b.disabled=true;b.innerHTML='<span class="spin"></span> '+esc(t('İnceleniyor…','Analysing…'))});
  try{
    let res;
    if(f.kind==='image'||f.kind==='video'){
      let images,intro,map;
      if(f.kind==='image'){const b=await imageBlobOf(f);if(!b)throw new Error(t('Görsel bu oturumda yok; yeniden yükleyin.','Image not in this session; upload again.'));images=[b];intro='Ekteki görseli bir prompt hazırlama formu için incele.';map=VIS_MAP;if(!S.purpose){S.purpose='gorsel';S.subs=[]}}
      else{const fr=await videoFrames(FILES[f.id].file,4);images=fr.frames;intro=`Ekteki ${fr.frames.length} görsel, ${Math.round(fr.duration)} saniyelik bir videodan sırayla alınmış karelerdir. Videoyu bu karelerden anlamaya çalış.`;map=VID_MAP;if(!S.purpose){S.purpose='video';S.subs=[]}}
      res=await LLM.json(`${intro}\nKullanıcı bu dosyayı "${f.role}" olarak kullanacak. Türkçe yanıt ver. Yalnızca şu alanları içeren bir JSON nesnesi döndür:\n"ozet": 1-3 cümlelik Türkçe betimleme (ne görülüyor, tarz, ışık, kompozisyon${f.kind==='video'?', sahne akışı ve kamera hareketi':''})\n${optsPrompt(map)}\nEmin olmadığın alanı boş bırak; listede olmayan değer yazma.`,{images});
      f.summary=String(res.ozet||'').trim();const n=applyPicked(res,map);f.analyzed=true;
      toast(t(`Analiz tamam: ${n} form alanı dolduruldu`,`Analysis done: ${n} form fields filled`));
    }else{
      const text=f.text||(FILES[f.id]?await readDocText(FILES[f.id].file):'');
      if(!text.trim())throw new Error(t('Dosyada okunabilir metin yok.','No readable text in the file.'));
      res=await LLM.json(`Aşağıdaki belge bir prompt hazırlama formuna kaynak olarak eklendi (kullanım: ${f.role}). Türkçe olarak şu JSON nesnesini döndür:\n"ozet": belgenin 2-3 cümlelik özeti\n"konu": belgeye göre çalışmanın konusu (tek cümle)\n"detaylar": AI'ın bilmesi gereken somut gerçek bilgiler (isim, rakam, ölçü, tarih, adres), her biri ayrı madde olacak şekilde dizi\n\nBELGE (${f.name}):\n${text.slice(0,30000)}`);
      f.summary=String(res.ozet||'').trim();f.analyzed=true;
      if(res.konu&&!(S.txt['konu.konu']||'').trim())S.txt['konu.konu']=res.konu;
      const det=arr(res.detaylar).filter(Boolean);if(det.length){const cur=(S.txt['detay.det']||'').trim();S.txt['detay.det']=(cur?cur+'\n':'')+det.join('\n')}
      toast(t('Belge özeti ve önemli bilgiler forma aktarıldı','Document summary and key facts added to the form'));
    }
    S.example=false;render();
    if(thenGenerate)await generateAI();
  }catch(e){toast(t('Analiz yapılamadı: ','Analysis failed: ')+(e.message||e),5000);refreshSection('dosya')}
}

/* ----- Form çizimi ----- */
function chip(k,v,label,pressed,extra){return `<button type="button" class="chip ${extra||''}" data-k="${esc(k)}" data-v="${esc(v)}" aria-pressed="${pressed}">${label}</button>`}
function renderGroup(mod,g,rec){
  const k=mod+'.'+g.id,sel=S.sel[k]||[];
  const lab=g.l?`<span class="gl">${esc(g.l[U()])}</span>`:'';
  if(g.type==='cmdx')return `<div class="grp"><div class="field"><label for="cmdq">${esc(t('Komut ara (kod, ad veya açıklama)','Search commands (code, name or description)'))}</label><input id="cmdq" type="search" data-cmdq value="${esc(CMDQ)}" placeholder="${esc(t('Örn. swot, özet, /hooks10','e.g. swot, summary, /hooks10'))}"></div><label class="check"><input type="checkbox" data-cmdonly ${S.cmdOnly?'checked':''}> ${esc(t('Yalnızca seçilen hedef yapay zekada çalışanları göster','Only show commands that work on the selected target AI'))}</label></div><div id="cmdlists" style="display:flex;flex-direction:column;gap:12px">${cmdLists()}</div>`;
  if(g.type==='files')return filesHtml();
  if(g.type==='multi'||g.type==='single'){
    const opts=optsOf(g).map(sp);
    let h=opts.map(o=>chip(k,o.tr,esc(optLab(o)),sel.includes(o.tr),(g.sentence?'sentence ':'')+(rec.has(mod+'§'+g.id+'§'+o.tr)?'rec':''))).join('');
    if(!g.noAI)h+=chip(k,AI,esc(t('AI KARAR VERSİN','AI DECIDES')),sel.includes(AI),'ai'+(g.sentence?' sentence':''));
    return `<div class="grp">${lab}<div class="chips" role="group">${h}</div></div>`;
  }
  if(g.type==='text')return `<div class="field"><label for="f_${k}">${esc(g.l[U()])}</label><input id="f_${k}" data-t="${k}" value="${esc(S.txt[k]||'')}" placeholder="${esc(U()?'':g.ph||'')}"></div>`;
  if(g.type==='area')return `<div class="field"><label for="f_${k}">${esc(g.l[U()])}</label><textarea id="f_${k}" data-t="${k}" placeholder="${esc(U()?'':g.ph||'')}">${esc(S.txt[k]||'')}</textarea></div>`;
  if(g.type==='limits')return `<div class="grp"><span class="gl">${esc(g.l[U()])}</span><div class="limits">${g.fields.map(sp).map(f=>{const kk=k+'.'+f.tr;return `<div class="field"><label for="f_${kk}">${esc(optLab(f))}</label><input id="f_${kk}" data-t="${kk}" inputmode="numeric" value="${esc(S.txt[kk]||'')}"></div>`}).join('')}</div></div>`;
  if(g.type==='check')return `<label class="check" for="f_${k}"><input type="checkbox" id="f_${k}" data-c="${k}" ${S.chk[k]?'checked':''}> ${esc(g.l[U()])}</label>`;
  return '';
}
const TAGS=()=>({all:t('Tüm görevler','All tasks'),spec:t('Göreve özel','Task-specific'),opt:t('Varsa','Optional')});
const AIF_LINE=()=>t('Boş: AI bu bölüm için en uygun seçimi yapacak.','Empty: AI will make the best choice for this section.');
const NOSEL_LINE=()=>t('Seçim yapılmadı: bu bölüm nihai metne eklenmez.','Nothing selected: this section is not added to the final text.');
function sectionInner(mod,no){
  const m=M[mod],rec=recSet(),lines=groupLines(mod),af=willAiFill(mod);
  const cmd=lines.length?`<div class="cmdline">${esc(lines.join('\n'))}</div>`:af?`<div class="cmdline aif">${esc(AIF_LINE())}</div>`:`<div class="cmdline empty">${esc(NOSEL_LINE())}</div>`;
  return `<header data-toggle="${mod}"><span class="state" aria-hidden="true"></span><span class="no">${String(no).padStart(2,'0')}</span><h2>${esc(m.t[U()])}</h2>${m.isNew?'<span class="tag new">Rev.10</span>':''}${af?`<span class="tag aif">${esc(t('AI dolduracak','AI will fill'))}</span>`:''}<span class="tag ${m.tag==='spec'?'spec':m.tag==='opt'?'opt':''}">${esc(TAGS()[m.tag])}</span><span class="chev" aria-hidden="true">▾</span></header>
  <div class="body">${m.hint&&!U()?`<p class="hint">${esc(m.hint)}</p>`:''}${m.groups.map(g=>renderGroup(mod,g,rec)).join('')}${cmd}</div>`;
}
function purposeSection(){
  const p=S.purpose?P(S.purpose):null;
  const cards=PURPOSES.map(x=>`<button type="button" class="pcard" data-purpose="${x.id}" aria-pressed="${S.purpose===x.id}"><b>${esc(U()?x.en:x.tr)}</b>${U()?'':`<span>${esc(x.d)}</span>`}</button>`).join('');
  const subs=p?`<div class="grp"><span class="gl">${esc(t('Alt görev (birden fazla seçilebilir)','Sub-task (multiple allowed)'))}</span><div class="chips">${p.subs.map(sp).map(o=>chip('__sub',o.tr,esc(optLab(o)),S.subs.includes(o.tr))).join('')}</div></div>
   <div class="roleBox"><span><em>${esc(t('Otomatik rol:','Automatic role:'))}</em> ${esc(p.role[U()])}</span><button type="button" class="btn primary" data-act="rec">${esc(t('Önerilen seçimleri uygula','Apply recommended choices'))} (${(REC[p.id]||[]).length})</button></div>`:`<p class="hint">${esc(t('Bir amaç seçtiğinizde platform, çıktı türü, negatifler ve komut listesi bu amaca göre değişir; göreve özel bölümler açılır.','Once you pick a purpose, platforms, output types, negatives and the command list adapt to it, and task-specific sections open.'))}</p>`;
  const line=purposeLine();
  return `<section class="sec ${S.purpose?'filled':''}" id="s_purpose"><header><span class="state" aria-hidden="true"></span><span class="no">01</span><h2>${esc(t('Prompt ne için kullanılacak?','What is the prompt for?'))}</h2><span class="tag">${esc(t('Başlangıç','Start'))}</span></header>
  <div class="body"><div class="pgrid">${cards}</div>${subs}<div class="cmdline ${line?'':'empty'}">${line?esc((L()?'Main purpose: ':'Ana kullanım amacı: ')+line):esc(t('Amaç seçilmedi.','No purpose selected.'))}</div></div></section>`;
}
let formBuilt=false;
function buildFormShell(){
  const v=$('#v-form');
  v.innerHTML=`<div style="display:flex;flex-direction:column;gap:14px">
  <section class="docHead" aria-label="${esc(t('Form başlığı','Form header'))}">
    <div class="t"><h2>${esc(t('Evodak Ön Prompt Hazırlama Formu','Evodak Pre-Prompt Preparation Form'))}</h2><p>${esc(t('Ana kullanım amacını seçin; form yalnızca o göreve uygun bölümleri ve seçenekleri açar. Her seçim anında bir komut satırına dönüşür ve nihai metne eklenir. Boş bıraktığınız bölümleri AI doldurur; AI adım adım düşünür, kendi taslağını eleştirip düzeltilmiş halini verir.','Pick the main purpose; the form opens only the sections and options that fit it. Every choice becomes a line in the final text. AI fills the sections you leave empty, thinks step by step, critiques its own draft and returns the corrected version.'))}</p></div>
    <div class="docCode"><div>${esc(t('Panel','Panel'))}</div><div><b>Evodak Prompt Asistanı</b></div><div>${esc(t('Revizyon','Revision'))}</div><div><b>Rev.10</b></div><div>${esc(t('Kayıt','Record'))}</div><div><b id="fRec"></b></div></div>
    <div class="metaRow">
      <label for="m_proj"><span>${esc(t('Proje / çalışma adı','Project / work name'))}</span><input id="m_proj" data-meta="proj"></label>
      <label for="m_date"><span>${esc(t('Tarih','Date'))}</span><input id="m_date" data-meta="date"></label>
      <label for="m_by"><span>${esc(t('Hazırlayan','Prepared by'))}</span><input id="m_by" data-meta="by"></label>
    </div>
  </section>
  <div id="exampleNote" class="note" hidden><span>${t('Form bir <b>örnekle</b> dolu açıldı (butik otel tanıtım görseli). Kendi çalışmanız için “Formu temizle”ye basın.','The form opened with an <b>example</b> (boutique hotel image). Press “Clear form” for your own work.')}</span><button class="btn" type="button" data-act="clear">${esc(t('Formu temizle','Clear form'))}</button></div>
  <div id="recNote" class="note" hidden></div>
  <div class="bar">
    <div class="left"><div class="seg" role="group"><button type="button" id="b_full" data-act="full" aria-pressed="true">${esc(t('Tam form','Full form'))}</button><button type="button" id="b_quick" data-act="quick" aria-pressed="false">${esc(t('Hızlı form','Quick form'))}</button></div>
      <button class="btn" type="button" data-act="expand">${esc(t('Tümünü aç','Expand all'))}</button><button class="btn" type="button" data-act="collapse">${esc(t('Tümünü kapat','Collapse all'))}</button></div>
    <div class="right"><span class="progress" id="progress"></span><button class="btn" type="button" data-act="openSaved">${esc(t('Kayıtlı formu aç','Open saved form'))}</button><button class="btn" type="button" data-act="clear">${esc(t('Formu temizle','Clear form'))}</button><button class="btn" type="button" data-act="example">${esc(t('Örneği yükle','Load example'))}</button></div>
  </div>
  <div class="legend"><span><i style="background:var(--accent)"></i>${esc(t('Seçili','Selected'))}</span><span><i style="border:1px dashed var(--ai)"></i>${esc(t('AI karar versin / AI dolduracak','AI decides / AI will fill'))}</span><span><i style="background:var(--ai);border-radius:50%;width:6px;height:6px"></i>${esc(t('Bu amaç için önerilen','Recommended for this purpose'))}</span><span><i style="background:var(--ok);border-radius:50%"></i>${esc(t('Bölüm dolu','Section filled'))}</span></div>
  <div class="fmain">
    <div id="form"></div>
    <aside class="out" id="output">
      <header>
        <div class="row"><h3>${esc(t('Nihai metin','Final text'))}</h3><div class="seg" role="group" title="${esc(t('Çıktı dili','Output language'))}"><button type="button" data-act="lang" data-v="tr" aria-pressed="true">TR</button><button type="button" data-act="lang" data-v="en" aria-pressed="false">EN</button></div></div>
        <div class="seg" role="group" style="width:100%"><button type="button" data-act="mode" data-v="meta" aria-pressed="true" style="flex:1">${esc(t('Meta form + üretim talimatı','Meta form + generation instruction'))}</button><button type="button" data-act="mode" data-v="direct" aria-pressed="false" style="flex:1">${esc(t('Doğrudan prompt','Direct prompt'))}</button></div>
        <p class="hint" id="modeHint"></p>
        <div class="seg" role="group" id="outTabs" style="width:100%"><button type="button" data-act="outv" data-v="pre" aria-pressed="true" style="flex:1">${esc(t('Ön prompt','Pre-prompt'))}</button><button type="button" data-act="outv" data-v="ai" aria-pressed="false" style="flex:1">${esc(t('AI nihai prompt','AI final prompt'))}</button></div>
      </header>
      <pre id="outText" tabindex="0"></pre>
      <div class="crit" id="critBox" hidden></div>
      <footer><span id="stats"></span><span class="r"><button class="btn ai solid" type="button" data-act="gen" id="genBtn">${esc(t('AI ile nihai promptu üret','Generate final prompt with AI'))}</button><button class="btn" type="button" data-act="draft">${esc(t('Taslak kaydet','Save draft'))}</button><button class="btn" type="button" data-act="save">${esc(t('Kaydet','Save'))}</button><button class="btn primary" type="button" data-act="copy">${esc(t('Kopyala','Copy'))}</button></span></footer>
    </aside>
  </div></div>
  <button class="btn primary jump" type="button" data-act="jump">${esc(t('Nihai metne git ↓','Go to final text ↓'))}</button>`;
  formBuilt=true;
}
let formBound=false;
function bindForm(){
  if(formBound)return;formBound=true;const v=$('#v-form');
  v.addEventListener('click',formClick);v.addEventListener('input',formInput);v.addEventListener('change',formChange);
  v.addEventListener('dragover',e=>{const d=e.target.closest('[data-drop]');if(d){e.preventDefault();d.classList.add('over')}});
  v.addEventListener('dragleave',e=>{const d=e.target.closest('[data-drop]');if(d)d.classList.remove('over')});
  v.addEventListener('drop',e=>{const d=e.target.closest('[data-drop]');if(d){e.preventDefault();d.classList.remove('over');if(e.dataTransfer.files.length)addFormFiles([...e.dataTransfer.files])}});
  v.addEventListener('keydown',e=>{const d=e.target.closest('[data-drop]');if(d&&(e.key==='Enter'||e.key===' ')){e.preventDefault();pickFiles(addFormFiles)}});
}
function pickFiles(cb,accept){const i=$('#hiddenFile');i.value='';i.accept=accept||'';i.onchange=()=>{if(i.files.length)cb([...i.files])};i.click()}
function render(){
  if(!formBuilt)buildFormShell();bindForm();
  const mods=visibleMods();
  $('#form').innerHTML=purposeSection()+mods.map((m,i)=>`<section class="sec ${isFilled(m)?'filled':''} ${willAiFill(m)?'aifill':''} ${S.collapsed[m]?'collapsed':''}" id="s_${m}">${sectionInner(m,i+2)}</section>`).join('');
  syncMeta();updateOut();
}
function refreshSection(mod){
  const el=document.getElementById('s_'+mod);if(!el)return;
  const no=visibleMods().indexOf(mod)+2;el.innerHTML=sectionInner(mod,no);
  el.classList.toggle('filled',isFilled(mod));el.classList.toggle('aifill',willAiFill(mod));
}
function refreshLine(mod){
  const el=document.getElementById('s_'+mod);if(!el)return;
  const lines=groupLines(mod),c=el.querySelector('.body>.cmdline:last-child')||el.querySelector('.cmdline');const af=willAiFill(mod);if(!c)return;
  c.textContent=lines.length?lines.join('\n'):af?AIF_LINE():NOSEL_LINE();
  c.className='cmdline'+(lines.length?'':af?' aif':' empty');
  el.classList.toggle('filled',lines.length>0);el.classList.toggle('aifill',af);
  const tg=el.querySelector('header .tag.aif');if(tg&&!af)tg.remove();
}

/* ----- Çıktı ----- */
function motorText(){const m=[...DATA.gecmis.values()].find(d=>d.motor&&d.metin);return m?m.metin:B_TR}
function metaText(){
  const en=L(),out=[];
  out.push(en?'=== A) PRE-PROMPT META INFORMATION · Evodak Prompt Asistanı Rev.10 ===':'=== A) ÖN PROMPT META BİLGİLERİ · Evodak Prompt Asistanı Rev.10 ===');
  const mt=[S.meta.proj&&((en?'Project: ':'Proje: ')+S.meta.proj),S.meta.date&&((en?'Date: ':'Tarih: ')+S.meta.date),S.meta.by&&((en?'Prepared by: ':'Hazırlayan: ')+S.meta.by)].filter(Boolean);
  if(mt.length)out.push(mt.join(' | '));
  out.push('');let n=1;
  const pl=purposeLine();out.push(`${n}. ${en?'Main purpose':'Ana kullanım amacı'}: ${pl||(en?'AI decides':'AI karar versin')}`);
  visibleMods().forEach(mod=>{
    const lines=groupLines(mod);if(!lines.length)return;n++;
    const title=M[mod].t[en];
    if(lines.length===1&&!lines[0].includes('\n')){const l=lines[0];out.push(`${n}. `+(l.startsWith(title+': ')?l:`${title} — ${l}`))}
    else{out.push(`${n}. ${title}`);lines.forEach(l=>out.push(l.startsWith('  ')?l:'   '+l.replace(/\n/g,'\n   ')))}
  });
  const pf=(S.sel['platform.g']||[]).map(v=>hintFor(v)).filter(Boolean);
  if(pf.length){n++;out.push(`${n}. ${en?'Platform syntax notes':'Platform sözdizimi notları'}`);pf.forEach(h=>out.push('   '+h[en]))}
  const em=aiFill()?emptyTitles():[];
  if(em.length){n++;out.push(`${n}. ${en?'Fields left empty (AI fills them)':'Boş bırakılan alanlar (AI dolduracak)'}: ${em.join(', ')}`)}
  out.push('');
  out.push(en?'=== B) FIXED GENERATION INSTRUCTION (send unchanged) ===':'=== B) SABİT ÜRETİM TALİMATI · Nihai Prompt Üretim Motoru (değiştirmeden gönder) ===');
  out.push(en?B_EN:motorText());
  return out.join('\n');
}
function directText(){
  const en=L(),p=S.purpose?P(S.purpose):null;
  const H=(tr,e)=>'\n## '+(en?e:tr);
  const bucket=b=>visibleMods().filter(m=>M[m].dp===b).flatMap(m=>groupLines(m));
  const out=[];
  out.push(en?`You are ${p?p.role[1]:'an expert professional in the relevant field'}.`:`Sen ${p?p.role[0]:'ilgili alanda uzman bir profesyonel'} olarak çalışacaksın.`);
  const task=[];const pl=purposeLine();if(pl)task.push((en?'Task type: ':'Görev türü: ')+pl);task.push(...bucket('task'));
  if(task.length){out.push(H('Görev','Task'));task.forEach(l=>out.push(l.startsWith('  ')?l:'- '+l.replace(/\n/g,'\n  ')))}
  const sec=(b,tr,e)=>{const ls=bucket(b);if(!ls.length)return;out.push(H(tr,e));ls.forEach(l=>out.push(l.startsWith('  ')||l.startsWith('- ')?l:'- '+l.replace(/\n/g,'\n  ')))};
  sec('ctx','Bağlam','Context');sec('req','Gereksinimler','Requirements');sec('style','Stil ve ton','Style and tone');sec('fmt','Çıktı ve format','Output and format');
  sec('must','Mutlaka olsun','Must include');sec('not','Kesinlikle olmasın','Must avoid');sec('prio','Öncelik sırası','Priority order');sec('cmd','Uygulanacak komutlar','Commands to apply');
  const pf=(S.sel['platform.g']||[]).map(v=>hintFor(v)).filter(Boolean);
  out.push(H('Çalışma kuralları','Working rules'));
  bucket('rule').forEach(l=>out.push('- '+l.replace(/\n/g,'\n  ')));
  pf.forEach(h=>out.push('- '+h[en]));
  const em=aiFill()?emptyTitles():[];
  if(em.length)out.push(en?`- These points were not specified: ${em.join(', ')}. Make the best choice for each yourself and list the assumptions you made at the end.`:`- Şu konular belirtilmedi: ${em.join(', ')}. Bunlarda en uygun seçimi sen yap ve hangi varsayımları yaptığını sonda listele.`);
  out.push(en?'- Do not invent facts that were not provided (prices, dates, statistics, specs). If data is missing, say so; label any assumption as "Assumption:".':'- Verilmemiş gerçekleri (fiyat, tarih, istatistik, teknik özellik) uydurma. Veri yoksa açıkça belirt; varsayımları "Varsayım:" diye işaretle.');
  if(!S.chk['calisma.elestir'])out.push(en?'- Before delivering, check internally for consistency, gaps, contradictions, audience fit and format. Show only the final result.':'- Teslimden önce tutarlılık, eksiklik, çelişki, hedef kitle uyumu ve format açısından kendi içinde kontrol et. Yalnızca nihai sonucu göster.');
  return out.join('\n');
}
function highlight(s){return esc(s).replace(/^(===.*===|## .*)$/gm,'<span class="k">$1</span>').replace(/(\/[a-z0-9][a-z0-9-]*)( →)/gi,'<span class="k">$1</span>$2')}
let lastText='';
function updateOut(){
  if(!$('#outText'))return;
  lastText=S.mode==='meta'?metaText():directText();
  const showAi=S.out==='ai'&&S.ai&&S.ai.prompt;
  const x=showAi?S.ai.prompt:lastText;
  $('#outText').innerHTML=showAi?esc(x):highlight(x);
  const words=(x.match(/\S+/g)||[]).length;
  $('#stats').textContent=`${num(x.length)} ${t('karakter','chars')} · ${num(words)} ${t('kelime','words')}`;
  $('#modeHint').textContent=S.mode==='meta'?t('Meta bilgiler + Nihai Prompt Üretim Motoru. Bir sohbet yapay zekâsına yapıştırın ya da "AI ile nihai promptu üret" ile burada üretin.','Meta information + Final Prompt Generation Engine. Paste it into a chat AI, or generate it here with "Generate final prompt with AI".'):t('Seçimlerden doğrudan kurulan prompt. Hedef yapay zekâya hemen yapıştırılabilir.','A prompt built directly from your choices. Paste it straight into the target AI.');
  const mods=visibleMods();const filled=mods.filter(isFilled).length+(S.purpose?1:0);const af=mods.filter(willAiFill).length;
  $('#progress').textContent=t(`${filled}/${mods.length+1} bölüm dolu${af?` · ${af} bölümü AI dolduracak`:''}`,`${filled}/${mods.length+1} sections filled${af?` · AI fills ${af}`:''}`);
  $$('#v-form [data-act="lang"]').forEach(b=>b.setAttribute('aria-pressed',b.dataset.v===S.lang));
  $$('#v-form [data-act="mode"]').forEach(b=>b.setAttribute('aria-pressed',b.dataset.v===S.mode));
  $$('#v-form [data-act="outv"]').forEach(b=>{b.setAttribute('aria-pressed',b.dataset.v===(showAi?'ai':'pre'));if(b.dataset.v==='ai')b.disabled=!(S.ai&&S.ai.prompt)});
  $('#b_full').setAttribute('aria-pressed',!S.quick);$('#b_quick').setAttribute('aria-pressed',S.quick);
  $('#exampleNote').hidden=!S.example;
  const cb=$('#critBox');
  if(showAi&&((S.ai.critique||[]).length||(S.ai.assumptions||[]).length||(S.ai.steps||[]).length)){cb.hidden=false;cb.innerHTML=`${(S.ai.steps||[]).length?`<b>${esc(t('Adım adım düşünme','Step-by-step reasoning'))}</b><ol>${S.ai.steps.map(x=>`<li>${esc(x)}</li>`).join('')}</ol>`:''}${(S.ai.critique||[]).length?`<b>${esc(t('Öz-eleştiri (taslakta düzeltilenler)','Self-critique (fixed in the draft)'))}</b><ul>${S.ai.critique.map(x=>`<li>${esc(x)}</li>`).join('')}</ul>`:''}${(S.ai.assumptions||[]).length?`<b>${esc(t('Varsayımlar','Assumptions'))}</b><ul>${S.ai.assumptions.map(x=>`<li>${esc(x)}</li>`).join('')}</ul>`:''}`}else cb.hidden=true;
  $('#genBtn').title=LLM.ready()?'':t('Ayarlar’dan Anthropic API anahtarı girin','Enter an Anthropic API key in Settings');
  const rec=S.recordId&&DATA.gecmis.get(S.recordId);
  $('#fRec').textContent=rec?`${S.recordId} · Rev.${String(rec.revNo||1).padStart(2,'0')}`:t('Yeni','New');
  const rn=$('#recNote');if(rec){rn.hidden=false;rn.innerHTML=`<span>${esc(t('Kayıtlı form açık: ','Saved form open: '))}<b>${esc(rec.baslik)}</b> (Rev.${String(rec.revNo||1).padStart(2,'0')}${rec.durum==='Taslak'?t(', taslak',', draft'):''}). ${esc(t('Kaydettiğinizde yeni revizyon olarak saklanır; eski hali silinmez.','Saving stores a new revision; the old one is kept.'))}</span><button class="btn sm" type="button" data-act="detach">${esc(t('Bağlantıyı kaldır','Detach'))}</button>`}else rn.hidden=true;
  saveForm();
}
function syncMeta(){$$('#v-form [data-meta]').forEach(i=>{i.value=S.meta[i.dataset.meta]||''})}

/* ----- AI üretimi: adım adım düşün → taslak → öz-eleştiri → düzeltilmiş son hal ----- */
async function generateAI(){
  if(!LLM.need())return;
  const b=$('#genBtn');b.disabled=true;b.innerHTML='<span class="spin"></span> '+esc(t('AI çalışıyor…','AI is working…'));
  const keepMode=S.mode;S.mode='meta';const meta=metaText();S.mode=keepMode;
  const crit=!!S.chk['calisma.elestir'],think=!!S.chk['calisma.dusun'];
  const en=L();
  const instr=`${meta}\n\n=== ${en?'PANEL OUTPUT RULE':'PANEL ÇIKTI KURALI'} ===\n${en?'Produce the final prompt following the generation instruction above.':'Yukarıdaki üretim talimatına göre nihai promptu hazırla.'} ${think?(en?'Think step by step first and summarise your reasoning steps briefly.':'Önce adım adım düşün ve düşünme adımlarını kısaca özetle.'):''} ${aiFill()?(en?'Fill every field left empty with the most suitable choice and list these as assumptions.':'Boş bırakılan alanları en uygun seçimle doldur ve bunları varsayım olarak listele.'):''} ${crit?(en?'Then write a draft, critique it for gaps, ambiguity, errors and inconsistencies, and write the corrected final version.':'Sonra bir taslak yaz; taslağı eksiklik, belirsizlik, hata ve tutarsızlık açısından eleştir; eleştiriye göre düzeltilmiş son hali yaz.'):''}\n${en?'Reply ONLY with this JSON object':'Yanıtı YALNIZCA şu JSON nesnesi olarak ver'}: {"adimlar":["${en?'short reasoning steps':'kısa düşünme adımları'}"],"elestiri":["${en?'issues you found in the draft and fixed':'taslakta bulup düzelttiğin sorunlar'}"],"nihai_prompt":"${en?'the corrected final prompt text':'düzeltilmiş nihai prompt metni'}","varsayimlar":["${en?'assumptions you made':'yaptığın varsayımlar'}"]}`;
  try{
    const imgs=[];for(const f of (S.files||[]).filter(f=>f.kind==='image')){if(imgs.length>=LLM.maxImages)break;const bl=await imageBlobOf(f);if(bl)imgs.push(bl)}
    const r=await LLM.json(imgs.length?instr+`\n\n${en?'The attached images are the user\'s example files listed in the meta information.':'Ekteki görseller meta bilgilerde listelenen örnek dosyalardır.'}`:instr,{images:imgs,big:true,maxTokens:12000});
    const p=String(r.nihai_prompt||r.prompt||'').trim();if(!p)throw new Error(t('Boş yanıt geldi','Empty reply'));
    S.ai={prompt:p,steps:arr(r.adimlar).map(String),critique:arr(r.elestiri).map(String),assumptions:arr(r.varsayimlar).map(String),at:now(),lang:S.lang};S.out='ai';
    updateOut();toast(t('Nihai prompt hazır','Final prompt ready'));
    if(window.innerWidth<1000)$('#output').scrollIntoView({behavior:'smooth'});
  }catch(e){toast(t('Üretilemedi: ','Generation failed: ')+(e.message||e),5000)}
  finally{b.disabled=false;b.textContent=t('AI ile nihai promptu üret','Generate final prompt with AI')}
}

/* ----- Kaydetme (Kayıtlı Promptlar) ----- */
const DIL_MAP={'Türkçe':'Türkçe','İngilizce':'İngilizce','Çift dilli (TR + EN)':['Türkçe','İngilizce'],'Arapça':'Arapça','Rusça':'Rusça','Almanca':'Almanca','Fransızca':'Fransızca','İspanyolca':'İspanyolca'};
function formStateJson(){const c=JSON.parse(JSON.stringify(S));(c.files||[]).forEach(f=>{if(f.text&&f.text.length>4000)f.text=f.text.slice(0,4000)});return JSON.stringify(c)}
function saveFormRecord(draft){
  if(!guard())return;
  const prev=S.recordId&&DATA.gecmis.get(S.recordId);
  const def=prev?prev.baslik:(S.meta.proj||(S.txt['konu.konu']||'').slice(0,70)||(S.purpose?purposeLine(0)+' promptu':'Yeni ön prompt'));
  modal({title:draft?t('Taslak olarak kaydet','Save as draft'):t('Kayıtlı Promptlar’a kaydet','Save to Saved Prompts'),ok:t('Kaydet','Save'),body:`<div class="fld"><label for="svT">${esc(t('Başlık','Title'))}</label><input id="svT" value="${esc(def)}"></div>
    <p class="hint" style="margin:0">${esc(t('Kayıt yeri: 3 · Kayıtlı Promptlar. ','Saved to: 3 · Saved Prompts. '))}${esc(prev?t(`Yeni revizyon (Rev.${String((prev.revNo||1)+1).padStart(2,'0')}) olarak saklanır; önceki hali silinmez.`,`Stored as a new revision (Rev.${String((prev.revNo||1)+1).padStart(2,'0')}); the previous one is kept.`):t('İlk revizyon (Rev.01) olarak saklanır.','Stored as the first revision (Rev.01).'))}${!draft&&S.ai&&S.ai.prompt?esc(t(' AI ile üretilen nihai prompt da ayrı kayıt olarak eklenip bu ön prompta bağlanır.',' The AI-generated final prompt is added as a separate linked record.')):''}</p>`,
    onOk:async host=>{
      const title=$('#svT',host).value.trim()||def;
      const plats=(S.sel['platform.g']||[]).map(x=>{const p=platByName(x);return p?p.ad:null}).filter(Boolean);
      const dil=[...new Set((S.sel['dil.g']||[]).flatMap(x=>arr(DIL_MAP[x]||[])))];
      const revNo=prev?(prev.revNo||1)+1:1;
      const base={konu:(S.txt['konu.konu']||S.meta.proj||'').trim(),kategori:S.purpose||'',platform:plats,dil,kaynakDosya:(S.files||[]).map(f=>f.name).join(', '),revNo,oncekiRev:prev?S.recordId:'',favori:false,sonuc:'',sonucNot:'',sonKullanim:''};
      const idF=uid('g');const items=[];const hasAi=!draft&&S.ai&&S.ai.prompt;const idN=hasAi?uid('g'):null;
      items.push({id:idF,data:Object.assign({},base,{baslik:title,tur:'Ön prompt formu',durum:draft?'Taslak':'Tamam',metin:lastText,formState:formStateJson(),bagli:idN?[idN]:[],
        kullanimNotu:S.mode==='meta'?'Meta form + üretim talimatı: sohbet yapay zekâsına yapıştırın; hedef platform için nihai promptu yazar.':'Doğrudan prompt: hedef yapay zekâya yapıştırın.',not:'Evodak Ön Prompt Hazırlama Formu ile oluşturuldu'+(prev?` (önceki revizyon: ${S.recordId}).`:'.')})});
      if(idN)items.push({id:idN,data:Object.assign({},base,{baslik:title+' – nihai prompt',tur:'Nihai prompt',durum:'Tamam',metin:S.ai.prompt,bagli:[idF],oncekiRev:'',kullanimNotu:'Hedef yapay zekâya doğrudan yapıştırın.',not:'AI ile üretildi ('+fmtDate(S.ai.at)+').'+((S.ai.critique||[]).length?' Öz-eleştiride düzeltilenler: '+S.ai.critique.join(' · '):'')+((S.ai.assumptions||[]).length?' Varsayımlar: '+S.ai.assumptions.join(' · '):'')})});
      try{await saveMany('gecmis',items,{note:draft?'Taslak kaydedildi (form)':'Formdan kaydedildi'});S.recordId=idF;updateOut();toast(draft?t('Taslak kaydedildi','Draft saved'):t('Kaydedildi','Saved'))}
      catch(e){if(e.message!=='no-write')toast(t('Kaydedilemedi: ','Could not save: ')+e.message,5000);return false}
    }});
}
function openSavedPicker(){
  const rows=[...DATA.gecmis.entries()].filter(([,d])=>d.formState).sort((a,b)=>String(b[1].guncelleme||b[1].eklenme||'').localeCompare(String(a[1].guncelleme||a[1].eklenme||'')));
  if(!rows.length){toast(t('Formdan kaydedilmiş kayıt yok.','No records saved from the form.'));return}
  modal({title:t('Kayıtlı formu aç','Open saved form'),ok:t('Kapat','Close'),cancel:'',wide:true,body:`<div class="mini">${rows.map(([i,d])=>`<div class="r" data-loadform="${i}"><span class="w"><b>${esc(d.baslik)}</b> <span class="badge">${d.durum==='Taslak'?esc(t('Taslak','Draft')):'Rev.'+String(d.revNo||1).padStart(2,'0')}</span></span><small>${fmtDate(d.guncelleme||d.eklenme)} · ${esc(d.guncelleyen||d.ekleyen||'')}</small></div>`).join('')}</div>`});
}
document.addEventListener('click',e=>{const l=e.target.closest('[data-loadform]');if(l){$('#modalHost').innerHTML='';FORM.load(l.dataset.loadform)}});
const FORM={
  addCmd(code){const cur=S.sel['komut.g']||[];if(!cur.includes(code))S.sel['komut.g']=[...cur,code];S.example=false;saveForm();if(formBuilt&&CUR==='form')render();toast(t('Forma eklendi: ','Added to the form: ')+code)},
  load(id){const d=DATA.gecmis.get(id);if(!d||!d.formState){toast(t('Bu kayıtta form verisi yok.','This record has no form data.'));return}try{S=Object.assign(blank(),JSON.parse(d.formState),{recordId:id,example:false});saveForm();go('form');toast(t('Form yüklendi: ','Form loaded: ')+d.baslik)}catch(e){toast(t('Form verisi okunamadı','Could not read the form data'))}},
  applyParsed(o,recordId){
    const s=blank();s.example=false;
    if(o.purpose&&P(o.purpose)){s.purpose=o.purpose;const ok=P(o.purpose).subs.map(x=>sp(x).tr);s.subs=arr(o.subs).filter(x=>ok.includes(x))}
    S=s;
    const map={konu:'konu.konu',kategori:'konu.kat',amac:'amac.g',platform:'platform.g',kitle:'kitle.g',dil:'dil.g',cikti:'cikti.g',detay:'detay.det',sabit:'detay.sabit',ton:'ton.g',uzunluk:'uzunluk.g',mutlaka:'mutlaka.liste',olmasin:'olmasin.liste',ek:'ek.g'};
    ['mutlaka','olmasin','detay'].forEach(k=>{if(Array.isArray(o[k]))o[k]=o[k].join('\n')});
    applyPicked(o,map);
    arr(o.komutlar).forEach(c=>{const r=findCmd(c);if(r){const cur=S.sel['komut.g']||[];if(!cur.includes(r[1].kod))S.sel['komut.g']=[...cur,r[1].kod]}});
    S.recordId=recordId||null;saveForm();go('form');toast(t('Prompt forma ayrıştırıldı; kontrol edin','Prompt parsed into the form; please review'));
  },
  state:()=>S
};

/* ----- Olaylar ----- */
function findGroup(k){const [mod,gid]=k.split('.');const g=(M[mod]||{groups:[]}).groups.find(x=>x.id===gid);return {mod,g}}
function prune(){
  Object.keys(S.sel).forEach(k=>{const {g}=findGroup(k);if(!g){delete S.sel[k];return}
    if(g.type==='cmdx')return;
    const ok=new Set(optsOf(g).map(o=>sp(o).tr));S.sel[k]=(S.sel[k]||[]).filter(v=>v===AI||ok.has(v))});
}
function formClick(e){
  const pc=e.target.closest('[data-purpose]');
  if(pc){const id=pc.dataset.purpose;if(S.purpose!==id){S.purpose=id;S.subs=[];prune()}S.example=false;CMDALL=false;render();return}
  if(e.target.closest('[data-drop]')){pickFiles(addFormFiles);return}
  const fa=e.target.closest('[data-fan]');if(fa){analyzeFile(fa.dataset.fan,false);return}
  const fg=e.target.closest('[data-fgen]');if(fg){analyzeFile(fg.dataset.fgen,true);return}
  const fd=e.target.closest('[data-fdel]');if(fd){const id=fd.dataset.fdel;S.files=(S.files||[]).filter(x=>x.id!==id);if(FILES[id]&&FILES[id].url)URL.revokeObjectURL(FILES[id].url);delete FILES[id];refreshSection('dosya');updateOut();return}
  if(e.target.closest('[data-cmdall]')){CMDALL=true;$('#cmdlists').innerHTML=cmdLists();return}
  const nc=e.target.closest('[data-newcmd]');if(nc){const c=nc.dataset.newcmd;newRecord('kod',{kod:c.startsWith('/')?c:'/'+c,tur:'Slash Komut',platform:'Claude',kaynak:'Ön Prompt Hazırlama Formu'});return}
  const ch=e.target.closest('.chip[data-k]');
  if(ch){
    const k=ch.dataset.k,v=ch.dataset.v;
    if(k==='__sub'){S.subs=S.subs.includes(v)?S.subs.filter(x=>x!==v):[...S.subs,v];S.example=false;ch.setAttribute('aria-pressed',S.subs.includes(v));
      const c=$('#s_purpose .cmdline');c.textContent=(L()?'Main purpose: ':'Ana kullanım amacı: ')+purposeLine();c.classList.remove('empty');updateOut();return}
    const {mod,g}=findGroup(k);if(!g)return;let cur=S.sel[k]||[];
    if(g.type==='single'){cur=cur.includes(v)?[]:[v]}
    else if(v===AI){cur=cur.includes(AI)?[]:[AI]}
    else{cur=cur.filter(x=>x!==AI);cur=cur.includes(v)?cur.filter(x=>x!==v):[...cur,v]}
    S.sel[k]=cur;S.example=false;
    const scroll=window.scrollY;
    if(g.type==='cmdx'){$('#cmdlists').innerHTML=cmdLists();refreshLine('komut')}else refreshSection(mod);
    if(mod==='platform'&&$('#cmdlists'))$('#cmdlists').innerHTML=cmdLists();
    if(mod==='son')visibleMods().forEach(refreshSection);
    window.scrollTo(0,scroll);updateOut();return;
  }
  const hd=e.target.closest('header[data-toggle]');
  if(hd){const m=hd.dataset.toggle;S.collapsed[m]=!S.collapsed[m];hd.parentElement.classList.toggle('collapsed',!!S.collapsed[m]);saveForm();return}
  const a=e.target.closest('[data-act]');if(!a)return;
  const act=a.dataset.act;
  if(act==='lang'){S.lang=a.dataset.v;render()}
  else if(act==='mode'){S.mode=a.dataset.v;visibleMods().forEach(refreshLine);updateOut()}
  else if(act==='outv'){S.out=a.dataset.v;updateOut()}
  else if(act==='quick'){S.quick=true;render()}
  else if(act==='full'){S.quick=false;render()}
  else if(act==='expand'){S.collapsed={};render()}
  else if(act==='collapse'){visibleMods().forEach(m=>S.collapsed[m]=true);render()}
  else if(act==='clear'){const keep={lang:S.lang,mode:S.mode,quick:S.quick};Object.values(FILES).forEach(f=>f.url&&URL.revokeObjectURL(f.url));S=Object.assign(blank(),keep);CMDQ='';render();window.scrollTo(0,0)}
  else if(act==='example'){S=exampleState();render()}
  else if(act==='detach'){S.recordId=null;updateOut()}
  else if(act==='openSaved'){openSavedPicker()}
  else if(act==='rec'){(REC[S.purpose]||[]).forEach(([m,g,v])=>{const k=m+'.'+g;const grp=findGroup(k).g;let cur=(S.sel[k]||[]).filter(x=>x!==AI);if(m==='komut'){const r=findCmd(v);if(!r)return;v=r[1].kod}if(grp&&grp.type==='single')cur=[v];else if(!cur.includes(v))cur.push(v);S.sel[k]=cur});S.example=false;render();toast(t('Önerilen seçimler uygulandı','Recommended choices applied'))}
  else if(act==='copy'){copyText(S.out==='ai'&&S.ai&&S.ai.prompt?S.ai.prompt:lastText)}
  else if(act==='gen'){generateAI()}
  else if(act==='save'){saveFormRecord(false)}
  else if(act==='draft'){saveFormRecord(true)}
  else if(act==='jump'){$('#output').scrollIntoView({behavior:'smooth'})}
}
const cmdSearch=debounce(()=>{const el=$('#cmdlists');if(el)el.innerHTML=cmdLists()},180);
function formInput(e){
  const x=e.target;
  if(x.dataset.cmdq!==undefined){CMDQ=x.value;cmdSearch();return}
  if(x.dataset.t){S.txt[x.dataset.t]=x.value;S.example=false;refreshLine(x.dataset.t.split('.')[0]);updateOut()}
  else if(x.dataset.meta){S.meta[x.dataset.meta]=x.value;updateOut()}
}
function formChange(e){
  const x=e.target;
  if(x.dataset.cmdonly!==undefined){S.cmdOnly=x.checked;$('#cmdlists').innerHTML=cmdLists();saveForm();return}
  if(x.dataset.frole){const f=(S.files||[]).find(y=>y.id===x.dataset.frole);if(f){f.role=x.value;refreshLine('dosya');updateOut()}return}
  if(x.dataset.c){S.chk[x.dataset.c]=x.checked;refreshLine(x.dataset.c.split('.')[0]);updateOut()}
}
RENDER.form=(o)=>{
  if(o.fromData){if(!formBuilt)return;const cs=o.cols||[];if(cs.some(c=>['kod','plat','gecmis','*'].includes(c))){const sc=window.scrollY;if(typingIn($('#v-form'))){const el=$('#cmdlists');if(el)el.innerHTML=cmdLists();updateOut();return}render();window.scrollTo(0,sc)}return}
  if(o.relang){formBuilt=false}
  render();
};
