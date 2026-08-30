---
title: "FAQ do Split de Pagamentos"
description: "Perguntas e respostas sobre regras de estorno no split, chargeback, prazos de transferência e limites."
topics:
  - split
  - faq-split
  - chargeback-split
  - estorno-split
keywords:
  - faq split
  - estorno split
  - chargeback split
  - taxas marketplace
  - prazos split
related:
  - ../index_master.md
  - ../api/split/criar_recebedor.md
  - ../api/split/criar_recebedor_flexivel.md
  - ../api/split/facematch_link.md
source_scope:
  - https://docs.appmax.com.br/guides/split-perguntas-frequentes
---

# Perguntas frequentes — Split de pagamentos

Dúvidas recorrentes de integradores sobre onboarding de recebedores, KYC, splits e saques. Para o fluxo completo e referências dos endpoints, veja [Split de pagamentos](split_visao_geral.md).

## Visão geral e fluxo

### Qual é o fluxo correto para cadastrar um recebedor?

Siga estas etapas na ordem:

1. `POST /recipient` — devolve `recipient_hash`.
2. `POST /recipient/{recipient_hash}/facematch-link` com o telefone do recebedor — dispara o SMS com o link de facematch.
3. O recebedor conclui o facematch pelo link recebido no celular.
4. `GET /recipient/{recipient_hash}/status` — aguarde até retornar `Onboarding completed`.
5. A partir daí, use o `recipient_hash` em `POST /orders/{orderId}/split-order`.

### Preciso cadastrar o marketplace como recebedor?

Não. Recebedores são apenas os parceiros que recebem parcelas do split. O marketplace é a conta operadora que chama as APIs — não precisa se auto-cadastrar como recebedor.

### O recebedor precisa fazer login no painel da Appmax?

Não. O fluxo de recebedor é 100% via API. O recebedor não acessa painel e não solicita saques por conta própria. Quem executa saques e antecipações é a conta marketplace, chamando os endpoints de saque em nome do recebedor.

## Valores, taxas e cálculo do split

### Como a taxa Appmax é cobrada quando uso split?

A taxa incide sobre o marketplace, em cima do valor total do pedido, e é descontada automaticamente pela Appmax — **você não envia taxa no payload** de `POST /orders/{orderId}/split-order`. O percentual aplicado é definido comercialmente entre o lojista e a Appmax.

### O que é `partner_total`?

`partner_total` é o valor do pedido **menos as taxas** da Appmax — ou seja, o saldo líquido disponível para distribuir entre os recebedores do split. A soma dos `amount` enviados no split é limitada a esse valor.

### O que acontece se a soma dos `amount` ultrapassar o `partner_total`?

O endpoint **não retorna erro**. A Appmax faz uma divisão proporcional limitada ao `partner_total`: os primeiros recebedores recebem o valor informado e o último recebe apenas o residual disponível.

Exemplo: pedido de R$ 100,00 com taxa de 5% → `partner_total` = R$ 95,00. Se você enviar dois recebedores com R$ 50,00 cada (somando R$ 100,00, acima do teto):

- Recebedor 1: **R$ 50,00** (valor informado)
- Recebedor 2: **R$ 45,00** (residual após esgotar o `partner_total`)

Como não há erro nem aviso, é fácil o último recebedor receber menos do que o esperado sem ninguém perceber. Dimensione os splits considerando que sempre há uma taxa aplicada.

### Posso definir qual recebedor absorve a taxa do pedido?

Não. A taxa incide sobre o marketplace como um todo, e o `partner_total` é teto único para todos os recebedores — não é possível indicar no payload qual deles arca com o custo. Para acomodar esse comportamento, calcule os valores do split deixando margem para a taxa.

### Existe um endpoint para consultar a taxa do lojista antes de criar o pedido?

Não. Não há rota pública para consulta prévia da taxa nem do `partner_total`. O percentual é acordado comercialmente entre o lojista e a Appmax — se você precisa do valor exato para sua integração, alinhe com o time comercial responsável pela conta.

## Cadastro de recebedores

### É possível editar um recebedor via API?

Não. Uma vez criado, os dados do recebedor não podem ser alterados via API — não existe rota `PATCH` ou `PUT`. Os campos enviados na criação são usados para validação junto aos órgãos responsáveis. Se precisar corrigir algum dado, abra um chamado com o suporte da Appmax — a alteração é feita internamente, caso a caso.

### É possível excluir um recebedor via API?

Não. A exclusão é feita internamente pela Appmax, mediante solicitação do marketplace ao suporte. Não há rota pública de remoção.

### Recebo "O valor indicado para o campo company.company document number já se encontra utilizado" ao tentar recadastrar. O que fazer?

Cada CNPJ gera exatamente um recebedor na plataforma. Se o CNPJ já foi usado — mesmo que o cadastro anterior tenha dados errados — não é possível recadastrar pela API. Em **testes**, use um CNPJ diferente. Em **produção**, acione o suporte para corrigir ou excluir o cadastro anterior.

## Facematch e KYC

### Por que não recebo o SMS de facematch em homologação?

O ambiente de homologação não envia SMS. Teste o disparo do facematch em produção.

### O telefone enviado em `POST /recipient` é o mesmo que recebe o SMS do facematch?

Não. O SMS é disparado pela chamada `POST /recipient/{recipient_hash}/facematch-link`, usando o campo `phone` do corpo dessa requisição. Esse número **não precisa** ser igual ao `account.phone` enviado na criação — informe o número que deve efetivamente receber o SMS.

## Status e elegibilidade

### Quando o recebedor está efetivamente pronto para receber splits?

Somente quando `GET /recipient/{recipient_hash}/status` retorna `Onboarding completed`. Nos estados `Awaiting face match completion` e `Onboarding on verification` o recebedor ainda não pode ser usado em splits.

### O que significa o status `Onboarding on verification`?

O status é **derivado do resultado das verificações de KYC** — não é um campo marcado manualmente. O recipient cai aqui quando o facematch já foi recebido, mas alguma das checagens de onboarding reteve a liberação automática.

Os checks aplicados incluem, entre outros:

- Validação de CPF e CNPJ junto à Receita Federal
- Listas de PEP, OFAC e CSNU (sanções internacionais)
- Validação do QSA (quadro societário) do CNPJ — o CPF informado precisa constar como sócio
- Score do facematch abaixo do limite mínimo
- Liveness (prova de vida) reprovado
- Face do facematch não coincide com o documento

**Ponto importante:** este status **não distingue "ainda em análise" de "rejeitado permanentemente"**. O sistema não faz retry automático nem tem timeout para sair desse estado — se algum check falhou, o recipient fica congelado em `Onboarding on verification` até uma ação manual.

**Ação recomendada:** se o recipient permanecer nesse status por mais de **24 a 48 horas úteis**, abra um chamado com o suporte da Appmax para verificar se é caso de reprocessamento ou se foi reprovado. Não fique em polling infinito esperando transição automática, não tente recriar o recipient (o CNPJ vai bater "já utilizado") e não deixe o fluxo do usuário final travado sem escape — sinalize a pendência para o lojista enquanto aguarda retorno.

> **Veja também**
>
> Referência completa dos três status do recebedor, transições possíveis e elegibilidade por estado em [Status do split de pagamentos](split_status.md).

## Veja Também

- [Index Master](../index_master.md)
- [Criar Recebedor](../api/split/criar_recebedor.md)
- [Criar Recebedor Flexivel](../api/split/criar_recebedor_flexivel.md)
- [Facematch Link](../api/split/facematch_link.md)
