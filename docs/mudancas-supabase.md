# 🔧 Mudanças no Supabase - Dimar Auto Peças

**Versão:** 1.0.0  
**Data Início:** 10/12/2024  
**Status:** 📝 Documento Vivo

---

## Sobre Este Documento

Registro de todas as alterações realizadas no banco de dados Supabase, incluindo:
- Migrations executadas
- Alterações de schema
- Políticas RLS
- Dados inseridos/modificados

---

## Informações de Conexão

| Campo | Valor |
|-------|-------|
| **Project ID** | jfiarqtqojfptdbddnvu |
| **URL** | https://jfiarqtqojfptdbddnvu.supabase.co |
| **Região** | (default) |

---

## Migrations Pendentes

### MIG-001: Adicionar Colunas de Badges

**Status:** 🟡 PENDENTE  
**Prioridade:** 🔴 CRÍTICA  
**Data Criação:** 10/12/2024  
**Arquivo:** `database/migration-add-badge-columns.sql`

#### SQL a Executar
```sql
-- =============================================================================
-- MIGRATION: Adicionar colunas de badges na tabela products
-- Execute no SQL Editor do Supabase Dashboard
-- =============================================================================

-- Adicionar colunas
ALTER TABLE products 
ADD COLUMN IF NOT EXISTS badge_type VARCHAR(50),
ADD COLUMN IF NOT EXISTS custom_badge_text VARCHAR(100),
ADD COLUMN IF NOT EXISTS short_description TEXT;

-- Criar índice para performance
CREATE INDEX IF NOT EXISTS idx_products_badge_type ON products(badge_type);

-- Verificação
SELECT column_name, data_type
FROM information_schema.columns
WHERE table_name = 'products'
  AND column_name IN ('badge_type', 'custom_badge_text', 'short_description');
```

#### Impacto
- ✅ Permite badges personalizados no admin
- ✅ Produtos podem ter descrição curta
- ✅ Homepage exibe badges corretamente

#### Como Executar
1. Acessar https://supabase.com/dashboard
2. Selecionar projeto `jfiarqtqojfptdbddnvu`
3. Menu lateral → SQL Editor
4. Colar o SQL acima
5. Clicar em "RUN"
6. Verificar se retorna 3 linhas

---

### MIG-002: Adicionar Coluna Status

**Status:** 🟡 PENDENTE  
**Prioridade:** 🔴 CRÍTICA  

#### SQL a Executar
```sql
-- Adicionar coluna status se não existir
ALTER TABLE products 
ADD COLUMN IF NOT EXISTS status VARCHAR(20) DEFAULT 'active';

-- Criar constraint de valores válidos
ALTER TABLE products 
ADD CONSTRAINT check_product_status 
CHECK (status IN ('active', 'inactive', 'draft'));

-- Índice para filtros
CREATE INDEX IF NOT EXISTS idx_products_status ON products(status);

-- Atualizar produtos existentes sem status
UPDATE products SET status = 'active' WHERE status IS NULL;
```

---

## Migrations Executadas

### MIG-000: Schema Inicial

**Status:** ✅ EXECUTADA  
**Data:** 08/12/2024  
**Arquivo:** `database/schema.sql`

#### Tabelas Criadas
- `products` - Produtos do catálogo
- `categories` - Categorias de produtos
- `brands` - Marcas parceiras
- `banners` - Banners do carrossel
- `customers` - Clientes (futuro)
- `orders` - Pedidos (futuro)
- `order_items` - Itens de pedido (futuro)
- `reviews` - Avaliações (futuro)
- `coupons` - Cupons de desconto (futuro)

#### Índices Criados
- `idx_products_category`
- `idx_products_brand`
- `idx_products_vehicle_type`
- `idx_products_sku`
- `idx_products_featured`
- `idx_products_in_stock`

#### RLS Habilitado
- Todas as tabelas com RLS ativo
- Policies de leitura pública para catálogo
- Policies de escrita para admin autenticado

---

## Schema Atual

### Tabela: products

| Coluna | Tipo | Nullable | Default | Descrição |
|--------|------|----------|---------|-----------|
| id | UUID | NOT NULL | gen_random_uuid() | PK |
| sku | VARCHAR(50) | NOT NULL | - | Código único |
| name | VARCHAR(255) | NOT NULL | - | Nome do produto |
| description | TEXT | NULL | - | Descrição completa |
| category | VARCHAR(100) | NOT NULL | - | Categoria |
| brand | VARCHAR(100) | NOT NULL | - | Marca |
| vehicle_type | VARCHAR(50) | NOT NULL | - | Carro/Moto/Universal |
| price | DECIMAL(10,2) | NOT NULL | - | Preço normal |
| sale_price | DECIMAL(10,2) | NULL | - | Preço promocional |
| stock | INTEGER | NULL | 0 | Quantidade em estoque |
| image_url | TEXT | NULL | - | URL da imagem principal |
| images | JSONB | NULL | '[]' | Array de URLs de imagens |
| specifications | JSONB | NULL | '{}' | Especificações técnicas |
| compatibility | TEXT[] | NULL | - | Veículos compatíveis |
| fast_shipping | BOOLEAN | NULL | false | Entrega rápida |
| in_stock | BOOLEAN | NULL | true | Tem estoque |
| featured | BOOLEAN | NULL | false | Produto em destaque |
| badge | VARCHAR(50) | NULL | - | Badge legado |
| rating | DECIMAL(2,1) | NULL | 0.0 | Avaliação média |
| reviews_count | INTEGER | NULL | 0 | Número de avaliações |
| created_at | TIMESTAMPTZ | NULL | NOW() | Data criação |
| updated_at | TIMESTAMPTZ | NULL | NOW() | Data atualização |
| **badge_type** | VARCHAR(50) | NULL | - | 🟡 PENDENTE |
| **custom_badge_text** | VARCHAR(100) | NULL | - | 🟡 PENDENTE |
| **short_description** | TEXT | NULL | - | 🟡 PENDENTE |
| **status** | VARCHAR(20) | NULL | 'active' | 🟡 PENDENTE |

