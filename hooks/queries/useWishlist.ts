import { useQuery } from '@tanstack/react-query';
import { productsService } from '@/services/products.service';

export function useWishlist(page = 1, enabled = true) {
  return useQuery({
    queryKey: ['wishlist', page],
    queryFn: () => productsService.getWishlist({ page }),
    select: (response) => ({
      items: response.data.items,
      pagination: response.data.pagination,
    }),
    enabled,
  });
}
