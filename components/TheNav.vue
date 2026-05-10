<template>
  <nav class="navbar">
    <div class="nav-container">
      <NuxtLink to="/" class="nav-logo">[ Vilaysack V. ]</NuxtLink>

      <ul class="nav-links" :class="{ active: menuOpen }" id="navLinks">
        <li v-for="link in links" :key="link.to">
          <NuxtLink :to="link.to" class="nav-link" @click="menuOpen = false">
            {{ link.label }}
          </NuxtLink>
        </li>

        <!-- Mobile Theme Toggle -->
        <li class="mobile-theme-wrapper">
          <div class="mobile-theme-toggle" @click="toggle">
            <span class="toggle-label"><IconSun class="toggle-icon-sun" /></span>
            <div class="toggle-track"><div class="toggle-thumb" /></div>
            <span class="toggle-label"><IconMoon class="toggle-icon-moon" /></span>
          </div>
        </li>
      </ul>

      <button class="theme-toggle" @click="toggle" aria-label="Toggle theme">
        <IconSun class="icon-sun" />
        <IconMoon class="icon-moon" />
      </button>

      <button class="hamburger" :class="{ active: menuOpen }" @click="menuOpen = !menuOpen" aria-label="Toggle navigation">
        <span class="hamburger-line" />
        <span class="hamburger-line" />
        <span class="hamburger-line" />
      </button>
    </div>
  </nav>
</template>

<script setup lang="ts">
const { toggle } = useTheme()
const menuOpen = ref(false)

const links = [
  { to: '/', label: 'Home' },
  { to: '/about', label: 'About' },
  { to: '/experiences', label: 'Experiences' },
  { to: '/certifications', label: 'Certifications' },
  { to: '/contributions', label: 'Contributions' },
  { to: '/blog', label: 'Blog' },
]
</script>
