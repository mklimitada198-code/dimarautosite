# ✅ CHECKLIST: NOVO COMPONENTE

**Use este checklist toda vez que criar um novo componente UI no projeto.**

---

## 🎨 DESIGN E ESTRUTURA

### Planejamento
- [ ] Objetivo do componente definido
- [ ] Design/mockup disponível (se aplicável)
- [ ] Variações identificadas (normal, hover, active, disabled)
- [ ] Estados identificados (loading, error, success)
- [ ] Responsividade planejada

### HTML
- [ ] Estrutura semântica adequada
- [ ] Classes seguem padrão BEM modificado
- [ ] Container principal `.component-name`
- [ ] Elementos filhos `.component-name-element`
- [ ] Modificadores `.component-name--variant`
- [ ] IDs únicos (se necessário)
- [ ] Atributos `data-*` para JavaScript (se necessário)

---

## 🎨 CSS

### Estilos Base
- [ ] Seção comentada no CSS (`/* ==================== Component Name ==================== */`)
- [ ] Estilos do componente base
- [ ] Estilos dos elementos internos
- [ ] Hover states definidos
- [ ] Focus states visíveis
- [ ] Active states (se aplicável)
- [ ] Disabled states (se aplicável)
- [ ] Transições suaves

### Organização CSS
- [ ] Propriedades em ordem padrão:
  - [ ] Positioning
  - [ ] Display & Box Model
  - [ ] Typography
  - [ ] Visual
  - [ ] Misc (transitions, animations)
- [ ] Valores usando variáveis CSS (quando apropriado)
- [ ] Cores da paleta do projeto
- [ ] Espaçamentos consistentes

### Responsividade
- [ ] Mobile First approach
- [ ] Breakpoints definidos:
  - [ ] Mobile (< 480px)
  - [ ] Tablet (768px)
  - [ ] Desktop (992px, 1200px)
- [ ] Funciona bem em todas as resoluções
- [ ] Não causa scroll horizontal
- [ ] Touch targets ≥ 44x44px em mobile

---

## ⚡ JAVASCRIPT

### Funcionalidade
- [ ] Seletores cacheados (não repetir `querySelector`)
- [ ] Event listeners adicionados corretamente
- [ ] Event listeners removidos quando necessário (cleanup)
- [ ] Funções com nomes descritivos
- [ ] Código comentado onde necessário
- [ ] Tratamento de erros (try/catch se necessário)
- [ ] Sem `console.log()` desnecessários

### Performance
- [ ] Debounce/throttle em eventos frequentes (scroll, resize)
- [ ] Delegation de eventos quando apropriado
- [ ] Não causa reflow/repaint excessivo
- [ ] Animações usando CSS (não JS quando possível)

---

## ♿ ACESSIBILIDADE

### Semântica
- [ ] Elementos semânticos (`<button>`, `<nav>`, `<input>`, etc.)
- [ ] `<button>` para ações (não `<div>` clicável)
- [ ] `<a>` para navegação (não `<button>`)
- [ ] Heading hierarchy correta (se aplicável)

### ARIA
- [ ] `aria-label` em ícones sem texto
- [ ] `aria-labelledby` em seções (se aplicável)
- [ ] `aria-expanded` em toggles/dropdowns
- [ ] `aria-hidden="true"` em ícones decorativos
- [ ] `aria-live` em conteúdo dinâmico (se aplicável)
- [ ] `role` apropriado (se necessário)

### Navegação
- [ ] Navegável por teclado (Tab)
- [ ] Focus visível (outline ou alternativa)
- [ ] Ordem de foco lógica
- [ ] Esc fecha modals/dropdowns (se aplicável)
- [ ] Enter ativa botões/links

### Contraste
- [ ] Contraste de texto ≥ 4.5:1 (normal)
- [ ] Contraste de texto ≥ 3:1 (grande/negrito)
- [ ] Contraste de elementos interativos ≥ 3:1
- [ ] Estados (hover, focus) mantêm contraste adequado

---

## 🔄 VARIAÇÕES E ESTADOS

### Variações (Modificadores)
- [ ] Variações implementadas (se necessário):
  - [ ] Tamanhos (small, medium, large)
  - [ ] Cores (primary, secondary, danger, success)
  - [ ] Estilos (outline, ghost, solid)
- [ ] Classes modificadoras seguem padrão `--variant`
- [ ] Documentadas em `componentes.md`

