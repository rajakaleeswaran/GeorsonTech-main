import pool from '../config/db.js';
import fs from 'fs';
import { logAudit } from '../utils/logger.js';

export const getMedia = async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM media_library ORDER BY created_at DESC');
    return res.json(rows);
  } catch (error) {
    return res.status(500).json({ message: 'Failed to fetch media assets' });
  }
};

export const uploadMedia = async (req, res) => {
  const ipAddress = req.ip || req.connection.remoteAddress;
  if (!req.file) {
    return res.status(400).json({ message: 'No file uploaded' });
  }

  try {
    const { originalname, path, size, mimetype } = req.file;
    const [result] = await pool.query(
      `INSERT INTO media_library (file_name, file_path, file_size, file_type) 
       VALUES (?, ?, ?, ?)`,
      [originalname, path, size, mimetype]
    );

    await logAudit(req.user?.id, 'UPLOAD_MEDIA', 'media_library', { id: result.insertId, name: originalname }, ipAddress);

    return res.status(201).json({
      message: 'Asset uploaded successfully',
      file: {
        id: result.insertId,
        file_name: originalname,
        file_path: path,
        file_size: size,
        file_type: mimetype
      }
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Failed to record asset upload' });
  }
};

export const deleteMedia = async (req, res) => {
  const { id } = req.params;
  const ipAddress = req.ip || req.connection.remoteAddress;

  try {
    const [rows] = await pool.query('SELECT * FROM media_library WHERE id = ?', [id]);
    if (rows.length === 0) {
      return res.status(404).json({ message: 'Asset not found' });
    }

    const file = rows[0];

    // Delete physically from disk
    if (fs.existsSync(file.file_path)) {
      fs.unlinkSync(file.file_path);
    }

    // Delete record
    await pool.query('DELETE FROM media_library WHERE id = ?', [id]);

    await logAudit(req.user?.id, 'DELETE_MEDIA', 'media_library', { id, name: file.file_name }, ipAddress);

    return res.json({ message: 'Asset deleted successfully' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Failed to delete asset' });
  }
};
