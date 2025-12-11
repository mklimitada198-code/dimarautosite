/**
 * Catalog Page - Main Script (REFATORADO)
 * Integração com Supabase + Filtros, ordenação, paginação
 */

// ==================== STATE ====================
let allProducts = [];
let filteredProducts = [];
let allCategories = [];
let allBrands = [];

let currentFilters = {
    categories: [],
    brands: [],
    vehicleType: [],
    promo: false,
    fastShipping: false,
    inStock: false
};

let currentSort = 'featured';
let currentPage = 1;
const itemsPerPage = 12;

console.log('📦 catalog.js carregado (VERSÃO REFATORADA)');

// ==================== WAIT FOR SUPABASE ====================
function waitForSupabase(callback) {
    let attempts = 0;
    const maxAttempts = 50; // 5 segundos max

    const checkInterval = setInterval(() => {
        attempts++;

        if (window.supabaseClient) {
            console.log('✅ Supabase detectado!');
            clearInterval(checkInterval);
            callback(true);
        } else if (attempts >= maxAttempts) {
            console.warn('⚠️ Timeout aguardando Supabase, usando dados estáticos');
            clearInterval(checkInterval);
            callback(false);
        }
    }, 100);
}

// ==================== INICIALIZAÇÃO ====================
document.addEventListener('DOMContentLoaded', () => {
    console.log('🚀 DOM pronto, aguardando Supabase...');
    showLoadingSkeleton();

    waitForSupabase(async (supabaseAvailable) => {
        await initializeCatalog(supabaseAvailable);
    });
});

/**
 * Initialize catalog
 */
async function initializeCatalog(supabaseAvailable) {
    try {
        // Carregar dados
        await loadProducts(supabaseAvailable);
        await loadCategories(supabaseAvailable);
        await loadBrands(supabaseAvailable);

        // Renderizar filtros
        renderCategoryFilters();
        renderBrandFilters();

        // Setup e aplicar
        setupEventListeners();
        checkUrlParams();
        applyFilters();

        console.log('✅ Catálogo inicializado com', allProducts.length, 'produtos');
    } catch (error) {
        console.error('❌ Erro ao inicializar catálogo:', error);
        hideLoadingSkeleton();
    }
}

// ==================== LOADING SKELETON ====================
function showLoadingSkeleton() {
    const grid = document.getElementById('productsGrid');
    if (!grid) return;

    grid.innerHTML = Array(8).fill(`
        <div class="product-card-catalog skeleton-card">
            <div class="skeleton-image"></div>
            <div class="skeleton-content">
                <div class="skeleton-text" style="width: 80%; height: 16px;"></div>
                <div class="skeleton-text" style="width: 50%; height: 14px;"></div>
                <div class="skeleton-text" style="width: 60%; height: 20px;"></div>
            </div>
        </div>
    `).join('');
}

function hideLoadingSkeleton() {
    const skeletons = document.querySelectorAll('.skeleton-card');
    skeletons.forEach(s => s.remove());
}

// ==================== CARREGAR PRODUTOS ====================
async function loadProducts(supabaseAvailable) {
    console.log('📥 Carregando produtos...');

    if (supabaseAvailable && window.supabaseClient) {
        try {
            const { data, error } = await window.supabaseClient
                .from('products')
                .select('*')
                .eq('status', 'active')
                .order('featured', { ascending: false })
                .order('created_at', { ascending: false });

            if (error) throw error;

            allProducts = data || [];
            console.log(`✅ ${allProducts.length} produtos carregados do Supabase`);
            return;
        } catch (error) {
            console.error('❌ Erro ao carregar do Supabase:', error);
        }
    }

    // Se não conectou ao Supabase, mostra mensagem de erro
    allProducts = [];
    console.log('⚠️ Nenhum produto disponível - Supabase não conectado');
}

