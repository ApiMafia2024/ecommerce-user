import { apiClient } from '@/lib/api/client';
import { serverApiClient } from '@/lib/api/server-client';
import { ApiResponse } from '@/types/api.types';
import { Setting, SettingsData } from '@/types/settings.types';
import { endpoints } from '@/lib/endpoints';

// Transform array of settings into key-value map
function transformSettings(settings: Setting[]): SettingsData {
  const result: SettingsData = {};
  settings.forEach((setting) => {
    result[setting.key] = setting.value;
  });
  return result;
}

export const settingsService = {
  get: () =>
    apiClient.get<ApiResponse<Setting[]>>(endpoints.settings),
  
  // Server-side function to fetch and transform settings
  getServerSettings: async (): Promise<SettingsData> => {
    const response = await serverApiClient.get<Setting[]>(endpoints.settings);
    return transformSettings(response.data);
  },
};

