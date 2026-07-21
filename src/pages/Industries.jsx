import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { FaCheckCircle, FaFileInvoiceDollar } from 'react-icons/fa';
import TitleBar from '../components/TitleBar';
import ServicesTitleImg from '../assets/Services/titleImg.png';
import SectorsGrid from '../components/Industries/SectorsGrid';
import EcosystemInteractive from '../components/Industries/EcosystemInteractive';
import SolutionsTaxonomy from '../components/Industries/SolutionsTaxonomy';
import { API_BASE_URL, getAssetUrl } from '../lib/api';


function Industries() {
  const [relatedProducts, setRelatedProducts] = useState([]);

  useEffect(() => {
    // Scroll to top on load
    window.scrollTo(0, 0);

    // Fetch dynamic products to show related products
    fetch(`${API_BASE_URL}/products`)
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          setRelatedProducts(data.slice(0, 3));
        }
      })
      .catch(() => {});
  }, []);


  return (
    <>
      <Helmet>
        <title>Solutions & Sector Diversity – Georson Tech Pvt. Ltd</title>
        <meta name="description" content="Explore Georson Tech's comprehensive Solutions Ecosystem: Automation, EPC Contracts, Engineering Consulting, Technology, and Sector Diversity serving 20+ industries." />
        <link rel="canonical" href="https://www.georsontech.com/industries" />
      </Helmet>

      <div className="industries-page" style={{ background: '#f8fafc', minHeight: '100vh' }}>
        
        {/* HERO SECTION */}
        <section className="industries-hero" style={{
          position: 'relative',
          padding: '120px 20px',
          background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.95), rgba(15, 23, 42, 0.85)), url("https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80&w=1600") no-repeat center/cover',
          color: '#ffffff',
          textAlign: 'center',
          borderBottom: '4px solid #0093DD'
        }}>
          {/* Blue Overlay Tint */}
          <div style={{
            position: 'absolute',
            inset: 0,
            background: 'radial-gradient(circle, rgba(0,147,221,0.2) 0%, transparent 80%)',
            zIndex: 1
          }} />
          <div className="container" style={{ position: 'relative', zIndex: 2, maxWidth: '900px', margin: '0 auto' }}>
            <span className="section-label" style={{ background: '#0093DD', color: '#fff', padding: '6px 16px', borderRadius: '20px', fontSize: '12px', fontWeight: '700', letterSpacing: '1px', textTransform: 'uppercase' }}>
              Our Solutions & Sector Diversity
            </span>
            <h1 style={{ fontSize: '42px', fontWeight: '800', fontFamily: 'Outfit, sans-serif', marginTop: '20px', marginBottom: '20px', lineHeight: 1.2 }}>
              Engineering Excellence <span style={{ color: '#0093DD' }}>Across Sectors</span>
            </h1>
            <p style={{ fontSize: '16.5px', color: '#cbd5e1', lineHeight: 1.7, marginBottom: '35px' }}>
              Georson Tech delivers comprehensive engineering, industrial, automation, electrical, mechanical, technology, and project execution solutions across diverse industries. From engineering consultation and system design to installation, commissioning, automation, and lifecycle support, we provide reliable solutions tailored to every industry’s operational requirements.
            </p>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '15px', flexWrap: 'wrap' }}>
              <a href="#industries-grid" className="btn-primary" style={{ padding: '14px 28px', background: '#0093DD', border: '2px solid #0093DD', color: '#fff', borderRadius: '6px', fontWeight: '600', textDecoration: 'none', display: 'inline-flex', alignItems: 'center' }}>
                Explore Industries
              </a>
              <a href="#solutions-ecosystem" style={{ padding: '14px 28px', color: '#fff', border: '2px solid #ffffff', borderRadius: '6px', fontWeight: '600', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', background: 'rgba(255,255,255,0.08)', backdropFilter: 'blur(4px)' }}>
                Explore Our Solutions
              </a>
              <Link to="/enquiry" style={{ padding: '14px 28px', background: 'transparent', border: '2px solid #0093DD', color: '#0093DD', borderRadius: '6px', fontWeight: '600', textDecoration: 'none', display: 'inline-flex', alignItems: 'center' }}>
                Talk to Our Experts
              </Link>
            </div>
          </div>
        </section>

        {/* SECTION 1: INDUSTRIES WE SERVE */}
        <SectorsGrid />

        {/* SECTION 2: INTERACTIVE ECOSYSTEM MAP */}
        <EcosystemInteractive />

        {/* SECTION 3: ORGANIZED CATEGORIES (A TO H) */}
        <SolutionsTaxonomy />

        {/* SECTION 4: ENERGY AUDIT & CAPACITY PLANNING */}
        <section style={{
          padding: '80px 20px',
          background: 'linear-gradient(135deg, #0f172a, #1e293b)',
          color: '#ffffff',
          position: 'relative'
        }}>
          <div className="container" style={{ maxWidth: '1000px', margin: '0 auto', position: 'relative', zIndex: 2 }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '40px', alignItems: 'center' }}>
              <div>
                <span className="section-label" style={{ background: '#0093DD', color: '#fff', padding: '4px 12px', borderRadius: '4px', fontSize: '11px', fontWeight: 'bold' }}>
                  Audits & Consultation
                </span>
                <h2 style={{ fontSize: '32px', fontWeight: '800', color: '#ffffff', marginTop: '12px', marginBottom: '16px' }}>
                  Energy Audit & Capacity Planning
                </h2>
                <p style={{ fontSize: '15px', color: '#cbd5e1', lineHeight: 1.6, marginBottom: '24px' }}>
                  Improve operational efficiency, optimize energy consumption, and prepare your infrastructure for future growth with our professional energy auditing and capacity-planning solutions.
                </p>

                <div style={{ display: 'flex', gap: '15px' }}>
                  <Link 
                    to="/enquiry?subject=Energy%20Audit%20Assessment&service=Engineering%20Consultancy"
                    className="btn-primary" 
                    style={{ background: '#0093DD', border: 'none', padding: '14px 28px' }}
                  >
                    Request an Energy Assessment
                  </Link>
                </div>
              </div>

              {/* Service Highlights list */}
              <div style={{
                background: 'rgba(255,255,255,0.05)',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: '12px',
                padding: '24px 30px'
              }}>
                <h4 style={{ fontSize: '15px', color: '#ffffff', fontWeight: '700', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <FaFileInvoiceDollar style={{ color: '#0093DD' }} /> Service Highlights
                </h4>
                <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {[
                    "Energy consumption assessment",
                    "Electrical load analysis",
                    "Energy efficiency evaluation",
                    "Capacity utilization analysis",
                    "Power quality assessment",
                    "Infrastructure capacity planning",
                    "Energy-saving recommendations",
                    "Operational cost optimization",
                    "Future expansion planning"
                  ].map((hl, i) => (
                    <li key={i} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13.5px', color: '#cbd5e1' }}>
                      <FaCheckCircle style={{ color: '#0093DD', flexShrink: 0 }} /> {hl}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 5: RELATED PRODUCTS */}
        {relatedProducts.length > 0 && (
          <section style={{ padding: '80px 20px', background: '#ffffff' }}>
            <div className="container" style={{ maxWidth: '1200px', margin: '0 auto' }}>
              <div className="text-center" style={{ marginBottom: '40px' }}>
                <h2 style={{ fontSize: '28px', fontWeight: '800', color: '#0f172a' }}>Related Systems & Hardware</h2>
                <p style={{ color: '#64748b', fontSize: '14.5px' }}>Check out products from our catalogs configured for sector applications.</p>
              </div>

              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                gap: '24px'
              }}>
                {relatedProducts.map(prod => (
                  <div key={prod.id} style={{
                    background: '#ffffff',
                    border: '1px solid #e2e8f0',
                    borderRadius: '8px',
                    overflow: 'hidden',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.02)'
                  }}>
                    <div style={{ height: '180px', background: '#f1f5f9' }}>
                      <img src={getAssetUrl(prod.image_path)} alt={prod.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />

                    </div>
                    <div style={{ padding: '20px' }}>
                      <h4 style={{ fontSize: '16px', fontWeight: '700', color: '#0f172a', margin: '0 0 10px' }}>{prod.name}</h4>
                      <p style={{ fontSize: '13px', color: '#64748b', height: '40px', overflow: 'hidden', marginBottom: '15px' }}>{prod.description}</p>
                      <Link to="/products" style={{ fontSize: '12.5px', color: '#0093DD', fontWeight: '700', textDecoration: 'none' }}>
                        Browse Products Catalog →
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

      </div>
    </>
  );
}

export default Industries;
