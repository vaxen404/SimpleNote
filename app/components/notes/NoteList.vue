<template>
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

    <div class="flex flex-col gap-2 pt-4"> 
        <div 
            v-for="note in filteredNotes" 
            :key="note.id" 
            @click="
                activeNoteId = note.id;
                emit('select', note.id);
            "
            :class="activeNoteId === note.id 
                ? 'bg-blue-50 border-l-4 border-l-blue-500 border-blue-100' 
                : 'border border-gray-200 hover:bg-gray-100'"
            class="cursor-pointer rounded-lg border p-4"
        >
            <div class="flex items-center justify-between">
                <h3 class="font-semibold">{{ note.title }}</h3>

                <Icon
                    @click.stop="toggleFavorite(note.id)"
                    :name="isFavorite(note.id) ? 'solar:star-bold' : 'solar:star-linear'"
                    :class="isFavorite(note.id) ? 'text-yellow-400' : 'text-gray-400'"
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
</template>


<script setup lang="ts">
const emit = defineEmits<{
    select: [ id: string ]
}>()

const searchQuery = ref('') 

const activeNoteId = ref<string | null>(null)

const filteredNotes = computed(() => {
    return notes.value.filter(
        note => note.title.toLowerCase().includes(searchQuery.value.toLowerCase())
    )
}) 

const { notes, toggleFavorite, isFavorite } = useNoteActions()
</script>