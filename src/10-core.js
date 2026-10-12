"use strict";
/* =========================================================
   EVODAK PROMPT ASİSTANI · Rev.10 — çekirdek (GitHub veri deposu)
   ========================================================= */
const $=(s,r=document)=>r.querySelector(s);
const $$=(s,r=document)=>Array.from(r.querySelectorAll(s));
const esc=s=>String(s==null?'':s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const now=()=>Date.now();
const iso=()=>new Date().toISOString();
const uid=p=>p+now().toString(36)+Math.random().toString(36).slice(2,6);
const trLower=s=>String(s||'').toLocaleLowerCase('tr-TR');
const norm=s=>trLower(s).normalize('NFD').replace(/[̀-ͯ]/g,'').replace(/ı/g,'i');
const debounce=(f,ms)=>{let t;return(...a)=>{clearTimeout(t);t=setTimeout(()=>f(...a),ms)}};
const arr=v=>Array.isArray(v)?v:(v===undefined||v===null||v===''?[]:[v]);
const clone=o=>JSON.parse(JSON.stringify(o));
const LS={get(k,d){try{const v=localStorage.getItem(k);return v?JSON.parse(v):d}catch(e){return d}},set(k,v){try{localStorage.setItem(k,JSON.stringify(v))}catch(e){}}};

/* ---------- Dil (TR / EN) ---------- */
const UI={lang:LS.get('evd-lang','tr')};
const t=(tr,en)=>UI.lang==='en'?(en==null?tr:en):tr;
const isEN=()=>UI.lang==='en';
const fmtDate=v=>{if(!v)return '';const d=new Date(v);if(isNaN(d))return String(v);return d.toLocaleDateString(isEN()?'en-GB':'tr-TR',{day:'2-digit',month:'2-digit',year:'numeric'})+' '+d.toLocaleTimeString(isEN()?'en-GB':'tr-TR',{hour:'2-digit',minute:'2-digit'})};
const fmtDay=v=>{if(!v)return '';const d=new Date(v);if(isNaN(d))return String(v);return d.toLocaleDateString(isEN()?'en-GB':'tr-TR',{day:'2-digit',month:'2-digit',year:'numeric'})};
const num=n=>Number(n||0).toLocaleString(isEN()?'en-GB':'tr-TR');

let toastT;
function toast(m,ms){const el=$('#toast');el.textContent=m;el.hidden=false;clearTimeout(toastT);toastT=setTimeout(()=>el.hidden=true,ms||2800)}
async function copyText(s){
  try{await navigator.clipboard.writeText(s);toast(t('Kopyalandı','Copied'));return true}
  catch(e){const ta=document.createElement('textarea');ta.value=s;ta.style.position='fixed';ta.style.opacity='0';document.body.appendChild(ta);ta.select();let ok=false;try{ok=document.execCommand('copy')}catch(_){}ta.remove();toast(ok?t('Kopyalandı','Copied'):t('Kopyalanamadı; metni seçip elle kopyalayın','Copy blocked; select the text and copy manually'));return ok}
}
const scripts={};
function loadScript(src){if(scripts[src])return scripts[src];scripts[src]=new Promise((res,rej)=>{const s=document.createElement('script');s.src=src;s.onload=res;s.onerror=()=>{delete scripts[src];rej(new Error(t('Kitaplık yüklenemedi: ','Library failed to load: ')+src))};document.head.appendChild(s)});return scripts[src]}
const LIB_XLSX='https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.18.5/xlsx.full.min.js';
const LIB_MAMMOTH='https://cdnjs.cloudflare.com/ajax/libs/mammoth/1.6.0/mammoth.browser.min.js';
const LIB_PDF='https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js';
const LIB_PDFW='https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';

/* ---------- Dosya okuma ---------- */
const extOf=n=>(String(n).split('.').pop()||'').toLowerCase();
function kindOf(file){const ty=file.type||'',e=extOf(file.name);
  if(ty.startsWith('image/')||['png','jpg','jpeg','webp','gif','heic','bmp'].includes(e))return 'image';
  if(ty.startsWith('video/')||['mp4','mov','webm','m4v','avi','mkv'].includes(e))return 'video';
  if(e==='pdf')return 'pdf';if(e==='docx')return 'docx';
  if(['xlsx','xls','xlsm','csv','ods'].includes(e))return 'sheet';
  if(['txt','md','json','srt','vtt','html','htm','rtf','tsv'].includes(e)||ty.startsWith('text/'))return 'text';
  if(ty.startsWith('audio/'))return 'audio';return 'other'}
const KIND_LABEL=()=>({image:t('Görsel','Image'),video:'Video',pdf:'PDF',docx:'Word',sheet:t('Excel / tablo','Excel / sheet'),text:t('Metin','Text'),audio:t('Ses','Audio'),other:t('Dosya','File')});
async function readWorkbook(file){await loadScript(LIB_XLSX);return window.XLSX.read(await file.arrayBuffer(),{type:'array'})}
async function readDocText(file){const k=kindOf(file);
  if(k==='text'){let s=await file.text();if(['html','htm'].includes(extOf(file.name))){s=new DOMParser().parseFromString(s,'text/html').body.innerText}return s}
  if(k==='docx'){await loadScript(LIB_MAMMOTH);return (await window.mammoth.extractRawText({arrayBuffer:await file.arrayBuffer()})).value}
  if(k==='pdf'){await loadScript(LIB_PDF);const lib=window.pdfjsLib;lib.GlobalWorkerOptions.workerSrc=LIB_PDFW;const pdf=await lib.getDocument({data:new Uint8Array(await file.arrayBuffer())}).promise;const out=[];for(let i=1;i<=Math.min(pdf.numPages,80);i++){const p=await pdf.getPage(i);out.push((await p.getTextContent()).items.map(x=>x.str).join(' '))}return out.join('\n\n')}
  if(k==='sheet'){const wb=await readWorkbook(file);return wb.SheetNames.map(n=>'### '+n+'\n'+window.XLSX.utils.sheet_to_csv(wb.Sheets[n])).join('\n\n')}
  return ''}
async function shrinkImage(blob,max=1568){try{const bmp=await createImageBitmap(blob);const sc=Math.min(1,max/Math.max(bmp.width,bmp.height));if(sc===1&&blob.size<3.5e6&&/image\/(png|jpeg|webp|gif)/.test(blob.type))return blob;const c=document.createElement('canvas');c.width=Math.round(bmp.width*sc);c.height=Math.round(bmp.height*sc);c.getContext('2d').drawImage(bmp,0,0,c.width,c.height);return await new Promise(r=>c.toBlob(r,'image/jpeg',.86))}catch(e){return blob}}
function videoFrames(file,n=4){return new Promise((resolve,reject)=>{const v=document.createElement('video');v.muted=true;v.playsInline=true;v.preload='auto';const url=URL.createObjectURL(file);v.src=url;const frames=[];let dur=0,i=0;
  const fail=()=>{URL.revokeObjectURL(url);reject(new Error(t('Video okunamadı (tarayıcı bu biçimi açamıyor olabilir).','Could not read the video (the browser may not support this format).')))};
  v.onerror=fail;v.onloadedmetadata=()=>{dur=v.duration||1;seek()};
  function seek(){if(i>=n){URL.revokeObjectURL(url);resolve({frames,duration:dur});return}v.currentTime=Math.min(dur-0.05,dur*(i+0.5)/n)}
  v.onseeked=()=>{const c=document.createElement('canvas');const sc=Math.min(1,960/Math.max(v.videoWidth,v.videoHeight)||1);c.width=Math.max(1,Math.round(v.videoWidth*sc));c.height=Math.max(1,Math.round(v.videoHeight*sc));c.getContext('2d').drawImage(v,0,0,c.width,c.height);c.toBlob(b=>{if(b)frames.push(b);i++;seek()},'image/jpeg',.8)};
  setTimeout(()=>{if(i<n&&!frames.length)fail()},20000)})}
const blobB64=b=>new Promise((res,rej)=>{const r=new FileReader();r.onload=()=>res(String(r.result).split(',')[1]);r.onerror=rej;r.readAsDataURL(b)});
function saveBlob(name,blob){const a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download=name;document.body.appendChild(a);a.click();setTimeout(()=>{URL.revokeObjectURL(a.href);a.remove()},4000);toast(t('Dosya indirildi','File downloaded'))}

/* ---------- Ayarlar ---------- */
const CFG=Object.assign({token:'',aiKey:'',aiModel:'claude-sonnet-5-5',aiModelBig:'claude-opus-5-5'},LS.get('evd-cfg',{}));
const saveCfg=()=>LS.set('evd-cfg',CFG);

/* ---------- Yerel önbellek (IndexedDB) ---------- */
const IDB={db:null,
  open(){if(this.db)return Promise.resolve(this.db);return new Promise((res,rej)=>{try{const r=indexedDB.open('evodak-prompt-asistani',1);r.onupgradeneeded=()=>r.result.createObjectStore('kv');r.onsuccess=()=>{this.db=r.result;res(this.db)};r.onerror=()=>rej(r.error)}catch(e){rej(e)}})},
  async get(k){try{const db=await this.open();return await new Promise(res=>{const q=db.transaction('kv').objectStore('kv').get(k);q.onsuccess=()=>res(q.result);q.onerror=()=>res(undefined)})}catch(e){return undefined}},
  async set(k,v){try{const db=await this.open();await new Promise(res=>{const tx=db.transaction('kv','readwrite');tx.objectStore('kv').put(v,k);tx.oncomplete=res;tx.onerror=res})}catch(e){}}};

/* ---------- Veri ---------- */
const COLS=['kod','kodref','kodmeta','uzun','rehber','uzunmeta','plat','model','gecmis','log'];
const LISTCOLS=['kod','kodref','uzun','rehber','plat','model','gecmis'];
const DATA={};LISTCOLS.forEach(c=>DATA[c]=new Map());
const META={kodmeta:{kilavuz:[],kategoriler:[],baslikEsleme:[],eskiKategori:[],listeler:{},aktarimRaporu:[]},uzunmeta:{gunluk:[]}};
let LOG=[];let LOGARR=[];
const LOADED={};
const STATE={online:false,source:'',cachedAt:null,syncing:false};
const listeners=[];const onData=f=>listeners.push(f);
let notifyT;const pending=new Set();
function notify(col){pending.add(col);clearTimeout(notifyT);notifyT=setTimeout(()=>{const cs=[...pending];pending.clear();listeners.forEach(f=>{try{f(cs)}catch(e){console.error(e)}})},40)}
function setCol(col,v){
  if(col==='log'){LOGARR=Array.isArray(v)?v:[];LOG=LOGARR.slice().reverse();LOADED.log=true;return}
  if(col in META){META[col]=Object.assign(META[col],v||{});LOADED[col]=true;return}
  DATA[col]=new Map(arr(v).map(r=>[r.id,r]));LOADED[col]=true;
}
const colArray=col=>col==='log'?LOGARR:(col in META)?META[col]:[...DATA[col].values()];
const serialize=v=>Array.isArray(v)?'[\n'+v.map(x=>JSON.stringify(x)).join(',\n')+'\n]\n':JSON.stringify(v,null,1)+'\n';

const GH={owner:'evodakkonaklama-glitch',repo:'Evodak-Prompt-Asistan-',branch:'main',head:null,shas:{},user:'',canPush:false,priv:false,
  base(){return `/repos/${this.owner}/${this.repo}`},
  web(){return `https://github.com/${this.owner}/${this.repo}`},
  async req(path,opt={}){
    const h={'Accept':'application/vnd.github+json','X-GitHub-Api-Version':'2022-11-28'};
    if(CFG.token)h.Authorization='Bearer '+CFG.token;Object.assign(h,opt.headers||{});
    const r=await fetch('https://api.github.com'+path,{method:opt.method||'GET',headers:h,body:opt.body?JSON.stringify(opt.body):undefined,cache:'no-store'});
    if(!r.ok){let m='';try{m=(await r.json()).message}catch(_){}const e=new Error('GitHub '+r.status+(m?': '+m:''));e.status=r.status;throw e}
    return opt.raw?r.text():r.json();
  },
  async headSha(){return (await this.req(this.base()+'/git/ref/heads/'+this.branch)).object.sha},
  async treeOf(commitSha){const c=await this.req(this.base()+'/git/commits/'+commitSha);const tr=await this.req(this.base()+'/git/trees/'+c.tree.sha+'?recursive=1');const m={};tr.tree.forEach(e=>{const mm=e.path.match(/^data\/(\w+)\.json$/);if(mm)m[mm[1]]=e.sha});return {tree:c.tree.sha,shas:m}},
  async blob(sha){return JSON.parse(await this.req(this.base()+'/git/blobs/'+sha,{headers:{Accept:'application/vnd.github.raw'},raw:true}))},
  async raw(col){const r=await fetch(`https://raw.githubusercontent.com/${this.owner}/${this.repo}/${this.branch}/data/${col}.json?v=${now()}`,{cache:'no-store'});if(!r.ok){const e=new Error('raw '+r.status);e.status=r.status;throw e}return r.json()},
  async whoami(){
    if(!CFG.token){this.user='';this.canPush=false;return}
    const u=await this.req('/user');this.user=u.login;
    const rp=await this.req(this.base());this.canPush=!!(rp.permissions&&rp.permissions.push);this.priv=!!rp.private;
  }
};
async function cacheSave(){const o={at:now(),head:GH.head,shas:GH.shas};COLS.forEach(c=>o[c]=colArray(c));await IDB.set('cache',o)}
async function cacheLoad(){const o=await IDB.get('cache');if(!o)return false;COLS.forEach(c=>{if(o[c]!==undefined)setCol(c,o[c])});STATE.cachedAt=o.at;GH.shas=o.shas||{};return true}
const canWrite=()=>!!(CFG.token&&GH.canPush&&STATE.online);

function setConn(cls,txt){const c=$('#conn');c.className='conn '+cls;c.querySelector('span').textContent=txt}
function connState(){
  if(STATE.syncing)return setConn('',t('Kaydediliyor…','Saving…'));
  if(!STATE.online)return setConn('off',STATE.cachedAt?t('Çevrimdışı · önbellek','Offline · cached'):t('Çevrimdışı','Offline'));
  if(canWrite())return setConn('ok',(GH.user?GH.user+' · ':'')+t('GitHub · güncel','GitHub · up to date'));
  if(CFG.token&&!GH.canPush)return setConn('ro',t('Salt okunur (yazma izni yok)','Read-only (no write access)'));
  setConn('ro',t('Salt okunur · kaydetmek için bağlanın','Read-only · connect to save'));
}
async function loadAll(force){
  STATE.syncing=false;setConn('',t('Yükleniyor…','Loading…'));
  try{
    if(CFG.token){
      if(!GH.user)await GH.whoami();
      const head=await GH.headSha();
      if(!force&&head===GH.head&&COLS.every(c=>LOADED[c])){STATE.online=true;connState();return false}
      const {shas}=await GH.treeOf(head);
      await Promise.all(COLS.map(async col=>{
        if(!force&&shas[col]&&shas[col]===GH.shas[col]&&LOADED[col])return;
        if(!shas[col]){setCol(col,col in META?{}:[]);return}
        setCol(col,await GH.blob(shas[col]));
      }));
      GH.head=head;GH.shas=shas;STATE.source='api';
    }else{
      await Promise.all(COLS.map(async col=>{try{setCol(col,await GH.raw(col))}catch(e){if(e.status===404&&col!=='log')throw e;setCol(col,col in META?{}:[])}}));
      STATE.source='raw';
    }
    STATE.online=true;STATE.cachedAt=now();cacheSave();connState();notify('*');return true;
  }catch(e){
    console.warn(e);STATE.online=false;
    if(e.status===401){banner(t('GitHub anahtarı geçersiz veya süresi dolmuş. Ayarlar’dan yeni anahtar girin.','The GitHub token is invalid or expired. Enter a new one in Settings.'),'err',true)}
    else if(e.status===404&&!CFG.token){banner(t('Veri deposu gizli (private) görünüyor. Görmek için Ayarlar’dan GitHub anahtarınızı girin.','The data repository looks private. Enter your GitHub token in Settings to view it.'),'err',true)}
    else banner(t('Veriler GitHub’dan alınamadı','Could not load data from GitHub')+(STATE.cachedAt?t('; cihazdaki son kopya gösteriliyor ('+fmtDate(STATE.cachedAt)+').','; showing the last copy on this device ('+fmtDate(STATE.cachedAt)+').'):'.')+' '+esc(e.message),'err');
    connState();notify('*');return false;
  }
}
async function poll(){if(document.hidden||STATE.syncing||!CFG.token)return;try{const h=await GH.headSha();if(h!==GH.head){await loadAll(false)}else if(!STATE.online){STATE.online=true;connState()}}catch(e){}}
setInterval(poll,45000);document.addEventListener('visibilitychange',()=>{if(!document.hidden)poll()});

/* Tek commit: koleksiyon + log */
async function commitChange(col,mutate,logEntries,message){
  if(!CFG.token)throw new Error(t('Kaydetmek için Ayarlar’dan GitHub bağlantısı kurun.','Connect GitHub in Settings to save.'));
  if(!GH.canPush)throw new Error(t('Bu GitHub hesabının depoya yazma izni yok.','This GitHub account cannot write to the repository.'));
  STATE.syncing=true;connState();
  try{
    for(let attempt=0;attempt<4;attempt++){
      const head=await GH.headSha();
      if(head!==GH.head){
        const {shas}=await GH.treeOf(head);
        for(const c of [col,'log']){if(shas[c]&&shas[c]!==GH.shas[c])setCol(c,await GH.blob(shas[c]))}
        GH.head=head;GH.shas=shas;notify(col);
      }
      const cm=await GH.req(GH.base()+'/git/commits/'+head);
      const next=mutate(clone(colArray(col)));
      const nextLog=[...LOGARR,...logEntries].slice(-3000);
      const tree=await GH.req(GH.base()+'/git/trees',{method:'POST',body:{base_tree:cm.tree.sha,tree:[
        {path:`data/${col}.json`,mode:'100644',type:'blob',content:serialize(next)},
        {path:'data/log.json',mode:'100644',type:'blob',content:serialize(nextLog)}]}});
      const nc=await GH.req(GH.base()+'/git/commits',{method:'POST',body:{message,tree:tree.sha,parents:[head]}});
      try{await GH.req(GH.base()+'/git/refs/heads/'+GH.branch,{method:'PATCH',body:{sha:nc.sha,force:false}})}
      catch(e){if(e.status===422||e.status===409)continue;throw e}
      setCol(col,next);setCol('log',nextLog);GH.head=nc.sha;
      GH.treeOf(nc.sha).then(r=>{if(GH.head===nc.sha){GH.shas=r.shas;cacheSave()}}).catch(()=>{});
      notify(col);notify('log');return next;
    }
    throw new Error(t('Aynı anda başka bir kayıt yapıldı; lütfen tekrar deneyin.','Someone else saved at the same time; please try again.'));
  }finally{STATE.syncing=false;connState()}
}
const SKIP=new Set(['guncelleme','guncelleyen']);
function clip(v){if(typeof v==='string'&&v.length>20000)return v.slice(0,20000)+' …';return v}
function diffFields(a,b){const ch={};new Set([...Object.keys(a||{}),...Object.keys(b||{})]).forEach(k=>{if(SKIP.has(k))return;const x=a?a[k]:undefined,y=b?b[k]:undefined;if(JSON.stringify(x??'')!==JSON.stringify(y??''))ch[k]=k==='formState'?['…',t('(form güncellendi)','(form updated)')]:[clip(x??''),clip(y??'')]});return ch}
const logId=()=>'L'+now().toString(36)+Math.random().toString(36).slice(2,5);
function guard(){if(!canWrite()){toast(CFG.token?t('Yazma izni yok veya çevrimdışısınız.','No write access or offline.'):t('Kaydetmek için Ayarlar’dan GitHub ile bağlanın.','Connect GitHub in Settings to save.'),4000);if(!CFG.token)go('ayar');return false}return true}
function colLabel(col){return (COLDEF[col]&&COLDEF[col].name())||col}
async function saveRecord(col,id,data,opt={}){
  if(!guard())throw new Error('no-write');
  const old=DATA[col].get(id);const isNew=!old;
  const stamp={guncelleme:iso(),guncelleyen:GH.user};if(isNew){stamp.eklenme=iso();stamp.ekleyen=GH.user}
  const body=Object.assign({},old||{},data,stamp,{id});
  const ch=diffFields(old,body);
  if(!isNew&&!Object.keys(ch).length&&!opt.force)return id;
  const title=COLDEF[col].title(body);
  const entry={id:logId(),at:iso(),by:GH.user,col,docId:id,action:opt.action||(isNew?'ekle':'düzenle'),title,changes:isNew?{}:ch,note:opt.note||''};
  await commitChange(col,a=>{const i=a.findIndex(r=>r.id===id);if(i>=0)a[i]=Object.assign({},a[i],data,stamp,{id});else a.push(body);if(COLDEF[col].calc)COLDEF[col].calc(i>=0?a[i]:body);return a},[entry],`${entry.action}: ${colLabel(col)} · ${title} (${GH.user})`);
  return id;
}
async function saveMany(col,items,opt={}){
  if(!guard())throw new Error('no-write');
  const entries=[];const stampBase={guncelleme:iso(),guncelleyen:GH.user};
  items.forEach(({id,data})=>{const old=DATA[col].get(id);entries.push({id:logId(),at:iso(),by:GH.user,col,docId:id,action:old?'düzenle':'ekle',title:COLDEF[col].title(Object.assign({},old||{},data)),changes:old?diffFields(old,Object.assign({},old,data)):{},note:opt.note||''})});
  await commitChange(col,a=>{items.forEach(({id,data})=>{const i=a.findIndex(r=>r.id===id);const st=Object.assign({},stampBase,i<0?{eklenme:iso(),ekleyen:GH.user}:{});if(i>=0)a[i]=Object.assign({},a[i],data,st,{id});else a.push(Object.assign({},data,st,{id}));if(COLDEF[col].calc)COLDEF[col].calc(a[i>=0?i:a.length-1])});return a},entries,`${opt.note||t('toplu kayıt','bulk save')}: ${colLabel(col)} · ${items.length} (${GH.user})`);
}
async function deleteRecord(col,id,opt={}){
  if(!guard())return;const old=DATA[col].get(id);if(!old)return;
  const entry={id:logId(),at:iso(),by:GH.user,col,docId:id,action:'sil',title:COLDEF[col].title(old),snapshot:old,changes:{},note:opt.note||''};
  await commitChange(col,a=>a.filter(r=>r.id!==id),[entry],`sil: ${colLabel(col)} · ${entry.title} (${GH.user})`);
}
async function saveMeta(col,mutate,note){
  if(!guard())throw new Error('no-write');
  const entry={id:logId(),at:iso(),by:GH.user,col,docId:col,action:'düzenle',title:note,changes:{},note:''};
  await commitChange(col,o=>{mutate(o);return o},[entry],`düzenle: ${col} · ${note} (${GH.user})`);
}
async function restoreLog(l){
  if(!guard())return;
  if(l.action==='sil'&&l.snapshot){await saveRecord(l.col,l.docId,l.snapshot,{action:'geri al',note:t('Silinen kayıt geri getirildi','Deleted record restored'),force:true});toast(t('Kayıt geri getirildi','Record restored'));return}
  if(l.action==='ekle'){await deleteRecord(l.col,l.docId,{note:t('Ekleme geri alındı','Addition undone')});toast(t('Ekleme geri alındı','Addition undone'));return}
  if(!DATA[l.col]||!DATA[l.col].get(l.docId)){toast(t('Kayıt artık yok; geri alınamadı','The record no longer exists'));return}
  const patch={};Object.entries(l.changes||{}).forEach(([k,[o]])=>{if(k!=='formState')patch[k]=o});
  await saveRecord(l.col,l.docId,patch,{action:'geri al',note:t('Değişiklik geri alındı ','Change undone ')+'('+fmtDate(l.at)+')'});toast(t('Değişiklik geri alındı','Change undone'));
}

/* ---------- Platformlar ---------- */
const ALL="Genel (Tüm AI'lar)";
const PALIAS={'claude':'Claude (Anthropic)','gemini':'Gemini (Google)','google gemini':'Gemini (Google)','grok':'Grok (xAI)','copilot':'Microsoft Copilot','openai chatgpt':'ChatGPT',"genel (tüm llm'ler)":ALL,"tüm llm'ler":ALL,'genel':ALL,'bilinmeyen':'Belirtilmemiş','leonardo ai':'Leonardo.ai'};
const platList=()=>[...DATA.plat.values()];
function platByName(n){if(!n)return null;const k=trLower(n).trim();const a=PALIAS[k]||n;return platList().find(p=>trLower(p.ad)===trLower(a))||null}
function platTokens(v){const out=[];arr(v).forEach(s=>String(s).split(/\s*(?:&|\/|,|\+)\s*/).forEach(x=>{x=x.trim();if(!x)return;const p=platByName(x);out.push(p?p.ad:x)}));return [...new Set(out)]}
const platNames=()=>platList().map(p=>p.ad).sort((a,b)=>a===ALL?-1:b===ALL?1:a.localeCompare(b,'tr'));
function usageOf(name){const has=v=>platTokens(v).includes(name);return {k:[...DATA.kod.entries()].filter(([,d])=>has(d.platform)),u:[...DATA.uzun.entries()].filter(([,d])=>has(d.platform)),g:[...DATA.gecmis.entries()].filter(([,d])=>has(d.platform))}}

/* ---------- Kod & Command yardımcıları ---------- */
const KMETA=()=>META.kodmeta;
const listOf=k=>arr((KMETA().listeler||{})[k]);
function altInfo(alt){const ks=KMETA().kategoriler||[];return ks.find(k=>k.etiket===alt||k.altKod===String(alt).split(' ')[0])||null}
function turEnOf(tr){const a=listOf('Tür (TR)'),b=listOf('Type (EN)');const i=a.indexOf(tr);return i>=0?b[i]||'':''}
function turClass(t_){if(/Slash/.test(t_))return 'b';if(/Şablon/.test(t_))return 'g';if(/Uzun/.test(t_))return 'y';if(/Kısa Kod/.test(t_))return 'o';if(/İpucu|Çerçeve|Meta/.test(t_))return 'x';return ''}
const turBadge=t_=>t_?`<span class="badge ${turClass(t_)}">${esc(isEN()?(turEnOf(t_)||t_):t_)}</span>`:'';
const DURUM_EN={'Yeni / İşlenmedi':'New / Unprocessed','Çeviri Eksik':'Translation Missing','Düzenlendi':'Edited','Test Edildi ✓':'Tested ✓','Favori ★':'Favourite ★','Arşiv':'Archive'};
function durumBadge(d){if(!d)return '';const cls=/Test/.test(d)?'okb':/Favori/.test(d)?'g':/Arşiv/.test(d)?'x':/Yeni|Eksik/.test(d)?'ai':'';return `<span class="badge ${cls}">${esc(isEN()?DURUM_EN[d]||d:d)}</span>`}
function kodKontrol(d){const m=[];if(!d.id)m.push('ID');if(!d.altKat)m.push(t('Alt Kategori','Sub-category'));if(!d.tur)m.push(t('Tür','Type'));if(!d.platform)m.push('AI / Platform');if(!d.baslikTr)m.push(t('Başlık (TR)','Title (TR)'));return m.length?'⚠ '+t('Eksik: ','Missing: ')+m.join(', '):'✓ '+t('Tam','Complete')}
function refKontrol(d){const m=[];if(!d.refTur)m.push(t('Referans Türü','Reference type'));if(!d.altKat)m.push(t('Alt Kategori','Sub-category'));if(!d.kalemTr)m.push(t('Kalem','Item'));return m.length?'⚠ '+t('Eksik: ','Missing: ')+m.join(', '):'✓ '+t('Tam','Complete')}
function findCmd(code){const c=trLower(code).trim();if(!c)return null;
  for(const [id,d] of DATA.kod)if(d.kod&&trLower(d.kod).trim()===c)return [id,d];
  for(const [id,d] of DATA.kod){const al=String(d.alias||'').split(/[,;]\s*/).map(x=>trLower(x).trim().split(' ')[0]);if(al.includes(c))return [id,d]}
  return null}
function cmdCompat(d,targets){const ps=platTokens(d.platform).filter(p=>p!=='Belirtilmemiş');if(!targets||!targets.length||!ps.length)return null;
  if(ps.includes(ALL)){const nonLlm=targets.filter(x=>{const p=platByName(x);return p&&!(arr(p.formGrup).includes('llm')||arr(p.formGrup).includes('code'))&&x!==ALL});return nonLlm.length===targets.length?t('Sohbet modelleri için; seçilen hedef: ','For chat models; selected target: ')+targets.join(', '):null}
  if(targets.some(x=>ps.includes(x)))return null;return t('Çalıştığı: ','Works on: ')+ps.join(', ')}
const pick=(d,tr,en)=>isEN()?(d[en]||d[tr]||''):(d[tr]||d[en]||'');
/* Kod ↔ Uzun eşleşmeleri */
let XLINK=null;
function xlinks(){if(XLINK)return XLINK;const key=s=>norm(s).replace(/[^a-z0-9]/g,'').slice(0,70);const uz=new Map();
  DATA.uzun.forEach((d,i)=>{if(d.mukerrer)return;[d.metinEn,d.metinTr,d.baslikEn,d.baslikTr].forEach(s=>{const k=key(s);if(k.length>14)uz.set(k,i)})});
  const k2u={},u2k={};DATA.kod.forEach((d,i)=>{if(d.kod&&!/Uzun|Şablon|İpucu/.test(d.tur||''))return;for(const s of [d.metinEn,d.metinTr,d.baslikEn,d.baslikTr]){const u=uz.get(key(s));if(u){k2u[i]=u;(u2k[u]=u2k[u]||[]).push(i);break}}});
  XLINK={k2u,u2k};return XLINK}
onData(cs=>{if(cs.includes('kod')||cs.includes('uzun')||cs.includes('*'))XLINK=null});

/* ---------- Alan tanımları ---------- */
const DILLER=['Türkçe','İngilizce','Arapça','Rusça','Almanca','Fransızca','İspanyolca'];
const DIL_EN={'Türkçe':'Turkish','İngilizce':'English','Arapça':'Arabic','Rusça':'Russian','Almanca':'German','Fransızca':'French','İspanyolca':'Spanish'};
const FG_LABEL=()=>({llm:t('Sohbet / metin','Chat / text'),image:t('Görsel','Image'),video:'Video',audio:t('Müzik / ses','Music / audio'),code:t('Kod','Code')});
const PURPOSE_LABEL=()=>Object.fromEntries(PURPOSES.map(p=>[p.id,isEN()?p.en:p.tr]));
const TUR_G=['Ön prompt formu','Meta-prompt','Nihai prompt'];
const TUR_G_EN={'Ön prompt formu':'Pre-prompt form','Meta-prompt':'Meta-prompt','Nihai prompt':'Final prompt'};
const distinct=(col,k)=>[...new Set([...DATA[col].values()].map(d=>d[k]).filter(Boolean))].sort((a,b)=>String(a).localeCompare(String(b),'tr'));
/* f: k, tr (dosya başlığı), en, type, req, calc, tbl (tabloda göster) */
const COLDEF={
  kod:{prefix:'PR-',name:()=>t('Kod & Command Prompt','Code & Command Prompt'),title:d=>d.kod||pick(d,'baslikTr','baslikEn')||d.id,
    calc:d=>{const a=altInfo(d.altKat);if(a){d.anaKat=a.anaTr;d.anaKatEn=a.anaEn}const te=turEnOf(d.tur);if(te)d.turEn=te},
    fields:[
    {k:'id',tr:'ID',en:'ID',req:true,ro:true,tbl:1},{k:'anaKat',tr:'Ana Kategori (TR)',en:'Main Category (TR)',calc:true,tbl:1},{k:'sektor',tr:'Sektör / Alan',en:'Sector / Field',type:'list',list:'Sektör / Alan',tbl:1},
    {k:'altKat',tr:'Alt Kategori (seç)',en:'Sub-category (select)',type:'alt',req:true,tbl:1},{k:'tur',tr:'Tür (TR)',en:'Type (TR)',type:'list',list:'Tür (TR)',req:true,tbl:1},
    {k:'kod',tr:'Kod / Command',en:'Code / Command',mono:true,tbl:1},{k:'alias',tr:'Alternatif Yazımlar (Alias)',en:'Alternative spellings (alias)'},
    {k:'platform',tr:'AI / Platform',en:'AI / Platform',type:'list',list:'AI / Platform',req:true,tbl:1},
    {k:'baslikTr',tr:'Beceri / Prompt Başlığı (TR)',en:'Skill / Prompt Title (TR)',req:true,tbl:1},{k:'baslikEn',tr:'Skill / Prompt Title (EN)',en:'Skill / Prompt Title (EN)',tbl:1},
    {k:'aciklamaTr',tr:'Açıklama (TR)',en:'Description (TR)',type:'area',tbl:1},{k:'neZamanTr',tr:'Ne Zaman Kullanılır (TR)',en:'When to Use (TR)',type:'area'},
    {k:'metinTr',tr:'Tam Prompt Metni (TR) — kopyala/yapıştır',en:'Full Prompt Text (TR) — copy/paste',type:'long'},{k:'metinEn',tr:'Full Prompt Text (EN) — original',en:'Full Prompt Text (EN) — original',type:'long'},
    {k:'degiskenler',tr:'Değişkenler [ ]',en:'Variables [ ]'},{k:'ornekTr',tr:'Örnek (TR)',en:'Example (TR)',type:'area'},{k:'varyasyon',tr:'Örnek Varyasyonlar',en:'Example Variations',type:'area'},
    {k:'belge',tr:'Yüklenmesi Gereken Belge / Görsel',en:'Documents / Images to Upload'},{k:'cikti',tr:'Beklenen Çıktı & Fayda',en:'Expected Output & Benefit',type:'area'},
    {k:'dil',tr:'Orijinal Dil',en:'Original Language',type:'list',list:'Orijinal Dil'},{k:'seviye',tr:'Seviye',en:'Level',type:'list',list:'Seviye'},{k:'etiket',tr:'Etiketler',en:'Tags'},
    {k:'kaynak',tr:'Kaynak / Source',en:'Source'},{k:'kaynakDosya',tr:'Kaynak Dosya / Sayfa',en:'Source File / Sheet'},
    {k:'durum',tr:'Durum',en:'Status',type:'list',list:'Durum',tbl:1},{k:'puan',tr:'Puan',en:'Rating',type:'list',list:'Puan',tbl:1},{k:'testEden',tr:'Test Eden',en:'Tested By'},
    {k:'tarih',tr:'Eklenme Tarihi',en:'Date Added'},{k:'not',tr:'Not / Düzeltme',en:'Note / Correction',type:'area'},
    {k:'_kontrol',tr:'Kontrol',en:'Check',calc:true,virt:d=>kodKontrol(d),tbl:1},{k:'anaKatEn',tr:'Kategori Adı (EN)',en:'Category Name (EN)',calc:true},{k:'turEn',tr:'Type (EN)',en:'Type (EN)',calc:true},
    {k:'aciklamaEn',tr:'Description (EN)',en:'Description (EN)',type:'area'},{k:'neZamanEn',tr:'When to Use (EN)',en:'When to Use (EN)',type:'area'},{k:'ornekEn',tr:'Example (EN)',en:'Example (EN)',type:'area'}]},
  kodref:{prefix:'RF-',name:()=>t('Referans Bilgi','Reference Info'),title:d=>pick(d,'kalemTr','kalemEn')||d.id,
    calc:d=>{const a=altInfo(d.altKat);if(a)d.anaKat=a.anaTr},
    fields:[{k:'id',tr:'ID',en:'ID',ro:true,tbl:1},{k:'refTur',tr:'Referans Türü',en:'Reference Type',type:'list',list:'Referans Türü',req:true,tbl:1},{k:'altKat',tr:'Alt Kategori (seç)',en:'Sub-category (select)',type:'alt',req:true},
    {k:'anaKat',tr:'Ana Kategori (TR)',en:'Main Category (TR)',calc:true,tbl:1},{k:'konu',tr:'Konu / Tablo Başlığı',en:'Topic / Table Title',tbl:1},{k:'grup',tr:'Grup / Katman / Aşama',en:'Group / Layer / Stage',tbl:1},
    {k:'kalemTr',tr:'Kalem (TR)',en:'Item (TR)',req:true,tbl:1},{k:'kalemEn',tr:'Item (EN)',en:'Item (EN)'},{k:'aciklamaTr',tr:'Açıklama (TR)',en:'Description (TR)',type:'area',tbl:1},{k:'aciklamaEn',tr:'Description (EN)',en:'Description (EN)',type:'area'},
    {k:'neZaman',tr:'Ne Zaman / Kullanım Alanları',en:'When / Use Cases',type:'area'},{k:'guclu',tr:'Güçlü Yönler / Artılar',en:'Strengths / Pros',type:'area'},{k:'zayif',tr:'Zayıf Yönler / Eksiler',en:'Weaknesses / Cons',type:'area'},
    {k:'ipucu',tr:'Uzman İpucu / Not',en:'Expert Tip / Note',type:'area'},{k:'arac',tr:'Önerilen Araç / Platform',en:'Suggested Tool / Platform',tbl:1},{k:'link',tr:'Link',en:'Link'},
    {k:'kaynak',tr:'Kaynak / Source',en:'Source'},{k:'kaynakDosya',tr:'Kaynak Dosya / Sayfa',en:'Source File / Sheet'},{k:'durum',tr:'Durum',en:'Status',type:'list',list:'Durum'},
    {k:'_kontrol',tr:'Kontrol',en:'Check',calc:true,virt:d=>refKontrol(d),tbl:1}]},
  uzun:{prefix:'u',name:()=>t('Uzun Prompt','Long Prompt'),title:d=>pick(d,'baslikTr','baslikEn')||d.id,
    fields:[{k:'no',tr:'No',en:'No',type:'num',tbl:1},{k:'platform',tr:'AI Platform',en:'AI Platform',tbl:1},{k:'sektor',tr:'Sektör',en:'Sector',type:'cat',tbl:1},{k:'katEn',tr:'Kategori (ENG)',en:'Category (ENG)',type:'cat'},{k:'katTr',tr:'Kategori (TR)',en:'Category (TR)',type:'cat',tbl:1},
    {k:'baslikEn',tr:'Prompt Başlığı (ENG)',en:'Prompt Title (ENG)',tbl:1},{k:'baslikTr',tr:'Prompt Başlığı (TR)',en:'Prompt Title (TR)',req:true,tbl:1},
    {k:'metinEn',tr:'Prompt Açıklaması / Formula (ENG)',en:'Prompt Description / Formula (ENG)',type:'long',tbl:1},{k:'metinTr',tr:'Prompt Açıklaması / Formula (TR)',en:'Prompt Description / Formula (TR)',type:'long',tbl:1},
    {k:'not',tr:'Not / Düzeltme',en:'Note / Correction',type:'area',tbl:1}]},
  rehber:{prefix:'r',name:()=>t('Uygulama Rehberi','Application Guide'),title:d=>d.bolum,fields:[{k:'bolum',tr:'BÖLÜM',en:'SECTION',req:true},{k:'icerik',tr:'İÇERİK',en:'CONTENT',type:'area'},{k:'sira',tr:'Sıra',en:'Order',type:'num'}]},
  gecmis:{prefix:'g',name:()=>t('Kayıtlı Promptlar','Saved Prompts'),title:d=>d.baslik||d.id,
    fields:[{k:'baslik',tr:'Başlık',en:'Title',req:true},{k:'tur',tr:'Tür',en:'Type',type:'select',opts:()=>TUR_G,lab:v=>isEN()?TUR_G_EN[v]||v:v},{k:'durum',tr:'Durum',en:'Status',type:'select',opts:()=>['Tamam','Taslak'],lab:v=>isEN()?({Tamam:'Done',Taslak:'Draft'})[v]||v:v},
    {k:'metin',tr:'Prompt metni',en:'Prompt text',type:'long',req:true},{k:'konu',tr:'Konu / proje',en:'Topic / project'},{k:'kategori',tr:'Kategori / amaç',en:'Category / purpose',type:'select',opts:()=>['',...PURPOSES.map(p=>p.id)],lab:v=>PURPOSE_LABEL()[v]||'—'},
    {k:'platform',tr:'Kullanıldığı yapay zeka / araç',en:'AI / tool used',type:'plat'},{k:'dil',tr:'Dil',en:'Language',type:'multi',opts:()=>DILLER,lab:v=>isEN()?DIL_EN[v]||v:v},
    {k:'kullanimNotu',tr:'Kullanım notu',en:'Usage note',type:'area'},{k:'revNo',tr:'Revizyon no',en:'Revision no',type:'num'},
    {k:'sonuc',tr:'Sonuç: işe yaradı mı?',en:'Result: did it work?',type:'select',opts:()=>['','İyi','Orta','Kötü'],lab:v=>isEN()?({'İyi':'Good','Orta':'Fair','Kötü':'Poor'})[v]||'—':v||'—'},{k:'sonucNot',tr:'Sonuç açıklaması',en:'Result note',type:'area'},
    {k:'kaynakDosya',tr:'Kaynak dosya',en:'Source file'},{k:'not',tr:'Not',en:'Note',type:'area'}]},
  plat:{prefix:'p',name:()=>t('AI Platform','AI Platform'),title:d=>d.ad,
    fields:[{k:'no',tr:'NO',en:'NO',type:'num',tbl:1},{k:'ad',tr:'AI PLATFORM',en:'AI PLATFORM',req:true,tbl:1},{k:'kat',tr:'ANA KATEGORİ',en:'MAIN CATEGORY',type:'cat',tbl:1},{k:'altKat',tr:'ALT KATEGORİ / KULLANIM ALANI',en:'SUB-CATEGORY / USE',type:'cat',tbl:1},
    {k:'neIse',tr:'NE İŞE YARAR',en:'WHAT IT DOES',type:'area',tbl:1},{k:'durum',tr:'AI DURUMU',en:'AI STATUS',type:'select',opts:()=>['','AI-yerel','AI özellikli','AI altyapısı','Genel araç (AI odaklı değil)','Genel etiket'],tbl:1},{k:'not',tr:'DÜZELTME / NOT',en:'CORRECTION / NOTE',type:'area',tbl:1},
    {k:'web',tr:'Web sitesi',en:'Website',grp:1},{k:'ucret',tr:'Ücret',en:'Pricing',type:'select',opts:()=>['','Ücretsiz','Freemium','Ücretli'],grp:1},{k:'ucretTarih',tr:'Ücret kontrol tarihi',en:'Pricing checked on',type:'date',grp:1},
    {k:'kullanim',tr:'Kullanıyor muyuz?',en:'Do we use it?',type:'select',opts:()=>['','Evet','Denendi','Hayır'],grp:1},{k:'formGrup',tr:'Formda hedef olarak görünsün',en:'Show as target in the form',type:'multi',opts:()=>Object.keys(FG_LABEL()),lab:v=>FG_LABEL()[v],grp:1},
    {k:'ipucuTr',tr:'Form sözdizimi ipucu (TR)',en:'Form syntax tip (TR)',type:'area',grp:1},{k:'ipucuEn',tr:'Form sözdizimi ipucu (EN)',en:'Form syntax tip (EN)',type:'area',grp:1}]},
  model:{prefix:'m',name:()=>t('Modeller Karşılaştırma','Model Comparison'),title:d=>d.model,
    fields:[{k:'model',tr:'Yapay Zeka Modeli',en:'AI Model',req:true},{k:'platform',tr:'Bağlı platform',en:'Linked platform',type:'select',opts:()=>['',...platNames()]},{k:'aciklama',tr:'Açıklama',en:'Description',type:'area'},
    {k:'neZaman',tr:'Ne Zaman Kullanılmalı',en:'When to Use',type:'area'},{k:'alanlar',tr:'Kullanım Alanları',en:'Use Cases',type:'area'},{k:'guclu',tr:'Güçlü Yönleri',en:'Strengths',type:'area'},{k:'zayif',tr:'Zayıf Yönleri',en:'Weaknesses',type:'area'},{k:'ipucu',tr:'Uzman İpucu',en:'Expert Tip',type:'area'}]}
};
const FL=f=>isEN()?f.en:f.tr;
function nextId(col){const def=COLDEF[col];const p=def.prefix;const nums=[...DATA[col].keys()].map(k=>k.startsWith(p)?parseInt(k.slice(p.length).replace(/\D/g,''),10):NaN).filter(n=>!isNaN(n));const n=(nums.length?Math.max(...nums):0)+1;
  if(p==='PR-'||p==='RF-')return p+String(n).padStart(4,'0');if(p==='u')return 'u'+String(n).padStart(4,'0');if(p==='p')return 'p'+String(n).padStart(3,'0');return uid(p)}

/* ---------- Gezinme ---------- */
const VIEWS=[
  {id:'ana',t:()=>t('Ana Panel','Home')},
  {id:'form',t:()=>t('Ön Prompt Hazırlama Formu','Pre-Prompt Form'),n:1},
  {id:'iyilestir',t:()=>t('Prompt İyileştirme','Prompt Improvement'),n:2},
  {id:'gecmis',t:()=>t('Kayıtlı Promptlar','Saved Prompts'),c:'gecmis',n:3},
  {id:'kod',t:()=>t('Kod & Command Prompt','Code & Command Prompt'),c:'kod',n:4},
  {id:'uzun',t:()=>t('Uzun Prompt','Long Prompt'),c:'uzun',n:5},
  {id:'platform',t:()=>t('AI Platform','AI Platform'),c:'plat',n:6},
  {id:'yukle',t:()=>t('Yükle & Aktar','Upload & Import')},
  {id:'gunluk',t:()=>t('Değişiklik Günlüğü','Change Log')}
];
const RENDER={};let CUR='ana';
function renderTabs(){$('#tabs').innerHTML=VIEWS.map(v=>`<button type="button" data-view="${v.id}" ${CUR===v.id?'aria-current="page"':''}>${v.n?`<small>${v.n}</small> `:''}${esc(v.t())}${v.c&&DATA[v.c].size?` <small>${num(DATA[v.c].size)}</small>`:''}</button>`).join('')}
function go(id,opts){if(!VIEWS.find(v=>v.id===id)&&!['ara','ayar'].includes(id))id='ana';if(DRAWER.open)closeDrawer();CUR=id;$$('.view').forEach(v=>v.hidden=v.id!=='v-'+id);renderTabs();try{if(location.hash.slice(1)!==id)history.replaceState(null,'','#'+id)}catch(e){}(RENDER[id]||(()=>{}))(opts||{});const b=$('#tabs [aria-current]');if(b)b.scrollIntoView({block:'nearest',inline:'nearest'});window.scrollTo(0,0)}
document.addEventListener('click',e=>{const b=e.target.closest('[data-view]');if(b){e.preventDefault();go(b.dataset.view)}});
function typingIn(view){const a=document.activeElement;return a&&view&&view.contains(a)&&/INPUT|TEXTAREA|SELECT/.test(a.tagName)&&a.dataset.q===undefined&&a.type!=='checkbox'}
onData(cs=>{renderTabs();if(DRAWER.open&&DRAWER.mode==='view')renderDrawer();if(cs.length===1&&cs[0]==='log'&&!['ana','gunluk'].includes(CUR))return;if(CUR!=='form'&&typingIn($('#v-'+CUR)))return;(RENDER[CUR]||(()=>{}))({fromData:true,cols:cs})});
function banner(m,cls,html){$('#banner').innerHTML=m?`<div class="note ${cls||''}"><span>${html?m:esc(m)}</span><span style="display:flex;gap:6px">${cls==='err'?`<button class="btn sm" type="button" data-view="ayar">${esc(t('Ayarlar','Settings'))}</button>`:''}<button class="btn sm" type="button" onclick="this.closest('.note').remove()">${esc(t('Kapat','Close'))}</button></span></div>`:''}

/* ---------- Modal ---------- */
function modal({title,body,ok,cancel,danger,onOk,wide}){
  ok=ok||t('Tamam','OK');if(cancel===undefined)cancel=t('Vazgeç','Cancel');
  const host=$('#modalHost');
  host.innerHTML=`<div class="modal" role="dialog" aria-modal="true"><div class="box" ${wide?'style="width:min(860px,100%)"':''}><header><h3>${esc(title)}</h3></header><div class="mb">${body}</div><footer>${cancel?`<button class="btn" type="button" data-m="x">${esc(cancel)}</button>`:''}<button class="btn ${danger?'danger':'primary'}" type="button" data-m="ok">${esc(ok)}</button></footer></div></div>`;
  const close=()=>host.innerHTML='';
  host.querySelector('[data-m="ok"]').onclick=async()=>{const b=host.querySelector('[data-m="ok"]');b.disabled=true;let r;try{r=onOk?await onOk(host):true}catch(e){toast(e.message,4500);r=false}b.disabled=false;if(r!==false)close()};
  const x=host.querySelector('[data-m="x"]');if(x)x.onclick=close;
  host.querySelector('.modal').addEventListener('click',e=>{if(e.target.classList.contains('modal'))close()});
  const f=host.querySelector('input,textarea,select');if(f)f.focus();return host;
}
const confirmBox=(title,text,ok,fn)=>modal({title,body:`<p style="margin:0">${esc(text)}</p>`,ok,danger:true,onOk:fn});
document.addEventListener('keydown',e=>{if(e.key!=='Escape')return;if($('#modalHost').innerHTML){$('#modalHost').innerHTML='';return}if(DRAWER.open)closeDrawer()});
function varsOf(s){const v=new Set();(String(s).match(/\[[^\[\]\n]{2,60}\]|\{\{[^{}\n]{1,40}\}\}/g)||[]).forEach(x=>v.add(x));return [...v]}
function copyWithVars(text){const vs=varsOf(text);if(!vs.length){copyText(text);return}
  modal({title:t('Değişkenleri doldur ve kopyala','Fill variables and copy'),ok:t('Doldur ve kopyala','Fill and copy'),body:`<p class="hint">${esc(t('Köşeli parantezli alanları doldurun. Boş bıraktıklarınız olduğu gibi kalır.','Fill in the bracketed fields. Empty ones stay as they are.'))}</p>${vs.map((v,i)=>`<div class="fld"><label for="vv${i}">${esc(v)}</label><input id="vv${i}" data-v="${esc(v)}"></div>`).join('')}`,
    onOk:host=>{let s=text;$$('[data-v]',host).forEach(i=>{if(i.value.trim())s=s.split(i.dataset.v).join(i.value.trim())});copyText(s)}})}
const highlightVars=s=>esc(s).replace(/(\[[^\[\]\n]{2,60}\]|\{\{[^{}\n]{1,40}\}\})/g,'<span class="k">$1</span>');

/* ---------- Kayıt paneli ---------- */
const DRAWER={open:false,col:null,id:null,mode:'view',draft:null,errs:{},isNew:false};
const DETAIL={},DACTS={};
function openRecord(col,id,mode){if(!DATA[col]||!DATA[col].get(id)){toast(t('Kayıt bulunamadı','Record not found'));return}Object.assign(DRAWER,{open:true,col,id,mode:mode||'view',draft:null,errs:{},isNew:false});renderDrawer()}
function newRecord(col,preset){if(!guard())return;const id=nextId(col);Object.assign(DRAWER,{open:true,col,id,mode:'edit',draft:Object.assign({id},preset||{}),errs:{},isNew:true});renderDrawer()}
function closeDrawer(){DRAWER.open=false;DRAWER.isNew=false;$('#drawerHost').innerHTML=''}
function fieldInput(f,v){
  const id='df_'+f.k,req=f.req?' <span class="req">*</span>':'',lab=`<label for="${id}">${esc(FL(f))}${req}</label>`,err=DRAWER.errs[f.k]?`<span class="err">${esc(DRAWER.errs[f.k])}</span>`:'',ty=f.type||'text';
  if(f.calc||f.virt)return `<div class="fld"><label>${esc(FL(f))} <span class="badge okb">${esc(t('otomatik','auto'))}</span></label><input value="${esc(f.virt?f.virt(DRAWER.draft):v||'')}" disabled></div>`;
  if(f.ro&&!DRAWER.isNew)return `<div class="fld"><label>${esc(FL(f))}</label><input value="${esc(v||'')}" disabled class="mono"></div>`;
  if(ty==='area'||ty==='long')return `<div class="fld">${lab}<textarea id="${id}" data-f="${f.k}" class="${ty==='long'?'long':''}">${esc(v||'')}</textarea>${err}</div>`;
  if(ty==='select'){const o=f.opts();return `<div class="fld">${lab}<select id="${id}" data-f="${f.k}">${o.map(x=>`<option value="${esc(x)}" ${x===(v||'')?'selected':''}>${esc(f.lab?f.lab(x):(x||'—'))}</option>`).join('')}${v&&!o.includes(v)?`<option selected value="${esc(v)}">${esc(v)}</option>`:''}</select>${err}</div>`}
  if(ty==='list'){const o=listOf(f.list);return `<div class="fld">${lab}<input id="${id}" data-f="${f.k}" list="dl_${f.k}" value="${esc(v||'')}"><datalist id="dl_${f.k}">${o.map(x=>`<option value="${esc(x)}">`).join('')}</datalist><span class="hint">${esc(t('Listeden seçin; listede yoksa yazabilirsiniz.','Pick from the list or type a new value.'))}</span>${err}</div>`}
  if(ty==='alt'){const ks=KMETA().kategoriler||[];let h=`<option value="">—</option>`,cur='';ks.forEach(k=>{if(k.anaKod!==cur){if(cur)h+='</optgroup>';cur=k.anaKod;h+=`<optgroup label="${esc(k.anaKod+' · '+(isEN()?k.anaEn:k.anaTr))}">`}h+=`<option value="${esc(k.etiket)}" ${k.etiket===v?'selected':''}>${esc(k.altKod+' · '+(isEN()?k.altEn:k.altTr))}</option>`});if(cur)h+='</optgroup>';return `<div class="fld">${lab}<select id="${id}" data-f="${f.k}">${h}${v&&!ks.find(k=>k.etiket===v)?`<option selected value="${esc(v)}">${esc(v)}</option>`:''}</select>${err}</div>`}
  if(ty==='multi'||ty==='plat'){const opts=ty==='plat'?platNames():f.opts(),sel=arr(v);const shown=ty==='plat'?[...new Set([...sel,...opts.filter(o=>{const p=platByName(o);return p&&(p.kullanim==='Evet'||arr(p.formGrup).length||o===ALL)})])]:opts;
    return `<div class="fld"><label>${esc(FL(f))}</label><div class="optchips" data-multi="${f.k}">${shown.map(o=>`<button type="button" data-o="${esc(o)}" aria-pressed="${sel.includes(o)}">${esc(f.lab?f.lab(o):o)}</button>`).join('')}</div>${ty==='plat'?`<input list="dl_plat" placeholder="${esc(t('Başka platform: yazıp Enter’a basın','Another platform: type and press Enter'))}" data-addplat="${f.k}"><datalist id="dl_plat">${opts.map(o=>`<option value="${esc(o)}">`).join('')}</datalist>`:''}${err}</div>`}
  if(ty==='cat'){return `<div class="fld">${lab}<input id="${id}" data-f="${f.k}" list="dl_${f.k}" value="${esc(v||'')}"><datalist id="dl_${f.k}">${distinct(DRAWER.col,f.k).map(o=>`<option value="${esc(o)}">`).join('')}</datalist>${err}</div>`}
  if(ty==='num')return `<div class="fld">${lab}<input id="${id}" data-f="${f.k}" type="number" min="0" value="${esc(v||'')}">${err}</div>`;
  if(ty==='date')return `<div class="fld">${lab}<input id="${id}" data-f="${f.k}" type="date" value="${esc(v||'')}">${err}</div>`;
  return `<div class="fld">${lab}<input id="${id}" data-f="${f.k}" value="${esc(v||'')}" class="${f.mono?'mono':''}">${err}</div>`;
}
const who=u=>u||'—';
function histHtml(col,id){const ls=LOG.filter(l=>l.col===col&&l.docId===id);if(!ls.length)return `<p class="hint">${esc(t('Bu kayıtta panelden yapılmış değişiklik yok.','No changes made to this record from the panel.'))}</p>`;return `<div class="hist">${ls.map(l=>logItem(l,true)).join('')}</div>`}
const ACT_EN={'ekle':'added','düzenle':'edited','sil':'deleted','geri al':'undone','kurulum':'setup'};
const flab=(col,k)=>{const f=(COLDEF[col]?.fields||[]).find(f=>f.k===k);return f?FL(f):k};
const short=v=>{const s=Array.isArray(v)?v.join(', '):typeof v==='object'&&v?JSON.stringify(v):String(v);return s.length>220?s.slice(0,220)+'…':s};
function logItem(l,compact){const cls=l.action==='ekle'?'add':l.action==='sil'?'del':'upd';const ch=Object.entries(l.changes||{}).filter(([k])=>k!=='formState');
  const canUndo=canWrite()&&COLDEF[l.col]&&l.action!=='kurulum';
  return `<div class="h ${cls}"><div><b>${esc(isEN()?ACT_EN[l.action]||l.action:l.action)}</b>${compact?'':` · ${esc(COLDEF[l.col]?COLDEF[l.col].name():l.col)}${COLDEF[l.col]&&DATA[l.col]?` · <a href="#" data-openlog="${esc(l.col)}|${esc(l.docId)}">${esc(l.title||l.docId)}</a>`:` · ${esc(l.title||'')}`}`} <span class="meta">· ${esc(who(l.by))} · ${fmtDate(l.at)}${l.note?' · '+esc(l.note):''}</span> ${canUndo?`<button class="btn sm" type="button" data-undo="${esc(l.id)}">${esc(t('Geri al','Undo'))}</button>`:''}</div>${ch.length?`<div class="chg">${ch.slice(0,8).map(([k,[o,n]])=>`<div><span style="color:var(--muted)">${esc(flab(l.col,k))}:</span> ${o!==''?`<span class="o">${esc(short(o))}</span> → `:''}<span class="n">${esc(short(n)||t('(boş)','(empty)'))}</span></div>`).join('')}${ch.length>8?`<div>+${ch.length-8}</div>`:''}</div>`:''}</div>`}
document.addEventListener('click',async e=>{
  const u=e.target.closest('[data-undo]');if(u){const l=LOG.find(x=>x.id===u.dataset.undo);if(l)confirmBox(t('Değişikliği geri al','Undo change'),t(`"${l.title||l.docId}" kaydındaki bu işlem geri alınsın mı? Geri alma da günlüğe yazılır.`,`Undo this change to "${l.title||l.docId}"? The undo is logged too.`),t('Geri al','Undo'),async()=>{await restoreLog(l)});return}
  const o=e.target.closest('[data-openlog]');if(o){e.preventDefault();const [c,i]=o.dataset.openlog.split('|');openRecord(c,i);return}
  const r=e.target.closest('[data-open]');if(r){const st=e.target.closest('[data-stop]');if(st&&st!==r&&r.contains(st))return;if(r.tagName==='A')e.preventDefault();const [c,i]=r.dataset.open.split('|');openRecord(c,i);return}
});
function renderDrawer(){
  const {col,id,mode}=DRAWER;const def=COLDEF[col];const d=DRAWER.isNew?null:DATA[col].get(id);
  if(!DRAWER.isNew&&!d){closeDrawer();return}
  let body,foot;
  if(mode==='edit'){
    const v=DRAWER.draft||clone(d);DRAWER.draft=v;if(def.calc)def.calc(v);
    const main=def.fields.filter(f=>!f.grp),extra=def.fields.filter(f=>f.grp);
    body=main.map(f=>fieldInput(f,v[f.k])).join('')+(extra.length?`<h4 style="margin:6px 0 0;font-family:var(--f-display)">${esc(t('Panel alanları (dosyada yok)','Panel fields (not in the file)'))}</h4>`+extra.map(f=>fieldInput(f,v[f.k])).join(''):'');
    foot=`<div class="l"></div><div class="r"><button class="btn" type="button" data-d="cancel">${esc(t('Vazgeç','Cancel'))}</button><button class="btn primary" type="button" data-d="save">${esc(t('Kaydet','Save'))}</button></div>`;
  }else{
    body=(DETAIL[col]?DETAIL[col](id,d):genericDetail(col,d))+`<div class="card"><header><h3>${esc(t('Değişiklik geçmişi','Change history'))}</h3><span class="hint">${esc(t('Son güncelleme','Last update'))}: ${esc(who(d.guncelleyen||d.ekleyen))} · ${fmtDate(d.guncelleme||d.eklenme)}</span></header><div class="cbody">${histHtml(col,id)}</div></div>`;
    foot=`<div class="l">${DACTS[col]?DACTS[col](id,d):''}</div><div class="r">${canWrite()?`<button class="btn danger" type="button" data-d="del">${esc(t('Sil','Delete'))}</button><button class="btn primary" type="button" data-d="edit">${esc(t('Düzenle','Edit'))}</button>`:''}</div>`;
  }
  const ttl=DRAWER.isNew?t('Yeni kayıt','New record'):def.title(d);
  const fav=!DRAWER.isNew&&['gecmis','plat','uzun'].includes(col)?`<button class="iconbtn star ${d&&d.favori?'on':''}" type="button" data-fav="${col}|${id}" title="${esc(t('Favori','Favourite'))}">★</button>`:'';
  $('#drawerHost').innerHTML=`<div class="scrim" data-d="close"></div><aside class="drawer" role="dialog" aria-label="${esc(ttl)}"><header><div><h3>${esc(ttl)}</h3><div class="sub">${esc(def.name())} · ${esc(id)}</div></div><div style="display:flex;gap:4px">${fav}<button class="iconbtn" type="button" data-d="close" aria-label="${esc(t('Kapat','Close'))}">✕</button></div></header><div class="dbody">${body}</div><footer>${foot}</footer></aside>`;
}
function genericDetail(col,d){return `<dl class="kv">${COLDEF[col].fields.map(f=>{let v=f.virt?f.virt(d):d[f.k];if(Array.isArray(v))v=v.map(x=>f.lab?f.lab(x):x).join(', ');else if(f.lab)v=f.lab(v);if(v===undefined||v===null||v==='')return '';const s=String(v);return `<dt>${esc(FL(f))}</dt><dd>${/^https?:\/\//.test(s)?`<a href="${esc(s)}" target="_blank" rel="noopener">${esc(s)}</a>`:esc(s)}</dd>`}).join('')}</dl>`}
$('#drawerHost').addEventListener('click',async e=>{
  const mb=e.target.closest('[data-multi] button');
  if(mb){const k=mb.parentElement.dataset.multi;const cur=arr(DRAWER.draft[k]);const o=mb.dataset.o;DRAWER.draft[k]=cur.includes(o)?cur.filter(x=>x!==o):[...cur,o];mb.setAttribute('aria-pressed',DRAWER.draft[k].includes(o));return}
  const a=e.target.closest('[data-d]');if(!a)return;const act=a.dataset.d;
  if(act==='close'){closeDrawer();return}
  if(act==='edit'){if(!guard())return;DRAWER.mode='edit';DRAWER.draft=clone(DATA[DRAWER.col].get(DRAWER.id));renderDrawer();return}
  if(act==='cancel'){if(DRAWER.isNew){closeDrawer();return}DRAWER.mode='view';DRAWER.draft=null;DRAWER.errs={};renderDrawer();return}
  if(act==='del'){const {col,id}=DRAWER;const d=DATA[col].get(id);
    if(col==='plat'){const u=usageOf(d.ad);const n=u.k.length+u.u.length+u.g.length;if(n){toast(t(`Bu platform ${n} kayıtta kullanılıyor; önce o kayıtlardan kaldırın.`,`This platform is used in ${n} records; remove it from them first.`),4500);return}}
    const arch=col==='kod'||col==='kodref';
    confirmBox(t('Kaydı sil','Delete record'),(arch?t('Kılavuz kuralı: kayıtları silmek yerine Durum = Arşiv yapın. Yine de silinsin mi? ','Guide rule: set Status = Archive instead of deleting. Delete anyway? '):'')+t(`"${COLDEF[col].title(d)}" silinsin mi? Silinen kayıt Değişiklik Günlüğü'nden geri getirilebilir.`,`Delete "${COLDEF[col].title(d)}"? It can be restored from the Change Log.`),t('Sil','Delete'),async()=>{await deleteRecord(col,id);closeDrawer();toast(t('Silindi','Deleted'))});return}
  if(act==='save'){await saveDrawer();return}
});
$('#drawerHost').addEventListener('input',e=>{const f=e.target.dataset.f;if(f&&DRAWER.draft){DRAWER.draft[f]=e.target.type==='number'?(e.target.value===''?'':Number(e.target.value)):e.target.value}});
$('#drawerHost').addEventListener('change',e=>{const f=e.target.dataset.f;if(f&&DRAWER.draft){DRAWER.draft[f]=e.target.value;if(f==='altKat'||f==='tur'){const def=COLDEF[DRAWER.col];if(def.calc){def.calc(DRAWER.draft);const sc=$('.drawer .dbody').scrollTop;renderDrawer();$('.drawer .dbody').scrollTop=sc}}}});
$('#drawerHost').addEventListener('keydown',e=>{const ap=e.target.dataset&&e.target.dataset.addplat;if(ap&&e.key==='Enter'){e.preventDefault();const v=e.target.value.trim();if(!v)return;const p=platByName(v);if(!p){toast(t('Bu ad AI Platform listesinde yok. Önce AI Platform bölümünden ekleyin.','This name is not in the AI Platform list. Add it there first.'),3500);return}const cur=arr(DRAWER.draft[ap]);if(!cur.includes(p.ad))DRAWER.draft[ap]=[...cur,p.ad];renderDrawer()}});
async function saveDrawer(){
  const {col,id}=DRAWER;const def=COLDEF[col];const v=Object.assign({},DRAWER.draft);const errs={};
  def.fields.forEach(f=>{if(f.req&&!f.calc&&!f.virt&&!String(v[f.k]??'').trim())errs[f.k]=t('Bu alan zorunlu.','This field is required.')});
  if(col==='kod'&&v.kod){const ex=findCmd(v.kod);if(ex&&ex[0]!==id&&platTokens(ex[1].platform).join()===platTokens(v.platform).join())errs.kod=t('Bu kod bu platformda zaten var: ','This code already exists for this platform: ')+ex[0]}
  if(col==='uzun'&&!String(v.metinTr||'').trim()&&!String(v.metinEn||'').trim())errs.metinTr=t('TR veya EN prompt metninden biri zorunlu.','TR or EN prompt text is required.');
  if(col==='plat'){const ex=platList().find(p=>trLower(p.ad)===trLower(String(v.ad||'').trim()));if(ex&&ex.id!==id)errs.ad=t('Bu ad zaten listede.','This name already exists.');const old=DATA.plat.get(id);if(old&&old.ad!==v.ad){const u=usageOf(old.ad);const n=u.k.length+u.u.length+u.g.length;if(n)errs.ad=t(`Bu ad ${n} kayıtta kullanılıyor; değişirse bağlantılar kopar.`,`This name is used in ${n} records; renaming breaks links.`)}}
  DRAWER.errs=errs;if(Object.keys(errs).length){renderDrawer();toast(t('Eksik veya hatalı alanları düzeltin','Fix the missing or invalid fields'));return}
  if(col==='uzun'&&!v.no)v.no=Math.max(0,...[...DATA.uzun.values()].map(d=>d.no||0))+1;
  if(col==='plat'&&!v.no)v.no=Math.max(0,...[...DATA.plat.values()].map(d=>d.no||0))+1;
  if(col==='kod'&&DRAWER.isNew&&!v.tarih){const d=new Date();v.tarih=String(d.getDate()).padStart(2,'0')+'.'+String(d.getMonth()+1).padStart(2,'0')+'.'+d.getFullYear()}
  if(col==='kod'&&DRAWER.isNew&&!v.durum)v.durum='Yeni / İşlenmedi';
  if(col==='gecmis'&&!v.revNo)v.revNo=1;
  if(def.calc)def.calc(v);
  try{await saveRecord(col,id,v);toast(DRAWER.isNew?t('Eklendi','Added'):t('Kaydedildi','Saved'));DRAWER.isNew=false;DRAWER.mode='view';DRAWER.draft=null;renderDrawer()}catch(err){if(err.message!=='no-write')toast(t('Kaydedilemedi: ','Could not save: ')+err.message,5000)}
}
document.addEventListener('click',async e=>{const f=e.target.closest('[data-fav]');if(!f)return;e.stopPropagation();e.preventDefault();const [col,id]=f.dataset.fav.split('|');const d=DATA[col].get(id);if(!d)return;try{await saveRecord(col,id,{favori:!d.favori},{note:d.favori?t('Favoriden çıkarıldı','Unfavourited'):t('Favorilere eklendi','Favourited')})}catch(err){}},true);

/* ---------- Liste yardımcıları ---------- */
const VS={};
function vstate(k,def){if(!VS[k])VS[k]=Object.assign({q:'',limit:80,f:{},sort:null},def||{},LS.get('evd-vs-'+k,{}));return VS[k]}
const persistVS=k=>{const s=VS[k];LS.set('evd-vs-'+k,{f:s.f,tab:s.tab,view:s.view,sort:s.sort,cols:s.cols})};
function selectHtml(id,label,opts,val){return `<select data-flt="${id}" aria-label="${esc(label)}"><option value="">${esc(label)}: ${esc(t('tümü','all'))}</option>${opts.map(o=>{const [v,l]=Array.isArray(o)?o:[o,o];return `<option value="${esc(v)}" ${String(v)===String(val??'')?'selected':''}>${esc(l)}</option>`}).join('')}</select>`}
function matches(d,q,keys){if(!q)return true;const n=norm(q);return keys.some(k=>norm(Array.isArray(d[k])?d[k].join(' '):d[k]).includes(n))}
function loadingOr(col,html){if(!LOADED[col])return `<div class="empty"><span class="spin"></span> ${esc(t('Kayıtlar yükleniyor…','Loading records…'))}</div>`;return html}
const debMap=new Map();function deb(fn){clearTimeout(debMap.get(fn));debMap.set(fn,setTimeout(fn,170))}
function keepFocus(root,fn){const a=document.activeElement;const sel=a&&a.dataset&&a.dataset.q!==undefined&&root.contains(a);const pos=sel?a.selectionStart:null;fn();if(sel){const i=root.querySelector('[data-q]');if(i){i.focus();try{i.setSelectionRange(pos,pos)}catch(e){}}}}
function bindList(root,key,rerender){
  root.oninput=e=>{const x=e.target;if(x.dataset.q!==undefined){vstate(key).q=x.value;vstate(key).limit=80;deb(rerender)}};
  root.onchange=e=>{const x=e.target;const s=vstate(key);if(x.dataset.flt){s.f[x.dataset.flt]=x.value;s.limit=80;persistVS(key);rerender()}if(x.dataset.tgl){s.f[x.dataset.tgl]=x.checked;persistVS(key);rerender()}};
}
document.addEventListener('click',e=>{const m=e.target.closest('[data-more]');if(m){vstate(m.dataset.more).limit+=120;(RENDER[CUR]||(()=>{}))({})}});
/* Veri tablosu: Excel görünümü (bilgisayar) */
function dataTable(key,col,rows,cols,opts={}){
  const s=vstate(key);const sorted=rows.slice();
  if(s.sort){const f=cols.find(c=>c.k===s.sort.k);if(f){const val=d=>f.virt?f.virt(d):d[f.k];sorted.sort((a,b)=>{const x=val(a[1]),y=val(b[1]);const r=(typeof x==='number'&&typeof y==='number')?x-y:String(x??'').localeCompare(String(y??''),'tr',{numeric:true});return s.sort.d==='desc'?-r:r})}}
  const shown=sorted.slice(0,s.limit);
  const cell=(f,d)=>{let v=f.virt?f.virt(d):d[f.k];if(Array.isArray(v))v=v.join(', ');if(v===undefined||v===null)v='';const sv=String(v);
    if(f.k==='id')return `<td class="id">${esc(sv)}</td>`;if(f.k==='anaKat'&&isEN()&&d.anaKatEn)return `<td><div class="cl">${esc(d.anaKatEn)}</div></td>`;if(f.k==='kod')return `<td>${sv?`<code>${esc(sv)}</code>`:''}</td>`;
    if(f.k==='tur')return `<td>${turBadge(sv)}</td>`;if(f.k==='durum'&&col!=='plat')return `<td>${durumBadge(sv)}</td>`;if(f.k==='_kontrol')return `<td class="${/⚠/.test(sv)?'tagwarn':''}">${esc(sv)}</td>`;
    if(f.k==='puan')return `<td class="num">${sv?'★'.repeat(Number(sv)||0):''}</td>`;
    return `<td><div class="cl">${esc(sv)}</div></td>`};
  return `<div class="dtw"><table class="dt"><thead><tr>${cols.map(f=>`<th class="${f.k==='id'?'id':''} ${f.req?'req':''} ${f.calc?'calc':''}" data-sort="${key}|${f.k}" title="${esc(FL(f))}">${esc(FL(f))}${s.sort&&s.sort.k===f.k?`<span class="ar">${s.sort.d==='desc'?'▼':'▲'}</span>`:''}</th>`).join('')}</tr></thead><tbody>${shown.map(([id,d])=>`<tr data-open="${col}|${esc(id)}">${cols.map(f=>cell(f,d)).join('')}</tr>`).join('')}</tbody></table></div>${sorted.length>shown.length?`<div class="more"><button class="btn" type="button" data-more="${key}">${esc(t('Daha fazla göster','Show more'))} (${num(sorted.length-shown.length)})</button></div>`:''}`;
}
document.addEventListener('click',e=>{const h=e.target.closest('[data-sort]');if(!h)return;const [key,k]=h.dataset.sort.split('|');const s=vstate(key);s.sort=s.sort&&s.sort.k===k?(s.sort.d==='asc'?{k,d:'desc'}:null):{k,d:'asc'};persistVS(key);(RENDER[CUR]||(()=>{}))({})});
function viewToggle(key){const s=vstate(key);if(!s.view)s.view=window.innerWidth<760?'card':'table';return `<div class="seg" role="group"><button type="button" data-vt="${key}|table" aria-pressed="${s.view==='table'}">${esc(t('Tablo','Table'))}</button><button type="button" data-vt="${key}|card" aria-pressed="${s.view!=='table'}">${esc(t('Kart','Cards'))}</button></div>`}
document.addEventListener('click',e=>{const b=e.target.closest('[data-vt]');if(!b)return;const [key,v]=b.dataset.vt.split('|');vstate(key).view=v;persistVS(key);(RENDER[CUR]||(()=>{}))({})});

/* ---------- Excel dışa aktarma ---------- */
const stamp=()=>{const d=new Date();return d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0')+'-'+String(d.getDate()).padStart(2,'0')};
async function exportSheets(fileName,sheets){
  try{await loadScript(LIB_XLSX)}catch(e){toast(e.message);return}
  const wb=window.XLSX.utils.book_new();
  sheets.forEach(({name,rows})=>{const ws=window.XLSX.utils.json_to_sheet(rows);window.XLSX.utils.book_append_sheet(wb,ws,name.slice(0,31).replace(/[\\/?*\[\]:]/g,'-'))});
  const buf=window.XLSX.write(wb,{type:'array',bookType:'xlsx'});saveBlob(`${fileName} - ${stamp()}.xlsx`,new Blob([buf],{type:'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'}));
}
const toRows=(col,list)=>list.map(d=>{const o={};COLDEF[col].fields.forEach(f=>{let v=f.virt?f.virt(d):d[f.k];if(Array.isArray(v))v=v.join(', ');o[f.tr]=v??''});return o});
