---
title: "Botão Apple Pay com Appmax JS"
description: "Renderização e controle do botão oficial Apple Pay no frontend com appmax.min.js em SPAs (React, Vue) e Vanilla JS."
topics:
  - apple-pay
  - appmax-js
  - frontend
  - botao-apple-pay
  - spa-react-vue
keywords:
  - ApplePaySession
  - appmax.min.js
  - apple pay button
  - canMakePayments
  - callbacks
related:
  - ../../index_master.md
  - visao_geral.md
  - cartao_credito.md
  - pix.md
source_scope:
  - https://docs.appmax.com.br/api-reference/payments/apple-pay-appmax-js
---

# Implementando o botão Apple Pay com o Appmax JS

Este guia cobre a parte do fluxo Apple Pay que roda **no navegador, via `appmax.min.js`**: como o botão é renderizado, o contrato de DOM que o script exige e como conectar os callbacks até o pagamento. Para o restante do fluxo, veja:

- [Instalação do aplicativo](../../aplicativos/fluxo_instalacao.md) — o `domain_name` precisa estar configurado antes de qualquer coisa aqui funcionar.
- [Configuração de domínios para Apple Pay](apple_pay_dominio.md) — publicação do arquivo `.well-known`, obrigatória em todos os modelos.
- [Appmax JS](../../primeiros_passos/appmax_js.md) — assinatura completa do `init`, coleta de IP e tokenização de cartão (este guia assume que você já leu a seção "Como usar" de lá).
- [Pagamento com Apple Pay](apple_pay.md) — o contrato do endpoint (`payload`, mapeamento do Apple Token, modelo integrado × fluxo direto, FAQ).

> **Pré-requisitos rápidos**
>
> 1. Instalação autorizada com `domain_name` (ou `domain_names`).
> 2. Arquivo `.well-known` publicado no domínio.
> 3. Script (`scripts.appmax.com.br/appmax.min.js` em produção) carregado na página.
>
> Sem os três, o botão pode até aparecer, mas a validação do domínio falha na hora de abrir a PaymentSheet.
---

## Renderizando o botão

O `appmax.min.js` reconhece dois seletores no DOM. Você só precisa de um deles — não dos dois.

| Seletor | Papel |
| --- | --- |
| `.appmax-apple-pay-btn` | Container que **você** renderiza vazio. O SDK substitui o `innerHTML` dele pelo botão oficial da Apple (SVG + estilos inclusos). Caminho recomendado — você não precisa desenhar o botão. |
| `[data-appmax-apple-pay]` | O botão em si. É neste elemento que o SDK registra o `click`. Use esse atributo direto no seu próprio botão se preferir controlar o markup. |

Caminho mais simples — deixe o SDK desenhar o botão:

```html
<div class="appmax-apple-pay-btn"></div>
```

O SDK injeta algo como:

```html
<button data-appmax-apple-pay class="applepay-button">
  <span class="applepay-button__label">Pagar com</span>
  <svg class="applepay-button__logo">...</svg>
</button>
```

> **O botão só aparece se o dispositivo suportar Apple Pay**
>
> Fora do Safari (ou em dispositivo sem Apple Pay configurado), `ApplePaySession.canMakePayments()` retorna `false` e o SDK não ativa o botão — ele pode ficar vazio ou oculto, dependendo de como você estilizou o container. Isso é esperado, não é bug.
---

## Ordem de carregamento: o botão precisa existir antes do `init`

