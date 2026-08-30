---
title: GPT Actions (Custom GPTs e Especificação OpenAPI)
description: Como criar GPT Actions para Custom GPTs, integração com especificações OpenAPI 3.0, autenticação (API Key, OAuth) e envio/retorno de arquivos.
topics:
  - gpt-actions
  - custom-gpts
  - openapi-spec
  - actions-auth
keywords:
  - GPT Actions
  - Custom GPTs
  - OpenAPI 3.0
  - schema
  - OAuth 2.0
related:
  - ../chatgpt_e_plugins/chatgpt_plugins_apps_sdk.md
  - ../ferramentas_e_mcp/function_calling.md
source_scope:
  - https://developers.openai.com/api/docs/actions/introduction.md
  - https://developers.openai.com/api/docs/actions/getting-started.md
  - https://developers.openai.com/api/docs/actions/authentication.md
  - https://developers.openai.com/api/docs/actions/sending-files.md
  - https://developers.openai.com/api/docs/actions/production.md
---

# GPT Actions (Custom GPTs e Especificação OpenAPI)

As **GPT Actions** permitem conectar **Custom GPTs** (GPTs personalizados no ChatGPT) a APIs REST corporativas ou de terceiros através de um contrato padronizado em **OpenAPI 3.0 / 3.1**.

---

## 1. Estrutura do Esquema OpenAPI para uma Action

```yaml
openapi: 3.1.0
info:
  title: API de Gestão de Clientes
  description: Consulta e criação de tickets de clientes no CRM interno.
  version: 1.0.0
servers:
  - url: https://crm.minhaempresa.com/api/v1
paths:
  /tickets:
    get:
      operationId: listarTickets
      summary: Lista tickets abertos para um cliente
      parameters:
        - name: email
          in: query
          required: true
          schema:
            type: string
          description: E-mail do cliente para busca
      responses:
        '200':
          description: Lista de tickets encontrados
          content:
            application/json:
              schema:
                type: object
                properties:
                  total:
                    type: integer
                  tickets:
                    type: array
                    items:
                      type: object
                      properties:
                        id:
                          type: string
                        status:
                          type: string
                        assunto:
                          type: string
    post:
      operationId: criarTicket
      summary: Cria um novo ticket de suporte
      requestBody:
        required: true
        content:
          application/json:
            schema:
              type: object
              properties:
                email:
                  type: string
                assunto:
                  type: string
                descricao:
                  type: string
              required:
                - email
                - assunto
                - descricao
      responses:
        '201':
          description: Ticket criado com sucesso
```

---

## 2. Tipos de Autenticação Suportados

1. **Nenhuma Autenticação**: Para APIs públicas.
2. **API Key**: Chave estática passada via cabeçalho HTTP (ex.: `X-API-Key` ou `Authorization: Bearer <key>`).
3. **OAuth 2.0 (Recomendado para dados de usuários)**:
   - Suporte a Authorization Code Grant com PKCE.
   - O usuário realiza login na sua aplicação através de uma janela segura no ChatGPT antes que o GPT faça requisições em seu nome.

---

## 3. Envio e Retorno de Arquivos com GPT Actions

- **Uploads de Arquivo**: APIs podem receber arquivos enviados pelo usuário no ChatGPT utilizando `multipart/form-data` ou URLs pré-assinadas (*presigned URLs*).
- **Downloads / Retorno de Arquivos**: APIs podem retornar binários (PDF, XLSX) acompanhados do cabeçalho `Content-Disposition: attachment; filename="relatorio.pdf"`, permitindo que o ChatGPT disponibilize um link de download direto para o usuário.

---

## 4. Diretrizes de Produção para GPT Actions

> [!IMPORTANT]
> 1. **Timeouts**: APIs de GPT Actions possuem timeout rígido de **45 segundos** por chamada. Para tarefas lentas, adote polling assíncrono.
> 2. **Políticas de Privacidade**: Todo GPT público com Action deve disponibilizar uma URL válida de Política de Privacidade.
> 3. **Conformidade de Esquema**: `operationId` deve ser único, camelCase e conter uma descrição semântica clara do que a rota executa.

---

## 5. Referências Cruzadas

- [`../chatgpt_e_plugins/chatgpt_plugins_apps_sdk.md`](../chatgpt_e_plugins/chatgpt_plugins_apps_sdk.md)
- [`../ferramentas_e_mcp/function_calling.md`](../ferramentas_e_mcp/function_calling.md)
