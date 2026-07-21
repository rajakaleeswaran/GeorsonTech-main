/**
 * @file logger.js
 * @description Central error logging helper to catch MySQL offline errors (ECONNREFUSED)
 * and prevent dumping full AggregateError stack traces into the Node.js terminal.
 */

import pool from '../config/db.js';

export function handleDbError(error, contextMessage, res = null, statusCode = 500) {
  const isConnRefused = 
    error?.code === 'ECONNREFUSED' || 
    error?.message?.includes('ECONNREFUSED') || 
    error?.name === 'AggregateError' ||
    (Array.isArray(error?.errors) && error.errors.some(e => e?.code === 'ECONNREFUSED'));

  if (isConnRefused) {
    console.warn(`[MySQL Offline] ${contextMessage} (ECONNREFUSED 3306)`);
    if (res) {
      return res.status(503).json({ message: `${contextMessage}: Database connection refused` });
    }
  } else {
    console.error(`[Error] ${contextMessage}:`, error);
    if (res) {
      return res.status(statusCode).json({ message: contextMessage });
    }
  }
}

export async function logLogin(userId, username, status, ipAddress, userAgent) {
  try {
    await pool.query(
      'INSERT INTO login_history (user_id, username, status, ip_address, user_agent) VALUES (?, ?, ?, ?, ?)',
      [userId, username, status, ipAddress, userAgent]
    );
  } catch (error) {
    console.error('Failed to log login attempt:', error);
  }
}
