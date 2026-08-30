---
title: "Appmax JS - Script de Segurança e Tokenização"
description: "Implementação do script oficial appmax.min.js para coleta de IP do comprador e tokenização segura de cartões de crédito."
topics:
  - appmax-js
  - frontend
  - tokenizacao
  - ip-reverso
  - antifraude
  - seguranca
keywords:
  - appmax.min.js
  - tokenizar
  - client_id
  - token
  - card_token
  - coleta de ip
  - pci-dss
related:
  - ../index_master.md
  - quickstart.md
  - autenticacao.md
source_scope:
  - https://docs.appmax.com.br/guides/appmax-js
---

# Appmax JS

## O que é o Appmax JS

O `appmax.js` é uma biblioteca JavaScript desenvolvida pela Appmax para integração segura em páginas de checkout. Ao incluir o script, você não precisa se preocupar com alterações no visual da loja, já que ele atua de forma discreta e eficiente.

> **Coleta de IP é sempre obrigatória**
>
> A coleta de IP via Appmax JS é **obrigatória** para todas as integrações — inclusive se sua arquitetura estiver em escopo PCI-DSS. Não existe alternativa via API só para esta etapa.
> **Tokenização server-side exige PCI-DSS**
>
> Já a tokenização do cartão pode ser feita de duas formas: pelo próprio Appmax JS (recomendado — o script isola os dados sensíveis do seu servidor) ou diretamente pela sua API, caso sua arquitetura esteja em escopo PCI-DSS. Ao tokenizar pelo backend, o seu servidor toca o número do cartão e o CVV em claro — isso só é permitido dentro do escopo PCI-DSS. Se você não tem certeza, use o caminho via Appmax JS. Veja [Tokenização do cartão de crédito](../api/pagamentos/cartao_credito.md#tokenizacao).
## Como funciona

Devido as diretrizes do **PCI DSS** (Padrão de Segurança de Dados da Indústria de Cartões de Pagamento), é crucial proteger dados sensíveis. O `appmax.js` foi projetado para:

- Evitar que dados sensíveis do cartão passem pelos seus servidores.
- Coletar o IP do cliente para segurança do fluxo de pagamento.

## Como usar

#### 1. Incluir o script da CDN

```html
<script src="https://scripts.appmax.com.br/appmax.min.js"></script>
```

#### 2. Inicializar o AppmaxScripts

Após carregar o script, inicialize com os parâmetros abaixo:

```javascript
window.AppmaxScripts.init(onSuccess, onError, externalId, onUpdate, onAuthorize);
```

| Parâmetro      | Obrigatório                                | Descrição                                                                                                  |
| -------------- | ------------------------------------------ | ---------------------------------------------------------------------------------------------------------- |
| `onSuccess`    | Sim                                        | Callback de sucesso. Recebe `{ ip, token? }` após coleta de IP ou tokenização.                             |
| `onError`      | Sim                                        | Callback de erro. Recebe o erro lançado pelo script.                                                       |
| `externalId`   | Sim para tokenização e Apple Pay           | Identificador da instalação do app na loja. Ver [`external-id`](../fundamentos/external_id.md).                      |
| `onUpdate`     | Sim para Apple Pay                         | Callback chamado quando o usuário muda dados na PaymentSheet (frete, método etc.).                         |
| `onAuthorize`  | Sim para Apple Pay                         | Callback chamado quando o pagamento é autorizado. Recebe o Apple Token.                                    |

> **Implementando o botão do Apple Pay?**
>
> `onUpdate` e `onAuthorize` são só metade da história — o botão também exige seletores de DOM específicos e uma ordem de carregamento própria. Veja o passo a passo dedicado em [Implementando o botão Apple Pay com o Appmax JS](../api/pagamentos/apple_pay_appmax_js.md).
> **`externalId` é obrigatório para tokenização **pelo Appmax JS****
>
> Sem o `externalId`, o submit de qualquer form com `data-appmax-checkout` falha com `External ID is required` antes de a chamada HTTP ser feita. O valor é o mesmo `external_id` definido durante a [instalação do app na loja](../aplicativos/fluxo_instalacao.md#health-check) — persista no seu banco e renderize no template do checkout. Veja [`external-id`](../fundamentos/external_id.md) para a referência completa.
>
> Se sua arquitetura está em escopo PCI-DSS e você prefere tokenizar direto pela sua API (sem o script), use o caminho via backend com o **access token do merchant** (`Authorization: Bearer`) em vez do `externalId` — veja [Tokenização do cartão de crédito](../api/pagamentos/cartao_credito.md#tokenizacao).
> **`init()` pode lançar exceção síncrona para Apple Pay**
>
> Se você passar `onUpdate` e `onAuthorize` (fluxo Apple Pay) sem um `externalId` válido, o `init` lança `Error("External ID is required for Apple Pay use.")` **de forma síncrona**, dentro da própria chamada — não via `onError`. Em React, isso estoura dentro do `useEffect` e pode derrubar a árvore inteira se não houver `try/catch` ao redor da chamada.
Se você só vai usar a coleta de IP (sem tokenização nem Apple Pay), os parâmetros `externalId`, `onUpdate` e `onAuthorize` podem ser omitidos:

```javascript
window.AppmaxScripts.init(onSuccess, onError);
```

## Contrato de DOM: o `init` não é reativo

O `AppmaxScripts.init(...)` faz `querySelector` **uma única vez**, no momento em que é chamado, e não observa mudanças no DOM depois disso. Em uma página tradicional (HTML renderizado no servidor, nada muda depois do load) isso é transparente. Em React, Vue ou qualquer SPA, exige atenção:

- **O gatilho de IP e o botão do Apple Pay precisam existir no DOM *antes* do `init` rodar.** Se o elemento aparece depois — atrás de uma rota, um passo do checkout, um `v-if`/condicional — o SDK nunca o encontra. Não há erro, não há log: o clique ou a coleta simplesmente não acontecem.
- **`init()` não é idempotente.** Cada chamada registra novos listeners, sem remover os anteriores. Com React StrictMode (que monta efeitos duas vezes em desenvolvimento) ou qualquer componente que re-renderiza e re-executa o efeito de inicialização, isso acumula handlers silenciosamente. Chame `init` uma única vez por carregamento de página, não a cada re-render.

## Funcionalidades disponíveis

### Coleta do IP do cliente

A coleta acontece quando o SDK encontra, no DOM, **um dos gatilhos** abaixo — não é preciso dar submit em nada nem esperar interação do usuário. Sem um dos dois presente no momento do `init`, `onSuccess` e `onError` simplesmente não disparam (ver "Contrato de DOM" acima — é uma falha silenciosa, sem erro nenhum).

| Gatilho | Quando usar |
| --- | --- |
| `form[data-appmax-customer]` | Página tradicional (MPA), com formulário nativo. |
| `.appmax-ip` (qualquer elemento) | **Recomendado para SPA** — não exige um `` na árvore e evita a injeção de `` descrita no aviso abaixo. |

```html
<form id="customer-form" data-appmax-customer>
  <div>
    <label for="first-name">Primeiro Nome:</label>
    <input type="text" id="first-name" name="first-name" required />
  </div>
  <div>
    <label for="last-name">Ultimo Nome:</label>
    <input type="text" id="last-name" name="last-name" required />
  </div>
  <div>
    <label for="email">Email:</label>
    <input type="email" id="email" name="email" required />
  </div>
  <div>
    <label for="phone">Telefone:</label>
    <input type="text" id="phone" name="phone" required />
  </div>
  <button type="submit">Enviar</button>
</form>
```

Ou, sem form nenhum — o elemento só precisa existir, não precisa ser visível:

```html
<span class="appmax-ip" hidden></span>
```

> **O SDK injeta um `` dentro do `form[data-appmax-customer]`**
>
> Ao encontrar esse form, o SDK insere um `` nele via DOM direto — fora do controle do React/Vue. Em uma SPA esse nó pode ser descartado no próximo re-render sem aviso nenhum. Se você está numa SPA, prefira o gatilho `.appmax-ip` acima, que não sofre esse problema.
Para frameworks como Vue.js, o gatilho (`.appmax-ip` no exemplo abaixo) precisa estar renderizado **antes** do `init` — veja "Contrato de DOM" acima. Recupere o IP no callback de sucesso:

```html
<template>
  <span class="appmax-ip" hidden></span>
</template>
```

```javascript
const customer = ref({
  first_name: '',
  last_name: '',
  email: '',
  phone: '',
  ip: ''
})

const success = (data) => {
  customer.value.ip = data.ip || 'IP nao encontrado.'
}

const error = (error) => {
  console.error('Error:', error)
}

onMounted(() => {
  const script = document.createElement('script')
  script.src = 'https://scripts.appmax.com.br/appmax.min.js'
  script.onload = () => {
    if (window.AppmaxScripts) {
      window.AppmaxScripts.init(success, error)
    }
  }
  document.head.appendChild(script)
})
```

### Tokenização de pagamento

A tokenização é realizada quando um formulário é enviado com o atributo `data-appmax-checkout`. Os dados sensíveis do cartão são convertidos em um token seguro.

> **Requer `externalId` na inicialização**
>
> Para tokenizar pelo script, inicialize com o `externalId` da loja: `AppmaxScripts.init(onSuccess, onError, externalId)`. Sem ele, o submit do form falha com `External ID is required`. Veja [`external-id`](../fundamentos/external_id.md).
O `token` chega de volta no callback `onSuccess({ ip, token })` — você não precisa tocar em HTTP nem em headers. Se precisar implementar a tokenização manualmente (sem o script), o contrato do endpoint subjacente está em [Tokenização do cartão de crédito](../api/pagamentos/cartao_credito.md#tokenizacao) — inclui o caminho alternativo via backend (Bearer do merchant), permitido apenas em escopo PCI-DSS.

```html
<form id="payment-form" method="POST" data-appmax-checkout>
  <div>
    <label for="card-number">Numero do Cartao:</label>
    <input type="text" id="card-number" name="card-number"
           appmax-form-element="number" required />
  </div>
  <div>
    <label for="card-holder-name">Nome do Titular:</label>
    <input type="text" id="card-holder-name" name="card-holder-name"
           appmax-form-element="holder_name" required />
  </div>
  <div>
    <label for="exp-month">Mes de Expiracao:</label>
    <input type="text" id="exp-month" name="exp-month"
           appmax-form-element="expiration_month" required />
  </div>
  <div>
    <label for="exp-year">Ano de Expiracao:</label>
    <input type="text" id="exp-year" name="exp-year"
           appmax-form-element="expiration_year" required />
  </div>
  <div>
    <label for="cvv">CVV:</label>
    <input type="text" id="cvv" name="cvv"
           appmax-form-element="cvv" required />
  </div>
  <button type="submit">Pagar</button>
</form>
```

Os campos são identificados pelo atributo `appmax-form-element`:

| Atributo            | Descrição                        |
| ------------------- | -------------------------------- |
| `number`            | Número do cartão de crédito      |
| `holder_name`       | Nome do titular do cartão        |
| `expiration_month`  | Mês de expiração                 |
| `expiration_year`   | Ano de expiração                 |
| `cvv`               | Código de segurança (CVV)        |

## Teste interativo

Use o playground abaixo para testar as funcionalidades da CDN diretamente no browser — sem precisar instalar nada.

> Ferramenta interativa disponível na versão web desta página.

## Veja Também

- [Index Master](../index_master.md)
- [Quickstart](quickstart.md)
- [Autenticacao](autenticacao.md)
