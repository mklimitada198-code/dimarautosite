-- Migration: Adicionar campo compatibility_structured para veículos compatíveis estruturados
-- Data: 2024-12-22
-- Descrição: Adiciona coluna JSONB para armazenar compatibilidade de veículos em formato estruturado
-- O formato antigo (compatibility como TEXT[]) é mantido para retrocompatibilidade

-- ==================== ADICIONAR COLUNA ====================
ALTER TABLE products 
ADD COLUMN IF NOT EXISTS compatibility_structured JSONB DEFAULT NULL;

-- ==================== COMENTÁRIO DA COLUNA ====================
COMMENT ON COLUMN products.compatibility_structured IS 
'Compatibilidade de veículos em formato estruturado. Formato:
{
  "structured": [
    {"type": "carro", "brand": "chevrolet", "brandName": "Chevrolet", "model": "onix", "modelName": "Onix", "years": [2020, 2021, 2022]},
    {"type": "moto", "brand": "honda", "brandName": "Honda", "model": "cg-160-titan", "modelName": "CG 160 Titan", "years": "all"}
  ],
  "manual": [
    {"text": "Subaru Impreza 2015"},
    {"text": "Toyota Land Cruiser 1998"}
  ]
}';

-- ==================== ÍNDICE PARA BUSCA ====================
-- Criar índice GIN para buscas eficientes em dados JSONB
CREATE INDEX IF NOT EXISTS idx_products_compatibility_structured 
ON products USING GIN (compatibility_structured);

-- ==================== VERIFICAR APLICAÇÃO ====================
-- Execute este SELECT para verificar se a coluna foi criada
-- SELECT column_name, data_type, column_default 
-- FROM information_schema.columns 
-- WHERE table_name = 'products' AND column_name = 'compatibility_structured';

-- ==================== FIM DA MIGRATION ====================
