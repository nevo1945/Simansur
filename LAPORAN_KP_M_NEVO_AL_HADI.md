# LAPORAN KERJA PRAKTIK — M. NEVO AL HADI

**Judul:** Rancang Bangun Sistem Informasi Manajemen Surat Masuk dan Surat Keluar (SIMANSUR) Berbasis Web dengan Alur Disposisi Berjenjang pada Bidang Aset Badan Pengelola Keuangan dan Aset Daerah (BPKAD) Kota Pekanbaru

- **Nama Mahasiswa:** M. Nevo Al Hadi
- **Program Studi:** Teknik Informatika — Jurusan Teknologi Informasi, Politeknik Caltex Riau
- **Instansi KP:** Badan Pengelola Keuangan dan Aset Daerah (BPKAD) Kota Pekanbaru — Bidang Aset (Sub Bidang IPA & Sub Bidang P3A)
- **Kepala Bidang Aset / Pembimbing Lapangan:** Syafri Annur Aziz, S.H. (NIP. 19750812 199803 1 002)
- **Kasubid IPA (Inventarisasi dan Penghapusan Aset):** Frima Boby Fatria, S.T. (NIP. 19820315 200604 1 005)
- **Kasubid P3A (Pemanfaatan, Penatausahaan, dan Pengamanan Aset):** Hafid Hartamiarno, S.STP (NIP. 19840620 200801 1 003)

---

LAPORAN KERJA PRAKTIK

RANCANG BANGUN SISTEM INFORMASI MANAJEMEN SURAT MASUK DAN SURAT KELUAR (SIMANSUR) BERBASIS WEB PADA BIDANG ASET BPKAD KOTA PEKANBARU

M. NEVO AL HADI

NIM 22553010XX

PEMBIMBING

Meilany Dewi S.T., M.T.

NIP 048009

PROGRAM STUDI TEKNIK INFORMATIKA

POLITEKNIK CALTEX RIAU

2026

LAPORAN KERJA PRAKTIK

RANCANG BANGUN SISTEM INFORMASI MANAJEMEN SURAT MASUK DAN SURAT KELUAR (SIMANSUR) BERBASIS WEB PADA BIDANG ASET BPKAD KOTA PEKANBARU

Disusun oleh:

M. NEVO AL HADI

NIM. 22553010XX

PROGRAM STUDI TEKNIK INFORMATIKA

JURUSAN TEKNOLOGI INFORMASI

POLITEKNIK CALTEX RIAU

2026


## LEMBAR PENGESAHAN I

LAPORAN KERJA PRAKTIK DI BIDANG ASET BPKAD KOTA PEKANBARU

RANCANG BANGUN SISTEM INFORMASI MANAJEMEN SURAT MASUK DAN SURAT KELUAR (SIMANSUR) BERBASIS WEB PADA BIDANG ASET BPKAD KOTA PEKANBARU

Disusun Oleh:

M. NEVO AL HADI

22553010XX

Diajukan sebagai salah satu persyaratan kelulusan Mata Kuliah Kerja Praktik di Politeknik Caltex Riau

Pekanbaru, Februari 2026

Disetujui oleh:


## LEMBAR PENGESAHAN II

LAPORAN KERJA PRAKTIK DI BIDANG ASET BPKAD KOTA PEKANBARU

RANCANG BANGUN SISTEM INFORMASI MANAJEMEN SURAT MASUK DAN SURAT KELUAR (SIMANSUR) BERBASIS WEB PADA BIDANG ASET BPKAD KOTA PEKANBARU

M. NEVO AL HADI

22553010XX

Diajukan sebagai salah satu persyaratan kelulusan Mata Kuliah Kerja Praktik di Politeknik Caltex Riau

Pekanbaru, Februari 2026

Disetujui oleh:

Pembimbing

Meilany Dewi S.T., M.T.

NIP. 048009

Mengetahui,

Ketua Program Studi Teknik Informatika

Meilany Dewi S.T., M.T.

NIP. 048009


## KATA PENGANTAR

Puji dan syukur penulis panjatkan ke hadirat Tuhan Yang Maha Esa karena atas limpahan rahmat, taufik, dan hidayah-Nya penulis dapat menyelesaikan kegiatan Kerja Praktik serta menyusun Laporan Kerja Praktik yang berjudul “Rancang Bangun Sistem Informasi Manajemen Surat Masuk dan Surat Keluar (SIMANSUR) Berbasis Web pada Bidang Aset BPKAD Kota Pekanbaru” dengan baik dan tepat waktu.

Laporan ini disusun berdasarkan hasil pelaksanaan kegiatan Kerja Praktik di Badan Pengelola Keuangan dan Aset Daerah (BPKAD) Kota Pekanbaru, khususnya pada Bidang Pengelolaan Aset yang membawahi Sub Bidang Inventarisasi dan Penghapusan Aset (IPA) serta Sub Bidang Pemanfaatan, Penatausahaan, dan Pengamanan Aset (P3A). Laporan ini juga merupakan salah satu syarat akademik untuk menyelesaikan mata kuliah Kerja Praktik pada Program Studi Teknik Informatika Politeknik Caltex Riau.

Penulis menyadari bahwa kelancaran pelaksanaan Kerja Praktik hingga penyelesaian laporan ini tidak terlepas dari bimbingan, arahan, serta dukungan dari berbagai pihak. Oleh karena itu, penulis menyampaikan ucapan terima kasih yang sebesar-besarnya kepada:

Tuhan Yang Maha Esa atas segala kesehatan, kemudahan, dan kelancaran yang telah diberikan kepada penulis.

Kedua orang tua dan keluarga tercinta yang senantiasa memberikan doa, kasih sayang, semangat, serta dukungan moral maupun material.

Bapak Syafri Annur Aziz, S.H., selaku Kepala Bidang Aset BPKAD Kota Pekanbaru sekaligus Pembimbing Lapangan yang telah memberikan izin, arahan mengenai alur birokrasi persuratan dan disposisi aset daerah, serta bimbingan selama pelaksanaan Kerja Praktik.

Bapak Frima Boby Fatria, S.T., selaku Kepala Sub Bidang Inventarisasi dan Penghapusan Aset (Kasubid IPA), serta Bapak Hafid Hartamiarno, S.STP, selaku Kepala Sub Bidang Pemanfaatan, Penatausahaan, dan Pengamanan Aset (Kasubid P3A) BPKAD Kota Pekanbaru atas masukan teknis terkait proses disposisi dan tindak lanjut surat.

Ibu Meilany Dewi, S.T., M.T., selaku Ketua Program Studi Teknik Informatika sekaligus Dosen Pembimbing Kerja Praktik yang telah memberikan bimbingan akademik dan masukan berharga dalam penyusunan laporan ini.

Bapak Ivan Chatisa, S.S.T., M.Tr.Kom., selaku Koordinator Kerja Praktik Program Studi Teknik Informatika Politeknik Caltex Riau.

Seluruh staf pelaksana pada Sub Bidang IPA dan Sub Bidang P3A Bidang Aset BPKAD Kota Pekanbaru serta rekan-rekan mahasiswa Teknik Informatika Politeknik Caltex Riau atas kerja sama dan dukungannya.

