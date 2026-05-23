<template>
  <div class="admin-editor">
    <!-- Mode toggle -->
    <div class="admin-editor-tabs">
      <button class="admin-editor-tab" :class="{ active: mode === 'visual' }" type="button" @click="switchMode('visual')">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
          <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
        </svg>
        Visual
      </button>
      <button class="admin-editor-tab" :class="{ active: mode === 'markdown' }" type="button" @click="switchMode('markdown')">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <polyline points="4 7 4 4 20 4 20 7"/><line x1="9" y1="20" x2="15" y2="20"/>
          <line x1="12" y1="4" x2="12" y2="20"/>
        </svg>
        Markdown
      </button>
    </div>

    <!-- Visual (TipTap) -->
    <div v-if="mode === 'visual'" class="admin-editor-visual">
      <div v-if="editor" class="admin-editor-toolbar">

        <!-- Text formatting -->
        <button type="button" :class="{ active: editor.isActive('bold') }" @click="editor.chain().focus().toggleBold().run()" title="Bold (Ctrl+B)">
          <strong>B</strong>
        </button>
        <button type="button" :class="{ active: editor.isActive('italic') }" @click="editor.chain().focus().toggleItalic().run()" title="Italic (Ctrl+I)">
          <em>I</em>
        </button>
        <button type="button" :class="{ active: editor.isActive('strike') }" @click="editor.chain().focus().toggleStrike().run()" title="Strikethrough" style="text-decoration:line-through">
          S
        </button>
        <button type="button" :class="{ active: editor.isActive('code') }" @click="editor.chain().focus().toggleCode().run()" title="Inline code">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/>
          </svg>
        </button>

        <div class="admin-editor-toolbar-sep" />

        <!-- Headings -->
        <button type="button" class="toolbar-label" :class="{ active: editor.isActive('heading', { level: 1 }) }" @click="editor.chain().focus().toggleHeading({ level: 1 }).run()" title="Heading 1">H1</button>
        <button type="button" class="toolbar-label" :class="{ active: editor.isActive('heading', { level: 2 }) }" @click="editor.chain().focus().toggleHeading({ level: 2 }).run()" title="Heading 2">H2</button>
        <button type="button" class="toolbar-label" :class="{ active: editor.isActive('heading', { level: 3 }) }" @click="editor.chain().focus().toggleHeading({ level: 3 }).run()" title="Heading 3">H3</button>
        <button type="button" class="toolbar-label" :class="{ active: editor.isActive('heading', { level: 4 }) }" @click="editor.chain().focus().toggleHeading({ level: 4 }).run()" title="Heading 4">H4</button>

        <div class="admin-editor-toolbar-sep" />

        <!-- Lists -->
        <button type="button" :class="{ active: editor.isActive('bulletList') }" @click="editor.chain().focus().toggleBulletList().run()" title="Bullet list">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/>
            <line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/>
            <line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/>
          </svg>
        </button>
        <button type="button" :class="{ active: editor.isActive('orderedList') }" @click="editor.chain().focus().toggleOrderedList().run()" title="Ordered list">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <line x1="10" y1="6" x2="21" y2="6"/><line x1="10" y1="12" x2="21" y2="12"/>
            <line x1="10" y1="18" x2="21" y2="18"/><path d="M4 6h1v4"/><path d="M4 10h2"/>
            <path d="M6 18H4c0-1 2-2 2-3s-1-1.5-2-1"/>
          </svg>
        </button>

        <div class="admin-editor-toolbar-sep" />

        <!-- Blocks -->
        <button type="button" :class="{ active: editor.isActive('blockquote') }" @click="editor.chain().focus().toggleBlockquote().run()" title="Blockquote">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M3 21c3 0 7-1 7-8V5c0-1.25-.756-2.017-2-2H4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2 1 0 1 0 1 1v1c0 1-1 2-2 2s-1 .008-1 1.031V20c0 1 0 1 1 1z"/>
            <path d="M15 21c3 0 7-1 7-8V5c0-1.25-.757-2.017-2-2h-4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2h.75c0 2.25.25 4-2.75 4v3c0 1 0 1 1 1z"/>
          </svg>
        </button>
        <button type="button" :class="{ active: editor.isActive('codeBlock') }" @click="editor.chain().focus().toggleCodeBlock().run()" title="Code block">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <rect x="2" y="3" width="20" height="14" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/>
          </svg>
        </button>
        <button type="button" @click="editor.chain().focus().setHorizontalRule().run()" title="Horizontal divider">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <line x1="2" y1="12" x2="22" y2="12"/>
          </svg>
        </button>

        <div class="admin-editor-toolbar-sep" />

        <!-- Image -->
        <label class="admin-editor-toolbar-imgbtn" :class="{ disabled: imgUploading }" title="Upload image">
          <input ref="imgFileInput" type="file" accept="image/png,image/jpeg,image/webp,image/gif" style="display:none" :disabled="imgUploading" @change="uploadImage" />
          <svg v-if="!imgUploading" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/>
            <polyline points="21 15 16 10 5 21"/>
          </svg>
          <svg v-else width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="spin">
            <path d="M21 12a9 9 0 1 1-6.219-8.56"/>
          </svg>
        </label>
        <button type="button" :class="{ active: showImgUrl }" @click="showImgUrl = !showImgUrl; nextTick(() => imgUrlInput?.focus())" title="Insert image by URL">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/>
            <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/>
          </svg>
        </button>

        <div class="admin-editor-toolbar-sep" />

        <!-- History -->
        <button type="button" :disabled="!editor.can().undo()" @click="editor.chain().focus().undo().run()" title="Undo (Ctrl+Z)">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="9 14 4 9 9 4"/><path d="M20 20v-7a4 4 0 0 0-4-4H4"/>
          </svg>
        </button>
        <button type="button" :disabled="!editor.can().redo()" @click="editor.chain().focus().redo().run()" title="Redo (Ctrl+Y)">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="15 14 20 9 15 4"/><path d="M4 20v-7a4 4 0 0 1 4-4h12"/>
          </svg>
        </button>

      </div>

      <!-- Image URL bar -->
      <div v-if="showImgUrl" class="admin-editor-img-url-bar">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="flex-shrink:0;color:var(--text-muted)">
          <rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/>
        </svg>
        <input
          ref="imgUrlInput"
          v-model="imgUrl"
          class="admin-editor-img-url-input"
          placeholder="Paste image URL and press Enter…"
          @keydown.enter.prevent="insertImageUrl"
          @keydown.escape="showImgUrl = false; imgUrl = ''"
        />
        <button type="button" class="admin-editor-img-url-insert" :disabled="!imgUrl.trim()" @click="insertImageUrl">Insert</button>
        <button type="button" class="admin-editor-img-url-cancel" @click="showImgUrl = false; imgUrl = ''">✕</button>
      </div>

      <div v-if="imgError" class="admin-editor-img-error">{{ imgError }}</div>

      <EditorContent :editor="editor" class="admin-editor-content" />
    </div>

    <!-- Markdown textarea -->
    <div v-else class="admin-editor-markdown">
      <textarea
        v-model="rawMarkdown"
        class="admin-editor-textarea"
        placeholder="Write your post in Markdown…"
        @input="emit('update:modelValue', rawMarkdown)"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { useEditor, EditorContent } from '@tiptap/vue-3'
