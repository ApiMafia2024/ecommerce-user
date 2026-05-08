import { apiClient } from "@/lib/api/client";
import { ApiPaginatedResponse, ApiResponse } from "@/types/api.types";
import { About } from "@/types/abouts.types";

export const aboutsService = {
  getAll: () => apiClient.get<ApiPaginatedResponse<About>>("/abouts"),

  getById: (id: number) =>
    apiClient.get<ApiResponse<About>>(`/abouts/${id}`),
};

