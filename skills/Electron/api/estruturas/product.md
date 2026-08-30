---
title: "Product Object"
description: "- productIdentifier string - string que identifica o produto para a Apple App Store."
topics:
  - "Api"
  - "Estruturas"
keywords:
  - "Product Object"
  - "productIdentifier"
  - "localizedDescription"
  - "localizedTitle"
  - "price"
  - "formattedPrice"
  - "currencyCode"
  - "introductoryPrice"
source_scope:
  - "https://www.electronjs.org/pt/docs/latest/api/structures/product"
---

# Product Object

- `productIdentifier` string - string que identifica o produto para a Apple App Store.

- `localizedDescription` string - Descrição do produto.

- `localizedTitle` string - Nome do produto.

- `price` number - Custo do produto na moeda local.

- `formattedPrice` string - O preço local do produto formatado.

- `currencyCode` string - código de 3 caracteres apresentando a moeda de um produto com base no padrão ISO 4217.

- `introductoryPrice` [ProductDiscount](/pt/docs/latest/api/structures/product-discount) (optional) - The object containing introductory price information for the product. disponível para o produto.

- `discounts` [ProductDiscount](/pt/docs/latest/api/structures/product-discount)[] - An array of discount offers

- `subscriptionGroupIdentifier` string - O identificador do subscription group ao qual a subscription pertence.

- `subscriptionPeriod` [ProductSubscriptionPeriod](/pt/docs/latest/api/structures/product-subscription-period) (optional) - The period details for products that are subscriptions.

- `isDownloadable` boolean - Um valor booleano que indica se a App Store possui conteúdo a ser baixado para este produto. `true` se pelo menos um arquivo foi associado com o produto.

- `downloadContentVersion` string - A string que identifica a versão do conteúdo.

- `downloadContentLengths` number[] - Tamanho total do conteúdo em bytes.
