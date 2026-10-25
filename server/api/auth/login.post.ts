import argon2 from 'argon2'
import { prisma } from '~~/server/utils/prisma'
import { setAuthSession } from '~~/server/utils/auth'

export default defineEventHandler(async (event) => {
    try {
        enforceRateLimit(event, 'auth-login', 15, 10 * 60 * 1000)

        const body = await readBody(event)

        if (
            !body ||
            typeof body.username !== 'string' ||
            typeof body.password !== 'string' ||
            !body.username.trim() ||
            !body.password
        ) {
            throw createError({
                statusCode: 401,
                message: 'Invalid username or password.'
            })
        }

        const username = body.username.trim()
        const password = body.password

        const user = await prisma.users.findUnique({
            where: {
                username
            }
        })

        if (!user) {
            throw createError({
                statusCode: 401,
                message: 'Invalid username or password.'
            })
        }

        const isPasswordCorrect = await argon2.verify(
            user.passwordHash,
            password
        )

        if (!isPasswordCorrect) {
            throw createError({
                statusCode: 401,
                message: 'Invalid username or password.'
            })
        }

        setAuthSession(event, user.id)

        return {
            success: true,
            user: {
                id: user.id,
                username: user.username,
                email: user.email
            }
        }
    } catch (err: any) {
        if (err.statusCode) throw err

        throw createError({
            statusCode: 500,
            message: 'An unknown error occurred during login.'
        })
    }
})