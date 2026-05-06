import { ApiError, ResponseMeta } from "@/types/api.types";
import axios, { AxiosError, InternalAxiosRequestConfig } from "axios";
import { deleteCookie, getCookie } from "cookies-next";

import { routing } from "@/i18n/routing";


const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL

type SupportedLocale = (typeof routing.locales)[number];

function getLocaleFromPathname(pathname: string): SupportedLocale | undefined {
  const maybeLocale = pathname.split('/')[1];
  return routing.locales.includes(maybeLocale as never)
    ? (maybeLocale as SupportedLocale)
    : undefined;
}

function stripLocaleFromPathname(pathname: string): string {
  const locale = getLocaleFromPathname(pathname);
  if (!locale) return pathname;
  const rest = pathname.split('/').slice(2).join('/');
  return `/${rest}`;
}

function getActiveLocale(): SupportedLocale {
  if (typeof window !== 'undefined') {
    const fromPath = getLocaleFromPathname(window.location.pathname);
    if (fromPath) return fromPath;
  }

  const fromCookie = getCookie('NEXT_LOCALE');
  if (typeof fromCookie === 'string' && routing.locales.includes(fromCookie as never)) {
    return fromCookie as SupportedLocale;
  }

  return routing.defaultLocale;
}


const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  withCredentials: true, // Send cookies (including httpOnly cookies) with requests
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
})


// Request interceptor - attach auth token
axiosInstance.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // Try to get token from cookie (works for non-httpOnly cookies)
    // For httpOnly cookies, the backend should read from the cookie directly
    const token = getCookie('auth_token');
    console.log(token, "token")
    config.headers['Accept-Language'] = getActiveLocale();

    // Only set Authorization header if we can read the token
    // If token is httpOnly, backend should read from cookie (sent via withCredentials)
    if (token && typeof window !== 'undefined') {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);


// In lib/api/client.ts - response interceptor
axiosInstance.interceptors.response.use(
  (response) => response,
  (error: AxiosError<{ meta: ResponseMeta }>) => {
    if (error.response) {
      const { data } = error.response;

      if (error.response.status === 401) {
        if (typeof window === 'undefined') {
          throw new ApiError(
            data?.meta?.message || 'Unauthorized',
            data?.meta?.code || 401,
            data?.meta?.validation_errors || []
          );
        }

        // Don't redirect on auth pages that handle their own errors
        const currentPath = window.location.pathname;
        const currentPathWithoutLocale = stripLocaleFromPathname(currentPath);
        const locale = getLocaleFromPathname(currentPath) ?? getActiveLocale();

        const authPagesThatHandleErrors = [
          '/auth/login',
          '/auth/register',
          '/auth/verify',
          '/auth/forgot-password',
          '/auth/reset-password',
        ];

        const shouldRedirect = !authPagesThatHandleErrors.some(page =>
          currentPathWithoutLocale.startsWith(page)
        );

        // if (shouldRedirect) {
        //   deleteCookie('auth_token');
        //   window.location.href = `/${locale}/auth/login`;
        // }
      }

      throw new ApiError(
        data?.meta?.message || 'An error occurred',
        data?.meta?.code || error.response.status,
        data?.meta?.validation_errors || []
      );
    }

    throw new ApiError(error.message ? `Network error: ${error.message}` : 'Network error', 500);
  }
);


// API client with typed methods
export const apiClient = {
  get: <T>(url: string, params?: Record<string, unknown>) =>
    axiosInstance.get<T>(url, { params }).then((res) => res.data),

  post: <T>(url: string, data?: unknown) =>
    axiosInstance.post<T>(url, data).then((res) => res.data),

  // For multipart/form-data requests (file uploads)
  postForm: <T>(url: string, data: FormData) =>
    axiosInstance.post<T>(url, data, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }).then((res) => res.data),

  put: <T>(url: string, data?: unknown) =>
    axiosInstance.put<T>(url, data).then((res) => res.data),

  patch: <T>(url: string, data?: unknown, config?: { headers?: Record<string, string> }) =>
    axiosInstance.patch<T>(url, data, config).then((res) => res.data),

  delete: <T>(url: string) =>
    axiosInstance.delete<T>(url).then((res) => res.data),
};
export { axiosInstance };