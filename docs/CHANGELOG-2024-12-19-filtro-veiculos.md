# Correção do Filtro de Veículos - CHANGELOG 2024-12-19

## Data: 19/12/2024
## Versão: 2.0.0

---

## 🐛 Problema Identificado

**Sintoma:** Ao selecionar "Moto" no filtro de veículos da homepage e escolher a marca "Honda", os modelos exibidos eram de **carros** (Civic, City, HR-V, Fit, CR-V) em vez de **motos** (CG, Biz, Pop, Bros, etc.).

**Causa raiz:** Código duplicado no arquivo `js/script.js` que sobrescrevia a lógica correta do `vehicle-filter.js`:

1. O `vehicle-filter.js` (correto) carregava 36 modelos de moto dinamicamente do `vehicle-data.js`
2. O `script.js` (antigo) tinha uma função `populateModels()` com modelos de carro **hardcoded**
3. Como `script.js` carrega depois, ele sobrescrevia os event listeners corretos

---

## ✅ Correções Aplicadas

### 1. `js/script.js`

**Removido:** Lógica duplicada de filtro de veículos (linhas 165-275 originais)

```diff
// ==================== Vehicle Filter Logic ====================
-    const tabButtons = document.querySelectorAll('.tab-button');
-    const brandSelect = document.getElementById('brandSelect');
-    const modelSelect = document.getElementById('modelSelect');
-    const yearSelect = document.getElementById('yearSelect');
-    // ... 110+ linhas de código conflitante com marcas hardcoded
+    // REMOVIDO: Lógica duplicada que conflitava com vehicle-filter.js
+    // O filtro de veículos é gerenciado por vehicle-data.js + vehicle-filter.js
+    // que carregam marcas/modelos dinamicamente para carros E motos
```

### 2. `index.html`

**Removido:** Opções de marcas hardcoded no select de marcas

```diff
<select class="filter-select" id="brandSelect" required>
    <option value="">Selecione a Marca</option>
-   <option value="chevrolet">Chevrolet</option>
-   <option value="ford">Ford</option>
-   <option value="volkswagen">Volkswagen</option>
-   <option value="fiat">Fiat</option>
-   <option value="honda">Honda</option>
-   <option value="toyota">Toyota</option>
-   <option value="jeep">Jeep</option>
+   <!-- Opções carregadas dinamicamente via vehicle-data.js e vehicle-filter.js -->
</select>
```

**Adicionado:** Cache busting para forçar atualização do script

```diff
-<script src="js/script.js" defer></script>
+<script src="js/script.js?v=2.0.0" defer></script>
```

---

## 📊 Resultado

### Antes (Problema)
- Moto > Honda → Civic, City, HR-V, Fit, CR-V ❌

### Depois (Corrigido)
- Moto > Honda → CG 125, CG 150, CG 160, Biz 100/110/125, Pop 100/110, Bros 125/150/160, XRE 190/300, PCX 150/160, CB 250 Twister, Hornet, CBR 650R, etc. ✅

---

## 📁 Arquivos Modificados

| Arquivo | Alteração |
|---------|-----------|
| `js/script.js` | Removida lógica duplicada de filtro (108 linhas) |
| `index.html` | Removidas opções hardcoded + cache busting |

---

## 🔧 Sistema de Filtro de Veículos

O filtro agora funciona corretamente com 3 arquivos:

1. **`js/vehicle-data.js`** - Dados de marcas e modelos
   - 14 marcas de carros
   - 10 marcas de motos
   - Centenas de modelos para cada marca

2. **`js/vehicle-filter.js`** - Lógica de UI
   - Gerencia tabs Carro/Moto
   - Popula selects dinamicamente
   - Submissão do formulário

3. **`index.html`** - Estrutura HTML
   - Selects vazios (populados via JS)
   - Tabs para alternar tipo de veículo

---

## 🚀 Deploy

Para aplicar em produção:

```bash
git add .
git commit -m "fix: corrigir filtro de veículos - modelos de moto agora aparecem corretamente"
git push
```

A Vercel fará deploy automático.