import StarterKit from '@tiptap/starter-kit'
import Image from '@tiptap/extension-image'
import { Markdown } from 'tiptap-markdown'

const props = defineProps<{ modelValue: string }>()
const emit = defineEmits<{ (e: 'update:modelValue', v: string): void }>()

const client = useSupabaseClient()
const mode = ref<'visual' | 'markdown'>('visual')
const rawMarkdown = ref(props.modelValue ?? '')

// Image state
const imgFileInput = ref<HTMLInputElement | null>(null)
const imgUrlInput = ref<HTMLInputElement | null>(null)
const imgUploading = ref(false)
const imgError = ref('')
const showImgUrl = ref(false)
const imgUrl = ref('')

const editor = useEditor({
  extensions: [
    StarterKit,
    Image.configure({ inline: false, allowBase64: false }),
    Markdown.configure({ transformPastedText: true }),
  ],
  content: props.modelValue ?? '',
  onUpdate: ({ editor }) => {
    const md = editor.storage.markdown.getMarkdown()
    rawMarkdown.value = md
    emit('update:modelValue', md)
  },
})

watch(() => props.modelValue, (val) => {
  if (!val || val === rawMarkdown.value) return
  rawMarkdown.value = val
  editor.value?.commands.setContent(val)
})

const switchMode = (target: 'visual' | 'markdown') => {
  if (target === mode.value) return
  if (target === 'markdown') {
    if (editor.value) rawMarkdown.value = editor.value.storage.markdown.getMarkdown()
  } else {
    editor.value?.commands.setContent(rawMarkdown.value)
  }
  mode.value = target
}

