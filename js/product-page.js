/**
 * Product Page Script
 * Gerenciamento da página individual do produto
 */

let currentProduct = null;
let currentQuantity = 1;

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    loadProduct();
    setupTabs();
});

/**
 * Load product from URL parameter
 */
async function loadProduct() {
    // Get product ID from URL
    const urlParams = new URLSearchParams(window.location.search);
    const productId = urlParams.get('id');

    if (!productId) {
        showError('Produto não encontrado!');
        return;
    }

    // Mostrar loading
    showLoading(true);

    // Aguardar Supabase estar pronto (max 3 segundos)
    await waitForSupabase();

    try {
        // Tentar buscar do Supabase primeiro
        if (window.supabaseClient) {
            console.log('🔄 Buscando produto do Supabase...', productId);

            const { data: product, error } = await window.supabaseClient
                .from('products')
                .select('*')
                .eq('id', productId)
                .single();

            if (error) {
                console.warn('⚠️ Erro ao buscar do Supabase:', error.message);
            }

            if (!error && product) {
                console.log('✅ Produto encontrado no Supabase:', product.name);
                currentProduct = normalizeProduct(product);
                renderProduct();
                renderRelatedProducts();
                showLoading(false);
                return;
            }
        } else {
            console.warn('⚠️ Supabase não disponível');
        }

        // Fallback: buscar do catálogo local
        if (window.catalogProducts) {
            console.log('🔄 Buscando produto no catálogo local...');
            currentProduct = window.catalogProducts.find(p => String(p.id) === String(productId));

            if (currentProduct) {
                console.log('✅ Produto encontrado no catálogo local');
                renderProduct();
                renderRelatedProducts();
                showLoading(false);
                return;
            }
        }

        // Produto não encontrado
        console.error('❌ Produto não encontrado em nenhuma fonte:', productId);
        showError('Produto não encontrado na base de dados.');

    } catch (error) {
        console.error('❌ Erro ao carregar produto:', error);
        showError('Erro ao carregar produto. Tente novamente.');
    }
}

/**
 * Wait for Supabase to be ready
 */
function waitForSupabase() {
    return new Promise((resolve) => {
        let attempts = 0;
        const maxAttempts = 30; // 3 segundos

        const check = setInterval(() => {
            attempts++;

            if (window.supabaseClient) {
                clearInterval(check);
                console.log('✅ Supabase disponível após', attempts * 100, 'ms');
                resolve(true);
            } else if (attempts >= maxAttempts) {
                clearInterval(check);
                console.warn('⚠️ Timeout aguardando Supabase');
                resolve(false);
            }
        }, 100);
    });
}

/**
 * Normalize product data from Supabase to match expected format
 */
function normalizeProduct(product) {
    // Extrair primeira imagem válida do array de imagens
    let primaryImage = '../assets/images/produto-1.jpg'; // fallback padrão

    if (product.images && Array.isArray(product.images) && product.images.length > 0) {
        // Filtrar apenas URLs/strings válidas
        const validImages = product.images.filter(img =>
            img && typeof img === 'string' && img.trim() !== ''
        );
        if (validImages.length > 0) {
            primaryImage = validImages[0];
        }
    } else if (product.image_url && typeof product.image_url === 'string') {
        // Fallback para campo image_url se existir
        primaryImage = product.image_url;
    }

    console.log('🖼️ Imagem do produto:', {
        id: product.id,
        name: product.name,
        hasImages: Boolean(product.images?.length),
        primaryImage: primaryImage.substring(0, 50) + '...'
    });

    return {
        id: product.id,
        name: product.name,
        sku: product.sku || 'N/A',
        price: product.price,
        salePrice: product.sale_price || null,
        image: primaryImage,
        images: product.images && product.images.length > 0
            ? product.images.filter(img => img && typeof img === 'string' && img.trim() !== '')
            : [primaryImage],
        category: product.category_id || product.category,
        brand: product.brand || 'N/A',
        description: product.description || '',
        shortDescription: product.short_description || '',
        stock: product.stock_quantity || product.stock || 10,
        fastShipping: product.fast_shipping || false,
        rating: 4.5,
        reviews: Math.floor(Math.random() * 50) + 5,
        // Especificações Técnicas
        weight: product.weight || null,
        dimensions: product.dimensions || null,
        material: product.material || null,
        origin: product.origin || null,
        warranty: product.warranty || null,
        barcode: product.barcode || null,
        specs: product.specs || null,
        compatibility: product.compatibility || []
    };
}

