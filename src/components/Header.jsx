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

  const handleScrollToSection = (sectionId) => {
    setIsMobileMenuOpen(false);
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <>
      {/* Announcement Bar */}
      <div className="announcement-bar">
        FOUNDER'S LAUNCH OFFER: SPECIAL PRICING FOR A LIMITED TIME | FREE SHIPPING ON ALL PREPAID ORDERS
      </div>

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
            className={`mobile-nav-panel ${isMobileMenuOpen ? 'open' : ''}`}
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
