
<template>
    <div class="flex h-full min-h-0 w-full flex-col overflow-hidden">
        <LayoutHeaderbar />

        <div class="flex min-h-0 flex-1">
            <div class="flex min-h-0 w-106 shrink-0 flex-col border-r border-gray-200 p-3">
                <div class="flex h-12 items-center gap-2 rounded-xl border border-gray-200 bg-gray-100 p-3">
                    <Icon name="lucide:search" size="20" />

                    <input
                        v-model="searchQuery"
                        type="text"
                        placeholder="Search in trash..."
                        class="min-w-0 flex-1 outline-none"
                    >
                </div>

                <div v-if="!isSelecting" class="mt-3 flex justify-end">
                    <button
                        :disabled="!filteredNotes.length || isProcessing"
                        class="flex cursor-pointer items-center gap-2 rounded-lg border border-gray-200 px-3 py-2 text-sm hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50"
                        @click="startSelection"
                    >
                        <Icon name="lucide:list-checks" size="18" />
                        Select
                    </button>
                </div>

                <div
                    v-else
                    class="mt-3 flex flex-col gap-3 rounded-lg bg-blue-50 p-3"
                >
                    <div class="flex items-center justify-between gap-2">
                        <span class="whitespace-nowrap rounded-full bg-blue-100 px-2.5 py-1 text-sm font-semibold text-blue-700">
                            {{ selectedNoteIds.length }} selected
                        </span>

                        <div class="flex items-center gap-2">
                            <button
                                :disabled="isProcessing"
                                class="cursor-pointer text-xs font-medium text-blue-600 hover:text-blue-800 disabled:opacity-50"
                                @click="selectAllNotes"
                            >
                                Select All
                            </button>

                            <div class="h-5 w-px bg-gray-200"></div>

                            <button
                                :disabled="isProcessing"
                                class="cursor-pointer text-xs font-semibold text-gray-500 hover:text-gray-800 disabled:opacity-50"
                                @click="cancelSelection"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>

                    <div class="flex items-center gap-2">
                        <button
                            :disabled="!selectedNoteIds.length || isProcessing"
                            class="flex flex-1 cursor-pointer items-center justify-center gap-2 rounded-lg border border-gray-200 bg-white px-3 py-2 text-xs font-medium hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50"
                            @click="restoreSelectedNotes"
                        >
                            <Icon name="lucide:rotate-ccw" size="16" />
                            Restore Selected
                        </button>

                        <button
                            :disabled="!selectedNoteIds.length || isProcessing"
                            class="flex flex-1 cursor-pointer items-center justify-center gap-2 rounded-lg border border-red-200 bg-white px-3 py-2 text-xs font-medium text-red-600 hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
                            @click="confirmDeleteSelected"
                        >
                            <Icon name="lucide:trash-2" size="16" />
                            Delete Selected
                        </button>
                    </div>
                </div>

                <div class="mt-2 flex min-h-0 flex-1 flex-col gap-2 overflow-y-auto pt-4">
                    <div
                        v-for="note in filteredNotes"
                        :key="note.id"
                        class="flex cursor-pointer items-center gap-4 rounded-lg border p-4"
                        :class="selectedNoteIds.includes(note.id) && isSelecting
                            ? 'border-blue-200 bg-blue-50'
                            : activeNoteId === note.id && !isSelecting
                                ? 'border-blue-100 border-l-4 border-l-blue-500 bg-blue-50'
                                : 'border-gray-200 hover:bg-gray-100'"
                        @click="handleNoteClick(note.id)"
                        @contextmenu.prevent="!isSelecting && openContextMenu($event, note.id)"
                    >
                        <input
                            v-if="isSelecting"
                            type="checkbox"
                            :checked="selectedNoteIds.includes(note.id)"
                            :disabled="isProcessing"
                            class="mt-1 size-4 shrink-0 cursor-pointer accent-blue-600"
                            @click.stop="toggleNoteSelection(note.id)"
                        >

                        <div class="min-w-0 flex-1">
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
                                ? 'No results found'
                                : 'Trash is empty' }}
                        </h2>

                        <p class="text-sm text-gray-400">
                            {{ searchQuery.trim()
                                ? 'No notes match your search.'
                                : 'Deleted notes will appear here.' }}
                        </p>
                    </div>
                </div>
            </div>

            <div class="flex min-w-0 flex-1 flex-col">
                <div class="flex items-center justify-between border-b border-gray-200 p-3">
                    <div class="flex items-center gap-2 text-gray-500">
                        <Icon name="lucide:trash-2" />
                        Trash
                    </div>

                    <div class="flex items-center gap-2">
                        <button
                            :disabled="!trash.length || isProcessing"
                            class="flex cursor-pointer items-center gap-2 rounded-lg border border-gray-200 px-3 py-2 text-sm hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50"
                            @click="restoreAllNotes"
                        >
                            <Icon name="lucide:rotate-ccw" size="18" />
                            Restore All
                        </button>

                        <button
                            :disabled="!trash.length || isProcessing"
                            class="flex cursor-pointer items-center gap-2 rounded-lg border border-red-200 bg-red-500 px-3 py-2 text-sm text-white hover:bg-red-600 disabled:cursor-not-allowed disabled:opacity-50"
                            @click="confirmDeleteAll"
                        >
                            <Icon name="lucide:trash-2" size="18" />
                            Delete All
                        </button>
                    </div>
                </div>

                <template v-if="selectedNote">
                    <div class="min-h-0 flex-1 overflow-y-auto p-6">
                        <div class="flex flex-wrap items-center justify-end gap-3">
                            <button
                                :disabled="isProcessing"
                                class="flex cursor-pointer items-center gap-2 rounded-lg border border-gray-200 px-3 py-2 text-sm hover:bg-gray-100 disabled:opacity-50"
                                @click="restoreSingleNote(selectedNote.id)"
                            >
                                <Icon name="lucide:rotate-ccw" size="18" />
                                Restore
                            </button>

                            <button
                                :disabled="isProcessing"
                                class="flex cursor-pointer items-center gap-2 rounded-lg border border-red-200 px-3 py-2 text-sm text-red-600 hover:bg-red-50 disabled:opacity-50"
                                @click="confirmDeleteSingle(selectedNote.id)"
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
                                ? 'No results found'
                                : 'Trash is empty'
                            : 'Select a note' }}
                    </h2>

                    <p class="text-sm text-gray-400">
                        {{ filteredNotes.length === 0
                            ? searchQuery.trim()
                                ? 'No notes match your search.'
                                : 'Deleted notes will appear here.'
                            : 'Select a note from the list to view it.' }}
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

        <NotesDeleteModal
            :open="pendingDeleteIds.length > 0"
            :loading="isDeleting"
            @close="closeDeleteModal"
            @confirm="confirmDelete"
        />
    </div>
