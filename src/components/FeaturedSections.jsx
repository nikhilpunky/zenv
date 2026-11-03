import React, { useContext } from 'react';
import { AppContext } from '../context/AppContext';
import ProductCard from './ProductCard';
import { ShoppingBag } from 'lucide-react';

export default function FeaturedSections() {
  const { products, addToCart, setQuickViewProduct, packageMode } = useContext(AppContext);

  // Filter products by tags
  const heroProduct = products.find(p => p.isHeroProduct);
  const bestSellers = products.filter(p => p.isBestSeller);
  const offerProducts = products.filter(p => p.isOfferProduct);

  return (
    <>
      {/* ── 1. HERO PRODUCT SPOTLIGHT ── */}
      {heroProduct && (
        <section className="featured-hero-section" style={{ background: '#0e0e0e', color: '#fff', padding: '5rem 0', borderTop: '1px solid rgba(197, 160, 89, 0.2)', borderBottom: '1px solid rgba(197, 160, 89, 0.2)' }}>
          <div className="container">
            <div className="featured-hero-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4rem', alignItems: 'center' }}>
              {/* Left Side: Product Image */}
              <div className="featured-hero-image-wrap" style={{ position: 'relative', overflow: 'hidden', borderRadius: '8px', border: '1px solid rgba(197, 160, 89, 0.3)' }}>
                <img 
                  src={heroProduct.images?.[0] || heroProduct.image || '/assets/discovery_set.png'} 
                  alt={heroProduct.name} 
                  style={{ width: '100%', display: 'block', objectFit: 'cover', height: '480px', transition: 'transform 0.6s ease' }} 
                  className="hero-spotlight-img"
                  onError={(e) => { e.target.src = '/assets/discovery_set.png'; }}
                />
                <span style={{ position: 'absolute', top: '1rem', left: '1rem', background: 'var(--color-gold-deep)', color: '#fff', textTransform: 'uppercase', fontSize: '0.65rem', letterSpacing: '0.15em', fontWeight: 600, padding: '0.3rem 0.8rem', borderRadius: '2px', zIndex: 5 }}>
                  Maison Spotlight
                </span>
              </div>

              {/* Right Side: Product Details */}
              <div className="featured-hero-details">
                <span style={{ fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.22em', color: 'var(--color-gold)', fontWeight: 600, display: 'block', marginBottom: '0.8rem' }}>
                  Signature Masterpiece
                </span>
                <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '2.5rem', fontWeight: 400, color: '#fff', margin: '0 0 0.5rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  {heroProduct.name}
                </h2>
                <span style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.6)', display: 'block', marginBottom: '1.5rem', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                  {heroProduct.type} · {heroProduct.size}
                </span>
                
                <p style={{ fontSize: '0.95rem', color: 'rgba(255,255,255,0.8)', lineHeight: 1.7, marginBottom: '2rem' }}>
                  {heroProduct.longDescription || heroProduct.description}
                </p>

                {/* Scent Notes Pyramid */}
                <div style={{ background: 'rgba(255, 255, 255, 0.03)', border: '1px solid rgba(197, 160, 89, 0.2)', padding: '1.5rem', borderRadius: '4px', marginBottom: '2rem' }}>
                  <span style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--color-gold)', fontWeight: 600, display: 'block', marginBottom: '1rem' }}>
                    Olfactive Pyramid
                  </span>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem' }}>
                      <strong style={{ color: 'rgba(255,255,255,0.9)' }}>Top Notes:</strong>
                      <span style={{ color: 'rgba(255,255,255,0.6)' }}>{heroProduct.olfactiveNotes?.top || 'Bergamot, Citrus'}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem' }}>
                      <strong style={{ color: 'rgba(255,255,255,0.9)' }}>Heart Notes:</strong>
                      <span style={{ color: 'rgba(255,255,255,0.6)' }}>{heroProduct.olfactiveNotes?.heart || 'Jasmine, Rose'}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem' }}>
                      <strong style={{ color: 'rgba(255,255,255,0.9)' }}>Base Notes:</strong>
                      <span style={{ color: 'rgba(255,255,255,0.6)' }}>{heroProduct.olfactiveNotes?.base || 'Sandalwood, Musk'}</span>
                    </div>
                  </div>
                </div>

                {/* Price and CTA Row */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '2rem', flexWrap: 'wrap' }}>
                  <div>
                    {packageMode !== '4999_package' && heroProduct.mrp && heroProduct.mrp > heroProduct.price && (
                      <span style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.4)', textDecoration: 'line-through', display: 'block' }}>
                        MRP ₹{heroProduct.mrp}
                      </span>
                    )}
                    <span style={{ fontSize: '1.8rem', fontWeight: 600, color: 'var(--color-gold)' }}>
                      ₹{heroProduct.price}
                    </span>
                  </div>
                  <button 
                    onClick={() => addToCart(heroProduct)} 
                    style={{ background: 'var(--color-gold)', border: 'none', color: '#111', padding: '0.9rem 2rem', fontWeight: 600, fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.1em', cursor: 'pointer', borderRadius: '2px', display: 'inline-flex', alignItems: 'center', gap: '0.6rem', transition: 'background 0.2s' }}
                    className="hero-spotlight-cta"
                  >
                    <ShoppingBag size={16} /> Add to Cart
                  </button>
                  <button 
                    onClick={() => setQuickViewProduct(heroProduct)} 
                    style={{ background: 'transparent', border: '1px solid rgba(255,255,255,0.3)', color: '#fff', padding: '0.9rem 1.5rem', fontWeight: 600, fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.1em', cursor: 'pointer', borderRadius: '2px' }}
                  >
                    Explore Details
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ── 2. BEST SELLERS SECTION ── */}
      {bestSellers.length > 0 && (
        <section className="section-padding best-sellers-section" style={{ background: '#faf6f0', borderBottom: '1px solid var(--border-light)' }}>
          <div className="container">
            <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
              <span style={{ fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.22em', color: 'var(--color-gold-deep)', fontWeight: 600, display: 'block', marginBottom: '0.5rem' }}>
                Curated for Connoisseurs
              </span>
              <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '2.2rem', fontWeight: 400, color: 'var(--color-charcoal)', margin: 0 }}>
                Our Best Sellers
              </h2>
              <p style={{ fontSize: '0.85rem', color: 'var(--color-charcoal-light)', maxWidth: '480px', margin: '0.5rem auto 0' }}>
                Explore the house favorites that have earned their place as scent staples.
              </p>
            </div>

            <div className="products-grid">
              {bestSellers.map((prod) => (
                <ProductCard key={prod.id} product={prod} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── 3. SPECIAL OFFERS SECTION ── */}
      {offerProducts.length > 0 && (
        <section className="section-padding offer-products-section" style={{ background: '#fff' }}>
          <div className="container">
            <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
              <span style={{ fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.22em', color: 'var(--color-gold-deep)', fontWeight: 600, display: 'block', marginBottom: '0.5rem' }}>
                Limited Time Deals
              </span>
              <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '2.2rem', fontWeight: 400, color: 'var(--color-charcoal)', margin: 0 }}>
                Exclusive Offers
              </h2>
              <p style={{ fontSize: '0.85rem', color: 'var(--color-charcoal-light)', maxWidth: '480px', margin: '0.5rem auto 0' }}>
                Exceptional value on select items from our signature collection.
              </p>
            </div>

            <div className="products-grid">
              {offerProducts.map((prod) => (
                <ProductCard key={prod.id} product={prod} />
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
}
