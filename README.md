# Evodak Prompt Asistanı — Veri Deposu

Evodak Prompt Asistanı panelindeki prompt kütüphanesinin JSON kopyası.
Mobil uygulama ve diğer araçlar verileri buradan okur.

## Dosyalar

| Dosya | İçerik | Kayıt |
|---|---|---|
| `data/index.json` | Bölüm listesi, kayıt sayıları, son güncelleme tarihi | — |
| `data/kod.json` | Kod & Command Prompt | 494 |
| `data/uzun.json` | Uzun Prompt (TR/EN) | 220 |
| `data/gecmis.json` | Daha önce oluşturulan & kullanılan promptlar | 32 |
| `data/plat.json` | AI Platformlar | 170 |
| `data/model.json` | Modeller | 5 |
| `data/rehber.json` | Rehber | 11 |

Her dosya bir dizi (array) içerir; her öğenin benzersiz bir `id` alanı vardır
(ör. `k0001`, `u0001`, `p001`).

## Uygulamadan okuma

```
https://raw.githubusercontent.com/evodakkonaklama-glitch/Evodak-Prompt-Asistan-/main/data/uzun.json
```

Depo **public** ise bu adres şifresiz çalışır. **Private** ise isteğe
`Authorization: Bearer <token>` başlığı eklenmelidir (salt okuma yetkili,
yalnızca bu depoya erişen bir fine-grained token önerilir).

## Güncelleme

Ana kaynak paneldir. Panelde yapılan eklemeler bu depoya Claude üzerinden
aktarılır ("panel verilerini GitHub'a aktar"). Bu dosyaları elle
düzenlerseniz, bir sonraki aktarımda panel verisiyle üzerine yazılabilir.
