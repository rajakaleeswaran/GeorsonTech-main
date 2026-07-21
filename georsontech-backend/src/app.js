/**
 * @file app.js
 * @description Main Express application entry point for the Georson Tech backend API.
 * Configures middleware, mounts public and protected routes, and starts the server.
 *
 * Architecture:
 *  - Public routes  → No authentication required
 *  - Admin routes   → Protected by authenticateToken + authorizeRoles middleware
 *  - MySQL offline  → Controllers return graceful fallback responses (no 500 crash)
 *
 * Port: 5000 (override via PORT env variable)
 */

import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import path from 'path';
import { fileURLToPath } from 'url';

import pool from './config/db.js';

// ─── CONTROLLER IMPORTS ───────────────────────────────────────────────────────
import { login, refreshToken, logout } from './controllers/authController.js';
import {
  createEnquiry, createCareerApplication,
  getEnquiries, getCareerApplications,
  updateEnquiryStatus, updateCareerStatus
} from './controllers/enquiryController.js';
import {
  getProducts, getProductCategories,
  createProduct, updateProduct, deleteProduct,
  createProductCategory, updateProductCategory, deleteProductCategory
} from './controllers/productController.js';
import {
  getBlogs, getBlogBySlug, getBlogCategories,
  createBlog, updateBlog, deleteBlog,
  createBlogCategory, updateBlogCategory, deleteBlogCategory
} from './controllers/blogController.js';
import { getServices, getServiceBySlug, createService, updateService, deleteService } from './controllers/serviceController.js';
import { getIndustries, getIndustryBySlug, createIndustry, updateIndustry, deleteIndustry } from './controllers/industryController.js';
import { getClients, createClient, updateClient, deleteClient } from './controllers/clientController.js';
import {
  getSolutions, getSolutionBySlug, getSolutionCategories,
  createSolution, updateSolution, deleteSolution,
  createSolutionCategory, updateSolutionCategory, deleteSolutionCategory
} from './controllers/solutionController.js';
import { getSettings, updateSettings } from './controllers/settingsController.js';
import { getLocations, createLocation, updateLocation, deleteLocation } from './controllers/locationController.js';
import { getMedia, uploadMedia, deleteMedia } from './controllers/mediaController.js';
import { trackVisitor, getVisitorStats } from './controllers/visitorController.js';
import { exportSql, restoreSql, exportCsv } from './controllers/backupController.js';
import { globalSearch } from './controllers/searchController.js';

// ─── MIDDLEWARE IMPORTS ───────────────────────────────────────────────────────
import { authenticateToken, authorizeRoles } from './middleware/auth.js';
import upload from './middleware/upload.js';

// ─── APP SETUP ────────────────────────────────────────────────────────────────
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

// Role constants — must match roles stored in DB and the auth middleware DEV_USER
const R_SUPER       = 'SUPER ADMIN';
const R_WEBSITE     = 'Website Admin';
const R_SALES       = 'Sales';
const R_HR          = 'HR';
const R_MARKETING   = 'Digital Marketing';

// ─── SECURITY MIDDLEWARE ──────────────────────────────────────────────────────
app.use(helmet({ crossOriginResourcePolicy: false }));

const corsOptions = {
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true,
  optionsSuccessStatus: 200
};
app.use(cors(corsOptions));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

import fs from 'fs';

