<script setup>
import { computed, nextTick, onMounted, onBeforeUnmount, ref } from 'vue';
import { animate, svg } from 'animejs';
import { gsap } from 'gsap';
import GoldenSpiral from '@/components/animations/GoldenSpiral.vue';
import { slides as slidesPt } from '@/data/slides';
import { slides as slidesEn } from '@/data/slides.en';
import * as perfilPt from '@/data/perfil';
import * as perfilEn from '@/data/perfil.en';
import { ui } from '@/data/ui';
import { useIdioma } from '@/composables/useIdioma';

// Conteúdo reativo ao idioma. Listas usam índice como key para não recriar os elementos
// (mantém o v-reveal já revelado e o Swiper intacto ao trocar de idioma).
const { porIdioma } = useIdioma();
const t = computed(() => porIdioma(ui).home);
const slides = computed(() => porIdioma({ pt: slidesPt, en: slidesEn }));
const perfil = computed(() => porIdioma({ pt: perfilPt, en: perfilEn }));
const headline = computed(() => perfil.value.headline);
const sobre = computed(() => perfil.value.sobre);
const stack = computed(() => perfil.value.stack);
const arquitetura = computed(() => perfil.value.arquitetura);
const atuacao = computed(() => perfil.value.atuacao);
const projetos = computed(() => perfil.value.projetos);
const ferramentas = computed(() => perfil.value.ferramentas);
const contatos = computed(() => perfil.value.contatos);
import {
    PhotoIcon,
    UserIcon,
    ArrowTopRightOnSquareIcon,
    MapPinIcon,
    AcademicCapIcon,
    LanguageIcon,
    MagnifyingGlassPlusIcon,
    MagnifyingGlassMinusIcon,
    ArrowsPointingInIcon,
    XMarkIcon,
} from '@heroicons/vue/24/outline';

// Lightbox das imagens de projetos
const lb = computed(() =>
    porIdioma({
        pt: { ampliar: n => `Ampliar imagem do projeto ${n}`, ampliarSlide: n => `Ampliar imagem: ${n}`, mais: 'Aumentar zoom', menos: 'Diminuir zoom', reset: 'Restaurar zoom', fechar: 'Fechar' },
        en: { ampliar: n => `Enlarge image of project ${n}`, ampliarSlide: n => `Enlarge image: ${n}`, mais: 'Zoom in', menos: 'Zoom out', reset: 'Reset zoom', fechar: 'Close' },
    })
);
const ZOOM_MIN = 1;
const ZOOM_MAX = 4;
const ZOOM_STEP = 0.5;
const lightbox = ref(null); // { src, alt, titulo? }
const zoom = ref(1);
const pan = ref({ x: 0, y: 0 });
const arrastando = ref(false);
const btnFechar = ref(null);
let origemFoco = null;
let arrasto = null; // { id, x, y, px, py, moveu }
let ignorarClique = false;

const resetZoom = () => {
    zoom.value = 1;
    pan.value = { x: 0, y: 0 };
};
const setZoom = z => {
    zoom.value = Math.min(ZOOM_MAX, Math.max(ZOOM_MIN, Math.round(z * 100) / 100));
    if (zoom.value === 1) pan.value = { x: 0, y: 0 };
};
const abrirLightbox = (src, alt, titulo = null) => {
    origemFoco = document.activeElement;
    lightbox.value = { src, alt, titulo };
    resetZoom();
    swiperInst?.autoplay?.stop();
    document.body.style.overflow = 'hidden';
    nextTick(() => btnFechar.value?.focus());
};
const fecharLightbox = () => {
    if (!lightbox.value) return;
    lightbox.value = null;
    arrastando.value = false;
    arrasto = null;
    document.body.style.overflow = '';
    swiperInst?.autoplay?.start();
    origemFoco?.focus?.();
};
const onBackdropClick = () => {
    if (ignorarClique) return (ignorarClique = false);
    fecharLightbox();
};
const onWheel = e => setZoom(zoom.value + (e.deltaY < 0 ? 0.25 : -0.25));
const onPointerDown = e => {
    if (zoom.value <= 1) return;
    e.currentTarget.setPointerCapture(e.pointerId);
    arrasto = { id: e.pointerId, x: e.clientX, y: e.clientY, px: pan.value.x, py: pan.value.y, moveu: false };
    arrastando.value = true;
};
const onPointerMove = e => {
    if (!arrasto || arrasto.id !== e.pointerId) return;
    const dx = e.clientX - arrasto.x;
    const dy = e.clientY - arrasto.y;
    if (Math.abs(dx) + Math.abs(dy) > 3) arrasto.moveu = true;
    pan.value = { x: arrasto.px + dx, y: arrasto.py + dy };
};
const onPointerUp = e => {
    if (!arrasto || arrasto.id !== e.pointerId) return;
    ignorarClique = arrasto.moveu;
    setTimeout(() => (ignorarClique = false), 0);
    arrasto = null;
    arrastando.value = false;
};
const onKeydown = e => {
    if (!lightbox.value) return;
    if (e.key === 'Escape') fecharLightbox();
    else if (e.key === '+' || e.key === '=') setZoom(zoom.value + ZOOM_STEP);
    else if (e.key === '-') setZoom(zoom.value - ZOOM_STEP);
    else if (e.key === '0') resetZoom();
};

