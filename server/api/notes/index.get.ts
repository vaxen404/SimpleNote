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

        enforceRateLimit(event, `notes-list:${session.userId}`, 60, 60 * 1000)

        const notes = await prisma.note.findMany({
            where: {
                userId: session.userId
            },
            orderBy: {
                createdAt: 'desc'
            }
        })

        return {
            success: true,
            notes
        }
    } catch (err: any) {
        console.log(err.message);
        if (err.statusCode) throw err


        throw createError({
            statusCode: 500,
            message: 'An error occurred while fetching notes.'
        })
    }
})