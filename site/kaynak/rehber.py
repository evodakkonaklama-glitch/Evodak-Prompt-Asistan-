# Rehber sayfaları, KVKK aydınlatma metni taslağı ve yeni arayüz metinleri (4 dil)
# Metinler panelden ("Metinler" sekmesi) değiştirilebilir; bu dosya varsayılan içeriktir.

from icerik import T

# ---------------------------------------------------------------- arayüz
UI = {
"tr": {
 "nav_guides":"Rehberler","guides_h":"Hasta ve yakınları için rehberler","guides_lead":"Yola çıkmadan önce en çok sorulan konuları ayrıntılı anlattık.","read_more":"Rehberi okuyun",
 "team_h":"Ekibimiz","team_lead":"Başvurunuzdan tedavi sonrası takibe kadar sizinle ilgilenecek koordinasyon ekibimiz.","speaks":"Konuştuğu diller",
 "partners_h2":"Anlaşmalı kurumlarımız","partners_lead":"İş birliği yaptığımız sağlık kurumları. Kurum bilgileri, ilgili kurumun onayıyla yayımlanmıştır.","visit_site":"Kurumun sitesi",
 "privacy_link":"KVKK Aydınlatma Metni","privacy_draft":"Bu metin hukuki inceleme aşamasındadır ve güncellenebilir.",
 "updated_lbl":"Son güncelleme","back_home":"Ana sayfaya dön","on_this_page":"Bu sayfada","guide_cta_h":"Sürecinizi birlikte planlayalım","guide_cta_p":"Belgelerinizi hazırladıysanız ön başvurunuzu 2 dakikada yapabilirsiniz.",
 "official_links":"Resmî bağlantılar",
 "cookie_text":"Sitemizi nasıl kullandığınızı anlamak için, onay verirseniz ölçüm çerezleri kullanırız.","cookie_ok":"Kabul et","cookie_no":"Reddet",
 "closed":"Şu an kapalıyız; mesajınıza ilk mesai saatinde dönüyoruz.","announce_close":"Duyuruyu kapat",
},
"en": {
 "nav_guides":"Guides","guides_h":"Guides for patients and families","guides_lead":"Detailed answers to the questions people ask most before they travel.","read_more":"Read the guide",
 "team_h":"Our team","team_lead":"The coordination team who will look after you from your application to follow-up care.","speaks":"Languages",
 "partners_h2":"Our partner institutions","partners_lead":"Healthcare institutions we work with. Details are published with each institution's approval.","visit_site":"Institution website",
 "privacy_link":"Privacy notice","privacy_draft":"This notice is under legal review and may be updated.",
 "updated_lbl":"Last updated","back_home":"Back to home page","on_this_page":"On this page","guide_cta_h":"Let's plan your treatment together","guide_cta_p":"If your documents are ready, you can complete your pre-application in 2 minutes.",
 "official_links":"Official links",
 "cookie_text":"With your consent, we use analytics cookies to understand how our website is used.","cookie_ok":"Accept","cookie_no":"Decline",
 "closed":"We're closed right now; we'll reply at the start of our next working hours.","announce_close":"Close announcement",
},
"ar": {
 "nav_guides":"أدلة","guides_h":"أدلة للمرضى وذويهم","guides_lead":"شرحنا بالتفصيل أكثر المواضيع التي يُسأل عنها قبل السفر.","read_more":"اقرأ الدليل",
 "team_h":"فريقنا","team_lead":"فريق التنسيق الذي يرافقك من تقديم الطلب حتى المتابعة بعد العلاج.","speaks":"اللغات",
 "partners_h2":"المؤسسات المتعاقدة معنا","partners_lead":"المؤسسات الصحية التي نتعاون معها. تُنشر البيانات بموافقة كل مؤسسة.","visit_site":"موقع المؤسسة",
 "privacy_link":"إشعار الخصوصية","privacy_draft":"هذا النص قيد المراجعة القانونية وقد يُحدَّث.",
 "updated_lbl":"آخر تحديث","back_home":"العودة إلى الصفحة الرئيسية","on_this_page":"في هذه الصفحة","guide_cta_h":"لنخطط لرحلة علاجك معًا","guide_cta_p":"إذا كانت مستنداتك جاهزة، يمكنك تقديم طلبك المسبق في دقيقتين.",
 "official_links":"روابط رسمية",
 "cookie_text":"نستخدم ملفات تعريف الارتباط التحليلية بموافقتك لفهم طريقة استخدام موقعنا.","cookie_ok":"موافق","cookie_no":"رفض",
 "closed":"نحن خارج ساعات العمل الآن، وسنرد على رسالتك في بداية ساعات العمل التالية.","announce_close":"إغلاق الإعلان",
},
"ru": {
 "nav_guides":"Справочник","guides_h":"Справочник для пациентов и близких","guides_lead":"Подробно о том, что чаще всего спрашивают перед поездкой.","read_more":"Читать",
 "team_h":"Наша команда","team_lead":"Команда координаторов, которая будет с Вами от заявки до наблюдения после лечения.","speaks":"Языки",
 "partners_h2":"Наши партнёрские учреждения","partners_lead":"Медицинские учреждения, с которыми мы сотрудничаем. Сведения публикуются с их согласия.","visit_site":"Сайт учреждения",
 "privacy_link":"Политика конфиденциальности","privacy_draft":"Текст находится на юридической проверке и может быть обновлён.",
 "updated_lbl":"Обновлено","back_home":"На главную","on_this_page":"На этой странице","guide_cta_h":"Спланируем лечение вместе","guide_cta_p":"Если документы готовы, подайте предварительную заявку за 2 минуты.",
 "official_links":"Официальные ссылки",
 "cookie_text":"С Вашего согласия мы используем аналитические cookie, чтобы понимать, как используется сайт.","cookie_ok":"Принять","cookie_no":"Отклонить",
 "closed":"Сейчас мы не работаем; ответим в начале следующего рабочего дня.","announce_close":"Закрыть объявление",
},
}

