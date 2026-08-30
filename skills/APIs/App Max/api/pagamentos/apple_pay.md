---
title: "Pagamento com Apple Pay (POST /v1/payments/apple-pay)"
description: "Processamento de pagamentos digitais via Apple Pay, validação de payload tokenizado e autenticação biométrica."
topics:
  - pagamentos
  - apple-pay
  - carteira-digital
  - token-apple
  - post-v1-payments-apple-pay
keywords:
  - POST /v1/payments/apple-pay
  - apple pay
  - payment_token
  - merchant_session
  - apple wallet
related:
  - ../../index_master.md
  - visao_geral.md
  - cartao_credito.md
  - pix.md
source_scope:
  - https://docs.appmax.com.br/api-reference/payments/apple-pay
---

# Pagamento com Apple Pay

`POST /v1/payments/apple-pay`

**Base URL**

- Produção: https://api.appmax.com.br
- Sandbox: https://api.sandboxappmax.com.br

O Apple Pay é uma solução de pagamento digital da Apple que permite realizar compras com cartão de crédito de forma rápida, segura e
conveniente em dispositivos compatíveis (iPhone, iPad, Apple Watch e Mac).

Utilizando tokenização e autenticação biométrica (Face ID ou Touch ID),
o Apple Pay elimina a digitação manual dos dados do cartão a cada compra,
reduzindo o tempo de checkout e aumentando a conversão. Além disso,
transações via Apple Pay não possuem risco de chargeback por fraude.

> **Compatibilidade**
>
> O Apple Pay só é exibido no navegador Safari (macOS ou iOS) e em
> dispositivos Apple com suporte ao método. Em outros navegadores, o botão
> não aparece.
## Antes de começar: escolha o seu modelo de integração

Esta é a decisão que mais gera dúvidas. Existem dois modelos de integração
com Apple Pay pela Appmax, e a diferença está em quem registra o domínio
junto à Apple e em quem controla o `merchantIdentifier`.

> **Em todos os modelos, você hospeda o arquivo `.well-known`**
>
> Independentemente do modelo abaixo, é sempre responsabilidade do lojista
> (ou do integrador, em nome da loja) publicar o arquivo
> `.well-known/apple-developer-merchantid-domain-association` na raiz de
> cada domínio onde o Apple Pay será usado — inclusive no modelo integrado.
> Veja o passo a passo completo, com o arquivo para download, em
> [Configuração de domínios para Apple Pay](apple_pay_dominio.md).
| Aspecto | Modelo integrado (loja integrada / integrador via AppStore) | Fluxo direto |
| --- | --- | --- |
| Quem cadastra o domínio na Apple | A Appmax, por API, sob a conta/merchant Apple da Appmax | O próprio lojista, na conta Apple dele |
| Quem hospeda o `.well-known` | O lojista/integrador, em todos os casos | O lojista hospeda o arquivo na raiz do domínio |
| `merchantIdentifier` | Gerido pela Appmax, compartilhado entre vários domínios do integrador | Do próprio lojista |
| Indicado para | Plataformas/integradores que operam várias lojas (ex.: e-commerce SaaS) | Lojista único que gerencia a própria conta Apple |

> **Como saber qual é o seu caso?**
>
> Se você é uma plataforma/integrador e instala o app da Appmax em nome de
> várias lojas (fluxo de AppStore, com `client_id`/`external_id` por loja),
> você está no **modelo integrado**. Se você é um lojista configurando o
> Apple Pay diretamente na sua própria conta Apple, você está no
> **fluxo direto**. Nos dois casos, você precisa publicar o arquivo
> `.well-known` (veja o aviso acima).
Os passos abaixo indicam, quando relevante, o que muda entre os dois modelos.

## Glossário

