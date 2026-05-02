'use client';

import { Sun, Moon } from 'lucide-react';
import { useTheme } from 'next-themes';
import { useTranslations } from 'next-intl';
import { useMemo } from 'react';

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const t = useTranslations('ThemeToggle');
  const isDark = theme === 'dark';
  const aria = useMemo(
    () => (isDark ? t('switchToLightMode') : t('switchToDarkMode')),
    [isDark, t]
  );

  return (
    <button
      onClick={() => setTheme(isDark ? 'light' : 'dark')}
      className="flex items-center justify-center w-10 h-10 rounded-lg text-[#537393] dark:text-gray-400 hover:text-primary dark:hover:text-primary hover:bg-[#f0f2f5] dark:hover:bg-[#2d3238] transition-colors"
      aria-label={aria}
      title={aria}
    >
      {isDark ? (
        <Sun className="w-5 h-5" />
      ) : (
        <Moon className="w-5 h-5" />
      )}
    </button>
  );
}

