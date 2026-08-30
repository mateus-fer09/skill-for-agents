---
title: "Relatórios Financeiros e Operacionais"
description: "Endpoints de extração de relatórios consolidados de vendas, pedidos, estornos, taxas e conciliação."
topics:
  - relatorios
  - conciliacao
  - extratos
  - metricas
keywords:
  - relatorios
  - reports
  - extrato
  - conciliacao
  - vendas
  - faturamento
  - taxas
related:
  - ../../index_master.md
source_scope:
  - https://docs.appmax.com.br/api-reference/reports/index
---

# Relatórios

> [!WARNING]
> **Documentação em validação**
> Esta página ainda não foi publicada na navegação do site. Os dicionários de campos abaixo derivam do Manual de Conciliação Financeira e de respostas reais da API, mas alguns pontos seguem em validação — em especial os filtros de período de cada rota.

## Visão geral

A API de Relatórios expõe consultas que cobrem todo o ciclo financeiro de uma transação — da venda aprovada ao movimento de saldo — para conciliação financeira e integração com ERP:

1. **Pedidos** — registro de cada transação aprovada. Ponto de partida da conciliação.
2. **Repasse** — gerado quando o cliente solicita saque. Vinculado via `order_id`.
3. **Cancelamento / Chargebacks** — gerado quando há devolução ao cliente final.
4. **Débitos / Créditos** — ajustes avulsos: recuperação, crédito/débito manual, chargeback vencido.
5. **Extrato Financeiro** — espelho de todos os movimentos do saldo em ordem cronológica.

Complementarmente, **Taxas** retorna a configuração vigente de taxas do site.

