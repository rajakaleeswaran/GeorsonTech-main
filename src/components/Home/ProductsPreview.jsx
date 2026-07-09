import React from 'react';
import { Link } from 'react-router-dom';
import { FaArrowRight } from 'react-icons/fa';
import '../../styles/Home.css';

// Use existing product images if available
import prod1 from '../../assets/Home/Hero/hero1.png';
import prod2 from '../../assets/Home/Hero/hero2.png';
import prod3 from '../../assets/Home/Hero/hero3.png';

const PRODUCTS = [
  {
    image: prod1,
    category: "Electrical Panels",
    name: "MCC / PCC Control Panels",
    description: "Motor control centres and power control centres for industrial plants.",
  },
  {
    image: prod2,
    category: "Automation",
    name: "PLC & SCADA Systems",
    description: "Programmable logic controllers and SCADA integration for process control.",
  },
  {
    image: prod3,
    category: "IoT",
    name: "Smart Sensors & Gateways",
    description: "Industrial IoT edge devices for real-time data acquisition and monitoring.",
  },
];

function ProductsPreview() {
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
        {PRODUCTS.map((prod, i) => (
          <Link key={i} to="/products" className="product-preview-card">
            <div className="product-preview-img">
              <img src={prod.image} alt={prod.name} loading="lazy" />
            </div>
            <div className="product-preview-body">
              <p className="product-preview-category">{prod.category}</p>
              <h3>{prod.name}</h3>
              <p>{prod.description}</p>
            </div>
          </Link>
        ))}
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