### Tabela: categories

| Coluna | Tipo | Nullable | Default | Descrição |
|--------|------|----------|---------|-----------|
| id | UUID | NOT NULL | gen_random_uuid() | PK |
| name | VARCHAR(100) | NOT NULL | - | Nome da categoria |
| slug | VARCHAR(100) | NOT NULL | - | URL amigável |
| description | TEXT | NULL | - | Descrição |
| image_url | TEXT | NULL | - | Imagem da categoria |
| icon | VARCHAR(50) | NULL | - | Ícone CSS |
| parent_id | UUID | NULL | - | FK para subcategorias |
| display_order | INTEGER | NULL | 0 | Ordem de exibição |
| is_active | BOOLEAN | NULL | true | Ativa/Inativa |
| created_at | TIMESTAMPTZ | NULL | NOW() | Data criação |
| updated_at | TIMESTAMPTZ | NULL | NOW() | Data atualização |

### Tabela: brands

| Coluna | Tipo | Nullable | Default | Descrição |
|--------|------|----------|---------|-----------|
| id | UUID | NOT NULL | gen_random_uuid() | PK |
| name | VARCHAR(100) | NOT NULL | - | Nome da marca |
| slug | VARCHAR(100) | NOT NULL | - | URL amigável |
| logo_url | TEXT | NULL | - | URL do logo |
| description | TEXT | NULL | - | Descrição |
| website | VARCHAR(255) | NULL | - | Site oficial |
| is_partner | BOOLEAN | NULL | false | É parceira |
| display_order | INTEGER | NULL | 0 | Ordem de exibição |
| is_active | BOOLEAN | NULL | true | Ativa/Inativa |
| created_at | TIMESTAMPTZ | NULL | NOW() | Data criação |
| updated_at | TIMESTAMPTZ | NULL | NOW() | Data atualização |

### Tabela: banners

| Coluna | Tipo | Nullable | Default | Descrição |
|--------|------|----------|---------|-----------|
| id | UUID | NOT NULL | gen_random_uuid() | PK |
| title | VARCHAR(255) | NOT NULL | - | Título |
| subtitle | TEXT | NULL | - | Subtítulo |
| image_url | TEXT | NOT NULL | - | URL da imagem |
| link_url | VARCHAR(255) | NULL | - | Link de destino |
| position | VARCHAR(50) | NULL | 'main' | Posição no site |
| display_order | INTEGER | NULL | 0 | Ordem de exibição |
| is_active | BOOLEAN | NULL | true | Ativo/Inativo |
| start_date | TIMESTAMPTZ | NULL | - | Data início |
| end_date | TIMESTAMPTZ | NULL | - | Data fim |
| created_at | TIMESTAMPTZ | NULL | NOW() | Data criação |
| updated_at | TIMESTAMPTZ | NULL | NOW() | Data atualização |

---

## Dados Atuais

### Contagens (10/12/2024)
| Tabela | Registros |
|--------|-----------|
| products | 2 |
| categories | 7 |
| brands | 9 |
| banners | 0 |

### Categorias Existentes
1. Motor
2. Freios
3. Suspensão
4. Elétrica
5. Filtros
6. Iluminação
7. Acessórios

### Marcas Existentes
1. Bosch
2. Fiat
3. Hyundai
4. NGK
5. Toyota
6. Ford
7. Tete
8. (+ 2 outras)

---

## Políticas RLS

### products
```sql
-- Leitura pública
CREATE POLICY "Produtos são públicos" 
ON products FOR SELECT USING (true);

-- Escrita para admin
CREATE POLICY "Admin tem acesso total aos produtos" 
ON products FOR ALL 
USING (auth.jwt()->>'role' = 'admin');
```

### categories
```sql
-- Leitura pública
CREATE POLICY "Categorias são públicas" 
ON categories FOR SELECT USING (true);

-- Escrita para admin
CREATE POLICY "Admin tem acesso total às categorias" 
ON categories FOR ALL 
USING (auth.jwt()->>'role' = 'admin');
```

---

## Troubleshooting

### Erro: "Could not find the 'badge_type' column"
**Causa:** Migration MIG-001 não executada  
**Solução:** Executar SQL da MIG-001 no Supabase

### Erro: "invalid input syntax for type uuid"
**Causa:** ID não-UUID sendo enviado (ex: `cat_1`)  
**Solução:** 
1. Verificar origem do ID
2. Remover fallback localStorage
3. Usar apenas IDs do Supabase

### Erro: "permission denied for table products"
**Causa:** RLS bloqueando operação  
**Solução:**
1. Verificar se usuário está autenticado
2. Verificar policy de escrita
3. Temporariamente desabilitar RLS para debug

---

**Última atualização:** 10/12/2024 20:10

