import React, { useContext, useState, useEffect, useMemo, useRef } from 'react';
import { AppContext } from '../context/AppContext';
import { 
  Trash2, Edit, Plus, X, Image, FileUp, LogOut, ChevronLeft, ChevronRight, AlertCircle, 
  RotateCcw, RotateCw, Sparkles, Compass, Layers, Gift, Droplet, Grid, Flower, Flame, 
  Sun, Wind, Heart, Award, ArrowRight, Leaf, ShoppingBag, Menu, Search, 
  Filter, Tag, Home, Package, Sliders, Eye, Copy, ArrowUpDown, CheckCircle, 
  AlertTriangle, Info, TrendingUp, Boxes, Check, DollarSign, Clock, ShieldCheck,
  ChevronDown, RefreshCw, BarChart2, PieChart, Activity, Truck, Phone, Mail, 
  MapPin, User, FileText, Printer, MessageSquare, Download, ExternalLink, 
  CreditCard, ArrowUpRight, CheckSquare, XCircle, Calendar, Monitor, Smartphone, 
  Tablet, MoveUp, MoveDown, Settings, Layers2, MousePointer, HelpCircle, CheckCheck,
  Camera, Play, Pause, Lock, EyeOff, Zap, LayoutGrid, List
} from 'lucide-react';
import './AdminDashboard.css';
import AdminOrdersTab from './AdminOrdersTab';
import AdminAnalyticsTab from './AdminAnalyticsTab';
import AdminHomepageBuilder from './AdminHomepageBuilder';
import AdminInvoiceModal from './AdminInvoiceModal';

export const VIEW_ANGLE_PRESETS = [
  'Front / Hero Flacon',
  '45° Angle Profile',
  'Back / Olfactive Label',
  'Cap & Atomizer Detail',
  'Luxury Box & Packaging',
  'Texture / Scale Flatlay'
];

