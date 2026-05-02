import { useQuery } from "@tanstack/react-query";
import { extractItems } from "@/types/api.types";
import { aboutsService } from "@/services/abouts.service";

export function useAbouts() {
  return useQuery({
    queryKey: ["abouts"],
    queryFn: () => aboutsService.getAll(),
    select: (response) => extractItems(response.data),
  });
}

