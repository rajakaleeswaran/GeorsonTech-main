import React from 'react';
import { FaEye, FaEnvelope } from 'react-icons/fa';

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
              <th>Email</th>
              <th>Service</th>
              <th>IP Address</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {enquiries.length === 0 ? (
              <tr>
                <td colSpan="6" style={{ textAlign: 'center', padding: '40px', color: '#64748b' }}>
                  <FaEnvelope style={{ fontSize: '28px', marginBottom: '10px', opacity: 0.3, display: 'block', margin: '0 auto 10px' }} />
                  No enquiries received yet. They will appear here when visitors submit the enquiry form.
                </td>
              </tr>
            ) : (
              enquiries.map(e => (
                <tr key={e.id}>
                  <td style={{ fontWeight: '600' }}>{e.name}</td>
                  <td>
                    <a href={`mailto:${e.email}`} style={{ color: '#0093DD', fontSize: '12.5px' }}>{e.email}</a>
                  </td>
                  <td>{e.service_interested || '—'}</td>
                  <td><code style={{ background: '#eee', padding: '2px 6px', borderRadius: '4px', fontSize: '11px' }}>{e.ip_address || 'Unknown'}</code></td>
                  <td>
                    <select
                      className="form-select" style={{ padding: '4px 8px', fontSize: '12px', width: '120px' }}
                      value={e.status || 'Pending'}
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
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default EnquiriesTab;

