import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const prefereMenosMovimento = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/**
 * v-reveal: o elemento entra (fade + subida) quando aparece na viewport, uma única vez.
 *
 * Uso: <div v-reveal> ou <div v-reveal="{ delay: 0.1, y: 32 }">
 * Opções: y (px, padrão 24), delay (s, padrão 0), duration (s, padrão 0.6), start (padrão 'top 85%').
 */
export default {
    mounted(el, { value = {} }) {
        if (prefereMenosMovimento()) return;

        el._revealTween = gsap.from(el, {
            y: value.y ?? 24,
            opacity: 0,
            duration: value.duration ?? 0.6,
            delay: value.delay ?? 0,
            ease: 'power3.out',
            // Remove o transform inline ao terminar (não interfere no 3D do Swiper)
            clearProps: 'transform,opacity',
            scrollTrigger: {
                trigger: el,
                start: value.start ?? 'top 85%',
                once: true,
            },
        });
    },
    unmounted(el) {
        el._revealTween?.scrollTrigger?.kill();
        el._revealTween?.kill();
        delete el._revealTween;
    },
};
