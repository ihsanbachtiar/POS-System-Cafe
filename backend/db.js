const mysql = require('mysql2/promise');

// Anda bisa menyesuaikan konfigurasi ini dengan phpMyAdmin lokal Anda
const pool = mysql.createPool({
  host: 'localhost',
  user: 'root', // User default XAMPP/phpMyAdmin
  password: '', // Password default XAMPP biasanya kosong
  database: 'pesancafe_db', // Nama database yang harus dibuat di phpMyAdmin
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Test connection
pool.getConnection()
  .then((conn) => {
    console.log('Connected to MySQL Database');
    conn.release();
  })
  .catch((err) => {
    console.error('Error connecting to MySQL:', err.message);
  });

module.exports = pool;
