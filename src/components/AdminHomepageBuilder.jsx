import React, { useState } from 'react';
import { 
  Monitor, Tablet, Smartphone, MousePointer, Eye, CheckCircle, 
  CheckCheck, RefreshCw, ExternalLink, Layers2, Settings, Info, 
  Edit, Gift, Image, Grid, Sparkles, Award, Flower, Compass, 
  Layers, FileUp, ArrowRight, Trash2, Leaf 
} from 'lucide-react';

const defaultHomeData = {
  announcementText: 'VESPERA INTERACTIVE DEMO EXPERIENCE — SIMULATED PAYMENTS & MOCK CHECKOUT',
  whatsappNumber: '919310912279',
  highlightsTitle: 'Why Choose VESPERA?',
  highlight1Title: 'Long Lasting',
  highlight1Desc: 'Expertly formulated to linger beautifully on skin for up to 12 hours, evolving gracefully through the day.',
  highlight2Title: 'Premium Ingredients',
  highlight2Desc: 'Blended from the finest natural reserves — pure essential oils, rare resins, and hand-selected botanicals.',
  highlight3Title: 'Luxury Experience',
  highlight3Desc: 'From heavy-weight flacons to custom-designed caps, every detail is engineered for sensory delight.',
  highlight4Title: 'Cruelty-Free',
  highlight4Desc: 'Clean formulas created responsibly, never tested on animals, and thoughtfully developed for sensitive skin.',
  storyTitle: 'Crafted with Intention',
  storyOneHeading: 'Our Olfactive Philosophy',
  storyOneBody: 'VESPERA was born from a simple conviction — that luxury fragrance should be within reach, without ever sacrificing craft, quality, or design. Every bottle is developed with intention, using premium ingredients and housed in packaging that honours the art of presentation.',
  storyOneImage: '/assets/story_one.png',
  storyTwoHeading: 'Rooted in Tradition. Refined for Today.',
  storyTwoBody: "Our creations draw inspiration from timeless traditions and the world's most exquisite natural ingredients. From carefully sourced botanicals to our meticulous blending process, every detail reflects our commitment to authenticity.",
  storyTwoImage: '/assets/story_two.png',
  footerAbout: 'VESPERA Parfums is a Maison de Haute Parfumerie dedicated to crafting premium signature fragrances with enduring performance and classic elegance.',
  footerCopyright: '© 2026 VESPERA. All Rights Reserved.'
};

