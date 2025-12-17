// ==================== NAVIGATION FIX ====================
// Corrige automaticamente paths relativos do header baseado na localização da página
// Funciona tanto localmente quanto em produção (Vercel)

(function () {
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
            // Em produção, mantém paths completos com /pages/ e .html
            // O Vercel precisa desses paths para encontrar os arquivos
            let cleanPath = path;

            // Garante que tenha /pages/ se for uma página
            if (!cleanPath.startsWith('pages/') && !cleanPath.startsWith('/pages/') &&
                !cleanPath.startsWith('assets/') && !cleanPath.startsWith('/assets/') &&
                !cleanPath.startsWith('index') && cleanPath !== '/') {
                // Se não tem pages/ e não é asset nem index, adiciona pages/
                if (!cleanPath.includes('/')) {
                    cleanPath = 'pages/' + cleanPath;
                }
            }

            // Garante extensão .html se for uma página (não asset)
            if (!cleanPath.includes('assets/') && !cleanPath.endsWith('.html') && !cleanPath.includes('?')) {
                cleanPath = cleanPath + '.html';
            }

            // Garante barra inicial
            return cleanPath.startsWith('/') ? cleanPath : `/${cleanPath}`;
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
        const headerActions = document.querySelectorAll('.header-action');
        headerActions.forEach(link => {
            const href = link.getAttribute('href');
            if (!href || href.startsWith('http') || href.startsWith('#') || href.startsWith('tel:')) {
                return;
            }
            if (href.includes('pages/') || href.includes('.html')) {
                link.href = normalizePath(href.replace(/^\//, ''), env);
            }
        });

        // Corrigir links das categorias
        const categoryLinks = document.querySelectorAll('.category-links a, .categories-menu a');
        categoryLinks.forEach(link => {
            const href = link.getAttribute('href');
            if (!href || href.startsWith('http') || href.startsWith('#') || href.startsWith('tel:') || href.startsWith('mailto:')) {
                return;
            }
            // Corrige links que contenham pages/ ou .html
            if (href.includes('pages/') || href.includes('.html')) {
                link.href = normalizePath(href.replace(/^\//, ''), env);
            }
        });

        // Corrigir links do footer
        const footerLinks = document.querySelectorAll('footer a');
        footerLinks.forEach(link => {
            const href = link.getAttribute('href');

            // Pula links externos, âncoras e especiais
            if (!href || href.startsWith('http') || href.startsWith('#') || href.startsWith('tel:') || href.startsWith('mailto:') || href.startsWith('wa.me')) {
                return;
            }

            // Corrige links que contenham pages/ ou .html
            if (href.includes('pages/') || href.includes('.html')) {
                link.href = normalizePath(href.replace(/^\//, ''), env);
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

