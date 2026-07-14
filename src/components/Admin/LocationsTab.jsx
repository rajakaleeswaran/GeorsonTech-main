import React from 'react';
import { FaPlus, FaEdit, FaTrash } from 'react-icons/fa';

function LocationsTab({
  locations,
  editingLocation,
  setEditingLocation,
  locationForm,
  setLocationForm,
  saveLocation,
  deleteLocationItem,
  startEditLocation
}) {
  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <h2 style={{ fontSize: '22px', fontWeight: '700', margin: 0 }}>Company Offices Locations</h2>
        {!editingLocation && (
          <button className="btn-primary" onClick={() => {
            setEditingLocation('new');
            setLocationForm({ office_name: '', office_type: '', address: '', phone: '', email: '', google_map_link: '', latitude: '', longitude: '' });
          }}>
            <FaPlus /> Add Office
          </button>
        )}
      </div>

      {editingLocation ? (
        <form onSubmit={saveLocation} className="admin-form">
          <h3>{editingLocation === 'new' ? 'New Office location' : 'Edit Office location'}</h3>
          
          <div className="form-group">
            <label>Office Name</label>
            <input 
              type="text" className="form-input" required
              value={locationForm.office_name}
              onChange={e => setLocationForm(prev => ({ ...prev, office_name: e.target.value }))}
            />
          </div>

          <div className="form-group">
            <label>Office Type</label>
            <select 
              className="form-select" required
              value={locationForm.office_type}
              onChange={e => setLocationForm(prev => ({ ...prev, office_type: e.target.value }))}
            >
              <option value="">-- Choose Type --</option>
              <option value="Registered Office">Registered Office</option>
              <option value="Manufacturing Unit">Manufacturing Unit</option>
              <option value="Service Unit">Service Unit</option>
            </select>
          </div>

          <div className="form-group">
            <label>Physical Address</label>
            <textarea 
              className="form-textarea" required
              value={locationForm.address}
              onChange={e => setLocationForm(prev => ({ ...prev, address: e.target.value }))}
            />
          </div>

          <div className="form-group">
            <label>Phone Number</label>
            <input 
              type="text" className="form-input"
              value={locationForm.phone}
              onChange={e => setLocationForm(prev => ({ ...prev, phone: e.target.value }))}
            />
          </div>

          <div className="form-group">
            <label>Email Address</label>
            <input 
              type="email" className="form-input"
              value={locationForm.email}
              onChange={e => setLocationForm(prev => ({ ...prev, email: e.target.value }))}
            />
          </div>

          <div className="form-group">
            <label>Google Map embed URL (Iframe src link)</label>
            <input 
              type="text" className="form-input"
              value={locationForm.google_map_link}
              onChange={e => setLocationForm(prev => ({ ...prev, google_map_link: e.target.value }))}
            />
          </div>

          <div className="form-group">
            <label>Latitude</label>
            <input 
              type="number" step="any" className="form-input"
              value={locationForm.latitude}
              onChange={e => setLocationForm(prev => ({ ...prev, latitude: e.target.value }))}
            />
          </div>

          <div className="form-group">
            <label>Longitude</label>
            <input 
              type="number" step="any" className="form-input"
              value={locationForm.longitude}
              onChange={e => setLocationForm(prev => ({ ...prev, longitude: e.target.value }))}
            />
          </div>

          <div style={{ display: 'flex', gap: '10px' }}>
            <button type="submit" className="btn-primary">Save Location</button>
            <button type="button" className="btn-outline" onClick={() => setEditingLocation(null)}>Cancel</button>
          </div>
        </form>
      ) : (
        <div className="admin-table-container">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Office Name</th>
                <th>Type</th>
                <th>Phone</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {locations.map(loc => (
                <tr key={loc.id}>
                  <td>{loc.office_name}</td>
                  <td>{loc.office_type}</td>
                  <td>{loc.phone || 'N/A'}</td>
                  <td>
                    <button className="admin-action-btn admin-btn-edit" onClick={() => startEditLocation(loc)}>
                      <FaEdit /> Edit
                    </button>
                    <button className="admin-action-btn admin-btn-delete" onClick={() => deleteLocationItem(loc.id)}>
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

export default LocationsTab;
