'use client'

import { QueryClient, QueryClientProvider, useIsFetching, useQueryClient } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { usePathname } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'

import { routing } from '@/i18n/routing'
import { useLocaleSwitch } from '@/contexts/LocaleSwitchContext'

type SupportedLocale = (typeof routing.locales)[number]

function getLocaleFromPathname(pathname: string): SupportedLocale {
  const maybeLocale = pathname.split('/')[1]
  return routing.locales.includes(maybeLocale as never)
    ? (maybeLocale as SupportedLocale)
    : routing.defaultLocale
}

function LocaleQueryRefetcher() {
  const pathname = usePathname() ?? '/'
  const locale = getLocaleFromPathname(pathname)
  const queryClient = useQueryClient()
  const isFetching = useIsFetching()
  const previousLocale = useRef<string | null>(null)
  const { isLocaleSwitching, switchToken, targetLocale, startLocaleSwitch, endLocaleSwitch } = useLocaleSwitch()
  const hasSeenFetchingForSwitch = useRef(false)
  const switchStartedAt = useRef<number>(0)

  useEffect(() => {
    // Skip first render; only refetch when the user changes locale.
    if (previousLocale.current === null) {
      previousLocale.current = locale
      return
    }

    if (previousLocale.current !== locale) {
      previousLocale.current = locale
      // Mark all cached queries stale; pages will refetch with the new locale header.
      queryClient.invalidateQueries()
      // Ensure loader is on even if navigation happened without clicking the switcher
      if (!isLocaleSwitching) {
        startLocaleSwitch(locale)
      }
    }
  }, [locale, queryClient, isLocaleSwitching, startLocaleSwitch])

  useEffect(() => {
    if (!isLocaleSwitching) return
    // Reset tracking for the new switch
    hasSeenFetchingForSwitch.current = false
    switchStartedAt.current = Date.now()
  }, [isLocaleSwitching, switchToken])

  useEffect(() => {
    if (!isLocaleSwitching) return

    if (isFetching > 0) {
      hasSeenFetchingForSwitch.current = true
      return
    }

    // Only finish once we are on the target locale (if provided)
    const onTargetLocale = !targetLocale || locale === targetLocale
    if (!onTargetLocale) return

    // End loading immediately when fetching is complete and we're on target locale
    // Only use a minimal delay (50ms) to ensure smooth transition if no fetching occurred
    const elapsed = Date.now() - switchStartedAt.current
    const canFinish =
      hasSeenFetchingForSwitch.current || elapsed >= 100 // minimal fallback if nothing fetched

    if (canFinish) {
      // End immediately if we've seen fetching, otherwise use minimal delay for smooth transition
      if (hasSeenFetchingForSwitch.current) {
        endLocaleSwitch()
      } else {
        const t = setTimeout(() => endLocaleSwitch(), 50)
        return () => clearTimeout(t)
      }
    }
  }, [endLocaleSwitch, isFetching, isLocaleSwitching, locale, targetLocale])

  return null
}

export function ReactQueryProvider({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 60 * 1000, // 1 minute
        refetchOnWindowFocus: false,
      },
    },
  }))

  return (
    <QueryClientProvider client={queryClient}>
      <LocaleQueryRefetcher />
      {children}
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  )
}