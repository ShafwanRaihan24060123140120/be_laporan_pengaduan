# Backend Sistem Laporan Pengaduan

Sistem backend untuk aplikasi pelaporan dan manajemen aset Telkom. Dibangun dengan Node.js, Express, dan PostgreSQL.

---

## Quick Start

1. **Install dependencies**
   ```bash
   npm install
   ```
2. **Siapkan file .env** 
3. **Jalankan server**
   ```bash
   npm start
   ```
4. **Seed database**
   ```bash
   node scripts/seed.js
   ```

---

## Fitur Utama
- Autentikasi JWT (Admin, Teknisi, Pelapor)
- Role-based access control
- CRUD laporan aset
- Rate limiting & security headers
- Input validation & sanitasi
- Upload gambar (Cloudinary)
- Logging & error handling

---

## Struktur Database (PostgreSQL)

- **admins**: id, username, password_hash, password_changed_at
- **teknisi**: id, username, password_hash, password_changed_at
- **pelapor**: id, username, password_hash, unit, password_changed_at
- **reports**: id, email_pelapor, nama_barang, tanggal, unit, deskripsi, image_url, image_url2, image_url3, created_at, status

---

## Environment Variables (.env)

- `DATABASE_URL` — URL koneksi PostgreSQL
- `JWT_SECRET` — Secret JWT minimal 32 karakter
- `ALLOWED_ORIGINS` — Daftar origin frontend yang diizinkan
- `CLOUDINARY_URL` — untuk upload gambar

---

## Keamanan
- Semua password di-hash (bcrypt)
- Rate limiting login & API
- CORS whitelist
- Helmet security headers
- Input validation (express-validator)

---

## Development Scripts

```bash
npm start             # Start server
npm run dev           # Nodemon auto-reload
node scripts/seed.js  # Seed akun dummy
```

---

## Testing
- Gunakan Postman/cURL untuk test endpoint
- Akun dummy bisa dibuat dengan `node scripts/seed.js`

---

## Folder & File
- **index.js**: Entry point aplikasi backend (server Express).
- **db.js**: Koneksi & helper database (backend).
- **routes/**: Semua endpoint API (backend).
- **middleware/**: Middleware auth, rate limiter, dll (backend).
- **scripts/seed.js**: Script seeding data dummy (backend).
- **config/**: Konfigurasi cloudinary, dsb (backend).

---

## Login untuk Testing

**Admin:**
- Username: `admin`
- Password: `admin123`

**Teknisi:**
- Username: `teknisi`
- Password: `TeknisiBaru2026!`

**Pelapor:**
- Username: `pelapor_bs`, Password: `PelaporBS2026!`, Unit: BS (Business Service)
- Username: `pelapor_lgs`, Password: `PelaporLGS2026!`, Unit: LGS (Local Government Service)
- Username: `pelapor_prq`, Password: `PelaporPRQ2026!`, Unit: PRQ (Performance, Risk & Quality)
- Username: `pelapor_ssgs`, Password: `PelaporSSGS2026!`, Unit: SSGS (Shared Service General Support)
