-- ============================================================
-- GEORSON TECH PVT LTD - DATABASE SCHEMA (UPGRADED V2)
-- Target Database: MySQL 8.0
-- ============================================================

CREATE DATABASE IF NOT EXISTS georsontech_db;
USE georsontech_db;

-- 1. Roles
CREATE TABLE IF NOT EXISTS roles (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(50) NOT NULL UNIQUE,
  description VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Seed basic roles
INSERT INTO roles (name, description) VALUES 
('Super Admin', 'Full system access, settings, and backups'),
('Website Admin', 'Manage pages, services, products, and locations'),
('Digital Marketing', 'Access to blogs, media library, and SEO defaults'),
('HR', 'Manage career applications and resumes'),
('Sales', 'Access to enquiries and customer feedback')
ON DUPLICATE KEY UPDATE description=VALUES(description);

-- 2. Users
CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  role_id INT NOT NULL,
  username VARCHAR(100) NOT NULL UNIQUE,
  email VARCHAR(150) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (role_id) REFERENCES roles(id) ON DELETE RESTRICT
);

-- 3. Settings (Global Site configuration including theme, SMTP, and emails)
CREATE TABLE IF NOT EXISTS settings (
  id INT AUTO_INCREMENT PRIMARY KEY,
  setting_key VARCHAR(100) NOT NULL UNIQUE,
  setting_value TEXT,
  category VARCHAR(50) DEFAULT 'General',
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Seed initial settings
INSERT INTO settings (setting_key, setting_value, category) VALUES
('company_name', 'GEORSON TECH PVT LTD', 'General'),
('logo_url', '/src/assets/Logo/Georson.png', 'General'),
('motto', 'Gateway of Engineering & Technology', 'General'),
('theme_primary_color', '#0077cc', 'Theme'),
('theme_accent_color', '#00c6ff', 'Theme'),
('theme_background_color', '#ffffff', 'Theme'),
('sales_email', 'sales@georsontech.com', 'Email Recipients'),
('hr_email', 'hr@georsontech.com', 'Email Recipients'),
('projects_email', 'projects@georsontech.com', 'Email Recipients'),
('smtp_host', 'smtp.gmail.com', 'SMTP'),
('smtp_port', '465', 'SMTP'),
('smtp_user', '', 'SMTP'),
('smtp_pass', '', 'SMTP'),
('recaptcha_site_key', '', 'Security'),
('recaptcha_secret_key', '', 'Security'),
('google_analytics_id', '', 'Analytics'),
('google_search_console_id', '', 'Analytics'),
('social_facebook', 'https://www.facebook.com/georsontech', 'Social'),
('social_instagram', 'https://www.instagram.com/georsontech', 'Social'),
('social_linkedin', 'https://www.linkedin.com/company/georsontech', 'Social'),
('social_youtube', '', 'Social')
ON DUPLICATE KEY UPDATE setting_value=VALUES(setting_value);

-- 4. Slider Images (Hero Slider)
CREATE TABLE IF NOT EXISTS slider_images (
  id INT AUTO_INCREMENT PRIMARY KEY,
  image_path VARCHAR(255) NOT NULL,
  badge VARCHAR(100),
  title VARCHAR(255) NOT NULL,
  subtitle VARCHAR(255),
  button_text VARCHAR(100) DEFAULT 'Learn More',
  navigate_path VARCHAR(100) DEFAULT '/about',
  sort_order INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 5. Service Categories
CREATE TABLE IF NOT EXISTS service_categories (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL UNIQUE,
  slug VARCHAR(100) NOT NULL UNIQUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Seed service categories
INSERT INTO service_categories (name, slug) VALUES
('Industrial Engineering', 'industrial-engineering'),
('Industrial Automation', 'industrial-automation'),
('IIoT Solutions', 'iiot-solutions')
ON DUPLICATE KEY UPDATE name=VALUES(name);

-- 6. Services
CREATE TABLE IF NOT EXISTS services (
  id INT AUTO_INCREMENT PRIMARY KEY,
  category_id INT,
  title VARCHAR(200) NOT NULL,
  slug VARCHAR(200) NOT NULL UNIQUE,
  description TEXT,
  image_path VARCHAR(255),
  pdf_brochure_path VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (category_id) REFERENCES service_categories(id) ON DELETE SET NULL
);

-- 7. Product Categories
CREATE TABLE IF NOT EXISTS product_categories (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL UNIQUE,
  slug VARCHAR(100) NOT NULL UNIQUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Seed product categories
INSERT INTO product_categories (name, slug) VALUES
('Automation', 'automation'),
('Electrical', 'electrical'),
('IIoT', 'iiot'),
('Industry 4.0', 'industry-4.0'),
('Engineering', 'engineering'),
('Manufacturing', 'manufacturing'),
('Custom Products', 'custom-products')
ON DUPLICATE KEY UPDATE name=VALUES(name);

-- 8. Products
CREATE TABLE IF NOT EXISTS products (
  id INT AUTO_INCREMENT PRIMARY KEY,
  category_id INT,
  name VARCHAR(200) NOT NULL,
  slug VARCHAR(200) NOT NULL UNIQUE,
  description TEXT,
  specifications JSON, -- e.g., ["IP54 Rating", "LT/HT", "4000A"]
  image_path VARCHAR(255),
  pdf_brochure_path VARCHAR(255),
  video_url VARCHAR(255),
  is_featured BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (category_id) REFERENCES product_categories(id) ON DELETE SET NULL
);

-- 9. Clients
CREATE TABLE IF NOT EXISTS clients (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(150) NOT NULL,
  logo_path VARCHAR(255) NOT NULL,
  sort_order INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 10. Testimonials
CREATE TABLE IF NOT EXISTS testimonials (
  id INT AUTO_INCREMENT PRIMARY KEY,
  author VARCHAR(150) NOT NULL,
  designation VARCHAR(150),
  company VARCHAR(150),
  quote TEXT NOT NULL,
  stars INT DEFAULT 5,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 11. Blog Categories
CREATE TABLE IF NOT EXISTS blog_categories (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL UNIQUE,
  slug VARCHAR(100) NOT NULL UNIQUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Seed blog categories
INSERT INTO blog_categories (name, slug) VALUES
('Industrial Automation', 'industrial-automation'),
('IIoT & Industry 4.0', 'iiot-industry-4.0'),
('Electrical Systems', 'electrical-systems'),
('Company News', 'company-news')
ON DUPLICATE KEY UPDATE name=VALUES(name);

-- 12. Blogs
CREATE TABLE IF NOT EXISTS blogs (
  id INT AUTO_INCREMENT PRIMARY KEY,
  category_id INT,
  author_id INT,
  title VARCHAR(255) NOT NULL,
  slug VARCHAR(255) NOT NULL UNIQUE,
  excerpt TEXT,
  content LONGTEXT NOT NULL,
  featured_image VARCHAR(255),
  status ENUM('Draft', 'Publish') DEFAULT 'Draft',
  seo_title VARCHAR(255),
  meta_description VARCHAR(255),
  seo_keywords VARCHAR(255),
  canonical_url VARCHAR(255),
  og_image_url VARCHAR(255),
  alt_text VARCHAR(255),
  schema_markup TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (category_id) REFERENCES blog_categories(id) ON DELETE SET NULL,
  FOREIGN KEY (author_id) REFERENCES users(id) ON DELETE SET NULL
);

-- 13. Gallery (Simple Static/Dynamic portfolio)
CREATE TABLE IF NOT EXISTS gallery (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(150),
  image_path VARCHAR(255) NOT NULL,
  category VARCHAR(100),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 14. Enquiries (Business Enquiries with status & IP logs)
CREATE TABLE IF NOT EXISTS enquiries (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(150) NOT NULL,
  company VARCHAR(150),
  email VARCHAR(150) NOT NULL,
  phone VARCHAR(50) NOT NULL,
  subject VARCHAR(255) NOT NULL,
  service_interested VARCHAR(150),
  message TEXT NOT NULL,
  ip_address VARCHAR(45),
  status ENUM('Pending', 'Contacted', 'Closed') DEFAULT 'Pending',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- 15. Career Applications (Career applications with status & IP logs)
CREATE TABLE IF NOT EXISTS career_applications (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(150) NOT NULL,
  email VARCHAR(150) NOT NULL,
  phone VARCHAR(50) NOT NULL,
  qualification VARCHAR(150) NOT NULL,
  experience VARCHAR(50) NOT NULL,
  resume_path VARCHAR(255) NOT NULL,
  cover_letter TEXT,
  ip_address VARCHAR(45),
  status ENUM('Pending', 'Contacted', 'Closed') DEFAULT 'Pending',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- 16. Office Locations (Dynamic Office Locations Table)
CREATE TABLE IF NOT EXISTS office_locations (
  id INT AUTO_INCREMENT PRIMARY KEY,
  office_name VARCHAR(150) NOT NULL,
  office_type VARCHAR(100) NOT NULL, -- e.g. Registered Office, Manufacturing Unit
  address TEXT NOT NULL,
  phone VARCHAR(100),
  email VARCHAR(150),
  google_map_link TEXT,
  latitude DECIMAL(10, 8),
  longitude DECIMAL(11, 8),
  image VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Seed initial office locations
INSERT INTO office_locations (office_name, office_type, address, phone, email, google_map_link, latitude, longitude) VALUES
('Chennai Head Office', 'Registered Office', 'No. #4/8, Sriram Nagar Main Road, Karambakkam, Porur, Chennai – 600 116.', '+91 98407 80897', 'projects@georsontech.com', 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3887.079207050303!2d80.1570535!3d12.9922097!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMTLCsDU5JzMxLjEiTiA4MMKwMDknMzMuMyJF!5e0!3m2!1sen!2sin!4v1688123456789', 12.99220970, 80.15705350),
('Coimbatore Plant', 'Manufacturing Unit', 'Coimbatore, Tamil Nadu, India.', '+91 95000 81901', 'georsontech@gmail.com', 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d125320.1706692237!2d76.88483259999999!3d11.0168445!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3ba859af2f971cb5%3A0x2fc1c81e183ed282!2sCoimbatore%2C%20Tamil%20Nadu!5e0!3m2!1sen!2sin!4v1688123456790', 11.01684450, 76.88483260),
('Coimbatore Service', 'Service Unit', 'Coimbatore, Tamil Nadu, India.', '+91 95000 81901', 'service@georsontech.com', 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d125320.1706692237!2d76.88483259999999!3d11.0168445!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3ba859af2f971cb5%3A0x2fc1c81e183ed282!2sCoimbatore%2C%20Tamil%20Nadu!5e0!3m2!1sen!2sin!4v1688123456791', 11.01684450, 76.88483260)
ON DUPLICATE KEY UPDATE address=VALUES(address);

-- 17. Media Library
CREATE TABLE IF NOT EXISTS media_library (
  id INT AUTO_INCREMENT PRIMARY KEY,
  file_name VARCHAR(255) NOT NULL,
  file_path VARCHAR(255) NOT NULL,
  file_size INT NOT NULL,
  file_type VARCHAR(100) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 18. Audit Logs
CREATE TABLE IF NOT EXISTS audit_logs (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NULL,
  action VARCHAR(255) NOT NULL,
  target_table VARCHAR(100),
  details TEXT,
  ip_address VARCHAR(45),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
);

-- 19. Login History
CREATE TABLE IF NOT EXISTS login_history (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NULL,
  username VARCHAR(100),
  status VARCHAR(50) NOT NULL, -- e.g., Success, Failed
  ip_address VARCHAR(45),
  user_agent VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
);

-- 20. Visitor Logs (Custom Local Dashboard Analytics)
CREATE TABLE IF NOT EXISTS visitor_logs (
  id INT AUTO_INCREMENT PRIMARY KEY,
  ip_address VARCHAR(45) NOT NULL,
  url VARCHAR(255) NOT NULL,
  country VARCHAR(100) DEFAULT 'Unknown',
  device VARCHAR(50) DEFAULT 'Desktop',
  browser VARCHAR(100) DEFAULT 'Unknown',
  referrer VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 21. Refresh Tokens
CREATE TABLE IF NOT EXISTS user_refresh_tokens (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  token VARCHAR(255) NOT NULL UNIQUE,
  expires_at TIMESTAMP NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
