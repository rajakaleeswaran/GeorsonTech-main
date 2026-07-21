import { getAssetUrl } from '../../lib/api';
import React from 'react';
import { FaEye, FaDownload, FaFileAlt } from 'react-icons/fa';
import { toast } from 'react-toastify';

function CareersTab({
  careers,
  changeCareerStatus,
  setViewItem
}) {
  const handleResumeClick = (e, resumePath) => {
    if (!resumePath) {
      e.preventDefault();
      toast.warn("No resume file was uploaded by this candidate.");
    }
  };

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
            {careers.length === 0 ? (
              <tr>
                <td colSpan="5" style={{ textAlign: 'center', padding: '30px', color: '#64748b' }}>
                  No candidate applications received yet.
                </td>
              </tr>
            ) : (
              careers.map(c => {
                const fileUrl = c.resume_path ? getAssetUrl(c.resume_path, 'resume') : null;
                return (
                  <tr key={c.id}>
                    <td style={{ fontWeight: '600' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <FaFileAlt style={{ color: '#0093DD' }} />
                        <span>{c.name}</span>
                      </div>
                    </td>
                    <td><code style={{ background: '#eee', padding: '2px 6px', borderRadius: '4px', fontSize: '11px' }}>{c.ip_address || 'Unknown'}</code></td>
                    <td>{c.experience || 'Not specified'}</td>
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
                      {fileUrl ? (
                        <a 
                          href={fileUrl} 
                          target="_blank" 
                          rel="noopener noreferrer" 
                          download
                          className="admin-action-btn admin-btn-edit" 
                          style={{ textDecoration: 'none', background: '#dcfce7', color: '#15803d' }}
                          onClick={e => handleResumeClick(e, c.resume_path)}
                        >
                          <FaDownload /> Resume
                        </a>
                      ) : (
                        <span style={{ fontSize: '12px', color: '#94a3b8', fontStyle: 'italic' }}>No Resume</span>
                      )}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default CareersTab;
