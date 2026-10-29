<template>
    <div class="overflow-hidden rounded-xl border border-gray-200">

        <div class="flex items-center justify-between border-b border-gray-200 bg-gray-50 p-2">
            <div class="flex gap-2">
                <button
                    type="button"
                    class="flex items-center cursor-pointer rounded-lg px-4 py-2 text-sm gap-1"
                    :class="activeTab === 'write' ? 'bg-blue-100 text-blue-600' : 'text-gray-500'"
                    @click="activeTab = 'write'"
                >
                    <Icon name="lucide:pencil" size="16" />
                    Yaz
                </button>

                <button
                    type="button"
                    class="flex items-center cursor-pointer rounded-lg px-4 py-2 text-sm gap-1"
                    :class="activeTab === 'preview' ? 'bg-blue-100 text-blue-600' : 'text-gray-500'"
                    @click="activeTab = 'preview'"
                >
                    <Icon name="lucide:eye" size="16" />
                    Önizleme
                </button>
            </div>
        </div>

        <div v-show="activeTab === 'write'">
            <div class="flex flex-wrap items-center gap-1 border-b border-gray-200 p-2">
                <button type="button" class="editor-btn" title="Başlık" @click="insertText('## ')">
                <Icon name="lucide:heading-2" size="18" />
                </button>

                <button type="button" class="editor-btn" title="Kalın" @click="insertText('**', '**')">
                <Icon name="lucide:bold" size="18" />
                </button>

                <button type="button" class="editor-btn" title="İtalik" @click="insertText('*', '*')">
                <Icon name="lucide:italic" size="18" />
                </button>

                <button type="button" class="editor-btn" title="Liste" @click="insertText('- ')">
                <Icon name="lucide:list" size="18" />
                </button>

                <button type="button" class="editor-btn" title="Numaralı liste" @click="insertText('1. ')">
                <Icon name="lucide:list-ordered" size="18" />
                </button>

                <button type="button" class="editor-btn" title="Alıntı" @click="insertText('> ')">
                <Icon name="lucide:quote" size="18" />
                </button>

                <button type="button" class="editor-btn" title="Kod" @click="insertText('`', '`')">
                <Icon name="lucide:code" size="18" />
                </button>

                <button type="button" class="editor-btn" title="Bağlantı" @click="insertText('[', '](https://)')">
                <Icon name="lucide:link" size="18" />
                </button>
            </div>

            <textarea
                ref="textarea"
                v-model="content"
                placeholder="Markdown ile yaz..."
                class="h-64 w-full resize-y p-4 font-mono text-sm leading-7 outline-none"
            />
        </div>

        <div
            v-if="activeTab === 'preview'"
            class="markdown-preview h-84 overflow-y-auto p-4"
        >
            <MDC v-if="content.trim()" :value="content" />

            <p v-else class="text-gray-400">
                Önizlenecek içerik bulunamadı.
            </p>
        </div>
    </div>
</template>

<script setup lang="ts">
const content = defineModel<string>({ default: '' })

const activeTab = ref<'write' | 'preview'>('write')
const textarea = ref<HTMLTextAreaElement | null>(null)

const insertText = async (before: string, after = '') => {
    const element = textarea.value
    if (!element) return

    const start = element.selectionStart
    const end = element.selectionEnd
    const selected = content.value.slice(start, end)
    const inserted = before + selected + after

    content.value = 
        content.value.slice(0, start) +
        inserted +
        content.value.slice(end)

    await nextTick()
    element.setSelectionRange(
        start + before.length,
        start + before.length + selected.length
    )
}
</script>

<style scoped>
@reference "tailwindcss";

.markdown-preview :deep(h2) {
  @apply my-4 text-2xl font-bold;
}

.markdown-preview :deep(ul) {
  @apply my-3 list-disc pl-6;
}

.markdown-preview :deep(li) {
  @apply my-1;
}

.editor-btn {
  @apply flex size-9 cursor-pointer items-center justify-center rounded-lg text-gray-600 hover:bg-blue-100 hover:text-blue-600;
}

.markdown-preview :deep(h1) {
  @apply my-3 text-2xl font-bold;
}

.markdown-preview :deep(h2) {
  @apply my-3 text-xl font-semibold;
}

.markdown-preview :deep(p) {
  @apply my-2;
}

.markdown-preview :deep(ul) {
  @apply my-2 list-disc pl-6;
}

.markdown-preview :deep(ol) {
  @apply my-2 list-decimal pl-6;
}

.markdown-preview :deep(blockquote) {
  @apply my-3 border-l-4 border-blue-400 pl-4 text-gray-500;
}

.markdown-preview :deep(code) {
  @apply rounded bg-gray-100 px-1 font-mono text-sm;
}
</style>