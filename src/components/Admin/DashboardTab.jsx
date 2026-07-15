import React from 'react';
import { FaGlobe, FaHistory, FaFileAlt, FaBriefcase, FaPlus } from 'react-icons/fa';

function DashboardTab({
  metrics,
  visitorBreakdown,
  setActiveTab,
  setEditingService,
  setServiceForm,
  setEditingProduct,
  setProductForm,
  setEditingProductCategory,
  setProductCategoryForm,
  setEditingClient,
  setClientForm,
  setEditingBlog,
  setBlogForm
}) {
  return (
    <div>
      <h2 style={{ marginBottom: '24px', fontSize: '22px', fontWeight: '700' }}>Real-time Local Analytics</h2>
      
      {/* Counts Grid */}
      <div className="admin-stats-grid">
        <div className="admin-stat-card">
          <div className="admin-stat-icon-wrapper"><FaGlobe /></div>
          <div className="admin-stat-info">
            <h4>Today's Visitors</h4>
            <p>{metrics.todayVisitors}</p>
          </div>
        </div>
        <div className="admin-stat-card">
          <div className="admin-stat-icon-wrapper"><FaHistory /></div>
          <div className="admin-stat-info">
            <h4>Total Visitors</h4>
            <p>{metrics.totalVisitors}</p>
          </div>
        </div>
        <div className="admin-stat-card">
          <div className="admin-stat-icon-wrapper"><FaFileAlt /></div>
          <div className="admin-stat-info">
            <h4>Total Enquiries</h4>
            <p>{metrics.enquiries}</p>
          </div>
        </div>
        <div className="admin-stat-card">
          <div className="admin-stat-icon-wrapper"><FaBriefcase /></div>
          <div className="admin-stat-info">
            <h4>Careers Filed</h4>
            <p>{metrics.applications}</p>
          </div>
        </div>
      </div>

      {/* Dynamic counts */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '15px', marginBottom: '30px' }}>
        <div style={{ background: '#f8fafc', padding: '16px', borderRadius: '8px', border: '1px solid #e2e8f0', textAlign: 'center' }}>
          <p style={{ margin: '0 0 4px', fontSize: '12px', color: '#64748b' }}>Total Services</p>
          <strong style={{ fontSize: '18px', color: '#0f172a' }}>{metrics.services}</strong>
        </div>
        <div style={{ background: '#f8fafc', padding: '16px', borderRadius: '8px', border: '1px solid #e2e8f0', textAlign: 'center' }}>
          <p style={{ margin: '0 0 4px', fontSize: '12px', color: '#64748b' }}>Total Products</p>
          <strong style={{ fontSize: '18px', color: '#0f172a' }}>{metrics.products}</strong>
        </div>
        <div style={{ background: '#f8fafc', padding: '16px', borderRadius: '8px', border: '1px solid #e2e8f0', textAlign: 'center' }}>
          <p style={{ margin: '0 0 4px', fontSize: '12px', color: '#64748b' }}>Total Industries</p>
          <strong style={{ fontSize: '18px', color: '#0f172a' }}>{metrics.industries}</strong>
        </div>
        <div style={{ background: '#f8fafc', padding: '16px', borderRadius: '8px', border: '1px solid #e2e8f0', textAlign: 'center' }}>
          <p style={{ margin: '0 0 4px', fontSize: '12px', color: '#64748b' }}>Total Clients</p>
          <strong style={{ fontSize: '18px', color: '#0f172a' }}>{metrics.clients}</strong>
        </div>
      </div>

      {/* Quick Access Buttons */}
      <div style={{ background: '#eff6ff', padding: '20px', borderRadius: '8px', marginBottom: '30px', borderLeft: '4px solid #0093DD' }}>
        <h4 style={{ margin: '0 0 12px', color: '#1e3a8a', fontSize: '14px', fontWeight: 'bold' }}>Quick Actions Control</h4>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
          <button onClick={() => { setActiveTab('services'); setEditingService('new'); setServiceForm({ title: '', slug: '', short_description: '', detailed_description: '', features: '', sort_order: 0, status: 'Publish' }); }} className="btn-primary" style={{ padding: '8px 16px', fontSize: '12px' }}>
            <FaPlus /> Add Service
          </button>
          <button onClick={() => { setActiveTab('products'); setEditingProduct('new'); setProductForm({ category_id: '', name: '', slug: '', description: '', specifications: '', video_url: '', is_featured: false }); }} className="btn-primary" style={{ padding: '8px 16px', fontSize: '12px' }}>
            <FaPlus /> Add Product
          </button>
          <button onClick={() => { setActiveTab('product_categories'); setEditingProductCategory('new'); setProductCategoryForm({ name: '', slug: '' }); }} className="btn-primary" style={{ padding: '8px 16px', fontSize: '12px' }}>
            <FaPlus /> Create Product Category
          </button>
          <button onClick={() => { setActiveTab('clients'); setEditingClient('new'); setClientForm({ name: '', sort_order: 0, status: 'Publish' }); }} className="btn-primary" style={{ padding: '8px 16px', fontSize: '12px' }}>
            <FaPlus /> Add Client
          </button>
          <button onClick={() => { setActiveTab('blogs'); setEditingBlog('new'); setBlogForm({ category_id: '', title: '', slug: '', excerpt: '', content: '', status: 'Draft', seo_title: '', meta_description: '', seo_keywords: '' }); }} className="btn-primary" style={{ padding: '8px 16px', fontSize: '12px' }}>
            <FaPlus /> Create Blog Article
          </button>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px', marginTop: '30px' }}>
        <div className="enquiry-info-card">
          <h4 style={{ margin: '0 0 16px', fontSize: '15px' }}>Visitor Device Types</h4>
          <ul>
            {visitorBreakdown.devices.map((d, i) => (
              <li key={i} style={{ padding: '8px 0', fontSize: '13.5px', display: 'flex', justifyContent: 'space-between' }}>
                <span>{d.device}</span> <strong>{d.count} views</strong>
              </li>
            ))}
          </ul>
        </div>

        <div className="enquiry-info-card">
          <h4 style={{ margin: '0 0 16px', fontSize: '15px' }}>Country Locations</h4>
          <ul>
            {visitorBreakdown.countries.map((c, i) => (
              <li key={i} style={{ padding: '8px 0', fontSize: '13.5px', display: 'flex', justifyContent: 'space-between' }}>
                <span>{c.country}</span> <strong>{c.count} logs</strong>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

export default DashboardTab;
