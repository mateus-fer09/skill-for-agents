---
title: "Objeto Transaction"
description: "- transactionIdentifier string - Uma string que identifica exclusivamente uma transação de pagamento bem-sucedida."
topics:
  - "Api"
  - "Estruturas"
keywords:
  - "Objeto Transaction"
  - "transactionIdentifier"
  - "transactionDate"
  - "originalTransactionIdentifier"
  - "transactionState"
  - "purchasing"
  - "purchased"
  - "failed"
source_scope:
  - "https://www.electronjs.org/pt/docs/latest/api/structures/transaction"
---

# Objeto Transaction

- `transactionIdentifier` string - Uma string que identifica exclusivamente uma transação de pagamento bem-sucedida.

- `transactionDate` string - A data em que a transação foi adicionada à fila de pagamento da App Store.

- `originalTransactionIdentifier` string - O identificador da transação restaurada pela App Store.

- `transactionState` string - o estado da transação, pode ser `purchasing`, `purchased`, `failed`, `restored` ou `deferred`.

- `errorCode` Integer - O código do erro, que ocorreu ao processar a transação.

- `errorMessage` string - A mensagem do erro, que ocorreu ao processar a transação.

- `payment` Object

  - `productIdentifier` string - O identificador do produto comprado.

  - `quantity` Integer  - A quantidade comprada.

  - `applicationUsername` string - Um identificador opaco para a conta do usuário no seu sistema.

  - `paymentDiscount` [PaymentDiscount](/pt/docs/latest/api/structures/payment-discount) (optional) - The details of the discount offer to apply to the payment.
