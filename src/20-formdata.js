/* ---- Rev.04 form verisi (korunarak taşındı, Rev.10 ekleriyle) ---- */
const AIFILL='Boş bırakılan alanları AI en uygun şekilde doldursun ve yaptığı varsayımları sonda listelesin.|Fill every field left empty with the best choice and list your assumptions at the end.';
const ASKFIRST='Eksikleri tamamlamak için önce bana soru sorsun.';
const AI='__AI';
const sp=s=>{const i=s.indexOf('|');return i<0?{tr:s,en:s}:{tr:s.slice(0,i),en:s.slice(i+1)}};

/* ---------- AMAÇLAR ---------- */
const PURPOSES=[
 {id:'gorsel',tr:'Görsel / Fotoğraf',en:'Image / Photo',d:'Görsel, fotoğraf, logo, infografik üretmek veya düzenlemek',pf:'image',
  subs:['Yeni görsel oluşturmak|Create a new image','Fotoğraf gerçekliğinde görsel|Photorealistic image','Ürün fotoğrafı|Product photo','Mevcut görseli geliştirmek|Enhance an existing image','Mevcut görseli değiştirmek|Edit an existing image','Logo / ikon / illüstrasyon|Logo / icon / illustration','İnfografik|Infographic'],
  role:['kıdemli bir sanat yönetmeni, fotoğrafçı ve görsel üretim prompt mühendisi','a senior art director, photographer and image-generation prompt engineer'],
  mods:['gerceklik','gorselTarz','kamera','isik','duzenleme','marka']},
 {id:'video',tr:'Video',en:'Video',d:'Video üretmek, düzenlemek, senaryo ve storyboard hazırlamak',pf:'video',
  subs:['Yeni video oluşturmak|Create a new video','Mevcut videoyu geliştirmek / değiştirmek|Improve / edit an existing video','Video senaryosu / storyboard|Video script / storyboard','Reklam filmi|Commercial','Kısa video (Reels / Shorts / TikTok)|Short-form video (Reels / Shorts / TikTok)','Drone / tanıtım videosu|Drone / promo video'],
  role:['film yönetmeni, görüntü yönetmeni ve video üretim prompt mühendisi','a film director, cinematographer and video-generation prompt engineer'],
  mods:['gerceklik','gorselTarz','kamera','isik','hareket','anlatim','marka']},
 {id:'metin',tr:'Metin / Yazı / Hikâye',en:'Writing / Story',d:'Makale, hikâye, senaryo, seslendirme metni, e-posta',pf:'llm',
  subs:['Makale / blog|Article / blog post','Hikâye|Story','Senaryo|Screenplay / script','Seslendirme metni|Voice-over script','E-posta / mektup|Email / letter','Kitap / bölüm|Book / chapter','Özet / yeniden yazım|Summary / rewrite'],
  role:['kıdemli bir editör, içerik stratejisti ve yazar','a senior editor, content strategist and writer'],
  mods:['anlatim','marka']},
 {id:'pazarlama',tr:'Reklam / Pazarlama / Sosyal Medya',en:'Ads / Marketing / Social',d:'Reklam, ürün-marka tanıtımı, sosyal medya, SEO/GEO, satış',pf:'llm',
  subs:['Reklam metni|Ad copy','Ürün tanıtımı|Product promotion','Marka tanıtımı|Brand promotion','Sosyal medya içeriği|Social media content','SEO / GEO içeriği|SEO / GEO content','Landing page metni|Landing page copy','Satış e-postası / dizisi|Sales email / sequence','Kampanya planı|Campaign plan'],
  role:['pazarlama stratejisti, metin yazarı (copywriter) ve sosyal medya uzmanı','a marketing strategist, copywriter and social media specialist'],
  mods:['pazar','anlatim','gorselTarz','marka']},
 {id:'arastirma',tr:'Araştırma / Analiz',en:'Research / Analysis',d:'Pazar, rakip, literatür, veri, karar ve trend analizi',pf:'llm',
  subs:['Pazar araştırması|Market research','Rakip analizi|Competitor analysis','Literatür / kaynak taraması|Literature / source review','Veri analizi|Data analysis','Karar analizi / karşılaştırma|Decision analysis / comparison','Trend analizi|Trend analysis','Kök neden / problem çözme|Root cause / problem solving'],
  role:['kıdemli bir araştırma analisti ve veri odaklı karar danışmanı','a senior research analyst and data-driven decision advisor'],
  mods:['arastirma']},
 {id:'finans',tr:'Fizibilite / Finans',en:'Feasibility / Finance',d:'Fizibilite, yatırım, bütçe, nakit akışı, değerleme',pf:'llm',
  subs:['Fizibilite raporu|Feasibility report','Yatırım değerlendirmesi|Investment appraisal','Bütçe / maliyet planı|Budget / cost plan','Nakit akışı projeksiyonu|Cash-flow projection','Değerleme (şerefiye vb.)|Valuation (e.g. land betterment)','İş planı|Business plan'],
  role:['finansal analist, yatırım danışmanı ve fizibilite uzmanı','a financial analyst, investment advisor and feasibility specialist'],
  mods:['finans','arastirma']},
 {id:'kod',tr:'Kod / Yazılım',en:'Code / Software',d:'Uygulama, script, otomasyon, web, SQL, agent',pf:'code',
  subs:['Yeni kod / uygulama|New code / app','Hata ayıklama (debug)|Debugging','Refactor / optimizasyon|Refactor / optimisation','Otomasyon / script|Automation / script','Web sitesi / landing page|Website / landing page','Veri / SQL / Excel formülü|Data / SQL / Excel formula','AI agent / iş akışı|AI agent / workflow'],
  role:['kıdemli bir yazılım mühendisi ve çözüm mimarı','a senior software engineer and solutions architect'],
  mods:['kod']},
 {id:'teknik',tr:'Mimari / Mühendislik / Tarım',en:'Architecture / Engineering / Agri',d:'Mimari, mühendislik, tarım, hayvancılık, enerji projeleri',pf:'llm',
  subs:['Mimari proje|Architectural project','Mühendislik hesabı / çözüm|Engineering calculation / solution','Tarımsal proje|Agricultural project','Hayvancılık projesi|Livestock project','Teknik şartname|Technical specification','Enerji / GES projesi|Energy / solar project'],
  role:['multidisipliner bir mühendis, mimar ve teknik proje danışmanı','a multidisciplinary engineer, architect and technical project consultant'],
  mods:['teknik','gerceklik','arastirma']},
 {id:'egitim',tr:'Eğitim / Sunum / Rapor',en:'Training / Deck / Report',d:'Eğitim içeriği, sunum, rapor, yol haritası, quiz, SOP',pf:'llm',
  subs:['Eğitim içeriği|Training content','Sunum|Presentation','Profesyonel rapor|Professional report','Öğrenme yol haritası|Learning roadmap','Quiz / sınav|Quiz / exam','Kılavuz / SOP|Guide / SOP'],
  role:['öğretim tasarımcısı, eğitmen ve kurumsal rapor uzmanı','an instructional designer, trainer and corporate report specialist'],
  mods:['egitim','anlatim','marka']},
 {id:'ses',tr:'Müzik / Seslendirme',en:'Music / Voice',d:'Şarkı, jingle, seslendirme, podcast',pf:'audio',
  subs:['Şarkı / müzik|Song / music','Jingle|Jingle','Seslendirme (voice-over)|Voice-over','Podcast|Podcast'],
  role:['müzik prodüktörü, söz yazarı ve seslendirme yönetmeni','a music producer, lyricist and voice director'],
  mods:['ses','anlatim','marka']},
 {id:'prompt',tr:'Prompt / Agent Tasarımı',en:'Prompt / Agent Design',d:'Sistem promptu, skill, agent iş akışı, prompt iyileştirme',pf:'llm',
  subs:['Sistem promptu|System prompt','Prompt iyileştirme|Prompt improvement','Skill / SKILL.md|Skill / SKILL.md','Agent iş akışı|Agent workflow','Proje talimatı (custom instructions)|Project custom instructions','Prompt kütüphanesi kaydı|Prompt library entry'],
  role:['kıdemli bir prompt mühendisi ve AI iş akışı mimarı','a senior prompt engineer and AI workflow architect'],
  mods:['promptMod']}
];
const P=id=>PURPOSES.find(p=>p.id===id);

