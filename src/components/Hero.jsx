import React, { useEffect, useRef, useContext } from 'react';
import { Leaf, Compass, Gift, ArrowRight } from 'lucide-react';
import { AppContext } from '../context/AppContext';

export default function Hero() {
  const imgRef = useRef(null);
  const { setIsFinderOpen } = useContext(AppContext);

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

  const handleShopNow = (e) => {
    e.preventDefault();
    document.getElementById('collection')?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleDiscover = (e) => {
    e.preventDefault();
    setIsFinderOpen(true);
  };

  return (
    <section className="hero-split-section" aria-label="Hero — Crafted to Become Your Signature Scent">

      {/* ── LEFT PANEL — charcoal content ── */}
      <div className="hero-split-left">

        {/* Vertical gold rule */}
        <div className="hero-split-rule" aria-hidden="true" />

        <div className="hero-split-content">

          {/* Eyebrow */}
          <span className="hero-eyebrow animate-hero-fade delay-hero-1">
            <span className="hero-eyebrow-dot" />
            ZENV Parfums — Maison de Haute Parfumerie
          </span>

          {/* Headline */}
          <h1 className="hero-title animate-hero-up delay-hero-2">
            Crafted to<br />
            Become <em>Your</em><br />
            Signature Scent
          </h1>


          {/* Sub-headline */}
          <p className="hero-description animate-hero-up delay-hero-3">
            Premium fragrances designed with timeless
            elegance, finest ingredients, and enduring
            performance for every occasion.
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
      </div>

      {/* ── RIGHT PANEL — product showcase ── */}
      <div className="hero-split-right">
        {/* Blend gradient: dark left edge fades into the image */}
        <div className="hero-split-blend" aria-hidden="true" />

        {/* Product photo */}
        <img
          ref={imgRef}
          src="/assets/hero_perfume_v6.jpg"
          alt="ZENV luxury perfume bottle on marble with white jasmine flowers and amber crystal"
          className="hero-split-img"
        />

        {/* Subtle warm vignette on edges */}
        <div className="hero-split-vignette" aria-hidden="true" />

        {/* Edition label — floating overlay */}
        <div className="hero-edition-label animate-hero-fade delay-hero-4">
          <span className="hero-edition-tag">New Collection</span>
          <span className="hero-edition-name">Santal & Oud — 2025</span>
        </div>
      </div>

    </section>
  );
}
