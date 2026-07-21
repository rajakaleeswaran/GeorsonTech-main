import pool from '../config/db.js';
import { handleDbError } from '../utils/logger.js';

// Public endpoints
export const getBlogs = async (req, res) => {
  const { category } = req.query;
  let query = `
    SELECT b.id, b.title, b.slug, b.excerpt, b.featured_image, b.created_at, b.status,
           c.name as category_name, u.username as author_name 
    FROM blogs b
    LEFT JOIN blog_categories c ON b.category_id = c.id
    LEFT JOIN users u ON b.author_id = u.id
    WHERE b.status = 'Publish'
  `;
  const params = [];

  if (category) {
    query += ' AND c.name = ?';
    params.push(category);
  }

  query += ' ORDER BY b.created_at DESC';

  try {
    const [blogs] = await pool.query(query, params);
    return res.json(blogs);
  } catch (error) {
    return handleDbError(error, 'Failed to retrieve blogs', res);
  }
};

export const getBlogBySlug = async (req, res) => {
  const { slug } = req.params;
  try {
    const [blogs] = await pool.query(
      `SELECT b.*, c.name as category_name, u.username as author_name 
       FROM blogs b
       LEFT JOIN blog_categories c ON b.category_id = c.id
       LEFT JOIN users u ON b.author_id = u.id
       WHERE b.slug = ? AND b.status = 'Publish'`,
      [slug]
    );

    if (blogs.length === 0) {
      return res.status(404).json({ message: 'Blog post not found' });
    }

    return res.json(blogs[0]);
  } catch (error) {
    return handleDbError(error, 'Failed to retrieve blog post', res);
  }
};

export const getBlogCategories = async (req, res) => {
  try {
    const [categories] = await pool.query(
      `SELECT c.id, c.name, c.slug, COUNT(b.id) as count 
       FROM blog_categories c 
       LEFT JOIN blogs b ON b.category_id = c.id AND b.status = 'Publish'
       GROUP BY c.id`
    );
    return res.json(categories);
  } catch (error) {
    return handleDbError(error, 'Failed to retrieve blog categories', res);
  }
};

// Admin CRUD Endpoints
export const createBlog = async (req, res) => {
  const { category_id, title, slug, excerpt, content, status, seo_title, meta_description, seo_keywords } = req.body;
  const featured_image = req.file ? req.file.path.replace(/\\/g, '/') : null;
  const author_id = req.user?.id || 1;

  if (!title || !slug || !content) {
    return res.status(400).json({ message: 'Title, slug, and content are required' });
  }

  try {
    const [result] = await pool.query(
      `INSERT INTO blogs (category_id, author_id, title, slug, excerpt, content, featured_image, status, seo_title, meta_description, seo_keywords) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [category_id || null, author_id, title, slug, excerpt || null, content, featured_image, status || 'Draft', seo_title || null, meta_description || null, seo_keywords || null]
    );

    return res.status(201).json({ message: 'Blog created successfully', blogId: result.insertId });
  } catch (error) {
    return handleDbError(error, 'Failed to create blog post', res);
  }
};

export const updateBlog = async (req, res) => {
  const { id } = req.params;
  const { category_id, title, slug, excerpt, content, status, seo_title, meta_description, seo_keywords } = req.body;

  try {
    const [blogs] = await pool.query('SELECT * FROM blogs WHERE id = ?', [id]);
    if (blogs.length === 0) {
      return res.status(404).json({ message: 'Blog post not found' });
    }

    const current = blogs[0];
    const featured_image = req.file ? req.file.path.replace(/\\/g, '/') : current.featured_image;

    await pool.query(
      `UPDATE blogs 
       SET category_id = ?, title = ?, slug = ?, excerpt = ?, content = ?, featured_image = ?, status = ?, seo_title = ?, meta_description = ?, seo_keywords = ? 
       WHERE id = ?`,
      [category_id || null, title, slug, excerpt || null, content, featured_image, status || 'Draft', seo_title || null, meta_description || null, seo_keywords || null, id]
    );

    return res.json({ message: 'Blog post updated successfully' });
  } catch (error) {
    return handleDbError(error, 'Failed to update blog post', res);
  }
};

export const deleteBlog = async (req, res) => {
  const { id } = req.params;
  try {
    const [result] = await pool.query('DELETE FROM blogs WHERE id = ?', [id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Blog post not found' });
    }
    return res.json({ message: 'Blog post deleted successfully' });
  } catch (error) {
    return handleDbError(error, 'Failed to delete blog post', res);
  }
};

export const createBlogCategory = async (req, res) => {
  const { name, slug } = req.body;
  if (!name || !slug) {
    return res.status(400).json({ message: 'Name and slug are required' });
  }
  try {
    const [result] = await pool.query('INSERT INTO blog_categories (name, slug) VALUES (?, ?)', [name, slug]);
    return res.status(201).json({ message: 'Blog category created successfully', categoryId: result.insertId });
  } catch (error) {
    return handleDbError(error, 'Failed to create blog category', res);
  }
};

export const updateBlogCategory = async (req, res) => {
  const { id } = req.params;
  const { name, slug } = req.body;
  try {
    const [result] = await pool.query('UPDATE blog_categories SET name = ?, slug = ? WHERE id = ?', [name, slug, id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Blog category not found' });
    }
    return res.json({ message: 'Blog category updated successfully' });
  } catch (error) {
    return handleDbError(error, 'Failed to update blog category', res);
  }
};

export const deleteBlogCategory = async (req, res) => {
  const { id } = req.params;
  try {
    const [blogs] = await pool.query('SELECT id FROM blogs WHERE category_id = ?', [id]);
    if (blogs.length > 0) {
      return res.status(400).json({ message: 'Cannot delete blog category that is currently in use' });
    }

    const [result] = await pool.query('DELETE FROM blog_categories WHERE id = ?', [id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Blog category not found' });
    }
    return res.json({ message: 'Blog category deleted successfully' });
  } catch (error) {
    return handleDbError(error, 'Failed to delete blog category', res);
  }
};
