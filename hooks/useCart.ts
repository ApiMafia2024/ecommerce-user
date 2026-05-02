
import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/lib/api/client';
import { ApiResponse, extractItems } from '@/types/api.types';
import { CartItem } from '@/types/cart.types';
import { useCartMutations } from './mutations/useCartMutations';

export const useCart = () => {
  const { addMutation, isAdding } = useCartMutations();
  
  // Fetch the cart data
  const { data: items = [], isLoading } = useQuery({
    queryKey: ['cart'],
    queryFn: () => apiClient.get<ApiResponse<CartItem[]>>('/client/carts'),
    select: (response) => extractItems(response.data),
    retry: false,
  });
  const { data} = useQuery({
    queryKey: ['cart'],
    queryFn: () => apiClient.get('/client/carts'),
    retry: false,
  });


  console.log(items)
  const isInCart = (variantId: number) => {
    return items.some((item: CartItem) => item.variation.id === variantId);
  }

  return {
    items,
    isLoading,
    addToCart: (id: number) => addMutation.mutate({variation_id:id}),
    isAdding,
    isInCart,
    cartId:data?.data?.id,
    // totalItems: items.reduce((acc, item) => acc + item.quantity, 0),
  };
};