export default function AdminDashboard() {
  const {
    products,
    addProduct,
    updateProduct,
    deleteProduct,
    resetProducts,
    isAdminMode,
    adminLogin,
    adminLogout,
    setIsAdminMode,
    isAdminAuthenticated,
    coupons,
    addCoupon,
    deleteCoupon,
    toggleCouponActive,
    banners,
    addBanner,
    updateBanner,
    deleteBanner,
    categories,
    addCategory,
    updateCategory,
    deleteCategory,
    homepageSettings,
    updateHomepageSettings,
    packageMode,
    updatePackageMode,
    orders,
    updateOrderStatus,
    deleteOrder
  } = useContext(AppContext);

  // Dashboard Tabs
  const [activeTab, setActiveTab] = useState('products');

  // In 4999 Package Mode, allow Product Catalog & Booking History tabs
  useEffect(() => {
    if (packageMode === '4999_package' && activeTab !== 'products' && activeTab !== 'orders') {
      setActiveTab('products');
    }
  }, [packageMode, activeTab]);

  // Mobile UX States
  const [isMobileDrawerOpen, setIsMobileDrawerOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('ALL');
  const [stockFilter, setStockFilter] = useState('ALL'); // 'ALL' | 'in_stock' | 'low_stock' | 'out_of_stock'
  const [sortBy, setSortBy] = useState('default'); // 'default' | 'price_asc' | 'price_desc' | 'stock_asc' | 'stock_desc' | 'name_asc'
  const [tagFilter, setTagFilter] = useState('ALL'); // 'ALL' | 'hero' | 'bestseller' | 'offer'
  const [catalogViewMode, setCatalogViewMode] = useState('table'); // 'table' | 'grid'

  // Auth Display States
  const [showAuthPassword, setShowAuthPassword] = useState(false);

  // Modal Tab States
  const [modalFormTab, setModalFormTab] = useState('details'); // 'details' | 'pricing' | 'notes' | 'gallery'
  const [mobileModalTab, setMobileModalTab] = useState('form'); // 'form' or 'preview'

  // Orders / Client Bookings States
  const [orderSearchTerm, setOrderSearchTerm] = useState('');
  const [orderStatusFilter, setOrderStatusFilter] = useState('ALL');
  const [orderPaymentFilter, setOrderPaymentFilter] = useState('ALL');
  const [selectedOrderInvoice, setSelectedOrderInvoice] = useState(null);

  // Revenue & Stats (Analytics) States
  const [analyticsTimeframe, setAnalyticsTimeframe] = useState('30days'); // '7days' | '30days' | 'month' | 'all'
  const [analyticsMetric, setAnalyticsMetric] = useState('revenue'); // 'revenue' | 'orders'
  const [hoveredDataPoint, setHoveredDataPoint] = useState(null);

  // WordPress Homepage Visual Builder States
  const [previewDevice, setPreviewDevice] = useState('desktop'); // 'desktop' | 'tablet' | 'mobile'
  const [previewMode, setPreviewMode] = useState('edit'); // 'edit' | 'preview'
  const [sidebarTab, setSidebarTab] = useState('blocks'); // 'blocks' | 'settings'
  const [isPublishingHome, setIsPublishingHome] = useState(false);
  const [activePreviewBlock, setActivePreviewBlock] = useState('announcement');
  const [homeBuilderToast, setHomeBuilderToast] = useState('');

  // Toast Notification State
  const [toasts, setToasts] = useState([]);

  const showToast = (message, type = 'success', title = '') => {
    const id = Date.now() + Math.random();
    const newToast = { id, type, title, message };
    setToasts(prev => [...prev, newToast]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 4000);
  };

  const removeToast = (id) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  const handleFabClick = () => {
    if (activeTab === 'products') handleOpenAddModal();
    else if (activeTab === 'banners') handleOpenAddBannerModal();
    else if (activeTab === 'categories') {
      setEditingCategory({ id: 'new', label: 'New Category', icon: 'Sparkles', image: '/assets/product_sample.png' });
      setCategoryLabel('New Category');
      setCategoryImage('/assets/product_sample.png');
      setCategoryIcon('Sparkles');
    } else if (activeTab === 'coupons') handleOpenAddCouponModal();
  };

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

  // Hero Banners Editor States
  const [isBannerModalOpen, setIsBannerModalOpen] = useState(false);
  const [editingBanner, setEditingBanner] = useState(null);
  const [bannerImage, setBannerImage] = useState('');
  const [bannerTitle, setBannerTitle] = useState('');
  const [bannerSubtitle, setBannerSubtitle] = useState('');
  const [bannerDesc, setBannerDesc] = useState('');
  const [bannerIsActive, setBannerIsActive] = useState(true);

  // Categories Editor States
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [categoryLabel, setCategoryLabel] = useState('');
  const [categoryImage, setCategoryImage] = useState('');
  const [categoryIcon, setCategoryIcon] = useState('Sparkles');

  // Homepage Content Builder Form State
  const [homeForm, setHomeForm] = useState(() => homepageSettings || {
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
  });
  const [selectedHomeSection, setSelectedHomeSection] = useState('announcement');
  const [selectedSpotlightId, setSelectedSpotlightId] = useState('');

  // Sync local form state with context
  useEffect(() => {
    if (homepageSettings) {
      setHomeForm(prev => ({ ...prev, ...homepageSettings }));
    }
  }, [homepageSettings]);

  useEffect(() => {
    const spot = products.find(p => p.isHeroProduct);
    if (spot) {
      setSelectedSpotlightId(spot.id);
    }
  }, [products]);

  // Filtered Orders Computation for Client Bookings Tab
  const filteredOrders = useMemo(() => {
    if (!orders || !Array.isArray(orders)) return [];
    return orders.filter(order => {
      const q = (orderSearchTerm || '').toLowerCase().trim();
      const matchesSearch = !q || (
        (order.id && order.id.toLowerCase().includes(q)) ||
        (order.order_reference && order.order_reference.toLowerCase().includes(q)) ||
        (order.customer?.name && order.customer.name.toLowerCase().includes(q)) ||
        (order.customer?.email && order.customer.email.toLowerCase().includes(q)) ||
        (order.customer?.phone && order.customer.phone.toLowerCase().includes(q)) ||
        (order.customer?.city && order.customer.city.toLowerCase().includes(q)) ||
        (order.customer?.address && order.customer.address.toLowerCase().includes(q)) ||
        (order.itemsSummary && order.itemsSummary.toLowerCase().includes(q)) ||
        (order.paymentMethod && order.paymentMethod.toLowerCase().includes(q))
      );

      const matchesStatus = orderStatusFilter === 'ALL' || (order.status && order.status.toLowerCase() === orderStatusFilter.toLowerCase());

      const matchesPayment = orderPaymentFilter === 'ALL' || (
        orderPaymentFilter === 'prepaid' ? (order.paymentMethod && order.paymentMethod.toLowerCase().includes('prepaid')) :
        orderPaymentFilter === 'cod' ? (order.paymentMethod && order.paymentMethod.toLowerCase().includes('cod')) :
        true
      );

      return matchesSearch && matchesStatus && matchesPayment;
    });
  }, [orders, orderSearchTerm, orderStatusFilter, orderPaymentFilter]);

  // Analytics Metrics Computation
  const analyticsData = useMemo(() => {
    const list = orders || [];
    const validOrders = list.filter(o => o.status !== 'cancelled');
    const totalRev = validOrders.reduce((sum, o) => sum + (Number(o.finalAmount) || 0), 0);
    const totalOrdersCount = list.length;
    const aov = validOrders.length > 0 ? Math.round(totalRev / validOrders.length) : 0;
    const totalUnits = validOrders.reduce((sum, o) => {
      return sum + (o.items ? o.items.reduce((s, it) => s + (Number(it.quantity) || 1), 0) : 1);
    }, 0);

    const prepaidOrders = validOrders.filter(o => o.paymentMethod?.toLowerCase().includes('prepaid') || o.paymentMethod?.toLowerCase().includes('upi') || o.paymentMethod?.toLowerCase().includes('card'));
    const codOrders = validOrders.filter(o => o.paymentMethod?.toLowerCase().includes('cod'));
    const prepaidPct = validOrders.length > 0 ? Math.round((prepaidOrders.length / validOrders.length) * 100) : 75;
    const codPct = 100 - prepaidPct;

    const deliveredOrders = list.filter(o => o.status === 'delivered');
    const deliveryRate = totalOrdersCount > 0 ? Math.round((deliveredOrders.length / totalOrdersCount) * 100) : 92;

    // Daily Chart Data Generator based on timeframe
    const daysCount = analyticsTimeframe === '7days' ? 7 : analyticsTimeframe === '30days' ? 30 : analyticsTimeframe === 'month' ? 30 : 60;
    const chartPoints = [];
    const now = new Date();
    
    for (let i = daysCount - 1; i >= 0; i--) {
      const d = new Date(now);
      d.setDate(d.getDate() - i);
      const dateStr = d.toISOString().split('T')[0];
      const dayLabel = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      
      const dayOrders = validOrders.filter(o => o.createdAt && o.createdAt.startsWith(dateStr));
      let dayRev = dayOrders.reduce((sum, o) => sum + (Number(o.finalAmount) || 0), 0);
      let dayCount = dayOrders.length;
      
      if (dayRev === 0) {
        const seed = (d.getDate() * 17 + d.getMonth() * 31) % 9;
        const baseRev = 2800 + seed * 950 + (i % 3 === 0 ? 3200 : 0);
        dayRev = baseRev;
        dayCount = Math.max(1, Math.round(baseRev / 1600));
      }

      chartPoints.push({
        date: dateStr,
        label: dayLabel,
        revenue: dayRev,
        orders: dayCount
      });
    }

    const maxDailyRev = Math.max(...chartPoints.map(p => p.revenue), 10000);
    const maxDailyOrders = Math.max(...chartPoints.map(p => p.orders), 5);

    // Top Products Leaderboard
    const productSalesMap = {};
    validOrders.forEach(o => {
      if (o.items && Array.isArray(o.items)) {
        o.items.forEach(it => {
          const key = it.name || it.id || 'VESPERA Fragrance';
          if (!productSalesMap[key]) {
            productSalesMap[key] = {
              name: key,
              size: it.size || '50ml',
              image: it.image || '/assets/product_blue.jpg',
              units: 0,
              revenue: 0
            };
          }
          const qty = Number(it.quantity) || 1;
          const price = Number(it.price) || 1299;
          productSalesMap[key].units += qty;
          productSalesMap[key].revenue += qty * price;
        });
      }
    });

    const topProducts = Object.values(productSalesMap).sort((a, b) => b.revenue - a.revenue);
    if (topProducts.length === 0) {
      topProducts.push(
        { name: 'VESPERA Blue', size: '50ml', image: '/assets/product_blue.jpg', units: 48, revenue: 57552 },
        { name: 'Discovery Collection', size: '5 × 8ml', image: '/assets/discovery_set.png', units: 36, revenue: 28764 },
        { name: 'Santal Royal', size: '50ml', image: '/assets/product_sample.png', units: 24, revenue: 35976 },
        { name: 'Rose Royale', size: '50ml', image: '/assets/product_pure.jpg', units: 19, revenue: 26581 },
        { name: 'Oud Sublime', size: '50ml', image: '/assets/product_wood.jpg', units: 14, revenue: 25186 }
      );
    }
    const maxProdRev = Math.max(...topProducts.map(p => p.revenue), 1);

    // Shipping Destination Breakdown
    const cityMap = {};
    list.forEach(o => {
      const city = o.customer?.city || 'Delhi NCR';
      cityMap[city] = (cityMap[city] || 0) + 1;
    });
    const topCities = Object.entries(cityMap)
      .map(([city, count]) => ({ city, count, percentage: Math.round((count / Math.max(list.length, 1)) * 100) }))
      .sort((a, b) => b.count - a.count);

    return {
      totalRevenue: totalRev,
      totalOrdersCount,
      averageOrderValue: aov,
      totalUnitsSold: totalUnits,
      prepaidPercentage: prepaidPct,
      codPercentage: codPct,
      deliverySuccessRate: deliveryRate,
      chartPoints,
      maxDailyRev,
      maxDailyOrders,
      topProducts,
      maxProdRev,
      topCities
    };
  }, [orders, analyticsTimeframe]);

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
  const [formIsHero, setFormIsHero] = useState(false);
  const [formIsBestSeller, setFormIsBestSeller] = useState(false);
  const [formIsOffer, setFormIsOffer] = useState(false);
  
  // Image manager & View Angles field states
  const [formImages, setFormImages] = useState([]); // List of base64/URL strings
  const [formImageAngles, setFormImageAngles] = useState([]); // Angle labels matching formImages
  const [previewAngleIndex, setPreviewAngleIndex] = useState(0); // Currently inspected angle in live preview
  const [isAutoRotatingAngles, setIsAutoRotatingAngles] = useState(false); // 360-degree rotation inspector
  const [newImageUrl, setNewImageUrl] = useState('');
  const [uploadFileName, setUploadFileName] = useState('');

  // Auto-cycle through angles when 360 rotation is active
  useEffect(() => {
    let interval;
    if (isAutoRotatingAngles && formImages.length > 1) {
      interval = setInterval(() => {
        setPreviewAngleIndex(prev => (prev + 1) % formImages.length);
      }, 2000);
    }
    return () => clearInterval(interval);
  }, [isAutoRotatingAngles, formImages.length]);

  // Angle navigation helpers
  const handlePrevAngle = (e) => {
    if (e) e.stopPropagation();
    if (formImages.length <= 1) return;
    setPreviewAngleIndex(prev => (prev - 1 + formImages.length) % formImages.length);
  };

  const handleNextAngle = (e) => {
    if (e) e.stopPropagation();
    if (formImages.length <= 1) return;
    setPreviewAngleIndex(prev => (prev + 1) % formImages.length);
  };

  // Notification Alert state (Legacy fallback)
  const [alertMsg, setAlertMsg] = useState(null); // { type: 'success' | 'danger', text: '' }

  const showAlert = (text, type = 'success') => {
    showToast(text, type === 'danger' ? 'danger' : 'success');
  };

  // Keyboard shortcuts listener
  useEffect(() => {
    const handleKeyDown = (e) => {
      const isInputFocused = ['INPUT', 'TEXTAREA', 'SELECT'].includes(e.target.tagName);
      if (e.key === 'Escape') {
        setIsModalOpen(false);
        setIsCouponModalOpen(false);
        setIsBannerModalOpen(false);
        setIsCategoryModalOpen(false);
        setIsMobileDrawerOpen(false);
        return;
      }
      if (isInputFocused) return;

      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        const searchInput = document.getElementById('catalog-search-input');
        if (searchInput) searchInput.focus();
      } else if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'n') {
        e.preventDefault();
        if (activeTab === 'products') handleOpenAddModal();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeTab]);

  // Executive KPI stats calculation
  const kpiStats = useMemo(() => {
    const totalCount = products.length;
    const totalUnits = products.reduce((sum, p) => sum + (typeof p.stock === 'number' ? p.stock : 0), 0);
    const lowStock = products.filter(p => typeof p.stock === 'number' && p.stock <= 4).length;
    const avgPrice = totalCount > 0 ? Math.round(products.reduce((sum, p) => sum + (p.price || 0), 0) / totalCount) : 0;
    return { totalCount, totalUnits, lowStock, avgPrice };
  }, [products]);

  // Filtered & Sorted products
  const filteredProducts = useMemo(() => {
    return products
      .filter((prod) => {
        const query = searchTerm.toLowerCase().trim();
        const matchesSearch = !query || 
          (prod.name && prod.name.toLowerCase().includes(query)) || 
          (prod.type && prod.type.toLowerCase().includes(query)) ||
          (prod.notes && prod.notes.toLowerCase().includes(query)) ||
          (prod.category && prod.category.toLowerCase().includes(query));

        const matchesCategory = categoryFilter === 'ALL' || 
          (prod.category && prod.category.toLowerCase() === categoryFilter.toLowerCase());

        let matchesStock = true;
        if (packageMode !== '4999_package') {
          const stock = typeof prod.stock === 'number' ? prod.stock : 0;
          if (stockFilter === 'in_stock') matchesStock = stock >= 5;
          else if (stockFilter === 'low_stock') matchesStock = stock > 0 && stock < 5;
          else if (stockFilter === 'out_of_stock') matchesStock = stock <= 0;
        }

        let matchesTag = true;
        if (tagFilter === 'hero') matchesTag = !!prod.isHeroProduct;
        else if (tagFilter === 'bestseller') matchesTag = !!prod.isBestSeller;
        else if (tagFilter === 'offer') matchesTag = !!prod.isOfferProduct;

        return matchesSearch && matchesCategory && matchesStock && matchesTag;
      })
      .sort((a, b) => {
        if (sortBy === 'price_asc') return (a.price || 0) - (b.price || 0);
        if (sortBy === 'price_desc') return (b.price || 0) - (a.price || 0);
        if (sortBy === 'stock_asc') return (a.stock || 0) - (b.stock || 0);
        if (sortBy === 'stock_desc') return (b.stock || 0) - (a.stock || 0);
        if (sortBy === 'name_asc') return (a.name || '').localeCompare(b.name || '');
        return 0;
      });
  }, [products, searchTerm, categoryFilter, stockFilter, tagFilter, sortBy]);

  const hasActiveFilters = searchTerm !== '' || categoryFilter !== 'ALL' || stockFilter !== 'ALL' || tagFilter !== 'ALL' || sortBy !== 'default';

  const handleResetFilters = () => {
    setSearchTerm('');
    setCategoryFilter('ALL');
    setStockFilter('ALL');
    setTagFilter('ALL');
    setSortBy('default');
  };

  const handleQuickStockChange = (productId, delta) => {
    const prod = products.find(p => p.id === productId);
    if (!prod) return;
    const current = typeof prod.stock === 'number' ? prod.stock : 0;
    const nextStock = Math.max(0, current + delta);
    updateProduct(productId, { ...prod, stock: nextStock });
    showToast(`Updated "${prod.name}" stock to ${nextStock} units`, 'info', 'Inventory Adjusted');
  };

  const handleDuplicateProduct = (prod) => {
    const generatedId = `${prod.id}-copy-${Date.now()}`;
    const clonedProduct = {
      ...prod,
      id: generatedId,
      name: `${prod.name} (Copy)`,
    };
    addProduct(clonedProduct);
    showToast(`Cloned product as "${clonedProduct.name}"`, 'success', 'Product Duplicated');
  };

  const handleResetClick = async () => {
    if (window.confirm("Are you sure you want to reset all products, images, and prices back to initial defaults? All manual changes will be lost.")) {
      const success = await resetProducts();
      if (success) {
        showToast('All products reset to defaults successfully!', 'success', 'System Reset');
      } else {
        showToast('Failed to reset products to defaults.', 'danger', 'Error');
      }
    }
  };

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    const success = adminLogin(passwordInput);
    if (success) {
      setAuthError('');
      setPasswordInput('');
    } else {
      setAuthError('Incorrect password. Please try again.');
    }
  };

  const handleCancelLogin = () => {
    // Return to main site view
    setIsAdminMode(false);
    window.location.href = '/';
  };

  // Open modal for Adding a new product
  const handleOpenAddModal = () => {
    setEditingProduct(null);
    setModalFormTab('details');
    setMobileModalTab('form');
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
    setFormIsHero(false);
    setFormIsBestSeller(false);
    setFormIsOffer(false);
    setFormImages([]);
    setFormImageAngles([]);
    setPreviewAngleIndex(0);
    setIsAutoRotatingAngles(false);
    setNewImageUrl('');
    setUploadFileName('');
    setIsModalOpen(true);
  };

  // Open modal for Editing an existing product
  const handleOpenEditModal = (product) => {
    setEditingProduct(product);
    setModalFormTab('details');
    setMobileModalTab('form');
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
    setFormIsHero(!!product.isHeroProduct);
    setFormIsBestSeller(!!product.isBestSeller);
    setFormIsOffer(!!product.isOfferProduct);
    const existingImages = Array.isArray(product.images) ? [...product.images] : [product.image].filter(Boolean);
    setFormImages(existingImages);
    setFormImageAngles(
      Array.isArray(product.imageAngles) && product.imageAngles.length === existingImages.length
        ? [...product.imageAngles]
        : existingImages.map((_, i) => VIEW_ANGLE_PRESETS[i % VIEW_ANGLE_PRESETS.length])
    );
    setPreviewAngleIndex(0);
    setIsAutoRotatingAngles(false);
    setNewImageUrl('');
    setUploadFileName('');
    setIsModalOpen(true);
  };

  // Inline Price Editing States
  const [editingPriceId, setEditingPriceId] = useState(null);
  const [tempPriceValue, setTempPriceValue] = useState('');
  const [isDraggingOver, setIsDraggingOver] = useState(false);

  const handleStartEditPrice = (prod) => {
    setEditingPriceId(prod.id);
    setTempPriceValue(prod.price ?? 0);
  };

  const handleSaveInlinePrice = (productId) => {
    const prod = products.find(p => p.id === productId);
    if (!prod) return;
    const numPrice = Number(tempPriceValue);
    if (isNaN(numPrice) || numPrice < 0) {
      showToast('Please enter a valid price amount', 'danger', 'Invalid Price');
      return;
    }
    const updatedProd = {
      ...prod,
      price: numPrice,
      mrp: packageMode === '4999_package' ? numPrice : (prod.mrp || numPrice)
    };
    updateProduct(productId, updatedProd);
    setEditingPriceId(null);
    showToast(`Updated price for "${prod.name}" to ₹${numPrice}`, 'success', 'Price Saved');
  };

  const handleCancelInlinePrice = () => {
    setEditingPriceId(null);
  };

  const handleImageFilesChange = (e) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    let loadedCount = 0;
    const newImages = [];

    files.forEach((file) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        newImages.push(reader.result);
        loadedCount++;
        if (loadedCount === files.length) {
          setFormImages(prev => [...prev, ...newImages]);
          setFormImageAngles(prev => {
            const updatedAngles = [...prev];
            for (let i = 0; i < newImages.length; i++) {
              const nextPreset = VIEW_ANGLE_PRESETS[updatedAngles.length % VIEW_ANGLE_PRESETS.length];
              updatedAngles.push(nextPreset);
            }
            return updatedAngles;
          });
          setUploadFileName(`${files.length} angle photo(s) added`);
          showToast(`Uploaded ${files.length} angle image(s) to product gallery!`, 'success', 'Images Uploaded');
        }
      };
      reader.readAsDataURL(file);
    });
    // Clear input so same file can be chosen again if needed
    e.target.value = '';
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDraggingOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDraggingOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDraggingOver(false);
    const files = Array.from(e.dataTransfer.files || []).filter(f => f.type.startsWith('image/'));
    if (files.length === 0) return;

    let loadedCount = 0;
    const newImages = [];
    files.forEach((file) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        newImages.push(reader.result);
        loadedCount++;
        if (loadedCount === files.length) {
          setFormImages(prev => [...prev, ...newImages]);
          setFormImageAngles(prev => {
            const updatedAngles = [...prev];
            for (let i = 0; i < newImages.length; i++) {
              const nextPreset = VIEW_ANGLE_PRESETS[updatedAngles.length % VIEW_ANGLE_PRESETS.length];
              updatedAngles.push(nextPreset);
            }
            return updatedAngles;
          });
          showToast(`Dropped and uploaded ${files.length} angle photo(s)!`, 'success', 'Images Uploaded');
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const handleAddImageUrl = () => {
    if (!newImageUrl.trim()) return;
    const urls = newImageUrl
      .split(/[\n,]+/)
      .map(u => u.trim())
      .filter(u => u.length > 0);

    if (urls.length > 0) {
      setFormImages(prev => [...prev, ...urls]);
      setFormImageAngles(prev => {
        const updatedAngles = [...prev];
        for (let i = 0; i < urls.length; i++) {
          const nextPreset = VIEW_ANGLE_PRESETS[updatedAngles.length % VIEW_ANGLE_PRESETS.length];
          updatedAngles.push(nextPreset);
        }
        return updatedAngles;
      });
      setNewImageUrl('');
      showToast(`Added ${urls.length} view angle URL(s) to gallery.`, 'success', 'Images Added');
    }
  };

  const handleRemoveImage = (index) => {
    setFormImages(prev => prev.filter((_, idx) => idx !== index));
    setFormImageAngles(prev => prev.filter((_, idx) => idx !== index));
    setPreviewAngleIndex(prev => (prev >= index && prev > 0 ? prev - 1 : 0));
    showToast('Image removed from collection.', 'info', 'Gallery Updated');
  };

  const handleClearAllImages = () => {
    if (window.confirm("Are you sure you want to remove all images for this product?")) {
      setFormImages([]);
      setFormImageAngles([]);
      setPreviewAngleIndex(0);
      setIsAutoRotatingAngles(false);
      showToast('All gallery images cleared.', 'info', 'Gallery Cleared');
    }
  };

  const handleSetPrimaryImage = (index) => {
    setFormImages(prev => {
      const copy = [...prev];
      const [chosen] = copy.splice(index, 1);
      return [chosen, ...copy];
    });
    setFormImageAngles(prev => {
      const copy = [...prev];
      const [chosen] = copy.splice(index, 1);
      return [VIEW_ANGLE_PRESETS[0], ...copy];
    });
    setPreviewAngleIndex(0);
    showToast('Set selected image as primary cover image.', 'success', 'Cover Updated');
  };

  const handleUpdateImageAngle = (index, newAngle) => {
    setFormImageAngles(prev => {
      const copy = [...prev];
      copy[index] = newAngle;
      return copy;
    });
    showToast(`Updated image #${index + 1} view angle to "${newAngle}"`, 'info', 'Angle Tagged');
  };

  const handleDeleteProductClick = (id, name) => {
    if (window.confirm(`Are you sure you want to delete "${name}"?`)) {
      deleteProduct(id);
      showToast(`"${name}" has been deleted from catalog.`, 'danger', 'Product Removed');
    }
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    const finalName = (formName || editingProduct?.name || '').trim();
    if (!finalName) {
      alert('Product Name is required.');
      return;
    }

    const olfactiveNotes = editingProduct?.olfactiveNotes || {
      top: formTopNotes.trim(),
      heart: formHeartNotes.trim(),
      base: formBaseNotes.trim()
    };

    const productPayload = {
      name: finalName,
      type: formType.trim() || editingProduct?.type || 'Eau de Parfum',
      size: formSize.trim() || editingProduct?.size || '50ml',
      notes: formNotes.trim() || editingProduct?.notes || '',
      category: formCategory || editingProduct?.category || 'unisex',
      mrp: packageMode === '4999_package' ? Number(formPrice || editingProduct?.mrp || 1999) : Number(formMRP || formPrice),
      price: Number(formPrice || editingProduct?.price || 1999),
      stock: packageMode === '4999_package' ? (typeof editingProduct?.stock === 'number' ? editingProduct.stock : 99) : (typeof formStock === 'number' ? Number(formStock) : (Number(editingProduct?.stock) || 15)),
      description: formDescription.trim(),
      longDescription: formLongDescription.trim() || formDescription.trim(),
      olfactiveNotes,
      longevity: formLongevity.trim() || editingProduct?.longevity || '8-10 Hours',
      projection: formProjection.trim() || editingProduct?.projection || 'Moderate to Strong',
      occasion: formOccasion.trim() || editingProduct?.occasion || 'Daily Wear & Special Occasions',
      howToUse: formHowToUse.trim() || editingProduct?.howToUse || 'Spray 2-3 times on pulse points.',
      images: formImages.length > 0 ? formImages : ['/assets/discovery_set.png'],
      image: formImages.length > 0 ? formImages[0] : '/assets/discovery_set.png',
      imageAngles: formImageAngles.length > 0 ? formImageAngles : (formImages.length > 0 ? formImages.map((_, i) => VIEW_ANGLE_PRESETS[i % VIEW_ANGLE_PRESETS.length]) : [VIEW_ANGLE_PRESETS[0]]),
      isDiscovery: formCategory === 'discovery' || (editingProduct?.isDiscovery || false),
      isHeroProduct: packageMode === '4999_package' && editingProduct ? !!editingProduct.isHeroProduct : formIsHero,
      isBestSeller: packageMode === '4999_package' && editingProduct ? !!editingProduct.isBestSeller : formIsBestSeller,
      isOfferProduct: packageMode === '4999_package' ? false : formIsOffer,
    };

    if (editingProduct) {
      const success = await updateProduct(editingProduct.id, productPayload);
      if (success !== false) {
        showAlert(`Successfully updated product "${finalName}".`, 'success');
      } else {
        showAlert(`Failed to sync product update to server.`, 'error');
      }
    } else {
      const generatedId = finalName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') || `prod-${Date.now()}`;
      // Double check ID uniqueness
      const exists = products.some(p => p.id === generatedId);
      const uniqueId = exists ? `${generatedId}-${Date.now()}` : generatedId;

      const success = await addProduct({
        ...productPayload,
        id: uniqueId,
      });
      if (success !== false) {
        showAlert(`Successfully added new product "${finalName}".`, 'success');
      } else {
        showAlert(`Failed to save product to server.`, 'error');
      }
    }

    setIsModalOpen(false);
  };

  // --- BANNERS ACTION HANDLERS ---
  const handleOpenAddBannerModal = () => {
    setEditingBanner(null);
    setBannerImage('');
    setBannerTitle('');
    setBannerSubtitle('');
    setBannerDesc('');
    setBannerIsActive(true);
    setIsBannerModalOpen(true);
  };

  const handleOpenEditBannerModal = (banner) => {
    setEditingBanner(banner);
    setBannerImage(banner.image || '');
    setBannerTitle(banner.title || '');
    setBannerSubtitle(banner.subtitle || '');
    setBannerDesc(banner.description || '');
    setBannerIsActive(!!banner.isActive);
    setIsBannerModalOpen(true);
  };

  const handleBannerFormSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      image: bannerImage || '/assets/hero_perfume_v6.jpg',
      title: bannerTitle.trim(),
      subtitle: bannerSubtitle.trim(),
      description: bannerDesc.trim(),
      isActive: bannerIsActive
    };

    if (editingBanner) {
      payload.id = editingBanner.id;
      const success = await updateBanner(editingBanner.id, payload);
      if (success) showAlert(`Banner updated successfully!`);
    } else {
      const success = await addBanner(payload);
      if (success) showAlert(`New banner added successfully!`);
    }
    setIsBannerModalOpen(false);
  };

  const handleDeleteBanner = async (id) => {
    if (window.confirm("Are you sure you want to delete this banner?")) {
      const success = await deleteBanner(id);
      if (success) showAlert("Banner deleted.");
    }
  };

  const handleToggleBannerActive = async (banner) => {
    const success = await updateBanner(banner.id, { isActive: !banner.isActive });
    if (success) {
      showAlert(`Banner status updated.`);
    }
  };

  const handleBannerFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setBannerImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // --- CATEGORIES ACTION HANDLERS ---
  const handleOpenAddCategoryModal = () => {
    setEditingCategory(null);
    setCategoryLabel('');
    setCategoryImage('');
    setCategoryIcon('Sparkles');
    setIsCategoryModalOpen(true);
  };

  const handleOpenEditCategoryModal = (cat) => {
    setEditingCategory(cat);
    setCategoryLabel(cat.label || '');
    setCategoryImage(cat.image || '');
    setCategoryIcon(cat.icon || 'Sparkles');
    setIsCategoryModalOpen(true);
  };

  const handleCategoryFormSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      label: categoryLabel.trim(),
      image: categoryImage || '/assets/product_sample.png',
      icon: categoryIcon
    };

    if (editingCategory) {
      payload.id = editingCategory.id;
      const success = await updateCategory(editingCategory.id, payload);
      if (success) showAlert(`Category updated successfully!`);
    } else {
      const success = await addCategory(payload);
      if (success) showAlert(`New category added successfully!`);
    }
    setIsCategoryModalOpen(false);
  };

  const handleDeleteCategory = async (id) => {
    if (window.confirm("Are you sure you want to delete this category?")) {
      const success = await deleteCategory(id);
      if (success) showAlert("Category deleted.");
    }
  };

  const handleCategoryFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setCategoryImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };
  const handleStoryOneFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setHomeForm(prev => ({ ...prev, storyOneImage: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleStoryTwoFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setHomeForm(prev => ({ ...prev, storyTwoImage: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleHomeFormSubmit = async (e) => {
    e.preventDefault();
    if (!homeForm) return;
    const success = await updateHomepageSettings(homeForm);
    if (success) {
      showAlert('Homepage settings saved successfully!', 'success');
    } else {
      showAlert('Failed to save homepage settings.', 'error');
    }
  };

  // Auth Gateway view if not logged in
  if (!isAdminAuthenticated) {
    return (
      <div className="auth-gateway-overlay">
        <div className="auth-card">
          <div className="auth-emblem">
            <Sparkles size={24} className="auth-emblem-icon" />
          </div>
          <h2 className="auth-title">V E S P E R A</h2>
          <div className="auth-badge-demo">
            <span className="auth-badge-dot"></span>
            Demo Mode: Any password accepted
          </div>
          <p className="auth-subtitle">
            Executive Admin &amp; Storefront Console
          </p>
          
          <form onSubmit={handleLoginSubmit} className="auth-form">
            <div className="auth-form-group">
              <label className="auth-label" htmlFor="admin-pass">Access Password</label>
              <div className="auth-input-wrapper">
                <Lock size={16} className="auth-input-icon" />
                <input
                  id="admin-pass"
                  type={showAuthPassword ? 'text' : 'password'}
                  className="auth-input"
                  placeholder="Enter administrator password..."
                  value={passwordInput}
                  onChange={(e) => setPasswordInput(e.target.value)}
                  autoFocus
                />
                <button
                  type="button"
                  className="auth-eye-btn"
                  onClick={() => setShowAuthPassword(!showAuthPassword)}
                  aria-label={showAuthPassword ? "Hide password" : "Show password"}
                >
                  {showAuthPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>
            
            {authError && <div className="auth-error"><AlertCircle size={14} /> {authError}</div>}
            
            <button type="submit" className="btn-auth-submit">
              <span>Authenticate &amp; Launch Console</span>
              <ArrowRight size={16} />
            </button>
            
            <button type="button" className="btn-auth-cancel" onClick={handleCancelLogin}>
              <ChevronLeft size={14} />
              Return to Storefront
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-container">
      {/* Mobile Top Header (Visible on Mobile) */}
      <div className="admin-mobile-header">
        <button 
          className="admin-mobile-menu-trigger" 
          onClick={() => setIsMobileDrawerOpen(true)}
          aria-label="Open Navigation Drawer"
        >
          <Menu size={22} />
        </button>
        <div className="admin-mobile-logo">
          VESPERA <span className="mobile-active-badge">{activeTab}</span>
        </div>
        <button 
          className="admin-mobile-quick-action" 
          onClick={() => { setIsAdminMode(false); window.location.href = '/'; }}
          title="View Storefront"
        >
          <ShoppingBag size={18} />
        </button>
      </div>

      {/* Mobile Navigation Drawer Overlay */}
      {isMobileDrawerOpen && (
        <div className="admin-mobile-drawer-backdrop" onClick={() => setIsMobileDrawerOpen(false)}>
          <div className="admin-mobile-drawer" onClick={(e) => e.stopPropagation()}>
            <div className="admin-drawer-header">
              <div className="drawer-title">
                <Droplet size={18} className="drawer-logo-icon" />
                <span>VESPERA</span>
                <span className="drawer-title-sub">ADMIN</span>
              </div>
              <button className="drawer-close-btn" onClick={() => setIsMobileDrawerOpen(false)}>
                <X size={20} />
              </button>
            </div>

            <div className="drawer-section-label">Console Suite Mode</div>
            <div className="drawer-mode-group">
              <button
                className={`drawer-mode-btn ${packageMode === '4999_package' ? 'active' : ''}`}
                onClick={() => { updatePackageMode('4999_package'); setIsMobileDrawerOpen(false); }}
              >
                <Zap size={16} />
                <div className="drawer-mode-btn-text">
                  <span className="drawer-mode-name">4999 Catalog Mode</span>
                  <span className="drawer-mode-desc">Direct single-price &amp; bottle photos</span>
                </div>
              </button>
              <button
                className={`drawer-mode-btn ${packageMode === 'full_ecom' ? 'active' : ''}`}
                onClick={() => { updatePackageMode('full_ecom'); setIsMobileDrawerOpen(false); }}
              >
                <Sliders size={16} />
                <div className="drawer-mode-btn-text">
                  <span className="drawer-mode-name">Pro E-Commerce Suite</span>
                  <span className="drawer-mode-desc">Bookings, analytics, builder &amp; coupons</span>
                </div>
              </button>
            </div>

            <div className="drawer-section-label">Navigation Menu</div>
            <div className="drawer-nav-list">
              <button 
                className={`drawer-nav-item ${activeTab === 'products' ? 'active' : ''}`}
                onClick={() => { setActiveTab('products'); setIsMobileDrawerOpen(false); }}
              >
                <Package size={18} />
                <span>Product Catalog</span>
                <span className="drawer-badge">{products.length}</span>
              </button>
              <button 
                className={`drawer-nav-item ${activeTab === 'orders' ? 'active' : ''}`}
                onClick={() => { setActiveTab('orders'); setIsMobileDrawerOpen(false); }}
              >
                <ShoppingBag size={18} />
                <span>Booking History</span>
                <span className="drawer-badge orders-badge">{orders?.length || 0}</span>
              </button>
              {packageMode !== '4999_package' && (
                <>
                  <button 
                    className={`drawer-nav-item ${activeTab === 'analytics' ? 'active' : ''}`}
                    onClick={() => { setActiveTab('analytics'); setIsMobileDrawerOpen(false); }}
                  >
                    <TrendingUp size={18} />
                    <span>Revenue &amp; Stats</span>
                  </button>
                  <button 
                    className={`drawer-nav-item ${activeTab === 'homepage' ? 'active' : ''}`}
                    onClick={() => { setActiveTab('homepage'); setIsMobileDrawerOpen(false); }}
                  >
                    <Home size={18} />
                    <span>Homepage Builder</span>
                  </button>
                  <button 
                    className={`drawer-nav-item ${activeTab === 'banners' ? 'active' : ''}`}
                    onClick={() => { setActiveTab('banners'); setIsMobileDrawerOpen(false); }}
                  >
                    <Image size={18} />
                    <span>Hero Banners</span>
                    <span className="drawer-badge">{banners.length}</span>
                  </button>
                  <button 
                    className={`drawer-nav-item ${activeTab === 'categories' ? 'active' : ''}`}
                    onClick={() => { setActiveTab('categories'); setIsMobileDrawerOpen(false); }}
                  >
                    <Grid size={18} />
                    <span>Categories Showcase</span>
                    <span className="drawer-badge">{categories.length}</span>
                  </button>
                  <button 
                    className={`drawer-nav-item ${activeTab === 'coupons' ? 'active' : ''}`}
                    onClick={() => { setActiveTab('coupons'); setIsMobileDrawerOpen(false); }}
                  >
                    <Gift size={18} />
                    <span>Coupon Codes</span>
                    <span className="drawer-badge">{coupons.length}</span>
                  </button>
                </>
              )}
            </div>

            <div className="drawer-divider" />

            <div className="drawer-section-label">System Actions</div>
            <div className="drawer-action-list">
              <button 
                className="drawer-action-btn"
                onClick={() => { setIsAdminMode(false); window.location.href = '/'; }}
              >
                <ExternalLink size={16} />
                <span>View Storefront</span>
              </button>
              {packageMode !== '4999_package' && (
                <button 
                  className="drawer-action-btn danger"
                  onClick={() => { setIsMobileDrawerOpen(false); handleResetClick(); }}
                >
                  <RotateCcw size={16} />
                  <span>Reset System Defaults</span>
                </button>
              )}
              <button 
                className="drawer-action-btn logout"
                onClick={() => { adminLogout(); window.location.href = '/'; }}
              >
                <LogOut size={16} />
                <span>Exit Console</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Desktop Header */}
      <header className="admin-header">
        <div className="admin-header-brand">
          <div className="admin-brand-icon">
            <Droplet size={18} />
          </div>
          <div>
            <div className="admin-logo">
              VESPERA <span className="admin-logo-badge">EXECUTIVE</span>
            </div>
            <div className="admin-header-status">
              <span className="status-indicator-dot"></span>
              <span>{packageMode === '4999_package' ? '4999 Express Mode Active' : 'Pro E-Commerce Suite Active'}</span>
            </div>
          </div>
        </div>

        {/* Super Admin Mode Selector */}
        <div className="admin-mode-selector">
          <span className="mode-selector-label">Console Suite:</span>
          <div className="mode-toggle-group">
            <button
              type="button"
              className={`mode-toggle-btn ${packageMode === '4999_package' ? 'active package-4999' : ''}`}
              onClick={() => updatePackageMode('4999_package')}
              title="4999 Package Mode - Product Management & Direct Pricing"
            >
              <Zap size={14} />
              <span>4999 Mode</span>
              {packageMode === '4999_package' && <span className="mode-active-pill">ACTIVE</span>}
            </button>
            <button
              type="button"
              className={`mode-toggle-btn ${packageMode === 'full_ecom' ? 'active' : ''}`}
              onClick={() => updatePackageMode('full_ecom')}
              title="Full / Upgraded Ecom Mode - All Super Admin Options Visible"
            >
              <Sliders size={14} />
              <span>Pro Ecom</span>
              {packageMode === 'full_ecom' && <span className="mode-active-pill">ACTIVE</span>}
            </button>
          </div>
        </div>

        <div className="admin-nav-actions">
          <button 
            type="button"
            className="btn-admin-nav-action storefront" 
            onClick={() => { setIsAdminMode(false); window.location.href = '/'; }}
            title="Open Live Storefront"
          >
            <ExternalLink size={14} />
            <span>Storefront</span>
          </button>
          {packageMode !== '4999_package' && (
            <button 
              type="button"
              className="btn-admin-nav-action danger" 
              onClick={handleResetClick}
              title="Reset sample catalog data"
            >
              <RotateCcw size={14} />
              <span>Reset</span>
            </button>
          )}
          <button 
            type="button"
            className="btn-admin-nav-action logout" 
            onClick={() => { adminLogout(); window.location.href = '/'; }}
            title="Exit Admin Console"
          >
            <LogOut size={14} />
            <span>Exit</span>
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
          className={`admin-tab-btn ${activeTab === 'orders' ? 'active' : ''}`}
          onClick={() => setActiveTab('orders')}
          style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}
        >
          <span>Booking History</span>
          <span style={{ fontSize: '0.68rem', background: '#2563eb', color: '#fff', padding: '0.1rem 0.45rem', borderRadius: '10px', fontWeight: 700 }}>
            {orders?.length || 0}
          </span>
        </button>
        {packageMode !== '4999_package' && (
          <>
            <button 
              className={`admin-tab-btn ${activeTab === 'analytics' ? 'active' : ''}`}
              onClick={() => setActiveTab('analytics')}
            >
              Revenue &amp; Stats
            </button>
            <button 
              className={`admin-tab-btn ${activeTab === 'homepage' ? 'active' : ''}`}
              onClick={() => setActiveTab('homepage')}
            >
              Homepage Builder
            </button>
            <button 
              className={`admin-tab-btn ${activeTab === 'banners' ? 'active' : ''}`}
              onClick={() => setActiveTab('banners')}
            >
              Hero Banners
            </button>
            <button 
              className={`admin-tab-btn ${activeTab === 'categories' ? 'active' : ''}`}
              onClick={() => setActiveTab('categories')}
            >
              Categories
            </button>
            <button 
              className={`admin-tab-btn ${activeTab === 'coupons' ? 'active' : ''}`}
              onClick={() => setActiveTab('coupons')}
            >
              Coupon Codes
            </button>
          </>
        )}
      </div>


      {/* Product Catalog Section */}
      {activeTab === 'products' && (
        <>
          {/* Executive KPI Metrics Grid */}
          <div className="admin-kpi-grid">
            <div className="kpi-card">
              <div className="kpi-card-header">
                <span className="kpi-card-title">Total Products</span>
                <div className="kpi-icon-wrap gold">
                  <Package size={18} />
                </div>
              </div>
              <div className="kpi-card-value">{kpiStats.totalCount}</div>
              <div className="kpi-card-sub">
                <span>Active in catalog</span>
                <span className="kpi-badge">{packageMode === '4999_package' ? '4999 Mode' : 'Pro Ecom'}</span>
              </div>
            </div>

            {packageMode === '4999_package' ? (
              <>
                <div 
                  className="kpi-card interactive" 
                  onClick={() => setActiveTab('orders')} 
                  style={{ cursor: 'pointer' }} 
                  title="Click to view all booking records"
                >
                  <div className="kpi-card-header">
                    <span className="kpi-card-title">Total Bookings</span>
                    <div className="kpi-icon-wrap gold">
                      <ShoppingBag size={18} />
                    </div>
                  </div>
                  <div className="kpi-card-value">{orders?.length || 0}</div>
                  <div className="kpi-card-sub">
                    <span>Direct customer bookings</span>
                  </div>
                </div>

                <div className="kpi-card">
                  <div className="kpi-card-header">
                    <span className="kpi-card-title">Average Price</span>
                    <div className="kpi-icon-wrap gold">
                      <TrendingUp size={18} />
                    </div>
                  </div>
                  <div className="kpi-card-value">₹{kpiStats.avgPrice}</div>
                  <div className="kpi-card-sub">
                    <span>Per fragrance item</span>
                  </div>
                </div>

                <div className="kpi-card">
                  <div className="kpi-card-header">
                    <span className="kpi-card-title">Storefront Status</span>
                    <div className="kpi-icon-wrap success">
                      <CheckCircle size={18} />
                    </div>
                  </div>
                  <div className="kpi-card-value" style={{ fontSize: '1.25rem', color: '#16a34a', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#16a34a', display: 'inline-block' }}></span>
                    Live
                  </div>
                  <div className="kpi-card-sub">
                    <span>Direct online ordering</span>
                  </div>
                </div>
              </>
            ) : (
              <>
                <div className="kpi-card">
                  <div className="kpi-card-header">
                    <span className="kpi-card-title">Total Inventory</span>
                    <div className="kpi-icon-wrap success">
                      <Boxes size={18} />
                    </div>
                  </div>
                  <div className="kpi-card-value">{kpiStats.totalUnits}</div>
                  <div className="kpi-card-sub">
                    <span>Total bottles in stock</span>
                  </div>
                </div>

                <div 
                  className={`kpi-card interactive ${stockFilter === 'low_stock' ? 'active-filter' : ''}`}
                  onClick={() => setStockFilter(prev => prev === 'low_stock' ? 'ALL' : 'low_stock')}
                  title="Click to filter low stock items"
                >
                  <div className="kpi-card-header">
                    <span className="kpi-card-title">Stock Alerts</span>
                    <div className={`kpi-icon-wrap ${kpiStats.lowStock > 0 ? 'alert' : 'success'}`}>
                      {kpiStats.lowStock > 0 ? <AlertTriangle size={18} /> : <CheckCircle size={18} />}
                    </div>
                  </div>
                  <div className="kpi-card-value" style={{ color: kpiStats.lowStock > 0 ? '#dc2626' : undefined }}>
                    {kpiStats.lowStock}
                  </div>
                  <div className="kpi-card-sub">
                    <span>{kpiStats.lowStock > 0 ? 'Need restocking (< 5 units)' : 'All inventory healthy'}</span>
                  </div>
                </div>

                <div className="kpi-card">
                  <div className="kpi-card-header">
                    <span className="kpi-card-title">Average Price</span>
                    <div className="kpi-icon-wrap gold">
                      <TrendingUp size={18} />
                    </div>
                  </div>
                  <div className="kpi-card-value">₹{kpiStats.avgPrice}</div>
                  <div className="kpi-card-sub">
                    <span>Per fragrance item</span>
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Toolbar */}
          <div className="admin-toolbar">
            <div>
              <h1 className="admin-title">Product Catalog</h1>
              <span style={{ fontSize: '0.8rem', color: 'var(--color-charcoal-light)' }}>
                Managing {products.length} product(s) in luxury collection.
              </span>
            </div>
            <button className="btn-admin-primary" onClick={handleOpenAddModal} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Plus size={16} /> Add Product
            </button>
          </div>

          {packageMode === '4999_package' && (
            <div className="package-mode-executive-banner">
              <div className="pkg-banner-left">
                <div className="pkg-banner-icon-wrap">
                  <Zap size={20} />
                </div>
                <div className="pkg-banner-text">
                  <div className="pkg-banner-title">
                    4999 Catalog &amp; Fast-Selling Mode Active
                    <span className="pkg-banner-status-pill">STREAMLINED</span>
                  </div>
                  <p className="pkg-banner-desc">
                    Single-screen fragrance catalog, direct selling prices, and customer booking history.
                  </p>
                </div>
              </div>
              <div className="pkg-banner-right">
                <div className="pkg-feature-pills">
                  <span className="pkg-feat-chip" title="Instant real-time price synchronization">
                    <span className="pkg-feat-dot"></span>
                    <RefreshCw size={12} className="spin-on-hover" /> Instant Price Sync
                  </span>
                  <button 
                    type="button" 
                    className="pkg-feat-chip interactive" 
                    onClick={() => setActiveTab('orders')}
                    title="View Customer Booking History"
                  >
                    <ShoppingBag size={12} /> Booking History
                  </button>
                  <button 
                    type="button" 
                    className="pkg-feat-chip interactive" 
                    onClick={handleOpenAddModal}
                    title="Open Simple 4-Field Add Modal"
                  >
                    <Plus size={12} /> Fast 4-Field Add
                  </button>
                  <a 
                    href="/" 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="pkg-feat-chip interactive"
                    title="Open Live Fragrance Storefront"
                  >
                    <Eye size={12} /> Live Preview
                  </a>
                </div>
                <button 
                  type="button" 
                  className="btn-pkg-upgrade-mode"
                  onClick={() => updatePackageMode('full_ecom')}
                  title="Switch to Full E-commerce Mode with Orders & Analytics"
                >
                  <Sliders size={13} /> Switch to Pro Suite
                </button>
              </div>
            </div>
          )}

          {/* Advanced Search, Category Chips & Sorting Filter Bar */}
          <div className="admin-filter-bar-wrap">
            <div className="filter-top-row">
              <div className="search-input-wrap enhanced">
                <Search size={16} className="search-icon" />
                <input
                  id="catalog-search-input"
                  type="text"
                  className="search-input"
                  placeholder="Search products by name, notes, or scent type..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <span className="search-shortcut-kbd">⌘K</span>
                {searchTerm && (
                  <button type="button" className="clear-search-btn" onClick={() => setSearchTerm('')}>
                    <X size={14} />
                  </button>
                )}
              </div>

              {/* Category Quick Chips */}
              <div className="category-chip-group">
                {[
                  { id: 'ALL', label: 'All Scent Types' },
                  { id: 'unisex', label: 'Unisex' },
                  { id: 'men', label: 'Masculine' },
                  { id: 'women', label: 'Feminine' },
                  { id: 'discovery', label: 'Discovery Sets' },
                  { id: 'oils', label: 'Perfume Oils' }
                ].map((chip) => (
                  <button
                    key={chip.id}
                    type="button"
                    className={`category-chip ${categoryFilter === chip.id ? 'active' : ''}`}
                    onClick={() => setCategoryFilter(chip.id)}
                  >
                    {chip.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="filter-bottom-row">
              <div className="filter-dropdowns-group">
                {/* Stock Level Selector (Full E-Commerce Pro Only) */}
                {packageMode !== '4999_package' && (
                  <div className="filter-select-pill">
                    <Boxes size={14} style={{ color: 'var(--color-charcoal-light)' }} />
                    <select
                      value={stockFilter}
                      onChange={(e) => setStockFilter(e.target.value)}
                      aria-label="Filter by stock status"
                    >
                      <option value="ALL">All Inventory Levels</option>
                      <option value="in_stock">In Stock (5+ units)</option>
                      <option value="low_stock">Low Stock (1-4 units)</option>
                      <option value="out_of_stock">Out of Stock (0 units)</option>
                    </select>
                  </div>
                )}

                {/* Sort By Dropdown */}
                <div className="filter-select-pill">
                  <ArrowUpDown size={14} style={{ color: 'var(--color-charcoal-light)' }} />
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    aria-label="Sort products by"
                  >
                    <option value="default">Default Catalog Order</option>
                    <option value="price_asc">Price: Low to High</option>
                    <option value="price_desc">Price: High to Low</option>
                    {packageMode !== '4999_package' && (
                      <>
                        <option value="stock_asc">Stock: Low to High</option>
                        <option value="stock_desc">Stock: High to Low</option>
                      </>
                    )}
                    <option value="name_asc">Alphabetical: A to Z</option>
                  </select>
                </div>

                {/* Showcase Tag Filter (if upgraded mode) */}
                {packageMode !== '4999_package' && (
                  <div className="filter-select-pill">
                    <Sparkles size={14} style={{ color: 'var(--color-gold-deep)' }} />
                    <select
                      value={tagFilter}
                      onChange={(e) => setTagFilter(e.target.value)}
                      aria-label="Filter by showcase tag"
                    >
                      <option value="ALL">All Showcase Tags</option>
                      <option value="hero">Hero Spotlight Only</option>
                      <option value="bestseller">Best Sellers Only</option>
                      <option value="offer">Special Offers Only</option>
                    </select>
                  </div>
                )}
              </div>

              {/* Catalog View Mode Switcher: Table vs Showcase */}
              <div className="catalog-view-toggle">
                <button
                  type="button"
                  className={`view-toggle-btn ${catalogViewMode === 'table' ? 'active' : ''}`}
                  onClick={() => setCatalogViewMode('table')}
                  title="Table List View"
                >
                  <List size={14} />
                  <span>Table</span>
                </button>
                <button
                  type="button"
                  className={`view-toggle-btn ${catalogViewMode === 'grid' ? 'active' : ''}`}
                  onClick={() => setCatalogViewMode('grid')}
                  title="Fragrance Grid Showcase"
                >
                  <LayoutGrid size={14} />
                  <span>Showcase</span>
                </button>
              </div>

              {/* Filter Results Info & Reset Action */}
              <div className="filter-results-info">
                <span>Showing <strong>{filteredProducts.length}</strong> of {products.length} product(s)</span>
                {hasActiveFilters && (
                  <button type="button" className="filter-reset-link" onClick={handleResetFilters}>
                    <RotateCcw size={12} /> Reset Filters
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Main product catalog display */}
          {products.length === 0 ? (
            <div className="admin-empty-state">
              <h3 className="admin-empty-title">No Products Found</h3>
              <p className="admin-empty-desc">Get started by creating your very first catalog product.</p>
              <button className="btn-admin-primary" onClick={handleOpenAddModal}>
                Add First Product
              </button>
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="admin-empty-state">
              <h3 className="admin-empty-title">No Matching Products</h3>
              <p className="admin-empty-desc">No products matched your current search and filter criteria.</p>
              <button className="btn-admin-outline" onClick={handleResetFilters}>
                Clear All Filters
              </button>
            </div>
          ) : (
            <>
              {/* Showcase Grid View (Desktop & Tablet) */}
              {catalogViewMode === 'grid' && (
                <div className="admin-showcase-grid desktop-only-showcase">
                  {filteredProducts.map((prod) => {
                    const isOutOfStock = typeof prod.stock === 'number' && prod.stock <= 0;
                    const isLowStock = typeof prod.stock === 'number' && prod.stock > 0 && prod.stock < 5;
                    const angleCount = Array.isArray(prod.images) ? prod.images.length : (prod.image ? 1 : 0);
                    return (
                      <div 
                        key={prod.id} 
                        className="showcase-flacon-card"
                        onClick={() => handleOpenEditModal(prod)}
                        title="Click to edit fragrance"
                      >
                        <div className="showcase-card-media">
                          <img 
                            src={prod.images?.[0] || prod.image || '/assets/discovery_set.png'} 
                            alt={prod.name}
                            onError={(e) => { e.target.src = '/assets/discovery_set.png'; }}
                          />
                          <div className="showcase-badges-strip">
                            <span className="showcase-cat-pill">{prod.category}</span>
                            <span className="showcase-angle-pill"><Camera size={11} /> {angleCount}</span>
                          </div>
                          {packageMode !== '4999_package' && prod.isHeroProduct && (
                            <span className="showcase-spotlight-pill">SPOTLIGHT</span>
                          )}
                          {packageMode !== '4999_package' && prod.isBestSeller && (
                            <span className="showcase-bestseller-pill">BEST SELLER</span>
                          )}
                        </div>

                        <div className="showcase-card-body">
                          <div className="showcase-card-top-info">
                            <h4 className="showcase-prod-title">{prod.name}</h4>
                            <span className="showcase-prod-sub">{prod.type} · {prod.size}</span>
                          </div>

                          <div className="showcase-price-stock-row">
                            <div className="showcase-price-box">
                              <span className="showcase-currency">₹</span>
                              <span className="showcase-price-num">{prod.price}</span>
                              {packageMode !== '4999_package' && prod.mrp && Number(prod.mrp) > Number(prod.price) && (
                                <span className="showcase-mrp-num">₹{prod.mrp}</span>
                              )}
                            </div>
                            {packageMode !== '4999_package' && (
                              <span className={`showcase-stock-tag ${isOutOfStock ? 'out-of-stock' : isLowStock ? 'low-stock' : 'in-stock'}`}>
                                {isOutOfStock ? 'Sold Out' : `${prod.stock} in stock`}
                              </span>
                            )}
                          </div>

                          <div className="showcase-card-footer" onClick={(e) => e.stopPropagation()}>
                            <button
                              type="button"
                              className="btn-showcase-edit"
                              onClick={() => handleOpenEditModal(prod)}
                            >
                              <Edit size={13} /> Edit Fragrance
                            </button>
                            <button
                              type="button"
                              className="btn-showcase-del"
                              onClick={() => handleDeleteProductClick(prod.id, prod.name)}
                              title="Delete Product"
                            >
                              <Trash2 size={13} />
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Desktop Table View */}
              {catalogViewMode === 'table' && (
                <div className="admin-table-wrapper desktop-only-table">
                  <table className="admin-table product-table">
                    <thead>
                      <tr>
                        <th>Cover</th>
                        <th>Name / Scent Type</th>
                        <th>Category</th>
                        {packageMode !== '4999_package' && <th>Inventory Stock</th>}
                        <th>Price</th>
                        {packageMode !== '4999_package' && <th>MRP</th>}
                        <th style={{ textAlign: 'right' }}>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredProducts.map((prod) => {
                        const isOutOfStock = typeof prod.stock === 'number' && prod.stock <= 0;
                        const isLowStock = typeof prod.stock === 'number' && prod.stock > 0 && prod.stock < 5;
                        return (
                          <tr 
                            key={prod.id}
                            className="admin-product-row"
                            onClick={(e) => {
                              if (!e.target.closest('button') && !e.target.closest('input') && !e.target.closest('select') && !e.target.closest('form')) {
                                handleOpenEditModal(prod);
                              }
                            }}
                            style={{ cursor: 'pointer' }}
                            title="Click to edit product"
                          >
                            <td>
                              <img 
                                src={prod.images?.[0] || prod.image || '/assets/discovery_set.png'} 
                                alt={prod.name} 
                                className="admin-prod-thumb"
                                onError={(e) => { e.target.src = '/assets/discovery_set.png'; }}
                              />
                            </td>
                            <td>
                              <div style={{ fontWeight: 600, color: 'var(--color-charcoal)', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                                {prod.name}
                                {packageMode !== '4999_package' && prod.isHeroProduct && (
                                  <span style={{ fontSize: '0.62rem', background: '#fef3c7', color: '#92400e', padding: '0.1rem 0.35rem', borderRadius: '3px', fontWeight: 700 }}>
                                    SPOTLIGHT
                                  </span>
                                )}
                                {packageMode !== '4999_package' && prod.isBestSeller && (
                                  <span style={{ fontSize: '0.62rem', background: '#e0e7ff', color: '#3730a3', padding: '0.1rem 0.35rem', borderRadius: '3px', fontWeight: 700 }}>
                                    BEST SELLER
                                  </span>
                                )}
                              </div>
                              <div style={{ fontSize: '0.75rem', color: 'var(--color-charcoal-light)', marginTop: '0.15rem' }}>
                                {prod.type} • {prod.size}
                              </div>
                            </td>
                            <td>
                              <span className="badge-category">{prod.category}</span>
                            </td>
                            {packageMode !== '4999_package' && (
                              <td>
                                <div className="stock-stepper-cell">
                                  <span className={`stock-badge-wrap ${isOutOfStock ? 'out-of-stock' : isLowStock ? 'low-stock' : 'in-stock'}`}>
                                    {isOutOfStock ? 'Sold Out' : `${prod.stock} in stock`}
                                  </span>
                                  <div style={{ display: 'inline-flex', gap: '2px', marginLeft: '0.2rem' }}>
                                    <button 
                                      type="button" 
                                      className="stock-stepper-btn" 
                                      onClick={(e) => { e.stopPropagation(); handleQuickStockChange(prod.id, -1); }}
                                      title="Decrease stock by 1"
                                      disabled={isOutOfStock}
                                    >
                                      -
                                    </button>
                                    <button 
                                      type="button" 
                                      className="stock-stepper-btn" 
                                      onClick={(e) => { e.stopPropagation(); handleQuickStockChange(prod.id, 1); }}
                                      title="Increase stock by 1"
                                    >
                                      +
                                    </button>
                                  </div>
                                </div>
                              </td>
                            )}
                            <td>
                              {editingPriceId === prod.id ? (
                                <form 
                                  onSubmit={(e) => { e.preventDefault(); handleSaveInlinePrice(prod.id); }} 
                                  className="inline-price-edit-form"
                                  onClick={(e) => e.stopPropagation()}
                                >
                                  <span className="inline-currency-symbol">₹</span>
                                  <input
                                    type="number"
                                    className="inline-price-input"
                                    value={tempPriceValue}
                                    onChange={(e) => setTempPriceValue(e.target.value)}
                                    min="0"
                                    autoFocus
                                    required
                                  />
                                  <button type="submit" className="btn-inline-save" title="Save Price">
                                    <Check size={12} />
                                  </button>
                                  <button type="button" className="btn-inline-cancel" onClick={handleCancelInlinePrice} title="Cancel">
                                    <X size={12} />
                                  </button>
                                </form>
                              ) : (
                                <div className="table-price-cell">
                                  <span className="table-price-val">₹{prod.price}</span>
                                  <button 
                                    type="button" 
                                    className="btn-quick-edit-price" 
                                    onClick={(e) => { e.stopPropagation(); handleStartEditPrice(prod); }} 
                                    title="Click to edit price directly in table"
                                  >
                                    <Edit size={12} />
                                  </button>
                                </div>
                              )}
                            </td>
                            {packageMode !== '4999_package' && (
                              <td style={{ color: 'var(--color-charcoal-light)', textDecoration: 'line-through' }}>
                                ₹{prod.mrp}
                              </td>
                            )}
                            <td style={{ textAlign: 'right' }}>
                              <div className="table-actions-cell">
                                <button 
                                  className="btn-table-action" 
                                  onClick={(e) => { e.stopPropagation(); handleOpenEditModal(prod); }}
                                  title="Edit Product"
                                  type="button"
                                >
                                  <Edit size={14} />
                                </button>
                                {packageMode !== '4999_package' && (
                                  <button 
                                    className="btn-table-action duplicate" 
                                    onClick={(e) => { e.stopPropagation(); handleDuplicateProduct(prod); }}
                                    title="Duplicate Product (Clone)"
                                    type="button"
                                  >
                                    <Copy size={14} />
                                  </button>
                                )}
                                <button 
                                  className="btn-table-action delete" 
                                  onClick={(e) => { e.stopPropagation(); handleDeleteProductClick(prod.id, prod.name); }}
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

              {/* Dedicated Mobile Product Cards View (Phone Optimized) */}
              <div className="admin-mobile-products-view mobile-only-catalog">
                {filteredProducts.map((prod) => {
                  const isOutOfStock = typeof prod.stock === 'number' && prod.stock <= 0;
                  const isLowStock = typeof prod.stock === 'number' && prod.stock > 0 && prod.stock < 5;
                  const angleCount = Array.isArray(prod.images) ? prod.images.length : (prod.image ? 1 : 0);
                  return (
                    <div key={prod.id} className="admin-mob-card">
                      <div className="admin-mob-card-top" onClick={() => handleOpenEditModal(prod)}>
                        <div className="admin-mob-card-img-wrap">
                          <img 
                            src={prod.images?.[0] || prod.image || '/assets/discovery_set.png'} 
                            alt={prod.name} 
                            className="admin-mob-thumb"
                            onError={(e) => { e.target.src = '/assets/discovery_set.png'; }}
                          />
                          {packageMode !== '4999_package' && prod.isHeroProduct && (
                            <span className="mob-badge-spotlight">Spotlight</span>
                          )}
                          {packageMode !== '4999_package' && prod.isBestSeller && (
                            <span className="mob-badge-bestseller">Best Seller</span>
                          )}
                          {packageMode !== '4999_package' && isOutOfStock && (
                            <span className="mob-badge-soldout">Sold Out</span>
                          )}
                          <span className="mob-angle-count-pill">
                            <Camera size={11} /> {angleCount} {angleCount === 1 ? 'Angle' : 'Angles'}
                          </span>
                        </div>

                        <div className="admin-mob-card-details">
                          <div className="admin-mob-title-row">
                            <h3 className="admin-mob-title">{prod.name}</h3>
                            <span className="badge-category">{prod.category}</span>
                          </div>
                          <p className="admin-mob-type">{prod.type} • {prod.size}</p>
                          {prod.notes && <p className="admin-mob-notes">{prod.notes}</p>}

                          <div className="admin-mob-pricing-row">
                            <div className="admin-mob-price-main">
                              <span className="mob-currency">₹</span>
                              <span className="mob-price-val">{prod.price}</span>
                              {packageMode !== '4999_package' && prod.mrp && Number(prod.mrp) > Number(prod.price) && (
                                <span className="mob-mrp-val">₹{prod.mrp}</span>
                              )}
                            </div>
                            {packageMode !== '4999_package' && (
                              <span className={`mob-stock-pill ${isOutOfStock ? 'out-of-stock' : isLowStock ? 'low-stock' : 'in-stock'}`}>
                                {isOutOfStock ? 'Sold Out' : `${prod.stock} in stock`}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="admin-mob-card-actions">
                        {/* Quick Stock Controls (Full E-commerce Only) */}
                        {packageMode !== '4999_package' && (
                          <div className="mob-stock-stepper">
                            <span className="mob-stepper-label">Stock:</span>
                            <button
                              type="button"
                              className="mob-step-btn"
                              onClick={() => handleQuickStockChange(prod.id, -1)}
                              disabled={isOutOfStock}
                              title="Decrease stock by 1"
                            >
                              -
                            </button>
                            <span className="mob-step-val">{prod.stock}</span>
                            <button
                              type="button"
                              className="mob-step-btn"
                              onClick={() => handleQuickStockChange(prod.id, 1)}
                              title="Increase stock by 1"
                            >
                              +
                            </button>
                          </div>
                        )}

                        {/* Action Buttons */}
                        <div className="mob-action-btns-group">
                          <button
                            type="button"
                            className="btn-mob-action primary"
                            onClick={() => handleOpenEditModal(prod)}
                          >
                            <Edit size={13} /> Edit Angles &amp; Info
                          </button>
                          {packageMode !== '4999_package' && (
                            <button
                              type="button"
                              className="btn-mob-action outline"
                              onClick={() => handleDuplicateProduct(prod)}
                              title="Duplicate (Clone)"
                            >
                              <Copy size={13} />
                            </button>
                          )}
                          <button
                            type="button"
                            className="btn-mob-action danger"
                            onClick={() => handleDeleteProductClick(prod.id, prod.name)}
                            title="Delete Product"
                          >
                            <Trash2 size={13} />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </>
          )}
        </>
      )}

      {/* Hero Banners Section */}
      {activeTab === 'banners' && (
        <>
          <div className="admin-toolbar">
            <div>
              <h1 className="admin-title">Hero Banners</h1>
              <span style={{ fontSize: '0.8rem', color: 'var(--color-charcoal-light)' }}>
                Managing {banners.length} banner(s) stored locally. Active banners will cycle in the home page slideshow.
              </span>
            </div>
            <button className="btn-admin-primary" onClick={handleOpenAddBannerModal} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Plus size={16} /> Add Banner
            </button>
          </div>

          {banners.length === 0 ? (
            <div className="admin-empty-state">
              <h3 className="admin-empty-title">No Banners Found</h3>
              <p className="admin-empty-desc">Create your first hero banner with text and image content.</p>
              <button className="btn-admin-primary" onClick={handleOpenAddBannerModal}>
                Add First Banner
              </button>
            </div>
          ) : (
            <div className="admin-table-wrapper">
              <table className="admin-table product-table">
                <thead>
                  <tr>
                    <th>Image</th>
                    <th>Heading Details</th>
                    <th>Status</th>
                    <th style={{ textAlign: 'right' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {banners.map((b) => (
                    <tr key={b.id}>
                      <td>
                        <img 
                          src={b.image || '/assets/hero_perfume_v6.jpg'} 
                          alt={b.title} 
                          className="admin-prod-thumb"
                          onError={(e) => { e.target.src = '/assets/hero_perfume_v6.jpg'; }}
                        />
                      </td>
                      <td>
                        <div style={{ fontWeight: 600, color: 'var(--color-charcoal)' }}>{b.title.replace(/\n/g, ' ')}</div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--color-charcoal-light)' }}>{b.subtitle}</div>
                        <p style={{ fontSize: '0.75rem', color: 'var(--color-charcoal-medium)', margin: '0.3rem 0 0', lineHeight: 1.4 }}>{b.description}</p>
                      </td>
                      <td>
                        <button
                          type="button"
                          className={`btn-status-toggle ${b.isActive ? 'active' : 'inactive'}`}
                          onClick={() => handleToggleBannerActive(b)}
                        >
                          <span className="status-dot" />
                          {b.isActive ? 'Active' : 'Inactive'}
                        </button>
                      </td>
                      <td style={{ textAlign: 'right' }}>
                        <div style={{ display: 'inline-flex', gap: '0.5rem' }}>
                          <button 
                            className="btn-admin-outline" 
                            style={{ padding: '0.4rem', borderRadius: '4px', border: '1px solid var(--border-light)' }} 
                            onClick={() => handleOpenEditBannerModal(b)}
                            title="Edit Banner"
                            type="button"
                          >
                            <Edit size={14} />
                          </button>
                          <button 
                            className="btn-admin-outline" 
                            style={{ padding: '0.4rem', borderRadius: '4px', border: '1px solid #fee2e2', color: '#dc2626' }} 
                            onClick={() => handleDeleteBanner(b.id)}
                            title="Delete Banner"
                            type="button"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </>
      )}

      {/* Categories Showcase Section */}
      {activeTab === 'categories' && (
        <>
          <div className="admin-toolbar">
            <div>
              <h1 className="admin-title">Categories Showcase</h1>
              <span style={{ fontSize: '0.8rem', color: 'var(--color-charcoal-light)' }}>
                Managing {categories.length} category card(s) stored locally.
              </span>
            </div>
            <button className="btn-admin-primary" onClick={handleOpenAddCategoryModal} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Plus size={16} /> Add Category
            </button>
          </div>

          {categories.length === 0 ? (
            <div className="admin-empty-state">
              <h3 className="admin-empty-title">No Categories Found</h3>
              <p className="admin-empty-desc">Create custom categories with cover photos to filter catalog items dynamically.</p>
              <button className="btn-admin-primary" onClick={handleOpenAddCategoryModal}>
                Add First Category
              </button>
            </div>
          ) : (
            <div className="admin-table-wrapper">
              <table className="admin-table product-table">
                <thead>
                  <tr>
                    <th>Cover Photo</th>
                    <th>Label</th>
                    <th>Slug ID</th>
                    <th>Lucide Icon</th>
                    <th style={{ textAlign: 'right' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {categories.map((c) => (
                    <tr key={c.id}>
                      <td>
                        <img 
                          src={c.image || '/assets/product_sample.png'} 
                          alt={c.label} 
                          className="admin-prod-thumb"
                          onError={(e) => { e.target.src = '/assets/product_sample.png'; }}
                        />
                      </td>
                      <td>
                        <div style={{ fontWeight: 600, color: 'var(--color-charcoal)' }}>{c.label}</div>
                      </td>
                      <td>
                        <span className="badge-category" style={{ background: '#f3f4f6', color: '#374151' }}>{c.id}</span>
                      </td>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--color-charcoal-light)', fontSize: '0.85rem' }}>
                          <span style={{ color: 'var(--color-gold-deep)' }}>{c.icon}</span>
                        </div>
                      </td>
                      <td style={{ textAlign: 'right' }}>
                        <div style={{ display: 'inline-flex', gap: '0.5rem' }}>
                          <button 
                            className="btn-admin-outline" 
                            style={{ padding: '0.4rem', borderRadius: '4px', border: '1px solid var(--border-light)' }} 
                            onClick={() => handleOpenEditCategoryModal(c)}
                            title="Edit Category"
                            type="button"
                          >
                            <Edit size={14} />
                          </button>
                          <button 
                            className="btn-admin-outline" 
                            style={{ padding: '0.4rem', borderRadius: '4px', border: '1px solid #fee2e2', color: '#dc2626' }} 
                            onClick={() => handleDeleteCategory(c.id)}
                            title="Delete Category"
                            type="button"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </>
      )}

      {/* Client Bookings Tab */}
      {activeTab === 'orders' && (
        <AdminOrdersTab
          orders={orders}
          filteredOrders={filteredOrders}
          orderSearchTerm={orderSearchTerm}
          setOrderSearchTerm={setOrderSearchTerm}
          orderStatusFilter={orderStatusFilter}
          setOrderStatusFilter={setOrderStatusFilter}
          orderPaymentFilter={orderPaymentFilter}
          setOrderPaymentFilter={setOrderPaymentFilter}
          analyticsData={analyticsData}
          updateOrderStatus={updateOrderStatus}
          deleteOrder={deleteOrder}
          setSelectedOrderInvoice={setSelectedOrderInvoice}
          showToast={showToast}
          packageMode={packageMode}
        />
      )}

      {/* Revenue & Stats Graph Dashboard Tab */}
      {activeTab === 'analytics' && (
        <AdminAnalyticsTab
          analyticsData={analyticsData}
          analyticsTimeframe={analyticsTimeframe}
          setAnalyticsTimeframe={setAnalyticsTimeframe}
          hoveredDataPoint={hoveredDataPoint}
          setHoveredDataPoint={setHoveredDataPoint}
        />
      )}

      {/* WordPress-Style Homepage Builder Tab */}
      {activeTab === 'homepage' && (
        <AdminHomepageBuilder
          homeForm={homeForm}
          setHomeForm={setHomeForm}
          selectedHomeSection={selectedHomeSection}
          setSelectedHomeSection={setSelectedHomeSection}
          banners={banners}
          categories={categories}
          products={products}
          selectedSpotlightId={selectedSpotlightId}
          setSelectedSpotlightId={setSelectedSpotlightId}
          updateProduct={updateProduct}
          updateHomepageSettings={updateHomepageSettings}
          setIsAdminMode={setIsAdminMode}
          showToast={showToast}
          editingBanner={editingBanner}
          setEditingBanner={setEditingBanner}
          bannerTitle={bannerTitle}
          setBannerTitle={setBannerTitle}
          bannerSubtitle={bannerSubtitle}
          setBannerSubtitle={setBannerSubtitle}
          bannerDesc={bannerDesc}
          setBannerDesc={setBannerDesc}
          bannerImage={bannerImage}
          setBannerImage={setBannerImage}
          bannerIsActive={bannerIsActive}
          setBannerIsActive={setBannerIsActive}
          handleBannerFormSubmit={handleBannerFormSubmit}
          handleOpenEditBannerModal={handleOpenEditBannerModal}
          handleDeleteBanner={handleDeleteBanner}
          handleBannerFileChange={handleBannerFileChange}
          editingCategory={editingCategory}
          setEditingCategory={setEditingCategory}
          categoryLabel={categoryLabel}
          setCategoryLabel={setCategoryLabel}
          categoryImage={categoryImage}
          setCategoryImage={setCategoryImage}
          categoryIcon={categoryIcon}
          setCategoryIcon={setCategoryIcon}
          handleCategoryFormSubmit={handleCategoryFormSubmit}
          handleOpenEditCategoryModal={handleOpenEditCategoryModal}
          handleDeleteCategory={handleDeleteCategory}
          handleCategoryFileChange={handleCategoryFileChange}
          handleHomeFormSubmit={handleHomeFormSubmit}
          handleStoryOneFileChange={handleStoryOneFileChange}
          handleStoryTwoFileChange={handleStoryTwoFileChange}
        />
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
              <table className="admin-table coupon-table">
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

      {/* Create / Edit Product Modal */}
      {isModalOpen && (
        <div className="admin-modal-overlay">
          <div className="admin-modal">
            {/* Mobile Sheet Drag Handle */}
            <div className="admin-modal-drag-handle" aria-hidden="true" />
            <div className="admin-modal-header">
              <div>
                <h3 className="admin-modal-title">
                  {editingProduct ? `Edit Product: ${editingProduct.name}` : 'Create New Product'}
                </h3>
                <span style={{ fontSize: '0.75rem', color: 'var(--color-charcoal-light)' }}>
                  {packageMode === '4999_package'
                    ? (editingProduct ? 'Edit product image, name, price, and description' : 'Enter product image, name, price, and description')
                    : (editingProduct ? `ID: ${editingProduct.id}` : 'Fill in the fragrance details below')}
                </span>
              </div>
              <button className="admin-modal-close" onClick={() => setIsModalOpen(false)} aria-label="Close Modal">
                <X size={20} />
              </button>
            </div>

            {/* Modal Navigation Tabs (Full Ecom Mode Only) */}
            {packageMode !== '4999_package' && (
              <div className="modal-nav-tabs">
                <button
                  type="button"
                  className={`modal-nav-tab ${modalFormTab === 'details' ? 'active' : ''}`}
                  onClick={() => setModalFormTab('details')}
                >
                  <Tag size={15} /> Basic Details
                </button>
                <button
                  type="button"
                  className={`modal-nav-tab ${modalFormTab === 'pricing' ? 'active' : ''}`}
                  onClick={() => setModalFormTab('pricing')}
                >
                  <DollarSign size={15} /> Pricing &amp; Stock
                </button>
                <button
                  type="button"
                  className={`modal-nav-tab ${modalFormTab === 'notes' ? 'active' : ''}`}
                  onClick={() => setModalFormTab('notes')}
                >
                  <Droplet size={15} /> Scent Pyramid &amp; Story
                </button>
                <button
                  type="button"
                  className={`modal-nav-tab ${modalFormTab === 'gallery' ? 'active' : ''}`}
                  onClick={() => setModalFormTab('gallery')}
                >
                  <Image size={15} /> Image Gallery ({formImages.length})
                </button>
              </div>
            )}

            {/* Mobile Modal Tab Navigation (Form vs Live Preview) */}
            <div className="admin-mobile-modal-tabs">
              <button 
                type="button" 
                className={`mobile-modal-tab-btn ${mobileModalTab === 'form' ? 'active' : ''}`}
                onClick={() => setMobileModalTab('form')}
              >
                <Edit size={14} /> Form Details
              </button>
              <button 
                type="button" 
                className={`mobile-modal-tab-btn ${mobileModalTab === 'preview' ? 'active' : ''}`}
                onClick={() => setMobileModalTab('preview')}
              >
                <Eye size={14} /> Live Preview
              </button>
            </div>

            <form onSubmit={handleFormSubmit} className="admin-modal-form-root">
              <div className="admin-modal-body">
                <div className="admin-modal-body-split">
                  
                  {/* Left Form Pane */}
                  <div className={`admin-modal-form-pane ${mobileModalTab === 'preview' ? 'mobile-hidden-pane' : ''}`}>
                    
                    {packageMode === '4999_package' ? (
                      /* ULTRA-STREAMLINED 4999 MODE: STRICTLY PRODUCT IMAGE, PRODUCT NAME, PRICE, SIMPLE DESCRIPTION */
                      <div className="admin-4999-simple-form">
                        
                        {/* 1. PRODUCT IMAGE UPLOAD */}
                        <div className="simple-form-card">
                          <label className="simple-form-label">
                            <Image size={16} className="text-gold" /> Product Image *
                          </label>

                          {formImages.length > 0 ? (
                            <div className="simple-image-preview-card">
                              <img 
                                src={formImages[0]} 
                                alt="Product" 
                                className="simple-preview-thumb" 
                                onError={(e) => { e.target.src = '/assets/discovery_set.png'; }}
                              />
                              <div className="simple-image-info-pane">
                                <div className="simple-image-badge-ready">✓ Image Ready</div>
                                <div className="simple-image-actions">
                                  <label className="btn-simple-change-img" title="Select different image">
                                    <FileUp size={14} /> Change Image
                                    <input 
                                      type="file" 
                                      accept="image/*" 
                                      className="hidden-file-input" 
                                      style={{ display: 'none' }}
                                      onChange={handleImageFilesChange} 
                                    />
                                  </label>
                                  <button 
                                    type="button" 
                                    className="btn-simple-remove-img" 
                                    onClick={handleClearAllImages}
                                    title="Remove photo"
                                  >
                                    <Trash2 size={14} /> Remove
                                  </button>
                                </div>
                              </div>
                            </div>
                          ) : (
                            <div className="simple-upload-dropzone">
                              <div className="simple-dropzone-inner">
                                <div className="simple-upload-icon-circle">
                                  <Camera size={24} />
                                </div>
                                <div className="simple-upload-heading">Select Product Image</div>
                                <p className="simple-upload-sub">Take a photo using camera or choose from photo library</p>
                                
                                <div className="simple-upload-buttons">
                                  <label className="btn-simple-upload-camera" title="Take photo directly">
                                    <Camera size={15} /> Take Photo (Camera)
                                    <input 
                                      type="file" 
                                      accept="image/*" 
                                      capture="environment"
                                      className="hidden-file-input" 
                                      style={{ display: 'none' }}
                                      onChange={handleImageFilesChange} 
                                    />
                                  </label>
                                  <label className="btn-simple-upload-gallery" title="Choose from library">
                                    <FileUp size={15} /> Choose Photo
                                    <input 
                                      type="file" 
                                      accept="image/*" 
                                      className="hidden-file-input" 
                                      style={{ display: 'none' }}
                                      onChange={handleImageFilesChange} 
                                    />
                                  </label>
                                </div>
                              </div>

                              <div className="simple-url-divider">
                                <span>OR PASTE IMAGE URL</span>
                              </div>

                              <div className="simple-url-input-row">
                                <input 
                                  type="text" 
                                  className="form-input simple-url-field" 
                                  value={newImageUrl} 
                                  onChange={(e) => setNewImageUrl(e.target.value)} 
                                  placeholder="https://example.com/product-image.jpg"
                                />
                                <button 
                                  type="button" 
                                  className="btn-simple-add-url" 
                                  onClick={handleAddImageUrl}
                                >
                                  Add URL
                                </button>
                              </div>
                            </div>
                          )}
                        </div>

                        {/* 2. PRODUCT NAME */}
                        <div className="simple-form-card">
                          <label className="simple-form-label">
                            <Tag size={16} className="text-gold" /> Product Name *
                          </label>
                          <input 
                            type="text" 
                            className="form-input simple-input-prominent" 
                            value={formName} 
                            onChange={(e) => setFormName(e.target.value)} 
                            placeholder="e.g. VESPERA Grand Soir" 
                            required
                          />
                        </div>

                        {/* 3. PRICE */}
                        <div className="simple-form-card">
                          <label className="simple-form-label">
                            <DollarSign size={16} className="text-gold" /> Price (₹) *
                          </label>
                          <div className="price-input-wrapper">
                            <span className="price-currency-tag">₹</span>
                            <input 
                              type="number" 
                              className="form-input price-field simple-input-prominent" 
                              value={formPrice} 
                              onChange={(e) => setFormPrice(Number(e.target.value))} 
                              min="0"
                              placeholder="1199"
                              required
                            />
                          </div>
                        </div>

                        {/* 4. SIMPLE DESCRIPTION */}
                        <div className="simple-form-card">
                          <label className="simple-form-label">
                            <Droplet size={16} className="text-gold" /> Simple Description *
                          </label>
                          <textarea 
                            className="form-textarea simple-textarea" 
                            value={formDescription} 
                            onChange={(e) => {
                              setFormDescription(e.target.value);
                              setFormLongDescription(e.target.value);
                            }} 
                            placeholder="Brief scent description or highlights for your customers..." 
                            rows={3}
                            required
                          />
                        </div>

                      </div>
                    ) : (
                      <>
                        {/* TAB 1: BASIC DETAILS, PRICING & IMAGES */}
                        {modalFormTab === 'details' && (
                          <div className="form-tab-section">
                            <div className="form-section-header">
                              <div className="form-section-title">
                                <Tag size={16} style={{ color: 'var(--color-gold-deep)' }} /> Product Information &amp; Core Settings
                              </div>
                              <div className="form-section-sub">
                                Manage core naming, fragrance category, and showcase tags.
                              </div>
                            </div>

                            <div className="admin-form-grid">
                              {/* Name */}
                              <div className="form-group admin-form-col-full">
                                <label className="form-label">Product Name *</label>
                                <input 
                                  type="text" 
                                  className="form-input" 
                                  value={formName} 
                                  onChange={(e) => setFormName(e.target.value)} 
                                  placeholder="e.g. VESPERA Blue" 
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
                              <div className="form-group admin-form-col-full">
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

                              {/* CORE PRICING FIELD */}
                              <div className="form-group admin-form-col-full" style={{ padding: '1rem 1.2rem', background: 'var(--bg-ivory)', borderRadius: '6px', border: '1px solid var(--border-medium)' }}>
                                <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--color-gold-deep)', marginBottom: '0.4rem' }}>
                                  <DollarSign size={15} />
                                  Selling Price (₹) *
                                </label>
                                <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                                  <div style={{ position: 'relative', flex: 1 }}>
                                    <span style={{ position: 'absolute', left: '0.9rem', top: '50%', transform: 'translateY(-50%)', fontWeight: 700, color: 'var(--color-charcoal-medium)', fontSize: '1rem' }}>₹</span>
                                    <input 
                                      type="number" 
                                      className="form-input" 
                                      style={{ paddingLeft: '2rem', fontSize: '1.1rem', fontWeight: 700, color: 'var(--color-charcoal)' }}
                                      value={formPrice} 
                                      onChange={(e) => setFormPrice(e.target.value)} 
                                      min="0"
                                      placeholder="Enter price"
                                      required
                                    />
                                  </div>
                                  <div style={{ position: 'relative', flex: 1 }}>
                                    <span style={{ position: 'absolute', left: '0.9rem', top: '50%', transform: 'translateY(-50%)', fontWeight: 700, color: 'var(--color-charcoal-medium)', fontSize: '1rem' }}>₹</span>
                                    <input 
                                      type="number" 
                                      className="form-input" 
                                      style={{ paddingLeft: '2rem', fontSize: '1.1rem', fontWeight: 700 }}
                                      value={formMRP} 
                                      onChange={(e) => setFormMRP(e.target.value)} 
                                      min="0"
                                      placeholder="MRP (₹)"
                                      required
                                    />
                                  </div>
                                </div>
                                <span style={{ fontSize: '0.72rem', color: 'var(--color-charcoal-light)', marginTop: '0.4rem', display: 'block' }}>
                                  Selling Price is the checkout price. MRP is used for strikethrough comparison.
                                </span>
                              </div>

                              {/* PRODUCT IMAGE GALLERY & MULTI-ANGLE UPLOADER */}
                              <div className="form-group admin-form-col-full image-manager-section" style={{ margin: '0.5rem 0 1rem' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.6rem' }}>
                                  <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--color-charcoal)', margin: 0 }}>
                                    <Image size={15} /> Product Images &amp; View Angles ({formImages.length})
                                  </label>
                                  {formImages.length > 0 && (
                                    <button
                                      type="button"
                                      onClick={handleClearAllImages}
                                      style={{ background: 'none', border: 'none', color: '#dc2626', fontSize: '0.72rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.2rem' }}
                                    >
                                      <Trash2 size={12} /> Clear All
                                    </button>
                                  )}
                                </div>

                                {/* View Angles Recommendation Guide */}
                                <div className="view-angles-guide-chips">
                                  <span className="angles-guide-title">
                                    <RotateCw size={11} /> Multi-Angle Guide:
                                  </span>
                                  {VIEW_ANGLE_PRESETS.map((preset) => (
                                    <span key={preset} className="angle-guide-chip">{preset}</span>
                                  ))}
                                </div>

                                {/* Mobile Camera & File Upload Action Bar */}
                                <div className="mobile-upload-actions-bar">
                                  <label className="btn-mobile-upload-camera" title="Snap bottle directly using device camera" style={{ position: 'relative', overflow: 'hidden' }}>
                                    <Camera size={16} />
                                    <span>Snap Bottle (Camera)</span>
                                    <input 
                                      type="file" 
                                      accept="image/*" 
                                      capture="environment"
                                      className="hidden-file-input" 
                                      style={{ display: 'none' }}
                                      onChange={handleImageFilesChange} 
                                    />
                                  </label>
                                  <label className="btn-mobile-upload-gallery" title="Choose photos from device gallery" style={{ position: 'relative', overflow: 'hidden' }}>
                                    <FileUp size={16} />
                                    <span>Add from Gallery</span>
                                    <input 
                                      type="file" 
                                      multiple 
                                      accept="image/*" 
                                      className="hidden-file-input" 
                                      style={{ display: 'none' }}
                                      onChange={handleImageFilesChange} 
                                    />
                                  </label>
                                </div>

                                {/* Image Previews */}
                                {formImages.length > 0 ? (
                                  <div className="image-gallery-grid" style={{ marginBottom: '1rem' }}>
                                    {formImages.map((img, idx) => (
                                      <div className="image-gallery-item" key={idx}>
                                        <img src={img} alt={`Gallery angle ${idx}`} />
                                        {idx === 0 ? (
                                          <span className="image-badge-primary">Cover</span>
                                        ) : (
                                          <button
                                            type="button"
                                            className="image-set-cover-btn"
                                            onClick={() => handleSetPrimaryImage(idx)}
                                            title="Set as primary cover"
                                          >
                                            Set Cover
                                          </button>
                                        )}
                                        <button 
                                          type="button" 
                                          className="image-delete-btn" 
                                          onClick={() => handleRemoveImage(idx)}
                                          title="Remove Image"
                                        >
                                          <X size={10} />
                                        </button>
                                        {/* View Angle Tag Selector */}
                                        <div className="image-angle-select-wrap">
                                          <select
                                            className="image-angle-tag-select"
                                            value={formImageAngles[idx] || (idx === 0 ? 'Front / Hero Flacon' : (VIEW_ANGLE_PRESETS[idx % VIEW_ANGLE_PRESETS.length] || 'Angle View'))}
                                            onChange={(e) => handleUpdateImageAngle(idx, e.target.value)}
                                            title="Assign view angle to this photo"
                                          >
                                            {VIEW_ANGLE_PRESETS.map(opt => (
                                              <option key={opt} value={opt}>{opt}</option>
                                            ))}
                                          </select>
                                        </div>
                                      </div>
                                    ))}
                                  </div>
                                ) : (
                                  <div style={{ padding: '0.8rem', textAlign: 'center', background: '#fff', border: '1px dashed var(--border-medium)', borderRadius: '4px', marginBottom: '1rem', color: 'var(--color-charcoal-light)', fontSize: '0.78rem' }}>
                                    No images uploaded yet. Snap bottle with your camera or select images from gallery.
                                  </div>
                                )}

                                {/* Drag and Drop Zone (Desktop & Tablet) */}
                                <div 
                                  className={`image-dropzone-box ${isDraggingOver ? 'dragging' : ''}`}
                                  onDragOver={handleDragOver}
                                  onDragLeave={handleDragLeave}
                                  onDrop={handleDrop}
                                  style={{ marginBottom: '1rem' }}
                                >
                                  <div className="image-dropzone-icon">
                                    <FileUp size={20} />
                                  </div>
                                  <div className="image-dropzone-title">
                                    Drag &amp; Drop Multiple Image Files Here
                                  </div>
                                  <div className="image-dropzone-hint">
                                    Supports PNG, JPG, WEBP • Upload multiple bottle angles at once
                                  </div>
                                </div>

                                {/* Add Image URLs input */}
                                <div className="image-input-field-wrap">
                                  <input 
                                    type="text" 
                                    className="form-input" 
                                    style={{ flex: 1 }}
                                    value={newImageUrl} 
                                    onChange={(e) => setNewImageUrl(e.target.value)} 
                                    placeholder="Paste image URL (or multiple comma-separated URLs)..."
                                  />
                                  <button 
                                    type="button" 
                                    className="btn-admin-outline" 
                                    onClick={handleAddImageUrl}
                                    style={{ whiteSpace: 'nowrap' }}
                                  >
                                    Add URL(s)
                                  </button>
                                </div>
                              </div>

                              {/* Showcase Highlights */}
                              <div className="form-group admin-form-col-full" style={{ display: 'flex', gap: '1.2rem', flexWrap: 'wrap', padding: '1rem', background: 'var(--bg-ivory)', borderRadius: '6px', border: '1px solid var(--border-medium)' }}>
                                <label style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', cursor: 'pointer', fontSize: '0.8rem', fontWeight: 600, color: 'var(--color-charcoal-medium)' }}>
                                  <input 
                                    type="checkbox" 
                                    checked={formIsHero} 
                                    onChange={(e) => setFormIsHero(e.target.checked)} 
                                  />
                                  Hero Scent Spotlight
                                </label>
                                <label style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', cursor: 'pointer', fontSize: '0.8rem', fontWeight: 600, color: 'var(--color-charcoal-medium)' }}>
                                  <input 
                                    type="checkbox" 
                                    checked={formIsBestSeller} 
                                    onChange={(e) => setFormIsBestSeller(e.target.checked)} 
                                  />
                                  Best Seller Badge
                                </label>
                                <label style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', cursor: 'pointer', fontSize: '0.8rem', fontWeight: 600, color: 'var(--color-charcoal-medium)' }}>
                                  <input 
                                    type="checkbox" 
                                    checked={formIsOffer} 
                                    onChange={(e) => setFormIsOffer(e.target.checked)} 
                                  />
                                  Special Offer Tag
                                </label>
                              </div>
                            </div>
                          </div>
                        )}

                        {/* TAB 2: PRICING & INVENTORY */}
                        {modalFormTab === 'pricing' && (
                          <div className="form-tab-section">
                            <div className="form-section-header">
                              <div className="form-section-title">
                                <DollarSign size={16} style={{ color: 'var(--color-gold-deep)' }} /> Pricing &amp; Inventory Management
                              </div>
                              <div className="form-section-sub">
                                Manage retail selling price, strikethrough MRP, and stock inventory.
                              </div>
                            </div>

                            <div className="admin-form-grid">
                              {/* Price */}
                              <div className="form-group">
                                <label className="form-label">Selling Price (₹) *</label>
                                <input 
                                  type="number" 
                                  className="form-input" 
                                  value={formPrice} 
                                  onChange={(e) => setFormPrice(e.target.value)} 
                                  min="0"
                                  required
                                />
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

                              {/* Stock Inventory */}
                              <div className="form-group admin-form-col-full">
                                <label className="form-label">Stock Inventory (Bottles) *</label>
                                <input 
                                  type="number" 
                                  className="form-input" 
                                  value={formStock} 
                                  onChange={(e) => setFormStock(e.target.value)} 
                                  min="0"
                                  required
                                />
                                
                                {/* Stock Presets */}
                                <div className="stock-preset-chips">
                                  <span style={{ fontSize: '0.72rem', color: 'var(--color-charcoal-light)', alignSelf: 'center' }}>Quick Set:</span>
                                  <button type="button" className="stock-preset-chip" onClick={() => setFormStock(prev => Number(prev || 0) + 5)}>+5 units</button>
                                  <button type="button" className="stock-preset-chip" onClick={() => setFormStock(prev => Number(prev || 0) + 10)}>+10 units</button>
                                  <button type="button" className="stock-preset-chip" onClick={() => setFormStock(prev => Number(prev || 0) + 25)}>+25 units</button>
                                  <button type="button" className="stock-preset-chip" onClick={() => setFormStock(15)}>Reset (15)</button>
                                  <button type="button" className="stock-preset-chip" style={{ color: '#dc2626' }} onClick={() => setFormStock(0)}>Mark Sold Out (0)</button>
                                </div>
                              </div>
                            </div>
                          </div>
                        )}

                        {/* TAB 3: SCENT PYRAMID & STORY */}
                        {modalFormTab === 'notes' && (
                          <div className="form-tab-section">
                            <div className="form-section-header">
                              <div className="form-section-title">
                                <Droplet size={16} style={{ color: 'var(--color-gold-deep)' }} /> Fragrance Notes &amp; Storytelling
                              </div>
                              <div className="form-section-sub">Describe top, heart, and base notes alongside performance specs.</div>
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

                            {/* Olfactive Pyramid 3-Card Grid */}
                            <div className="pyramid-notes-grid">
                              <div className="pyramid-card">
                                <div className="pyramid-card-title">
                                  <Sun size={14} /> Top Notes
                                </div>
                                <input 
                                  type="text" 
                                  className="form-input" 
                                  value={formTopNotes} 
                                  onChange={(e) => setFormTopNotes(e.target.value)} 
                                  placeholder="e.g. Saffron, Lime"
                                />
                                <span style={{ fontSize: '0.68rem', color: 'var(--color-charcoal-light)' }}>First 15-30 mins impression</span>
                              </div>

                              <div className="pyramid-card">
                                <div className="pyramid-card-title">
                                  <Flower size={14} /> Heart Notes
                                </div>
                                <input 
                                  type="text" 
                                  className="form-input" 
                                  value={formHeartNotes} 
                                  onChange={(e) => setFormHeartNotes(e.target.value)} 
                                  placeholder="e.g. Amber, Jasmine"
                                />
                                <span style={{ fontSize: '0.68rem', color: 'var(--color-charcoal-light)' }}>Core 2-6 hours character</span>
                              </div>

                              <div className="pyramid-card">
                                <div className="pyramid-card-title">
                                  <Flame size={14} /> Base Notes
                                </div>
                                <input 
                                  type="text" 
                                  className="form-input" 
                                  value={formBaseNotes} 
                                  onChange={(e) => setFormBaseNotes(e.target.value)} 
                                  placeholder="e.g. Sandalwood, Musk"
                                />
                                <span style={{ fontSize: '0.68rem', color: 'var(--color-charcoal-light)' }}>Enduring 8+ hours drydown</span>
                              </div>
                            </div>

                            {/* Longevity & Projection */}
                            <div className="admin-form-grid" style={{ marginTop: '0.5rem' }}>
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

                              <div className="form-group admin-form-col-full">
                                <label className="form-label">Short Description (Product Card Summary)</label>
                                <textarea 
                                  className="form-textarea" 
                                  value={formDescription} 
                                  onChange={(e) => setFormDescription(e.target.value)} 
                                  placeholder="A concise summary shown on storefront product cards..."
                                  rows={2}
                                />
                              </div>

                              <div className="form-group admin-form-col-full">
                                <label className="form-label">Detailed Story (Product Details Modal)</label>
                                <textarea 
                                  className="form-textarea" 
                                  value={formLongDescription} 
                                  onChange={(e) => setFormLongDescription(e.target.value)} 
                                  placeholder="Full narrative story displayed in the luxury quick-view modal..."
                                  rows={4}
                                />
                              </div>
                            </div>
                          </div>
                        )}

                        {/* TAB 4: IMAGE GALLERY & MULTI-ANGLE MEDIA */}
                        {modalFormTab === 'gallery' && (
                          <div className="form-tab-section">
                            <div className="form-section-header">
                              <div className="form-section-title">
                                <Image size={16} style={{ color: 'var(--color-gold-deep)' }} /> Product Image Gallery &amp; View Angles ({formImages.length})
                              </div>
                              <div className="form-section-sub">Tag each angle for realistic 360° bottle exploration on mobile &amp; desktop.</div>
                            </div>

                            {/* View Angles Recommendation Guide */}
                            <div className="view-angles-guide-chips">
                              <span className="angles-guide-title">
                                <RotateCw size={11} /> Multi-Angle Guide:
                              </span>
                              {VIEW_ANGLE_PRESETS.map((preset) => (
                                <span key={preset} className="angle-guide-chip">{preset}</span>
                              ))}
                            </div>

                            {/* Mobile Camera & File Upload Action Bar */}
                            <div className="mobile-upload-actions-bar">
                              <label className="btn-mobile-upload-camera" title="Snap bottle directly using device camera" style={{ position: 'relative', overflow: 'hidden' }}>
                                <Camera size={16} />
                                <span>Snap Bottle (Camera)</span>
                                <input 
                                  type="file" 
                                  accept="image/*" 
                                  capture="environment"
                                  className="hidden-file-input" 
                                  style={{ display: 'none' }}
                                  onChange={handleImageFilesChange} 
                                />
                              </label>
                              <label className="btn-mobile-upload-gallery" title="Choose photos from device gallery" style={{ position: 'relative', overflow: 'hidden' }}>
                                <FileUp size={16} />
                                <span>Add from Gallery</span>
                                <input 
                                  type="file" 
                                  multiple 
                                  accept="image/*" 
                                  className="hidden-file-input" 
                                  style={{ display: 'none' }}
                                  onChange={handleImageFilesChange} 
                                />
                              </label>
                            </div>

                            {/* Image Previews */}
                            {formImages.length > 0 ? (
                              <div className="image-gallery-grid" style={{ marginBottom: '1rem' }}>
                                {formImages.map((img, idx) => (
                                  <div className="image-gallery-item" key={idx}>
                                    <img src={img} alt={`Gallery angle ${idx}`} />
                                    {idx === 0 ? (
                                      <span className="image-badge-primary">Cover</span>
                                    ) : (
                                      <button
                                        type="button"
                                        className="image-set-cover-btn"
                                        onClick={() => handleSetPrimaryImage(idx)}
                                        title="Make this image the primary cover"
                                      >
                                        Set Cover
                                      </button>
                                    )}
                                    <button 
                                      type="button" 
                                      className="image-delete-btn" 
                                      onClick={() => handleRemoveImage(idx)}
                                      title="Remove Image"
                                    >
                                      <X size={10} />
                                    </button>
                                    {/* View Angle Tag Selector */}
                                    <div className="image-angle-select-wrap">
                                      <select
                                        className="image-angle-tag-select"
                                        value={formImageAngles[idx] || (idx === 0 ? 'Front / Hero Flacon' : (VIEW_ANGLE_PRESETS[idx % VIEW_ANGLE_PRESETS.length] || 'Angle View'))}
                                        onChange={(e) => handleUpdateImageAngle(idx, e.target.value)}
                                        title="Assign view angle to this photo"
                                      >
                                        {VIEW_ANGLE_PRESETS.map(opt => (
                                          <option key={opt} value={opt}>{opt}</option>
                                        ))}
                                      </select>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            ) : (
                              <div style={{ padding: '0.8rem', textAlign: 'center', background: '#fff', border: '1px dashed var(--border-medium)', borderRadius: '4px', marginBottom: '1rem', color: 'var(--color-charcoal-light)', fontSize: '0.78rem' }}>
                                No images uploaded yet. Snap bottle with your camera or select images from gallery.
                              </div>
                            )}

                            {/* Add Controls */}
                            <div className="image-inputs-row">
                              <div className="image-input-field-wrap">
                                <input 
                                  type="text" 
                                  className="form-input" 
                                  style={{ flex: 1 }}
                                  value={newImageUrl} 
                                  onChange={(e) => setNewImageUrl(e.target.value)} 
                                  placeholder="Paste external image URL (e.g. https://...)..."
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
                            </div>
                          </div>
                        )}
                      </>
                    )}

                  </div>

                  {/* Right Live Synchronized Preview Pane */}
                  <div className={`admin-modal-preview-pane ${mobileModalTab === 'form' ? 'mobile-hidden-pane' : ''}`}>
                    <div className="preview-pane-header-row">
                      <h4 className="preview-pane-title" style={{ margin: 0 }}>Live Storefront Card Preview</h4>
                      {packageMode !== '4999_package' && formImages.length > 1 && (
                        <button
                          type="button"
                          className={`btn-preview-rotate ${isAutoRotatingAngles ? 'active' : ''}`}
                          onClick={() => setIsAutoRotatingAngles(!isAutoRotatingAngles)}
                          title={isAutoRotatingAngles ? 'Pause 360° rotation' : 'Auto-rotate all view angles'}
                        >
                          {isAutoRotatingAngles ? <Pause size={12} /> : <Play size={12} />}
                          <span>{isAutoRotatingAngles ? 'Pause 360°' : '360° Auto-Rotate'}</span>
                        </button>
                      )}
                    </div>

                    {/* Multi-Angle Switcher Pill Strip (Full Ecom Only) */}
                    {packageMode !== '4999_package' && formImages.length > 1 && (
                      <div className="preview-angle-switcher">
                        <div className="preview-angle-tabs-header">
                          <span className="preview-angle-label">
                            <RotateCw size={12} className={isAutoRotatingAngles ? 'spin-icon' : ''} /> 
                            Active View: {formImageAngles[previewAngleIndex] || `Angle ${previewAngleIndex + 1}`} ({previewAngleIndex + 1}/{formImages.length})
                          </span>
                        </div>
                        <div className="preview-angle-pills-row">
                          {formImages.map((_, aIdx) => (
                            <button
                              key={aIdx}
                              type="button"
                              className={`preview-angle-pill ${previewAngleIndex === aIdx ? 'active' : ''}`}
                              onClick={() => {
                                setIsAutoRotatingAngles(false);
                                setPreviewAngleIndex(aIdx);
                              }}
                            >
                              {formImageAngles[aIdx] || (aIdx === 0 ? 'Front' : `Angle ${aIdx + 1}`)}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    <div className="preview-card-wrap">
                      <div className="pc-card" style={{ transform: 'none', animation: 'none', opacity: 1, cursor: 'default' }}>
                        <div className="pc-image-wrap" style={{ cursor: 'default', position: 'relative' }}>
                          {packageMode !== '4999_package' && formIsOffer ? (
                            <span className="pc-badge">Special Offer</span>
                          ) : formIsBestSeller ? (
                            <span className="pc-badge">Best Seller</span>
                          ) : (
                            <span className="pc-badge">Featured</span>
                          )}
                          <img
                            src={formImages?.[previewAngleIndex] || formImages?.[0] || '/assets/discovery_set.png'}
                            alt={`${formName || 'Product'} Preview`}
                            className="pc-img"
                            onError={(e) => { e.target.src = '/assets/discovery_set.png'; }}
                          />
                          <div className="pc-scrim" aria-hidden="true" />

                          {/* Active View Angle Badge Overlay (Full Ecom Only) */}
                          {packageMode !== '4999_package' && formImages.length > 0 && (
                            <div className="preview-active-angle-badge">
                              📸 {formImageAngles[previewAngleIndex] || (previewAngleIndex === 0 ? 'Front / Hero Flacon' : `Angle ${previewAngleIndex + 1}`)}
                            </div>
                          )}

                          {/* Touch Left & Right Chevron Arrows (Full Ecom Only) */}
                          {packageMode !== '4999_package' && formImages.length > 1 && (
                            <>
                              <button
                                type="button"
                                className="preview-arrow-btn prev"
                                onClick={(e) => { e.stopPropagation(); handlePrevAngle(); }}
                                aria-label="Previous view angle"
                              >
                                ‹
                              </button>
                              <button
                                type="button"
                                className="preview-arrow-btn next"
                                onClick={(e) => { e.stopPropagation(); handleNextAngle(); }}
                                aria-label="Next view angle"
                              >
                                ›
                              </button>
                            </>
                          )}
                        </div>

                        {/* View Angle Dot Indicators (Full Ecom Only) */}
                        {packageMode !== '4999_package' && formImages.length > 1 && (
                          <div className="preview-angle-dots">
                            {formImages.map((_, dIdx) => (
                              <button
                                key={dIdx}
                                type="button"
                                className={`preview-angle-dot ${previewAngleIndex === dIdx ? 'active' : ''}`}
                                onClick={() => {
                                  setIsAutoRotatingAngles(false);
                                  setPreviewAngleIndex(dIdx);
                                }}
                                aria-label={`Switch to angle ${dIdx + 1}`}
                              />
                            ))}
                          </div>
                        )}

                        <div className="pc-info" style={{ textDecoration: 'none' }}>
                          {packageMode !== '4999_package' && (
                            <span className="pc-type">
                              {formType || 'Eau de Parfum'} · {formSize || '50ml'}
                            </span>
                          )}
                          <h3 className="pc-title" style={{ cursor: 'default' }}>
                            {formName || 'Product Name'}
                          </h3>
                          <p className="pc-notes" style={{
                            lineClamp: 2,
                            WebkitLineClamp: 2,
                            display: '-webkit-box',
                            WebkitBoxOrient: 'vertical',
                            overflow: 'hidden'
                          }}>
                            {packageMode === '4999_package' ? (formDescription || 'Fragrance description...') : (formNotes || 'Notes Subtitle')}
                          </p>
                          <div className="pc-price-row">
                            {packageMode !== '4999_package' && formMRP && Number(formMRP) > Number(formPrice) && (
                              <span className="pc-mrp">MRP ₹{formMRP || 0}</span>
                            )}
                            <span className="pc-price">₹{formPrice || 0}</span>
                          </div>
                          <button className="pc-cta" type="button" disabled style={{ opacity: 0.85, cursor: 'not-allowed' }}>
                            <span className="pc-cta-inner">Add to Cart</span>
                          </button>
                        </div>
                      </div>

                      {/* Quick Angle Thumbnails Strip (Full Ecom Only) */}
                      {packageMode !== '4999_package' && formImages.length > 1 && (
                        <div className="preview-thumbs-strip">
                          {formImages.map((img, tIdx) => (
                            <button
                              key={tIdx}
                              type="button"
                              className={`preview-thumb-btn ${previewAngleIndex === tIdx ? 'active' : ''}`}
                              onClick={() => {
                                setIsAutoRotatingAngles(false);
                                setPreviewAngleIndex(tIdx);
                              }}
                              title={formImageAngles[tIdx] || `Angle ${tIdx + 1}`}
                            >
                              <img src={img} alt={`Angle ${tIdx + 1}`} />
                              <span className="thumb-angle-label">{formImageAngles[tIdx] || `A${tIdx + 1}`}</span>
                            </button>
                          ))}
                        </div>
                      )}

                      <div style={{ marginTop: '1rem', padding: '0.85rem 1rem', background: 'var(--bg-ivory)', border: '1px solid var(--border-light)', borderRadius: '8px', width: '100%', boxSizing: 'border-box' }}>
                        <div style={{ fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 700, color: 'var(--color-gold-deep)', marginBottom: '0.35rem' }}>
                          {packageMode === '4999_package' ? '⚡ 4999 Mode: Live Customer View' : 'Catalog Note'}
                        </div>
                        <p style={{ fontSize: '0.78rem', color: 'var(--color-charcoal-light)', lineHeight: 1.4, margin: 0 }}>
                          {formDescription || 'Short description preview will appear here...'}
                        </p>
                      </div>
                    </div>
                  </div>

                </div>
              </div>

              {/* Modal Footer */}
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

      {/* Banner Create/Edit Modal */}
      {isBannerModalOpen && (
        <div className="admin-modal-overlay">
          <div className="admin-modal" style={{ maxWidth: '600px' }}>
            <div className="admin-modal-header">
              <h3 className="admin-modal-title">{editingBanner ? 'Edit Hero Banner' : 'Add Hero Banner'}</h3>
              <button type="button" className="admin-modal-close" onClick={() => setIsBannerModalOpen(false)}>
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleBannerFormSubmit}>
              <div className="admin-modal-body" style={{ maxHeight: 'calc(80vh - 120px)', overflowY: 'auto' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '1rem' }}>
                  
                  {/* Image upload / Base64 */}
                  <div className="form-group">
                    <label className="form-label">Banner Image * <span style={{ fontSize: '0.72rem', color: 'var(--color-charcoal-light)', fontWeight: 'normal', marginLeft: '0.5rem' }}>(Recommended size: 1920 × 1080px or 1200 × 1200px)</span></label>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
                      {bannerImage && (
                        <div style={{ position: 'relative', width: '100%', height: '140px', borderRadius: '4px', overflow: 'hidden', border: '1px solid var(--border-light)' }}>
                          <img src={bannerImage} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        </div>
                      )}
                      <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                        <label className="btn-admin-outline" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', cursor: 'pointer', margin: 0 }}>
                          <FileUp size={16} />
                          Upload Cover File
                          <input 
                            type="file" 
                            accept="image/*" 
                            style={{ display: 'none' }} 
                            onChange={handleBannerFileChange} 
                          />
                        </label>
                        <span style={{ fontSize: '0.72rem', color: 'var(--color-charcoal-light)' }}>or type image asset path:</span>
                      </div>
                      <input 
                        type="text" 
                        className="form-input" 
                        placeholder="/assets/hero_perfume_v6.jpg" 
                        value={bannerImage} 
                        onChange={(e) => setBannerImage(e.target.value)} 
                      />
                    </div>
                  </div>

                  {/* Title / Heading */}
                  <div className="form-group">
                    <label className="form-label">Heading Title *</label>
                    <textarea 
                      className="form-input" 
                      style={{ height: '70px', resize: 'vertical' }}
                      value={bannerTitle} 
                      onChange={(e) => setBannerTitle(e.target.value)} 
                      placeholder="Enter heading. Use newlines (\n) to break lines.&#10;e.g. Crafted to\nBecome Your\nSignature Scent"
                      required
                    />
                  </div>

                  {/* Subtitle / Eyebrow */}
                  <div className="form-group">
                    <label className="form-label">Subtitle / Eyebrow *</label>
                    <input 
                      type="text" 
                      className="form-input" 
                      value={bannerSubtitle} 
                      onChange={(e) => setBannerSubtitle(e.target.value)} 
                      placeholder="e.g. VESPERA Parfums — Maison de Haute Parfumerie"
                      required
                    />
                  </div>

                  {/* Description / Paragraph */}
                  <div className="form-group">
                    <label className="form-label">Description Paragraph *</label>
                    <textarea 
                      className="form-input" 
                      style={{ height: '80px', resize: 'vertical' }}
                      value={bannerDesc} 
                      onChange={(e) => setBannerDesc(e.target.value)} 
                      placeholder="Write description paragraph..."
                      required
                    />
                  </div>

                  {/* Active Toggle */}
                  <div className="form-group">
                    <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontSize: '0.85rem', fontWeight: 600 }}>
                      <input 
                        type="checkbox" 
                        checked={bannerIsActive} 
                        onChange={(e) => setBannerIsActive(e.target.checked)} 
                      />
                      Make this banner active immediately
                    </label>
                  </div>

                </div>
              </div>

              <div className="admin-modal-footer">
                <button type="button" className="btn-admin-outline" onClick={() => setIsBannerModalOpen(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn-admin-primary">
                  {editingBanner ? 'Save Changes' : 'Create Banner'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Category Create/Edit Modal */}
      {isCategoryModalOpen && (
        <div className="admin-modal-overlay">
          <div className="admin-modal" style={{ maxWidth: '480px' }}>
            <div className="admin-modal-header">
              <h3 className="admin-modal-title">{editingCategory ? 'Edit Category' : 'Add Category'}</h3>
              <button type="button" className="admin-modal-close" onClick={() => setIsCategoryModalOpen(false)}>
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleCategoryFormSubmit}>
              <div className="admin-modal-body">
                <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '1rem' }}>
                  
                  {/* Category Image upload */}
                  <div className="form-group">
                    <label className="form-label">Category Cover Image *</label>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
                      {categoryImage && (
                        <div style={{ position: 'relative', width: '100%', height: '140px', borderRadius: '4px', overflow: 'hidden', border: '1px solid var(--border-light)' }}>
                          <img src={categoryImage} alt="Category Cover" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        </div>
                      )}
                      <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                        <label className="btn-admin-outline" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', cursor: 'pointer', margin: 0 }}>
                          <FileUp size={16} />
                          Upload Cover Image
                          <input 
                            type="file" 
                            accept="image/*" 
                            style={{ display: 'none' }} 
                            onChange={handleCategoryFileChange} 
                          />
                        </label>
                        <span style={{ fontSize: '0.72rem', color: 'var(--color-charcoal-light)' }}>or type URL:</span>
                      </div>
                      <input 
                        type="text" 
                        className="form-input" 
                        placeholder="/assets/product_pure.jpg" 
                        value={categoryImage} 
                        onChange={(e) => setCategoryImage(e.target.value)} 
                      />
                    </div>
                  </div>

                  {/* Label / Name */}
                  <div className="form-group">
                    <label className="form-label">Category Title *</label>
                    <input 
                      type="text" 
                      className="form-input" 
                      value={categoryLabel} 
                      onChange={(e) => setCategoryLabel(e.target.value)} 
                      placeholder="e.g. Masculine Collection, Summer Scents"
                      required
                    />
                  </div>

                  {/* Scent Icon selection */}
                  <div className="form-group">
                    <label className="form-label">Lucide Icon name (for menus) *</label>
                    <select 
                      className="form-select" 
                      value={categoryIcon} 
                      onChange={(e) => setCategoryIcon(e.target.value)}
                    >
                      <option value="Sparkles">Sparkles (Feminine)</option>
                      <option value="Compass">Compass (Masculine)</option>
                      <option value="Layers">Layers (Unisex)</option>
                      <option value="Grid">Grid (Discovery/All)</option>
                      <option value="Droplet">Droplet (Oils)</option>
                      <option value="Gift">Gift (Gifting)</option>
                      <option value="Flower">Flower (Floral)</option>
                      <option value="Flame">Flame (Spicy/Oud)</option>
                      <option value="Sun">Sun (Summer)</option>
                      <option value="Wind">Wind (Fresh)</option>
                      <option value="Heart">Heart (Romantic)</option>
                      <option value="Award">Award (Premium)</option>
                    </select>
                  </div>

                </div>
              </div>

              <div className="admin-modal-footer">
                <button type="button" className="btn-admin-outline" onClick={() => setIsCategoryModalOpen(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn-admin-primary">
                  {editingCategory ? 'Save Changes' : 'Create Category'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {/* Mobile Floating Action Button (FAB) - Hidden when modal sheets are open */}
      {!isModalOpen && !isCouponModalOpen && !isBannerModalOpen && !isCategoryModalOpen && (
        <button 
          className="admin-mobile-fab" 
          onClick={handleFabClick} 
          aria-label="Add Item"
          title="Add New Item"
        >
          <Plus size={24} />
        </button>
      )}

      {/* Mobile Bottom Navigation Bar */}
      <nav className="admin-mobile-bottom-nav">
        <button 
          type="button"
          className={`mobile-nav-item ${activeTab === 'products' ? 'active' : ''}`}
          onClick={() => setActiveTab('products')}
        >
          <Package size={20} />
          <span>Products</span>
        </button>

        <button 
          type="button"
          className={`mobile-nav-item ${activeTab === 'orders' ? 'active' : ''}`}
          onClick={() => setActiveTab('orders')}
        >
          <div style={{ position: 'relative', display: 'inline-flex' }}>
            <ShoppingBag size={20} />
            {orders && orders.length > 0 && (
              <span className="mob-nav-badge">{orders.length}</span>
            )}
          </div>
          <span>Bookings</span>
        </button>

        {packageMode !== '4999_package' && (
          <>

            <button 
              type="button"
              className={`mobile-nav-item ${activeTab === 'analytics' ? 'active' : ''}`}
              onClick={() => setActiveTab('analytics')}
            >
              <BarChart2 size={20} />
              <span>Analytics</span>
            </button>

            <button 
              type="button"
              className={`mobile-nav-item ${activeTab === 'homepage' ? 'active' : ''}`}
              onClick={() => setActiveTab('homepage')}
            >
              <Home size={20} />
              <span>Homepage</span>
            </button>
          </>
        )}

        <button 
          type="button"
          className="mobile-nav-item"
          onClick={() => setIsMobileDrawerOpen(true)}
          aria-label="Open More Menu Drawer"
        >
          <Menu size={20} />
          <span>Menu</span>
        </button>
      </nav>

      {/* Tax Invoice Modal (Full E-commerce Only) */}
      {selectedOrderInvoice && packageMode !== '4999_package' && (
        <AdminInvoiceModal 
          order={selectedOrderInvoice} 
          onClose={() => setSelectedOrderInvoice(null)} 
        />
      )}

      {/* Floating Toast Notification Container */}
      <div className="toast-container" aria-live="polite">
        {toasts.map((t) => (
          <div key={t.id} className={`toast-card ${t.type}`}>
            <div className="toast-icon">
              {t.type === 'success' && <CheckCircle size={18} style={{ color: '#22c55e' }} />}
              {t.type === 'warning' && <AlertTriangle size={18} style={{ color: '#f59e0b' }} />}
              {t.type === 'danger' && <AlertCircle size={18} style={{ color: '#ef4444' }} />}
              {t.type === 'info' && <Info size={18} style={{ color: 'var(--color-gold)' }} />}
            </div>
            <div className="toast-content">
              {t.title && <div className="toast-title">{t.title}</div>}
              <div className="toast-msg">{t.message}</div>
            </div>
            <button 
              className="toast-close" 
              onClick={() => removeToast(t.id)} 
              aria-label="Close notification"
            >
              <X size={14} />
            </button>
          </div>
        ))}
      </div>

    </div>
  );
}
