<script setup>
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue';
import { useRoute } from 'vue-router';
import {
    Dialog,
    DialogPanel,
    Disclosure,
    DisclosureButton,
    DisclosurePanel,
    Popover,
    PopoverButton,
    PopoverGroup,
    PopoverPanel,
} from '@headlessui/vue';
import { Bars3Icon, PresentationChartLineIcon, CalculatorIcon, XMarkIcon } from '@heroicons/vue/24/outline';
import { ChevronDownIcon } from '@heroicons/vue/20/solid';
import ThemeSwitcher from '@/components/ThemeSwitcher.vue';
import GlobalMsg from '@/components/GlobalMsg.vue';
import LanguageSwitcher from '@/components/LanguageSwitcher.vue';
import { ui } from '@/data/ui';
import { useIdioma } from '@/composables/useIdioma';
import { useScrollToSection } from '@/composables/useScrollToSection';
import logo from '@/assets/logo.png';

const mobileMenuOpen = ref(false);
const scrolled = ref(false);
const route = useRoute();
const { porIdioma } = useIdioma();
const { irPara: rolarPara } = useScrollToSection();
const t = computed(() => porIdioma(ui).nav);

const isFerramentaAtiva = computed(() => route.path.startsWith('/calculadora-'));

// Seções da Home. Com hash history, href="#id" trocaria a rota; por isso a rolagem é via JS.
const secoes = ['inicio', 'sobre', 'stack', 'experiencia', 'projetos', 'contato'].map(id => ({ id }));

// Destaca a seção visível (só na Home)
const secaoAtiva = ref('inicio');
let observer = null;

const observarSecoes = async (tentativa = 0) => {
    observer?.disconnect();
    observer = null;
    if (route.name !== 'home') {
        secaoAtiva.value = null;
        return;
    }
    await nextTick();
    // A Home é carregada sob demanda: tenta de novo até as seções existirem no DOM
    if (!document.getElementById(secoes.at(-1).id)) {
        if (tentativa < 60) requestAnimationFrame(() => observarSecoes(tentativa + 1));
        return;
    }
    observer = new IntersectionObserver(
        entries => {
            entries.forEach(e => {
                if (e.isIntersecting) secaoAtiva.value = e.target.id;
            });
        },
        { rootMargin: '-45% 0px -50% 0px' }
    );
    secoes.forEach(s => {
        const el = document.getElementById(s.id);
        if (el) observer.observe(el);
    });
};

const onScroll = () => {
    scrolled.value = window.scrollY > 12;
};

onMounted(() => {
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
});

watch(() => route.name, () => observarSecoes(), { immediate: true });

onBeforeUnmount(() => {
    observer?.disconnect();
    window.removeEventListener('scroll', onScroll);
});

const irPara = id => rolarPara(id, () => {
    mobileMenuOpen.value = false;
});

const rotasFerramentas = [
    { to: '/calculadora-margem', icon: CalculatorIcon },
    { to: '/calculadora-juros-compostos', icon: PresentationChartLineIcon },
];
const ferramentas = computed(() => rotasFerramentas.map((r, i) => ({ ...r, ...porIdioma(ui).ferramentasMenu[i] })));
</script>

