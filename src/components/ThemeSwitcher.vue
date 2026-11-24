<script setup>
import { computed } from 'vue';
import { SunIcon, MoonIcon } from '@heroicons/vue/24/solid';
import { useTheme } from '@/composables/useTheme';
import { useIdioma } from '@/composables/useIdioma';
import { ui } from '@/data/ui';

const { isDark, toggleTheme } = useTheme();
const { porIdioma } = useIdioma();
const t = computed(() => porIdioma(ui).nav);
</script>

<template>
    <button
        type="button"
        @click="toggleTheme"
        :aria-pressed="isDark"
        :aria-label="isDark ? t.ativarClaro : t.ativarEscuro"
        :title="isDark ? t.temaClaro : t.temaEscuro"
        class="inline-flex size-9 items-center justify-center rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-surface)] text-[var(--text-secondary)] transition-colors hover:border-[var(--border-strong)] hover:bg-[var(--bg-subtle)] hover:text-[var(--text-primary)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]"
    >
        <SunIcon v-if="isDark" class="size-4.5 text-amber-400" aria-hidden="true" />
        <MoonIcon v-else class="size-4.5 text-[var(--accent)]" aria-hidden="true" />
    </button>
</template>
