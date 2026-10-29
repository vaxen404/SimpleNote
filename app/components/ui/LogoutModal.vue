
<template>
    <div
        v-if="open"
        class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
        @click.self="emit('close')"
    >
        <div class="w-full max-w-md rounded-2xl border border-gray-200 bg-white p-6 shadow-xl">
            <div class="flex items-center gap-3">
                <div class="flex size-10 items-center justify-center rounded-full bg-red-50">
                    <Icon name="lucide:log-out" size="20" class="text-red-600" />
                </div>

                <h2 class="text-xl font-semibold text-gray-800">
                    Log out?
                </h2>
            </div>

            <p class="mt-4 text-sm text-gray-500">
                Are you sure you want to log out of your account?
            </p>

            <div class="mt-8 flex justify-end gap-3">
                <button
                    type="button"
                    :disabled="loading"
                    class="cursor-pointer rounded-lg border border-gray-200 bg-white px-5 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 disabled:opacity-50"
                    @click="emit('close')"
                >
                    Cancel
                </button>

                <button
                    type="button"
                    :disabled="loading"
                    class="cursor-pointer rounded-lg bg-red-500 px-5 py-2 text-sm font-medium text-white hover:bg-red-600 disabled:cursor-not-allowed disabled:opacity-50"
                    @click="logout"
                >
                    {{ loading ? 'Logging out...' : 'Log out' }}
                </button>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
defineProps<{
    open: boolean
}>()

const emit = defineEmits<{
    close: []
}>()

const { openToast } = useToast()
const currentUser = useAuthUser()
const authLoaded = useAuthLoaded()

const loading = ref(false)

const logout = async () => {
    if (loading.value) return

    loading.value = true

    try {
        await $fetch('/api/auth/logout', {
            method: 'POST'
        })

        currentUser.value = null
        authLoaded.value = true

        openToast('You have successfully logged out.', 'success')

        emit('close')
        await navigateTo('/login')
    } catch {
        openToast('An error occurred while logging out.', 'error')
    } finally {
        loading.value = false
    }
}
</script>
