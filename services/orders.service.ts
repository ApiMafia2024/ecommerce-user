import { apiClient } from '@/lib/api/client';
import { ApiResponse } from '@/types/api.types';
import { Order } from '@/types/order.types';

export const ordersService = {
  getAll: () =>
    apiClient.get<ApiResponse<Order[]>>('/orders'),

  getById: (id: number) =>
    apiClient.get<ApiResponse<Order>>(`/orders/${id}`),
};
