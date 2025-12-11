# Changelog - 11/12/2024

## Correções e Melhorias Implementadas

---

### 1. Logos de Marcas na Homepage ✅

**Problema:** Logos das marcas não apareciam na homepage - erros 404 no console.

**Causa:** Supabase retornava marcas com URLs de imagens inexistentes (gates.png, nakata.png, etc).

**Solução:**
- Adicionado mapa `KNOWN_BRAND_IMAGES` em `js/home-supabase.js`
- Filtro inteligente: se menos de 5 marcas válidas, mantém HTML estático
- Todas as 9 marcas agora exibem corretamente

**Arquivos modificados:**
- `js/home-supabase.js`

---

### 2. Sistema de Categorias no Admin ✅

**Problema:** Erro crítico "Sistema não configurado. Supabase é obrigatório".

**Causa:** Fallback localStorage foi removido em correção anterior (UUIDs inválidos).

**Solução:**
- Adicionada função `generateUUID()` para criar UUIDs v4 válidos
- Reativado fallback localStorage com UUIDs corretos
- Restaurada função `getDefaultCategories()` com 7 categorias padrão
- CRUD de categorias funcionando normalmente

**Arquivos modificados:**
- `dimaradmin/js/categorias.js`

---

### 3. Alinhamento de Cards de Produtos ✅

**Problema:** Cards de produtos com tamanhos diferentes e desalinhados.

**Causa:** Elementos internos (título, preços, parcelas) sem altura fixa.

**Solução:**
- `.product-card`: `min-height: 520px`
- `.product-title`: `height: 42px` (fixo para 2 linhas)
- `.product-installment-detail`: `min-height: 30px`

**Arquivos modificados:**
- `css/style.css`

---

### 4. Efeito Visual no Botão "Comprar" ✅

**Problema:** Faltava feedback visual ao adicionar produto ao carrinho.

**Solução:**
- Botão muda para verde (#28a745 → #20c997) ao clicar
- Ícone muda para ✓ (check)
- Texto muda para "Adicionado!"
- Volta ao normal após 2 segundos

**Arquivos modificados:**
- `js/home-supabase.js`

---

### 5. Seleção de Seção da Homepage no Admin ✅

**Problema:** Não era possível escolher em qual seção da homepage (Principais Ofertas ou Mais Procurados) um produto deveria aparecer.

**Solução:**
- Adicionado campo "Exibir na Homepage" no formulário de produtos do admin
- Opções disponíveis:
  - Não exibir na homepage
  - 📦 Principais Ofertas
  - 🔥 Mais Procurados
  - ⭐ Ambas as seções
- Homepage agora filtra produtos pelo campo `home_section`

**Arquivos modificados:**
- `dimaradmin/produtos.html`
- `dimaradmin/js/produtos.js`
- `js/home-supabase.js`

**Migration SQL necessária:**
- `database/migration-home-section.sql`

---

## Resumo dos Arquivos Modificados

| Arquivo | Tipo de Alteração |
|---------|-------------------|
| `js/home-supabase.js` | Logos de marcas + Efeito botão + Filtro por seção |
| `dimaradmin/js/categorias.js` | Sistema de categorias admin |
| `dimaradmin/produtos.html` | Campo "Exibir na Homepage" |
| `dimaradmin/js/produtos.js` | Salvar/carregar home_section |
| `css/style.css` | Alinhamento de cards |
| `database/migration-home-section.sql` | Migration para adicionar coluna |

---

### 6. Correção da Página de Catálogo de Produtos ✅

**Problema:** Página `pages/produtos.html` não carregava produtos e exibia categorias como "undefined".

**Solução:**
- Refatorado `catalog.js` para integração com Supabase
- Adicionado CDN do Supabase ao HTML da página
- Corrigido formato de categorias em `products-catalog.js`
- Removidos produtos de exemplo (usa apenas Supabase)
- Cards mais compactos: 220px min, imagem 85%, padding 12px
- Adicionado skeleton loading durante carregamento

**Arquivos modificados:**
- `js/catalog.js` - Refatoração completa
- `js/products-catalog.js` - Formato de categorias
- `css/catalog.css` - Cards compactos + skeleton
- `pages/produtos.html` - CDN Supabase adicionado

---

## Resumo dos Arquivos Modificados (Sessão Completa)

| Arquivo | Tipo de Alteração |
|---------|-------------------|
| `js/home-supabase.js` | Logos de marcas + Efeito botão + Filtro por seção |
| `dimaradmin/js/categorias.js` | Sistema de categorias admin |
| `dimaradmin/produtos.html` | Campo "Exibir na Homepage" |
| `dimaradmin/js/produtos.js` | Salvar/carregar home_section |
| `css/style.css` | Alinhamento de cards homepage |
| `database/migration-home-section.sql` | Migration para adicionar coluna |
| `js/catalog.js` | Refatoração página de catálogo |
| `js/products-catalog.js` | Formato de categorias |
| `css/catalog.css` | Cards compactos + skeleton |
| `pages/produtos.html` | CDN Supabase |
