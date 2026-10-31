<template>
    <div class="flex h-screen overflow-hidden">
        <LayoutSidebar />

        <main class="min-h-0 min-w-0 flex-1 overflow-hidden">
            <slot />
        </main>
    </div>
</template>