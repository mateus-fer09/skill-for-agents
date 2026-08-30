---
title: "Tabela de Bancos Homologados para Split"
description: "Relação exaustiva de códigos COMPE de bancos e instituições financeiras aceitas para cadastro de recebedores."
topics:
  - split
  - bancos-homologados
  - compe
  - instituicoes-financeiras
keywords:
  - bancos homologados
  - compe
  - codigo bancario
  - itau
  - bradesco
  - nubank
  - inter
  - banco do brasil
related:
  - ../index_master.md
  - ../api/split/criar_recebedor.md
  - ../api/split/criar_recebedor_flexivel.md
  - ../api/split/facematch_link.md
source_scope:
  - https://docs.appmax.com.br/guides/bancos-homologados
---

# Bancos homologados

Relação completa dos bancos e instituições financeiras homologadas para uso na plataforma. Use esta página como consulta rápida ao enviar o objeto `bankAccount` em [Criar um recebedor](../api/split/criar_recebedor.md): cada instituição é identificada pelo nome e pelo **código bancário (COMPE)**, que é o valor esperado no campo `bankAccount.bank`.

> **A lista é atualizada conforme novas instituições são homologadas. Última atualização: **07/05/2026**.**
>
>
## Tipos de conta

O campo `bankAccount.bankAccountType` aceita uma das siglas abaixo.

| Sigla | Tipo               | Descrição                                                                              |
| :---: | :----------------- | :------------------------------------------------------------------------------------- |
| `CC`  | Conta Corrente     | Conta bancária tradicional destinada ao movimento diário de valores.                    |
| `CD`  | Conta Digital      | Modalidade de conta 100% digital, sem a necessidade de agência física.                  |
| `PG`  | Conta de Pagamento | Tipo de conta pré-paga voltada exclusivamente para movimentação eletrônica de valores.  |
| `PP`  | Conta Poupança     | Conta destinada à guarda de recursos com remuneração mensal.                            |

## Exemplo de uso

```json
{
  "bankAccount": {
    "bank": 104,
    "agency": "1234-0",
    "account": "12345-2",
    "bankAccountType": "CC"
  }
}
```

## Lista de bancos homologados