Semua pihak yang telah berkontribusi secara langsung maupun tidak langsung dalam pelaksanaan Kerja Praktik dan penyusunan laporan ini.

Pekanbaru, Februari 2026

M. NEVO AL HADI


## DAFTAR ISI

LEMBAR PENGESAHAN I	i

LEMBAR PENGESAHAN II	ii

KATA PENGANTAR	iii

DAFTAR ISI	v

DAFTAR GAMBAR	vii

DAFTAR TABEL	viii

BAB I PENDAHULUAN	1

1.1	Latar Belakang	1

1.2	Batasan Masalah	3

1.3	Waktu dan Tempat Pelaksanaan	4

1.4	Tujuan	4

1.5	Manfaat	5

1.6	Sistematika Penulisan	6

BAB II PROFIL INSTANSI	8

2.1	Sejarah Instansi BPKAD Kota Pekanbaru	8

2.2	Profil Bidang Pengelolaan Aset (Sub Bidang IPA dan P3A)	9

2.3	Visi dan Misi Instansi	11

2.3.1	Visi BPKAD Kota Pekanbaru	11

2.3.2	Misi BPKAD Kota Pekanbaru	12

2.4	Struktur Organisasi Bidang Aset	12

2.5	Lokasi Instansi	14

BAB III DASAR TEORI	16

3.1	Sistem Informasi Manajemen Persuratan (e-Office)	16

3.2	Bahasa Pemrograman PHP dan Framework Laravel 11	17

3.3	Library Frontend React 18, Vite, dan Tailwind CSS	19

3.4	Konsep Model – View – Controller (MVC) dan RESTful API	20

3.5	Basis Data Relasional MySQL	22

BAB IV PEMBAHASAN	24

4.1	Kegiatan Kerja Praktik	24

4.2	Gambaran Umum Sistem SIMANSUR	27

4.2.1	Use Case Diagram	28

4.2.2	Activity Diagram	30

4.2.2.1	Activity Diagram Pengelolaan & Disposisi Surat Masuk	30

4.2.2.2	Activity Diagram Pengelolaan & Approval Surat Keluar	32

4.2.2.3	Activity Diagram Cetak Disposisi PDF & Ekspor Agenda Excel	33

4.2.3	Entity Relationship Diagram (ERD)	34

4.3	Implementasi Antarmuka Sistem	37

4.3.1	Antarmuka Autentikasi dan Dashboard Multi-Role	37

4.3.2	Antarmuka Pengelolaan Surat Masuk dan Disposisi	41

4.3.3	Antarmuka Pengelolaan Surat Keluar (Surat, BAST, BA)	43

4.3.4	Antarmuka Manajemen Pengguna, Laporan, dan Mobile	44

BAB V PENUTUP	47

5.1	Kesimpulan	47

5.2	Saran	48

DAFTAR PUSTAKA	49

LAMPIRAN A	A-1

LAMPIRAN B	B-1

LAMPIRAN C	C-1


## DAFTAR GAMBAR

Gambar 2.1 Struktur Organisasi Bidang Aset BPKAD Kota Pekanbaru	13

Gambar 2.2 Lokasi BPKAD Kota Pekanbaru Kompleks Perkantoran Tenayan Raya	15

Gambar 3.1 Arsitektur Full-Stack Laravel 11 REST API dan React 18 SPA	19

Gambar 3.2 Konsep Arsitektur Model-View-Controller (MVC)	21

Gambar 4.1 Use Case Diagram Sistem SIMANSUR BPKAD Kota Pekanbaru	29

Gambar 4.2 Activity Diagram Alur Pengelolaan dan Disposisi Surat Masuk	31

Gambar 4.3 Activity Diagram Alur Pengelolaan dan Approval Surat Keluar	32

Gambar 4.4 Activity Diagram Cetak Lembar Disposisi PDF dan Ekspor Excel	33

Gambar 4.5 Entity Relationship Diagram (ERD) Basis Data SIMANSUR	35

Gambar 4.6 Antarmuka Halaman Login SIMANSUR BPKAD Kota Pekanbaru	38

Gambar 4.7 Antarmuka Dashboard Tata Usaha / Admin Persuratan	38

Gambar 4.8 Antarmuka Dashboard Kepala Bidang Aset (Syafri Annur Aziz, S.H.)	39

Gambar 4.9 Antarmuka Dashboard Kasubid IPA (Frima Boby Fatria, S.T.)	40

Gambar 4.10 Antarmuka Dashboard Staf Pelaksana Sub Bidang	40

Gambar 4.11 Antarmuka Halaman Pengelolaan Surat Masuk	41

Gambar 4.12 Antarmuka Modal Detail Surat Masuk, Riwayat, dan Disposisi	42

Gambar 4.13 Antarmuka Halaman Pengelolaan Surat Keluar (Surat, BAST, BA)	43

Gambar 4.14 Antarmuka Halaman Manajemen Pengguna (User Management)	44

Gambar 4.15 Antarmuka Halaman Laporan & Cetak Dokumen Resmi (PDF/Excel)	45

Gambar 4.16 Tampilan Responsif SIMANSUR pada Perangkat Mobile	46


## DAFTAR TABEL

Tabel 4.1 Kegiatan Kerja Praktik pada Bidang Aset BPKAD Kota Pekanbaru	24

Tabel 4.2 Matriks Hak Akses dan Kewenangan Pengguna Sistem SIMANSUR	27

Tabel 4.3 Spesifikasi Struktur Tabel Basis Data Sistem SIMANSUR	36


## BAB I 
PENDAHULUAN


### Latar Belakang

Perkembangan teknologi informasi dan komunikasi di era transformasi digital telah mendorong instansi pemerintahan daerah untuk menerapkan Sistem Pemerintahan Berbasis Elektronik (SPBE). Penerapan tata kelola pemerintahan yang bersih, efektif, transparan, dan akuntabel menuntut adanya modernisasi dalam administrasi perkantoran, khususnya pada pengelolaan persuratan dinas, naskah berita acara, serta alur disposisi pimpinan yang menjadi urat nadi komunikasi resmi antar-perangkat daerah.

Badan Pengelola Keuangan dan Aset Daerah (BPKAD) Kota Pekanbaru merupakan unsur pelaksana urusan pemerintahan daerah di bidang pengelolaan keuangan dan Barang Milik Daerah (BMD). Salah satu bidang strategis pada BPKAD Kota Pekanbaru adalah Bidang Pengelolaan Aset yang dipimpin oleh Kepala Bidang Aset, Bapak Syafri Annur Aziz, S.H. Dalam menjalankan tugas pokok dan fungsinya, Bidang Aset membawahi dua sub bidang operasional, yaitu Sub Bidang Inventarisasi dan Penghapusan Aset (IPA) yang dikepalai oleh Bapak Frima Boby Fatria, S.T., serta Sub Bidang Pemanfaatan, Penatausahaan, dan Pengamanan Aset (P3A) yang dikepalai oleh Bapak Hafid Hartamiarno, S.STP.

