<template>
  <section class="page active">
    <div class="home-container">
      <!-- Profile Avatar -->
      <div class="avatar-container">
        <div class="avatar-ring" />
        <div class="avatar">
          <img src="/assets/profile.jpg" alt="Vilaysack Vorachack" class="avatar-image" @error="avatarError = true" :style="avatarError ? 'display:none' : ''" />
          <span class="avatar-initials" :style="avatarError ? '' : 'display:none'">VV</span>
        </div>
      </div>

      <h1 class="hero-name">Vilaysack Vorachack</h1>
      <p class="hero-position">Cybersecurity Professional</p>
      <p class="hero-subtitle">Passionate cybersecurity enthusiast and leader dedicated to protecting digital assets and building resilient security infrastructures.</p>

      <!-- Skills Grid -->
      <div class="skills-grid">
        <div class="skill-card" v-for="card in skillCards" :key="card.title">
          <div class="skill-card-header">
            <div class="skill-icon" v-html="card.icon" />
            <h3 class="skill-title">{{ card.title }}</h3>
          </div>
          <div class="skill-tags">
            <span class="tag" v-for="tag in card.tags" :key="tag">{{ tag }}</span>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
useHead({ title: 'Home | Vilaysack Vorachack' })

const avatarError = ref(false)

const skillCards = [
  {
    title: 'Digital Forensics & Incident Response',
    icon: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m13 13.5 2-2.5-2-2.5"/><path d="m9 13.5-2-2.5 2-2.5"/><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>`,
    tags: ['Memory Forensics', 'Disk Forensics', 'Network Forensics', 'Log Analysis', 'Malware Analysis', 'Threat Hunting'],
  },
  {
    title: 'Offensive Security',
    icon: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="22" y1="12" x2="18" y2="12"/><line x1="6" y1="12" x2="2" y2="12"/><line x1="12" y1="6" x2="12" y2="2"/><line x1="12" y1="22" x2="12" y2="18"/></svg>`,
    tags: ['Phishing Simulation', 'Adversary Emulation', 'Social Engineering'],
  },
  {
    title: 'Blue Team Skills',
    icon: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>`,
    tags: ['SOC Management', 'SOC Operations', 'Threat Intelligence', 'Security Monitoring', 'Forensic Reporting'],
  },
  {
    title: 'Tools & Platforms',
    icon: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="3" width="20" height="14" rx="2" ry="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>`,
    tags: ['Wireshark', 'Nmap', 'Metasploit', 'Burp Suite', 'ELK Stacks', 'Wazuh', 'Splunk', 'Docker', 'Python', 'Bash'],
  },
]
</script>
