# Portfólio — Igor Merlim (Vue 3)

SPA estática em Vue 3 + Vite + Tailwind CSS v4 (dark mode por classe), sem backend.

- **Rotas** (hash history, compatível com GitHub Pages):
  - `#/` — Início (animação Three.js + carrossel de experiência profissional)
  - `#/calculadora-margem` — Calculadora de margem de lucro
  - `#/calculadora-juros-compostos` — Calculadora de juros compostos
- **Tema**: botão sol/lua na barra; preferência salva em `localStorage` (`theme`).

## Desenvolvimento

```bash
npm install
npm run dev
```

## Imagens do carrossel

Coloque os arquivos em `public/storage/` com estes nomes (os mesmos do projeto original):

```
nuvemshop_old.jpeg          nuvemshop_new.jpeg          mercado_livre_new.jpeg
woocommerce.jpeg            sales_agenda_old.jpeg       tree_view_new.png
consolidated_sales_OLD.jpg  financial_management_new.png stock_adjustment_new.png
product_registration_old.jpg product_registration_new.jpeg margin_calculator_new.png
interest_calculator_new.png financial_control_new.png
```

Enquanto uma imagem não existir, o slide mostra "Imagem indisponível". A lista de slides fica em `src/data/slides.js`.

## Deploy no GitHub Pages (gratuito)

1. Crie um repositório no GitHub e envie este projeto para a branch `main`.
2. Em **Settings → Pages → Build and deployment**, escolha **Source: GitHub Actions**.
3. Cada push na `main` roda `.github/workflows/deploy.yml`, que gera o build com
   `VITE_BASE=/<nome-do-repositório>/` e publica a pasta `dist`.

O site fica em `https://<usuario>.github.io/<nome-do-repositório>/`.
Para um repositório `<usuario>.github.io`, troque `VITE_BASE` no workflow por `/`.
