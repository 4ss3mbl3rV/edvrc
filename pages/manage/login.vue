<template>
  <div class="login-root" :data-theme="theme">
    <div class="login-bg">
      <div class="login-bg-glow login-bg-glow-1" />
      <div class="login-bg-glow login-bg-glow-2" />
    </div>

    <div class="login-card">
      <div class="login-icon">
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
          <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
          <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
        </svg>
      </div>

      <div class="login-logo">[ Vilaysack V. ]</div>
      <p class="login-subtitle">Admin Panel — sign in to continue</p>

      <div v-if="error" class="login-error">{{ error }}</div>

      <form @submit.prevent="login" class="login-form">
        <div class="login-field">
          <label for="email">Email</label>
          <input
            id="email"
            v-model="form.email"
            type="email"
            placeholder="you@example.com"
            required
            autocomplete="email"
          />
        </div>

        <div class="login-field">
          <label for="password">Password</label>
          <input
            id="password"
            v-model="form.password"
            type="password"
            placeholder="••••••••"
            required
            autocomplete="current-password"
          />
        </div>

        <button type="submit" class="login-btn" :disabled="loading">
          <span v-if="loading" class="login-spinner" />
          {{ loading ? 'Signing in…' : 'Sign In' }}
        </button>
      </form>

      <p class="login-back">
        <NuxtLink to="/">← Back to portfolio</NuxtLink>
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: false })
useHead({ title: 'Admin Login — Vilaysack V.' })

const { theme } = useTheme()
const client = useSupabaseClient()
const user = useSupabaseUser()

if (user.value) await navigateTo('/manage')

const form = reactive({ email: '', password: '' })
const loading = ref(false)
const error = ref('')

const login = async () => {
  loading.value = true
  error.value = ''
  const { error: err } = await client.auth.signInWithPassword({
    email: form.email,
    password: form.password,
  })
  if (err) {
    error.value = err.message
    loading.value = false
    return
  }
  await navigateTo('/manage')
}
</script>

<style scoped>
/* ── Root ──────────────────────────────────────────────────────────── */
.login-root {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--bg-primary);
  font-family: var(--font-body);
  color: var(--text-primary);
  padding: 1.5rem;
  position: relative;
  overflow: hidden;
}

/* ── Ambient glows ─────────────────────────────────────────────────── */
.login-bg {
  position: fixed;
  inset: 0;
  pointer-events: none;
  z-index: 0;
}

.login-bg-glow {
  position: absolute;
  border-radius: 50%;
  filter: blur(80px);
  opacity: 0.18;
}

.login-bg-glow-1 {
  width: 500px;
  height: 500px;
  background: var(--accent-primary);
  top: -120px;
  right: -100px;
}

.login-bg-glow-2 {
  width: 400px;
  height: 400px;
  background: var(--accent-secondary);
  bottom: -100px;
  left: -80px;
}

/* ── Card ──────────────────────────────────────────────────────────── */
.login-card {
  position: relative;
  z-index: 1;
  width: 100%;
  max-width: 400px;
  background: var(--bg-card);
  border: 1px solid var(--border-color);
  border-radius: 20px;
  padding: 2.5rem 2rem;
  box-shadow: 0 0 0 1px var(--border-color), 0 24px 64px rgba(0, 0, 0, 0.3);
  animation: cardIn 0.45s cubic-bezier(0.22, 1, 0.36, 1) both;
}

@keyframes cardIn {
  from { opacity: 0; transform: translateY(24px) scale(0.97); }
  to   { opacity: 1; transform: translateY(0) scale(1); }
}

/* ── Lock icon ─────────────────────────────────────────────────────── */
.login-icon {
  width: 52px;
  height: 52px;
  border-radius: 14px;
  background: var(--accent-subtle);
  border: 1px solid var(--border-color);
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--accent-primary);
  margin-bottom: 1.25rem;
}

/* ── Logo / heading ────────────────────────────────────────────────── */
.login-logo {
  font-family: var(--font-display);
  font-size: 1.25rem;
  color: var(--accent-primary);
  text-shadow: 0 0 20px var(--accent-glow);
  margin-bottom: 0.3rem;
  letter-spacing: 0.04em;
}

.login-subtitle {
  font-size: 0.825rem;
  color: var(--text-muted);
  margin-bottom: 2rem;
}

/* ── Error ─────────────────────────────────────────────────────────── */
.login-error {
  background: rgba(239, 68, 68, 0.1);
  border: 1px solid rgba(239, 68, 68, 0.3);
  color: #f87171;
  padding: 0.65rem 0.9rem;
  border-radius: 8px;
  font-size: 0.825rem;
  margin-bottom: 1.25rem;
  line-height: 1.5;
}

/* ── Form ──────────────────────────────────────────────────────────── */
.login-form {
  display: flex;
  flex-direction: column;
  gap: 1.1rem;
}

.login-field {
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
}

.login-field label {
  font-size: 0.8rem;
  font-weight: 500;
  color: var(--text-secondary);
  letter-spacing: 0.03em;
}

.login-field input {
  background: var(--bg-secondary);
  border: 1px solid var(--border-color);
  border-radius: 10px;
  padding: 0.7rem 0.9rem;
  font-size: 0.9rem;
  font-family: var(--font-body);
  color: var(--text-primary);
  outline: none;
  transition: border-color 0.2s, box-shadow 0.2s;
  width: 100%;
}

.login-field input::placeholder {
  color: var(--text-muted);
}

.login-field input:focus {
  border-color: var(--accent-primary);
  box-shadow: 0 0 0 3px var(--accent-subtle);
}

/* ── Submit button ─────────────────────────────────────────────────── */
.login-btn {
  margin-top: 0.4rem;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.75rem 1.25rem;
  background: var(--accent-primary);
  color: #fff;
  border: none;
  border-radius: 10px;
  font-size: 0.9rem;
  font-family: var(--font-body);
  font-weight: 600;
  letter-spacing: 0.02em;
  cursor: pointer;
  transition: background 0.2s, box-shadow 0.2s, transform 0.15s;
}

.login-btn:hover:not(:disabled) {
  background: var(--accent-secondary);
  box-shadow: 0 4px 20px var(--accent-glow);
  transform: translateY(-1px);
}

.login-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

/* ── Spinner ───────────────────────────────────────────────────────── */
.login-spinner {
  width: 14px;
  height: 14px;
  border: 2px solid rgba(255, 255, 255, 0.35);
  border-top-color: #fff;
  border-radius: 50%;
  animation: spin 0.7s linear infinite;
  flex-shrink: 0;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

/* ── Back link ─────────────────────────────────────────────────────── */
.login-back {
  text-align: center;
  margin-top: 1.5rem;
  font-size: 0.8rem;
}

.login-back a {
  color: var(--text-muted);
  text-decoration: none;
  transition: color 0.2s;
}

.login-back a:hover {
  color: var(--accent-primary);
}
</style>
