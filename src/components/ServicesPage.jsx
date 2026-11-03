import React, { useState, useContext } from 'react';
import { AppContext } from '../context/AppContext';
import { 
  Sparkles, Compass, Gift, MessageCircle, ShieldCheck, 
  Truck, RefreshCw, Award, Video, Search, X, 
  ArrowRight, Check, Star, ExternalLink, Calendar, 
  Layers, Package, PhoneCall, Zap, Heart
} from 'lucide-react';

export default function ServicesPage() {
  const { 
    isServicesOpen, 
    setIsServicesOpen, 
    setIsFinderOpen, 
    addToCart, 
    setIsCartOpen,
    products,
    setQuickViewProduct
  } = useContext(AppContext);

  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [engraveText, setEngraveText] = useState('VESPERA · ÉLITE');
  const [engraveFont, setEngraveFont] = useState('serif');
  const [trackingIdInput, setTrackingIdInput] = useState('');
  const [trackingResult, setTrackingResult] = useState(null);
  const [bookingSuccess, setBookingSuccess] = useState(null);

  if (!isServicesOpen) return null;

  const services = [
    {
      id: 'scent-finder',
      category: 'discovery',
      badge: 'AI Powered',
      badgeType: 'gold',
      title: 'AI Olfactive Scent Finder & Diagnostic Quiz',
      subtitle: 'Personalized fragrance matchmaking based on chemistry, personality & occasions',
      icon: Compass,
      description: 'Our digital nose algorithm analyzes your preferred notes, scent projection preferences, daily routines, and climate to match you with your bespoke signature perfume within 60 seconds.',
      features: [
        'Multi-factor olfactory preference profiling',
        'Top, Heart & Base note compatibility calculation',
        'Direct sample & flacon recommendation match',
        '100% complimentary & instant recommendations'
      ],
      sla: 'Instant (60 Secs)',
      actionText: 'Launch Scent Finder Quiz',
      actionHandler: () => {
        setIsServicesOpen(false);
        setIsFinderOpen(true);
      }
    },
    {
      id: 'combo-builder',
      category: 'discovery',
      badge: 'Up to 30% Savings',
      badgeType: 'green',
      title: 'Custom Layering & Discovery Combo Builder',
      subtitle: 'Build your personalized 2-piece or 3-piece extrait wardrobe with tiered bundle discounts',
      icon: Layers,
      description: 'Design your own custom olfactive wardrobe by curating two or three complimentary 50ml flacons or travel vials. Unlock automatic tiered bundle discounts with luxury velvet packaging.',
      features: [
        'Duo & Trio perfume layering curation',
        'Automatic tiered bundle discount application',
        'Includes complimentary velvet double-flacon box',
        'Personalized layering guide included'
      ],
      sla: 'Custom Configurator',
      actionText: 'Open Combo Builder',
      actionHandler: () => {
        setIsServicesOpen(false);
        const el = document.getElementById('combo-builder');
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }
    },
    {
      id: 'monogram-engraving',
      category: 'bespoke',
      badge: 'Complimentary on Orders > ₹2,000',
      badgeType: 'gold',
      title: 'Bespoke Flacon Laser Engraving & Monogramming',
      subtitle: 'Precision laser calligraphy on heavy glass flacons and brushed metallic caps',
      icon: Sparkles,
      description: 'Immortalize your most cherished memories with custom laser-etched initials, wedding anniversary dates, or heartfelt messages in gold-foil finished micro-calligraphy.',
      features: [
        'Custom Serif, Cursive Script or Modern Sans typography',
        'Applied directly on flacon side or golden heavy cap',
        'Proofed by our master artisan before dispatch',
        'Ideal for weddings, milestones & executive gifts'
      ],
      sla: '+24 Hours Crafting Time',
      actionText: 'Customize Engraving Below',
      actionHandler: () => {
        const el = document.getElementById('engraving-tool-section');
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }
    },
    {
      id: 'corporate-gifting',
      category: 'gifting',
      badge: 'Concierge Managed',
      badgeType: 'blue',
      title: 'Corporate & Wedding Luxury Gifting Concierge',
      subtitle: 'Bespoke curation, gold wax-sealed notes & bulk luxury packaging for memorable occasions',
      icon: Gift,
      description: 'Elevate your corporate gifting, executive hampers, bridal showers, or destination weddings. Our dedicated concierge manages end-to-end custom sleeve branding, ribbons, and pan-India multi-destination dispatch.',
      features: [
        'Custom velvet boxes & embossed ribbon finishing',
        'Handwritten wax-sealed personalized message cards',
        'Volume-tiered executive pricing for 10+ units',
        'Pan-India direct-to-guest doorstep delivery'
      ],
      sla: '24-Hour Custom Quote',
      actionText: 'Connect with Gifting Concierge',
      actionHandler: () => {
        const text = encodeURIComponent("Hello VESPERA Luxury Gifting Concierge! I would like to inquire about customized corporate/wedding gifting hampers and bulk curation.");
        window.open(`https://wa.me/919310912279?text=${text}`, '_blank');
      }
    },
    {
      id: 'whatsapp-concierge',
      category: 'care',
      badge: '24/7 Priority',
      badgeType: 'green',
      title: '24/7 Dedicated WhatsApp Scent Sommelier',
      subtitle: 'Direct WhatsApp advisory with certified perfumers for note pairing, recommendations & support',
      icon: MessageCircle,
      description: 'Speak directly with our fragrance stylists in real time. Receive individualized layering tips, order updates, scent pairing advice for upcoming events, or immediate order assistance.',
      features: [
        'Direct consultation with certified perfume stylists',
        'Real-time order tracking & delivery priority updates',
        'Fragrance notes guidance for specific weather/moods',
        'Available 24 hours a day, 7 days a week'
      ],
      sla: '< 5 Minutes Response',
      actionText: 'Start Live WhatsApp Chat',
      actionHandler: () => {
        const text = encodeURIComponent("Hello VESPERA Scent Sommelier! I need personal assistance with selecting my signature perfume and olfactory notes.");
        window.open(`https://wa.me/919310912279?text=${text}`, '_blank');
      }
    },
    {
      id: 'pre-launch-vault',
      category: 'vip',
      badge: 'Exclusive Privilege',
      badgeType: 'gold',
      title: 'VIP Pre-Launch Vault & Discovery Club',
      subtitle: 'Early tasting privileges, private batch allocations & 5ml preview vials before public drop',
      icon: Award,
      description: 'Join the inner circle of VESPERA connoisseurs. Members gain private access to rare experimental batch releases, secret vault decants, and complimentary 5ml sample flights.',
      features: [
        'First access to ultra-limited batch formulations',
        'Private invitation-only seasonal tasting flights',
        'Complimentary 5ml discovery decant with major releases',
        'Member-only secret vault discounts & events'
      ],
      sla: 'Exclusive Access',
      actionText: 'Join VIP Discovery Circle',
      actionHandler: () => {
        setBookingSuccess('VIP Discovery Circle: You have been registered for private vault access notifications! A welcome gift code will be sent to your WhatsApp.');
        setTimeout(() => setBookingSuccess(null), 6000);
      }
    },
    {
      id: 'white-glove-shipping',
      category: 'shipping',
      badge: 'Insured & Fast',
      badgeType: 'blue',
      title: 'Pan-India Express White-Glove Courier & Real-Time Tracking',
      subtitle: 'Temperature-controlled safe dispatch with 24-48 hour delivery in tier-1 metro cities',
      icon: Truck,
      description: 'Every VESPERA flacon is cocooned in shock-absorbing eco-foam and sealed with tamper-evident security foil. Dispatched via premium express air couriers with real-time SMS and WhatsApp milestone tracking.',
      features: [
        '24-48 Hour metro express delivery dispatch',
        '100% Transit-insured against damage or loss',
        'Temperature-stable protective luxury packaging',
        'Live waybill status & WhatsApp milestone updates'
      ],
      sla: '24-48 Hours Metro SLA',
      actionText: 'Track Your Waybill',
      actionHandler: () => {
        const el = document.getElementById('tracking-tool-section');
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }
    },
    {
      id: 'flacon-refill',
      category: 'bespoke',
      badge: '35% Loyalty Savings',
      badgeType: 'green',
      title: 'Eco-Luxe Crystal Flacon Refill & Sustainability Program',
      subtitle: 'Return your empty 50ml crystal flacon for eco-conscious refill at 35% privilege discount',
      icon: RefreshCw,
      description: 'In our commitment to timeless luxury and sustainability, our crystal flacons are designed to last a lifetime. Send back your empty bottle or request an in-boutique refill to save 35% off retail pricing.',
      features: [
        'Ultra-sonic sanitization and fresh precision atomizer replacement',
        'Refilled with 100% pure high-concentration Eau de Parfum extrait',
        '35% flat privilege discount on all 50ml refills',
        'Complimentary reverse pick-up available across India'
      ],
      sla: '3-Day Turnaround',
      actionText: 'Request Flacon Refill',
      actionHandler: () => {
        const text = encodeURIComponent("Hello VESPERA Refill Program! I would like to book an Eco-Luxe Crystal Flacon Refill for my 50ml bottle.");
        window.open(`https://wa.me/919310912279?text=${text}`, '_blank');
      }
    },
    {
      id: 'virtual-masterclass',
      category: 'care',
      badge: '1-on-1 Private',
      badgeType: 'gold',
      title: 'Private Virtual Scent Consultation & Olfactory Masterclass',
      subtitle: '15-minute 1-on-1 private video session with a Senior Scent Stylist',
      icon: Video,
      description: 'Book a one-on-one virtual masterclass session with our senior perfumer. Discover the art of fragrance longevity, pulse point chemistry, seasonal rotations, and bespoke layering blends.',
      features: [
        'Personalized 15-minute private video / voice consultation',
        'Live skin chemistry and longevity troubleshooting',
        'Curated 3-fragrance recommendation portfolio',
        '₹500 redeemable credit voucher towards your next flacon'
      ],
      sla: 'By Appointment',
      actionText: 'Book Masterclass Session',
      actionHandler: () => {
        const text = encodeURIComponent("Hello VESPERA! I would like to schedule a 15-minute Private Virtual Scent Consultation with a Senior Scent Stylist.");
        window.open(`https://wa.me/919310912279?text=${text}`, '_blank');
      }
    },
    {
      id: 'discovery-flight',
      category: 'discovery',
      badge: 'Best Seller',
      badgeType: 'gold',
      title: 'The Signature Discovery Flight (5 × 8ml Flacons)',
      subtitle: 'Experience our entire olfactive universe at home before selecting your 50ml signature',
      icon: Package,
      description: 'The ultimate entryway into luxury perfumery. Includes 5 deluxe 8ml spray flacons spanning Aquatic, Woody, Smoky Oud, Luminous Clean, and Velvet Rose accords, housed in a velvet matte box.',
      features: [
        'Five full 8ml travel-ready spray atomizers',
        'Includes ₹500 redeemable voucher on full 50ml bottle',
        'Presented in luxury matte-black gold foil gift box',
        'Ideal for travel, layering, and gifting'
      ],
      sla: 'Same-Day Dispatch',
      actionText: 'Experience Discovery Set',
      actionHandler: () => {
        setIsServicesOpen(false);
        const disc = products.find(p => p.id === 'discovery-set');
        if (disc) {
          setQuickViewProduct(disc);
        } else {
          const el = document.getElementById('collection');
          if (el) el.scrollIntoView({ behavior: 'smooth' });
        }
      }
    }
  ];

  const filteredServices = services.filter(srv => {
    const matchesCategory = activeCategory === 'all' || srv.category === activeCategory;
    const matchesSearch = srv.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          srv.subtitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          srv.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleSimulateTrack = (e) => {
    e.preventDefault();
    if (!trackingIdInput.trim()) return;
    const id = trackingIdInput.trim().toUpperCase();
    setTrackingResult({
      trackingNumber: id,
      courier: 'Bluedart Apex Luxury Express',
      status: 'Out for Delivery / In Transit',
      currentCity: 'New Delhi Distribution Hub',
      destination: 'Client Address',
      eta: 'Estimated Delivery: Today by 6:00 PM',
      checkpoints: [
        { time: 'Today, 09:30 AM', title: 'Out for Delivery', desc: 'Assigned to dedicated white-glove courier rider' },
        { time: 'Today, 04:15 AM', title: 'Arrived at Local Hub', desc: 'Secure temperature-controlled warehouse scan' },
        { time: 'Yesterday, 07:45 PM', title: 'Air Transit Departed', desc: 'Dispatched from VESPERA Master Atelier' },
        { time: 'Yesterday, 02:30 PM', title: 'Quality Sealed & Packed', desc: 'Laser hologram tamper seal verified' }
      ]
    });
  };

  return (
    <div className="services-overlay" onClick={(e) => { if (e.target === e.currentTarget) setIsServicesOpen(false); }}>
      <div className="services-modal-container">
        {/* Top Header Bar */}
        <div className="services-modal-header">
          <div className="services-header-badge">
            <Sparkles size={14} />
            <span>VESPERA BESPOKE PRIVILEGES & SERVICES</span>
          </div>
          <button 
            type="button" 
            className="services-close-btn"
            onClick={() => setIsServicesOpen(false)}
            aria-label="Close Services"
          >
            <X size={20} />
          </button>
        </div>

        {/* Hero Banner inside modal */}
        <div className="services-hero-banner">
          <h2 className="services-hero-title">Haute Parfumerie Services & VIP Privileges</h2>
          <p className="services-hero-subtitle">
            Explore our complete suite of bespoke olfactive services, personalization ateliers, white-glove logistics, and concierge privileges crafted exclusively for VESPERA connoisseurs.
          </p>

          {/* Quick Metrics Bar */}
          <div className="services-metrics-row">
            <div className="service-metric-item">
              <strong>10+</strong>
              <span>Luxury Services</span>
            </div>
            <div className="service-metric-item">
              <strong>24/7</strong>
              <span>WhatsApp Concierge</span>
            </div>
            <div className="service-metric-item">
              <strong>24-48h</strong>
              <span>Express Dispatch</span>
            </div>
            <div className="service-metric-item">
              <strong>100%</strong>
              <span>Artisanal Quality</span>
            </div>
          </div>
        </div>

        {bookingSuccess && (
          <div className="services-success-banner">
            <Check size={18} />
            <span>{bookingSuccess}</span>
          </div>
        )}

        {/* Filter and Search Bar */}
        <div className="services-controls-bar">
          <div className="services-search-wrapper">
            <Search size={16} className="services-search-icon" />
            <input 
              type="text" 
              className="services-search-input" 
              placeholder="Search services (e.g., Engraving, WhatsApp, Refill, Scent Finder, Gifting)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            {searchQuery && (
              <button 
                type="button" 
                className="services-search-clear"
                onClick={() => setSearchQuery('')}
              >
                <X size={14} />
              </button>
            )}
          </div>

          <div className="services-category-tabs">
            {[
              { id: 'all', label: 'All Services (10)' },
              { id: 'discovery', label: 'Scent & Discovery' },
              { id: 'bespoke', label: 'Bespoke & Personalization' },
              { id: 'gifting', label: 'Luxury Gifting' },
              { id: 'care', label: 'Concierge Care' },
              { id: 'shipping', label: 'White-Glove Shipping' },
              { id: 'vip', label: 'VIP Privileges' }
            ].map(tab => (
              <button
                key={tab.id}
                type="button"
                className={`services-tab-btn ${activeCategory === tab.id ? 'active' : ''}`}
                onClick={() => setActiveCategory(tab.id)}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Services Cards Grid */}
        <div className="services-grid">
          {filteredServices.map(srv => {
            const Icon = srv.icon;
            return (
              <div key={srv.id} className="service-card">
                <div className="service-card-top">
                  <div className="service-icon-box">
                    <Icon size={22} />
                  </div>
                  <div className="service-card-badges">
                    <span className={`service-pill service-pill-${srv.badgeType}`}>
                      {srv.badge}
                    </span>
                    <span className="service-sla-tag">
                      {srv.sla}
                    </span>
                  </div>
                </div>

                <h3 className="service-card-title">{srv.title}</h3>
                <p className="service-card-subtitle">{srv.subtitle}</p>
                <p className="service-card-desc">{srv.description}</p>

                <div className="service-features-list">
                  {srv.features.map((f, i) => (
                    <div key={i} className="service-feature-item">
                      <div className="service-feature-bullet">
                        <Check size={12} />
                      </div>
                      <span>{f}</span>
                    </div>
                  ))}
                </div>

                <div className="service-card-footer">
                  <button 
                    type="button" 
                    className="service-action-btn"
                    onClick={srv.actionHandler}
                  >
                    <span>{srv.actionText}</span>
                    <ArrowRight size={15} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {filteredServices.length === 0 && (
          <div className="services-empty-state">
            <Search size={36} style={{ opacity: 0.3, marginBottom: '0.8rem' }} />
            <h4>No matching services found</h4>
            <p>Try clearing your search query or choosing another category above.</p>
            <button 
              type="button" 
              className="btn-admin-gold" 
              style={{ marginTop: '1rem' }}
              onClick={() => { setSearchQuery(''); setActiveCategory('all'); }}
            >
              Reset Filters
            </button>
          </div>
        )}

        {/* Interactive Interactive Tools Section Inside Services Page */}
        <div className="services-interactive-tools">
          <div className="tools-section-title">
            <Sparkles size={18} style={{ color: 'var(--color-gold-deep)' }} />
            <h3>Live Interactive Concierge Tools</h3>
          </div>

          <div className="tools-grid">
            {/* Tool 1: Live Flacon Laser Engraving Previewer */}
            <div id="engraving-tool-section" className="tool-card">
              <div className="tool-card-header">
                <div className="tool-header-badge">BESPOKE ATELIER</div>
                <h4>Live Flacon Laser Engraving Studio</h4>
                <p>Preview your custom initials or wedding date on a heavy crystal flacon</p>
              </div>

              <div className="engraving-preview-box">
                <div className="flacon-mockup">
                  <div className="flacon-cap"></div>
                  <div className="flacon-bottle">
                    <div className="flacon-label-gold">VESPERA</div>
                    <div 
                      className={`flacon-engraving-rendered font-${engraveFont}`}
                    >
                      {engraveText || 'YOUR MONOGRAM HERE'}
                    </div>
                  </div>
                </div>
              </div>

              <div className="tool-controls">
                <div className="tool-field">
                  <label>Engraving Text (Max 24 characters):</label>
                  <input 
                    type="text" 
                    maxLength={24}
                    value={engraveText}
                    onChange={(e) => setEngraveText(e.target.value)}
                    placeholder="e.g. S & A · 12.12.2026"
                    className="tool-input"
                  />
                </div>
                <div className="tool-field">
                  <label>Artisanal Font Style:</label>
                  <div className="tool-font-options">
                    <button 
                      type="button" 
                      className={`tool-font-btn ${engraveFont === 'serif' ? 'active' : ''}`}
                      onClick={() => setEngraveFont('serif')}
                    >
                      Classical Serif
                    </button>
                    <button 
                      type="button" 
                      className={`tool-font-btn ${engraveFont === 'cursive' ? 'active' : ''}`}
                      onClick={() => setEngraveFont('cursive')}
                    >
                      Calligraphy Script
                    </button>
                    <button 
                      type="button" 
                      className={`tool-font-btn ${engraveFont === 'sans' ? 'active' : ''}`}
                      onClick={() => setEngraveFont('sans')}
                    >
                      Modern Minimalist
                    </button>
                  </div>
                </div>

                <button 
                  type="button" 
                  className="btn-gold-action"
                  onClick={() => {
                    const text = encodeURIComponent(`Hello VESPERA Atelier! I would like to request bespoke engraving with text: "${engraveText}" in ${engraveFont} typography style.`);
                    window.open(`https://wa.me/919310912279?text=${text}`, '_blank');
                  }}
                >
                  <Sparkles size={14} />
                  <span>Confirm & Book Engraving via WhatsApp</span>
                </button>
              </div>
            </div>

            {/* Tool 2: Pan-India Express Waybill Tracker */}
            <div id="tracking-tool-section" className="tool-card">
              <div className="tool-card-header">
                <div className="tool-header-badge">WHITE-GLOVE LOGISTICS</div>
                <h4>Real-Time Waybill & Courier Tracker</h4>
                <p>Track your simulated or live VESPERA order dispatch in real time</p>
              </div>

              <form onSubmit={handleSimulateTrack} className="tool-controls">
                <div className="tool-field">
                  <label>Waybill / Tracking Number / Order ID:</label>
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <input 
                      type="text" 
                      value={trackingIdInput}
                      onChange={(e) => setTrackingIdInput(e.target.value)}
                      placeholder="e.g. VSP-98412 or BD-5829104"
                      className="tool-input"
                      style={{ flex: 1 }}
                      required
                    />
                    <button type="submit" className="btn-gold-action" style={{ whiteSpace: 'nowrap' }}>
                      <Search size={14} />
                      <span>Track</span>
                    </button>
                  </div>
                  <div style={{ fontSize: '0.75rem', color: '#888', marginTop: '0.35rem' }}>
                    Quick try: <button type="button" onClick={() => setTrackingIdInput('VSP-88219-BLR')} style={{ color: 'var(--color-gold-deep)', background: 'none', border: 'none', cursor: 'pointer', textDecoration: 'underline' }}>VSP-88219-BLR</button> or <button type="button" onClick={() => setTrackingIdInput('VSP-99432-DEL')} style={{ color: 'var(--color-gold-deep)', background: 'none', border: 'none', cursor: 'pointer', textDecoration: 'underline' }}>VSP-99432-DEL</button>
                  </div>
                </div>
              </form>

              {trackingResult ? (
                <div className="tracking-result-box">
                  <div className="tracking-res-header">
                    <div>
                      <span className="tracking-badge-live">LIVE TRACKING</span>
                      <strong style={{ display: 'block', color: '#fff', fontSize: '0.95rem', marginTop: '0.2rem' }}>
                        {trackingResult.trackingNumber}
                      </strong>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <span style={{ fontSize: '0.75rem', color: '#aaa' }}>Carrier</span>
                      <strong style={{ display: 'block', color: 'var(--color-gold-deep)', fontSize: '0.85rem' }}>
                        {trackingResult.courier}
                      </strong>
                    </div>
                  </div>

                  <div className="tracking-eta-banner">
                    <Truck size={16} />
                    <span>{trackingResult.eta}</span>
                  </div>

                  <div className="tracking-timeline">
                    {trackingResult.checkpoints.map((cp, idx) => (
                      <div key={idx} className="timeline-item">
                        <div className="timeline-marker">
                          <div className={`timeline-dot ${idx === 0 ? 'active' : ''}`} />
                        </div>
                        <div className="timeline-content">
                          <span className="timeline-time">{cp.time}</span>
                          <h5 className="timeline-title">{cp.title}</h5>
                          <p className="timeline-desc">{cp.desc}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="tracking-placeholder">
                  <Truck size={32} style={{ opacity: 0.3, marginBottom: '0.5rem' }} />
                  <p>Enter any order ID above to preview the real-time milestone route status.</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer Contact Concierge Banner */}
        <div className="services-footer-banner">
          <div>
            <h4>Need Bespoke Assistance or Custom Formulations?</h4>
            <p>Our Master Perfumer and Scent Stylists are ready to assist you seven days a week.</p>
          </div>
          <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
            <button 
              type="button" 
              className="btn-gold-action"
              onClick={() => {
                const text = encodeURIComponent("Hello VESPERA Concierge! I have a custom inquiry regarding your services and products.");
                window.open(`https://wa.me/919310912279?text=${text}`, '_blank');
              }}
            >
              <MessageCircle size={15} />
              <span>WhatsApp Concierge</span>
            </button>
            <button 
              type="button" 
              className="btn-admin-outline"
              style={{ color: '#fff', borderColor: '#444' }}
              onClick={() => setIsServicesOpen(false)}
            >
              Close Window
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
