# Portfólio — Igor Merlim (Vue 3)

SPA estática em **Vue 3 + Vite + Tailwind CSS v4**, sem backend. Bilíngue (PT/EN), com tema claro/escuro, animação Three.js e duas calculadoras financeiras.

## Rotas

Usa hash history (`createWebHashHistory`), então funciona no GitHub Pages sem configurar 404/rewrites.

| Rota | Página |
| --- | --- |
| `#/` | Início: hero com animação Three.js, Sobre, Stack, Experiência (carrossel), Projetos, Ferramentas e Contato |
| `#/calculadora-margem` | Calculadora de margem de lucro |
| `#/calculadora-juros-compostos` | Calculadora de juros compostos |

Qualquer outra rota redireciona para `#/`.

## Funcionalidades

- **Tema claro/escuro**: botão sol/lua na barra (`ThemeSwitcher.vue`). Dark mode por classe; a preferência fica salva no `localStorage` (chave `theme`).
- **Bilíngue PT/EN**: botão de idioma na barra (`LanguageSwitcher.vue`), estado global em `src/composables/useIdioma.js`. Salvo no `localStorage` (chave `idioma`, padrão `pt`) e atualiza o `lang` do `<html>`.
  - Textos fixos da interface: `src/data/ui.js`
  - Perfil, experiência e projetos: `src/data/perfil.js` (PT) e `src/data/perfil.en.js` (EN)
  - Slides do carrossel: `src/data/slides.js` (PT) e `src/data/slides.en.js` (EN)
- **Carrossel em cubo 3D**: seção Experiência usa Swiper com `EffectCube`, loop, autoplay de 12 s, setas, paginação e seletor rápido de integrações. Cada face exibe um card técnico vetorial (Architecture Blueprint, sem prints internos por conformidade LGPD), enquanto o painel ao lado acompanha o slide ativo.
- **Projetos**: grade de cards com filtro por stack (2 colunas a partir de `md`; se o total for ímpar, o último fica centralizado). A miniatura preenche o card (`object-cover`); o print inteiro aparece no modal. Projeto sem `imagem` mostra um espaço reservado com ícone.
- **Modal de zoom (lightbox)**: clicar na imagem de um projeto abre a imagem em tela cheia (`ImageLightbox.vue`). Enquanto o modal está aberto, a página não rola.
  - Zoom de 1x a 4x: botões +/−/restaurar, roda do mouse, duplo clique (2x ↔ 1x) ou teclas `+`, `-` e `0`
  - Com zoom, arraste para mover a imagem
  - Fecha com `Esc`, com o botão de fechar ou clicando fora da imagem; o foco volta ao elemento que abriu o modal
- **Foto de perfil**: seção Sobre, em `public/storage/perfil/foto-perfil.jpg` (campo `foto` em `perfil.js`/`perfil.en.js`). Sem foto, aparece um espaço reservado.

## Rodar localmente

Requer Node.js 20+ (o deploy usa Node 22).

```bash
npm install
npm run dev
```

Abra a URL que o Vite mostrar no terminal. Como o `base` padrão é `/portfolio-vue3/`, ela fica assim:

```
http://localhost:5173/portfolio-vue3/
```

Não é preciso baixar nem copiar nenhuma imagem: todas já estão versionadas no repositório (veja abaixo).

## Imagens (`public/storage/`)

Tudo que está em `public/` é servido como está, na raiz do site. As imagens já fazem parte do repositório:

```
public/storage/
├── perfil/
│   └── foto-perfil.jpg                   foto da seção Sobre (src/data/perfil*.js)
└── projetos/                             cards da seção Projetos
    ├── api-financeira.jpeg               (src/data/perfil*.js)
    ├── calculadora-margem.png
    ├── dashboard-financeiro.jpeg
    ├── dms.jpeg
    ├── financial-tools.png
    ├── jogo-memoria.jpeg
    ├── maktub.jpeg
    └── portfolio.jpeg
```

Os arquivos de dados montam o caminho com o `base` do Vite, então a mesma referência funciona no `npm run dev` e no GitHub Pages:

```js
// src/data/slides.js
const img = file => `${import.meta.env.BASE_URL}storage/${file}`;
// src/data/perfil.js
const imgProjeto = file => `${import.meta.env.BASE_URL}storage/projetos/${file}`;
```

**Para trocar ou adicionar uma imagem:**

1. Coloque o arquivo em `public/storage/` (slide) ou `public/storage/projetos/` (projeto).
2. Referencie só o nome do arquivo no item correspondente, **nas duas versões de idioma**:
   - slide: `image: img('meu-arquivo.jpeg')` em `slides.js` e `slides.en.js`
   - projeto: `imagem: imgProjeto('meu-arquivo.jpeg')` em `perfil.js` e `perfil.en.js`
3. Não use caminho absoluto (`/storage/...`): ele quebra no GitHub Pages, onde o site fica em `/portfolio-vue3/`.
4. Prefira JPEG otimizado (ex.: ~800–1600 px de largura). O arquivo vai junto no build, então imagens de vários MB deixam o site lento.

Se um arquivo de slide não existir ou o nome estiver errado, o slide mostra "Imagem indisponível" em vez de quebrar.

## Deploy no GitHub Pages

1. Envie o projeto para a branch `main` de um repositório no GitHub.
2. Em **Settings → Pages → Build and deployment**, escolha **Source: GitHub Actions**.
3. Cada push na `main` roda `.github/workflows/deploy.yml`, que faz o build com `VITE_BASE=/<nome-do-repositório>/` e publica a pasta `dist`.

O site fica em `https://<usuario>.github.io/<nome-do-repositório>/`.

- Fora do workflow, o `base` padrão vem de `vite.config.js` (`/portfolio-vue3/`). Se renomear o repositório, ajuste esse valor ou defina `VITE_BASE`.
- Para um repositório `<usuario>.github.io`, troque `VITE_BASE` no workflow por `/`.

## Estrutura

```
src/
├── views/         Home e as duas calculadoras
├── layouts/       NavBar e Footer
├── components/    inputs, seletores de tema/idioma, animação Three.js (animations/GoldenSpiral.vue)
├── composables/   useIdioma.js (idioma global)
├── data/          textos e conteúdo em PT/EN
├── directives/    v-reveal (animação ao rolar)
├── router/        rotas (hash history)
└── utils/         formatadores
```
