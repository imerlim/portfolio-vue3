<script setup>
import { computed, nextTick, ref } from 'vue';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowRightIcon, ArrowTopRightOnSquareIcon, MagnifyingGlassPlusIcon, PhotoIcon } from '@heroicons/vue/24/outline';
import SectionHeader from '@/components/SectionHeader.vue';
import * as perfilPt from '@/data/perfil';
import * as perfilEn from '@/data/perfil.en';
import { ui } from '@/data/ui';
import { useIdioma } from '@/composables/useIdioma';

gsap.registerPlugin(ScrollTrigger);

const emit = defineEmits(['open-lightbox']);

const { porIdioma } = useIdioma();
const t = computed(() => porIdioma(ui).home);
const projetos = computed(() => porIdioma({ pt: perfilPt, en: perfilEn }).projetos);

const filtroAtivo = ref('all');

const filtros = computed(() => [
    { id: 'all', label: t.value.filtroTodos },
    { id: 'Vue', label: 'Vue' },
    { id: 'Laravel', label: 'Laravel' },
    { id: 'NestJS / React', label: 'NestJS / React' },
]);

const projetosFiltrados = computed(() => {
    if (filtroAtivo.value === 'all') return projetos.value;
    return projetos.value.filter(p => {
        const tagsLower = (p.tags || []).map(tag => tag.toLowerCase());
        if (filtroAtivo.value === 'Vue') return tagsLower.some(tag => tag.includes('vue'));
        if (filtroAtivo.value === 'Laravel') return tagsLower.some(tag => tag.includes('laravel'));
        if (filtroAtivo.value === 'NestJS / React') {
            return tagsLower.some(tag => tag.includes('nestjs') || tag.includes('react'));
        }
        return true;
    });
});

const selecionarFiltro = async id => {
    if (filtroAtivo.value === id) return;
    filtroAtivo.value = id;
    await nextTick();
    ScrollTrigger.refresh();
};

const abrirImagem = p => {
    emit('open-lightbox', {
        src: p.imagem,
        alt: t.value.projetoImgAlt(p.nome),
        titulo: p.nome,
    });
};
</script>

