<template>
    <div class="flex min-h-screen">
        <NotesNoteList archives-only/>
    </div>
</template>

<script setup lang="ts">
definePageMeta({
    middleware: 'auth',
    layout: 'user'
})
</script>