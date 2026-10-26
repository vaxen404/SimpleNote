<template>
    <div class="min-h-screen bg-gray-50 px-14 py-5">
        <div class="max-w-5xl space-y-6">
            <div class="flex items-center gap-2 text-sm">
                <NuxtLink to="/settings" class="text-gray-500 hover:text-blue-600">
                    Settings
                </NuxtLink>

                <Icon name="lucide:chevron-right" size="16" class="text-gray-400" />

                <span class="font-medium text-gray-900">Profile</span>
            </div>

            <div>
                <h1 class="text-3xl font-semibold text-gray-900">
                    My Profile
                </h1>
                <p class="mt-1 text-gray-500">
                    View and manage your account information.
                </p>
            </div>

            <div class="flex w-full items-center gap-6 rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
                <div class="relative size-28">
                    <div class="flex size-28 items-center justify-center overflow-hidden rounded-full">
                        <img
                            v-if="currentUser?.avatarUrl"
                            :src="currentUser.avatarUrl"
                            alt="Avatar"
                            class="h-full w-full object-cover"
                        >
    
                        <Icon
                            v-else
                            name="solar:user-circle-bold-duotone"
                            size="112"
                            class="text-blue-600"
                        />
                    </div>

                    <button
                        type="button"
                        class="absolute bottom-0 right-0 flex size-9 cursor-pointer items-center justify-center rounded-full border-2 border-white bg-gray-700 text-white hover:bg-gray-600"
                    >
                        <Icon name="lucide:camera" size="18" />
                    </button>
                </div>

                <div class="flex flex-col items-start gap-3">
                    <div>
                        <h2 class="font-semibold text-gray-900">
                            Profile Picture
                        </h2>
    
                        <p class="mt-1 text-sm text-gray-500">
                            Upload a PNG, JPS or WEBP image.
                        </p>
                    </div>

                    <div class="flex gap-3">
                        <button 
                            type="button"
                            class="flex cursor-pointer items-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-blue-500"
                        >
                            <Icon name="lucide:upload" size="18" />
                            Upload Photo
                        </button>

                        <button
                            type="button"
                            class="flex cursor-pointer items-center gap-2 rounded-lg border border-gray-200 px-4 py-2.5 text-sm font-medium text-gray-600 hover:bg-gray-100"
                        >
                            <Icon name="lucide:trash-2" size="18" />
                            Remove
                        </button>
                    </div>
                </div>
            </div>

            <div class="flex w-full flex-col gap-6 rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
                <div class="flex items-center gap-3">
                    <Icon name="lucide:user-round" size="24" />
                    <h2 class="text-xl font-semibold text-gray-900">
                        Account Information
                    </h2>
                </div>

                <div class="grid w-full grid-cols-1 gap-4 md:grid-cols-2">
                    <div class="flex flex-col gap-2">
                        <div>
                            <label class="font-medium text-gray-700">Username</label>
    
                            <input 
                                :value="currentUser?.username ?? 'Guest'"
                                type="text"
                                readonly
                                class="input-group"
                            >
                        </div>

                        <p class="text-sm text-gray-500">Giriş yaparken kullandığın benzersiz kullanıcı adın.</p>
                    </div>

                    <div class="flex flex-col gap-1">
                        <div>
                            <label class="font-medium text-gray-700">Email</label>
    
                            <input 
                                :value="currentUser?.email ?? 'Email not provided'"
                                type="email"
                                readonly
                                class="input-group"
                            >
                        </div>

                        <p class="text-sm text-gray-500">Hesabınla ilişkilendirilmiş isteğe bağlı e-posta adresin.</p>
                    </div>
                </div>

                <div class="grid w-full grid-cols-1 gap-4 md:grid-cols-2">
                    <div class="flex flex-col gap-2">
                        <div>
                            <label class="font-medium text-gray-700">Account Created</label>
    
                            <input 
                                :value="currentUser?.createdAt
                                    ? new Date(currentUser.createdAt).toLocaleDateString('tr-TR')
                                    : 'Unknown'
                                "
                                type="text"
                                readonly
                                class="input-group"
                            >
                        </div>

                        <p class="text-sm text-gray-500">Hesabının oluşturulduğu tarih.</p>
                    </div>

                    <div class="flex flex-col gap-1">
                        <div>
                            <label class="font-medium text-gray-700">Note Limit</label>
    
                            <input 
                                :value="String(currentUser?.noteLimit ?? 0)"
                                type="text"
                                readonly
                                class="input-group"
                            >
                        </div>

                        <p class="text-sm text-gray-500">Oluşturabileceğin maksimum not sayısı.</p>
                    </div>
                </div>
            </div>

            <div class="flex w-full flex-col gap-6 rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
                <div class="flex items-center gap-3">
                    <Icon name="lucide:chart-pie" size="24" />

                    <div>
                        <h2 class="text-xl font-semibold text-gray-900">
                            Account Statistics
                        </h2>
                        <p class="text-sm text-gray-500">
                            Hesabına ait kullanım istatistiklerini görüntüle
                        </p>
                    </div>
                </div>

                <div class="grid grid-cols-1 gap-4 md:grid-cols-3">
                    <div class="rounded-xl bg-blue-50 p-5">
                        <div class="flex items-center gap-4">
                            <Icon name="lucide:file-text" size="32" class="text-blue-600" />

                            <div>
                                <p class="text-sm text-gray-500">Total Notes</p>
                                <p class="text-2xl font-semibold text-gray-900">
                                    {{ notes.length }}
                                </p>
                            </div>
                        </div>

                        <p class="mt-3 text-sm text-gray-500">
                            Oluşturduğun toplam not sayısı.
                        </p>
                    </div>

                    <div class="rounded-xl bg-yellow-50 p-5">
                        <div class="flex items-center gap-4">
                            <Icon name="lucide:star" size="32" class="text-amber-500" />

                            <div>
                                <p class="text-sm text-gray-500">Favorites</p>
                                <p class="text-2xl font-semibold text-gray-900">
                                    {{ favorites.length }}
                                </p>
                            </div>
                        </div>

                        <p class="mt-3 text-sm text-gray-500">
                            Favorilere eklediğin not sayısı.
                        </p>
                    </div>

                    <div class="rounded-xl bg-purple-50 p-5">
                        <div class="flex items-center gap-4">
                            <Icon name="lucide:archive" size="32" class="text-purple-600" />

                            <div>
                                <p class="text-sm text-gray-500">Archives</p>
                                <p class="text-2xl font-semibold text-gray-900">
                                    {{ archives.length }}
                                </p>
                            </div>
                        </div>

                        <p class="mt-3 text-sm text-gray-500">
                            Arşivlediğin not sayısı.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
definePageMeta({
    middleware: 'auth',
    layout: 'user'
})

const currentUser = useAuthUser()

const { notes, favorites, archives } = useNoteActions()

</script>

<style scoped>
@reference "tailwindcss";

.input-group {
    @apply h-12 w-full rounded-lg border border-gray-200 bg-gray-50 px-4 outline-none focus:border-blue-500;
}
</style>