/**
 * Show/hide loading state
 */
function showLoading(show) {
    const content = document.querySelector('.product-content');
    if (!content) return;

    if (show) {
        content.style.opacity = '0.5';
        content.style.pointerEvents = 'none';
    } else {
        content.style.opacity = '1';
        content.style.pointerEvents = '';
    }
}

/**
 * Show error message
 */
function showError(message) {
    showLoading(false);
    const content = document.querySelector('.product-content');
    if (content) {
        content.innerHTML = `
            <div style="text-align: center; padding: 60px 20px;">
                <svg width="80" height="80" fill="#e74c3c" viewBox="0 0 24 24" style="margin-bottom: 20px;">
                    <path d="M12 22C6.477 22 2 17.523 2 12S6.477 2 12 2s10 4.477 10 10-4.477 10-10 10zm-1-7v2h2v-2h-2zm0-8v6h2V7h-2z"/>
                </svg>
                <h2 style="color: #333; margin-bottom: 10px;">Ops!</h2>
                <p style="color: #666; margin-bottom: 20px;">${message}</p>
                <a href="produtos.html" style="display: inline-block; background: #ff6600; color: white; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: 600;">
                    Ver Todos os Produtos
                </a>
            </div>
        `;
    }
}

/**
 * Render product details
 */
function renderProduct() {
    // Breadcrumb
    const categoryName = window.categories.find(c => c.id === currentProduct.category)?.name || 'Categoria';
    document.getElementById('breadcrumbCategory').textContent = categoryName;
    document.getElementById('breadcrumbProduct').textContent = currentProduct.name;

    // Gallery
    renderGallery();

    // Basic Info
    document.getElementById('productName').textContent = currentProduct.name;
    document.getElementById('productSku').textContent = currentProduct.sku;

    // Rating
    const stars = '★'.repeat(Math.floor(currentProduct.rating)) + '☆'.repeat(5 - Math.floor(currentProduct.rating));
    document.getElementById('productStars').textContent = stars;
    document.getElementById('productReviews').textContent = `(${currentProduct.reviews} avaliações)`;

    // Price
    const price = currentProduct.salePrice || currentProduct.price;
    document.getElementById('priceValue').textContent = `R$ ${formatPrice(price)}`;

    if (currentProduct.salePrice) {
        document.getElementById('priceOriginal').style.display = 'block';
        document.getElementById('priceOldValue').textContent = formatPrice(currentProduct.price);

        const discount = currentProduct.price - currentProduct.salePrice;
        document.getElementById('discountBadge').style.display = 'inline-block';
        document.getElementById('discountValue').textContent = formatPrice(discount);
    }

    // Installments
    const installmentValue = price / 10;
    document.getElementById('priceInstallment').textContent =
        `ou 10x de R$ ${formatPrice(installmentValue)} sem juros`;

    // Stock
    if (currentProduct.stock > 0) {
        document.getElementById('stockStatus').textContent =
            `${currentProduct.stock} unidades disponíveis`;
    } else {
        document.getElementById('stockStatus').textContent = 'Produto indisponível';
        document.getElementById('stockStatus').style.color = '#e74c3c';
    }

    // Shipping
    if (!currentProduct.fastShipping) {
        document.getElementById('shippingInfo').style.display = 'none';
    }

    // Description (tab)
    const description = currentProduct.description || `
        <p><strong>${currentProduct.name}</strong> de alta qualidade, ideal para seu veículo.</p>
        <p>Produto original da marca ${currentProduct.brand}, garantindo durabilidade e performance.</p>
        <p><strong>Características:</strong></p>
        <ul>
            <li>Produto novo e original</li>
            <li>Garantia de ${currentProduct.brand}</li>
            <li>Fácil instalação</li>
            <li>Alta durabilidade</li>
        </ul>
    `;
    document.getElementById('productDescription').innerHTML = description;

    // Specs (tab)
    renderSpecs();

    // Update page title
    document.title = `${currentProduct.name} - Dimar Auto Peças`;
}

