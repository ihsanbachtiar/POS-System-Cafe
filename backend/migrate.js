const db = require('./db');

const migrate = async () => {
  const connection = await db.getConnection();
  try {
    console.log('Starting migration...');

    // 1. Add image_url column if it doesn't exist
    try {
      await connection.query('ALTER TABLE menu ADD COLUMN image_url VARCHAR(1000) DEFAULT "https://images.unsplash.com/photo-1497935586351-b67a49e012bf?auto=format&fit=crop&w=500&q=80"');
      console.log('Successfully added image_url column.');
    } catch (e) {
      if (e.code === 'ER_DUP_FIELDNAME') {
        console.log('image_url column already exists, skipping.');
      } else {
        throw e;
      }
    }

    // 2. Update existing dummy data with nice images based on name
    await connection.query(`UPDATE menu SET image_url = 'https://images.unsplash.com/photo-1511920170033-f8396924c348?auto=format&fit=crop&w=500&q=80' WHERE name = 'Espresso'`);
    await connection.query(`UPDATE menu SET image_url = 'https://images.unsplash.com/photo-1534778101976-62847782c213?auto=format&fit=crop&w=500&q=80' WHERE name = 'Cappuccino'`);
    await connection.query(`UPDATE menu SET image_url = 'https://images.unsplash.com/photo-1570968915860-54d5c301fa9f?auto=format&fit=crop&w=500&q=80' WHERE name = 'Latte'`);
    await connection.query(`UPDATE menu SET image_url = 'https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?auto=format&fit=crop&w=500&q=80' WHERE name = 'Nasi Goreng Spesial'`);
    await connection.query(`UPDATE menu SET image_url = 'https://images.unsplash.com/photo-1576107232684-1279f390859f?auto=format&fit=crop&w=500&q=80' WHERE name = 'French Fries'`);

    // 3. Add status column to transactions if it doesn't exist
    try {
      await connection.query("ALTER TABLE transactions ADD COLUMN status ENUM('pending', 'proses', 'selesai') DEFAULT 'pending'");
      console.log('Successfully added status column to transactions.');
    } catch (e) {
      if (e.code === 'ER_DUP_FIELDNAME') {
        console.log('status column already exists in transactions, skipping.');
      } else {
        throw e;
      }
    }

    // 4. Insert more dummy menu data
    const dummyMenus = [
      { name: 'Iced Matcha Latte', category: 'Non-Coffee', price: 32000, desc: 'Premium matcha dengan fresh milk', img: '/images/matcha_latte.png' },
      { name: 'Caramel Macchiato', category: 'Coffee', price: 35000, desc: 'Espresso dengan vanilla dan caramel drizzle', img: '/images/caramel_macchiato.png' },
      { name: 'Red Velvet Latte', category: 'Non-Coffee', price: 30000, desc: 'Latte rasa red velvet yang creamy', img: '/images/red_velvet_latte.png' },
      { name: 'Croissant Butter', category: 'Snacks', price: 25000, desc: 'Croissant renyah dengan butter asli', img: '/images/croissant_butter.png' },
      { name: 'Choco Lava Cake', category: 'Snacks', price: 28000, desc: 'Kue coklat lumer di dalam', img: '/images/choco_lava_cake.png' },
      { name: 'Spaghetti Bolognese', category: 'Food', price: 45000, desc: 'Spaghetti dengan saus daging sapi', img: '/images/spaghetti_bolognese.png' },
      { name: 'Chicken Cordon Bleu', category: 'Food', price: 55000, desc: 'Dada ayam isi smoked beef & cheese', img: '/images/chicken_cordon_bleu.png' },
      { name: 'Lychee Tea', category: 'Non-Coffee', price: 22000, desc: 'Teh segar dengan buah leci asli', img: '/images/lychee_tea.png' },
      { name: 'Beef Burger', category: 'Food', price: 48000, desc: 'Burger sapi dengan keju dan kentang', img: '/images/beef_burger.png' },
      { name: 'Affogato', category: 'Coffee', price: 30000, desc: 'Es krim vanilla disiram espresso panas', img: '/images/affogato.png' }
    ];

    for (const item of dummyMenus) {
      const [rows] = await connection.query('SELECT id FROM menu WHERE name = ?', [item.name]);
      if (rows.length === 0) {
        await connection.query(
          'INSERT INTO menu (name, category, price, description, is_active, image_url) VALUES (?, ?, ?, ?, ?, ?)',
          [item.name, item.category, item.price, item.desc, true, item.img]
        );
      } else {
        // Fix existing broken images
        await connection.query('UPDATE menu SET image_url = ? WHERE name = ?', [item.img, item.name]);
      }
    }
    console.log('Dummy data insertion completed.');

    console.log('Migration completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Migration failed:', error);
    process.exit(1);
  } finally {
    connection.release();
  }
};

migrate();
