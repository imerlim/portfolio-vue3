import { nextTick } from 'vue';
import { useRoute, useRouter } from 'vue-router';

export function useScrollToSection() {
    const route = useRoute();
    const router = useRouter();

    const irPara = async (id, onBefore) => {
        onBefore?.();

        if (route.name !== 'home') {
            await router.push({ name: 'home' });
            await nextTick();
            await new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve)));
        }

        const reduzir =
            typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        document.getElementById(id)?.scrollIntoView({
            behavior: reduzir ? 'auto' : 'smooth',
            block: 'start',
        });
    };

    return { irPara };
}
