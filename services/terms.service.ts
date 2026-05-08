import { apiClient } from '@/lib/api/client';
import { ApiPaginatedResponse, ApiResponse } from '@/types/api.types';
import { Category } from '@/types/category.types';
import { Term } from '@/types/terms.types';

export const termsService = {
  getAll: (params?: { page?: number; per_page?: number }) =>
    apiClient.get<ApiPaginatedResponse<Term>>('/terms', params),

  getById: (id: number) =>
    apiClient.get<ApiResponse<Term>>(`/terms/${id}`),
};