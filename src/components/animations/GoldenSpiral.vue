<script setup>
import { onMounted, onUnmounted, ref, watch } from 'vue';
import {
    Color,
    Mesh,
    NormalBlending,
    PerspectiveCamera,
    PlaneGeometry,
    Scene,
    ShaderMaterial,
    WebGLRenderer,
} from 'three';
import { useTheme } from '@/composables/useTheme';

const terrainContainer = ref(null);
const { isDark } = useTheme();

const CAMERA_BASE = { x: 0, y: 3.3, z: 10.5 };
const LOOK_BASE = { x: 0, y: 2.35, z: -10.0 };

const TEMA_CONFIG = {
    dark: {
        colorLow: '#0ea5e9',
        colorHigh: '#38bdf8',
        baseOpacity: 0.18,
        peakOpacity: 0.30,
        fogDensity: 0.042,
    },
    light: {
        colorLow: '#0284c7',
        colorHigh: '#0ea5e9',
        baseOpacity: 0.18,
        peakOpacity: 0.28,
        fogDensity: 0.044,
    },
};

const VERTEX_SHADER = /* glsl */ `
uniform float uTime;

varying vec2 vUv;
varying float vElevation;
varying float vFogDepth;

vec3 mod289(vec3 x) {
    return x - floor(x * (1.0 / 289.0)) * 289.0;
}

vec2 mod289(vec2 x) {
    return x - floor(x * (1.0 / 289.0)) * 289.0;
}

vec3 permute(vec3 x) {
    return mod289(((x * 34.0) + 1.0) * x);
}

float snoise(vec2 v) {
    const vec4 C = vec4(
        0.211324865405187,
        0.366025403784439,
        -0.577350269189626,
        0.024390243902439
    );
    vec2 i = floor(v + dot(v, C.yy));
    vec2 x0 = v - i + dot(i, C.xx);

    vec2 i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
    vec4 x12 = x0.xyxy + C.xxzz;
    x12.xy -= i1;

    i = mod289(i);
    vec3 p = permute(
        permute(i.y + vec3(0.0, i1.y, 1.0))
        + i.x + vec3(0.0, i1.x, 1.0)
    );

    vec3 m = max(
        0.5 - vec3(dot(x0, x0), dot(x12.xy, x12.xy), dot(x12.zw, x12.zw)),
        0.0
    );
    m = m * m;
    m = m * m;

    vec3 x = 2.0 * fract(p * C.www) - 1.0;
    vec3 h = abs(x) - 0.5;
    vec3 ox = floor(x + 0.5);
    vec3 a0 = x - ox;

    m *= 1.79284291400159 - 0.85373472095314 * (a0 * a0 + h * h);

    vec3 g;
    g.x = a0.x * x0.x + h.x * x0.y;
    g.yz = a0.yz * x12.xz + h.yz * x12.yw;
    return 130.0 * dot(m, g);
}

void main() {
    vec3 pos = position;

    float n1 = snoise(pos.xz * 0.075 + vec2(uTime * 0.055, -uTime * 0.04));
    float n2 = snoise(pos.xz * 0.16 - vec2(uTime * 0.04, uTime * 0.065)) * 0.45;
    float swell = sin(pos.x * 0.14 + uTime * 0.28) * cos(pos.z * 0.12 - uTime * 0.2) * 0.32;

    float horizonCalm = smoothstep(1.0, 0.78, uv.y);
    float elevation = (n1 + n2 + swell) * 1.15 * horizonCalm;
    pos.y += elevation;

    vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
    vUv = uv;
    vElevation = elevation;
    vFogDepth = -mvPosition.z;

    gl_Position = projectionMatrix * mvPosition;
}
`;

const FRAGMENT_SHADER = /* glsl */ `
uniform vec3 uColorLow;
uniform vec3 uColorHigh;
uniform float uBaseOpacity;
uniform float uPeakOpacity;
uniform float uFogDensity;

varying vec2 vUv;
varying float vElevation;
varying float vFogDepth;

void main() {
    float crest = clamp((vElevation + 1.4) / 2.8, 0.0, 1.0);
    vec3 color = mix(uColorLow, uColorHigh, smoothstep(0.15, 0.9, crest));
    float baseAlpha = mix(uBaseOpacity, uPeakOpacity, smoothstep(0.2, 0.95, crest));

    float fogFactor = exp(-uFogDensity * uFogDensity * vFogDepth * vFogDepth);
    float horizonFade = smoothstep(1.0, 0.62, vUv.y);
    float nearFade = smoothstep(0.0, 0.10, vUv.y);
    float sideFade = smoothstep(0.0, 0.16, vUv.x) * smoothstep(1.0, 0.84, vUv.x);

    float finalAlpha = baseAlpha * fogFactor * horizonFade * nearFade * sideFade;
    if (finalAlpha < 0.002) discard;

    gl_FragColor = vec4(color, finalAlpha);
}
`;

let scene = null;
let camera = null;
let renderer = null;
let geometry = null;
let material = null;
let terrain = null;

let animationFrame = null;
let resizeObserver = null;
let intersectionObserver = null;
let stopThemeWatch = null;

let isIntersecting = true;
let isTabVisible = true;
let reduceMotion = false;
let lastFrameTime = 0;

let targetMouseX = 0;
let targetMouseY = 0;
let currentMouseX = 0;
let currentMouseY = 0;

