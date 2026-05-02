'use client';

import { Star } from 'lucide-react';

interface RatingSummaryProps {
  average: number;
  count: number;
  distribution: {
    [key: string]: number; // e.g., "5": 85, "4": 10, etc.
  };
  className?: string;
}

export function RatingSummary({
  average,
  count,
  distribution,
  className = '',
}: RatingSummaryProps) {
  const getRatingLabel = (rating: number): string => {
    if (rating >= 4.5) return 'Highly Recommended';
    if (rating >= 4.0) return 'Recommended';
    if (rating >= 3.5) return 'Good';
    if (rating >= 3.0) return 'Average';
    return 'Needs Improvement';
  };

  return (
    <div className={`p-8 rounded-3xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 ${className}`}>
      <div className="flex items-center gap-4 mb-6">
        <span className="text-6xl font-black text-slate-900 dark:text-white">{average.toFixed(1)}</span>
        <div>
          <div className="flex text-amber-400 mb-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                className={`w-4 h-4 ${
                  star <= Math.floor(average)
                    ? 'fill-amber-400 text-amber-400'
                    : 'text-amber-400/30'
                }`}
              />
            ))}
          </div>
          <span className="text-sm font-medium text-slate-500 italic">
            {getRatingLabel(average)}
          </span>
        </div>
      </div>
      <div className="space-y-4">
        {[5, 4, 3, 2, 1].map((rating) => {
          const percentage = distribution[rating.toString()] || 0;
          return (
            <div key={rating} className="flex items-center gap-4">
              <span className="text-sm font-medium w-4">{rating}</span>
              <div className="flex-1 h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                <div
                  className="h-full bg-primary transition-all"
                  style={{ width: `${percentage}%` }}
                />
              </div>
              <span className="text-sm text-slate-500 w-10">{percentage}%</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default RatingSummary;