/* ---------- AMACA GÖRE DEĞİŞEN SEÇENEKLER ---------- */
const PLATFORMS={
 llm:['ChatGPT','Claude','Gemini','Grok','Perplexity','NotebookLM','Copilot','DeepSeek'],
 image:['Midjourney','Leonardo AI','Ideogram','Flux','Adobe Firefly','ChatGPT (görsel)|ChatGPT (image)','Gemini (görsel)|Gemini (image)','Stable Diffusion','Canva AI'],
 video:['Sora','Veo','Kling','Runway','Pika','Hailuo','Luma'],
 audio:['Suno','Udio','ElevenLabs'],
 code:['Claude Code','Cursor','Codex','GitHub Copilot','Replit','Lovable','Bolt','ChatGPT','Claude','Gemini']
};
const OUTS={
 gorsel:['Tek görsel|Single image','Birden fazla varyasyon|Multiple variations','Görsel promptu|Image prompt','Görsel promptu + negatif prompt|Image prompt + negative prompt','Tutarlı seri / set|Consistent series / set','Karusel görselleri|Carousel images'],
 video:['Video promptu|Video prompt','Sahne sahne video promptları|Scene-by-scene video prompts','Video senaryosu|Video script','Storyboard','Çekim listesi (shot list)|Shot list','Seslendirme + altyazı metni|Voice-over + subtitle text'],
 metin:['Metin|Text','Makale|Article','Hikâye|Story','Senaryo|Screenplay','Seslendirme metni|Voice-over script','E-posta|Email','Başlık seçenekleri|Headline options','Özet|Summary'],
 pazarlama:['Reklam metni|Ad copy','Sosyal medya gönderisi|Social media post','Karusel metni|Carousel copy','Hook / başlık seçenekleri|Hook / headline options','CTA seçenekleri|CTA options','Landing page metni|Landing page copy','İçerik takvimi|Content calendar','Hashtag seti|Hashtag set','A/B test varyasyonları|A/B test variants'],
 arastirma:['Rapor|Report','Karşılaştırma tablosu|Comparison table','Özet + bulgular|Summary + findings','SWOT tablosu|SWOT table','Karar matrisi|Decision matrix','Kaynakça|Bibliography','Grafik önerisi|Chart suggestions'],
 finans:['Fizibilite raporu|Feasibility report','Excel uyumlu tablo|Excel-ready table','Nakit akışı tablosu|Cash-flow table','Senaryo karşılaştırması|Scenario comparison','Yönetici özeti|Executive summary','Grafik önerisi|Chart suggestions'],
 kod:['Çalışır kod|Working code','Kod + açıklama|Code + explanation','Adım adım plan|Step-by-step plan','Diff / değişiklik listesi|Diff / change list','Test dosyası|Test file','README / dokümantasyon|README / documentation','JSON'],
 teknik:['Teknik rapor|Technical report','Şartname|Specification','Metraj / keşif tablosu|Bill of quantities','Yerleşim planı tarifi|Layout plan description','İş programı|Work schedule','Risk analizi|Risk analysis','Hesap tablosu|Calculation sheet'],
 egitim:['Ders planı|Lesson plan','Sunum (slayt slayt)|Presentation (slide by slide)','Rapor|Report','Quiz','Kontrol listesi|Checklist','Yol haritası|Roadmap','Özet / cheatsheet|Summary / cheatsheet'],
 ses:['Şarkı sözü|Lyrics','Müzik stil promptu|Music style prompt','Seslendirme metni|Voice-over script','Podcast akışı|Podcast rundown','Jingle metni|Jingle copy'],
 prompt:['Nihai prompt|Final prompt','Sistem promptu|System prompt','SKILL.md','Prompt + değişkenler|Prompt + variables','Prompt + kullanım talimatı|Prompt + usage notes','Kütüphane kaydı (tablo satırı)|Library entry (table row)']
};
const OUT_DEFAULT=['Metin|Text','Rapor|Report','Tablo|Table','Liste|List','Adım adım plan|Step-by-step plan','Görsel promptu|Image prompt','Video promptu|Video prompt','Kod|Code','JSON'];

const NEG={
 visual:['Bulanıklık|blur','Bozuk anatomi / ekstra parmak|bad anatomy, extra fingers','Anlamsız yazı / harf hatası|garbled text','Filigran / imza|watermark, signature','Aşırı doygun renk|oversaturated colours','Perspektif hatası|distorted perspective','Plastik CGI görünümü|plastic CGI look','Logo bozulması|distorted logo'],
 video:['Titreme (flicker)|flicker','Karakter / yüz tutarsızlığı|identity drift','Fizik dışı hareket|unnatural physics','Ani kesmeler|abrupt cuts','Şekil bozulması (morphing)|morphing','Yazı bozulması|garbled text'],
 text:['Klişe ifadeler|clichés','Yapay zekâ dili|AI-sounding phrasing','Gereksiz tekrar|repetition','Uydurma bilgi / istatistik|fabricated facts or statistics','Aşırı süslü anlatım|purple prose','Abartılı vaat|exaggerated claims','Emoji|emojis'],
 data:['Kaynaksız iddia|unsourced claims','Uydurma veri|fabricated data','Güncel olmayan bilgi|outdated information','Varsayımı gerçek gibi sunma|presenting assumptions as facts','Belirsiz sonuç|vague conclusions'],
 code:['Kodda gömülü şifre / anahtar|hard-coded secrets','Eskimiş API|deprecated APIs','Gereksiz bağımlılık|unnecessary dependencies','Placeholder / yarım kod|placeholder or partial code','Açıklamasız sihirli sayılar|unexplained magic numbers','Test edilmemiş varsayım|untested assumptions'],
 prompt:['Belirsiz talimat|vague instructions','Çelişkili kurallar|conflicting rules','Gereksiz uzunluk|unnecessary length','Şişirilmiş rol tanımı|inflated role description']
};
const NEGMAP={gorsel:['visual'],video:['video','visual'],metin:['text'],pazarlama:['text'],arastirma:['data'],finans:['data'],kod:['code'],teknik:['data'],egitim:['text','data'],ses:['text'],prompt:['prompt']};


