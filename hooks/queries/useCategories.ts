import { useQuery } from '@tanstack/react-query';
import { extractItems } from '@/types/api.types';
import { categoriesService } from '@/services/categories.service';

export function useCategories({ page = 1, per_page = 10 }: { page?: number; per_page?: number }) {
  return useQuery({
    queryKey: ['categories', page, per_page],
    queryFn: () => categoriesService.getAll({ page, per_page }),
    select: (response) => extractItems(response.data),
  });
}