import React from 'react';
import { Helmet } from 'react-helmet-async';
import { useParams, Link } from 'react-router-dom';
import { FaCalendarAlt, FaClock, FaUser, FaArrowLeft, FaLinkedinIn, FaTwitter, FaFacebookF } from 'react-icons/fa';
import '../styles/Blog.css';

// Placeholder images
import blogImg1 from '../assets/Home/Hero/hero1.png';
import blogImg2 from '../assets/Home/Hero/hero2.png';
import blogImg3 from '../assets/Home/Hero/hero3.png';

const BLOG_POSTS = {
  "understanding-plc-scada-integration": {
    title: "Understanding PLC-SCADA Integration for Modern Manufacturing",
    category: "Industrial Automation",
    author: "Georson Tech Engineering Team",
    date: "June 15, 2025",
    readTime: "5 min read",
    image: blogImg1,
    metaDesc: "Learn how PLC and SCADA integration enables real-time control and monitoring in manufacturing.",
    content: [
      {
        type: "intro",
        text: "In modern manufacturing, the integration of Programmable Logic Controllers (PLC) and Supervisory Control and Data Acquisition (SCADA) systems forms the backbone of industrial automation. This combination enables real-time monitoring, control, and data analysis across complex production environments.",
      },
      {
        type: "h2", text: "What is a PLC?",
      },
      {
        type: "p",
        text: "A Programmable Logic Controller (PLC) is a ruggedized digital computer used to control manufacturing processes. Unlike traditional relay logic, PLCs are reprogrammable and can handle multiple inputs and outputs. They execute control logic continuously in real time, making split-second decisions based on sensor inputs.",
      },
      {
        type: "h2", text: "What is SCADA?",
      },
      {
        type: "p",
        text: "SCADA (Supervisory Control and Data Acquisition) is a software system that provides a graphical interface for operators to monitor and control industrial processes. SCADA collects data from PLCs, RTUs, and other field devices and presents it in a meaningful dashboard format.",
      },
      {
        type: "h2", text: "Benefits of PLC-SCADA Integration",
      },
      {
        type: "list",
        items: [
          "Real-time process monitoring and alarming",
          "Historical data logging for trend analysis",
          "Remote monitoring and control capability",
          "Improved operational efficiency and uptime",
          "Faster fault detection and troubleshooting",
          "Compliance with industrial standards (ISA-95, IEC 61131)",
        ],
      },
      {
        type: "h2", text: "Implementation at Georson Tech",
      },
      {
        type: "p",
        text: "At Georson Tech, we have successfully implemented PLC-SCADA integrated systems for various industries including cement, pharmaceuticals, food processing, and water treatment. Our team brings expertise in Siemens SIMATIC, Allen-Bradley ControlLogix, Wonderware, and FactoryTalk platforms.",
      },
    ],
  },
};

const RELATED = [
  { slug: "iiot-predictive-maintenance", title: "IIoT Predictive Maintenance", image: blogImg2, date: "May 28, 2025" },
  { slug: "industry-4-digital-transformation", title: "Industry 4.0 Digital Transformation", image: blogImg3, date: "April 22, 2025" },
];

function BlogPost() {
  const { slug } = useParams();
  const post = BLOG_POSTS[slug];

  if (!post) {
    return (
      <div style={{ padding: '100px 20px', textAlign: 'center' }}>
        <h2>Article not found</h2>
        <p style={{ marginTop: '16px', color: '#6b7280' }}>The article you're looking for doesn't exist.</p>
        <Link to="/blog" style={{ color: '#0077cc', marginTop: '20px', display: 'inline-block' }}>← Back to Blog</Link>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>{post.title} – Georson Tech Blog</title>
        <meta name="description" content={post.metaDesc} />
        <meta property="og:title" content={post.title} />
        <meta property="og:description" content={post.metaDesc} />
        <meta property="og:image" content={post.image} />
        <link rel="canonical" href={`https://www.georsontech.com/blog/${slug}`} />
      </Helmet>

      <div style={{ background: '#f8fafc', minHeight: '100vh' }}>
        <div className="blog-post-layout">

          {/* Article */}
          <article className="blog-post">
            <Link to="/blog" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', color: '#0077cc', fontWeight: 600, marginBottom: '24px', fontSize: '14px' }}>
              <FaArrowLeft /> Back to Blog
            </Link>

            <div className="blog-post-hero">
              <img src={post.image} alt={post.title} />
            </div>

            <p className="blog-post-category">{post.category}</p>
            <h1>{post.title}</h1>

            <div className="blog-post-meta">
              <span><FaUser /> {post.author}</span>
              <span><FaCalendarAlt /> {post.date}</span>
              <span><FaClock /> {post.readTime}</span>
            </div>

            <div className="blog-post-content">
              {post.content.map((block, i) => {
                if (block.type === 'intro') return <p key={i} style={{ fontSize: '17px', color: '#374151', marginBottom: '28px', fontWeight: 500 }}>{block.text}</p>;
                if (block.type === 'h2') return <h2 key={i}>{block.text}</h2>;
                if (block.type === 'p') return <p key={i}>{block.text}</p>;
                if (block.type === 'list') return (
                  <ul key={i}>
                    {block.items.map((item, j) => <li key={j}>{item}</li>)}
                  </ul>
                );
                return null;
              })}
            </div>

            {/* Share */}
            <div className="blog-post-tags">
              <strong style={{ marginRight: '10px', fontSize: '14px' }}>Share:</strong>
              <a href="#" style={{ background: '#0077b5', color: '#fff', padding: '7px 14px', borderRadius: '5px', fontSize: '13px', display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                <FaLinkedinIn /> LinkedIn
              </a>
              <a href="#" style={{ background: '#1da1f2', color: '#fff', padding: '7px 14px', borderRadius: '5px', fontSize: '13px', display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                <FaTwitter /> Twitter
              </a>
              <a href="#" style={{ background: '#1877f2', color: '#fff', padding: '7px 14px', borderRadius: '5px', fontSize: '13px', display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                <FaFacebookF /> Facebook
              </a>
            </div>

          </article>

          {/* Sidebar */}
          <aside className="blog-sidebar">
            <div className="sidebar-widget">
              <h4 className="sidebar-widget-title">Related Articles</h4>
              {RELATED.map((rel, i) => (
                <div key={i} className="sidebar-recent-post">
                  <div className="sidebar-recent-img">
                    <img src={rel.image} alt={rel.title} loading="lazy" />
                  </div>
                  <div className="sidebar-recent-info">
                    <Link to={`/blog/${rel.slug}`}>{rel.title}</Link>
                    <p className="sidebar-recent-date"><FaCalendarAlt /> {rel.date}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="sidebar-widget" style={{ background: 'linear-gradient(135deg, #0077cc, #00c6ff)', color: '#fff', border: 'none' }}>
              <h4 style={{ color: '#fff', marginBottom: '16px', fontSize: '17px', fontFamily: 'Outfit, sans-serif', fontWeight: 700 }}>
                Need Engineering Solutions?
              </h4>
              <p style={{ fontSize: '14px', color: 'rgba(255,255,255,0.85)', marginBottom: '20px', lineHeight: 1.6 }}>
                Get in touch with our expert team for industrial automation, IIoT, and electrical engineering projects.
              </p>
              <Link to="/enquiry" style={{ background: '#fff', color: '#0077cc', padding: '11px 22px', borderRadius: '6px', fontWeight: 700, fontSize: '14px', display: 'inline-block' }}>
                Get a Quote →
              </Link>
            </div>
          </aside>

        </div>
      </div>
    </>
  );
}

export default BlogPost;
