'use client'
import React, { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { Loader2, Cpu, Search, User, ShoppingCart, HelpCircle } from 'lucide-react'
import { ThemeToggle } from './ThemeToggle'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Link, usePathname, useRouter } from '@/i18n/navigation'
import { useLocale, useTranslations } from 'next-intl'
import { useLocaleSwitch } from '@/contexts/LocaleSwitchContext'
import { useSettingsContext } from '@/contexts/SettingsContext'
import Image from 'next/image'
import { useCart } from '@/hooks/useCart'

const Navbar = () => {
  const { user, isAuthenticated, isLoading } = useAuth()
  const { siteLogo, siteName } = useSettingsContext()
  const t = useTranslations('Navbar')
  const locale = useLocale()
  const pathname = usePathname()
  const router = useRouter()
  const { startLocaleSwitch } = useLocaleSwitch()
  const [searchQuery, setSearchQuery] = useState('')
  const [isMounted, setIsMounted] = useState(false)
  const { items: cartItems } = useCart()

  useEffect(() => {
    setTimeout(() => {
      setIsMounted(true)
    }, 100)
  }, [])


  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()

    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`)
    }
  }

  const handleChangeLocale = (nextLocale: 'en' | 'ar') => {
    // Show loader immediately, then navigate.
    startLocaleSwitch(nextLocale)
    router.replace(pathname, { locale: nextLocale })
  }

  return (
    <header className="sticky top-0 z-50 glass-header border-b border-[#e8edf2] dark:border-[#3a3f45]">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 h-20 flex items-center justify-between gap-4 md:gap-8">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3 shrink-0">
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
              <Cpu className="text-white w-6 h-6" />
            </div>
          )}
          <h1 className="text-xl font-extrabold tracking-tight text-[#0f141a] dark:text-white">
            {siteName ? (
              siteName.split(' ').map((word, i) => (
                <span key={i}>
                  {i === 0 ? word : <span className="text-primary"> {word}</span>}
                </span>
              ))
            ) : (
              <>
                API <span className="text-primary">TECH</span>
              </>
            )}
          </h1>
        </Link>

        {/* Search Bar */}
        <form onSubmit={handleSearch} className="flex-1 max-w-2xl hidden md:block">
          <label className="relative block group">
            <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-[#537393] dark:text-gray-400 group-focus-within:text-primary transition-colors">
              <Search className="w-5 h-5" />
            </span>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-12 pl-12 pr-4 bg-[#f0f2f5] dark:bg-[#2d3238] border-none rounded-xl text-sm focus:ring-2 focus:ring-primary/50 placeholder:text-[#537393] dark:placeholder:text-gray-500 transition-all"
              placeholder={t('searchPlaceholder')}
            />
          </label>
        </form>

        {/* Nav Icons */}
        <nav className="flex items-center gap-4 md:gap-6 shrink-0">
          <ThemeToggle />
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                type="button"
                className="flex flex-col items-center gap-1 text-[#537393] dark:text-gray-400 hover:text-primary transition-colors"
                title={t('language')}
                aria-label={t('language')}
              >
                <div className="flex items-center gap-2">

                  <Image src={`/icons/${locale}.svg`} alt={locale} width={20} height={20} />
                  <span
                    className="text-[10px] font-bold uppercase tracking-wider hidden sm:block">
                    {locale === 'ar' ? 'AR' : 'EN'}
                  </span>
                </div>

              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              className="w-48 bg-white dark:bg-[#2d3238] border border-[#e8edf2] dark:border-[#3a3f45] shadow-xl rounded-xl p-2"
            >
              {locale == "ar" ? (
                <DropdownMenuItem
                  className="cursor-pointer rounded-lg"
                  onSelect={(e) => {
                    e.preventDefault()
                    handleChangeLocale('en')
                  }}
                >
                  {t('english')}
                </DropdownMenuItem>
              ) : (
                <DropdownMenuItem
                  className="cursor-pointer rounded-lg"
                  onSelect={(e) => {
                    e.preventDefault()
                    handleChangeLocale('ar')
                  }}
                >
                  {t('arabic')}
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
          {/* Help dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                type="button"
                className={` flex ${isAuthenticated && isMounted && 'flex-col gap-1'} items-center text-[#537393] dark:text-gray-400 cursor-pointer hover:text-primary transition-colors ${isMounted && isAuthenticated ? 'flex-col gap-1' : 'flex-row gap-2'
                  }`}
                title={t('help')}
              >
                <HelpCircle className="w-5 h-5" />
                <span
                  className={`hidden sm:block ${isMounted && isAuthenticated
                    ? 'text-[10px] font-bold uppercase tracking-wider'
                    : 'text-sm font-medium'
                    }`}
                >
                  {t('help')}
                </span>
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              className="w-56 bg-white dark:bg-[#2d3238] border border-[#e8edf2] dark:border-[#3a3f45] shadow-xl rounded-xl p-2"
            >
              <DropdownMenuItem asChild className="cursor-pointer rounded-lg">
                <Link href="/terms">{t('terms')}</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild className="cursor-pointer rounded-lg">
                <Link href="/about-us">{t('aboutUs')}</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild className="cursor-pointer rounded-lg">
                <Link href="/faqs">{t('faqs')}</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild className="cursor-pointer rounded-lg">
                <Link href="/contact">{t('contactUs')}</Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>


          {isMounted && isLoading ? (
            <Loader2 className="w-5 h-5 animate-spin text-[#537393] dark:text-gray-400" />
          ) : isMounted && isAuthenticated ? (
            <>
              <Link
                href="/auth/profile"
                className="flex flex-col items-center gap-1 text-[#537393] dark:text-gray-400 hover:text-primary transition-colors"
                title={t('profile')}
              >
                <User className="w-5 h-5" />
                <span className="text-[10px] font-bold uppercase tracking-wider hidden sm:block">{t('profile')}</span>
              </Link>
              <Link
                href="/cart"
                className="flex flex-col items-center gap-1 text-[#537393] dark:text-gray-400 hover:text-primary transition-colors relative"
                title={t('cart')}
              >
                <ShoppingCart className="w-5 h-5" />
                <span className="text-[10px] font-bold uppercase tracking-wider hidden sm:block">{t('cart')}</span>
                {cartItems?.length ? (
                  <span className="absolute -top-1 -right-1 bg-[#F2720D] text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                    {cartItems?.length ? cartItems?.length : null}
                  </span>
                ) : null}
              </Link>
            </>
          ) : (
            <>
              <Link
                href="/auth/login"
                className="px-4 py-2 text-sm font-medium text-[#537393] dark:text-gray-400 hover:text-primary transition-colors"
              >
                {t('signIn')}
              </Link>
              <Link
                href="/auth/register"
                className="px-4 py-2 text-sm font-semibold bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors shadow-sm"
              >
                {t('signUp')}
              </Link>
            </>
          )}
        </nav>
      </div>

      {/* Mobile Search Bar */}
      <div className="md:hidden px-4 pb-4">
        <form onSubmit={handleSearch} className="relative">
          <label className="relative block group">
            <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-[#537393] dark:text-gray-400 group-focus-within:text-primary transition-colors">
              <Search className="w-5 h-5" />
            </span>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-12 pl-12 pr-4 bg-[#f0f2f5] dark:bg-[#2d3238] border-none rounded-xl text-sm focus:ring-2 focus:ring-primary/50 placeholder:text-[#537393] dark:placeholder:text-gray-500 transition-all"
              placeholder={t('searchPlaceholderMobile')}
            />
          </label>
        </form>
      </div>
    </header>
  )
}

export default Navbar