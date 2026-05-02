import { apiClient } from '@/lib/api/client';
import { ApiPaginatedResponse, ApiResponse } from '@/types/api.types';
import { Category } from '@/types/category.types';

export const categoriesService = {
  getAll: (params?: { page?: number; per_page?: number }) =>
    apiClient.get<ApiPaginatedResponse<Category>>('/client/categories', params),

  getById: (id: number) =>
    apiClient.get<ApiResponse<Category>>(`/client/categories/${id}`),
};