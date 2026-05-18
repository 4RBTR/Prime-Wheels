# 🚗 Prime Wheels — Premium Executive Car Rental Platform

<div align="center">

![Prime Wheels Banner](https://img.shields.io/badge/Prime--Wheels-Premium%20Car%20Rental-blue?style=for-the-badge&logo=appletv&logoColor=white)

### 🌟 Executive Rental Experience & Premium Fleet Ecosystem

[![Live Deployment](https://img.shields.io/badge/Vercel-LIVE%20DEMO-black?style=for-the-badge&logo=vercel&logoColor=white)](https://prime-wheels-wheat.vercel.app/)
[![Next.js](https://img.shields.io/badge/Next.js-16.1.1-blue?style=for-the-badge&logo=nextdotjs&logoColor=white)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.2.3-00d8ff?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4-38bdf8?style=for-the-badge&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![Supabase](https://img.shields.io/badge/Supabase-Database-3ecf8e?style=for-the-badge&logo=supabase&logoColor=white)](https://supabase.com/)

---

### 🌐 TAUTAN RESMI DEPLOYMENT VERCEL (KLIK DI BAWAH INI)
## 👉 [**https://prime-wheels-wheat.vercel.app/**](https://prime-wheels-wheat.vercel.app/) 👈

*Nikmati langsung platform eksekutif penyewaan armada mewah Prime Wheels langsung dari browser Anda!*

---

</div>

**Prime Wheels** adalah ekosistem digital penyewaan mobil mewah dan eksekutif modern yang dirancang untuk menggabungkan kemewahan visual kelas premium dengan sistem operasional tingkat tinggi (Production-Grade). 

Aplikasi ini dibangun menggunakan teknologi mutakhir **Next.js 16 (App Router)** dan **React 19**, dengan integrasi **Supabase Realtime Database (PostgreSQL)**, alur otentikasi tangguh **NextAuth.js**, sistem kompresi gambar berbasis kanvas cerdas, serta antarmuka elegan bergaya **Apple Premium Light Aesthetic** dengan kombinasi warna dominan **Royal Blue & Slate HSL**.

---

## 📊 Visualisasi Alur Sistem (System Flowcharts)

Untuk mempermudah pemahaman alur kerja dan operasional platform Prime Wheels, berikut adalah representasi visual menggunakan diagram alir (flowchart):

### 1. Alur Siklus Hidup Pemesanan & Sewa (Booking Lifecycle)
Diagram di bawah ini menggambarkan perjalanan pengguna saat melakukan pendaftaran, pengunggahan dokumen e-KYC, pemilihan unit, proses checkout, verifikasi bukti transfer pembayaran oleh admin, hingga masa akhir sewa kendaraan.

```mermaid
graph TD
    A[Pengguna Mendaftar Akun Baru] --> B[Masuk ke Halaman Profil /customer/profile]
    B --> C[Unggah KTP & Selfie KTP]
    C -->|Kompresi Gambar Otomatis < 500KB| D[Kirim Dokumen ke Database]
    D --> E{Admin Review KYC via Popup Modal}
    E -->|Ditolak / Rejected| B
    E -->|Disetujui / Approved| F[Buka Menu Katalog & Pilih Armada]
    F --> G[Tentukan Jumlah Unit & Periode Sewa]
    G --> H[Checkout & Pilih Skema Pembayaran]
    H -->|Pilih Skema Uang Muka / DP 30%| I[Unggah Bukti Transfer DP]
    H -->|Pilih Skema Lunas / Full Payment| J[Unggah Bukti Pelunasan]
    I --> K{Admin Verifikasi Bukti Bayar via Modal}
    J --> K
    K -->|Bukti Salah / Ditolak| H
    K -->|Pembayaran DP Disetujui| L[Mobil Siap Diambil / Ready for Pickup]
    L --> M[Pengguna Tiba - Unggah Sisa Pelunasan jika DP]
    M --> N[Admin Konfirmasi & Set Mobil Jadi 'On Road']
    N --> O[Masa Sewa Aktif / Kendaraan Digunakan]
    O --> P[Penyewa Mengembalikan Kendaraan]
    P --> Q{Admin Cek Kondisi Armada}
    Q -->|Unit Mengalami Kendala/Rusak| R[Status: Hold for Maintenance - Armada Servis]
    Q -->|Unit Aman/Normal| S[Status: Returned - Selesai & Armada Bebas]
    R -->|Servis Selesai - Klik Selesai Perawatan| S
```

### 2. Arsitektur Data & Aliran API Sistem
Diagram di bawah ini menunjukkan interaksi antara antarmuka pengguna (Frontend), Serverless API Routes, Manajemen Sesi, Utilitas Client, dan Database PostgreSQL Supabase.

```mermaid
graph LR
    subgraph Client_Viewport ["Client Viewport"]
        FE[React 19 / Next.js 16 UI]
        COMP[HTML5 Canvas Compressor]
        MOD[In-App Document Modals]
    end

    subgraph Auth_Protection ["Authentication & Protection"]
        AUTH[NextAuth.js JWT Session]
        GUARD[Next.js Middleware Guards]
    end

    subgraph API_Routes ["API Routes (Backend Serverless)"]
        API_CUST["/api/customers/kyc"]
        API_BOOK["/api/bookings"]
        API_CARS["/api/cars/maintenance"]
    end

    subgraph Database_Layer ["Database Layer"]
        DB[(Supabase PostgreSQL)]
        RPC[check_car_availability RPC]
    end

    FE -->|Raw Photo 10MB| COMP
    COMP -->|Compressed Image < 500KB| FE
    FE -->|Session Request| AUTH
    AUTH -->|Validate Role ADMIN/USER| GUARD
    GUARD -->|Authorized Traffic| API_CUST
    GUARD -->|Authorized Traffic| API_BOOK
    GUARD -->|Authorized Traffic| API_CARS
    
    API_CUST -->|Write e-KYC Status| DB
    API_BOOK -->|Verify Availability| RPC
    RPC -->|Return Stock Status| API_BOOK
    API_BOOK -->|Write Rental Transaction| DB
    API_CARS -->|Update Maintenance Quantity| DB
    
    DB -->|Fetch Document Urls| MOD
    MOD -->|Render Zoom Image Preview| FE
```

---

## 🏢 Tabel Referensi Status Operasional

Untuk menjaga transparansi pengelolaan armada, sistem kami menggunakan tabel status terstandarisasi untuk siklus pemesanan dan verifikasi finansial:

### 1. Status Penyewaan Kendaraan (Booking Status)
| Nama Status | Pengirim/Pemicu | Arti Operasional |
| :--- | :--- | :--- |
| **`Awaiting Payment`** | Otomatis (Sistem) | Menunggu penyewa mengunggah bukti bayar pertama (DP atau Lunas). |
| **`Ready for Pickup`** | Admin | Pembayaran awal terverifikasi. Kunci mobil siap diserahkan kepada pelanggan. |
| **`On Road`** | Admin | Mobil telah diserahkan dan sedang aktif dikendarai oleh penyewa di jalan. |
| **`Returned`** | Admin | Mobil telah sukses dikembalikan ke kantor sewa dan transaksi selesai. |
| **`Cancelled`** | Admin / Otomatis | Pemesanan dibatalkan (misal: penolakan dokumen e-KYC atau bukti bayar palsu). |

### 2. Status Verifikasi Finansial (Payment Status)
| Nama Status | Arti Teknis | Aksi Tindak Lanjut Admin |
| :--- | :--- | :--- |
| **`Pending`** | Pesanan baru dibuat, belum ada pembayaran. | Menunggu pengguna mengunggah berkas transfer. |
| **`Awaiting DP Verification`** | Pengguna mengunggah bukti pembayaran DP (30%). | Perlu meninjau bukti transfer DP via Modal. |
| **`DP Paid`** | Uang muka 30% dinyatakan sah dan masuk ke rekening. | Menginstruksikan pelanggan untuk bersiap ambil unit. |
| **`Awaiting Full Payment Verification`** | Pengguna mengunggah bukti pelunasan sisa 70%. | Meninjau bukti transfer pelunasan via Modal. |
| **`Paid`** | Seluruh tagihan sewa lunas 100%. | Menyerahkan mobil dan kunci fisik ke penyewa. |

---

## ✨ Fitur Unggulan Utama (Premium Features)

Untuk memastikan pengalaman kelas bisnis, Prime Wheels dilengkapi dengan fitur-fitur mutakhir yang mengatasi berbagai kendala operasional secara cerdas:

| Fitur Unggulan | Cara Kerja & Interaksi | Solusi / Masalah yang Diselesaikan |
| :--- | :--- | :--- |
| 📂 **e-KYC Instant Review** | Verifikasi (Approve/Reject) status identitas pelanggan langsung dari daftar utama. | Proses instan dengan proteksi **SweetAlert2** untuk mencegah salah klik. |
| 📊 **Accordion Customer Detail** | Baris kartu pelanggan dapat diekspansi untuk membuka dasbor analitik finansial mikro. | Memantau *Total Pengeluaran (Rupiah)* & tabel riwayat transaksi sewa per pelanggan. |
| 🖼️ **In-App Document Modal** | Menampilkan foto KTP, selfie, atau bukti bayar di dalam popup floating berlatar belakang blur. | Navigasi nyaman di HP & tablet tanpa perlu membuka/pindah tab browser baru. |
| 🗜️ **Smart Canvas Compressor** | Secara otomatis menyusutkan ukuran foto dokumen (hingga 10MB) menjadi di bawah **500KB**. | Mengeliminasi error serverless Vercel **`413 Payload Too Large`** dengan teks tetap tajam. |

---

## 🛠️ Stack Teknologi & Modul Dependensi

Arsitektur aplikasi ini dirancang menggunakan kombinasi teknologi modern berperforma tinggi:

| Kategori | Stack Teknologi | Versi | Peran Utama & Solusi |
| :--- | :--- | :--- | :--- |
| 🖥️ **Core Engine** | **Next.js & React** | `16.1.1` / `19.2.3` | App Router untuk SEO optimal (SSR) dan interaksi kilat (CSR). |
| 🎨 **Design System** | **Tailwind CSS v4** | `v4.x` | Desain Apple Premium Aesthetic yang ultra responsif & adaptif. |
| 📊 **Analytics UI** | **Recharts & Lucide** | `3.8.1` / `Latest` | Penyajian grafik analitik pendapatan & ikon SVG yang konsisten. |
| 💾 **Database** | **Supabase (PostgreSQL)**| `Latest` | Penyimpanan data relasional aman terproteksi Row Level Security (RLS). |
| 🔑 **Authentication** | **NextAuth.js** | `4.24.14` | Proteksi rute & manajemen sesi JWT untuk Multi-Role (ADMIN & USER). |
| 🔒 **Cryptography** | **Bcrypt.js** | `3.0.3` | Enkripsi hashing satu arah yang sangat kuat untuk mengamankan password. |

---

## 💾 Skema Database & Relasi Tabel

Aplikasi ini menggunakan basis data relasional PostgreSQL (Supabase) dengan proteksi keamanan **RLS (Row Level Security)**. Di bawah ini adalah struktur relasi tabel dan detail kolom yang dirancang agar sangat mudah dipahami.

### 1. Diagram Relasi Entitas (Entity-Relationship Diagram)
Diagram Mermaid di bawah ini menggambarkan bagaimana tabel-tabel utama saling terhubung melalui relasi kunci asing (*Foreign Keys*):

```mermaid
erDiagram
    users {
        uuid id PK "Primary Key (Auto UUID)"
        string name "Nama Pengguna"
        string email UK "Email Unik"
        string password "Password Terenkripsi Bcrypt"
        string role "Akses: ADMIN / USER"
        string ktp_url "Tautan File Gambar KTP"
        string selfie_url "Tautan File Gambar Selfie"
        string kyc_status "Status: Approved/Rejected/Pending"
        timestamp created_at "Tanggal Registrasi"
    }
    cars {
        uuid id PK "Primary Key (Auto UUID)"
        string brand "Merek Mobil (e.g. BMW)"
        string name "Nama Tipe Mobil (e.g. X7)"
        string type "Kategori (e.g. SUV)"
        numeric price_per_day "Tarif Sewa Harian"
        integer quantity "Stok Total Armada Fisik"
        integer maintenance_quantity "Jumlah Unit Sedang Diservis"
        string image_url "Tautan Gambar Kendaraan"
        timestamp created_at "Tanggal Ditambahkan"
    }
    bookings {
        uuid id PK "Primary Key (Auto UUID)"
        string booking_code UK "Kode Unik Sewa (RNT-...)"
        uuid user_id FK "Relasi ke users(id)"
        uuid car_id FK "Relasi ke cars(id)"
        date start_date "Tanggal Awal Sewa"
        date end_date "Tanggal Akhir Sewa"
        integer quantity "Jumlah Unit Dipesan"
        numeric total_price "Total Nominal Transaksi"
        string status "Status Sewa"
        string payment_status "Status Pembayaran"
        string payment_dp_url "Tautan Bukti Transfer DP"
        string payment_full_url "Tautan Bukti Transfer Pelunasan"
        timestamp created_at "Tanggal Transaksi Dibuat"
    }
    users ||--o{ bookings : "melakukan pemesanan"
    cars ||--o{ bookings : "disewa dalam"
```

---

### 2. Deskripsi Kolom & Kamus Data (Data Dictionary)

#### A. Tabel `users` (Manajemen Identitas & e-KYC)
| Nama Kolom | Tipe Data | Atribut | Deskripsi / Penjelasan |
| :--- | :--- | :--- | :--- |
| **`id`** | `UUID` | **PK**, Default | ID unik otomatis untuk setiap akun pengguna. |
| **`name`** | `TEXT` | `NOT NULL` | Nama lengkap asli sesuai dengan KTP. |
| **`email`** | `TEXT` | `UNIQUE` | Alamat email aktif untuk akses login. |
| **`password`** | `TEXT` | `NOT NULL` | Kredensial kata sandi yang telah di-hash menggunakan Bcrypt. |
| **`role`** | `TEXT` | `USER` / `ADMIN` | Menentukan hak akses halaman dasbor. |
| **`ktp_url`** | `TEXT` | *Nullable* | Tautan penyimpanan cloud untuk foto dokumen KTP pengguna. |
| **`selfie_url`** | `TEXT` | *Nullable* | Tautan penyimpanan cloud untuk foto selfie wajah pengguna. |
| **`kyc_status`** | `TEXT` | Default: `Pending` | Status verifikasi e-KYC (`Pending`, `Approved`, `Rejected`). |

#### B. Tabel `cars` (Inventaris Armada & Stok)
| Nama Kolom | Tipe Data | Atribut | Deskripsi / Penjelasan |
| :--- | :--- | :--- | :--- |
| **`id`** | `UUID` | **PK**, Default | ID unik otomatis untuk model/armada mobil. |
| **`brand`** | `TEXT` | `NOT NULL` | Produsen/Merek pabrikan mobil (misalnya: Mercedes-Benz, BMW). |
| **`name`** | `TEXT` | `NOT NULL` | Nama seri/tipe kendaraan mewah (misalnya: S-Class, X7). |
| **`type`** | `TEXT` | `NOT NULL` | Kategori tipe bodi mobil (misalnya: Sedan, SUV, Sports). |
| **`price_per_day`** | `NUMERIC` | `NOT NULL` | Tarif dasar sewa per unit per 24 jam. |
| **`quantity`** | `INTEGER` | Default: `1` | Jumlah total unit fisik yang dimiliki oleh kantor rental. |
| **`maintenance_quantity`** | `INTEGER` | Default: `0` | Jumlah unit fisik yang saat ini sedang berada di bengkel perawatan. |

#### C. Tabel `bookings` (Transaksi, Operasional & Bukti Transfer)
| Nama Kolom | Tipe Data | Atribut | Deskripsi / Penjelasan |
| :--- | :--- | :--- | :--- |
| **`id`** | `UUID` | **PK**, Default | ID transaksi penyewaan mobil. |
| **`booking_code`** | `TEXT` | **UK**, `NOT NULL` | Kode pesanan acak berformat premium, contoh: `RNT-A2BC9`. |
| **`user_id`** | `UUID` | **FK** | Terhubung ke `users.id` (Relasi Cascade). |
| **`car_id`** | `UUID` | **FK** | Terhubung ke `cars.id` (Relasi Cascade). |
| **`start_date`** | `DATE` | `NOT NULL` | Hari pertama serah terima dan masa aktif rental. |
| **`end_date`** | `DATE` | `NOT NULL` | Hari terakhir dan pengembalian unit mobil sewa. |
| **`quantity`** | `INTEGER` | Default: `1` | Jumlah unit dari mobil tersebut yang disewa sekaligus. |
| **`total_price`** | `NUMERIC` | `NOT NULL` | Nominal akhir biaya sewa (sudah termasuk hitungan kuantitas & durasi). |
| **`status`** | `TEXT` | Default: `Awaiting...` | Status operasional unit (`Awaiting Payment`, `Ready...`, `On Road`, `Returned`). |
| **`payment_status`** | `TEXT` | Default: `Pending` | Status aliran verifikasi dana (`Pending`, `Awaiting DP...`, `DP Paid`, `Paid`). |

---

### 3. DDL SQL Lengkap (Raw SQL Schema) & Fungsi Database

Untuk memudahkan instalasi tabel-tabel di atas langsung pada console database Supabase/PostgreSQL Anda, silakan ekspansi menu di bawah ini:

<details>
<summary><b>👉 KLIK UNTUK MELIHAT SOURCE CODE DDL SQL TABEL</b></summary>

```sql
-- Buat Tabel Users
CREATE TABLE public.users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    role TEXT NOT NULL DEFAULT 'USER',
    ktp_url TEXT,
    selfie_url TEXT,
    kyc_status TEXT DEFAULT 'Pending',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Buat Tabel Cars
CREATE TABLE public.cars (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    brand TEXT NOT NULL,
    name TEXT NOT NULL,
    type TEXT NOT NULL,
    price_per_day NUMERIC NOT NULL,
    quantity INTEGER NOT NULL DEFAULT 1,
    maintenance_quantity INTEGER NOT NULL DEFAULT 0,
    image_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Buat Tabel Bookings
CREATE TABLE public.bookings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    booking_code TEXT UNIQUE NOT NULL,
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    car_id UUID REFERENCES public.cars(id) ON DELETE CASCADE,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    quantity INTEGER NOT NULL DEFAULT 1,
    total_price NUMERIC NOT NULL,
    status TEXT NOT NULL DEFAULT 'Awaiting Payment',
    payment_status TEXT NOT NULL DEFAULT 'Pending',
    payment_dp_url TEXT,
    payment_full_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);
```
</details>

<details>
<summary><b>👉 KLIK UNTUK MELIHAT SOURCE CODE DOKUMENTASI RPC FUNCTION check_car_availability</b></summary>

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
</details>

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

Seluruh API Endpoint yang dibangun pada Prime Wheels menggunakan rute serverless **Next.js Route Handlers** (terletak di direktori `/api/`). Setiap endpoint dilindungi oleh sistem keamanan sesi **NextAuth.js** dan memerlukan verifikasi JSON Web Token (JWT) dengan skema otorisasi berbasis peran (*role-based authorization*).

### 1. Katalog API (API Unified Catalog)

| Method | Endpoint | Hak Akses | Deskripsi Utama |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/customers` | `ADMIN` | Mengambil daftar seluruh penyewa (`USER`) dan data KYC. |
| `PUT` | `/api/customers/kyc` | `ADMIN` | Memverifikasi (Approve/Reject) status e-KYC pelanggan. |
| `GET` | `/api/bookings` | `USER` / `ADMIN` | Mengambil riwayat transaksi sewa (Filter otomatis sesuai role). |
| `PUT` | `/api/bookings/[id]/approve-payment` | `ADMIN` | Memverifikasi sah/tidaknya transfer dana DP atau pelunasan. |
| `PUT` | `/api/bookings/[id]/status` | `ADMIN` | Mengubah siklus operasional armada (`On Road`, `Returned`, dll). |
| `PUT` | `/api/cars/maintenance` | `ADMIN` | Memulihkan stok mobil dari unit pemeliharaan kembali siap sewa. |

---

### 2. Penjelasan Detail Payload & Skema JSON

#### 📁 A. e-KYC & Manajemen Pelanggan

##### **1. GET /api/customers**
* **Headers:** `Content-Type: application/json`
* **Response Sukses (200 OK):**
  ```json
  {
    "customers": [
      {
        "id": "a1b2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6d",
        "name": "Rian Hidayat",
        "email": "rian.hidayat@example.com",
        "role": "USER",
        "ktp_url": "https://supabase-storage.com/kyc/ktp_123.jpg",
        "selfie_url": "https://supabase-storage.com/kyc/selfie_123.jpg",
        "kyc_status": "Pending",
        "created_at": "2026-05-18T10:00:00.000Z"
      }
    ]
  }
  ```

##### **2. PUT /api/customers/kyc**
* **Headers:** `Content-Type: application/json`
* **Request Body JSON:**
  ```json
  {
    "userId": "a1b2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6d",
    "status": "Approved" // Nilai valid: "Approved" | "Rejected"
  }
  ```
* **Response Sukses (200 OK):**
  ```json
  {
    "message": "Status KYC berhasil diperbarui menjadi Approved"
  }
  ```
* **Response Error (400 Bad Request):**
  ```json
  {
    "error": "Kolom userId dan status wajib diisi dengan benar"
  }
  ```

---

#### 📁 B. Pemesanan, Sewa & Alur Finansial

##### **1. GET /api/bookings**
* **Filter Role:** Jika diakses oleh `USER`, hanya mengembalikan transaksi miliknya. Jika diakses oleh `ADMIN`, mengembalikan semua transaksi sewa di platform.
* **Response Sukses (200 OK):**
  ```json
  {
    "bookings": [
      {
        "id": "b9f9e9d9-c9b9-a9a9-9999-888888888888",
        "booking_code": "RNT-X7K89",
        "start_date": "2026-06-01",
        "end_date": "2026-06-05",
        "quantity": 1,
        "total_price": 4500000,
        "status": "Ready for Pickup",
        "payment_status": "DP Paid",
        "car": {
          "brand": "BMW",
          "name": "X7"
        }
      }
    ]
  }
  ```

##### **2. PUT /api/bookings/[id]/approve-payment**
* **Request Body JSON:**
  ```json
  {
    "action": "APPROVE_DP" // Nilai valid: "APPROVE_DP" | "REJECT_DP" | "APPROVE_FULL" | "REJECT_FULL"
  }
  ```
* **Response Sukses (200 OK):**
  ```json
  {
    "message": "Pembayaran DP berhasil diverifikasi. Status pembayaran diperbarui menjadi DP Paid."
  }
  ```

##### **3. PUT /api/bookings/[id]/status**
* **Request Body JSON:**
  ```json
  {
    "status": "Returned", // Nilai valid: "On Road" | "Returned" | "Cancelled"
    "carId": "c8d8e8f8-a8b8-c8d8-e8f8-a8b8c8d8e8f8",
    "setMaintenance": true // Set true jika mobil kembali dalam kondisi rusak/perlu servis
  }
  ```
* **Response Sukses (200 OK):**
  ```json
  {
    "message": "Status sewa berhasil diubah. Unit mobil dipindahkan ke status pemeliharaan berkala."
  }
  ```

---

#### 📁 C. Pemeliharaan Armada (Fleet Maintenance)

##### **1. PUT /api/cars/maintenance**
* **Request Body JSON:**
  ```json
  {
    "carId": "c8d8e8f8-a8b8-c8d8-e8f8-a8b8c8d8e8f8"
  }
  ```
* **Response Sukses (200 OK):**
  ```json
  {
    "message": "Satu unit armada mobil berhasil diselesaikan dari masa perawatan berkala dan siap disewa kembali."
  }
  ```
* **Response Error (404 Not Found):**
  ```json
  {
    "error": "Mobil tidak ditemukan atau unit perawatan sudah bernilai 0"
  }
  ```

---

## 🏢 Panduan Alur Pengguna (User Journey Walkthrough)

Untuk mempermudah pemahaman operasional sistem, berikut adalah ringkasan alur kerja terstruktur yang memetakan tindakan pengguna dan dampaknya di sisi server:

### 👤 A. Alur Perjalanan Pelanggan (Customer Experience Flow)

```
[ Registrasi Akun ] ➔ [ Lengkapi e-KYC ] ➔ [ Pilih Mobil & Unit ] ➔ [ Bayar DP 30% ] ➔ [ Ambil Unit & Lunas ]
```

| Langkah / Fase | 📍 Tindakan Pengguna & UI Layar | ⚙️ Dampak Sistem (Backend & Database) |
| :--- | :--- | :--- |
| **1. Registrasi Akun** | Mendaftar peran `USER` di halaman `/register`. | Password di-hash (Bcrypt), akun dibuat berstatus KYC `Pending`. |
| **2. Pelengkapan e-KYC** | Unggah foto KTP & Selfie di `/customer/profile`. | Kompresi Canvas otomatis (<400KB), tautan disimpan ke Supabase. |
| **3. Pemesanan Unit** | Pilih mobil, durasi tanggal, & jumlah unit di katalog. | Validasi stok secara real-time via RPC `check_car_availability`. |
| **4. Pembayaran DP** | Bayar DP 30% & unggah bukti transfer. | Booking status `Awaiting DP Verification` & stok unit dikunci. |
| **5. Serah Terima** | Unggah pelunasan (70%), ambil kunci fisik. | Booking status berubah aktif menjadi `On Road` & transaksi `Paid`. |

---

### 🔑 B. Alur Kontrol Administrasi (Admin Operations Flow)

```
[ Input Aset Fleet ] ➔ [ Verifikasi KYC Pelanggan ] ➔ [ Validasi Bukti Transfer ] ➔ [ Hold/Release Servis ]
```

| Langkah / Fase | 📍 Tindakan Admin & UI Layar | ⚙️ Dampak Sistem (Backend & Database) |
| :--- | :--- | :--- |
| **1. Kelola Fleet** | Tambah data & tarif mobil baru di `/admin/cars/add`. | Menambahkan armada siap sewa dengan status maintenance `0`. |
| **2. Verifikasi e-KYC** | Cek foto KTP & Selfie via Modal di menu **Customers**. | Tombol SweetAlert2 mengubah status KYC menjadi `Approved`. |
| **3. Validasi Bayar** | Verifikasi transfer bank di menu **Bookings**. | Set status transaksi `DP Paid` & status sewa `Ready for Pickup`. |
| **4. Perawatan Armada** | Klik **Kembalikan & Hold** saat sewa mobil selesai. | Kolom `maintenance_quantity` bertambah (armada ditarik dari katalog). |

---

## 📦 Uji Rilis & Verifikasi Build

Untuk memastikan semua modul terintegrasi, bebas dari kesalahan runtime TypeScript, dan siap dirilis ke platform cloud Vercel, jalankan perintah kompilasi produksi berikut:
```bash
npm run build
```
Hasil kompilasi akan menghasilkan rute statis & dinamis yang sangat teroptimasi dengan kode status keluar **0** (Sukses).

---

✨ *Developed proudly with elite standards as a modern, safe, and luxury automotive rental ecosystem.*
