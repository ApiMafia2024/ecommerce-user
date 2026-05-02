'use client';

import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { ProductCard } from '../ui';
import { useProducts } from '@/hooks/queries/useProducts';



export function FrequentlyBoughtTogether() {
  const t = useTranslations('Cart');
  const {data: products} = useProducts({page: 1, per_page: 8});
  return (
    <section className="mt-16 pt-12 border-t border-gray-200 dark:border-gray-800">
      <h2 className="text-2xl font-bold mb-8 text-[#181411] dark:text-white">
        {t('frequentlyBoughtTogether')}
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-[repeat(auto-fit,220px)] gap-4"
      >
        {products?.map((product) => (
          // <Link
          //   key={product.id}
          //   href={`/products/${product.id}`}
          //   className="group cursor-pointer"
          // >
          //   <div className="aspect-square bg-[#f5f2f0] dark:bg-[#3d2d1d] rounded-xl mb-4 overflow-hidden relative">
          //     <div className="absolute inset-0 bg-center bg-cover transition-transform group-hover:scale-110">
          //       <Image
          //         src={product.image}
          //         alt={product.name}
          //         fill
          //         className="object-cover"
          //         sizes="(max-width: 768px) 50vw, 25vw"
          //       />
          //     </div>
          //   </div>
          //   <h4 className="font-bold text-sm mb-1 group-hover:text-primary transition-colors text-[#181411] dark:text-white">
          //     {product.name}
          //   </h4>
          //   <p className="text-primary font-bold text-sm">${product.price.toFixed(2)}</p>
          // </Link>
          <ProductCard 
            key={`frequently-bought-together-${product.id}`}
            product={product}
          />
        ))}
      </div>
    </section>
  );
}
