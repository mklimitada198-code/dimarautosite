/**
 * Supabase Products Service
 * Serviço para gerenciar produtos no Supabase
 */

class ProductsService {
    constructor() {
        this.supabase = window.supabaseClient;
        this.cache = new Map();
        this.cacheExpiry = 5 * 60 * 1000; // 5 minutos
    }

    /**
     * Buscar todos os produtos
     */
    async getAll(filters = {}) {
        try {
            let query = this.supabase
                .from('products')
                .select('*')
                .eq('in_stock', true);

            // Aplicar filtros
            if (filters.category) {
                query = query.eq('category', filters.category);
            }
            if (filters.brand) {
                query = query.eq('brand', filters.brand);
            }
            if (filters.vehicleType) {
                query = query.eq('vehicle_type', filters.vehicleType);
            }
            if (filters.featured) {
                query = query.eq('featured', true);
            }

            // Ordenação
            query = query.order('created_at', { ascending: false });

            const { data, error } = await query;

            if (error) throw error;

            logger.success(`${data.length} produtos carregados do Supabase`);
            return { success: true, data };
        } catch (error) {
            logger.error('Erro ao buscar produtos:', error);
            return { success: false, error: error.message, data: [] };
        }
    }

    /**
     * Buscar produto por ID
     */
    async getById(id) {
        try {
            // Verificar cache
            const cacheKey = `product_${id}`;
            if (this.cache.has(cacheKey)) {
                const cached = this.cache.get(cacheKey);
                if (Date.now() - cached.timestamp < this.cacheExpiry) {
                    logger.info('Produto carregado do cache');
                    return { success: true, data: cached.data };
                }
            }

            const { data, error } = await this.supabase
                .from('products')
                .select('*')
                .eq('id', id)
                .single();

            if (error) throw error;

            // Salvar no cache
            this.cache.set(cacheKey, {
                data,
                timestamp: Date.now()
            });

            return { success: true, data };
        } catch (error) {
            logger.error('Erro ao buscar produto:', error);
            return { success: false, error: error.message };
        }
    }

    /**
     * Buscar produto por SKU
     */
    async getBySku(sku) {
        try {
            const { data, error } = await this.supabase
                .from('products')
                .select('*')
                .eq('sku', sku)
                .single();

            if (error) throw error;

            return { success: true, data };
        } catch (error) {
            logger.error('Erro ao buscar produto por SKU:', error);
            return { success: false, error: error.message };
        }
    }

    /**
     * Buscar produtos em destaque
     */
    async getFeatured(limit = 10) {
        try {
            const { data, error } = await this.supabase
                .from('products')
                .select('*')
                .eq('featured', true)
                .eq('in_stock', true)
                .order('created_at', { ascending: false })
                .limit(limit);

            if (error) throw error;

            return { success: true, data };
        } catch (error) {
            logger.error('Erro ao buscar produtos em destaque:', error);
            return { success: false, error: error.message, data: [] };
        }
    }

    /**
     * Buscar produtos mais vendidos
     */
    async getBestSellers(limit = 10) {
        try {
            const { data, error } = await this.supabase
                .from('products')
                .select('*')
                .eq('in_stock', true)
                .order('reviews_count', { ascending: false })
                .order('rating', { ascending: false })
                .limit(limit);

            if (error) throw error;

            return { success: true, data };
        } catch (error) {
            logger.error('Erro ao buscar mais vendidos:', error);
            return { success: false, error: error.message, data: [] };
        }
    }

    /**
     * Buscar produtos relacionados
     */
    async getRelated(productId, limit = 4) {
        try {
            // Primeiro buscar o produto atual
            const { data: currentProduct } = await this.getById(productId);
            
            if (!currentProduct) {
                return { success: false, data: [] };
            }

            // Buscar produtos da mesma categoria
            const { data, error } = await this.supabase
                .from('products')
                .select('*')
                .eq('category', currentProduct.category)
                .neq('id', productId)
                .eq('in_stock', true)
                .limit(limit);

            if (error) throw error;

            return { success: true, data };
        } catch (error) {
            logger.error('Erro ao buscar produtos relacionados:', error);
            return { success: false, error: error.message, data: [] };
        }
    }

    /**
     * Buscar com pesquisa (search)
     */
    async search(query, filters = {}) {
        try {
            let supabaseQuery = this.supabase
                .from('products')
                .select('*')
                .or(`name.ilike.%${query}%,description.ilike.%${query}%,brand.ilike.%${query}%`)
                .eq('in_stock', true);

            // Aplicar filtros adicionais
            if (filters.category) {
                supabaseQuery = supabaseQuery.eq('category', filters.category);
            }
            if (filters.brand) {
                supabaseQuery = supabaseQuery.eq('brand', filters.brand);
            }

            const { data, error } = await supabaseQuery;

            if (error) throw error;

            return { success: true, data };
        } catch (error) {
            logger.error('Erro na busca:', error);
            return { success: false, error: error.message, data: [] };
        }
    }

    /**
     * Criar produto (ADMIN)
     */
    async create(productData) {
        try {
            const { data, error } = await this.supabase
                .from('products')
                .insert([productData])
                .select()
                .single();

            if (error) throw error;

            logger.success('Produto criado com sucesso!');
            return { success: true, data };
        } catch (error) {
            logger.error('Erro ao criar produto:', error);
            return { success: false, error: error.message };
        }
    }

    /**
     * Atualizar produto (ADMIN)
     */
    async update(id, productData) {
        try {
            const { data, error } = await this.supabase
                .from('products')
                .update(productData)
                .eq('id', id)
                .select()
                .single();

            if (error) throw error;

            // Limpar cache
            this.cache.delete(`product_${id}`);

            logger.success('Produto atualizado com sucesso!');
            return { success: true, data };
        } catch (error) {
            logger.error('Erro ao atualizar produto:', error);
            return { success: false, error: error.message };
        }
    }

    /**
     * Deletar produto (ADMIN)
     */
    async delete(id) {
        try {
            const { error } = await this.supabase
                .from('products')
                .delete()
                .eq('id', id);

            if (error) throw error;

            // Limpar cache
            this.cache.delete(`product_${id}`);

            logger.success('Produto deletado com sucesso!');
            return { success: true };
        } catch (error) {
            logger.error('Erro ao deletar produto:', error);
            return { success: false, error: error.message };
        }
    }

    /**
     * Upload de imagem
     */
    async uploadImage(file, productId) {
        try {
            const fileExt = file.name.split('.').pop();
            const fileName = `${productId}_${Date.now()}.${fileExt}`;
            const filePath = `products/${fileName}`;

            const { data, error } = await this.supabase.storage
                .from('products')
                .upload(filePath, file);

            if (error) throw error;

            // Obter URL pública
            const { data: { publicUrl } } = this.supabase.storage
                .from('products')
                .getPublicUrl(filePath);

            logger.success('Imagem uploaded com sucesso!');
            return { success: true, url: publicUrl };
        } catch (error) {
            logger.error('Erro ao fazer upload:', error);
            return { success: false, error: error.message };
        }
    }

    /**
     * Limpar cache
     */
    clearCache() {
        this.cache.clear();
        logger.info('Cache limpo');
    }
}

// Inicializar serviço
const productsService = new ProductsService();

// Export global
window.productsService = productsService;

logger.success('✅ Products Service inicializado!');

