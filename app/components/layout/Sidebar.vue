<template>
    <div class="flex h-screen w-64 flex-col gap-6 border-r border-gray-200 p-6">
        <div class="flex items-center gap-4">
            <div class="flex items-center justify-center bg-blue-400 p-2 rounded-lg">
                <Icon name="lucide:notebook-pen" size="20" />
            </div>
            <span class="">SimpleNote</span>
        </div>

        <button class="flex items-center justify-center gap-2 rounded-lg bg-blue-400 p-3 text-white hover:bg-blue-500">
            <Icon name="lucide:plus" size="20" />
            Yeni Not
        </button>

        <div class="flex flex-col gap-2">
            <NuxtLink to="/notes" class="menu-link">
                <Icon name="lucide:file-text" size="20" />
                <span>Tüm Notlar</span>
                <span>{{ notes.length }}</span>
            </NuxtLink>

            <NuxtLink to="/favorites" class="menu-link">
                <Icon name="lucide:star" size="20" />
                <span>Favoriler</span>
                <span>{{ favorites.length }}</span>
            </NuxtLink>

            <NuxtLink to="/archives" class="menu-link">
                <Icon name="lucide:archive" size="20" />
                <span>Arşiv</span>
                {{ archives.length }}
            </NuxtLink>
        </div>

        <div>
            <NuxtLink to="/settings">
                <Icon name="lucide:settings" size="20" />
                Ayarlar
            </NuxtLink>
        </div>
    </div>
</template>

<script setup lang="ts">
const notes = ref([])
const favorites = ref([])
const archives = ref([])
</script>

<style scoped>
@reference "tailwindcss";

.menu-link {
  @apply flex items-center gap-3 p-3 rounded-lg;
}
</style>