# SIMANSUR (Sistem Informasi Manajemen Surat)
### BPKAD Sub Bidang Aset Kota Pekanbaru

---

## 🏛️ Tentang SIMANSUR
**SIMANSUR** adalah sistem informasi tata kelola persuratan dinas dan disposisi digital yang dirancang khusus untuk **Badan Pengelola Keuangan dan Aset Daerah (BPKAD) Sub Bidang Aset Kota Pekanbaru**.

Aplikasi ini mengadopsi standar sistem persuratan resmi pemerintahan (seperti SRIKANDI / e-Office Pemda) dengan nuansa formal, bersih, andal, dan aman.

---

## 📌 Prinsip Dasar & Filosofi Sistem
1. **Single Scan as Source of Truth**: Satu berkas scan lengkap (PDF multi-halaman atau gambar resolusi tinggi) mencakup seluruh dokumen fisik asli: **Surat Pengantar + Lembar Disposisi Pimpinan (Kaban/Sekban) + Berita Acara (BA) / BAST**. Berkas scan adalah acuan mutlak; form input di sistem hanya menangkap metadata penting untuk pencarian cepat, filter, buku agenda, dan alur tindak lanjut.
2. **Disposisi Selesai di Luar Sistem**: Disposisi pimpinan telah dilakukan secara fisik/eksternal. Sistem mencatat ringkasan instruksi disposisi dan meneruskannya ke level teknis pelaksanaan (Kasubid $\rightarrow$ Staf).
3. **Approval Kabid WAJIB**: Baik surat masuk maupun surat keluar **WAJIB** memperoleh persetujuan (*approval*) resmi dari Kepala Bidang (Kabid) sebelum dapat diarsipkan secara permanen oleh Admin.
4. **Role-Based Access Control (RBAC) Ketat**: Setiap pengguna memiliki hak akses dan batas wewenang yang tegas sesuai kedudukan jabatan.

---

## 👥 Akun Bawaan & Wewenang Peran (Role)

Semua akun menggunakan kata sandi default: `password123`

| No | Peran (Role) | Nama Pengguna | NIP | Nama Pejabat / Pegawai | Wewenang Utama |
|:--:|---|---|---|---|---|
| 1 | **Admin** | `admin` | `198001012005011001` | Administrator Sistem | Input surat masuk & keluar, verifikasi surat keluar, koreksi bidang tujuan, arsipkan surat setelah disetujui Kabid, kelola seluruh akun pengguna, log aktivitas. |
| 2 | **Kabid** | `kabid` | `197508121998031002` | Drs. H. Ahmad Fauzi, M.Si | Monitoring global surat masuk & keluar, **Approval Wajib** surat masuk (setelah diverifikasi Kasubid), **Approval Wajib** arsip surat keluar (setelah diverifikasi Admin), kembalikan surat keluar jika ada koreksi. |
| 3 | **Kasubid Inventarisasi** | `kasubid.inv` | `198203152006041005` | Budi Santoso, S.STP | Terima surat masuk bidang inventarisasi, teruskan ke staf bidangnya, verifikasi laporan hasil staf, tandai perlu koreksi ke Admin jika salah alamat, daftarkan akun staf inventarisasi. |
| 4 | **Kasubid Keamanan** | `kasubid.keam` | `198406202008011003` | Hendra Wijaya, S.E | Terima surat masuk bidang keamanan aset, teruskan ke staf bidangnya, verifikasi laporan hasil staf, tandai perlu koreksi ke Admin jika salah alamat, daftarkan akun staf keamanan. |
| 5 | **Staff Inventarisasi** | `staff.inv` | `199201102015031002` | Siti Rahmawati, S.Tr.A.P | Melihat surat masuk yang ditugaskan kepadanya, input laporan hasil tindak lanjut + unggah bukti fisik lapangan. *(Tidak memiliki akses ke surat keluar)*. |
| 6 | **Staff Keamanan** | `staff.keam` | `199407252019021004` | Rian Pratama, A.Md | Melihat surat masuk pengamanan aset yang ditugaskan, input laporan hasil tindak lanjut + unggah bukti lapangan. *(Tidak memiliki akses ke surat keluar)*. |

---

## 🔄 Alur Kerja Sistem (Workflow)

