import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { 
  FaArrowRight, FaCogs, FaCheckCircle, FaIndustry, 
  FaBolt, FaTint, FaCar, FaPlus, FaMinus, FaBuilding,
  FaFileInvoiceDollar, FaTools, FaLaptopCode, FaHandsHelping, FaFileAlt
} from 'react-icons/fa';
import TitleBar from '../components/TitleBar';
import ServicesTitleImg from '../assets/Services/titleImg.png';

// 20 sectors/industries listed in the requirements
const INDUSTRIES_LIST = [
  { id: 1, name: "Electrical Engineering Industries", slug: "electrical-engineering", icon: <FaBolt />, desc: "Advanced PCC/MCC panels, energy management, and cabling layouts." },
  { id: 2, name: "Coal, Mining & Material Handling Industries", slug: "coal-mining-material-handling", icon: <FaIndustry />, desc: "Heavy conveyors, automated chute control, and material flow tracking." },
  { id: 3, name: "Marine Industries", slug: "marine", icon: <FaTint />, desc: "Seawater piping systems, vessel automation, and corrosion-resistant panels." },
  { id: 4, name: "Automobile Industries", slug: "automobile", icon: <FaCar />, desc: "Assembly line jigs, weld cell integration, and AGV systems." },
  { id: 5, name: "Tyre Industries", slug: "tyre", icon: <FaCogs />, desc: "Curing press automation, mixer temperature controls, and sorting logic." },
  { id: 6, name: "Cement Industries", slug: "cement", icon: <FaBuilding />, desc: "Raw mill controls, rotary kiln thermal mapping, and packer automation." },
  { id: 7, name: "Pharmaceutical Industries", slug: "pharmaceutical", icon: <FaTools />, desc: "Batch production reporting, FDA 21 CFR compliance, and cleanrooms." },
  { id: 8, name: "Food & Beverage Industries", slug: "food-beverage", icon: <FaTint />, desc: "Automated filling lines, bottling SCADA, and CIP system logic." },
  { id: 9, name: "Tool Industries", slug: "tool", icon: <FaTools />, desc: "CNC machine tool loading, jig calibrations, and tool changer automation." },
  { id: 10, name: "Electronics & Assembly Industries", slug: "electronics-assembly", icon: <FaLaptopCode />, desc: "Precision picking, ESD protection systems, and high-speed inspection." },
  { id: 11, name: "Solar & Renewable Energy Industries", slug: "solar-renewable-energy", icon: <FaBolt />, desc: "PV inverter tracking controls, battery storage systems, and solar SCADA." },
  { id: 12, name: "Energy Sector", slug: "energy", icon: <FaBolt />, desc: "High voltage grids, distribution load shedding, and smart metering." },
  { id: 13, name: "Materials Sector", slug: "materials", icon: <FaIndustry />, desc: "Bulk dry material handling, silicones, and compounding plant setups." },
  { id: 14, name: "Industrial Manufacturing", slug: "industrial-manufacturing", icon: <FaCogs />, desc: "Custom machine jigs, operator workbenches, and assembly lines." },
  { id: 15, name: "Consumer Products", slug: "consumer-products", icon: <FaBuilding />, desc: "High speed picking arrays, packing machinery, and labelers." },
  { id: 16, name: "Healthcare Sector", slug: "healthcare", icon: <FaTools />, desc: "Cleanroom filtration loops, temperature monitoring, and medical assembly." },
  { id: 17, name: "Information Technology", slug: "information-technology", icon: <FaLaptopCode />, desc: "Edge gateway telemetry, database servers, and IoT portals." },
  { id: 18, name: "Communication Services", slug: "communication-services", icon: <FaLaptopCode />, desc: "Fiber optic line routing, modbus telemetry, and remote site radios." },
  { id: 19, name: "Utilities Sector", slug: "utilities", icon: <FaTint />, desc: "Water pumping networks, power line monitors, and treatment plants." },
  { id: 20, name: "Infrastructure & Real Estate", slug: "infrastructure-real-estate", icon: <FaBuilding />, desc: "Commercial fit-outs, building automation panels, and switchboards." }
];

