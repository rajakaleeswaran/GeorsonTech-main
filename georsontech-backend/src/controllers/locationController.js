import pool from '../config/db.js';
import { handleDbError } from '../utils/logger.js';

async function resolveGoogleMapLink(link) {
  if (!link) return link;
  
  if (link.includes('<iframe')) {
    const srcMatch = link.match(/src=["']([^"']+)["']/);
    if (srcMatch) return srcMatch[1];
  }

  if (link.includes('/maps/embed') || link.includes('output=embed')) {
    return link;
  }

  let targetUrl = link.trim();

  if (targetUrl.includes('maps.app.goo.gl') || targetUrl.includes('goo.gl/maps')) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 3000);

      const res = await fetch(targetUrl, { 
        method: 'HEAD', 
        redirect: 'manual',
        signal: controller.signal
      });
      clearTimeout(timeoutId);

      if (res.status >= 300 && res.status < 400) {
        const redirectUrl = res.headers.get('location');
        if (redirectUrl) {
          targetUrl = redirectUrl;
        }
      }
    } catch (err) {
      console.warn('Failed to resolve short Google Map link:', err.message);
    }
  }

  const pinCoordsMatch = targetUrl.match(/!3d(-?\d+\.\d+)!4d(-?\d+\.\d+)/);
  if (pinCoordsMatch) {
    return `https://maps.google.com/maps?q=${pinCoordsMatch[1]},${pinCoordsMatch[2]}&z=15&output=embed`;
  }

  const viewportCoordsMatch = targetUrl.match(/@(-?\d+\.\d+),(-?\d+\.\d+)/);
  if (viewportCoordsMatch) {
    return `https://maps.google.com/maps?q=${viewportCoordsMatch[1]},${viewportCoordsMatch[2]}&z=15&output=embed`;
  }

  const placeMatch = targetUrl.match(/\/maps\/place\/([^/]+)/);
  if (placeMatch) {
    const placeName = decodeURIComponent(placeMatch[1].replace(/\+/g, ' '));
    return `https://maps.google.com/maps?q=${encodeURIComponent(placeName)}&z=15&output=embed`;
  }

  return `https://maps.google.com/maps?q=${encodeURIComponent(targetUrl)}&output=embed`;
}

export const getLocations = async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM office_locations ORDER BY id ASC');
    return res.json(rows);
  } catch (error) {
    return handleDbError(error, 'Failed to fetch office locations', res);
  }
};

export const createLocation = async (req, res) => {
  const { office_name, office_type, address, phone, email, google_map_link, latitude, longitude } = req.body;
  const image = req.file ? req.file.path.replace(/\\/g, '/') : null;

  if (!office_name || !office_type || !address) {
    return res.status(400).json({ message: 'Office name, type, and address are required' });
  }

  try {
    const resolvedLink = await resolveGoogleMapLink(google_map_link);

    const [result] = await pool.query(
      `INSERT INTO office_locations (office_name, office_type, address, phone, email, google_map_link, latitude, longitude, image) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [office_name, office_type, address, phone || null, email || null, resolvedLink || null, latitude || null, longitude || null, image]
    );

    return res.status(201).json({ message: 'Location created successfully', locationId: result.insertId });
  } catch (error) {
    return handleDbError(error, 'Failed to save location', res);
  }
};

export const updateLocation = async (req, res) => {
  const { id } = req.params;
  const { office_name, office_type, address, phone, email, google_map_link, latitude, longitude } = req.body;

  try {
    const [rows] = await pool.query('SELECT * FROM office_locations WHERE id = ?', [id]);
    if (rows.length === 0) {
      return res.status(404).json({ message: 'Office location not found' });
    }

    const current = rows[0];
    const image = req.file ? req.file.path.replace(/\\/g, '/') : current.image;
    const resolvedLink = google_map_link ? await resolveGoogleMapLink(google_map_link) : current.google_map_link;

    await pool.query(
      `UPDATE office_locations 
       SET office_name = ?, office_type = ?, address = ?, phone = ?, email = ?, google_map_link = ?, latitude = ?, longitude = ?, image = ? 
       WHERE id = ?`,
      [office_name || current.office_name, office_type || current.office_type, address || current.address, phone || current.phone, email || current.email, resolvedLink, latitude || current.latitude, longitude || current.longitude, image, id]
    );

    return res.json({ message: 'Location updated successfully' });
  } catch (error) {
    return handleDbError(error, 'Failed to update location', res);
  }
};

export const deleteLocation = async (req, res) => {
  const { id } = req.params;
  try {
    const [result] = await pool.query('DELETE FROM office_locations WHERE id = ?', [id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Office location not found' });
    }
    return res.json({ message: 'Location deleted successfully' });
  } catch (error) {
    return handleDbError(error, 'Failed to delete location', res);
  }
};
