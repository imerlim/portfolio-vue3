import { createRouter, createWebHashHistory } from 'vue-router'

// Hash history: funciona no GitHub Pages sem configuração extra de 404/rewrites.
const routes = [
    {
        path: '/',
        name: 'home',
        component: () => import('@/views/Home.vue'),
        meta: { title: 'Igor Merlim' },
    },
    {
        path: '/calculadora-margem',
        name: 'calculadora.margem',
        component: () => import('@/views/CalculadoraMargem.vue'),
        meta: { title: 'Calculadora de Margem' },
    },
    {
        path: '/calculadora-juros-compostos',
        name: 'calculadora.juros.compostos',
        component: () => import('@/views/CalculadoraJurosCompostos.vue'),
        meta: { title: 'Calculadora de Juros Compostos' },
    },
    { path: '/:pathMatch(.*)*', redirect: '/' },
]

const router = createRouter({
    history: createWebHashHistory(),
    routes,
    scrollBehavior: () => ({ top: 0 }),
})

router.afterEach(to => {
    document.title = to.meta.title ? `${to.meta.title}` : 'Igor Merlim'
})

export default router
