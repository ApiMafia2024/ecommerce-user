'use client';

import { createContext, useContext, useCallback, useMemo, useEffect, useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { getCookie, setCookie, deleteCookie } from 'cookies-next';
import { apiClient } from '@/lib/api/client';
import { endpoints } from '@/lib/endpoints';
import { User, ApiResponse } from '@/types/api.types';
import { useToast } from '@/components/ui';
import { useTranslations } from 'next-intl';
import { toast } from 'sonner';
import { CheckIcon, Loader2Icon } from 'lucide-react';
import SuccessIcon from '@/components/shared/SuccessIcon';
import { getWishlistFromStorage } from '@/lib/utils/wishlist-storage';
import { productsService } from '@/services/products.service';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (token: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const queryClient = useQueryClient();
  // Check if token exists to determine if we should fetch profile
  const hasToken = typeof window !== 'undefined' && !!getCookie('auth_token');
  const { showToast } = useToast();
  const t = useTranslations('Auth');
  // Fetch user profile when token exists
  const { data, isLoading, isError } = useQuery({
    queryKey: ['profile'],
    queryFn: () => apiClient.get<ApiResponse<User>>(endpoints.auth.profile),
    enabled: hasToken,
    retry: false,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  const user = data?.data ?? null;
  const isAuthenticated = !!user && !isError;

  // Sync localStorage wishlist to API when user logs in
  useEffect(() => {
    if (!isAuthenticated || !user) return;

    const syncWishlistToAPI = async () => {
      try {
        const localStorageWishlist = getWishlistFromStorage();
        if (localStorageWishlist.length === 0) return;

        // Add all localStorage items to API wishlist
        // Note: This will add items that might already be in the wishlist, but the API should handle duplicates
        const syncPromises = localStorageWishlist.map((productId) =>
          productsService.addToWishlist(productId).catch((error) => {
            // Silently fail for individual items - they might already be in wishlist
            console.log(`Product ${productId} might already be in wishlist:`, error);
            return null;
          })
        );

        await Promise.allSettled(syncPromises);
        
        // Invalidate wishlist query to refetch with synced data
        queryClient.invalidateQueries({ queryKey: ['wishlist'] });
      } catch (error) {
        console.error('Error syncing wishlist to API:', error);
      }
    };

    // Sync after a short delay to ensure user is fully authenticated
    const timeoutId = setTimeout(syncWishlistToAPI, 500);
    return () => clearTimeout(timeoutId);
  }, [isAuthenticated, user, queryClient]);

  // Handle Google OAuth success - detect flag cookie and trigger profile fetch
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const checkGoogleAuthComplete = () => {
      const googleAuthComplete = getCookie('google_auth_complete');
      if (googleAuthComplete === 'true') {
        // Clear the flag cookie
        deleteCookie('google_auth_complete');
        toast.success(t('login.googleSuccess'), {
          position: "top-center",
          className: "bg-green-500 text-white",
          duration: 5000,
          icon: <SuccessIcon />,
        });
        // showToast(t('login.googleSuccess'), 'success', 5000);
        // Trigger profile fetch - token is already in cookie
        queryClient.fetchQuery({
          queryKey: ['profile'],
          queryFn: () => apiClient.get<ApiResponse<User>>(endpoints.auth.profile),
        });
      }
    };

    // Check immediately
    checkGoogleAuthComplete();

    // Also check after a short delay in case cookie wasn't available yet
    const timeoutId = setTimeout(() => {
      checkGoogleAuthComplete();
    }, 100);

    return () => {
      clearTimeout(timeoutId);
    };
  }, [queryClient, showToast, t]);



  const login = useCallback((token: string) => {
    // Set the auth cookie
    setCookie('auth_token', token, {
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });

    // Fetch the profile query to get user data
    // Using fetchQuery ensures it fetches regardless of the enabled state
    queryClient.fetchQuery({
      queryKey: ['profile'],
      queryFn: () => apiClient.get<ApiResponse<User>>(endpoints.auth.profile),
    });
  }, [queryClient]);

  const logout = useCallback(() => {
    // Clear the auth cookie
    deleteCookie('auth_token');
    
    // Clear all queries and reset the cache (this clears API wishlist cache)
    // localStorage wishlist is preserved for when user returns
    queryClient.clear();
    
    // Redirect to login
    const locale = document?.documentElement?.lang || 'en';
    window.location.href = `/${locale}/auth/login`;
  }, [queryClient]);

  const value = useMemo(() => ({
    user,
    isAuthenticated,
    isLoading: hasToken ? isLoading : false,
    login,
    logout,
  }), [user, isAuthenticated, isLoading, hasToken, login, logout]);

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