// Solutions A to H taxonomies
const SOLUTIONS_TAXONOMY = [
  {
    key: 'A',
    title: 'A. Engineering & Project Solutions',
    items: ['Engineering Consulting', 'Design & Build Solutions', 'EPC Contracts – Electrical, Civil & Mechanical', 'Liaison Works & Licensing', 'Energy Audit & Capacity Planning']
  },
  {
    key: 'B',
    title: 'B. Installation & Project Execution',
    items: ['Erection & Installation', 'Testing & Commissioning', 'Electrical Installation', 'Civil Project Execution', 'Mechanical Project Execution', 'Office Fit-Out Solutions', 'Annual Maintenance Contracts (AMC)']
  },
  {
    key: 'C',
    title: 'C. Industrial & Automation Solutions',
    items: ['Process Industry Solutions', 'Industrial Internet of Things (IIoT)', 'Building Management Systems (BMS)', 'Industrial Automation', 'Instrumentation', 'Pneumatic Systems', 'Special-Purpose Machines', 'Components Assembly']
  },
  {
    key: 'D',
    title: 'D. Electrical, Safety & Building Systems',
    items: ['HVAC Systems', 'Fire Alarm Systems (FAS)', 'Electrical Control Panels', 'Industrial Panels', 'Energy Management Solutions']
  },
  {
    key: 'E',
    title: 'E. Material Handling & Operational Solutions',
    items: ['Heavy Material Handling', 'Logistics & Storage Solutions', 'Industrial Equipment Solutions', 'Capacity Planning']
  },
  {
    key: 'F',
    title: 'F. Technology & Communication Solutions',
    items: ['Communication Systems', 'Software Development', 'Industrial Software Solutions', 'IIoT Monitoring Solutions', 'Digital Automation Solutions']
  },
  {
    key: 'G',
    title: 'G. Business & Workforce Solutions',
    items: ['Manpower Services', 'Engineering Workforce Support', 'Technical Workforce Support', 'Project Support Services']
  },
  {
    key: 'H',
    title: 'H. Industrial Components & Global Services',
    items: ['Industrial Component Imports', 'Industrial Equipment Sourcing', 'Export of Electrical and Industrial Panels', 'Component Assembly Solutions']
  }
];

// Interactive Ecosystem Category definitions
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

