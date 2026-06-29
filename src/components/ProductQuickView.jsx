import React, { useContext, useState, useEffect } from 'react';
import { AppContext } from '../context/AppContext';
import { X, Plus, Minus, ShoppingBag, Sparkles } from 'lucide-react';

export default function ProductQuickView() {
  const { 
    quickViewProduct, 
    setQuickViewProduct, 
    addToCart 
  } = useContext(AppContext);

  const [qty, setQty] = useState(1);

  // Reset quantity on product switch
  useEffect(() => {
    setQty(1);
  }, [quickViewProduct]);

  if (!quickViewProduct) return null;

  const handleAddToCart = () => {
    addToCart(quickViewProduct, qty);
    setQuickViewProduct(null);
  };

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
          
          {/* Media Showcase */}
          <div className="quickview-media">
            <img 
              src={quickViewProduct.image} 
              alt={quickViewProduct.name} 
              className="quickview-img"
            />
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

            {/* Actions & Pricing */}
            <div className="quickview-footer">
              <div className="quickview-price-container">
                <span className="quickview-mrp">MRP ₹{quickViewProduct.mrp}</span>
                <span className="quickview-price">₹{quickViewProduct.price}</span>
              </div>

              <div className="quickview-actions">
                <div className="quantity-selector">
                  <button 
                    className="qty-btn" 
                    onClick={() => setQty(prev => Math.max(1, prev - 1))}
                    aria-label="Decrease quantity"
                  >
                    <Minus size={12} />
                  </button>
                  <span className="qty-value">{qty}</span>
                  <button 
                    className="qty-btn" 
                    onClick={() => setQty(prev => prev + 1)}
                    aria-label="Increase quantity"
                  >
                    <Plus size={12} />
                  </button>
                </div>

                <button 
                  className="btn-primary"
                  style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', padding: '0.8rem 1.8rem' }}
                  onClick={handleAddToCart}
                >
                  <ShoppingBag size={14} /> Add to bag
                </button>
              </div>
            </div>

          </div>

        </div>
      </div>
    </div>
  );
}
