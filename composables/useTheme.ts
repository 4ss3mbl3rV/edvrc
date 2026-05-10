const COOKIE_KEY = 'portfolio-theme'
const LS_KEY = 'portfolio-theme' // legacy localStorage key (migration)

export const useTheme = () => {
  const cookie = useCookie<string>(COOKIE_KEY, {
    maxAge: 60 * 60 * 24 * 365, // 1 year
    path: '/',
    sameSite: 'lax',
  })

  // On the server: reads cookie from request headers — correct theme from first byte
  // On the client: same cookie ref, stays in sync
  const theme = useState<string>('theme', () => cookie.value || 'dark')

  const applyTheme = (t: string) => {
    theme.value = t
    cookie.value = t
    if (import.meta.client) {
      document.documentElement.setAttribute('data-theme', t)
    }
  }

  const init = () => {
    if (!import.meta.client) return

    if (!cookie.value) {
      // Migrate from old localStorage value on first visit to Nuxt version
      try {
        const stored = localStorage.getItem(LS_KEY)
        if (stored === 'dark' || stored === 'light') {
          applyTheme(stored)
          return
        }
      } catch {}
      // Fall back to system preference
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
      applyTheme(prefersDark ? 'dark' : 'light')
      window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', e => {
        if (!cookie.value) applyTheme(e.matches ? 'dark' : 'light')
      })
    } else {
      // Cookie already set — SSR rendered the correct theme.
      // Just ensure the DOM attribute matches (handles client-side navigation).
      document.documentElement.setAttribute('data-theme', theme.value)
    }
  }

  const toggle = () => {
    const next = theme.value === 'dark' ? 'light' : 'dark'
    applyTheme(next)
  }

  return { theme, init, toggle }
}
