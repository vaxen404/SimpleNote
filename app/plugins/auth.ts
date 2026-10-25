export default defineNuxtPlugin(async () => {
    const currentUser = useAuthUser()
    const authLoaded = useAuthLoaded()
    const requestFetch = useRequestFetch()

    try {
        const response = await requestFetch('/api/user/@me')
        currentUser.value = response
    } catch {
        currentUser.value = null
    } finally {
        authLoaded.value = true
    }
})