O `AppmaxScripts.init(...)` procura o botão **uma única vez**, no momento em que roda, e não observa mudanças no DOM depois disso — o mesmo contrato descrito em ["Contrato de DOM" na página do Appmax JS](../../primeiros_passos/appmax_js.md#contrato-de-dom-o-init-nao-e-reativo). Para o botão do Apple Pay, a consequência prática é:

- Se o container/botão só é montado **depois** do `init` — atrás de uma rota, um passo do checkout, um `v-if`/condicional — o clique não vai disparar nada. Sem erro, sem log.
- Se o componente que chama `init` pode re-renderizar (StrictMode, Fast Refresh, um efeito mal dependenciado), lembre que `init()` **não é idempotente**: cada chamada registra um novo listener por cima do anterior.

**Regra prática para SPA:** garanta que o container do botão já está no DOM no exato momento em que `AppmaxScripts.init(...)` é chamado — nunca o contrário.

---

## Inicializando com os callbacks do Apple Pay

Para Apple Pay, o `init` exige `externalId`, `onUpdate` e `onAuthorize` (além de `onSuccess`/`onError`, sempre obrigatórios). A referência completa de cada parâmetro está em [Appmax JS → Inicializar o AppmaxScripts](../../primeiros_passos/appmax_js.md#como-usar); aqui o foco é como esses três se conectam ao fluxo de Apple Pay especificamente.

```html
<div class="appmax-apple-pay-btn"></div>

<script>
  // onUpdate: chamado quando o usuário muda algo na PaymentSheet
  // (frete, parcelas). Deve retornar os dados atuais do checkout.
  const onUpdate = () => getCheckoutData();

  // onAuthorize: chamado quando o pagamento é autorizado pelo usuário.
  // Recebe o Apple Token — o cartão tokenizado, pronto para
  // POST /v1/payments/apple-pay (veja o link acima para o payload completo).
  const onAuthorize = async (appleToken) => {
    await processarPagamento(appleToken);
  };

  const onSuccess = (data) => { /* ip coletado, se aplicável */ };
  const onError = (err) => console.error('Erro no Apple Pay:', err);

  window.AppmaxScripts.init(onSuccess, onError, externalId, onUpdate, onAuthorize);
</script>
```

> **Ordem e nomes dos parâmetros**
>
> `init(onSuccess, onError, externalId, onUpdate, onAuthorize)` — nessa ordem. Trocar `onUpdate` e `onAuthorize` de posição, ou escrever `onAutorize`, faz o SDK tratar o parâmetro errado como função de callback.
O `externalId` é o mesmo `external_id` retornado com HTTP 200 na etapa de [instalação do aplicativo](../../aplicativos/fluxo_instalacao.md#health-check) — sem ele, `init` lança exceção síncrona (veja o aviso em [Appmax JS](../../primeiros_passos/appmax_js.md#como-usar)).

---

## Do clique ao pagamento

1. O usuário clica no botão → o SDK abre a `ApplePaySession` (PaymentSheet do Safari) e valida o merchant automaticamente — você não chama nenhum endpoint para isso.
2. Se o usuário muda frete, parcelas ou item no meio do caminho, a Apple chama seu `onUpdate` para atualizar o total exibido.
3. Ao confirmar (Face ID/Touch ID), o SDK chama o seu `onAuthorize(appleToken)`.
4. No `onAuthorize`, com o `appleToken` em mãos: crie o customer, crie a order e efetive o pagamento em `POST /v1/payments/apple-pay` — o mapeamento completo de `appleToken` → payload está na seção "Processar o pagamento" de [Pagamento com Apple Pay](apple_pay.md).

---

## Troubleshooting rápido

| Sintoma | Causa provável |
| --- | --- |
| Botão não aparece | Fora do Safari, ou dispositivo sem cartão configurado no Apple Wallet. Confirme com `ApplePaySession.canMakePayments()`. |
| Clique não faz nada, sem erro | O botão foi montado **depois** do `init` (SPA) — veja "Ordem de carregamento" acima. |
| `init()` lança `Error: External ID is required...` | `externalId` ausente ou inválido — é uma exceção síncrona, não passa por `onError`. |
| Erro genérico do Safari ao confirmar (ex.: `DOMException`) | Sessão do merchant inválida — confira se o domínio tem o `.well-known` publicado ([guia](apple_pay_dominio.md)) e se o `external_id` é o mais recente da instalação. |
| Funciona em uma loja e não em outra, mesmo código | Domínio da segunda loja não foi informado na instalação (`domain_name`) ou não tem o `.well-known` publicado. |

Não é possível testar o fluxo completo em `localhost` — veja [Testes e Sandbox](apple_pay.md#testes-e-sandbox) para os detalhes de ambiente.

## Veja Também

- [Index Master](../../index_master.md)
- [Visao Geral](visao_geral.md)
- [Cartao Credito](cartao_credito.md)
- [Pix](pix.md)
