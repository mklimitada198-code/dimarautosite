# Correção de Segurança - Acesso Admin Restrito

**Data:** 2024-12-12  
**Prioridade:** CRÍTICA  
**Status:** ✅ Resolvido

---

## Problema Identificado

Qualquer usuário que criasse uma conta no site conseguia acessar a área administrativa `/dimaradmin`. Isso representava uma **falha crítica de segurança**.

### Causa
O `auth-guard.js` verificava apenas se o usuário estava **autenticado**, mas não verificava se tinha **permissão de administrador**.

---

## Solução Implementada

### 1. Lista de Admins Autorizados

Criada whitelist de emails autorizados em dois arquivos:

**`dimaradmin/js/auth-guard.js`:**
```javascript
const ADMIN_EMAILS = [
    'admin@dimar.com.br',
    'mk.cardoso198@gmail.com',
    // Adicione mais emails conforme necessário
];
```

**`dimaradmin/login.html`:**
```javascript
const ADMIN_EMAILS = [
    'admin@dimar.com.br',
    'mk.cardoso198@gmail.com',
];
```

### 2. Verificação Dupla

**No login (`login.html`):**
- Após autenticação válida, verifica se email está na lista
- Se NÃO for admin: faz logout imediato e mostra "Acesso negado"
- Se FOR admin: permite acesso normal

**No auth-guard (`auth-guard.js`):**
- Verifica email em cada página do admin
- Redireciona para login se não for admin autorizado

---

## Arquivos Modificados

| Arquivo | Alteração |
|---------|-----------|
| `dimaradmin/js/auth-guard.js` | Adicionada função `isAdminEmail()` e verificação em `isAuthenticated()` |
| `dimaradmin/login.html` | Adicionada verificação de admin após login bem-sucedido |

---

## Como Adicionar Novos Admins

1. Edite `dimaradmin/js/auth-guard.js`
2. Adicione o email na array `ADMIN_EMAILS`
3. Edite `dimaradmin/login.html`
4. Adicione o mesmo email na array `ADMIN_EMAILS`
5. Faça commit e deploy

```javascript
const ADMIN_EMAILS = [
    'admin@dimar.com.br',
    'mk.cardoso198@gmail.com',
    'novo.admin@dimar.com.br', // ← Adicione aqui
];
```

---

## Fluxo de Segurança Atual

```
[Usuário tenta acessar /dimaradmin/]
         │
         ▼
[auth-guard.js verifica sessão]
         │
    ┌────┴────┐
    │         │
  Logado?   Não → Redireciona para login.html
    │
    ▼
[Verifica se email está em ADMIN_EMAILS]
    │
┌───┴───┐
│       │
É admin  Não é admin
   │         │
   ▼         ▼
Acesso    Limpa sessão
permitido  Redireciona
           para login
```

---

## Testes Realizados

- [x] Usuário comum tenta acessar admin → Bloqueado ✅
- [x] Admin tenta acessar admin → Permitido ✅
- [x] Usuário comum tenta fazer login no admin → "Acesso negado" ✅
- [x] Sessão antiga de não-admin → Limpa e redireciona ✅

---

## Notas Importantes

1. **MANTER LISTAS SINCRONIZADAS**: As listas de ADMIN_EMAILS devem ser iguais em ambos os arquivos
2. **Emails são case-insensitive**: A verificação ignora maiúsculas/minúsculas
3. **Logout automático**: Se não-admin tentar login, é deslogado imediatamente

---

## Commits Relacionados

- `fd052e8` - security: restringe acesso admin apenas para emails autorizados
