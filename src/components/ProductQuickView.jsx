import React, { useContext, useState, useEffect } from 'react';
import { AppContext } from '../context/AppContext';
import { X, Plus, Minus, ShoppingBag, Sparkles, ChevronLeft, ChevronRight } from 'lucide-react';

const CERTIFICATION_IMAGE = '/assets/certification.jpg';

export default function ProductQuickView() {
  const { 
    quickViewProduct, 
    setQuickViewProduct, 
    addToCart 
  } = useContext(AppContext);

  const [qty, setQty] = useState(1);
  const [activeSlide, setActiveSlide] = useState(0);

  // Reset quantity and slide on product switch
  useEffect(() => {
    setQty(1);
    setActiveSlide(0);
  }, [quickViewProduct]);

  if (!quickViewProduct) return null;

  const handleAddToCart = () => {
    addToCart(quickViewProduct, qty);
    setQuickViewProduct(null);
  };

  // Image gallery: custom uploaded product images + certification image
  const customImages = Array.isArray(quickViewProduct.images) && quickViewProduct.images.length > 0
    ? quickViewProduct.images.map((img) => ({ src: img, alt: quickViewProduct.name }))
    : [{ src: quickViewProduct.image, alt: quickViewProduct.name }];

  const images = [
    ...customImages,
    { src: quickViewProduct.certImage || CERTIFICATION_IMAGE, alt: `${quickViewProduct.name} — Certifications` },
  ];

  const goNext = () => setActiveSlide((prev) => (prev + 1) % images.length);
  const goPrev = () => setActiveSlide((prev) => (prev - 1 + images.length) % images.length);

  return (
    <div className="modal-overlay" onClick={() => setQuickViewProduct(null)}>
      <div 
        className="modal-content"
        onClick={(e) => e.stopPropagation()}
      >
        <button 
          className="modal-close-btn" 
          onClick={() => setQuickViewProduct(null)}
          aria-label="Close details"
        >
          <X size={18} />
        </button>

        <div className="quickview-container">
          
          {/* Media Showcase — Image Carousel */}
          <div className="quickview-media">
            <div className="qv-carousel">
              <div
                className="qv-carousel-track"
                style={{ transform: `translateX(-${activeSlide * 100}%)` }}
              >
                {images.map((img, i) => (
                  <div className="qv-carousel-slide" key={i}>
                    <img 
                      src={img.src} 
                      alt={img.alt} 
                      className={`quickview-img${i === images.length - 1 ? ' qv-cert-img' : ''}`}
                    />
                  </div>
                ))}
              </div>

              {/* Navigation Arrows */}
              {activeSlide < images.length - 1 && (
                <button
                  className="qv-arrow qv-arrow--right"
                  onClick={goNext}
                  aria-label="View certification"
                >
                  <ChevronRight size={18} />
                </button>
              )}
              {activeSlide > 0 && (
                <button
                  className="qv-arrow qv-arrow--left"
                  onClick={goPrev}
                  aria-label="View product"
                >
                  <ChevronLeft size={18} />
                </button>
              )}

              {/* Slide Indicators */}
              <div className="qv-dots" aria-hidden="true">
                {images.map((_, i) => (
                  <span
                    key={i}
                    className={`qv-dot${activeSlide === i ? ' qv-dot--active' : ''}`}
                    onClick={() => setActiveSlide(i)}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Details & Olfactive Breakdown */}
          <div className="quickview-info">
            <span className="quickview-type">
              {quickViewProduct.type} • {quickViewProduct.size}
            </span>
            <h2 className="quickview-title">{quickViewProduct.name}</h2>
            <p className="quickview-notes">{quickViewProduct.notes}</p>
            
            <p className="quickview-desc">
              {quickViewProduct.longDescription || quickViewProduct.description}
            </p>

            {/* Olfactive Pyramid */}
            {quickViewProduct.olfactiveNotes && (
              <div className="quickview-notes-pyramid">
                <h4 className="pyramid-title">
                  <Sparkles size={12} style={{ display: 'inline', marginRight: '0.4rem', verticalAlign: 'middle' }} />
                  Olfactive Notes Structure
                </h4>
                <div className="pyramid-note-row">
                  <span className="note-label">Top Notes:</span>
                  <span className="note-values">{quickViewProduct.olfactiveNotes.top}</span>
                </div>
                <div className="pyramid-note-row">
                  <span className="note-label">Heart Notes:</span>
                  <span className="note-values">{quickViewProduct.olfactiveNotes.heart}</span>
                </div>
                <div className="pyramid-note-row">
                  <span className="note-label">Base Notes:</span>
                  <span className="note-values">{quickViewProduct.olfactiveNotes.base}</span>
                </div>
              </div>
            )}

            {/* Premium Scent Profiler Details */}
            <div className="quickview-perfume-spec-grid">
              <div className="spec-item">
                <span className="spec-label">Longevity</span>
                <span className="spec-value">{quickViewProduct.longevity || '8+ Hours'}</span>
              </div>
              <div className="spec-item">
                <span className="spec-label">Projection</span>
                <span className="spec-value">{quickViewProduct.projection || 'Moderate'}</span>
              </div>
              <div className="spec-item">
                <span className="spec-label">Best Occasion</span>
                <span className="spec-value">{quickViewProduct.occasion || 'Versatile'}</span>
              </div>
            </div>

            {quickViewProduct.howToUse && (
              <div className="quickview-how-to-use">
                <h4 className="pyramid-title">How To Use & Ritual</h4>
                <p className="how-to-use-text">{quickViewProduct.howToUse}</p>
              </div>
            )}

            {/* Actions & Pricing */}
            {/* Stock Level indicator */}
            <div style={{ margin: '1rem 0', fontSize: '0.85rem', borderTop: '1px solid var(--border-light)', paddingTop: '1rem' }}>
              <span style={{ fontWeight: 600, color: 'var(--color-charcoal-medium)' }}>Inventory Status: </span>
              {typeof quickViewProduct.stock === 'number' && quickViewProduct.stock <= 0 ? (
                <span style={{ color: '#c62828', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Out of Stock</span>
              ) : typeof quickViewProduct.stock === 'number' && quickViewProduct.stock < 5 ? (
                <span style={{ color: '#ef6c00', fontWeight: 600 }}>Only {quickViewProduct.stock} left in stock - Order Soon!</span>
              ) : (
                <span style={{ color: '#2e7d32', fontWeight: 600 }}>In Stock ({quickViewProduct.stock || 15} available)</span>
              )}
            </div>

            <div className="quickview-footer">
              <div className="quickview-price-container">
                <span className="quickview-mrp">MRP ₹{quickViewProduct.mrp}</span>
                <span className="quickview-price">₹{quickViewProduct.price}</span>
              </div>

              <div className="quickview-actions">
                <div className="quantity-selector" style={typeof quickViewProduct.stock === 'number' && quickViewProduct.stock <= 0 ? { opacity: 0.5, pointerEvents: 'none' } : {}}>
                  <button 
                    className="qty-btn" 
                    onClick={() => setQty(prev => Math.max(1, prev - 1))}
                    aria-label="Decrease quantity"
                    disabled={typeof quickViewProduct.stock === 'number' && quickViewProduct.stock <= 0}
                  >
                    <Minus size={12} />
                  </button>
                  <span className="qty-value">{qty}</span>
                  <button 
                    className="qty-btn" 
                    onClick={() => setQty(prev => prev + 1)}
                    aria-label="Increase quantity"
                    disabled={typeof quickViewProduct.stock === 'number' && quickViewProduct.stock <= 0}
                  >
                    <Plus size={12} />
                  </button>
                </div>

                <button 
                  className="btn-primary"
                  style={typeof quickViewProduct.stock === 'number' && quickViewProduct.stock <= 0
                    ? { display: 'flex', alignItems: 'center', gap: '0.6rem', padding: '0.8rem 1.8rem', background: '#e0e0e0', color: '#999', border: '1px solid #e0e0e0', cursor: 'not-allowed' }
                    : { display: 'flex', alignItems: 'center', gap: '0.6rem', padding: '0.8rem 1.8rem' }
                  }
                  onClick={handleAddToCart}
                  disabled={typeof quickViewProduct.stock === 'number' && quickViewProduct.stock <= 0}
                >
                  <ShoppingBag size={14} /> {typeof quickViewProduct.stock === 'number' && quickViewProduct.stock <= 0 ? 'Sold Out' : 'Add to bag'}
                </button>
              </div>
            </div>

          </div>

        </div>
      </div>
    </div>
  );
}
