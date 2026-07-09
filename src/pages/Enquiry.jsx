import React, { useState, useRef } from 'react';
import { Helmet } from 'react-helmet-async';
import { toast } from 'react-toastify';
import {
  FaBuilding, FaEnvelope, FaPhone, FaUser, FaBriefcase, FaUpload,
  FaMapMarkerAlt, FaPaperPlane, FaClock
} from 'react-icons/fa';
import TitleBar from '../components/TitleBar';
import ContactTitleImg from '../assets/Contact/titleImg.png';
import '../styles/Enquiry.css';

function Enquiry() {
  const [activeTab, setActiveTab] = useState('enquiry'); // 'enquiry' or 'career'
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  // Enquiry Form State
  const [enquiryForm, setEnquiryForm] = useState({
    name: '',
    company: '',
    email: '',
    phone: '',
    subject: '',
    serviceInterested: '',
    message: ''
  });
  const [enquiryErrors, setEnquiryErrors] = useState({});

  // Career Form State
  const [careerForm, setCareerForm] = useState({
    name: '',
    email: '',
    phone: '',
    qualification: '',
    experience: '',
    coverLetter: ''
  });
  const [resume, setResume] = useState(null);
  const [careerErrors, setCareerErrors] = useState({});
  const fileInputRef = useRef(null);

  // Handle Enquiry Input Changes
  const handleEnquiryChange = (e) => {
    const { name, value } = e.target;
    setEnquiryForm(prev => ({ ...prev, [name]: value }));
    if (enquiryErrors[name]) {
      setEnquiryErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  // Handle Career Input Changes
  const handleCareerChange = (e) => {
    const { name, value } = e.target;
    setCareerForm(prev => ({ ...prev, [name]: value }));
    if (careerErrors[name]) {
      setCareerErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  // Handle File Input
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file size (e.g., 5MB limit) and type
      const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
      if (!allowedTypes.includes(file.type)) {
        setCareerErrors(prev => ({ ...prev, resume: 'Only PDF, DOC, and DOCX files are allowed.' }));
        setResume(null);
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        setCareerErrors(prev => ({ ...prev, resume: 'File size should not exceed 5MB.' }));
        setResume(null);
        return;
      }
      setResume(file);
      setCareerErrors(prev => ({ ...prev, resume: '' }));
    }
  };

  // Validate Enquiry Form
  const validateEnquiry = () => {
    const errors = {};
    if (!enquiryForm.name.trim()) errors.name = 'Name is required';
    if (!enquiryForm.email.trim()) {
      errors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(enquiryForm.email)) {
      errors.email = 'Invalid email address';
    }
    if (!enquiryForm.phone.trim()) {
      errors.phone = 'Phone number is required';
    } else if (!/^\+?[0-9\s-]{10,15}$/.test(enquiryForm.phone.replace(/\s/g, ''))) {
      errors.phone = 'Invalid phone number';
    }
    if (!enquiryForm.subject.trim()) errors.subject = 'Subject is required';
    if (!enquiryForm.serviceInterested) errors.serviceInterested = 'Please select a service';
    if (!enquiryForm.message.trim()) errors.message = 'Message is required';
    return errors;
  };

  // Validate Career Form
  const validateCareer = () => {
    const errors = {};
    if (!careerForm.name.trim()) errors.name = 'Name is required';
    if (!careerForm.email.trim()) {
      errors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(careerForm.email)) {
      errors.email = 'Invalid email address';
    }
    if (!careerForm.phone.trim()) {
      errors.phone = 'Phone number is required';
    } else if (!/^\+?[0-9\s-]{10,15}$/.test(careerForm.phone.replace(/\s/g, ''))) {
      errors.phone = 'Invalid phone number';
    }
    if (!careerForm.qualification.trim()) errors.qualification = 'Qualification is required';
    if (!careerForm.experience.trim()) errors.experience = 'Experience is required';
    if (!resume) errors.resume = 'Resume upload is required';
    return errors;
  };

  // Submit Enquiry Form
  const handleEnquirySubmit = async (e) => {
    e.preventDefault();
    const errors = validateEnquiry();
    if (Object.keys(errors).length > 0) {
      setEnquiryErrors(errors);
      toast.error('Please correct the errors in the form.');
      return;
    }

    setSubmitting(true);
    try {
      // Phase 2 will link this to the Express backend / MySQL.
      // For Phase 1 we simulate successful submission.
      await new Promise(resolve => setTimeout(resolve, 1500));
      setSubmitted(true);
      toast.success('Your business enquiry has been submitted successfully!');
      // Reset Form
      setEnquiryForm({
        name: '',
        company: '',
        email: '',
        phone: '',
        subject: '',
        serviceInterested: '',
        message: ''
      });
    } catch (error) {
      toast.error('Failed to submit enquiry. Please try again later.');
    } finally {
      setSubmitting(false);
    }
  };

  // Submit Career Form
  const handleCareerSubmit = async (e) => {
    e.preventDefault();
    const errors = validateCareer();
    if (Object.keys(errors).length > 0) {
      setCareerErrors(errors);
      toast.error('Please correct the errors in the form.');
      return;
    }

    setSubmitting(true);
    try {
      // Phase 2 will handle FormData and upload the file to Express/Multer
      await new Promise(resolve => setTimeout(resolve, 1500));
      setSubmitted(true);
      toast.success('Your job application has been submitted successfully!');
      // Reset Form
      setCareerForm({
        name: '',
        email: '',
        phone: '',
        qualification: '',
        experience: '',
        coverLetter: ''
      });
      setResume(null);
      if (fileInputRef.current) fileInputRef.current.value = '';
    } catch (error) {
      toast.error('Failed to submit application. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>{activeTab === 'enquiry' ? 'Business Enquiry' : 'Careers'} – Georson Tech Pvt. Ltd</title>
        <meta name="description" content="Get in touch with Georson Tech for Business Enquiries or explore career opportunities. Apply now and join our engineering team." />
        <link rel="canonical" href="https://www.georsontech.com/enquiry" />
      </Helmet>

      <TitleBar title="ENQUIRY & CAREERS" bg={ContactTitleImg} />

      <div className="enquiry-page" style={{ padding: '60px 0' }}>
        <div className="container" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          
          {/* Tab Switcher */}
          <div className="enquiry-tabs">
            <button 
              className={`enquiry-tab ${activeTab === 'enquiry' ? 'active' : ''}`}
              onClick={() => { setActiveTab('enquiry'); setSubmitted(false); }}
            >
              <FaBuilding /> Business Enquiry
            </button>
            <button 
              className={`enquiry-tab ${activeTab === 'career' ? 'active' : ''}`}
              onClick={() => { setActiveTab('career'); setSubmitted(false); }}
            >
              <FaBriefcase /> Apply for Careers
            </button>
          </div>

          <div className="enquiry-layout">
            {/* Form Column */}
            <div className="enquiry-form-card">
              {submitted ? (
                <div className="form-success-msg">
                  <h3>Thank You!</h3>
                  <p>Your details have been recorded successfully. Our team will contact you shortly.</p>
                  <button 
                    className="btn-primary" 
                    style={{ marginTop: '20px' }}
                    onClick={() => setSubmitted(false)}
                  >
                    Submit Another Form
                  </button>
                </div>
              ) : activeTab === 'enquiry' ? (
                /* Business Enquiry Form */
                <form onSubmit={handleEnquirySubmit}>
                  <h3 className="enquiry-form-title">Business Enquiry</h3>
                  <p className="enquiry-form-subtitle">
                    Need automation, IIoT, or engineering solutions? Fill in the details below and our technical experts will get back to you with a custom quote.
                  </p>

                  <div className="form-row">
                    <div className="form-group">
                      <label htmlFor="name">Name <span>*</span></label>
                      <input 
                        type="text" 
                        id="name" 
                        name="name"
                        value={enquiryForm.name}
                        onChange={handleEnquiryChange}
                        className={`form-input ${enquiryErrors.name ? 'error' : ''}`} 
                        placeholder="John Doe"
                      />
                      {enquiryErrors.name && <span className="form-error-msg">{enquiryErrors.name}</span>}
                    </div>

                    <div className="form-group">
                      <label htmlFor="company">Company Name</label>
                      <input 
                        type="text" 
                        id="company" 
                        name="company"
                        value={enquiryForm.company}
                        onChange={handleEnquiryChange}
                        className="form-input" 
                        placeholder="Company Pvt. Ltd."
                      />
                    </div>
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label htmlFor="email">Email Address <span>*</span></label>
                      <input 
                        type="email" 
                        id="email" 
                        name="email"
                        value={enquiryForm.email}
                        onChange={handleEnquiryChange}
                        className={`form-input ${enquiryErrors.email ? 'error' : ''}`} 
                        placeholder="john@company.com"
                      />
                      {enquiryErrors.email && <span className="form-error-msg">{enquiryErrors.email}</span>}
                    </div>

                    <div className="form-group">
                      <label htmlFor="phone">Phone Number <span>*</span></label>
                      <input 
                        type="tel" 
                        id="phone" 
                        name="phone"
                        value={enquiryForm.phone}
                        onChange={handleEnquiryChange}
                        className={`form-input ${enquiryErrors.phone ? 'error' : ''}`} 
                        placeholder="+91 98765 43210"
                      />
                      {enquiryErrors.phone && <span className="form-error-msg">{enquiryErrors.phone}</span>}
                    </div>
                  </div>

                  <div className="form-group">
                    <label htmlFor="serviceInterested">Service Interested In <span>*</span></label>
                    <select 
                      id="serviceInterested" 
                      name="serviceInterested"
                      value={enquiryForm.serviceInterested}
                      onChange={handleEnquiryChange}
                      className={`form-select ${enquiryErrors.serviceInterested ? 'error' : ''}`}
                    >
                      <option value="">-- Select Service --</option>
                      <option value="Industrial Automation">Industrial Automation (PLC / SCADA)</option>
                      <option value="IIoT Solutions">IIoT Solutions & Industry 4.0</option>
                      <option value="Electrical Panels">Electrical Panels (MCC / PCC / VFD)</option>
                      <option value="Industrial Engineering">Industrial Engineering & Systems</option>
                      <option value="Consultancy & Audits">Consultancy & Energy Audits</option>
                      <option value="Others">Others</option>
                    </select>
                    {enquiryErrors.serviceInterested && <span className="form-error-msg">{enquiryErrors.serviceInterested}</span>}
                  </div>

                  <div className="form-group">
                    <label htmlFor="subject">Subject <span>*</span></label>
                    <input 
                      type="text" 
                      id="subject" 
                      name="subject"
                      value={enquiryForm.subject}
                      onChange={handleEnquiryChange}
                      className={`form-input ${enquiryErrors.subject ? 'error' : ''}`} 
                      placeholder="e.g. PLC SCADA System Upgrade Quote"
                    />
                    {enquiryErrors.subject && <span className="form-error-msg">{enquiryErrors.subject}</span>}
                  </div>

                  <div className="form-group">
                    <label htmlFor="message">Message <span>*</span></label>
                    <textarea 
                      id="message" 
                      name="message"
                      value={enquiryForm.message}
                      onChange={handleEnquiryChange}
                      className={`form-textarea ${enquiryErrors.message ? 'error' : ''}`} 
                      placeholder="Write your requirement details here..."
                    />
                    {enquiryErrors.message && <span className="form-error-msg">{enquiryErrors.message}</span>}
                  </div>

                  <button 
                    type="submit" 
                    className="form-submit-btn"
                    disabled={submitting}
                  >
                    <FaPaperPlane /> {submitting ? 'Submitting...' : 'Submit Enquiry'}
                  </button>
                </form>
              ) : (
                /* Career Application Form */
                <form onSubmit={handleCareerSubmit}>
                  <h3 className="enquiry-form-title">Join Our Team</h3>
                  <p className="enquiry-form-subtitle">
                    Explore career opportunities with Georson Tech. Submit your details, qualification, experience level, and upload your resume.
                  </p>

                  <div className="form-group">
                    <label htmlFor="c-name">Full Name <span>*</span></label>
                    <input 
                      type="text" 
                      id="c-name" 
                      name="name"
                      value={careerForm.name}
                      onChange={handleCareerChange}
                      className={`form-input ${careerErrors.name ? 'error' : ''}`} 
                      placeholder="John Doe"
                    />
                    {careerErrors.name && <span className="form-error-msg">{careerErrors.name}</span>}
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label htmlFor="c-email">Email Address <span>*</span></label>
                      <input 
                        type="email" 
                        id="c-email" 
                        name="email"
                        value={careerForm.email}
                        onChange={handleCareerChange}
                        className={`form-input ${careerErrors.email ? 'error' : ''}`} 
                        placeholder="john@example.com"
                      />
                      {careerErrors.email && <span className="form-error-msg">{careerErrors.email}</span>}
                    </div>

                    <div className="form-group">
                      <label htmlFor="c-phone">Phone Number <span>*</span></label>
                      <input 
                        type="tel" 
                        id="c-phone" 
                        name="phone"
                        value={careerForm.phone}
                        onChange={handleCareerChange}
                        className={`form-input ${careerErrors.phone ? 'error' : ''}`} 
                        placeholder="+91 98765 43210"
                      />
                      {careerErrors.phone && <span className="form-error-msg">{careerErrors.phone}</span>}
                    </div>
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label htmlFor="c-qualification">Highest Qualification <span>*</span></label>
                      <input 
                        type="text" 
                        id="c-qualification" 
                        name="qualification"
                        value={careerForm.qualification}
                        onChange={handleCareerChange}
                        className={`form-input ${careerErrors.qualification ? 'error' : ''}`} 
                        placeholder="e.g. B.E. Electrical & Electronics"
                      />
                      {careerErrors.qualification && <span className="form-error-msg">{careerErrors.qualification}</span>}
                    </div>

                    <div className="form-group">
                      <label htmlFor="c-experience">Experience (in Years) <span>*</span></label>
                      <select 
                        id="c-experience" 
                        name="experience"
                        value={careerForm.experience}
                        onChange={handleCareerChange}
                        className={`form-select ${careerErrors.experience ? 'error' : ''}`}
                      >
                        <option value="">-- Select Experience --</option>
                        <option value="Fresher">Fresher</option>
                        <option value="1-2 Years">1-2 Years</option>
                        <option value="3-5 Years">3-5 Years</option>
                        <option value="5+ Years">5+ Years</option>
                      </select>
                      {careerErrors.experience && <span className="form-error-msg">{careerErrors.experience}</span>}
                    </div>
                  </div>

                  <div className="form-group">
                    <label>Upload Resume (PDF, DOC, DOCX) <span>*</span></label>
                    <div 
                      className={`file-upload-box ${careerErrors.resume ? 'error' : ''}`}
                      onClick={() => fileInputRef.current.click()}
                    >
                      <FaUpload className="file-upload-icon" />
                      <div className="file-upload-label">
                        <span>Click to upload</span> or drag and drop your file here
                      </div>
                      <p className="file-upload-hint">Max file size: 5MB</p>
                      <input 
                        type="file" 
                        ref={fileInputRef} 
                        style={{ display: 'none' }}
                        onChange={handleFileChange}
                        accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                      />
                      {resume && <p className="file-selected">Selected file: {resume.name}</p>}
                    </div>
                    {careerErrors.resume && <span className="form-error-msg">{careerErrors.resume}</span>}
                  </div>

                  <div className="form-group">
                    <label htmlFor="c-coverLetter">Brief Cover Letter / Comments</label>
                    <textarea 
                      id="c-coverLetter" 
                      name="coverLetter"
                      value={careerForm.coverLetter}
                      onChange={handleCareerChange}
                      className="form-textarea" 
                      placeholder="Tell us why you want to work with us..."
                    />
                  </div>

                  <button 
                    type="submit" 
                    className="form-submit-btn"
                    disabled={submitting}
                  >
                    <FaPaperPlane /> {submitting ? 'Submitting...' : 'Apply Now'}
                  </button>
                </form>
              )}
            </div>

            {/* Info Panel Column */}
            <div className="enquiry-info-panel">
              <div className="enquiry-info-card">
                <h4>Contact Details</h4>
                
                <div className="enquiry-contact-item">
                  <div className="enquiry-contact-icon"><FaPhone /></div>
                  <div className="enquiry-contact-info">
                    <h5>Call Us</h5>
                    <a href="tel:+919840780897">+91 98407 80897</a><br />
                    <a href="tel:+919500081901">+91 95000 81901</a>
                  </div>
                </div>

                <div className="enquiry-contact-item">
                  <div className="enquiry-contact-icon"><FaEnvelope /></div>
                  <div className="enquiry-contact-info">
                    <h5>Email Support</h5>
                    <a href="mailto:projects@georsontech.com">projects@georsontech.com</a><br />
                    <a href="mailto:georsontech@gmail.com">georsontech@gmail.com</a>
                  </div>
                </div>

                <div className="enquiry-contact-item">
                  <div className="enquiry-contact-icon"><FaClock /></div>
                  <div className="enquiry-contact-info">
                    <h5>Working Hours</h5>
                    <p>Mon - Sat: 9:00 AM - 6:00 PM</p>
                    <p>Sunday: Closed</p>
                  </div>
                </div>
              </div>

              <div className="enquiry-info-card">
                <h4>Registered Office</h4>
                <div className="enquiry-contact-item">
                  <div className="enquiry-contact-icon"><FaMapMarkerAlt /></div>
                  <div className="enquiry-contact-info">
                    <h5>Chennai Location</h5>
                    <p>No. #4/8, Sriram Nagar Main Road, Karambakkam, Porur, Chennai – 600 116.</p>
                  </div>
                </div>
              </div>

              <div className="enquiry-map">
                {/* Embedded Chennai Map */}
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3887.079207050303!2d80.1570535!3d12.9922097!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMTLCsDU5JzMxLjEiTiA4MMKwMDknMzMuMyJF!5e0!3m2!1sen!2sin!4v1688123456789"
                  allowFullScreen=""
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Chennai Office Map"
                />
              </div>
            </div>
          </div>

        </div>
      </div>
    </>
  );
}

export default Enquiry;