</template>

<script setup lang="ts">
const {
    trash,
    fetchNotes,
    restoreNote,
    permanentlyDeleteNote
} = useNoteActions()

await fetchNotes()

const searchQuery = ref('')
const activeNoteId = ref<string | null>(null)

const isSelecting = ref(false)
const selectedNoteIds = ref<string[]>([])

const pendingDeleteIds = ref<string[]>([])

const isProcessing = ref(false)
const isDeleting = ref(false)

const filteredNotes = computed(() => {
    const query = searchQuery.value.trim().toLowerCase()

    return trash.value.filter(note =>
        note.title.toLowerCase().includes(query)
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

watch(trash, list => {
    const validIds = new Set(list.map(note => note.id))

    selectedNoteIds.value = selectedNoteIds.value.filter(
        id => validIds.has(id)
    )
})

const formatDate = (date: string | null) => {
    if (!date) return 'Unknown'

    const parsed = new Date(date)

    if (Number.isNaN(parsed.getTime())) {
        return 'Unknown'
    }

    return parsed.toLocaleDateString('en-US')
}

const handleNoteClick = (noteId: string) => {
    if (isProcessing.value) return

    if (isSelecting.value) {
        toggleNoteSelection(noteId)
        return
    }

    activeNoteId.value = noteId
}

const startSelection = () => {
    if (isProcessing.value) return

    isSelecting.value = true
    selectedNoteIds.value = []
}

const cancelSelection = () => {
    if (isProcessing.value) return

    isSelecting.value = false
    selectedNoteIds.value = []
}

const toggleNoteSelection = (noteId: string) => {
    if (!isSelecting.value || isProcessing.value) return

    const index = selectedNoteIds.value.indexOf(noteId)

    if (index === -1) {
        selectedNoteIds.value.push(noteId)
    } else {
        selectedNoteIds.value.splice(index, 1)
    }
}

const selectAllNotes = () => {
    if (isProcessing.value) return

    const visibleIds = filteredNotes.value.map(note => note.id)

    selectedNoteIds.value = [
        ...new Set([
            ...selectedNoteIds.value,
            ...visibleIds
        ])
    ]
}

const restoreSingleNote = async (noteId: string) => {
    if (isProcessing.value) return

    isProcessing.value = true

    try {
        await restoreNote(noteId)
    } catch (error) {
        console.error('Restore failed:', error)
    } finally {
        isProcessing.value = false
    }
}

const restoreSelectedNotes = async () => {
    if (!selectedNoteIds.value.length || isProcessing.value) return

    isProcessing.value = true

    try {
        const ids = [...selectedNoteIds.value]

        for (const id of ids) {
            await restoreNote(id)
        }

        isSelecting.value = false
        selectedNoteIds.value = []
    } catch (error) {
        console.error('Restore selected failed:', error)
    } finally {
        isProcessing.value = false
    }
}

const restoreAllNotes = async () => {
    if (!trash.value.length || isProcessing.value) return

    isProcessing.value = true

    try {
        const ids = trash.value.map(note => note.id)

        for (const id of ids) {
            await restoreNote(id)
        }

        isSelecting.value = false
        selectedNoteIds.value = []
    } catch (error) {
        console.error('Restore all failed:', error)
    } finally {
        isProcessing.value = false
    }
}

const contextMenu = ref<{
    id: string
    x: number
    y: number
} | null>(null)

const openContextMenu = (event: MouseEvent, id: string) => {
    if (isProcessing.value) return

    const menuWidth = 208
    const menuHeight = 110

    contextMenu.value = {
        id,
        x: Math.max(
            8,
            Math.min(event.clientX, window.innerWidth - menuWidth - 8)
        ),
        y: Math.max(
            8,
            Math.min(event.clientY, window.innerHeight - menuHeight - 8)
        )
    }
}

const closeContextMenu = () => {
    contextMenu.value = null
}

const handleRestore = async () => {
    const id = contextMenu.value?.id

    closeContextMenu()

    if (!id) return

    await restoreSingleNote(id)
}

const handleDelete = () => {
    const id = contextMenu.value?.id

    closeContextMenu()

    if (!id) return

    confirmDeleteSingle(id)
}

const confirmDeleteSingle = (noteId: string) => {
    if (isProcessing.value) return

    pendingDeleteIds.value = [noteId]
}

const confirmDeleteSelected = () => {
    if (!selectedNoteIds.value.length || isProcessing.value) return

    pendingDeleteIds.value = [...selectedNoteIds.value]
}

const confirmDeleteAll = () => {
    if (!trash.value.length || isProcessing.value) return

    pendingDeleteIds.value = trash.value.map(note => note.id)
}

const closeDeleteModal = () => {
    if (isDeleting.value) return

    pendingDeleteIds.value = []
}

const confirmDelete = async () => {
    if (!pendingDeleteIds.value.length || isProcessing.value) return

    const ids = [...pendingDeleteIds.value]

    isProcessing.value = true
    isDeleting.value = true

    try {
        for (const id of ids) {
            await permanentlyDeleteNote(id)
        }

        pendingDeleteIds.value = []
        isSelecting.value = false
        selectedNoteIds.value = []
    } catch (error) {
        console.error('Permanent delete failed:', error)
    } finally {
        isDeleting.value = false
        isProcessing.value = false
    }
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
