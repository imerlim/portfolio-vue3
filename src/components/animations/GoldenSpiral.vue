<script setup>
import { onBeforeUnmount, onMounted, ref, watch } from 'vue';
import {
    AdditiveBlending,
    BufferAttribute,
    BufferGeometry,
    Clock,
    Color,
    NormalBlending,
    PerspectiveCamera,
    Points,
    PointsMaterial,
    Scene,
    WebGLRenderer,
} from 'three';
import { useTheme } from '@/composables/useTheme';

const spiralContainer = ref(null);
const { isDark } = useTheme();

const TOTAL_POINTS = 3000;
const PHI = 1.61803398875;
const RADIUS = 5;

let scene = null;
let camera = null;
let renderer = null;
let geometry = null;
let material = null;
let spiral = null;
let clock = null;
let animationFrame = null;
let resizeObserver = null;
let intersectionObserver = null;
let stopThemeWatch = null;

let isIntersecting = true;
let isTabVisible = true;
let reduceMotion = false;

const TEMA_CORES = {
    dark: {
        bg: '#070d19',
        stops: ['#0077b6', '#38bdf8', '#bae6fd'],
        blending: AdditiveBlending,
        opacity: 0.9,
    },
    light: {
        bg: '#f4f9fd',
        stops: ['#0077b6', '#0284c7', '#38bdf8'],
        blending: NormalBlending,
        opacity: 0.45,
    },
};

const preencherCoresGradiente = (colorsArray, stops) => {
    const c0 = new Color(stops[0]);
    const c1 = new Color(stops[1]);
    const c2 = new Color(stops[2]);
    const temp = new Color();

    for (let i = 0; i < TOTAL_POINTS; i++) {
        const t = i / (TOTAL_POINTS - 1);
        if (t < 0.5) {
            temp.copy(c0).lerp(c1, t * 2);
        } else {
            temp.copy(c1).lerp(c2, (t - 0.5) * 2);
        }
        const i3 = i * 3;
        colorsArray[i3] = temp.r;
        colorsArray[i3 + 1] = temp.g;
        colorsArray[i3 + 2] = temp.b;
    }
};

const aplicarTema = dark => {
    if (!scene || !geometry || !material || !renderer || !camera) return;
    const cfg = dark ? TEMA_CORES.dark : TEMA_CORES.light;

    scene.background = new Color(cfg.bg);
    const colorAttr = geometry.attributes.color;
    preencherCoresGradiente(colorAttr.array, cfg.stops);
    colorAttr.needsUpdate = true;

    material.blending = cfg.blending;
    material.opacity = cfg.opacity;
    material.needsUpdate = true;

    renderer.render(scene, camera);
};

const renderFrame = () => {
    if (!renderer || !scene || !camera || !spiral || !clock) return;
    const t = clock.getElapsedTime();
    spiral.rotation.z = t * 0.2;
    spiral.rotation.x = Math.sin(t * 0.3) * 0.3;
    spiral.rotation.y = Math.cos(t * 0.2) * 0.3;
    renderer.render(scene, camera);
};

const loop = () => {
    if (reduceMotion || !isIntersecting || !isTabVisible) {
        animationFrame = null;
        return;
    }
    renderFrame();
    animationFrame = requestAnimationFrame(loop);
};

const atualizarEstadoAnimacao = () => {
    if (reduceMotion) return;
    if (isIntersecting && isTabVisible) {
        if (!animationFrame) {
            clock?.start();
            animationFrame = requestAnimationFrame(loop);
        }
    } else if (animationFrame) {
        cancelAnimationFrame(animationFrame);
        animationFrame = null;
    }
};

const onVisibilityChange = () => {
    isTabVisible = !document.hidden;
    atualizarEstadoAnimacao();
};

onMounted(() => {
    const container = spiralContainer.value;
    if (!container) return;

    reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    isTabVisible = !document.hidden;

    const width = container.clientWidth || window.innerWidth;
    const height = container.clientHeight || window.innerHeight;

    try {
        renderer = new WebGLRenderer({ antialias: true, powerPreference: 'high-performance' });
    } catch {
        renderer = null;
        return;
    }

    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    scene = new Scene();
    camera = new PerspectiveCamera(75, width / height, 0.1, 100);
    camera.position.z = 8;
    scene.add(camera);

    const goldenAngle = 2 * Math.PI * (1 - 1 / PHI);
    geometry = new BufferGeometry();
    const positions = new Float32Array(TOTAL_POINTS * 3);
    const colors = new Float32Array(TOTAL_POINTS * 3);

    for (let i = 0; i < TOTAL_POINTS; i++) {
        const angle = i * goldenAngle;
        const r = RADIUS * Math.pow(i / TOTAL_POINTS, 1 / PHI);
        const i3 = i * 3;

        positions[i3] = r * Math.cos(angle);
        positions[i3 + 1] = r * Math.sin(angle);
        positions[i3 + 2] = Math.sin(i * 0.03) * 0.2;
    }

    geometry.setAttribute('position', new BufferAttribute(positions, 3));
    geometry.setAttribute('color', new BufferAttribute(colors, 3));

    material = new PointsMaterial({
        size: 0.04,
        sizeAttenuation: true,
        vertexColors: true,
        transparent: true,
    });

    spiral = new Points(geometry, material);
    scene.add(spiral);

    clock = new Clock();
    aplicarTema(isDark.value);

    stopThemeWatch = watch(isDark, dark => {
        aplicarTema(dark);
    });

    resizeObserver = new ResizeObserver(entries => {
        const entry = entries[0];
        if (!entry || !renderer || !camera) return;
        const w = entry.contentRect.width;
        const h = entry.contentRect.height;
        if (w <= 0 || h <= 0) return;

        camera.aspect = w / h;
        camera.updateProjectionMatrix();
        renderer.setSize(w, h);
        renderer.render(scene, camera);
    });
    resizeObserver.observe(container);

    if (!reduceMotion) {
        intersectionObserver = new IntersectionObserver(
            entries => {
                isIntersecting = entries[0]?.isIntersecting ?? true;
                atualizarEstadoAnimacao();
            },
            { threshold: 0.05 }
        );
        intersectionObserver.observe(container);
        document.addEventListener('visibilitychange', onVisibilityChange);
        atualizarEstadoAnimacao();
    }
});

onBeforeUnmount(() => {
    if (animationFrame) cancelAnimationFrame(animationFrame);
    animationFrame = null;

    stopThemeWatch?.();
    resizeObserver?.disconnect();
    intersectionObserver?.disconnect();
    document.removeEventListener('visibilitychange', onVisibilityChange);

    geometry?.dispose();
    material?.dispose();
    renderer?.dispose();
    renderer?.domElement?.remove();

    scene = null;
    camera = null;
    renderer = null;
    geometry = null;
    material = null;
    spiral = null;
    clock = null;
});
</script>

<template>
    <div ref="spiralContainer" class="pointer-events-none absolute inset-0 h-full w-full overflow-hidden" aria-hidden="true" />
</template>
