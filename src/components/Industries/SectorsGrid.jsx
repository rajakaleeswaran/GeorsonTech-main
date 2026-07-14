import React from 'react';
import { Link } from 'react-router-dom';
import { FaArrowRight, FaCogs, FaIndustry, FaBolt, FaTint, FaCar, FaBuilding, FaTools, FaLaptopCode } from 'react-icons/fa';

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

function SectorsGrid() {
  return (
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
  );
}

export default SectorsGrid;
