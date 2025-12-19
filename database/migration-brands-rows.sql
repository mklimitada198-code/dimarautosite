-- =====================================================
-- MIGRATION: Sistema de Fileiras de Marcas
-- Data: 2024-12-19
-- Descrição: Adiciona suporte a 2 fileiras separadas
--            de marcas no carrossel da homepage
-- =====================================================

-- =====================================================
-- PASSO 1: Adicionar coluna para indicar a fileira
-- =====================================================
-- 1 = Fileira de cima (carousel-left)
-- 2 = Fileira de baixo (carousel-right)

ALTER TABLE brands 
ADD COLUMN IF NOT EXISTS carousel_row INTEGER DEFAULT 1;

-- Comentário explicativo
COMMENT ON COLUMN brands.carousel_row IS 'Fileira do carrossel: 1=topo, 2=baixo';

-- =====================================================
-- PASSO 2: Adicionar coluna de ordem de exibição
-- =====================================================

ALTER TABLE brands 
ADD COLUMN IF NOT EXISTS display_order INTEGER DEFAULT 0;

-- =====================================================
-- PASSO 3: Distribuir marcas existentes entre fileiras
-- =====================================================
-- Metade vai para fileira 1, metade para fileira 2

WITH numbered_brands AS (
    SELECT id, ROW_NUMBER() OVER (ORDER BY name) as rn
    FROM brands
)
UPDATE brands 
SET carousel_row = CASE 
    WHEN (SELECT rn FROM numbered_brands WHERE numbered_brands.id = brands.id) <= 
         (SELECT COUNT(*) / 2 FROM brands) 
    THEN 1 
    ELSE 2 
END
WHERE carousel_row IS NULL OR carousel_row = 1;

-- =====================================================
-- VERIFICAÇÃO
-- =====================================================

SELECT 
    carousel_row as "Fileira",
    COUNT(*) as "Quantidade",
    STRING_AGG(name, ', ' ORDER BY name) as "Marcas"
FROM brands
GROUP BY carousel_row
ORDER BY carousel_row;

-- =====================================================
-- PRONTO!
-- =====================================================
