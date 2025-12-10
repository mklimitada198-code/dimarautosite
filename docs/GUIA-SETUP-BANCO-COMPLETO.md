# 🎯 GUIA COMPLETO - Setup do Banco de Dados

**Data:** 09/12/2024 23:56  
**Objetivo:** Configurar 100% do banco Supabase para funcionar com o projeto

---

## ⚠️ PROBLEMA IDENTIFICADO

### Erro Atual:
```
Could not find the 'status' column of 'products' in the schema cache
```

### Causa Raiz:
A tabela `products` no Supabase foi criada com o `schema.sql` antigo que:
- ❌ NÃO tem coluna `status` (admin precisa!)
- ❌ TEM coluna `vehicle_type` (admin NÃO usa!)
- ❌ NÃO tem `badge_type`, `custom_badge_text`, `short_description`

### Incompatibilidade:

| Admin Espera | Schema.sql Tem | Status |
|--------------|----------------|--------|
| `status` | `vehicle_type` | ❌ CONFLITO |
| `badge_type` | ❌ Não existe | ❌ FALTA |
| `custom_badge_text` | ❌ Não existe | ❌ FALTA |
| `short_description` | ❌ Não existe | ❌ FALTA |

---

## ✅ SOLUÇÃO DEFINITIVA

Criado script `SETUP-COMPLETO-BANCO.sql` que:

1. **DROP** a tabela products (se existir)
2. **RECREATE** com TODAS as colunas corretas
3. Cria/atualiza `categories`, `brands`, `banners`
4. Configura índices para performance
5. Configura RLS (Row Level Security) em modo desenvolvimento
6. Insere dados iniciais (categorias e marcas)

---

## 🚀 COMO EXECUTAR (5 minutos)

### PASSO 1: Backup (Opcional mas Recomendado)

Se você já tem produtos/dados no Supabase:

```sql
-- Exportar produtos existentes
SELECT * FROM products;
-- Copie o resultado e salve em algum lugar
```

### PASSO 2: Executar Script Completo

1. **Acesse Supabase:** https://supabase.com
2. **Projeto:** jfiarqtqojfptdbddnvu
3. **SQL Editor** → New Query
4. **Copie TODO o conteúdo de:** `database/SETUP-COMPLETO-BANCO.sql`
5. **Cole no editor**
6. **RUN** (Ctrl + Enter)

### PASSO 3: Aguardar Conclusão

O script vai:
- ⏱️ Levar ~30 segundos
- ✅ Mostrar "Success"
- 📊 Exibir lista de colunas criadas
- 📈 Mostrar contagem de registros

### PASSO 4: Verificar Resultado

Na última query do script, você verá:

```
column_name          | data_type | nota
---------------------|-----------|------------------
id                   | uuid      |
sku                  | varchar   |
name                 | varchar   |
category             | varchar   |
brand                | varchar   |
price                | numeric   |
stock                | integer   |
status               | varchar   | 🆕 NOVA/CORRIGIDA
short_description    | text      | 🆕 NOVA/CORRIGIDA
description          | text      |
sale_price           | numeric   |
images               | jsonb     |
featured             | boolean   |
fast_shipping        | boolean   |
badge_type           | varchar   | 🆕 NOVA/CORRIGIDA
custom_badge_text    | varchar   | 🆕 NOVA/CORRIGIDA
...
```

### PASSO 5: Testar no Admin

1. **Abra:** http://localhost:8000/dimaradmin/produtos.html
2. **Hard Refresh:** Ctrl + Shift + F5
3. **Adicionar Produto:**
   - Nome: "Filtro de Óleo Mann W950"
   - SKU: "MANN-W950"
   - Categoria: "filtros"
   - Marca: "Mann Filter"
   - Preço: 45.90
   - Estoque: 25
   - Status: Ativo
   - Badge: "Destaque"
   - ✅ Produto em Destaque
   - ✅ Entrega Rápida
4. **Salvar**

**Resultado Esperado:** ✅ "Produto adicionado com sucesso!"

---

## 📊 O que o Script Cria

### Tabelas Principais:

#### 1. **products** (COMPLETAMENTE RECRIADA)
- ✅ 25+ colunas
- ✅ Todos os campos do admin
- ✅ Campos de badges
- ✅ Campos de compatibilidade legacy

#### 2. **categories**
- ✅ 7 categorias pré-cadastradas
- ✅ Slugs e descrições

#### 3. **brands**
- ✅ 10 marcas pré-cadastradas
- ✅ Marcas parceiras

#### 4. **banners**
- ✅ Pronta para carrossel
- ✅ Suporta posicionamento

