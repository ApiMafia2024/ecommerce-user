'use client';

import { ShoppingCart, ArrowRight, ArrowLeft } from 'lucide-react';
import { useLocale, useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { Button } from '@/components/ui/button';

export function CartEmptyState() {
  const t = useTranslations('Cart');
  const locale = useLocale();
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
      <div className="mb-6">
        <ShoppingCart className="w-16 h-16 text-[#8a7560] dark:text-gray-500 mx-auto" aria-hidden />
      </div>
      <h2 className="text-2xl font-black mb-2 text-[#181411] dark:text-white">
        {t('empty')}
      </h2>
      <p className="text-[#8a7560] dark:text-gray-400 mb-8 max-w-md">
        {t('emptyDescription')}
      </p>
      <Link href="/">
        <Button
          className="bg-primary cursor-pointer hover:bg-primary/90 text-white font-black py-4 px-8 rounded-xl flex items-center justify-center gap-2 transition-all shadow-lg shadow-primary/20 hover:shadow-primary/40"
          size="lg"
        >
          {t('continueShopping')}
          {locale === 'ar' ? <ArrowLeft className="w-5 h-5" /> : <ArrowRight className="w-5 h-5" />}
        </Button>
      </Link>
    </div>
  );
}

