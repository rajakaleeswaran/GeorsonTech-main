/**
 * One-time admin password reset script.
 * Run: node reset_admin_password.js
 * Then delete this file.
 */
import bcrypt from 'bcryptjs';
import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

const NEW_PASSWORD = 'Admin@123';

async function resetPassword() {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'georsontech_db',
    port: parseInt(process.env.DB_PORT || '3306')
  });

  const hash = await bcrypt.hash(NEW_PASSWORD, 10);

  const [result] = await connection.query(
    `UPDATE users SET password = ? WHERE email = 'admin@georsontech.com'`,
    [hash]
  );

  if (result.affectedRows > 0) {
    console.log('✅ Password reset successfully!');
    console.log('   Email:    admin@georsontech.com');
    console.log(`   Password: ${NEW_PASSWORD}`);
  } else {
    console.log('❌ No user found with that email.');
  }

  await connection.end();
}

resetPassword().catch(err => {
  console.error('❌ Failed to reset password:', err.message);
});
