'use client';

import React, { createContext, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { useGlobalLoading } from './GlobalLoadingContext';

type SupportedLocale = 'en' | 'ar';

type LocaleSwitchState = {
  isLocaleSwitching: boolean;
  switchToken: number;
  targetLocale?: SupportedLocale;
};

type LocaleSwitchApi = LocaleSwitchState & {
  startLocaleSwitch: (targetLocale: SupportedLocale) => void;
  endLocaleSwitch: () => void;
};

const LocaleSwitchContext = createContext<LocaleSwitchApi | null>(null);

export function LocaleSwitchProvider({ children }: { children: React.ReactNode }) {
  const { acquire } = useGlobalLoading();
  const loadingLockRef = useRef<null | (() => void)>(null);
  const [state, setState] = useState<LocaleSwitchState>({
    isLocaleSwitching: false,
    switchToken: 0,
    targetLocale: undefined,
  });

  const value = useMemo<LocaleSwitchApi>(() => {
    return {
      ...state,
      startLocaleSwitch: (targetLocale) => {
        if (!loadingLockRef.current) {
          loadingLockRef.current = acquire();
        }
        setState((prev) => ({
          isLocaleSwitching: true,
          switchToken: prev.switchToken + 1,
          targetLocale,
        }));
      },
      endLocaleSwitch: () => {
        if (loadingLockRef.current) {
          loadingLockRef.current();
          loadingLockRef.current = null;
        }
        setState((prev) => ({
          ...prev,
          isLocaleSwitching: false,
          targetLocale: undefined,
        }));
      },
    };
  }, [acquire, state]);

  useEffect(() => {
    return () => {
      if (loadingLockRef.current) {
        loadingLockRef.current();
        loadingLockRef.current = null;
      }
    };
  }, []);

  return (
    <LocaleSwitchContext.Provider value={value}>
      {children}
    </LocaleSwitchContext.Provider>
  );
}

export function useLocaleSwitch() {
  const ctx = useContext(LocaleSwitchContext);
  if (!ctx) {
    throw new Error('useLocaleSwitch must be used within LocaleSwitchProvider');
  }
  return ctx;
}

