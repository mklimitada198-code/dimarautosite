# 🚀 COMO USAR O SITE DIMAR - GUIA RÁPIDO

**Última Atualização:** 08/12/2024

---

## 📋 ÍNDICE

1. [Iniciando o Servidor Local](#1-iniciando-o-servidor-local)
2. [Acessando o Site](#2-acessando-o-site)
3. [Usando o Painel Administrativo](#3-usando-o-painel-administrativo)
4. [Adicionando Produtos](#4-adicionando-produtos)
5. [Gerenciando Categorias](#5-gerenciando-categorias)
6. [Gerenciando Banners](#6-gerenciando-banners)
7. [Gerenciando Marcas](#7-gerenciando-marcas)
8. [Testando o Supabase](#8-testando-o-supabase)
9. [Solução de Problemas](#9-solução-de-problemas)

---

## 1. INICIANDO O SERVIDOR LOCAL

### **Opção A: Python 3**
```bash
# Abra o terminal na pasta do projeto e execute:
python -m http.server 8000
```

### **Opção B: PowerShell (Windows)**
```powershell
# Ou use este comando alternativo:
python -m http.server 8000
```

### **✅ Servidor Iniciado!**
Você verá a mensagem:
```
Serving HTTP on :: port 8000 (http://[::]:8000/) ...
```

---

## 2. ACESSANDO O SITE

### **Site Principal:**
```
http://localhost:8000/
```

### **Páginas Disponíveis:**
- 🏠 Home: `http://localhost:8000/`
- 📄 Sobre Nós: `http://localhost:8000/pages/sobre-nos.html`
- 📞 Contato: `http://localhost:8000/pages/contato.html`
- 🛍️ Produtos: `http://localhost:8000/pages/produtos.html`
- 🛒 Carrinho: `http://localhost:8000/pages/carrinho.html`
- 🔍 Busca: `http://localhost:8000/pages/busca.html`
- 🏪 Lojas: `http://localhost:8000/pages/lojas.html`

---

## 3. USANDO O PAINEL ADMINISTRATIVO

### **Passo 1: Acesse o Admin**
```
http://localhost:8000/dimaradmin/login.html
```

### **Passo 2: Faça Login**
- **Email:** `admin@dimar.com.br`
- **Senha:** `admin123`

### **Passo 3: Dashboard**
Você será redirecionado para o dashboard onde pode ver:
- 📊 Estatísticas (produtos, categorias, banners, marcas)
- ⚡ Ações rápidas
- 📦 Produtos recentes

---

## 4. ADICIONANDO PRODUTOS

### **Passo 1: Acesse Produtos**
No menu lateral, clique em **"Produtos"** ou vá para:
```
http://localhost:8000/dimaradmin/produtos.html
```

### **Passo 2: Clique em "Adicionar Produto"**

### **Passo 3: Preencha os Dados**

#### **Obrigatórios (*):**
- **Nome do Produto:** Ex: "Pastilha de Freio Cerâmica"
- **SKU:** Ex: "PFC-001"
- **Categoria:** Selecione uma (Motor, Freios, etc.)
- **Preço (R$):** Ex: 149.90
- **Estoque:** Ex: 50
- **Status:** Ativo ou Inativo

#### **Opcionais:**
- **Marca:** Ex: "Bosch"
- **Preço Promocional:** Ex: 129.90 (aparece riscado)
- **Descrição Curta:** Resumo do produto
- **Descrição Completa:** Detalhes técnicos
- **Produto em Destaque:** Marque para destacar
- **Entrega Rápida:** Marque se tem entrega rápida

### **Passo 4: Upload de Imagens**

#### **Método 1 - Drag & Drop:**
1. Arraste as imagens do seu computador
2. Solte na área "Clique ou arraste imagens aqui"
3. Veja a pré-visualização aparecer

#### **Método 2 - Clique:**
1. Clique na área de upload
2. Selecione uma ou mais imagens
3. Veja a pré-visualização

**Importante:**
- ✅ Formatos: PNG, JPG
- ✅ Tamanho máximo: 5MB por imagem
- ✅ Múltiplas imagens permitidas
- ❌ Remova clicando no X sobre a imagem

### **Passo 5: Salve o Produto**
Clique em **"Salvar Produto"**

✅ **Sucesso!** O produto aparecerá na tabela.

---

## 5. GERENCIANDO CATEGORIAS

### **Passo 1: Acesse Categorias**
```
http://localhost:8000/dimaradmin/categorias.html
```

### **Passo 2: Adicionar Nova Categoria**

1. Clique em **"Adicionar Categoria"**
2. Preencha:
   - **Nome:** Ex: "Suspensão"
   - **Slug:** Gerado automaticamente (ex: suspensao)
   - **Descrição:** Ex: "Peças de suspensão automotiva"
   - **Status:** Ativa
3. Clique em **"Salvar"**

### **Dica:** O slug é gerado automaticamente ao digitar o nome!

---

## 6. GERENCIANDO BANNERS

### **Passo 1: Acesse Banners**
```
http://localhost:8000/dimaradmin/banners.html
```

### **Passo 2: Adicionar Novo Banner**

1. Clique em **"Adicionar Banner"**
2. Preencha:
   - **Título:** Ex: "Promoção Black Friday"
   - **Imagem:** Upload (drag & drop ou clique)
   - **Link:** Ex: `#black-friday`
   - **Ordem:** Ex: 1 (primeiro banner)
   - **Status:** Ativo
3. Clique em **"Salvar"**

**Importante:**
- ✅ Tamanho máximo: 5MB
- ✅ Dimensões recomendadas: 1920x600px
- ✅ A ordem define qual banner aparece primeiro

---

## 7. GERENCIANDO MARCAS

### **Passo 1: Acesse Marcas**
```
http://localhost:8000/dimaradmin/marcas.html
```

### **Passo 2: Adicionar Nova Marca**

1. Clique em **"Adicionar Marca"**
2. Preencha:
   - **Nome:** Ex: "Continental"
   - **Logo:** Upload (PNG com fundo transparente)
   - **Status:** Ativa
3. Clique em **"Salvar"**

**Importante:**
- ✅ Tamanho máximo: 2MB
- ✅ Formato recomendado: PNG transparente
- ✅ Dimensões recomendadas: 200x100px

---

## 8. TESTANDO O SUPABASE

### **Passo 1: Acesse a Página de Teste**
```
http://localhost:8000/test-supabase.html
```

### **Passo 2: Teste a Conexão**
1. Clique no botão **"Testar Conexão"**
2. Deve aparecer: **"✅ Conectado com sucesso!"**

### **Passo 3: Busque os Produtos**
1. Clique no botão **"Buscar Produtos"**
2. Deve listar os 10 produtos cadastrados no banco

### **Passo 4: Verifique o Console**
1. Pressione **F12** (DevTools)
2. Vá na aba **Console**
3. Deve aparecer:
   ```
   ✅ Supabase conectado com sucesso!
   ✅ Products Service inicializado!
   ```

---

## 9. SOLUÇÃO DE PROBLEMAS

### **❌ Erro: "Página não encontrada"**

**Causa:** Servidor não está rodando ou caminho errado.

**Solução:**
1. Verifique se o servidor está rodando:
   ```bash
   python -m http.server 8000
   ```
2. Certifique-se de estar na pasta raiz do projeto
3. Acesse: `http://localhost:8000/`

---

### **❌ Erro: "Supabase não conectado"**

**Causa:** Credenciais não configuradas ou incorretas.

**Solução:**
1. Verifique o arquivo `js/supabase-config.js`
2. Confirme que a URL e ANON_KEY estão corretas:
   ```javascript
   const SUPABASE_URL = 'https://rkhnhdlctkgamaxmfxsr.supabase.co';
   const SUPABASE_ANON_KEY = 'eyJ...';
   ```

---

### **❌ Badge do carrinho não atualiza**

**Causa:** Scripts não carregaram na ordem correta.

**Solução:**
1. Limpe o cache do navegador:
   - **Chrome/Edge:** `Ctrl + Shift + R`
   - **Firefox:** `Ctrl + F5`
2. Recarregue a página

---

### **❌ Imagens não aparecem**

**Causa:** Caminho da imagem incorreto.

**Solução:**
1. Verifique se a imagem está em `assets/images/`
2. Confirme o nome do arquivo
3. Use caminho relativo correto:
   - Root: `assets/images/logo.png`
   - Subpasta: `../assets/images/logo.png`

---

### **❌ Admin não salva produtos**

**Causa:** Supabase não conectado, usando localStorage.

**Solução:**
1. Verifique a conexão do Supabase (Passo 8)
2. Se está em modo fallback (localStorage):
   - Os dados ficam salvos localmente
   - Não aparecem no banco de dados
   - Útil para testes offline

---

### **❌ Links quebrados entre páginas**

**Causa:** Navegação incorreta entre root e subpastas.

**Solução:**
1. O arquivo `js/navigation-fix.js` já corrige automaticamente
2. Se ainda houver problema, limpe o cache
3. Certifique-se de que os scripts estão carregando:
   ```html
   <script src="../js/navigation-fix.js"></script>
   <script src="../js/templates.js"></script>
   ```

---

## ✅ CHECKLIST RÁPIDO

### **Para Testar o Site:**
- [ ] Servidor rodando em `http://localhost:8000/`
- [ ] Home carrega corretamente
- [ ] Navegação funciona (todas as páginas)
- [ ] Carrinho adiciona produtos
- [ ] Busca retorna resultados
- [ ] Header e Footer aparecem

### **Para Testar o Admin:**
- [ ] Login funciona (`admin@dimar.com.br` / `admin123`)
- [ ] Dashboard mostra estatísticas
- [ ] Adicionar produto funciona
- [ ] Upload de imagens funciona
- [ ] Editar produto funciona
- [ ] Excluir produto funciona
- [ ] Categorias, Banners e Marcas funcionam

### **Para Testar o Supabase:**
- [ ] `test-supabase.html` carrega
- [ ] Botão "Testar Conexão" → Sucesso
- [ ] Botão "Buscar Produtos" → Lista produtos
- [ ] Console (F12) → Sem erros

---

## 🎯 DICAS PROFISSIONAIS

### **1. Sempre Teste no Console (F12)**
O console mostra erros e logs úteis:
```javascript
✅ Supabase conectado com sucesso!
✅ Products Service inicializado!
✅ Carrinho atualizado: 3 itens
```

### **2. Use o Logger**
O site tem um sistema de logs customizado:
```javascript
logger.log('Minha mensagem de debug');
```

### **3. Limpe o Cache Regularmente**
- **Chrome/Edge:** `Ctrl + Shift + R`
- **Firefox:** `Ctrl + F5`
- Ou abra DevTools → Application → Clear Storage

### **4. Verifique os Links**
Consulte `docs/NAVEGACAO-COMPLETA.md` para ver todos os links do site.

### **5. Consulte a Documentação**
- `docs/memory.md` → Histórico de mudanças
- `docs/ADMIN-PANEL-COMPLETO.md` → Guia do admin
- `docs/INTEGRACAO-COMPLETA.md` → Visão geral
- `docs/GUIA-SUPABASE.md` → Setup do Supabase

---

## 📞 PRECISA DE AJUDA?

### **Documentação Completa:**
Veja a pasta `docs/` para guias detalhados.

### **Logs e Debug:**
1. Pressione `F12` para abrir DevTools
2. Vá na aba "Console"
3. Procure por mensagens de erro (vermelho)
4. Mensagens de sucesso aparecem em verde

---

**🎉 PRONTO! VOCÊ JÁ PODE USAR O SITE COMPLETO!**

---

**Última Atualização:** 08/12/2024 | **Versão:** 1.0.0

