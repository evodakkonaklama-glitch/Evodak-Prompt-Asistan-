# Ankara Sağlık Turizmi web sitesi · içerik ve ayarlar
# Boş bırakılan ayar sitede gösterilmez. Değiştirdikten sonra: python3 site/kaynak/olustur.py

DATA = {
    "base_url": "https://evodakkonaklama-glitch.github.io/Evodak-Prompt-Asistan-/site/",  # kendi alan adınıza taşıyınca değiştirin
    "whatsapp": "905492856005",
    "phone_display": "+90 549 285 60 05",
    "phone_tel": "+905492856005",
    "email": "",
    "instagram": "",          # kullanıcı adı, @ olmadan
    "facebook": "",           # sayfa kullanıcı adı
    "telegram": "",
    "license_no": "",         # Sağlık Bakanlığı Uluslararası Sağlık Turizmi Yetki Belgesi No
    "privacy_url": "",        # KVKK aydınlatma metni
    "apply_url": "https://evodakkonaklama-glitch.github.io/Evodak-Prompt-Asistan-/paneller/ankara-saglik-turizmi.html",  # ön başvuru formu
    # Yalnızca yazılı tanıtım izni olan kurumlar: {"name": "...", "note": {"tr": "...", "en": "...", "ar": "...", "ru": "..."}}
    "partners": [],
}

LANGS = ["tr", "en", "ar", "ru"]

