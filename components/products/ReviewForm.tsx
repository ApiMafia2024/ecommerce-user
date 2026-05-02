'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { ImagePlus, Star } from 'lucide-react';
import { FormInput, useToast } from '@/components/ui';
import { useTranslations } from 'next-intl';

export interface ReviewFormData {
  rating: number;
  comment: string;
  photos?: FileList;
}

interface ReviewFormProps {
  onSubmit?: (data: ReviewFormData) => Promise<void>;
  className?: string;
}

export function ReviewForm({ onSubmit, className = '' }: ReviewFormProps) {
  const t = useTranslations('ProductDetails');
  const { showToast } = useToast();
  const [selectedRating, setSelectedRating] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ReviewFormData>();

  const handleFormSubmit = async (data: ReviewFormData) => {
    if (selectedRating === 0) {
      showToast(t('reviewForm.ratingRequired'), 'error');
      return;
    }

    setIsSubmitting(true);
    try {
      const formData = { ...data, rating: selectedRating };
      await onSubmit?.(formData);
      reset();
      setSelectedRating(0);
      showToast(t('reviewForm.success'), 'success');
    } catch (error) {
      showToast(t('reviewForm.error'), 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      className={`bg-white dark:bg-slate-800/50 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm ${className}`}
    >
      {/* <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
        <Star className="w-5 h-5 text-primary" />
        {t('reviewForm.title')}
      </h3> */}
      <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
        {/* Rating Selection */}
        <div>
          <label className="text-sm font-semibold mb-2 block text-slate-700 dark:text-slate-300">
            {t('reviewForm.rateProduct')}
          </label>
          <div className="flex gap-1 text-slate-300">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => setSelectedRating(star)}
                className={`hover:text-amber-400 transition-colors ${
                  star <= selectedRating ? 'text-amber-400' : ''
                }`}
                aria-label={`Rate ${star} stars`}
              >
                <Star
                  className={`w-8 h-8 ${
                    star <= selectedRating
                      ? 'fill-amber-400 text-amber-400'
                      : 'text-slate-300'
                  }`}
                />
              </button>
            ))}
          </div>
        </div>

        {/* Comment */}
        <div>
          <label className="text-sm font-semibold mb-2 block text-slate-700 dark:text-slate-300">
            {t('reviewForm.experience')}
          </label>
          <FormInput
            type="textarea"
            placeholder={t('reviewForm.experiencePlaceholder')}
            rows={4}
            error={errors.comment}
            {...register('comment', {
              required: t('reviewForm.commentRequired'),
            })}
          />
        </div>

        {/* Photo Upload */}
        {/* <div>
          <label className="text-sm font-semibold mb-2 block text-slate-700 dark:text-slate-300">
            {t('reviewForm.addPhotos')}
          </label>
          <div className="flex flex-wrap gap-4">
            <label className="w-20 h-20 rounded-xl border-2 border-dashed border-slate-200 dark:border-slate-700 flex flex-col items-center justify-center text-slate-400 hover:border-primary hover:text-primary transition-all cursor-pointer">
              <ImagePlus className="w-5 h-5" />
              <span className="text-[10px] font-bold mt-1 uppercase">
                {t('reviewForm.upload')}
              </span>
              <input
                type="file"
                multiple
                accept="image/*"
                className="hidden"
                {...register('photos')}
              />
            </label>
          </div>
        </div> */}

        {/* Submit Button */}
        <div className="pt-2 flex justify-end">
          <button
            type="submit"
            disabled={isSubmitting}
            className="bg-primary hover:bg-primary/90 text-white font-bold py-3 px-8 rounded-xl transition-all shadow-lg shadow-primary/20 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? t('reviewForm.submitting') : t('reviewForm.submit')}
          </button>
        </div>
      </form>
    </div>
  );
}

export default ReviewForm;

