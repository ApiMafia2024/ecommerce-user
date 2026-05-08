import { useMutation } from '@tanstack/react-query';
import { apiClient } from '@/lib/api/client';
import { ApiResponse, ApiError } from '@/types/api.types';
import { toast } from 'sonner';
import { useTranslations } from 'next-intl';

export interface PaymentRequest {
  type: 'online' | 'cash_on_delivery';
  cart_id?: number;
  location_id?: number;
  location?: {
    country: string;
    city: string;
    state: string;
    street: string;
    google_map_url: string;
  };
}

export interface PaymentResponse {
  url: string;
}

export function usePaymentMutation() {
  const t = useTranslations('Checkout');

  return useMutation({
    mutationFn: (data: PaymentRequest) =>
      apiClient.post<ApiResponse<PaymentResponse>>('/payment/pay', data),
    onSuccess: (response) => {
      const paymentUrl = response.data?.url;
      if (paymentUrl) {
        // Redirect to payment URL
        window.location.href = paymentUrl;
      } else {
        toast.error(t('paymentError') || 'Payment URL not received');
      }
    },
    onError: (error: unknown) => {
      console.error('Payment error:', error);
      let errorMessage = t('paymentFailed') || 'Payment failed. Please try again.';

      if (error instanceof ApiError) {
        if (error.message) {
          errorMessage = error.message;
        }
      } else if (error instanceof Error) {
        errorMessage = error.message;
      }

      toast.error(errorMessage);
    },
  });
}

