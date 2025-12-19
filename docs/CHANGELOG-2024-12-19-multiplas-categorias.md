# Múltiplas Categorias por Produto - CHANGELOG 2024-12-19

## Data: 19/12/2024
## Feature: Seleção de Múltiplas Categorias

---

## ✨ Nova Funcionalidade

Agora um produto pode pertencer a **múltiplas categorias** simultaneamente. Por exemplo, um produto pode ser classificado como "Motor" E "Elétrica" ao mesmo tempo.

---

## 🛠️ Alterações Realizadas

### 1. `dimaradmin/produtos.html`

**HTML - Campo de categorias:**
- ❌ Antes: Select simples (apenas uma categoria)
- ✅ Depois: Checkboxes múltiplos com ícones visuais

**CSS - Estilos adicionados:**
- `.category-checkbox-label` - Estilo base dos checkboxes
- Efeitos de hover e seleção com cores do tema

### 2. `dimaradmin/js/produtos.js`

**Funções adicionadas:**
- `getSelectedCategories()` - Retorna array de categorias selecionadas
- `setSelectedCategories(categories)` - Define checkboxes a partir de array
- `clearCategoryCheckboxes()` - Limpa todas as seleções
- `formatCategoriesDisplay(categories)` - Exibe múltiplos badges na tabela

**Funções atualizadas:**
- `saveProduct()` - Salva array `categories` + campo `category` para compatibilidade
- `openProductModal()` - Carrega categorias múltiplas nos checkboxes
- `renderProducts()` - Exibe múltiplos badges de categoria
- Filtro de categoria - Verifica se categoria está no array

### 3. `database/migration-multiple-categories.sql`

Script SQL para adicionar coluna `categories` como array no Supabase:
```sql
ALTER TABLE products ADD COLUMN IF NOT EXISTS categories TEXT[] DEFAULT '{}';
```

---

## 📋 Ação Necessária

> ⚠️ **Execute a migration SQL no Supabase** antes de usar esta funcionalidade:
> 
> 1. Acesse o painel do Supabase
> 2. Vá em SQL Editor
> 3. Execute o conteúdo de `database/migration-multiple-categories.sql`

---

## 🔄 Compatibilidade

- ✅ Produtos existentes continuam funcionando (campo `category` mantido)
- ✅ Ao editar, categoria antiga é carregada no checkbox correspondente
- ✅ Filtro funciona tanto com array `categories` quanto campo `category`
