// scripts/init-db.js
// Run with: node scripts/init-db.js
// Make sure DATABASE_URL is set in .env

const { neon } = require('@neondatabase/serverless');
require('dotenv').config({ path: '.env.local' });

async function initDB() {
  const sql = neon(process.env.DATABASE_URL);

  console.log('Creating tables...');

  await sql`
    CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY,
      username VARCHAR(100) UNIQUE NOT NULL,
      password VARCHAR(255) NOT NULL,
      role VARCHAR(20) NOT NULL DEFAULT 'student',
      created_at TIMESTAMP DEFAULT NOW()
    )
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS students (
      id SERIAL PRIMARY KEY,
      name VARCHAR(200) NOT NULL,
      nis VARCHAR(20) UNIQUE NOT NULL,
      position VARCHAR(50) DEFAULT 'Anggota',
      photo_url TEXT,
      user_id INT REFERENCES users(id),
      created_at TIMESTAMP DEFAULT NOW()
    )
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS subjects (
      id SERIAL PRIMARY KEY,
      name VARCHAR(200) NOT NULL,
      created_at TIMESTAMP DEFAULT NOW()
    )
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS schedules (
      id SERIAL PRIMARY KEY,
      subject_id INT REFERENCES subjects(id),
      day VARCHAR(20) NOT NULL,
      start_time VARCHAR(10) NOT NULL,
      end_time VARCHAR(10) NOT NULL,
      created_at TIMESTAMP DEFAULT NOW()
    )
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS announcements (
      id SERIAL PRIMARY KEY,
      title VARCHAR(300) NOT NULL,
      content TEXT NOT NULL,
      created_by INT REFERENCES users(id),
      created_at TIMESTAMP DEFAULT NOW()
    )
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS activities (
      id SERIAL PRIMARY KEY,
      title VARCHAR(300) NOT NULL,
      description TEXT,
      date DATE NOT NULL,
      photo_url TEXT,
      created_by INT REFERENCES users(id),
      created_at TIMESTAMP DEFAULT NOW()
    )
  `;

  // Insert default admin
  const bcrypt = require('bcryptjs');
  const adminPassword = await bcrypt.hash('admin123', 10);
  
  await sql`
    INSERT INTO users (username, password, role)
    VALUES ('admin', ${adminPassword}, 'admin')
    ON CONFLICT (username) DO NOTHING
  `;

  // Insert default wali kelas
  const waliPassword = await bcrypt.hash('walikelas123', 10);
  await sql`
    INSERT INTO users (username, password, role)
    VALUES ('walikelas', ${waliPassword}, 'wali_kelas')
    ON CONFLICT (username) DO NOTHING
  `;

  // Add photo_url column if not exists (for existing DBs)
  await sql`ALTER TABLE activities ADD COLUMN IF NOT EXISTS photo_url TEXT`;

  // Insert sample subjects
  const subjects = [
    'Bahasa Indonesia',
    'Bahasa Inggris',
    'Matematika',
    'Ilmu Pengetahuan Alam (IPA)',
    'Ilmu Pengetahuan Sosial (IPS)',
    'Seni Budaya',
    'Pendidikan Jasmani',
    'Prakarya',
  ];

  for (const subject of subjects) {
    await sql`
      INSERT INTO subjects (name)
      VALUES (${subject})
      ON CONFLICT DO NOTHING
    `;
  }

  // Insert sample schedules
  const scheduleData = [
    { subject: 'Bahasa Indonesia', day: 'Senin', start: '08:00', end: '09:00' },
    { subject: 'Bahasa Inggris', day: 'Senin', start: '09:00', end: '10:00' },
    { subject: 'Matematika', day: 'Senin', start: '10:00', end: '11:00' },
    { subject: 'Ilmu Pengetahuan Alam (IPA)', day: 'Senin', start: '13:00', end: '15:00' },
    { subject: 'Ilmu Pengetahuan Sosial (IPS)', day: 'Selasa', start: '09:00', end: '10:00' },
    { subject: 'Seni Budaya', day: 'Rabu', start: '10:00', end: '11:00' },
    { subject: 'Pendidikan Jasmani', day: 'Kamis', start: '13:00', end: '15:00' },
    { subject: 'Prakarya', day: 'Jumat', start: '08:00', end: '09:00' },
  ];

  for (const s of scheduleData) {
    const subjectResult = await sql`SELECT id FROM subjects WHERE name = ${s.subject} LIMIT 1`;
    if (subjectResult.length > 0) {
      await sql`
        INSERT INTO schedules (subject_id, day, start_time, end_time)
        VALUES (${subjectResult[0].id}, ${s.day}, ${s.start}, ${s.end})
      `;
    }
  }


  // ─────────────────────────────────────────────
  //  Insert sample students (struktur pengurus)
  //  Urutan: Wali Kelas → Ketua → Wakil Ketua →
  //          Sekretaris → Bendahara → Anggota
  // ─────────────────────────────────────────────
  const studentData = [
    // Wali Kelas
    { name: 'Bu Ratna Dewi, S.Pd.',   nis: '197801012005', position: 'Wali Kelas'     },

    // Pengurus Inti
    { name: 'Arif Hidayat',           nis: '2025001',      position: 'Ketua'           },
    { name: 'Siti Nurhaliza',         nis: '2025002',      position: 'Wakil Ketua'     },
    { name: 'Dewi Rahayu',            nis: '2025003',      position: 'Sekretaris'    },
    { name: 'Fajar Ramadhan',         nis: '2025004',      position: 'Sekretaris'   },
    { name: 'Maya Anggraini',         nis: '2025005',      position: 'Bendahara'     },
    { name: 'Rizky Firmansyah',       nis: '2025006',      position: 'Bendahara'    },

    // Anggota
    { name: 'Andi Pratama',           nis: '2025007',      position: 'Anggota' },
    { name: 'Budi Santoso',           nis: '2025008',      position: 'Anggota' },
    { name: 'Citra Lestari',          nis: '2025009',      position: 'Anggota' },
    { name: 'Dina Marlina',           nis: '2025010',      position: 'Anggota' },
    { name: 'Eko Prasetyo',           nis: '2025011',      position: 'Anggota' },
    { name: 'Fitri Handayani',        nis: '2025012',      position: 'Anggota' },
    { name: 'Gilang Saputra',         nis: '2025013',      position: 'Anggota' },
    { name: 'Hani Permatasari',       nis: '2025014',      position: 'Anggota' },
    { name: 'Irfan Maulana',          nis: '2025015',      position: 'Anggota' },
    { name: 'Jihan Aulia',            nis: '2025016',      position: 'Anggota' },
    { name: 'Kevin Surya',            nis: '2025017',      position: 'Anggota' },
    { name: 'Laila Nurfitria',        nis: '2025018',      position: 'Anggota' },
    { name: 'Muhamad Fauzan',         nis: '2025019',      position: 'Anggota' },
    { name: 'Nadya Putri',            nis: '2025020',      position: 'Anggota' },
    { name: 'Oscar Wibowo',           nis: '2025021',      position: 'Anggota' },
    { name: 'Putri Ayu',              nis: '2025022',      position: 'Anggota' },
    { name: 'Qori Ramadani',          nis: '2025023',      position: 'Anggota' },
    { name: 'Reza Nugraha',           nis: '2025024',      position: 'Anggota' },
    { name: 'Sari Indah',             nis: '2025025',      position: 'Anggota' },
    { name: 'Taufik Hidayat',         nis: '2025026',      position: 'Anggota' },
    { name: 'Ulfa Maghfiroh',         nis: '2025027',      position: 'Anggota' },
    { name: 'Vino Adikara',           nis: '2025028',      position: 'Anggota' },
    { name: 'Wulan Sari',             nis: '2025029',      position: 'Anggota' },
    { name: 'Yoga Pratama',           nis: '2025030',      position: 'Anggota' },
  ];

  for (const s of studentData) {
    await sql`
      INSERT INTO students (name, nis, position)
      VALUES (${s.name}, ${s.nis}, ${s.position})
      ON CONFLICT (nis) DO NOTHING
    `;
  }

  console.log('✅ Database initialized successfully!');
  console.log('Admin credentials: username=admin, password=admin123');
  console.log('Wali Kelas credentials: username=walikelas, password=walikelas123');
}

initDB().catch(console.error);
