import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { FaSearch, FaCalendarAlt, FaClock, FaArrowRight, FaUser, FaTag } from 'react-icons/fa';
import TitleBar from '../components/TitleBar';
import BlogTitleImg from '../assets/About/titleImg.png';
import '../styles/Blog.css';

function Blog() {
  const [blogs, setBlogs] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("");
  
  // Pagination / Load More states
  const [visibleCount, setVisibleCount] = useState(3); // Show 3 older articles initially
  const [loadingMore, setLoadingMore] = useState(false);

  useEffect(() => {
    // Fetch categories
    fetch('http://localhost:5000/api/blogs/categories')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) setCategories(data);
      })
      .catch(err => console.error("Error loading categories:", err));

    // Fetch blogs
    fetch('http://localhost:5000/api/blogs')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) setBlogs(data);
      })
      .catch(err => console.error("Error loading blogs:", err))
      .finally(() => setLoading(false));
  }, []);

  // Filter logic
  const filteredBlogs = blogs.filter(blog => {
    const matchCat = !activeCategory || blog.category_name === activeCategory;
    const matchSearch = blog.title.toLowerCase().includes(search.toLowerCase()) ||
                        (blog.excerpt && blog.excerpt.toLowerCase().includes(search.toLowerCase())) ||
                        (blog.content && blog.content.toLowerCase().includes(search.toLowerCase()));
    return matchCat && matchSearch;
  });

  // Extract featured (the newest one, which is index 0 in the list if sorted DESC)
  const featured = filteredBlogs.length > 0 ? filteredBlogs[0] : null;
  const olderArticles = filteredBlogs.length > 1 ? filteredBlogs.slice(1) : [];

  const handleLoadMore = () => {
    setLoadingMore(true);
    setTimeout(() => {
      setVisibleCount(prev => prev + 3);
      setLoadingMore(false);
    }, 600); // Simulate smooth loading animation
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return "";
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateStr).toLocaleDateString(undefined, options);
  };

  return (
    <>
      <Helmet>
        <title>Blog – Georson Tech | Industrial Engineering Insights</title>
        <meta name="description" content="Read the latest insights on industrial automation, IIoT, electrical systems, and engineering from Georson Tech experts." />
        <link rel="canonical" href="https://www.georsontech.com/blog" />
      </Helmet>

      <TitleBar title="BLOG" bg={BlogTitleImg} />

      <div className="blog-page" style={{ background: '#FAFAFA', padding: '60px 0' }}>
        <div className="blog-layout">

          {/* Main Content */}
          <main>
            {loading ? (
              <p style={{ color: '#64748b', textAlign: 'center' }}>Loading blog articles...</p>
            ) : (
              <>
                {/* Featured Post */}
                {featured ? (
                  <div style={{ marginBottom: '50px' }}>
                    <span className="section-label" style={{ marginBottom: '8px' }}>Recent Article</span>
                    <Link to={`/blog/${featured.slug}`} className="blog-featured" style={{ position: 'relative', display: 'block', borderRadius: '12px', overflow: 'hidden', height: '400px' }}>
                      <img 
                        src={featured.featured_image ? `http://localhost:5000/${featured.featured_image}` : 'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?auto=format&fit=crop&q=80&w=800'} 
                        alt={featured.title} 
                        className="blog-featured-img" 
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      />
                      <div className="blog-featured-overlay" style={{ position: 'absolute', bottom: 0, left: 0, right: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.9), transparent)', padding: '40px', color: '#fff' }}>
                        <span className="blog-featured-badge" style={{ background: '#0093DD', padding: '4px 10px', borderRadius: '4px', fontSize: '11px', fontWeight: 'bold', textTransform: 'uppercase' }}>
                          {featured.category_name || "General"}
                        </span>
                        <h2 style={{ fontSize: '24px', fontWeight: '800', margin: '12px 0 8px', color: '#fff' }}>{featured.title}</h2>
                        <div className="blog-featured-meta" style={{ display: 'flex', gap: '15px', fontSize: '12.5px', color: '#cbd5e1', marginBottom: '12px' }}>
                          <span><FaCalendarAlt /> {formatDate(featured.created_at)}</span>
                          <span><FaUser /> {featured.author_name || "Admin"}</span>
                        </div>
                        <p style={{ fontSize: '14.5px', color: '#cbd5e1', lineHeight: 1.5, marginBottom: '20px', maxWidth: '600px' }}>{featured.excerpt}</p>
                        <span className="blog-read-more" style={{ color: '#0093DD', display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 'bold' }}>
                          Read Article <FaArrowRight />
                        </span>
                      </div>
                    </Link>
                  </div>
                ) : (
                  <p>No articles found.</p>
                )}

                {/* Older Articles */}
                {olderArticles.length > 0 && (
                  <div style={{ marginTop: '40px' }}>
                    <h3 style={{ fontSize: '20px', fontWeight: '700', color: '#0f172a', marginBottom: '24px', borderBottom: '2px solid #e2e8f0', paddingBottom: '10px' }}>
                      Older Articles
                    </h3>
                    <div className="blog-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '30px' }}>
                      {olderArticles.slice(0, visibleCount).map(blog => (
                        <Link key={blog.id} to={`/blog/${blog.slug}`} className="blog-card" style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: '12px', overflow: 'hidden', boxShadow: '0 4px 6px rgba(0,0,0,0.03)', display: 'flex', flexDirection: 'column' }}>
                          <div className="blog-card-img" style={{ height: '180px', overflow: 'hidden' }}>
                            <img 
                              src={blog.featured_image ? `http://localhost:5000/${blog.featured_image}` : 'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?auto=format&fit=crop&q=80&w=400'} 
                              alt={blog.title} 
                              loading="lazy" 
                              style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.3s' }}
                            />
                          </div>
                          <div className="blog-card-body" style={{ padding: '20px', flex: 1, display: 'flex', flexDirection: 'column' }}>
                            <span style={{ fontSize: '11px', color: '#0093DD', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '8px', display: 'block' }}>
                              {blog.category_name}
                            </span>
                            <h4 style={{ fontSize: '16px', fontWeight: '700', color: '#0f172a', margin: '0 0 10px', lineHeight: 1.4 }}>{blog.title}</h4>
                            <p style={{ fontSize: '13.5px', color: '#64748b', lineHeight: 1.5, marginBottom: '15px', flex: 1 }}>{blog.excerpt}</p>
                            <div className="blog-card-meta" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '12.5px', color: '#94a3b8', borderTop: '1px solid #f1f5f9', paddingTop: '12px', marginTop: 'auto' }}>
                              <span><FaCalendarAlt /> {formatDate(blog.created_at)}</span>
                              <span className="blog-read-more" style={{ color: '#0093DD', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '4px' }}>
                                Read <FaArrowRight style={{ fontSize: '10px' }} />
                              </span>
                            </div>
                          </div>
                        </Link>
                      ))}
                    </div>

                    {/* Load More Button */}
                    {olderArticles.length > visibleCount && (
                      <div className="text-center" style={{ marginTop: '40px' }}>
                        <button 
                          className="btn-outline" 
                          onClick={handleLoadMore}
                          disabled={loadingMore}
                          style={{
                            padding: '10px 24px',
                            borderRadius: '20px',
                            fontWeight: '600',
                            fontSize: '13.5px',
                            borderColor: '#0093DD',
                            color: '#0093DD',
                            transition: 'all 0.3s'
                          }}
                        >
                          {loadingMore ? "Loading Articles..." : "Load More Articles"}
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </>
            )}
          </main>

          {/* Sidebar */}
          <aside className="blog-sidebar">
            {/* Search widget */}
            <div className="sidebar-widget">
              <h4 className="sidebar-widget-title">Search</h4>
              <div className="sidebar-search">
                <input
                  type="text"
                  placeholder="Search articles..."
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                />
                <button aria-label="Search"><FaSearch /></button>
              </div>
            </div>

            {/* Categories widget */}
            <div className="sidebar-widget">
              <h4 className="sidebar-widget-title">Categories</h4>
              <ul className="sidebar-categories" style={{ listStyle: 'none', padding: 0 }}>
                <li>
                  <button 
                    onClick={() => setActiveCategory("")}
                    style={{
                      width: '100%',
                      textAlign: 'left',
                      padding: '8px 12px',
                      fontSize: '13.5px',
                      color: activeCategory === "" ? '#0093DD' : '#334155',
                      fontWeight: activeCategory === "" ? '700' : '500',
                      borderRadius: '4px',
                      background: activeCategory === "" ? '#eff6ff' : 'transparent',
                      cursor: 'pointer'
                    }}
                  >
                    All Categories
                  </button>
                </li>
                {categories.map((cat, i) => (
                  <li key={cat.id || i}>
                    <button 
                      onClick={() => setActiveCategory(cat.name)}
                      style={{
                        width: '100%',
                        textAlign: 'left',
                        padding: '8px 12px',
                        fontSize: '13.5px',
                        color: activeCategory === cat.name ? '#0093DD' : '#334155',
                        fontWeight: activeCategory === cat.name ? '700' : '500',
                        borderRadius: '4px',
                        background: activeCategory === cat.name ? '#eff6ff' : 'transparent',
                        cursor: 'pointer',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center'
                      }}
                    >
                      {cat.name}
                      <span style={{ fontSize: '11px', background: '#e2e8f0', padding: '2px 6px', borderRadius: '10px', color: '#475569' }}>
                        {cat.count}
                      </span>
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            {/* Promo Callout */}
            <div className="sidebar-widget" style={{ background: 'linear-gradient(135deg, #0f172a, #1e293b)', color: '#fff', border: 'none', borderRadius: '12px', padding: '24px' }}>
              <h4 style={{ color: '#fff', marginBottom: '12px', fontSize: '17px', fontFamily: 'Outfit, sans-serif', fontWeight: 700 }}>
                Need Engineering Solutions?
              </h4>
              <p style={{ fontSize: '13.5px', color: 'rgba(255,255,255,0.8)', marginBottom: '20px', lineHeight: 1.6 }}>
                Get in touch with our expert team for industrial automation, IIoT, and electrical engineering projects.
              </p>
              <Link to="/enquiry/contact" className="btn-primary" style={{ background: '#0093DD', border: 'none', padding: '10px 20px', fontSize: '13px', width: '100%', justifyContent: 'center' }}>
                Get a Quote →
              </Link>
            </div>
          </aside>

        </div>
      </div>
    </>
  );
}

export default Blog;
