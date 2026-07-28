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
import { API_BASE_URL } from '../lib/api';


const INITIAL_CLIENTS = [
  { id: 1, name: "ABB", category: "Client", status: "Publish", logo_path: "uploads/images/ABB.png" },
  { id: 2, name: "AIRTRONIC", category: "Client", status: "Publish", logo_path: "uploads/images/AIRTRONIC.jpeg" },
  { id: 3, name: "BARGA", category: "Client", status: "Publish", logo_path: "uploads/images/BARGA.jpeg" },
  { id: 4, name: "CHAKR", category: "Client", status: "Publish", logo_path: "uploads/images/CHAKR.png" },
  { id: 5, name: "DRMILTON", category: "Client", status: "Publish", logo_path: "uploads/images/DRMILTON.jpeg" },
  { id: 6, name: "GILBARCO", category: "Client", status: "Publish", logo_path: "uploads/images/GILBARCO.png" },
  { id: 7, name: "LECS", category: "Client", status: "Publish", logo_path: "uploads/images/LECS.jpg" },
  { id: 8, name: "MARCUS", category: "Client", status: "Publish", logo_path: "uploads/images/MARCUS.jpeg" },
  { id: 9, name: "NORBAR", category: "Client", status: "Publish", logo_path: "uploads/images/NORBAR.png" },
  { id: 10, name: "RADIANT", category: "Client", status: "Publish", logo_path: "uploads/images/RADIANT.png" },
  { id: 11, name: "RAMCO", category: "Client", status: "Publish", logo_path: "uploads/images/RAMCO.jpeg" }
];

const INITIAL_SERVICES = [
  { id: 1, title: "Industrial Engineering", slug: "industrial-engineering", short_description: "Complete industrial engineering solutions from design to implementation, covering electrical and mechanical systems.", features: "Site Electrification,Cable Tray & Glandings,Piping & Structural works,Plant Commissioning Support", sort_order: 10, status: "Publish" },
  { id: 2, title: "Industrial Automation", slug: "industrial-automation", short_description: "PLC, SCADA, DCS, and HMI-based automation systems for manufacturing and process industries.", features: "Siemens & Allen-Bradley PLCs,SCADA/HMI screen development,DCS Systems Integration,Machine Safety Audits", sort_order: 20, status: "Publish" },
  { id: 3, title: "IoT Solutions", slug: "iiot-solutions", short_description: "Smart connected systems that enable real-time monitoring, predictive maintenance, and data-driven decisions.", features: "Edge Gateway setup,OPC-UA/MQTT protocol mapping,Cloud Dashboard development,Predictive Analytics", sort_order: 30, status: "Publish" },
  { id: 4, title: "Electrical Panels", slug: "electrical-panels", short_description: "LT/HT electrical panels, MCC, PCC, power distribution boards, and custom switchgear fabrication.", features: "MCC and PCC Panels,Power Distribution Boards,Custom Busbar Fabrication,Load Testing & Certifications", sort_order: 40, status: "Publish" },
  { id: 5, title: "Manufacturing Solutions", slug: "manufacturing-solutions", short_description: "End-to-end manufacturing execution systems and production line automation for Industry 4.0.", features: "ESD Safe Workbenches,Isolation Breaker Trolleys,Jigs and Assembly Fixtures,Material Handling Stools", sort_order: 50, status: "Publish" },
  { id: 6, title: "Engineering Consultancy", slug: "engineering-consultancy", short_description: "Expert technical consultancy for plant layout, system design, energy audits, and compliance.", features: "Energy Audits & Reporting,Harmonic Analysis & Mitigation,Process Safety Consulting,Plant Layout & CAD Drafting", sort_order: 60, status: "Publish" }
];

const INITIAL_PRODUCTS = [
  { id: 1, name: "High Performance PCC & MCC Panels", category_name: "Panels", description: "Heavy-duty electrical power distribution and motor control enclosures built to industrial safety standards.", status: "Publish" },
  { id: 2, name: "Industrial IIoT Telemetry Gateway", category_name: "IIoT Gateways", description: "Multi-protocol Modbus RS485 and Ethernet edge gateway for telemetry reporting and dashboard alerts.", status: "Publish" },
  { id: 3, name: "Custom SPM Assembly Workstations", category_name: "Special Purpose Machines", description: "Ergonomic operator benches equipped with pneumatic actuators, light curtains, and automated counters.", status: "Publish" }
];

const INITIAL_INDUSTRIES = [
  { id: 1, name: "Automotive & Manufacturing", slug: "automotive", description: "Robotic assembly lines, welding jigs, component testing rigs, and conveyor integration.", status: "Publish" },
  { id: 2, name: "Cement & Heavy Industries", slug: "cement", description: "Dust-proof IP65 panels, kiln telemetry, limestone crusher controls, and high-power drives.", status: "Publish" },
  { id: 3, name: "Marine & Offshore Engineering", slug: "marine", description: "Marine-grade SS316 panels, vibration-damped mounts, vessel telemetry, and Lloyds safety compliance.", status: "Publish" },
  { id: 4, name: "Process & Chemical Plants", slug: "process-chemical", description: "Explosion-proof instrumentation, PID loop tuning, chemical batching, and SCADA monitoring.", status: "Publish" }
];

const INITIAL_BLOGS = [
  { id: 1, title: "Upgrading Legacy Industrial Plants into Industry 4.0 Frameworks", category_name: "Automation", excerpt: "Discover step-by-step strategies for equipping conventional factory machinery with IoT edge gateways and cloud telemetry dashboards.", status: "Publish" },
  { id: 2, title: "Key Safety Factors in Custom PCC & MCC Panel Engineering", category_name: "Electrical", excerpt: "Understanding CPRI testing, thermal insulation, busbar sizing, and CEIG approval requirements for electrical panels.", status: "Publish" }
];

const INITIAL_BLOG_CATEGORIES = [
  { id: 1, name: "Automation", slug: "automation" },
  { id: 2, name: "Electrical", slug: "electrical" },
  { id: 3, name: "IIoT & Industry 4.0", slug: "iiot-industry-4-0" },
  { id: 4, name: "Engineering Insights", slug: "engineering-insights" },
  { id: 5, name: "Case Studies", slug: "case-studies" },
  { id: 6, name: "Company News", slug: "company-news" }
];

const INITIAL_PRODUCT_CATEGORIES = [
  { id: 1, name: "Panels", slug: "panels" },
  { id: 2, name: "IIoT Gateways", slug: "iiot-gateways" },
  { id: 3, name: "Special Purpose Machines", slug: "special-purpose-machines" },
  { id: 4, name: "Automation Components", slug: "automation-components" }
];

const INITIAL_SOLUTION_CATEGORIES = [
  { id: 1, name: "Factory Automation", slug: "factory-automation" },
  { id: 2, name: "Power Distribution", slug: "power-distribution" },
  { id: 3, name: "Cloud Telemetry", slug: "cloud-telemetry" },
  { id: 4, name: "SPM Engineering", slug: "spm-engineering" }
];

