import { Loader2, Minus, Plus } from 'lucide-react';
import { useTranslations } from 'next-intl';
import React from 'react'
import { CartItem as CartItemType } from '@/types/cart.types';
import { cn } from '@/lib/utils';

const QuantityControls = ({item, onDecrease, onIncrease, isLoading,  minimize = false}: {item: CartItemType, onDecrease: () => void, onIncrease: () => void, isLoading: boolean,  minimize?: boolean}) => {
    const t = useTranslations('Cart');
    const totalPrice = item.price * item.quantity;
  return (
    <div className={cn("flex items-center justify-between", minimize ? "mt-0" : "mt-6")}>
    <div className={cn("button-group flex items-center gap-3 bg-[#f5f2f0] dark:bg-[#3d2d1d] rounded-lg p-1", {
      'bg-transparent': minimize,
      'p-0': minimize,
    })}>
      <button
        className={cn("size-8 flex items-center justify-center rounded-md bg-white dark:bg-background-dark shadow-sm hover:text-primary transition-colors", {
          'size-6': minimize,
          'bg-transparent shadow-none': minimize,
        })}
        aria-label={t('decreaseQuantity')}
        onClick={onDecrease}
        disabled={isLoading}
      >
        <Minus className="w-4 h-4 text-primary cursor-pointer" />
      </button>
      <span className="w-8 text-center font-bold text-[#181411] dark:text-white">
        
        {isLoading ? <Loader2 className="w-6 h-6 mx-auto animate-spin" /> : item?.quantity}</span>
      <button
        className={cn("size-8 flex items-center justify-center rounded-md bg-white dark:bg-background-dark shadow-sm hover:text-primary transition-colors", {
          'size-6': minimize,
          'bg-transparent shadow-none': minimize,
        })}
        aria-label={t('increaseQuantity')}
        onClick={onIncrease}
        disabled={isLoading}
      >
        <Plus className="w-4 h-4 text-primary cursor-pointer" />
      </button>
    </div>
    {!minimize && <p className="text-lg font-black text-[#181411] dark:text-white">${totalPrice.toFixed(2)}</p>}
  </div>
  )
};

export default QuantityControls;