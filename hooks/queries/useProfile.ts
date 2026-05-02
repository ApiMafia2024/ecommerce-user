// use profile query
import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/lib/api/client';
import { endpoints } from '@/lib/endpoints';
import { ApiResponse, ProfileUser, User } from '@/types/api.types';

export function useProfile() {
    return useQuery({
        queryKey: ['profile'],
        queryFn: () => apiClient.get<ApiResponse<ProfileUser>>(endpoints.auth.profile),
    });
}