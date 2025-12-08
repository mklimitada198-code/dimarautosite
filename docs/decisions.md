# 📋 REGISTRO DE DECISÕES - PROJETO DIMAR

**Versão:** 1.0  
**Data de Criação:** 07/12/2024  
**Última Atualização:** 07/12/2024

---

## 📋 ÍNDICE

1. [O que é este documento](#o-que-é-este-documento)
2. [Como usar](#como-usar)
3. [Decisões Tomadas](#decisões-tomadas)
4. [Template para Novas Decisões](#template-para-novas-decisões)

---

## 🎯 O QUE É ESTE DOCUMENTO

### Propósito
Registrar **todas as decisões técnicas e de design** tomadas durante o desenvolvimento do projeto. Cada decisão deve explicar:
- ✅ O que foi decidido
- ✅ Por que foi decidido
- ✅ Quais eram as alternativas
- ✅ Qual o impacto no projeto

### Benefícios
- 📝 **Memória do projeto:** Não perde o contexto
- 🤔 **Justificativas claras:** Entende o porquê
- 🔄 **Facilita mudanças:** Sabe o que será afetado
- 👥 **Onboarding:** Novos desenvolvedores entendem as escolhas

---

## 📚 COMO USAR

### Ao Tomar uma Decisão

1. **Identifique a decisão:** O que está sendo decidido?
2. **Liste alternativas:** Quais outras opções existiam?
3. **Justifique:** Por que esta opção foi escolhida?
4. **Documente impacto:** O que isso afeta no projeto?
5. **Registre aqui:** Use o template abaixo

### Quando Documentar

```
✅ Escolha de tecnologia (framework, biblioteca)
✅ Padrão de nomenclatura
✅ Estrutura de arquivos
✅ Design pattern usado
✅ Abordagem de responsividade
✅ Estratégia de performance
✅ Mudanças na arquitetura
✅ Decisões de UX/UI importantes
```

---

## 📝 DECISÕES TOMADAS

### DEC-001: Vanilla JavaScript (Sem Frameworks)
**Data:** 06/12/2024  
**Status:** ✅ Implementado  
**Categoria:** Tecnologia

#### Decisão
Usar JavaScript puro (vanilla) sem frameworks como React, Vue ou Angular.

#### Contexto
Início do projeto, decisão sobre stack tecnológico.

#### Alternativas Consideradas
1. **React:** Biblioteca mais popular, componentização
2. **Vue:** Mais simples, curva de aprendizado menor
3. **Angular:** Framework completo, mas pesado
4. **Vanilla JS:** JavaScript puro, sem dependências

#### Motivo da Escolha
- ✅ **Simplicidade:** Projeto de escala pequena/média
- ✅ **Performance:** Zero overhead de framework
- ✅ **Manutenibilidade:** Fácil de entender e modificar
- ✅ **Sem build process:** Deploy direto
- ✅ **Controle total:** Sem abstrações

#### Impacto
- **Positivo:**
  - Site mais leve e rápido
  - Sem complexidade adicional
  - Fácil debug
- **Negativo:**
  - Mais código manual para componentes
  - Sem reatividade automática
  - Re-rendering manual

#### Revisão Futura
Pode ser reavaliado se o projeto crescer significativamente (500+ componentes).

---

### DEC-002: CSS Puro (Sem Preprocessadores)
**Data:** 06/12/2024  
**Status:** ✅ Implementado  
**Categoria:** Tecnologia

#### Decisão
Usar CSS puro sem Sass, Less ou outros preprocessadores.

#### Contexto
Definição da estratégia de estilização.

#### Alternativas Consideradas
1. **Sass/SCSS:** Variáveis, mixins, nesting
2. **Less:** Similar ao Sass
3. **CSS-in-JS:** Styled Components, Emotion
4. **Tailwind CSS:** Utility-first framework
5. **CSS Puro:** Sem preprocessadores

#### Motivo da Escolha
- ✅ **Simplicidade:** Não requer compilação
- ✅ **Nativo:** Suporte direto do navegador
- ✅ **CSS Variables:** Já suporta variáveis nativamente
- ✅ **Manutenibilidade:** Todo dev sabe CSS puro
- ✅ **Performance:** Sem overhead

#### Impacto
- **Positivo:**
  - Setup mais simples
  - Não precisa build step
  - CSS Variables nativas funcionam bem
- **Negativo:**
  - Sem mixins ou funções
  - Repetição de código em alguns casos
  - Sem nesting (mas pode usar BEM)

#### Observação
Implementaremos variáveis CSS para cores e valores reutilizáveis:
```css
:root {
    --color-primary: #ff6600;
    --spacing-lg: 20px;
}
```

---

### DEC-003: Mobile First Approach
**Data:** 06/12/2024  
**Status:** ✅ Implementado  
**Categoria:** Responsividade

#### Decisão
Adotar abordagem Mobile First para responsividade.

#### Contexto
Definição da estratégia de responsividade.

#### Alternativas Consideradas
1. **Mobile First:** Estilos mobile base + media queries min-width
2. **Desktop First:** Estilos desktop base + media queries max-width
3. **Híbrido:** Mistura de ambas as abordagens

#### Motivo da Escolha
- ✅ **Best Practice:** Recomendação da indústria
- ✅ **Performance:** Mobile carrega menos CSS desnecessário
- ✅ **Progressive Enhancement:** Adiciona features conforme tela cresce
- ✅ **Foco em mobile:** 60%+ do tráfego é mobile

#### Impacto
- **Positivo:**
  - Melhor performance em mobile
  - Código mais limpo e organizado
  - Força a pensar mobile desde o início
- **Negativo:**
  - Requer mudança de mindset
  - Alguns ajustes desktop são mais complexos

#### Exemplo
```css
/* Base: Mobile */
.product-grid {
    display: grid;
    grid-template-columns: 1fr;
}

/* Tablet */
@media (min-width: 768px) {
    .product-grid {
        grid-template-columns: repeat(2, 1fr);
    }
}

/* Desktop */
@media (min-width: 1200px) {
    .product-grid {
        grid-template-columns: repeat(4, 1fr);
    }
}
```

---

### DEC-004: Nomenclatura BEM Modificada
**Data:** 06/12/2024  
**Status:** ✅ Implementado  
**Categoria:** Padrões de Código

#### Decisão
Usar BEM (Block Element Modifier) com adaptações para nomenclatura de classes CSS.

#### Contexto
Necessidade de padrão de nomenclatura consistente.

#### Alternativas Consideradas
1. **BEM Clássico:** `.block__element--modifier`
2. **BEM Simplificado:** `.block-element--modifier`
3. **SMACSS:** Base, Layout, Module, State, Theme
4. **Atomic CSS:** Classes utilitárias
5. **Sem padrão:** Classes ad-hoc

#### Motivo da Escolha
- ✅ **Clareza:** Fácil identificar relações entre elementos
- ✅ **Escalabilidade:** Funciona bem em projetos grandes
- ✅ **Sem conflitos:** Especificidade baixa e previsível
- ✅ **Legibilidade:** Nomes descritivos

#### Adaptação Feita
Usar **hífen simples** (`-`) ao invés de **underscore duplo** (`__`):
```css
/* BEM Clássico */
.product-card__image { }
.product-card__title { }
.product-card--featured { }

/* Nossa Adaptação */
.product-card-image { }
.product-card-title { }
.product-card--featured { }
```

#### Impacto
- **Positivo:**
  - Código mais legível
  - Fácil de digitar (menos caracteres)
  - Padrão consistente em todo projeto
- **Negativo:**
  - Não é BEM puro (mas funciona igual)

---

### DEC-005: Separação de Seções com Classes Distintas
**Data:** 07/12/2024  
**Status:** ✅ Implementado  
**Categoria:** Arquitetura CSS

#### Decisão
Separar as duas seções "Categorias" usando classes CSS distintas:
- `.categories-container` (Barra do menu)
- `.categories-content-wrapper` (Seção de cards)

#### Contexto
Duas seções diferentes estavam usando a mesma classe, causando conflitos de estilo.

#### Problema Original
- Seção 1 (Menu): Barra horizontal com dropdown
- Seção 2 (Cards): Carrossel de categorias com título centralizado
- Ambas usavam `.categories-container`
- Modificações em uma quebravam a outra

#### Solução Implementada
```html
<!-- Seção 1: Barra do Menu (horizontal) -->
<div class="categories-bar">
    <div class="categories-container">
        <!-- Dropdown + Links -->
    </div>
</div>

<!-- Seção 2: Cards de Categorias (vertical, centralizado) -->
<section class="categories-section">
    <div class="categories-content-wrapper">
        <!-- Título + Carrossel -->
    </div>
</section>
```

#### CSS Separado
```css
/* Barra do Menu (horizontal) */
.categories-container {
    display: flex;
    align-items: center;
    gap: 30px;
}

/* Seção de Cards (vertical, centralizado) */
.categories-content-wrapper {
    max-width: 1400px;
    margin: 0 auto;
}

.categories-section .categories-title {
    text-align: center;
    width: 100%;
}
```

#### Impacto
- **Positivo:**
  - Cada seção tem estilos independentes
  - Modificações em uma não afetam a outra
  - Código mais claro e manutenível
- **Negativo:**
  - Nenhum

#### Lição Aprendida
**Nunca reutilizar classes container para contextos diferentes.** Sempre criar classes específicas para cada seção/contexto.

---

### DEC-006: Looping Infinito com 3 Sets de Logos
**Data:** 07/12/2024  
**Status:** ✅ Implementado  
**Categoria:** UX/Animação

#### Decisão
Implementar looping infinito perfeito nos carrosséis de marcas usando 3 sets completos de logos.

#### Contexto
Carrossel de marcas tinha "pulo" visível ao reiniciar, quebrando a ilusão de movimento contínuo.

#### Problema Original
- Com 2 sets: Havia espaço em branco ao transicionar
- Início e fim eram visíveis
- Experiência não era profissional

#### Solução Implementada
```html
<!-- 3 sets idênticos de logos -->
<div class="brands-carousel">
    <!-- Set 1 -->
    <div class="brand-item">...</div>
    <!-- 9 logos -->
    
    <!-- Set 2 (duplicata) -->
    <div class="brand-item">...</div>
    <!-- 9 logos -->
    
    <!-- Set 3 (garantia) -->
    <div class="brand-item">...</div>
    <!-- 9 logos -->
</div>
```

```css
@keyframes scrollLeft {
    0% { transform: translateX(0); }
    100% { transform: translateX(-33.333%); }  /* 1/3 do conteúdo */
}
```

#### Por que 3 Sets?
1. **Set 1** está visível
2. **Set 2** entra quando Set 1 sai
3. **Set 3** garante que sempre há conteúdo à frente
4. Animação move exatamente -33.333% (1/3)
5. Quando reinicia (0%), é imperceptível pois Set 2 e 3 estão na mesma posição de Set 1

#### Impacto
- **Positivo:**
  - Looping verdadeiramente infinito
  - Sem "pulo" ou espaço em branco
  - Experiência profissional e fluida
- **Negativo:**
  - Triplicação de HTML (mas necessária)
  - Mais elementos no DOM (27 vs 9)

#### Alternativa Não Escolhida
**JavaScript para clonar elementos dinamicamente:**
- Mais complexo
- Mesma quantidade de elementos no final
- CSS puro é mais performático

---

### DEC-007: Banners Reduzidos para 2
**Data:** 07/12/2024  
**Status:** ✅ Implementado  
**Categoria:** Conteúdo

#### Decisão
Reduzir carrossel de banners de 4 para 2 slides.

#### Contexto
Usuário forneceu apenas 2 novos banners (bannner01.png e bannner02.png) e removeu os 4 antigos.

#### Motivo
- ✅ **Conteúdo real:** Usar apenas banners reais fornecidos
- ✅ **Sem placeholders:** Evitar imagens genéricas
- ✅ **Carregamento rápido:** Menos imagens para carregar

#### Impacto
- **Positivo:**
  - Carrossel mais rápido (menos transições)
  - Imagens reais e relevantes
  - Melhor performance
- **Negativo:**
  - Menos variedade visual
  - Transição mais frequente entre os mesmos 2 banners

#### Observação
Mais banners podem ser adicionados conforme o cliente fornecer.

---

### DEC-008: Extensão de Marcas Parceiras (9 Logos)
**Data:** 07/12/2024  
**Status:** ✅ Implementado  
**Categoria:** Conteúdo

#### Decisão
Expandir seção de marcas de 5 para 9 logos.

#### Logos Adicionados
- ✅ Bosch (original)
- ✅ NGK (original)
- ✅ Toyota (original)
- ✅ Fiat (original)
- ✅ Hyundai (original)
- ✅ **Ford** (novo)
- ✅ **Tete** (novo)
- ✅ **Mobil** (novo)
- ✅ **Dayco** (novo)

#### Motivo
- ✅ **Credibilidade:** Mais marcas = mais confiança
- ✅ **Variedade:** Demonstra abrangência de parceiros
- ✅ **Looping infinito:** Mais logos tornam o carrossel mais dinâmico

#### Impacto
- **Positivo:**
  - Seção mais rica visualmente
  - Maior credibilidade da empresa
  - Carrossel mais interessante
- **Negativo:**
  - Nenhum (apenas mais assets)

---

### DEC-009: Estrutura de Documentação Completa
**Data:** 07/12/2024  
**Status:** ✅ Implementado  
**Categoria:** Processo

#### Decisão
Criar sistema completo de documentação na pasta `docs/`:
- `memory.md` - Diário do projeto
- `plan.md` - Roadmap completo
- `timeline.md` - Linha do tempo
- `standards.md` - Padrões de código
- `componentes.md` - Catálogo de componentes
- `decisions.md` - Este arquivo
- `checklists/` - Checklists de qualidade

#### Contexto
Necessidade de manter memória e organização do projeto a longo prazo.

#### Motivo
- ✅ **Continuidade:** Não perder contexto entre sessões
- ✅ **Qualidade:** Manter padrões consistentes
- ✅ **Onboarding:** Facilitar entrada de novos devs
- ✅ **Decisões documentadas:** Saber o porquê das escolhas
- ✅ **Progresso visível:** Timeline e memory atualizados

#### Impacto
- **Positivo:**
  - Projeto muito bem documentado
  - Fácil retomar de onde parou
  - Decisões justificadas
  - Padrões claros
- **Negativo:**
  - Tempo inicial para criar docs
  - Necessidade de manter atualizado

#### Tempo Investido
~4 horas para documentação inicial completa.

---

### DEC-010: Python HTTP Server para Desenvolvimento Local
**Data:** 06/12/2024  
**Status:** ✅ Implementado  
**Categoria:** Ambiente de Desenvolvimento

#### Decisão
Usar `python -m http.server 8000` para servidor local de desenvolvimento.

#### Alternativas Consideradas
1. **Python HTTP Server:** Simples, built-in
2. **Live Server (VS Code):** Extensão, hot reload
3. **Node http-server:** Requer Node.js
4. **Apache/Nginx:** Muito complexo para dev

#### Motivo da Escolha
- ✅ **Simplicidade:** Um comando apenas
- ✅ **Zero configuração:** Funciona imediatamente
- ✅ **Built-in:** Python já está instalado
- ✅ **Suficiente:** Atende necessidades do projeto

#### Impacto
- **Positivo:**
  - Setup instantâneo
  - Sem dependências extras
- **Negativo:**
  - Sem hot reload (precisa F5 manual)
  - Sem HTTPS (mas não necessário em dev)

#### Comando
```bash
python -m http.server 8000
```

Acesso: `http://localhost:8000`

---

## 📝 TEMPLATE PARA NOVAS DECISÕES

```markdown
### DEC-XXX: [Título da Decisão]
**Data:** DD/MM/AAAA  
**Status:** ⏳ Proposta | 🔄 Em Implementação | ✅ Implementado  
**Categoria:** Tecnologia | Arquitetura | UX/UI | Performance | Processo

#### Decisão
[O que foi decidido em 1-2 linhas]

#### Contexto
[Situação que levou a essa decisão]

#### Alternativas Consideradas
1. **Opção A:** [descrição]
2. **Opção B:** [descrição]
3. **Opção C:** [descrição]

#### Motivo da Escolha
- ✅ [Razão 1]
- ✅ [Razão 2]
- ✅ [Razão 3]

#### Impacto
- **Positivo:**
  - [Benefício 1]
  - [Benefício 2]
- **Negativo:**
  - [Trade-off 1]
  - [Trade-off 2]

#### Observações
[Informações adicionais relevantes]

#### Revisão Futura
[Quando/se essa decisão deve ser reavaliada]
```

---

## 📊 ESTATÍSTICAS

### Decisões por Categoria
```
Tecnologia: 2
Arquitetura: 1
Padrões: 1
UX/Animação: 1
Conteúdo: 2
Processo: 2
Ambiente: 1

Total: 10 decisões
```

### Decisões por Status
```
✅ Implementadas: 10
🔄 Em Implementação: 0
⏳ Propostas: 0
```

---

## 🔄 LOG DE ATUALIZAÇÕES

### 07/12/2024 - 23:15
- ✅ Documento criado
- ✅ 10 decisões documentadas
- ✅ Template adicionado
- ✅ Estatísticas incluídas

---

**📌 Última Atualização:** 07/12/2024 - 23:15  
**📊 Versão:** 1.0  
**📝 Próxima Decisão:** DEC-011

> **Lembre-se:** Toda decisão importante deve ser documentada aqui. Não confie apenas na memória!
