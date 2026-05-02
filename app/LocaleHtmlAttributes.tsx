// 'use client';

// import { useEffect } from 'react';
// import { usePathname } from 'next/navigation';

// import { routing } from '@/i18n/routing';

// type SupportedLocale = (typeof routing.locales)[number];

// function getLocaleFromPathname(pathname: string): SupportedLocale {
//   const maybeLocale = pathname.split('/')[1];
//   return routing.locales.includes(maybeLocale as never)
//     ? (maybeLocale as SupportedLocale)
//     : routing.defaultLocale;
// }

// export default function LocaleHtmlAttributes() {
//   const pathname = usePathname() ?? '/';

//   useEffect(() => {
//     const locale = getLocaleFromPathname(pathname);
//     document.documentElement.lang = locale;
//     document.documentElement.dir = locale === 'ar' ? 'rtl' : 'ltr';
//   }, [pathname]);

//   return null;
// }