| Código do banco | Nome do banco                                                                                                    |
| :-------------: | :--------------------------------------------------------------------------------------------------------------- |
|        1        | Banco do Brasil S.A.                                                                                             |
|        3        | BANCO DA AMAZONIA S.A.                                                                                           |
|        4        | Banco do Nordeste do Brasil S.A.                                                                                 |
|        21       | BANESTES S.A. BANCO DO ESTADO DO ESPIRITO SANTO                                                                   |
|        25       | Banco Alfa S.A.                                                                                                  |
|        33       | BANCO SANTANDER (BRASIL) S.A.                                                                                    |
|        36       | Banco BRADESCO BBI                                                                                               |
|        37       | Banco do Estado do Pará S.A.                                                                                     |
|        41       | Banco do Estado do Rio Grande do Sul S.A.                                                                        |
|        47       | Banco do Estado de Sergipe S.A.                                                                                  |
|        69       | Banco Crefisa S.A.                                                                                               |
|        70       | BRB - BANCO DE BRASILIA S.A.                                                                                     |
|        77       | Banco Inter S.A.                                                                                                 |
|        79       | PICPAY BANK - BANCO MÚLTIPLO S.A                                                                                 |
|        81       | BancoSeguro S.A.                                                                                                 |
|        82       | BANCO TOPÁZIO S.A.                                                                                               |
|        84       | SISPRIME DO BRASIL - COOPERATIVA DE CRÉDITO                                                                      |
|        85       | Cooperativa Central de Crédito - Ailos                                                                           |
|        89       | CREDISAN COOPERATIVA DE CRÉDITO                                                                                  |
|        93       | PÓLOCRED SOCIEDADE DE CRÉDITO AO MICROEMPREENDEDOR E À EMPRESA DE PEQUENO PORTE LTDA.                            |
|        94       | Banco Finaxis S.A.                                                                                               |
|        97       | Credisis - Central de Cooperativas de Crédito Ltda.                                                              |
|        99       | UNIPRIME CENTRAL NACIONAL - CENTRAL NACIONAL DE COOPERATIVA DE CREDITO                                           |
|       104       | CAIXA ECONOMICA FEDERAL                                                                                          |
|       107       | Banco Bocom BBM S.A.                                                                                             |
|       120       | BANCO RODOBENS S.A.                                                                                              |
|       125       | BANCO GENIAL S.A.                                                                                                |
|       130       | CARUANA S.A. - SOCIEDADE DE CRÉDITO, FINANCIAMENTO E INVESTIMENTO                                                |
|       133       | CONFEDERAÇÃO NACIONAL DAS COOPERATIVAS CENTRAIS DE CRÉDITO E ECONOMIA FAMILIAR E SOLIDÁRIA - CRESOL CONFEDERAÇÃO |
|       136       | COOPERATIVA CENTRAL DE CRÉDITO UNICRED DO BRASIL - UNICRED DO BRASIL                                             |
|       174       | PEFISA S.A. - CRÉDITO, FINANCIAMENTO E INVESTIMENTO                                                              |
|       197       | STONE INSTITUIÇÃO DE PAGAMENTO S.A.                                                                              |
|       208       | Banco BTG Pactual S.A.                                                                                           |
|       212       | Banco Original S.A.                                                                                              |
|       213       | Banco Arbi S.A.                                                                                                  |
|       218       | Banco BS2 S.A.                                                                                                   |
|       224       | Banco Fibra S.A.                                                                                                 |
|       237       | Banco Bradesco S.A.                                                                                              |
|       246       | Banco ABC Brasil S.A.                                                                                            |
|       260       | NU PAGAMENTOS S.A. - INSTITUIÇÃO DE PAGAMENTO                                                                    |
|       274       | BMP SOCIEDADE DE CRÉDITO AO MICROEMPREENDEDOR E A EMPRESA DE PEQUENO PORTE LTDA.                                 |
|       280       | WILL FINANCEIRA S.A. CRÉDITO, FINANCIAMENTO E INVESTIMENTO - EM LIQUIDAÇÃO EXTRAJUDICIAL                         |
|       299       | BANCO AFINZ S.A. - BANCO MÚLTIPLO                                                                                |
|       301       | DOCK INSTITUIÇÃO DE PAGAMENTO S.A.                                                                               |
|       310       | VORTX DISTRIBUIDORA DE TITULOS E VALORES MOBILIARIOS LTDA.                                                       |
|       318       | Banco BMG S.A.                                                                                                   |
|       322       | Cooperativa de Crédito Rural de Abelardo Luz - Sulcredi/Crediluz                                                 |
|       323       | MERCADO PAGO INSTITUIÇÃO DE PAGAMENTO LTDA.                                                                      |
|       329       | QI Sociedade de Crédito Direto S.A.                                                                              |
|       332       | ACESSO SOLUÇÕES DE PAGAMENTO S.A. - INSTITUIÇÃO DE PAGAMENTO                                                     |
|       335       | Banco Digio S.A.                                                                                                 |
|       336       | Banco C6 S.A.                                                                                                    |
|       341       | ITAÚ UNIBANCO S.A.                                                                                               |
|       348       | Banco XP S.A.                                                                                                    |
|       364       | EFÍ S.A. - INSTITUIÇÃO DE PAGAMENTO                                                                              |
|       376       | BANCO J.P. MORGAN S.A.                                                                                           |
|       380       | PICPAY INSTITUIçãO DE PAGAMENTO S.A.                                                                             |
|       383       | EBANX INSTITUICAO DE PAGAMENTOS LTDA.                                                                            |
|       389       | Banco Mercantil do Brasil S.A.                                                                                   |
|       396       | MAGALUPAY INSTITUIÇÃO DE PAGAMENTO S.A.                                                                          |
|       401       | IUGU INSTITUIÇÃO DE PAGAMENTO S.A.                                                                               |
|       403       | CORA SOCIEDADE DE CRÉDITO, FINANCIAMENTO E INVESTIMENTO S.A.                                                     |
|       406       | ACCREDITO - SOCIEDADE DE CRÉDITO DIRETO S.A.                                                                     |
|       413       | BANCO BV S.A.                                                                                                    |
|       414       | LEND SOCIEDADE DE CRÉDITO DIRETO S.A.                                                                            |
|       422       | Banco Safra S.A.                                                                                                 |
|       435       | DELFINANCE SOCIEDADE DE CREDITO DIRETO S.A.                                                                      |
|       448       | HEMERA DISTRIBUIDORA DE TÍTULOS E VALORES MOBILIÁRIOS LTDA.                                                      |
|       450       | FITS INSTITUIÇÃO DE PAGAMENTO S.A.                                                                               |
|       457       | UY3 SOCIEDADE DE CRÉDITO DIRETO S/A                                                                              |
|       461       | ASAAS GESTÃO FINANCEIRA INSTITUIÇÃO DE PAGAMENTO S.A.                                                            |
|       470       | CDC SOCIEDADE DE CRÉDITO DIRETO S.A.                                                                             |
|       481       | SUPERLÓGICA SOCIEDADE DE CRÉDITO DIRETO S.A.                                                                     |
|       487       | DEUTSCHE BANK S.A. - BANCO ALEMAO                                                                                |
|       509       | Max IP (Celcoin)                                                                                                 |
|       517       | PAGUEVELOZ INSTITUIÇÃO DE PAGAMENTO LTDA.                                                                        |
|       529       | PINBANK BRASIL INSTITUIÇÃO DE PAGAMENTO S.A.                                                                     |
|       542       | CLOUDWALK INSTITUIÇÃO DE PAGAMENTO E SERVICOS LTDA                                                               |
|       590       | REPASSES FINANCEIROS E SOLUCOES TECNOLOGICAS INSTITUICAO DE PAGAMENTO S.A.                                       |
|       594       | ASA SOCIEDADE DE CRÉDITO FINANCIAMENTO E INVESTIMENTO S.A.                                                       |
|       595       | IFOOD PAGO INSTITUIÇÃO DE PAGAMENTO S.A.                                                                         |
|       600       | Banco Luso Brasileiro S.A.                                                                                       |
|       604       | Banco Industrial do Brasil S.A.                                                                                  |
|       611       | Banco Paulista S.A.                                                                                              |
|       612       | Banco Guanabara S.A.                                                                                             |
|       613       | Omni Banco S.A.                                                                                                  |
|       623       | Banco Pan S.A.                                                                                                   |
|       633       | Banco Rendimento S.A.                                                                                            |
|       634       | BANCO TRIANGULO S.A.                                                                                             |
|       637       | BANCO SOFISA S.A.                                                                                                |
|       643       | Banco Pine S.A.                                                                                                  |
|       654       | BANCO DIGIMAIS S.A.                                                                                              |
|       655       | Banco Votorantim S.A.                                                                                            |
|       660       | PAGME INSTITUIÇÃO DE PAGAMENTO LTDA.                                                                             |
|       707       | Banco Daycoval S.A.                                                                                              |
|       741       | BANCO RIBEIRAO PRETO S.A.                                                                                        |
|       743       | Banco Semear S.A.                                                                                                |
|       745       | Banco Citibank S.A.                                                                                              |
|       748       | BANCO COOPERATIVO SICREDI S.A.                                                                                   |
|       755       | Bank of America Merrill Lynch Banco Múltiplo S.A.                                                                |
|       756       | BANCO COOPERATIVO SICOOB S.A. - BANCO SICOOB                                                                     |
|       783       | SWAP INSTITUIÇÃO DE PAGAMENTO S.A.                                                                               |
|     4740876     | COMPANHIA BRASILEIRA DE SOLUÇÕES E SERVIÇOS                                                                      |
|     4833541     | SUPERLOGICA TECNOLOGIAS S.A.                                                                                     |
|     10506341    | ENOPP SERVIÇOS DE GESTÃO DE NEGÓCIOS E PROJETOS LTDA                                                             |
|     10878448    | PAYPAL DO BRASIL INSTITUIÇÃO DE PAGAMENTO LTDA.                                                                  |
|     13966572    | CAPPTA INSTITUICAO DE PAGAMENTO S.A                                                                              |
|     15185132    | PAYLEVEN TECNOLOGIA LTDA                                                                                         |
|     18727053    | PAGAR.ME PAGAMENTOS S.A.                                                                                         |
|     23613543    | TECPAY S.A.                                                                                                      |
|     25021356    | DLOCAL BRASIL PAGAMENTOS LTDA                                                                                    |
|     26356125    | ZIG TECNOLOGIA S.A.                                                                                              |
|     28494032    | ALPE INTERMEDIACAO DE NEGOCIOS S.A.                                                                              |
|     35813685    | QGX PAGAMENTOS S.A.                                                                                              |

## Próximos passos

- [Criar um recebedor](../api/split/criar_recebedor.md) — envie `bankAccount` no cadastro.
- [Split de pagamentos](split_visao_geral.md) — visão geral do fluxo completo.
- [Status do split de pagamentos](split_status.md) — o que cada status de recebedor significa.

## Veja Também

- [Index Master](../index_master.md)
- [Criar Recebedor](../api/split/criar_recebedor.md)
- [Criar Recebedor Flexivel](../api/split/criar_recebedor_flexivel.md)
- [Facematch Link](../api/split/facematch_link.md)
