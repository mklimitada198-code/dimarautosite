# ✅ CHECKLIST: NOVA FUNCIONALIDADE

**Use este checklist toda vez que adicionar uma nova funcionalidade ao projeto.**

---

## 🎯 PLANEJAMENTO

### Definição
- [ ] Funcionalidade claramente definida
- [ ] Objetivo/problema que resolve identificado
- [ ] Requisitos listados
- [ ] Casos de uso documentados
- [ ] Fluxo de usuário mapeado
- [ ] Edge cases identificados

### Escopo
- [ ] Escopo bem definido (o que está incluído)
- [ ] Escopo bem definido (o que NÃO está incluído)
- [ ] Dependências identificadas
- [ ] Impacto em funcionalidades existentes avaliado

---

## 💻 IMPLEMENTAÇÃO

### Código
- [ ] Código segue padrões do projeto (`standards.md`)
- [ ] Nomenclatura consistente
- [ ] Código comentado onde necessário
- [ ] Sem código duplicado desnecessário
- [ ] Sem console.log() de debug
- [ ] Variáveis com nomes descritivos
- [ ] Funções pequenas e focadas (Single Responsibility)

### JavaScript
- [ ] Validação de entrada de usuário
- [ ] Tratamento de erros adequado
- [ ] Feedback visual para ações (loading, success, error)
- [ ] Event listeners adicionados corretamente
- [ ] Memory leaks prevenidos (cleanup de listeners)
- [ ] Async/await usado corretamente (se aplicável)
- [ ] Promises tratadas (catch de erros)

### Backend/API (se aplicável)
- [ ] Endpoints documentados
- [ ] Autenticação/autorização implementada
- [ ] Validação server-side
- [ ] Tratamento de erros robusto
- [ ] Logs adequados
- [ ] Rate limiting (se necessário)

---

## 🎨 UI/UX

### Interface
- [ ] Interface intuitiva
- [ ] Feedback visual em todas as ações
- [ ] Estados loading claramente indicados
- [ ] Mensagens de erro claras e úteis
- [ ] Mensagens de sucesso confirmam ação
- [ ] Componentes UI consistentes com design system

### Fluxo de Usuário
- [ ] Fluxo lógico e intuitivo
- [ ] Número mínimo de passos necessários
- [ ] Possibilidade de cancelar/voltar
- [ ] Confirmação para ações destrutivas
- [ ] Dados persistidos quando apropriado

### Responsividade
- [ ] Funciona em mobile
- [ ] Funciona em tablet
- [ ] Funciona em desktop
- [ ] Touch gestures adequados (mobile)
- [ ] Botões têm tamanho adequado para touch (≥44x44px)

---

## 🔐 SEGURANÇA

### Validação
- [ ] Validação client-side implementada
- [ ] Validação server-side implementada (se aplicável)
- [ ] Input sanitizado
- [ ] XSS prevenido
- [ ] SQL Injection prevenido (se aplicável)
- [ ] CSRF protection (se aplicável)

### Dados Sensíveis
- [ ] Senhas nunca expostas (hash)
- [ ] Dados sensíveis não em URLs
- [ ] Dados sensíveis não em localStorage (se críticos)
- [ ] HTTPS usado (em produção)
- [ ] Tokens protegidos

---

## ♿ ACESSIBILIDADE

### Navegação
- [ ] Funcionalidade acessível por teclado
- [ ] Ordem de foco lógica
- [ ] Focus visível
- [ ] Esc cancela ações (quando apropriado)
- [ ] Enter executa ação principal

### ARIA
- [ ] Aria-labels adequados
- [ ] Aria-live para atualizações dinâmicas
- [ ] Aria-expanded para dropdowns/accordions
- [ ] Aria-invalid para campos com erro
- [ ] Screen readers anunciam mudanças importantes

### Semântica
- [ ] HTML semântico usado
- [ ] Formulários têm labels corretos
- [ ] Mensagens de erro associadas a campos

---

## 🧪 TESTES

### Funcionalidade
- [ ] Happy path funciona
- [ ] Edge cases funcionam
- [ ] Validação funciona
- [ ] Mensagens de erro aparecem corretamente
- [ ] Mensagens de sucesso aparecem corretamente
- [ ] Loading states funcionam
- [ ] Funciona com dados mínimos
- [ ] Funciona com dados máximos
- [ ] Funciona com dados inválidos

