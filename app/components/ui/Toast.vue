<template>
    <Teleport to="body">
        <div class="fixed bottom-5 right-5 z-50 flex flex-col gap-2">
            <div 
                v-for="toast in toasts"
                :key="toast.id"
                class="flex min-w-72 items-center gap-3 rounded-xl border border-gray-200 bg-white p-4 shadow-lg"
            >
                <Icon
                    :name="toast.type === 'success'
                        ? 'lucide:check-circle'
                        : 'lucide:circle-alert'"
                    :class="toast.type === 'success' ? 'text-green-500' : 'text-red-500'"
                    size: 20
                />

                <span class="flex-1 text-sm text-gray-700">
                    {{ toast.message }}
                </span>

                <button
                    v-if="toast.actionLabel"
                    type="button"
                    :disabled="toast.pending"
                    class="cursor-pointer text-sm font-semibold text-blue-600 disabled:opacity-50"
                    @click="runToastAction(toast.id)"
                >
                    {{ toast.pending ? 'Bekle...' : toast.actionLabel }}
                </button>

                <button
                    type="button"
                    class="cursor-pointer text-gray-400 hover:text-gray-700"
                    @click="closeToast(toast.id)"
                >
                    <Icon name="lucide:x" size="18" />
                </button>
            </div>
        </div>
    </Teleport>
</template>

<script setup lang="ts">
const { toasts, closeToast, runToastAction, resumeToasts } = useToast()

onMounted(resumeToasts)
</script>