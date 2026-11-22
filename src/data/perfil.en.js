// Versão em inglês de perfil.js (mesmas chaves e mesma ordem; só tradução, sem fatos novos).
// Ao alterar perfil.js, atualize também este arquivo.

export const headline = 'Full-Stack Developer (Laravel, Vue) | Back-end Focus | SaaS & ERP Systems';

export const sobre = {
    titulo: 'Full-Stack Developer',
    destaque: 'PHP (Laravel) • Node.js (NestJS) • SQL (MySQL/Postgres) • Vue.js • React • Inertia • Tailwind',
    local: 'Rio de Janeiro, RJ — Brazil',
    paragrafos: [
        'Full-Stack Developer with 5+ years of hands-on experience building scalable systems with Laravel, Vue.js and modern web technologies. Specialized in ERP integrations, marketplace automation and high-performance APIs.',
        'I help companies scale ERP and e-commerce operations: robust back-end architectures, marketplace integrations and workflow automation that eliminates manual processes. From the data synchronization engine to the SPA with Vue and React, my focus is clean architecture, performance and continuous learning.',
    ],
    formacao: [
        { titulo: 'Mechanical Engineering', local: 'Universidade Federal Fluminense (UFF)', periodo: 'from 2018' },
        { titulo: 'Self-taught Software Developer', local: 'Real-world projects and production systems', periodo: '2018 – present' },
    ],
    idiomas: [
        { nome: 'Portuguese', nivel: 'Native' },
        { nome: 'English', nivel: 'Advanced' },
    ],
};

export const stack = [
    {
        grupo: 'Back-end',
        itens: ['PHP 8.4', 'Laravel (v8–v12)', 'Eloquent', 'Node.js', 'NestJS', 'Prisma', 'Redis (basic)'],
    },
    { grupo: 'Databases & Cloud', itens: ['MySQL', 'PostgreSQL', 'SQL', 'AWS S3', 'Queues & Cron'] },
    {
        grupo: 'Front-end',
        itens: ['Vue.js 2/3', 'React', 'Inertia.js', 'TypeScript', 'Pinia', 'Vite', 'Tailwind CSS', 'Highcharts', 'FullCalendar'],
    },
    { grupo: 'Integrations', itens: ['REST API', 'GraphQL', 'Webhooks', 'OAuth 2.0', 'HMAC-SHA256', 'XML (NFe)', 'Pix'] },
    { grupo: 'Animation & 3D', itens: ['GSAP', 'anime.js', 'Three.js', 'Swiper'] },
    { grupo: 'Tools', itens: ['Git', 'GitHub', 'GitLab', 'WSL'] },
];

export const arquitetura = [
    {
        titulo: 'Idempotent webhooks',
        texto: 'Duplicate protection and locking against concurrent order processing (Nuvemshop, Shopee, Vendizap).',
    },
    {
        titulo: 'Scheduled synchronization',
        texto: 'Routines every 5 minutes sending stock and price, per branch or as the sum of all branches.',
    },
    {
        titulo: 'Authentication & signing',
        texto: 'OAuth 2.0 with automatic token refresh, and requests/webhooks validated with HMAC-SHA256.',
    },
    {
        titulo: 'Consistency in the ERP',
        texto: 'Order and items saved in a single transaction, stock returned on cancellation and rate-limit handling.',
    },
];

export const atuacao = {
    cargo: 'Full-Stack Web Developer',
    empresa: 'Total Control Technology',
    periodo: 'May 2020 – present',
    local: 'Rio de Janeiro, Brazil',
    destaques: [
        {
            titulo: 'Multichannel integrations',
            texto: 'High-volume ERP integrations with Mercado Livre, Shopify, Nuvemshop, WooCommerce and iFood, automating order intake, customer registration and stock synchronization, reducing manual processing by about 70%.',
        },
        {
            titulo: 'Goods receipt via XML (NFe)',
            texto: 'Inventory modules with XML (NFe) integration, automating product registration and stock updates with tax compliance across physical stores and digital platforms.',
        },
        {
            titulo: 'Legacy modernization',
            texto: 'Led the migration of legacy modules to SPAs with PHP 8.4, Laravel 12, Inertia.js, Vue.js and Tailwind CSS, with no page reloads.',
        },
        {
            titulo: 'Data architecture',
            texto: 'Infinite-level hierarchical structures and recursive algorithms for large catalogs, with optimization of complex SQL queries.',
        },
        {
            titulo: 'High-volume financial processing',
            texto: 'Bulk stock adjustments and financial management with server-side pagination for thousands of records, staying stable under heavy load.',
        },
        {
            titulo: 'BI, CRM & support',
            texto: 'Analytics dashboards and a sales calendar (FullCalendar) integrated with the CRM, plus direct technical support to clients.',
        },
    ],
};

