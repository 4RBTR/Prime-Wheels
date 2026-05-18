# 🚗 Prime Wheels — Premium Executive Car Rental Platform

![Next.js Version](https://img.shields.io/badge/Next.js-16.1.1-blue?style=for-the-badge&logo=nextdotjs&logoColor=white)
![React Version](https://img.shields.io/badge/React-19.2.3-00d8ff?style=for-the-badge&logo=react&logoColor=black)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4-38bdf8?style=for-the-badge&logo=tailwindcss&logoColor=white)
![Supabase](https://img.shields.io/badge/Supabase-Database-3ecf8e?style=for-the-badge&logo=supabase&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue?style=for-the-badge&logo=typescript&logoColor=white)
![Vercel](https://img.shields.io/badge/Vercel-Deployed-black?style=for-the-badge&logo=vercel&logoColor=white)

**Prime Wheels** adalah platform penyewaan mobil mewah dan eksekutif modern yang menggabungkan kemewahan visual premium dengan sistem keamanan & operasional tingkat tinggi. 

Aplikasi ini dibangun menggunakan teknologi terbaru **Next.js 16** dan **React 19**, dengan integrasi **Supabase Realtime Database**, sistem otentikasi aman **NextAuth.js**, sistem kompresi gambar cerdas, serta antarmuka elegan bergaya **Apple Premium Light Aesthetic** dengan palet warna dominan **Royal Blue & Slate HSL**.

🌐 **Live Demo & Deployment:** [https://prime-wheels-wheat.vercel.app/](https://prime-wheels-wheat.vercel.app/)

---

## ✨ Fitur Unggulan Utama (Premium Features)

### 1. 📂 Manajemen & Verifikasi e-KYC Interaktif (`/admin/customers`)
* **Persetujuan Langsung (Direct Actions):** Admin dapat menyetujui (`Approve`) atau menolak (`Reject`) dokumen e-KYC (KTP & Selfie) pengguna secara langsung dari halaman direktori pelanggan tanpa reload halaman.
* **Integrasi Keamanan:** Menggunakan verifikasi berbasis state dan terhubung langsung dengan endpoint aman `/api/customers/kyc` disertai notifikasi interaktif yang ditenagai oleh **SweetAlert2**.

### 2. 📊 Detail Pelanggan & Riwayat Transaksi Komprehensif
* **Collapsible Detail Panel:** Setiap baris kartu pelanggan dapat diekspansi secara interaktif untuk menampilkan profil mendalam:
  * **Statistik Finansial Ringkas:** Menampilkan Total Sewa/Booking, Total Pengeluaran (diformat dengan standar mata uang Rupiah `IDR`), dan tanggal sewa terakhir.
  * **Tabel Riwayat Booking:** Menampilkan tabel riwayat sewa kendaraan yang mencakup Kode Booking, Merek/Tipe Mobil, Durasi Periode Sewa, Total Biaya, Status Operasional (On Road, Returned, Cancelled), dan Status Pembayaran (Paid, DP Paid, Pending).

### 3. 🖼️ In-App Document Preview Modal (Anti Pindah Tab)
* **Popup Viewer Responsif:** Menggantikan tautan eksternal `target="_blank"` konvensional. Peninjauan dokumen sensitif seperti foto KTP, Selfie verifikasi, Bukti Transfer DP, maupun Bukti Pelunasan kini dibuka secara instan di dalam **Popup Modal Khusus** yang elegan.
* **Optimalisasi Lintas Perangkat:** Didesain dengan teknik fluid layouts dan kontrol `max-height` agar tetap nyaman dan tajam ketika dibuka dari smartphone, tablet, maupun layar desktop lebar.

### 4. 🗜️ Client-Side Smart Image Compression Utility
* **Solusi Payload Besar Vercel:** Mengatasi pembatasan Vercel Serverless Function Limit (`413 Payload Too Large` / max 4.5MB).
* **Teknologi HTML5 Canvas:** File gambar besar beresolusi tinggi (misal: foto e-KYC dari kamera smartphone modern berukuran hingga 10MB) secara otomatis dikompresi di sisi browser menjadi di bawah **500KB** sebelum dikirim ke server. Rasio aspek gambar dan tingkat keterbacaan teks (OCR-friendly) pada KTP tetap terjaga dengan tajam.

### 5. 📱 Audit & Perbaikan Responsivitas Global (Tablet & Mobile)
* **Penyelarasan Breakpoint:** Memperbaiki bug visual pada lebar layar tablet (768px hingga 1024px) di mana menu navigasi utama serta tombol burger menu mobile sempat tersembunyi.
* **Unified Layout:** Standarisasi transisi layout di [AdminSidebar.tsx](file:///c:/Tugas%20Produktif/Project%20KIK/Prime%20wheels/src/components/AdminSidebar.tsx) dan [CustomerLayout.tsx](file:///c:/Tugas%20Produktif/Project%20KIK/Prime%20wheels/src/app/customer/layout.tsx) ke breakpoint `lg`, menjamin navigasi yang sangat lancar dan fungsional di perangkat mana pun.

---

## 🛠️ Stack Teknologi

| Komponen | Teknologi | Deskripsi |
| :--- | :--- | :--- |
| **Inti Platform** | **Next.js 16.1.1** & **React 19.2.3** | Menggunakan App Router untuk performa render kilat (SSR/CSR) |
| **Sistem Styling** | **Tailwind CSS v4** & **PostCSS** | Apple Premium Light Aesthetic dengan harmoni warna Royal Blue & HSL |
| **Basis Data** | **Supabase Database (PostgreSQL)** | Penyimpanan data relasional real-time dengan proteksi RLS |
| **Autentikasi** | **NextAuth.js (v4)** | Otentikasi sesi terproteksi berbasis JSON Web Token (JWT) |
| **Visualisasi Ikon**| **Lucide React** | Paket ikon antarmuka yang seragam, bersih, dan tajam |
| **Grafik Dashboard**| **Recharts** | Visualisasi analitik pendapatan & aktivitas rental real-time |
| **Notifikasi** | **SweetAlert2** | Pop-up konfirmasi interaktif yang modern |

---

## 🚀 Panduan Instalasi & Pengembangan Lokal

### **1. Kloning Repositori**
Buka terminal Anda, jalankan perintah berikut untuk mengkloning repositori ini:
```bash
git clone https://github.com/4RBTR/Prime-Wheels.git
cd Prime-Wheels
```

### **2. Pasang Dependensi**
Instal paket-paket modul Node.js yang diperlukan:
```bash
npm install
```

### **3. Konfigurasi Environment Variables (`.env.local`)**
Buat berkas `.env.local` pada direktori utama (root) proyek Anda dan lengkapi konfigurasi berikut:
```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL="https://your-project-id.supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="...your-anon-key"

# Database Connections (PostgreSQL)
DATABASE_URL="postgresql://postgres:password@your-host.supabase.co:6543/postgres"
DIRECT_URL="postgresql://postgres:password@your-host.supabase.co:5432/postgres"

# NextAuth Credentials
NEXTAUTH_SECRET="kunci-rahasia-unik-acak-anda-untuk-jwt"
NEXTAUTH_URL="http://localhost:3000"
```

### **4. Jalankan Server Pengembangan**
Jalankan aplikasi di lingkungan lokal:
```bash
npm run dev
```
Buka peramban browser Anda di tautan [**http://localhost:3000**](http://localhost:3000).

---

## 🏢 Struktur Arsitektur Direktori

* 📁 `src/app/` : Direktori utama Next.js App Router.
  * 📁 `admin/` : Panel kontrol admin (Manajemen Armada, Verifikasi Pembayaran, Direktori e-KYC).
  * 📁 `customer/` : Dasbor terpusat khusus pelanggan (Katalog Mobil, Riwayat Pemesanan, Status Invoice, Profil).
  * 📁 `api/` : Endpoint serverless backend (Autentikasi, Verifikasi KYC, Kontrol Booking & Transaksi).
* 📁 `src/components/` : Komponen antarmuka modular (Navigasi, Grafik Real-Time, Sidebar).
* 📁 `src/lib/` : Utilitas pendukung, seperti inisialisasi klien Supabase dan utility kompresi gambar (`image-compression.ts`).

---

## 🏢 Alur Transaksi & Operasional (Simulasi Platform)

1. **Konfigurasi Armada Mobil:** Admin masuk ke dashboard `/admin/dashboard`, membuka menu **Fleet**, lalu mendaftarkan armada mobil eksekutif beserta kuantitas unit fisik dan tarif sewa per hari.
2. **Pendaftaran & e-KYC:** Pelanggan mendaftar akun baru sebagai `USER`, lalu melengkapi profil e-KYC mereka dengan mengunggah KTP dan Selfie.
3. **Persetujuan Dokumen:** Admin meninjau e-KYC pelanggan langsung dari direktori pelanggan dengan peninjauan modal popup internal yang responsif dan menyetujuinya.
4. **Pemesanan Armada:** Pelanggan yang telah disetujui (Status: `Approved`) memilih kendaraan di katalog, memasukkan tanggal sewa dan jumlah unit kendaraan, mengunggah bukti transfer DP (30%) atau Lunas (Full), dan mengajukan checkout.
5. **Konfirmasi & Operasional:** Admin menyetujui pembayaran di menu **Bookings**, melepas mobil kepada penyewa (Status: `On Road`), dan dapat menyetel status mobil ke "Hold for Maintenance" saat unit dikembalikan untuk servis berkala secara parsial.

---

## 📦 Verifikasi Kompilasi Produksi (Build Check)
Semua kode pada proyek ini telah divalidasi dan dijamin bebas dari error kompilasi Next.js/TypeScript. Untuk melakukan build mandiri:
```bash
npm run build
```
Hasil kompilasi akan menghasilkan rute statis & dinamis yang sangat teroptimasi dengan kode status keluar **0** (Sukses).

---

✨ *Developed proudly with elite standards as a modern, safe, and luxury automotive rental ecosystem.*
