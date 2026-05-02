import { useQuery } from '@tanstack/react-query';
import { productsService } from '@/services/products.service';
import { extractItems } from '@/types/api.types';

export function useProducts({ page = 1, per_page = 10 }: { page?: number; per_page?: number }) {
  return useQuery({
    queryKey: ['products', page, per_page],
    queryFn: () => productsService.getAll({ page, per_page }),
    select: (response) => extractItems(response.data),
  });
}