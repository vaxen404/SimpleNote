
<template>
    <Teleport to="body">
        <div
            v-if="open"
            class="fixed inset-0 z-[60] flex items-center justify-center bg-black/40 p-4"
            @click.self="emit('close')"
        >
            <div class="w-full max-w-sm rounded-xl bg-white p-6 shadow-xl">
                <div class="mb-4 flex size-12 items-center justify-center rounded-full bg-red-50">
                    <Icon
                        name="lucide:trash-2"
                        size="24"
                        class="text-red-600"
                    />
                </div>

                <h2 class="text-lg font-semibold text-gray-900">
                    Delete permanently?
                </h2>

                <p class="mt-2 text-sm text-gray-500">
                    This note will be permanently deleted.
                    This action cannot be undone.
                </p>

                <div class="mt-6 flex justify-end gap-3">
                    <button
                        class="cursor-pointer rounded-lg border border-gray-200 px-4 py-2 text-sm hover:bg-gray-100"
                        :disabled="loading"
                        @click="emit('close')"
                    >
                        Cancel
                    </button>

                    <button
                        class="flex cursor-pointer items-center gap-2 rounded-lg bg-red-600 px-4 py-2 text-sm text-white hover:bg-red-700 disabled:opacity-50"
                        :disabled="loading"
                        @click="emit('confirm')"
                    >
                        <Icon
                            v-if="loading"
                            name="lucide:loader-circle"
                            size="18"
                            class="animate-spin"
                        />
                        {{ loading ? 'Deleting...' : 'Delete Permanently' }}
                    </button>
                </div>
            </div>
        </div>
    </Teleport>
</template>

<script setup lang="ts">
defineProps<{
    open: boolean
    loading?: boolean
}>()

const emit = defineEmits<{
    close: []
    confirm: []
}>()
</script>
