
const { Pool } = require('pg');
const bcrypt = require('bcryptjs');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

async function seed() {

  try {
    console.log('[INFO] Seeding database with dummy accounts...\n');

    // Admin
    const adminExists = await get('SELECT 1 FROM admins WHERE username = $1', ['admin']);
    if (!adminExists) {
      const hash = bcrypt.hashSync('admin123', 12);
      await run('INSERT INTO admins (username, password_hash, password_changed_at) VALUES ($1, $2, $3)', 
        ['admin', hash, 0]);
      console.log('[SUCCESS] Admin created: username=admin, password=admin123');
    } else {
      console.log('[INFO] Admin already exists');
    }

    // Teknisi
    const teknisiExists = await get('SELECT 1 FROM teknisi WHERE username = $1', ['teknisi']);
    if (!teknisiExists) {
      const hash = bcrypt.hashSync('TeknisiBaru2026!', 12);
      await run('INSERT INTO teknisi (username, password_hash, password_changed_at) VALUES ($1, $2, $3)', 
        ['teknisi', hash, 0]);
      console.log('[SUCCESS] Teknisi created: username=teknisi, password=TeknisiBaru2026!');
    } else {
      console.log('[INFO] Teknisi already exists');
    }

    // Pelapor accounts
    const pelapors = [
      { username: 'pelapor_bs', password: 'PelaporBS2026!', unit: 'BS (Business Service)' },
      { username: 'pelapor_lgs', password: 'PelaporLGS2026!', unit: 'LGS (Local Government Service)' },
      { username: 'pelapor_prq', password: 'PelaporPRQ2026!', unit: 'PRQ (Performance, Risk & Quality)' },
      { username: 'pelapor_ssgs', password: 'PelaporSSGS2026!', unit: 'SSGS (Shared Service General Support)' }
    ];

    for (const p of pelapors) {
      const exists = await get('SELECT 1 FROM pelapor WHERE username = $1', [p.username]);
      if (!exists) {
        const hash = bcrypt.hashSync(p.password, 12);
        await run('INSERT INTO pelapor (username, password_hash, unit, password_changed_at) VALUES ($1, $2, $3, $4)', 
          [p.username, hash, p.unit, 0]);
        console.log(`[SUCCESS] Pelapor created: username=${p.username}, password=${p.password}, unit=${p.unit}`);
      } else {
        console.log(`[INFO] Pelapor ${p.username} already exists`);
      }
    }

    console.log('\n[DONE] Seeding completed successfully!');
  } catch (error) {
    console.error('[ERROR] Seeding error:', error);
  } finally {
    await pool.end();
  }
// Helper functions for PostgreSQL
async function get(sql, params) {
  const result = await pool.query(sql, params);
  return result.rows[0];
}

async function run(sql, params) {
  await pool.query(sql, params);
}
}

// Export fungsi agar bisa dipanggil dari file lain
module.exports = seed;

// Jika dijalankan langsung (node seed.js)
if (require.main === module) {
  seed();
}
