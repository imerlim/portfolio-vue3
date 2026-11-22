// Conteúdo das seções da Home (exceto o carrossel, que está em slides.js).
// Fontes: perfil do LinkedIn (Profile.pdf), currículos CV_pt/CV_en, repositórios públicos de
// github.com/imerlim, slides.js, package.json e Footer.vue.
// Não incluir aqui métricas, cargos ou clientes que não estejam nessas fontes.

// Título dos currículos (CV_pt)
export const headline = 'Desenvolvedor Full-Stack (Laravel, Vue) | Foco em Back-end | Sistemas SaaS & ERP';

export const sobre = {
    titulo: 'Desenvolvedor Full-Stack',
    // Headline do LinkedIn
    destaque: 'PHP (Laravel) • Node.js (NestJS) • SQL (MySQL/Postgres) • Vue.js • React • Inertia • Tailwind',
    local: 'Rio de Janeiro, RJ — Brasil',
    // Foto em public/storage/perfil/
    foto: `${import.meta.env.BASE_URL}storage/perfil/foto-perfil.jpg`,
    // Resumo do CV_pt + resumo do LinkedIn
    paragrafos: [
        'Desenvolvedor Full-Stack com +6 anos de experiência prática na construção de sistemas escaláveis com Laravel, Vue.js e tecnologias web modernas. Especializado em integrações de ERP, automação de marketplaces e APIs de alta performance.',
        'Ajudo empresas a escalar operações de ERP e e-commerce: arquiteturas back-end robustas, integrações com marketplaces e automação de fluxos que eliminam processos manuais. Do motor de sincronização de dados à SPA com Vue e React, meu foco é clean architecture, performance e aprendizado contínuo.',
    ],
    // LinkedIn / CV
    formacao: [
        { titulo: 'Engenharia Mecânica', local: 'Universidade Federal Fluminense (UFF)', periodo: 'a partir de 2018' },
        { titulo: 'Desenvolvedor de Software Autodidata', local: 'Projetos reais e sistemas em produção', periodo: '2018 – atual' },
    ],
    idiomas: [
        { nome: 'Português', nivel: 'Nativo' },
        { nome: 'Inglês', nivel: 'Avançado' },
    ],
};

// Competências técnicas dos CVs + headline do LinkedIn + tags de slides.js + package.json
export const stack = [
    {
        grupo: 'Back-end',
        itens: ['PHP 8.4', 'Laravel (v8–v12)', 'Eloquent', 'Node.js', 'NestJS', 'Prisma', 'Redis (básico)'],
    },
    { grupo: 'Banco de dados e Cloud', itens: ['MySQL', 'PostgreSQL', 'SQL', 'AWS S3', 'Filas e Cron'] },
    {
        grupo: 'Front-end',
        itens: ['Vue.js 2/3', 'React', 'Inertia.js', 'TypeScript', 'Pinia', 'Vite', 'Tailwind CSS', 'Highcharts', 'FullCalendar'],
    },
    { grupo: 'Integrações', itens: ['API REST', 'GraphQL', 'Webhooks', 'OAuth 2.0', 'HMAC-SHA256', 'XML (NFe)', 'Pix'] },
    { grupo: 'Animação e 3D', itens: ['GSAP', 'anime.js', 'Three.js', 'Swiper'] },
    { grupo: 'Ferramentas', itens: ['Git', 'GitHub', 'GitLab', 'WSL'] },
];

// Padrões que aparecem nas descrições de slides.js
export const arquitetura = [
    {
        titulo: 'Webhooks idempotentes',
        texto: 'Proteção contra duplicidade e lock contra processamento concorrente de pedidos (Nuvemshop, Shopee, Vendizap).',
    },
    {
        titulo: 'Sincronização agendada',
        texto: 'Rotinas a cada 5 minutos enviando estoque e preço, por filial ou pela soma das filiais.',
    },
    {
        titulo: 'Autenticação e assinatura',
        texto: 'OAuth 2.0 com renovação automática de token e requisições/webhooks validados por HMAC-SHA256.',
    },
    {
        titulo: 'Consistência no ERP',
        texto: 'Gravação de pedido e itens em uma única transação, devolução de estoque no cancelamento e tratamento de limite de requisições.',
    },
];

