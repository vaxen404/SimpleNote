interface Note {
    id: string,
    title: string,
    content: string,
    favorite: boolean,
    date: string
}

export const useNoteActions = () => {
    // const notes = useState<Note[]>('notes', () => [])

    const notes = ref([
        {
            id: '1',
            title: 'Koşu',
            content: '10km',
            favorite: false,
            date: '24 Eki 2026, 18:12'
        },
        {
            id: '2',
            title: 'Spor',
            content: 'Saat 10',
            favorite: true,
            date: '24 Eki 2026, 16:21'
        }
    ])


    const addNote = (title: string, content: string) => {
        const note: Note = {
            id: crypto.randomUUID(),
            title,
            content,
            favorite: false,
            date: new Date().toDateString()
        }

        notes.value.push(note)
        return note
    }

    const saveNote = (updatedNote: Note) => {
        const index = notes.value.findIndex(
            note => note.id === updatedNote.id
        )

        if (index === -1) return

        notes.value[index] = { ...updatedNote }
    } 

    const deleteNote = (id: string) => {
        notes.value = notes.value.filter(
            note => note.id !== id
        )
    }

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

    return {
        notes,
        addNote,
        saveNote,
        deleteNote,
        toggleFavorite,
        isFavorite
    }
}