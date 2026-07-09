import pool from '../config/db.js';

export const trackVisitor = async (req, res) => {
  const { url, country, device, browser, referrer } = req.body;
  const ipAddress = req.ip || req.connection.remoteAddress;

  if (!url) {
    return res.status(400).json({ message: 'URL is required' });
  }

  try {
    await pool.query(
      `INSERT INTO visitor_logs (ip_address, url, country, device, browser, referrer) 
       VALUES (?, ?, ?, ?, ?, ?)`,
      [ipAddress, url, country || 'Unknown', device || 'Desktop', browser || 'Unknown', referrer || null]
    );
    return res.status(201).json({ message: 'Visit tracked successfully' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Failed to record visit log' });
  }
};

export const getVisitorStats = async (req, res) => {
  try {
    // 1. Total visitor counts
    const [[totalVisits]] = await pool.query('SELECT COUNT(*) as count FROM visitor_logs');
    const [[todayVisits]] = await pool.query('SELECT COUNT(*) as count FROM visitor_logs WHERE DATE(created_at) = CURDATE()');

    // 2. Browser breakdown
    const [browsers] = await pool.query('SELECT browser, COUNT(*) as count FROM visitor_logs GROUP BY browser');

    // 3. Device breakdown
    const [devices] = await pool.query('SELECT device, COUNT(*) as count FROM visitor_logs GROUP BY device');

    // 4. Country breakdown
    const [countries] = await pool.query('SELECT country, COUNT(*) as count FROM visitor_logs GROUP BY country');

    // 5. Popular page views
    const [popularPages] = await pool.query('SELECT url, COUNT(*) as count FROM visitor_logs GROUP BY url ORDER BY count DESC LIMIT 10');

    return res.json({
      total: totalVisits.count,
      today: todayVisits.count,
      breakdown: {
        browsers,
        devices,
        countries,
        popularPages
      }
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Failed to build analytics stats' });
  }
};
