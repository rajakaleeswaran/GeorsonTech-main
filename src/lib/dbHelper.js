/**
 * @file dbHelper.js
 * @description Standard helper for querying, updating, and saving data.
 * Checks if local backend is active; if down (e.g. live on Vercel), fallback queries Supabase.
 */
import { supabase } from './supabase';
import { API_BASE_URL as API_BASE, getAssetUrl } from './api';

export { getAssetUrl };


const FALLBACK_DATA = {
  services: [
    {
      id: 1,
      title: "Industrial Automation & PLC/SCADA Integration",
      slug: "industrial-automation",
      short_description: "End-to-end automation design, Siemens/Rockwell PLC programming, HMI screen mapping, and SCADA architecture.",
      features: "PLC Programming, SCADA Systems, HMI Interface, PID Control Loops",
      status: "Publish"
    },
    {
      id: 2,
      title: "PCC & MCC Electrical Panel Manufacturing",
      slug: "electrical-panels",
      short_description: "Custom power control centers (PCC) and motor control centers (MCC) built to CPRI and CEIG compliance.",
      features: "CPRI Tested, Busbar Calculations, IP65 Enclosures, Thermal Scanning",
      status: "Publish"
    },
    {
      id: 3,
      title: "IIoT & Industry 4.0 Smart Gateway Solutions",
      slug: "iiot-solutions",
      short_description: "Connect legacy factory equipment to cloud dashboards for real-time telemetry, energy tracking, and predictive maintenance.",
      features: "Modbus/OPC-UA Gateways, Cloud Telemetry, Energy Analytics, Predictive Alerts",
      status: "Publish"
    },
    {
      id: 4,
      title: "Turnkey Mechanical & Electrical EPC Contracts",
      slug: "epc-contracts",
      short_description: "Concept to commissioning project execution: high-voltage cabling, structural trays, piping, and plant layout design.",
      features: "Turnkey Execution, Structural Piping, Cable Trays, Licensing Liaison",
      status: "Publish"
    },
    {
      id: 5,
      title: "Special Purpose Machines (SPM) & Retrofitting",
      slug: "special-purpose-machines",
      short_description: "Custom designed SPM machinery for high-speed component assembly, picking, and quality testing.",
      features: "Bespoke Jigs & Fixtures, Servo Motion Control, Machine Retrofits, Testing Benches",
      status: "Publish"
    },
    {
      id: 6,
      title: "Annual Maintenance Contracts (AMC) & Support",
      slug: "annual-maintenance-contracts",
      short_description: "Priority preventative maintenance checkups, emergency breakdown visits, and spare parts sourcing.",
      features: "24/7 Site Support, Scheduled Audits, Spare Sourcing, Calibration Checks",
      status: "Publish"
    }
  ],
  products: [
    {
      id: 1,
      name: "High Performance PCC & MCC Panels",
      slug: "pcc-mcc-panels",
      description: "Heavy-duty electrical power distribution and motor control enclosures built to industrial safety standards.",
      status: "Publish"
    },
    {
      id: 2,
      name: "Industrial IIoT Telemetry Gateway",
      slug: "iiot-telemetry-gateway",
      description: "Multi-protocol Modbus RS485 and Ethernet edge gateway for telemetry reporting and dashboard alerts.",
      status: "Publish"
    },
    {
      id: 3,
      name: "Custom SPM Assembly Workstations",
      slug: "spm-workstations",
      description: "Ergonomic operator benches equipped with pneumatic actuators, light curtains, and automated counters.",
      status: "Publish"
    }
  ],
  industries: [
    {
      id: 1,
      name: "Automotive & Manufacturing",
      slug: "automotive",
      description: "Robotic assembly lines, welding jigs, component testing rigs, and conveyor integration.",
      status: "Publish"
    },
    {
      id: 2,
      name: "Cement & Heavy Industries",
      slug: "cement",
      description: "Dust-proof IP65 panels, kiln telemetry, limestone crusher controls, and high-power drives.",
      status: "Publish"
    },
    {
      id: 3,
      name: "Marine & Offshore Engineering",
      slug: "marine",
      description: "Marine-grade SS316 panels, vibration-damped mounts, vessel telemetry, and Lloyds safety compliance.",
      status: "Publish"
    },
    {
      id: 4,
      name: "Process & Chemical Plants",
      slug: "process-chemical",
      description: "Explosion-proof instrumentation, PID loop tuning, chemical batching, and SCADA monitoring.",
      status: "Publish"
    }
  ],
  clients: [
    { id: 1, name: "Siemens", category: "Brand", status: "Publish" },
    { id: 2, name: "Schneider Electric", category: "Brand", status: "Publish" },
    { id: 3, name: "ABB", category: "Brand", status: "Publish" },
    { id: 4, name: "Mitsubishi Electric", category: "Brand", status: "Publish" },
    { id: 5, name: "Omron Automation", category: "Brand", status: "Publish" }
  ],
  blogs: [
    {
      id: 1,
      title: "Upgrading Legacy Industrial Plants into Industry 4.0 Frameworks",
      slug: "industry-4-0-upgrade",
      excerpt: "Discover step-by-step strategies for equipping conventional factory machinery with IoT edge gateways and cloud telemetry dashboards.",
      category_name: "Automation",
      created_at: new Date().toISOString(),
      status: "Publish"
    },
    {
      id: 2,
      title: "Key Safety Factors in Custom PCC & MCC Panel Engineering",
      slug: "panel-engineering-safety",
      excerpt: "Understanding CPRI testing, thermal insulation, busbar sizing, and CEIG approval requirements for electrical panels.",
      category_name: "Electrical",
      created_at: new Date().toISOString(),
      status: "Publish"
    }
  ]
};

