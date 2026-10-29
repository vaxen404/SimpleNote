<template>
    <div class="min-h-screen bg-gray-50 px-4 py-6 sm:px-6 lg:px-10">
        <div class="max-w-5xl space-y-4">
            <div>
               <h1 class="text-3xl font-semibold text-gray-900">
                    Settings
               </h1> 
               <p class="text-gray-500">
                View and manage your account information.
               </p>
            </div>
            
            <div class="rounded-lg border border-gray-200 bg-white shadow-sm">
                <button
                    type="button"
                    @click="isOpenProfile = !isOpenProfile"
                    class="flex w-full cursor-pointer items-center justify-between p-4 hover:bg-gray-100"
                >
                    <h2 class="font-semibold text-gray-900">Profile</h2>
                    <Icon :name="isOpenProfile ? 'lucide:chevron-up' : 'lucide:chevron-down'" />
                </button>

                <Transition name="expand">
                    <div v-if="isOpenProfile" class="flex flex-col border-t border-gray-200 p-4 gap-4">
                        <div class="flex flex-col justify-center gap-1">
                            <label for="username" class="text-sm font-semibold text-gray-700">Username</label>
                            <input 
                                id="username"
                                v-model="username"
                                type="text"
                                maxlength="12"
                                class="rounded-lg border border-gray-200 px-3 py-2 bg-gray-100 outline-none focus:border-blue-600"
                            >
                        </div>
    
                        <div class="flex flex-col justify-center gap-1">
                            <label for="email" class="text-sm font-semibold text-gray-700">Email address (optional)</label>
                            <input 
                                id="email"
                                v-model="email"
                                type="email"
                                placeholder="you@example.com"
                                maxlength="254"
                                class="rounded-lg border border-gray-200 px-3 py-2 bg-gray-100 outline-none focus:border-blue-600"
                            >
                        </div>
    
                        <div class="-mx-4 -mb-4 mt-2 flex items-center justify-end gap-3 border-t border-gray-200 px-4 py-3">
                            <button
                                @click="cancelProfile"
                                :disabled="!hasProfileChanges"
                                class="rounded-lg border border-gray-200 bg-gray-50 font-semibold text-gray-600 px-4 py-2 
                                    cursor-pointer transition-all duration-200 ease-in-out
                                    enabled:hover:bg-gray-100 enabled:hover:shadow-md enabled:active:scale-95
                                    disabled:cursor-not-allowed disabled:opacity-50" 
                            >
                                Cancel
                            </button>
    
                            <button 
                                @click="saveProfile"
                                :disabled="!canSaveProfile"    
                                class="flex items-center rounded-lg border border-gray-200 bg-blue-600 text-white font-semibold px-4 py-2 gap-2
                                    cursor-pointer transition-all duration-200 ease-in-out
                                    enabled:hover:bg-blue-500 enabled:hover:shadow-md enabled:active:scale-95
                                    disabled:cursor-not-allowed disabled:opacity-50"
                            >
                                <Icon name="solar:check-read-linear" />
                                Save profile
                            </button>
                        </div>
                    </div>
                </Transition>
            </div>

            <div class="rounded-lg border border-gray-200 bg-white shadow-sm">
                <button
                    type="button"
                    @click="isOpenPassword = !isOpenPassword"
                    class="flex w-full cursor-pointer items-center justify-between p-4 hover:bg-gray-100"
                >
                    <h2 class="font-semibold text-gray-900">Password</h2>
                    <Icon :name="isOpenPassword ? 'lucide:chevron-up' : 'lucide:chevron-down'" />
                </button>

                <Transition name="expand">
                    <div v-if="isOpenPassword" class="flex flex-col border-t border-gray-200 p-4 gap-4">
                        <div class="flex flex-col justify-center gap-1">
                            <label for="cPassword" class="text-sm font-semibold text-gray-700">Current Password</label>
                            <input 
                                id="cPassword"
                                v-model="currentPassword"
                                :type="isShowPassword ? 'text' : 'password'"
                                maxlength="24"
                                class="rounded-lg border border-gray-200 px-3 py-2 bg-gray-100 outline-none focus:border-blue-600"
                            >
                        </div>
    
                        <div class="flex flex-col justify-center gap-1">
                            <label for="nPassword" class="text-sm font-semibold text-gray-700">New Password</label>
                            <input 
                                id="nPassword"
                                v-model="newPassword"
                                :type="isShowPassword ? 'text' : 'password'"
                                maxlength="24"
                                class="rounded-lg border border-gray-200 px-3 py-2 bg-gray-100 outline-none focus:border-blue-600"
                            >
                        </div>
    
                        <div class="flex flex-col justify-center gap-1">
                            <label for="c-nPassword" class="text-sm font-semibold text-gray-700">Confirm New Password</label>
                            <input 
                                id="c-nPassword"
                                v-model="confirmNewPassword"
                                :type="isShowPassword ? 'text' : 'password'"
                                maxlength="24"
                                class="rounded-lg border border-gray-200 px-3 py-2 bg-gray-100 outline-none focus:border-blue-600"
                            >
                        </div>
    
                        <div class="-mt-2 ml-1 flex flex-col gap-3.5">
                            <p class="text-xs font-semibold text-gray-500">
                                8–24 characters. Your new passwords must match.
                            </p>
        
                            <div class="flex items-center gap-1">
                                <input 
                                    id="showPasswords"
                                    v-model="isShowPassword"
                                    type="checkbox"
                                    class="size-4 cursor-pointer accent-blue-600"
                                >
        
                                <label 
                                    for="showPasswords"
                                    class="cursor-pointer text-sm text-gray-600"
                                >
                                    Show passwords
                                </label>
                            </div>
                        </div>
    
                        <div class="-mx-4 -mb-4 mt-2 flex items-center justify-end gap-3 border-t border-gray-200 px-4 py-3">
                            <button 
                                @click="clearPassword"
                                :disabled="!currentPassword && !newPassword && !confirmNewPassword"
                                class="rounded-lg border border-gray-200 bg-gray-50 font-semibold text-gray-600 px-4 py-2 
                                cursor-pointer transition-all duration-200 ease-in-out
                                enabled:hover:bg-gray-100 enabled:hover:shadow-md enabled:active:scale-95
                                disabled:cursor-not-allowed disabled:opacity-50"
                            >
                                Clear
                            </button>
    
                            <button 
                                :disabled="!canUpdatePassword"
                                class="flex items-center rounded-lg border border-gray-200 bg-blue-600 font-semibold text-white px-4 py-2 gap-2 
                                    cursor-pointer transition-all duration-200 ease-in-out 
                                    enabled:hover:bg-blue-500 enabled:hover:shadow-md enabled:active:scale-95 
                                    disabled:cursor-not-allowed disabled:opacity-50"
                            >
                                <Icon name="solar:lock-password-linear" />
                                Update password
                            </button>
                        </div>
                    </div>
                </Transition>
            </div>

            <div class="flex w-full flex-col rounded-lg border border-gray-200 bg-white cursor-pointer justify-center p-4 gap-3">
                <div class="flex flex-col">
                    <h2 class="font-semibold text-gray-900">Theme</h2>
                    <p class="text-xs font-semibold text-gray-500">Choose between light, dark or system theme.</p>
                </div>

                <div class="grid grid-cols-1 gap-3 sm:grid-cols-3">
                    <button
                        v-for="item in themes"
                        :key="item.value"
                        type="button"
                        @click="selectedTheme = item.value"
                        class="flex w-full min-w-0 cursor-pointer items-center justify-center gap-2 rounded-lg border px-4 py-2.5 text-sm font-medium transition-colors duration-200"
                        :class="selectedTheme === item.value
                            ? 'border-blue-600 bg-blue-50 text-blue-600'
                            : 'border-gray-200 bg-white text-gray-600 hover:bg-gray-50'"
                    >
                        <Icon :name="item.icon" size="18" />
                        {{ item.label }}
                    </button>
                </div>
            </div>

            <div class="flex w-full flex-col items-start justify-between rounded-lg border border-gray-200 bg-white cursor-pointer px-4 py-4 gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h2 class="font-semibold text-gray-900">
                        Accent color
                    </h2>
                    <p class="text-xs font-semibold text-gray-500">
                        Choose your accent color.
                    </p>
                </div>

                <div class="flex flex-wrap items-center gap-3">
                    <button
                        v-for="item in colors"
                        :key="item.value"
                        type="button"
                        @click="selectedColor = item.value"
                        class="flex w-18 cursor-pointer flex-col items-center gap-2 rounded-lg border p-2"
                        :class="selectedColor === item.value
                            ? 'border-blue-500 bg-blue-50'
                            : 'border-transparent hover:bg-gray-50'" 
                        
                    >
                        <div 
                            class="flex size-9 items-center justify-center rounded-full"
                            :class="item.bg"
                        >
                            <Icon
                                v-if="selectedColor === item.value"
                                name="solar:check-read-linear"
                                size="20"
                                class="text-white"
                            />
                        </div>

                        <span class="text-xs font-semibold text-gray-600">
                            {{ item.label }}
                        </span>
                    </button>
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

