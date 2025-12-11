# 📘 PROMPT COMPLETO - PROJETO DIMAR

## Contexto do Projeto

Você será responsável por ajudar a construir o site profissional da **Dimar**, uma empresa de auto peças e moto peças.

O site já tem uma base inicial criada com:
- HTML estruturado com menu, header, categorias, carrossel e filtro de veículos
- CSS com design moderno (gradientes laranja/preto, efeitos visuais)
- JavaScript com funcionalidades interativas (carrossel, dropdowns, filtros)
- Assets de imagens (logo e banners)

Você deve **analisar profundamente tudo o que já existe** antes de começar qualquer plano.

---

## 🎯 Sua Missão Principal

Criar e manter dentro da pasta `docs/` a **memória completa do projeto**, que funcionará como um histórico vivo de tudo que foi feito, está sendo feito e ainda será feito.

---

## 📋 O que você deve fazer

### 1️⃣ **ANÁLISE INICIAL COMPLETA**

Antes de qualquer coisa, analise e documente:

**Estrutura HTML:**
- Quais seções existem (header, nav, banner, filtros, etc.)
- Como estão organizadas semanticamente
- Quais elementos são interativos
- Se há problemas de acessibilidade (falta de alt, aria-labels, etc.)

**Estilo CSS:**
- Identifique o design system (cores, tipografia, espaçamentos)
- Mapeie todos os componentes visuais
- Verifique responsividade (breakpoints, mobile-first)
- Identifique padrões reutilizáveis

**JavaScript:**
- Liste todas as funcionalidades implementadas
- Identifique dependências e interações
- Verifique performance e possíveis bugs
- Mapeie eventos e manipulações do DOM

**Assets e Recursos:**
- Inventário de todas as imagens
- Verifique otimização (tamanho, formato)
- Liste recursos externos (fontes, CDNs)

**Documente tudo isso em:** `docs/analise-inicial.md`

---

### 2️⃣ **CRIAR MEMÓRIA DO PROJETO**

Crie `docs/memory.md` com:

- **Data de início do projeto**
- **Estado atual detalhado** (o que funciona, o que não funciona)
- **Histórico de mudanças** (com datas)
- **Decisões tomadas** (com justificativas)
- **Problemas encontrados e resolvidos**
- **Próximos passos planejados**

**Mantenha este arquivo SEMPRE atualizado** após qualquer ação.

---

### 3️⃣ **CRIAR PLANO COMPLETO DE DESENVOLVIMENTO**

Crie `docs/plan.md` com:

#### ✅ **O que já existe:**
- Lista completa de funcionalidades implementadas
- Qualidade/estado de cada funcionalidade

#### 🔨 **O que precisa ser melhorado:**
- Problemas identificados (bugs, performance, UX)
- Oportunidades de otimização
- Melhorias de design ou código

#### 🆕 **O que ainda será criado:**
- Novas funcionalidades necessárias
- Novas páginas ou seções
- Integrações futuras

#### 📊 **Priorização (método MoSCoW):**
- **Must Have** (Essencial - não lança sem isso)
- **Should Have** (Importante - deve ter)
- **Could Have** (Desejável - se der tempo)
- **Won't Have** (Não será feito agora)

#### 🗓️ **Ordem de execução:**
- Fase 1: Correções críticas
- Fase 2: Melhorias essenciais
- Fase 3: Novas funcionalidades principais
- Fase 4: Funcionalidades secundárias
- Fase 5: Otimizações e polimento

---

### 4️⃣ **CRIAR LINHA DO TEMPO**

Crie `docs/timeline.md` com:

- **Onde estamos agora** (marco atual)
- **O que já foi concluído** (com datas)
- **Marcos futuros importantes** (releases, entregas)
- **Estimativas realistas** (não precisa ser exato)

Use formato visual simples:
```
✅ 06/12/2024 - Análise inicial concluída
🔄 06/12/2024 - Criando documentação base
⏳ 07/12/2024 - Implementar seção de produtos
📅 10/12/2024 - Finalizar catálogo completo
```

---

### 5️⃣ **CRIAR PADRÕES E BOAS PRÁTICAS**

Crie `docs/standards.md` com regras que SEMPRE devem ser seguidas:

#### 🎨 **Design System**
- **Cores:** Documentar paleta completa (primárias, secundárias, estados)
- **Tipografia:** Fontes, tamanhos, pesos, line-heights
- **Espaçamentos:** Sistema de grid e espaçamentos consistentes
- **Componentes:** Botões, inputs, cards, etc.

#### 📱 **Responsividade**
- Mobile-first obrigatório
- Breakpoints definidos: 375px, 768px, 1024px, 1440px
- Testar em dispositivos reais e DevTools
- Imagens responsivas (srcset quando apropriado)

#### ⚡ **Performance**
- Imagens otimizadas (WebP quando possível)
- CSS e JS minificados em produção
- Lazy loading para imagens fora da viewport
- Evitar animações pesadas

#### ♿ **Acessibilidade**
- Todas as imagens com alt descritivo
- Navegação por teclado funcional
- Contraste adequado (WCAG AA mínimo)
- Aria-labels em elementos interativos
- Formulários com labels associados

