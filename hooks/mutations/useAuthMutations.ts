// Auth mutations
import { useMutation, UseMutationOptions } from "@tanstack/react-query";
import { apiClient } from "@/lib/api/client";
import { LoginFormData, RegisterFormData, ProfileUpdateFormData, ChangePasswordFormData } from "@/validations/auth.validations";
import { endpoints } from "@/lib/endpoints";
import { ApiResponse, ApiEmptyResponse, User } from "@/types/api.types";

// Define the expected response type for login
export interface LoginResponse {
    token: string;
    user: User;
}

export function useLoginMutation(
    options?: Omit<
        UseMutationOptions<ApiResponse<LoginResponse>, Error, LoginFormData>,
        "mutationFn"
    >
) {
    return useMutation({
        mutationFn: (data: LoginFormData) => 
            apiClient.post<ApiResponse<LoginResponse>>(endpoints.auth.login, data),
        ...options,
    });
}

// Logout mutation - supports single device or all devices
interface LogoutParams {
    allDevices?: boolean;
}

export function useLogoutMutation(
    options?: Omit<
        UseMutationOptions<ApiEmptyResponse, Error, LogoutParams>,
        "mutationFn"
    >
) {
    return useMutation({
        mutationFn: (params: LogoutParams = {}) => 
            apiClient.post<ApiEmptyResponse>(endpoints.auth.logout, {
                all_devices: params.allDevices ?? false,
            }),
        ...options,
    });
}

// Register mutation
export function useRegisterMutation(
    options?: Omit<
        UseMutationOptions<ApiResponse<User>, Error, RegisterFormData>,
        "mutationFn"
    >
) {
    return useMutation({
        mutationFn: (data: RegisterFormData) => 
            apiClient.post<ApiResponse<User>>(endpoints.auth.register, {
                first_name: data.first_name,
                last_name: data.last_name,
                phone: data.phone,
                email: data.email,
                password: data.password,
                password_confirmation: data.password_confirmation,
                phone_country: data.phone_country,
                terms_and_conditions: data.terms_and_conditions ? '1' : '0',
            }),
        ...options,
    });
}

// Send OTP mutation
interface SendOtpParams {
    email: string;
}

export function useSendOtpMutation(
    options?: Omit<
        UseMutationOptions<ApiEmptyResponse, Error, SendOtpParams>,
        "mutationFn"
    >
) {
    return useMutation({
        mutationFn: (params: SendOtpParams) => 
            apiClient.post<ApiEmptyResponse>(endpoints.auth.sendOtp, {
                email: params.email,
            }),
        ...options,
    });
}

// Check OTP mutation
interface CheckOtpParams {
    email: string;
    otp: string;
}

export function useCheckOtpMutation(
    options?: Omit<
        UseMutationOptions<ApiEmptyResponse, Error, CheckOtpParams>,
        "mutationFn"
    >
) {
    return useMutation({
        mutationFn: (params: CheckOtpParams) => 
            apiClient.post<ApiEmptyResponse>(endpoints.auth.checkOtp, {
                email: params.email,
                otp: params.otp,
            }),
        ...options,
    });
}


// Reset password mutation
interface ResetPasswordParams {
    email: string;
    otp: string;
    password: string;
    password_confirmation: string;
}

export function useResetPasswordMutation(
    options?: Omit<
        UseMutationOptions<ApiEmptyResponse, Error, ResetPasswordParams>,
        "mutationFn"
    >
) {
    return useMutation({
        mutationFn: (params: ResetPasswordParams) => 
                apiClient.patch<ApiEmptyResponse>(endpoints.auth.resetPassword, {
                email: params.email,
                otp: params.otp,
                password: params.password,
                password_confirmation: params.password_confirmation,
            }),
        ...options,
    });
}

// Change password mutation
export function useChangePasswordMutation(
    options?: Omit<
        UseMutationOptions<ApiEmptyResponse, Error, ChangePasswordFormData>,
        "mutationFn"
    >
) {
    return useMutation({
        mutationFn: (data: ChangePasswordFormData) => {
            // Convert to URLSearchParams for x-www-form-urlencoded format
            const params = new URLSearchParams();
            params.append('current_password', data.current_password);
            params.append('new_password', data.new_password);
            params.append('new_password_confirmation', data.new_password_confirmation);
            
            return apiClient.patch<ApiEmptyResponse>(endpoints.auth.changePassword, params.toString(), {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
            });
        },
        ...options,
    });
}

// Update profile mutation
export function useUpdateProfileMutation(
    options?: Omit<
        UseMutationOptions<ApiResponse<User>, Error, ProfileUpdateFormData>,
        "mutationFn"
    >
) {
    return useMutation({
        mutationFn: (data: ProfileUpdateFormData) => {
            const formData = new FormData();
            
            // Add _method for Laravel compatibility
            formData.append('_method', 'PUT');
            
            // Add text fields
            formData.append('first_name', data.first_name);
            formData.append('last_name', data.last_name);
            formData.append('phone', data.phone);
            formData.append('phone_country', data.phone_country);
            
            // Add image if provided
            if (data.image) {
                formData.append('image', data.image);
            }
            
            // Add locations if provided
            if (data.locations && data.locations.length > 0) {
                data.locations.forEach((location, index) => {
                    if (location.id) {
                        formData.append(`locations[${index}][id]`, location.id.toString());
                    }
                    formData.append(`locations[${index}][country]`, location.country);
                    formData.append(`locations[${index}][city]`, location.city);
                    formData.append(`locations[${index}][state]`, location.state);
                    formData.append(`locations[${index}][street]`, location.street);
                    formData.append(`locations[${index}][google_map_url]`, location.google_map_url);
                });
            }
            
            // Use postForm for FormData with multipart/form-data
            return apiClient.postForm<ApiResponse<User>>(endpoints.auth.updateProfile, formData);
        },
        ...options,
    });
}