-- ============================================================================
-- POPULAR BANCO COM PRODUTOS DE EXEMPLO
-- Data: 10/12/2024 15:15
-- Objetivo: Ter produtos para testar sincronização Admin ↔ Homepage
-- ============================================================================

-- IMPORTANTE: Execute este script no SQL Editor do Supabase!

-- Inserir produtos de exemplo
INSERT INTO products (
    sku,
    name,
    category,
    brand,
    price,
    sale_price,
    stock,
    status,
    short_description,
    description,
    images,
    featured,
    fast_shipping,
    badge_type,
    custom_badge_text
) VALUES
-- Produto 1: Filtro de Óleo
(
    'FO-001',
    'Filtro de Óleo Original Bosch',
    'filtros',
    'Bosch',
    45.90,
    39.90,
    50,
    'active',
    'Filtro de óleo de alta qualidade',
    'Filtro de óleo original Bosch, compatível com diversos modelos. Garante maior proteção e durabilidade do motor.',
    '["https://via.placeholder.com/400x400/f39c12/ffffff?text=Filtro+de+Oleo"]',
    true,
    true,
    'oferta',
    NULL
),
-- Produto 2: Pastilha de Freio
(
    'PF-002',
    'Pastilha de Freio Dianteira NGK',
    'freios',
    'NGK',
    89.90,
    NULL,
    30,
    'active',
    'Pastilha de freio de alto desempenho',
    'Pastilha de freio dianteira NGK com tecnologia cerâmica. Baixo ruído e maior durabilidade.',
    '["https://via.placeholder.com/400x400/e74c3c/ffffff?text=Pastilha+de+Freio"]',
    false,
    true,
    'destaque',
    NULL
),
-- Produto 3: Amortecedor
(
    'AM-003',
    'Amortecedor Traseiro Cofap',
    'suspensao',
    'Cofap',
    199.90,
    179.90,
    20,
    'active',
    'Amortecedor de alta performance',
    'Amortecedor traseiro Cofap com válvula de controle progressivo. Maior conforto e estabilidade.',
    '["https://via.placeholder.com/400x400/3498db/ffffff?text=Amortecedor"]',
    false,
    false,
    'oferta',
    NULL
),
-- Produto 4: Bateria
(
    'BAT-004',
    'Bateria Moura 60Ah',
    'eletrica',
    'Moura',
    389.90,
    359.90,
    15,
    'active',
    'Bateria automotiva 60Ah',
    'Bateria Moura 60Ah com 18 meses de garantia. Excelente desempenho em partidas a frio.',
    '["https://via.placeholder.com/400x400/2ecc71/ffffff?text=Bateria"]',
    true,
    true,
    'mais-vendido',
    NULL
),
-- Produto 5: Lâmpada LED
(
    'LED-005',
    'Kit Lâmpada LED H4 6000K Philips',
    'iluminacao',
    'Philips',
    149.90,
    129.90,
    40,
    'active',
    'Kit completo de lâmpadas LED',
    'Kit de lâmpadas LED H4 Philips com 6000K (branco xenon). 200% mais luz que lâmpadas convencionais.',
    '["https://via.placeholder.com/400x400/f1c40f/ffffff?text=Lampada+LED"]',
    false,
    true,
    'oferta',
    NULL
),
-- Produto 6: Jogo de Velas
(
    'VEL-006',
    'Jogo de Velas de Ignição NGK',
    'motor',
    'NGK',
    79.90,
    NULL,
    25,
    'active',
    'Jogo com 4 velas de ignição',
    'Jogo completo de velas de ignição NGK. Eletrodo de irídio para maior durabilidade e economia de combustível.',
    '["https://via.placeholder.com/400x400/e67e22/ffffff?text=Velas"]',
    false,
    false,
    NULL,
    NULL
),
-- Produto 7: Óleo de Motor
(
    'OL-007',
    'Óleo Lubrificante Mobil 1 Sintético 5W30',
    'motor',
    'Mobil',
    159.90,
    139.90,
    35,
    'active',
    'Óleo sintético de alta performance',
    'Óleo lubrificante 100% sintético Mobil 1. Proteção superior contra desgaste e formação de borra.',
    '["https://via.placeholder.com/400x400/95a5a6/ffffff?text=Oleo+Motor"]',
    true,
    false,
    'destaque',
    NULL
),
-- Produto 8: Pneu
(
    'PN-008',
    'Pneu Pirelli P7 195/65R15',
    'acessorios',
    'Pirelli',
    459.90,
    419.90,
    12,
    'active',
    'Pneu de alta performance',
    'Pneu Pirelli P7 195/65R15. Excelente aderência em piso molhado e baixo ruído de rodagem.',
    '["https://via.placeholder.com/400x400/34495e/ffffff?text=Pneu"]',
    false,
    true,
    'personalizado',
    'SUPER OFERTA'
);

-- Verificar produtos inseridos
SELECT 
    id,
    sku,
    name,
    price,
    sale_price,
    status,
    badge_type
FROM products
WHERE status = 'active'
ORDER BY created_at DESC;

-- Estatísticas
SELECT 
    COUNT(*) as total_produtos,
    COUNT(CASE WHEN status = 'active' THEN 1 END) as ativos,
    COUNT(CASE WHEN featured = true THEN 1 END) as em_destaque,
    COUNT(CASE WHEN fast_shipping = true THEN 1 END) as entrega_rapida
FROM products;
