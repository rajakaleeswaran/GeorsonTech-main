import React from 'react';
import { FaBuilding, FaIndustry, FaCogs, FaPhoneAlt, FaEnvelope, FaMapMarkerAlt, FaCompass } from 'react-icons/fa';
import OFFICE_LOCATIONS from '../../data/officeLocations';

function Locations() {
  const getOfficeIcon = (type) => {
    if (type?.includes('Manufacturing')) return <FaIndustry />;
    if (type?.includes('Service')) return <FaCogs />;
    return <FaBuilding />;
  };

  const getCityName = (address) => {
    if (address?.includes('Chennai')) return 'Chennai';
    if (address?.includes('Coimbatore')) return 'Coimbatore';
    return 'Tamil Nadu';
  };

  return (
    <section className="about-locations-section" style={{ padding: '80px 0', background: '#ffffff' }}>
      <div className="container">
        
        <div className="text-center" style={{ marginBottom: '50px' }}>
          <span className="section-label">Our Presence</span>
          <h2 className="section-title">Company <span>Locations</span></h2>
          <p className="section-subtitle">
            Operating from key industrial hubs in Tamil Nadu to support clients nationwide.
          </p>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '30px',
          marginTop: '40px'
        }}>
          {OFFICE_LOCATIONS.map((loc) => (
            <div key={loc.id} style={{
              background: '#f8fafc',
              border: '1px solid #e2e8f0',
              borderRadius: '12px',
              overflow: 'hidden',
              boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1), 0 2px 4px -1px rgba(0,0,0,0.06)',
              display: 'flex',
              flexDirection: 'column',
              transition: 'transform 0.3s ease, box-shadow 0.3s ease'
            }}
            className="location-card"
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-5px)';
              e.currentTarget.style.boxShadow = '0 10px 15px -3px rgba(0,0,0,0.1), 0 4px 6px -2px rgba(0,0,0,0.05)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 4px 6px -1px rgba(0,0,0,0.1), 0 2px 4px -1px rgba(0,0,0,0.06)';
            }}
            >
              {/* Map Header Clickable Overlay */}
              <div style={{ width: '100%', height: '200px', position: 'relative' }}>
                <a
                  href={loc.direct_map_link}
                  target="_blank"
                  rel="noopener noreferrer"
                  title={`Open ${loc.office_name} in Google Maps`}
                  style={{ display: 'block', width: '100%', height: '100%', position: 'relative' }}
                >
                  <iframe
                    title={`${loc.office_name} Map`}
                    src={loc.google_map_link}
                    width="100%"
                    height="100%"
                    style={{ border: 0, pointerEvents: 'none' }}
                    loading="lazy"
                  ></iframe>
                  <div style={{
                    position: 'absolute',
                    inset: 0,
                    zIndex: 10,
                    background: 'transparent'
                  }} />
                </a>
              </div>

              {/* Card Body */}
              <div style={{ padding: '24px', flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
                  <div style={{
                    background: '#e0f2fe',
                    color: '#0284c7',
                    width: '40px',
                    height: '40px',
                    borderRadius: '8px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '20px'
                  }}>
                    {getOfficeIcon(loc.office_type)}
                  </div>
                  <div>
                    <h3 style={{ fontSize: '18px', fontWeight: '700', color: '#0f172a', margin: 0 }}>
                      {loc.office_name}
                    </h3>
                    <span style={{ fontSize: '12px', fontWeight: '600', color: '#64748b', textTransform: 'uppercase' }}>
                      {getCityName(loc.address)}
                    </span>
                  </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '14px', color: '#475569', flexGrow: 1, marginBottom: '24px' }}>
                  <div style={{ display: 'flex', gap: '8px', alignItems: 'flex-start' }}>
                    <FaMapMarkerAlt style={{ color: '#0284c7', marginTop: '3px', flexShrink: 0 }} />
                    <span>{loc.address}</span>
                  </div>
                  <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                    <FaPhoneAlt style={{ color: '#0284c7', flexShrink: 0 }} />
                    <a href={`tel:${loc.phone}`} style={{ color: '#0f172a', fontWeight: '500' }}>{loc.phone}</a>
                  </div>
                  <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                    <FaEnvelope style={{ color: '#0284c7', flexShrink: 0 }} />
                    <a href={`mailto:${loc.email}`} style={{ color: '#0f172a', fontWeight: '500' }}>{loc.email}</a>
                  </div>
                </div>

                <a
                  href={loc.direct_map_link}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                    padding: '12px',
                    background: '#0284c7',
                    color: '#ffffff',
                    fontWeight: '600',
                    fontSize: '14px',
                    borderRadius: '8px',
                    textDecoration: 'none',
                    transition: 'background 0.2s ease',
                    marginTop: 'auto'
                  }}
                  onMouseEnter={(e) => e.target.style.background = '#0369a1'}
                  onMouseLeave={(e) => e.target.style.background = '#0284c7'}
                >
                  <FaCompass /> Get Directions
                </a>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}

export default Locations;
