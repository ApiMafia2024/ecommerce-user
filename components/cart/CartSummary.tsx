'use client';

import { useState } from 'react';
import { ArrowLeft, ArrowRight, Shield, Truck } from 'lucide-react';
import { useLocale, useTranslations } from 'next-intl';
import { Button } from '@/components/ui/button';
import { useCartMutations } from '@/hooks/mutations/useCartMutations';
import { Link } from '@/i18n/navigation';
export interface CartSummaryProps {
  subtotal: number;
  shipping: number | 'free';
  total: number;
}

function SummarySkeletonRow() {
  return (
    <div className="flex justify-between">
      <div className="h-4 w-20 rounded bg-gray-200 dark:bg-gray-700 animate-pulse" />
      <div className="h-4 w-16 rounded bg-gray-200 dark:bg-gray-700 animate-pulse" />
    </div>
  );
}

function CartSummarySkeleton() {
  return (
    <div className="lg:sticky lg:top-24">
      <div className="bg-white dark:bg-background-dark/40 border border-gray-100 dark:border-gray-800 rounded-xl p-6 shadow-sm">
        {/* Title */}
        <div className="h-6 w-40 rounded bg-gray-200 dark:bg-gray-700 animate-pulse mb-6" />

        {/* Summary rows: subtotal, shipping */}
        <div className="space-y-4 mb-6 pb-6 border-b border-gray-100 dark:border-gray-800">
          <SummarySkeletonRow />
          <SummarySkeletonRow />
        </div>

        {/* Discount code */}
        <div className="mb-8">
          <div className="h-4 w-24 rounded bg-gray-200 dark:bg-gray-700 animate-pulse mb-2" />
          <div className="flex gap-2">
            <div className="flex-1 h-9 rounded-lg bg-gray-200 dark:bg-gray-700 animate-pulse" />
            <div className="h-9 w-16 rounded-lg bg-gray-200 dark:bg-gray-700 animate-pulse" />
          </div>
        </div>

        {/* Total */}
        <div className="flex items-end justify-between mb-8">
          <div className="h-5 w-24 rounded bg-gray-200 dark:bg-gray-700 animate-pulse" />
          <div className="flex flex-col items-end gap-1">
            <div className="h-8 w-28 rounded bg-gray-200 dark:bg-gray-700 animate-pulse" />
            <div className="h-3 w-24 rounded bg-gray-200 dark:bg-gray-700 animate-pulse" />
          </div>
        </div>

        {/* Checkout button */}
        <div className="h-12 w-full rounded-xl bg-gray-200 dark:bg-gray-700 animate-pulse" />

        {/* Security badge */}
        <div className="mt-6 flex items-center justify-center gap-2">
          <div className="h-4 w-4 rounded bg-gray-200 dark:bg-gray-700 animate-pulse" />
          <div className="h-3 w-28 rounded bg-gray-200 dark:bg-gray-700 animate-pulse" />
        </div>
      </div>

      {/* Delivery banner */}
      <div className="mt-4 p-4 flex items-center gap-4 rounded-xl bg-gray-100 dark:bg-gray-800 animate-pulse">
        <div className="h-5 w-5 rounded bg-gray-200 dark:bg-gray-700 shrink-0" />
        <div className="h-3 w-48 rounded bg-gray-200 dark:bg-gray-700" />
      </div>
    </div>
  );
}

export function CartSummary({ subtotal, shipping, total }: CartSummaryProps) {
  const { isUpdatingItem } = useCartMutations();
  const t = useTranslations('Cart');
  const [discountCode, setDiscountCode] = useState('');

  const handleApplyDiscount = () => {
    // UI only - no functionality
    console.log('Apply discount:', discountCode);
  };

  const locale = useLocale();

  if (isUpdatingItem) {
    return <CartSummarySkeleton />;
  }

  return (
    <div className="lg:sticky lg:top-24">
      <div className="bg-white dark:bg-background-dark/40 border border-gray-100 dark:border-gray-800 rounded-xl p-6 shadow-sm">
        <h2 className="text-xl font-bold mb-6 text-[#181411] dark:text-white">{t('orderSummary')}</h2>
        
        {/* Summary Details */}
        <div className="space-y-4 mb-6 pb-6 border-b border-gray-100 dark:border-gray-800">
          <div className="flex justify-between">
            <span className="text-[#8a7560] dark:text-gray-400">{t('subtotal')}</span>
            <span className="font-semibold text-[#181411] dark:text-white">${subtotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-[#8a7560] dark:text-gray-400">{t('shipping')}</span>
            <span className="text-green-600 dark:text-green-400 font-medium">
              {shipping === 'free' ? t('free') : `$${shipping.toFixed(2)}`}
            </span>
          </div>
        </div>

        {/* Discount Code */}
        <div className="mb-8">
          <label className="block text-sm font-medium text-[#8a7560] dark:text-gray-400 mb-2">
            {t('discountCode')}
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              value={discountCode}
              onChange={(e) => setDiscountCode(e.target.value)}
              placeholder={t('discountCodePlaceholder')}
              className="flex-1 rounded-lg bg-[#f5f2f0] dark:bg-[#3d2d1d] border-none text-sm px-4 py-2 focus:ring-2 focus:ring-primary/50 text-[#181411] dark:text-white placeholder:text-[#8a7560] dark:placeholder:text-gray-500"
            />
            <button
              onClick={handleApplyDiscount}
              className="px-4 py-2 bg-[#f5f2f0] dark:bg-[#3d2d1d] text-[#181411] dark:text-white text-sm font-bold rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
            >
              {t('apply')}
            </button>
          </div>
        </div>

        {/* Total */}
        <div className="flex items-end justify-between mb-8">
          <span className="text-lg font-bold text-[#181411] dark:text-white">{t('totalAmount')}</span>
          <div className="text-right">
            <p className="text-3xl font-black text-primary">${total.toFixed(2)}</p>
          </div>
        </div>

        {/* Checkout Button */}
        <Link href="/checkout" className="block">
          <Button
            className="w-full cursor-pointer bg-primary hover:bg-primary/90 text-white font-black py-4 rounded-xl flex items-center justify-center gap-2 transition-all shadow-lg shadow-primary/20 hover:shadow-primary/40"
            size="lg"
          >
            {t('proceedToCheckout')}
            {locale === 'ar' ? <ArrowLeft className="w-5 h-5" /> : <ArrowRight className="w-5 h-5" />}
          </Button>
        </Link>

        {/* Security Badge */}
        <div className="mt-6 flex items-center justify-center gap-4 text-[#8a7560] dark:text-gray-400">
          <Shield className="w-5 h-5" />
          <span className="text-xs font-medium">{t('secureCheckout')}</span>
        </div>
      </div>

      {/* Next Day Delivery Banner */}
      <div className="mt-4 p-4 flex items-center gap-4 bg-primary/5 rounded-xl border border-primary/10">
        <Truck className="w-5 h-5 text-primary shrink-0" />
        <p className="text-xs font-medium text-[#181411] dark:text-white">
          <span className="font-bold">{t('nextDayDelivery')}</span>{' '}
          {t('nextDayDeliveryDescription', { time: '2h 15m' })}
        </p>
      </div>
    </div>
  );
}

