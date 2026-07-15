import pool from '../config/db.js';
import { logAudit } from '../utils/logger.js';

export const getLocations = async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM office_locations ORDER BY id ASC');
    return res.json(rows);
  } catch (error) {
    return res.status(500).json({ message: 'Failed to fetch office locations' });
  }
};

export const createLocation = async (req, res) => {
  const { office_name, office_type, address, phone, email, google_map_link, latitude, longitude } = req.body;
  const image = req.file ? req.file.path.replace(/\\/g, '/') : null;
  const ipAddress = req.ip || req.connection.remoteAddress;

  if (!office_name || !office_type || !address) {
    return res.status(400).json({ message: 'Office name, type, and address are required' });
  }

  try {
    const [result] = await pool.query(
      `INSERT INTO office_locations (office_name, office_type, address, phone, email, google_map_link, latitude, longitude, image) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [office_name, office_type, address, phone || null, email || null, google_map_link || null, latitude || null, longitude || null, image]
    );

    await logAudit(req.user?.id, 'CREATE_LOCATION', 'office_locations', { id: result.insertId, office_name }, ipAddress);

    return res.status(201).json({ message: 'Location created successfully', locationId: result.insertId });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Failed to save location' });
  }
};

export const updateLocation = async (req, res) => {
  const { id } = req.params;
  const { office_name, office_type, address, phone, email, google_map_link, latitude, longitude } = req.body;
  const ipAddress = req.ip || req.connection.remoteAddress;

  try {
    const [rows] = await pool.query('SELECT * FROM office_locations WHERE id = ?', [id]);
    if (rows.length === 0) {
      return res.status(404).json({ message: 'Location not found' });
    }

    const current = rows[0];
    const image = req.file ? req.file.path.replace(/\\/g, '/') : current.image;

    await pool.query(
      `UPDATE office_locations 
       SET office_name = ?, office_type = ?, address = ?, phone = ?, email = ?, google_map_link = ?, latitude = ?, longitude = ?, image = ? 
       WHERE id = ?`,
      [office_name, office_type, address, phone || null, email || null, google_map_link || null, latitude || null, longitude || null, image, id]
    );

    await logAudit(req.user?.id, 'UPDATE_LOCATION', 'office_locations', { id, office_name }, ipAddress);

    return res.json({ message: 'Location updated successfully' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Failed to update location' });
  }
};

export const deleteLocation = async (req, res) => {
  const { id } = req.params;
  const ipAddress = req.ip || req.connection.remoteAddress;

  try {
    const [result] = await pool.query('DELETE FROM office_locations WHERE id = ?', [id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Location not found' });
    }

    await logAudit(req.user?.id, 'DELETE_LOCATION', 'office_locations', { id }, ipAddress);

    return res.json({ message: 'Location deleted successfully' });
  } catch (error) {
    return res.status(500).json({ message: 'Failed to delete location' });
  }
};
