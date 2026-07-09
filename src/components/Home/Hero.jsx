import { useEffect, useState, useCallback } from "react";
import { Link } from "react-router-dom";
import { FaChevronLeft, FaChevronRight, FaArrowRight } from "react-icons/fa";
import "../../styles/Home.css";

import Hero1 from '../../assets/Home/Hero/hero1.png';
import Hero2 from '../../assets/Home/Hero/hero2.png';
import Hero3 from '../../assets/Home/Hero/hero3.png';

const slides = [
  {
    image: Hero1,
    badge: "Industrial Engineering",
    title: "Wide Range Of Industrial Products Available",
    subtitle: "World-class electrical panels, automation systems, and IoT solutions engineered for your business.",
    button: "Explore Products",
    navigate: "/products",
  },
  {
    image: Hero2,
    badge: "Industrial Automation",
    title: "High Quality Electrical Panels & Control Systems",
    subtitle: "Engineered for safety, reliability, and peak performance in demanding industrial environments.",
    button: "Our Services",
    navigate: "/services",
  },
  {
    image: Hero3,
    badge: "IoT Solutions",
    title: "Reliable Industrial Solutions That Power Your Business",
    subtitle: "Connecting your machines, processes, and people with smart IoT technology and automation.",
    button: "About Us",
    navigate: "/about",
  },
  {
    image: Hero1,
    badge: "Manufacturing Excellence",
    title: "End-to-End Engineering & Manufacturing Capabilities",
    subtitle: "From concept to commissioning — we deliver complete industrial engineering solutions across India.",
    button: "Get a Quote",
    navigate: "/enquiry",
  },
];

function Hero() {
  const [current, setCurrent] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  const goTo = useCallback((index) => {
    if (isAnimating) return;
    setIsAnimating(true);
    setCurrent((index + slides.length) % slides.length);
    setTimeout(() => setIsAnimating(false), 800);
  }, [isAnimating]);

  const next = useCallback(() => goTo(current + 1), [current, goTo]);
  const prev = useCallback(() => goTo(current - 1), [current, goTo]);

  useEffect(() => {
    const interval = setInterval(next, 6000);
    return () => clearInterval(interval);
  }, [next]);

  return (
    <section className="hero" aria-label="Hero Slider">

      {/* Slides */}
      {slides.map((slide, index) => (
        <div
          key={index}
          className={`hero-slide ${index === current ? "active" : ""}`}
          style={{ backgroundImage: `url(${slide.image})` }}
          aria-hidden={index !== current}
        >
          <div className="hero-overlay">
            <div className="hero-content">
              <span className="hero-badge">{slide.badge}</span>
              <h1 className="hero-title">{slide.title}</h1>
              <p className="hero-subtitle">{slide.subtitle}</p>
              <div className="hero-actions">
                <Link to={slide.navigate} className="hero-btn-primary">
                  {slide.button} <FaArrowRight />
                </Link>
                <Link to="/enquiry" className="hero-btn-secondary">
                  Get a Quote
                </Link>
              </div>
            </div>
          </div>
        </div>
      ))}

      {/* Arrow Controls */}
      <button
        className="hero-arrow hero-arrow-left"
        onClick={prev}
        aria-label="Previous slide"
      >
        <FaChevronLeft />
      </button>
      <button
        className="hero-arrow hero-arrow-right"
        onClick={next}
        aria-label="Next slide"
      >
        <FaChevronRight />
      </button>

      {/* Dot Indicators */}
      <div className="hero-indicators">
        {slides.map((_, index) => (
          <button
            key={index}
            className={`hero-dot ${index === current ? "active" : ""}`}
            onClick={() => goTo(index)}
            aria-label={`Slide ${index + 1}`}
          />
        ))}
      </div>

      {/* Slide Counter */}
      <div className="hero-counter">
        <span className="hero-counter-current">{String(current + 1).padStart(2, '0')}</span>
        <span className="hero-counter-sep"> / </span>
        <span className="hero-counter-total">{String(slides.length).padStart(2, '0')}</span>
      </div>

    </section>
  );
}

export default Hero;