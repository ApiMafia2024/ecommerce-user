import { useQuery } from '@tanstack/react-query';
import { productsService } from '@/services/products.service';

export function useProduct(id: number | null) {
  const enabled = id != null && Number.isFinite(id);
  return useQuery({
    queryKey: ['product', id],
    queryFn: () => productsService.getById(id!),
    select: (response) => response.data,
    enabled,
  });
}

