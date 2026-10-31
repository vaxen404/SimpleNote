export default defineEventHandler(async (event) => {
    try {
        clearAuthSession(event)

        return {
            success: true
        }
    } catch {
        throw createError({
            statusCode: 500, 
            message: 'An error occurred while logging out.'
        })
    }
})