# ✅ CHECKLIST: NOVA PÁGINA

**Use este checklist toda vez que criar uma nova página no projeto.**

---

## 📄 ESTRUTURA HTML

### Head
- [ ] `<meta charset="UTF-8">` presente
- [ ] `<meta name="viewport">` configurado para mobile
- [ ] `<title>` descritivo e único (50-60 caracteres)
- [ ] `<meta name="description">` presente (150-160 caracteres)
- [ ] Link para `css/style.css`
- [ ] Link para `js/script.js` com `defer`
- [ ] Favicon configurado
- [ ] Open Graph tags (og:title, og:description, og:image, og:url)
- [ ] Twitter Card tags
- [ ] Canonical URL definido

### Body
- [ ] Estrutura semântica correta (`<header>`, `<nav>`, `<main>`, `<footer>`)
- [ ] Header reutilizado (logo, busca, navegação)
- [ ] Footer reutilizado (links, contato, newsletter)
- [ ] Breadcrumbs adicionados (se aplicável)
- [ ] Conteúdo principal dentro de `<main>`
- [ ] Headings em ordem correta (h1 → h2 → h3)
- [ ] Apenas UM `<h1>` por página

---

## 🎨 CSS

### Estilos
- [ ] Classes seguem padrão BEM modificado
- [ ] Nomes de classes descritivos
- [ ] Estilos específicos da página em seção separada no CSS
- [ ] Hover states definidos para elementos interativos
- [ ] Focus states visíveis para acessibilidade
- [ ] Transições suaves (0.3s ease padrão)
- [ ] Cores usando variáveis CSS ou palette definida
- [ ] Espaçamentos consistentes com o projeto

### Responsividade
- [ ] Mobile First approach seguido
- [ ] Testado em 320px (mobile pequeno)
- [ ] Testado em 375px (iPhone padrão)
- [ ] Testado em 768px (tablet)
- [ ] Testado em 1024px (desktop pequeno)
- [ ] Testado em 1366px (laptop)
- [ ] Testado em 1920px (desktop Full HD)
- [ ] Sem scroll horizontal em nenhuma resolução
- [ ] Imagens responsivas (max-width: 100%)
- [ ] Textos legíveis em todos os tamanhos
- [ ] Botões têm tamanho mínimo de 44x44px em mobile

---

## ⚡ JAVASCRIPT

### Funcionalidade
- [ ] Scripts carregados com `defer` ou `async` (quando apropriado)
- [ ] Event listeners adicionados corretamente
- [ ] Sem erros no console do navegador
- [ ] Variáveis com nomes descritivos (camelCase)
- [ ] Funções documentadas (comentários)
- [ ] Código organizado e legível
- [ ] Sem `console.log()` desnecessários
- [ ] Validação de formulários (se aplicável)

---

## ♿ ACESSIBILIDADE

### Estrutura
- [ ] Todos `<img>` têm atributo `alt` descritivo
- [ ] Links descritivos (evitar "clique aqui")
- [ ] Botões têm `aria-label` quando ícones sem texto
- [ ] Formulários têm `<label>` associados
- [ ] Contraste de cores mínimo 4.5:1 (texto normal)
- [ ] Contraste de cores mínimo 3:1 (texto grande)
- [ ] Navegação por teclado funcional (Tab)
- [ ] Skip links presentes (pular para conteúdo)
- [ ] Estados focus visíveis

### Semântica
- [ ] HTML semântico usado (`<nav>`, `<article>`, `<section>`, etc.)
- [ ] Landmarks ARIA quando necessário
- [ ] Heading hierarchy correta
- [ ] Listas usando `<ul>`/`<ol>` + `<li>`

---

## 🔍 SEO

### On-Page
- [ ] Title único e descritivo
- [ ] Meta description única e atrativa
- [ ] URL amigável (sem IDs numéricos, se possível)
- [ ] H1 contém palavra-chave principal
- [ ] H2-H6 estruturam conteúdo logicamente
- [ ] Imagens otimizadas (WebP ou comprimidas)
- [ ] Atributos `alt` nas imagens com keywords naturais
- [ ] Links internos relevantes
- [ ] Schema.org markup (se aplicável)

### Performance
- [ ] Imagens com `loading="lazy"` (exceto above the fold)
- [ ] Imagens com dimensões definidas (width/height)
- [ ] CSS crítico inline (se necessário)
- [ ] JavaScript não bloqueia renderização
- [ ] Fontes otimizadas (preload, display: swap)

---

## 🧪 TESTES

### Funcionalidade
- [ ] Todos links funcionam
- [ ] Todos botões executam ação esperada
- [ ] Formulários validam corretamente
- [ ] Mensagens de erro/sucesso aparecem
- [ ] Navegação entre páginas funciona
- [ ] Carrosséis/sliders funcionam (se aplicável)
- [ ] Dropdowns/modals abrem e fecham

### Navegadores
- [ ] Testado no Chrome
- [ ] Testado no Firefox
- [ ] Testado no Safari
- [ ] Testado no Edge
- [ ] Sem erros no console em nenhum navegador

### Dispositivos
- [ ] Testado em smartphone real
- [ ] Testado em tablet real (se disponível)
- [ ] Testado com DevTools (modo responsivo)
- [ ] Touch/gestos funcionam em mobile

---

## 📊 VALIDAÇÃO

### Ferramentas
- [ ] HTML validado (W3C Validator)
- [ ] CSS validado (CSS Validator)
- [ ] Lighthouse executado:
  - [ ] Performance > 80
  - [ ] Accessibility > 90
  - [ ] Best Practices > 90
  - [ ] SEO > 90
- [ ] WAVE accessibility check (sem erros críticos)

---

## 📝 DOCUMENTAÇÃO

### Registros
- [ ] Componentes novos documentados em `componentes.md`
- [ ] Decisões importantes registradas em `decisions.md`
- [ ] Progresso atualizado em `memory.md`
- [ ] Timeline atualizada (se marco importante)
- [ ] Comentários no código onde necessário

---

## 🚀 PRÉ-DEPLOY

### Final
- [ ] Conteúdo revisado (sem lorem ipsum)
- [ ] Imagens finais no lugar
- [ ] Links de produção (não localhost)
- [ ] Analytics configurado (se aplicável)
- [ ] Favicon aparece corretamente
- [ ] Open Graph preview testado (Facebook Debugger)
- [ ] Twitter Card preview testado
- [ ] Sem `console.log()` ou código de debug
- [ ] Comentários TODO resolvidos

---

## ✅ APROVAÇÃO FINAL

- [ ] Cliente/Stakeholder aprovou design
- [ ] Conteúdo aprovado
- [ ] Funcionalidades testadas e aprovadas
- [ ] Performance aceitável
- [ ] Pronto para produção

---

**Data de Criação:** ___/___/______  
**Criado por:** ________________  
**Revisado por:** ________________  
**Status:** ⬜ Em Desenvolvimento | ⬜ Em Revisão | ⬜ Aprovado

---

## 📌 NOTAS

_Use este espaço para anotações específicas desta página:_

---

**Última Atualização:** 07/12/2024  
**Versão:** 1.0