function Industries() {
  const [activeEcosystem, setActiveEcosystem] = useState('engineering');
  const [solutions, setSolutions] = useState([]);
  const [dbIndustries, setDbIndustries] = useState([]);
  const [openSolutionAccordions, setOpenSolutionAccordions] = useState({ 'A': true });
  const [relatedProducts, setRelatedProducts] = useState([]);

  useEffect(() => {
    // Scroll to top on load
    window.scrollTo(0, 0);

    // Fetch dynamic industries
    fetch('http://localhost:5000/api/industries')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data) && data.length > 0) {
          setDbIndustries(data);
        }
      })
      .catch(() => {});

    // Fetch dynamic products to show related products
    fetch('http://localhost:5000/api/products')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          setRelatedProducts(data.slice(0, 3));
        }
      })
      .catch(() => {});
  }, []);

  const toggleAccordion = (key) => {
    setOpenSolutionAccordions(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const selectedEcoDetails = ECOSYSTEM_CATEGORIES.find(c => c.id === activeEcosystem);

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
              <a href="#industries-grid" className="btn-primary" style={{ padding: '14px 28px', background: '#0093DD', border: 'none' }}>
                Explore Industries
              </a>
              <a href="#solutions-ecosystem" className="btn-outline" style={{ padding: '14px 28px', color: '#fff', borderColor: '#ffffff' }}>
                Explore Our Solutions
              </a>
              <Link to="/enquiry" className="btn-primary" style={{ padding: '14px 28px', background: 'transparent', border: '2px solid #0093DD', color: '#0093DD' }}>
                Talk to Our Experts
              </Link>
            </div>
          </div>
        </section>

        {/* SECTION 1: INDUSTRIES WE SERVE */}
        <section id="industries-grid" style={{ padding: '80px 20px', background: '#ffffff' }}>
          <div className="container" style={{ maxWidth: '1200px', margin: '0 auto' }}>
            <div className="text-center" style={{ marginBottom: '50px' }}>
              <span className="section-label" style={{ color: '#0093DD' }}>20 Industrial Sectors</span>
              <h2 style={{ fontSize: '32px', fontWeight: '800', color: '#0f172a', margin: '10px 0' }}>Industries We Serve</h2>
              <p style={{ color: '#64748b', fontSize: '15px', maxWidth: '600px', margin: '0 auto' }}>
                Click on any sector card to view detailed engineering solutions, challenges, and related products.
              </p>
            </div>

            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: '24px'
            }}>
              {INDUSTRIES_LIST.map((ind) => (
                <Link 
                  key={ind.id} 
                  to={`/industries/${ind.slug}`}
                  className="industry-card"
                  style={{
                    display: 'block',
                    background: '#ffffff',
                    borderRadius: '12px',
                    border: '1px solid #e2e8f0',
                    overflow: 'hidden',
                    boxShadow: '0 4px 6px rgba(0,0,0,0.02)',
                    textDecoration: 'none',
                    position: 'relative',
                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-5px)';
                    e.currentTarget.style.boxShadow = '0 12px 20px rgba(0,147,221,0.1)';
                    const overlay = e.currentTarget.querySelector('.card-overlay');
                    if (overlay) overlay.style.opacity = '1';
                    const icon = e.currentTarget.querySelector('.card-icon');
                    if (icon) icon.style.transform = 'scale(1.1) rotate(10deg)';
                    const title = e.currentTarget.querySelector('.card-title');
                    if (title) title.style.color = '#0093DD';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = '0 4px 6px rgba(0,0,0,0.02)';
                    const overlay = e.currentTarget.querySelector('.card-overlay');
                    if (overlay) overlay.style.opacity = '0';
                    const icon = e.currentTarget.querySelector('.card-icon');
                    if (icon) icon.style.transform = 'scale(1) rotate(0deg)';
                    const title = e.currentTarget.querySelector('.card-title');
                    if (title) title.style.color = '#0f172a';
                  }}
                >
                  {/* Image Container with Zoom effect */}
                  <div style={{ height: '160px', overflow: 'hidden', position: 'relative', background: '#f1f5f9' }}>
                    <img 
                      src={`https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80&w=400&sig=${ind.id}`} 
                      alt={ind.name}
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                    {/* Blue transparent overlay */}
                    <div className="card-overlay" style={{
                      position: 'absolute',
                      inset: 0,
                      background: 'linear-gradient(to top, rgba(0,147,221,0.65), transparent)',
                      opacity: 0,
                      transition: 'opacity 0.3s ease'
                    }} />
                    
                    {/* Icon Bubble */}
                    <div className="card-icon" style={{
                      position: 'absolute',
                      bottom: '12px',
                      right: '12px',
                      background: '#0093DD',
                      color: '#ffffff',
                      width: '40px',
                      height: '40px',
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '16px',
                      transition: 'all 0.3s ease',
                      zIndex: 3
                    }}>
                      {ind.icon}
                    </div>
                  </div>

                  {/* Content Body */}
                  <div style={{ padding: '20px' }}>
                    <h3 className="card-title" style={{ fontSize: '16px', fontWeight: '700', color: '#0f172a', margin: '0 0 8px', transition: 'color 0.2s' }}>
                      {ind.name}
                    </h3>
                    <p style={{ fontSize: '13px', color: '#64748b', lineHeight: 1.5, marginBottom: '16px', height: '60px', overflow: 'hidden' }}>
                      {ind.desc}
                    </p>
                    <span style={{ fontSize: '12.5px', color: '#0093DD', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '6px' }}>
                      Explore Solutions <FaArrowRight style={{ fontSize: '10px' }} />
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* SECTION 2: INTERACTIVE ECOSYSTEM MAP */}
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

        {/* SECTION 3: ORGANIZED CATEGORIES (A TO H) */}
        <section style={{ padding: '80px 20px', background: '#ffffff' }}>
          <div className="container" style={{ maxWidth: '1000px', margin: '0 auto' }}>
            <div className="text-center" style={{ marginBottom: '50px' }}>
              <span className="section-label" style={{ color: '#0093DD' }}>Structured Directory</span>
              <h2 style={{ fontSize: '32px', fontWeight: '800', color: '#0f172a', margin: '10px 0' }}>Our Engineering & Industrial Solutions</h2>
              <p style={{ color: '#64748b', fontSize: '15px', maxWidth: '600px', margin: '0 auto' }}>
                Browse our comprehensive taxonomy of project execution, technology integration, and assembly support.
              </p>
            </div>

            {/* Accordions */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
              {SOLUTIONS_TAXONOMY.map((sol) => {
                const isOpen = openSolutionAccordions[sol.key];
                return (
                  <div key={sol.key} style={{
                    border: '1px solid #e2e8f0',
                    borderRadius: '8px',
                    overflow: 'hidden',
                    background: '#ffffff'
                  }}>
                    <button
                      onClick={() => toggleAccordion(sol.key)}
                      style={{
                        width: '100%',
                        padding: '18px 24px',
                        background: isOpen ? '#f8fafc' : '#ffffff',
                        border: 'none',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        cursor: 'pointer',
                        textAlign: 'left'
                      }}
                    >
                      <span style={{ fontSize: '16px', fontWeight: '700', color: isOpen ? '#0093DD' : '#0f172a' }}>
                        {sol.title}
                      </span>
                      {isOpen ? <FaMinus style={{ color: '#0093DD' }} /> : <FaPlus style={{ color: '#64748b' }} />}
                    </button>
                    
                    {isOpen && (
                      <div style={{ padding: '20px 24px', background: '#ffffff', borderTop: '1px solid #e2e8f0' }}>
                        <div style={{
                          display: 'grid',
                          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
                          gap: '12px'
                        }}>
                          {sol.items.map((item, idx) => (
                            <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14.5px', color: '#334155', padding: '6px 0' }}>
                              <FaCheckCircle style={{ color: '#0093DD', flexShrink: 0 }} />
                              {item}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </section>

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
                      <img src={`http://localhost:5000/${prod.image_path}`} alt={prod.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
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
