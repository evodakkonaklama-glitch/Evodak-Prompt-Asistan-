# Evodak Prompt Asistanı · Rev.10

Evodak ekibinin prompt, komut ve AI platform kütüphanesi. **Bu depo hem uygulamanın kendisi hem de tek veri kaynağıdır.**

- **Panel (bilgisayar + iPhone):** https://evodakkonaklama-glitch.github.io/Evodak-Prompt-Asistan-/
- **Claude:** "Evodak Prompt Asistanı" projesinde Claude bu depoyu okuyup yazar; değişiklikler panelde görünür.

## Bölümler

| No | Bölüm | Veri dosyası | Kaynak dosya |
|---|---|---|---|
| — | Ana Panel | — | — |
| 1 | Ön Prompt Hazırlama Formu | (form `gecmis.json`'a kaydeder) | Rev.04 form |
| 2 | Prompt İyileştirme | (sonuç `gecmis.json`'a revizyon olarak) | — |
| 3 | Kayıtlı Promptlar | `data/gecmis.json` | önceki promptlar |
| 4 | Kod & Command Prompt (8 sekme) | `data/kod.json`, `data/kodref.json`, `data/kodmeta.json` | 03- Evodak Kod & Command Promptlar – Rev 3 |
| 5 | Uzun Prompt (3 sekme) | `data/uzun.json`, `data/rehber.json`, `data/uzunmeta.json` | 02- Evodak Uzun Promptlar Rev 2 |
| 6 | AI Platform (3 sekme) | `data/plat.json`, `data/model.json` | 03- Evodak AI Platformlar Liste Çalışma Rev 3 |
| — | Yükle & Aktar | — | — |
| — | Değişiklik Günlüğü | `data/log.json` (+ GitHub commit geçmişi) | — |

## Nasıl çalışır

- Panel tek bir `index.html` dosyasıdır (GitHub Pages ile yayınlanır, telefona/bilgisayara uygulama olarak kurulabilir).
- Okuma: depo herkese açıksa anahtarsız; gizliyse GitHub anahtarı gerekir.
- Yazma: her kişi panelde **Ayarlar → GitHub erişim anahtarı** girer (fine-grained token, yalnızca bu depo, *Contents: Read and write*). Her kayıt bir commit'tir: `data/<bölüm>.json` + `data/log.json` birlikte güncellenir.
- Aynı anda iki kişi kaydederse panel güncel veriyi alıp tekrar dener; kimsenin değişikliği kaybolmaz.
- AI özellikleri (nihai prompt üretimi, dosya analizi, iyileştirme) için **Ayarlar → Anthropic API anahtarı** gerekir. Anahtarlar yalnızca cihazda saklanır, depoya yazılmaz.

## Geliştirme

```
src/01-shell.html     görünüm (CSS + iskelet)
src/10-core.js        çekirdek: GitHub veri katmanı, dil, alan tanımları, kayıt paneli, tablo
src/20-formdata.js    form verisi (Rev.04 amaçlar, bölümler, seçenekler, üretim motoru)
src/30-form.js        1 · Ön Prompt Hazırlama Formu + AI bağlantısı
src/40-sections.js    diğer bölümler, ayarlar, başlatma
tools/build.py        src → index.html + sw.js
```

`python3 tools/build.py` çalıştırıp `index.html`'i commit edin. Veri dosyalarının biçimi: dizi, her satırda bir kayıt (`id` alanı benzersiz). Elle düzenlerken bir kayıt eklerseniz `data/log.json`'a da bir satır ekleyin.
