import pool from '../config/db.js';

// Custom slugify helper to avoid external dependency
const slugify = (text) => {
  if (!text) return '';
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')           // Replace spaces with -
    .replace(/[^\w-]+/g, '')        // Remove all non-word chars
    .replace(/--+/g, '-');          // Replace multiple - with single -

};

// Resolve file paths backslashes to forward slashes for cross-platform robustness
const normalizePath = (p) => p ? p.replace(/\\/g, '/') : null;

// Helper to update associations in junction tables
async function updateAssociations(connection, solutionId, industryIds, productIds) {
  // Update Industries junction
  await connection.query('DELETE FROM solution_industries WHERE solution_id = ?', [solutionId]);
  if (Array.isArray(industryIds) && industryIds.length > 0) {
    const values = industryIds.map(indId => [solutionId, parseInt(indId)]);
    await connection.query('INSERT INTO solution_industries (solution_id, industry_id) VALUES ?', [values]);
  }

  // Update Products junction
  await connection.query('DELETE FROM solution_products WHERE solution_id = ?', [solutionId]);
  if (Array.isArray(productIds) && productIds.length > 0) {
    const values = productIds.map(prodId => [solutionId, parseInt(prodId)]);
    await connection.query('INSERT INTO solution_products (solution_id, product_id) VALUES ?', [values]);
  }
}

// ─── PUBLIC CONTROLLERS ───

export const getSolutionCategories = async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM solution_categories ORDER BY sort_order ASC, id ASC');
    return res.json(rows);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Failed to retrieve solution categories' });
  }
};

export const getSolutions = async (req, res) => {
  try {
    const { category, industry, search } = req.query;
    let query = `
      SELECT s.*, sc.name as category_name 
      FROM solutions s
      LEFT JOIN solution_categories sc ON s.category_id = sc.id
      WHERE 1=1
    `;
    const params = [];

    if (category) {
      query += ' AND sc.slug = ?';
      params.push(category);
    }

    if (industry) {
      query += ' AND s.id IN (SELECT solution_id FROM solution_industries WHERE industry_id = ?)';
      params.push(parseInt(industry));
    }

    if (search) {
      query += ' AND (s.name LIKE ? OR s.description LIKE ?)';
      params.push(`%${search}%`, `%${search}%`);
    }

    query += ' ORDER BY s.sort_order ASC, s.id ASC';

    const [rows] = await pool.query(query, params);

    // For each solution, fetch associated industry and product IDs
    const solutionsWithAssociations = await Promise.all(rows.map(async (sol) => {
      const [industries] = await pool.query('SELECT industry_id FROM solution_industries WHERE solution_id = ?', [sol.id]);
      const [products] = await pool.query('SELECT product_id FROM solution_products WHERE solution_id = ?', [sol.id]);
      return {
        ...sol,
        industry_ids: industries.map(i => i.industry_id),
        product_ids: products.map(p => p.product_id)
      };
    }));

    return res.json(solutionsWithAssociations);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Failed to retrieve solutions list' });
  }
};

