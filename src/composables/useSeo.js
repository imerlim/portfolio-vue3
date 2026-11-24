import { idioma } from '@/composables/useIdioma';

export const SEO_POR_ROTA = {
    home: {
        pt: {
            title: 'Igor Merlim — Desenvolvedor Full-Stack Laravel, Vue & ERP/SaaS',
            description:
                'Igor Merlim, Desenvolvedor Full-Stack no Rio de Janeiro (+6 anos). Laravel, Vue.js, Node.js, sistemas ERP/SaaS, integrações de marketplaces e ferramentas.',
        },
        en: {
            title: 'Igor Merlim — Full-Stack Developer Laravel, Vue & ERP/SaaS',
            description:
                'Igor Merlim, Full-Stack Developer based in Rio de Janeiro (+6 years). Laravel, Vue.js, Node.js, ERP/SaaS systems, marketplace integrations and tools.',
        },
    },
    'calculadora.margem': {
        pt: {
            title: 'Calculadora de Margem de Lucro — Igor Merlim',
            description:
                'Calcule o preço de venda a partir do custo, com margem sobre a venda ou sobre o custo.',
        },
        en: {
            title: 'Profit Margin Calculator — Igor Merlim',
            description:
                'Calculate selling price from cost, using margin on revenue or markup on cost.',
        },
    },
    'calculadora.juros.compostos': {
        pt: {
            title: 'Calculadora de Juros Compostos — Igor Merlim',
            description:
                'Simule a projeção do patrimônio com capital inicial, aportes mensais, taxa de juros e prazo.',
        },
        en: {
            title: 'Compound Interest Calculator — Igor Merlim',
            description:
                'Simulate wealth growth with initial capital, monthly contributions, interest rate and term.',
        },
    },
};

function atualizarMeta(seletor, conteudo) {
    const el = document.querySelector(seletor);
    if (el) el.setAttribute('content', conteudo);
}

export function aplicarSeo(routeName) {
    const lang = idioma.value === 'en' ? 'en' : 'pt';
    const entrada = SEO_POR_ROTA[routeName] ?? SEO_POR_ROTA.home;
    const seo = entrada[lang] ?? entrada.pt;

    document.title = seo.title;
    atualizarMeta('meta[name="description"]', seo.description);
    atualizarMeta('meta[property="og:title"]', seo.title);
    atualizarMeta('meta[property="og:description"]', seo.description);
    atualizarMeta('meta[property="og:locale"]', lang === 'en' ? 'en_US' : 'pt_BR');
    atualizarMeta('meta[name="twitter:title"]', seo.title);
    atualizarMeta('meta[name="twitter:description"]', seo.description);
}
