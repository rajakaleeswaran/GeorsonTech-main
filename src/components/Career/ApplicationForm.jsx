import React, { useState, useRef, useEffect } from 'react';
import { toast } from 'react-toastify';
import { FaUpload } from 'react-icons/fa';

function ApplicationForm({ selectedJob }) {
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

  useEffect(() => {
    if (selectedJob) {
      setForm(prev => ({ ...prev, position: selectedJob }));
      if (errors.position) {
        setErrors(prev => ({ ...prev, position: "" }));
      }
    }
  }, [selectedJob, errors.position]);

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
      formData.append('position', form.position);
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
    <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: '16px', padding: '40px 30px', boxShadow: '0 10px 30px rgba(0,0,0,0.05)', maxWidth: '800px', margin: '0 auto' }}>
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
  );
}

export default ApplicationForm;