/**
 * Perform a fetch to the backend or fallback to Supabase / local defaults
 */
export async function fetchCollection(endpoint, supabaseTable, selectQuery = '*') {
  try {
    const res = await fetch(`${API_BASE}${endpoint}`);
    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data) && data.length > 0) {
        return data;
      }
      if (typeof data === 'object' && Object.keys(data).length > 0 && !Array.isArray(data)) {
        return data;
      }
    }
  } catch (err) {
    console.warn(`Local backend down for ${endpoint}. Querying cloud DB.`);
  }

  // Supabase fallback
  try {
    const { data, error } = await supabase
      .from(supabaseTable)
      .select(selectQuery);
    
    if (!error && Array.isArray(data) && data.length > 0) {
      return data;
    }
  } catch (e) {
    console.warn(`Supabase fallback unavailable for ${supabaseTable}`);
  }

  // Return static fallback collection if backend and cloud DB are unpopulated
  return FALLBACK_DATA[supabaseTable] || [];
}


/**
 * Handle enquiry submission
 */
export async function submitEnquiry(enquiryForm) {
  // 1. Submit to Supabase directly (guarantees saving to Cloud DB)
  const { error } = await supabase
    .from('enquiries')
    .insert([{
      name: enquiryForm.name,
      company: enquiryForm.company,
      email: enquiryForm.email,
      phone: enquiryForm.phone,
      subject: enquiryForm.subject,
      service_interested: enquiryForm.serviceInterested,
      message: enquiryForm.message,
      status: 'Pending'
    }]);

  if (error) throw error;

  // 2. Submit to local backend if online (to trigger local Node SMTP emails)
  try {
    await fetch(`${API_BASE}/enquiry`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(enquiryForm)
    });
  } catch (err) {
    console.log('Local backend is offline; SMTP email not sent, but successfully stored in Supabase.');
  }

  return { success: true };
}

/**
 * Handle career application submission
 */
export async function submitCareerApplication(careerForm, resumeFile) {
  let resumePath = '';

  // Upload resume file to Supabase storage if possible
  if (resumeFile) {
    try {
      const fileExt = resumeFile.name.split('.').pop();
      const fileName = `${Date.now()}_${Math.random().toString(36).substring(2, 9)}.${fileExt}`;
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('resumes')
        .upload(fileName, resumeFile);

      if (!uploadError && uploadData) {
        const { data: { publicUrl } } = supabase.storage.from('resumes').getPublicUrl(fileName);
        resumePath = publicUrl;
      } else {
        // Fallback placeholder path if storage bucket doesn't exist
        resumePath = `uploads/resumes/${resumeFile.name}`;
      }
    } catch (e) {
      resumePath = `uploads/resumes/${resumeFile.name}`;
    }
  }

  // 1. Save record in Supabase career_applications table
  const { error } = await supabase
    .from('career_applications')
    .insert([{
      name: careerForm.name,
      email: careerForm.email,
      phone: careerForm.phone,
      qualification: careerForm.qualification,
      experience: careerForm.experience,
      resume_path: resumePath,
      cover_letter: careerForm.coverLetter,
      status: 'Pending'
    }]);

  if (error) throw error;

  // 2. Fallback backend call (for backend's Nodemailer to trigger attachment email)
  try {
    const formData = new FormData();
    formData.append('name', careerForm.name);
    formData.append('email', careerForm.email);
    formData.append('phone', careerForm.phone);
    formData.append('qualification', careerForm.qualification);
    formData.append('experience', careerForm.experience);
    formData.append('coverLetter', careerForm.coverLetter);
    formData.append('resume', resumeFile);

    await fetch(`${API_BASE}/career`, {
      method: 'POST',
      body: formData
    });
  } catch (err) {
    console.log('Local backend is offline; career application stored in Supabase.');
  }

  return { success: true };
}
