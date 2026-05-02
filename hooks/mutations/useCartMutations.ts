import { apiClient } from "@/lib/api/client";
import { endpoints } from "@/lib/endpoints";
import { ApiResponse } from "@/types/api.types";
import { CartItem } from "@/types/cart.types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useTranslations } from "next-intl";

export const useCartMutations = () => {
  const queryClient = useQueryClient();
  const t = useTranslations('Cart');
  const addMutation = useMutation({
    mutationFn: ({variation_id, quantity = 1}: {variation_id: number, quantity?: number}) => apiClient.post<ApiResponse<CartItem>>(endpoints.cart.add, { variation_id: variation_id, quantity: quantity }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cart'] });
      toast.success(t('toast.addedToCartSuccess'));
    },
    // onMutate: async (newId) => {
    //   // Cancel outgoing refetches so they don't overwrite our optimistic update
    //   await queryClient.cancelQueries({ queryKey: ['cart'] });

    //   // Snapshot the previous value
    //   const previousCart = queryClient.getQueryData(['cart']);
    //   console.log(previousCart, "PREVIOUS CART");
    //   // Optimistically update the cache
    //   queryClient.setQueryData(['cart'], (old: CartItem[]) => [...old, { id: newId, quantity: 1 }]);
    //   console.log(queryClient.getQueryData(['cart']), "CART");
    //   return { previousCart };
    // },
    onError: () => {
      // Rollback to the previous state if the server fails
      // queryClient.setQueryData(['cart'], context?.previousCart);
      toast.error(t('toast.addToCartError'));
    },
    // onSettled: () => {
    //   queryClient.invalidateQueries({ queryKey: ['cart'] });
    // },
  });
  const updateItemMutation = useMutation({
    mutationFn: ({id, quantity}: {id: number, quantity: number}) => apiClient.put<ApiResponse<CartItem>>(endpoints.cart.updateItem(id), { quantity: quantity }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cart'] });
      toast.success(t('toast.itemUpdatedSuccess'));
    },
  });
  const removeItemMutation = useMutation({
    mutationFn: ({id}: {id: number}) => apiClient.delete<ApiResponse<CartItem>>(endpoints.cart.removeItem(id)),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cart'] });
      toast.success(t('toast.itemRemovedSuccess'));
    },
  });
  const clearCartMutation = useMutation({
    mutationFn: () => apiClient.delete<ApiResponse<CartItem>>(endpoints.cart.clear),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cart'] });
      toast.success(t('toast.cartClearedSuccess'));
    },
  });

  const isUpdatingItem = updateItemMutation.isPending
  return { 
    addMutation,
    isAdding: addMutation.isPending,
    updateItemMutation,
    removeItemMutation,
    clearCartMutation,
    isUpdatingItem
   };
};
