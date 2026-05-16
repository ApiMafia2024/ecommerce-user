// Setting value types
export type SettingValue = 
  | string 
  | number 
  | boolean 
  | { original: string } // For file/image settings
  | { [locale: string]: string } // For localized settings (e.g., { en: "API Tech", ar: "المتجر الإلكتروني" })
  | string[]; // For array settings (e.g., emails, locales)

// Raw setting from API
export interface Setting {
  id: number;
  group: string;
  key: string;
  value: SettingValue;
}

// Parsed settings organized by key for easy access
export interface SettingsData {
  [key: string]: SettingValue;
}

// Helper type for settings grouped by group name
export interface SettingsByGroup {
  [group: string]: SettingsData;
}

// Common setting keys (for type safety)\
export type SettingKey = 
  | 'store_logo'
  | 'store_name'
  | 'mails'
  | 'store_phone'
  | 'store_location'
  | 'facebook'
  | 'twitter'
  | 'linkedin'
  | 'google_play_url'
  | 'apple_store_url'
  | 'availableLocales'
  | 'defaultLocale';

// Helper type for localized setting values
export interface LocalizedValue {
  [locale: string]: string;
}

// Helper to check if value is localized
export function isLocalizedValue(value: SettingValue): value is LocalizedValue {
  return typeof value === 'object' && value !== null && !Array.isArray(value) && !('original' in value);
}

// Helper to check if value is a file/image object
export function isFileValue(value: SettingValue): value is { original: string } {
  return typeof value === 'object' && value !== null && 'original' in value && typeof (value as any).original === 'string';
}

// Helper to check if value is an array
export function isArrayValue(value: SettingValue): value is string[] {
  return Array.isArray(value);
}

