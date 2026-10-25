export default defineNuxtRouteMiddleware(() => {
    const currentUser = useAuthUser()

    if (!currentUser.value) {
        return navigateTo('/login')
    }
})