### 1. Alur Surat Masuk (Turun)
```
Admin Input (Upload Scan Lengkap)
  ↓
Status: [baru] → Diteruskan otomatis ke Kasubid Bidang Terkait
  ↓
Kasubid Terima & Teruskan ke Staf Teknis
  ↳ Jika salah alamat/disposisi: Tandai [perlu_koreksi] → Kembali ke Admin → Admin koreksi bidang tujuan
  ↓
Status: [diteruskan_staff]
  ↓
Staf Laksanakan Tugas Fisik/KIB → Laporkan Hasil (+ Unggah Bukti Opsional)
  ↓
Status: [selesai_staff]
  ↓
Kasubid Verifikasi Laporan Staf
  ↓
Status: [terverifikasi_kasubid]
  ↓
Kabid Beri Persetujuan Resmi (WAJIB)
  ↓
Status: [disetujui_kabid]
  ↓
Admin Arsipkan Berkas Digital & Fisik
  ↓
Status: [diarsipkan] (Selesai)
```

### 2. Alur Surat Keluar (Naik)
```
Admin Input Draft (Upload Scan Surat / BA / BAST)
  ↓
Status: [diinput]
  ↓
Admin Verifikasi Kelengkapan Berkas & Kirim ke Kabid
  ↓
Status: [diverifikasi_admin]
  ↓
Kabid Review Dokumen
  ├─ Jika ada koreksi: [dikembalikan] → Admin perbaiki & kirim ulang
  └─ Jika disetujui: [disetujui_kabid] (Approval WAJIB)
  ↓
Admin Arsipkan Berkas Resmi
  ↓
Status: [diarsipkan] (Selesai)
```

---

## 💻 Teknologi yang Digunakan
- **Backend**: Laravel 11.x (PHP 8.3), RESTful API, Laravel Sanctum Token Auth (Masa aktif 8 jam)
- **Frontend**: React 18, Vite 5, React Router DOM v6
- **Styling**: Tailwind CSS v3 (Palet resmi Pemda: Deep Navy `#1A3A5C`, Medium Blue `#2E5C8A`, Amber Gold `#F5A623`)
- **State Management**: Zustand
- **Server Cache & Fetching**: TanStack Query (React Query v5)
- **Forms & Validation**: React Hook Form + Zod
- **Ikonografi & Visual**: Lucide React *(Bebas emoji, standar bersih pemerintahan)*
- **Animasi & Transisi**: Framer Motion
- **Grafik & Analitik**: Recharts
- **Ekspor Dokumen**:
  - `barryvdh/laravel-dompdf` (Cetak Lembar Disposisi & Buku Agenda PDF)
  - CSV / Excel Stream Rekapitulasi
- **Audit Trail**: Spatie Laravel Activitylog & Tabel Mutasi `log_aktivitas`

---

## 🚀 Panduan Menjalankan Sistem

### Persyaratan Lingkungan
- PHP $\ge$ 8.2 (Ekstensi: `pdo_mysql`, `gd`, `zip`, `fileinfo`)
- MySQL $\ge$ 8.0
- Node.js $\ge$ 18 & NPM $\ge$ 9
- Composer $\ge$ 2.0

### Langkah Instalasi
1. **Clone / Buka Proyek**:
   ```bash
   cd d:/simansur2
   ```

2. **Pengaturan Database (`.env`)**:
   Pastikan pengaturan basis data pada `.env` telah mengarah ke database MySQL:
   ```env
   DB_CONNECTION=mysql
   DB_HOST=127.0.0.1
   DB_PORT=3306
   DB_DATABASE=simansur_bpkad
   DB_USERNAME=root
   DB_PASSWORD=
   ```

3. **Migrasi & Data Seeder**:
   ```bash
   php artisan migrate:fresh --seed
   ```
   *Perintah ini akan membuat struktur database, menghubungkan direktori storage publik, dan mengisi data sampel seluruh status alur beserta berkas scan contoh.*

4. **Kompilasi Frontend**:
   ```bash
   npm run build
   ```
   *(Atau jalankan `npm run dev` untuk pengembangan real-time).*

5. **Jalankan Server Lokal**:
   ```bash
   php artisan serve --port=8000
   ```

