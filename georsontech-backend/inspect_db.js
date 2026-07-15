import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

async function inspect() {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'georsontech_db',
    port: parseInt(process.env.DB_PORT || '3306')
  });

  try {
    const [locations] = await connection.query("SELECT * FROM office_locations");
    console.log('--- DB OFFICE LOCATIONS ---');
    console.table(locations);
  } catch (err) {
    console.error(err);
  } finally {
    await connection.end();
  }
}

inspect();