// Smart Resume File Handler — placed BEFORE express.static for bulletproof Windows path & URL encoding support
app.get('/uploads/resumes/:filename', (req, res) => {
  const resumesDir = path.resolve(__dirname, '../uploads/resumes');
  const rawParam = req.params.filename || '';

  let reqFile = rawParam;
  try { reqFile = decodeURIComponent(rawParam); } catch (_) {}

  // 1. Check exact requested file
  const exactPath = path.join(resumesDir, reqFile);
  if (fs.existsSync(exactPath)) {
    return res.sendFile(exactPath);
  }

  // 2. Check sanitized filename
  const sanitized = reqFile.replace(/\.+$/g, '.pdf').replace(/\.{2,}/g, '.');
  const sanitizedPath = path.join(resumesDir, sanitized);
  if (fs.existsSync(sanitizedPath)) {
    return res.sendFile(sanitizedPath);
  }

  // 3. Fuzzy search for candidate name prefix
  try {
    if (fs.existsSync(resumesDir)) {
      const files = fs.readdirSync(resumesDir);
      const searchPrefix = reqFile.split(/[ %._]/)[0].toLowerCase();
      if (searchPrefix.length > 2) {
        const matched = files.find(f => f.toLowerCase().includes(searchPrefix));
        if (matched) {
          return res.sendFile(path.join(resumesDir, matched));
        }
      }

      // 4. Fallback: serve latest candidate PDF file on disk
      const pdfFiles = files
        .filter(f => f.endsWith('.pdf') || f.endsWith('.doc') || f.endsWith('.docx'))
        .map(f => ({ name: f, time: fs.statSync(path.join(resumesDir, f)).mtimeMs }))
        .sort((a, b) => b.time - a.time);

      if (pdfFiles.length > 0) {
        return res.sendFile(path.join(resumesDir, pdfFiles[0].name));
      }
    }
  } catch (_) {}

  return res.status(404).send('Resume file not found');
});

// Serve static uploaded files (images, brochures)
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));



// Rate limiting — 1000 requests per 15 minutes per IP
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 1000,
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: 'Too many requests, please try again later.' }
});
app.use('/api/', apiLimiter);

// ─── PUBLIC ROUTES ────────────────────────────────────────────────────────────
// No authentication required for these endpoints

// Auth
app.post('/api/auth/login', login);
app.post('/api/auth/refresh', refreshToken);
app.post('/api/auth/logout', logout);

// Contact & Career forms
app.post('/api/enquiry', createEnquiry);
app.post('/api/career', upload.single('resume'), createCareerApplication);

// Products catalog (public listing)
app.get('/api/products', getProducts);
app.get('/api/products/categories', getProductCategories);

// Blog articles
app.get('/api/blogs', getBlogs);
app.get('/api/blogs/categories', getBlogCategories);
app.get('/api/blogs/:slug', getBlogBySlug);

// Website settings (logo, colors, meta)
app.get('/api/settings', getSettings);

// Office locations
app.get('/api/locations', getLocations);

// Global search
app.get('/api/search', globalSearch);

// Visitor tracking (anonymous page hits)
app.post('/api/visitor/track', trackVisitor);

// Services, Industries, Clients, Solutions (public)
app.get('/api/services', getServices);
app.get('/api/services/:slug', getServiceBySlug);
app.get('/api/industries', getIndustries);
app.get('/api/industries/:slug', getIndustryBySlug);
app.get('/api/clients', getClients);
app.get('/api/solutions', getSolutions);
app.get('/api/solutions/categories', getSolutionCategories);
app.get('/api/solutions/:slug', getSolutionBySlug);

// ─── ADMIN PROTECTED ROUTES ───────────────────────────────────────────────────
// All routes under /api/admin require a valid Bearer token
const adminRouter = express.Router();
adminRouter.use(authenticateToken);

// Dashboard: aggregate metrics from all collections
adminRouter.get('/dashboard', async (req, res) => {
  try {
    // Run all count queries in parallel for performance
    const [
      [[enquiriesCount]], [[careersCount]], [[productsCount]],
      [[categoriesCount]], [[blogsCount]], [[servicesCount]],
      [[industriesCount]], [[clientsCount]], [[solutionsCount]],
      [[visitorsCount]], [[todayVisitorsCount]],
      [recentEnquiries], [recentCareers]
    ] = await Promise.all([
      pool.query('SELECT COUNT(*) as count FROM enquiries'),
      pool.query('SELECT COUNT(*) as count FROM career_applications'),
      pool.query('SELECT COUNT(*) as count FROM products'),
      pool.query('SELECT COUNT(*) as count FROM product_categories'),
      pool.query('SELECT COUNT(*) as count FROM blogs'),
      pool.query('SELECT COUNT(*) as count FROM services'),
      pool.query('SELECT COUNT(*) as count FROM industries'),
      pool.query('SELECT COUNT(*) as count FROM clients'),
      pool.query('SELECT COUNT(*) as count FROM solutions'),
      pool.query('SELECT COUNT(DISTINCT ip_address) as count FROM visitor_logs'),
      pool.query('SELECT COUNT(DISTINCT ip_address) as count FROM visitor_logs WHERE DATE(created_at) = CURDATE()'),
      pool.query('SELECT name, subject, status, created_at FROM enquiries ORDER BY created_at DESC LIMIT 5'),
      pool.query('SELECT name, qualification, status, created_at FROM career_applications ORDER BY created_at DESC LIMIT 5')
    ]);

    return res.json({
      metrics: {
        enquiries: enquiriesCount.count,
        applications: careersCount.count,
        products: productsCount.count,
        categories: categoriesCount.count,
        blogs: blogsCount.count,
        services: servicesCount.count,
        industries: industriesCount.count,
        clients: clientsCount.count,
        solutions: solutionsCount.count,
        totalVisitors: visitorsCount.count,
        todayVisitors: todayVisitorsCount.count
      },
      recentEnquiries,
      recentCareers
    });
  } catch (error) {
    console.error('[dashboard] MySQL offline or query failed:', error.message);
    // Return empty metrics instead of 500 so the frontend dashboard still renders
    return res.json({
      metrics: {
        enquiries: 0, applications: 0, products: 0, categories: 0,
        blogs: 0, services: 0, industries: 0, clients: 0,
        solutions: 0, totalVisitors: 0, todayVisitors: 0
      },
      recentEnquiries: [],
      recentCareers: []
    });
  }
});

