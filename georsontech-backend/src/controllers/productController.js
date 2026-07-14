import pool from '../config/db.js';

// Public endpoints
export const getProducts = async (req, res) => {
  const { category, search } = req.query;
  let query = `
    SELECT p.*, c.name as category_name 
    FROM products p 
    LEFT JOIN product_categories c ON p.category_id = c.id
    WHERE 1=1
  `;
  const params = [];

  if (category && category !== 'All') {
    query += ' AND c.name = ?';
    params.push(category);
  }

  if (search) {
    query += ' AND (p.name LIKE ? OR p.description LIKE ?)';
    const term = `%${search}%`;
    params.push(term, term);
  }

  query += ' ORDER BY p.created_at DESC';

  try {
    const [products] = await pool.query(query, params);
    return res.json(products);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Failed to retrieve products' });
  }
};

export const getProductCategories = async (req, res) => {
  try {
    const [categories] = await pool.query('SELECT * FROM product_categories ORDER BY name ASC');
    return res.json(categories);
  } catch (error) {
    return res.status(500).json({ message: 'Failed to retrieve product categories' });
  }
};

// Admin CRUD endpoints
export const createProduct = async (req, res) => {
  const { category_id, name, slug, description, specifications, video_url, is_featured } = req.body;
  const image_path = req.files && req.files['image'] ? req.files['image'][0].path : null;
  const pdf_brochure_path = req.files && req.files['brochure'] ? req.files['brochure'][0].path : null;

  if (!name || !slug) {
    return res.status(400).json({ message: 'Name and slug are required' });
  }

  try {
    const [result] = await pool.query(
      `INSERT INTO products (category_id, name, slug, description, specifications, image_path, pdf_brochure_path, video_url, is_featured) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [category_id || null, name, slug, description, specifications || null, image_path, pdf_brochure_path, video_url || null, is_featured === 'true' || is_featured === true]
    );

    return res.status(201).json({ message: 'Product created successfully', productId: result.insertId });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Failed to create product' });
  }
};

export const updateProduct = async (req, res) => {
  const { id } = req.params;
  const { category_id, name, slug, description, specifications, video_url, is_featured } = req.body;

  try {
    const [products] = await pool.query('SELECT * FROM products WHERE id = ?', [id]);
    if (products.length === 0) {
      return res.status(404).json({ message: 'Product not found' });
    }

    const current = products[0];
    const image_path = req.files && req.files['image'] ? req.files['image'][0].path : current.image_path;
    const pdf_brochure_path = req.files && req.files['brochure'] ? req.files['brochure'][0].path : current.pdf_brochure_path;

    await pool.query(
      `UPDATE products 
       SET category_id = ?, name = ?, slug = ?, description = ?, specifications = ?, image_path = ?, pdf_brochure_path = ?, video_url = ?, is_featured = ? 
       WHERE id = ?`,
      [category_id || null, name, slug, description, specifications || null, image_path, pdf_brochure_path, video_url || null, is_featured === 'true' || is_featured === true, id]
    );

    return res.json({ message: 'Product updated successfully' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Failed to update product' });
  }
};

export const deleteProduct = async (req, res) => {
  const { id } = req.params;
  try {
    const [result] = await pool.query('DELETE FROM products WHERE id = ?', [id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Product not found' });
    }
    return res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    return res.status(500).json({ message: 'Failed to delete product' });
  }
};

export const createProductCategory = async (req, res) => {
  const { name, slug } = req.body;
  if (!name || !slug) {
    return res.status(400).json({ message: 'Name and slug are required' });
  }
  try {
    const [result] = await pool.query('INSERT INTO product_categories (name, slug) VALUES (?, ?)', [name, slug]);
    return res.status(201).json({ message: 'Product category created successfully', categoryId: result.insertId });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Failed to create product category' });
  }
};

export const updateProductCategory = async (req, res) => {
  const { id } = req.params;
  const { name, slug } = req.body;
  try {
    const [result] = await pool.query('UPDATE product_categories SET name = ?, slug = ? WHERE id = ?', [name, slug, id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Product category not found' });
    }
    return res.json({ message: 'Product category updated successfully' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Failed to update product category' });
  }
};

export const deleteProductCategory = async (req, res) => {
  const { id } = req.params;
  try {
    // Check if category is used
    const [products] = await pool.query('SELECT id FROM products WHERE category_id = ?', [id]);
    if (products.length > 0) {
      return res.status(400).json({ message: 'Cannot delete product category that is currently in use' });
    }

    const [result] = await pool.query('DELETE FROM product_categories WHERE id = ?', [id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Product category not found' });
    }
    return res.json({ message: 'Product category deleted successfully' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Failed to delete product category' });
  }
};
