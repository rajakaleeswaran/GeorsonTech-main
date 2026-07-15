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
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3887.079207050303!2d80.1570535!3d12.9922097!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMTLCsDU5JzMxLjEiTiA4MMKwMDknMzMuMyJF!5e0!3m2!1sen!2sin!4v1688123456789"
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