/* ---------- BÖLÜMLER ---------- */
const AMAC=['Bilgi vermek|Inform','Tanıtmak|Introduce / promote','Satış yapmak|Drive sales','İkna etmek|Persuade','Güven oluşturmak|Build trust','Dikkat çekmek|Grab attention','Eğitim vermek|Educate','Eğlendirmek|Entertain','Duygusal etki oluşturmak|Create emotional impact','Profesyonel görünmek|Look professional','Gerçekçi bir sonuç oluşturmak|Produce a realistic result','Yatırım kararını desteklemek|Support an investment decision','Teknik bir çözüm üretmek|Deliver a technical solution','Sorunu çözmek|Solve the problem','Bir fikri görselleştirmek|Visualise an idea','Marka değerini yükseltmek|Raise brand value','Müşteri kazanmak|Win customers','Bilinirlik oluşturmak|Build awareness','Karşılaştırma yapmak|Compare','Karar vermeye yardımcı olmak|Support decision-making'];
const M={
 konu:{t:['Ana konu','Main topic'],tag:'all',core:true,dp:'task',hint:'Mümkün olduğunca açık yazın: ne, kim için, nerede.',groups:[
  {id:'konu',type:'area',l:['Konu','Topic'],ph:'Örn. Ege kıyısında butik otelin gün batımı terası için Instagram tanıtım görseli'},
  {id:'kat',type:'multi',l:['Kategori','Category'],opts:['İnsan|People','Ürün|Product','Hizmet|Service','Marka / şirket|Brand / company','Mekân / bina|Venue / building','Arazi / tarım|Land / agriculture','Mimari|Architecture','Doğa|Nature','Teknoloji|Technology','Sağlık|Health','Eğitim|Education','Finans|Finance','Turizm / konaklama|Tourism / hospitality','Gıda|Food','Hayvancılık|Livestock','Sanayi|Industry','Reklam / pazarlama|Advertising / marketing','Sosyal medya|Social media','Sanat / yaratıcılık|Art / creativity','Bilim / araştırma|Science / research','Hikâye / kurgu|Story / fiction']}]},
 amac:{t:['Asıl amaç','Primary goal'],tag:'all',core:true,dp:'task',hint:'Bu çalışmayla öncelikle ne elde edilmek isteniyor?',groups:[
  {id:'g',type:'multi',opts:AMAC},
  {id:'ozel',type:'text',l:['Özel amaç / ölçülebilir hedef','Specific / measurable goal'],ph:'Örn. Rezervasyon sayfasına tıklamayı artırmak'}]},
 platform:{t:['Hedef AI / platform','Target AI / platform'],tag:'all',core:true,dp:'ctx',hint:'Liste Evodak AI Platform bölümünden gelir ve seçtiğiniz amaca göre değişir. Platform seçerseniz o platformun sözdizimi ipucu prompta eklenir.',groups:[
  {id:'g',type:'multi',opts:p=>[...platformsFor((P(p)||{}).pf||'llm'),'Birden fazla platform|Multiple platforms','Platform bağımsız|Platform-agnostic']},
  {id:'model',type:'text',l:['Model / sürüm (biliniyorsa)','Model / version (if known)'],ph:'Örn. Midjourney v7, Claude Opus'},
  {id:'diger',type:'text',l:['Başka platform','Other platform'],ph:''}]},
 kitle:{t:['Hedef kitle','Target audience'],tag:'all',core:true,dp:'ctx',hint:'İçeriği kim görecek / kullanacak?',groups:[
  {id:'g',type:'multi',l:['Kitle','Audience'],opts:['Genel halk|General public','Tüketiciler|Consumers','Potansiyel müşteriler|Prospective customers','Mevcut müşteriler|Existing customers','Yatırımcılar|Investors','İş insanları|Business people','Profesyoneller|Professionals','Mühendisler|Engineers','Mimarlar|Architects','Doktorlar / sağlık çalışanları|Doctors / healthcare staff','Çiftçiler / üreticiler|Farmers / producers','Turistler|Tourists','Öğrenciler|Students','Çocuklar|Children','Gençler|Young people','Üst gelir grubu|High-income group','Yerel halk|Local community','Uluslararası kitle|International audience']},
  {id:'yas',type:'multi',l:['Yaş grubu','Age group'],opts:['Çocuk|Children','13–17','18–25','26–40','41–60','60+','Tüm yaşlar|All ages']},
  {id:'ulke',type:'text',l:['Hedef ülke / bölge','Target country / region'],ph:'Örn. Türkiye, Körfez ülkeleri, Almanya'}]},
 dil:{t:['Dil','Language'],tag:'all',core:true,dp:'ctx',groups:[
  {id:'g',type:'multi',l:['Nihai çıktının dili','Output language'],opts:['Türkçe|Turkish','İngilizce|English','Çift dilli (TR + EN)|Bilingual (TR + EN)','Arapça|Arabic','Rusça|Russian','Almanca|German','Fransızca|French','İspanyolca|Spanish']},
  {id:'sev',type:'multi',l:['Dil seviyesi','Register'],opts:['Günlük / sade|Everyday / plain','Samimi|Friendly','Profesyonel|Professional','Kurumsal|Corporate','Teknik|Technical','Akademik|Academic','Pazarlama odaklı|Marketing-oriented','Uzman düzeyi|Expert level','Herkesin anlayacağı kadar basit|Very simple, for anyone']}]},
 cikti:{t:['Çıktı türü','Output type'],tag:'all',core:true,dp:'fmt',hint:'Seçenekler amaca göre değişir.',groups:[
  {id:'g',type:'multi',opts:p=>OUTS[p]||OUT_DEFAULT},
  {id:'diger',type:'text',l:['Başka çıktı','Other output'],ph:''}]},
 detay:{t:['İçerik detayı','Content details'],tag:'all',core:true,dp:'ctx',hint:'AI\'ın mutlaka bilmesi gereken gerçek bilgiler: isim, marka, adres, ölçü, fiyat, tarih, kişi sayısı, teknik özellik, mevcut durum.',groups:[
  {id:'det',type:'area',l:['Detaylar','Details'],ph:''},
  {id:'sabit',type:'area',l:['Kesinlikle değiştirilmemesi gereken bilgiler','Facts that must not change'],ph:''}]},

 /* --- amaca özel --- */
 dosya:{t:['Örnek dosya yükleme','Example files'],tag:'opt',isNew:true,dp:'ctx',hint:'Tüm dosya türleri, görsel ve video yükleyebilirsiniz. Her dosya için ne amaçla kullanılacağını seçin. Görsel ve video analiz edilip form alanları önerilir; belgelerin özeti forma aktarılır.',groups:[
  {id:'f',type:'files'}]},
 gerceklik:{t:['Gerçeklik seviyesi','Realism level'],tag:'spec',dp:'req',kw:true,groups:[
  {id:'lvl',type:'multi',l:['Çıktı ne kadar gerçekçi?','How realistic?'],opts:['Tamamen gerçekçi|fully realistic','Fotoğraf gerçekliğinde|photorealistic','Profesyonel fotoğraf kalitesinde|professional photography quality','Sinematik gerçekçilik|cinematic realism','Gerçekçi + hafif sanatsal|realistic with a subtle artistic touch','Konsept tasarım|concept design','İllüstratif|illustrative','Stilize|stylised','Fantastik|fantasy']},
  {id:'uyum',type:'single',l:['Gerçek dünyaya uygunluk','Real-world accuracy'],opts:['Çok önemli|critical','Önemli|important','Orta|moderate','Önemsiz|not important']}]},
 gorselTarz:{t:['Görsel tarz','Visual style'],tag:'spec',dp:'req',kw:true,groups:[
  {id:'g',type:'multi',opts:['Fotogerçekçi|photorealistic','Sinematik|cinematic','Belgesel|documentary','Ticari reklam|commercial advertising','Kurumsal|corporate','Lüks|luxury','Premium','Modern','Minimalist','Doğal|natural','Rustik|rustic','Teknolojik|tech','Fütüristik|futuristic','Dramatik|dramatic','Sıcak / samimi|warm and inviting','Mimari görselleştirme|architectural visualisation','Ürün fotoğrafçılığı|product photography','Moda / lifestyle|fashion / lifestyle','Drone / havadan|drone / aerial']},
  {id:'renk',type:'text',l:['Renk paleti','Colour palette'],ph:'Örn. toprak tonları, lacivert + altın'}]},
 kamera:{t:['Kamera ve kompozisyon','Camera and composition'],tag:'spec',dp:'req',kw:true,groups:[
  {id:'aci',type:'multi',l:['Kamera açısı','Camera angle'],opts:['Göz hizası|eye level','Alçak açı|low angle','Yüksek açı|high angle','Kuş bakışı|bird\'s-eye view','Drone|drone shot','Yakın plan|close-up','Orta plan|medium shot','Geniş açı|wide angle','Çok geniş açı|ultra-wide','Detay çekimi|macro detail']},
  {id:'lens',type:'multi',l:['Lens / derinlik','Lens / depth'],opts:['24 mm geniş|24mm wide','35 mm|35mm','50 mm doğal|50mm natural','85 mm portre|85mm portrait','Makro|macro lens','Sığ alan derinliği|shallow depth of field','Her yer net|deep focus']},
  {id:'oran',type:'single',l:['Görüntü oranı','Aspect ratio'],opts:['1:1','4:5','3:4','9:16','16:9','21:9','Platforma göre otomatik|auto by platform']}]},
 isik:{t:['Işık ve atmosfer','Lighting and mood'],tag:'spec',dp:'req',kw:true,groups:[
  {id:'isik',type:'multi',l:['Işık','Lighting'],opts:['Sabah|morning light','Öğle|midday','Altın saat|golden hour','Gün batımı|sunset','Gün doğumu|sunrise','Mavi saat|blue hour','Gece|night','Bulutlu|overcast','Yumuşak doğal ışık|soft natural light','Parlak güneş|bright sunlight','Stüdyo ışığı|studio lighting','Sinematik ışık|cinematic lighting','Dramatik ışık|dramatic lighting']},
  {id:'atm',type:'multi',l:['Atmosfer','Mood'],opts:['Sakin|calm','Huzurlu|serene','Enerjik|energetic','Lüks|luxurious','Güven veren|trustworthy','Profesyonel|professional','Doğal|natural','Dramatik|dramatic','Gizemli|mysterious','Neşeli|joyful','Duygusal|emotional','Ferah|airy','Güçlü|powerful']}]},
 hareket:{t:['Video: süre ve hareket','Video: duration and motion'],tag:'spec',dp:'req',kw:true,groups:[
  {id:'sure',type:'single',l:['Süre','Duration'],opts:['5 sn|5 s','8 sn|8 s','10 sn|10 s','15 sn|15 s','30 sn|30 s','60 sn|60 s','90 sn|90 s','2 dk|2 min']},
  {id:'kam',type:'multi',l:['Kamera hareketi','Camera movement'],opts:['Sabit|static','Yavaş ileri|slow push-in','Yavaş geri|slow pull-out','Pan','Tilt','Dolly','Tracking','Orbit','Drone uçuşu|drone fly-over','El kamerası|handheld']},
  {id:'yog',type:'single',l:['Hareket yoğunluğu','Motion intensity'],opts:['Çok sakin|very calm','Yavaş|slow','Orta|moderate','Dinamik|dynamic','Çok hareketli|high energy']},
  {id:'ses',type:'multi',l:['Ses','Audio'],opts:['Müzik|music','Seslendirme|voice-over','Ortam sesi|ambient sound','Diyalog|dialogue','Sessiz|silent','Altyazı|subtitles']}]},
 duzenleme:{t:['Görsel düzenleme','Image editing'],tag:'opt',dp:'req',hint:'Mevcut bir görsel üzerinde çalışıyorsanız doldurun.',groups:[
  {id:'islem',type:'multi',l:['Yapılacak işlem','Edit to apply'],opts:['Arka planı değiştir|replace the background','Nesne ekle|add an object','Nesne / detay sil|remove an object / detail','Netleştir / büyüt (upscale)|sharpen / upscale','Renk ve ışık düzelt|colour and light correction','Stil dönüştür|style transfer','Mevsim / hava değiştir|change season / weather','Kıyafet değiştir|change outfit','Yüz ifadesi değiştir|change facial expression','Ürünü yeni sahneye yerleştir|place product in a new scene']},
  {id:'koru',type:'multi',l:['Korunacaklar','Keep unchanged'],opts:['Yüz / kimlik|face / identity','Kompozisyon|composition','Ürün görünümü|product appearance','Logo ve yazılar|logo and text','Renkler|colours','Mekân görünümü|venue appearance']}]},
 anlatim:{t:['Anlatım tarzı','Narrative style'],tag:'spec',dp:'style',groups:[
  {id:'g',type:'multi',opts:['Bilgilendirici|informative','Hikâyeleştirici|storytelling','Reklam dili|advertising','Belgesel|documentary','Kurumsal|corporate','Samimi|friendly','Duygusal|emotional','İkna edici|persuasive','Mizahi|humorous','Otoriter|authoritative','Güven verici|reassuring','Lüks / premium|luxury / premium','Sade|plain','Teknik|technical','Akademik|academic']},
  {id:'anl',type:'single',l:['Anlatıcı','Narrator'],opts:['Birinci kişi|first person','Üçüncü kişi|third person','Marka adına|on behalf of the brand','Uzman adına|as an expert','Müşteri deneyimi|customer testimonial voice','Anlatıcı yok|no narrator']},
  {id:'yapi',type:'multi',l:['Yapı','Structure'],opts:['Hook → değer → CTA|hook → value → CTA','Problem → çözüm → sonuç|problem → solution → result','AIDA','PAS (problem-ajitasyon-çözüm)|PAS','Giriş-gelişme-sonuç|beginning-middle-end','Soru-cevap|Q&A','Liste formatı|listicle']}]},
 pazar:{t:['Pazarlama ve kanal','Marketing and channel'],tag:'spec',dp:'req',groups:[
  {id:'kanal',type:'multi',l:['Kanal','Channel'],opts:['Instagram','TikTok','LinkedIn','YouTube','X (Twitter)','Facebook','Google Ads','Web sitesi / landing page|Website / landing page','E-posta|Email','WhatsApp','Booking / OTA','Basılı|Print']},
  {id:'tetik',type:'multi',l:['Psikolojik tetikleyici','Psychological trigger'],opts:['Sosyal kanıt|social proof','Kıtlık|scarcity','Aciliyet|urgency','Otorite|authority','Fayda odağı (WIIFY)|benefit focus (WIIFY)','Hikâye|story','Merak|curiosity','Ait olma|belonging']},
  {id:'cta',type:'text',l:['CTA (eylem çağrısı)','CTA'],ph:'Örn. Hemen rezervasyon yap'},
  {id:'seo',type:'text',l:['Anahtar kelimeler (SEO / GEO)','Keywords (SEO / GEO)'],ph:''}]},
 arastirma:{t:['Araştırma yöntemi ve kaynak','Research method and sources'],tag:'spec',dp:'req',groups:[
  {id:'kaynak',type:'multi',l:['Kaynak türü','Source type'],opts:['Akademik yayın|academic papers','Resmî istatistik (TÜİK, Eurostat vb.)|official statistics (TurkStat, Eurostat etc.)','Sektör raporları|industry reports','Mevzuat|legislation','Haber kaynakları|news sources','Kullanıcı yorumları|user reviews','Yalnızca verdiğim dosyalar|only the files I provide']},
  {id:'guncel',type:'single',l:['Güncellik','Recency'],opts:['Son 1 yıl|last 12 months','Son 3 yıl|last 3 years','Son 5 yıl|last 5 years','Tarih önemli değil|any date']},
  {id:'yontem',type:'multi',l:['Yöntem / çerçeve','Method / framework'],opts:['SWOT','PESTEL','Porter 5 Güç|Porter\'s Five Forces','Karar matrisi|decision matrix','Senaryo analizi|scenario analysis','5 Neden (kök neden)|5 Whys root cause','Maliyet-fayda|cost-benefit','Benchmark']},
  {id:'atif',type:'multi',l:['Atıf ve güvenilirlik','Citations and confidence'],opts:['Her iddiaya kaynak linki|source link per claim','Sonda kaynakça|bibliography at the end','Güven seviyesi belirt|state confidence level','Belirsizlikleri ayrı listele|list uncertainties separately']}]},
 finans:{t:['Finansal parametreler','Financial parameters'],tag:'spec',dp:'req',groups:[
  {id:'pb',type:'multi',l:['Para birimi','Currency'],opts:['TRY','USD','EUR','GBP']},
  {id:'ufuk',type:'single',l:['Zaman ufku','Horizon'],opts:['1 yıl|1 year','3 yıl|3 years','5 yıl|5 years','10 yıl|10 years','Proje ömrü|project lifetime']},
  {id:'metrik',type:'multi',l:['Metrikler','Metrics'],opts:['NBD (NPV)|NPV','İç verim oranı (IRR)|IRR','Geri dönüş süresi|payback period','ROI','EBITDA','Nakit akışı|cash flow','Başabaş noktası|break-even point','Hassasiyet analizi|sensitivity analysis']},
  {id:'senaryo',type:'multi',l:['Senaryolar','Scenarios'],opts:['Baz|base case','İyimser|best case','Kötümser|worst case','Stres testi|stress test']},
  {id:'enf',type:'single',l:['Enflasyon','Inflation'],opts:['Reel (enflasyondan arındırılmış)|real terms','Nominal','İkisi birden|both']}]},
 kod:{t:['Teknik gereksinimler (kod)','Technical requirements (code)'],tag:'spec',dp:'req',groups:[
  {id:'dil',type:'multi',l:['Dil / teknoloji','Language / stack'],opts:['Python','JavaScript','TypeScript','React','Node.js','HTML / CSS','SQL','C#','Java','PHP','Go','Excel formülü / VBA|Excel formula / VBA','Google Apps Script']},
  {id:'ortam',type:'text',l:['Çalışma ortamı / sürümler','Environment / versions'],ph:'Örn. Python 3.12, Windows, PostgreSQL 16'},
  {id:'kalite',type:'multi',l:['Kalite gereksinimleri','Quality requirements'],opts:['Hata yönetimi|error handling','Testler|tests','Kod içi yorumlar|inline comments','Güvenlik|security','Performans|performance','Erişilebilirlik|accessibility','Tip güvenliği|type safety','Mevcut kod stiline uy|match existing code style']},
  {id:'kabul',type:'area',l:['Kabul kriterleri (ne çalışırsa bitti sayılır?)','Acceptance criteria'],ph:''}]},
 teknik:{t:['Teknik proje parametreleri','Technical project parameters'],tag:'spec',dp:'req',groups:[
  {id:'dis',type:'multi',l:['Disiplin','Discipline'],opts:['Mimari|architecture','İnşaat|civil / structural','Makine|mechanical','Elektrik|electrical','Peyzaj|landscape','Tarım / sulama|agriculture / irrigation','Hayvancılık|livestock','Enerji / GES|energy / solar']},
  {id:'std',type:'multi',l:['Standart / mevzuat','Standards / regulations'],opts:['TSE / TS standartları|Turkish TS standards','Eurocode','İmar yönetmeliği|zoning regulations','Deprem yönetmeliği|seismic code','ISO','Yerel mevzuat|local regulations']},
  {id:'olcek',type:'text',l:['Ölçü / alan / kapasite','Size / area / capacity'],ph:'Örn. 12 dönüm arazi, 40 baş büyükbaş'}]},
 egitim:{t:['Eğitim / sunum parametreleri','Training / deck parameters'],tag:'spec',dp:'req',groups:[
  {id:'sev',type:'single',l:['Seviye','Level'],opts:['Başlangıç|beginner','Orta|intermediate','İleri|advanced','Karma|mixed']},
  {id:'yak',type:'multi',l:['Öğretim yaklaşımı','Teaching approach'],opts:['Örnekle anlat|teach with examples','5 yaşındaymış gibi (ELI5)|explain like I\'m 5','Adım adım|step by step','Uygulamalı alıştırma|hands-on exercises','Vaka çalışması|case study','Görsel / şema önerisi|visual / diagram suggestions']},
  {id:'sure',type:'text',l:['Süre / slayt sayısı','Duration / slide count'],ph:'Örn. 45 dk, 12 slayt'}]},
 ses:{t:['Müzik / ses parametreleri','Music / voice parameters'],tag:'spec',dp:'req',kw:true,groups:[
  {id:'tur',type:'multi',l:['Tür','Genre'],opts:['Pop','Rock','Türk halk müziği|Turkish folk','Türk sanat müziği|Turkish classical','Arabesk|arabesque','Elektronik|electronic','Lo-fi','Akustik|acoustic','Sinematik|cinematic','Kurumsal fon müziği|corporate background']},
  {id:'vokal',type:'single',l:['Vokal / ses','Vocal / voice'],opts:['Kadın|female','Erkek|male','Düet|duet','Koro|choir','Enstrümantal|instrumental']},
  {id:'tempo',type:'single',l:['Tempo','Tempo'],opts:['Yavaş (60–80 BPM)|slow (60–80 BPM)','Orta (90–110 BPM)|mid (90–110 BPM)','Hızlı (120+ BPM)|fast (120+ BPM)']},
  {id:'duygu',type:'multi',l:['Duygu','Emotion'],opts:['Neşeli|joyful','Hüzünlü|melancholic','Romantik|romantic','Coşkulu|uplifting','Sakin|calm','Nostaljik|nostalgic','Güven veren|reassuring']}]},
 promptMod:{t:['Prompt mühendisliği teknikleri','Prompt-engineering techniques'],tag:'spec',dp:'req',groups:[
  {id:'tek',type:'multi',l:['Kullanılacak teknikler','Techniques to use'],opts:['Uzman rol tanımı|expert role definition','Few-shot örnekler|few-shot examples','İç muhakeme, sadece sonuç|reason internally, show only the result','XML / bölüm etiketleri|XML / section tags','JSON çıktı şeması|JSON output schema','Kendi kendini kontrol listesi|self-check checklist','Değişkenler {{...}}|variables {{...}}','Adım adım iş akışı|step-by-step workflow','Hata / istisna durumları|edge cases and fallbacks']},
  {id:'kayit',type:'multi',l:['Kütüphane kaydı alanları','Library entry fields'],opts:['Kod / komut adı|command code','Kategori|category','TR + EN açıklama|TR + EN description','Ne zaman kullanılır|when to use','Örnek|example','Sürüm / tarih|version / date']}]},

 /* --- ortak alt bölümler --- */
 uzunluk:{t:['Uzunluk','Length'],tag:'all',dp:'fmt',groups:[
  {id:'g',type:'single',opts:['Çok kısa|very short','Kısa|short','Orta|medium','Detaylı|detailed','Çok detaylı|very detailed','Maksimum kapsamlı|as comprehensive as possible']},
  {id:'lim',type:'limits',l:['Kesin sınır (varsa)','Hard limit (if any)'],fields:['Kelime|words','Karakter|characters','Saniye|seconds','Madde|bullet points','Sayfa|pages','Adet / varyasyon|items / variations']}]},
 ton:{t:['Üslup / ton','Tone'],tag:'all',dp:'style',groups:[
  {id:'g',type:'multi',opts:['Resmî|formal','Kurumsal|corporate','Profesyonel|professional','Samimi|friendly','Sıcak|warm','Dostça|approachable','Otoriter|authoritative','Uzman|expert','Akademik|academic','Teknik|technical','Sade|plain','Premium','Lüks|luxurious','İkna edici|persuasive','Duygusal|emotional','Eğlenceli|playful','Dinamik|dynamic']}]},
 marka:{t:['Marka / kimlik','Brand / identity'],tag:'opt',dp:'ctx',hint:'Bir marka veya şirket varsa doldurun.',groups:[
  {id:'ad',type:'text',l:['Marka adı','Brand name'],ph:''},
  {id:'bilgi',type:'area',l:['Marka hakkında bilinmesi gerekenler','Brand facts'],ph:''},
  {id:'kis',type:'multi',l:['Marka kişiliği','Brand personality'],opts:['Güvenilir|trustworthy','Premium','Yenilikçi|innovative','Geleneksel|traditional','Samimi|friendly','Profesyonel|professional','Teknolojik|tech-driven','Doğal|natural','Lüks|luxury','Ekonomik|affordable','Aile odaklı|family-oriented','Sağlık odaklı|health-focused']},
  {id:'koru',type:'multi',l:['Korunacak marka unsurları','Brand elements to keep'],opts:['Logo','Renkler|colours','Slogan','Ürün görünümü|product appearance','Mekân görünümü|venue appearance','Marka adı|brand name','Kurumsal kimlik|corporate identity']}]},
 referans:{t:['Referans / kaynak','Reference / source'],tag:'opt',dp:'ctx',groups:[
  {id:'tur',type:'multi',l:['Elinizdeki kaynak','Available source'],opts:['Fotoğraf|photo','Video','PDF','Teknik çizim|technical drawing','Metin|text','Excel / tablo|spreadsheet','Web sitesi|website','Logo','Ürün görseli|product image','Harita|map']},
  {id:'acik',type:'text',l:['Kaynak açıklaması','Source description'],ph:''},
  {id:'kul',type:'multi',l:['Kaynak nasıl kullanılsın?','How to use it'],opts:['Aynısını temel alsın|use it as the base','Sadece stilini örnek alsın|borrow only its style','Geliştirerek kullansın|build on and improve it','Gerçek bilgileri korusun|keep its facts intact','Kompozisyonu referans alsın|reference its composition']}]},
 komut:{t:['Kod & Command Prompt','Kod & Command Prompt'],tag:'all',core:true,dp:'cmd',hint:'Evodak Kod & Command Prompt bölümünden canlı gelir; seçtiğiniz amaca ve hedef yapay zekâya göre filtrelenir. Seçilen her komut açıklamasıyla prompta yazılır; hedef AI kodu tanımasa da ne yapacağını bilir.',groups:[
  {id:'g',type:'cmdx',l:['Komutlar','Commands']}]},
 mutlaka:{t:['Mutlaka olması gerekenler','Must include'],tag:'all',core:true,dp:'must',groups:[
  {id:'liste',type:'area',l:['Her satıra bir madde','One item per line'],ph:'Örn.\nDeniz manzarası görünsün\nOtelin adı yazılmasın'},
  {id:'ai',type:'check',l:['Eklenmesi gerekenleri AI belirlesin','Let the AI add whatever else is essential']}]},
 olmasin:{t:['Kesinlikle olmaması gerekenler','Must avoid'],tag:'all',core:true,dp:'not',groups:[
  {id:'hazir',type:'multi',l:['Hazır negatifler (amaca göre)','Ready-made negatives (by purpose)'],opts:p=>[].concat(...(NEGMAP[p]||['text']).map(k=>NEG[k]))},
  {id:'liste',type:'area',l:['Diğer (her satıra bir madde)','Other (one per line)'],ph:''},
  {id:'ai',type:'check',l:['Görev için gerekli negatifleri AI belirlesin','Let the AI add the negatives this task needs']}]},
 oncelik:{t:['Öncelik sırası','Priority order'],tag:'all',dp:'prio',hint:'Hedefler çatışırsa AI hangisini öne alsın?',groups:[1,2,3].map(n=>({id:'p'+n,type:'single',l:[n+'. öncelik',['1st','2nd','3rd'][n-1]+' priority'],opts:['Gerçekçilik|realism','Doğruluk|accuracy','Teknik doğruluk|technical accuracy','Görsel kalite|visual quality','Yaratıcılık|creativity','Etkileyicilik|impact','Satış gücü|selling power','Duygusal etki|emotional impact','Profesyonellik|professionalism','Sadelik|simplicity','Detay|detail','Hız|speed'],noAI:n>1}))},
 ozgurluk:{t:['AI ne kadar özgür olsun?','Creative freedom'],tag:'all',core:true,dp:'rule',groups:[
  {id:'g',type:'single',sentence:true,noAI:true,opts:['Hiçbir şeyi değiştirmesin; talimatlara tamamen bağlı kalsın.|Change nothing; follow the instructions exactly.','Küçük ayrıntıları kendisi tamamlayabilir.|You may fill in minor details.','Profesyonel kararları kendisi verebilir.|You may make professional judgement calls.','Eksik ayrıntıları büyük ölçüde kendisi tasarlayabilir.|You may design most missing details yourself.','Yaratıcı özgürlüğü yüksek olsun.|Take high creative freedom.','En iyi sonuç için gerekli tüm kararları kendisi versin.|Make every decision needed for the best result.']}]},
 hata:{t:['Hata toleransı','Error tolerance'],tag:'all',dp:'rule',groups:[
  {id:'g',type:'single',sentence:true,opts:['Kritik: hiçbir teknik veya gerçeklik hatası kabul edilmez.|Critical: no technical or factual errors are acceptable.','Çok önemli: mümkün olduğunca hatasız olmalı.|Very important: should be as error-free as possible.','Orta: küçük hatalar kabul edilebilir.|Moderate: minor errors are acceptable.','Yaratıcılık doğruluktan daha önemli.|Creativity matters more than precision.']}]},
 teslim:{t:['Teslim biçimi','Delivery format'],tag:'all',core:true,dp:'fmt',groups:[
  {id:'g',type:'multi',opts:['Sadece nihai prompt|final prompt only','Prompt + negatif prompt|prompt + negative prompt','Prompt + alternatif versiyonlar|prompt + alternative versions','Prompt + kısa açıklama|prompt + short rationale','Prompt + teknik ayarlar|prompt + technical settings','Prompt + kullanım talimatı|prompt + usage instructions','Yapılandırılmış (başlıklı) prompt|structured prompt with headings','Tek parça doğal prompt|single natural-language prompt','Platforma özel format|platform-specific format','Kod bloğu içinde|inside a code block']}]},
 calisma:{t:['AI çalışma talimatları','AI working instructions'],tag:'all',core:true,isNew:true,dp:'rule',hint:'Varsayılan olarak açıktır; kısa ve basit işler için kapatabilirsiniz. İşaretli talimatlar nihai prompta eklenir.',groups:[
  {id:'dusun',type:'check',l:['Adım adım düşünsün','Think step by step'],line:['Yanıt vermeden önce görevi adımlara ayır, her adımı sırayla düşün, sonra yanıtı oluştur.','Before answering, break the task into steps, reason through each step in order, then write the answer.']},
  {id:'elestir',type:'check',l:['Öz-eleştiri ve yeniden yazma: taslak → eleştiri → düzeltilmiş son hal','Self-critique and rewrite: draft → critique → corrected final'],line:['1) İlk taslağı hazırla. 2) Taslağı eksiklik, belirsizlik, hata ve tutarsızlık açısından eleştir. 3) Eleştiriye göre düzeltilmiş son hali ver. Eleştiriyi kısa bir liste olarak göster.','1) Write a first draft. 2) Critique the draft for gaps, ambiguity, errors and inconsistencies. 3) Deliver the corrected final version based on the critique. Show the critique as a short list.']}]},
 ek:{t:['Ek özel talimat','Additional instructions'],tag:'all',dp:'rule',groups:[
  {id:'g',type:'area',l:['Yukarıda olmayan özel isteğiniz','Anything not covered above'],ph:''}]},
 son:{t:['Boş alanlar için son karar','Fallback for empty fields'],tag:'all',core:true,hint:'Varsayılan: doldurulmamış her alan "AI karar versin" sayılır; AI\'ın dolduracağı bölümler kesik çizgiyle gösterilir.',dp:'rule',groups:[
  {id:'g',type:'single',sentence:true,opts:[AIFILL,'AI makul bir profesyonel varsayım yapsın.|Make a reasonable professional assumption.','Kritik eksiklik varsa prompt içinde belirtsin.|Flag any critical gap inside the prompt.','Mevcut bilgilerden en iyi sonucu üretmek için kendisi karar versin.|Decide yourself to get the best result from what is given.','Eksikleri tamamlamak için önce bana soru sorsun.|Ask me questions before filling the gaps.']}]}
};
const ORDER_HEAD=['konu','amac','platform','kitle','dil','cikti','detay','dosya'];
const SPEC_ORDER=['gerceklik','gorselTarz','kamera','isik','hareket','duzenleme','anlatim','pazar','arastirma','finans','kod','teknik','egitim','ses','promptMod','marka'];
const ORDER_TAIL=['uzunluk','ton','referans','komut','mutlaka','olmasin','oncelik','ozgurluk','hata','teslim','calisma','ek','son'];