const aplicarTema = dark => {
    if (!material || !renderer || !scene || !camera) return;
    const cfg = dark ? TEMA_CONFIG.dark : TEMA_CONFIG.light;

    material.uniforms.uColorLow.value.set(cfg.colorLow);
    material.uniforms.uColorHigh.value.set(cfg.colorHigh);
    material.uniforms.uBaseOpacity.value = cfg.baseOpacity;
    material.uniforms.uPeakOpacity.value = cfg.peakOpacity;
    material.uniforms.uFogDensity.value = cfg.fogDensity;

    renderer.render(scene, camera);
};

const renderFrame = delta => {
    if (!renderer || !scene || !camera || !material || !terrain) return;

    material.uniforms.uTime.value += delta;

    const damp = 1 - Math.exp(-delta * 4.5);
    currentMouseX += (targetMouseX - currentMouseX) * damp;
    currentMouseY += (targetMouseY - currentMouseY) * damp;

    camera.position.x = CAMERA_BASE.x + currentMouseX * 1.4;
    camera.position.y = CAMERA_BASE.y + currentMouseY * 0.45;
    camera.lookAt(
        LOOK_BASE.x + currentMouseX * 0.4,
        LOOK_BASE.y + currentMouseY * 0.18,
        LOOK_BASE.z
    );

    terrain.rotation.z = -currentMouseX * 0.035;
    terrain.rotation.x = currentMouseY * 0.025;

    renderer.render(scene, camera);
};

const loop = now => {
    if (reduceMotion || !isIntersecting || !isTabVisible) {
        animationFrame = null;
        return;
    }

    const delta = lastFrameTime ? Math.min((now - lastFrameTime) * 0.001, 0.1) : 0.016;
    lastFrameTime = now;

    renderFrame(delta);
    animationFrame = requestAnimationFrame(loop);
};

const atualizarEstadoAnimacao = () => {
    if (reduceMotion) return;
    if (isIntersecting && isTabVisible) {
        if (!animationFrame) {
            lastFrameTime = performance.now();
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

const onPointerMove = event => {
    const w = window.innerWidth || 1;
    const h = window.innerHeight || 1;
    targetMouseX = (event.clientX / w) * 2 - 1;
    targetMouseY = -((event.clientY / h) * 2 - 1);
};

const onPointerLeave = () => {
    targetMouseX = 0;
    targetMouseY = 0;
};

onMounted(() => {
    const container = terrainContainer.value;
    if (!container) return;

    reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    isTabVisible = !document.hidden;

    const width = container.clientWidth || window.innerWidth;
    const height = container.clientHeight || window.innerHeight;

    try {
        renderer = new WebGLRenderer({
            antialias: true,
            alpha: true,
            powerPreference: 'high-performance',
        });
    } catch {
        renderer = null;
        return;
    }

    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.setSize(width, height);
    renderer.setClearColor(0x000000, 0);
    container.appendChild(renderer.domElement);

    scene = new Scene();
    camera = new PerspectiveCamera(50, width / height, 0.1, 120);
    camera.position.set(CAMERA_BASE.x, CAMERA_BASE.y, CAMERA_BASE.z);
    camera.lookAt(LOOK_BASE.x, LOOK_BASE.y, LOOK_BASE.z);
    scene.add(camera);

    geometry = new PlaneGeometry(54, 30, 90, 90);
    geometry.rotateX(-Math.PI / 2);

    material = new ShaderMaterial({
        vertexShader: VERTEX_SHADER,
        fragmentShader: FRAGMENT_SHADER,
        wireframe: true,
        transparent: true,
        depthWrite: false,
        blending: NormalBlending,
        uniforms: {
            uTime: { value: 1.5 },
            uColorLow: { value: new Color(TEMA_CONFIG.dark.colorLow) },
            uColorHigh: { value: new Color(TEMA_CONFIG.dark.colorHigh) },
            uBaseOpacity: { value: TEMA_CONFIG.dark.baseOpacity },
            uPeakOpacity: { value: TEMA_CONFIG.dark.peakOpacity },
            uFogDensity: { value: TEMA_CONFIG.dark.fogDensity },
        },
    });

    terrain = new Mesh(geometry, material);
    terrain.position.set(0, 0, -7);
    scene.add(terrain);

    aplicarTema(isDark.value);

    stopThemeWatch = watch(isDark, dark => {
        aplicarTema(dark);
    });

    resizeObserver = new ResizeObserver(entries => {
        const entry = entries[0];
        if (!entry || !renderer || !camera || !scene) return;
        const w = entry.contentRect.width;
        const h = entry.contentRect.height;
        if (w <= 0 || h <= 0) return;

        camera.aspect = w / h;
        camera.updateProjectionMatrix();
        renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
        renderer.setSize(w, h);
        renderer.render(scene, camera);
    });
    resizeObserver.observe(container);

    if (!reduceMotion) {
        window.addEventListener('pointermove', onPointerMove, { passive: true });
        document.documentElement.addEventListener('pointerleave', onPointerLeave, { passive: true });

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

onUnmounted(() => {
    if (animationFrame) cancelAnimationFrame(animationFrame);
    animationFrame = null;

    stopThemeWatch?.();
    resizeObserver?.disconnect();
    intersectionObserver?.disconnect();
    document.removeEventListener('visibilitychange', onVisibilityChange);
    window.removeEventListener('pointermove', onPointerMove);
    document.documentElement.removeEventListener('pointerleave', onPointerLeave);

    if (scene && terrain) {
        scene.remove(terrain);
    }
    geometry?.dispose();
    material?.dispose();
    renderer?.dispose();
    renderer?.domElement?.remove();

    scene = null;
    camera = null;
    renderer = null;
    geometry = null;
    material = null;
    terrain = null;
});
</script>

<template>
    <div
        ref="terrainContainer"
        class="pointer-events-none absolute inset-0 h-full w-full overflow-hidden"
        aria-hidden="true"
    />
</template>
