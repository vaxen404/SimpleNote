<template>
    <div ref="menuRef" class="relative mt-auto">
        <div
            v-if="isOpen"
            class="absolute bottom-full left-0 z-50 mb-3 w-full rounded-xl border border-gray-200 bg-white p-2 shadow-lg"
        >
            <div class="flex items-center gap-3 p-2">
                <div class="flex size-10 items-center justify-center overflow-hidden rounded-full">
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

                <div class="min-w-0">
                    <p class="truncate text-sm font-semibold">{{ username }}</p>
                    <p class="text-xs text-gray-500">{{ currentUser?.role === 'ADMIN' ? 'Administrator' : 'Personal'}} Account</p>
                </div>
            </div>

            <div class="my-2 border-t border-gray-200" />

            <NuxtLink to="/settings/profile" class="menu-item" @click="isOpen = false">
                <Icon name="lucide:user-round" size="18" />
                My Profile
            </NuxtLink>

            <NuxtLink to="/settings" class="menu-item" @click="isOpen = false">
                <Icon name="lucide:settings" size="18" />
                Settings
            </NuxtLink>

            <NuxtLink to="/trash" class="menu-item" @click="isOpen = false">
                <Icon name="lucide:trash-2" size="18" />
                Trash
            </NuxtLink>
            
            <div class="my-2 border-t border-gray-200" />

            <button
                type="button"
                class="menu-item danger disabled:opacity-50"
                @click="openLogoutModal"
            >
                <Icon name="lucide:log-out" size="18" />
                Log Out
            </button>

        </div>
        <button
            type="button"
            class="flex w-full cursor-pointer items-center gap-3 rounded-xl p-3 border border-gray-200 text-left hover:bg-gray-100"
            :aria-expanded="isOpen"
            @click="isOpen = !isOpen"
        >
            <div class="flex size-9 items-center justify-center overflow-hidden rounded-full">
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

            <div class="min-w-0 flex-1 truncate font-medium">
                <p class="truncate text-sm font-semibold">{{ username }}</p>
                <p class="text-xs text-gray-500">{{ currentUser?.role === 'ADMIN' ? 'Administrator' : 'Personal'}} Account</p>
            </div>

            <Icon
                :name="isOpen ? 'lucide:chevron-down' : 'lucide:chevron-up'"
                size="18"
                class="text-gray-400"
            />
        </button>
    </div>

    <UiLogoutModal
        :open="showLogoutModal"
        @close="showLogoutModal = false"
    />
</template>

<script setup lang="ts">
const currentUser = useAuthUser()

const username = computed(() => currentUser.value?.username ?? 'Guest')
const isOpen = ref(false)
const menuRef = ref<HTMLElement | null>(null)

const handleClickOutside = (event: MouseEvent) => {
    if (!menuRef.value?.contains(event.target as Node)) {
        isOpen.value = false
    }
}

const handleKeydown = (event: KeyboardEvent) => {
    if (event.key === 'Escape') isOpen.value = false
}

onMounted(() => {
    document.addEventListener('pointerdown', handleClickOutside)
    document.addEventListener('keydown', handleKeydown)
})

onBeforeUnmount(() => {
    document.removeEventListener('pointerdown', handleClickOutside)
    document.removeEventListener('keydown', handleKeydown)
})

const openLogoutModal = () => {
    isOpen.value = false
    showLogoutModal.value = true
}

const showLogoutModal = ref(false)
</script>

<style scoped>
@reference "tailwindcss";

.menu-item {
  @apply flex w-full cursor-pointer items-center gap-3 rounded-lg px-3 py-2 text-left text-sm text-gray-700 hover:bg-gray-100;
}

.menu-item:not(.danger):hover {
    @apply bg-gray-100;
}

.menu-item.danger {
    @apply text-red-600 hover:bg-red-50;
}
</style>