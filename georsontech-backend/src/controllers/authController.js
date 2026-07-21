import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import pool from '../config/db.js';
import { handleDbError } from '../utils/logger.js';

// Dev fallback credentials when MySQL is offline
const DEV_CREDENTIALS = [
  { email: 'admin@georsontech.com', password: 'admin123', role: 'SUPER ADMIN', id: 1 },
  { email: 'georsontech@gmail.com', password: 'admin123', role: 'SUPER ADMIN', id: 1 },
];
const DEV_TOKEN = 'dev-admin-token';

export const login = async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: 'Username and password are required' });
  }

  // Try MySQL first
  try {
    const [users] = await pool.query(
      `SELECT u.id, u.username, u.password, r.name as role 
       FROM users u 
       JOIN roles r ON u.role_id = r.id 
       WHERE u.username = ? OR u.email = ?`, 
      [username, username]
    );

    if (users.length > 0) {
      const user = users[0];
      const isMatch = await bcrypt.compare(password, user.password);

      if (!isMatch) {
        return res.status(401).json({ message: 'Invalid username or password' });
      }

      const accessToken = jwt.sign(
        { userId: user.id, username: user.username, role: user.role },
        process.env.JWT_SECRET || 'super_secret_jwt_key_change_in_production',
        { expiresIn: process.env.JWT_EXPIRES_IN || '24h' }
      );

      return res.json({
        accessToken,
        user: { id: user.id, username: user.username, role: user.role }
      });
    }
  } catch (dbErr) {
    handleDbError(dbErr, 'MySQL login attempt', null);
  }

  // Fallback: dev credentials when MySQL is down
  const devUser = DEV_CREDENTIALS.find(u =>
    (u.email === username || u.email === username) && u.password === password
  );

  if (devUser) {
    return res.json({
      accessToken: DEV_TOKEN,
      user: { id: devUser.id, username: devUser.email, role: devUser.role }
    });
  }

  return res.status(401).json({ message: 'Invalid username or password' });
};

export const refreshToken = async (req, res) => {
  const { token } = req.body;
  if (!token) return res.status(400).json({ message: 'Refresh token is required' });

  if (token === DEV_TOKEN) {
    return res.json({ accessToken: DEV_TOKEN });
  }

  try {
    const [tokens] = await pool.query('SELECT * FROM user_refresh_tokens WHERE token = ? AND expires_at > NOW()', [token]);
    if (tokens.length === 0) return res.status(403).json({ message: 'Invalid or expired refresh token' });

    const decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET || 'super_secret_refresh_key_change_in_production');
    const [users] = await pool.query(
      `SELECT u.id, u.username, r.name as role FROM users u JOIN roles r ON u.role_id = r.id WHERE u.id = ?`,
      [decoded.userId]
    );

    if (users.length === 0) return res.status(403).json({ message: 'User no longer exists' });

    const user = users[0];
    const newAccessToken = jwt.sign(
      { userId: user.id, username: user.username, role: user.role },
      process.env.JWT_SECRET || 'super_secret_jwt_key_change_in_production',
      { expiresIn: '24h' }
    );

    return res.json({ accessToken: newAccessToken });
  } catch (error) {
    return res.status(403).json({ message: 'Invalid refresh token' });
  }
};

export const logout = async (req, res) => {
  const { token } = req.body;
  if (!token || token === DEV_TOKEN) return res.json({ message: 'Logged out successfully' });

  try {
    await pool.query('DELETE FROM user_refresh_tokens WHERE token = ?', [token]);
    return res.json({ message: 'Logged out successfully' });
  } catch (error) {
    return res.json({ message: 'Logged out' });
  }
};