// Swiper (componentes Vue + estilos + módulos)
import { Swiper, SwiperSlide } from 'swiper/vue';
import 'swiper/css';
import 'swiper/css/effect-cube';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import { EffectCube, Pagination, Navigation, Autoplay } from 'swiper/modules';

// Zoom do Swiper removido: o zoom agora é feito no lightbox (clique no slide), sem interferir na rotação do cubo.
const modules = [EffectCube, Pagination, Navigation, Autoplay];
const activeIndex = ref(0);
let swiperInst = null;
const onSwiper = s => (swiperInst = s);
const abrirSlide = slide => abrirLightbox(slide.image, slide.title, slide.title);
// No efeito cube os slides ficam num contexto 3D (preserve-3d + rotações acumuladas pelo loop) e o
// hit-testing do navegador às vezes não acerta a face ativa: o ponteiro cai no próprio .swiper, então
// nem o :hover (ícone de zoom) nem o clique chegam ao botão do slide (e, com touchEventsTarget 'wrapper',
// o Swiper também ignorava esse toque). Por isso: touchEventsTarget="container", o clique do mouse é lido
// pelo evento "click" do Swiper (só quando não houve arrasto) e o ícone fica numa camada fora do 3D.
// O <button> do slide continua para teclado (event.detail === 0).
const onSwiperClick = (swiper, e) => {
    if (e?.target?.closest?.('.swiper-button-prev, .swiper-button-next, .swiper-pagination')) return;
    abrirSlide(slides.value[swiper.realIndex]);
};
const onSlideBtnClick = (e, slide) => {
    if (e.detail === 0) abrirSlide(slide);
};

// Imagem ausente em public/storage/: troca só o src (sem re-render, para não afetar o loop do Swiper)
const PLACEHOLDER =
    'data:image/svg+xml;charset=utf-8,' +
    encodeURIComponent(
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 550 340"><rect width="550" height="340" fill="#334155"/><text x="275" y="175" fill="#cbd5e1" font-family="sans-serif" font-size="22" text-anchor="middle">Imagem indisponível</text></svg>'
    );
const usarPlaceholder = e => {
    if (e.target.src !== PLACEHOLDER) e.target.src = PLACEHOLDER;
};

const onSlideChange = swiper => {
    activeIndex.value = swiper.realIndex;
};

let drawAnimation = null;
let gsapCtx = null;

onMounted(() => {
    window.addEventListener('keydown', onKeydown);

    // Desenho do nome "Igor Merlim" com anime.js
    const drawable = svg.createDrawable('.animated-svg path');
    drawAnimation = animate(drawable, {
        draw: ['0 0', '0 1'],
        ease: 'inOutQuad',
        duration: 8888,
    });

    // Entrada do subtítulo com GSAP
    gsapCtx = gsap.context(() => {
        gsap.from('.js-subtitle', { duration: 1.2, y: 20, opacity: 0, ease: 'power2.out', delay: 1.8 });
    });
});

onBeforeUnmount(() => {
    window.removeEventListener('keydown', onKeydown);
    document.body.style.overflow = '';
    drawAnimation?.pause?.();
    gsapCtx?.revert();
});
</script>