T = {
"tr": {
"html_lang":"tr","dir":"ltr","locale":"tr_TR","lang_name":"Türkçe",
"meta_title":"Ankara Sağlık Turizmi · Ankara'da tedavi koordinasyonu",
"meta_desc":"Kanser tedavisi için Ankara'ya gelen hastalar ve yakınları için karşılama, konaklama, hastane ve hekim randevuları, tercüman ve tedavi sonrası takip. Ofis: Balgat, Çankaya.",
"skip":"İçeriğe geç","menu":"Menü","nav_services":"Hizmetler","nav_process":"Süreç","nav_faq":"SSS","nav_contact":"İletişim","call":"Hemen arayın",
"hero_eyebrow":"Balgat, Çankaya · Ankara",
"hero_h1":"Ankara'daki tedavi sürecinizi baştan sona biz koordine edelim",
"hero_sub":"Kanser tedavisi için Ankara'ya gelen hastalar ve yakınları için havalimanında karşılamadan hastane randevularına, konaklamadan tercümana kadar her adımda tek bir koordinatör yanınızda.",
"cta_apply":"Ön başvuru yapın","cta_wa":"WhatsApp'tan yazın",
"chips":["Tek koordinatör, tek iletişim noktası","İngilizce, Arapça, Rusça ve Türkçe iletişim","Tedavi kararı her zaman hekiminizde"],
"journey_title":"Tedavi yolculuğunuz","journey_sub":"Her adımda koordinatörünüz yanınızda",
"journey":["Ön başvuru","Dosya incelemesi","Hastane ve hekim","Karşılama ve konaklama","Tedavi süreci","Takip"],
"services_h":"Neleri sizin için üstleniyoruz",
"services_lead":"Tedaviye odaklanabilmeniz için sağlık dışındaki ayrıntıları biz planlıyoruz. Tıbbi kararları ise her zaman hekiminiz verir.",
"services":[
 ["Ön değerlendirme koordinasyonu","Tıbbi belgelerinizi uygun hastane ve uzman hekime iletiyor, değerlendirme sürecini sizin adınıza takip ediyoruz."],
 ["Hastane ve hekim randevuları","Ankara'daki özel hastanelerle muayene, tetkik ve tedavi takviminizi koordine ediyoruz."],
 ["Karşılama ve transfer","Havalimanında karşılama ile konaklama ve hastane arasındaki ulaşımı planlıyoruz."],
 ["Hasta ve refakatçi konaklaması","Hastaneye yakın, ihtiyacınıza uygun konaklama seçenekleri sunuyoruz."],
 ["Tercüman ve rehberlik","Muayene ve görüşmelerde dil desteği sağlıyor, şehirde ihtiyaç duyduğunuz her konuda yol gösteriyoruz."],
 ["Tedavi sonrası takip","Ülkenize döndükten sonra raporlarınızı, kontrol randevularınızı ve hekiminizle iletişimi takip ediyoruz."]],
"process_h":"Süreç nasıl işler?","process_lead":"İlk mesajınızdan tedavi sonrası takibe kadar her adımda ne olacağını bilirsiniz.",
"process":[
 ["Ön başvuru","Formu doldurun veya WhatsApp'tan yazın, belgelerinizi sohbete ekleyin."],
 ["Dosya incelemesi","Koordinatörünüz sizi arar; eksik belge varsa birlikte tamamlarız."],
 ["Hastane ve hekim","Dosyanız, izninizle, uygun hastane ve uzman hekime iletilir; hekim değerlendirmesi size aktarılır."],
 ["Planlama","Randevu, konaklama, transfer ve tercüman tarihleriniz netleşir."],
 ["Ankara'da tedavi","Karşılamadan taburculuğa kadar koordinatörünüz yanınızdadır."],
 ["Takip","Raporlarınız ve kontrol randevularınız ülkenize döndükten sonra da takip edilir."]],
"onc_h":"Kanser tedavisinde yanınızdayız",
"onc_p":["Kanser tanısı hasta kadar ailesini de etkiler. Yabancı bir şehirde hastane, dil ve konaklama ayrıntılarıyla uğraşmak bu yükü artırır. Biz bu ayrıntıları üstlenerek sizin ve yakınlarınızın tedaviye odaklanmasına yardımcı oluyoruz.",
          "Hangi tedavinin uygulanacağına her zaman sizi muayene eden hekim karar verir. Bizim işimiz, bu sürecin her adımını sizin için düzenli, anlaşılır ve ulaşılabilir kılmaktır."],
"onc_items":["Tetkik, muayene ve tedavi randevularınız tek takvimde","Hekim görüşmelerinde tercüman desteği","Hasta yakınları için konaklama ve günlük yaşam desteği"],
"city_h":"Neden Ankara, neden Balgat?",
"city_p":"Ankara, Türkiye'nin başkenti ve çok sayıda özel ve üniversite hastanesine ev sahipliği yapan bir sağlık merkezidir. Ofisimiz Çankaya'nın Balgat semtindedir; şehir merkezine ve pek çok hastaneye kolayca ulaşılan bir konumdadır.",
"city_items":["Esenboğa Havalimanı'nda karşılama ve transfer","Hastanelere yakın konaklama seçenekleri","Ofisimizde yüz yüze görüşme imkânı"],
"family_h":"Yola çıkmadan önce hazırlık listesi","family_lead":"Şunları hazırlamanız süreci hızlandırır:",
"family":["Pasaport ve gerekiyorsa vize","Epikriz, patoloji ve görüntüleme raporları","Son kan tahlili sonuçları","Kullanılan ilaçların listesi ve yeterli miktarda ilaç","Refakatçinin kimlik ve iletişim bilgileri"],
"visa_note":"Vize koşulları ülkeden ülkeye değişir; başvurunuzdan sonra size güncel bilgi veririz.",
"partners_h":"Anlaşmalı kurumlarımız","partners_note":"Kurum bilgileri, ilgili kurumun onayıyla yayımlanmıştır.",
"faq_h":"Sık sorulan sorular",
"faqs":[
 ["Tedavi ücreti ne kadar?","Ücret, tanıya ve hekimin önereceği tedavi planına göre değişir. Belgeleriniz incelenip hekim değerlendirmesi yapıldıktan sonra size kişiye özel bilgi verilir."],
 ["Belgelerimi nasıl gönderirim?","Ön başvuru formunu doldurduktan sonra WhatsApp'ta açılan sohbetimize belgelerinizin fotoğrafını veya PDF'ini ekleyebilirsiniz. Web sitesine dosya yüklemeniz gerekmez."],
 ["Ne kadar sürede dönüş yapıyorsunuz?","Başvurunuz koordinatörümüz tarafından en kısa sürede incelenir ve seçtiğiniz kanaldan sizinle iletişime geçilir."],
 ["Tercüman desteği var mı?","Evet. Hastane görüşmelerinde ve günlük ihtiyaçlarınızda dil desteği planlıyoruz. Hangi dilde destek istediğinizi başvurunuzda belirtmeniz yeterli."],
 ["Refakatçim benimle kalabilir mi?","Konaklama planı refakatçinizi de kapsayacak şekilde hazırlanır. Hastanedeki refakatçi kuralları kuruma göre değişir; size önceden bilgi veririz."],
 ["Tedaviye kim karar veriyor?","Tanı ve tedaviye ilişkin tüm kararları sizi muayene eden hekim verir. Biz tıbbi değerlendirme yapmayız; sürecin organizasyonunu üstleniriz."]],
"band_h":"Başvurunuzu 2 dakikada hazırlayın","band_p":"Bilgilerinizi girin, belgelerinizi WhatsApp'tan gönderin; koordinatörünüz sizi arasın.",
"contact_h":"İletişim","contact_lead":"Size en uygun kanaldan ulaşın. Acil bir sağlık sorununda bulunduğunuz ülkenin acil numarasını arayın.",
"c_phone":"Telefon","c_wa":"WhatsApp","c_office":"Ofis","office_val":"Balgat, Çankaya / Ankara","c_email":"E-posta",
"footer_disc":"Bu sitedeki bilgiler genel bilgilendirme amaçlıdır ve tıbbi tavsiye yerine geçmez. Tanı ve tedavi kararlarını hekiminiz verir.",
"license_lbl":"Uluslararası Sağlık Turizmi Yetki Belgesi No","privacy_lbl":"KVKK Aydınlatma Metni","rights":"Tüm hakları saklıdır.",
"mob_call":"Ara","mob_wa":"WhatsApp","mob_apply":"Başvuru",
"wa_text":"Merhaba, Ankara'da tedavi süreci hakkında bilgi almak istiyorum.",
},
"en": {
"html_lang":"en","dir":"ltr","locale":"en_GB","lang_name":"English",
"meta_title":"Ankara Sağlık Turizmi · Treatment coordination in Ankara",
"meta_desc":"For patients and families travelling to Ankara for cancer treatment: airport pick-up, accommodation, hospital and doctor appointments, interpreters and follow-up care. Office in Balgat, Çankaya.",
"skip":"Skip to content","menu":"Menu","nav_services":"Services","nav_process":"How it works","nav_faq":"FAQ","nav_contact":"Contact","call":"Call us now",
"hero_eyebrow":"Balgat, Çankaya · Ankara",
"hero_h1":"Let us coordinate your treatment in Ankara from start to finish",
"hero_sub":"For patients and families coming to Ankara for cancer treatment, one coordinator stays with you at every step, from airport pick-up and hospital appointments to accommodation and interpreters.",
"cta_apply":"Start your application","cta_wa":"Message us on WhatsApp",
"chips":["One coordinator, one point of contact","English, Arabic, Russian and Turkish","Treatment decisions always rest with your doctor"],
"journey_title":"Your treatment journey","journey_sub":"Your coordinator is with you at every step",
"journey":["Pre-application","File review","Hospital and doctor","Arrival and stay","Treatment","Follow-up"],
"services_h":"What we take care of for you",
"services_lead":"We plan every non-medical detail so you can focus on treatment. Medical decisions are always made by your doctor.",
"services":[
 ["Pre-assessment coordination","We forward your medical records to a suitable hospital and specialist and follow the review on your behalf."],
 ["Hospital and doctor appointments","We coordinate your consultations, tests and treatment schedule with private hospitals in Ankara."],
 ["Airport pick-up and transfers","We meet you at the airport and plan all travel between your accommodation and the hospital."],
 ["Accommodation for patient and companion","We offer accommodation close to the hospital that suits your needs."],
 ["Interpreters and guidance","We provide language support in consultations and help with anything you need in the city."],
 ["Follow-up after treatment","After you return home, we keep track of your reports, check-ups and communication with your doctor."]],
"process_h":"How it works","process_lead":"From your first message to follow-up care, you always know what happens next.",
"process":[
 ["Pre-application","Fill in the form or message us on WhatsApp and attach your documents in the chat."],
 ["File review","Your coordinator calls you, and we complete any missing documents together."],
 ["Hospital and doctor","With your permission, your file goes to a suitable hospital and specialist, and we pass the doctor's review on to you."],
 ["Planning","Your appointment, accommodation, transfer and interpreter dates are confirmed."],
 ["Treatment in Ankara","Your coordinator is with you from arrival to discharge."],
 ["Follow-up","Your reports and check-ups are followed up after you return home."]],
"onc_h":"With you through cancer treatment",
"onc_p":["A cancer diagnosis affects the whole family, not only the patient. Dealing with hospitals, language and accommodation in an unfamiliar city adds to that weight. We take on these details so that you and your family can focus on treatment.",
          "The doctor who examines you always decides which treatment is right. Our job is to make every step of the process organised, clear and easy to reach."],
"onc_items":["Tests, consultations and treatment in one schedule","Interpreter support in doctor consultations","Accommodation and day-to-day help for families"],
"city_h":"Why Ankara, why Balgat?",
"city_p":"Ankara is Türkiye's capital and a healthcare centre with many private and university hospitals. Our office is in Balgat, Çankaya, within easy reach of the city centre and many hospitals.",
"city_items":["Pick-up and transfer from Esenboğa Airport","Accommodation close to hospitals","Face-to-face meetings at our office"],
"family_h":"Checklist before you travel","family_lead":"Preparing these in advance speeds things up:",
"family":["Passport and visa if required","Discharge summary, pathology and imaging reports","Recent blood test results","List of current medications and enough supply","Companion's ID and contact details"],
"visa_note":"Visa requirements vary by country; we'll give you up-to-date information after you apply.",
"partners_h":"Our partner institutions","partners_note":"Institution details are published with each institution's approval.",
"faq_h":"Frequently asked questions",
"faqs":[
 ["How much does treatment cost?","The cost depends on the diagnosis and the treatment plan your doctor recommends. Once your documents have been reviewed and a doctor has assessed them, you'll receive personalised information."],
 ["How do I send my documents?","After filling in the pre-application form, attach photos or PDFs of your documents in the WhatsApp chat that opens with us. You don't need to upload files to the website."],
 ["How quickly will you reply?","A coordinator reviews your application as soon as possible and contacts you through the channel you chose."],
 ["Do you provide interpreters?","Yes. We arrange language support for hospital consultations and day-to-day needs. Just tell us in your application which language you need."],
 ["Can my companion stay with me?","Your accommodation plan includes your companion. Rules for companions inside hospitals vary by institution, and we'll let you know in advance."],
 ["Who decides on treatment?","All decisions about diagnosis and treatment are made by the doctor who examines you. We don't make medical assessments; we organise the process."]],
"band_h":"Prepare your application in 2 minutes","band_p":"Enter your details, send your documents on WhatsApp, and your coordinator will call you.",
"contact_h":"Contact","contact_lead":"Reach us through the channel that suits you. In a medical emergency, call the emergency number in your country.",
"c_phone":"Phone","c_wa":"WhatsApp","c_office":"Office","office_val":"Balgat, Çankaya / Ankara","c_email":"Email",
"footer_disc":"The information on this website is for general guidance and is not medical advice. Diagnosis and treatment decisions are made by your doctor.",
"license_lbl":"International Health Tourism Authorisation No","privacy_lbl":"Privacy notice","rights":"All rights reserved.",
"mob_call":"Call","mob_wa":"WhatsApp","mob_apply":"Apply",
"wa_text":"Hello, I'd like information about treatment in Ankara.",
},
"ar": {
"html_lang":"ar","dir":"rtl","locale":"ar_AR","lang_name":"العربية",
"meta_title":"Ankara Sağlık Turizmi · تنسيق العلاج في أنقرة",
"meta_desc":"للمرضى وذويهم القادمين إلى أنقرة لعلاج السرطان: الاستقبال في المطار، الإقامة، مواعيد المستشفيات والأطباء، الترجمة والمتابعة بعد العلاج. مكتبنا في بالغات، تشانكايا.",
"skip":"انتقل إلى المحتوى","menu":"القائمة","nav_services":"خدماتنا","nav_process":"خطوات العمل","nav_faq":"الأسئلة الشائعة","nav_contact":"تواصل معنا","call":"اتصل بنا الآن",
"hero_eyebrow":"بالغات، تشانكايا · أنقرة",
"hero_h1":"دعنا ننسّق رحلة علاجك في أنقرة من البداية إلى النهاية",
"hero_sub":"للمرضى وذويهم القادمين إلى أنقرة لعلاج السرطان، يرافقك منسق واحد في كل خطوة: من الاستقبال في المطار ومواعيد المستشفى إلى الإقامة والترجمة.",
"cta_apply":"قدّم طلبك المسبق","cta_wa":"راسلنا عبر واتساب",
"chips":["منسق واحد ونقطة تواصل واحدة","العربية والإنجليزية والروسية والتركية","قرار العلاج يعود دائمًا إلى طبيبك"],
"journey_title":"رحلة علاجك","journey_sub":"منسقك معك في كل خطوة",
"journey":["الطلب المسبق","مراجعة الملف","المستشفى والطبيب","الاستقبال والإقامة","العلاج","المتابعة"],
"services_h":"ما نتولاه عنك",
"services_lead":"نخطط لكل التفاصيل غير الطبية لتتفرغ لعلاجك، أما القرارات الطبية فيتخذها طبيبك دائمًا.",
"services":[
 ["تنسيق التقييم المبدئي","نرسل مستنداتك الطبية إلى المستشفى والطبيب المختص المناسبين ونتابع التقييم نيابةً عنك."],
 ["مواعيد المستشفيات والأطباء","ننسّق مواعيد الفحوصات والتحاليل وجدول العلاج مع المستشفيات الخاصة في أنقرة."],
 ["الاستقبال والنقل","نستقبلك في المطار ونخطط لجميع التنقلات بين مكان إقامتك والمستشفى."],
 ["إقامة المريض والمرافق","نوفر خيارات إقامة قريبة من المستشفى تناسب احتياجاتك."],
 ["الترجمة والإرشاد","نوفر دعمًا لغويًا أثناء المواعيد الطبية ونرشدك في كل ما تحتاجه في المدينة."],
 ["المتابعة بعد العلاج","بعد عودتك إلى بلدك نتابع تقاريرك ومواعيد المراجعة والتواصل مع طبيبك."]],
"process_h":"كيف تسير الخطوات؟","process_lead":"من رسالتك الأولى حتى المتابعة بعد العلاج، تعرف دائمًا ما الخطوة التالية.",
"process":[
 ["الطلب المسبق","املأ النموذج أو راسلنا عبر واتساب، وأرفق مستنداتك في المحادثة."],
 ["مراجعة الملف","يتصل بك منسقك، ونستكمل معًا أي مستندات ناقصة."],
 ["المستشفى والطبيب","يُرسَل ملفك، بإذنك، إلى المستشفى والطبيب المختص المناسبين، وننقل إليك تقييم الطبيب."],
 ["التخطيط","تُحدَّد مواعيدك وإقامتك وتنقلاتك ومواعيد المترجم."],
 ["العلاج في أنقرة","يرافقك منسقك من لحظة الوصول حتى الخروج من المستشفى."],
 ["المتابعة","نتابع تقاريرك ومواعيد المراجعة بعد عودتك إلى بلدك."]],
"onc_h":"إلى جانبك خلال علاج السرطان",
"onc_p":["تشخيص السرطان لا يؤثر على المريض وحده بل على أسرته كلها، والتعامل مع المستشفيات واللغة والإقامة في مدينة غريبة يزيد هذا العبء. نتولى هذه التفاصيل لتتفرغ أنت وعائلتك للعلاج.",
          "الطبيب الذي يفحصك هو من يقرر العلاج المناسب دائمًا. ومهمتنا أن تكون كل خطوة في هذه الرحلة منظمة وواضحة وسهلة الوصول."],
"onc_items":["الفحوصات والمواعيد والعلاج في جدول واحد","دعم الترجمة أثناء مقابلة الأطباء","الإقامة والمساعدة اليومية لأسرة المريض"],
"city_h":"لماذا أنقرة؟ ولماذا بالغات؟",
"city_p":"أنقرة عاصمة تركيا ومركز صحي يضم عددًا كبيرًا من المستشفيات الخاصة والجامعية. يقع مكتبنا في حي بالغات بمنطقة تشانكايا، على مقربة من وسط المدينة وكثير من المستشفيات.",
"city_items":["الاستقبال والنقل من مطار إسنبوغا","خيارات إقامة قريبة من المستشفيات","إمكانية اللقاء وجهًا لوجه في مكتبنا"],
"family_h":"قائمة التحضير قبل السفر","family_lead":"تجهيز ما يلي مسبقًا يسرّع الإجراءات:",
"family":["جواز السفر والتأشيرة إذا لزم الأمر","ملخص الخروج وتقارير علم الأمراض والتصوير","نتائج تحاليل الدم الأخيرة","قائمة الأدوية الحالية وكمية كافية منها","هوية المرافق وبيانات التواصل معه"],
"visa_note":"تختلف شروط التأشيرة من بلد إلى آخر، وسنزوّدك بمعلومات محدّثة بعد تقديم طلبك.",
"partners_h":"المؤسسات المتعاقدة معنا","partners_note":"تُنشر بيانات المؤسسات بموافقة كل مؤسسة.",
"faq_h":"الأسئلة الشائعة",
"faqs":[
 ["كم تبلغ تكلفة العلاج؟","تختلف التكلفة حسب التشخيص وخطة العلاج التي يوصي بها الطبيب. بعد مراجعة مستنداتك وتقييمها من قبل الطبيب، نقدّم لك معلومات خاصة بحالتك."],
 ["كيف أرسل مستنداتي؟","بعد تعبئة نموذج الطلب المسبق، أرفق صور مستنداتك أو ملفات PDF في محادثة واتساب التي تُفتح معنا. لا حاجة لرفع أي ملفات إلى الموقع."],
 ["متى ستردّون عليّ؟","يراجع منسقنا طلبك في أقرب وقت ممكن ويتواصل معك عبر الوسيلة التي اخترتها."],
 ["هل توفرون مترجمًا؟","نعم. نرتّب الدعم اللغوي في مواعيد المستشفى وفي احتياجاتك اليومية. يكفي أن تذكر في طلبك اللغة التي تحتاجها."],
 ["هل يمكن لمرافقي البقاء معي؟","تشمل خطة الإقامة مرافقك أيضًا. أما قواعد المرافقة داخل المستشفى فتختلف من مؤسسة إلى أخرى، وسنبلغك بها مسبقًا."],
 ["من يقرر العلاج؟","جميع القرارات المتعلقة بالتشخيص والعلاج يتخذها الطبيب الذي يفحصك. نحن لا نجري تقييمًا طبيًا، بل نتولى تنظيم الرحلة."]],
"band_h":"جهّز طلبك في دقيقتين","band_p":"أدخل بياناتك وأرسل مستنداتك عبر واتساب، وسيتصل بك منسقك.",
"contact_h":"تواصل معنا","contact_lead":"تواصل معنا عبر الوسيلة الأنسب لك. في الحالات الطبية الطارئة اتصل برقم الطوارئ في بلدك.",
"c_phone":"الهاتف","c_wa":"واتساب","c_office":"المكتب","office_val":"بالغات، تشانكايا / أنقرة","c_email":"البريد الإلكتروني",
"footer_disc":"المعلومات الواردة في هذا الموقع للإرشاد العام ولا تُعدّ نصيحة طبية. قرارات التشخيص والعلاج يتخذها طبيبك.",
"license_lbl":"رقم ترخيص السياحة الصحية الدولية","privacy_lbl":"إشعار الخصوصية","rights":"جميع الحقوق محفوظة.",
"mob_call":"اتصال","mob_wa":"واتساب","mob_apply":"الطلب",
"wa_text":"مرحبًا، أودّ الحصول على معلومات حول العلاج في أنقرة.",
},
"ru": {
"html_lang":"ru","dir":"ltr","locale":"ru_RU","lang_name":"Русский",
"meta_title":"Ankara Sağlık Turizmi · Организация лечения в Анкаре",
"meta_desc":"Для пациентов и их близких, приезжающих в Анкару на лечение рака: встреча в аэропорту, проживание, запись в клиники и к врачам, переводчик и наблюдение после лечения. Офис в Балгате, Чанкая.",
"skip":"Перейти к содержанию","menu":"Меню","nav_services":"Услуги","nav_process":"Как мы работаем","nav_faq":"Вопросы","nav_contact":"Контакты","call":"Позвонить",
"hero_eyebrow":"Балгат, Чанкая · Анкара",
"hero_h1":"Мы возьмём на себя организацию Вашего лечения в Анкаре от начала до конца",
"hero_sub":"Для пациентов и их близких, приезжающих в Анкару на лечение рака: один координатор рядом на каждом этапе, от встречи в аэропорту и записи в клинику до проживания и переводчика.",
"cta_apply":"Подать заявку","cta_wa":"Написать в WhatsApp",
"chips":["Один координатор, одна точка контакта","Русский, английский, арабский и турецкий","Решение о лечении всегда принимает врач"],
"journey_title":"Ваш путь лечения","journey_sub":"Координатор рядом на каждом этапе",
"journey":["Заявка","Изучение документов","Клиника и врач","Встреча и проживание","Лечение","Наблюдение"],
"services_h":"Что мы берём на себя",
"services_lead":"Мы планируем все немедицинские детали, чтобы Вы могли сосредоточиться на лечении. Медицинские решения всегда принимает Ваш врач.",
"services":[
 ["Организация предварительной оценки","Передаём Ваши медицинские документы в подходящую клинику и профильному врачу и следим за ходом рассмотрения."],
 ["Запись в клиники и к врачам","Согласуем консультации, обследования и график лечения с частными клиниками Анкары."],
 ["Встреча и трансфер","Встречаем в аэропорту и организуем все поездки между местом проживания и клиникой."],
 ["Проживание пациента и сопровождающего","Подбираем жильё рядом с клиникой с учётом Ваших потребностей."],
 ["Переводчик и сопровождение","Обеспечиваем языковую поддержку на приёмах и помогаем во всём, что нужно в городе."],
 ["Наблюдение после лечения","После возвращения домой следим за Вашими заключениями, контрольными визитами и связью с врачом."]],
"process_h":"Как мы работаем","process_lead":"От первого сообщения до наблюдения после лечения Вы всегда знаете, что будет дальше.",
"process":[
 ["Заявка","Заполните форму или напишите в WhatsApp и прикрепите документы в чате."],
 ["Изучение документов","Координатор звонит Вам, и мы вместе дополняем недостающие документы."],
 ["Клиника и врач","С Вашего согласия документы передаются в подходящую клинику и профильному врачу, а его заключение мы передаём Вам."],
 ["Планирование","Согласуются даты приёмов, проживания, трансфера и работы переводчика."],
 ["Лечение в Анкаре","Координатор рядом с момента прилёта до выписки."],
 ["Наблюдение","Мы следим за заключениями и контрольными визитами и после Вашего возвращения домой."]],
"onc_h":"Рядом с Вами во время лечения рака",
"onc_p":["Диагноз «рак» касается не только пациента, но и всей семьи. Клиники, язык и проживание в незнакомом городе добавляют нагрузки. Мы берём эти заботы на себя, чтобы Вы и Ваши близкие могли сосредоточиться на лечении.",
          "Какое лечение подходит, всегда решает врач, который Вас осматривает. Наша задача сделать каждый этап понятным, организованным и доступным."],
"onc_items":["Обследования, консультации и лечение в едином графике","Переводчик на консультациях с врачами","Проживание и бытовая поддержка для близких"],
"city_h":"Почему Анкара и почему Балгат?",
"city_p":"Анкара — столица Турции и крупный медицинский центр с большим числом частных и университетских клиник. Наш офис находится в районе Балгат (Чанкая), откуда легко добраться до центра города и многих клиник.",
"city_items":["Встреча и трансфер из аэропорта Эсенбога","Проживание рядом с клиниками","Личные встречи в нашем офисе"],
"family_h":"Что подготовить до поездки","family_lead":"Заранее подготовленные документы ускоряют процесс:",
"family":["Паспорт и, при необходимости, виза","Выписка, гистологическое заключение и заключения обследований","Свежие анализы крови","Список принимаемых лекарств и их достаточный запас","Документы и контакты сопровождающего"],
"visa_note":"Визовые требования зависят от страны; после подачи заявки мы сообщим актуальную информацию.",
"partners_h":"Наши партнёрские учреждения","partners_note":"Сведения об учреждениях публикуются с их согласия.",
"faq_h":"Частые вопросы",
"faqs":[
 ["Сколько стоит лечение?","Стоимость зависит от диагноза и плана лечения, который предложит врач. После изучения документов и оценки врача Вы получите информацию по Вашему случаю."],
 ["Как отправить документы?","После заполнения формы заявки прикрепите фото или PDF документов в чате WhatsApp, который откроется с нами. Загружать файлы на сайт не нужно."],
 ["Как быстро Вы отвечаете?","Координатор рассматривает заявку в кратчайший срок и связывается с Вами выбранным способом."],
 ["Есть ли переводчик?","Да. Мы организуем языковую поддержку на приёмах в клинике и в повседневных делах. Просто укажите в заявке нужный язык."],
 ["Может ли сопровождающий жить со мной?","План проживания учитывает и сопровождающего. Правила пребывания сопровождающих в клиниках различаются, и мы заранее Вас о них предупредим."],
 ["Кто принимает решение о лечении?","Все решения о диагнозе и лечении принимает врач, который Вас осматривает. Мы не даём медицинских оценок, а организуем процесс."]],
"band_h":"Подготовьте заявку за 2 минуты","band_p":"Заполните данные, отправьте документы в WhatsApp, и координатор Вам позвонит.",
"contact_h":"Контакты","contact_lead":"Свяжитесь с нами удобным способом. При неотложном состоянии звоните по номеру экстренной помощи в Вашей стране.",
"c_phone":"Телефон","c_wa":"WhatsApp","c_office":"Офис","office_val":"Балгат, Чанкая / Анкара","c_email":"Эл. почта",
"footer_disc":"Информация на сайте носит общий характер и не является медицинской консультацией. Решения о диагнозе и лечении принимает Ваш врач.",
"license_lbl":"Номер разрешения на международный медицинский туризм","privacy_lbl":"Уведомление о конфиденциальности","rights":"Все права защищены.",
"mob_call":"Звонок","mob_wa":"WhatsApp","mob_apply":"Заявка",
"wa_text":"Здравствуйте, я хотел(а) бы получить информацию о лечении в Анкаре.",
},
}

