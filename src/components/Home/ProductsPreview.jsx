import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaArrowRight } from 'react-icons/fa';
import '../../styles/Home.css';
import { fetchCollection, getAssetUrl } from '../../lib/dbHelper';

// Fallback static images for when no DB product image is available
import prod1 from '../../assets/Home/Hero/hero1.png';
import prod2 from '../../assets/Home/Hero/hero2.png';
import prod3 from '../../assets/Home/Hero/hero3.png';

const FALLBACK_IMAGES = [prod1, prod2, prod3];

const STATIC_FALLBACK = [
  {
    id: 'f1',
    image_path: null,
    category_name: "Electrical Panels",
    name: "MCC / PCC Control Panels",
    description: "Motor control centres and power control centres for industrial plants.",
  },
  {
    id: 'f2',
    image_path: null,
    category_name: "Automation",
    name: "PLC & SCADA Systems",
    description: "Programmable logic controllers and SCADA integration for process control.",
  },
  {
    id: 'f3',
    image_path: null,
    category_name: "IoT",
    name: "Smart Sensors & Gateways",
    description: "Industrial IoT edge devices for real-time data acquisition and monitoring.",
  },
];

function ProductsPreview() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let catList = [];
    fetchCollection('/products/categories', 'product_categories')
      .then(cats => { if (Array.isArray(cats)) catList = cats; })
      .catch(() => {})
      .finally(() => {
        fetchCollection('/products', 'products')
          .then(data => {
            if (Array.isArray(data) && data.length > 0) {
              const enriched = data.map(p => {
                const matchedCat = catList.find(c =>
                  String(c.id) === String(p.category_id) ||
                  c.name?.toLowerCase() === String(p.category_id).toLowerCase() ||
                  c.slug?.toLowerCase() === String(p.category_id).toLowerCase()
                );
                return {
                  ...p,
                  category_name: p.category_name || (matchedCat ? matchedCat.name : 'General')
                };
              });
              const featuredOnly = enriched.filter(p => p.is_featured === true || p.is_featured === 'true' || p.is_featured === 1 || p.is_featured === '1');
              if (featuredOnly.length > 0) {
                setProducts(featuredOnly.slice(0, 3));
              } else {
                setProducts(STATIC_FALLBACK);
              }
            } else {
              setProducts(STATIC_FALLBACK);
            }
          })
          .catch(() => setProducts(STATIC_FALLBACK))
          .finally(() => setLoading(false));
      });
  }, []);

  // While loading, show static fallback immediately (no blank flash)
  const displayProducts = products.length > 0 ? products : STATIC_FALLBACK;

  return (
    <section className="products-section">
      <div className="section-header">
        <span className="section-label">Our Products</span>
        <h2 className="section-title">Premium <span>Industrial Products</span></h2>
        <p className="section-subtitle">
          Explore our extensive range of industrial engineering products — built for
          reliability, safety, and performance.
        </p>
      </div>

      <div className="products-grid-preview">
        {displayProducts.map((prod, i) => {
          const imgSrc = prod.image_path
            ? getAssetUrl(prod.image_path)
            : FALLBACK_IMAGES[i % FALLBACK_IMAGES.length];

          return (
            <Link key={prod.id || i} to={`/products/${prod.slug || prod.id}`} className="product-preview-card">
              <div className="product-preview-img">
                <img
                  src={imgSrc}
                  alt={prod.name}
                  loading="lazy"
                  onError={e => {
                    e.target.src = FALLBACK_IMAGES[i % FALLBACK_IMAGES.length];
                  }}
                />
              </div>
              <div className="product-preview-body">
                <p className="product-preview-category">{prod.category_name || 'General'}</p>
                <h3>{prod.name}</h3>
                <p>{prod.description}</p>
              </div>
            </Link>
          );
        })}
      </div>

      <div className="section-cta-center">
        <Link to="/products" className="btn-primary">
          Browse All Products <FaArrowRight />
        </Link>
      </div>
    </section>
  );
}

export default ProductsPreview;
