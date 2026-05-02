'use client';

import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertCircle } from 'lucide-react';
import { useTranslations } from 'next-intl';

// ============================================
// Types
// ============================================

type ErrorBoundaryLabels = {
  title: string;
  description: string;
  tryAgain: string;
  goHome: string;
};

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
  labels?: ErrorBoundaryLabels;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

// ============================================
// Error Boundary Component
// ============================================

class ErrorBoundaryImpl extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
    };
  }

  static getDerivedStateFromError(error: Error): State {
    return {
      hasError: true,
      error,
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Log error to console in development
    if (process.env.NODE_ENV === 'development') {
      console.error('ErrorBoundary caught an error:', error, errorInfo);
    }

    // Call optional error handler
    this.props.onError?.(error, errorInfo);

    // TODO: Log to error reporting service (e.g., Sentry, LogRocket)
    // errorReportingService.logError(error, errorInfo);
  }

  handleReset = () => {
    this.setState({
      hasError: false,
      error: null,
    });
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      const labels: ErrorBoundaryLabels = this.props.labels ?? {
        title: 'Something went wrong',
        description: 'We encountered an unexpected error',
        tryAgain: 'Try Again',
        goHome: 'Go Home',
      };

      return (
        <div className="min-h-screen flex items-center justify-center bg-background-light dark:bg-background-dark p-4">
          <div className="max-w-md w-full bg-white dark:bg-[#2d3238] rounded-2xl border border-[#e8edf2] dark:border-[#3a3f45] p-8 shadow-xl">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 rounded-full bg-red-100 dark:bg-red-900/20 flex items-center justify-center shrink-0">
                <AlertCircle className="w-8 h-8 text-red-600 dark:text-red-400" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-[#0f141a] dark:text-white">
                  {labels.title}
                </h2>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {labels.description}
                </p>
              </div>
            </div>

            {process.env.NODE_ENV === 'development' && this.state.error && (
              <div className="mb-6 p-4 bg-gray-50 dark:bg-[#3a3f45] rounded-lg">
                <p className="text-xs font-mono text-red-600 dark:text-red-400 break-all">
                  {this.state.error.toString()}
                </p>
              </div>
            )}

            <div className="flex gap-3">
              <button
                onClick={this.handleReset}
                className="flex-1 bg-primary text-white font-bold py-3 px-6 rounded-xl hover:bg-primary/90 transition-colors"
              >
                {labels.tryAgain}
              </button>
              <button
                onClick={() => {
                  const locale = document?.documentElement?.lang || 'en';
                  window.location.href = `/${locale}`;
                }}
                className="flex-1 bg-gray-100 dark:bg-[#3a3f45] text-[#0f141a] dark:text-white font-bold py-3 px-6 rounded-xl hover:bg-gray-200 dark:hover:bg-[#4a4f55] transition-colors"
              >
                {labels.goHome}
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export function ErrorBoundary(props: Omit<Props, 'labels'>) {
  const t = useTranslations('ErrorBoundary');
  return (
    <ErrorBoundaryImpl
      {...props}
      labels={{
        title: t('title'),
        description: t('description'),
        tryAgain: t('tryAgain'),
        goHome: t('goHome'),
      }}
    />
  );
}

export default ErrorBoundary;
