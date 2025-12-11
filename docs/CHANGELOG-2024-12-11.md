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

## Resumo dos Arquivos Modificados

| Arquivo | Tipo de Alteração |
|---------|-------------------|
| `js/home-supabase.js` | Logos de marcas + Efeito botão comprar |
| `dimaradmin/js/categorias.js` | Sistema de categorias admin |
| `css/style.css` | Alinhamento de cards |