# ---- Sürüm 2 eklemeleri: görseller, video, adres-harita, yakındaki yerler ----
DATA.update({
    "address_line": "",      # açık adres; boşsa "Balgat, Çankaya / Ankara" kullanılır
    "map_query": "Balgat, Çankaya, Ankara",  # adres girilince otomatik olarak adres kullanılır
    "hours": {"tr": "", "en": "", "ar": "", "ru": ""},  # ör. "Pazartesi–Cumartesi 09.00–19.00"
    "youtube_id": "",        # tanıtım videosunun YouTube kimliği (youtube.com/watch?v=BURASI)
    "video_mp4": "",         # veya kendi videonuz: "video/tanitim.mp4" (site klasörüne göre)
    # Kendi fotoğraflarınızı site/img/ klasörüne bu adlarla koyun; yoksa çizim gösterilir:
    # hero.jpg, karsilama.jpg, konaklama.jpg, tercuman.jpg, ofis.jpg  (yatay, en az 1600 px genişlik önerilir)
})

PLACES = [  # (simge, harita sorgusu)
    ("plane", "Esenboğa Havalimanı, Ankara"),
    ("train", "Ankara YHT Garı"),
    ("bus", "AŞTİ Otogarı, Ankara"),
    ("square", "Kızılay Meydanı, Ankara"),
    ("monument", "Anıtkabir, Ankara"),
]

