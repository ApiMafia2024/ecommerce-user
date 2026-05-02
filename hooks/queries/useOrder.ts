import { useQuery } from '@tanstack/react-query';
import { ordersService } from '@/services/orders.service';

export function useOrder(id: number | null) {
  const enabled = id != null && Number.isFinite(id);
  return useQuery({
    queryKey: ['order', id],
    queryFn: () => ordersService.getById(id!),
    select: (response) => response.data,
    enabled,
  });
}
