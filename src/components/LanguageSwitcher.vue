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
        class="inline-flex h-9 items-center rounded-full border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-0.5 font-mono text-xs font-semibold transition-colors hover:border-[var(--border-strong)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]"
    >
        <span
            v-for="op in ['pt', 'en']"
            :key="op"
            :class="[
                idioma === op
                    ? 'bg-[var(--accent)] text-white dark:text-slate-950 shadow-xs'
                    : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]',
                'rounded-full px-2.5 py-1 uppercase transition-colors',
            ]"
            aria-hidden="true"
        >
            {{ op }}
        </span>
    </button>
</template>
