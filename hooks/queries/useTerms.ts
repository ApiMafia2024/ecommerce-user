import { useQuery } from '@tanstack/react-query';
import { extractItems } from '@/types/api.types';
import { categoriesService } from '@/services/categories.service';
import { termsService } from '@/services/terms.service';

export function useTerms({ page = 1, per_page = 10 }: { page?: number; per_page?: number }) {
  return useQuery({
    queryKey: ['terms', page, per_page],
    queryFn: () => termsService.getAll({ page, per_page }),
    select: (response) => extractItems(response.data),
  });
}