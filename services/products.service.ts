import { apiClient } from '@/lib/api/client';
import { ApiPaginatedResponse, ApiResponse } from '@/types/api.types';
import { Product } from '@/types/product.types';
import { WishlistData } from '@/types/wishlist.types';

export const productsService = {
  getAll: (params?: { page?: number; per_page?: number }) =>
    apiClient.get<ApiPaginatedResponse<Product>>('/products', params),

  getById: (id: number) =>
    apiClient.get<ApiResponse<Product>>(`/products/${id}`),

  getWishlist: (params?: { page?: number }) =>
    apiClient.get<ApiResponse<WishlistData>>('/products/wishlist', params),

  addToWishlist: (productId: number) =>
    apiClient.post<ApiResponse<{ message: string }>>(`/products/${productId}/wishlist`),

  removeFromWishlist: (productId: number) =>
    apiClient.post<ApiResponse<{ message: string }>>(`/products/${productId}/wishlist`),
};