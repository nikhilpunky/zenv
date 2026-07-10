import React, { useContext, useState } from 'react';
import { AppContext } from '../context/AppContext';
import { Trash2, Edit, Plus, X, Image, FileUp, LogOut, ChevronLeft, AlertCircle } from 'lucide-react';
import './AdminDashboard.css';

export default function AdminDashboard() {
  const {
    products,
    addProduct,
    updateProduct,
    deleteProduct,
    isAdminMode,
    adminLogin,
    adminLogout,
    setIsAdminMode,
    isAdminAuthenticated,
    coupons,
    addCoupon,
    deleteCoupon,
    toggleCouponActive
  } = useContext(AppContext);

  // Dashboard Tabs
  const [activeTab, setActiveTab] = useState('products'); // 'products' or 'coupons'

  // Auth States
  const [passwordInput, setPasswordInput] = useState('');
  const [authError, setAuthError] = useState('');

  // Modal States
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCouponModalOpen, setIsCouponModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null); // null means "Add New"

  // Coupon Form States
  const [couponCode, setCouponCode] = useState('');
  const [couponType, setCouponType] = useState('percentage');
  const [couponValue, setCouponValue] = useState(10);
  const [couponMinSubtotal, setCouponMinSubtotal] = useState(500);

  // Form Fields State
  const [formId, setFormId] = useState('');
  const [formName, setFormName] = useState('');
  const [formType, setFormType] = useState('Eau de Parfum');
  const [formSize, setFormSize] = useState('50ml');
  const [formNotes, setFormNotes] = useState('');
  const [formCategory, setFormCategory] = useState('unisex');
  const [formMRP, setFormMRP] = useState(2499);
  const [formPrice, setFormPrice] = useState(1199);
  const [formStock, setFormStock] = useState(15);
  const [formDescription, setFormDescription] = useState('');
  const [formLongDescription, setFormLongDescription] = useState('');
  const [formTopNotes, setFormTopNotes] = useState('');
  const [formHeartNotes, setFormHeartNotes] = useState('');
  const [formBaseNotes, setFormBaseNotes] = useState('');
  const [formLongevity, setFormLongevity] = useState('8-10 Hours');
  const [formProjection, setFormProjection] = useState('Moderate to Strong');
  const [formOccasion, setFormOccasion] = useState('Daily Wear & Special Occasions');
  const [formHowToUse, setFormHowToUse] = useState('Spray 2-3 times on pulse points.');
  
  // Image manager field states
  const [formImages, setFormImages] = useState([]); // List of base64/URL strings
  const [newImageUrl, setNewImageUrl] = useState('');
  const [uploadFileName, setUploadFileName] = useState('');

  // Notification Alert state
  const [alertMsg, setAlertMsg] = useState(null); // { type: 'success' | 'danger', text: '' }

  const showAlert = (text, type = 'success') => {
    setAlertMsg({ text, type });
    setTimeout(() => setAlertMsg(null), 4000);
  };

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    const success = adminLogin(passwordInput);
    if (success) {
      setAuthError('');
      setPasswordInput('');
      window.history.replaceState(null, '', window.location.origin);
    } else {
      setAuthError('Incorrect password. Please try again.');
    }
  };

  const handleCancelLogin = () => {
    // Return to main site view
    setIsAdminMode(false);
    window.history.replaceState(null, '', window.location.origin);
  };

  // Open modal for Adding a new product
  const handleOpenAddModal = () => {
    setEditingProduct(null);
    setFormId('');
    setFormName('');
    setFormType('Eau de Parfum');
    setFormSize('50ml');
    setFormNotes('');
    setFormCategory('unisex');
    setFormMRP(2499);
    setFormPrice(1199);
    setFormStock(15);
    setFormDescription('');
    setFormLongDescription('');
    setFormTopNotes('');
    setFormHeartNotes('');
    setFormBaseNotes('');
    setFormLongevity('8-10 Hours');
    setFormProjection('Moderate to Strong');
    setFormOccasion('Daily Wear & Special Occasions');
    setFormHowToUse('Spray 2-3 times on pulse points.');
    setFormImages([]);
    setNewImageUrl('');
    setUploadFileName('');
    setIsModalOpen(true);
  };

  // Open modal for Editing an existing product
  const handleOpenEditModal = (product) => {
    setEditingProduct(product);
    setFormId(product.id);
    setFormName(product.name || '');
    setFormType(product.type || 'Eau de Parfum');
    setFormSize(product.size || '50ml');
    setFormNotes(product.notes || '');
    setFormCategory(product.category || 'unisex');
    setFormMRP(product.mrp || product.price || 0);
    setFormPrice(product.price || 0);
    setFormStock(typeof product.stock === 'number' ? product.stock : 15);
    setFormDescription(product.description || '');
    setFormLongDescription(product.longDescription || '');
    setFormTopNotes(product.olfactiveNotes?.top || '');
    setFormHeartNotes(product.olfactiveNotes?.heart || '');
    setFormBaseNotes(product.olfactiveNotes?.base || '');
    setFormLongevity(product.longevity || '8-10 Hours');
    setFormProjection(product.projection || 'Moderate to Strong');
    setFormOccasion(product.occasion || 'Daily Wear & Special Occasions');
    setFormHowToUse(product.howToUse || 'Spray 2-3 times on pulse points.');
    setFormImages(Array.isArray(product.images) ? [...product.images] : [product.image].filter(Boolean));
    setNewImageUrl('');
    setUploadFileName('');
    setIsModalOpen(true);
  };

  const handleImageFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setUploadFileName(file.name);
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormImages(prev => [...prev, reader.result]);
        setUploadFileName('');
        showAlert('Image uploaded and added successfully!', 'success');
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddImageUrl = () => {
    if (!newImageUrl.trim()) return;
    setFormImages(prev => [...prev, newImageUrl.trim()]);
    setNewImageUrl('');
    showAlert('Image URL added to list.', 'success');
  };

  const handleRemoveImage = (index) => {
    setFormImages(prev => prev.filter((_, idx) => idx !== index));
    showAlert('Image removed from collection.', 'success');
  };

  const handleDeleteProductClick = (id, name) => {
    if (window.confirm(`Are you sure you want to delete "${name}"?`)) {
      deleteProduct(id);
      showAlert(`"${name}" has been deleted.`, 'success');
    }
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();

    if (!formName.trim()) {
      alert('Product Name is required.');
      return;
    }

    const olfactiveNotes = {
      top: formTopNotes.trim(),
      heart: formHeartNotes.trim(),
      base: formBaseNotes.trim()
    };

    const productPayload = {
      name: formName.trim(),
      type: formType.trim(),
      size: formSize.trim(),
      notes: formNotes.trim(),
      category: formCategory,
      mrp: Number(formMRP),
      price: Number(formPrice),
      stock: Number(formStock),
      description: formDescription.trim(),
      longDescription: formLongDescription.trim(),
      olfactiveNotes,
      longevity: formLongevity.trim(),
      projection: formProjection.trim(),
      occasion: formOccasion.trim(),
      howToUse: formHowToUse.trim(),
      images: formImages.length > 0 ? formImages : ['/assets/discovery_set.png'],
      isDiscovery: formCategory === 'discovery',
    };

    if (editingProduct) {
      updateProduct(editingProduct.id, productPayload);
      showAlert(`Successfully updated product "${formName}".`, 'success');
    } else {
      const generatedId = formName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') || `prod-${Date.now()}`;
      // Double check ID uniqueness
      const exists = products.some(p => p.id === generatedId);
      const uniqueId = exists ? `${generatedId}-${Date.now()}` : generatedId;

      addProduct({
        ...productPayload,
        id: uniqueId,
      });
      showAlert(`Successfully added new product "${formName}".`, 'success');
    }

    setIsModalOpen(false);
  };

  // Auth Gateway view if not logged in
  if (!isAdminAuthenticated) {
    return (
      <div className="auth-gateway-overlay">
        <div className="auth-card">
          <h2 className="auth-title">Z E N V</h2>
          <div className="auth-subtitle">Protected Admin Console</div>
          
          <form onSubmit={handleLoginSubmit}>
            <div className="auth-form-group">
              <label className="auth-label" htmlFor="admin-pass">Access Password</label>
              <input
                id="admin-pass"
                type="password"
                className="auth-input"
                placeholder="Enter password..."
                value={passwordInput}
                onChange={(e) => setPasswordInput(e.target.value)}
                autoFocus
              />
            </div>
            
            {authError && <div className="auth-error">{authError}</div>}
            
            <button type="submit" className="btn-admin-primary" style={{ width: '100%', marginBottom: '1rem' }}>
              Authenticate
            </button>
            
            <button type="button" className="btn-admin-outline" style={{ width: '100%' }} onClick={handleCancelLogin}>
              Cancel & Exit
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-container">
      {/* Header */}
      <header className="admin-header">
        <div className="admin-logo">
          ZENV <span>Admin Mode</span>
        </div>
        <div className="admin-nav-actions">
          <button className="btn-admin-outline" onClick={() => setIsAdminMode(false)}>
            <ChevronLeft size={14} style={{ marginRight: '0.4rem', verticalAlign: 'middle' }} />
            View Storefront
          </button>
          <button className="btn-admin-primary" onClick={adminLogout} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <LogOut size={14} />
            Logout
          </button>
        </div>
      </header>

      {/* Alert Notifications */}
      {alertMsg && (
        <div className={`admin-alert admin-alert-${alertMsg.type}`}>
          {alertMsg.text}
        </div>
      )}

      {/* Tab Navigation */}
      <div className="admin-tabs">
        <button 
          className={`admin-tab-btn ${activeTab === 'products' ? 'active' : ''}`}
          onClick={() => setActiveTab('products')}
        >
          Product Catalog
        </button>
        <button 
          className={`admin-tab-btn ${activeTab === 'coupons' ? 'active' : ''}`}
          onClick={() => setActiveTab('coupons')}
        >
          Coupon Codes
        </button>
      </div>

      {/* Product Catalog Section */}
      {activeTab === 'products' && (
        <>
          {/* Toolbar */}
          <div className="admin-toolbar">
            <div>
              <h1 className="admin-title">Product Catalog</h1>
              <span style={{ fontSize: '0.8rem', color: 'var(--color-charcoal-light)' }}>
                Managing {products.length} product(s) stored locally.
              </span>
            </div>
            <button className="btn-admin-primary" onClick={handleOpenAddModal} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Plus size={16} /> Add Product
            </button>
          </div>

          {/* Main product table */}
          {products.length === 0 ? (
            <div className="admin-empty-state">
              <h3 className="admin-empty-title">No Products Found</h3>
              <p className="admin-empty-desc">Get started by creating your very first catalog product.</p>
              <button className="btn-admin-primary" onClick={handleOpenAddModal}>
                Add First Product
              </button>
            </div>
          ) : (
            <div className="admin-table-wrapper">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Cover</th>
                    <th>Name / Type</th>
                    <th>Category</th>
                    <th>Stock</th>
                    <th>Price</th>
                    <th>MRP</th>
                    <th style={{ textAlign: 'right' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((prod) => {
                    const isOutOfStock = prod.stock <= 0;
                    return (
                      <tr key={prod.id}>
                        <td>
                          <img 
                            src={prod.images?.[0] || prod.image || '/assets/discovery_set.png'} 
                            alt={prod.name} 
                            className="admin-prod-thumb"
                          />
                        </td>
                        <td>
                          <div style={{ fontWeight: 500, color: 'var(--color-charcoal)' }}>{prod.name}</div>
                          <div style={{ fontSize: '0.75rem', color: 'var(--color-charcoal-light)' }}>
                            {prod.type} • {prod.size}
                          </div>
                        </td>
                        <td>
                          <span className="badge-category">{prod.category}</span>
                        </td>
                        <td>
                          <span className={`stock-indicator ${isOutOfStock ? 'out-of-stock' : (prod.stock < 5 ? 'low-stock' : 'in-stock')}`}>
                            {isOutOfStock ? 'Sold Out' : `${prod.stock} units`}
                          </span>
                        </td>
                        <td style={{ fontWeight: 600 }}>₹{prod.price}</td>
                        <td style={{ color: 'var(--color-charcoal-light)', textDecoration: 'line-through' }}>
                          ₹{prod.mrp}
                        </td>
                        <td style={{ textAlign: 'right' }}>
                          <div style={{ display: 'inline-flex', gap: '0.5rem' }}>
                            <button 
                              className="btn-admin-outline" 
                              style={{ padding: '0.4rem', borderRadius: '4px', border: '1px solid var(--border-light)' }} 
                              onClick={() => handleOpenEditModal(prod)}
                              title="Edit Product"
                              type="button"
                            >
                              <Edit size={14} />
                            </button>
                            <button 
                              className="btn-admin-outline" 
                              style={{ padding: '0.4rem', borderRadius: '4px', border: '1px solid #ffebee', color: '#c62828' }} 
                              onClick={() => handleDeleteProductClick(prod.id, prod.name)}
                              title="Delete Product"
                              type="button"
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </>
      )}

      {/* Coupon Codes Section */}
      {activeTab === 'coupons' && (
        <>
          {/* Coupon Toolbar */}
          <div className="admin-toolbar">
            <div>
              <h1 className="admin-title">Coupon Codes</h1>
              <span style={{ fontSize: '0.8rem', color: 'var(--color-charcoal-light)' }}>
                Managing {coupons?.length || 0} coupon(s) stored locally.
              </span>
            </div>
            <button className="btn-admin-primary" onClick={() => setIsCouponModalOpen(true)} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Plus size={16} /> Create Coupon
            </button>
          </div>

          {/* Main coupon content */}
          {(!coupons || coupons.length === 0) ? (
            <div className="admin-empty-state">
              <h3 className="admin-empty-title">No Coupons Found</h3>
              <p className="admin-empty-desc">Create your first coupon code to offer discounts at checkout.</p>
              <button className="btn-admin-primary" onClick={() => setIsCouponModalOpen(true)}>
                Create Coupon
              </button>
            </div>
          ) : (
            <div className="admin-table-wrapper">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Code</th>
                    <th>Type</th>
                    <th>Discount Value</th>
                    <th>Min Purchase (Subtotal)</th>
                    <th>Status</th>
                    <th style={{ textAlign: 'right' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {coupons.map((coupon) => (
                    <tr key={coupon.code}>
                      <td>
                        <span className="coupon-code-badge">{coupon.code}</span>
                      </td>
                      <td>
                        <span className="badge-category" style={{ background: '#e0f2fe', color: '#0369a1' }}>
                          {coupon.type === 'percentage' ? 'Percentage' : 'Fixed Amount'}
                        </span>
                      </td>
                      <td style={{ fontWeight: 600 }}>
                        {coupon.type === 'percentage' ? `${coupon.value}%` : `₹${coupon.value}`}
                      </td>
                      <td>₹{coupon.minSubtotal || 0}</td>
                      <td>
                        <button
                          type="button"
                          className={`btn-status-toggle ${coupon.isActive ? 'active' : 'inactive'}`}
                          onClick={() => toggleCouponActive(coupon.code)}
                          title={coupon.isActive ? "Deactivate Coupon" : "Activate Coupon"}
                        >
                          <span className="status-dot" />
                          {coupon.isActive ? 'Active' : 'Inactive'}
                        </button>
                      </td>
                      <td style={{ textAlign: 'right' }}>
                        <button 
                          className="btn-admin-outline" 
                          style={{ padding: '0.4rem', borderRadius: '4px', border: '1px solid #ffebee', color: '#c62828' }} 
                          onClick={() => {
                            if (window.confirm(`Are you sure you want to delete coupon "${coupon.code}"?`)) {
                              deleteCoupon(coupon.code);
                              showAlert(`Coupon "${coupon.code}" has been deleted.`, 'success');
                            }
                          }}
                          title="Delete Coupon"
                          type="button"
                        >
                          <Trash2 size={14} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </>
      )}

      {/* Create / Edit Modal */}
      {isModalOpen && (
        <div className="admin-modal-overlay">
          <div className="admin-modal">
            <div className="admin-modal-header">
              <h3 className="admin-modal-title">
                {editingProduct ? `Edit Product: ${editingProduct.name}` : 'Create New Product'}
              </h3>
              <button className="admin-modal-close" onClick={() => setIsModalOpen(false)}>
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleFormSubmit}>
              <div className="admin-modal-body">
                <div className="admin-form-grid">
                  
                  {/* Name */}
                  <div className="form-group">
                    <label className="form-label">Product Name *</label>
                    <input 
                      type="text" 
                      className="form-input" 
                      value={formName} 
                      onChange={(e) => setFormName(e.target.value)} 
                      placeholder="e.g. ZENV Gold" 
                      required
                    />
                  </div>

                  {/* Type */}
                  <div className="form-group">
                    <label className="form-label">Scent Type</label>
                    <input 
                      type="text" 
                      className="form-input" 
                      value={formType} 
                      onChange={(e) => setFormType(e.target.value)} 
                      placeholder="e.g. Eau de Parfum, Discovery Sets"
                    />
                  </div>

                  {/* Size */}
                  <div className="form-group">
                    <label className="form-label">Size / Volume</label>
                    <input 
                      type="text" 
                      className="form-input" 
                      value={formSize} 
                      onChange={(e) => setFormSize(e.target.value)} 
                      placeholder="e.g. 50ml, 5 × 8ml"
                    />
                  </div>

                  {/* Category */}
                  <div className="form-group">
                    <label className="form-label">Category</label>
                    <select 
                      className="form-select" 
                      value={formCategory} 
                      onChange={(e) => setFormCategory(e.target.value)}
                    >
                      <option value="unisex">Unisex Fragrances</option>
                      <option value="men">Masculine Collection</option>
                      <option value="women">Feminine Collection</option>
                      <option value="discovery">Discovery Sets</option>
                      <option value="oils">Perfume Oils</option>
                    </select>
                  </div>

                  {/* MRP */}
                  <div className="form-group">
                    <label className="form-label">MRP (₹) *</label>
                    <input 
                      type="number" 
                      className="form-input" 
                      value={formMRP} 
                      onChange={(e) => setFormMRP(e.target.value)} 
                      min="0"
                      required
                    />
                  </div>

                  {/* Price */}
                  <div className="form-group">
                    <label className="form-label">Offer Price (₹) *</label>
                    <input 
                      type="number" 
                      className="form-input" 
                      value={formPrice} 
                      onChange={(e) => setFormPrice(e.target.value)} 
                      min="0"
                      required
                    />
                  </div>

                  {/* Stock */}
                  <div className="form-group">
                    <label className="form-label">Stock Inventory *</label>
                    <input 
                      type="number" 
                      className="form-input" 
                      value={formStock} 
                      onChange={(e) => setFormStock(e.target.value)} 
                      min="0"
                      required
                    />
                  </div>

                  {/* Scent Notes Subtitle */}
                  <div className="form-group">
                    <label className="form-label">Scent Notes Subtitle</label>
                    <input 
                      type="text" 
                      className="form-input" 
                      value={formNotes} 
                      onChange={(e) => setFormNotes(e.target.value)} 
                      placeholder="e.g. Aqua · Lime · Jasmine"
                    />
                  </div>

                  {/* Short Description */}
                  <div className="form-group admin-form-col-full">
                    <label className="form-label">Short Description</label>
                    <textarea 
                      className="form-textarea" 
                      value={formDescription} 
                      onChange={(e) => setFormDescription(e.target.value)} 
                      placeholder="A short summary shown on the product card..."
                    />
                  </div>

                  {/* Long Description */}
                  <div className="form-group admin-form-col-full">
                    <label className="form-label">Detailed Description</label>
                    <textarea 
                      className="form-textarea" 
                      value={formLongDescription} 
                      onChange={(e) => setFormLongDescription(e.target.value)} 
                      placeholder="Full narrative description displayed in details modal..."
                    />
                  </div>

                  {/* IMAGE MANAGER SECTION */}
                  <div className="admin-form-col-full image-manager-section">
                    <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--color-charcoal)' }}>
                      <Image size={14} /> Product Image Gallery
                    </label>
                    <span style={{ fontSize: '0.7rem', color: 'var(--color-charcoal-light)', display: 'block', margin: '0.2rem 0 0.8rem' }}>
                      Add or upload images. The first image will be used as the product cover image.
                    </span>

                    {/* Image Previews */}
                    <div className="image-gallery-grid">
                      {formImages.map((img, idx) => (
                        <div className="image-gallery-item" key={idx}>
                          <img src={img} alt={`Gallery item ${idx}`} />
                          {idx === 0 && <span className="image-badge-primary">Cover</span>}
                          <button 
                            type="button" 
                            className="image-delete-btn" 
                            onClick={() => handleRemoveImage(idx)}
                            title="Remove Image"
                          >
                            <X size={10} />
                          </button>
                        </div>
                      ))}
                    </div>

                    {/* Add Image Controls */}
                    <div className="image-inputs-row">
                      {/* URL input */}
                      <div className="image-input-field-wrap">
                        <input 
                          type="text" 
                          className="form-input" 
                          style={{ flex: 1 }}
                          value={newImageUrl} 
                          onChange={(e) => setNewImageUrl(e.target.value)} 
                          placeholder="Paste image URL here..."
                        />
                        <button 
                          type="button" 
                          className="btn-admin-outline" 
                          onClick={handleAddImageUrl}
                          style={{ whiteSpace: 'nowrap' }}
                        >
                          Add URL
                        </button>
                      </div>

                      {/* File upload input */}
                      <div className="image-input-file-wrap">
                        <label className="file-input-custom-btn">
                          <FileUp size={14} style={{ marginRight: '0.4rem', verticalAlign: 'middle' }} />
                          Upload Local Image
                          <input 
                            type="file" 
                            accept="image/*" 
                            className="hidden-file-input" 
                            onChange={handleImageFileChange} 
                          />
                        </label>
                        {uploadFileName && <span className="file-name-display">{uploadFileName}</span>}
                      </div>
                    </div>
                  </div>

                  {/* Olfactive Notes details */}
                  <div className="admin-form-col-full nested-notes-group">
                    <h4 className="nested-notes-title">Olfactive Notes Breakdown</h4>
                    <div className="admin-form-grid" style={{ marginBottom: 0, gap: '1rem' }}>
                      <div className="form-group">
                        <label className="form-label">Top Notes</label>
                        <input 
                          type="text" 
                          className="form-input" 
                          value={formTopNotes} 
                          onChange={(e) => setFormTopNotes(e.target.value)} 
                          placeholder="e.g. Saffron, Incense"
                        />
                      </div>
                      <div className="form-group">
                        <label className="form-label">Heart Notes</label>
                        <input 
                          type="text" 
                          className="form-input" 
                          value={formHeartNotes} 
                          onChange={(e) => setFormHeartNotes(e.target.value)} 
                          placeholder="e.g. Amber, Agarwood"
                        />
                      </div>
                      <div className="form-group admin-form-col-full">
                        <label className="form-label">Base Notes</label>
                        <input 
                          type="text" 
                          className="form-input" 
                          value={formBaseNotes} 
                          onChange={(e) => setFormBaseNotes(e.target.value)} 
                          placeholder="e.g. Sandalwood, Musk"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Spec info */}
                  <div className="form-group">
                    <label className="form-label">Longevity</label>
                    <input 
                      type="text" 
                      className="form-input" 
                      value={formLongevity} 
                      onChange={(e) => setFormLongevity(e.target.value)} 
                      placeholder="e.g. 10-12 Hours"
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Projection</label>
                    <input 
                      type="text" 
                      className="form-input" 
                      value={formProjection} 
                      onChange={(e) => setFormProjection(e.target.value)} 
                      placeholder="e.g. Strong & Lasting"
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Occasion</label>
                    <input 
                      type="text" 
                      className="form-input" 
                      value={formOccasion} 
                      onChange={(e) => setFormOccasion(e.target.value)} 
                      placeholder="e.g. Evenings & Date Nights"
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Application Ritual / How To Use</label>
                    <input 
                      type="text" 
                      className="form-input" 
                      value={formHowToUse} 
                      onChange={(e) => setFormHowToUse(e.target.value)} 
                      placeholder="e.g. Spray on wrists and neck..."
                    />
                  </div>

                </div>
              </div>

              <div className="admin-modal-footer">
                <button type="button" className="btn-admin-outline" onClick={() => setIsModalOpen(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn-admin-primary">
                  {editingProduct ? 'Save Changes' : 'Create Product'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Coupon Create Modal */}
      {isCouponModalOpen && (
        <div className="admin-modal-overlay">
          <div className="admin-modal" style={{ maxWidth: '440px' }}>
            <div className="admin-modal-header">
              <h3 className="admin-modal-title">Create Coupon Code</h3>
              <button type="button" className="admin-modal-close" onClick={() => setIsCouponModalOpen(false)}>
                <X size={20} />
              </button>
            </div>

            <form onSubmit={(e) => {
              e.preventDefault();
              const result = addCoupon({
                code: couponCode,
                type: couponType,
                value: couponValue,
                minSubtotal: couponMinSubtotal,
                isActive: true
              });
              if (result && !result.success) {
                alert(result.error);
              } else {
                showAlert(`Successfully created coupon "${couponCode.toUpperCase().trim()}"`, 'success');
                setIsCouponModalOpen(false);
                setCouponCode('');
                setCouponType('percentage');
                setCouponValue(10);
                setCouponMinSubtotal(500);
              }
            }}>
              <div className="admin-modal-body" style={{ padding: '1.5rem' }}>
                <div className="admin-form-grid" style={{ gridTemplateColumns: '1fr', gap: '1.2rem', marginBottom: 0 }}>
                  
                  {/* Code */}
                  <div className="form-group">
                    <label className="form-label">Coupon Code (Alphanumeric) *</label>
                    <input 
                      type="text" 
                      className="form-input" 
                      value={couponCode} 
                      onChange={(e) => setCouponCode(e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, ''))} 
                      placeholder="e.g. FESTIVE20" 
                      required
                    />
                  </div>

                  {/* Type */}
                  <div className="form-group">
                    <label className="form-label">Discount Type *</label>
                    <select 
                      className="form-select" 
                      value={couponType} 
                      onChange={(e) => {
                        setCouponType(e.target.value);
                        if (e.target.value === 'percentage') {
                          setCouponValue(10);
                        } else {
                          setCouponValue(200);
                        }
                      }}
                    >
                      <option value="percentage">Percentage Discount (%)</option>
                      <option value="fixed">Fixed Amount Discount (₹)</option>
                    </select>
                  </div>

                  {/* Value */}
                  <div className="form-group">
                    <label className="form-label">
                      {couponType === 'percentage' ? 'Discount Percentage (%) *' : 'Discount Amount (₹) *'}
                    </label>
                    <input 
                      type="number" 
                      className="form-input" 
                      value={couponValue} 
                      onChange={(e) => setCouponValue(Math.max(1, Number(e.target.value)))} 
                      min="1"
                      max={couponType === 'percentage' ? "100" : undefined}
                      required
                    />
                  </div>

                  {/* Minimum Subtotal */}
                  <div className="form-group">
                    <label className="form-label">Minimum Purchase Amount (₹)</label>
                    <input 
                      type="number" 
                      className="form-input" 
                      value={couponMinSubtotal} 
                      onChange={(e) => setCouponMinSubtotal(Math.max(0, Number(e.target.value)))} 
                      min="0"
                      required
                    />
                  </div>

                </div>
              </div>

              <div className="admin-modal-footer">
                <button type="button" className="btn-admin-outline" onClick={() => setIsCouponModalOpen(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn-admin-primary">
                  Create Coupon
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
