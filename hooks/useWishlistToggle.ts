import { useMemo } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useWishlist } from '@/hooks/queries/useWishlist';
import { useWishlistMutation } from '@/hooks/mutations/useWishlistMutation';
import {
  getWishlistFromStorage,
  addToWishlistStorage,
  removeFromWishlistStorage,
  isInWishlistStorage,
} from '@/lib/utils/wishlist-storage';

interface UseWishlistToggleReturn {
  isWishlisted: boolean;
  toggleWishlist: () => void;
  isLoading: boolean;
}

export function useWishlistToggle(productId: number): UseWishlistToggleReturn {
  const { isAuthenticated } = useAuth();
  const { data: wishlistData } = useWishlist(1, isAuthenticated);
  const { addToWishlist, removeFromWishlist, isLoading: isMutationLoading } = useWishlistMutation();

  // Check if product is in wishlist
  const isWishlisted = useMemo(() => {
    if (isAuthenticated && wishlistData?.items) {
      // Check API wishlist
      return wishlistData.items.some((item) => item.id === productId);
    } else {
      // Check localStorage
      return isInWishlistStorage(productId);
    }
  }, [isAuthenticated, wishlistData, productId]);

  const toggleWishlist = () => {
    if (isAuthenticated) {
      // Use API mutation
      if (isWishlisted) {
        removeFromWishlist(productId);
      } else {
        addToWishlist(productId);
      }
    } else {
      // Use localStorage
      if (isWishlisted) {
        removeFromWishlistStorage(productId);
      } else {
        addToWishlistStorage(productId);
      }
    }
  };

  return {
    isWishlisted,
    toggleWishlist,
    isLoading: isMutationLoading,
  };
}

