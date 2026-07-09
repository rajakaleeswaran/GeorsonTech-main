import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { toast } from 'react-toastify';
import {
  FaLock, FaChartBar, FaFileAlt, FaBriefcase, FaBox, FaRss,
  FaSignOutAlt, FaPlus, FaTrash, FaEdit, FaEye, FaDownload,
  FaTimes, FaBuilding, FaGlobe, FaCog, FaImages, FaCloudDownloadAlt,
  FaPalette, FaKey, FaHistory
} from 'react-icons/fa';
import '../styles/Admin.css';

function Admin() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [token, setToken] = useState('');
  const [activeTab, setActiveTab] = useState('dashboard');
  
  // Login Data
  const [loginData, setLoginData] = useState({ username: '', password: '' });
  const [submitting, setSubmitting] = useState(false);

  // Analytical Metrics & Breakdown
  const [metrics, setMetrics] = useState({
    enquiries: 0, applications: 0, products: 0, blogs: 0, totalVisitors: 0, todayVisitors: 0
  });
  const [visitorBreakdown, setVisitorBreakdown] = useState({
    browsers: [], devices: [], countries: [], popularPages: []
  });

  // DB collections
  const [enquiries, setEnquiries] = useState([]);
  const [careers, setCareers] = useState([]);
  const [products, setProducts] = useState([]);
  const [productCategories, setProductCategories] = useState([]);
  const [blogs, setBlogs] = useState([]);
  const [blogCategories, setBlogCategories] = useState([]);
  const [locations, setLocations] = useState([]);
  const [mediaAssets, setMediaAssets] = useState([]);

  // CMS Settings Key-values
  const [settings, setSettings] = useState({});

  // Modals & Active Edit states
  const [viewItem, setViewItem] = useState(null); // Modal view for enquiries/careers
  const [editingProduct, setEditingProduct] = useState(null);
  const [editingBlog, setEditingBlog] = useState(null);
  const [editingLocation, setEditingLocation] = useState(null);
  const [showMediaSelector, setShowMediaSelector] = useState(false);
  const [mediaTargetField, setMediaTargetField] = useState(null); // 'product' or 'blog' image

  // Forms Input bindings
  const [productForm, setProductForm] = useState({
    category_id: '', name: '', slug: '', description: '', specifications: '', image_path: '', pdf_brochure_path: '', video_url: '', is_featured: false
  });

  const [blogForm, setBlogForm] = useState({
    category_id: '', title: '', slug: '', excerpt: '', content: '', featured_image: '', status: 'Draft',
    seo_title: '', meta_description: '', seo_keywords: '', canonical_url: '', og_image_url: '', alt_text: '', schema_markup: ''
  });

  const [locationForm, setLocationForm] = useState({
    office_name: '', office_type: '', address: '', phone: '', email: '', google_map_link: '', latitude: '', longitude: ''
  });

  const [settingsForm, setSettingsForm] = useState({});

  // Check storage on init
  useEffect(() => {
    const savedToken = localStorage.getItem('admin_token');
    const savedUser = localStorage.getItem('admin_user');
    if (savedToken && savedUser) {
      setToken(savedToken);
      setUser(JSON.parse(savedUser));
      setIsAuthenticated(true);
    }
  }, []);

  // Fetch collections when authenticated
  useEffect(() => {
    if (isAuthenticated) {
      fetchDashboardMetrics();
      fetchSettings();
      fetchLocations();
      fetchProducts();
      fetchBlogs();
      fetchMedia();
      fetchVisitorStats();
    }
  }, [isAuthenticated, activeTab]);

  const apiHeaders = () => ({
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token || localStorage.getItem('admin_token')}`
  });

  // ─── API CONNECTORS ───

  const fetchDashboardMetrics = () => {
    fetch('http://localhost:5000/api/admin/dashboard', { headers: apiHeaders() })
      .then(res => res.json())
      .then(data => {
        if (data.metrics) setMetrics(data.metrics);
      })
      .catch(() => console.log('Mocking metrics due to server connection'));
  };

  const fetchSettings = () => {
    fetch('http://localhost:5000/api/settings')
      .then(res => res.json())
      .then(data => {
        setSettings(data);
        setSettingsForm(data);
      })
      .catch(() => console.log('Mocking settings'));
  };

  const fetchLocations = () => {
    fetch('http://localhost:5000/api/locations')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) setLocations(data);
      });
  };

  const fetchProducts = () => {
    fetch('http://localhost:5000/api/products')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) setProducts(data);
      });
    fetch('http://localhost:5000/api/products/categories')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) setProductCategories(data);
      });
  };

  const fetchBlogs = () => {
    fetch('http://localhost:5000/api/blogs')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) setBlogs(data);
      });
    fetch('http://localhost:5000/api/blogs/categories')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) setBlogCategories(data);
      });
  };

  const fetchMedia = () => {
    fetch('http://localhost:5000/api/admin/media', { headers: apiHeaders() })
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) setMediaAssets(data);
      });
  };

  const fetchVisitorStats = () => {
    fetch('http://localhost:5000/api/admin/analytics/visitors', { headers: apiHeaders() })
      .then(res => res.json())
      .then(data => {
        if (data.breakdown) setVisitorBreakdown(data.breakdown);
      });

    fetch('http://localhost:5000/api/admin/enquiries', { headers: apiHeaders() })
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) setEnquiries(data);
      });

    fetch('http://localhost:5000/api/admin/careers', { headers: apiHeaders() })
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) setCareers(data);
      });
  };

  // Login handler
  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    if (!loginData.username || !loginData.password) {
      toast.error("Please enter credentials");
      return;
    }
    setSubmitting(true);
    
    // Connect to actual login API
    fetch('http://localhost:5000/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(loginData)
    })
      .then(res => {
        if (res.ok) return res.json();
        throw new Error('Invalid credentials');
      })
      .then(data => {
        localStorage.setItem('admin_token', data.accessToken);
        localStorage.setItem('admin_user', JSON.stringify(data.user));
        setUser(data.user);
        setToken(data.accessToken);
        setIsAuthenticated(true);
        toast.success("Welcome back to CMS Workspace");
      })
      .catch(() => {
        // Fallback demo account login
        if (loginData.username === 'admin' && loginData.password === 'admin123') {
          const fakeUser = { username: 'admin', role: 'Super Admin' };
          localStorage.setItem('admin_token', 'mock_token');
          localStorage.setItem('admin_user', JSON.stringify(fakeUser));
          setUser(fakeUser);
          setIsAuthenticated(true);
          toast.success("Logged in with offline fallback account");
        } else {
          toast.error("Authentication failed");
        }
      })
      .finally(() => setSubmitting(false));
  };

  const handleLogout = () => {
    localStorage.removeItem('admin_token');
    localStorage.removeItem('admin_user');
    setIsAuthenticated(false);
    setUser(null);
    toast.info("Session closed");
  };

  // Status updates for Inquiries/Careers
  const changeEnquiryStatus = (id, newStatus) => {
    fetch(`http://localhost:5000/api/admin/enquiries/${id}/status`, {
      method: 'PUT',
      headers: apiHeaders(),
      body: JSON.stringify({ status: newStatus })
    })
      .then(res => {
        if (res.ok) {
          toast.success("Enquiry status updated");
          fetchVisitorStats();
        }
      });
  };

  const changeCareerStatus = (id, newStatus) => {
    fetch(`http://localhost:5000/api/admin/careers/${id}/status`, {
      method: 'PUT',
      headers: apiHeaders(),
      body: JSON.stringify({ status: newStatus })
    })
      .then(res => {
        if (res.ok) {
          toast.success("Candidate application status updated");
          fetchVisitorStats();
        }
      });
  };

  // Settings Save
  const saveSettings = (e) => {
    e.preventDefault();
    fetch('http://localhost:5000/api/admin/settings', {
      method: 'PUT',
      headers: apiHeaders(),
      body: JSON.stringify(settingsForm)
    })
      .then(res => {
        if (res.ok) {
          toast.success("CMS system settings saved successfully");
          fetchSettings();
        }
      });
  };

  // Location CRUD
  const saveLocation = (e) => {
    e.preventDefault();
    const method = editingLocation === 'new' ? 'POST' : 'PUT';
    const url = editingLocation === 'new' 
      ? 'http://localhost:5000/api/admin/locations'
      : `http://localhost:5000/api/admin/locations/${editingLocation.id}`;

    fetch(url, {
      method,
      headers: apiHeaders(),
      body: JSON.stringify(locationForm)
    })
      .then(res => {
        if (res.ok) {
          toast.success("Office location saved");
          setEditingLocation(null);
          fetchLocations();
        }
      });
  };

  const startEditLocation = (loc) => {
    setEditingLocation(loc);
    setLocationForm(loc);
  };

  const deleteLocationItem = (id) => {
    if (window.confirm("Delete this office location from website?")) {
      fetch(`http://localhost:5000/api/admin/locations/${id}`, {
        method: 'DELETE',
        headers: apiHeaders()
      }).then(res => {
        if (res.ok) {
          toast.info("Location removed");
          fetchLocations();
        }
      });
    }
  };

  // Media File uploads
  const handleMediaUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);

    fetch('http://localhost:5000/api/admin/media', {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${token || localStorage.getItem('admin_token')}` },
      body: formData
    })
      .then(res => {
        if (res.ok) {
          toast.success("File uploaded to Media Library");
          fetchMedia();
        }
      });
  };

  const deleteMediaAsset = (id) => {
    if (window.confirm("Permanently delete this media asset?")) {
      fetch(`http://localhost:5000/api/admin/media/${id}`, {
        method: 'DELETE',
        headers: apiHeaders()
      }).then(res => {
        if (res.ok) {
          toast.info("Asset deleted");
          fetchMedia();
        }
      });
    }
  };

  // SQL Database backup
  const handleDatabaseBackup = () => {
    window.open(`http://localhost:5000/api/admin/backup/export-sql?authorization=Bearer ${token || localStorage.getItem('admin_token')}`, '_blank');
    toast.success("Database Backup Script exported");
  };

  return (
    <>
      <Helmet>
        <title>Dynamic CMS Control Center – Georson Tech Pvt. Ltd</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>

      <div className="admin-page">
        {!isAuthenticated ? (
          <div className="admin-login-card">
            <h2 className="admin-login-title">Dynamic CMS Panel</h2>
            <p className="admin-login-subtitle">Authenticate to adjust theme styling, slider layouts, offices, and dynamic analytics.</p>
            
            <form onSubmit={handleLoginSubmit}>
              <div className="form-group">
                <label>Admin Username</label>
                <input 
                  type="text" className="form-input" required
                  value={loginData.username}
                  onChange={e => setLoginData(prev => ({ ...prev, username: e.target.value }))}
                  placeholder="admin"
                />
              </div>

              <div className="form-group">
                <label>Password</label>
                <input 
                  type="password" className="form-input" required
                  value={loginData.password}
                  onChange={e => setLoginData(prev => ({ ...prev, password: e.target.value }))}
                  placeholder="••••••••"
                />
              </div>

              <button type="submit" className="form-submit-btn" disabled={submitting}>
                <FaLock /> {submitting ? 'Signing In...' : 'Verify Identity'}
              </button>
            </form>
          </div>
        ) : (
          <div className="admin-workspace">
            {/* Sidebar Navigation */}
            <aside className="admin-sidebar">
              <div className="admin-sidebar-header">
                <span className="admin-user-info">{user?.username}</span>
                <span className="admin-user-role">{user?.role}</span>
              </div>

              <button className={`admin-nav-item ${activeTab === 'dashboard' ? 'active' : ''}`} onClick={() => setActiveTab('dashboard')}>
                <FaChartBar /> Analytics Panel
              </button>

              <button className={`admin-nav-item ${activeTab === 'settings' ? 'active' : ''}`} onClick={() => setActiveTab('settings')}>
                <FaCog /> Web Settings
              </button>

              <button className={`admin-nav-item ${activeTab === 'locations' ? 'active' : ''}`} onClick={() => setActiveTab('locations')}>
                <FaBuilding /> Offices CRUD
              </button>

              <button className={`admin-nav-item ${activeTab === 'enquiries' ? 'active' : ''}`} onClick={() => setActiveTab('enquiries')}>
                <FaFileAlt /> Enquiries Log
              </button>

              <button className={`admin-nav-item ${activeTab === 'careers' ? 'active' : ''}`} onClick={() => setActiveTab('careers')}>
                <FaBriefcase /> Candidates HR
              </button>

              <button className={`admin-nav-item ${activeTab === 'media' ? 'active' : ''}`} onClick={() => setActiveTab('media')}>
                <FaImages /> Media Library
              </button>

              <button className="admin-nav-item admin-logout-btn" onClick={handleLogout}>
                <FaSignOutAlt /> Sign Out
              </button>
            </aside>

            {/* Dashboard workspace */}
            <main className="admin-content-area">
              
              {/* TAB 1: ANALYTICS */}
              {activeTab === 'dashboard' && (
                <div>
                  <h2 style={{ marginBottom: '24px', fontSize: '22px', fontWeight: '700' }}>Real-time Local Analytics</h2>
                  
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
              )}

              {/* TAB 2: SYSTEM CONFIG */}
              {activeTab === 'settings' && (
                <div>
                  <h2 style={{ marginBottom: '24px', fontSize: '22px', fontWeight: '700' }}>Dynamic Settings Control Center</h2>
                  
                  <form onSubmit={saveSettings} className="admin-form" style={{ maxWidth: '100%' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                      <div className="form-group">
                        <label>Company Branding Name</label>
                        <input 
                          type="text" className="form-input" 
                          value={settingsForm.company_name || ''}
                          onChange={e => setSettingsForm(prev => ({ ...prev, company_name: e.target.value }))}
                        />
                      </div>
                      <div className="form-group">
                        <label>Motto Tagline</label>
                        <input 
                          type="text" className="form-input" 
                          value={settingsForm.motto || ''}
                          onChange={e => setSettingsForm(prev => ({ ...prev, motto: e.target.value }))}
                        />
                      </div>
                    </div>

                    <h3 style={{ margin: '24px 0 12px', fontSize: '16px', borderBottom: '1px solid #eee', paddingBottom: '6px' }}>Theme Hex Colors</h3>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px' }}>
                      <div className="form-group">
                        <label>Primary Theme Color</label>
                        <input 
                          type="color" className="form-input" style={{ height: '42px', padding: '2px' }}
                          value={settingsForm.theme_primary_color || '#0077cc'}
                          onChange={e => setSettingsForm(prev => ({ ...prev, theme_primary_color: e.target.value }))}
                        />
                      </div>
                      <div className="form-group">
                        <label>Accent Highlights Color</label>
                        <input 
                          type="color" className="form-input" style={{ height: '42px', padding: '2px' }}
                          value={settingsForm.theme_accent_color || '#00c6ff'}
                          onChange={e => setSettingsForm(prev => ({ ...prev, theme_accent_color: e.target.value }))}
                        />
                      </div>
                      <div className="form-group">
                        <label>Background Main Color</label>
                        <input 
                          type="color" className="form-input" style={{ height: '42px', padding: '2px' }}
                          value={settingsForm.theme_background_color || '#ffffff'}
                          onChange={e => setSettingsForm(prev => ({ ...prev, theme_background_color: e.target.value }))}
                        />
                      </div>
                    </div>

                    <h3 style={{ margin: '24px 0 12px', fontSize: '16px', borderBottom: '1px solid #eee', paddingBottom: '6px' }}>Dynamic Email Routing Recipients</h3>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px' }}>
                      <div className="form-group">
                        <label>HR Enquiries Target</label>
                        <input 
                          type="email" className="form-input" 
                          value={settingsForm.hr_email || ''}
                          onChange={e => setSettingsForm(prev => ({ ...prev, hr_email: e.target.value }))}
                        />
                      </div>
                      <div className="form-group">
                        <label>Sales Quotations Target</label>
                        <input 
                          type="email" className="form-input" 
                          value={settingsForm.sales_email || ''}
                          onChange={e => setSettingsForm(prev => ({ ...prev, sales_email: e.target.value }))}
                        />
                      </div>
                      <div className="form-group">
                        <label>Projects Engineering Target</label>
                        <input 
                          type="email" className="form-input" 
                          value={settingsForm.projects_email || ''}
                          onChange={e => setSettingsForm(prev => ({ ...prev, projects_email: e.target.value }))}
                        />
                      </div>
                    </div>

                    <h3 style={{ margin: '24px 0 12px', fontSize: '16px', borderBottom: '1px solid #eee', paddingBottom: '6px' }}>Third Party Analytics</h3>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                      <div className="form-group">
                        <label>Google Analytics 4 Measurement ID</label>
                        <input 
                          type="text" className="form-input" placeholder="e.g. G-XXXXXXX"
                          value={settingsForm.google_analytics_id || ''}
                          onChange={e => setSettingsForm(prev => ({ ...prev, google_analytics_id: e.target.value }))}
                        />
                      </div>
                      <div className="form-group">
                        <label>Search Console verification ID</label>
                        <input 
                          type="text" className="form-input" 
                          value={settingsForm.google_search_console_id || ''}
                          onChange={e => setSettingsForm(prev => ({ ...prev, google_search_console_id: e.target.value }))}
                        />
                      </div>
                    </div>

                    <div style={{ display: 'flex', gap: '15px', marginTop: '30px' }}>
                      <button type="submit" className="btn-primary">Save Settings</button>
                      <button type="button" className="btn-outline" onClick={handleDatabaseBackup}>
                        <FaCloudDownloadAlt /> Export SQL Backup
                      </button>
                    </div>
                  </form>
                </div>
              )}

              {/* TAB 3: LOCATIONS */}
              {activeTab === 'locations' && (
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                    <h2 style={{ fontSize: '22px', fontWeight: '700', margin: 0 }}>Company Offices Locations</h2>
                    {!editingLocation && (
                      <button className="btn-primary" onClick={() => {
                        setEditingLocation('new');
                        setLocationForm({ office_name: '', office_type: '', address: '', phone: '', email: '', google_map_link: '', latitude: '', longitude: '' });
                      }}>
                        <FaPlus /> Add Office
                      </button>
                    )}
                  </div>

                  {editingLocation ? (
                    <form onSubmit={saveLocation} className="admin-form">
                      <h3>{editingLocation === 'new' ? 'New Office location' : 'Edit Office location'}</h3>
                      
                      <div className="form-group">
                        <label>Office Name</label>
                        <input 
                          type="text" className="form-input" required
                          value={locationForm.office_name}
                          onChange={e => setLocationForm(prev => ({ ...prev, office_name: e.target.value }))}
                        />
                      </div>

                      <div className="form-group">
                        <label>Office Type</label>
                        <select 
                          className="form-select" required
                          value={locationForm.office_type}
                          onChange={e => setLocationForm(prev => ({ ...prev, office_type: e.target.value }))}
                        >
                          <option value="">-- Choose Type --</option>
                          <option value="Registered Office">Registered Office</option>
                          <option value="Manufacturing Unit">Manufacturing Unit</option>
                          <option value="Service Unit">Service Unit</option>
                        </select>
                      </div>

                      <div className="form-group">
                        <label>Physical Address</label>
                        <textarea 
                          className="form-textarea" required
                          value={locationForm.address}
                          onChange={e => setLocationForm(prev => ({ ...prev, address: e.target.value }))}
                        />
                      </div>

                      <div className="form-group">
                        <label>Google Map embed URL (Iframe src link)</label>
                        <input 
                          type="text" className="form-input"
                          value={locationForm.google_map_link}
                          onChange={e => setLocationForm(prev => ({ ...prev, google_map_link: e.target.value }))}
                        />
                      </div>

                      <div style={{ display: 'flex', gap: '10px' }}>
                        <button type="submit" className="btn-primary">Save Location</button>
                        <button type="button" className="btn-outline" onClick={() => setEditingLocation(null)}>Cancel</button>
                      </div>
                    </form>
                  ) : (
                    <div className="admin-table-container">
                      <table className="admin-table">
                        <thead>
                          <tr>
                            <th>Office Name</th>
                            <th>Type</th>
                            <th>Phone</th>
                            <th>Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {locations.map(loc => (
                            <tr key={loc.id}>
                              <td>{loc.office_name}</td>
                              <td>{loc.office_type}</td>
                              <td>{loc.phone || 'N/A'}</td>
                              <td>
                                <button className="admin-action-btn admin-btn-edit" onClick={() => startEditLocation(loc)}>
                                  <FaEdit /> Edit
                                </button>
                                <button className="admin-action-btn admin-btn-delete" onClick={() => deleteLocationItem(loc.id)}>
                                  <FaTrash /> Delete
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              )}

              {/* TAB 4: ENQUIRIES */}
              {activeTab === 'enquiries' && (
                <div>
                  <h2 style={{ marginBottom: '24px', fontSize: '22px', fontWeight: '700' }}>Form Enquiries Audit</h2>
                  <div className="admin-table-container">
                    <table className="admin-table">
                      <thead>
                        <tr>
                          <th>Sender</th>
                          <th>IP Address</th>
                          <th>Service</th>
                          <th>Status</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {enquiries.map(e => (
                          <tr key={e.id}>
                            <td>{e.name}</td>
                            <td><code style={{ background: '#eee', padding: '2px 6px', borderRadius: '4px' }}>{e.ip_address || 'Unknown'}</code></td>
                            <td>{e.service_interested}</td>
                            <td>
                              <select 
                                className="form-select" style={{ padding: '4px 8px', fontSize: '12px', width: '120px' }}
                                value={e.status}
                                onChange={opt => changeEnquiryStatus(e.id, opt.target.value)}
                              >
                                <option value="Pending">Pending</option>
                                <option value="Contacted">Contacted</option>
                                <option value="Closed">Closed</option>
                              </select>
                            </td>
                            <td>
                              <button className="admin-action-btn admin-btn-edit" onClick={() => setViewItem(e)}>
                                <FaEye /> Inspect
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* TAB 5: CAREERS */}
              {activeTab === 'careers' && (
                <div>
                  <h2 style={{ marginBottom: '24px', fontSize: '22px', fontWeight: '700' }}>Candidates Job Applications</h2>
                  <div className="admin-table-container">
                    <table className="admin-table">
                      <thead>
                        <tr>
                          <th>Candidate</th>
                          <th>IP Address</th>
                          <th>Experience</th>
                          <th>Status</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {careers.map(c => (
                          <tr key={c.id}>
                            <td>{c.name}</td>
                            <td><code style={{ background: '#eee', padding: '2px 6px', borderRadius: '4px' }}>{c.ip_address || 'Unknown'}</code></td>
                            <td>{c.experience}</td>
                            <td>
                              <select 
                                className="form-select" style={{ padding: '4px 8px', fontSize: '12px', width: '120px' }}
                                value={c.status}
                                onChange={opt => changeCareerStatus(c.id, opt.target.value)}
                              >
                                <option value="Pending">Pending</option>
                                <option value="Contacted">Contacted</option>
                                <option value="Closed">Closed</option>
                              </select>
                            </td>
                            <td>
                              <button className="admin-action-btn admin-btn-edit" onClick={() => setViewItem(c)}>
                                <FaEye /> Detail
                              </button>
                              <a href={`http://localhost:5000/${c.resume_path}`} target="_blank" rel="noopener noreferrer" className="admin-action-btn admin-btn-edit" style={{ textDecoration: 'none' }}>
                                <FaDownload /> Resume
                              </a>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* TAB 6: MEDIA LIBRARY */}
              {activeTab === 'media' && (
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                    <h2 style={{ fontSize: '22px', fontWeight: '700', margin: 0 }}>Shared Media Library</h2>
                    <label className="btn-primary" style={{ cursor: 'pointer' }}>
                      <FaPlus /> Upload File
                      <input type="file" style={{ display: 'none' }} onChange={handleMediaUpload} />
                    </label>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: '20px' }}>
                    {mediaAssets.map(asset => (
                      <div key={asset.id} style={{ border: '1px solid #ddd', borderRadius: '8px', overflow: 'hidden', background: '#fff' }}>
                        <div style={{ height: '110px', background: '#f5f5f5', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
                          {asset.file_type.includes('image') ? (
                            <img src={`http://localhost:5000/${asset.file_path}`} alt={asset.file_name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                          ) : (
                            <span style={{ fontSize: '24px', color: '#999' }}><FaFileAlt /></span>
                          )}
                        </div>
                        <div style={{ padding: '10px', fontSize: '11px' }}>
                          <p style={{ fontWeight: '600', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', margin: '0 0 6px' }}>{asset.file_name}</p>
                          <button className="admin-action-btn admin-btn-delete" style={{ width: '100%', justifyContent: 'center' }} onClick={() => deleteMediaAsset(asset.id)}>
                            <FaTrash /> Delete
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

            </main>
          </div>
        )}

        {/* Modal Inspector pop-up */}
        {viewItem && (
          <div className="admin-modal-overlay">
            <div className="admin-modal-content">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h3 style={{ fontSize: '18px', fontWeight: '700', margin: 0 }}>Inspection View</h3>
                <button style={{ fontSize: '18px' }} onClick={() => setViewItem(null)}><FaTimes /></button>
              </div>

              {viewItem.subject ? (
                <div>
                  <p><strong>Name:</strong> {viewItem.name}</p>
                  <p><strong>Company:</strong> {viewItem.company || 'N/A'}</p>
                  <p><strong>Email:</strong> {viewItem.email}</p>
                  <p><strong>Phone:</strong> {viewItem.phone}</p>
                  <p><strong>IP Address:</strong> <code>{viewItem.ip_address}</code></p>
                  <p><strong>Interested In:</strong> {viewItem.service_interested}</p>
                  <p><strong>Subject:</strong> {viewItem.subject}</p>
                  <p style={{ marginTop: '14px' }}><strong>Message Content:</strong></p>
                  <div style={{ background: '#f3f4f6', padding: '14px', borderRadius: '6px', fontSize: '13.5px', whiteSpace: 'pre-line' }}>
                    {viewItem.message}
                  </div>
                </div>
              ) : (
                <div>
                  <p><strong>Candidate:</strong> {viewItem.name}</p>
                  <p><strong>Email:</strong> {viewItem.email}</p>
                  <p><strong>Phone:</strong> {viewItem.phone}</p>
                  <p><strong>IP Address:</strong> <code>{viewItem.ip_address}</code></p>
                  <p><strong>Qualification:</strong> {viewItem.qualification}</p>
                  <p><strong>Experience:</strong> {viewItem.experience}</p>
                  <p style={{ marginTop: '14px' }}><strong>Cover Letter:</strong></p>
                  <div style={{ background: '#f3f4f6', padding: '14px', borderRadius: '6px', fontSize: '13.5px', whiteSpace: 'pre-line' }}>
                    {viewItem.cover_letter || 'None provided'}
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
