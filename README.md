# Lab Management System

Sistem Manajemen Laboratorium untuk mengelola:

* Inventaris
* Bahan Habis Pakai (BHP)
* Pengadaan
* Penerimaan Barang
* Maintenance
* Manajemen User dan Role

1. CRUD Procurement Draft (sudah)
2. CRUD Procurement Item (sudah)
3. Submit Draft (sudah)
4. Review Kaprodi (sudah)
5. Finalisasi Kaprodi (sudah)
6. Goods Receipt
7. Inventory
8. Maintenance
9. BHP
10. activity log

## Teknologi

* Node.js
* Express.js
* MySQL / MariaDB
* Pug Template Engine
* AdminLTE
* Bootstrap 4

---

# Clone Repository

```bash
git clone https://github.com/USERNAME/lab-management.git
cd lab-management
```

---

# Install Dependency

Install seluruh package yang dibutuhkan:

```bash
npm install
```

---

# Buat Database

Masuk ke MySQL atau phpMyAdmin lalu buat database:

``Terdapat 2 cara untuk membuat database:``
1. copy dari file text yang ada pada folder public/db/lab_management.txt.
```
2. import file database yang tersedia pada folder database/lab_management.sql.
```
---

# Import Database

Import file database yang tersedia pada folder:

```text
database/lab_management.sql
```

Menggunakan command:

```bash
mysql -u root -p lab_management < database/lab_management.sql
```

Atau menggunakan phpMyAdmin:

1. Pilih database `lab_management`
2. Klik **Import**
3. Pilih file `lab_management.sql`
4. Klik **Go**

---

# Konfigurasi Environment

Buat file:

```text
.env
```

Contoh isi:

```env
PORT=3000

DB_HOST=localhost
DB_USER=root
DB_PASSWORD=
DB_NAME=lab_management

SESSION_SECRET=your_secret_key
```

Sesuaikan dengan konfigurasi MySQL masing-masing.

---

# Jalankan Project

Development mode:

```bash
npm run dev
```

atau

```bash
nodemon app.js
```

Production mode:

```bash
npm start
```

---

# Akses Aplikasi

Buka browser:

```text
http://localhost:3000
```

---

# Akun Dummy
jika password salah, jalan perintah berikut di terminal untuk reset password:
node hash.js 
pada terminal akan muncul hash password baru, copy hash tersebut lalu update ke database melalauiphp myadmin.
```

## Administrator

```text
Email    : admin@lab.com
Password : admin123/password
```

## Kepala Laboratorium

```text
Email    : budi@lab.com
Password : password
```
untuk daftaf bisa lihat menggunakan admin


```

---

# Update Project

Jika sudah pernah clone sebelumnya:

```bash
git pull
npm install
```

Jika terdapat perubahan struktur database:

1. Backup database lama.
2. Import file database terbaru.
3. Sesuaikan file `.env` bila diperlukan.

---

# Catatan

* Jangan commit file `.env`.
* Jangan commit folder `node_modules`.
* Pastikan MySQL/MariaDB sudah berjalan sebelum menjalankan aplikasi.
* Gunakan Node.js versi LTS terbaru yang kompatibel dengan project.
