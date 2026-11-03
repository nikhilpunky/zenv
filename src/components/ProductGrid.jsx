import React, { useContext } from 'react';
import { AppContext } from '../context/AppContext';
import { ArrowRight } from 'lucide-react';
import ProductCard from './ProductCard';

export default function ProductGrid() {
  const { 
    products, 
    categories,
    activeCategory, 
    setActiveCategory, 
    searchTerm 
  } = useContext(AppContext);

  // Filter logic
  const filteredProducts = products.filter((product) => {
    // 1. Search Query Filter
    if (searchTerm) {
      const query = searchTerm.toLowerCase();
      const matchName = product.name?.toLowerCase().includes(query);
      const matchNotes = product.notes?.toLowerCase().includes(query);
      const matchDesc = product.description?.toLowerCase().includes(query);
      if (!matchName && !matchNotes && !matchDesc) return false;
    }

    // 2. Category Filter
    if (activeCategory === 'ALL') return true;
    if (activeCategory === 'DISCOVERY') {
      return product.isDiscovery === true || product.category?.toLowerCase() === 'discovery';
    }
    
    // For Oils category: show coming soon if no products, otherwise filter
    if (activeCategory === 'OILS') {
      const hasOils = products.some(p => p.category?.toLowerCase() === 'oils');
      if (!hasOils) return false;
      return product.category?.toLowerCase() === 'oils';
    }

    return product.category && product.category.toLowerCase() === activeCategory.toLowerCase();
  });

  const getCategoryTitle = () => {
    if (activeCategory === 'ALL') return "Featured Fragrances";
    const foundCat = Array.isArray(categories) && categories.find(c => c.id.toUpperCase() === activeCategory);
    if (foundCat) return foundCat.label;
    if (activeCategory === 'WOMEN') return "Feminine Collection";
    if (activeCategory === 'MEN') return "Masculine Collection";
    if (activeCategory === 'UNISEX') return "Unisex Fragrances";
    if (activeCategory === 'DISCOVERY') return "Discovery Sets";
    if (activeCategory === 'OILS') return "Perfume Oils";
    return `${activeCategory.charAt(0) + activeCategory.slice(1).toLowerCase()} Fragrances`;
  };

  return (
    <section id="collection" className="section-padding" style={{ background: 'var(--bg-white)' }}>
      <div className="container">
        {/* Section Header */}
        <div className="section-header">
          <div>
            <span className="hero-subtitle" style={{ marginBottom: '0.5rem', display: 'block' }}>
              VESPERA Signature Range
            </span>
            <h2 className="section-title">
              {getCategoryTitle()}
            </h2>
          </div>
          
          {activeCategory !== 'ALL' && (
            <button 
              className="section-link" 
              onClick={() => setActiveCategory('ALL')}
            >
              View All Collection <ArrowRight size={16} />
            </button>
          )}
        </div>

        {/* Dynamic Product Grid */}
        {activeCategory === 'OILS' && filteredProducts.length === 0 ? (
          <div style={{
            textAlign: 'center',
            padding: '6rem 2rem',
            background: 'var(--bg-ivory)',
            border: '1px solid var(--border-light)',
            borderRadius: '4px'
          }}>
            <h3 className="empty-cart-title" style={{ marginBottom: '1rem' }}>Perfume Oils &amp; Rollers</h3>
            <p className="empty-cart-desc" style={{ maxWidth: '400px', margin: '0 auto 2rem' }}>
              We are currently formulation-testing our premium 10ml organic oil roller series. Enter your details in the newsletter below to receive launch access.
            </p>
            <span style={{
              fontSize: '0.72rem',
              textTransform: 'uppercase',
              letterSpacing: '0.2em',
              fontWeight: 600,
              color: 'var(--color-gold-deep)',
              border: '1px solid var(--color-gold)',
              padding: '0.6rem 1.5rem',
              borderRadius: '2px'
            }}>
              Coming Autumn 2026
            </span>
          </div>
        ) : filteredProducts.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '6rem 2rem' }}>
            <p style={{ color: 'var(--color-charcoal-light)', fontSize: '1rem' }}>
              No signature fragrances match your query: "{searchTerm}"
            </p>
          </div>
        ) : (
          <div className="products-grid">
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
