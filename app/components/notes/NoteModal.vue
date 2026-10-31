<template>
    <Teleport to="body">
        <div 
            v-if="open" 
            class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
            @pointerdown.self="startedOnBackdrop = true"
            @pointerdown.capture="startedOnBackdrop = $event.target === $event.currentTarget"
            @click.self="startedOnBackdrop && close()"
        >
            <div class="flex max-h-[90vh] w-full max-w-2xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl">
                <div class="flex items-center justify-between p-6">
                    <div class="flex items-center gap-3">
                        <div class="flex size-12 items-center justify-center rounded-xl bg-blue-100 text-blue-600">
                            <Icon name="solar:notebook-linear" size="24" />
                        </div>
    
                        <div>
                            <h2 class="text-xl font-semibold text-gray-900">
                                {{ mode === 'edit' ? 'Notunu Düzenle' : 'Yeni Not' }}
                            </h2>
                            <p class="text-sm text-gray-500">
                                Düşüncelerini yaz, planlarını kaydet.
                            </p>
                        </div>
                    </div>

                    <button
                        class="flex size-9 cursor-pointer items-center justify-center rounded-lg bg-gray-100 border border-gray-200 text-gray-500 hover:bg-gray-200"
                        @click="close"
                    >
                        <Icon name="lucide:x" size="20" />
                    </button>
                </div>

                <form class="flex min-h-0 flex-1 flex-col gap-3 overflow-y-auto px-6 pb-6" @submit.prevent="submit">
                    <div>   
                        <label class="mb-1 block font-semibold">
                            Başlık
                        </label>

                        <input
                            v-model="title"
                            type="text"
                            maxlength="32"
                            placeholder="Not başlığı..."
                            class="w-full rounded-xl border bg-gray-50 px-4 py-3 outline-none focus:border-blue-500"
                            :class="errors.title ? 'border-red-500' : 'border-gray-200'"
                        >

                        <p
                            v-if="errors.title"
                            class="mt-2 flex items-center gap-1.5 text-sm font-medium text-red-600"
                        >
                            <Icon name="lucide:circle-alert" size="16" />
                            {{ errors.title }}
                        </p>

                        <p 
                            class="mt-1 text-right text-sm text-gray-400"
                        >
                            {{ title.length }}/32
                        </p>
                    </div>

                    <div>
                        <label class="mb-1 block font-semibold">
                            İçerik
                        </label>

                        <div
                            class="overflow-hidden rounded-xl border"
                            :class="errors.content ? 'border-red-500' : 'border-gray-200'"
                        >
                            <EditorMarkdownEditor v-model="content" />
                        </div>

                        <p
                            v-if="errors.content"
                            class="mt-2 flex items-center gap-1.5 text-sm font-medium text-red-600"
                        >
                            <Icon name="lucide:circle-alert" size="16" />
                            {{ errors.content }}
                        </p>

                        <p class="mt-1 text-right text-sm text-gray-400">
                            {{ content.length }} karakter
                        </p>
                    </div>

                    <div class="flex justify-end gap-3 border-t border-gray-100 pt-5">
                        <button
                            type="button"
                            class="cursor-pointer rounded-lg border border-gray-200 px-5 py-2.5 font-medium hover:bg-gray-100" 
                            @click="close"
                        >
                            İptal
                        </button>

                        <button
                            type="submit"
                            :disabled="isSubmitting"
                            class="cursor-pointer rounded-lg bg-blue-600 px-6 py-2.5 font-medium text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            {{ isSubmitting ? 'Kaydediliyor...' : mode === 'edit' ? 'Kaydet' : 'Oluştur' }}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    </Teleport>
</template>

<script setup lang="ts">
const props = defineProps<{
    open: boolean
    mode?: 'add' | 'edit'
    note?: {
        id: string
        title: string
        content: string
        favorite: boolean
        archived: boolean
        isTrashed: boolean
        trashedAt: string | null
        createdAt: string
        updatedAt: string
    }
}>()

const emit = defineEmits(['close'])

const { addNote, saveNote } = useNoteActions()
const { openToast } = useToast()

const startedOnBackdrop = ref(false)

const title = ref('')
const content = ref('')

const errorMessage = ref('')
const isSubmitting = ref(false)


const errors = ref({
    title: '',
    content: ''
})

watch(
    () => [props.open, props.note, props.mode] as const,
    () => {
        if (!props.open) return

        errors.value = {
            title: '',
            content: ''
        }

        title.value = props.mode === 'edit'
            ? props.note?.title ?? ''
            : ''
        
        content.value = props.mode === 'edit'
            ? props.note?.content ?? ''
            : ''
    }, 
    { immediate: true }
)


const submit = async () => {
    if (isSubmitting.value) return

    errors.value = {
        title: '',
        content: ''
    }

    const result = createNoteSchema.safeParse({
        title: title.value,
        content: content.value
    })

    if (!result.success) {
        const fieldErrors = result.error.flatten().fieldErrors

        errors.value.title = fieldErrors.title?.[0] ?? ''
        errors.value.content = fieldErrors.content?.[0] ?? ''

        return
    }

    isSubmitting.value = true

    try {
        if (props.mode === 'edit' && props.note) {
            await saveNote({
                ...props.note,
                title: result.data.title,
                content: result.data.content
            })
        } else {
            await addNote(
                result.data.title,
                result.data.content
            )
        }

        close()
    } catch (err) {
        console.error('Note save error:', err)
        openToast('Not kaydedilirken bir hata oluştu.', 'error')
    } finally {
        isSubmitting.value = false
    }
}

const close = () => {
    title.value = ''
    content.value = ''

    errors.value = {
        title: '',
        content: ''
    }

    emit('close')
}

watch(title, () => {
    errors.value.title = ''
})

watch(content, () => {
    errors.value.content = ''
})

</script>