# ⚡ SOLUÇÃO RÁPIDA - Categoria Não Salva
**Data:** 10/12/2024 14:27  
**Problema:** Não consegue salvar categorias

---

## 🎯 CAUSA PROVÁVEL

O campo `image_url` **não existe** na tabela `categories` do seu Supabase!

Quando você adicionou o campo no formulário, o código JavaScript tenta salvar com `image_url`, mas o banco rejeita porque a coluna não existe.

---

## ✅ SOLUÇÃO IMEDIATA

### Opção 1: Executar SQL no Supabase (RECOMENDADO)

1. Acesse: **https://supabase.com/dashboard**
2. Entre no seu projeto
3. Vá em **SQL Editor** (menu lateral)
4. Cole este SQL e clique **RUN**:

```sql
ALTER TABLE categories 
ADD COLUMN IF NOT EXISTS image_url TEXT;
```

5. ✅ Pronto! Tente salvar categoria novamente

### Opção 2: Remover campo image_url temporariamente do código

Se não puder acessar o Supabase agora, vou ajustar o código para **NÃO enviar** o campo `image_url` por enquanto.

Qual opção você prefere? 🤔

---

## 🔍 Como Confirmar Se é Isso

O erro no console deve ser algo como:

```
column "image_url" of relation "categories" does not exist
```

OU

```
invalid input syntax for type
```

---

## 📋 Checklist Após Correção

Depois de adicionar o campo no banco:

- [ ] Executar SQL acima no Supabase
- [ ] Recarregar página de categorias (F5)
- [ ] Tentar adicionar categoria "Teste"
- [ ] Verificar se salvou com sucesso
- [ ] Testar editar categoria existente
- [ ] Testar adicionar categoria COM imagem

---

## 🚨 SE NÃO FOR ISSO

Se o erro for diferente, me envie:

1. **Screenshot do console** (F12) mostrando o erro vermelho
2. **Mensagem exact do Alert** que aparece
3. **Confirme**: Supabase está conectado? (deve ter log `✅ Supabase configurado` no console)

---

**Qual opção você quer seguir?**
