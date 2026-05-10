'use client'
import { useMemo, useCallback } from 'react';
import { useCategories } from "@/hooks/queries/useCategories";
import { useProducts } from "@/hooks/queries/useProducts";
import { CategoryWithIcon, HeroSlide } from "@/types/home.types";
import { HeroCarousel } from "@/components/home/HeroCarousel";
import { CategorySidebar } from "@/components/home/CategorySidebar";
import { QuickAccessCategories } from "@/components/home/QuickAccessCategories";
import { ProductCard } from "@/components/ui/ProductCard";
import { MobileAppPromo } from "@/components/home/MobileAppPromo";
import { ContactSection } from "@/components/home/ContactSection";
import { Footer } from "@/components/shared/Footer";
import { dummyProducts, dummyCategoriesWithIcons } from "@/lib/dummyData";
import { useToast } from "@/components/ui";
import Loading from '../loading';
import { Flame, AlertCircle, Sparkles, ImageIcon } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';

// Category icon mapping - moved outside component to avoid recreation
const categoryIconMap: Record<string, string> = {
  laptops: 'laptop_mac',
  phones: 'smartphone',
  gaming: 'sports_esports',
  audio: 'headphones',
  components: 'memory',
  wearables: 'watch',
  peripherals: 'keyboard',
  cameras: 'camera',
} as const;

// Default icon for categories without mapping
const getCategoryIcon = (categoryName: string, slug: string): string => {
  const key = categoryName.toLowerCase() || slug.toLowerCase();
  return categoryIconMap[key] || 'category';
};

// Discount percentages for hot offers
const HOT_OFFERS_DISCOUNTS = [30, 15, 50, 25] as const;

