'use client';

import { ShoppingBag } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useOrders } from '@/hooks/queries/useOrders';
import { OrderTableRow } from './OrderTableRow';
import { EmptyState } from './EmptyState';
import { Skeleton } from '@/components/ui/skeleton';

export function OrdersTab() {
  const t = useTranslations('Auth');
  const { data: orders, isLoading, isError } = useOrders();
  const count = orders?.length ?? 0;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white">
            {t('profile.orders.orderHistory')}
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">
            {t('profile.orders.orderHistorySubtitle')}
          </p>
        </div>
      </div>
      {(isLoading || (orders && orders.length > 0)) && (
        <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 dark:bg-slate-800/50 text-slate-500 dark:text-slate-400 text-xs uppercase tracking-wider font-bold">
                  <th className="px-6 py-4">Order ID</th>
                  <th className="px-6 py-4">Date</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Total Price</th>
                  <th className="px-6 py-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {isLoading &&
                  [1, 2, 3, 4].map((i) => (
                    <tr key={i}>
                      <td className="px-6 py-5">
                        <Skeleton className="h-4 w-24" />
                      </td>
                      <td className="px-6 py-5">
                        <Skeleton className="h-4 w-20" />
                      </td>
                      <td className="px-6 py-5">
                        <Skeleton className="h-5 w-20 rounded-full" />
                      </td>
                      <td className="px-6 py-5">
                        <Skeleton className="h-4 w-16" />
                      </td>
                      <td className="px-6 py-5 text-right">
                        <Skeleton className="h-4 w-20 ml-auto" />
                      </td>
                    </tr>
                  ))}
                {!isLoading && !isError && orders?.map((order) => (
                  <OrderTableRow key={order.id} order={order} />
                ))}
              </tbody>
            </table>
          </div>
          {!isLoading && orders && orders.length > 0 && (
            <div className="px-6 py-4 bg-slate-50 dark:bg-slate-800/50 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                {t('profile.orders.showingOrders', {
                  from: 1,
                  to: count,
                  total: count,
                })}
              </span>
            </div>
          )}
        </div>
      )}
      {!isLoading && isError && (
        <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-800 p-6">
          <EmptyState icon={ShoppingBag} titleKey="profile.orders.error" />
        </div>
      )}
      {!isLoading && !isError && (!orders || orders.length === 0) && (
        <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-800 p-6">
          <EmptyState icon={ShoppingBag} titleKey="profile.orders.empty" />
        </div>
      )}
    </div>
  );
}
