import React, { useContext, useState } from 'react';
import { AppContext } from '../context/AppContext';
import { Mail, Phone, MapPin } from 'lucide-react';

export default function Footer() {
  const { setActiveLegalModal, setActiveCategory } = useContext(AppContext);
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email.trim()) {
      setSubscribed(true);
      setEmail('');
      setTimeout(() => setSubscribed(false), 5000);
    }
  };

  const handleCategoryClick = (category) => {
    setActiveCategory(category);
    const element = document.getElementById('collection');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <footer className="footer">
      <div className="container">
        {/* Top Footer Grid */}
        <div className="footer-top">
          {/* Newsletter Column */}
          <div className="footer-newsletter">
            <h3 className="newsletter-title">Stay in the know.</h3>
            <p className="newsletter-desc">
              Be the first to discover new fragrance launches, exclusive founder events, and limited-edition releases.
            </p>
            {subscribed ? (
              <p style={{ color: 'var(--color-gold)', fontSize: '0.85rem', fontWeight: 500 }}>
                Thank you for subscribing to ZENV Parfums.
              </p>
            ) : (
              <form className="newsletter-form" onSubmit={handleSubscribe}>
                <input 
                  type="email" 
                  className="newsletter-input" 
                  placeholder="Enter your email address" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
                <button type="submit" className="newsletter-btn" aria-label="Subscribe">
                  Subscribe
                </button>
              </form>
            )}
          </div>

          {/* Column 1: Shop */}
          <div>
            <h4 className="footer-col-title">Shop Collection</h4>
            <ul className="footer-links">
              <li className="footer-link-item">
                <a href="#collection" onClick={() => handleCategoryClick('ALL')}>All Fragrances</a>
              </li>
              <li className="footer-link-item">
                <a href="#collection" onClick={() => handleCategoryClick('WOMEN')}>Women's Perfumes</a>
              </li>
              <li className="footer-link-item">
                <a href="#collection" onClick={() => handleCategoryClick('MEN')}>Men's Perfumes</a>
              </li>
              <li className="footer-link-item">
                <a href="#collection" onClick={() => handleCategoryClick('UNISEX')}>Unisex Fragrances</a>
              </li>
              <li className="footer-link-item">
                <a href="#combo-builder">Launch Combo Offers</a>
              </li>
              <li className="footer-link-item">
                <a href="#discovery">Discovery Collection</a>
              </li>
            </ul>
          </div>

          {/* Column 2: Brand / Contact */}
          <div>
            <h4 className="footer-col-title">Our Story</h4>
            <ul className="footer-links">
              <li className="footer-link-item">
                <a href="#story">About ZENV</a>
              </li>
              <li className="footer-link-item">
                <a href="#story">Craftsmanship</a>
              </li>
              <li className="footer-link-item" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8rem', color: 'rgba(255,255,255,0.6)' }}>
                <Mail size={14} style={{ color: 'var(--color-gold)' }} />
                <span>Zenv2212@gmail.com</span>
              </li>
              <li className="footer-link-item" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8rem', color: 'rgba(255,255,255,0.6)' }}>
                <Phone size={14} style={{ color: 'var(--color-gold)' }} />
                <span>+91 93109 12279</span>
              </li>
              <li className="footer-link-item" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8rem', color: 'rgba(255,255,255,0.6)' }}>
                <MapPin size={14} style={{ color: 'var(--color-gold)' }} />
                <span>New Delhi, India</span>
              </li>
            </ul>
          </div>

          {/* Column 3: Help / Customer Service */}
          <div>
            <h4 className="footer-col-title">Help</h4>
            <ul className="footer-links">
              <li className="footer-link-item">
                <a href="#" onClick={(e) => { e.preventDefault(); alert('FAQ simulation: Standard orders ship within 24-48 hours with express tracking.') }}>Shipping Policy</a>
              </li>
              <li className="footer-link-item">
                <a href="#" onClick={(e) => { e.preventDefault(); setActiveLegalModal('refund') }}>Returns & Refunds</a>
              </li>
              <li className="footer-link-item">
                <a href="#" onClick={(e) => { e.preventDefault(); alert('Order Tracking simulation: Enter tracking ID from WhatsApp order updates.') }}>Track Order</a>
              </li>
              <li className="footer-link-item">
                <a href="#" onClick={(e) => { e.preventDefault(); setActiveLegalModal('privacy') }}>Privacy Policy</a>
              </li>
              <li className="footer-link-item">
                <a href="#" onClick={(e) => { e.preventDefault(); setActiveLegalModal('terms') }}>Terms of Service</a>
              </li>
              <li className="footer-link-item">
                <a href="#" onClick={(e) => { e.preventDefault(); setActiveLegalModal('disclaimer') }}>Disclaimer</a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Footer Details */}
        <div className="footer-bottom">
          <div className="footer-brand">
            <span className="footer-brand-logo">ZENV</span>
            <span className="footer-brand-tagline">Crafted to Be Remembered.</span>
          </div>

          <div className="footer-copyright">
            &copy; {new Date().getFullYear()} ZENV Parfums. All rights reserved. Designed for elegance.
          </div>

          <div className="footer-socials">
            <a 
              href="https://instagram.com/Zenv.perfume" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="footer-social-btn"
              aria-label="Instagram"
            >
              <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
              </svg>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
