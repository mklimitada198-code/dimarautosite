# 🚀 GUIA DE DEPLOY NO VERCEL - PROJETO DIMAR

**Data:** 08/12/2024  
**Status:** ✅ CONFIGURADO E PRONTO  
**Versão:** 1.0

---

## 📋 ÍNDICE

1. [Visão Geral](#visão-geral)
2. [Pré-requisitos](#pré-requisitos)
3. [Configuração do Supabase](#configuração-do-supabase)
4. [Deploy no Vercel](#deploy-no-vercel)
5. [Configuração de Rotas](#configuração-de-rotas)
6. [Variáveis de Ambiente](#variáveis-de-ambiente)
7. [Testes Pós-Deploy](#testes-pós-deploy)
8. [Troubleshooting](#troubleshooting)

---

## 🎯 VISÃO GERAL

### O que foi configurado:

✅ **vercel.json** - Configuração completa de rotas  
✅ **navigation-fix.js** - Funciona local e produção  
✅ **Templates** - Paths absolutos para produção  
✅ **Supabase** - Credenciais configuradas  
✅ **Admin Panel** - Integrado com Supabase

---

## 📦 PRÉ-REQUISITOS

### 1. Conta no Vercel
- Acesse: https://vercel.com
- Conecte com GitHub/GitLab/Bitbucket
- Ou use Vercel CLI

### 2. Conta no Supabase
- Acesse: https://supabase.com
- Crie um projeto
- Anote URL e ANON_KEY

### 3. Repositório Git
- GitHub, GitLab ou Bitbucket
- Projeto commitado e atualizado

---

## 🗄️ CONFIGURAÇÃO DO SUPABASE

### Credenciais Atuais (JÁ CONFIGURADAS)

```javascript
SUPABASE_URL: 'https://rkhnhdlctkgamaxmfxsr.supabase.co'
SUPABASE_ANON_KEY: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...'
```

**Localização:**
- `js/supabase-config.js`
- `dimaradmin/js/supabase-config.js`

### Como obter suas credenciais:

1. Acesse seu projeto no Supabase
2. Vá em **Settings** → **API**
3. Copie:
   - **Project URL** (SUPABASE_URL)
   - **anon public** (SUPABASE_ANON_KEY)

### Substituir credenciais (se necessário):

```javascript
// Em js/supabase-config.js e dimaradmin/js/supabase-config.js
const SUPABASE_URL = 'SUA_URL_AQUI';
const SUPABASE_ANON_KEY = 'SUA_CHAVE_AQUI';
```

---

## 🚀 DEPLOY NO VERCEL

### Opção 1: Via GitHub (Recomendado)

#### Passo 1: Conectar Repositório
```bash
1. Acesse: https://vercel.com/new
2. Clique em "Import Git Repository"
3. Selecione seu repositório
4. Clique em "Import"
```

#### Passo 2: Configurar Projeto
```
Project Name: dimar-site
Framework Preset: Other
Root Directory: ./
Build Command: (deixe vazio)
Output Directory: (deixe vazio)
```

#### Passo 3: Adicionar Variáveis (Opcional)
```
SUPABASE_URL: https://rkhnhdlctkgamaxmfxsr.supabase.co
SUPABASE_ANON_KEY: sua_chave_aqui
```

#### Passo 4: Deploy
```
Clique em "Deploy"
Aguarde ~2 minutos
```

### Opção 2: Via Vercel CLI

#### Passo 1: Instalar Vercel CLI
```bash
npm install -g vercel
```

#### Passo 2: Login
```bash
vercel login
```

#### Passo 3: Deploy
```bash
# No diretório do projeto
cd DimarSite

# Deploy
vercel

# Ou deploy direto para produção
vercel --prod
```

---

## 🛣️ CONFIGURAÇÃO DE ROTAS

### vercel.json (JÁ CRIADO)

O arquivo `vercel.json` configura:

#### 1. **Rotas Amigáveis**
```
/sobre-nos → /pages/sobre-nos.html
/produtos → /pages/produtos.html
/carrinho → /pages/carrinho.html
/busca → /pages/busca.html
/contato → /pages/contato.html
/lojas → /pages/lojas.html
/admin → /dimaradmin/login.html
```

#### 2. **Aliases**
```
/sobre → /pages/sobre-nos.html
/catalogo → /pages/produtos.html
/cart → /pages/carrinho.html
/search → /pages/busca.html
```

#### 3. **Assets com Cache**
```
/assets/* → Cache de 1 ano
/css/* → Cache de 1 ano
/js/* → Cache de 1 ano
```

#### 4. **Clean URLs**
```
trailingSlash: false
cleanUrls: true
```

### Exemplo de URLs em Produção:

```
✅ https://seu-dominio.vercel.app/
✅ https://seu-dominio.vercel.app/sobre-nos
✅ https://seu-dominio.vercel.app/produtos
✅ https://seu-dominio.vercel.app/carrinho
✅ https://seu-dominio.vercel.app/admin
```

---

## 🔐 VARIÁVEIS DE AMBIENTE

### Configurar no Vercel Dashboard

1. Acesse seu projeto no Vercel
2. Vá em **Settings** → **Environment Variables**
3. Adicione:

```
Name: SUPABASE_URL
Value: https://rkhnhdlctkgamaxmfxsr.supabase.co

Name: SUPABASE_ANON_KEY
Value: sua_chave_aqui
```

### Usar em JavaScript (se necessário)

```javascript
// Acessar variáveis de ambiente
const supabaseUrl = process.env.SUPABASE_URL || 'fallback-url';
const supabaseKey = process.env.SUPABASE_ANON_KEY || 'fallback-key';
```

**Nota:** Como estamos usando frontend puro, as credenciais já estão hardcoded nos arquivos JS. Em produção real, considere usar Edge Functions para proteger chaves sensíveis.

---

## ✅ TESTES PÓS-DEPLOY

### Checklist de Validação

#### 1. **Navegação Geral**
```
□ Home carrega corretamente
□ Menu de navegação funciona
□ Logo clicável redireciona para home
□ Links do header funcionam
□ Links do footer funcionam
□ Barra de busca presente
□ Carrinho acessível
```

#### 2. **Páginas Públicas**
```
□ /sobre-nos carrega
□ /produtos carrega
□ /produto carrega (teste individual)
□ /carrinho carrega
□ /busca carrega
□ /contato carrega
□ /lojas carrega
```

#### 3. **Admin Panel**
```
□ /admin redireciona para login
□ /dimaradmin/login carrega
□ Login funciona (teste com credenciais)
□ Dashboard carrega após login
□ CRUD de produtos funciona
□ CRUD de categorias funciona
□ CRUD de banners funciona
□ CRUD de marcas funciona
```

#### 4. **Assets e Recursos**
```
□ Logo carrega
□ Banners carregam
□ Imagens de produtos carregam
□ CSS aplicado corretamente
□ JavaScript executa
□ Fonte Inter carregando (Google Fonts)
```

#### 5. **Funcionalidades**
```
□ Carrossel de banners funciona
□ Filtro de veículos funciona
□ Busca retorna resultados
□ Adicionar ao carrinho funciona
□ Carrinho persiste (localStorage)
□ Cupons de desconto funcionam
□ Newsletter (submit teste)
```

#### 6. **Supabase**
```
□ Conexão estabelecida
□ Produtos carregam do banco
□ Admin consegue criar/editar
□ Imagens fazem upload
□ Dados persistem
```

#### 7. **Performance**
```
□ PageSpeed > 80 (mobile)
□ PageSpeed > 90 (desktop)
□ Lighthouse Performance > 80
□ First Contentful Paint < 2s
□ Time to Interactive < 3.5s
```

#### 8. **Responsividade**
```
□ Mobile (375px) - OK
□ Tablet (768px) - OK
□ Desktop (1200px) - OK
□ Large Desktop (1920px) - OK
```

#### 9. **SEO**
```
□ Meta tags presentes
□ Open Graph configurado
□ Twitter Card configurado
□ Sitemap acessível
□ Robots.txt presente
```

### Como Testar:

#### Teste Manual
```bash
1. Abra o site em produção
2. Navegue por todas as páginas
3. Teste todas as funcionalidades
4. Verifique console do navegador (F12)
5. Valide erros 404
```

#### Teste Automatizado (Lighthouse)
```bash
1. Abra DevTools (F12)
2. Vá em "Lighthouse"
3. Selecione todas categorias
4. Clique em "Generate report"
5. Analise resultados
```

#### Teste de Rotas
```bash
# Teste manual de URLs
https://seu-dominio.vercel.app/
https://seu-dominio.vercel.app/sobre-nos
https://seu-dominio.vercel.app/produtos
https://seu-dominio.vercel.app/carrinho
https://seu-dominio.vercel.app/admin
```

---

## 🐛 TROUBLESHOOTING

### Problema: Página 404

**Sintomas:**
```
Acessar /sobre-nos retorna 404
```

**Solução:**
```bash
1. Verifique vercel.json está na raiz
2. Redeploy o projeto
3. Limpe cache do Vercel:
   - Dashboard → Deployments
   - ... (três pontos) → Redeploy
   - Marque "Use existing Build Cache" como OFF
```

---

### Problema: Assets não carregam

**Sintomas:**
```
Imagens, CSS ou JS não aparecem
Console mostra 404 para assets
```

**Solução:**
```javascript
// Verifique paths nos templates
// Devem ser absolutos: /assets/... não assets/...

// ❌ ERRADO
<img src="assets/images/logo.png">

// ✅ CORRETO
<img src="/assets/images/logo.png">
```

---

### Problema: Navigation-fix não funciona

**Sintomas:**
```
Links relativos quebrados
Menu não navega corretamente
```

**Solução:**
```javascript
// Verifique se navigation-fix.js está sendo carregado
// Deve estar antes de </body> em todas as páginas

// Verificar no console:
console.log('Navigation fixed:', window.location.pathname);
```

---

### Problema: Supabase não conecta

**Sintomas:**
```
Console: "Supabase não configurado"
Admin não salva dados
```

**Solução:**
```javascript
// Verifique credenciais em:
// js/supabase-config.js
// dimaradmin/js/supabase-config.js

// Devem ser iguais e válidas
const SUPABASE_URL = 'https://rkhnhdlctkgamaxmfxsr.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...';
```

---

### Problema: Admin login não funciona

**Sintomas:**
```
Login retorna erro
Credenciais não aceitas
```

**Solução:**
```javascript
// Verifique checkSupabaseConfig() em:
// dimaradmin/js/supabase-config.js

// Deve retornar true para usar Supabase
function checkSupabaseConfig() {
    // Remover ou comentar linha que retorna false
    // return false; // ❌ REMOVER ISSO
    
    // Verificar configuração real
    return SUPABASE_URL && SUPABASE_ANON_KEY;
}
```

---

### Problema: Build falha no Vercel

**Sintomas:**
```
Deploy falha com erro
Build não completa
```

**Solução:**
```bash
# Verificar vercel.json syntax
# Use JSON Validator online

# Verificar se há erros no código
# Rodar localmente antes:
python -m http.server 8000
# Testar tudo localmente primeiro
```

---

## 📊 CHECKLIST FINAL PRÉ-PRODUÇÃO

### Antes de colocar no ar:

```
✅ vercel.json criado e configurado
✅ Templates com paths absolutos
✅ navigation-fix.js atualizado
✅ Supabase configurado
✅ Credenciais corretas
✅ Testes locais passando
✅ Build sem erros
✅ Assets otimizados
✅ Meta tags completas
✅ Analytics configurado (opcional)
✅ Domínio personalizado (opcional)
✅ SSL ativo (Vercel faz automático)
✅ Backup do código no Git
✅ Documentação atualizada
```

---

## 🔗 LINKS ÚTEIS

### Vercel
- Dashboard: https://vercel.com/dashboard
- Docs: https://vercel.com/docs
- CLI: https://vercel.com/docs/cli

### Supabase
- Dashboard: https://app.supabase.com
- Docs: https://supabase.com/docs
- API: https://supabase.com/docs/reference/javascript/introduction

### Ferramentas de Teste
- PageSpeed: https://pagespeed.web.dev/
- GTmetrix: https://gtmetrix.com/
- Lighthouse: Chrome DevTools (F12)

---

## 📞 SUPORTE

### Problemas com Deploy?

1. **Verifique logs no Vercel Dashboard**
   - Deployments → Selecione deploy → View Function Logs

2. **Teste localmente primeiro**
   ```bash
   python -m http.server 8000
   ```

3. **Limpe cache do Vercel**
   - Dashboard → Settings → Advanced → Clear Cache

4. **Redeploy forçado**
   ```bash
   vercel --prod --force
   ```

---

## 🎉 DEPLOY CONCLUÍDO!

### Seu site está online em:
```
https://seu-projeto.vercel.app
```

### Próximos passos:
1. ✅ Teste todas as funcionalidades
2. ✅ Configure domínio personalizado (opcional)
3. ✅ Configure analytics (opcional)
4. ✅ Monitore performance
5. ✅ Atualize conteúdo via Admin Panel

---

**📌 Última Atualização:** 08/12/2024  
**📊 Versão:** 1.0  
**🎯 Status:** ✅ PRONTO PARA PRODUÇÃO

> **Nota:** Este documento deve ser atualizado sempre que houver mudanças na infraestrutura ou configuração do projeto.