<template>
    <div class="w-full">
        <section id="inicio" class="scroll-section relative w-full h-screen overflow-hidden bg-slate-100 dark:bg-slate-900">
            <GoldenSpiral class="z-10" />

            <div class="text-center mt-32 relative z-20">
                <h1 class="sr-only">Igor Merlim</h1>
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 9.470000267028809 242.13999938964844 46.31999969482422"
                    width="242"
                    height="46"
                    aria-hidden="true"
                    class="animated-svg mx-auto block"
                >
                    <g fill="#ffffff">
                        <path d="M0 45.26L0 9.47L4.74 9.47L4.74 45.26L0 45.26ZM11.72 47.41L15.99 48.05Q16.26 50.02 17.48 50.93Q19.12 52.15 21.95 52.15Q25 52.15 26.66 50.93Q28.32 49.71 28.91 47.51Q29.25 46.17 29.22 41.87Q26.34 45.26 22.05 45.26Q16.70 45.26 13.77 41.41Q10.84 37.55 10.84 32.15Q10.84 28.44 12.18 25.31Q13.53 22.17 16.08 20.46Q18.63 18.75 22.07 18.75Q26.66 18.75 29.64 22.46L29.64 19.34L33.69 19.34L33.69 41.75Q33.69 47.80 32.46 50.33Q31.23 52.86 28.55 54.32Q25.88 55.79 21.97 55.79Q17.33 55.79 14.48 53.70Q11.62 51.61 11.72 47.41M15.36 31.84Q15.36 36.94 17.38 39.28Q19.41 41.63 22.46 41.63Q25.49 41.63 27.54 39.29Q29.59 36.96 29.59 31.98Q29.59 27.22 27.48 24.80Q25.37 22.39 22.39 22.39Q19.46 22.39 17.41 24.77Q15.36 27.15 15.36 31.84ZM38.70 32.30Q38.70 25.10 42.70 21.63Q46.04 18.75 50.85 18.75Q56.20 18.75 59.59 22.25Q62.99 25.76 62.99 31.93Q62.99 36.94 61.49 39.81Q59.99 42.68 57.12 44.26Q54.25 45.85 50.85 45.85Q45.41 45.85 42.05 42.36Q38.70 38.87 38.70 32.30M43.21 32.30Q43.21 37.28 45.39 39.76Q47.56 42.24 50.85 42.24Q54.13 42.24 56.30 39.75Q58.47 37.26 58.47 32.15Q58.47 27.34 56.29 24.87Q54.10 22.39 50.85 22.39Q47.56 22.39 45.39 24.85Q43.21 27.32 43.21 32.30ZM68.09 45.26L68.09 19.34L72.05 19.34L72.05 23.27Q73.56 20.51 74.84 19.63Q76.12 18.75 77.66 18.75Q79.88 18.75 82.18 20.17L80.66 24.24Q79.05 23.29 77.44 23.29Q76.00 23.29 74.85 24.16Q73.71 25.02 73.22 26.56Q72.49 28.91 72.49 31.69L72.49 45.26L68.09 45.26ZM99.10 45.26L99.10 9.47L106.23 9.47L114.70 34.81Q115.87 38.35 116.41 40.11Q117.02 38.16 118.31 34.38L126.88 9.47L133.25 9.47L133.25 45.26L128.69 45.26L128.69 15.31L118.29 45.26L114.01 45.26L103.66 14.79L103.66 45.26L99.10 45.26ZM158.08 36.91L162.62 37.48Q161.55 41.46 158.64 43.65Q155.74 45.85 151.22 45.85Q145.53 45.85 142.20 42.35Q138.87 38.84 138.87 32.52Q138.87 25.98 142.24 22.36Q145.61 18.75 150.98 18.75Q156.18 18.75 159.47 22.29Q162.77 25.83 162.77 32.25Q162.77 32.64 162.74 33.42L143.41 33.42Q143.65 37.70 145.83 39.97Q148.00 42.24 151.25 42.24Q153.66 42.24 155.37 40.97Q157.08 39.70 158.08 36.91M143.65 29.81L158.13 29.81Q157.84 26.54 156.47 24.90Q154.37 22.36 151.03 22.36Q148.00 22.36 145.94 24.39Q143.87 26.42 143.65 29.81ZM168.09 45.26L168.09 19.34L172.05 19.34L172.05 23.27Q173.56 20.51 174.84 19.63Q176.12 18.75 177.66 18.75Q179.88 18.75 182.18 20.17L180.66 24.24Q179.05 23.29 177.44 23.29Q176.00 23.29 174.85 24.16Q173.71 25.02 173.22 26.56Q172.49 28.91 172.49 31.69L172.49 45.26L168.09 45.26ZM184.69 45.26L184.69 9.47L189.09 9.47L189.09 45.26L184.69 45.26ZM195.92 14.53L195.92 9.47L200.32 9.47L200.32 14.53L195.92 14.53M195.92 45.26L195.92 19.34L200.32 19.34L200.32 45.26L195.92 45.26ZM207.01 45.26L207.01 19.34L210.94 19.34L210.94 22.97Q212.16 21.07 214.18 19.91Q216.21 18.75 218.80 18.75Q221.68 18.75 223.52 19.95Q225.37 21.14 226.12 23.29Q229.20 18.75 234.13 18.75Q237.99 18.75 240.06 20.89Q242.14 23.02 242.14 27.47L242.14 45.26L237.77 45.26L237.77 28.93Q237.77 26.29 237.34 25.13Q236.91 23.97 235.79 23.27Q234.67 22.56 233.15 22.56Q230.42 22.56 228.61 24.38Q226.81 26.20 226.81 30.20L226.81 45.26L222.41 45.26L222.41 28.42Q222.41 25.49 221.34 24.02Q220.26 22.56 217.82 22.56Q215.97 22.56 214.39 23.54Q212.82 24.51 212.11 26.39Q211.40 28.27 211.40 31.81L211.40 45.26L207.01 45.26Z" />
                    </g>
                </svg>
                <p class="js-subtitle text-lg mt-4 px-4 text-white">
                    {{ headline }}
                </p>
            </div>
        </section>

        <!-- Sobre -->
        <section id="sobre" class="scroll-section bg-slate-100 dark:bg-slate-900 py-20">
            <div class="container mx-auto px-4 sm:px-16">
                <div class="grid grid-cols-1 items-center gap-10 md:grid-cols-3 lg:px-8">
                    <div v-reveal class="mx-auto w-full max-w-xs md:col-span-1">
                        <!-- Fundo em degradê cinza escuro com luz sutil nos cantos (aparece atrás e sobre a foto) -->
                        <div
                            v-if="sobre.foto"
                            class="foto-frame relative aspect-[4/5] w-full overflow-hidden rounded-2xl shadow-lg ring-1 ring-slate-900/10 dark:ring-white/10"
                        >
                            <img
                                :src="sobre.foto"
                                :alt="t.fotoAria"
                                decoding="async"
                                class="relative h-full w-full object-cover"
                            />
                            <span class="foto-luz pointer-events-none absolute inset-0" aria-hidden="true"></span>
                        </div>
                        <!-- Espaço reservado caso não haja foto -->
                        <div
                            v-else
                            role="img"
                            :aria-label="t.fotoAria"
                            class="flex aspect-[4/5] w-full flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-slate-300 bg-slate-100 text-slate-400 dark:border-slate-600 dark:bg-slate-900 dark:text-slate-500"
                        >
                            <UserIcon class="size-16" aria-hidden="true" />
                            <span class="text-sm">{{ t.foto }}</span>
                        </div>
                    </div>

                    <div v-reveal="{ delay: 0.1 }" class="md:col-span-2">
                        <h2 class="text-3xl font-semibold tracking-tight text-slate-950 sm:text-5xl dark:text-white">{{ t.sobre }}</h2>
                        <p class="mt-4 text-xl font-semibold text-sky-600">{{ sobre.titulo }}</p>
                        <p class="mt-1 text-sm font-medium text-slate-500 dark:text-slate-400">{{ sobre.destaque }}</p>
                        <p class="mt-2 inline-flex items-center gap-1 text-sm text-slate-500 dark:text-slate-400">
                            <MapPinIcon class="size-4" aria-hidden="true" /> {{ sobre.local }}
                        </p>
                        <p
                            v-for="(p, i) in sobre.paragrafos"
                            :key="i"
                            class="mt-4 text-base leading-relaxed text-gray-600 lg:text-lg dark:text-gray-400"
                        >
                            {{ p }}
                        </p>

                        <div class="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2">
                            <div>
                                <h3 class="flex items-center gap-2 font-bold text-slate-900 dark:text-white">
                                    <AcademicCapIcon class="size-5 text-sky-600" aria-hidden="true" /> {{ t.formacao }}
                                </h3>
                                <ul class="mt-3 space-y-3">
                                    <li v-for="(f, i) in sobre.formacao" :key="i">
                                        <p class="font-semibold text-slate-800 dark:text-slate-200">{{ f.titulo }}</p>
                                        <p class="text-sm text-gray-600 dark:text-gray-400">{{ f.local }} · {{ f.periodo }}</p>
                                    </li>
                                </ul>
                            </div>
                            <div>
                                <h3 class="flex items-center gap-2 font-bold text-slate-900 dark:text-white">
                                    <LanguageIcon class="size-5 text-sky-600" aria-hidden="true" /> {{ t.idiomas }}
                                </h3>
                                <ul class="mt-3 space-y-1">
                                    <li v-for="(l, i) in sobre.idiomas" :key="i" class="text-gray-700 dark:text-gray-300">
                                        <span class="font-semibold">{{ l.nome }}</span> — {{ l.nivel }}
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        <!-- Stack e arquitetura -->
        <section id="stack" class="scroll-section bg-slate-100 dark:bg-slate-900 py-20">
            <div class="container mx-auto px-4 sm:px-16 lg:px-24">
                <h2
                    v-reveal
                    class="text-balance text-center text-3xl font-semibold tracking-tight text-slate-950 sm:text-5xl dark:text-white"
                >
                    {{ t.stack }}
                </h2>

                <div class="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    <div
                        v-for="(g, i) in stack"
                        :key="i"
                        v-reveal="{ delay: i * 0.08 }"
                        class="rounded-xl bg-white p-5 shadow-sm ring-1 ring-slate-900/5 dark:bg-slate-850 dark:ring-white/10"
                    >
                        <h3 class="text-lg font-bold text-sky-600">{{ g.grupo }}</h3>
                        <div class="mt-3 flex flex-wrap gap-2">
                            <span
                                v-for="(item, j) in g.itens"
                                :key="j"
                                class="rounded-md border border-sky-200 bg-sky-50 px-2 py-1 text-xs font-semibold text-sky-800 dark:border-sky-800 dark:bg-sky-900/30 dark:text-sky-300"
                            >
                                {{ item }}
                            </span>
                        </div>
                    </div>
                </div>

                <h3 v-reveal class="mt-16 text-center text-2xl font-semibold text-slate-950 dark:text-white">
                    {{ t.padroes }}
                </h3>
                <div class="mt-8 grid grid-cols-1 gap-6 md:grid-cols-2">
                    <div
                        v-for="(a, i) in arquitetura"
                        :key="i"
                        v-reveal="{ delay: i * 0.08 }"
                        class="rounded-xl border-l-4 border-sky-600 bg-white p-5 shadow-sm dark:bg-slate-850"
                    >
                        <h4 class="font-bold text-slate-900 dark:text-white">{{ a.titulo }}</h4>
                        <p class="mt-2 text-gray-600 dark:text-gray-400">{{ a.texto }}</p>
                    </div>
                </div>
            </div>
        </section>

        <section
            id="experiencia"
            class="scroll-section relative isolate overflow-hidden text-white dark:text-slate-300 bg-slate-100 dark:bg-slate-900 min-h-screen pt-32 sm:px-5 sm:pt-0"
        >
            <div class="container mx-auto sm:px-16">
                <div class="grid grid-cols-1 gap-x-8 gap-y-8 px-4 py-11 sm:px-6 md:grid-cols-3 lg:px-8">
                    <div v-reveal class="md:col-span-3">
                        <h2
                            class="text-balance text-center text-3xl font-semibold tracking-tight text-slate-950 sm:text-5xl dark:text-white"
                        >
                            {{ t.experiencia }}
                        </h2>
                    </div>

                    <div v-reveal="{ delay: 0.1, y: 32 }" class="md:col-span-2 w-full px-4 lg:pr-10 lg:mt-3">
                        <div class="group/cubo relative mx-auto w-full max-w-[700px]">
                        <swiper
                            :slidesPerView="1"
                            :style="{
                                '--swiper-navigation-color': '#00649e',
                                '--swiper-pagination-color': '#00649e',
                            }"
                            :effect="'cube'"
                            :grabCursor="true"
                            touchEventsTarget="container"
                            :loop="true"
                            :autoplay="{ delay: 15000, disableOnInteraction: false }"
                            :cubeEffect="{ shadow: true, slideShadows: true, shadowOffset: 20, shadowScale: 0.94 }"
                            :navigation="true"
                            :pagination="{ clickable: true }"
                            :modules="modules"
                            @swiper="onSwiper"
                            @slideChange="onSlideChange"
                            @click="onSwiperClick"
                            class="rounded-lg shadow-2xl"
                        >
                            <swiper-slide v-for="(slide, index) in slides" :key="index" class="overflow-hidden rounded-lg">
                                <button
                                    type="button"
                                    class="slide-btn group relative block h-full w-full cursor-zoom-in focus:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-sky-500"
                                    :aria-label="lb.ampliarSlide(slide.title)"
                                    @click="onSlideBtnClick($event, slide)"
                                >
                                    <img :src="slide.image" :alt="slide.title" draggable="false" @error="usarPlaceholder" />
                                    <!-- Só para foco via teclado; o hover usa a camada fora do 3D abaixo -->
                                    <span
                                        class="pointer-events-none absolute inset-0 flex items-center justify-center bg-slate-950/0 opacity-0 transition group-focus-visible:bg-slate-950/30 group-focus-visible:opacity-100"
                                        aria-hidden="true"
                                    >
                                        <MagnifyingGlassPlusIcon class="size-10 text-white drop-shadow" />
                                    </span>
                                </button>
                            </swiper-slide>
                        </swiper>
                        <!-- Ícone de zoom no hover, fora do contexto 3D do cubo (aparece igual em todos os slides) -->
                        <span
                            class="pointer-events-none absolute inset-0 z-[2] flex items-center justify-center rounded-lg bg-slate-950/0 opacity-0 transition group-hover/cubo:bg-slate-950/30 group-hover/cubo:opacity-100"
                            aria-hidden="true"
                        >
                            <MagnifyingGlassPlusIcon class="size-10 text-white drop-shadow" />
                        </span>
                        </div>
                    </div>

                    <div v-reveal="{ delay: 0.2, y: 32 }" class="md:col-span-1 flex flex-col lg:pb-0">
                        <h3 class="text-2xl font-bold text-sky-600 transition-all">
                            {{ slides[activeIndex].title }}
                        </h3>

                        <div class="mt-4 flex flex-wrap gap-2">
                            <span
                                v-for="(tag, j) in slides[activeIndex].tags"
                                :key="j"
                                class="px-2 py-1 text-xs font-semibold rounded-md bg-sky-300/80 text-sky-800 dark:bg-sky-900/30 dark:text-sky-300 border border-sky-200 dark:border-sky-800"
                            >
                                {{ tag }}
                            </span>
                        </div>

                        <div class="mt-4 max-h-[300px] lg:max-h-none overflow-y-auto">
                            <p class="whitespace-pre-line text-base lg:text-lg text-gray-600 dark:text-gray-400 leading-relaxed">
                                {{ slides[activeIndex].description }}
                            </p>
                        </div>
                    </div>
                </div>

                <!-- Atuação (LinkedIn + currículos) -->
                <div class="px-4 pb-20 sm:px-6 lg:px-8">
                    <div v-reveal class="border-l-4 border-sky-600 pl-4">
                        <h3 class="text-2xl font-bold text-slate-950 dark:text-white">{{ atuacao.cargo }}</h3>
                        <p class="mt-1 text-lg font-semibold text-sky-600">{{ atuacao.empresa }}</p>
                        <p class="text-sm text-slate-500 dark:text-slate-400">{{ atuacao.periodo }} · {{ atuacao.local }}</p>
                    </div>
                    <div class="mt-8 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                        <div
                            v-for="(d, i) in atuacao.destaques"
                            :key="i"
                            v-reveal="{ delay: (i % 3) * 0.08 }"
                            class="rounded-xl bg-white p-5 shadow-sm ring-1 ring-slate-900/5 dark:bg-slate-850 dark:ring-white/10"
                        >
                            <h4 class="font-bold text-slate-900 dark:text-white">{{ d.titulo }}</h4>
                            <p class="mt-2 text-sm leading-relaxed text-gray-600 dark:text-gray-400">{{ d.texto }}</p>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        <!-- Projetos (repositórios públicos do GitHub + projetos dos currículos) -->
        <section id="projetos" class="scroll-section bg-slate-100 dark:bg-slate-900 py-20">
            <div class="container mx-auto px-4 sm:px-16 lg:px-24">
                <h2
                    v-reveal
                    class="text-balance text-center text-3xl font-semibold tracking-tight text-slate-950 sm:text-5xl dark:text-white"
                >
                    {{ t.projetos }}
                </h2>
                <p v-reveal class="mt-4 text-center text-gray-600 dark:text-gray-400">{{ t.projetosSub }}</p>

                <!-- 2 colunas a partir de md; se o total for ímpar, o último card fica centralizado com a largura de uma coluna -->
                <div class="mx-auto mt-12 grid max-w-6xl grid-cols-1 gap-8 md:grid-cols-2">
                    <article
                        v-for="(p, i) in projetos"
                        :key="i"
                        v-reveal="{ delay: (i % 2) * 0.08 }"
                        class="flex flex-col overflow-hidden rounded-xl bg-slate-100 shadow-sm ring-1 ring-slate-900/5 md:last:odd:col-span-2 md:last:odd:w-[calc(50%-1rem)] md:last:odd:justify-self-center dark:bg-slate-900 dark:ring-white/10"
                    >
                        <!-- Imagem ocupa todo o card (object-cover); clique abre o lightbox com zoom para ver o print inteiro -->
                        <button
                            v-if="p.imagem"
                            type="button"
                            class="group relative block aspect-video w-full cursor-zoom-in overflow-hidden border-b border-slate-200 bg-slate-200/60 focus:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-sky-500 dark:border-slate-800 dark:bg-slate-800/60"
                            :aria-label="lb.ampliar(p.nome)"
                            @click="abrirLightbox(p.imagem, t.projetoImgAria(p.nome))"
                        >
                            <img
                                :src="p.imagem"
                                :alt="t.projetoImgAria(p.nome)"
                                loading="lazy"
                                decoding="async"
                                class="h-full w-full object-cover object-top transition duration-300 group-hover:scale-105"
                            />
                            <span
                                class="pointer-events-none absolute inset-0 flex items-center justify-center bg-slate-950/0 opacity-0 transition group-hover:bg-slate-950/40 group-hover:opacity-100 group-focus-visible:bg-slate-950/40 group-focus-visible:opacity-100"
                                aria-hidden="true"
                            >
                                <MagnifyingGlassPlusIcon class="size-10 text-white drop-shadow" />
                            </span>
                        </button>
                        <!-- Espaço reservado para imagem do projeto -->
                        <div
                            v-else
                            role="img"
                            :aria-label="t.projetoImgAria(p.nome)"
                            class="flex aspect-video items-center justify-center border-b-2 border-dashed border-slate-300 bg-slate-200/60 text-slate-400 dark:border-slate-700 dark:bg-slate-800/60 dark:text-slate-500"
                        >
                            <PhotoIcon class="size-10" aria-hidden="true" />
                        </div>
                        <div class="flex flex-1 flex-col p-5">
                            <h3 class="text-lg font-bold text-slate-900 dark:text-white">{{ p.nome }}</h3>
                            <p class="mt-2 flex-1 text-sm text-gray-600 dark:text-gray-400">{{ p.descricao }}</p>
                            <div class="mt-4 flex flex-wrap gap-2">
                                <span
                                    v-for="(tag, j) in p.tags"
                                    :key="j"
                                    class="rounded-md bg-sky-100 px-2 py-0.5 text-xs font-semibold text-sky-800 dark:bg-sky-900/30 dark:text-sky-300"
                                >
                                    {{ tag }}
                                </span>
                            </div>
                            <div v-if="p.repo || p.demo" class="mt-4 flex gap-4 text-sm font-semibold">
                                <a v-if="p.repo" :href="p.repo" target="_blank" rel="noopener noreferrer" class="inline-flex items-center gap-1 text-sky-600 hover:text-sky-500">
                                    {{ t.codigo }} <ArrowTopRightOnSquareIcon class="size-4" aria-hidden="true" />
                                </a>
                                <a
                                    v-if="p.demo"
                                    :href="p.demo"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    class="inline-flex items-center gap-1 text-sky-600 hover:text-sky-500"
                                >
                                    {{ t.demo }} <ArrowTopRightOnSquareIcon class="size-4" aria-hidden="true" />
                                </a>
                            </div>
                        </div>
                    </article>
                </div>
            </div>
        </section>

        <!-- Ferramentas (calculadoras deste site) -->
        <section id="ferramentas" class="scroll-section bg-slate-100 dark:bg-slate-900 py-20">
            <div class="container mx-auto px-4 sm:px-16 lg:px-24">
                <h2
                    v-reveal
                    class="text-balance text-center text-3xl font-semibold tracking-tight text-slate-950 sm:text-5xl dark:text-white"
                >
                    {{ t.ferramentas }}
                </h2>
                <div class="mx-auto mt-12 grid max-w-4xl grid-cols-1 gap-6 md:grid-cols-2">
                    <RouterLink
                        v-for="(f, i) in ferramentas"
                        :key="f.to"
                        v-reveal="{ delay: i * 0.08 }"
                        :to="f.to"
                        class="group rounded-xl bg-white p-6 shadow-sm ring-1 ring-slate-900/5 transition hover:ring-sky-500 dark:bg-slate-850 dark:ring-white/10"
                    >
                        <h3 class="text-lg font-bold text-slate-900 group-hover:text-sky-600 dark:text-white">{{ f.nome }}</h3>
                        <p class="mt-2 text-gray-600 dark:text-gray-400">{{ f.descricao }}</p>
                        <span class="mt-4 inline-block text-sm font-semibold text-sky-600">{{ t.abrir }}</span>
                    </RouterLink>
                </div>
            </div>
        </section>

        <!-- Contato -->
        <section id="contato" class="scroll-section bg-slate-100 dark:bg-slate-900 py-20">
            <div class="container mx-auto px-4 text-center sm:px-16">
                <h2 v-reveal class="text-3xl font-semibold tracking-tight text-slate-950 sm:text-5xl dark:text-white">{{ t.contato }}</h2>
                <div class="mx-auto mt-10 grid max-w-3xl grid-cols-1 gap-4 sm:grid-cols-2">
                    <a
                        v-for="(c, i) in contatos"
                        :key="i"
                        v-reveal="{ delay: i * 0.06 }"
                        :href="c.href"
                        :target="c.href.startsWith('mailto:') ? undefined : '_blank'"
                        rel="noopener noreferrer"
                        class="rounded-xl bg-slate-100 p-5 text-left ring-1 ring-slate-900/5 transition hover:ring-sky-500 dark:bg-slate-900 dark:ring-white/10"
                    >
                        <span class="block text-sm font-semibold text-sky-600">{{ c.nome }}</span>
                        <span class="mt-1 block break-all text-slate-900 dark:text-white">{{ c.valor }}</span>
                    </a>
                </div>
            </div>
        </section>

        <!-- Lightbox das imagens de projetos (zoom: botões, roda do mouse, duplo clique, teclas + - 0; arrastar para mover) -->
        <Teleport to="body">
            <Transition
                enter-active-class="transition duration-200 ease-out"
                enter-from-class="opacity-0"
                leave-active-class="transition duration-150 ease-in"
                leave-to-class="opacity-0"
            >
                <div
                    v-if="lightbox"
                    role="dialog"
                    aria-modal="true"
                    :aria-label="lightbox.alt"
                    class="fixed inset-0 z-[100] flex items-center justify-center overflow-hidden bg-slate-950/90 backdrop-blur-sm"
                    @click.self="onBackdropClick"
                    @wheel.prevent="onWheel"
                >
                    <img
                        :src="lightbox.src"
                        :alt="lightbox.alt"
                        draggable="false"
                        @error="usarPlaceholder"
                        class="max-h-[90vh] max-w-[95vw] touch-none select-none rounded-lg object-contain shadow-2xl"
                        :class="[zoom > 1 ? (arrastando ? 'cursor-grabbing' : 'cursor-grab') : 'cursor-zoom-in', arrastando ? '' : 'transition-transform duration-150']"
                        :style="{ transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})` }"
                        @dblclick="zoom > 1 ? resetZoom() : setZoom(2)"
                        @pointerdown="onPointerDown"
                        @pointermove="onPointerMove"
                        @pointerup="onPointerUp"
                        @pointercancel="onPointerUp"
                    />

                    <p
                        v-if="lightbox.titulo"
                        class="pointer-events-none absolute left-4 right-20 top-5 truncate text-lg font-semibold text-white drop-shadow"
                    >
                        {{ lightbox.titulo }}
                    </p>

                    <div
                        class="absolute bottom-6 left-1/2 flex -translate-x-1/2 items-center gap-1 rounded-full bg-slate-900/80 p-1 text-white shadow-lg ring-1 ring-white/10"
                    >
                        <button type="button" class="lb-btn" :aria-label="lb.menos" :disabled="zoom <= ZOOM_MIN" @click="setZoom(zoom - ZOOM_STEP)">
                            <MagnifyingGlassMinusIcon class="size-5" aria-hidden="true" />
                        </button>
                        <span class="w-14 text-center text-sm tabular-nums" aria-live="polite">{{ Math.round(zoom * 100) }}%</span>
                        <button type="button" class="lb-btn" :aria-label="lb.mais" :disabled="zoom >= ZOOM_MAX" @click="setZoom(zoom + ZOOM_STEP)">
                            <MagnifyingGlassPlusIcon class="size-5" aria-hidden="true" />
                        </button>
                        <button type="button" class="lb-btn" :aria-label="lb.reset" :disabled="zoom === 1" @click="resetZoom">
                            <ArrowsPointingInIcon class="size-5" aria-hidden="true" />
                        </button>
                    </div>

                    <button
                        ref="btnFechar"
                        type="button"
                        class="lb-btn absolute right-4 top-4 bg-slate-900/80 ring-1 ring-white/10"
                        :aria-label="lb.fechar"
                        @click="fecharLightbox"
                    >
                        <XMarkIcon class="size-6 text-white" aria-hidden="true" />
                    </button>
                </div>
            </Transition>
        </Teleport>
    </div>
