import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import LogoImg from '../assets/Logo/Georson-nobg.png';
import '../styles/Components.css';
import {
  FaLinkedinIn, FaInstagram, FaFacebookF, FaWhatsapp, FaYoutube, FaPinterestP, FaTwitter,
  FaPhone, FaEnvelope, FaMapMarkerAlt,
  FaAngleRight
} from 'react-icons/fa';
import { fetchCollection, getAssetUrl } from '../lib/dbHelper';
import OFFICE_LOCATIONS from '../data/officeLocations';

function Footer() {
  const year = new Date().getFullYear();
  const [settings, setSettings] = useState({});
  const [services, setServices] = useState([]);
  const [products, setProducts] = useState([]);
  const [industries, setIndustries] = useState([]);

  useEffect(() => {
    // Fetch Settings
    fetchCollection('/settings', 'settings')
      .then(data => {
        if (Array.isArray(data)) {
          const mappedSettings = {};
          data.forEach(item => {
            mappedSettings[item.setting_key] = item.setting_value;
          });
          setSettings(mappedSettings);
        } else if (data && typeof data === 'object') {
          setSettings(data);
        }
      })
      .catch(() => console.log('Using offline settings fallback'));

    // Fetch Services for links (limit 4)
    fetchCollection('/services', 'services')
      .then(data => {
        if (Array.isArray(data)) setServices(data.slice(0, 4));
      })
      .catch(() => {});

    // Fetch Products for links (limit 4)
    fetchCollection('/products', 'products')
      .then(data => {
        if (Array.isArray(data)) setProducts(data.slice(0, 4));
      })
      .catch(() => {});

    // Fetch Industries for links (limit 4)
    fetchCollection('/industries', 'industries')
      .then(data => {
        if (Array.isArray(data)) setIndustries(data.slice(0, 4));
      })
      .catch(() => {});
  }, []);

  const getLogoSrc = () => {
    if (!settings || !settings.logo_url) return LogoImg;
    const url = getAssetUrl(settings.logo_url);
    if (typeof window !== 'undefined' && !window.location.hostname.includes('localhost') && url.includes('localhost')) {
      return LogoImg;
    }
    return url;
  };

  return (
    <footer className="footer-container">
      <div className="footer-top" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '30px', paddingBottom: '40px' }}>
        
        {/* Column 1: Brand & Logo */}
        <div className="footer-brand">
          <img 
            src={getLogoSrc()} 
            alt="Georson Tech Pvt. Ltd" 
            className="footer-logo" 
            onError={(e) => {
              e.currentTarget.onerror = null;
              e.currentTarget.src = LogoImg;
            }}
          />
          <p className="footer-motto">
            {settings.motto || "Gateway of Engineering & Technology. Delivering world-class Industrial Engineering, Automation, IoT, and Manufacturing solutions across India."}
          </p>
          <div className="footer-social" style={{ display: 'flex', gap: '10px', marginTop: '15px' }}>
            <a href="https://www.linkedin.com/company/georsontech" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn"><FaLinkedinIn /></a>
            <a href="https://www.instagram.com/georsontech_india?igsh=b3ZzaDk2c2Z2NXR6&utm_source=qr" target="_blank" rel="noopener noreferrer" aria-label="Instagram"><FaInstagram /></a>
            <a href="https://www.facebook.com/profile.php?id=61592177770508" target="_blank" rel="noopener noreferrer" aria-label="Facebook"><FaFacebookF /></a>
            <a href="https://x.com/Georson_Tech" target="_blank" rel="noopener noreferrer" aria-label="Twitter X"><FaTwitter /></a>
            <a href="https://pin.it/1HN8gSx89" target="_blank" rel="noopener noreferrer" aria-label="Pinterest"><FaPinterestP /></a>
            <a href="https://youtube.com/@georsontech_india?si=nDzNJQRTZdgTEo0V" target="_blank" rel="noopener noreferrer" aria-label="YouTube"><FaYoutube /></a>
          </div>
        </div>

        {/* Column 2: Quick Links */}
        <div>
          <h4 className="footer-col-title">Quick Links</h4>
          <nav className="footer-links" style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <Link to="/"><FaAngleRight /> Home</Link>
            <Link to="/about"><FaAngleRight /> About Us</Link>
            <Link to="/services"><FaAngleRight /> Services</Link>
            <Link to="/products"><FaAngleRight /> Products</Link>
            <Link to="/industries"><FaAngleRight /> Industries</Link>
            <Link to="/clients"><FaAngleRight /> Clients</Link>
            <Link to="/blog"><FaAngleRight /> Blog</Link>
            <Link to="/enquiry"><FaAngleRight /> Enquiry</Link>
          </nav>
        </div>

        {/* Column 3: Services & Products Links */}
        <div>
          <h4 className="footer-col-title">Services & Products</h4>
          <nav className="footer-links" style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '15px' }}>
            {services.length > 0 ? (
              services.map(s => <Link key={s.id} to="/services"><FaAngleRight /> {s.title}</Link>)
            ) : (
              <>
                <Link to="/services"><FaAngleRight /> Industrial Automation</Link>
                <Link to="/services"><FaAngleRight /> Industrial Engineering</Link>
                <Link to="/services"><FaAngleRight /> IoT Solutions</Link>
              </>
            )}
          </nav>
          <nav className="footer-links" style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {products.length > 0 ? (
              products.map(p => <Link key={p.id} to="/products"><FaAngleRight /> {p.name}</Link>)
            ) : (
              <>
                <Link to="/products"><FaAngleRight /> Electrical Panels</Link>
                <Link to="/products"><FaAngleRight /> PLC Control Systems</Link>
              </>
            )}
          </nav>
        </div>

        {/* Column 4: Industries Links */}
        <div>
          <h4 className="footer-col-title">Industries We Serve</h4>
          <nav className="footer-links" style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '20px' }}>
            {industries.length > 0 ? (
              industries.map(ind => <Link key={ind.id} to="/industries"><FaAngleRight /> {ind.name}</Link>)
            ) : (
              <>
                <Link to="/industries"><FaAngleRight /> Electrical Engineering</Link>
                <Link to="/industries"><FaAngleRight /> Marine Industries</Link>
                <Link to="/industries"><FaAngleRight /> Automobile Industries</Link>
                <Link to="/industries"><FaAngleRight /> Cement Industries</Link>
              </>
            )}
          </nav>
          <Link to="/enquiry" className="btn-primary" style={{ padding: '10px 20px', fontSize: '13px', width: '100%', justifyContent: 'center' }}>
            Talk to Our Experts
          </Link>
        </div>

        {/* Column 5: Contact Info */}
        <div>
          <h4 className="footer-col-title">Contact Office</h4>
          <div className="footer-contact-list" style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '13px' }}>
            {OFFICE_LOCATIONS.map((office) => (
              <div key={office.id}>
                <p style={{ fontWeight: '600', color: '#f8fafc', marginBottom: '2px' }}>
                  {office.office_name} 
                </p>
                <a href={`tel:${office.phone}`} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><FaPhone /> {office.phone}</a>
                <a href={`mailto:${office.email}`} style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '2px' }}><FaEnvelope /> {office.email}</a>
              </div>
            ))}
          </div>
        </div>

      </div>

      <hr style={{ borderColor: '#1e293b', margin: '30px 0' }} />
      
      {/* Static Google Maps embed section for all three offices */}
      <div className="footer-maps-row" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px', paddingBottom: '30px' }}>
        {OFFICE_LOCATIONS.map((office) => (
          <div key={office.id} style={{ background: '#0b1329', border: '1px solid #1e293b', borderRadius: '8px', padding: '15px', overflow: 'hidden' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
              <h5 style={{ color: '#0093DD', fontWeight: '700', fontSize: '13px', margin: 0, textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <FaMapMarkerAlt /> {office.office_name}
              </h5>
              <a
                href={office.direct_map_link}
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: '#38bdf8', fontSize: '11px', fontWeight: '600', textDecoration: 'underline' }}
              >
                Maps ↗
              </a>
            </div>
            <p style={{ color: '#94a3b8', fontSize: '11.5px', lineHeight: '1.4', marginBottom: '10px', minHeight: '34px' }}>
              {office.address}
            </p>
            <a
              href={office.direct_map_link}
              target="_blank"
              rel="noopener noreferrer"
              title={`Open ${office.office_name} in Google Maps`}
              style={{ display: 'block', width: '100%', height: '140px', borderRadius: '6px', overflow: 'hidden', border: '1px solid #1e293b', position: 'relative' }}
            >
              <iframe
                src={office.google_map_link}
                width="100%"
                height="100%"
                style={{ border: 0, pointerEvents: 'none' }}
                loading="lazy"
                title={office.office_name}
              ></iframe>
              <div style={{
                position: 'absolute',
                inset: 0,
                zIndex: 10,
                background: 'transparent'
              }} />
            </a>
          </div>
        ))}
      </div>

      {/* Bottom Bar */}
      <div className="footer-bottom" style={{ borderTop: '1px solid #1e293b', paddingTop: '20px', paddingBottom: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '15px' }}>
        <p style={{ fontSize: '13px' }}>
          &copy; {year} <strong style={{ color: '#fff' }}>Georson Tech.</strong> All Rights Reserved.
        </p>
        <div className="footer-bottom-links" style={{ display: 'flex', gap: '15px' }}>
          <a href="#/privacy" style={{ fontSize: '13px', color: '#94a3b8' }}>Privacy Policy</a>
          <a href="#/terms" style={{ fontSize: '13px', color: '#94a3b8' }}>Terms and Conditions</a>
        </div>
        <p style={{ fontSize: '12px' }}>
          Developed by <span className="developer-badge">RIT CSBS</span>
        </p>
      </div>
    </footer>
  );
}

export default Footer;
