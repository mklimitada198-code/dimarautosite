-- =====================================================
-- POLICY: Permitir Admin visualizar todos os clientes
-- Data: 2024-12-12
-- Execute no SQL Editor do Supabase
-- =====================================================

-- Permitir admin (usuário autenticado) visualizar todos os clientes
DROP POLICY IF EXISTS "Admin can view all customers" ON customers;
CREATE POLICY "Admin can view all customers" ON customers
    FOR SELECT USING (auth.role() = 'authenticated');

-- Permitir admin visualizar todos os endereços (para detalhes do cliente)
DROP POLICY IF EXISTS "Admin can view all addresses" ON customer_addresses;
CREATE POLICY "Admin can view all addresses" ON customer_addresses
    FOR SELECT USING (auth.role() = 'authenticated');

-- Permitir admin visualizar todos os pedidos
DROP POLICY IF EXISTS "Admin can view all orders" ON orders;
CREATE POLICY "Admin can view all orders" ON orders
    FOR SELECT USING (auth.role() = 'authenticated');

-- Verificar policies criadas
SELECT schemaname, tablename, policyname 
FROM pg_policies 
WHERE tablename IN ('customers', 'customer_addresses', 'orders')
  AND policyname LIKE 'Admin%'
ORDER BY tablename;