export default function Home() {
  const { data: categoriesData, isLoading: categoriesLoading, isError: categoriesError } = useCategories({ page: 1, per_page: 20 });
  const { data: products, isLoading: productsLoading, isError: productsError } = useProducts({ page: 1, per_page: 12 });
  // const { data: hotOffersProducts, isError: hotOffersError } = useProducts({ page: 1, per_page: 6 });
  const { showToast } = useToast();
  const t = useTranslations('HomePage');

  const heroSlides: HeroSlide[] = useMemo(() => [
    {
      id: '1',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCHEOj3ohXhIyXlCCGgIGLtM2bRvMbZsdywNC3j3_doWC8GVNHNr5xzWYqaGmeJ8uZp7_XESD5DKpnAxmZE5IvnmFSWNyjeB3HimqYP2YuYNdJHJwuWoj4sEDWsSfoF0ovc-u0UGjnYQarltNGcQ0o-m9ZPdEb2NyGkem3dpzv-D0Le0m2nuM5Ws82AGS-8cG0l73dbCM58o_WhqYsBpMaf6tM5_CRfpGYsHgyQQ3FwhYXRHemluEj52mf0aXAexT2vMb3pGJhvOg',
      imageAlt: t('hero.slides.slide1.imageAlt'),
      badge: t('hero.slides.slide1.badge'),
      title: t('hero.slides.slide1.title'),
      description: t('hero.slides.slide1.description'),
      price: '$2,499.00',
      ctaText: t('hero.slides.slide1.ctaText'),
      ctaLink: '/products',
    },
    {
      id: '2',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuASYFH0oec2BLLDhC11cHniB5yOT1AsreUNIMszxZ_NpeeIPBgNkgewwbVNwvaI49pgxkXLc6VPk5-c0Y5Xn-NnTCSF6JS_1rj6cLyrh20N_qXhx8B5L7nLkqYVyI_yPEwTEnOHHX6c49tL1incT8lZON_w0RbtjtMSC6_0Me2qpOcg7hPJotl7PJA8Cz40g0Bldq-UGxgFCYaPIrURpEYD3jmLuHnVZGkBXNXH0vA5QP8vtZhbrsRm2Vx6TqJR02VnPwU84fdSIA',
      imageAlt: t('hero.slides.slide2.imageAlt'),
      title: t('hero.slides.slide2.title'),
      description: t('hero.slides.slide2.description'),
      ctaText: t('hero.slides.slide2.ctaText'),
      ctaLink: '/products',
    },
  ], [t]);

  // Memoize categories with icons to avoid recalculation
  const categoriesWithIcons: CategoryWithIcon[] = useMemo(() => {
    if (categoriesData && categoriesData.length > 0 && !categoriesError) {
      return categoriesData.map((cat) => ({
        ...cat,
        icon: getCategoryIcon(cat.name, cat.slug),
      }));
    }
    return dummyCategoriesWithIcons;
  }, [categoriesData, categoriesError]);

  // Memoize display products
  const displayProducts = useMemo(() => {
    if (products && products.length > 0 && !productsError) {
      return products;
    }
    return dummyProducts.slice(0, 12);
  }, [products, productsError]);

  // Memoize hot offers
  const displayHotOffers = useMemo(() => {
    return products
  }, [products]);


  // Memoize featured product
  const featuredProduct = useMemo(() => {
    if (displayHotOffers && displayHotOffers.length > 0) {
      return displayHotOffers[0];
    }
    return undefined;
  }, [displayHotOffers]);

  const handleAddToCart = useCallback((productId: number) => {
    // TODO: Implement add to cart functionality
    showToast(t('toast.addedToCart'), 'success');
    console.log('Add to cart:', productId);
  }, [showToast, t]);


  if (productsLoading || categoriesLoading) {
    return <Loading />;
  }

  // if (productsError || categoriesError) {
  //   return <ErrorBoundary fallback={<div>Error loading products or categories</div>} />;
  // }
  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark font-display text-[#0f141a] dark:text-white antialiased transition-colors duration-200">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-primary focus:text-white focus:rounded-lg"
      >
        {t('skipToMain')}
      </a>
      <main
        id="main-content"
        className="max-w-[1280px] mx-auto px-4 sm:px-6 py-8"
        role="main"
      >
        {/* Hero Section Carousel */}
        <HeroCarousel slides={heroSlides} />

        {/* Main Content Grid */}
        <div className="grid grid-cols-12 gap-8">
          {/* Category Sidebar - Desktop Only */}
          <CategorySidebar
            categories={categoriesWithIcons}
            featuredProduct={featuredProduct}
          />

          {/* Main Content */}
          <div className="col-span-12 lg:col-span-9">
            {/* Quick Access Categories */}
            {/* <QuickAccessCategories categories={categoriesWithIcons.slice(0, 8)} /> */}

            {/* Hot Offers Section */}
            <section className="mb-12" aria-labelledby="hot-offers-heading">
              <div className="flex items-center justify-between mb-6 px-2">
                <div className="flex items-center gap-3">
                  {/* <Flame className="text-[#F2720D] w-6 h-6" aria-hidden="true" /> */}
                  <h2 id="hot-offers-heading" className="text-2xl font-bold tracking-tight !text-[#0f141a] dark:!text-white">{t('hotOffers')}</h2>
                </div>
                <Link
                  className="text-primary font-bold text-sm hover:underline focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded"
                  href="/products"
                  aria-label={t('aria.viewAllDeals')}
                >
                  {t('viewAllDeals')}
                </Link>
              </div>

              {displayHotOffers && displayHotOffers.length > 0 && !productsError ? (
                <div
                  className="grid grid-cols-1 sm:grid-cols-[repeat(auto-fit,220px)] gap-4"
                  role="list"
                  aria-label={t('aria.hotOffersProducts')}
                >
                  {displayHotOffers.map((product, index) => (
                    <div key={product.id} role="listitem" className="max-w-[220px]">
                      <ProductCard
                        product={product}
                        discountPercentage={HOT_OFFERS_DISCOUNTS[index] || 0}
                        originalPrice={product.variations[0].price * 1.4}
                        onAddToCart={handleAddToCart}
                      />
                    </div>
                  ))}
                </div>
              ) : productsLoading ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                  {[...Array(4)].map((_, i) => (
                    <div key={i} className="bg-white dark:bg-[#2d3238] rounded-xl p-3 animate-pulse">
                      <div className="aspect-square bg-gray-200 dark:bg-gray-700 rounded-lg mb-3" />
                      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded mb-2" />
                      <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded mb-3" />
                      <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded" />
                    </div>
                  ))}
                </div>
              ) : (productsError) ? (
                <div className="p-6 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl">
                  <div className="flex items-center gap-3">
                    <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400" />
                    <div>
                      <p className="text-sm font-bold text-red-800 dark:text-red-200">
                        {t('unableToLoadHotOffers')}
                      </p>
                      <p className="text-xs text-red-600 dark:text-red-400 mt-1">
                        {t('showingFallback')}
                      </p>
                    </div>
                  </div>
                </div>
              ) : null}
            </section>

            {/* Suggested For You Section */}
            <section className="mb-12" aria-labelledby="suggested-heading">
              <div className="flex items-center gap-3 mb-6 px-2">
                {/* <Sparkles className="w-6 h-6 text-primary" aria-hidden="true" /> */}
                <h2 id="suggested-heading" className="text-2xl font-extrabold tracking-tight  dark:text-white text-[#0f141a]">{t('suggestedForYou')}</h2>
              </div>

              {displayProducts && displayProducts.length > 0 && !productsError ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4" role="list" aria-label={t('aria.suggestedProducts')}>
                  {displayProducts.slice(0, 12).map((product) => (
                    <div
                      key={product.id}
                      className="bg-white dark:bg-[#2d3238] rounded-xl overflow-hidden border border-[#e8edf2] dark:border-[#3a3f45] hover:shadow-md transition-shadow"
                    >
                      <Link href={`/products/${product.id}`}>
                        <div className="aspect-square bg-gray-100 dark:bg-[#3a3f45] relative">
                          {product.images && product.images.length > 0 && product.images[0] ? (
                            <div
                              className="w-full h-full bg-cover bg-center"
                              style={{ backgroundImage: `url(${product.images[0]?.original})` }}
                              role="img"
                              aria-label={product.name}
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <ImageIcon className="w-10 h-10 text-gray-400" />
                            </div>
                          )}
                        </div>
                        <div className="p-3">
                          <h4 className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-tighter mb-1">
                            {t('category')}
                          </h4>
                          <p className="text-sm font-bold text-[#0f141a] dark:text-white truncate">
                            {product.name}
                          </p>
                          <p className="text-primary font-extrabold mt-1">
                            ${product.variations[0].price}
                          </p>
                        </div>
                      </Link>
                    </div>
                  ))}
                </div>
              ) : productsLoading || productsError ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                  {[...Array(12)].map((_, i) => (
                    <div key={i} className="bg-white dark:bg-[#2d3238] rounded-xl overflow-hidden animate-pulse">
                      <div className="aspect-square bg-gray-200 dark:bg-gray-700" />
                      <div className="p-3">
                        <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded mb-2" />
                        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded mb-1" />
                        <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-1/2" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : productsError ? (
                <div className="p-6 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl">
                  <div className="flex items-center gap-3">
                    <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400" />
                    <div>
                      <p className="text-sm font-bold text-red-800 dark:text-red-200">
                        {t('unableToLoadProducts')}
                      </p>
                      <p className="text-xs text-red-600 dark:text-red-400 mt-1">
                        {t('showingFallback')}
                      </p>
                    </div>
                  </div>
                </div>
              ) : null}
            </section>
          </div>
        </div>

        {/* Mobile App Promotion */}
        <MobileAppPromo />

        {/* Contact Section */}
        <ContactSection />
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
