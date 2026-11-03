import React, { createContext, useState, useEffect } from 'react';

export const AppContext = createContext();

const PRODUCTS = [
  {
    id: 'discovery-set',
    name: 'Discovery Collection',
    type: 'Discovery Sets',
    size: '5 × 8ml',
    mrp: 1499,
    price: 799,
    image: '/assets/discovery_set.png',
    certImage: '/assets/product_discovery_infographic.jpg',
    notes: 'Rose, Sandalwood, Citrus, Oud, Amber',
    category: 'discovery',
    isDiscovery: true,
    description: 'A curated collection of five signature fragrances (8ml each) designed to help you experience VESPERA and discover your perfect signature scent.',
    longDescription: 'Our Discovery Collection is the perfect introduction to the world of VESPERA. It contains five premium travel-sized spray vials (8ml each), allowing you to wear and test each fragrance on your skin before choosing a full 50ml bottle. Packaged in a luxury matte black presentation box.',
    olfactiveNotes: {
      top: 'Various (Floral, Woody, Citrus, Smoky)',
      heart: 'Various (Jasmine, Iris, Patchouli, Amber)',
      base: 'Various (Musk, Sandalwood, Leather, Cedar)'
    },
    longevity: '8+ Hours',
    projection: 'Moderate to Strong',
    occasion: 'Daily Discovery & Gifting',
    howToUse: 'Spritz on pulse points (wrists, neck, and behind ears). Wear them individually or layer them to create your own signature scent blend.'
  },
  {
    id: 'vespera-blue',
    name: 'VESPERA Blue',
    type: 'Eau de Parfum',
    size: '50ml',
    mrp: 2499,
    price: 1199,
    image: '/assets/product_blue.jpg',
    certImage: '/assets/product_blue_infographic.jpg',
    notes: 'Aqua · Lime · Jasmine',
    category: 'unisex',
    description: 'A vibrant, fresh aquatic signature bursting with crisp lime, cool aqua notes, and delicate jasmine blossoms.',
    longDescription: 'VESPERA Blue is a bold, invigorating journey into freshness. It opens with a sparkling burst of zesty lime and crisp aquatic accords, transitioning into a heart of fresh jasmine and clean white florals. The base settles into cool musk and cedarwood — energetic, clean, and undeniably modern.',
    olfactiveNotes: {
      top: 'Lime, Aquatic Accord, Bergamot',
      heart: 'Jasmine, White Flowers, Green Leaves',
      base: 'Cool Musk, Cedarwood, Amberwood'
    },
    longevity: '8-10 Hours',
    projection: 'Moderate to Strong',
    occasion: 'Daily Wear, Office & Outdoor Activities',
    howToUse: 'Spray 2-3 times on pulse points — wrists, neck, and collarbones. Ideal after a shower for a long-lasting, refreshing projection throughout the day.'
  },
  {
    id: 'vespera-wood',
    name: 'VESPERA Wood',
    type: 'Eau de Parfum',
    size: '50ml',
    mrp: 2499,
    price: 1199,
    image: '/assets/product_wood.jpg',
    certImage: '/assets/product_wood_infographic.jpg',
    notes: 'Sandalwood · Amber · Cedar',
    category: 'women',
    description: 'A deep, warm woody signature crafted from rich sandalwood, golden amber, and smooth cedarwood for an enduring presence.',
    longDescription: 'VESPERA Wood is an ode to the warmth of ancient forests. It opens with a spiced, golden accord of cardamom and cinnamon, leading into a heart of creamy Australian sandalwood and smooth cedar. The dry-down reveals a rich, resinous amber that clings to skin for hours — sophisticated, bold, and deeply comforting.',
    olfactiveNotes: {
      top: 'Cardamom, Cinnamon, Black Pepper',
      heart: 'Australian Sandalwood, Cedarwood, Vetiver',
      base: 'Golden Amber, Musk, Leather'
    },
    longevity: '10-12 Hours',
    projection: 'Strong & Warm',
    occasion: 'Formal Events, Evenings & Winter Season',
    howToUse: 'Spray 2-3 times on pulse points — wrists, neck, and chest. For enhanced longevity, apply a fragrance-free moisturizer beforehand. Spray from a distance of 6 inches.'
  },
  {
    id: 'vespera-oud',
    name: 'VESPERA Oud',
    type: 'Eau de Parfum',
    size: '50ml',
    mrp: 2499,
    price: 1199,
    image: '/assets/product_oud_new.jpg',
    certImage: '/assets/product_oud_infographic.jpg',
    notes: 'Oud · Amber · Incense',
    category: 'women',
    description: 'A commanding, smoky oud signature rich with precious agarwood, golden amber resin, and sacred incense.',
    longDescription: 'VESPERA Oud is an intense, deeply evocative journey into the heart of Middle Eastern luxury. It opens with a burst of saffron and smoky incense, building to a powerful core of aged agarwood (oud) and warm amber resin. The base is a lingering trail of sandalwood and musk — powerful, mysterious, and unforgettable.',
    olfactiveNotes: {
      top: 'Saffron, Incense, Black Pepper',
      heart: 'Cambodian Oud, Golden Amber, Frankincense',
      base: 'Sandalwood, Dark Musk, Leather'
    },
    longevity: '12+ Hours',
    projection: 'Heavy & Room-Filling',
    occasion: 'Special Occasions, Weddings & Evening Events',
    howToUse: 'A potent formulation — 1-2 sprays maximum on the neck or wrists. Let it settle naturally to appreciate the deep, evolving transitions from opening to dry-down.'
  },
  {
    id: 'vespera-pure',
    name: 'VESPERA Pure',
    type: 'Eau de Parfum',
    size: '50ml',
    mrp: 2499,
    price: 1199,
    image: '/assets/product_pure.jpg',
    certImage: '/assets/product_pure_infographic.jpg',
    notes: 'White Musk · Vetiver · Bamboo',
    category: 'men',
    description: 'A clean, luminous, skin-close fragrance that captures the quiet elegance of pure white musk and soft vetiver.',
    longDescription: 'VESPERA Pure is minimalism elevated to luxury. Inspired by the stillness of a sunlit morning, it opens with a sheer breeze of bamboo and green leaves, blooming into a heart of soft white florals. The base is a weightless cushion of clean musk and earthy vetiver — effortlessly pure, endlessly wearable.',
    olfactiveNotes: {
      top: 'Bamboo, Green Tea, Bergamot',
      heart: 'White Rose, Lily of the Valley, Jasmine',
      base: 'White Musk, Vetiver, Warm Sandalwood'
    },
    longevity: '8-10 Hours',
    projection: 'Soft & Intimate',
    occasion: 'Daily Wear, Office & All-Season Signature',
    howToUse: 'Spray 2-3 times on pulse points — wrists, neck, and behind ears. A versatile everyday scent that pairs beautifully with light moisturiser for a radiant skin-scent effect.'
  },
  {
    id: 'vespera-dark',
    name: 'VESPERA Dark',
    type: 'Eau de Parfum',
    size: '50ml',
    mrp: 2499,
    price: 1199,
    image: '/assets/product_dark.jpg',
    certImage: '/assets/product_dark_infographic.jpg',
    notes: 'Dark Cocoa · Leather · Spices',
    category: 'men',
    description: 'An intense, mysterious fragrance featuring dark cocoa, smoked leather, and warm spices.',
    longDescription: 'VESPERA Dark is a seductive blend for the night. It starts with a bold hit of dark cocoa and cardamom, moving into a heart of smoked leather. The base settles into a rich blend of vanilla and patchouli, creating an unforgettable aura.',
    olfactiveNotes: {
      top: 'Dark Cocoa, Cardamom, Black Pepper',
      heart: 'Smoked Leather, Tobacco Leaf, Clove',
      base: 'Madagascar Vanilla, Patchouli, Amber'
    },
    longevity: '10-12 Hours',
    projection: 'Strong & Lasting',
    occasion: 'Evenings, Night Out & Date Nights',
    howToUse: 'Spray 1-2 times on pulse points. The fragrance is highly concentrated and will evolve beautifully throughout the night.'
  }
];

