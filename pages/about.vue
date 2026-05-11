<template>
  <section class="page active">
    <div class="about-container">
      <div class="about-grid">
        <div class="about-left">
          <div class="about-avatar-container">
            <div class="avatar-ring small" />
            <div class="avatar small">
              <img src="/assets/profile.jpg" alt="Vilaysack V." class="avatar-image" />
            </div>
          </div>
          <div class="stats-row">
            <div class="stat-item">
              <span class="stat-number">5+</span>
              <span class="stat-label">Years Experience</span>
            </div>
            <div class="stat-item">
              <span class="stat-number">{{ certCount }}</span>
              <span class="stat-label">Certifications</span>
            </div>
            <div class="stat-item">
              <span class="stat-number">{{ contribCount }}</span>
              <span class="stat-label">Contributions</span>
            </div>
          </div>
        </div>

        <div class="about-right">
          <span class="section-label">Get to know me</span>
          <h2 class="section-title">About Me</h2>
          <div class="about-content">
            <p>As the <b>Chief Executive Officer</b> of Data Cyber Shield Co., Ltd., I lead a specialized firm dedicated to defensive security, SOC operations, and threat detection. With a Bachelor's degree in Computer Engineering and over five years of experience in the IT security sector, I combine technical depth with strategic leadership to navigate the complexities of modern cyber threats.</p>
            <p>My professional focus is defined by a dual perspective of the security landscape, where I balance defensive resilience with offensive tradecraft. On the defensive side, I specialize in Incident Response, Digital Forensics (DFIR), and Security Operations Center (SOC) workflows, dedicating my expertise to building robust architectures that enable organizations to detect, analyze, and neutralize threats with absolute precision.</p>
            <p>Beyond my executive responsibilities, I am a committed advocate for local technical empowerment. I actively contribute to the cybersecurity community by producing high-quality technical content in the <b>English-Lao language</b>, ensuring that essential security knowledge is accessible to my community.</p>
          </div>
          <div class="personality-tags">
            <span class="personality-tag" v-for="tag in tags" :key="tag">{{ tag }}</span>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.about-avatar-container {
    opacity: 0;
    animation: cardReveal 0.55s ease 0.15s forwards;
}

.stats-row {
    opacity: 0;
    animation: cardReveal 0.5s ease 0.35s forwards;
}

.section-label,
.section-title {
    opacity: 0;
    animation: cardReveal 0.5s ease 0.1s forwards;
}

.about-content {
    opacity: 0;
    animation: cardReveal 0.5s ease 0.25s forwards;
}

.personality-tags {
    opacity: 0;
    animation: cardReveal 0.5s ease 0.4s forwards;
}
</style>

<script setup lang="ts">
useHead({ title: 'About | Vilaysack Vorachack' })

const client = useSupabaseClient()

const { data: counts } = await useAsyncData('about-counts', async () => {
  const [certs, contribs] = await Promise.all([
    client.from('certifications').select('*', { count: 'exact', head: true }),
    client.from('contributions').select('*', { count: 'exact', head: true }),
  ])
  return { certCount: certs.count ?? 0, contribCount: contribs.count ?? 0 }
})

const certCount = computed(() => counts.value?.certCount ?? 0)
const contribCount = computed(() => counts.value?.contribCount ?? 0)

const tags = ['Leadership', 'DFIR', 'Threat Hunting', 'Threat Intelligence', 'Offensive Security', 'Blue Team Operations', 'Continuous Learner', 'Team Player', 'Mentor']
</script>
