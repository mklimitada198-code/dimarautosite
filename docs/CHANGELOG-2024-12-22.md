# Changelog - 22 de Dezembro de 2024

## 🚗 Sistema de Veículos Compatíveis Estruturado

### Resumo
Implementação de um novo sistema de seleção de veículos compatíveis no painel administrativo, substituindo o campo de texto livre por dropdowns estruturados que integram com o filtro de veículos da homepage.

---

## Problema Resolvido

O sistema anterior usava um **textarea de texto livre** para definir veículos compatíveis, causando:
- ❌ Inconsistência de dados (ex: "Honda Twister" vs "Honda CB 250 Twister")
- ❌ Falha na busca por veículo da homepage
- ❌ Dados não padronizados e difíceis de filtrar

---

## Nova Funcionalidade

### Seletor Estruturado de Veículos
- **Tabs Carro/Moto** - Alterna entre tipos de veículo com estilo visual dinâmico
- **Dropdown de Marcas** - Carregado dinamicamente baseado no tipo selecionado
- **Dropdown de Modelos** - Popula automaticamente ao selecionar uma marca
- **Seleção de Anos** - Checkboxes com opção "Todos os anos"
- **Lista de Veículos** - Exibe veículos adicionados com opção de remover
- **Campo Manual** - Para veículos não listados (importados, antigos, etc.)

### Integração com Filtro da Homepage
O novo formato estruturado permite busca precisa por:
- Marca (ex: Chevrolet, Honda)
- Modelo (ex: Onix, CG 160 Titan)
- Ano (ex: 2020, 2021, 2022)

---

## Arquivos Modificados/Criados

### Novos Arquivos
| Arquivo | Descrição |
|---------|-----------|
| `dimaradmin/js/vehicle-selector.js` | Componente de seleção estruturada de veículos |
| `database/migration-structured-compatibility.sql` | Migration para nova coluna JSONB |

### Arquivos Modificados
| Arquivo | Alteração |
|---------|-----------|
| `dimaradmin/produtos.html` | Novo HTML do seletor substituindo textarea |
| `dimaradmin/js/produtos.js` | Integração com novo seletor (inicialização, salvar, carregar) |
| `js/catalog.js` | Filtro de busca atualizado para dados estruturados |

---

## Detalhes Técnicos

### Estrutura de Dados (JSONB)
```json
{
  "compatibility_structured": {
    "structured": [
      {
        "type": "carro",
        "brand": "chevrolet",
        "brandName": "Chevrolet",
        "model": "onix",
        "modelName": "Onix",
        "years": [2020, 2021, 2022]
      }
    ],
    "manual": [
      { "text": "Subaru Impreza 2015" }
    ]
  }
}
```

### Funções Principais Adicionadas

**vehicle-selector.js:**
- `initVehicleSelector()` - Inicializa o componente
- `populateBrands(type)` - Popula marcas por tipo (car/moto)
- `populateModels(type, brand)` - Popula modelos por marca
- `addVehicle()` - Adiciona veículo à lista
- `getSelectedVehicles()` - Retorna dados estruturados
- `setSelectedVehicles(data)` - Carrega dados no seletor

**produtos.js:**
- `buildCompatibilityArray()` - Converte dados estruturados para array de strings

**catalog.js:**
- Busca em 3 níveis: dados estruturados → dados manuais → formato antigo

---

## Migration SQL Necessária

> ⚠️ **IMPORTANTE:** Execute no Supabase SQL Editor antes de usar a nova funcionalidade:

```sql
ALTER TABLE products 
ADD COLUMN IF NOT EXISTS compatibility_structured JSONB DEFAULT NULL;

CREATE INDEX IF NOT EXISTS idx_products_compatibility_structured 
ON products USING GIN (compatibility_structured);
```

Arquivo completo: `database/migration-structured-compatibility.sql`

---

## Testes Realizados ✅

1. ✅ Troca de tabs Carro/Moto com atualização visual
2. ✅ Dropdown de marcas muda conforme o tipo selecionado
3. ✅ Dropdown de modelos popula corretamente
4. ✅ Seleção de anos (individual e "Todos")
5. ✅ Adicionar veículo à lista
6. ✅ Remover veículo da lista
7. ✅ Salvar produto com veículos estruturados
8. ✅ Carregar produto com veículos estruturados

---

## Retrocompatibilidade

- ✅ Produtos antigos com texto livre continuam funcionando
- ✅ Busca faz fallback para formato antigo se não encontrar estruturado
- ✅ Checkboxes de tipo de veículo mantidos (ocultos)

---

**Data:** 22/12/2024  
**Autor:** Sistema Automatizado
