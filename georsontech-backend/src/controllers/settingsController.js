import pool from '../config/db.js';
import { logAudit } from '../utils/logger.js';

export const getSettings = async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT setting_key, setting_value, category FROM settings');
    // Format settings as a clean key-value object
    const config = {};
    rows.forEach(r => {
      config[r.setting_key] = r.setting_value;
    });
    return res.json(config);
  } catch (error) {
    return res.status(500).json({ message: 'Failed to fetch website settings' });
  }
};

export const updateSettings = async (req, res) => {
  const updates = req.body; // Key-value object of settings updates
  const ipAddress = req.ip || req.connection.remoteAddress;

  try {
    // Start transaction to update all keys
    const connection = await pool.getConnection();
    await connection.beginTransaction();

    try {
      for (const [key, value] of Object.entries(updates)) {
        await connection.query(
          'UPDATE settings SET setting_value = ? WHERE setting_key = ?',
          [String(value), key]
        );
      }
      await connection.commit();
      
      // Log audit
      await logAudit(req.user?.id, 'UPDATE_SETTINGS', 'settings', updates, ipAddress);

      return res.json({ message: 'Settings updated successfully' });
    } catch (err) {
      await connection.rollback();
      throw err;
    } finally {
      connection.release();
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Failed to update settings' });
  }
};
