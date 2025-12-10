# ✅ FIX DEFINITIVO: produtos.js Aguarda Supabase

## Problema Raiz Identificado

Console mostrava:
```
🔍 checkSupabaseConfig chamado: NÃO CONECTADO
```

**Causa:** `produtos.js` executava IMEDIATAMENTE no `DOMContentLoaded`, mas `window.supabaseClient` só ficava pronto DEPOIS (durante `auth-guard.js`).

## Solução Final

Adicionado função `waitForSupabase()` que:
1. Verifica a cada 100ms se `window.supabaseClient` existe
2. Aguarda até 3 segundos (30 tentativas)  
3. SÓ ENTÃO inicializa produtos

```javascript
// NOVA FUNÇÃO
function waitForSupabase(callback) {
    let attempts = 0;
    const maxAttempts = 30; // 3 seconds
    
    const checkInterval = setInterval(() => {
        attempts++;
        console.log(`⏳ Tentativa ${attempts}/30: Aguardando Supabase...`);
        
        if (window.supabaseClient) {
            console.log('✅ Supabase detectado!');
            clearInterval(checkInterval);
            callback(); // AGORA SIM inicia
        } else if (attempts >= maxAttempts) {
            console.warn('⚠️ Timeout, usando localStorage');
            clearInterval(checkInterval);
            callback();
        }
    }, 100);
}

// DOM READY → ESPERA SUPABASE → INICIA PRODUTOS
document.addEventListener('DOMContentLoaded', () => {
    waitForSupabase(() => {
        setupImageUpload();
        setupFilters();
        setupProductForm();
        setupBadgeTypeListener();
        loadProducts(); // SÓ chama quando Supabase pronto!
    });
});
```

## Console Esperado AGORA

```
📦 produtos.js carregado!
🚀 DOM pronto, aguardando Supabase...
⏳ Tentativa 1/30: Aguardando Supabase...
⏳ Tentativa 2/30: Aguardando Supabase...
✅ Supabase detectado! Inicializando produtos...
🎯 Iniciando produtos...
📥 Carregando produtos...
🔍 checkSupabaseConfig: CONECTADO ✅
🔌 Carregando do Supabase... ✅
✅ 8 produtos carregados do Supabase ✅
✅ Produtos renderizados
```

## Teste

1. `Ctrl + Shift + R`
2. **Produtos devem aparecer!** 🎉
