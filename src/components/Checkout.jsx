import React, { useContext, useState } from 'react';
import { AppContext } from '../context/AppContext';
import { X, CheckCircle, CreditCard, ShieldCheck } from 'lucide-react';

export default function Checkout() {
  const {
    cart,
    cartSubtotal,
    cartMRPTotal,
    cartSavings,
    clearCart,
    isCheckoutOpen,
    setIsCheckoutOpen
  } = useContext(AppContext);

  const [formData, setFormData] = useState({
    name: 'Yash sagar',
    email: 'Zenv2212@gmail.com',
    phone: '93109 12279',
    address: '',
    city: '',
    state: '',
    zip: ''
  });

  const [paymentMethod, setPaymentMethod] = useState('prepaid');
  const [orderState, setOrderState] = useState('form'); // form, success
  const [orderNumber, setOrderNumber] = useState('');

  if (!isCheckoutOpen) return null;

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handlePlaceOrder = (e) => {
    e.preventDefault();
    if (!formData.address || !formData.city || !formData.state || !formData.zip) {
      alert('Please fill out all address details.');
      return;
    }

    // Generate simulated order number
    const randomOrder = 'ZV-' + Math.floor(100000 + Math.random() * 900000);
    setOrderNumber(randomOrder);
    setOrderState('success');
  };

  const handleSuccessClose = () => {
    clearCart();
    setOrderState('form');
    setIsCheckoutOpen(false);
  };

  const getFinalPrice = () => {
    if (paymentMethod === 'prepaid') {
      return cartSubtotal;
    }
    // If COD, charge original MRP as launch offer states: "on prepaid orders only"
    return cartMRPTotal;
  };

  return (
    <div className="modal-overlay" onClick={() => setIsCheckoutOpen(false)}>
      <div 
        className="modal-content"
        onClick={(e) => e.stopPropagation()}
        style={{ maxWidth: orderState === 'success' ? '540px' : '960px' }}
      >
        <button 
          className="modal-close-btn" 
          onClick={orderState === 'success' ? handleSuccessClose : () => setIsCheckoutOpen(false)}
          aria-label="Close Checkout"
        >
          <X size={18} />
        </button>

        {orderState === 'form' ? (
          <div className="checkout-modal-container">
            
            {/* Form Section */}
            <form className="checkout-form-section" onSubmit={handlePlaceOrder}>
              <h2 className="checkout-title">Checkout</h2>
              
              <h3 className="checkout-section-header">1. Contact Information</h3>
              <div className="form-group-row">
                <div className="form-group">
                  <label className="form-label">Full Name</label>
                  <input 
                    type="text" 
                    name="name" 
                    className="form-input" 
                    value={formData.name} 
                    onChange={handleInputChange} 
                    required 
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Email Address</label>
                  <input 
                    type="email" 
                    name="email" 
                    className="form-input" 
                    value={formData.email} 
                    onChange={handleInputChange} 
                    required 
                  />
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">WhatsApp / Phone Number</label>
                <input 
                  type="tel" 
                  name="phone" 
                  className="form-input" 
                  value={formData.phone} 
                  onChange={handleInputChange} 
                  required 
                />
              </div>

              <h3 className="checkout-section-header" style={{ marginTop: '2rem' }}>2. Delivery Address</h3>
              <div className="form-group">
                <label className="form-label">Street Address</label>
                <input 
                  type="text" 
                  name="address" 
                  className="form-input" 
                  placeholder="Apartment, suite, unit, building, street"
                  value={formData.address} 
                  onChange={handleInputChange} 
                  required 
                />
              </div>
              <div className="form-group-row">
                <div className="form-group">
                  <label className="form-label">City</label>
                  <input 
                    type="text" 
                    name="city" 
                    className="form-input" 
                    value={formData.city} 
                    onChange={handleInputChange} 
                    required 
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">State</label>
                  <input 
                    type="text" 
                    name="state" 
                    className="form-input" 
                    value={formData.state} 
                    onChange={handleInputChange} 
                    required 
                  />
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">ZIP / Postal Code</label>
                <input 
                  type="text" 
                  name="zip" 
                  className="form-input" 
                  value={formData.zip} 
                  onChange={handleInputChange} 
                  required 
                />
              </div>

              <h3 className="checkout-section-header" style={{ marginTop: '2rem' }}>3. Payment Method</h3>
              <div className="payment-method-selector">
                
                <div 
                  className={`payment-method-option ${paymentMethod === 'prepaid' ? 'selected' : ''}`}
                  onClick={() => setPaymentMethod('prepaid')}
                >
                  <div className="payment-radio">
                    {paymentMethod === 'prepaid' && <div className="payment-radio-inner" />}
                  </div>
                  <div className="payment-method-text">
                    <span className="payment-method-title">Instant Prepaid (UPI, Cards, NetBanking)</span>
                    <span className="payment-method-desc" style={{ color: 'green', fontWeight: 500 }}>
                      Founder Launch Pricing Activated (Save ₹{cartSavings})
                    </span>
                  </div>
                </div>

                <div 
                  className={`payment-method-option ${paymentMethod === 'cod' ? 'selected' : ''}`}
                  onClick={() => setPaymentMethod('cod')}
                >
                  <div className="payment-radio">
                    {paymentMethod === 'cod' && <div className="payment-radio-inner" />}
                  </div>
                  <div className="payment-method-text">
                    <span className="payment-method-title">Cash on Delivery (COD)</span>
                    <span className="payment-method-desc" style={{ color: 'red' }}>
                      Regular MRP pricing applies. Launch discounts do not apply.
                    </span>
                  </div>
                </div>

              </div>

              <button type="submit" className="btn-primary" style={{ width: '100%', padding: '1.2rem' }}>
                Place Order — ₹{getFinalPrice()}
              </button>
            </form>

            {/* Summary Section */}
            <div className="checkout-summary-section">
              <h3 className="checkout-section-header">Order Summary</h3>
              
              <div className="checkout-items-list">
                {cart.map((item) => (
                  <div key={item.cartItemId} className="checkout-item-row">
                    <div className="checkout-item-img-wrap">
                      <img src={item.image} alt={item.name} className="checkout-item-img" />
                      <span className="checkout-item-qty-badge">{item.quantity}</span>
                    </div>
                    <div className="checkout-item-info">
                      <div className="checkout-item-name">{item.name}</div>
                      <div className="checkout-item-size">{item.size}</div>
                    </div>
                    <div className="checkout-item-price">
                      ₹{(paymentMethod === 'prepaid' ? item.price : item.mrp) * item.quantity}
                    </div>
                  </div>
                ))}
              </div>

              <div style={{ marginTop: 'auto' }}>
                <div className="summary-row">
                  <span>Items Subtotal</span>
                  <span>₹{paymentMethod === 'prepaid' ? cartMRPTotal : cartMRPTotal}</span>
                </div>
                
                {paymentMethod === 'prepaid' && cartSavings > 0 && (
                  <div className="summary-row summary-savings">
                    <span>Founder Launch Discount</span>
                    <span>- ₹{cartSavings}</span>
                  </div>
                )}

                <div className="summary-row">
                  <span>Shipping &amp; Packaging</span>
                  <span style={{ color: 'green', fontWeight: 500 }}>FREE</span>
                </div>

                <div className="summary-row summary-total" style={{ marginBottom: '1.5rem' }}>
                  <span>Final Amount</span>
                  <span>₹{getFinalPrice()}</span>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', fontSize: '0.72rem', color: 'var(--color-charcoal-light)' }}>
                  <ShieldCheck size={16} style={{ color: 'var(--color-gold-deep)' }} />
                  <span>Your luxury fragrance order transaction is 256-bit encrypted and safe.</span>
                </div>
              </div>

            </div>

          </div>
        ) : (
          // Success State
          <div className="success-modal animate-fade-in">
            <div className="success-icon-wrap">
              <CheckCircle size={40} />
            </div>
            
            <h2 className="success-title">Order Confirmed</h2>
            <p className="success-desc">
              Thank you, <strong>{formData.name}</strong>. Your premium fragrance package is being prepared for shipment at our Delhi crafting facility.
            </p>

            <div className="success-details">
              <div className="success-detail-row">
                <span className="success-detail-label">Order Reference</span>
                <span className="success-detail-value">{orderNumber}</span>
              </div>
              <div className="success-detail-row">
                <span className="success-detail-label">Total Amount Paid</span>
                <span className="success-detail-value" style={{ color: 'var(--color-gold-deep)' }}>
                  ₹{getFinalPrice()}
                </span>
              </div>
              <div className="success-detail-row">
                <span className="success-detail-label">Notification Send To</span>
                <span className="success-detail-value">{formData.phone}</span>
              </div>
              <div className="success-detail-row">
                <span className="success-detail-label">Shipping Destination</span>
                <span className="success-detail-value" style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '200px' }}>
                  {formData.address}, {formData.city}
                </span>
              </div>
            </div>

            <button 
              className="btn-primary" 
              style={{ padding: '1rem 3rem' }}
              onClick={handleSuccessClose}
            >
              Continue Exploring Scents
            </button>
          </div>
        )}

      </div>
    </div>
  );
}
