-- =====================================================
-- DIMAR AUTO PEÇAS - Políticas RLS para Admin ver Clientes
-- Execute no SQL Editor do Supabase
-- =====================================================
-- 
-- SEGURANÇA:
-- - SELECT é público (proteção via JavaScript/localStorage no admin)
-- - INSERT/UPDATE/DELETE continua protegido pelo RLS padrão
-- - Apenas emails liberados acessam o admin (auth-guard.js)
--
-- =====================================================

-- =====================================================
-- 1. POLÍTICAS PARA TABELA customers
-- =====================================================

-- Remover políticas antigas
DROP POLICY IF EXISTS "Admin pode ver todos clientes" ON customers;
DROP POLICY IF EXISTS "Clientes podem ver próprio perfil" ON customers;
DROP POLICY IF EXISTS "Customers são públicos para leitura" ON customers;

-- Permitir leitura pública (admin protege via JavaScript)
CREATE POLICY "Customers são públicos para leitura" ON customers
    FOR SELECT
    USING (true);

-- =====================================================
-- 2. POLÍTICAS PARA TABELA customer_addresses
-- =====================================================

DROP POLICY IF EXISTS "Admin pode ver todos enderecos" ON customer_addresses;
DROP POLICY IF EXISTS "Cliente pode ver próprios endereços" ON customer_addresses;
DROP POLICY IF EXISTS "Endereços são públicos para leitura" ON customer_addresses;

CREATE POLICY "Endereços são públicos para leitura" ON customer_addresses
    FOR SELECT
    USING (true);

-- =====================================================
-- 3. POLÍTICAS PARA TABELA orders
-- =====================================================

DROP POLICY IF EXISTS "Admin pode ver todos pedidos" ON orders;
DROP POLICY IF EXISTS "Cliente pode ver próprios pedidos" ON orders;
DROP POLICY IF EXISTS "Pedidos são públicos para leitura" ON orders;

CREATE POLICY "Pedidos são públicos para leitura" ON orders
    FOR SELECT
    USING (true);

-- =====================================================
-- 4. POLÍTICAS PARA TABELA order_items
-- =====================================================

DROP POLICY IF EXISTS "Admin pode ver todos itens" ON order_items;
DROP POLICY IF EXISTS "Cliente pode ver itens dos próprios pedidos" ON order_items;
DROP POLICY IF EXISTS "Itens são públicos para leitura" ON order_items;

CREATE POLICY "Itens são públicos para leitura" ON order_items
    FOR SELECT
    USING (true);

-- =====================================================
-- VERIFICAÇÃO
-- =====================================================
SELECT tablename, policyname FROM pg_policies 
WHERE tablename IN ('customers', 'customer_addresses', 'orders', 'order_items');

-- =====================================================
-- PRONTO! Execute este arquivo no SQL Editor do Supabase
-- Depois atualize a página de clientes no admin
-- =====================================================

