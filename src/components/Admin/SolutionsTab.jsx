import { getAssetUrl } from '../../lib/api';
import React from 'react';
import { FaPlus, FaEdit, FaTrash, FaImage } from 'react-icons/fa';

function SolutionsTab({
  activeTab,
  solutions,
  solutionCategories,
  industries,
  products,
  editingSolution,
  setEditingSolution,
  editingSolutionCategory,
  setEditingSolutionCategory,
  solutionForm,
  setSolutionForm,
  solutionCategoryForm,
  setSolutionCategoryForm,
  setSolutionImage,
  saveSolution,
  deleteSolutionItem,
  saveSolutionCategory,
  deleteSolutionCategoryItem
}) {
  if (activeTab === 'solutions') {
    return (
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <h2 style={{ fontSize: '22px', fontWeight: '700', margin: 0 }}>Solutions Ecosystem</h2>
          {!editingSolution && (
            <button className="btn-primary" onClick={() => {
              setEditingSolution('new');
              setSolutionForm({ category_id: '', name: '', slug: '', description: '', icon: '', service_descriptions: '', sort_order: 0, status: 'Publish', industry_ids: [], product_ids: [] });
              setSolutionImage(null);
            }}>
              <FaPlus /> Add Solution
            </button>
          )}
        </div>

        {editingSolution ? (
          <form onSubmit={saveSolution} className="admin-form" style={{ maxWidth: '100%' }}>
            <h3>{editingSolution === 'new' ? 'New Solution' : 'Edit Solution'}</h3>
            
            <div className="form-group">
              <label>Category</label>
              {/* Coerce to String for proper HTML select matching */}
              <select
                className="form-select"
                required
                value={String(solutionForm.category_id || '')}
                onChange={e => setSolutionForm(prev => ({ ...prev, category_id: e.target.value }))}
              >
                <option value="">-- Choose Category --</option>
                {solutionCategories.map(cat => (
                  <option key={cat.id} value={String(cat.id)}>{cat.name}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>Solution Name</label>
              <input type="text" className="form-input" required value={solutionForm.name} onChange={e => setSolutionForm(prev => ({ ...prev, name: e.target.value }))} />
            </div>

            <div className="form-group">
              <label>Slug (Unique URL)</label>
              <input type="text" className="form-input" required value={solutionForm.slug} onChange={e => setSolutionForm(prev => ({ ...prev, slug: e.target.value }))} />
            </div>

            <div className="form-group">
              <label>Description</label>
              <textarea className="form-textarea" required value={solutionForm.description} onChange={e => setSolutionForm(prev => ({ ...prev, description: e.target.value }))} />
            </div>

            <div className="form-group">
              <label>Icon CSS Class</label>
              <input type="text" className="form-input" placeholder="FaCogs, FaBolt, etc" value={solutionForm.icon || ''} onChange={e => setSolutionForm(prev => ({ ...prev, icon: e.target.value }))} />
            </div>

            <div className="form-group">
              <label>Bullet Details (Comma-separated)</label>
              <input type="text" className="form-input" placeholder="Feature A, Feature B" value={solutionForm.service_descriptions || ''} onChange={e => setSolutionForm(prev => ({ ...prev, service_descriptions: e.target.value }))} />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
              <div className="form-group">
                <label>Display Order</label>
                <input type="number" className="form-input" value={solutionForm.sort_order} onChange={e => setSolutionForm(prev => ({ ...prev, sort_order: e.target.value }))} />
              </div>
              <div className="form-group">
                <label>Publish Status</label>
                <select className="form-select" value={solutionForm.status} onChange={e => setSolutionForm(prev => ({ ...prev, status: e.target.value }))}>
                  <option value="Publish">Publish</option>
                  <option value="Draft">Draft</option>
                </select>
              </div>
            </div>

            {/* Related Industries Multi-check */}
            <div className="form-group" style={{ border: '1px solid #e2e8f0', borderRadius: '8px', padding: '16px', marginBottom: '20px' }}>
              <label style={{ fontWeight: 'bold', marginBottom: '10px' }}>Assign to Industry Sectors:</label>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px', maxHeight: '180px', overflowY: 'auto' }}>
                {industries.map(ind => {
                  const currentIds = Array.isArray(solutionForm.industry_ids) ? solutionForm.industry_ids : [];
                  const isChecked = currentIds.some(id => String(id) === String(ind.id));
                  return (
                    <label key={ind.id} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: '500', fontSize: '13px', margin: 0, cursor: 'pointer' }}>
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={e => {
                          const nextIds = e.target.checked
                            ? [...currentIds, ind.id]
                            : currentIds.filter(id => String(id) !== String(ind.id));
                          setSolutionForm(prev => ({ ...prev, industry_ids: nextIds }));
                        }}
                      />
                      {ind.name}
                    </label>
                  );
                })}
                {industries.length === 0 && <span style={{ color: '#94a3b8', fontSize: '13px' }}>No industries found</span>}
              </div>
            </div>

            {/* Related Products Multi-check */}
            <div className="form-group" style={{ border: '1px solid #e2e8f0', borderRadius: '8px', padding: '16px', marginBottom: '20px' }}>
              <label style={{ fontWeight: 'bold', marginBottom: '10px' }}>Link Related Products:</label>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px', maxHeight: '180px', overflowY: 'auto' }}>
                {products.map(prod => {
                  const currentIds = Array.isArray(solutionForm.product_ids) ? solutionForm.product_ids : [];
                  const isChecked = currentIds.some(id => String(id) === String(prod.id));
                  return (
                    <label key={prod.id} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: '500', fontSize: '13px', margin: 0, cursor: 'pointer' }}>
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={e => {
                          const nextIds = e.target.checked
                            ? [...currentIds, prod.id]
                            : currentIds.filter(id => String(id) !== String(prod.id));
                          setSolutionForm(prev => ({ ...prev, product_ids: nextIds }));
                        }}
                      />
                      {prod.name}
                    </label>
                  );
                })}
                {products.length === 0 && <span style={{ color: '#94a3b8', fontSize: '13px' }}>No products found</span>}
              </div>
            </div>

            {/* Featured Image with preview */}
            <div className="form-group">
              <label>Featured Image Upload</label>
              {editingSolution !== 'new' && solutionForm.image_path && (
                <div style={{ marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <img
                    src={getAssetUrl(solutionForm.image_path)}
                    alt="Current"
                    style={{ width: '80px', height: '60px', objectFit: 'cover', borderRadius: '6px', border: '2px solid #e2e8f0' }}
                    onError={e => { e.target.style.display = 'none'; }}
                  />
                  <span style={{ fontSize: '12px', color: '#64748b' }}>
                    <FaImage style={{ marginRight: '4px', color: '#0093DD' }} />
                    Current image (select to replace)
                  </span>
                </div>
              )}
              <input
                type="file"
                className="form-input"
                onChange={e => setSolutionImage(e.target.files[0] || null)}
                accept="image/*"
              />
            </div>

            <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
              <button type="submit" className="btn-primary">Save Solution</button>
              <button type="button" className="btn-outline" onClick={() => {
                setEditingSolution(null);
                setSolutionImage(null);
              }}>Cancel</button>
            </div>
          </form>
        ) : (
          <div className="admin-table-container">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Image</th>
                  <th>Solution Name</th>
                  <th>Category</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {solutions.length === 0 ? (
                  <tr><td colSpan="5" style={{ textAlign: 'center', padding: '30px', color: '#64748b' }}>No solutions yet. Add your first solution.</td></tr>
                ) : (
                  solutions.map(sol => (
                    <tr key={sol.id}>
                      <td>
                        <img
                          src={sol.image_path ? getAssetUrl(sol.image_path) : ''}
                          alt=""
                          style={{ width: '50px', height: '40px', objectFit: 'cover', borderRadius: '4px', background: '#f1f5f9' }}
                          onError={e => { e.target.style.opacity = '0'; }}
                        />
                      </td>
                      <td>{sol.name}</td>
                      <td>{sol.category_name || <span style={{ color: '#94a3b8' }}>—</span>}</td>
                      <td><span className={`badge ${sol.status === 'Publish' ? 'publish' : 'draft'}`}>{sol.status}</span></td>
                      <td>
                        <button className="admin-action-btn admin-btn-edit" onClick={() => {
                          setEditingSolution(sol);
                          setSolutionForm({
                            ...sol,
                            category_id: String(sol.category_id || ''),
                            industry_ids: Array.isArray(sol.industry_ids) ? sol.industry_ids : [],
                            product_ids: Array.isArray(sol.product_ids) ? sol.product_ids : []
                          });
                          setSolutionImage(null);
                        }}>
                          <FaEdit /> Edit
                        </button>
                        <button className="admin-action-btn admin-btn-delete" onClick={() => deleteSolutionItem(sol.id)}>
                          <FaTrash /> Delete
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    );
  }

  if (activeTab === 'solution_categories') {
    return (
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <h2 style={{ fontSize: '22px', fontWeight: '700', margin: 0 }}>Solution Categories</h2>
          {!editingSolutionCategory && (
            <button className="btn-primary" onClick={() => {
              setEditingSolutionCategory('new');
              setSolutionCategoryForm({ name: '', sort_order: 0 });
            }}>
              <FaPlus /> Add Category
            </button>
          )}
        </div>

        {editingSolutionCategory ? (
          <form onSubmit={saveSolutionCategory} className="admin-form">
            <h3>{editingSolutionCategory === 'new' ? 'New Solution Category' : 'Edit Solution Category'}</h3>
            <div className="form-group">
              <label>Category Name</label>
              <input type="text" className="form-input" required value={solutionCategoryForm.name} onChange={e => setSolutionCategoryForm(prev => ({ ...prev, name: e.target.value }))} />
            </div>
            <div className="form-group">
              <label>Display Order</label>
              <input type="number" className="form-input" value={solutionCategoryForm.sort_order} onChange={e => setSolutionCategoryForm(prev => ({ ...prev, sort_order: parseInt(e.target.value) || 0 }))} />
            </div>
            <div style={{ display: 'flex', gap: '10px' }}>
              <button type="submit" className="btn-primary">Save Category</button>
              <button type="button" className="btn-outline" onClick={() => setEditingSolutionCategory(null)}>Cancel</button>
            </div>
          </form>
        ) : (
          <div className="admin-table-container">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Category Name</th>
                  <th>Display Order</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {solutionCategories.length === 0 ? (
                  <tr><td colSpan="3" style={{ textAlign: 'center', padding: '30px', color: '#64748b' }}>No solution categories yet.</td></tr>
                ) : (
                  solutionCategories.map(cat => (
                    <tr key={cat.id}>
                      <td>{cat.name}</td>
                      <td>{cat.sort_order}</td>
                      <td>
                        <button className="admin-action-btn admin-btn-edit" onClick={() => { setEditingSolutionCategory(cat); setSolutionCategoryForm(cat); }}>
                          <FaEdit /> Edit
                        </button>
                        <button className="admin-action-btn admin-btn-delete" onClick={() => deleteSolutionCategoryItem(cat.id)}>
                          <FaTrash /> Delete
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    );
  }

  return null;
}

export default SolutionsTab;
