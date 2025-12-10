/**
 * Supabase Configuration - Admin Panel
 * Configuração e inicialização do Supabase com autenticação
 */

(function () {
    'use strict';

    // ==================== OBTER CREDENCIAIS ====================
    // Prioridade: env vars > meta tags > fallback hardcoded

    function getEnvVar(name, fallback) {
        // Tentar variáveis de ambiente (se disponíveis via build)
        if (typeof process !== 'undefined' && process.env && process.env[name]) {
            return process.env[name];
        }

        // Tentar meta tags (para deploy estático)
        const metaTag = document.querySelector(`meta[name="${name}"]`);
        if (metaTag && metaTag.content) {
            return metaTag.content;
        }

        // Fallback
        return fallback;
    }

    const SUPABASE_URL = getEnvVar(
        'NEXT_PUBLIC_SUPABASE_URL',
        'https://jfiarqtqojfptdbddnvu.supabase.co'
    );

    const SUPABASE_ANON_KEY = getEnvVar(
        'NEXT_PUBLIC_SUPABASE_ANON_KEY',
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpmaWFycXRxb2pmcHRkYmRkbnZ1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjUxODY0NTEsImV4cCI6MjA4MDc2MjQ1MX0.Nf7e1D1_J3kKUwPBhvBUp-VSPCJu3vra8ysjUZBUm8g'
    );

    // ==================== CONFIGURAÇÃO DO CLIENTE ====================
    let supabase = null;

    // Detectar ambiente
    const isProduction = window.location.hostname !== 'localhost' &&
        window.location.hostname !== '127.0.0.1';

    // Configurações do cliente
    const supabaseConfig = {
        auth: {
            // Detectar sessão na URL - DESABILITADO para evitar loop
            // OAuth callbacks devem ser tratados explicitamente
            detectSessionInUrl: false,
            // Persistir sessão
            persistSession: true,
            // Auto-refresh de token
            autoRefreshToken: true,
            // Storage padrão
            storage: window.localStorage,
            // Configuração de cookies para produção
            ...(isProduction && {
                cookieOptions: {
                    name: 'sb-auth-token',
                    domain: window.location.hostname,
                    path: '/',
                    sameSite: 'lax',
                    secure: true  // Importante para HTTPS em produção
                }
            })
        }
    };

    // ==================== INICIALIZAR CLIENTE ====================
    function initializeSupabase() {
        if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
            console.error('❌ Credenciais do Supabase não configuradas');
            return false;
        }

        if (!window.supabase) {
            console.warn('⚠️ SDK do Supabase ainda não carregou');
            return false;
        }

        try {
            supabase = window.supabase.createClient(
                SUPABASE_URL,
                SUPABASE_ANON_KEY,
                supabaseConfig
            );

            window.supabaseClient = supabase;

            console.log('✅ Supabase configurado com sucesso!');
            console.log('🌍 Ambiente:', isProduction ? 'PRODUÇÃO' : 'LOCAL');
            console.log('🔐 Auth cookies:', isProduction ? 'HTTPS/Secure' : 'HTTP/Standard');

            return true;
        } catch (error) {
            console.error('❌ Erro ao inicializar Supabase:', error);
            return false;
        }
    }

    // Tentar inicializar (com retry)
    let attempts = 0;
    const maxAttempts = 30;

    const initInterval = setInterval(() => {
        attempts++;

        if (initializeSupabase()) {
            clearInterval(initInterval);
            console.log('🚀 Supabase pronto para autenticação!');
        } else if (attempts >= maxAttempts) {
            clearInterval(initInterval);
            console.error('❌ Timeout: Não foi possível inicializar Supabase');
        }
    }, 100);

    // ==================== HELPER FUNCTIONS ====================

    function checkSupabaseConfig() {
        return supabase !== null;
    }

    // Export global
    window.supabaseClient = supabase;
    window.checkSupabaseConfig = checkSupabaseConfig;

})();

