/**
 * Catalog Page - Main Script
 * Filtros, ordenação, paginação e renderização de produtos
 */

// State
let currentFilters = {
    categories: [],
    brands: [],
    vehicleType: [], // car, moto, universal
    promo: false,
    fastShipping: false,
    inStock: false
};

let currentSort = 'featured';
let currentPage = 1;
const itemsPerPage = 12;
let filteredProducts = [];

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    initializeCatalog();
});

/**
 * Initialize catalog
 */
function initializeCatalog() {
    renderCategoryFilters();
    renderBrandFilters();
    setupEventListeners();
    applyFilters();
    
    console.log('✅ Catálogo inicializado');
}

/**
 * Render category filters
 */
function renderCategoryFilters() {
    const container = document.getElementById('categoriesFilter');
    
    container.innerHTML = window.categories.map(cat => `
        <label class="filter-checkbox">
            <input 
                type="checkbox" 
                value="${cat.id}"
                onchange="toggleCategoryFilter('${cat.id}')">
            <span>${cat.icon} ${cat.name}</span>
        </label>
    `).join('');
}

/**
 * Render brand filters
 */
function renderBrandFilters() {
    const container = document.getElementById('brandsFilter');
    
    container.innerHTML = window.brands.map(brand => `
        <label class="filter-checkbox">
            <input 
                type="checkbox" 
                value="${brand}"
                onchange="toggleBrandFilter('${brand}')">
            <span>${brand}</span>
        </label>
    `).join('');
}

/**
 * Setup event listeners
 */
function setupEventListeners() {
    // Filter toggle (mobile)
    document.getElementById('filterToggle')?.addEventListener('click', () => {
        document.getElementById('filtersContainer').classList.toggle('active');
    });

    // View toggle
    document.querySelectorAll('.view-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.view-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            const view = btn.dataset.view;
            const grid = document.getElementById('productsGrid');
            
            if (view === 'list') {
                grid.classList.add('list-view');
            } else {
                grid.classList.remove('list-view');
            }
        });
    });

    // Brand search
    document.getElementById('brandSearch')?.addEventListener('input', (e) => {
        const search = e.target.value.toLowerCase();
        const checkboxes = document.querySelectorAll('#brandsFilter .filter-checkbox');
        
        checkboxes.forEach(cb => {
            const text = cb.textContent.toLowerCase();
            cb.style.display = text.includes(search) ? 'flex' : 'none';
        });
    });
}

/**
 * Toggle category filter
 */
function toggleCategoryFilter(categoryId) {
    const index = currentFilters.categories.indexOf(categoryId);
    
    if (index === -1) {
        currentFilters.categories.push(categoryId);
    } else {
        currentFilters.categories.splice(index, 1);
    }
    
    applyFilters();
}

/**
 * Toggle brand filter
 */
function toggleBrandFilter(brand) {
    const index = currentFilters.brands.indexOf(brand);
    
    if (index === -1) {
        currentFilters.brands.push(brand);
    } else {
        currentFilters.brands.splice(index, 1);
    }
    
    applyFilters();
}


/**
 * Apply all filters
 */
function applyFilters() {
    // Get vehicle type filters
    currentFilters.vehicleType = [];
    if (document.getElementById('filterCar')?.checked) currentFilters.vehicleType.push('car');
    if (document.getElementById('filterMoto')?.checked) currentFilters.vehicleType.push('moto');
    if (document.getElementById('filterUniversal')?.checked) currentFilters.vehicleType.push('universal');

    // Get other filters
    currentFilters.promo = document.getElementById('filterPromo')?.checked || false;
    currentFilters.fastShipping = document.getElementById('filterFastShipping')?.checked || false;
    currentFilters.inStock = document.getElementById('filterInStock')?.checked || false;

    // Filter products
    filteredProducts = window.catalogProducts.filter(product => {
        // Category filter
        if (currentFilters.categories.length > 0 && 
            !currentFilters.categories.includes(product.category)) {
            return false;
        }

        // Brand filter
        if (currentFilters.brands.length > 0 && 
            !currentFilters.brands.includes(product.brand)) {
            return false;
        }

        // Vehicle type filter (assumindo que todos produtos são universal por enquanto)
        // Você pode adicionar essa propriedade aos produtos depois
        // if (currentFilters.vehicleType.length > 0 && 
        //     product.vehicleType && 
        //     !currentFilters.vehicleType.includes(product.vehicleType)) {
        //     return false;
        // }

        // Promo filter
        if (currentFilters.promo && !product.salePrice) {
            return false;
        }

        // Fast shipping filter
        if (currentFilters.fastShipping && !product.fastShipping) {
            return false;
        }

        // In stock filter
        if (currentFilters.inStock && product.stock <= 0) {
            return false;
        }

        return true;
    });

    // Apply sort
    applySort();
    
    // Reset to page 1
    currentPage = 1;
    
    // Render
    renderActiveFilters();
    renderProducts();
    renderPagination();
    updateResultsCount();
}

