---
title: "Publicação em Produção e Checklist Go-Live"
description: "Checklist completo de homologação e passos para migrar aplicativos e integrações para o ambiente de produção."
topics:
  - go-live
  - producao
  - homologacao
  - publicacao
  - checklist
keywords:
  - publicacao
  - producao
  - checklist
  - go live
  - aprovacao de app
  - troca de chaves
related:
  - ../index_master.md
  - criar_aplicativo.md
  - validar_url_instalacao.md
  - implementar_url_validacao.md
source_scope:
  - https://docs.appmax.com.br/guides/publicacao-producao
---

# Publicação em produção

Este guia cobre todo o processo para migrar sua integração do ambiente de sandbox para produção — do checklist técnico ao fluxo de homologação e ativação.

## Visão geral

A publicação em produção envolve três partes:

1. **Checklist técnico** — validar que sua integração está completa e resiliente no sandbox.
2. **Homologação** — validação pela equipe Appmax de que sua integração funciona corretamente.
3. **Ativação em produção** — publicação do aplicativo e emissão das credenciais de produção.

> **O processo de homologação é atualmente conduzido **via e-mail** pela equipe Appmax. Este guia mostra como preparar sua integração para que a homologação seja rápida e sem retrabalho.**
>
>
> **Apenas aplicativos públicos passam por homologação**
>
> Aplicativos **privados** não precisam de homologação — são publicados diretamente após o checklist técnico. O fluxo de homologação descrito nesta página se aplica apenas a aplicativos **públicos**.
## Pré-requisitos

Antes de solicitar a publicação em produção, confirme que sua integração sandbox atende a todos os itens abaixo.

### Fluxo de instalação

- [ ] O fluxo completo em 4 etapas (`/oauth2/token` → `/app/authorize` → redirect → `/app/client/generate`) está implementado e funcionando no sandbox.
- [ ] Sua **URL de validação** (health check) está publicamente acessível, retorna **HTTP 200** e um `external_id` em formato UUID válido.
- [ ] Sua URL de validação responde em menos de **5 segundos** (timeout da Appmax).
- [ ] Você armazena o `external_id` de cada instalação no seu banco de dados.
- [ ] Você armazena as credenciais do merchant (`client_id` e `client_secret`) de forma segura por instalação.

### Webhooks

- [ ] Sua URL de webhook está publicamente acessível e retorna **HTTP 200** para todos os eventos esperados.
- [ ] Você processa webhooks de forma **idempotente** (reentregas são possíveis).
- [ ] Você responde ao webhook em menos de **5 segundos** — processamento pesado deve ser assíncrono.
- [ ] Você trata os eventos relevantes do seu caso de uso (pagamento, estorno, cancelamento, etc.).

### Operação na API

- [ ] Você diferencia corretamente **credenciais do app** (instalação) e **credenciais do merchant** (transações em `/v1/*`).
- [ ] Você trata a expiração do token (1 hora) solicitando um novo quando necessário.
- [ ] Você respeita o [rate limit](../guias_e_recursos/rate_limit.md) (burst 50/s, sustentado 5/s).
- [ ] Você trata os principais códigos HTTP (401, 422, 429, 5xx) com retry e backoff adequados.
- [ ] Valores monetários são sempre enviados como **inteiros em centavos** (nunca float).

### Segurança

- [ ] As URLs (host, validação, webhook) estão usando **HTTPS** com certificado válido.
- [ ] Credenciais (`client_secret`) **não** estão versionadas no código.
- [ ] Logs **não** expõem credenciais, tokens ou dados sensíveis do cliente (CPF, cartão).

### Testes em sandbox

