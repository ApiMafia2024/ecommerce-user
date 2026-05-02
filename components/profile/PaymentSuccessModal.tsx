'use client';

import React from 'react';
import { Loader2, X } from 'lucide-react';
import { useTranslations } from 'next-intl';
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogAction,
} from '@/components/ui/alert-dialog';
import { AnimatedCheckmark } from './AnimatedCheckmark';
import { Button } from '@/components/ui/button';

interface PaymentSuccessModalProps {
  open: boolean;
  onClose: () => void;
  isLoading: boolean;
  isSuccess: boolean;
  error: string | null;
}

export function PaymentSuccessModal({
  open,
  onClose,
  isLoading,
  isSuccess,
  error,
}: PaymentSuccessModalProps) {
  const t = useTranslations('Checkout');

  return (
    <AlertDialog open={open}>
      <AlertDialogContent className="sm:max-w-md">
        <AlertDialogHeader>
          <div className="flex items-center justify-center mb-4">
            {isLoading && (
              <div className="flex flex-col items-center gap-4">
                <Loader2 className="w-16 h-16 animate-spin text-primary" />
                <AlertDialogTitle className="text-center">
                  {t('paymentCallback.processing')}
                </AlertDialogTitle>
                <AlertDialogDescription className="text-center">
                  {t('paymentCallback.verifying')}
                </AlertDialogDescription>
              </div>
            )}
            
            {isSuccess && !isLoading && (
              <div className="flex flex-col items-center gap-4">
                <AnimatedCheckmark size={80} />
                <AlertDialogTitle className="text-center text-green-600 dark:text-green-400">
                  {t('paymentCallback.success')}
                </AlertDialogTitle>
                <AlertDialogDescription className="text-center">
                  {t('paymentCallback.successMessage')}
                </AlertDialogDescription>
              </div>
            )}
            
            {error && !isLoading && !isSuccess && (
              <div className="flex flex-col items-center gap-4">
                <div className="w-16 h-16 rounded-full bg-red-100 dark:bg-red-900/20 flex items-center justify-center">
                  <X className="w-8 h-8 text-red-600 dark:text-red-400" />
                </div>
                <AlertDialogTitle className="text-center text-red-600 dark:text-red-400">
                  {t('paymentCallback.error')}
                </AlertDialogTitle>
                <AlertDialogDescription className="text-center">
                  {error}
                </AlertDialogDescription>
              </div>
            )}
          </div>
        </AlertDialogHeader>
        
        <AlertDialogFooter className="sm:justify-center">
          <AlertDialogAction asChild>
            <Button
              onClick={onClose}
              className="w-full sm:w-auto"
              disabled={isLoading}
            >
              {t('paymentCallback.close')}
            </Button>
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

