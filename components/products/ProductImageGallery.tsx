'use client';

import { useState } from 'react';
import Image from 'next/image';
import { ZoomIn, ImageIcon } from 'lucide-react';
import { Image as ProductImage } from '@/types/product.types';

interface ProductImageGalleryProps {
  images: ProductImage[];
  productName: string;
  className?: string;
}

export function ProductImageGallery({
  images,
  productName,
  className = '',
}: ProductImageGalleryProps) {
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [imageError, setImageError] = useState(false);

  const mainImage = images[selectedImageIndex] || images[0];
  const displayImages = images.slice(0, 4);
  const remainingCount = Math.max(0, images.length - 4);

  return (
    <div className={`sticky top-24 ${className}`}>
      {/* Main Image */}
      <div className="aspect-square rounded-2xl overflow-hidden bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-800 mb-4 group relative">
        {mainImage?.original && !imageError ? (
          <Image
            src={mainImage.original}
            alt={productName}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-110"
            sizes="(max-width: 1024px) 100vw, 50vw"
            onError={() => setImageError(true)}
            priority
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <ImageIcon className="w-16 h-16 text-gray-400" />
          </div>
        )}
        <div className="absolute top-4 right-4 space-y-2">
          <button
            className="w-10 h-10 bg-white/90 dark:bg-slate-900/90 backdrop-blur rounded-full flex items-center justify-center shadow-lg hover:text-primary transition-colors"
            aria-label="Zoom in on product image"
          >
            <ZoomIn className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Thumbnail Grid */}
      <div className="grid grid-cols-4 gap-4">
        {displayImages.map((image, index) => {
          const isSelected = selectedImageIndex === index;
          const isLastThumbnail = index === 3 && remainingCount > 0;

          return (
            <button
              key={index}
              onClick={() => setSelectedImageIndex(index)}
              className={`aspect-square rounded-xl overflow-hidden cursor-pointer transition-all ${
                isSelected
                  ? 'border-2 border-primary ring-2 ring-primary ring-offset-2 dark:ring-offset-slate-900'
                  : 'border border-slate-200 dark:border-slate-800 hover:border-primary'
              }`}
              aria-label={`View image ${index + 1} of ${images.length}`}
            >
              {image?.thumbnail || image?.original ? (
                <div className="relative w-full h-full">
                  <Image
                    src={image.thumbnail || image.original}
                    alt={`${productName} - View ${index + 1}`}
                    fill
                    className="object-cover"
                    sizes="(max-width: 1024px) 25vw, 12.5vw"
                  />
                  {isLastThumbnail && (
                    <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                      <span className="text-white font-bold text-lg">+{remainingCount}</span>
                    </div>
                  )}
                </div>
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-slate-100 dark:bg-slate-800">
                  <ImageIcon className="w-6 h-6 text-gray-400" />
                </div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default ProductImageGallery;

