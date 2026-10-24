<template>
    <Teleport to="body">
        <template v-if="open">
            <div
                class="fixed inset-0 z-40"
                @click="emit('close')"
                @contextmenu.prevent="emit('close')"
            />
            <div
                class="fixed z-50 w-52 rounded-xl border border-gray-200 bg-white p-2 shadow-xl"
                :style="{ left: `${x}px`, top: `${y}px` }"
            >
                <button class="menu-item" @click="emit('edit')">
                    <Icon name="lucide:pencil" size="18" />
                    Düzenle
                </button>

                <button class="menu-item" @click="emit('favorite')">
                    <Icon
                        :name="favorite ? 'solar:star-bold' : 'solar:star-linear'"
                        size="18"
                    />
                    {{ favorite ? 'Favorilerden Çıkar' : 'Favorilere Ekle' }}
                </button>

                <button class="menu-item" @click="emit('archive')">
                    <Icon 
                        :name="archived ? 'solar:archive-bold' : 'solar:archive-linear'" 
                        size="18" 
                    />
                    {{ archived ? 'Arşivden Çıkar' : 'Arşivle' }}
                </button>

                <div class="my-1 border-t border-gray-200"></div>

                <button class="menu-item text-red-500" @click="emit('delete')">
                    <Icon name="lucide:trash-2" size="18" />
                    Sil
                </button>
            </div>
        </template>
    </Teleport>
</template>

<script setup lang="ts">
defineProps<{
    open: boolean
    x: number
    y: number
    favorite: boolean
    archived: boolean
}>()

const emit = defineEmits<{
    close: []
    edit: []
    favorite: []
    archive: []
    delete: []
}>()

const { isArchived } = useNoteActions()

</script>

<style scoped>
@reference "tailwindcss";

.menu-item {
  @apply flex w-full cursor-pointer items-center gap-3 rounded-lg px-3 py-2 text-left text-sm hover:bg-gray-100;
}
</style>