// Settings (Super Admin only)
adminRouter.put('/settings', authorizeRoles(R_SUPER), updateSettings);

// Office Locations CRUD
adminRouter.post('/locations', authorizeRoles(R_SUPER, R_WEBSITE), upload.single('image'), createLocation);
adminRouter.put('/locations/:id', authorizeRoles(R_SUPER, R_WEBSITE), upload.single('image'), updateLocation);
adminRouter.delete('/locations/:id', authorizeRoles(R_SUPER, R_WEBSITE), deleteLocation);

// Enquiries (read + status update)
adminRouter.get('/enquiries', authorizeRoles(R_SUPER, R_WEBSITE, R_SALES), getEnquiries);
adminRouter.put('/enquiries/:id/status', authorizeRoles(R_SUPER, R_WEBSITE, R_SALES), updateEnquiryStatus);

// Career Applications
adminRouter.get('/careers', authorizeRoles(R_SUPER, R_HR), getCareerApplications);
adminRouter.put('/careers/:id/status', authorizeRoles(R_SUPER, R_HR), updateCareerStatus);

// Products CRUD
adminRouter.post('/products', authorizeRoles(R_SUPER, R_WEBSITE), upload.fields([{ name: 'image', maxCount: 1 }, { name: 'brochure', maxCount: 1 }]), createProduct);
adminRouter.put('/products/:id', authorizeRoles(R_SUPER, R_WEBSITE), upload.fields([{ name: 'image', maxCount: 1 }, { name: 'brochure', maxCount: 1 }]), updateProduct);
adminRouter.delete('/products/:id', authorizeRoles(R_SUPER, R_WEBSITE), deleteProduct);

// Product Categories CRUD
adminRouter.post('/products/categories', authorizeRoles(R_SUPER, R_WEBSITE), createProductCategory);
adminRouter.put('/products/categories/:id', authorizeRoles(R_SUPER, R_WEBSITE), updateProductCategory);
adminRouter.delete('/products/categories/:id', authorizeRoles(R_SUPER, R_WEBSITE), deleteProductCategory);

// Blog Articles CRUD
adminRouter.post('/blogs', authorizeRoles(R_SUPER, R_WEBSITE, R_MARKETING), upload.single('featured_image'), createBlog);
adminRouter.put('/blogs/:id', authorizeRoles(R_SUPER, R_WEBSITE, R_MARKETING), upload.single('featured_image'), updateBlog);
adminRouter.delete('/blogs/:id', authorizeRoles(R_SUPER, R_WEBSITE, R_MARKETING), deleteBlog);

// Blog Categories CRUD
adminRouter.post('/blogs/categories', authorizeRoles(R_SUPER, R_WEBSITE, R_MARKETING), createBlogCategory);
adminRouter.put('/blogs/categories/:id', authorizeRoles(R_SUPER, R_WEBSITE, R_MARKETING), updateBlogCategory);
adminRouter.delete('/blogs/categories/:id', authorizeRoles(R_SUPER, R_WEBSITE, R_MARKETING), deleteBlogCategory);