A chave de junção universal entre os relatórios é o **`order_id`**. O relatório de Repasse tem chave primária própria (`id_saque`), mas também carrega `order_id` para o vínculo com a venda original — veja o [modelo relacional](#modelo-relacional).

## Rotas disponíveis

Todas as rotas usam `POST` e o mesmo [contrato de autenticação e convenções](#autenticacao-e-convencoes):

| Endpoint | Relatório |
| --- | --- |
| POST /v1/reports/pedidos | Pedidos |
| POST /v1/report/repasse | Repasse |
| POST /v1/report/recebimento_cancelamento | Cancelamento / Chargebacks |
| POST /v1/report/recebimento_debito_credito | Débitos / Créditos |
| POST /v1/report/extrato | Extrato Financeiro |
| POST /v1/report/taxas | Taxas |

## Autenticação e convenções

### Ambientes

| Ambiente | Gateway | Emissor do token |
| --- | --- | --- |
| Produção | https://api.appmax.com.br | https://auth.appmax.com.br/oauth2/token |
| Sandbox / HLG | https://api.sandboxappmax.com.br | https://auth.sandboxappmax.com.br/oauth2/token |

### Obtenção do token

Fluxo `client_credentials` (OAuth2), com `client_id` e `client_secret` em Basic Auth — o mesmo fluxo descrito em [Autenticação e autorização](../../primeiros_passos/autenticacao.md):

```bash
# retorna { "access_token": "...", "expires_in": 600, ... }
curl -s -X POST "https://auth.appmax.com.br/oauth2/token" \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -u "CLIENT_ID:CLIENT_SECRET" \
  -d "grant_type=client_credentials"
```

> [!NOTE]
> **A identidade do site vem do token, não de header**
> O site consultado é derivado do `client_id` presente no JWT — cada credencial só enxerga o próprio site. Não envie o site por header: o antigo `X-Site-Id` é ignorado. Adulterar o token invalida a assinatura e o gateway rejeita com `403`.

### Corpo da requisição

JSON com paginação. `page` e `limit` são aceitos em todas as rotas e refletidos na resposta:

| Campo | Tipo | Obrigatório | Descrição |
| --- | --- | --- | --- |
| page | integer | Não | Página da consulta, começando em 1. |
| limit | integer | Não | Registros por página. Máximo e padrão: 100. |

Filtros de período são aceitos conforme o relatório — no [Extrato](#extrato-financeiro), `startDate` e `endDate`; os nomes de campo das demais rotas estão em validação.

```bash
curl -s -X POST "https://api.appmax.com.br/v1/report/taxas" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"page":1,"limit":10}'
```

### Envelope de resposta

```json
{
  "data": [ /* linhas do relatório */ ],
  "pagination": { "page": 1, "limit": 10, "total_records": 1, "total_pages": 1 }
}
```

Se `pagination.total_pages` vier maior que `1`, repita a requisição incrementando `page` até cobrir todas as páginas.

### Códigos de status

| Status | Significado | Corpo |
| --- | --- | --- |
| 200 | Consulta com resultados. | data: [ … ] |
| 400 | Consulta válida, porém sem resultados no período/site. | data: [] |
| 401 | Credencial não mapeada a nenhum site no serviço de relatórios. | {"message":"Unknown client_id"} |
| 403 | Token inválido/adulterado — ou bloqueio transitório de edge em rajadas de requisições. | {"message":"Unauthorized"} |

> [!TIP]
> **Use datas para limitar o volume**
> Consultas sem filtro de data tendem a ser mais lentas e podem estourar o tempo limite. Para períodos longos, divida a consulta — mês a mês em vez de um ano inteiro de uma vez.

## Pedidos

**Endpoint:** `POST /v1/reports/pedidos`

Uma linha por transação aprovada. Ponto de partida da conciliação.

| Campo | Descrição |
| --- | --- |
| order_id | Chave primária. Identifica unicamente a transação e é a chave de junção com os demais relatórios. |
| bandeira | Bandeira do cartão ou meio de pagamento (ex.: Visa, Mastercard, Boleto, Pix). |
| pv | CNPJ da entidade vendedora. |
| data_venda | Timestamp do momento exato da autorização da transação. |
| valor_bruto_venda | Montante total pago pelo cliente final, sem deduções. |
| valor_liquido_venda | Montante líquido creditado ao lojista após dedução das taxas de processamento. |
| valor_taxas | Valor retido pela Appmax a título de taxa de serviço. |
| numero_parcelas | Quantidade total de parcelas da transação. |
| tipo_pagamento | Meio de pagamento utilizado (ex.: CreditCard, Pix, Boleto). |
| updated_at | Timestamp da última atualização do registro no sistema. |

## Repasse

**Endpoint:** `POST /v1/report/repasse`

Uma linha por pedido dentro de cada saque — as colunas de totais repetem o mesmo valor em todas as linhas do mesmo `id_saque`.

| Campo | Descrição |
| --- | --- |
| id_saque | Chave primária do repasse (id da solicitação de saque). Cada saque pode conter múltiplos pedidos — valor_saiu_saldo, valor_depositado e total_taxas repetem o mesmo valor em todas as linhas do saque. |
| data_solicitacao | Data em que o lojista solicitou o saque. |
| data_pagamento | Data em que o valor foi efetivamente pago. |
| valor_saiu_saldo | Valor total que saiu do saldo no saque. Corresponde ao movimento no Extrato Financeiro e deve ser igual à soma dos valor_liquido_pagamento do mesmo id_saque. |
| valor_depositado | Valor efetivamente depositado após dedução das taxas: valor_saiu_saldo − total_taxas. |
| total_taxas | Total de taxas cobradas sobre o saque. |
| order_id | Chave de junção com Pedidos. Identifica o pedido individual dentro do saque. |
| bandeira | Bandeira/meio de pagamento da transação. |
| valor_bruto_pagamento | Valor bruto do pedido individual — corresponde ao valor_liquido_venda da transação original, antes das taxas de saque. |
| valor_liquido_pagamento | Valor líquido do pedido após dedução das taxas proporcionais. |
| valor_taxas_pedido | Taxa de saque proporcional cobrada sobre este pedido individual. |
| tipo | Natureza do evento — ver tabela abaixo. |
| tipo_pagamento | Meio de pagamento da transação original. |

**Valores do campo `tipo`:**

| Valor | Descrição |
| --- | --- |
| antecipacao | Repasse solicitado antes da data de vencimento original da parcela. Sujeito a taxa de adiantamento. |
| saque_normal | Repasse realizado na data de vencimento programada, sem taxa de adiantamento. |
| liquidacao_centralizada | Repasse liquidado via arranjo de liquidação centralizada, diretamente pela bandeira ou câmara de compensação. |

## Cancelamento / Chargebacks

**Endpoint:** `POST /v1/report/recebimento_cancelamento`

Uma linha por evento de devolução — parcial, total ou chargeback.

| Campo | Descrição |
| --- | --- |
| tipo | Tipo do evento. Enum único, valores em minúsculo sem acento — ver tabela abaixo. |
| order_id | Chave de junção com Pedidos. |
| data_reembolso | Data em que o reembolso ao cliente final foi processado. |
| valor_bruto_venda | Valor original da transação, sem deduções. Nos eventos de cancelamento_total e chargebacks, é o valor integralmente devolvido ao cliente final. |
| valor_liquido_venda | Valor líquido original creditado pela venda. Referência base para o cálculo de valor_cancelado. |
| valor_cancelado | Valor efetivamente cobrado do lojista pelo evento. Em cancelamento total e chargebacks, corresponde ao valor_liquido_venda; em cancelamento parcial, à parcela proporcional (que também é o valor devolvido ao cliente). |

**Valores do campo `tipo`:**

| Valor | Descrição |
| --- | --- |
| cancelamento_parcial | Devolução de parte do valor da transação ao cliente final. |
| cancelamento_total | Devolução integral. A taxa de estorno é registrada à parte em Débitos/Créditos como taxa_estorno. |
| chargeback_em_tratativa | Contestação recebida; em análise interna pela Appmax. |
| chargeback_em_disputa | Contestação enviada à bandeira para disputa formal. |
| chargeback_vencido | Prazo de disputa encerrado sem reversão. Valor debitado definitivamente. |
| chargeback_perdido | Disputa encerrada em favor do cliente final. A taxa é registrada à parte em Débitos/Créditos como Diferença Chargeback. |
| recusado_por_risco | Transação recusada pelo antifraude antes da aprovação. Nenhum valor é cobrado do cliente. |

> [!NOTE]
> **Atenção ao ERP**
> O campo `tipo` é um enum único — não há colunas separadas para tipo de evento e status. Filtre por prefixo (`cancelamento_` ou `chargeback_`) para segregar os grupos. Registros `recusado_por_risco` não geram saque e não aparecem no Extrato Financeiro — uma transação só entra no extrato após ser aprovada.

## Débitos / Créditos

**Endpoint:** `POST /v1/report/recebimento_debito_credito`

Ajustes avulsos no saldo não contemplados nos demais relatórios.

| Campo | Descrição |
| --- | --- |
| data_ajuste | Data em que o ajuste foi realizado no saldo. |
| tipo_evento | Natureza do ajuste. Sem padronização fixa de formatação (pode conter maiúsculas e acentos). Ex.: recuperacao, credito_manual, debito_manual, chargeback_vencido, taxa_estorno, Diferença Chargeback. |
| debito_credito | Direção do ajuste: 1 = Débito (saída), 2 = Crédito (entrada). Aqui o campo valor não carrega sinal — a direção vem exclusivamente deste campo. |
| order_id | Chave de junção com Pedidos, quando o ajuste estiver vinculado a uma transação (nullable). |
| valor | Montante financeiro do ajuste. |

**Tipos de evento:**

| Valor | Descrição |
| --- | --- |
| recuperacao | Custo pelo envio de tentativa de recuperação de venda (ex.: carrinho abandonado). Débito no saldo. |
| credito_manual | Ajuste positivo realizado manualmente pela Appmax. |
| debito_manual | Ajuste negativo realizado manualmente pela Appmax. |
| chargeback_vencido | Gerado quando a Appmax recupera com sucesso um chargeback contestado — ver exemplo abaixo. |

Exemplo — chargeback_vencido

Venda original de R$ 100,00, taxa de processamento R$ 3,90 (`valor_liquido_venda` = R$ 96,10), `Diferença Chargeback` já cobrada = R$ 5,00. A recuperação gera três linhas, todas vinculadas ao mesmo `order_id`:

| Evento | D/C | Valor | Descrição |
| --- | --- | --- | --- |
| Devolução valor líquido | Crédito | R$ 96,10 | Devolução do valor_liquido_venda cobrado no Cancelamento/CBK. |
| Devolução Diferença Chargeback | Crédito | R$ 5,00 | Devolução da Diferença Chargeback cobrada em Débitos/Créditos. |
| Taxa de recuperação | Débito | R$ 15,00 | Taxa cobrada pela Appmax pelo serviço de recuperação. |

## Extrato Financeiro

**Endpoint:** `POST /v1/report/extrato`

Consolidação cronológica de todos os movimentos do saldo, com o valor da carteira antes e depois de cada lançamento.

### Requisição

Além de `page` e `limit`, o extrato aceita filtro de período:

| Campo | Tipo | Obrigatório | Descrição |
| --- | --- | --- | --- |
| startDate | string | Não | Início do período. Formato AAAA-MM-DD HH:MM:SS. Ex.: "2025-01-01 00:00:01". |
| endDate | string | Não | Fim do período. Formato AAAA-MM-DD HH:MM:SS. Ex.: "2025-01-31 23:59:59". |
| limit | integer | Não | Registros por página. Máximo e padrão: 100. |
| page | integer | Não | Número da página, começando em 1. |

```bash
curl --request POST \
  --url https://api.appmax.com.br/v1/report/extrato \
  --header 'Authorization: Bearer SEU_TOKEN' \
  --header 'Content-Type: application/json' \
  --data '{
    "startDate": "2025-01-01 00:00:01",
    "endDate": "2025-01-31 23:59:59",
    "page": 1,
    "limit": 10
  }'
```

### Resposta

```json
{
  "data": [
    {
      "company_name": "Empresa Exemplo LTDA",
      "data": "2025-11-19 16:40:48",
      "tipo": "Crédito",
      "balance": "Disponível para saque",
      "order_id": 12345,
      "categoria": "Valor Líquido",
      "valor": "26.400000",
      "taxa_adiantamento": "0.000000",
      "taxa_minima_saque": "0.000000",
      "valor_balance_antes": "0.000000",
      "valor_balance_depois": "26.400000",
      "valor_global_antes": "0.000000",
      "valor_global_depois": "26.400000"
    },
    {
      "company_name": "Empresa Exemplo LTDA",
      "data": "2025-11-19 16:41:00",
      "tipo": "Débito",
      "balance": "Disponível para saque",
      "order_id": null,
      "categoria": "Cobrança envio SMS",
      "valor": "-0.800000",
      "taxa_adiantamento": "0.000000",
      "taxa_minima_saque": "0.000000",
      "valor_balance_antes": "4679.950000",
      "valor_balance_depois": "4679.150000",
      "valor_global_antes": "4679.950000",
      "valor_global_depois": "4679.150000"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 100,
    "total_records": 2,
    "total_pages": 1
  }
}
```

**Campos da movimentação (`data[]`):**

| Campo | Descrição |
| --- | --- |
| company_name | Nome da empresa associada à movimentação. |
| data | Timestamp do momento exato da movimentação no saldo. |
| tipo | Direção do movimento: crédito (entrada) ou débito (saída — taxa, estorno ou saque). |
| balance | Carteira afetada — ver Glossário de carteiras. |
| categoria | Classificação detalhada do lançamento. Ex.: Valor Líquido (venda já com taxas descontadas), Saque Solicitado, Chargeback, Estorno, Crédito Manual, Cobrança Recuperação Abandono. |
| order_id | Chave de junção com Pedidos, quando aplicável. null quando não há pedido. |
| valor | Montante já assinado: positivo = crédito, negativo = débito. É o único relatório onde valor carrega o sinal. |
| taxa_adiantamento | Taxa de adiantamento aplicada, quando houver antecipação. 0.00 quando não se aplica. |
| taxa_minima_saque | Taxa mínima de saque aplicada, quando houver. 0.00 quando não se aplica. |
| valor_balance_antes / valor_balance_depois | Saldo da carteira (balance) imediatamente antes/depois desta movimentação. |
| valor_global_antes / valor_global_depois | Saldo total consolidado imediatamente antes/depois desta movimentação. |

> [!NOTE]
> **Saldo da carteira × saldo global**
> Os campos `valor_balance_*` mostram como a carteira específica mudou; os `valor_global_*` mostram o saldo total da conta (a soma de todas as carteiras). Para o impacto geral no caixa, olhe o `valor_global_*`.

## Taxas

**Endpoint:** `POST /v1/report/taxas`

Configuração vigente de taxas de pedido e de saque do site.

| Campo | Descrição |
| --- | --- |
| company_id | Identificador da empresa (site). |
| tipo_recebimento | Modalidade de recebimento vigente (ex.: d30). |
| id_taxas_pedido | Identificador da configuração de taxas de pedido aplicada. |
| taxas_pedido | Objeto com as taxas por meio de pagamento — ver detalhamento abaixo. |
| id_taxas_saque | Identificador da configuração de taxas de saque aplicada. |
| recebimento | Prazos de recebimento em dias por meio: creditcard, pix, boleto. |
| retencao | Política de retenção: tipo (ex.: garantia), percentual, janela (dias) e flags considera_cartao / considera_pix / considera_boleto. |
| taxas_saque | Taxas de saque: taxa_antecipacao e objeto isencao (valor_minimo, taxa_minima). |

**Objeto `taxas_pedido`:**

| Chave | Descrição |
| --- | --- |
| creditcard | tipo, processamento, tipo_parcelamento, parcelamento (percentual por número de parcelas, 1–12), fixa, minima. |
| pix | percentual, fixa, minima. |
| boleto | percentual, fixa, minima. |

### Exemplo de resposta

```json
{
  "data": [{
    "company_id": 12345,
    "tipo_recebimento": "d30",
    "id_taxas_pedido": 111,
    "taxas_pedido": {
      "creditcard": {
        "tipo": "Taxa Padrão Nominal",
        "processamento": 4.99,
        "tipo_parcelamento": "PP",
        "parcelamento": { "1": 2.49, "2": 2.49, "12": 2.49 },
        "fixa": 0.99,
        "minima": 3
      },
      "pix": { "percentual": 1, "fixa": 0.99, "minima": 1 },
      "boleto": { "percentual": 0, "fixa": 0, "minima": 3.49 }
    },
    "id_taxas_saque": 222,
    "recebimento": { "creditcard": "30", "pix": "0", "boleto": "1" },
    "retencao": {
      "tipo": "garantia",
      "percentual": 7.5,
      "janela": 90,
      "considera_cartao": true,
      "considera_pix": false,
      "considera_boleto": false
    },
    "taxas_saque": {
      "taxa_antecipacao": 1.49,
      "isencao": { "valor_minimo": 10000, "taxa_minima": 3.67 }
    }
  }],
  "pagination": { "page": 1, "limit": 3, "total_records": 1, "total_pages": 1 }
}
```

## Modelo relacional

O `order_id` é a chave universal de junção entre os relatórios:

| Relatório | Chave primária | Chave de junção | Relaciona com |
| --- | --- | --- | --- |
| Pedidos | order_id | — | Todos os demais |
| Repasse | id_saque | order_id | Pedidos |
| Cancelamento / CBK | — | order_id | Pedidos |
| Débitos / Créditos | — | order_id * | Pedidos (* nullable) |
| Extrato Financeiro | — | order_id | Pedidos |

* Em Débitos/Créditos, `order_id` é nullable: presente quando o ajuste está vinculado a uma transação (ex.: `chargeback_vencido`); ausente em ajustes avulsos (ex.: crédito manual sem vínculo).

## Glossário de carteiras

Valores possíveis do campo `balance` no Extrato Financeiro. Cada carteira representa um estado ou destinação diferente dos recursos do lojista:

| Carteira | Descrição |
| --- | --- |
| Disponível para saque | Saldo já liquidado e pronto para ser sacado a qualquer momento. |
| Disponível para antecipar | Recebíveis futuros qualificados para antecipação mediante cobrança de taxa de adiantamento. |
| Valor não antecipável | Recebíveis que não se qualificam para antecipação — ex.: parte do valor de um pedido bloqueado. |
| Cessões de Recebíveis | Valores vinculados a operações de cessão de recebíveis registradas na CERC (Central de Recebíveis). |
| Liquidação Centralizada | Saldo gerenciado via arranjo de liquidação centralizada, liquidado diretamente pela bandeira ou câmara de compensação. |

## Veja Também

- [Index Master](../../index_master.md)