// ==================== CARREGAR CATEGORIAS ====================
async function loadCategories(supabaseAvailable) {
    console.log('📥 Carregando categorias...');

    if (supabaseAvailable && window.supabaseClient) {
        try {
            const { data, error } = await window.supabaseClient
                .from('categories')
                .select('*')
                .order('name');

            if (error) throw error;

            allCategories = (data || []).map(cat => ({
                id: cat.slug || cat.id,
                name: cat.name,
                icon: cat.icon || '📦'
            }));
            console.log(`✅ ${allCategories.length} categorias carregadas`);
            return;
        } catch (error) {
            console.error('❌ Erro ao carregar categorias:', error);
        }
    }

    // Fallback: categorias padrão
    allCategories = [
        { id: 'motor', name: 'Motor', icon: '🔧' },
        { id: 'freios', name: 'Freios', icon: '🛑' },
        { id: 'suspensao', name: 'Suspensão', icon: '🔩' },
        { id: 'eletrica', name: 'Elétrica', icon: '⚡' },
        { id: 'filtros', name: 'Filtros', icon: '🌀' },
        { id: 'iluminacao', name: 'Iluminação', icon: '💡' },
        { id: 'acessorios', name: 'Acessórios', icon: '🎯' }
    ];
    console.log('📦 Categorias padrão carregadas');
}

// ==================== CARREGAR MARCAS ====================
async function loadBrands(supabaseAvailable) {
    console.log('📥 Carregando marcas...');

    if (supabaseAvailable && window.supabaseClient) {
        try {
            const { data, error } = await window.supabaseClient
                .from('brands')
                .select('name')
                .order('name');

            if (error) throw error;

            allBrands = (data || []).map(b => b.name);
            console.log(`✅ ${allBrands.length} marcas carregadas`);
            return;
        } catch (error) {
            console.error('❌ Erro ao carregar marcas:', error);
        }
    }

    // Fallback: extrair das marcas dos produtos
    allBrands = [...new Set(allProducts.map(p => p.brand).filter(Boolean))].sort();
    console.log('📦 Marcas extraídas dos produtos');
}

// ==================== CHECK URL PARAMS ====================
function checkUrlParams() {
    const params = new URLSearchParams(window.location.search);
    const categoria = params.get('categoria');

    if (categoria) {
        currentFilters.categories.push(categoria);
        console.log('🔍 Filtro de categoria via URL:', categoria);
    }
}

// ==================== RENDER CATEGORY FILTERS ====================
function renderCategoryFilters() {
    const container = document.getElementById('categoriesFilter');
    if (!container) return;

    if (allCategories.length === 0) {
        container.innerHTML = '<p style="color: #999; font-size: 14px;">Nenhuma categoria</p>';
        return;
    }

    container.innerHTML = allCategories.map(cat => `
        <label class="filter-checkbox">
            <input 
                type="checkbox" 
                value="${cat.id}"
                ${currentFilters.categories.includes(cat.id) ? 'checked' : ''}
                onchange="toggleCategoryFilter('${cat.id}')">
            <span>${cat.icon} ${cat.name}</span>
        </label>
    `).join('');
}

// ==================== RENDER BRAND FILTERS ====================
function renderBrandFilters() {
    const container = document.getElementById('brandsFilter');
    if (!container) return;

    if (allBrands.length === 0) {
        container.innerHTML = '<p style="color: #999; font-size: 14px;">Nenhuma marca</p>';
        return;
    }

    container.innerHTML = allBrands.map(brand => `
        <label class="filter-checkbox">
            <input 
                type="checkbox" 
                value="${brand}"
                onchange="toggleBrandFilter('${brand}')">
            <span>${brand}</span>
        </label>
    `).join('');
}

// ==================== SETUP EVENT LISTENERS ====================
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

    console.log('✅ Event listeners configurados');
}

// ==================== TOGGLE FILTERS ====================
function toggleCategoryFilter(categoryId) {
    const index = currentFilters.categories.indexOf(categoryId);

    if (index === -1) {
        currentFilters.categories.push(categoryId);
    } else {
        currentFilters.categories.splice(index, 1);
    }

    applyFilters();
}

function toggleBrandFilter(brand) {
    const index = currentFilters.brands.indexOf(brand);

    if (index === -1) {
        currentFilters.brands.push(brand);
    } else {
        currentFilters.brands.splice(index, 1);
    }

    applyFilters();
}

