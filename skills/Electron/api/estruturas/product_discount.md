---
title: "Objeto ProductDiscount"
description: "- identifier string - Uma string usada identificar unicamente uma oferta de desconto para um produto."
topics:
  - "Api"
  - "Estruturas"
keywords:
  - "Objeto ProductDiscount"
  - "identifier"
  - "type"
  - "price"
  - "priceLocale"
  - "paymentMode"
  - "payAsYouGo"
  - "payUpFront"
source_scope:
  - "https://www.electronjs.org/pt/docs/latest/api/structures/product-discount"
---

# Objeto ProductDiscount

- `identifier` string - Uma string usada identificar unicamente uma oferta de desconto para um produto.

- `type` number - O tipo de oferta de desconto.

- `price` number - O preço com desconto do produto na moeda local.

- `priceLocale` string - O locale usado para formatar o preço com desconto do produto.

- `paymentMode` string - O modo de pagamento para este produto com desconto. Pode ser `payAsYouGo`, `payUpFront` ou `freeTrial`.

- `numberOfPeriods` number - Um inteiro que indica o número de períodos nos quais o desconto do produto está disponível.

- `subscriptionPeriod` [ProductSubscriptionPeriod](/pt/docs/latest/api/structures/product-subscription-period) (optional) - An object that defines the period for the product discount.
