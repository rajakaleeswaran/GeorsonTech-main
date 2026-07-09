import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import pool from '../config/db.js';
import { logLogin } from '../utils/logger.js';

export const login = async (req, res) => {
  const { username, password } = req.body;
  const ipAddress = req.ip || req.connection.remoteAddress;
  const userAgent = req.headers['user-agent'] || '';

  if (!username || !password) {
    return res.status(400).json({ message: 'Username and password are required' });
  }

  try {
    const [users] = await pool.query(
      `SELECT u.id, u.username, u.password, r.name as role 
       FROM users u 
       JOIN roles r ON u.role_id = r.id 
       WHERE u.username = ?`, 
      [username]
    );

    if (users.length === 0) {
      await logLogin(null, username, 'Failed - Username not found', ipAddress, userAgent);
      return res.status(401).json({ message: 'Invalid username or password' });
    }

    const user = users[0];
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      await logLogin(user.id, username, 'Failed - Password mismatch', ipAddress, userAgent);
      return res.status(401).json({ message: 'Invalid username or password' });
    }

    // Record login success
    await logLogin(user.id, username, 'Success', ipAddress, userAgent);

    // Generate tokens
    const accessToken = jwt.sign(
      { userId: user.id, username: user.username, role: user.role },
      process.env.JWT_SECRET || 'super_secret_jwt_key_change_in_production',
      { expiresIn: process.env.JWT_EXPIRES_IN || '1h' }
    );

    const refreshToken = jwt.sign(
      { userId: user.id },
      process.env.JWT_REFRESH_SECRET || 'super_secret_refresh_key_change_in_production',
      { expiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d' }
    );

    // Save refresh token to database
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);
    await pool.query(
      'INSERT INTO user_refresh_tokens (user_id, token, expires_at) VALUES (?, ?, ?)',
      [user.id, refreshToken, expiresAt]
    );

    return res.json({
      accessToken,
      refreshToken,
      user: {
        id: user.id,
        username: user.username,
        role: user.role
      }
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Server error during login' });
  }
};

export const refreshToken = async (req, res) => {
  const { token } = req.body;

  if (!token) {
    return res.status(400).json({ message: 'Refresh token is required' });
  }

  try {
    // Check if token exists and is valid in database
    const [tokens] = await pool.query('SELECT * FROM user_refresh_tokens WHERE token = ? AND expires_at > NOW()', [token]);
    if (tokens.length === 0) {
      return res.status(403).json({ message: 'Invalid or expired refresh token' });
    }

    const decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET || 'super_secret_refresh_key_change_in_production');
    
    // Fetch user details
    const [users] = await pool.query(
      `SELECT u.id, u.username, r.name as role 
       FROM users u 
       JOIN roles r ON u.role_id = r.id 
       WHERE u.id = ?`, 
      [decoded.userId]
    );

    if (users.length === 0) {
      return res.status(403).json({ message: 'User no longer exists' });
    }

    const user = users[0];

    // Generate new access token
    const newAccessToken = jwt.sign(
      { userId: user.id, username: user.username, role: user.role },
      process.env.JWT_SECRET || 'super_secret_jwt_key_change_in_production',
      { expiresIn: process.env.JWT_EXPIRES_IN || '1h' }
    );

    return res.json({ accessToken: newAccessToken });
  } catch (error) {
    return res.status(403).json({ message: 'Invalid refresh token' });
  }
};

export const logout = async (req, res) => {
  const { token } = req.body;
  if (!token) {
    return res.status(400).json({ message: 'Token is required' });
  }
  try {
    await pool.query('DELETE FROM user_refresh_tokens WHERE token = ?', [token]);
    return res.json({ message: 'Logged out successfully' });
  } catch (error) {
    return res.status(500).json({ message: 'Server error during logout' });
  }
};
