
<template>
    <Teleport to="body">
        <div class="fixed bottom-5 right-5 z-50 flex flex-col gap-2">
            <div
                v-for="toast in toasts"
                :key="toast.id"
                class="flex min-w-72 max-w-md items-center gap-3 rounded-xl border p-4 shadow-lg"
                :class="toast.type === 'success'
                    ? 'border-green-200 bg-green-50'
                    : 'border-red-200 bg-red-50'"
            >
                <div
                    class="flex size-9 shrink-0 items-center justify-center rounded-full"
                    :class="toast.type === 'success'
                        ? 'bg-green-100 text-green-600'
                        : 'bg-red-100 text-red-600'"
                >
                    <Icon
                        :name="toast.type === 'success'
                            ? 'lucide:check'
                            : 'lucide:circle-alert'"
                        size="20"
                    />
                </div>

                <span
                    class="flex-1 text-sm font-medium"
                    :class="toast.type === 'success'
                        ? 'text-green-800'
                        : 'text-red-800'"
                >
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
