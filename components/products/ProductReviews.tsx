'use client';

import { useState } from 'react';
import { RatingSummary } from './RatingSummary';
import { ReviewForm, ReviewFormData  } from './ReviewForm';
import { ReviewItem } from './ReviewItem';
import { useTranslations } from 'next-intl';

interface Review {
  id: number;
  userName: string;
  userInitials: string;
  rating: number;
  comment: string;
  date: string;
  isVerified?: boolean;
  isAuthor?: boolean;
  helpfulCount?: number;
  photos?: string[];
}

interface ProductReviewsProps {
  averageRating: number;
  totalReviews: number;
  distribution: {
    [key: string]: number;
  };
  reviews: Review[];
  onReviewSubmit?: (data: ReviewFormData) => Promise<void>;
  className?: string;
}

export function ProductReviews({
  averageRating,
  totalReviews,
  distribution,
  reviews,
  onReviewSubmit,
  className = '',
}: ProductReviewsProps) {
  const t = useTranslations('ProductDetails');
  const [showAllReviews, setShowAllReviews] = useState(false);
  const displayedReviews = showAllReviews ? reviews : reviews.slice(0, 3);

  return (
    <div className={`mt-20 border-t border-slate-200 dark:border-slate-800 pt-16 ${className}`}>
      <div className="mb-12">
        <h2 className="text-3xl font-bold mb-2">{t('reviews.title')}</h2>
        <p className="text-slate-500">
          {t('reviews.subtitle', { count: totalReviews })}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* Left Column - Rating Summary */}
        <div className="lg:col-span-4 space-y-8">
          <RatingSummary
            average={averageRating}
            count={totalReviews}
            distribution={distribution}
          />
        </div>

        {/* Right Column - Reviews */}
        <div className="lg:col-span-8 space-y-12">
          <ReviewForm onSubmit={onReviewSubmit} />

          <div className="space-y-8">
            {displayedReviews.map((review) => (
              <ReviewItem
                key={review.id}
                {...review}
                onEdit={() => console.log('Edit review', review.id)}
                onDelete={() => console.log('Delete review', review.id)}
                onHelpful={() => console.log('Helpful', review.id)}
                onShare={() => console.log('Share review', review.id)}
              />
            ))}

            {reviews.length > 3 && !showAllReviews && (
              <button
                onClick={() => setShowAllReviews(true)}
                className="w-full py-4 rounded-xl border-2 border-dashed border-slate-200 dark:border-slate-800 text-slate-500 font-bold hover:border-primary hover:text-primary transition-all"
              >
                {t('reviews.loadMore')}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductReviews;

