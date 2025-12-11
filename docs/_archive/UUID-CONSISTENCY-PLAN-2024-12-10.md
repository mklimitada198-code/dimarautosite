# 🔒 PLANO DE IMPLEMENTAÇÃO: UUID Consistency Fix

**Data:** 10/12/2024 19:52  
**Objetivo:** Eliminar definitivamente o erro `invalid input syntax for type uuid: "cat_X"`

---

## 1️⃣ AUDITORIA DO SCHEMA DO BANCO ✅

### Tabelas com UUID Primary Key:
```sql
✅ products.id          → UUID DEFAULT gen_random_uuid()
✅ categories.id        → UUID DEFAULT gen_random_uuid()
✅ brands.id            → UUID DEFAULT gen_random_uuid()
✅ banners.id           → UUID DEFAULT gen_random_uuid()
✅ customers.id         → UUID DEFAULT gen_random_uuid()
✅ orders.id            → UUID DEFAULT gen_random_uuid()
✅ reviews.id           → UUID DEFAULT gen_random_uuid()
```

### Colunas com Foreign Key UUID:
```sql
categories.parent_id    → UUID REFERENCES categories(id)
customers.user_id       → UUID REFERENCES auth.users(id)
addresses.customer_id   → UUID REFERENCES customers(id)
orders.customer_id      → UUID REFERENCES customers(id)
order_items.order_id    → UUID REFERENCES orders(id)
order_items.product_id  → UUID REFERENCES products(id)
reviews.product_id      → UUID REFERENCES products(id)
reviews.customer_id     → UUID REFERENCES customers(id)
```

### ⚠️ PROBLEMA: Coluna VARCHAR sendo usada!
```sql
❌ products.category    → VARCHAR(100) NOT NULL
❌ products.brand       → VARCHAR(100) NOT NULL
```

**AÇÃO NECESSÁRIA:** Migrar para UUID ou aceitar VARCHAR como está.

---

##  2️⃣ AUDITORIA DO FRONTEND ✅

### Fontes de IDs inválidos encontradas:

#### **categorias.js - Linha 55-64:**
```javascript
❌ function getDefaultCategories() {
    return [
        { id: 'cat_1', name: 'Motor', ... },
        { id: 'cat_2', name: 'Freios', ... },
        ...
    ];
}
```

**IMPACTO:**
- Usado quando `checkSupabaseConfig()` retorna `false`
- IDs "cat_X" entram no array `categories`  
- Edit/Delete tentam usar esses IDs → ERRO!

---

## 3️⃣ CORREÇÕES OBRIGATÓRIAS

### ✅ CORREÇÃO 1: Eliminar getDefaultCategories()
### ✅ CORREÇÃO 2: UUID Validation Helper
### ✅ CORREÇÃO 3: Validar antes de operações críticas
### ✅ CORREÇÃO 4: Prevenir localStorage com cat_X

[Ver implementação completa no arquivo]

---

## 📊 PRÓXIMOS PASSOS

1. Implementar validação UUID
2. Remover getDefaultCategories fallback
3. Adicionar checks em edit/delete
4. Testar todas operações CRUD

