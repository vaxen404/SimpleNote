<template>
    <div class="flex min-h-screen">
        <NotesNoteList favorites-only/>
    </div>
</template>

<script setup lang="ts">
definePageMeta({
    layout: 'user'
})
</script>