| Termo | Descrição |
| --- | --- |
| Apple Pay | Solução de pagamento da Apple para compras seguras via Apple Wallet, com autenticação biométrica e criptografia ponta a ponta. |
| Apple Token (Apple Pay Token) | Objeto JSON criptografado retornado pela PaymentSheet após o usuário confirmar o pagamento, contendo `paymentData`, `paymentMethod` e `transactionIdentifier`. É o cartão tokenizado e serve para efetivar o pagamento na API Appmax. Gerado por transação. |
| PaymentSheet | Interface nativa do Apple Pay que exibe valor, métodos disponíveis e solicita autenticação (Face ID, Touch ID ou senha). |
| Merchant Session | Sessão JSON assinada pela Apple, válida para um domínio e `merchantIdentifier`. Valida o site antes de exibir a PaymentSheet. Obtida em tempo real a cada transação. |
| `.well-known/apple-developer-merchantid-domain-association` | Arquivo estático de validação de domínio da Apple, vinculado ao `merchantIdentifier` (não à transação). Responsabilidade do lojista em **todos** os modelos de integração — veja [Configuração de domínios para Apple Pay](apple_pay_dominio.md). |
| `external_id` | UUID que identifica o par (app instalado + loja). Gerado na instalação e usado nas chamadas da CDN. Veja [Instalação do Aplicativo](../../aplicativos/fluxo_instalacao.md). |

## Pré-requisitos

- **Navegador compatível** — Safari (macOS ou iOS).
- **Carteira Apple configurada** — ao menos um cartão Visa ou Mastercard no Apple Wallet.
- **Instalação do app** feita com o parâmetro `domain_name` (passo 1).
- **Arquivo `.well-known` publicado** e domínio validado junto à Apple (passo 2).
- **Appmax JS incluído e inicializado** com os callbacks (passo 3).

Componentes do fluxo:

- **Script JS:** `https://scripts.appmax.com.br/appmax.min.js` (produção) — em sandbox use `https://scripts.sandboxappmax.com.br/appmax.min.js`.
- **Domínio validado** junto à Apple.
- **Requisição de pagamento** para a API Appmax com `appleToken`, `order_id` e `customer_id` válidos.

## 1. Autorizar a instalação do aplicativo

Registre o aplicativo na Appmax informando o domínio:

```bash
curl --location 'https://api.appmax.com.br/app/authorize' \
  --header 'Content-Type: application/json' \
  --header 'Authorization: Bearer SEU_TOKEN' \
  --data '{
    "app_id": "APP_ID",
    "external_key": "EXTERNAL_KEY",
    "url_callback": "URL_CALLBACK",
    "domain_name": "subdominio.dominio.com.br"
  }'
```

> **O parâmetro `domain_name` deve conter subdomínio + domínio (ex.:**
>
> `minhaloja.minhaintegracao.com.br`). Também é possível enviar vários
> domínios com `domain_names` (array). Mais detalhes em
> [Instalação do Aplicativo](../../aplicativos/fluxo_instalacao.md).
## 2. Publicar o `.well-known` e validar o domínio

### 2.1 Publicar o arquivo `.well-known` (obrigatório em todos os modelos)

Em **todos** os modelos de integração, cada domínio onde o botão Apple Pay
será exibido precisa servir, na raiz do site, o arquivo de validação:

```
https://subdominio.dominio.com.br/.well-known/apple-developer-merchantid-domain-association
```

O arquivo, o passo a passo de publicação e o comando para verificar se ele
está acessível estão em
[Configuração de domínios para Apple Pay](apple_pay_dominio.md).

> **O conteúdo do `.well-known` **não** é o Apple Token. O Apple Token é o**
>
> cartão tokenizado, gerado por transação. O `.well-known` é um arquivo
> estático de validação de domínio, vinculado ao `merchantIdentifier` — o
> mesmo arquivo é usado em todos os domínios da sua implementação.
### 2.2 Cadastrar o domínio junto à Apple

> **Este passo muda conforme o modelo de integração.**
>
>
**Modelo integrado (loja integrada / integrador):** você não precisa
cadastrar o domínio pelo painel da Apple. O registro é feito por API,
pela Appmax, sob o `merchantIdentifier` da Appmax. Basta que o domínio
tenha sido informado na instalação (passo 1) e que o arquivo `.well-known`
(passo 2.1) já esteja publicado — a Apple confere o arquivo ao validar o
domínio.

Se o domínio do lojista mudar: o novo domínio é tratado como um domínio
novo e precisa ser registrado novamente. Não é necessário criar um novo
merchant.

**Fluxo direto:** o cadastro do domínio é feito por você, diretamente no
painel de desenvolvedor da Apple, na sua própria conta. A Apple valida o
arquivo `.well-known` publicado no passo 2.1 no momento do cadastro.

## 3. Configuração e inicialização do script no front-end

