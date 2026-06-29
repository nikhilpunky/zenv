import React from 'react';
import { Compass, Eye, MessageSquare } from 'lucide-react';

export default function Story() {
  return (
    <section id="story" className="section-padding" style={{ background: 'var(--bg-ivory)' }}>
      <div className="container">
        
        {/* Story Intro */}
        <div className="story-intro-grid">
          <div>
            <span className="hero-subtitle">Our Heritage</span>
            <h2 className="section-title story-title">
              Crafted to Leave a <em>Lasting</em> Impression.
            </h2>
          </div>
          <div>
            <p className="story-intro-desc">
              ZENV was created with a simple vision—to make luxury fragrances more accessible without compromising on quality, craftsmanship, or design. Every fragrance is thoughtfully developed using premium ingredients and presented in elegant packaging, offering a refined experience from the first spray to the last impression.
            </p>
            <p className="story-intro-desc">
              At ZENV, we believe fragrance is more than a scent—it's an expression of identity.
            </p>
          </div>
        </div>

        {/* Mission / Vision Cards */}
        <div className="story-cards-grid">
          
          <div className="story-card">
            <Compass size={32} style={{ color: 'var(--color-gold-deep)', marginBottom: '1.5rem' }} />
            <h3 style={{ fontSize: '1.8rem', marginBottom: '1rem' }}>Our Mission</h3>
            <p style={{ fontSize: '0.9rem', color: 'var(--color-charcoal-medium)', lineHeight: '1.7' }}>
              Our mission is to create exceptional fragrances that combine premium craftsmanship, timeless elegance, and lasting performance, making luxury perfumes accessible to everyone who values quality and individuality.
            </p>
          </div>

          <div className="story-card">
            <Eye size={32} style={{ color: 'var(--color-gold-deep)', marginBottom: '1.5rem' }} />
            <h3 style={{ fontSize: '1.8rem', marginBottom: '1rem' }}>Our Vision</h3>
            <p style={{ fontSize: '0.9rem', color: 'var(--color-charcoal-medium)', lineHeight: '1.7' }}>
              Our vision is to establish ZENV as a globally recognized luxury fragrance brand, known for exceptional quality, timeless design, and unforgettable scent experiences.
            </p>
          </div>

        </div>

        {/* Testimonials */}
        <div className="story-testimonial">
          <MessageSquare size={32} style={{ color: 'var(--color-gold)', margin: '0 auto 2rem' }} />
          <span className="hero-subtitle" style={{ color: 'var(--color-gold-accent)', marginBottom: '1rem', display: 'block' }}>
            Client Whispers
          </span>
          <p className="story-testimonial-text">
            "Your review could be featured here after experiencing ZENV."
          </p>
          <span style={{ fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.2em', fontWeight: 600, color: 'var(--color-gold)' }}>
            Early Customer
          </span>
        </div>

      </div>
    </section>
  );
}
