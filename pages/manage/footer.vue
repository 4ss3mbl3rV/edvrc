<template>
  <div>
    <div class="admin-toolbar">
      <div>
        <h1 class="admin-page-title">Branding</h1>
        <p class="admin-page-subtitle">Manage footer text and social links</p>
      </div>
    </div>

    <!-- Copyright text -->
    <div style="background:var(--bg-card);border:1px solid var(--border-color);border-radius:12px;padding:1.5rem;margin-bottom:1.5rem">
      <h2 style="font-family:var(--font-display);font-size:1rem;font-weight:600;color:var(--text-primary);margin:0 0 1rem">Copyright Text</h2>
      <div style="display:flex;gap:0.75rem;align-items:flex-end">
        <div class="admin-form-group" style="flex:1;margin:0">
          <label class="admin-label">Footer text</label>
          <input v-model="footerText" class="admin-input" placeholder="© 2025 Your Name. All rights reserved." />
        </div>
        <button class="btn-admin-primary" style="flex-shrink:0" :disabled="savingText" @click="saveFooterText">
          {{ savingText ? 'Saving…' : 'Save' }}
        </button>
      </div>
      <p v-if="textError" class="admin-error-msg" style="margin-top:0.5rem">{{ textError }}</p>
      <p v-if="textSaved" style="color:var(--accent-primary);font-size:0.8rem;margin-top:0.5rem;font-family:var(--font-mono)">Saved!</p>
    </div>

    <!-- Social links -->
    <div style="background:var(--bg-card);border:1px solid var(--border-color);border-radius:12px;padding:1.5rem">
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:1rem">
        <h2 style="font-family:var(--font-display);font-size:1rem;font-weight:600;color:var(--text-primary);margin:0">Social Links</h2>
        <div style="display:flex;gap:0.5rem">
          <button v-if="orderDirty" class="btn-admin-secondary" :disabled="orderSaving" @click="saveOrder">
            {{ orderSaving ? 'Saving…' : 'Save Order' }}
          </button>
          <button class="btn-admin-primary" @click="openModal()">+ Add Link</button>
        </div>
      </div>

      <div class="admin-table-wrap">
        <table class="admin-table">
          <thead>
            <tr>
              <th style="width:36px"></th>
              <th>Platform</th><th>Label</th><th>URL</th><th>Actions</th>
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
              <td><strong style="text-transform:capitalize">{{ row.platform }}</strong></td>
              <td style="color:var(--text-muted);font-size:0.85rem">{{ row.label || '—' }}</td>
              <td style="color:var(--text-muted);font-size:0.85rem;max-width:220px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">{{ row.url }}</td>
              <td style="display:flex;gap:0.5rem">
                <button class="btn-admin-secondary" @click="openModal(row)">Edit</button>
                <button class="btn-admin-danger" @click="deleteRow(row.id)">Delete</button>
              </td>
            </tr>
            <tr v-if="!rows.length">
              <td colspan="5" style="text-align:center;color:var(--text-muted);padding:2rem">No links yet.</td>
            </tr>
          </VueDraggable>
        </table>
      </div>

      <p v-if="orderError" style="color:var(--color-error);font-size:0.8rem;margin-top:0.5rem">{{ orderError }}</p>
    </div>

    <!-- Modal -->
    <div v-if="showModal" class="admin-modal-overlay" @click.self="showModal = false">
      <div class="admin-modal" style="max-width:520px">
        <div class="admin-modal-header">
          <h2 class="admin-modal-title">{{ editing ? 'Edit Link' : 'Add Link' }}</h2>
          <button class="admin-modal-close" type="button" @click="showModal = false">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </button>
        </div>
        <form @submit.prevent="save">
          <div class="admin-form-row">
            <div class="admin-form-group">
              <label class="admin-label">Platform *</label>
              <AdminSelect
                v-model="form.platform"
                :options="PLATFORMS"
              />
            </div>
            <div class="admin-form-group">
              <label class="admin-label">Label</label>
              <input v-model="form.label" class="admin-input" placeholder="e.g. GitHub" />
            </div>
          </div>
          <div class="admin-form-group">
            <label class="admin-label">URL *</label>
            <input v-model="form.url" class="admin-input" required placeholder="https://…" />
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
useHead({ title: 'Branding — Admin' })

const client = useSupabaseClient()

const PLATFORMS = ['github', 'linkedin', 'telegram', 'discord', 'twitter', 'email', 'website']

// Footer text
const footerText = ref('')
const savingText = ref(false)
const textError = ref('')
const textSaved = ref(false)

// Social links
const rows = ref<any[]>([])
const showModal = ref(false)
const editing = ref<any>(null)
const saving = ref(false)
const saveError = ref('')
const orderSaving = ref(false)
const orderError = ref('')
const orderDirty = ref(false)

const blankForm = () => ({ platform: 'github', label: '', url: '' })
const form = reactive<Record<string, any>>(blankForm())

const load = async () => {
  const [linksRes, textRes] = await Promise.all([
    client.from('footer_links').select('*').order('sort_order').order('created_at'),
    client.from('site_settings').select('value').eq('key', 'footer_text').maybeSingle(),
  ])
  rows.value = linksRes.data ?? []
  footerText.value = textRes.data?.value ?? `© ${new Date().getFullYear()} Vilaysack Vorachack. All rights reserved.`
}

onMounted(load)

const saveFooterText = async () => {
  savingText.value = true
  textError.value = ''
  const { error } = await client
    .from('site_settings')
    .upsert({ key: 'footer_text', value: footerText.value, updated_at: new Date().toISOString() }, { onConflict: 'key' })
  if (error) { textError.value = error.message }
  else { textSaved.value = true; setTimeout(() => { textSaved.value = false }, 2500) }
  savingText.value = false
}

const openModal = (row?: any) => {
  saveError.value = ''
  editing.value = row ?? null
  Object.keys(form).forEach(k => delete form[k])
  Object.assign(form, blankForm())
  if (row) Object.assign(form, row)
  showModal.value = true
}

const save = async () => {
  saving.value = true
  saveError.value = ''
  const { id, sort_order, created_at, ...payload } = form as any
  const { error } = editing.value
    ? await client.from('footer_links').update(payload).eq('id', editing.value.id)
    : await client.from('footer_links').insert({ ...payload, sort_order: rows.value.length })
  if (error) { saveError.value = error.message; saving.value = false; return }
  saving.value = false
  showModal.value = false
  await load()
}

const saveOrder = async () => {
  orderSaving.value = true
  orderError.value = ''
  const results = await Promise.all(
    rows.value.map((r, i) => client.from('footer_links').update({ sort_order: i }).eq('id', r.id))
  )
  const err = results.find(r => r.error)?.error
  if (err) { orderError.value = err.message }
  else { orderDirty.value = false }
  orderSaving.value = false
}

const { confirm } = useAdminConfirm()

const deleteRow = async (id: string) => {
  if (!await confirm('Delete this link?', 'This action cannot be undone.')) return
  await client.from('footer_links').delete().eq('id', id)
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
