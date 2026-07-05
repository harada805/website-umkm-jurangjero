# Jurang Jero Digital

Digital Village Platform untuk Desa Jurang Jero, Ngawen, Gunungkidul, Yogyakarta.

## Stack

- Next.js 14 App Router + TypeScript
- Tailwind CSS
- Framer Motion
- Firebase Authentication + Firestore wrapper
- Recharts untuk dashboard
- Custom SVG map untuk Padukuhan Explorer

## Menjalankan Lokal

Di Windows, cara paling mudah:

```bash
start-dev.cmd
```

Untuk langsung membuka halaman login admin:

```bash
start-admin.cmd
```

Atau jalankan manual:

```bash
npm.cmd install
npm.cmd run dev -- -p 3000
```

Buka `http://localhost:3000`.

## Firebase

Salin `.env.example` menjadi `.env.local`, lalu isi konfigurasi Firebase web app.

```bash
NEXT_PUBLIC_FIREBASE_API_KEY=...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=...
NEXT_PUBLIC_FIREBASE_PROJECT_ID=...
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=...
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=...
NEXT_PUBLIC_FIREBASE_APP_ID=...
```

Admin dashboard berada di `/admin`. Login memakai Firebase Authentication email/password.

Untuk publik, tidak ada tombol admin di navigasi atau footer. Admin masuk
dengan mengetik URL langsung:

```text
http://localhost:3000/admin/login
```

Alias internal yang lebih tidak terlihat:

```text
http://localhost:3000/panel-internal-jurangjero
```

Saat Firebase belum dikonfigurasi dan aplikasi berjalan lokal, tersedia akun
demo frontend:

```text
Email: admin@jurangjero.local
Password: Jurangjero2026!
```

Untuk production, buat user admin asli di Firebase Authentication dan jangan
pakai password demo.

## Struktur

- `src/app` halaman App Router.
- `src/components/sections` section publik.
- `src/components/admin` dashboard internal desa.
- `src/lib/data.ts` data awal yang mudah diganti Firestore/SID.
- `src/lib/firebase.ts` inisialisasi Firebase dan titik integrasi SID masa depan.
- `src/lib/firestore-service.ts` logic CRUD Firestore untuk admin.
- `firestore.rules` aturan keamanan Firestore.

Data saat ini berupa seeded content agar UI lengkap sejak awal. Setelah Firestore siap, data pada `src/lib/data.ts` bisa dipindahkan ke collection seperti `umkms`, `products`, `news`, `events`, `hamlets`, dan `village_stats`.

Detail database ada di [docs/firebase-database.md](docs/firebase-database.md).

## Deploy Firestore Rules

Project sudah disiapkan dengan:

- `firebase.json`
- `.firebaserc`
- `firestore.rules`
- `firestore.indexes.json`

Install Firebase CLI jika belum ada:

```bash
npm install -g firebase-tools
```

Login dan deploy rules:

```bash
firebase login
firebase deploy --only firestore:rules,firestore:indexes
```

Jika ingin cek project aktif:

```bash
firebase projects:list
firebase use umkm-jurangjero-website
```

## Deploy Online via GitHub + Vercel

1. Buat repository kosong di GitHub.
2. Push project ini ke repository tersebut.
3. Import repository di Vercel sebagai project Next.js.
4. Isi Environment Variables di Vercel dengan isi `.env.local`.
5. Deploy.

Build command Vercel:

```bash
npm run build
```

Output directory dikosongkan/default karena ini Next.js.
