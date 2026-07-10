import React, { useContext, useState } from 'react';
import { AppContext } from '../context/AppContext';
import { Check, ArrowRight } from 'lucide-react';

export default function ProductCard({ product }) {
  const { addToCart, setQuickViewProduct } = useContext(AppContext);
  const [added, setAdded] = useState(false);

  const isOutOfStock = typeof product.stock === 'number' && product.stock <= 0;

  const handleAddToCart = (e) => {
    e.stopPropagation();
    if (isOutOfStock) return;
    addToCart(product, 1);
    setAdded(true);
    setTimeout(() => setAdded(false), 1800);
  };

  return (
    <div className="pc-card animate-slide-up">

      {/* Image */}
      <div
        className="pc-image-wrap"
        onClick={() => setQuickViewProduct(product)}
        role="button"
        tabIndex={0}
        aria-label={`View ${product.name} details`}
      >
        {isOutOfStock ? (
          <span className="pc-badge" style={{ background: 'var(--color-charcoal-medium)', color: '#fff' }}>Sold Out</span>
        ) : (
          <span className="pc-badge">Launch Offer</span>
        )}
        <img
          src={product.images?.[0] || product.image}
          alt={`${product.name} luxury fragrance bottle`}
          className="pc-img"
        />
        {/* Hover scrim */}
        <div className="pc-scrim" aria-hidden="true" />
      </div>

      {/* Info */}
      <div className="pc-info">
        <span className="pc-type">{product.type} · {product.size}</span>

        <h3
          className="pc-title"
          onClick={() => setQuickViewProduct(product)}
          role="button"
          tabIndex={0}
        >
          {product.name}
        </h3>

        <p className="pc-notes">{product.notes}</p>

        {/* Price row */}
        <div className="pc-price-row">
          <span className="pc-mrp">MRP ₹{product.mrp}</span>
          <span className="pc-price">₹{product.price}</span>
        </div>

        {/* CTA */}
        <button
          className={`pc-cta${added ? ' pc-cta--added' : ''}`}
          onClick={handleAddToCart}
          disabled={isOutOfStock}
          aria-label={isOutOfStock ? `${product.name} is Sold Out` : `Add ${product.name} to cart`}
          style={isOutOfStock ? { background: '#f5f5f5', color: '#999', borderColor: '#e0e0e0', cursor: 'not-allowed' } : {}}
        >
          {isOutOfStock ? (
            <span className="pc-cta-inner">
              <span>Sold Out</span>
            </span>
          ) : added ? (
            <span className="pc-cta-inner">
              <Check size={14} strokeWidth={2.5} />
              <span>Added to Cart</span>
            </span>
          ) : (
            <span className="pc-cta-inner">
              <span>Add to Cart</span>
              <ArrowRight size={14} strokeWidth={1.8} className="pc-cta-arrow" />
            </span>
          )}
        </button>
      </div>

    </div>
  );
}
