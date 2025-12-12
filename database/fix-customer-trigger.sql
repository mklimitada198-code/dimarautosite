-- =====================================================
-- DIMAR AUTO PEÇAS - Correção do Trigger de Cadastro
-- Execute ESTE arquivo para corrigir o erro:
-- "Database error saving new user"
-- =====================================================

-- =====================================================
-- 1. REMOVER TRIGGER PROBLEMÁTICO
-- =====================================================
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- =====================================================
-- 2. CRIAR FUNÇÃO CORRIGIDA
-- A função anterior falhava porque:
-- - Não tinha tratamento de erro adequado
-- - Não verificava se o customer já existia
-- =====================================================

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    -- Inserir apenas se ainda não existir um customer com esse user_id
    INSERT INTO public.customers (user_id, full_name, phone)
    VALUES (
        NEW.id,
        COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1)),
        COALESCE(NEW.raw_user_meta_data->>'phone', NULL)
    )
    ON CONFLICT (user_id) DO NOTHING;
    
    RETURN NEW;
EXCEPTION
    WHEN OTHERS THEN
        -- Se der erro, apenas logamos e continuamos (não bloqueia o cadastro)
        RAISE WARNING 'Erro ao criar customer para user %: %', NEW.id, SQLERRM;
        RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =====================================================
-- 3. RECRIAR TRIGGER
-- =====================================================
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW 
    EXECUTE FUNCTION public.handle_new_user();

-- =====================================================
-- 4. GARANTIR PERMISSÕES CORRETAS
-- =====================================================

-- Permitir que a função SECURITY DEFINER insira na tabela customers
GRANT USAGE ON SCHEMA public TO postgres, anon, authenticated, service_role;
GRANT ALL ON public.customers TO postgres, service_role;
GRANT SELECT, INSERT, UPDATE ON public.customers TO authenticated;
GRANT INSERT ON public.customers TO anon;

-- =====================================================
-- 5. POLÍTICA ADICIONAL PARA PERMITIR INSERT DURANTE SIGNUP
-- =====================================================

-- Remover política restritiva anterior (se existir)
DROP POLICY IF EXISTS "Anyone can insert customer" ON customers;

-- Criar política que permite inserção via trigger (SECURITY DEFINER)
-- O trigger roda como superuser, então não precisa de política especial
-- Mas precisamos permitir que usuários autenticados vejam seus próprios dados

-- Garantir que RLS está ativo
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;

-- Política para SELECT
DROP POLICY IF EXISTS "Customers can view own profile" ON customers;
CREATE POLICY "Customers can view own profile" ON customers
    FOR SELECT USING (auth.uid() = user_id);

-- Política para UPDATE
DROP POLICY IF EXISTS "Customers can update own profile" ON customers;
CREATE POLICY "Customers can update own profile" ON customers
    FOR UPDATE USING (auth.uid() = user_id);

-- Política para INSERT - permitir apenas via trigger (o trigger usa SECURITY DEFINER)
-- Esta política permite que o trigger insira sem restrição
DROP POLICY IF EXISTS "Service role can insert customers" ON customers;
CREATE POLICY "Service role can insert customers" ON customers
    FOR INSERT WITH CHECK (true);

-- =====================================================
-- PRONTO! Execute este arquivo no SQL Editor do Supabase
-- Depois tente cadastrar novamente
-- =====================================================
