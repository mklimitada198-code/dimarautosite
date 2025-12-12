-- =====================================================
-- DIMAR AUTO PEÇAS - Políticas RLS para Admin ver Clientes
-- Execute no SQL Editor do Supabase
-- =====================================================

-- =====================================================
-- 1. POLÍTICAS PARA TABELA customers
-- =====================================================

-- Permitir que qualquer usuário autenticado veja todos os clientes
-- (Necessário para o painel admin funcionar)
DROP POLICY IF EXISTS "Admin pode ver todos clientes" ON customers;
CREATE POLICY "Admin pode ver todos clientes" ON customers
    FOR SELECT
    USING (auth.role() = 'authenticated');

-- Alternativamente, se quiser restringir apenas para certos emails:
-- CREATE POLICY "Admin pode ver todos clientes" ON customers
--     FOR SELECT
--     USING (
--         auth.jwt()->>'email' IN ('admin@dimar.com.br', 'mk.cardoso198@gmail.com')
--     );

-- =====================================================
-- 2. POLÍTICAS PARA TABELA customer_addresses
-- =====================================================

DROP POLICY IF EXISTS "Admin pode ver todos enderecos" ON customer_addresses;
CREATE POLICY "Admin pode ver todos enderecos" ON customer_addresses
    FOR SELECT
    USING (auth.role() = 'authenticated');

-- =====================================================
-- 3. POLÍTICAS PARA TABELA orders
-- =====================================================

DROP POLICY IF EXISTS "Admin pode ver todos pedidos" ON orders;
CREATE POLICY "Admin pode ver todos pedidos" ON orders
    FOR SELECT
    USING (auth.role() = 'authenticated');

-- =====================================================
-- 4. POLÍTICAS PARA TABELA order_items
-- =====================================================

DROP POLICY IF EXISTS "Admin pode ver todos itens" ON order_items;
CREATE POLICY "Admin pode ver todos itens" ON order_items
    FOR SELECT
    USING (auth.role() = 'authenticated');

-- =====================================================
-- PRONTO! Execute este arquivo no SQL Editor do Supabase
-- Depois atualize a página de clientes no admin
-- =====================================================
