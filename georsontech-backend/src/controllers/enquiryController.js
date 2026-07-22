import pool from '../config/db.js';
import { sendEnquiryEmail, sendCareerEmail } from '../utils/emailService.js';
import { uploadToSupabase } from '../config/supabase.js';
import fs from 'fs';


// In-memory fallback store when MySQL is offline
const memoryEnquiries = [];
const memoryCareers = [];

export const createEnquiry = async (req, res) => {
  const { name, company, email, phone, subject, serviceInterested, message } = req.body;
  const ipAddress = req.ip || req.connection?.remoteAddress;

  if (!name || !email || !phone || !subject || !message) {
    return res.status(400).json({ message: 'Required fields are missing' });
  }

  // Always send email notification (independent of DB)
  const defaultRecipients = ['projects@georsontech.com', 'georsontech@gmail.com'];
  sendEnquiryEmail({ name, company, email, phone, subject, serviceInterested, message }, defaultRecipients)
    .catch(err => console.error('Enquiry Email send failure:', err.message));

  // Try to save to database
  try {
    let recipients = defaultRecipients;
    try {
      const [emailSettings] = await pool.query(
        'SELECT setting_value FROM settings WHERE setting_key IN ("sales_email", "projects_email")'
      );
      if (emailSettings.length > 0) recipients = emailSettings.map(s => s.setting_value);
    } catch (_) { /* ignore settings query failure */ }

    const [result] = await pool.query(
      `INSERT INTO enquiries (name, company, email, phone, subject, service_interested, message, ip_address, status) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'Pending')`,
      [name, company, email, phone, subject, serviceInterested, message, ipAddress]
    );

    return res.status(201).json({
      message: 'Enquiry submitted successfully! We will get back to you shortly.',
      enquiryId: result.insertId
    });
  } catch (error) {
    // DB offline – store in memory and still return success
    const memId = Date.now();
    memoryEnquiries.push({ id: memId, name, company, email, phone, subject, serviceInterested, message, status: 'Pending', created_at: new Date().toISOString() });
    console.warn('MySQL offline – enquiry saved in memory (id:', memId, ')');

    return res.status(201).json({
      message: 'Enquiry submitted successfully! We will get back to you shortly.',
      enquiryId: memId
    });
  }
};

export const createCareerApplication = async (req, res) => {
  const { name, email, phone, qualification, experience, coverLetter } = req.body;
  const ipAddress = req.ip || req.connection?.remoteAddress;

  if (!name || !email || !phone || !qualification || !experience) {
    return res.status(400).json({ message: 'Required fields are missing' });
  }

  if (!req.file) {
    return res.status(400).json({ message: 'Resume file upload is required' });
  }

  let resumePath = req.file.path.replace(/\\/g, '/'); // local path as fallback

  // Try uploading to Supabase Storage using service key (bypasses RLS)
  try {
    const cleanFileName = req.file.originalname.replace(/[^a-zA-Z0-9._-]/g, '_');
    const fileName = `${Date.now()}_${cleanFileName}`;
    const fileBuffer = fs.readFileSync(req.file.path);
    const supabaseUrl = await uploadToSupabase('resumes', fileName, fileBuffer, req.file.mimetype);
    if (supabaseUrl) {
      resumePath = supabaseUrl;
      console.log('[Backend] Resume uploaded to Supabase Storage:', supabaseUrl);
    } else {
      console.warn('[Backend] Supabase upload failed, storing local path:', resumePath);
    }
  } catch (e) {
    console.warn('[Backend] Supabase upload exception:', e.message);
  }

  // Always send email
  const hrRecipient = process.env.HR_EMAIL_TO || 'hr@georsontech.com';
  sendCareerEmail({ name, email, phone, qualification, experience, coverLetter }, req.file, hrRecipient)
    .catch(err => console.error('Career Email send failure:', err.message));

  try {
    const [result] = await pool.query(
      `INSERT INTO career_applications (name, email, phone, qualification, experience, resume_path, cover_letter, ip_address, status) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'Pending')`,
      [name, email, phone, qualification, experience, resumePath, coverLetter, ipAddress]
    );

    return res.status(201).json({
      message: 'Application submitted successfully',
      applicationId: result.insertId,
      resumePath
    });
  } catch (error) {
    const memId = Date.now();
    memoryCareers.push({ id: memId, name, email, phone, qualification, experience, coverLetter, status: 'Pending', created_at: new Date().toISOString(), resume_path: resumePath });
    console.warn('MySQL offline – career application saved in memory');

    return res.status(201).json({
      message: 'Application submitted successfully',
      applicationId: memId,
      resumePath
    });
  }
};


// Admin Endpoints
export const getEnquiries = async (req, res) => {
  try {
    const [enquiries] = await pool.query('SELECT * FROM enquiries ORDER BY created_at DESC');
    return res.json(enquiries);
  } catch (error) {
    return res.json(memoryEnquiries.reverse()); // Return in-memory fallback
  }
};

export const updateEnquiryStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  if (!['Pending', 'Contacted', 'Closed'].includes(status)) {
    return res.status(400).json({ message: 'Invalid status value' });
  }

  try {
    const [result] = await pool.query('UPDATE enquiries SET status = ? WHERE id = ?', [status, id]);
    if (result.affectedRows === 0) return res.status(404).json({ message: 'Enquiry not found' });
    return res.json({ message: 'Enquiry status updated successfully' });
  } catch (error) {
    // Try memory store update
    const mem = memoryEnquiries.find(e => e.id == id);
    if (mem) mem.status = status;
    return res.json({ message: 'Status updated (offline mode)' });
  }
};

export const getCareerApplications = async (req, res) => {
  try {
    const [applications] = await pool.query('SELECT * FROM career_applications ORDER BY created_at DESC');
    return res.json(applications);
  } catch (error) {
    return res.json(memoryCareers.reverse());
  }
};

export const updateCareerStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  if (!['Pending', 'Contacted', 'Closed'].includes(status)) {
    return res.status(400).json({ message: 'Invalid status value' });
  }

  try {
    const [result] = await pool.query('UPDATE career_applications SET status = ? WHERE id = ?', [status, id]);
    if (result.affectedRows === 0) return res.status(404).json({ message: 'Application not found' });
    return res.json({ message: 'Application status updated successfully' });
  } catch (error) {
    const mem = memoryCareers.find(c => c.id == id);
    if (mem) mem.status = status;
    return res.json({ message: 'Status updated (offline mode)' });
  }
};