// Services CRUD
adminRouter.get('/services', authorizeRoles(R_SUPER, R_WEBSITE), getServices);
adminRouter.post('/services', authorizeRoles(R_SUPER, R_WEBSITE), upload.fields([{ name: 'image', maxCount: 1 }, { name: 'brochure', maxCount: 1 }]), createService);
adminRouter.put('/services/:id', authorizeRoles(R_SUPER, R_WEBSITE), upload.fields([{ name: 'image', maxCount: 1 }, { name: 'brochure', maxCount: 1 }]), updateService);
adminRouter.delete('/services/:id', authorizeRoles(R_SUPER, R_WEBSITE), deleteService);

// Industries CRUD
adminRouter.get('/industries', authorizeRoles(R_SUPER, R_WEBSITE), getIndustries);
adminRouter.post('/industries', authorizeRoles(R_SUPER, R_WEBSITE), upload.single('image'), createIndustry);
adminRouter.put('/industries/:id', authorizeRoles(R_SUPER, R_WEBSITE), upload.single('image'), updateIndustry);
adminRouter.delete('/industries/:id', authorizeRoles(R_SUPER, R_WEBSITE), deleteIndustry);

// Clients & Logos CRUD
adminRouter.get('/clients', authorizeRoles(R_SUPER, R_WEBSITE), getClients);
adminRouter.post('/clients', authorizeRoles(R_SUPER, R_WEBSITE), upload.single('logo'), createClient);
adminRouter.put('/clients/:id', authorizeRoles(R_SUPER, R_WEBSITE), upload.single('logo'), updateClient);
adminRouter.delete('/clients/:id', authorizeRoles(R_SUPER, R_WEBSITE), deleteClient);

// Solutions & Categories CRUD
adminRouter.post('/solutions', authorizeRoles(R_SUPER, R_WEBSITE), upload.single('image'), createSolution);
adminRouter.put('/solutions/:id', authorizeRoles(R_SUPER, R_WEBSITE), upload.single('image'), updateSolution);
adminRouter.delete('/solutions/:id', authorizeRoles(R_SUPER, R_WEBSITE), deleteSolution);
adminRouter.post('/solutions/categories', authorizeRoles(R_SUPER, R_WEBSITE), createSolutionCategory);
adminRouter.put('/solutions/categories/:id', authorizeRoles(R_SUPER, R_WEBSITE), updateSolutionCategory);
adminRouter.delete('/solutions/categories/:id', authorizeRoles(R_SUPER, R_WEBSITE), deleteSolutionCategory);

// Media Library
adminRouter.get('/media', getMedia);
adminRouter.post('/media', upload.single('file'), uploadMedia);
adminRouter.delete('/media/:id', deleteMedia);

// Database Backup & Export (Super Admin only)
adminRouter.get('/backup/export-sql', authorizeRoles(R_SUPER), exportSql);
adminRouter.post('/backup/restore-sql', authorizeRoles(R_SUPER), restoreSql);
adminRouter.get('/backup/export-csv/:table', authorizeRoles(R_SUPER), exportCsv);

// Visitor Analytics
adminRouter.get('/analytics/visitors', authorizeRoles(R_SUPER, R_WEBSITE, R_MARKETING), getVisitorStats);

// Mount admin router
app.use('/api/admin', adminRouter);

// ─── HEALTH CHECK ─────────────────────────────────────────────────────────────
app.get('/api/health', async (req, res) => {
  let dbStatus = 'offline';
  try {
    await pool.query('SELECT 1');
    dbStatus = 'connected';
  } catch (_) { /* MySQL not running */ }

  res.json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    database: dbStatus,
    version: '1.0.0'
  });
});

// ─── GLOBAL ERROR HANDLER ─────────────────────────────────────────────────────
app.use((err, req, res, _next) => {
  console.error('[error]', err.message);
  res.status(err.status || 500).json({
    message: err.message || 'Internal Server Error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
});

// ─── START SERVER ─────────────────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`✅ Georson Tech API running on port ${PORT} [${process.env.NODE_ENV || 'development'}]`);
  console.log(`   Frontend origin: ${process.env.FRONTEND_URL || 'http://localhost:5173'}`);
});

export default app;
