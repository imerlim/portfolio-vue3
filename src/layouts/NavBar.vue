<script setup>
import { computed, nextTick, onBeforeUnmount, ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
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
import logo from '@/assets/logo.png';

const mobileMenuOpen = ref(false);
const route = useRoute();
const router = useRouter();
const { porIdioma } = useIdioma();
const t = computed(() => porIdioma(ui).nav);

// Seções da Home. Com hash history, href="#id" trocaria a rota; por isso a rolagem é via JS.
// O rótulo vem de ui.js (t.value[id])
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

watch(() => route.name, () => observarSecoes(), { immediate: true });
onBeforeUnmount(() => observer?.disconnect());

const irPara = async id => {
    mobileMenuOpen.value = false;
    if (route.name !== 'home') {
        await router.push({ name: 'home' });
        await nextTick();
        // Espera o scrollBehavior do router ({ top: 0 }) ser aplicado antes de rolar até a seção
        await new Promise(r => requestAnimationFrame(() => requestAnimationFrame(r)));
    }
    const reduzir = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    document.getElementById(id)?.scrollIntoView({ behavior: reduzir ? 'auto' : 'smooth', block: 'start' });
};

const rotasFerramentas = [
    { to: '/calculadora-margem', icon: CalculatorIcon },
    { to: '/calculadora-juros-compostos', icon: PresentationChartLineIcon },
];
const projetos = computed(() => rotasFerramentas.map((r, i) => ({ ...r, ...porIdioma(ui).ferramentasMenu[i] })));
</script>

<template>
    <header class="bg-white dark:bg-slate-950 fixed top-0 z-50 w-full p-2">
        <GlobalMsg />
        <div class="container mx-auto sm:px-16">
            <nav class="mx-auto flex items-center justify-between py-2 sm:py-5" :aria-label="t.navegacao">
                <div class="flex lg:flex-1 sm:ml-5">
                    <RouterLink to="/" class="-m-1.5 p-1.5">
                        <span class="sr-only">{{ t.logo }}</span>
                        <img class="h-8 w-auto" :src="logo" alt="" />
                    </RouterLink>
                </div>
                <div class="flex items-center gap-4 lg:hidden">
                    <LanguageSwitcher />
                    <button
                        type="button"
                        class="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-700 dark:text-gray-400"
                        @click="mobileMenuOpen = true"
                    >
                        <span class="sr-only">{{ t.abrirMenu }}</span>
                        <Bars3Icon class="size-6" aria-hidden="true" />
                    </button>
                </div>
                <PopoverGroup class="hidden lg:flex lg:gap-x-7">
                    <button
                        v-for="secao in secoes"
                        :key="secao.id"
                        type="button"
                        :aria-current="secaoAtiva === secao.id ? 'location' : undefined"
                        :class="[
                            secaoAtiva === secao.id ? 'text-sky-600 dark:text-sky-400' : 'text-gray-900 dark:text-white',
                            'text-sm/6 font-semibold hover:text-sky-600 dark:hover:text-sky-400',
                        ]"
                        @click="irPara(secao.id)"
                    >
                        {{ t[secao.id] }}
                    </button>
                    <Popover class="relative" v-slot="{ close }">
                        <PopoverButton class="flex items-center gap-x-1 text-sm/6 font-semibold text-gray-900 dark:text-white">
                            {{ t.ferramentas }}
                            <ChevronDownIcon class="size-5 flex-none text-gray-400 dark:text-gray-500" aria-hidden="true" />
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
                                class="absolute left-1/2 z-10 mt-3 w-screen max-w-md -translate-x-1/2 overflow-hidden rounded-3xl bg-white shadow-lg outline-1 outline-gray-900/5 dark:bg-gray-800 dark:shadow-none dark:-outline-offset-1 dark:outline-white/10"
                            >
                                <div class="p-4">
                                    <div
                                        v-for="item in projetos"
                                        :key="item.to"
                                        class="group relative flex items-center gap-x-6 rounded-lg p-4 text-sm/6 hover:bg-gray-50 dark:hover:bg-white/5"
                                    >
                                        <div
                                            class="flex size-11 flex-none items-center justify-center rounded-lg bg-gray-50 group-hover:bg-white dark:bg-gray-700/50 dark:group-hover:bg-gray-700"
                                        >
                                            <component
                                                :is="item.icon"
                                                class="size-6 text-gray-600 group-hover:text-indigo-600 dark:text-gray-400 dark:group-hover:text-white"
                                                aria-hidden="true"
                                            />
                                        </div>
                                        <div class="flex-auto">
                                            <RouterLink
                                                :to="item.to"
                                                class="block font-semibold text-gray-900 dark:text-white"
                                                @click="close()"
                                            >
                                                {{ item.name }}
                                                <span class="absolute inset-0" />
                                            </RouterLink>
                                            <p class="mt-1 text-gray-600 dark:text-gray-400">{{ item.description }}</p>
                                        </div>
                                    </div>
                                </div>
                            </PopoverPanel>
                        </transition>
                    </Popover>
                </PopoverGroup>
                <div class="hidden lg:flex lg:flex-1 lg:justify-end">
                    <LanguageSwitcher class="mr-4" />
                    <ThemeSwitcher class="mr-4" />
                </div>
            </nav>
            <Dialog class="lg:hidden" @close="mobileMenuOpen = false" :open="mobileMenuOpen">
                <div class="fixed inset-0 z-50" />
                <DialogPanel
                    class="fixed inset-y-0 right-0 z-50 w-full overflow-y-auto bg-white p-6 sm:max-w-sm sm:ring-1 sm:ring-gray-900/10 dark:bg-gray-900 dark:sm:ring-gray-100/10"
                >
                    <div class="flex items-center justify-between">
                        <RouterLink to="/" class="-m-1.5 p-1.5" @click="mobileMenuOpen = false">
                            <span class="sr-only">{{ t.logo }}</span>
                            <img class="h-8 w-auto" :src="logo" alt="" />
                        </RouterLink>
                        <button
                            type="button"
                            class="-m-2.5 rounded-md p-2.5 text-gray-700 dark:text-gray-400"
                            @click="mobileMenuOpen = false"
                        >
                            <span class="sr-only">{{ t.fecharMenu }}</span>
                            <XMarkIcon class="size-6" aria-hidden="true" />
                        </button>
                    </div>
                    <div class="mt-6 flow-root">
                        <div class="-my-6 divide-y divide-gray-500/10 dark:divide-white/10">
                            <div class="space-y-2 py-6">
                                <button
                                    v-for="secao in secoes"
                                    :key="secao.id"
                                    type="button"
                                    :aria-current="secaoAtiva === secao.id ? 'location' : undefined"
                                    :class="[
                                        secaoAtiva === secao.id ? 'text-sky-600 dark:text-sky-400' : 'text-gray-900 dark:text-white',
                                        '-mx-3 block w-[calc(100%+1.5rem)] rounded-lg px-3 py-2 text-left text-base/7 font-semibold hover:bg-gray-50 dark:hover:bg-white/5',
                                    ]"
                                    @click="irPara(secao.id)"
                                >
                                    {{ t[secao.id] }}
                                </button>
                                <Disclosure as="div" class="-mx-3" v-slot="{ open }">
                                    <DisclosureButton
                                        class="flex w-full items-center justify-between rounded-lg py-2 pr-3.5 pl-3 text-base/7 font-semibold text-gray-900 hover:bg-gray-50 dark:text-white dark:hover:bg-white/5"
                                    >
                                        {{ t.ferramentas }}
                                        <ChevronDownIcon :class="[open ? 'rotate-180' : '', 'size-5 flex-none']" aria-hidden="true" />
                                    </DisclosureButton>
                                    <DisclosurePanel class="mt-2 space-y-2">
                                        <RouterLink
                                            v-for="item in projetos"
                                            :key="item.to"
                                            :to="item.to"
                                            @click="mobileMenuOpen = false"
                                            class="block rounded-lg py-2 pr-3 pl-6 text-sm/7 font-semibold text-gray-900 hover:bg-gray-50 dark:text-white dark:hover:bg-white/5"
                                        >
                                            {{ item.name }}
                                        </RouterLink>
                                    </DisclosurePanel>
                                </Disclosure>
                            </div>
                            <div class="py-6 flex items-center gap-3">
                                <ThemeSwitcher />
                                <span class="text-sm text-gray-700 dark:text-gray-300">{{ t.alternarTema }}</span>
                            </div>
                        </div>
                    </div>
                </DialogPanel>
            </Dialog>
        </div>
    </header>
</template>
