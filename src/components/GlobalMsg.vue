<script setup>
import { computed, onMounted, onUnmounted, ref } from 'vue';
import {
    CheckCircleIcon,
    ExclamationTriangleIcon,
    InformationCircleIcon,
    XCircleIcon,
} from '@heroicons/vue/24/outline';
import { XMarkIcon } from '@heroicons/vue/20/solid';
import { ui } from '@/data/ui';
import { useIdioma } from '@/composables/useIdioma';

const { porIdioma } = useIdioma();
const lbFechar = computed(() => porIdioma(ui).home.lb.fechar);

const visible = ref(false);
const title = ref('');
const body = ref('');
const type = ref('success');
let timeout = null;

const metaPorTipo = {
    success: {
        icon: CheckCircleIcon,
        borderClass: 'border-l-emerald-500',
        iconClass: 'text-emerald-600 dark:text-emerald-400',
    },
    error: {
        icon: XCircleIcon,
        borderClass: 'border-l-red-500',
        iconClass: 'text-red-600 dark:text-red-400',
    },
    warning: {
        icon: ExclamationTriangleIcon,
        borderClass: 'border-l-amber-500',
        iconClass: 'text-amber-600 dark:text-amber-400',
    },
    info: {
        icon: InformationCircleIcon,
        borderClass: 'border-l-sky-500',
        iconClass: 'text-sky-600 dark:text-sky-400',
    },
};

const meta = computed(() => metaPorTipo[type.value] ?? metaPorTipo.info);

const fechar = () => {
    visible.value = false;
    clearTimeout(timeout);
};

const showMsg = event => {
    const { title: t, body: b, type: tp = 'success' } = event.detail;
    title.value = t;
    body.value = b;
    type.value = tp;
    visible.value = true;

    clearTimeout(timeout);
    timeout = setTimeout(() => {
        visible.value = false;
    }, 3500);
};

onMounted(() => window.addEventListener('global-msg', showMsg));
onUnmounted(() => {
    window.removeEventListener('global-msg', showMsg);
    clearTimeout(timeout);
});
</script>

<template>
    <div aria-live="polite" aria-atomic="true" class="pointer-events-none fixed inset-x-0 top-5 z-[9999] flex justify-center px-4">
        <Transition
            enter-active-class="transition duration-200 ease-out"
            enter-from-class="-translate-y-2 opacity-0"
            leave-active-class="transition duration-150 ease-in"
            leave-to-class="-translate-y-2 opacity-0"
        >
            <div
                v-if="visible"
                role="status"
                class="pointer-events-auto flex w-full max-w-md items-start gap-3 rounded-xl border border-[var(--border-strong)] border-l-4 bg-[var(--bg-surface)]/95 p-4 text-sm shadow-xl backdrop-blur-md"
                :class="meta.borderClass"
            >
                <component :is="meta.icon" class="mt-0.5 size-5 shrink-0" :class="meta.iconClass" aria-hidden="true" />
                <div class="min-w-0 flex-1">
                    <strong v-if="title" class="block font-semibold text-[var(--text-primary)]">{{ title }}</strong>
                    <span class="mt-0.5 block text-[var(--text-secondary)]">{{ body }}</span>
                </div>
                <button
                    type="button"
                    @click="fechar"
                    :aria-label="lbFechar"
                    class="inline-flex size-7 shrink-0 items-center justify-center rounded-lg text-[var(--text-muted)] transition-colors hover:bg-[var(--bg-subtle)] hover:text-[var(--text-primary)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]"
                >
                    <XMarkIcon class="size-4" aria-hidden="true" />
                </button>
            </div>
        </Transition>
    </div>
</template>
