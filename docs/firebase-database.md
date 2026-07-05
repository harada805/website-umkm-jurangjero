# Firebase Database Logic

Dokumen ini menjelaskan struktur Firestore yang dipakai project.

## Collection

### `admin_users`

Gunakan document ID = Firebase Auth UID jika sudah production.

Field:

- `uid`: string, UID dari Firebase Authentication.
- `name`: string.
- `email`: string.
- `role`: `Super Admin` | `Admin Konten` | `Admin UMKM` | `Viewer`.
- `status`: `Aktif` | `Nonaktif`.
- `passwordReady`: boolean, hanya status bahwa password sudah disetel.
- `createdAt`: string tanggal.
- `updatedAt`: server timestamp.

Password tidak disimpan di Firestore. Password dibuat di Firebase
Authentication.

User admin berikutnya dibuat dari dashboard melalui form **Kelola User & Role**.
Form tersebut membuat akun login dan menyimpan role ke `admin_users`.

### `umkms`

Field:

- `name`
- `tagline`
- `category`
- `rating`
- `whatsapp`
- `productCount`
- `hamletId`
- `cover`
- `story`
- `history`
- `specialty`
- `bestFor`: array string.
- `highlights`: array string.
- `process`: array berisi `{ title, text }`.
- `owner`
- `ownerStory`
- `gallery`: array path gambar.
- `products`: array produk `{ id, umkmId, name, category, price, popularity, image, shortNote }`.
- `testimonials`: array `{ name, quote }`.
- `locationNote`
- `mapsUrl`: opsional, tautan Google Maps publik.
- `verified`: boolean.
- `sourceNote`
- `status`: `Aktif` | `Draft`
- `createdAt`
- `updatedAt`

Seed awal sekarang menyimpan detail UMKM penuh, termasuk Ibu Pare Snack Sido
Maju dan Cokelat Karakter Al Husna. Dashboard admin masih membaca field ringkas
untuk tabel kelola UMKM, tetapi data detail tetap tersimpan di dokumen yang sama.

### `news`

Field:

- `type`: `Berita` | `Pengumuman` | `Acara`
- `title`
- `date`
- `excerpt`
- `updatedAt`

### `events`

Disiapkan jika agenda nanti dipisah dari `news`.

### `citizen_stories`

Field:

- `name`
- `role`
- `quote`
- `status`: `Tayang` | `Draft`
- `createdAt`
- `updatedAt`

Cerita dengan status `Tayang` muncul di section publik **Cerita dari Warga**.

### `tourism_spots`

Field:

- `name`
- `hamletId`
- `image`
- `summary`
- `detail`
- `bestTime`
- `highlight`
- `updatedAt`

Data ini tampil pada section **Potensi Wisata** dan panel **Peta Desa**.

### `gallery_items`

Field:

- `title`
- `type`
- `src`
- `createdAt`
- `updatedAt`

Data ini tampil pada section **Galeri Multimedia**.

## Sinkronisasi Website Utama

Jika `.env.local` sudah berisi konfigurasi Firebase, halaman publik membaca
Firestore secara realtime:

- UMKM Marketplace membaca collection `umkms`.
- Katalog Produk mengambil daftar produk dari UMKM aktif di `umkms`.
- Peta Desa menampilkan UMKM aktif berdasarkan `hamletId` dari `umkms`.
- Potensi Wisata membaca collection `tourism_spots`.
- Galeri Multimedia membaca collection `gallery_items`.
- Berita, Pengumuman, dan Acara membaca collection `news`.
- Cerita dari Warga membaca collection `citizen_stories`.

Jika Firebase belum aktif atau collection masih kosong, website memakai data
lokal dari `src/lib/data.ts` sebagai fallback agar tampilan tetap jalan.

Dashboard admin juga menulis perubahan ke `localStorage` browser terlebih dulu.
Tujuannya agar saat mode lokal/dev, perubahan tetap langsung muncul di website
utama tanpa menunggu Firestore.

### `hamlets`

Menyimpan data padukuhan, statistik, polygon SVG, titik peta, dan koordinat.

### `village_stats`

Dokumen statistik ringkas:

- `identity`
- `population_by_hamlet`
- `occupation_distribution`

### `audit_logs`

Catatan aksi admin. Hanya Super Admin yang bisa membaca. Admin aktif bisa
menulis log.

## Bootstrap Admin Pertama

Karena rules mengandalkan role dari `admin_users/{uid}`, langkah awal production:

1. Buat user pertama di Firebase Authentication.
2. Copy UID user tersebut.
3. Buat dokumen Firestore manual:

```text
Collection: admin_users
Document ID: <UID Firebase Auth>
```

Isi:

```json
{
  "uid": "<UID Firebase Auth>",
  "name": "Super Admin",
  "email": "admin@domain.id",
  "role": "Super Admin",
  "status": "Aktif",
  "passwordReady": true,
  "createdAt": "2026-07-01"
}
```

Setelah itu login dengan akun tersebut, lalu kelola user lain lewat dashboard.
User berikutnya tidak perlu dibuat manual dari console.

## File Kode

- `src/lib/firebase.ts`: inisialisasi Firebase.
- `src/lib/firestore-service.ts`: service CRUD Firestore.
- `firestore.rules`: security rules.
- `firestore.indexes.json`: konfigurasi index awal.

## Catatan Password

Dashboard memiliki input password awal untuk membuat akun login. Password tidak
disimpan di Firestore; yang disimpan hanya status `passwordReady`.
