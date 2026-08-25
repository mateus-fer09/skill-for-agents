# Estornos e Links de Pagamento

# Estornos

A API Reference possui operação dedicada para criação de estorno.

Regras globais relevantes:

- operações de refund exigem credenciais do merchant;
- verifique estado do pedido/pagamento antes de solicitar;
- para pedidos com split, estorno parcial não é permitido;
- em split, use somente estorno total.

Como a página de estorno apresentou bloqueio durante a coleta, confirme diretamente na documentação oficial antes de fixar:
- path exato;
- body;
- motivo;
- limite de valor;
- estados elegíveis.

# Link de pagamento

## Criar

```http
POST /v1/payment-link
```

Retorna `checkout_url`, hospedada pela Appmax.

Regra monetária documentada:

```text
value em centavos
valor mínimo: 500 = R$ 5,00
```

Exemplo conceitual:

```json
{
  "value": 15900,
  "description": "Pedido especial"
}
```

Resposta conceitual:

```json
{
  "data": {
    "checkout_url": "https://..."
  }
}
```

## Consultar pedidos de um link

```http
GET /v1/payment-link/{payment_link_id}/orders
```

Objetivo:

- acompanhar conversões;
- consultar pedidos gerados pelo link;
- observar status.

A resposta é paginada e utiliza metadados/links de navegação.
