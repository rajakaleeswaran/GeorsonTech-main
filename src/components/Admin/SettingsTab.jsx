import React from 'react';
import { FaCloudDownloadAlt } from 'react-icons/fa';

function SettingsTab({
  settingsForm,
  setSettingsForm,
  saveSettings,
  handleDatabaseBackup
}) {
  return (
    <div>
      <h2 style={{ marginBottom: '24px', fontSize: '22px', fontWeight: '700' }}>Dynamic Settings Control Center</h2>
      
      <form onSubmit={saveSettings} className="admin-form" style={{ maxWidth: '100%' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
          <div className="form-group">
            <label>Company Branding Name</label>
            <input 
              type="text" className="form-input" 
              value={settingsForm.company_name || ''}
              onChange={e => setSettingsForm(prev => ({ ...prev, company_name: e.target.value }))}
            />
          </div>
          <div className="form-group">
            <label>Motto Tagline</label>
            <input 
              type="text" className="form-input" 
              value={settingsForm.motto || ''}
              onChange={e => setSettingsForm(prev => ({ ...prev, motto: e.target.value }))}
            />
          </div>
        </div>

        <h3 style={{ margin: '24px 0 12px', fontSize: '16px', borderBottom: '1px solid #eee', paddingBottom: '6px' }}>Theme Hex Colors</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px' }}>
          <div className="form-group">
            <label>Primary Theme Color</label>
            <input 
              type="color" className="form-input" style={{ height: '42px', padding: '2px' }}
              value={settingsForm.theme_primary_color || '#0093DD'}
              onChange={e => setSettingsForm(prev => ({ ...prev, theme_primary_color: e.target.value }))}
            />
          </div>
          <div className="form-group">
            <label>Accent Highlights Color</label>
            <input 
              type="color" className="form-input" style={{ height: '42px', padding: '2px' }}
              value={settingsForm.theme_accent_color || '#00c6ff'}
              onChange={e => setSettingsForm(prev => ({ ...prev, theme_accent_color: e.target.value }))}
            />
          </div>
          <div className="form-group">
            <label>Background Main Color</label>
            <input 
              type="color" className="form-input" style={{ height: '42px', padding: '2px' }}
              value={settingsForm.theme_background_color || '#ffffff'}
              onChange={e => setSettingsForm(prev => ({ ...prev, theme_background_color: e.target.value }))}
            />
          </div>
        </div>

        <h3 style={{ margin: '24px 0 12px', fontSize: '16px', borderBottom: '1px solid #eee', paddingBottom: '6px' }}>Dynamic Email Routing Recipients</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px' }}>
          <div className="form-group">
            <label>HR Enquiries Target</label>
            <input 
              type="email" className="form-input" 
              value={settingsForm.hr_email || ''}
              onChange={e => setSettingsForm(prev => ({ ...prev, hr_email: e.target.value }))}
            />
          </div>
          <div className="form-group">
            <label>Sales Quotations Target</label>
            <input 
              type="email" className="form-input" 
              value={settingsForm.sales_email || ''}
              onChange={e => setSettingsForm(prev => ({ ...prev, sales_email: e.target.value }))}
            />
          </div>
          <div className="form-group">
            <label>Projects Engineering Target</label>
            <input 
              type="email" className="form-input" 
              value={settingsForm.projects_email || ''}
              onChange={e => setSettingsForm(prev => ({ ...prev, projects_email: e.target.value }))}
            />
          </div>
        </div>

        <h3 style={{ margin: '24px 0 12px', fontSize: '16px', borderBottom: '1px solid #eee', paddingBottom: '6px' }}>Third Party Analytics</h3>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
          <div className="form-group">
            <label>Google Analytics 4 Measurement ID</label>
            <input 
              type="text" className="form-input" placeholder="e.g. G-XXXXXXX"
              value={settingsForm.google_analytics_id || ''}
              onChange={e => setSettingsForm(prev => ({ ...prev, google_analytics_id: e.target.value }))}
            />
          </div>
          <div className="form-group">
            <label>Search Console verification ID</label>
            <input 
              type="text" className="form-input" 
              value={settingsForm.google_search_console_id || ''}
              onChange={e => setSettingsForm(prev => ({ ...prev, google_search_console_id: e.target.value }))}
            />
          </div>
        </div>

        <div style={{ display: 'flex', gap: '15px', marginTop: '30px' }}>
          <button type="submit" className="btn-primary">Save Settings</button>
          <button type="button" className="btn-outline" onClick={handleDatabaseBackup}>
            <FaCloudDownloadAlt /> Export SQL Backup
          </button>
        </div>
      </form>
    </div>
  );
}

export default SettingsTab;
