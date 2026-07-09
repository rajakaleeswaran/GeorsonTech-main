import pool from '../config/db.js';
import { sendEnquiryEmail, sendCareerEmail } from '../utils/emailService.js';
import { logAudit } from '../utils/logger.js';

export const createEnquiry = async (req, res) => {
  const { name, company, email, phone, subject, serviceInterested, message } = req.body;
  const ipAddress = req.ip || req.connection.remoteAddress;

  if (!name || !email || !phone || !subject || !message) {
    return res.status(400).json({ message: 'Required fields are missing' });
  }

  try {
    // Fetch custom Sales/Projects recipient addresses dynamically from settings
    const [emailSettings] = await pool.query(
      'SELECT setting_value FROM settings WHERE setting_key IN ("sales_email", "projects_email")'
    );
    const recipients = emailSettings.map(s => s.setting_value);

    // 1. Save to database
    const [result] = await pool.query(
      `INSERT INTO enquiries (name, company, email, phone, subject, service_interested, message, ip_address, status) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'Pending')`,
      [name, company, email, phone, subject, serviceInterested, message, ipAddress]
    );

    // 2. Send email notification in background
    sendEnquiryEmail({ name, company, email, phone, subject, serviceInterested, message }, recipients)
      .catch(err => console.error('Enquiry Email send failure:', err));

    return res.status(201).json({
      message: 'Enquiry submitted successfully',
      enquiryId: result.insertId
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Database save failed' });
  }
};

export const createCareerApplication = async (req, res) => {
  const { name, email, phone, qualification, experience, coverLetter } = req.body;
  const ipAddress = req.ip || req.connection.remoteAddress;

  if (!name || !email || !phone || !qualification || !experience) {
    return res.status(400).json({ message: 'Required fields are missing' });
  }

  if (!req.file) {
    return res.status(400).json({ message: 'Resume file upload is required' });
  }

  try {
    const resumePath = req.file.path;

    // Fetch HR recipient address dynamically from settings
    const [[hrSetting]] = await pool.query(
      'SELECT setting_value FROM settings WHERE setting_key = "hr_email"'
    );
    const hrRecipient = hrSetting ? hrSetting.setting_value : 'hr@georsontech.com';

    // 1. Save to database
    const [result] = await pool.query(
      `INSERT INTO career_applications (name, email, phone, qualification, experience, resume_path, cover_letter, ip_address, status) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'Pending')`,
      [name, email, phone, qualification, experience, resumePath, coverLetter, ipAddress]
    );

    // 2. Send email notification with resume attachment in background
    sendCareerEmail({ name, email, phone, qualification, experience, coverLetter }, req.file, hrRecipient)
      .catch(err => console.error('Career Email send failure:', err));

    return res.status(201).json({
      message: 'Application submitted successfully',
      applicationId: result.insertId
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Database save failed' });
  }
};

// Admin Endpoints
export const getEnquiries = async (req, res) => {
  try {
    const [enquiries] = await pool.query('SELECT * FROM enquiries ORDER BY created_at DESC');
    return res.json(enquiries);
  } catch (error) {
    return res.status(500).json({ message: 'Failed to retrieve enquiries' });
  }
};

export const updateEnquiryStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body; // Pending, Contacted, Closed
  const ipAddress = req.ip || req.connection.remoteAddress;

  if (!['Pending', 'Contacted', 'Closed'].includes(status)) {
    return res.status(400).json({ message: 'Invalid status value' });
  }

  try {
    const [result] = await pool.query('UPDATE enquiries SET status = ? WHERE id = ?', [status, id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Enquiry not found' });
    }
    await logAudit(req.user?.id, 'UPDATE_ENQUIRY_STATUS', 'enquiries', { id, status }, ipAddress);
    return res.json({ message: 'Enquiry status updated successfully' });
  } catch (error) {
    return res.status(500).json({ message: 'Failed to update enquiry status' });
  }
};

export const getCareerApplications = async (req, res) => {
  try {
    const [applications] = await pool.query('SELECT * FROM career_applications ORDER BY created_at DESC');
    return res.json(applications);
  } catch (error) {
    return res.status(500).json({ message: 'Failed to retrieve applications' });
  }
};

export const updateCareerStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  const ipAddress = req.ip || req.connection.remoteAddress;

  if (!['Pending', 'Contacted', 'Closed'].includes(status)) {
    return res.status(400).json({ message: 'Invalid status value' });
  }

  try {
    const [result] = await pool.query('UPDATE career_applications SET status = ? WHERE id = ?', [status, id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Application not found' });
    }
    await logAudit(req.user?.id, 'UPDATE_CAREER_STATUS', 'career_applications', { id, status }, ipAddress);
    return res.json({ message: 'Application status updated successfully' });
  } catch (error) {
    return res.status(500).json({ message: 'Failed to update application status' });
  }
};
