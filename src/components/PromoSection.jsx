import React, { useContext } from 'react';
import { AppContext } from '../context/AppContext';
import { ArrowRight } from 'lucide-react';

export default function PromoSection() {
  const { setActiveCategory } = useContext(AppContext);

  const handleDiscoveryClick = (e) => {
    e.preventDefault();
    setActiveCategory('DISCOVERY');
    const element = document.getElementById('collection');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleGiftingClick = (e) => {
    e.preventDefault();
    const element = document.getElementById('combo-builder');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section id="discovery" className="section-padding" style={{ paddingBottom: '4rem' }}>
      <div className="container">
        <div className="promo-section-grid">
          
          {/* Left Promo Card - Discovery Sets */}
          <div className="promo-banner promo-dark">
            <div className="promo-banner-content">
              <span className="promo-banner-subtitle">Discovery Collection</span>
              <h3 className="promo-banner-title">Find your signature scent.</h3>
              <p className="promo-banner-desc">
                Explore our curated sets of travel sprays and find the fragrance that's uniquely yours. Sample multiple blends on your skin before choosing a full-sized bottle.
              </p>
              <a 
                href="#collection" 
                className="promo-banner-link"
                onClick={handleDiscoveryClick}
              >
                Shop Discovery Sets <ArrowRight size={16} />
              </a>
            </div>
            <div className="promo-banner-image">
              <img 
                src="/assets/discovery_set.png" 
                alt="ZENV Luxury Perfume Discovery Vials Set" 
                className="promo-banner-img"
              />
            </div>
          </div>

          {/* Right Promo Card - Gift Sets */}
          <div className="promo-banner promo-light">
            <div className="promo-banner-content">
              <span className="promo-banner-subtitle">The Art of Gifting</span>
              <h3 className="promo-banner-title">Gifts that speak elegance.</h3>
              <p className="promo-banner-desc">
                Beautifully wrapped, thoughtfully chosen. Create a personalized combo package to present the ultimate olfactory gift to those who value modern luxury.
              </p>
              <a 
                href="#combo-builder" 
                className="promo-banner-link"
                onClick={handleGiftingClick}
              >
                Shop Gift Combos <ArrowRight size={16} />
              </a>
            </div>
            <div className="promo-banner-image">
              <img 
                src="/assets/gifting_set.png" 
                alt="ZENV Champagne Gold Gift Package" 
                className="promo-banner-img"
              />
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
