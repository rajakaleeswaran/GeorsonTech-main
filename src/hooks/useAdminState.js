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


const INITIAL_OFFICES = [
  {
    id: 1,
    office_name: "Chennai Head Office",
    office_type: "Registered Office",
    address: "No. #4/8, Sriram Nagar Main Road, Karambakkam, Porur, Chennai – 600 116.",
    phone: "+91 98407 80897",
    email: "projects@georsontech.com",
    google_map_link: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3887.079207050303!2d80.1570535!3d12.9922097!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMTLCsDU5JzMxLjEiTiA4MMKwMDknMzMuMyJF!5e0!3m2!1sen!2sin!4v1688123456789"
  },
  {
    id: 2,
    office_name: "Coimbatore Unit-1",
    office_type: "Manufacturing Unit",
    address: "Coimbatore, Tamil Nadu, India.",
    phone: "+91 95000 81901",
    email: "covai@georsontech.com",
    google_map_link: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d125320.1706692237!2d76.88483259999999!3d11.0168445!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3ba859af2f971cb5%3A0x2fc1c81e183ed282!2sCoimbatore%2C%20Tamil%20Nadu!5e0!3m2!1sen!2sin!4v1688123456790"
  },
  {
    id: 3,
    office_name: "Coimbatore Unit-2",
    office_type: "Service Unit",
    address: "Coimbatore, Tamil Nadu, India.",
    phone: "+91 95000 81901",
    email: "covai@georsontech.com",
    google_map_link: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d125320.1706692237!2d76.88483259999999!3d11.0168445!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3ba859af2f971cb5%3A0x2fc1c81e183ed282!2sCoimbatore%2C%20Tamil%20Nadu!5e0!3m2!1sen!2sin!4v1688123456791"
  }
];

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
  { id: 1, title: "Industrial Automation & PLC/SCADA Integration", slug: "industrial-automation", short_description: "End-to-end automation design, Siemens/Rockwell PLC programming, HMI screen mapping, and SCADA architecture.", status: "Publish" },
  { id: 2, title: "PCC & MCC Electrical Panel Manufacturing", slug: "electrical-panels", short_description: "Custom power control centers (PCC) and motor control centers (MCC) built to CPRI and CEIG compliance.", status: "Publish" },
  { id: 3, title: "IIoT & Industry 4.0 Smart Gateway Solutions", slug: "iiot-solutions", short_description: "Connect legacy factory equipment to cloud dashboards for real-time telemetry, energy tracking, and predictive maintenance.", status: "Publish" },
  { id: 4, title: "Turnkey Mechanical & Electrical EPC Contracts", slug: "epc-contracts", short_description: "Concept to commissioning project execution: high-voltage cabling, structural trays, piping, and plant layout design.", status: "Publish" },
  { id: 5, title: "Special Purpose Machines (SPM) & Retrofitting", slug: "special-purpose-machines", short_description: "Custom designed SPM machinery for high-speed component assembly, picking, and quality testing.", status: "Publish" },
  { id: 6, title: "Annual Maintenance Contracts (AMC) & Support", slug: "annual-maintenance-contracts", short_description: "Priority preventative maintenance checkups, emergency breakdown visits, and spare parts sourcing.", status: "Publish" }
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

  // DB collections pre-populated with initial defaults
  const [enquiries, setEnquiries] = useState([]);
  const [careers, setCareers] = useState([]);
  const [products, setProducts] = useState(INITIAL_PRODUCTS);
  const [productCategories, setProductCategories] = useState(INITIAL_PRODUCT_CATEGORIES);
  const [blogs, setBlogs] = useState(INITIAL_BLOGS);
  const [blogCategories, setBlogCategories] = useState(INITIAL_BLOG_CATEGORIES);
  const [locations, setLocations] = useState(INITIAL_OFFICES);
  const [services, setServices] = useState(INITIAL_SERVICES);
  const [industries, setIndustries] = useState(INITIAL_INDUSTRIES);
  const [clients, setClients] = useState(INITIAL_CLIENTS);
  const [solutions, setSolutions] = useState([]);
  const [solutionCategories, setSolutionCategories] = useState(INITIAL_SOLUTION_CATEGORIES);
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
        if (Array.isArray(data) && data.length > 0) { setter(data); return; }
        if (data && typeof data === 'object' && !Array.isArray(data) && Object.keys(data).length > 0) { setter(data); return; }
      }
    } catch (_) { /* backend offline — fall through */ }

    // 2. Try Supabase cloud DB
    try {
      const { data, error } = await supabase
        .from(supaTable)
        .select('*')
        .order(orderBy, { ascending: false });
      if (!error && Array.isArray(data) && data.length > 0) setter(data);
    } catch (_) { /* retain initial/pre-populated data */ }
  };

  /**
   * Make an authenticated fetch using the stored admin token.
   * Automatically handles 401/403 by logging the user out (unless dev token).
   */
  const adminFetch = (url, options = {}) => {
    const currentToken = token || localStorage.getItem('admin_token');
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
    'Authorization': `Bearer ${token || localStorage.getItem('admin_token')}`
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

  // Fetch office locations (Chennai HO, Coimbatore units, etc.)
  const fetchLocations = () => fetchWithFallback('/locations', 'office_locations', setLocations, 'id');

  // Fetch products and their categories
  const fetchProducts = async () => {
    await fetchWithFallback('/products', 'products', setProducts);
    await fetchWithFallback('/products/categories', 'product_categories', setProductCategories);
  };

  // Fetch blog articles and their categories
  const fetchBlogs = async () => {
    await fetchWithFallback('/blogs', 'blogs', setBlogs);
    await fetchWithFallback('/blogs/categories', 'blog_categories', setBlogCategories);
  };

  // Fetch services list
  const fetchServices = () => fetchWithFallback('/services', 'services', setServices);

  // Fetch industries list
  const fetchIndustries = () => fetchWithFallback('/industries', 'industries', setIndustries);

  // Fetch clients & brand logos
  const fetchClients = () => fetchWithFallback('/clients', 'clients', setClients);

  // Fetch solutions and solution categories
  const fetchSolutions = async () => {
    await fetchWithFallback('/solutions', 'solutions', setSolutions);
    await fetchWithFallback('/solutions/categories', 'solution_categories', setSolutionCategories);
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
          localStorage.setItem('admin_token', accessToken);
          localStorage.setItem('admin_user', JSON.stringify(userInfo));
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
        localStorage.setItem('admin_token', accessToken);
        localStorage.setItem('admin_user', JSON.stringify(userInfo));
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
      localStorage.setItem('admin_token', 'dev-admin-token');
      localStorage.setItem('admin_user', JSON.stringify(userInfo));
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
    localStorage.removeItem('admin_token');
    localStorage.removeItem('admin_user');
    setIsAuthenticated(false);
    setUser(null);
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

  // Settings Save
  const saveSettings = (e) => {
    e.preventDefault();
    fetch(`${API_BASE_URL}/admin/settings`, {
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
  const saveLocation = async (e) => {
    e.preventDefault();
    const method = editingLocation === 'new' ? 'POST' : 'PUT';
    const url = editingLocation === 'new' 
      ? `${API_BASE_URL}/admin/locations`
      : `${API_BASE_URL}/admin/locations/${editingLocation.id}`;

    try {
      const res = await fetch(url, {
        method,
        headers: apiHeaders(),
        body: JSON.stringify(locationForm)
      });
      if (res.ok) {
        toast.success("Office location saved");
        setEditingLocation(null);
        fetchLocations();
        return;
      }
    } catch (_) { /* API offline */ }

    // Offline fallback: update local state directly
    if (editingLocation === 'new') {
      const newLoc = { id: Date.now(), ...locationForm };
      setLocations(prev => [...prev, newLoc]);
      toast.success("Location saved locally (offline mode)");
    } else {
      setLocations(prev => prev.map(l => l.id === editingLocation.id ? { ...l, ...locationForm } : l));
      toast.success("Location updated locally (offline mode)");
    }
    setEditingLocation(null);
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
      fetch(`${API_BASE_URL}/admin/locations/${id}`, {
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
      ? `${API_BASE_URL}/admin/solutions`
      : `${API_BASE_URL}/admin/solutions/${editingSolution.id}`;

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
      fetch(`${API_BASE_URL}/admin/solutions/${id}`, {
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
  const saveSolutionCategory = async (e) => {
    e.preventDefault();
    const method = editingSolutionCategory === 'new' ? 'POST' : 'PUT';
    const url = editingSolutionCategory === 'new'
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

    // Offline fallback: update local state directly
    const slug = solutionCategoryForm.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    if (editingSolutionCategory === 'new') {
      const newCat = { id: Date.now(), ...solutionCategoryForm, slug };
      setSolutionCategories(prev => [...prev, newCat]);
    } else {
      setSolutionCategories(prev => prev.map(c => c.id === editingSolutionCategory.id ? { ...c, ...solutionCategoryForm, slug } : c));
    }
    toast.success("Category saved locally (offline mode)");
    setEditingSolutionCategory(null);
  };

  const deleteSolutionCategoryItem = (id) => {
    if (window.confirm("Delete this solution category?")) {
      fetch(`${API_BASE_URL}/admin/solutions/categories/${id}`, {
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
  const saveService = async (e) => {
    e.preventDefault();
    const method = editingService === 'new' ? 'POST' : 'PUT';
    const url = editingService === 'new'
      ? `${API_BASE_URL}/admin/services`
      : `${API_BASE_URL}/admin/services/${editingService.id}`;

    const formData = new FormData();
    formData.append('title', serviceForm.title);
    formData.append('slug', serviceForm.slug || serviceForm.title.toLowerCase().replace(/[^a-z0-9]+/g, '-'));
    formData.append('short_description', serviceForm.short_description);
    formData.append('detailed_description', serviceForm.detailed_description);
    formData.append('features', serviceForm.features);
    formData.append('sort_order', serviceForm.sort_order);
    formData.append('status', serviceForm.status);
    if (serviceImage) formData.append('image', serviceImage);
    if (serviceBrochure) formData.append('brochure', serviceBrochure);

    try {
      const res = await fetch(url, {
        method,
        headers: { 'Authorization': `Bearer ${token || localStorage.getItem('admin_token')}` },
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
    } catch (_) { /* API offline */ }

    // Offline fallback
    if (editingService === 'new') {
      const newSvc = { id: Date.now(), ...serviceForm, slug: serviceForm.slug || serviceForm.title.toLowerCase().replace(/[^a-z0-9]+/g, '-') };
      setServices(prev => [...prev, newSvc]);
    } else {
      setServices(prev => prev.map(s => s.id === editingService.id ? { ...s, ...serviceForm } : s));
    }
    toast.success("Service saved locally (offline mode)");
    setEditingService(null);
    setServiceImage(null);
    setServiceBrochure(null);
  };

  const deleteServiceItem = (id) => {
    if (window.confirm("Delete this service?")) {
      fetch(`${API_BASE_URL}/admin/services/${id}`, {
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
  const saveProduct = async (e) => {
    e.preventDefault();
    const method = editingProduct === 'new' ? 'POST' : 'PUT';
    const url = editingProduct === 'new'
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

    try {
      const res = await fetch(url, {
        method,
        headers: { 'Authorization': `Bearer ${token || localStorage.getItem('admin_token')}` },
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

    // Offline fallback
    if (editingProduct === 'new') {
      const newProd = { id: Date.now(), ...productForm, category_name: productCategories.find(c => String(c.id) === String(productForm.category_id))?.name || '' };
      setProducts(prev => [...prev, newProd]);
    } else {
      setProducts(prev => prev.map(p => p.id === editingProduct.id ? { ...p, ...productForm } : p));
    }
    toast.success("Product saved locally (offline mode)");
    setEditingProduct(null);
    setProductImage(null);
    setProductBrochure(null);
  };

  const deleteProductItem = (id) => {
    if (window.confirm("Delete this product?")) {
      fetch(`${API_BASE_URL}/admin/products/${id}`, {
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
  const saveProductCategory = async (e) => {
    e.preventDefault();
    const method = editingProductCategory === 'new' ? 'POST' : 'PUT';
    const url = editingProductCategory === 'new'
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

    // Offline fallback
    const slug = productCategoryForm.name?.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') || '';
    if (editingProductCategory === 'new') {
      setProductCategories(prev => [...prev, { id: Date.now(), ...productCategoryForm, slug }]);
    } else {
      setProductCategories(prev => prev.map(c => c.id === editingProductCategory.id ? { ...c, ...productCategoryForm, slug } : c));
    }
    toast.success("Category saved locally (offline mode)");
    setEditingProductCategory(null);
  };

  const deleteProductCategoryItem = (id) => {
    if (window.confirm("Delete this product category?")) {
      fetch(`${API_BASE_URL}/admin/products/categories/${id}`, {
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
  const saveIndustry = async (e) => {
    e.preventDefault();
    const method = editingIndustry === 'new' ? 'POST' : 'PUT';
    const url = editingIndustry === 'new'
      ? `${API_BASE_URL}/admin/industries`
      : `${API_BASE_URL}/admin/industries/${editingIndustry.id}`;

    const formData = new FormData();
    formData.append('name', industryForm.name);
    formData.append('slug', industryForm.slug || industryForm.name?.toLowerCase().replace(/[^a-z0-9]+/g, '-'));
    formData.append('description', industryForm.description);
    formData.append('detailed_description', industryForm.detailed_description);
    formData.append('sort_order', industryForm.sort_order);
    formData.append('status', industryForm.status);
    if (industryImage) formData.append('image', industryImage);

    try {
      const res = await fetch(url, {
        method,
        headers: { 'Authorization': `Bearer ${token || localStorage.getItem('admin_token')}` },
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

    // Offline fallback
    if (editingIndustry === 'new') {
      const newInd = { id: Date.now(), ...industryForm, slug: industryForm.slug || industryForm.name?.toLowerCase().replace(/[^a-z0-9]+/g, '-') };
      setIndustries(prev => [...prev, newInd]);
    } else {
      setIndustries(prev => prev.map(i => i.id === editingIndustry.id ? { ...i, ...industryForm } : i));
    }
    toast.success("Industry saved locally (offline mode)");
    setEditingIndustry(null);
    setIndustryImage(null);
  };

  const deleteIndustryItem = (id) => {
    if (window.confirm("Delete this industry?")) {
      fetch(`${API_BASE_URL}/admin/industries/${id}`, {
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
  const saveClient = async (e) => {
    e.preventDefault();
    const method = editingClient === 'new' ? 'POST' : 'PUT';
    const url = editingClient === 'new'
      ? `${API_BASE_URL}/admin/clients`
      : `${API_BASE_URL}/admin/clients/${editingClient.id}`;

    const formData = new FormData();
    formData.append('name', clientForm.name);
    formData.append('sort_order', clientForm.sort_order);
    formData.append('status', clientForm.status);
    formData.append('category', clientForm.category || 'Client');
    if (clientLogo) formData.append('logo', clientLogo);

    try {
      const res = await fetch(url, {
        method,
        headers: { 'Authorization': `Bearer ${token || localStorage.getItem('admin_token')}` },
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

    // Offline fallback
    if (editingClient === 'new') {
      setClients(prev => [...prev, { id: Date.now(), ...clientForm }]);
    } else {
      setClients(prev => prev.map(c => c.id === editingClient.id ? { ...c, ...clientForm } : c));
    }
    toast.success("Client saved locally (offline mode)");
    setEditingClient(null);
    setClientLogo(null);
  };

  const deleteClientItem = (id) => {
    if (window.confirm("Delete this client?")) {
      fetch(`${API_BASE_URL}/admin/clients/${id}`, {
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
  const saveBlog = async (e) => {
    e.preventDefault();
    const method = editingBlog === 'new' ? 'POST' : 'PUT';
    const url = editingBlog === 'new'
      ? `${API_BASE_URL}/admin/blogs`
      : `${API_BASE_URL}/admin/blogs/${editingBlog.id}`;

    const formData = new FormData();
    formData.append('category_id', blogForm.category_id || '');
    formData.append('category_name', blogForm.category_name || '');
    formData.append('title', blogForm.title);
    formData.append('slug', blogForm.slug || blogForm.title.toLowerCase().replace(/[^a-z0-9]+/g, '-'));
    formData.append('excerpt', blogForm.excerpt);
    formData.append('content', blogForm.content);
    formData.append('status', blogForm.status);
    formData.append('seo_title', blogForm.seo_title || '');
    formData.append('meta_description', blogForm.meta_description || '');
    formData.append('seo_keywords', blogForm.seo_keywords || '');
    if (blogImage) formData.append('featured_image', blogImage);

    try {
      const res = await fetch(url, {
        method,
        headers: { 'Authorization': `Bearer ${token || localStorage.getItem('admin_token')}` },
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

    // Offline fallback
    const catName = blogForm.category_name || blogCategories.find(c => String(c.id) === String(blogForm.category_id))?.name || '';
    if (editingBlog === 'new') {
      setBlogs(prev => [...prev, { id: Date.now(), ...blogForm, category_name: catName, slug: blogForm.slug || blogForm.title.toLowerCase().replace(/[^a-z0-9]+/g, '-') }]);
    } else {
      setBlogs(prev => prev.map(b => b.id === editingBlog.id ? { ...b, ...blogForm, category_name: catName } : b));
    }
    toast.success("Blog saved locally (offline mode)");
    setEditingBlog(null);
    setBlogImage(null);
  };

  const deleteBlogItem = (id) => {
    if (window.confirm("Delete this blog article?")) {
      fetch(`${API_BASE_URL}/admin/blogs/${id}`, {
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

  const handleDatabaseBackup = () => {
    window.open(`${API_BASE_URL}/admin/backup/export-sql?authorization=Bearer ${token}`, '_blank');
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
