<script setup>
import NavBar from '@/layouts/NavBar.vue';
import Footer from '@/layouts/Footer.vue';
</script>

<template>
    <div class="min-h-screen flex flex-col bg-white dark:bg-slate-850">
        <NavBar />

        <main class="flex-1 pt-16 bg-white dark:bg-slate-850 text-gray-800 dark:text-gray-200">
            <RouterView />
        </main>

        <Footer />
    </div>
</template>
