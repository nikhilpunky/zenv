import React from 'react';
import { AppProvider } from './context/AppContext';
import Header from './components/Header';
import Hero from './components/Hero';
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

function App() {
  return (
    <AppProvider>
      {/* Global Branding Navigation & Announcement */}
      <Header />

      <main>
        {/* Hero Section */}
        <Hero />

        {/* Categories Bar */}
        <CategoryNav />

        {/* Dynamic Product Grid */}
        <ProductGrid />

        {/* Promotional Collections Grid */}
        <PromoSection />

        {/* Interactive Custom Combo Builder */}
        <ComboBuilder />

        {/* Brand Narrative, Heritage, Mission & Review Highlights */}
        <Story />
      </main>

      {/* Trust & Guarantee Values bar */}
      <section className="trust-bar">
        <div className="container trust-container">
          <div className="trust-item">
            <span className="trust-title">Free Shipping</span>
            <span className="trust-desc">On all prepaid orders nationwide</span>
          </div>
          <div className="trust-item">
            <span className="trust-title">Complimentary Samples</span>
            <span className="trust-desc">Included inside every package</span>
          </div>
          <div className="trust-item">
            <span className="trust-title">Easy Returns</span>
            <span className="trust-desc">Hassle-free 14-day replacement</span>
          </div>
          <div className="trust-item">
            <span className="trust-title">Secure Checkout</span>
            <span className="trust-desc">Safe 256-bit encrypted transactions</span>
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
    </AppProvider>
  );
}

export default App;
