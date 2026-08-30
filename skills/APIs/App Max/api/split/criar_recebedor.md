---
title: "Criar Recebedor Split (POST /v1/recipient)"
description: "Cadastra um novo recebedor (pessoa física ou jurídica) com conta bancária para recebimento de split de pagamentos."
topics:
  - split
  - recebedores
  - onboarding-recebedor
  - post-v1-recipient
  - conta-bancaria
keywords:
  - POST /v1/recipient
  - recipient
  - recebedor
  - banco
  - agencia
  - conta
  - documento
  - fast onboarding
related:
  - ../../index_master.md
  - criar_recebedor_flexivel.md
  - facematch_link.md
  - consultar_recebedor.md
source_scope:
  - https://docs.appmax.com.br/api-reference/split/criar-recebedor
---

# Criar um recebedor

`POST /v1/recipient`

**Base URL**

- Produção: https://api.appmax.com.br
- Sandbox: https://api.sandboxappmax.com.br

Cadastra um recebedor para receber valores de [split de
pagamentos](../../guias_e_recursos/split_visao_geral.md).

O cadastro é só a primeira etapa. Para completar o fluxo, o recebedor
também precisa concluir o
[facematch (KYC)](facematch_link.md) — enquanto o KYC
não é aprovado, ele não participa de splits. Os três status possíveis do
onboarding são:

| Status | Significado |
| --- | --- |
| `Awaiting face match completion` | Aguardando o recebedor concluir a etapa de facematch (KYC). |
| `Onboarding on verification` | Recebemos todos os dados do formulário + facematch e estamos analisando as informações. |
| `Onboarding completed` | Cadastro completo e aprovado. |

Referência completa em
[Status do split de pagamentos](../../guias_e_recursos/split_status.md#status-do-recebedor-recipient).

A conta bancária (`bankAccount`) pode ser enviada já no cadastro. Os
códigos de banco (COMPE) homologados e os tipos de conta aceitos estão
em [Bancos homologados](../../guias_e_recursos/split_bancos_homologados.md).

> **Uma vez criado, o recebedor **não pode ser editado nem excluído via**
>
> API**. Revise os dados antes de enviar — correções são feitas pelo
> suporte da Appmax caso a caso.
> **Um CNPJ só pode ser cadastrado uma vez. Tentar recriar retorna `422`**
>
> com a mensagem `"O valor indicado para o campo company.company
> document number já se encontra utilizado."`.

## Autenticação

- `Authorization: Bearer <token>`
  Token Bearer do **merchant** obtido via `POST /oauth2/token` usando as credenciais do merchant (não do app). Veja [Autenticação](../../primeiros_passos/autenticacao.md).

## Corpo da requisição (obrigatório)

| Campo | Tipo | Obrigatório | Descrição |
|---|---|---|---|
| `triage` | object | sim |  |
| `triage.revenue` | integer | sim | Faturamento mensal online em reais (inteiro). `1000` = R$ 1.000,00. |
| `triage.storeUrl` | string | sim | URL da página de vendas da loja. |
| `account` | object | sim |  |
| `account.email` | string | sim | E-mail do titular da conta. |
| `account.name` | string | sim | Nome completo do titular. |
| `account.cpf` | string | sim | CPF do titular (apenas dígitos). |
| `account.phone` | string | sim | Telefone do titular. |
| `account.dateOfBirth` | string | sim | Data de nascimento (YYYY-MM-DD). |
| `company` | object | sim |  |
| `company.companyName` | string | sim | Razão social da empresa. |
| `company.companyDocumentNumber` | string | sim | CNPJ da empresa — apenas dígitos, 14 posições, sem pontuação. |
| `company.companyPostcode` | string | sim | CEP do endereço da empresa (apenas dígitos). |
| `company.companyAddress` | string | sim | Logradouro (rua, avenida) do endereço da empresa. |
| `company.companyAddressNumber` | string | sim | Número do endereço. |
| `company.companyAddressState` | string | sim | Estado (UF) em duas letras. |
| `company.companyAddressNeighborhood` | string | sim | Bairro. |
| `company.companyCity` | string | sim | Cidade. |
| `company.companyAddressComplement` | string | não | Complemento do endereço (opcional). |
| `bankAccount` | object | não | Conta bancária do recebedor, usada para os saques. Se o objeto for enviado, **todos os campos abaixo passam a ser obrigatórios**. |
| `bankAccount.bank` | integer | sim | Código do banco (COMPE). Consulte a lista completa de instituições homologadas em [Bancos homologados](../../guias_e_recursos/split_bancos_homologados.md). |
| `bankAccount.agency` | string | sim | Agência da conta, com dígito quando houver. |
| `bankAccount.account` | string | sim | Número da conta, com dígito verificador. |
| `bankAccount.bankAccountType` | enum: CC \| CD \| PG \| PP | sim | Tipo de conta: `CC` (conta corrente), `CD` (conta digital), `PG` (conta de pagamento) ou `PP` (conta poupança). Veja [Bancos homologados](../../guias_e_recursos/split_bancos_homologados.md). |
| `config` | object | não | Configurações do recebedor na plataforma. |
| `config.hasAccountAccess` | boolean | não | Define se o recebedor terá acesso ao painel da própria conta. Enviado como booleano (`true` ou `false`). |

## Respostas

### 201

Recebedor criado com sucesso.

### 403

Token ausente ou inválido.

### 422

Erro de validação dos dados enviados.

```json
{
  "data": {
    "message": {
      "account.name": [
        "O campo account.name é obrigatório."
      ],
      "account.cpf": [
        "O campo account.cpf é obrigatório."
      ],
      "company.companyName": [
        "O campo company.company name é obrigatório."
      ],
      "company.companyDocumentNumber": [
        "O campo company.company document number é obrigatório."
      ],
      "company.companyPostcode": [
        "O campo company.company postcode é obrigatório."
      ],
      "company.companyAddress": [
        "O campo company.company address é obrigatório."
      ],
      "company.companyAddressNumber": [
        "O campo company.company address number é obrigatório."
      ],
      "company.companyAddressState": [
        "O campo company.company address state é obrigatório."
      ],
      "company.companyCity": [
        "O campo company.company city é obrigatório."
      ],
      "company.companyAddressNeighborhood": [
        "O campo company.company address neighborhood é obrigatório."
      ],
      "triage.revenue": [
        "O campo triage.revenue é obrigatório."
      ],
      "triage.storeUrl": [
        "O campo triage.store url é obrigatório."
      ]
    }
  }
}
```

### 500

Erro do Servidor Interno.

## Veja Também

- [Index Master](../../index_master.md)
- [Criar Recebedor Flexivel](criar_recebedor_flexivel.md)
- [Facematch Link](facematch_link.md)
- [Consultar Recebedor](consultar_recebedor.md)
