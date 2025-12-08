/**
 * Supabase Configuration
 * Configuração e inicialização do Supabase
 */

(function() {
    'use strict';

    // ==================== SAFE LOGGER ====================
    const log = {
        info: (msg) => typeof logger !== 'undefined' ? logger.info(msg) : console.info(msg),
        warn: (msg) => typeof logger !== 'undefined' ? logger.warn(msg) : console.warn(msg),
        error: (msg, err) => typeof logger !== 'undefined' ? logger.error(msg, err) : console.error(msg, err),
        success: (msg) => typeof logger !== 'undefined' ? logger.success(msg) : console.log('✅', msg)
    };

    // ==================== CONFIGURAÇÃO ====================
    // Credenciais do Supabase - Dimar Auto Peças
    const SUPABASE_URL = 'https://jfiarqtqojfptdbddnvu.supabase.co';
    const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpmaWFycXRxb2pmcHRkYmRkbnZ1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzM2OTQ5NjgsImV4cCI6MjA0OTI3MDk2OH0.sb_publishable_-gAmMx1wqeIXhNPr6uhAbw_8-VcPgeJ';

    // Inicializar cliente Supabase
    let supabase = null;

    // Verificar se as credenciais foram configuradas
    const isConfigured = SUPABASE_URL !== 'YOUR_SUPABASE_URL_HERE' && 
                         SUPABASE_ANON_KEY !== 'YOUR_SUPABASE_ANON_KEY_HERE';

    // ==================== AGUARDAR CDN E INICIALIZAR ====================
    function initializeSupabase() {
        if (!isConfigured) {
            log.warn('⚠️ Supabase não configurado. Usando dados mock.');
            log.info('Configure as credenciais em js/supabase-config.js');
            return;
        }

        if (typeof window.supabase === 'undefined') {
            log.warn('⚠️ CDN do Supabase ainda não carregou. Aguardando...');
            return false;
        }

        try {
            supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
            window.supabaseClient = supabase;
            log.success('Supabase conectado com sucesso!');
            return true;
        } catch (error) {
            log.error('Erro ao conectar Supabase:', error);
            return false;
        }
    }

    // Tentar inicializar (retry até 3 segundos)
    let attempts = 0;
    const maxAttempts = 30; // 30 * 100ms = 3 segundos

    const initInterval = setInterval(() => {
        attempts++;
        
        if (initializeSupabase()) {
            clearInterval(initInterval);
            log.success('✅ Supabase pronto para uso!');
        } else if (attempts >= maxAttempts) {
            clearInterval(initInterval);
            log.error('❌ Timeout: CDN do Supabase não carregou em 3 segundos');
            log.warn('⚠️ Supabase em modo MOCK (dados locais)');
        }
    }, 100);


    // ==================== HELPER FUNCTIONS ====================

    /**
     * Verificar se está conectado ao Supabase
     */
    function isSupabaseConnected() {
        return supabase !== null && isConfigured;
    }

    /**
     * Verificar se usuário está autenticado
     */
    async function isAuthenticated() {
        if (!isSupabaseConnected()) return false;
        
        try {
            const { data: { session } } = await supabase.auth.getSession();
            return session !== null;
        } catch (error) {
            log.error('Erro ao verificar autenticação:', error);
            return false;
        }
    }

    /**
     * Obter usuário atual
     */
    async function getCurrentUser() {
        if (!isSupabaseConnected()) return null;
        
        try {
            const { data: { user } } = await supabase.auth.getUser();
            return user;
        } catch (error) {
            log.error('Erro ao obter usuário:', error);
            return null;
        }
    }

    /**
     * Login
     */
    async function login(email, password) {
        if (!isSupabaseConnected()) {
            return { success: false, error: 'Supabase não configurado' };
        }
        
        try {
            const { data, error } = await supabase.auth.signInWithPassword({
                email: email,
                password: password
            });
            
            if (error) throw error;
            
            log.success('Login realizado com sucesso!');
            return { success: true, user: data.user };
        } catch (error) {
            log.error('Erro no login:', error);
            return { success: false, error: error.message };
        }
    }

    /**
     * Logout
     */
    async function logout() {
        if (!isSupabaseConnected()) {
            return { success: false, error: 'Supabase não configurado' };
        }
        
        try {
            const { error } = await supabase.auth.signOut();
            if (error) throw error;
            
            log.success('Logout realizado com sucesso!');
            return { success: true };
        } catch (error) {
            log.error('Erro no logout:', error);
            return { success: false, error: error.message };
        }
    }

    /**
     * Cadastro
     */
    async function signUp(email, password, metadata = {}) {
        if (!isSupabaseConnected()) {
            return { success: false, error: 'Supabase não configurado' };
        }
        
        try {
            const { data, error } = await supabase.auth.signUp({
                email: email,
                password: password,
                options: {
                    data: metadata
                }
            });
            
            if (error) throw error;
            
            log.success('Cadastro realizado com sucesso!');
            return { success: true, user: data.user };
        } catch (error) {
            log.error('Erro no cadastro:', error);
            return { success: false, error: error.message };
        }
    }

    // ==================== EXPORTS ====================
    window.supabaseClient = supabase;
    window.supabaseAuth = {
        isConnected: isSupabaseConnected,
        isAuthenticated,
        getCurrentUser,
        login,
        logout,
        signUp
    };

})();
