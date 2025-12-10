-- =============================================================================
-- MIGRATION FINAL SIMPLIFICADA
-- Data: 09/12/2024 23:26
-- Apenas adiciona as colunas que realmente faltam
-- =============================================================================

-- Adicionar apenas as colunas dos badges (sem is_featured, sem is_bestseller)
ALTER TABLE products 
ADD COLUMN IF NOT EXISTS badge_type VARCHAR(50),
ADD COLUMN IF NOT EXISTS custom_badge_text VARCHAR(100),
ADD COLUMN IF NOT EXISTS short_description TEXT;

-- Criar índices
CREATE INDEX IF NOT EXISTS idx_products_badge_type ON products(badge_type);

-- Verificação
SELECT 
    column_name,
    data_type,
    CASE WHEN column_name IN ('badge_type', 'custom_badge_text', 'short_description') 
        THEN '✅ NOVA' 
        ELSE '  ' 
    END as status
FROM information_schema.columns
WHERE table_name = 'products'
ORDER BY ordinal_position;
