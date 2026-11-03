import React from 'react';
import { 
  DollarSign, Activity, ShoppingBag, Package, TrendingUp, BarChart2, 
  MapPin, CreditCard 
} from 'lucide-react';

export default function AdminAnalyticsTab({ 
  analyticsData, 
  analyticsTimeframe, 
  setAnalyticsTimeframe, 
  hoveredDataPoint, 
  setHoveredDataPoint 
}) {
  return (
    <div className="analytics-section">
      {/* Header & Timeframe Selector */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.5rem', fontWeight: 400, color: 'var(--color-charcoal)', margin: '0 0 0.2rem' }}>
            Storefront Revenue &amp; Business Intelligence
          </h2>
          <span style={{ fontSize: '0.75rem', color: 'var(--color-charcoal-light)' }}>
            Real-time financial telemetry, average order values, and fragrance sales leaderboard.
          </span>
        </div>

        <div className="analytics-timeframe-selector">
          {[
            { id: '7days', label: 'Last 7 Days' },
            { id: '30days', label: 'Last 30 Days' },
            { id: 'month', label: 'This Month' },
            { id: 'all', label: 'All Time' }
          ].map(tf => (
            <button
              key={tf.id}
              type="button"
              className={`timeframe-btn ${analyticsTimeframe === tf.id ? 'active' : ''}`}
              onClick={() => setAnalyticsTimeframe(tf.id)}
            >
              {tf.label}
            </button>
          ))}
        </div>
      </div>

      {/* Executive Financial KPIs */}
      <div className="admin-kpi-grid" style={{ marginBottom: '1.5rem' }}>
        <div className="kpi-card">
          <div className="kpi-card-header">
            <span className="kpi-card-title">Gross Revenue</span>
            <div className="kpi-icon-wrap gold">
              <DollarSign size={18} />
            </div>
          </div>
          <div className="kpi-card-value">₹{analyticsData.totalRevenue.toLocaleString('en-IN')}</div>
          <span className="kpi-card-subtitle" style={{ color: '#16a34a', display: 'flex', alignItems: 'center', gap: '0.2rem' }}>
            <TrendingUp size={12} /> +18.4% vs previous window
          </span>
        </div>

        <div className="kpi-card">
          <div className="kpi-card-header">
            <span className="kpi-card-title">Average Order Value (AOV)</span>
            <div className="kpi-icon-wrap blue" style={{ background: '#eff6ff', color: '#2563eb' }}>
              <Activity size={18} />
            </div>
          </div>
          <div className="kpi-card-value">₹{analyticsData.averageOrderValue.toLocaleString('en-IN')}</div>
          <span className="kpi-card-subtitle">Per verified transaction</span>
        </div>

        <div className="kpi-card">
          <div className="kpi-card-header">
            <span className="kpi-card-title">Total Orders</span>
            <div className="kpi-icon-wrap purple" style={{ background: '#f5f3ff', color: '#7c3aed' }}>
              <ShoppingBag size={18} />
            </div>
          </div>
          <div className="kpi-card-value">{analyticsData.totalOrdersCount}</div>
          <span className="kpi-card-subtitle">{analyticsData.deliverySuccessRate}% delivery success rate</span>
        </div>

        <div className="kpi-card">
          <div className="kpi-card-header">
            <span className="kpi-card-title">Bottles Sold</span>
            <div className="kpi-icon-wrap green" style={{ background: '#ecfdf5', color: '#059669' }}>
              <Package size={18} />
            </div>
          </div>
          <div className="kpi-card-value">{analyticsData.totalUnitsSold} Units</div>
          <span className="kpi-card-subtitle">{analyticsData.prepaidPercentage}% Prepaid UPI / {analyticsData.codPercentage}% COD</span>
        </div>
      </div>

      {/* Interactive SVG Revenue Area Graph */}
      <div className="analytics-chart-card">
        <div className="analytics-chart-header">
          <div>
            <h3 className="analytics-chart-title">
              <BarChart2 size={20} style={{ color: 'var(--color-gold)' }} />
              Storefront Revenue Trajectory
            </h3>
            <span style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.6)' }}>
              Hover over data points to inspect daily transactions and gross sales in Indian Rupees (₹).
            </span>
          </div>

          <div style={{ display: 'flex', gap: '0.6rem', alignItems: 'center' }}>
            <span style={{ fontSize: '0.72rem', background: 'rgba(197, 160, 89, 0.2)', color: 'var(--color-gold)', padding: '0.25rem 0.6rem', borderRadius: '4px', border: '1px solid rgba(197,160,89,0.3)', fontWeight: 600 }}>
              Peak Day: ₹{analyticsData.maxDailyRev.toLocaleString('en-IN')}
            </span>
          </div>
        </div>

        {/* SVG Chart */}
        <div style={{ position: 'relative', width: '100%', height: '240px' }}>
          <svg viewBox="0 0 760 220" style={{ width: '100%', height: '100%', overflow: 'visible' }}>
            <defs>
              <linearGradient id="goldAreaGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#c5a059" stopOpacity="0.45" />
                <stop offset="60%" stopColor="#c5a059" stopOpacity="0.12" />
                <stop offset="100%" stopColor="#c5a059" stopOpacity="0.0" />
              </linearGradient>
              <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="3" result="glow" />
                <feComposite in="SourceGraphic" in2="glow" operator="over" />
              </filter>
            </defs>

            {/* Horizontal Gridlines */}
            {[0.2, 0.4, 0.6, 0.8].map((ratio, i) => (
              <g key={i}>
                <line 
                  x1="45" 
                  y1={20 + ratio * 160} 
                  x2="740" 
                  y2={20 + ratio * 160} 
                  stroke="rgba(255,255,255,0.08)" 
                  strokeDasharray="4 4" 
                />
                <text 
                  x="40" 
                  y={24 + ratio * 160} 
                  fill="rgba(255,255,255,0.4)" 
                  fontSize="9" 
                  textAnchor="end"
                  fontFamily="monospace"
                >
                  ₹{Math.round((1 - ratio) * analyticsData.maxDailyRev / 1000)}k
                </text>
              </g>
            ))}

            {/* Plot Paths */}
            {(() => {
              const pts = analyticsData.chartPoints;
              if (pts.length < 2) return null;
              
              const getX = (index) => 50 + (index / (pts.length - 1)) * 680;
              const getY = (val) => 180 - (val / Math.max(analyticsData.maxDailyRev, 1)) * 140;

              const lineCoords = pts.map((p, idx) => `${getX(idx)},${getY(p.revenue)}`).join(' ');
              const areaPath = `M 50,180 L ${lineCoords} L ${getX(pts.length - 1)},180 Z`;
              const linePath = `M ${lineCoords}`;

              return (
                <>
                  {/* Area Fill */}
                  <path d={areaPath} fill="url(#goldAreaGrad)" />

                  {/* Line Stroke */}
                  <path 
                    d={linePath} 
                    fill="none" 
                    stroke="#c5a059" 
                    strokeWidth="3" 
                    filter="url(#glow)"
                  />

                  {/* Interactive Hoverable Points */}
                  {pts.map((p, idx) => {
                    const cx = getX(idx);
                    const cy = getY(p.revenue);
                    const isHovered = hoveredDataPoint?.date === p.date;

                    return (
                      <g key={idx} style={{ cursor: 'pointer' }} onMouseEnter={() => setHoveredDataPoint(p)}>
                        <circle 
                          cx={cx} 
                          cy={cy} 
                          r={isHovered ? 6 : 4} 
                          fill={isHovered ? '#fff' : '#c5a059'} 
                          stroke="#11141a" 
                          strokeWidth={isHovered ? 3 : 2} 
                        />
                        {/* X-axis labels for selected intervals */}
                        {(idx % Math.ceil(pts.length / 7) === 0 || idx === pts.length - 1) && (
                          <text 
                            x={cx} 
                            y="202" 
                            fill="rgba(255,255,255,0.5)" 
                            fontSize="9" 
                            textAnchor="middle"
                          >
                            {p.label}
                          </text>
                        )}
                      </g>
                    );
                  })}
                </>
              );
            })()}
          </svg>

          {/* Hover Tooltip */}
          {hoveredDataPoint && (
            <div style={{
              position: 'absolute',
              top: '10px',
              right: '10px',
              background: 'rgba(20, 20, 20, 0.95)',
              border: '1px solid #c5a059',
              borderRadius: '6px',
              padding: '0.6rem 0.85rem',
              fontSize: '0.75rem',
              color: '#fff',
              boxShadow: '0 4px 16px rgba(0,0,0,0.4)',
              pointerEvents: 'none'
            }}>
              <div style={{ color: 'var(--color-gold)', fontWeight: 700, marginBottom: '0.2rem' }}>
                {hoveredDataPoint.label} ({hoveredDataPoint.date})
              </div>
              <div>Daily Sales: <strong>₹{hoveredDataPoint.revenue.toLocaleString('en-IN')}</strong></div>
              <div style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.7rem' }}>
                Completed Orders: {hoveredDataPoint.orders}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Two Column Grid: Leaderboard & Shipping Geography */}
      <div className="analytics-grid-two-col">
        {/* Top Fragrances Leaderboard */}
        <div className="leaderboard-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', paddingBottom: '0.5rem', borderBottom: '1px solid var(--border-light)' }}>
            <h4 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.1rem', margin: 0, color: 'var(--color-charcoal)' }}>
              Top Selling Fragrances
            </h4>
            <span style={{ fontSize: '0.72rem', color: 'var(--color-charcoal-light)' }}>Ranked by Revenue</span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {analyticsData.topProducts.slice(0, 5).map((prod, idx) => {
              const sharePct = Math.round((prod.revenue / analyticsData.maxProdRev) * 100);
              return (
                <div key={idx} className="leaderboard-item">
                  <span className={`leaderboard-rank top-${idx + 1}`}>{idx + 1}</span>
                  <img 
                    src={prod.image} 
                    alt={prod.name} 
                    style={{ width: '40px', height: '40px', borderRadius: '4px', objectFit: 'cover', border: '1px solid var(--border-light)' }} 
                    onError={(e) => { e.target.src = '/assets/product_blue.jpg'; }}
                  />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontWeight: 600, fontSize: '0.82rem', color: 'var(--color-charcoal)' }}>
                        {prod.name} <span style={{ fontSize: '0.7rem', color: '#888', fontWeight: 400 }}>({prod.size})</span>
                      </span>
                      <span style={{ fontWeight: 700, fontSize: '0.82rem', color: 'var(--color-gold-deep)' }}>
                        ₹{prod.revenue.toLocaleString('en-IN')}
                      </span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.7rem', color: 'var(--color-charcoal-light)', marginTop: '0.1rem' }}>
                      <span>{prod.units} Bottles Sold</span>
                      <span>{sharePct}% Share</span>
                    </div>
                    <div className="leaderboard-progress-bg">
                      <div className="leaderboard-progress-fill" style={{ width: `${sharePct}%` }} />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Customer Demographics & Shipping Geography */}
        <div className="leaderboard-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', paddingBottom: '0.5rem', borderBottom: '1px solid var(--border-light)' }}>
            <h4 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.1rem', margin: 0, color: 'var(--color-charcoal)' }}>
              Top Shipping Cities
            </h4>
            <span style={{ fontSize: '0.72rem', color: 'var(--color-charcoal-light)' }}>Indian Demographics</span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
            {analyticsData.topCities.slice(0, 6).map((item, idx) => (
              <div key={idx}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', fontWeight: 600, marginBottom: '0.3rem' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <MapPin size={13} style={{ color: 'var(--color-gold-deep)' }} />
                    {item.city}
                  </span>
                  <span style={{ color: 'var(--color-charcoal-medium)' }}>
                    {item.count} Orders ({item.percentage}%)
                  </span>
                </div>
                <div className="leaderboard-progress-bg" style={{ height: '5px' }}>
                  <div className="leaderboard-progress-fill" style={{ width: `${Math.max(item.percentage * 2, 10)}%`, background: '#2563eb' }} />
                </div>
              </div>
            ))}
          </div>

          {/* Payment Split */}
          <div style={{ marginTop: '1.5rem', paddingTop: '1rem', borderTop: '1px solid var(--border-light)' }}>
            <div style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--color-charcoal)', marginBottom: '0.6rem' }}>
              Payment Method Distribution
            </div>
            <div style={{ display: 'flex', gap: '0.5rem', height: '10px', borderRadius: '5px', overflow: 'hidden', background: '#e2e8f0', marginBottom: '0.6rem' }}>
              <div style={{ width: `${analyticsData.prepaidPercentage}%`, background: '#16a34a' }} title="Prepaid UPI & Cards" />
              <div style={{ width: `${analyticsData.codPercentage}%`, background: '#ea580c' }} title="Cash on Delivery" />
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem' }}>
              <span style={{ color: '#16a34a', fontWeight: 600 }}>● Prepaid UPI / Cards ({analyticsData.prepaidPercentage}%)</span>
              <span style={{ color: '#ea580c', fontWeight: 600 }}>● Cash on Delivery ({analyticsData.codPercentage}%)</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
