'use client';

import { ShoppingBag } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useSettingsContext } from '@/contexts/SettingsContext';

interface MobileAppPromoProps {
  className?: string;
}

export function MobileAppPromo({ className = '' }: MobileAppPromoProps) {
  const t = useTranslations('MobileAppPromo');
  const { appleStoreUrl, googlePlayUrl } = useSettingsContext();
  return (
    <section className={`mb-12 rounded-3xl overflow-hidden relative bg-zinc-900 text-white p-8 md:p-12 ${className}`}>
      <div className="absolute top-0 right-0 w-1/2 h-full bg-primary/20 transform skew-x-12 translate-x-1/4" />
      
      <div className="relative flex flex-col lg:flex-row items-center justify-between gap-8">
        <div className="max-w-xl">
          <h2 className="text-3xl md:text-4xl font-black mb-6">
            {t('title')}
          </h2>
          <p className="text-gray-400 text-base md:text-lg mb-8">
            {t('description')}
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 items-center">
            {appleStoreUrl && (
              <a
                href={appleStoreUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block hover:opacity-80 transition-opacity"
              >
                <img 
                  src="https://tools.applemediaservices.com/api/badges/download-on-the-app-store/black/en-us?size=250x83&releaseDate=1289440000" 
                  alt={t('appStoreAlt')}
                  className="h-14 w-auto object-contain"
                />
              </a>
            )}
            
            {googlePlayUrl && (
              <a
                href={googlePlayUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block hover:opacity-80 transition-opacity"
              >
                <img 
                  src="https://play.google.com/intl/en_us/badges/static/images/badges/en_badge_web_generic.png" 
                  alt={t('googlePlayAlt')}
                  className="h-[55px] w-[214px] object-cover"
                />
              </a>
            )}
          </div>
        </div>
        
        {/* Mobile Mockup - Hidden on small screens */}
        <div className="hidden lg:block">
          <div className="w-64 h-[500px] bg-gradient-to-tr from-[#2273c3] to-[#F2720D] rounded-[3rem] border-8 border-zinc-800 shadow-2xl overflow-hidden relative">
            <div className="absolute inset-0 flex flex-col p-6 items-center justify-center text-center">
              <ShoppingBag className="w-16 h-16 text-white/50 mb-4" />
              <div className="w-12 h-1 bg-white/30 rounded-full mb-2" />
              <div className="w-16 h-1 bg-white/30 rounded-full" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default MobileAppPromo;
