import React, { useContext, useEffect } from 'react';
import { AppProvider, AppContext } from './context/AppContext';
import Header from './components/Header';
import Hero from './components/Hero';
import Highlights from './components/Highlights';
import CategoryNav from './components/CategoryNav';
import ProductGrid from './components/ProductGrid';
import PromoSection from './components/PromoSection';
import ComboBuilder from './components/ComboBuilder';
import Story from './components/Story';
import Footer from './components/Footer';
import CartDrawer from './components/CartDrawer';
import Checkout from './components/Checkout';
import FragranceFinder from './components/FragranceFinder';
import ProductQuickView from './components/ProductQuickView';
import LegalPages from './components/LegalPages';
import PreLaunchPopup from './components/PreLaunchPopup';
import AdminDashboard from './components/AdminDashboard';
import WhatsAppButton from './components/WhatsAppButton';


function AppContent() {
  const { isAdminMode, setIsAdminMode, isAdminAuthenticated } = useContext(AppContext);

  useEffect(() => {
    // Hidden entry URL trigger: mixed, long words to hide direct admin access
    const secret = 'zenv-secure-portal-auth-gateway-admin-dashboard-2026';
    const path = window.location.pathname;
    const search = window.location.search;
    const hash = window.location.hash;

    if (
      path === `/${secret}` || 
      path.includes(secret) || 
      search.includes(secret) || 
      hash.includes(secret)
    ) {
      setIsAdminMode(true);
      // Clean URL if we are already authenticated
      if (sessionStorage.getItem('zenv_admin_logged_in') === 'true') {
        window.history.replaceState(null, '', window.location.origin);
      }
    }
  }, [setIsAdminMode]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('revealed');
          }
        });
      },
      { threshold: 0.15 }
    );

    const elements = document.querySelectorAll('.reveal-on-scroll');
    elements.forEach((el) => observer.observe(el));

    return () => {
      elements.forEach((el) => observer.unobserve(el));
    };
  }, [isAdminMode]); // Re-observe elements if switching view modes

  if (isAdminMode) {
    return <AdminDashboard />;
  }

  return (
    <>
      {/* Global Branding Navigation & Announcement */}
      <Header />

      <main>
        {/* Hero Section */}
        <Hero />

        {/* Categories Bar */}
        <div className="reveal-on-scroll">
          <CategoryNav />
        </div>

        {/* Dynamic Product Grid */}
        <div className="reveal-on-scroll">
          <ProductGrid />
        </div>

        {/* Why Choose ZENV? — Brand Feature Highlights */}
        <div className="reveal-on-scroll">
          <Highlights />
        </div>

        {/* Promotional Collections Grid */}
        <div className="reveal-on-scroll">
          <PromoSection />
        </div>

        {/* Interactive Custom Combo Builder */}
        <div className="reveal-on-scroll">
          <ComboBuilder />
        </div>

        {/* Brand Narrative, Heritage, Mission & Review Highlights */}
        <div className="reveal-on-scroll">
          <Story />
        </div>
      </main>

      {/* Trust & Guarantee Values bar */}
      <section className="trust-bar">
        <div className="container trust-container">
          <div className="trust-item">
            <span className="trust-icon-wrapper">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--color-gold-deep)" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
              </svg>
            </span>
            <span className="trust-title">Secure Checkout</span>
            <span className="trust-desc">Safe 256-bit SSL encrypted checkout system</span>
          </div>
          <div className="trust-item">
            <span className="trust-icon-wrapper">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--color-gold-deep)" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="1" y="3" width="15" height="13"></rect>
                <polygon points="16 8 20 8 23 11 23 16 16 16 16 8"></polygon>
                <circle cx="5.5" cy="18.5" r="2.5"></circle>
                <circle cx="18.5" cy="18.5" r="2.5"></circle>
              </svg>
            </span>
            <span className="trust-title">Fast Shipping</span>
            <span className="trust-desc">Complimentary dispatch within 24-48 hours</span>
          </div>
          <div className="trust-item">
            <span className="trust-icon-wrapper">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--color-gold-deep)" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
              </svg>
            </span>
            <span className="trust-title">Premium Quality</span>
            <span className="trust-desc">Handcrafted extracts and luxury ingredients</span>
          </div>
          <div className="trust-item">
            <span className="trust-icon-wrapper">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--color-gold-deep)" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
              </svg>
            </span>
            <span className="trust-title">Easy Support</span>
            <span className="trust-desc">Dedicated concierge and priority assistance</span>
          </div>
        </div>
      </section>

      {/* Global Footer */}
      <Footer />

      {/* Global Interactive Overlays & Modals */}
      <CartDrawer />
      <Checkout />
      <FragranceFinder />
      <ProductQuickView />
      <LegalPages />
      <PreLaunchPopup />
      <WhatsAppButton />
    </>
  );
}

function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}

export default App;