# ---------------------------------------------------------------- rehberler
# Her rehber: slug (URL), title, desc (meta), intro, sections [[başlık, [paragraflar]]], links [[ad, url]]
GUIDES = {
"tr": [
 {"slug":"ankara-kanser-tedavisi-sureci","title":"Ankara'da kanser tedavisi: uluslararası hastalar için adım adım süreç",
  "desc":"Yurt dışından Ankara'ya kanser tedavisi için gelecek hastalar ve yakınları için başvurudan tedavi sonrası takibe kadar süreç.",
  "intro":"Bu rehber, kanser tedavisi için Ankara'ya gelmeyi düşünen hastalar ve yakınları için hazırlandı. Sürecin hangi adımlardan oluştuğunu, hangi belgelerin gerektiğini ve kararların nasıl verildiğini açık bir dille anlatır.",
  "sections":[
   ["Kısaca süreç nasıl işler?",["Süreç, tıbbi belgelerinizin bir uzman hekim tarafından incelenmesiyle başlar. Hekim değerlendirmesinin ardından randevu, konaklama ve ulaşım planlanır; tedavi Ankara'daki hastanede, sizi muayene eden hekimin önerdiği planla yürür. Ülkenize döndükten sonra raporlarınız ve kontrol randevularınız takip edilir.","Koordinatörünüz bu adımların hepsinde tek iletişim noktanızdır: hastane, konaklama, transfer ve tercüman ayrıntılarını sizin adınıza düzenler."]],
   ["Hangi belgeler gerekir?",["Ön değerlendirme için genellikle şu belgeler istenir: son epikriz veya doktor raporu, patoloji (biyopsi) raporu, MR, BT veya PET gibi görüntüleme raporları, son kan tahlili sonuçları ve kullanılan ilaçların listesi.","Görüntülerin kendisi (DICOM dosyaları) hekim için önemli olabilir; bunları nasıl ileteceğinizi koordinatörünüz bildirir. Belgeleriniz Türkçe veya İngilizce değilse çeviri gerekebilir; hangi belgelerin çevrilmesi gerektiğini size söyleriz."]],
   ["Hekim değerlendirmesi ve tedavi planı",["Tanı ve tedaviye ilişkin tüm kararları uzman hekim verir. Belgeler üzerinden yapılan ön değerlendirme bir başlangıçtır; kesin tedavi planı çoğu zaman Ankara'daki muayene ve tetkiklerden sonra netleşir. Bu nedenle ilk planın değişebileceğini bilmek önemlidir.","Hekimin sorularını ve önerilerini size kendi dilinizde aktarırız; aklınıza takılan her soruyu görüşmeye götürebilmeniz için birlikte hazırlanırız."]],
   ["Ankara'da tedavi süresince",["Havalimanında karşılanır, hastaneye yakın konaklamanıza yerleşirsiniz. Muayene, tetkik ve tedavi randevularınız tek bir takvimde planlanır; hastane görüşmelerinde tercüman desteği sağlanır.","Refakatçiniz de konaklama ve ulaşım planına dahil edilir. Hastanedeki refakatçi kuralları kurumdan kuruma değiştiği için bunları önceden size bildiririz."]],
   ["Tedavi sonrası takip",["Taburcu olmadan önce epikriz ve tedavi raporlarınızın size verilmesini sağlarız. Ülkenize döndükten sonra kontrol randevularınızı, yeni tahlil sonuçlarınızın hekime iletilmesini ve gerekirse kendi doktorunuzla iletişimi takip ederiz."]]],
  "links":[]},
 {"slug":"hasta-yakinlari-ankara-rehberi","title":"Hasta yakınları için Ankara rehberi: konaklama, ulaşım ve günlük yaşam",
  "desc":"Ankara'da tedavi gören bir yakınına eşlik edenler için konaklama seçimi, şehir içi ulaşım ve günlük yaşamla ilgili pratik bilgiler.",
  "intro":"Bir yakınınızın tedavisine eşlik etmek hem duygusal hem de pratik bir sorumluluktur. Bu rehber, Ankara'da geçireceğiniz süreyi kolaylaştıracak pratik bilgileri bir araya getirir.",
  "sections":[
   ["Konaklama seçerken nelere dikkat etmeli?",["Hastaneye yakınlık en önemli ölçüttür; tedavi günlerinde kısa ulaşım hem hastayı hem sizi yormaz. Asansör ve erişilebilirlik, sessiz bir ortam, küçük bir mutfak ve refakatçinin rahat kalabileceği bir oda da önemlidir.","Konaklama seçeneklerini tedavi takviminize ve ihtiyaçlarınıza göre birlikte belirleriz."]],
   ["Şehir içinde ulaşım",["Havalimanı, konaklama ve hastane arasındaki transferlerinizi biz planlarız. Esenboğa Havalimanı şehir merkezinin kuzeyindedir; karşılama ve transfer bu nedenle önceden ayarlanır.","Ankara'da metro, otobüs ve taksi ile şehir içinde kolayca dolaşabilirsiniz. Tedavi günlerinde ise planlanmış transferi kullanmanızı öneririz."]],
   ["Günlük yaşam ve iletişim",["Varışta yerel bir SIM kart veya eSIM almanız iletişiminizi kolaylaştırır. Hastane çevrelerinde eczane, market ve yemek seçenekleri bulunur; Ankara'da ibadet için camiler ve helal yiyecek bulmak kolaydır.","Koordinatörünüzün numarasını telefonunuza kaydedin; şehirde ihtiyaç duyduğunuz her konuda ona yazabilirsiniz."]],
   ["Kendinize de iyi bakın",["Uzun tedavi günlerinde dinlenmeye ve beslenmeye zaman ayırın. Mümkünse refakati başka bir aile üyesiyle paylaşın. Kendinizi yorgun veya yalnız hissettiğinizde koordinatörünüze söyleyin; size destek olacak seçenekleri birlikte düşünürüz."]]],
  "links":[]},
 {"slug":"turkiyeye-tedavi-icin-seyahat","title":"Türkiye'ye tedavi için seyahat: vize, pasaport ve yanınıza almanız gerekenler",
  "desc":"Tedavi amacıyla Türkiye'ye gelecek hastalar ve refakatçileri için vize, pasaport, tıbbi belgeler ve ilaçlarla ilgili hazırlık listesi.",
  "intro":"Tedavi için yapılan bir yolculuk, iyi bir hazırlıkla çok daha rahat geçer. Bu rehber, yola çıkmadan önce kontrol etmeniz gerekenleri listeler. Vize kuralları ülkeye göre değişir ve güncellenebilir; kesin bilgiyi resmî kaynaklardan kontrol edin.",
  "sections":[
   ["Vizeye ihtiyacım var mı?",["Bu, vatandaşı olduğunuz ülkeye bağlıdır. Bazı ülkelerin vatandaşları vizeden muaftır, bazıları resmî e-Vize sistemi üzerinden çevrimiçi vize alabilir, bazıları ise konsolosluğa başvurmalıdır.","Tedavi amaçlı başvurularda konsolosluk, hastaneden alınmış bir randevu veya davet yazısı isteyebilir. Başvurunuzdan sonra hangi yazının gerektiğini birlikte kontrol ederiz."]],
   ["Pasaport ve refakatçi",["Pasaportunuzun geçerlilik süresini konsolosluk kurallarına göre kontrol edin; tedavinin uzayabileceğini hesaba katın. Refakatçinizin de kendi pasaportu ve gerekiyorsa vizesi olmalıdır."]],
   ["Yanınıza almanız gereken belgeler",["Tıbbi raporlarınızın asıllarını veya onaylı kopyalarını, görüntüleme kayıtlarınızı (CD veya USB) ve ilaçlarınızın listesini yanınıza alın. Önemli belgelerin dijital kopyalarını telefonunuzda da saklayın."]],
   ["İlaçlar ve sigorta",["Düzenli kullandığınız ilaçları reçeteleriyle birlikte, orijinal kutularında ve tedavi süresine yetecek miktarda taşıyın. Seyahat sağlık sigortanızın kapsamını ve tedavi masraflarının nasıl ödeneceğini yola çıkmadan netleştirin."]],
   ["Uçuş ve varış",["Uçuşa uygunluğunuzu doktorunuza danışın; gerekirse havayolundan tekerlekli sandalye veya özel destek isteyin. Esenboğa Havalimanı'nda sizi karşılarız; uçuş bilgilerinizi bizimle paylaşmanız yeterli."]]],
  "links":[["Türkiye e-Vize resmî sitesi","https://www.evisa.gov.tr"],["T.C. Dışişleri Bakanlığı","https://www.mfa.gov.tr"]]},
],
"en": [
 {"slug":"cancer-treatment-in-ankara","title":"Cancer treatment in Ankara: a step-by-step guide for international patients",
  "desc":"For patients and families travelling to Ankara for cancer treatment: the process from application to follow-up care.",
  "intro":"This guide is for patients and families considering travelling to Ankara for cancer treatment. It explains the steps, the documents you need and how decisions are made, in plain language.",
  "sections":[
   ["The process in brief",["It starts with a specialist doctor reviewing your medical records. After the doctor's assessment, we plan appointments, accommodation and transport; treatment then takes place at a hospital in Ankara according to the plan recommended by the doctor who examines you. After you return home, we follow up your reports and check-ups.","Your coordinator is your single point of contact throughout, arranging hospital, accommodation, transfer and interpreter details on your behalf."]],
   ["Which documents do I need?",["For a first review, doctors usually ask for your latest discharge summary or doctor's report, pathology (biopsy) report, imaging reports such as MRI, CT or PET, recent blood test results and a list of your current medications.","The scan images themselves (DICOM files) may matter to the doctor; your coordinator will tell you how to send them. If your documents are not in Turkish or English, translation may be needed, and we'll tell you which ones."]],
   ["Doctor's assessment and treatment plan",["All decisions about diagnosis and treatment are made by the specialist. A review based on documents is a starting point; the final plan often becomes clear after examinations and tests in Ankara, so the first plan may change.","We pass on the doctor's questions and recommendations in your language and help you prepare your own questions for consultations."]],
   ["During treatment in Ankara",["We meet you at the airport and settle you into accommodation close to the hospital. Your consultations, tests and treatment are planned in one schedule, with interpreter support at the hospital.","Your companion is included in accommodation and transport plans. Rules for companions inside hospitals vary, and we'll explain them in advance."]],
   ["Follow-up after treatment",["Before discharge, we make sure you receive your discharge summary and treatment reports. After you return home, we follow up your check-ups, forward new test results to the doctor and, if needed, support communication with your local doctor."]]],
  "links":[]},
 {"slug":"ankara-guide-for-families","title":"Ankara guide for families: accommodation, getting around and daily life",
  "desc":"Practical information for people accompanying a relative during treatment in Ankara: choosing accommodation, transport and daily life.",
  "intro":"Accompanying a loved one through treatment is both an emotional and a practical responsibility. This guide brings together practical information to make your time in Ankara easier.",
  "sections":[
   ["Choosing accommodation",["Being close to the hospital matters most; short journeys on treatment days are easier for everyone. Lift access, a quiet setting, a small kitchen and enough space for the companion also make a difference.","We choose accommodation with you based on the treatment schedule and your needs."]],
   ["Getting around",["We arrange transfers between the airport, your accommodation and the hospital. Esenboğa Airport lies north of the city centre, so pick-up is arranged in advance.","Ankara has metro, bus and taxi services for getting around the city. On treatment days we recommend using the planned transfer."]],
   ["Daily life and staying in touch",["A local SIM card or eSIM on arrival makes communication easier. You'll find pharmacies, shops and places to eat near hospitals; mosques and halal food are easy to find in Ankara.","Save your coordinator's number in your phone and message them about anything you need in the city."]],
   ["Look after yourself too",["Make time to rest and eat well on long treatment days. If possible, share the role of companion with another family member. Tell your coordinator if you feel tired or alone, and we'll think together about what could help."]]],
  "links":[]},
 {"slug":"travelling-to-turkiye-for-treatment","title":"Travelling to Türkiye for treatment: visas, passports and what to bring",
  "desc":"A preparation checklist for patients and companions travelling to Türkiye for treatment: visas, passports, medical documents and medication.",
  "intro":"A journey for treatment is much easier with good preparation. This guide lists what to check before you travel. Visa rules depend on your country and can change, so always confirm with official sources.",
  "sections":[
   ["Do I need a visa?",["It depends on your nationality. Some citizens are visa-exempt, some can apply online through the official e-Visa system, and others need to apply at a consulate.","For treatment-related applications, a consulate may ask for an appointment or invitation letter from the hospital. After you apply, we'll check together which letter you need."]],
   ["Passport and companion",["Check your passport's validity against consulate requirements and allow for treatment taking longer than planned. Your companion also needs their own passport and, if required, a visa."]],
   ["Documents to bring",["Bring the originals or certified copies of your medical reports, your imaging records (CD or USB) and a list of your medications. Keep digital copies of important documents on your phone as well."]],
   ["Medication and insurance",["Carry your regular medications with their prescriptions, in original packaging and in sufficient quantity for the whole stay. Before travelling, confirm what your travel health insurance covers and how treatment costs will be paid."]],
   ["Flight and arrival",["Ask your doctor whether you are fit to fly, and request wheelchair or special assistance from the airline if needed. We'll meet you at Esenboğa Airport; just share your flight details with us."]]],
  "links":[["Official Türkiye e-Visa website","https://www.evisa.gov.tr"],["Ministry of Foreign Affairs of Türkiye","https://www.mfa.gov.tr"]]},
],
"ar": [
 {"slug":"cancer-treatment-in-ankara","title":"علاج السرطان في أنقرة: دليل خطوة بخطوة للمرضى الدوليين",
  "desc":"للمرضى وذويهم القادمين إلى أنقرة لعلاج السرطان: مسار الرحلة من تقديم الطلب حتى المتابعة بعد العلاج.",
  "intro":"أُعدّ هذا الدليل للمرضى وذويهم الذين يفكرون في القدوم إلى أنقرة لعلاج السرطان. يشرح بلغة واضحة خطوات الرحلة والمستندات المطلوبة وكيف تُتخذ القرارات.",
  "sections":[
   ["الرحلة باختصار",["تبدأ الرحلة بمراجعة طبيب مختص لمستنداتك الطبية. بعد تقييم الطبيب نخطط للمواعيد والإقامة والتنقل، ثم يجري العلاج في مستشفى بأنقرة وفق الخطة التي يوصي بها الطبيب الذي يفحصك. وبعد عودتك إلى بلدك نتابع تقاريرك ومواعيد المراجعة.","منسقك هو نقطة التواصل الوحيدة معك طوال الرحلة، ويتولى نيابةً عنك تفاصيل المستشفى والإقامة والنقل والترجمة."]],
   ["ما المستندات المطلوبة؟",["للمراجعة الأولى يطلب الأطباء عادةً: آخر ملخص خروج أو تقرير طبي، وتقرير علم الأمراض (الخزعة)، وتقارير التصوير مثل الرنين المغناطيسي أو الأشعة المقطعية أو PET، ونتائج تحاليل الدم الأخيرة، وقائمة الأدوية الحالية.","قد تكون ملفات الصور نفسها (DICOM) مهمة للطبيب، وسيخبرك منسقك بطريقة إرسالها. وإذا لم تكن مستنداتك بالتركية أو الإنجليزية فقد تحتاج إلى ترجمة، وسنخبرك بالمستندات التي تحتاج إلى ذلك."]],
   ["تقييم الطبيب وخطة العلاج",["جميع القرارات المتعلقة بالتشخيص والعلاج يتخذها الطبيب المختص. المراجعة المبنية على المستندات نقطة بداية، وكثيرًا ما تتضح الخطة النهائية بعد الفحوصات في أنقرة، لذا قد تتغير الخطة الأولى.","ننقل إليك أسئلة الطبيب وتوصياته بلغتك، ونساعدك على تحضير أسئلتك للمواعيد الطبية."]],
   ["أثناء العلاج في أنقرة",["نستقبلك في المطار ونرافقك إلى إقامة قريبة من المستشفى. تُنظَّم الفحوصات والمواعيد والعلاج في جدول واحد، مع دعم الترجمة في المستشفى.","يشمل التخطيط للإقامة والتنقل مرافقك أيضًا. وتختلف قواعد المرافقة داخل المستشفيات، وسنوضحها لك مسبقًا."]],
   ["المتابعة بعد العلاج",["قبل الخروج من المستشفى نتأكد من حصولك على ملخص الخروج وتقارير العلاج. وبعد عودتك إلى بلدك نتابع مواعيد المراجعة، ونرسل نتائج التحاليل الجديدة إلى الطبيب، وندعم التواصل مع طبيبك المحلي عند الحاجة."]]],
  "links":[]},
 {"slug":"ankara-guide-for-families","title":"دليل أنقرة لذوي المرضى: الإقامة والتنقل والحياة اليومية",
  "desc":"معلومات عملية لمن يرافق قريبه خلال العلاج في أنقرة: اختيار الإقامة والتنقل والحياة اليومية.",
  "intro":"مرافقة شخص عزيز خلال العلاج مسؤولية عاطفية وعملية في آن واحد. يجمع هذا الدليل معلومات عملية تسهّل عليك فترة إقامتك في أنقرة.",
  "sections":[
   ["عند اختيار الإقامة",["القرب من المستشفى هو الأهم، فالتنقل القصير في أيام العلاج أسهل على الجميع. ويُستحسن أيضًا توفر مصعد وبيئة هادئة ومطبخ صغير ومساحة كافية للمرافق.","نختار معك الإقامة المناسبة وفق جدول العلاج واحتياجاتك."]],
   ["التنقل في المدينة",["نرتّب التنقل بين المطار ومكان الإقامة والمستشفى. يقع مطار إسنبوغا شمال وسط المدينة، لذلك يُرتَّب الاستقبال مسبقًا.","تتوفر في أنقرة خدمات المترو والحافلات وسيارات الأجرة للتنقل داخل المدينة، وننصح باستخدام النقل المرتب في أيام العلاج."]],
   ["الحياة اليومية والتواصل",["شراء شريحة اتصال محلية أو eSIM عند الوصول يسهّل التواصل. تتوفر الصيدليات والمتاجر والمطاعم قرب المستشفيات، ومن السهل إيجاد المساجد والطعام الحلال في أنقرة.","احفظ رقم منسقك في هاتفك وراسله في أي شيء تحتاجه في المدينة."]],
   ["اعتنِ بنفسك أيضًا",["خصص وقتًا للراحة والتغذية الجيدة في أيام العلاج الطويلة، وإن أمكن تقاسم المرافقة مع فرد آخر من العائلة. أخبر منسقك إذا شعرت بالتعب أو الوحدة، وسنفكر معًا فيما يمكن أن يساعدك."]]],
  "links":[]},
 {"slug":"travelling-to-turkiye-for-treatment","title":"السفر إلى تركيا للعلاج: التأشيرة وجواز السفر وما تحتاج إلى إحضاره",
  "desc":"قائمة تحضير للمرضى والمرافقين القادمين إلى تركيا للعلاج: التأشيرة وجواز السفر والمستندات الطبية والأدوية.",
  "intro":"تكون رحلة العلاج أسهل بكثير مع التحضير الجيد. يسرد هذا الدليل ما يجب التحقق منه قبل السفر. تختلف قواعد التأشيرة حسب البلد وقد تتغير، فتحقّق دائمًا من المصادر الرسمية.",
  "sections":[
   ["هل أحتاج إلى تأشيرة؟",["يعتمد ذلك على جنسيتك؛ فبعض المواطنين معفون من التأشيرة، وبعضهم يمكنه التقديم عبر نظام التأشيرة الإلكترونية الرسمي، وآخرون يحتاجون إلى التقديم في القنصلية.","في طلبات العلاج قد تطلب القنصلية موعدًا أو خطاب دعوة من المستشفى، وبعد تقديم طلبك نتحقق معًا من الخطاب المطلوب."]],
   ["جواز السفر والمرافق",["تحقق من صلاحية جواز سفرك وفق متطلبات القنصلية، وضع في حسابك أن العلاج قد يستغرق وقتًا أطول. ويحتاج مرافقك أيضًا إلى جواز سفر خاص به وتأشيرة إذا لزم الأمر."]],
   ["المستندات التي تحضرها معك",["أحضر أصول تقاريرك الطبية أو نسخًا مصدقة منها، وسجلات التصوير (على قرص أو USB)، وقائمة أدويتك. واحتفظ بنسخ رقمية من المستندات المهمة على هاتفك أيضًا."]],
   ["الأدوية والتأمين",["احمل أدويتك المعتادة مع وصفاتها الطبية وفي عبواتها الأصلية وبكمية تكفي طوال الإقامة. وقبل السفر تأكد مما يغطيه تأمينك الصحي للسفر وكيف ستُدفع تكاليف العلاج."]],
   ["الرحلة والوصول",["استشر طبيبك حول قدرتك على السفر جوًا، واطلب من شركة الطيران كرسيًا متحركًا أو مساعدة خاصة عند الحاجة. سنستقبلك في مطار إسنبوغا، ويكفي أن تشاركنا تفاصيل رحلتك."]]],
  "links":[["الموقع الرسمي للتأشيرة الإلكترونية التركية","https://www.evisa.gov.tr"],["وزارة الخارجية التركية","https://www.mfa.gov.tr"]]},
],
"ru": [
 {"slug":"cancer-treatment-in-ankara","title":"Лечение рака в Анкаре: пошаговый путь для иностранных пациентов",
  "desc":"Для пациентов и их близких, приезжающих в Анкару на лечение рака: путь от заявки до наблюдения после лечения.",
  "intro":"Этот материал подготовлен для пациентов и их близких, которые рассматривают поездку в Анкару для лечения рака. Простым языком о том, из каких этапов состоит путь, какие документы нужны и как принимаются решения.",
  "sections":[
   ["Коротко о процессе",["Всё начинается с изучения Ваших медицинских документов профильным врачом. После его оценки мы планируем приёмы, проживание и трансфер; лечение проходит в клинике Анкары по плану, который предложит осматривающий Вас врач. После возвращения домой мы следим за заключениями и контрольными визитами.","Координатор — Ваше единое контактное лицо на всех этапах: он берёт на себя клинику, проживание, трансфер и переводчика."]],
   ["Какие документы нужны?",["Для первичной оценки врачи обычно просят: последнюю выписку или заключение врача, гистологическое заключение (биопсия), заключения МРТ, КТ или ПЭТ, свежие анализы крови и список принимаемых лекарств.","Сами снимки (файлы DICOM) могут быть важны для врача; координатор подскажет, как их передать. Если документы не на турецком или английском, может понадобиться перевод — мы скажем, какие именно."]],
   ["Оценка врача и план лечения",["Все решения о диагнозе и лечении принимает профильный врач. Оценка по документам — это отправная точка; окончательный план часто становится ясен после осмотра и обследований в Анкаре, поэтому первоначальный план может измениться.","Мы передаём Вам вопросы и рекомендации врача на Вашем языке и помогаем подготовить Ваши вопросы к консультациям."]],
   ["Во время лечения в Анкаре",["Мы встречаем Вас в аэропорту и размещаем рядом с клиникой. Консультации, обследования и лечение планируются в едином графике, в клинике работает переводчик.","Сопровождающий учитывается в плане проживания и поездок. Правила пребывания сопровождающих в клиниках различаются, и мы заранее о них расскажем."]],
   ["Наблюдение после лечения",["Перед выпиской мы проследим, чтобы Вы получили выписку и заключения. После возвращения домой мы следим за контрольными визитами, передаём врачу новые анализы и при необходимости помогаем в общении с Вашим местным врачом."]]],
  "links":[]},
 {"slug":"ankara-guide-for-families","title":"Анкара для близких пациента: проживание, транспорт и повседневная жизнь",
  "desc":"Практическая информация для тех, кто сопровождает близкого человека во время лечения в Анкаре.",
  "intro":"Сопровождать близкого во время лечения — это и эмоциональная, и практическая задача. Здесь собрана практическая информация, которая облегчит Ваше пребывание в Анкаре.",
  "sections":[
   ["Как выбрать жильё",["Главное — близость к клинике: короткая дорога в дни лечения легче для всех. Важны также лифт, тишина, небольшая кухня и место для сопровождающего.","Мы подбираем жильё вместе с Вами с учётом графика лечения и Ваших потребностей."]],
   ["Передвижение по городу",["Мы организуем трансферы между аэропортом, жильём и клиникой. Аэропорт Эсенбога находится к северу от центра города, поэтому встреча планируется заранее.","В Анкаре есть метро, автобусы и такси. В дни лечения рекомендуем пользоваться запланированным трансфером."]],
   ["Повседневная жизнь и связь",["Местная SIM-карта или eSIM по прибытии упростит связь. Рядом с клиниками есть аптеки, магазины и кафе; в Анкаре легко найти мечети и халяльную еду.","Сохраните номер координатора и пишите ему по любому вопросу в городе."]],
   ["Позаботьтесь и о себе",["В долгие дни лечения находите время на отдых и нормальное питание. По возможности делите роль сопровождающего с другим членом семьи. Если чувствуете усталость или одиночество, скажите координатору — вместе подумаем, что может помочь."]]],
  "links":[]},
 {"slug":"travelling-to-turkiye-for-treatment","title":"Поездка в Турцию на лечение: виза, паспорт и что взять с собой",
  "desc":"Что подготовить пациентам и сопровождающим перед поездкой в Турцию на лечение: виза, паспорт, медицинские документы и лекарства.",
  "intro":"Поездка на лечение проходит гораздо спокойнее при хорошей подготовке. Здесь перечислено, что проверить до выезда. Визовые правила зависят от страны и могут меняться, поэтому всегда сверяйтесь с официальными источниками.",
  "sections":[
   ["Нужна ли мне виза?",["Это зависит от гражданства. Граждане некоторых стран освобождены от визы, другие могут оформить её онлайн через официальную систему e-Visa, третьим нужно обращаться в консульство.","Для поездки на лечение консульство может запросить подтверждение записи или приглашение от клиники. После подачи заявки мы вместе уточним, какой документ нужен."]],
   ["Паспорт и сопровождающий",["Проверьте срок действия паспорта по требованиям консульства и учтите, что лечение может затянуться. Сопровождающему тоже нужен собственный паспорт и при необходимости виза."]],
   ["Какие документы взять",["Возьмите оригиналы или заверенные копии медицинских заключений, записи обследований (на диске или USB) и список лекарств. Сохраните цифровые копии важных документов в телефоне."]],
   ["Лекарства и страховка",["Везите постоянные лекарства с рецептами, в оригинальной упаковке и в количестве на всё пребывание. До поездки уточните, что покрывает Ваша туристическая медицинская страховка и как будут оплачиваться расходы на лечение."]],
   ["Перелёт и прибытие",["Уточните у врача, можно ли Вам лететь, и при необходимости закажите у авиакомпании кресло-коляску или помощь. Мы встретим Вас в аэропорту Эсенбога — просто сообщите нам данные рейса."]]],
  "links":[["Официальный сайт электронной визы Турции","https://www.evisa.gov.tr"],["МИД Турецкой Республики","https://www.mfa.gov.tr"]]},
],
}

