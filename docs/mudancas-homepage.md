# 🏠 Mudanças na Homepage - Dimar Auto Peças

**Versão:** 1.0.0  
**Data Início:** 10/12/2024  
**Status:** 📝 Documento Vivo

---

## Sobre Este Documento

Registro de todas as alterações realizadas no site público (homepage, páginas, etc.), incluindo:
- Remoção de dados mockados
- Integração com Supabase
- Melhorias de UX/UI
- Correções de bugs

---

## Estrutura do Frontend

```
/                           ← Homepage (index.html)
├── index.html              ← Página principal
├── css/
│   ├── style.css           ← CSS principal (77KB)
│   ├── cart-page.css       ← Carrinho
│   ├── catalog.css         ← Catálogo
│   ├── product-page.css    ← Página de produto
│   └── search-results.css  ← Resultados de busca
├── js/
│   ├── supabase-config.js      ← Config Supabase
│   ├── home-supabase.js        ← Integração home
│   ├── cart.js                 ← Sistema carrinho
│   ├── search.js               ← Sistema busca
│   ├── templates.js            ← Header/Footer
│   └── ... (22 arquivos)
└── pages/
    ├── produtos.html       ← Catálogo
    ├── produto.html        ← Detalhe produto
    ├── carrinho.html       ← Carrinho
    ├── busca.html          ← Resultados busca
    ├── contato.html        ← Contato
    └── lojas.html          ← Nossas lojas
```

---

## Mudanças Pendentes

### HOME-001: Remover Seção "Mais Procurados" Mockada

**Status:** 🟡 PENDENTE  
**Prioridade:** 🔴 ALTA  
**Arquivo:** `index.html`  
**Linhas:** 276-403

#### Problema
Seção "Mais Procurados" usa dados 100% hardcoded com placeholders externos.

#### Código a Remover
```html
<!-- REMOVER BLOCO INTEIRO: Linhas 276-403 -->
<section class="most-searched-section" aria-label="Produtos mais procurados">
    <!-- 5 produtos mockados com via.placeholder.com -->
    <!-- URLs quebradas em produção -->
</section>
```

#### Solução
**Opção A:** Remover seção completamente  
**Opção B:** Carregar do Supabase (produtos com flag `is_bestseller`)

```javascript
// Adicionar em home-supabase.js
async function loadMostSearchedProducts() {
    const { data } = await supabaseClient
        .from('products')
        .select('*')
        .eq('status', 'active')
        .order('reviews_count', { ascending: false })
        .limit(5);
    
    renderMostSearchedProducts(data);
}
```

---

### HOME-002: Carregar Categorias do Supabase

**Status:** 🟡 PENDENTE  
**Prioridade:** 🟡 MÉDIA  
**Arquivo:** `index.html`  
**Linhas:** 193-274

#### Problema
Categorias estão hardcoded no HTML com imagens locais.

#### Código Atual
```html
<div class="categories-carousel">
    <div class="category-item">
        <img src="assets/images/cat_parachoque_dianteiro.png" alt="...">
        <h3>Parachoque<br>Dianteiro</h3>
    </div>
    <!-- 5 mais categorias hardcoded -->
</div>
```

#### Solução
Já existe código em `home-supabase.js` (`loadHomeCategories`), mas:
1. Verificar se está sendo chamado
2. Verificar se categorias têm `image_url` no banco
3. Adicionar fallback para imagens locais

```javascript
// Verificar em home-supabase.js
function renderCategories(categories) {
    const carousel = document.querySelector('.categories-carousel');
    if (!carousel) return;
    
    carousel.innerHTML = categories.map(cat => `
        <div class="category-item">
            <a href="/pages/produtos.html?categoria=${cat.slug}">
                <div class="category-image">
                    <img src="${cat.image_url || '/assets/images/cat_default.png'}" 
                         alt="${cat.name}"
                         onerror="this.src='/assets/images/cat_default.png'">
                </div>
                <h3 class="category-name">${cat.name}</h3>
            </a>
        </div>
    `).join('');
}
```

---

### HOME-003: Implementar Fallback de Imagens Global

**Status:** 🟡 PENDENTE  
**Prioridade:** 🔴 ALTA  

#### Problema
Imagens quebradas em produção por:
1. URLs vazias (`null`, `undefined`)
2. Placeholders externos falhando (`via.placeholder.com`)

#### Solução
Criar utilitário global de fallback:

