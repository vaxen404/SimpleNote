import { prisma } from '~~/server/utils/prisma'
import { getAuthSession } from '~~/server/utils/auth' 

export default defineEventHandler(async (event) =>  {
    try {
        const session = getAuthSession(event)

        if (!session) {
            throw createError({
                statusCode: 401,
                message: 'You need to be logged in.'
            })
        }

        const user = await prisma.users.findUnique({
            where: {
                id: session.userId
            },
            select: {
                id: true,
                username: true,
                email: true,
                noteLimit: true,
                createdAt: true
            }
        })

        if (!user) {
            throw createError({
                statusCode: 401,
                message: 'Invalid session.'
            })
        }

        return {
            id: user.id,
            username: user.username,
            email: user.email,
            noteLimit: user.noteLimit,
            createdAt: user.createdAt
        }
    } catch (err: any) {
        if (err.statusCode) throw err

        throw createError({
            statusCode: 500,
            message: 'An unknown error occurred while fetching user information.'
        })
    }
})