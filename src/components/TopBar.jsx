import React, { useState, useEffect } from 'react';
import '../styles/Components.css';
import {
  FaPhone, FaEnvelope, FaMapMarkerAlt,
  FaLinkedinIn, FaInstagram, FaFacebookF, FaWhatsapp
} from 'react-icons/fa';

function TopBar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className={`topbar ${scrolled ? 'scrolled' : ''}`}>
      <div className="topbar-inner">

        {/* Left – Contact Info */}
        <div className="topbar-left">
          <span className="topbar-item">
            <FaPhone size={10} />
            <a href="tel:+919840780897">+91 98407 80897</a>
          </span>
          <span className="topbar-item">
            <FaPhone size={10} />
            <a href="tel:+919500081901">+91 95000 81901</a>
          </span>
          <span className="topbar-item">
            <FaEnvelope size={10} />
            <a href="mailto:projects@georsontech.com">projects@georsontech.com</a>
          </span>
        </div>

        {/* Right – Social + CTA */}
        <div className="topbar-right">
          <span className="topbar-item">
            <FaMapMarkerAlt size={10} />
            <span>Chennai | Coimbatore</span>
          </span>
          <div className="topbar-social">
            <a href="https://www.linkedin.com/company/georsontech" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
              <FaLinkedinIn size={12} />
            </a>
            <a href="https://www.instagram.com/georsontech" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
              <FaInstagram size={12} />
            </a>
            <a href="https://www.facebook.com/georsontech" target="_blank" rel="noopener noreferrer" aria-label="Facebook">
              <FaFacebookF size={12} />
            </a>
            <a href="https://wa.me/919840780897" target="_blank" rel="noopener noreferrer" aria-label="WhatsApp">
              <FaWhatsapp size={12} />
            </a>
          </div>
        </div>

      </div>
    </div>
  );
}

export default TopBar;