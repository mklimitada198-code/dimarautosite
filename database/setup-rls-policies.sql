-- ==================== ROW LEVEL SECURITY (RLS) SETUP ====================
-- Execute este script APÓS criar as tabelas com schema.sql
-- Este script configura todas as políticas de segurança do Supabase

-- ==================== HABILITAR RLS EM TODAS AS TABELAS ====================

ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE brands ENABLE ROW LEVEL SECURITY;
ALTER TABLE banners ENABLE ROW LEVEL SECURITY;
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE addresses ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;

-- ==================== POLÍTICAS DE LEITURA PÚBLICA ====================
-- Tabelas que todos podem ler (produtos, categorias, marcas, banners)

-- PRODUCTS: Leitura pública
CREATE POLICY "Anyone can view products" 
  ON products 
  FOR SELECT 
  USING (true);

-- CATEGORIES: Leitura pública
CREATE POLICY "Anyone can view categories" 
  ON categories 
  FOR SELECT 
  USING (true);

-- BRANDS: Leitura pública
CREATE POLICY "Anyone can view brands" 
  ON brands 
  FOR SELECT 
  USING (true);

-- BANNERS: Leitura pública (apenas banners ativos)
CREATE POLICY "Anyone can view active banners" 
  ON banners 
  FOR SELECT 
  USING (
    is_active = true 
    AND (start_date IS NULL OR start_date <= NOW())
    AND (end_date IS NULL OR end_date >= NOW())
  );

-- ==================== POLÍTICAS DE ESCRITA (Admin/Authenticated) ====================
-- Apenas usuários autenticados podem inserir/editar/deletar

-- PRODUCTS: Escrita apenas para autenticados
CREATE POLICY "Authenticated users can insert products" 
  ON products 
  FOR INSERT 
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can update products" 
  ON products 
  FOR UPDATE 
  USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can delete products" 
  ON products 
  FOR DELETE 
  USING (auth.role() = 'authenticated');

-- CATEGORIES: Escrita apenas para autenticados
CREATE POLICY "Authenticated users can insert categories" 
  ON categories 
  FOR INSERT 
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can update categories" 
  ON categories 
  FOR UPDATE 
  USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can delete categories" 
  ON categories 
  FOR DELETE 
  USING (auth.role() = 'authenticated');

-- BRANDS: Escrita apenas para autenticados
CREATE POLICY "Authenticated users can insert brands" 
  ON brands 
  FOR INSERT 
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can update brands" 
  ON brands 
  FOR UPDATE 
  USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can delete brands" 
  ON brands 
  FOR DELETE 
  USING (auth.role() = 'authenticated');

-- BANNERS: Escrita apenas para autenticados
CREATE POLICY "Authenticated users can insert banners" 
  ON banners 
  FOR INSERT 
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can update banners" 
  ON banners 
  FOR UPDATE 
  USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can delete banners" 
  ON banners 
  FOR DELETE 
  USING (auth.role() = 'authenticated');

-- ==================== POLÍTICAS PARA CUSTOMERS ====================
-- Usuários podem ver e editar apenas seus próprios dados

-- CUSTOMERS: Leitura dos próprios dados
CREATE POLICY "Users can view own customer data" 
  ON customers 
  FOR SELECT 
  USING (auth.uid() = user_id);

-- CUSTOMERS: Criação (ao fazer primeiro cadastro)
CREATE POLICY "Users can create own customer record" 
  ON customers 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

-- CUSTOMERS: Atualização dos próprios dados
CREATE POLICY "Users can update own customer data" 
  ON customers 
  FOR UPDATE 
  USING (auth.uid() = user_id);

-- ==================== POLÍTICAS PARA ADDRESSES ====================
-- Usuários podem gerenciar apenas seus próprios endereços

-- ADDRESSES: Leitura
CREATE POLICY "Users can view own addresses" 
  ON addresses 
  FOR SELECT 
  USING (
    customer_id IN (
      SELECT id FROM customers WHERE user_id = auth.uid()
    )
  );

