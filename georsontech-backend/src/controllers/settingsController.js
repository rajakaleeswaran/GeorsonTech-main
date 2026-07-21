import pool from '../config/db.js';
import { handleDbError } from '../utils/logger.js';

export const getSettings = async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT setting_key, setting_value, category FROM settings');
    const config = {};
    rows.forEach(r => {
      config[r.setting_key] = r.setting_value;
    });
    return res.json(config);
  } catch (error) {
    return handleDbError(error, 'Failed to fetch website settings', res);
  }
};

export const updateSettings = async (req, res) => {
  const updates = req.body;

  let connection;
  try {
    connection = await pool.getConnection();
    await connection.beginTransaction();

    for (const [key, value] of Object.entries(updates)) {
      await connection.query(
        'UPDATE settings SET setting_value = ? WHERE setting_key = ?',
        [String(value), key]
      );
    }
    await connection.commit();

    return res.json({ message: 'Settings updated successfully' });
  } catch (error) {
    if (connection) await connection.rollback();
    return handleDbError(error, 'Failed to update settings', res);
  } finally {
    if (connection) connection.release();
  }
};
