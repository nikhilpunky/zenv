import React, { useContext, useState } from 'react';
import { AppContext } from '../context/AppContext';
import { X, CheckCircle, CreditCard, ShieldCheck } from 'lucide-react';

const loadRazorpayScript = () => {
  return new Promise((resolve) => {
    if (window.Razorpay) {
      resolve(true);
      return;
    }
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

export default function Checkout() {
  const {
    cart,
    cartSubtotal,
    cartMRPTotal,
    cartSavings,
    clearCart,
    isCheckoutOpen,
    setIsCheckoutOpen,
    coupons,
    appliedCoupon,
    setAppliedCoupon
  } = useContext(AppContext);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address1: '',
    address2: '',
    landmark: '',
    city: '',
    state: '',
    pincode: ''
  });

  const [paymentMethod, setPaymentMethod] = useState('prepaid');
  const [orderState, setOrderState] = useState('form'); // form, success
  const [orderNumber, setOrderNumber] = useState('');

  // Coupon UI States
  const [couponInput, setCouponInput] = useState('');
  const [couponError, setCouponError] = useState('');
  const [couponSuccess, setCouponSuccess] = useState('');

  const [isServiceable, setIsServiceable] = useState(true);
  const [checkingServiceability, setCheckingServiceability] = useState(false);

  if (!isCheckoutOpen) return null;

  const checkPincodeServiceability = async (pin) => {
    if (!pin || pin.length !== 6) return;
    setCheckingServiceability(true);
    try {
      const res = await fetch(`/api/serviceability?pincode=${pin}`);
      const data = await res.json();
      if (data && typeof data.serviceable === 'boolean') {
        setIsServiceable(data.serviceable);
      } else {
        setIsServiceable(true);
      }
    } catch (err) {
      console.error('Serviceability check failed:', err);
      setIsServiceable(true); // fallback true on network error
    } finally {
      setCheckingServiceability(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => {
      const updated = { ...prev, [name]: value };
      
      if (name === 'pincode') {
        const cleanVal = value.replace(/\D/g, '').slice(0, 6);
        updated.pincode = cleanVal;
        
        if (cleanVal.length === 6 && paymentMethod === 'prepaid') {
          checkPincodeServiceability(cleanVal);
        } else {
          setIsServiceable(true);
        }
      }
      return updated;
    });
  };

  const handlePaymentMethodChange = (method) => {
    setPaymentMethod(method);
    if (method === 'prepaid') {
      if (formData.pincode.length === 6) {
        checkPincodeServiceability(formData.pincode);
      } else {
        setIsServiceable(true);
      }
    } else {
      setIsServiceable(true);
    }
  };

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    if (!formData.address1 || !formData.city || !formData.state || !formData.pincode) {
      alert('Please fill out all required address details.');
      return;
    }

    if (paymentMethod === 'prepaid') {
      if (!isServiceable) {
        alert("Sorry, we currently don't deliver to this pincode.");
        return;
      }

      const loaded = await loadRazorpayScript();
      if (!loaded) {
        alert('Failed to load Razorpay SDK. Please check your internet connection and try again.');
        return;
      }

      const keyId = import.meta.env.VITE_RAZORPAY_KEY_ID;
      if (!keyId) {
        alert('Razorpay Key ID is not configured. Please check your environment configuration.');
        return;
      }

      const fullAddress = `${formData.address1}${formData.address2 ? ', ' + formData.address2 : ''}${formData.landmark ? ' (Landmark: ' + formData.landmark + ')' : ''}, ${formData.city}, ${formData.state} - ${formData.pincode}`;
      const randomOrder = 'ZV-' + Math.floor(100000 + Math.random() * 900000);

      const options = {
        key: keyId,
        amount: getFinalPrice() * 100, // Amount in paise
        currency: 'INR',
        name: 'ZENV',
        description: 'Luxury Fragrance Order',
        image: '/assets/discovery_set.png',
        handler: function (response) {
          setOrderNumber(randomOrder);
          setOrderState('success');
        },
        prefill: {
          name: formData.name,
          email: formData.email,
          contact: formData.phone
        },
        notes: {
          order_reference: randomOrder,
          name: formData.name.substring(0, 255),
          email: formData.email.substring(0, 255),
          phone: formData.phone.substring(0, 50),
          address: fullAddress.substring(0, 255),
          pincode: formData.pincode.substring(0, 10),
          city: formData.city.substring(0, 100),
          state: formData.state.substring(0, 100),
          items: cart.map(item => `${item.name} (${item.size}) x ${item.quantity}`).join(', ').substring(0, 255),
          itemDetails: cart.map(item => `${item.name}|${item.size}|${item.quantity}|${item.price}`).join(';').substring(0, 255),
          coupon_code: appliedCoupon ? appliedCoupon.code : '',
          discount_amount: String(getCouponDiscount())
        },
        theme: {
          color: '#B38E34' // matches --color-gold-deep
        }
      };

      try {
        const rzp = new window.Razorpay(options);
        rzp.open();
      } catch (err) {
        console.error('Razorpay initialization failed:', err);
        alert('Could not initialize payment window. Please try again.');
      }
    } else {
      // COD flow
      const randomOrder = 'ZV-' + Math.floor(100000 + Math.random() * 900000);
      setOrderNumber(randomOrder);
      
      const fullAddress = `${formData.address1}${formData.address2 ? ', ' + formData.address2 : ''}${formData.landmark ? ' (Landmark: ' + formData.landmark + ')' : ''}, ${formData.city}, ${formData.state} - ${formData.pincode}`;

      // Notify the server about COD order so emails are dispatched
      try {
        fetch('/api/cod-order', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            order_reference: randomOrder,
            name: formData.name,
            email: formData.email,
            phone: formData.phone,
            address: fullAddress,
            pincode: formData.pincode,
            city: formData.city,
            state: formData.state,
            items: cart.map(item => `${item.name} (${item.size}) x ${item.quantity}`).join(', '),
            itemDetails: cart.map(item => `${item.name}|${item.size}|${item.quantity}|${item.price}`).join(';'),
            amount: getFinalPrice(),
            coupon_code: appliedCoupon ? appliedCoupon.code : '',
            discount_amount: getCouponDiscount()
          })
        }).catch(err => {
          console.error('Failed executing COD order notification POST:', err);
        });
      } catch (err) {
        console.error('Failed to notify server about COD order:', err);
      }

      setOrderState('success');

      // Construct WhatsApp message
      const itemsList = cart.map(item => `- ${item.name} (${item.size}) x ${item.quantity} - ₹${(paymentMethod === 'prepaid' ? item.price : item.mrp) * item.quantity}`).join('\n');
      
      const couponWaSection = appliedCoupon 
        ? `\n*Coupon Applied:* ${appliedCoupon.code} (-₹${getCouponDiscount()})\n`
        : '';
      
      const whatsappMessage = `📦 *NEW COD ORDER CONFIRMATION* 📦\n\n` +
        `*Order Reference:* ${randomOrder}\n` +
        `*Customer Name:* ${formData.name}\n` +
        `*Customer Phone:* ${formData.phone}\n` +
        `${formData.email ? '*Email:* ' + formData.email + '\n' : ''}\n` +
        `*Shipping Destination:*\n` +
        `Address Line 1: ${formData.address1}\n` +
        `${formData.address2 ? 'Address Line 2: ' + formData.address2 + '\n' : ''}` +
        `${formData.landmark ? 'Landmark: ' + formData.landmark + '\n' : ''}` +
        `City: ${formData.city}\n` +
        `State: ${formData.state}\n` +
        `Pincode: ${formData.pincode}\n\n` +
        `*Order Summary:*\n${itemsList}\n${couponWaSection}\n` +
        `*Total Amount:* ₹${getFinalPrice()}\n` +
        `*Payment Method:* Cash on Delivery (COD)`;

      const waUrl = `https://wa.me/919310912279?text=${encodeURIComponent(whatsappMessage)}`;
      window.open(waUrl, '_blank');
    }
  };

  const handleSuccessClose = () => {
    clearCart();
    setAppliedCoupon(null);
    setOrderState('form');
    setIsCheckoutOpen(false);
  };

  const getCouponDiscount = () => {
    if (!appliedCoupon) return 0;
    const base = paymentMethod === 'prepaid' ? cartSubtotal : cartMRPTotal;
    let discount = 0;
    if (appliedCoupon.type === 'percentage') {
      discount = Math.round((base * appliedCoupon.value) / 100);
    } else {
      discount = appliedCoupon.value;
    }
    return Math.min(discount, base);
  };

  const getFinalPrice = () => {
    const base = paymentMethod === 'prepaid' ? cartSubtotal : cartMRPTotal;
    const discount = getCouponDiscount();
    return Math.max(0, base - discount);
  };

  const handleApplyCoupon = (e) => {
    e.preventDefault();
    setCouponError('');
    setCouponSuccess('');

    const trimmedInput = couponInput.trim().toUpperCase();
    if (!trimmedInput) {
      setCouponError('Please enter a coupon code.');
      return;
    }

    const coupon = coupons.find(c => c.code === trimmedInput);

    if (!coupon) {
      setCouponError('Invalid coupon code.');
      return;
    }

    if (!coupon.isActive) {
      setCouponError('This coupon is no longer active.');
      return;
    }

    if (cartSubtotal < coupon.minSubtotal) {
      setCouponError(`Minimum purchase of ₹${coupon.minSubtotal} required for this coupon.`);
      return;
    }

    setAppliedCoupon(coupon);
    setCouponSuccess(`Coupon "${coupon.code}" applied successfully!`);
    setCouponInput('');
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    setCouponError('');
    setCouponSuccess('');
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
                <label className="form-label">Address Line 1</label>
                <input 
                  type="text" 
                  name="address1" 
                  className="form-input" 
                  placeholder="Apartment, suite, unit, building, street"
                  value={formData.address1} 
                  onChange={handleInputChange} 
                  required 
                />
              </div>
              <div className="form-group">
                <label className="form-label">Address Line 2 (Optional)</label>
                <input 
                  type="text" 
                  name="address2" 
                  className="form-input" 
                  placeholder="Area, colony, road, sector"
                  value={formData.address2} 
                  onChange={handleInputChange} 
                />
              </div>
              <div className="form-group">
                <label className="form-label">Landmark (Optional but recommended)</label>
                <input 
                  type="text" 
                  name="landmark" 
                  className="form-input" 
                  placeholder="E.g. Near metro station, opposite park"
                  value={formData.landmark} 
                  onChange={handleInputChange} 
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
                <label className="form-label">Pincode</label>
                <input 
                  type="text" 
                  name="pincode" 
                  className="form-input" 
                  placeholder="6-digit PIN code"
                  value={formData.pincode} 
                  onChange={handleInputChange} 
                  required 
                />
                {checkingServiceability && (
                  <div style={{ fontSize: '0.75rem', color: '#B38E34', marginTop: '0.25rem' }}>
                    Checking serviceability with Delhivery...
                  </div>
                )}
                {!isServiceable && paymentMethod === 'prepaid' && (
                  <div style={{ fontSize: '0.75rem', color: '#d32f2f', marginTop: '0.25rem', fontWeight: '500' }}>
                    Sorry, we currently don't deliver to this pincode.
                  </div>
                )}
              </div>

              <h3 className="checkout-section-header" style={{ marginTop: '2rem' }}>3. Payment Method</h3>
              <div className="payment-method-selector">
                
                <div 
                  className={`payment-method-option ${paymentMethod === 'prepaid' ? 'selected' : ''}`}
                  onClick={() => handlePaymentMethodChange('prepaid')}
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
                  onClick={() => handlePaymentMethodChange('cod')}
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

              <button 
                type="submit" 
                className="btn-primary" 
                style={{ 
                  width: '100%', 
                  padding: '1.2rem',
                  backgroundColor: (!isServiceable && paymentMethod === 'prepaid') ? '#8c8c8c' : '', 
                  cursor: (!isServiceable && paymentMethod === 'prepaid') ? 'not-allowed' : 'pointer'
                }}
                disabled={!isServiceable && paymentMethod === 'prepaid'}
              >
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

              {/* Coupon Code Input */}
              <div className="checkout-coupon-container" style={{ margin: '1.5rem 0 2rem', paddingBottom: '1.5rem', borderBottom: '1px solid var(--border-light)' }}>
                {!appliedCoupon ? (
                  <form onSubmit={handleApplyCoupon} style={{ display: 'flex', gap: '0.5rem', flexDirection: 'column' }}>
                    <label className="form-label" style={{ fontSize: '0.7rem', color: 'var(--color-charcoal-medium)' }}>Have a Coupon Code?</label>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <input
                        type="text"
                        className="form-input"
                        placeholder="ENTER COUPON CODE"
                        value={couponInput}
                        onChange={(e) => {
                          setCouponInput(e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, ''));
                          setCouponError('');
                        }}
                        style={{ textTransform: 'uppercase', flexGrow: 1, padding: '0.6rem 0.8rem', fontSize: '0.85rem' }}
                      />
                      <button
                        type="submit"
                        className="btn-primary"
                        style={{ padding: '0.6rem 1.2rem', fontSize: '0.8rem', width: 'auto', background: 'var(--color-charcoal)', borderColor: 'var(--color-charcoal)' }}
                      >
                        Apply
                      </button>
                    </div>
                    {couponError && (
                      <div style={{ fontSize: '0.75rem', color: '#c62828', marginTop: '0.25rem', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                        <span>⚠️</span> {couponError}
                      </div>
                    )}
                  </form>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                    <span className="form-label" style={{ fontSize: '0.7rem', color: 'var(--color-charcoal-medium)' }}>Applied Coupon</span>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'var(--bg-white)', border: '1px solid #bbf7d0', padding: '0.5rem 0.8rem', borderRadius: '4px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexGrow: 1 }}>
                        <span style={{ fontSize: '1rem' }}>🎉</span>
                        <div>
                          <strong style={{ fontSize: '0.85rem', color: '#166534', fontFamily: 'monospace' }}>{appliedCoupon.code}</strong>
                          <div style={{ fontSize: '0.7rem', color: '#15803d' }}>
                            {appliedCoupon.type === 'percentage' ? `${appliedCoupon.value}% discount applied` : `₹${appliedCoupon.value} discount applied`}
                          </div>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={handleRemoveCoupon}
                        style={{ background: 'none', border: 'none', color: '#c62828', fontSize: '0.75rem', fontWeight: '600', cursor: 'pointer', textDecoration: 'underline', padding: '0.2rem' }}
                      >
                        Remove
                      </button>
                    </div>
                    {couponSuccess && (
                      <div style={{ fontSize: '0.72rem', color: '#15803d', marginTop: '0.1rem' }}>
                        {couponSuccess}
                      </div>
                    )}
                  </div>
                )}
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

                {appliedCoupon && getCouponDiscount() > 0 && (
                  <div className="summary-row" style={{ color: '#c62828', fontWeight: 500 }}>
                    <span>Coupon Discount ({appliedCoupon.code})</span>
                    <span>- ₹{getCouponDiscount()}</span>
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
                  {formData.address1}, {formData.city}
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