// Experiência: LinkedIn (empresa, período) + CV_pt e LinkedIn (destaques)
export const atuacao = {
    cargo: 'Desenvolvedor Web Full-Stack',
    empresa: 'Total Control Technology',
    periodo: 'Mai/2020 – atual',
    local: 'Rio de Janeiro, Brasil',
    destaques: [
        {
            titulo: 'Integrações multicanal',
            texto: 'Integrações de ERP de alto volume com Mercado Livre, Shopify, Nuvemshop, WooCommerce e iFood, automatizando a entrada de pedidos, o cadastro de clientes e a sincronização de estoque, com redução de cerca de 70% no processamento manual.',
        },
        {
            titulo: 'Entrada de mercadoria via XML (NFe)',
            texto: 'Módulos de estoque com integração XML (NFe), automatizando cadastro de produtos e atualização de estoque com conformidade fiscal entre lojas físicas e plataformas digitais.',
        },
        {
            titulo: 'Modernização de legado',
            texto: 'Liderou a migração de módulos legados para SPAs com PHP 8.4, Laravel 12, Inertia.js, Vue.js e Tailwind CSS, sem recarregamento de página.',
        },
        {
            titulo: 'Arquitetura de dados',
            texto: 'Estruturas hierárquicas de níveis infinitos e algoritmos recursivos para catálogos grandes, com otimização de queries SQL complexas.',
        },
        {
            titulo: 'Processamento financeiro em volume',
            texto: 'Ajustes de estoque em massa e gestão financeira com paginação no servidor para milhares de registros, mantendo estabilidade sob alta carga.',
        },
        {
            titulo: 'BI, CRM e suporte',
            texto: 'Dashboards analíticos e agenda comercial (FullCalendar) integrados ao CRM, além de suporte técnico direto a clientes.',
        },
    ],
};

// Prints dos projetos ficam em public/storage/projetos/
const imgProjeto = file => `${import.meta.env.BASE_URL}storage/projetos/${file}`;

// Só portfolio-vue3 e desafio-btg-v2 exibem link de repositório; os demais (inclusive o Maktub,
// que será comercializado) mostram apenas descrição e print.
export const projetos = [
    {
        nome: 'Portfólio (este site)',
        descricao: 'Vue 3 + Vite + Tailwind CSS 4, com modo claro/escuro, animações em GSAP e anime.js, carrossel 3D em cubo com Swiper e espiral em Three.js.',
        tags: ['Vue 3', 'Vite', 'Tailwind CSS', 'Three.js'],
        repo: 'https://github.com/imerlim/portfolio-vue3',
        imagem: imgProjeto('portfolio.jpeg'),
    },
    {
        nome: 'Jogo da Memória — Desafio BTG v2',
        descricao: 'Vue 3 (Composition API) e TypeScript, com arquitetura modular e persistência em LocalStorage.',
        tags: ['Vue 3', 'TypeScript'],
        repo: 'https://github.com/imerlim/desafio-btg-v2',
        demo: 'https://desafio-btg-v2.vercel.app',
        imagem: imgProjeto('jogo-memoria.jpeg'),
    },
    {
        nome: 'Maktub — Gestão de Bar & Eventos',
        descricao: 'Painel para bar e eventos com Laravel 12, Inertia.js e Vue 3: eventos, custos e despesas fixas consolidados em um dashboard. Projeto em desenvolvimento, com módulos de insumos, drinks e financeiro a caminho.',
        tags: ['Laravel 12', 'Inertia.js', 'Vue 3', 'Tailwind CSS'],
        imagem: imgProjeto('maktub.jpeg'),
    },
    {
        nome: 'Financial Tools Dashboard',
        descricao: 'Aplicação web autenticada com ferramentas financeiras: cálculo de margem, simulação de juros compostos e visualização de fluxo de caixa pessoal.',
        tags: ['Vue'],
        imagem: imgProjeto('financial-tools.jpeg'),
    },
    {
        nome: 'Sistema de Gerenciamento de Documentos (DMS)',
        descricao: 'Gestão segura de arquivos no AWS S3, com controle de acesso, metadados e URLs temporárias para compartilhamento.',
        tags: ['Laravel', 'AWS S3'],
        imagem: imgProjeto('dms.jpeg'),
    },
    {
        nome: 'Dashboard de Inteligência Financeira',
        descricao: 'Acompanhamento de receitas e despesas com categorização automática e gráficos interativos mensais.',
        tags: ['Laravel', 'Vue.js', 'Highcharts'],
        imagem: imgProjeto('dashboard-financeiro.jpeg'),
    },
    {
        nome: 'API de Controle Financeiro',
        descricao: 'API e interface para finanças pessoais, com saldo mensal, categorização de receitas/despesas e cálculos em tempo real.',
        tags: ['NestJS', 'React'],
        imagem: imgProjeto('api-financeira.jpeg'),
    },
];

// Rotas existentes em src/router/index.js
export const ferramentas = [
    {
        nome: 'Calculadora de Margem de Lucro',
        descricao: 'Preço de venda a partir do custo, com margem sobre a venda ou sobre o custo.',
        to: '/calculadora-margem',
    },
    {
        nome: 'Calculadora de Juros Compostos',
        descricao: 'Projeção do patrimônio com capital inicial, aportes mensais, taxa e prazo.',
        to: '/calculadora-juros-compostos',
    },
];

// Mesmos contatos do Footer.vue / LinkedIn
export const contatos = [
    { nome: 'E-mail', valor: 'imerlimdev@gmail.com', href: 'mailto:imerlimdev@gmail.com' },
    { nome: 'LinkedIn', valor: 'in/igor-merlim', href: 'https://www.linkedin.com/in/igor-merlim/' },
    { nome: 'GitHub', valor: 'imerlim', href: 'https://github.com/imerlim' },
    { nome: 'WhatsApp', valor: 'Conversar no WhatsApp', href: 'https://wa.me/5521982100397' },
];
