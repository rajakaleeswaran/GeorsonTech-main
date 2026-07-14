import pool from '../config/db.js';

// Public endpoints
export const getIndustries = async (req, res) => {
  let query = 'SELECT * FROM industries WHERE 1=1';
  const params = [];

  const isAdmin = req.baseUrl.includes('admin') || req.path.includes('admin');
  if (!isAdmin) {
    query += ' AND status = "Publish"';
  }

  query += ' ORDER BY sort_order ASC, created_at DESC';

  try {
    const [industries] = await pool.query(query, params);
    return res.json(industries);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Failed to retrieve industries' });
  }
};

export const getIndustryBySlug = async (req, res) => {
  const { slug } = req.params;
  try {
    const [industries] = await pool.query('SELECT * FROM industries WHERE slug = ? AND status = "Publish"', [slug]);
    if (industries.length === 0) {
      return res.status(404).json({ message: 'Industry not found' });
    }
    return res.json(industries[0]);
  } catch (error) {
    return res.status(500).json({ message: 'Failed to retrieve industry' });
  }
};

// Admin CRUD endpoints
export const createIndustry = async (req, res) => {
  const { name, slug, description, detailed_description, sort_order, status } = req.body;
  const image_path = req.file ? req.file.path.replace(/\\/g, '/') : null;

  if (!name || !slug) {
    return res.status(400).json({ message: 'Name and slug are required' });
  }

  try {
    const [result] = await pool.query(
      `INSERT INTO industries (name, slug, description, detailed_description, image_path, sort_order, status) 
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [name, slug, description || null, detailed_description || null, image_path, parseInt(sort_order || 0), status || 'Publish']
    );

    return res.status(201).json({ message: 'Industry created successfully', industryId: result.insertId });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Failed to create industry' });
  }
};

export const updateIndustry = async (req, res) => {
  const { id } = req.params;
  const { name, slug, description, detailed_description, sort_order, status } = req.body;

  try {
    const [industries] = await pool.query('SELECT * FROM industries WHERE id = ?', [id]);
    if (industries.length === 0) {
      return res.status(404).json({ message: 'Industry not found' });
    }

    const current = industries[0];
    const image_path = req.file ? req.file.path.replace(/\\/g, '/') : current.image_path;

    await pool.query(
      `UPDATE industries 
       SET name = ?, slug = ?, description = ?, detailed_description = ?, image_path = ?, sort_order = ?, status = ? 
       WHERE id = ?`,
      [name, slug, description || null, detailed_description || null, image_path, parseInt(sort_order || 0), status || 'Publish', id]
    );

    return res.json({ message: 'Industry updated successfully' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Failed to update industry' });
  }
};

export const deleteIndustry = async (req, res) => {
  const { id } = req.params;
  try {
    const [result] = await pool.query('DELETE FROM industries WHERE id = ?', [id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Industry not found' });
    }
    return res.json({ message: 'Industry deleted successfully' });
  } catch (error) {
    return res.status(500).json({ message: 'Failed to delete industry' });
  }
};
