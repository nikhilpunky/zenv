import React, { useContext } from 'react';
import { AppContext } from '../context/AppContext';
import { Plus } from 'lucide-react';

export default function ProductCard({ product }) {
  const { addToCart, setQuickViewProduct } = useContext(AppContext);

  const handleAddToCart = (e) => {
    e.stopPropagation(); // Avoid triggering Quick View
    addToCart(product, 1);
  };

  return (
    <div className="product-card animate-slide-up">
      {/* Product Image Wrapper */}
      <div 
        className="product-card-image-wrapper" 
        onClick={() => setQuickViewProduct(product)}
      >
        {/* Launch Sale Tag */}
        <span className="product-card-tag">Launch Offer</span>
        
        <img 
          src={product.image} 
          alt={`${product.name} Luxury Fragrance Bottle`} 
          className="product-card-img"
        />
      </div>

      {/* Product Information */}
      <div className="product-card-info">
        <span className="product-card-type">{product.type} • {product.size}</span>
        
        <h3 
          className="product-card-title"
          onClick={() => setQuickViewProduct(product)}
        >
          {product.name}
        </h3>
        
        <p className="product-card-notes">
          {product.notes}
        </p>

        {/* Pricing & Add to Cart Action */}
        <div className="product-card-footer">
          <div className="product-card-price-container">
            <span className="product-card-mrp">MRP ₹{product.mrp}</span>
            <span className="product-card-price">₹{product.price}</span>
          </div>
          
          <button 
            className="product-card-add-btn" 
            onClick={handleAddToCart}
            title="Add to Cart"
            aria-label={`Add ${product.name} to Cart`}
          >
            <Plus size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}
