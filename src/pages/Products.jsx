import React, { useState, useMemo } from 'react';
import { Helmet } from 'react-helmet-async';
import { FaSearch, FaFilePdf, FaInfoCircle } from 'react-icons/fa';
import TitleBar from '../components/TitleBar';
import ServicesTitleImg from '../assets/Services/titleImg.png';
import '../styles/Products.css';

// Product data (will be replaced by API in Phase 2)
import prod1 from '../assets/Home/Hero/hero1.png';
import prod2 from '../assets/Home/Hero/hero2.png';
import prod3 from '../assets/Home/Hero/hero3.png';

const CATEGORIES = ["All", "Electrical Panels", "Automation", "IIoT", "Sensors", "Drives & Motors"];

const PRODUCTS = [
  {
    id: 1, category: "Electrical Panels",
    name: "MCC – Motor Control Centre",
    description: "Fully enclosed motor control centre with overload relays, contactors, and bus bar assembly. Suitable for industrial plants.",
    specs: ["IP54 Rating", "Up to 6600V", "Custom Design"],
    image: prod1,
  },
  {
    id: 2, category: "Electrical Panels",
    name: "PCC – Power Control Centre",
    description: "Power control centre panels for distribution and protection of electrical power in heavy industries.",
    specs: ["LT/HT", "Up to 4000A", "Metering"],
    image: prod2,
  },
  {
    id: 3, category: "Automation",
    name: "PLC Control Systems",
    description: "Programmable Logic Controller systems from Siemens, Allen-Bradley, and Mitsubishi for factory automation.",
    specs: ["SIEMENS S7", "Allen-Bradley", "Remote I/O"],
    image: prod3,
  },
  {
    id: 4, category: "Automation",
    name: "SCADA Integration",
    description: "Supervisory Control and Data Acquisition system integration for real-time plant monitoring and control.",
    specs: ["Wonderware", "FactoryTalk", "AVEVA"],
    image: prod1,
  },
  {
    id: 5, category: "IIoT",
    name: "IIoT Edge Gateways",
    description: "Industrial IoT edge gateways for connecting legacy machines to cloud platforms for data analytics.",
    specs: ["OPC-UA", "MQTT", "Cloud Ready"],
    image: prod2,
  },
  {
    id: 6, category: "IIoT",
    name: "Condition Monitoring System",
    description: "Wireless vibration and temperature sensors for predictive maintenance and equipment health monitoring.",
    specs: ["Wireless", "Battery Powered", "5-Year Life"],
    image: prod3,
  },
  {
    id: 7, category: "Sensors",
    name: "Industrial Sensors Pack",
    description: "Proximity, photoelectric, ultrasonic, and temperature sensors for automation and process control.",
    specs: ["IP67", "NPN/PNP", "Multi-Range"],
    image: prod1,
  },
  {
    id: 8, category: "Drives & Motors",
    name: "Variable Frequency Drives",
    description: "VFD / AC drives for precise motor speed control, energy savings, and soft start applications.",
    specs: ["0.37kW–315kW", "Danfoss", "ABB"],
    image: prod2,
  },
  {
    id: 9, category: "Drives & Motors",
    name: "Servo Drives & Motors",
    description: "High-precision servo drive and motor systems for CNC, robotics, and motion control applications.",
    specs: ["0.5Nm–500Nm", "Encoder Feedback", "EtherCAT"],
    image: prod3,
  },
];

function Products() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  const filtered = useMemo(() => {
    return PRODUCTS.filter(p => {
      const matchCat = activeCategory === "All" || p.category === activeCategory;
      const matchSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          p.description.toLowerCase().includes(searchQuery.toLowerCase());
      return matchCat && matchSearch;
    });
  }, [activeCategory, searchQuery]);

  return (
    <>
      <Helmet>
        <title>Products – Georson Tech Pvt. Ltd | Industrial Engineering Products</title>
        <meta name="description" content="Browse Georson Tech's industrial product catalog – electrical panels, PLC systems, IIoT gateways, VFDs, servo drives, and more." />
        <link rel="canonical" href="https://www.georsontech.com/products" />
      </Helmet>

      <TitleBar title="PRODUCTS" bg={ServicesTitleImg} />

      <div className="products-page" style={{ padding: '70px 20px' }}>

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
        <div className="products-filter-bar">
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              className={`products-filter-btn ${activeCategory === cat ? 'active' : ''}`}
              onClick={() => setActiveCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Products Grid */}
        <div className="container">
          <div className="products-grid">
            {filtered.length > 0 ? filtered.map(product => (
              <div key={product.id} className="product-card">
                <div className="product-card-img">
                  <img src={product.image} alt={product.name} loading="lazy" />
                  <span className="product-card-badge">{product.category}</span>
                </div>
                <div className="product-card-body">
                  <h3>{product.name}</h3>
                  <p>{product.description}</p>
                  <div className="product-card-specs">
                    {product.specs.map((spec, i) => (
                      <span key={i} className="product-spec-tag">{spec}</span>
                    ))}
                  </div>
                  <div className="product-card-actions">
                    <button className="product-btn-details">
                      <FaInfoCircle /> View Details
                    </button>
                    <button className="product-btn-pdf" title="Download Brochure">
                      <FaFilePdf /> PDF
                    </button>
                  </div>
                </div>
              </div>
            )) : (
              <div className="products-no-results">
                <p>😕 No products found. Try adjusting your search or filter.</p>
              </div>
            )}
          </div>
        </div>

      </div>
    </>
  );
}

export default Products;
