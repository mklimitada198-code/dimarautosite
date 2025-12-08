# 🚀 GUIA COMPLETO - INTEGRAÇÃO SUPABASE

> Passo a passo para conectar o site Dimar ao Supabase

**Data:** 08/12/2024  
**Status:** ✅ Pronto para implementação

---

## 📋 ÍNDICE

1. [Criação do Projeto Supabase](#1-criação-do-projeto-supabase)
2. [Configuração do Banco de Dados](#2-configuração-do-banco-de-dados)
3. [Configuração do Storage](#3-configuração-do-storage)
4. [Integração com o Site](#4-integração-com-o-site)
5. [Testes](#5-testes)
6. [Troubleshooting](#troubleshooting)

---

## 1. CRIAÇÃO DO PROJETO SUPABASE

### Passo 1.1: Criar Conta
1. Acesse [supabase.com](https://supabase.com)
2. Clique em **"Start your project"**
3. Faça login com GitHub, Google ou Email

### Passo 1.2: Criar Novo Projeto
1. Clique em **"New Project"**
2. Preencha:
   - **Name:** `dimar-autopecas`
   - **Database Password:** (anote essa senha!)
   - **Region:** South America (São Paulo)
   - **Pricing Plan:** Free (ou escolha outro)
3. Clique em **"Create new project"**
4. Aguarde ~2 minutos

### Passo 1.3: Obter Credenciais
1. No menu lateral, clique em **"Project Settings"** (ícone de engrenagem)
2. Clique em **"API"**
3. Copie:
   - **Project URL** (ex: https://xxxxx.supabase.co)
   - **anon public** key (chave grande)

---

## 2. CONFIGURAÇÃO DO BANCO DE DADOS

### Passo 2.1: Executar Schema SQL
1. No menu lateral do Supabase, clique em **"SQL Editor"**
2. Clique em **"+ New query"**
3. Abra o arquivo `database/schema.sql` deste projeto
4. **Copie TODO o conteúdo** do arquivo
5. **Cole** no SQL Editor do Supabase
6. Clique em **"Run"** (ou pressione CTRL + Enter)
7. Aguarde a mensagem **"Success. No rows returned"**

### Passo 2.2: Verificar Tabelas Criadas
1. No menu lateral, clique em **"Table Editor"**
2. Você deve ver:
   - ✅ products
   - ✅ categories
   - ✅ brands
   - ✅ banners
   - ✅ customers
   - ✅ addresses
   - ✅ orders
   - ✅ order_items
   - ✅ reviews
   - ✅ coupons

### Passo 2.3: Verificar Dados Iniciais
1. Clique na tabela **"categories"**
2. Você deve ver 7 categorias:
   - Freios
   - Motor
   - Suspensão
   - Elétrica
   - Filtros
   - Iluminação
   - Acessórios

3. Clique na tabela **"brands"**
4. Você deve ver 10 marcas:
   - Fras-le, Mann Filter, Cofap, Moura, etc.

---

## 3. CONFIGURAÇÃO DO STORAGE

### Passo 3.1: Criar Buckets
1. No menu lateral, clique em **"Storage"**
2. Clique em **"Create a new bucket"**

**Bucket 1: products**
- Name: `products`
- Public bucket: ✅ **Marque como público**
- File size limit: 5 MB
- Clique em **"Create bucket"**

**Bucket 2: banners**
- Name: `banners`
- Public bucket: ✅ **Marque como público**
- File size limit: 10 MB
- Clique em **"Create bucket"**

**Bucket 3: brands**
- Name: `brands`
- Public bucket: ✅ **Marque como público**
- File size limit: 2 MB
- Clique em **"Create bucket"**

### Passo 3.2: Configurar Políticas de Storage
1. Clique em cada bucket
2. Clique em **"Policies"**
3. Clique em **"New policy"**
4. Escolha **"Give public access to bucket"**
5. Clique em **"Review"** e depois **"Save policy"**

---

## 4. INTEGRAÇÃO COM O SITE

### Passo 4.1: Adicionar SDK do Supabase
1. Abra o arquivo `index.html`
2. **ANTES** de `</head>`, adicione:

```html
<!-- Supabase SDK -->
<script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"></script>
```

### Passo 4.2: Configurar Credenciais
1. Abra o arquivo `js/supabase-config.js`
2. Localize as linhas:

```javascript
const SUPABASE_URL = 'YOUR_SUPABASE_URL_HERE';
const SUPABASE_ANON_KEY = 'YOUR_SUPABASE_ANON_KEY_HERE';
```

3. **Substitua** com suas credenciais (do Passo 1.3):

```javascript
const SUPABASE_URL = 'https://xxxxx.supabase.co'; // Sua URL
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...'; // Sua chave
```

### Passo 4.3: Adicionar Scripts ao HTML
1. Abra `index.html`
2. Localize a seção de scripts (antes de `</body>`)
3. **ADICIONE** estes scripts **APÓS** `logger.js`:

```html
<!-- Supabase -->
<script src="js/supabase-config.js"></script>
<script src="js/supabase-products.js"></script>
```

**Ordem correta dos scripts:**
```html
<script src="js/logger.js"></script>
<script src="js/supabase-config.js"></script>
<script src="js/supabase-products.js"></script>
<script src="js/navigation-fix.js"></script>
<!-- ... resto dos scripts -->
```

### Passo 4.4: Adicionar ao Painel Admin
1. Abra `dimaradmin/index.html`
2. **ANTES** de `</head>`, adicione:

```html
<script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"></script>
```

3. **ANTES** de `</body>`, adicione:

```html
<script src="../js/supabase-config.js"></script>
<script src="../js/supabase-products.js"></script>
```

---

## 5. TESTES

### Teste 5.1: Verificar Conexão
1. Abra o site: `http://localhost:8000`
2. Pressione **F12** (abrir Console)
3. Você deve ver:
   ```
   ✅ Supabase conectado com sucesso!
   ✅ Supabase pronto para uso!
   ✅ Products Service inicializado!
   ```

4. Se ver **"Supabase em modo MOCK"**, as credenciais estão erradas.

### Teste 5.2: Testar API de Produtos
No console do navegador (F12), execute:

```javascript
// Buscar todos os produtos
productsService.getAll().then(result => console.log(result));

// Buscar produtos em destaque
productsService.getFeatured(5).then(result => console.log(result));

// Buscar por categoria
productsService.getAll({ category: 'Freios' }).then(result => console.log(result));
```

### Teste 5.3: Inserir Produto de Teste
No console do navegador:

```javascript
const testProduct = {
    sku: 'TEST-001',
    name: 'Produto de Teste',
    description: 'Teste de integração Supabase',
    category: 'Freios',
    brand: 'Fras-le',
    vehicle_type: 'Carro',
    price: 99.90,
    sale_price: 79.90,
    stock: 10,
    compatibility: ['Gol', 'Palio'],
    specifications: { material: 'Cerâmica' },
    fast_shipping: true,
    in_stock: true,
    featured: true
};

productsService.create(testProduct).then(result => console.log(result));
```

Se retornar `success: true`, está funcionando! ✅

---

## 6. INSERIR PRODUTOS REAIS

### Opção A: Via Console do Navegador
```javascript
const produtos = [
    {
        sku: 'FRE-001',
        name: 'Kit Pastilha de Freio Dianteira Cerâmica',
        description: 'Kit completo de pastilhas de freio dianteiras em material cerâmico de alta performance.',
        category: 'Freios',
        brand: 'Fras-le',
        vehicle_type: 'Carro',
        price: 149.90,
        sale_price: 119.90,
        stock: 45,
        image_url: 'https://via.placeholder.com/400x400/FF6B00/FFFFFF?text=Pastilha+Freio',
        compatibility: ['Gol', 'Palio', 'Uno', 'Corsa'],
        specifications: { material: 'Cerâmica', posicao: 'Dianteira', garantia: '1 ano' },
        fast_shipping: true,
        in_stock: true,
        featured: true,
        badge: 'NOVO',
        rating: 4.8,
        reviews_count: 156
    },
    // ... adicione mais produtos
];

// Inserir todos
produtos.forEach(async (produto) => {
    const result = await productsService.create(produto);
    console.log(result);
});
```

### Opção B: Via SQL Editor do Supabase
1. Vá em **SQL Editor**
2. Execute:

```sql
INSERT INTO products (sku, name, description, category, brand, vehicle_type, price, sale_price, stock, image_url, compatibility, specifications, fast_shipping, in_stock, featured, badge, rating, reviews_count)
VALUES 
('FRE-001', 'Kit Pastilha de Freio Dianteira Cerâmica', 'Kit completo...', 'Freios', 'Fras-le', 'Carro', 149.90, 119.90, 45, 'https://...', ARRAY['Gol', 'Palio'], '{"material": "Cerâmica"}'::jsonb, true, true, true, 'NOVO', 4.8, 156);
```

### Opção C: Via Painel Admin (Melhor)
1. Acesse `http://localhost:8000/dimaradmin`
2. Faça login (após configurar auth)
3. Vá em **"Produtos"**
4. Clique em **"Adicionar Produto"**
5. Preencha o formulário
6. Clique em **"Salvar"**

---

## TROUBLESHOOTING

### ❌ "Supabase em modo MOCK"
**Causa:** Credenciais não configuradas
**Solução:** Verifique se substituiu as credenciais no `supabase-config.js`

### ❌ "Failed to fetch"
**Causa:** URL errada ou projeto inativo
**Solução:** Verifique a URL no Supabase Dashboard

### ❌ "Invalid API key"
**Causa:** Chave anon incorreta
**Solução:** Copie novamente a chave do Supabase (Settings → API)

### ❌ "Row Level Security"
**Causa:** Políticas RLS bloqueando
**Solução:** Verifique se as políticas foram criadas corretamente no schema.sql

### ❌ "Permission denied for storage"
**Causa:** Bucket não público ou sem policy
**Solução:** Configure os buckets como públicos (Passo 3)

---

## 📊 CHECKLIST FINAL

Antes de ir para produção, verifique:

- [ ] ✅ Projeto Supabase criado
- [ ] ✅ Schema SQL executado
- [ ] ✅ Tabelas criadas (10 tabelas)
- [ ] ✅ Dados iniciais inseridos (categorias e marcas)
- [ ] ✅ Buckets de storage criados (3 buckets)
- [ ] ✅ Políticas de storage configuradas
- [ ] ✅ SDK do Supabase adicionado ao HTML
- [ ] ✅ Credenciais configuradas no JS
- [ ] ✅ Scripts adicionados ao index.html
- [ ] ✅ Teste de conexão realizado
- [ ] ✅ Teste de API realizado
- [ ] ✅ Produto de teste inserido
- [ ] ✅ Console sem erros

---

## 🎯 PRÓXIMOS PASSOS

Após configurar o Supabase:

1. **Migrar produtos mock para Supabase**
2. **Configurar autenticação de admin**
3. **Conectar painel admin ao Supabase**
4. **Upload de imagens reais**
5. **Sistema de pedidos**
6. **Integração com pagamento**

---

## 📚 DOCUMENTAÇÃO OFICIAL

- [Supabase Docs](https://supabase.com/docs)
- [Supabase JavaScript Client](https://supabase.com/docs/reference/javascript/introduction)
- [Row Level Security](https://supabase.com/docs/guides/auth/row-level-security)
- [Storage](https://supabase.com/docs/guides/storage)

---

**Status:** ✅ Guia completo criado  
**Última atualização:** 08/12/2024  
**Responsável:** Integração Supabase Dimar

