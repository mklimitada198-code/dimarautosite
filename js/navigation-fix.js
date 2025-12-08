// ==================== NAVIGATION FIX ====================
// Corrige automaticamente paths relativos do header baseado na localização da página
// Funciona tanto localmente quanto em produção (Vercel)

(function() {
    'use strict';

    /**
     * Detecta o ambiente de execução
     * @returns {object} { isProduction, basePath }
     */
    function detectEnvironment() {
        const hostname = window.location.hostname;
        const pathname = window.location.pathname;
        
        // Ambiente de produção (Vercel)
        const isProduction = hostname !== 'localhost' && hostname !== '127.0.0.1' && !hostname.includes('192.168');
        
        // Detecta se está em subpasta
        const isInSubfolder = pathname.includes('/pages/') || pathname.includes('/dimaradmin/');
        
        // Em produção, usa paths absolutos a partir da raiz
        // Localmente, usa paths relativos
        const basePath = isProduction ? '' : (isInSubfolder ? '..' : '.');
        
        return { isProduction, basePath, isInSubfolder };
    }

    /**
     * Corrige todos os links do header e footer
     */
    function fixNavigationLinks() {
        const env = detectEnvironment();
        
        // Espera o header e footer carregarem
        const checkInterval = setInterval(() => {
            const headerLoaded = document.querySelector('.nav-menu');
            const logoLoaded = document.querySelector('.logo a');
            
            if (headerLoaded && logoLoaded) {
                clearInterval(checkInterval);
                applyPathFixes(env);
            }
        }, 50);

        // Timeout de segurança (3 segundos)
        setTimeout(() => clearInterval(checkInterval), 3000);
    }

    /**
     * Normaliza o path para produção ou desenvolvimento
     * @param {string} path - Path original
     * @param {object} env - Ambiente detectado
     * @returns {string} Path corrigido
     */
    function normalizePath(path, env) {
        if (env.isProduction) {
            // Em produção, sempre usa path absoluto da raiz
            return path.startsWith('/') ? path : `/${path}`;
        } else {
            // Localmente, usa path relativo
            return `${env.basePath}/${path}`.replace(/\/+/g, '/');
        }
    }

    /**
     * Aplica as correções de path
     * @param {object} env - Ambiente detectado
     */
    function applyPathFixes(env) {
        // Corrigir menu de navegação
        const navLinks = {
            'Home': normalizePath('index.html', env),
            'Sobre Nós': normalizePath('pages/sobre-nos.html', env),
            'Produtos': normalizePath('pages/produtos.html', env),
            'Contato': normalizePath('pages/contato.html', env),
            'Nossas Lojas': normalizePath('pages/lojas.html', env)
        };

        document.querySelectorAll('.nav-menu a').forEach(link => {
            const text = link.textContent.trim();
            if (navLinks[text]) {
                link.href = navLinks[text];
            }
        });

        // Corrigir logo
        const logoLink = document.querySelector('.logo a');
        if (logoLink) {
            logoLink.href = normalizePath('index.html', env);
        }

        const logoImg = document.querySelector('.logo img');
        if (logoImg) {
            logoImg.src = normalizePath('assets/images/logo-dimar.png', env);
        }

        // Corrigir links do header (ações)
        const cartLink = document.querySelector('.header-action.cart');
        if (cartLink) {
            cartLink.href = normalizePath('pages/carrinho.html', env);
        }

        // Corrigir links das categorias
        const categoryLinks = document.querySelectorAll('.category-links a');
        categoryLinks.forEach(link => {
            const href = link.getAttribute('href');
            if (href && href.startsWith('#')) {
                // Mantém âncoras como estão
                return;
            }
            // Se for um link relativo, corrige
            if (href && !href.startsWith('http') && !href.startsWith('/')) {
                if (href.includes('pages/')) {
                    link.href = normalizePath(href, env);
                }
            }
        });

        // Corrigir links do footer
        const footerLinks = document.querySelectorAll('footer a');
        footerLinks.forEach(link => {
            const href = link.getAttribute('href');
            
            // Pula links externos e âncoras
            if (!href || href.startsWith('http') || href.startsWith('#')) {
                return;
            }
            
            // Corrige links para páginas
            if (href.startsWith('pages/') || href.includes('.html')) {
                link.href = normalizePath(href, env);
            }
        });

        // Log para debug
        const envType = env.isProduction ? 'PRODUÇÃO (Vercel)' : 'LOCAL';
        console.log(`✅ Navigation paths fixed - Ambiente: ${envType} | BasePath: ${env.basePath || '/'}`);
    }

    // Executar quando o DOM estiver pronto
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', fixNavigationLinks);
    } else {
        fixNavigationLinks();
    }
})();

