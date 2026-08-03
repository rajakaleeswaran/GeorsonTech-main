import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaArrowRight, FaCogs, FaIndustry, FaBolt, FaTint, FaCar, FaBuilding, FaTools, FaLaptopCode } from 'react-icons/fa';
import { fetchCollection, getAssetUrl } from '../../lib/dbHelper';

// Curated unique industrial cover images for each sector
const SECTOR_IMAGES = {
  'electrical-engineering': 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&q=80&w=600',
  'coal-mining-material-handling': 'https://images.unsplash.com/photo-1578575437130-527eed3abbec?auto=format&fit=crop&q=80&w=600',
  'marine': 'https://images.unsplash.com/photo-1559136555-9303baea8ebd?auto=format&fit=crop&q=80&w=600',
  'automobile': 'https://images.unsplash.com/photo-1563720223185-11003d516935?auto=format&fit=crop&q=80&w=600',
  'tyre': 'https://images.unsplash.com/photo-1580273916550-e323be2ae537?auto=format&fit=crop&q=80&w=600',
  'cement': 'https://images.unsplash.com/photo-1541888946425-d0fbb186a5b3?auto=format&fit=crop&q=80&w=600',
  'pharmaceutical': 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&q=80&w=600',
  'food-beverage': 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&q=80&w=600',
  'tool': 'https://images.unsplash.com/photo-1504917599217-d4dc5ebe6122?auto=format&fit=crop&q=80&w=600',
  'electronics-assembly': 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&q=80&w=600',
  'solar-renewable-energy': 'https://images.unsplash.com/photo-1509391365360-2e959784a276?auto=format&fit=crop&q=80&w=600',
  'energy': 'https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?auto=format&fit=crop&q=80&w=600',
  'materials': 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&q=80&w=600',
  'industrial-manufacturing': 'https://images.unsplash.com/photo-1581092335397-9583fe92d232?auto=format&fit=crop&q=80&w=600',
  'consumer-products': 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&q=80&w=600',
  'healthcare': 'https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&q=80&w=600',
  'information-technology': 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&q=80&w=600',
  'communication-services': 'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?auto=format&fit=crop&q=80&w=600',
  'utilities': 'https://images.unsplash.com/photo-1562016600-ece13e8ba570?auto=format&fit=crop&q=80&w=600',
  'infrastructure-real-estate': 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=600'
};

const DEFAULT_SECTORS = [
  { id: 1, name: "Electrical Engineering Industries", slug: "electrical-engineering", sort_order: 10, icon: <FaBolt />, desc: "Advanced PCC/MCC panels, energy management, and cabling layouts." },
  { id: 2, name: "Coal, Mining & Material Handling Industries", slug: "coal-mining-material-handling", sort_order: 20, icon: <FaIndustry />, desc: "Heavy conveyors, automated chute control, and material flow tracking." },
  { id: 3, name: "Marine Industries", slug: "marine", sort_order: 30, icon: <FaTint />, desc: "Seawater piping systems, vessel automation, and corrosion-resistant panels." },
  { id: 4, name: "Automobile Industries", slug: "automobile", sort_order: 40, icon: <FaCar />, desc: "Assembly line jigs, weld cell integration, and AGV systems." },
  { id: 5, name: "Tyre Industries", slug: "tyre", sort_order: 50, icon: <FaCogs />, desc: "Curing press automation, mixer temperature controls, and sorting logic." },
  { id: 6, name: "Cement Industries", slug: "cement", sort_order: 60, icon: <FaBuilding />, desc: "Raw mill controls, rotary kiln thermal mapping, and packer automation." },
  { id: 7, name: "Pharmaceutical Industries", slug: "pharmaceutical", sort_order: 70, icon: <FaTools />, desc: "Batch production reporting, FDA 21 CFR compliance, and cleanrooms." },
  { id: 8, name: "Food & Beverage Industries", slug: "food-beverage", sort_order: 80, icon: <FaTint />, desc: "Automated filling lines, bottling SCADA, and CIP system logic." },
  { id: 9, name: "Tool Industries", slug: "tool", sort_order: 90, icon: <FaTools />, desc: "CNC machine tool loading, jig calibrations, and tool changer automation." },
  { id: 10, name: "Electronics & Assembly Industries", slug: "electronics-assembly", sort_order: 100, icon: <FaLaptopCode />, desc: "Precision picking, ESD protection systems, and high-speed inspection." },
  { id: 11, name: "Solar & Renewable Energy Industries", slug: "solar-renewable-energy", sort_order: 110, icon: <FaBolt />, desc: "PV inverter tracking controls, battery storage systems, and solar SCADA." },
  { id: 12, name: "Energy Sector", slug: "energy", sort_order: 120, icon: <FaBolt />, desc: "High voltage grids, distribution load shedding, and smart metering." },
  { id: 13, name: "Materials Sector", slug: "materials", sort_order: 130, icon: <FaIndustry />, desc: "Bulk dry material handling, silicones, and compounding plant setups." },
  { id: 14, name: "Industrial Manufacturing", slug: "industrial-manufacturing", sort_order: 140, icon: <FaCogs />, desc: "Custom machine jigs, operator workbenches, and assembly lines." },
  { id: 15, name: "Consumer Products", slug: "consumer-products", sort_order: 150, icon: <FaBuilding />, desc: "High speed picking arrays, packing machinery, and labelers." },
  { id: 16, name: "Healthcare Sector", slug: "healthcare", sort_order: 160, icon: <FaTools />, desc: "Cleanroom filtration loops, temperature monitoring, and medical assembly." },
  { id: 17, name: "Information Technology", slug: "information-technology", sort_order: 170, icon: <FaLaptopCode />, desc: "Edge gateway telemetry, database servers, and IoT portals." },
  { id: 18, name: "Communication Services", slug: "communication-services", sort_order: 180, icon: <FaLaptopCode />, desc: "Fiber optic line routing, modbus telemetry, and remote site radios." },
  { id: 19, name: "Utilities Sector", slug: "utilities", sort_order: 190, icon: <FaTint />, desc: "Water pumping networks, power line monitors, and treatment plants." },
  { id: 20, name: "Infrastructure & Real Estate", slug: "infrastructure-real-estate", sort_order: 200, icon: <FaBuilding />, desc: "Commercial fit-outs, building automation panels, and switchboards." }
];