#### 🔍 **SEO**
- Títulos e meta descriptions únicos
- Heading hierarchy correta (H1 > H2 > H3)
- URLs amigáveis e descritivas
- Schema.org markup quando apropriado

#### 💻 **Código**
- Tudo novo deve combinar com o que já existe
- Evitar repetição (DRY principle)
- Comentários em código complexo
- Nomes de classes descritivos e consistentes
- Organização lógica de arquivos

#### 🧪 **Testes**
- Testar em Chrome, Firefox, Safari, Edge
- Testar no mobile (iOS e Android)
- Validar formulários funcionam corretamente
- Verificar links não quebrados
- Testar performance (PageSpeed Insights)

---

### 6️⃣ **CRIAR REGISTRO DE DECISÕES**

Crie `docs/decisions.md` para anotar TODAS as decisões técnicas:

Formato:
```markdown
## [Data] - Título da Decisão

**Contexto:**
Explique a situação que levou à decisão

**Decisão:**
O que foi decidido

**Por quê:**
Justificativa clara e simples

**Impacto:**
Como isso afeta o resto do projeto

**Alternativas consideradas:**
Outras opções que foram avaliadas
```

---

### 7️⃣ **CRIAR CHECKLISTS**

Crie pasta `docs/checklists/` com arquivos:

#### `nova-pagina.md`
- [ ] HTML semântico correto
- [ ] Meta tags (title, description)
- [ ] Responsiva em todos breakpoints
- [ ] Imagens otimizadas com alt
- [ ] Links funcionais
- [ ] Formulários com validação
- [ ] Testado em 4 navegadores principais
- [ ] Performance > 90 no PageSpeed
- [ ] Acessibilidade verificada

#### `novo-componente.md`
- [ ] Design consistente com sistema existente
- [ ] Funciona em todos breakpoints
- [ ] Estados visuais (hover, active, disabled)
- [ ] Acessível por teclado
- [ ] Aria-labels apropriados
- [ ] Sem console errors
- [ ] Reutilizável
- [ ] Documentado

#### `nova-funcionalidade.md`
- [ ] Especificação clara do comportamento
- [ ] JavaScript organizado e comentado
- [ ] Tratamento de erros
- [ ] Loading states quando necessário
- [ ] Feedback visual para usuário
- [ ] Funciona sem JavaScript (progressive enhancement)
- [ ] Testado em cenários extremos
- [ ] Performance otimizada

#### `pre-deploy.md`
- [ ] Todos os links funcionando
- [ ] Imagens carregando corretamente
- [ ] Formulários enviando dados
- [ ] Console sem erros
- [ ] Responsivo em todos devices
- [ ] Testado em todos navegadores
- [ ] Performance verificada
- [ ] SEO básico implementado
- [ ] Analytics configurado (se aplicável)

---

### 8️⃣ **CRIAR INVENTÁRIO DE COMPONENTES**

Crie `docs/componentes.md` listando todos os componentes do site:

Para cada componente:
- Nome e descrição
- Onde é usado
- Variações (se houver)
- Dependências
- Estado (completo, precisa melhorias, etc.)

Exemplo:
```markdown
## Botão Primário
- **Descrição:** Botão principal do site (laranja)
- **Localização:** Header (buscar), filtro de veículos
- **Variações:** Normal, hover, active, disabled
- **Estado:** ✅ Completo
```

---

### 9️⃣ **MANTER TUDO ATUALIZADO**

**REGRA DE OURO:**
Toda vez que você fizer, analisar ou decidir algo:

1. Atualize `docs/memory.md` com data e descrição
2. Marque no `docs/plan.md` o que foi concluído
3. Adicione decisão em `docs/decisions.md` se relevante
4. Atualize `docs/timeline.md` com progresso
5. Use os checklists apropriados

---

### 🔟 **NUNCA PERDER O RUMO**

Antes de começar qualquer tarefa:
1. Consulte `docs/memory.md` - onde estamos?
2. Consulte `docs/plan.md` - o que vem agora?
3. Consulte `docs/standards.md` - quais regras seguir?
4. Execute a tarefa seguindo os padrões
5. Use o checklist apropriado
6. Atualize a documentação

---

## 🎯 Objetivo Final

Ter um **sistema de documentação vivo** que:

✅ Mantém histórico completo do projeto  
✅ Evita retrabalho e perda de informação  
✅ Garante qualidade consistente  
✅ Facilita retomar trabalho de onde parou  
✅ Permite evolução organizada e planejada  
✅ Serve como fonte única da verdade  

---

## 🚀 Comece Agora

Sua primeira ação deve ser:
1. Ler todo o código HTML, CSS e JavaScript existente
2. Criar `docs/analise-inicial.md` com suas descobertas
3. Criar os demais arquivos de documentação
4. Apresentar um resumo executivo do estado atual
5. Propor os próximos 3-5 passos prioritários

**Lembre-se:** Linguagem simples, organização clara, foco em manter tudo documentado e evoluindo de forma profissional.


