const mysql = require('mysql2/promise');
const pool = mysql.createPool({
  host: 'localhost',
  user: 'root', 
  password: '', 
  database: 'pesancafe_db', 
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
