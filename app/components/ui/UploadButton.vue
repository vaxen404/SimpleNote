
<template>
    <div class="inline-flex shrink-0">
        <input
            ref="fileInput"
            type="file"
            class="hidden"
            multiple
            :accept="accept"
            :webkitdirectory="mode === 'folder' ? true : undefined"
            :disabled="disabled"
            @change="handleFileChange"
        />

        <button
            type="button"
            :disabled="disabled"
            @click="openPicker"
            class="flex h-10 min-w-32 items-center justify-between cursor-pointer gap-3 rounded-lg bg-blue-600 px-3 text-sm font-medium text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
            <span class="flex items-center gap-2">
                <Icon
                    name="solar:cloud-upload-bold"
                    size="20"
                />

                <span>{{ text }}</span>
            </span>

            <Icon
                name="solar:alt-arrow-down-linear"
                size="16"
            />
        </button>
    </div>
</template>

<script setup lang="ts">
const props = withDefaults(defineProps<{
    text?: string
    mode?: 'file' | 'folder'
    accept?: string
    disabled?: boolean
}>(), {
    text: 'Upload',
    mode: 'file',
    accept: '.md,.txt',
    disabled: false
})

const emit = defineEmits<{
    files: [files: FileList]
    folder: [files: FileList]
}>()

const fileInput = ref<HTMLInputElement | null>(null)

const openPicker = () => {
    if (props.disabled) return

    fileInput.value?.click()
}

const handleFileChange = (event: Event) => {
    const input = event.target as HTMLInputElement
    const files = input.files

    if (props.disabled || !files?.length) return

    if (props.mode === 'folder') {
        emit('folder', files)
    } else {
        emit('files', files)
    }

    input.value = ''
}
</script>
