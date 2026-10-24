<template>
    <div class="flex h-screen w-64 flex-col gap-6 border-r border-gray-200 p-6">
        <div class="flex items-center gap-4">
            <div class="flex items-center justify-center bg-blue-600 p-2 rounded-lg">
                <Icon name="lucide:notebook-pen" size="20" class="text-white" />
            </div>
            <span class="text-xl font-semibold">SimpleNote</span>
        </div>

        <button 
            @click="isAddNoteOpen = true"
            class="flex items-center justify-center gap-2 rounded-lg bg-blue-600 p-3 text-white hover:bg-blue-500 cursor-pointer"
        >
            <Icon name="lucide:plus" size="20" />
            Yeni Not
        </button>

        <div class="flex flex-col gap-2">
            <NuxtLink to="/" class="menu-link">
                <Icon name="lucide:file-text" size="20" />
                <span>Tüm Notlar</span>
                <span class="ml-auto">{{ notes.length }}</span>
            </NuxtLink>

            <NuxtLink to="/favorites" class="menu-link">
                <Icon name="lucide:star" size="20" />
                <span>Favoriler</span>
                <span class="ml-auto">{{ favorites.length }}</span>
            </NuxtLink>

            <NuxtLink to="/archives" class="menu-link">
                <Icon name="lucide:archive" size="20" />
                <span>Arşiv</span>
                <span class="ml-auto">{{ archives.length }}</span>
            </NuxtLink>
        </div>

        <div class="mt-auto">
            <NuxtLink to="/settings" class="menu-link">
                <Icon name="lucide:settings" size="20" />
                Ayarlar
            </NuxtLink>
        </div>
    </div>

    <NotesNoteModal
        :open="isAddNoteOpen"
        @close="isAddNoteOpen = false"
    />
</template>

<script setup lang="ts">
const { notes, favorites, archives } = useNoteActions()

const isAddNoteOpen = ref(false)
</script>

<style scoped>
    @reference "tailwindcss";
    
    .menu-link {
        @apply flex items-center gap-3 p-3 rounded-lg;
    }

    .menu-link.router-link-active {
        @apply bg-blue-100 text-blue-600;
    }
</style>