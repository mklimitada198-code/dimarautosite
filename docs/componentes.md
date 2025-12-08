# 🧩 COMPONENTES DO PROJETO DIMAR

**Versão:** 1.0  
**Data de Criação:** 07/12/2024  
**Última Atualização:** 07/12/2024  
**Status:** 📝 Documentação Ativa

---

## 📋 ÍNDICE

1. [Visão Geral](#visão-geral)
2. [Componentes Implementados](#componentes-implementados)
3. [Componentes Planejados](#componentes-planejados)
4. [Guia de Uso](#guia-de-uso)
5. [Anatomia dos Componentes](#anatomia-dos-componentes)

---

## 🎯 VISÃO GERAL

### O que é este documento?
Catálogo completo de todos os componentes UI do projeto Dimar, incluindo:
- Estrutura HTML
- Estilos CSS aplicados
- Funcionalidades JavaScript
- Variações e estados
- Exemplos de uso
- Responsividade

### Status dos Componentes
```
✅ Implementado e Funcional
🔄 Em Desenvolvimento
⏳ Planejado
🔧 Precisa Ajustes
```

---

## 🎨 COMPONENTES IMPLEMENTADOS

### 1. Top Bar (Anúncio)
**Status:** ✅ Implementado  
**Localização:** `index.html` (linhas 16-24)  
**Arquivo CSS:** `css/style.css` (`.top-bar`)

#### Descrição
Barra superior com anúncio de cupom de desconto.

#### HTML
```html
<div class="top-bar">
    <p>🔥 USE O CUPOM <strong>50TAO</strong> E GANHE 50% DE DESCONTO NA SUA PRIMEIRA COMPRA!</p>
</div>
```

#### CSS Principal
```css
.top-bar {
    background: linear-gradient(135deg, #ff6600 0%, #ff8800 100%);
    color: #ffffff;
    text-align: center;
    padding: 12px 20px;
    font-size: 14px;
    font-weight: 500;
}
```

#### Características
- ✅ Gradiente laranja
- ✅ Texto centralizado
- ✅ Totalmente responsivo
- ✅ Cupom em destaque (negrito)

#### Responsividade
```css
@media (max-width: 768px) {
    .top-bar {
        font-size: 12px;
        padding: 10px 15px;
    }
}
```

---

### 2. Navigation Menu
**Status:** ✅ Implementado  
**Localização:** `index.html` (linhas 27-50)  
**Arquivo CSS:** `css/style.css` (`.nav-menu`)

#### Descrição
Menu de navegação principal com 6 links.

#### HTML
```html
<nav class="nav-menu">
    <ul>
        <li><a href="/">HOME</a></li>
        <li><a href="/sobre">SOBRE</a></li>
        <li><a href="/produtos">PRODUTOS</a></li>
        <li><a href="/servicos">SERVIÇOS</a></li>
        <li><a href="/blog">BLOG</a></li>
        <li><a href="/contato">CONTATO</a></li>
    </ul>
</nav>
```

#### CSS Principal
```css
.nav-menu {
    background-color: #000000;
    padding: 0;
}

.nav-menu ul {
    display: flex;
    justify-content: center;
    list-style: none;
    gap: 40px;
}

.nav-menu a {
    color: #ffffff;
    text-decoration: none;
    font-weight: 600;
    transition: color 0.3s ease;
}

.nav-menu a:hover {
    color: #ff6600;
}
```

#### Estados
- **Normal:** Texto branco
- **Hover:** Texto laranja (#ff6600)
- **Active:** (A implementar)

#### Responsividade
```css
@media (max-width: 992px) {
    .nav-menu ul {
        gap: 20px;
        font-size: 13px;
    }
}
```

---

### 3. Header Principal
**Status:** ✅ Implementado  
**Localização:** `index.html` (linhas 53-125)  
**Arquivo CSS:** `css/style.css` (`.header-main`)

#### Descrição
Header complexo com logo, busca, e 4 ações principais.

#### Estrutura
```
Header
├── Logo (esquerda)
├── Barra de Busca (centro)
└── Actions (direita)
    ├── Atendimento
    ├── Login
    ├── Favoritos
    └── Carrinho
```

#### HTML (Simplificado)
```html
<header class="header-main">
    <div class="header-container">
        <!-- Logo -->
        <div class="header-logo">
            <img src="assets/images/logo-dimar.png" alt="Dimar">
        </div>
        
        <!-- Search -->
        <div class="header-search">
            <input type="text" placeholder="Buscar peças...">
            <button><svg>...</svg></button>
        </div>
        
        <!-- Actions -->
        <div class="header-actions">
            <a href="#" class="action-item">...</a>
            <!-- ... -->
        </div>
    </div>
</header>
```

#### Características
- ✅ Logo responsiva
- ✅ Busca com ícone SVG
- ✅ 4 ações com ícones e texto
- ✅ Diagonal stripes decorativas
- ✅ Hover effects em todos os elementos

#### Responsividade
- **Desktop:** Logo + Busca + 4 Ações
- **Tablet (< 1200px):** Logo menor + Busca + Ícones sem texto
- **Mobile (< 768px):** Layout empilhado

---

### 4. Categories Bar
**Status:** ✅ Implementado  
**Localização:** `index.html` (linhas 132-168)  
**Arquivo CSS:** `css/style.css` (`.categories-bar`, `.categories-container`)

#### Descrição
Barra horizontal com dropdown de categorias e links rápidos.

#### HTML
```html
<div class="categories-bar">
    <div class="categories-container">
        <!-- Dropdown Categorias -->
        <div class="categories-dropdown">
            <button class="categories-button">
                <svg>...</svg>
                <span>CATEGORIAS</span>
                <svg class="chevron">...</svg>
            </button>
            <div class="categories-menu">
                <a href="#motor">Motor</a>
                <a href="#freios">Freios</a>
                <!-- ... -->
            </div>
        </div>
        
        <!-- Links Rápidos -->
        <nav class="category-links">
            <a href="#pecas-carros">Peças Carros</a>
            <a href="#pecas-motos">Peças Motos</a>
            <a href="#rastrear-pedido">Rastrear Pedido</a>
            <a href="#nossos-servicos">Nossos Serviços</a>
        </nav>
    </div>
</div>
```

#### Funcionalidade JavaScript
```javascript
// Toggle do dropdown
const categoriesBtn = document.getElementById('categoriesBtn');
const categoriesMenu = document.getElementById('categoriesMenu');

categoriesBtn.addEventListener('click', () => {
    categoriesMenu.classList.toggle('show');
});

// Fecha ao clicar fora
document.addEventListener('click', (e) => {
    if (!categoriesBtn.contains(e.target)) {
        categoriesMenu.classList.remove('show');
    }
});
```

#### Estados
- **Closed:** Menu oculto
- **Open:** Menu visível com animação
- **Hover:** Links mudam de cor

---

### 5. Banner Carousel
**Status:** ✅ Implementado  
**Localização:** `index.html` (linhas 171-217)  
**Arquivo CSS:** `css/style.css` (`.banner-carousel`)

#### Descrição
Carrossel de banners com navegação automática e manual.

#### HTML
```html
<section class="banner-carousel">
    <div class="carousel-container">
        <!-- Slides -->
        <div class="carousel-slides">
            <div class="carousel-slide active">
                <img src="assets/images/bannner01.png" alt="Banner 1">
            </div>
            <div class="carousel-slide">
                <img src="assets/images/bannner02.png" alt="Banner 2">
            </div>
        </div>
        
        <!-- Gradiente Overlay -->
        <div class="banner-gradient"></div>
        
        <!-- Navegação -->
        <button class="carousel-button prev">...</button>
        <button class="carousel-button next">...</button>
        
        <!-- Indicadores -->
        <div class="carousel-indicators">
            <button class="indicator active"></button>
            <button class="indicator"></button>
        </div>
    </div>
</section>
```

#### Funcionalidade JavaScript
```javascript
// Auto-rotate a cada 3 segundos
let currentSlide = 0;
const slides = document.querySelectorAll('.carousel-slide');
const indicators = document.querySelectorAll('.indicator');

function goToSlide(n) {
    slides[currentSlide].classList.remove('active');
    indicators[currentSlide].classList.remove('active');
    currentSlide = (n + slides.length) % slides.length;
    slides[currentSlide].classList.add('active');
    indicators[currentSlide].classList.add('active');
}

// Auto-rotate
let autoRotate = setInterval(() => goToSlide(currentSlide + 1), 3000);

// Pausa ao hover
carousel.addEventListener('mouseenter', () => clearInterval(autoRotate));
carousel.addEventListener('mouseleave', () => {
    autoRotate = setInterval(() => goToSlide(currentSlide + 1), 3000);
});
```

#### Características
- ✅ Auto-rotate (3s)
- ✅ Pausa ao hover
- ✅ Navegação manual (setas)
- ✅ Indicadores sincronizados
- ✅ Transição suave (fade)
- ✅ Gradiente overlay na base

---

### 6. Vehicle Filter
**Status:** ✅ Implementado  
**Localização:** `index.html` (linhas 221-329)  
**Arquivo CSS:** `css/style.css` (`.vehicle-filter-wrapper`)

#### Descrição
Filtro inteligente sobreposto ao banner para busca por veículo.

#### Estrutura
```
Vehicle Filter
├── Tabs (Carro / Moto)
├── Form
│   ├── Select Marca
│   ├── Select Modelo
│   ├── Select Ano
│   └── Button Buscar
```

#### HTML (Simplificado)
```html
<section class="vehicle-filter-wrapper">
    <div class="vehicle-filter-container">
        <h2 class="filter-title">Buscar peças por veículo</h2>
        
        <!-- Tabs -->
        <div class="vehicle-tabs">
            <button class="tab-button active">
                <svg>...</svg> Carro
            </button>
            <button class="tab-button">
                <svg>...</svg> Moto
            </button>
        </div>
        
        <!-- Form -->
        <form class="vehicle-form">
            <select class="vehicle-select" required>
                <option value="">Marca</option>
                <!-- ... -->
            </select>
            <select class="vehicle-select" required>
                <option value="">Modelo</option>
            </select>
            <select class="vehicle-select" required>
                <option value="">Ano</option>
            </select>
            <button type="submit" class="search-button">BUSCAR</button>
        </form>
    </div>
</section>
```

#### Funcionalidade JavaScript
```javascript
// Alternância de tabs
const tabButtons = document.querySelectorAll('.tab-button');
tabButtons.forEach(button => {
    button.addEventListener('click', function() {
        tabButtons.forEach(btn => btn.classList.remove('active'));
        this.classList.add('active');
        // Reset form
        document.querySelector('.vehicle-form').reset();
    });
});

// Cascata de selects (Marca → Modelo → Ano)
// Implementação futura com dados reais
```

#### Características
- ✅ Overlay sobre o banner
- ✅ Tabs funcionais (Carro/Moto)
- ✅ Selects em cascata
- ✅ Validação de campos
- ✅ Botão de busca destacado
- ✅ Responsivo (mobile vertical)

---

### 7. Product Card (Ofertas)
**Status:** ✅ Implementado  
**Localização:** `index.html` (linhas 334-420)  
**Arquivo CSS:** `css/style.css` (`.product-card`)

#### Descrição
Card de produto com hover effect e botão de compra.

#### HTML
```html
<div class="product-card">
    <!-- Imagem -->
    <div class="product-image">
        <img src="assets/images/produto-1.jpg" alt="Produto">
        <span class="product-badge product-badge-featured">DESTAQUE</span>
    </div>
    
    <!-- Entrega (Topo) -->
    <div class="product-shipping-top">
        <svg>...</svg>
        <span>Produto com entrega RÁPIDA</span>
    </div>
    
    <!-- Informações -->
    <div class="product-info">
        <h3 class="product-name">Parachoque Dianteiro Ford Ka 2015</h3>
        <div class="product-pricing">
            <span class="product-price-old">R$ 899,90</span>
            <span class="product-price">R$ 699,90</span>
            <span class="product-installment">ou 10x de R$ 69,99 sem juros</span>
        </div>
    </div>
    
    <!-- Espaço para Botão (aparece no hover) -->
    <div class="product-button-space">
        <button class="product-buy-button">
            <svg>...</svg> COMPRAR
        </button>
    </div>
</div>
```

#### CSS Hover Effect
```css
.product-card {
    transition: all 0.3s ease;
}

.product-card:hover {
    transform: translateY(-8px);
    box-shadow: 0 12px 30px rgba(0, 0, 0, 0.15);
}

.product-buy-button {
    opacity: 0;
    transform: translateY(20px);
    transition: all 0.3s ease;
}

.product-card:hover .product-buy-button {
    opacity: 1;
    transform: translateY(0);
}
```

#### Badges
- `product-badge-featured`: DESTAQUE (laranja)
- `product-badge-sale`: OFERTA (verde)
- `product-badge-trending`: MAIS VENDIDO (azul)

#### Características
- ✅ Imagem centralizada
- ✅ Badge de destaque
- ✅ Preço riscado + preço atual
- ✅ Parcelamento
- ✅ Ícone de entrega rápida
- ✅ Botão aparece no hover
- ✅ Animação suave

---

### 8. Categories Carousel (Seção Meio)
**Status:** ✅ Implementado  
**Localização:** `index.html` (linhas 453-520)  
**Arquivo CSS:** `css/style.css` (`.categories-section`)

#### Descrição
Carrossel horizontal de categorias com imagens e navegação.

#### HTML (Simplificado)
```html
<section class="categories-section">
    <div class="categories-content-wrapper">
        <h2 class="categories-title">Categorias</h2>
        
        <div class="categories-carousel-wrapper">
            <!-- Botão Anterior -->
            <button class="categories-nav-button prev">
                <svg>...</svg>
            </button>
            
            <!-- Carrossel -->
            <div class="categories-carousel">
                <div class="category-item">
                    <div class="category-image">
                        <img src="assets/images/cat_parachoque_dianteiro.png" alt="Parachoque Dianteiro">
                    </div>
                    <h3 class="category-name">Parachoque<br>Dianteiro</h3>
                </div>
                <!-- Mais categorias... -->
            </div>
            
            <!-- Botão Próximo -->
            <button class="categories-nav-button next">
                <svg>...</svg>
            </button>
        </div>
        
        <!-- Indicadores -->
        <div class="categories-indicators">
            <button class="indicator active"></button>
            <button class="indicator"></button>
            <button class="indicator"></button>
        </div>
    </div>
</section>
```

#### Funcionalidade JavaScript
```javascript
// Navegação do carrossel
const carousel = document.querySelector('.categories-carousel');
const prevBtn = document.querySelector('.categories-nav-button.prev');
const nextBtn = document.querySelector('.categories-nav-button.next');

const itemWidth = 200; // largura do item + gap

nextBtn.addEventListener('click', () => {
    carousel.scrollBy({ left: itemWidth * 3, behavior: 'smooth' });
});

prevBtn.addEventListener('click', () => {
    carousel.scrollBy({ left: -itemWidth * 3, behavior: 'smooth' });
});
```

#### Características
- ✅ Scroll horizontal suave
- ✅ Navegação com setas
- ✅ Indicadores de posição
- ✅ Hover effect nas categorias
- ✅ Título centralizado acima
- ✅ Imagens com drop-shadow

---

### 9. Brands Carousel (Marcas Parceiras)
**Status:** ✅ Implementado  
**Localização:** `index.html` (linhas 524-605)  
**Arquivo CSS:** `css/style.css` (`.brands-section`)

#### Descrição
Dois carrosséis infinitos de logos de marcas (um para esquerda, outro para direita).

#### HTML (Simplificado)
```html
<section class="brands-section">
    <div class="brands-container">
        <h2 class="brands-title">Marcas Parceiras</h2>
        <p class="brands-subtitle">Trabalhamos com as melhores marcas</p>
        
        <!-- Carrossel Superior (Esquerda) -->
        <div class="brands-carousel-row">
            <div class="brands-carousel brands-carousel-left">
                <!-- Set 1 -->
                <div class="brand-item">
                    <img src="assets/images/bosch.png" alt="Bosch">
                </div>
                <!-- Mais marcas... -->
                
                <!-- Set 2 (Duplicata) -->
                <!-- Set 3 (Garantia de looping) -->
            </div>
        </div>
        
        <!-- Carrossel Inferior (Direita) -->
        <div class="brands-carousel-row">
            <div class="brands-carousel brands-carousel-right">
                <!-- Mesma estrutura -->
            </div>
        </div>
    </div>
</section>
```

#### CSS Animação
```css
@keyframes scrollLeft {
    0% {
        transform: translateX(0);
    }
    100% {
        transform: translateX(-33.333%);
    }
}

@keyframes scrollRight {
    0% {
        transform: translateX(-33.333%);
    }
    100% {
        transform: translateX(0);
    }
}

.brands-carousel-left {
    animation: scrollLeft 30s linear infinite;
}

.brands-carousel-right {
    animation: scrollRight 30s linear infinite;
}
```

#### Características
- ✅ Looping infinito perfeito (3 sets de logos)
- ✅ Sem início/fim visível
- ✅ 2 carrosséis (direções opostas)
- ✅ Logos em grayscale → colorido no hover
- ✅ Gradiente fade nas bordas
- ✅ Pausa ao hover
- ✅ 9 marcas: Bosch, NGK, Toyota, Fiat, Hyundai, Ford, Tete, Mobil, Dayco

---

### 10. Footer
**Status:** ✅ Implementado  
**Localização:** `index.html` (linhas 610-708)  
**Arquivo CSS:** `css/style.css` (`.main-footer`)

#### Descrição
Footer completo e profissional com 5 colunas e seção inferior.

#### Estrutura
```
Footer
├── Footer Content (5 colunas)
│   ├── Institucional
│   ├── Atendimento
│   ├── Informações
│   ├── Contato
│   └── Newsletter
└── Footer Bottom
    ├── Copyright
    ├── Formas de Pagamento
    └── Badges (Segurança)
```

#### HTML (Simplificado)
```html
<footer class="main-footer">
    <div class="footer-content">
        <!-- Coluna 1: Institucional -->
        <div class="footer-column">
            <h3 class="footer-title">Institucional</h3>
            <ul class="footer-links">
                <li><a href="#">Sobre a Dimar</a></li>
                <li><a href="#">Nossas Lojas</a></li>
                <!-- ... -->
            </ul>
        </div>
        
        <!-- Coluna 2-4: Outros links -->
        
        <!-- Coluna 5: Newsletter -->
        <div class="footer-column">
            <h3 class="footer-title">Newsletter</h3>
            <form class="newsletter-form">
                <input type="email" placeholder="Seu e-mail">
                <button type="submit">ASSINAR</button>
            </form>
            
            <!-- Redes Sociais -->
            <div class="footer-social">
                <a href="#"><svg>...</svg></a>
                <!-- ... -->
            </div>
        </div>
    </div>
    
    <!-- Footer Bottom -->
    <div class="footer-bottom">
        <p>&copy; 2024 Dimar Auto Peças. Todos os direitos reservados.</p>
        
        <div class="footer-payment">
            <!-- Ícones de pagamento -->
        </div>
        
        <div class="footer-badges">
            <div class="badge-item">🔒 Site Seguro</div>
            <div class="badge-item">✓ Compra Protegida</div>
        </div>
    </div>
</footer>
```

#### Características
- ✅ 5 colunas organizadas
- ✅ Links categorizados
- ✅ Newsletter funcional
- ✅ Redes sociais com hover
- ✅ Formas de pagamento exibidas
- ✅ Badges de segurança
- ✅ Totalmente responsivo (5 → 3 → 2 → 1 coluna)

---

## ⏳ COMPONENTES PLANEJADOS

### 11. Breadcrumbs
**Status:** ⏳ Planejado  
**Prioridade:** ALTA  
**Fase:** 2

```html
<nav class="breadcrumbs">
    <a href="/">Home</a>
    <span>/</span>
    <a href="/produtos">Produtos</a>
    <span>/</span>
    <span class="current">Parachoque Dianteiro</span>
</nav>
```

---

### 12. Pagination
**Status:** ⏳ Planejado  
**Prioridade:** ALTA  
**Fase:** 3

```html
<div class="pagination">
    <button class="page-button" disabled>« Anterior</button>
    <button class="page-number active">1</button>
    <button class="page-number">2</button>
    <button class="page-number">3</button>
    <button class="page-button">Próximo »</button>
</div>
```

---

### 13. Filters Sidebar
**Status:** ⏳ Planejado  
**Prioridade:** ALTA  
**Fase:** 3

```html
<aside class="filters-sidebar">
    <div class="filter-group">
        <h3>Categoria</h3>
        <label><input type="checkbox"> Motor (45)</label>
        <label><input type="checkbox"> Freios (32)</label>
        <!-- ... -->
    </div>
    
    <div class="filter-group">
        <h3>Preço</h3>
        <input type="range" min="0" max="1000">
        <span>R$ 0 - R$ 1000</span>
    </div>
</aside>
```

---

### 14. Cart Dropdown
**Status:** ⏳ Planejado  
**Prioridade:** ALTA  
**Fase:** 3

```html
<div class="cart-dropdown">
    <div class="cart-items">
        <div class="cart-item">
            <img src="produto.jpg" alt="Produto">
            <div class="cart-item-info">
                <h4>Parachoque Dianteiro</h4>
                <span>R$ 699,90</span>
            </div>
            <button class="remove-item">×</button>
        </div>
    </div>
    
    <div class="cart-total">
        <span>Total:</span>
        <strong>R$ 699,90</strong>
    </div>
    
    <button class="cart-checkout">Finalizar Compra</button>
</div>
```

---

### 15. Modal
**Status:** ⏳ Planejado  
**Prioridade:** MÉDIA  
**Fase:** 4

```html
<div class="modal">
    <div class="modal-overlay"></div>
    <div class="modal-content">
        <button class="modal-close">×</button>
        <h2 class="modal-title">Título do Modal</h2>
        <div class="modal-body">
            <!-- Conteúdo -->
        </div>
        <div class="modal-footer">
            <button class="btn-secondary">Cancelar</button>
            <button class="btn-primary">Confirmar</button>
        </div>
    </div>
</div>
```

---

### 16. Toast Notification
**Status:** ⏳ Planejado  
**Prioridade:** MÉDIA  
**Fase:** 4

```html
<div class="toast toast-success">
    <svg>...</svg>
    <span>Produto adicionado ao carrinho!</span>
    <button class="toast-close">×</button>
</div>
```

---

### 17. Loading Spinner
**Status:** ⏳ Planejado  
**Prioridade:** MÉDIA  
**Fase:** 3

```html
<div class="loading-spinner">
    <div class="spinner"></div>
    <span>Carregando...</span>
</div>
```

---

### 18. Tabs Component
**Status:** ⏳ Planejado  
**Prioridade:** ALTA  
**Fase:** 3 (Página de Produto)

```html
<div class="tabs">
    <div class="tabs-nav">
        <button class="tab-button active">Descrição</button>
        <button class="tab-button">Especificações</button>
        <button class="tab-button">Avaliações</button>
    </div>
    
    <div class="tabs-content">
        <div class="tab-panel active">
            <!-- Descrição -->
        </div>
        <div class="tab-panel">
            <!-- Especificações -->
        </div>
        <div class="tab-panel">
            <!-- Avaliações -->
        </div>
    </div>
</div>
```

---

### 19. Image Gallery (Zoom)
**Status:** ⏳ Planejado  
**Prioridade:** ALTA  
**Fase:** 3 (Página de Produto)

```html
<div class="image-gallery">
    <div class="gallery-main">
        <img src="produto-1.jpg" alt="Produto">
        <button class="zoom-button">🔍</button>
    </div>
    
    <div class="gallery-thumbnails">
        <button class="thumbnail active">
            <img src="produto-1-thumb.jpg" alt="Imagem 1">
        </button>
        <button class="thumbnail">
            <img src="produto-2-thumb.jpg" alt="Imagem 2">
        </button>
        <!-- ... -->
    </div>
</div>
```

---

### 20. Rating Stars
**Status:** ⏳ Planejado  
**Prioridade:** MÉDIA  
**Fase:** 3

```html
<div class="rating-stars">
    <svg class="star filled">...</svg>
    <svg class="star filled">...</svg>
    <svg class="star filled">...</svg>
    <svg class="star filled">...</svg>
    <svg class="star">...</svg>
    <span class="rating-text">(4.0 - 125 avaliações)</span>
</div>
```

---

## 📚 GUIA DE USO

### Como Usar Este Documento

#### 1. Ao Criar Nova Página
```
✅ Consulte componentes existentes
✅ Reutilize estrutura e estilos
✅ Mantenha consistência visual
✅ Documente novos componentes aqui
```

#### 2. Ao Modificar Componente
```
✅ Verifique impacto em todas as páginas
✅ Atualize documentação
✅ Teste responsividade
✅ Registre decisão em decisions.md
```

#### 3. Ao Adicionar Variação
```
✅ Siga padrão de nomenclatura (--modificador)
✅ Documente variação aqui
✅ Adicione exemplo de uso
✅ Teste em contextos diferentes
```

---

## 🔧 ANATOMIA DOS COMPONENTES

### Estrutura Padrão

#### HTML
```html
<!-- Container Principal -->
<section class="component-name">
    <!-- Wrapper (se necessário) -->
    <div class="component-wrapper">
        <!-- Conteúdo -->
        <div class="component-content">
            <!-- Elementos internos -->
        </div>
    </div>
</section>
```

#### CSS
```css
/* Componente Base */
.component-name {
    /* Layout */
    /* Typography */
    /* Visual */
    /* Misc */
}

/* Elementos */
.component-name-element {
    /* ... */
}

/* Modificadores */
.component-name--variant {
    /* ... */
}

/* Estados */
.component-name.is-active {
    /* ... */
}

/* Responsivo */
@media (max-width: 768px) {
    .component-name {
        /* Mobile styles */
    }
}
```

#### JavaScript (se necessário)
```javascript
// Seleção de elementos
const component = document.querySelector('.component-name');
const elements = component.querySelectorAll('.component-element');

// Event listeners
component.addEventListener('click', handleClick);

// Funções
function handleClick(event) {
    // Lógica aqui
}
```

---

## 📊 ESTATÍSTICAS

### Componentes por Status
```
✅ Implementados: 10
⏳ Planejados: 10
Total: 20
```

### Componentes por Prioridade
```
🔴 ALTA: 8
🟡 MÉDIA: 5
🟢 BAIXA: 0
```

### Componentes por Fase
```
Fase 0-1: 10 (100%)
Fase 2: 1 (0%)
Fase 3: 7 (0%)
Fase 4: 2 (0%)
```

---

## 🔄 ATUALIZAÇÕES

### Log de Alterações

#### 07/12/2024 - 23:00
- ✅ Documento criado
- ✅ 10 componentes implementados documentados
- ✅ 10 componentes planejados adicionados
- ✅ Guias de uso incluídos
- ✅ Anatomia padrão definida

---

**📌 Última Atualização:** 07/12/2024 - 23:00  
**📊 Versão:** 1.0  
**🎯 Próxima Revisão:** Após implementação da Fase 2

> **Nota:** Este documento deve ser atualizado sempre que um novo componente for criado ou um existente for modificado.
