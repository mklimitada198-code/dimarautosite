# ✅ CHECKLIST: PRÉ-DEPLOY (LANÇAMENTO)

**Use este checklist antes de colocar o site em produção.**

---

## 🔍 AUDITORIA GERAL

### Páginas
- [ ] Todas as páginas criadas estão funcionais
- [ ] Nenhuma página retorna 404
- [ ] Sem páginas "em construção" ou placeholders
- [ ] Conteúdo completo em todas as páginas
- [ ] Sem "Lorem Ipsum" ou textos de teste

### Links
- [ ] Todos os links internos funcionam
- [ ] Todos os links externos funcionam (e abrem em nova aba)
- [ ] Links do menu navegam corretamente
- [ ] Links do footer navegam corretamente
- [ ] Breadcrumbs funcionam (se aplicável)
- [ ] Botões "Voltar" funcionam

### Conteúdo
- [ ] Textos revisados (sem erros ortográficos)
- [ ] Imagens finais no lugar (sem placeholders)
- [ ] Vídeos funcionam (se aplicável)
- [ ] Informações de contato corretas
- [ ] Preços atualizados
- [ ] Produtos/serviços listados corretamente

---

## 📄 HTML

### Estrutura
- [ ] HTML válido (W3C Validator)
- [ ] Apenas um `<h1>` por página
- [ ] Heading hierarchy correta em todas as páginas
- [ ] HTML semântico usado
- [ ] Sem IDs duplicados

### Meta Tags
- [ ] `<title>` único em cada página (50-60 caracteres)
- [ ] `<meta name="description">` em cada página (150-160 caracteres)
- [ ] `<meta charset="UTF-8">`
- [ ] `<meta name="viewport">` presente
- [ ] Canonical URLs definidos
- [ ] Open Graph tags completas (og:title, og:description, og:image, og:url, og:type)
- [ ] Twitter Card tags completas
- [ ] Favicon presente e aparecendo corretamente

---

## 🎨 CSS

### Qualidade
- [ ] CSS válido (CSS Validator)
- [ ] Sem propriedades não utilizadas
- [ ] Sem !important desnecessários
- [ ] Cores consistentes
- [ ] Tipografia consistente
- [ ] Espaçamentos consistentes

### Performance
- [ ] CSS minificado
- [ ] Critical CSS inline (se necessário)
- [ ] Unused CSS removido
- [ ] Arquivos CSS concatenados (se múltiplos)

---

## ⚡ JAVASCRIPT

### Qualidade
- [ ] Sem erros no console (todas as páginas)
- [ ] Sem console.log() de debug
- [ ] Sem comentários TODO não resolvidos
- [ ] Código comentado removido
- [ ] Event listeners limpos (sem memory leaks)

### Performance
- [ ] JavaScript minificado
- [ ] Scripts carregados com `defer` ou `async`
- [ ] Scripts críticos inline (se necessário)
- [ ] Arquivos JS concatenados (se múltiplos)

---

## 🖼️ IMAGENS E MÍDIA

### Otimização
- [ ] Todas as imagens otimizadas (TinyPNG, ImageOptim, etc.)
- [ ] Imagens em formato WebP (com fallback)
- [ ] Imagens têm dimensões corretas (não redimensionadas via CSS)
- [ ] Imagens têm atributos `width` e `height`
- [ ] Lazy loading implementado (exceto above the fold)
- [ ] Imagens responsivas (`srcset` se necessário)

### Conteúdo
- [ ] Todas as imagens têm `alt` descritivo
- [ ] Imagens de alta qualidade
- [ ] Sem imagens corrompidas
- [ ] Favicon em múltiplos tamanhos (16x16, 32x32, 180x180, etc.)

---

## 📱 RESPONSIVIDADE

### Testes em Múltiplas Resoluções
- [ ] 320px (iPhone SE)
- [ ] 375px (iPhone X/11/12/13)
- [ ] 414px (iPhone Plus)
- [ ] 768px (iPad Portrait)
- [ ] 1024px (iPad Landscape)
- [ ] 1366px (Laptop)
- [ ] 1920px (Desktop Full HD)
- [ ] 2560px (Desktop 2K)

### Dispositivos Reais
- [ ] Testado em smartphone real (Android)
- [ ] Testado em smartphone real (iOS)
- [ ] Testado em tablet real (se disponível)

### Funcionalidade Mobile
- [ ] Sem scroll horizontal
- [ ] Touch gestures funcionam
- [ ] Botões têm tamanho adequado (≥44x44px)
- [ ] Menus mobile funcionam
- [ ] Formulários preenchíveis em mobile
- [ ] Imagens carregam rapidamente

---

## 🌐 NAVEGADORES

### Desktop
- [ ] Chrome (última versão)
- [ ] Firefox (última versão)
- [ ] Safari (última versão)
- [ ] Edge (última versão)
- [ ] Chrome (versão anterior)
- [ ] Firefox (versão anterior)

