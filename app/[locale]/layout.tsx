import { hasLocale, NextIntlClientProvider } from 'next-intl';
import { getMessages, setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';

import { routing } from '@/i18n/routing';
import { Providers } from '../providers';
import { Metadata } from 'next';
import { Alexandria, Manrope } from "next/font/google";
import "@/app/globals.css";
import { settingsService } from '@/services/settings.service';
import NextTopLoader from 'nextjs-toploader';


const alexandria = Alexandria({
  variable: "--font-alexandria",
  subsets: ["latin", "arabic"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
});

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
  weight:  ["200", "300", "400", "500", "600", "700", "800"],
});
export const metadata: Metadata = {
  title: "API Tech - E-Commerce Platform",
  description: "Your one-stop shop for high-performance hardware and software solutions",
};

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  // Enable static rendering (optional; safe even if some pages are dynamic).
  setRequestLocale(locale);

  const messages = await getMessages();
  
  // Fetch settings server-side
  const initialSettings = await settingsService.getServerSettings();

  return (
    <html lang={locale} dir={locale === 'ar' ? 'rtl' : 'ltr'} className={alexandria.variable} suppressHydrationWarning>
      <body className="font-alexandria antialiased">
      <NextTopLoader showSpinner={false} />
        <NextIntlClientProvider locale={locale} messages={messages}>
          <Providers initialSettings={initialSettings}>
            {children}
          </Providers>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}

