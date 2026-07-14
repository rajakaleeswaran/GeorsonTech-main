import React, { useState } from 'react';
import { FaCheckCircle } from 'react-icons/fa';

const ECOSYSTEM_CATEGORIES = [
  {
    id: 'engineering',
    name: 'Engineering',
    desc: 'Consulting, designs, capacity mapping, and custom sizing validation.',
    services: ['Engineering Consulting', 'Design & Build Solutions', 'Energy Audit & Capacity Planning'],
    sectors: ['Electrical Engineering', 'Solar & Renewable Energy', 'Infrastructure']
  },
  {
    id: 'epc',
    name: 'EPC & Projects',
    desc: 'Liaison setups, complete civil structures, and heavy cabling contracts.',
    services: ['EPC Contracts – Electrical, Civil & Mechanical', 'Liaison Works & Licensing'],
    sectors: ['Energy Sector', 'Materials Sector', 'Utilities']
  },
  {
    id: 'automation',
    name: 'Automation',
    desc: 'PLC logic programming, HMI screen mapping, and batch control systems.',
    services: ['Process Industry Solutions', 'Industrial Automation', 'Instrumentation', 'Pneumatic Systems'],
    sectors: ['Tyre Industries', 'Cement Industries', 'Food & Beverage', 'Pharmaceutical']
  },
  {
    id: 'installation',
    name: 'Installation',
    desc: 'Site positioning, hardware testing runs, and preventative check AMC logs.',
    services: ['Erection & Installation', 'Testing & Commissioning', 'Annual Maintenance Contracts (AMC)'],
    sectors: ['Coal, Mining & Material Handling', 'Marine Industries', 'Automobile']
  },
  {
    id: 'technology',
    name: 'Technology',
    desc: 'Smart IIoT edge portals, cloud data log maps, and custom dashboard software.',
    services: ['Industrial Internet of Things (IIoT)', 'Software Development', 'IIoT Monitoring Solutions'],
    sectors: ['Information Technology', 'Communication Services', 'Electronics & Assembly']
  },
  {
    id: 'support',
    name: 'Industrial Support',
    desc: 'Sourcing of specialized components, and dispatching skilled crews.',
    services: ['Manpower Services', 'Industrial Component Imports', 'Export of Panels'],
    sectors: ['Tool Industries', 'Consumer Products', 'Healthcare']
  }
];

function EcosystemInteractive() {
  const [activeEcosystem, setActiveEcosystem] = useState('engineering');
  const selectedEcoDetails = ECOSYSTEM_CATEGORIES.find(c => c.id === activeEcosystem);

  return (
    <section id="solutions-ecosystem" style={{ padding: '80px 20px', background: '#f1f5f9' }}>
      <div className="container" style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <div className="text-center" style={{ marginBottom: '50px' }}>
          <span className="section-label" style={{ color: '#0093DD' }}>Interactive Map</span>
          <h2 style={{ fontSize: '32px', fontWeight: '800', color: '#0f172a', margin: '10px 0' }}>Solutions & Industries Ecosystem</h2>
          <p style={{ color: '#64748b', fontSize: '15px', maxWidth: '650px', margin: '0 auto' }}>
            Select a category around our core node to dynamically view the associated engineering service lists and highlighted sectors.
          </p>
        </div>

        {/* Desktop Map Grid */}
        <div className="ecosystem-layout" style={{
          display: 'grid',
          gridTemplateColumns: '1.2fr 1fr',
          gap: '40px',
          alignItems: 'center'
        }}>
          
          {/* Visual Ecosystem Circles */}
          <div style={{
            position: 'relative',
            height: '420px',
            background: '#ffffff',
            borderRadius: '16px',
            border: '1px solid #e2e8f0',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 4px 6px rgba(0,0,0,0.02)'
          }}>
            {/* Center Core Circle */}
            <div style={{
              background: '#0f172a',
              color: '#ffffff',
              width: '150px',
              height: '150px',
              borderRadius: '50%',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '16px',
              textAlign: 'center',
              boxShadow: '0 0 25px rgba(0,147,221,0.3)',
              border: '3px solid #0093DD',
              zIndex: 10
            }}>
              <strong style={{ fontSize: '13px', color: '#0093DD', letterSpacing: '1px' }}>GEORSON TECH</strong>
              <span style={{ fontSize: '9px', color: '#94a3b8', marginTop: '6px', lineHeight: 1.2 }}>Engineering Excellence</span>
            </div>

            {/* 6 Surrounding category nodes */}
            {ECOSYSTEM_CATEGORIES.map((eco, idx) => {
              // Position nodes circularly
              const angle = (idx * 60 * Math.PI) / 180;
              const radius = 135; // Distance from center
              const left = `calc(50% + ${Math.cos(angle) * radius}px - 60px)`;
              const top = `calc(50% + ${Math.sin(angle) * radius}px - 26px)`;

              const active = activeEcosystem === eco.id;

              return (
                <button
                  key={eco.id}
                  onClick={() => setActiveEcosystem(eco.id)}
                  style={{
                    position: 'absolute',
                    left,
                    top,
                    width: '120px',
                    height: '52px',
                    borderRadius: '26px',
                    border: active ? '2px solid #0093DD' : '1px solid #cbd5e1',
                    background: active ? '#eff6ff' : '#ffffff',
                    color: active ? '#0093DD' : '#334155',
                    fontWeight: '700',
                    fontSize: '12.5px',
                    cursor: 'pointer',
                    boxShadow: active ? '0 4px 15px rgba(0,147,221,0.2)' : '0 2px 4px rgba(0,0,0,0.05)',
                    transition: 'all 0.3s ease',
                    zIndex: 5
                  }}
                >
                  {eco.name}
                </button>
              );
            })}
          </div>

          {/* Ecosystem details display card */}
          <div style={{
            background: '#ffffff',
            border: '1px solid #e2e8f0',
            borderRadius: '16px',
            padding: '40px 30px',
            boxShadow: '0 4px 10px rgba(0,0,0,0.02)',
            minHeight: '400px',
            display: 'flex',
            flexDirection: 'column'
          }}>
            <span style={{ fontSize: '11px', color: '#0093DD', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '1px' }}>
              Solution Category Details
            </span>
            <h3 style={{ fontSize: '24px', fontWeight: '800', color: '#0f172a', margin: '8px 0 12px' }}>
              {selectedEcoDetails?.name}
            </h3>
            <p style={{ fontSize: '14.5px', color: '#64748b', lineHeight: 1.6, marginBottom: '24px' }}>
              {selectedEcoDetails?.desc}
            </p>

            {/* Related services highlights */}
            <h4 style={{ fontSize: '14px', fontWeight: '700', color: '#0f172a', marginBottom: '12px' }}>
              Associated Services & Solutions:
            </h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 24px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {selectedEcoDetails?.services.map((srv, i) => (
                <li key={i} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13.5px', color: '#334155' }}>
                  <FaCheckCircle style={{ color: '#0093DD', flexShrink: 0 }} /> {srv}
                </li>
              ))}
            </ul>

            {/* Sectors highlighted */}
            <h4 style={{ fontSize: '14px', fontWeight: '700', color: '#0f172a', marginBottom: '12px' }}>
              Primary Target Sectors:
            </h4>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: 'auto' }}>
              {selectedEcoDetails?.sectors.map((sec, i) => (
                <span key={i} style={{ background: '#f1f5f9', color: '#475569', padding: '4px 10px', borderRadius: '4px', fontSize: '12px', fontWeight: '600' }}>
                  {sec}
                </span>
              ))}
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}

export default EcosystemInteractive;
