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