/**
 * Render product gallery
 */
function renderGallery() {
    const mainImage = document.getElementById('mainImage');
    const thumbnails = document.getElementById('thumbnails');

    // Determinar URL da imagem (Supabase usa URLs absolutas, local usa relativas)
    const getImageUrl = (img) => {
        // Verificar se a imagem é válida
        if (!img || typeof img !== 'string' || img.trim() === '') {
            console.warn('⚠️ Imagem inválida, usando placeholder');
            return '../assets/images/produto-1.jpg';
        }

        // Se começa com http/https ou data: (base64), usar diretamente
        if (img.startsWith('http') || img.startsWith('data:')) {
            return img;
        }

        // Para caminhos relativos, ajustar o path
        if (img.startsWith('../')) {
            return img;
        }
        if (img.startsWith('assets/')) {
            return '../' + img;
        }

        // Fallback: assumir caminho relativo
        return '../' + img;
    };

    // Main image
    const mainImageUrl = getImageUrl(currentProduct.image);
    console.log('🖼️ Renderizando galeria:', {
        mainImage: mainImageUrl.substring(0, 50) + '...',
        totalImages: currentProduct.images?.length || 0
    });

    mainImage.src = mainImageUrl;
    mainImage.alt = currentProduct.name;
    mainImage.onerror = function () {
        console.warn('⚠️ Erro ao carregar imagem principal, usando placeholder');
        this.src = '../assets/images/produto-1.jpg';
    };

    // Thumbnails - usar array de imagens se disponível
    let images = [];

    if (currentProduct.images && currentProduct.images.length > 0) {
        images = currentProduct.images;
    } else if (currentProduct.image) {
        // Se só tem uma imagem, mostrar apenas ela
        images = [currentProduct.image];
    } else {
        // Nenhuma imagem, usar placeholder
        images = ['../assets/images/produto-1.jpg'];
    }

    // Renderizar thumbnails
    thumbnails.innerHTML = images.map((img, index) => {
        const imgUrl = getImageUrl(img);
        return `
        <div class="thumbnail ${index === 0 ? 'active' : ''}" onclick="changeImage(${index}, '${imgUrl.replace(/'/g, "\\'")}')">
            <img src="${imgUrl}" alt="${currentProduct.name} - Imagem ${index + 1}" 
                 onerror="this.src='../assets/images/produto-1.jpg'">
        </div>
    `;
    }).join('');
}

/**
 * Change main image
 */
function changeImage(index, imageUrl) {
    const thumbnails = document.querySelectorAll('.thumbnail');
    thumbnails.forEach(t => t.classList.remove('active'));
    thumbnails[index].classList.add('active');

    const mainImage = document.getElementById('mainImage');
    mainImage.src = imageUrl;
}

/**
 * Zoom image
 */
function zoomImage() {
    const modal = document.getElementById('zoomModal');
    const modalImg = document.getElementById('zoomedImage');
    const mainImg = document.getElementById('mainImage');

    modal.style.display = 'block';
    modalImg.src = mainImg.src;
}

/**
 * Close zoom
 */
function closeZoom() {
    document.getElementById('zoomModal').style.display = 'none';
}

// Fechar modal com ESC
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        const modal = document.getElementById('zoomModal');
        if (modal && modal.style.display === 'block') {
            closeZoom();
        }
    }
});

/**
 * Render specs table
 */
