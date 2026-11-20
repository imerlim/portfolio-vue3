<script setup>
import { onMounted, onBeforeUnmount, ref } from 'vue';
import * as THREE from 'three';

const spiralContainer = ref(null);

let renderer, geometry, material, animationFrame, handleResize;

onMounted(() => {
    const sizes = { width: window.innerWidth, height: window.innerHeight };

    // Cena
    const scene = new THREE.Scene();
    scene.background = new THREE.Color('#000010');

    // Câmera
    const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100);
    camera.position.z = 8;
    scene.add(camera);

    // Renderizador
    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(sizes.width, sizes.height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    spiralContainer.value?.appendChild(renderer.domElement);

    // ---------- PROPORÇÃO ÁUREA ----------
    const phi = 1.61803398875;
    const totalPoints = 3000;
    const radius = 5;
    const goldenAngle = 2 * Math.PI * (1 - 1 / phi);

    geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(totalPoints * 3);
    const colors = new Float32Array(totalPoints * 3);

    const colorInside = new THREE.Color('#ff0000');
    const colorOutside = new THREE.Color('#00ffff');

    for (let i = 0; i < totalPoints; i++) {
        const angle = i * goldenAngle;
        const r = radius * Math.pow(i / totalPoints, 1 / phi);
        const i3 = i * 3;

        positions[i3] = r * Math.cos(angle);
        positions[i3 + 1] = r * Math.sin(angle);
        positions[i3 + 2] = Math.sin(i * 0.03) * 0.2; // leve ondulação

        const mixedColor = colorInside.clone().lerp(colorOutside, i / totalPoints);
        colors[i3] = mixedColor.r;
        colors[i3 + 1] = mixedColor.g;
        colors[i3 + 2] = mixedColor.b;
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    material = new THREE.PointsMaterial({
        size: 0.04,
        sizeAttenuation: true,
        vertexColors: true,
        blending: THREE.AdditiveBlending,
        transparent: true,
    });

    const spiral = new THREE.Points(geometry, material);
    scene.add(spiral);

    // ---------- ANIMAÇÃO ----------
    const clock = new THREE.Clock();
    const animate = () => {
        const t = clock.getElapsedTime();
        spiral.rotation.z = t * 0.2;
        spiral.rotation.x = Math.sin(t * 0.3) * 0.3;
        spiral.rotation.y = Math.cos(t * 0.2) * 0.3;
        renderer.render(scene, camera);
        animationFrame = requestAnimationFrame(animate);
    };
    animate();

    // ---------- RESPONSIVIDADE ----------
    handleResize = () => {
        sizes.width = window.innerWidth;
        sizes.height = document.documentElement.clientHeight;
        camera.aspect = sizes.width / sizes.height;
        camera.updateProjectionMatrix();
        renderer.setSize(sizes.width, sizes.height);
    };
    window.addEventListener('resize', handleResize);
});

// ---------- LIMPEZA ----------
onBeforeUnmount(() => {
    cancelAnimationFrame(animationFrame);
    if (handleResize) window.removeEventListener('resize', handleResize);
    geometry?.dispose();
    material?.dispose();
    renderer?.dispose();
    renderer?.domElement?.remove();
});
</script>

<template>
    <div ref="spiralContainer" class="absolute inset-0 w-full h-full overflow-hidden"></div>
</template>
