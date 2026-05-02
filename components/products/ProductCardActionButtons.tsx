import { useCart } from '@/hooks/useCart'
import { productStatusTypes, Variation } from '@/types/product.types'
import { Loader2 } from 'lucide-react'
import { useTranslations } from 'next-intl'
import React, { useMemo } from 'react'
import QuantityControls from '../cart/QuantityControls'
import { CartItem } from '@/types/cart.types'
import { useCartMutations } from '@/hooks/mutations/useCartMutations'

const ProductCardActionButtons = ({defaultVariant}: {defaultVariant: Variation}) => {
    const stock = defaultVariant?.stock ?? 0
    const productStatus: productStatusTypes = stock > 0 ? 'inStock' :  defaultVariant?.notify_me ?? false ? 'notifyMe' : 'outOfStock'
    const { addToCart, isAdding, isInCart ,items} = useCart()
    const t = useTranslations('ProductDetails')
    const itemFromCart = useMemo(() => items.find((item) => item.variation.id === defaultVariant.id), [items, defaultVariant.id])
    const { updateItemMutation, isUpdatingItem } = useCartMutations()
    const handleIncrease = () => {
        updateItemMutation.mutate({id: defaultVariant.id, quantity: itemFromCart?.quantity ? itemFromCart.quantity + 1 : 1})
    }
    const handleDecrease = () => {
        updateItemMutation.mutate({id: defaultVariant.id, quantity: itemFromCart?.quantity ? itemFromCart.quantity - 1 : 1})
    }

    if (isInCart(defaultVariant.id)) {
        console.log(defaultVariant, "DEFAULT VARIANT");
        const item = items.find((item) => item.variation.id === defaultVariant.id)
return <button className='w-full h-[34px] flex items-center justify-center py-2 bg-gray-100 cursor-pointer dark:bg-[#3a3f45] hover:text-white transition-colors duration-300 rounded-lg text-xs font-normal text-primary border border-primary dark:text-gray-200 '>
            <QuantityControls 
            isLoading={isUpdatingItem}
            item={item as CartItem}
            minimize={true}
            onDecrease={handleDecrease}
            onIncrease={handleIncrease}
            />
        </button>
    }

    switch (productStatus) {
    case 'inStock':
        return <button
        disabled={isAdding}
        onClick={() => addToCart(defaultVariant.id)}
        className='w-full py-2 bg-gray-100 cursor-pointer flex items-center justify-center dark:bg-[#3a3f45] hover:bg-primary hover:text-white dark:hover:bg-primary transition-colors duration-300 rounded-lg text-xs font-normal text-primary border border-primary dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2'
        >
            {isAdding ? 
            <>
            {t('addingToCart')}
            &nbsp;
            <Loader2 className='w-4 h-4 animate-spin' /> 
            </>
            : t('addToCart')}
        </button>
            case 'notifyMe':
        return <button className='w-full py-2 bg-gray-100 cursor-pointer dark:bg-[#3a3f45] hover:bg-primary hover:text-white dark:hover:bg-primary transition-colors duration-300 rounded-lg text-xs font-normal text-primary border border-primary dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2'>{t('notifyMe')}</button>
        case 'outOfStock':
        return <button className='w-full py-2 bg-gray-100 dark:bg-[#3a3f45] cursor-not-allowed transition-colors duration-300 rounded-lg text-xs font-normal text-red-500  border border-red-500 dark:text-gray-200'>{t('outOfStock')}</button>
    default:
        return <button className='w-full py-2 bg-gray-100 cursor-pointer dark:bg-[#3a3f45] hover:bg-red-500 hover:text-white dark:hover:bg-primary transition-colors duration-300 rounded-lg text-xs font-normal text-red-500  border border-red-500 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2'>{t('notAvailable')}</button>
  }
}

export default ProductCardActionButtons