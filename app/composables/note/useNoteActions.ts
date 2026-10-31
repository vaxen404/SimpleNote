
interface Note {
    id: string
    title: string
    content: string
    favorite: boolean
    archived: boolean
    isTrashed: boolean,
    trashedAt: string | null
    createdAt: string
    updatedAt: string
}


export const useNoteActions = () => {
    const { openToast } = useToast()

    const notes = useState<Note[]>('notes', () => [])

    const fetchNotes = async () => {
        const requestFetch = useRequestFetch()

        const response = await requestFetch<{
            success: boolean
            notes: Note[]
        }>('/api/notes')

        notes.value = response.notes
    }

    const addNote = async (title: string, content: string) => {
        try {
            const response = await $fetch<{
                success: boolean
                note: Note
            }>('/api/notes', {
                method: 'POST',
                body: { title, content }
            })

            notes.value.push(response.note)

            openToast('Not başarıyla oluşturuldu.', 'success')

            return response.note
        } catch (err) {
            openToast('Not oluşturulurken bir hata oluştu.', 'error')
            throw err
        }
    }

    const saveNote = async (updatedNote: Note) => {
        const index = notes.value.findIndex(
            note => note.id === updatedNote.id
        )

        if (index === -1) return

        try {
            await $fetch(`/api/notes/${updatedNote.id}`, {
                method: 'PATCH',
                body: {
                    title: updatedNote.title,
                    content: updatedNote.content
                }
            })

            notes.value[index] = { ...updatedNote }

            openToast('Not başarıyla güncellendi.', 'success')
        } catch (err) {
            openToast('Not güncellenirken bir hata oluştu.', 'error')
            throw err
        }
    }

    const deleteNote = async (id: string) => {
        try {
            await $fetch(`/api/notes/${id}`, {
                method: 'DELETE'
            })

            const note = notes.value.find(note => note.id === id)

            if (note) {
                note.isTrashed = true
                note.trashedAt = new Date().toISOString()
            }

            openToast('Not çöp kutusuna taşındı.', 'success')
        } catch (err) {
            openToast('Not çöp kutusuna taşınamadı.', 'error')
            throw err
        }
    }

    const activeNotes = computed(() =>
        notes.value.filter(note =>
            !note.archived && !note.isTrashed
        )
    )

    const favorites = computed(() =>
        notes.value.filter(note =>
            note.favorite && !note.archived && !note.isTrashed
        )
    )

    const toggleFavorite = async (id: string) => {
        const note = notes.value.find(note => note.id === id)

        if (!note) return

        const favorite = !note.favorite

        try {
            await $fetch(`/api/notes/${note.id}`, {
                method: 'PATCH',
                body: { favorite }
            })

            note.favorite = favorite

            openToast(
                favorite ? 'Not favorilere eklendi.' : 'Not favorilerden çıkarıldı.',
                'success'
            )
        } catch (err) {
            openToast('Favori durumu güncellenemedi.', 'error')
            throw err
        }
    }

    const isFavorite = (id: string): boolean => {
        return notes.value.some(
            note => note.id === id && note.favorite
        )
    }

    const archives = computed(() =>
        notes.value.filter(note =>
            note.archived && !note.isTrashed
        )
    )

    const toggleArchive = async (id: string) => {
        const note = notes.value.find(note => note.id === id)

        if (!note) return

        const archived = !note.archived

        try {
            await $fetch(`/api/notes/${note.id}`, {
                method: 'PATCH',
                body: { archived }
            })

            note.archived = archived

            openToast(
                archived ? 'Not arşivlendi.' : 'Not arşivden çıkarıldı.',
                'success'
            )
        } catch (err) {
            openToast('Arşiv durumu güncellenemedi.', 'error')
            throw err
        }
    }

    const isArchived = (id: string): boolean => {
        return notes.value.some(
            note => note.id === id && note.archived
        )
    }

    const trash = computed(() =>
        notes.value.filter(note => note.isTrashed)
    )

    const restoreNote = async (id: string) => {
        try {
            await $fetch(`/api/notes/${id}/restore`, {
                method: 'PATCH'
            })

            const note = notes.value.find(note => note.id === id)

            if (note) {
                note.isTrashed = false
                note.trashedAt = null
            }

            openToast('Not başarıyla geri yüklendi.', 'success')
        } catch (err) {
            openToast('Not geri yüklenemedi.', 'error')
            throw err
        }
    }

    const permanentlyDeleteNote = async (id: string) => {
        try {
            await $fetch(`/api/notes/${id}/permanent`, {
                method: 'DELETE'
            })

            notes.value = notes.value.filter(note => note.id !== id)

            openToast('Not kalıcı olarak silindi.', 'success')
        } catch (err: any) {
            console.log('API ERROR DATA:', JSON.stringify((err as any).data, null, 2))
            console.error('API Error:', {
                status: err.statusCode,
                data: err.data,
                message: err.message
            })

            openToast('Not kalıcı olarak silinemedi.', 'error')
            throw err
        }
    }

    return {
        notes,
        fetchNotes,
        addNote,
        saveNote,
        deleteNote,
        activeNotes,
        favorites,
        toggleFavorite,
        isFavorite,
        archives,
        toggleArchive,
        isArchived,
        trash,
        restoreNote,
        permanentlyDeleteNote
    }
}
