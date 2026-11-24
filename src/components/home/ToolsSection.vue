<script setup>
import { computed } from 'vue';
import { CalculatorIcon, PresentationChartLineIcon } from '@heroicons/vue/24/outline';
import SectionHeader from '@/components/SectionHeader.vue';
import * as perfilPt from '@/data/perfil';
import * as perfilEn from '@/data/perfil.en';
import { ui } from '@/data/ui';
import { useIdioma } from '@/composables/useIdioma';

const { porIdioma } = useIdioma();
const t = computed(() => porIdioma(ui).home);
const ferramentas = computed(() => porIdioma({ pt: perfilPt, en: perfilEn }).ferramentas);

const iconePorRota = to => (to.includes('juros') ? PresentationChartLineIcon : CalculatorIcon);
</script>

<template>
    <section
        id="ferramentas"
        aria-labelledby="titulo-ferramentas"
        class="scroll-section border-t border-[var(--border-subtle)] bg-[var(--bg-canvas)] py-20 lg:py-28"
    >
        <div class="container mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
            <SectionHeader
                id="titulo-ferramentas"
                :eyebrow="t.eyebrows.ferramentas"
                :title="t.ferramentas"
                :subtitle="t.ferramentasSub"
            />

            <div class="mx-auto mt-12 grid max-w-4xl grid-cols-1 gap-6 md:grid-cols-2">
                <RouterLink
                    v-for="(f, i) in ferramentas"
                    :key="f.to"
                    v-reveal="{ delay: i * 0.08 }"
                    :to="f.to"
                    class="group flex flex-col rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-6 transition hover:border-[var(--accent)]/50 hover:shadow-md sm:p-8"
                >
                    <div class="flex items-center justify-between gap-3">
                        <div
                            class="flex size-11 items-center justify-center rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-subtle)] text-[var(--accent)]"
                        >
                            <component :is="iconePorRota(f.to)" class="size-6" aria-hidden="true" />
                        </div>
                        <span
                            class="rounded-full border border-[var(--border-subtle)] bg-[var(--bg-canvas)] px-2.5 py-0.5 font-mono text-xs text-[var(--text-muted)]"
                        >
                            {{ t.clientSideBadge }}
                        </span>
                    </div>

                    <h3 class="mt-5 font-display text-lg font-bold text-[var(--text-primary)] transition group-hover:text-[var(--accent)]">
                        {{ f.nome }}
                    </h3>
                    <p class="mt-2 flex-1 text-sm leading-relaxed text-[var(--text-secondary)]">
                        {{ f.descricao }}
                    </p>
                    <span class="mt-5 inline-block text-sm font-semibold text-[var(--accent)] transition-transform group-hover:translate-x-1">
                        {{ t.abrir }}
                    </span>
                </RouterLink>
            </div>
        </div>
    </section>
</template>
