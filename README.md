# 🚗 Prime Wheels — Premium Executive Car Rental Platform

![Next.js Version](https://img.shields.io/badge/Next.js-16.1.1-blue?style=for-the-badge&logo=nextdotjs&logoColor=white)
![React Version](https://img.shields.io/badge/React-19.2.3-00d8ff?style=for-the-badge&logo=react&logoColor=black)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4-38bdf8?style=for-the-badge&logo=tailwindcss&logoColor=white)
![Supabase](https://img.shields.io/badge/Supabase-Database-3ecf8e?style=for-the-badge&logo=supabase&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue?style=for-the-badge&logo=typescript&logoColor=white)
![Vercel](https://img.shields.io/badge/Vercel-Deployed-black?style=for-the-badge&logo=vercel&logoColor=white)

**Prime Wheels** adalah ekosistem digital penyewaan mobil mewah dan eksekutif modern yang dirancang untuk menggabungkan kemewahan visual kelas premium dengan sistem operasional tingkat tinggi (Production-Grade). 

Aplikasi ini dibangun menggunakan teknologi mutakhir **Next.js 16 (App Router)** dan **React 19**, dengan integrasi **Supabase Realtime Database (PostgreSQL)**, alur otentikasi tangguh **NextAuth.js**, sistem kompresi gambar berbasis kanvas cerdas, serta antarmuka elegan bergaya **Apple Premium Light Aesthetic** dengan kombinasi warna dominan **Royal Blue & Slate HSL**.

---

## 📖 Daftar Isi
1. [✨ Fitur Utama & Analisis Arsitektur](#-fitur-utama--analisis-arsitektur)
2. [🛠️ Stack Teknologi & Modul Dependensi](#%EF%B8%8F-stack-teknologi--modul-dependensi)
3. [💾 Skema Database & Relasi Tabel](#-skema-database--relasi-tabel)
4. [🚀 Panduan Instalasi & Konfigurasi Lokal](#-panduan-instalasi--konfigurasi-lokal)
5. [🔌 Dokumentasi API Endpoints](#-dokumentasi-api-endpoints)
6. [🏢 Panduan Alur Pengguna (User Journey Walkthrough)](#-panduan-alur-pengguna-user-journey-walkthrough)
7. [📦 Uji Rilis & Verifikasi Build](#-uji-rilis--verifikasi-build)

---

## ✨ Fitur Utama & Analisis Arsitektur

### 1. 📂 Sistem Verifikasi e-KYC Cepat & Interaktif (`/admin/customers`)
* **Persetujuan Langsung (Direct Review):** Memungkinkan admin untuk meninjau secara real-time status verifikasi identitas pengguna langsung dari daftar pelanggan. Admin dapat menyetujui (`Approve`) atau menolak (`Reject`) e-KYC dalam hitungan detik.
* **Keamanan Integrasi:** Menggunakan dialog berbasis state yang ditenagai oleh **SweetAlert2** untuk mencegah kesalahan penekanan tombol. Menghubungkan client-side state secara langsung ke endpoint RESTful backend `/api/customers/kyc` untuk memperbarui kolom status e-KYC pengguna di PostgreSQL secara instan.

### 2. 📊 Detail Pelanggan & Statistik Transaksi Komprehensif
* **Accordion Detail Panel:** Setiap kartu pelanggan pada direktori admin dapat diekspansi secara interaktif untuk menampilkan data komprehensif:
  * **Dashboard Finansial Mikro:** Menampilkan indikator statistik penting seperti *Total Penyewaan (Sewa)*, *Total Pengeluaran Akumulatif (diformat dalam standar Rupiah IDR)*, serta *Tanggal Reservasi Terakhir*.
  * **Nested Transactional Table:** Tabel riwayat transaksi penyewaan khusus pengguna yang mencakup Kode Booking unik, Merek/Tipe Mobil, Durasi Periode Sewa, Total Nominal Transaksi, Status Operasional (On Road, Returned, Cancelled), dan Status Pembayaran (Paid, DP Paid, Pending).

### 3. 🖼️ In-App Document Preview Modal (Anti Pindah Tab)
* **Visual Viewer Premium:** Mengeliminasi tautan eksternal lawas (`target="_blank"`) yang mengganggu kenyamanan pengguna di smartphone. Foto KTP, Selfie verifikasi wajah, serta Bukti Transfer DP/Pelunasan kini langsung ditampilkan di dalam **Floating Preview Modal** beresolusi tinggi di dalam aplikasi.
* **Aksesibilitas Tinggi:** Modal dilengkapi dengan efek latar belakang blur (`backdrop-blur`), animasi transisi yang mulus, dan kontrol batasan tinggi (`max-height`) yang disesuaikan secara otomatis untuk segala ukuran layar.

### 🗜️ 4. Client-Side Smart Image Compression Utility
* **Solusi Payload Vercel:** Menyelesaikan kendala batasan ukuran payload serverless function pada Vercel (`413 Payload Too Large` / batas maksimum 4.5MB).
* **HTML5 Canvas Compression:** Foto e-KYC atau bukti bayar berukuran besar hingga 10MB secara otomatis dikompresi di sisi browser menggunakan utilitas cerdas [image-compression.ts](file:///c:/Tugas%20Produktif/Project%20KIK/Prime%20wheels/src/lib/image-compression.ts) menjadi berukuran di bawah **500KB** sebelum ditransmisikan. Kualitas teks dokumen (KTP) dan bukti transfer tetap terjaga dengan sangat tajam tanpa kehilangan aspek penting data.

### 📱 5. Audit & Perbaikan Responsivitas Global (Tablet & Mobile)
* **Unified Breakpoint Transition:** Memperbaiki bug visual pada lebar layar tablet (768px hingga 1024px) di mana menu navigasi utama serta tombol burger menu mobile sempat tersembunyi.
* **Apple Light Navbar:** Standarisasi transisi layout di [AdminSidebar.tsx](file:///c:/Tugas%20Produktif/Project%20KIK/Prime%20wheels/src/components/AdminSidebar.tsx) dan [CustomerLayout.tsx](file:///c:/Tugas%20Produktif/Project%20KIK/Prime%20wheels/src/app/customer/layout.tsx) ke breakpoint `lg`, menjamin navigasi yang sangat lancar dan fungsional di perangkat mana pun.

---

## 🛠️ Stack Teknologi & Modul Dependensi

### **Frontend & Interface**
* **Next.js 16.1.1 & React 19.2.3 (App Router):** Pondasi utama yang menggunakan server-side rendering (SSR) untuk SEO optimal dan client-side hydration (CSR) untuk interaksi kilat.
* **Tailwind CSS v4 & PostCSS:** Framework utility-first untuk desain responsif dan penataan gaya modern tanpa beban file CSS konvensional yang lambat.
* **Lucide React Icons:** Visualisasi ikon SVG tajam dan modern yang seragam di seluruh platform.
* **Recharts 3.8.1:** Pustaka visualisasi grafik data-driven untuk menyajikan grafik pendapatan dan analitik di dasbor admin.

### **Backend & Keamanan**
* **Supabase Database (PostgreSQL):** Basis data utama berkinerja tinggi untuk menjaga integritas data relasional.
* **NextAuth.js 4.24.14:** Penanganan otentikasi sesi terproteksi berbasis JSON Web Token (JWT) dengan skema multi-role (`ADMIN` dan `USER`).
* **Bcrypt.js 3.0.3:** Protokol pengamanan kata sandi pengguna berbasis enkripsi hashing satu arah sebelum disimpan ke database.

---

## 💾 Skema Database & Relasi Tabel

Aplikasi ini menggunakan PostgreSQL di Supabase dengan skema relasional terproteksi RLS (Row Level Security):

### **1. Tabel `users` (Data Pengguna & Status KYC)**
Menyimpan informasi identitas, kredensial terenkripsi, hak akses, serta tautan dokumen e-KYC.
```sql
CREATE TABLE public.users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    role TEXT NOT NULL DEFAULT 'USER', -- 'USER' atau 'ADMIN'
    ktp_url TEXT,                     -- Tautan penyimpanan awan foto KTP
    selfie_url TEXT,                  -- Tautan penyimpanan awan foto selfie
    kyc_status TEXT DEFAULT 'Pending',-- 'Pending', 'Approved', 'Rejected'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);
```

### **2. Tabel `cars` (Inventaris Armada & Ketersediaan)**
Melacak tipe mobil, tarif sewa, stok total, serta stok yang sedang berada di unit perawatan (maintenance).
```sql
CREATE TABLE public.cars (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    brand TEXT NOT NULL,               -- Contoh: 'BMW'
    name TEXT NOT NULL,                -- Contoh: 'X7'
    type TEXT NOT NULL,                -- Contoh: 'SUV'
    price_per_day NUMERIC NOT NULL,
    quantity INTEGER NOT NULL DEFAULT 1,
    maintenance_quantity INTEGER NOT NULL DEFAULT 0, -- Unit yang sedang diservis
    image_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);
```

### **3. Tabel `bookings` (Transaksi & Operasional)**
Melacak siklus hidup penyewaan mobil, nominal biaya, status pengiriman unit sewa, dan data verifikasi transfer pembayaran.
```sql
CREATE TABLE public.bookings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    booking_code TEXT UNIQUE NOT NULL, -- Kode unik sewa, contoh: 'RNT-...'
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    car_id UUID REFERENCES public.cars(id) ON DELETE CASCADE,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    quantity INTEGER NOT NULL DEFAULT 1, -- Jumlah unit mobil yang disewa
    total_price NUMERIC NOT NULL,
    status TEXT NOT NULL DEFAULT 'Awaiting Payment', -- 'Awaiting Payment', 'Ready for Pickup', 'On Road', 'Returned', 'Cancelled'
    payment_status TEXT NOT NULL DEFAULT 'Pending',  -- 'Pending', 'Awaiting DP Verification', 'DP Paid', 'Awaiting Full Payment Verification', 'Paid'
    payment_dp_url TEXT,                -- Tautan bukti transfer DP
    payment_full_url TEXT,              -- Tautan bukti transfer pelunasan
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);
```

### **4. Fungsi RPC Database `check_car_availability`**
Digunakan untuk mengecek sisa ketersediaan unit mobil yang bebas untuk disewa pada rentang tanggal tertentu guna menghindari double booking (*race condition*).
```sql
CREATE OR REPLACE FUNCTION check_car_availability(
    target_car_id UUID,
    req_start_date DATE,
    req_end_date DATE
) RETURNS INTEGER AS $$
DECLARE
    total_units INTEGER;
    maintenance_units INTEGER;
    booked_units INTEGER;
    available_units INTEGER;
BEGIN
    -- Ambil stok total dan unit maintenance
    SELECT quantity, maintenance_quantity 
    INTO total_units, maintenance_units
    FROM public.cars
    WHERE id = target_car_id;
    
    -- Hitung unit yang aktif dipesan pada rentang tanggal tersebut
    SELECT COALESCE(SUM(quantity), 0)
    INTO booked_units
    FROM public.bookings
    WHERE car_id = target_car_id
      AND status NOT IN ('Cancelled', 'Returned')
      AND (
        (start_date <= req_end_date AND end_date >= req_start_date)
      );
      
    available_units := total_units - maintenance_units - booked_units;
    RETURN GREATEST(0, available_units);
END;
$$ LANGUAGE plpgsql;
```

---

## 🚀 Panduan Instalasi & Konfigurasi Lokal

### **1. Kloning Repositori**
```bash
git clone https://github.com/4RBTR/Prime-Wheels.git
cd Prime-Wheels
```

### **2. Pasang Modul Node**
```bash
npm install
```

### **3. Konfigurasi Environment Variables (`.env.local`)**
Buatlah sebuah berkas baru bernama `.env.local` di root direktori proyek Anda, lalu lengkapi konfigurasi berikut:

```env
# Supabase API Keys (Akses Client & Server)
NEXT_PUBLIC_SUPABASE_URL="https://your-project-id.supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="...your-anon-key..."

# Database Direct Connection (PostgreSQL)
DATABASE_URL="postgresql://postgres:password@your-host.supabase.co:6543/postgres"
DIRECT_URL="postgresql://postgres:password@your-host.supabase.co:5432/postgres"

# NextAuth Security
NEXTAUTH_SECRET="kunci-rahasia-acak-anda-untuk-sesi-jwt"
NEXTAUTH_URL="http://localhost:3000"
```

### **4. Jalankan Aplikasi dalam Mode Dev**
```bash
npm run dev
```
Buka browser Anda di tautan [**http://localhost:3000**](http://localhost:3000).

---

## 🔌 Dokumentasi API Endpoints

Semua endpoint API terletak di direktori `/api/` dan dilindungi dengan verifikasi token NextAuth.

### **1. e-KYC & Pelanggan**
* **`GET /api/customers`**
  * **Hak Akses:** `ADMIN`
  * **Deskripsi:** Mengambil daftar semua pengguna terdaftar yang bertipe `USER` beserta detail kelengkapan data KYC mereka.
  * **Respon Sukses (200):** `{ customers: [...] }`
  
* **`PUT /api/customers/kyc`**
  * **Hak Akses:** `ADMIN`
  * **Deskripsi:** Memperbarui status e-KYC pengguna menjadi disetujui atau ditolak.
  * **Body Request:** `{ userId: "UUID", status: "Approved" | "Rejected" }`
  * **Respon Sukses (200):** `{ message: "Status KYC berhasil diperbarui" }`

### **2. Pemesanan & Sewa**
* **`GET /api/bookings`**
  * **Hak Akses:** `USER` (untuk mengambil booking miliknya sendiri) & `ADMIN` (mengambil seluruh booking yang berhubungan dengan armadanya).
  * **Deskripsi:** Menarik riwayat pemesanan mobil real-time.
  
* **`PUT /api/bookings/[id]/approve-payment`**
  * **Hak Akses:** `ADMIN`
  * **Deskripsi:** Memverifikasi pembayaran uang muka (DP) atau pelunasan dari penyewa setelah admin memvalidasi keaslian dokumen transfer melalui popup modal.
  * **Body Request:** `{ action: "APPROVE_DP" | "REJECT_DP" | "APPROVE_FULL" | "REJECT_FULL" }`

* **`PUT /api/bookings/[id]/status`**
  * **Hak Akses:** `ADMIN`
  * **Deskripsi:** Mengubah siklus hidup operasional pesanan. Bila kendaraan dikonfirmasi kembali dengan opsi hold, sistem secara otomatis meningkatkan `maintenance_quantity` pada model mobil tersebut.
  * **Body Request:** `{ status: "On Road" | "Returned" | "Cancelled", carId?: "UUID", setMaintenance?: true | false }`

### **3. Inventaris & Armada**
* **`PUT /api/cars/maintenance`**
  * **Hak Akses:** `ADMIN`
  * **Deskripsi:** Memulihkan unit yang sedang diservis secara bertahap (per 1 unit mobil).
  * **Body Request:** `{ carId: "UUID" }`

---

## 🏢 Panduan Alur Pengguna (User Journey Walkthrough)

### **A. Alur Pelanggan (Customer Journey)**
1. **Pendaftaran Akun:** Masuk ke halaman `/register` lalu pilih peran sebagai Pelanggan (`USER`).
2. **Unggah Dokumen e-KYC:** Pada dasbor profil `/customer/profile`, unggah foto KTP serta Selfie KTP Anda. Utilitas kompresor canvas otomatis bekerja di belakang layar untuk mengecilkan file Anda sebelum diunggah ke database.
3. **Pencarian & Pemesanan:** Buka menu **Katalog**, tentukan mobil impian Anda (misalnya BMW X7), masukkan tanggal mulai & akhir sewa, tentukan jumlah unit mobil yang disewa, dan pilih skema bayar (DP atau Lunas).
4. **Pembayaran Uang Muka (DP):** Jika memilih DP, unggah bukti transfer DP Anda. Status pesanan akan berubah menjadi `Awaiting DP Verification`.
5. **Serah Terima Kunci & Pelunasan:** Setelah DP disetujui, mobil siap diambil (`Ready for Pickup`). Sebelum kunci diserahkan di kantor sewa, unggah bukti pelunasan biaya untuk mengubah status pembayaran menjadi lunas (`Paid`).

### **B. Alur Administrasi (Admin Dashboard)**
1. **Manajemen Armada (Fleet):** Admin mendaftarkan model mobil baru beserta jumlah unit fisik yang siap jalan.
2. **Review KYC Pelanggan:** Admin membuka menu **Customers**, mengklik kartu penyewa untuk mengekspansi detail, lalu mengklik tombol **Lihat KTP** atau **Lihat Selfie** untuk membuka Popup Modal responsif. Setelah divalidasi, klik tombol **Setujui KYC**.
3. **Verifikasi Pembayaran & Rilis Mobil:** Admin membuka detail booking yang masuk, melihat gambar bukti bayar via modal internal, lalu menyetujui DP. Ketika pelanggan tiba untuk mengambil mobil, admin mengubah status menjadi `On Road` (Sedang Disewa).
4. **Pengembalian & Pemeliharaan Parsial:** Saat mobil dikembalikan, jika unit mengalami kendala teknis, admin memilih opsi **Kembalikan & Hold** agar mobil masuk ke antrean servis secara parsial, memastikan unit tidak bisa disewa oleh pelanggan lain untuk sementara waktu. Jika servis selesai, admin menekan tombol 🛠 **Selesai Perawatan** di tabel Fleet.

---

## 📦 Uji Rilis & Verifikasi Build

Untuk memastikan semua modul terintegrasi, bebas dari kesalahan runtime TypeScript, dan siap dirilis ke platform cloud Vercel, jalankan perintah kompilasi produksi berikut:
```bash
npm run build
```
Hasil keluaran build harus menunjukkan status penyusunan berkas yang sukses (**Clean Compile / Exit Code 0**).

---

✨ *Developed proudly with elite standards as a modern, safe, and luxury automotive rental ecosystem.*
