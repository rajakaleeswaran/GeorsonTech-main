import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import LogoImg from '../assets/Logo/Georson-nobg.png';
import '../styles/Components.css';
import {
  FaLinkedinIn, FaInstagram, FaFacebookF, FaWhatsapp, FaYoutube,
  FaPhone, FaEnvelope, FaMapMarkerAlt,
  FaBuilding, FaCogs, FaIndustry
} from 'react-icons/fa';

const FALLBACK_OFFICES = [
  {
    office_name: "Chennai Head Office",
    office_type: "Registered Office",
    address: "No. #4/8, Sriram Nagar Main Road, Karambakkam, Porur, Chennai – 600 116.",
    phone: "+91 98407 80897",
    email: "projects@georsontech.com",
    google_map_link: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3887.079207050303!2d80.1570535!3d12.9922097!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMTLCsDU5JzMxLjEiTiA4MMKwMDknMzMuMyJF!5e0!3m2!1sen!2sin!4v1688123456789"
  },
  {
    office_name: "Coimbatore Plant",
    office_type: "Manufacturing Unit",
    address: "Coimbatore, Tamil Nadu, India.",
    phone: "+91 95000 81901",
    email: "georsontech@gmail.com",
    google_map_link: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d125320.1706692237!2d76.88483259999999!3d11.0168445!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3ba859af2f971cb5%3A0x2fc1c81e183ed282!2sCoimbatore%2C%20Tamil%20Nadu!5e0!3m2!1sen!2sin!4v1688123456790"
  },
  {
    office_name: "Coimbatore Service",
    office_type: "Service Unit",
    address: "Coimbatore, Tamil Nadu, India.",
    phone: "+91 95000 81901",
    email: "service@georsontech.com",
    google_map_link: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d125320.1706692237!2d76.88483259999999!3d11.0168445!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3ba859af2f971cb5%3A0x2fc1c81e183ed282!2sCoimbatore%2C%20Tamil%20Nadu!5e0!3m2!1sen!2sin!4v1688123456791"
  }
];

const QUICK_LINKS = [
  { to: "/",         label: "Home" },
  { to: "/about",    label: "About Us" },
  { to: "/services", label: "Services" },
  { to: "/products", label: "Products" },
  { to: "/clients",  label: "Clients" },
  { to: "/blog",     label: "Blog" },
  { to: "/enquiry",  label: "Enquiry" }
];

