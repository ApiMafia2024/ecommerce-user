'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { HeroSlide } from '@/types/home.types';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useTranslations } from 'next-intl';

import { Link } from '@/i18n/navigation';

interface HeroCarouselProps {
  slides: HeroSlide[];
  className?: string;
  autoPlay?: boolean;
  autoPlayInterval?: number; // in milliseconds
}

export function HeroCarousel({ 
  slides, 
  className = '',
  autoPlay = true,
  autoPlayInterval = 5000,
}: HeroCarouselProps) {
  const t = useTranslations('HeroCarousel');
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const autoPlayTimerRef = useRef<NodeJS.Timeout | null>(null);
  const scrollTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Throttle scroll handler
  const handleScroll = useCallback(() => {
    if (scrollTimeoutRef.current) {
      return;
    }

    scrollTimeoutRef.current = setTimeout(() => {
      const container = scrollContainerRef.current;
      if (!container) return;

      const scrollLeft = container.scrollLeft;
      const slideWidth = container.clientWidth;
      const newIndex = Math.round(scrollLeft / slideWidth);
      setActiveIndex(newIndex);
      
      scrollTimeoutRef.current = null;
    }, 100);
  }, []);

  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    container.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      container.removeEventListener('scroll', handleScroll);
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
    };
  }, [handleScroll]);

  const scrollToSlide = useCallback((index: number) => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const slideWidth = container.clientWidth;
    container.scrollTo({
      left: slideWidth * index,
      behavior: 'smooth',
    });
  }, []);

  const goToNextSlide = useCallback(() => {
    const nextIndex = (activeIndex + 1) % slides.length;
    scrollToSlide(nextIndex);
  }, [activeIndex, slides.length, scrollToSlide]);

  const goToPreviousSlide = useCallback(() => {
    const prevIndex = (activeIndex - 1 + slides.length) % slides.length;
    scrollToSlide(prevIndex);
  }, [activeIndex, slides.length, scrollToSlide]);

  // Auto-play functionality
  useEffect(() => {
    if (!autoPlay || slides.length <= 1 || isPaused) {
      if (autoPlayTimerRef.current) {
        clearInterval(autoPlayTimerRef.current);
        autoPlayTimerRef.current = null;
      }
      return;
    }

    autoPlayTimerRef.current = setInterval(() => {
      goToNextSlide();
    }, autoPlayInterval);

    return () => {
      if (autoPlayTimerRef.current) {
        clearInterval(autoPlayTimerRef.current);
      }
    };
  }, [autoPlay, autoPlayInterval, goToNextSlide, isPaused, slides.length]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') {
        e.preventDefault();
        goToPreviousSlide();
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        goToNextSlide();
      }
    };

    const container = scrollContainerRef.current;
    if (container) {
      container.addEventListener('keydown', handleKeyDown);
      return () => container.removeEventListener('keydown', handleKeyDown);
    }
  }, [goToNextSlide, goToPreviousSlide]);

  // Touch gesture handlers
  const minSwipeDistance = 50;

  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    if (isLeftSwipe) {
      goToNextSlide();
    } else if (isRightSwipe) {
      goToPreviousSlide();
    }
  };

  if (!slides.length) return null;

  return (
    <section 
      className={`mb-12 ${className}`}
      aria-label={t('aria.heroCarousel')}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onFocus={() => setIsPaused(true)}
      onBlur={() => setIsPaused(false)}
    >
      <div className="relative">
        <div
          ref={scrollContainerRef}
          className="flex overflow-x-auto no-scrollbar gap-4 snap-x snap-mandatory"
          role="region"
          aria-label={t('aria.carouselSlides')}
          tabIndex={0}
          onTouchStart={onTouchStart}
          onTouchMove={onTouchMove}
          onTouchEnd={onTouchEnd}
        >
        {slides.map((slide, index) => (
          <div
            key={slide.id}
            className="min-w-full snap-center relative rounded-2xl overflow-hidden bg-zinc-900 aspect-[21/9] flex items-center"
            role="group"
            aria-roledescription="slide"
            aria-label={t('aria.slideLabel', { current: index + 1, total: slides.length })}
          >
            {/* Background Image */}
            <div
              className="absolute inset-0 bg-cover bg-center opacity-70"
              style={{ backgroundImage: `url(${slide.image})` }}
              role="img"
              aria-label={slide.imageAlt || slide.title}
              aria-hidden="true"
            />
            
            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent" />

            {/* Content */}
            <div className="relative px-8 md:px-16 max-w-2xl">
              {slide.badge && (
                <span className="bg-primary px-3 py-1 rounded text-[12px] font-bold text-white uppercase tracking-widest mb-4 inline-block">
                  {slide.badge}
                </span>
              )}
              
              <h2 className="text-3xl md:text-5xl font-extrabold text-white leading-tight mb-4">
                {slide.title}
              </h2>
              
              <p className="text-gray-300 text-base md:text-lg mb-8">
                {slide.description}
              </p>
              
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6">
                {slide.price && (
                  <span className="text-2xl md:text-3xl font-bold text-white">
                    {slide.price}
                  </span>
                )}
                
                {slide.ctaLink ? (
                  <Link
                    href={slide.ctaLink}
                    className="bg-primary hover:bg-primary/90 text-white px-6 md:px-8 py-3 md:py-4 rounded-xl font-bold transition-all transform hover:scale-105"
                  >
                    {slide.ctaText || t('defaultCtaText')}
                  </Link>
                ) : (
                  <button className="bg-primary hover:bg-primary/90 text-white px-6 md:px-8 py-3 md:py-4 rounded-xl font-bold transition-all transform hover:scale-105">
                    {slide.ctaText || t('defaultCtaText')}
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
        </div>

        {/* Navigation Buttons */}
        {slides.length > 1 && (
          <>
            <button
              onClick={goToPreviousSlide}
              className="absolute left-4 top-1/2 -translate-y-1/2 z-10 bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white p-3 rounded-full transition-all focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 hidden sm:flex"
              aria-label={t('aria.previousSlide')}
              type="button"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={goToNextSlide}
              className="absolute right-4 top-1/2 -translate-y-1/2 z-10 bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white p-3 rounded-full transition-all focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 hidden sm:flex"
              aria-label={t('aria.nextSlide')}
              type="button"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </>
        )}
      </div>

      {/* Indicators */}
      {slides.length > 1 && (
        <div 
          className="flex justify-center gap-2 mt-4"
          role="tablist"
          aria-label={t('aria.slideIndicators')}
        >
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => scrollToSlide(index)}
              role="tab"
              aria-selected={index === activeIndex}
              aria-controls={`slide-${index}`}
              className={`
                transition-all focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded-full
                ${index === activeIndex
                  ? 'w-8 h-1.5 bg-primary'
                  : 'w-1.5 h-1.5 bg-gray-300 dark:bg-gray-600 hover:bg-gray-400'
                }
              `}
              aria-label={t('aria.goToSlide', { number: index + 1 })}
            />
          ))}
        </div>
      )}

      {/* ARIA Live Region for Screen Readers */}
      <div 
        className="sr-only" 
        aria-live="polite" 
        aria-atomic="true"
      >
        {t('aria.liveRegion', {
          current: activeIndex + 1,
          total: slides.length,
          title: slides[activeIndex]?.title ?? '',
        })}
      </div>
    </section>
  );
}

export default HeroCarousel;
