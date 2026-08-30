---
title: "FAQ Geral da API Appmax"
description: "Perguntas frequentes sobre integração, credenciais, suporte, erros comuns e boas práticas operacionais."
topics:
  - faq
  - duvidas-frequentes
  - troubleshooting-geral
keywords:
  - faq
  - duvidas
  - erros comuns
  - suporte
  - boas praticas
  - credenciais invalidas
related:
  - ../index_master.md
  - webhooks.md
  - rate_limit.md
  - calculo_parcelas.md
source_scope:
  - https://docs.appmax.com.br/guides/faq
---

# FAQ

## Credenciais

> **Qual a diferença entre as credenciais do app e as credenciais do merchant?**
>
> São dois pares de `client_id` e `client_secret` com finalidades completamente diferentes:
>
> | | Credenciais do app | Credenciais do merchant |
> | --- | --- | --- |
> | **Obtidas em** | Painel do desenvolvedor, ao criar o app | Retornadas por `/app/client/generate` |
> | **Servem para** | Fluxo de instalação apenas | Operações transacionais (clientes, pedidos, pagamentos) |
> | **Quantas existem** | 1 par por app | 1 par por merchant que instalou o app |
>
> Ambas usam o mesmo endpoint de autenticação (`POST /oauth2/token`), mas o token gerado terá permissões diferentes. Se você recebe `401` ao criar clientes ou pedidos, provavelmente está usando as credenciais do app em vez das do merchant.
>
> Consulte o [guia de autenticação](../primeiros_passos/autenticacao.md) para mais detalhes.
> **Posso usar as credenciais do app para criar pedidos?**
>
> **Não.** As credenciais do app (`client_id` e `client_secret` obtidos ao criar o aplicativo) servem exclusivamente para o fluxo de instalação. Para criar clientes, pedidos e pagamentos, você precisa das credenciais do merchant, que são geradas ao final do fluxo de instalação via `POST /app/client/generate`.
## Autenticação e tokens

> **Qual o tempo de validade do token JWT?**
>
> O token de acesso à API (JWT) tem validade de **1 hora**.
>
> O `client_id` e `client_secret` nunca são alterados. Só é possível gerar novos realizando novas instalações e desativar os atuais realizando a desinstalação.
> **O que fazer quando ocorrer erro 403 na rota /oauth2/token?**
>
> Esse erro ocorre quando a chamada está sendo feita no endpoint incorreto. A rota de autenticação é separada da API:
>
> - **Autenticação:** `https://auth.sandboxappmax.com.br/oauth2/token`
> - **API:** `https://api.sandboxappmax.com.br`
>
> Exemplo correto:
>
> ```bash
curl --location 'https://auth.sandboxappmax.com.br/oauth2/token' \
--header 'Content-Type: application/x-www-form-urlencoded' \
--data-urlencode 'grant_type=client_credentials' \
--data-urlencode 'client_id=CLIENT_ID' \
--data-urlencode 'client_secret=CLIENT_SECRET'
```
> **Recebi 401 ao chamar a API. O que pode ser?**
>
> As causas mais comuns de erro `401`:
>
> 1. **Credenciais erradas:** você está usando as credenciais do app em vez das do merchant (ou vice-versa).
> 2. **Token expirado:** o token JWT tem validade de 1 hora. Gere um novo com as mesmas credenciais.
> 3. **Token do app em rota transacional:** se está chamando rotas de clientes, pedidos ou pagamentos, use o token gerado com as credenciais do merchant.
>
> Consulte a [tabela de erros comuns](../primeiros_passos/autenticacao.md#erros-comuns-com-credenciais) para diagnóstico rápido.
> **O que fazer quando ocorrer erro 401 ao criar o customer?**
>
> Verifique:
>
> 1. Se o token está válido e não está expirado.
> 2. Se o token utilizado foi gerado com as **credenciais do merchant** (não do aplicativo) após o processo de instalação.
## Instalação do aplicativo

> **O que fazer quando ocorrer o erro 500 na autenticação do app?**
>
> Esse erro geralmente acontece quando o fluxo de instalação não é seguido corretamente, específicamente quando falta o passo de redirecionamento e autorização.
>
> O fluxo correto é:
>
> 1. **Obter o token do aplicativo:** `POST https://auth.sandboxappmax.com.br/oauth2/token`
> 2. **Gerar o hash de autorização:** `POST https://api.sandboxappmax.com.br/app/authorize`
> 3. **Redirecionar o usuário:** `https://breakingcode.sandboxappmax.com.br/appstore/integration/HASH`
> 4. **Gerar as credenciais do merchant:** `POST https://api.sandboxappmax.com.br/app/client/generate`
>
> O erro ocorre quando falta o redirecionamento para o passo de autorização (etapa 3).
> **Como a integração identifica a loja que está fazendo a instalação?**
>
> A identificação ocorre por meio do login do usuário na plataforma externa.
>
> Ao clicar em "Instalar", um token é gerado via `POST https://api.appmax.com.br/app/authorize`. O merchant é redirecionado para `https://admin.appmax.com.br/appstore/integration/TOKEN_GERADO`, onde informa o nome da loja e seleciona a empresa cadastrada na Appmax.
>
> Após a autorização, o hash é utilizado para gerar as credenciais via `POST https://api.appmax.com.br/app/client/generate`.
>
> **Atenção:** O hash pode ser utilizado apenas uma vez, porém as credenciais geradas são válidas indefinidamente, até que o aplicativo seja desinstalado.
> **Qual a diferença entre external_key e external_id?**
>
> | Campo           | Quem define                                                       | Uso                                                                                  | Pode repetir? |
> | --------------- | ----------------------------------------------------------------- | ------------------------------------------------------------------------------------ | ------------- |
> | `external_key`  | Plataforma externa / sistema do lojista                           | Identificar a origem da instalação                                                   | Sim           |
> | `external_id`   | Gerado pelo integrador no health check da [URL de validação](../aplicativos/fluxo_instalacao.md#health-check) | UUID que vincula a instalação à loja; depois é usado como `external-id` na CDN | Não           |
>
> **Não podem ser o mesmo**, pois cada campo tem uma finalidade distinta:
> - `external_key`: identifica a origem no contexto da plataforma/cliente.
> - `external_id`: confirmação da instalação do aplicativo.
>
> Para o uso do `external_id` depois da instalação (header `external-id` em chamadas da CDN, parâmetro do `AppmaxScripts.init`), veja [`external-id`](../fundamentos/external_id.md).
## Webhooks

> **Quais os erros de webhook e o significado?**
>
> | Código | Causa                                     |
> | ------ | ----------------------------------------- |
> | `502`  | URL de webhook cadastrada incorretamente  |

## Veja Também

- [Index Master](../index_master.md)
- [Webhooks](webhooks.md)
- [Rate Limit](rate_limit.md)
- [Calculo Parcelas](calculo_parcelas.md)
