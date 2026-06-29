import React from 'react';
import { Leaf, Compass, Gift, Heart } from 'lucide-react';

export default function Hero() {
  const handleShopNow = (e) => {
    e.preventDefault();
    const element = document.getElementById('collection');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="hero-section">
      {/* Left: Text Block Overlaid directly on cinematic background */}
      <div className="hero-content animate-fade-in">
        <span className="hero-subtitle animate-slide-up delay-1">
          CRAFTED FOR MOMENTS
        </span>
        <h1 className="hero-title animate-slide-up delay-2">
          Scents that<br />
          leave a lasting<br />
          impression.
        </h1>
        <p className="hero-description animate-slide-up delay-3">
          Luxury fragrances, thoughtfully crafted with the finest ingredients from around the world.
        </p>
        <div className="hero-cta animate-slide-up delay-3" style={{ animationDelay: '0.8s' }}>
          <a href="#collection" className="btn-primary" onClick={handleShopNow}>
            EXPLORE COLLECTIONS &nbsp;&rarr;
          </a>
        </div>
      </div>

      {/* Floating Trust highlights on the right of the bottle */}
      <div className="hero-highlights">
        <div className="highlight-badge animate-slide-up delay-1" style={{ animationDelay: '0.5s' }}>
          <Leaf size={22} strokeWidth={1.2} />
          <div className="highlight-text">
            <span className="highlight-tag">Finest</span>
            <span className="highlight-label">Ingredients</span>
          </div>
        </div>
        
        <div className="highlight-badge animate-slide-up delay-2" style={{ animationDelay: '0.7s' }}>
          <Compass size={22} strokeWidth={1.2} />
          <div className="highlight-text">
            <span className="highlight-tag">Long Lasting</span>
            <span className="highlight-label">Scents</span>
          </div>
        </div>
        
        <div className="highlight-badge animate-slide-up delay-3" style={{ animationDelay: '0.9s' }}>
          <Gift size={22} strokeWidth={1.2} />
          <div className="highlight-text">
            <span className="highlight-tag">Elegant</span>
            <span className="highlight-label">Packaging</span>
          </div>
        </div>
        
        <div className="highlight-badge animate-slide-up delay-3" style={{ animationDelay: '1.1s' }}>
          <Heart size={22} strokeWidth={1.2} />
          <div className="highlight-text">
            <span className="highlight-tag">Made With</span>
            <span className="highlight-label">Passion</span>
          </div>
        </div>
      </div>
    </section>
  );
}