// ==================== APPLY FILTERS ====================
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
    filteredProducts = allProducts.filter(product => {
        // Category filter (compatível com Supabase - usa 'category' como string)
        if (currentFilters.categories.length > 0) {
            const productCategory = product.category?.toLowerCase() || '';
            const matches = currentFilters.categories.some(cat =>
                productCategory === cat.toLowerCase() ||
                productCategory.includes(cat.toLowerCase())
            );
            if (!matches) return false;
        }

        // Brand filter
        if (currentFilters.brands.length > 0 &&
            !currentFilters.brands.includes(product.brand)) {
            return false;
        }

        // Promo filter (compatível com Supabase - usa 'sale_price')
        if (currentFilters.promo && !product.sale_price && !product.salePrice) {
            return false;
        }

        // Fast shipping filter
        if (currentFilters.fastShipping && !product.fast_shipping && !product.fastShipping) {
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

// ==================== APPLY SORT ====================
function applySort() {
    const sortValue = document.getElementById('sortSelect')?.value || currentSort;
    currentSort = sortValue;

    switch (sortValue) {
        case 'price-asc':
            filteredProducts.sort((a, b) => {
                const priceA = a.sale_price || a.salePrice || a.price;
                const priceB = b.sale_price || b.salePrice || b.price;
                return priceA - priceB;
            });
            break;

        case 'price-desc':
            filteredProducts.sort((a, b) => {
                const priceA = a.sale_price || a.salePrice || a.price;
                const priceB = b.sale_price || b.salePrice || b.price;
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
            filteredProducts.sort((a, b) => {
                const dateA = new Date(a.created_at || 0);
                const dateB = new Date(b.created_at || 0);
                return dateB - dateA;
            });
            break;

        default: // featured
            filteredProducts.sort((a, b) => {
                if (a.featured && !b.featured) return -1;
                if (!a.featured && b.featured) return 1;
                return 0;
            });
    }
}

// ==================== RENDER ACTIVE FILTERS ====================
function renderActiveFilters() {
    const container = document.getElementById('activeFilters');
    if (!container) return;

    const tags = [];

    // Categories
    currentFilters.categories.forEach(catId => {
        const cat = allCategories.find(c => c.id === catId);
        tags.push({ type: 'category', value: catId, label: cat?.name || catId });
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

// ==================== REMOVE FILTER ====================
function removeFilter(type, value) {
    switch (type) {
        case 'category':
            const catIndex = currentFilters.categories.indexOf(value);
            if (catIndex !== -1) {
                currentFilters.categories.splice(catIndex, 1);
                const checkbox = document.querySelector(`#categoriesFilter input[value="${value}"]`);
                if (checkbox) checkbox.checked = false;
            }
            break;

        case 'brand':
            const brandIndex = currentFilters.brands.indexOf(value);
            if (brandIndex !== -1) {
                currentFilters.brands.splice(brandIndex, 1);
                const checkbox = document.querySelector(`#brandsFilter input[value="${value}"]`);
                if (checkbox) checkbox.checked = false;
            }
            break;

        case 'vehicleType':
            const vtIndex = currentFilters.vehicleType.indexOf(value);
            if (vtIndex !== -1) {
                currentFilters.vehicleType.splice(vtIndex, 1);
            }
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

// ==================== CLEAR ALL FILTERS ====================
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

// ==================== RENDER PRODUCTS ====================
function renderProducts() {
    const grid = document.getElementById('productsGrid');
    const noResults = document.getElementById('noResults');

    if (!grid) return;

    if (filteredProducts.length === 0) {
        grid.style.display = 'none';
        if (noResults) noResults.style.display = 'block';
        return;
    }

    grid.style.display = 'grid';
    if (noResults) noResults.style.display = 'none';

    // Paginate
    const start = (currentPage - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    const productsToShow = filteredProducts.slice(start, end);

    grid.innerHTML = productsToShow.map(product => {
        // Compatibilidade de campos entre Supabase e dados estáticos
        const salePrice = product.sale_price || product.salePrice;
        const fastShipping = product.fast_shipping || product.fastShipping;
        const shortDesc = product.short_description || product.description || '';

        // Determinar imagem (Supabase usa array 'images', estático usa 'image')
        let imageUrl = '';
        if (product.images && product.images.length > 0) {
            imageUrl = product.images[0];
        } else if (product.image) {
            // Se já é URL absoluta, não adicionar '../'
            imageUrl = product.image.startsWith('http') ? product.image : `../${product.image}`;
        }

        // Placeholder se não tiver imagem
        if (!imageUrl) {
            imageUrl = '../assets/images/placeholder-produto.png';
        }

        // Badge
        let badge = '';
        if (product.badge_type === 'destaque' || product.featured) {
            badge = '<span class="product-badge-catalog destaque">Destaque</span>';
        } else if (product.badge_type === 'oferta' || salePrice) {
            badge = '<span class="product-badge-catalog promo">Oferta</span>';
        } else if (product.badge_type === 'mais-vendido') {
            badge = '<span class="product-badge-catalog hot">Mais Vendido</span>';
        } else if (product.custom_badge_text) {
            badge = `<span class="product-badge-catalog">${product.custom_badge_text}</span>`;
        }

        return `
        <div class="product-card-catalog">
            <div class="product-card-image">
                <img src="${imageUrl}" alt="${product.name}" loading="lazy" 
                     onerror="this.src='../assets/images/placeholder-produto.png'">
                ${badge}
                ${fastShipping ? '<span class="product-fast-badge">⚡ RÁPIDO</span>' : ''}
            </div>
            <div class="product-card-content">
                <h3 class="product-card-title">${product.name}</h3>
                <p class="product-card-sku">SKU: ${product.sku || 'N/A'}</p>
                <div class="product-card-price">
                    ${salePrice ? `
                        <span class="price-original">R$ ${formatPrice(product.price)}</span>
                        <span class="price-current">R$ ${formatPrice(salePrice)}</span>
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
    `}).join('');
}

// ==================== RENDER PAGINATION ====================
function renderPagination() {
    const container = document.getElementById('pagination');
    if (!container) return;

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

// ==================== CHANGE PAGE ====================
function changePage(page) {
    const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);

    if (page < 1 || page > totalPages) return;

    currentPage = page;
    renderProducts();
    renderPagination();

    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// ==================== UPDATE RESULTS COUNT ====================
function updateResultsCount() {
    const count = filteredProducts.length;
    const text = count === 1 ? 'produto encontrado' : 'produtos encontrados';
    const el = document.getElementById('resultsCount');
    if (el) el.textContent = `${count} ${text}`;
}

// ==================== ADD TO CART ====================
function addProductToCart(productId, button) {
    const product = allProducts.find(p => p.id === productId);

    if (!product) {
        console.warn('Produto não encontrado:', productId);
        return;
    }

    // Animate button
    button.style.transform = 'scale(0.95)';
    setTimeout(() => button.style.transform = 'scale(1)', 150);

    // Add to cart (compatível com Supabase)
    if (window.cart && window.cart.addItem) {
        window.cart.addItem({
            id: product.id,
            name: product.name,
            sku: product.sku,
            price: product.price,
            salePrice: product.sale_price || product.salePrice,
            image: product.images?.[0] || product.image,
            quantity: 1
        });
    }

    // Visual feedback
    const originalHTML = button.innerHTML;
    button.innerHTML = '✓ Adicionado!';
    button.style.background = '#27ae60';

    setTimeout(() => {
        button.innerHTML = originalHTML;
        button.style.background = '';
    }, 2000);
}

// ==================== VIEW PRODUCT ====================
function viewProduct(productId) {
    window.location.href = `produto.html?id=${productId}`;
}

// ==================== FORMAT PRICE ====================
function formatPrice(value) {
    if (!value && value !== 0) return '0,00';
    return parseFloat(value).toFixed(2).replace('.', ',');
}

console.log('✅ catalog.js totalmente carregado!');
