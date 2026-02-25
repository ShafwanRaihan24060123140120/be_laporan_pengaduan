const { Pool } = require('pg');
const bcrypt = require('bcryptjs');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

async function query(sql, params = []) {
  const result = await pool.query(sql, params);
  return result;
}

async function init() {
  await query(`
    CREATE TABLE IF NOT EXISTS admins (
      id SERIAL PRIMARY KEY,
      username TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      password_changed_at BIGINT DEFAULT 0
    );
  `);

  await query(`
    CREATE TABLE IF NOT EXISTS reports (
      id TEXT PRIMARY KEY,
      email_pelapor TEXT,
      nama_barang TEXT,
      tanggal TEXT,
      unit TEXT,
      deskripsi TEXT,
      image_url TEXT,
      image_url2 TEXT,
      image_url3 TEXT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      status TEXT DEFAULT 'Pending'
    );
  `);

  await query(`
    CREATE TABLE IF NOT EXISTS teknisi (
      id SERIAL PRIMARY KEY,
      username TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      password_changed_at BIGINT DEFAULT 0
    );
  `);

  await query(`
    CREATE TABLE IF NOT EXISTS pelapor (
      id SERIAL PRIMARY KEY,
      username TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      unit TEXT NOT NULL,
      password_changed_at BIGINT DEFAULT 0
    );
  `);
}

async function getAdminByUsername(username) {
  const result = await query('SELECT * FROM admins WHERE username = $1', [username]);
  return result.rows[0];
}

async function getTeknisiByUsername(username) {
  const result = await query('SELECT * FROM teknisi WHERE username = $1', [username]);
  return result.rows[0];
}

async function listReports() {
  const result = await query('SELECT * FROM reports ORDER BY created_at ASC, id ASC');
  return result.rows;
}

module.exports = {
  init,
  getAdminByUsername,
  getTeknisiByUsername,
  listReports,
  getReportById: (id) => {
    const db = openDb();
    return get(db, 'SELECT * FROM reports WHERE id = ?', [id]);
  },
  deleteReport: (id) => {
    const db = openDb();
    return run(db, 'DELETE FROM reports WHERE id = ?', [id]);
  },
  updateReportStatus: (id, status) => {
    const db = openDb();
    return run(db, 'UPDATE reports SET status = ? WHERE id = ?', [status, id]);
  },
  updateReportImages: (id, urls) => {
    const db = openDb();
    const [u1 = null, u2 = null, u3 = null] = urls || [];
    return run(db, 'UPDATE reports SET image_url = ?, image_url2 = ?, image_url3 = ? WHERE id = ?', [u1, u2, u3, id]);
  },
  getPelaporByUsername: (username) => {
    const db = openDb();
    return get(db, 'SELECT * FROM pelapor WHERE username = ?', [username]);
  }
};
