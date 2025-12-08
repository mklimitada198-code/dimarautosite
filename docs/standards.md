# 📐 PADRÕES DE DESENVOLVIMENTO - PROJETO DIMAR

**Versão:** 1.0  
**Data de Criação:** 07/12/2024  
**Última Atualização:** 07/12/2024

---

## 📋 ÍNDICE

1. [Visão Geral](#visão-geral)
2. [Padrões de HTML](#padrões-de-html)
3. [Padrões de CSS](#padrões-de-css)
4. [Padrões de JavaScript](#padrões-de-javascript)
5. [Padrões de Nomenclatura](#padrões-de-nomenclatura)
6. [Padrões de Responsividade](#padrões-de-responsividade)
7. [Padrões de Acessibilidade](#padrões-de-acessibilidade)
8. [Padrões de Performance](#padrões-de-performance)
9. [Padrões de SEO](#padrões-de-seo)
10. [Padrões de Commits](#padrões-de-commits)

---

## 🎯 VISÃO GERAL

### Objetivo
Garantir que todo código desenvolvido para o projeto Dimar seja:
- **Consistente:** Mesmo estilo em todo o projeto
- **Manutenível:** Fácil de entender e modificar
- **Escalável:** Preparado para crescer
- **Performático:** Rápido e eficiente
- **Acessível:** Utilizável por todos

### Princípios Fundamentais

#### 1. Simplicidade
```
✅ Prefira soluções simples e diretas
❌ Evite over-engineering
```

#### 2. Consistência
```
✅ Siga os padrões existentes
❌ Não crie padrões conflitantes
```

#### 3. Legibilidade
```
✅ Código deve ser fácil de ler
❌ Não sacrifique clareza por brevidade
```

#### 4. DRY (Don't Repeat Yourself)
```
✅ Reutilize código quando possível
❌ Evite duplicação desnecessária
```

---

## 📄 PADRÕES DE HTML

### Estrutura Geral

#### Indentação
```html
<!-- ✅ CORRETO: 4 espaços -->
<section class="products">
    <div class="container">
        <h2 class="title">Produtos</h2>
        <div class="grid">
            <div class="product-card">
                <img src="..." alt="...">
            </div>
        </div>
    </div>
</section>

<!-- ❌ ERRADO: Tabs ou 2 espaços -->
<section class="products">
  <div class="container">
    <h2>Produtos</h2>
  </div>
</section>
```

#### Semântica
```html
<!-- ✅ CORRETO: Tags semânticas -->
<header>
    <nav>
        <ul>
            <li><a href="#">Link</a></li>
        </ul>
    </nav>
</header>

<main>
    <section>
        <article>
            <h1>Título</h1>
            <p>Conteúdo...</p>
        </article>
    </section>
</main>

<footer>
    <p>&copy; 2024 Dimar</p>
</footer>

<!-- ❌ ERRADO: Divs genéricas -->
<div class="header">
    <div class="nav">
        <div class="menu">...</div>
    </div>
</div>
```

#### Atributos

**Ordem dos Atributos:**
1. `class`
2. `id`
3. `data-*`
4. `src`, `href`, `for`, `type`, `value`
5. `alt`, `title`, `aria-*`
6. Outros

```html
<!-- ✅ CORRETO -->
<img class="product-image" 
     id="product-1" 
     src="product.jpg" 
     alt="Parachoque Dianteiro"
     loading="lazy">

<!-- ❌ ERRADO: Ordem aleatória -->
<img alt="Produto" 
     src="product.jpg" 
     id="product-1" 
     class="product-image">
```

#### Comentários
```html
<!-- ==================== Section Name ==================== -->
<section class="section-name">
    <!-- Sub-section comment -->
    <div class="sub-section">
        ...
    </div>
</section>
```

---

## 🎨 PADRÕES DE CSS

### Estrutura de Arquivos

#### Organização do style.css
```css
/* ==================== IMPORTS ==================== */
@import url('...');

/* ==================== VARIABLES ==================== */
:root {
    --color-primary: #ff6600;
    /* ... */
}

/* ==================== RESET ==================== */
* { margin: 0; padding: 0; }

/* ==================== GLOBAL ==================== */
body { ... }

/* ==================== LAYOUT ==================== */
.container { ... }

/* ==================== COMPONENTS ==================== */
/* Component Name */
.component { ... }

/* ==================== RESPONSIVE ==================== */
@media (max-width: 992px) { ... }
```

### Nomenclatura de Classes (BEM Modificado)

#### Padrão
```css
/* Bloco */
.product-card { }

/* Elemento */
.product-card-image { }
.product-card-title { }
.product-card-price { }

/* Modificador */
.product-card--featured { }
.product-card--sale { }

/* Estado */
.product-card.is-active { }
.product-card.is-loading { }
```

#### Exemplos
```css
/* ✅ CORRETO */
.header { }
.header-logo { }
.header-nav { }
.header-nav-item { }
.header-nav-link { }
.header-nav-link--active { }

/* ❌ ERRADO */
.Header { }
.headerLogo { }
.header_logo { }
.hlgo { }
```

### Propriedades CSS

#### Ordem das Propriedades
1. **Positioning:** `position`, `top`, `right`, `bottom`, `left`, `z-index`
2. **Display & Box Model:** `display`, `flex`, `grid`, `width`, `height`, `margin`, `padding`
3. **Typography:** `font-*`, `text-*`, `line-height`, `letter-spacing`
4. **Visual:** `background`, `border`, `border-radius`, `box-shadow`
5. **Misc:** `opacity`, `transform`, `transition`, `animation`

```css
/* ✅ CORRETO */
.product-card {
    /* Positioning */
    position: relative;
    z-index: 1;
    
    /* Display & Box Model */
    display: flex;
    flex-direction: column;
    width: 280px;
    padding: 20px;
    margin: 0 15px;
    
    /* Typography */
    font-family: 'Inter', sans-serif;
    text-align: center;
    
    /* Visual */
    background: #ffffff;
    border: 1px solid #e0e0e0;
    border-radius: 12px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    
    /* Misc */
    transition: all 0.3s ease;
}

/* ❌ ERRADO: Ordem aleatória */
.product-card {
    transition: all 0.3s;
    background: #fff;
    position: relative;
    font-family: 'Inter';
    width: 280px;
}
```

#### Valores

**Cores:**
```css
/* ✅ CORRETO */
.element {
    color: #ff6600;              /* Hexadecimal completo */
    background: rgba(0,0,0,0.5); /* RGBA para transparência */
}

/* ❌ ERRADO */
.element {
    color: #f60;                 /* Hexadecimal abreviado */
    background: orange;          /* Nome de cor */
}
```

**Unidades:**
```css
/* ✅ CORRETO */
.element {
    width: 100%;                 /* Porcentagem */
    padding: 20px;               /* Pixels para espaçamentos fixos */
    font-size: 16px;             /* Pixels para fontes base */
    line-height: 1.5;            /* Sem unidade para line-height */
}

/* ❌ ERRADO */
.element {
    width: 100vw;                /* Causa scroll horizontal */
    padding: 2em;                /* EM para espaçamentos */
}
```

### Responsividade

#### Breakpoints Padrão
```css
/* Mobile First Approach */

/* Extra Small Devices (< 480px) */
/* Estilos base aqui */

/* Small Devices (480px - 767px) */
@media (min-width: 480px) {
    /* ... */
}

/* Medium Devices (768px - 991px) */
@media (min-width: 768px) {
    /* ... */
}

/* Large Devices (992px - 1199px) */
@media (min-width: 992px) {
    /* ... */
}

/* Extra Large Devices (1200px - 1399px) */
@media (min-width: 1200px) {
    /* ... */
}

/* XXL Devices (≥ 1400px) */
@media (min-width: 1400px) {
    /* ... */
}
```

---

## ⚡ PADRÕES DE JAVASCRIPT

### Estilo de Código

#### Nomenclatura
```javascript
// ✅ CORRETO
const userName = 'João';              // camelCase para variáveis
const MAX_ITEMS = 10;                 // UPPER_CASE para constantes
function getUserData() { }            // camelCase para funções
class ProductCard { }                 // PascalCase para classes

// ❌ ERRADO
const user_name = 'João';
const maxitems = 10;
function GetUserData() { }
class productCard { }
```

#### Variáveis
```javascript
// ✅ CORRETO: Const por padrão, let quando necessário
const apiUrl = 'https://api.example.com';
let counter = 0;

// ❌ ERRADO: Var
var data = {};
```

#### Funções
```javascript
// ✅ CORRETO: Arrow functions para callbacks
const numbers = [1, 2, 3];
const doubled = numbers.map(n => n * 2);

// ✅ CORRETO: Function declaration para funções reutilizáveis
function calculateTotal(items) {
    return items.reduce((sum, item) => sum + item.price, 0);
}

// ❌ ERRADO: Função anônima
const calc = function(x) { return x * 2; };
```

### Manipulação do DOM

#### Seletores
```javascript
// ✅ CORRETO: Cache de seletores
const carousel = document.querySelector('.carousel');
const slides = carousel.querySelectorAll('.slide');
const nextBtn = document.getElementById('nextBtn');

// ❌ ERRADO: Seleção repetida
document.querySelector('.carousel').style.display = 'block';
document.querySelector('.carousel').classList.add('active');
```

#### Event Listeners
```javascript
// ✅ CORRETO: Funções nomeadas
function handleClick(event) {
    event.preventDefault();
    // lógica aqui
}

button.addEventListener('click', handleClick);

// ❌ ERRADO: Função anônima inline muito longa
button.addEventListener('click', function(e) {
    e.preventDefault();
    // 50 linhas de código aqui...
});
```

### Comentários
```javascript
// ==================== Carousel Logic ====================

/**
 * Navega para o próximo slide do carrossel
 * @param {number} direction - Direção (1 = próximo, -1 = anterior)
 */
function navigateCarousel(direction) {
    // Calcula o novo índice
    currentSlide += direction;
    
    // Loop infinito
    if (currentSlide >= totalSlides) currentSlide = 0;
    if (currentSlide < 0) currentSlide = totalSlides - 1;
    
    updateCarousel();
}
```

---

## 📛 PADRÕES DE NOMENCLATURA

### Arquivos e Pastas

#### Estrutura
```
projeto/
├── index.html                    (kebab-case)
├── produtos.html
├── sobre-nos.html
├── css/
│   ├── style.css                (kebab-case)
│   └── responsive.css
├── js/
│   ├── script.js                (kebab-case)
│   ├── carousel.js
│   └── cart.js
├── assets/
│   ├── images/
│   │   ├── logo-dimar.png       (kebab-case)
│   │   ├── banner-principal.jpg
│   │   └── produto-123.jpg
│   └── icons/
│       ├── cart-icon.svg
│       └── search-icon.svg
└── docs/
    ├── memory.md                (kebab-case)
    └── plan.md
```

### IDs e Classes

#### IDs
```html
<!-- ✅ CORRETO: IDs únicos e descritivos -->
<div id="mainCarousel">
<button id="checkoutBtn">
<form id="newsletterForm">

<!-- ❌ ERRADO -->
<div id="carousel1">
<button id="btn">
<form id="form">
```

#### Classes
```html
<!-- ✅ CORRETO: Classes descritivas -->
<div class="product-card">
<button class="btn-primary">
<section class="brands-section">

<!-- ❌ ERRADO -->
<div class="pc">
<button class="btn1">
<section class="section2">
```

---

## 📱 PADRÕES DE RESPONSIVIDADE

### Princípios

#### Mobile First
```css
/* ✅ CORRETO: Estilos mobile primeiro */
.product-grid {
    display: grid;
    grid-template-columns: 1fr;  /* Mobile: 1 coluna */
    gap: 20px;
}

@media (min-width: 768px) {
    .product-grid {
        grid-template-columns: repeat(2, 1fr);  /* Tablet: 2 colunas */
    }
}

@media (min-width: 1200px) {
    .product-grid {
        grid-template-columns: repeat(4, 1fr);  /* Desktop: 4 colunas */
    }
}

/* ❌ ERRADO: Desktop primeiro */
.product-grid {
    grid-template-columns: repeat(4, 1fr);
}

@media (max-width: 767px) {
    .product-grid {
        grid-template-columns: 1fr;
    }
}
```

#### Testes Obrigatórios
```
Testar em TODOS estes tamanhos:
✅ 320px (iPhone SE)
✅ 375px (iPhone X/11/12)
✅ 768px (iPad Portrait)
✅ 1024px (iPad Landscape)
✅ 1366px (Laptop)
✅ 1920px (Desktop Full HD)
```

---

## ♿ PADRÕES DE ACESSIBILIDADE

### HTML Semântico
```html
<!-- ✅ CORRETO -->
<nav aria-label="Navegação principal">
    <ul>
        <li><a href="/">Home</a></li>
    </ul>
</nav>

<button aria-label="Fechar modal">
    <svg>...</svg>
</button>

<img src="produto.jpg" alt="Parachoque dianteiro Ford Ka 2015">

<!-- ❌ ERRADO -->
<div class="nav">
    <span onclick="navigate()">Home</span>
</div>

<div onclick="closeModal()">X</div>

<img src="produto.jpg" alt="produto">
```

### Contraste de Cores
```css
/* ✅ CORRETO: Contraste mínimo 4.5:1 para texto */
.text {
    color: #333333;              /* Contraste 12.6:1 */
    background: #ffffff;
}

/* ⚠️ ALERTA: Contraste insuficiente */
.text-gray {
    color: #999999;              /* Contraste 2.8:1 - FALHA */
    background: #ffffff;
}
```

### Navegação por Teclado
```css
/* ✅ CORRETO: Focus visível */
a:focus,
button:focus,
input:focus {
    outline: 2px solid #ff6600;
    outline-offset: 2px;
}

/* ❌ ERRADO: Removendo outline sem alternativa */
*:focus {
    outline: none;
}
```

---

## 🚀 PADRÕES DE PERFORMANCE

### Imagens

#### Formatos
```
✅ WebP para fotos (melhor compressão)
✅ SVG para ícones e logos (escalável)
✅ PNG para imagens com transparência
❌ Evite GIF (use video/webp animado)
```

#### Otimização
```html
<!-- ✅ CORRETO -->
<img src="produto.webp" 
     alt="Produto" 
     loading="lazy"
     width="280" 
     height="280">

<!-- ❌ ERRADO -->
<img src="produto-original-5mb.jpg" alt="Produto">
```

### CSS

#### Minificação
```css
/* Desenvolvimento: Legível */
.product-card {
    display: flex;
    padding: 20px;
    background: #ffffff;
}

/* Produção: Minificado */
.product-card{display:flex;padding:20px;background:#fff}
```

#### Critical CSS
```html
<!-- ✅ CORRETO: CSS crítico inline -->
<head>
    <style>
        /* CSS crítico acima da dobra */
        body { margin: 0; font-family: Inter; }
        .header { background: #000; }
    </style>
    <link rel="stylesheet" href="style.css">
</head>
```

### JavaScript

#### Defer e Async
```html
<!-- ✅ CORRETO: Defer para scripts que dependem do DOM -->
<script src="script.js" defer></script>

<!-- ✅ CORRETO: Async para scripts independentes -->
<script src="analytics.js" async></script>

<!-- ❌ ERRADO: Bloqueia renderização -->
<script src="script.js"></script>
```

---

## 🔍 PADRÕES DE SEO

### Meta Tags Obrigatórias
```html
<head>
    <!-- Básico -->
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Título da Página (50-60 caracteres) | Dimar</title>
    <meta name="description" content="Descrição (150-160 caracteres)">
    
    <!-- Open Graph -->
    <meta property="og:title" content="Título da Página">
    <meta property="og:description" content="Descrição">
    <meta property="og:image" content="https://dimar.com/og-image.jpg">
    <meta property="og:url" content="https://dimar.com/pagina">
    
    <!-- Twitter Card -->
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:title" content="Título da Página">
    <meta name="twitter:description" content="Descrição">
    <meta name="twitter:image" content="https://dimar.com/twitter-image.jpg">
    
    <!-- Canonical -->
    <link rel="canonical" href="https://dimar.com/pagina">
</head>
```

### Heading Hierarchy
```html
<!-- ✅ CORRETO -->
<h1>Título Principal da Página</h1>
    <h2>Seção 1</h2>
        <h3>Subseção 1.1</h3>
        <h3>Subseção 1.2</h3>
    <h2>Seção 2</h2>

<!-- ❌ ERRADO -->
<h3>Título Principal</h3>
<h1>Subtítulo</h1>
<h2>Outro subtítulo</h2>
```

---

## 📝 PADRÕES DE COMMITS

### Formato
```
tipo(escopo): descrição curta

Descrição detalhada (opcional)

Closes #123
```

### Tipos
```
feat:     Nova funcionalidade
fix:      Correção de bug
docs:     Documentação
style:    Formatação, espaços (não afeta código)
refactor: Refatoração de código
perf:     Melhoria de performance
test:     Testes
chore:    Tarefas de build, configs
```

### Exemplos
```bash
# ✅ CORRETO
git commit -m "feat(carousel): adiciona navegação por setas"
git commit -m "fix(header): corrige menu mobile"
git commit -m "docs(readme): atualiza instruções de instalação"

# ❌ ERRADO
git commit -m "atualização"
git commit -m "fix bug"
git commit -m "mudanças várias"
```

---

## 🔄 PROCESSO DE REVISÃO

### Checklist Antes de Commitar

```
✅ Código funciona corretamente
✅ Não há console.log() desnecessários
✅ Código está comentado (onde necessário)
✅ Segue os padrões deste documento
✅ Testado em múltiplos navegadores
✅ Testado em múltiplos tamanhos de tela
✅ Validação HTML sem erros críticos
✅ CSS válido
✅ JavaScript sem erros no console
✅ Performance não degradada
✅ Acessibilidade mantida/melhorada
```

---

## 📚 REFERÊNCIAS

### Documentação Oficial
- [MDN Web Docs](https://developer.mozilla.org/)
- [W3C Standards](https://www.w3.org/standards/)
- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)

### Ferramentas de Validação
- HTML: [W3C Validator](https://validator.w3.org/)
- CSS: [CSS Validator](https://jigsaw.w3.org/css-validator/)
- Acessibilidade: [WAVE](https://wave.webaim.org/)
- Performance: [PageSpeed Insights](https://pagespeed.web.dev/)

---

## 📊 MÉTRICAS DE QUALIDADE

### Objetivos do Projeto

#### Performance
```
✅ PageSpeed Score: > 90
✅ First Contentful Paint: < 1.5s
✅ Time to Interactive: < 3.5s
✅ Largest Contentful Paint: < 2.5s
✅ Cumulative Layout Shift: < 0.1
```

#### Acessibilidade
```
✅ WCAG 2.1 Level AA
✅ Lighthouse Accessibility: > 95
✅ Contrast Ratio: ≥ 4.5:1 (texto normal)
✅ Contrast Ratio: ≥ 3:1 (texto grande)
```

#### SEO
```
✅ Lighthouse SEO: > 95
✅ Mobile-Friendly Test: Pass
✅ Structured Data: Válido
✅ Meta Tags: Completas
```

---

## 🔧 FERRAMENTAS RECOMENDADAS

### Editores
- VS Code com extensões:
  - Prettier
  - ESLint
  - HTML CSS Support
  - Auto Rename Tag

### Navegadores (Testes)
- Chrome/Edge (DevTools)
- Firefox (Developer Edition)
- Safari (Webkit)

### Performance
- Lighthouse (Chrome DevTools)
- WebPageTest
- GTmetrix

---

**📌 Última Atualização:** 07/12/2024  
**📊 Versão:** 1.0  
**🎯 Status:** Ativo

> **Nota:** Este documento está vivo e deve ser atualizado conforme o projeto evolui e novos padrões são estabelecidos.
