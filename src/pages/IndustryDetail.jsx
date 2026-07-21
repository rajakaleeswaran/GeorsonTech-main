import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { useParams, Link } from 'react-router-dom';
import { FaArrowLeft, FaCheckCircle, FaExclamationTriangle, FaLightbulb, FaEnvelope, FaTools } from 'react-icons/fa';
import TitleBar from '../components/TitleBar';
import ServicesTitleImg from '../assets/Services/titleImg.png';
import { supabase } from '../lib/supabase';
import { getAssetUrl } from '../lib/dbHelper';
import { API_BASE_URL } from '../lib/api';

// Fallback challenges and capabilities depending on industry sector slug
const SECTOR_METADATA = {
  'electrical-engineering': {
    challenges: ["Voltage drops and energy leakage in long-distance busbars.", "High harmonics from variable speed machinery overheating transformers.", "Complex cable tray layouts causing electromagnetic interference (EMI)."],
    capabilities: ["Complete PCC & MCC panels layout mapping.", "Harmonic audit reporting & power factor correction installations.", "High-voltage cabling insulation runs and CEIG licensing support."]
  },
  'cement': {
    challenges: ["Heavy dust particles causing mechanical friction and sensor failure.", "Extreme heat in rotary kilns leading to thermal stress in motors.", "Unscheduled downtime in limestone crushers impacting kiln feed."],
    capabilities: ["IP65-certified electrical panels with dust filters.", "Rotary kiln telemetry loops & thermal scan integration.", "Predictive vibration logging on heavy conveyor motor drives."]
  },
  'marine': {
    challenges: ["Corrosive saline air damaging copper switchgear components.", "Vessel rolls causing mechanical vibrations on electronic breakers.", "Strict marine certifications (ABS, DNV, IRS) required for components."],
    capabilities: ["Marine-grade stainless steel enclosures (SS316).", "Vibration-damped panel mounts & engine safety shutdowns.", "Certification support and Lloyds-compliant electrical test runs."]
  }
};