function renderSpecs() {
    // Formatar garantia para exibição
    const formatWarranty = (warranty) => {
        const warranties = {
            '30_dias': '30 dias',
            '3_meses': '3 meses',
            '6_meses': '6 meses',
            '1_ano': '1 ano',
            '2_anos': '2 anos',
            'fabricante': 'Garantia do fabricante'
        };
        return warranties[warranty] || warranty || 'Consultar';
    };

    // Formatar origem para exibição
    const formatOrigin = (origin) => {
        const origins = {
            'nacional': 'Nacional',
            'importado': 'Importado',
            'fabricacao_propria': 'Fabricação Própria'
        };
        return origins[origin] || origin || '-';
    };

    // Construir objeto de specs com dados reais
    const specs = {};

    specs['Marca'] = currentProduct.brand || '-';
    specs['SKU'] = currentProduct.sku;

    if (currentProduct.barcode) {
        specs['Código de Barras (EAN)'] = currentProduct.barcode;
    }

    if (window.categories) {
        specs['Categoria'] = window.categories.find(c => c.id === currentProduct.category)?.name || '-';
    }

    if (currentProduct.weight) {
        specs['Peso'] = currentProduct.weight + ' kg';
    }

    if (currentProduct.dimensions) {
        specs['Dimensões'] = currentProduct.dimensions;
    }

    if (currentProduct.material) {
        specs['Material'] = currentProduct.material;
    }

    specs['Origem'] = formatOrigin(currentProduct.origin);
    specs['Garantia'] = formatWarranty(currentProduct.warranty);
    specs['Estoque'] = currentProduct.stock + ' unidades';
    specs['Entrega Rápida'] = currentProduct.fastShipping ? 'Sim ✓' : 'Não';

    const table = document.getElementById('specsTable');
    table.innerHTML = Object.entries(specs).map(([key, value]) => `
        <tr>
            <td>${key}</td>
            <td>${value}</td>
        </tr>
    `).join('');

    // Renderizar especificações adicionais se existirem
    if (currentProduct.specs) {
        const additionalSpecs = document.createElement('div');
        additionalSpecs.style.cssText = 'margin-top: 20px; padding: 15px; background: #f8f9fa; border-radius: 8px;';
        additionalSpecs.innerHTML = `
            <h4 style="margin-bottom: 10px; color: #333;">Especificações Adicionais</h4>
            <pre style="white-space: pre-wrap; color: #666; font-family: inherit; margin: 0;">${currentProduct.specs}</pre>
        `;
        table.parentElement.appendChild(additionalSpecs);
    }

    // Renderizar compatibilidade se existir
    if (currentProduct.compatibility && currentProduct.compatibility.length > 0) {
        const compatPanel = document.getElementById('compatibility');
        if (compatPanel) {
            compatPanel.innerHTML = `
                <h4 style="margin-bottom: 15px; color: #333;">Veículos Compatíveis</h4>
                <ul style="list-style: none; padding: 0;">
                    ${currentProduct.compatibility.map(vehicle => `
                        <li style="padding: 8px 0; border-bottom: 1px solid #eee; color: #666;">
                            🚗 ${vehicle}
                        </li>
                    `).join('')}
                </ul>
            `;
        }
    }
}

/**
 * Render related products
 */
function renderRelatedProducts() {
    // Get products from same category (excluding current)
    const related = window.catalogProducts
        .filter(p => p.category === currentProduct.category && p.id !== currentProduct.id)
        .slice(0, 4);

    const grid = document.getElementById('relatedProducts');

    if (related.length === 0) {
        grid.innerHTML = '<p style="text-align: center; color: #666;">Nenhum produto relacionado encontrado.</p>';
        return;
    }

    grid.innerHTML = related.map(product => `
        <div class="product-card-catalog">
            <div class="product-card-image">
                <img src="../${product.image}" alt="${product.name}">
                ${product.salePrice ? '<span class="product-badge-catalog promo">Oferta</span>' : ''}
            </div>
            <div class="product-card-content">
                <h3 class="product-card-title">${product.name}</h3>
                <div class="product-card-rating">
                    <span class="stars">${'★'.repeat(Math.floor(product.rating))}${'☆'.repeat(5 - Math.floor(product.rating))}</span>
                </div>
                <div class="product-card-price">
                    ${product.salePrice ? `
                        <span class="price-original">R$ ${formatPrice(product.price)}</span>
                        <span class="price-current">R$ ${formatPrice(product.salePrice)}</span>
                    ` : `
                        <span class="price-normal">R$ ${formatPrice(product.price)}</span>
                    `}
                </div>
                <div class="product-card-actions">
                    <button class="btn-add-cart" onclick="addToCartQuick('${product.id}', this)">
                        Adicionar
                    </button>
                    <button class="btn-view-details" onclick="viewProduct('${product.id}')">
                        👁️
                    </button>
                </div>
            </div>
        </div>
    `).join('');
}

