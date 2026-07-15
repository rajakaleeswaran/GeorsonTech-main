import React from 'react';
import { FaEye } from 'react-icons/fa';

function EnquiriesTab({
  enquiries,
  changeEnquiryStatus,
  setViewItem
}) {
  return (
    <div>
      <h2 style={{ marginBottom: '24px', fontSize: '22px', fontWeight: '700' }}>Form Enquiries Audit</h2>
      <div className="admin-table-container">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Sender</th>
              <th>IP Address</th>
              <th>Service</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {enquiries.map(e => (
              <tr key={e.id}>
                <td>{e.name}</td>
                <td><code style={{ background: '#eee', padding: '2px 6px', borderRadius: '4px' }}>{e.ip_address || 'Unknown'}</code></td>
                <td>{e.service_interested}</td>
                <td>
                  <select 
                    className="form-select" style={{ padding: '4px 8px', fontSize: '12px', width: '120px' }}
                    value={e.status}
                    onChange={opt => changeEnquiryStatus(e.id, opt.target.value)}
                  >
                    <option value="Pending">Pending</option>
                    <option value="Contacted">Contacted</option>
                    <option value="Closed">Closed</option>
                  </select>
                </td>
                <td>
                  <button className="admin-action-btn admin-btn-edit" onClick={() => setViewItem(e)}>
                    <FaEye /> Inspect
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default EnquiriesTab;
