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
    <section id="discovery" className="section-padding" style={{ paddingBottom: '4rem', paddingTop: '5.5rem' }}>
      <div className="container">
        
        {/* Discovery Sets Section Heading */}
        <header className="os-page-header" style={{ padding: '0 0 4.5rem 0', maxWidth: 'none', margin: '0' }} aria-label="Discovery Sets Section Heading">
          <span className="os-overline">Discovery Sets</span>
          <div className="os-header-rule" aria-hidden="true" />
        </header>

        <div className="promo-section-grid">
          
          {/* Left Promo Card - Discovery Sets */}
          <div className="promo-banner promo-dark promo-discovery-redesign">
            <div className="promo-banner-content">
              <span className="promo-banner-subtitle">The Discovery Collection</span>
              <h3 className="promo-banner-title">Try all five. <br />Choose your signature.</h3>
              <p className="promo-banner-desc">
                Experience the complete ZENV collection in a set of luxury travel sprays. Live with each perfume on your skin before committing to a full-size flacon.
              </p>
              
              <ul className="promo-highlights-list">
                <li><span>Includes 5 travel sprays (8ml each)</span></li>
                <li><span>Get 100% redeemable credit on your next bottle</span></li>
                <li><span>Premium soft-touch display gift box included</span></li>
              </ul>

              <a 
                href="#collection" 
                className="promo-banner-link premium-discovery-btn"
                onClick={handleDiscoveryClick}
              >
                Shop Discovery Set <ArrowRight size={16} />
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
