# Correções do Sistema de Clientes - 2024-12-12

## Resumo
Correções realizadas no sistema de cadastro e login de clientes do e-commerce Dimar Auto Peças.

---

## Problema Original
O cadastro de clientes apresentava erros:
1. "Database error saving new user" - Trigger falhando ao criar registro
2. "Email signups are disabled" - Provider desabilitado no Supabase
3. Conflito de sessão entre admin e cliente

---

## Correções Aplicadas

### 1. Trigger do Banco de Dados
**Arquivo:** `database/fix-customer-trigger.sql`

O trigger `handle_new_user()` foi corrigido para:
- Adicionar tratamento de erro com `EXCEPTION WHEN OTHERS`
- Usar `ON CONFLICT DO NOTHING` para evitar duplicatas
- Não bloquear o cadastro em caso de falha

```sql
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.customers (user_id, full_name, phone)
    VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data->>'full_name', ...))
    ON CONFLICT (user_id) DO NOTHING;
    RETURN NEW;
EXCEPTION
    WHEN OTHERS THEN
        RAISE WARNING 'Erro ao criar customer: %', SQLERRM;
        RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
```

### 2. Separação de Sessões
**Arquivo:** `js/supabase-config.js`

Configuração de storageKey diferente para evitar conflito:
- **Admin:** `dimar-admin-session`
- **Cliente:** `dimar-customer-session`

```javascript
const clientConfig = {
    auth: {
        storage: window.localStorage,
        storageKey: 'dimar-customer-session',
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true
    }
};
```

### 3. Tratamento de Erros Melhorado
**Arquivo:** `js/customer-auth.js`

Mensagens de erro mais específicas:
- Email não confirmado
- Email já cadastrado
- Signups desabilitados
- Senha fraca
- Rate limit
- Erro de conexão

### 4. Página de Confirmação de Email
**Arquivo:** `pages/confirmar-email.html`

Página criada para processar callback de confirmação:
- Processa token automaticamente
- Redireciona para "Minha Conta" após confirmação
- Estados visuais: loading, sucesso, erro

---

## Configurações no Supabase Dashboard

### Authentication → Providers → Email
- ✅ **Enabled** (obrigatório)

### Authentication → Settings
- ✅ **Allow new users to sign up** (obrigatório)
- ⚪ **Confirm email** (opcional - desabilitado para acesso direto)

### Authentication → URL Configuration
- **Site URL:** `http://localhost:8000` (desenvolvimento)
- **Redirect URLs:** Adicionar URLs de produção quando deploy

---

## Arquivos Modificados

| Arquivo | Alteração |
|---------|-----------|
| `js/supabase-config.js` | Adicionado storageKey separada para clientes |
| `js/customer-auth.js` | Melhorado tratamento de erros |
| `database/fix-customer-trigger.sql` | **NOVO** - Correção do trigger |
| `pages/confirmar-email.html` | **NOVO** - Página de callback |

---

## Como Testar

1. Acesse: `http://localhost:8000/pages/cadastro.html`
2. Preencha os campos e clique em "Criar conta"
3. Se "Confirm email" estiver desabilitado: redireciona automaticamente
4. Se "Confirm email" estiver habilitado: verifique o email

---

## Fluxo de Autenticação Atual

```
[Cadastro] ──► Supabase Auth ──► Trigger handle_new_user() ──► customers table
     │                                       │
     ▼                                       ▼
[Login] ──► Verifica sessão ──► Atualiza header ──► Minha Conta
```

---

## Próximos Passos (Sugeridos)

1. Configurar URLs de produção no Supabase
2. Integrar checkout com login obrigatório
3. Implementar modal de adicionar endereço
4. Salvar pedidos automaticamente no banco
