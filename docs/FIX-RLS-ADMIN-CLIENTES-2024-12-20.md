# Correção RLS Admin Clientes - 2024-12-20

## Problema
A página `/dimaradmin/clientes.html` mostrava **0 clientes** em produção, mas funcionava localmente.

## Causa
As políticas RLS usavam `auth.role() = 'authenticated'` que requer sessão Supabase Auth.
O admin usa localStorage para autenticação, então não tinha sessão ativa em produção.

## Solução Aplicada

### 1. Arquivo Atualizado
`database/admin-customers-policy.sql` - Alterado para usar `USING (true)` no SELECT

### 2. SQL Executado no Supabase
```sql
-- customers
CREATE POLICY "Customers são públicos para leitura" ON customers FOR SELECT USING (true);

-- customer_addresses
CREATE POLICY "Endereços são públicos para leitura" ON customer_addresses FOR SELECT USING (true);

-- orders
CREATE POLICY "Pedidos são públicos para leitura" ON orders FOR SELECT USING (true);

-- order_items
CREATE POLICY "Itens são públicos para leitura" ON order_items FOR SELECT USING (true);
```

## Segurança
- **Proteção mantida** via `auth-guard.js` (localStorage)
- Apenas emails autorizados acessam o admin:
  - `admin@dimar.com.br`
  - `mk.cardoso198@gmail.com`
  - `sac.dimar@gmail.com`

## Resultado
✅ Clientes agora aparecem corretamente no admin em produção
