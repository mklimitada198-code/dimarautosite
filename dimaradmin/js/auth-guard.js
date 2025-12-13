/**
 * AUTH GUARD - Sistema de proteção SIMPLIFICADO
 * Usa apenas localStorage - sem dependência do Supabase Auth
 */

(function () {
    'use strict';

    // ==================== CONFIGURAÇÃO ====================
    const ADMIN_EMAILS = [
        'admin@dimar.com.br',
        'mk.cardoso198@gmail.com'
    ];

    const SESSION_DURATION_HOURS = 24;

    // ==================== VERIFICAÇÃO ====================

    function isAuthenticated() {
        const isLoggedIn = localStorage.getItem('admin_logged_in') === 'true';
        const adminEmail = localStorage.getItem('admin_email');
        const loginTime = localStorage.getItem('admin_login_time');

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
                console.log('❌ Sessão expirada');
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
    }

    // ==================== PROTEÇÃO DE PÁGINA ====================

    function protectPage() {
        const isLoginPage = window.location.pathname.includes('login.html');

        console.log('🔒 Auth Guard v3.0');
        console.log('📍 Página:', window.location.pathname);

        // Não proteger página de login
        if (isLoginPage) {
            console.log('ℹ️ Página de login - sem proteção');
            return;
        }

        // Verificar autenticação
        if (!isAuthenticated()) {
            console.log('🔀 Redirecionando para login...');
            window.location.replace('/dimaradmin/login.html');
        }
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

    function init() {
        console.log('🚀 Auth Guard Simplificado v3.0');
        protectPage();
        displayUserInfo();
    }

    // Executar
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    // Exports
    window.authGuard = { isAuthenticated, protectPage, displayUserInfo };

})();
