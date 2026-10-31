
<template>
    <div class="flex h-full min-h-0 w-full flex-col overflow-hidden">
        <LayoutHeaderbar />

        <div class="flex min-h-0 flex-1">
            <div class="flex min-h-0 w-96 shrink-0 flex-col border-r border-gray-200 p-3">
                <div class="flex h-12 items-center gap-2 rounded-xl border border-gray-200 bg-gray-100 p-3">
                    <Icon name="lucide:search" size="20" />

                    <input
                        v-model="searchQuery"
                        type="text"
                        placeholder="Çöp kutusunda ara..."
                        class="min-w-0 flex-1 outline-none"
                    >
                </div>

                <div class="flex min-h-0 flex-1 flex-col gap-2 overflow-y-auto pt-4">
                    <div
                        v-for="note in filteredNotes"
                        :key="note.id"
                        class="cursor-pointer rounded-lg border p-4"
                        :class="activeNoteId === note.id
                            ? 'border-blue-100 border-l-4 border-l-blue-500 bg-blue-50'
                            : 'border-gray-200 hover:bg-gray-100'"
                        @click="activeNoteId = note.id"
                        @contextmenu.prevent="openContextMenu($event, note.id)"
                    >
                        <h3 class="truncate font-semibold">
                            {{ note.title }}
                        </h3>

                        <p class="mt-1 truncate text-sm text-gray-500">
                            {{ note.content }}
                        </p>

                        <p class="mt-1 text-xs text-gray-400">
                            {{ formatDate(note.trashedAt) }}
                        </p>
                    </div>

                    <div
                        v-if="filteredNotes.length === 0"
                        class="mt-6 flex flex-1 flex-col items-center gap-2 text-center"
                    >
                        <Icon
                            :name="searchQuery.trim()
                                ? 'solar:magnifer-linear'
                                : 'lucide:trash-2'"
                            size="40"
                            class="text-gray-400"
                        />

                        <h2 class="font-medium text-gray-700">
                            {{ searchQuery.trim()
                                ? 'Sonuç bulunamadı'
                                : 'Çöp kutusu boş' }}
                        </h2>

                        <p class="text-sm text-gray-400">
                            {{ searchQuery.trim()
                                ? 'Aramanla eşleşen not bulunamadı.'
                                : 'Sildiğin notlar burada görünür.' }}
                        </p>
                    </div>
                </div>
            </div>

            <div class="flex min-w-0 flex-1 flex-col">
                <template v-if="selectedNote">
                    <div class="min-h-0 flex-1 overflow-y-auto p-6">
                        <div class="flex flex-wrap items-center justify-end gap-3">
                            <button
                                class="flex cursor-pointer items-center gap-2 border border-gray-200 rounded-lg px-3 py-2 text-sm hover:bg-gray-100"
                                
                            >
                                <Icon name="lucide:rotate-ccw" size="18" />
                                Restore
                            </button>

                            <button
                                class="flex cursor-pointer items-center gap-2 border border-red-200 rounded-lg px-3 py-2 text-sm text-red-600 hover:bg-red-50"
                                
                            >
                                <Icon name="lucide:trash-2" size="18" />
                                Delete Permanently
                            </button>
                        </div>

                        <div class="mt-6 flex flex-col gap-3 border-b border-gray-200 pb-4">
                            <h1 class="break-words text-3xl font-semibold">
                                {{ selectedNote.title }}
                            </h1>

                            <span class="text-sm text-gray-400">
                                {{ formatDate(selectedNote.createdAt) }}
                            </span>
                        </div>

                        <div class="mt-8">
                            <div class="markdown-content max-w-3xl">
                                <MDC :value="selectedNote.content" />
                            </div>
                        </div>
                    </div>
                </template>

                <div
                    v-else
                    class="flex flex-1 flex-col items-center justify-center gap-3 text-center"
                >
                    <Icon
                        :name="filteredNotes.length === 0
                            ? searchQuery.trim()
                                ? 'solar:magnifer-linear'
                                : 'lucide:trash-2'
                            : 'solar:document-text-linear'"
                        size="52"
                        class="text-gray-400"
                    />

                    <h2 class="text-lg font-semibold text-gray-700">
                        {{ filteredNotes.length === 0
                            ? searchQuery.trim()
                                ? 'Sonuç bulunamadı'
                                : 'Çöp kutusu boş'
                            : 'Bir not seç' }}
                    </h2>

                    <p class="text-sm text-gray-400">
                        {{ filteredNotes.length === 0
                            ? searchQuery.trim()
                                ? 'Aramanla eşleşen not bulunamadı.'
                                : 'Sildiğin notlar burada görünür.'
                            : 'Görüntülemek için listeden bir not seç.' }}
                    </p>
                </div>
            </div>
        </div>

        <NotesTrashContextMenu
            v-if="contextMenu"
            :open="true"
            :x="contextMenu.x"
            :y="contextMenu.y"
            @close="closeContextMenu"
            @restore="handleRestore"
            @delete="handleDelete"
        />
    </div>

    <NotesDeleteModal
        :open="pendingDeleteId !== null"
        :loading="isDeleting"
        @close="pendingDeleteId = null"
        @confirm="confirmDelete"
    />