/* Amaca göre önerilen seçimler: [bölüm, grup, değer] */
const REC={
 gorsel:[['amac','g','Dikkat çekmek'],['amac','g','Profesyonel görünmek'],['cikti','g','Görsel promptu + negatif prompt'],['gerceklik','lvl','Fotoğraf gerçekliğinde'],['gerceklik','uyum','Önemli'],['kamera','oran','Platforma göre otomatik'],['komut','g','/depth'],['olmasin','hazir','Bozuk anatomi / ekstra parmak'],['olmasin','hazir','Anlamsız yazı / harf hatası'],['olmasin','hazir','Filigran / imza'],['teslim','g','Prompt + negatif prompt'],['teslim','g','Platforma özel format'],['ozgurluk','g','Profesyonel kararları kendisi verebilir.'],['hata','g','Çok önemli: mümkün olduğunca hatasız olmalı.']],
 video:[['amac','g','Dikkat çekmek'],['cikti','g','Sahne sahne video promptları'],['gerceklik','lvl','Sinematik gerçekçilik'],['hareket','yog','Orta'],['kamera','oran','9:16'],['komut','g','/storyboarding'],['komut','g','/hooks10'],['olmasin','hazir','Karakter / yüz tutarsızlığı'],['olmasin','hazir','Fizik dışı hareket'],['olmasin','hazir','Titreme (flicker)'],['teslim','g','Prompt + teknik ayarlar'],['ozgurluk','g','Profesyonel kararları kendisi verebilir.']],
 metin:[['amac','g','Bilgi vermek'],['dil','g','Türkçe'],['anlatim','yapi','Giriş-gelişme-sonuç'],['komut','g','/outline'],['komut','g','/delete-ai-words'],['olmasin','hazir','Klişe ifadeler'],['olmasin','hazir','Yapay zekâ dili'],['olmasin','hazir','Uydurma bilgi / istatistik'],['teslim','g','Tek parça doğal prompt'],['ozgurluk','g','Küçük ayrıntıları kendisi tamamlayabilir.']],
 pazarlama:[['amac','g','Müşteri kazanmak'],['amac','g','Dikkat çekmek'],['cikti','g','Hook / başlık seçenekleri'],['anlatim','yapi','Hook → değer → CTA'],['pazar','tetik','Fayda odağı (WIIFY)'],['komut','g','/hooks10'],['komut','g','/copywriter'],['olmasin','hazir','Abartılı vaat'],['olmasin','hazir','Klişe ifadeler'],['teslim','g','Prompt + alternatif versiyonlar'],['ozgurluk','g','Profesyonel kararları kendisi verebilir.']],
 arastirma:[['amac','g','Karar vermeye yardımcı olmak'],['cikti','g','Özet + bulgular'],['cikti','g','Karşılaştırma tablosu'],['arastirma','guncel','Son 3 yıl'],['arastirma','atif','Her iddiaya kaynak linki'],['arastirma','atif','Belirsizlikleri ayrı listele'],['komut','g','/fact-checker'],['komut','g','/assumptions'],['olmasin','hazir','Uydurma veri'],['olmasin','hazir','Kaynaksız iddia'],['hata','g','Kritik: hiçbir teknik veya gerçeklik hatası kabul edilmez.'],['son','g','Kritik eksiklik varsa prompt içinde belirtsin.']],
 finans:[['amac','g','Yatırım kararını desteklemek'],['cikti','g','Yönetici özeti'],['cikti','g','Excel uyumlu tablo'],['finans','senaryo','Baz'],['finans','senaryo','İyimser'],['finans','senaryo','Kötümser'],['finans','metrik','Geri dönüş süresi'],['finans','metrik','Hassasiyet analizi'],['finans','enf','İkisi birden'],['komut','g','/devil'],['komut','g','/assumptions'],['olmasin','hazir','Uydurma veri'],['olmasin','hazir','Varsayımı gerçek gibi sunma'],['hata','g','Kritik: hiçbir teknik veya gerçeklik hatası kabul edilmez.']],
 kod:[['amac','g','Teknik bir çözüm üretmek'],['cikti','g','Çalışır kod'],['kod','kalite','Hata yönetimi'],['kod','kalite','Testler'],['kod','kalite','Mevcut kod stiline uy'],['komut','g','/plan'],['komut','g','/test'],['olmasin','hazir','Kodda gömülü şifre / anahtar'],['olmasin','hazir','Placeholder / yarım kod'],['teslim','g','Kod bloğu içinde'],['hata','g','Kritik: hiçbir teknik veya gerçeklik hatası kabul edilmez.'],['son','g','Eksikleri tamamlamak için önce bana soru sorsun.']],
 teknik:[['amac','g','Teknik bir çözüm üretmek'],['cikti','g','Teknik rapor'],['gerceklik','uyum','Çok önemli'],['teknik','std','Yerel mevzuat'],['komut','g','/scout'],['komut','g','/assumptions'],['olmasin','hazir','Varsayımı gerçek gibi sunma'],['hata','g','Kritik: hiçbir teknik veya gerçeklik hatası kabul edilmez.'],['son','g','Kritik eksiklik varsa prompt içinde belirtsin.']],
 egitim:[['amac','g','Eğitim vermek'],['egitim','yak','Örnekle anlat'],['egitim','yak','Adım adım'],['komut','g','/examples'],['komut','g','/key-points'],['olmasin','hazir','Uydurma bilgi / istatistik'],['teslim','g','Yapılandırılmış (başlıklı) prompt']],
 ses:[['amac','g','Duygusal etki oluşturmak'],['cikti','g','Şarkı sözü'],['cikti','g','Müzik stil promptu'],['komut','g','/hooks10'],['olmasin','hazir','Klişe ifadeler'],['teslim','g','Platforma özel format'],['ozgurluk','g','Yaratıcı özgürlüğü yüksek olsun.']],
 prompt:[['cikti','g','Nihai prompt'],['promptMod','tek','Uzman rol tanımı'],['promptMod','tek','Kendi kendini kontrol listesi'],['promptMod','tek','İç muhakeme, sadece sonuç'],['komut','g','/promptengineer'],['komut','g','/examples'],['olmasin','hazir','Çelişkili kurallar'],['olmasin','hazir','Belirsiz talimat'],['teslim','g','Prompt + kullanım talimatı'],['ozgurluk','g','Profesyonel kararları kendisi verebilir.']]
};


