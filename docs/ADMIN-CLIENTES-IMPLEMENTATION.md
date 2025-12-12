# 👥 Seção de Gerenciamento de Clientes - Admin

**Data:** 12/12/2024  
**Versão:** 1.0

---

## Resumo

Implementação completa de uma seção para gerenciar e visualizar clientes cadastrados no painel administrativo.

---

## Arquivos Criados

### `dimaradmin/clientes.html`
Página principal com:
- **Stats Cards**: Total de clientes, novos este mês, com pedidos, total de pedidos
- **Tabela paginada**: Avatar, nome, email, telefone, data cadastro, qtd pedidos
- **Busca**: Por nome ou email
- **Modal de detalhes**: Informações do cliente, endereços e histórico de pedidos

### `dimaradmin/js/clientes.js`
Script com funções:
- `loadCustomers()` - Carrega lista paginada
- `searchCustomers()` - Busca por nome/email
- `viewCustomerDetails()` - Abre modal com detalhes
- Paginação, formatação de data/moeda

### `database/admin-customers-policy.sql`
Policy RLS para permitir admin visualizar todos os clientes:
```sql
CREATE POLICY "Admin can view all customers" ON customers
    FOR SELECT USING (auth.role() = 'authenticated');
```

---

## Arquivos Modificados

| Arquivo | Alteração |
|---------|-----------|
| `dimaradmin/index.html` | +item sidebar, +stat card clientes |
| `dimaradmin/js/dashboard.js` | +contagem de clientes |
| `dimaradmin/produtos.html` | +item sidebar |
| `dimaradmin/categorias.html` | +item sidebar |
| `dimaradmin/banners.html` | +item sidebar |
| `dimaradmin/marcas.html` | +item sidebar |

---

## Funcionalidades

| Feature | Descrição |
|---------|-----------|
| 📊 Stats | 4 cards com métricas de clientes |
| 📋 Tabela | Lista paginada (10 por página) |
| 🔍 Busca | Por nome ou email |
| 👁️ Detalhes | Modal com endereços e pedidos |
| 📱 Responsivo | Adaptável a diferentes telas |

---

## Próximo Passo (Manual)

Executar o script SQL no Supabase:
1. Acessar Supabase Dashboard → SQL Editor
2. Colar conteúdo de `database/admin-customers-policy.sql`
3. Executar

---

## Tabelas Utilizadas

| Tabela | Uso |
|--------|-----|
| `customers` | Lista de clientes |
| `customer_addresses` | Endereços do cliente |
| `orders` | Pedidos do cliente |

---

## Acesso

```
/dimaradmin/clientes.html
```

Ou pelo sidebar: **Clientes** (ícone de pessoas)
