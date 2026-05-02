'use client';

import { Cpu, Share2, Rss, AtSign, Github, Twitter, Linkedin } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useSettingsContext } from '@/contexts/SettingsContext';
import Image from 'next/image';

import { Link } from '@/i18n/navigation';

export function Footer({ className = '' }: { className?: string }) {
  const currentYear = new Date().getFullYear();
  const t = useTranslations('Footer');
  const { siteLogo, siteName, github, twitter, linkedin } = useSettingsContext();

  return (
    <footer className={`border-t border-[#e8edf2] dark:border-[#3a3f45] py-12 bg-white dark:bg-background-dark ${className}`}>
      <div className="max-w-[1440px] mx-auto px-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12 mb-12">
          {/* Brand Column */}
          <div className="col-span-1 sm:col-span-2 lg:col-span-1">
            <div className="flex items-center gap-3 mb-6">
              {siteLogo ? (
                <div className="relative w-10 h-10">
                  <Image
                    src={siteLogo}
                    alt={siteName || 'Logo'}
                    fill
                    className="object-contain"
                    unoptimized
                  />
                </div>
              ) : (
                <div className="bg-primary p-2 rounded-lg">
                  <Cpu className="text-white w-5 h-5" />
                </div>
              )}
              <h2 className="text-lg font-extrabold tracking-tight uppercase text-[#0f141a] dark:text-white">
                {siteName || 'API TECH'}
              </h2>
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
              {t('description')}
            </p>
          </div>

          {/* Shopping Links */}
          <div>
            <h4 className="font-bold mb-6 text-sm uppercase tracking-wider text-[#0f141a] dark:text-white">
              {t('shopping.title')}
            </h4>
            <ul className="space-y-4 text-sm text-gray-500 dark:text-gray-400 font-medium">
              <li>
                <Link href="#" className="text-gray-500 dark:text-gray-400 hover:text-primary transition-colors">
                  {t('shopping.latestReleases')}
                </Link>
              </li>
              <li>
                <Link href="#" className="text-gray-500 dark:text-gray-400 hover:text-primary transition-colors">
                  {t('shopping.bestSellers')}
                </Link>
              </li>
              <li>
                <Link href="#" className="text-gray-500 dark:text-gray-400 hover:text-primary transition-colors">
                  {t('shopping.dailyDeals')}
                </Link>
              </li>
              <li>
                <Link href="#" className="text-gray-500 dark:text-gray-400 hover:text-primary transition-colors">
                  {t('shopping.giftCards')}
                </Link>
              </li>
            </ul>
          </div>

          {/* Support Links */}
          <div>
            <h4 className="font-bold mb-6 text-sm uppercase tracking-wider text-[#0f141a] dark:text-white">
              {t('support.title')}
            </h4>
            <ul className="space-y-4 text-sm text-gray-500 dark:text-gray-400 font-medium">
              <li>
                <Link href="#" className="text-gray-500 dark:text-gray-400 hover:text-primary transition-colors">
                  {t('support.helpCenter')}
                </Link>
              </li>
              <li>
                <Link href="#" className="text-gray-500 dark:text-gray-400 hover:text-primary transition-colors">
                  {t('support.trackOrder')}
                </Link>
              </li>
              <li>
                <Link href="#" className="text-gray-500 dark:text-gray-400 hover:text-primary transition-colors">
                  {t('support.shippingReturns')}
                </Link>
              </li>
              <li>
                <Link href="#" className="text-gray-500 dark:text-gray-400 hover:text-primary transition-colors">
                  {t('support.warrantyInfo')}
                </Link>
              </li>
            </ul>
          </div>

          {/* Social Links */}
          <div>
            <h4 className="font-bold mb-6 text-sm uppercase tracking-wider text-[#0f141a] dark:text-white">
              {t('connect.title')}
            </h4>
            <div className="flex gap-4">
              {github && (
                <a
                  href={github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full bg-gray-100 dark:bg-[#3a3f45] flex items-center justify-center hover:bg-primary hover:text-white transition-all shadow-sm text-gray-600 dark:text-gray-300"
                  aria-label="GitHub"
                >
                  <Github className="w-4 h-4" />
                </a>
              )}
              {twitter && (
                <a
                  href={twitter}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full bg-gray-100 dark:bg-[#3a3f45] flex items-center justify-center hover:bg-primary hover:text-white transition-all shadow-sm text-gray-600 dark:text-gray-300"
                  aria-label="Twitter"
                >
                  <Twitter className="w-4 h-4" />
                </a>
              )}
              {linkedin && (
                <a
                  href={linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full bg-gray-100 dark:bg-[#3a3f45] flex items-center justify-center hover:bg-primary hover:text-white transition-all shadow-sm text-gray-600 dark:text-gray-300"
                  aria-label="LinkedIn"
                >
                  <Linkedin className="w-4 h-4" />
                </a>
              )}
              {(!github && !twitter && !linkedin) && (
                <>
                  <a
                    href="#"
                    className="w-10 h-10 rounded-full bg-gray-100 dark:bg-[#3a3f45] flex items-center justify-center hover:bg-primary hover:text-white transition-all shadow-sm text-gray-600 dark:text-gray-300"
                    aria-label={t('connect.share')}
                  >
                    <Share2 className="w-4 h-4" />
                  </a>
                  <a
                    href="#"
                    className="w-10 h-10 rounded-full bg-gray-100 dark:bg-[#3a3f45] flex items-center justify-center hover:bg-primary hover:text-white transition-all shadow-sm text-gray-600 dark:text-gray-300"
                    aria-label={t('connect.rssFeed')}
                  >
                    <Rss className="w-4 h-4" />
                  </a>
                  <a
                    href="#"
                    className="w-10 h-10 rounded-full bg-gray-100 dark:bg-[#3a3f45] flex items-center justify-center hover:bg-primary hover:text-white transition-all shadow-sm text-gray-600 dark:text-gray-300"
                    aria-label={t('connect.email')}
                  >
                    <AtSign className="w-4 h-4" />
                  </a>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-12 mt-12 border-t border-[#e8edf2] dark:border-[#3a3f45] flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-gray-400 dark:text-gray-500">
          <p>{t('copyright', { year: currentYear })}</p>
          <div className="flex gap-6 sm:gap-8">
            <Link href="/terms" className="text-gray-400 dark:text-gray-500 hover:text-primary transition-colors">
              {t('bottom.privacyPolicy')}
            </Link>
            <Link href="/terms" className="text-gray-400 dark:text-gray-500 hover:text-primary transition-colors">
              {t('bottom.termsOfService')}
            </Link>
            <Link href="#" className="text-gray-400 dark:text-gray-500 hover:text-primary transition-colors">
              {t('bottom.cookieSettings')}
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
