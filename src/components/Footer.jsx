import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import LogoImg from '../assets/Logo/Georson-nobg.png';
import '../styles/Components.css';
import {
  FaLinkedinIn, FaInstagram, FaFacebookF, FaWhatsapp, FaYoutube,
  FaPhone, FaEnvelope, FaMapMarkerAlt,
  FaBuilding, FaCogs, FaIndustry, FaAngleRight
} from 'react-icons/fa';

const FALLBACK_OFFICES = [
  {
    id: 1,
    office_name: "Chennai Head Office",
    office_type: "Registered Office",
    address: "No. #4/8, Sriram Nagar Main Road, Karambakkam, Porur, Chennai – 600 116.",
    phone: "+91 98407 80897",
    email: "projects@georsontech.com",
    google_map_link: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3887.079207050303!2d80.1570535!3d12.9922097!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMTLCsDU5JzMxLjEiTiA4MMKwMDknMzMuMyJF!5e0!3m2!1sen!2sin!4v1688123456789"
  },
  {
    id: 2,
    office_name: "Coimbatore Unit-1",
    office_type: "Manufacturing Unit",
    address: "Coimbatore, Tamil Nadu, India.",
    phone: "+91 95000 81901",
    email: "covai@georsontech.com",
    google_map_link: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d125320.1706692237!2d76.88483259999999!3d11.0168445!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3ba859af2f971cb5%3A0x2fc1c81e183ed282!2sCoimbatore%2C%20Tamil%20Nadu!5e0!3m2!1sen!2sin!4v1688123456790"
  },
  {
    id: 3,
    office_name: "Coimbatore Unit-2",
    office_type: "Service Unit",
    address: "Coimbatore, Tamil Nadu, India.",
    phone: "+91 95000 81901",
    email: "covai@georsontech.com",
    google_map_link: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d125320.1706692237!2d76.88483259999999!3d11.0168445!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3ba859af2f971cb5%3A0x2fc1c81e183ed282!2sCoimbatore%2C%20Tamil%20Nadu!5e0!3m2!1sen!2sin!4v1688123456791"
  }
];

function Footer() {
  const year = new Date().getFullYear();
  const [settings, setSettings] = useState({});
  const [offices, setOffices] = useState(FALLBACK_OFFICES);
  const [services, setServices] = useState([]);
  const [products, setProducts] = useState([]);
  const [industries, setIndustries] = useState([]);

  useEffect(() => {
    // Fetch Settings
    fetch('http://localhost:5000/api/settings')
      .then(res => res.json())
      .then(data => {
        setSettings(data);
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

    // Fetch Services for links (limit 4)
    fetch('http://localhost:5000/api/services')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) setServices(data.slice(0, 4));
      })
      .catch(() => {});

    // Fetch Products for links (limit 4)
    fetch('http://localhost:5000/api/products')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) setProducts(data.slice(0, 4));
      })
      .catch(() => {});

    // Fetch Industries for links (limit 4)
    fetch('http://localhost:5000/api/industries')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) setIndustries(data.slice(0, 4));
      })
      .catch(() => {});
  }, []);

  const getLogoSrc = () => {
    if (!settings.logo_url) return LogoImg;
    if (settings.logo_url.startsWith('http')) return settings.logo_url;
    if (settings.logo_url.startsWith('/uploads') || settings.logo_url.startsWith('uploads')) {
      const cleanPath = settings.logo_url.startsWith('/') ? settings.logo_url : `/${settings.logo_url}`;
      return `http://localhost:5000${cleanPath}`;
    }
    return LogoImg;
  };

  return (
    <footer className="footer-container">
      <div className="footer-top" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '30px', paddingBottom: '40px' }}>
        
        {/* Column 1: Brand & Logo */}
        <div className="footer-brand">
          <img src={getLogoSrc()} alt="Georson Tech Pvt. Ltd" className="footer-logo" />
          <p className="footer-motto">
            {settings.motto || "Gateway of Engineering & Technology. Delivering world-class Industrial Engineering, Automation, IoT, and Manufacturing solutions across India."}
          </p>
          <div className="footer-social" style={{ display: 'flex', gap: '10px', marginTop: '15px' }}>
            <a href="https://www.linkedin.com/company/georsontech" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn"><FaLinkedinIn /></a>
            <a href="https://www.instagram.com/georsontech" target="_blank" rel="noopener noreferrer" aria-label="Instagram"><FaInstagram /></a>
            <a href="https://www.facebook.com/georsontech" target="_blank" rel="noopener noreferrer" aria-label="Facebook"><FaFacebookF /></a>
            <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" aria-label="YouTube"><FaYoutube /></a>
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
            {offices.map((office) => (
              <div key={office.id || office.office_name}>
                <p style={{ fontWeight: '600', color: '#f8fafc', marginBottom: '2px' }}>
                  {office.office_name} ({office.office_type})
                </p>
                <a href={`tel:${office.phone}`} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><FaPhone /> {office.phone}</a>
                <a href={`mailto:${office.email}`} style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '2px' }}><FaEnvelope /> {office.email}</a>
              </div>
            ))}
          </div>
        </div>

      </div>

      <hr style={{ borderColor: '#1e293b', margin: '30px 0' }} />
      
      {/* Dynamic Google Maps embed section for all three offices */}
      <div className="footer-maps-row" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px', paddingBottom: '30px' }}>
        {offices.map((office) => (
          <div key={office.id || office.office_name} style={{ background: '#0b1329', border: '1px solid #1e293b', borderRadius: '8px', padding: '15px', overflow: 'hidden' }}>
            <h5 style={{ color: '#0093DD', fontWeight: '700', fontSize: '13px', marginBottom: '6px', textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <FaMapMarkerAlt /> {office.office_name}
            </h5>
            <p style={{ color: '#94a3b8', fontSize: '11.5px', lineHeight: '1.4', marginBottom: '10px', minHeight: '34px' }}>
              {office.address}
            </p>
            {office.google_map_link ? (
              <div style={{ width: '100%', height: '140px', borderRadius: '6px', overflow: 'hidden', border: '1px solid #1e293b' }}>
                <iframe
                  src={office.google_map_link}
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen=""
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title={office.office_name}
                ></iframe>
              </div>
            ) : (
              <div style={{ width: '100%', height: '140px', borderRadius: '6px', background: '#1e293b', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#64748b', fontSize: '12px' }}>
                Map location not configured
              </div>
            )}
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
