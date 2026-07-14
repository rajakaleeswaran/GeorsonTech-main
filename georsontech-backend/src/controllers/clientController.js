import pool from '../config/db.js';

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
    console.error(error);
    return res.status(500).json({ message: 'Failed to retrieve clients' });
  }
};

// Admin CRUD endpoints
export const createClient = async (req, res) => {
  const { name, sort_order, status, category } = req.body;
  const logo_path = req.file ? req.file.path.replace(/\\/g, '/') : null;

  if (!name) {
    return res.status(400).json({ message: 'Client name is required' });
  }
  if (!logo_path) {
    return res.status(400).json({ message: 'Client logo upload is required' });
  }

  try {
    const [result] = await pool.query(
      `INSERT INTO clients (name, logo_path, sort_order, status, category) 
       VALUES (?, ?, ?, ?, ?)`,
      [name, logo_path, parseInt(sort_order || 0), status || 'Publish', category || 'Client']
    );

    return res.status(201).json({ message: 'Client created successfully', clientId: result.insertId });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Failed to create client' });
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
    const logo_path = req.file ? req.file.path.replace(/\\/g, '/') : current.logo_path;

    await pool.query(
      `UPDATE clients 
       SET name = ?, logo_path = ?, sort_order = ?, status = ?, category = ? 
       WHERE id = ?`,
      [name, logo_path, parseInt(sort_order || 0), status || 'Publish', category || current.category || 'Client', id]
    );

    return res.json({ message: 'Client updated successfully' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Failed to update client' });
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
    return res.status(500).json({ message: 'Failed to delete client' });
  }
};