Seiring dengan tingginya beban administrasi pengelolaan Barang Milik Daerah di lingkungan Pemerintah Kota Pekanbaru, Bidang Aset BPKAD Kota Pekanbaru setiap harinya menangani berbagai dokumen surat masuk dan surat keluar dengan volume yang tinggi. Dokumen persuratan tersebut meliputi surat permohonan inventarisasi aset dari Organisasi Perangkat Daerah (OPD), usulan penghapusan aset, permohonan sewa atau pinjam pakai BMD, pengamanan fisik dan sertifikasi tanah pemerintah kota, hingga penerbitan Berita Acara Serah Terima (BAST) dan Berita Acara (BA) pemeriksaan aset. Sebelum adanya sistem informasi terintegrasi, pencatatan surat masuk dan surat keluar masih dilakukan secara konvensional menggunakan buku agenda fisik dan lembar disposisi kertas.

Proses administrasi persuratan secara konvensional tersebut menimbulkan sejumlah kendala operasional. Pertama, proses penyampaian surat masuk dari bagian Tata Usaha (Admin) kepada Kepala Bidang Aset untuk didisposisikan ke Kasubid IPA atau Kasubid P3A membutuhkan waktu yang relatif lama apabila pimpinan sedang melaksanakan tugas dinas luar. Kedua, pelacakan status tindak lanjut (tracking) surat dan pencarian kembali arsip dokumen (retrieval) sulit dilakukan secara real-time karena dokumen fisik tersebar di masing-masing sub bidang. Ketiga, proses pengajuan draf surat keluar, BAST, dan BA belum memiliki mekanisme kontrol persetujuan (approval) dan koreksi digital yang terstruktur, serta rekapitulasi laporan buku agenda masih harus diketik ulang secara manual.

Berdasarkan permasalahan tersebut, penulis melaksanakan kegiatan Kerja Praktik dengan merancang dan membangun Sistem Informasi Manajemen Surat Masuk dan Surat Keluar (SIMANSUR) berbasis web pada Bidang Aset BPKAD Kota Pekanbaru. Sistem SIMANSUR dibangun menggunakan framework backend Laravel 11 dan library frontend React 18 dengan menerapkan alur persetujuan (approval) serta disposisi berjenjang wajib melalui Kepala Bidang Aset sebelum diteruskan kepada Kasubid IPA atau Kasubid P3A hingga ke staf pelaksana, dilengkapi fitur pencetakan Lembar Disposisi berformat PDF dan ekspor Buku Agenda berformat Microsoft Excel (`.xlsx`).


### Batasan Masalah

Agar pembahasan dan pengembangan sistem dalam pelaksanaan Kerja Praktik ini lebih terfokus dan sesuai dengan kebutuhan operasional instansi, maka ditetapkan batasan masalah sebagai berikut:

Pengembangan sistem difokuskan pada pengelolaan administrasi surat masuk, surat keluar (Surat Dinas, Berita Acara Serah Terima/BAST, dan Berita Acara/BA), disposisi berjenjang, serta pelaporan arsip pada Bidang Pengelolaan Aset (Sub Bidang IPA dan Sub Bidang P3A) BPKAD Kota Pekanbaru.

Sistem mendukung empat tingkatan hak akses (multi-role) sesuai struktur organisasi Bidang Aset, yaitu Admin (Tata Usaha Bidang Aset), Kepala Bidang Aset (Kabid Aset), Kepala Sub Bidang (Kasubid IPA dan Kasubid P3A), serta Staf Pelaksana (Staf IPA dan Staf P3A).

Alur persetujuan dan disposisi surat menerapkan aturan berjenjang wajib, di mana setiap surat masuk dan surat keluar yang diinput oleh Admin wajib diteruskan terlebih dahulu kepada Kepala Bidang Aset untuk direview, disetujui, atau didisposisikan kepada Kasubid IPA atau Kasubid P3A sebelum ditugaskan kepada Staf Pelaksana.

Sistem menyediakan mekanisme pengembalian atau permintaan koreksi (revisi) dua arah apabila terdapat kekeliruan data maupun lampiran dokumen surat sebelum surat disetujui oleh pimpinan.

Sistem dibangun menggunakan arsitektur full-stack web dengan framework Laravel 11 (PHP 8.2), antarmuka pengguna React 18 dan Tailwind CSS yang responsif untuk perangkat desktop maupun mobile, basis data MySQL, serta fitur cetak Lembar Disposisi PDF (DomPDF) dan ekspor Buku Agenda Excel (PhpSpreadsheet).


### Waktu dan Tempat Pelaksanaan

Adapun pelaksanaan kegiatan Kerja Praktik ini dilakukan pada:


### Tujuan

Adapun tujuan dari pelaksanaan Kerja Praktik dan pembangunan sistem informasi ini adalah sebagai berikut:

Merancang dan membangun Sistem Informasi Manajemen Surat Masuk dan Surat Keluar (SIMANSUR) berbasis web untuk mendigitalisasi proses pencatatan, pengarsipan, dan pelacakan dokumen persuratan pada Bidang Aset BPKAD Kota Pekanbaru.

Mengimplementasikan alur approval dan disposisi berjenjang secara elektronik dari Admin kepada Kepala Bidang Aset, diteruskan ke Kasubid IPA atau Kasubid P3A, hingga ke Staf Pelaksana sesuai kewenangan birokrasi instansi.

Menyediakan fitur pencetakan Lembar Disposisi resmi berformat PDF dan ekspor laporan Buku Agenda Surat Masuk serta Surat Keluar berformat Microsoft Excel (`.xlsx`) secara otomatis dan terstandarisasi.

Memenuhi salah satu persyaratan akademik untuk menyelesaikan Mata Kuliah Kerja Praktik pada Program Studi Teknik Informatika Politeknik Caltex Riau.


### Manfaat

Adapun manfaat yang diperoleh dari pelaksanaan Kerja Praktik ini adalah:

Membantu Kepala Bidang Aset, Kasubid IPA, dan Kasubid P3A BPKAD Kota Pekanbaru dalam memantau, menyetujui, dan mendisposisikan surat masuk maupun surat keluar secara cepat dan akurat dari perangkat desktop maupun mobile.

Mempermudah staf Tata Usaha (Admin) dan staf pelaksana Sub Bidang IPA serta Sub Bidang P3A dalam mengarsipkan dokumen digital, meminimalkan risiko kehilangan berkas fisik, serta mempercepat pencarian riwayat surat dan Berita Acara.

Meningkatkan efisiensi penyusunan laporan periodik melalui fitur pembuatan Lembar Disposisi PDF dan rekapitulasi Buku Agenda Excel secara otomatis.

Memberikan pengalaman kerja nyata bagi penulis dalam menganalisis kebutuhan sistem pemerintahan daerah dan mengimplementasikan rekayasa perangkat lunak full-stack pada lingkungan kerja profesional.


### Sistematika Penulisan

Sistematika penulisan laporan Kerja Praktik ini disusun secara keseluruhan ke dalam lima bab dengan rincian pembahasan sebagai berikut:

BAB I PENDAHULUAN

Bab ini menguraikan latar belakang permasalahan pengelolaan persuratan dan disposisi pada Bidang Aset BPKAD Kota Pekanbaru, batasan masalah, waktu dan tempat pelaksanaan Kerja Praktik, tujuan, manfaat, serta sistematika penulisan laporan.

BAB II PROFIL INSTANSI

