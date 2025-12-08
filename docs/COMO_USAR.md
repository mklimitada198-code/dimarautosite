# 🚀 GUIA RÁPIDO - Como Usar o Sistema de Documentação

## 📖 Para que serve cada arquivo

### 📘 `PROMPT_COMPLETO.md` 
**O QUE É:** As instruções completas do projeto  
**QUANDO USAR:** Sempre que iniciar nova sessão ou precisar relembrar as regras  
**AÇÃO:** Ler para entender a metodologia completa

---

### 📊 `COMPARACAO_PROMPTS.md`
**O QUE É:** Comparação entre prompt original e melhorado  
**QUANDO USAR:** Para entender o que foi adicionado e por quê  
**AÇÃO:** Ler uma vez para contexto histórico

---

### 📝 `memory.md` *(A CRIAR)*
**O QUE É:** Diário vivo do projeto  
**QUANDO USAR:** 
- Antes de começar qualquer tarefa (ler)
- Depois de concluir qualquer tarefa (atualizar)
- Quando tomar decisões importantes  

**FORMATO:**
```markdown
# Memória do Projeto Dimar

## 📅 06/12/2024
### ✅ Concluído
- Servidor local iniciado (http://localhost:8000)
- Sistema de documentação criado
- Análise inicial dos arquivos HTML, CSS, JS

### 🔄 Em Andamento
- Criando estrutura completa de documentação

### 📋 Próximos Passos
1. Análise técnica profunda do código existente
2. Criar inventário de componentes
3. Documentar design system

### 💡 Observações
- Site já tem base sólida com carrossel funcional
- Filtro de veículos já implementado
- Design laranja/preto bem definido
```

---

### 📋 `plan.md` *(A CRIAR)*
**O QUE É:** Plano mestre do projeto  
**QUANDO USAR:**
- Para entender roadmap completo
- Ao planejar sprints/ciclos de trabalho
- Para atualizar status de tarefas

**ESTRUTURA:**
1. O que já existe (inventário)
2. O que precisa melhorar (dívidas técnicas)
3. O que será criado (novos features)
4. Priorização MoSCoW
5. Fases de execução

---

### 📅 `timeline.md` *(A CRIAR)*
**O QUE É:** Linha do tempo visual  
**QUANDO USAR:**
- Para ver progresso rápido
- Ao finalizar marcos importantes
- Para estimar prazos

**FORMATO:**
```markdown
✅ 06/12/2024 - Setup inicial
🔄 06/12/2024 - Documentação base
⏳ 07/12/2024 - Análise técnica completa
📅 09/12/2024 - Página de produtos
📅 12/12/2024 - Catálogo completo
📅 15/12/2024 - Sistema de busca avançado
```

---

### 🎨 `standards.md` *(A CRIAR)*
**O QUE É:** Regras e padrões obrigatórios  
**QUANDO USAR:**
- Antes de criar qualquer código novo
- Ao revisar código existente
- Como referência de design system

**CONTEÚDO:**
- Cores, tipografia, espaçamentos
- Breakpoints responsivos
- Regras de acessibilidade
- Padrões de código
- Checklist de performance

---

### 📝 `decisions.md` *(A CRIAR)*
**O QUE É:** Registro de decisões técnicas (ADR)  
**QUANDO USAR:**
- Ao escolher entre alternativas técnicas
- Quando mudar abordagem importante
- Para justificar escolhas futuras

**EXEMPLO:**
```markdown
## 06/12/2024 - Usar Python HTTP Server para desenvolvimento

**Contexto:**
Precisávamos visualizar o site localmente

**Decisão:**
Usar `python -m http.server 8000`

**Por quê:**
- Python já vem instalado no Windows
- Simples e rápido para desenvolvimento
- Não requer instalação de dependências

**Impacto:**
- Site acessível em localhost:8000
- Servidor leve para desenvolvimento

**Alternativas:**
- Live Server (VS Code) - requer extensão
- Node http-server - requer npm install
```

---

### 🧩 `componentes.md` *(A CRIAR)*
**O QUE É:** Inventário de todos os componentes  
**QUANDO USAR:**
- Para ver o que já existe antes de criar novo
- Para entender onde componente é usado
- Para planejar refatorações

**ESTRUTURA:**
```markdown
## Header Principal
- **Tipo:** Layout / Navegação
- **Localização:** Topo de todas as páginas
- **Subcomponentes:** Logo, Busca, Ações (Televendas, Pedidos, Login, Carrinho)
- **Estado:** ✅ Completo e funcional
- **Melhorias possíveis:** Adicionar busca preditiva

## Carrossel de Banners
- **Tipo:** Mídia / Apresentação
- **Localização:** Abaixo do header
- **Funcionalidades:** Auto-rotate, navegação manual, indicadores
- **Estado:** ✅ Completo e funcional
- **Dependências:** JavaScript (script.js)
```

