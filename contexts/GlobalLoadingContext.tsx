'use client';

import React, { createContext, useCallback, useContext, useMemo, useState } from 'react';

type GlobalLoadingApi = {
  visible: boolean;
  acquire: () => () => void;
};

const GlobalLoadingContext = createContext<GlobalLoadingApi | null>(null);

export function GlobalLoadingProvider({ children }: { children: React.ReactNode }) {
  const [count, setCount] = useState(0);

  const acquire = useCallback(() => {
    setCount((c) => c + 1);
    let released = false;

    return () => {
      if (released) return;
      released = true;
      setCount((c) => (c > 0 ? c - 1 : 0));
    };
  }, []);

  const value = useMemo<GlobalLoadingApi>(() => {
    return { visible: count > 0, acquire };
  }, [acquire, count]);

  return (
    <GlobalLoadingContext.Provider value={value}>
      {children}
    </GlobalLoadingContext.Provider>
  );
}

export function useGlobalLoading() {
  const ctx = useContext(GlobalLoadingContext);
  if (!ctx) {
    // Return a safe default implementation when provider is not available
    // This can happen with Next.js route-level loading.tsx files
    return {
      visible: false,
      acquire: () => () => {}, // No-op release function
    };
  }
  return ctx;
}

