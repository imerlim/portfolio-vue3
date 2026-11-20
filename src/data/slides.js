// Slides do carrossel "Experiência Profissional".
// As imagens ficam em public/storage/ (mesmos nomes de arquivo do projeto original).
const img = file => `${import.meta.env.BASE_URL}storage/${file}`;

export const slides = [
    {
        image: img('nuvemshop_old.jpeg'),
        title: 'Integração com a API Nuvemshop',
        tags: ['Laravel 7', 'Bootstrap-vue', 'Vue.js 2', 'Highcharts', 'PHP 7.4', 'MySQL', 'Trumbowyg'],
        description: `- Automação: motor de sincronização automática que atualiza estoque e preços a cada 5 minutos e cadastra novos clientes no CRM em segundo plano.

- Escalabilidade: projetado para upload de produtos em massa e processamento de pedidos em larga escala.

- Controle: camada de configuração personalizada para regras de sincronização definidas pelo usuário.

- Tecnologia: lógica de API refinada e consultas otimizadas para máxima estabilidade em picos de demanda.`,
    },
    {
        image: img('nuvemshop_new.jpeg'),
        title: 'Redesign da Integração com a API Nuvemshop',
        tags: ['Laravel 12', 'Vue.js 3', 'SPA', 'Inertia.js', 'Tailwind CSS', 'PHP 8.4', 'MySQL', 'Chart.js', 'Sincronização em tempo real'],
        description: `- Núcleo: automatiza em tempo real o estoque, os preços e a gestão em massa de produtos e pedidos.

- Melhorias: migração para Inertia.js e PHP 8.4, trazendo uma experiência mais rápida, com cara de aplicativo e latência quase zero.

- UX/UI: novo dashboard em Tailwind CSS com Chart.js para melhor visualização dos dados.

- Refinamento: lógica em segundo plano aprimorada para o cadastro automático de clientes e estabilidade com alto volume de dados.`,
    },
    {
        image: img('mercado_livre_new.jpeg'),
        title: 'Integração com Marketplace: Mercado Livre',
        tags: ['Laravel 12', 'Vue.js 3', 'SPA', 'Inertia.js', 'Tailwind CSS', 'PHP 8.4', 'MySQL', 'API REST'],
        description: `- Operações em massa: controle total para publicar novos anúncios, pausar ou excluir anúncios em lote diretamente pelo ERP.

- Sincronização e rastreio: sincronização em tempo real dos dados de produtos, níveis de estoque e status dos pedidos.

- Gestão: dashboard centralizado para visualizar os detalhes dos pedidos e gerenciar todo o fluxo de vendas.

- Tecnologia: SPA de alta performance com Inertia.js e PHP 8.4, conectando o estoque interno ao ecossistema do Mercado Livre.`,
    },
    {
        image: img('woocommerce.jpeg'),
        title: 'Integração com a API WooCommerce',
        tags: ['Laravel 7', 'Bootstrap-vue', 'Vue.js 2', 'PHP 7.4', 'MySQL'],
        description: `- Gestão de produtos: criação de um dashboard centralizado para criar, editar e excluir produtos diretamente na plataforma WooCommerce.

- Acompanhamento de pedidos: visualização em tempo real dos pedidos e dos dados de clientes sincronizados com o ERP.

- Automação: gestão simplificada das atualizações de status dos pedidos, garantindo consistência entre vendas e logística.

- Integração: conexão robusta com a API REST do WooCommerce, garantindo um fluxo de dados contínuo para as operações de e-commerce.`,
    },
    {
        image: img('sales_agenda_old.jpeg'),
        title: 'Gestão de Agendamentos',
        tags: ['Laravel 7', 'Bootstrap-vue', 'Vue.js 2', 'Highcharts', 'PHP 7.4', 'MySQL', 'FullCalendar'],
        description: `- Operações: implementação de um sistema complexo de agenda comercial para gestão dinâmica de eventos e compromissos.

- Integração com CRM: totalmente integrado ao fluxo de CRM da empresa para agilizar o acompanhamento de vendas e follow-ups.

- UX/UI: calendário interativo que permite manipular eventos em tempo real e organizar visualmente o funil de vendas.

- Eficiência: centraliza as atividades comerciais, reduzindo conflitos de agenda e aumentando a produtividade da equipe.`,
    },
    {
        image: img('tree_view_new.png'),
        title: 'Arquitetura de Dados Recursiva e Tree View',
        tags: ['Laravel 12', 'Vue.js 3', 'SPA', 'Inertia.js', 'Tailwind CSS', 'PHP 8.4', 'MySQL', 'Lógica recursiva'],
        description: `- Lógica: algoritmos que transformam dados planos em relações hierárquicas com níveis infinitos.

- UX/UI: sincronização de estado em tempo real e renderização recursiva com fluxos de CRUD intuitivos.

- Performance: renderização e consultas otimizadas para conjuntos de dados complexos com latência mínima.

- Arquitetura: SPA de alta performance que oferece uma experiência fluida na gestão de dados organizacionais.`,
    },
    {
        image: img('consolidated_sales_OLD.jpg'),
        title: 'BI e Dashboards Interativos',
        tags: ['Laravel 7', 'Bootstrap-vue', 'Vue.js 2', 'Highcharts', 'PHP 7.4', 'MySQL'],
        description: `- Análise: desenvolvimento de dashboards consolidados de vendas para inteligência de negócios e acompanhamento de desempenho.

- Visualização: gráficos interativos e dinâmicos com Highcharts para monitoramento de vendas em tempo real.

- Backend: motor robusto de processamento de dados em Laravel 7 para lidar com consultas complexas e grandes volumes de dados.

- UX: interface limpa e responsiva com Vue.js 2 e Bootstrap-vue para apoiar decisões orientadas por dados.`,
    },
    {
        image: img('financial_management_new.png'),
        title: 'Processamento Financeiro de Alto Volume',
        tags: ['Laravel 12', 'Vue.js 3', 'SPA', 'Inertia.js', 'Tailwind CSS', 'PHP 8.4', 'MySQL', 'Motor de paginação'],
        description: `- Performance: motor otimizado no servidor para processar e buscar dinamicamente grandes volumes de dados financeiros.

- Escalabilidade: navegação fluida por milhares de documentos sem latência ou perda de desempenho no navegador.

- UX/UI: interface SPA de alta performance para uma gestão rápida e fluida de registros financeiros complexos.

- Eficiência: elimina gargalos de dados com busca inteligente de registros e fluxos de dados simplificados.`,
    },
    {
        image: img('stock_adjustment_new.png'),
        title: 'Controle de Estoque de Precisão',
        tags: ['Laravel 12', 'Vue.js 3', 'SPA', 'Inertia.js', 'Tailwind CSS', 'PHP 8.4', 'MySQL', 'Atualizações em lote'],
        description: `- Eficiência: módulo de ajuste de estoque de alta velocidade, feito para entrada rápida de dados e atualizações em lote de grande volume.

- Sincronização em tempo real: consulta instantânea de produtos para garantir a precisão do estoque em todo o ERP.

- UX/UI: interface SPA moderna focada em agilidade administrativa, reduzindo atritos nas operações diárias do depósito.

- Confiabilidade: elimina erros manuais automatizando cálculos complexos de estoque e fluxos de sincronização.`,
    },
    {
        image: img('product_registration_old.jpg'),
        title: 'UX do Cadastro de Produtos',
        tags: ['Laravel 7', 'Bootstrap-vue', 'Vue.js 2', 'PHP 7.4', 'MySQL'],
        description: `- Eficiência: otimizado para a entrada rápida de dados técnicos e fiscais complexos dentro do ERP.

- Reatividade: interface densa e reativa para validar em tempo real informações críticas para o negócio.

- UX/UI: fluxo limpo e estruturado que agiliza o cadastro de produtos e minimiza erros administrativos.

- Impacto: redução do tempo de cadastro ao oferecer um ambiente estável e rápido para catálogos extensos.`,
    },
    {
        image: img('product_registration_new.jpeg'),
        title: 'Redesign do Cadastro de Produtos',
        tags: ['Laravel 12', 'Vue.js 3', 'SPA', 'Inertia.js', 'Tailwind CSS', 'PHP 8.4', 'MySQL', 'Gerenciamento de estado'],
        description: `- Performance: redesign em SPA de alta performance que lida com dados fiscais e técnicos complexos sem recarregar a página.

- UX moderna: interface reformulada e enxuta, focada em maximizar a eficiência e a concentração administrativa.

- Gerenciamento de estado: lógica avançada para gerenciar relações de dados complexas e validações em tempo real.

- Otimização: redução significativa da latência, com uma experiência rápida, semelhante a um aplicativo desktop, nas operações centrais do ERP.`,
    },
    {
        image: img('margin_calculator_new.png'),
        title: 'Motor de Margem Financeira',
        tags: ['Laravel 12', 'Vue.js 3', 'SPA', 'Inertia.js', 'Tailwind CSS', 'PHP 8.4', 'Interface reativa'],
        description:
            'Ferramenta de precificação especializada no cálculo de margens de lucro com base no preço de custo ou no preço de venda. Construída com uma interface reativa que atualiza instantaneamente a Margem Líquida e o Lucro, permitindo que equipes de vendas tomem decisões de preço baseadas em dados, com precisão.',
    },
    {
        image: img('interest_calculator_new.png'),
        title: 'Motor de Projeção Patrimonial',
        tags: ['Laravel 12', 'Vue.js 3', 'SPA', 'Inertia.js', 'Tailwind CSS', 'PHP 8.4', 'Modelagem financeira'],
        description:
            'Ferramenta sofisticada de juros compostos para estimar o acúmulo de patrimônio no longo prazo. Possui uma interface dinâmica que calcula o valor futuro a partir do capital inicial, dos aportes mensais e de taxas de juros variáveis, oferecendo projeções financeiras precisas.',
    },
    {
        image: img('financial_control_new.png'),
        title: 'Análise Financeira Segura',
        tags: ['Laravel 12', 'Vue.js 3', 'SPA', 'Inertia.js', 'Breeze/Fortify', 'Chart.js', 'PHP 8.4'],
        description:
            'Dashboard financeiro seguro e autenticado para controle completo dos dados. O módulo conta com rotas protegidas e permissões por usuário, integrando tabelas de transações em tempo real com visualizações em Chart.js para identificar as categorias mais e menos vendidas, apoiando o planejamento estratégico do negócio.',
    },
];
