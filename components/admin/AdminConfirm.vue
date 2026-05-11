<template>
  <Teleport to="body">
    <div v-if="state.show" class="admin-modal-overlay" @click.self="cancel">
      <div class="admin-confirm-modal">
        <div class="admin-confirm-icon">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round">
            <path d="M3 6h18M19 6l-1 14H6L5 6M10 11v6M14 11v6M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/>
          </svg>
        </div>
        <h3 class="admin-confirm-title">{{ state.title }}</h3>
        <p v-if="state.detail" class="admin-confirm-detail">{{ state.detail }}</p>
        <div style="display:flex;gap:0.75rem;justify-content:center">
          <button class="btn-admin-secondary" @click="cancel">Cancel</button>
          <button class="btn-admin-danger" @click="accept">Delete</button>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
const { state, accept, cancel } = useAdminConfirm()
</script>
