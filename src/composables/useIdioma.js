import { computed, ref, watch } from 'vue';

// Idioma global da aplicação (PT / EN), persistido no localStorage.
// Uso: const { idioma, isEn, alternarIdioma, porIdioma } = useIdioma();
// Ex. (futuro botão de CV): porIdioma({ pt: 'CV_pt.pdf', en: 'CV_en.pdf' })

export const IDIOMAS = ['pt', 'en'];
const CHAVE = 'idioma';

const lerSalvo = () => {
    try {
        const v = localStorage.getItem(CHAVE);
        if (IDIOMAS.includes(v)) return v;
    } catch (e) {
        /* armazenamento indisponível */
    }
    return 'pt';
};

// Estado único (módulo), compartilhado por todos os componentes
export const idioma = ref(lerSalvo());

const aplicar = v => {
    document.documentElement.lang = v === 'en' ? 'en' : 'pt-BR';
    try {
        localStorage.setItem(CHAVE, v);
    } catch (e) {
        /* armazenamento indisponível */
    }
};
watch(idioma, aplicar, { immediate: true });

const isEn = computed(() => idioma.value === 'en');

export const setIdioma = v => {
    if (IDIOMAS.includes(v)) idioma.value = v;
};

export const alternarIdioma = () => setIdioma(isEn.value ? 'pt' : 'en');

/** Retorna o valor correspondente ao idioma ativo: porIdioma({ pt, en }) */
export const porIdioma = mapa => mapa[idioma.value] ?? mapa.pt;

export function useIdioma() {
    return { idioma, isEn, setIdioma, alternarIdioma, porIdioma };
}
