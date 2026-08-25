# Clientes, Produtos e Pedidos

## Clientes

O cliente deve existir antes do pedido.

Fluxo:

```text
buyer data
  ↓
POST /v1/customers
  ↓
customer_id
  ↓
POST /v1/orders
```

Exemplo de payload conceitual:

```json
{
  "first_name": "Ana",
  "last_name": "Silva",
  "email": "ana@example.com",
  "phone": "11999999999",
  "ip": "203.0.113.10"
}
```

O `ip` deve representar o comprador quando a integração exigir esse dado.

---

# Produtos

## Listar

```http
GET /v1/products
```

### Query params documentados

| Parâmetro | Tipo | Observação |
|---|---|---|
| `page` | integer | começa em 1 |
| `name` | string | busca parcial |
| `status` | string | `active`, `inactive`, `all` |
| `sort_by` | string | `name`, `price`, `created_at` |
| `sort_dir` | string | `asc`, `desc` |

A listagem documentada retorna 20 itens por página.

## Consultar

```http
GET /v1/products/{id}
```

Produtos de outra company não devem ser expostos e são tratados como inexistentes.

## Criar

```http
POST /v1/products
```

Regras relevantes:

- `name` obrigatório;
- `price` obrigatório;
- criado ativo;
- `sku` deve ser único por company quando informado;
- `external_id` deve ser único por company quando informado;
- conflito de unicidade pode retornar `422`.

## Atualizar

```http
PUT /v1/products/{id}
```

Envie apenas os campos a alterar.

## Excluir

```http
DELETE /v1/products/{id}
```

É soft delete:

```text
is_active = false
```

Se o produto estiver vinculado a assinatura, a operação pode ser bloqueada com `409`.

---

# Pedidos

## Criar pedido

```http
POST /v1/orders
```

Pré-requisito:

```text
customer_id válido
```

Exemplo conceitual:

```json
{
  "customer_id": 123,
  "products": [
    {
      "sku": "PROD-001",
      "name": "Produto",
      "quantity": 2,
      "unit_value": 4990,
      "type": "physical"
    }
  ]
}
```

Guarde o `order_id`.

## Consultar

```http
GET /v1/orders/{order_id}
```

Use para obter detalhes e status atual.

## Cálculo do valor

A documentação descreve cálculo baseado no `unit_value` dos produtos e componentes como frete.

Conceito:

```text
subtotal = Σ(unit_value × quantity)
base_financeira = subtotal + shipping_value
total_final = base_financeira + juros - descontos
```

Não recalcule taxas de parcelamento “no escuro”; use a rota de parcelas.

## Código de rastreio

```http
POST /v1/orders/shipping-tracking-code
```

O rastreio possui impacto operacional na liberação de saques do merchant.

## Relações essenciais

```text
Customer 1 ─── N Orders
Order    1 ─── N Products
Order    1 ─── N/1 Payment attempts
Order    1 ─── 0/1 Split configuration
```
