'use client';

import { useParams } from 'next/navigation';
import { Loader2 } from 'lucide-react';
import { Link } from '@/i18n/navigation';
import Navbar from '@/components/shared/Navbar';
import { ProfileFooter } from '@/components/profile/ProfileFooter';
import { OrderDetail } from '@/components/profile/OrderDetail';
import { useOrder } from '@/hooks/queries/useOrder';
import { useTranslations } from 'next-intl';
import { ArrowLeft, ChevronRight } from 'lucide-react';

export default function OrderDetailPage() {
  const params = useParams();
  const t = useTranslations('Auth');
  const idParam = params?.id;
  const id = idParam ? Number(idParam) : null;
  const { data: order, isLoading, isError } = useOrder(id);

  return (
    <>
      <Navbar />
      <main className="w-full max-w-[1280px] mx-auto px-4 sm:px-6 py-8">
        <Link
          href="/auth/profile?tab=orders"
          className="inline-flex items-center gap-2 text-sm font-medium text-blue-600 dark:text-blue-400 hover:underline mb-6"
        >
          <ArrowLeft className="w-4 h-4" aria-hidden />
          {t('profile.orders.backToList')}
        </Link>
        {isLoading && (
          <div className="flex items-center justify-center py-16" aria-busy="true">
            <Loader2 className="w-8 h-8 animate-spin text-blue-600" aria-hidden />
          </div>
        )}
        {!isLoading && (isError || !order) && (
          <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-800 p-8 text-center">
            <p className="text-slate-600 dark:text-slate-400 mb-4">
              {t('profile.orders.notFound')}
            </p>
            <Link
              href="/auth/profile?tab=orders"
              className="text-sm font-medium text-blue-600 dark:text-blue-400 hover:underline"
            >
              {t('profile.orders.backToList')}
            </Link>
          </div>
        )}
        {!isLoading && order && <OrderDetail order={order} />}
      </main>
      <ProfileFooter />
    </>
  );
}
