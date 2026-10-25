<template>
  <div class="flex min-h-screen items-center justify-center bg-gray-50 p-4">
    <div class="w-full max-w-lg rounded-3xl border border-gray-200 bg-white p-10 shadow-lg">
      <h1 class="mb-10 text-3xl font-semibold text-gray-800">
        Login
      </h1>

      <form class="flex justify-center flex-col gap-4" @submit.prevent="submit">
        <div>
            <label class="flex items-center gap-1 font-semibold text-gray-600 text-sm">USERNAME <i class="text-red-600 text-lg">*</i> </label>
            <input 
                v-model="username"
                type="text"
                autocomplete="username"
                class="h-12 w-full rounded-lg bg-gray-100 border border-gray-300 px-4 outline-none focus:border-blue-500"
            >
        </div>

        <div>
            <label class="flex items-center gap-1 font-semibold text-gray-600 text-sm">PASSWORD <i class="text-red-600 text-lg">*</i> </label>

            <div class="flex h-12 items-center rounded-lg border border-gray-300 bg-gray-100 px-4 focus-within:border-blue-500">
                <input 
                    v-model="password"
                    :type="isView ? 'text' : 'password'"
                    autocomplete="current-password"
                    class="h-full min-w-0 flex-1 bg-transparent outline-none"
                >
                <button
                    v-if="password.length > 0"
                    type="button"
                    class="cursor-pointer text-gray-500"
                    @click="isView = !isView"
                >
                    <Icon :name="isView ? 'lucide:eye' : 'lucide:eye-closed'" />
                </button>
            </div>
        </div>

        <button 
            type="submit"
            :disabled="isLoading"
            class="flex w-full h-12 rounded-lg items-center justify-center gap-1 bg-blue-600 text-white text-lg font-semibold cursor-pointer hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-50"
        >
            <Icon name="lucide:lock" />
            {{ isLoading ? 'Logging in...' : 'Login' }}
        </button>
      </form>

    </div>
  </div>
</template>


<script setup lang="ts">
const { openToast } = useToast()

const username = ref('')
const password = ref('')

const isView = ref(false)


const isLoading = ref(false)

const currentUser = useAuthUser()

const submit = async () => {
    if (!username.value.trim() || !password.value) {
        openToast('Kullanıcı adı ve şifre gerekli.', 'error')
        return
    }

    isLoading.value = true

    try {
        const repsonse = await $fetch('/api/auth/login', {
            method: 'POST',
            body: {
                username: username.value.trim(),
                password: password.value
            }
        })

        currentUser.value = repsonse.user

        await navigateTo('/notes')
        
        openToast('Giriş başarılı!', 'success')

    } catch (err: any) {
        openToast(
            err.data?.message || 'Giriş sırasında bir hata oluştu.',
            'error'
        )
    } finally {
        isLoading.value = false
    }
}

</script>