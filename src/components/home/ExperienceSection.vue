<script setup>
import { computed, ref } from 'vue';
import { ArrowRightIcon, ShieldCheckIcon } from '@heroicons/vue/24/outline';
import { Swiper, SwiperSlide } from 'swiper/vue';
import 'swiper/css';
import 'swiper/css/effect-cube';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import { EffectCube, Pagination, Navigation, Autoplay } from 'swiper/modules';
import SectionHeader from '@/components/SectionHeader.vue';
import { slides as slidesPt } from '@/data/slides';
import { slides as slidesEn } from '@/data/slides.en';
import * as perfilPt from '@/data/perfil';
import * as perfilEn from '@/data/perfil.en';
import { ui } from '@/data/ui';
import { useIdioma } from '@/composables/useIdioma';

const { porIdioma } = useIdioma();
const t = computed(() => porIdioma(ui).home);
const slides = computed(() => porIdioma({ pt: slidesPt, en: slidesEn }));
const atuacao = computed(() => porIdioma({ pt: perfilPt, en: perfilEn }).atuacao);

const modules = [EffectCube, Pagination, Navigation, Autoplay];
const activeIndex = ref(0);
let swiperInst = null;

const onSwiper = s => {
    swiperInst = s;
};

const onSlideChange = swiper => {
    activeIndex.value = swiper.realIndex;
};

const irParaSlide = index => {
    swiperInst?.slideToLoop(index);
};

const ACCENT_STYLES = {
    sky: {
        badge: 'border-sky-400/30 bg-sky-500/15 text-sky-300',
        glow: 'from-sky-500/20 via-sky-500/5 to-transparent',
        node: 'border-sky-400/35 bg-sky-950/60',
        dot: 'bg-sky-400',
    },
    amber: {
        badge: 'border-amber-400/30 bg-amber-500/15 text-amber-300',
        glow: 'from-amber-500/20 via-amber-500/5 to-transparent',
        node: 'border-amber-400/35 bg-amber-950/40',
        dot: 'bg-amber-400',
    },
    rose: {
        badge: 'border-rose-400/30 bg-rose-500/15 text-rose-300',
        glow: 'from-rose-500/20 via-rose-500/5 to-transparent',
        node: 'border-rose-400/35 bg-rose-950/40',
        dot: 'bg-rose-400',
    },
    orange: {
        badge: 'border-orange-400/30 bg-orange-500/15 text-orange-300',
        glow: 'from-orange-500/20 via-orange-500/5 to-transparent',
        node: 'border-orange-400/35 bg-orange-950/40',
        dot: 'bg-orange-400',
    },
    emerald: {
        badge: 'border-emerald-400/30 bg-emerald-500/15 text-emerald-300',
        glow: 'from-emerald-500/20 via-emerald-500/5 to-transparent',
        node: 'border-emerald-400/35 bg-emerald-950/40',
        dot: 'bg-emerald-400',
    },
    indigo: {
        badge: 'border-indigo-400/30 bg-indigo-500/15 text-indigo-300',
        glow: 'from-indigo-500/20 via-indigo-500/5 to-transparent',
        node: 'border-indigo-400/35 bg-indigo-950/40',
        dot: 'bg-indigo-400',
    },
    cyan: {
        badge: 'border-cyan-400/30 bg-cyan-500/15 text-cyan-300',
        glow: 'from-cyan-500/20 via-cyan-500/5 to-transparent',
        node: 'border-cyan-400/35 bg-cyan-950/40',
        dot: 'bg-cyan-400',
    },
};

const getAccent = key => ACCENT_STYLES[key] || ACCENT_STYLES.sky;

const parseBullets = desc =>
    (desc || '')
        .split(/\n+/)
        .map(line => line.trim())
        .filter(Boolean)
        .map(line => {
            const clean = line.replace(/^-\s*/, '');
            const colonIdx = clean.indexOf(':');
            if (colonIdx > 0) {
                return {
                    label: clean.slice(0, colonIdx).trim(),
                    text: clean.slice(colonIdx + 1).trim(),
                };
            }
            return { label: '', text: clean };
        });

const formatContador = idx => String(idx + 1).padStart(2, '0');
</script>

