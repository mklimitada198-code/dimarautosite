/**
 * Image Fallback System - Dimar Auto Peças
 * Sistema global de fallback para imagens ausentes ou quebradas
 * 
 * @version 1.0.0
 * @date 2024-12-10
 */

(function () {
    'use strict';

    // ==================== PLACEHOLDERS SVG ====================
    // SVGs inline para não depender de arquivos externos

    const PLACEHOLDERS = {
        // Produto genérico
        product: `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='300' viewBox='0 0 300 300'%3E%3Crect fill='%23f5f5f5' width='300' height='300'/%3E%3Crect fill='%23e0e0e0' x='75' y='75' width='150' height='150' rx='8'/%3E%3Cpath fill='%23bdbdbd' d='M150 100 L200 175 L100 175 Z'/%3E%3Ccircle fill='%23bdbdbd' cx='175' cy='125' r='15'/%3E%3Ctext fill='%23999' font-family='Arial,sans-serif' font-size='12' x='150' y='250' text-anchor='middle'%3ESem imagem%3C/text%3E%3C/svg%3E`,

        // Categoria
        category: `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200' viewBox='0 0 200 200'%3E%3Crect fill='%23fff3e0' width='200' height='200'/%3E%3Crect fill='%23ffcc80' x='50' y='50' width='100' height='100' rx='8'/%3E%3Cpath fill='%23ff9800' d='M75 90 L125 90 L125 110 L100 130 L75 110 Z'/%3E%3Ctext fill='%23e65100' font-family='Arial,sans-serif' font-size='11' x='100' y='170' text-anchor='middle'%3ECategoria%3C/text%3E%3C/svg%3E`,

        // Marca/Logo
        brand: `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='150' height='80' viewBox='0 0 150 80'%3E%3Crect fill='%23fafafa' width='150' height='80' rx='4'/%3E%3Crect fill='%23e0e0e0' x='25' y='20' width='100' height='40' rx='4'/%3E%3Ctext fill='%23999' font-family='Arial,sans-serif' font-size='10' x='75' y='45' text-anchor='middle'%3ELOGO%3C/text%3E%3C/svg%3E`,

        // Banner
        banner: `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='1920' height='600' viewBox='0 0 1920 600'%3E%3Crect fill='%231a1a1a' width='1920' height='600'/%3E%3Crect fill='%232d2d2d' x='100' y='100' width='1720' height='400' rx='16'/%3E%3Ctext fill='%23666' font-family='Arial,sans-serif' font-size='48' x='960' y='320' text-anchor='middle'%3EBanner%3C/text%3E%3C/svg%3E`,

        // Avatar/Usuário
        avatar: `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 100 100'%3E%3Ccircle fill='%23e0e0e0' cx='50' cy='50' r='50'/%3E%3Ccircle fill='%23bdbdbd' cx='50' cy='40' r='20'/%3E%3Cellipse fill='%23bdbdbd' cx='50' cy='85' rx='30' ry='20'/%3E%3C/svg%3E`
    };

    // ==================== FUNÇÕES PRINCIPAIS ====================

    /**
     * Handler global para erros de imagem
     * @param {HTMLImageElement} img - Elemento de imagem
     * @param {string} type - Tipo de placeholder (product, category, brand, banner)
     */
    function handleImageError(img, type = 'product') {
        // Evitar loop infinito
        img.onerror = null;

        // Aplicar placeholder
        const placeholder = PLACEHOLDERS[type] || PLACEHOLDERS.product;
        img.src = placeholder;

        // Marcar como fallback para debug
        img.dataset.fallback = 'true';
        img.alt = img.alt || 'Imagem não disponível';

        // Log para debug (apenas em desenvolvimento)
        if (window.location.hostname === 'localhost') {
            console.warn(`[ImageFallback] Imagem falhou, usando placeholder: ${type}`);
        }
    }

    /**
     * Valida se uma URL de imagem é válida
     * @param {string} url - URL da imagem
     * @returns {boolean}
     */
    function isValidImageUrl(url) {
        if (!url) return false;
        if (url === 'null' || url === 'undefined') return false;
        if (url.startsWith('/null')) return false;
        if (url.trim() === '') return false;

        // Verificar URLs de placeholder que podem falhar
        const unreliableHosts = ['via.placeholder.com', 'placeholder.com'];
        try {
            const urlObj = new URL(url, window.location.origin);
            if (unreliableHosts.some(host => urlObj.hostname.includes(host))) {
                return false;
            }
        } catch (e) {
            // URL inválida
            return false;
        }

        return true;
    }

    /**
     * Obtém URL de imagem com fallback
     * @param {string} url - URL original
     * @param {string} type - Tipo de placeholder
     * @returns {string}
     */
    function getImageUrl(url, type = 'product') {
        if (isValidImageUrl(url)) {
            return url;
        }
        return PLACEHOLDERS[type] || PLACEHOLDERS.product;
    }

    /**
     * Aplica handlers de fallback em todas as imagens do documento
     */
    function applyGlobalFallback() {
        document.querySelectorAll('img').forEach(img => {
            // Pular imagens que já têm handler
            if (img.dataset.fallbackApplied) return;

            // Determinar tipo baseado em classes/contexto
            let type = 'product';
            if (img.closest('.brand-item')) type = 'brand';
            else if (img.closest('.category-item')) type = 'category';
            else if (img.closest('.carousel-slide')) type = 'banner';

            // Aplicar handler
            img.onerror = function () { handleImageError(this, type); };
            img.dataset.fallbackApplied = 'true';

            // Verificar URL atual
            if (!isValidImageUrl(img.src)) {
                handleImageError(img, type);
            }
        });
    }

    // ==================== OBSERVER PARA NOVAS IMAGENS ====================

    // Observar DOM para imagens adicionadas dinamicamente
    const observer = new MutationObserver((mutations) => {
        let hasNewImages = false;

        mutations.forEach(mutation => {
            mutation.addedNodes.forEach(node => {
                if (node.nodeName === 'IMG') {
                    hasNewImages = true;
                } else if (node.querySelectorAll) {
                    if (node.querySelectorAll('img').length > 0) {
                        hasNewImages = true;
                    }
                }
            });
        });

        if (hasNewImages) {
            // Debounce para evitar múltiplas chamadas
            clearTimeout(window._imageFallbackTimeout);
            window._imageFallbackTimeout = setTimeout(applyGlobalFallback, 100);
        }
    });

    // ==================== INICIALIZAÇÃO ====================

    function initialize() {
        // Aplicar em imagens existentes
        applyGlobalFallback();

        // Observar novas imagens
        observer.observe(document.body, {
            childList: true,
            subtree: true
        });

        console.log('✅ Image Fallback System initialized');
    }

    // Inicializar quando DOM estiver pronto
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initialize);
    } else {
        initialize();
    }

    // ==================== EXPORTS ====================

    window.imageFallback = {
        handleError: handleImageError,
        isValidUrl: isValidImageUrl,
        getUrl: getImageUrl,
        placeholders: PLACEHOLDERS,
        refresh: applyGlobalFallback
    };

})();
