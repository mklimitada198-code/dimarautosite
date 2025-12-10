# 📖 Guia Rápido - Área Admin Dimar

## 🚀 Início Rápido

### Acessar
```
http://localhost:8000/dimaradmin/login.html
```

**Login**:
- Email: `admin@dimar.com.br`
- Senha: `admin123`

---

## 📋 Funcionalidades

### Dashboard
- Ver estatísticas gerais
- Acessar ações rápidas
- Ver produtos recentes

### Produtos
- **Adicionar**: Botão verde "➕ Adicionar Produto"
- **Imagens**: Arraste e solte (drag & drop)
- **Editar**: Botão ✏️ na linha do produto
- **Excluir**: Botão 🗑️ (pede confirmação)
- **Buscar**: Campo de busca no topo
- **Filtrar**: Por categoria e status

### Categorias
- **Adicionar**: Botão "➕ Adicionar Categoria"
- **Slug**: Gerado automaticamente do nome
- **Editar/Excluir**: Botões na tabela

### Banners
- **Upload**: Arraste imagem do carrossel
- **Ordem**: Define ordem de exibição
- **Status**: Ativo/Inativo

### Marcas
- **Logo**: Upload de logo PNG transparente
- **Gerenciar**: CRUD completo

---

## 💡 Dicas

1. **Imagens**: Use drag & drop para facilitar
2. **Slug**: Deixe auto-gerar em categorias
3. **Status**: Desative itens em vez de excluir
4. **Ordem**: Use números para ordenar banners
5. **Dados**: Começam vazios, adicione exemplos

---

## ⚡ Atalhos

- **Sidebar**: Clique no ☰ para colapsar
- **Logout**: Clique no avatar no topo
- **Refresh**: Botão 🔄 no dashboard
- **Cancelar**: ESC fecha modals

---

## 🆘 Problemas Comuns

**Stats em 0?**  
→ Normal, adicione dados primeiro

**Imagem não envia?**  
→ Verifique tamanho (máx 5MB)

**Login não entra?**  
→ Limpe cache do navegador

**Modal não abre?**  
→ Recarregue a página

---

## 📁 Estrutura de Dados

### Produto
- Nome, SKU, Categoria
- Preço, Preço Promocional
- Estoque, Status
- Imagens (múltiplas)
- Descrições

### Categoria
- Nome, Slug
- Descrição, Status

### Banner
- Título, Imagem
- Link, Ordem, Status

### Marca
- Nome, Logo, Status

---

## 🔄 Workflow Típico

1. Login no admin
2. Ver dashboard
3. Adicionar categorias primeiro
4. Adicionar produtos
5. Upload de banners
6. Adicionar marcas parceiras
7. Testar no site principal

---

**Dúvidas?** Veja `walkthrough.md` completo!
