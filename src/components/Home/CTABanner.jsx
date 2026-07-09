import React from 'react';
import { Link } from 'react-router-dom';
import { FaArrowRight, FaPhone } from 'react-icons/fa';
import '../../styles/Home.css';

function CTABanner() {
  return (
    <section className="cta-banner">
      <div className="cta-banner-content">
        <h2>Ready to Automate Your Industrial Operations?</h2>
        <p>
          Get in touch with our engineering experts today. We'll design a custom
          solution for your specific requirements — from concept to commissioning.
        </p>
        <div className="cta-banner-btns">
          <Link to="/enquiry" className="cta-btn-white">
            <FaArrowRight /> Get a Free Quote
          </Link>
          <a href="tel:+919840780897" className="cta-btn-ghost">
            <FaPhone /> +91 98407 80897
          </a>
        </div>
      </div>
    </section>
  );
}

export default CTABanner;
