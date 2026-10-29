<template>
    <header class="flex h-16 w-full items-center justify-between border-b border-gray-200 px-4">
        <h2 class="text-lg font-semibold text-gray-800">
            {{ pageTitle }}
        </h2>

        <div class="flex justify-center gap-2">
            <UiUploadButton
                text="Upload"
                accept=".md,.txt"
                :disabled="isImporting"
                @files="handleImport"
            />

            <button 
                @click="isAddNoteOpen = true"
                class="flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-3 py-2 font-semibold text-white hover:bg-blue-700 cursor-pointer"
            >
                <Icon name="lucide:plus" size="20" />
                New Note
            </button>
        </div>
    </header>

    <NotesNoteModal
        :open="isAddNoteOpen"
        @close="isAddNoteOpen = false"
    />
</template>

<script setup lang="ts">
const route = useRoute()

const pageTitle = computed(() => {
    if (route.path === '/favorites') return 'Favorites'
    if (route.path === '/archives') return 'Archives'
    return 'Notes'
})

const { addNote } = useNoteActions()
const { openToast } = useToast()

const isAddNoteOpen = ref(false)
const isImporting = ref(false)


const handleImport = async (files: FileList) => {
    if (isImporting.value) return

    if (files.length > 10) {
        openToast('En fazla 10 dosya yükleyebilirsin.', 'error')
        return
    }

    isImporting.value = true

    let imported = 0
    const failedFiles: string[] = []

    try {
        for (const file of Array.from(files)) {
            try {
                if (!/\.(md|txt)$/i.test(file.name)) {
                    failedFiles.push(file.name)
                    continue
                }

                const title = file.name.replace(/\.(md|txt)$/i, '')
                const content = await file.text()

                await addNote(title, content)
                imported++
            } catch (error) {
                console.error(error)
                failedFiles.push(file.name)
            }
        }

        if (imported > 0) {
            openToast(`${imported} not başarıyla içe aktarıldı.`, 'success')
        }

        if (failedFiles.length > 0) {
            openToast(
                `Yüklenemeyen dosyalar: ${failedFiles.join(', ')}`,
                'error',
                { duration: 5000 }
            )
        }
    } finally {
        isImporting.value = false
    }
}

</script>