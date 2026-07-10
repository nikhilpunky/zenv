import React, { useState, useEffect } from 'react';

export default function PreLaunchPopup() {
  const [animateIn, setAnimateIn]   = useState(false);
  const [dismissed, setDismissed]   = useState(false);
  const [btnPressed, setBtnPressed] = useState(false);

  useEffect(() => {
    let raf1, raf2;
    const delay = setTimeout(() => {
      raf1 = requestAnimationFrame(() => {
        raf2 = requestAnimationFrame(() => setAnimateIn(true));
      });
    }, 900);
    return () => {
      clearTimeout(delay);
      cancelAnimationFrame(raf1);
      cancelAnimationFrame(raf2);
    };
  }, []);

  const handleClose = () => {
    setAnimateIn(false);
    setTimeout(() => setDismissed(true), 500);
  };

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) handleClose();
  };

  const handleExploreClick = () => {
    setBtnPressed(true);
    setTimeout(() => {
      setBtnPressed(false);
      handleClose();
      setTimeout(() => {
        document.getElementById('collection')?.scrollIntoView({ behavior: 'smooth' });
      }, 350);
    }, 160);
  };

  if (dismissed) return null;

  return (
    <div
      className={`popup-overlay${animateIn ? ' popup-overlay--visible' : ''}`}
      onClick={handleOverlayClick}
      role="dialog"
      aria-modal="true"
      aria-label="Welcome to ZENV"
    >
      <div className={`popup-card${animateIn ? ' popup-card--visible' : ''}`}>

        {/* Background shimmer sweep */}
        <div className="popup-shimmer-bg" aria-hidden="true" />

        {/* Gold radial glow top */}
        <div className="popup-gold-dust" aria-hidden="true" />

        {/* Close button */}
        <button
          id="popup-close-btn"
          className="popup-close-btn"
          onClick={handleClose}
          aria-label="Close welcome popup"
        >
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
            <line x1="1" y1="1" x2="13" y2="13" />
            <line x1="13" y1="1" x2="1" y2="13" />
          </svg>
        </button>

        {/* Logo monogram — stagger delay 0 */}
        <div className={`popup-monogram popup-anim${animateIn ? ' popup-anim--in' : ''}`}
          style={{ '--popup-delay': '0.05s' }} aria-hidden="true">
          <svg width="60" height="60" viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg">
            <ellipse cx="30" cy="30" rx="28" ry="28" stroke="#C89B3C" strokeWidth="1.1" />
            <text x="30" y="37" textAnchor="middle" fontFamily="Cormorant Garamond, serif" fontSize="26" fontWeight="500" fill="#C89B3C" letterSpacing="1">Z</text>
          </svg>
        </div>

        {/* Gold ornament — stagger delay 1 */}
        <div className={`popup-ornament popup-anim${animateIn ? ' popup-anim--in' : ''}`}
          style={{ '--popup-delay': '0.18s' }} aria-hidden="true">
          <span className="popup-ornament-line" />
          <svg width="8" height="8" viewBox="0 0 8 8">
            <rect x="2" y="2" width="4" height="4" fill="#C89B3C" transform="rotate(45 4 4)" />
          </svg>
          <span className="popup-ornament-line" />
        </div>

        {/* Headline — stagger delay 2 */}
        <div className={`popup-headline-block popup-anim${animateIn ? ' popup-anim--in' : ''}`}
          style={{ '--popup-delay': '0.28s' }}>
          <h2 className="popup-headline">Welcome to ZENV</h2>
          <div className="popup-gold-rule" aria-hidden="true" />
          <p className="popup-subline">
            Discover our signature fragrance collection<br />crafted to leave a lasting impression.
          </p>
        </div>

        {/* Founders note — stagger delay 3 */}
        <div className={`popup-founders-note popup-anim${animateIn ? ' popup-anim--in' : ''}`}
          style={{ '--popup-delay': '0.40s' }}>
          <svg className="popup-leaf-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M6 20c0 0 3-9 11-13C21 4 23 3 23 3s0 2-4 7C15 17 6 20 6 20Z" />
            <path d="M6 20L4 22" />
            <path d="M13 11c-2 2-4 5-6 7" />
          </svg>
          <p className="popup-founders-text">
            <em className="popup-founders-accent">Exclusive Founder's Launch –</em><br />
            Limited benefits for our first 100 customers.
          </p>
        </div>

        {/* CTA — stagger delay 4 */}
        <button
          id="popup-claim-btn"
          className={`popup-cta-btn popup-anim${animateIn ? ' popup-anim--in' : ''}${btnPressed ? ' popup-cta-btn--pressed' : ''}`}
          style={{ '--popup-delay': '0.52s' }}
          onClick={handleExploreClick}
          aria-label="Explore the ZENV fragrance collection"
        >
          <span className="popup-cta-shimmer" aria-hidden="true" />
          <span className="popup-cta-text">Explore Collection</span>
          <span className="popup-cta-arrow" aria-hidden="true">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="5" y1="12" x2="19" y2="12" />
              <polyline points="12 5 19 12 12 19" />
            </svg>
          </span>
        </button>

      </div>
    </div>
  );
}
