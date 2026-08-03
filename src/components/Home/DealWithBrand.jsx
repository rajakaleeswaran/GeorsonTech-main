import React, { useState, useEffect } from "react";
import "../../styles/Home.css";
import { fetchCollection, getAssetUrl } from "../../lib/dbHelper";

import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import "swiper/css";

import brandBg from "../../assets/Home/goalinnumImg.png";

/* ✅ AUTO IMPORT ALL BRAND IMAGES (as fallback) */
const images = import.meta.glob("../../assets/Brands/*.{png,jpg,jpeg}", {
  eager: true,
});

const FALLBACK_BRANDS = Object.values(images).map((img) => img.default);

const brandImageMap = {};
Object.entries(images).forEach(([path, module]) => {
  const filename = path.split('/').pop().toLowerCase();
  brandImageMap[filename] = module.default;
});

function getBrandLogo(b) {
  if (!b) return '';
  const path = b.logo_path || '';
  if (path.startsWith('http://') || path.startsWith('https://') || path.startsWith('data:')) {
    return path;
  }
  const filename = path.split('/').pop().toLowerCase();
  if (brandImageMap[filename]) {
    return brandImageMap[filename];
  }
  return getAssetUrl(path);
}

function DealWithBrand() {
  const [dbBrands, setDbBrands] = useState([]);

  useEffect(() => {
    // 1. Check local cache first (saved by Admin)
    try {
      const cachedStr = localStorage.getItem('cms_cache_clients');
      if (cachedStr) {
        const cached = JSON.parse(cachedStr);
        if (Array.isArray(cached)) {
          const brands = cached.filter(c => (!c.status || c.status === 'Publish') && c.category === 'Brand');
          if (brands.length > 0) {
            setDbBrands(brands);
            return;
          }
        }
      }
    } catch (_) {}

    // 2. Fetch from DB/API
    fetchCollection('/clients', 'clients')
      .then(data => {
        if (Array.isArray(data)) {
          const filtered = data.filter(c => (!c.status || c.status === 'Publish') && c.category === 'Brand');
          if (filtered.length > 0) {
            setDbBrands(filtered);
          }
        }
      })
      .catch(err => console.error("Failed to load slider brands:", err));
  }, []);

  return (
    <section
      className="brand-section"
      style={{ backgroundImage: `url(${brandBg})` }}
    >
      <div className="brand-overlay">
        <h2 className="brand-title">DEAL WITH GLOBAL BRANDS</h2>

        <div className="brand-slider">
          <Swiper
            modules={[Autoplay]}
            spaceBetween={30}
            slidesPerView={5}
            slidesPerGroup={5}
            loop={true}
            autoplay={{
              delay: 2500,
              disableOnInteraction: false,
            }}
            breakpoints={{
              1024: {
                slidesPerView: 5,
                slidesPerGroup: 5,
              },
              768: {
                slidesPerView: 3,
                slidesPerGroup: 3,
              },
              480: {
                slidesPerView: 2,
                slidesPerGroup: 2,
              },
            }}
          >
            {dbBrands.length > 0 ? (
              dbBrands.map((b, index) => (
                <SwiperSlide key={b.id || index}>
                  <div className="brand-card">
                    <img src={getBrandLogo(b)} alt={b.name} />
                  </div>
                </SwiperSlide>
              ))
            ) : (
              FALLBACK_BRANDS.map((logo, index) => (
                <SwiperSlide key={index}>
                  <div className="brand-card">
                    <img src={logo} alt={`brand-${index}`} />
                  </div>
                </SwiperSlide>
              ))
            )}
          </Swiper>
        </div>
      </div>
    </section>
  );
}

export default DealWithBrand;