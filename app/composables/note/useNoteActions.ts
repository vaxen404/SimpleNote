interface Note {
    id: string,
    title: string,
    content: string,
    favorite: boolean,
    archived: boolean,
    date: string
}

export const useNoteActions = () => {
    // const notes = useState<Note[]>('notes', () => [])

    
    const notes = useState<Note[]>('notes', () => [
    {
        id: '1',
        title: 'Yazılım Öğrenme Planım',
        content: `Bu hafta yazılım geliştirme konusunda kendimi ilerletmek istiyorum.

    Öğrenilecek konular:
    1. Vue 3 Composition API konusunu tekrar et.
    2. Nuxt 3 component yapısını öğren.
    3. TypeScript interface ve type kullanımını çalış.
    4. Tailwind CSS ile responsive tasarımlar yap.
    5. Git ve GitHub kullanımını geliştir.

    Yapılacak projeler:
    - SimpleNote uygulamasını tamamla.
    - API kullanan küçük bir proje geliştir.
    - GitHub README dosyalarını düzenle.

    Hedefim, bu projeleri mümkün olduğunca kendi başıma tamamlamak ve öğrendiğim konuları gerçek projelerde kullanmak.`,
        favorite: true,
        archived: false,
        date: '24 Eki 2026, 14:30'
    },
    {
        id: '2',
        title: 'Günlük Yapılacaklar',
        content: `Bugün tamamlamak istediğim görevler:

    Sabah:
    - Kahvaltı yap.
    - Çalışma masasını düzenle.
    - Günlük plan oluştur.

    Öğleden sonra:
    - 1 saat İngilizce çalış.
    - Matematik konularını tekrar et.
    - SimpleNote projesine devam et.

    Akşam:
    - Yürüyüş yap.
    - Yarım kalan işleri tamamla.
    - Yarın için plan hazırla.

    Günün sonunda hangi görevleri tamamladığımı kontrol edeceğim.`,
        favorite: false,
        archived: false,
        date: '24 Eki 2026, 13:15'
    },
    {
        id: '3',
        title: 'Proje Fikirlerim',
        content: `Gelecekte geliştirmek istediğim yazılım projelerini burada topluyorum.

    1. API Monitoring
    Web sitelerinin çalışma durumunu ve yanıt sürelerini takip eden bir uygulama.

    2. Task Manager
    Kullanıcıların günlük görevlerini oluşturup yönetebildiği basit bir görev takip sistemi.

    3. Weather Dashboard
    Hava durumu API'sinden verileri çekerek şehir bazlı tahminleri gösteren bir panel.

    4. Developer Portfolio
    Projelerimi, kullandığım teknolojileri ve GitHub bağlantılarımı sergileyebileceğim kişisel web sitesi.

    Bu projeleri geliştirirken temiz kod yazmaya, component yapısını doğru kullanmaya ve TypeScript bilgimi geliştirmeye dikkat edeceğim.`,
        favorite: false,
        archived: false,
        date: '23 Eki 2026, 21:45'
    }
    ])

    const addNote = (title: string, content: string) => {
        const note: Note = {
            id: crypto.randomUUID(),
            title,
            content,
            favorite: false,
            archived: false,
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