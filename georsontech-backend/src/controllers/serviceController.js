import pool from '../config/db.js';
import { handleDbError } from '../utils/logger.js';
import { uploadImageToSupabase, uploadBrochureToSupabase } from '../config/supabase.js';

// Public endpoints
export const getServices = async (req, res) => {
  const { search } = req.query;
  let query = 'SELECT * FROM services WHERE 1=1';
  const params = [];

  // If not admin, show only published ones
  const isAdmin = req.baseUrl.includes('admin') || req.path.includes('admin');
  if (!isAdmin) {
    query += ' AND status = "Publish"';
  }

  if (search) {
    query += ' AND (title LIKE ? OR short_description LIKE ?)';
    const term = `%${search}%`;
    params.push(term, term);
  }

  query += ' ORDER BY sort_order ASC, created_at DESC';

  try {
    const [services] = await pool.query(query, params);
    return res.json(services);
  } catch (error) {
    return handleDbError(error, 'Failed to retrieve services', res);
  }
};

export const getServiceBySlug = async (req, res) => {
  const { slug } = req.params;
  try {
    const [services] = await pool.query('SELECT * FROM services WHERE slug = ? AND status = "Publish"', [slug]);
    if (services.length === 0) {
      return res.status(404).json({ message: 'Service not found' });
    }
    return res.json(services[0]);
  } catch (error) {
    return handleDbError(error, 'Failed to retrieve service', res);
  }
};

// Admin CRUD endpoints
export const createService = async (req, res) => {
  const { title, slug, short_description, detailed_description, features, sort_order, status } = req.body;

  if (!title || !slug) {
    return res.status(400).json({ message: 'Title and slug are required' });
  }

  try {
    let image_path = req.body.image_path || null;
    let pdf_brochure_path = req.body.pdf_brochure_path || null;

    if (req.files && req.files['image']) {
      image_path = await uploadImageToSupabase(req.files['image'][0]);
    }
    if (req.files && req.files['brochure']) {
      pdf_brochure_path = await uploadBrochureToSupabase(req.files['brochure'][0]);
    }

    console.log('[Create Service Payload]', { title, slug, image_path, pdf_brochure_path });

    const [result] = await pool.query(
      `INSERT INTO services (title, slug, short_description, detailed_description, features, image_path, pdf_brochure_path, sort_order, status) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [title, slug, short_description || null, detailed_description || null, features || null, image_path, pdf_brochure_path, parseInt(sort_order || 0), status || 'Publish']
    );

    return res.status(201).json({ message: 'Service created successfully', serviceId: result.insertId, image_path, pdf_brochure_path });
  } catch (error) {
    return handleDbError(error, 'Failed to create service', res);
  }
};

export const updateService = async (req, res) => {
  const { id } = req.params;
  const { title, slug, short_description, detailed_description, features, sort_order, status } = req.body;

  try {
    const [services] = await pool.query('SELECT * FROM services WHERE id = ?', [id]);
    if (services.length === 0) {
      return res.status(404).json({ message: 'Service not found' });
    }

    const current = services[0];
    let image_path = current.image_path;
    let pdf_brochure_path = current.pdf_brochure_path;

    if (req.files && req.files['image']) {
      image_path = await uploadImageToSupabase(req.files['image'][0]);
    } else if (req.body.image_path !== undefined && req.body.image_path !== null && req.body.image_path !== '') {
      image_path = req.body.image_path;
    }

    if (req.files && req.files['brochure']) {
      pdf_brochure_path = await uploadBrochureToSupabase(req.files['brochure'][0]);
    } else if (req.body.pdf_brochure_path !== undefined && req.body.pdf_brochure_path !== null && req.body.pdf_brochure_path !== '') {
      pdf_brochure_path = req.body.pdf_brochure_path;
    }

    console.log('[Update Service Payload]', { id, title, image_path, pdf_brochure_path });

    await pool.query(
      `UPDATE services 
       SET title = ?, slug = ?, short_description = ?, detailed_description = ?, features = ?, image_path = ?, pdf_brochure_path = ?, sort_order = ?, status = ? 
       WHERE id = ?`,
      [title, slug, short_description || null, detailed_description || null, features || null, image_path, pdf_brochure_path, parseInt(sort_order || 0), status || 'Publish', id]
    );

    return res.json({ message: 'Service updated successfully', image_path, pdf_brochure_path });
  } catch (error) {
    return handleDbError(error, 'Failed to update service', res);
  }
};


export const deleteService = async (req, res) => {
  const { id } = req.params;
  try {
    const [result] = await pool.query('DELETE FROM services WHERE id = ?', [id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Service not found' });
    }
    return res.json({ message: 'Service deleted successfully' });
  } catch (error) {
    return handleDbError(error, 'Failed to delete service', res);
  }
};