---

### ✅ `checklists/` *(PASTA A CRIAR)*
**O QUE É:** Checklists específicos para cada tipo de tarefa  
**QUANDO USAR:** Sempre antes de dar algo como "pronto"

**ARQUIVOS:**

#### `nova-pagina.md`
Use ao criar qualquer página nova do site

#### `novo-componente.md`
Use ao criar botões, cards, modais, etc.

#### `nova-funcionalidade.md`
Use ao adicionar JavaScript/interatividade

#### `pre-deploy.md`
Use antes de publicar qualquer versão

---

## 🔄 Fluxo de Trabalho Ideal

### 📥 **ANTES de começar a trabalhar:**
```
1. Ler docs/memory.md - onde estou?
2. Ler docs/plan.md - o que fazer agora?
3. Ler docs/standards.md - quais regras seguir?
```

### 💻 **DURANTE o trabalho:**
```
1. Seguir padrões de docs/standards.md
2. Consultar docs/componentes.md para reutilizar
3. Anotar decisões importantes (para depois registrar)
```

### ✅ **DEPOIS de concluir:**
```
1. Usar checklist apropriado (checklists/*.md)
2. Atualizar docs/memory.md com data e descrição
3. Atualizar docs/plan.md marcando conclusão
4. Adicionar decisão em docs/decisions.md (se relevante)
5. Atualizar docs/timeline.md com progresso
```

---

## 🎯 Próximos Passos IMEDIATOS

Agora que você leu este guia, faça:

### 1️⃣ **Análise Inicial** (30-45 min)
```bash
# Ler com atenção:
- index.html (estrutura completa)
- css/style.css (design system e componentes)
- js/script.js (funcionalidades)
- assets/images/* (inventário de mídia)
```

### 2️⃣ **Criar Análise Inicial** (20-30 min)
```
Criar: docs/analise-inicial.md
Com descobertas sobre:
- O que funciona bem
- O que precisa melhorar
- O que está faltando
- Oportunidades identificadas
```

### 3️⃣ **Criar Arquivos Base** (40-60 min)
```
Criar todos os arquivos de documentação:
- docs/memory.md
- docs/plan.md
- docs/timeline.md
- docs/standards.md
- docs/decisions.md
- docs/componentes.md
- docs/checklists/*.md
```

### 4️⃣ **Apresentar Resumo** (10 min)
```
Criar resumo executivo com:
- Estado atual do projeto
- 3-5 próximas ações prioritárias
- Estimativa de tempo/esforço
```

---

## 💡 Dicas Importantes

✅ **SEMPRE atualize a documentação** - é mais importante que você pensa  
✅ **Use os checklists religiosamente** - evita esquecimentos  
✅ **Linguagem simples** - qualquer pessoa deve entender  
✅ **Data em tudo** - histórico é valioso  
✅ **Não tenha medo de atualizar** - documentação viva é melhor  

❌ **Nunca pule a documentação** - "depois" nunca acontece  
❌ **Não use jargão técnico excessivo** - mantenha acessível  
❌ **Não deixe decisões sem registro** - você vai esquecer o porquê  

---

## 🆘 Perguntas Frequentes

### "Devo criar todos os arquivos agora?"
**Sim.** Crie a estrutura completa de uma vez. Melhor ter estrutura vazia que criar depois.

### "E se eu não souber o que escrever em algum arquivo?"
**Escreva o básico primeiro.** Ex: "A definir" ou "Em análise". Preencha conforme aprende.

### "Quanto tempo devo gastar documentando vs codificando?"
**Regra 20/80:** 20% do tempo em documentação, 80% em código. Parece muito, mas economiza retrabalho.

### "Preciso documentar até pequenas mudanças?"
**Não tudo.** Documente:
- ✅ Decisões importantes
- ✅ Novos componentes/páginas
- ✅ Mudanças de arquitetura
- ❌ Correção de typo
- ❌ Ajuste de 2px no CSS

### "Posso mudar a estrutura dos documentos?"
**Sim.** Esta é uma base. Adapte ao que funciona melhor para VOCÊ.

---

## 🎬 Pronto para Começar?

Agora você tem:
- ✅ Sistema completo de documentação
- ✅ Metodologia clara de trabalho
- ✅ Checklists para qualidade
- ✅ Caminho definido para começar

**Sua próxima ação deve ser:**
👉 Executar os "4 Próximos Passos Imediatos" descritos acima

**Boa sorte! 🚀**


