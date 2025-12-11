-- MIGRATION: Adicionar coluna home_section à tabela products
-- Data: 11/12/2024
-- Objetivo: Permitir selecionar em qual seção da homepage o produto deve aparecer

-- Adicionar a coluna home_section
ALTER TABLE products 
ADD COLUMN IF NOT EXISTS home_section VARCHAR(20) DEFAULT NULL;

-- Criar um índice para otimizar as queries de filtro
CREATE INDEX IF NOT EXISTS idx_products_home_section ON products(home_section);

-- Valores aceitos: 'ofertas', 'procurados', 'ambas', ou NULL
-- - 'ofertas': Aparece na seção "Principais Ofertas"
-- - 'procurados': Aparece na seção "Mais Procurados"
-- - 'ambas': Aparece em ambas as seções
-- - NULL: Não aparece na homepage

COMMENT ON COLUMN products.home_section IS 'Seção da homepage onde o produto deve aparecer: ofertas, procurados, ambas, ou NULL';
