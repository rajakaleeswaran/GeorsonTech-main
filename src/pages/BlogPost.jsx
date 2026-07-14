import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { useParams, Link } from 'react-router-dom';
import { FaCalendarAlt, FaClock, FaUser, FaArrowLeft, FaLinkedinIn, FaFacebookF, FaEnvelope } from 'react-icons/fa';
import '../styles/Blog.css';

function BlogPost() {
  const { slug } = useParams();
  const [post, setPost] = useState(null);
  const [related, setRelated] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    // Fetch individual post details
    fetch(`http://localhost:5000/api/blogs/${slug}`)
      .then(res => {
        if (res.ok) return res.json();
        throw new Error("Article not found");
      })
      .then(data => {
        setPost(data);
        
        // Fetch related posts (same category, excluding this one)
        fetch('http://localhost:5000/api/blogs')
          .then(res => res.json())
          .then(allBlogs => {
            if (Array.isArray(allBlogs)) {
              const matches = allBlogs.filter(b => b.slug !== slug && b.category_name === data.category_name);
              setRelated(matches.slice(0, 2));
            }
          })
          .catch(() => {});
      })
      .catch(err => {
        console.error(err);
        setPost(null);
      })
      .finally(() => setLoading(false));
  }, [slug]);

  const formatDate = (dateStr) => {
    if (!dateStr) return "";
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateStr).toLocaleDateString(undefined, options);
  };

  if (loading) {
    return (
      <div style={{ padding: '100px 20px', textAlign: 'center' }}>
        <p style={{ color: '#64748b' }}>Loading article details...</p>
      </div>
    );
  }

  if (!post) {
    return (
      <div style={{ padding: '100px 20px', textAlign: 'center' }}>
        <h2>Article not found</h2>
        <p style={{ marginTop: '16px', color: '#6b7280' }}>The article you're looking for doesn't exist.</p>
        <Link to="/blog" style={{ color: '#0093DD', marginTop: '20px', display: 'inline-block', fontWeight: 'bold' }}>← Back to Blog</Link>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>{post.title} – Georson Tech Blog</title>
        <meta name="description" content={post.excerpt || post.title} />
        <meta property="og:title" content={post.title} />
        <meta property="og:description" content={post.excerpt} />
        <meta property="og:image" content={post.featured_image ? `http://localhost:5000/${post.featured_image}` : ''} />
        <link rel="canonical" href={`https://www.georsontech.com/blog/${slug}`} />
      </Helmet>

      <div style={{ background: '#f8fafc', minHeight: '100vh', padding: '40px 0' }}>
        <div className="blog-post-layout">

          {/* Article */}
          <article className="blog-post" style={{ background: '#fff', padding: '30px', borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px rgba(0,0,0,0.02)' }}>
            <Link to="/blog" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', color: '#0093DD', fontWeight: 600, marginBottom: '24px', fontSize: '14.5px' }}>
              <FaArrowLeft /> Back to Blog
            </Link>

            <div className="blog-post-hero" style={{ height: '360px', width: '100%', overflow: 'hidden', borderRadius: '8px', marginBottom: '20px' }}>
              <img 
                src={post.featured_image ? `http://localhost:5000/${post.featured_image}` : 'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?auto=format&fit=crop&q=80&w=805'} 
                alt={post.title} 
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            </div>

            <span className="blog-post-category" style={{ fontSize: '11px', color: '#0093DD', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '0.5px', display: 'block', marginBottom: '8px' }}>
              {post.category_name}
            </span>
            <h1 style={{ fontSize: '26px', fontWeight: '800', color: '#0f172a', margin: '0 0 16px' }}>{post.title}</h1>

            <div className="blog-post-meta" style={{ display: 'flex', gap: '20px', fontSize: '13px', color: '#64748b', marginBottom: '30px', borderBottom: '1px solid #f1f5f9', paddingBottom: '16px' }}>
              <span><FaUser /> {post.author_name || "Admin"}</span>
              <span><FaCalendarAlt /> {formatDate(post.created_at)}</span>
            </div>

            {/* Rich HTML Content */}
            <div 
              className="blog-post-content" 
              dangerouslySetInnerHTML={{ __html: post.content }}
              style={{ fontSize: '15px', color: '#334155', lineHeight: 1.7, marginBottom: '40px' }}
            />

            {/* Share Section */}
            <div className="blog-post-tags" style={{ borderTop: '1px solid #f1f5f9', paddingTop: '20px', display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
              <strong style={{ fontSize: '14px', color: '#334155' }}>Share:</strong>
              <a 
                href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(window.location.href)}`} 
                target="_blank" 
                rel="noopener noreferrer" 
                style={{ background: '#0077b5', color: '#fff', padding: '6px 12px', borderRadius: '4px', fontSize: '12.5px', display: 'inline-flex', alignItems: 'center', gap: '6px' }}
              >
                <FaLinkedinIn /> LinkedIn
              </a>
              <a 
                href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`} 
                target="_blank" 
                rel="noopener noreferrer" 
                style={{ background: '#1877f2', color: '#fff', padding: '6px 12px', borderRadius: '4px', fontSize: '12.5px', display: 'inline-flex', alignItems: 'center', gap: '6px' }}
              >
                <FaFacebookF /> Facebook
              </a>
              <a 
                href={`mailto:?subject=${encodeURIComponent(post.title)}&body=${encodeURIComponent(window.location.href)}`}
                style={{ background: '#64748b', color: '#fff', padding: '6px 12px', borderRadius: '4px', fontSize: '12.5px', display: 'inline-flex', alignItems: 'center', gap: '6px' }}
              >
                <FaEnvelope /> Email
              </a>
            </div>
          </article>

          {/* Sidebar */}
          <aside className="blog-sidebar">
            {related.length > 0 && (
              <div className="sidebar-widget">
                <h4 className="sidebar-widget-title">Related Articles</h4>
                {related.map((rel, i) => (
                  <div key={rel.id || i} className="sidebar-recent-post" style={{ display: 'flex', gap: '12px', marginBottom: '15px' }}>
                    <div className="sidebar-recent-img" style={{ width: '60px', height: '60px', borderRadius: '4px', overflow: 'hidden', background: '#e2e8f0', flexShrink: 0 }}>
                      <img 
                        src={rel.featured_image ? `http://localhost:5000/${rel.featured_image}` : 'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?auto=format&fit=crop&q=80&w=100'} 
                        alt={rel.title} 
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      />
                    </div>
                    <div className="sidebar-recent-info" style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                      <Link to={`/blog/${rel.slug}`} style={{ fontSize: '13px', fontWeight: '600', color: '#0f172a', lineHeight: 1.3 }}>
                        {rel.title}
                      </Link>
                      <span style={{ fontSize: '11px', color: '#94a3b8' }}><FaCalendarAlt /> {formatDate(rel.created_at)}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}

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

export default BlogPost;
