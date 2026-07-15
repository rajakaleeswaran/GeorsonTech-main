import React from 'react';
import { FaBriefcase, FaMapMarkerAlt, FaChevronRight } from 'react-icons/fa';

const JOB_OPENINGS = [
  {
    id: 1,
    title: "PLC Automation Programmer",
    department: "Engineering",
    location: "Coimbatore, Tamil Nadu",
    experience: "2–4 Years",
    skills: "Siemens S7-1200/1500, TIA Portal, Allen-Bradley Studio 5000, HMI & SCADA Development",
    description: "Responsible for designing, programming, and commissioning PLC and SCADA-based industrial control systems for manufacturing lines."
  },
  {
    id: 2,
    title: "Electrical Panel Design Engineer",
    department: "Design & Estimations",
    location: "Chennai Head Office",
    experience: "3–5 Years",
    skills: "AutoCAD Electrical, EPLAN, PCC/MCC Panel Design, Busbar Calculations",
    description: "Create detailed wiring schematics, layout drawings, and bill of materials (BOM) for low voltage (LV) switchgear panels."
  },
  {
    id: 3,
    title: "IIoT & Industry 4.0 Deployment Engineer",
    department: "Digital Solutions",
    location: "Coimbatore Branch",
    experience: "1–3 Years",
    skills: "OPC-UA, MQTT, Node-RED, Python, Edge Gateways, Cloud Dashboards",
    description: "Install, configure, and troubleshoot industrial IoT gateways, connecting legacy field machines to centralized database portals."
  }
];

function JobOpenings({ onApply }) {
  return (
    <div style={{ marginBottom: '80px' }}>
      <h2 style={{ fontSize: '24px', fontWeight: '700', color: '#0f172a', marginBottom: '30px', display: 'flex', alignItems: 'center', gap: '10px' }}>
        <FaBriefcase style={{ color: '#0093DD' }} /> Current Job Opportunities
      </h2>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '25px' }}>
        {JOB_OPENINGS.map(job => (
          <div key={job.id} style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '30px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)', transition: 'all 0.3s ease' }}
            onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.boxShadow = '0 10px 15px -3px rgba(0,0,0,0.08)'; }}
            onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 4px 6px -1px rgba(0,0,0,0.05)'; }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '15px' }}>
              <div>
                <h3 style={{ fontSize: '20px', fontWeight: '700', color: '#0f172a', margin: '0 0 8px' }}>{job.title}</h3>
                <div style={{ display: 'flex', gap: '20px', fontSize: '13.5px', color: '#64748b', marginBottom: '15px' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><FaMapMarkerAlt /> {job.location}</span>
                  <span><strong>Experience:</strong> {job.experience}</span>
                </div>
              </div>
              <button onClick={() => onApply(job.title)} className="btn-primary" style={{ padding: '8px 20px', fontSize: '13px' }}>
                Apply Now <FaChevronRight />
              </button>
            </div>
            <p style={{ fontSize: '14.5px', color: '#475569', lineHeight: 1.6, marginBottom: '15px' }}>{job.description}</p>
            <div style={{ background: '#f8fafc', padding: '12px 16px', borderRadius: '6px', fontSize: '13.5px', borderLeft: '3px solid #0093DD' }}>
              <strong>Key Skills Required:</strong> <span style={{ color: '#334155' }}>{job.skills}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default JobOpenings;