function Footer() {
  const year = new Date().getFullYear();
  const [settings, setSettings] = useState({});
  const [offices, setOffices] = useState(FALLBACK_OFFICES);

  useEffect(() => {
    // Fetch Settings
    fetch('http://localhost:5000/api/settings')
      .then(res => res.json())
      .then(data => {
        setSettings(data);
        // Inject colors dynamically into CSS root variables
        if (data.theme_primary_color) {
          document.documentElement.style.setProperty('--clr-primary', data.theme_primary_color);
        }
        if (data.theme_accent_color) {
          document.documentElement.style.setProperty('--clr-accent', data.theme_accent_color);
        }
      })
      .catch(() => console.log('Using offline settings fallback'));

    // Fetch Locations
    fetch('http://localhost:5000/api/locations')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data) && data.length > 0) {
          setOffices(data);
        }
      })
      .catch(() => console.log('Using offline locations fallback'));
  }, []);

  const getOfficeIcon = (type) => {
    if (type?.includes('Manufacturing')) return <FaIndustry />;
    if (type?.includes('Service')) return <FaCogs />;
    return <FaBuilding />;
  };

  return (
    <footer className="footer-container">
      <div className="footer-top">

        {/* Column 1 – Brand */}
        <div className="footer-brand">
          <img src={settings.logo_url || LogoImg} alt="Georson Tech Pvt. Ltd" className="footer-logo" />
          <p className="footer-motto">
            {settings.motto || "Gateway of Engineering & Technology. Delivering world-class Industrial Engineering, Automation, IoT, and Manufacturing solutions across India."}
          </p>
          <div className="footer-social">
            {settings.social_linkedin && (
              <a href={settings.social_linkedin} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
                <FaLinkedinIn />
              </a>
            )}
            {settings.social_instagram && (
              <a href={settings.social_instagram} target="_blank" rel="noopener noreferrer" aria-label="Instagram">
                <FaInstagram />
              </a>
            )}
            {settings.social_facebook && (
              <a href={settings.social_facebook} target="_blank" rel="noopener noreferrer" aria-label="Facebook">
                <FaFacebookF />
              </a>
            )}
            <a href={`https://wa.me/${(settings.sales_phone || '919840780897').replace(/\+/g, '')}`} target="_blank" rel="noopener noreferrer" aria-label="WhatsApp">
              <FaWhatsapp />
            </a>
            {settings.social_youtube && (
              <a href={settings.social_youtube} target="_blank" rel="noopener noreferrer" aria-label="YouTube">
                <FaYoutube />
              </a>
            )}
          </div>
        </div>

        {/* Column 2 – Quick Links */}
        <div>
          <h4 className="footer-col-title">Quick Links</h4>
          <nav className="footer-links">
            {QUICK_LINKS.map(({ to, label }) => (
              <Link key={to} to={to}>{label}</Link>
            ))}
          </nav>
        </div>

        {/* Column 3 – Contact Info */}
        <div>
          <h4 className="footer-col-title">Contact Info</h4>
          <div className="footer-contact-list">
            <div className="footer-contact-item">
              <FaPhone className="footer-contact-icon" />
              <div>
                <a href={`tel:${settings.sales_phone || '+919840780897'}`}>{settings.sales_phone || '+91 98407 80897'}</a><br />
                <a href={`tel:${settings.projects_phone || '+919500081901'}`}>{settings.projects_phone || '+91 95000 81901'}</a>
              </div>
            </div>
            <div className="footer-contact-item">
              <FaEnvelope className="footer-contact-icon" />
              <div>
                <a href={`mailto:${settings.projects_email || 'projects@georsontech.com'}`}>{settings.projects_email || 'projects@georsontech.com'}</a><br />
                <a href={`mailto:${settings.sales_email || 'sales@georsontech.com'}`}>{settings.sales_email || 'sales@georsontech.com'}</a>
              </div>
            </div>
            <div className="footer-contact-item">
              <FaMapMarkerAlt className="footer-contact-icon" />
              <p>{offices[0]?.address || "No. #4/8, Sriram Nagar Main Road, Porur, Chennai."}</p>
            </div>
          </div>
        </div>

        {/* Column 4 – Office Locations */}
        <div>
          <h4 className="footer-col-title">Our Offices</h4>
          {offices.map((office, i) => (
            <div key={i} className="footer-office">
              <p className="footer-office-name">
                <span></span>
                {getOfficeIcon(office.office_type)} &nbsp; {office.office_name}
              </p>
              <p>{office.address}</p>
            </div>
          ))}
        </div>

      </div>

      {/* Maps Row */}
      <div className="footer-maps">
        <p className="footer-maps-title">📍 Find Us</p>
        <div className="footer-maps-grid">
          {offices.map((office, i) => (
            <div key={i} className="footer-map-card">
              <div className="footer-map-label">
                {getOfficeIcon(office.office_type)} &nbsp; {office.office_name}
              </div>
              {office.google_map_link && (
                <iframe
                  src={office.google_map_link}
                  allowFullScreen=""
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title={office.office_name}
                />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="footer-bottom">
        <p>
          &copy; {year} <strong style={{ color: '#94a3b8' }}>{settings.company_name || "Georson Tech Pvt. Ltd."}</strong> All Rights Reserved.
        </p>
        <div className="footer-bottom-links">
          <a href="#">Privacy Policy</a>
          <a href="#">Terms of Service</a>
          <a href="#">Sitemap</a>
        </div>
        <p>
          Developed by <span className="developer-badge">RIT CSBS</span>
        </p>
      </div>
    </footer>
  );
}

export default Footer;