6. **Akses Aplikasi**:
   Buka peramban (browser) dan tuju alamat:
   **[http://127.0.0.1:8000](http://127.0.0.1:8000)**

---

## 🧪 Skenario Pengujian Alur Per Role

Pada halaman login telah disediakan tombol **"Pilih Akun Cepat Pengujian"** untuk mempermudah beralih akun dalam menguji alur:

### Skenario 1: Alur Surat Masuk Lengkap
1. **Login sebagai `admin`**:
   - Klik **Input Surat Masuk**, isi form dan unggah scan. Sistem memberi nomor agenda otomatis (misal: `SM/2026/10/0008`) dan meneruskan ke Kasubid.
2. **Login sebagai `kasubid.inv`**:
   - Buka surat masuk tersebut di menu **Surat Masuk**.
   - Klik tombol **Teruskan ke Staf**, pilih nama `Siti Rahmawati`, dan berikan catatan instruksi.
3. **Login sebagai `staff.inv`**:
   - Di dashboard terlihat ada tugas surat masuk baru.
   - Buka detail surat, klik **Laporkan Hasil & Unggah Bukti**, tuliskan hasil rekonsiliasi KIB, dan submit.
4. **Login sebagai `kasubid.inv`**:
   - Buka surat tersebut (status: `Selesai Staf`), klik **Verifikasi Laporan Staf**. Status berubah menjadi `Terverifikasi Kasubid`.
5. **Login sebagai `kabid`**:
   - Di dashboard Kabid muncul notifikasi surat masuk menunggu persetujuan.
   - Buka detail surat, klik **Beri Persetujuan (Approval Kabid)**. Status berubah menjadi `Disetujui Kabid`.
6. **Login kembali sebagai `admin`**:
   - Surat sekarang memiliki tombol **Arsipkan Berkas Surat**. Klik tombol ini untuk memindahkan status menjadi `Diarsipkan`.

### Skenario 2: Alur Koreksi Disposisi (Salah Alamat)
1. **Login sebagai `kasubid.inv`**:
   - Pilih surat perihal tanah/pengamanan fisik yang salah alamat masuk ke inventarisasi (misal surat nomor 7).
   - Klik **Tandai Perlu Koreksi**, masukkan alasan pengembalian.
2. **Login sebagai `admin`**:
   - Di dashboard muncul daftar prioritas *Perlu Tindakan Saya*.
   - Buka surat tersebut, klik **Perbaiki Bidang & Teruskan Ulang**, pilih **Sub Bidang Keamanan**. Surat otomatis diteruskan ke Kasubid Keamanan.

### Skenario 3: Alur Surat Keluar & Pengembalian
1. **Login sebagai `admin`**:
   - Buka menu **Surat Keluar**, input surat keluar atau verifikasi draft yang ada (`Verifikasi & Kirim ke Kabid`).
2. **Login sebagai `kabid`**:
   - Buka surat keluar berstatus `Diverifikasi Admin`.
   - Uji klik **Kembalikan ke Admin** untuk meminta perbaikan nomor rangka/mesin, atau klik **Beri Persetujuan (Approval Arsip)**.
3. **Login sebagai `admin`**:
   - Setelah disetujui Kabid, Admin dapat mengarsipkan berkas secara resmi.

### Skenario 4: Cetak & Ekspor
- Pada detail setiap surat masuk, klik **Cetak Disposisi** untuk mencetak lembar disposisi kendali format formal pemerintah (dilengkapi kop dinas, riwayat tindak lanjut, dan kotak tanda tangan pejabat).
- Pada menu **Laporan & Rekapitulasi**, pilih rentang tanggal, lalu klik **Cetak PDF Resmi** atau **Ekspor Excel (CSV)**.

---

## 🔒 Catatan Keamanan
- Masa berlaku sesi/token Sanctum dibatasi 8 jam.
- Seluruh mutasi persuratan dan login dicatat pada tabel audit trail `log_aktivitas`.
- Berkas scan disimpan di storage terproteksi dengan batasan MIME type (PDF multi-halaman, JPG, JPEG, PNG) dan ukuran maksimal 20 MB.
- Proteksi route backend ganda: `auth:sanctum` dan middleware `role:...`.

---
*Dikembangkan dengan penuh dedikasi untuk BPKAD Sub Bidang Aset Kota Pekanbaru.*
