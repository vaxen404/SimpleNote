
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
        const response = await $fetch<{
            success: boolean
            note: Note
        }>('/api/notes', {
            method: 'POST',
            body: { title, content }
        })

        notes.value.push(response.note)

        return response.note
    }

    const saveNote = async (updatedNote: Note) => {
        const index = notes.value.findIndex(
            note => note.id === updatedNote.id
        )

        if (index === -1) return

        await $fetch(`/api/notes/${updatedNote.id}`, {
            method: 'PATCH',
            body: {
                title: updatedNote.title,
                content: updatedNote.content
            }
        })

        notes.value[index] = { ...updatedNote }
    }

    const deleteNote = async (id: string) => {
        await $fetch(`/api/notes/${id}`, {
            method: 'DELETE'
        })

        notes.value = notes.value.filter(
            note => note.id !== id
        )
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
        const note = notes.value.find(
            note => note.id === id
        )

        if (!note) return

        const favorite = !note.favorite

        await $fetch(`/api/notes/${note.id}`, {
            method: 'PATCH',
            body: {
                favorite
            }
        })

        note.favorite = favorite
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
        const note = notes.value.find(
            note => note.id === id
        )

        if (!note) return

        const archived = !note.archived

        await $fetch(`/api/notes/${note.id}`, {
            method: 'PATCH',
            body: {
                archived
            }
        })

        note.archived = archived
    }

    const isArchived = (id: string): boolean => {
        return notes.value.some(
            note => note.id === id && note.archived
        )
    }

    const trash = computed(() =>
        notes.value.filter(note => note.isTrashed)
    )

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
        trash
    }
}
