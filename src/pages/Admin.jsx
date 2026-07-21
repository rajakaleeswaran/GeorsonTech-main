/**
 * @file Admin.jsx
 * @description Main dashboard control panel page for Super Admin.
 * Coordinates all CMS operations by distributing modularized tabs and using
 * the useAdminState hook for backend logic and state management.
 */
import React from 'react';
import { Helmet } from 'react-helmet-async';
import {
  FaLock, FaChartBar, FaFileAlt, FaBriefcase, FaBox, FaRss,
  FaSignOutAlt, FaTimes, FaBuilding, FaGlobe, FaCog, FaCogs, FaImages,
  FaEnvelope, FaPhone, FaDownload, FaCopy, FaExternalLinkAlt
} from 'react-icons/fa';
import { toast } from 'react-toastify';
import '../styles/Admin.css';

import useAdminState from '../hooks/useAdminState';
import { getAssetUrl } from '../lib/api';
import LogoImg from '../assets/Logo/Georson.png';



// Tab Sub-Components
import DashboardTab from '../components/Admin/DashboardTab';
import ServicesTab from '../components/Admin/ServicesTab';
import ProductsTab from '../components/Admin/ProductsTab';
import IndustriesTab from '../components/Admin/IndustriesTab';
import ClientsTab from '../components/Admin/ClientsTab';
import BlogsTab from '../components/Admin/BlogsTab';
import SolutionsTab from '../components/Admin/SolutionsTab';
import LocationsTab from '../components/Admin/LocationsTab';
import EnquiriesTab from '../components/Admin/EnquiriesTab';
import CareersTab from '../components/Admin/CareersTab';
import SettingsTab from '../components/Admin/SettingsTab';
import MediaTab from '../components/Admin/MediaTab';

