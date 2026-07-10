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
    description: 'A curated collection of five signature fragrances (8ml each) designed to help you experience ZENV and discover your perfect signature scent.',
    longDescription: 'Our Discovery Collection is the perfect introduction to the world of ZENV. It contains five premium travel-sized spray vials (8ml each), allowing you to wear and test each fragrance on your skin before choosing a full 50ml bottle. Packaged in a luxury matte black presentation box.',
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
    id: 'zenv-blue',
    name: 'ZENV Blue',
    type: 'Eau de Parfum',
    size: '50ml',
    mrp: 2499,
    price: 1199,
    image: '/assets/product_blue.jpg',
    certImage: '/assets/product_blue_infographic.jpg',
    notes: 'Aqua · Lime · Jasmine',
    category: 'unisex',
    description: 'A vibrant, fresh aquatic signature bursting with crisp lime, cool aqua notes, and delicate jasmine blossoms.',
    longDescription: 'ZENV Blue is a bold, invigorating journey into freshness. It opens with a sparkling burst of zesty lime and crisp aquatic accords, transitioning into a heart of fresh jasmine and clean white florals. The base settles into cool musk and cedarwood — energetic, clean, and undeniably modern.',
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
    id: 'zenv-wood',
    name: 'ZENV Wood',
    type: 'Eau de Parfum',
    size: '50ml',
    mrp: 2499,
    price: 1199,
    image: '/assets/product_wood.jpg',
    certImage: '/assets/product_wood_infographic.jpg',
    notes: 'Sandalwood · Amber · Cedar',
    category: 'women',
    description: 'A deep, warm woody signature crafted from rich sandalwood, golden amber, and smooth cedarwood for an enduring presence.',
    longDescription: 'ZENV Wood is an ode to the warmth of ancient forests. It opens with a spiced, golden accord of cardamom and cinnamon, leading into a heart of creamy Australian sandalwood and smooth cedar. The dry-down reveals a rich, resinous amber that clings to skin for hours — sophisticated, bold, and deeply comforting.',
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
    id: 'zenv-oud',
    name: 'ZENV OUD',
    type: 'Eau de Parfum',
    size: '50ml',
    mrp: 2499,
    price: 1199,
    image: '/assets/product_oud_new.jpg',
    certImage: '/assets/product_oud_infographic.jpg',
    notes: 'Oud · Amber · Incense',
    category: 'women',
    description: 'A commanding, smoky oud signature rich with precious agarwood, golden amber resin, and sacred incense.',
    longDescription: 'ZENV OUD is an intense, deeply evocative journey into the heart of Middle Eastern luxury. It opens with a burst of saffron and smoky incense, building to a powerful core of aged agarwood (oud) and warm amber resin. The base is a lingering trail of sandalwood and musk — powerful, mysterious, and unforgettable.',
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
    id: 'zenv-pure',
    name: 'ZENV Pure',
    type: 'Eau de Parfum',
    size: '50ml',
    mrp: 2499,
    price: 1199,
    image: '/assets/product_pure.jpg',
    certImage: '/assets/product_pure_infographic.jpg',
    notes: 'White Musk · Vetiver · Bamboo',
    category: 'men',
    description: 'A clean, luminous, skin-close fragrance that captures the quiet elegance of pure white musk and soft vetiver.',
    longDescription: 'ZENV Pure is minimalism elevated to luxury. Inspired by the stillness of a sunlit morning, it opens with a sheer breeze of bamboo and green leaves, blooming into a heart of soft white florals. The base is a weightless cushion of clean musk and earthy vetiver — effortlessly pure, endlessly wearable.',
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
    id: 'zenv-dark',
    name: 'ZENV Dark',
    type: 'Eau de Parfum',
    size: '50ml',
    mrp: 2499,
    price: 1199,
    image: '/assets/product_dark.jpg',
    certImage: '/assets/product_dark_infographic.jpg',
    notes: 'Dark Cocoa · Leather · Spices',
    category: 'men',
    description: 'An intense, mysterious fragrance featuring dark cocoa, smoked leather, and warm spices.',
    longDescription: 'ZENV Dark is a seductive blend for the night. It starts with a bold hit of dark cocoa and cardamom, moving into a heart of smoked leather. The base settles into a rich blend of vanilla and patchouli, creating an unforgettable aura.',
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
    const saved = localStorage.getItem('zenv_products');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          // Filter out any products that are no longer in the default PRODUCTS list (e.g. deleted products)
          const defaultIds = new Set(PRODUCTS.map((p) => p.id));
          const filteredParsed = parsed.filter((p) => defaultIds.has(p.id));

          // Sync any new default products that are not present in the user's local storage list
          const parsedIds = new Set(filteredParsed.map((p) => p.id));
          const missingDefaults = PRODUCTS.filter((p) => !parsedIds.has(p.id)).map((p) => ({
            ...p,
            stock: 15,
            images: [p.image],
          }));
          return [
            ...filteredParsed.map((p) => ({
              ...p,
              stock: typeof p.stock === 'number' ? p.stock : 15,
              images: Array.isArray(p.images) ? p.images : [p.image || '/assets/discovery_set.png'],
            })),
            ...missingDefaults
          ];
        }
      } catch (e) {
        console.error('Error loading products', e);
      }
    }
    return PRODUCTS.map((p) => ({
      ...p,
      stock: 15,
      images: [p.image],
    }));
  });

  const [cart, setCart] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isFinderOpen, setIsFinderOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState('ALL');
  const [searchTerm, setSearchTerm] = useState('');
  const [quickViewProduct, setQuickViewProduct] = useState(null);
  const [activeLegalModal, setActiveLegalModal] = useState('none');
  const [isAdminMode, setIsAdminMode] = useState(() => {
    const secret = 'zenv-secure-portal-auth-gateway-admin-dashboard-2026';
    const path = window.location.pathname;
    const search = window.location.search;
    const hash = window.location.hash;
    return (
      path === `/${secret}` || 
      path.includes(secret) || 
      search.includes(secret) || 
      hash.includes(secret)
    );
  });
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(() => {
    return sessionStorage.getItem('zenv_admin_logged_in') === 'true';
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
    const savedCart = localStorage.getItem('zenv_cart');
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
    localStorage.setItem('zenv_cart', JSON.stringify(cart));
  }, [cart]);

  // Save products to localStorage
  useEffect(() => {
    localStorage.setItem('zenv_products', JSON.stringify(products));
  }, [products]);

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
  const addProduct = (product) => {
    setProducts((prev) => {
      const newProduct = {
        ...product,
        id: product.id || `product-${Date.now()}`,
        stock: typeof product.stock === 'number' ? product.stock : 15,
        images: Array.isArray(product.images) && product.images.length > 0 
          ? product.images 
          : [product.image || '/assets/discovery_set.png'],
      };
      if (newProduct.images.length > 0) {
        newProduct.image = newProduct.images[0];
      }
      return [...prev, newProduct];
    });
  };

  const updateProduct = (id, updatedFields) => {
    setProducts((prev) =>
      prev.map((p) => {
        if (p.id === id) {
          const merged = { ...p, ...updatedFields };
          if (Array.isArray(merged.images) && merged.images.length > 0) {
            merged.image = merged.images[0];
          }
          return merged;
        }
        return p;
      })
    );
  };

  const deleteProduct = (id) => {
    setProducts((prev) => prev.filter((p) => p.id !== id));
  };

  const adminLogin = (password) => {
    if (password === 'zenvadmin') {
      sessionStorage.setItem('zenv_admin_logged_in', 'true');
      setIsAdminAuthenticated(true);
      setIsAdminMode(true);
      return true;
    }
    return false;
  };

  const adminLogout = () => {
    sessionStorage.removeItem('zenv_admin_logged_in');
    setIsAdminAuthenticated(false);
    setIsAdminMode(false);
  };

  // --- Coupon System States & Functions ---
  const [coupons, setCoupons] = useState(() => {
    const saved = localStorage.getItem('zenv_coupons');
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
        code: 'ZENVFREE200',
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
    localStorage.setItem('zenv_coupons', JSON.stringify(coupons));
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

  const addCoupon = (coupon) => {
    const codeUpper = coupon.code.toUpperCase().trim();
    if (!codeUpper) return { success: false, error: 'Coupon code cannot be empty.' };
    
    let isDuplicate = false;
    setCoupons((prev) => {
      if (prev.some((c) => c.code === codeUpper)) {
        isDuplicate = true;
        return prev;
      }
      return [
        ...prev,
        {
          code: codeUpper,
          type: coupon.type,
          value: Number(coupon.value),
          minSubtotal: Number(coupon.minSubtotal || 0),
          isActive: typeof coupon.isActive === 'boolean' ? coupon.isActive : true,
        },
      ];
    });

    if (isDuplicate) {
      return { success: false, error: `Coupon code "${codeUpper}" already exists.` };
    }
    return { success: true };
  };

  const deleteCoupon = (code) => {
    setCoupons((prev) => prev.filter((c) => c.code !== code));
    if (appliedCoupon && appliedCoupon.code === code) {
      setAppliedCoupon(null);
    }
  };

  const toggleCouponActive = (code) => {
    setCoupons((prev) =>
      prev.map((c) => (c.code === code ? { ...c, isActive: !c.isActive } : c))
    );
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
        adminLogin,
        adminLogout,
        coupons,
        appliedCoupon,
        setAppliedCoupon,
        addCoupon,
        deleteCoupon,
        toggleCouponActive,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};
