import React, { useState } from 'react';
import { FaPlus, FaMinus, FaCheckCircle } from 'react-icons/fa';

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

function SolutionsTaxonomy() {
  const [openSolutionAccordions, setOpenSolutionAccordions] = useState({ 'A': true });

  const toggleAccordion = (key) => {
    setOpenSolutionAccordions(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  return (
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
  );
}

export default SolutionsTaxonomy;