function Admin() {
  const admin = useAdminState();

  return (
    <>
      <Helmet>
        <title>CMS Dashboard Control Center – Georson Tech Pvt. Ltd</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>

      <div className="admin-page">
        {!admin.isAuthenticated ? (
          <div className="admin-login-card">
            <img src={LogoImg} alt="Georson Tech" className="admin-login-logo" />
            <h2 className="admin-login-title">Dynamic CMS Panel</h2>
            <p className="admin-login-subtitle">Authenticate to adjust services, products, industries, media, and settings.</p>

            
            <form onSubmit={admin.handleLoginSubmit}>
              <div className="form-group">
                <label>Admin Email</label>
                <input 
                  type="email" className="form-input" required
                  value={admin.loginData.username}
                  onChange={e => admin.setLoginData(prev => ({ ...prev, username: e.target.value }))}
                  placeholder="admin@georsontech.com"
                />
              </div>

              <div className="form-group">
                <label>Password</label>
                <input 
                  type="password" className="form-input" required
                  value={admin.loginData.password}
                  onChange={e => admin.setLoginData(prev => ({ ...prev, password: e.target.value }))}
                  placeholder="••••••••"
                />
              </div>

              <button type="submit" className="form-submit-btn" disabled={admin.submitting}>
                <FaLock /> {admin.submitting ? 'Signing In...' : 'Verify Identity'}
              </button>
            </form>
          </div>
        ) : (
          <div className="admin-workspace">
            {/* Sidebar Navigation */}
            <aside className="admin-sidebar" style={{ minWidth: '240px' }}>
              <div className="admin-sidebar-header">
                <span className="admin-user-info">{admin.user?.username}</span>
                <span className="admin-user-role">{admin.user?.role}</span>
              </div>

              <button className={`admin-nav-item ${admin.activeTab === 'dashboard' ? 'active' : ''}`} onClick={() => admin.setActiveTab('dashboard')}>
                <FaChartBar /> Analytics Panel
              </button>

              <button className={`admin-nav-item ${admin.activeTab === 'services' ? 'active' : ''}`} onClick={() => admin.setActiveTab('services')}>
                <FaCogs /> Services CMS
              </button>

              <button className={`admin-nav-item ${admin.activeTab === 'products' ? 'active' : ''}`} onClick={() => admin.setActiveTab('products')}>
                <FaBox /> Products Catalog
              </button>

              <button className={`admin-nav-item ${admin.activeTab === 'product_categories' ? 'active' : ''}`} onClick={() => admin.setActiveTab('product_categories')}>
                <FaBox /> Product Categories
              </button>

              <button className={`admin-nav-item ${admin.activeTab === 'industries' ? 'active' : ''}`} onClick={() => admin.setActiveTab('industries')}>
                <FaBuilding /> Industries Serve
              </button>

              <button className={`admin-nav-item ${admin.activeTab === 'clients' ? 'active' : ''}`} onClick={() => admin.setActiveTab('clients')}>
                <FaGlobe /> Clients & Logos
              </button>

              <button className={`admin-nav-item ${admin.activeTab === 'blogs' ? 'active' : ''}`} onClick={() => admin.setActiveTab('blogs')}>
                <FaRss /> Blogs articles
              </button>

              <button className={`admin-nav-item ${admin.activeTab === 'solutions' ? 'active' : ''}`} onClick={() => admin.setActiveTab('solutions')}>
                <FaCogs /> Solutions Ecosystem
              </button>

              <button className={`admin-nav-item ${admin.activeTab === 'solution_categories' ? 'active' : ''}`} onClick={() => admin.setActiveTab('solution_categories')}>
                <FaCogs /> Solution Categories
              </button>

              <button className={`admin-nav-item ${admin.activeTab === 'locations' ? 'active' : ''}`} onClick={() => admin.setActiveTab('locations')}>
                <FaBuilding /> Offices CRUD
              </button>

              <button className={`admin-nav-item ${admin.activeTab === 'enquiries' ? 'active' : ''}`} onClick={() => admin.setActiveTab('enquiries')}>
                <FaFileAlt /> Enquiries Log
              </button>

              <button className={`admin-nav-item ${admin.activeTab === 'careers' ? 'active' : ''}`} onClick={() => admin.setActiveTab('careers')}>
                <FaBriefcase /> Candidates HR
              </button>

              <button className={`admin-nav-item ${admin.activeTab === 'settings' ? 'active' : ''}`} onClick={() => admin.setActiveTab('settings')}>
                <FaCog /> Web Settings
              </button>

              <button className={`admin-nav-item ${admin.activeTab === 'media' ? 'active' : ''}`} onClick={() => admin.setActiveTab('media')}>
                <FaImages /> Media Library
              </button>

              <button className="admin-nav-item admin-logout-btn" onClick={admin.handleLogout}>
                <FaSignOutAlt /> Sign Out
              </button>
            </aside>

            {/* Dashboard workspace */}
            <main className="admin-content-area">
              {admin.activeTab === 'dashboard' && (
                <DashboardTab
                  metrics={admin.metrics}
                  visitorBreakdown={admin.visitorBreakdown}
                  setActiveTab={admin.setActiveTab}
                  setEditingService={admin.setEditingService}
                  setServiceForm={admin.setServiceForm}
                  setEditingProduct={admin.setEditingProduct}
                  setProductForm={admin.setProductForm}
                  setEditingProductCategory={admin.setEditingProductCategory}
                  setProductCategoryForm={admin.setProductCategoryForm}
                  setEditingClient={admin.setEditingClient}
                  setClientForm={admin.setClientForm}
                  setEditingBlog={admin.setEditingBlog}
                  setBlogForm={admin.setBlogForm}
                />
              )}

              {admin.activeTab === 'services' && (
                <ServicesTab
                  services={admin.services}
                  editingService={admin.editingService}
                  setEditingService={admin.setEditingService}
                  serviceForm={admin.serviceForm}
                  setServiceForm={admin.setServiceForm}
                  setServiceImage={admin.setServiceImage}
                  setServiceBrochure={admin.setServiceBrochure}
                  saveService={admin.saveService}
                  deleteServiceItem={admin.deleteServiceItem}
                />
              )}

              {(admin.activeTab === 'products' || admin.activeTab === 'product_categories') && (
                <ProductsTab
                  activeTab={admin.activeTab}
                  products={admin.products}
                  productCategories={admin.productCategories}
                  editingProduct={admin.editingProduct}
                  setEditingProduct={admin.setEditingProduct}
                  editingProductCategory={admin.editingProductCategory}
                  setEditingProductCategory={admin.setEditingProductCategory}
                  productForm={admin.productForm}
                  setProductForm={admin.setProductForm}
                  productCategoryForm={admin.productCategoryForm}
                  setProductCategoryForm={admin.setProductCategoryForm}
                  setProductImage={admin.setProductImage}
                  setProductBrochure={admin.setProductBrochure}
                  saveProduct={admin.saveProduct}
                  deleteProductItem={admin.deleteProductItem}
                  saveProductCategory={admin.saveProductCategory}
                  deleteProductCategoryItem={admin.deleteProductCategoryItem}
                />
              )}

              {admin.activeTab === 'industries' && (
                <IndustriesTab
                  industries={admin.industries}
                  editingIndustry={admin.editingIndustry}
                  setEditingIndustry={admin.setEditingIndustry}
                  industryForm={admin.industryForm}
                  setIndustryForm={admin.setIndustryForm}
                  setIndustryImage={admin.setIndustryImage}
                  saveIndustry={admin.saveIndustry}
                  deleteIndustryItem={admin.deleteIndustryItem}
                />
              )}

              {admin.activeTab === 'clients' && (
                <ClientsTab
                  clients={admin.clients}
                  editingClient={admin.editingClient}
                  setEditingClient={admin.setEditingClient}
                  clientForm={admin.clientForm}
                  setClientForm={admin.setClientForm}
                  setClientLogo={admin.setClientLogo}
                  saveClient={admin.saveClient}
                  deleteClientItem={admin.deleteClientItem}
                />
              )}

              {admin.activeTab === 'blogs' && (
                <BlogsTab
                  blogs={admin.blogs}
                  blogCategories={admin.blogCategories}
                  editingBlog={admin.editingBlog}
                  setEditingBlog={admin.setEditingBlog}
                  blogForm={admin.blogForm}
                  setBlogForm={admin.setBlogForm}
                  setBlogImage={admin.setBlogImage}
                  saveBlog={admin.saveBlog}
                  deleteBlogItem={admin.deleteBlogItem}
                />
              )}

              {(admin.activeTab === 'solutions' || admin.activeTab === 'solution_categories') && (
                <SolutionsTab
                  activeTab={admin.activeTab}
                  solutions={admin.solutions}
                  solutionCategories={admin.solutionCategories}
                  industries={admin.industries}
                  products={admin.products}
                  editingSolution={admin.editingSolution}
                  setEditingSolution={admin.setEditingSolution}
                  editingSolutionCategory={admin.editingSolutionCategory}
                  setEditingSolutionCategory={admin.setEditingSolutionCategory}
                  solutionForm={admin.solutionForm}
                  setSolutionForm={admin.setSolutionForm}
                  solutionCategoryForm={admin.solutionCategoryForm}
                  setSolutionCategoryForm={admin.setSolutionCategoryForm}
                  setSolutionImage={admin.setSolutionImage}
                  saveSolution={admin.saveSolution}
                  deleteSolutionItem={admin.deleteSolutionItem}
                  saveSolutionCategory={admin.saveSolutionCategory}
                  deleteSolutionCategoryItem={admin.deleteSolutionCategoryItem}
                />
              )}

              {admin.activeTab === 'locations' && (
                <LocationsTab
                  locations={admin.locations}
                  editingLocation={admin.editingLocation}
                  setEditingLocation={admin.setEditingLocation}
                  locationForm={admin.locationForm}
                  setLocationForm={admin.setLocationForm}
                  saveLocation={admin.saveLocation}
                  deleteLocationItem={admin.deleteLocationItem}
                  startEditLocation={admin.startEditLocation}
                />
              )}

              {admin.activeTab === 'enquiries' && (
                <EnquiriesTab
                  enquiries={admin.enquiries}
                  changeEnquiryStatus={admin.changeEnquiryStatus}
                  setViewItem={admin.setViewItem}
                />
              )}

              {admin.activeTab === 'careers' && (
                <CareersTab
                  careers={admin.careers}
                  changeCareerStatus={admin.changeCareerStatus}
                  setViewItem={admin.setViewItem}
                />
              )}

              {admin.activeTab === 'settings' && (
                <SettingsTab
                  settingsForm={admin.settingsForm}
                  setSettingsForm={admin.setSettingsForm}
                  saveSettings={admin.saveSettings}
                  handleDatabaseBackup={admin.handleDatabaseBackup}
                />
              )}

              {admin.activeTab === 'media' && (
                <MediaTab
                  mediaAssets={admin.mediaAssets}
                  handleMediaUpload={admin.handleMediaUpload}
                  deleteMediaAsset={admin.deleteMediaAsset}
                />
              )}
            </main>
          </div>
        )}

        {/* Modal Inspector Pop-up */}
        {admin.viewItem && (() => {
          const item = admin.viewItem;
          const isEnquiry = !!item.subject;
          const resumeUrl = item.resume_path ? getAssetUrl(item.resume_path, 'resume') : null;

          return (
            <div className="admin-modal-overlay" onClick={() => admin.setViewItem(null)}>
              <div className="admin-modal-content" onClick={e => e.stopPropagation()}>
                
                {/* Modal Header */}
                <div className="modal-header">
                  <div className="modal-title-group">
                    <div className="modal-title-icon">
                      {isEnquiry ? <FaFileAlt /> : <FaBriefcase />}
                    </div>
                    <div>
                      <span className={`modal-badge ${isEnquiry ? 'enquiry' : 'career'}`}>
                        {isEnquiry ? 'Form Enquiry' : 'Job Candidate Application'}
                      </span>
                      <h3 style={{ fontSize: '18px', fontWeight: '800', margin: 0, color: '#0f172a' }}>
                        {item.name}
                      </h3>
                    </div>
                  </div>
                  <button className="modal-close-btn" onClick={() => admin.setViewItem(null)}>
                    <FaTimes />
                  </button>
                </div>

                {/* Data Grid */}
                <div className="modal-data-grid">
                  <div className="data-item">
                    <span className="data-label">Full Name</span>
                    <span className="data-value">{item.name}</span>
                  </div>

                  <div className="data-item">
                    <span className="data-label">Email Address</span>
                    <span className="data-value">
                      <a href={`mailto:${item.email}`} style={{ display: 'inline-flex', alignItems: 'center', gap: '5px' }}>
                        <FaEnvelope style={{ fontSize: '12px' }} /> {item.email}
                      </a>
                    </span>
                  </div>

                  <div className="data-item">
                    <span className="data-label">Phone Number</span>
                    <span className="data-value">
                      <a href={`tel:${item.phone}`} style={{ display: 'inline-flex', alignItems: 'center', gap: '5px' }}>
                        <FaPhone style={{ fontSize: '12px' }} /> {item.phone || 'N/A'}
                      </a>
                    </span>
                  </div>

                  {isEnquiry ? (
                    <>
                      <div className="data-item">
                        <span className="data-label">Company</span>
                        <span className="data-value">{item.company || 'N/A'}</span>
                      </div>
                      <div className="data-item">
                        <span className="data-label">Service Interested</span>
                        <span className="data-value" style={{ color: '#0093DD' }}>{item.service_interested || 'General Inquiry'}</span>
                      </div>
                      <div className="data-item">
                        <span className="data-label">Subject</span>
                        <span className="data-value">{item.subject}</span>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="data-item">
                        <span className="data-label">Qualification</span>
                        <span className="data-value">{item.qualification || 'N/A'}</span>
                      </div>
                      <div className="data-item">
                        <span className="data-label">Experience</span>
                        <span className="data-value" style={{ color: '#0093DD' }}>{item.experience || 'N/A'}</span>
                      </div>
                    </>
                  )}

                  <div className="data-item">
                    <span className="data-label">IP Address</span>
                    <span className="data-value">
                      <code style={{ background: '#e2e8f0', padding: '2px 8px', borderRadius: '4px', fontSize: '12px' }}>
                        {item.ip_address || '127.0.0.1'}
                      </code>
                    </span>
                  </div>

                  <div className="data-item">
                    <span className="data-label">Status</span>
                    <span className="data-value">
                      <span className={`status-badge ${item.status === 'Contacted' ? 'publish' : item.status === 'Closed' ? 'draft' : 'pending'}`}>
                        {item.status || 'Pending'}
                      </span>
                    </span>
                  </div>
                </div>

                {/* Content Box (Message or Cover Letter) */}
                <div style={{ marginBottom: '20px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                    <span style={{ fontSize: '12px', fontWeight: '700', color: '#64748b', textTransform: 'uppercase' }}>
                      {isEnquiry ? 'Message Content' : 'Cover Letter'}
                    </span>
                    <button 
                      style={{ background: 'none', border: 'none', color: '#0093DD', cursor: 'pointer', fontSize: '12px', display: 'flex', alignItems: 'center', gap: '4px', fontWeight: '600' }}
                      onClick={() => {
                        navigator.clipboard.writeText(isEnquiry ? item.message : (item.cover_letter || ''));
                        toast.success('Copied to clipboard!');
                      }}
                    >
                      <FaCopy /> Copy Text
                    </button>
                  </div>
                  <div className="modal-message-box">
                    {isEnquiry ? item.message : (item.cover_letter || 'No cover letter provided by candidate.')}
                  </div>
                </div>

                {/* Resume Attachment Card for Candidates */}
                {!isEnquiry && (
                  <div className="resume-attachment-card">
                    <div className="resume-info">
                      <FaFileAlt className="resume-icon" />
                      <div>
                        <div className="resume-filename">Candidate Resume Document</div>
                        <div style={{ fontSize: '12px', color: '#16a34a' }}>
                          {item.resume_path ? item.resume_path.split('/').pop() : 'No file attached'}
                        </div>
                      </div>
                    </div>
                    {resumeUrl ? (
                      <div className="resume-actions">
                        <a 
                          href={resumeUrl} 
                          target="_blank" 
                          rel="noopener noreferrer" 
                          download
                          className="btn-primary" 
                          style={{ padding: '8px 16px', fontSize: '13px', display: 'inline-flex', alignItems: 'center', gap: '6px', textDecoration: 'none', background: '#16a34a', borderColor: '#16a34a' }}
                        >
                          <FaDownload /> Download
                        </a>
                        <a 
                          href={resumeUrl} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="btn-outline" 
                          style={{ padding: '8px 16px', fontSize: '13px', display: 'inline-flex', alignItems: 'center', gap: '6px', textDecoration: 'none', color: '#15803d', borderColor: '#86efac' }}
                        >
                          <FaExternalLinkAlt /> Open
                        </a>
                      </div>
                    ) : (
                      <span style={{ fontSize: '12px', color: '#94a3b8' }}>File unavailable</span>
                    )}
                  </div>
                )}

              </div>
            </div>
          );
        })()}


      </div>
    </>
  );
}

export default Admin;
