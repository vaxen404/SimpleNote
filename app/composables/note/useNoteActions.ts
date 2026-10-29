interface Note {
    id: string,
    title: string,
    content: string,
    favorite: boolean,
    archived: boolean,
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
        }>(
            '/api/notes'
        )

        notes.value = response.notes
    }

    const addNote = async (title: string, content: string) => {
        const response = await $fetch<{ success: boolean, note: Note }>(
            '/api/notes',
            {
                method: 'POST',
                body: { title, content }
            }
        )

        notes.value.push(response.note)

        return response.note
    }

    const saveNote = (updatedNote: Note) => {
        const index = notes.value.findIndex(
            note => note.id === updatedNote.id
        )

        if (index === -1) return

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

    const favorites = computed(() => {
        return notes.value.filter(
            note => note.favorite
        )
    })

    const toggleFavorite = (id: string) => {
        const note = notes.value.find(
            note => note.id === id
        )

        if (!note) return

        note.favorite = !note.favorite
    }

    const isFavorite = (id: string): boolean => {
        return notes.value.some(
            note => note.id === id && note.favorite
        )
    }

    const archives = computed(() =>
        notes.value.filter(note => note.archived)
    )

    const toggleArchive = (id: string) => {
        const note = notes.value.find(note => note.id === id)

        if (!note) return

        note.archived = !note.archived
    }

    const isArchived = (id: string): boolean => {
        return notes.value.some(
            note => note.id === id && note.archived
        )
    }

    return {
        notes,
        fetchNotes,
        addNote,
        saveNote,
        deleteNote,
        favorites,
        toggleFavorite,
        isFavorite,
        archives,
        toggleArchive,
        isArchived
    }
}