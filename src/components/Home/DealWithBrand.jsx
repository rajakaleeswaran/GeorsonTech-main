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

function DealWithBrand() {
  const [dbBrands, setDbBrands] = useState([]);

  useEffect(() => {
    fetchCollection('/clients', 'clients')
      .then(data => {
        if (Array.isArray(data)) {
          const filtered = data.filter(c => c.status === 'Publish' && c.category === 'Brand');
          setDbBrands(filtered);
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
                    <img src={getAssetUrl(b.logo_path)} alt={b.name} />
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