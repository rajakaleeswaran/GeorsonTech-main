/**
 * @file useAdminState.js
 * @description Custom React hook managing the entire state machine of the Admin CMS.
 * Handles admin session JWT authentication via Supabase Auth, auto-redirection on
 * token expiry (401/403), analytical stats aggregation, and CRUD requests for products,
 * services, clients, blogs, backup/restore, settings, and offices.
 */
import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { supabase } from '../lib/supabase';

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

  const fetchDashboardMetrics = async () => {
    try {
      const res = await adminFetch('http://localhost:5000/api/admin/dashboard', { headers: apiHeaders() });
      const data = await res.json();
      if (data.metrics) {
        setMetrics(data.metrics);
        return;
      }
    } catch (e) {
      console.log('Local backend down. Calculating dashboard metrics from Supabase.');
    }

    // Fallback: Calculate metrics from Supabase Cloud DB
    try {
      const getCount = async (table) => {
        const { count, error } = await supabase.from(table).select('*', { count: 'exact', head: true });
        return error ? 0 : count;
      };

      const [enquiriesCount, applicationsCount, productsCount, categoriesCount, blogsCount, servicesCount, industriesCount, clientsCount] = await Promise.all([
        getCount('enquiries'),
        getCount('career_applications'),
        getCount('products'),
        getCount('product_categories'),
        getCount('blogs'),
        getCount('services'),
        getCount('industries'),
        getCount('clients')
      ]);

      setMetrics({
        enquiries: enquiriesCount,
        applications: applicationsCount,
        products: productsCount,
        categories: categoriesCount,
        blogs: blogsCount,
        services: servicesCount,
        industries: industriesCount,
        clients: clientsCount,
        totalVisitors: 0,
        todayVisitors: 0
      });
    } catch (err) {
      console.error('Failed to compute metrics from Supabase:', err);
    }
  };

  const fetchSettings = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/settings');
      if (res.ok) {
        const data = await res.json();
        setSettingsForm(data);
        return;
      }
    } catch (e) {}
    const { data, error } = await supabase.from('settings').select('*');
    if (!error && data) {
      const mapped = {};
      data.forEach(item => {
        mapped[item.setting_key] = item.setting_value;
      });
      setSettingsForm(mapped);
    }
  };

  const fetchLocations = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/locations');
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data)) {
          setLocations(data);
          return;
        }
      }
    } catch (e) {}
    const { data, error } = await supabase.from('office_locations').select('*').order('created_at', { ascending: false });
    if (!error && data) setLocations(data);
  };

  const fetchProducts = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/products');
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data)) setProducts(data);
      }
    } catch (e) {
      const { data, error } = await supabase.from('products').select('*').order('created_at', { ascending: false });
      if (!error && data) setProducts(data);
    }

    try {
      const res = await fetch('http://localhost:5000/api/products/categories');
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data)) setProductCategories(data);
      }
    } catch (e) {
      const { data, error } = await supabase.from('product_categories').select('*').order('created_at', { ascending: false });
      if (!error && data) setProductCategories(data);
    }
  };

  const fetchBlogs = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/blogs');
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data)) setBlogs(data);
      }
    } catch (e) {
      const { data, error } = await supabase.from('blogs').select('*').order('created_at', { ascending: false });
      if (!error && data) setBlogs(data);
    }

    try {
      const res = await fetch('http://localhost:5000/api/blogs/categories');
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data)) setBlogCategories(data);
      }
    } catch (e) {
      const { data, error } = await supabase.from('blog_categories').select('*').order('created_at', { ascending: false });
      if (!error && data) setBlogCategories(data);
    }
  };

  const fetchServices = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/services');
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data)) {
          setServices(data);
          return;
        }
      }
    } catch (e) {}
    const { data, error } = await supabase.from('services').select('*').order('created_at', { ascending: false });
    if (!error && data) setServices(data);
  };

  const fetchIndustries = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/industries');
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data)) {
          setIndustries(data);
          return;
        }
      }
    } catch (e) {}
    const { data, error } = await supabase.from('industries').select('*').order('created_at', { ascending: false });
    if (!error && data) setIndustries(data);
  };

  const fetchClients = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/clients');
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data)) {
          setClients(data);
          return;
        }
      }
    } catch (e) {}
    const { data, error } = await supabase.from('clients').select('*').order('created_at', { ascending: false });
    if (!error && data) setClients(data);
  };

  const fetchSolutions = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/solutions');
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data)) setSolutions(data);
      }
    } catch (e) {
      const { data, error } = await supabase.from('solutions').select('*').order('created_at', { ascending: false });
      if (!error && data) setSolutions(data);
    }

    try {
      const res = await fetch('http://localhost:5000/api/solutions/categories');
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data)) setSolutionCategories(data);
      }
    } catch (e) {
      const { data, error } = await supabase.from('solution_categories').select('*').order('created_at', { ascending: false });
      if (!error && data) setSolutionCategories(data);
    }
  };

  const fetchMedia = async () => {
    try {
      const res = await adminFetch('http://localhost:5000/api/admin/media', { headers: apiHeaders() });
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data)) {
          setMediaAssets(data);
          return;
        }
      }
    } catch (e) {}
    const { data, error } = await supabase.from('media_library').select('*').order('created_at', { ascending: false });
    if (!error && data) setMediaAssets(data);
  };

  const fetchVisitorStats = async () => {
    // 1. Visitor Breakdown
    try {
      const res = await adminFetch('http://localhost:5000/api/admin/analytics/visitors', { headers: apiHeaders() });
      const data = await res.json();
      if (data.breakdown) setVisitorBreakdown(data.breakdown);
    } catch (e) {}

    // 2. Enquiries
    try {
      const res = await adminFetch('http://localhost:5000/api/admin/enquiries', { headers: apiHeaders() });
      const data = await res.json();
      if (Array.isArray(data)) {
        setEnquiries(data);
      }
    } catch (e) {
      // Supabase fallback
      const { data, error } = await supabase.from('enquiries').select('*').order('created_at', { ascending: false });
      if (!error && data) {
        setEnquiries(data);
      }
    }

    // 3. Career Applications
    try {
      const res = await adminFetch('http://localhost:5000/api/admin/careers', { headers: apiHeaders() });
      const data = await res.json();
      if (Array.isArray(data)) {
        setCareers(data);
      }
    } catch (e) {
      // Supabase fallback
      const { data, error } = await supabase.from('career_applications').select('*').order('created_at', { ascending: false });
      if (!error && data) {
        setCareers(data);
      }
    }
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

  // Login handler — uses Supabase Auth (email + password)
  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    // The "username" field accepts an email address for Supabase auth
    if (!loginData.username || !loginData.password) {
      toast.error("Please enter credentials");
      return;
    }
    setSubmitting(true);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: loginData.username,
        password: loginData.password,
      });

      if (error) {
        toast.error(error.message || 'Authentication failed');
        return;
      }

      const accessToken = data.session?.access_token || '';
      const userInfo = {
        username: data.user?.email || 'Admin',
        role: data.user?.user_metadata?.role || 'super_admin',
        id: data.user?.id,
      };

      localStorage.setItem('admin_token', accessToken);
      localStorage.setItem('admin_user', JSON.stringify(userInfo));
      setUser(userInfo);
      setToken(accessToken);
      setIsAuthenticated(true);
      toast.success('Welcome back to CMS Workspace');
    } catch (err) {
      toast.error('Authentication failed. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    localStorage.removeItem('admin_token');
    localStorage.removeItem('admin_user');
    setIsAuthenticated(false);
    setUser(null);
    toast.info('Session closed');
  };

  // Status updates for Inquiries/Careers
  const changeEnquiryStatus = async (id, newStatus) => {
    try {
      const res = await fetch(`http://localhost:5000/api/admin/enquiries/${id}/status`, {
        method: 'PUT',
        headers: apiHeaders(),
        body: JSON.stringify({ status: newStatus })
      });
      if (res.ok) {
        toast.success("Enquiry status updated");
        fetchVisitorStats();
        return;
      }
    } catch (e) {
      console.log('Local backend down, updating Enquiry status in Supabase directly.');
    }

    // Supabase update
    const { error } = await supabase.from('enquiries').update({ status: newStatus }).eq('id', id);
    if (!error) {
      toast.success("Enquiry status updated in Supabase cloud DB");
      fetchVisitorStats();
    } else {
      toast.error("Failed to update status");
    }
  };

  const changeCareerStatus = async (id, newStatus) => {
    try {
      const res = await fetch(`http://localhost:5000/api/admin/careers/${id}/status`, {
        method: 'PUT',
        headers: apiHeaders(),
        body: JSON.stringify({ status: newStatus })
      });
      if (res.ok) {
        toast.success("Candidate application status updated");
        fetchVisitorStats();
        return;
      }
    } catch (e) {
      console.log('Local backend down, updating Career application status in Supabase directly.');
    }

    // Supabase update
    const { error } = await supabase.from('career_applications').update({ status: newStatus }).eq('id', id);
    if (!error) {
      toast.success("Candidate status updated in Supabase cloud DB");
      fetchVisitorStats();
    } else {
      toast.error("Failed to update status");
    }
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
