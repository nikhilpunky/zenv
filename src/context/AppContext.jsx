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
    notes: 'Rose, Sandalwood, Citrus, Oud, Amber',
    category: 'unisex',
    isDiscovery: true,
    description: 'A curated collection of five signature fragrances (8ml each) designed to help you experience ZENV and discover your perfect signature scent.',
    longDescription: 'Our Discovery Collection is the perfect introduction to the world of ZENV. It contains five premium travel-sized spray vials (8ml each), allowing you to wear and test each fragrance on your skin before choosing a full 50ml bottle. Packaged in a luxury matte black presentation box.',
    olfactiveNotes: {
      top: 'Various (Floral, Woody, Citrus, Smoky)',
      heart: 'Various (Jasmine, Iris, Patchouli, Amber)',
      base: 'Various (Musk, Sandalwood, Leather, Cedar)'
    }
  },
  {
    id: 'rose-blanche',
    name: 'Rose Blanche',
    type: 'Eau de Parfum',
    size: '50ml',
    mrp: 2499,
    price: 1199,
    image: '/assets/product_rose.png',
    notes: 'Rose · Peony · Musk',
    category: 'women',
    description: 'A delicate, sophisticated floral signature that captures the timeless essence of fresh white rose petals.',
    longDescription: 'Rose Blanche is a tribute to modern romance. It opens with the crisp brightness of dew-kissed white roses and soft peony, melting into a warm, sensual base of clean white musk. A fragrance that is light, clean, and beautifully long-lasting.',
    olfactiveNotes: {
      top: 'White Rose, Lychee, Bergamot',
      heart: 'Pink Peony, Lily of the Valley, Magnolia',
      base: 'White Musk, Warm Amber, Cedarwood'
    }
  },
  {
    id: 'santal-dor',
    name: 'Santal D\'Or',
    type: 'Eau de Parfum',
    size: '50ml',
    mrp: 2499,
    price: 1199,
    image: '/assets/product_santal.png',
    notes: 'Sandalwood · Amber · Vanilla',
    category: 'unisex',
    description: 'A warm, rich, woody fragrance that envelops you in creamy sandalwood, golden amber, and soft vanilla.',
    longDescription: 'Santal D\'Or is a luxurious, comforting blend. Creamy Australian sandalwood and smooth cedarwood form a woody spine, layered with vanilla beans and golden resinous amber. A projection that is commanding yet refined.',
    olfactiveNotes: {
      top: 'Cardamom, Cinnamon, Coriander',
      heart: 'Australian Sandalwood, Cedarwood, Papyrus',
      base: 'Golden Amber, Bourbon Vanilla, Leather'
    }
  },
  {
    id: 'citrus-noir',
    name: 'Citrus Noir',
    type: 'Eau de Parfum',
    size: '50ml',
    mrp: 2499,
    price: 1199,
    image: '/assets/product_citrus.png',
    notes: 'Bergamot · Iris · Vetiver',
    category: 'men',
    description: 'A bright, sparkling opening of Italian bergamot balanced by elegant iris and earthy vetiver.',
    longDescription: 'Citrus Noir starts with a burst of cold-pressed Italian bergamot and sharp grapefruit. It transitions into a powdery, elegant heart of French iris, landing on an earthy, masculine base of Haitian vetiver and warm oakmoss.',
    olfactiveNotes: {
      top: 'Italian Bergamot, Grapefruit, Black Pepper',
      heart: 'Florentine Iris, Sage, Vetiver root',
      base: 'Haitian Vetiver, Oakmoss, Amberwood'
    }
  },
  {
    id: 'oud-imperial',
    name: 'Oud Impérial',
    type: 'Eau de Parfum',
    size: '50ml',
    mrp: 2499,
    price: 1199,
    image: '/assets/product_oud.png',
    notes: 'Oud · Patchouli · Leather',
    category: 'unisex',
    description: 'A deep, smoky, mysterious blend of premium agarwood, patchouli, and rich hand-cut leather.',
    longDescription: 'Oud Impérial is an intense, bold statement. It blends high-grade, smoky agarwood (Oud) with spicy patchouli leaf and dark, luxurious leather. Designed for those who want their presence to linger long after they leave a room.',
    olfactiveNotes: {
      top: 'Saffron, Incense, Rum',
      heart: 'Cambodian Oud, Patchouli Leaf, Rosewood',
      base: 'Russian Leather, Tobacco, Sandalwood'
    }
  },
  {
    id: 'ambre-soleil',
    name: 'Ambre Soleil',
    type: 'Eau de Parfum',
    size: '50ml',
    mrp: 2499,
    price: 1199,
    image: '/assets/product_ambre.png',
    notes: 'Jasmine · White Musk · Cedar',
    category: 'unisex',
    description: 'An elegant, bright fragrance inspired by warm sun rays, combining jasmine blossoms, soft musk, and cedar.',
    longDescription: 'Ambre Soleil evokes the warmth of a Mediterranean summer afternoon. A luminous opening of solar jasmine and sweet citrus merges into a sophisticated heart of Virginia cedarwood, dried down on a soft cushion of clean white musk.',
    olfactiveNotes: {
      top: 'Solar Jasmine, Mandarin, Neroli',
      heart: 'Virginia Cedarwood, Patchouli, Cashmere wood',
      base: 'White Musk, Benzoin, Warm Vanilla'
    }
  }
];

export const AppProvider = ({ children }) => {
  const [cart, setCart] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isFinderOpen, setIsFinderOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState('ALL');
  const [searchTerm, setSearchTerm] = useState('');
  const [quickViewProduct, setQuickViewProduct] = useState(null);
  const [activeLegalModal, setActiveLegalModal] = useState('none');

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

  const addToCart = (product, quantity = 1, selectedFragrances = null) => {
    setCart((prevCart) => {
      // Unique key for custom bundles
      const cartItemId = selectedFragrances
        ? `${product.id}-${selectedFragrances.map((f) => f.id).join('-')}`
        : product.id;

      const existingIndex = prevCart.findIndex((item) => item.cartItemId === cartItemId);

      if (existingIndex > -1) {
        const updated = [...prevCart];
        updated[existingIndex].quantity += quantity;
        return updated;
      } else {
        return [
          ...prevCart,
          {
            ...product,
            cartItemId,
            quantity,
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
    setCart((prevCart) =>
      prevCart.map((item) => (item.cartItemId === cartItemId ? { ...item, quantity: newQty } : item))
    );
  };

  const clearCart = () => {
    setCart([]);
  };

  // Get total price
  const cartSubtotal = cart.reduce((total, item) => total + item.price * item.quantity, 0);
  const cartMRPTotal = cart.reduce((total, item) => total + (item.mrp || item.price) * item.quantity, 0);
  const cartSavings = cartMRPTotal - cartSubtotal;
  const cartItemCount = cart.reduce((count, item) => count + item.quantity, 0);

  return (
    <AppContext.Provider
      value={{
        products: PRODUCTS,
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
      }}
    >
      {children}
    </AppContext.Provider>
  );
};
