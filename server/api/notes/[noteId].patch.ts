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

        enforceRateLimit(event, `note-patch:${session.userId}`, 10, 60 * 1000)

        const noteId = getRouterParam(event, 'noteId')

        if (!noteId || !/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(noteId)) {
            throw createError({
                statusCode: 400,
                message: 'Invalid note ID.'
            })
        }

        const body = await readBody(event)

        if (!body || typeof body !== 'object' || Array.isArray(body)) {
            throw createError({
                statusCode: 400,
                message: 'Invalid request body.'
            })
        }

        const { title, content, favorite, archived } = body

        if (
            (title !== undefined && typeof title !== 'string') ||
            (content !== undefined && typeof content !== 'string') ||
            (favorite !== undefined && typeof favorite !== 'boolean') ||
            (archived !== undefined && typeof archived !== 'boolean')
        ) {
            throw createError({
                statusCode: 400,
                message: 'Invalid note data.'
            })
        }

        if (
            title === undefined &&
            content === undefined &&
            favorite === undefined &&
            archived === undefined
        ) {
            throw createError({
                statusCode: 400,
                message: 'No fields to update.'
            })
        }

        const result = await prisma.note.updateMany({
            where: {
                id: noteId,
                userId: session.userId
            },
            data: {
                ...(title !== undefined && { title }),
                ...(content !== undefined && { content }),
                ...(favorite !== undefined && { favorite }),
                ...(archived !== undefined && { archived })
            }
        })

        if (result.count === 0) {
            throw createError({
                statusCode: 404,
                message: 'Note not found.'
            })
        }

        return {
            success: true
        }
    } catch (err: any) {
        if (err.statusCode) throw err

        throw createError({
            statusCode: 500, 
            message: 'An unexpected error occurred while updating the note.'
        })
    }
})