# 🚀 GUIA RÁPIDO - INTEGRAÇÃO ADMIN → HOME

**Como fazer edições no admin aparecerem na home**

---

## ⚡ EM 3 PASSOS

### 1️⃣ **ACESSE O ADMIN PANEL**

```
URL: https://seu-site.vercel.app/dimaradmin/
```

**Login:**
- Email: `admin@dimar.com`
- Senha: (sua senha configurada no Supabase)

---

### 2️⃣ **FAÇA AS EDIÇÕES**

#### **➕ ADICIONAR PRODUTO NA HOME**

1. Acesse: **Produtos** → **Adicionar Produto**
2. Preencha os dados
3. ✅ **IMPORTANTE:** Marque **"Produto em Destaque"**
4. Adicione imagens
5. Clique em **Salvar**

✅ **Produto aparecerá IMEDIATAMENTE na home!**

---

#### **🎨 ADICIONAR BANNER NO CARROSSEL**

1. Acesse: **Banners** → **Adicionar Banner**
2. Faça upload da imagem (recomendado: 1200x400px)
3. ✅ **IMPORTANTE:** Ative o banner (is_active = true)
4. Defina a ordem de exibição
5. Clique em **Salvar**

✅ **Banner aparecerá no carrossel da home!**

---

#### **🏢 ADICIONAR MARCA**

1. Acesse: **Marcas** → **Adicionar Marca**
2. Faça upload do logotipo (fundo transparente recomendado)
3. ✅ **IMPORTANTE:** Ative a marca
4. Defina a ordem
5. Clique em **Salvar**

✅ **Marca aparecerá na seção de marcas da home!**

---

#### **📂 ADICIONAR CATEGORIA**

1. Acesse: **Categorias** → **Adicionar Categoria**
2. Faça upload da imagem
3. ✅ **IMPORTANTE:** Ative a categoria
4. Defina slug (URL amigável)
5. Clique em **Salvar**

✅ **Categoria aparecerá no grid da home!**

---

### 3️⃣ **VERIFICAR NA HOME**

```
Acesse: https://seu-site.vercel.app/

✅ Abra o Console (F12) para ver logs:
   "✅ 8 produtos carregados"
   "✅ 4 banners carregados"
   etc.
```

---

## 🎯 CHECKLIST RÁPIDO

### **Para produto aparecer na HOME:**
- [ ] ✅ Marcar como **"Produto em Destaque"** (featured = true)
- [ ] ✅ Adicionar pelo menos 1 imagem
- [ ] ✅ Preencher preço
- [ ] ✅ Produto está em estoque (in_stock = true)

### **Para banner aparecer:**
- [ ] ✅ Marcar como **Ativo** (is_active = true)
- [ ] ✅ Upload da imagem feito
- [ ] ✅ Ordem de exibição definida

### **Para marca aparecer:**
- [ ] ✅ Marcar como **Ativa** (is_active = true)
- [ ] ✅ Upload do logotipo feito

### **Para categoria aparecer:**
- [ ] ✅ Marcar como **Ativa** (is_active = true)
- [ ] ✅ Upload da imagem feito
- [ ] ✅ Slug único definido

---

## 🔍 VERIFICAÇÃO RÁPIDA

### **No Console do Navegador (F12):**

```javascript
// Ver conexão
window.supabaseClient

// Forçar atualização
window.homeSupabase.refresh()
```

---

## ❓ PROBLEMAS COMUNS

### **"Produto não aparece na home"**
➡️ Verifique se marcou **"Produto em Destaque"**  
➡️ Verifique se tem imagem adicionada  
➡️ Aguarde 2-3 segundos após salvar

### **"Banner não aparece"**
➡️ Verifique se está **Ativo**  
➡️ Máximo de 4 banners são exibidos  
➡️ Verifique a ordem de exibição

### **"Imagens não carregam"**
➡️ Verifique o formato (JPG, PNG, WebP)  
➡️ Tamanho máximo recomendado: 2MB  
➡️ Aguarde o upload completar antes de salvar

---

## 📊 LIMITES

| Item | Máximo na Home |
|------|----------------|
| Produtos | 8 |
| Banners | 4 |
| Marcas | 9 |
| Categorias | Todas ativas |

---

## 🎉 PRONTO!

Sistema está totalmente integrado.

**Qualquer edição no admin aparece automaticamente na home!**

---

**Documentação completa:** `docs/INTEGRACAO-ADMIN-HOME.md`