### Índices Criados:

```sql
- idx_products_sku
- idx_products_category  
- idx_products_brand
- idx_products_status          ← NOVO!
- idx_products_featured
- idx_products_badge_type      ← NOVO!
- idx_categories_slug
- idx_brands_slug
- idx_banners_active
```

### RLS (Segurança):

**MODO DESENVOLVIMENTO:**
- ✅ Leitura pública (SELECT sem auth)
- ✅ Escrita liberada (INSERT/UPDATE/DELETE sem auth)

**⚠️ PRODUÇÃO:** Você vai precisar configurar autenticação adequada depois!

---

## 🗂️ Estrutura da Tabela Products (Final)

```sql
products (
    -- IDs e Chaves
    id              UUID PRIMARY KEY
    sku             VARCHAR(100) UNIQUE NOT NULL
    
    -- Info Básica
    name            VARCHAR(255) NOT NULL
    category        VARCHAR(100) NOT NULL
    brand           VARCHAR(100) NOT NULL
    
    -- Preços
    price           DECIMAL(10,2) NOT NULL
    sale_price      DECIMAL(10,2)
    
    -- Estoque
    stock           INTEGER DEFAULT 0
    status          VARCHAR(20) DEFAULT 'active'  ← CORRIGIDO!
    in_stock        BOOLEAN DEFAULT true
    
    -- Descrições
    short_description  TEXT                       ← NOVO!
    description        TEXT
    
    -- Imagens
    images          JSONB DEFAULT '[]'
    
    -- Features
    featured        BOOLEAN DEFAULT FALSE
    fast_shipping   BOOLEAN DEFAULT FALSE
    
    -- Badges
    badge_type      VARCHAR(50)                   ← NOVO!
    custom_badge_text VARCHAR(100)                ← NOVO!
    
    -- Legacy (compatibilidade)
    vehicle_type    VARCHAR(50)
    badge           VARCHAR(50)
    specifications  JSONB
    compatibility   TEXT[]
    rating          DECIMAL(2,1)
    reviews_count   INTEGER
    
    -- Timestamps
    created_at      TIMESTAMP
    updated_at      TIMESTAMP
)
```

---

## ⚠️ IMPORTANTE - Dados Existentes

### Se você JÁ TEM produtos no banco:

O script usa `DROP TABLE products CASCADE` que **APAGA TUDO**.

**Opção 1:** Backup manual (copiar dados antes)  
**Opção 2:** Modificar script para usar `ALTER TABLE` ao invés de `DROP`

**Opção 3 (R ecomendada para teste):** 
- Executar como está (apaga tudo)
- Testar funcionamento
- Recadastrar produtos via admin

---

## 📁 Arquivos Relacionados

| Arquivo | Descrição |
|---------|-----------|
| `database/SETUP-COMPLETO-BANCO.sql` | ✨ Script principal (USE ESTE!) |
| `database/schema.sql` | ⚠️ Antigo (NÃO use mais) |
| `database/migration-add-badge-columns.sql` | ⚠️ Obsoleto (substituído pelo setup completo) |

---

## 🎯 Checklist Pós-Execução

- [ ] Script executado sem erros
- [ ] Verificação mostra colunas corretas
- [ ] Categories: 7 registros
- [ ] Brands: 10 registros
- [ ] Admin carrega sem erros
- [ ] Consegue adicionar produto
- [ ] Produto salvo no Supabase
- [ ] Produto aparece na lista do admin
- [ ] Produto aparece na homepage

---

## 🆘 Troubleshooting

### "Cannot drop table because other objects depend on it"
**Solução:** O script já usa `CASCADE`, deve funcionar. Se persistir:
```sql
DROP TABLE IF EXISTS products CASCADE;
-- Execute manualmente primeiro, depois o resto
```

### "Permission denied"
**Solução:** Verifique se está logado na conta correta do Supabase com permissões de admin do projeto.

### "Invalid API key" após setup
**Solução:** Não relacionado ao banco. Verifique `js/supabase-config.js` e `dimaradmin/js/supabase-config.js`.

---

## 🎉 Resultado Final

Após executar o setup:

✅ Banco 100% compatível com admin  
✅ Todas as colunas necessárias criadas  
✅ Índices otimizados  
✅ Dados iniciais inseridos  
✅ RLS configurado  
✅ Pronto para produção (após ajustar auth)

---

**Tempo total estimado:** 5-10 minutos  
**Complexidade:** Baixa (copiar/colar e executar)  
**Reversível:** Parcialmente (perde dados se tiver)

**Próximo passo:** Execute o script e teste!
