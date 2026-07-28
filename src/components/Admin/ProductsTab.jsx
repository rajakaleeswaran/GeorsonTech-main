import { getAssetUrl } from '../../lib/api';
import React from 'react';
import { FaPlus, FaEdit, FaTrash, FaImage, FaFilePdf } from 'react-icons/fa';

function ProductsTab({
  activeTab,
  products,
  productCategories,
  editingProduct,
  setEditingProduct,
  editingProductCategory,
  setEditingProductCategory,
  productForm,
  setProductForm,
  productCategoryForm,
  setProductCategoryForm,
  setProductImage,
  setProductBrochure,
  saveProduct,
  deleteProductItem,
  saveProductCategory,
  deleteProductCategoryItem
}) {
  if (activeTab === 'products') {
    return (
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <h2 style={{ fontSize: '22px', fontWeight: '700', margin: 0 }}>Products Catalog</h2>
          {!editingProduct && (
            <button className="btn-primary" onClick={() => {
              setEditingProduct('new');
              setProductForm({ category_id: '', name: '', slug: '', description: '', specifications: '', video_url: '', is_featured: false });
              setProductImage(null);
              setProductBrochure(null);
            }}>
              <FaPlus /> Add Product
            </button>
          )}
        </div>

        {editingProduct ? (
          <form onSubmit={saveProduct} className="admin-form" style={{ maxWidth: '100%' }}>
            <h3>{editingProduct === 'new' ? 'New Product' : 'Edit Product'}</h3>
            
            <div className="form-group">
              <label>Category</label>
              {/* Coerce both value and option values to String to avoid type mismatch */}
              <select
                className="form-select"
                required
                value={String(productForm.category_id || '')}
                onChange={e => setProductForm(prev => ({ ...prev, category_id: e.target.value }))}
              >
                <option value="">-- Select Category --</option>
                {productCategories.map(cat => (
                  <option key={cat.id} value={String(cat.id)}>{cat.name}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>Product Name</label>
              <input type="text" className="form-input" required value={productForm.name} onChange={e => setProductForm(prev => ({ ...prev, name: e.target.value }))} />
            </div>

            <div className="form-group">
              <label>Slug (Unique URL)</label>
              <input type="text" className="form-input" required value={productForm.slug} onChange={e => setProductForm(prev => ({ ...prev, slug: e.target.value }))} />
            </div>

            <div className="form-group">
              <label>Short Description</label>
              <textarea className="form-textarea" required value={productForm.description} onChange={e => setProductForm(prev => ({ ...prev, description: e.target.value }))} />
            </div>

            <div className="form-group">
              <label>Specifications (Comma-separated)</label>
              <input type="text" className="form-input" placeholder="Spec 1, Spec 2, Spec 3" value={productForm.specifications} onChange={e => setProductForm(prev => ({ ...prev, specifications: e.target.value }))} />
            </div>

            <div className="form-group">
              <label>YouTube Video Link</label>
              <input type="text" className="form-input" placeholder="https://youtube.com/..." value={productForm.video_url || ''} onChange={e => setProductForm(prev => ({ ...prev, video_url: e.target.value }))} />
            </div>

            <div className="form-group" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <input type="checkbox" checked={!!productForm.is_featured} onChange={e => setProductForm(prev => ({ ...prev, is_featured: e.target.checked }))} />
              <label style={{ margin: 0 }}>Featured Product (Highlight on Landing page)</label>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
              {/* Product Image */}
              <div className="form-group">
                <label>Product Image</label>
                {/* Show existing image preview when editing */}
                {editingProduct !== 'new' && productForm.image_path && (
                  <div style={{ marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <img
                      src={getAssetUrl(productForm.image_path)}
                      alt="Current"
                      style={{ width: '80px', height: '60px', objectFit: 'cover', borderRadius: '6px', border: '2px solid #e2e8f0' }}
                      onError={e => { e.target.style.display = 'none'; }}
                    />
                    <span style={{ fontSize: '12px', color: '#64748b' }}>
                      <FaImage style={{ marginRight: '4px', color: '#0093DD' }} />
                      Current image (select a new file to replace)
                    </span>
                  </div>
                )}
                <input
                  type="file"
                  className="form-input"
                  onChange={e => setProductImage(e.target.files[0] || null)}
                  accept="image/*"
                />
              </div>

              {/* Brochure PDF */}
              <div className="form-group">
                <label>Brochure PDF</label>
                {/* Show existing brochure info when editing */}
                {editingProduct !== 'new' && productForm.brochure_path && (
                  <div style={{ marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <FaFilePdf style={{ color: '#ef4444', fontSize: '24px', flexShrink: 0 }} />
                    <div>
                      <a
                        href={getAssetUrl(productForm.brochure_path, 'brochure')}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{ fontSize: '12px', color: '#ef4444', textDecoration: 'underline', display: 'block' }}
                      >
                        {productForm.brochure_path.split('/').pop()}
                      </a>
                      <span style={{ fontSize: '11px', color: '#94a3b8' }}>Select a new file to replace</span>
                    </div>
                  </div>
                )}
                <input
                  type="file"
                  className="form-input"
                  onChange={e => setProductBrochure(e.target.files[0] || null)}
                  accept=".pdf"
                />
              </div>
            </div>

            <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
              <button type="submit" className="btn-primary">Save Product</button>
              <button type="button" className="btn-outline" onClick={() => {
                setEditingProduct(null);
                setProductImage(null);
                setProductBrochure(null);
              }}>Cancel</button>
            </div>
          </form>
        ) : (
          <div className="admin-table-container">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Image</th>
                  <th>Product Name</th>
                  <th>Category</th>
                  <th>Featured</th>
                  <th>Brochure</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.map(p => (
                  <tr key={p.id}>
                    <td>
                      <img
                        src={p.image_path ? getAssetUrl(p.image_path) : ''}
                        alt=""
                        style={{ width: '50px', height: '40px', objectFit: 'cover', borderRadius: '4px', background: '#f1f5f9' }}
                        onError={e => { e.target.src = ''; e.target.style.opacity = '0'; }}
                      />
                    </td>
                    <td>{p.name}</td>
                    <td>{p.category_name || <span style={{ color: '#94a3b8', fontStyle: 'italic' }}>Uncategorized</span>}</td>
                    <td>{p.is_featured ? <span style={{ color: 'green', fontWeight: 'bold' }}>✓ Yes</span> : 'No'}</td>
                    <td>
                      {p.brochure_path ? (
                        <a
                          href={getAssetUrl(p.brochure_path, 'brochure')}
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{ color: '#ef4444', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '4px' }}
                        >
                          <FaFilePdf /> PDF
                        </a>
                      ) : (
                        <span style={{ color: '#94a3b8', fontSize: '12px' }}>—</span>
                      )}
                    </td>
                    <td>
                      <button className="admin-action-btn admin-btn-edit" onClick={() => {
                        let formSpecs = '';
                        if (p.specifications) {
                          try {
                            const parsed = JSON.parse(p.specifications);
                            if (Array.isArray(parsed)) {
                              formSpecs = parsed.join(', ');
                            } else {
                              formSpecs = p.specifications;
                            }
                          } catch {
                            formSpecs = p.specifications;
                          }
                        }
                        setEditingProduct(p);
                        // Spread all product fields into form; coerce category_id to string
                        setProductForm({ ...p, specifications: formSpecs, category_id: String(p.category_id || '') });
                        // Reset file inputs so no stale file is carried over
                        setProductImage(null);
                        setProductBrochure(null);
                      }}>
                        <FaEdit /> Edit
                      </button>
                      <button className="admin-action-btn admin-btn-delete" onClick={() => deleteProductItem(p.id)}>
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

  if (activeTab === 'product_categories') {
    return (
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <h2 style={{ fontSize: '22px', fontWeight: '700', margin: 0 }}>Product Categories</h2>
          {!editingProductCategory && (
            <button className="btn-primary" onClick={() => {
              setEditingProductCategory('new');
              setProductCategoryForm({ name: '', slug: '' });
            }}>
              <FaPlus /> Add Category
            </button>
          )}
        </div>

        {editingProductCategory ? (
          <form onSubmit={saveProductCategory} className="admin-form">
            <h3>{editingProductCategory === 'new' ? 'New Category' : 'Edit Category'}</h3>
            <div className="form-group">
              <label>Category Name</label>
              <input type="text" className="form-input" required value={productCategoryForm.name} onChange={e => setProductCategoryForm(prev => ({ ...prev, name: e.target.value }))} />
            </div>
            <div className="form-group">
              <label>Slug (Unique identifier)</label>
              <input type="text" className="form-input" required value={productCategoryForm.slug} onChange={e => setProductCategoryForm(prev => ({ ...prev, slug: e.target.value }))} />
            </div>
            <div style={{ display: 'flex', gap: '10px' }}>
              <button type="submit" className="btn-primary">Save Category</button>
              <button type="button" className="btn-outline" onClick={() => setEditingProductCategory(null)}>Cancel</button>
            </div>
          </form>
        ) : (
          <div className="admin-table-container">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Category Name</th>
                  <th>Slug</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {productCategories.map(cat => (
                  <tr key={cat.id}>
                    <td>{cat.name}</td>
                    <td>{cat.slug}</td>
                    <td>
                      <button className="admin-action-btn admin-btn-edit" onClick={() => { setEditingProductCategory(cat); setProductCategoryForm(cat); }}>
                        <FaEdit /> Edit
                      </button>
                      <button className="admin-action-btn admin-btn-delete" onClick={() => deleteProductCategoryItem(cat.id)}>
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

  return null;
}

export default ProductsTab;
