import React, { useState, useEffect } from 'react';
import { ShopProvider, useShop } from './context/ShopContext';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { CartDrawer } from './components/CartDrawer';
import { SearchModal } from './components/SearchModal';
import { QuickViewModal } from './components/QuickViewModal';
import { AccountModal } from './components/AccountModal';
import { PolicyModal } from './components/PolicyModal';
import { HomePage } from './pages/HomePage';
import { CollectionPage } from './pages/CollectionPage';
import { ProductDetailPage } from './pages/ProductDetailPage';
import { CheckoutPage } from './pages/CheckoutPage';
import { OrderConfirmationPage } from './pages/OrderConfirmationPage';
import { OrderTrackingPage } from './pages/OrderTrackingPage';
import { WishlistPage } from './pages/WishlistPage';
import { Product, Order, ProductCategory } from './types';
import { CheckCircle2 } from 'lucide-react';

function AppContent() {
  const { products, notification, currentOrder, setCurrentOrder } = useShop();

  // Simple client-side routing state
  const [currentPath, setCurrentPath] = useState<string>('/');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [trackingOrder, setTrackingOrder] = useState<Order | null>(null);

  // Sync scroll on route change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentPath, selectedProduct]);

  // Navigate handler
  const handleNavigate = (path: string) => {
    setCurrentPath(path);
    setSelectedProduct(null);
  };

  const handleOpenProduct = (product: Product) => {
    setSelectedProduct(product);
    setCurrentPath(`/products/${product.slug}`);
  };

  const handleProceedToCheckout = () => {
    setCurrentPath('/checkout');
    setSelectedProduct(null);
  };

  const handleOrderSuccess = (order: Order) => {
    setCurrentOrder(order);
    setTrackingOrder(order);
    setCurrentPath('/order-confirmation');
    setSelectedProduct(null);
  };

  const handleTrackOrderFromConfirmation = (order: Order) => {
    setTrackingOrder(order);
    setCurrentPath('/track');
  };

  const handleOrderFoundFromModal = (order: Order) => {
    setTrackingOrder(order);
    setCurrentPath('/track');
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FAFAFA] text-neutral-900 font-sans">
      {/* Toast Notification */}
      {notification && (
        <div className="fixed bottom-6 right-6 z-50 p-4 bg-neutral-950 text-white text-xs font-medium tracking-wide shadow-2xl flex items-center gap-3 animate-in fade-in slide-in-from-bottom-4 duration-300 border border-neutral-800">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{notification}</span>
        </div>
      )}

      {/* Global Header */}
      <Header currentPath={currentPath} onNavigate={handleNavigate} />

      {/* Main View Router */}
      <main className="flex-1">
        {currentPath === '/' && (
          <HomePage
            onNavigate={handleNavigate}
            onOpenProduct={handleOpenProduct}
          />
        )}

        {currentPath.startsWith('/collections/') && (
          <CollectionPage
            category={currentPath.split('/')[2] as ProductCategory}
            onOpenProduct={handleOpenProduct}
          />
        )}

        {currentPath.startsWith('/products/') && selectedProduct && (
          <ProductDetailPage
            product={selectedProduct}
            onNavigate={handleNavigate}
            onOpenProduct={handleOpenProduct}
            onProceedToCheckout={handleProceedToCheckout}
          />
        )}

        {currentPath === '/checkout' && (
          <CheckoutPage
            onOrderSuccess={handleOrderSuccess}
            onBackToCart={() => handleNavigate('/')}
          />
        )}

        {currentPath === '/order-confirmation' && currentOrder && (
          <OrderConfirmationPage
            order={currentOrder}
            onContinueShopping={() => handleNavigate('/')}
            onTrackOrder={handleTrackOrderFromConfirmation}
          />
        )}

        {currentPath === '/track' && (
          <OrderTrackingPage
            initialOrder={trackingOrder}
            onBackToHome={() => handleNavigate('/')}
          />
        )}

        {currentPath === '/wishlist' && (
          <WishlistPage
            onBackToHome={() => handleNavigate('/')}
            onOpenProduct={handleOpenProduct}
          />
        )}
      </main>

      {/* Global Footer */}
      <Footer onNavigate={handleNavigate} />

      {/* Global Drawers & Modals */}
      <CartDrawer
        onProceedToCheckout={handleProceedToCheckout}
        onContinueShopping={() => handleNavigate('/')}
      />

      <SearchModal
        onSelectProduct={handleOpenProduct}
        onSelectCategory={(cat) => handleNavigate(`/collections/${cat}`)}
      />

      <QuickViewModal onViewFullDetails={handleOpenProduct} />

      <AccountModal onOrderFound={handleOrderFoundFromModal} />

      <PolicyModal />
    </div>
  );
}

export default function App() {
  return (
    <ShopProvider>
      <AppContent />
    </ShopProvider>
  );
}