> **Esta seção resume o essencial. Para o passo a passo completo — seletores**
>
> do botão, ordem de carregamento em SPA, contrato de DOM e troubleshooting
> — veja [Implementando o botão Apple Pay com o Appmax JS](apple_pay_appmax_js.md).
> **O `externalId` esperado aqui é o mesmo `external_id` que você retornou com**
>
> HTTP 200 na etapa de [Instalação do Aplicativo](../../aplicativos/fluxo_instalacao.md).
O `appmax.min.js` faz três coisas:

- Estiliza o botão com o design oficial da Apple (opcional).
- Inicializa o botão para abrir a PaymentSheet com os dados do carrinho.
- Dispara os callbacks de sucesso, erro, atualização e autorização.

### 3.1 Inicializar com onSuccess, onError, externalId, onUpdate e onAuthorize

```html
<script>
  // Callback de autorização: recebe o Apple Token e efetiva o pagamento
  const onAuthorize = async (appleToken) => {
    await processarPagamento(appleToken);
  };
  // Callback de erro
  const onError = (err) => {
    console.error('Erro no Apple Pay:', err);
  };
  // Callback de sucesso: recebe dados como o IP do cliente
  const onSuccess = (data) => {
    customer.value.ip = data.ip || 'IP não encontrado.';
  };
  // Callback de update: deve retornar os dados atuais do checkout
  const onUpdate = () => getCheckoutData();
  onMounted(() => {
    const script = document.createElement('script');
    // Produção: https://scripts.appmax.com.br/appmax.min.js
    // Sandbox:  https://scripts.sandboxappmax.com.br/appmax.min.js
    script.src = 'https://scripts.appmax.com.br/appmax.min.js';
    script.onload = () => {
      if (window.AppmaxScripts) {
        // Ordem dos parâmetros:
        window.AppmaxScripts.init(onSuccess, onError, externalId, onUpdate, onAuthorize);
      } else {
        console.error('AppmaxScripts não carregado.');
      }
    };
    document.head.appendChild(script);
  });
</script>
```

> **Atenção à ordem e aos nomes dos callbacks. O callback que recebe o token é**
>
> o `onAuthorize` (não `onAutorize`). A ordem em `init` é: `onSuccess`,
> `onError`, `externalId`, `onUpdate`, `onAuthorize`.
### 3.2 Mantendo o onUpdate atualizado (JS puro)

O `onUpdate` deve retornar os dados atuais do checkout para alimentar a
PaymentSheet (valor, frete, desconto, parcelas, itens):

```js
function getCheckoutData() {
  const products = Array.from(document.querySelectorAll('.product-item')).map(item => ({
    name:     item.querySelector('.product-name').textContent,
    price:    parseFloat(item.querySelector('.product-price').value),
    quantity: parseInt(item.querySelector('.product-quantity').value, 10)
  }));
  const freight    = parseFloat(document.getElementById('freight').value  || 0);
  const discount   = parseFloat(document.getElementById('discount').value || 0);
  const totalItems = products.reduce((sum, p) => sum + p.price * p.quantity, 0);
  return {
    orderId:      sessionStorage.getItem('order_id') || '',
    total:        totalItems + freight - discount,
    freight:      freight,
    discount:     discount,
    installments: parseInt(document.getElementById('installments').value, 10) || 1,
    products:     products
  };
}
```

> **Sobre o `orderId` no `onUpdate`: o campo aqui serve à montagem da**
>
> PaymentSheet. O `order_id` obrigatório é o do request de pagamento
> (`POST /v1/payments/apple-pay`) — ele não precisa necessariamente ser
> setado no `onUpdate`, mas precisa ser o `order_id` de uma Order já
> existente na Appmax (veja o passo 4).
## 4. Processar o pagamento

O pagamento Apple Pay exige três elementos: `customer_id`, `order_id` e o
`appleToken`. A ordem é: criar customer → criar order → efetivar o pagamento.

