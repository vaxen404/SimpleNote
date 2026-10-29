import { prisma } from '~~/server/utils/prisma'
import { getAuthSession } from '~~/server/utils/auth'

export default defineEventHandler(async event => {
    try {
        const session = getAuthSession(event)

        if (!session) {
            throw createError({
                statusCode: 401,
                message: 'You need to be logged in.'
            })
        }

        enforceRateLimit(event, `note-delete:${session.userId}`, 10, 60 * 1000)

        const noteId = getRouterParam(event, 'noteId')

        if (!noteId || !/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(noteId)) {
            throw createError({
                statusCode: 400,
                message: 'Invalid note ID.'
            })
        }

        const result = await prisma.note.updateMany({
            where: {
                id: noteId,
                userId: session.userId,
                trashedAt: null
            },
            data: {
                trashedAt: new Date()
            }
        })

        if (result.count === 0) {
            throw createError({
                statusCode: 404,
                message: 'Note not found.'
            })
        }

        return {
            success: true,
            message: 'Note moved to trash.'
        }

    } catch (err: any) {
        if (err.statusCode) throw err

        throw createError({
            statusCode: 500,
            message: 'An unknown error occurred while deleting the note.'
        })
    }
})