<template>
    <section
        id="projetos"
        aria-labelledby="titulo-projetos"
        class="scroll-section border-t border-[var(--border-subtle)] bg-[var(--bg-surface)] py-20 lg:py-28"
    >
        <div class="container mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
            <SectionHeader
                id="titulo-projetos"
                :eyebrow="t.eyebrows.projetos"
                :title="t.projetos"
                :subtitle="t.projetosSub"
            />

            <!-- Filtro leve por stack -->
            <div class="mt-10 flex flex-wrap items-center justify-center gap-2" role="group" :aria-label="t.projetos">
                <button
                    v-for="f in filtros"
                    :key="f.id"
                    type="button"
                    :aria-pressed="filtroAtivo === f.id"
                    @click="selecionarFiltro(f.id)"
                    class="rounded-full border px-4 py-1.5 font-mono text-xs font-medium transition focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]"
                    :class="
                        filtroAtivo === f.id
                            ? 'border-[var(--accent)] bg-[var(--accent)] text-white shadow-sm'
                            : 'border-[var(--border-subtle)] bg-[var(--bg-canvas)] text-[var(--text-secondary)] hover:border-[var(--accent)]/50 hover:text-[var(--text-primary)]'
                    "
                >
                    {{ f.label }}
                </button>
            </div>

            <!-- Grid de projetos (sem v-reveal nos articles para não esconder cards ao filtrar) -->
            <div class="mx-auto mt-10 grid max-w-6xl grid-cols-1 gap-8 md:grid-cols-2">
                <article
                    v-for="(p, i) in projetosFiltrados"
                    :key="p.imagem || i"
                    class="flex h-full flex-col overflow-hidden rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-canvas)] transition hover:border-[var(--accent)]/50 hover:shadow-md md:last:odd:col-span-2 md:last:odd:w-[calc(50%-1rem)] md:last:odd:justify-self-center"
                >
                    <button
                        v-if="p.imagem"
                        type="button"
                        class="group relative flex aspect-video w-full cursor-zoom-in items-center justify-center overflow-hidden border-b border-[var(--border-subtle)] bg-linear-to-br from-slate-200/90 via-slate-100 to-sky-100/70 p-3 sm:p-4 dark:from-slate-900 dark:via-[#0b1324] dark:to-slate-950 focus:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[var(--accent)]"
                        :aria-label="t.lb.ampliar(p.nome)"
                        @click="abrirImagem(p)"
                    >
                        <!-- Brilho radial sutil no palco para profundidade em dark/light -->
                        <span
                            aria-hidden="true"
                            class="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(14,165,233,0.14),transparent_65%)] dark:bg-[radial-gradient(ellipse_at_top,rgba(56,189,248,0.16),transparent_65%)]"
                        />

                        <!-- Moldura estilo janela/mockup sutil -->
                        <span
                            class="relative flex h-full w-full flex-col overflow-hidden rounded-xl border border-slate-900/15 bg-slate-950/90 shadow-md ring-1 ring-white/10 transition-transform duration-300 ease-out group-hover:scale-[1.02] dark:border-white/10 dark:bg-slate-950/85 dark:shadow-black/40"
                        >
                            <span
                                aria-hidden="true"
                                class="flex shrink-0 items-center gap-1.5 border-b border-white/10 bg-slate-900/90 px-3 py-1.5"
                            >
                                <span class="size-2 rounded-full bg-rose-400/75" />
                                <span class="size-2 rounded-full bg-amber-400/75" />
                                <span class="size-2 rounded-full bg-emerald-400/75" />
                                <span class="ml-2 truncate font-mono text-[10px] leading-none text-slate-400/80">
                                    {{ p.nome }}
                                </span>
                            </span>

                            <span class="relative flex min-h-0 flex-1 items-center justify-center overflow-hidden bg-slate-950/95 p-1.5 sm:p-2">
                                <img
                                    :src="p.imagem"
                                    :alt="t.projetoImgAlt(p.nome)"
                                    loading="lazy"
                                    decoding="async"
                                    class="h-full w-full object-contain"
                                />
                            </span>
                        </span>

                        <!-- Overlay de zoom no hover / foco -->
                        <span
                            class="pointer-events-none absolute inset-0 flex items-center justify-center bg-slate-950/0 opacity-0 backdrop-blur-[1px] transition duration-300 group-hover:bg-slate-950/35 group-hover:opacity-100 group-focus-visible:bg-slate-950/35 group-focus-visible:opacity-100"
                            aria-hidden="true"
                        >
                            <span
                                class="flex size-12 items-center justify-center rounded-full border border-white/20 bg-slate-950/75 text-white shadow-lg transition-transform duration-300 group-hover:scale-105"
                            >
                                <MagnifyingGlassPlusIcon class="size-6 drop-shadow" />
                            </span>
                        </span>
                    </button>

                    <div
                        v-else
                        role="img"
                        :aria-label="t.projetoImgAria(p.nome)"
                        class="flex aspect-video flex-col items-center justify-center gap-2 border-b border-dashed border-[var(--border-strong)] bg-[var(--bg-subtle)] px-4 text-center text-[var(--text-muted)]"
                    >
                        <PhotoIcon class="size-10" aria-hidden="true" />
                        <span class="text-xs">{{ t.projetoImgPlaceholder(p.nome) }}</span>
                    </div>

                    <div class="flex flex-1 flex-col p-6">
                        <h3 class="font-display text-lg font-bold text-[var(--text-primary)]">
                            {{ p.nome }}
                        </h3>
                        <p class="mt-2 flex-1 text-sm leading-relaxed text-[var(--text-secondary)]">
                            {{ p.descricao }}
                        </p>

                        <div class="mt-4 flex flex-wrap gap-1.5">
                            <span
                                v-for="(tag, j) in p.tags"
                                :key="j"
                                class="rounded-md border border-[var(--border-subtle)] bg-[var(--bg-surface)] px-2.5 py-0.5 font-mono text-xs font-medium text-[var(--text-secondary)]"
                            >
                                {{ tag }}
                            </span>
                        </div>

                        <div v-if="p.repo || p.demo || p.to" class="mt-5 flex flex-wrap gap-5 border-t border-[var(--border-subtle)] pt-4 text-sm font-semibold">
                            <RouterLink
                                v-if="p.to"
                                :to="p.to"
                                class="inline-flex items-center gap-1.5 text-[var(--accent)] transition hover:text-[var(--accent-strong)]"
                            >
                                {{ t.abrirFerramenta }}
                                <span class="sr-only"> — {{ p.nome }}</span>
                                <ArrowRightIcon class="size-4" aria-hidden="true" />
                            </RouterLink>
                            <a
                                v-if="p.repo"
                                :href="p.repo"
                                target="_blank"
                                rel="noopener noreferrer"
                                class="inline-flex items-center gap-1.5 text-[var(--accent)] transition hover:text-[var(--accent-strong)]"
                            >
                                {{ t.codigo }}
                                <span class="sr-only"> — {{ p.nome }}</span>
                                <ArrowTopRightOnSquareIcon class="size-4" aria-hidden="true" />
                            </a>
                            <a
                                v-if="p.demo"
                                :href="p.demo"
                                target="_blank"
                                rel="noopener noreferrer"
                                class="inline-flex items-center gap-1.5 text-[var(--accent)] transition hover:text-[var(--accent-strong)]"
                            >
                                {{ t.demo }}
                                <span class="sr-only"> — {{ p.nome }}</span>
                                <ArrowTopRightOnSquareIcon class="size-4" aria-hidden="true" />
                            </a>
                        </div>
                    </div>
                </article>
            </div>
        </div>
    </section>
</template>
