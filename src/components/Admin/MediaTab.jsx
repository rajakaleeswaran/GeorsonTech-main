import { getAssetUrl } from '../../lib/api';
import React from 'react';
import { FaPlus, FaFileAlt, FaTrash, FaFilePdf, FaFileImage, FaFile } from 'react-icons/fa';

function MediaTab({
  mediaAssets,
  handleMediaUpload,
  deleteMediaAsset
}) {
  const getFileIcon = (fileType) => {
    if (!fileType) return <FaFile />;
    if (fileType.includes('image')) return <FaFileImage style={{ color: '#0093DD' }} />;
    if (fileType.includes('pdf')) return <FaFilePdf style={{ color: '#ef4444' }} />;
    return <FaFileAlt style={{ color: '#64748b' }} />;
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <h2 style={{ fontSize: '22px', fontWeight: '700', margin: 0 }}>Shared Media Library</h2>
        <label className="btn-primary" style={{ cursor: 'pointer' }}>
          <FaPlus /> Upload File
          <input type="file" style={{ display: 'none' }} onChange={handleMediaUpload} />
        </label>
      </div>

      {mediaAssets.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '50px 20px', color: '#94a3b8', background: '#f8fafc', borderRadius: '12px', border: '2px dashed #e2e8f0' }}>
          <FaFileAlt style={{ fontSize: '40px', marginBottom: '16px', opacity: 0.4 }} />
          <p style={{ fontSize: '15px', marginBottom: '8px' }}>No media assets uploaded yet.</p>
          <p style={{ fontSize: '13px' }}>Upload images and PDFs to use across your site.</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: '20px' }}>
          {mediaAssets.map(asset => (
            <div key={asset.id} style={{ border: '1px solid #ddd', borderRadius: '8px', overflow: 'hidden', background: '#fff', boxShadow: '0 2px 4px rgba(0,0,0,0.04)' }}>
              <div style={{ height: '110px', background: '#f5f5f5', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
                {asset.file_type && asset.file_type.includes('image') ? (
                  <img
                    src={getAssetUrl(asset.file_path)}
                    alt={asset.file_name}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    onError={e => { e.target.style.display = 'none'; e.target.parentElement.appendChild(Object.assign(document.createElement('span'), { textContent: '🖼️', style: { fontSize: '32px' } })); }}
                  />
                ) : (
                  <span style={{ fontSize: '32px', color: '#999' }}>
                    {getFileIcon(asset.file_type)}
                  </span>
                )}
              </div>
              <div style={{ padding: '10px', fontSize: '11px' }}>
                <p style={{ fontWeight: '600', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', margin: '0 0 6px', title: asset.file_name }}>
                  {asset.file_name}
                </p>
                <button
                  className="admin-action-btn admin-btn-delete"
                  style={{ width: '100%', justifyContent: 'center' }}
                  onClick={() => deleteMediaAsset(asset.id)}
                >
                  <FaTrash /> Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default MediaTab;
