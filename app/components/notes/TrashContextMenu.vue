<template>
    <Teleport to="body">
        <template v-if="open">
            <div
                class="fixed inset-0 z-40"
                @click="emit('close')"
                @contextmenu.prevent="emit('close')"
            >
                <div
                    class="fixed z-50 w-52 rounded-xl border border-gray-200 bg-white p-2 shadow-xl"
                    :style="{ left: `${x}px`, top: `${y}px` }"
                >
                    <button
                        class="menu-item"
                        @click="emit('restore')"
                    >
                        <Icon name="lucide:rotate-ccw" size="18" />
                        Restore
                    </button>

                    <div class="my-1 border-t border-gray-200" />

                    <button
                        class="menu-item text-red-600 hover:bg-red-50"
                        @click="emit('delete')"
                    >
                        <Icon name="lucide:trash-2" size="18" />
                        Delete Permanently
                    </button>
                </div>
            </div>
        </template>
    </Teleport>
</template>

<script setup lang="ts">
defineProps<{
    open: boolean
    x: number
    y: number
}>()

const emit = defineEmits<{
    close: []
    restore: []
    delete: []
}>()
</script>

<style scoped>
@reference "tailwindcss";

.menu-item {
    @apply flex w-full cursor-pointer items-center gap-3 rounded-lg px-3 py-2 text-left text-sm hover:bg-gray-100;
}
</style>