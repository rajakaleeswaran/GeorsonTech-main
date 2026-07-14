import React, { useState, useRef } from 'react';
import { Helmet } from 'react-helmet-async';
import { toast } from 'react-toastify';
import { FaBriefcase, FaUpload, FaChevronRight, FaMapMarkerAlt, FaGraduationCap, FaEnvelope, FaPhone } from 'react-icons/fa';
import TitleBar from '../components/TitleBar';
import ContactTitleImg from '../assets/Contact/titleImg.png';
import '../styles/Career.css';

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

function Career() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    qualification: '',
    experience: '',
    position: '',
    coverLetter: ''
  });
  const [resumeFile, setResumeFile] = useState(null);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const fileInputRef = useRef(null);
  const formRef = useRef(null);

  const handleApplyClick = (jobTitle) => {
    setForm(prev => ({ ...prev, position: jobTitle }));
    formRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const validate = () => {
    const errs = {};
    if (!form.name.trim()) errs.name = "Full name is required";
    if (!form.email.trim()) {
      errs.email = "Email address is required";
    } else if (!/\S+@\S+\.\S+/.test(form.email)) {
      errs.email = "Please enter a valid email address";
    }
    if (!form.phone.trim()) {
      errs.phone = "Phone number is required";
    } else if (!/^\+?[0-9\s-]{10,15}$/.test(form.phone.replace(/\s/g, ''))) {
      errs.phone = "Please enter a valid phone number";
    }
    if (!form.qualification.trim()) errs.qualification = "Qualification is required";
    if (!form.experience.trim()) errs.experience = "Experience details are required";
    if (!form.position) errs.position = "Please select the position you are applying for";
    if (!resumeFile) errs.resume = "Resume PDF/Word document is required";
    return errs;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: "" }));
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
      if (!allowedTypes.includes(file.type)) {
        setErrors(prev => ({ ...prev, resume: 'Only PDF, DOC, and DOCX files are allowed.' }));
        setResumeFile(null);
        return;
      }
      if (file.size > 10 * 1024 * 1024) { // 10MB limit
        setErrors(prev => ({ ...prev, resume: 'File size should not exceed 10MB.' }));
        setResumeFile(null);
        return;
      }
      setResumeFile(file);
      setErrors(prev => ({ ...prev, resume: '' }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      toast.error("Please correct the errors in the form.");
      return;
    }

    setSubmitting(true);
    try {
      const formData = new FormData();
      formData.append('name', form.name);
      formData.append('email', form.email);
      formData.append('phone', form.phone);
      formData.append('qualification', form.qualification);
      formData.append('experience', form.experience);
      formData.append('coverLetter', form.coverLetter);
      formData.append('position', form.position); // Note: position added to body
      formData.append('resume', resumeFile);

      const response = await fetch("http://localhost:5000/api/career", {
        method: "POST",
        body: formData
      });

      const data = await response.json();
      if (response.ok) {
        toast.success("Your career application has been successfully sent!");
        setForm({
          name: '',
          email: '',
          phone: '',
          qualification: '',
          experience: '',
          position: '',
          coverLetter: ''
        });
        setResumeFile(null);
        if (fileInputRef.current) fileInputRef.current.value = "";
      } else {
        toast.error(data.message || "Failed to submit career application.");
      }
    } catch (error) {
      console.error(error);
      toast.error("Network error. Failed to submit application.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>Careers – Georson Tech Pvt. Ltd | Join Our Team</title>
        <meta name="description" content="Explore job openings at Georson Tech Pvt. Ltd in Chennai & Coimbatore. Work with modern industrial automation, IIoT platforms, and panel assembly lines." />
        <link rel="canonical" href="https://www.georsontech.com/enquiry/career" />
      </Helmet>

      <div className="career-page">
        <TitleBar title="CAREERS" bg={ContactTitleImg} />

        <div className="container" style={{ padding: '60px 20px' }}>
          {/* Header Intro */}
          <div className="text-center" style={{ marginBottom: '50px' }}>
            <span className="section-label">Join Our Journey</span>
            <h1 className="section-title">Work With <span>Georson Tech</span></h1>
            <p className="section-subtitle">
              Build the future of industrial engineering, automation, and smart systems. We are looking for passionate, driven engineers and professionals to join our dynamic team.
            </p>
          </div>

          {/* Job Opportunities Section */}
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
                    <button onClick={() => handleApplyClick(job.title)} className="btn-primary" style={{ padding: '8px 20px', fontSize: '13px' }}>
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

          {/* Form Application Section */}
          <div ref={formRef} style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: '16px', padding: '40px 30px', boxShadow: '0 10px 30px rgba(0,0,0,0.05)', maxWidth: '800px', margin: '0 auto' }}>
            <h2 className="text-center" style={{ fontSize: '24px', fontWeight: '700', color: '#0f172a', marginBottom: '12px' }}>
              Job Application Form
            </h2>
            <p className="text-center" style={{ fontSize: '14px', color: '#64748b', marginBottom: '35px' }}>
              Please fill in your details below and upload your CV/Resume. All applications are sent directly to our HR team at <strong style={{ color: '#334155' }}>contact@georsontech.com</strong>.
            </p>

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                <div>
                  <label style={{ fontSize: '13.5px', fontWeight: '600', color: '#334155', display: 'block', marginBottom: '6px' }}>Full Name *</label>
                  <input
                    type="text"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    style={{ width: '100%', padding: '12px 16px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '14px' }}
                    placeholder="Enter your full name"
                  />
                  {errors.name && <p style={{ color: 'red', fontSize: '12px', marginTop: '4px' }}>{errors.name}</p>}
                </div>

                <div>
                  <label style={{ fontSize: '13.5px', fontWeight: '600', color: '#334155', display: 'block', marginBottom: '6px' }}>Email Address *</label>
                  <input
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    style={{ width: '100%', padding: '12px 16px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '14px' }}
                    placeholder="Enter your email"
                  />
                  {errors.email && <p style={{ color: 'red', fontSize: '12px', marginTop: '4px' }}>{errors.email}</p>}
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                <div>
                  <label style={{ fontSize: '13.5px', fontWeight: '600', color: '#334155', display: 'block', marginBottom: '6px' }}>Phone Number *</label>
                  <input
                    type="text"
                    name="phone"
                    value={form.phone}
                    onChange={handleChange}
                    style={{ width: '100%', padding: '12px 16px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '14px' }}
                    placeholder="Enter phone number"
                  />
                  {errors.phone && <p style={{ color: 'red', fontSize: '12px', marginTop: '4px' }}>{errors.phone}</p>}
                </div>

                <div>
                  <label style={{ fontSize: '13.5px', fontWeight: '600', color: '#334155', display: 'block', marginBottom: '6px' }}>Highest Qualification *</label>
                  <input
                    type="text"
                    name="qualification"
                    value={form.qualification}
                    onChange={handleChange}
                    style={{ width: '100%', padding: '12px 16px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '14px' }}
                    placeholder="e.g. B.E. Electrical Engineering, M.Tech"
                  />
                  {errors.qualification && <p style={{ color: 'red', fontSize: '12px', marginTop: '4px' }}>{errors.qualification}</p>}
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                <div>
                  <label style={{ fontSize: '13.5px', fontWeight: '600', color: '#334155', display: 'block', marginBottom: '6px' }}>Total Experience (Years) *</label>
                  <input
                    type="text"
                    name="experience"
                    value={form.experience}
                    onChange={handleChange}
                    style={{ width: '100%', padding: '12px 16px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '14px' }}
                    placeholder="e.g. Fresh Graduate, 3 Years"
                  />
                  {errors.experience && <p style={{ color: 'red', fontSize: '12px', marginTop: '4px' }}>{errors.experience}</p>}
                </div>

                <div>
                  <label style={{ fontSize: '13.5px', fontWeight: '600', color: '#334155', display: 'block', marginBottom: '6px' }}>Position Applied For *</label>
                  <select
                    name="position"
                    value={form.position}
                    onChange={handleChange}
                    style={{ width: '100%', padding: '12px 16px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '14px', background: '#fff', color: '#334155' }}
                  >
                    <option value="">-- Choose Position --</option>
                    <option value="PLC Automation Programmer">PLC Automation Programmer</option>
                    <option value="Electrical Panel Design Engineer">Electrical Panel Design Engineer</option>
                    <option value="IIoT & Industry 4.0 Deployment Engineer">IIoT & Industry 4.0 Deployment Engineer</option>
                    <option value="Sales / Account Manager">Sales / Account Manager</option>
                    <option value="Other Positions">Other Positions / Internships</option>
                  </select>
                  {errors.position && <p style={{ color: 'red', fontSize: '12px', marginTop: '4px' }}>{errors.position}</p>}
                </div>
              </div>

              <div>
                <label style={{ fontSize: '13.5px', fontWeight: '600', color: '#334155', display: 'block', marginBottom: '6px' }}>Cover Message / Summary</label>
                <textarea
                  name="coverLetter"
                  rows="4"
                  value={form.coverLetter}
                  onChange={handleChange}
                  style={{ width: '100%', padding: '12px 16px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '14px', resize: 'vertical' }}
                  placeholder="Introduce yourself or share brief summary of your background..."
                />
              </div>

              <div>
                <label style={{ fontSize: '13.5px', fontWeight: '600', color: '#334155', display: 'block', marginBottom: '6px' }}>Upload Resume (PDF, DOC, DOCX) *</label>
                <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                  <label className="btn-outline" style={{ cursor: 'pointer', margin: 0, padding: '10px 20px', borderRadius: '6px', display: 'flex', alignItems: 'center', gap: '8px', border: '1px dashed #0093DD', color: '#0093DD' }}>
                    <FaUpload /> Select File
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleFileChange}
                      style={{ display: 'none' }}
                      accept=".pdf,.doc,.docx"
                    />
                  </label>
                  <span style={{ fontSize: '13.5px', color: '#64748b' }}>
                    {resumeFile ? `${resumeFile.name} (${(resumeFile.size / 1024 / 1024).toFixed(2)} MB)` : "No file chosen (Max size 10MB)"}
                  </span>
                </div>
                {errors.resume && <p style={{ color: 'red', fontSize: '12px', marginTop: '6px' }}>{errors.resume}</p>}
              </div>

              <button type="submit" className="btn-primary" disabled={submitting} style={{ backgroundColor: '#0093DD', color: '#fff', justifyContent: 'center', marginTop: '10px', height: '48px', fontSize: '15px' }}>
                {submitting ? "Submitting Application..." : "Submit Job Application"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}

export default Career;
