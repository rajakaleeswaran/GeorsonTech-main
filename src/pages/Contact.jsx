import React, { useState } from "react";
import { Helmet } from 'react-helmet-async';
import { FaMapMarkerAlt, FaPhoneAlt, FaEnvelope } from "react-icons/fa";
import { FaInstagram, FaLinkedinIn, FaFacebookF, FaYoutube } from "react-icons/fa";
import { toast } from 'react-toastify';
import "../styles/Contact.css";
import TitleBar from "../components/TitleBar";
import ContactTitleImg from "../assets/Contact/titleImg.png";

function Contact() {
  const [form, setForm] = useState({
    name: "",
    company: "",
    email: "",
    phone: "",
    subject: "",
    serviceInterested: "",
    message: ""
  });
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

  const validate = () => {
    const errs = {};
    if (!form.name.trim()) errs.name = "Full name is required";
    if (!form.email.trim()) {
      errs.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(form.email)) {
      errs.email = "Please enter a valid email address";
    }
    if (!form.phone.trim()) {
      errs.phone = "Phone number is required";
    } else if (!/^\+?[0-9\s-]{10,15}$/.test(form.phone.replace(/\s/g, ''))) {
      errs.phone = "Please enter a valid phone number";
    }
    if (!form.subject.trim()) errs.subject = "Subject is required";
    if (!form.message.trim()) errs.message = "Message cannot be empty";
    return errs;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: "" }));
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
      const response = await fetch("http://localhost:5000/api/enquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          company: form.company,
          email: form.email,
          phone: form.phone,
          subject: form.subject,
          serviceInterested: form.serviceInterested || "General Enquiry",
          message: form.message
        })
      });

      const data = await response.json();
      if (response.ok) {
        toast.success("Thank you! Your enquiry has been submitted successfully.");
        setForm({
          name: "",
          company: "",
          email: "",
          phone: "",
          subject: "",
          serviceInterested: "",
          message: ""
        });
      } else {
        toast.error(data.message || "Something went wrong. Please try again.");
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to submit enquiry. Please check your connection.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>Contact Us – Georson Tech Pvt. Ltd | Engineering & Automation</title>
        <meta name="description" content="Get in touch with Georson Tech Pvt. Ltd. Contact our registered office in Chennai or manufacturing units in Coimbatore for project quotes and services." />
        <link rel="canonical" href="https://www.georsontech.com/enquiry/contact" />
      </Helmet>

      <div className="contact-page">
        <TitleBar title="CONTACT US" bg={ContactTitleImg}/>

        <div className="contact-wrapper">
          {/* LEFT CARD: Contact Details */}
          <div className="contact-card contact-left-card">
            <p className="contact-small-heading">GET IN TOUCH</p>
            <h2 className="contact-main-heading">Do You Have Any Questions?</h2>
            <p className="contact-description">
              If you have any questions or comments about our services,
              contact us using the form or the details below. We are here to assist you.
            </p>

            {/* Address */}
            <div className="contact-info-row">
              <div className="contact-info-title">
                <FaMapMarkerAlt className="contact-info-icon" />
                <h4 className="contact-info-heading">Registered Office</h4>
              </div>
              <p>
                No. #4/8, Sriram Nagar Main Road,<br />
                Karambakkam, Porur,<br />
                Chennai - 600 116
              </p>
            </div>

            {/* Phone */}
            <div className="contact-info-row">
              <div className="contact-info-title">
                <FaPhoneAlt className="contact-info-icon" />
                <h4 className="contact-info-heading">Phone Numbers</h4>
              </div>
              <p><strong>Registered Office:</strong> <a href="tel:+919840780897" style={{ color: '#0093DD' }}>+91 98407 80897</a></p>
              <p><strong>Coimbatore Branch:</strong> <a href="tel:+917845692697" style={{ color: '#0093DD' }}>+91 78456 92697</a></p>
            </div>

            {/* Email */}
            <div className="contact-info-row">
              <div className="contact-info-title">
                <FaEnvelope className="contact-info-icon" />
                <h4 className="contact-info-heading">Email</h4>
              </div>
              <p><strong>Main Branch:</strong> <a href="mailto:georsontech@gmail.com">georsontech@gmail.com</a></p>
              <p><strong>Coimbatore Units:</strong> <a href="mailto:covai@georsontech.com">covai@georsontech.com</a></p>
            </div>

            <div className="contact-social-icons">
              <a href="https://www.linkedin.com/company/georsontech" target="_blank" rel="noopener noreferrer" className="contact-social-circle contact-linkedin">
                <FaLinkedinIn />
              </a>
              <a href="https://www.instagram.com/georsontech" target="_blank" rel="noopener noreferrer" className="contact-social-circle contact-instagram">
                <FaInstagram />
              </a>
              <a href="https://www.facebook.com/georsontech" target="_blank" rel="noopener noreferrer" className="contact-social-circle contact-facebook">
                <FaFacebookF />
              </a>
              <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" className="contact-social-circle contact-youtube">
                <FaYoutube />
              </a>
            </div>
          </div>

          {/* RIGHT CARD: Message Form */}
          <div className="contact-card contact-right-card">
            <h2 className="contact-form-heading">Send us a message</h2>
            <form onSubmit={handleSubmit}>
              <div className="contact-form-group">
                <label>Full Name <span>*</span></label>
                <input
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="Enter your full name"
                />
                {errors.name && <p className="error-text" style={{ color: 'red', fontSize: '12px', marginTop: '4px' }}>{errors.name}</p>}
              </div>

              <div className="contact-form-group">
                <label>Company Name</label>
                <input
                  type="text"
                  name="company"
                  value={form.company}
                  onChange={handleChange}
                  placeholder="Enter your company name"
                />
              </div>

              <div className="contact-form-group">
                <label>Email Address <span>*</span></label>
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="Enter your email"
                />
                {errors.email && <p className="error-text" style={{ color: 'red', fontSize: '12px', marginTop: '4px' }}>{errors.email}</p>}
              </div>

              <div className="contact-form-group">
                <label>Phone Number <span>*</span></label>
                <input
                  type="text"
                  name="phone"
                  value={form.phone}
                  onChange={handleChange}
                  placeholder="Enter your phone number"
                />
                {errors.phone && <p className="error-text" style={{ color: 'red', fontSize: '12px', marginTop: '4px' }}>{errors.phone}</p>}
              </div>

              <div className="contact-form-group">
                <label>Service Interested In</label>
                <select
                  name="serviceInterested"
                  value={form.serviceInterested}
                  onChange={handleChange}
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    borderRadius: '6px',
                    border: '1px solid #cbd5e1',
                    fontSize: '14px',
                    color: '#334155',
                    background: '#fff'
                  }}
                >
                  <option value="">-- Select Service --</option>
                  <option value="Industrial Engineering">Industrial Engineering</option>
                  <option value="Industrial Automation">Industrial Automation</option>
                  <option value="IoT Solutions">IoT Solutions</option>
                  <option value="Electrical Panels">Electrical Panels</option>
                  <option value="Manufacturing Solutions">Manufacturing Solutions</option>
                  <option value="Engineering Consultancy">Engineering Consultancy</option>
                  <option value="General Enquiry">Other / General Enquiry</option>
                </select>
              </div>

              <div className="contact-form-group">
                <label>Subject <span>*</span></label>
                <input
                  type="text"
                  name="subject"
                  value={form.subject}
                  onChange={handleChange}
                  placeholder="Enter subject of your message"
                />
                {errors.subject && <p className="error-text" style={{ color: 'red', fontSize: '12px', marginTop: '4px' }}>{errors.subject}</p>}
              </div>

              <div className="contact-form-group">
                <label>Message <span>*</span></label>
                <textarea
                  name="message"
                  rows="5"
                  value={form.message}
                  onChange={handleChange}
                  placeholder="Your message here..."
                />
                {errors.message && <p className="error-text" style={{ color: 'red', fontSize: '12px', marginTop: '4px' }}>{errors.message}</p>}
              </div>

              <button type="submit" className="contact-send-btn" disabled={submitting} style={{ backgroundColor: '#0093DD', color: '#fff', fontWeight: 'bold' }}>
                {submitting ? "Sending..." : "Send Message →"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}

export default Contact;