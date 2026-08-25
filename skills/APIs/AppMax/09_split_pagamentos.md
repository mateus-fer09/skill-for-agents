# Split de Pagamentos

## Conceito

Divide o valor líquido do pedido entre:

```text
marketplace
+
1..N recebedores
```

## Fluxo obrigatório

```text
1. POST /v1/recipient
2. POST /v1/recipient/{recipient_hash}/facematch-link
3. GET  /v1/recipient/{recipient_hash}/status
4. aguardar Onboarding completed
5. criar pedido
6. POST /v1/orders/{orderId}/split-order
7. processar pagamento
8. consultar saldos
9. sacar saldo disponível ou antecipar saldo a liberar
```

## Regra de cálculo

Split sobre o líquido:

```text
pedido bruto          = 10000
taxas Appmax           = 1000
partner_total líquido  = 9000
valor recebedores      = 4000
saldo marketplace      = 5000
```

Não calcule split usando o bruto.

## Restrições críticas

- Não criar/alterar split depois de `aprovado`.
- Pedidos com split: sem estorno parcial.
- Recipient precisa estar aprovado no onboarding.
- Valores de split são em centavos.
- O total destinado aos recipients não deve exceder o líquido disponível.

A documentação informa que, se a soma exceder `partner_total`, pode ocorrer ajuste proporcional/residual; não dependa disso como mecanismo normal de validação — valide antes no seu sistema.

---

# Recebedor

## Criar

```http
POST /v1/recipient
```

Retorna `recipient_hash`.

Status de onboarding:

```text
Awaiting face match completion
Onboarding on verification
Onboarding completed
```

## KYC/facematch

```http
POST /v1/recipient/{recipient_hash}/facematch-link
```

Body:

```json
{
  "phone": "5511999999999"
}
```

A documentação informa que SMS não é enviado no ambiente de homologação; teste do disparo real deve ser realizado em produção.

## Consultar status

```http
GET /v1/recipient/{recipient_hash}/status
```

Somente `Onboarding completed` deve ser tratado como pronto para split.

---

# Criar split

```http
POST /v1/orders/{orderId}/split-order
```

Cada linha referencia um `recipient_hash`.

Exemplo conceitual:

```json
{
  "recipients": [
    {
      "recipient_hash": "UUID",
      "value": 2500
    }
  ]
}
```

---

# Saldos

```http
GET /v1/recipient/{recipient_hash}/balances
```

Tipos:

```text
available  → liberado para saque
to_release → em compensação, potencialmente antecipável
```

---

# Simular antecipação

```http
GET /v1/recipient/{recipient_hash}/withdraw-request/anticipation/simulate?value=10000
```

Não movimenta saldo.

Retorno possui dados como:

```text
valor bruto
valor líquido
taxa
percentual
```

---

# Solicitar antecipação

```http
POST /v1/recipient/{recipient_hash}/withdraw-request/anticipation
```

Body:

```json
{
  "value": 1000
}
```

Movimenta saldo `to_release`.

---

# Saque com saldo disponível

```http
POST /v1/recipient/{recipient_hash}/withdraw-request/available
```

Body:

```json
{
  "value": 1000
}
```

Sem taxa de antecipação. Se só houver `to_release`, pode retornar saldo insuficiente.

---

# Consultar saque

```http
GET /v1/withdraw-request/{withdrawRequestId}
```

Retorna:

- status;
- valores;
- conta bancária;
- informações da solicitação.

---

# Conta bancária

Tipos documentados:

| Código | Tipo |
|---|---|
| `CC` | conta corrente |
| `CD` | conta digital |
| `PG` | conta de pagamento |
| `PP` | poupança |

O campo de banco utiliza código COMPE da instituição homologada.

A lista oficial de bancos é dinâmica. Não hardcode uma lista eterna; mantenha-a atualizável.