T["tr"].update({
"nav_location":"Konum",
"gallery_h":"Ankara'da sizi neler bekliyor","gallery_lead":"İlk karşılamadan konaklamaya kadar her adımda yanınızdayız.",
"gallery":["Havalimanında karşılama","Hastaneye yakın konaklama","Görüşmelerde tercüman desteği","Balgat'taki ofisimiz"],
"video_h":"Tedavi yolculuğunuz bir bakışta","video_lead":"Ülkenizden Ankara'ya, tedaviden eve dönüşe kadar sürecin nasıl ilerlediğini izleyin.",
"anim":["Ülkeniz","Esenboğa","Konaklama","Hastane","Takip"],"anim_cap":"Animasyon: tedavi yolculuğunuz","play":"Videoyu oynat",
"loc_h":"Ofisimiz ve konumumuz","loc_lead":"Ofisimiz Ankara'nın merkezi semtlerinden Balgat'tadır. Görüşme için gelmeden önce bizi arayın.",
"addr_lbl":"Adres","hours_lbl":"Çalışma saatleri","dir_btn":"Yol tarifi al","map_btn":"Haritada aç","map_title":"Ofis konumu haritası",
"places_h":"Ankara'da önemli noktalar","places_lead":"Ulaşımınızı planlarken işinize yarayacak yerler. Her birine Balgat'tan yol tarifi alabilirsiniz.",
"places":[["Esenboğa Havalimanı","Ankara'nın uluslararası havalimanı; sizi burada karşılıyoruz."],
          ["Ankara YHT Garı","Hızlı tren yolculukları için ana istasyon."],
          ["AŞTİ Otogarı","Şehirlerarası otobüs terminali."],
          ["Kızılay","Ankara'nın şehir merkezi."],
          ["Anıtkabir","Atatürk'ün anıt mezarı."]],
"from_balgat":"Balgat'tan yol tarifi",
})
T["en"].update({
"nav_location":"Location",
"gallery_h":"What awaits you in Ankara","gallery_lead":"We're with you at every step, from your arrival to your accommodation.",
"gallery":["Airport welcome","Accommodation near the hospital","Interpreter support in consultations","Our office in Balgat"],
"video_h":"Your treatment journey at a glance","video_lead":"See how the process unfolds, from your home country to Ankara and back home after treatment.",
"anim":["Your country","Esenboğa","Stay","Hospital","Follow-up"],"anim_cap":"Animation: your treatment journey","play":"Play video",
"loc_h":"Our office and location","loc_lead":"Our office is in Balgat, one of Ankara's central districts. Please call us before visiting.",
"addr_lbl":"Address","hours_lbl":"Opening hours","dir_btn":"Get directions","map_btn":"Open in Maps","map_title":"Office location map",
"places_h":"Key places in Ankara","places_lead":"Useful places for planning your travel. Get directions to each from Balgat.",
"places":[["Esenboğa Airport","Ankara's international airport, where we meet you."],
          ["Ankara High-Speed Train Station","The main station for high-speed train journeys."],
          ["AŞTİ Bus Terminal","Ankara's intercity bus terminal."],
          ["Kızılay","Ankara's city centre."],
          ["Anıtkabir","The mausoleum of Atatürk."]],
"from_balgat":"Directions from Balgat",
})
T["ar"].update({
"nav_location":"الموقع",
"gallery_h":"ما الذي ينتظرك في أنقرة","gallery_lead":"نرافقك في كل خطوة، من الاستقبال حتى الإقامة.",
"gallery":["الاستقبال في المطار","إقامة قريبة من المستشفى","دعم الترجمة أثناء المواعيد","مكتبنا في بالغات"],
"video_h":"رحلة علاجك في لمحة","video_lead":"شاهد كيف تسير الرحلة، من بلدك إلى أنقرة ثم العودة إلى منزلك بعد العلاج.",
"anim":["بلدك","إسنبوغا","الإقامة","المستشفى","المتابعة"],"anim_cap":"رسوم متحركة: رحلة علاجك","play":"تشغيل الفيديو",
"loc_h":"مكتبنا وموقعنا","loc_lead":"يقع مكتبنا في حي بالغات، أحد الأحياء المركزية في أنقرة. يُرجى الاتصال بنا قبل الزيارة.",
"addr_lbl":"العنوان","hours_lbl":"ساعات العمل","dir_btn":"احصل على الاتجاهات","map_btn":"افتح في الخرائط","map_title":"خريطة موقع المكتب",
"places_h":"أماكن مهمة في أنقرة","places_lead":"أماكن تفيدك عند التخطيط لتنقلاتك، ويمكنك الحصول على الاتجاهات إلى كل منها من بالغات.",
"places":[["مطار إسنبوغا","مطار أنقرة الدولي، وفيه نستقبلك."],
          ["محطة أنقرة للقطارات السريعة","المحطة الرئيسية لرحلات القطار السريع."],
          ["محطة حافلات أشتي","محطة الحافلات بين المدن في أنقرة."],
          ["قزلاي","وسط مدينة أنقرة."],
          ["أنيتكابير","ضريح أتاتورك."]],
"from_balgat":"الاتجاهات من بالغات",
})
T["ru"].update({
"nav_location":"Как нас найти",
"gallery_h":"Что ждёт Вас в Анкаре","gallery_lead":"Мы рядом на каждом этапе, от встречи до проживания.",
"gallery":["Встреча в аэропорту","Проживание рядом с клиникой","Переводчик на приёмах","Наш офис в Балгате"],
"video_h":"Ваш путь лечения коротко","video_lead":"Посмотрите, как проходит весь путь: из Вашей страны в Анкару и обратно домой после лечения.",
"anim":["Ваша страна","Эсенбога","Проживание","Клиника","Наблюдение"],"anim_cap":"Анимация: Ваш путь лечения","play":"Смотреть видео",
"loc_h":"Наш офис и адрес","loc_lead":"Наш офис находится в Балгате, одном из центральных районов Анкары. Пожалуйста, позвоните перед визитом.",
"addr_lbl":"Адрес","hours_lbl":"Часы работы","dir_btn":"Проложить маршрут","map_btn":"Открыть на карте","map_title":"Карта расположения офиса",
"places_h":"Важные места в Анкаре","places_lead":"Места, полезные при планировании поездки. К каждому можно проложить маршрут из Балгата.",
"places":[["Аэропорт Эсенбога","Международный аэропорт Анкары, где мы Вас встречаем."],
          ["Вокзал скоростных поездов Анкары","Главная станция скоростных поездов."],
          ["Автовокзал АШТИ","Междугородний автовокзал Анкары."],
          ["Кызылай","Центр Анкары."],
          ["Аныткабир","Мавзолей Ататюрка."]],
"from_balgat":"Маршрут из Балгата",
})

