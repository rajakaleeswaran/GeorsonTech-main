/**
 * @file Enquiry.jsx
 * @description Page coordinating both Business Enquiry requests and Career Applications.
 * Parses search parameters to dynamically pre-populate forms and coordinates submission logic.
 */
import React, { useState, useRef, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { toast } from 'react-toastify';
import { FaBuilding, FaBriefcase } from 'react-icons/fa';
import TitleBar from '../components/TitleBar';
import ContactTitleImg from '../assets/Contact/titleImg.png';
import '../styles/Enquiry.css';
import { submitEnquiry, submitCareerApplication } from '../lib/dbHelper';

// Modular components
import EnquiryFormTab from '../components/Enquiry/EnquiryFormTab';
import CareerFormTab from '../components/Enquiry/CareerFormTab';
import EnquiryInfoPanel from '../components/Enquiry/EnquiryInfoPanel';

function Enquiry() {
  const [searchParams] = useSearchParams();
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

  useEffect(() => {
    const tabParam = searchParams.get('tab');
    if (tabParam === 'career') {
      setActiveTab('career');
    } else if (tabParam === 'enquiry') {
      setActiveTab('enquiry');
    }

    const serviceParam = searchParams.get('service');
    const productParam = searchParams.get('product');
    const subjectParam = searchParams.get('subject');

    let initialSubject = '';
    let initialService = '';

    if (serviceParam) {
      initialService = serviceParam;
      initialSubject = `Enquiry about ${serviceParam}`;
    } else if (productParam) {
      initialSubject = `Product Enquiry: ${productParam}`;
    } else if (subjectParam) {
      initialSubject = subjectParam;
    }

    setEnquiryForm(prev => ({
      ...prev,
      subject: initialSubject || prev.subject,
      serviceInterested: initialService || prev.serviceInterested
    }));
  }, [searchParams]);
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
      await submitEnquiry(enquiryForm);
      setSubmitted(true);
      toast.success('Your business enquiry has been submitted successfully!');
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
      console.error(error);
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
      await submitCareerApplication(careerForm, resume);
      setSubmitted(true);
      toast.success('Your job application has been submitted successfully!');
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
      console.error('[Career Submit Error]:', error);
      toast.error(`Failed to submit: ${error?.message || 'Please try again.'}`);
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
                <EnquiryFormTab
                  enquiryForm={enquiryForm}
                  enquiryErrors={enquiryErrors}
                  handleEnquiryChange={handleEnquiryChange}
                  handleEnquirySubmit={handleEnquirySubmit}
                  submitting={submitting}
                />
              ) : (
                <CareerFormTab
                  careerForm={careerForm}
                  careerErrors={careerErrors}
                  handleCareerChange={handleCareerChange}
                  handleFileChange={handleFileChange}
                  handleCareerSubmit={handleCareerSubmit}
                  resume={resume}
                  fileInputRef={fileInputRef}
                  submitting={submitting}
                />
              )}
            </div>

            {/* Info Panel Column */}
            <EnquiryInfoPanel />
          </div>

        </div>
      </div>
    </>
  );
}

export default Enquiry;