### Mobile
- [ ] Safari iOS (iPhone)
- [ ] Chrome Android
- [ ] Samsung Internet
- [ ] Firefox Mobile

### Compatibilidade
- [ ] Sem erros no console (todos os navegadores)
- [ ] Layout consistente (todos os navegadores)
- [ ] Funcionalidades funcionam (todos os navegadores)

---

## ♿ ACESSIBILIDADE

### Testes Automatizados
- [ ] WAVE (sem erros críticos)
- [ ] Lighthouse Accessibility > 95
- [ ] axe DevTools (sem erros críticos)

### Testes Manuais
- [ ] Navegação completa apenas com teclado (Tab)
- [ ] Todos os elementos interativos acessíveis (Tab)
- [ ] Focus visível em todos os elementos
- [ ] Skip links funcionam
- [ ] Testado com leitor de tela (NVDA/JAWS/VoiceOver)

### Padrões
- [ ] Contraste de cores ≥ 4.5:1 (texto normal)
- [ ] Contraste de cores ≥ 3:1 (texto grande)
- [ ] Formulários têm labels associados
- [ ] Botões têm texto ou aria-label
- [ ] Imagens têm alt text descritivo
- [ ] Vídeos têm legendas (se aplicável)

---

## 🔍 SEO

### On-Page
- [ ] Sitemap.xml gerado e presente
- [ ] Robots.txt configurado
- [ ] URLs amigáveis (sem query strings complexas)
- [ ] Canonical URLs corretos
- [ ] 404 page customizada e útil
- [ ] Redirects 301 configurados (se necessário)

### Conteúdo
- [ ] H1 com palavra-chave principal em cada página
- [ ] Meta descriptions únicas e atrativas
- [ ] Títulos únicos e descritivos
- [ ] Alt text em imagens com keywords naturais
- [ ] Links internos relevantes
- [ ] Schema.org markup implementado (se aplicável)

### Testes
- [ ] Google Search Console configurado
- [ ] Google Analytics configurado
- [ ] Indexed pages verificadas (Google Search Console)
- [ ] Rich results testados (Google Rich Results Test)

---

## 🚀 PERFORMANCE

### Lighthouse
- [ ] Performance > 90
- [ ] Accessibility > 95
- [ ] Best Practices > 95
- [ ] SEO > 95

### Core Web Vitals
- [ ] Largest Contentful Paint (LCP) < 2.5s
- [ ] First Input Delay (FID) < 100ms
- [ ] Cumulative Layout Shift (CLS) < 0.1

### Outras Métricas
- [ ] First Contentful Paint < 1.8s
- [ ] Time to Interactive < 3.5s
- [ ] Speed Index < 3.4s
- [ ] Total Blocking Time < 300ms

### Otimizações
- [ ] Imagens otimizadas e lazy loaded
- [ ] CSS minificado
- [ ] JavaScript minificado
- [ ] Gzip/Brotli compression ativado
- [ ] Browser caching configurado
- [ ] CDN configurado (se aplicável)
- [ ] Fontes otimizadas (preload, display: swap)

---

## 🔐 SEGURANÇA