const imgProjeto = file => `${import.meta.env.BASE_URL}storage/projetos/${file}`;

export const projetos = [
    {
        nome: 'Portfolio (this site)',
        descricao: 'Vue 3 + Vite + Tailwind CSS 4, with light/dark mode, GSAP and anime.js animations, a 3D cube carousel with Swiper and a Three.js spiral.',
        tags: ['Vue 3', 'Vite', 'Tailwind CSS', 'Three.js'],
        repo: 'https://github.com/imerlim/portfolio-vue3',
        imagem: imgProjeto('portfolio.jpeg'),
    },
    {
        nome: 'Memory Game — BTG Challenge v2',
        descricao: 'Vue 3 (Composition API) and TypeScript, with modular architecture and LocalStorage persistence.',
        tags: ['Vue 3', 'TypeScript'],
        repo: 'https://github.com/imerlim/desafio-btg-v2',
        demo: 'https://desafio-btg-v2.vercel.app',
        imagem: imgProjeto('jogo-memoria.jpeg'),
    },
    {
        nome: 'Maktub — Bar & Events Management',
        descricao: 'Dashboard for a bar and events business built with Laravel 12, Inertia.js and Vue 3: events, costs and fixed expenses consolidated in one view. Project under development, with supplies, drinks and finance modules on the way.',
        tags: ['Laravel 12', 'Inertia.js', 'Vue 3', 'Tailwind CSS'],
        imagem: imgProjeto('maktub.jpeg'),
    },
    {
        nome: 'Financial Tools Dashboard',
        descricao: 'Authenticated web app with financial tools: margin calculation, compound interest simulation and personal cash flow visualization.',
        tags: ['Vue'],
        imagem: imgProjeto('financial-tools.jpeg'),
    },
    {
        nome: 'Document Management System (DMS)',
        descricao: 'Secure file management on AWS S3, with access control, metadata and temporary URLs for sharing.',
        tags: ['Laravel', 'AWS S3'],
        imagem: imgProjeto('dms.jpeg'),
    },
    {
        nome: 'Financial Intelligence Dashboard',
        descricao: 'Income and expense tracking with automatic categorization and interactive monthly charts.',
        tags: ['Laravel', 'Vue.js', 'Highcharts'],
        imagem: imgProjeto('dashboard-financeiro.jpeg'),
    },
    {
        nome: 'Financial Control API',
        descricao: 'API and interface for personal finances, with monthly balance, income/expense categorization and real-time calculations.',
        tags: ['NestJS', 'React'],
        imagem: imgProjeto('api-financeira.jpeg'),
    },
];

// As calculadoras em si continuam em português
export const ferramentas = [
    {
        nome: 'Profit Margin Calculator',
        descricao: 'Selling price from cost, with margin on the sale price or on cost.',
        to: '/calculadora-margem',
    },
    {
        nome: 'Compound Interest Calculator',
        descricao: 'Wealth projection with initial capital, monthly contributions, rate and term.',
        to: '/calculadora-juros-compostos',
    },
];

export const contatos = [
    { nome: 'Email', valor: 'imerlimdev@gmail.com', href: 'mailto:imerlimdev@gmail.com' },
    { nome: 'LinkedIn', valor: 'in/igor-merlim', href: 'https://www.linkedin.com/in/igor-merlim/' },
    { nome: 'GitHub', valor: 'imerlim', href: 'https://github.com/imerlim' },
    { nome: 'WhatsApp', valor: 'Chat on WhatsApp', href: 'https://wa.me/5521982100397' },
];
