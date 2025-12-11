/**
 * HOME PAGE - INTEGRAÇÃO COM SUPABASE
 * Carrega dinamicamente produtos, banners, marcas e categorias do banco
 * 
 * SEÇÕES DE PRODUTOS:
 * - Principais Ofertas: produtos com featured=true ou home_section='ofertas'
 * - Mais Procurados: produtos com is_bestseller=true ou home_section='procurados'
 */

(function () {
    'use strict';

    // ==================== CONFIGURAÇÃO ====================
    const CONFIG = {
        maxProductsOffers: 8,     // Máximo em Principais Ofertas
        maxProductsPopular: 8,    // Máximo em Mais Procurados
        maxBanners: 4,            // Máximo de banners no carrossel
        maxBrands: 9,             // Máximo de marcas exibidas
        autoRefresh: false        // Auto-refresh (desabilitado por padrão)
    };

    // ==================== SAFE LOGGER ====================
    const log = {
        info: (...args) => typeof logger !== 'undefined' ? logger.info(...args) : console.info(...args),
        warn: (...args) => typeof logger !== 'undefined' ? logger.warn(...args) : console.warn(...args),
        error: (...args) => typeof logger !== 'undefined' ? logger.error(...args) : console.error(...args),
        success: (msg) => typeof logger !== 'undefined' ? logger.success(msg) : console.log('✅', msg)
    };

    // ==================== CARREGAR PRODUTOS - PRINCIPAIS OFERTAS ====================
    async function loadOffersProducts() {
        try {
            log.info('🔄 Carregando Principais Ofertas...');
            showProductsSkeleton('.offers-grid');

            if (!window.supabaseClient) {
                log.warn('⚠️ Supabase não disponível');
                hideProductsSkeleton('.offers-grid');
                return;
            }

            // Buscar TODOS os produtos (sem filtro de status)
            const { data: products, error } = await window.supabaseClient
                .from('products')
                .select('*')
                .order('featured', { ascending: false, nullsFirst: false })
                .order('created_at', { ascending: false })
                .limit(CONFIG.maxProductsOffers);

            if (error) {
                log.error('❌ Erro ao carregar ofertas:', error);
                hideProductsSkeleton('.offers-grid');
                return;
            }

            log.success(`✅ ${products?.length || 0} produtos em Ofertas`);
            renderProducts(products || [], '.offers-grid');

        } catch (error) {
            log.error('❌ Erro ao carregar ofertas:', error);
            hideProductsSkeleton('.offers-grid');
        }
    }

    // ==================== CARREGAR PRODUTOS - MAIS PROCURADOS ====================
    async function loadMostSearchedProducts() {
        try {
            log.info('🔄 Carregando Mais Procurados...');
            showProductsSkeleton('.most-searched-grid');

            if (!window.supabaseClient) {
                log.warn('⚠️ Supabase não disponível');
                hideProductsSkeleton('.most-searched-grid');
                return;
            }

            // Buscar TODOS os produtos com offset (para não repetir)
            const { data: products, error } = await window.supabaseClient
                .from('products')
                .select('*')
                .order('created_at', { ascending: false })
                .range(CONFIG.maxProductsOffers, CONFIG.maxProductsOffers + CONFIG.maxProductsPopular - 1);

            if (error) {
                log.error('❌ Erro ao carregar mais procurados:', error);
                hideProductsSkeleton('.most-searched-grid');
                return;
            }

            log.success(`✅ ${products?.length || 0} produtos em Mais Procurados`);
            renderProducts(products || [], '.most-searched-grid');

        } catch (error) {
            log.error('❌ Erro ao carregar mais procurados:', error);
            hideProductsSkeleton('.most-searched-grid');
        }
    }

    // ==================== SKELETON LOADING ====================
    function showProductsSkeleton(containerSelector) {
        const container = document.querySelector(containerSelector);
        if (!container) return;

        container.innerHTML = Array(4).fill(`
            <div class="product-card skeleton-card">
                <div class="skeleton-image"></div>
                <div class="skeleton-text" style="width: 80%"></div>
                <div class="skeleton-text" style="width: 50%"></div>
            </div>
        `).join('');
    }

    function hideProductsSkeleton(containerSelector) {
        const container = document.querySelector(containerSelector);
        if (!container) return;
        const skeletons = container.querySelectorAll('.skeleton-card');
        skeletons.forEach(s => s.remove());
    }

    // ==================== RENDERIZAR PRODUTOS ====================
    function renderProducts(products, containerSelector) {
        const container = document.querySelector(containerSelector);
        if (!container) {
            log.warn('⚠️ Container não encontrado:', containerSelector);
            return;
        }

        // Limpar container
        container.innerHTML = '';

        // Se não há produtos, mostrar mensagem
        if (!products || products.length === 0) {
            container.innerHTML = '<p style="color: #666; text-align: center; padding: 40px;">Nenhum produto disponível no momento.</p>';
            return;
        }

        // Renderizar produtos
        products.forEach(product => {
            const productCard = createProductCard(product);
            container.appendChild(productCard);
        });

        log.success(`✅ Produtos renderizados em ${containerSelector}`);
    }

    // ==================== CRIAR CARD DE PRODUTO ====================
    function createProductCard(product) {
        const card = document.createElement('div');
        card.className = 'product-card';
        card.dataset.productId = product.id;

        // Determinar badge (priorizar badge_type do admin)
        let badge = '';
        let badgeClass = 'product-badge';

        if (product.badge_type) {
            // Usar badge configurado no admin
            switch (product.badge_type) {
                case 'destaque':
                    badge = '<span class="product-badge">Destaque</span>';
                    break;
                case 'oferta':
                    badge = '<span class="product-badge promo">Oferta</span>';
                    break;
                case 'mais-vendido':
                    badge = '<span class="product-badge hot">Mais Vendido</span>';
                    break;
                case 'personalizado':
                    badge = `<span class="product-badge">${product.custom_badge_text || 'Badge'}</span>`;
                    break;
            }
        } else if (product.is_bestseller) {
            // Fallback: usar is_bestseller checkbox
            badge = '<span class="product-badge hot">Mais Vendido</span>';
        } else if (product.is_featured || product.featured) {
            // Fallback: usar is_featured checkbox (compatibilidade)
            badge = '<span class="product-badge">Destaque</span>';
        } else if (product.sale_price && product.sale_price < product.price) {
            // Fallback: calcular automaticamente se tem preço promocional
            badge = '<span class="product-badge promo">Oferta</span>';
        } else if (product.badge) {
            // Fallback antigo: campo badge legado
            badge = `<span class="product-badge">${product.badge}</span>`;
        }

        // Calcular preços
        const price = product.sale_price || product.price;
        const originalPrice = product.sale_price ? product.price : null;

        // Calcular parcelamento (10x sem juros)
        const installmentValue = (price / 10).toFixed(2);

        // Imagem (usar primeira imagem ou placeholder)
        const imageUrl = product.images && product.images.length > 0
            ? product.images[0]
            : (window.placeholders ? window.placeholders.product : 'assets/images/produto-1.jpg');

        card.innerHTML = `
            <div class="product-image">
                <img src="${imageUrl}" alt="${product.name}" loading="lazy" onerror="this.src='${window.placeholders ? window.placeholders.product : 'assets/images/produto-1.jpg'}'">
                ${badge}
            </div>
            ${product.fast_shipping ? `
            <div class="product-shipping-top">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M13 16V6C13 4.89543 12.1046 4 11 4H3C1.89543 4 1 4.89543 1 6V16M13 16H1M13 16L16.5 16C16.7652 16 17.0196 15.8946 17.2071 15.7071L22.5 10.4142C22.7761 10.1381 22.7761 9.69289 22.5 9.41675L19.7929 6.70966C19.6054 6.52213 19.351 6.41675 19.0858 6.41675L13 6.41675M13 16V6.41675" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
                <span>Produto com entrega <strong>RÁPIDA</strong></span>
            </div>
            ` : ''}
            <div class="product-info">
                <h3 class="product-title">${product.name}</h3>
                <div class="product-pricing">
                    ${originalPrice ? `<span class="product-price-old">R$ ${originalPrice.toFixed(2).replace('.', ',')}</span>` : ''}
                    <span class="product-price">R$ ${price.toFixed(2).replace('.', ',')}</span>
                    <span class="product-installment">à vista no Pix ou Boleto</span>
                    <span class="product-installment-detail">ou R$ ${(price * 1.1).toFixed(2).replace('.', ',')} em 10x de R$ ${installmentValue.replace('.', ',')} sem juros no cartão</span>
                </div>
            </div>
            <div class="product-button-space">
                <button class="product-buy-button" onclick="addToCartFromHome('${product.id}', event)">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M3 3H5L5.4 5M7 13H17L21 5H5.4M7 13L5.4 5M7 13L4.70711 15.2929C4.07714 15.9229 4.52331 17 5.41421 17H17M17 17C15.8954 17 15 17.8954 15 19C15 20.1046 15.8954 21 17 21C18.1046 21 19 20.1046 19 19C19 17.8954 18.1046 17 17 17ZM9 19C9 20.1046 8.10457 21 7 21C5.89543 21 5 20.1046 5 19C5 17.8954 5.89543 17 7 17C8.10457 17 9 17.8954 9 19Z" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                    Comprar
                </button>
            </div>
        `;

        return card;
    }

    // ==================== ADICIONAR AO CARRINHO ====================
    window.addToCartFromHome = function (productId, event) {
        // Capturar o botão clicado
        const button = event ? event.target.closest('.product-buy-button') : null;

        // Função para mostrar feedback visual no botão
        function showAddedFeedback(btn) {
            if (!btn) return;

            const originalHTML = btn.innerHTML;
            const originalBg = btn.style.background;

            // Mudar para estado "Adicionado"
            btn.innerHTML = `
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M5 13L9 17L19 7" stroke="white" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
                Adicionado!
            `;
            btn.style.background = 'linear-gradient(135deg, #28a745 0%, #20c997 100%)';
            btn.style.pointerEvents = 'none';

            // Voltar ao normal após 2 segundos
            setTimeout(() => {
                btn.innerHTML = originalHTML;
                btn.style.background = originalBg;
                btn.style.pointerEvents = '';
            }, 2000);
        }

        if (typeof window.cart !== 'undefined' && window.cart.addItem) {
            // Buscar produto completo
            if (window.supabaseClient) {
                window.supabaseClient
                    .from('products')
                    .select('*')
                    .eq('id', productId)
                    .single()
                    .then(({ data, error }) => {
                        if (!error && data) {
                            const cartItem = {
                                id: data.id,
                                name: data.name,
                                price: data.sale_price || data.price,
                                image: data.images && data.images.length > 0 ? data.images[0] : '',
                                quantity: 1
                            };
                            window.cart.addItem(cartItem);
                            showAddedFeedback(button);
                        }
                    });
            } else {
                // Fallback: mostrar feedback mesmo sem Supabase
                showAddedFeedback(button);
            }
        } else {
            log.warn('⚠️ Sistema de carrinho não disponível');
            // Ainda mostrar feedback visual
            showAddedFeedback(button);
        }
    };

    // ==================== CARREGAR BANNERS ====================
    async function loadHomeBanners() {
        try {
            log.info('🔄 Carregando banners...');

            if (!window.supabaseClient) {
                log.warn('⚠️ Supabase não disponível, usando banners estáticos');
                return;
            }

            const { data: banners, error } = await window.supabaseClient
                .from('banners')
                .select('*')
                .eq('is_active', true)
                .order('display_order', { ascending: true })
                .limit(CONFIG.maxBanners);

            if (error) {
                log.error('❌ Erro ao carregar banners:', error);
                return;
            }

            if (!banners || banners.length === 0) {
                log.warn('⚠️ Nenhum banner encontrado');
                return;
            }

            log.success(`✅ ${banners.length} banners carregados`);
            renderBanners(banners);

        } catch (error) {
            log.error('❌ Erro ao carregar banners:', error);
        }
    }

    // ==================== RENDERIZAR BANNERS ====================
    function renderBanners(banners) {
        const slidesContainer = document.querySelector('.carousel-slides');
        const indicatorsContainer = document.querySelector('.carousel-indicators');

        if (!slidesContainer || !indicatorsContainer) {
            log.warn('⚠️ Container de banners não encontrado');
            return;
        }

        // Limpar banners existentes
        slidesContainer.innerHTML = '';
        indicatorsContainer.innerHTML = '';

        // Renderizar novos banners
        banners.forEach((banner, index) => {
            // Slide
            const slide = document.createElement('div');
            slide.className = `carousel-slide ${index === 0 ? 'active' : ''}`;

            const link = banner.link_url ? `<a href="${banner.link_url}">` : '';
            const closeLink = banner.link_url ? '</a>' : '';

            slide.innerHTML = `
                ${link}
                    <img src="${banner.image_url}" alt="${banner.title}" onerror="this.src='${window.placeholders ? window.placeholders.banner : 'assets/images/bannner01.png'}'">
                ${closeLink}
            `;
            slidesContainer.appendChild(slide);

            // Indicador
            const indicator = document.createElement('button');
            indicator.className = `indicator ${index === 0 ? 'active' : ''}`;
            indicator.setAttribute('aria-label', `Banner ${index + 1}`);
            indicator.addEventListener('click', () => goToSlide(index));
            indicatorsContainer.appendChild(indicator);
        });

        // Reinicializar carrossel se função existir
        if (typeof window.initCarousel === 'function') {
            window.initCarousel();
        }

        log.success('✅ Banners renderizados');
    }

    // ==================== CARREGAR MARCAS ====================
    async function loadHomeBrands() {
        try {
            log.info('🔄 Carregando marcas...');

            if (!window.supabaseClient) {
                log.warn('⚠️ Supabase não disponível, usando marcas estáticas');
                return;
            }

            // Buscar TODAS as marcas (sem filtro de status)
            const { data: brands, error } = await window.supabaseClient
                .from('brands')
                .select('*')
                .order('display_order', { ascending: true, nullsFirst: false })
                .limit(CONFIG.maxBrands);

            if (error) {
                log.error('❌ Erro ao carregar marcas:', error);
                return;
            }

            if (!brands || brands.length === 0) {
                log.warn('⚠️ Nenhuma marca encontrada');
                return;
            }

            log.success(`✅ ${brands.length} marcas carregadas`);
            renderBrands(brands);

        } catch (error) {
            log.error('❌ Erro ao carregar marcas:', error);
        }
    }

    // ==================== MAPEAMENTO DE IMAGENS CONHECIDAS ====================
    const KNOWN_BRAND_IMAGES = {
        'bosch': 'assets/images/bosch.png',
        'ngk': 'assets/images/ngk.png',
        'toyota': 'assets/images/toyota.png',
        'fiat': 'assets/images/fiat.png',
        'hyundai': 'assets/images/hyundai.png',
        'ford': 'assets/images/ford.png',
        'tete': 'assets/images/tete.png',
        'mobil': 'assets/images/mobil.png',
        'dayco': 'assets/images/dayco.png'
    };

    // ==================== RENDERIZAR MARCAS ====================
    function renderBrands(brands) {
        const carouselsLeft = document.querySelectorAll('.brands-carousel-left');
        const carouselsRight = document.querySelectorAll('.brands-carousel-right');

        if (carouselsLeft.length === 0 || carouselsRight.length === 0) {
            log.warn('⚠️ Containers de marcas não encontrados');
            return;
        }

        // Filtrar APENAS marcas que têm imagens conhecidas no mapa
        // Isso evita erros 404 para marcas como gates.png, nakata.png que não existem
        const validBrands = brands.filter(brand => {
            const brandSlug = brand.name ? brand.name.toLowerCase().replace(/\s+/g, '') : '';
            return !!KNOWN_BRAND_IMAGES[brandSlug];
        });

        log.info(`📦 ${validBrands.length}/${brands.length} marcas com imagens válidas`);

        // Se poucas marcas válidas (menos de 5), manter HTML estático que já funciona
        if (validBrands.length < 5) {
            log.warn(`⚠️ Apenas ${validBrands.length} marcas válidas, mantendo HTML estático`);
            return;
        }

        // Criar HTML das marcas (3 sets para looping infinito)
        // Agora usa SEMPRE a imagem do mapa, ignora logo_url do banco
        const brandsHTML = validBrands.map(brand => {
            const brandSlug = brand.name ? brand.name.toLowerCase().replace(/\s+/g, '') : 'brand';
            // Usar SEMPRE a imagem conhecida do mapa
            const logoUrl = KNOWN_BRAND_IMAGES[brandSlug] || 'assets/images/bosch.png';

            return `
            <div class="brand-item">
                <img src="${logoUrl}" alt="${brand.name}">
            </div>
        `;
        }).join('');

        // Repetir 3 vezes para looping infinito perfeito
        const fullHTML = brandsHTML + brandsHTML + brandsHTML;

        // Atualizar carrosséis
        carouselsLeft.forEach(carousel => {
            carousel.innerHTML = fullHTML;
        });

        carouselsRight.forEach(carousel => {
            carousel.innerHTML = fullHTML;
        });

        log.success('✅ Marcas renderizadas');
    }

    // ==================== CARREGAR CATEGORIAS ====================
    async function loadHomeCategories() {
        try {
            log.info('🔄 Carregando categorias com imagens...');

            if (!window.supabaseClient) {
                log.warn('⚠️ Supabase não disponível, usando categorias estáticas');
                return;
            }

            // Buscar TODAS as categorias (sem filtro de status)
            const { data: categories, error } = await window.supabaseClient
                .from('categories')
                .select('*')
                .order('display_order', { ascending: true, nullsFirst: false });

            if (error) {
                log.error('❌ Erro ao carregar categorias:', error);
                return;
            }

            if (!categories || categories.length === 0) {
                log.warn('⚠️ Nenhuma categoria encontrada');
                return;
            }

            log.success(`✅ ${categories.length} categorias carregadas`);
            renderCategories(categories);

        } catch (error) {
            log.error('❌ Erro ao carregar categorias:', error);
        }
    }

    // ==================== RENDERIZAR CATEGORIAS ====================
    function renderCategories(categories) {
        const carousel = document.querySelector('.categories-carousel');

        if (!carousel) {
            log.warn('⚠️ Container de categorias não encontrado');
            return;
        }

        // Limpar categorias existentes
        carousel.innerHTML = '';

        // Renderizar novas categorias
        categories.forEach(category => {
            const item = document.createElement('div');
            item.className = 'category-item';
            item.innerHTML = `
                <a href="/pages/produtos.html?categoria=${category.slug}">
                    <div class="category-image">
                        <img src="${category.image_url}" alt="${category.name}" onerror="this.src='${window.placeholders ? window.placeholders.category : 'assets/images/cat_lampadas.png'}'">
                    </div>
                    <h3 class="category-name">${category.name}</h3>
                </a>
            `;
            carousel.appendChild(item);
        });

        log.success('✅ Categorias renderizadas');
    }

    // ==================== INICIALIZAÇÃO ====================
    async function initializeHomePage() {
        log.info('🚀 Inicializando home page com dados do Supabase...');

        // Aguardar Supabase estar pronto
        let attempts = 0;
        const maxAttempts = 30; // 3 segundos

        const waitForSupabase = setInterval(async () => {
            attempts++;

            if (window.supabaseClient || attempts >= maxAttempts) {
                clearInterval(waitForSupabase);

                if (!window.supabaseClient) {
                    log.warn('⚠️ Supabase não disponível após timeout');
                    log.info('📌 Usando conteúdo estático da home');
                    return;
                }

                // Carregar todos os dados em paralelo
                await Promise.all([
                    loadOffersProducts(),          // Principais Ofertas
                    loadMostSearchedProducts(),    // Mais Procurados
                    loadHomeBanners(),
                    loadHomeBrands(),
                    loadHomeCategories()
                ]);

                log.success('✅ Home page carregada com sucesso!');

                // Auto-refresh (se habilitado)
                if (CONFIG.autoRefresh) {
                    setupAutoRefresh();
                }
            }
        }, 100);
    }

    // ==================== AUTO-REFRESH ====================
    function setupAutoRefresh() {
        // Atualizar a cada 5 minutos
        setInterval(() => {
            log.info('🔄 Auto-refresh: atualizando dados...');
            initializeHomePage();
        }, 5 * 60 * 1000);
    }

    // ==================== EXPORTAR FUNÇÕES ====================
    window.homeSupabase = {
        init: initializeHomePage,
        loadOffers: loadOffersProducts,
        loadMostSearched: loadMostSearchedProducts,
        loadBanners: loadHomeBanners,
        loadBrands: loadHomeBrands,
        loadCategories: loadHomeCategories,
        refresh: initializeHomePage
    };

    // Inicializar automaticamente quando o DOM estiver pronto
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initializeHomePage);
    } else {
        initializeHomePage();
    }

})();