# ---- Sürüm 3: panelden yönetilen kayan resim düğmeleri ----
T["tr"].update({"prev":"Önceki resim","next":"Sonraki resim"})
T["en"].update({"prev":"Previous image","next":"Next image"})
T["ar"].update({"prev":"الصورة السابقة","next":"الصورة التالية"})
T["ru"].update({"prev":"Предыдущее фото","next":"Следующее фото"})

# ---- Sürüm 4: yorumlar ----
T["tr"].update({"reviews_h":"Hasta ve yakınlarımızın görüşleri","reviews_note":"Görüşler, kişilerin yazılı izniyle ve kendi ifadeleriyle yayımlanmıştır. Tedavi süreci ve sonuçları kişiden kişiye değişir.","orig":"Orijinal dil"})
T["en"].update({"reviews_h":"What patients and families say","reviews_note":"Shared with each person's written permission, in their own words. Treatment and outcomes differ from person to person.","orig":"Original language"})
T["ar"].update({"reviews_h":"آراء المرضى وذويهم","reviews_note":"نُشرت هذه الآراء بإذن كتابي من أصحابها وبكلماتهم. تختلف رحلة العلاج ونتائجه من شخص لآخر.","orig":"اللغة الأصلية"})
T["ru"].update({"reviews_h":"Отзывы пациентов и их близких","reviews_note":"Опубликовано с письменного согласия авторов, их словами. Ход и результаты лечения индивидуальны.","orig":"Язык оригинала"})

