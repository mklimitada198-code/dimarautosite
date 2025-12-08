/**
 * Supabase Configuration
 * 
 * IMPORTANTE: Substitua estas credenciais pelas suas!
 * 
 * Para obter suas credenciais:
 * 1. Acesse: https://supabase.com
 * 2. Crie um projeto
 * 3. Vá em Settings > API
 * 4. Copie a URL e a anon key
 */

// ✅ CREDENCIAIS CONFIGURADAS
const SUPABASE_URL = 'https://rkhnhdlctkgamaxmfxsr.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJraG5oZGxjdGtnYW1heG1meHNyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzM2OTQ4MzgsImV4cCI6MjA0OTI3MDgzOH0.v_1gsMHJE4G0cZdWtqWQtdPU8xzVwJL93oN2tFXnkz4';

// Inicializar cliente Supabase
const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Verificar se está configurado corretamente
function checkSupabaseConfig() {
    // Validar credenciais
    if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
        console.log('⚠️ Supabase não configurado - Usando localStorage');
        return false;
    }
    
    if (SUPABASE_URL === 'YOUR_SUPABASE_URL_HERE' || 
        SUPABASE_ANON_KEY === 'YOUR_SUPABASE_ANON_KEY_HERE') {
        console.log('⚠️ Credenciais placeholder - Usando localStorage');
        return false;
    }
    
    console.log('✅ Supabase configurado e pronto para uso!');
    console.log('📊 Dados serão salvos no banco de dados');
    return true; // Retorna true para usar Supabase
}

// Export para usar em outros arquivos
window.supabaseClient = supabase;
window.checkSupabaseConfig = checkSupabaseConfig;

