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
  FaSignOutAlt, FaTimes, FaBuilding, FaGlobe, FaCog, FaCogs, FaImages
} from 'react-icons/fa';
import '../styles/Admin.css';

// State hook
import useAdminState from '../hooks/useAdminState';

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
            <h2 className="admin-login-title">Dynamic CMS Panel</h2>
            <p className="admin-login-subtitle">Authenticate to adjust theme styling, slider layouts, offices, and dynamic analytics.</p>
            
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

        {/* Modal Inspector pop-up */}
        {admin.viewItem && (
          <div className="admin-modal-overlay">
            <div className="admin-modal-content">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h3 style={{ fontSize: '18px', fontWeight: '700', margin: 0 }}>Inspection View</h3>
                <button style={{ fontSize: '18px', border: 'none', background: 'none', cursor: 'pointer' }} onClick={() => admin.setViewItem(null)}><FaTimes /></button>
              </div>

              {admin.viewItem.subject ? (
                <div>
                  <p><strong>Name:</strong> {admin.viewItem.name}</p>
                  <p><strong>Company:</strong> {admin.viewItem.company || 'N/A'}</p>
                  <p><strong>Email:</strong> {admin.viewItem.email}</p>
                  <p><strong>Phone:</strong> {admin.viewItem.phone}</p>
                  <p><strong>IP Address:</strong> <code>{admin.viewItem.ip_address}</code></p>
                  <p><strong>Interested In:</strong> {admin.viewItem.service_interested}</p>
                  <p><strong>Subject:</strong> {admin.viewItem.subject}</p>
                  <p style={{ marginTop: '14px' }}><strong>Message Content:</strong></p>
                  <div style={{ background: '#f3f4f6', padding: '14px', borderRadius: '6px', fontSize: '13.5px', whiteSpace: 'pre-line' }}>
                    {admin.viewItem.message}
                  </div>
                </div>
              ) : (
                <div>
                  <p><strong>Candidate:</strong> {admin.viewItem.name}</p>
                  <p><strong>Email:</strong> {admin.viewItem.email}</p>
                  <p><strong>Phone:</strong> {admin.viewItem.phone}</p>
                  <p><strong>IP Address:</strong> <code>{admin.viewItem.ip_address}</code></p>
                  <p><strong>Qualification:</strong> {admin.viewItem.qualification}</p>
                  <p><strong>Experience:</strong> {admin.viewItem.experience}</p>
                  <p style={{ marginTop: '14px' }}><strong>Cover Letter:</strong></p>
                  <div style={{ background: '#f3f4f6', padding: '14px', borderRadius: '6px', fontSize: '13.5px', whiteSpace: 'pre-line' }}>
                    {admin.viewItem.cover_letter || 'None provided'}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

      </div>
    </>
  );
}

export default Admin;
