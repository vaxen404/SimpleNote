import { prisma } from "~~/server/utils/prisma";
import { getAuthSession } from "~~/server/utils/auth";

export default defineEventHandler(async (event) => {
    try {
        const session = getAuthSession(event)

        if (!session) {
            throw createError({
                statusCode: 401,
                message: 'You need to be logged in.'
            })
        }

        enforceRateLimit(event, `note-add:${session.userId}`, 10, 60 * 1000)
        
        const body = await readBody(event)

        const title = body?.title
        const content = body?.content

        if (
            typeof title !== 'string' ||
            typeof content !== 'string' ||
            !title.trim() ||
            !content.trim() ||
            title.trim().length > 52 ||
            content.length > 100000
        ) {
            throw createError({
                statusCode: 400,
                message: 'Invalid data.'
            })
        }

        const note = await prisma.$transaction(async (tx) => {
            await tx.$queryRaw<{ id: string }[]>`
                SELECT id
                FROM users
                WHERE id = ${session.userId}::uuid
                FOR UPDATE
            `   

            const user = await tx.users.findUnique({
                where: {
                    id: session.userId
                },
                select: {
                    id: true,
                    noteLimit: true
                }
            })

            if (!user) {
                throw createError({
                    statusCode: 404,
                    message: 'User not found.'
                })
            }

            
            const noteCount = await tx.note.count({
                where: {
                    userId: user.id
                }
            })
            
            if (noteCount >= user.noteLimit) {
                throw createError({
                    statusCode: 403,
                    message: 'Note limit reached.'
                })
            } 

            const note = await tx.note.create({
                data: {
                    userId: user.id,
                    title: title.trim(),
                    content,
                    isTrashed: false
                }
            })

            return note
        })

        return {
            success: true,
            note
        }
    } catch (err: any) {
        if (err.statusCode) throw err

        throw createError({
            statusCode: 500,
            message: 'An unknown error occurred while adding the note.'
        })
    }
})