### HTTPS
- [ ] Certificado SSL instalado
- [ ] HTTPS forçado (redirect de HTTP)
- [ ] Mixed content resolvido (sem http:// em https://)
- [ ] HSTS configurado

### Headers de Segurança
- [ ] Content-Security-Policy configurado
- [ ] X-Frame-Options: DENY ou SAMEORIGIN
- [ ] X-Content-Type-Options: nosniff
- [ ] Referrer-Policy configurado

### Formulários
- [ ] CSRF protection implementado
- [ ] Validação server-side implementada
- [ ] Input sanitizado
- [ ] Rate limiting em formulários (se necessário)
- [ ] Captcha em formulários críticos (se necessário)

---

## 📧 FORMULÁRIOS E INTEGRAÇÕES

### Funcionalidade
- [ ] Todos os formulários funcionam
- [ ] Validação client-side funciona
- [ ] Validação server-side funciona
- [ ] Mensagens de erro claras
- [ ] Mensagens de sucesso aparecem
- [ ] Emails são enviados corretamente
- [ ] Emails chegam (não vão para spam)

### Integrações
- [ ] API de pagamento funciona (se aplicável)
- [ ] API de frete funciona (se aplicável)
- [ ] Newsletter signup funciona
- [ ] Redes sociais linkadas corretamente
- [ ] Google Maps funciona (se aplicável)
- [ ] Chat/WhatsApp funciona (se aplicável)

---

## 📊 ANALYTICS E MONITORAMENTO

### Ferramentas
- [ ] Google Analytics instalado
- [ ] Google Tag Manager configurado (se usado)
- [ ] Facebook Pixel instalado (se usado)
- [ ] Hotjar ou similar configurado (se usado)
- [ ] Error tracking (Sentry, etc.) configurado

### Eventos
- [ ] Eventos principais rastreados (compras, cadastros, etc.)
- [ ] Goals configurados (Google Analytics)
- [ ] Conversions configuradas
- [ ] Funil de vendas mapeado

---

## 🗄️ BACKEND E BANCO DE DADOS

### Servidor
- [ ] Servidor de produção configurado
- [ ] Variáveis de ambiente configuradas
- [ ] Banco de dados de produção configurado
- [ ] Backups automáticos configurados
- [ ] Logs configurados
- [ ] Monitoramento de uptime configurado

### Performance
- [ ] Queries otimizadas
- [ ] Índices de banco criados
- [ ] Cache configurado (Redis, Memcached, etc.)
- [ ] CDN configurado para assets

---

## 📱 SOCIAL MEDIA

### Open Graph
- [ ] Preview testado (Facebook Debugger)
- [ ] Imagem OG de qualidade (1200x630px)
- [ ] Título e descrição atrativos

### Twitter Card
- [ ] Preview testado (Twitter Card Validator)
- [ ] Imagem de qualidade
- [ ] Título e descrição atrativos

### Share Buttons
- [ ] Botões de compartilhamento funcionam
- [ ] URLs corretas sendo compartilhadas
- [ ] Imagens corretas aparecendo

---

## 📞 INFORMAÇÕES DE CONTATO

### Dados Corretos
- [ ] Telefone correto e funcional
- [ ] Email correto e funcional
- [ ] Endereço correto
- [ ] Horário de funcionamento atualizado
- [ ] Links de redes sociais corretos
- [ ] WhatsApp link correto (se aplicável)

---

## ⚖️ LEGAL

### Páginas Legais
- [ ] Política de Privacidade presente
- [ ] Termos de Uso presentes
- [ ] Política de Cookies (se aplicável)
- [ ] Política de Troca/Devolução (e-commerce)
- [ ] LGPD compliance (Brasil)
- [ ] GDPR compliance (se aplicável)

### Copyright
- [ ] Copyright atualizado (© 2024)
- [ ] Créditos corretos (se necessário)
- [ ] Licenças de imagens OK

---

## 🧪 TESTES FINAIS

### Fluxos Completos
- [ ] Fluxo de compra completo (e-commerce)
- [ ] Fluxo de cadastro completo
- [ ] Fluxo de login completo
- [ ] Fluxo de recuperação de senha
- [ ] Fluxo de busca de produtos
- [ ] Fluxo de contato

### Stress Test
- [ ] Múltiplos usuários simultâneos (se possível)
- [ ] Performance sob carga
- [ ] Banco de dados sob carga

---

## 🚀 DEPLOY

### Preparação
- [ ] Backup completo realizado
- [ ] Rollback plan definido
- [ ] Equipe preparada
- [ ] Horário de deploy definido (baixo tráfego)
- [ ] Comunicação aos stakeholders

### Pós-Deploy
- [ ] Site acessível
- [ ] Todas as páginas carregando
- [ ] Funcionalidades críticas testadas
- [ ] Monitoramento ativo (primeiras 24h)
- [ ] Erros monitorados
- [ ] Performance monitorada

---

## 📢 MARKETING

### Lançamento
- [ ] Comunicado para clientes existentes
- [ ] Post em redes sociais
- [ ] Email marketing (se aplicável)
- [ ] Press release (se aplicável)

---

## ✅ APROVAÇÃO FINAL

### Técnica
- [ ] Todos os testes passaram
- [ ] Performance aceitável
- [ ] Sem bugs críticos conhecidos
- [ ] Aprovado por Tech Lead

### Negócio
- [ ] Aprovado por Stakeholder
- [ ] Aprovado por Cliente (se aplicável)
- [ ] Budget aprovado
- [ ] Timeline aprovada

### GO / NO-GO
- [ ] ✅ **GO:** Pronto para produção
- [ ] ❌ **NO-GO:** Precisa mais trabalho (detalhar abaixo)

---

**Projeto:** Dimar - Auto Peças & Moto Peças  
**Data do Checklist:** ___/___/______  
**Previsão de Deploy:** ___/___/______  
**Deploy Realizado em:** ___/___/______  
**Responsável:** ________________  
**Aprovado por:** ________________

---

## 📌 ISSUES ENCONTRADAS

_Liste aqui quaisquer problemas encontrados durante o checklist:_

1. 
2. 
3. 

---

## 📝 NOTAS FINAIS

_Observações importantes sobre o deploy:_

---

**Última Atualização:** 07/12/2024  
**Versão:** 1.0

---

## 🎉 PÓS-LANÇAMENTO

### Primeiras 24 Horas
- [ ] Monitorar erros
- [ ] Monitorar performance
- [ ] Responder a feedback
- [ ] Corrigir bugs críticos imediatamente

### Primeira Semana
- [ ] Coletar feedback de usuários
- [ ] Analisar analytics
- [ ] Identificar melhorias
- [ ] Planejar próximas iterações

---

**🚀 BOA SORTE NO LANÇAMENTO!**