/**
 * Apply sorting
 */
function applySort() {
    const sortValue = document.getElementById('sortSelect')?.value || currentSort;
    currentSort = sortValue;

    switch (sortValue) {
        case 'price-asc':
            filteredProducts.sort((a, b) => {
                const priceA = a.salePrice || a.price;
                const priceB = b.salePrice || b.price;
                return priceA - priceB;
            });
            break;
        
        case 'price-desc':
            filteredProducts.sort((a, b) => {
                const priceA = a.salePrice || a.price;
                const priceB = b.salePrice || b.price;
                return priceB - priceA;
            });
            break;
        
        case 'name-asc':
            filteredProducts.sort((a, b) => a.name.localeCompare(b.name));
            break;
        
        case 'name-desc':
            filteredProducts.sort((a, b) => b.name.localeCompare(a.name));
            break;
        
        case 'newest':
            filteredProducts.sort((a, b) => b.id.localeCompare(a.id));
            break;
        
        default: // featured
            filteredProducts.sort((a, b) => {
                if (a.featured && !b.featured) return -1;
                if (!a.featured && b.featured) return 1;
                return b.rating - a.rating;
            });
    }

    renderProducts();
}

/**
 * Render active filters
 */
function renderActiveFilters() {
    const container = document.getElementById('activeFilters');
    const tags = [];

    // Categories
    currentFilters.categories.forEach(catId => {
        const cat = window.categories.find(c => c.id === catId);
        if (cat) {
            tags.push({ type: 'category', value: catId, label: cat.name });
        }
    });

    // Brands
    currentFilters.brands.forEach(brand => {
        tags.push({ type: 'brand', value: brand, label: brand });
    });

    // Vehicle Type
    if (currentFilters.vehicleType.includes('car')) {
        tags.push({ type: 'vehicleType', value: 'car', label: '🚗 Carros' });
    }
    if (currentFilters.vehicleType.includes('moto')) {
        tags.push({ type: 'vehicleType', value: 'moto', label: '🏍️ Motos' });
    }
    if (currentFilters.vehicleType.includes('universal')) {
        tags.push({ type: 'vehicleType', value: 'universal', label: '⚙️ Universal' });
    }

    // Others
    if (currentFilters.promo) {
        tags.push({ type: 'promo', value: null, label: 'Em Promoção' });
    }
    if (currentFilters.fastShipping) {
        tags.push({ type: 'fastShipping', value: null, label: 'Entrega Rápida' });
    }
    if (currentFilters.inStock) {
        tags.push({ type: 'inStock', value: null, label: 'Em Estoque' });
    }

    if (tags.length === 0) {
        container.style.display = 'none';
        return;
    }

    container.style.display = 'flex';
    container.innerHTML = tags.map(tag => `
        <span class="filter-tag">
            ${tag.label}
            <button onclick="removeFilter('${tag.type}', '${tag.value}')">×</button>
        </span>
    `).join('');
}

/**
 * Remove filter
 */
function removeFilter(type, value) {
    switch (type) {
        case 'category':
            const catIndex = currentFilters.categories.indexOf(value);
            if (catIndex !== -1) {
                currentFilters.categories.splice(catIndex, 1);
                document.querySelector(`#categoriesFilter input[value="${value}"]`).checked = false;
            }
            break;
        
        case 'brand':
            const brandIndex = currentFilters.brands.indexOf(value);
            if (brandIndex !== -1) {
                currentFilters.brands.splice(brandIndex, 1);
                document.querySelector(`#brandsFilter input[value="${value}"]`).checked = false;
            }
            break;
        
        case 'vehicleType':
            const vtIndex = currentFilters.vehicleType.indexOf(value);
            if (vtIndex !== -1) {
                currentFilters.vehicleType.splice(vtIndex, 1);
            }
            // Atualiza checkboxes
            if (value === 'car') document.getElementById('filterCar').checked = false;
            if (value === 'moto') document.getElementById('filterMoto').checked = false;
            if (value === 'universal') document.getElementById('filterUniversal').checked = false;
            break;
        
        case 'promo':
            currentFilters.promo = false;
            document.getElementById('filterPromo').checked = false;
            break;
        
        case 'fastShipping':
            currentFilters.fastShipping = false;
            document.getElementById('filterFastShipping').checked = false;
            break;
        
        case 'inStock':
            currentFilters.inStock = false;
            document.getElementById('filterInStock').checked = false;
            break;
    }

    applyFilters();
}