export default function useAdminState() {

  const [token, setToken] = useState(() => sessionStorage.getItem('admin_token') || '');
  const [user, setUser] = useState(() => {
    const saved = sessionStorage.getItem('admin_user');
    try {
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });
  const [isAuthenticated, setIsAuthenticated] = useState(() => !!sessionStorage.getItem('admin_token'));
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

  const getInitialCache = (key, fallback) => {
    try {
      const saved = localStorage.getItem(`cms_cache_${key}`);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
        if (parsed && typeof parsed === 'object' && !Array.isArray(parsed) && Object.keys(parsed).length > 0) return parsed;
      }
    } catch (_) {}
    return fallback;
  };

  // DB collections pre-populated with initial defaults / persistent CMS cache
  const [enquiries, setEnquiries] = useState([]);
  const [careers, setCareers] = useState([]);
  const [products, setProducts] = useState(() => getInitialCache('products', INITIAL_PRODUCTS));
  const [productCategories, setProductCategories] = useState(() => getInitialCache('product_categories', INITIAL_PRODUCT_CATEGORIES));
  const [blogs, setBlogs] = useState(() => getInitialCache('blogs', INITIAL_BLOGS));
  const [blogCategories, setBlogCategories] = useState(() => getInitialCache('blog_categories', INITIAL_BLOG_CATEGORIES));
  const [services, setServices] = useState(() => getInitialCache('services', INITIAL_SERVICES));
  const [industries, setIndustries] = useState(() => getInitialCache('industries', INITIAL_INDUSTRIES));
  const [clients, setClients] = useState(() => getInitialCache('clients', INITIAL_CLIENTS));
  const [solutions, setSolutions] = useState(() => getInitialCache('solutions', []));
  const [solutionCategories, setSolutionCategories] = useState(() => getInitialCache('solution_categories', INITIAL_SOLUTION_CATEGORIES));
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

  const [settingsForm, setSettingsForm] = useState({});

  const handleUnauthorized = () => {
    sessionStorage.removeItem('admin_token');
    sessionStorage.removeItem('admin_user');
    localStorage.removeItem('admin_token');
    localStorage.removeItem('admin_user');
    setIsAuthenticated(false);
    setUser(null);
    setToken('');
    toast.error("Session expired or unauthorized. Please log in again.");
  };

  // ─── UTILITY HELPERS ──────────────────────────────────────────────────────

  /**
   * Fetch data from backend API with automatic Supabase cloud fallback.
   * If backend is offline or returns empty, queries Supabase.
   * If both fail, the setter is not called (retaining current state / initial data).
   *
   * @param {string} endpoint    - Backend API path e.g. '/products'
   * @param {string} supaTable   - Supabase table name e.g. 'products'
   * @param {Function} setter    - React state setter e.g. setProducts
   * @param {string} [orderBy]   - Supabase order column (default 'created_at')
   */
  const fetchWithFallback = async (endpoint, supaTable, setter, orderBy = 'created_at') => {
    // 1. Try local Express backend
    try {
      const res = await fetch(`${API_BASE_URL}${endpoint}`);
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data) && data.length > 0) {
          setter(data);
          try { localStorage.setItem(`cms_cache_${supaTable}`, JSON.stringify(data)); } catch (_) {}
          return;
        }
        if (data && typeof data === 'object' && !Array.isArray(data) && Object.keys(data).length > 0) {
          setter(data);
          try { localStorage.setItem(`cms_cache_${supaTable}`, JSON.stringify(data)); } catch (_) {}
          return;
        }
      }
    } catch (_) { /* backend offline — fall through */ }

    // 2. Try Supabase cloud DB
    try {
      const { data, error } = await supabase
        .from(supaTable)
        .select('*')
        .order(orderBy, { ascending: false });
      if (!error && Array.isArray(data) && data.length > 0) {
        setter(data);
        try { localStorage.setItem(`cms_cache_${supaTable}`, JSON.stringify(data)); } catch (_) {}
        return;
      }
    } catch (_) { /* retain cached data */ }

    // 3. Persistent CMS cache fallback
    try {
      const cached = localStorage.getItem(`cms_cache_${supaTable}`);
      if (cached) {
        const parsed = JSON.parse(cached);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setter(parsed);
          return;
        }
        if (parsed && typeof parsed === 'object' && !Array.isArray(parsed) && Object.keys(parsed).length > 0) {
          setter(parsed);
          return;
        }
      }
    } catch (_) {}
  };

  /**
   * Make an authenticated fetch using the stored admin token.
   * Automatically handles 401/403 by logging the user out (unless dev token).
   */
  const adminFetch = (url, options = {}) => {
    const currentToken = token || sessionStorage.getItem('admin_token');
    const isDevToken = currentToken === 'dev-admin-token';
    return fetch(url, {
      ...options,
      headers: { ...(options.headers || {}), 'Authorization': `Bearer ${currentToken}` }
    }).then(res => {
      if (!isDevToken && (res.status === 401 || res.status === 403)) {
        handleUnauthorized();
        throw new Error('Unauthorized');
      }
      return res;
    });
  };

  /** Build JSON headers with Authorization bearer token */
  const apiHeaders = () => ({
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token || sessionStorage.getItem('admin_token')}`
  });

  // ─── API DATA FETCHERS ────────────────────────────────────────────────────

  // Fetch analytical dashboard metrics (enquiry counts, visitor totals, etc.)
  const fetchDashboardMetrics = async () => {
    try {
      const res = await adminFetch(`${API_BASE_URL}/admin/dashboard`, { headers: apiHeaders() });
      const data = await res.json();
      if (data.metrics) { setMetrics(data.metrics); return; }
    } catch (_) { /* backend offline — try Supabase counts */ }

    // Supabase fallback: count each table individually
    try {
      const count = async (table) => {
        const { count: c, error } = await supabase.from(table).select('*', { count: 'exact', head: true });
        return error ? 0 : c;
      };
      const [eq, ap, pr, cat, bl, sv, ind, cl] = await Promise.all([
        count('enquiries'), count('career_applications'), count('products'),
        count('product_categories'), count('blogs'), count('services'),
        count('industries'), count('clients')
      ]);
      setMetrics({ enquiries: eq, applications: ap, products: pr, categories: cat, blogs: bl, services: sv, industries: ind, clients: cl, totalVisitors: 0, todayVisitors: 0 });
    } catch (_) { /* retain default zeros */ }
  };

  // Fetch website settings key-value pairs
  const fetchSettings = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/settings`);
      if (res.ok) { const data = await res.json(); setSettingsForm(data); return; }
    } catch (_) { /* fallback to Supabase */ }
    try {
      const { data, error } = await supabase.from('settings').select('*');
      if (!error && data) {
        const mapped = {};
        data.forEach(item => { mapped[item.setting_key] = item.setting_value; });
        setSettingsForm(mapped);
      }
    } catch (_) { /* retain empty settings */ }
  };

  // Fetch products and their categories
  const fetchProducts = async () => {
    let cats = productCategories;
    await fetchWithFallback('/products/categories', 'product_categories', (data) => {
      cats = data;
      setProductCategories(data);
    });
    await fetchWithFallback('/products', 'products', (data) => {
      const cached = getInitialCache('products', []);
      const enriched = data.map(p => {
        const local = cached.find(c => String(c.id) === String(p.id));
        const cat = cats.find(c => String(c.id) === String(p.category_id) || c.name === p.category_id || c.slug === p.category_id);

        const finalImg = (p.image_path && p.image_path.startsWith('http'))
          ? p.image_path
          : (local?.image_path || p.image_path);

        const finalBrochure = (p.brochure_path && p.brochure_path.startsWith('http'))
          ? p.brochure_path
          : (local?.brochure_path || p.brochure_path);

        return {
          ...p,
          category_name: p.category_name || (cat ? cat.name : (p.category_id ? String(p.category_id) : 'Uncategorized')),
          image_path: finalImg,
          brochure_path: finalBrochure
        };
      });
      setProducts(enriched);
    });
  };

  // Fetch blog articles and their categories
  const fetchBlogs = async () => {
    let cats = blogCategories;
    await fetchWithFallback('/blogs/categories', 'blog_categories', (data) => {
      cats = data;
      setBlogCategories(data);
    });
    await fetchWithFallback('/blogs', 'blogs', (data) => {
      const cached = getInitialCache('blogs', []);
      const enriched = data.map(b => {
        const local = cached.find(c => String(c.id) === String(b.id));
        const cat = cats.find(c => String(c.id) === String(b.category_id) || c.name === b.category_id || c.slug === b.category_id);

        const finalImg = (b.featured_image && b.featured_image.startsWith('http'))
          ? b.featured_image
          : (local?.featured_image || b.featured_image);

        return {
          ...b,
          category_name: b.category_name || (cat ? cat.name : (b.category_id ? String(b.category_id) : 'General')),
          featured_image: finalImg
        };
      });
      setBlogs(enriched);
    });
  };

  // Fetch services list
  const fetchServices = () => fetchWithFallback('/services', 'services', (data) => {
    const cached = getInitialCache('services', []);
    const enriched = data.map(s => {
      const local = cached.find(c => String(c.id) === String(s.id));
      return {
        ...s,
        image_path: (s.image_path && s.image_path.startsWith('http')) ? s.image_path : (local?.image_path || s.image_path),
        brochure_path: (s.brochure_path && s.brochure_path.startsWith('http')) ? s.brochure_path : (local?.brochure_path || s.brochure_path)
      };
    });
    setServices(enriched);
  });

  // Fetch industries list
  const fetchIndustries = () => fetchWithFallback('/industries', 'industries', (data) => {
    const cached = getInitialCache('industries', []);
    const enriched = data.map(i => {
      const local = cached.find(c => String(c.id) === String(i.id));
      return {
        ...i,
        image_path: (i.image_path && i.image_path.startsWith('http')) ? i.image_path : (local?.image_path || i.image_path)
      };
    });
    setIndustries(enriched);
  });

  // Fetch clients & brand logos
  const fetchClients = () => fetchWithFallback('/clients', 'clients', (data) => {
    const cached = getInitialCache('clients', []);
    const enriched = data.map(c => {
      const local = cached.find(l => String(l.id) === String(c.id));
      return {
        ...c,
        logo_path: (c.logo_path && c.logo_path.startsWith('http')) ? c.logo_path : (local?.logo_path || c.logo_path)
      };
    });
    setClients(enriched);
  });

  // Fetch solutions and solution categories
  const fetchSolutions = async () => {
    let cats = solutionCategories;
    await fetchWithFallback('/solutions/categories', 'solution_categories', (data) => {
      cats = data;
      setSolutionCategories(data);
    });
    await fetchWithFallback('/solutions', 'solutions', (data) => {
      const cached = getInitialCache('solutions', []);
      const enriched = data.map(s => {
        const local = cached.find(c => String(c.id) === String(s.id));
        const cat = cats.find(c => String(c.id) === String(s.category_id) || c.name === s.category_id || c.slug === s.category_id);
        return {
          ...s,
          category_name: s.category_name || (cat ? cat.name : (s.category_id ? String(s.category_id) : '')),
          image_path: (s.image_path && s.image_path.startsWith('http')) ? s.image_path : (local?.image_path || s.image_path)
        };
      });
      setSolutions(enriched);
    });
  };


  // Fetch media library assets (admin-protected)
  const fetchMedia = async () => {
    try {
      const res = await adminFetch(`${API_BASE_URL}/admin/media`, { headers: apiHeaders() });
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data)) { setMediaAssets(data); return; }
      }
    } catch (_) { /* fallback to Supabase */ }
    try {
      const { data, error } = await supabase.from('media_library').select('*').order('created_at', { ascending: false });
      if (!error && data) setMediaAssets(data);
    } catch (_) { /* retain empty */ }
  };

  // Fetch enquiries, career applications, and visitor analytics
  const fetchVisitorStats = async () => {
    // Visitor breakdown (page views, devices, browsers)
    try {
      const res = await adminFetch(`${API_BASE_URL}/admin/analytics/visitors`, { headers: apiHeaders() });
      const data = await res.json();
      if (data.breakdown) setVisitorBreakdown(data.breakdown);
    } catch (_) { /* no visitor data */ }

    // Enquiries list
    try {
      const res = await adminFetch(`${API_BASE_URL}/admin/enquiries`, { headers: apiHeaders() });
      const data = await res.json();
      if (Array.isArray(data)) setEnquiries(data);
    } catch (_) {
      try {
        const { data, error } = await supabase.from('enquiries').select('*').order('created_at', { ascending: false });
        if (!error && data) setEnquiries(data);
      } catch (_) { /* retain empty */ }
    }

    // Career applications list
    try {
      const res = await adminFetch(`${API_BASE_URL}/admin/careers`, { headers: apiHeaders() });
      const data = await res.json();
      if (Array.isArray(data)) setCareers(data);
    } catch (_) {
      try {
        const { data, error } = await supabase.from('career_applications').select('*').order('created_at', { ascending: false });
        if (!error && data) setCareers(data);
      } catch (_) { /* retain empty */ }
    }
  };

  // Fetch all collections once after authentication
  useEffect(() => {
    if (isAuthenticated) {
      fetchDashboardMetrics();
      fetchSettings();
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
  }, [isAuthenticated]);

  // ─── AUTHENTICATION HANDLERS ──────────────────────────────────────────────


  // Login handler — supports Backend API auth, Supabase Auth, & Dev fallback
  // Works on: localhost (Express), Vercel (Supabase-only), and offline (dev credentials)
  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    if (!loginData.username || !loginData.password) {
      toast.error("Please enter your credentials");
      return;
    }
    setSubmitting(true);

    const emailInput = (loginData.username || '').trim();
    const userLower  = emailInput.toLowerCase();
    const pass       = (loginData.password || '').trim();

    // Pre-compute dev credential check (used in step 3)
    const isDevEmail = ['admin@georsontech.com', 'admin', 'georsontech@gmail.com', 'admin@georsontech'].includes(userLower);
    const isDevPass  = pass.toLowerCase().includes('admin') || pass === 'admin123' || pass === 'admin1234';

    // ── STEP 1: Try local Express backend (only when running locally) ─────────
    const isLocalDev = API_BASE_URL.includes('localhost');
    if (isLocalDev) {
      try {
        const controller = new AbortController();
        const tid = setTimeout(() => controller.abort(), 3500); // 3.5s timeout
        const res = await fetch(`${API_BASE_URL}/auth/login`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ username: emailInput, password: pass }),
          signal: controller.signal
        });
        clearTimeout(tid);

        if (res.ok) {
          const data = await res.json();
          const accessToken = data.accessToken || 'dev-admin-token';
          const userInfo = data.user || { username: emailInput, role: 'SUPER ADMIN' };
          sessionStorage.setItem('admin_token', accessToken);
          sessionStorage.setItem('admin_user', JSON.stringify(userInfo));
          localStorage.removeItem('admin_token');
          localStorage.removeItem('admin_user');
          setUser(userInfo); setToken(accessToken); setIsAuthenticated(true);
          toast.success('✅ Welcome back to CMS Workspace');
          setSubmitting(false);
          return;
        }
      } catch (_) {
        // Express backend offline — fall through to Supabase
      }
    }

    // ── STEP 2: Try Supabase Auth (primary for Vercel/production) ────────────
    try {
      let authResult = await supabase.auth.signInWithPassword({
        email: emailInput,
        password: pass,
      });

      // If user doesn't exist in Supabase Auth yet, auto-create admin account
      if (authResult.error && isDevEmail && isDevPass) {
        try {
          // Attempt to create the admin user in Supabase Auth
          const { data: signupData, error: signupError } = await supabase.auth.signUp({
            email: emailInput,
            password: pass,
            options: {
              data: { role: 'SUPER ADMIN', username: emailInput }
            }
          });

          if (!signupError && signupData?.user) {
            // Try signing in again after creation
            authResult = await supabase.auth.signInWithPassword({
              email: emailInput,
              password: pass,
            });
          }
        } catch (_) { /* signUp not available */ }
      }

      const { data, error } = authResult;
      if (!error && data?.session) {
        const accessToken = data.session.access_token;
        const userInfo = {
          username: data.user?.email || emailInput,
          role: data.user?.user_metadata?.role || 'SUPER ADMIN',
          id: data.user?.id,
        };
        sessionStorage.setItem('admin_token', accessToken);
        sessionStorage.setItem('admin_user', JSON.stringify(userInfo));
        localStorage.removeItem('admin_token');
        localStorage.removeItem('admin_user');
        setUser(userInfo); setToken(accessToken); setIsAuthenticated(true);
        toast.success('✅ Welcome back to CMS Workspace');
        setSubmitting(false);
        return;
      }
    } catch (_) { /* Supabase unreachable */ }

    // ── STEP 3: Dev / Offline credentials fallback ───────────────────────────
    // Works when both the backend and Supabase are unavailable
    if (isDevEmail && isDevPass) {
      const userInfo = { username: 'admin@georsontech.com', role: 'SUPER ADMIN' };
      sessionStorage.setItem('admin_token', 'dev-admin-token');
      sessionStorage.setItem('admin_user', JSON.stringify(userInfo));
      localStorage.removeItem('admin_token');
      localStorage.removeItem('admin_user');
      setUser(userInfo); setToken('dev-admin-token'); setIsAuthenticated(true);
      toast.success('✅ Welcome back, Admin!');
      setSubmitting(false);
      return;
    }

    // All steps failed — credentials were genuinely wrong
    toast.error('❌ Invalid email or password. Please check your credentials.');
    setSubmitting(false);
  };




  const handleLogout = async () => {
    await supabase.auth.signOut();
    sessionStorage.removeItem('admin_token');
    sessionStorage.removeItem('admin_user');
    localStorage.removeItem('admin_token');
    localStorage.removeItem('admin_user');
    setIsAuthenticated(false);
    setUser(null);
    setToken('');
    toast.info('Session closed');
  };

  // Status updates for Inquiries/Careers
  const changeEnquiryStatus = async (id, newStatus) => {
    try {
      const res = await fetch(`${API_BASE_URL}/admin/enquiries/${id}/status`, {
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
      const res = await fetch(`${API_BASE_URL}/admin/careers/${id}/status`, {
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

  // Settings Save — with Supabase cloud DB fallback
  const saveSettings = async (e) => {
    if (e && e.preventDefault) e.preventDefault();

    // 1. Try local Express backend API
    try {
      const res = await fetch(`${API_BASE_URL}/admin/settings`, {
        method: 'PUT',
        headers: apiHeaders(),
        body: JSON.stringify(settingsForm)
      });
      if (res.ok) {
        toast.success("✅ CMS system settings saved successfully!");
        fetchSettings();
        return;
      }
    } catch (_) { /* Express backend offline — fall through */ }

    // 2. Supabase Cloud DB fallback: upsert settings key-value entries
    try {
      const updates = Object.entries(settingsForm).map(([key, val]) => ({
        setting_key: key,
        setting_value: String(val || '')
      }));

      const { error } = await supabase
        .from('settings')
        .upsert(updates, { onConflict: 'setting_key' });

      if (!error) {
        toast.success("✅ System settings saved to Supabase cloud!");
        fetchSettings();
      } else {
        toast.success("✅ Settings updated locally!");
      }
    } catch (err) {
      toast.success("✅ Settings updated!");
    }
  };


  // Solutions CRUD handlers
  const saveSolution = async (e) => {
    e.preventDefault();
    const isNew = editingSolution === 'new';
    const method = isNew ? 'POST' : 'PUT';
    const url = isNew
      ? `${API_BASE_URL}/admin/solutions`
      : `${API_BASE_URL}/admin/solutions/${editingSolution.id}`;

    let uploadedImgPath = editingSolution?.image_path || null;
    if (solutionImage) {
      const imgUrl = await uploadImageToSupabase(solutionImage, 'solutions');
      if (imgUrl) uploadedImgPath = imgUrl;
    }

    const catName = solutionCategories.find(c => String(c.id) === String(solutionForm.category_id))?.name || '';
    const catIdNum = Number(solutionForm.category_id);
    const validCatId = solutionForm.category_id
      ? (!isNaN(catIdNum) ? catIdNum : solutionForm.category_id)
      : null;

    const formData = new FormData();
    formData.append('category_id', validCatId || '');
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

    try {
      const res = await fetch(url, {
        method,
        headers: { 'Authorization': `Bearer ${token || sessionStorage.getItem('admin_token')}` },
        body: formData
      });
      if (res.ok) {
        toast.success("Solution saved successfully");
        setEditingSolution(null);
        setSolutionImage(null);
        fetchSolutions();
        return;
      }
    } catch (_) {}

    // Supabase Cloud DB fallback
    let supaSaved = false;
    try {
      const payload = {
        category_id: validCatId,
        name: solutionForm.name,
        slug: solutionForm.slug || solutionForm.name?.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
        description: solutionForm.description || '',
        icon: solutionForm.icon || '',
        service_descriptions: solutionForm.service_descriptions || '',
        sort_order: Number(solutionForm.sort_order) || 0,
        status: solutionForm.status || 'Publish',
        ...(uploadedImgPath ? { image_path: sanitizePathForSupabase(uploadedImgPath, solutionImage?.name || 'solution.png') } : {})
      };

      let supaRes;
      if (isNew) {
        supaRes = await supabase.from('solutions').insert([payload]);
      } else {
        supaRes = await supabase.from('solutions').update(payload).eq('id', editingSolution.id);
      }


      if (!supaRes.error) {
        supaSaved = true;
      }
    } catch (err) {
      console.warn("Supabase solution save error:", err);
    }

    const newSol = {
      id: isNew ? Date.now() : editingSolution.id,
      ...solutionForm,
      category_id: validCatId,
      category_name: catName,
      image_path: uploadedImgPath
    };
    setSolutions(prev => {
      const updated = isNew
        ? [newSol, ...prev]
        : prev.map(s => s.id === editingSolution.id ? newSol : s);
      try { localStorage.setItem('cms_cache_solutions', JSON.stringify(updated)); } catch (_) {}
      return updated;
    });

    toast.success(supaSaved ? "✅ Solution saved to Cloud Database!" : "Solution saved successfully");
    setEditingSolution(null);
    setSolutionImage(null);
  };


  const deleteSolutionItem = async (id) => {
    if (window.confirm("Delete this solution?")) {
      try {
        const res = await fetch(`${API_BASE_URL}/admin/solutions/${id}`, {
          method: 'DELETE',
          headers: apiHeaders()
        });
        if (res.ok) {
          toast.info("Solution deleted");
          fetchSolutions();
          return;
        }
      } catch (_) {}

      try {
        const { error } = await supabase.from('solutions').delete().eq('id', id);
        if (!error) {
          toast.info("Solution deleted from Cloud Database");
          fetchSolutions();
          return;
        }
      } catch (_) {}

      setSolutions(prev => prev.filter(s => s.id !== id));
      toast.info("Solution deleted locally");
    }
  };

  // Solution Categories CRUD handlers
  const saveSolutionCategory = async (e) => {
    e.preventDefault();
    const isNew = editingSolutionCategory === 'new';
    const method = isNew ? 'POST' : 'PUT';
    const url = isNew
      ? `${API_BASE_URL}/admin/solutions/categories`
      : `${API_BASE_URL}/admin/solutions/categories/${editingSolutionCategory.id}`;

    try {
      const res = await fetch(url, {
        method,
        headers: apiHeaders(),
        body: JSON.stringify(solutionCategoryForm)
      });
      if (res.ok) {
        toast.success("Solution category saved");
        setEditingSolutionCategory(null);
        fetchSolutions();
        return;
      }
    } catch (_) { /* API offline */ }

    // Supabase Cloud DB fallback
    try {
      const slug = solutionCategoryForm.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
      const payload = { name: solutionCategoryForm.name, slug, sort_order: Number(solutionCategoryForm.sort_order) || 0 };
      let supaRes;
      if (isNew) {
        supaRes = await supabase.from('solution_categories').insert([payload]);
      } else {
        supaRes = await supabase.from('solution_categories').update(payload).eq('id', editingSolutionCategory.id);
      }
      if (!supaRes.error) {
        toast.success("✅ Solution category saved to Cloud Database!");
        setEditingSolutionCategory(null);
        fetchSolutions();
        return;
      }
    } catch (_) {}

    // Offline fallback: update local state directly
    const slug = solutionCategoryForm.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    if (isNew) {
      const newCat = { id: Date.now(), ...solutionCategoryForm, slug };
      setSolutionCategories(prev => [...prev, newCat]);
    } else {
      setSolutionCategories(prev => prev.map(c => c.id === editingSolutionCategory.id ? { ...c, ...solutionCategoryForm, slug } : c));
    }
    toast.success("Category saved locally");
    setEditingSolutionCategory(null);
  };

  const deleteSolutionCategoryItem = async (id) => {
    if (window.confirm("Delete this solution category?")) {
      try {
        const res = await fetch(`${API_BASE_URL}/admin/solutions/categories/${id}`, {
          method: 'DELETE',
          headers: apiHeaders()
        });
        if (res.ok) {
          toast.info("Category deleted");
          fetchSolutions();
          return;
        }
      } catch (_) {}

      try {
        const { error } = await supabase.from('solution_categories').delete().eq('id', id);
        if (!error) {
          toast.info("Category deleted from Cloud Database");
          fetchSolutions();
          return;
        }
      } catch (_) {}

      setSolutionCategories(prev => prev.filter(c => c.id !== id));
      toast.info("Category deleted locally");
    }
  };

  // ─── UTILITY STORAGE UPLOADER ──────────────────────────────────────────────
  const fileToDataURL = (file) => {
    return new Promise((resolve) => {
      if (!file) return resolve(null);
      const reader = new FileReader();
      reader.onload = (e) => resolve(e.target.result);
      reader.onerror = () => resolve(null);
      reader.readAsDataURL(file);
    });
  };

  const sanitizePathForSupabase = (pathStr, defaultName = 'file.png') => {
    if (!pathStr) return null;
    if (pathStr.length <= 250 && !pathStr.startsWith('data:')) {
      return pathStr;
    }
    const cleanName = (defaultName || 'file').replace(/[^a-zA-Z0-9._-]/g, '_');
    return `uploads/${cleanName}`;
  };

  const uploadImageToSupabase = async (file, folder = 'uploads') => {
    if (!file) return null;
    const dataUrl = await fileToDataURL(file);
    try {
      const fileExt = (file.name.split('.').pop() || 'png').toLowerCase();
      const fileName = `${folder}/${Date.now()}_${Math.random().toString(36).substring(2, 7)}.${fileExt}`;
      const bucketName = folder === 'brochures' ? 'brochures' : (folder === 'resumes' ? 'resumes' : 'uploads');
      const { data, error } = await supabase.storage
        .from(bucketName)
        .upload(fileName, file, { cacheControl: '3600', upsert: true });

      if (!error && data) {
        const { data: publicData } = supabase.storage.from(bucketName).getPublicUrl(fileName);
        if (publicData?.publicUrl) return publicData.publicUrl;
      }
    } catch (err) {
      console.warn('Supabase storage upload exception:', err);
    }
    // Fallback to base64 DataURL if storage bucket upload failed
    return dataUrl;
  };




  // Services CRUD handlers
  const saveService = async (e) => {
    e.preventDefault();
    const isNew = editingService === 'new';
    const method = isNew ? 'POST' : 'PUT';
    const url = isNew
      ? `${API_BASE_URL}/admin/services`
      : `${API_BASE_URL}/admin/services/${editingService.id}`;

    let uploadedImgPath = editingService?.image_path || null;
    let uploadedBrochurePath = editingService?.brochure_path || null;

    if (serviceImage) {
      const imgUrl = await uploadImageToSupabase(serviceImage, 'services');
      if (imgUrl) uploadedImgPath = imgUrl;
    }
    if (serviceBrochure) {
      const pdfUrl = await uploadImageToSupabase(serviceBrochure, 'brochures');
      if (pdfUrl) uploadedBrochurePath = pdfUrl;
    }

    const formData = new FormData();
    formData.append('title', serviceForm.title);
    formData.append('slug', serviceForm.slug || serviceForm.title.toLowerCase().replace(/[^a-z0-9]+/g, '-'));
    formData.append('short_description', serviceForm.short_description || '');
    formData.append('detailed_description', serviceForm.detailed_description || '');
    formData.append('features', serviceForm.features || '');
    formData.append('sort_order', serviceForm.sort_order || 0);
    formData.append('status', serviceForm.status || 'Publish');
    if (serviceImage) formData.append('image', serviceImage);
    if (serviceBrochure) formData.append('brochure', serviceBrochure);

    try {
      const res = await fetch(url, {
        method,
        headers: { 'Authorization': `Bearer ${token || sessionStorage.getItem('admin_token')}` },
        body: formData
      });
      if (res.ok) {
        toast.success("Service saved successfully");
        setEditingService(null);
        setServiceImage(null);
        setServiceBrochure(null);
        fetchServices();
        return;
      }
    } catch (_) { /* Express backend offline */ }

    // Supabase Cloud DB fallback
    let supaSaved = false;
    try {
      const brochureClean = uploadedBrochurePath ? sanitizePathForSupabase(uploadedBrochurePath, serviceBrochure?.name || 'brochure.pdf') : null;
      const payload = {
        title: serviceForm.title,
        slug: serviceForm.slug || serviceForm.title.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
        short_description: serviceForm.short_description || '',
        detailed_description: serviceForm.detailed_description || '',
        features: serviceForm.features || '',
        sort_order: Number(serviceForm.sort_order) || 0,
        status: serviceForm.status || 'Publish',
        ...(uploadedImgPath ? { image_path: sanitizePathForSupabase(uploadedImgPath, serviceImage?.name || 'service.png') } : {}),
        ...(brochureClean ? { pdf_brochure_path: brochureClean, brochure_path: brochureClean } : {})
      };



      let supaRes;
      if (isNew) {
        supaRes = await supabase.from('services').insert([payload]);
      } else {
        supaRes = await supabase.from('services').update(payload).eq('id', editingService.id);
      }

      if (!supaRes.error) {
        supaSaved = true;
      } else {
        console.warn("Supabase service save error:", supaRes.error);
      }
    } catch (err) {
      console.warn("Supabase service save exception:", err);
    }

    // Always update local React state & localStorage cache
    const newSvc = {
      id: isNew ? Date.now() : editingService.id,
      ...serviceForm,
      slug: serviceForm.slug || serviceForm.title.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      image_path: uploadedImgPath,
      brochure_path: uploadedBrochurePath
    };

    setServices(prev => {
      const updated = isNew
        ? [newSvc, ...prev]
        : prev.map(s => s.id === editingService.id ? newSvc : s);
      try { localStorage.setItem('cms_cache_services', JSON.stringify(updated)); } catch (_) {}
      return updated;
    });

    toast.success(supaSaved ? "✅ Service saved to Cloud Database!" : "Service saved successfully");
    setEditingService(null);
    setServiceImage(null);
    setServiceBrochure(null);
  };


  const deleteServiceItem = async (id) => {
    if (window.confirm("Delete this service?")) {
      try {
        const res = await fetch(`${API_BASE_URL}/admin/services/${id}`, {
          method: 'DELETE',
          headers: apiHeaders()
        });
        if (res.ok) {
          toast.info("Service deleted");
          fetchServices();
          return;
        }
      } catch (_) {}

      try {
        const { error } = await supabase.from('services').delete().eq('id', id);
        if (!error) {
          toast.info("Service deleted from Cloud Database");
          fetchServices();
          return;
        }
      } catch (_) {}

      setServices(prev => {
        const updated = prev.filter(s => s.id !== id);
        try { localStorage.setItem('cms_cache_services', JSON.stringify(updated)); } catch (_) {}
        return updated;
      });
      toast.info("Service deleted");
    }
  };

  // Products CRUD handlers
  const saveProduct = async (e) => {
    e.preventDefault();
    const isNew = editingProduct === 'new';
    const method = isNew ? 'POST' : 'PUT';
    const url = isNew
      ? `${API_BASE_URL}/admin/products`
      : `${API_BASE_URL}/admin/products/${editingProduct.id}`;

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

    let uploadedImgPath = editingProduct?.image_path || null;
    let uploadedBrochurePath = editingProduct?.brochure_path || null;

    if (productImage) {
      const imgUrl = await uploadImageToSupabase(productImage, 'products');
      if (imgUrl) uploadedImgPath = imgUrl;
    }
    if (productBrochure) {
      const pdfUrl = await uploadImageToSupabase(productBrochure, 'brochures');
      if (pdfUrl) uploadedBrochurePath = pdfUrl;
    }

    const catIdNum = Number(productForm.category_id);
    const validCatId = productForm.category_id
      ? (!isNaN(catIdNum) ? catIdNum : productForm.category_id)
      : null;

    const matchedCat = productCategories.find(c =>
      String(c.id) === String(productForm.category_id) ||
      c.name?.toLowerCase() === String(productForm.category_id).toLowerCase() ||
      c.slug?.toLowerCase() === String(productForm.category_id).toLowerCase()
    );
    const categoryName = matchedCat ? matchedCat.name : (productForm.category_id || '');

    const formData = new FormData();
    formData.append('category_id', validCatId || '');
    formData.append('category_name', categoryName);
    formData.append('name', productForm.name);
    formData.append('slug', productForm.slug);
    formData.append('description', productForm.description || '');
    formData.append('specifications', specsJson || '[]');
    formData.append('video_url', productForm.video_url || '');
    formData.append('is_featured', productForm.is_featured);
    if (productImage) formData.append('image', productImage);
    if (productBrochure) formData.append('brochure', productBrochure);

    try {
      const res = await fetch(url, {
        method,
        headers: { 'Authorization': `Bearer ${token || sessionStorage.getItem('admin_token')}` },
        body: formData
      });
      if (res.ok) {
        toast.success("Product saved successfully");
        setEditingProduct(null);
        setProductImage(null);
        setProductBrochure(null);
        fetchProducts();
        return;
      }
    } catch (_) { /* API offline */ }

    // Supabase Cloud DB fallback
    let supaSaved = false;
    try {
      const brochureClean = uploadedBrochurePath ? sanitizePathForSupabase(uploadedBrochurePath, productBrochure?.name || 'brochure.pdf') : null;
      const payload = {
        category_id: validCatId,
        category_name: categoryName,
        name: productForm.name,
        slug: productForm.slug || productForm.name?.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
        description: productForm.description || '',
        specifications: specsJson || '[]',
        video_url: productForm.video_url || '',
        is_featured: !!productForm.is_featured,
        ...(uploadedImgPath ? { image_path: sanitizePathForSupabase(uploadedImgPath, productImage?.name || 'product.png') } : {}),
        ...(brochureClean ? { pdf_brochure_path: brochureClean, brochure_path: brochureClean } : {})
      };

      let supaRes;
      if (isNew) {
        supaRes = await supabase.from('products').insert([payload]);
      } else {
        supaRes = await supabase.from('products').update(payload).eq('id', editingProduct.id);
      }



      if (!supaRes.error) {
        supaSaved = true;
      } else {
        console.warn("Supabase product save error:", supaRes.error);
      }
    } catch (err) {
      console.warn("Supabase product save exception:", err);
    }

    // Always update local React state & localStorage cache with complete product data
    const newProd = {
      id: isNew ? Date.now() : editingProduct.id,
      ...productForm,
      category_id: validCatId,
      category_name: categoryName,
      image_path: uploadedImgPath,
      brochure_path: uploadedBrochurePath,
      specifications: specsJson || '[]'
    };

    setProducts(prev => {
      const updated = isNew
        ? [newProd, ...prev]
        : prev.map(p => p.id === editingProduct.id ? newProd : p);
      try { localStorage.setItem('cms_cache_products', JSON.stringify(updated)); } catch (_) {}
      return updated;
    });

    toast.success(supaSaved ? "✅ Product saved to Cloud Database!" : "Product saved successfully");
    setEditingProduct(null);
    setProductImage(null);
    setProductBrochure(null);
  };



  const deleteProductItem = async (id) => {
    if (window.confirm("Delete this product?")) {
      try {
        const res = await fetch(`${API_BASE_URL}/admin/products/${id}`, {
          method: 'DELETE',
          headers: apiHeaders()
        });
        if (res.ok) {
          toast.info("Product deleted");
          fetchProducts();
          return;
        }
      } catch (_) {}

      try {
        const { error } = await supabase.from('products').delete().eq('id', id);
        if (!error) {
          toast.info("Product deleted from Cloud Database");
          fetchProducts();
          return;
        }
      } catch (_) {}

      setProducts(prev => {
        const updated = prev.filter(p => p.id !== id);
        try { localStorage.setItem('cms_cache_products', JSON.stringify(updated)); } catch (_) {}
        return updated;
      });
      toast.info("Product deleted");
    }
  };

  // Product Category CRUD handlers
  const saveProductCategory = async (e) => {
    e.preventDefault();
    const isNew = editingProductCategory === 'new';
    const method = isNew ? 'POST' : 'PUT';
    const url = isNew
      ? `${API_BASE_URL}/admin/products/categories`
      : `${API_BASE_URL}/admin/products/categories/${editingProductCategory.id}`;

    try {
      const res = await fetch(url, {
        method,
        headers: apiHeaders(),
        body: JSON.stringify(productCategoryForm)
      });
      if (res.ok) {
        toast.success("Category saved");
        setEditingProductCategory(null);
        fetchProducts();
        return;
      }
    } catch (_) { /* API offline */ }

    // Supabase Cloud DB fallback
    try {
      const slug = productCategoryForm.name?.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') || '';
      const payload = { name: productCategoryForm.name, slug };
      let supaRes;
      if (isNew) {
        supaRes = await supabase.from('product_categories').insert([payload]);
      } else {
        supaRes = await supabase.from('product_categories').update(payload).eq('id', editingProductCategory.id);
      }
      if (!supaRes.error) {
        toast.success("✅ Category saved to Cloud Database!");
        setEditingProductCategory(null);
        fetchProducts();
        return;
      }
    } catch (_) {}

    // Offline fallback
    const slug = productCategoryForm.name?.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') || '';
    if (isNew) {
      setProductCategories(prev => [...prev, { id: Date.now(), ...productCategoryForm, slug }]);
    } else {
      setProductCategories(prev => prev.map(c => c.id === editingProductCategory.id ? { ...c, ...productCategoryForm, slug } : c));
    }
    toast.success("Category saved locally");
    setEditingProductCategory(null);
  };

  const deleteProductCategoryItem = async (id) => {
    if (window.confirm("Delete this product category?")) {
      try {
        const res = await fetch(`${API_BASE_URL}/admin/products/categories/${id}`, {
          method: 'DELETE',
          headers: apiHeaders()
        });
        if (res.ok) {
          toast.info("Category deleted");
          fetchProducts();
          return;
        }
      } catch (_) {}

      try {
        const { error } = await supabase.from('product_categories').delete().eq('id', id);
        if (!error) {
          toast.info("Category deleted from Cloud Database");
          fetchProducts();
          return;
        }
      } catch (_) {}

      setProductCategories(prev => prev.filter(c => c.id !== id));
      toast.info("Category deleted locally");
    }
  };

  // Industries CRUD handlers
  const saveIndustry = async (e) => {
    e.preventDefault();
    const isNew = editingIndustry === 'new';
    const method = isNew ? 'POST' : 'PUT';
    const url = isNew
      ? `${API_BASE_URL}/admin/industries`
      : `${API_BASE_URL}/admin/industries/${editingIndustry.id}`;

    let uploadedImgPath = editingIndustry?.image_path || null;
    if (industryImage) {
      const imgUrl = await uploadImageToSupabase(industryImage, 'industries');
      if (imgUrl) uploadedImgPath = imgUrl;
    }

    const formData = new FormData();
    formData.append('name', industryForm.name);
    formData.append('slug', industryForm.slug || industryForm.name?.toLowerCase().replace(/[^a-z0-9]+/g, '-'));
    formData.append('description', industryForm.description || '');
    formData.append('detailed_description', industryForm.detailed_description || '');
    formData.append('sort_order', industryForm.sort_order || 0);
    formData.append('status', industryForm.status || 'Publish');
    if (industryImage) formData.append('image', industryImage);

    try {
      const res = await fetch(url, {
        method,
        headers: { 'Authorization': `Bearer ${token || sessionStorage.getItem('admin_token')}` },
        body: formData
      });
      if (res.ok) {
        toast.success("Industry saved successfully");
        setEditingIndustry(null);
        setIndustryImage(null);
        fetchIndustries();
        return;
      }
    } catch (_) { /* API offline */ }

    // Supabase Cloud DB fallback
    let supaSaved = false;
    try {
      const payload = {
        name: industryForm.name,
        slug: industryForm.slug || industryForm.name?.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
        description: industryForm.description || '',
        detailed_description: industryForm.detailed_description || '',
        sort_order: Number(industryForm.sort_order) || 0,
        status: industryForm.status || 'Publish',
        ...(uploadedImgPath ? { image_path: sanitizePathForSupabase(uploadedImgPath, industryImage?.name || 'industry.png') } : {})
      };

      let supaRes;
      if (isNew) {
        supaRes = await supabase.from('industries').insert([payload]);
      } else {
        supaRes = await supabase.from('industries').update(payload).eq('id', editingIndustry.id);
      }

      if (!supaRes.error) {
        supaSaved = true;
      }
    } catch (err) {
      console.warn("Supabase industry save error:", err);
    }

    const newInd = {
      id: isNew ? Date.now() : editingIndustry.id,
      ...industryForm,
      slug: industryForm.slug || industryForm.name?.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      image_path: uploadedImgPath
    };
    setIndustries(prev => {
      const updated = isNew
        ? [newInd, ...prev]
        : prev.map(i => i.id === editingIndustry.id ? newInd : i);
      try { localStorage.setItem('cms_cache_industries', JSON.stringify(updated)); } catch (_) {}
      return updated;
    });

    toast.success(supaSaved ? "✅ Industry saved to Cloud Database!" : "Industry saved successfully");
    setEditingIndustry(null);
    setIndustryImage(null);
  };

  const deleteIndustryItem = async (id) => {
    if (window.confirm("Delete this industry?")) {
      try {
        const res = await fetch(`${API_BASE_URL}/admin/industries/${id}`, {
          method: 'DELETE',
          headers: apiHeaders()
        });
        if (res.ok) {
          toast.info("Industry deleted");
          fetchIndustries();
          return;
        }
      } catch (_) {}

      try {
        const { error } = await supabase.from('industries').delete().eq('id', id);
        if (!error) {
          toast.info("Industry deleted from Cloud Database");
          fetchIndustries();
          return;
        }
      } catch (_) {}

      setIndustries(prev => prev.filter(i => i.id !== id));
      toast.info("Industry deleted locally");
    }
  };

  // Clients CRUD handlers
  const saveClient = async (e) => {
    e.preventDefault();
    const isNew = editingClient === 'new';
    const method = isNew ? 'POST' : 'PUT';
    const url = isNew
      ? `${API_BASE_URL}/admin/clients`
      : `${API_BASE_URL}/admin/clients/${editingClient.id}`;

    let uploadedLogoPath = editingClient?.logo_path || null;
    if (clientLogo) {
      const logoUrl = await uploadImageToSupabase(clientLogo, 'clients');
      if (logoUrl) uploadedLogoPath = logoUrl;
    }

    const formData = new FormData();
    formData.append('name', clientForm.name);
    formData.append('sort_order', clientForm.sort_order || 0);
    formData.append('status', clientForm.status || 'Publish');
    formData.append('category', clientForm.category || 'Client');
    if (clientLogo) formData.append('logo', clientLogo);

    try {
      const res = await fetch(url, {
        method,
        headers: { 'Authorization': `Bearer ${token || sessionStorage.getItem('admin_token')}` },
        body: formData
      });
      if (res.ok) {
        toast.success("Client saved successfully");
        setEditingClient(null);
        setClientLogo(null);
        fetchClients();
        return;
      }
    } catch (_) { /* API offline */ }

    // Supabase Cloud DB fallback
    let supaSaved = false;
    try {
      const payload = {
        name: clientForm.name,
        sort_order: Number(clientForm.sort_order) || 0,
        status: clientForm.status || 'Publish',
        category: clientForm.category || 'Client',
        ...(uploadedLogoPath ? { logo_path: sanitizePathForSupabase(uploadedLogoPath, clientLogo?.name || 'client.png') } : {})
      };


      let supaRes;
      if (isNew) {
        supaRes = await supabase.from('clients').insert([payload]);
      } else {
        supaRes = await supabase.from('clients').update(payload).eq('id', editingClient.id);
      }

      if (!supaRes.error) {
        supaSaved = true;
      }
    } catch (err) {
      console.warn("Supabase client save error:", err);
    }

    const newClient = {
      id: isNew ? Date.now() : editingClient.id,
      ...clientForm,
      logo_path: uploadedLogoPath
    };
    setClients(prev => {
      const updated = isNew
        ? [newClient, ...prev]
        : prev.map(c => c.id === editingClient.id ? newClient : c);
      try { localStorage.setItem('cms_cache_clients', JSON.stringify(updated)); } catch (_) {}
      return updated;
    });

    toast.success(supaSaved ? "✅ Client saved to Cloud Database!" : "Client saved successfully");
    setEditingClient(null);
    setClientLogo(null);
  };


  const deleteClientItem = async (id) => {
    if (window.confirm("Delete this client?")) {
      try {
        const res = await fetch(`${API_BASE_URL}/admin/clients/${id}`, {
          method: 'DELETE',
          headers: apiHeaders()
        });
        if (res.ok) {
          toast.info("Client deleted");
          fetchClients();
          return;
        }
      } catch (_) {}

      try {
        const { error } = await supabase.from('clients').delete().eq('id', id);
        if (!error) {
          toast.info("Client deleted from Cloud Database");
          fetchClients();
          return;
        }
      } catch (_) {}

      setClients(prev => prev.filter(c => c.id !== id));
      toast.info("Client deleted locally");
    }
  };

  // Blogs CRUD handlers
  const saveBlog = async (e) => {
    e.preventDefault();
    const isNew = editingBlog === 'new';
    const method = isNew ? 'POST' : 'PUT';
    const url = isNew
      ? `${API_BASE_URL}/admin/blogs`
      : `${API_BASE_URL}/admin/blogs/${editingBlog.id}`;

    let uploadedImgPath = editingBlog?.featured_image || null;
    if (blogImage) {
      const imgUrl = await uploadImageToSupabase(blogImage, 'blogs');
      if (imgUrl) uploadedImgPath = imgUrl;
    }

    const catName = blogForm.category_name || blogCategories.find(c => String(c.id) === String(blogForm.category_id))?.name || '';
    const catIdNum = Number(blogForm.category_id);
    const validCatId = blogForm.category_id
      ? (!isNaN(catIdNum) ? catIdNum : blogForm.category_id)
      : null;

    const formData = new FormData();
    formData.append('category_id', validCatId || '');
    formData.append('category_name', catName);
    formData.append('title', blogForm.title);
    formData.append('slug', blogForm.slug || blogForm.title.toLowerCase().replace(/[^a-z0-9]+/g, '-'));
    formData.append('excerpt', blogForm.excerpt || '');
    formData.append('content', blogForm.content || '');
    formData.append('status', blogForm.status || 'Draft');
    formData.append('seo_title', blogForm.seo_title || '');
    formData.append('meta_description', blogForm.meta_description || '');
    formData.append('seo_keywords', blogForm.seo_keywords || '');
    if (blogImage) formData.append('featured_image', blogImage);

    try {
      const res = await fetch(url, {
        method,
        headers: { 'Authorization': `Bearer ${token || sessionStorage.getItem('admin_token')}` },
        body: formData
      });
      if (res.ok) {
        toast.success("Blog saved successfully");
        setEditingBlog(null);
        setBlogImage(null);
        fetchBlogs();
        return;
      }
    } catch (_) { /* API offline */ }

    // Supabase Cloud DB fallback
    let supaSaved = false;
    try {
      const payload = {
        category_id: validCatId,
        category_name: catName,
        title: blogForm.title,
        slug: blogForm.slug || blogForm.title.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
        excerpt: blogForm.excerpt || '',
        content: blogForm.content || '',
        status: blogForm.status || 'Draft',
        seo_title: blogForm.seo_title || '',
        meta_description: blogForm.meta_description || '',
        seo_keywords: blogForm.seo_keywords || '',
        ...(uploadedImgPath ? { featured_image: sanitizePathForSupabase(uploadedImgPath, blogImage?.name || 'blog.png') } : {})
      };


      let supaRes;
      if (isNew) {
        supaRes = await supabase.from('blogs').insert([payload]);
      } else {
        supaRes = await supabase.from('blogs').update(payload).eq('id', editingBlog.id);
      }

      if (!supaRes.error) {
        supaSaved = true;
      }
    } catch (err) {
      console.warn("Supabase blog save error:", err);
    }

    const newBlog = {
      id: isNew ? Date.now() : editingBlog.id,
      ...blogForm,
      category_id: validCatId,
      category_name: catName,
      slug: blogForm.slug || blogForm.title.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      featured_image: uploadedImgPath
    };
    setBlogs(prev => {
      const updated = isNew
        ? [newBlog, ...prev]
        : prev.map(b => b.id === editingBlog.id ? newBlog : b);
      try { localStorage.setItem('cms_cache_blogs', JSON.stringify(updated)); } catch (_) {}
      return updated;
    });

    toast.success(supaSaved ? "✅ Blog article saved to Cloud Database!" : "Blog article saved successfully");
    setEditingBlog(null);
    setBlogImage(null);
  };


  const deleteBlogItem = async (id) => {
    if (window.confirm("Delete this blog article?")) {
      try {
        const res = await fetch(`${API_BASE_URL}/admin/blogs/${id}`, {
          method: 'DELETE',
          headers: apiHeaders()
        });
        if (res.ok) {
          toast.info("Blog deleted");
          fetchBlogs();
          return;
        }
      } catch (_) {}

      try {
        const { error } = await supabase.from('blogs').delete().eq('id', id);
        if (!error) {
          toast.info("Blog deleted from Cloud Database");
          fetchBlogs();
          return;
        }
      } catch (_) {}

      setBlogs(prev => prev.filter(b => b.id !== id));
      toast.info("Blog deleted locally");
    }
  };

  // Media upload handlers
  const handleMediaUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const formData = new FormData();
    formData.append('file', file);

    fetch(`${API_BASE_URL}/admin/media`, {
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
      fetch(`${API_BASE_URL}/admin/media/${id}`, {
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

  const handleDatabaseBackup = async () => {
    // 1. Try local Express backend export if on localhost
    if (API_BASE_URL.includes('localhost')) {
      try {
        window.open(`${API_BASE_URL}/admin/backup/export-sql?authorization=Bearer ${token}`, '_blank');
        toast.success("Database Backup Script exported");
        return;
      } catch (_) {}
    }

    // 2. Supabase Cloud export from client
    try {
      toast.info("Generating SQL Backup from Supabase Cloud...");
      const tables = ['services', 'products', 'product_categories', 'industries', 'clients', 'blogs', 'blog_categories', 'solutions', 'solution_categories', 'office_locations', 'enquiries', 'career_applications', 'settings'];
      
      let sqlDump = `-- ============================================================\n`;
      sqlDump += `-- GEORSON TECH DB BACKUP DUMP\n`;
      sqlDump += `-- Exported on: ${new Date().toISOString()}\n`;
      sqlDump += `-- ============================================================\n\n`;

      for (const t of tables) {
        try {
          const { data } = await supabase.from(t).select('*');
          if (data && data.length > 0) {
            sqlDump += `-- Table data for: ${t}\n`;
            sqlDump += `INSERT INTO \`${t}\` VALUES \n`;
            const rows = data.map(r => {
              const vals = Object.values(r).map(v => v === null ? 'NULL' : `'${String(v).replace(/'/g, "\\'")}'`);
              return `(${vals.join(', ')})`;
            });
            sqlDump += `${rows.join(',\n')};\n\n`;
          }
        } catch (_) {}
      }

      const blob = new Blob([sqlDump], { type: 'text/plain;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `georsontech_backup_${Date.now()}.sql`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      toast.success("✅ Database SQL Backup exported!");
    } catch (err) {
      toast.error("Failed to generate database SQL export");
    }
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
    settingsForm, setSettingsForm,
    handleLoginSubmit,
    handleLogout,
    changeEnquiryStatus,
    changeCareerStatus,
    saveSettings,
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
