/**
 * @file useAdminState.js
 * @description Custom React hook managing the entire state machine of the Admin CMS.
 * Handles admin session JWT authentication, auto-redirection on token expiry (401/403),
 * analytical stats aggregation, and CRUD requests for products, services, clients, blogs,
 * backup/restore, settings, and offices.
 */
import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';

export default function useAdminState() {
  const [token, setToken] = useState(() => localStorage.getItem('admin_token') || '');
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('admin_user');
    try {
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });
  const [isAuthenticated, setIsAuthenticated] = useState(() => !!localStorage.getItem('admin_token'));
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
    name: '', sort_order: 0, status: 'Publish', category: 'Client'
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

  const handleUnauthorized = () => {
    localStorage.removeItem('admin_token');
    localStorage.removeItem('admin_user');
    setIsAuthenticated(false);
    setUser(null);
    toast.error("Session expired or unauthorized. Please log in again.");
  };

  const adminFetch = (url, options = {}) => {
    return fetch(url, options).then(res => {
      if (res.status === 401 || res.status === 403) {
        handleUnauthorized();
        throw new Error('Unauthorized');
      }
      return res;
    });
  };

  const apiHeaders = () => ({
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token || localStorage.getItem('admin_token')}`
  });

  // ─── API CONNECTORS ───

  const fetchDashboardMetrics = () => {
    adminFetch('http://localhost:5000/api/admin/dashboard', { headers: apiHeaders() })
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
    adminFetch('http://localhost:5000/api/admin/media', { headers: apiHeaders() })
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) setMediaAssets(data);
      })
      .catch(() => {});
  };

  const fetchVisitorStats = () => {
    adminFetch('http://localhost:5000/api/admin/analytics/visitors', { headers: apiHeaders() })
      .then(res => res.json())
      .then(data => {
        if (data.breakdown) setVisitorBreakdown(data.breakdown);
      })
      .catch(() => {});

    adminFetch('http://localhost:5000/api/admin/enquiries', { headers: apiHeaders() })
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) setEnquiries(data);
      })
      .catch(() => {});

    adminFetch('http://localhost:5000/api/admin/careers', { headers: apiHeaders() })
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) setCareers(data);
      })
      .catch(() => {});
  };

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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated, activeTab]);

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

  const startEditLocation = (loc) => {
    setEditingLocation(loc);
    setLocationForm({
      office_name: loc.office_name || '',
      office_type: loc.office_type || '',
      address: loc.address || '',
      phone: loc.phone || '',
      email: loc.email || '',
      google_map_link: loc.google_map_link || '',
      latitude: loc.latitude || '',
      longitude: loc.longitude || ''
    });
  };

  const deleteLocationItem = (id) => {
    if (window.confirm("Delete this office location?")) {
      fetch(`http://localhost:5000/api/admin/locations/${id}`, {
        method: 'DELETE',
        headers: apiHeaders()
      })
        .then(res => {
          if (res.ok) {
            toast.info("Office location deleted");
            fetchLocations();
          } else {
            res.json().then(d => toast.error(d.message || "Failed to delete"));
          }
        });
    }
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

    let specsJson = null;
    if (productForm.specifications) {
      if (typeof productForm.specifications === 'string') {
        try {
          JSON.parse(productForm.specifications);
          specsJson = productForm.specifications;
        } catch {
          const specsArray = productForm.specifications.split(',').map(s => s.trim()).filter(Boolean);
          specsJson = JSON.stringify(specsArray);
        }
      } else if (Array.isArray(productForm.specifications)) {
        specsJson = JSON.stringify(productForm.specifications);
      }
    }

    const formData = new FormData();
    formData.append('category_id', productForm.category_id);
    formData.append('name', productForm.name);
    formData.append('slug', productForm.slug);
    formData.append('description', productForm.description);
    formData.append('specifications', specsJson || '[]');
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
    formData.append('category', clientForm.category || 'Client');
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

  return {
    token, setToken,
    user, setUser,
    isAuthenticated, setIsAuthenticated,
    activeTab, setActiveTab,
    loginData, setLoginData,
    submitting,
    metrics,
    visitorBreakdown,
    enquiries,
    careers,
    products,
    productCategories,
    blogs,
    blogCategories,
    locations,
    services,
    industries,
    clients,
    solutions,
    solutionCategories,
    mediaAssets,
    viewItem, setViewItem,
    editingService, setEditingService,
    editingProduct, setEditingProduct,
    editingProductCategory, setEditingProductCategory,
    editingIndustry, setEditingIndustry,
    editingClient, setEditingClient,
    editingBlog, setEditingBlog,
    editingLocation, setEditingLocation,
    editingSolution, setEditingSolution,
    editingSolutionCategory, setEditingSolutionCategory,
    solutionForm, setSolutionForm,
    solutionCategoryForm, setSolutionCategoryForm,
    setSolutionImage,
    serviceForm, setServiceForm,
    setServiceImage,
    setServiceBrochure,
    productForm, setProductForm,
    setProductImage,
    setProductBrochure,
    productCategoryForm, setProductCategoryForm,
    industryForm, setIndustryForm,
    setIndustryImage,
    clientForm, setClientForm,
    setClientLogo,
    blogForm, setBlogForm,
    setBlogImage,
    locationForm, setLocationForm,
    settingsForm, setSettingsForm,
    handleLoginSubmit,
    handleLogout,
    changeEnquiryStatus,
    changeCareerStatus,
    saveSettings,
    saveLocation,
    startEditLocation,
    deleteLocationItem,
    saveSolution,
    deleteSolutionItem,
    saveSolutionCategory,
    deleteSolutionCategoryItem,
    saveService,
    deleteServiceItem,
    saveProduct,
    deleteProductItem,
    saveProductCategory,
    deleteProductCategoryItem,
    saveIndustry,
    deleteIndustryItem,
    saveClient,
    deleteClientItem,
    saveBlog,
    deleteBlogItem,
    handleMediaUpload,
    deleteMediaAsset,
    handleDatabaseBackup
  };
}
