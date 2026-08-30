---
title: "Reaproveitamento de Loja na Instalação"
description: "Como funciona o vínculo de novas instalações a lojas já existentes, identidade de loja vs site e reinstalações."
topics:
  - reaproveitamento-loja
  - multi-lojas
  - site-vs-loja
  - reinstalacao
keywords:
  - reaproveitar loja
  - loja existente
  - site_id
  - merchant_id
  - reinstalacao
  - external_id
related:
  - ../index_master.md
  - criar_aplicativo.md
  - validar_url_instalacao.md
  - implementar_url_validacao.md
source_scope:
  - https://docs.appmax.com.br/guides/reaproveitar-loja
---

# Reaproveitamento de loja na instalação

Na tela de autorização que o lojista acessa ao instalar o seu aplicativo — o redirect para `/appstore/integration/HASH`, [etapa 3 da instalação](fluxo_instalacao.md#fluxo-de-instalacao) — ele pode **selecionar uma loja que já existe** na conta dele, em vez de criar sempre uma nova.

## O que mudou

Antes, toda instalação criava obrigatoriamente uma loja nova. Quando o lojista instalava mais de um aplicativo, ou reinstalava o mesmo, a conta acumulava lojas duplicadas — cada uma com seu próprio `external_id` e suas próprias credenciais, sem nenhuma relação óbvia entre elas.

Agora a tela de autorização oferece um campo de seleção de loja. O lojista escolhe entre reaproveitar uma loja existente ou criar uma nova.

> ****Nada muda no contrato da API.** As quatro etapas da instalação, o contrato da URL de validação e o processo de credenciais/tokens seguem exatamente os mesmos. Nenhum parâmetro novo é exigido do aplicativo parceiro.**
>
>
## Loja e site são a mesma coisa

Esta é a principal fonte de confusão, então vale explicitar:

| Onde você vê | Termo usado |
| --- | --- |
| Tela do lojista (painel Appmax, tela de autorização) | **loja** |
| API e webhooks | **site** (`site_id`) |

É a **mesma entidade**, com dois nomes. Quando esta página fala em "loja existente", o equivalente na API é um `site` que já tem `site_id`. Se um webhook chega com um `site_id` que você já conhece, é porque a instalação foi vinculada a uma loja que já existia.

## O que o lojista vê

O comportamento da tela depende do que o lojista escolhe:

| Cenário | Campo "Nome da loja" | Campo "Selecionar Empresa" | Domínio | Loja criada? |
| --- | --- | --- | --- | --- |
| **Selecionou uma loja existente** | Não é exibido (a loja já tem nome) | Preenchido e travado com a empresa daquela loja | Preenchido com o domínio já cadastrado da loja | Não |
| **Selecionou "Criar nova loja"** | Exibido, o lojista informa | O lojista escolhe | O lojista informa | Sim |
| **Lojista sem nenhuma loja** | Exibido, o lojista informa | O lojista escolhe | O lojista informa | Sim |

Quando o lojista ainda não tem nenhuma loja, o campo de seleção **não aparece** — o fluxo é o anterior, sem alteração.

Só entram na lista de seleção as **lojas elegíveis**: ativas, do próprio lojista e com empresa regular na Appmax. Uma loja que não atende a esses critérios simplesmente não é oferecida.

## O que muda para a sua integração

No contrato, nada. A implicação é conceitual: a loja vinculada à instalação **pode ser uma que já existia** — inclusive uma em que o seu aplicativo já esteve instalado antes.

> **Revise a premissa "uma instalação = uma loja nova"**
>
> Se o seu sistema cria registros locais assumindo que cada instalação corresponde a uma loja recém-criada, essa premissa não vale mais. Trate a instalação como **idempotente por loja**: ao receber o health check, verifique se você já tem um registro para aquela loja e **atualize** em vez de criar uma linha nova.
>
> Sem isso, você acumula registros órfãos apontando para a mesma loja, com `external_id` antigos que a Appmax já não reconhece.
## Reinstalação na mesma loja

Quando o lojista reinstala o seu aplicativo selecionando a mesma loja:

| O que acontece | Detalhe |
| --- | --- |
| **O vínculo aplicativo ↔ loja é atualizado** | Não é duplicado — continua existindo um único vínculo entre o seu app e aquela loja. |
| **O `external_id` substitui o anterior** | O valor que a sua URL de validação devolve no novo health check passa a ser o da loja. O valor antigo **deixa de existir**. |
| **Um novo `client_id` é gerado** | Cada instalação gera credenciais novas. A loja acumula credenciais ao longo do tempo — use sempre a **mais recente**. |

> **Persista sempre o último `external_id`**
>
> Se o seu front continuar enviando o `external_id` antigo no header `external-id`, as requisições respondem `404 Merchant not found`.
>
> A cada health check, **grave o valor novo e descarte o anterior**. E lembre: você deve [gerar um UUID novo a cada requisição do health check](fluxo_instalacao.md#health-check) — valores repetidos são rejeitados pela Appmax. Ciclo de vida completo em [`external-id`](../fundamentos/external_id.md).
Vale a mesma recomendação de sempre: **releia o `external_id` do seu banco** a cada renderização do checkout, indexando pela loja. Se você cacheia esse valor em sessão ou em variável de ambiente, invalide o cache quando um novo health check chegar.

## Disponibilidade

O recurso é liberado **gradualmente**. Enquanto ele não estiver ativo para uma conta, a tela de autorização segue com o comportamento anterior — toda instalação cria uma loja nova — e **nada muda para as integrações existentes**.

Ou seja: você não precisa esperar a liberação para ajustar seu código. Uma integração que já trata a instalação como idempotente por loja funciona nos dois modos.

## Veja também

- [Fluxo de instalação](fluxo_instalacao.md) — as quatro etapas, incluindo o redirect onde a seleção acontece.
- [Callback de instalação](callback_instalacao.md) — handler do redirect que recebe o token.
- [`external-id`](../fundamentos/external_id.md) — ciclo de vida do identificador e quando ele muda.
- [Implementar a URL de validação](implementar_url_validacao.md) — handler do health check e persistência.
- [Webhooks](../guias_e_recursos/webhooks.md) — onde a loja aparece como `site_id`.

## Veja Também

- [Index Master](../index_master.md)
- [Criar Aplicativo](criar_aplicativo.md)
- [Validar Url Instalacao](validar_url_instalacao.md)
- [Implementar Url Validacao](implementar_url_validacao.md)
