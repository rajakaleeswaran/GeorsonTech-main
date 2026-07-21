import pool from '../config/db.js';
import { handleDbError } from '../utils/logger.js';

export const globalSearch = async (req, res) => {
  const { query } = req.query;

  if (!query || query.trim().length === 0) {
    return res.status(400).json({ message: 'Search query is required' });
  }

  const term = `%${query.trim()}%`;

  try {
    // 1. Search Products
    const [products] = await pool.query(
      `SELECT id, name, slug, description, image_path, 'product' as type 
       FROM products 
       WHERE name LIKE ? OR description LIKE ? LIMIT 5`,
      [term, term]
    );

    // 2. Search Blogs
    const [blogs] = await pool.query(
      `SELECT id, title as name, slug, excerpt as description, featured_image as image_path, 'blog' as type 
       FROM blogs 
       WHERE (title LIKE ? OR content LIKE ? OR excerpt LIKE ?) AND status = 'Publish' LIMIT 5`,
      [term, term, term]
    );

    // 3. Search Clients
    const [clients] = await pool.query(
      `SELECT id, name, logo_path as image_path, '' as slug, '' as description, 'client' as type 
       FROM clients 
       WHERE name LIKE ? LIMIT 5`,
      [term]
    );

    // 4. Search Services
    const [services] = await pool.query(
      `SELECT id, title as name, slug, description, image_path, 'service' as type 
       FROM services 
       WHERE title LIKE ? OR description LIKE ? LIMIT 5`,
      [term, term]
    );

    return res.json({
      query: query.trim(),
      results: [
        ...products,
        ...blogs,
        ...clients,
        ...services
      ]
    });
  } catch (error) {
    return handleDbError(error, 'Global search operation failed', res);
  }
};