# ---- Sürüm 5: ülke ofisleri / şubeler (panelden yönetilir) ----
T["tr"].update({"branches_h":"Ülkelerdeki ofislerimiz","branches_lead":"Size en yakın ofisimize de başvurabilirsiniz. Tüm dosyalar Ankara'daki koordinasyon ekibimize iletilir ve süreç tek elden yürütülür.",
  "br_kind":{"hq":"Merkez ofis","branch":"Şube","rep":"Temsilcilik","liaison":"İrtibat noktası"},"br_langs":"Görüşme dilleri","hq_country":"Türkiye","hq_city":"Ankara"})
T["en"].update({"branches_h":"Our offices","branches_lead":"You can also contact the office nearest to you. Every file is passed to our coordination team in Ankara, so one team follows your case from start to finish.",
  "br_kind":{"hq":"Head office","branch":"Branch","rep":"Representative office","liaison":"Contact point"},"br_langs":"Languages","hq_country":"Türkiye","hq_city":"Ankara"})
T["ar"].update({"branches_h":"مكاتبنا","branches_lead":"يمكنكم أيضًا التواصل مع أقرب مكتب إليكم. تُحال جميع الملفات إلى فريق التنسيق لدينا في أنقرة، ليتابع فريق واحد حالتكم من البداية حتى النهاية.",
  "br_kind":{"hq":"المكتب الرئيسي","branch":"فرع","rep":"مكتب تمثيلي","liaison":"نقطة اتصال"},"br_langs":"لغات التواصل","hq_country":"تركيا","hq_city":"أنقرة"})
