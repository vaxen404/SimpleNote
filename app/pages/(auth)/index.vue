<template>
  <div class="flex min-h-screen items-center justify-center bg-gray-50 p-4">
    <div class="w-full max-w-lg rounded-3xl border border-gray-200 bg-white p-10">
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
                    autocomplete="username"
                    class="h-full min-w-0 flex-1 bg-transparent outline-none"
                >
                <button
                    v-if="password.length > 0"
                    @click="isView = !isView"
                >
                    <Icon :name="isView ? 'lucide:eye' : 'lucide:eye-closed'" />
                </button>
            </div>
        </div>

        <button class="flex w-full h-12 rounded-lg items-center justify-center gap-1 bg-blue-600 text-white text-lg font-semibold cursor-pointer hover:bg-blue-500">
            <Icon name="lucide:lock" />
            Login
        </button>
      </form>

    </div>
  </div>
</template>


<script setup lang="ts">
const username = ref('')
const password = ref('')

const isView = ref(false)

const submit = () => {
    console.log(username.value);
}
</script>