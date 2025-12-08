# 🚀 Guia Rápido - Configurar Banco de Dados Supabase

## ✅ Status da Configuração

- ✅ Credenciais configuradas nos arquivos JavaScript
- ✅ Conexão pronta para uso
- ⏳ **FALTA**: Criar as tabelas no banco de dados

## 📋 Próximos Passos

### 1️⃣ Acessar o Supabase Dashboard

1. Acesse: https://supabase.com/dashboard
2. Faça login na sua conta
3. Selecione o projeto: **jfiarqtqojfptdbddnvu**

### 2️⃣ Criar as Tabelas

1. No menu lateral, clique em **SQL Editor**
2. Clique em **+ New query**
3. Copie e cole o conteúdo do arquivo `database/schema.sql`
4. Clique em **RUN** (ou pressione Ctrl+Enter)

**Resultado esperado**: ✅ As tabelas serão criadas com sucesso

### 3️⃣ Inserir Produtos de Exemplo (Opcional)

1. Ainda no **SQL Editor**, crie uma nova query
2. Copie e cole o conteúdo do arquivo `database/insert-products.sql`
3. Clique em **RUN**

**Resultado esperado**: ✅ Produtos, categorias e marcas de exemplo serão inseridos

### 4️⃣ Configurar Row Level Security (RLS)

Por padrão, o Supabase bloqueia acesso público. Você tem 2 opções:

#### Opção A: Desabilitar RLS (Mais Fácil - Para Desenvolvimento)

No SQL Editor, execute:

```sql
-- Permitir leitura pública
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE brands ENABLE ROW LEVEL SECURITY;
ALTER TABLE banners ENABLE ROW LEVEL SECURITY;

-- Criar políticas de leitura pública
CREATE POLICY "Enable read access for all users" ON products FOR SELECT USING (true);
CREATE POLICY "Enable read access for all users" ON categories FOR SELECT USING (true);
CREATE POLICY "Enable read access for all users" ON brands FOR SELECT USING (true);
CREATE POLICY "Enable read access for all users" ON banners FOR SELECT USING (true);
```

#### Opção B: RLS com Autenticação (Mais Seguro - Para Produção)

```sql
-- Permitir leitura pública, escrita apenas autenticados
CREATE POLICY "Enable read access for all users" ON products 
  FOR SELECT USING (true);

CREATE POLICY "Enable insert for authenticated users only" ON products 
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Enable update for authenticated users only" ON products 
  FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Enable delete for authenticated users only" ON products 
  FOR DELETE USING (auth.role() = 'authenticated');
```

### 5️⃣ Testar a Conexão

1. Abra o arquivo `test-supabase.html` no navegador
2. Clique em **🔍 Testar Conexão**
3. Clique em **📦 Buscar Produtos**

**Resultado esperado**: 
- ✅ Conexão estabelecida
- ✅ Produtos listados (se você executou o insert-products.sql)

## 📁 Estrutura do Banco de Dados

### Tabelas Criadas:

1. **categories** - Categorias de produtos
2. **brands** - Marcas parceiras
3. **products** - Produtos (peças automotivas)
4. **banners** - Banners do carrossel

### Relacionamentos:

- `products.category_id` → `categories.id`
- `products.brand_id` → `brands.id`

## 🔧 Painel Administrativo

Após configurar o banco:

1. Acesse: `seu-site.vercel.app/dimaradmin/login`
2. Use o login configurado no Supabase
3. Gerencie produtos, categorias, marcas e banners

## ⚠️ Troubleshooting

### Erro: "row-level security policy violation"

**Solução**: Execute os comandos RLS acima (Opção A ou B)

### Erro: "relation does not exist"

**Solução**: Execute o `database/schema.sql` para criar as tabelas

### Erro: "Invalid API key"

**Solução**: Verifique se as credenciais em `js/supabase-config.js` estão corretas

## 📞 Suporte

Se tiver problemas:

1. Verifique o console do navegador (F12)
2. Abra o `test-supabase.html` para diagnóstico
3. Confira o SQL Editor do Supabase para erros

---

**🎉 Depois de configurar tudo, seu site estará 100% funcional com banco de dados real!**

