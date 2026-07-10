import React, { useContext, useState } from 'react';
import { AppContext } from '../context/AppContext';
import { Search, User, ShoppingBag, Menu, X } from 'lucide-react';

export default function Header() {
  const {
    cartItemCount,
    setIsCartOpen,
    isSearchOpen,
    setIsSearchOpen,
    searchTerm,
    setSearchTerm,
    setIsFinderOpen
  } = useContext(AppContext);

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [barDismissed, setBarDismissed] = useState(false);
  const [barBtnPressed, setBarBtnPressed] = useState(false);

  const handleScrollToSection = (sectionId) => {
    setIsMobileMenuOpen(false);
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleBarClaim = () => {
    setBarBtnPressed(true);
    setTimeout(() => {
      setBarBtnPressed(false);
      document.getElementById('collection')?.scrollIntoView({ behavior: 'smooth' });
    }, 140);
  };

  return (
    <>
      {/* Premium Announcement Bar */}
      {!barDismissed && (
        <div className="announcement-bar-premium" role="banner">
          {/* Marquee track */}
          <div className="annbar-marquee-wrapper" aria-hidden="true">
            <div className="annbar-marquee-track">
              {[...Array(6)].map((_, i) => (
                <span key={i} className="annbar-marquee-item">
                  <svg className="annbar-gift-icon" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 12 20 22 4 22 4 12" />
                    <rect x="2" y="7" width="20" height="5" />
                    <line x1="12" y1="22" x2="12" y2="7" />
                    <path d="M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7z" />
                    <path d="M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z" />
                  </svg>
                  PRE-LAUNCH OFFER FOR THE FIRST 100 CUSTOMERS
                  <span className="annbar-dot">✦</span>
                  EXCLUSIVE DISCOUNTS &amp; EARLY ACCESS
                  <span className="annbar-dot">✦</span>
                </span>
              ))}
            </div>
          </div>

          {/* Right-side CTA */}
          <div className="annbar-right">
            <button
              id="annbar-claim-btn"
              className={`annbar-cta-btn${barBtnPressed ? ' annbar-cta-btn--pressed' : ''}`}
              onClick={handleBarClaim}
              aria-label="Claim exclusive pre-launch offer"
            >
              <span className="annbar-cta-shimmer" aria-hidden="true" />
              <span className="annbar-cta-text">Claim Offer Now</span>
            </button>
            <button
              className="annbar-dismiss-btn"
              onClick={() => setBarDismissed(true)}
              aria-label="Dismiss announcement"
            >
              <X size={14} strokeWidth={1.5} />
            </button>
          </div>
        </div>
      )}

      {/* Main Sticky Header */}
      <header className="navbar-header">
        <div className="container navbar-container">
          {/* Mobile Menu Icon */}
          <button 
            className="mobile-menu-toggle" 
            onClick={() => setIsMobileMenuOpen(true)}
            aria-label="Open Menu"
          >
            <Menu size={24} />
          </button>

          {/* Left: Brand Logo */}
          <a href="#" className="nav-logo" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
            ZENV
          </a>

          {/* Center: Navigation Links */}
          <nav className="nav-links">
            <a href="#collection" className="nav-link" onClick={() => handleScrollToSection('collection')}>
              Shop
            </a>
            <a href="#discovery" className="nav-link" onClick={() => handleScrollToSection('discovery')}>
              Discovery Sets
            </a>
            <a href="#combo-builder" className="nav-link" onClick={() => handleScrollToSection('combo-builder')}>
              Launch Combos
            </a>
            <a 
              href="#finder" 
              className="nav-link" 
              onClick={(e) => {
                e.preventDefault();
                setIsFinderOpen(true);
              }}
            >
              Scent Finder
            </a>
            <a href="#story" className="nav-link" onClick={() => handleScrollToSection('story')}>
              Our Story
            </a>
          </nav>

          {/* Right: Actions / Icons */}
          <div className="nav-icons">
            <button 
              className="nav-icon-btn" 
              onClick={() => setIsSearchOpen(!isSearchOpen)}
              aria-label="Search"
            >
              <Search size={20} />
            </button>
            
            <button 
              className="nav-icon-btn" 
              onClick={() => alert('Account dashboard simulation: Welcome Yash Sagar!')}
              aria-label="Account"
            >
              <User size={20} />
            </button>

            <button 
              className="nav-icon-btn" 
              onClick={() => setIsCartOpen(true)}
              aria-label="Shopping Cart"
            >
              <ShoppingBag size={20} />
              {cartItemCount > 0 && <span className="cart-badge">{cartItemCount}</span>}
            </button>
          </div>
        </div>

        {/* Search Overlay Dropdown */}
        {isSearchOpen && (
          <div className="search-overlay">
            <div className="container">
              <div className="search-input-wrapper">
                <input 
                  type="text" 
                  className="search-input-field" 
                  placeholder="Search by notes or fragrance name (e.g. rose, sandalwood, oud)..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  autoFocus
                />
                <button 
                  className="search-close-btn" 
                  onClick={() => {
                    setSearchTerm('');
                    setIsSearchOpen(false);
                  }}
                >
                  <X size={20} />
                </button>
              </div>
            </div>
          </div>
        )}
      </header>

      {/* Mobile Drawer Navigation */}
      {isMobileMenuOpen && (
        <div className="mobile-nav-overlay" onClick={() => setIsMobileMenuOpen(false)}>
          <div 
            className="mobile-nav-panel open"
            onClick={(e) => e.stopPropagation()}
          >
            <button 
              className="mobile-nav-close" 
              onClick={() => setIsMobileMenuOpen(false)}
              aria-label="Close Menu"
            >
              <X size={24} />
            </button>
            <nav className="mobile-nav-links">
              <a 
                href="#collection" 
                className="mobile-nav-link" 
                onClick={() => handleScrollToSection('collection')}
              >
                Shop Collection
              </a>
              <a 
                href="#discovery" 
                className="mobile-nav-link" 
                onClick={() => handleScrollToSection('discovery')}
              >
                Discovery Collection
              </a>
              <a 
                href="#combo-builder" 
                className="mobile-nav-link" 
                onClick={() => handleScrollToSection('combo-builder')}
              >
                Launch Packages
              </a>
              <a 
                href="#finder" 
                className="mobile-nav-link" 
                onClick={(e) => {
                  e.preventDefault();
                  setIsMobileMenuOpen(false);
                  setIsFinderOpen(true);
                }}
              >
                Scent Finder Quiz
              </a>
              <a 
                href="#story" 
                className="mobile-nav-link" 
                onClick={() => handleScrollToSection('story')}
              >
                Brand Story
              </a>
            </nav>
          </div>
        </div>
      )}
    </>
  );
}