### Estados
- [ ] Estado normal (default)
- [ ] Estado hover
- [ ] Estado focus
- [ ] Estado active/pressed
- [ ] Estado disabled (se aplicável)
- [ ] Estado loading (se aplicável)
- [ ] Estado error (se aplicável)
- [ ] Estado success (se aplicável)

---

## 🧩 REUSABILIDADE

### Componente Independente
- [ ] Funciona isoladamente
- [ ] Não depende de contexto específico
- [ ] Aceita customizações via classes/modificadores
- [ ] Pode ser reutilizado em diferentes páginas
- [ ] Estilos não vazam para fora do componente
- [ ] Estilos externos não afetam o componente

### Parâmetros/Props (se dinâmico)
- [ ] Parâmetros documentados
- [ ] Valores padrão definidos
- [ ] Validação de entrada (se necessário)

---

## 🧪 TESTES

### Funcionalidade
- [ ] Componente renderiza corretamente
- [ ] Interações funcionam (cliques, hover, etc.)
- [ ] Transições/animações suaves
- [ ] Estados mudam corretamente
- [ ] Comportamento esperado em edge cases

### Navegadores
- [ ] Chrome
- [ ] Firefox
- [ ] Safari
- [ ] Edge
- [ ] Sem erros no console

### Dispositivos
- [ ] Desktop
- [ ] Tablet
- [ ] Mobile
- [ ] Touch funciona (se aplicável)

### Acessibilidade
- [ ] Testado com leitor de tela (NVDA, JAWS ou VoiceOver)
- [ ] Testado apenas com teclado
- [ ] WAVE (sem erros críticos)
- [ ] Lighthouse Accessibility > 95

---

## 📊 PERFORMANCE

### Otimização
- [ ] CSS minimalista (sem propriedades desnecessárias)
- [ ] JavaScript otimizado
- [ ] Sem memory leaks (event listeners limpos)
- [ ] Animações usando `transform` e `opacity` (GPU)
- [ ] Imagens otimizadas (se aplicável)
- [ ] Lazy loading (se aplicável)

### Métricas
- [ ] Não degrada performance da página
- [ ] Lighthouse Performance não afetado negativamente
- [ ] Tempo de renderização aceitável

---

## 📝 DOCUMENTAÇÃO

### Código
- [ ] Comentários em seções complexas
- [ ] JSDoc em funções JavaScript (se necessário)
- [ ] Comentários CSS em seções do componente

### Arquivos de Documentação
- [ ] Componente adicionado em `docs/componentes.md`:
  - [ ] Descrição
  - [ ] HTML exemplo
  - [ ] CSS principal
  - [ ] JavaScript (se aplicável)
  - [ ] Características
  - [ ] Variações
  - [ ] Estados
  - [ ] Responsividade
- [ ] Decisões importantes em `docs/decisions.md`
- [ ] Atualizado `docs/memory.md` com progresso

---

## 🎨 VISUAL

### Alinhamento com Design System
- [ ] Cores da paleta do projeto
- [ ] Tipografia consistente (fonte, tamanhos, pesos)
- [ ] Espaçamentos padronizados
- [ ] Border-radius consistente
- [ ] Sombras consistentes
- [ ] Ícones do mesmo conjunto
- [ ] Animações com timing consistente (0.3s ease padrão)

### Qualidade Visual
- [ ] Alinhamento pixel-perfect
- [ ] Espaçamentos uniformes
- [ ] Ícones/imagens centralizados
- [ ] Sem texto cortado
- [ ] Sem elementos sobrepostos

---

## 🚀 INTEGRAÇÃO

### No Projeto
- [ ] Componente integrado em página de exemplo
- [ ] Testado em contexto real
- [ ] Não quebra outros componentes
- [ ] Estilos não conflitam com existentes
- [ ] JavaScript não conflita com scripts existentes

---

## ✅ APROVAÇÃO

- [ ] Design aprovado
- [ ] Funcionalidade aprovada
- [ ] Performance aceitável
- [ ] Acessibilidade verificada
- [ ] Documentação completa
- [ ] Pronto para uso em produção

---

**Componente:** ________________  
**Data de Criação:** ___/___/______  
**Criado por:** ________________  
**Revisado por:** ________________  
**Status:** ⬜ Em Desenvolvimento | ⬜ Em Revisão | ⬜ Aprovado

---

## 📌 NOTAS

_Use este espaço para anotações específicas deste componente:_

---

**Última Atualização:** 07/12/2024  
**Versão:** 1.0