- [ ] Instalação completa testada ponta a ponta em sandbox.
- [ ] Ao menos um pedido criado e pago em sandbox (use os [cartões de teste](../api/pagamentos/cartao_credito.md#cartoes-de-teste)).
- [ ] Webhooks recebidos e processados em sandbox para os principais eventos.
- [ ] Cenários de erro testados (cartão recusado, hash inválido, token expirado).

## Solicitando a publicação

Com todos os itens acima validados, envie um e-mail para **integracoes@appmax.com.br** solicitando a homologação e publicação do seu aplicativo. Incluir as informações a seguir agiliza o processo.

### Informações para incluir no e-mail

```
Assunto: Solicitação de publicação em produção - [Nome do app]

Olá, equipe Appmax!

Concluímos os testes em sandbox e gostaríamos de publicar nosso aplicativo em produção.

**Informações do aplicativo**
- Nome do app: [...]
- App UUID: [...]
- App Numerical ID: [...]
- Tipo: [público / privado]
- Categoria: [...]

**URLs de produção**
- Host: https://[...]
- URL de validação (health check): https://[...]
- URL de webhook: https://[...]
- URL de callback (url_callback): https://[...]

**Checklist técnico**
- [x] Fluxo de instalação completo e testado em sandbox
- [x] URL de validação respondendo HTTP 200 com external_id (UUID) em < 5s
- [x] URL de webhook respondendo HTTP 200 em < 5s
- [x] Integração idempotente e resiliente a retries
- [x] Testes de pagamento, webhook e erro completados em sandbox

**Caso de uso**
[Descreva brevemente o que o app faz e quem são os merchants que vão usá-lo.]
```

> **Quanto mais informação você fornecer de uma vez, mais rápido é o retorno. Evite envios incrementais como "envio as URLs depois" — a equipe precisa de tudo para conseguir homologar.**
>
>
## Homologação

A equipe Appmax vai:

1. **Revisar** as informações enviadas e o comportamento do seu app no sandbox.
2. **Testar** manualmente o fluxo de instalação e as transações.
3. **Validar** que a URL de validação, webhooks e credenciais estão operando corretamente.
4. **Publicar** o aplicativo quando tudo estiver aprovado.

Durante a homologação, a equipe pode solicitar ajustes (ex.: melhorar tratamento de erro, ajustar timeout). Mantenha o ambiente sandbox disponível até a aprovação final.

### Cenários de teste avaliados

A lista abaixo resume os cenários essenciais avaliados durante a homologação. Testá-los previamente em sandbox agiliza o processo — outros testes podem ser feitos, mas verificar estes primeiro aumenta a assertividade.

**Validações gerais**

- [ ] Logo do aplicativo
- [ ] Descrição do aplicativo
- [ ] E-mail de suporte
- [ ] Instalação do aplicativo

**Compra e estorno — testar com CPF e com CNPJ**

| Cenário | Cartão c/ juros | Cartão s/ juros | Pix | Boleto |
| --- | :-: | :-: | :-: | :-: |
| Compra | ☐ | ☐ | ☐ | ☐ |
| Estorno total | ☐ | ☐ | ☐ | ☐ |
| Estorno parcial | ☐ | ☐ | ☐ | ☐ |

**Outros cenários**

- [ ] Soft descriptor nas compras de cartão
- [ ] Integração do código de rastreio
- [ ] IP registrado nos pedidos
- [ ] Compra com cupom de desconto
- [ ] Compra com frete + juros
- [ ] Compra com frete + cupom de desconto
- [ ] Compra com mais de um produto diferente no carrinho
- [ ] Compra com múltiplas unidades do mesmo produto
- [ ] Atualização de status dos pedidos

> **Se seu app não for voltado ao processamento de pagamentos pela Appmax, os cenários acima podem ser desconsiderados — a análise segue outros critérios.**
>
>
## O que muda em produção

| Item | Sandbox | Produção |
| ---- | ------- | -------- |
| Autenticação | `https://auth.sandboxappmax.com.br` | `https://auth.appmax.com.br` |
| API | `https://api.sandboxappmax.com.br` | `https://api.appmax.com.br` |
| Redirect de autorização | `https://breakingcode.sandboxappmax.com.br/appstore/integration/HASH` | `https://admin.appmax.com.br/appstore/integration/HASH` |
| Credenciais | Recebidas no início dos testes | Emitidas após homologação |
| Cartões aceitos | Apenas [cartões de teste](../api/pagamentos/cartao_credito.md#cartoes-de-teste) | Cartões reais |
| Pix/boleto | Simulados | Reais, com cobrança efetiva |
| Webhooks | Enviados para a URL de sandbox | Enviados para a URL de produção |

> **Atualize **todas as URLs** da sua integração ao migrar para produção — não apenas a de API. URLs de autenticação, redirect e as configuradas no painel (host, validação, webhook) também mudam.**
>
>
## Após a publicação

Depois que seu app for publicado, recomendamos:

- [ ] Configurar **monitoramento** nas URLs de validação e webhook (uptime, latência, erros).
- [ ] Configurar **alertas** para falhas no health check e picos de 5xx.
- [ ] Acompanhar a **taxa de entrega de webhook** nos primeiros dias.
- [ ] Manter as **credenciais em secret manager** (AWS Secrets Manager, Vault, etc.), não em variáveis de ambiente simples.
- [ ] Preparar um runbook para **rotação de credenciais** em caso de vazamento.

## Troubleshooting

### "Enviei o e-mail de homologação e não recebi retorno"

Verifique:

1. Se o e-mail foi enviado para **integracoes@appmax.com.br**.
2. Se não caiu no spam da caixa de retorno.
3. Se você incluiu todas as informações do checklist (apps sem dados completos ficam em fila).

Se mesmo assim não houver retorno, envie um follow-up **respondendo ao e-mail original** (não crie thread nova) e inclua um resumo do que já foi validado. Para dúvidas gerais durante a integração (fora do processo de homologação em si), use **desenvolvedores@appmax.com.br**.

### "Estou recebendo 401 em produção com credenciais que funcionavam em sandbox"

As credenciais de sandbox **não funcionam em produção**. Após a homologação, você receberá **credenciais novas** específicas de produção. Substitua em todas as chaves do seu sistema:

- `client_id` e `client_secret` do app
- `client_id` e `client_secret` do merchant (serão regeneradas na primeira instalação em produção)

### "Meu app foi publicado, mas a primeira instalação real falhou"

Comportamento mais comum:

- A URL de validação em produção não está acessível publicamente.
- A URL de webhook em produção retorna erro para eventos reais (problema que não apareceu em sandbox por volume menor).

Verifique logs, firewall e regras de IP. Ver [Troubleshooting de instalação](fluxo_instalacao.md#troubleshooting) para mais detalhes.

### "Não consigo mais acessar as credenciais antigas"

Credenciais de produção são emitidas **uma única vez** após a homologação. Armazene com segurança. Se perder:

1. Use o painel Appmax para solicitar regeneração (pode invalidar integrações ativas).
2. Entre em contato com **desenvolvedores@appmax.com.br** para orientação.

## Próximos passos

- [Monitorar rate limit](../guias_e_recursos/rate_limit.md) — configure alertas antes de atingir os limites.
- [Entender status de pedidos](../fundamentos/status_pedidos.md) — para correlacionar eventos em produção.
- [Revisar webhooks](../guias_e_recursos/webhooks.md) — garantir que todos os eventos relevantes estão sendo consumidos.

## Veja Também

- [Index Master](../index_master.md)
- [Criar Aplicativo](criar_aplicativo.md)
- [Validar Url Instalacao](validar_url_instalacao.md)
- [Implementar Url Validacao](implementar_url_validacao.md)
