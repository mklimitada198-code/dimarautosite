# 📋 Decisões Técnicas - Dimar Auto Peças

**Versão:** 1.0.0  
**Data Início:** 10/12/2024  
**Status:** 📝 Documento Vivo

---

## Sobre Este Documento

Este documento registra todas as decisões técnicas importantes tomadas no projeto, incluindo:
- O que foi decidido
- Por que foi decidido
- Alternativas consideradas
- Impacto da decisão

---

## ADR-001: Supabase como Único Backend

**Data:** 08/12/2024  
**Status:** ✅ Aprovado  
**Contexto:** Necessidade de persistência de dados e sincronização Admin ↔ Site

### Decisão
Usar Supabase como **única fonte da verdade** para todos os dados do sistema.

### Justificativa
1. **PostgreSQL gerenciado** - Banco robusto sem administração
2. **API REST automática** - CRUD sem código backend
3. **Autenticação integrada** - Sistema de login pronto
4. **Storage de imagens** - Upload de arquivos simples
5. **RLS (Row Level Security)** - Segurança por design
6. **Gratuito** - Free tier generoso para início

### Alternativas Consideradas
| Alternativa | Motivo Rejeição |
|-------------|-----------------|
| Firebase | Mais caro, NoSQL menos adequado |
| Backend próprio | Complexidade, manutenção, custo |
| localStorage | Não compartilha dados, não escala |

### Impacto
- ✅ Simplifica arquitetura
- ✅ Reduz código backend
- ⚠️ Depende de serviço externo
- ⚠️ Precisa de fallback para offline

---

## ADR-002: Remover Fallback localStorage do Admin

**Data:** 10/12/2024  
**Status:** 🔄 Em Implementação  
**Contexto:** localStorage estava gerando IDs incompatíveis com Supabase

### Decisão
Remover completamente o fallback localStorage do Admin Panel. Supabase é obrigatório.

### Justificativa
1. **IDs incompatíveis** - localStorage usava `cat_1`, Supabase usa UUID
2. **Erro em produção** - `invalid input syntax for type uuid`
3. **Dados não sincronizam** - Cada navegador tinha dados diferentes
4. **Falsa sensação de funcionamento** - Admin "funcionava" mas não salvava de verdade

### Código Afetado
```javascript
// ANTES (dimaradmin/js/categorias.js)
if (!checkSupabaseConfig()) {
    categoryData.id = 'cat_' + Date.now();  // ❌ Gera ID inválido
    categories.push(categoryData);
    localStorage.setItem('dimar_categories', JSON.stringify(categories));
}

// DEPOIS
if (!checkSupabaseConfig()) {
    throw new Error('Supabase não configurado. Operação cancelada.');
}
```

### Impacto
- ✅ Elimina erros de UUID
- ✅ Dados sempre sincronizados
- ⚠️ Admin não funciona sem internet
- ⚠️ Mensagem de erro se Supabase indisponível

---

## ADR-003: Placeholder SVG para Imagens Ausentes

**Data:** 10/12/2024  
**Status:** 📋 Planejado  
**Contexto:** Imagens de produtos quebradas em produção

### Decisão
Implementar sistema de fallback com placeholders SVG locais em vez de depender de serviços externos.

### Justificativa
1. **via.placeholder.com falha** - Serviço externo não confiável
2. **Controle total** - SVG local não depende de terceiros
3. **Performance** - SVG inline é mais rápido
4. **Customização** - Placeholder com identidade visual Dimar

### Implementação
```javascript
// js/utils/image-fallback.js
const SVG_PLACEHOLDER = `data:image/svg+xml,...`;

function handleImageError(img) {
    img.onerror = null; // Evita loop infinito
    img.src = SVG_PLACEHOLDER;
}
```

### Impacto
- ✅ Sem imagens quebradas
- ✅ UX profissional
- ✅ Funciona offline
- ✅ Zero dependência externa

---

## ADR-004: Estrutura de Documentação

**Data:** 10/12/2024  
**Status:** ✅ Aprovado  
**Contexto:** 82+ documentos fragmentados, difícil navegação

### Decisão
Consolidar documentação em estrutura clara com arquivos por função.

### Estrutura Aprovada
```
docs/
├── PLANO-DE-ACAO.md       ← Plano mestre
├── decisoes-tecnicas.md   ← Este arquivo (ADRs)
├── mudancas-supabase.md   ← Alterações no banco
├── mudancas-admin.md      ← Alterações no admin
├── mudancas-homepage.md   ← Alterações no site
├── bugs-corrigidos.md     ← Registro de bugs
├── RESUMO-EXECUTIVO.md    ← Visão geral rápida
└── archive/               ← Docs antigos (manter histórico)
```

### Justificativa
1. **Navegação clara** - Cada doc tem propósito definido
2. **Manutenção fácil** - Atualizar no lugar certo
3. **Histórico preservado** - Docs antigos em archive/
4. **Padrão de mercado** - ADR é prática consagrada

---

## ADR-005: Validação de UUID Obrigatória

**Data:** 10/12/2024  
**Status:** ✅ Implementado  
**Contexto:** Operações CRUD falhavam com IDs inválidos

### Decisão
Toda operação que recebe um ID deve validar se é UUID válido antes de executar.

### Implementação
```javascript
// Regex de validação UUID v4
const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

function isValidUUID(id) {
    return UUID_REGEX.test(id);
}

function validateID(id, operation) {
    if (!isValidUUID(id)) {
        throw new Error(`ID inválido para ${operation}: ${id}`);
    }
    return true;
}
```

### Justificativa
1. **Fail fast** - Erro claro antes de query inválida
2. **Segurança** - Previne SQL injection
3. **UX** - Mensagem de erro amigável
4. **Debug** - Fácil identificar origem do problema

---

## ADR-006: Status de Produto como String Enum

**Data:** 10/12/2024  
**Status:** 📋 Planejado  
**Contexto:** Filtro de produtos ativos/inativos

### Decisão
Usar VARCHAR com valores `'active'`, `'inactive'`, `'draft'` em vez de BOOLEAN.

### Justificativa
1. **Extensibilidade** - Fácil adicionar `'archived'`, `'out_of_stock'`
2. **Clareza** - String é mais legível que true/false
3. **Consistência** - Mesmo padrão em todas as tabelas
4. **Query simples** - `WHERE status = 'active'`

### Schema
```sql
ALTER TABLE products 
ADD COLUMN IF NOT EXISTS status VARCHAR(20) 
DEFAULT 'active' 
CHECK (status IN ('active', 'inactive', 'draft'));
```

---

## Template para Novas Decisões

```markdown
## ADR-XXX: [Título da Decisão]

**Data:** DD/MM/AAAA  
**Status:** 📋 Planejado | 🔄 Em Implementação | ✅ Aprovado | ❌ Rejeitado  
**Contexto:** [Situação que levou à decisão]

### Decisão
[O que foi decidido]

### Justificativa
1. [Motivo 1]
2. [Motivo 2]

### Alternativas Consideradas
| Alternativa | Motivo Rejeição |
|-------------|-----------------|
| [Alt 1] | [Motivo] |

### Impacto
- ✅ [Benefício]
- ⚠️ [Consideração]
```

---

**Última atualização:** 10/12/2024 20:10

