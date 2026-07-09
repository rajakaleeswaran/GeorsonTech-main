import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import path from 'path';
import { fileURLToPath } from 'url';

import pool from './config/db.js';

// Route controller imports
import { login, refreshToken, logout } from './controllers/authController.js';
import { createEnquiry, createCareerApplication, getEnquiries, getCareerApplications, updateEnquiryStatus, updateCareerStatus } from './controllers/enquiryController.js';
import { getProducts, getProductCategories, createProduct, updateProduct, deleteProduct } from './controllers/productController.js';
import { getBlogs, getBlogBySlug, getBlogCategories, createBlog, updateBlog, deleteBlog } from './controllers/blogController.js';
import { getSettings, updateSettings } from './controllers/settingsController.js';
import { getLocations, createLocation, updateLocation, deleteLocation } from './controllers/locationController.js';
import { getMedia, uploadMedia, deleteMedia } from './controllers/mediaController.js';
import { trackVisitor, getVisitorStats } from './controllers/visitorController.js';
import { exportSql, restoreSql, exportCsv } from './controllers/backupController.js';
import { globalSearch } from './controllers/searchController.js';

// Middleware imports
import { authenticateToken, authorizeRoles } from './middleware/auth.js';
import upload from './middleware/upload.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

// Security and utility Middlewares
app.use(helmet({
  crossOriginResourcePolicy: false // Allow serving files globally
}));

const corsOptions = {
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true,
  optionsSuccessStatus: 200
};
app.use(cors(corsOptions));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Serve Uploaded Files
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Rate Limiter
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 1000, // Upgraded max requests for dynamic site interaction
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: 'Too many requests, please try again later.' }
});
app.use('/api/', apiLimiter);

// ─── PUBLIC ROUTES ───

// 1. Auth routes
app.post('/api/auth/login', login);
app.post('/api/auth/refresh', refreshToken);
app.post('/api/auth/logout', logout);

// 2. Public enquiries & career application
app.post('/api/enquiry', createEnquiry);
app.post('/api/career', upload.single('resume'), createCareerApplication);

// 3. Catalog Products
app.get('/api/products', getProducts);
app.get('/api/products/categories', getProductCategories);

// 4. Blog articles
app.get('/api/blogs', getBlogs);
app.get('/api/blogs/categories', getBlogCategories);
app.get('/api/blogs/:slug', getBlogBySlug);

// 5. Website Settings (public logo, colors, meta parameters)
app.get('/api/settings', getSettings);

// 6. Dynamic Office Locations
app.get('/api/locations', getLocations);

// 7. Global Search
app.get('/api/search', globalSearch);

// 8. Visitor Logs
app.post('/api/visitor/track', trackVisitor);


// ─── ADMIN PROTECTED ROUTES ───
const adminRouter = express.Router();
adminRouter.use(authenticateToken);

// Admin dashboard analytical metrics (includes counts, recent list entries)
adminRouter.get('/dashboard', async (req, res) => {
  try {
    const [[enquiriesCount]] = await pool.query('SELECT COUNT(*) as count FROM enquiries');
    const [[careersCount]] = await pool.query('SELECT COUNT(*) as count FROM career_applications');
    const [[productsCount]] = await pool.query('SELECT COUNT(*) as count FROM products');
    const [[blogsCount]] = await pool.query('SELECT COUNT(*) as count FROM blogs');
    const [[visitorsCount]] = await pool.query('SELECT COUNT(DISTINCT ip_address) as count FROM visitor_logs');
    const [[todayVisitorsCount]] = await pool.query('SELECT COUNT(DISTINCT ip_address) as count FROM visitor_logs WHERE DATE(created_at) = CURDATE()');
    
    // Recent activities (5 items)
    const [recentEnquiries] = await pool.query('SELECT name, subject, status, created_at FROM enquiries ORDER BY created_at DESC LIMIT 5');
    const [recentCareers] = await pool.query('SELECT name, qualification, status, created_at FROM career_applications ORDER BY created_at DESC LIMIT 5');
    
    return res.json({
      metrics: {
        enquiries: enquiriesCount.count,
        applications: careersCount.count,
        products: productsCount.count,
        blogs: blogsCount.count,
        totalVisitors: visitorsCount.count,
        todayVisitors: todayVisitorsCount.count
      },
      recentEnquiries,
      recentCareers
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Failed to build analytics dashboard metrics' });
  }
});

// Admin Settings updates (Super Admin only)
adminRouter.put('/settings', authorizeRoles('Super Admin'), updateSettings);

// Admin Locations CRUD
adminRouter.post('/locations', authorizeRoles('Super Admin', 'Website Admin'), upload.single('image'), createLocation);
adminRouter.put('/locations/:id', authorizeRoles('Super Admin', 'Website Admin'), upload.single('image'), updateLocation);
adminRouter.delete('/locations/:id', authorizeRoles('Super Admin', 'Website Admin'), deleteLocation);

// Admin listings and status update for forms
adminRouter.get('/enquiries', authorizeRoles('Super Admin', 'Website Admin', 'Sales'), getEnquiries);
adminRouter.put('/enquiries/:id/status', authorizeRoles('Super Admin', 'Website Admin', 'Sales'), updateEnquiryStatus);

adminRouter.get('/careers', authorizeRoles('Super Admin', 'HR'), getCareerApplications);
adminRouter.put('/careers/:id/status', authorizeRoles('Super Admin', 'HR'), updateCareerStatus);

// Admin CRUD Products
adminRouter.post('/products', authorizeRoles('Super Admin', 'Website Admin'), upload.fields([{ name: 'image', maxCount: 1 }, { name: 'brochure', maxCount: 1 }]), createProduct);
adminRouter.put('/products/:id', authorizeRoles('Super Admin', 'Website Admin'), upload.fields([{ name: 'image', maxCount: 1 }, { name: 'brochure', maxCount: 1 }]), updateProduct);
adminRouter.delete('/products/:id', authorizeRoles('Super Admin', 'Website Admin'), deleteProduct);

// Admin CRUD Blog articles
adminRouter.post('/blogs', authorizeRoles('Super Admin', 'Website Admin', 'Digital Marketing'), upload.single('featured_image'), createBlog);
adminRouter.put('/blogs/:id', authorizeRoles('Super Admin', 'Website Admin', 'Digital Marketing'), upload.single('featured_image'), updateBlog);
adminRouter.delete('/blogs/:id', authorizeRoles('Super Admin', 'Website Admin', 'Digital Marketing'), deleteBlog);

// Admin Media Library
adminRouter.get('/media', getMedia);
adminRouter.post('/media', upload.single('file'), uploadMedia);
adminRouter.delete('/media/:id', deleteMedia);

// Admin Database Backup controls (Super Admin only)
adminRouter.get('/backup/export-sql', authorizeRoles('Super Admin'), exportSql);
adminRouter.post('/backup/restore-sql', authorizeRoles('Super Admin'), restoreSql);
adminRouter.get('/backup/export-csv/:table', authorizeRoles('Super Admin'), exportCsv);

// Custom self-hosted visitor analytics reports
adminRouter.get('/analytics/visitors', authorizeRoles('Super Admin', 'Website Admin', 'Digital Marketing'), getVisitorStats);

app.use('/api/admin', adminRouter);

// Health Check Endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date() });
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    message: err.message || 'Internal Server Error',
    error: process.env.NODE_ENV === 'development' ? err.stack : {}
  });
});

app.listen(PORT, () => {
  console.log(`Server is running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
});
export default app;
