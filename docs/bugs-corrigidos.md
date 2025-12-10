# 🐛 Bugs Corrigidos - Dimar Auto Peças

**Versão:** 1.0.0  
**Data Início:** 10/12/2024  
**Status:** 📝 Documento Vivo

---

## Sobre Este Documento

Registro de todos os bugs identificados, investigados e corrigidos no projeto.

---

## Legenda de Status

| Status | Descrição |
|--------|-----------|
| 🔴 ABERTO | Bug identificado, não corrigido |
| 🟡 EM PROGRESSO | Correção em andamento |
| 🟢 CORRIGIDO | Bug resolvido |
| ⚪ FECHADO | Não era bug ou won't fix |

---

## Bugs Críticos

### BUG-001: Invalid UUID Syntax Error

**Status:** 🟢 CORRIGIDO  
**Severidade:** 🔴 CRÍTICA  
**Data Identificação:** 10/12/2024  
**Data Correção:** 10/12/2024

#### Descrição
Operações de edição/exclusão de categorias falhavam com erro:
```
invalid input syntax for type uuid: "cat_1"
```

#### Causa Raiz
Fallback para localStorage gerava IDs no formato `cat_X` em vez de UUID.

#### Arquivos Afetados
- `dimaradmin/js/categorias.js`

#### Correção Aplicada
1. Adicionada validação de UUID antes de operações
2. Validação no carregamento de dados

```javascript
const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

function validateCategoryID(id, operation) {
    if (!UUID_REGEX.test(id)) {
        showCustomAlert('Erro', `ID inválido para ${operation}`);
        return false;
    }
    return true;
}
```

#### Referência
- [UUID-FIX-IMPLEMENTED-2024-12-10.md](./UUID-FIX-IMPLEMENTED-2024-12-10.md)

---

### BUG-002: Imagens Quebradas em Produção

**Status:** 🔴 ABERTO  
**Severidade:** 🔴 CRÍTICA  
**Data Identificação:** 10/12/2024

#### Descrição
Produtos na homepage exibem imagens quebradas:
- `net::ERR_NAME_NOT_RESOLVED` para `via.placeholder.com`
- `404` para `/null`

#### Causa Raiz
1. Produtos sem `image_url` resultam em `/null`
2. Seção "Mais Procurados" usa URLs de placeholder externo

