import { apiClient } from "@/lib/api/client";
import { endpoints } from "@/lib/endpoints";
import { ApiResponse } from "@/types/api.types";
import { useMutation } from "@tanstack/react-query";

interface GoogleLoginResponse {
    url: string;
}
export function useGoogleAuth() {
    return useMutation({
        mutationFn: () => {
            return apiClient.get<ApiResponse<GoogleLoginResponse>>(endpoints.auth.googleLogin);
        },
        onSuccess: (response) => {
            console.log(response);
            window.location.href = response.data?.url;
        },
        onError: (error) => {
            console.error(error);
        },
    });
}