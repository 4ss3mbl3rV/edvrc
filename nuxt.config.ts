export default defineNuxtConfig({
  devtools: { enabled: true },
  modules: ['@nuxt/content'],

  // SSG mode for Phase 1
  ssr: true,

  app: {
    pageTransition: { name: 'route', mode: 'out-in' },

    head: {
      charset: 'utf-8',
      viewport: 'width=device-width, initial-scale=1.0',
      title: 'Vilaysack Vorachack | Cybersecurity Professional',
      meta: [
        {
          name: 'description',
          content:
            'Personal portfolio of a cybersecurity professional specializing in digital forensics, offensive security, and blue team operations.',
        },
      ],
      // Runs synchronously before first paint — prevents dark→light flash in SSG
      script: [
        {
          innerHTML: `(function(){try{var c=document.cookie.split(';').find(function(s){return s.trim().startsWith('portfolio-theme=')});var t=c?c.split('=')[1].trim():(window.matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light');document.documentElement.setAttribute('data-theme',t);}catch(e){}})()`,
          tagPriority: 'critical',
        },
      ],
      link: [
        { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
        { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' },
        {
          rel: 'stylesheet',
          href: 'https://fonts.googleapis.com/css2?family=Electrolize&family=JetBrains+Mono:wght@300;400;500;600;700&family=Space+Grotesk:wght@300;400;500;600;700&family=Noto+Sans+Lao+Looped:wght@300;400;500;600;700&display=swap',
        },
      ],
    },
  },

  css: ['~/assets/css/styles.css'],

  compatibilityDate: '2025-04-01',
})
