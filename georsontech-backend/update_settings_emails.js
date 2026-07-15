import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

async function updateEmails() {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'georsontech_db',
    port: parseInt(process.env.DB_PORT || '3306')
  });

  try {
    const targetEmail = 'rajakaleeswaranhari1976@gmail.com';
    const [result] = await connection.query(
      `UPDATE settings 
       SET setting_value = ? 
       WHERE setting_key IN ('sales_email', 'hr_email', 'projects_email')`,
      [targetEmail]
    );
    console.log('Update result:', result);
    console.log('Successfully updated settings recipient emails to:', targetEmail);
  } catch (err) {
    console.error('Error updating settings:', err);
  } finally {
    await connection.end();
  }
}

updateEmails();