export default function AdminHomepageBuilder({
  homeForm: rawHomeForm,
  setHomeForm,
  selectedHomeSection = 'announcement',
  setSelectedHomeSection,
  banners = [],
  categories = [],
  products = [],
  selectedSpotlightId,
  setSelectedSpotlightId,
  updateProduct,
  updateHomepageSettings,
  setIsAdminMode,
  showToast,
  editingBanner,
  setEditingBanner,
  bannerTitle,
  setBannerTitle,
  bannerSubtitle,
  setBannerSubtitle,
  bannerDesc,
  setBannerDesc,
  bannerImage,
  setBannerImage,
  bannerIsActive,
  setBannerIsActive,
  handleBannerFormSubmit,
  handleOpenEditBannerModal,
  handleDeleteBanner,
  handleBannerFileChange,
  editingCategory,
  setEditingCategory,
  categoryLabel,
  setCategoryLabel,
  categoryImage,
  setCategoryImage,
  categoryIcon,
  setCategoryIcon,
  handleCategoryFormSubmit,
  handleOpenEditCategoryModal,
  handleDeleteCategory,
  handleCategoryFileChange,
  handleHomeFormSubmit,
  handleStoryOneFileChange,
  handleStoryTwoFileChange
}) {
  const homeForm = rawHomeForm || defaultHomeData;
  const [previewDevice, setPreviewDevice] = useState('desktop'); // 'desktop' | 'tablet' | 'mobile'
  const [previewMode, setPreviewMode] = useState('edit'); // 'edit' | 'preview'
  const [sidebarTab, setSidebarTab] = useState('blocks'); // 'blocks' | 'settings'
  const [isPublishingHome, setIsPublishingHome] = useState(false);
  const [mobileBuilderTab, setMobileBuilderTab] = useState('editor'); // 'editor' | 'preview'

  const handlePublishClick = async () => {
    setIsPublishingHome(true);
    const ok = await updateHomepageSettings(homeForm);
    setIsPublishingHome(false);
    if (ok) {
      showToast('Homepage settings published and synchronized with live storefront!', 'success');
    } else {
      showToast('Failed to publish homepage settings.', 'danger');
    }
  };

  const handleSectionSelect = (sectionId) => {
    setSelectedHomeSection(sectionId);
    setSidebarTab('settings');
  };

  return (
    <div className="wp-builder-container">
      {/* Top WordPress Action Bar */}
      <div className="wp-topbar">
        <div className="wp-topbar-left">
          <div className="wp-brand-badge">
            <Sparkles size={14} />
            <span>VESPERA STUDIO</span>
          </div>
          <div className="wp-page-badge">
            <span style={{ color: '#888' }}>Page:</span>
            <strong style={{ color: '#fff' }}>Front Page (Homepage)</strong>
          </div>
        </div>

        {/* Center: Device Switcher & Mode Toggles */}
        <div className="wp-topbar-center">
          <div className="wp-device-toggle">
            <button 
              type="button" 
              className={`wp-device-btn ${previewDevice === 'desktop' ? 'active' : ''}`}
              onClick={() => setPreviewDevice('desktop')}
              title="Desktop View (100% width)"
            >
              <Monitor size={15} />
            </button>
            <button 
              type="button" 
              className={`wp-device-btn ${previewDevice === 'tablet' ? 'active' : ''}`}
              onClick={() => setPreviewDevice('tablet')}
              title="Tablet View (768px frame)"
            >
              <Tablet size={15} />
            </button>
            <button 
              type="button" 
              className={`wp-device-btn ${previewDevice === 'mobile' ? 'active' : ''}`}
              onClick={() => setPreviewDevice('mobile')}
              title="Mobile Phone View (375px frame)"
            >
              <Smartphone size={15} />
            </button>
          </div>

          <button
            type="button"
            className={`wp-mode-toggle ${previewMode === 'edit' ? 'edit-mode' : 'preview-mode'}`}
            onClick={() => setPreviewMode(prev => prev === 'edit' ? 'preview' : 'edit')}
            title="Toggle Click-to-Edit bounding boxes"
          >
            {previewMode === 'edit' ? (
              <>
                <MousePointer size={14} />
                <span>Click-to-Edit: ON</span>
              </>
            ) : (
              <>
                <Eye size={14} />
                <span>Storefront Preview</span>
              </>
            )}
          </button>
        </div>

        {/* Right: Publish Actions */}
        <div className="wp-topbar-right">
          <div className="wp-save-status">
            <CheckCircle size={14} />
            <span>Ready</span>
          </div>

          <button 
            type="button" 
            className="wp-publish-btn"
            disabled={isPublishingHome}
            onClick={handlePublishClick}
          >
            {isPublishingHome ? (
              <>
                <RefreshCw size={14} className="spin-animate" />
                <span>Publishing...</span>
              </>
            ) : (
              <>
                <CheckCheck size={14} />
                <span>Publish Changes</span>
              </>
            )}
          </button>

          <button 
            type="button" 
            className="btn-admin-outline" 
            style={{ padding: '0.4rem 0.75rem', fontSize: '0.78rem', color: '#fff', borderColor: '#444' }}
            onClick={() => { setIsAdminMode(false); window.location.href = '/'; }}
          >
            <ExternalLink size={13} style={{ marginRight: '0.3rem' }} />
            View Site
          </button>
        </div>
      </div>

      {/* Mobile Screen Switcher: Inspector Editor vs Canvas Preview */}
      <div className="wp-mobile-view-tabs">
        <button
          type="button"
          className={`wp-mobile-tab-btn ${mobileBuilderTab === 'editor' ? 'active' : ''}`}
          onClick={() => setMobileBuilderTab('editor')}
        >
          <Settings size={14} /> Section Editor
        </button>
        <button
          type="button"
          className={`wp-mobile-tab-btn ${mobileBuilderTab === 'preview' ? 'active' : ''}`}
          onClick={() => setMobileBuilderTab('preview')}
        >
          <Eye size={14} /> Canvas Live Preview
        </button>
      </div>

      {/* Builder Workspace: 2-Column Split */}
      <div className="wp-builder-workspace">
        {/* LEFT INSPECTOR SIDEBAR */}
        <div className={`wp-inspector-sidebar ${mobileBuilderTab === 'preview' ? 'wp-mobile-pane-hidden' : ''}`}>
          {/* Sidebar Tabs */}
          <div className="wp-sidebar-tabs">
            <button
              type="button"
              className={`wp-sidebar-tab-btn ${sidebarTab === 'blocks' ? 'active' : ''}`}
              onClick={() => setSidebarTab('blocks')}
            >
              <Layers2 size={15} />
              <span>Section Blocks (8)</span>
            </button>
            <button
              type="button"
              className={`wp-sidebar-tab-btn ${sidebarTab === 'settings' ? 'active' : ''}`}
              onClick={() => setSidebarTab('settings')}
            >
              <Settings size={15} />
              <span>Block Settings</span>
            </button>
          </div>

          {/* Sidebar Body */}
          <div className="wp-sidebar-body">
            {sidebarTab === 'blocks' ? (
              /* Blocks Navigator Tree */
              <div className="wp-blocks-tree">
                <div className="wp-layman-tip" style={{ marginBottom: '0.5rem' }}>
                  <Info size={16} style={{ flexShrink: 0, marginTop: '2px' }} />
                  <div>
                    <strong>WordPress Layman Editor:</strong> Select any section below or click directly on any element in the live preview canvas on the right to edit it!
                  </div>
                </div>

                {[
                  { id: 'announcement', icon: Gift, title: '1. Top Announcement & Support Bar', subtitle: homeForm.announcementText || 'Top promotional marquee' },
                  { id: 'hero', icon: Image, title: '2. Hero Slideshow Banners', subtitle: `${banners.length} Active slide(s)` },
                  { id: 'categories', icon: Grid, title: '3. Categories Showcase Grid', subtitle: `${categories.length} Fragrance collection cards` },
                  { id: 'spotlight', icon: Sparkles, title: '4. Featured Scent Spotlight', subtitle: products.find(p => p.id === selectedSpotlightId)?.name || 'Signature Masterpiece' },
                  { id: 'highlights', icon: Award, title: '5. Highlights & Value Pillars', subtitle: homeForm.highlightsTitle || 'Why Choose Us Panel' },
                  { id: 'story1', icon: Flower, title: '6. Brand Story Panel 1 (Image Left)', subtitle: homeForm.storyOneHeading || 'Our Olfactive Philosophy' },
                  { id: 'story2', icon: Compass, title: '7. Brand Story Panel 2 (Text Left)', subtitle: homeForm.storyTwoHeading || 'Artisanal Extraction' },
                  { id: 'footer', icon: Layers, title: '8. Footer & Brand Details', subtitle: homeForm.footerCopyright || 'VESPERA Parfums' }
                ].map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    className={`wp-block-tree-item ${selectedHomeSection === item.id ? 'active' : ''}`}
                    onClick={() => handleSectionSelect(item.id)}
                  >
                    <div className="wp-block-tree-icon">
                      <item.icon size={16} />
                    </div>
                    <div className="wp-block-tree-info">
                      <span className="wp-block-tree-title">{item.title}</span>
                      <span className="wp-block-tree-subtitle">{item.subtitle}</span>
                    </div>
                    <Edit size={14} style={{ color: '#999' }} />
                  </button>
                ))}
              </div>
            ) : (
              /* Section Settings Form */
              <div>
                <div className="wp-section-settings-header">
                  <h3 className="wp-section-settings-title">
                    <Edit size={16} style={{ color: 'var(--color-gold-deep)' }} />
                    {selectedHomeSection === 'announcement' && 'Announcement & Support'}
                    {selectedHomeSection === 'hero' && 'Hero Slideshow Banners'}
                    {selectedHomeSection === 'categories' && 'Categories Showcase Grid'}
                    {selectedHomeSection === 'spotlight' && 'Featured Scent Spotlight'}
                    {selectedHomeSection === 'highlights' && 'Highlights & Value Pillars'}
                    {selectedHomeSection === 'story1' && 'Story Panel 1 (Image Left)'}
                    {selectedHomeSection === 'story2' && 'Story Panel 2 (Text Left)'}
                    {selectedHomeSection === 'footer' && 'Footer & Copyright'}
                  </h3>
                  <button 
                    type="button" 
                    className="btn-admin-outline" 
                    style={{ padding: '0.25rem 0.5rem', fontSize: '0.72rem' }}
                    onClick={() => setSidebarTab('blocks')}
                  >
                    ← All Blocks
                  </button>
                </div>

                <div style={{ marginTop: '1rem' }}>
                  {/* 1. ANNOUNCEMENT & WHATSAPP FORM */}
                  {selectedHomeSection === 'announcement' && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                      <div className="form-group">
                        <label className="form-label" style={{ fontSize: '0.75rem', fontWeight: 600 }}>Marquee Announcement Text *</label>
                        <input 
                          type="text" 
                          className="form-input" 
                          value={homeForm.announcementText} 
                          onChange={(e) => setHomeForm(prev => ({ ...prev, announcementText: e.target.value }))}
                          placeholder="e.g. COMPLIMENTARY 5-PIECE DISCOVERY SET ON ORDERS ABOVE ₹2499"
                          required 
                        />
                        <span style={{ fontSize: '0.68rem', color: '#6b7280' }}>Displays in the glowing top announcement bar.</span>
                      </div>

                      <div className="form-group">
                        <label className="form-label" style={{ fontSize: '0.75rem', fontWeight: 600 }}>WhatsApp Support Number *</label>
                        <input 
                          type="text" 
                          className="form-input" 
                          value={homeForm.whatsappNumber} 
                          onChange={(e) => setHomeForm(prev => ({ ...prev, whatsappNumber: e.target.value }))}
                          placeholder="e.g. 919811234567 (with country code)"
                          required 
                        />
                        <span style={{ fontSize: '0.68rem', color: '#6b7280' }}>Connected to floating customer support chat widget.</span>
                      </div>

                      <button 
                        type="button" 
                        className="btn-admin-primary" 
                        style={{ width: '100%', padding: '0.75rem', fontSize: '0.82rem', marginTop: '0.5rem' }}
                        onClick={handleHomeFormSubmit}
                      >
                        Save Announcement Settings
                      </button>
                    </div>
                  )}

                  {/* 2. HERO SLIDESHOW FORM */}
                  {selectedHomeSection === 'hero' && (
                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.8rem' }}>
                        <span style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--color-charcoal)' }}>
                          Active Slides ({banners.length})
                        </span>
                        {!editingBanner && (
                          <button 
                            type="button" 
                            className="btn-admin-primary" 
                            style={{ fontSize: '0.72rem', padding: '0.3rem 0.6rem' }}
                            onClick={() => {
                              setEditingBanner({ id: 'new', title: 'New Signature\nScent Arrived', subtitle: 'VESPERA PARFUMS', description: 'Experience pure luxury essence.', isActive: true, image: '/assets/hero_perfume_v6.jpg' });
                              setBannerTitle('New Signature\nScent Arrived');
                              setBannerSubtitle('VESPERA PARFUMS');
                              setBannerDesc('Experience pure luxury essence.');
                              setBannerImage('/assets/hero_perfume_v6.jpg');
                              setBannerIsActive(true);
                            }}
                          >
                            + Add Slide
                          </button>
                        )}
                      </div>

                      {editingBanner ? (
                        <div style={{ background: '#fafafa', padding: '0.85rem', borderRadius: '6px', border: '1px solid var(--border-light)', display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
                          <div style={{ fontWeight: 700, fontSize: '0.8rem', color: 'var(--color-charcoal)' }}>
                            {editingBanner.id === 'new' ? 'New Banner Slide' : 'Edit Slide'}
                          </div>

                          <div className="form-group">
                            <label className="form-label" style={{ fontSize: '0.72rem' }}>Subtitle Eyebrow *</label>
                            <input 
                              type="text" 
                              className="form-input" 
                              value={bannerSubtitle} 
                              onChange={(e) => setBannerSubtitle(e.target.value)} 
                            />
                          </div>

                          <div className="form-group">
                            <label className="form-label" style={{ fontSize: '0.72rem' }}>Heading Title * (use \n for line breaks)</label>
                            <textarea 
                              className="form-input" 
                              style={{ height: '55px' }}
                              value={bannerTitle} 
                              onChange={(e) => setBannerTitle(e.target.value)} 
                            />
                          </div>

                          <div className="form-group">
                            <label className="form-label" style={{ fontSize: '0.72rem' }}>Description Copy *</label>
                            <textarea 
                              className="form-input" 
                              style={{ height: '65px' }}
                              value={bannerDesc} 
                              onChange={(e) => setBannerDesc(e.target.value)} 
                            />
                          </div>

                          <div className="form-group">
                            <label className="form-label" style={{ fontSize: '0.72rem' }}>Cover Image File *</label>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                              <input 
                                type="text" 
                                className="form-input" 
                                value={bannerImage} 
                                onChange={(e) => setBannerImage(e.target.value)} 
                              />
                              <label className="btn-admin-outline" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', cursor: 'pointer', margin: 0, padding: '0.3rem 0.6rem', fontSize: '0.72rem', alignSelf: 'start' }}>
                                <FileUp size={12} /> Upload Slide Image
                                <input 
                                  type="file" 
                                  accept="image/*" 
                                  style={{ display: 'none' }} 
                                  onChange={handleBannerFileChange} 
                                />
                              </label>
                            </div>
                          </div>

                          <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end', marginTop: '0.5rem' }}>
                            <button type="button" className="btn-admin-outline" style={{ fontSize: '0.75rem', padding: '0.35rem 0.7rem' }} onClick={() => setEditingBanner(null)}>
                              Cancel
                            </button>
                            <button type="button" className="btn-admin-primary" style={{ fontSize: '0.75rem', padding: '0.35rem 0.85rem' }} onClick={handleBannerFormSubmit}>
                              Save Slide
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                          {banners.map((b) => (
                            <div key={b.id} style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', background: '#fff', padding: '0.6rem', borderRadius: '6px', border: '1px solid var(--border-light)' }}>
                              <img src={b.image} alt="" style={{ width: '45px', height: '45px', objectFit: 'cover', borderRadius: '4px' }} onError={(e) => { e.target.src = '/assets/hero_perfume_v6.jpg'; }} />
                              <div style={{ flex: 1, minWidth: 0 }}>
                                <div style={{ fontSize: '0.78rem', fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                  {b.title?.replace(/\n/g, ' ')}
                                </div>
                                <span style={{ fontSize: '0.65rem', color: b.isActive ? '#16a34a' : '#9ca3af' }}>
                                  ● {b.isActive ? 'Active' : 'Inactive'}
                                </span>
                              </div>
                              <button type="button" className="btn-admin-outline" style={{ padding: '0.3rem' }} onClick={() => handleOpenEditBannerModal(b)}>
                                <Edit size={12} />
                              </button>
                              <button type="button" className="btn-admin-outline" style={{ padding: '0.3rem', color: '#dc2626', borderColor: '#fee2e2' }} onClick={() => handleDeleteBanner(b.id)}>
                                <Trash2 size={12} />
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}

                  {/* 3. CATEGORIES GRID FORM */}
                  {selectedHomeSection === 'categories' && (
                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.8rem' }}>
                        <span style={{ fontSize: '0.78rem', fontWeight: 600 }}>Categories Showcase ({categories.length})</span>
                        {!editingCategory && (
                          <button 
                            type="button" 
                            className="btn-admin-primary" 
                            style={{ fontSize: '0.72rem', padding: '0.3rem 0.6rem' }}
                            onClick={() => {
                              setEditingCategory({ id: 'new', label: 'New Category', icon: 'Sparkles', image: '/assets/product_sample.png' });
                              setCategoryLabel('New Category');
                              setCategoryImage('/assets/product_sample.png');
                              setCategoryIcon('Sparkles');
                            }}
                          >
                            + Add Category
                          </button>
                        )}
                      </div>

                      {editingCategory ? (
                        <div style={{ background: '#fafafa', padding: '0.85rem', borderRadius: '6px', border: '1px solid var(--border-light)', display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
                          <div className="form-group">
                            <label className="form-label" style={{ fontSize: '0.72rem' }}>Category Label Title *</label>
                            <input 
                              type="text" 
                              className="form-input" 
                              value={categoryLabel} 
                              onChange={(e) => setCategoryLabel(e.target.value)} 
                            />
                          </div>

                          <div className="form-group">
                            <label className="form-label" style={{ fontSize: '0.72rem' }}>Category Cover Image *</label>
                            <input 
                              type="text" 
                              className="form-input" 
                              value={categoryImage} 
                              onChange={(e) => setCategoryImage(e.target.value)} 
                            />
                          </div>

                          <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
                            <button type="button" className="btn-admin-outline" style={{ fontSize: '0.75rem', padding: '0.35rem 0.7rem' }} onClick={() => setEditingCategory(null)}>
                              Cancel
                            </button>
                            <button type="button" className="btn-admin-primary" style={{ fontSize: '0.75rem', padding: '0.35rem 0.85rem' }} onClick={handleCategoryFormSubmit}>
                              Save Category
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                          {categories.map((c) => (
                            <div key={c.id} style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', background: '#fff', padding: '0.6rem', borderRadius: '6px', border: '1px solid var(--border-light)' }}>
                              <img src={c.image} alt="" style={{ width: '40px', height: '40px', objectFit: 'cover', borderRadius: '4px' }} onError={(e) => { e.target.src = '/assets/product_sample.png'; }} />
                              <div style={{ flex: 1, minWidth: 0 }}>
                                <div style={{ fontSize: '0.78rem', fontWeight: 600 }}>{c.label}</div>
                              </div>
                              <button type="button" className="btn-admin-outline" style={{ padding: '0.3rem' }} onClick={() => handleOpenEditCategoryModal(c)}>
                                <Edit size={12} />
                              </button>
                              <button type="button" className="btn-admin-outline" style={{ padding: '0.3rem', color: '#dc2626', borderColor: '#fee2e2' }} onClick={() => handleDeleteCategory(c.id)}>
                                <Trash2 size={12} />
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}

                  {/* 4. FEATURED SPOTLIGHT FORM */}
                  {selectedHomeSection === 'spotlight' && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                      <div className="form-group">
                        <label className="form-label" style={{ fontSize: '0.75rem', fontWeight: 600 }}>Select Fragrance Masterpiece *</label>
                        <select 
                          className="form-select"
                          value={selectedSpotlightId}
                          onChange={(e) => {
                            const newId = e.target.value;
                            setSelectedSpotlightId(newId);
                            products.forEach(p => {
                              if (p.id === newId) updateProduct(p.id, { ...p, isHeroProduct: true });
                              else if (p.isHeroProduct) updateProduct(p.id, { ...p, isHeroProduct: false });
                            });
                          }}
                        >
                          {products.map(p => (
                            <option key={p.id} value={p.id}>{p.name} ({p.type} · ₹{p.price})</option>
                          ))}
                        </select>
                      </div>
                      <button type="button" className="btn-admin-primary" style={{ width: '100%', padding: '0.75rem', fontSize: '0.82rem' }} onClick={handleHomeFormSubmit}>
                        Save Spotlight Selection
                      </button>
                    </div>
                  )}

                  {/* 5. HIGHLIGHTS / VALUE PROPS FORM */}
                  {selectedHomeSection === 'highlights' && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                      <div className="form-group">
                        <label className="form-label" style={{ fontSize: '0.75rem' }}>Section Title *</label>
                        <input 
                          type="text" 
                          className="form-input" 
                          value={homeForm.highlightsTitle} 
                          onChange={(e) => setHomeForm(prev => ({ ...prev, highlightsTitle: e.target.value }))} 
                        />
                      </div>

                      <div style={{ borderTop: '1px solid var(--border-light)', paddingTop: '0.6rem' }}>
                        <div style={{ fontWeight: 600, fontSize: '0.75rem', marginBottom: '0.3rem' }}>Pillar 1: {homeForm.highlight1Title}</div>
                        <input type="text" className="form-input" style={{ marginBottom: '0.3rem' }} value={homeForm.highlight1Title} onChange={(e) => setHomeForm(prev => ({ ...prev, highlight1Title: e.target.value }))} />
                        <textarea className="form-input" style={{ height: '50px' }} value={homeForm.highlight1Desc} onChange={(e) => setHomeForm(prev => ({ ...prev, highlight1Desc: e.target.value }))} />
                      </div>

                      <div style={{ borderTop: '1px solid var(--border-light)', paddingTop: '0.6rem' }}>
                        <div style={{ fontWeight: 600, fontSize: '0.75rem', marginBottom: '0.3rem' }}>Pillar 2: {homeForm.highlight2Title}</div>
                        <input type="text" className="form-input" style={{ marginBottom: '0.3rem' }} value={homeForm.highlight2Title} onChange={(e) => setHomeForm(prev => ({ ...prev, highlight2Title: e.target.value }))} />
                        <textarea className="form-input" style={{ height: '50px' }} value={homeForm.highlight2Desc} onChange={(e) => setHomeForm(prev => ({ ...prev, highlight2Desc: e.target.value }))} />
                      </div>

                      <div style={{ borderTop: '1px solid var(--border-light)', paddingTop: '0.6rem' }}>
                        <div style={{ fontWeight: 600, fontSize: '0.75rem', marginBottom: '0.3rem' }}>Pillar 3: {homeForm.highlight3Title}</div>
                        <input type="text" className="form-input" style={{ marginBottom: '0.3rem' }} value={homeForm.highlight3Title} onChange={(e) => setHomeForm(prev => ({ ...prev, highlight3Title: e.target.value }))} />
                        <textarea className="form-input" style={{ height: '50px' }} value={homeForm.highlight3Desc} onChange={(e) => setHomeForm(prev => ({ ...prev, highlight3Desc: e.target.value }))} />
                      </div>

                      <button type="button" className="btn-admin-primary" style={{ width: '100%', padding: '0.75rem', fontSize: '0.82rem' }} onClick={handleHomeFormSubmit}>
                        Save Highlights
                      </button>
                    </div>
                  )}

                  {/* 6. STORY 1 FORM */}
                  {selectedHomeSection === 'story1' && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                      <div className="form-group">
                        <label className="form-label" style={{ fontSize: '0.75rem' }}>Section Overline *</label>
                        <input type="text" className="form-input" value={homeForm.storyTitle} onChange={(e) => setHomeForm(prev => ({ ...prev, storyTitle: e.target.value }))} />
                      </div>

                      <div className="form-group">
                        <label className="form-label" style={{ fontSize: '0.75rem' }}>Heading Title *</label>
                        <input type="text" className="form-input" value={homeForm.storyOneHeading} onChange={(e) => setHomeForm(prev => ({ ...prev, storyOneHeading: e.target.value }))} />
                      </div>

                      <div className="form-group">
                        <label className="form-label" style={{ fontSize: '0.75rem' }}>Body Copy *</label>
                        <textarea className="form-input" style={{ height: '90px' }} value={homeForm.storyOneBody} onChange={(e) => setHomeForm(prev => ({ ...prev, storyOneBody: e.target.value }))} />
                      </div>

                      <div className="form-group">
                        <label className="form-label" style={{ fontSize: '0.75rem' }}>Illustration Image *</label>
                        <input type="text" className="form-input" value={homeForm.storyOneImage} onChange={(e) => setHomeForm(prev => ({ ...prev, storyOneImage: e.target.value }))} />
                      </div>

                      <button type="button" className="btn-admin-primary" style={{ width: '100%', padding: '0.75rem', fontSize: '0.82rem' }} onClick={handleHomeFormSubmit}>
                        Save Story Panel 1
                      </button>
                    </div>
                  )}

                  {/* 7. STORY 2 FORM */}
                  {selectedHomeSection === 'story2' && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                      <div className="form-group">
                        <label className="form-label" style={{ fontSize: '0.75rem' }}>Heading Title *</label>
                        <input type="text" className="form-input" value={homeForm.storyTwoHeading} onChange={(e) => setHomeForm(prev => ({ ...prev, storyTwoHeading: e.target.value }))} />
                      </div>

                      <div className="form-group">
                        <label className="form-label" style={{ fontSize: '0.75rem' }}>Body Copy *</label>
                        <textarea className="form-input" style={{ height: '90px' }} value={homeForm.storyTwoBody} onChange={(e) => setHomeForm(prev => ({ ...prev, storyTwoBody: e.target.value }))} />
                      </div>

                      <div className="form-group">
                        <label className="form-label" style={{ fontSize: '0.75rem' }}>Illustration Image *</label>
                        <input type="text" className="form-input" value={homeForm.storyTwoImage} onChange={(e) => setHomeForm(prev => ({ ...prev, storyTwoImage: e.target.value }))} />
                      </div>

                      <button type="button" className="btn-admin-primary" style={{ width: '100%', padding: '0.75rem', fontSize: '0.82rem' }} onClick={handleHomeFormSubmit}>
                        Save Story Panel 2
                      </button>
                    </div>
                  )}

                  {/* 8. FOOTER FORM */}
                  {selectedHomeSection === 'footer' && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                      <div className="form-group">
                        <label className="form-label" style={{ fontSize: '0.75rem' }}>Brand About Blurb *</label>
                        <textarea className="form-input" style={{ height: '70px' }} value={homeForm.footerAbout} onChange={(e) => setHomeForm(prev => ({ ...prev, footerAbout: e.target.value }))} />
                      </div>

                      <div className="form-group">
                        <label className="form-label" style={{ fontSize: '0.75rem' }}>Copyright Line *</label>
                        <input type="text" className="form-input" value={homeForm.footerCopyright} onChange={(e) => setHomeForm(prev => ({ ...prev, footerCopyright: e.target.value }))} />
                      </div>

                      <button type="button" className="btn-admin-primary" style={{ width: '100%', padding: '0.75rem', fontSize: '0.82rem' }} onClick={handleHomeFormSubmit}>
                        Save Footer Settings
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* RIGHT LIVE CANVAS PREVIEW WITH TOUCH / CLICK-TO-EDIT */}
        <div className={`wp-canvas-pane ${previewMode === 'edit' ? 'wp-edit-mode' : ''} ${mobileBuilderTab === 'editor' ? 'wp-mobile-pane-hidden' : ''}`}>
          <div className={`wp-device-frame ${previewDevice}`}>
            
            {/* 1. ANNOUNCEMENT BAR (CLICK TO EDIT) */}
            <div 
              className={`wp-editable-section ${selectedHomeSection === 'announcement' ? 'is-active' : ''}`}
              onClick={() => handleSectionSelect('announcement')}
            >
              <div className="wp-section-hover-badge">
                <Edit size={11} /> Click to edit Announcement &amp; Support
              </div>
              {selectedHomeSection === 'announcement' && (
                <div className="wp-section-active-toolbar">
                  <Sparkles size={11} /> EDITING: Announcement Bar
                </div>
              )}

              <div className="announcement-bar-premium" style={{ height: '38px', background: '#111', borderBottom: '1px solid rgba(197, 160, 89, 0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <span style={{ fontSize: '0.72rem', color: 'var(--color-gold)', display: 'inline-flex', alignItems: 'center', gap: '0.4rem', fontWeight: 600, letterSpacing: '0.05em' }}>
                  <Gift size={12} />
                  {homeForm.announcementText || 'VESPERA LUXURY PARFUMS INTERACTIVE EXPERIENCE'}
                </span>
              </div>
            </div>

            {/* 2. HERO SLIDESHOW BANNERS (CLICK TO EDIT) */}
            <div 
              className={`wp-editable-section ${selectedHomeSection === 'hero' ? 'is-active' : ''}`}
              onClick={() => handleSectionSelect('hero')}
            >
              <div className="wp-section-hover-badge">
                <Edit size={11} /> Click to edit Hero Slideshow Banners
              </div>
              {selectedHomeSection === 'hero' && (
                <div className="wp-section-active-toolbar">
                  <Sparkles size={11} /> EDITING: Hero Slideshow
                </div>
              )}

              {(() => {
                const currentBanner = banners[0] || {
                  title: bannerTitle || 'New Signature\nScent Arrived',
                  subtitle: bannerSubtitle || 'VESPERA PARFUMS',
                  description: bannerDesc || 'Experience the essence of artisanal perfumery.',
                  image: bannerImage || '/assets/hero_perfume_v6.jpg'
                };
                return (
                  <div className="hero-split-section" style={{ minHeight: '340px', height: 'auto', gridTemplateColumns: previewDevice === 'mobile' ? '1fr' : '1fr 1fr' }}>
                    <div className="hero-split-left" style={{ padding: '2rem 1.5rem', justifyContent: 'center' }}>
                      <span className="hero-eyebrow" style={{ fontSize: '0.62rem', marginBottom: '0.3rem' }}>
                        {currentBanner.subtitle || 'VESPERA PARFUMS'}
                      </span>
                      <h1 className="hero-title" style={{ fontSize: '1.3rem', lineHeight: 1.25, marginBottom: '0.6rem' }}>
                        {(currentBanner.title || 'New Signature\nScent Arrived').split('\n').map((l, i) => (
                          <React.Fragment key={i}>{l}<br /></React.Fragment>
                        ))}
                      </h1>
                      <p className="hero-description" style={{ fontSize: '0.75rem', marginBottom: '1rem', lineHeight: 1.4 }}>
                        {currentBanner.description}
                      </p>
                      <div>
                        <span className="hero-btn-primary" style={{ padding: '0.4rem 0.9rem', fontSize: '0.72rem', display: 'inline-flex', alignItems: 'center', gap: '0.3rem' }}>
                          Explore Masterpieces <ArrowRight size={11} />
                        </span>
                      </div>
                    </div>
                    <div className="hero-split-right" style={{ minHeight: previewDevice === 'mobile' ? '180px' : 'auto' }}>
                      <img 
                        src={currentBanner.image} 
                        alt="" 
                        className="hero-split-img" 
                        style={{ transform: 'none', height: '100%', objectFit: 'cover' }}
                        onError={(e) => { e.target.src = '/assets/hero_perfume_v6.jpg'; }}
                      />
                    </div>
                  </div>
                );
              })()}
            </div>

            {/* 3. CATEGORIES SHOWCASE GRID (CLICK TO EDIT) */}
            <div 
              className={`wp-editable-section ${selectedHomeSection === 'categories' ? 'is-active' : ''}`}
              onClick={() => handleSectionSelect('categories')}
              style={{ padding: '1.5rem 1rem', background: '#faf6f0' }}
            >
              <div className="wp-section-hover-badge">
                <Edit size={11} /> Click to edit Category Cards Grid
              </div>
              {selectedHomeSection === 'categories' && (
                <div className="wp-section-active-toolbar">
                  <Sparkles size={11} /> EDITING: Categories Showcase
                </div>
              )}

              <div style={{ textAlign: 'center', marginBottom: '1rem' }}>
                <span style={{ fontSize: '0.6rem', textTransform: 'uppercase', letterSpacing: '0.15em', color: 'var(--color-gold-deep)', fontWeight: 700 }}>
                  The Olfactive Repertoire
                </span>
                <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.2rem', margin: '0.2rem 0 0', fontWeight: 400 }}>
                  Shop Fragrances by Category
                </h3>
              </div>

              <div className="category-cards-grid" style={{ gridTemplateColumns: previewDevice === 'mobile' ? 'repeat(2, 1fr)' : 'repeat(4, 1fr)', gap: '0.5rem' }}>
                {categories.slice(0, 4).map((c) => (
                  <div key={c.id} className="category-card" style={{ height: '90px' }}>
                    <img src={c.image} alt="" className="category-card-img" onError={(e) => { e.target.src = '/assets/product_sample.png'; }} />
                    <div className="category-card-overlay" />
                    <div className="category-card-content" style={{ padding: '0.4rem' }}>
                      <span className="category-card-title" style={{ fontSize: '0.65rem' }}>{c.label}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* 4. FEATURED SPOTLIGHT (CLICK TO EDIT) */}
            <div 
              className={`wp-editable-section ${selectedHomeSection === 'spotlight' ? 'is-active' : ''}`}
              onClick={() => handleSectionSelect('spotlight')}
            >
              <div className="wp-section-hover-badge">
                <Edit size={11} /> Click to edit Featured Scent Spotlight
              </div>
              {selectedHomeSection === 'spotlight' && (
                <div className="wp-section-active-toolbar">
                  <Sparkles size={11} /> EDITING: Featured Spotlight
                </div>
              )}

              {(() => {
                const spot = products.find(p => p.id === selectedSpotlightId) || products[0];
                if (!spot) return null;
                return (
                  <div style={{ background: '#0e0e0e', color: '#fff', padding: '1.8rem 1.5rem', borderTop: '1px solid rgba(197, 160, 89, 0.3)', borderBottom: '1px solid rgba(197, 160, 89, 0.3)' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: previewDevice === 'mobile' ? '1fr' : '1fr 1.2fr', gap: '1.2rem', alignItems: 'center' }}>
                      <img 
                        src={spot.images?.[0] || spot.image} 
                        alt="" 
                        style={{ width: '100%', height: '180px', objectFit: 'cover', borderRadius: '4px' }} 
                        onError={(e) => { e.target.src = '/assets/product_blue.jpg'; }}
                      />
                      <div>
                        <span style={{ fontSize: '0.6rem', textTransform: 'uppercase', letterSpacing: '0.15em', color: 'var(--color-gold)', fontWeight: 700 }}>
                          Signature Masterpiece
                        </span>
                        <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.2rem', margin: '0.2rem 0 0.2rem', color: '#fff' }}>
                          {spot.name}
                        </h3>
                        <span style={{ fontSize: '0.68rem', color: 'rgba(255,255,255,0.5)', display: 'block', marginBottom: '0.4rem' }}>
                          {spot.type} · {spot.size}
                        </span>
                        <p style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.7)', lineHeight: 1.4, margin: '0 0 0.8rem', WebkitLineClamp: 3, display: '-webkit-box', WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                          {spot.description}
                        </p>
                        <div style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--color-gold)' }}>
                          ₹{spot.price}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })()}
            </div>

            {/* 5. HIGHLIGHTS / VALUE PILLARS (CLICK TO EDIT) */}
            <div 
              className={`wp-editable-section ${selectedHomeSection === 'highlights' ? 'is-active' : ''}`}
              onClick={() => handleSectionSelect('highlights')}
              style={{ padding: '1.5rem 1rem', background: '#fff' }}
            >
              <div className="wp-section-hover-badge">
                <Edit size={11} /> Click to edit Highlights Panel
              </div>
              {selectedHomeSection === 'highlights' && (
                <div className="wp-section-active-toolbar">
                  <Sparkles size={11} /> EDITING: Highlights
                </div>
              )}

              <div style={{ textAlign: 'center', marginBottom: '1rem' }}>
                <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.15rem', margin: 0, fontWeight: 400 }}>
                  {homeForm.highlightsTitle || 'The Art of Haute Parfumerie'}
                </h3>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: previewDevice === 'mobile' ? '1fr' : 'repeat(3, 1fr)', gap: '0.6rem' }}>
                <div style={{ textAlign: 'center', padding: '0.6rem', background: '#faf6f0', borderRadius: '4px' }}>
                  <Compass size={18} style={{ color: 'var(--color-gold-deep)', margin: '0 auto 0.3rem' }} />
                  <div style={{ fontSize: '0.75rem', fontWeight: 600 }}>{homeForm.highlight1Title}</div>
                  <p style={{ fontSize: '0.65rem', color: '#666', margin: '0.2rem 0 0', lineHeight: 1.3 }}>{homeForm.highlight1Desc}</p>
                </div>
                <div style={{ textAlign: 'center', padding: '0.6rem', background: '#faf6f0', borderRadius: '4px' }}>
                  <Leaf size={18} style={{ color: 'var(--color-gold-deep)', margin: '0 auto 0.3rem' }} />
                  <div style={{ fontSize: '0.75rem', fontWeight: 600 }}>{homeForm.highlight2Title}</div>
                  <p style={{ fontSize: '0.65rem', color: '#666', margin: '0.2rem 0 0', lineHeight: 1.3 }}>{homeForm.highlight2Desc}</p>
                </div>
                <div style={{ textAlign: 'center', padding: '0.6rem', background: '#faf6f0', borderRadius: '4px' }}>
                  <Award size={18} style={{ color: 'var(--color-gold-deep)', margin: '0 auto 0.3rem' }} />
                  <div style={{ fontSize: '0.75rem', fontWeight: 600 }}>{homeForm.highlight3Title}</div>
                  <p style={{ fontSize: '0.65rem', color: '#666', margin: '0.2rem 0 0', lineHeight: 1.3 }}>{homeForm.highlight3Desc}</p>
                </div>
              </div>
            </div>

            {/* 6. STORY PANEL 1 (CLICK TO EDIT) */}
            <div 
              className={`wp-editable-section ${selectedHomeSection === 'story1' ? 'is-active' : ''}`}
              onClick={() => handleSectionSelect('story1')}
              style={{ padding: '1.2rem', background: '#faf6f0', borderTop: '1px solid var(--border-light)' }}
            >
              <div className="wp-section-hover-badge">
                <Edit size={11} /> Click to edit Story Panel 1
              </div>
              {selectedHomeSection === 'story1' && (
                <div className="wp-section-active-toolbar">
                  <Sparkles size={11} /> EDITING: Story Panel 1
                </div>
              )}

              <div style={{ display: 'grid', gridTemplateColumns: previewDevice === 'mobile' ? '1fr' : '1.1fr 1fr', gap: '1rem', alignItems: 'center' }}>
                <img 
                  src={homeForm.storyOneImage || '/assets/story_one.png'} 
                  alt="" 
                  style={{ width: '100%', height: '140px', objectFit: 'cover', borderRadius: '4px' }} 
                  onError={(e) => { e.target.src = '/assets/story_one.png'; }}
                />
                <div>
                  <span style={{ fontSize: '0.58rem', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--color-gold-deep)', fontWeight: 700 }}>
                    {homeForm.storyTitle}
                  </span>
                  <h4 style={{ fontFamily: 'var(--font-serif)', fontSize: '1rem', margin: '0.2rem 0 0.4rem', lineHeight: 1.3 }}>
                    {homeForm.storyOneHeading}
                  </h4>
                  <p style={{ fontSize: '0.68rem', color: '#555', lineHeight: 1.4, margin: 0, WebkitLineClamp: 3, display: '-webkit-box', WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                    {homeForm.storyOneBody}
                  </p>
                </div>
              </div>
            </div>

            {/* 7. STORY PANEL 2 (CLICK TO EDIT) */}
            <div 
              className={`wp-editable-section ${selectedHomeSection === 'story2' ? 'is-active' : ''}`}
              onClick={() => handleSectionSelect('story2')}
              style={{ padding: '1.2rem', background: '#fff', borderTop: '1px solid var(--border-light)' }}
            >
              <div className="wp-section-hover-badge">
                <Edit size={11} /> Click to edit Story Panel 2
              </div>
              {selectedHomeSection === 'story2' && (
                <div className="wp-section-active-toolbar">
                  <Sparkles size={11} /> EDITING: Story Panel 2
                </div>
              )}

              <div style={{ display: 'grid', gridTemplateColumns: previewDevice === 'mobile' ? '1fr' : '1fr 1.1fr', gap: '1rem', alignItems: 'center' }}>
                <div>
                  <h4 style={{ fontFamily: 'var(--font-serif)', fontSize: '1rem', margin: '0.2rem 0 0.4rem', lineHeight: 1.3 }}>
                    {homeForm.storyTwoHeading}
                  </h4>
                  <p style={{ fontSize: '0.68rem', color: '#555', lineHeight: 1.4, margin: 0, WebkitLineClamp: 3, display: '-webkit-box', WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                    {homeForm.storyTwoBody}
                  </p>
                </div>
                <img 
                  src={homeForm.storyTwoImage || '/assets/story_two.png'} 
                  alt="" 
                  style={{ width: '100%', height: '140px', objectFit: 'cover', borderRadius: '4px' }} 
                  onError={(e) => { e.target.src = '/assets/story_two.png'; }}
                />
              </div>
            </div>

            {/* 8. FOOTER (CLICK TO EDIT) */}
            <div 
              className={`wp-editable-section ${selectedHomeSection === 'footer' ? 'is-active' : ''}`}
              onClick={() => handleSectionSelect('footer')}
              style={{ background: '#111', color: '#fff', padding: '1.5rem', textAlign: 'center' }}
            >
              <div className="wp-section-hover-badge">
                <Edit size={11} /> Click to edit Footer Details
              </div>
              {selectedHomeSection === 'footer' && (
                <div className="wp-section-active-toolbar">
                  <Sparkles size={11} /> EDITING: Footer &amp; Copyright
                </div>
              )}

              <div style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--color-gold)', letterSpacing: '0.15em', marginBottom: '0.4rem' }}>
                VESPERA
              </div>
              <p style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.7)', maxWidth: '400px', margin: '0 auto 0.8rem', lineHeight: 1.4 }}>
                {homeForm.footerAbout}
              </p>
              <div style={{ fontSize: '0.62rem', color: 'rgba(255,255,255,0.4)', borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '0.6rem' }}>
                {homeForm.footerCopyright}
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