```js
async function processarPagamento(appleToken) {
  // 1. Criar customer — POST /v1/customers  (veja /api-reference/customers/criar-atualizar)
  // 2. Criar order    — POST /v1/orders     (veja /api-reference/orders/criar-pedido)
  // 3. Efetivar pagamento — POST /v1/payments/apple-pay
  const paymentPayload = {
    order_id,        // Order já existente na Appmax
    customer_id,
    payment_data: {
      apple_pay: {
        installments: "3",                       // 1 a 12
        holder_document_number: "22233344450",   // obrigatório
        soft_descriptor: "EXEMPLOLOJA",          // opcional, máx. 13 caracteres
        // Do appleToken.paymentData:
        payment_data: {
          version: "EC_v1",
          data: "exemplo",
          signature: "signature",
          header: {
            ephemeralPublicKey: "MFk...==",
            transactionId: "trx....wvu"
          }
        },
        // Do appleToken.paymentMethod:
        payment_method: {
          displayName: "Visa •••• 3714",
          network: "Visa",
          type: "credit"
        },
        // Do appleToken.transactionIdentifier:
        transaction_identifier: "trx....wvu"
      }
    }
  };
  const resp = await fetch('https://api.appmax.com.br/v1/payments/apple-pay', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer SEU_TOKEN` },
    body: JSON.stringify(paymentPayload)
  });
  if (!resp.ok) throw new Error('Falha no pagamento');
  return resp.json();
}
```

Mapeamento do Apple Token para o payload:

| Campo do `appleToken` | Vai em |
| --- | --- |
| `paymentData` | `payment_data.apple_pay.payment_data` |
| `paymentMethod` | `payment_data.apple_pay.payment_method` |
| `transactionIdentifier` | `payment_data.apple_pay.transaction_identifier` |

> **Campos obrigatórios: `order_id`, `installments` (1–12) e**
>
> `holder_document_number`. `soft_descriptor` é opcional (máx. 13 caracteres).
## Validação em tempo real (Merchant Session)

A validação do domínio junto à Apple não é única — a Apple revalida o
domínio/merchant a cada transação, no momento em que a PaymentSheet é
aberta (a Merchant Session é obtida em tempo real). É um processo rápido e
transparente para o usuário; o Appmax JS cuida disso automaticamente. Veja
[`POST /v1/apple-pay/merchant-session`](apple_pay_merchant_session.md).

## Testes e Sandbox

> **Não é possível testar o Apple Pay em `localhost`. O Apple Pay exige um**
>
> domínio público, com HTTPS válido e devidamente registrado/configurado. A
> Apple não valida domínios não públicos.
> **Não existe merchant session de sandbox**
>
> A validação de domínio/merchant é sempre feita contra a infraestrutura de
> **produção** da Apple, mesmo em ambiente de sandbox — não existe uma
> segunda instância só para teste. Trate sandbox e produção como
> assimétricos nesse ponto específico: o script de sandbox aponta para o
> mesmo endpoint de validação que o de produção.
Cartões de teste da Apple: a referência oficial é
[developer.apple.com/apple-pay/sandbox-testing](https://developer.apple.com/apple-pay/sandbox-testing)
— que exige uma Sandbox Apple Account própria.

> **Modelo integrado**
>
> Como o pagamento roda sob a conta Apple da Appmax, não é possível usar
> cartões de teste da Apple da sua própria conta (não conseguimos provisionar
> credenciais de teste de terceiros na nossa conta Apple, por segurança).
> Nesse caso, a forma prática de testar é usar um cartão real e
> cancelar/estornar as ordens pelo admin.
## Ambientes

|  | Sandbox | Produção |
| --- | --- | --- |
| Script JS | `https://scripts.sandboxappmax.com.br/appmax.min.js` | `https://scripts.appmax.com.br/appmax.min.js` |
| API | `https://api.sandboxappmax.com.br` | `https://api.appmax.com.br` |

## Perguntas frequentes (FAQ)

**O `appleToken` é usado para quê?**

É o cartão tokenizado pela Apple. Ele precisa ser enviado ao
`POST /v1/payments/apple-pay` (nos campos `payment_data`, `payment_method`,
`transaction_identifier`). Sem ele, o pagamento não é processado. É de uso
único por transação.

**Preciso hospedar o arquivo `.well-known` em cada domínio?**

Sim, em **todos** os modelos de integração — isso não muda entre o modelo
integrado e o fluxo direto. O que muda entre os modelos é apenas quem
cadastra o domínio junto à Apple (a Appmax, por API, no modelo integrado;
você mesmo, pelo painel da Apple, no fluxo direto). Veja
[Configuração de domínios para Apple Pay](apple_pay_dominio.md).

**O `order_id` do `onUpdate` precisa ser de uma Order real da Appmax?**

O `order_id` obrigatório é o do request de pagamento e precisa ser de uma
Order existente (criada via `POST /v1/orders`). Ele não precisa vir do
`onUpdate`, mas precisa estar no payload do pagamento.

