# 🔍 SISTEMA DE BUSCA - GUIA COMPLETO

## 📋 Visão Geral

O sistema de busca do site Dimar é uma ferramenta completa e profissional que oferece:
- **Busca em tempo real** com autocomplete
- **Sugestões inteligentes** (produtos, categorias, marcas)
- **Histórico de buscas** automático
- **Página de resultados** dedicada com filtros avançados
- **Algoritmo de relevância** para melhores resultados

---

## 🎯 Funcionalidades

### 1. Autocomplete Inteligente

**Como funciona:**
- Digite pelo menos **2 caracteres** na barra de busca
- Aguarde **300ms** (debounce automático)
- Veja até **8 sugestões** aparecerem

**Tipos de sugestões:**
1. **Produtos** (foto + nome + preço)
2. **Categorias** (ícone laranja)
3. **Marcas** (ícone quadrado)
4. **Histórico** (ícone relógio)

**Interações:**
- **Click**: Navega para o item
- **Enter**: Vai para página de resultados
- **Escape**: Fecha as sugestões
- **Click fora**: Fecha automaticamente

### 2. Página de Resultados

**URL:** `/pages/busca.html?q=termo-buscado`

**Elementos:**
- Título com termo destacado
- Contagem de resultados
- Tempo de busca (em ms)
- Filtros rápidos (Todos, Produtos, Categorias, Marcas)
- Grid de produtos
- Paginação (12 produtos por página)
- Buscas relacionadas

### 3. Algoritmo de Relevância

O sistema usa um **score de relevância** para ordenar resultados:

| Critério | Pontos |
|----------|--------|
| Nome exato | 50 |
| Começa com termo | 30 |
| Contém termo no nome | 20 |
| Marca exata | 25 |
| Contém na marca | 15 |
| Categoria | 15 |
| Descrição | 10 |
| Especificações | 5 |
| Em promoção | +3 |
| Em estoque | +2 |

### 4. Histórico de Buscas

**Armazenamento:**
- Salvo em `localStorage`
- Chave: `search_history`
- Limite: **10 buscas** mais recentes

**Gestão automática:**
- Remove duplicatas
- Mantém ordem cronológica
- Aparece nas sugestões

### 5. Filtros Avançados

**Sidebar de filtros:**
- Categorias
- Tipo de veículo (Carro, Moto, Universal)
- Marcas (com busca interna)
- Faixa de preço
- Em promoção
- Entrega rápida
- Em estoque

**Ordenação:**
- Mais relevantes (padrão)
- Menor preço
- Maior preço
- Nome (A-Z)
- Nome (Z-A)

---

## 💻 Arquitetura Técnica

### Arquivos Principais

```
js/
├── search.js             # Sistema de autocomplete
└── search-results.js     # Lógica da página de resultados

pages/
└── busca.html           # Página de resultados

css/
└── search-results.css   # Estilos do sistema
```

### Classes JavaScript

#### SearchSystem (search.js)

```javascript
class SearchSystem {
    constructor()
    init()
    setupSearch()
    createSuggestionsContainer()
    handleInput(e)
    generateSuggestions(query)
    getSuggestions(query)
    renderSuggestions(suggestions)
    performSearch()
    addToHistory(query)
    normalizeString(str)
}
```

#### SearchResultsPage (search-results.js)

```javascript
class SearchResultsPage {
    constructor()
    init()
    setup()
    performSearch()
    calculateRelevanceScore(product, query)
    applyFilters()
    applySort()
    renderProducts()
    renderPagination()
}
```

### Integração

O sistema é carregado em **todas as páginas** do site:

```html
<script src="js/search.js"></script>
```

Inicialização automática:
```javascript
window.searchSystem = new SearchSystem();
```

---

## 🎨 Design e UX

### Componentes Visuais

**Sugestões (Dropdown):**
- Fundo branco
- Borda suave
- Sombra sutil
- Hover cinza claro
- Scroll customizado

**Badges de tipo:**
- Produto: "Produto"
- Categoria: "Categoria"
- Marca: "Marca"
- Histórico: "Histórico"