export const AppProvider = ({ children }) => {
  const [products, setProducts] = useState(() => {
    return PRODUCTS.map((p) => ({
      ...p,
      stock: 15,
      images: Array.isArray(p.images) ? p.images : [p.image],
    }));
  });

  const [banners, setBanners] = useState([]);
  const [categories, setCategories] = useState([]);
  const [homepageSettings, setHomepageSettings] = useState({
    announcementText: 'VESPERA INTERACTIVE DEMO EXPERIENCE — SIMULATED PAYMENTS & MOCK CHECKOUT',
    whatsappNumber: '9187584729',
    highlightsTitle: 'Why Choose VESPERA?',
    highlight1Title: 'Long Lasting',
    highlight1Desc: 'Expertly formulated to linger beautifully on skin for up to 12 hours, evolving gracefully through the day.',
    highlight2Title: 'Premium Ingredients',
    highlight2Desc: 'Blended from the finest natural reserves — pure essential oils, rare resins, and hand-selected botanicals.',
    highlight3Title: 'Made in India',
    highlight3Desc: "Proudly crafted in small batches locally, celebrating India's rich olfactory heritage and world-class standards.",
    storyTitle: 'Our Story',
    storyOneHeading: 'Crafted to Leave a Lasting Impression.',
    storyOneBody: 'VESPERA was born from a simple conviction — that luxury fragrance should be within reach, without ever sacrificing craft, quality, or design. Every bottle is developed with intention, using premium ingredients and housed in packaging that honours the art of presentation.',
    storyOneImage: '/assets/story_one.png',
    storyTwoHeading: 'Rooted in Tradition. Refined for Today.',
    storyTwoBody: "Our creations draw inspiration from timeless traditions and the world's most exquisite natural ingredients. From carefully sourced botanicals to our meticulous blending process, every detail reflects our commitment to authenticity.",
    storyTwoImage: '/assets/story_two.png',
    footerAbout: 'VESPERA Parfums is a Maison de Haute Parfumerie dedicated to crafting premium signature fragrances with enduring performance and classic elegance.',
    footerCopyright: '© 2026 VESPERA. All Rights Reserved.'
  });

  const [packageMode, setPackageMode] = useState(() => {
    return localStorage.getItem('vespera_package_mode') || 'full_ecom';
  });

  const updatePackageMode = async (mode) => {
    setPackageMode(mode);
    localStorage.setItem('vespera_package_mode', mode);
    try {
      await fetch('/api/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ packageMode: mode })
      });
      return true;
    } catch (err) {
      console.error('Failed to update package mode setting:', err);
      return false;
    }
  };

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const prodRes = await fetch('/api/products');
        if (prodRes.ok) {
          const prodData = await prodRes.json();
          if (Array.isArray(prodData) && prodData.length > 0) {
            setProducts(prodData.map(p => ({
              ...p,
              stock: typeof p.stock === 'number' ? p.stock : 15,
              images: Array.isArray(p.images) && p.images.length > 0 
                ? p.images 
                : (p.image ? [p.image] : ['/assets/discovery_set.png']),
              image: (Array.isArray(p.images) && p.images.length > 0 ? p.images[0] : p.image) || '/assets/discovery_set.png'
            })));
          }
        }

        const bannerRes = await fetch('/api/banners');
        if (bannerRes.ok) {
          const bannerData = await bannerRes.json();
          setBanners(bannerData);
        }

        const catRes = await fetch('/api/categories');
        if (catRes.ok) {
          const catData = await catRes.json();
          setCategories(catData);
        }

        const homeRes = await fetch('/api/homepage');
        if (homeRes.ok) {
          const homeData = await homeRes.json();
          setHomepageSettings(homeData);
        }

        const settingsRes = await fetch('/api/settings');
        if (settingsRes.ok) {
          const settingsData = await settingsRes.json();
          if (settingsData.packageMode) {
            setPackageMode(settingsData.packageMode);
            localStorage.setItem('vespera_package_mode', settingsData.packageMode);
          }
        }

        const coupRes = await fetch('/api/coupons');
        if (coupRes.ok) {
          const coupData = await coupRes.json();
          if (Array.isArray(coupData) && coupData.length > 0) {
            setCoupons(coupData);
            localStorage.setItem('vespera_coupons', JSON.stringify(coupData));
          }
        }

        const ordersRes = await fetch('/api/orders');
        if (ordersRes.ok) {
          const ordersData = await ordersRes.json();
          if (Array.isArray(ordersData)) {
            setOrders(ordersData);
          }
        }
      } catch (err) {
        console.error('Failed to load initial data from API:', err);
      }
    };
    fetchInitialData();
  }, []);

  const [orders, setOrders] = useState([]);

  const [cart, setCart] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isFinderOpen, setIsFinderOpen] = useState(false);
  const [isServicesOpen, setIsServicesOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState('ALL');
  const [searchTerm, setSearchTerm] = useState('');
  const [quickViewProduct, setQuickViewProduct] = useState(null);
  const [activeLegalModal, setActiveLegalModal] = useState('none');
  const [isAdminMode, setIsAdminMode] = useState(() => {
    const secret = 'vespera-control-x9k2p-admin';
    const path = window.location.pathname;
    const search = window.location.search;
    const hash = window.location.hash;
    return (
      path === `/${secret}` || 
      path.endsWith(`/${secret}`) || 
      search.includes(secret) || 
      hash.includes(secret)
    );
  });
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(() => {
    return sessionStorage.getItem('vespera_admin_logged_in') === 'true';
  });

  // Sync products with state changes to update quickViewProduct if it's currently open
  useEffect(() => {
    if (quickViewProduct) {
      const updated = products.find(p => p.id === quickViewProduct.id);
      if (updated) {
        setQuickViewProduct(updated);
      }
    }
  }, [products, quickViewProduct]);

  // Load cart from localStorage on init
  useEffect(() => {
    const savedCart = localStorage.getItem('vespera_cart');
    if (savedCart) {
      try {
        setCart(JSON.parse(savedCart));
      } catch (e) {
        console.error('Error loading cart', e);
      }
    }
  }, []);

  // Save cart to localStorage
  useEffect(() => {
    localStorage.setItem('vespera_cart', JSON.stringify(cart));
  }, [cart]);

  const addToCart = (product, quantity = 1, selectedFragrances = null) => {
    // Check stock if product exists in products list
    const originalProduct = products.find(p => p.id === product.id);
    if (originalProduct && originalProduct.stock <= 0) {
      alert(`${product.name} is currently out of stock.`);
      return;
    }

    setCart((prevCart) => {
      // Unique key for custom bundles
      const cartItemId = selectedFragrances
        ? `${product.id}-${selectedFragrances.map((f) => f.id).join('-')}`
        : product.id;

      const existingIndex = prevCart.findIndex((item) => item.cartItemId === cartItemId);

      if (existingIndex > -1) {
        const updated = [...prevCart];
        // Ensure quantity doesn't exceed stock
        const newQty = updated[existingIndex].quantity + quantity;
        if (originalProduct && newQty > originalProduct.stock) {
          alert(`You cannot add more items than the available stock (${originalProduct.stock} left).`);
          updated[existingIndex].quantity = originalProduct.stock;
          return updated;
        }
        updated[existingIndex].quantity = newQty;
        return updated;
      } else {
        // Ensure initial quantity doesn't exceed stock
        let qtyToAdd = quantity;
        if (originalProduct && qtyToAdd > originalProduct.stock) {
          qtyToAdd = originalProduct.stock;
          alert(`Quantity adjusted to available stock (${originalProduct.stock} left).`);
        }
        return [
          ...prevCart,
          {
            ...product,
            cartItemId,
            quantity: qtyToAdd,
            selectedFragrances, // For combo items
          },
        ];
      }
    });
    setIsCartOpen(true);
  };

  const removeFromCart = (cartItemId) => {
    setCart((prevCart) => prevCart.filter((item) => item.cartItemId !== cartItemId));
  };

  const updateQuantity = (cartItemId, newQty) => {
    if (newQty < 1) {
      removeFromCart(cartItemId);
      return;
    }

    // Check stock if relevant
    const cartItem = cart.find(item => item.cartItemId === cartItemId);
    if (cartItem) {
      const originalProduct = products.find(p => p.id === cartItem.id);
      if (originalProduct && newQty > originalProduct.stock) {
        alert(`Only ${originalProduct.stock} items left in stock.`);
        return;
      }
    }

    setCart((prevCart) =>
      prevCart.map((item) => (item.cartItemId === cartItemId ? { ...item, quantity: newQty } : item))
    );
  };

  const clearCart = () => {
    setCart([]);
  };

  // Product management helpers
  const addProduct = async (product) => {
    const images = Array.isArray(product.images) && product.images.length > 0 
      ? product.images 
      : [product.image || '/assets/discovery_set.png'];
    const newProduct = {
      ...product,
      id: product.id || `product-${Date.now()}`,
      stock: typeof product.stock === 'number' ? product.stock : 15,
      images,
      image: images[0],
    };
    
    setProducts((prev) => [...prev, newProduct]);

    try {
      const res = await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newProduct)
      });
      return res.ok;
    } catch (err) {
      console.error('Failed to save added product to backend:', err);
      return false;
    }
  };

  const updateProduct = async (id, updatedFields) => {
    let toSend = { ...updatedFields };
    if (Array.isArray(toSend.images) && toSend.images.length > 0) {
      toSend.image = toSend.images[0];
    } else if (toSend.image && (!toSend.images || toSend.images.length === 0)) {
      toSend.images = [toSend.image];
    }

    setProducts((prev) =>
      prev.map((p) => {
        if (p.id === id) {
          const merged = { ...p, ...toSend };
          if (Array.isArray(merged.images) && merged.images.length > 0) {
            merged.image = merged.images[0];
          }
          return merged;
        }
        return p;
      })
    );

    try {
      const res = await fetch(`/api/products/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(toSend)
      });
      return res.ok;
    } catch (err) {
      console.error('Failed to sync updated product to backend:', err);
      return false;
    }
  };

  const deleteProduct = async (id) => {
    setProducts((prev) => prev.filter((p) => p.id !== id));

    try {
      const res = await fetch(`/api/products/${id}`, {
        method: 'DELETE'
      });
      return res.ok;
    } catch (err) {
      console.error('Failed to delete product from backend:', err);
      return false;
    }
  };

  const resetProducts = async () => {
    try {
      const response = await fetch('/api/products/reset', {
        method: 'POST'
      });
      const data = await response.json();
      if (data.products) {
        setProducts(data.products.map(p => ({
          ...p,
          stock: typeof p.stock === 'number' ? p.stock : 15,
          images: Array.isArray(p.images) && p.images.length > 0 ? p.images : [p.image || '/assets/discovery_set.png'],
          image: (Array.isArray(p.images) && p.images.length > 0 ? p.images[0] : p.image) || '/assets/discovery_set.png'
        })));
      }
      if (data.banners) {
        setBanners(data.banners);
      }
      if (data.categories) {
        setCategories(data.categories);
      }
      if (data.homepage) {
        setHomepageSettings(data.homepage);
      }
      if (data.coupons) {
        setCoupons(data.coupons);
        localStorage.setItem('vespera_coupons', JSON.stringify(data.coupons));
      }
      if (data.settings?.packageMode) {
        setPackageMode(data.settings.packageMode);
        localStorage.setItem('vespera_package_mode', data.settings.packageMode);
      }
      setAppliedCoupon(null);

      return true;
    } catch (err) {
      console.error('Failed to reset data on backend:', err);
      return false;
    }
  };

  const updateHomepageSettings = async (settings) => {
    try {
      const res = await fetch('/api/homepage', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings)
      });
      const data = await res.json();
      if (data.homepage) {
        setHomepageSettings(data.homepage);
      }
      return true;
    } catch (e) {
      console.error('Failed to update homepage settings:', e);
      return false;
    }
  };

  const addBanner = async (banner) => {
    try {
      const res = await fetch('/api/banners', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(banner)
      });
      const data = await res.json();
      if (data.banner) {
        setBanners(prev => {
          const exists = prev.findIndex(b => b.id === data.banner.id);
          if (exists !== -1) {
            const updated = [...prev];
            updated[exists] = data.banner;
            return updated;
          }
          return [...prev, data.banner];
        });
      }
      return true;
    } catch (e) {
      console.error(e);
      return false;
    }
  };

  const updateBanner = async (id, updatedFields) => {
    try {
      const res = await fetch(`/api/banners/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedFields)
      });
      const data = await res.json();
      if (data.banner) {
        setBanners(prev => prev.map(b => b.id === id ? data.banner : b));
      }
      return true;
    } catch (e) {
      console.error(e);
      return false;
    }
  };

  const deleteBanner = async (id) => {
    try {
      await fetch(`/api/banners/${id}`, { method: 'DELETE' });
      setBanners(prev => prev.filter(b => b.id !== id));
      return true;
    } catch (e) {
      console.error(e);
      return false;
    }
  };

  const addCategory = async (category) => {
    try {
      const res = await fetch('/api/categories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(category)
      });
      const data = await res.json();
      if (data.category) {
        setCategories(prev => {
          const exists = prev.findIndex(c => c.id === data.category.id);
          if (exists !== -1) {
            const updated = [...prev];
            updated[exists] = data.category;
            return updated;
          }
          return [...prev, data.category];
        });
      }
      return true;
    } catch (e) {
      console.error(e);
      return false;
    }
  };

  const updateCategory = async (id, updatedFields) => {
    try {
      const res = await fetch(`/api/categories/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedFields)
      });
      const data = await res.json();
      if (data.category) {
        setCategories(prev => prev.map(c => c.id === id ? data.category : c));
      }
      return true;
    } catch (e) {
      console.error(e);
      return false;
    }
  };

  const deleteCategory = async (id) => {
    try {
      await fetch(`/api/categories/${id}`, { method: 'DELETE' });
      setCategories(prev => prev.filter(c => c.id !== id));
      return true;
    } catch (e) {
      console.error(e);
      return false;
    }
  };

  const adminLogin = (password) => {
    sessionStorage.setItem('vespera_admin_logged_in', 'true');
    setIsAdminAuthenticated(true);
    setIsAdminMode(true);
    return true;
  };

  const adminLogout = () => {
    sessionStorage.removeItem('vespera_admin_logged_in');
    setIsAdminAuthenticated(false);
    setIsAdminMode(false);
  };

  // --- Coupon System States & Functions ---
  const [coupons, setCoupons] = useState(() => {
    const saved = localStorage.getItem('vespera_coupons');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Error loading coupons', e);
      }
    }
    return [
      {
        code: 'WELCOME10',
        type: 'percentage',
        value: 10,
        minSubtotal: 500,
        isActive: true,
      },
      {
        code: 'VESPERAFREE200',
        type: 'fixed',
        value: 200,
        minSubtotal: 1000,
        isActive: true,
      }
    ];
  });

  const [appliedCoupon, setAppliedCoupon] = useState(null);

  // Save coupons to localStorage
  useEffect(() => {
    localStorage.setItem('vespera_coupons', JSON.stringify(coupons));
  }, [coupons]);

  // Automatically reset applied coupon if it becomes invalid (e.g. cart subtotal drops below minimum)
  const currentSubtotal = cart.reduce((total, item) => total + item.price * item.quantity, 0);
  useEffect(() => {
    if (appliedCoupon) {
      const activeVersion = coupons.find((c) => c.code === appliedCoupon.code);
      if (!activeVersion || !activeVersion.isActive || currentSubtotal < activeVersion.minSubtotal) {
        setAppliedCoupon(null);
      }
    }
  }, [cart, coupons, appliedCoupon, currentSubtotal]);

  const addCoupon = async (coupon) => {
    const codeUpper = coupon.code.toUpperCase().trim();
    if (!codeUpper) return { success: false, error: 'Coupon code cannot be empty.' };
    
    let isDuplicate = false;
    const newCouponItem = {
      code: codeUpper,
      type: coupon.type,
      value: Number(coupon.value),
      minSubtotal: Number(coupon.minSubtotal || 0),
      isActive: typeof coupon.isActive === 'boolean' ? coupon.isActive : true,
    };

    setCoupons((prev) => {
      if (prev.some((c) => c.code === codeUpper)) {
        isDuplicate = true;
        return prev;
      }
      return [...prev, newCouponItem];
    });

    if (isDuplicate) {
      return { success: false, error: `Coupon code "${codeUpper}" already exists.` };
    }

    try {
      await fetch('/api/coupons', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newCouponItem)
      });
    } catch (e) {
      console.error('Failed to persist coupon to backend:', e);
    }
    return { success: true };
  };

  const deleteCoupon = async (code) => {
    const codeUpper = code.toUpperCase().trim();
    setCoupons((prev) => prev.filter((c) => c.code !== codeUpper));
    if (appliedCoupon && appliedCoupon.code === codeUpper) {
      setAppliedCoupon(null);
    }
    try {
      await fetch(`/api/coupons/${codeUpper}`, { method: 'DELETE' });
    } catch (e) {
      console.error('Failed to delete coupon on server:', e);
    }
  };

  const toggleCouponActive = async (code) => {
    const codeUpper = code.toUpperCase().trim();
    let nextStatus = false;
    setCoupons((prev) =>
      prev.map((c) => {
        if (c.code === codeUpper) {
          nextStatus = !c.isActive;
          return { ...c, isActive: nextStatus };
        }
        return c;
      })
    );
    try {
      await fetch(`/api/coupons/${codeUpper}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isActive: nextStatus })
      });
    } catch (e) {
      console.error('Failed to toggle coupon on server:', e);
    }
  };
  // ----------------------------------------

  // --- Order System Actions ---
  const updateOrderStatus = async (orderId, newStatus) => {
    setOrders((prev) =>
      prev.map((o) => (o.id === orderId || o.order_reference === orderId ? { ...o, status: newStatus } : o))
    );
    try {
      const res = await fetch(`/api/orders/${orderId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });
      return res.ok;
    } catch (e) {
      console.error('Failed to update order status:', e);
      return false;
    }
  };

  const deleteOrder = async (orderId) => {
    setOrders((prev) => prev.filter((o) => o.id !== orderId && o.order_reference !== orderId));
    try {
      const res = await fetch(`/api/orders/${orderId}`, { method: 'DELETE' });
      return res.ok;
    } catch (e) {
      console.error('Failed to delete order:', e);
      return false;
    }
  };

  const recordOrder = async (orderData) => {
    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderData)
      });
      if (res.ok) {
        const data = await res.json();
        if (data.order) {
          setOrders(prev => [data.order, ...prev.filter(o => o.id !== data.order.id)]);
        }
      }
      return true;
    } catch (e) {
      console.error('Failed to record order:', e);
      return false;
    }
  };
  // ----------------------------------------

  // Get total price
  const cartSubtotal = cart.reduce((total, item) => total + item.price * item.quantity, 0);
  const cartMRPTotal = cart.reduce((total, item) => total + (item.mrp || item.price) * item.quantity, 0);
  const cartSavings = cartMRPTotal - cartSubtotal;
  const cartItemCount = cart.reduce((count, item) => count + item.quantity, 0);

  return (
    <AppContext.Provider
      value={{
        products,
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        cartSubtotal,
        cartMRPTotal,
        cartSavings,
        cartItemCount,
        isCartOpen,
        setIsCartOpen,
        isCheckoutOpen,
        setIsCheckoutOpen,
        isSearchOpen,
        setIsSearchOpen,
        isFinderOpen,
        setIsFinderOpen,
        isServicesOpen,
        setIsServicesOpen,
        activeCategory,
        setActiveCategory,
        searchTerm,
        setSearchTerm,
        quickViewProduct,
        setQuickViewProduct,
        activeLegalModal,
        setActiveLegalModal,
        isAdminMode,
        setIsAdminMode,
        isAdminAuthenticated,
        setIsAdminAuthenticated,
        addProduct,
        updateProduct,
        deleteProduct,
        resetProducts,
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
        adminLogin,
        adminLogout,
        coupons,
        appliedCoupon,
        setAppliedCoupon,
        addCoupon,
        deleteCoupon,
        toggleCouponActive,
        orders,
        updateOrderStatus,
        deleteOrder,
        recordOrder,
        packageMode,
        updatePackageMode,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};
