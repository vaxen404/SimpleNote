<template>
    <div class="flex min-h-screen">
        <NotesNoteList />
    </div>
</template>

<script setup lang="ts">
definePageMeta({
    middleware: 'auth',
    layout: 'user'
})

</script>