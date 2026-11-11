# MBG SaaS

1. `docker compose down -v` (hanya kalau sebelumnya sudah pernah dijalankan; ini mereset data contoh)
2. `docker compose up -d`
3. Copy `.env.example` jadi `.env.local` (isi SESSION_SECRET dengan teks acak panjang)
4. `npm install` lalu `npm run dev`
5. Buka http://localhost:3000

## Akun contoh (kata sandi semua: mbg12345, ganti sebelum dipakai sungguhan)
| Nama pengguna | Peran |
|---|---|
| kepala | Kepala dapur |
| gizi | Ahli gizi |
| kurir | Kurir/sopir |
| owner | Owner |
| yayasan | Admin yayasan |

Urutan coba: login `kepala` > Lanjut > Simpan (masak) > login `kurir` > Berangkat > Sampai > login `owner`.