const uploadImage = async (e: Event) => {
  const file = (e.target as HTMLInputElement).files?.[0]
  if (!file) return
  imgUploading.value = true
  imgError.value = ''

  const ext = file.name.split('.').pop()
  const fileName = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`

  const { error } = await client.storage.from('blog-images').upload(fileName, file, {
    cacheControl: '31536000',
    upsert: false,
    contentType: file.type,
  })

  if (error) {
    imgError.value = error.message
    imgUploading.value = false
    return
  }

  const { data } = client.storage.from('blog-images').getPublicUrl(fileName)
  editor.value?.chain().focus().setImage({ src: data.publicUrl }).run()
  imgUploading.value = false
  if (imgFileInput.value) imgFileInput.value.value = ''
}

const insertImageUrl = () => {
  const url = imgUrl.value.trim()
  if (!url) return
  editor.value?.chain().focus().setImage({ src: url }).run()
  showImgUrl.value = false
  imgUrl.value = ''
}

onBeforeUnmount(() => editor.value?.destroy())
</script>

<style scoped>
.admin-editor {
  border: 1px solid var(--border-color);
  border-radius: 8px;
  overflow: hidden;
  background: var(--bg-primary);
  display: flex;
  flex-direction: column;
  height: 65vh;
  min-height: 500px;
}

.admin-editor-tabs {
  display: flex;
  border-bottom: 1px solid var(--border-color);
  background: var(--bg-secondary);
  flex-shrink: 0;
}

.admin-editor-visual {
  flex: 1;
  display: flex;
  flex-direction: column;
  min-height: 0;
  overflow: hidden;
}

.admin-editor-tab {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  padding: 0.5rem 1rem;
  background: none;
  border: none;
  border-bottom: 2px solid transparent;
  color: var(--text-muted);
  font-size: 0.8rem;
  cursor: pointer;
  transition: all var(--transition-fast);
  font-family: var(--font-body);
}

.admin-editor-tab:hover { color: var(--text-primary); }
.admin-editor-tab.active { color: var(--accent-primary); border-bottom-color: var(--accent-primary); }

.admin-editor-toolbar {
  display: flex;
  align-items: center;
  gap: 0.15rem;
  padding: 0.5rem 0.75rem;
  border-bottom: 1px solid var(--border-color);
  background: var(--bg-secondary);
  flex-wrap: wrap;
  flex-shrink: 0;
}

.admin-editor-toolbar button,
.admin-editor-toolbar-imgbtn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  background: none;
  border: 1px solid transparent;
  border-radius: 4px;
  color: var(--text-muted);
  font-size: 0.8rem;
  cursor: pointer;
  transition: all var(--transition-fast);
  font-family: var(--font-body);
  flex-shrink: 0;
}

.admin-editor-toolbar-imgbtn {
  cursor: pointer;
  user-select: none;
}

.admin-editor-toolbar button:hover:not(:disabled),
.admin-editor-toolbar-imgbtn:not(.disabled):hover {
  background: var(--bg-card);
  color: var(--text-primary);
}

.admin-editor-toolbar button.active { background: var(--accent-subtle); color: var(--accent-primary); border-color: var(--border-hover); }
.admin-editor-toolbar button:disabled { opacity: 0.3; cursor: not-allowed; }
.admin-editor-toolbar-imgbtn.disabled { opacity: 0.4; cursor: not-allowed; }
.admin-editor-toolbar button.toolbar-label { font-size: 0.75rem; font-weight: 700; width: auto; padding: 0 6px; letter-spacing: 0.02em; }

.admin-editor-toolbar-sep {
  width: 1px;
  height: 18px;
  background: var(--border-color);
  margin: 0 0.25rem;
  flex-shrink: 0;
}

/* Image URL bar */
.admin-editor-img-url-bar {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 0.75rem;
  border-bottom: 1px solid var(--border-color);
  background: var(--bg-card);
  animation: slideDown 0.15s ease both;
  flex-shrink: 0;
}

.admin-editor-img-error {
  flex-shrink: 0;
}

@keyframes slideDown {
  from { opacity: 0; transform: translateY(-4px); }
  to   { opacity: 1; transform: translateY(0); }
}

.admin-editor-img-url-input {
  flex: 1;
  background: var(--bg-primary);
  border: 1px solid var(--border-color);
  border-radius: 5px;
  padding: 0.35rem 0.65rem;
  color: var(--text-primary);
  font-size: 0.825rem;
  font-family: var(--font-body);
  outline: none;
}

.admin-editor-img-url-input:focus { border-color: var(--accent-primary); }

.admin-editor-img-url-insert {
  padding: 0.35rem 0.75rem;
  background: var(--accent-primary);
  color: #fff;
  border: none;
  border-radius: 5px;
  font-size: 0.8rem;
  font-family: var(--font-body);
  font-weight: 600;
  cursor: pointer;
  white-space: nowrap;
}

.admin-editor-img-url-insert:disabled { opacity: 0.4; cursor: not-allowed; }

.admin-editor-img-url-cancel {
  background: none;
  border: none;
  color: var(--text-muted);
  font-size: 0.9rem;
  cursor: pointer;
  padding: 0.2rem 0.3rem;
  line-height: 1;
}

.admin-editor-img-url-cancel:hover { color: var(--text-primary); }

.admin-editor-img-error {
  padding: 0.4rem 0.75rem;
  font-size: 0.8rem;
  color: #f87171;
  background: rgba(239,68,68,0.08);
  border-bottom: 1px solid rgba(239,68,68,0.2);
}

/* TipTap content area */
.admin-editor-content {
  flex: 1;
  overflow-y: auto;
  min-height: 0;
  padding: 1rem;
  color: var(--text-primary);
  font-size: 0.9rem;
  line-height: 1.75;
  font-family: var(--font-content);
  scrollbar-width: thin;
  scrollbar-color: var(--border-color) transparent;
}

.admin-editor-content::-webkit-scrollbar        { width: 5px; }
.admin-editor-content::-webkit-scrollbar-track  { background: transparent; }
.admin-editor-content::-webkit-scrollbar-thumb  { background: var(--border-color); border-radius: 99px; }
.admin-editor-content::-webkit-scrollbar-thumb:hover { background: var(--accent-primary); }

.admin-editor-content :deep(.ProseMirror) {
  outline: none;
  min-height: 100%;
}

.admin-editor-content :deep(.ProseMirror p.is-editor-empty:first-child::before) {
  content: attr(data-placeholder);
  color: var(--text-muted);
  pointer-events: none;
  float: left;
  height: 0;
}

.admin-editor-content :deep(h1) { font-size: 1.6rem; font-weight: 700; margin: 1.5rem 0 0.6rem; color: var(--text-primary); font-family: var(--font-display); }
.admin-editor-content :deep(h2) { font-size: 1.3rem; font-weight: 600; margin: 1.25rem 0 0.5rem; color: var(--text-primary); }
.admin-editor-content :deep(h3) { font-size: 1.1rem; font-weight: 600; margin: 1rem 0 0.4rem; color: var(--text-primary); }
.admin-editor-content :deep(h4) { font-size: 0.95rem; font-weight: 600; margin: 0.9rem 0 0.35rem; color: var(--text-secondary); text-transform: uppercase; letter-spacing: 0.05em; }
.admin-editor-content :deep(pre) { background: var(--bg-secondary); border: 1px solid var(--border-color); border-radius: 6px; padding: 0.85rem; font-family: var(--font-mono); font-size: 0.85rem; overflow-x: auto; margin: 0.75rem 0; }
.admin-editor-content :deep(pre code) { background: none; padding: 0; border: none; font-size: inherit; color: inherit; }
.admin-editor-content :deep(code) { font-family: var(--font-mono); font-size: 0.875em; background: var(--bg-secondary); padding: 0.15em 0.4em; border-radius: 3px; border: 1px solid var(--border-color); color: var(--accent-primary); }
.admin-editor-content :deep(blockquote) { border-left: 3px solid var(--accent-primary); padding-left: 1rem; color: var(--text-muted); margin: 0.75rem 0; font-style: italic; }
.admin-editor-content :deep(ul), .admin-editor-content :deep(ol) { padding-left: 1.5rem; }
.admin-editor-content :deep(li) { margin: 0.25rem 0; }
.admin-editor-content :deep(s) { color: var(--text-muted); }
.admin-editor-content :deep(hr) { border: none; border-top: 1px solid var(--border-color); margin: 1.25rem 0; }
.admin-editor-content :deep(img) {
  max-width: 100%;
  height: auto;
  border-radius: 8px;
  border: 1px solid var(--border-color);
  margin: 0.75rem 0;
  display: block;
}
.admin-editor-content :deep(img.ProseMirror-selectednode) {
  outline: 2px solid var(--accent-primary);
  outline-offset: 2px;
}

/* Markdown textarea */
.admin-editor-markdown {
  flex: 1;
  display: flex;
  min-height: 0;
  overflow: hidden;
}

.admin-editor-textarea {
  flex: 1;
  width: 100%;
  padding: 1rem;
  background: transparent;
  border: none;
  color: var(--text-primary);
  font-family: var(--font-mono);
  font-size: 0.875rem;
  line-height: 1.75;
  resize: none;
  box-sizing: border-box;
  overflow-y: auto;
  scrollbar-width: thin;
  scrollbar-color: var(--border-color) transparent;
}

.admin-editor-textarea::-webkit-scrollbar        { width: 5px; }
.admin-editor-textarea::-webkit-scrollbar-track  { background: transparent; }
.admin-editor-textarea::-webkit-scrollbar-thumb  { background: var(--border-color); border-radius: 99px; }
.admin-editor-textarea::-webkit-scrollbar-thumb:hover { background: var(--accent-primary); }

.admin-editor-textarea:focus { outline: none; }

.spin { animation: spin 0.8s linear infinite; }
@keyframes spin { to { transform: rotate(360deg); } }
</style>