Bab ini menjelaskan gambaran umum Badan Pengelola Keuangan dan Aset Daerah (BPKAD) Kota Pekanbaru yang meliputi sejarah singkat instansi, profil dan tugas pokok Bidang Pengelolaan Aset beserta Sub Bidang IPA dan Sub Bidang P3A, visi dan misi instansi, struktur organisasi Bidang Aset, serta lokasi instansi.

BAB III DASAR TEORI

Bab ini memuat landasan teori yang mendukung perancangan dan implementasi sistem SIMANSUR, meliputi konsep sistem informasi manajemen persuratan (e-Office), bahasa pemrograman PHP dan framework Laravel 11, library frontend React 18, Vite, dan Tailwind CSS, arsitektur Model-View-Controller (MVC) dan RESTful API, serta basis data relasional MySQL.

BAB IV PEMBAHASAN

Bab ini memaparkan rincian kegiatan mingguan selama pelaksanaan Kerja Praktik di Bidang Aset BPKAD Kota Pekanbaru, perancangan sistem menggunakan Use Case Diagram, Activity Diagram, dan Entity Relationship Diagram (ERD), serta pembahasan implementasi antarmuka sistem SIMANSUR untuk seluruh role pengguna.

BAB V PENUTUP

Bab ini berisi kesimpulan yang diperoleh dari hasil rancang bangun dan implementasi Sistem Informasi Manajemen Surat (SIMANSUR) pada Bidang Aset BPKAD Kota Pekanbaru serta saran pengembangan sistem di masa mendatang.


## BAB II 
PROFIL INSTANSI


### Sejarah Instansi BPKAD Kota Pekanbaru

Badan Pengelola Keuangan dan Aset Daerah (BPKAD) Kota Pekanbaru merupakan perangkat daerah di lingkungan Pemerintah Kota Pekanbaru yang menyelenggarakan fungsi penunjang urusan pemerintahan di bidang pengelolaan keuangan daerah dan Barang Milik Daerah (BMD). Secara historis, fungsi pengelolaan keuangan dan kekayaan daerah semula berada di bawah Sekretariat Daerah Kota Pekanbaru melalui Bagian Keuangan dan Bagian Perlengkapan.

Seiring dengan berlakunya kebijakan otonomi daerah dan reformasi pengelolaan keuangan negara berdasarkan Undang-Undang Nomor 17 Tahun 2003 tentang Keuangan Negara serta Peraturan Pemerintah Nomor 18 Tahun 2016 tentang Perangkat Daerah, Pemerintah Kota Pekanbaru membentuk Badan Pengelola Keuangan dan Aset Daerah (BPKAD) sebagai lembaga teknis daerah yang mengintegrasikan fungsi manajemen anggaran, perbendaharaan, akuntansi keuangan daerah, serta pengelolaan aset daerah dalam satu kesatuan organisasi.

Berdasarkan Peraturan Walikota Pekanbaru Nomor 113 Tahun 2021 tentang Kedudukan, Susunan Organisasi, Tugas dan Fungsi serta Tata Kerja Badan Pengelola Keuangan dan Aset Daerah Kota Pekanbaru, BPKAD berperan sebagai Pejabat Pengelola Keuangan Daerah (PPKD) sekaligus Pembantu Pengelola Barang Milik Daerah yang bertanggung jawab langsung kepada Walikota melalui Sekretaris Daerah Kota Pekanbaru.


### Profil Bidang Pengelolaan Aset (Sub Bidang IPA dan P3A)

Bidang Pengelolaan Aset merupakan salah satu bidang teknis utama di lingkungan BPKAD Kota Pekanbaru yang bertanggung jawab atas penyelenggaraan tata kelola Barang Milik Daerah (BMD) milik Pemerintah Kota Pekanbaru secara tertib fisik, tertib administrasi, dan tertib hukum sesuai amanat Peraturan Menteri Dalam Negeri Nomor 19 Tahun 2016 tentang Pedoman Pengelolaan Barang Milik Daerah.

Bidang Pengelolaan Aset dipimpin oleh Kepala Bidang Aset, Bapak Syafri Annur Aziz, S.H. (`NIP. 19750812 199803 1 002`), yang bertugas mengoordinasikan perumusan kebijakan teknis, pembinaan, pengawasan, serta pengendalian seluruh siklus pengelolaan aset daerah. Dalam pelaksanaan operasionalnya, Kepala Bidang Aset dibantu oleh dua Kepala Sub Bidang (Kasubid), yaitu:

Sub Bidang Inventarisasi dan Penghapusan Aset (Sub Bidang IPA): Dipimpin oleh Bapak Frima Boby Fatria, S.T. (`NIP. 19820315 200604 1 005`). Sub Bidang IPA menyelenggarakan fungsi perencanaan kebutuhan dan penganggaran BMD, pelaksanaan sensus dan inventarisasi aset daerah pada seluruh OPD, rekonsiliasi data Kartu Inventaris Barang (KIB A sampai KIB F), penilaian aset, serta pemrosesan administrasi pemindahtanganan dan penghapusan Barang Milik Daerah.

Sub Bidang Pemanfaatan, Penatausahaan, dan Pengamanan Aset (Sub Bidang P3A): Dipimpin oleh Bapak Hafid Hartamiarno, S.STP (`NIP. 19840620 200801 1 003`). Sub Bidang P3A menyelenggarakan fungsi penatausahaan pembukuan BMD, pengamanan fisik, administratif, dan hukum atas aset daerah (termasuk sertifikasi tanah milik Pemerintah Kota Pekanbaru dan penyimpanan dokumen kepemilikan kendaraan/bangunan), pengelolaan pemanfaatan aset daerah oleh pihak ketiga (sewa, pinjam pakai, kerja sama pemanfaatan, bangun guna serah), serta penyusunan Berita Acara Serah Terima (BAST) aset.

Dalam keseharian birokrasi pada Bidang Aset BPKAD Kota Pekanbaru, koordinasi antara Tata Usaha (Admin), Kepala Bidang Aset, Kasubid IPA, Kasubid P3A, serta staf pelaksana sangat bergantung pada ketertiban alur disposisi surat masuk dan persetujuan surat keluar yang menjadi objek digitalisasi pada sistem SIMANSUR.


### Visi dan Misi Instansi

Sebagai perangkat daerah Pemerintah Kota Pekanbaru, BPKAD Kota Pekanbaru mengemban visi dan misi yang selaras dengan Rencana Pembangunan Daerah (RPD) Kota Pekanbaru dalam mewujudkan tata kelola keuangan dan aset daerah yang transparan dan akuntabel.


#### Visi BPKAD Kota Pekanbaru

Adapun Visi dari Badan Pengelola Keuangan dan Aset Daerah (BPKAD) Kota Pekanbaru adalah: “Terwujudnya Pengelolaan Keuangan dan Aset Daerah yang Tertib, Transparan, Akuntabel, dan Profesional menuju Pekanbaru Smart City yang Madani.”


#### Misi BPKAD Kota Pekanbaru

Untuk mendukung terwujudnya visi tersebut, BPKAD Kota Pekanbaru menjalankan misi sebagai berikut:

