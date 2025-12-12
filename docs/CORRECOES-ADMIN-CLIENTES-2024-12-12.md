# Correções da Página de Clientes (Admin) - 2024-12-12

## Problema
A página `/dimaradmin/clientes.html` mostrava "Erro de conexão" e não listava os clientes cadastrados.

---

## Causas Identificadas

1. **Referência incorreta ao Supabase** - O script usava `supabase` ao invés de `window.supabaseClient`
2. **Falta de políticas RLS** - Admin não tinha permissão para ler tabela `customers`
3. **Usuários antigos não sincronizados** - Usuários cadastrados antes do trigger não tinham registro em `customers`

---

## Correções Aplicadas

### 1. Script clientes.js
**Arquivo:** `dimaradmin/js/clientes.js`

Adicionada inicialização correta do Supabase:
```javascript
let supabase = null;

async function init() {
    // Aguardar Supabase
    while (!window.supabaseClient && attempts < 50) {
        await new Promise(r => setTimeout(r, 100));
        attempts++;
    }
    supabase = window.supabaseClient;
}
```

### 2. Políticas RLS para Admin
**Arquivo:** `database/admin-customers-policy.sql`

```sql
CREATE POLICY "Admin pode ver todos clientes" ON customers
    FOR SELECT USING (auth.role() = 'authenticated');
```

Tabelas afetadas: `customers`, `customer_addresses`, `orders`, `order_items`

### 3. Sincronização de Usuários Antigos

Para sincronizar usuários que já existiam antes do trigger:

```sql
INSERT INTO public.customers (user_id, name, email, phone)
SELECT 
    id as user_id,
    COALESCE(raw_user_meta_data->>'full_name', split_part(email, '@', 1)) as name,
    email,
    raw_user_meta_data->>'phone' as phone
FROM auth.users
WHERE id NOT IN (SELECT user_id FROM public.customers WHERE user_id IS NOT NULL);
```

---

## Schema da Tabela customers

| Coluna | Tipo |
|--------|------|
| id | uuid |
| user_id | uuid |
| name | varchar |
| email | varchar |
| phone | varchar |
| cpf | varchar |
| birth_date | date |
| created_at | timestamp |
| updated_at | timestamp |

---

## Arquivos Modificados

| Arquivo | Alteração |
|---------|-----------|
| `dimaradmin/js/clientes.js` | Corrigida referência ao supabaseClient |
| `database/admin-customers-policy.sql` | Políticas RLS para admin |

---

## Como Testar

1. Execute `admin-customers-policy.sql` no Supabase SQL Editor
2. Execute o SQL de sincronização (item 3 acima) se houver usuários antigos
3. Acesse `/dimaradmin/clientes.html`
4. Os clientes devem aparecer na lista
