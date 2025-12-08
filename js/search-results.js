// ==================== SEARCH RESULTS PAGE ====================
// Lógica para página de resultados de busca

class SearchResultsPage {
    constructor() {
        this.allProducts = window.productsData || [];
        this.searchQuery = '';
        this.filteredProducts = [];
        this.currentPage = 1;
        this.productsPerPage = 12;
        this.activeFilters = {
            categories: [],
            brands: [],
            vehicleTypes: [],
            priceRanges: []
        };
        this.sortBy = 'relevance';
        this.searchStartTime = Date.now();
        
        this.init();
    }

    init() {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.setup());
        } else {
            this.setup();
        }
    }

    setup() {
        // Obter query da URL
        const urlParams = new URLSearchParams(window.location.search);
        this.searchQuery = urlParams.get('q') || '';

        if (!this.searchQuery) {
            window.location.href = '../index.html';
            return;
        }

        // Exibir query
        document.getElementById('search-query').textContent = `"${this.searchQuery}"`;

        // Realizar busca
        this.performSearch();

        // Setup event listeners
        this.setupEventListeners();

        // Carregar filtros laterais
        this.loadSidebarFilters();

        // Exibir buscas relacionadas
        this.loadRelatedSearches();
    }

    performSearch() {
        const normalizedQuery = this.normalizeString(this.searchQuery);
        const results = [];

        this.allProducts.forEach(product => {
            const score = this.calculateRelevanceScore(product, normalizedQuery);
            
            if (score > 0) {
                results.push({
                    ...product,
                    relevanceScore: score
                });
            }
        });

        // Ordenar por relevância inicialmente
        results.sort((a, b) => b.relevanceScore - a.relevanceScore);

        this.filteredProducts = results;
        
        // Calcular tempo de busca
        const searchTime = Date.now() - this.searchStartTime;
        document.getElementById('search-time').textContent = `(${searchTime}ms)`;

        // Atualizar contadores
        this.updateResultsCount();

        // Renderizar produtos
        this.renderProducts();
    }

    calculateRelevanceScore(product, query) {
        let score = 0;

        const normalizedName = this.normalizeString(product.name);
        const normalizedCategory = this.normalizeString(product.category);
        const normalizedBrand = this.normalizeString(product.brand);
        const normalizedDesc = this.normalizeString(product.description || '');
        const normalizedSpecs = this.normalizeString(JSON.stringify(product.specs || {}));

        // Nome do produto (maior peso)
        if (normalizedName === query) score += 50;
        else if (normalizedName.startsWith(query)) score += 30;
        else if (normalizedName.includes(query)) score += 20;

        // Palavras individuais no nome
        const queryWords = query.split(' ');
        queryWords.forEach(word => {
            if (word.length > 2 && normalizedName.includes(word)) score += 5;
        });

        // Categoria
        if (normalizedCategory.includes(query)) score += 15;

        // Marca
        if (normalizedBrand === query) score += 25;
        else if (normalizedBrand.includes(query)) score += 15;

        // Descrição
        if (normalizedDesc.includes(query)) score += 10;

        // Especificações
        if (normalizedSpecs.includes(query)) score += 5;

        // Boost para produtos em promoção
        if (product.oldPrice) score += 3;

        // Boost para produtos em estoque
        if (product.inStock) score += 2;

        return score;
    }

    setupEventListeners() {
        // Sort
        document.getElementById('sort-by').addEventListener('change', (e) => {
            this.sortBy = e.target.value;
            this.applySort();
        });

        // Filter buttons (all, products, categories, brands)
        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
                e.target.classList.add('active');
                
                const filter = e.target.dataset.filter;
                this.filterByType(filter);
            });
        });

        // Category filters
        document.getElementById('category-filters').addEventListener('change', () => {
            this.updateActiveFilters();
        });

        // Vehicle type filters
        document.getElementById('vehicle-type-filters').addEventListener('change', () => {
            this.updateActiveFilters();
        });

        // Brand filters
        document.getElementById('brand-filters').addEventListener('change', () => {
            this.updateActiveFilters();
        });

        // Brand search
        document.getElementById('brand-search').addEventListener('input', (e) => {
            this.filterBrandList(e.target.value);
        });

        // Price range filters (se existir)
        const priceFilters = document.querySelectorAll('input[value^="0-"], input[value^="100-"], input[value^="300-"], input[value^="500-"], input[value^="1000"]');
        priceFilters.forEach(filter => {
            filter.addEventListener('change', () => {
                this.updateActiveFilters();
            });
        });

        // Clear filters
        document.getElementById('clear-filters-btn').addEventListener('click', () => {
            this.clearAllFilters();
        });
    }

    loadSidebarFilters() {
        // Carregar categorias
        const categories = [...new Set(this.filteredProducts.map(p => p.category))];
        const categoryFiltersEl = document.getElementById('category-filters');
        categoryFiltersEl.innerHTML = categories.map(cat => `
            <label><input type="checkbox" value="${cat}"> ${cat}</label>
        `).join('');

        // Carregar marcas
        const brands = [...new Set(this.filteredProducts.map(p => p.brand))].sort();
        const brandFiltersEl = document.getElementById('brand-filters');
        brandFiltersEl.innerHTML = brands.map(brand => `
            <label><input type="checkbox" value="${brand}"> ${brand}</label>
        `).join('');
    }

    filterByType(type) {
        // Esta função pode ser expandida para filtrar por tipo específico
        // Por enquanto, apenas renderiza todos
        this.renderProducts();
    }

    updateActiveFilters() {
        // Categorias
        this.activeFilters.categories = Array.from(
            document.querySelectorAll('#category-filters input:checked')
        ).map(input => input.value);

        // Tipos de veículo
        this.activeFilters.vehicleTypes = Array.from(
            document.querySelectorAll('#vehicle-type-filters input:checked')
        ).map(input => input.value);

        // Marcas
        this.activeFilters.brands = Array.from(
            document.querySelectorAll('#brand-filters input:checked')
        ).map(input => input.value);

        // Faixa de preço
        this.activeFilters.priceRanges = Array.from(
            document.querySelectorAll('input[type="checkbox"]:checked')
        ).filter(input => {
            const value = input.value;
            return value.includes('-') || value.includes('+');
        }).map(input => input.value);

        // Aplicar filtros
        this.applyFilters();
    }

    applyFilters() {
        const normalizedQuery = this.normalizeString(this.searchQuery);
        let filtered = this.allProducts.filter(product => {
            // Primeiro, verificar se corresponde à busca
            const score = this.calculateRelevanceScore(product, normalizedQuery);
            if (score === 0) return false;

            // Aplicar filtros adicionais
            if (this.activeFilters.categories.length > 0) {
                if (!this.activeFilters.categories.includes(product.category)) return false;
            }

            if (this.activeFilters.vehicleTypes.length > 0) {
                if (!this.activeFilters.vehicleTypes.includes(product.vehicleType)) return false;
            }

            if (this.activeFilters.brands.length > 0) {
                if (!this.activeFilters.brands.includes(product.brand)) return false;
            }

            // Filtro de faixa de preço
            if (this.activeFilters.priceRanges.length > 0) {
                const price = product.salePrice || product.price;
                let matchesPrice = false;

                for (const range of this.activeFilters.priceRanges) {
                    if (range === '0-100' && price <= 100) matchesPrice = true;
                    else if (range === '100-300' && price > 100 && price <= 300) matchesPrice = true;
                    else if (range === '300-500' && price > 300 && price <= 500) matchesPrice = true;
                    else if (range === '500-1000' && price > 500 && price <= 1000) matchesPrice = true;
                    else if (range === '1000+' && price > 1000) matchesPrice = true;
                }

                if (!matchesPrice) return false;
            }

            return true;
        });

        // Adicionar relevance score
        filtered = filtered.map(product => ({
            ...product,
            relevanceScore: this.calculateRelevanceScore(product, normalizedQuery)
        }));

        this.filteredProducts = filtered;
        this.currentPage = 1;
        this.applySort();
    }

    applySort() {
        let sorted = [...this.filteredProducts];

        switch (this.sortBy) {
            case 'price-asc':
                sorted.sort((a, b) => this.getNumericPrice(a.price) - this.getNumericPrice(b.price));
                break;
            case 'price-desc':
                sorted.sort((a, b) => this.getNumericPrice(b.price) - this.getNumericPrice(a.price));
                break;
            case 'name-asc':
                sorted.sort((a, b) => a.name.localeCompare(b.name));
                break;
            case 'name-desc':
                sorted.sort((a, b) => b.name.localeCompare(a.name));
                break;
            case 'relevance':
            default:
                sorted.sort((a, b) => b.relevanceScore - a.relevanceScore);
                break;
        }

        this.filteredProducts = sorted;
        this.renderProducts();
    }

    clearAllFilters() {
        document.querySelectorAll('.sidebar-filters input[type="checkbox"]').forEach(input => {
            input.checked = false;
        });
        document.getElementById('brand-search').value = '';
        this.activeFilters = {
            categories: [],
            brands: [],
            vehicleTypes: [],
            priceRanges: []
        };
        this.applyFilters();
    }

    filterBrandList(query) {
        const normalizedQuery = this.normalizeString(query);
        const brandLabels = document.querySelectorAll('#brand-filters label');

        brandLabels.forEach(label => {
            const brandName = label.textContent.trim();
            const normalizedBrand = this.normalizeString(brandName);

            if (normalizedBrand.includes(normalizedQuery)) {
                label.style.display = 'flex';
            } else {
                label.style.display = 'none';
            }
        });
    }

    updateResultsCount() {
        const count = this.filteredProducts.length;
        document.getElementById('results-count').textContent = `${count} produto${count !== 1 ? 's' : ''} encontrado${count !== 1 ? 's' : ''}`;
        document.getElementById('product-count').textContent = `${count} produto${count !== 1 ? 's' : ''}`;
    }

    renderProducts() {
        const productGrid = document.getElementById('product-grid');
        const noResults = document.getElementById('no-results');

        if (this.filteredProducts.length === 0) {
            productGrid.style.display = 'none';
            noResults.style.display = 'flex';
            document.getElementById('pagination').innerHTML = '';
            return;
        }

        productGrid.style.display = 'grid';
        noResults.style.display = 'none';

        // Calcular produtos da página atual
        const startIndex = (this.currentPage - 1) * this.productsPerPage;
        const endIndex = startIndex + this.productsPerPage;
        const productsToShow = this.filteredProducts.slice(startIndex, endIndex);

        // Renderizar produtos
        productGrid.innerHTML = productsToShow.map(product => `
            <div class="product-card">
                ${product.badge ? `<span class="product-badge">${product.badge}</span>` : ''}
                ${product.fastShipping ? '<div class="product-shipping-top">Produto com entrega RÁPIDA</div>' : ''}
                
                <div class="product-image">
                    <img src="${product.image}" alt="${product.name}">
                </div>

                <div class="product-info">
                    <h3 class="product-title">${product.name}</h3>
                    
                    ${product.oldPrice ? `<span class="product-price-old">${product.oldPrice}</span>` : ''}
                    <div class="product-price">${product.price}</div>
                    
                    ${product.installments ? `<div class="product-installments">${product.installments}</div>` : ''}

                    <div class="product-actions">
                        <a href="produto.html?id=${product.id}" class="product-details-btn">Ver detalhes</a>
                        <button class="product-buy-btn" data-product-id="${product.id}">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                                <path d="M3 3H5L5.4 5M7 13H17L21 5H5.4M7 13L5.4 5M7 13L4.70711 15.2929C4.07714 15.9229 4.52331 17 5.41421 17H17M17 17C15.8954 17 15 17.8954 15 19C15 20.1046 15.8954 21 17 21C18.1046 21 19 20.1046 19 19C19 17.8954 18.1046 17 17 17ZM9 19C9 20.1046 8.10457 21 7 21C5.89543 21 5 20.1046 5 19C5 17.8954 5.89543 17 7 17C8.10457 17 9 17.8954 9 19Z" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                            </svg>
                            Adicionar
                        </button>
                    </div>
                </div>
            </div>
        `).join('');

        // Adicionar funcionalidade aos botões de compra
        this.attachBuyButtons();

        // Renderizar paginação
        this.renderPagination();
    }

    attachBuyButtons() {
        document.querySelectorAll('.product-buy-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const productId = e.currentTarget.dataset.productId;
                const product = this.filteredProducts.find(p => p.id === productId);
                
                if (product && window.cart) {
                    window.cart.addItem(product);
                }
            });
        });
    }

    renderPagination() {
        const totalPages = Math.ceil(this.filteredProducts.length / this.productsPerPage);
        const paginationEl = document.getElementById('pagination');

        if (totalPages <= 1) {
            paginationEl.innerHTML = '';
            return;
        }

        let paginationHTML = '<button class="pagination-btn" id="prev-page" ' + (this.currentPage === 1 ? 'disabled' : '') + '>Anterior</button>';

        for (let i = 1; i <= totalPages; i++) {
            if (i === 1 || i === totalPages || (i >= this.currentPage - 2 && i <= this.currentPage + 2)) {
                paginationHTML += `<button class="pagination-btn ${i === this.currentPage ? 'active' : ''}" data-page="${i}">${i}</button>`;
            } else if (i === this.currentPage - 3 || i === this.currentPage + 3) {
                paginationHTML += '<span class="pagination-ellipsis">...</span>';
            }
        }

        paginationHTML += '<button class="pagination-btn" id="next-page" ' + (this.currentPage === totalPages ? 'disabled' : '') + '>Próxima</button>';

        paginationEl.innerHTML = paginationHTML;

        // Event listeners
        document.getElementById('prev-page')?.addEventListener('click', () => {
            if (this.currentPage > 1) {
                this.currentPage--;
                this.renderProducts();
                window.scrollTo({ top: 0, behavior: 'smooth' });
            }
        });

        document.getElementById('next-page')?.addEventListener('click', () => {
            if (this.currentPage < totalPages) {
                this.currentPage++;
                this.renderProducts();
                window.scrollTo({ top: 0, behavior: 'smooth' });
            }
        });

        document.querySelectorAll('.pagination-btn[data-page]').forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.currentPage = parseInt(e.target.dataset.page);
                this.renderProducts();
                window.scrollTo({ top: 0, behavior: 'smooth' });
            });
        });
    }

    loadRelatedSearches() {
        const relatedSearchesEl = document.getElementById('related-searches');
        const relatedTags = relatedSearchesEl.querySelector('.related-tags');

        // Gerar buscas relacionadas baseadas nos produtos encontrados
        const categories = [...new Set(this.filteredProducts.map(p => p.category))].slice(0, 4);
        const brands = [...new Set(this.filteredProducts.map(p => p.brand))].slice(0, 4);

        const related = [...categories, ...brands];

        if (related.length === 0) {
            relatedSearchesEl.style.display = 'none';
            return;
        }

        relatedTags.innerHTML = related.map(term => `
            <a href="busca.html?q=${encodeURIComponent(term)}" class="related-tag">${term}</a>
        `).join('');
    }

    getNumericPrice(priceString) {
        return parseFloat(priceString.replace(/[^\d,]/g, '').replace(',', '.'));
    }

    normalizeString(str) {
        return str
            .toLowerCase()
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '');
    }
}

// Inicializar página de resultados
window.addEventListener('DOMContentLoaded', () => {
    new SearchResultsPage();
});

