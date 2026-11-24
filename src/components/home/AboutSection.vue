<script setup>
import { computed } from 'vue';
import { AcademicCapIcon, LanguageIcon, MapPinIcon, UserIcon } from '@heroicons/vue/24/outline';
import SectionHeader from '@/components/SectionHeader.vue';
import * as perfilPt from '@/data/perfil';
import * as perfilEn from '@/data/perfil.en';
import { ui } from '@/data/ui';
import { useIdioma } from '@/composables/useIdioma';

const { porIdioma } = useIdioma();
const t = computed(() => porIdioma(ui).home);
const perfil = computed(() => porIdioma({ pt: perfilPt, en: perfilEn }));
const sobre = computed(() => perfil.value.sobre);
</script>

<template>
    <section
        id="sobre"
        aria-labelledby="titulo-sobre"
        class="scroll-section border-t border-[var(--border-subtle)] bg-[var(--bg-canvas)] py-20 lg:py-28"
    >
        <div class="container mx-auto px-4 sm:px-6 lg:px-8">
            <div class="grid grid-cols-1 items-start gap-10 lg:grid-cols-12 lg:gap-12">
                <!-- Coluna esquerda: Foto + localização e idiomas -->
                <div v-reveal class="mx-auto w-full max-w-sm space-y-4 lg:col-span-4 lg:max-w-none">
                    <div
                        v-if="sobre.foto"
                        class="relative aspect-[4/5] w-full overflow-hidden rounded-2xl bg-[#111c32] shadow-xl ring-1 ring-[var(--border-subtle)]"
                    >
                        <img
                            :src="sobre.foto"
                            :alt="t.fotoAria"
                            width="800"
                            height="1000"
                            loading="lazy"
                            decoding="async"
                            class="h-full w-full object-cover"
                        />
                    </div>
                    <div
                        v-else
                        role="img"
                        :aria-label="t.fotoAria"
                        class="flex aspect-[4/5] w-full flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-[var(--border-strong)] bg-[var(--bg-surface)] text-[var(--text-muted)]"
                    >
                        <UserIcon class="size-16" aria-hidden="true" />
                        <span class="text-sm">{{ t.foto }}</span>
                    </div>

                    <div class="rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-5 space-y-4">
                        <div class="flex items-start gap-3">
                            <MapPinIcon class="mt-0.5 size-5 shrink-0 text-[var(--accent)]" aria-hidden="true" />
                            <div>
                                <p class="text-sm font-medium text-[var(--text-primary)]">{{ sobre.local }}</p>
                            </div>
                        </div>

                        <div class="border-t border-[var(--border-subtle)] pt-4 flex items-start gap-3">
                            <LanguageIcon class="mt-0.5 size-5 shrink-0 text-[var(--accent)]" aria-hidden="true" />
                            <div class="flex-1">
                                <h3 class="font-mono text-xs font-semibold uppercase tracking-wider text-[var(--text-muted)]">
                                    {{ t.idiomas }}
                                </h3>
                                <ul class="mt-1.5 space-y-1 text-sm text-[var(--text-secondary)]">
                                    <li v-for="(idiomaItem, index) in sobre.idiomas" :key="index">
                                        <span class="font-semibold text-[var(--text-primary)]">{{ idiomaItem.nome }}</span>
                                        — {{ idiomaItem.nivel }}
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Coluna direita: Texto editorial, métricas e formação -->
                <div v-reveal="{ delay: 0.1 }" class="lg:col-span-8">
                    <SectionHeader
                        id="titulo-sobre"
                        :eyebrow="t.eyebrows.sobre"
                        :title="t.sobre"
                        align="left"
                    />

                    <p class="mt-6 font-display text-xl font-semibold text-[var(--text-primary)] sm:text-2xl">
                        {{ sobre.titulo }}
                    </p>
                    <p class="mt-2 font-mono text-xs font-medium text-[var(--accent)] sm:text-sm">
                        {{ sobre.destaque }}
                    </p>

                    <div class="mt-6 space-y-4">
                        <p
                            v-for="(paragrafo, index) in sobre.paragrafos"
                            :key="index"
                            class="text-base leading-relaxed text-[var(--text-secondary)] lg:text-lg"
                        >
                            {{ paragrafo }}
                        </p>
                    </div>

                    <!-- Strip de métricas -->
                    <div class="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <div class="rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-5">
                            <p class="font-display text-3xl font-bold text-[var(--accent)]">{{ t.metricas.anosValor }}</p>
                            <p class="mt-1 text-sm text-[var(--text-secondary)]">{{ t.metricas.anosLabel }}</p>
                        </div>
                        <div class="rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-5">
                            <p class="font-display text-3xl font-bold text-[var(--accent)]">{{ t.metricas.reducaoValor }}</p>
                            <p class="mt-1 text-sm text-[var(--text-secondary)]">{{ t.metricas.reducaoLabel }}</p>
                        </div>
                    </div>

                    <!-- Formação -->
                    <div class="mt-8">
                        <h3 class="flex items-center gap-2 font-display text-base font-semibold text-[var(--text-primary)]">
                            <AcademicCapIcon class="size-5 text-[var(--accent)]" aria-hidden="true" />
                            <span>{{ t.formacao }}</span>
                        </h3>
                        <div class="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
                            <div
                                v-for="(item, index) in sobre.formacao"
                                :key="index"
                                class="rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-5"
                            >
                                <p class="font-display font-semibold text-[var(--text-primary)]">{{ item.titulo }}</p>
                                <p class="mt-1 text-sm text-[var(--text-secondary)]">{{ item.local }}</p>
                                <p class="mt-2 font-mono text-xs text-[var(--text-muted)]">{{ item.periodo }}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>
</template>