#### Screenshots
![Imagens Quebradas](file:///C:/Users/Mayko/.gemini/antigravity/brain/a905d5a0-773c-463e-a82a-80f57690d938/production_homepage_1765381782270.png)

#### Solução Proposta
1. Implementar fallback SVG local
2. Remover seção mockada
3. Validar URLs antes de salvar

#### Arquivos a Modificar
- `index.html` (remover seção mockada)
- `js/home-supabase.js` (fallback de imagem)
- `js/utils/image-fallback.js` (novo arquivo)

---

### BUG-003: Migration de Badges Pendente

**Status:** 🔴 ABERTO  
**Severidade:** 🔴 CRÍTICA  
**Data Identificação:** 10/12/2024

#### Descrição
Colunas `badge_type`, `custom_badge_text`, `short_description` não existem na tabela `products`.

#### Impacto
- Admin não consegue salvar produtos com badges
- Erro: `Could not find the 'badge_type' column`

#### Solução
Executar migration SQL no Supabase:
```sql
ALTER TABLE products 
ADD COLUMN IF NOT EXISTS badge_type VARCHAR(50),
ADD COLUMN IF NOT EXISTS custom_badge_text VARCHAR(100),
ADD COLUMN IF NOT EXISTS short_description TEXT;
```

#### Referência
- [GUIA-MIGRATION-VISUAL-2024-12-10.md](./GUIA-MIGRATION-VISUAL-2024-12-10.md)

---

## Bugs Médios

### BUG-004: Dashboard Mostra Contagens Incorretas

**Status:** 🟢 CORRIGIDO  
**Severidade:** 🟡 MÉDIA  
**Data Identificação:** 10/12/2024  
**Data Correção:** 10/12/2024

#### Descrição
Dashboard do admin mostra "0 marcas" quando existem 7+ no banco.

#### Causa Raiz
`loadDashboardStats()` executava antes do Supabase estar pronto.
Verificação condicional usava variável local `supabaseClient` em vez de `window.supabaseClient`.

#### Solução Aplicada
Adicionado `waitForSupabase()` em `dashboard.js` para aguardar cliente estar pronto.
Corrigido uso de `window.supabaseClient` em todas as queries.

#### Passos para Reproduzir
1. Acessar `/dimaradmin/login.html`
2. Fazer login
3. Observar dashboard: "0 marcas"
4. Acessar `/dimaradmin/marcas.html`: 7 marcas listadas

#### Solução Proposta
Revisar e corrigir `loadDashboardStats()` no dashboard.

---

### BUG-005: Escape de Strings Incorreto

**Status:** 🔴 ABERTO  
**Severidade:** 🟡 MÉDIA  
**Data Identificação:** 10/12/2024

#### Descrição
Mensagens de erro/confirmação exibem `\n` literal em vez de quebra de linha.

#### Causa Raiz
Template strings usando `\\n` (escape do escape).

#### Arquivo
`dimaradmin/js/produtos.js` (linhas 501-575)

#### Código Problemático
```javascript
const confirmMessage = `...\\n\\n...`; // ❌ Mostra "\n"
```

#### Código Correto
```javascript
const confirmMessage = `...

...`; // ✅ Quebra de linha real
```

---

## Bugs Menores

### BUG-006: Favicons Ausentes

**Status:** 🔴 ABERTO  
**Severidade:** 🟢 BAIXA  
**Data Identificação:** 10/12/2024

#### Descrição
Console mostra 404 para arquivos de favicon:
```
GET /favicon.ico 404
GET /assets/images/favicon-32x32.png 404
GET /assets/images/favicon-16x16.png 404
```

#### Solução
Criar/adicionar favicons ou remover referências no HTML.

---

### BUG-007: Build Version Log Ausente

**Status:** 🔴 ABERTO  
**Severidade:** 🟢 BAIXA  
**Data Identificação:** 10/12/2024

#### Descrição
Mensagem de build version não aparece em produção:
```
🚀 CÓDIGO NOVO ATIVO - BUILD: 2024-12-10-v3
```

#### Impacto
Dificulta debug de qual versão está ativa.

---

## Bugs Corrigidos Anteriormente

### BUG-100: Botões Editar/Excluir Não Funcionam

**Status:** 🟢 CORRIGIDO  
**Data Correção:** 10/12/2024

#### Problema
Clicar em ✏️ ou 🗑️ não executava ação.

#### Causa
Funções não expostas no escopo global para `onclick`.

#### Correção
```javascript
// Expor funções globalmente
window.editCategory = function(id) { ... };
window.deleteCategory = function(id) { ... };
```

---

### BUG-101: Admin Usava localStorage em Vez de Supabase

**Status:** 🟢 CORRIGIDO  
**Data Correção:** 10/12/2024

#### Problema
`checkSupabaseConfig()` retornava false mesmo com Supabase configurado.

#### Causa
Verificava variável local `supabase` em vez de `window.supabaseClient`.

#### Correção
```javascript
function checkSupabaseConfig() {
    return window.supabaseClient !== null && 
           window.supabaseClient !== undefined;
}
```

---

### BUG-102: Produtos Não Carregavam no Admin

**Status:** 🟢 CORRIGIDO  
**Data Correção:** 10/12/2024

#### Problema
Lista de produtos mostrava 0 mesmo com produtos no banco.

#### Causa
`produtos.js` executava antes do Supabase estar pronto.

#### Correção
Implementado polling com `waitForSupabase()`:
```javascript
function waitForSupabase(callback) {
    const check = setInterval(() => {
        if (window.supabaseClient) {
            clearInterval(check);
            callback();
        }
    }, 100);
}
```

---

### BUG-103: Marcas Invisíveis na Homepage

**Status:** 🟢 CORRIGIDO  
**Data Correção:** 10/12/2024

#### Problema
Logos das marcas parceiras quase invisíveis.

#### Causa
CSS com `opacity(0.6)` e `grayscale(100%)`.

#### Correção
Ajustado para `opacity(0.85)` e `grayscale(80%)`:
```css
.brand-item img {
    filter: grayscale(80%) opacity(0.85);
}
```

---

## Template para Novos Bugs

```markdown
### BUG-XXX: [Título Descritivo]

**Status:** 🔴 ABERTO | 🟡 EM PROGRESSO | 🟢 CORRIGIDO  
**Severidade:** 🔴 CRÍTICA | 🟡 MÉDIA | 🟢 BAIXA  
**Data Identificação:** DD/MM/AAAA  
**Data Correção:** DD/MM/AAAA (se aplicável)

#### Descrição
[O que acontece]

#### Passos para Reproduzir
1. [Passo 1]
2. [Passo 2]

#### Comportamento Esperado
[O que deveria acontecer]

#### Comportamento Atual
[O que realmente acontece]

#### Causa Raiz
[Por que acontece]

#### Correção Aplicada
[Como foi corrigido]

#### Arquivos Modificados
- [arquivo1.js]
- [arquivo2.html]
```

---

**Última atualização:** 10/12/2024 20:10