function getSectorIcon(name = '', slug = '') {
  const text = (name + ' ' + slug).toLowerCase();
  if (text.includes('bolt') || text.includes('electrical') || text.includes('solar') || text.includes('energy')) return <FaBolt />;
  if (text.includes('marine') || text.includes('water') || text.includes('beverage') || text.includes('utilities')) return <FaTint />;
  if (text.includes('car') || text.includes('automobile')) return <FaCar />;
  if (text.includes('cement') || text.includes('building') || text.includes('infrastructure')) return <FaBuilding />;
  if (text.includes('tool') || text.includes('pharma') || text.includes('health')) return <FaTools />;
  if (text.includes('electronic') || text.includes('tech') || text.includes('communication')) return <FaLaptopCode />;
  if (text.includes('tyre') || text.includes('manufacturing') || text.includes('cogs')) return <FaCogs />;
  return <FaIndustry />;
}

function SectorsGrid() {
  const [sectors, setSectors] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCollection('/industries', 'industries')
      .then(data => {
        if (Array.isArray(data) && data.length > 0) {
          const published = data.filter(i => !i.status || i.status === 'Publish');
          const sorted = [...published].sort((a, b) => (Number(a.sort_order) || 0) - (Number(b.sort_order) || 0));
          setSectors(sorted);
        } else {
          setSectors(DEFAULT_SECTORS);
        }
      })
      .catch(() => setSectors(DEFAULT_SECTORS))
      .finally(() => setLoading(false));
  }, []);

  const displayList = sectors.length > 0 ? sectors : DEFAULT_SECTORS;

  return (
    <section id="industries-grid" style={{ padding: '80px 20px', background: '#ffffff' }}>
      <div className="container" style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <div className="text-center" style={{ marginBottom: '50px' }}>
          <span className="section-label" style={{ color: '#0093DD' }}>Industrial Sectors</span>
          <h2 style={{ fontSize: '32px', fontWeight: '800', color: '#0f172a', margin: '10px 0' }}>Industries We Serve</h2>
          <p style={{ color: '#64748b', fontSize: '15px', maxWidth: '600px', margin: '0 auto' }}>
            Click on any sector card to view detailed engineering solutions, challenges, and related products.
          </p>
        </div>

        {loading ? (
          <p className="text-center" style={{ color: '#64748b' }}>Loading industrial sectors...</p>
        ) : (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '24px'
          }}>
            {displayList.map((ind, idx) => {
              const itemSlug = ind.slug || ind.name?.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-');
              const imgSrc = ind.image_path
                ? getAssetUrl(ind.image_path)
                : (SECTOR_IMAGES[itemSlug] || SECTOR_IMAGES['electrical-engineering']);

              const icon = ind.icon || getSectorIcon(ind.name, itemSlug);

              return (
                <Link 
                  key={ind.id || idx} 
                  to={`/industries/${itemSlug}`}
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
                    e.currentTarget.style.boxShadow = '0 12px 20px rgba(0,147,221,0.12)';
                    const overlay = e.currentTarget.querySelector('.card-overlay');
                    if (overlay) overlay.style.opacity = '1';
                    const iconEl = e.currentTarget.querySelector('.card-icon');
                    if (iconEl) iconEl.style.transform = 'scale(1.1) rotate(10deg)';
                    const title = e.currentTarget.querySelector('.card-title');
                    if (title) title.style.color = '#0093DD';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = '0 4px 6px rgba(0,0,0,0.02)';
                    const overlay = e.currentTarget.querySelector('.card-overlay');
                    if (overlay) overlay.style.opacity = '0';
                    const iconEl = e.currentTarget.querySelector('.card-icon');
                    if (iconEl) iconEl.style.transform = 'scale(1) rotate(0deg)';
                    const title = e.currentTarget.querySelector('.card-title');
                    if (title) title.style.color = '#0f172a';
                  }}
                >
                  {/* Image Container with Zoom effect */}
                  <div style={{ height: '170px', overflow: 'hidden', position: 'relative', background: '#f1f5f9' }}>
                    <img 
                      src={imgSrc} 
                      alt={ind.name}
                      loading="lazy"
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      onError={e => {
                        e.target.src = SECTOR_IMAGES['electrical-engineering'];
                      }}
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
                      {icon}
                    </div>
                  </div>

                  {/* Content Body */}
                  <div style={{ padding: '20px' }}>
                    <h3 className="card-title" style={{ fontSize: '16px', fontWeight: '700', color: '#0f172a', margin: '0 0 8px', transition: 'color 0.2s' }}>
                      {ind.name}
                    </h3>
                    <p style={{ fontSize: '13px', color: '#64748b', lineHeight: 1.5, marginBottom: '16px', height: '60px', overflow: 'hidden' }}>
                      {ind.desc || ind.description || ind.short_description}
                    </p>
                    <span style={{ fontSize: '12.5px', color: '#0093DD', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '6px' }}>
                      Explore Solutions <FaArrowRight style={{ fontSize: '10px' }} />
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}

export default SectorsGrid;
