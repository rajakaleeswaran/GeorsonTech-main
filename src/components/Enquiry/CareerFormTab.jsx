import React from 'react';
import { FaUpload, FaPaperPlane } from 'react-icons/fa';

function CareerFormTab({
  careerForm,
  careerErrors,
  handleCareerChange,
  handleFileChange,
  handleCareerSubmit,
  resume,
  fileInputRef,
  submitting
}) {
  return (
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
  );
}

export default CareerFormTab;
