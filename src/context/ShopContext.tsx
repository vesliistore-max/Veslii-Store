import React, { createContext, useContext, useState, useEffect } from 'react';
import { Product, CartItem, Order } from '../types';
import { PRODUCTS } from '../data/products';

interface ShopContextType {
  products: Product[];
  cart: CartItem[];
  wishlist: string[]; // product IDs
  isCartOpen: boolean;
  isSearchOpen: boolean;
  isAccountOpen: boolean;
  activePolicy: string | null;
  quickViewProduct: Product | null;
  currentOrder: Order | null;
  notification: string | null;
  appliedCoupon: { code: string; discount: number; freeShipping: boolean } | null;
  openCart: () => void;
  closeCart: () => void;
  openSearch: () => void;
  closeSearch: () => void;
  openAccount: () => void;
  closeAccount: () => void;
  openPolicy: (policyKey: string) => void;
  closePolicy: () => void;
  setQuickView: (product: Product | null) => void;
  addToCart: (product: Product, variantId?: string, quantity?: number) => void;
  removeFromCart: (productId: string, variantId: string) => void;
  updateQuantity: (productId: string, variantId: string, quantity: number) => void;
  clearCart: () => void;
  toggleWishlist: (productId: string) => void;
  isInWishlist: (productId: string) => boolean;
  applyCoupon: (code: string) => Promise<{ success: boolean; message: string }>;
  removeCoupon: () => void;
  showNotification: (msg: string) => void;
  setCurrentOrder: (order: Order | null) => void;
  cartTotalCount: number;
  cartSubtotal: number;
  cartShippingFee: number;
  cartFinalTotal: number;
  refreshProducts: () => Promise<void>;
}

const ShopContext = createContext<ShopContextType | undefined>(undefined);

