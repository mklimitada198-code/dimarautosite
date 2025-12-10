/**
 * Featured Products Renderer - Integração Admin → Home
 * Carrega produtos do admin e renderiza na seção "Principais ofertas"
 */

(function () {
    'use strict';

    let allProducts = [];
    let displayedCount = 6; // Mostrar apenas 6 inicialmente

    /**
     * Carrega produtos do Supabase ou localStorage
     */
    async function loadProducts() {
        try {
            // Verifica se Supabase está configurado
            if (typeof supabaseClient !== 'undefined' && supabaseClient) {
                const { data, error } = await supabaseClient
                    .from('products')
                    .select('*')
                    .eq('status', 'active')
                    .eq('featured', true)
                    .order('created_at', { ascending: false });

                if (error) throw error;
                allProducts = data || [];
            } else {
                // Fallback para localStorage
                const stored = localStorage.getItem('dimar_products');
                const products = stored ? JSON.parse(stored) : [];
                allProducts = products
                    .filter(p => p.status === 'active' && p.featured)
                    .sort((a, b) => new Date(b.created_at || 0) - new Date(a.created_at || 0));
            }

            renderProducts();
        } catch (error) {
            console.error('Erro ao carregar produtos:', error);
            // Se der erro, carrega produtos padrão hardcoded
            renderProducts();
        }
    }

    /**
     * Renderiza produtos na página
     */
    function renderProducts() {
        const grid = document.querySelector('.offers-grid');
        if (!grid) return;

        // Se não há produtos do admin, mantém os hardcoded
        if (allProducts.length === 0) {
            console.log('✅ Usando produtos hardcoded (nenhum produto em destaque no admin)');
            updateVerMaisButton();
            return;
        }

        // Limpa produtos hardcoded
        grid.innerHTML = '';

        // Renderiza apenas os primeiros 6 produtos
        const productsToShow = allProducts.slice(0, displayedCount);

        productsToShow.forEach(product => {
            const card = createProductCard(product);
            grid.appendChild(card);
        });

        updateVerMaisButton();
        console.log(`✅ ${productsToShow.length} produtos em destaque carregados do admin`);
    }

    /**
     * Cria card de produto mantendo estrutura original
     */
    function createProductCard(product) {
        const card = document.createElement('div');
        card.className = 'product-card';

        // Determina qual badge mostrar
        let badgeHTML = '';
        if (product.badge) {
            const badgeClass = product.badge === 'destaque' ? '' :
                product.badge === 'oferta' ? 'promo' :
                    product.badge === 'mais-vendido' ? 'hot' : '';
            const badgeText = product.badge === 'destaque' ? 'Destaque' :
                product.badge === 'oferta' ? 'Oferta' :
                    product.badge === 'mais-vendido' ? 'Mais Vendido' : product.badge;
            badgeHTML = `<span class="product-badge ${badgeClass}">${badgeText}</span>`;
        }

        // Indicador de entrega rápida
        const shippingHTML = product.fast_shipping ? `
            <div class="product-shipping-top">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M13 16V6C13 4.89543 12.1046 4 11 4H3C1.89543 4 1 4.89543 1 6V16M13 16H1M13 16L16.5 16C16.7652 16 17.0196 15.8946 17.2071 15.7071L22.5 10.4142C22.7761 10.1381 22.7761 9.69289 22.5 9.41675L19.7929 6.70966C19.6054 6.52213 19.351 6.41675 19.0858 6.41675L13 6.41675M13 16V6.41675" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
                <span>Produto com entrega <strong>RÁPIDA</strong></span>
            </div>
        ` : '';

        // Imagem do produto (primeira do array)
        const imageUrl = product.images && product.images.length > 0 ? product.images[0] : 'https://via.placeholder.com/300x300/FF6B00/FFFFFF?text=Sem+Imagem';

        // Preço e informações de pagamento
        const price = parseFloat(product.price);
        const salePrice = product.sale_price ? parseFloat(product.sale_price) : null;
        const finalPrice = salePrice || price;

        card.innerHTML = `
            <div class="product-image">
                <img src="${imageUrl}" alt="${product.name}" loading="lazy">
                ${badgeHTML}
            </div>
            ${shippingHTML}
            <div class="product-info">
                <h3 class="product-title">${truncateText(product.name, 50)}</h3>
                <div class="product-pricing">
                    <span class="product-price">R$ ${finalPrice.toFixed(2).replace('.', ',')}</span>
                    <span class="product-installment">à vista no Pix ou Boleto</span>
                    <span class="product-installment-detail">ou R$ ${(finalPrice * 1.11).toFixed(2).replace('.', ',')} em 10x de R$ ${((finalPrice * 1.11) / 10).toFixed(2).replace('.', ',')} sem juros no cartão</span>
                </div>
            </div>
            <div class="product-button-space">
                <button class="product-buy-button" onclick="addToCart('${product.id}')">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M3 3H5L5.4 5M7 13H17L21 5H5.4M7 13L5.4 5M7 13L4.70711 15.2929C4.07714 15.9229 4.52331 17 5.41421 17H17M17 17C15.8954 17 15 17.8954 15 19C15 20.1046 15.8954 21 17 21C18.1046 21 19 20.1046 19 19C19 17.8954 18.1046 17 17 17ZM9 19C9 20.1046 8.10457 21 7 21C5.89543 21 5 20.1046 5 19C5 17.8954 5.89543 17 7 17C8.10457 17 9 17.8954 9 19Z" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                    Comprar
                </button>
            </div>
        `;

        return card;
    }

    /**
     * Trunca texto para não quebrar layout
     */
    function truncateText(text, maxLength) {
        if (text.length <= maxLength) return text;
        return text.substring(0, maxLength) + '...';
    }

    /**
     * Atualiza botão "Ver Mais"
     */
    function updateVerMaisButton() {
        let btn = document.getElementById('ver-mais-produtos');

        // Cria botão se não existir
        if (!btn) {
            const section = document.querySelector('.main-offers .offers-container');
            if (!section) return;

            btn = document.createElement('div');
            btn.id = 'ver-mais-produtos';
            btn.style.cssText = 'text-align: center; margin-top: 30px;';
            section.appendChild(btn);
        }

        // Mostra botão apenas se houver mais produtos
        if (allProducts.length > displayedCount) {
            btn.innerHTML = `
                <button class="ver-mais-btn" onclick="mostrarMaisProdutos()" style="
                    background: linear-gradient(135deg, #ff6600, #ff8533);
                    color: white;
                    border: none;
                    padding: 14px 40px;
                    font-size: 16px;
                    font-weight: 600;
                    border-radius: 8px;
                    cursor: pointer;
                    transition: all 0.3s ease;
                    box-shadow: 0 4px 12px rgba(255, 102, 0, 0.3);
                ">
                    Ver Mais Produtos (${allProducts.length - displayedCount} restantes)
                </button>
            `;
        } else {
            btn.innerHTML = '';
        }
    }

    /**
     * Mostra todos os produtos
     */
    window.mostrarMaisProdutos = function () {
        displayedCount = allProducts.length;
        renderProducts();
    };

    /**
     * Inicializa quando DOM estiver pronto
     */
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', loadProducts);
    } else {
        loadProducts();
    }

    // Exporta função para recarregar produtos
    window.reloadFeaturedProducts = loadProducts;

})();
