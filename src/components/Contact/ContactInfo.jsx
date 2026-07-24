import React from 'react';
import { FaMapMarkerAlt, FaPhoneAlt, FaEnvelope } from 'react-icons/fa';
import { FaInstagram, FaLinkedinIn, FaFacebookF, FaYoutube, FaPinterestP, FaTwitter } from 'react-icons/fa';

function ContactInfo() {
  return (
    <div className="contact-card contact-left-card">
      <p className="contact-small-heading">GET IN TOUCH</p>
      <h2 className="contact-main-heading">Do You Have Any Questions?</h2>
      <p className="contact-description">
        If you have any questions or comments about our services,
        contact us using the form or the details below. We are here to assist you.
      </p>

      {/* Address */}
      <div className="contact-info-row">
        <div className="contact-info-title">
          <FaMapMarkerAlt className="contact-info-icon" />
          <h4 className="contact-info-heading">Registered Office</h4>
        </div>
        <p>
          No. #4/8, Sriram Nagar Main Road,<br />
          Karambakkam, Porur,<br />
          Chennai - 600 116
        </p>
      </div>

      {/* Phone */}
      <div className="contact-info-row">
        <div className="contact-info-title">
          <FaPhoneAlt className="contact-info-icon" />
          <h4 className="contact-info-heading">Phone Numbers</h4>
        </div>
        <p><strong>Registered Office:</strong> <a href="tel:+919840780897" style={{ color: '#0093DD' }}>+91 98407 80897</a></p>
        <p><strong>Coimbatore Branch:</strong> <a href="tel:+917845692697" style={{ color: '#0093DD' }}>+91 78456 92697</a></p>
      </div>

      {/* Email */}
      <div className="contact-info-row">
        <div className="contact-info-title">
          <FaEnvelope className="contact-info-icon" />
          <h4 className="contact-info-heading">Email</h4>
        </div>
        <p><strong>Main Branch:</strong> <a href="mailto:georsontech@gmail.com">georsontech@gmail.com</a></p>
        <p><strong>Coimbatore Units:</strong> <a href="mailto:covai@georsontech.com">covai@georsontech.com</a></p>
      </div>

      <div className="contact-social-icons">
        <a href="https://www.linkedin.com/company/georsontech" target="_blank" rel="noopener noreferrer" className="contact-social-circle contact-linkedin">
          <FaLinkedinIn />
        </a>
        <a href="https://www.instagram.com/georsontech_india?igsh=b3ZzaDk2c2Z2NXR6&utm_source=qr" target="_blank" rel="noopener noreferrer" className="contact-social-circle contact-instagram">
          <FaInstagram />
        </a>
        <a href="https://www.facebook.com/profile.php?id=61592177770508" target="_blank" rel="noopener noreferrer" className="contact-social-circle contact-facebook">
          <FaFacebookF />
        </a>
        <a href="https://x.com/Georson_Tech" target="_blank" rel="noopener noreferrer" className="contact-social-circle contact-twitter">
          <FaTwitter />
        </a>
        <a href="https://pin.it/1HN8gSx89" target="_blank" rel="noopener noreferrer" className="contact-social-circle contact-pinterest">
          <FaPinterestP />
        </a>
        <a href="https://youtube.com/@georsontech_india?si=nDzNJQRTZdgTEo0V" target="_blank" rel="noopener noreferrer" className="contact-social-circle contact-youtube">
          <FaYoutube />
        </a>
      </div>
    </div>
  );
}

export default ContactInfo;