</template>

<script setup lang="ts">
const { trash, fetchNotes } = useNoteActions()

await fetchNotes()

const searchQuery = ref('')
const activeNoteId = ref<string | null>(null)

const filteredNotes = computed(() => {
    return trash.value.filter(note =>
        note.title.toLowerCase().includes(
            searchQuery.value.trim().toLowerCase()
        )
    )
})

const selectedNote = computed(() =>
    filteredNotes.value.find(
        note => note.id === activeNoteId.value
    )
)

watch(filteredNotes, list => {
    if (
        activeNoteId.value &&
        !list.some(note => note.id === activeNoteId.value)
    ) {
        activeNoteId.value = null
    }
})

const formatDate = (date: string | null) => {
    if (!date) return 'Bilinmiyor'

    const parsed = new Date(date)

    if (Number.isNaN(parsed.getTime())) return 'Bilinmiyor'

    return parsed.toLocaleDateString('tr-TR')
}

const contextMenu = ref<{
    id: string
    x: number
    y: number
} | null>(null)

const openContextMenu = (event: MouseEvent, id: string) => {
    const menuWidth = 208
    const menuHeight = 110

    contextMenu.value = {
        id,
        x: Math.max(8, Math.min(event.clientX, window.innerWidth - menuWidth - 8)),
        y: Math.max(8, Math.min(event.clientY, window.innerHeight - menuHeight- 8))
    }
}

const closeContextMenu = () => {
    contextMenu.value = null
}

const pendingDeleteId = ref<string | null>(null)
const isDeleting = ref(false)

const handleRestore = () => {
    const id = contextMenu.value?.id

    closeContextMenu()

    if (!id) return

    
}

const handleDelete = () => {
    const id = contextMenu.value?.id

    closeContextMenu()

    if (!id) return

    pendingDeleteId.value = id
}

const confirmDelete = () => {
    if (!pendingDeleteId.value) return

    console.log('Permanently delete:', pendingDeleteId.value)

    pendingDeleteId.value = null
}
</script>

<style scoped>
@reference "tailwindcss";

.markdown-content :deep(h1) {
    @apply mb-4 text-3xl font-bold;
}

.markdown-content :deep(h2) {
    @apply my-3 text-2xl font-semibold;
}

.markdown-content :deep(h3) {
    @apply my-2 text-xl font-semibold;
}

.markdown-content :deep(p) {
    @apply my-3 leading-7;
}

.markdown-content :deep(ul) {
    @apply my-3 list-disc pl-6;
}

.markdown-content :deep(ol) {
    @apply my-3 list-decimal pl-6;
}

.markdown-content :deep(pre) {
    @apply my-4 overflow-x-auto rounded-lg bg-gray-900 p-4 text-sm text-white;
}

.markdown-content :deep(code) {
    @apply rounded bg-gray-100 px-1 py-0.5 text-sm;
}

.markdown-content :deep(pre code) {
    @apply bg-transparent p-0 text-inherit;
}

.markdown-content :deep(blockquote) {
    @apply my-4 border-l-4 border-gray-300 pl-4 text-gray-500;
}
</style>