</template>

<style scoped>
.animated-svg path {
    fill: none;
    stroke: #ffffff;
    stroke-width: 2;
    stroke-linecap: round;
    vector-effect: non-scaling-stroke;
}

.foto-frame {
    background:
        radial-gradient(circle at 0% 0%, rgb(255 255 255 / 0.14), transparent 45%),
        radial-gradient(circle at 100% 100%, rgb(255 255 255 / 0.08), transparent 50%),
        linear-gradient(160deg, #3f4248 0%, #26282d 55%, #141518 100%);
}
.foto-luz {
    background:
        radial-gradient(circle at 0% 0%, rgb(255 255 255 / 0.12), transparent 35%),
        radial-gradient(circle at 100% 0%, rgb(255 255 255 / 0.05), transparent 30%),
        radial-gradient(circle at 100% 100%, rgb(255 255 255 / 0.07), transparent 35%);
    mix-blend-mode: screen;
    box-shadow: inset 0 0 40px rgb(0 0 0 / 0.35);
}

.lb-btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 2.5rem;
    height: 2.5rem;
    border-radius: 9999px;
    color: #fff;
    transition: background-color 0.15s;
}
.lb-btn:hover:not(:disabled) {
    background-color: rgb(255 255 255 / 0.15);
}
.lb-btn:focus-visible {
    outline: 2px solid #0ea5e9;
    outline-offset: 2px;
}
.lb-btn:disabled {
    opacity: 0.4;
    cursor: not-allowed;
}

.swiper {
    width: 100%;
    max-width: 700px;
    aspect-ratio: 55 / 34;
}

/* Imagem preenche 100% da face do cubo, sem faixas/bordas; o print inteiro fica no lightbox */
.slide-btn img {
    display: block;
    width: 100%;
    height: 100%;
    object-fit: cover;
    object-position: top;
    user-select: none;
    -webkit-user-drag: none;
}
</style>
