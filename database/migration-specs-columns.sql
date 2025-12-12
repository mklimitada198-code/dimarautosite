-- =============================================================================
-- DIMAR AUTO PEÇAS - MIGRATION: ESPECIFICAÇÕES TÉCNICAS
-- Data: 11/12/2024
-- Adiciona campos de especificações técnicas à tabela products
-- =============================================================================

-- Adicionar novas colunas se não existirem
DO $$ 
BEGIN
    -- Peso (em kg)
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'products' AND column_name = 'weight') THEN
        ALTER TABLE products ADD COLUMN weight DECIMAL(10, 2);
    END IF;

    -- Dimensões (texto livre: "20 x 15 x 10 cm")
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'products' AND column_name = 'dimensions') THEN
        ALTER TABLE products ADD COLUMN dimensions VARCHAR(100);
    END IF;

    -- Material do produto
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'products' AND column_name = 'material') THEN
        ALTER TABLE products ADD COLUMN material VARCHAR(255);
    END IF;

    -- Origem (nacional, importado, fabricacao_propria)
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'products' AND column_name = 'origin') THEN
        ALTER TABLE products ADD COLUMN origin VARCHAR(50);
    END IF;

    -- Garantia (30_dias, 3_meses, 6_meses, 1_ano, 2_anos, fabricante)
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'products' AND column_name = 'warranty') THEN
        ALTER TABLE products ADD COLUMN warranty VARCHAR(50);
    END IF;

    -- Código de barras EAN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'products' AND column_name = 'barcode') THEN
        ALTER TABLE products ADD COLUMN barcode VARCHAR(50);
    END IF;

    -- Especificações adicionais (texto livre)
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'products' AND column_name = 'specs') THEN
        ALTER TABLE products ADD COLUMN specs TEXT;
    END IF;

    -- Flag de mais vendido
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'products' AND column_name = 'is_bestseller') THEN
        ALTER TABLE products ADD COLUMN is_bestseller BOOLEAN DEFAULT FALSE;
    END IF;

    -- home_section (pode já existir de migration anterior)
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'products' AND column_name = 'home_section') THEN
        ALTER TABLE products ADD COLUMN home_section VARCHAR(50);
    END IF;
END $$;

-- Criar índice para código de barras (útil para busca)
CREATE INDEX IF NOT EXISTS idx_products_barcode ON products(barcode) WHERE barcode IS NOT NULL;

-- Criar índice para mais vendidos
CREATE INDEX IF NOT EXISTS idx_products_bestseller ON products(is_bestseller) WHERE is_bestseller = true;

-- ==================== VERIFICAÇÃO ====================
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_name = 'products' 
  AND column_name IN ('weight', 'dimensions', 'material', 'origin', 'warranty', 'barcode', 'specs', 'is_bestseller', 'home_section')
ORDER BY column_name;

-- ==================== FIM ====================
-- ✅ Migration concluída!
-- Execute este script no Supabase SQL Editor
