<template>
    <div class="flex h-screen w-64 flex-col gap-4 border-r border-gray-200 p-4">
        <div class="flex items-center gap-2">
            <img src="/logo.png" alt="Logo" class="size-8 rounded-lg">
            <span class="text-xl font-semibold">SimpleNote</span>
        </div>

        <div class="flex flex-col gap-2">
            <p class="mt-2 text-sm font-semibold text-gray-600">MAIN MENU</p>
            <NuxtLink to="/notes" class="menu-link">
                <Icon name="lucide:file-text" size="20" />
                <span>Notes</span>
                <span class="ml-auto">{{ activeNotes.length }}</span>
            </NuxtLink>

            <NuxtLink to="/favorites" class="menu-link">
                <Icon name="lucide:star" size="20" />
                <span>Favorites</span>
                <span class="ml-auto">{{ favorites.length }}</span>
            </NuxtLink>

            <NuxtLink to="/archives" class="menu-link">
                <Icon name="lucide:archive" size="20" />
                <span>Archives</span>
                <span class="ml-auto">{{ archives.length }}</span>
            </NuxtLink>
        </div>

        <LayoutProfileMenu />
    </div>
</template>

<script setup lang="ts">
const { activeNotes, favorites, archives } = useNoteActions()
</script>

<style scoped>
    @reference "tailwindcss";
    
    .menu-link {
        @apply flex items-center gap-3 p-3 rounded-lg hover:bg-gray-100;
    }

    .menu-link.router-link-active {
        @apply bg-blue-100 text-blue-600 hover:bg-blue-100;
    }
</style>