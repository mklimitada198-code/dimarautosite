-- =============================================================================
-- DIMAR AUTO PEÇAS - SETUP COMPLETO DO BANCO DE DADOS
-- Data: 09/12/2024 23:55
-- ATENÇÃO: Este script CRIA TUDO do zero ou adiciona o que falta
-- =============================================================================

-- ==================== TABELA: PRODUCTS (COMPLETA E CORRIGIDA) ====================

-- DROP e RECREATE para garantir estrutura correta
DROP TABLE IF EXISTS products CASCADE;

CREATE TABLE products (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    
    -- Campos básicos (OBRIGATÓRIOS pelo admin)
    sku VARCHAR(100) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    category VARCHAR(100) NOT NULL,
    brand VARCHAR(100) NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    stock INTEGER DEFAULT 0 NOT NULL,
    status VARCHAR(20) DEFAULT 'active' NOT NULL CHECK (status IN ('active', 'inactive')),
    
    -- Campos de descrição
    short_description TEXT,
    description TEXT,
    
    -- Campos de preço
    sale_price DECIMAL(10, 2),
    
    -- Imagens
    images JSONB DEFAULT '[]'::jsonb,
    
    -- Características booleanas
    featured BOOLEAN DEFAULT FALSE,
    fast_shipping BOOLEAN DEFAULT FALSE,
    in_stock BOOLEAN DEFAULT TRUE,
    
    -- Badges (NOVOS)
    badge_type VARCHAR(50),
    custom_badge_text VARCHAR(100),
    
    -- Campos antigos do schema (mantidos por compatibilidade)
    vehicle_type VARCHAR(50) CHECK (vehicle_type IN ('Carro', 'Moto', 'Universal')),
    image_url TEXT,
    specifications JSONB DEFAULT '{}'::jsonb,
    compatibility TEXT[],
    badge VARCHAR(50),
    rating DECIMAL(2, 1) DEFAULT 0.0,
    reviews_count INTEGER DEFAULT 0,
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Criar índices para performance
CREATE INDEX idx_products_sku ON products(sku);
CREATE INDEX idx_products_category ON products(category);
CREATE INDEX idx_products_brand ON products(brand);
CREATE INDEX idx_products_status ON products(status);
CREATE INDEX idx_products_featured ON products(featured) WHERE featured = true;
CREATE INDEX idx_products_badge_type ON products(badge_type);
CREATE INDEX idx_products_vehicle_type ON products(vehicle_type);
CREATE INDEX idx_products_in_stock ON products(in_stock);

-- ==================== TABELA: CATEGORIES ====================

CREATE TABLE IF NOT EXISTS categories (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name VARCHAR(100) UNIQUE NOT NULL,
    slug VARCHAR(100) UNIQUE NOT NULL,
    description TEXT,
    image_url TEXT,
    icon VARCHAR(50),
    parent_id UUID REFERENCES categories(id),
    display_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_categories_slug ON categories(slug);
CREATE INDEX IF NOT EXISTS idx_categories_active ON categories(is_active);

-- ==================== TABELA: BRANDS ====================

CREATE TABLE IF NOT EXISTS brands (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name VARCHAR(100) UNIQUE NOT NULL,
    slug VARCHAR(100) UNIQUE NOT NULL,
    logo_url TEXT,
    description TEXT,
    website VARCHAR(255),
    is_partner BOOLEAN DEFAULT FALSE,
    display_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_brands_slug ON brands(slug);
CREATE INDEX IF NOT EXISTS idx_brands_active ON brands(is_active);

-- ==================== TABELA: BANNERS ====================

CREATE TABLE IF NOT EXISTS banners (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    subtitle TEXT,
    image_url TEXT NOT NULL,
    link_url VARCHAR(255),
    position VARCHAR(50) DEFAULT 'main',
    display_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    start_date TIMESTAMP WITH TIME ZONE,
    end_date TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_banners_active ON banners(is_active);
CREATE INDEX IF NOT EXISTS idx_banners_position ON banners(position);

-- ==================== TRIGGERS ====================

-- Function para atualizar updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers de updated_at
DROP TRIGGER IF EXISTS update_products_updated_at ON products;
CREATE TRIGGER update_products_updated_at 
    BEFORE UPDATE ON products
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_categories_updated_at ON categories;
CREATE TRIGGER update_categories_updated_at 
    BEFORE UPDATE ON categories
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_brands_updated_at ON brands;
CREATE TRIGGER update_brands_updated_at 
    BEFORE UPDATE ON brands
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_banners_updated_at ON banners;
CREATE TRIGGER update_banners_updated_at 
    BEFORE UPDATE ON banners
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ==================== ROW LEVEL SECURITY (RLS) ====================

-- Habilitar RLS
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE brands ENABLE ROW LEVEL SECURITY;
ALTER TABLE banners ENABLE ROW LEVEL SECURITY;

-- DROP políticas antigas se existirem
DROP POLICY IF EXISTS "Produtos são públicos" ON products;
DROP POLICY IF EXISTS "Admin pode tudo em products" ON products;
DROP POLICY IF EXISTS "Categorias são públicas" ON categories;
DROP POLICY IF EXISTS "Admin pode tudo em categories" ON categories;
DROP POLICY IF EXISTS "Marcas são públicas" ON brands;
DROP POLICY IF EXISTS "Admin pode tudo em brands" ON brands;
DROP POLICY IF EXISTS "Banners são públicos" ON banners;
DROP POLICY IF EXISTS "Admin pode tudo em banners" ON banners;

-- Polític as públicas de leitura (sem autenticação)
CREATE POLICY "Produtos são públicos" 
    ON products FOR SELECT 
    USING (true);

CREATE POLICY "Categorias são públicas" 
    ON categories FOR SELECT 
    USING (true);

CREATE POLICY "Marcas são públicas" 
    ON brands FOR SELECT 
    USING (true);

CREATE POLICY "Banners são públicos" 
    ON banners FOR SELECT 
    USING (is_active = true);

-- Políticas de escrita (permite TUDO - para desenvolvimento)
-- ATENÇÃO: Em produção, configure autenticação adequada!
CREATE POLICY "Admin pode tudo em products" 
    ON products FOR ALL 
    USING (true)
    WITH CHECK (true);

CREATE POLICY "Admin pode tudo em categories" 
    ON categories FOR ALL 
    USING (true)
    WITH CHECK (true);

CREATE POLICY "Admin pode tudo em brands" 
    ON brands FOR ALL 
    USING (true)
    WITH CHECK (true);

CREATE POLICY "Admin pode tudo em banners" 
    ON banners FOR ALL 
    USING (true)
    WITH CHECK (true);

-- ==================== DADOS INICIAIS ====================

-- Inserir categorias padrão
INSERT INTO categories (name, slug, description, display_order) VALUES
('Freios', 'freios', 'Pastilhas, discos e componentes de freio', 1),
('Motor', 'motor', 'Filtros, correias e peças do motor', 2),
('Suspensão', 'suspensao', 'Amortecedores e componentes de suspensão', 3),
('Elétrica', 'eletrica', 'Baterias, alternadores e componentes elétricos', 4),
('Filtros', 'filtros', 'Filtros de ar, óleo e combustível', 5),
('Iluminação', 'iluminacao', 'Lâmpadas, faróis e lanternas', 6),
('Acessórios', 'acessorios', 'Acessórios diversos para veículos', 7)
ON CONFLICT (slug) DO NOTHING;

-- Inserir marcas padrão
INSERT INTO brands (name, slug, is_partner, display_order) VALUES
('Fras-le', 'fras-le', true, 1),
('Mann Filter', 'mann-filter', true, 2),
('Cofap', 'cofap', true, 3),
('Moura', 'moura', true, 4),
('Gates', 'gates', true, 5),
('NGK', 'ngk', true, 6),
('Bosch', 'bosch', true, 7),
('Nakata', 'nakata', true, 8),
('K&N', 'kn', true, 9),
('Philips', 'philips', true, 10)
ON CONFLICT (slug) DO NOTHING;

-- ==================== VERIFICAÇÃO FINAL ====================

-- Mostra todas as colunas da tabela products
SELECT 
    column_name,
    data_type,
    is_nullable,
    column_default,
    CASE 
        WHEN column_name IN ('status', 'badge_type', 'custom_badge_text', 'short_description') 
        THEN '🆕 NOVA/CORRIGIDA'
        ELSE ''
    END as nota
FROM information_schema.columns
WHERE table_name = 'products'
ORDER BY ordinal_position;

-- Contagem de registros
SELECT 
    (SELECT COUNT(*) FROM products) as total_products,
    (SELECT COUNT(*) FROM categories) as total_categories,
    (SELECT COUNT(*) FROM brands) as total_brands,
    (SELECT COUNT(*) FROM banners) as total_banners;

-- ==================== FIM ====================
-- ✅ Banco de dados configurado e pronto para uso!
-- ✅ Todas as tabelas criadas
-- ✅ Todos os índices criados
-- ✅ RLS configurado (modo desenvolvimento - permite tudo)
-- ✅ Dados iniciais inseridos
