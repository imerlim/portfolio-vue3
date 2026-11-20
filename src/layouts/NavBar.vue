<script setup>
import { ref } from 'vue';
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
import logo from '@/assets/logo.png';

const mobileMenuOpen = ref(false);

const projetos = [
    {
        name: 'Calculadora de Margem de Lucro',
        description: 'Calcula a margem de lucro de produtos',
        to: '/calculadora-margem',
        icon: CalculatorIcon,
    },
    {
        name: 'Calculadora de Juros Compostos',
        description: 'Planeje sua aposentadoria com investimentos',
        to: '/calculadora-juros-compostos',
        icon: PresentationChartLineIcon,
    },
];
</script>

<template>
    <header class="bg-white dark:bg-slate-950 fixed top-0 z-50 w-full p-2">
        <GlobalMsg />
        <div class="container mx-auto sm:px-16">
            <nav class="mx-auto flex items-center justify-between py-2 sm:py-5" aria-label="Navegação principal">
                <div class="flex lg:flex-1 sm:ml-5">
                    <RouterLink to="/" class="-m-1.5 p-1.5">
                        <span class="sr-only">Igor Merlim — Início</span>
                        <img class="h-8 w-auto" :src="logo" alt="" />
                    </RouterLink>
                </div>
                <div class="flex lg:hidden">
                    <button
                        type="button"
                        class="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-700 dark:text-gray-400"
                        @click="mobileMenuOpen = true"
                    >
                        <span class="sr-only">Abrir menu principal</span>
                        <Bars3Icon class="size-6" aria-hidden="true" />
                    </button>
                </div>
                <PopoverGroup class="hidden lg:flex lg:gap-x-12">
                    <Popover class="relative" v-slot="{ close }">
                        <PopoverButton class="flex items-center gap-x-1 text-sm/6 font-semibold text-gray-900 dark:text-white">
                            Projetos
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
                                        :key="item.name"
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
                            <span class="sr-only">Igor Merlim — Início</span>
                            <img class="h-8 w-auto" :src="logo" alt="" />
                        </RouterLink>
                        <button
                            type="button"
                            class="-m-2.5 rounded-md p-2.5 text-gray-700 dark:text-gray-400"
                            @click="mobileMenuOpen = false"
                        >
                            <span class="sr-only">Fechar menu</span>
                            <XMarkIcon class="size-6" aria-hidden="true" />
                        </button>
                    </div>
                    <div class="mt-6 flow-root">
                        <div class="-my-6 divide-y divide-gray-500/10 dark:divide-white/10">
                            <div class="space-y-2 py-6">
                                <Disclosure as="div" class="-mx-3" v-slot="{ open }">
                                    <DisclosureButton
                                        class="flex w-full items-center justify-between rounded-lg py-2 pr-3.5 pl-3 text-base/7 font-semibold text-gray-900 hover:bg-gray-50 dark:text-white dark:hover:bg-white/5"
                                    >
                                        Projetos
                                        <ChevronDownIcon :class="[open ? 'rotate-180' : '', 'size-5 flex-none']" aria-hidden="true" />
                                    </DisclosureButton>
                                    <DisclosurePanel class="mt-2 space-y-2">
                                        <RouterLink
                                            v-for="item in projetos"
                                            :key="item.name"
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
                                <span class="text-sm text-gray-700 dark:text-gray-300">Alternar tema</span>
                            </div>
                        </div>
                    </div>
                </DialogPanel>
            </Dialog>
        </div>
    </header>
</template>
