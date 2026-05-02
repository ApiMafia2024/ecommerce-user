import { useQuery } from '@tanstack/react-query';
import { settingsService } from '@/services/settings.service';
import { SettingsData, Setting } from '@/types/settings.types';

// Transform array of settings into key-value map
function transformSettings(settings: Setting[]): SettingsData {
  const result: SettingsData = {};
  settings.forEach((setting) => {
    result[setting.key] = setting.value;
  });
  return result;
}

export function useSettings() {
  return useQuery({
    queryKey: ['settings'],
    queryFn: () => settingsService.get(),
    select: (response) => transformSettings(response.data),
    staleTime: 5 * 60 * 1000, // 5 minutes - settings rarely change
    gcTime: 10 * 60 * 1000, // 10 minutes cache time
  });
}

