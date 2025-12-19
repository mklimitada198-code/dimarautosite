/**
 * AUTH GUARD v4.0 - Sistema de proteção SIMPLIFICADO
 * Usa apenas localStorage - sem dependência do Supabase Auth
 */

(function () {
    'use strict';

    console.log('🔒 Auth Guard v4.0 carregando...');

    // ==================== CONFIGURAÇÃO ====================
    const ADMIN_EMAILS = [
        'admin@dimar.com.br',
        'mk.cardoso198@gmail.com',
        'sac.dimar@gmail.com'
    ];

    const SESSION_DURATION_HOURS = 24;

    // ==================== VERIFICAÇÃO ====================

    function isAuthenticated() {
        console.log('🔐 Verificando autenticação...');

        const isLoggedIn = localStorage.getItem('admin_logged_in') === 'true';
        const adminEmail = localStorage.getItem('admin_email');
        const loginTime = localStorage.getItem('admin_login_time');
        const justLoggedIn = localStorage.getItem('admin_just_logged_in') === 'true';

        console.log('📊 Estado atual:', {
            isLoggedIn,
            adminEmail,
            justLoggedIn
        });

        // Se acabou de fazer login, ACEITAR sem verificar mais nada
        if (justLoggedIn && isLoggedIn && adminEmail) {
            console.log('✅ Login recente detectado - acesso autorizado');
            // Limpar flag de login recente (só vale uma vez)
            localStorage.removeItem('admin_just_logged_in');
            return true;
        }

        // Verificar se está logado
        if (!isLoggedIn || !adminEmail) {
            console.log('❌ Não autenticado: dados ausentes');
            return false;
        }

        // Verificar se email é admin
        const isAdmin = ADMIN_EMAILS.some(e => e.toLowerCase() === adminEmail.toLowerCase());
        if (!isAdmin) {
            console.log('❌ Email não é admin:', adminEmail);
            clearSession();
            return false;
        }

        // Verificar expiração (24h)
        if (loginTime) {
            const hours = (Date.now() - new Date(loginTime).getTime()) / (1000 * 60 * 60);
            if (hours > SESSION_DURATION_HOURS) {
                console.log('❌ Sessão expirada após', hours.toFixed(1), 'horas');
                clearSession();
                return false;
            }
        }

        console.log('✅ Autenticado:', adminEmail);
        return true;
    }

    function clearSession() {
        localStorage.removeItem('admin_logged_in');
        localStorage.removeItem('admin_email');
        localStorage.removeItem('admin_login_time');
        localStorage.removeItem('admin_just_logged_in');
    }

    // ==================== PROTEÇÃO DE PÁGINA ====================

    function protectPage() {
        const currentPath = window.location.pathname;
        const isLoginPage = currentPath.includes('login');

        console.log('📍 Página:', currentPath);

        // Não proteger página de login
        if (isLoginPage) {
            console.log('ℹ️ Página de login - sem proteção');
            return;
        }

        // Verificar autenticação
        if (!isAuthenticated()) {
            console.log('🔀 Não autenticado - redirecionando para login...');
            // Use relative path for production compatibility
            window.location.replace('/dimaradmin/login.html');
            return;
        }

        console.log('✅ Acesso autorizado à página protegida');
    }

    // ==================== LOGOUT ====================

    window.adminLogout = function () {
        if (!confirm('Deseja realmente sair?')) return;

        console.log('🚪 Fazendo logout...');
        clearSession();

        // Logout Supabase também (se disponível)
        if (window.supabaseClient) {
            window.supabaseClient.auth.signOut().catch(() => { });
        }

        window.location.replace('/dimaradmin/login.html');
    };

    // ==================== USER INFO ====================

    function displayUserInfo() {
        const email = localStorage.getItem('admin_email');
        if (!email) return;

        const userNameEl = document.getElementById('userName');
        if (userNameEl) {
            userNameEl.textContent = email.split('@')[0];
        }

        const avatarEl = document.querySelector('.user-avatar');
        if (avatarEl) {
            avatarEl.textContent = email[0].toUpperCase();
        }
    }

    // ==================== INICIALIZAÇÃO ====================

    // Executar proteção IMEDIATAMENTE
    protectPage();

    // Depois que DOM carregar, exibir info do usuário
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', displayUserInfo);
    } else {
        displayUserInfo();
    }

    // Exports
    window.authGuard = { isAuthenticated, protectPage, displayUserInfo, clearSession };

    console.log('✅ Auth Guard v4.0 inicializado');

})();
