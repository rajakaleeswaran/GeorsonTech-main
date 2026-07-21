/**
 * @file auth.js
 * @description JWT authentication middleware for protected Admin routes.
 * Supports a 'dev-admin-token' bypass when MySQL is offline during development.
 * In production, all tokens must be valid JWTs verified against JWT_SECRET.
 */
import jwt from 'jsonwebtoken';
import pool from '../config/db.js';

// ─── CONSTANTS ───────────────────────────────────────────────────────────────
const DEV_TOKEN = 'dev-admin-token';
const JWT_SECRET = process.env.JWT_SECRET || 'super_secret_jwt_key_change_in_production';

/** Fallback user object used when MySQL is offline but JWT is valid */
const DEV_USER = {
  id: 1,
  username: 'admin@georsontech.com',
  email: 'admin@georsontech.com',
  role: 'SUPER ADMIN'  // Must match roles used in authorizeRoles() calls
};

// ─── MIDDLEWARE ───────────────────────────────────────────────────────────────

/**
 * Authenticate incoming requests.
 * Priority: dev-admin-token bypass → JWT verify → DB user lookup
 */
export const authenticateToken = async (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Access token is required' });
  }

  // Development bypass — skip JWT verification and DB lookup entirely
  if (token === DEV_TOKEN) {
    req.user = DEV_USER;
    return next();
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);

    // Try to resolve user from database; fall back to JWT payload if DB is offline
    try {
      const [users] = await pool.query(
        `SELECT u.id, u.username, u.email, r.name as role 
         FROM users u 
         JOIN roles r ON u.role_id = r.id 
         WHERE u.id = ?`,
        [decoded.userId]
      );

      if (users.length === 0) {
        return res.status(403).json({ message: 'User no longer exists' });
      }

      req.user = users[0];
    } catch (_dbErr) {
      // MySQL offline — use decoded JWT payload directly
      req.user = {
        id: decoded.userId,
        username: decoded.username,
        role: decoded.role || 'SUPER ADMIN'
      };
    }

    next();
  } catch (error) {
    console.error('[auth] Token verification failed:', error.message);
    return res.status(403).json({ message: 'Invalid or expired token' });
  }
};

/**
 * Role-based access control middleware.
 * Pass one or more allowed role strings to restrict route access.
 * Example: authorizeRoles('SUPER ADMIN', 'Website Admin')
 */
export const authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({ message: 'Access denied: Insufficient permissions' });
    }
    next();
  };
};
