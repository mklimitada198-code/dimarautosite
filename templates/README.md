# 📐 PASTA TEMPLATES

Esta pasta conterá templates reutilizáveis do site.

## 📋 Templates Planejados

```
templates/
├── header.html              (Header completo reutilizável)
├── footer.html              (Footer completo reutilizável)
├── nav.html                 (Menu de navegação)
├── breadcrumbs.html         (Breadcrumbs template)
└── components/
    ├── product-card.html    (Card de produto)
    ├── category-card.html   (Card de categoria)
    ├── modal.html           (Modal genérico)
    └── form-contact.html    (Formulário de contato)
```

## 🎯 Objetivo

Criar componentes reutilizáveis que podem ser incluídos em múltiplas páginas, garantindo:
- ✅ Consistência visual
- ✅ Manutenção centralizada
- ✅ Menos duplicação de código
- ✅ Atualizações mais rápidas

## 📝 Como Usar

### Opção 1: Server-Side Includes (SSI)
```html
<!--#include file="templates/header.html" -->
```

### Opção 2: PHP Include
```php
<?php include 'templates/header.html'; ?>
```

### Opção 3: JavaScript (para desenvolvimento)
```javascript
fetch('templates/header.html')
    .then(response => response.text())
    .then(html => {
        document.getElementById('header').innerHTML = html;
    });
```

## 🎯 Status

- ⏳ **Planejado:** Templates serão criados na Fase 2
- 📅 **Previsão:** 13-20/12/2024

---

**Criado em:** 07/12/2024  
**Atualizado em:** 07/12/2024

