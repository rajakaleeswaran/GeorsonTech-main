import { getAssetUrl } from '../../lib/api';
import React from 'react';
import { FaPlus, FaEdit, FaTrash, FaImage } from 'react-icons/fa';

function IndustriesTab({
  industries,
  editingIndustry,
  setEditingIndustry,
  industryForm,
  setIndustryForm,
  setIndustryImage,
  saveIndustry,
  deleteIndustryItem
}) {
  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <h2 style={{ fontSize: '22px', fontWeight: '700', margin: 0 }}>Industries Serve</h2>
        {!editingIndustry && (
          <button className="btn-primary" onClick={() => {
            setEditingIndustry('new');
            setIndustryForm({ name: '', slug: '', description: '', detailed_description: '', sort_order: 0, status: 'Publish' });
            setIndustryImage(null);
          }}>
            <FaPlus /> Add Industry
          </button>
        )}
      </div>

      {editingIndustry ? (
        <form onSubmit={saveIndustry} className="admin-form" style={{ maxWidth: '100%' }}>
          <h3>{editingIndustry === 'new' ? 'New Industry' : 'Edit Industry'}</h3>
          <div className="form-group">
            <label>Industry Name</label>
            <input 
              type="text" 
              className="form-input" 
              required 
              value={industryForm.name} 
              onChange={e => {
                const nameVal = e.target.value;
                const autoSlug = nameVal.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
                setIndustryForm(prev => ({
                  ...prev,
                  name: nameVal,
                  slug: editingIndustry === 'new' || !prev.slug ? autoSlug : prev.slug
                }));
              }} 
            />
          </div>
          <div className="form-group">
            <label>Slug (URL pathway)</label>
            <input 
              type="text" 
              className="form-input" 
              required 
              value={industryForm.slug || ''} 
              onChange={e => {
                const slugVal = e.target.value.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
                setIndustryForm(prev => ({ ...prev, slug: slugVal }));
              }} 
            />
          </div>
          <div className="form-group">
            <label>Short Summary</label>
            <textarea className="form-textarea" required value={industryForm.description} onChange={e => setIndustryForm(prev => ({ ...prev, description: e.target.value }))} />
          </div>
          <div className="form-group">
            <label>Detailed Description</label>
            <textarea className="form-textarea" rows="4" value={industryForm.detailed_description} onChange={e => setIndustryForm(prev => ({ ...prev, detailed_description: e.target.value }))} />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
            <div className="form-group">
              <label>Industry Challenges (Comma or line-separated)</label>
              <textarea 
                className="form-textarea" 
                rows="3" 
                placeholder="Challenge 1, Challenge 2, Challenge 3..." 
                value={industryForm.challenges || ''} 
                onChange={e => setIndustryForm(prev => ({ ...prev, challenges: e.target.value }))} 
              />
            </div>
            <div className="form-group">
              <label>Project Capabilities (Comma or line-separated)</label>
              <textarea 
                className="form-textarea" 
                rows="3" 
                placeholder="Capability 1, Capability 2, Capability 3..." 
                value={industryForm.capabilities || ''} 
                onChange={e => setIndustryForm(prev => ({ ...prev, capabilities: e.target.value }))} 
              />
            </div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
            <div className="form-group">
              <label>Display Order (Lower values display first)</label>
              <input type="number" className="form-input" value={industryForm.sort_order} onChange={e => setIndustryForm(prev => ({ ...prev, sort_order: e.target.value }))} />
            </div>
            <div className="form-group">
              <label>Status</label>
              <select className="form-select" value={industryForm.status} onChange={e => setIndustryForm(prev => ({ ...prev, status: e.target.value }))}>
                <option value="Publish">Publish</option>
                <option value="Draft">Draft</option>
              </select>
            </div>
          </div>

          {/* Cover Photo with preview */}
          <div className="form-group">
            <label>Cover Photo Image</label>
            {editingIndustry !== 'new' && industryForm.image_path && (
              <div style={{ marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                <img
                  src={getAssetUrl(industryForm.image_path)}
                  alt="Current"
                  style={{ width: '80px', height: '60px', objectFit: 'cover', borderRadius: '6px', border: '2px solid #e2e8f0' }}
                  onError={e => { e.target.style.display = 'none'; }}
                />
                <span style={{ fontSize: '12px', color: '#64748b' }}>
                  <FaImage style={{ marginRight: '4px', color: '#0093DD' }} />
                  Current image (select a new file to replace)
                </span>
              </div>
            )}
            <input
              type="file"
              className="form-input"
              onChange={e => setIndustryImage(e.target.files[0] || null)}
              accept="image/*"
            />
          </div>

          <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
            <button type="submit" className="btn-primary">Save Industry</button>
            <button type="button" className="btn-outline" onClick={() => {
              setEditingIndustry(null);
              setIndustryImage(null);
            }}>Cancel</button>
          </div>
        </form>
      ) : (
        <div className="admin-table-container">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Image</th>
                <th>Industry Name</th>
                <th>Status</th>
                <th>Order</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {[...industries]
                .sort((a, b) => (Number(a.sort_order) || 0) - (Number(b.sort_order) || 0))
                .map(ind => (
                  <tr key={ind.id}>
                    <td>
                      <img
                        src={ind.image_path ? getAssetUrl(ind.image_path) : ''}
                        alt=""
                        style={{ width: '50px', height: '40px', objectFit: 'cover', borderRadius: '4px', background: '#f1f5f9' }}
                        onError={e => { e.target.style.opacity = '0'; }}
                      />
                    </td>
                    <td>{ind.name}</td>
                    <td><span className={`badge ${ind.status === 'Publish' ? 'publish' : 'draft'}`}>{ind.status}</span></td>
                    <td>{ind.sort_order}</td>
                    <td>
                      <button className="admin-action-btn admin-btn-edit" onClick={() => {
                        setEditingIndustry(ind);
                        setIndustryForm({
                          ...ind,
                          slug: ind.slug || ind.name?.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-')
                        });
                        setIndustryImage(null);
                      }}>
                        <FaEdit /> Edit
                      </button>
                      <button className="admin-action-btn admin-btn-delete" onClick={() => deleteIndustryItem(ind.id)}>
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

export default IndustriesTab;
