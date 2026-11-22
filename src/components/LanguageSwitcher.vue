<script setup>
import { computed } from 'vue';
import { useIdioma } from '@/composables/useIdioma';
import { ui } from '@/data/ui';

const { idioma, alternarIdioma, porIdioma } = useIdioma();
const t = computed(() => porIdioma(ui).nav);
</script>

<template>
    <button
        type="button"
        @click="alternarIdioma"
        :aria-label="t.trocarIdioma"
        :title="t.trocarIdioma"
        class="inline-flex items-center rounded-md text-xs font-bold ring-1 ring-slate-300 focus:outline-none focus:ring-2 focus:ring-sky-500 dark:ring-slate-600"
    >
        <span
            v-for="op in ['pt', 'en']"
            :key="op"
            :class="[
                idioma === op ? 'bg-sky-600 text-white' : 'text-slate-600 dark:text-slate-300',
                'px-2 py-1 uppercase first:rounded-l-md last:rounded-r-md transition-colors',
            ]"
            aria-hidden="true"
        >
            {{ op }}
        </span>
    </button>
</template>
