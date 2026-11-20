<script setup>
import { ref, onMounted } from 'vue';
import { SunIcon, MoonIcon } from '@heroicons/vue/24/solid';

const isDarkMode = ref(false);

const applyTheme = dark => {
    document.documentElement.classList.toggle('dark', dark);
    try {
        localStorage.setItem('theme', dark ? 'dark' : 'light');
    } catch (e) {
        /* armazenamento indisponível */
    }
};

const toggleTheme = () => {
    isDarkMode.value = !isDarkMode.value;
    applyTheme(isDarkMode.value);
};

onMounted(() => {
    // O index.html já aplica a classe antes da pintura; aqui só sincronizamos o estado
    isDarkMode.value = document.documentElement.classList.contains('dark');
});
</script>

<template>
    <button
        type="button"
        @click="toggleTheme"
        :aria-label="isDarkMode ? 'Ativar tema claro' : 'Ativar tema escuro'"
        :title="isDarkMode ? 'Tema claro' : 'Tema escuro'"
        class="rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500"
    >
        <SunIcon v-if="isDarkMode" class="h-6 w-6 text-yellow-500" />
        <MoonIcon v-else class="h-6 w-6 text-sky-700" />
    </button>
</template>
