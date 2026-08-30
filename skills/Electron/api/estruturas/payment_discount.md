---
title: "Objeto PaymentDiscount"
description: "- identifier string - Uma string usada identificar unicamente uma oferta de desconto para um produto."
topics:
  - "Api"
  - "Estruturas"
keywords:
  - "Objeto PaymentDiscount"
  - "identifier"
  - "keyIdentifier"
  - "nonce"
  - "signature"
  - "timestamp"
source_scope:
  - "https://www.electronjs.org/pt/docs/latest/api/structures/payment-discount"
---

# Objeto PaymentDiscount

- `identifier` string - Uma string usada identificar unicamente uma oferta de desconto para um produto.

- `keyIdentifier` string - Nome referência da chave usada para gerar a assinatura.

- `nonce` string - Identificador único universal (UUID) definido por você.

- `signature` string - Assinatura em UTF-8 gerada a partir das propriedades da oferta de desconto, assinada de maneira criptografada.

- `timestamp` number - A data e hora da criação da assinatura em milissegundos no formato Unix epoch time.
