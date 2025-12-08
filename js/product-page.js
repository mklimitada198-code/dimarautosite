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
function loadProduct() {
    // Get product ID from URL
    const urlParams = new URLSearchParams(window.location.search);
    const productId = urlParams.get('id');

    if (!productId) {
        alert('Produto não encontrado!');
        window.location.href = 'produtos.html';
        return;
    }

    // Find product in catalog
    currentProduct = window.catalogProducts.find(p => p.id === productId);

    if (!currentProduct) {
        alert('Produto não encontrado!');
        window.location.href = 'produtos.html';
        return;
    }

    // Render product
    renderProduct();
    renderRelatedProducts();
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
    // Main image
    const mainImage = document.getElementById('mainImage');
    mainImage.src = '../' + currentProduct.image;
    mainImage.alt = currentProduct.name;

    // Thumbnails (usando a mesma imagem múltiplas vezes por enquanto)
    const thumbnails = document.getElementById('thumbnails');
    const images = [currentProduct.image, currentProduct.image, currentProduct.image, currentProduct.image];
    
    thumbnails.innerHTML = images.map((img, index) => `
        <div class="thumbnail ${index === 0 ? 'active' : ''}" onclick="changeImage(${index})">
            <img src="../${img}" alt="${currentProduct.name}">
        </div>
    `).join('');
}

/**
 * Change main image
 */
function changeImage(index) {
    const thumbnails = document.querySelectorAll('.thumbnail');
    thumbnails.forEach(t => t.classList.remove('active'));
    thumbnails[index].classList.add('active');

    const mainImage = document.getElementById('mainImage');
    mainImage.src = '../' + currentProduct.image;
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
    const specs = {
        'Marca': currentProduct.brand,
        'SKU': currentProduct.sku,
        'Categoria': window.categories.find(c => c.id === currentProduct.category)?.name || '-',
        'Estoque': currentProduct.stock + ' unidades',
        'Entrega Rápida': currentProduct.fastShipping ? 'Sim' : 'Não',
        'Garantia': 'Garantia do fabricante',
        'Origem': 'Nacional/Importado'
    };

    const table = document.getElementById('specsTable');
    table.innerHTML = Object.entries(specs).map(([key, value]) => `
        <tr>
            <td>${key}</td>
            <td>${value}</td>
        </tr>
    `).join('');
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
        qtyInput.addEventListener('change', function() {
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

