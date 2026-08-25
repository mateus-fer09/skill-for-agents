# Status, Erros e Regras Operacionais

## HTTP

```text
200 sucesso
201 criado
400 regra/requisição
401 token inválido/expirado
404 não encontrado
409 conflito
422 validação
500 erro interno
```

## Padrão recomendado de tratamento

```ts
switch (response.status) {
  case 200:
  case 201:
    return parseSuccess(response);

  case 401:
    await tokenCache.invalidate();
    throw new RetryWithNewToken();

  case 404:
    throw new ResourceNotFound();

  case 409:
    throw new StateConflict(await response.json());

  case 422:
    throw new ValidationError(await response.json());

  default:
    throw new AppmaxApiError(response.status, await response.text());
}
```

## Status de pedido

A documentação mantém uma página dedicada de status de pedidos. Como enums podem evoluir, não reduza o sistema local a apenas `pending/paid/cancelled`.

Estratégia:

```ts
type AppmaxOrderStatus = string;

function isSuccessful(status: string) {
  return ["aprovado", "integrado"].includes(status);
}
```

Mantenha fallback para status desconhecido e registre-o em observabilidade.

## Status de recipient

Valores documentados:

```text
Awaiting face match completion
Onboarding on verification
Onboarding completed
```

Ação sugerida:

| Status | Ação |
|---|---|
| Awaiting face match completion | aguardar usuário concluir KYC |
| Onboarding on verification | aguardar análise |
| Onboarding completed | habilitar split |

## Invariantes

### Pedido

- cliente deve existir;
- IDs devem pertencer ao merchant autenticado;
- valor deve obedecer unidade esperada.

### Cartão

- tokenizar;
- não logar PAN/CVV;
- não persistir dados sensíveis sem escopo de conformidade adequado.

### Pix

- cronômetro baseado em timestamp retornado.

### Boleto

- expor link/linha digitável adequadamente.

### Assinatura

- respeitar estado antes de alterar produto/ciclo;
- cancelar é diferente de pausar;
- endereço altera cliente.

### Split

- KYC completo;
- split antes da aprovação;
- cálculo pelo líquido;
- sem estorno parcial.

## Observabilidade

Registre:

```text
request_id local
merchant_local_id
endpoint
http_status
appmax resource id
event
latency
retry_count
error_code/message
```

Nunca registre:

```text
client_secret em texto puro
PAN
CVV
token sensível completo
```
