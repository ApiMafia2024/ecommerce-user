'use client';

import { useState } from 'react';
import { ProductCardProps } from '@/types/home.types';
import Image from 'next/image';
import { ImageIcon, Loader2 } from 'lucide-react';
import { AiFillHeart, AiOutlineHeart } from 'react-icons/ai';
import { useTranslations } from 'next-intl';
import { ProductCardImagesSlider } from '../products/ProductCardImagesSlider';
import { useWishlistToggle } from '@/hooks/useWishlistToggle';
import { Link } from '@/i18n/navigation';
import ProductCardActionButtons from '../products/ProductCardActionButtons';
import { useProductCard } from '@/hooks/useProductCard';

export function ProductCard({
  product,
  discountPercentage,
  originalPrice,
  onAddToCart,
  className = '',
}: ProductCardProps) {
  const [imageError, setImageError] = useState(false);
  const { defaultVariant } = useProductCard({ product });
  const { isWishlisted, toggleWishlist, isLoading: isWishlistLoading } = useWishlistToggle(product.id);
  const displayPrice = originalPrice && discountPercentage
    ? product?.variations[0]?.price || 0
    : 0

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onAddToCart?.(product.id);
  };

  const handleWishlistToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist();
  };

  const t = useTranslations('ProductDetails');
  return (
    <article
      className={`
        bg-white dark:bg-[#2d3238] rounded-xl pb-3 shadow-sm 
        hover:shadow-xl transition-all group 
        border border-transparent hover:border-primary/20
        ${className}
      `}
    >
      <Link
        href={`/products/${product.id}`}
        className="block rounded-lg"
        // aria-label={`View details for ${product.name}`}
      >
               <div className="relative mb-3 aspect-square bg-gray-50 dark:bg-[#3a3f45] rounded-t-lg overflow-hidden">
          {product.images && !imageError && product.images?.length > 0 ?
          product.images?.length > 1 ? (
            <ProductCardImagesSlider  images={product.images} />
          ) : (
            <Image
              src={product.images[0].original}
              alt={product.name}
              fill
              className="object-cover group-hover:scale-110 transition-transform duration-500"
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
              onError={() => setImageError(true)}
              loading="lazy"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center" aria-hidden="true">
              <ImageIcon className="w-10 h-10 text-gray-400" />
            </div>
          )}
          {discountPercentage && (
            <span 
              className="absolute top-2 left-2 bg-[#F2720D] text-white text-[10px] font-normal font-black px-2 py-1 rounded z-10"
              aria-label={`${discountPercentage}% discount`}
            >
              -{discountPercentage}%
            </span>
          )}
          {/* Wishlist Heart Icon */}
          <button
            onClick={handleWishlistToggle}
            className="absolute top-2 right-2 z-20 w-8 h-8 rounded-full bg-white/90 dark:bg-[#2d3238]/90 backdrop-blur-sm flex items-center justify-center transition-all hover:scale-110 active:scale-95 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 shadow-sm"
            aria-label={isWishlisted ? `Remove ${product.name} from wishlist` : `Add ${product.name} to wishlist`}
            disabled={isWishlistLoading}
          >
            {isWishlistLoading ? (
              <Loader2 className="w-4 h-4 text-primary animate-spin" />
            ) : isWishlisted ? (
              <AiFillHeart className="w-5 h-5 text-red-500 animate-pulse" />
            ) : (
              <AiOutlineHeart className="w-5 h-5 text-gray-400 transition-colors hover:text-red-400" />
            )}
          </button>
        </div>

        <div className="px-3 flex flex-col"> 
        <h3 className="text-md  font-normal text-[#0f141a] dark:text-gray-100 truncate mb-1">
          {product.name}
        </h3>

        <div className="flex items-baseline gap-2 mb-3" aria-label={`Price: $${displayPrice}${originalPrice && discountPercentage ? `, originally $${originalPrice}` : ''}`}>
          <span className="text-lg font-semibold  text-primary">
            ${displayPrice}
          </span>
          {originalPrice && discountPercentage && (
            <span className="text-xs text-gray-400 line-through" aria-hidden="true">
              ${originalPrice?.toFixed(2)}
            </span>
          )}
        </div></div>
      </Link>
          <div className="w-full px-3">
          <ProductCardActionButtons  defaultVariant={defaultVariant}/>
          </div>
    </article>
  );
}

export default ProductCard;
