import { z } from 'zod'

export const createNoteSchema = z.object({
    title: z.string()
        .trim()
        .min(1, 'Not başlığı boş bırakılamaz.')
        .max(32, 'Not başlığı en fazla 32 karakter olabilir.'),

    content: z.string()
        .trim()
        .min(1, 'Not içeriği boş bırakılamaz.')
        .max(100000, 'Not içeriği en fazla 100.000 karakter olabilir.')
})