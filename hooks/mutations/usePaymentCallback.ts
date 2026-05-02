import { useMutation } from '@tanstack/react-query';
import { apiClient } from '@/lib/api/client';
import { ApiResponse, ApiError } from '@/types/api.types';
import { endpoints } from '@/lib/endpoints';

export interface PaymentCallbackRequest {
  transaction_id: string;
}

export interface PaymentCallbackResponse {
  success: boolean;
  message?: string;
}

export function usePaymentCallback() {
  return useMutation({
    mutationFn: (data: PaymentCallbackRequest) =>
      apiClient.post<ApiResponse<PaymentCallbackResponse>>(
        endpoints.payment.callback,
        data
      ),
    onError: (error: unknown) => {
      console.error('Payment callback error:', error);
    },
  });
}

