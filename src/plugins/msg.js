// Toast global: dispara um CustomEvent ouvido por GlobalMsg.vue
const show = (title, body, type = 'success') => {
    window.dispatchEvent(new CustomEvent('global-msg', { detail: { title, body, type } }))
}

export const msg = {
    show,
    success: (body, title = 'Sucesso!') => show(title, body, 'success'),
    error: (body, title = 'Erro!') => show(title, body, 'error'),
    warning: (body, title = 'Atenção!') => show(title, body, 'warning'),
    info: (body, title = 'Informação') => show(title, body, 'info'),
}

export default {
    install: app => {
        app.config.globalProperties.$msg = msg
    },
}
