'use client';

import { useState } from 'react';
import { Link } from '@/i18n/navigation';
import Image from 'next/image';
import { ImageIcon, Trash2, ShoppingCart } from 'lucide-react';
import { WishlistItem } from '@/types/wishlist.types';
import { useTranslations } from 'next-intl';
import { cn } from '@/lib/utils';

interface WishlistCardProps {
  item: WishlistItem;
  className?: string;
}

export function WishlistCard({ item, className }: WishlistCardProps) {
  const t = useTranslations('Auth');
  const [imageError, setImageError] = useState(false);
  const imageUrl = item.images?.[0]?.original;

  const handleRemove = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    // TODO: remove from wishlist API when available
  };

  return (
    <div
      className={cn(
        'bg-white dark:bg-[#1a262b] border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow group relative',
        className
      )}
    >
      <button
        type="button"
        onClick={handleRemove}
        className="absolute top-3 right-3 z-10 size-8 flex items-center justify-center bg-white/80 dark:bg-slate-900/80 backdrop-blur text-slate-400 hover:text-red-500 rounded-full transition-colors shadow-sm"
        aria-label={t('profile.wishlist.remove')}
      >
        <Trash2 className="w-5 h-5" aria-hidden />
      </button>
      <Link
        href={`/products/${item.id}`}
        className="block focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded-xl"
        aria-label={item.name}
      >
        <div className="aspect-square bg-slate-100 dark:bg-slate-800 overflow-hidden relative">
          {imageUrl && !imageError ? (
            <Image
              src={imageUrl}
              alt={item.name}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-500"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
              onError={() => setImageError(true)}
              loading="lazy"
            />
          ) : (
            <div
              className="w-full h-full flex items-center justify-center"
              aria-hidden
            >
              <ImageIcon className="w-12 h-12 text-slate-400" />
            </div>
          )}
        </div>
      </Link>
      <div className="p-4">
        <Link href={`/products/${item.id}`} className="block focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded-lg -m-2 p-2">
          <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200 line-clamp-2 min-h-[40px] mb-4">
            {item.name}
          </h3>
        </Link>
        <Link
          href={`/products/${item.id}`}
          className="w-full bg-primary hover:bg-orange-600 text-white font-bold py-2.5 px-4 rounded-lg flex items-center justify-center gap-2 transition-colors"
        >
          <ShoppingCart className="w-5 h-5 shrink-0" aria-hidden />
          {t('profile.wishlist.addToCart')}
        </Link>
      </div>
    </div>
  );
}
