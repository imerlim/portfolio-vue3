<script setup>
import { computed } from 'vue';
import {
    ArrowsRightLeftIcon,
    CircleStackIcon,
    CubeTransparentIcon,
    ServerStackIcon,
    WindowIcon,
    WrenchScrewdriverIcon,
} from '@heroicons/vue/24/outline';
import SectionHeader from '@/components/SectionHeader.vue';
import * as perfilPt from '@/data/perfil';
import * as perfilEn from '@/data/perfil.en';
import { ui } from '@/data/ui';
import { useIdioma } from '@/composables/useIdioma';

const { porIdioma } = useIdioma();
const t = computed(() => porIdioma(ui).home);
const perfil = computed(() => porIdioma({ pt: perfilPt, en: perfilEn }));
const stack = computed(() => perfil.value.stack);
const arquitetura = computed(() => perfil.value.arquitetura);

const iconesGrupo = [
    ServerStackIcon,
    CircleStackIcon,
    WindowIcon,
    ArrowsRightLeftIcon,
    CubeTransparentIcon,
    WrenchScrewdriverIcon,
];
</script>

<template>
    <section
        id="stack"
        aria-labelledby="titulo-stack"
        class="scroll-section border-t border-[var(--border-subtle)] bg-[var(--bg-surface)] py-20 lg:py-28"
    >
        <div class="container mx-auto px-4 sm:px-6 lg:px-8">
            <SectionHeader
                id="titulo-stack"
                :eyebrow="t.eyebrows.stack"
                :title="t.stack"
            />

            <div class="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                <div
                    v-for="(grupo, index) in stack"
                    :key="index"
                    v-reveal="{ delay: index * 0.06 }"
                    class="rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-canvas)] p-6 transition-colors hover:border-[var(--border-strong)]"
                >
                    <div class="flex items-center justify-between gap-3">
                        <div class="flex items-center gap-3">
                            <span
                                class="inline-flex size-10 items-center justify-center rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] text-[var(--accent)]"
                            >
                                <component
                                    :is="iconesGrupo[index] ?? WrenchScrewdriverIcon"
                                    class="size-5"
                                    aria-hidden="true"
                                />
                            </span>
                            <h3 class="font-display text-lg font-bold text-[var(--text-primary)]">
                                {{ grupo.grupo }}
                            </h3>
                        </div>
                        <span class="font-mono text-xs font-semibold text-[var(--text-muted)]">
                            {{ String(grupo.itens.length).padStart(2, '0') }}
                        </span>
                    </div>

                    <div class="mt-4 flex flex-wrap gap-2">
                        <span
                            v-for="(item, itemIndex) in grupo.itens"
                            :key="itemIndex"
                            class="rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-subtle)] px-2.5 py-1 font-mono text-xs font-medium text-[var(--text-primary)]"
                        >
                            {{ item }}
                        </span>
                    </div>
                </div>
            </div>

            <div class="mt-16">
                <h3 v-reveal class="text-center font-display text-2xl font-bold text-[var(--text-primary)]">
                    {{ t.padroes }}
                </h3>
                <div class="mt-8 grid grid-cols-1 gap-6 md:grid-cols-2">
                    <div
                        v-for="(padrao, index) in arquitetura"
                        :key="index"
                        v-reveal="{ delay: index * 0.06 }"
                        class="rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-canvas)] p-6"
                    >
                        <div class="flex items-baseline gap-3">
                            <span class="font-mono text-xs font-semibold text-[var(--accent)]">
                                {{ String(index + 1).padStart(2, '0') }}
                            </span>
                            <h4 class="font-display text-base font-bold text-[var(--text-primary)]">
                                {{ padrao.titulo }}
                            </h4>
                        </div>
                        <p class="mt-2 text-sm leading-relaxed text-[var(--text-secondary)]">
                            {{ padrao.texto }}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    </section>
</template>
