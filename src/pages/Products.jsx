import React, { useState, useEffect, useMemo } from 'react';
import { Helmet } from 'react-helmet-async';
import { FaSearch, FaFilePdf, FaInfoCircle, FaTimes, FaEnvelope } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import TitleBar from '../components/TitleBar';
import ServicesTitleImg from '../assets/Services/titleImg.png';
import '../styles/Products.css';
import { fetchCollection, getAssetUrl } from '../lib/dbHelper';

function Products() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [activeCategory, setActiveCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState(null);

  useEffect(() => {
    // Fetch Categories
    fetchCollection('/products/categories', 'product_categories')
      .then(data => {
        if (Array.isArray(data)) {
          setCategories(["All", ...data.map(cat => cat.name)]);
        }
      })
      .catch(err => console.error("Failed to fetch product categories:", err));

    // Fetch Products
    fetchCollection('/products', 'products')
      .then(data => {
        if (Array.isArray(data)) {
          setProducts(data);
        }
      })
      .catch(err => console.error("Failed to fetch products:", err))
      .finally(() => setLoading(false));
  }, []);

  const filtered = useMemo(() => {
    return products.filter(p => {
      if (!p) return false;
      const matchCat = activeCategory === "All" || p.category_name === activeCategory;
      const prodName = (p.name || p.title || "").toLowerCase();
      const prodDesc = (p.description || p.short_description || "").toLowerCase();
      const matchSearch = prodName.includes(searchQuery.toLowerCase()) ||
                          prodDesc.includes(searchQuery.toLowerCase());
      return matchCat && matchSearch;
    });
  }, [activeCategory, searchQuery, products]);


  return (
    <>
      <Helmet>
        <title>Products – Georson Tech Pvt. Ltd | Industrial Product Catalog</title>
        <meta name="description" content="Browse Georson Tech's industrial product catalog – electrical panels, PLC systems, IIoT gateways, VFDs, servo drives, and more." />
        <link rel="canonical" href="https://www.georsontech.com/products" />
      </Helmet>

      <TitleBar title="PRODUCTS" bg={ServicesTitleImg} />

      <div className="products-page" style={{ padding: '70px 20px', background: '#FAFAFA' }}>

        {/* Page Header */}
        <div className="text-center" style={{ marginBottom: '50px' }}>
          <span className="section-label">Our Catalog</span>
          <h1 className="section-title">Industrial <span>Product Range</span></h1>
          <p className="section-subtitle">
            World-class industrial products for automation, power distribution,
            IIoT, and engineering applications.
          </p>
        </div>

        {/* Search Bar */}
        <div className="products-search-wrap">
          <FaSearch />
          <input
            type="text"
            className="products-search"
            placeholder="Search products by name or description..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
          />
        </div>

        {/* Category Filter */}
        <div className="products-filter-bar" style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '10px', marginBottom: '40px' }}>
          {categories.map(cat => (
            <button
              key={cat}
              className={`products-filter-btn ${activeCategory === cat ? 'active' : ''}`}
              onClick={() => setActiveCategory(cat)}
              style={{
                padding: '8px 20px',
                borderRadius: '20px',
                border: '1px solid #0093DD',
                background: activeCategory === cat ? '#0093DD' : 'transparent',
                color: activeCategory === cat ? '#ffffff' : '#0093DD',
                fontWeight: '600',
                fontSize: '13.5px',
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Products Grid */}
        <div className="container">
          {loading ? (
            <p className="text-center" style={{ color: '#64748b' }}>Loading products catalog...</p>
          ) : (
            <div className="products-grid">
              {filtered.length > 0 ? filtered.map(product => {
                // Parse specs
                let specItems = [];
                if (product.specifications) {
                  if (typeof product.specifications === 'string') {
                    try {
                      specItems = JSON.parse(product.specifications);
                    } catch {
                      specItems = product.specifications.split(',');
                    }
                  } else if (Array.isArray(product.specifications)) {
                    specItems = product.specifications;
                  }
                }

                return (
                  <div key={product.id} className="product-card">
                    <div className="product-card-img" style={{ position: 'relative', height: '220px', background: '#e2e8f0', overflow: 'hidden' }}>
                      <img 
                        src={product.image_path ? getAssetUrl(product.image_path) : 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80&w=400'} 
                        alt={product.name} 
                        loading="lazy"
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      />
                      <span className="product-card-badge" style={{ position: 'absolute', top: '12px', left: '12px', background: '#0093DD', color: '#fff', padding: '4px 10px', borderRadius: '4px', fontSize: '11px', fontWeight: 'bold' }}>
                        {product.category_name || "General"}
                      </span>
                    </div>
                    <div className="product-card-body" style={{ padding: '24px', display: 'flex', flexDirection: 'column', height: 'calc(100% - 220px)' }}>
                      <h3 style={{ fontSize: '17.5px', fontWeight: '700', color: '#0f172a', margin: '0 0 10px' }}>{product.name}</h3>
                      <p style={{ fontSize: '13.5px', color: '#64748b', lineHeight: 1.5, marginBottom: '15px', flex: 1 }}>{product.description}</p>
                      
                      {specItems.length > 0 && (
                        <div className="product-card-specs" style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '20px' }}>
                          {specItems.map((spec, i) => (
                            <span key={i} className="product-spec-tag" style={{ background: '#f1f5f9', color: '#475569', padding: '4px 8px', borderRadius: '4px', fontSize: '11.5px' }}>{spec.trim()}</span>
                          ))}
                        </div>
                      )}

                      <div className="product-card-actions" style={{ display: 'flex', gap: '10px', marginTop: 'auto' }}>
                        <button 
                          className="product-btn-details" 
                          onClick={() => setSelectedProduct(product)}
                          style={{ flex: 1, padding: '10px', fontSize: '13px', background: '#0093DD', color: '#fff', borderRadius: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}
                        >
                          <FaInfoCircle /> Details
                        </button>
                         {product.pdf_brochure_path && (
                          <a 
                            href={getAssetUrl(product.pdf_brochure_path)} 
                            target="_blank" 
                            rel="noopener noreferrer" 
                            className="product-btn-pdf" 
                            title="Download Brochure"
                            style={{ padding: '10px 14px', fontSize: '13px', border: '1px solid #ef4444', color: '#ef4444', borderRadius: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                          >
                            <FaFilePdf />
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                );
              }) : (
                <div className="products-no-results" style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '40px 0' }}>
                  <p style={{ color: '#64748b' }}>😕 No products found. Try adjusting your search or filter.</p>
                </div>
              )}
            </div>
          )}
        </div>

      </div>

      {/* Product Details Modal */}
      {selectedProduct && (
        <div style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(15, 23, 42, 0.7)',
          backdropFilter: 'blur(4px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 99999,
          padding: '20px'
        }}>
          <div style={{
            background: '#ffffff',
            borderRadius: '16px',
            maxWidth: '650px',
            width: '100%',
            maxHeight: '90vh',
            overflowY: 'auto',
            boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)',
            position: 'relative'
          }}>
            {/* Close Button */}
            <button 
              onClick={() => setSelectedProduct(null)}
              style={{
                position: 'absolute',
                top: '20px',
                right: '20px',
                background: '#f1f5f9',
                border: 'none',
                borderRadius: '50%',
                width: '36px',
                height: '36px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                zIndex: 10
              }}
            >
              <FaTimes style={{ color: '#64748b' }} />
            </button>

            {/* Modal Image */}
            <div style={{ height: '260px', width: '100%', background: '#e2e8f0' }}>
              <img 
                src={selectedProduct.image_path ? getAssetUrl(selectedProduct.image_path) : 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80&w=800'} 
                alt={selectedProduct.name} 
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            </div>

            {/* Modal Body */}
            <div style={{ padding: '30px' }}>
              <span className="product-card-badge" style={{ background: '#0093DD', color: '#fff', padding: '4px 10px', borderRadius: '4px', fontSize: '11px', fontWeight: 'bold' }}>
                {selectedProduct.category_name || "General"}
              </span>
              <h2 style={{ fontSize: '22px', fontWeight: '800', color: '#0f172a', marginTop: '10px', marginBottom: '14px' }}>
                {selectedProduct.name}
              </h2>
              
              <p style={{ fontSize: '14.5px', color: '#475569', lineHeight: 1.6, marginBottom: '24px' }}>
                {selectedProduct.description}
              </p>

              {/* Technical Specifications */}
              {selectedProduct.specifications && (
                <div style={{ marginBottom: '24px' }}>
                  <h4 style={{ fontSize: '14px', fontWeight: '700', color: '#0f172a', marginBottom: '10px' }}>
                    Technical Specifications:
                  </h4>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                    {(typeof selectedProduct.specifications === 'string' ? selectedProduct.specifications.split(',') : selectedProduct.specifications).map((spec, i) => (
                      <span key={i} style={{ background: '#f1f5f9', color: '#334155', padding: '6px 12px', borderRadius: '4px', fontSize: '12.5px' }}>
                        {spec.trim()}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Actions */}
              <div style={{ display: 'flex', gap: '15px' }}>
                <Link 
                  to={`/enquiry?tab=enquiry&product=${encodeURIComponent(selectedProduct.name)}`}
                  className="btn-primary" 
                  style={{ background: '#0093DD', border: 'none', padding: '12px 24px', fontSize: '13.5px', display: 'flex', alignItems: 'center', gap: '8px' }}
                  onClick={() => setSelectedProduct(null)}
                >
                  <FaEnvelope /> Request Callback
                </Link>
                 {selectedProduct.pdf_brochure_path && (
                  <a 
                    href={getAssetUrl(selectedProduct.pdf_brochure_path)} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="btn-outline"
                    style={{ borderColor: '#ef4444', color: '#ef4444', padding: '10px 20px', fontSize: '13.5px', display: 'flex', alignItems: 'center', gap: '8px' }}
                  >
                    <FaFilePdf /> Download Brochure
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default Products;
