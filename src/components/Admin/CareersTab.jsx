import { getAssetUrl } from '../../lib/api';
import React from 'react';
import { FaEye, FaDownload } from 'react-icons/fa';

function CareersTab({
  careers,
  changeCareerStatus,
  setViewItem
}) {
  return (
    <div>
      <h2 style={{ marginBottom: '24px', fontSize: '22px', fontWeight: '700' }}>Candidates Job Applications</h2>
      <div className="admin-table-container">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Candidate</th>
              <th>IP Address</th>
              <th>Experience</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {careers.map(c => (
              <tr key={c.id}>
                <td>{c.name}</td>
                <td><code style={{ background: '#eee', padding: '2px 6px', borderRadius: '4px' }}>{c.ip_address || 'Unknown'}</code></td>
                <td>{c.experience}</td>
                <td>
                  <select 
                    className="form-select" style={{ padding: '4px 8px', fontSize: '12px', width: '120px' }}
                    value={c.status}
                    onChange={opt => changeCareerStatus(c.id, opt.target.value)}
                  >
                    <option value="Pending">Pending</option>
                    <option value="Contacted">Contacted</option>
                    <option value="Closed">Closed</option>
                  </select>
                </td>
                <td>
                  <button className="admin-action-btn admin-btn-edit" onClick={() => setViewItem(c)}>
                    <FaEye /> Detail
                  </button>
                  <a href={c.resume_path ? (c.resume_path.startsWith('http') ? c.resume_path : getAssetUrl(c.resume_path)) : '#'} target="_blank" rel="noopener noreferrer" className="admin-action-btn admin-btn-edit" style={{ textDecoration: 'none' }}>
                    <FaDownload /> Resume
                  </a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default CareersTab;
