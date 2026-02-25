const express = require('express');
const router = express.Router();
const { authenticateToken, requirePelapor } = require('../../middleware/auth');
const apiLimiter = require('../../middleware/rateLimiter').apiLimiter;

// Custom rate limiter untuk pelapor: 500 request per 15 menit
const rateLimit = require('express-rate-limit');
const pelaporLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 menit
  max: 500, // 500 request per IP
  message: {
    error: 'Terlalu banyak permintaan, coba lagi nanti.'
  }
});

// Import Cloudinary upload
const { upload } = require('../../config/cloudinary');

const { query } = require('../../db');

// Mapping unit/lokasi ke kode singkat
const unitCodeMap = {
  'BS (Business Service)': 'BS',
  'LGS (Local Government Service)': 'LGS',
  'PRQ (Performance, Risk & Quality)': 'PRQ',
  'SSGS (Shared Service General Support)': 'SSGS'
};

// Fungsi untuk generate ID berdasarkan unit dengan nomor urut
async function generateReportId(unit) {
  const code = unitCodeMap[unit] || 'LR';
  // Ambil nomor urut terbesar dari id yang sudah ada
  const sql = `SELECT MAX(CAST(SUBSTRING(id, $1) AS INTEGER)) as maxNum FROM reports WHERE id LIKE $2`;
  const startIndex = code.length + 2;
  const result = await query(sql, [startIndex, `${code}-%`]);
  const maxNum = result.rows[0]?.maxnum || 0;
  const nextNumber = (Number(maxNum) || 0) + 1;
  const paddedNumber = String(nextNumber).padStart(3, '0');
  return `${code}-${paddedNumber}`;
}

// POST /api/pelapor/laporan - tambah laporan ke DB (max 3 foto)
router.post('/laporan', authenticateToken, requirePelapor, pelaporLimiter, upload.array('foto', 3), async (req, res) => {
  const { nama, tanggal, aset, deskripsi } = req.body;
  const unit = req.user.unit;
  const files = req.files || [];
  const fotoUrls = files.map(f => f.path);
  if (!nama || !tanggal || !aset || !deskripsi || fotoUrls.length === 0) {
    return res.status(400).json({ error: 'Semua field wajib diisi dan minimal 1 foto' });
  }
  const [foto1, foto2, foto3] = [fotoUrls[0] || null, fotoUrls[1] || null, fotoUrls[2] || null];
  try {
    const id = await generateReportId(unit);
    await query(
      'INSERT INTO reports (id, email_pelapor, nama_barang, tanggal, unit, deskripsi, image_url, image_url2, image_url3, status) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)',
      [id, nama, aset, tanggal, unit, deskripsi, foto1, foto2, foto3, 'Pending']
    );
    res.json({ success: true, laporan: { id, nama, unit, tanggal, aset, deskripsi, foto: fotoUrls, status: 'Pending' } });
  } catch (e) {
    res.status(500).json({ error: 'Gagal menyimpan laporan' });
  }
});

// GET /api/pelapor/laporan - list laporan dari DB (hanya laporan dari unit sendiri)
router.get('/laporan', authenticateToken, requirePelapor, async (req, res) => {
  const unit = req.user.unit;
  try {
    const result = await query('SELECT * FROM reports WHERE unit = $1 ORDER BY created_at ASC, id ASC', [unit]);
    const mapped = result.rows.map(r => ({
      id: r.id,
      nama: r.email_pelapor,
      unit: r.unit,
      tanggal: r.tanggal,
      aset: r.nama_barang,
      nama_barang: r.nama_barang,
      email_pelapor: r.email_pelapor,
      deskripsi: r.deskripsi,
      foto: r.image_url,
      image_url: r.image_url,
      image_url2: r.image_url2,
      image_url3: r.image_url3,
      status: r.status || 'Pending'
    }));
    res.json(mapped);
  } catch (e) {
    res.status(500).json({ error: 'Gagal mengambil data laporan' });
  }
});

module.exports = router;
