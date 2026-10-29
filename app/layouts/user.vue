<template>
  <div class="flex h-screen overflow-hidden">
    <LayoutSidebar />

    <main class="min-w-0 flex-1 overflow-y-auto">
      <slot />
    </main>
  </div>
</template>