const B_TR=`Sen kıdemli bir Prompt Mühendisi, AI iş akışı mimarı, alan uzmanı ve çıktı kalite denetçisisin. Yukarıdaki Meta Bilgileri kullanarak, kullanıcının hedef yapay zekâya doğrudan kopyalayıp gönderebileceği tek bir nihai prompt üret.

1) ANALİZ: Amacı, konuyu, hedef kitleyi, dili, platformu, çıktı türünü ve kullanıcının verdiği gerçek bilgileri çözümle. Kullanıcının verdiği bilgi ile senin varsayımını ayır. Çelişki varsa sırasıyla en son verilen, en açık ve açıkça belirtilmiş talimatı esas al; çelişkileri sessizce birleştirme. Kullanıcının söylediği ile gerçekte istediği farklıysa gerçek hedefe hizmet et.

2) İNŞA: Yalnızca gerekenleri dahil et: göreve uygun uzmanlık rolü, ölçülebilir amaç, uygulanabilir görev tanımı, bağlam, girdiler ve nasıl kullanılacakları, net çıktı (adet, uzunluk, format, oran), stil ve ton, sınırlar (negatif talimatlar) ve iç kontrol adımları. "Profesyonel olsun" gibi belirsiz ifadeler yerine neyin profesyonel sayılacağını tanımla.

3) GÖREVE ÖZEL MOTOR:
- Görsel: özne, ortam, kompozisyon, kamera ve lens, ışık, malzeme ve doku, renk, ölçek, gerçeklik, oran, negatif prompt.
- Video: açılış karesi, sahne akışı, süre, kamera ve özne hareketi, geçişler, süreklilik, bitiş karesi, istenmeyen hareketler.
- Reklam / sosyal medya: hook, acı noktası, değer önerisi, duygusal tetik, mesaj hiyerarşisi, CTA, platform formatı.
- Araştırma / finans: kaynak güvenilirliği, güncellik, metodoloji, varsayımlar, senaryolar, riskler, hassasiyet.
- Kod / teknik: teknoloji, girdi-çıktı, mimari, güvenlik, hata yönetimi, test, kabul kriterleri.
- Metin / senaryo: kitle, anlatıcı, yapı, ritim, duygu, mesaj, CTA.

4) PLATFORM: Hedef platform belirtilmişse promptu o platformun yapısına ve parametrelerine göre optimize et; desteklenmeyen parametre ekleme. Belirtilmemişse platform bağımsız yaz.

5) KOMUTLAR: "Uygulanacak komutlar" satırındaki her komutu, yanındaki anlamıyla birlikte hedef AI'ın anlayacağı açık talimata dönüştür; komut kodunu açıklamasız bırakma.

6) KALİTE KONTROL (kullanıcıya gösterme): amaç, görev, rol, bağlam, girdi, çıktı, format, dil, kitle ve platform uyumu; gereksiz, eksik veya çelişkili talimat; uydurma bilgi riski; değiştirilmemesi gereken bilgilerin korunması; ölçülebilirlik; uzunluk ile eksiksizlik dengesi. Sorun bulursan teslimden önce düzelt.

GERÇEKLİK: Fiyat, tarih, istatistik, mevzuat, teknik özellik, kişi veya şirket bilgisi gibi verilmemiş verileri kesin bilgi gibi yazma. Gerekirse prompta "veri yoksa açıkça belirt ve doğrulanabilir kaynak kullan" talimatını ekle.

ÇIKTI KURALI: Ara analiz veya taslak gösterme. Nihai, kullanıma hazır promptu ver; "Teslim biçimi" alanında ek bir şey (negatif prompt, alternatif, açıklama, teknik ayar) istendiyse yalnızca onu ekle. Gereksiz "Rol: / Görev:" başlıkları kullanma; platform için daha etkiliyse yapılandırılmış başlık kullanabilirsin. Kritik bir varsayım yaptıysan promptun sonuna tek satır ekle: "Varsayım: [...]".`;
const B_EN=`You are a senior prompt engineer, AI workflow architect, domain expert and output quality reviewer. Using the meta information above, produce one final prompt the user can paste directly into the target AI.

1) ANALYSE: Work out the purpose, topic, audience, language, platform, output type and the facts the user supplied. Keep the user's facts separate from your assumptions. If information conflicts, prefer the most recent, then the most explicit, then the expressly stated instruction; never silently merge conflicts. If what the user says differs from what they actually need, serve the real goal.

2) BUILD: Include only what is needed: an expert role that fits the task, a measurable goal, an actionable task, context, inputs and how to use them, a precise output (count, length, format, ratio), style and tone, limits (negative instructions) and internal checks. Replace vague words like "professional" with a definition of what counts as professional.

3) TASK-SPECIFIC ENGINE:
- Image: subject, setting, composition, camera and lens, light, materials and texture, colour, scale, realism, aspect ratio, negative prompt.
- Video: opening frame, scene progression, duration, camera and subject motion, transitions, continuity, end frame, unwanted motion.
- Ads / social: hook, pain point, value proposition, emotional trigger, message hierarchy, CTA, platform format.
- Research / finance: source reliability, recency, methodology, assumptions, scenarios, risks, sensitivity.
- Code / technical: stack, inputs and outputs, architecture, security, error handling, tests, acceptance criteria.
- Writing / script: audience, narrator, structure, rhythm, emotion, message, CTA.

4) PLATFORM: If a target platform is named, optimise for its structure and parameters and add no unsupported parameters. Otherwise write a platform-agnostic prompt.

5) COMMANDS: Turn every command listed under "Apply these commands" into a plain instruction the target AI will understand, using the meaning given next to it; never leave a bare command code.

6) QUALITY CHECK (do not show it): purpose, task, role, context, inputs, output, format, language, audience and platform fit; redundant, missing or conflicting instructions; risk of invented facts; preservation of facts that must not change; measurability; balance of length and completeness. Fix any issue before delivering.

FACTS: Never state unsupplied prices, dates, statistics, regulations, specs, or people or company details as fact. Where needed, instruct: "If data is unavailable, say so and use verifiable sources."

OUTPUT RULE: Show no analysis or drafts. Deliver the final, ready-to-use prompt; if the "Delivery format" field asks for extras (negative prompt, alternatives, rationale, settings), add only those. Avoid needless "Role: / Task:" labels, but use structured headings when they work better for the platform. If you made a critical assumption, end with one line: "Assumption: [...]".`;

