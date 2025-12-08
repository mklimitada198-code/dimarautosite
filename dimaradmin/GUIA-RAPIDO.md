# 🚀 GUIA RÁPIDO - Painel Admin Dimar

## ⚡ Como Começar (3 passos)

### 1️⃣ Acessar o Painel
```
http://localhost:8000/dimaradmin/login.html
```

### 2️⃣ Fazer Login
- **Email:** admin@dimar.com.br
- **Senha:** admin123

### 3️⃣ Começar a Usar!
Você verá o Dashboard com 4 botões principais.

---

## 📦 ADICIONAR PRODUTOS

### Passo a Passo:

1. **Clique em "Produtos"** no menu lateral
2. **Clique em "➕ Adicionar Produto"**
3. **Preencha os dados:**
   - **Imagens:** Clique ou arraste fotos do produto
   - **Nome:** Ex: "Filtro de Óleo Mann W950"
   - **SKU:** Ex: "FO-W950-001"
   - **Categoria:** Escolha (Motor, Freios, etc)
   - **Marca:** Ex: "Mann Filter"
   - **Preço:** Ex: 45.90
   - **Preço Promocional:** (opcional) Ex: 39.90
   - **Estoque:** Ex: 50
   - **Status:** Ativo
   - **Descrição Curta:** Breve resumo
   - **Descrição Completa:** Detalhes técnicos
   - ✅ **Produto em Destaque** (se quiser destacar)
   - ✅ **Entrega Rápida** (se tiver estoque rápido)

4. **Clique em "Salvar Produto"**

✅ **Pronto!** O produto aparece na lista.

---

## 🏷️ GERENCIAR CATEGORIAS

### Categorias do Menu (7 fixas):
- Motor, Freios, Suspensão, Elétrica, Filtros, Iluminação, Acessórios
- **Não precisa adicionar**, já estão prontas!

### Categorias com Imagem (Carrossel):

1. **Clique em "Categorias"** no menu
2. **Role até "Categorias com Imagens"**
3. **Clique em "➕ Adicionar Categoria com Imagem"**
4. **Preencha:**
   - **Imagem:** Escolha foto da categoria
   - **Nome:** Ex: "Peças para Carros"
   - **Link:** Ex: "#pecas-carros"
   - ✅ **Categoria Ativa**
5. **Clique em "Salvar"**

---

## 🎨 GERENCIAR BANNERS

### Para trocar os banners do topo do site:

1. **Clique em "Banners"** no menu
2. **Clique em "➕ Adicionar Banner"**
3. **Preencha:**
   - **Imagem:** Upload do banner (1920x600px recomendado)
   - **Título:** (opcional) Ex: "Promoção de Verão"
   - **Descrição:** (opcional) Ex: "Até 50% OFF"
   - **Link:** (opcional) Ex: "#promocoes"
   - **Ordem:** 0, 1, 2... (ordem de exibição)
   - ✅ **Banner Ativo**
4. **Clique em "Salvar"**

💡 **Dica:** Use ordem 0, 1, 2 para controlar sequência.

---

## ⭐ GERENCIAR MARCAS PARCEIRAS

### Para adicionar logos de marcas:

1. **Clique em "Marcas"** no menu
2. **Clique em "➕ Adicionar Marca"**
3. **Preencha:**
   - **Logo:** Upload do logo (PNG transparente ideal)
   - **Nome:** Ex: "Ford"
   - **Link:** (opcional) Ex: "https://ford.com"
   - **Ordem:** 0, 1, 2...
   - ✅ **Marca Ativa**
4. **Clique em "Salvar"**

---

## 🔍 BUSCAR E FILTRAR

### Na página de Produtos:

- **Buscar:** Digite nome, SKU ou descrição
- **Filtrar por Categoria:** Selecione no dropdown
- **Filtrar por Status:** Ativo ou Inativo

---

## ✏️ EDITAR OU EXCLUIR

### Em qualquer listagem:

- **Editar:** Clique no botão **✏️** amarelo
- **Excluir:** Clique no botão **🗑️** vermelho (confirmar)

---

## 💾 ONDE OS DADOS FICAM SALVOS?

### Sem Supabase (padrão):
- Os dados ficam salvos no **navegador** (localStorage)
- ⚠️ **Limpar histórico = perder dados**
- ✅ Funciona offline
- ❌ Não compartilha entre computadores

### Com Supabase (recomendado):
- Os dados ficam em **banco de dados real**
- ✅ Acesso de qualquer lugar
- ✅ Backup automático
- ✅ Múltiplos usuários
- 📖 Ver `README.md` para configurar

---

## 🎯 ATALHOS ÚTEIS

| Ação | Atalho |
|------|--------|
| Adicionar Produto | Dashboard → "➕ Adicionar Produto" |
| Ver Todos os Produtos | Menu → Produtos |
| Trocar Banner | Menu → Banners → Editar |
| Adicionar Logo | Menu → Marcas → Adicionar |
| Sair | Clique no nome no topo → Confirmar |

---

## ❓ PROBLEMAS COMUNS

### ❌ "Supabase ainda não configurado"
**Solução:** Isso é normal! Funciona com localStorage. Se quiser Supabase, veja `README.md`.

### ❌ Imagem não aparece
**Solução:** 
1. Imagem muito grande? Tente até 5MB
2. Formato suportado? Use PNG ou JPG

### ❌ Perdi os dados
**Solução:** Se usou localStorage e limpou cache, os dados foram perdidos. Configure Supabase!

### ❌ Não consigo fazer login
**Solução:** 
1. Confirme email: `admin@dimar.com.br`
2. Confirme senha: `admin123`
3. Se mudou, use as credenciais corretas

---

## 📞 PRÓXIMOS PASSOS

1. ✅ **Testar todas as funcionalidades**
2. ✅ **Adicionar alguns produtos de teste**
3. ✅ **Trocar os banners**
4. ⏩ **Configurar Supabase** (ver README.md)
5. ⏩ **Criar senha própria**
6. ⏩ **Integrar com site principal**

---

## 🎉 TUDO PRONTO!

Seu painel está **100% funcional** e pronto para usar!

**Qualquer dúvida, consulte o `README.md` completo.**

---

**Desenvolvido para Dimar - Auto Peças & Moto Peças** 🚗🏍️

