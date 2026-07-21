import { getAssetUrl } from '../../lib/api';
import React from 'react';
import { FaPlus, FaEdit, FaTrash } from 'react-icons/fa';

function ServicesTab({
  services,
  editingService,
  setEditingService,
  serviceForm,
  setServiceForm,
  setServiceImage,
  setServiceBrochure,
  saveService,
  deleteServiceItem
}) {
  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <h2 style={{ fontSize: '22px', fontWeight: '700', margin: 0 }}>Manage Dynamic Services</h2>
        {!editingService && (
          <button className="btn-primary" onClick={() => {
            setEditingService('new');
            setServiceForm({ title: '', slug: '', short_description: '', detailed_description: '', features: '', sort_order: 0, status: 'Publish' });
          }}>
            <FaPlus /> Add Service
          </button>
        )}
      </div>

      {editingService ? (
        <form onSubmit={saveService} className="admin-form" style={{ maxWidth: '100%' }}>
          <h3>{editingService === 'new' ? 'New Service' : 'Edit Service'}</h3>
          
          <div className="form-group">
            <label>Service Title</label>
            <input type="text" className="form-input" required value={serviceForm.title} onChange={e => setServiceForm(prev => ({ ...prev, title: e.target.value }))} />
          </div>

          <div className="form-group">
            <label>Slug (Unique identifier)</label>
            <input type="text" className="form-input" required value={serviceForm.slug} onChange={e => setServiceForm(prev => ({ ...prev, slug: e.target.value }))} />
          </div>

          <div className="form-group">
            <label>Short Description</label>
            <textarea className="form-textarea" required value={serviceForm.short_description} onChange={e => setServiceForm(prev => ({ ...prev, short_description: e.target.value }))} />
          </div>

          <div className="form-group">
            <label>Detailed Description</label>
            <textarea className="form-textarea" rows="6" value={serviceForm.detailed_description} onChange={e => setServiceForm(prev => ({ ...prev, detailed_description: e.target.value }))} />
          </div>

          <div className="form-group">
            <label>Key Features (Comma-separated)</label>
            <input type="text" className="form-input" placeholder="Feature 1, Feature 2, Feature 3" value={serviceForm.features} onChange={e => setServiceForm(prev => ({ ...prev, features: e.target.value }))} />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
            <div className="form-group">
              <label>Display Order (Lower values display first)</label>
              <input type="number" className="form-input" value={serviceForm.sort_order} onChange={e => setServiceForm(prev => ({ ...prev, sort_order: e.target.value }))} />
            </div>

            <div className="form-group">
              <label>Publish Status</label>
              <select className="form-select" value={serviceForm.status} onChange={e => setServiceForm(prev => ({ ...prev, status: e.target.value }))}>
                <option value="Publish">Publish</option>
                <option value="Draft">Draft</option>
              </select>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
            <div className="form-group">
              <label>Featured Thumbnail Image File</label>
              <input type="file" className="form-input" onChange={e => setServiceImage(e.target.files[0])} accept="image/*" />
            </div>
            <div className="form-group">
              <label>PDF Brochure Document</label>
              <input type="file" className="form-input" onChange={e => setServiceBrochure(e.target.files[0])} accept=".pdf" />
            </div>
          </div>

          <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
            <button type="submit" className="btn-primary">Save Service</button>
            <button type="button" className="btn-outline" onClick={() => setEditingService(null)}>Cancel</button>
          </div>
        </form>
      ) : (
        <div className="admin-table-container">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Image</th>
                <th>Service Title</th>
                <th>Status</th>
                <th>Order</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {services.map(svc => (
                <tr key={svc.id}>
                  <td>
                    <img src={svc.image_path ? getAssetUrl(svc.image_path) : ''} alt="" style={{ width: '50px', height: '40px', objectFit: 'cover', borderRadius: '4px' }} />
                  </td>
                  <td>{svc.title}</td>
                  <td><span className={`badge ${svc.status === 'Publish' ? 'publish' : 'draft'}`}>{svc.status}</span></td>
                  <td>{svc.sort_order}</td>
                  <td>
                    <button className="admin-action-btn admin-btn-edit" onClick={() => { setEditingService(svc); setServiceForm(svc); }}>
                      <FaEdit /> Edit
                    </button>
                    <button className="admin-action-btn admin-btn-delete" onClick={() => deleteServiceItem(svc.id)}>
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

export default ServicesTab;
