-- ============================================================================
-- CORREÇÃO URGENTE: Adicionar campo image_url em categories
-- Data: 10/12/2024 14:26
-- Problema: Categorias não salvam porque campo image_url não existe
-- ============================================================================

-- PASSO 1: Verificar se o campo já existe
-- Execute isto no SQL Editor do Supabase:

SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'categories';

-- Se NÃO aparecer 'image_url' na lista, execute o próximo SQL:

-- ============================================================================
-- PASSO 2: Adicionar o campo image_url
-- ============================================================================

ALTER TABLE categories 
ADD COLUMN IF NOT EXISTS image_url TEXT;

-- ============================================================================
-- PASSO 3: Verificar se foi adicionado
-- ============================================================================

SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'categories' 
ORDER BY ordinal_position;

-- ============================================================================
-- PASSO 4 (OPCIONAL): Popular com NULL para categorias existentes
-- ============================================================================

UPDATE categories 
SET image_url = NULL 
WHERE image_url IS NULL;

-- ============================================================================
-- Após executar, teste adicionar uma categoria no admin
-- ============================================================================