**Se o domínio do lojista mudar, preciso de um novo merchant?**

Não. O novo domínio é registrado novamente na instalação existente.

**Existe um token/arquivo por lojista, ou um geral?**

O Apple Token é sempre por transação. O conteúdo do arquivo de validação de
domínio é o mesmo para todos os domínios vinculados ao `merchantIdentifier`
gerido pela Appmax — não é gerado por lojista. Ainda assim, cada domínio
precisa hospedar sua própria cópia desse mesmo arquivo (veja
[Configuração de domínios para Apple Pay](apple_pay_dominio.md)). O que
é por lojista são as credenciais (`client_id`/`client_secret`) e o
`external_id`.

**A validação do domínio demora?**

O registro do domínio é rápido (chamada síncrona). A validação da Merchant
Session ocorre em tempo real, a cada transação — também rápida.

**Consigo testar pelo sandbox da Appmax?**

É preciso um domínio público registrado e configurado. No modelo integrado,
o caminho prático é cartão real + estorno (veja Testes e Sandbox).

## Conclusão — checklist

1. Autorizar a instalação com `domain_name`.
2. Publicar o arquivo `.well-known` em cada domínio (obrigatório em todos os modelos) e cadastrar o domínio junto à Apple — Appmax por API (modelo integrado) ou você mesmo (fluxo direto). Veja [Configuração de domínios para Apple Pay](apple_pay_dominio.md).
3. Incluir e inicializar o Appmax JS com `onSuccess`, `onError`, `externalId`, `onUpdate`, `onAuthorize`.
4. Criar customer → criar order → processar o `appleToken` via `POST /v1/payments/apple-pay`.

## Autenticação

- `Authorization: Bearer <token>`
  Token Bearer do **merchant** obtido via `POST /oauth2/token` usando as credenciais do merchant (não do app). Veja [Autenticação](../../primeiros_passos/autenticacao.md).

## Corpo da requisição (obrigatório)

| Campo | Tipo | Obrigatório | Descrição |
|---|---|---|---|
| `order_id` | integer | sim |  |
| `customer_id` | integer | sim |  |
| `payment_data` | object | sim |  |
| `payment_data.apple_pay` | object | sim |  |
| `payment_data.apple_pay.installments` | string | não |  |
| `payment_data.apple_pay.holder_document_number` | string | não |  |
| `payment_data.apple_pay.soft_descriptor` | string | não |  |
| `payment_data.apple_pay.payment_data` | object | não | Apple Pay Token devolvido pela PaymentSheet do Safari. |
| `payment_data.apple_pay.payment_data.data` | string | não |  |
| `payment_data.apple_pay.payment_data.signature` | string | não |  |
| `payment_data.apple_pay.payment_data.header` | object | não |  |
| `payment_data.apple_pay.payment_data.header.publicKeyHash` | string | não |  |
| `payment_data.apple_pay.payment_data.header.ephemeralPublicKey` | string | não |  |
| `payment_data.apple_pay.payment_data.header.transactionId` | string | não |  |
| `payment_data.apple_pay.payment_data.version` | string | não |  |
| `payment_data.apple_pay.payment_method` | object | não |  |
| `payment_data.apple_pay.payment_method.displayName` | string | não |  |
| `payment_data.apple_pay.payment_method.network` | string | não |  |
| `payment_data.apple_pay.payment_method.type` | string | não |  |
| `payment_data.apple_pay.transaction_identifier` | string | não |  |

### Exemplo de requisição

```json
{
  "order_id": 123,
  "customer_id": 456,
  "payment_data": {
    "apple_pay": {
      "installments": "3",
      "holder_document_number": "22233344450",
      "soft_descriptor": "EXEMPLOLOJA",
      "payment_data": {
        "data": "exemplo",
        "signature": "signature",
        "header": {
          "publicKeyHash": "Z...",
          "ephemeralPublicKey": "MFk...==",
          "transactionId": "trx....wvu"
        },
        "version": "EC_v1"
      },
      "payment_method": {
        "displayName": "Visa 3714",
        "network": "Visa",
        "type": "credit"
      },
      "transaction_identifier": "trx....wvu"
    }
  }
}
```

## Respostas

### 201

Pagamento Apple Pay aprovado.

## Veja Também

- [Index Master](../../index_master.md)
- [Visao Geral](visao_geral.md)
- [Cartao Credito](cartao_credito.md)
- [Pix](pix.md)
