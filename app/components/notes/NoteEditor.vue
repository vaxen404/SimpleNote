<template>
    <div class="flex h-screen min-w-0 flex-1 flex-col gap-6 p-6">
        <div class="flex items-center justify-end gap-3">
            <button 
                class="flex items-center justify-center cursor-pointer rounded-lg border border-gray-200 p-3 hover:bg-gray-100"
                @click="isEditing = true"
            >
                <Icon name="lucide:pencil" size="23" />
            </button>
            
            <button 
                class="group flex items-center justify-center cursor-pointer rounded-lg border border-gray-200 p-3"
                @click="toggleFavorite(note.id)"
            >
                <Icon 
                    :name="isFavorite(note.id) ? 'solar:star-bold' : 'solar:star-linear'" 
                    :class="isFavorite(note.id) ? 'text-yellow-400 group-hover:text-gray-400' : 'text-gray-400 group-hover:text-yellow-400'"
                    size="23"
                />
            </button>

            <button 
                class="flex items-center justify-center cursor-pointer rounded-lg border border-gray-200 p-3 hover:bg-gray-100"
                @click="toggleArchive(note.id)"
            >
                <Icon 
                    :name="isArchived(note.id) ? 'solar:archive-bold' : 'solar:archive-linear'" 
                    size="23" 
                />
            </button>

            <button 
                class="flex items-center justify-center cursor-pointer rounded-lg border border-gray-200 p-3 hover:bg-red-500 hover:text-white"
                @click="deleteNote(note.id)"
            >
                <Icon name="solar:trash-bin-minimalistic-linear" size="23" />
            </button>

            <button 
                @click="isEditing = true"
                class="flex items-center justify-center cursor-pointer rounded-md bg-blue-600 text-white text-lg font-semibold px-6 py-2 hover:bg-blue-500"
            >
                Düzenle
            </button>
        </div>

        <div class="flex flex-col justify-center gap-3 pb-4 border-b border-gray-200">
            <h1 class="text-3xl font-semibold">{{ note.title }}</h1>
            <span class="text-md text-gray-400">{{ note.date }}</span>
        </div>

        <div class="min-h-0 flex-1 overflow-y-auto">
            <div class="markdown-content max-w-3xl">
                <MDC :value="note.content" />
            </div>
        </div>
    </div>

    <NotesNoteModal
        :open="isEditing"
        mode="edit"
        :note="note"
        @close="isEditing = false"
    />
    
</template>

<script setup lang="ts">
const props = defineProps<{
    note: {
        id: string,
        title: string,
        content: string,
        favorite: boolean,
        archived: boolean,
        date: string
    }
}>()

const { toggleFavorite, isFavorite, deleteNote, isArchived ,toggleArchive } = useNoteActions()

const isEditing = ref(false)
</script>

<style scoped>
@reference "tailwindcss";

.markdown-content :deep(h1) {
  @apply my-4 text-3xl font-bold;
}

.markdown-content :deep(h2) {
  @apply my-3 text-2xl font-semibold;
}

.markdown-content :deep(p) {
  @apply my-3 leading-7 text-gray-700;
}

.markdown-content :deep(ul) {
  @apply my-3 list-disc pl-6;
}

.markdown-content :deep(ol) {
  @apply my-3 list-decimal pl-6;
}

.markdown-content :deep(li) {
  @apply my-1;
}
</style>