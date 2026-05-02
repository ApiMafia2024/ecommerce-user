import { apiClient } from "@/lib/api/client";
import { ApiPaginatedResponse, ApiResponse } from "@/types/api.types";
import { About } from "@/types/abouts.types";

export const aboutsService = {
  getAll: () => apiClient.get<ApiPaginatedResponse<About>>("/client/abouts"),

  getById: (id: number) =>
    apiClient.get<ApiResponse<About>>(`/client/abouts/${id}`),
};

