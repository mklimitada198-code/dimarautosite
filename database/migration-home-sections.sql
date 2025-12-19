-- =====================================================
-- MIGRATION: Sistema de Múltiplas Seções na Homepage
-- Data: 2024-12-19
-- Descrição: Permite que um produto apareça em múltiplas
--            seções da homepage (ofertas, procurados, ou ambas)
-- =====================================================

-- =====================================================
-- PASSO 1: Adicionar nova coluna para múltiplas seções
-- =====================================================
-- Usando JSONB para armazenar array de seções
-- Ex: ["ofertas"], ["procurados"], ["ofertas", "procurados"]

ALTER TABLE products 
ADD COLUMN IF NOT EXISTS home_sections JSONB DEFAULT '[]'::jsonb;

-- =====================================================
-- PASSO 2: Migrar dados existentes
-- =====================================================
-- Converte valores antigos para o novo formato de array

UPDATE products 
SET home_sections = 
    CASE 
        WHEN home_section = 'ofertas' THEN '["ofertas"]'::jsonb
        WHEN home_section = 'procurados' THEN '["procurados"]'::jsonb
        WHEN home_section = 'ambas' THEN '["ofertas", "procurados"]'::jsonb
        ELSE '[]'::jsonb
    END
WHERE home_sections = '[]'::jsonb OR home_sections IS NULL;

-- =====================================================
-- PASSO 3: Criar índice para busca eficiente
-- =====================================================
-- Índice GIN para buscas em JSONB

CREATE INDEX IF NOT EXISTS idx_products_home_sections 
ON products USING GIN (home_sections);

-- =====================================================
-- VERIFICAÇÃO
-- =====================================================
-- Execute para verificar que funcionou

SELECT 
    id,
    name,
    home_section as "Seção Antiga",
    home_sections as "Seções Novas"
FROM products
LIMIT 10;

-- =====================================================
-- PRONTO!
-- Após executar, os produtos podem aparecer em múltiplas seções
-- =====================================================
