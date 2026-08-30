---
title: "Status de Pedidos e Ciclo de Vida"
description: "Todos os status de pedidos na Appmax, fluxo de transições, comportamentos esperados e ações recomendadas."
topics:
  - pedidos
  - status
  - ciclo-de-vida
  - transicoes
keywords:
  - status
  - pending
  - processing
  - paid
  - authorized
  - refunded
  - cancelled
  - chargeback
related:
  - ../index_master.md
  - visao_geral.md
  - por_onde_comecar.md
  - conceitos.md
source_scope:
  - https://docs.appmax.com.br/guides/status-pedidos
---

# Status de pedidos

Ao longo do processo de um pedido, ele passa por diferentes status. Abaixo está a listagem com a descrição de cada status, que representa fases específicas do processo do pedido.

> **Os status listados aqui são os valores retornados pela API. No painel da Appmax, eles podem ter outra nomenclatura para melhorar a experiência do lojista.**
>
>
| Status                              | Nome no painel             | Descrição                                                                                                                                                      |
| ----------------------------------- | -------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `pendente`                          | Pagamento pendente         | Pedidos que ainda não estão pagos: cartão não autorizado, Pix não pago, boleto não compensado ou boletos vencidos nunca pagos.                                 |
| `aprovado`                          | Pagamento aprovado         | Pagamento confirmado. A partir desse status, os valores são disponibilizados na conta do lojista.                                                              |
| `autorizado`                        | Análise antifraude         | Pedido de cartão autorizado pelo banco emissor e com saldo. Inicia-se a análise antifraude antes de ir para aprovado.                                          |
| `cancelado`                         | Não autorizado             | Pix com QR Code expirado, cartão não autorizado pelo banco ou sem saldo. Inclui também pedidos criados pelo painel sem transação de pagamento.                 |
| `estornado`                         | Estornado                  | Pedido com solicitação de reembolso aprovada. O valor é debitado da conta do lojista.                                                                          |
| `recusado_por_risco`                | Recusado por risco         | Transações consideradas de alto risco que não passam na análise antifraude. O pedido é estornado e recebe esse status.                                         |
| `integrado`                         | Pagamento aprovado         | Status final para pedido aprovado, após validações das integrações. Pronto para envio ao comprador (produtos físicos).                                         |
| `pendente_integracao`               | Pagamento aprovado         | Pedido pago, porém com pendência na integração (informação incorreta no cadastro ou produto).                                                                  |
| `pendente_integracao_em_analise`    | Pagamento aprovado         | Pedido aprovado que recebeu solicitação de estorno antes de ser integrado. Análise manual é executada.                                                         |
| `chargeback_em_tratativa`           | Chargeback                 | Sinalização do banco de que ocorreu chargeback. O pedido é estornado e recebe esse status.                                                                     |
| `chargeback_em_disputa`             | Chargeback                 | Appmax iniciou disputa para recuperar o chargeback.                                                                                                            |
| `chargeback_perdido`                | Chargeback                 | Não há mais formas de recuperar o chargeback.                                                                                                                  |
| `chargeback_vencido`                | Chargeback recuperado      | Disputa de chargeback vencida. O lojista recebe o crédito em seu saldo.                                                                                        |

## Veja Também

- [Index Master](../index_master.md)
- [Visao Geral](visao_geral.md)
- [Por Onde Comecar](por_onde_comecar.md)
- [Conceitos](conceitos.md)