Mewujudkan perencanaan anggaran daerah yang partisipatif, terukur, dan berbasis kinerja.

Meningkatkan kualitas penatausahaan, perbendaharaan, dan pelaporan pertanggungjawaban keuangan daerah sesuai Standar Akuntansi Pemerintahan (SAP).

Mewujudkan tata kelola Barang Milik Daerah (BMD) yang tertib administrasi, tertib fisik, dan tertib hukum melalui optimalisasi inventarisasi, pemanfaatan, penatausahaan, pengamanan, dan penghapusan aset daerah.

Mengembangkan sistem informasi manajemen keuangan dan aset daerah berbasis teknologi informasi untuk meningkatkan kecepatan dan akurasi layanan birokrasi.


### Struktur Organisasi Bidang Aset

Struktur organisasi Bidang Pengelolaan Aset pada Badan Pengelola Keuangan dan Aset Daerah (BPKAD) Kota Pekanbaru ditunjukkan pada Gambar 2.1 berikut:

Gambar 2.1 Struktur Organisasi Bidang Aset BPKAD Kota Pekanbaru

(Sumber: BPKAD Kota Pekanbaru, 2026)

Berdasarkan Gambar 2.1, Kepala Bidang Aset (Bapak Syafri Annur Aziz, S.H.) berada di bawah koordinasi langsung Kepala BPKAD Kota Pekanbaru dan didukung oleh Sekretariat/Tata Usaha Bidang. Kepala Bidang Aset membawahi langsung Kasubid Inventarisasi dan Penghapusan Aset (Bapak Frima Boby Fatria, S.T.) beserta Staf Pelaksana Sub Bidang IPA, serta Kasubid Pemanfaatan, Penatausahaan, dan Pengamanan Aset (Bapak Hafid Hartamiarno, S.STP) beserta Staf Pelaksana Sub Bidang P3A.


### Lokasi Instansi

Kantor Badan Pengelola Keuangan dan Aset Daerah (BPKAD) Kota Pekanbaru berlokasi di Kompleks Perkantoran Pemerintah Kota Pekanbaru Gedung B3 (Gedung Sultan Muhammad Ali Abdul Jalil Muazzamsyah), Jl. Abdul Rahman Hamid, Kelurahan Tuah Negeri, Kecamatan Tenayan Raya, Kota Pekanbaru, Provinsi Riau 28285. Peta lokasi instansi ditunjukkan pada Gambar 2.2 berikut:

Gambar 2.2 Lokasi BPKAD Kota Pekanbaru Kompleks Perkantoran Tenayan Raya

(Sumber: Dokumentasi Penulis, 2026)


## BAB III 
DASAR TEORI


### Sistem Informasi Manajemen Persuratan (e-Office)

Sistem informasi merupakan kombinasi terorganisir dari manusia (brainware), perangkat keras (hardware), perangkat lunak (software), jaringan komunikasi, dan sumber daya basis data yang mengumpulkan, mengolah, menyimpan, serta mendistribusikan informasi untuk mendukung pengambilan keputusan dan pengendalian di dalam suatu organisasi. Dalam konteks pemerintahan daerah, penerapan sistem informasi pada tata naskah dinas dikenal sebagai Electronic Office (e-Office) atau Sistem Informasi Manajemen Persuratan.

Manajemen persuratan mencakup pengelolaan dua jenis arsip dinamis utama, yaitu Surat Masuk dan Surat Keluar. Surat Masuk adalah seluruh naskah dinas yang diterima oleh instansi dari perangkat daerah atau pihak eksternal, sedangkan Surat Keluar adalah seluruh naskah dinas (termasuk Surat Dinas, Berita Acara Serah Terima/BAST, dan Berita Acara/BA) yang diterbitkan oleh instansi untuk dikirimkan kepada pihak lain. Di dalam birokrasi pemerintahan, setiap surat masuk memerlukan proses Disposisi Berjenjang, yaitu instruksi tertulis dari pejabat struktural yang lebih tinggi (Kepala Bidang) kepada pejabat di bawahnya (Kepala Sub Bidang dan Staf Pelaksana) mengenai tindak lanjut penyelesaian surat tersebut.


### Bahasa Pemrograman PHP dan Framework Laravel 11

PHP (Hypertext Preprocessor) merupakan bahasa pemrograman server-side scripting bersifat open-source yang dirancang khusus untuk pengembangan aplikasi web dinamis. Pada pengembangan sistem SIMANSUR, digunakan PHP versi 8.2 dengan framework Laravel 11. Laravel adalah framework aplikasi web berbasis PHP yang ekspresif, modern, dan aman dengan menerapkan pola arsitektur Model-View-Controller (MVC).

Beberapa komponen utama pada framework Laravel 11 yang diimplementasikan dalam pembangunan sistem SIMANSUR antara lain:

Eloquent ORM (Object-Relational Mapping):* Memungkinkan interaksi dengan tabel-tabel basis data MySQL menggunakan representasi objek model PHP serta manajemen relasi antar-tabel (hasMany, belongsTo) secara bersih dan aman dari serangan SQL Injection*.

Laravel Sanctum:* Menyediakan sistem autentikasi berbasis token API (Bearer Token) yang ringan dan aman untuk aplikasi Single Page Application* (SPA) berbasis React.

Middleware & Kontrol Akses:* Memvalidasi sesi pengguna, peran (role), serta mendukung autentikasi unduhan dokumen melalui custom middleware* (`AuthenticateWithQueryToken`) untuk pencetakan PDF dan ekspor Excel.

Pustaka DomPDF dan PhpSpreadsheet: Pustaka `barryvdh/laravel-dompdf` digunakan untuk merender template Blade HTML menjadi dokumen PDF resmi (Lembar Disposisi dan Laporan), sedangkan `phpoffice/phpspreadsheet` digunakan untuk menghasilkan berkas spreadsheet Microsoft Excel (`.xlsx`) asli lengkap dengan styling* tabel dan tanda tangan pejabat.


### Library Frontend React 18, Vite, dan Tailwind CSS

Pada sisi antarmuka pengguna (frontend), sistem SIMANSUR dikembangkan sebagai Single Page Application (SPA) menggunakan React 18 yang dibundel dengan Vite serta dirancang tampilannya menggunakan Tailwind CSS. React 18 memungkinkan pembangunan antarmuka berbasis komponen (component-based UI) yang reaktif, sehingga perpindahan antar-halaman (routing melalui React Router v6), pemfilteran surat, hingga pembukaan jendela modal disposisi berlangsung secara instan tanpa memuat ulang keseluruhan halaman peramban (full page reload).

Gambar 3.1 Arsitektur Full-Stack Laravel 11 REST API dan React 18 SPA

(Sumber: Dokumentasi Penulis, 2026)

Sebagaimana ditunjukkan pada Gambar 3.1, frontend React 18 berkomunikasi dengan backend Laravel 11 melalui protokol HTTP/JSON menggunakan pustaka Axios. Penggunaan framework CSS utility-first Tailwind CSS memastikan tata letak aplikasi bersifat mobile-responsive, sehingga Kepala Bidang Aset maupun Kasubid IPA dan P3A dapat membuka aplikasi dan melakukan approval surat dengan nyaman baik melalui layar komputer desktop maupun ponsel pintar (smartphone).