**Destaque de termo:**
- Termo buscado em **negrito**
- Cor laranja (#FF6B00)

**Empty state:**
- Ícone de lupa grande
- Mensagem clara
- Link para catálogo completo

### Responsividade

**Desktop (>768px):**
- Layout 2 colunas
- Sidebar 300px
- Grid 3-4 colunas

**Tablet (768px-480px):**
- Filtros colapsáveis
- Grid 2 colunas
- Sugestões adaptadas

**Mobile (<480px):**
- Sidebar full width
- Grid 1 coluna
- Sugestões menores
- Touch-friendly

---

## 🚀 Como Testar

### Teste 1: Autocomplete Básico
1. Abra `http://localhost:8000`
2. Clique na barra de busca
3. Digite "freio"
4. Veja sugestões aparecerem
5. Clique em uma sugestão

### Teste 2: Busca Completa
1. Digite "motor" na barra
2. Pressione **Enter**
3. Veja resultados em `/pages/busca.html`
4. Teste os filtros laterais
5. Teste a ordenação
6. Teste a paginação

### Teste 3: Histórico
1. Faça 3 buscas diferentes
2. Clique na barra de busca
3. Digite "m" (letra inicial de uma busca)
4. Veja seu histórico nas sugestões

### Teste 4: Sem Resultados
1. Digite "xyzabc123" (termo inexistente)
2. Pressione Enter
3. Veja empty state
4. Clique em "Ver Todos os Produtos"

### Teste 5: Filtros Combinados
1. Busque "peça"
2. Selecione categoria "Motor"
3. Selecione marca "Bosch"
4. Ordene por "Menor Preço"
5. Veja resultados filtrados

---

## 🔧 Personalização

### Ajustar número de sugestões

```javascript
// search.js, linha ~88
return suggestions.slice(0, 8); // Altere o 8
```

### Ajustar delay do autocomplete

```javascript
// search.js, linha ~56
this.debounceTimer = setTimeout(() => {
    this.generateSuggestions(query);
}, 300); // Altere 300ms
```

### Ajustar produtos por página

```javascript
// search-results.js, linha ~14
this.productsPerPage = 12; // Altere o 12
```

### Ajustar tamanho do histórico

```javascript
// search.js, linha ~254
this.searchHistory = this.searchHistory.slice(0, 10); // Altere o 10
```

---

## 🐛 Troubleshooting

### Sugestões não aparecem
**Causa:** JavaScript não carregado
**Solução:** Verifique se `search.js` está antes de `global-init.js`

### Resultados vazios
**Causa:** products-catalog.js não carregado
**Solução:** Adicione `<script src="../js/products-catalog.js"></script>`

### Histórico não salva
**Causa:** LocalStorage desabilitado
**Solução:** Habilite cookies/storage no navegador

### Busca lenta
**Causa:** Muitos produtos
**Solução:** Aumente debounce ou reduza sugestões

---

## 📊 Dados de Produtos

O sistema busca em `window.productsData` (arquivo `products-catalog.js`):

```javascript
{
    id: 'prod_001',
    name: 'Nome do Produto',
    category: 'Categoria',
    brand: 'Marca',
    description: 'Descrição...',
    specs: {...},
    price: 'R$ 299,90',
    image: 'path/to/image.jpg'
}
```

---

## 🎯 Métricas de Sucesso

**Performance:**
- ✅ Autocomplete < 500ms
- ✅ Resultados < 100ms
- ✅ Score de relevância eficiente

**UX:**
- ✅ Mínimo 2 caracteres (evita spam)
- ✅ 8 sugestões (não sobrecarrega)
- ✅ Histórico (facilita repetição)
- ✅ Destaque visual (clareza)

**Funcionalidade:**
- ✅ Busca normalizada (sem acentos)
- ✅ Palavras parciais
- ✅ Múltiplos tipos de resultado
- ✅ Paginação fluida

---

## 🔮 Melhorias Futuras

### Curto Prazo
- [ ] Busca por código de peça (ex: "123ABC")
- [ ] Correção ortográfica básica
- [ ] Sugestões de "Você quis dizer?"

### Médio Prazo
- [ ] Analytics de buscas
- [ ] "Produtos mais buscados"
- [ ] Sinônimos (ex: "farol" = "lanterna")
- [ ] Busca por imagem

### Longo Prazo
- [ ] IA para sugestões personalizadas
- [ ] Busca por voz
- [ ] Busca por compatibilidade veículo
- [ ] Elasticsearch/Algolia (se volume crescer)

---

## 📚 Referências

**Inspirações:**
- Amazon
- Mercado Livre
- Magazine Luiza
- AutoZone

**Bibliotecas consideradas:**
- Fuse.js (fuzzy search)
- Lunr.js (full-text search)
- Algolia (search as a service)

**Decisão:** Implementação vanilla JS para:
- ✅ Controle total
- ✅ Zero dependências
- ✅ Performance máxima
- ✅ Personalização completa

---

**Última atualização:** 08/12/2024
**Status:** ✅ 100% Funcional
**Responsável:** Sistema de Busca Dimar

