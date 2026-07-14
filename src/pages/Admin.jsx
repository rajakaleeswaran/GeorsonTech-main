import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { toast } from 'react-toastify';
import {
  FaLock, FaChartBar, FaFileAlt, FaBriefcase, FaBox, FaRss,
  FaSignOutAlt, FaPlus, FaTrash, FaEdit, FaEye, FaDownload,
  FaTimes, FaBuilding, FaGlobe, FaCog, FaCogs, FaImages, FaCloudDownloadAlt,
  FaPalette, FaKey, FaHistory, FaCheck, FaAngleDown, FaToggleOn, FaToggleOff
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
    enquiries: 0, applications: 0, products: 0, categories: 0, blogs: 0, services: 0, industries: 0, clients: 0, totalVisitors: 0, todayVisitors: 0
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
  const [services, setServices] = useState([]);
  const [industries, setIndustries] = useState([]);
  const [clients, setClients] = useState([]);
  const [solutions, setSolutions] = useState([]);
  const [solutionCategories, setSolutionCategories] = useState([]);
  const [mediaAssets, setMediaAssets] = useState([]);

  // CMS Settings Key-values
  const [settings, setSettings] = useState({});

  // Modals & Active Edit states
  const [viewItem, setViewItem] = useState(null); // Modal view for enquiries/careers
  
  // Active edit item states
  const [editingService, setEditingService] = useState(null);
  const [editingProduct, setEditingProduct] = useState(null);
  const [editingProductCategory, setEditingProductCategory] = useState(null);
  const [editingIndustry, setEditingIndustry] = useState(null);
  const [editingClient, setEditingClient] = useState(null);
  const [editingBlog, setEditingBlog] = useState(null);
  const [editingLocation, setEditingLocation] = useState(null);
  const [editingSolution, setEditingSolution] = useState(null);
  const [editingSolutionCategory, setEditingSolutionCategory] = useState(null);

  // Form Input Bindings
  const [solutionForm, setSolutionForm] = useState({
    category_id: '', name: '', slug: '', description: '', icon: '', service_descriptions: '', sort_order: 0, status: 'Publish', industry_ids: [], product_ids: []
  });
  const [solutionCategoryForm, setSolutionCategoryForm] = useState({
    name: '', sort_order: 0
  });
  const [solutionImage, setSolutionImage] = useState(null);
  const [serviceForm, setServiceForm] = useState({
    title: '', slug: '', short_description: '', detailed_description: '', features: '', sort_order: 0, status: 'Publish'
  });
  const [serviceImage, setServiceImage] = useState(null);
  const [serviceBrochure, setServiceBrochure] = useState(null);

  const [productForm, setProductForm] = useState({
    category_id: '', name: '', slug: '', description: '', specifications: '', video_url: '', is_featured: false
  });
  const [productImage, setProductImage] = useState(null);
  const [productBrochure, setProductBrochure] = useState(null);

  const [productCategoryForm, setProductCategoryForm] = useState({
    name: '', slug: ''
  });

  const [industryForm, setIndustryForm] = useState({
    name: '', slug: '', description: '', detailed_description: '', sort_order: 0, status: 'Publish'
  });
  const [industryImage, setIndustryImage] = useState(null);

  const [clientForm, setClientForm] = useState({
    name: '', sort_order: 0, status: 'Publish'
  });
  const [clientLogo, setClientLogo] = useState(null);

  const [blogForm, setBlogForm] = useState({
    category_id: '', title: '', slug: '', excerpt: '', content: '', status: 'Draft',
    seo_title: '', meta_description: '', seo_keywords: ''
  });
  const [blogImage, setBlogImage] = useState(null);

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
      fetchServices();
      fetchIndustries();
      fetchClients();
      fetchSolutions();
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
      .catch(() => console.log('Error fetching metrics'));
  };

  const fetchSettings = () => {
    fetch('http://localhost:5000/api/settings')
      .then(res => res.json())
      .then(data => {
        setSettings(data);
        setSettingsForm(data);
      })
      .catch(() => {});
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

  const fetchServices = () => {
    fetch('http://localhost:5000/api/services')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) setServices(data);
      });
  };

  const fetchIndustries = () => {
    fetch('http://localhost:5000/api/industries')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) setIndustries(data);
      });
  };

  const fetchClients = () => {
    fetch('http://localhost:5000/api/clients')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) setClients(data);
      });
  };

  const fetchSolutions = () => {
    fetch('http://localhost:5000/api/solutions')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) setSolutions(data);
      });
    fetch('http://localhost:5000/api/solutions/categories')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) setSolutionCategories(data);
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
      })
      .catch(() => {});

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
        toast.error("Authentication failed");
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

  // Solutions CRUD handlers
  const saveSolution = (e) => {
    e.preventDefault();
    const method = editingSolution === 'new' ? 'POST' : 'PUT';
    const url = editingSolution === 'new'
      ? 'http://localhost:5000/api/admin/solutions'
      : `http://localhost:5000/api/admin/solutions/${editingSolution.id}`;

    const formData = new FormData();
    formData.append('category_id', solutionForm.category_id || '');
    formData.append('name', solutionForm.name);
    formData.append('slug', solutionForm.slug);
    formData.append('description', solutionForm.description || '');
    formData.append('icon', solutionForm.icon || '');
    formData.append('service_descriptions', solutionForm.service_descriptions || '');
    formData.append('sort_order', solutionForm.sort_order || 0);
    formData.append('status', solutionForm.status || 'Publish');
    formData.append('industry_ids', JSON.stringify(solutionForm.industry_ids || []));
    formData.append('product_ids', JSON.stringify(solutionForm.product_ids || []));

    if (solutionImage) formData.append('image', solutionImage);

    fetch(url, {
      method,
      headers: { 'Authorization': `Bearer ${token}` },
      body: formData
    })
      .then(res => {
        if (res.ok) {
          toast.success("Solution saved successfully");
          setEditingSolution(null);
          setSolutionImage(null);
          fetchSolutions();
        } else {
          toast.error("Failed to save solution");
        }
      });
  };

  const deleteSolutionItem = (id) => {
    if (window.confirm("Delete this solution?")) {
      fetch(`http://localhost:5000/api/admin/solutions/${id}`, {
        method: 'DELETE',
        headers: apiHeaders()
      }).then(res => {
        if (res.ok) {
          toast.info("Solution deleted");
          fetchSolutions();
        }
      });
    }
  };

  // Solution Categories CRUD handlers
  const saveSolutionCategory = (e) => {
    e.preventDefault();
    const method = editingSolutionCategory === 'new' ? 'POST' : 'PUT';
    const url = editingSolutionCategory === 'new'
      ? 'http://localhost:5000/api/admin/solutions/categories'
      : `http://localhost:5000/api/admin/solutions/categories/${editingSolutionCategory.id}`;

    fetch(url, {
      method,
      headers: apiHeaders(),
      body: JSON.stringify(solutionCategoryForm)
    })
      .then(res => {
        if (res.ok) {
          toast.success("Solution category saved");
          setEditingSolutionCategory(null);
          fetchSolutions();
        } else {
          toast.error("Failed to save category");
        }
      });
  };

  const deleteSolutionCategoryItem = (id) => {
    if (window.confirm("Delete this solution category?")) {
      fetch(`http://localhost:5000/api/admin/solutions/categories/${id}`, {
        method: 'DELETE',
        headers: apiHeaders()
      }).then(res => {
        if (res.ok) {
          toast.info("Category deleted");
          fetchSolutions();
        } else {
          res.json().then(d => toast.error(d.message || "Failed to delete"));
        }
      });
    }
  };

  // Services CRUD handlers
  const saveService = (e) => {
    e.preventDefault();
    const method = editingService === 'new' ? 'POST' : 'PUT';
    const url = editingService === 'new'
      ? 'http://localhost:5000/api/admin/services'
      : `http://localhost:5000/api/admin/services/${editingService.id}`;

    const formData = new FormData();
    formData.append('title', serviceForm.title);
    formData.append('slug', serviceForm.slug);
    formData.append('short_description', serviceForm.short_description);
    formData.append('detailed_description', serviceForm.detailed_description);
    formData.append('features', serviceForm.features);
    formData.append('sort_order', serviceForm.sort_order);
    formData.append('status', serviceForm.status);
    if (serviceImage) formData.append('image', serviceImage);
    if (serviceBrochure) formData.append('brochure', serviceBrochure);

    fetch(url, {
      method,
      headers: { 'Authorization': `Bearer ${token}` },
      body: formData
    })
      .then(res => {
        if (res.ok) {
          toast.success("Service saved successfully");
          setEditingService(null);
          setServiceImage(null);
          setServiceBrochure(null);
          fetchServices();
        } else {
          toast.error("Failed to save service");
        }
      });
  };

  const deleteServiceItem = (id) => {
    if (window.confirm("Delete this service?")) {
      fetch(`http://localhost:5000/api/admin/services/${id}`, {
        method: 'DELETE',
        headers: apiHeaders()
      }).then(res => {
        if (res.ok) {
          toast.info("Service deleted");
          fetchServices();
        }
      });
    }
  };

  // Products CRUD handlers
  const saveProduct = (e) => {
    e.preventDefault();
    const method = editingProduct === 'new' ? 'POST' : 'PUT';
    const url = editingProduct === 'new'
      ? 'http://localhost:5000/api/admin/products'
      : `http://localhost:5000/api/admin/products/${editingProduct.id}`;

    const formData = new FormData();
    formData.append('category_id', productForm.category_id);
    formData.append('name', productForm.name);
    formData.append('slug', productForm.slug);
    formData.append('description', productForm.description);
    formData.append('specifications', productForm.specifications);
    formData.append('video_url', productForm.video_url);
    formData.append('is_featured', productForm.is_featured);
    if (productImage) formData.append('image', productImage);
    if (productBrochure) formData.append('brochure', productBrochure);

    fetch(url, {
      method,
      headers: { 'Authorization': `Bearer ${token}` },
      body: formData
    })
      .then(res => {
        if (res.ok) {
          toast.success("Product saved successfully");
          setEditingProduct(null);
          setProductImage(null);
          setProductBrochure(null);
          fetchProducts();
        } else {
          toast.error("Failed to save product");
        }
      });
  };

  const deleteProductItem = (id) => {
    if (window.confirm("Delete this product?")) {
      fetch(`http://localhost:5000/api/admin/products/${id}`, {
        method: 'DELETE',
        headers: apiHeaders()
      }).then(res => {
        if (res.ok) {
          toast.info("Product deleted");
          fetchProducts();
        }
      });
    }
  };

  // Product Category CRUD handlers
  const saveProductCategory = (e) => {
    e.preventDefault();
    const method = editingProductCategory === 'new' ? 'POST' : 'PUT';
    const url = editingProductCategory === 'new'
      ? 'http://localhost:5000/api/admin/products/categories'
      : `http://localhost:5000/api/admin/products/categories/${editingProductCategory.id}`;

    fetch(url, {
      method,
      headers: apiHeaders(),
      body: JSON.stringify(productCategoryForm)
    })
      .then(res => {
        if (res.ok) {
          toast.success("Category saved");
          setEditingProductCategory(null);
          fetchProducts();
        }
      });
  };

  const deleteProductCategoryItem = (id) => {
    if (window.confirm("Delete this product category?")) {
      fetch(`http://localhost:5000/api/admin/products/categories/${id}`, {
        method: 'DELETE',
        headers: apiHeaders()
      }).then(res => {
        if (res.ok) {
          toast.info("Category deleted");
          fetchProducts();
        } else {
          res.json().then(d => toast.error(d.message || "Failed to delete"));
        }
      });
    }
  };

  // Industries CRUD handlers
  const saveIndustry = (e) => {
    e.preventDefault();
    const method = editingIndustry === 'new' ? 'POST' : 'PUT';
    const url = editingIndustry === 'new'
      ? 'http://localhost:5000/api/admin/industries'
      : `http://localhost:5000/api/admin/industries/${editingIndustry.id}`;

    const formData = new FormData();
    formData.append('name', industryForm.name);
    formData.append('slug', industryForm.slug);
    formData.append('description', industryForm.description);
    formData.append('detailed_description', industryForm.detailed_description);
    formData.append('sort_order', industryForm.sort_order);
    formData.append('status', industryForm.status);
    if (industryImage) formData.append('image', industryImage);

    fetch(url, {
      method,
      headers: { 'Authorization': `Bearer ${token}` },
      body: formData
    })
      .then(res => {
        if (res.ok) {
          toast.success("Industry saved successfully");
          setEditingIndustry(null);
          setIndustryImage(null);
          fetchIndustries();
        }
      });
  };

  const deleteIndustryItem = (id) => {
    if (window.confirm("Delete this industry?")) {
      fetch(`http://localhost:5000/api/admin/industries/${id}`, {
        method: 'DELETE',
        headers: apiHeaders()
      }).then(res => {
        if (res.ok) {
          toast.info("Industry deleted");
          fetchIndustries();
        }
      });
    }
  };

  // Clients CRUD handlers
  const saveClient = (e) => {
    e.preventDefault();
    const method = editingClient === 'new' ? 'POST' : 'PUT';
    const url = editingClient === 'new'
      ? 'http://localhost:5000/api/admin/clients'
      : `http://localhost:5000/api/admin/clients/${editingClient.id}`;

    const formData = new FormData();
    formData.append('name', clientForm.name);
    formData.append('sort_order', clientForm.sort_order);
    formData.append('status', clientForm.status);
    if (clientLogo) formData.append('logo', clientLogo);

    fetch(url, {
      method,
      headers: { 'Authorization': `Bearer ${token}` },
      body: formData
    })
      .then(res => {
        if (res.ok) {
          toast.success("Client saved successfully");
          setEditingClient(null);
          setClientLogo(null);
          fetchClients();
        } else {
          toast.error("Failed to save client");
        }
      });
  };

  const deleteClientItem = (id) => {
    if (window.confirm("Delete this client?")) {
      fetch(`http://localhost:5000/api/admin/clients/${id}`, {
        method: 'DELETE',
        headers: apiHeaders()
      }).then(res => {
        if (res.ok) {
          toast.info("Client deleted");
          fetchClients();
        }
      });
    }
  };

  // Blogs CRUD handlers
  const saveBlog = (e) => {
    e.preventDefault();
    const method = editingBlog === 'new' ? 'POST' : 'PUT';
    const url = editingBlog === 'new'
      ? 'http://localhost:5000/api/admin/blogs'
      : `http://localhost:5000/api/admin/blogs/${editingBlog.id}`;

    const formData = new FormData();
    formData.append('category_id', blogForm.category_id);
    formData.append('title', blogForm.title);
    formData.append('slug', blogForm.slug);
    formData.append('excerpt', blogForm.excerpt);
    formData.append('content', blogForm.content);
    formData.append('status', blogForm.status);
    formData.append('seo_title', blogForm.seo_title);
    formData.append('meta_description', blogForm.meta_description);
    formData.append('seo_keywords', blogForm.seo_keywords);
    if (blogImage) formData.append('featured_image', blogImage);

    fetch(url, {
      method,
      headers: { 'Authorization': `Bearer ${token}` },
      body: formData
    })
      .then(res => {
        if (res.ok) {
          toast.success("Blog saved successfully");
          setEditingBlog(null);
          setBlogImage(null);
          fetchBlogs();
        }
      });
  };

  const deleteBlogItem = (id) => {
    if (window.confirm("Delete this blog article?")) {
      fetch(`http://localhost:5000/api/admin/blogs/${id}`, {
        method: 'DELETE',
        headers: apiHeaders()
      }).then(res => {
        if (res.ok) {
          toast.info("Blog deleted");
          fetchBlogs();
        }
      });
    }
  };

  // Media upload handlers
  const handleMediaUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const formData = new FormData();
    formData.append('file', file);

    fetch('http://localhost:5000/api/admin/media', {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${token}` },
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

  const handleDatabaseBackup = () => {
    window.open(`http://localhost:5000/api/admin/backup/export-sql?authorization=Bearer ${token}`, '_blank');
    toast.success("Database Backup Script exported");
  };

  return (
    <>
      <Helmet>
        <title>CMS Dashboard Control Center – Georson Tech Pvt. Ltd</title>
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
            <aside className="admin-sidebar" style={{ minWidth: '240px' }}>
              <div className="admin-sidebar-header">
                <span className="admin-user-info">{user?.username}</span>
                <span className="admin-user-role">{user?.role}</span>
              </div>

              <button className={`admin-nav-item ${activeTab === 'dashboard' ? 'active' : ''}`} onClick={() => setActiveTab('dashboard')}>
                <FaChartBar /> Analytics Panel
              </button>

              <button className={`admin-nav-item ${activeTab === 'services' ? 'active' : ''}`} onClick={() => setActiveTab('services')}>
                <FaCogs /> Services CMS
              </button>

              <button className={`admin-nav-item ${activeTab === 'products' ? 'active' : ''}`} onClick={() => setActiveTab('products')}>
                <FaBox /> Products Catalog
              </button>

              <button className={`admin-nav-item ${activeTab === 'product_categories' ? 'active' : ''}`} onClick={() => setActiveTab('product_categories')}>
                <FaBox /> Product Categories
              </button>

              <button className={`admin-nav-item ${activeTab === 'industries' ? 'active' : ''}`} onClick={() => setActiveTab('industries')}>
                <FaBuilding /> Industries Serve
              </button>

              <button className={`admin-nav-item ${activeTab === 'clients' ? 'active' : ''}`} onClick={() => setActiveTab('clients')}>
                <FaGlobe /> Clients & Logos
              </button>

              <button className={`admin-nav-item ${activeTab === 'blogs' ? 'active' : ''}`} onClick={() => setActiveTab('blogs')}>
                <FaRss /> Blogs articles
              </button>

              <button className={`admin-nav-item ${activeTab === 'solutions' ? 'active' : ''}`} onClick={() => setActiveTab('solutions')}>
                <FaCogs /> Solutions Ecosystem
              </button>

              <button className={`admin-nav-item ${activeTab === 'solution_categories' ? 'active' : ''}`} onClick={() => setActiveTab('solution_categories')}>
                <FaCogs /> Solution Categories
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

              <button className={`admin-nav-item ${activeTab === 'settings' ? 'active' : ''}`} onClick={() => setActiveTab('settings')}>
                <FaCog /> Web Settings
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
              )}

              {/* TAB: SERVICES */}
              {activeTab === 'services' && (
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                    <h2 style={{ fontSize: '22px', fontWeight: '700', margin: 0 }}>Manage Dynamic Services</h2>
                    {!editingService && (
                      <button className="btn-primary" onClick={() => {
                        setEditingService('new');
                        setServiceForm({ title: '', slug: '', short_description: '', detailed_description: '', features: '', sort_order: 0, status: 'Publish' });
                      }}>
                        <FaPlus /> Add Service
                      </button>
                    )}
                  </div>

                  {editingService ? (
                    <form onSubmit={saveService} className="admin-form" style={{ maxWidth: '100%' }}>
                      <h3>{editingService === 'new' ? 'New Service' : 'Edit Service'}</h3>
                      
                      <div className="form-group">
                        <label>Service Title</label>
                        <input type="text" className="form-input" required value={serviceForm.title} onChange={e => setServiceForm(prev => ({ ...prev, title: e.target.value }))} />
                      </div>

                      <div className="form-group">
                        <label>Slug (Unique identifier)</label>
                        <input type="text" className="form-input" required value={serviceForm.slug} onChange={e => setServiceForm(prev => ({ ...prev, slug: e.target.value }))} />
                      </div>

                      <div className="form-group">
                        <label>Short Description</label>
                        <textarea className="form-textarea" required value={serviceForm.short_description} onChange={e => setServiceForm(prev => ({ ...prev, short_description: e.target.value }))} />
                      </div>

                      <div className="form-group">
                        <label>Detailed Description</label>
                        <textarea className="form-textarea" rows="6" value={serviceForm.detailed_description} onChange={e => setServiceForm(prev => ({ ...prev, detailed_description: e.target.value }))} />
                      </div>

                      <div className="form-group">
                        <label>Key Features (Comma-separated)</label>
                        <input type="text" className="form-input" placeholder="Feature 1, Feature 2, Feature 3" value={serviceForm.features} onChange={e => setServiceForm(prev => ({ ...prev, features: e.target.value }))} />
                      </div>

                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                        <div className="form-group">
                          <label>Display Order (Lower values display first)</label>
                          <input type="number" className="form-input" value={serviceForm.sort_order} onChange={e => setServiceForm(prev => ({ ...prev, sort_order: e.target.value }))} />
                        </div>

                        <div className="form-group">
                          <label>Publish Status</label>
                          <select className="form-select" value={serviceForm.status} onChange={e => setServiceForm(prev => ({ ...prev, status: e.target.value }))}>
                            <option value="Publish">Publish</option>
                            <option value="Draft">Draft</option>
                          </select>
                        </div>
                      </div>

                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                        <div className="form-group">
                          <label>Featured Thumbnail Image File</label>
                          <input type="file" className="form-input" onChange={e => setServiceImage(e.target.files[0])} accept="image/*" />
                        </div>
                        <div className="form-group">
                          <label>PDF Brochure Document</label>
                          <input type="file" className="form-input" onChange={e => setServiceBrochure(e.target.files[0])} accept=".pdf" />
                        </div>
                      </div>

                      <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
                        <button type="submit" className="btn-primary">Save Service</button>
                        <button type="button" className="btn-outline" onClick={() => setEditingService(null)}>Cancel</button>
                      </div>
                    </form>
                  ) : (
                    <div className="admin-table-container">
                      <table className="admin-table">
                        <thead>
                          <tr>
                            <th>Image</th>
                            <th>Service Title</th>
                            <th>Status</th>
                            <th>Order</th>
                            <th>Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {services.map(svc => (
                            <tr key={svc.id}>
                              <td>
                                <img src={svc.image_path ? `http://localhost:5000/${svc.image_path}` : ''} alt="" style={{ width: '50px', height: '40px', objectFit: 'cover', borderRadius: '4px' }} />
                              </td>
                              <td>{svc.title}</td>
                              <td><span className={`badge ${svc.status === 'Publish' ? 'publish' : 'draft'}`}>{svc.status}</span></td>
                              <td>{svc.sort_order}</td>
                              <td>
                                <button className="admin-action-btn admin-btn-edit" onClick={() => { setEditingService(svc); setServiceForm(svc); }}>
                                  <FaEdit /> Edit
                                </button>
                                <button className="admin-action-btn admin-btn-delete" onClick={() => deleteServiceItem(svc.id)}>
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

              {/* TAB: PRODUCTS */}
              {activeTab === 'products' && (
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                    <h2 style={{ fontSize: '22px', fontWeight: '700', margin: 0 }}>Products Catalog</h2>
                    {!editingProduct && (
                      <button className="btn-primary" onClick={() => {
                        setEditingProduct('new');
                        setProductForm({ category_id: '', name: '', slug: '', description: '', specifications: '', video_url: '', is_featured: false });
                      }}>
                        <FaPlus /> Add Product
                      </button>
                    )}
                  </div>

                  {editingProduct ? (
                    <form onSubmit={saveProduct} className="admin-form" style={{ maxWidth: '100%' }}>
                      <h3>{editingProduct === 'new' ? 'New Product' : 'Edit Product'}</h3>
                      
                      <div className="form-group">
                        <label>Category</label>
                        <select className="form-select" required value={productForm.category_id} onChange={e => setProductForm(prev => ({ ...prev, category_id: e.target.value }))}>
                          <option value="">-- Select Category --</option>
                          {productCategories.map(cat => (
                            <option key={cat.id} value={cat.id}>{cat.name}</option>
                          ))}
                        </select>
                      </div>

                      <div className="form-group">
                        <label>Product Name</label>
                        <input type="text" className="form-input" required value={productForm.name} onChange={e => setProductForm(prev => ({ ...prev, name: e.target.value }))} />
                      </div>

                      <div className="form-group">
                        <label>Slug (Unique URL)</label>
                        <input type="text" className="form-input" required value={productForm.slug} onChange={e => setProductForm(prev => ({ ...prev, slug: e.target.value }))} />
                      </div>

                      <div className="form-group">
                        <label>Short Description</label>
                        <textarea className="form-textarea" required value={productForm.description} onChange={e => setProductForm(prev => ({ ...prev, description: e.target.value }))} />
                      </div>

                      <div className="form-group">
                        <label>Specifications (Comma-separated)</label>
                        <input type="text" className="form-input" placeholder="Spec 1, Spec 2, Spec 3" value={productForm.specifications} onChange={e => setProductForm(prev => ({ ...prev, specifications: e.target.value }))} />
                      </div>

                      <div className="form-group">
                        <label>YouTube Video Link</label>
                        <input type="text" className="form-input" placeholder="https://youtube.com/..." value={productForm.video_url || ''} onChange={e => setProductForm(prev => ({ ...prev, video_url: e.target.value }))} />
                      </div>

                      <div className="form-group" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <input type="checkbox" checked={productForm.is_featured} onChange={e => setProductForm(prev => ({ ...prev, is_featured: e.target.checked }))} />
                        <label style={{ margin: 0 }}>Featured Product (Highlight on Landing page)</label>
                      </div>

                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                        <div className="form-group">
                          <label>Product Image</label>
                          <input type="file" className="form-input" onChange={e => setProductImage(e.target.files[0])} accept="image/*" />
                        </div>
                        <div className="form-group">
                          <label>Brochure PDF</label>
                          <input type="file" className="form-input" onChange={e => setProductBrochure(e.target.files[0])} accept=".pdf" />
                        </div>
                      </div>

                      <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
                        <button type="submit" className="btn-primary">Save Product</button>
                        <button type="button" className="btn-outline" onClick={() => setEditingProduct(null)}>Cancel</button>
                      </div>
                    </form>
                  ) : (
                    <div className="admin-table-container">
                      <table className="admin-table">
                        <thead>
                          <tr>
                            <th>Image</th>
                            <th>Product Name</th>
                            <th>Category</th>
                            <th>Featured</th>
                            <th>Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {products.map(p => (
                            <tr key={p.id}>
                              <td>
                                <img src={p.image_path ? `http://localhost:5000/${p.image_path}` : ''} alt="" style={{ width: '50px', height: '40px', objectFit: 'cover', borderRadius: '4px' }} />
                              </td>
                              <td>{p.name}</td>
                              <td>{p.category_name}</td>
                              <td>{p.is_featured ? <span style={{ color: 'green', fontWeight: 'bold' }}>Yes</span> : 'No'}</td>
                              <td>
                                <button className="admin-action-btn admin-btn-edit" onClick={() => { setEditingProduct(p); setProductForm(p); }}>
                                  <FaEdit /> Edit
                                </button>
                                <button className="admin-action-btn admin-btn-delete" onClick={() => deleteProductItem(p.id)}>
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

              {/* TAB: PRODUCT CATEGORIES */}
              {activeTab === 'product_categories' && (
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                    <h2 style={{ fontSize: '22px', fontWeight: '700', margin: 0 }}>Product Categories</h2>
                    {!editingProductCategory && (
                      <button className="btn-primary" onClick={() => {
                        setEditingProductCategory('new');
                        setProductCategoryForm({ name: '', slug: '' });
                      }}>
                        <FaPlus /> Add Category
                      </button>
                    )}
                  </div>

                  {editingProductCategory ? (
                    <form onSubmit={saveProductCategory} className="admin-form">
                      <h3>{editingProductCategory === 'new' ? 'New Category' : 'Edit Category'}</h3>
                      <div className="form-group">
                        <label>Category Name</label>
                        <input type="text" className="form-input" required value={productCategoryForm.name} onChange={e => setProductCategoryForm(prev => ({ ...prev, name: e.target.value }))} />
                      </div>
                      <div className="form-group">
                        <label>Slug (Unique identifier)</label>
                        <input type="text" className="form-input" required value={productCategoryForm.slug} onChange={e => setProductCategoryForm(prev => ({ ...prev, slug: e.target.value }))} />
                      </div>
                      <div style={{ display: 'flex', gap: '10px' }}>
                        <button type="submit" className="btn-primary">Save Category</button>
                        <button type="button" className="btn-outline" onClick={() => setEditingProductCategory(null)}>Cancel</button>
                      </div>
                    </form>
                  ) : (
                    <div className="admin-table-container">
                      <table className="admin-table">
                        <thead>
                          <tr>
                            <th>Category Name</th>
                            <th>Slug</th>
                            <th>Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {productCategories.map(cat => (
                            <tr key={cat.id}>
                              <td>{cat.name}</td>
                              <td>{cat.slug}</td>
                              <td>
                                <button className="admin-action-btn admin-btn-edit" onClick={() => { setEditingProductCategory(cat); setProductCategoryForm(cat); }}>
                                  <FaEdit /> Edit
                                </button>
                                <button className="admin-action-btn admin-btn-delete" onClick={() => deleteProductCategoryItem(cat.id)}>
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

              {/* TAB: INDUSTRIES */}
              {activeTab === 'industries' && (
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                    <h2 style={{ fontSize: '22px', fontWeight: '700', margin: 0 }}>Industries serve</h2>
                    {!editingIndustry && (
                      <button className="btn-primary" onClick={() => {
                        setEditingIndustry('new');
                        setIndustryForm({ name: '', slug: '', description: '', detailed_description: '', sort_order: 0, status: 'Publish' });
                      }}>
                        <FaPlus /> Add Industry
                      </button>
                    )}
                  </div>

                  {editingIndustry ? (
                    <form onSubmit={saveIndustry} className="admin-form" style={{ maxWidth: '100%' }}>
                      <h3>{editingIndustry === 'new' ? 'New Industry' : 'Edit Industry'}</h3>
                      <div className="form-group">
                        <label>Industry Name</label>
                        <input type="text" className="form-input" required value={industryForm.name} onChange={e => setIndustryForm(prev => ({ ...prev, name: e.target.value }))} />
                      </div>
                      <div className="form-group">
                        <label>Slug (URL pathway)</label>
                        <input type="text" className="form-input" required value={industryForm.slug} onChange={e => setIndustryForm(prev => ({ ...prev, slug: e.target.value }))} />
                      </div>
                      <div className="form-group">
                        <label>Short Summary</label>
                        <textarea className="form-textarea" required value={industryForm.description} onChange={e => setIndustryForm(prev => ({ ...prev, description: e.target.value }))} />
                      </div>
                      <div className="form-group">
                        <label>Detailed Description</label>
                        <textarea className="form-textarea" rows="6" value={industryForm.detailed_description} onChange={e => setIndustryForm(prev => ({ ...prev, detailed_description: e.target.value }))} />
                      </div>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                        <div className="form-group">
                          <label>Display Order</label>
                          <input type="number" className="form-input" value={industryForm.sort_order} onChange={e => setIndustryForm(prev => ({ ...prev, sort_order: e.target.value }))} />
                        </div>
                        <div className="form-group">
                          <label>Status</label>
                          <select className="form-select" value={industryForm.status} onChange={e => setIndustryForm(prev => ({ ...prev, status: e.target.value }))}>
                            <option value="Publish">Publish</option>
                            <option value="Draft">Draft</option>
                          </select>
                        </div>
                      </div>
                      <div className="form-group">
                        <label>Cover Photo Image</label>
                        <input type="file" className="form-input" onChange={e => setIndustryImage(e.target.files[0])} accept="image/*" />
                      </div>
                      <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
                        <button type="submit" className="btn-primary">Save Industry</button>
                        <button type="button" className="btn-outline" onClick={() => setEditingIndustry(null)}>Cancel</button>
                      </div>
                    </form>
                  ) : (
                    <div className="admin-table-container">
                      <table className="admin-table">
                        <thead>
                          <tr>
                            <th>Image</th>
                            <th>Industry Name</th>
                            <th>Status</th>
                            <th>Order</th>
                            <th>Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {industries.map(ind => (
                            <tr key={ind.id}>
                              <td>
                                <img src={ind.image_path ? `http://localhost:5000/${ind.image_path}` : ''} alt="" style={{ width: '50px', height: '40px', objectFit: 'cover', borderRadius: '4px' }} />
                              </td>
                              <td>{ind.name}</td>
                              <td><span className={`badge ${ind.status === 'Publish' ? 'publish' : 'draft'}`}>{ind.status}</span></td>
                              <td>{ind.sort_order}</td>
                              <td>
                                <button className="admin-action-btn admin-btn-edit" onClick={() => { setEditingIndustry(ind); setIndustryForm(ind); }}>
                                  <FaEdit /> Edit
                                </button>
                                <button className="admin-action-btn admin-btn-delete" onClick={() => deleteIndustryItem(ind.id)}>
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

              {/* TAB: CLIENTS */}
              {activeTab === 'clients' && (
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                    <h2 style={{ fontSize: '22px', fontWeight: '700', margin: 0 }}>Clients & Logos</h2>
                    {!editingClient && (
                      <button className="btn-primary" onClick={() => {
                        setEditingClient('new');
                        setClientForm({ name: '', sort_order: 0, status: 'Publish' });
                      }}>
                        <FaPlus /> Add Client Logo
                      </button>
                    )}
                  </div>

                  {editingClient ? (
                    <form onSubmit={saveClient} className="admin-form">
                      <h3>{editingClient === 'new' ? 'New Client Logo' : 'Edit Client Logo'}</h3>
                      <div className="form-group">
                        <label>Company / Client Name</label>
                        <input type="text" className="form-input" required value={clientForm.name} onChange={e => setClientForm(prev => ({ ...prev, name: e.target.value }))} />
                      </div>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                        <div className="form-group">
                          <label>Display Order</label>
                          <input type="number" className="form-input" value={clientForm.sort_order} onChange={e => setClientForm(prev => ({ ...prev, sort_order: e.target.value }))} />
                        </div>
                        <div className="form-group">
                          <label>Status</label>
                          <select className="form-select" value={clientForm.status} onChange={e => setClientForm(prev => ({ ...prev, status: e.target.value }))}>
                            <option value="Publish">Publish</option>
                            <option value="Draft">Draft</option>
                          </select>
                        </div>
                      </div>
                      <div className="form-group">
                        <label>Upload Logo File (PNG/JPEG)</label>
                        <input type="file" className="form-input" onChange={e => setClientLogo(e.target.files[0])} accept="image/*" />
                      </div>
                      <div style={{ display: 'flex', gap: '10px' }}>
                        <button type="submit" className="btn-primary">Save Logo</button>
                        <button type="button" className="btn-outline" onClick={() => setEditingClient(null)}>Cancel</button>
                      </div>
                    </form>
                  ) : (
                    <div className="admin-table-container">
                      <table className="admin-table">
                        <thead>
                          <tr>
                            <th>Logo</th>
                            <th>Company Name</th>
                            <th>Status</th>
                            <th>Order</th>
                            <th>Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {clients.map(c => (
                            <tr key={c.id}>
                              <td>
                                <img src={c.logo_path ? `http://localhost:5000/${c.logo_path}` : ''} alt="" style={{ height: '36px', objectFit: 'contain', maxWidth: '80px' }} />
                              </td>
                              <td>{c.name}</td>
                              <td><span className={`badge ${c.status === 'Publish' ? 'publish' : 'draft'}`}>{c.status}</span></td>
                              <td>{c.sort_order}</td>
                              <td>
                                <button className="admin-action-btn admin-btn-edit" onClick={() => { setEditingClient(c); setClientForm(c); }}>
                                  <FaEdit /> Edit
                                </button>
                                <button className="admin-action-btn admin-btn-delete" onClick={() => deleteClientItem(c.id)}>
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

              {/* TAB: BLOGS */}
              {activeTab === 'blogs' && (
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                    <h2 style={{ fontSize: '22px', fontWeight: '700', margin: 0 }}>Blogs Articles</h2>
                    {!editingBlog && (
                      <button className="btn-primary" onClick={() => {
                        setEditingBlog('new');
                        setBlogForm({ category_id: '', title: '', slug: '', excerpt: '', content: '', status: 'Draft', seo_title: '', meta_description: '', seo_keywords: '' });
                      }}>
                        <FaPlus /> Create Blog Article
                      </button>
                    )}
                  </div>

                  {editingBlog ? (
                    <form onSubmit={saveBlog} className="admin-form" style={{ maxWidth: '100%' }}>
                      <h3>{editingBlog === 'new' ? 'New Article' : 'Edit Article'}</h3>
                      
                      <div className="form-group">
                        <label>Category</label>
                        <select className="form-select" required value={blogForm.category_id} onChange={e => setBlogForm(prev => ({ ...prev, category_id: e.target.value }))}>
                          <option value="">-- Choose Category --</option>
                          {blogCategories.map(cat => (
                            <option key={cat.id} value={cat.id}>{cat.name}</option>
                          ))}
                        </select>
                      </div>

                      <div className="form-group">
                        <label>Article Title</label>
                        <input type="text" className="form-input" required value={blogForm.title} onChange={e => setBlogForm(prev => ({ ...prev, title: e.target.value }))} />
                      </div>

                      <div className="form-group">
                        <label>Slug (Unique URL)</label>
                        <input type="text" className="form-input" required value={blogForm.slug} onChange={e => setBlogForm(prev => ({ ...prev, slug: e.target.value }))} />
                      </div>

                      <div className="form-group">
                        <label>Excerpt (Short Summary)</label>
                        <textarea className="form-textarea" required value={blogForm.excerpt} onChange={e => setBlogForm(prev => ({ ...prev, excerpt: e.target.value }))} />
                      </div>

                      <div className="form-group">
                        <label>Article HTML Content</label>
                        <textarea className="form-textarea" rows="12" placeholder="<p>Write your article here. HTML tags supported.</p>" required value={blogForm.content} onChange={e => setBlogForm(prev => ({ ...prev, content: e.target.value }))} />
                      </div>

                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                        <div className="form-group">
                          <label>Featured Image</label>
                          <input type="file" className="form-input" onChange={e => setBlogImage(e.target.files[0])} accept="image/*" />
                        </div>
                        <div className="form-group">
                          <label>Publication Status</label>
                          <select className="form-select" value={blogForm.status} onChange={e => setBlogForm(prev => ({ ...prev, status: e.target.value }))}>
                            <option value="Draft">Draft</option>
                            <option value="Publish">Publish</option>
                          </select>
                        </div>
                      </div>

                      <h4 style={{ margin: '20px 0 10px', fontSize: '15px', borderBottom: '1px solid #eee', paddingBottom: '6px' }}>SEO Parameters</h4>
                      <div className="form-group">
                        <label>SEO Document Title</label>
                        <input type="text" className="form-input" value={blogForm.seo_title || ''} onChange={e => setBlogForm(prev => ({ ...prev, seo_title: e.target.value }))} />
                      </div>
                      <div className="form-group">
                        <label>Meta Description Tag</label>
                        <input type="text" className="form-input" value={blogForm.meta_description || ''} onChange={e => setBlogForm(prev => ({ ...prev, meta_description: e.target.value }))} />
                      </div>
                      <div className="form-group">
                        <label>Keywords (Comma-separated)</label>
                        <input type="text" className="form-input" placeholder="PLC, Automation, etc" value={blogForm.seo_keywords || ''} onChange={e => setBlogForm(prev => ({ ...prev, seo_keywords: e.target.value }))} />
                      </div>

                      <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
                        <button type="submit" className="btn-primary">Save Article</button>
                        <button type="button" className="btn-outline" onClick={() => setEditingBlog(null)}>Cancel</button>
                      </div>
                    </form>
                  ) : (
                    <div className="admin-table-container">
                      <table className="admin-table">
                        <thead>
                          <tr>
                            <th>Image</th>
                            <th>Title</th>
                            <th>Category</th>
                            <th>Status</th>
                            <th>Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {blogs.map(blog => (
                            <tr key={blog.id}>
                              <td>
                                <img src={blog.featured_image ? `http://localhost:5000/${blog.featured_image}` : ''} alt="" style={{ width: '50px', height: '40px', objectFit: 'cover', borderRadius: '4px' }} />
                              </td>
                              <td>{blog.title}</td>
                              <td>{blog.category_name}</td>
                              <td><span className={`badge ${blog.status === 'Publish' ? 'publish' : 'draft'}`}>{blog.status}</span></td>
                              <td>
                                <button className="admin-action-btn admin-btn-edit" onClick={() => { setEditingBlog(blog); setBlogForm(blog); }}>
                                  <FaEdit /> Edit
                                </button>
                                <button className="admin-action-btn admin-btn-delete" onClick={() => deleteBlogItem(blog.id)}>
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
                          value={settingsForm.theme_primary_color || '#0093DD'}
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

              {/* TAB: SOLUTIONS */}
              {activeTab === 'solutions' && (
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                    <h2 style={{ fontSize: '22px', fontWeight: '700', margin: 0 }}>Solutions Ecosystem</h2>
                    {!editingSolution && (
                      <button className="btn-primary" onClick={() => {
                        setEditingSolution('new');
                        setSolutionForm({ category_id: '', name: '', slug: '', description: '', icon: '', service_descriptions: '', sort_order: 0, status: 'Publish', industry_ids: [], product_ids: [] });
                      }}>
                        <FaPlus /> Add Solution
                      </button>
                    )}
                  </div>

                  {editingSolution ? (
                    <form onSubmit={saveSolution} className="admin-form" style={{ maxWidth: '100%' }}>
                      <h3>{editingSolution === 'new' ? 'New Solution' : 'Edit Solution'}</h3>
                      
                      <div className="form-group">
                        <label>Category</label>
                        <select className="form-select" required value={solutionForm.category_id} onChange={e => setSolutionForm(prev => ({ ...prev, category_id: e.target.value }))}>
                          <option value="">-- Choose Category --</option>
                          {solutionCategories.map(cat => (
                            <option key={cat.id} value={cat.id}>{cat.name}</option>
                          ))}
                        </select>
                      </div>

                      <div className="form-group">
                        <label>Solution Name</label>
                        <input type="text" className="form-input" required value={solutionForm.name} onChange={e => setSolutionForm(prev => ({ ...prev, name: e.target.value }))} />
                      </div>

                      <div className="form-group">
                        <label>Slug (Unique URL)</label>
                        <input type="text" className="form-input" required value={solutionForm.slug} onChange={e => setSolutionForm(prev => ({ ...prev, slug: e.target.value }))} />
                      </div>

                      <div className="form-group">
                        <label>Description</label>
                        <textarea className="form-textarea" required value={solutionForm.description} onChange={e => setSolutionForm(prev => ({ ...prev, description: e.target.value }))} />
                      </div>

                      <div className="form-group">
                        <label>Icon CSS Class</label>
                        <input type="text" className="form-input" placeholder="FaCogs, FaBolt, etc" value={solutionForm.icon || ''} onChange={e => setSolutionForm(prev => ({ ...prev, icon: e.target.value }))} />
                      </div>

                      <div className="form-group">
                        <label>Bullet Details (Comma-separated)</label>
                        <input type="text" className="form-input" placeholder="Feature A, Feature B" value={solutionForm.service_descriptions || ''} onChange={e => setSolutionForm(prev => ({ ...prev, service_descriptions: e.target.value }))} />
                      </div>

                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                        <div className="form-group">
                          <label>Display Order</label>
                          <input type="number" className="form-input" value={solutionForm.sort_order} onChange={e => setSolutionForm(prev => ({ ...prev, sort_order: e.target.value }))} />
                        </div>
                        <div className="form-group">
                          <label>Publish Status</label>
                          <select className="form-select" value={solutionForm.status} onChange={e => setSolutionForm(prev => ({ ...prev, status: e.target.value }))}>
                            <option value="Publish">Publish</option>
                            <option value="Draft">Draft</option>
                          </select>
                        </div>
                      </div>

                      {/* Related Industries Multi-check */}
                      <div className="form-group" style={{ border: '1px solid #e2e8f0', borderRadius: '8px', padding: '16px', marginBottom: '20px' }}>
                        <label style={{ fontWeight: 'bold', marginBottom: '10px' }}>Assign to Industry Sectors:</label>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px', maxHeight: '180px', overflowY: 'auto' }}>
                          {industries.map(ind => {
                            const isChecked = solutionForm.industry_ids?.includes(ind.id);
                            return (
                              <label key={ind.id} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: '500', fontSize: '13px', margin: 0 }}>
                                <input
                                  type="checkbox"
                                  checked={isChecked}
                                  onChange={e => {
                                    const nextIds = e.target.checked
                                      ? [...(solutionForm.industry_ids || []), ind.id]
                                      : (solutionForm.industry_ids || []).filter(id => id !== ind.id);
                                    setSolutionForm(prev => ({ ...prev, industry_ids: nextIds }));
                                  }}
                                />
                                {ind.name}
                              </label>
                            );
                          })}
                        </div>
                      </div>

                      {/* Related Products Multi-check */}
                      <div className="form-group" style={{ border: '1px solid #e2e8f0', borderRadius: '8px', padding: '16px', marginBottom: '20px' }}>
                        <label style={{ fontWeight: 'bold', marginBottom: '10px' }}>Link Related Products:</label>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px', maxHeight: '180px', overflowY: 'auto' }}>
                          {products.map(prod => {
                            const isChecked = solutionForm.product_ids?.includes(prod.id);
                            return (
                              <label key={prod.id} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: '500', fontSize: '13px', margin: 0 }}>
                                <input
                                  type="checkbox"
                                  checked={isChecked}
                                  onChange={e => {
                                    const nextIds = e.target.checked
                                      ? [...(solutionForm.product_ids || []), prod.id]
                                      : (solutionForm.product_ids || []).filter(id => id !== prod.id);
                                    setSolutionForm(prev => ({ ...prev, product_ids: nextIds }));
                                  }}
                                />
                                {prod.name}
                              </label>
                            );
                          })}
                        </div>
                      </div>

                      <div className="form-group">
                        <label>Featured Image Upload</label>
                        <input type="file" className="form-input" onChange={e => setSolutionImage(e.target.files[0])} accept="image/*" />
                      </div>

                      <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
                        <button type="submit" className="btn-primary">Save Solution</button>
                        <button type="button" className="btn-outline" onClick={() => setEditingSolution(null)}>Cancel</button>
                      </div>
                    </form>
                  ) : (
                    <div className="admin-table-container">
                      <table className="admin-table">
                        <thead>
                          <tr>
                            <th>Image</th>
                            <th>Solution Name</th>
                            <th>Category</th>
                            <th>Status</th>
                            <th>Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {solutions.map(sol => (
                            <tr key={sol.id}>
                              <td>
                                <img src={sol.image_path ? `http://localhost:5000/${sol.image_path}` : ''} alt="" style={{ width: '50px', height: '40px', objectFit: 'cover', borderRadius: '4px' }} />
                              </td>
                              <td>{sol.name}</td>
                              <td>{sol.category_name}</td>
                              <td><span className={`badge ${sol.status === 'Publish' ? 'publish' : 'draft'}`}>{sol.status}</span></td>
                              <td>
                                <button className="admin-action-btn admin-btn-edit" onClick={() => { setEditingSolution(sol); setSolutionForm({ ...sol, industry_ids: sol.industry_ids || [], product_ids: sol.product_ids || [] }); }}>
                                  <FaEdit /> Edit
                                </button>
                                <button className="admin-action-btn admin-btn-delete" onClick={() => deleteSolutionItem(sol.id)}>
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

              {/* TAB: SOLUTION CATEGORIES */}
              {activeTab === 'solution_categories' && (
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                    <h2 style={{ fontSize: '22px', fontWeight: '700', margin: 0 }}>Solution Categories</h2>
                    {!editingSolutionCategory && (
                      <button className="btn-primary" onClick={() => {
                        setEditingSolutionCategory('new');
                        setSolutionCategoryForm({ name: '', sort_order: 0 });
                      }}>
                        <FaPlus /> Add Category
                      </button>
                    )}
                  </div>

                  {editingSolutionCategory ? (
                    <form onSubmit={saveSolutionCategory} className="admin-form">
                      <h3>{editingSolutionCategory === 'new' ? 'New Solution Category' : 'Edit Solution Category'}</h3>
                      <div className="form-group">
                        <label>Category Name</label>
                        <input type="text" className="form-input" required value={solutionCategoryForm.name} onChange={e => setSolutionCategoryForm(prev => ({ ...prev, name: e.target.value }))} />
                      </div>
                      <div className="form-group">
                        <label>Display Order</label>
                        <input type="number" className="form-input" value={solutionCategoryForm.sort_order} onChange={e => setSolutionCategoryForm(prev => ({ ...prev, sort_order: parseInt(e.target.value) || 0 }))} />
                      </div>
                      <div style={{ display: 'flex', gap: '10px' }}>
                        <button type="submit" className="btn-primary">Save Category</button>
                        <button type="button" className="btn-outline" onClick={() => setEditingSolutionCategory(null)}>Cancel</button>
                      </div>
                    </form>
                  ) : (
                    <div className="admin-table-container">
                      <table className="admin-table">
                        <thead>
                          <tr>
                            <th>Category Name</th>
                            <th>Display Order</th>
                            <th>Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {solutionCategories.map(cat => (
                            <tr key={cat.id}>
                              <td>{cat.name}</td>
                              <td>{cat.sort_order}</td>
                              <td>
                                <button className="admin-action-btn admin-btn-edit" onClick={() => { setEditingSolutionCategory(cat); setSolutionCategoryForm(cat); }}>
                                  <FaEdit /> Edit
                                </button>
                                <button className="admin-action-btn admin-btn-delete" onClick={() => deleteSolutionCategoryItem(cat.id)}>
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
