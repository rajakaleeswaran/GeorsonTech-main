import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST || 'smtp.gmail.com',
  port: parseInt(process.env.EMAIL_PORT || '465'),
  secure: process.env.EMAIL_PORT === '465', // true for 465, false for other ports
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

export const sendEnquiryEmail = async (enquiryData) => {
  const { name, company, email, phone, subject, serviceInterested, message } = enquiryData;

  const mailOptions = {
    from: process.env.EMAIL_FROM || 'projects@georsontech.com',
    to: process.env.EMAIL_TO || 'projects@georsontech.com',
    subject: `New Business Enquiry: ${subject}`,
    html: `
      <h2>New Business Enquiry Received</h2>
      <p><strong>Name:</strong> ${name}</p>
      <p><strong>Company:</strong> ${company || 'N/A'}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Phone:</strong> ${phone}</p>
      <p><strong>Service Interested:</strong> ${serviceInterested}</p>
      <p><strong>Message:</strong></p>
      <div style="padding: 10px; background-color: #f3f4f6; border-left: 4px solid #0077cc; border-radius: 4px;">
        ${message.replace(/\n/g, '<br>')}
      </div>
    `
  };

  return transporter.sendMail(mailOptions);
};

export const sendCareerEmail = async (candidateData, fileAttachment) => {
  const { name, email, phone, qualification, experience, coverLetter } = candidateData;

  const mailOptions = {
    from: process.env.EMAIL_FROM || 'projects@georsontech.com',
    to: process.env.HR_EMAIL_TO || 'hr@georsontech.com',
    subject: `New Job Application from ${name}`,
    html: `
      <h2>New Career Application Received</h2>
      <p><strong>Name:</strong> ${name}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Phone:</strong> ${phone}</p>
      <p><strong>Highest Qualification:</strong> ${qualification}</p>
      <p><strong>Experience:</strong> ${experience}</p>
      <p><strong>Cover Letter / Comments:</strong></p>
      <div style="padding: 10px; background-color: #f3f4f6; border-left: 4px solid #0077cc; border-radius: 4px;">
        ${(coverLetter || 'None provided').replace(/\n/g, '<br>')}
      </div>
      <p>Please find the attached resume for details.</p>
    `,
    attachments: fileAttachment ? [
      {
        filename: fileAttachment.originalname,
        path: fileAttachment.path
      }
    ] : []
  };

  return transporter.sendMail(mailOptions);
};