```javascript
// js/utils/image-fallback.js
(function() {
    'use strict';
    
    // Placeholder SVG inline (não depende de arquivos externos)
    const PLACEHOLDER_SVG = `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='300' viewBox='0 0 300 300'%3E%3Crect fill='%23f0f0f0' width='300' height='300'/%3E%3Ctext fill='%23999' font-family='Arial' font-size='14' x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle'%3ESem imagem%3C/text%3E%3C/svg%3E`;
    
    // Função de fallback
    window.handleImageError = function(img, type = 'product') {
        img.onerror = null; // Evita loop infinito
        img.src = PLACEHOLDER_SVG;
        img.alt = 'Imagem não disponível';
    };
    
    // Aplicar automaticamente em todas as imagens
    document.addEventListener('DOMContentLoaded', function() {
        document.querySelectorAll('img').forEach(img => {
            if (!img.hasAttribute('onerror')) {
                img.onerror = function() { handleImageError(this); };
            }
        });
    });
})();
```

---

### HOME-004: Adicionar Loading Skeletons

**Status:** 🟡 PENDENTE  
**Prioridade:** 🟡 MÉDIA  

#### Problema
Enquanto dados carregam, seções ficam vazias ou com flash.

#### Solução
```css
/* css/style.css - Adicionar */
.skeleton {
    background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
    background-size: 200% 100%;
    animation: skeleton-loading 1.5s infinite;
}

@keyframes skeleton-loading {
    0% { background-position: 200% 0; }
    100% { background-position: -200% 0; }
}

.skeleton-card {
    height: 280px;
    border-radius: 12px;
}

.skeleton-text {
    height: 16px;
    border-radius: 4px;
    margin-bottom: 8px;
}
```

```javascript
// js/home-supabase.js - Adicionar
function showProductsLoading() {
    const container = document.querySelector('.offers-grid');
    container.innerHTML = Array(4).fill(`
        <div class="product-card skeleton">
            <div class="skeleton-card"></div>
        </div>
    `).join('');
}
```

---

## Mudanças Executadas

### HOME-000: Integração Supabase para Produtos

**Status:** ✅ EXECUTADA  
**Data:** 08/12/2024  
**Arquivo:** `js/home-supabase.js`

#### Alteração
Seção "Principais Ofertas" agora carrega produtos do Supabase.

#### Código
```javascript
async function loadHomeProducts() {
    const { data: products } = await window.supabaseClient
        .from('products')
        .select('*')
        .eq('status', 'active')
        .or('featured.eq.true,in_stock.eq.true')
        .order('featured', { ascending: false })
        .limit(8);
    
    renderProducts(products);
}
```

#### Impacto
- ✅ Produtos criados no admin aparecem na home
- ✅ Sincronização Admin → Site funcional

---

## Seções da Homepage

### 1. Header
**Status:** ✅ OK  
**Arquivo:** `js/templates.js`  
**Descrição:** Template dinâmico com logo, busca, carrinho

### 2. Banner Carousel
**Status:** ⚠️ ESTÁTICO  
**Arquivo:** `index.html` (linhas 62-99)  
**Problema:** Usa imagens locais fixas  
**Solução:** Já existe `loadHomeBanners()`, verificar se banners existem no banco

### 3. Filtro de Veículos
**Status:** ⚠️ MOCK  
**Arquivo:** `index.html` (linhas 103-161)  
**Problema:** Dados de marcas/modelos hardcoded  
**Solução Futura:** API de veículos (FIPE ou similar)

### 4. Principais Ofertas
**Status:** ✅ DINÂMICO  
**Arquivo:** `js/home-supabase.js`  
**Descrição:** Carrega produtos do Supabase

### 5. Categorias
**Status:** ⚠️ ESTÁTICO  
**Arquivo:** `index.html` (linhas 193-274)  
**Problema:** Categorias hardcoded  
**Solução:** Carregar do Supabase

### 6. Mais Procurados
**Status:** ❌ 100% MOCK  
**Arquivo:** `index.html` (linhas 276-403)  
**Problema:** Dados totalmente fake  
**Solução:** Remover ou dinamizar

### 7. Marcas Parceiras
**Status:** ⚠️ ESTÁTICO  
**Arquivo:** `index.html` (linhas 405-486)  
**Problema:** Logos hardcoded  
**Solução:** Já existe `loadHomeBrands()`, verificar

### 8. CTA Frete Grátis
**Status:** ✅ OK  
**Descrição:** Seção estática, não precisa de dados

### 9. Footer
**Status:** ✅ OK  
**Arquivo:** `js/templates.js`  
**Descrição:** Template dinâmico

---

## Erros Conhecidos em Produção

### Imagens Quebradas
```
net::ERR_NAME_NOT_RESOLVED - via.placeholder.com
404 - /null
```

**Causa:** 
- Produtos sem `image_url`
- Seção mockada com URLs externas

**Solução:** Implementar HOME-003 (fallback de imagens)

### Favicon 404
```
GET /favicon.ico 404
GET /favicon-32x32.png 404
```

**Causa:** Arquivos não existem  
**Solução:** Criar ou remover referências

---

## Performance

### Métricas Atuais (Estimadas)
| Métrica | Valor | Meta |
|---------|-------|------|
| First Contentful Paint | ~2s | <1.5s |
| Time to Interactive | ~3s | <2s |
| Cumulative Layout Shift | Alto | <0.1 |

### Otimizações Propostas
1. **Lazy loading de imagens** - Adicionar `loading="lazy"`
2. **Skeleton loading** - Evitar layout shift
3. **Cache de dados** - Evitar re-fetch desnecessário
4. **Minificação** - CSS/JS minificados em produção

---

**Última atualização:** 10/12/2024 20:10

