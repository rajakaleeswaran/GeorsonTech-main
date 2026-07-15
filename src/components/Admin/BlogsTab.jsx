import React from 'react';
import { FaPlus, FaEdit, FaTrash } from 'react-icons/fa';

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
  return (
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
  );
}

export default BlogsTab;
