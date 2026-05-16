<template>
  <div>
    <div class="admin-toolbar">
      <div>
        <h1 class="admin-page-title">Contributions</h1>
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
        <button class="btn-admin-primary" @click="openModal()">+ Add Contribution</button>
      </div>
    </div>

    <div class="admin-table-wrap">
      <table class="admin-table">
        <thead>
          <tr>
            <th style="width:36px"></th>
            <th>Name</th><th>Category</th><th>Status</th><th>Actions</th>
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
            <td><strong>{{ row.name }}</strong></td>
            <td>{{ row.category }}</td>
            <td>
              <span class="admin-badge" :class="row.status === 'Active' ? 'admin-badge-active' : 'admin-badge-draft'">
                {{ row.status }}
              </span>
            </td>
            <td style="display:flex;gap:0.5rem">
              <button class="btn-admin-secondary" @click="openModal(row)">Edit</button>
              <button class="btn-admin-danger" @click="deleteRow(row.id)">Delete</button>
            </td>
          </tr>
          <tr v-if="!rows.length">
            <td colspan="5" style="text-align:center;color:var(--text-muted);padding:2rem">No contributions yet.</td>
          </tr>
        </VueDraggable>
      </table>
    </div>

    <!-- Modal -->
    <div v-if="showModal" class="admin-modal-overlay" @click.self="showModal = false">
      <div class="admin-modal" style="max-width:620px">
        <h2 class="admin-modal-title">{{ editing ? 'Edit Contribution' : 'Add Contribution' }}</h2>
        <form @submit.prevent="save">
          <div class="admin-form-group">
            <label class="admin-label">Name *</label>
            <input v-model="form.name" class="admin-input" required />
          </div>
          <div class="admin-form-row">
            <div class="admin-form-group">
              <label class="admin-label">Category</label>
              <input v-model="form.category" class="admin-input" placeholder="CTF Competition" />
            </div>
            <div class="admin-form-group">
              <label class="admin-label">Status</label>
              <AdminSelect v-model="form.status" :options="[{ value: 'Active', label: 'Active' }, { value: 'Completed', label: 'Completed' }]" />
            </div>
          </div>
          <div class="admin-form-group">
            <label class="admin-label">Description</label>
            <textarea v-model="form.description" class="admin-textarea" rows="3" />
          </div>
          <div class="admin-form-group">
            <label class="admin-label">Tags</label>
            <AdminTagInput v-model="form.tags" />
          </div>
          <div class="admin-form-row">
            <div class="admin-form-group">
              <label class="admin-label">GitHub URL</label>
              <input v-model="form.github_url" class="admin-input" placeholder="https://github.com/..." />
            </div>
            <div class="admin-form-group">
              <label class="admin-label">Demo URL</label>
              <input v-model="form.demo_url" class="admin-input" placeholder="https://..." />
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
useHead({ title: 'Contributions — Admin' })

const client = useSupabaseClient()
const rows = ref<any[]>([])
const showModal = ref(false)
const editing = ref<any>(null)
const saving = ref(false)
const saveError = ref('')
const orderSaving = ref(false)
const orderError = ref('')
const orderDirty = ref(false)

const blankForm = () => ({
  name: '', category: '', status: 'Active', description: '',
  tags: [] as string[], github_url: '', demo_url: '',
})
const form = reactive<Record<string, any>>(blankForm())

const load = async () => {
  const { data } = await client.from('contributions').select('*').order('sort_order').order('created_at')
  rows.value = data ?? []
}

onMounted(load)

const openModal = (row?: any) => {
  saveError.value = ''
  editing.value = row ?? null
  Object.keys(form).forEach(k => delete form[k])
  Object.assign(form, blankForm())
  if (row) Object.assign(form, { ...row, tags: row.tags ?? [] })
  showModal.value = true
}

const save = async () => {
  saving.value = true
  saveError.value = ''
  const { id, sort_order, ...payload } = form as any
  const { error } = editing.value
    ? await client.from('contributions').update(payload).eq('id', editing.value.id)
    : await client.from('contributions').insert({ ...payload, sort_order: rows.value.length })
  if (error) { saveError.value = error.message; saving.value = false; return }
  saving.value = false
  showModal.value = false
  await load()
}

const saveOrder = async () => {
  orderSaving.value = true
  orderError.value = ''
  const results = await Promise.all(
    rows.value.map((r, i) => client.from('contributions').update({ sort_order: i }).eq('id', r.id))
  )
  const err = results.find(r => r.error)?.error
  if (err) { orderError.value = err.message }
  else { orderDirty.value = false }
  orderSaving.value = false
}

const { confirm } = useAdminConfirm()

const deleteRow = async (id: string) => {
  if (!await confirm('Delete this contribution?', 'This action cannot be undone.')) return
  await client.from('contributions').delete().eq('id', id)
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
