// ==================== SEARCH SYSTEM ====================
// Sistema de busca completo com autocomplete, histórico e resultados

class SearchSystem {
    constructor() {
        this.searchHistory = this.loadSearchHistory();
        this.allProducts = [];
        this.searchInput = null;
        this.searchButton = null;
        this.suggestionsContainer = null;
        this.debounceTimer = null;
        this.productsLoaded = false;
        this.init();
    }

    init() {
        // Aguarda produtos carregarem
        this.waitForProducts();

        // Aguarda o DOM estar pronto
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.setupSearch());
        } else {
            this.setupSearch();
        }
    }

    waitForProducts() {
        // Tentar carregar do Supabase primeiro
        this.loadProductsFromSupabase();
    }

    async loadProductsFromSupabase() {
        console.log('🔍 Search: Carregando produtos...');

        // Aguardar Supabase estar pronto
        let attempts = 0;
        while (!window.supabaseClient && attempts < 30) {
            await new Promise(resolve => setTimeout(resolve, 100));
            attempts++;
        }

        try {
            if (window.supabaseClient) {
                console.log('🔍 Search: Buscando do Supabase...');
                const { data, error } = await window.supabaseClient
                    .from('products')
                    .select('*')
                    .eq('status', 'active')
                    .order('name', { ascending: true });

                if (!error && data && data.length > 0) {
                    this.allProducts = data.map(p => this.normalizeProductData(p));
                    this.productsLoaded = true;
                    console.log(`✅ Search: ${this.allProducts.length} produtos carregados do Supabase`);
                    return;
                } else if (error) {
                    console.warn('⚠️ Search: Erro Supabase:', error.message);
                }
            }
        } catch (err) {
            console.warn('⚠️ Search: Erro ao carregar do Supabase:', err);
        }

        // Fallback para dados locais
        if (window.productsData && window.productsData.length > 0) {
            this.allProducts = window.productsData;
            this.productsLoaded = true;
            console.log('✅ Search: Produtos carregados (productsData local)');
        } else if (window.catalogProducts && window.catalogProducts.length > 0) {
            this.allProducts = window.catalogProducts;
            this.productsLoaded = true;
            console.log('✅ Search: Produtos carregados (catalogProducts local)');
        } else {
            console.warn('⚠️ Search: Nenhum produto disponível');
        }
    }

    normalizeProductData(product) {
        // Normalizar dados do produto do Supabase
        const price = product.sale_price || product.price;
        const formattedPrice = typeof price === 'number'
            ? `R$ ${price.toFixed(2).replace('.', ',')}`
            : price;

        // Determinar imagem principal
        let image = '../assets/images/produto-1.jpg';
        if (product.images && product.images.length > 0) {
            const firstImage = product.images[0];
            if (firstImage && typeof firstImage === 'string') {
                image = firstImage.startsWith('http') || firstImage.startsWith('data:')
                    ? firstImage
                    : '../' + firstImage;
            }
        }

        return {
            id: product.id,
            name: product.name,
            sku: product.sku || '',
            category: product.category || '',
            brand: product.brand || '',
            description: product.description || '',
            price: formattedPrice,
            numericPrice: product.sale_price || product.price,
            salePrice: product.sale_price,
            originalPrice: product.price,
            image: image,
            inStock: product.stock > 0,
            fastShipping: product.fast_shipping || false
        };
    }

    setupSearch() {
        // Elementos de busca
        this.searchInput = document.querySelector('.search-input');
        this.searchButton = document.querySelector('.search-button');

        if (!this.searchInput || !this.searchButton) return;

        // Criar container de sugestões
        this.createSuggestionsContainer();

        // Event Listeners
        this.searchInput.addEventListener('input', (e) => this.handleInput(e));
        this.searchInput.addEventListener('focus', () => this.showSuggestions());
        this.searchInput.addEventListener('keydown', (e) => this.handleKeydown(e));
        this.searchButton.addEventListener('click', () => this.performSearch());

        // Fechar sugestões ao clicar fora
        document.addEventListener('click', (e) => {
            if (!e.target.closest('.search-container')) {
                this.hideSuggestions();
            }
        });
    }

    createSuggestionsContainer() {
        // Remove container existente se houver
        const existing = document.querySelector('.search-suggestions');
        if (existing) existing.remove();

        // Cria novo container
        this.suggestionsContainer = document.createElement('div');
        this.suggestionsContainer.className = 'search-suggestions';
        this.suggestionsContainer.style.display = 'none';

        const searchContainer = this.searchInput.closest('.search-container');
        searchContainer.style.position = 'relative';
        searchContainer.appendChild(this.suggestionsContainer);
    }

    handleInput(e) {
        const query = e.target.value.trim();

        // Debounce para não buscar a cada letra
        clearTimeout(this.debounceTimer);

        if (query.length < 2) {
            this.hideSuggestions();
            return;
        }

        this.debounceTimer = setTimeout(() => {
            this.generateSuggestions(query);
        }, 300);
    }

    generateSuggestions(query) {
        // Mostrar loading enquanto processa
        if (!this.productsLoaded) {
            this.suggestionsContainer.innerHTML = `
                <div class="suggestion-loading">
                    <div class="loading-spinner"></div>
                    <p>Carregando produtos...</p>
                </div>
            `;
            this.showSuggestions();

            // Tentar novamente após 500ms
            setTimeout(() => {
                if (this.productsLoaded) {
                    this.generateSuggestions(query);
                }
            }, 500);
            return;
        }

        const suggestions = this.getSuggestions(query);

        if (suggestions.length === 0) {
            this.showNoResults();
            return;
        }

        this.renderSuggestions(suggestions);
        this.showSuggestions();
    }

    getSuggestions(query) {
        const normalizedQuery = this.normalizeString(query);
        const suggestions = [];

        // Verificar se produtos estão disponíveis
        if (!this.allProducts || this.allProducts.length === 0) {
            return suggestions;
        }

        // Buscar em produtos
        this.allProducts.forEach(product => {
            const normalizedName = this.normalizeString(product.name);
            const normalizedCategory = this.normalizeString(product.category);
            const normalizedBrand = this.normalizeString(product.brand);
            const normalizedDesc = this.normalizeString(product.description || '');

            // Score de relevância
            let score = 0;

            if (normalizedName.includes(normalizedQuery)) {
                score += normalizedName.startsWith(normalizedQuery) ? 10 : 5;
            }
            if (normalizedCategory.includes(normalizedQuery)) score += 3;
            if (normalizedBrand.includes(normalizedQuery)) score += 3;
            if (normalizedDesc.includes(normalizedQuery)) score += 1;

            if (score > 0) {
                suggestions.push({
                    type: 'product',
                    product: product,
                    score: score
                });
            }
        });

        // Buscar em categorias
        const categories = [...new Set(this.allProducts.map(p => p.category))];
        categories.forEach(category => {
            if (this.normalizeString(category).includes(normalizedQuery)) {
                suggestions.push({
                    type: 'category',
                    name: category,
                    score: 4
                });
            }
        });

        // Buscar em marcas
        const brands = [...new Set(this.allProducts.map(p => p.brand))];
        brands.forEach(brand => {
            if (this.normalizeString(brand).includes(normalizedQuery)) {
                suggestions.push({
                    type: 'brand',
                    name: brand,
                    score: 4
                });
            }
        });

        // Adicionar histórico relevante
        this.searchHistory.forEach(historyItem => {
            if (this.normalizeString(historyItem).includes(normalizedQuery)) {
                suggestions.push({
                    type: 'history',
                    query: historyItem,
                    score: 2
                });
            }
        });

        // Ordenar por score (relevância)
        suggestions.sort((a, b) => b.score - a.score);

        // Limitar a 8 sugestões
        return suggestions.slice(0, 8);
    }

    renderSuggestions(suggestions) {
        this.suggestionsContainer.innerHTML = '';

        suggestions.forEach((suggestion, index) => {
            const item = document.createElement('div');
            item.className = 'suggestion-item';
            item.dataset.index = index;

            if (suggestion.type === 'product') {
                const product = suggestion.product;
                const imageUrl = product.image || '../assets/images/produto-1.jpg';

                item.innerHTML = `
                    <img src="${imageUrl}" alt="${product.name}" onerror="this.src='../assets/images/produto-1.jpg'">
                    <div class="suggestion-info">
                        <div class="suggestion-name">${this.highlightQuery(product.name)}</div>
                        <div class="suggestion-price">${product.price}</div>
                    </div>
                    <span class="suggestion-type">Produto</span>
                `;
                item.addEventListener('click', () => {
                    const targetUrl = this.getBasePath() + `produto.html?id=${product.id}`;
                    console.log('🔍 Navegando para produto:', targetUrl);
                    window.location.href = targetUrl;
                });
            } else if (suggestion.type === 'category') {
                item.innerHTML = `
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                        <path d="M4 6H20M4 12H20M4 18H20" stroke="#FF6B00" stroke-width="2" stroke-linecap="round"/>
                    </svg>
                    <div class="suggestion-info">
                        <div class="suggestion-name">${this.highlightQuery(suggestion.name)}</div>
                    </div>
                    <span class="suggestion-type">Categoria</span>
                `;
                item.addEventListener('click', () => {
                    this.searchByCategory(suggestion.name);
                });
            } else if (suggestion.type === 'brand') {
                item.innerHTML = `
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                        <rect x="3" y="3" width="18" height="18" rx="2" stroke="#FF6B00" stroke-width="2"/>
                    </svg>
                    <div class="suggestion-info">
                        <div class="suggestion-name">${this.highlightQuery(suggestion.name)}</div>
                    </div>
                    <span class="suggestion-type">Marca</span>
                `;
                item.addEventListener('click', () => {
                    this.searchByBrand(suggestion.name);
                });
            } else if (suggestion.type === 'history') {
                item.innerHTML = `
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                        <circle cx="12" cy="12" r="9" stroke="#666" stroke-width="2"/>
                        <path d="M12 7V12L15 15" stroke="#666" stroke-width="2" stroke-linecap="round"/>
                    </svg>
                    <div class="suggestion-info">
                        <div class="suggestion-name">${this.highlightQuery(suggestion.query)}</div>
                    </div>
                    <span class="suggestion-type">Histórico</span>
                `;
                item.addEventListener('click', () => {
                    this.searchInput.value = suggestion.query;
                    this.performSearch();
                });
            }

            this.suggestionsContainer.appendChild(item);
        });
    }

    showNoResults() {
        this.suggestionsContainer.innerHTML = `
            <div class="suggestion-no-results">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none">
                    <circle cx="11" cy="11" r="7" stroke="#ccc" stroke-width="2"/>
                    <path d="M16 16L21 21" stroke="#ccc" stroke-width="2" stroke-linecap="round"/>
                </svg>
                <p>Nenhum resultado encontrado</p>
            </div>
        `;
        this.showSuggestions();
    }

    highlightQuery(text) {
        const query = this.searchInput.value.trim();
        if (!query) return text;

        const regex = new RegExp(`(${query})`, 'gi');
        return text.replace(regex, '<strong>$1</strong>');
    }

    showSuggestions() {
        this.suggestionsContainer.style.display = 'block';
    }

    hideSuggestions() {
        this.suggestionsContainer.style.display = 'none';
    }

    handleKeydown(e) {
        if (e.key === 'Enter') {
            e.preventDefault();
            this.performSearch();
        } else if (e.key === 'Escape') {
            this.hideSuggestions();
        }
    }

    performSearch() {
        const query = this.searchInput.value.trim();

        if (query.length < 2) {
            // Mostrar mensagem mais amigável
            this.suggestionsContainer.innerHTML = `
                <div class="suggestion-no-results">
                    <p>🔍 Digite pelo menos 2 caracteres para buscar</p>
                </div>
            `;
            this.showSuggestions();
            return;
        }

        // Adicionar ao histórico
        this.addToHistory(query);

        // Navegar para página de produtos com busca
        const targetUrl = this.getBasePath() + `produtos.html?q=${encodeURIComponent(query)}`;
        console.log('🔍 Navegando para:', targetUrl);
        window.location.href = targetUrl;
    }

    searchByCategory(category) {
        const targetUrl = this.getBasePath() + `produtos.html?categoria=${encodeURIComponent(category)}`;
        console.log('🔍 Navegando para categoria:', targetUrl);
        window.location.href = targetUrl;
    }

    searchByBrand(brand) {
        const targetUrl = this.getBasePath() + `produtos.html?marca=${encodeURIComponent(brand)}`;
        console.log('🔍 Navegando para marca:', targetUrl);
        window.location.href = targetUrl;
    }

    getBasePath() {
        const path = window.location.pathname;
        console.log('🔍 Path atual:', path);

        // Se já estamos em /pages/, não precisa adicionar
        if (path.includes('/pages/')) {
            return '';
        }

        // Se estamos na raiz ou no index
        return 'pages/';
    }

    addToHistory(query) {
        // Remove se já existe
        this.searchHistory = this.searchHistory.filter(item => item !== query);

        // Adiciona no início
        this.searchHistory.unshift(query);

        // Limita a 10 itens
        this.searchHistory = this.searchHistory.slice(0, 10);

        // Salva no localStorage
        this.saveSearchHistory();
    }

    loadSearchHistory() {
        try {
            const history = localStorage.getItem('search_history');
            return history ? JSON.parse(history) : [];
        } catch (error) {
            console.error('Erro ao carregar histórico de busca:', error);
            return [];
        }
    }

    saveSearchHistory() {
        try {
            localStorage.setItem('search_history', JSON.stringify(this.searchHistory));
        } catch (error) {
            console.error('Erro ao salvar histórico de busca:', error);
        }
    }

    normalizeString(str) {
        return str
            .toLowerCase()
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '');
    }
}

// Inicializar sistema de busca globalmente
window.searchSystem = new SearchSystem();
