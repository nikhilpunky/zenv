import React, { useContext } from 'react';
import { AppContext } from '../context/AppContext';
import * as Icons from 'lucide-react';

export default function CategoryNav() {
  const { activeCategory, setActiveCategory, categories } = useContext(AppContext);

  const getIconComponent = (iconName) => {
    return Icons[iconName] || Icons.Tag;
  };

  const handleCategorySelect = (catId) => {
    setActiveCategory(catId);
    const element = document.getElementById('collection');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="category-section" style={{ padding: '3rem 0 1rem', background: '#faf6f0' }}>
      <div className="container" style={{ textAlign: 'center' }}>
        <span style={{ 
          fontSize: '0.72rem', 
          textTransform: 'uppercase', 
          letterSpacing: '0.22em', 
          color: 'var(--color-gold-deep)', 
          fontWeight: 600, 
          display: 'block', 
          marginBottom: '0.6rem' 
        }}>
          Explore Our Collections
        </span>
        <h2 style={{ 
          fontFamily: 'var(--font-serif)', 
          fontSize: '2rem', 
          fontWeight: 400, 
          color: 'var(--color-charcoal)', 
          marginBottom: '2rem' 
        }}>
          Shop Fragrances by Category
        </h2>

        {/* Visual Category Cards Grid */}
        <div className="category-cards-grid">
          {/* Static 'All Fragrances' card */}
          <div 
            className={`category-card ${activeCategory === 'ALL' ? 'active' : ''}`}
            onClick={() => handleCategorySelect('ALL')}
          >
            <img src="/assets/hero_luxury_bg.png" alt="All Fragrances" className="category-card-img" />
            <div className="category-card-overlay" />
            <div className="category-card-content">
              <div className="category-card-icon">
                <Icons.Layers size={22} />
              </div>
              <h3 className="category-card-title">All Fragrances</h3>
            </div>
          </div>

          {Array.isArray(categories) && categories.map((cat) => {
            const IconComponent = getIconComponent(cat.icon);
            const catIdUpper = cat.id.toUpperCase();
            const isActive = activeCategory === catIdUpper;
            return (
              <div 
                key={cat.id} 
                className={`category-card ${isActive ? 'active' : ''}`}
                onClick={() => handleCategorySelect(catIdUpper)}
              >
                <img 
                  src={cat.image || '/assets/product_sample.png'} 
                  alt={cat.label} 
                  className="category-card-img" 
                  onError={(e) => { e.target.src = '/assets/product_sample.png'; }}
                />
                <div className="category-card-overlay" />
                <div className="category-card-content">
                  <div className="category-card-icon">
                    <IconComponent size={22} />
                  </div>
                  <h3 className="category-card-title">{cat.label}</h3>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
