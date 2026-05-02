'use client';

import { useTranslations } from 'next-intl';
import { Breadcrumbs } from '@/components/shared/Breadcrumbs';
import { Footer } from '@/components/shared/Footer';
import { CartItem } from '@/components/cart/CartItem';
import { CartSummary } from '@/components/cart/CartSummary';
import { FrequentlyBoughtTogether } from '@/components/cart/FrequentlyBoughtTogether';
import { CartEmptyState } from '@/components/cart/CartEmptyState';
import { Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useCart } from '@/hooks/useCart';
import { CartItem as CartItemType } from '@/types/cart.types';
import CartSkeletonLoader from '@/components/cart/CartSkeletonLoader';

const CartPage = () => {
  const { items: cartItems,isLoading, cartId } = useCart() 
  const t = useTranslations('Cart');

  // Calculate totals
  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const tax = subtotal * 0.08; // 8% tax
  const total = subtotal + tax;
  const itemCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  const breadcrumbItems = [
    { label: t('breadcrumbs.home'), href: '/' },
    { label: t('breadcrumbs.cart') },
  ];

  const handleClearCart = () => {
    // UI only - no functionality
    console.log('Clear cart');
  };


  if(isLoading) {
    return <CartSkeletonLoader />;
  }

  const isEmpty = cartItems.length === 0;
  
  return (
    <>
      <main className="max-w-[1280px] mx-auto px-6 py-8">
        {/* Breadcrumbs */}
        <Breadcrumbs items={breadcrumbItems} className="mb-6" />

        {/* Page Heading */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div>
            <h1 className="text-4xl font-black tracking-tight mb-2 text-[#181411] dark:text-white">
              {t('title')}
            </h1>
            {!isEmpty && (
              <p className="text-[#8a7560] dark:text-gray-400">
                {t('itemCount', { count: itemCount })}
              </p>
            )}
          </div>
          {!isEmpty && (
            <Button
              variant="outline"
              onClick={handleClearCart}
              className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-[#3d2d1d] border border-gray-200 dark:border-gray-700 rounded-lg text-sm font-bold hover:bg-red-50 hover:text-red-600 hover:border-red-200 dark:hover:bg-red-500/10 dark:hover:text-red-400 transition-all"
            >
              <Trash2 className="w-4 h-4" />
              {t('clearCart')}
            </Button>
          )}
        </div>

        {/* Cart Content */}
        {isEmpty ? (
          <CartEmptyState />
        ) : (
          <>
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              {/* Cart Items List */}
              <div className="lg:col-span-8 flex flex-col gap-4">
                {cartItems.map((item: CartItemType) => (
                  <CartItem key={`cart-item-${item.quantity}`} item={item} />
                ))}
              </div>

              {/* Cart Summary Sidebar */}
              <div className="lg:col-span-4">
                <CartSummary
                  subtotal={subtotal}
                  shipping="free"
                  total={total}
                />
              </div>
            </div>

            {/* Frequently Bought Together */}
            <FrequentlyBoughtTogether />
          </>
        )}
      </main>
      <Footer />
    </>
  );
};

export default CartPage;