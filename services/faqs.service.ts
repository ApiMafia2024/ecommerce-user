import { apiClient } from "@/lib/api/client";
import { ApiPaginatedResponse, ApiResponse } from "@/types/api.types";
import { Faq } from "@/types/faqs.types";

export const faqsService = {
  getAll: () => apiClient.get<ApiPaginatedResponse<Faq>>("/faqs"),

  getById: (id: number) =>
    apiClient.get<ApiResponse<Faq>>(`/faqs/${id}`),
};

