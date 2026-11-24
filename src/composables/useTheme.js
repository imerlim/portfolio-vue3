import { ref } from 'vue';

// Estado singleton sincronizado com a classe .dark aplicada inicialmente pelo index.html
const lerTemaInicial = () => {
    if (typeof document === 'undefined') return false;
    return document.documentElement.classList.contains('dark');
};

export const isDark = ref(lerTemaInicial());

export const setTheme = dark => {
    const proximo = Boolean(dark);
    isDark.value = proximo;
    if (typeof document !== 'undefined') {
        document.documentElement.classList.toggle('dark', proximo);
    }
    try {
        localStorage.setItem('theme', proximo ? 'dark' : 'light');
    } catch (e) {
        /* armazenamento indisponível */
    }
};

export const toggleTheme = () => setTheme(!isDark.value);

export function useTheme() {
    return { isDark, setTheme, toggleTheme };
}
