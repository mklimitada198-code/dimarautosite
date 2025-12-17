/**
 * Global Initialization
 * Garante que todos os sistemas estejam integrados corretamente
 */

(function () {
    'use strict';

    // Aguarda tudo carregar
    window.addEventListener('load', function () {
        // Pequeno delay para garantir que templates carregaram
        setTimeout(initializeGlobalSystems, 200);
    });

    function initializeGlobalSystems() {
        try {
            // 1. Atualizar badge do carrinho
            if (typeof window.cart !== 'undefined' && window.cart) {
                window.cart.updateCartBadge();
                console.log('✅ Carrinho sincronizado');
            } else {
                console.warn('⚠️ Sistema de carrinho não disponível');
            }

            // 2. Configurar link do carrinho no header
            setupCartLinks();

            // 3. Configurar busca
            setupSearch();

            // 4. Ajustar links para paths corretos
            adjustHeaderLinks();

            console.log('✅ Sistemas globais inicializados');
        } catch (error) {
            console.error('❌ Erro ao inicializar sistemas globais:', error);
        }
    }

    /**
     * Configurar links do carrinho
     */
    function setupCartLinks() {
        const cartLinks = document.querySelectorAll('.cart-action, a[href*="carrinho"]');
        const prefix = getPathPrefix();

        // Em produção, não modificar URLs absolutas
        const isProduction = window.location.hostname !== 'localhost' &&
            window.location.hostname !== '127.0.0.1';

        cartLinks.forEach(link => {
            if (!link.dataset.configured) {
                const currentHref = link.getAttribute('href');

                if (currentHref && !currentHref.startsWith('http')) {
                    // Em produção, manter URLs absolutas que começam com /
                    if (isProduction && currentHref.startsWith('/')) {
                        // Não modificar - URL absoluta já está correta
                        link.dataset.configured = 'true';
                        return;
                    }

                    // Se está em uma subpágina (ambiente local), ajusta o caminho
                    if (prefix && !currentHref.startsWith('../')) {
                        if (currentHref.startsWith('pages/')) {
                            link.setAttribute('href', currentHref);
                        } else if (currentHref.startsWith('/pages/')) {
                            // Apenas em ambiente LOCAL, converter para relativo
                            link.setAttribute('href', '.' + currentHref);
                        } else {
                            link.setAttribute('href', prefix + 'pages/carrinho.html');
                        }
                    }
                }

                link.dataset.configured = 'true';
            }
        });
    }

    /**
     * Configurar busca
     */
    function setupSearch() {
        const searchButton = document.querySelector('.search-button');
        const searchInput = document.querySelector('.search-input');

        if (searchButton && searchInput) {
            searchButton.addEventListener('click', performSearch);

            searchInput.addEventListener('keypress', function (e) {
                if (e.key === 'Enter') {
                    performSearch();
                }
            });
        }
    }

    /**
     * Executar busca
     */
    function performSearch() {
        const searchInput = document.querySelector('.search-input');
        const query = searchInput.value.trim();

        if (query) {
            const prefix = getPathPrefix();
            window.location.href = prefix + 'pages/produtos.html?search=' + encodeURIComponent(query);
        }
    }

    /**
     * Ajustar links do header
     */
    function adjustHeaderLinks() {
        const prefix = getPathPrefix();

        if (!prefix) return; // Está na raiz, não precisa ajustar

        // Links do menu principal
        const menuLinks = document.querySelectorAll('.nav-menu a');
        menuLinks.forEach(link => {
            const href = link.getAttribute('href');
            if (href && !href.startsWith('http') && !href.startsWith('#')) {
                // Se começa com pages/, remove o prefixo
                if (href.startsWith('pages/')) {
                    link.setAttribute('href', href.replace('pages/', ''));
                }
            }
        });

        // Link do logo
        const logoLink = document.querySelector('.logo a');
        if (logoLink) {
            logoLink.setAttribute('href', prefix + 'index.html');
        }
    }

    /**
     * Detecta profundidade da página
     */
    function getPathPrefix() {
        const path = window.location.pathname;

        if (path.includes('/pages/')) {
            return '../';
        }

        return '';
    }
})();

