# 🚗 Prime Wheels — Premium Executive Car Rental

![Next.js Version](https://img.shields.io/badge/Next.js-16.1.1-blue?style=for-the-badge&logo=nextdotjs)
![React Version](https://img.shields.io/badge/React-19.2.3-00d8ff?style=for-the-badge&logo=react)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4-38bdf8?style=for-the-badge&logo=tailwindcss)
![Supabase](https://img.shields.io/badge/Supabase-Database-3ecf8e?style=for-the-badge&logo=supabase)
![Vercel](https://img.shields.io/badge/Vercel-Deployed-black?style=for-the-badge&logo=vercel)

**Prime Wheels** adalah platform penyewaan mobil premium modern yang menggabungkan kemewahan visual dengan keamanan sistem tingkat tinggi. Aplikasi ini dirancang menggunakan kerangka kerja **Next.js 16** terbaru, mengintegrasikan **Supabase Realtime DB**, alur otentikasi tangguh **NextAuth.js**, sistem pembayaran aman **Midtrans**, serta antarmuka elegan bergaya **Premium Apple Light Aesthetic** dengan warna dominan **Royal Blue**.


🌐 **Live Demo & Deployment:** [https://prime-wheels.vercel.app](https://prime-wheels.vercel.app) 
=======

---

## ✨ Fitur Utama

*   **🎨 Unified Premium Light Design**: Tampilan minimalis, bersih, dan mewah yang seragam di seluruh platform (Landing Page, Admin, & Customer) menggunakan Tailwind CSS v4.
*   **🔄 Centralized User Dashboard**: Standarisasi alur pengguna (user journey) yang mengarahkan pengguna terautentikasi langsung ke dashboard `/customer` yang bersih dan kohesif untuk melihat katalog dan riwayat penyewaan.
*   **🔐 Otentikasi Multi-Role (NextAuth.js)**: Akses terproteksi berdasarkan peran (**ADMIN** untuk manajemen fleet & bookings, **USER** untuk melihat histori & penyewaan).
*   **📂 Real-Time Inventory & Maintenance**: Manajemen armada admin dengan fitur kuantitas stok dinamis (*real-time inventory*) dan kapabilitas "Hold for Maintenance" untuk mobil yang baru saja dikembalikan.
*   **📑 Modul Checkout Interaktif & e-KYC**: User dapat mengisi periode sewa dan langsung mengunggah dokumen KTP serta Foto Selfie dengan verifikasi visual sebelum melanjutkan transaksi.
*   **💳 Pembayaran Fleksibel & Midtrans Integration**: Mendukung skema pembayaran Uang Muka (DP) maupun Lunas (Full Payment) dengan verifikasi manual, serta integrasi gerbang pembayaran Midtrans.
*   **📊 Data-Driven Analytics Dashboard**: Seluruh grafik statistik pada Dasbor Admin terhubung langsung dengan basis data nyata (PostgreSQL/Supabase) untuk kesiapan rilis produksi (Vercel-ready).

---

## 🛠️ Teknologi yang Digunakan

### **Frontend**
*   **React 19** & **Next.js 16 (App Router)** untuk performa kilat berbasis server-side & client-side rendering.
*   **Tailwind CSS v4** & **PostCSS** untuk penataan gaya utility-first yang bersih dari tumpukan modul CSS konvensional.
*   **Lucide React Icons** untuk visualisasi ikon antarmuka yang seragam dan tajam.
*   **SweetAlert2** untuk notifikasi pop-up interaktif yang intuitif.
*   **Recharts** untuk grafik ringkasan finansial di dasbor analitik Admin.

### **Backend & Database**
*   **Supabase Database (PostgreSQL)** sebagai database relasional utama.
*   **Next.js Route Handlers (REST API)** sebagai perantara lalu lintas data yang aman.
*   **Bcrypt.js** untuk sistem enkripsi hashing kata sandi pengguna.

### **Pembayaran & Autentikasi**
*   **NextAuth.js (v4)** untuk penanganan sesi login berbasis JWT yang aman.


---

## 🚀 Panduan Instalasi & Konfigurasi

### **1. Clone Repository**
Silakan salin tautan git proyek ini, lalu buka terminal pada folder tujuan:

```bash
git clone https://github.com/username/prime-wheels.git
cd prime-wheels
```

### **2. Instal Dependensi**
Instal seluruh paket modul Node yang dibutuhkan proyek menggunakan `npm`:

```bash
npm install
```

### **3. Konfigurasi Environment Variables (`.env.local`)**
Buatlah sebuah berkas baru bernama `.env.local` di root direktori proyek Anda, lalu lengkapi konfigurasi berikut:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL="https://your-project-id.supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="...your-anon-key"

# Database Connections (Prisma/Direct Driver)
DATABASE_URL="postgresql://postgres:password@your-host.supabase.co:6543/postgres"
DIRECT_URL="postgresql://postgres:password@your-host.supabase.co:5432/postgres"

# NextAuth Credentials
NEXTAUTH_SECRET="kunci-rahasia-unik-acak-anda"
NEXTAUTH_URL="http://localhost:3000"


```

> 💡 **Catatan:** Jika Anda mengosongkan `MIDTRANS_SERVER_KEY`, backend akan otomatis mengaktifkan fitur **Simulasi Transaksi Sukses** sehingga Anda tetap bisa mendemokan alur sewa hingga selesai tanpa eror koneksi!

### **4. Jalankan di Mode Pengembangan (Dev)**
Jalankan server pengembangan lokal untuk melihat aplikasi berjalan:

```bash
npm run dev
```

Buka browser Anda di tautan [**http://localhost:3000**](http://localhost:3000).

---

## 🏢 Struktur Arsitektur Proyek

*   `src/app/(user)/`: Rute publik yang dapat diakses sebelum login (Beranda, Landing Page).
*   `src/app/customer/`: Dasbor terpusat khusus untuk penyewa mobil (Akses Katalog, Riwayat Reservasi, Status Invoice, Profil KYC).
*   `src/app/admin/`: Ruang kontrol khusus Admin (Statistik Finansial Data-Driven, Manajemen Inventaris & Maintenance, Daftar Pengguna, Verifikasi Pembayaran DP/Lunas).
*   `src/app/api/`: Serverless RESTful API endpoints (Otentikasi, Checkout Midtrans, Manajemen Pesanan & Operasional).
*   `src/components/layout/`: Berkas pembangun tampilan navigasi (Navbar & Footer) yang seragam dan responsif.
*   `src/lib/supabase.ts`: Klien inisialisasi koneksi terpusat untuk Supabase JS SDK.

---

## 🎯 Cara Penggunaan (Alur Simulasi)

1.  **Akses Dasbor Admin**: Daftarkan akun dengan hak akses `ADMIN` (atau set manual role di database Supabase).
2.  **Manajemen Inventaris**: Di dasbor admin, akses menu **Fleet** lalu tambahkan unit mobil beserta stok dan tarifnya.
3.  **Masuk sebagai User**: Registrasi atau login sebagai `USER`. Anda akan otomatis diarahkan ke dasbor terpusat di `/customer`. Buka menu **Katalog** untuk melihat ketersediaan.
4.  **Lakukan Reservasi**: Pilih mobil, klik **Rent Now**, lalu Anda akan diarahkan ke laman **Checkout**.
5.  **Verifikasi & Pembayaran (DP/Lunas)**: Masukkan rentang tanggal sewa, unggah KTP & foto selfie tiruan, dan pilih skema pembayaran (DP atau Full). Selesaikan pembayaran simulasi.
6.  **Real-Time & Maintenance**: Transaksi Anda akan merubah data stok secara live, dan ketika mobil dikembalikan, status unit dapat diset "Hold for Maintenance" oleh Admin di dasbor.

---

## 📦 Uji Rilis Produksi (Build Check)
Untuk memastikan kode 100% stabil tanpa galat TypeScript atau inkonsistensi routing, jalankan perintah kompilasi produksi berikut:

```bash
npx next build
```
Hasil keluaran akhir harus menampilkan status penyusunan aset yang bersih dan sukses tanpa galat (Exit Code 0).

---

✨ *Developed proudly as a modern, safe, and luxury automotive rental ecosystem.*
