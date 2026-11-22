// Versão em inglês de slides.js: mesma ordem e mesmas imagens; só título, tags e descrição traduzidos.
// Ao alterar slides.js, atualize também este arquivo.
import { slides as slidesPt } from './slides';

const traducoes = [
    {
        title: 'Nuvemshop API Integration',
        tags: ['Laravel 12', 'Vue.js 3', 'Inertia.js', 'Tailwind CSS', 'PHP 8.4', 'MySQL', 'Webhooks', 'Queues & Cron'],
        description: `- Orders: order-created webhook with duplicate protection, automatic customer registration and sale completion directly in the ERP.

- Catalog: create, edit and delete products with variants, categories, video, dimensions and promotional price.

- Synchronization: a routine every 5 minutes sends stock (mirrored branch or sum of branches), prices, name and dimensions, each option toggleable.

- Operations: status changes and cancellation with stock return, PDF report and rate-limit handling.`,
    },
    {
        title: 'Marketplace Integration: Mercado Livre',
        tags: ['Laravel 12', 'Vue.js 3', 'Inertia.js', 'Tailwind CSS', 'PHP 8.4', 'OAuth 2.0', 'REST API', 'Webhooks'],
        description: `- Connection: OAuth 2.0 with automatic token refresh.

- Listings: create, edit (individually and in bulk) and delete, with category suggestion, required attributes, GTIN validation and image upload.

- Orders and questions: orders received via webhook (packs, shipments and invoicing) and buyer questions answered from the ERP.

- Synchronization: stock sent every 5 minutes, including per variation, with automatic product linking by SKU.`,
    },
    {
        title: 'iFood Integration: Grocery and Restaurant',
        tags: ['Laravel 12', 'Vue.js 3', 'Inertia.js', 'Tailwind CSS', 'PHP 8.4', 'iFood Merchant API', 'Webhooks'],
        description: `- Centralized app: the operator fetches the authorized stores in the Total Control app and connects multiple stores, grocery and restaurant, in the same panel.

- Orders: events received via webhook, confirmation through the API and order and items saved in a single transaction.

- Grocery: item picking, product replacement or removal in the order, dispatch, and catalog and stock sync per branch.

- Store management: opening hours, scheduled interruptions, store status and cancellation with reason.`,
    },
    {
        title: 'Marketplace Integration: Shopee',
        tags: ['Laravel 12', 'Vue.js 3', 'Inertia.js', 'Tailwind CSS', 'PHP 8.4', 'Shopee Open Platform', 'HMAC-SHA256'],
        description: `- Connection: Shopee Open Platform OAuth with HMAC-SHA256 signed requests, token refresh and a warning before the yearly authorization expires.

- Orders: webhook with locking against concurrent processing, net amount (escrow) and handling of full or partial returns and refunds.

- Products: automatic linking by SKU and by variation, with cleanup of stale links and a PDF report.

- Dashboard: indicators, pending orders and sale completion using the same closing flow as order issuing.`,
    },
    {
        title: 'Shopify Integration (GraphQL)',
        tags: ['Laravel 12', 'Vue.js 3', 'Inertia.js', 'Tailwind CSS', 'PHP 8.4', 'GraphQL Admin API', 'Webhooks'],
        description: `- API: GraphQL Admin API to create and publish products, bulk-update variants and set stock per location.

- Orders: order-created webhook, validated with HMAC-SHA256, entering the ERP as an open order with customer and items.

- Products: bulk registration from the ERP, editing of title, description and stock per variant, and bulk deletion.

- Dashboard: indicators for orders, products and out-of-stock items, with sale completion on the same screen.`,
    },
    {
        title: 'Vendizap Catalog Integration',
        tags: ['Laravel 12', 'Vue.js 3', 'Inertia.js', 'Tailwind CSS', 'PHP 8.4', 'REST API', 'Webhooks', 'Multi-store'],
        description: `- Multi-store: each branch has its own Vendizap store, with a store selector and independent configuration.

- Orders: webhook with per-order locking against duplicates and automatic customer registration.

- Products: bulk upload with variations, dimension validation and detailed feedback on items that were not registered.

- Synchronization: a routine every 5 minutes sends stock (per branch or sum) and sale price.`,
    },
    {
        title: 'Recurring Checkout: Rede Itaú (Card and Pix)',
        tags: ['Laravel 12', 'Vue.js 3', 'Inertia.js', 'Tailwind CSS', 'PHP 8.4', 'e.Rede API', 'OAuth 2.0', 'Pix'],
        description: `- Subscriptions: checkout for Total Control's monthly fees, where the customer selects the open invoices and pays in a single flow.

- Recurring card: card tokenization in Rede's vault and daily automatic charging with per-period locking, without storing the card in the system.

- Pix: QR Code and copy-and-paste code generation with expiration.

- Security and operations: OAuth 2.0 with token refresh, switching between sandbox and production, cancellations and sales statements with chargeback detection.`,
    },
    {
        title: 'Wealth Projection Engine',
        tags: ['Vue.js 3', 'JavaScript', 'Tailwind CSS', 'Financial modeling'],
        description: `- Core: compound interest calculator that projects wealth from initial capital, monthly contributions, rate and term.

- Precision: converts the annual rate into the equivalent monthly rate and the term into years or months before applying the future-value formula with contributions.

- Result: final amount, total invested and total interest, calculated right in the browser, with no backend, with field validation.`,
    },
];

export const slides = slidesPt.map((s, i) => ({ ...s, ...traducoes[i] }));
