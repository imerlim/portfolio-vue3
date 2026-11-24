<script setup>
import { computed } from 'vue';
import NavBar from '@/layouts/NavBar.vue';
import Footer from '@/layouts/Footer.vue';
import { ui } from '@/data/ui';
import { useIdioma } from '@/composables/useIdioma';

const { porIdioma } = useIdioma();
const skipLabel = computed(() => porIdioma(ui).skipToContent);

const focarConteudo = () => {
    const el = document.getElementById('conteudo-principal');
    el?.focus();
    el?.scrollIntoView({ behavior: 'auto', block: 'start' });
};
</script>

<template>
    <div class="min-h-screen flex flex-col bg-[var(--bg-canvas)] text-[var(--text-primary)]">
        <a
            href="#"
            @click.prevent="focarConteudo"
            class="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[100] focus:rounded-lg focus:bg-[var(--accent-strong)] focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-white focus:shadow-lg"
        >
            {{ skipLabel }}
        </a>

        <NavBar />

        <main id="conteudo-principal" tabindex="-1" class="flex-1 pt-16 bg-[var(--bg-canvas)] text-[var(--text-primary)] outline-none">
            <RouterView />
        </main>

        <Footer />
    </div>
</template>
