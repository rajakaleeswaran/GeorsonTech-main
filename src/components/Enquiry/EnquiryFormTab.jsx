import React from 'react';
import { FaPaperPlane } from 'react-icons/fa';

function EnquiryFormTab({
  enquiryForm,
  enquiryErrors,
  handleEnquiryChange,
  handleEnquirySubmit,
  submitting
}) {
  return (
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
  );
}

export default EnquiryFormTab;