/**
 * Clear all filters
 */
function clearAllFilters() {
    currentFilters = {
        categories: [],
        brands: [],
        vehicleType: [],
        promo: false,
        fastShipping: false,
        inStock: false
    };

    // Uncheck all checkboxes
    document.querySelectorAll('.filter-checkbox input[type="checkbox"]').forEach(cb => {
        cb.checked = false;
    });

    applyFilters();
}

/**
 * Render products
 */
function renderProducts() {
    const grid = document.getElementById('productsGrid');
    const noResults = document.getElementById('noResults');

    if (filteredProducts.length === 0) {
        grid.style.display = 'none';
        noResults.style.display = 'block';
        return;
    }

    grid.style.display = 'grid';
    noResults.style.display = 'none';

    // Paginate
    const start = (currentPage - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    const productsToShow = filteredProducts.slice(start, end);

    grid.innerHTML = productsToShow.map(product => `
        <div class="product-card-catalog">
            <div class="product-card-image">
                <img src="../${product.image}" alt="${product.name}" loading="lazy">
                ${product.salePrice ? '<span class="product-badge-catalog promo">Oferta</span>' : ''}
                ${product.fastShipping ? '<span class="product-fast-badge">⚡ RÁPIDO</span>' : ''}
            </div>
            <div class="product-card-content">
                <h3 class="product-card-title">${product.name}</h3>
                <p class="product-card-sku">SKU: ${product.sku}</p>
                <div class="product-card-rating">
                    <span class="stars">${'★'.repeat(Math.floor(product.rating))}${'☆'.repeat(5 - Math.floor(product.rating))}</span>
                    <span class="reviews-count">(${product.reviews})</span>
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
                    <button class="btn-add-cart" onclick="addProductToCart('${product.id}', this)">
                        Adicionar
                    </button>
                    <button class="btn-view-details" onclick="viewProduct('${product.id}')" title="Ver detalhes">
                        👁️
                    </button>
                </div>
            </div>
        </div>
    `).join('');
}

/**
 * Render pagination
 */
function renderPagination() {
    const container = document.getElementById('pagination');
    const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);

    if (totalPages <= 1) {
        container.innerHTML = '';
        return;
    }

    let html = `
        <button class="page-btn" onclick="changePage(${currentPage - 1})" ${currentPage === 1 ? 'disabled' : ''}>
            ‹
        </button>
    `;

    for (let i = 1; i <= totalPages; i++) {
        if (
            i === 1 || 
            i === totalPages || 
            (i >= currentPage - 1 && i <= currentPage + 1)
        ) {
            html += `
                <button 
                    class="page-btn ${i === currentPage ? 'active' : ''}" 
                    onclick="changePage(${i})">
                    ${i}
                </button>
            `;
        } else if (i === currentPage - 2 || i === currentPage + 2) {
            html += '<span style="padding: 0 8px;">...</span>';
        }
    }

    html += `
        <button class="page-btn" onclick="changePage(${currentPage + 1})" ${currentPage === totalPages ? 'disabled' : ''}>
            ›
        </button>
    `;

    container.innerHTML = html;
}

/**
 * Change page
 */
function changePage(page) {
    const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
    
    if (page < 1 || page > totalPages) return;
    
    currentPage = page;
    renderProducts();
    renderPagination();
    
    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

/**
 * Update results count
 */
function updateResultsCount() {
    const count = filteredProducts.length;
    const text = count === 1 ? 'produto encontrado' : 'produtos encontrados';
    document.getElementById('resultsCount').textContent = `${count} ${text}`;
}

/**
 * Add product to cart
 */
function addProductToCart(productId, button) {
    const product = window.catalogProducts.find(p => p.id === productId);
    
    if (!product) return;

    // Animate button
    button.style.transform = 'scale(0.95)';
    setTimeout(() => button.style.transform = 'scale(1)', 150);

    // Add to cart
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
 * View product details
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

