# 🔧 Guia Visual: Migration de Badges no Supabase

**Data:** 10/12/2024 12:38  
**Objetivo:** Adicionar colunas de badges na tabela `products`  
**Tempo estimado:** 5 minutos  
**Status:** 🟡 PENDENTE EXECUÇÃO

---

## 📋 O Que Esta Migration Faz

Adiciona 3 colunas essenciais na tabela `products`:

| Coluna | Tipo | Descrição |
|--------|------|-----------|
| `badge_type` | VARCHAR(50) | Tipo do badge (destaque, oferta, mais-vendido, personalizado) |
| `custom_badge_text` | VARCHAR(100) | Texto personalizado quando badge_type = "personalizado" |
| `short_description` | TEXT | Descrição curta do produto |

---

## 🚀 Passo a Passo Visual

### Passo 1: Acessar o Supabase

1. **Abra o navegador** e acesse:
   ```
   https://supabase.com/dashboard
   ```

2. **Faça login** com suas credenciais

3. **Selecione o projeto:** `jfiarqtqojfptdbddnvu`

---

### Passo 2: Abrir o SQL Editor

1. No **menu lateral esquerdo**, clique em **"SQL Editor"**

2. Clique em **"New Query"** (botão verde no canto superior direito)

![Supabase SQL Editor](C:\Users\Mayko\.gemini\antigravity\brain\a905d5a0-773c-463e-a82a-80f57690d938\supabase_sql_editor.webp)

---

### Passo 3: Copiar e Colar o Script de Migration

**Abra o arquivo de migration:**
- Caminho: [database/migration-add-badge-columns.sql](file:///C:/Users/Mayko/OneDrive/Área%20de%20Trabalho/dimarautosite/database/migration-add-badge-columns.sql)

**Script completo para copiar:**

```sql
-- =============================================================================
-- MIGRATION FINAL SIMPLIFICADA
-- Data: 09/12/2024 23:26
-- Apenas adiciona as colunas que realmente faltam
-- =============================================================================

-- Adicionar apenas as colunas dos badges (sem is_featured, sem is_bestseller)
ALTER TABLE products 
ADD COLUMN IF NOT EXISTS badge_type VARCHAR(50),
ADD COLUMN IF NOT EXISTS custom_badge_text VARCHAR(100),
ADD COLUMN IF NOT EXISTS short_description TEXT;

-- Criar índices
CREATE INDEX IF NOT EXISTS idx_products_badge_type ON products(badge_type);

-- Verificação
SELECT 
    column_name,
    data_type,
    CASE WHEN column_name IN ('badge_type', 'custom_badge_text', 'short_description') 
        THEN '✅ NOVA' 
        ELSE '  ' 
    END as status
FROM information_schema.columns
WHERE table_name = 'products'
ORDER BY ordinal_position;
```

**Cole o script** no editor SQL do Supabase

---

### Passo 4: Executar a Migration

1. **Revise o script** colado no editor

2. Clique no botão **"RUN"** (verde, canto inferior direito)

3. **Aguarde** a execução (deve levar menos de 5 segundos)

---

### Passo 5: Verificar o Resultado

Você deve ver uma **tabela com todas as colunas** da tabela `products`.

**O que procurar:**

✅ Deve aparecer pelo menos 3 linhas marcadas com **"✅ NOVA"**:
- `badge_type` | character varying | ✅ NOVA
- `custom_badge_text` | character varying | ✅ NOVA
- `short_description` | text | ✅ NOVA

![Resultado de Sucesso](C:\Users\Mayko\.gemini\antigravity\brain\a905d5a0-773c-463e-a82a-80f57690d938\migration_success_result.webp)

---

### Passo 6: Validação Final (Opcional)

Para **confirmar 100%** que as colunas foram criadas, execute esta query simples:

```sql
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_name = 'products'
  AND column_name IN ('badge_type', 'custom_badge_text', 'short_description')
ORDER BY column_name;
```

**Resultado esperado:**

| column_name | data_type | is_nullable |
|-------------|-----------|-------------|
| badge_type | character varying | YES |
| custom_badge_text | character varying | YES |
| short_description | text | YES |

✅ **Se aparecerem 3 linhas:** Migration OK!  
❌ **Se aparecerem 0 linhas:** Algo deu errado, veja troubleshooting abaixo

---

## 🐛 Troubleshooting

### Erro: "relation 'products' does not exist"

**Causa:** Tabela `products` não existe no banco

**Solução:**
1. Execute primeiro o setup completo: [database/SETUP-COMPLETO-BANCO.sql](file:///C:/Users/Mayko/OneDrive/Área%20de%20Trabalho/dimarautosite/database/SETUP-COMPLETO-BANCO.sql)
2. Depois execute a migration de badges

---

### Erro: "column already exists"

**Causa:** Coluna já foi criada antes

**Solução:**
- Isso é OK! O script usa `IF NOT EXISTS`, então não vai quebrar
- Ignore o aviso e prossiga

---

### Nenhuma linha com "✅ NOVA" aparece

**Causa:** Query de verificação não funcionou

**Solução:**
1. Execute a query de validação do Passo 6
2. Se retornar 3 linhas, a migration funcionou mesmo sem o marcador

---

## ✅ Após a Migration

### Próximos Passos:

1. **Testar no admin local:**
   ```bash
   cd "C:\Users\Mayko\OneDrive\Área de Trabalho\dimarautosite"
   python -m http.server 8000
   ```

2. **Adicionar produto com badge:**
   - Acesse: `http://localhost:8000/dimaradmin/login.html`
   - Login → Produtos → Adicionar Produto
   - Preencha e selecione um **tipo de badge**
   - Salvar

3. **Verificar no Supabase:**
   ```sql
   SELECT name, badge_type, custom_badge_text 
   FROM products 
   WHERE badge_type IS NOT NULL;
   ```

4. **Verificar na homepage:**
   - Abra: `http://localhost:8000/`
   - Hard refresh: `Ctrl + Shift + R`
   - Badge deve aparecer no produto

---

## 🎯 Como Saber que Deu Certo

✅ **Todos os indicadores de sucesso:**

- [ ] Query de migration executou sem erros
- [ ] Query de verificação retorna 3 linhas
- [ ] Produto com badge salva no admin sem erro "Could not find column"
- [ ] Badge aparece na homepage do site
- [ ] Console (F12) não mostra erros de "badge_type"

---

## 📞 Me Avise Quando Terminar

Após executar a migration com sucesso, **me avise** para que eu possa:

1. ✅ Marcar a task como concluída
2. 🧪 Iniciar os testes automatizados de funcionalidades
3. 🚀 Prosseguir para testes em produção

---

**Última atualização:** 2024-12-10 12:38  
**Status:** 🟡 Aguardando execução pelo usuário
