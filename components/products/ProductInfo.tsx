'use client';

import { useState, useMemo } from 'react';
import { Product, Attribute } from '@/types/product.types';
import { ShoppingCart, Star, Loader2 } from 'lucide-react';
import { AiFillHeart, AiOutlineHeart } from 'react-icons/ai';
import { useToast } from '@/components/ui';
import { useTranslations } from 'next-intl';
import { useCart } from '@/hooks/useCart';
import { useCartMutations } from '@/hooks/mutations/useCartMutations';
import QuantityControls from '@/components/cart/QuantityControls';
import { useWishlistToggle } from '@/hooks/useWishlistToggle';

interface ProductInfoProps {
  product: Product;
  onAddToCart?: (variationId: number) => void;
  onAddToWishlist?: () => void;
  className?: string;
}

export function ProductInfo({
  product,
  onAddToCart,
  onAddToWishlist,
  className = '',
}: ProductInfoProps) {
  const t = useTranslations('ProductDetails');
  const { showToast } = useToast();
  const { items, addToCart, isAdding, isInCart } = useCart();
  const { updateItemMutation, isUpdatingItem } = useCartMutations();
  const { isWishlisted, toggleWishlist, isLoading: isWishlistLoading } = useWishlistToggle(product.id);
  const [selectedAttributes, setSelectedAttributes] = useState<Record<string, string>>({});
  
  // Find the selected variation based on selected attributes
  const selectedVariation = useMemo(() => {
    return product.variations.find(variation => {
      // Check if all selected attributes match this variation
      const variationAttributes = variation.attributes || [];
      const variationAttributeMap: Record<string, string> = {};
      
      variationAttributes.forEach(attr => {
        const attributeObj = attr.attribute as { name?: string } & Attribute;
        const attributeName = attributeObj?.name || 'Unknown';
        const valueName = attr.value?.name || '';
        if (attributeName && valueName) {
          variationAttributeMap[attributeName] = valueName;
        }
      });
      
      // Check if all selected attributes match
      const selectedKeys = Object.keys(selectedAttributes);
      if (selectedKeys.length === 0) {
        // If no attributes selected, use default or first variation
        return variation.is_default || product.variations.indexOf(variation) === 0;
      }
      
      return selectedKeys.every(key => variationAttributeMap[key] === selectedAttributes[key]);
    }) || product.variations.find(v => v.is_default) || product.variations[0] || null;
  }, [product.variations, selectedAttributes]);
  
  // Find cart item for selected variation
  const cartItem = useMemo(() => {
    if (!selectedVariation) return null;
    return items.find((item) => item.variation.id === selectedVariation.id) || null;
  }, [items, selectedVariation]);
  
  const isVariationInCart = selectedVariation ? isInCart(selectedVariation.id) : false;

  // Extract attributes grouped by attribute type from variations
  const attributeGroups = useMemo(() => {
    const groups: Record<string, Set<string>> = {};

    product.variations.forEach((variation) => {
      variation.attributes?.forEach((attr) => {
        // Access attribute name - handle the recursive Attribute type structure
        const attributeObj = attr.attribute as { name?: string } & Attribute;
        const attributeName = attributeObj?.name || 'Unknown';
        const valueName = attr.value?.name || '';
        
        if (!groups[attributeName]) {
          groups[attributeName] = new Set<string>();
        }
        if (valueName) {
          groups[attributeName].add(valueName);
        }
      });
    });

    // Convert Sets to Arrays
    const result: Record<string, string[]> = {};
    Object.keys(groups).forEach((key) => {
      result[key] = Array.from(groups[key]);
    });

    return result;
  }, [product.variations]);

  // Calculate price with discount
  const currentPrice = selectedVariation?.price || 0;
  const discount = selectedVariation?.discount || 0;
  const originalPrice = discount > 0 ? currentPrice / (1 - discount / 100) : null;
  const stockStatus = (selectedVariation?.stock || 0) > 0 ? 'inStock' : 'outOfStock';

  // Get rating data from product
  const rating = product?.rate?.average || 0;
  const reviewCount = product?.total_reviews || product?.rate?.count || 0;

  const handleAddToCart = () => {
    if (!selectedVariation) return;
    if (selectedVariation.stock <= 0) {
      showToast(t('outOfStock'), 'error');
      return;
    }
    addToCart(selectedVariation.id);
    onAddToCart?.(selectedVariation.id);
  };

  const handleIncrease = () => {
    if (!cartItem || !selectedVariation) return;
    updateItemMutation.mutate({
      id: cartItem.id,
      quantity: cartItem.quantity + 1
    });
  };

  const handleDecrease = () => {
    if (!cartItem || !selectedVariation) return;
    if (cartItem.quantity > 1) {
      updateItemMutation.mutate({
        id: cartItem.id,
        quantity: cartItem.quantity - 1
      });
    }
  };

  const handleWishlist = () => {
    toggleWishlist();
    onAddToWishlist?.();
  };

  return (
    <div className={`flex flex-col gap-6 ${className}`}>
      {/* Badge */}
      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-primary/10 text-primary w-fit">
        {t('newRelease')}
      </span>

      {/* Title */}
      <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-white leading-tight">
        {product.name}
      </h1>

      <div className="flex items-center gap-4">
        <div className="flex items-center">
          <div className="flex text-amber-400">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                className={`w-4 h-4 ${
                  star <= Math.floor(rating)
                    ? 'fill-amber-400 text-amber-400'
                    : star === Math.ceil(rating) && rating % 1 !== 0
                    ? 'fill-amber-400/50 text-amber-400/50'
                    : 'text-amber-400/30'
                }`}
              />
            ))}
          </div>
          <span className="ml-2 text-sm font-medium text-slate-600 dark:text-slate-400">
            {rating} ({reviewCount.toLocaleString()} {t('reviews_word')})
          </span>
        </div>
        <span className="h-4 w-px bg-slate-300 dark:bg-slate-700" />
        <span
          className={`text-sm font-medium ${
            stockStatus === 'inStock'
              ? 'text-emerald-600 dark:text-emerald-400'
              : 'text-red-600 dark:text-red-400'
          }`}
        >
          {t(stockStatus)}
        </span>
      </div>

      {/* Price */}
      <div className="flex items-baseline gap-3">
        <span className="text-4xl font-bold text-slate-900 dark:text-white">
          ${currentPrice.toFixed(2)}
        </span>
        {originalPrice && (
          <>
            <span className="text-xl text-slate-400 line-through">
              ${originalPrice.toFixed(2)}
            </span>
            <span className="px-2 py-1 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 text-xs font-bold rounded">
              {t('save', { percent: Math.round(discount) })}
            </span>
          </>
        )}
      </div>


      {/* Description */}
      <div className="space-y-4 text-slate-600 dark:text-slate-400">
        <p className="leading-relaxed">{product.description}</p>
      </div>

      {/* Variations */}
      <div className="space-y-4 py-6 border-y border-slate-200 dark:border-slate-800">
        {Object.entries(attributeGroups).map(([attributeName, values]) => {
          const selectedValue = selectedAttributes[attributeName] || values[0];
          const isColorAttribute = attributeName.toLowerCase().includes('color');

          return (
            <div key={attributeName}>
              <span className="text-sm font-semibold mb-3 block text-slate-900 dark:text-white">
                {attributeName}:{' '}
                <span className="text-slate-500 dark:text-slate-400 font-normal">
                  {selectedValue}
                </span>
              </span>
              <div className={isColorAttribute ? "flex gap-3" : "flex flex-wrap gap-2"}>
                {values.map((value) => {
                  const isSelected = selectedValue === value;
                  
                  if (isColorAttribute) {
                    // Simple color mapping - you can enhance this based on your backend data
                    const colorClass = value.toLowerCase().includes('midnight') || value.toLowerCase().includes('black')
                      ? 'bg-slate-900'
                      : value.toLowerCase().includes('silver') || value.toLowerCase().includes('gray')
                      ? 'bg-slate-300'
                      : value.toLowerCase().includes('rose') || value.toLowerCase().includes('pink')
                      ? 'bg-rose-200'
                      : value.toLowerCase().includes('red')
                      ? 'bg-red-500'
                      : value.toLowerCase().includes('blue')
                      ? 'bg-blue-500'
                      : value.toLowerCase().includes('green')
                      ? 'bg-green-500'
                      : 'bg-slate-900';

                    return (
                      <button
                        key={value}
                        onClick={() => setSelectedAttributes({ ...selectedAttributes, [attributeName]: value })}
                        className={`w-8 h-8 rounded-full ${colorClass} ring-2 ring-offset-2 dark:ring-offset-slate-900 transition-all ${
                          isSelected
                            ? 'ring-primary'
                            : 'ring-slate-200 dark:ring-slate-700 hover:ring-primary'
                        }`}
                        aria-label={`Select ${value} ${attributeName}`}
                        aria-pressed={isSelected}
                      />
                    );
                  }

                  return (
                    <button
                      key={value}
                      onClick={() => setSelectedAttributes({ ...selectedAttributes, [attributeName]: value })}
                      className={`px-4 py-2 text-sm font-medium border rounded-lg transition-colors ${
                        isSelected
                          ? 'border-primary text-primary bg-primary/5'
                          : 'border-slate-200 dark:border-slate-700 hover:border-primary'
                      }`}
                      aria-label={`Select ${value} ${attributeName}`}
                      aria-pressed={isSelected}
                    >
                      {value}
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-4">
        {isVariationInCart && cartItem ? (
          <div className="flex-1 flex items-center justify-center">
            <QuantityControls
              item={cartItem}
              onIncrease={handleIncrease}
              onDecrease={handleDecrease}
              isLoading={isUpdatingItem}
              minimize={false}
            />
          </div>
        ) : (
          <button
            onClick={handleAddToCart}
            disabled={stockStatus === 'outOfStock' || isAdding}
            className="flex-1 bg-primary hover:bg-primary/90 text-white font-bold py-4 px-8 rounded-xl flex items-center justify-center gap-2 transition-all transform active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ShoppingCart className="w-5 h-5" />
            {isAdding ? t('addingToCart') : t('addToCart')}
          </button>
        )}
        <button
          onClick={handleWishlist}
          disabled={isWishlistLoading}
          className="px-8 py-4 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center justify-center transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          aria-label={isWishlisted ? t('removeFromWishlist') : t('addToWishlist')}
        >
          {isWishlistLoading ? (
            <Loader2 className="w-5 h-5 mr-2 animate-spin text-primary" />
          ) : isWishlisted ? (
            <AiFillHeart className="w-5 h-5 mr-2 text-red-500" />
          ) : (
            <AiOutlineHeart className="w-5 h-5 mr-2 text-slate-600 dark:text-slate-400" />
          )}
          {t('wishlist')}
        </button>
      </div>
    </div>
  );
}

export default ProductInfo;



