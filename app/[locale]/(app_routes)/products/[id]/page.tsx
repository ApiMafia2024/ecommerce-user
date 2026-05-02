'use client';

import { useParams } from 'next/navigation';
import { useMemo } from 'react';
import { useProduct } from '@/hooks/queries/useProduct';
import { Breadcrumbs } from '@/components/shared/Breadcrumbs';
import { ProductImageGallery } from '@/components/products/ProductImageGallery';
import { ProductInfo } from '@/components/products/ProductInfo';
import { ProductReviews } from '@/components/products/ProductReviews';
import { Footer } from '@/components/shared/Footer';
import Loading from '@/app/loading';
import { useTranslations } from 'next-intl';
import { AlertCircle } from 'lucide-react';
import { ReviewFormData } from '@/components/products/ReviewForm';

export default function ProductDetailPage() {
  const params = useParams();
  const t = useTranslations('ProductDetails');
  const idParam = params?.id;
  const id = idParam ? Number(idParam) : null;
  const { data: product, isLoading, isError } = useProduct(id);

  // Convert rate.details to distribution format (percentages)
  // rate.details format: { "5": "85", "4": "10", ... } -> { "5": 85, "4": 10, ... }
  const distribution = useMemo(() => {
    if (!product || !product.rate?.details) {
      return { '5': 0, '4': 0, '3': 0, '2': 0, '1': 0 };
    }
    
    const dist: { [key: string]: number } = { '5': 0, '4': 0, '3': 0, '2': 0, '1': 0 };
    
    Object.entries(product.rate.details).forEach(([key, value]) => {
      const numValue = typeof value === 'string' ? parseFloat(value) : Number(value);
      if (!isNaN(numValue) && ['1', '2', '3', '4', '5'].includes(key)) {
        dist[key] = numValue;
      }
    });
    
    return dist;
  }, [product]);

  // Map product reviews to the format expected by ProductReviews
  const reviews = useMemo(() => {
    if (!product || !product.reviews) return [];
    
    return product.reviews.map((review, index) => {
      const userName = review.user?.name || 'Anonymous';
      const initials = userName
        .split(' ')
        .map(n => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2) || 'AN';
      
      return {
        id: index + 1,
        userName,
        userInitials: initials,
        rating: 5, // Default rating - you may want to add rating field to Review type
        comment: review.comment || '',
        date: 'Recently', // You may want to add date field to Review type
        isVerified: false,
        isAuthor: false,
        helpfulCount: 0,
      };
    });
  }, [product]);

  const handleAddToCart = (variationId: number) => {
    // TODO: Implement add to cart
    console.log('Add to cart:', variationId);
  };

  const handleAddToWishlist = () => {
    // TODO: Implement add to wishlist
    console.log('Add to wishlist');
  };

  const handleReviewSubmit = async (data: ReviewFormData) => {
    // TODO: Implement review submission
    console.log('Submit review:', data);
    await new Promise((resolve) => setTimeout(resolve, 1000));
  };

  if (isLoading) {
    return (
      <>
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Loading />
        </main>
      </>
    );
  }

  if (isError || !product) {
    return (
      <>
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-800 p-8 text-center">
            <div className="flex items-center justify-center gap-3 mb-4">
              <AlertCircle className="w-8 h-8 text-red-600 dark:text-red-400" />
              <p className="text-lg font-bold text-slate-900 dark:text-white">
                {t('notFound')}
              </p>
            </div>
            <p className="text-slate-600 dark:text-slate-400 mb-6">
              {t('notFoundDescription')}
            </p>
          </div>
        </main>
      </>
    );
  }

  const breadcrumbItems = [
    { label: t('breadcrumb.home'), href: '/' },
    { label: product.category.name, href: `/categories/${product.category.id}` },
    { label: product.name },
  ];

  return (
    <>
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Breadcrumbs items={breadcrumbItems} className="mb-8" />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 mb-16">
          {/* Product Images */}
          <div className="lg:col-span-7">
            <ProductImageGallery
              images={product.images}
              productName={product.name}
            />
          </div>

          {/* Product Info */}
          <div className="lg:col-span-5">
            <ProductInfo
              product={product}
              onAddToCart={handleAddToCart}
              onAddToWishlist={handleAddToWishlist}
            />
          </div>
        </div>

        {/* Reviews Section */}
        {product && (
          <ProductReviews
            averageRating={product.rate?.average || 0}
            totalReviews={product.total_reviews || product.rate?.count || 0}
            distribution={distribution}
            reviews={reviews}
            onReviewSubmit={handleReviewSubmit}
          />
        )}
      </main>
      <Footer />
    </>
  );
}

