/**
 * AUTH GUARD - Sistema de proteção de páginas admin
 * Protege páginas do painel usando Supabase Auth
 */

(function () {
    'use strict';

    // ==================== LISTA DE ADMINS PERMITIDOS ====================
    // IMPORTANTE: Adicione aqui os emails que podem acessar o admin
    const ADMIN_EMAILS = [
        'admin@dimar.com.br',
        'mk.cardoso198@gmail.com',
        // Adicione mais emails de admin conforme necessário
    ];

    // ==================== VERIFICAÇÃO DE ADMIN ====================

    /**
     * Verifica se o email é de um admin autorizado
     */
    function isAdminEmail(email) {
        if (!email) return false;
        const normalizedEmail = email.toLowerCase().trim();
        return ADMIN_EMAILS.some(adminEmail => adminEmail.toLowerCase() === normalizedEmail);
    }

    /**
     * Verifica se usuário está autenticado E é admin
     * CORREÇÃO: Agora verifica se é admin, não apenas se está autenticado
     */
    async function isAuthenticated() {
        try {
            console.log('🔐 Verificando autenticação de ADMIN...');

            // Verificar localStorage primeiro
            const localAuth = checkLocalStorageFallback();

            if (localAuth) {
                const adminEmail = localStorage.getItem('admin_email');
                if (isAdminEmail(adminEmail)) {
                    console.log('✅ Admin autenticado via localStorage:', adminEmail);
                    return true;
                } else {
                    console.warn('❌ Email não é admin:', adminEmail);
                    clearLocalStorage();
                    return false;
                }
            }

            // Verificar Supabase
            if (window.supabaseClient) {
                const { data: { session } } = await window.supabaseClient.auth.getSession();
                if (session && session.user) {
                    const userEmail = session.user.email;

                    if (isAdminEmail(userEmail)) {
                        console.log('✅ Admin autenticado via Supabase:', userEmail);
                        syncToLocalStorage(session.user);
                        return true;
                    } else {
                        console.warn('❌ Usuário autenticado mas NÃO é admin:', userEmail);
                        // NÃO sincronizar - este usuário não deve ter acesso admin
                        return false;
                    }
                }
            }

            console.log('❌ Não autenticado');
            return false;

        } catch (err) {
            console.error('❌ Erro ao verificar autenticação:', err);
            // Em caso de erro, verificar localStorage com verificação de admin
            const adminEmail = localStorage.getItem('admin_email');
            return isAdminEmail(adminEmail);
        }
    }

    /**
     * Fallback: verificar localStorage (compatibilidade temporária)
     */
    function checkLocalStorageFallback() {
        const isLoggedIn = localStorage.getItem('admin_logged_in') === 'true';
        const hasEmail = !!localStorage.getItem('admin_email');
        const loginTime = localStorage.getItem('admin_login_time');

        if (!isLoggedIn || !hasEmail) {
            return false;
        }

        // Verificar se não expirou (24h)
        if (loginTime) {
            const hoursSinceLogin = (new Date() - new Date(loginTime)) / (1000 * 60 * 60);
            if (hoursSinceLogin > 24) {
                console.warn('⚠️ Sessão localStorage expirada (24h)');
                clearLocalStorage();
                return false;
            }
        }

        console.log('ℹ️ Usando fallback localStorage (sessão temporária)');
        return true;
    }

    /**
     * Sincronizar sessão Supabase com localStorage
     */
    function syncToLocalStorage(user) {
        localStorage.setItem('admin_logged_in', 'true');
        localStorage.setItem('admin_email', user.email);
        localStorage.setItem('admin_login_time', new Date().toISOString());
    }

    /**
     * Limpar dados de autenticação
     */
    function clearLocalStorage() {
        localStorage.removeItem('admin_logged_in');
        localStorage.removeItem('admin_email');
        localStorage.removeItem('admin_login_time');
    }

    // ==================== PROTEÇÃO DE PÁGINA ====================

    /**
     * Protege páginas admin - redireciona se não autenticado
     * CORREÇÃO: Adiciona recheck para evitar falsos negativos por race condition
     */
    async function protectAdminPage() {
        const currentPage = window.location.pathname;
        const isLoginPage = currentPage.includes('login.html');

        console.log('🔒 Auth Guard ativo');
        console.log('📍 Página atual:', currentPage);

        // Não proteger página de login
        if (isLoginPage) {
            console.log('ℹ️ Página de login - auth guard inativo');

            // ❌ REMOVIDO: auto-redirect se já autenticado
            // MOTIVO: Causava loop infinito
            // - login.html tem seu próprio fluxo de redirect após submit
            // - Verificação automática causava conflito
            // - Se usuário está em login.html, deixar ele fazer login manualmente
            // - Não forçar redirect baseado em sessão existente

            return; // NÃO FAZER NADA - deixar formulário de login lidar
        }

        // Verificar autenticação (primeira tentativa)
        const authenticated = await isAuthenticated();

        if (!authenticated) {
            console.warn('⚠️ Usuário NÃO autenticado (primeira verificação)');
            console.log('📊 LocalStorage:', {
                admin_logged_in: localStorage.getItem('admin_logged_in'),
                admin_email: localStorage.getItem('admin_email'),
                admin_login_time: localStorage.getItem('admin_login_time')
            });

            // 🔄 CORREÇÃO: Aguardar e verificar novamente antes de redirecionar
            // Isso evita race condition onde Supabase ainda está carregando
            console.log('⏳ Aguardando 500ms para reconfirmar...');
            await new Promise(resolve => setTimeout(resolve, 500));

            // Segunda verificação
            const recheckAuth = await isAuthenticated();

            if (!recheckAuth) {
                console.warn('❌ Usuário NÃO autenticado (confirmado após recheck)');

                // Agora sim, limpar dados e redirecionar
                clearLocalStorage();
                sessionStorage.clear();

                console.log('🔀 Redirecionando para login...');
                window.location.replace('/dimaradmin/login.html');
            } else {
                console.log('✅ Sessão confirmada após recheck - acesso autorizado');
            }
        } else {
            console.log('✅ Acesso autorizado (primeira verificação)');
        }
    }

    // ==================== LISTENER DE MUDANÇA DE ESTADO ====================

    /**
     * Monitora mudanças no estado de autenticação
     */
    function setupAuthListener() {
        if (!window.supabaseClient) {
            console.warn('⚠️ Não foi possível setup auth listener (Supabase não disponível)');
            return;
        }

        window.supabaseClient.auth.onAuthStateChange((event, session) => {
            console.log('🔔 Auth state change:', event);

            switch (event) {
                case 'SIGNED_IN':
                    console.log('✅ Usuário logado:', session?.user?.email);
                    if (session?.user) {
                        syncToLocalStorage(session.user);
                    }
                    break;

                case 'SIGNED_OUT':
                    console.log('🚪 Usuário deslogado');
                    clearLocalStorage();

                    // Redirecionar para login se não estiver na página de login
                    if (!window.location.pathname.includes('login.html')) {
                        window.location.replace('/dimaradmin/login.html');
                    }
                    break;

                case 'TOKEN_REFRESHED':
                    console.log('🔄 Token renovado');
                    break;

                case 'USER_UPDATED':
                    console.log('👤 Usuário atualizado');
                    break;
            }
        });

        console.log('✅ Auth listener configurado');
    }

    // ==================== LOGOUT ====================

    /**
     * Função de logout
     */
    window.adminLogout = async function () {
        if (!confirm('Deseja realmente sair?')) {
            return;
        }

        console.log('🚪 Fazendo logout...');

        try {
            // Logout do Supabase
            if (window.supabaseClient) {
                const { error } = await window.supabaseClient.auth.signOut();
                if (error) {
                    console.error('Erro ao fazer logout no Supabase:', error);
                }
            }
        } catch (err) {
            console.error('Erro no logout:', err);
        }

        // Limpar dados locais
        clearLocalStorage();
        sessionStorage.clear();

        // Redirecionar
        window.location.replace('/dimaradmin/login.html');
    };

    // ==================== INFORMAÇÕES DO USUÁRIO ====================

    /**
     * Exibe informações do usuário na interface
     */
    async function displayUserInfo() {
        try {
            let userEmail = null;

            // Tentar obter do Supabase primeiro
            if (window.supabaseClient) {
                const { data: { user } } = await window.supabaseClient.auth.getUser();
                if (user) {
                    userEmail = user.email;
                }
            }

            // Fallback para localStorage
            if (!userEmail) {
                userEmail = localStorage.getItem('admin_email');
            }

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
        } catch (err) {
            console.error('Erro ao exibir info do usuário:', err);
        }
    }

    // ==================== INICIALIZAÇÃO ====================

    /**
     * Inicializar auth guard
     */
    async function init() {
        console.log('🚀 Auth Guard inicializado');
        console.log('🌍 Hostname:', window.location.hostname);
        console.log('📍 Path:', window.location.pathname);

        // Aguardar Supabase carregar
        let attempts = 0;
        const checkInterval = setInterval(async () => {
            attempts++;

            if (window.supabaseClient || attempts > 20) {
                clearInterval(checkInterval);

                if (window.supabaseClient) {
                    console.log('✅ Supabase client disponível');
                    setupAuthListener();
                } else {
                    console.warn('⚠️ Supabase client não disponível - usando apenas localStorage');
                }

                await protectAdminPage();
                await displayUserInfo();
            }
        }, 100);
    }

    // Executar ao carregar
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    // ==================== EXPORTS ====================

    window.authGuard = {
        isAuthenticated,
        protectAdminPage,
        displayUserInfo
    };

})();
