'use client';

import { Verified, Share, Edit, Trash2, Star, ThumbsUp } from 'lucide-react';
import { useTranslations } from 'next-intl';

interface ReviewItemProps {
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
  onEdit?: () => void;
  onDelete?: () => void;
  onHelpful?: () => void;
  onShare?: () => void;
  className?: string;
}

export function ReviewItem({
  userName,
  userInitials,
  rating,
  comment,
  date,
  isVerified = false,
  isAuthor = false,
  helpfulCount = 0,
  photos = [],
  onEdit,
  onDelete,
  onHelpful,
  onShare,
  className = '',
}: ReviewItemProps) {
  const t = useTranslations('ProductDetails');

  return (
    <div className={`pb-8 border-b border-slate-200 dark:border-slate-800 last:border-0 ${className}`}>
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center text-white font-bold shadow-md">
            {userInitials}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h4 className="font-bold text-slate-900 dark:text-white">{userName}</h4>
              {isAuthor && (
                <span className="text-[10px] px-2 py-0.5 bg-slate-100 dark:bg-slate-800 rounded-full font-bold text-slate-500 uppercase">
                  {t('review.author')}
                </span>
              )}
            </div>
            <div className="flex items-center gap-2">
            <div className="flex text-amber-400">
              {[1, 2, 3, 4, 5].map((starIndex) => (
                <Star
                  key={starIndex}
                  className={`w-3 h-3 ${
                    starIndex <= rating
                      ? 'fill-amber-400 text-amber-400'
                      : 'text-slate-200 dark:text-slate-700'
                  }`}
                />
              ))}
            </div>
              <span className="text-xs text-slate-400">{date}</span>
            </div>
          </div>
        </div>
        {isVerified && (
          <span className="flex items-center text-emerald-600 text-[10px] font-bold uppercase tracking-wider bg-emerald-50 dark:bg-emerald-900/20 px-2 py-1 rounded">
            <Verified className="w-3 h-3 mr-1" />
            {t('review.verifiedPurchase')}
          </span>
        )}
        {isAuthor && (
          <div className="flex items-center gap-2">
            <button
              onClick={onEdit}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-primary transition-all"
            >
              <Edit className="w-3 h-3" />
              {t('review.edit')}
            </button>
            <button
              onClick={onDelete}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-500 hover:bg-rose-50 dark:hover:bg-rose-900/20 hover:text-rose-600 transition-all"
            >
              <Trash2 className="w-3 h-3" />
              {t('review.delete')}
            </button>
          </div>
        )}
      </div>
      <p className="text-slate-600 dark:text-slate-400 leading-relaxed mb-4">{comment}</p>
      {photos.length > 0 && (
        <div className="flex gap-2 mb-4">
          {photos.map((photo, index) => (
            <div
              key={index}
              className="w-20 h-20 rounded-lg overflow-hidden border border-slate-200 dark:border-slate-800"
            >
              <img
                src={photo}
                alt={`Review photo ${index + 1}`}
                className="w-full h-full object-cover"
              />
            </div>
          ))}
        </div>
      )}
      {/* {!isAuthor && (
        <div className="flex items-center gap-4">
          <button
            onClick={onHelpful}
            className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-primary transition-colors"
          >
            <ThumbsUp className="w-3 h-3" />
            {t('review.helpful', { count: helpfulCount })}
          </button>
          <button
            onClick={onShare}
            className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-primary transition-colors"
          >
            <Share className="w-3 h-3" />
            {t('review.share')}
          </button>
        </div>
      )} */}
    </div>
  );
}

export default ReviewItem;