T["ru"].update({"branches_h":"Наши офисы","branches_lead":"Вы также можете обратиться в ближайший к Вам офис. Все документы передаются нашей команде координаторов в Анкаре, и Ваш случай ведёт одна команда от начала до конца.",
  "br_kind":{"hq":"Главный офис","branch":"Филиал","rep":"Представительство","liaison":"Контактный пункт"},"br_langs":"Языки общения","hq_country":"Турция","hq_city":"Анкара"})

# ---- Sürüm 6: kurumsal mavi tema — bölüm etiketleri ----
_EY = {
 "tr": {"ey_services":"Hizmetlerimiz","ey_gallery":"Ankara'da","ey_process":"Nasıl çalışıyoruz","ey_team":"Ekibimiz","ey_loc":"Konum","ey_places":"Ulaşım",
        "ey_partners":"İş birlikleri","ey_guides":"Rehberler","ey_reviews":"Görüşler","ey_faq":"SSS","ey_contact":"İletişim","ey_branches":"Ofislerimiz","ey_onc":"Onkoloji",
        "hero_badge_s":"Kendi dilinizde yanıt"},
 "en": {"ey_services":"Our services","ey_gallery":"In Ankara","ey_process":"How it works","ey_team":"Our team","ey_loc":"Location","ey_places":"Getting around",
        "ey_partners":"Partners","ey_guides":"Guides","ey_reviews":"Reviews","ey_faq":"FAQ","ey_contact":"Contact","ey_branches":"Our offices","ey_onc":"Oncology",
        "hero_badge_s":"Replies in your language"},
 "ar": {"ey_services":"خدماتنا","ey_gallery":"في أنقرة","ey_process":"كيف نعمل","ey_team":"فريقنا","ey_loc":"الموقع","ey_places":"التنقل",
        "ey_partners":"شركاؤنا","ey_guides":"أدلة","ey_reviews":"آراء","ey_faq":"أسئلة شائعة","ey_contact":"تواصل معنا","ey_branches":"مكاتبنا","ey_onc":"علاج الأورام",
        "hero_badge_s":"نرد عليكم بلغتكم"},
 "ru": {"ey_services":"Наши услуги","ey_gallery":"В Анкаре","ey_process":"Как мы работаем","ey_team":"Наша команда","ey_loc":"Адрес","ey_places":"Как добраться",
        "ey_partners":"Партнёры","ey_guides":"Руководства","ey_reviews":"Отзывы","ey_faq":"Вопросы","ey_contact":"Контакты","ey_branches":"Наши офисы","ey_onc":"Онкология",
        "hero_badge_s":"Ответим на Вашем языке"},
}
for _l, _v in _EY.items(): T[_l].update(_v)
