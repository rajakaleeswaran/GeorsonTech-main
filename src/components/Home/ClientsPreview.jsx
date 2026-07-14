import React, { useState, useEffect } from 'react';
import '../../styles/Home.css';

const DEFAULT_CLIENTS = [
  "BHEL", "L&T", "Siemens", "ABB", "Schneider Electric",
  "Honeywell", "Rockwell", "Emerson", "GE Industrial", "Yokogawa",
  "BHEL", "L&T", "Siemens", "ABB", "Schneider Electric",
  "Honeywell", "Rockwell", "Emerson", "GE Industrial", "Yokogawa",
];

function ClientsPreview() {
  const [clients, setClients] = useState([]);

  useEffect(() => {
    fetch('http://localhost:5000/api/clients')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          // Filter for Prestigious Clients only (category === 'Client' or null/default)
          const filtered = data.filter(c => c.status === 'Publish' && (c.category === 'Client' || !c.category));
          setClients(filtered);
        }
      })
      .catch(err => console.error("Failed to load marquee clients:", err));
  }, []);

  // Determine what to display (database logos or fallback text labels)
  const displayItems = clients.length > 0 ? clients : null;

  return (
    <section className="clients-preview">
      <h2 className="clients-preview-title">
        Trusted by Industry Leaders
      </h2>

      <div className="clients-logo-marquee">
        <div className="clients-logo-track">
          {displayItems ? (
            // Double the list to support smooth loop scrolling in CSS marquee
            [...displayItems, ...displayItems].map((c, i) => (
              <div key={i} className="client-logo-item" style={{ background: 'white', padding: '10px 15px', borderRadius: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <img 
                  src={`http://localhost:5000/${c.logo_path}`} 
                  alt={c.name} 
                  style={{ maxHeight: '35px', maxWidth: '110px', objectFit: 'contain' }} 
                />
              </div>
            ))
          ) : (
            DEFAULT_CLIENTS.map((name, i) => (
              <div key={i} className="client-logo-item">
                <span>{name}</span>
              </div>
            ))
          )}
        </div>
      </div>
    </section>
  );
}

export default ClientsPreview;
