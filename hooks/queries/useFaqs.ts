import { useQuery } from "@tanstack/react-query";
import { extractItems } from "@/types/api.types";
import { faqsService } from "@/services/faqs.service";

export function useFaqs() {
  return useQuery({
    queryKey: ["faqs"],
    queryFn: () => faqsService.getAll(),
    select: (response) => extractItems(response.data),
  });
}

