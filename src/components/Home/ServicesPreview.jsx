import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaArrowRight, FaCogs, FaIndustry, FaMicrochip, FaWifi, FaTools, FaProjectDiagram } from 'react-icons/fa';
import '../../styles/Home.css';
import { fetchCollection } from '../../lib/dbHelper';

// Map common service keywords to icons
const ICON_MAP = {
  'engineering': <FaIndustry />,
  'automation': <FaCogs />,
  'iot': <FaWifi />,
  'iiot': <FaWifi />,
  'electrical': <FaProjectDiagram />,
  'panel': <FaProjectDiagram />,
  'manufacturing': <FaMicrochip />,
  'consultancy': <FaTools />,
  'default': <FaCogs />,
};

function getServiceIcon(title = '') {
  const lower = title.toLowerCase();
  for (const [key, icon] of Object.entries(ICON_MAP)) {
    if (key !== 'default' && lower.includes(key)) return icon;
  }
  return ICON_MAP.default;
}

const STATIC_SERVICES = [
  { id: 's1', title: "Industrial Engineering", short_description: "Complete industrial engineering solutions from design to implementation, covering electrical and mechanical systems." },
  { id: 's2', title: "Industrial Automation", short_description: "PLC, SCADA, DCS, and HMI-based automation systems for manufacturing and process industries." },
  { id: 's3', title: "IoT Solutions", short_description: "Smart connected systems that enable real-time monitoring, predictive maintenance, and data-driven decisions." },
  { id: 's4', title: "Electrical Panels", short_description: "LT/HT electrical panels, MCC, PCC, power distribution boards, and custom switchgear fabrication." },
  { id: 's5', title: "Manufacturing Solutions", short_description: "End-to-end manufacturing execution systems and production line automation for Industry 4.0." },
  { id: 's6', title: "Engineering Consultancy", short_description: "Expert technical consultancy for plant layout, system design, energy audits, and compliance." },
];

function ServicesPreview() {
  const [services, setServices] = useState([]);

  useEffect(() => {
    fetchCollection('/services', 'services')
      .then(data => {
        if (Array.isArray(data) && data.length > 0) {
          // Only published services, sorted by sort_order
          const published = data
            .filter(s => !s.status || s.status === 'Publish')
            .sort((a, b) => (a.sort_order || 0) - (b.sort_order || 0));
          setServices(published.slice(0, 6));
        } else {
          setServices(STATIC_SERVICES);
        }
      })
      .catch(() => setServices(STATIC_SERVICES));
  }, []);

  const displayServices = services.length > 0 ? services : STATIC_SERVICES;

  return (
    <section className="services-preview">
      <div className="section-header">
        <span className="section-label">What We Do</span>
        <h2 className="section-title">Our <span>Core Services</span></h2>
        <p className="section-subtitle">
          From industrial automation to IoT — we deliver complete engineering solutions
          tailored to your operational needs.
        </p>
      </div>

      <div className="services-grid">
        {displayServices.map((svc, i) => (
          <div key={svc.id || i} className="service-card">
            <div className="service-card-icon">{getServiceIcon(svc.title)}</div>
            <h3>{svc.title}</h3>
            <p>{svc.short_description || svc.description}</p>
          </div>
        ))}
      </div>

      <div className="section-cta-center">
        <Link to="/services" className="btn-primary">
          View All Services <FaArrowRight />
        </Link>
      </div>
    </section>
  );
}

export default ServicesPreview;
