<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>

  <div class="pointer-events-none fixed bottom-4 right-4 z-50 flex max-h-[90vh] max-w-[calc(100vw-2rem)] flex-col items-end gap-2 overflow-y-auto">
    <UiToast
      v-for="toast in toasts"
      :key="toast.id"
      :show="true"
      :message="toast.message"
      :type="toast.type"
      :action-label="toast.actionLabel"
      :pending="toast.pending"
      @action="runToastAction(toast.id)"
      @close="closeToast(toast.id)"
    />
  </div>
</template>

<script setup lang="ts">
const { toasts, runToastAction, resumeToasts, closeToast } = useToast()

onMounted(resumeToasts)
</script>

