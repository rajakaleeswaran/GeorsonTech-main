import { getAssetUrl } from '../../lib/api';
import React from 'react';
import { FaPlus, FaEdit, FaTrash, FaImage } from 'react-icons/fa';

function BlogsTab({
  blogs,
  blogCategories,
  editingBlog,
  setEditingBlog,
  blogForm,
  setBlogForm,
  setBlogImage,
  saveBlog,
  deleteBlogItem
}) {
  const [customCat, setCustomCat] = React.useState(false);

  const handleTitleChange = (val) => {
    setBlogForm(prev => {
      const autoSlug = val.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
      return {
        ...prev,
        title: val,
        slug: editingBlog === 'new' || !prev.slug ? autoSlug : prev.slug
      };
    });
  };

  const handleSlugChange = (val) => {
    const cleanSlug = val.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
    setBlogForm(prev => ({ ...prev, slug: cleanSlug }));
  };

  // Determine current dropdown value
  const selectedCatValue = React.useMemo(() => {
    if (blogForm.category_id) {
      const matched = blogCategories.find(c => String(c.id) === String(blogForm.category_id) || c.name === blogForm.category_id);
      if (matched) return String(matched.id || matched.name);
    }
    if (blogForm.category_name) {
      const matched = blogCategories.find(c => c.name === blogForm.category_name);
      if (matched) return String(matched.id || matched.name);
    }
    return blogCategories[0] ? String(blogCategories[0].id || blogCategories[0].name) : '';
  }, [blogForm.category_id, blogForm.category_name, blogCategories]);

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <h2 style={{ fontSize: '22px', fontWeight: '700', margin: 0 }}>Blogs Articles</h2>
        {!editingBlog && (
          <button className="btn-primary" onClick={() => {
            setEditingBlog('new');
            setCustomCat(false);
            const firstCat = blogCategories[0];
            setBlogForm({
              category_id: String(firstCat?.id || ''),
              category_name: firstCat?.name || '',
              title: '', slug: '', excerpt: '', content: '',
              status: 'Publish', seo_title: '', meta_description: '', seo_keywords: ''
            });
            setBlogImage(null);
          }}>
            <FaPlus /> Create Blog Article
          </button>
        )}
      </div>

      {editingBlog ? (
        <form onSubmit={saveBlog} className="admin-form" style={{ maxWidth: '100%' }}>
          <h3>{editingBlog === 'new' ? 'New Article' : 'Edit Article'}</h3>
          
          <div className="form-group">
            <label>Article Category</label>
            {!customCat ? (
              <div style={{ display: 'flex', gap: '10px' }}>
                <select
                  className="form-select"
                  required
                  value={selectedCatValue}
                  onChange={e => {
                    const selectedVal = e.target.value;
                    if (selectedVal === 'ADD_NEW') {
                      setCustomCat(true);
                      setBlogForm(prev => ({ ...prev, category_id: '', category_name: '' }));
                    } else {
                      const matched = blogCategories.find(c => String(c.id) === String(selectedVal) || c.name === selectedVal);
                      setBlogForm(prev => ({
                        ...prev,
                        category_id: matched ? (matched.id || matched.name) : selectedVal,
                        category_name: matched ? matched.name : selectedVal
                      }));
                    }
                  }}
                >
                  <option value="">-- Choose Category --</option>
                  {blogCategories.map(cat => (
                    <option key={cat.id || cat.name} value={String(cat.id || cat.name)}>{cat.name}</option>
                  ))}
                  <option value="ADD_NEW">+ Add Custom Category...</option>
                </select>
              </div>
            ) : (
              <div style={{ display: 'flex', gap: '10px' }}>
                <input
                  type="text"
                  className="form-input"
                  placeholder="Enter new category name..."
                  required
                  value={blogForm.category_name || ''}
                  onChange={e => setBlogForm(prev => ({ ...prev, category_name: e.target.value, category_id: e.target.value }))}
                />
                <button type="button" className="btn-outline" onClick={() => setCustomCat(false)}>Select Existing</button>
              </div>
            )}
          </div>

          <div className="form-group">
            <label>Article Title</label>
            <input type="text" className="form-input" required value={blogForm.title} onChange={e => handleTitleChange(e.target.value)} />
          </div>

          <div className="form-group">
            <label>Slug (Unique URL)</label>
            <input type="text" className="form-input" required value={blogForm.slug || ''} onChange={e => handleSlugChange(e.target.value)} />
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
            {/* Featured Image */}
            <div className="form-group">
              <label>Featured Image</label>
              {editingBlog !== 'new' && blogForm.featured_image && (
                <div style={{ marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <img
                    src={getAssetUrl(blogForm.featured_image)}
                    alt="Current"
                    style={{ width: '80px', height: '60px', objectFit: 'cover', borderRadius: '6px', border: '2px solid #e2e8f0' }}
                    onError={e => { e.target.style.display = 'none'; }}
                  />
                  <span style={{ fontSize: '12px', color: '#64748b' }}>
                    <FaImage style={{ marginRight: '4px', color: '#0093DD' }} />
                    Current image (select to replace)
                  </span>
                </div>
              )}
              <input type="file" className="form-input" onChange={e => setBlogImage(e.target.files[0] || null)} accept="image/*" />
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
            <button type="button" className="btn-outline" onClick={() => {
              setEditingBlog(null);
              setBlogImage(null);
              setCustomCat(false);
            }}>Cancel</button>
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
                    <img
                      src={blog.featured_image ? getAssetUrl(blog.featured_image) : ''}
                      alt=""
                      style={{ width: '50px', height: '40px', objectFit: 'cover', borderRadius: '4px', background: '#f1f5f9' }}
                      onError={e => { e.target.style.opacity = '0'; }}
                    />
                  </td>
                  <td>{blog.title}</td>
                  <td>{blog.category_name}</td>
                  <td><span className={`badge ${blog.status === 'Publish' ? 'publish' : 'draft'}`}>{blog.status}</span></td>
                  <td>
                    <button className="admin-action-btn admin-btn-edit" onClick={() => {
                      setEditingBlog(blog);
                      // Coerce category_id to String to match select option values
                      setBlogForm({ ...blog, category_id: String(blog.category_id || '') });
                      setBlogImage(null);
                      setCustomCat(false);
                    }}>
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
  );
}

export default BlogsTab;
