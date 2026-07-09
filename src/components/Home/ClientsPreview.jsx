import React from 'react';
import '../../styles/Home.css';

// Client names (replace with logo images when available)
const CLIENTS = [
  "BHEL", "L&T", "Siemens", "ABB", "Schneider Electric",
  "Honeywell", "Rockwell", "Emerson", "GE Industrial", "Yokogawa",
  "BHEL", "L&T", "Siemens", "ABB", "Schneider Electric",
  "Honeywell", "Rockwell", "Emerson", "GE Industrial", "Yokogawa",
];

function ClientsPreview() {
  return (
    <section className="clients-preview">
      <h2 className="clients-preview-title">
        Trusted by Industry Leaders
      </h2>

      <div className="clients-logo-marquee">
        <div className="clients-logo-track">
          {CLIENTS.map((name, i) => (
            <div key={i} className="client-logo-item">
              <span>{name}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default ClientsPreview;