-- ADDRESSES: Inserção
CREATE POLICY "Users can create own addresses" 
  ON addresses 
  FOR INSERT 
  WITH CHECK (
    customer_id IN (
      SELECT id FROM customers WHERE user_id = auth.uid()
    )
  );

-- ADDRESSES: Atualização
CREATE POLICY "Users can update own addresses" 
  ON addresses 
  FOR UPDATE 
  USING (
    customer_id IN (
      SELECT id FROM customers WHERE user_id = auth.uid()
    )
  );

-- ADDRESSES: Exclusão
CREATE POLICY "Users can delete own addresses" 
  ON addresses 
  FOR DELETE 
  USING (
    customer_id IN (
      SELECT id FROM customers WHERE user_id = auth.uid()
    )
  );

-- ==================== POLÍTICAS PARA ORDERS ====================
-- Usuários podem ver apenas seus próprios pedidos

-- ORDERS: Leitura
CREATE POLICY "Users can view own orders" 
  ON orders 
  FOR SELECT 
  USING (
    customer_id IN (
      SELECT id FROM customers WHERE user_id = auth.uid()
    )
  );

-- ORDERS: Criação
CREATE POLICY "Users can create own orders" 
  ON orders 
  FOR INSERT 
  WITH CHECK (
    customer_id IN (
      SELECT id FROM customers WHERE user_id = auth.uid()
    )
  );

-- ORDERS: Atualização (apenas status/tracking pelo próprio usuário)
CREATE POLICY "Users can update own orders" 
  ON orders 
  FOR UPDATE 
  USING (
    customer_id IN (
      SELECT id FROM customers WHERE user_id = auth.uid()
    )
  );

-- ==================== POLÍTICAS PARA ORDER_ITEMS ====================
-- Usuários podem ver itens dos próprios pedidos

-- ORDER_ITEMS: Leitura
CREATE POLICY "Users can view own order items" 
  ON order_items 
  FOR SELECT 
  USING (
    order_id IN (
      SELECT id FROM orders 
      WHERE customer_id IN (
        SELECT id FROM customers WHERE user_id = auth.uid()
      )
    )
  );

-- ORDER_ITEMS: Inserção (ao criar pedido)
CREATE POLICY "Users can create order items for own orders" 
  ON order_items 
  FOR INSERT 
  WITH CHECK (
    order_id IN (
      SELECT id FROM orders 
      WHERE customer_id IN (
        SELECT id FROM customers WHERE user_id = auth.uid()
      )
    )
  );

-- ==================== POLÍTICAS ADMINISTRATIVAS ====================
-- Admin pode ver todos os banners (mesmo inativos)

CREATE POLICY "Authenticated users can view all banners" 
  ON banners 
  FOR SELECT 
  USING (auth.role() = 'authenticated');

-- ==================== VERIFICAÇÃO ====================
-- Execute para ver todas as políticas criadas:
-- SELECT schemaname, tablename, policyname 
-- FROM pg_policies 
-- WHERE schemaname = 'public' 
-- ORDER BY tablename, policyname;

-- ==================== NOTAS IMPORTANTES ====================
-- 
-- 1. RLS está habilitado em TODAS as tabelas
-- 2. Leitura PÚBLICA para: products, categories, brands, banners (ativos)
-- 3. Escrita APENAS para usuários autenticados
-- 4. Customers, addresses, orders: Isolamento por usuário (auth.uid())
-- 5. Admin (authenticated) pode gerenciar produtos, categorias, marcas e banners
-- 
-- SEGURANÇA:
-- - Anon Key (pública) pode apenas LER dados públicos
-- - Service Role Key NÃO deve ser usada no frontend
-- - Usuários autenticados podem gerenciar dados do catálogo
-- - Cada usuário vê apenas seus próprios pedidos e endereços
-- 
-- PRÓXIMOS PASSOS:
-- 1. Criar usuário admin no Supabase Authentication
-- 2. Testar políticas com test-supabase.html
-- 3. Verificar que usuários não autenticados podem LER mas não ESCREVER
-- 4. Confirmar que usuários autenticados podem gerenciar o catálogo


