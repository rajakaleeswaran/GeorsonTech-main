import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { FaSearch, FaCalendarAlt, FaClock, FaArrowRight, FaUser } from 'react-icons/fa';
import TitleBar from '../components/TitleBar';
import BlogTitleImg from '../assets/About/titleImg.png';
import '../styles/Blog.css';

// Placeholder blog image (using existing assets)
import blogImg1 from '../assets/Home/Hero/hero1.png';
import blogImg2 from '../assets/Home/Hero/hero2.png';
import blogImg3 from '../assets/Home/Hero/hero3.png';

const BLOG_CATEGORIES = [
  { name: "Industrial Automation", count: 8 },
  { name: "IIoT & Industry 4.0",  count: 6 },
  { name: "Electrical Systems",   count: 5 },
  { name: "Engineering Tips",     count: 7 },
  { name: "Company News",         count: 3 },
];

const TAGS = ["PLC", "SCADA", "IIoT", "Automation", "Industry 4.0", "Electrical Panels", "VFD", "Servo", "Safety", "Energy Savings"];

const BLOGS = [
  {
    id: 1, slug: "understanding-plc-scada-integration",
    category: "Industrial Automation",
    title: "Understanding PLC-SCADA Integration for Modern Manufacturing",
    excerpt: "Learn how PLC and SCADA integration enables real-time control and monitoring of complex industrial processes, improving efficiency and reducing downtime.",
    content: "Full article content here...",
    image: blogImg1,
    author: "Georson Tech",
    date: "June 15, 2025",
    readTime: "5 min read",
    featured: true,
  },
  {
    id: 2, slug: "iiot-predictive-maintenance",
    category: "IIoT & Industry 4.0",
    title: "How IIoT Enables Predictive Maintenance in Heavy Industries",
    excerpt: "Discover how Industrial IoT sensors and edge computing are transforming maintenance strategies from reactive to predictive, saving millions in downtime costs.",
    image: blogImg2,
    author: "Georson Tech",
    date: "May 28, 2025",
    readTime: "7 min read",
  },
  {
    id: 3, slug: "electrical-panel-selection-guide",
    category: "Electrical Systems",
    title: "A Complete Guide to Selecting the Right Electrical Control Panel",
    excerpt: "From MCC to PCC and VFD panels — this guide helps engineers choose the right type of electrical panel for their specific industrial application.",
    image: blogImg3,
    author: "Georson Tech",
    date: "May 10, 2025",
    readTime: "6 min read",
  },
  {
    id: 4, slug: "industry-4-digital-transformation",
    category: "IIoT & Industry 4.0",
    title: "Industry 4.0: Digital Transformation Roadmap for Manufacturers",
    excerpt: "A practical roadmap for manufacturing companies looking to adopt Industry 4.0 technologies — from connectivity to digital twins.",
    image: blogImg1,
    author: "Georson Tech",
    date: "April 22, 2025",
    readTime: "8 min read",
  },
  {
    id: 5, slug: "energy-saving-with-vfd",
    category: "Electrical Systems",
    title: "Energy Savings with Variable Frequency Drives – A Practical Guide",
    excerpt: "Variable Frequency Drives can reduce motor energy consumption by up to 50%. Learn how to apply VFDs effectively in pumps, fans, and compressors.",
    image: blogImg2,
    author: "Georson Tech",
    date: "March 18, 2025",
    readTime: "5 min read",
  },
  {
    id: 6, slug: "georsontech-expands-coimbatore",
    category: "Company News",
    title: "Georson Tech Expands Manufacturing & Service Operations in Coimbatore",
    excerpt: "We are excited to announce the expansion of our Manufacturing and Service units in Coimbatore, enabling faster delivery and local support across Tamil Nadu.",
    image: blogImg3,
    author: "Georson Tech",
    date: "February 5, 2025",
    readTime: "3 min read",
  },
];

function Blog() {
  const [search, setSearch] = useState("");
  const featured = BLOGS.find(b => b.featured);
  const rest = BLOGS.filter(b => !b.featured);

  return (
    <>
      <Helmet>
        <title>Blog – Georson Tech | Industrial Engineering Insights</title>
        <meta name="description" content="Read the latest insights on industrial automation, IIoT, electrical systems, and engineering from Georson Tech experts." />
        <link rel="canonical" href="https://www.georsontech.com/blog" />
      </Helmet>

      <TitleBar title="BLOG" bg={BlogTitleImg} />

      <div className="blog-page">
        <div className="blog-layout">

          {/* Main Content */}
          <main>
            {/* Featured Post */}
            {featured && (
              <Link to={`/blog/${featured.slug}`} className="blog-featured">
                <img src={featured.image} alt={featured.title} className="blog-featured-img" />
                <div className="blog-featured-overlay">
                  <span className="blog-featured-badge">⭐ Featured</span>
                  <h2>{featured.title}</h2>
                  <div className="blog-featured-meta">
                    <span><FaCalendarAlt /> {featured.date}</span>
                    <span><FaClock /> {featured.readTime}</span>
                    <span><FaUser /> {featured.author}</span>
                  </div>
                  <p>{featured.excerpt}</p>
                  <span className="blog-read-more">Read Article <FaArrowRight /></span>
                </div>
              </Link>
            )}

            {/* Blog Grid */}
            <div className="blog-grid">
              {rest.map(blog => (
                <Link key={blog.id} to={`/blog/${blog.slug}`} className="blog-card">
                  <div className="blog-card-img">
                    <img src={blog.image} alt={blog.title} loading="lazy" />
                  </div>
                  <div className="blog-card-body">
                    <p className="blog-card-category">{blog.category}</p>
                    <h3>{blog.title}</h3>
                    <p>{blog.excerpt}</p>
                    <div className="blog-card-meta">
                      <span><FaCalendarAlt /> {blog.date}</span>
                      <span className="blog-read-more"><FaClock /> {blog.readTime} <FaArrowRight /></span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </main>

          {/* Sidebar */}
          <aside className="blog-sidebar">

            {/* Search */}
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

            {/* Categories */}
            <div className="sidebar-widget">
              <h4 className="sidebar-widget-title">Categories</h4>
              <ul className="sidebar-categories">
                {BLOG_CATEGORIES.map((cat, i) => (
                  <li key={i}>
                    <a href="#">
                      {cat.name}
                      <span className="sidebar-cat-count">{cat.count}</span>
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Recent Posts */}
            <div className="sidebar-widget">
              <h4 className="sidebar-widget-title">Recent Posts</h4>
              {BLOGS.slice(0, 3).map(blog => (
                <div key={blog.id} className="sidebar-recent-post">
                  <div className="sidebar-recent-img">
                    <img src={blog.image} alt={blog.title} loading="lazy" />
                  </div>
                  <div className="sidebar-recent-info">
                    <Link to={`/blog/${blog.slug}`}>{blog.title}</Link>
                    <p className="sidebar-recent-date"><FaCalendarAlt /> {blog.date}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Tags */}
            <div className="sidebar-widget">
              <h4 className="sidebar-widget-title">Tags</h4>
              <div className="sidebar-tags">
                {TAGS.map((tag, i) => (
                  <span key={i} className="sidebar-tag">{tag}</span>
                ))}
              </div>
            </div>

          </aside>
        </div>
      </div>
    </>
  );
}

export default Blog;
