import axios, { AxiosError } from 'axios';
import { ApiError, ResponseMeta, ApiResponse } from '@/types/api.types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

// Server-side axios instance without browser dependencies
const serverAxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

// Response interceptor for error handling
serverAxiosInstance.interceptors.response.use(
  (response) => response,
  (error: AxiosError<{ meta: ResponseMeta }>) => {
    if (error.response) {
      const { data } = error.response;
      throw new ApiError(
        data?.meta?.message || 'An error occurred',
        data?.meta?.code || error.response.status,
        data?.meta?.validation_errors || []
      );
    }
    throw new ApiError('Network error', 500);
  }
);

// Server-side API client for use in route handlers
export const serverApiClient = {
  get: async <T>(url: string, params?: Record<string, unknown>): Promise<ApiResponse<T>> => {
    const response = await serverAxiosInstance.get<ApiResponse<T>>(url, { params });
    return response.data;
  },

  post: async <T>(url: string, data?: unknown): Promise<ApiResponse<T>> => {
    const response = await serverAxiosInstance.post<ApiResponse<T>>(url, data);
    return response.data;
  },

  put: async <T>(url: string, data?: unknown): Promise<ApiResponse<T>> => {
    const response = await serverAxiosInstance.put<ApiResponse<T>>(url, data);
    return response.data;
  },

  patch: async <T>(url: string, data?: unknown): Promise<ApiResponse<T>> => {
    const response = await serverAxiosInstance.patch<ApiResponse<T>>(url, data);
    return response.data;
  },

  delete: async <T>(url: string): Promise<ApiResponse<T>> => {
    const response = await serverAxiosInstance.delete<ApiResponse<T>>(url);
    return response.data;
  },
};

