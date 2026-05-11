<template>
  <div>
    <div class="admin-toolbar">
      <div>
        <h1 class="admin-page-title">Certifications</h1>
        <p class="admin-page-subtitle">{{ rows.length }} certifications — drag to reorder</p>
      </div>
      <button class="btn-admin-primary" @click="openModal()">+ Add Certification</button>
    </div>

    <div class="admin-table-wrap">
      <table class="admin-table">
        <thead>
          <tr>
            <th style="width:36px"></th>
            <th>Name</th><th>Issuer</th><th>Category</th><th>Year</th><th>Status</th><th>Actions</th>
          </tr>
        </thead>
        <VueDraggable v-model="rows" tag="tbody" handle=".drag-handle" animation="150" @end="saveOrder">
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
            <td>{{ row.issuer }}</td>
            <td>{{ row.category }}</td>
            <td>{{ row.year }}</td>
            <td>
              <span class="admin-badge" :class="row.status === 'EXPIRED' ? 'admin-badge-expired' : 'admin-badge-active'">
                {{ row.status }}
              </span>
            </td>
            <td style="display:flex;gap:0.5rem;flex-wrap:wrap">
              <button class="btn-admin-secondary" @click="openModal(row)">Edit</button>
              <button class="btn-admin-danger" @click="deleteRow(row.id)">Delete</button>
            </td>
          </tr>
          <tr v-if="!rows.length">
            <td colspan="7" style="text-align:center;color:var(--text-muted);padding:2rem">No certifications yet.</td>
          </tr>
        </VueDraggable>
      </table>
    </div>

    <!-- Modal -->
    <div v-if="showModal" class="admin-modal-overlay" @click.self="showModal = false">
      <div class="admin-modal">
        <h2 class="admin-modal-title">{{ editing ? 'Edit Certification' : 'Add Certification' }}</h2>
        <form @submit.prevent="save">

          <div class="admin-form-row">
            <div class="admin-form-group">
              <label class="admin-label">Name *</label>
              <input v-model="form.name" class="admin-input" required />
            </div>
            <div class="admin-form-group">
              <label class="admin-label">Issuer *</label>
              <input v-model="form.issuer" class="admin-input" required />
            </div>
          </div>

          <div class="admin-form-row">
            <div class="admin-form-group">
              <label class="admin-label">Category</label>
              <select v-model="categoryPreset" class="admin-select" @change="onCategoryPreset">
                <option value="General">General</option>
                <option value="Management">Management</option>
                <option value="Defensive">Defensive</option>
                <option value="Offensive">Offensive</option>
                <option value="Other">Other…</option>
              </select>
              <input
                v-if="categoryPreset === 'Other'"
                v-model="form.category"
                class="admin-input"
                style="margin-top:0.5rem"
                placeholder="Type category…"
              />
            </div>
            <div class="admin-form-group">
              <label class="admin-label">Year</label>
              <input v-model.number="form.year" type="number" class="admin-input" placeholder="2024" />
            </div>
          </div>

          <div class="admin-form-row">
            <div class="admin-form-group">
              <label class="admin-label">Status</label>
              <select v-model="form.status" class="admin-select">
                <option value="ACTIVE">ACTIVE</option>
                <option value="EXPIRED">EXPIRED</option>
              </select>
            </div>
            <div class="admin-form-group">
              <label class="admin-label">Expiry (YYYY-MM)</label>
              <input v-model="form.expiry" class="admin-input" placeholder="2029-01" />
            </div>
          </div>

          <div class="admin-form-group">
            <label class="admin-label">Badge</label>
            <div class="badge-field-row">
              <input v-model="form.badge" class="admin-input" placeholder="https://… or upload →" />
              <label class="badge-upload-btn" :class="{ uploading: uploading }">
                <input
                  ref="fileInput"
                  type="file"
                  accept=".png,.jpg,.jpeg,.webp,image/png,image/jpeg,image/webp"
                  style="display:none"
                  :disabled="uploading"
                  @change="uploadBadge"
                />
                <svg v-if="!uploading" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                  <polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/>
                </svg>
                <svg v-else width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="spin">
                  <path d="M21 12a9 9 0 1 1-6.219-8.56"/>
                </svg>
                {{ uploading ? 'Uploading…' : 'Upload' }}
              </label>
            </div>
            <div v-if="form.badge" class="badge-preview">
              <img :src="form.badge" alt="Badge preview" @error="badgeImgError = true" />
              <span v-if="badgeImgError" style="color:var(--text-muted);font-size:0.75rem">Preview unavailable</span>
            </div>
            <div v-if="uploadError" class="admin-error-msg" style="margin-top:0.5rem">{{ uploadError }}</div>
          </div>

          <div class="admin-form-group">
            <label class="admin-label">Verify URL</label>
            <input v-model="form.verify_url" class="admin-input" placeholder="https://credly.com/…" />
          </div>

          <div v-if="saveError" class="admin-error-msg">{{ saveError }}</div>
          <div class="admin-modal-actions">
            <button type="button" class="btn-admin-secondary" @click="showModal = false">Cancel</button>
            <button type="submit" class="btn-admin-primary" :disabled="saving || uploading">
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
useHead({ title: 'Certifications — Admin' })

