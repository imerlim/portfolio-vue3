// Slides do carrossel "Experiência Profissional".
// As imagens ficam em public/storage/.
const img = file => `${import.meta.env.BASE_URL}storage/${file}`;

export const slides = [
    {
        image: img('nuvemshop-integracao.jpeg'),
        title: 'Integração com a API Nuvemshop',
        tags: ['Laravel 12', 'Vue.js 3', 'Inertia.js', 'Tailwind CSS', 'PHP 8.4', 'MySQL', 'Webhooks', 'Filas e Cron'],
        description: `- Pedidos: webhook de pedido criado com proteção contra duplicidade, cadastro automático do cliente e finalização da venda direto no ERP.

- Catálogo: criação, edição e exclusão de produtos com variantes, categorias, vídeo, dimensões e preço promocional.

- Sincronização: rotina a cada 5 minutos envia estoque (filial espelhada ou soma das filiais), preços, nome e dimensões, com cada opção ativável.

- Operação: mudança de status e cancelamento com devolução de estoque, relatório em PDF e tratamento de limite de requisições.`,
    },
    {
        image: img('mercado-livre-integracao.jpeg'),
        title: 'Integração com Marketplace: Mercado Livre',
        tags: ['Laravel 12', 'Vue.js 3', 'Inertia.js', 'Tailwind CSS', 'PHP 8.4', 'OAuth 2.0', 'API REST', 'Webhooks'],
        description: `- Conexão: OAuth 2.0 com renovação automática do token.

- Anúncios: criação, edição individual e em massa e exclusão, com sugestão de categoria, atributos obrigatórios, validação de GTIN e envio de imagens.

- Pedidos e perguntas: pedidos recebidos por webhook (packs, envios e faturamento) e perguntas dos compradores respondidas pelo ERP.

- Sincronização: estoque enviado a cada 5 minutos, inclusive por variação, com vínculo automático de produtos por SKU.`,
    },
    {
        image: img('integracao-ifood.jpeg'),
        title: 'Integração iFood: Mercado e Restaurante',
        tags: ['Laravel 12', 'Vue.js 3', 'Inertia.js', 'Tailwind CSS', 'PHP 8.4', 'iFood Merchant API', 'Webhooks'],
        description: `- Aplicativo centralizado: o operador busca as lojas autorizadas no app da Total Control e conecta várias lojas, de mercado e de restaurante, no mesmo painel.

- Pedidos: eventos recebidos por webhook, confirmação na API e gravação do pedido e dos itens em uma única transação.

- Mercado: separação de itens, troca ou remoção de produtos no pedido, despacho e envio de catálogo e estoque por filial.

- Gestão da loja: horários de funcionamento, interrupções programadas, status da loja e cancelamento com motivo.`,
    },
    {
        image: img('integracao-shopee.jpeg'),
        title: 'Integração com Marketplace: Shopee',
        tags: ['Laravel 12', 'Vue.js 3', 'Inertia.js', 'Tailwind CSS', 'PHP 8.4', 'Shopee Open Platform', 'HMAC-SHA256'],
        description: `- Conexão: OAuth da Shopee Open Platform com requisições assinadas em HMAC-SHA256, renovação de token e aviso de vencimento da autorização anual.

- Pedidos: webhook com lock contra processamento concorrente, valor líquido (escrow) e tratamento de devoluções e reembolsos totais ou parciais.

- Produtos: vínculo automático por SKU e por variação, com limpeza de vínculos obsoletos e relatório em PDF.

- Painel: indicadores, pedidos aguardando e finalização da venda com o mesmo fechamento da emissão de pedidos.`,
    },
    {
        image: img('integracao-shopify.jpeg'),
        title: 'Integração com a Shopify (GraphQL)',
        tags: ['Laravel 12', 'Vue.js 3', 'Inertia.js', 'Tailwind CSS', 'PHP 8.4', 'GraphQL Admin API', 'Webhooks'],
        description: `- API: GraphQL Admin API para criar e publicar produtos, atualizar variantes em lote e definir o estoque por local.

- Pedidos: webhook de pedido criado, validado por HMAC-SHA256, que entra no ERP como pedido em aberto com cliente e itens.

- Produtos: cadastro em lote a partir do ERP, edição de título, descrição e estoque por variante, e exclusão em massa.

- Painel: indicadores de pedidos, produtos e itens sem estoque, com finalização da venda dentro da própria tela.`,
    },
    {
        image: img('integracao-vendizap.jpeg'),
        title: 'Integração com o Catálogo Vendizap',
        tags: ['Laravel 12', 'Vue.js 3', 'Inertia.js', 'Tailwind CSS', 'PHP 8.4', 'API REST', 'Webhooks', 'Multi-loja'],
        description: `- Multi-loja: cada filial tem a sua própria loja Vendizap, com seletor de loja e configuração independente.

- Pedidos: webhook com lock por pedido contra duplicidade e cadastro automático do cliente.

- Produtos: envio em lote com variações, validação de dimensões e retorno detalhado dos itens não cadastrados.

- Sincronização: rotina a cada 5 minutos envia estoque (por filial ou soma) e preço de venda.`,
    },
    {
        image: img('checkout-rede-itau-api.jpeg'),
        title: 'Checkout Recorrente: Rede Itaú (Cartão e Pix)',
        tags: ['Laravel 12', 'Vue.js 3', 'Inertia.js', 'Tailwind CSS', 'PHP 8.4', 'e.Rede API', 'OAuth 2.0', 'Pix'],
        description: `- Assinaturas: checkout para as mensalidades da Total Control, em que o cliente seleciona os títulos em aberto e paga em um único fluxo.

- Cartão recorrente: tokenização do cartão no cofre da Rede e cobrança automática diária com lock por competência, sem guardar o cartão no sistema.

- Pix: geração de QR Code e código copia e cola com expiração.

- Segurança e operação: OAuth 2.0 com renovação de token, alternância entre sandbox e produção, cancelamentos e extrato de vendas com detecção de chargeback.`,
    },
    {
        image: img('calculadora-juros-compostos.jpeg'),
        title: 'Motor de Projeção Patrimonial',
        tags: ['Vue.js 3', 'JavaScript', 'Tailwind CSS', 'Modelagem financeira'],
        description: `- Núcleo: calculadora de juros compostos que projeta o patrimônio a partir do capital inicial, dos aportes mensais, da taxa e do prazo.

- Precisão: converte taxa anual em mensal equivalente e prazo em anos ou meses antes de aplicar a fórmula do montante com aportes.

- Resultado: montante final, total investido e total em juros, calculados direto no navegador, sem backend, com validação dos campos.`,
    },
];