<template>
    <header
        :class="[
            'fixed top-0 inset-x-0 z-50 h-16 transition-colors duration-200',
            scrolled
                ? 'bg-white/85 dark:bg-[#070d19]/85 backdrop-blur-md border-b border-[var(--border-subtle)] shadow-xs'
                : 'bg-white/70 dark:bg-[#070d19]/70 backdrop-blur-sm border-b border-transparent',
        ]"
    >
        <GlobalMsg />
        <div class="container mx-auto h-full px-4 sm:px-6 lg:px-8">
            <nav class="flex h-full items-center justify-between" :aria-label="t.navegacao">
                <div class="flex lg:flex-1">
                    <RouterLink
                        to="/"
                        class="-m-1.5 rounded-lg p-1.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]"
                    >
                        <span class="sr-only">{{ t.logo }}</span>
                        <img class="h-7 w-auto" width="335" height="159" :src="logo" alt="" />
                    </RouterLink>
                </div>

                <div class="flex items-center gap-3 lg:hidden">
                    <LanguageSwitcher />
                    <button
                        type="button"
                        :aria-expanded="mobileMenuOpen"
                        class="-m-2 inline-flex items-center justify-center rounded-lg p-2 text-[var(--text-secondary)] hover:text-[var(--text-primary)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]"
                        @click="mobileMenuOpen = true"
                    >
                        <span class="sr-only">{{ t.abrirMenu }}</span>
                        <Bars3Icon class="size-6" aria-hidden="true" />
                    </button>
                </div>

                <PopoverGroup class="hidden lg:flex lg:items-center lg:gap-x-7">
                    <button
                        v-for="secao in secoes"
                        :key="secao.id"
                        type="button"
                        :aria-current="secaoAtiva === secao.id ? 'location' : undefined"
                        :class="[
                            secaoAtiva === secao.id
                                ? 'text-[var(--accent)]'
                                : 'text-[var(--text-primary)] hover:text-[var(--accent)]',
                            'text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] rounded-md px-1 py-0.5',
                        ]"
                        @click="irPara(secao.id)"
                    >
                        {{ t[secao.id] }}
                    </button>

                    <Popover class="relative" v-slot="{ close }">
                        <PopoverButton
                            :class="[
                                isFerramentaAtiva
                                    ? 'text-[var(--accent)]'
                                    : 'text-[var(--text-primary)] hover:text-[var(--accent)]',
                                'flex items-center gap-x-1 text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] rounded-md px-1 py-0.5',
                            ]"
                        >
                            {{ t.ferramentas }}
                            <ChevronDownIcon class="size-4 flex-none text-[var(--text-muted)]" aria-hidden="true" />
                        </PopoverButton>

                        <transition
                            enter-active-class="transition ease-out duration-200"
                            enter-from-class="opacity-0 translate-y-1"
                            enter-to-class="translate-y-0"
                            leave-active-class="transition ease-in duration-150"
                            leave-from-class="translate-y-0"
                            leave-to-class="opacity-0 translate-y-1"
                        >
                            <PopoverPanel
                                class="absolute left-1/2 z-10 mt-3 w-screen max-w-md -translate-x-1/2 overflow-hidden rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] shadow-xl"
                            >
                                <div class="p-3">
                                    <div
                                        v-for="item in ferramentas"
                                        :key="item.to"
                                        class="group relative flex items-center gap-x-4 rounded-xl p-3 text-sm transition-colors hover:bg-[var(--bg-subtle)]"
                                    >
                                        <div
                                            class="flex size-11 flex-none items-center justify-center rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-subtle)] group-hover:bg-[var(--bg-surface)]"
                                        >
                                            <component
                                                :is="item.icon"
                                                :class="[
                                                    route.path === item.to
                                                        ? 'text-[var(--accent)]'
                                                        : 'text-[var(--text-secondary)] group-hover:text-[var(--accent)]',
                                                    'size-5 transition-colors',
                                                ]"
                                                aria-hidden="true"
                                            />
                                        </div>
                                        <div class="flex-auto">
                                            <RouterLink
                                                :to="item.to"
                                                :class="[
                                                    route.path === item.to ? 'text-[var(--accent)]' : 'text-[var(--text-primary)]',
                                                    'block font-semibold',
                                                ]"
                                                @click="close()"
                                            >
                                                {{ item.name }}
                                                <span class="absolute inset-0" />
                                            </RouterLink>
                                            <p class="mt-0.5 text-xs text-[var(--text-secondary)]">{{ item.description }}</p>
                                        </div>
                                    </div>
                                </div>
                            </PopoverPanel>
                        </transition>
                    </Popover>
                </PopoverGroup>

                <div class="hidden lg:flex lg:flex-1 lg:items-center lg:justify-end lg:gap-3">
                    <LanguageSwitcher />
                    <ThemeSwitcher />
                </div>
            </nav>

            <Dialog class="lg:hidden" :aria-label="t.navegacao" @close="mobileMenuOpen = false" :open="mobileMenuOpen">
                <div class="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs" aria-hidden="true" />
                <DialogPanel
                    class="fixed inset-y-0 right-0 z-50 w-full overflow-y-auto bg-[var(--bg-surface)] p-6 sm:max-w-sm sm:border-l sm:border-[var(--border-subtle)]"
                >
                    <div class="flex items-center justify-between">
                        <RouterLink to="/" class="-m-1.5 p-1.5" @click="mobileMenuOpen = false">
                            <span class="sr-only">{{ t.logo }}</span>
                            <img class="h-7 w-auto" width="335" height="159" :src="logo" alt="" />
                        </RouterLink>
                        <button
                            type="button"
                            class="-m-2 rounded-lg p-2 text-[var(--text-secondary)] hover:text-[var(--text-primary)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]"
                            @click="mobileMenuOpen = false"
                        >
                            <span class="sr-only">{{ t.fecharMenu }}</span>
                            <XMarkIcon class="size-6" aria-hidden="true" />
                        </button>
                    </div>

                    <nav class="mt-6 flow-root" :aria-label="t.navegacao">
                        <div class="-my-6 divide-y divide-[var(--border-subtle)]">
                            <div class="space-y-1.5 py-6">
                                <button
                                    v-for="secao in secoes"
                                    :key="secao.id"
                                    type="button"
                                    :aria-current="secaoAtiva === secao.id ? 'location' : undefined"
                                    :class="[
                                        secaoAtiva === secao.id
                                            ? 'text-[var(--accent)] bg-[var(--bg-subtle)]'
                                            : 'text-[var(--text-primary)] hover:bg-[var(--bg-subtle)]',
                                        '-mx-3 block w-[calc(100%+1.5rem)] rounded-lg px-3 py-2 text-left text-base font-semibold transition-colors',
                                    ]"
                                    @click="irPara(secao.id)"
                                >
                                    {{ t[secao.id] }}
                                </button>

                                <Disclosure as="div" class="-mx-3" v-slot="{ open }">
                                    <DisclosureButton
                                        :class="[
                                            isFerramentaAtiva ? 'text-[var(--accent)]' : 'text-[var(--text-primary)]',
                                            'flex w-full items-center justify-between rounded-lg py-2 pr-3.5 pl-3 text-base font-semibold hover:bg-[var(--bg-subtle)] transition-colors',
                                        ]"
                                    >
                                        {{ t.ferramentas }}
                                        <ChevronDownIcon :class="[open ? 'rotate-180' : '', 'size-5 flex-none transition-transform']" aria-hidden="true" />
                                    </DisclosureButton>
                                    <DisclosurePanel class="mt-1 space-y-1">
                                        <RouterLink
                                            v-for="item in ferramentas"
                                            :key="item.to"
                                            :to="item.to"
                                            @click="mobileMenuOpen = false"
                                            :class="[
                                                route.path === item.to
                                                    ? 'text-[var(--accent)] bg-[var(--bg-subtle)]'
                                                    : 'text-[var(--text-secondary)] hover:bg-[var(--bg-subtle)] hover:text-[var(--text-primary)]',
                                                'block rounded-lg py-2 pr-3 pl-6 text-sm font-semibold transition-colors',
                                            ]"
                                        >
                                            {{ item.name }}
                                        </RouterLink>
                                    </DisclosurePanel>
                                </Disclosure>
                            </div>

                            <div class="py-6 flex items-center gap-3">
                                <ThemeSwitcher />
                                <span class="text-sm font-medium text-[var(--text-secondary)]">{{ t.alternarTema }}</span>
                            </div>
                        </div>
                    </nav>
                </DialogPanel>
            </Dialog>
        </div>
    </header>
</template>
