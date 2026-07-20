import pool from '../config/db.js';
import { logAudit } from '../utils/logger.js';

async function resolveGoogleMapLink(link) {
  if (!link) return link;
  
  // 1. If it's an iframe tag, extract the src attribute
  if (link.includes('<iframe')) {
    const srcMatch = link.match(/src=["']([^"']+)["']/);
    if (srcMatch) return srcMatch[1];
  }

  // 2. Already an embed URL?
  if (link.includes('/maps/embed') || link.includes('output=embed')) {
    return link;
  }

  let targetUrl = link.trim();

  // 3. Resolve short URLs
  if (targetUrl.includes('maps.app.goo.gl') || targetUrl.includes('goo.gl/maps')) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 3000); // 3-second timeout

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
      console.error('Failed to resolve short Google Map link:', err);
    }
  }

  // 4. Try to extract exact pin coordinates: !3dLat!4dLng (highest precision)
  const pinCoordsMatch = targetUrl.match(/!3d(-?\d+\.\d+)!4d(-?\d+\.\d+)/);
  if (pinCoordsMatch) {
    return `https://maps.google.com/maps?q=${pinCoordsMatch[1]},${pinCoordsMatch[2]}&z=15&output=embed`;
  }

  // 5. Try to extract viewport center coordinates: @Lat,Lng
  const viewportCoordsMatch = targetUrl.match(/@(-?\d+\.\d+),(-?\d+\.\d+)/);
  if (viewportCoordsMatch) {
    return `https://maps.google.com/maps?q=${viewportCoordsMatch[1]},${viewportCoordsMatch[2]}&z=15&output=embed`;
  }

  // 6. Convert standard Google Maps place search to embed URL
  const placeMatch = targetUrl.match(/\/maps\/place\/([^/]+)/);
  if (placeMatch) {
    const placeName = decodeURIComponent(placeMatch[1].replace(/\+/g, ' '));
    return `https://maps.google.com/maps?q=${encodeURIComponent(placeName)}&z=15&output=embed`;
  }

  // Fallback
  return `https://maps.google.com/maps?q=${encodeURIComponent(targetUrl)}&output=embed`;
}

export const getLocations = async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM office_locations ORDER BY id ASC');
    return res.json(rows);
  } catch (error) {
    return res.status(500).json({ message: 'Failed to fetch office locations' });
  }
};

export const createLocation = async (req, res) => {
  const { office_name, office_type, address, phone, email, google_map_link, latitude, longitude } = req.body;
  const image = req.file ? req.file.path.replace(/\\/g, '/') : null;
  const ipAddress = req.ip || req.connection.remoteAddress;

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

    await logAudit(req.user?.id, 'CREATE_LOCATION', 'office_locations', { id: result.insertId, office_name }, ipAddress);

    return res.status(201).json({ message: 'Location created successfully', locationId: result.insertId });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Failed to save location' });
  }
};

export const updateLocation = async (req, res) => {
  const { id } = req.params;
  const { office_name, office_type, address, phone, email, google_map_link, latitude, longitude } = req.body;
  const ipAddress = req.ip || req.connection.remoteAddress;

  try {
    const [rows] = await pool.query('SELECT * FROM office_locations WHERE id = ?', [id]);
    if (rows.length === 0) {
      return res.status(404).json({ message: 'Location not found' });
    }

    const current = rows[0];
    const image = req.file ? req.file.path.replace(/\\/g, '/') : current.image;

    const resolvedLink = await resolveGoogleMapLink(google_map_link);

    await pool.query(
      `UPDATE office_locations 
       SET office_name = ?, office_type = ?, address = ?, phone = ?, email = ?, google_map_link = ?, latitude = ?, longitude = ?, image = ? 
       WHERE id = ?`,
      [office_name, office_type, address, phone || null, email || null, resolvedLink || null, latitude || null, longitude || null, image, id]
    );

    await logAudit(req.user?.id, 'UPDATE_LOCATION', 'office_locations', { id, office_name }, ipAddress);

    return res.json({ message: 'Location updated successfully' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Failed to update location' });
  }
};

export const deleteLocation = async (req, res) => {
  const { id } = req.params;
  const ipAddress = req.ip || req.connection.remoteAddress;

  try {
    const [result] = await pool.query('DELETE FROM office_locations WHERE id = ?', [id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Location not found' });
    }

    await logAudit(req.user?.id, 'DELETE_LOCATION', 'office_locations', { id }, ipAddress);

    return res.json({ message: 'Location deleted successfully' });
  } catch (error) {
    return res.status(500).json({ message: 'Failed to delete location' });
  }
};
