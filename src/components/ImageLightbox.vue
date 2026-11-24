<script setup>
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue';
import { Dialog, DialogPanel } from '@headlessui/vue';
import {
    ArrowsPointingInIcon,
    MagnifyingGlassMinusIcon,
    MagnifyingGlassPlusIcon,
    PhotoIcon,
    XMarkIcon,
} from '@heroicons/vue/24/outline';
import { ui } from '@/data/ui';
import { useIdioma } from '@/composables/useIdioma';

const props = defineProps({
    item: { type: Object, default: null },
});

const emit = defineEmits(['close']);

const { porIdioma } = useIdioma();
const homeUi = computed(() => porIdioma(ui).home);
const lb = computed(() => homeUi.value.lb);

const ZOOM_MIN = 1;
const ZOOM_MAX = 4;
const ZOOM_STEP = 0.5;

const zoom = ref(1);
const pan = ref({ x: 0, y: 0 });
const arrastando = ref(false);
const imgError = ref(false);

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

watch(
    () => props.item,
    novo => {
        resetZoom();
        arrastando.value = false;
        arrasto = null;
        ignorarClique = false;
        imgError.value = !novo?.src;
    }
);

const fechar = () => {
    arrastando.value = false;
    arrasto = null;
    emit('close');
};

const onBackdropClick = () => {
    if (ignorarClique) {
        ignorarClique = false;
        return;
    }
    fechar();
};

const onWheel = e => setZoom(zoom.value + (e.deltaY < 0 ? 0.25 : -0.25));

const onPointerDown = e => {
    if (zoom.value <= 1 || imgError.value) return;
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
    setTimeout(() => {
        ignorarClique = false;
    }, 0);
    arrasto = null;
    arrastando.value = false;
};

const onKeydown = e => {
    if (!props.item) return;
    if (e.key === '+' || e.key === '=') setZoom(zoom.value + ZOOM_STEP);
    else if (e.key === '-') setZoom(zoom.value - ZOOM_STEP);
    else if (e.key === '0') resetZoom();
};

onMounted(() => window.addEventListener('keydown', onKeydown));
onBeforeUnmount(() => window.removeEventListener('keydown', onKeydown));
</script>

<template>
    <Dialog :open="!!item" @close="fechar" class="relative z-[100]" :aria-label="item?.alt || lb.fechar">
        <div class="fixed inset-0 bg-slate-950/90 backdrop-blur-sm" aria-hidden="true" />

        <DialogPanel
            class="fixed inset-0 flex items-center justify-center overflow-hidden"
            @click.self="onBackdropClick"
            @wheel.prevent="onWheel"
        >
            <template v-if="item">
                <div
                    v-if="imgError"
                    class="flex flex-col items-center justify-center gap-3 rounded-xl border border-white/10 bg-slate-900/90 px-8 py-10 text-slate-300 shadow-2xl"
                >
                    <PhotoIcon class="size-12 text-slate-500" aria-hidden="true" />
                    <span class="text-sm font-medium">{{ homeUi.imagemIndisponivel }}</span>
                </div>

                <img
                    v-else
                    :src="item.src"
                    :alt="item.alt"
                    draggable="false"
                    @error="imgError = true"
                    class="max-h-[90vh] max-w-[95vw] touch-none select-none rounded-lg object-contain shadow-2xl"
                    :class="[
                        zoom > 1 ? (arrastando ? 'cursor-grabbing' : 'cursor-grab') : 'cursor-zoom-in',
                        arrastando ? '' : 'transition-transform duration-150',
                    ]"
                    :style="{ transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})` }"
                    @dblclick="zoom > 1 ? resetZoom() : setZoom(2)"
                    @pointerdown="onPointerDown"
                    @pointermove="onPointerMove"
                    @pointerup="onPointerUp"
                    @pointercancel="onPointerUp"
                />

                <p
                    v-if="item.titulo"
                    class="pointer-events-none absolute left-4 right-20 top-5 truncate text-lg font-semibold text-white drop-shadow"
                >
                    {{ item.titulo }}
                </p>

                <div
                    class="absolute bottom-6 left-1/2 flex -translate-x-1/2 items-center gap-1 rounded-full bg-slate-900/80 p-1 text-white shadow-lg ring-1 ring-white/10"
                >
                    <button
                        type="button"
                        class="lb-btn"
                        :aria-label="lb.menos"
                        :disabled="zoom <= ZOOM_MIN"
                        @click="setZoom(zoom - ZOOM_STEP)"
                    >
                        <MagnifyingGlassMinusIcon class="size-5" aria-hidden="true" />
                    </button>
                    <span class="w-14 text-center font-mono text-sm tabular-nums" aria-live="polite">
                        {{ Math.round(zoom * 100) }}%
                    </span>
                    <button
                        type="button"
                        class="lb-btn"
                        :aria-label="lb.mais"
                        :disabled="zoom >= ZOOM_MAX"
                        @click="setZoom(zoom + ZOOM_STEP)"
                    >
                        <MagnifyingGlassPlusIcon class="size-5" aria-hidden="true" />
                    </button>
                    <button
                        type="button"
                        class="lb-btn"
                        :aria-label="lb.reset"
                        :disabled="zoom === 1"
                        @click="resetZoom"
                    >
                        <ArrowsPointingInIcon class="size-5" aria-hidden="true" />
                    </button>
                </div>

                <button
                    type="button"
                    class="lb-btn absolute right-4 top-4 bg-slate-900/80 ring-1 ring-white/10"
                    :aria-label="lb.fechar"
                    @click="fechar"
                >
                    <XMarkIcon class="size-6 text-white" aria-hidden="true" />
                </button>
            </template>
        </DialogPanel>
    </Dialog>
</template>

<style scoped>
.lb-btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 2.25rem;
    height: 2.25rem;
    border-radius: 9999px;
    color: #ffffff;
    transition: background-color 150ms ease, opacity 150ms ease;
}

.lb-btn:hover:not(:disabled) {
    background-color: rgba(255, 255, 255, 0.14);
}

.lb-btn:focus-visible {
    outline: 2px solid var(--accent);
    outline-offset: 2px;
}

.lb-btn:disabled {
    opacity: 0.35;
    cursor: not-allowed;
}
</style>
