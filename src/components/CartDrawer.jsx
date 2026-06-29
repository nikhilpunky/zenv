import React, { useContext } from 'react';
import { AppContext } from '../context/AppContext';
import { X, Trash2, Plus, Minus, ShoppingBag } from 'lucide-react';

export default function CartDrawer() {
  const {
    cart,
    removeFromCart,
    updateQuantity,
    cartSubtotal,
    cartMRPTotal,
    cartSavings,
    isCartOpen,
    setIsCartOpen,
    setIsCheckoutOpen
  } = useContext(AppContext);

  const handleCheckoutClick = () => {
    setIsCartOpen(false);
    setIsCheckoutOpen(true);
  };

  if (!isCartOpen) return null;

  return (
    <div className="drawer-overlay" onClick={() => setIsCartOpen(false)}>
      <div 
        className={`drawer-panel ${isCartOpen ? 'open' : ''}`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="drawer-header">
          <h2 className="drawer-title">Shopping Bag</h2>
          <button 
            className="drawer-close-btn" 
            onClick={() => setIsCartOpen(false)}
            aria-label="Close Cart"
          >
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        <div className="drawer-body">
          {cart.length === 0 ? (
            <div className="empty-cart-message">
              <ShoppingBag size={48} style={{ color: 'var(--color-gold)', strokeWidth: 1 }} />
              <h3 className="empty-cart-title">Your bag is empty</h3>
              <p className="empty-cart-desc">
                Select from our curated collection of luxury perfumes to start your fragrance journey.
              </p>
              <button 
                className="btn-outline" 
                style={{ padding: '0.8rem 2rem', fontSize: '0.75rem', marginTop: '1rem' }}
                onClick={() => setIsCartOpen(false)}
              >
                Continue Shopping
              </button>
            </div>
          ) : (
            <div className="cart-items-list">
              {cart.map((item) => (
                <div key={item.cartItemId} className="cart-item">
                  
                  {/* Image */}
                  <div className="cart-item-image-wrapper">
                    <img src={item.image} alt={item.name} className="cart-item-img" />
                  </div>

                  {/* Details */}
                  <div className="cart-item-details">
                    <div className="cart-item-header">
                      <h4 className="cart-item-name">{item.name}</h4>
                      <button 
                        className="cart-item-remove-btn"
                        onClick={() => removeFromCart(item.cartItemId)}
                        aria-label={`Remove ${item.name}`}
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>

                    <div className="cart-item-meta">
                      Size: {item.size}
                    </div>

                    {/* Selected combo listing */}
                    {item.selectedFragrances && (
                      <div className="cart-item-combos">
                        Includes: {item.selectedFragrances.map(f => f.name).join(', ')}
                      </div>
                    )}

                    {/* Quantity Selector & Price */}
                    <div className="cart-item-footer">
                      <div className="quantity-selector">
                        <button 
                          className="qty-btn" 
                          onClick={() => updateQuantity(item.cartItemId, item.quantity - 1)}
                          aria-label="Decrease quantity"
                        >
                          <Minus size={12} />
                        </button>
                        <span className="qty-value">{item.quantity}</span>
                        <button 
                          className="qty-btn" 
                          onClick={() => updateQuantity(item.cartItemId, item.quantity + 1)}
                          aria-label="Increase quantity"
                        >
                          <Plus size={12} />
                        </button>
                      </div>

                      <div className="cart-item-pricing">
                        {item.mrp && item.mrp > item.price && (
                          <div className="cart-item-original-price">
                            ₹{item.mrp * item.quantity}
                          </div>
                        )}
                        <div className="cart-item-price">
                          ₹{item.price * item.quantity}
                        </div>
                      </div>
                    </div>

                  </div>

                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {cart.length > 0 && (
          <div className="drawer-footer">
            <div className="summary-row">
              <span>Original MRP</span>
              <span style={{ textDecoration: 'line-through' }}>₹{cartMRPTotal}</span>
            </div>
            
            {cartSavings > 0 && (
              <div className="summary-row summary-savings">
                <span>Launch Saving</span>
                <span>- ₹{cartSavings}</span>
              </div>
            )}
            
            <div className="summary-row">
              <span>Shipping &amp; Delivery</span>
              <span style={{ color: 'green', fontWeight: 500 }}>FREE</span>
            </div>

            <div className="summary-row summary-total">
              <span>Launch Total</span>
              <span>₹{cartSubtotal}</span>
            </div>

            <button 
              className="btn-primary checkout-btn"
              onClick={handleCheckoutClick}
            >
              Secure Checkout &rarr;
            </button>
          </div>
        )}

      </div>
    </div>
  );
}
