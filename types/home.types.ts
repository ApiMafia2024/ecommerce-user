import { Product } from './product.types';
import { Category } from './category.types';

export interface HeroSlide {
  id: string;
  image: string;
  imageAlt?: string;
  badge?: string;
  title: string;
  description: string;
  price?: string;
  ctaText?: string;
  ctaLink?: string;
}

export interface CategoryWithIcon extends Category {
  icon: string;
  subcategories?: Array<{
    name: string;
    link?: string;
  }>;
}


export interface ProductCardProps {
  product: Product;
  discountPercentage?: number;
  originalPrice?: number;
  onAddToCart?: (productId: number) => void;
  className?: string;
}
