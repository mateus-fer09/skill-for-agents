---
title: "Criar Recebedor Flexível"
description: "Cadastro flexível de recebedores para modelos de marketplace com múltiplos participantes e estruturas customizadas."
topics:
  - split
  - recebedor-flexivel
  - marketplace
keywords:
  - recebedor flexivel
  - flexible recipient
  - split flexivel
  - multi-vendor
related:
  - ../../index_master.md
  - criar_recebedor.md
  - facematch_link.md
  - consultar_recebedor.md
source_scope:
  - https://docs.appmax.com.br/api-reference/split/criar-recebedor-flexivel
---

[ [[**Referência][**Playground]][[[[[[[[]

# [Criar um recebedor flexível]

] [

```bash
POST/v1/recipient/flexible
```

][

Cadastra um recebedor de forma flexível para receber valores de
[split de pagamentos](../../guias_e_recursos/split_visao_geral.md). Esta rota permite o
envio de conjuntos parciais de dados da conta (`account`).

O cadastro é só a primeira etapa. Para completar o fluxo, o recebedor
também precisa concluir o
[facematch (KYC)](facematch_link.md) — enquanto o KYC
não é aprovado, ele não participa de splits. Os três status possíveis do
onboarding são:

| Status | Significado |
| --- | --- |
| Awaiting face match completion | Aguardando o recebedor concluir a etapa de facematch (KYC). |
| Onboarding on verification | Recebemos todos os dados do formulário + facematch e estamos analisando as informações. |
| Onboarding completed | Cadastro completo e aprovado. |

Referência completa em
[Status do split de pagamentos](../../guias_e_recursos/split_status.md#status-do-recebedor-recipient).

A conta bancária (`bankAccount`) pode ser enviada já no cadastro. Os
códigos de banco (COMPE) homologados e os tipos de conta aceitos estão
em [Bancos homologados](../../guias_e_recursos/split_bancos_homologados.md).

> [!WARNING]
> **WARNING**
> Uma vez criado, o recebedor **não pode ser editado nem excluído via
API**. Revise os dados antes de enviar — correções são feitas pelo
suporte da Appmax caso a caso.

> [!TIP]
> **TIP**
> Um CNPJ só pode ser cadastrado uma vez. Tentar recriar retorna `422`
com a mensagem `"O valor indicado para o campo company.company document number já se encontra utilizado."`.

][[

## [Autorizações]

[ [bearerAuth

Token Bearer do **merchant** obtido via `POST /oauth2/token` usando as
credenciais do merchant (não do app). Veja
[Autenticação](../../primeiros_passos/autenticacao.md).

TipoHTTP (bearer)  [   ] ] ]]][ ][[

## [Corpo da Requisição]

application/json[[[[[[Esquema]][[[JSON]]]]]v-if[[[ 

```json
JSON{  "triage": {    "revenue": 10000,    "storeUrl": "https://exemplo-loja.com.br"  },  "account": {    "name": "Fulano de Tal",    "cpf": "11122233344"  },  "company": {    "companyName": "Empresa de Testes LTDA",    "companyDocumentNumber": "00000000000191",    "companyPostcode": "00000000",    "companyAddress": "Rua dos Testes",    "companyAddressNumber": "123",    "companyAddressState": "SP",    "companyAddressComplement": "Bloco A",    "companyAddressNeighborhood": "Bairro Fictício",    "companyCity": "Cidade Exemplo"  },  "bankAccount": {    "bank": 104,    "agency": "0001",    "account": "12345-6",    "bankAccountType": "CC"  },  "pixKey": "chave-pix-exemplo"}
```

]]]]]]][[[[

## [Respostas]

[[[v-if[[[201]][[403]][[422]]]] ]][[[

Recebedor criado com sucesso.

[[Content-Type]]application/json[[[[[[Esquema]][[[JSON]]]]]v-if[[[ 

```json
JSON{  "data": {    "recipient_hash": "bbd96f57-3e3c-5ea1-aa60-cb2518578faf"  }}
```

]]]]]]]v-ifv-if]]]]][

```bash
POST/v1/recipient/flexible
```

][][

## [Exemplos]

 ] []]]]]][[[[Sandbox`https://api.sandboxappmax.com.br`] []  Authorization (Bearer)[[]] Cole uma vez e use em todos os playgrounds — o token fica salvo somente nesta aba do navegador e é apagado quando ela for fechada. Corpo  

```
{
  "triage": {
    "revenue": 10000,
    "storeUrl": "https://exemplo-loja.com.br"
  },
  "account": {
    "name": "Fulano de Tal",
    "cpf": "11122233344"
  },
  "company": {
    "companyName": "Empresa de Testes LTDA",
    "companyDocumentNumber": "00000000000191",
    "companyPostcode": "00000000",
    "companyAddress": "Rua dos Testes",
    "companyAddressNumber": "123",
    "companyAddressState": "SP",
    "companyAddressComplement": "Bloco A",
    "companyAddressNeighborhood": "Bairro Fictício",
    "companyCity": "Cidade Exemplo"
  },
  "bankAccount": {
    "bank": 104,
    "agency": "0001",
    "account": "12345-6",
    "bankAccountType": "CC"
  },
  "pixKey": "chave-pix-exemplo"
}
```

[[[]Editar ][[]Copiar ]Duplo clique no JSON para editar][[]Testar ] ]]]]]

## Veja Também

- [Index Master](../../index_master.md)
- [Criar Recebedor](criar_recebedor.md)
- [Facematch Link](facematch_link.md)
- [Consultar Recebedor](consultar_recebedor.md)
