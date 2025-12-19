# Changelog - 2024-12-19 - Gerenciamento de Marcas

## Resumo
Implementação completa do sistema de gerenciamento de marcas parceiras com suporte a duas fileiras independentes no carrossel da homepage.

---

## Alterações no Banco de Dados

### Nova Coluna
```sql
ALTER TABLE brands ADD COLUMN IF NOT EXISTS carousel_row INTEGER DEFAULT 1;
```
- `carousel_row`: Define em qual fileira do carrossel a marca aparece
  - `1` = Fileira Superior
  - `2` = Fileira Inferior

---

## Arquivos Modificados

### Admin Panel

#### `dimaradmin/marcas.html`
- Adicionado dropdown "Fileira do Carrossel" no modal de adicionar/editar marca
- Adicionada coluna "Fileira" na tabela de marcas
- Status renomeado para "Ativa (Visível)" / "Oculta"

#### `dimaradmin/js/marcas.js`
- Função `saveBrand()`: Salva campo `carousel_row`
- Função `renderBrands()`: Exibe badges de fileira (Fileira 1/2)
- Função `openBrandModal()`: Carrega valor da fileira ao editar
- Ordenação de marcas por fileira na tabela

#### `dimaradmin/css/admin.css`
- Adicionados estilos `.badge-primary` e `.badge-info`

---

### Homepage

#### `js/home-supabase.js`
- Função `loadHomeBrands()`: 
  - Busca apenas marcas com `is_active = true`
  - Separa por `carousel_row` (1 vs 2)
- Função `renderBrands(row1Brands, row2Brands)`:
  - Usa `logo_url` do banco (suporta base64)
  - Popula carrossel superior com Fileira 1
  - Popula carrossel inferior com Fileira 2
  - Requer mínimo de 3 marcas por fileira para animação

#### `css/style.css`
- Padronização de tamanho dos logos de marcas:
  - Desktop: 45px altura, max-width 100px
  - Tablet (992px): 40px altura, max-width 90px
  - Mobile (768px): 35px altura, max-width 80px

---

## Como Usar

1. Acesse `/dimaradmin/marcas.html`
2. Clique em "Adicionar Marca" ou edite uma existente
3. Faça upload do logo (PNG transparente recomendado)
4. Digite o nome da marca
5. Selecione a fileira (1 = Superior, 2 = Inferior)
6. Selecione status "Ativa (Visível)"
7. Clique Salvar

> **Nota:** Mínimo de 3 marcas por fileira para a animação do carrossel funcionar corretamente.

---

## Compatibilidade
- Marcas existentes automaticamente atribuídas à Fileira 1
- Logos base64 e URLs externos suportados
- Fallback para HTML estático se menos de 3 marcas por fileira
