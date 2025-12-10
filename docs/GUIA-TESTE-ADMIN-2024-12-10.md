# 🧪 Guia de Teste - Admin Panel
**Data:** 10/12/2024 14:25  
**Objetivo:** Identificar exatamente onde está o problema de salvamento

---

## 🎯 Teste 1: Verificar Conexão Supabase

### Passo 1: Abrir Console
1. Pressione `F12` para abrir o Console do Navegador
2. Vá para a aba **Console**
3. Limpe o console (botão 🚫)

### Passo 2: Acessar Admin
1. Abra: `http://localhost:8000/dimaradmin/login.html`
2. Login: `admin@dimar.com.br` / `admin123`

### Passo 3: Ver Logs de Conexão
**No console, procure por:**
```
✅ Supabase configurado com sucesso!
🌍 Ambiente: LOCAL
🔐 Auth storage: localStorage FORÇADO
```

**✅ SE VIR ESSAS MENSAGENS:** Supabase está conectado!  
**❌ SE NÃO VIR:** Supabase NÃO está conectado - usará localStorage

---

## 🎯 Teste 2: Tentar Salvar Categoria

### Passo 1: Ir para Categorias
1. Clique em "Categorias" no menu lateral
2. URL deve ser: `http://localhost:8000/dimaradmin/categorias.html`

### Passo 2: Adicionar Nova Categoria
1. Clique no botão **"➕ Adicionar Categoria"**
2. Modal deve abrir

### Passo 3: Preencher Formulário
1. **Nome:** `Teste Debug`
2. **Slug:** (gerado automaticamente: `teste-debug`)
3. **Descrição:** `Categoria de teste`
4. **Imagem:** NÃO selecionar (deixar em branco)
5. **Status:** Ativa

### Passo 4: Clicar em SALVAR e Ver Console
**Logs esperados no console:**
```
🔍 Iniciando salvamento de categoria...
📝 Dados do formulário: { name: "Teste Debug", slug: "teste-debug", editingCategoryId: null }
📷 Nenhuma imagem selecionada
💾  Dados a salvar: { name: "Teste Debug", slug: "teste-debug", ... }
🔌 Usando Supabase? SIM (ou NÃO)
```

**SE USAR SUPABASE:**
```
🚀 Tentando salvar no Supabase...
➕ Modo INSERÇÃO
```

**ENTÃO, UMA DE DUAS COISAS:**

### Caso A: SUCESSO ✅
```
✅ Categoria adicionada com sucesso: [objeto data]
```
→ Alert com "✅ Categoria adicionada com sucesso!"

### Caso B: ERRO ❌
```
❌ Erro do Supabase (INSERT): [objeto error]
📋 Detalhes do erro: {
    message: "...",
    code: "...",
    details: "...",
    hint: "..."
}
```
→ Alert com mensagem de erro detalhada

---

## 🎯 Teste 3: Identificar o Problema Específico

### Possível Erro 1: Campo image_url não existe
**Mensagem:**
```
column "image_url" of relation "categories" does not exist
```

**SOLUÇÃO:**
Execute a migration no Supabase para adicionar o campo:
```sql
ALTER TABLE categories 
ADD COLUMN IF NOT EXISTS image_url TEXT;
```

### Possível Erro 2: RLS Policy bloqueando
**Mensagem:**
```
new row violates row-level security policy
```

**SOLUÇÃO:**
No Supabase, desabilite RLS temporariamente OU adicione policy:
```sql
-- Permitir INSERT para usuários autenticados
CREATE POLICY "Enable insert for authenticated users" ON categories
FOR INSERT
TO authenticated
WITH CHECK (true);
```

### Possível Erro 3: Sem autenticação
**Mensagem:**
```
permission denied for table categories
```

**SOLUÇÃO:**
Você precisa estar autenticado no Supabase. Verifique se tem um usuário criado.

### Possível Erro 4: Usando localStorage
**Console mostra:**
```
🔌 Usando Supabase? NÃO (localStorage)
💾 Salvando no localStorage...
✅ Salvo no localStorage
```

**PROBLEMA:** Supabase não está conectado!  
**SOLUÇÃO:** Verificar credenciais em `dimaradmin/js/supabase-config.js`

---

## 📋 O Que Reportar

Depois de fazer o teste, me informe:

1. **Qual mensagem apareceu no console?**
   - Cole aqui os logs que começam com 🔍, 🔌, 🚀, etc.

2. **Qual erro específico apareceu?**
   - Cole a mensagem completa do erro

3. **Supabase está conectado?**
   - SIM ou NÃO (baseado no log 🔌)

4. **O que o Alert mostrou?**
   - Sucesso ou erro? Qual mensagem?

---

## 🔧 Correções Aplicadas

As seguintes melhorias já foram aplicadas no código:

✅ **Validação de campos obrigatórios**
- Verifica se Nome e Slug estão preenchidos

✅ **Campo image_url sempre incluído**
- Mesmo sem imagem, envia `null` para evitar erro de schema

✅ **Logs detalhados no console**
- Cada etapa do salvamento mostra logs com emojis

✅ **Mensagem de erro detalhada**
- Mostra code, hint, details do erro do Supabase

✅ **Retorno de dados com .select()**
- Confirma que dados foram salvos e retorna os dados

---

## 🎯 Próximo Passo

**FAÇA O TESTE AGORA** e me envie:
- Screenshot do console
- Texto da mensagem de erro (se houver)
- Confirmação se Supabase está conectado

Com essas informações, posso corrigir o problema exato! 🚀
