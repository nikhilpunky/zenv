import React, { useEffect, useRef } from 'react';

/* ─── SVG luxury gold icons ──────────────────────────────────────────────── */
const IconHourglass = () => (
  <svg width="36" height="36" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9 4h18M9 32h18" />
    <path d="M10 4c0 8.5 8 11.5 8 14s-8 5.5-8 14" />
    <path d="M26 4c0 8.5-8 11.5-8 14s8 5.5 8 14" />
    <path d="M13 26h10" />
  </svg>
);

const IconLeaf = () => (
  <svg width="36" height="36" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round">
    <path d="M8 28c0 0 4-13 15-18C28 6 31 5 31 5s0 3-5 10C21 23 8 28 8 28Z" />
    <path d="M8 28L5 31" />
    <path d="M18 16c-3 3-6 7-8 10" />
  </svg>
);

const IconIndia = () => (
  <svg width="36" height="36" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 3C14 3 11 5 10 7c-1 2-2 5-2 8 0 3 1 6 3 9 2 3 5 6 7 8 2-2 5-5 7-8 2-3 3-6 3-9 0-3-1-6-2-8-1-2-4-4-8-4Z" />
    <circle cx="18" cy="14" r="3" />
  </svg>
);

const features = [
  {
    Icon: IconHourglass,
    title: 'Long Lasting',
    description:
      'Expertly formulated to linger beautifully on skin for up to 12 hours, evolving gracefully through the day.',
  },
  {
    Icon: IconLeaf,
    title: 'Premium Ingredients',
    description:
      'Blended from the finest natural reserves — pure essential oils, rare resins, and hand-selected botanicals.',
  },
  {
    Icon: IconIndia,
    title: 'Made in India',
    description:
      "Proudly crafted in small batches locally, celebrating India's rich olfactory heritage and world-class standards.",
  },
];

export default function Highlights() {
  const sectionRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.querySelectorAll('.wcz-card').forEach((card, i) => {
              card.style.animationDelay = `${i * 0.15}s`;
              card.classList.add('wcz-card--visible');
            });
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section className="wcz-section" id="why-choose-zenv" ref={sectionRef} aria-label="Why Choose ZENV">
      <div className="wcz-container">
        {/* Section heading */}
        <div className="wcz-heading">
          <h2 className="wcz-title">Why Choose ZENV?</h2>
          <div className="wcz-title-accent" aria-hidden="true">
            <span className="wcz-dot" />
            <span className="wcz-line" />
            <span className="wcz-dot" />
          </div>
        </div>

        {/* Feature cards */}
        <div className="wcz-grid" ref={sectionRef}>
          {features.map(({ Icon, title, description }, idx) => (
            <div className="wcz-card" key={idx}>
              <div className="wcz-icon-ring" aria-hidden="true">
                <Icon />
              </div>
              <h3 className="wcz-card-title">{title}</h3>
              <p className="wcz-card-desc">{description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
