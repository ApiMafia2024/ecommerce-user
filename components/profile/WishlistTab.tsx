'use client';

import { useMemo } from 'react';
import { useSearchParams } from 'next/navigation';
import { Heart } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useWishlist } from '@/hooks/queries/useWishlist';
import { WishlistCard } from './WishlistCard';
import { EmptyState } from './EmptyState';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { Link } from '@/i18n/navigation';
import { ProductCard } from '../ui';
import { Product } from '@/types/product.types';

export function WishlistTab() {
  const t = useTranslations('Auth');
  const searchParams = useSearchParams();
  const page = useMemo(() => {
    const p = searchParams.get('page');
    const n = p ? parseInt(p, 10) : 1;
    return Number.isFinite(n) && n >= 1 ? n : 1;
  }, [searchParams]);

  const { data, isLoading, isError } = useWishlist(page);
  const items = data?.items ?? [];
  const pagination = data?.pagination;
  const total = pagination?.meta?.total ?? items.length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white">
            {t('profile.wishlist.savedItems', { count: total })}
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">
            {t('profile.wishlist.savedItemsSubtitle')}
          </p>
        </div>
      </div>
      <div>
        {isLoading && (
          <div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
            aria-busy="true"
          >
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="rounded-xl overflow-hidden border border-slate-200 dark:border-slate-800">
                <Skeleton className="aspect-square w-full" />
                <div className="p-4">
                  <Skeleton className="h-4 w-3/4 mb-2" />
                  <Skeleton className="h-10 w-full mt-4 rounded-lg" />
                </div>
              </div>
            ))}
          </div>
        )}
        {!isLoading && isError && (
          <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-800 p-6">
            <EmptyState icon={Heart} titleKey="profile.wishlist.error" />
          </div>
        )}
        {!isLoading && !isError && items.length === 0 && (
          <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-800 p-6">
            <EmptyState icon={Heart} titleKey="profile.wishlist.empty" />
          </div>
        )}
        {!isLoading && !isError && items.length > 0 && (
          <>
            <ul
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 list-none p-0 m-0"
              role="list"
            >
              {items.map((item) => (
                <li key={item.id}>
                  <ProductCard product={item as Product} />
                </li>
              ))}
            </ul>
            {pagination && pagination.meta.last_page > 1 && (
              <div className="flex flex-wrap items-center justify-center gap-2 mt-8">
                {pagination.links.prev_page_url ? (
                  <Button variant="outline" size="sm" asChild>
                    <Link
                      href={`/auth/profile?tab=wishlist&page=${pagination.meta.current_page - 1}`}
                    >
                      {t('profile.wishlist.previous')}
                    </Link>
                  </Button>
                ) : null}
                <span className="text-sm text-slate-600 dark:text-slate-400 px-2">
                  {t('profile.wishlist.pageInfo', {
                    current: pagination.meta.current_page,
                    last: pagination.meta.last_page,
                    total: pagination.meta.total,
                  })}
                </span>
                {pagination.links.next_page_url ? (
                  <Button variant="outline" size="sm" asChild>
                    <Link
                      href={`/auth/profile?tab=wishlist&page=${pagination.meta.current_page + 1}`}
                    >
                      {t('profile.wishlist.next')}
                    </Link>
                  </Button>
                ) : null}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
