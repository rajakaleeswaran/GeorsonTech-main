import { getAssetUrl } from '../../lib/api';
import React from 'react';
import { FaPlus, FaEdit, FaTrash } from 'react-icons/fa';

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
        <h2 style={{ fontSize: '22px', fontWeight: '700', margin: 0 }}>Industries serve</h2>
        {!editingIndustry && (
          <button className="btn-primary" onClick={() => {
            setEditingIndustry('new');
            setIndustryForm({ name: '', slug: '', description: '', detailed_description: '', sort_order: 0, status: 'Publish' });
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
            <input type="text" className="form-input" required value={industryForm.name} onChange={e => setIndustryForm(prev => ({ ...prev, name: e.target.value }))} />
          </div>
          <div className="form-group">
            <label>Slug (URL pathway)</label>
            <input type="text" className="form-input" required value={industryForm.slug} onChange={e => setIndustryForm(prev => ({ ...prev, slug: e.target.value }))} />
          </div>
          <div className="form-group">
            <label>Short Summary</label>
            <textarea className="form-textarea" required value={industryForm.description} onChange={e => setIndustryForm(prev => ({ ...prev, description: e.target.value }))} />
          </div>
          <div className="form-group">
            <label>Detailed Description</label>
            <textarea className="form-textarea" rows="6" value={industryForm.detailed_description} onChange={e => setIndustryForm(prev => ({ ...prev, detailed_description: e.target.value }))} />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
            <div className="form-group">
              <label>Display Order</label>
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
          <div className="form-group">
            <label>Cover Photo Image</label>
            <input type="file" className="form-input" onChange={e => setIndustryImage(e.target.files[0])} accept="image/*" />
          </div>
          <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
            <button type="submit" className="btn-primary">Save Industry</button>
            <button type="button" className="btn-outline" onClick={() => setEditingIndustry(null)}>Cancel</button>
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
              {industries.map(ind => (
                <tr key={ind.id}>
                  <td>
                    <img src={ind.image_path ? getAssetUrl(ind.image_path) : ''} alt="" style={{ width: '50px', height: '40px', objectFit: 'cover', borderRadius: '4px' }} />
                  </td>
                  <td>{ind.name}</td>
                  <td><span className={`badge ${ind.status === 'Publish' ? 'publish' : 'draft'}`}>{ind.status}</span></td>
                  <td>{ind.sort_order}</td>
                  <td>
                    <button className="admin-action-btn admin-btn-edit" onClick={() => { setEditingIndustry(ind); setIndustryForm(ind); }}>
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
