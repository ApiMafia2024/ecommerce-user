'use client';

import React, { createContext, useContext, useMemo } from 'react';
import { SettingsData, SettingValue, isLocalizedValue, isFileValue, isArrayValue } from '@/types/settings.types';
import { useLocale } from 'next-intl';

type SettingsContextType = {
  settings: SettingsData;
  // Helper functions
  getSetting: (key: string) => SettingValue | undefined;
  getLocalizedSetting: (key: string, locale?: string) => string | undefined;
  getStringSetting: (key: string) => string | undefined;
  getArraySetting: (key: string) => string[] | undefined;
  getFileSetting: (key: string) => string | undefined;
  // Computed values
  siteLogo: string | undefined;
  siteName: string | undefined;
  phone: string | undefined;
  officeLocation: string | undefined;
  emails: string[];
  github: string | undefined;
  twitter: string | undefined;
  linkedin: string | undefined;
  googlePlayUrl: string | undefined;
  appleStoreUrl: string | undefined;
};

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export function SettingsProvider({ 
  children, 
  initialSettings 
}: { 
  children: React.ReactNode;
  initialSettings: SettingsData;
}) {
  const locale = useLocale();
  console.log(initialSettings, "IS")
  const value = useMemo<SettingsContextType>(() => {
    // Helper to get setting by key
    const getSetting = (key: string): SettingValue | undefined => {
      return initialSettings[key];
    };

    // Helper to get localized setting (e.g., site_name with en/ar)
    const getLocalizedSetting = (key: string, targetLocale?: string): string | undefined => {
      const value = initialSettings[key];
      if (!value) return undefined; 
      
      if (isLocalizedValue(value)) {
        const loc = targetLocale || locale;
        return value[loc as keyof typeof value] 
      }
      
      if (typeof value === 'string') {
        return value;
      }
      
      return undefined;
    };

    // Helper to get string setting
    const getStringSetting = (key: string): string | undefined => {
      const value = initialSettings[key];
      if (typeof value === 'string') return value;
      return undefined;
    };

    // Helper to get array setting
    const getArraySetting = (key: string): string[] | undefined => {
      const value = initialSettings[key];
      if (isArrayValue(value)) return value;
      return undefined;
    };

    // Helper to get file setting (returns the original URL)
    const getFileSetting = (key: string): string | undefined => {
      const value = initialSettings[key];
      if (isFileValue(value)) return value.original;
      return undefined;
    };

    // Computed values
    const siteLogo = getFileSetting('site_logo');
    const siteName = getLocalizedSetting('site_name');
    const phone = getStringSetting('phone');
    const officeLocation = getStringSetting('office_location');
    const emails = getArraySetting('mails') || [];
    const github = getStringSetting('github');
    const twitter = getStringSetting('twitter');
    const linkedin = getStringSetting('linkedin');
    const googlePlayUrl = getStringSetting('google_play_url');
    const appleStoreUrl = getStringSetting('apple_store_url');

    return {
      settings: initialSettings,
      getSetting,
      getLocalizedSetting,
      getStringSetting,
      getArraySetting,
      getFileSetting,
      siteLogo,
      siteName,
      phone,
      officeLocation,
      emails,
      github,
      twitter,
      linkedin,
      googlePlayUrl,
      appleStoreUrl,
    };
  }, [initialSettings, locale]);

  return (
    <SettingsContext.Provider value={value}>
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettingsContext() {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error('useSettingsContext must be used within SettingsProvider');
  }
  return context;
}

