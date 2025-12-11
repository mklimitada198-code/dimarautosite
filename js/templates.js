/**
 * ==================== TEMPLATE LOADER ====================
 * Sistema para carregar templates reutilizáveis (header, footer)
 * 
 * Uso:
 * 1. Adicione <div id="header-placeholder"></div> onde quer o header
 * 2. Adicione <div id="footer-placeholder"></div> onde quer o footer
 * 3. Inclua este script: <script src="js/templates.js"></script>
 */

(function () {
    'use strict';

    /**
     * Carrega um template HTML
     * @param {string} templatePath - Caminho do arquivo de template
     * @param {string} targetId - ID do elemento onde inserir o template
     */
    async function loadTemplate(templatePath, targetId) {
        try {
            const response = await fetch(templatePath);

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const html = await response.text();
            const targetElement = document.getElementById(targetId);

            if (targetElement) {
                targetElement.innerHTML = html;
                console.log(`✅ Template carregado: ${templatePath}`);
            } else {
                console.warn(`⚠️  Elemento não encontrado: #${targetId}`);
            }
        } catch (error) {
            console.error(`❌ Erro ao carregar template ${templatePath}:`, error);
        }
    }

    /**
     * Detecta a profundidade da página atual para ajustar caminhos
     * @returns {string} - Prefixo do caminho (ex: '../' ou '../../')
     */
    function getPathPrefix() {
        const path = window.location.pathname;
        const depth = (path.match(/\//g) || []).length - 1;

        // Se está em pages/ ou subpasta, volta um nível
        if (path.includes('/pages/')) {
            return '../';
        }

        // Se está na raiz
        return '';
    }

    /**
     * Ajusta links e caminhos de assets após carregar templates
     */
    function adjustPaths() {
        const prefix = getPathPrefix();

        if (prefix) {
            // Ajusta links de assets (imagens, CSS, JS)
            document.querySelectorAll('img[src^="assets/"]').forEach(img => {
                img.src = prefix + img.src.split('assets/')[1].replace(/^\//, 'assets/');
            });

            // Ajusta links internos que começam com 'pages/'
            document.querySelectorAll('a[href^="pages/"]').forEach(link => {
                if (!link.href.includes('://')) {
                    link.href = prefix + link.href.split('pages/')[1].replace(/^\//, 'pages/');
                }
            });

            // Ajusta link do logo para voltar à home
            const logoLinks = document.querySelectorAll('.logo a');
            logoLinks.forEach(link => {
                link.href = prefix + 'index.html';
            });
        }
    }

    /**
     * Inicializa os event listeners após carregar templates
     */
    function initializeEventListeners() {
        // Dropdown de categorias
        const categoriesBtn = document.getElementById('categoriesBtn');
        const categoriesMenu = document.getElementById('categoriesMenu');

        if (categoriesBtn && categoriesMenu) {
            categoriesBtn.addEventListener('click', function (e) {
                e.stopPropagation();
                categoriesMenu.classList.toggle('show');
            });

            // Fecha ao clicar fora
            document.addEventListener('click', function (e) {
                if (!categoriesBtn.contains(e.target) && !categoriesMenu.contains(e.target)) {
                    categoriesMenu.classList.remove('show');
                }
            });
        }

        // Newsletter form
        const newsletterForm = document.getElementById('newsletterForm');
        if (newsletterForm) {
            newsletterForm.addEventListener('submit', function (e) {
                e.preventDefault();
                const email = this.querySelector('input[type="email"]').value;
                alert(`✅ E-mail cadastrado com sucesso: ${email}\n\nVocê receberá nossas ofertas exclusivas!`);
                this.reset();
            });
        }

        console.log('✅ Event listeners inicializados');
    }

    /**
     * Inicializa o header sticky (fixo ao rolar)
     */
    function initStickyHeader() {
        const stickyWrapper = document.querySelector('.sticky-header-wrapper');

        if (!stickyWrapper) {
            console.warn('⚠️ .sticky-header-wrapper não encontrado');
            return;
        }

        // Criar espaçador dinâmico
        const spacer = document.createElement('div');
        spacer.className = 'header-spacer';
        spacer.setAttribute('aria-hidden', 'true');

        // Inserir após o wrapper
        if (stickyWrapper.parentNode) {
            stickyWrapper.parentNode.insertBefore(spacer, stickyWrapper.nextSibling);
        }

        // Calcular altura do header
        const headerHeight = stickyWrapper.offsetHeight;
        spacer.style.height = headerHeight + 'px';

        // Variáveis de controle
        let isScrolled = false;
        const scrollThreshold = 100;

        // Função de scroll
        function handleScroll() {
            const scrollY = window.scrollY || window.pageYOffset;

            if (scrollY > scrollThreshold && !isScrolled) {
                stickyWrapper.classList.add('is-scrolled');
                spacer.classList.add('active');
                isScrolled = true;
            } else if (scrollY <= scrollThreshold && isScrolled) {
                stickyWrapper.classList.remove('is-scrolled');
                spacer.classList.remove('active');
                isScrolled = false;
            }
        }

        // Listener com throttle
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

        // Recalcular ao redimensionar
        window.addEventListener('resize', function () {
            spacer.style.height = stickyWrapper.offsetHeight + 'px';
        });

        console.log('✅ Sticky header inicializado');
    }

    /**
     * Carrega todos os templates e inicializa a página
     */
    async function init() {
        const prefix = getPathPrefix();

        // Carrega header e footer
        await Promise.all([
            loadTemplate(prefix + 'templates/header.html', 'header-placeholder'),
            loadTemplate(prefix + 'templates/footer.html', 'footer-placeholder')
        ]);

        // Ajusta caminhos após carregar
        adjustPaths();

        // Inicializa event listeners
        initializeEventListeners();

        // Inicializa sticky header
        initStickyHeader();

        // Atualiza badge do carrinho se o sistema estiver carregado
        if (window.cart) {
            window.cart.updateCartBadge();
        }

        // Dispara evento para scripts externos saberem que o header foi carregado
        document.dispatchEvent(new CustomEvent('headerLoaded'));

        console.log('✅ Sistema de templates inicializado');
    }

    // Executa quando o DOM estiver pronto
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();

