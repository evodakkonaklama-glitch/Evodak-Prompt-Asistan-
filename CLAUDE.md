# Evodak Prompt Asistanı — Claude notları

Bu depo Evodak Prompt Asistanı panelinin hem uygulaması hem tek veri kaynağıdır. Kullanıcı Türkçe konuşur.

## Veri değişikliği istendiğinde
- Kayıtlar `data/*.json` içinde; biçim: `[` + her satırda bir JSON kayıt + `]`. Bu biçimi koru (satır bazlı diff için).
- ID kuralları: kod `PR-0001`, referans `RF-0001`, uzun `u0001` (+ `no`), platform `p001` (+ `no`), kayıtlı prompt `g…`.
- Kod & Command: `altKat` değeri `kodmeta.json → kategoriler[].etiket` listesinden olmalı; `anaKat`, `anaKatEn`, `turEn` alanları bundan türetilir. Silmek yerine `durum: "Arşiv"`.
- Platform adları `plat.json → ad` ile aynı yazılmalı; genel sohbet modelleri için `Genel (Tüm AI'lar)`.
- Her değişiklikte `data/log.json` sonuna bir giriş ekle: `{"id":"L…","at":ISO,"by":"Claude","col":"kod","docId":"PR-0777","action":"ekle|düzenle|sil","title":"…","changes":{alan:[eski,yeni]},"note":"Claude sohbetinden"}`.
- `index.json` içindeki sayıları güncelle.

## Kod değişikliği
- Kaynak `src/`; `python3 tools/build.py` ile `index.html` ve `sw.js` üretilir. `node --check tools/app.js` ile sözdizimini kontrol et.
- Anahtar/token asla depoya yazılmaz (yalnızca tarayıcı localStorage).
