<template>
  <nav class="navbar">
    <div class="nav-container">
      <NuxtLink to="/" class="nav-logo">[ Vilaysack V. ]</NuxtLink>

      <ul class="nav-links" :class="{ active: menuOpen }" id="navLinks">
        <li v-for="link in links" :key="link.label"
            class="nav-item"
            :class="{ 'nav-item--dropdown': link.children }">

          <!-- Plain link -->
          <NuxtLink v-if="!link.children" :to="link.to!" class="nav-link" @click="menuOpen = false">
            {{ link.label }}
          </NuxtLink>

          <!-- Dropdown parent -->
          <template v-else>
            <button
              class="nav-link nav-dropdown-trigger"
              :class="{ open: openDropdown === link.label }"
              @click.stop="toggleDropdown(link.label)"
            >
              {{ link.label }}
              <svg class="nav-dropdown-chevron" width="10" height="10" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                <polyline points="6 9 12 15 18 9"/>
              </svg>
            </button>

            <div class="nav-dropdown-panel" :class="{ open: openDropdown === link.label }">
              <NuxtLink
                v-for="child in link.children"
                :key="child.to"
                :to="child.to"
                class="nav-dropdown-item"
                @click="menuOpen = false; openDropdown = ''"
              >
                {{ child.label }}
              </NuxtLink>
            </div>
          </template>
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
const openDropdown = ref('')

const links: Array<{ label: string; to?: string; children?: { label: string; to: string }[] }> = [
  { label: 'Home', to: '/' },
  { label: 'About', to: '/about' },
  { label: 'Experiences', to: '/experiences' },
  { label: 'Certifications', to: '/certifications' },
  {
    label: 'Activities',
    children: [
      { label: 'Contributions', to: '/contributions' },
      { label: 'Achievements', to: '/achievements' },
    ],
  },
  { label: 'Blog', to: '/blog' },
]

const toggleDropdown = (label: string) => {
  openDropdown.value = openDropdown.value === label ? '' : label
}

const closeAll = () => { openDropdown.value = '' }

onMounted(() => document.addEventListener('click', closeAll))
onUnmounted(() => document.removeEventListener('click', closeAll))
</script>
