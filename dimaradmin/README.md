# 🎯 Painel Admin - Dimar Auto Peças & Moto Peças

## 📋 Visão Geral

Painel administrativo completo para gerenciar todo o conteúdo do site Dimar.

### ✨ Funcionalidades

- **Dashboard** - Visão geral de estatísticas e ações rápidas
- **Produtos** - Adicionar, editar e excluir produtos com múltiplas imagens
- **Categorias** - Gerenciar categorias do menu e do carrossel
- **Banners** - Gerenciar banners do carrossel principal
- **Marcas** - Gerenciar logos das marcas parceiras

## 🚀 Como Acessar

1. **Acessar Login:**
   ```
   http://localhost:8000/dimaradmin/login.html
   ```

2. **Credenciais Temporárias:**
   - **Email:** admin@dimar.com.br
   - **Senha:** admin123

## ⚙️ Configuração do Supabase (Opcional)

Por padrão, o painel funciona com **localStorage** (dados salvos no navegador).

Para integrar com Supabase (banco de dados real):

### Passo 1: Criar Projeto no Supabase

1. Acesse: https://supabase.com
2. Faça login/cadastro
3. Clique em "New Project"
4. Escolha região: **South America (São Paulo)**
5. Defina nome e senha do banco

### Passo 2: Obter Credenciais

1. No painel do Supabase, vá em **Settings > API**
2. Copie:
   - **Project URL** (URL)
   - **anon public** (Anon Key)

### Passo 3: Configurar no Painel

Edite o arquivo: `dimaradmin/js/supabase-config.js`

```javascript
// Substitua estas linhas:
const SUPABASE_URL = 'https://seu-projeto.supabase.co';
const SUPABASE_ANON_KEY = 'sua-chave-aqui';

// Por suas credenciais reais:
const SUPABASE_URL = 'https://xxxxxxxx.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...';
```

### Passo 4: Criar Tabelas no Supabase

Execute estas queries no **SQL Editor** do Supabase:

```sql
-- Tabela de Produtos
CREATE TABLE products (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    sku TEXT NOT NULL UNIQUE,
    category TEXT NOT NULL,
    brand TEXT,
    price DECIMAL(10,2) NOT NULL,
    sale_price DECIMAL(10,2),
    stock INTEGER NOT NULL DEFAULT 0,
    status TEXT NOT NULL DEFAULT 'active',
    short_description TEXT,
    description TEXT,
    is_featured BOOLEAN DEFAULT false,
    fast_shipping BOOLEAN DEFAULT false,
    images JSONB,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Tabela de Categorias com Imagem
CREATE TABLE image_categories (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    link TEXT NOT NULL,
    image TEXT NOT NULL,
    is_active BOOLEAN DEFAULT true,
    order_index INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Tabela de Banners
CREATE TABLE banners (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT,
    description TEXT,
    link TEXT,
    image TEXT NOT NULL,
    order_index INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Tabela de Marcas
CREATE TABLE brands (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    logo TEXT NOT NULL,
    link TEXT,
    order_index INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT NOW()
);
```

### Passo 5: Habilitar Row Level Security (RLS)

Para proteger os dados, execute:

```sql
-- Habilitar RLS em todas as tabelas
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE image_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE banners ENABLE ROW LEVEL SECURITY;
ALTER TABLE brands ENABLE ROW LEVEL SECURITY;

-- Criar políticas (permitir tudo para admin autenticado)
CREATE POLICY "Admins podem fazer tudo em products" ON products
    FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Admins podem fazer tudo em image_categories" ON image_categories
    FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Admins podem fazer tudo em banners" ON banners
    FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Admins podem fazer tudo em brands" ON brands
    FOR ALL USING (auth.role() = 'authenticated');
```

### Passo 6: Criar Usuário Admin

No **SQL Editor**:

```sql
-- Criar usuário admin (substitua o email e senha)
INSERT INTO auth.users (email, encrypted_password, email_confirmed_at)
VALUES (
    'admin@dimar.com.br',
    crypt('admin123', gen_salt('bf')),
    NOW()
);
```

## 📂 Estrutura de Arquivos

```
dimaradmin/
├── index.html           # Dashboard
├── login.html           # Login
├── produtos.html        # Gestão de Produtos
├── categorias.html      # Gestão de Categorias
├── banners.html         # Gestão de Banners
├── marcas.html          # Gestão de Marcas
├── css/
│   └── admin.css        # Estilos do painel
├── js/
│   ├── supabase-config.js   # Config Supabase
│   ├── produtos.js          # Lógica de produtos
│   ├── categorias.js        # Lógica de categorias
│   ├── banners.js           # Lógica de banners
│   └── marcas.js            # Lógica de marcas
└── README.md            # Este arquivo
```

## 🎨 Características do Design

- ✅ Design moderno e profissional
- ✅ Sidebar responsiva e colapsável
- ✅ Interface intuitiva
- ✅ Suporte a drag & drop para imagens
- ✅ Modais para adicionar/editar
- ✅ Filtros e busca em tempo real
- ✅ Feedback visual (alertas, badges)
- ✅ 100% responsivo (mobile-first)

## 🔒 Segurança

- Login obrigatório para acessar páginas
- Credenciais armazenadas localmente (ou no Supabase)
- Validação de formulários
- Suporte a RLS (Row Level Security) no Supabase

## 💡 Dicas

1. **Sem Supabase?** O painel funciona perfeitamente com localStorage
2. **Backup dos dados:** Os dados no localStorage ficam salvos no navegador
3. **Testes:** Use as credenciais temporárias para testar tudo
4. **Imagens:** Aceita PNG, JPG até 5MB por imagem

## 🆘 Suporte

Para dúvidas ou problemas:
1. Verifique o console do navegador (F12)
2. Confirme se o servidor local está rodando
3. Verifique as credenciais do Supabase (se usar)

---

**Desenvolvido para Dimar - Auto Peças & Moto Peças** 🚗🏍️

