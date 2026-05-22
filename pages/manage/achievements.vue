<template>
  <div>
    <div class="admin-toolbar">
      <div>
        <h1 class="admin-page-title">Achievements</h1>
        <p class="admin-page-subtitle">
          {{ rows.length }} entries — drag to reorder
          <span v-if="orderSaving" class="order-saving-indicator">Saving…</span>
          <span v-else-if="orderError" class="order-error-indicator">{{ orderError }}</span>
        </p>
      </div>
      <div style="display:flex;gap:0.5rem;align-items:center">
        <button v-if="orderDirty" class="btn-admin-secondary" :disabled="orderSaving" @click="saveOrder">
          {{ orderSaving ? 'Saving…' : 'Save Order' }}
        </button>
        <button class="btn-admin-primary" @click="openModal()">+ Add Achievement</button>
      </div>
    </div>

    <div class="admin-table-wrap">
      <table class="admin-table">
        <thead>
          <tr>
            <th style="width:36px"></th>
            <th>Title</th><th>Event</th><th>Placement</th><th>Category</th><th>Date</th><th>Actions</th>
          </tr>
        </thead>
        <VueDraggable v-model="rows" tag="tbody" handle=".drag-handle" animation="150" @end="orderDirty = true">
          <tr v-for="row in rows" :key="row.id">
            <td>
              <span class="drag-handle" title="Drag to reorder">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <circle cx="9" cy="5" r="1"/><circle cx="9" cy="12" r="1"/><circle cx="9" cy="19" r="1"/>
                  <circle cx="15" cy="5" r="1"/><circle cx="15" cy="12" r="1"/><circle cx="15" cy="19" r="1"/>
                </svg>
              </span>
            </td>
            <td><strong>{{ row.title }}</strong></td>
            <td style="color:var(--text-muted);font-size:0.85rem">{{ row.event || '—' }}</td>
            <td>
              <span v-if="row.placement" class="admin-badge admin-badge-active">{{ row.placement }}</span>
              <span v-else style="color:var(--text-muted)">—</span>
            </td>
            <td>{{ row.category || '—' }}</td>
            <td style="color:var(--text-muted);font-size:0.85rem">{{ row.date || '—' }}</td>
            <td style="display:flex;gap:0.5rem">
              <button class="btn-admin-secondary" @click="openModal(row)">Edit</button>
              <button class="btn-admin-danger" @click="deleteRow(row.id)">Delete</button>
            </td>
          </tr>
          <tr v-if="!rows.length">
            <td colspan="7" style="text-align:center;color:var(--text-muted);padding:2rem">No achievements yet.</td>
          </tr>
        </VueDraggable>
      </table>
    </div>

    <!-- Modal -->
    <div v-if="showModal" class="admin-modal-overlay" @click.self="showModal = false">
      <div class="admin-modal" style="max-width:640px">
        <div class="admin-modal-header">
          <h2 class="admin-modal-title">{{ editing ? 'Edit Achievement' : 'Add Achievement' }}</h2>
          <button class="admin-modal-close" type="button" @click="showModal = false">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </button>
        </div>
        <form @submit.prevent="save">

          <div class="admin-form-group">
            <label class="admin-label">Title *</label>
            <input v-model="form.title" class="admin-input" required placeholder="1st Place — National CTF 2024" />
          </div>

          <div class="admin-form-row">
            <div class="admin-form-group">
              <label class="admin-label">Event</label>
              <input v-model="form.event" class="admin-input" placeholder="CTF Thailand 2024" />
            </div>
            <div class="admin-form-group">
              <label class="admin-label">Date</label>
              <input v-model="form.date" class="admin-input" placeholder="2024-11" />
            </div>
          </div>

          <div class="admin-form-row">
            <div class="admin-form-group">
              <label class="admin-label">Placement</label>
              <AdminSelect
                v-model="placementPreset"
                :options="['The Winner', '2nd Place', '3rd Place', 'Other…']"
                @change="onPlacementPreset"
              />
              <input
                v-if="placementPreset === 'Other…'"
                v-model="form.placement"
                class="admin-input"
                style="margin-top:0.5rem"
                placeholder="e.g. Top 10, Finalist…"
              />
            </div>
            <div class="admin-form-group">
              <label class="admin-label">Category</label>
              <AdminSelect
                v-model="form.category"
                :options="['CTF', 'Award', 'Recognition', 'Competition', 'Other']"
              />
            </div>
          </div>

          <div class="admin-form-group">
            <label class="admin-label">Description</label>
            <textarea v-model="form.description" class="admin-textarea" rows="3" />
          </div>

          <div class="admin-form-row">
            <div class="admin-form-group">
              <label class="admin-label">Team / Solo</label>
              <input v-model="form.team" class="admin-input" placeholder="Team Name or Solo" />
            </div>
            <div class="admin-form-group">
              <label class="admin-label">URL</label>
              <input v-model="form.url" class="admin-input" placeholder="https://…" />
            </div>
          </div>

          <div v-if="saveError" class="admin-error-msg">{{ saveError }}</div>
          <div class="admin-modal-actions">
            <button type="button" class="btn-admin-secondary" @click="showModal = false">Cancel</button>
            <button type="submit" class="btn-admin-primary" :disabled="saving">
              {{ saving ? 'Saving…' : 'Save' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { VueDraggable } from 'vue-draggable-plus'

definePageMeta({ layout: 'admin', middleware: 'auth' })
useHead({ title: 'Achievements — Admin' })

const client = useSupabaseClient()
const rows = ref<any[]>([])
const showModal = ref(false)
const editing = ref<any>(null)
const saving = ref(false)
const saveError = ref('')
const orderSaving = ref(false)
const orderError = ref('')
const orderDirty = ref(false)

const PLACEMENT_PRESETS = ['The Winner', '2nd Place', '3rd Place']
const placementPreset = ref('The Winner')

const onPlacementPreset = () => {
  if (placementPreset.value !== 'Other…') form.placement = placementPreset.value
  else form.placement = ''
}

watch(placementPreset, val => {
  if (val !== 'Other…') form.placement = val
})

const blankForm = () => ({
  title: '', event: '', date: '', placement: 'The Winner',
  category: 'CTF', description: '', team: '', url: '',
})
const form = reactive<Record<string, any>>(blankForm())

const load = async () => {
  const { data } = await client.from('achievements').select('*').order('sort_order').order('created_at')
  rows.value = data ?? []
}

onMounted(load)

const openModal = (row?: any) => {
  saveError.value = ''
  editing.value = row ?? null
  Object.keys(form).forEach(k => delete form[k])
  Object.assign(form, blankForm())
  if (row) {
    Object.assign(form, row)
    placementPreset.value = PLACEMENT_PRESETS.includes(row.placement) ? row.placement : (row.placement ? 'Other…' : 'The Winner')
  } else {
    placementPreset.value = 'The Winner'
  }
  showModal.value = true
}

const save = async () => {
  saving.value = true
  saveError.value = ''
  const { id, sort_order, ...payload } = form as any
  const { error } = editing.value
    ? await client.from('achievements').update(payload).eq('id', editing.value.id)
    : await client.from('achievements').insert({ ...payload, sort_order: rows.value.length })
  if (error) { saveError.value = error.message; saving.value = false; return }
  saving.value = false
  showModal.value = false
  await load()
}

const saveOrder = async () => {
  orderSaving.value = true
  orderError.value = ''
  const results = await Promise.all(
    rows.value.map((r, i) => client.from('achievements').update({ sort_order: i }).eq('id', r.id))
  )
  const err = results.find(r => r.error)?.error
  if (err) { orderError.value = err.message }
  else { orderDirty.value = false }
  orderSaving.value = false
}

const { confirm } = useAdminConfirm()

const deleteRow = async (id: string) => {
  if (!await confirm('Delete this achievement?', 'This action cannot be undone.')) return
  await client.from('achievements').delete().eq('id', id)
  await load()
}
</script>

<style scoped>
.drag-handle {
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: grab;
  color: var(--text-muted);
  padding: 0.25rem;
  border-radius: 4px;
  transition: color 0.15s;
}
.drag-handle:hover { color: var(--accent-primary); }
.drag-handle:active { cursor: grabbing; }
</style>
