/**
 * STICKY HEADER - Header fixo ao fazer scroll
 * O header fica normal no topo, mas ao rolar a página, fica fixo no topo
 */

(function () {
    'use strict';

    let stickyWrapper, spacer;
    let headerHeight = 0;
    let isScrolled = false;
    let scrollThreshold = 100; // Pixels de scroll antes de fixar o header

    function init() {
        stickyWrapper = document.querySelector('.sticky-header-wrapper');

        if (!stickyWrapper) {
            console.warn('⚠️ .sticky-header-wrapper não encontrado');
            return;
        }

        // Criar espaçador dinâmico
        createSpacer();

        // Calcular altura do header
        updateHeaderHeight();

        // Listener de scroll com throttle para performance
        let ticking = false;
        window.addEventListener('scroll', function () {
            if (!ticking) {
                window.requestAnimationFrame(function () {
                    handleScroll();
                    ticking = false;
                });
                ticking = true;
            }
        }, { passive: true });

        // Recalcular altura ao redimensionar
        window.addEventListener('resize', debounce(updateHeaderHeight, 150));

        console.log('✅ Sticky header inicializado');
    }

    function createSpacer() {
        spacer = document.createElement('div');
        spacer.className = 'header-spacer';
        spacer.setAttribute('aria-hidden', 'true');

        // Inserir logo após o wrapper do header
        if (stickyWrapper.parentNode) {
            stickyWrapper.parentNode.insertBefore(spacer, stickyWrapper.nextSibling);
        }
    }

    function updateHeaderHeight() {
        if (stickyWrapper) {
            headerHeight = stickyWrapper.offsetHeight;
            if (spacer) {
                spacer.style.height = headerHeight + 'px';
            }
        }
    }

    function handleScroll() {
        const scrollY = window.scrollY || window.pageYOffset;

        if (scrollY > scrollThreshold && !isScrolled) {
            // Ativar modo fixo
            stickyWrapper.classList.add('is-scrolled');
            spacer.classList.add('active');
            isScrolled = true;
        } else if (scrollY <= scrollThreshold && isScrolled) {
            // Desativar modo fixo
            stickyWrapper.classList.remove('is-scrolled');
            spacer.classList.remove('active');
            isScrolled = false;
        }
    }

    // Utility: debounce
    function debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    // Inicializar quando DOM estiver pronto
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();
