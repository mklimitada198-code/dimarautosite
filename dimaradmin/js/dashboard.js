/**
 * Dashboard - Real-time Statistics and Quick Actions
 * 
 * CORREÇÃO 2024-12-10: Adicionado waitForSupabase para garantir
 * que estatísticas só carregam quando Supabase está pronto.
 */

// State
let stats = {
    products: 0,
    categories: 0,
    banners: 0,
    brands: 0,
    customers: 0
};

let recentProducts = [];

// ==================== WAIT FOR SUPABASE ====================
function waitForSupabase(callback) {
    let attempts = 0;
    const maxAttempts = 30; // 3 seconds max

    const checkInterval = setInterval(() => {
        attempts++;

        if (window.supabaseClient) {
            console.log('✅ Dashboard: Supabase detectado!');
            clearInterval(checkInterval);
            callback();
        } else if (attempts >= maxAttempts) {
            console.warn('⚠️ Dashboard: Timeout aguardando Supabase, usando localStorage');
            clearInterval(checkInterval);
            callback();
        }
    }, 100);
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    console.log('📊 Dashboard: Inicializando...');

    // Aguardar Supabase estar pronto
    waitForSupabase(() => {
        loadDashboardStats();
        loadRecentProducts();
        setupQuickActions();
    });
});

/**
 * Load dashboard statistics
 */
async function loadDashboardStats() {
    console.log('📊 Carregando estatísticas do dashboard...');

    try {
        // Verificar se Supabase está disponível
        const useSupabase = typeof checkSupabaseConfig === 'function' &&
            checkSupabaseConfig() &&
            window.supabaseClient;

        if (useSupabase) {
            console.log('🔌 Carregando estatísticas do Supabase...');

            // Load from Supabase
            const [products, categories, banners, brands, customers] = await Promise.all([
                window.supabaseClient.from('products').select('*', { count: 'exact', head: true }),
                window.supabaseClient.from('categories').select('*', { count: 'exact', head: true }),
                window.supabaseClient.from('banners').select('*', { count: 'exact', head: true }),
                window.supabaseClient.from('brands').select('*', { count: 'exact', head: true }),
                window.supabaseClient.from('customers').select('*', { count: 'exact', head: true })
            ]);

            stats.products = products.count || 0;
            stats.categories = categories.count || 0;
            stats.banners = banners.count || 0;
            stats.brands = brands.count || 0;
            stats.customers = customers.count || 0;

            console.log('✅ Estatísticas carregadas:', stats);
        } else {
            console.warn('⚠️ Supabase não disponível, usando localStorage');

            // Load from localStorage
            const storedProducts = localStorage.getItem('dimar_products');
            const storedCategories = localStorage.getItem('dimar_categories');
            const storedBanners = localStorage.getItem('dimar_banners');
            const storedBrands = localStorage.getItem('dimar_brands');

            stats.products = storedProducts ? JSON.parse(storedProducts).length : 0;
            stats.categories = storedCategories ? JSON.parse(storedCategories).length : 7;
            stats.banners = storedBanners ? JSON.parse(storedBanners).length : 0;
            stats.brands = storedBrands ? JSON.parse(storedBrands).length : 0;
        }

        updateStatsDisplay();
    } catch (error) {
        console.error('❌ Erro ao carregar estatísticas:', error);
        updateStatsDisplay();
    }
}

/**
 * Update stats display
 */
function updateStatsDisplay() {
    // Update stat cards
    document.getElementById('statProducts').textContent = stats.products;
    document.getElementById('statCategories').textContent = stats.categories;
    document.getElementById('statBanners').textContent = stats.banners;
    document.getElementById('statBrands').textContent = stats.brands;

    const customersEl = document.getElementById('statCustomers');
    if (customersEl) customersEl.textContent = stats.customers;

    // Add animation
    animateNumbers();
}

/**
 * Animate numbers counting up
 */
function animateNumbers() {
    const elements = [
        { id: 'statProducts', target: stats.products },
        { id: 'statCategories', target: stats.categories },
        { id: 'statBanners', target: stats.banners },
        { id: 'statBrands', target: stats.brands },
        { id: 'statCustomers', target: stats.customers }
    ];

    elements.forEach(({ id, target }) => {
        const el = document.getElementById(id);
        if (!el) return;

        let current = 0;
        const increment = target / 20;
        const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
                el.textContent = target;
                clearInterval(timer);
            } else {
                el.textContent = Math.floor(current);
            }
        }, 50);
    });
}

/**
 * Load recent products
 */
async function loadRecentProducts() {
    try {
        if (checkSupabaseConfig()) {
            const { data, error } = await supabaseClient
                .from('products')
                .select('*')
                .order('created_at', { ascending: false })
                .limit(5);

            if (error) throw error;
            recentProducts = data || [];
        } else {
            const stored = localStorage.getItem('dimar_products');
            const products = stored ? JSON.parse(stored) : [];
            recentProducts = products.slice(0, 5);
        }

        renderRecentProducts();
    } catch (error) {
        console.error('Erro ao carregar produtos recentes:', error);
        renderRecentProducts();
    }
}

/**
 * Render recent products table
 */
function renderRecentProducts() {
    const tbody = document.getElementById('recentProductsBody');
    if (!tbody) return;

    if (recentProducts.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="4" style="text-align: center; padding: 40px; color: #7f8c8d;">
                    Nenhum produto cadastrado ainda.
                </td>
            </tr>
        `;
        return;
    }

    tbody.innerHTML = recentProducts.map(product => `
        <tr>
            <td>
                ${product.images && product.images.length > 0
            ? `<img src="${product.images[0]}" style="width: 50px; height: 50px; object-fit: cover; border-radius: 8px;" alt="${product.name}">`
            : '<div style="width:50px;height:50px;background:#f0f0f0;border-radius:8px;display:flex;align-items:center;justify-content:center;">📦</div>'
        }
            </td>
            <td><strong>${product.name}</strong></td>
            <td>R$ ${parseFloat(product.price).toFixed(2)}</td>
            <td>
                <span class="badge ${product.status === 'active' ? 'badge-success' : 'badge-danger'}">
                    ${product.status === 'active' ? 'Ativo' : 'Inativo'}
                </span>
            </td>
        </tr>
    `).join('');
}

/**
 * Setup quick actions
 */
function setupQuickActions() {
    // These will open the respective pages
    const actions = {
        'addProduct': () => window.location.href = 'produtos.html',
        'manageCategories': () => window.location.href = 'categorias.html',
        'editBanners': () => window.location.href = 'banners.html',
        'manageBrands': () => window.location.href = 'marcas.html'
    };

    Object.keys(actions).forEach(actionId => {
        const el = document.getElementById(actionId);
        if (el) {
            el.addEventListener('click', actions[actionId]);
        }
    });
}

/**
 * Refresh dashboard data
 */
async function refreshDashboard() {
    const refreshBtn = document.getElementById('refreshBtn');
    if (refreshBtn) {
        refreshBtn.disabled = true;
        refreshBtn.innerHTML = '🔄 Atualizando...';
    }

    await Promise.all([
        loadDashboardStats(),
        loadRecentProducts()
    ]);

    if (refreshBtn) {
        refreshBtn.disabled = false;
        refreshBtn.innerHTML = '🔄 Atualizar';
    }
}
