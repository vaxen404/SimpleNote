<template>
<div class="flex min-h-screen w-full">
    
    <div class="flex h-screen w-96 flex-col border-r border-gray-200 p-3">
        <div class="flex w-full h-12 items-center gap-2 rounded-xl bg-gray-100 border border-gray-200 p-3">
            <Icon name="lucide:search" size="20"/>
            <input 
                type="text"
                v-model="searchQuery"
                placeholder="Notlarda ara..."
                class="h-full min-w-0 flex-1 outline-none"
            >
        </div>
    
        <div class="flex min-h-0 flex-1 flex-col gap-2 overflow-y-auto pt-4"> 
            <div 
                v-for="note in filteredNotes" 
                :key="note.id" 
                @click="activeNoteId = note.id"
                :class="activeNoteId === note.id 
                    ? 'bg-blue-50 border-l-4 border-l-blue-500 border-blue-100' 
                    : 'border border-gray-200 hover:bg-gray-100'"
                class="cursor-pointer rounded-lg border p-4"
                @contextmenu.prevent="openContextMenu($event, note.id)"
            >
                <div class="flex items-center justify-between">
                    <h3 class="font-semibold">{{ note.title }}</h3>
    
                    <Icon
                        @click.stop="toggleFavorite(note.id)"
                        :name="isFavorite(note.id) ? 'solar:star-bold' : 'solar:star-linear'"
                        :class="isFavorite(note.id) ? 'text-yellow-400' : 'text-gray-400 hover:text-yellow-400'"
                        size="18"
                    />
                </div>
    
                <p class="mt-1 truncate text-sm text-gray-500">
                    {{ note.content }}
                </p>
    
                <p class="mt-1 text-xs text-gray-400">
                    {{ note.date }}
                </p>
            </div>
        </div>
    </div>

    <NotesNoteEditor
        v-if="selectedNote"
        :note="selectedNote"
    />

    <div v-else class="flex flex-1 items-center justify-center">
        Bir not seç.
    </div>

    <NotesNoteContextMenu
        v-if="contextMenu && contextNote"
        :open="true"
        :x="contextMenu.x"
        :y="contextMenu.y"
        :favorite="contextNote.favorite"
        :archived="contextNote.archived"
        @close="closeContextMenu"
        @edit="editFromContextMenu"
        @favorite="handleContextAction('favorite')"
        @archive="handleContextAction('archive')"
        @delete="handleContextAction('delete')"
    />

    <NotesNoteModal
        v-if="noteToEdit"
        :open="isContextEditing"
        mode="edit"
        :note="noteToEdit"
        @close="isContextEditing = false"
    />


</div>
</template>


<script setup lang="ts">
const props = defineProps<{
    favoritesOnly?: boolean
    archivesOnly?: boolean
}>()

const { notes, toggleFavorite, isFavorite, deleteNote, toggleArchive } = useNoteActions()

const searchQuery = ref('') 


const filteredNotes = computed(() => {
    return notes.value.filter(note => {
        const matchesSearch = note.title
        .toLowerCase()
        .includes(searchQuery.value.toLowerCase())
        
        const matchesFavorite = !props.favoritesOnly || note.favorite
        
        const matchesArchived = props.archivesOnly
        ? note.archived 
        : !note.archived
        
        return matchesSearch && matchesFavorite && matchesArchived
    })
}) 

watch(filteredNotes, () => {
    if (!filteredNotes.value.some(note => note.id === activeNoteId.value)) {
        activeNoteId.value = filteredNotes.value[0]?.id ?? null
    }
})

const activeNoteId = ref<string | null>(filteredNotes.value[0]?.id ?? null)

const selectedNote = computed(() => {
    return notes.value.find(note => note.id === activeNoteId.value)
})

watch(notes, () => {
    if (!notes.value.some(note => note.id === activeNoteId.value)) {
        activeNoteId.value = notes.value[0]?.id ?? null
    }
})

const contextMenu = ref<{
    id: string
    x: number
    y: number
} | null>(null)

const contextNote = computed(() => 
    notes.value.find(note => note.id === contextMenu.value?.id)
)

const openContextMenu = (event: MouseEvent, id: string) => {
    event.preventDefault()

    const menuWidth = 208
    const menuHeight = 210

    contextMenu.value = {
        id,
        x: Math.max(8, Math.min(event.clientX, window.innerWidth - menuWidth - 8)),
        y: Math.max(8, Math.min(event.clientY, window.innerHeight - menuHeight - 8))
    }
}

const closeContextMenu = () => {
    contextMenu.value = null
}

const handleContextAction = (
    action: 'favorite' | 'archive' | 'delete'
) => {
    const note = contextNote.value

    if (!note) return

    if (action === 'favorite') toggleFavorite(note.id)
    if (action === 'archive') toggleArchive(note.id)
    if (action === 'delete') deleteNote(note.id)

    closeContextMenu()
}

const isContextEditing = ref(false)

const editingNoteId = ref<string | null>(null)

const noteToEdit = computed(() => 
    notes.value.find(note => note.id === editingNoteId.value)
)

const editFromContextMenu = () => {
    if (!contextNote.value) return

    editingNoteId.value = contextNote.value.id
    isContextEditing.value = true

    closeContextMenu()
}
</script>