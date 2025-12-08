-- ==================== INSERIR PRODUTOS INICIAIS ====================
-- Execute este script após criar o schema.sql

-- Limpar produtos existentes (opcional)
-- DELETE FROM products;

-- Inserir produtos de AUTO PEÇAS
INSERT INTO products (
    sku, name, description, category, brand, vehicle_type,
    price, sale_price, stock, image_url, images,
    specifications, compatibility, fast_shipping, in_stock, featured, badge, rating, reviews_count
) VALUES

-- FREIOS
('FRE-001', 
 'Kit Pastilha de Freio Dianteira Cerâmica',
 'Kit completo de pastilhas de freio dianteiras em material cerâmico de alta performance. Proporciona frenagem segura e durabilidade superior.',
 'Freios', 'Fras-le', 'Carro',
 149.90, 119.90, 45,
 'https://via.placeholder.com/400x400/FF6B00/FFFFFF?text=Pastilha+Freio',
 '[]'::jsonb,
 '{"material": "Cerâmica", "posicao": "Dianteira", "aplicacao": "Carros leves", "garantia": "1 ano"}'::jsonb,
 ARRAY['Gol', 'Palio', 'Uno', 'Corsa'],
 true, true, true, 'NOVO', 4.8, 156),

('FRE-006',
 'Disco de Freio Ventilado 280mm',
 'Disco de freio ventilado de alta durabilidade, proporciona melhor dissipação de calor e frenagem mais eficiente.',
 'Freios', 'Fremax', 'Carro',
 189.90, 159.90, 32,
 'https://via.placeholder.com/400x400/FF6B00/FFFFFF?text=Disco+Freio',
 '[]'::jsonb,
 '{"diametro": "280mm", "espessura": "24mm", "tipo": "Ventilado"}'::jsonb,
 ARRAY['Civic', 'Corolla', 'Focus'],
 true, true, true, 'PROMOÇÃO', 4.9, 89),

-- MOTOR
('MOT-002',
 'Filtro de Óleo Mann W950/26',
 'Filtro de óleo original Mann Filter com alta eficiência de filtragem. Protege o motor e aumenta a vida útil.',
 'Motor', 'Mann Filter', 'Universal',
 45.90, 34.90, 150,
 'https://via.placeholder.com/400x400/1a1a1a/FFFFFF?text=Filtro+Oleo',
 '[]'::jsonb,
 '{"tipo": "Cartucho", "rosca": "M20 x 1.5", "altura": "90mm", "diametro": "76mm"}'::jsonb,
 ARRAY['Universal'],
 true, true, true, 'PROMOÇÃO', 5.0, 256),

('MOT-005',
 'Kit Correia Dentada Gates com Tensor',
 'Kit completo de correia dentada Gates com tensor e rolamentos. Máxima durabilidade e performance.',
 'Motor', 'Gates', 'Carro',
 289.90, 249.90, 28,
 'https://via.placeholder.com/400x400/27ae60/FFFFFF?text=Correia',
 '[]'::jsonb,
 '{"dentes": 123, "largura": "25mm", "inclui": "Correia + Tensor + Rolamento", "material": "Borracha reforçada"}'::jsonb,
 ARRAY['Gol 1.0', 'Palio 1.0', 'Uno 1.0'],
 true, true, false, NULL, 4.7, 103),

-- SUSPENSÃO
('SUS-003',
 'Amortecedor Traseiro Cofap Honda CG 125/150',
 'Amortecedor traseiro original Cofap para motos Honda CG. Alta qualidade e durabilidade.',
 'Suspensão', 'Cofap', 'Moto',
 189.90, 159.90, 35,
 'https://via.placeholder.com/400x400/FF0000/FFFFFF?text=Amortecedor',
 '[]'::jsonb,
 '{"posicao": "Traseiro", "comprimento": "340mm", "curso": "80mm", "aplicacao": "Honda CG"}'::jsonb,
 ARRAY['CG 125', 'CG 150', 'CG Titan'],
 true, true, true, NULL, 4.6, 92),

