'use client';

import { LucideIcon } from 'lucide-react';
import { useTranslations } from 'next-intl';

interface EmptyStateProps {
  icon: LucideIcon;
  /** Fallback when titleKey is not used */
  title?: string;
  description?: string;
  /** Translation key for title (e.g. "profile.orders.empty") under Auth namespace */
  titleKey?: string;
  /** Translation key for description under Auth namespace */
  descriptionKey?: string;
  className?: string;
}

export function EmptyState({
  icon: Icon,
  title,
  description,
  titleKey,
  descriptionKey,
  className = '',
}: EmptyStateProps) {
  const t = useTranslations('Auth');
  const displayTitle = titleKey ? t(titleKey) : title ?? '';
  const displayDescription = descriptionKey ? t(descriptionKey) : description;

  return (
    <div
      className={`flex flex-col items-center justify-center py-12 px-4 text-center text-slate-500 dark:text-slate-400 ${className}`}
      role="status"
      aria-label={displayTitle}
    >
      <Icon className="w-12 h-12 mb-4 text-slate-300 dark:text-slate-600" aria-hidden />
      <p className="text-base font-medium text-slate-700 dark:text-slate-300">
        {displayTitle}
      </p>
      {displayDescription && (
        <p className="mt-1 text-sm max-w-sm">{displayDescription}</p>
      )}
    </div>
  );
}