function IndustryDetail() {
  const { slug } = useParams();
  const [industry, setIndustry] = useState(null);
  const [solutions, setSolutions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const fetchIndustry = async () => {
      // 1. Try local backend
      try {
        const res = await fetch(`${API_BASE_URL}/industries/${slug}`);
        if (res.ok) {
          const data = await res.json();
          if (isMounted) setIndustry(data);
          
          try {
            const solRes = await fetch(`${API_BASE_URL}/solutions?industry=${data.id}`);
            if (solRes.ok) {
              const solData = await solRes.json();
              if (Array.isArray(solData) && isMounted) setSolutions(solData);
            }
          } catch (_e) {
            // Solutions fetch failure handled gracefully
          }
          if (isMounted) setLoading(false);
          return;
        }
      } catch (_err) {
        console.warn("Local backend down. Querying Supabase for industry details.");
      }


      // 2. Supabase Fallback
      const { data: indData, error } = await supabase
        .from('industries')
        .select('*')
        .eq('slug', slug)
        .single();

      if (!error && indData) {
        setIndustry(indData);

        // Fetch solutions
        const { data: solData, error: solError } = await supabase
          .from('solutions')
          .select('*');
        
        if (!solError && solData) {
          const filteredSolutions = solData.filter(sol => {
            try {
              const ids = typeof sol.industry_ids === 'string' ? JSON.parse(sol.industry_ids) : sol.industry_ids;
              return Array.isArray(ids) && ids.includes(indData.id);
            } catch {
              return false;
            }
          });
          setSolutions(filteredSolutions);
        }
      } else {
        setIndustry(null);
      }
      if (isMounted) setLoading(false);
    };

    fetchIndustry();
    return () => {
      isMounted = false;
    };
  }, [slug]);


  if (loading) {
    return (
      <div style={{ padding: '100px 20px', textAlign: 'center' }}>
        <p style={{ color: '#64748b' }}>Loading industry solutions...</p>
      </div>
    );
  }

  if (!industry) {
    return (
      <div style={{ padding: '100px 20px', textAlign: 'center' }}>
        <h2>Sector Not Found</h2>
        <p style={{ marginTop: '15px', color: '#64748b' }}>We could not find the industry sector you requested.</p>
        <Link to="/industries" style={{ color: '#0093DD', marginTop: '20px', display: 'inline-block', fontWeight: 'bold' }}>
          ← Back to Sectors
        </Link>
      </div>
    );
  }

  // Get challenges metadata
  const meta = SECTOR_METADATA[slug] || {
    challenges: [
      "Process efficiency bottlenecks and legacy instrumentation limits.",
      "High power consumption during peak load operations.",
      "Regulatory compliance audits and safety interlock demands."
    ],
    capabilities: [
      "Bespoke system design and site layout planning.",
      "Deployment of custom automation algorithms and telemetry loops.",
      "Complete documentation, wiring testing, and annual AMC support."
    ]
  };

  return (
    <>
      <Helmet>
        <title>{industry.name} Solutions – Georson Tech</title>
        <meta name="description" content={`Georson Tech provides dynamic industrial engineering, panels fabrication, and PLC programming solutions for ${industry.name}.`} />
        <link rel="canonical" href={`https://www.georsontech.com/industries/${slug}`} />
      </Helmet>

      <TitleBar title={industry.name.toUpperCase()} bg={ServicesTitleImg} />

      <div style={{ background: '#f8fafc', padding: '60px 20px', minHeight: '100vh' }}>
        <div className="container" style={{ maxWidth: '1000px', margin: '0 auto' }}>
          
          <Link to="/industries" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', color: '#0093DD', fontWeight: '700', textDecoration: 'none', marginBottom: '30px' }}>
            <FaArrowLeft /> Back to Solutions & Sectors
          </Link>

          <div style={{
            background: '#ffffff',
            border: '1px solid #e2e8f0',
            borderRadius: '16px',
            overflow: 'hidden',
            boxShadow: '0 4px 6px rgba(0,0,0,0.02)',
            padding: '40px'
          }}>
            
            {/* Header Image */}
            <div style={{ height: '320px', borderRadius: '12px', overflow: 'hidden', marginBottom: '35px', background: '#cbd5e1' }}>
              <img 
                src={industry.image_path ? getAssetUrl(industry.image_path) : 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80&w=800'} 
                alt={industry.name} 
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            </div>

            {/* Overview */}
            <div style={{ marginBottom: '40px' }}>
              <span className="section-label" style={{ color: '#0093DD' }}>Overview</span>
              <h2 style={{ fontSize: '26px', fontWeight: '800', color: '#0f172a', margin: '10px 0 16px' }}>{industry.name}</h2>
              <p style={{ fontSize: '15px', color: '#475569', lineHeight: 1.7 }}>
                {industry.detailed_description || industry.description}
              </p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px', marginBottom: '40px' }}>
              {/* Challenges */}
              <div style={{ background: '#fff1f2', border: '1px solid #ffe4e6', borderRadius: '12px', padding: '24px 30px' }}>
                <h4 style={{ fontSize: '16px', fontWeight: '700', color: '#be123c', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <FaExclamationTriangle /> Industry Challenges
                </h4>
                <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {meta.challenges.map((ch, i) => (
                    <li key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', fontSize: '13.5px', color: '#4f111e' }}>
                      <span style={{ color: '#be123c', fontWeight: 'bold' }}>•</span> {ch}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Capabilities */}
              <div style={{ background: '#eff6ff', border: '1px solid #dbeafe', borderRadius: '12px', padding: '24px 30px' }}>
                <h4 style={{ fontSize: '16px', fontWeight: '700', color: '#1e40af', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <FaTools /> Project Capabilities
                </h4>
                <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {meta.capabilities.map((cap, i) => (
                    <li key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', fontSize: '13.5px', color: '#1e3a8a' }}>
                      <FaCheckCircle style={{ color: '#0093DD', marginTop: '3px', flexShrink: 0 }} /> {cap}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Mapped Georson Tech Solutions */}
            {solutions.length > 0 && (
              <div style={{ marginBottom: '40px' }}>
                <h4 style={{ fontSize: '17px', fontWeight: '700', color: '#0f172a', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <FaLightbulb style={{ color: '#eab308' }} /> Georson Tech Mapped Solutions
                </h4>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                  {solutions.map(sol => (
                    <div key={sol.id} style={{ border: '1px solid #e2e8f0', borderRadius: '8px', padding: '16px', background: '#f8fafc' }}>
                      <strong style={{ fontSize: '14.5px', color: '#0f172a', display: 'block', marginBottom: '6px' }}>{sol.name}</strong>
                      <span style={{ fontSize: '13px', color: '#64748b', lineHeight: 1.4 }}>{sol.description}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Action CTA */}
            <div style={{ borderTop: '1px solid #e2e8f0', paddingTop: '30px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '20px' }}>
              <div>
                <h4 style={{ fontSize: '16px', fontWeight: '700', color: '#0f172a', margin: '0 0 4px' }}>Require Custom Sizing or Design?</h4>
                <p style={{ fontSize: '13px', color: '#64748b', margin: 0 }}>Consult our technical engineering cell for pricing quotes.</p>
              </div>
              <Link 
                to={`/enquiry?service=Industrial%20Automation&subject=Custom%20Solution%20Request%20for%20${encodeURIComponent(industry.name)}`}
                className="btn-primary" 
                style={{ background: '#0093DD', border: 'none', padding: '12px 24px', display: 'inline-flex', alignItems: 'center', gap: '8px' }}
              >
                <FaEnvelope /> Contact Engineering Cell
              </Link>
            </div>

          </div>
        </div>
      </div>
    </>
  );
}

export default IndustryDetail;
