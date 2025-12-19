-- Migration: Adicionar suporte a múltiplas categorias por produto
-- Data: 2024-12-19
-- Descrição: Adiciona coluna 'categories' como array TEXT para permitir que 
--            produtos pertençam a múltiplas categorias simultaneamente

-- 1. Adicionar nova coluna categories como array de texto
ALTER TABLE products ADD COLUMN IF NOT EXISTS categories TEXT[] DEFAULT '{}';

-- 2. Migrar dados existentes da coluna 'category' para o novo array 'categories'
-- Isso garante compatibilidade com produtos já cadastrados
UPDATE products 
SET categories = ARRAY[category] 
WHERE category IS NOT NULL 
  AND category != '' 
  AND (categories IS NULL OR categories = '{}');

-- 3. Verificar migração (executar separadamente para checar)
-- SELECT id, name, category, categories FROM products LIMIT 10;

-- NOTA: A coluna 'category' original NÃO é removida para manter compatibilidade
-- com versões anteriores do código e para referência histórica.
