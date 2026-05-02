'use client';

import Image from 'next/image';
import { Trash2, Minus, Plus, ImageIcon } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { CartItem as CartItemType } from '@/types/cart.types';
import QuantityControls from './QuantityControls';
import { useCartMutations } from '@/hooks/mutations/useCartMutations';
// import { CartItem } from '@/types/cart.types';



export function CartItem({item}: {item: CartItemType}) {
  const t = useTranslations('Cart');
  const {updateItemMutation, removeItemMutation, isUpdatingItem} = useCartMutations();
  
  // // Format variant details for display
  const variantText = item
    ? Object.entries(item)
        .filter(([_, value]) => value)
        .map(([key, value]) => {
          const label = key.charAt(0).toUpperCase() + key.slice(1);
          return `${label}: ${value}`;
        })
        .join(' | ')
    : '';

  const handleDecrease = () => {
    console.log('decrease');
    updateItemMutation.mutate({id: item.id, quantity: item.quantity - 1});
  };
  const handleIncrease = () => {
    console.log('increase');
    updateItemMutation.mutate({id: item.id, quantity: item.quantity + 1});
  };
  const handleRemove = () => {
    console.log('remove');
    removeItemMutation.mutate({id: item.id});
  };
  return (
    <div className="flex flex-col md:flex-row gap-6 p-6 bg-white dark:bg-background-dark/40 border border-gray-100 dark:border-gray-800 rounded-xl shadow-sm hover:shadow-md transition-shadow">
      {/* Product Image */}
      <div className="w-full md:w-32 aspect-square bg-center bg-no-repeat bg-cover rounded-lg shrink-0 relative overflow-hidden">
        {/* <Image
          src={item}
          alt={name}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, 128px"
        /> */}
        <ImageIcon className="w-10 h-10 text-gray-400" />
      </div>

      {/* Product Details */}
      <div className="flex flex-1 flex-col justify-between py-1">
        <div className="flex justify-between items-start gap-4">
          <div>
            <h3 className="text-lg font-bold mb-1 text-[#181411] dark:text-white">Name</h3>
            {variantText && (
              <p className="text-sm text-[#8a7560] dark:text-gray-400">{variantText}</p>
            )}
            <p className="text-primary font-bold mt-2">${item?.price?.toFixed(2)}</p>
          </div>
          <button
            className="p-2 cursor-pointer text-[#8a7560] hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-lg transition-colors"
            aria-label={t('removeItem', { name: "Name" })}
            onClick={handleRemove}
            disabled={isUpdatingItem}
          >
            <Trash2 className="w-5 h-5 " />
          </button>
        </div>

        {/* Quantity Controls and Total */}
            <QuantityControls  item={item} onDecrease={handleDecrease} onIncrease={handleIncrease} isLoading={isUpdatingItem}/>
      </div>
    </div>
  );
}


export default CartItem;