import React from 'react';
import { FaPlus, FaFileAlt, FaTrash } from 'react-icons/fa';

function MediaTab({
  mediaAssets,
  handleMediaUpload,
  deleteMediaAsset
}) {
  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <h2 style={{ fontSize: '22px', fontWeight: '700', margin: 0 }}>Shared Media Library</h2>
        <label className="btn-primary" style={{ cursor: 'pointer' }}>
          <FaPlus /> Upload File
          <input type="file" style={{ display: 'none' }} onChange={handleMediaUpload} />
        </label>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: '20px' }}>
        {mediaAssets.map(asset => (
          <div key={asset.id} style={{ border: '1px solid #ddd', borderRadius: '8px', overflow: 'hidden', background: '#fff' }}>
            <div style={{ height: '110px', background: '#f5f5f5', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
              {asset.file_type.includes('image') ? (
                <img src={`http://localhost:5000/${asset.file_path}`} alt={asset.file_name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              ) : (
                <span style={{ fontSize: '24px', color: '#999' }}><FaFileAlt /></span>
              )}
            </div>
            <div style={{ padding: '10px', fontSize: '11px' }}>
              <p style={{ fontWeight: '600', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', margin: '0 0 6px' }}>{asset.file_name}</p>
              <button className="admin-action-btn admin-btn-delete" style={{ width: '100%', justifyContent: 'center' }} onClick={() => deleteMediaAsset(asset.id)}>
                <FaTrash /> Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default MediaTab;
