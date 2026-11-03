import React, { useState } from 'react';
import { 
  ShoppingBag, Clock, Truck, DollarSign, Search, X, User, Phone, 
  Mail, MapPin, CreditCard, MessageSquare, FileText, Trash2, CheckCircle,
  AlertCircle
} from 'lucide-react';

export default function AdminOrdersTab({ 
  orders, 
  filteredOrders, 
  orderSearchTerm, 
  setOrderSearchTerm, 
  orderStatusFilter, 
  setOrderStatusFilter, 
  orderPaymentFilter, 
  setOrderPaymentFilter, 
  analyticsData, 
  updateOrderStatus, 
  deleteOrder, 
  setSelectedOrderInvoice, 
  showToast,
  packageMode = 'full_ecom'
}) {
  const is4999Mode = packageMode === '4999_package';

  return (
    <div className="orders-section">
      {/* Executive KPI Summary */}
      <div className="orders-kpi-grid">
        <div className="kpi-card">
          <div className="kpi-card-header">
            <span className="kpi-card-title">Total Bookings</span>
            <div className="kpi-icon-wrap gold">
              <ShoppingBag size={18} />
            </div>
          </div>
          <div className="kpi-card-value">{orders?.length || 0}</div>
          <span className="kpi-card-subtitle">Lifetime customer orders</span>
        </div>

        {is4999Mode ? (
          <>
            <div className="kpi-card">
              <div className="kpi-card-header">
                <span className="kpi-card-title">Cash on Delivery (COD)</span>
                <div className="kpi-icon-wrap amber" style={{ background: '#fffbeb', color: '#b45309' }}>
                  <CreditCard size={18} />
                </div>
              </div>
              <div className="kpi-card-value" style={{ color: '#b45309' }}>
                {orders?.filter(o => (o.paymentMethod || '').toLowerCase().includes('cod')).length || 0}
              </div>
              <span className="kpi-card-subtitle">Pay upon fragrance delivery</span>
            </div>

            <div className="kpi-card">
              <div className="kpi-card-header">
                <span className="kpi-card-title">Prepaid Bookings</span>
                <div className="kpi-icon-wrap green" style={{ background: '#ecfdf5', color: '#059669' }}>
                  <CheckCircle size={18} />
                </div>
              </div>
              <div className="kpi-card-value" style={{ color: '#059669' }}>
                {orders?.filter(o => !(o.paymentMethod || '').toLowerCase().includes('cod')).length || 0}
              </div>
              <span className="kpi-card-subtitle">Verified online payments</span>
            </div>
          </>
        ) : (
          <>
            <div className="kpi-card">
              <div className="kpi-card-header">
                <span className="kpi-card-title">Active Processing</span>
                <div className="kpi-icon-wrap blue" style={{ background: '#eff6ff', color: '#2563eb' }}>
                  <Clock size={18} />
                </div>
              </div>
              <div className="kpi-card-value" style={{ color: '#2563eb' }}>
                {orders?.filter(o => o.status === 'processing' || o.status === 'confirmed').length || 0}
              </div>
              <span className="kpi-card-subtitle">Awaiting dispatch</span>
            </div>

            <div className="kpi-card">
              <div className="kpi-card-header">
                <span className="kpi-card-title">Shipped &amp; In Transit</span>
                <div className="kpi-icon-wrap purple" style={{ background: '#f5f3ff', color: '#7c3aed' }}>
                  <Truck size={18} />
                </div>
              </div>
              <div className="kpi-card-value" style={{ color: '#7c3aed' }}>
                {orders?.filter(o => o.status === 'shipped').length || 0}
              </div>
              <span className="kpi-card-subtitle">On the way to clients</span>
            </div>
          </>
        )}

        <div className="kpi-card">
          <div className="kpi-card-header">
            <span className="kpi-card-title">Total Revenue</span>
            <div className="kpi-icon-wrap green" style={{ background: '#ecfdf5', color: '#059669' }}>
              <DollarSign size={18} />
            </div>
          </div>
          <div className="kpi-card-value" style={{ color: '#059669' }}>
            ₹{analyticsData.totalRevenue.toLocaleString('en-IN')}
          </div>
          <span className="kpi-card-subtitle">Gross booking sales</span>
        </div>
      </div>

      {/* Search and Filters Toolbar */}
      <div className="orders-filter-toolbar">
        <div className="orders-search-input-wrap">
          <Search size={16} className="orders-search-icon" />
          <input 
            type="text" 
            className="form-input orders-search-field" 
            placeholder="Search by client name, phone, email, PIN code, order ID, city..." 
            value={orderSearchTerm}
            onChange={(e) => setOrderSearchTerm(e.target.value)}
          />
          {orderSearchTerm && (
            <button 
              type="button"
              className="orders-search-clear-btn"
              onClick={() => setOrderSearchTerm('')} 
              aria-label="Clear search"
            >
              <X size={14} />
            </button>
          )}
        </div>

        {/* In 4999 Mode: Fulfillment status is removed. Show clean payment filter tabs */}
        {is4999Mode ? (
          <div className="orders-status-tabs">
            {[
              { id: 'ALL', label: 'All Bookings', count: orders?.length || 0 },
              { id: 'prepaid', label: 'Prepaid (Online)', count: orders?.filter(o => !(o.paymentMethod || '').toLowerCase().includes('cod')).length || 0 },
              { id: 'cod', label: 'Cash on Delivery (COD)', count: orders?.filter(o => (o.paymentMethod || '').toLowerCase().includes('cod')).length || 0 }
            ].map(tab => (
              <button
                key={tab.id}
                type="button"
                className={`order-status-tab-btn ${orderPaymentFilter === tab.id ? 'active' : ''}`}
                onClick={() => setOrderPaymentFilter(tab.id)}
              >
                {tab.label}
                <span style={{ marginLeft: '0.3rem', fontSize: '0.68rem', opacity: 0.7 }}>
                  ({tab.count})
                </span>
              </button>
            ))}
          </div>
        ) : (
          <>
            <div className="orders-status-tabs">
              {['ALL', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'].map((st) => (
                <button
                  key={st}
                  type="button"
                  className={`order-status-tab-btn ${orderStatusFilter === st ? 'active' : ''}`}
                  onClick={() => setOrderStatusFilter(st)}
                >
                  {st === 'ALL' ? 'All Orders' : st.charAt(0).toUpperCase() + st.slice(1)}
                  {st !== 'ALL' && (
                    <span style={{ marginLeft: '0.3rem', fontSize: '0.68rem', opacity: 0.7 }}>
                      ({orders?.filter(o => o.status?.toLowerCase() === st).length || 0})
                    </span>
                  )}
                </button>
              ))}
            </div>

            <select
              className="form-select orders-payment-select"
              value={orderPaymentFilter}
              onChange={(e) => setOrderPaymentFilter(e.target.value)}
              aria-label="Filter by payment method"
            >
              <option value="ALL">All Payments</option>
              <option value="prepaid">Prepaid (UPI / Card)</option>
              <option value="cod">Cash on Delivery (COD)</option>
            </select>
          </>
        )}
      </div>

      {/* Orders Cards List */}
      {filteredOrders.length === 0 ? (
        <div className="admin-empty-state">
          <ShoppingBag size={48} style={{ color: 'var(--color-gold)', margin: '0 auto 1rem', opacity: 0.8 }} />
          <h3 className="admin-empty-title">No Bookings Found</h3>
          <p className="admin-empty-desc">
            {orderSearchTerm ? `No bookings matched your search query "${orderSearchTerm}".` : 'No customer orders have been recorded in the system yet.'}
          </p>
          {(orderSearchTerm || orderPaymentFilter !== 'ALL' || (!is4999Mode && orderStatusFilter !== 'ALL')) && (
            <button className="btn-admin-outline" onClick={() => { setOrderSearchTerm(''); setOrderStatusFilter('ALL'); setOrderPaymentFilter('ALL'); }}>
              Clear Search Filters
            </button>
          )}
        </div>
      ) : (
        <div className="orders-list">
          {filteredOrders.map((order) => {
            const customer = order.customer || {};
            const items = order.items || [];
            const isPrepaid = (order.paymentMethod || '').toLowerCase().includes('prepaid') || (order.paymentMethod || '').toLowerCase().includes('upi') || (order.paymentMethod || '').toLowerCase().includes('card');
            const isCOD = (order.paymentMethod || '').toLowerCase().includes('cod');
            const rawPhone = (customer.phone || '').replace(/[^0-9]/g, '');
            const cleanPhone = rawPhone.startsWith('91') ? rawPhone : (rawPhone.length === 10 ? `91${rawPhone}` : rawPhone);
            const waMessage = encodeURIComponent(`Hello ${customer.name || 'Valued Client'}, greetings from VESPERA Luxury Parfums! We are contacting you regarding your fragrance booking #${order.id || order.order_reference}. Total: ₹${order.finalAmount || order.totalAmount}. Payment Mode: ${isPrepaid ? 'Prepaid' : 'COD'}.`);

            return (
              <div key={order.id || order.order_reference} className={`order-booking-card ${is4999Mode ? 'mode-4999' : ''}`}>
                {/* Column 1: Client Details & Delivery Address */}
                <div className="client-info-block">
                  <div className="client-name-row">
                    <div className="client-full-name">
                      <User size={16} style={{ color: 'var(--color-gold-deep)' }} />
                      <span>{customer.name || 'Anonymous Client'}</span>
                    </div>
                    {/* Fulfillment status badge only shown in Full E-commerce */}
                    {!is4999Mode && (
                      <span className={`order-status-badge ${order.status || 'confirmed'}`}>
                        {order.status || 'Confirmed'}
                      </span>
                    )}
                  </div>

                  <div className="client-meta-row">
                    <span style={{ fontWeight: 600, color: 'var(--color-charcoal-medium)' }}>
                      ID: <span style={{ fontFamily: 'monospace', color: 'var(--color-charcoal)' }}>{order.id || order.order_reference}</span>
                    </span>
                    <span>·</span>
                    <span style={{ fontSize: '0.72rem', color: 'var(--color-charcoal-light)' }}>
                      {order.createdAt ? new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }) : 'Recent'}
                    </span>
                  </div>

                  <div className="client-meta-row" style={{ marginTop: '0.2rem' }}>
                    <Phone size={13} style={{ color: 'var(--color-charcoal-light)' }} />
                    <span>{customer.phone || 'No phone provided'}</span>
                    {cleanPhone && (
                      <a 
                        href={`https://wa.me/${cleanPhone}?text=${waMessage}`}
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="client-wa-btn"
                        title="Chat with client on WhatsApp"
                      >
                        <MessageSquare size={11} /> WhatsApp
                      </a>
                    )}
                  </div>

                  {customer.email && (
                    <div className="client-meta-row">
                      <Mail size={13} style={{ color: 'var(--color-charcoal-light)' }} />
                      <a href={`mailto:${customer.email}`} style={{ color: '#2563eb', textDecoration: 'none' }}>
                        {customer.email}
                      </a>
                    </div>
                  )}

                  {/* Complete Delivery Address & High-Contrast PIN Code */}
                  <div className="client-address-box" style={{ marginTop: '0.4rem' }}>
                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.45rem' }}>
                      <MapPin size={14} style={{ color: 'var(--color-gold-deep)', flexShrink: 0, marginTop: '2px' }} />
                      <div style={{ flex: 1 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.25rem', flexWrap: 'wrap', gap: '0.3rem' }}>
                          <strong style={{ fontSize: '0.78rem', color: '#0f172a' }}>Delivery Address:</strong>
                          {customer.pincode && (
                            <span style={{ fontSize: '0.7rem', fontWeight: 800, background: '#0f172a', color: '#ffffff', padding: '0.15rem 0.5rem', border: '1px solid #0f172a', borderRadius: '4px', letterSpacing: '0.04em' }}>
                              PIN: {customer.pincode}
                            </span>
                          )}
                        </div>
                        <div style={{ fontSize: '0.76rem', color: '#334155', lineHeight: 1.45 }}>
                          {customer.address || `${customer.address1 || ''} ${customer.address2 || ''}, ${customer.landmark ? `Near ${customer.landmark}, ` : ''}${customer.city || ''}, ${customer.state || ''} - ${customer.pincode || ''}`}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Column 2: Items & Financial Details */}
                <div className="order-items-block">
                  <div style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--color-charcoal-light)', marginBottom: '0.2rem' }}>
                    Ordered Fragrances ({items.length})
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', maxHeight: '180px', overflowY: 'auto' }}>
                    {items.map((it, idx) => (
                      <div key={idx} className="order-item-row">
                        <img 
                          src={it.image || '/assets/product_blue.jpg'} 
                          alt={it.name} 
                          className="order-item-thumb" 
                          onError={(e) => { e.target.src = '/assets/product_blue.jpg'; }}
                        />
                        <div className="order-item-details">
                          <div className="order-item-name">{it.name}</div>
                          <div className="order-item-meta">
                            <span style={{ fontWeight: 600 }}>{it.size || '50ml'}</span> · Qty: <strong>{it.quantity || 1}</strong> × ₹{it.price || 1299}
                          </div>
                        </div>
                        <div style={{ fontWeight: 800, fontSize: '0.85rem', color: '#0f172a' }}>
                          ₹{(Number(it.price || 1299) * Number(it.quantity || 1)).toLocaleString('en-IN')}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Financial & Payment Summary */}
                  <div style={{ marginTop: '0.6rem', padding: '0.75rem', background: '#fafafa', borderRadius: '8px', border: '1px solid var(--border-light)', fontSize: '0.75rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
                      <span style={{ color: 'var(--color-charcoal-medium)' }}>Subtotal:</span>
                      <span>₹{(order.totalAmount || order.finalAmount || 0).toLocaleString('en-IN')}</span>
                    </div>
                    {order.discountAmount > 0 && (
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem', color: '#16a34a' }}>
                        <span>Coupon ({order.couponCode || 'PROMO'}):</span>
                        <span>-₹{Number(order.discountAmount).toLocaleString('en-IN')}</span>
                      </div>
                    )}
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 800, fontSize: '0.92rem', color: '#0f172a', borderTop: '1px solid var(--border-light)', paddingTop: '0.4rem', marginBottom: '0.5rem' }}>
                      <span>Total Payment:</span>
                      <span style={{ color: 'var(--color-gold-deep)' }}>₹{(order.finalAmount || order.totalAmount || 0).toLocaleString('en-IN')}</span>
                    </div>

                    {/* Payment Method Badge & Payment Paid Status */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem', borderTop: '1px dashed #e2e8f0', paddingTop: '0.45rem' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ fontSize: '0.7rem', fontWeight: 600, color: '#64748b' }}>Payment Method:</span>
                        <span style={{
                          fontSize: '0.7rem',
                          fontWeight: 700,
                          padding: '0.18rem 0.5rem',
                          borderRadius: '4px',
                          background: isPrepaid ? '#ecfdf5' : '#fffbeb',
                          color: isPrepaid ? '#059669' : '#b45309',
                          border: `1px solid ${isPrepaid ? '#a7f3d0' : '#fde68a'}`
                        }}>
                          {isPrepaid ? '⚡ PREPAID (Online)' : '💵 CASH ON DELIVERY (COD)'}
                        </span>
                      </div>

                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ fontSize: '0.7rem', fontWeight: 600, color: '#64748b' }}>Payment Status:</span>
                        <span style={{
                          fontSize: '0.7rem',
                          fontWeight: 700,
                          padding: '0.18rem 0.5rem',
                          borderRadius: '4px',
                          background: isPrepaid ? '#f0fdf4' : (order.status === 'delivered' ? '#f0fdf4' : '#fef2f2'),
                          color: isPrepaid ? '#16a34a' : (order.status === 'delivered' ? '#16a34a' : '#dc2626'),
                          border: `1px solid ${isPrepaid ? '#bbf7d0' : (order.status === 'delivered' ? '#bbf7d0' : '#fecaca')}`
                        }}>
                          {isPrepaid 
                            ? '✓ PAID (Verified Online)' 
                            : (order.status === 'delivered' ? '✓ CASH COLLECTED (Delivered)' : `⏳ PENDING (Collect at Delivery)`)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Column 3: Actions & Fulfillment */}
                <div className="order-action-block">
                  {is4999Mode ? (
                    /* 4999 Mode: Strictly NO Fulfillment Status, NO Invoice. Clean overview & Delete */
                    <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', height: '100%', gap: '0.75rem' }}>
                      <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '0.85rem' }}>
                        <div style={{ fontSize: '0.72rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: '#64748b', marginBottom: '0.5rem' }}>
                          Booking Quick Overview
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.45rem', fontSize: '0.78rem' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <span style={{ color: '#64748b' }}>Mode:</span>
                            <strong style={{ color: isPrepaid ? '#059669' : '#b45309' }}>{isPrepaid ? 'Prepaid Online' : 'Cash on Delivery'}</strong>
                          </div>
                          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <span style={{ color: '#64748b' }}>Payment:</span>
                            <strong style={{ color: isPrepaid ? '#16a34a' : '#dc2626' }}>{isPrepaid ? 'Received (PAID)' : 'Due at Doorstep'}</strong>
                          </div>
                          <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px dashed #cbd5e1', paddingTop: '0.4rem', marginTop: '0.2rem' }}>
                            <span style={{ color: '#0f172a', fontWeight: 700 }}>Total:</span>
                            <span style={{ fontWeight: 800, color: 'var(--color-gold-deep)' }}>
                              ₹{(order.finalAmount || order.totalAmount || 0).toLocaleString('en-IN')}
                            </span>
                          </div>
                        </div>
                      </div>

                      <button 
                        type="button" 
                        className="btn-admin-outline" 
                        style={{ fontSize: '0.75rem', padding: '0.5rem', color: '#dc2626', borderColor: '#fee2e2', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem', width: '100%' }}
                        onClick={async () => {
                          if (window.confirm(`Are you sure you want to delete booking #${order.id || order.order_reference}?`)) {
                            const ok = await deleteOrder(order.id || order.order_reference);
                            if (ok) showToast(`Booking #${order.id || order.order_reference} deleted.`, 'info');
                          }
                        }}
                      >
                        <Trash2 size={13} /> Delete Booking
                      </button>
                    </div>
                  ) : (
                    /* Full E-commerce Mode: Fulfillment Status & Print Invoice */
                    <>
                      <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--color-charcoal)' }}>
                        Fulfillment Status
                      </div>

                      {/* 1-Click Status Dropdown */}
                      <select 
                        className="order-status-changer"
                        value={order.status || 'confirmed'}
                        onChange={async (e) => {
                          const newStatus = e.target.value;
                          const ok = await updateOrderStatus(order.id || order.order_reference, newStatus);
                          if (ok) {
                            showToast(`Order #${order.id || order.order_reference} status updated to "${newStatus.toUpperCase()}".`, 'success');
                          } else {
                            showToast('Failed to update order status.', 'danger');
                          }
                        }}
                      >
                        <option value="confirmed">Confirmed (Order Placed)</option>
                        <option value="processing">Processing (Packing Fragrance)</option>
                        <option value="shipped">Shipped (In Transit)</option>
                        <option value="delivered">Delivered (Completed)</option>
                        <option value="cancelled">Cancelled</option>
                      </select>

                      {/* Waybill / Tracking */}
                      <div style={{ fontSize: '0.72rem', color: 'var(--color-charcoal-medium)', background: '#fff', padding: '0.45rem', borderRadius: '4px', border: '1px solid var(--border-light)' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', fontWeight: 600, marginBottom: '0.15rem' }}>
                          <Truck size={12} style={{ color: 'var(--color-gold-deep)' }} />
                          <span>Waybill / Tracking:</span>
                        </div>
                        <span style={{ fontFamily: 'monospace', color: '#2563eb' }}>
                          {order.waybill || `VESPERA-IND-${(order.id || '982144').replace(/[^0-9]/g, '')}`}
                        </span>
                      </div>

                      {/* Action Buttons */}
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', marginTop: '0.3rem' }}>
                        <button 
                          type="button" 
                          className="btn-admin-primary" 
                          style={{ fontSize: '0.75rem', padding: '0.45rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem' }}
                          onClick={() => setSelectedOrderInvoice(order)}
                        >
                          <FileText size={13} /> View &amp; Print Invoice
                        </button>

                        <button 
                          type="button" 
                          className="btn-admin-outline" 
                          style={{ fontSize: '0.75rem', padding: '0.4rem', color: '#dc2626', borderColor: '#fee2e2', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem' }}
                          onClick={async () => {
                            if (window.confirm(`Are you sure you want to delete order #${order.id || order.order_reference}?`)) {
                              const ok = await deleteOrder(order.id || order.order_reference);
                              if (ok) showToast(`Order #${order.id || order.order_reference} deleted.`, 'info');
                            }
                          }}
                        >
                          <Trash2 size={12} /> Delete Booking
                        </button>
                      </div>
                    </>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