export const ShopProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [products, setProducts] = useState<Product[]>(PRODUCTS);
  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem('veslii_cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [wishlist, setWishlist] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('veslii_wishlist');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isAccountOpen, setIsAccountOpen] = useState(false);
  const [activePolicy, setActivePolicy] = useState<string | null>(null);
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);
  const [currentOrder, setCurrentOrder] = useState<Order | null>(null);
  const [notification, setNotification] = useState<string | null>(null);
  const [appliedCoupon, setAppliedCoupon] = useState<{
    code: string;
    discount: number;
    freeShipping: boolean;
  } | null>(() => {
    try {
      const saved = localStorage.getItem('veslii_coupon');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  // Sync cart to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('veslii_cart', JSON.stringify(cart));
    } catch (e) {
      console.error(e);
    }
  }, [cart]);

  // Sync wishlist to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('veslii_wishlist', JSON.stringify(wishlist));
    } catch (e) {
      console.error(e);
    }
  }, [wishlist]);

  // Sync coupon to localStorage
  useEffect(() => {
    try {
      if (appliedCoupon) {
        localStorage.setItem('veslii_coupon', JSON.stringify(appliedCoupon));
      } else {
        localStorage.removeItem('veslii_coupon');
      }
    } catch (e) {
      console.error(e);
    }
  }, [appliedCoupon]);

  const showNotification = (msg: string) => {
    setNotification(msg);
    setTimeout(() => {
      setNotification((curr) => (curr === msg ? null : curr));
    }, 3500);
  };

  const refreshProducts = async () => {
    try {
      const res = await fetch('/api/products');
      if (res.ok) {
        const data = await res.json();
        if (data.products && Array.isArray(data.products)) {
          setProducts(data.products);
        }
      }
    } catch (err) {
      console.warn('Using local catalog fallback', err);
    }
  };

  useEffect(() => {
    refreshProducts();
  }, []);

  const openCart = () => setIsCartOpen(true);
  const closeCart = () => setIsCartOpen(false);
  const openSearch = () => setIsSearchOpen(true);
  const closeSearch = () => setIsSearchOpen(false);
  const openAccount = () => setIsAccountOpen(true);
  const closeAccount = () => setIsAccountOpen(false);
  const openPolicy = (policyKey: string) => setActivePolicy(policyKey);
  const closePolicy = () => setActivePolicy(null);
  const setQuickView = (product: Product | null) => setQuickViewProduct(product);

  const addToCart = (product: Product, variantId?: string, quantity: number = 1) => {
    const variant = variantId
      ? product.variants.find((v) => v.id === variantId) || product.variants[0]
      : product.variants[0];

    if (!variant) return;

    if (product.stock <= 0) {
      showNotification(`${product.name} is currently out of stock.`);
      return;
    }

    setCart((prevCart) => {
      const existingIndex = prevCart.findIndex(
        (item) => item.productId === product.id && item.variantId === variant.id
      );

      if (existingIndex > -1) {
        const updated = [...prevCart];
        const existing = updated[existingIndex];
        const newQty = Math.min(product.stock, existing.quantity + quantity);
        updated[existingIndex] = { ...existing, quantity: newQty };
        return updated;
      } else {
        const newItem: CartItem = {
          productId: product.id,
          variantId: variant.id,
          name: product.name,
          category: product.category,
          variantName: variant.name,
          colorName: variant.colorName,
          price: product.price,
          originalPrice: product.originalPrice,
          quantity: Math.min(product.stock, quantity),
          image: variant.image || product.images[0],
          stock: product.stock,
        };
        return [...prevCart, newItem];
      }
    });

    showNotification(`Added ${product.name} to your shopping bag.`);
    setIsCartOpen(true);
  };

  const removeFromCart = (productId: string, variantId: string) => {
    setCart((prev) => prev.filter((item) => !(item.productId === productId && item.variantId === variantId)));
  };

  const updateQuantity = (productId: string, variantId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId, variantId);
      return;
    }
    setCart((prev) =>
      prev.map((item) => {
        if (item.productId === productId && item.variantId === variantId) {
          return { ...item, quantity: Math.min(item.stock, quantity) };
        }
        return item;
      })
    );
  };

  const clearCart = () => {
    setCart([]);
    setAppliedCoupon(null);
  };

  const toggleWishlist = (productId: string) => {
    setWishlist((prev) => {
      const exists = prev.includes(productId);
      if (exists) {
        showNotification('Removed item from your wishlist.');
        return prev.filter((id) => id !== productId);
      } else {
        showNotification('Saved to your wishlist.');
        return [...prev, productId];
      }
    });
  };

  const isInWishlist = (productId: string) => wishlist.includes(productId);

  const cartTotalCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const cartSubtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  // Free shipping above 4999 PKR, otherwise 250 PKR
  const baseShippingFee = cartSubtotal >= 4999 || cartSubtotal === 0 ? 0 : 250;
  const cartShippingFee = appliedCoupon?.freeShipping ? 0 : baseShippingFee;

  const discountAmount = appliedCoupon ? appliedCoupon.discount : 0;
  const cartFinalTotal = Math.max(0, cartSubtotal - discountAmount + cartShippingFee);

  const applyCoupon = async (code: string) => {
    try {
      const res = await fetch('/api/coupons/validate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code, subtotal: cartSubtotal }),
      });
      const data = await res.json();
      if (res.ok && data.valid) {
        setAppliedCoupon({
          code: data.code,
          discount: data.discount,
          freeShipping: data.freeShipping,
        });
        showNotification(`Promo code ${data.code} applied successfully!`);
        return { success: true, message: `Promo code ${data.code} applied!` };
      } else {
        return { success: false, message: data.error || 'Invalid promo code' };
      }
    } catch {
      // Offline fallback
      const norm = code.toUpperCase().trim();
      if (norm === 'VESLII10') {
        const disc = Math.round(cartSubtotal * 0.1);
        setAppliedCoupon({ code: 'VESLII10', discount: disc, freeShipping: false });
        return { success: true, message: '10% discount applied!' };
      }
      return { success: false, message: 'Could not validate promo code' };
    }
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
    showNotification('Promo code removed.');
  };

  return (
    <ShopContext.Provider
      value={{
        products,
        cart,
        wishlist,
        isCartOpen,
        isSearchOpen,
        isAccountOpen,
        activePolicy,
        quickViewProduct,
        currentOrder,
        notification,
        appliedCoupon,
        openCart,
        closeCart,
        openSearch,
        closeSearch,
        openAccount,
        closeAccount,
        openPolicy,
        closePolicy,
        setQuickView,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        toggleWishlist,
        isInWishlist,
        applyCoupon,
        removeCoupon,
        showNotification,
        setCurrentOrder,
        cartTotalCount,
        cartSubtotal,
        cartShippingFee,
        cartFinalTotal,
        refreshProducts,
      }}
    >
      {children}
    </ShopContext.Provider>
  );
};

export const useShop = () => {
  const context = useContext(ShopContext);
  if (!context) {
    throw new Error('useShop must be used within a ShopProvider');
  }
  return context;
};