export const getSolutionBySlug = async (req, res) => {
  try {
    const { slug } = req.params;
    const [rows] = await pool.query(`
      SELECT s.*, sc.name as category_name 
      FROM solutions s
      LEFT JOIN solution_categories sc ON s.category_id = sc.id
      WHERE s.slug = ?
    `, [slug]);

    if (rows.length === 0) {
      return res.status(404).json({ message: 'Solution details not found' });
    }

    const sol = rows[0];
    const [industries] = await pool.query(`
      SELECT i.id, i.name, i.slug 
      FROM industries i
      JOIN solution_industries si ON i.id = si.industry_id
      WHERE si.solution_id = ?
    `, [sol.id]);

    const [products] = await pool.query(`
      SELECT p.id, p.name, p.slug, p.image_path
      FROM products p
      JOIN solution_products sp ON p.id = sp.product_id
      WHERE sp.solution_id = ?
    `, [sol.id]);

    return res.json({
      ...sol,
      industries,
      products
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Failed to retrieve solution detail' });
  }
};

// ─── ADMIN CRUD CONTROLLERS ───

export const createSolutionCategory = async (req, res) => {
  try {
    const { name, sort_order } = req.body;
    if (!name) return res.status(400).json({ message: 'Category name is required' });
    const slug = slugify(name);

    await pool.query(
      'INSERT INTO solution_categories (name, slug, sort_order) VALUES (?, ?, ?)',
      [name, slug, sort_order || 0]
    );
    return res.json({ message: 'Solution category created' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Failed to create solution category' });
  }
};

export const updateSolutionCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, sort_order } = req.body;
    if (!name) return res.status(400).json({ message: 'Category name is required' });
    const slug = slugify(name);

    await pool.query(
      'UPDATE solution_categories SET name = ?, slug = ?, sort_order = ? WHERE id = ?',
      [name, slug, sort_order || 0, id]
    );
    return res.json({ message: 'Solution category updated' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Failed to update category' });
  }
};

export const deleteSolutionCategory = async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query('DELETE FROM solution_categories WHERE id = ?', [id]);
    return res.json({ message: 'Solution category deleted' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Failed to delete category' });
  }
};

export const createSolution = async (req, res) => {
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();

    const { category_id, name, slug, description, icon, service_descriptions, sort_order, status, industry_ids, product_ids } = req.body;
    if (!name) return res.status(400).json({ message: 'Solution name is required' });
    
    const finalSlug = slug || slugify(name);
    const image_path = req.file ? normalizePath(req.file.path) : null;

    const [result] = await connection.query(
      `INSERT INTO solutions (category_id, name, slug, description, image_path, icon, service_descriptions, sort_order, status)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [category_id || null, name, finalSlug, description || null, image_path, icon || null, service_descriptions || null, sort_order || 0, status || 'Publish']
    );

    const solutionId = result.insertId;

    // Parse industry and product IDs if received as string
    const parsedIndIds = typeof industry_ids === 'string' ? JSON.parse(industry_ids) : industry_ids;
    const parsedProdIds = typeof product_ids === 'string' ? JSON.parse(product_ids) : product_ids;

    await updateAssociations(connection, solutionId, parsedIndIds, parsedProdIds);

    await connection.commit();
    return res.json({ message: 'Solution successfully created', id: solutionId });
  } catch (error) {
    await connection.rollback();
    console.error(error);
    return res.status(500).json({ message: 'Failed to create solution' });
  } finally {
    connection.release();
  }
};

export const updateSolution = async (req, res) => {
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();
    const { id } = req.params;
    const { category_id, name, slug, description, icon, service_descriptions, sort_order, status, industry_ids, product_ids } = req.body;

    if (!name) return res.status(400).json({ message: 'Solution name is required' });
    const finalSlug = slug || slugify(name);

    let updateQuery = `
      UPDATE solutions 
      SET category_id = ?, name = ?, slug = ?, description = ?, icon = ?, service_descriptions = ?, sort_order = ?, status = ?
    `;
    const params = [category_id || null, name, finalSlug, description || null, icon || null, service_descriptions || null, sort_order || 0, status || 'Publish'];

    if (req.file) {
      updateQuery += ', image_path = ?';
      params.push(normalizePath(req.file.path));
    }

    updateQuery += ' WHERE id = ?';
    params.push(id);

    await connection.query(updateQuery, params);

    const parsedIndIds = typeof industry_ids === 'string' ? JSON.parse(industry_ids) : industry_ids;
    const parsedProdIds = typeof product_ids === 'string' ? JSON.parse(product_ids) : product_ids;

    await updateAssociations(connection, id, parsedIndIds, parsedProdIds);

    await connection.commit();
    return res.json({ message: 'Solution successfully updated' });
  } catch (error) {
    await connection.rollback();
    console.error(error);
    return res.status(500).json({ message: 'Failed to update solution' });
  } finally {
    connection.release();
  }
};

export const deleteSolution = async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query('DELETE FROM solutions WHERE id = ?', [id]);
    return res.json({ message: 'Solution deleted successfully' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Failed to delete solution' });
  }
};