# ---------------------------------------------------------------- KVKK / gizlilik taslağı
# {legal_name}, {address}, {email}, {phone}, {mersis}, {kep} sitede ayarlardan doldurulur.
PRIVACY = {
"tr":{"title":"Kişisel Verilerin Korunması Aydınlatma Metni","slug":"kvkk",
 "intro":"Bu metin, 6698 sayılı Kişisel Verilerin Korunması Kanunu (KVKK) madde 10 ve Avrupa Birliği Genel Veri Koruma Tüzüğü (GDPR) kapsamında, kişisel verilerinizin {legal_name} (\"Ankara Sağlık Turizmi\") tarafından nasıl işlendiğini açıklamak için hazırlanmıştır.",
 "sections":[
  ["Veri sorumlusu",["{legal_name} · Adres: {address} · E-posta: {email} · Telefon: {phone} · MERSİS: {mersis} · KEP: {kep}"]],
  ["İşlenen kişisel veriler",["Kimlik ve iletişim bilgileri (ad, ülke, telefon, e-posta); sağlık verileri (tanı, tıbbi raporlar, tedavi geçmişi gibi özel nitelikli kişisel veriler); seyahat ve konaklama bilgileri; bizimle yaptığınız yazışmaların içeriği."]],
  ["İşleme amaçları",["Tedavi sürecinizin koordinasyonu; değerlendirme için anlaşmalı hastane ve hekimlerle paylaşım; randevu, konaklama, transfer ve tercüman organizasyonu; sizinle iletişim; yasal yükümlülüklerin yerine getirilmesi."]],
  ["Hukuki sebepler",["Sağlık verileriniz açık rızanıza dayanılarak ve kanunda öngörülen diğer hallerde işlenir. Diğer kişisel verileriniz, sözleşmenin kurulması ve ifası, hukuki yükümlülüklerin yerine getirilmesi ve temel hak ve özgürlüklerinize zarar vermemek kaydıyla meşru menfaatlerimiz kapsamında işlenir."]],
  ["Aktarım",["Verileriniz yalnızca amaç için gerekli olduğu ölçüde anlaşmalı hastane ve hekimlere, konaklama, transfer ve tercüman hizmeti sağlayanlara ve yetkili kamu kurumlarına aktarılabilir. Bizimle iletişim için kullandığınız WhatsApp, Telegram, Instagram veya Messenger gibi mesajlaşma hizmetlerinin sunucuları yurt dışında bulunabilir; bu aktarımlar KVKK madde 9'daki kurallara uygun olarak yapılır."]],
  ["Toplama yöntemi",["Kişisel verileriniz web sitemizdeki ön başvuru formu, telefon, mesajlaşma uygulamaları, e-posta ve yüz yüze görüşmeler aracılığıyla toplanır. Ön başvuru formuna girdiğiniz bilgiler web sitemizde saklanmaz; seçtiğiniz mesajlaşma uygulamasıyla tarafımıza iletilir."]],
  ["Saklama süresi",["Verileriniz işleme amacının gerektirdiği süre ve ilgili mevzuattaki saklama süreleri boyunca saklanır; süre sonunda silinir, yok edilir veya anonim hale getirilir."]],
  ["Haklarınız",["KVKK madde 11 uyarınca kişisel verilerinizin işlenip işlenmediğini öğrenme, işlenmişse bilgi talep etme, işlenme amacını ve amacına uygun kullanılıp kullanılmadığını öğrenme, aktarıldığı üçüncü kişileri bilme, eksik veya yanlış işlenmişse düzeltilmesini, şartları oluşmuşsa silinmesini veya yok edilmesini isteme, bu işlemlerin aktarılan üçüncü kişilere bildirilmesini isteme, otomatik sistemlerle analiz sonucu aleyhinize bir sonuca itiraz etme ve kanuna aykırı işleme nedeniyle zarara uğramanız halinde zararın giderilmesini talep etme haklarına sahipsiniz. Açık rızanızı her zaman geri alabilirsiniz."]],
  ["Başvuru",["Taleplerinizi {email} adresine e-posta ile veya {address} adresine yazılı olarak iletebilirsiniz. Başvurunuz en geç 30 gün içinde sonuçlandırılır."]],
  ["Web sitesi",["Web sitemiz ön başvuru bilgilerinizi kaydetmez. Ziyaretçi ölçümü yapılıyorsa, çerez kullanan araçlar yalnızca onayınızla çalışır."]]]},
"en":{"title":"Privacy Notice","slug":"privacy",
 "intro":"This notice explains how {legal_name} (\"Ankara Sağlık Turizmi\") processes your personal data under Article 10 of Turkish Law No. 6698 on the Protection of Personal Data (KVKK) and the EU General Data Protection Regulation (GDPR). The Turkish version prevails.",
 "sections":[
  ["Data controller",["{legal_name} · Address: {address} · Email: {email} · Phone: {phone} · MERSIS: {mersis} · KEP: {kep}"]],
  ["Personal data we process",["Identity and contact details (name, country, phone, email); health data (special category data such as diagnosis, medical reports and treatment history); travel and accommodation details; the content of your messages to us."]],
  ["Purposes",["Coordinating your treatment; sharing your records with partner hospitals and doctors for assessment; arranging appointments, accommodation, transfers and interpreters; communicating with you; meeting legal obligations."]],
  ["Legal grounds",["Health data is processed on the basis of your explicit consent and in other cases provided by law. Other personal data is processed to enter into and perform a contract, to meet legal obligations, and for our legitimate interests provided they do not override your fundamental rights and freedoms."]],
  ["Transfers",["Your data may be shared, only as far as necessary, with partner hospitals and doctors, providers of accommodation, transfer and interpreter services, and competent public authorities. Messaging services you use to contact us, such as WhatsApp, Telegram, Instagram or Messenger, may store data on servers outside Türkiye; such transfers follow Article 9 of the KVKK."]],
  ["How we collect data",["Through the pre-application form on our website, phone calls, messaging apps, email and face-to-face meetings. Information entered in the pre-application form is not stored on our website; it is sent to us through the messaging app you choose."]],
  ["Retention",["We keep your data for as long as the purpose requires and as required by law, after which it is deleted, destroyed or anonymised."]],
  ["Your rights",["Under Article 11 of the KVKK and the GDPR, you may ask whether your data is processed, request information, learn the purpose and recipients, request correction, deletion or restriction, object to decisions based solely on automated processing, and claim compensation for unlawful processing. You may withdraw your consent at any time."]],
  ["Contact",["Send your request by email to {email} or in writing to {address}. We respond within 30 days at the latest."]],
  ["Website",["Our website does not store your pre-application details. If visitor analytics is used, tools that set cookies run only with your consent."]]]},
"ar":{"title":"إشعار الخصوصية","slug":"privacy",
 "intro":"يوضح هذا الإشعار كيف يعالج {legal_name} (\"Ankara Sağlık Turizmi\") بياناتك الشخصية وفق المادة 10 من القانون التركي رقم 6698 لحماية البيانات الشخصية (KVKK) واللائحة الأوروبية العامة لحماية البيانات (GDPR). يُعتمد النص التركي عند الاختلاف.",
 "sections":[
  ["المسؤول عن البيانات",["{legal_name} · العنوان: {address} · البريد الإلكتروني: {email} · الهاتف: {phone} · MERSİS: {mersis} · KEP: {kep}"]],
  ["البيانات التي نعالجها",["بيانات الهوية والتواصل (الاسم، البلد، الهاتف، البريد الإلكتروني)؛ البيانات الصحية (بيانات ذات طبيعة خاصة مثل التشخيص والتقارير الطبية وتاريخ العلاج)؛ بيانات السفر والإقامة؛ محتوى رسائلك إلينا."]],
  ["الأغراض",["تنسيق رحلة علاجك؛ مشاركة مستنداتك مع المستشفيات والأطباء المتعاقدين للتقييم؛ ترتيب المواعيد والإقامة والنقل والترجمة؛ التواصل معك؛ الوفاء بالالتزامات القانونية."]],
  ["الأسس القانونية",["تُعالج البيانات الصحية بناءً على موافقتك الصريحة وفي الحالات الأخرى التي ينص عليها القانون. وتُعالج البيانات الأخرى لإبرام العقد وتنفيذه، والوفاء بالالتزامات القانونية، ولمصالحنا المشروعة بشرط ألا تمس حقوقك وحرياتك الأساسية."]],
  ["نقل البيانات",["قد تُشارَك بياناتك بالقدر الضروري فقط مع المستشفيات والأطباء المتعاقدين، ومقدمي خدمات الإقامة والنقل والترجمة، والجهات الرسمية المختصة. وقد تحفظ خدمات المراسلة التي تستخدمها للتواصل معنا، مثل واتساب وتيليغرام وإنستغرام وماسنجر، البيانات على خوادم خارج تركيا، وتجري هذه العمليات وفق المادة 9 من القانون."]],
  ["طريقة جمع البيانات",["عبر نموذج الطلب المسبق في موقعنا، والهاتف، وتطبيقات المراسلة، والبريد الإلكتروني، واللقاءات المباشرة. لا تُحفظ المعلومات التي تدخلها في النموذج على موقعنا، بل تُرسل إلينا عبر تطبيق المراسلة الذي تختاره."]],
  ["مدة الحفظ",["نحفظ بياناتك طوال المدة التي يتطلبها الغرض والمدد القانونية، ثم تُحذف أو تُتلف أو تُجعل مجهولة الهوية."]],
  ["حقوقك",["وفق المادة 11 من القانون واللائحة الأوروبية يحق لك معرفة ما إذا كانت بياناتك تُعالج، وطلب المعلومات، ومعرفة الغرض والجهات المستلمة، وطلب التصحيح أو الحذف أو التقييد، والاعتراض على القرارات المبنية على المعالجة الآلية وحدها، والمطالبة بالتعويض عن المعالجة غير المشروعة. ويمكنك سحب موافقتك في أي وقت."]],
  ["التواصل",["أرسل طلبك عبر البريد الإلكتروني إلى {email} أو كتابيًا إلى {address}. نرد خلال 30 يومًا كحد أقصى."]],
  ["الموقع الإلكتروني",["لا يحفظ موقعنا بيانات طلبك المسبق. وإذا استُخدم قياس الزوار، فلا تعمل الأدوات التي تستخدم ملفات تعريف الارتباط إلا بموافقتك."]]]},
"ru":{"title":"Политика конфиденциальности","slug":"privacy",
 "intro":"Здесь описано, как {legal_name} (\"Ankara Sağlık Turizmi\") обрабатывает Ваши персональные данные в соответствии со статьёй 10 турецкого Закона № 6698 о защите персональных данных (KVKK) и Общим регламентом ЕС по защите данных (GDPR). Приоритет имеет текст на турецком языке.",
 "sections":[
  ["Оператор данных",["{legal_name} · Адрес: {address} · Эл. почта: {email} · Телефон: {phone} · MERSİS: {mersis} · KEP: {kep}"]],
  ["Какие данные мы обрабатываем",["Идентификационные и контактные данные (имя, страна, телефон, эл. почта); медицинские данные (данные особой категории: диагноз, медицинские заключения, история лечения); сведения о поездке и проживании; содержание Ваших сообщений нам."]],
  ["Цели обработки",["Организация лечения; передача документов партнёрским клиникам и врачам для оценки; организация приёмов, проживания, трансферов и перевода; связь с Вами; выполнение требований закона."]],
  ["Правовые основания",["Медицинские данные обрабатываются на основании Вашего явного согласия и в других случаях, предусмотренных законом. Прочие данные обрабатываются для заключения и исполнения договора, выполнения требований закона и в наших законных интересах, если они не нарушают Ваши основные права и свободы."]],
  ["Передача данных",["Данные передаются только в необходимом объёме партнёрским клиникам и врачам, поставщикам услуг проживания, трансфера и перевода, а также уполномоченным государственным органам. Мессенджеры, через которые Вы с нами связываетесь (WhatsApp, Telegram, Instagram, Messenger), могут хранить данные на серверах за пределами Турции; такая передача осуществляется в соответствии со статьёй 9 KVKK."]],
  ["Способы сбора",["Через форму предварительной заявки на сайте, по телефону, в мессенджерах, по эл. почте и при личных встречах. Данные из формы заявки не хранятся на сайте — они отправляются нам через выбранный Вами мессенджер."]],
  ["Срок хранения",["Мы храним данные столько, сколько требует цель обработки и законодательство, после чего они удаляются, уничтожаются или обезличиваются."]],
  ["Ваши права",["Согласно статье 11 KVKK и GDPR Вы вправе узнать, обрабатываются ли Ваши данные, запросить сведения о них, узнать цель и получателей, потребовать исправления, удаления или ограничения обработки, возразить против решений, принятых исключительно автоматически, и потребовать возмещения ущерба при незаконной обработке. Согласие можно отозвать в любой момент."]],
  ["Контакты",["Направьте запрос на {email} или письменно по адресу {address}. Мы отвечаем не позднее чем через 30 дней."]],
  ["Сайт",["Сайт не хранит данные Вашей предварительной заявки. Если используется веб-аналитика, инструменты с cookie работают только с Вашего согласия."]]]},
}

for L in T:
    T[L].update(UI[L])
    T[L]["guides"] = GUIDES[L]
    T[L]["privacy"] = PRIVACY[L]
