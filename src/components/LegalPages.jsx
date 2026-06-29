import React, { useContext } from 'react';
import { AppContext } from '../context/AppContext';
import { X } from 'lucide-react';

export default function LegalPages() {
  const { activeLegalModal, setActiveLegalModal } = useContext(AppContext);

  if (activeLegalModal === 'none') return null;

  const renderContent = () => {
    switch (activeLegalModal) {
      case 'privacy':
        return (
          <>
            <h2 className="legal-title">Privacy Policy</h2>
            <div className="legal-content">
              <p><strong>Effective Date: June 27, 2026</strong></p>
              <p>At ZENV, we value the trust you place in us when sharing your personal information. This Privacy Policy details how we collect, use, and safeguard your data during your shopping experience.</p>
              
              <h3>1. Information We Collect</h3>
              <p>We collect details you provide directly, including your name, email address, phone number, shipping address, and payment preferences during checkout or subscription.</p>
              
              <h3>2. How We Use Your Data</h3>
              <p>Your details are used solely to process orders, send delivery updates via WhatsApp/Email, respond to client service requests, and send newsletter updates if you opt in. We do not sell or trade your details to third parties.</p>
              
              <h3>3. Payment and Security</h3>
              <p>Transactions are processed via secure, encrypted channels. We do not store credit/debit card numbers on our servers. For support or privacy questions, contact us at <strong>Zenv2212@gmail.com</strong>.</p>
            </div>
          </>
        );
      case 'terms':
        return (
          <>
            <h2 className="legal-title">Terms of Service</h2>
            <div className="legal-content">
              <p><strong>Effective Date: June 27, 2026</strong></p>
              <p>Welcome to ZENV ("we", "our", "ZENV"). By browsing or purchasing from our store, you agree to comply with the terms and conditions outlined below.</p>
              
              <h3>1. Order Acceptance & Pricing</h3>
              <p>Prices displayed are in INR. We reserve the right to modify pricing, special combinations, and launch collections at any time without prior notice. Once the first 100 prepaid launch orders are fulfilled, standard pricing will apply.</p>
              
              <h3>2. Special Launch Combo Orders</h3>
              <p>Launch pricing (e.g. ₹799 for Discovery Collection, ₹1,199 for 50ml, ₹1,999 for 2x50ml combo) is strictly applicable to prepaid transactions. Cash on delivery options are subject to review or cancellation at our discretion.</p>
              
              <h3>3. User Conduct</h3>
              <p>Users must not reproduce, duplicate, copy, or exploit any portion of the service, designs, photography, or copy on this website without explicit written consent from ZENV Parfums.</p>
            </div>
          </>
        );
      case 'refund':
        return (
          <>
            <h2 className="legal-title">Refund & Return Policy</h2>
            <div className="legal-content">
              <p><strong>Effective Date: June 27, 2026</strong></p>
              <p>Our priority is delivering high-quality luxury fragrances. Due to the personal nature of perfumery, we have established guidelines for returns and exchanges.</p>
              
              <h3>1. The Discovery Philosophy</h3>
              <p>We offer our curated 5 × 8ml Discovery Set at a heavily discounted price so you can test five signature blends before buying full 50ml bottles. Because of this, full 50ml bottles are only eligible for returns if they remain sealed, unopened in their original cellophane wrapping.</p>
              
              <h3>2. Eligibility for Returns</h3>
              <p>Sealed items must be returned within 14 days of delivery. Used, sprayed, or opened bottles cannot be returned or refunded. Shipping fees for returns are the responsibility of the customer unless the product arrived damaged.</p>
              
              <h3>3. Damaged or Defective Deliveries</h3>
              <p>If your package arrives leaking, broken, or defective, contact us immediately at <strong>Zenv2212@gmail.com</strong> or WhatsApp <strong>+91 93109 12279</strong> with unpacking video proof to request a complimentary replacement.</p>
            </div>
          </>
        );
      case 'disclaimer':
        return (
          <>
            <h2 className="legal-title">Disclaimer</h2>
            <div className="legal-content">
              <p><strong>Effective Date: June 27, 2026</strong></p>
              <p>The information and products provided by ZENV Parfums are subject to the following disclaimer conditions.</p>
              
              <h3>1. Formulation & Allergens</h3>
              <p>ZENV fragrances are created using premium synthetic and natural perfumery compounds. Everyone's skin chemistry is unique. Certain ingredients may cause minor irritation or allergies in sensitive individuals.</p>
              
              <h3>2. Recommended Usage & Patch Test</h3>
              <p>We strongly recommend performing a small patch test on your wrist or inner elbow and waiting 24 hours before applying the perfume fully. Discontinue use immediately if redness, itching, or irritation occurs. Avoid direct contact with eyes.</p>
              
              <h3>3. Brand Representations</h3>
              <p>ZENV is an independent luxury fragrance developer. Any references to specific fragrance notes, olfactory categories, or moods are representations for marketing purposes and do not guarantee specific psychological or physical effects.</p>
            </div>
          </>
        );
      default:
        return null;
    }
  };

  return (
    <div className="modal-overlay" onClick={() => setActiveLegalModal('none')}>
      <div 
        className="modal-content"
        onClick={(e) => e.stopPropagation()}
        style={{ maxWidth: '780px' }}
      >
        <button 
          className="modal-close-btn" 
          onClick={() => setActiveLegalModal('none')}
          aria-label="Close Modal"
        >
          <X size={18} />
        </button>
        <div className="legal-modal-body">
          {renderContent()}
        </div>
      </div>
    </div>
  );
}
