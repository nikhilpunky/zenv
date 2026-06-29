import React, { useState, useContext } from 'react';
import { AppContext } from '../context/AppContext';
import { Gift, Check, Plus, Minus } from 'lucide-react';

export default function ComboBuilder() {
  const { products, addToCart } = useContext(AppContext);

  // Filter out the discovery set for individual bottles selection
  const fragrancesList = products.filter(p => p.id !== 'discovery-set');

  // Combo Packages available
  const PACKAGES = {
    COMBO_50ML_2X: {
      id: 'combo-50ml-2x',
      name: '2 × 50ml Combo',
      price: 1999,
      mrp: 4998,
      limit: 2,
      description: 'Choose any two 50ml signature Eau de Parfums of your choice.'
    },
    COMBO_DISC_50ML: {
      id: 'combo-disc-50ml',
      name: 'Discovery + 50ml Combo',
      price: 1599,
      mrp: 3998,
      limit: 1,
      description: 'Receive 1 × Discovery Set plus any one 50ml Eau de Parfum.'
    }
  };

  const [activePackage, setActivePackage] = useState(PACKAGES.COMBO_50ML_2X);
  const [selectedFragrances, setSelectedFragrances] = useState([]);

  const handlePackageChange = (pkg) => {
    setActivePackage(pkg);
    setSelectedFragrances([]); // Reset selection on package switch
  };

  const handleSelectFragrance = (fragrance) => {
    setSelectedFragrances((prev) => {
      // Check current total counts
      if (prev.length >= activePackage.limit) {
        // If limit reached, replace the last select
        const updated = [...prev];
        updated[activePackage.limit - 1] = fragrance;
        return updated;
      }
      return [...prev, fragrance];
    });
  };

  const handleRemoveFragrance = (indexToRemove) => {
    setSelectedFragrances((prev) => prev.filter((_, idx) => idx !== indexToRemove));
  };

  const handleAddComboToCart = () => {
    if (selectedFragrances.length < activePackage.limit) {
      alert(`Please select ${activePackage.limit} fragrance(s) to complete your combo.`);
      return;
    }

    // Build combo cart item structure
    const comboProduct = {
      id: activePackage.id,
      name: activePackage.name,
      price: activePackage.price,
      mrp: activePackage.mrp,
      image: '/assets/gifting_set.png',
      size: activePackage.id === 'combo-50ml-2x' ? '2 × 50ml' : 'Discovery + 50ml',
      type: 'Exclusive Bundle',
      notes: activePackage.id === 'combo-50ml-2x' 
        ? selectedFragrances.map(f => f.name).join(' & ')
        : `Discovery Collection & ${selectedFragrances[0].name}`
    };

    addToCart(comboProduct, 1, selectedFragrances);
    setSelectedFragrances([]);
    alert(`Custom ${activePackage.name} added to cart!`);
  };

  return (
    <section id="combo-builder" className="combo-builder-section">
      <div className="container">
        
        {/* Section Header */}
        <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
          <span className="hero-subtitle">Founder's Special Offers</span>
          <h2 className="combo-main-title">Launch Combo Customizer</h2>
          <p className="combo-description" style={{ maxWidth: '600px', margin: '0 auto' }}>
            Customize your luxury bundle packages. Mix, match, and tailor your fragrances to suit your wardrobe. Prepaid orders only. Limited to the first 100 orders.
          </p>
        </div>

        <div className="combo-container">
          
          {/* Left Side: Combo Package Visual Preview */}
          <div className="combo-visual">
            <span className="combo-badge">Prepaid Discount</span>
            
            <div className="combo-visual-gallery">
              {activePackage.id === 'combo-disc-50ml' && (
                <>
                  <div className="combo-visual-item">
                    <img 
                      src="/assets/discovery_set.png" 
                      alt="Discovery Collection" 
                      className="combo-visual-item-img"
                    />
                    <span style={{ position: 'absolute', bottom: '0.5rem', fontSize: '0.65rem', fontWeight: 600, color: 'var(--color-charcoal-medium)' }}>
                      Discovery Set
                    </span>
                  </div>
                  <span className="combo-visual-plus">+</span>
                </>
              )}

              {/* Individual Custom Slots */}
              {Array.from({ length: activePackage.limit }).map((_, idx) => {
                const selected = selectedFragrances[idx];
                return (
                  <React.Fragment key={idx}>
                    {idx > 0 && <span className="combo-visual-plus">+</span>}
                    <div className="combo-visual-item">
                      {selected ? (
                        <>
                          <img 
                            src={selected.image} 
                            alt={selected.name} 
                            className="combo-visual-item-img" 
                          />
                          <button 
                            className="qty-btn" 
                            style={{ 
                              position: 'absolute', 
                              top: '0.5rem', 
                              right: '0.5rem', 
                              background: 'var(--color-gold-light)', 
                              borderRadius: '50%',
                              width: '20px',
                              height: '20px'
                            }}
                            onClick={() => handleRemoveFragrance(idx)}
                            aria-label={`Remove ${selected.name}`}
                          >
                            &times;
                          </button>
                          <span style={{ position: 'absolute', bottom: '0.5rem', fontSize: '0.65rem', fontWeight: 600, color: 'var(--color-gold-deep)' }}>
                            {selected.name}
                          </span>
                        </>
                      ) : (
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', color: 'var(--color-charcoal-light)' }}>
                          <Gift size={24} style={{ opacity: 0.3, marginBottom: '0.5rem' }} />
                          <span style={{ fontSize: '0.6rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                            Select Perfume
                          </span>
                        </div>
                      )}
                    </div>
                  </React.Fragment>
                );
              })}
            </div>

            <div style={{ marginTop: '2.5rem', textAlign: 'center' }}>
              <span style={{ fontSize: '0.8rem', color: 'var(--color-charcoal-light)' }}>
                {selectedFragrances.length} of {activePackage.limit} selected
              </span>
            </div>
          </div>

          {/* Right Side: Package Selection and Customize grid */}
          <div className="combo-configurator">
            <span className="combo-step-title">Step 1: Choose Your Package</span>
            <div className="combo-package-selector">
              
              <div 
                className={`combo-pkg-card ${activePackage.id === 'combo-50ml-2x' ? 'active' : ''}`}
                onClick={() => handlePackageChange(PACKAGES.COMBO_50ML_2X)}
              >
                <div className="combo-pkg-name">2 × 50ml Combo</div>
                <div className="combo-pkg-price">₹1,999</div>
                <div className="combo-pkg-savings">Save ₹2,999 (MRP ₹4,998)</div>
              </div>

              <div 
                className={`combo-pkg-card ${activePackage.id === 'combo-disc-50ml' ? 'active' : ''}`}
                onClick={() => handlePackageChange(PACKAGES.COMBO_DISC_50ML)}
              >
                <div className="combo-pkg-name">Discovery + 50ml</div>
                <div className="combo-pkg-price">₹1,599</div>
                <div className="combo-pkg-savings">Save ₹2,399 (MRP ₹3,998)</div>
              </div>

            </div>

            <span className="combo-step-title" style={{ marginTop: '1rem' }}>
              Step 2: Choose Your 50ml Bottles
            </span>
            <p style={{ fontSize: '0.8rem', color: 'var(--color-charcoal-medium)', marginBottom: '1rem' }}>
              {activePackage.description}
            </p>
            
            <div className="fragrance-picker-grid">
              {fragrancesList.map((f) => {
                const countInCombo = selectedFragrances.filter(sf => sf.id === f.id).length;
                const isSelected = countInCombo > 0;
                
                return (
                  <div
                    key={f.id}
                    className={`fragrance-picker-card ${isSelected ? 'selected' : ''}`}
                    onClick={() => handleSelectFragrance(f)}
                  >
                    <img src={f.image} alt={f.name} className="fragrance-picker-img" />
                    <span className="fragrance-picker-name">{f.name}</span>
                    <span style={{ fontSize: '0.62rem', color: 'var(--color-charcoal-light)' }}>
                      {f.notes.split('·')[0]}
                    </span>
                    {countInCombo > 0 && (
                      <span className="fragrance-picker-count">
                        {countInCombo}x Selected
                      </span>
                    )}
                  </div>
                );
              })}
            </div>

            <div className="combo-add-action">
              <div>
                <span style={{ fontSize: '0.72rem', textTransform: 'uppercase', color: 'var(--color-charcoal-light)', textDecoration: 'line-through' }}>
                  MRP ₹{activePackage.mrp}
                </span>
                <div style={{ fontSize: '1.8rem', fontWeight: 600, color: 'var(--color-charcoal)' }}>
                  ₹{activePackage.price}
                </div>
              </div>

              <button
                className="btn-primary"
                onClick={handleAddComboToCart}
                disabled={selectedFragrances.length < activePackage.limit}
                style={{ 
                  opacity: selectedFragrances.length < activePackage.limit ? 0.5 : 1,
                  cursor: selectedFragrances.length < activePackage.limit ? 'not-allowed' : 'pointer'
                }}
              >
                Add Combo To Cart
              </button>
            </div>

          </div>

        </div>
      </div>
    </section>
  );
}
