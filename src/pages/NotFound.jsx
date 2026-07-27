import React from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { FaHome, FaConciergeBell, FaEnvelope, FaExclamationTriangle } from 'react-icons/fa';
import '../styles/NotFound.css';

function NotFound() {
  return (
    <>
      <Helmet>
        <title>404 - Page Not Found | Georson Tech Pvt. Ltd</title>
        <meta name="robots" content="noindex, follow" />
      </Helmet>

      <div className="notfound-wrapper">
        <div className="notfound-card">
          <div className="notfound-code">404</div>
          <h1 className="notfound-title">Page Not Found</h1>
          <p className="notfound-text">
            The page you are looking for might have been removed, renamed, or is temporarily unavailable. Let's get you back on track!
          </p>

          <div className="notfound-actions">
            <Link to="/" className="notfound-btn-primary">
              <FaHome /> Back to Home
            </Link>
            <Link to="/services" className="notfound-btn-secondary">
              <FaConciergeBell /> Explore Services
            </Link>
            <Link to="/enquiry" className="notfound-btn-secondary">
              <FaEnvelope /> Contact Us
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}

export default NotFound;