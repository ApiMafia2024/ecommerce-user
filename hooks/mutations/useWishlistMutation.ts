import { useMutation, useQueryClient } from '@tanstack/react-query';
import { productsService } from '@/services/products.service';
import { useTranslations } from 'next-intl';
import { toast } from 'sonner';

export function useWishlistMutation() {
  const queryClient = useQueryClient();
  const t = useTranslations('ProductDetails');

  const addMutation = useMutation({
    mutationFn: (productId: number) => productsService.addToWishlist(productId),
    onSuccess: () => {
      // Invalidate wishlist queries to refetch
      queryClient.invalidateQueries({ queryKey: ['wishlist'] });
      toast.success(t('addedToWishlist'), {
        position: 'top-center',
        duration: 2000,
      });
    },
    onError: (error) => {
      console.error('Error adding to wishlist:', error);
      toast.error(t('wishlistError') || 'Failed to add to wishlist', {
        position: 'top-center',
        duration: 3000,
      });
    },
  });

  const removeMutation = useMutation({
    mutationFn: (productId: number) => productsService.removeFromWishlist(productId),
    onSuccess: () => {
      // Invalidate wishlist queries to refetch
      queryClient.invalidateQueries({ queryKey: ['wishlist'] });
      toast.success(t('removedFromWishlist') || 'Removed from wishlist', {
        position: 'top-center',
        duration: 2000,
      });
    },
    onError: (error) => {
      console.error('Error removing from wishlist:', error);
      toast.error(t('wishlistError') || 'Failed to remove from wishlist', {
        position: 'top-center',
        duration: 3000,
      });
    },
  });

  return {
    addToWishlist: addMutation.mutate,
    removeFromWishlist: removeMutation.mutate,
    isAdding: addMutation.isPending,
    isRemoving: removeMutation.isPending,
    isLoading: addMutation.isPending || removeMutation.isPending,
  };
}

