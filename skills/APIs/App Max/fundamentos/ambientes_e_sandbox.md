---
title: "Ambientes Sandbox e Produção"
description: "Diferenças entre os ambientes de sandbox e produção, URLs base, dados de teste e regras de homologação."
topics:
  - ambientes
  - sandbox
  - producao
  - homologacao
  - testes
keywords:
  - sandbox
  - producao
  - admin.sandbox.appmax.com.br
  - api.appmax.com.br
  - cartoes de teste
  - homologacao
related:
  - ../index_master.md
  - visao_geral.md
  - por_onde_comecar.md
  - conceitos.md
source_scope:
  - https://docs.appmax.com.br/guides/ambientes
---

# Ambientes sandbox e produção

A Appmax oferece dois ambientes distintos para integração.

## Sandbox (ambiente de testes)

Utilize o sandbox para testar a integração antes de ir para produção e antes de ser aprovado na homologação.

| Serviço        | URL                                              |
| -------------- | ------------------------------------------------ |
| Autenticação   | `https://auth.sandboxappmax.com.br`              |
| API            | `https://api.sandboxappmax.com.br`               |
| Autorização    | `https://breakingcode.sandboxappmax.com.br/appstore/integration/HASH` |

## Produção

Utilize a produção para transacionar com clientes reais.

| Serviço        | URL                                              |
| -------------- | ------------------------------------------------ |
| Autenticação   | `https://auth.appmax.com.br`                     |
| API            | `https://api.appmax.com.br`                      |
| Autorização    | `https://admin.appmax.com.br/appstore/integration/HASH` |

## Resumo das diferenças

> **- No sandbox, as URLs usam o subdomínio `sandboxappmax` e o redirecionamento é para o **BC Sandbox**.**
>
> - Em produção, as URLs usam o domínio padrão `appmax` e o redirecionamento é para o **Admin da Appmax**.
Para testar pagamentos com cartão de crédito no sandbox, utilize os [cartões de teste](../api/pagamentos/cartao_credito.md#cartoes-de-teste).

> **Instabilidades no sandbox**
>
> O ambiente de sandbox pode apresentar lentidão ou indisponibilidade temporária. Se você receber timeout (504) ou erro 503, aguarde alguns minutos e tente novamente. Esses problemas **não afetam** o ambiente de produção. Se persistir por mais de 30 minutos, entre em contato com o suporte.
## Como migrar para produção

Terminou os testes em sandbox? Veja o guia completo de go-live, com checklist técnico, processo de homologação e o que muda ao migrar:

- [Publicação em produção](../aplicativos/publicacao_producao.md)

## Veja Também

- [Index Master](../index_master.md)
- [Visao Geral](visao_geral.md)
- [Por Onde Comecar](por_onde_comecar.md)
- [Conceitos](conceitos.md)
