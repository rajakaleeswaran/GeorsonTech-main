import { getAssetUrl } from '../../lib/api';
import React from 'react';
import { FaEye, FaDownload, FaFileAlt } from 'react-icons/fa';
import { toast } from 'react-toastify';

function CareersTab({
  careers,
  changeCareerStatus,
  setViewItem
}) {
  const handleResumeDownload = async (e, resumePath, candidateName, candidateEmail) => {
    e.preventDefault();

    if (!resumePath) {
      toast.warn(`No resume file attached for ${candidateName}.`);
      return;
    }

    const fileUrl = getAssetUrl(resumePath, 'resume');

    // If fileUrl resolves to a remote HTTP/HTTPS or data URL, open directly in a new tab
    if (fileUrl && (fileUrl.startsWith('http') || fileUrl.startsWith('data:'))) {
      window.open(fileUrl, '_blank');
      return;
    }

    // Check if local backend file exists
    try {
      const res = await fetch(fileUrl, { method: 'HEAD' });
      if (res.ok) {
        window.open(fileUrl, '_blank');
      } else {
        const fileName = resumePath.split('/').pop();
        toast.error(`⚠️ Resume file "${fileName}" is unavailable on server.`);
        if (candidateEmail && window.confirm(`File unavailable on server. Would you like to send an email request to ${candidateEmail}?`)) {
          window.location.href = `mailto:${candidateEmail}?subject=Resume%20Re-submission%20Request&body=Hi%20${encodeURIComponent(candidateName)},%0A%0AWe%20received%20your%20job%20application%20at%20Georson%20Tech.%20Please%20reply%20to%20this%20email%20with%20your%20resume/CV%20attached.%0A%0ABest%20regards,%0AGeorson%20Tech%20HR`;
        }
      }
    } catch (_) {
      window.open(fileUrl, '_blank');
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
                          onClick={e => handleResumeDownload(e, c.resume_path, c.name, c.email)}
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
