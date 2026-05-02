'use client';

import { CategoryWithIcon } from '@/types/home.types';
import { useTranslations } from 'next-intl';

import { Link } from '@/i18n/navigation';

interface QuickAccessCategoriesProps {
  categories: CategoryWithIcon[];
  className?: string;
}

export function QuickAccessCategories({
  categories,
  className = '',
}: QuickAccessCategoriesProps) {
  const t = useTranslations('QuickAccessCategories');
  return (
    <section className={`mb-12 ${className}`} aria-labelledby="quick-access-heading">
      <div className="flex items-center justify-between mb-6 px-2">
        <h2 id="quick-access-heading" className="text-lg font-extrabold uppercase tracking-tight flex items-center gap-2 !text-[#0f141a] dark:!text-white">
          <span className="w-2 h-6 bg-primary rounded-full" aria-hidden="true" />
          {t('title')}
        </h2>
      </div>

      <div 
        className="flex overflow-x-auto no-scrollbar gap-4 sm:gap-6 pb-2"
        role="list"
        aria-label={t('aria.categories')}
        onKeyDown={(e) => {
          // Allow horizontal scrolling with arrow keys
          if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
            const container = e.currentTarget;
            const scrollAmount = 200;
            container.scrollBy({
              left: e.key === 'ArrowLeft' ? -scrollAmount : scrollAmount,
              behavior: 'smooth',
            });
          }
        }}
        tabIndex={0}
      >
        {categories.map((category) => (
          <Link
            key={category.id}
            href={`/categories/${category.slug || category.id}`}
            className="flex flex-col items-center gap-2 group cursor-pointer shrink-0 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded-lg p-2"
            aria-label={t('aria.browseCategory', { name: category.name })}
          >
            <div className="category-circle w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-white dark:bg-[#2d3238] shadow-sm border border-[#e8edf2] dark:border-[#3a3f45] flex items-center justify-center transition-all">
              <span className="text-2xl sm:text-3xl text-gray-600 dark:text-gray-300 group-hover:text-primary">
                {category.icon || '•'}
              </span>
            </div>
            <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wider group-hover:text-primary transition-colors">
              {category.name}
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}

export default QuickAccessCategories;
