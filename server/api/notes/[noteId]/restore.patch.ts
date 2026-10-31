import { prisma } from '~~/server/utils/prisma'
import { getAuthSession } from '~~/server/utils/auth'

export default defineEventHandler(async (event) => {
    try {
        const session = getAuthSession(event)

        if (!session) {
            throw createError({
                statusCode: 401,
                message: 'You need to be logged in.'
            })
        }

        enforceRateLimit(event, `note-restore:${session.userId}`, 25, 60 * 1000)

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
                isTrashed: true
            },
            data: {
                isTrashed: false,
                trashedAt: null
            }
        })

        if (result.count === 0) {
            throw createError({
                statusCode: 404,
                message: 'Note not found in trash.'
            })
        }

        return {
            success: true
        }
    } catch (err: any) {
        if (err.statusCode) throw err

        throw createError({
            statusCode: 500,
            message: 'Failed to restore data.'
        })
    }
})