const isOpenProfile = ref(true)
const isOpenPassword = ref(false)

const username = ref('')
const email = ref('')

const hasProfileChanges = computed(() => 
    username.value !== (currentUser.value?.username ?? '') ||
    email.value !== (currentUser.value?.email ?? '')
)

const isValidEmail = computed(() =>
    !email.value.trim() ||
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value.trim())
)

const canSaveProfile = computed(() => 
    hasProfileChanges.value &&
    username.value.trim().length > 0 &&
    username.value.length <= 12 &&
    email.value.length <= 254 &&
    isValidEmail.value
)

const saveProfile = () => {}

const cancelProfile = () => {
    username.value = currentUser.value?.username ?? ''
    email.value = currentUser.value?.email ?? ''
}

watch(
    currentUser,
    (user) => {
        username.value = user?.username ?? ''
        email.value = user?.email ?? ''
    },
    { immediate: true }
)

const currentPassword = ref('')
const newPassword = ref('')
const confirmNewPassword = ref('')
const isShowPassword = ref(false)

const canUpdatePassword = computed(() => 
    currentPassword.value.length > 0 &&
    newPassword.value.length >= 8 &&
    newPassword.value.length <= 24 &&
    newPassword.value === confirmNewPassword.value &&
    newPassword.value !== currentPassword.value
) 

const clearPassword = () => {
    currentPassword.value = ''
    newPassword.value = ''
    confirmNewPassword.value = ''
}

const selectedTheme = ref('light')

const themes = [
    { value: 'light', label: 'Light', icon: 'lucide:sun' },
    { value: 'dark', label: 'Dark', icon: 'lucide:moon' },
    { value: 'system', label: 'System', icon: 'lucide:monitor' }    
]

const selectedColor = ref('blue')

const colors = [
    { value: 'blue', label: 'Blue', bg: 'bg-blue-600' },
    { value: 'indigo', label: 'Indigo', bg: 'bg-indigo-600' },
    { value: 'violet', label: 'Violet', bg: 'bg-violet-600' },
    { value: 'emerald', label: 'Emerald', bg: 'bg-emerald-600' },
    { value: 'rose', label: 'Rose', bg: 'bg-rose-600' },
    { value: 'amber', label: 'Amber', bg: 'bg-amber-600' }
]

</script>

<style scoped>
.expand-enter-active,
.expand-leave-active {
    transition: all 0.3s ease-in-out;
}

.expand-enter-from,
.expand-leave-to {
    opacity: 0;
    transform: translateY(-10px);
}
</style>