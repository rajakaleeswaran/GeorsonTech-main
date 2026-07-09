import React from 'react';
import { FaQuoteLeft, FaStar, FaBuilding, FaIndustry, FaCogs, FaTint, FaBolt, FaCar } from 'react-icons/fa';
import "../../styles/Clients.css";

import ABB from "../../assets/Clients/ABB.png";
import AIRTRONIC from "../../assets/Clients/AIRTRONIC.jpeg";
import BARGA from "../../assets/Clients/BARGA.jpeg";
import CHAKR from "../../assets/Clients/CHAKR.png";
import DRMILTON from "../../assets/Clients/DRMILTON.jpeg";
import GILBARCO from "../../assets/Clients/GILBARCO.png";
import LECS from "../../assets/Clients/LECS.jpg";
import MARCUS from "../../assets/Clients/MARCUS.jpeg";
import NORBAR from "../../assets/Clients/NORBAR.png";
import RADIANT from "../../assets/Clients/RADIANT.png";
import RAMCO from "../../assets/Clients/RAMCO.jpeg";
import TitleBar from "../TitleBar";
import ClientsTitleImg from "../../assets/Clients/titleImg.png";

const clientsList = [
  { img: ABB, name: "ABB" },
  { img: AIRTRONIC, name: "AIRTRONIC" },
  { img: BARGA, name: "BARGA" },
  { img: CHAKR, name: "CHAKR" },
  { img: DRMILTON, name: "DRMILTON" },
  { img: GILBARCO, name: "GILBARCO" },
  { img: LECS, name: "LECS" },
  { img: MARCUS, name: "MARCUS" },
  { img: NORBAR, name: "NORBAR" },
  { img: RADIANT, name: "RADIANT" },
  { img: RAMCO, name: "RAMCO" },
];

const INDUSTRIES = [
  { icon: <FaIndustry />, title: "Manufacturing", desc: "Automating shop floors, assembly lines, and material handling systems." },
  { icon: <FaBolt />, title: "Power & Utilities", desc: "Advanced PCC/MCC panels and power distribution networks." },
  { icon: <FaTint />, title: "Water Treatment", desc: "Dosing system automation and telemetry solutions." },
  { icon: <FaCar />, title: "Automotive", desc: "Special purpose machinery and robotic assembly automation." },
  { icon: <FaCogs />, title: "Process Industries", desc: "SCADA systems for continuous control, temperature & pressure loops." },
];

const TESTIMONIALS = [
  {
    quote: "Georson Tech successfully delivered a complex PLC/SCADA integration for our manufacturing unit. Their engineering team is highly skilled and professional.",
    author: "Senior Engineering Manager",
    company: "ABB India",
    stars: 5
  },
  {
    quote: "The quality of electrical panel design and custom fabrication from Georson Tech is top-tier. Highly recommended for industrial projects.",
    author: "Technical Director",
    company: "Ramco Group",
    stars: 5
  },
  {
    quote: "Their IIoT solution helped us gain real-time visibility into machine downtime. Excellent post-commissioning service support.",
    author: "Plant Head",
    company: "LECS",
    stars: 5
  }
];

function ClientsBody() {
  return (
    <div className="clients-wrapper">
      <TitleBar title="CLIENTS" bg={ClientsTitleImg}/>

      <div className="clients-container">
        
        {/* Section 1: Logo Grid */}
        <div style={{ marginBottom: '90px' }}>
          <div className="clients-heading" style={{ justifyContent: 'center', marginBottom: '40px' }}>
            <div className="clients-heading-bar"></div>
            <h2 style={{ fontSize: '28px', fontWeight: '700', color: '#0f172a', margin: 0 }}>
              Our Prestigious Clients
            </h2>
          </div>
          <div className="clients-grid">
            {clientsList.map((client, index) => (
              <div
                className="clients-card"
                key={index}
                data-aos="fade-up"
              >
                <img src={client.img} alt={client.name} />
              </div>
            ))}
          </div>
        </div>

        {/* Section 2: Industries Served */}
        <div style={{ marginBottom: '90px', padding: '0 20px' }}>
          <div className="clients-heading" style={{ justifyContent: 'center', marginBottom: '40px' }}>
            <div className="clients-heading-bar"></div>
            <h2 style={{ fontSize: '28px', fontWeight: '700', color: '#0f172a', margin: 0 }}>
              Industries We Serve
            </h2>
          </div>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: '24px',
            marginTop: '30px'
          }}>
            {INDUSTRIES.map((ind, idx) => (
              <div key={idx} style={{
                background: '#ffffff',
                padding: '30px 24px',
                borderRadius: '12px',
                boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05), 0 2px 4px -1px rgba(0,0,0,0.03)',
                border: '1px solid #e2e8f0',
                textAlign: 'center',
                transition: 'all 0.3s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-5px)';
                e.currentTarget.style.boxShadow = '0 10px 15px -3px rgba(0,0,0,0.1)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 4px 6px -1px rgba(0,0,0,0.05)';
              }}
              >
                <div style={{
                  fontSize: '32px',
                  color: '#2563eb',
                  marginBottom: '16px',
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  background: '#eff6ff',
                  width: '64px',
                  height: '64px',
                  borderRadius: '50%'
                }}>
                  {ind.icon}
                </div>
                <h3 style={{ fontSize: '18px', fontWeight: '700', color: '#0f172a', marginBottom: '10px' }}>
                  {ind.title}
                </h3>
                <p style={{ fontSize: '14px', color: '#64748b', lineHeight: 1.5, margin: 0 }}>
                  {ind.desc}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Section 3: Testimonials */}
        <div style={{ padding: '0 20px' }}>
          <div className="clients-heading" style={{ justifyContent: 'center', marginBottom: '40px' }}>
            <div className="clients-heading-bar"></div>
            <h2 style={{ fontSize: '28px', fontWeight: '700', color: '#0f172a', margin: 0 }}>
              Client Testimonials
            </h2>
          </div>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '30px',
            marginTop: '30px'
          }}>
            {TESTIMONIALS.map((test, idx) => (
              <div key={idx} style={{
                background: '#ffffff',
                padding: '36px 30px',
                borderRadius: '16px',
                boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)',
                border: '1px solid #e2e8f0',
                position: 'relative'
              }}>
                <FaQuoteLeft style={{
                  position: 'absolute',
                  top: '24px',
                  left: '24px',
                  fontSize: '36px',
                  color: '#eff6ff',
                  zIndex: 0
                }} />
                
                <div style={{ position: 'relative', zIndex: 1 }}>
                  {/* Star Rating */}
                  <div style={{ display: 'flex', gap: '4px', marginBottom: '16px', color: '#fbbf24' }}>
                    {[...Array(test.stars)].map((_, i) => <FaStar key={i} />)}
                  </div>
                  
                  <p style={{ fontSize: '15px', color: '#475569', lineHeight: 1.6, fontStyle: 'italic', marginBottom: '24px' }}>
                    "{test.quote}"
                  </p>

                  <div>
                    <h4 style={{ fontSize: '16px', fontWeight: '700', color: '#0f172a', margin: '0 0 2px' }}>
                      {test.author}
                    </h4>
                    <span style={{ fontSize: '13px', fontWeight: '500', color: '#64748b' }}>
                      {test.company}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}

export default ClientsBody;