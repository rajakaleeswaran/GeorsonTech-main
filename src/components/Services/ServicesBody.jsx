import React, { useState, useEffect } from "react"; 
import { FaCheckCircle, FaFilePdf, FaEnvelope, FaSearch, FaInfoCircle, FaTimes } from "react-icons/fa";
import { Link, useParams, useNavigate } from "react-router-dom";
import "../../styles/Services.css";
import { fetchCollection, getAssetUrl } from "../../lib/dbHelper";

function ServicesBody() {
  const { slug } = useParams();
  const navigate = useNavigate();

  const [services, setServices] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [selectedService, setSelectedService] = useState(null);

  useEffect(() => {
    fetchCollection('/services', 'services')
      .then(data => {
        if (Array.isArray(data)) {
          // Sort strictly by sort_order ascending (1, 10, 20, 30, 40, 50, 60)
          const sorted = [...data].sort((a, b) => (Number(a.sort_order) || 0) - (Number(b.sort_order) || 0));
          setServices(sorted);

          // Auto-open modal if slug route param is present
          if (slug) {
            const match = sorted.find(s => s.slug === slug || String(s.id) === String(slug));
            if (match) setSelectedService(match);
          }
        }
      })
      .catch(err => console.error("Failed to fetch services:", err))
      .finally(() => setLoading(false));
  }, [slug]);

  // Filter based on search query safely handling title or name
  const filteredServices = services.filter((svc) => {
    if (!svc) return false;
    const titleText = (svc.title || svc.name || "").toLowerCase();
    const descText = (svc.short_description || svc.description || "").toLowerCase();
    const query = search.toLowerCase();
    return titleText.includes(query) || descText.includes(query);
  });

  const openServiceDetails = (svc) => {
    setSelectedService(svc);
    if (svc.slug) {
      window.history.pushState(null, '', `/services/${svc.slug}`);
    }
  };

  const closeServiceDetails = () => {
    setSelectedService(null);
    if (slug) {
      navigate('/services');
    }
  };

  return (
    <div className="services-wrapper" style={{ padding: '60px 20px', background: '#FAFAFA' }}>
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

                const brochureUrl = (svc.pdf_brochure_path || svc.brochure_path)
                  ? getAssetUrl(svc.pdf_brochure_path || svc.brochure_path, 'brochure')
                  : null;

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
                      flexDirection: 'column',
                      cursor: 'pointer'
                    }}
                    onClick={() => openServiceDetails(svc)}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'translateY(-5px)';
                      e.currentTarget.style.boxShadow = '0 10px 20px rgba(0,147,221,0.12)';
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
                        {svc.title || svc.name}
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
                            {featureItems.slice(0, 4).map((item, idx) => (
                              <li key={idx} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: '#475569' }}>
                                <FaCheckCircle style={{ color: '#0093DD', flexShrink: 0 }} /> {item.trim()}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {/* Action buttons */}
                      <div style={{ marginTop: 'auto', display: 'flex', gap: '8px', flexWrap: 'wrap' }} onClick={e => e.stopPropagation()}>
                        <button
                          onClick={() => openServiceDetails(svc)}
                          style={{
                            padding: '9px 12px',
                            fontSize: '12.5px',
                            background: '#0093DD',
                            color: '#ffffff',
                            border: 'none',
                            borderRadius: '6px',
                            cursor: 'pointer',
                            fontWeight: '600',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '5px'
                          }}
                        >
                          <FaInfoCircle /> Details
                        </button>
                        <Link 
                          to={`/enquiry?tab=enquiry&service=${encodeURIComponent(svc.title || svc.name)}`}
                          className="btn-primary" 
                          style={{
                            padding: '9px 12px',
                            fontSize: '12.5px',
                            flex: 1,
                            justifyContent: 'center',
                            gap: '5px',
                            textDecoration: 'none',
                            display: 'flex',
                            alignItems: 'center',
                            borderRadius: '6px'
                          }}
                        >
                          Enquire <FaEnvelope />
                        </Link>
                        {brochureUrl && (
                          <a 
                            href={brochureUrl} 
                            target="_blank" 
                            rel="noopener noreferrer" 
                            className="btn-outline"
                            style={{
                              padding: '8px 12px',
                              fontSize: '12.5px',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              borderColor: '#ef4444',
                              color: '#ef4444',
                              borderRadius: '6px',
                              fontWeight: '600',
                              textDecoration: 'none',
                              gap: '4px'
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

      {/* Detailed Service Explanation Modal Window */}
      {selectedService && (() => {
        let featureItems = [];
        if (selectedService.features) {
          if (selectedService.features.startsWith('[') && selectedService.features.endsWith(']')) {
            try {
              featureItems = JSON.parse(selectedService.features);
            } catch {
              featureItems = selectedService.features.split(',');
            }
          } else {
            featureItems = selectedService.features.split(',');
          }
        }

        const modalBrochureUrl = (selectedService.pdf_brochure_path || selectedService.brochure_path)
          ? getAssetUrl(selectedService.pdf_brochure_path || selectedService.brochure_path, 'brochure')
          : null;

        return (
          <div style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(15, 23, 42, 0.7)',
            backdropFilter: 'blur(4px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 99999,
            padding: '20px'
          }}>
            <div style={{
              background: '#ffffff',
              borderRadius: '16px',
              maxWidth: '700px',
              width: '100%',
              maxHeight: '90vh',
              overflowY: 'auto',
              boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)',
              position: 'relative'
            }}>
              {/* Close Button */}
              <button 
                onClick={closeServiceDetails}
                style={{
                  position: 'absolute',
                  top: '20px',
                  right: '20px',
                  background: '#f1f5f9',
                  border: 'none',
                  borderRadius: '50%',
                  width: '36px',
                  height: '36px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  zIndex: 10
                }}
              >
                <FaTimes style={{ color: '#64748b' }} />
              </button>

              {/* Service Header Image */}
              <div style={{ height: '260px', width: '100%', background: '#e2e8f0' }}>
                <img 
                  src={selectedService.image_path ? getAssetUrl(selectedService.image_path) : 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&q=80&w=800'} 
                  alt={selectedService.title} 
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              </div>

              {/* Modal Content */}
              <div style={{ padding: '30px' }}>
                <h2 style={{ fontSize: '24px', fontWeight: '800', color: '#0f172a', marginBottom: '12px' }}>
                  {selectedService.title || selectedService.name}
                </h2>
                
                <p style={{ fontSize: '15px', color: '#0093DD', fontWeight: '600', lineHeight: 1.6, marginBottom: '20px' }}>
                  {selectedService.short_description || selectedService.description}
                </p>

                {/* Detailed Description */}
                {selectedService.detailed_description && (
                  <div style={{ marginBottom: '24px' }}>
                    <h4 style={{ fontSize: '15px', fontWeight: '700', color: '#0f172a', marginBottom: '10px' }}>
                      Detailed Service Overview:
                    </h4>
                    <p style={{ fontSize: '14.5px', color: '#475569', lineHeight: 1.7, whiteSpace: 'pre-line' }}>
                      {selectedService.detailed_description}
                    </p>
                  </div>
                )}

                {/* Key Features & Capabilities */}
                {featureItems.length > 0 && (
                  <div style={{ marginBottom: '28px' }}>
                    <h4 style={{ fontSize: '15px', fontWeight: '700', color: '#0f172a', marginBottom: '12px' }}>
                      Core Technical Capabilities:
                    </h4>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '10px' }}>
                      {featureItems.map((item, idx) => (
                        <div key={idx} style={{ background: '#f8fafc', padding: '10px 14px', borderRadius: '8px', border: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', gap: '10px', fontSize: '13.5px', color: '#334155' }}>
                          <FaCheckCircle style={{ color: '#0093DD', flexShrink: 0 }} />
                          <span>{item.trim()}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Actions */}
                <div style={{ display: 'flex', gap: '15px', flexWrap: 'wrap', pt: '10px' }}>
                  <Link 
                    to={`/enquiry?tab=enquiry&service=${encodeURIComponent(selectedService.title || selectedService.name)}`}
                    className="btn-primary" 
                    style={{ background: '#0093DD', border: 'none', padding: '12px 24px', fontSize: '14px', display: 'flex', alignItems: 'center', gap: '8px', textDecoration: 'none', borderRadius: '6px', fontWeight: '600' }}
                    onClick={closeServiceDetails}
                  >
                    <FaEnvelope /> Request Service Consultation
                  </Link>
                  {modalBrochureUrl && (
                    <a 
                      href={modalBrochureUrl} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="btn-outline"
                      style={{ borderColor: '#ef4444', color: '#ef4444', padding: '12px 24px', fontSize: '14px', display: 'flex', alignItems: 'center', gap: '8px', textDecoration: 'none', borderRadius: '6px', fontWeight: '600' }}
                    >
                      <FaFilePdf /> Download Service Brochure
                    </a>
                  )}
                </div>
              </div>
            </div>
          </div>
        );
      })()}
    </div>
  );
}

export default ServicesBody;