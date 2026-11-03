import React, { useEffect, useRef, useState, useContext } from 'react';
import { Leaf, Compass, Gift, ArrowRight } from 'lucide-react';
import { AppContext } from '../context/AppContext';

export default function Hero() {
  const imgRef = useRef(null);
  const { setIsFinderOpen, banners } = useContext(AppContext);
  const [activeIndex, setActiveIndex] = useState(0);

  /* Filter active banners */
  const activeBanners = Array.isArray(banners) ? banners.filter(b => b.isActive) : [];

  /* Subtle parallax on the right image panel only */
  useEffect(() => {
    const onScroll = () => {
      const img = imgRef.current;
      if (!img) return;
      img.style.transform = `scale(1.06) translateY(${window.scrollY * 0.12}px)`;
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  /* Slideshow rotation */
  useEffect(() => {
    if (activeBanners.length <= 1) {
      setActiveIndex(0);
      return;
    }
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % activeBanners.length);
    }, 5500);
    return () => clearInterval(interval);
  }, [activeBanners.length]);

  const handleShopNow = (e) => {
    e.preventDefault();
    document.getElementById('collection')?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleDiscover = (e) => {
    e.preventDefault();
    setIsFinderOpen(true);
  };

  // Fallback defaults if no active banners exist yet
  const defaultBanner = {
    id: 'default',
    image: '/assets/hero_perfume_v6.jpg',
    title: 'Crafted to\nBecome Your\nSignature Scent',
    subtitle: 'VESPERA Parfums — Maison de Haute Parfumerie',
    description: 'Premium fragrances designed with timeless elegance, finest ingredients, and enduring performance for every occasion.'
  };

  const activeBanner = activeBanners.length > 0 ? activeBanners[activeIndex] : defaultBanner;

  // Split title lines by newline
  const titleLines = activeBanner.title ? activeBanner.title.split('\n') : ['Crafted to', 'Become Your', 'Signature Scent'];

  return (
    <section className="hero-split-section" aria-label="Hero — Crafted to Become Your Signature Scent">

      {/* ── LEFT PANEL — charcoal content ── */}
      <div className="hero-split-left" key={`left-${activeBanner.id}`}>

        {/* Vertical gold rule */}
        <div className="hero-split-rule" aria-hidden="true" />

        <div className="hero-split-content">

          {/* Eyebrow */}
          <span className="hero-eyebrow animate-hero-fade delay-hero-1">
            <span className="hero-eyebrow-dot" />
            {activeBanner.subtitle}
          </span>

          {/* Headline */}
          <h1 className="hero-title animate-hero-up delay-hero-2">
            {titleLines.map((line, idx) => {
              const parts = line.split(/(your)/i);
              return (
                <React.Fragment key={idx}>
                  {parts.map((part, pIdx) =>
                    part.toLowerCase() === 'your' ? <em key={pIdx}>{part}</em> : part
                  )}
                  {idx < titleLines.length - 1 && <br />}
                </React.Fragment>
              );
            })}
          </h1>

          {/* Sub-headline */}
          <p className="hero-description animate-hero-up delay-hero-3">
            {activeBanner.description}
          </p>

          {/* CTAs */}
          <div className="hero-cta animate-hero-up delay-hero-4">
            <a
              href="#collection"
              id="hero-cta-shop"
              className="hero-btn-primary"
              onClick={handleShopNow}
            >
              Shop Collection
              <ArrowRight size={14} strokeWidth={1.5} className="hero-btn-icon" />
            </a>
            <a
              href="#fragrance-finder"
              id="hero-cta-discover"
              className="hero-btn-secondary"
              onClick={handleDiscover}
            >
              Discover Your Scent
            </a>
          </div>

          <div className="hero-trust animate-hero-fade delay-hero-5">
            <div className="hero-trust-item">
              <Leaf size={21} strokeWidth={1} />
              <span>Finest</span>
              <span>Ingredients</span>
            </div>
            <div className="hero-trust-item">
              <Compass size={21} strokeWidth={1} />
              <span>Long-Lasting</span>
              <span>Scents</span>
            </div>
            <div className="hero-trust-item">
              <Gift size={21} strokeWidth={1} />
              <span>Elegant</span>
              <span>Packaging</span>
            </div>
          </div>

        </div>

        {/* Scroll cue bottom-center of left panel */}
        <div className="hero-scroll-cue animate-hero-fade delay-hero-5" aria-hidden="true">
          <span className="hero-scroll-line" />
          <span className="hero-scroll-text">Scroll</span>
        </div>
        
        {/* Slideshow indicator dots */}
        {activeBanners.length > 1 && (
          <div className="hero-slideshow-dots" style={{ position: 'absolute', bottom: '2rem', left: '13%', display: 'flex', gap: '0.5rem', zIndex: 10 }}>
            {activeBanners.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setActiveIndex(idx)}
                style={{
                  width: '8px',
                  height: '8px',
                  borderRadius: '50%',
                  background: activeIndex === idx ? 'var(--color-gold)' : 'rgba(255,255,255,0.2)',
                  border: 'none',
                  cursor: 'pointer',
                  padding: 0,
                  transition: 'background 0.3s ease'
                }}
                aria-label={`Go to slide ${idx + 1}`}
              />
            ))}
          </div>
        )}
      </div>

      {/* ── RIGHT PANEL — product showcase ── */}
      <div className="hero-split-right" key={`right-${activeBanner.id}`}>
        {/* Blend gradient: dark left edge fades into the image */}
        <div className="hero-split-blend" aria-hidden="true" />

        {/* Product photo */}
        <img
          ref={imgRef}
          src={activeBanner.image}
          alt={activeBanner.title || "VESPERA luxury fragrance presentation"}
          className="hero-split-img"
          onError={(e) => { e.target.src = '/assets/hero_perfume_v6.jpg'; }}
        />

        {/* Subtle warm vignette on edges */}
        <div className="hero-split-vignette" aria-hidden="true" />

        {/* Edition label — floating overlay */}
        <div className="hero-edition-label animate-hero-fade delay-hero-4">
          <span className="hero-edition-tag">Featured Collection</span>
          <span className="hero-edition-name">Maison Vespera</span>
        </div>
      </div>

    </section>
  );
}