### Konsep Model – View – Controller (MVC) dan RESTful API

Pola arsitektur Model-View-Controller (MVC) memisahkan logika aplikasi menjadi tiga lapisan yang saling terintegrasi untuk memudahkan pemeliharaan kode (maintainability) dan pengujian sistem. Konsep arsitektur MVC ditunjukkan pada Gambar 3.2 berikut:

Gambar 3.2 Konsep Arsitektur Model-View-Controller (MVC)

(Sumber: Dokumentasi Penulis, 2026)

Berdasarkan Gambar 3.2, peran dari masing-masing komponen dalam sistem SIMANSUR adalah sebagai berikut:

Model (Manajemen Data):* Bertanggung jawab penuh atas struktur data dan aturan bisnis basis data. Pada SIMANSUR, lapisan Model* mencakup `User`, `SuratMasuk`, `SuratKeluar`, `TindakLanjut`, `TindakLanjutKeluar`, `Notifikasi`, dan `LogAktivitas`.

View (Tampilan Antarmuka):* Bertugas menyajikan data kepada pengguna. Pada SIMANSUR, lapisan View terdiri atas komponen halaman React (`.jsx`) untuk antarmuka web interaktif serta template* Blade (`.blade.php`) untuk tata letak cetakan dokumen PDF.

Controller (Pengendali Logika Bisnis):* Bertindak sebagai penghubung antara Model dan View melalui endpoint RESTful API, mencakup validasi hak akses role, pengaturan transisi status disposisi berjenjang (`Menunggu Kabid`, `Menunggu Kasubid`, `Didisposisi`, `Diarsipkan`), pencatatan log* aktivitas, serta pengiriman notifikasi otomatis.


### Basis Data Relasional MySQL

MySQL merupakan Relational Database Management System (RDBMS) bersifat open-source berbasis Structured Query Language (SQL) yang menyimpan data dalam bentuk tabel-tabel yang saling berelasi melalui kunci utama (Primary Key) dan kunci tamu (Foreign Key). Pada sistem SIMANSUR, MySQL digunakan untuk menjamin integritas referensial (referential integrity) antara data pengguna pejabat/staf, registrasi surat masuk dan surat keluar, histori tindak lanjut disposisi, notifikasi pengguna, hingga rekam jejak audit (audit trail).


## BAB IV 
PEMBAHASAN


### Kegiatan Kerja Praktik

Kegiatan Kerja Praktik dilaksanakan pada Bidang Pengelolaan Aset (Sub Bidang IPA dan Sub Bidang P3A) Badan Pengelola Keuangan dan Aset Daerah (BPKAD) Kota Pekanbaru mulai tanggal 25 Agustus 2025 hingga 15 Januari 2026 dengan waktu kerja hari Senin hingga Jumat pukul 08.00 – 16.00 WIB. Rincian kegiatan bulanan yang dilaksanakan selama Kerja Praktik disajikan pada Tabel 4.1 berikut:

Tabel 4.1 Kegiatan Kerja Praktik pada Bidang Aset BPKAD Kota Pekanbaru


### Gambaran Umum Sistem SIMANSUR

Sistem Informasi Manajemen Surat Masuk dan Surat Keluar (SIMANSUR) adalah aplikasi berbasis web yang dirancang khusus untuk mengakomodasi hierarki komando dan administrasi persuratan pada Bidang Pengelolaan Aset BPKAD Kota Pekanbaru. Sistem ini mengintegrasikan proses registrasi surat, verifikasi dan approval Kepala Bidang Aset, pendisposisian ke Sub Bidang IPA atau Sub Bidang P3A, pelaporan tindak lanjut staf, hingga pengarsipan digital dan pencetakan laporan resmi.

Pembagian matriks hak akses dan kewenangan pengguna pada sistem SIMANSUR disajikan pada Tabel 4.2 berikut:

Tabel 4.2 Matriks Hak Akses dan Kewenangan Pengguna Sistem SIMANSUR


#### Use Case Diagram

Use Case Diagram memvisualisasikan interaksi antara keempat aktor pengguna (Admin, Kabid Aset, Kasubid IPA/P3A, dan Staf IPA/P3A) dengan fungsionalitas utama di dalam sistem SIMANSUR. Use Case Diagram sistem SIMANSUR ditunjukkan pada Gambar 4.1 berikut:

Gambar 4.1 Use Case Diagram Sistem SIMANSUR BPKAD Kota Pekanbaru

(Sumber: Dokumentasi Penulis, 2026)

Sebagaimana terlihat pada Gambar 4.1, seluruh aktor wajib melalui proses Login (`<<include>>`) sebelum mengakses fitur sistem. Aktor Admin memiliki akses penuh terhadap registrasi surat masuk, pembuatan draf surat keluar, perbaikan data koreksi, manajemen pengguna, dan ekspor laporan. Aktor Kepala Bidang Aset berperan sebagai gatekeeper utama yang menyetujui dan mendisposisikan surat ke Sub Bidang IPA atau P3A, sedangkan Kasubid dan Staf Pelaksana menjalankan disposisi operasional pada sub bidang masing-masing.


#### Activity Diagram

Activity Diagram menggambarkan aliran kerja (workflow) proses bisnis persuratan dan interaksi antara aktor pengguna dengan sistem SIMANSUR secara sekuensial maupun bercabang.

Activity Diagram Pengelolaan & Disposisi Surat Masuk

Alur proses pencatatan surat masuk oleh Admin hingga disposisi berjenjang melalui Kepala Bidang Aset, Kasubid IPA/P3A, dan Staf Pelaksana ditunjukkan pada Gambar 4.2 berikut:

Gambar 4.2 Activity Diagram Alur Pengelolaan dan Disposisi Surat Masuk

(Sumber: Dokumentasi Penulis, 2026)

Gambar 4.2 menjelaskan bahwa setiap surat masuk yang diinput oleh Admin secara otomatis berstatus `Menunggu Kabid` dan dikirimkan notifikasinya kepada Kepala Bidang Aset (Bapak Syafri Annur Aziz, S.H.). Apabila ditemukan kekeliruan input atau lampiran, Kepala Bidang Aset atau Kasubid dapat menekan aksi Minta Koreksi, sehingga status surat berubah menjadi `Perlu Koreksi Admin` untuk diperbaiki oleh Admin dan diajukan ulang (`Resubmit`). Apabila surat telah sesuai, Kepala Bidang Aset memilih tujuan disposisi ke Sub Bidang IPA (Bapak Frima Boby Fatria, S.T.) atau Sub Bidang P3A (Bapak Hafid Hartamiarno, S.STP) hingga ditindaklanjuti oleh Staf Pelaksana dan berstatus `Diarsipkan`.

Activity Diagram Pengelolaan & Approval Surat Keluar

Alur proses pengajuan draf surat keluar (Surat Dinas, BAST, dan BA) beserta persetujuan berjenjang ditunjukkan pada Gambar 4.3 berikut:

Gambar 4.3 Activity Diagram Alur Pengelolaan dan Approval Surat Keluar

(Sumber: Dokumentasi Penulis, 2026)

