import pool from '../config/db.js';

export const logAudit = async (userId, action, targetTable, details, ipAddress) => {
  try {
    await pool.query(
      `INSERT INTO audit_logs (user_id, action, target_table, details, ip_address) 
       VALUES (?, ?, ?, ?, ?)`,
      [userId || null, action, targetTable, typeof details === 'object' ? JSON.stringify(details) : details, ipAddress]
    );
  } catch (error) {
    console.error('Audit log write failure:', error);
  }
};

export const logLogin = async (userId, username, status, ipAddress, userAgent) => {
  try {
    await pool.query(
      `INSERT INTO login_history (user_id, username, status, ip_address, user_agent) 
       VALUES (?, ?, ?, ?, ?)`,
      [userId || null, username, status, ipAddress, userAgent]
    );
  } catch (error) {
    console.error('Login history log write failure:', error);
  }
};
