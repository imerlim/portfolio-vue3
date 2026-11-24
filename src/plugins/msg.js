import { ui } from '@/data/ui';
import { porIdioma } from '@/composables/useIdioma';

// Toast global: dispara um CustomEvent ouvido por GlobalMsg.vue
const show = (title, body, type = 'success') => {
    window.dispatchEvent(new CustomEvent('global-msg', { detail: { title, body, type } }));
};

export const msg = {
    show,
    success: (body, title) => show(title ?? porIdioma(ui).msg.sucesso, body, 'success'),
    error: (body, title) => show(title ?? porIdioma(ui).msg.erro, body, 'error'),
    warning: (body, title) => show(title ?? porIdioma(ui).msg.aviso, body, 'warning'),
    info: (body, title) => show(title ?? porIdioma(ui).msg.info, body, 'info'),
};

export default {
    install: app => {
        app.config.globalProperties.$msg = msg;
    },
};
