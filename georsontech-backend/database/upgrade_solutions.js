import mysql from 'mysql2/promise';

async function upgrade() {
  const connection = await mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'georsontech_db',
    port: 3306
  });

  console.log('Connected to MySQL database georsontech_db.');

  // 1. Create solution_categories table
  await connection.query(`
    CREATE TABLE IF NOT EXISTS solution_categories (
      id INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(150) NOT NULL UNIQUE,
      slug VARCHAR(150) NOT NULL UNIQUE,
      sort_order INT DEFAULT 0,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `);
  console.log('Created solution_categories table.');

  // 2. Create solutions table
  await connection.query(`
    CREATE TABLE IF NOT EXISTS solutions (
      id INT AUTO_INCREMENT PRIMARY KEY,
      category_id INT,
      name VARCHAR(255) NOT NULL,
      slug VARCHAR(255) NOT NULL UNIQUE,
      description TEXT,
      image_path VARCHAR(255),
      icon VARCHAR(100),
      service_descriptions TEXT, -- comma separated list or markdown details
      sort_order INT DEFAULT 0,
      status ENUM('Draft', 'Publish') DEFAULT 'Publish',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      FOREIGN KEY (category_id) REFERENCES solution_categories(id) ON DELETE SET NULL
    );
  `);
  console.log('Created solutions table.');

  // 3. Create junction tables
  await connection.query(`
    CREATE TABLE IF NOT EXISTS solution_industries (
      solution_id INT,
      industry_id INT,
      PRIMARY KEY (solution_id, industry_id),
      FOREIGN KEY (solution_id) REFERENCES solutions(id) ON DELETE CASCADE,
      FOREIGN KEY (industry_id) REFERENCES industries(id) ON DELETE CASCADE
    );
  `);
  console.log('Created solution_industries table.');

  await connection.query(`
    CREATE TABLE IF NOT EXISTS solution_products (
      solution_id INT,
      product_id INT,
      PRIMARY KEY (solution_id, product_id),
      FOREIGN KEY (solution_id) REFERENCES solutions(id) ON DELETE CASCADE,
      FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
    );
  `);
  console.log('Created solution_products table.');

  // Seed solution categories
  const categories = [
    { name: 'Engineering & Project Solutions', slug: 'engineering-project-solutions', sort: 10 },
    { name: 'Installation & Project Execution', slug: 'installation-project-execution', sort: 20 },
    { name: 'Industrial & Automation Solutions', slug: 'industrial-automation-solutions', sort: 30 },
    { name: 'Electrical, Safety & Building Systems', slug: 'electrical-safety-building-systems', sort: 40 },
    { name: 'Material Handling & Operational Solutions', slug: 'material-handling-operational-solutions', sort: 50 },
    { name: 'Technology & Communication Solutions', slug: 'technology-communication-solutions', sort: 60 },
    { name: 'Business & Workforce Solutions', slug: 'business-workforce-solutions', sort: 70 },
    { name: 'Industrial Components & Global Services', slug: 'industrial-components-global-services', sort: 80 }
  ];

  for (const cat of categories) {
    await connection.query(`
      INSERT INTO solution_categories (name, slug, sort_order) 
      VALUES (?, ?, ?) 
      ON DUPLICATE KEY UPDATE name=VALUES(name)
    `, [cat.name, cat.slug, cat.sort]);
  }
  console.log('Seeded solution categories.');

  // Fetch newly created categories map
  const [catRows] = await connection.query(`SELECT id, name FROM solution_categories`);
  const catMap = {};
  catRows.forEach(row => {
    catMap[row.name] = row.id;
  });

  // Seed individual solutions
  const solutions = [
    // A
    { cat: 'Engineering & Project Solutions', name: 'Engineering Consulting', slug: 'engineering-consulting', desc: 'Expert feasibility studies and plant layout designs.' },
    { cat: 'Engineering & Project Solutions', name: 'Design & Build Solutions', slug: 'design-build-solutions', desc: 'Turnkey concept-to-commissioning layout builds.' },
    { cat: 'Engineering & Project Solutions', name: 'EPC Contracts – Electrical, Civil & Mechanical', slug: 'epc-contracts', desc: 'Full engineering, procurement, and construction contracting.' },
    { cat: 'Engineering & Project Solutions', name: 'Liaison Works & Licensing', slug: 'liaison-works', desc: 'Obtaining governmental approvals and CEIG licensing.' },
    { cat: 'Engineering & Project Solutions', name: 'Energy Audit & Capacity Planning', slug: 'energy-audit-capacity-planning', desc: 'Complete structural optimization of energy usage.' },
    // B
    { cat: 'Installation & Project Execution', name: 'Erection & Installation', slug: 'erection-installation', desc: 'Onsite placement and setup of heavy machinery.' },
    { cat: 'Installation & Project Execution', name: 'Testing & Commissioning', slug: 'testing-commissioning', desc: 'System integrations testing and formal validation run.' },
    { cat: 'Installation & Project Execution', name: 'Electrical Installation', slug: 'electrical-installation', desc: 'Cabling, structural cable trays, and mains wiring.' },
    { cat: 'Installation & Project Execution', name: 'Civil Project Execution', slug: 'civil-project-execution', desc: 'Foundations and operational masonry structures.' },
    { cat: 'Installation & Project Execution', name: 'Mechanical Project Execution', slug: 'mechanical-project-execution', desc: 'Pneumatics, structural welding, and piping networks.' },
    { cat: 'Installation & Project Execution', name: 'Office Fit-Out Solutions', slug: 'office-fit-out-solutions', desc: 'Workstations, internal utility lines, and server racks.' },
    { cat: 'Installation & Project Execution', name: 'Annual Maintenance Contracts (AMC)', slug: 'annual-maintenance-contracts', desc: 'Preventative checkups and priority parts support.' },
    // C
    { cat: 'Industrial & Automation Solutions', name: 'Process Industry Solutions', slug: 'process-industry-solutions', desc: 'PID loop tuning, sensors, and batch recipes.' },
    { cat: 'Industrial & Automation Solutions', name: 'Industrial Internet of Things (IIoT)', slug: 'iiot-solutions', desc: 'Cloud gateways, telemetry reporting, and dashboard maps.' },
    { cat: 'Industrial & Automation Solutions', name: 'Building Management Systems (BMS)', slug: 'bms-solutions', desc: 'Integrated climate control, access, and energy tracking.' },
    { cat: 'Industrial & Automation Solutions', name: 'Industrial Automation', slug: 'industrial-automation-services', desc: 'PLC/DCS architecture mapping and programming.' },
    { cat: 'Industrial & Automation Solutions', name: 'Instrumentation', slug: 'instrumentation-services', desc: 'Calibration of transmitters, valves, and gas sensors.' },
    { cat: 'Industrial & Automation Solutions', name: 'Pneumatic Systems', slug: 'pneumatic-systems', desc: 'Solenoid blocks, compressors, and cylinder integrations.' },
    { cat: 'Industrial & Automation Solutions', name: 'Special-Purpose Machines', slug: 'special-purpose-machines', desc: 'Bespoke machinery built for customized workflows.' },
    { cat: 'Industrial & Automation Solutions', name: 'Components Assembly', slug: 'components-assembly', desc: 'Sub-assembly loops and custom operator benches.' },
    // D
    { cat: 'Electrical, Safety & Building Systems', name: 'HVAC Systems', slug: 'hvac-systems', desc: 'Cleanrooms, temperature chillers, and duct layouts.' },
    { cat: 'Electrical, Safety & Building Systems', name: 'Fire Alarm Systems (FAS)', slug: 'fire-alarm-systems', desc: 'Smoke sensors, emergency panels, and sprinkler links.' },
    { cat: 'Electrical, Safety & Building Systems', name: 'Electrical Control Panels', slug: 'electrical-control-panels', desc: 'Custom PLC panels and junction enclosures.' },
    { cat: 'Electrical, Safety & Building Systems', name: 'Industrial Panels', slug: 'industrial-panels-solutions', desc: 'Robust PCC, MCC, and load breaker housings.' },
    { cat: 'Electrical, Safety & Building Systems', name: 'Energy Management Solutions', slug: 'energy-management-solutions', desc: 'Power factors and smart electrical meter grids.' },
    // E
    { cat: 'Material Handling & Operational Solutions', name: 'Heavy Material Handling', slug: 'heavy-material-handling', desc: 'Silo feeds, long conveyors, and automatic lifters.' },
    { cat: 'Material Handling & Operational Solutions', name: 'Logistics & Storage Solutions', slug: 'logistics-storage-solutions', desc: 'Custom racking systems and parts picking trays.' },
    { cat: 'Material Handling & Operational Solutions', name: 'Industrial Equipment Solutions', slug: 'industrial-equipment-solutions', desc: 'Sourcing specialized loaders and vacuum lifters.' },
    { cat: 'Material Handling & Operational Solutions', name: 'Capacity Planning', slug: 'capacity-planning-solutions', desc: 'Simulating queue bottlenecks and line layout speeds.' },
    // F
    { cat: 'Technology & Communication Solutions', name: 'Communication Systems', slug: 'communication-systems', desc: 'Vessel intercoms, fiber uplinks, and industrial Wi-Fi.' },
    { cat: 'Technology & Communication Solutions', name: 'Software Development', slug: 'software-development', desc: 'Custom dashboard databases and ERP integrations.' },
    { cat: 'Technology & Communication Solutions', name: 'Industrial Software Solutions', slug: 'industrial-software-solutions', desc: 'SCADA reporting databases and downtime logs.' },
    { cat: 'Technology & Communication Solutions', name: 'IIoT Monitoring Solutions', slug: 'iiot-monitoring-solutions', desc: 'Remote vibration and current diagnostic sensors.' },
    { cat: 'Technology & Communication Solutions', name: 'Digital Automation Solutions', slug: 'digital-automation-solutions', desc: 'Converting legacy workflows into automated database forms.' },
    // G
    { cat: 'Business & Workforce Solutions', name: 'Manpower Services', slug: 'manpower-services', desc: 'Skilled technicians and operators for plant execution.' },
    { cat: 'Business & Workforce Solutions', name: 'Engineering Workforce Support', slug: 'engineering-workforce-support', desc: 'Contract CAD designers and PLC programmers.' },
    { cat: 'Business & Workforce Solutions', name: 'Technical Workforce Support', slug: 'technical-workforce-support', desc: 'Onsite testing assistance and maintenance crews.' },
    { cat: 'Business & Workforce Solutions', name: 'Project Support Services', slug: 'project-support-services', desc: 'Dedicated project managers and site coordinators.' },
    // H
    { cat: 'Industrial Components & Global Services', name: 'Industrial Component Imports', slug: 'industrial-component-imports', desc: 'Sourcing hard-to-find European/US PLC parts.' },
    { cat: 'Industrial Components & Global Services', name: 'Industrial Equipment Sourcing', slug: 'industrial-equipment-sourcing', desc: 'Sourcing heavy process pumps and valving grids.' },
    { cat: 'Industrial Components & Global Services', name: 'Export of Electrical and Industrial Panels', slug: 'export-of-panels', desc: 'Exporting CE/UL certified panels to global units.' },
    { cat: 'Industrial Components & Global Services', name: 'Component Assembly Solutions', slug: 'component-assembly-solutions', desc: 'Subcontract assembly of electrical switches and panels.' }
  ];

  for (const sol of solutions) {
    const catId = catMap[sol.cat];
    await connection.query(`
      INSERT INTO solutions (category_id, name, slug, description, status) 
      VALUES (?, ?, ?, ?, 'Publish') 
      ON DUPLICATE KEY UPDATE description=VALUES(description)
    `, [catId, sol.name, sol.slug, sol.desc]);
  }
  console.log('Seeded solutions.');

  // Seed 9 additional industries
  const extraIndustries = [
    { name: "Energy Industries", slug: "energy", desc: "PV tracking grids, steam loops, and load management." },
    { name: "Materials Industries", slug: "materials", desc: "Chemical dosing feeds, rubber compounding, and silicates." },
    { name: "Industrial Manufacturing", slug: "industrial-manufacturing", desc: "Shop floor assembly automations, jigs, and fixtures." },
    { name: "Consumer Products", slug: "consumer-products", desc: "Bottling feeds, high-speed sorting, and packaging automation." },
    { name: "Healthcare", slug: "healthcare", desc: "Sterilization cycles, HVAC cleanrooms, and FDA logging." },
    { name: "Information Technology", slug: "information-technology", desc: "Edge analytics gateways, database links, and servers." },
    { name: "Communication Services", slug: "communication-services", desc: "Fiber uplinks, remote radio networks, and modbus setups." },
    { name: "Utilities", slug: "utilities", desc: "Pumping stations, grid load synchronizers, and solar." },
    { name: "Infrastructure & Real Estate", slug: "infrastructure-real-estate", desc: "BMS integrations, switchgears, and fit-outs." }
  ];

  for (const ind of extraIndustries) {
    await connection.query(`
      INSERT INTO industries (name, slug, description, detailed_description, status) 
      VALUES (?, ?, ?, ?, 'Publish') 
      ON DUPLICATE KEY UPDATE description=VALUES(description)
    `, [ind.name, ind.slug, ind.desc, ind.desc]);
  }
  console.log('Seeded additional industries.');

  connection.end();
  console.log('Database upgrade completed successfully.');
}

upgrade().catch(err => {
  console.error('Migration failed:', err);
});
