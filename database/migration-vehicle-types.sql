-- =====================================================
-- MIGRATION: Sistema de Múltiplos Tipos de Veículo
-- Data: 2024-12-19
-- Descrição: Permite que um produto tenha múltiplas 
--            categorias (Carro, Moto, ou ambos)
-- =====================================================

-- =====================================================
-- PASSO 1: Remover a constraint antiga
-- =====================================================
-- A constraint atual só aceita 'Carro', 'Moto', 'Universal'
-- e é case-sensitive, causando erros com minúsculas

ALTER TABLE products DROP CONSTRAINT IF EXISTS products_vehicle_type_check;

-- =====================================================
-- PASSO 2: Adicionar nova coluna para múltiplos tipos
-- =====================================================
-- Usando JSONB para armazenar array de tipos
-- Ex: ["carro"], ["moto"], ["carro", "moto"]

ALTER TABLE products 
ADD COLUMN IF NOT EXISTS vehicle_types JSONB DEFAULT '[]'::jsonb;

-- =====================================================
-- PASSO 3: Migrar dados existentes
-- =====================================================
-- Converte valores antigos para o novo formato de array

UPDATE products 
SET vehicle_types = 
    CASE 
        -- Valores com maiúscula (formato antigo)
        WHEN vehicle_type = 'Carro' THEN '["carro"]'::jsonb
        WHEN vehicle_type = 'Moto' THEN '["moto"]'::jsonb
        WHEN vehicle_type = 'Universal' THEN '["carro", "moto"]'::jsonb
        -- Valores com minúscula
        WHEN vehicle_type = 'carro' THEN '["carro"]'::jsonb
        WHEN vehicle_type = 'moto' THEN '["moto"]'::jsonb
        WHEN vehicle_type = 'universal' THEN '["carro", "moto"]'::jsonb
        -- Valor nulo ou vazio = array vazio
        ELSE '[]'::jsonb
    END
WHERE vehicle_types = '[]'::jsonb OR vehicle_types IS NULL;

-- =====================================================
-- PASSO 4: Criar índice para busca eficiente
-- =====================================================
-- Índice GIN para buscas em JSONB

CREATE INDEX IF NOT EXISTS idx_products_vehicle_types 
ON products USING GIN (vehicle_types);

-- =====================================================
-- PASSO 5: Tornar coluna antiga opcional
-- =====================================================
-- Remove NOT NULL se existir (para não quebrar código antigo)

ALTER TABLE products 
ALTER COLUMN vehicle_type DROP NOT NULL;

-- =====================================================
-- VERIFICAÇÃO
-- =====================================================
-- Execute para verificar que funcionou

SELECT 
    id,
    name,
    vehicle_type as "Tipo Antigo",
    vehicle_types as "Tipos Novos"
FROM products
LIMIT 10;

-- =====================================================
-- PRONTO!
-- Após executar, os produtos podem ter múltiplos tipos
-- =====================================================
