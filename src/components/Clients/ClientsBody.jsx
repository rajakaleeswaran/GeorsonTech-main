import React, { useState, useEffect } from 'react';
import { FaQuoteLeft, FaStar, FaBuilding, FaIndustry, FaCogs, FaTint, FaBolt, FaCar } from 'react-icons/fa';
import { fetchCollection, getAssetUrl } from '../../lib/dbHelper';
import "../../styles/Clients.css";
import TitleBar from "../TitleBar";
import ClientsTitleImg from "../../assets/Clients/titleImg.png";

const FALLBACK_CLIENTS = [
  { id: 1, name: "ABB", logo_path: "uploads/images/ABB.png" },
  { id: 2, name: "AIRTRONIC", logo_path: "uploads/images/AIRTRONIC.jpeg" },
  { id: 3, name: "BARGA", logo_path: "uploads/images/BARGA.jpeg" },
  { id: 4, name: "CHAKR", logo_path: "uploads/images/CHAKR.png" },
  { id: 5, name: "DRMILTON", logo_path: "uploads/images/DRMILTON.jpeg" },
  { id: 6, name: "GILBARCO", logo_path: "uploads/images/GILBARCO.png" },
  { id: 7, name: "LECS", logo_path: "uploads/images/LECS.jpg" },
  { id: 8, name: "MARCUS", logo_path: "uploads/images/MARCUS.jpeg" },
  { id: 9, name: "NORBAR", logo_path: "uploads/images/NORBAR.png" },
  { id: 10, name: "RADIANT", logo_path: "uploads/images/RADIANT.png" },
  { id: 11, name: "RAMCO", logo_path: "uploads/images/RAMCO.jpeg" }
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
  const [clients, setClients] = useState(FALLBACK_CLIENTS);

  useEffect(() => {
    fetchCollection('/clients', 'clients')
      .then(data => {
        if (Array.isArray(data)) {
          const filtered = data.filter(c => c.category === 'Client' || !c.category);
          if (filtered.length > 0) {
            setClients(filtered);
          }
        }
      })
      .catch(err => console.error("Failed to load clients list from API:", err));
  }, []);

  return (
    <div className="clients-wrapper">
      <TitleBar title="CLIENTS" bg={ClientsTitleImg}/>

      <div className="clients-container">
        
        {/* Section 1: Logo Grid */}
        <div style={{ marginBottom: '90px' }}>
          <div className="clients-heading" style={{ display: 'flex', justifyContent: 'center', marginBottom: '40px' }}>
            <div className="clients-heading-bar"></div>
            <h2 style={{ fontSize: '28px', fontWeight: '700', color: '#0f172a', margin: 0 }}>
              Our Prestigious Clients
            </h2>
          </div>
          <div className="clients-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: '20px' }}>
            {clients.map((client, index) => (
              <div
                className="clients-card"
                key={client.id || index}
                style={{
                  background: '#ffffff',
                  border: '1px solid #e2e8f0',
                  borderRadius: '8px',
                  height: '100px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: '15px',
                  boxShadow: '0 2px 4px rgba(0,0,0,0.02)'
                }}
              >
                <img 
                  src={getAssetUrl(client.logo_path)} 
                  alt={client.name} 
                  style={{
                    maxWidth: '100%',
                    maxHeight: '100%',
                    objectFit: 'contain'
                  }}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Section 2: Industries Served */}
        <div style={{ marginBottom: '90px', padding: '0 20px' }}>
          <div className="clients-heading" style={{ display: 'flex', justifyContent: 'center', marginBottom: '40px' }}>
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
                  color: '#0093DD',
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
        <div style={{ padding: '0 20px', marginBottom: '40px' }}>
          <div className="clients-heading" style={{ display: 'flex', justifyContent: 'center', marginBottom: '40px' }}>
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