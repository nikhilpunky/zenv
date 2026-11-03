import React from 'react';
import { X, Printer, Sparkles, MapPin, Phone, Mail, User, CreditCard, Truck } from 'lucide-react';

export default function AdminInvoiceModal({ order, onClose }) {
  if (!order) return null;

  const customer = order.customer || {};
  const items = order.items || [];
  const dateStr = order.createdAt ? new Date(order.createdAt).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }) : 'Recent Order';

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="invoice-modal-overlay" onClick={onClose}>
      <div className="invoice-modal-paper" onClick={(e) => e.stopPropagation()}>
        {/* Modal Action Controls */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', borderBottom: '1px solid #e5e7eb', paddingBottom: '0.8rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.82rem', fontWeight: 600, color: '#4b5563' }}>
            <span>Official Client Tax Invoice</span>
            <span style={{ background: '#dcfce7', color: '#15803d', padding: '0.15rem 0.5rem', borderRadius: '4px', fontSize: '0.72rem', textTransform: 'uppercase' }}>
              {order.status || 'Confirmed'}
            </span>
          </div>

          <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
            <button
              type="button"
              className="btn-admin-primary"
              onClick={handlePrint}
              style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', padding: '0.4rem 0.8rem', fontSize: '0.78rem' }}
            >
              <Printer size={14} /> Print Receipt
            </button>
            <button
              type="button"
              className="btn-admin-outline"
              onClick={onClose}
              style={{ padding: '0.4rem', borderRadius: '4px' }}
              aria-label="Close modal"
            >
              <X size={16} />
            </button>
          </div>
        </div>

        {/* Invoice Brand Header */}
        <div className="invoice-brand-header">
          <div>
            <div style={{ fontFamily: 'var(--font-serif)', fontSize: '1.8rem', letterSpacing: '0.15em', fontWeight: 600, color: '#111' }}>
              VESPERA
            </div>
            <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--color-gold-deep)', fontWeight: 600 }}>
              HAUTE PARFUMERIE DE LUXE
            </div>
            <div style={{ fontSize: '0.72rem', color: '#6b7280', marginTop: '0.3rem', lineHeight: 1.4 }}>
              VESPERA Artisanal Fragrances Pvt Ltd<br />
              DLF CyberCity, Phase II, Gurugram, Haryana - 122002<br />
              Email: concierge@vespera.in · Support: +91 98112 34567
            </div>
          </div>

          <div className="invoice-meta-header">
            <div style={{ fontSize: '1.1rem', fontWeight: 700, color: '#111' }}>INVOICE</div>
            <div style={{ fontSize: '0.8rem', fontFamily: 'monospace', fontWeight: 600, color: '#2563eb' }}>
              #{order.id || order.order_reference}
            </div>
            <div style={{ fontSize: '0.75rem', color: '#6b7280', marginTop: '0.2rem' }}>Date: {dateStr}</div>
            <div style={{ fontSize: '0.72rem', color: '#6b7280' }}>
              Waybill: {order.waybill || `VESPERA-IND-${(order.id || '982144').replace(/[^0-9]/g, '')}`}
            </div>
          </div>
        </div>

        {/* Customer & Billing Details */}
        <div className="invoice-customer-grid">
          <div>
            <div style={{ fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 700, color: 'var(--color-gold-deep)', marginBottom: '0.4rem' }}>
              BILLED &amp; SHIPPED TO:
            </div>
            <div style={{ fontSize: '0.9rem', fontWeight: 700, color: '#111' }}>
              {customer.name || 'Valued Customer'}
            </div>
            <div style={{ fontSize: '0.78rem', color: '#374151', marginTop: '0.2rem', lineHeight: 1.4 }}>
              {customer.address || `${customer.address1 || ''} ${customer.address2 || ''}, ${customer.city || ''}, ${customer.state || ''} - ${customer.pincode || ''}`}
              {customer.landmark && <div>Landmark: {customer.landmark}</div>}
            </div>
            <div style={{ fontSize: '0.75rem', color: '#4b5563', marginTop: '0.3rem' }}>
              Phone: {customer.phone || 'N/A'} · Email: {customer.email || 'N/A'}
            </div>
          </div>

          <div>
            <div style={{ fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 700, color: 'var(--color-gold-deep)', marginBottom: '0.4rem' }}>
              PAYMENT METHOD &amp; REF:
            </div>
            <div style={{ fontSize: '0.85rem', fontWeight: 600, color: '#111', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <CreditCard size={14} style={{ color: '#059669' }} />
              {order.paymentMethod || 'Prepaid UPI'}
            </div>
            {order.paymentId && (
              <div style={{ fontSize: '0.72rem', fontFamily: 'monospace', color: '#4b5563', marginTop: '0.2rem' }}>
                Txn Ref: {order.paymentId}
              </div>
            )}
            <div style={{ fontSize: '0.72rem', color: '#16a34a', marginTop: '0.3rem', fontWeight: 600 }}>
              ● Payment Verified &amp; Secured
            </div>
          </div>
        </div>

        {/* Items Table with horizontal scroll container */}
        <div className="invoice-table-scroll">
          <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '1.5rem', fontSize: '0.82rem' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid #e5e7eb', textAlign: 'left', background: '#f9fafb' }}>
                <th style={{ padding: '0.6rem', color: '#374151' }}>Item Description</th>
                <th style={{ padding: '0.6rem', color: '#374151' }}>Size</th>
                <th style={{ padding: '0.6rem', textAlign: 'center', color: '#374151' }}>Qty</th>
                <th style={{ padding: '0.6rem', textAlign: 'right', color: '#374151' }}>Rate</th>
                <th style={{ padding: '0.6rem', textAlign: 'right', color: '#374151' }}>Amount</th>
              </tr>
            </thead>
            <tbody>
              {items.map((it, idx) => (
                <tr key={idx} style={{ borderBottom: '1px solid #f3f4f6' }}>
                  <td style={{ padding: '0.6rem', fontWeight: 600, color: '#111' }}>
                    {it.name}
                  </td>
                  <td style={{ padding: '0.6rem', color: '#6b7280' }}>
                    {it.size || '50ml'}
                  </td>
                  <td style={{ padding: '0.6rem', textAlign: 'center', fontWeight: 600 }}>
                    {it.quantity || 1}
                  </td>
                  <td style={{ padding: '0.6rem', textAlign: 'right', color: '#4b5563' }}>
                    ₹{(Number(it.price) || 1299).toLocaleString('en-IN')}
                  </td>
                  <td style={{ padding: '0.6rem', textAlign: 'right', fontWeight: 700, color: '#111' }}>
                    ₹{((Number(it.price) || 1299) * (Number(it.quantity) || 1)).toLocaleString('en-IN')}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Totals Calculation */}
        <div className="invoice-totals-row">
          <div className="invoice-totals-box">
            <div style={{ display: 'flex', justifyContent: 'space-between', color: '#4b5563' }}>
              <span>Subtotal:</span>
              <span>₹{(order.totalAmount || order.finalAmount || 0).toLocaleString('en-IN')}</span>
            </div>
            {order.discountAmount > 0 && (
              <div style={{ display: 'flex', justifyContent: 'space-between', color: '#16a34a' }}>
                <span>Discount ({order.couponCode || 'PROMO'}):</span>
                <span>-₹{Number(order.discountAmount).toLocaleString('en-IN')}</span>
              </div>
            )}
            <div style={{ display: 'flex', justifyContent: 'space-between', color: '#4b5563' }}>
              <span>Shipping &amp; Insurance:</span>
              <span style={{ color: '#16a34a', fontWeight: 600 }}>FREE (Complimentary)</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', color: '#4b5563' }}>
              <span>GST / Taxes (Included):</span>
              <span>18% Inclusive</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.05rem', fontWeight: 700, color: 'var(--color-gold-deep)', borderTop: '2px solid #e5e7eb', paddingTop: '0.5rem', marginTop: '0.2rem' }}>
              <span>Total Paid:</span>
              <span>₹{(order.finalAmount || order.totalAmount || 0).toLocaleString('en-IN')}</span>
            </div>
          </div>
        </div>

        {/* Footer Note */}
        <div style={{ borderTop: '1px solid #e5e7eb', paddingTop: '1rem', textAlign: 'center', fontSize: '0.72rem', color: '#9ca3af', lineHeight: 1.4 }}>
          Thank you for choosing VESPERA Haute Parfumerie.<br />
          For order tracking, questions, or fragrance care advice, contact concierge@vespera.in or WhatsApp +91 98112 34567.
        </div>
      </div>
    </div>
  );
}