### Integração
- [ ] Funciona com funcionalidades existentes
- [ ] Não quebra funcionalidades existentes
- [ ] APIs integradas funcionam
- [ ] Banco de dados (se aplicável) funciona

### Navegadores
- [ ] Chrome
- [ ] Firefox
- [ ] Safari
- [ ] Edge
- [ ] Mobile browsers (Safari iOS, Chrome Android)

### Dispositivos
- [ ] Desktop (Windows/Mac)
- [ ] Tablet
- [ ] Smartphone
- [ ] Diferentes resoluções testadas

### Performance
- [ ] Não degrada performance da página
- [ ] Carregamento rápido
- [ ] Sem travamentos
- [ ] Memória não aumenta indefinidamente

---

## 📊 PERFORMANCE

### Otimização
- [ ] Código otimizado (sem operações desnecessárias)
- [ ] Debounce/throttle em eventos frequentes
- [ ] Requisições minimizadas
- [ ] Dados cacheados quando apropriado
- [ ] Imagens otimizadas (se aplicável)
- [ ] Lazy loading implementado (se aplicável)

### Métricas
- [ ] Lighthouse Performance > 80
- [ ] First Contentful Paint < 2s
- [ ] Time to Interactive < 3.5s
- [ ] Sem memory leaks
- [ ] CPU usage aceitável

---

## 🔍 SEO (se aplicável)

### On-Page
- [ ] URLs amigáveis
- [ ] Meta tags atualizadas
- [ ] Headings estruturados
- [ ] Schema.org markup (se aplicável)
- [ ] Conteúdo indexável
- [ ] Links internos relevantes

---

## 📝 DOCUMENTAÇÃO

### Código
- [ ] Comentários em lógica complexa
- [ ] JSDoc em funções principais
- [ ] README atualizado (se necessário)

### Documentação do Projeto
- [ ] Funcionalidade documentada em `docs/memory.md`
- [ ] Decisões importantes em `docs/decisions.md`
- [ ] Componentes novos em `docs/componentes.md`
- [ ] Timeline atualizada (se marco importante)
- [ ] API documentada (se aplicável)

### Usuário
- [ ] Instruções de uso (se necessário)
- [ ] FAQ atualizado (se aplicável)
- [ ] Tutorial/guia criado (se complexo)

---

## 🔄 VERSIONAMENTO

### Git
- [ ] Commits descritivos e atômicos
- [ ] Mensagens seguem padrão (feat/fix/docs)
- [ ] Branch apropriada
- [ ] Pull request criado (se workflow de equipe)
- [ ] Code review solicitado (se workflow de equipe)

---

## 🚀 DEPLOY

### Preparação
- [ ] Variáveis de ambiente configuradas
- [ ] Configurações de produção verificadas
- [ ] Testes finais em staging
- [ ] Backup realizado (se necessário)
- [ ] Rollback plan definido

### Monitoramento
- [ ] Logs configurados
- [ ] Error tracking configurado (Sentry, etc.)
- [ ] Analytics configurado (se aplicável)
- [ ] Performance monitoring (se aplicável)

---

## 📈 PÓS-LANÇAMENTO

### Monitoramento
- [ ] Erros monitorados (primeiras 24h)
- [ ] Performance monitorada
- [ ] Uso da funcionalidade rastreado
- [ ] Feedback de usuários coletado

### Iteração
- [ ] Bugs corrigidos rapidamente
- [ ] Melhorias identificadas
- [ ] Próximos passos planejados

---

## ✅ APROVAÇÃO

### Técnica
- [ ] Código revisado
- [ ] Testes passando
- [ ] Performance aceitável
- [ ] Sem bugs conhecidos críticos

### Negócio
- [ ] Stakeholder aprovou
- [ ] Requisitos atendidos
- [ ] UX aprovada
- [ ] Pronto para produção

---

**Funcionalidade:** ________________  
**Data de Início:** ___/___/______  
**Data de Conclusão:** ___/___/______  
**Desenvolvido por:** ________________  
**Revisado por:** ________________  
**Status:** ⬜ Planejamento | ⬜ Desenvolvimento | ⬜ Testes | ⬜ Deploy | ⬜ Concluído

---

## 📌 NOTAS

_Use este espaço para anotações específicas desta funcionalidade:_

### Requisitos Especiais
-

### Dependências
-

### Riscos Identificados
-

### Melhorias Futuras
-

---

**Última Atualização:** 07/12/2024  
**Versão:** 1.0