const client = useSupabaseClient()
const rows = ref<any[]>([])
const showModal = ref(false)
const editing = ref<any>(null)
const saving = ref(false)
const saveError = ref('')

const PRESET_CATEGORIES = ['General', 'Management', 'Defensive', 'Offensive']
const categoryPreset = ref('General')
const onCategoryPreset = () => {
  if (categoryPreset.value !== 'Other') form.category = categoryPreset.value
  else form.category = ''
}

const fileInput = ref<HTMLInputElement | null>(null)
const uploading = ref(false)
const uploadError = ref('')
const badgeImgError = ref(false)

const uploadBadge = async (e: Event) => {
  const file = (e.target as HTMLInputElement).files?.[0]
  if (!file) return
  uploading.value = true
  uploadError.value = ''
  badgeImgError.value = false
  const ext = file.name.split('.').pop()
  const fileName = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`
  const { error } = await client.storage.from('badges').upload(fileName, file, {
    cacheControl: '31536000', upsert: false, contentType: file.type,
  })
  if (error) { uploadError.value = error.message; uploading.value = false; return }
  const { data } = client.storage.from('badges').getPublicUrl(fileName)
  form.badge = data.publicUrl
  uploading.value = false
  if (fileInput.value) fileInput.value.value = ''
}

const blankForm = () => ({
  name: '', issuer: '', category: 'General', year: new Date().getFullYear(),
  status: 'ACTIVE', expiry: '', badge: '', verify_url: '',
})
const form = reactive<Record<string, any>>(blankForm())

const load = async () => {
  const { data } = await client.from('certifications').select('*').order('sort_order').order('created_at')
  rows.value = data ?? []
}

onMounted(load)

const openModal = (row?: any) => {
  saveError.value = ''
  uploadError.value = ''
  badgeImgError.value = false
  editing.value = row ?? null
  // Replace all keys cleanly — prevents stale id from a previous edit leaking into a new insert
  Object.keys(form).forEach(k => delete form[k])
  Object.assign(form, blankForm())
  if (row) {
    Object.assign(form, row)
    categoryPreset.value = PRESET_CATEGORIES.includes(row.category) ? row.category : 'Other'
  } else {
    categoryPreset.value = 'General'
  }
  showModal.value = true
}

const save = async () => {
  saving.value = true
  saveError.value = ''
  // Always strip id from the payload — let Supabase manage the PK
  const { id, sort_order, ...payload } = form as any
  const { error } = editing.value
    ? await client.from('certifications').update(payload).eq('id', editing.value.id)
    : await client.from('certifications').insert({ ...payload, sort_order: rows.value.length })
  if (error) { saveError.value = error.message; saving.value = false; return }
  saving.value = false
  showModal.value = false
  await load()
}

// Persist drag order to Supabase
const saveOrder = async () => {
  await client.from('certifications').upsert(
    rows.value.map((r, i) => ({ id: r.id, sort_order: i }))
  )
}

const { confirm } = useAdminConfirm()
const deleteRow = async (id: string) => {
  if (!await confirm('Delete this certification?', 'This action cannot be undone.')) return
  await client.from('certifications').delete().eq('id', id)
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

.badge-field-row {
  display: flex;
  gap: 0.5rem;
  align-items: center;
}

.badge-field-row .admin-input { flex: 1; min-width: 0; }

.badge-upload-btn {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  padding: 0 0.85rem;
  height: 38px;
  background: var(--accent-subtle);
  border: 1px solid var(--border-color);
  border-radius: 8px;
  color: var(--accent-primary);
  font-size: 0.8rem;
  font-weight: 500;
  cursor: pointer;
  white-space: nowrap;
  flex-shrink: 0;
  transition: border-color 0.2s, background 0.2s;
  user-select: none;
}

.badge-upload-btn:hover:not(.uploading) { border-color: var(--accent-primary); }
.badge-upload-btn.uploading { opacity: 0.7; cursor: not-allowed; }

.badge-preview {
  margin-top: 0.6rem;
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.badge-preview img {
  height: 48px;
  width: 48px;
  object-fit: contain;
  border: 1px solid var(--border-color);
  border-radius: 8px;
  background: var(--bg-secondary);
  padding: 4px;
}

.spin { animation: spin 0.8s linear infinite; }
@keyframes spin { to { transform: rotate(360deg); } }
</style>
