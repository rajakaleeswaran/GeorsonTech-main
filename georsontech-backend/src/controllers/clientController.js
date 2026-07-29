import pool from '../config/db.js';
import { handleDbError } from '../utils/logger.js';
import { uploadImageToSupabase } from '../config/supabase.js';

// Public endpoints
export const getClients = async (req, res) => {
  let query = 'SELECT * FROM clients WHERE 1=1';
  const params = [];

  const isAdmin = req.baseUrl.includes('admin') || req.path.includes('admin');
  if (!isAdmin) {
    query += ' AND status = "Publish"';
  }

  query += ' ORDER BY sort_order ASC, created_at DESC';

  try {
    const [clients] = await pool.query(query, params);
    return res.json(clients);
  } catch (error) {
    return handleDbError(error, 'Failed to retrieve clients', res);
  }
};

// Admin CRUD endpoints
export const createClient = async (req, res) => {
  const { name, sort_order, status, category } = req.body;

  if (!name) {
    return res.status(400).json({ message: 'Client name is required' });
  }

  try {
    let logo_path = req.body.logo_path || null;
    if (req.file) {
      logo_path = await uploadImageToSupabase(req.file);
    }

    if (!logo_path) {
      return res.status(400).json({ message: 'Client logo upload is required' });
    }

    console.log('[Create Client Payload]', { name, logo_path });

    const [result] = await pool.query(
      `INSERT INTO clients (name, logo_path, sort_order, status, category) 
       VALUES (?, ?, ?, ?, ?)`,
      [name, logo_path, parseInt(sort_order || 0), status || 'Publish', category || 'Client']
    );

    return res.status(201).json({ message: 'Client created successfully', clientId: result.insertId, logo_path });
  } catch (error) {
    return handleDbError(error, 'Failed to create client', res);
  }
};

export const updateClient = async (req, res) => {
  const { id } = req.params;
  const { name, sort_order, status, category } = req.body;

  try {
    const [clients] = await pool.query('SELECT * FROM clients WHERE id = ?', [id]);
    if (clients.length === 0) {
      return res.status(404).json({ message: 'Client not found' });
    }

    const current = clients[0];
    let logo_path = current.logo_path;

    if (req.file) {
      logo_path = await uploadImageToSupabase(req.file);
    } else if (req.body.logo_path !== undefined && req.body.logo_path !== null && req.body.logo_path !== '') {
      logo_path = req.body.logo_path;
    }

    console.log('[Update Client Payload]', { id, name, logo_path });

    await pool.query(
      `UPDATE clients 
       SET name = ?, logo_path = ?, sort_order = ?, status = ?, category = ? 
       WHERE id = ?`,
      [name, logo_path, parseInt(sort_order || 0), status || 'Publish', category || current.category || 'Client', id]
    );

    return res.json({ message: 'Client updated successfully', logo_path });
  } catch (error) {
    return handleDbError(error, 'Failed to update client', res);
  }
};


export const deleteClient = async (req, res) => {
  const { id } = req.params;
  try {
    const [result] = await pool.query('DELETE FROM clients WHERE id = ?', [id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Client not found' });
    }
    return res.json({ message: 'Client deleted successfully' });
  } catch (error) {
    return handleDbError(error, 'Failed to delete client', res);
  }
};
