import pool from '../config/db.js';
import fs from 'fs';
import { handleDbError } from '../utils/logger.js';

export const getMedia = async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM media_library ORDER BY created_at DESC');
    return res.json(rows);
  } catch (error) {
    return handleDbError(error, 'Failed to fetch media assets', res);
  }
};

export const uploadMedia = async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: 'No file uploaded' });
  }

  try {
    const { originalname, path: filePath, size, mimetype } = req.file;
    const normPath = filePath.replace(/\\/g, '/');
    const [result] = await pool.query(
      `INSERT INTO media_library (file_name, file_path, file_size, file_type) 
       VALUES (?, ?, ?, ?)`,
      [originalname, normPath, size, mimetype]
    );

    return res.status(201).json({
      message: 'Asset uploaded successfully',
      file: {
        id: result.insertId,
        file_name: originalname,
        file_path: normPath,
        file_size: size,
        file_type: mimetype
      }
    });
  } catch (error) {
    return handleDbError(error, 'Failed to record asset upload', res);
  }
};

export const deleteMedia = async (req, res) => {
  const { id } = req.params;

  try {
    const [rows] = await pool.query('SELECT * FROM media_library WHERE id = ?', [id]);
    if (rows.length === 0) {
      return res.status(404).json({ message: 'Asset not found' });
    }

    const file = rows[0];

    if (fs.existsSync(file.file_path)) {
      fs.unlinkSync(file.file_path);
    }

    await pool.query('DELETE FROM media_library WHERE id = ?', [id]);

    return res.json({ message: 'Asset deleted successfully' });
  } catch (error) {
    return handleDbError(error, 'Failed to delete asset', res);
  }
};