/**
 * Setup tabs
 */
function setupTabs() {
    const tabBtns = document.querySelectorAll('.tab-btn');

    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const targetTab = btn.dataset.tab;

            // Remove active from all
            document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
            document.querySelectorAll('.tab-panel').forEach(p => p.classList.remove('active'));

            // Add active to clicked
            btn.classList.add('active');
            document.getElementById(targetTab).classList.add('active');
        });
    });
}

/**
 * Quantity controls
 */
function increaseQty() {
    const input = document.getElementById('quantity');
    const current = parseInt(input.value);
    if (current < 99 && current < currentProduct.stock) {
        input.value = current + 1;
        currentQuantity = current + 1;
    }
}

function decreaseQty() {
    const input = document.getElementById('quantity');
    const current = parseInt(input.value);
    if (current > 1) {
        input.value = current - 1;
        currentQuantity = current - 1;
    }
}

// Update quantity on input change
document.addEventListener('DOMContentLoaded', () => {
    const qtyInput = document.getElementById('quantity');
    if (qtyInput) {
        qtyInput.addEventListener('change', function () {
            let value = parseInt(this.value);
            if (isNaN(value) || value < 1) {
                value = 1;
            } else if (value > 99) {
                value = 99;
            } else if (value > currentProduct.stock) {
                value = currentProduct.stock;
            }
            this.value = value;
            currentQuantity = value;
        });
    }
});

/**
 * Add to cart from product page
 */
function addToCartFromProduct() {
    if (!currentProduct || currentProduct.stock <= 0) {
        alert('Produto indisponível no momento.');
        return;
    }

    const quantity = parseInt(document.getElementById('quantity').value);

    // Add to cart
    window.cart.addItem({
        id: currentProduct.id,
        name: currentProduct.name,
        sku: currentProduct.sku,
        price: currentProduct.price,
        salePrice: currentProduct.salePrice,
        image: currentProduct.image,
        quantity: quantity
    });

    // Visual feedback on button
    const btn = document.querySelector('.btn-add-to-cart');
    const originalHTML = btn.innerHTML;
    btn.innerHTML = `
        <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
        </svg>
        Adicionado!
    `;
    btn.style.background = '#27ae60';

    setTimeout(() => {
        btn.innerHTML = originalHTML;
        btn.style.background = '';
    }, 2000);
}

/**
 * Buy now
 */
function buyNow() {
    addToCartFromProduct();
    setTimeout(() => {
        window.location.href = 'carrinho.html';
    }, 500);
}

/**
 * Add to cart quick (from related products)
 */
function addToCartQuick(productId, button) {
    const product = window.catalogProducts.find(p => p.id === productId);

    if (!product) return;

    window.cart.addItem({
        id: product.id,
        name: product.name,
        sku: product.sku,
        price: product.price,
        salePrice: product.salePrice,
        image: product.image,
        quantity: 1
    });

    // Visual feedback
    const originalHTML = button.innerHTML;
    button.innerHTML = '✓ Adicionado!';
    button.style.background = '#27ae60';

    setTimeout(() => {
        button.innerHTML = originalHTML;
        button.style.background = '';
    }, 2000);
}

/**
 * View product
 */
function viewProduct(productId) {
    window.location.href = `produto.html?id=${productId}`;
}

/**
 * Format price
 */
function formatPrice(value) {
    return value.toFixed(2).replace('.', ',');
}