Gambar 4.3 menunjukkan bahwa draf surat keluar, Berita Acara Serah Terima (BAST), maupun Berita Acara (BA) yang diregistrasi oleh Admin wajib memperoleh persetujuan (approval) dari Kepala Bidang Aset terlebih dahulu sebelum diteruskan kepada Kasubid IPA atau Kasubid P3A untuk verifikasi sub bidang dan penugasan staf hingga dokumen resmi diarsipkan.

Activity Diagram Cetak Disposisi PDF & Ekspor Agenda Excel

Alur proses pencetakan Lembar Disposisi PDF dan pengunduhan Buku Agenda Excel ditunjukkan pada Gambar 4.4 berikut:

Gambar 4.4 Activity Diagram Cetak Lembar Disposisi PDF dan Ekspor Excel

(Sumber: Dokumentasi Penulis, 2026)

Gambar 4.4 memperlihatkan mekanisme pencetakan laporan di mana pengguna dapat memfilter periode tanggal, kategori dokumen, maupun status surat, kemudian memilih cetak PDF (dirender melalui DomPDF lengkap dengan kop surat BPKAD Kota Pekanbaru dan blok tanda tangan Kepala Bidang Aset) atau ekspor Excel `.xlsx` (dirender melalui `ExcelExportService` berbasis PhpSpreadsheet).


#### Entity Relationship Diagram (ERD)

Perancangan basis data sistem SIMANSUR menggunakan model relasional MySQL yang terdiri atas 7 tabel utama yang saling berelasi. Skema Entity Relationship Diagram (ERD) sistem SIMANSUR ditunjukkan pada Gambar 4.5 berikut:

Gambar 4.5 Entity Relationship Diagram (ERD) Basis Data SIMANSUR

(Sumber: Dokumentasi Penulis, 2026)

Rincian spesifikasi ketujuh tabel pada basis data sistem SIMANSUR dijelaskan pada Tabel 4.3 berikut:

Tabel 4.3 Spesifikasi Struktur Tabel Basis Data Sistem SIMANSUR


### Implementasi Antarmuka Sistem

Tahap implementasi antarmuka merupakan realisasi dari perancangan sistem SIMANSUR ke dalam bentuk aplikasi web interaktif yang digunakan oleh seluruh role pengguna di lingkungan Bidang Pengelolaan Aset BPKAD Kota Pekanbaru.


#### Antarmuka Autentikasi dan Dashboard Multi-Role

Halaman Login merupakan gerbang autentikasi utama sebelum pengguna dapat mengakses fitur SIMANSUR. Tampilan halaman Login ditunjukkan pada Gambar 4.6 berikut:

Gambar 4.6 Antarmuka Halaman Login SIMANSUR BPKAD Kota Pekanbaru

(Sumber: Implementasi Sistem SIMANSUR, 2026)

Gambar 4.6 menampilkan formulir masuk menggunakan alamat email kedinasan dan kata sandi (password). Setelah pengguna berhasil melakukan login, sistem secara otomatis menyajikan halaman Dashboard yang disesuaikan dengan peran (role) pengguna masing-masing, sebagaimana ditunjukkan pada Gambar 4.7 hingga Gambar 4.10 berikut:

Gambar 4.7 Antarmuka Dashboard Tata Usaha / Admin Persuratan

(Sumber: Implementasi Sistem SIMANSUR, 2026)

Gambar 4.7 menunjukkan Dashboard Admin yang menampilkan kartu ringkasan total surat masuk, total surat keluar, jumlah surat yang memerlukan koreksi Admin, serta grafik tren persuratan bulanan.

Gambar 4.8 Antarmuka Dashboard Kepala Bidang Aset (Syafri Annur Aziz, S.H.)

(Sumber: Implementasi Sistem SIMANSUR, 2026)

Gambar 4.8 menampilkan Dashboard khusus Kepala Bidang Aset (Bapak Syafri Annur Aziz, S.H.) yang menonjolkan indikator jumlah surat masuk dan surat keluar berstatus `Menunggu Kabid` agar pimpinan dapat segera melakukan review dan disposisi.

Gambar 4.9 Antarmuka Dashboard Kasubid IPA (Frima Boby Fatria, S.T.)

(Sumber: Implementasi Sistem SIMANSUR, 2026)

Gambar 4.9 menunjukkan Dashboard Kepala Sub Bidang IPA (Bapak Frima Boby Fatria, S.T.) yang secara spesifik menyaring surat-surat yang telah didisposisikan oleh Kepala Bidang Aset ke Sub Bidang Inventarisasi dan Penghapusan Aset (`ipa`), sedangkan surat untuk Sub Bidang P3A ditampilkan pada akun Kasubid P3A (Bapak Hafid Hartamiarno, S.STP).

Gambar 4.10 Antarmuka Dashboard Staf Pelaksana Sub Bidang

(Sumber: Implementasi Sistem SIMANSUR, 2026)

Gambar 4.10 menampilkan Dashboard Staf Pelaksana yang menyajikan daftar tugas disposisi aktif yang diteruskan oleh Kasubid masing-masing untuk segera ditindaklanjuti.


#### Antarmuka Pengelolaan Surat Masuk dan Disposisi

Halaman Pengelolaan Surat Masuk berfungsi untuk meregistrasi surat masuk baru, mencari dan memfilter surat berdasarkan sifat maupun status, serta memproses alur disposisi berjenjang. Tampilan daftar Surat Masuk dan jendela modal detail disposisi ditunjukkan pada Gambar 4.11 dan Gambar 4.12 berikut:

Gambar 4.11 Antarmuka Halaman Pengelolaan Surat Masuk

(Sumber: Implementasi Sistem SIMANSUR, 2026)

Gambar 4.12 Antarmuka Modal Detail Surat Masuk, Riwayat, dan Disposisi

(Sumber: Implementasi Sistem SIMANSUR, 2026)

Sebagaimana ditunjukkan pada Gambar 4.11 dan Gambar 4.12, setiap surat masuk dilengkapi lencana (badge) sifat surat (`Biasa`, `Segera`, `Sangat Segera`, `Rahasia`) dan indikator posisi surat saat ini. Pada jendela modal Detail Surat Masuk (Gambar 4.12), Kepala Bidang Aset dapat melihat pratinjau dokumen PDF, membaca lini masa (timeline) riwayat tindak lanjut, memilih tujuan disposisi ke Kasubid IPA atau Kasubid P3A, meminta koreksi ke Admin, serta mencetak Lembar Disposisi PDF.


#### Antarmuka Pengelolaan Surat Keluar (Surat, BAST, BA)

Modul Surat Keluar pada SIMANSUR dirancang khusus untuk mendukung tiga kategori naskah dinas yang berlaku di Bidang Aset BPKAD Kota Pekanbaru, yaitu Surat Dinas (`Surat`), Berita Acara Serah Terima (`BAST`), dan Berita Acara (`BA`). Tampilan halaman Surat Keluar ditunjukkan pada Gambar 4.13 berikut:

Gambar 4.13 Antarmuka Halaman Pengelolaan Surat Keluar (Surat, BAST, BA)

(Sumber: Implementasi Sistem SIMANSUR, 2026)

