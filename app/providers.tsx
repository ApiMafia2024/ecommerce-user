'use client';

import { ThemeProvider } from 'next-themes';
import { ReactQueryProvider } from './providers/ReactQueryProvicer';
import { AuthProvider } from '@/contexts/AuthContext';
import { ToastProvider } from '@/components/ui';
import { ErrorBoundary } from '@/components/shared/ErrorBoundary';
import { LocaleSwitchProvider } from '@/contexts/LocaleSwitchContext';
import { GlobalLoadingProvider, useGlobalLoading } from '@/contexts/GlobalLoadingContext';
import { SettingsProvider } from '@/contexts/SettingsContext';
import GlobalLoadingOverlay from '@/components/shared/GlobalLoadingOverlay';
import { SettingsData } from '@/types/settings.types';
import { Toaster } from 'sonner';

function GlobalLoader() {
  const { visible } = useGlobalLoading();
  return <GlobalLoadingOverlay visible={visible} />;
}

export function Providers({ 
  children, 
  initialSettings 
}: { 
  children: React.ReactNode;
  initialSettings: SettingsData;
}) {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange={false}>
      <GlobalLoadingProvider>
        <ErrorBoundary>
          <LocaleSwitchProvider>
            <ReactQueryProvider>
              <SettingsProvider initialSettings={initialSettings}>
                <ToastProvider>
                <AuthProvider>
                  <Toaster position="top-center" />
                    {children}
                </AuthProvider>
                </ToastProvider>
              </SettingsProvider>
            </ReactQueryProvider>
          </LocaleSwitchProvider>
          <GlobalLoader />
        </ErrorBoundary>
      </GlobalLoadingProvider>
    </ThemeProvider>
  );
}