-- ELÉTRICA
('ELE-004',
 'Bateria Moura 60Ah Selada',
 'Bateria automotiva Moura 60Ah selada livre de manutenção. Alta durabilidade e confiabilidade.',
 'Elétrica', 'Moura', 'Carro',
 459.90, 399.90, 56,
 'https://via.placeholder.com/400x400/0066FF/FFFFFF?text=Bateria',
 '[]'::jsonb,
 '{"amperagem": "60Ah", "voltagem": "12V", "cca": "500A", "tecnologia": "Selada", "garantia": "18 meses"}'::jsonb,
 ARRAY['Gol', 'Fox', 'Polo', 'Voyage'],
 false, true, true, 'DESTAQUE', 4.9, 201),

('ELE-013',
 'Vela de Ignição NGK Iridium',
 'Vela de ignição premium com eletrodo de irídio. Melhor desempenho e economia de combustível.',
 'Elétrica', 'NGK', 'Carro',
 49.90, 39.90, 120,
 'https://via.placeholder.com/400x400/FF6B00/FFFFFF?text=Vela+Ignicao',
 '[]'::jsonb,
 '{"eletrodo": "Irídio", "abertura": "0.8mm", "vida_util": "100.000 km"}'::jsonb,
 ARRAY['Universal'],
 true, true, true, NULL, 5.0, 345),

-- FILTROS
('FIL-015',
 'Filtro de Ar Esportivo K&N',
 'Filtro de ar esportivo lavável de alto fluxo. Aumenta a potência e performance do motor.',
 'Filtros', 'K&N', 'Carro',
 229.90, 199.90, 38,
 'https://via.placeholder.com/400x400/FF0000/FFFFFF?text=Filtro+Ar',
 '[]'::jsonb,
 '{"tipo": "Esportivo", "lavavel": "Sim", "aumento_potencia": "Até 4 cv", "vida_util": "1.6 milhão de km"}'::jsonb,
 ARRAY['Gol', 'Palio', 'Uno'],
 true, true, true, 'HOT', 4.9, 112),

-- ILUMINAÇÃO
('ILU-018',
 'Lâmpada LED H4 8000 Lumens',
 'Lâmpada LED de alta potência 8000 lumens. Iluminação superior e maior segurança.',
 'Iluminação', 'Philips', 'Carro',
 149.90, 119.90, 88,
 'https://via.placeholder.com/400x400/FFD700/000000?text=Lampada+LED',
 '[]'::jsonb,
 '{"tipo": "LED", "lumens": "8000lm", "temperatura_cor": "6500K", "potencia": "40W", "vida_util": "50.000h"}'::jsonb,
 ARRAY['Universal H4'],
 true, true, true, NULL, 4.8, 167),

('ILU-019',
 'Farol Auxiliar de Milha LED',
 'Par de faróis de milha LED de alta intensidade. Perfeito para viagens e condições adversas.',
 'Iluminação', 'Hella', 'Carro',
 189.90, 159.90, 44,
 'https://via.placeholder.com/400x400/FF6B00/FFFFFF?text=Farol+Milha',
 '[]'::jsonb,
 '{"tipo": "LED", "potencia": "20W por farol", "temperatura_cor": "6000K", "alcance": "200 metros"}'::jsonb,
 ARRAY['Universal'],
 true, true, false, NULL, 4.7, 92)

ON CONFLICT (sku) DO NOTHING;

-- Verificar produtos inseridos
SELECT 
    sku, 
    name, 
    category, 
    brand, 
    price, 
    sale_price, 
    stock,
    featured
FROM products
ORDER BY category, sku;

-- Contar produtos por categoria
SELECT 
    category, 
    COUNT(*) as total_produtos
FROM products
GROUP BY category
ORDER BY category;