Gambar 4.13 menampilkan tabel daftar surat keluar yang dilengkapi tab filter kategori dokumen (`Semua`, `Surat`, `BAST`, `BA`) serta alur approval berjenjang dari Admin ke Kepala Bidang Aset, diteruskan ke Kasubid IPA atau Kasubid P3A, hingga proses pengarsipan selesai.


#### Antarmuka Manajemen Pengguna, Laporan, dan Mobile

Untuk mendukung pengelolaan akun pegawai berdasarkan jabatan dan sub bidang serta penyusunan laporan resmi instansi, sistem menyediakan halaman Manajemen Pengguna, halaman Laporan & Cetak Dokumen, serta antarmuka responsif untuk perangkat mobile sebagaimana ditunjukkan pada Gambar 4.14, Gambar 4.15, dan Gambar 4.16 berikut:

Gambar 4.14 Antarmuka Halaman Manajemen Pengguna (User Management)

(Sumber: Implementasi Sistem SIMANSUR, 2026)

Gambar 4.14 memperlihatkan halaman Manajemen Pengguna di mana Admin dapat mengelola akun Kepala Bidang Aset, Kasubid IPA, Kasubid P3A, dan Staf Pelaksana beserta atribut NIP dan sub bidangnya.

Gambar 4.15 Antarmuka Halaman Laporan & Cetak Dokumen Resmi (PDF/Excel)

(Sumber: Implementasi Sistem SIMANSUR, 2026)

Gambar 4.15 menampilkan halaman Laporan & Cetak Dokumen yang memungkinkan pengguna mengunduh Buku Agenda Surat Masuk dan Surat Keluar dalam format PDF maupun Microsoft Excel (`.xlsx`) lengkap dengan kop resmi BPKAD Kota Pekanbaru dan blok pengesahan Kepala Bidang Aset (Bapak Syafri Annur Aziz, S.H.).

Gambar 4.16 Tampilan Responsif SIMANSUR pada Perangkat Mobile

(Sumber: Implementasi Sistem SIMANSUR, 2026)

Gambar 4.16 menunjukkan antarmuka SIMANSUR saat diakses melalui peramban ponsel pintar (smartphone), di mana menu navigasi samping beradaptasi menjadi slide-over drawer dan tabel persuratan dapat digulir secara proporsional untuk memudahkan pimpinan memantau disposisi saat bertugas di luar kantor.


## BAB V 
PENUTUP


### Kesimpulan

Berdasarkan hasil analisis kebutuhan, perancangan, implementasi, dan pengujian Sistem Informasi Manajemen Surat Masuk dan Surat Keluar (SIMANSUR) pada Bidang Pengelolaan Aset Badan Pengelola Keuangan dan Aset Daerah (BPKAD) Kota Pekanbaru, dapat diambil kesimpulan sebagai berikut:

Sistem SIMANSUR berhasil mentransformasikan pengelolaan administrasi surat masuk, surat keluar, Berita Acara Serah Terima (BAST), dan Berita Acara (BA) pada Bidang Pengelolaan Aset BPKAD Kota Pekanbaru dari pencatatan buku agenda manual menjadi sistem terpusat berbasis web.

Alur persetujuan (approval) dan disposisi berjenjang berhasil diimplementasikan secara terstruktur sesuai hierarki organisasi Bidang Aset, yaitu dari Admin (Tata Usaha) wajib melalui Kepala Bidang Aset (Bapak Syafri Annur Aziz, S.H.), diteruskan secara spesifik kepada Kasubid IPA (Bapak Frima Boby Fatria, S.T.) atau Kasubid P3A (Bapak Hafid Hartamiarno, S.STP), hingga ditindaklanjuti oleh Staf Pelaksana.

Fitur permintaan koreksi (revisi) dua arah, lini masa riwayat tindak lanjut, notifikasi otomatis, serta pencatatan log aktivitas (audit trail) meningkatkan akuntabilitas dan transparansi pelacakan posisi surat secara real-time.

Fitur pencetakan Lembar Disposisi berformat PDF (DomPDF) dan ekspor laporan Buku Agenda berformat Microsoft Excel (`.xlsx`) melalui PhpSpreadsheet mempercepat penyusunan laporan periodik Bidang Aset secara rapi dan terstandarisasi.


### Saran

Adapun saran yang dapat diberikan untuk pengembangan sistem SIMANSUR pada masa mendatang adalah sebagai berikut:

Mengintegrasikan sistem SIMANSUR dengan layanan Tanda Tangan Elektronik (TTE) tersertifikasi Balai Sertifikasi Elektronik (BSrE) BSSN guna mendukung pengesahan dokumen surat keluar dan Berita Acara secara kriptografis.

Menambahkan integrasi notifikasi eksternal melalui layanan WhatsApp Gateway atau surat elektronik (email) agar pejabat struktural dan staf pelaksana segera menerima pemberitahuan pada perangkat seluler ketika terdapat surat bersifat `Sangat Segera` atau `Rahasia`.

Mengembangkan fitur Optical Character Recognition (OCR) pada saat pengunggahan hasil pindai (scan) berkas PDF agar isi dokumen fisik dapat diindeks dan dicari secara full-text search.


## DAFTAR PUSTAKA

Kementerian Dalam Negeri Republik Indonesia. (2016). Peraturan Menteri Dalam Negeri Nomor 19 Tahun 2016 tentang Pedoman Pengelolaan Barang Milik Daerah. Jakarta: Kemendagri RI.

Pemerintah Kota Pekanbaru. (2021). Peraturan Walikota Pekanbaru Nomor 113 Tahun 2021 tentang Kedudukan, Susunan Organisasi, Tugas dan Fungsi serta Tata Kerja Badan Pengelola Keuangan dan Aset Daerah Kota Pekanbaru. Pekanbaru: Sekretariat Daerah Kota Pekanbaru.

Laudon, K. C., & Laudon, J. P. (2022). Management Information Systems: Managing the Digital Firm (17th ed.). Harlow: Pearson Education.

Melisa, S., Mayusdilla, H., Zulfanaur, R., Alfarizi, M. R., & Rahayu, S. (2024). Pengembangan Sistem Informasi untuk Meningkatkan Pelayanan dan Efisiensi Operasional. Jurnal Ilmu Komputer, 5(1), 12–21.

Pressman, R. S., & Maxim, B. R. (2020). Software Engineering: A Practitioner’s Approach (9th ed.). New York: McGraw-Hill Education.

Rinjani, A., & Munir, S. (2022). Perancangan Sistem Pengelola Inventaris dan Persuratan Berbasis Web Menggunakan Framework MVC. Jurnal Informatika Terpadu, 8(1), 1–7.

Stauffer, M. (2023). Laravel: Up & Running: A Framework for Building Modern PHP Apps (3rd ed.). Sebastopol: O’Reilly Media.

The Laravel Team. (2024). Laravel 11.x Official Documentation. Diakses dari https://laravel.com/docs/11.x

Meta Open Source. (2024). React 18 Official Documentation. Diakses dari https://react.dev


## LAMPIRAN A

LOGBOOK KEHADIRAN KERJA PRAKTIK


## LAMPIRAN B

LOGBOOK BIMBINGAN KERJA PRAKTIK


## LAMPIRAN C

DOKUMENTASI KERJA PRAKTIK