<template>
    <section
        id="experiencia"
        aria-labelledby="titulo-experiencia"
        class="scroll-section border-t border-[var(--border-subtle)] bg-[var(--bg-canvas)] py-20 lg:py-28"
    >
        <div class="container mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
            <SectionHeader id="titulo-experiencia" :eyebrow="t.eyebrows.experiencia" :title="t.experiencia" />

            <!-- Cabeçalho da atuação na Total Control Technology -->
            <div
                v-reveal
                class="mt-12 flex flex-col gap-3 border-l-2 border-[var(--accent)] pl-5 sm:flex-row sm:items-center sm:justify-between"
            >
                <div>
                    <h3 class="font-display text-2xl font-bold text-[var(--text-primary)]">
                        {{ atuacao.cargo }}
                    </h3>
                    <p class="mt-1 text-base font-semibold text-[var(--accent)]">
                        {{ atuacao.empresa }}
                        <span class="font-normal text-[var(--text-muted)]">· {{ atuacao.local }}</span>
                    </p>
                </div>
                <span
                    class="inline-flex w-fit items-center rounded-full border border-[var(--border-subtle)] bg-[var(--bg-surface)] px-3 py-1 font-mono text-xs font-medium text-[var(--text-secondary)]"
                >
                    {{ atuacao.periodo }}
                </span>
            </div>

            <!-- Showcase interativo LGPD-safe: Cubo 3D com Architecture Blueprint Cards + Painel Lateral -->
            <div
                v-reveal="{ delay: 0.08, y: 24 }"
                class="mt-8 rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-5 shadow-sm sm:p-8"
            >
                <!-- Seletor rápido de integrações -->
                <div class="mb-6 flex flex-col gap-3 border-b border-[var(--border-subtle)] pb-5 sm:flex-row sm:items-center sm:justify-between">
                    <span class="font-mono text-xs font-semibold uppercase tracking-wider text-[var(--text-muted)]">
                        {{ t.integracaoLabel }}
                    </span>
                    <div class="flex flex-wrap gap-1.5" role="tablist" :aria-label="t.integracaoLabel">
                        <button
                            v-for="(slide, index) in slides"
                            :key="index"
                            type="button"
                            role="tab"
                            :aria-selected="activeIndex === index"
                            @click="irParaSlide(index)"
                            class="rounded-lg border px-2.5 py-1 font-mono text-xs font-medium transition focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]"
                            :class="
                                activeIndex === index
                                    ? 'border-[var(--accent)] bg-[var(--accent)] text-white shadow-xs'
                                    : 'border-[var(--border-subtle)] bg-[var(--bg-canvas)] text-[var(--text-secondary)] hover:border-[var(--accent)]/50 hover:text-[var(--text-primary)]'
                            "
                        >
                            {{ slide.shortName }}
                        </button>
                    </div>
                </div>

                <div class="grid grid-cols-1 items-start gap-8 lg:grid-cols-12 lg:gap-10">
                    <!-- Cubo 3D com Architecture Blueprint Cards (sem imagens privadas) -->
                    <div class="lg:col-span-7">
                        <div class="relative mx-auto w-full max-w-[700px]">
                            <swiper
                                :slidesPerView="1"
                                :style="{
                                    '--swiper-navigation-color': '#38bdf8',
                                    '--swiper-pagination-color': '#38bdf8',
                                }"
                                :effect="'cube'"
                                :grabCursor="true"
                                touchEventsTarget="container"
                                :loop="true"
                                :autoplay="{ delay: 12000, disableOnInteraction: false }"
                                :cubeEffect="{ shadow: true, slideShadows: true, shadowOffset: 20, shadowScale: 0.94 }"
                                :navigation="true"
                                :pagination="{ clickable: true }"
                                :modules="modules"
                                @swiper="onSwiper"
                                @slideChange="onSlideChange"
                                class="blueprint-swiper rounded-2xl shadow-xl"
                            >
                                <swiper-slide
                                    v-for="(slide, index) in slides"
                                    :key="index"
                                    class="overflow-hidden rounded-2xl"
                                >
                                    <div
                                        class="blueprint-card relative flex h-full w-full flex-col justify-between overflow-hidden rounded-2xl border border-slate-700/80 bg-[#08101f] px-10 pt-4 pb-12 text-slate-100 select-none sm:px-12 sm:pt-6 sm:pb-11"
                                    >
                                        <!-- Glow sutil temático -->
                                        <div
                                            class="pointer-events-none absolute -top-20 -right-20 size-64 rounded-full bg-radial opacity-70 blur-2xl"
                                            :class="getAccent(slide.accent).glow"
                                            aria-hidden="true"
                                        ></div>

                                        <!-- Topo do Blueprint -->
                                        <div class="relative z-10 flex flex-wrap items-center justify-between gap-2">
                                            <div class="flex flex-wrap items-center gap-1.5 sm:gap-2">
                                                <span
                                                    class="inline-flex items-center gap-1.5 rounded-md border px-2 py-0.5 font-mono text-[11px] font-semibold"
                                                    :class="getAccent(slide.accent).badge"
                                                >
                                                    <span class="size-1.5 rounded-full" :class="getAccent(slide.accent).dot"></span>
                                                    {{ slide.category }}
                                                </span>
                                                <span
                                                    class="rounded-md border border-slate-700 bg-slate-900/80 px-2 py-0.5 font-mono text-[11px] text-slate-300"
                                                >
                                                    {{ slide.protocol }}
                                                </span>
                                            </div>
                                            <span class="font-mono text-xs font-semibold text-slate-400 tabular-nums">
                                                {{ formatContador(index) }} / {{ String(slides.length).padStart(2, '0') }}
                                            </span>
                                        </div>

                                        <!-- Centro: Plataforma + Diagrama de Fluxo -->
                                        <div class="relative z-10 my-auto py-2 sm:py-4">
                                            <p class="font-mono text-[11px] uppercase tracking-widest text-slate-400">
                                                {{ t.fluxoArquitetura }}
                                            </p>
                                            <h4 class="mt-0.5 font-display text-xl font-bold tracking-tight text-white sm:mt-1 sm:text-3xl">
                                                {{ slide.shortName }}
                                            </h4>

                                            <!-- Fluxo em 3 nós conectados -->
                                            <div class="mt-3 flex flex-col items-stretch gap-1.5 sm:mt-4 sm:flex-row sm:items-center sm:gap-2">
                                                <template v-for="(step, sIdx) in slide.flow" :key="sIdx">
                                                    <div
                                                        class="flex flex-1 items-center justify-center rounded-xl border px-2.5 py-1.5 text-center font-mono text-[11px] font-medium text-slate-100 sm:px-3 sm:py-2.5 sm:text-xs"
                                                        :class="
                                                            sIdx === 1
                                                                ? getAccent(slide.accent).node
                                                                : 'border-slate-700/80 bg-slate-900/70'
                                                        "
                                                    >
                                                        {{ step }}
                                                    </div>
                                                    <ArrowRightIcon
                                                        v-if="sIdx < slide.flow.length - 1"
                                                        class="mx-auto size-3.5 shrink-0 rotate-90 text-sky-400 sm:mx-0 sm:size-4 sm:rotate-0"
                                                        aria-hidden="true"
                                                    />
                                                </template>
                                            </div>
                                        </div>

                                        <!-- Base: Highlights + Selo LGPD -->
                                        <div class="relative z-10 flex flex-wrap items-center justify-between gap-2 border-t border-slate-800/90 pt-2.5 sm:pt-3">
                                            <div class="flex flex-wrap gap-1.5">
                                                <span
                                                    v-for="(h, hIdx) in slide.highlights"
                                                    :key="hIdx"
                                                    class="rounded-md border border-slate-700/70 bg-slate-900/70 px-1.5 py-0.5 font-mono text-[10px] text-slate-300 sm:px-2 sm:text-[11px]"
                                                >
                                                    {{ h }}
                                                </span>
                                            </div>
                                            <span class="inline-flex items-center gap-1 font-mono text-[11px] text-slate-400">
                                                <ShieldCheckIcon class="size-3.5 text-emerald-400" aria-hidden="true" />
                                                {{ t.seloLgpd }}
                                            </span>
                                        </div>
                                    </div>
                                </swiper-slide>
                            </swiper>
                        </div>
                    </div>

                    <!-- Painel lateral -->
                    <div class="flex flex-col lg:col-span-5">
                        <div class="flex flex-wrap items-center justify-between gap-2">
                            <span class="font-mono text-xs font-semibold tracking-wider text-[var(--accent)] tabular-nums">
                                {{ formatContador(activeIndex) }} / {{ String(slides.length).padStart(2, '0') }}
                            </span>
                            <span class="text-xs text-[var(--text-muted)]">
                                {{ t.dicaCubo }}
                            </span>
                        </div>

                        <h3 class="mt-3 font-display text-xl font-bold text-[var(--text-primary)] sm:text-2xl">
                            {{ slides[activeIndex]?.title }}
                        </h3>

                        <div class="mt-4 flex flex-wrap gap-1.5">
                            <span
                                v-for="(tag, j) in slides[activeIndex]?.tags"
                                :key="j"
                                class="rounded-md border border-[var(--border-subtle)] bg-[var(--bg-subtle)] px-2.5 py-1 font-mono text-xs font-medium text-[var(--text-secondary)]"
                            >
                                {{ tag }}
                            </span>
                        </div>

                        <!-- Todos os blocos renderizados no DOM para SEO, alternando visibilidade com v-show -->
                        <div class="mt-5 max-h-[340px] overflow-y-auto pr-1 lg:max-h-none lg:overflow-visible" aria-live="polite">
                            <div
                                v-for="(slide, index) in slides"
                                :key="index"
                                v-show="index === activeIndex"
                            >
                                <ul class="space-y-2.5 text-sm leading-relaxed text-[var(--text-secondary)]">
                                    <li
                                        v-for="(bullet, bIdx) in parseBullets(slide.description)"
                                        :key="bIdx"
                                        class="flex gap-2.5"
                                    >
                                        <span
                                            class="mt-2 size-1.5 shrink-0 rounded-full bg-[var(--accent)]"
                                            aria-hidden="true"
                                        ></span>
                                        <span>
                                            <strong
                                                v-if="bullet.label"
                                                class="font-semibold text-[var(--text-primary)]"
                                            >
                                                {{ bullet.label }}:
                                            </strong>
                                            <span>{{ bullet.text }}</span>
                                        </span>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- 6 pilares de atuação na Total Control Technology -->
            <div class="mt-8 grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
                <div
                    v-for="(d, index) in atuacao.destaques"
                    :key="index"
                    v-reveal="{ delay: (index % 3) * 0.06 }"
                    class="flex flex-col rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-6 transition hover:border-[var(--accent)]/40"
                >
                    <span class="font-mono text-xs font-semibold tracking-wider text-[var(--accent)] tabular-nums">
                        {{ formatContador(index) }}
                    </span>
                    <h4 class="mt-2 font-display text-base font-bold text-[var(--text-primary)]">
                        {{ d.titulo }}
                    </h4>
                    <p class="mt-2 text-sm leading-relaxed text-[var(--text-secondary)]">
                        {{ d.texto }}
                    </p>
                </div>
            </div>
        </div>
    </section>
</template>

<style scoped>
.blueprint-swiper {
    width: 100%;
    max-width: 700px;
    height: 475px;
}

@media (min-width: 640px) {
    .blueprint-swiper {
        height: 410px;
    }
}

.blueprint-card {
    background-image:
        radial-gradient(rgba(56, 189, 248, 0.14) 1px, transparent 1px),
        linear-gradient(to bottom right, #08101f, #0d192d);
    background-size: 20px 20px, 100% 100%;
}

.blueprint-swiper :deep(.swiper-button-prev),
.blueprint-swiper :deep(.swiper-button-next) {
    width: 2rem;
    height: 2rem;
    border-radius: 9999px;
    background: rgba(8, 16, 31, 0.72);
    border: 1px solid rgba(148, 163, 184, 0.25);
    backdrop-filter: blur(4px);
}

.blueprint-swiper :deep(.swiper-button-prev::after),
.blueprint-swiper :deep(.swiper-button-next::after) {
    font-size: 0.75rem;
    font-weight: 700;
}

.blueprint-swiper :deep(.swiper-pagination) {
    bottom: 0.5rem;
}
</style>
