import React from 'react';
import { Link } from 'react-router-dom';
import { FaArrowRight, FaCogs, FaIndustry, FaMicrochip, FaWifi, FaTools, FaProjectDiagram } from 'react-icons/fa';
import '../../styles/Home.css';

const SERVICES = [
  {
    icon: <FaIndustry />,
    title: "Industrial Engineering",
    description: "Complete industrial engineering solutions from design to implementation, covering electrical and mechanical systems.",
  },
  {
    icon: <FaCogs />,
    title: "Industrial Automation",
    description: "PLC, SCADA, DCS, and HMI-based automation systems for manufacturing and process industries.",
  },
  {
    icon: <FaWifi />,
    title: "IoT Solutions",
    description: "Smart connected systems that enable real-time monitoring, predictive maintenance, and data-driven decisions.",
  },
  {
    icon: <FaProjectDiagram />,
    title: "Electrical Panels",
    description: "LT/HT electrical panels, MCC, PCC, power distribution boards, and custom switchgear fabrication.",
  },
  {
    icon: <FaMicrochip />,
    title: "Manufacturing Solutions",
    description: "End-to-end manufacturing execution systems and production line automation for Industry 4.0.",
  },
  {
    icon: <FaTools />,
    title: "Engineering Consultancy",
    description: "Expert technical consultancy for plant layout, system design, energy audits, and compliance.",
  },
];

function ServicesPreview() {
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
        {SERVICES.map((svc, i) => (
          <div key={i} className="service-card">
            <div className="service-card-icon">{svc.icon}</div>
            <h3>{svc.title}</h3>
            <p>{svc.description}</p>
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
