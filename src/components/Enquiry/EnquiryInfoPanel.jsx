import React from 'react';
import { FaPhone, FaEnvelope, FaClock, FaMapMarkerAlt } from 'react-icons/fa';

function EnquiryInfoPanel() {
  return (
    <div className="enquiry-info-panel">
      <div className="enquiry-info-card">
        <h4>Contact Details</h4>
        
        <div className="enquiry-contact-item">
          <div className="enquiry-contact-icon"><FaPhone /></div>
          <div className="enquiry-contact-info">
            <h5>Call Us</h5>
            <a href="tel:+919840780897">+91 98407 80897</a><br />
            <a href="tel:+919500081901">+91 95000 81901</a>
          </div>
        </div>

        <div className="enquiry-contact-item">
          <div className="enquiry-contact-icon"><FaEnvelope /></div>
          <div className="enquiry-contact-info">
            <h5>Email Support</h5>
            <a href="mailto:projects@georsontech.com">projects@georsontech.com</a><br />
            <a href="mailto:georsontech@gmail.com">georsontech@gmail.com</a>
          </div>
        </div>

        <div className="enquiry-contact-item">
          <div className="enquiry-contact-icon"><FaClock /></div>
          <div className="enquiry-contact-info">
            <h5>Working Hours</h5>
            <p>Mon - Sat: 9:00 AM - 6:00 PM</p>
            <p>Sunday: Closed</p>
          </div>
        </div>
      </div>

      <div className="enquiry-info-card">
        <h4>Registered Office</h4>
        <div className="enquiry-contact-item">
          <div className="enquiry-contact-icon"><FaMapMarkerAlt /></div>
          <div className="enquiry-contact-info">
            <h5>Chennai Location</h5>
            <p>No. #4/8, Sriram Nagar Main Road, Karambakkam, Porur, Chennai – 600 116.</p>
          </div>
        </div>
      </div>

      <div className="enquiry-map">
        {/* Embedded Chennai Map */}
        <iframe
          src="https://maps.google.com/maps?q=13.0370897,80.1510288&z=15&output=embed"
          allowFullScreen=""
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          title="Chennai Office Map"
        />
      </div>
    </div>
  );
}

export default EnquiryInfoPanel;
