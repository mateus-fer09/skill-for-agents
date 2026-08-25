# Assinaturas

## Criar

```http
POST /v1/subscriptions
```

A assinatura é criada a partir de um pedido existente.

Pré-requisitos documentados:

- pedido pertence à mesma loja;
- forma de pagamento: cartão de crédito ou Pix;
- pedido em estado aprovado/integrado após antifraude;
- um pedido pode originar mais de uma assinatura.

## Consultar

```http
GET /v1/subscriptions/{id}
```

Retorna:

- detalhes;
- produtos;
- ciclos;
- histórico de cobranças.

## Listar

A documentação possui uma operação dedicada de listagem de assinaturas. Confirme o contrato exato na referência oficial antes de implementar filtros/paginação.

## Pausar

Existe operação dedicada para pausar assinatura. Ao usar esta função, valide o endpoint e estados permitidos na referência oficial atual.

## Reativar

```http
PATCH /v1/subscriptions/{id}/activate
```

- sem body;
- retoma cobranças;
- resposta atualizada com `status: ACTIVE`.

## Cancelar

```http
PATCH /v1/subscriptions/{id}/cancel
```

- cancelamento definitivo;
- pode aceitar motivo;
- resposta passa a `CANCELLED`;
- `canceled_at` é preenchido.

## Alterar dia de cobrança

```http
PATCH /v1/subscriptions/{id}/charge-day
```

Recalcula `next_charge_at`.

## Alterar periodicidade

```http
PATCH /v1/subscriptions/{id}/frequency
```

Conceitos:

```text
interval
interval_count
```

A periodicidade deve ser compatível com o produto. Para origem Shopify, a cadência precisa existir como variante/plano compatível, ou a API pode responder `422`.

## Pular ciclo

```http
PATCH /v1/subscriptions/{id}/cycles/{cycleIndex}/skip
```

- somente ciclo futuro;
- não gera pedido/cobrança naquele ciclo;
- use `completed_cycles` como referência.

## Desfazer skip

```http
PATCH /v1/subscriptions/{id}/cycles/{cycleIndex}/unskip
```

O ciclo deve:

- estar marcado como pulado;
- ainda não ter sido processado.

## Atualizar endereço

```http
PATCH /v1/subscriptions/{id}/address
```

Normalizações descritas:

- `postcode`: apenas dígitos;
- `state`: maiúsculas.

Atenção: a alteração ocorre no cliente vinculado, afetando futuras assinaturas/pedidos desse cliente.

## Atualizar tag

```http
PATCH /v1/subscriptions/{id}/tag
```

- rótulo livre;
- máximo documentado: 255 caracteres;
- `""` ou `null` remove;
- sem tag explícita, a API usa padrão semelhante a `#assinatura{id}`;
- tag é voltada à API/relatórios.

## Produtos disponíveis

```http
GET /v1/subscriptions/{id}/available-products
```

### Shopify

- lista produtos/variantes compatíveis com cadência;
- busca `q` é importante e pode ser necessária para obter resultados.

### Produtos internos Appmax

- produtos ativos;
- formato simples;
- documentação menciona limite de até 30 itens.

## Adicionar produtos

```http
POST /v1/subscriptions/{id}/products
```

### Produto interno

```json
{
  "product_id": 10,
  "quantity": 2
}
```

### Shopify

```json
{
  "shopify_product_id": "gid://...",
  "shopify_variant_id": "gid://...",
  "quantity": 1
}
```

Sempre prefira IDs retornados por `available-products`.

## Alterar quantidade

```http
PATCH /v1/subscriptions/{id}/products/{variantId}/quantity
```

`variantId` significa:

- `product_id` para produto interno;
- `variant_id` para Shopify.

## Remover

```http
DELETE /v1/subscriptions/{id}/products/{variantId}
```

A assinatura deve conservar pelo menos um produto. Para encerrar totalmente, use cancelamento.

## Regra operacional para mutação de produtos

Mudanças de produtos devem ocorrer quando a assinatura estiver em estado que permita edição e sem cobrança em andamento. Erros `409`/`422` podem indicar bloqueio por estado/regra.
