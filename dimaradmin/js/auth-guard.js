/**
 * AUTH GUARD - Sistema de proteção de páginas admin
 * Garante que apenas usuários autenticados acessem o painel
 */

(function() {
    'use strict';

    /**
     * Verifica se o usuário está autenticado
     * @returns {boolean}
     */
    function isAuthenticated() {
        const isLoggedIn = localStorage.getItem('admin_logged_in') === 'true';
        const hasEmail = !!localStorage.getItem('admin_email');
        const loginTime = localStorage.getItem('admin_login_time');
        
        // Verificar se o login não expirou (24h)
        if (loginTime) {
            const hoursSinceLogin = (new Date() - new Date(loginTime)) / (1000 * 60 * 60);
            if (hoursSinceLogin > 24) {
                console.warn('⚠️ Sessão expirada após 24h');
                return false;
            }
        }
        
        return isLoggedIn && hasEmail;
    }

    /**
     * Protege páginas admin
     */
    function protectAdminPage() {
        const currentPage = window.location.pathname;
        const isLoginPage = currentPage.includes('login.html');
        
        console.log('🔒 Auth Guard - Verificando página:', currentPage);
        console.log('📍 É página de login?', isLoginPage);
        
        if (isLoginPage) {
            console.log('ℹ️ Página de login detectada - auth-guard não deve rodar aqui');
            return; // Auth guard NÃO deve rodar na página de login
        }
        
        // Páginas protegidas - redirecionar se NÃO estiver logado
        const authenticated = isAuthenticated();
        console.log('🔐 Status de autenticação:', authenticated);
        
        if (!authenticated) {
            console.warn('⚠️ Usuário não autenticado, redirecionando para login...');
            console.log('📊 LocalStorage atual:', {
                admin_logged_in: localStorage.getItem('admin_logged_in'),
                admin_email: localStorage.getItem('admin_email'),
                admin_login_time: localStorage.getItem('admin_login_time')
            });
            sessionStorage.clear();
            window.location.replace('login.html');
        } else {
            console.log('✅ Usuário autenticado - acesso permitido');
        }
    }

    /**
     * Função de logout
     */
    window.adminLogout = function() {
        if (confirm('Deseja realmente sair?')) {
            console.log('🚪 Fazendo logout...');
            localStorage.removeItem('admin_logged_in');
            localStorage.removeItem('admin_email');
            localStorage.removeItem('admin_login_time');
            sessionStorage.clear();
            window.location.replace('login.html');
        }
    };

    /**
     * Mostrar informações do usuário
     */
    function displayUserInfo() {
        const userEmail = localStorage.getItem('admin_email');
        if (!userEmail) return;

        // Atualizar nome do usuário
        const userNameEl = document.getElementById('userName');
        if (userNameEl) {
            userNameEl.textContent = userEmail.split('@')[0];
        }

        // Atualizar avatar
        const userAvatarEl = document.querySelector('.user-avatar');
        if (userAvatarEl) {
            userAvatarEl.textContent = userEmail[0].toUpperCase();
        }
    }

    // Executar proteção ao carregar
    window.addEventListener('DOMContentLoaded', () => {
        console.log('🚀 Auth Guard initialized');
        protectAdminPage();
        displayUserInfo();
    });
    
    // Também executar imediatamente se DOM já estiver pronto
    if (document.readyState === 'interactive' || document.readyState === 'complete') {
        console.log('🚀 Auth Guard initialized (DOM já pronto)');
        protectAdminPage();
        displayUserInfo();
    }

    // Exportar funções úteis
    window.authGuard = {
        isAuthenticated,
        protectAdminPage,
        displayUserInfo
    };
})();

