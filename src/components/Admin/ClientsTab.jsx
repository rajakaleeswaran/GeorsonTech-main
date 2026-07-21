import { getAssetUrl } from '../../lib/api';
import React, { useState } from 'react';
import { FaPlus, FaEdit, FaTrash, FaSearch, FaSort } from 'react-icons/fa';

function ClientsTab({
  clients,
  editingClient,
  setEditingClient,
  clientForm,
  setClientForm,
  setClientLogo,
  saveClient,
  deleteClientItem
}) {
  const [filterCategory, setFilterCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('sort_order');
  const [sortOrder, setSortOrder] = useState('asc');

  const filteredClients = clients
    .filter(c => {
      const matchCategory = filterCategory === 'All' || c.category === filterCategory;
      const matchSearch = c.name.toLowerCase().includes(searchQuery.toLowerCase());
      return matchCategory && matchSearch;
    })
    .sort((a, b) => {
      let valA = a[sortBy];
      let valB = b[sortBy];

      if (sortBy === 'sort_order') {
        valA = parseInt(valA || 0);
        valB = parseInt(valB || 0);
      } else {
        valA = String(valA || '').toLowerCase();
        valB = String(valB || '').toLowerCase();
      }

      if (valA < valB) return sortOrder === 'asc' ? -1 : 1;
      if (valA > valB) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    });

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <h2 style={{ fontSize: '22px', fontWeight: '700', margin: 0 }}>Clients & Logos</h2>
        {!editingClient && (
          <button className="btn-primary" onClick={() => {
            setEditingClient('new');
            setClientForm({ name: '', sort_order: 0, status: 'Publish', category: 'Client' });
          }}>
            <FaPlus /> Add Logo
          </button>
        )}
      </div>

      {editingClient ? (
        <form onSubmit={saveClient} className="admin-form">
          <h3>{editingClient === 'new' ? 'New Logo' : 'Edit Logo'}</h3>
          <div className="form-group">
            <label>Company / Brand Name</label>
            <input type="text" className="form-input" required value={clientForm.name} onChange={e => setClientForm(prev => ({ ...prev, name: e.target.value }))} />
          </div>
          <div className="form-group">
            <label>Logo Type / Category</label>
            <select className="form-select" value={clientForm.category || 'Client'} onChange={e => setClientForm(prev => ({ ...prev, category: e.target.value }))}>
              <option value="Client">Prestigious Client (Trusted by Leaders marquee)</option>
              <option value="Brand">Global Brand (Deal with Global Brands slider)</option>
            </select>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
            <div className="form-group">
              <label>Display Order</label>
              <input type="number" className="form-input" value={clientForm.sort_order} onChange={e => setClientForm(prev => ({ ...prev, sort_order: e.target.value }))} />
            </div>
            <div className="form-group">
              <label>Status</label>
              <select className="form-select" value={clientForm.status} onChange={e => setClientForm(prev => ({ ...prev, status: e.target.value }))}>
                <option value="Publish">Publish</option>
                <option value="Draft">Draft</option>
              </select>
            </div>
          </div>
          <div className="form-group">
            <label>Upload Logo File (PNG/JPEG)</label>
            <input type="file" className="form-input" onChange={e => setClientLogo(e.target.files[0])} accept="image/*" />
          </div>
          <div style={{ display: 'flex', gap: '10px' }}>
            <button type="submit" className="btn-primary">Save Logo</button>
            <button type="button" className="btn-outline" onClick={() => setEditingClient(null)}>Cancel</button>
          </div>
        </form>
      ) : (
        <>
          {/* Filtering and Sorting Toolbar */}
          <div style={{ display: 'flex', gap: '15px', marginBottom: '20px', alignItems: 'center', flexWrap: 'wrap', background: '#f8fafc', padding: '15px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
            <div style={{ position: 'relative', flex: 1, minWidth: '200px' }}>
              <FaSearch style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
              <input 
                type="text" 
                placeholder="Search company/brand..." 
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="form-input" 
                style={{ paddingLeft: '36px', height: '40px', margin: 0, width: '100%', boxSizing: 'border-box' }}
              />
            </div>

            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
              <label style={{ margin: 0, fontSize: '13px', fontWeight: '600', color: '#64748b', whiteSpace: 'nowrap' }}>Category:</label>
              <select 
                className="form-select" 
                value={filterCategory} 
                onChange={e => setFilterCategory(e.target.value)}
                style={{ width: '180px', height: '40px', padding: '0 12px', margin: 0 }}
              >
                <option value="All">All Categories</option>
                <option value="Client">Prestigious Clients</option>
                <option value="Brand">Global Brands</option>
              </select>
            </div>

            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
              <label style={{ margin: 0, fontSize: '13px', fontWeight: '600', color: '#64748b', whiteSpace: 'nowrap' }}>Sort By:</label>
              <select 
                className="form-select" 
                value={sortBy} 
                onChange={e => setSortBy(e.target.value)}
                style={{ width: '130px', height: '40px', padding: '0 12px', margin: 0 }}
              >
                <option value="sort_order">Display Order</option>
                <option value="name">Name</option>
                <option value="category">Category</option>
                <option value="status">Status</option>
              </select>
              <button 
                type="button" 
                className="btn-outline" 
                style={{ height: '40px', padding: '0 16px', margin: 0, display: 'flex', alignItems: 'center', gap: '6px', whiteSpace: 'nowrap' }}
                onClick={() => setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc')}
              >
                <FaSort /> {sortOrder === 'asc' ? 'Ascending' : 'Descending'}
              </button>
            </div>
          </div>

          <div className="admin-table-container">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Logo</th>
                  <th>Company Name</th>
                  <th>Category</th>
                  <th>Status</th>
                  <th>Order</th>
                  <th>Actions</th>
                </tr>
              </thead>
            <tbody>
              {filteredClients.map(c => (
                <tr key={c.id}>
                  <td>
                    <img src={c.logo_path ? getAssetUrl(c.logo_path) : ''} alt="" style={{ height: '36px', objectFit: 'contain', maxWidth: '80px' }} />
                  </td>
                  <td>{c.name}</td>
                  <td>
                    <span style={{ 
                      fontSize: '11px', 
                      fontWeight: '600', 
                      background: c.category === 'Brand' ? '#f59e0b22' : '#10b98122', 
                      color: c.category === 'Brand' ? '#d97706' : '#059669', 
                      padding: '2px 8px', 
                      borderRadius: '12px' 
                    }}>
                      {c.category === 'Brand' ? 'Global Brand' : 'Prestigious Client'}
                    </span>
                  </td>
                  <td><span className={`badge ${c.status === 'Publish' ? 'publish' : 'draft'}`}>{c.status}</span></td>
                  <td>{c.sort_order}</td>
                  <td>
                    <button className="admin-action-btn admin-btn-edit" onClick={() => { setEditingClient(c); setClientForm(c); }}>
                      <FaEdit /> Edit
                    </button>
                    <button className="admin-action-btn admin-btn-delete" onClick={() => deleteClientItem(c.id)}>
                      <FaTrash /> Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        </>
      )}
    </div>
  );
}

export default ClientsTab;
