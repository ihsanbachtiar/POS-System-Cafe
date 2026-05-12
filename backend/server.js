const express = require('express');
const cors = require('cors');
const db = require('./db');

const app = express();
const PORT = process.env.PORT || 5001;

app.use(cors());
app.use(express.json());

// --- AUTH ROUTES ---
app.post('/api/login', async (req, res) => {
  const { username, password } = req.body;
  try {
    const [rows] = await db.query('SELECT id, username, role FROM users WHERE username = ? AND password = ?', [username, password]);
    if (rows.length > 0) {
      res.json({ success: true, user: rows[0] });
    } else {
      res.status(401).json({ success: false, message: 'Invalid credentials' });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

app.post('/api/register', async (req, res) => {
  const { username, password } = req.body;
  try {
    const [existing] = await db.query('SELECT id FROM users WHERE username = ?', [username]);
    if (existing.length > 0) {
      return res.status(400).json({ success: false, message: 'Username already exists' });
    }
    
    // Default role for new registration is 'kasir'
    const [result] = await db.query(
      'INSERT INTO users (username, password, role) VALUES (?, ?, ?)',
      [username, password, 'kasir']
    );
    res.json({ success: true, message: 'Registration successful' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// --- MENU ROUTES ---
app.get('/api/menu', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM menu');
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/menu', async (req, res) => {
  const { name, category, price, description, is_active, image_url } = req.body;
  try {
    const [result] = await db.query(
      'INSERT INTO menu (name, category, price, description, is_active, image_url) VALUES (?, ?, ?, ?, ?, ?)',
      [name, category, price, description, is_active !== undefined ? is_active : true, image_url || '']
    );
    res.json({ id: result.insertId, name, category, price, description, is_active, image_url });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.put('/api/menu/:id', async (req, res) => {
  const { id } = req.params;
  const { name, category, price, description, is_active, image_url } = req.body;
  try {
    await db.query(
      'UPDATE menu SET name = ?, category = ?, price = ?, description = ?, is_active = ?, image_url = ? WHERE id = ?',
      [name, category, price, description, is_active, image_url, id]
    );
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.delete('/api/menu/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await db.query('DELETE FROM menu WHERE id = ?', [id]);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// --- TRANSACTIONS ROUTES ---
app.post('/api/transactions', async (req, res) => {
  const { user_id, total, payment_type, payment_amount, change_amount, items } = req.body;
  const connection = await db.getConnection();
  try {
    await connection.beginTransaction();

    // 1. Insert transaction
    const [txResult] = await connection.query(
      'INSERT INTO transactions (user_id, total, payment_type, payment_amount, change_amount) VALUES (?, ?, ?, ?, ?)',
      [user_id, total, payment_type, payment_amount, change_amount]
    );
    const transactionId = txResult.insertId;

    // 2. Insert transaction items
    for (const item of items) {
      await connection.query(
        'INSERT INTO transaction_items (transaction_id, menu_id, qty, price, subtotal) VALUES (?, ?, ?, ?, ?)',
        [transactionId, item.menu_id, item.qty, item.price, item.subtotal]
      );
    }

    await connection.commit();
    res.json({ success: true, transactionId });
  } catch (error) {
    await connection.rollback();
    res.status(500).json({ error: error.message });
  } finally {
    connection.release();
  }
});

app.get('/api/transactions', async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT t.*, u.username as cashier_name 
      FROM transactions t
      JOIN users u ON t.user_id = u.id
      ORDER BY t.created_at DESC
    `);
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// --- USERS ROUTES (For Admin) ---
app.get('/api/users', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT id, username, role, created_at FROM users');
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
