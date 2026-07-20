import React, { useState, useEffect } from "react"; 
import { FaCheckCircle, FaFilePdf, FaEnvelope, FaSearch, FaArrowRight } from "react-icons/fa";
import { Link } from "react-router-dom";
import "../../styles/Services.css";
import { fetchCollection, getAssetUrl } from "../../lib/dbHelper";

function ServicesBody() {
  const [services, setServices] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCollection('/services', 'services')
      .then(data => {
        if (Array.isArray(data)) {
          setServices(data);
        }
      })
      .catch(err => console.error("Failed to fetch services:", err))
      .finally(() => setLoading(false));
  }, []);

  // Filter based on search query
  const filteredServices = services.filter((svc) =>
    svc.title.toLowerCase().includes(search.toLowerCase()) ||
    (svc.short_description && svc.short_description.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="services-wrapper" style={{ padding: '60px 20px', background: '#FAFADA' }}>
      <div className="services-container" style={{ maxWidth: '1200px', margin: '0 auto' }}>

        {/* Search Filter */}
        <div className="services-search" style={{ display: 'flex', justifyContent: 'center', marginBottom: '40px' }}>
          <div style={{ position: 'relative', width: '100%', maxWidth: '500px' }}>
            <input
              type="text"
              placeholder="Search engineering & automation services..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{
                width: '100%',
                padding: '12px 20px 12px 45px',
                borderRadius: '30px',
                border: '1px solid #cbd5e1',
                fontSize: '14.5px',
                outline: 'none',
                boxShadow: '0 4px 6px rgba(0,0,0,0.02)'
              }}
            />
            <FaSearch style={{ position: 'absolute', left: '18px', top: '16px', color: '#94a3b8' }} />
          </div>
        </div>

        {loading ? (
          <p className="text-center" style={{ color: '#64748b' }}>Loading services...</p>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '30px' }}>
            {filteredServices.length > 0 ? (
              filteredServices.map((svc) => {
                // Parse features list
                let featureItems = [];
                if (svc.features) {
                  if (svc.features.startsWith('[') && svc.features.endsWith(']')) {
                    try {
                      featureItems = JSON.parse(svc.features);
                    } catch {
                      featureItems = svc.features.split(',');
                    }
                  } else {
                    featureItems = svc.features.split(',');
                  }
                }

                return (
                  <div 
                    className="services-card" 
                    key={svc.id}
                    style={{
                      background: '#ffffff',
                      borderRadius: '12px',
                      overflow: 'hidden',
                      boxShadow: '0 4px 6px rgba(0,0,0,0.05)',
                      border: '1px solid #e2e8f0',
                      transition: 'all 0.3s ease',
                      display: 'flex',
                      flexDirection: 'column'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'translateY(-5px)';
                      e.currentTarget.style.boxShadow = '0 10px 20px rgba(0,147,221,0.1)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'translateY(0)';
                      e.currentTarget.style.boxShadow = '0 4px 6px rgba(0,0,0,0.05)';
                    }}
                  >
                    {/* Service Image */}
                    <div style={{ height: '200px', width: '100%', overflow: 'hidden', background: '#e2e8f0' }}>
                      <img 
                        src={svc.image_path ? getAssetUrl(svc.image_path) : 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&q=80&w=600'} 
                        alt={svc.title} 
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      />
                    </div>

                    {/* Card Content */}
                    <div style={{ padding: '24px', flex: 1, display: 'flex', flexDirection: 'column' }}>
                      <h3 style={{ fontSize: '19px', fontWeight: '700', color: '#0f172a', marginBottom: '10px' }}>
                        {svc.title}
                      </h3>
                      <p style={{ fontSize: '14px', color: '#64748b', lineHeight: 1.6, marginBottom: '20px' }}>
                        {svc.short_description || svc.description}
                      </p>

                      {/* Features Checkbox list */}
                      {featureItems.length > 0 && (
                        <div style={{ marginBottom: '24px' }}>
                          <h4 style={{ fontSize: '13px', fontWeight: '600', color: '#334155', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '8px' }}>
                            Key Competencies:
                          </h4>
                          <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '6px' }}>
                            {featureItems.map((item, idx) => (
                              <li key={idx} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: '#475569' }}>
                                <FaCheckCircle style={{ color: '#0093DD', flexShrink: 0 }} /> {item.trim()}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {/* Action buttons */}
                      <div style={{ marginTop: 'auto', display: 'flex', gap: '10px', pt: '10px' }}>
                        <Link 
                          to={`/enquiry?tab=enquiry&service=${encodeURIComponent(svc.title)}`}
                          className="btn-primary" 
                          style={{
                            padding: '10px 16px',
                            fontSize: '12.5px',
                            flex: 1,
                            justifyContent: 'center',
                            gap: '6px'
                          }}
                        >
                          Enquire <FaEnvelope />
                        </Link>
                        {svc.pdf_brochure_path && (
                          <a 
                            href={getAssetUrl(svc.pdf_brochure_path)} 
                            target="_blank" 
                            rel="noopener noreferrer" 
                            className="btn-outline"
                            style={{
                              padding: '8px 16px',
                              fontSize: '12.5px',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              borderColor: '#e2e8f0',
                              color: '#64748b'
                            }}
                            title="Download Brochure"
                          >
                            <FaFilePdf /> PDF
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })
            ) : (
              <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '40px 0' }}>
                <p style={{ color: '#64748b' }}>No matching services found.</p>
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
}

export default ServicesBody;